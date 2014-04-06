Template.postPage.helpers({
  // Return all comments for this post
  comments: function() {
    return Comments.find({postId: this._id});
  }
});