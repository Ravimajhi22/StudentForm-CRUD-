const commentModel = require("../models/commentModel");

exports.getComments = async (req, res) => {
    try {
        const comments = await commentModel.getAllComments();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment) return res.status(400).json({ error: "Comment is required" });
        const newComment = await commentModel.addComment(comment);
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
