const Post = require("../models/post");
const { User } = require("../models/user");
const cloudinary = require("../lib/cloudinary");

// create a post
module.exports.createPost = async (req, res) => {
    try {
        if (req.file) {
            // upload to cloudinary
            const image = await cloudinary.uploader.upload(req.file.path, {
                folder: "social-media/posts",
                crop: "scale",
            });
            const user = req.user;
            let post = new Post({
                user: user.id,
                image: image.public_id,
                caption: req.body.caption,
                location: req.body.location,
            });
            await post.save();

            return res.status(200).json({
                message: "Post has been published",
                post: await post.populate("user", "-password"),
            });
        } else {
            return res.status(400).json({
                message: "Image requerd",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message });
    }
};

// get posts
module.exports.getPosts = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        // const posts = await Post.find({
        //     user: [...user.following, user._id, "6313c3fb678d49fa6111e9cf"],
        // })
        //     .populate("user", "image username followers")
        //     .sort("-createdAt");

        // get following users poss and sort by date with comments model

        const posts = await Post.aggregate([
            {
                $match: {
                    user: {
                        $in: [...user.following, user._id],
                    },
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "comments",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $project: {
                    user: {
                        _id: 1,
                        username: 1,
                        image: 1,
                    },
                    image: 1,
                    caption: 1,
                    location: 1,
                    comments: {
                        $size: "$comments",
                    },
                    likes: 1,
                    createdAt: 1,
                },
            },
            {
                $unwind: "$user",
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);

        return res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: err.message });
    }
};

// like a post
module.exports.like = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.id,
            likes: req.user.id,
        });
        if (post) {
            return res
                .status(200)
                .json({ message: "You'v already like this post" });
        }

        // like this post
        const like = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    likes: req.user.id,
                },
            },
            { new: true }
        );

        if (!like)
            return res.status(404).json({ message: "Post does not exist" });

        return res
            .status(200)
            .json({ like: true, message: "successfully liked" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

// unlieke psot
module.exports.unlike = async (req, res) => {
    try {
        const unlike = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { likes: req.user.id } },
            { new: true }
        );

        if (!unlike)
            return res
                .status(404)
                .json({ message: "Post does not exist", isPost: false });

        return res.status(200).json({
            message: "Successfully unliked",
            unlike: true,
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
