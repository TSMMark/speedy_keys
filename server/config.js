// This doesn't seem to actually work.
// process.env.EMOJIONE_ADD_SVG_SPRITES = "true";

if (Meteor.settings.FB_APP_ID && Meteor.settings.FB_APP_SECRET) {
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.FB_APP_ID,
    secret: Meteor.settings.FB_APP_SECRET
  });
}
