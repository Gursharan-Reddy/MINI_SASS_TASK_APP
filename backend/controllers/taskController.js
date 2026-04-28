const { Task } = require('../models');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = await Task.create({ title, userId: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: "Could not create task" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, userId: req.user.id } });
        
        if (!task) return res.status(404).json({ error: "Task not found" });

        task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Task.destroy({ where: { id, userId: req.user.id } });
        if (!deleted) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
};