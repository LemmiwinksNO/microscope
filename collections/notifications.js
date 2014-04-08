
if (typeof(db) === undefined)
  db = {};

db.notifications = new Meteor.Collection('notifications');

db.notifications.allow({
  update: ownsDocument
});

createCommentNotification = function(comment) {
  var post = db.posts.findOne(comment.postId);
  // If commenter !== poster
  if (comment.userId !== post.userId) {
    db.notifications.insert({
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};