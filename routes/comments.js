//comments.js
const express = require("express");
const router = express();
const Comment = require("./schema/comments");

//전체조회
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().select(["-password"]);
    res.json({ data: comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//댓글작성
router.post("/:postId", async (req, res) => {
  const { postId } = req.params;

  if (req.body) {
    return res.json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const { user, content, password } = req.body;

  try {
    const comment = await Comment.create({
      user,
      content,
      password,
      postId,
    });
    res.json({ data: comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//댓글 상세조회
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId });
    res.json({ data: comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//댓글 수정
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, user, password } = req.body;

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.json({ message: "댓글 조회에 실패하였습니다." });
  }

  const isPasswordCorrect = comment.password === password;

  if (isPasswordCorrect) {
    if (content) {
      comment.content = content;
    }

    if (user) {
      comment.user = user;
    }

    try {
      const updatedComment = await comment.save();
      res.json({ data: updatedComment });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json({ message: "비밀번호가 틀렸습니다." });
  }
});

//댓글 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.json({ message: "댓글 조회에 실패하였습니다" });
  }

  const isPasswordCorrect = comment.password === password;

  if (isPasswordCorrect) {
    try {
      await comment.remove();
      res.json({ message: "댓글을 삭제하였습니다." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json({ message: "비밀번호가 틀렸습니다." });
  }
});

module.exports = router;
