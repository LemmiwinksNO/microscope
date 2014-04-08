// notifications template helpers
Template.notifications.helpers({
  notifications: function() {
    return db.notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function() {
    return db.notifications.find({userId: Meteor.userId(), read: false}).count();
  }
});

// notification template helpers
Template.notification.helpers({
  notificationPostPath: function() {
    return Router.routes.postPage.path({_id: this.postId});
  }
});

// notification event handlers
Template.notifications.events({
  'click a': function() {
    db.notifications.update(this._id, {$set: {read: true}});
  }
});
