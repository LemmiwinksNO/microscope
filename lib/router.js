// Configure Router
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  // router will ensure that the posts subscriptions is loaded before
  // sending the user through to the route they requested.
  waitOn: function() {
    // return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
    return [Meteor.subscribe('posts')];
  }
});

// Setup routes
// By default Iron Router will look for a template with the same name as the route name.
Router.map(function(){
  // When you navigate to '/', route to postsList.
  this.route('postsList', { path: '/' });
  // When user accesses postPage route, find appropriate post and pass it to
  // postPage template.
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return Meteor.subscribe('comments', this.params._id);
    },
    // Set postPage template's data context, it will be the 'this' inside any
    // template helpers
    data: function() { return Posts.findOne(this.params._id); }
  });
  this.route('postEdit', {
    path: '/posts/:_id/edit',
    data: function() { return Posts.findOne(this.params._id); }
  });
  this.route('postSubmit', {
    path: '/submit'
  });
});

// If user isn't logged in and aren't in the process of logging in,
// render accessDenied and call pause()
var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.logginIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    pause();
  }
};

// Load loading template before each action?
Router.onBeforeAction('loading');
// Before postSubmit action, check if user is logged in.
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
// Clear errors whenever we route somewhere.
Router.onBeforeAction(function() { Errors.clearSeen(); });