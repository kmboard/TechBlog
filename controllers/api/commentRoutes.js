const router = require('express').Router();
const withAuth = require ('../../utils/auth')
const { Comment } = require('../../models');

// get all comments
router.get('/', (req, res) => {
  Comment.findAll({})
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// create comments
router.post('/', withAuth, async (req, res) => {
    try {
      const newComment = await Comment.create({
        ...req.body,
        user_id: req.session.user_id,
      });
  
      res.status(200).json(newComment);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  

  //delete comments
  router.delete('/:id', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
  
      if (!commentData) {
        res.status(404).json({ message: 'Can not find comment!' });
        return;
      }
  
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  // update comments
  router.put('/:id', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!commentData[0]) {
        res.status(404).json({ message: 'Can not find comment!' });
        return;
      }
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  
module.exports = router;