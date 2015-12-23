// This doesn't seem to actually work.
// process.env.EMOJIONE_ADD_SVG_SPRITES = "true";

if (process.env.FB_APP_ID && process.env.FB_APP_SECRET) {
  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });
  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: process.env.FB_APP_ID,
    secret: process.env.FB_APP_SECRET
  });
}
