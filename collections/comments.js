
if (typeof db === 'undefined')
  db = {};

db.comments = new Meteor.Collection('comments');

Meteor.methods({
// Meteor method for posting a comment
  comment: function(commentAttributes) {
    var user = Meteor.user();
    var post = db.posts.findOne(commentAttributes.postId);

    // ensure the user is logged in, wrote content, comment is linked to a post
    if (!user)
      throw new Meteor.Error(401, "You need to login to make comments");
    if (!commentAttributes.body)
      throw new Meteor.Error(422, 'Please write some content');
    if (!post)
      throw new Meteor.Error(422, 'You must comment on a post');

    // Create comment object
    comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    // Could instead do
    // comment = {
    //  postId: commentAttributes.postId,
    //  body: commentAttributes.body,
    //  userId: user._id,
    //  author: user.username,
    //  submitted: new Date().getTime()
    // }

    // Update the post with the number of comments
    db.posts.update(comment.postId, {$inc: {commentsCount: 1}});

    // Create the comment, save the id
    comment._id = db.comments.insert(comment);

    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);

    return comment._id;
  }
});