import Todo from "../models/Todo.js";

// GET /api/todos
export async function getTodos(req, res) {
    try {
        const { filter, sortBy } = req.query;

        const query = {
            userId: req.userId,
            ...(filter === "active" && { completed: false }),
            ...(filter === "completed" && { completed: true })
        };

        let sortOption = { createdAt: -1 };
        if (sortBy === "priority") {
            // Mongoose sorting by enum string directly works alphabetically
            // For custom priority sorting we can map or rely on frontend. Let's send createdAt fallback.
            sortOption = { priority: 1, createdAt: -1 };
        } else if (sortBy === "alphabetical") {
            sortOption = { text: 1 };
        }

        const todos = await Todo.find(query).sort(sortOption);
        return res.json(todos);
    } catch (error) {
        console.error("getTodos error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/todos
export async function createTodo(req, res) {
    try {
        const { text, priority, dueDate, category } = req.body;
        if (!text?.trim()) return res.status(400).json({ message: "Task text is required" });

        const todo = await Todo.create({
            text: text.trim(),
            priority: priority || "medium",
            dueDate: dueDate ? new Date(dueDate) : null,
            category: category || "personal",
            userId: req.userId
        });

        return res.status(201).json(todo);
    } catch (error) {
        console.error("createTodo error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/todos/:id
export async function updateTodo(req, res) {
    try {
        const { text, priority, dueDate, category } = req.body;

        const updateData = {};
        if (text !== undefined) updateData.text = text;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (category !== undefined) updateData.category = category;

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        return res.json(todo);
    } catch (error) {
        console.error("updateTodo error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/todos/:id
export async function deleteTodo(req, res) {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        return res.json({ message: "Todo deleted" });
    } catch (error) {
        console.error("deleteTodo error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/todos/:id/toggle
export async function toggleComplete(req, res) {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.completed = !todo.completed;
        await todo.save();

        return res.json({ completed: todo.completed });
    } catch (error) {
        console.error("toggleComplete error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/todos/:id/star
export async function toggleStar(req, res) {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.starred = !todo.starred;
        await todo.save();

        return res.json({ starred: todo.starred });
    } catch (error) {
        console.error("toggleStar error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/todos/completed
export async function clearCompleted(req, res) {
    try {
        const result = await Todo.deleteMany({ userId: req.userId, completed: true });
        return res.json({ message: `${result.deletedCount} completed todos cleared` });
    } catch (error) {
        console.error("clearCompleted error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
