import Article from "../models/Article.js";
import mongoose from "mongoose";
import { moveToTrash } from "../utils/trashService.js";
import { createNotification } from "../services/notificationService.js";

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/articles/feed
export async function getFeed(req, res) {
    try {
        const { search, category, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const isTrending = category && category.toLowerCase() === "trending now";
        const actualCategory = isTrending ? null : category;

        const query = {
            published: true,
            visibility: "public",
            ...(actualCategory && actualCategory !== "all" && { 
                $or: [
                    { category: { $regex: new RegExp(`^${actualCategory}$`, "i") } },
                    { tags: { $regex: new RegExp(`^${actualCategory}$`, "i") } }
                ]
            }),
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { subtitle: { $regex: search, $options: "i" } },
                    { subcategory: { $regex: search, $options: "i" } },
                    { tags: { $in: [new RegExp(search, "i")] } }
                ]
            })
        };

        const sortOptions = isTrending ? { views: -1, publishedAt: -1 } : { publishedAt: -1 };

        const [articles, total] = await Promise.all([
            Article.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('userId', 'id name username avatar'),
            Article.countDocuments(query)
        ]);

        const formatted = articles.map(a => ({
            ...a.toJSON(),
            author: a.userId,
            userId: undefined,
            likes: a.likes.length,
            comments: a.comments.length
        }));

        return res.json({ articles: formatted, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        console.error("getFeed error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/articles/my
export async function getMyArticles(req, res) {
    try {
        const articles = await Article.find({ userId: req.userId }).sort({ updatedAt: -1 });

        const formattedArticles = articles.map(a => ({
            ...a.toJSON(),
            likes: a.likes.length,
            comments: a.comments.length
        }));

        const published = formattedArticles.filter(a => a.published);
        const drafts = formattedArticles.filter(a => !a.published);

        return res.json({ published, drafts });
    } catch (error) {
        console.error("getMyArticles error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/articles/:id
export async function getArticle(req, res) {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid article ID" });
        }

        const article = await Article.findById(req.params.id)
            .populate('userId', 'id name username avatar bio');

        if (!article) return res.status(404).json({ message: "Article not found" });

        // Increment views
        article.views += 1;
        await article.save();

        return res.json({
            ...article.toJSON(),
            author: article.userId,
            userId: undefined,
            likes: article.likes.length,
            commentsCount: article.comments.length
        });
    } catch (error) {
        console.error("getArticle error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/articles
export async function createArticle(req, res) {
    try {
        const {
            title, subtitle, content, coverImage, category, subcategory,
            tags, languages, frameworks, visibility, allowComments,
            isSeriesPart, seriesName
        } = req.body;

        if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

        // Calculate read time
        const wordCount = (content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(w => w).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        const article = await Article.create({
            title: title.trim(),
            subtitle: subtitle || null,
            content: content || "",
            coverImage: coverImage || null,
            category: category || null,
            subcategory: subcategory || null,
            tags: tags || [],
            languages: languages || [],
            frameworks: frameworks || [],
            visibility: visibility || "public",
            allowComments: allowComments !== undefined ? allowComments : true,
            isSeriesPart: isSeriesPart || false,
            seriesName: seriesName || null,
            readTime,
            userId: req.userId
        });

        await createNotification(
            req,
            req.userId,
            `Your article "${article.title}" was created as a draft.`,
            "article_created",
            `/article-detail.html?id=${article._id}`
        );

        return res.status(201).json(article);
    } catch (error) {
        console.error("createArticle error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
    try {
        const {
            title, subtitle, content, coverImage, category, subcategory,
            tags, languages, frameworks, visibility, allowComments,
            isSeriesPart, seriesName
        } = req.body;

        const article = await Article.findOne({ _id: req.params.id, userId: req.userId });
        if (!article) return res.status(404).json({ message: "Article not found" });

        if (title !== undefined) article.title = title;
        if (subtitle !== undefined) article.subtitle = subtitle;
        if (content !== undefined) {
            article.content = content;
            const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(w => w).length;
            article.readTime = Math.max(1, Math.ceil(wordCount / 200));
        }
        if (coverImage !== undefined) article.coverImage = coverImage;
        if (category !== undefined) article.category = category;
        if (subcategory !== undefined) article.subcategory = subcategory;
        if (tags !== undefined) article.tags = tags;
        if (languages !== undefined) article.languages = languages;
        if (frameworks !== undefined) article.frameworks = frameworks;
        if (visibility !== undefined) article.visibility = visibility;
        if (allowComments !== undefined) article.allowComments = allowComments;
        if (isSeriesPart !== undefined) article.isSeriesPart = isSeriesPart;
        if (seriesName !== undefined) article.seriesName = seriesName;

        await article.save();
        return res.json(article);
    } catch (error) {
        console.error("updateArticle error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
    try {
        const article = await Article.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!article) return res.status(404).json({ message: "Article not found" });

        await moveToTrash({
            userId: req.userId,
            itemType: "article",
            item: article,
            displayName: article.title,
            icon: "📰"
        });

        return res.json({ message: "Article deleted" });
    } catch (error) {
        console.error("deleteArticle error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/articles/:id/publish
export async function togglePublish(req, res) {
    try {
        const article = await Article.findOne({ _id: req.params.id, userId: req.userId });
        if (!article) return res.status(404).json({ message: "Article not found" });

        article.published = !article.published;
        if (article.published && !article.publishedAt) {
            article.publishedAt = new Date();
        }

        await article.save();

        if (article.published) {
            await createNotification(
                req,
                req.userId,
                `Your article "${article.title}" has been published successfully!`,
                "article_published",
                `/article-detail.html?id=${article._id}`
            );
        }

        return res.json({ published: article.published, publishedAt: article.publishedAt });
    } catch (error) {
        console.error("togglePublish error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/articles/:id/like
export async function toggleLike(req, res) {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const likeIndex = article.likes.findIndex(id => id.toString() === req.userId);
        if (likeIndex > -1) {
            article.likes.splice(likeIndex, 1);
            await article.save();
            return res.json({ liked: false });
        } else {
            article.likes.push(req.userId);
            await article.save();
            return res.json({ liked: true });
        }
    } catch (error) {
        console.error("toggleLike error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/articles/:id/comments
export async function getComments(req, res) {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid article ID" });
        }

        const article = await Article.findById(req.params.id)
            .populate('comments.user', 'id name username avatar');

        if (!article) return res.status(404).json({ message: "Article not found" });

        const sortedComments = article.comments.sort((a, b) => b.createdAt - a.createdAt);
        return res.json(sortedComments);
    } catch (error) {
        console.error("getComments error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/articles/:id/comments
export async function addComment(req, res) {
    try {
        const { content } = req.body;
        if (!content?.trim()) return res.status(400).json({ message: "Comment content is required" });
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid article ID" });
        }

        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });
        if (!article.allowComments) return res.status(403).json({ message: "Comments are disabled" });

        article.comments.push({
            user: req.userId,
            content: content.trim()
        });
        await article.save();

        // The newly added comment is the last one in the array
        const newComment = article.comments[article.comments.length - 1];
        await article.populate(`comments.${article.comments.length - 1}.user`, 'id name username avatar');

        return res.status(201).json(article.comments[article.comments.length - 1]);
    } catch (error) {
        console.error("addComment error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
