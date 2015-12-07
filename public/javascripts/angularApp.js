
(function(module){

    'use strict';

    module.config(function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('home', {

                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {

                    postPromise: function(PostsFact){

                        return PostsFact.getAllPosts();
                    }                }
            })
            .state('posts', {

                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl',
                resolve: {

                    postResolver: function($stateParams, PostsFact){

                        return PostsFact.getPostById($stateParams.id);
                    }
                }
            });

        $urlRouterProvider.otherwise('home');
    });

    module.factory('PostsFact', function($http){

        var factory = this;
        factory.posts = [];

        // post actions
        factory.getAllPosts = fnGetAllPosts;
        factory.getPostById = fnGetPostById;
        factory.createPost = fnCreatePost;
        factory.upvotePost = fnUpvotePost;

        // comment actions
        factory.addComment = fnAddComment;
        factory.upvoteComment = fnUpvoteComment;

        // @@ function implementation

        // comment functions
        function fnAddComment(id, comment){

            return $http.post('/posts/' + id + '/comments', comment);
        };

        function fnUpvoteComment(post, comment){

            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
                        .success(function(data){

                            comment.upvotes += 1;
                        });
        }

        // post functions
        function fnGetAllPosts(){

            return $http.get('/posts')
                        .success(function(data){
                            angular.copy(data, factory.posts);
                        });
        };

        function fnGetPostById(postId){

            return $http.get('/posts/' + postId).then(function(res){

                return res.data;
            })
        };

        function fnCreatePost(post){

            return $http.post('/posts', post)
                        .success(function(data){

                            factory.posts.push(data);
                        });
        };

        function fnUpvotePost(post){

            return $http.put('/posts/' + post._id + '/upvote').success(function(data){

                post.upvotes += 1;
            });
        }

        return factory;
    });

    module.controller('MainCtrl', function($scope, $stateParams, PostsFact){

        $scope.post = {};
        $scope.posts = PostsFact.posts;
        $scope.getPost = fnGetPost;
        $scope.addPost = fnAddPost;
        $scope.incrementUpvotes = fnIncrementUpvotes;


        // @@ functions implementation

        function fnGetPost(){

            $scope.post = PostsFact.posts[$stateParams.id];
        }

        function fnAddPost(){

            if($scope.title && $scope.title.trim().length > 0){

                PostsFact.createPost({title: $scope.title,
                                    link: $scope.link,
                                    upvotes: 0
                                    });

                $scope.title = '';
                $scope.link = ''
            }
        }

        function fnIncrementUpvotes(post){

            PostsFact.upvotePost(post);
        }
    });

    module.controller('PostsCtrl', function($scope, PostsFact, postResolver){

        $scope.post = postResolver;
        $scope.addComment = fnAddComment;
        $scope.upvoteComment = fnUpvoteComment;

        // @@ functions implementation

        function fnAddComment(){

            if($scope.body && $scope.body.trim().length > 0){

                PostsFact.addComment(postResolver._id, {body: $scope.body,
                    author: 'user',
                    upvotes: 0})
                          .success(function (comment) {

                            $scope.post.comments.push(comment);
                          });

                $scope.body = '';
            }
        }

        function fnUpvoteComment(comment){

            PostsFact.upvoteComment(postResolver, comment);
        }
    });

})(angular.module('flapperNews', [

    'ui.router'

]));
