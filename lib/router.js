// Configure Router
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  // router will ensure that the posts subscriptions is loaded before
  // sending the user through to the route they requested.
  waitOn: function() {
    // return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];
    return [Meteor.subscribe('notifications')];
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  limit: function() {
    return parseInt(this.params.postsLimit, 10) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return db.posts.find({}, this.findOptions());
  },
  data: function() {
    // If we ask for n posts and get n posts back, we assume there are more
    // and we will show the 'load more' link on our posts list. IF we get
    // less than n back, we know we've hit the limit.
    var hasMore = this.posts().count() === this.limit();
    var nextPath = this.route.path({postsLimit: this.limit() + this.increment});
    return {
      posts: this.posts(),
      nextPath: hasMore ? nextPath : null
    };
  }
});

// Setup routes
// By default Iron Router will look for a template with the same name as the route name.
Router.map(function(){

  // When user accesses postPage route, find appropriate post and pass it to
  // postPage template.
  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    // Set postPage template's data context, it will be the 'this' inside any
    // template helpers
    data: function() { return db.posts.findOne(this.params._id); }
  });

  this.route('postEdit', {
    path: '/posts/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return db.posts.findOne(this.params._id); }
  });

  this.route('postSubmit', {
    path: '/submit',
    disableProgress: true
  });

  // When you navigate to '/', route to postsList.
  // '/:postsLimit?' will match EVERY possible path, so it needs to go after
  // more specific routes'
  this.route('postsList', {
    path: '/:postsLimit?',  // The '?' means this parameter is optional
    controller: PostsListController  // This replaces below
    // waitOn: function() {
    //   var limit = parseInt(this.params.postsLimit) || 5;
    //   return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
    // },
    // data: function() {
    //   var limit = parseInt(this.params.postsLimit) || 5;
    //   // Return a JS object instead of a cursor. This lets us create a named
    //   // data context. So you can find this as 'posts' instead of 'this'.
    //   return {
    //     posts: db.posts.find({}, {sort: {submitted: -1}, limit: limit})
    //   };
    // }
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