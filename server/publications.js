// Publish entire posts collection
Meteor.publish('posts', function() {
  return db.posts.find();
});

// Publish comments for passed in postId
// How does it get postId? It is passed from the subscription.
Meteor.publish('comments', function(postId) {
 return db.comments.find({postId: postId});
});

// Return notifications for this user
Meteor.publish('notifications', function() {
  // publish function has current user's _id available as this.userId
  return db.notifications.find({userId: this.userId});
});