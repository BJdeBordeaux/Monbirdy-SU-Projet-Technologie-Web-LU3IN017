const express = require("express");
const {
    status
} = require("express/lib/response");
const Comment = require('../models/Comment');
const User = require('../models/User');
const fs = require('fs');

const router = express.Router();

// create a comment
router.post("/", async (req, res) => {
    try {
        const newComment = await new Comment(req.body);
        const savedComment = await newComment.save(); // database operation should begin with `await`
        res.status(200).json(savedComment);
    } catch (error) {
        res.status(500).json(error);
    }
});

// find a comment
router.get("/:id", async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// find all comments
router.get("/all/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId
        });

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a comment
router.delete("/:id", async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndRemove(req.params.id);
        res.status(200).json("comment deleted.");
    } catch (err) {
        return res.status(500).json(err);
    }
});

// delete all the comments of a post
router.delete("/all/:postId", async (req, res) => {
    try {
        // delete the photo in the server
        const deletedComments = await Comment.deleteMany({
            postId: req.params.postId
        });
        
        res.status(200).json("all comments deleted.");
    } catch (err) {
        return res.status(500).json(err);
    }
});


module.exports = router;