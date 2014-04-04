Template.postsList.helpers({
  // Get posts in sorted by 'submitted' in descending order.
  posts: function() { return Posts.find({}, {sort: {submitted: -1}}); }
});