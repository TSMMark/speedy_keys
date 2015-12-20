getRandomEmoji = function () {
  return _.sample(_.keys(emojione.emojioneList));
}

Accounts.onCreateUser(function(options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    user.profile = options.profile;
  }
  else {
    user.profile = {};
  }

  user.profile.emoji = getRandomEmoji();

  return user;
});
