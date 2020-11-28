const express = require("express");

const checkAuth = require("../middleware/check-auth");
const multer = require("../middleware/multer");
const PostController = require("../controllers/posts");

const router = express.Router();

router.post("", checkAuth, multer, PostController.createPost);

router.put("/:id", checkAuth, multer, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
