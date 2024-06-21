const errorHandler = require('../utils/error');
const Comment = require('../models/comment.model');

const createComment = async (req, res, next) => {

    try {
        const {userId, postId, content} = req.body;

        if(req.user.id !== userId){
            return next(errorHandler(403,"You are not allowed to create this comment"));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        console.log(newComment)

        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }
}

const getComments = async (req, res, next) => {

    try{
        const commentList = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
        res.status(200).json(commentList);

    } catch (error) {
        next(error)
    }
}

const likeComment = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to edit this post"));

    }

    try {
        const comment = await Comment.findById(req.params.commentId);

        if(!comment) return next(errorHandler(404, "Comment not found"));

        const userIndex = comment.likes.indexOf(req.user.id);

        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;            
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}


module.exports = {createComment, getComments, likeComment}