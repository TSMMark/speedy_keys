Meteor.publish("games", function () {
  return Collections.Games.find({
    playersIds: { $in: [this.userId] }
  });
});

Meteor.publish("users", function () {
  return Collections.Users.find({ _id: this.userId });
});
