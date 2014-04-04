Template.postItem.helpers({
  // Is the current user the author of this post?
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  // domain name (remove http:// and .com from url)
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});