Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

// This covers edge case where user gets error message but we redirect
// to new page right away. (302 error on creating a post - it already exists)
// When we render error template, wait 1ms before updating the error seen to true.
// We redirect to existing post instantly on 302, so deferred function gets called
// AFTER we get redirected.
Template.error.rendered = function() {
  var error = this.data;
  Meteor.defer(function() {
    Errors.update(error._id, {$set: {seen: true}});
  });
};