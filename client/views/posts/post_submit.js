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
      if (error) {
        // display the error to the user
        throwError(error.reason);
        if (error.error === 302)
          Router.go('postPage', {_id: error.details});
      } else {
        Router.go('postPage', {_id: id});
      }
    });
  }
});