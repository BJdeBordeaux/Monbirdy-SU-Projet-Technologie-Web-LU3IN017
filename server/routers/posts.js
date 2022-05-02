const express = require("express");
const {
    status
} = require("express/lib/response");
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

const router = express.Router();

// create a post
router.post("/:id", async (req, res) => {
    try {
        const newPost = await new Post({
            userId: req.session.user._id,
            ...req.body
        });
        const savedPost = await newPost.save(); // database operation should begin with `await`
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(err);
    }
});

// find a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a post
router.delete("/:id", async (req, res) => {
    try {
        console.log(req.session.user, req.params.id);
        const deletedPost = await Post.findById(req.params.id);
        // verify if the post exists
        if (!deletedPost) 
            return res.status(404).json("Post not found");
        // verify if the user is the author of the post
        if (req.session.user._id !== deletedPost.userId || req.body.isAdmin === true) {
            return res.status(403).json("you can only delete your own post!");
        }
        // delete the photo in the server
        
        if (deletedPost.photo) {
            fs.unlink(`public/images/${deletedPost.photo}`, (err) => {
                try {
                    if (err) {
                        console.log(err);
                    }
                } catch (error) {
                    console.log(error);
                }
                    
                
            });
        }
        await deletedPost.remove();
        res.status(200).json("delete successfully.");
    } catch (err) {
        return res.status(500).json(err);
    }
});

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            const newPost = await post.updateOne({
                $set: req.body
            }); // modification information will be returned
            res.status(200).json("update success"); // post represents the post before update still 
        } else {
            res.status(403).json({
                msg: "you can only update your post!",
                bodyId: req.body.id,
                paramsId: req.params.userId
            });
        }
    } catch (err) {
        return res.status(500).json(err);
    }

});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.like.includes(req.body.userId)) {
            const newLike = await post.updateOne({
                $push: {
                    like: req.body.userId
                }
            });
            res.status(200).json("liked");
        } else {
            const newLike = await post.updateOne({
                $pull: {
                    like: req.body.userId
                }
            });
            res.status(200).json("disliked");
        }

    } catch (error) {
        res.status(500).json(error);
    }
});

// show timeline post
router.get("/timeline/:id", async (req, res) => {
    try {
        // for user it-self
        const currentUser = req.session.user;
        const currentUserPosts = await Post.find({
            userId: currentUser._id
        });

        // friends post
        const friendsPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({
                    userId: friendId
                });
            })
        );
        res.status(200).json(currentUserPosts.concat(...friendsPosts));
    } catch (error) {
        res.status(500).json(error);
    }
});

// get user's all post
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });
        const userPosts = await Post.find({
            userId: user._id
        });
        res.status(200).json(userPosts);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;