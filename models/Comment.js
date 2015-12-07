
(function(){

    'use strict';

    var mongoose = require('mongoose');

    var CommentSchema = new mongoose.Schema({

        body: String,
        author: String,
        upvotes: {

            type: Number,
            default: 0
        },
        post: {

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    });

    CommentSchema.methods.upvote = fnIncrementUpvotes;


    mongoose.model('Comment', CommentSchema);

    // @@ function implementation

    function fnIncrementUpvotes(comment){

        this.upvotes += 1;
        this.save(comment);
    }
    
})();
