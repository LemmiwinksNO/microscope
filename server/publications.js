// Publish entire posts collection
Meteor.publish('posts', function() { return Posts.find(); });

// Publish comments for passed in postId
Meteor.publish('comments', function(postId) {
 return Comments.find({postId: postId});
});