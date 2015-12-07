
(function(){

    'user strict';

    var mongoose = require('mongoose');

    var PostSchema = new mongoose.Schema({

        title: String,
        link: String,
        upvotes: {

            type: Number,
            default: 0
        },
        comments:[{

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
    });

    PostSchema.methods.upvote = fnIncrementUpvotes;

    mongoose.model('Post', PostSchema);

    // @@ function implementation

    function fnIncrementUpvotes(post){

        this.upvotes += 1;
        this.save(post);
    }

})();
