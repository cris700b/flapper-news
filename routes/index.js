var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var PostModel = mongoose.model('Post');
var CommentModel = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// @@ preloaded route params
router.param('postId', fnPreloadPost);
router.param('commentId', fnPreloadComment);

// @@ post routes
router.get('/posts', fnGetPostList);
router.get('/posts/:postId', fnGetPostById)
router.post('/posts', fnCreatePost)
router.put('/posts/:postId/upvote', fnUpvotePost)

// @@ comment routes
router.post('/posts/:postId/comments', fnPostComments);
router.put('/posts/:postId/comments/:commentId/upvote', fnUpvoteComment);

module.exports = router;

// @@ function implementation

// @@ comment route handlers

function fnUpvoteComment(req, res, next){

    req.comment.upvote(function(err, comment){

        handleResponse(err, comment, res, next);
    });
}

function fnPostComments(req, res, next){

    var comment = new CommentModel(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){

        if(err){

            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function(err, post){

            if(err){

                return next(err);
            }

            res.json(comment);
        });
    });
}

function fnPreloadComment(req, res, next, id){

    var query = CommentModel.findById(id);

    query.exec(function(err, comment){

        if(err){

            return next(err);
        }

        if(!comment){

            return next(new Error('can\'t find comment'))
        }

        req.comment = comment;

        return next();
    });
}


// @@ post route handlers
function fnUpvotePost(req, res, next){

    req.post.upvote(function(err, post){

        handleResponse(err, post, res, next);
    });
}

function fnGetPostById(req, res){

    req.post.populate('comments', function(err, post){

        handleResponse(err, post, res);
    });
}

function fnPreloadPost(req, res, next, id){

    var query = PostModel.findById(id);

    query.exec(function(err, post){

        if(err){

            return next(err);
        }

        if(!post){

            return next(new Error('can\'t find post'))
        }

        req.post = post;

        return next();
    });
}

function fnCreatePost(req, res, next){

    var post = new PostModel(req.body);
    post.save(function(err, post){

            handleResponse(err, post, res, next);
    });
}

function fnGetPostList(req, res, next){

    PostModel.find(function(err, posts){

        handleResponse(err, posts, res, next);
    });
}

function handleResponse(err, data, res, next){

    if (err) {

        return next(err);
    }

    console.log('returning data : ' + data);
    res.json(data);
}
