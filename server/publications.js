// Publish postsLimit # of posts
// NOTE: We're passing through options from user directly into find,
// not a secure idea. Right now all they can do is change # of pages.
Meteor.publish('posts', function(options) {
  return db.posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  return id && db.posts.find(id);
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