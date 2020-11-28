const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host"); // http://localhost:3000

  // console.log(req.file);

  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post Added.",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post Creation Failed.",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "posts fetched successfully.",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching a Post Failed." });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching a Post Failed." });
    });
};

exports.updatePost = (req, res, next) => {
  // console.log(req.file);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  // console.log(updatedPost);

  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    updatedPost
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Updated Successfully." });
      } else {
        res.status(401).json({ message: "Not Authorized." });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Couldn't update a post." });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Post Deleted." });
      } else {
        res.status(401).json({ message: "Not Authorized." });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deleting a Post Failed." });
    });
};
