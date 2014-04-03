/** CLIENT **/
if (Meteor.isClient) {

  // Template helpers
  Template.postsList.helpers({
    // Get posts in sorted by 'submitted' in descending order.
    posts: function() { return Posts.find({}, {sort: {submitted: -1}}); }
  });
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

  // Wire up to postSubmit(new post) events
  Template.postSubmit.events({
    'submit form': function(e) {
      e.preventDefault();  // So browser doesn't try to submit the form.

      var post = {
        url: $(e.target).find('[name=url]').val(),
        title: $(e.target).find('[name=title]').val(),
        message: $(e.target).find('[name=message]').val()
      };

      // Simple collection insertion.
      // post._id = Posts.insert(post);  // need _id for router to construct the url.
      // Router.go('postPage', post);

      // Meteor method post insertion ('methodName', arguments, callback)
      Meteor.call('post', post, function(error, id) {
        if (error)
          return alert(error.reason);

        Router.go('postPage', post);
      });
    }
  });

  // Wire up to postEdit events
  Template.postEdit.events({
    'submit form': function(e) {
      e.preventDefault();  // So browser doesn't try to submit form.

      var currentPostId = this._id;

      var postProperties = {
        url: $(e.target).find('[name=url]').val(),
        title: $(e.target).find('[name=title]').val()
      };

      Posts.update(currentPostId, {$set: postProperties}, function(error){
        if (error) {
          // display the error to the user
          alert(error.reason);
        } else {
          Router.go('postPage', {_id: currentPostId });
        }
      });
    },

    'click .delete': function(e) {
      e.preventDefault();

      if (confirm("Delete this post?")) {
        var currentPostId = this._id;
        Posts.remove(currentPostId);
        Router.go('postsList');
      }
    }
  });
}


/** SERVER **/
if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
