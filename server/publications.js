// Publish entire posts collection
Meteor.publish('posts', function() {
  return db.posts.find();
});

// Publish comments for passed in postId
Meteor.publish('comments', function(postId) {
 return db.comments.find({postId: postId});
});