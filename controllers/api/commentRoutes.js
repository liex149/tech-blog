const router = require('express').Router();
const { Comment } = require('../../models');

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const allComment = await Comment.findAll()
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  


router.get('/:id', async (req, res) => {
  try {
    const oneComment = await Comment.findByPk(req.params.id);
    if (!oneComment) {
      res.status(404).json({ message: "There are no Comments with this id"});
    }
    res.status(200).json(oneComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post('/', async (req, res) => {
//   try {
//     const newComment = await Comment.create({
//       ...req.body,
//       user_id: req.session.user_id,
//       post_id: req.session.post_id,
//     });

//     res.status(200).json(newComment);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

router.delete('/:id', async (req, res) => {
  try {
    const CommentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!CommentData) {
      res.status(404).json({ message: 'No Comment found with this id!' });
      return;
    }

    res.status(200).json(CommentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
