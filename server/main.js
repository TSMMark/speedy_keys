Meteor.publish("games", function () {
  if (this.userId) {
    return Collections.Games.find({ "playersIds": this.userId });
  }
  else {
    return [];
  }
});

Meteor.publish("users", function () {
  return Collections.Users.find();
});
