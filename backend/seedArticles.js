import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js';
import User from './models/User.js';

dotenv.config();

const dummyArticles = [
  { title: "React 19 is here: What you need to know", content: "The new React compiler is changing how we think about memoization. Here's a quick breakdown of hooks you won't need anymore.", category: "Coding", tags: ["react", "javascript", "frontend"] },
  { title: "The End of the Junior Developer?", content: "With the rise of GenAI and tools like Copilot, where do entry-level jobs fit in? I suspect we're moving towards 'Junior Architects'.", category: "Trending Now", tags: ["career", "ai"] },
  { title: "Mastering Flexbox in 2 Minutes", content: "Still using floats? Here's the absolute fastest way to center a div and build modern layouts without pulling your hair out.", category: "Coding", tags: ["css", "design"] },
  { title: "How I grew my SaaS to $5k MRR", content: "It took 12 months, 4 failed launches, and a lot of cold emails. Sharing my exact customer acquisition strategy for indie hackers.", category: "Business", tags: ["saas", "startup"] },
  { title: "Design tokens are the future of UI", content: "Hardcoding hex values is out. Semantic design tokens are in. How our team migrated a massive legacy codebase to a scalable design system.", category: "Design", tags: ["ui", "ux", "css"] },
  { title: "Why Next.js might be overkill for your blog", content: "You don't need a full-stack framework running on edge functions just to serve markdown files to 100 people a month. Let's talk about alternatives.", category: "Coding", tags: ["nextjs", "webdev"] },
  { title: "The Psychology of Pricing", content: "Why $9.99 converts 30% better than $10.00, and other simple tricks to optimize your checkout flow.", category: "Marketing", tags: ["psychology", "sales"] },
  { title: "Rust vs Go: A Backend Perspective", content: "After building microservices in both, here's my honest take on the developer experience, memory safety, and compile times.", category: "Coding", tags: ["rust", "golang", "backend"] },
  { title: "Stop using localStorage for auth tokens", content: "A quick security PSA: XSS attacks are real. Move your JWTs into httpOnly cookies today.", category: "Coding", tags: ["security", "auth"] },
  { title: "My favorite VS Code extensions of 2024", content: "From Error Lens to GitLens, here are the 7 extensions that save me at least an hour a day.", category: "Coding", tags: ["tools", "productivity"] },
  { title: "Building a cult brand", content: "Look at Apple or Liquid Death. They don't just sell products, they sell an identity. How to apply this to your startup.", category: "Marketing", tags: ["branding"] },
  { title: "The death of the cookie", content: "With third-party cookies going away, how are marketers supposed to track attribution? The answer: Zero-party data.", category: "Marketing", tags: ["tracking", "data"] },
  { title: "Figma tips for developers", content: "You don't need to be a designer, but knowing how to properly extract assets and read auto-layout will make you a 10x frontend dev.", category: "Design", tags: ["figma", "frontend"] },
  { title: "Is TypeScript worth the overhead?", content: "Yes. End of post. But seriously, the reduction in runtime errors far outweighs the setup time.", category: "Coding", tags: ["typescript", "javascript"] },
  { title: "MongoDB vs PostgreSQL in 2024", content: "Document DBs are great for rapid prototyping, but relational data always wins at scale. Here is my rule of thumb.", category: "Coding", tags: ["database", "backend"] },
  { title: "Dark mode implementation guide", content: "Don't just invert your colors. Use CSS variables to create cohesive, accessible dark themes.", category: "Design", tags: ["css", "accessibility"] },
  { title: "The Solo Founder's Guide to Marketing", content: "You built the app, but no one is coming. Here is how to get your first 100 users without spending a dime on ads.", category: "Business", tags: ["marketing", "growth"] },
  { title: "Understanding WebSockets", content: "Tired of polling your API every 3 seconds? Real-time data is easier to implement than you think.", category: "Coding", tags: ["websockets", "realtime"] },
  { title: "Clean Code is subjective", content: "What one dev calls 'elegant abstraction', another calls 'unreadable spaghetti'. Readability beats cleverness every time.", category: "Trending Now", tags: ["cleancode", "engineering"] },
  { title: "Leveraging SEO starting day one", content: "If you wait until you launch to think about SEO, you're already 6 months behind. Start building topical authority now.", category: "Marketing", tags: ["seo", "growth"] },
  { title: "Micro-interactions matter", content: "The difference between a good app and a great app is in the details. Add subtle hover states and transitions.", category: "Design", tags: ["ui", "animation"] },
  { title: "How to handle burnout", content: "Coding 12 hours a day isn't a badge of honor, it's a recipe for disaster. Take breaks. Go outside.", category: "Trending Now", tags: ["health", "mentalhealth"] },
  { title: "Docker simplified", content: "Still getting 'It works on my machine' errors? Here is a 5-minute intro to containerizing your Node apps.", category: "Coding", tags: ["docker", "devops"] },
  { title: "Pricing models compared", content: "Freemium vs Free Trial vs Usage-based. Which one is right for your B2B SaaS?", category: "Business", tags: ["pricing", "saas"] },
  { title: "The power of whitespace", content: "Stop cramming things together. Let your layout breathe. Whitespace is a powerful design tool.", category: "Design", tags: ["ui", "layout"] },
  { title: "GraphQL vs REST", content: "When to use which. Overfetching is bad, but sometimes the complexity of GraphQL just isn't worth it.", category: "Coding", tags: ["api", "architecture"] },
  { title: "Building an audience on Twitter", content: "Share your process, be authentic, and engage with others. The playbook for devrel and founders.", category: "Marketing", tags: ["socialmedia", "audience"] },
  { title: "Niche down to scale up", content: "Stop trying to build a product for everyone. Find a tiny, underserved niche, and dominate it.", category: "Business", tags: ["strategy", "niche"] },
  { title: "Why accessibility is not a feature", content: "Building for a11y from the start is easier than retrofitting it. Screen readers rely on semantic HTML.", category: "Design", tags: ["a11y", "inclusion"] },
  { title: "The 80/20 rule in software", content: "80% of the value comes from 20% of the code. Ship the MVP, gather feedback, iterate.", category: "Trending Now", tags: ["agile", "shipping"] }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/conotes');
    console.log('MongoDB connected for seeding');

    // Make sure we have at least one user to own the articles
    let user = await User.findOne();
    if (!user) {
        user = await User.create({
            username: 'admin_seed',
            name: 'Co-Notes Admin',
            email: 'adminseed@example.com',
            password: 'password123'
        });
        console.log('Created fallback user for seeding');
    }

    // Insert dummy articles
    let count = 0;
    for (const data of dummyArticles) {
      // Simulate random likes/reads
      const randomLikes = Math.floor(Math.random() * 150);
      const randomReads = Math.floor(Math.random() * 5) + 2;

      // Mock an array of dummy objectIDs for likes to match the length
      const likesArray = Array(randomLikes).fill(user._id);

      await Article.create({
        ...data,
        userId: user._id,
        published: true,
        readTime: randomReads,
        likes: likesArray,
        allowComments: true
      });
      count++;
    }

    console.log(`Successfully seeded ${count} dummy articles!`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDB();
