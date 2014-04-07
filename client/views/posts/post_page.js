Template.postPage.helpers({
  // Return all comments for this post
  comments: function() {
    return db.comments.find({postId: this._id});
  }
});