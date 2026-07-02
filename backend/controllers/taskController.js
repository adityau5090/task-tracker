import Task from "../models/Task.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all tasks for a given user (with optional filter/sort)
// @route   GET /api/tasks?userId=...&status=...&priority=...&sort=...
export const getTasks = async (req, res) => {
  try {
    const { userId, status, priority, sort, search } = req.query;

    if (!userId || !isValidId(userId)) {
      return res.status(400).json({ message: "A valid userId is required" });
    }

    const filter = { user: userId };
    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "dueDate") sortOption = { dueDate: 1 };
    if (sort === "priority") sortOption = { priority: 1 };
    if (sort === "title") sortOption = { title: 1 };

    const tasks = await Task.find(filter).sort(sortOption);
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong while fetching tasks" });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { user, title, description, status, priority, dueDate } = req.body;

    if (!user || !isValidId(user)) {
      return res.status(400).json({ message: "A valid user id is required" });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user,
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });

    return res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    return res.status(500).json({ message: "Something went wrong while creating the task" });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const updates = (({ title, description, status, priority, dueDate }) => ({
      title,
      description,
      status,
      priority,
      dueDate,
    }))(req.body);

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    return res.status(500).json({ message: "Something went wrong while updating the task" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong while deleting the task" });
  }
};
