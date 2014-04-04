// Local (client-only) collection
Errors = new Meteor.Collection(null);

throwError = function(message) {
  Errors.insert({message: message, seen: false});
};

// Clears 'seen' errors
clearErrors = function() {
  Errors.remove({seen: true});
};