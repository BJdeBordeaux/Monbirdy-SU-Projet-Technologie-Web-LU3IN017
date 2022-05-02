const express = require("express");
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const bcrypt = require('bcrypt');
const fs = require('fs');

const router = express.Router();
const saltRounds = 10;

// req.body.id : json request body
// req.params.id : id represented by "/:id"

// find a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ?
            await User.findById(userId) :
            await User.findOne({
                username: username
            });
        const {
            followings,
            followers,
            password,
            updatedAt,
            ...other
        } = user._doc; // model._doc : show all information

        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a user (not yet fully implemented)
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const userId = await User.findById(req.params.id);
            // delete all posts
            const posts = await Post.deleteMany({
                userId: userId._id
            });
            // delete all comments
            const comments = await Comment.deleteMany({
                userId: userId._id
            });
            // delete profile photo
            if (userId.profilePhoto) {
                fs.unlinkSync(`public/images/${userId.profilePhoto}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            // delete cover photo
            if (userId.coverPhoto) {
                fs.unlinkSync(`public/images/${userId.coverPhoto}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            // delete the user
            await userId.remove();
            return res.status(200).json("delete successfully.");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can only delete your account!");
    }
});

// update a user
router.put("/:id", async (req, res) => {
    if (req.session.user) {
        // pre-process if update password 
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(saltRounds);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        // if update profile photo, delete the old one
        if (req.body.profilePhoto) {
            try {
                const user = req.session.user;
                console.log(user);
                if (user.profilePhoto) {
                    const oldProfilePhoto = user.profilePhoto;
                    const oldProfilePhotoPath = `public/images/${oldProfilePhoto}`;
                    console.log(oldProfilePhotoPath);
                    fs.unlink(oldProfilePhotoPath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        // if update cover photo, delete the old one
        if (req.body.coverPhoto) {
            try {
                const user = req.session.user;
                console.log(user);
                if (user.coverPhoto) {
                    const oldCoverPhoto = user.coverPhoto;
                    const oldCoverPhotoPath = `public/images/${oldCoverPhoto}`;
                    console.log(oldCoverPhotoPath);
                    // verify if the photo exists
                    fs.unlink(oldCoverPhotoPath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        // update
        try {
            const user = await User.findByIdAndUpdate(req.session.user._id, {
                $set: req.body // if not set, set it to req.body
            });
            req.session.user = user;
            res.status(200).json(user);

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Please log in to update your profile!");
    }
});

// get all followings
router.get("/:id/followings", async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const followings = await Promise.all(
            user.followings.map(async (followingId) => {
                const following = await User.findById(followingId);
                const {
                    _id,
                    username,
                    profilePhoto
                } = following._doc;
                return {
                    _id,
                    username,
                    profilePhoto
                };
            })
        );
        res.status(200).json(followings);
    } catch (err) {
        return res.status(500).json(err);
    }
});

// follow/unfollow a user
router.put("/:id/followings", async (req, res) => {
    if (req.body.userId !== req.session.user._id) {
        try {
            if (req.body.userId !== req.session.user._id) {
                const user = await User.findById(req.session.user._id);
                const following = await User.findById(req.body.userId);
                // add following to user's followings[] and 
                // add user to following's followers[] 
                if (!user.followings.includes(req.body.userId)) {
                    await user.updateOne({
                        $push: {
                            followings: req.body.userId
                        }
                    });
                    await following.updateOne({
                        $push: {
                            follower: req.session.user._id
                        }
                    });
                    res.status(200).json("followed!")
                }
                // delete following from user's followings[] and
                // delete user from following's followers[]
                else {
                    await user.updateOne({
                        $pull: {
                            followings: req.body.userId
                        }
                    });
                    await following.updateOne({
                        $pull: {
                            follower: req.session.user._id
                        }
                    });
                    res.status(200).json("unfollowed!")
                }
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can not follow yourself.");
    }
});


module.exports = router;