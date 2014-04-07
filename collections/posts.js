
if (typeof db === 'undefined')
  db = {};

db.posts = new Meteor.Collection('posts');

// Users can only update or remove their own posts.
db.posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

// User can only edit specific fields
db.posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

// Define meteor methods -> server-side functions called client-side.
Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user(),
        postWithSameLink = db.posts.findOne({url: postAttributes.url});

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, "Please fill in a headline");

    // check that there are no previous posts with the same link
    if (postAttributes.url && postWithSameLink)
      // 302 is redirect
      throw new Meteor.Error(302, "This link has already been posted", postWithSameLink._id);

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime(),
      commentsCount: 0
    });

    var postId = db.posts.insert(post);

    return postId;
  }
});