Speedy Keys \[[play]()\]
===========

A speed-typing game built with Meteor JS + React JS.

Development
-----------

Clone the repo.

Start the meteor server:
```
$ meteor
```

Production
-----------

1. Set up your app to [deploy to heroku with git](https://devcenter.heroku.com/articles/git).
2. Set this repository as the buildpack URL:
```
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git
```
3. Add the MongoLab addon:
```
heroku addons:create mongolab
```
4. Set the `ROOT_URL` environment variable. This is required for bundling and running the app.  Either define it explicitly, or enable the [Dyno Metadata](https://devcenter.heroku.com/articles/dyno-metadata) labs addon to default to `https://<appname>.herokuapp.com`.
```
heroku config:set ROOT_URL="https://<appname>.herokuapp.com" # or other URL
```

Once that's done, you can deploy your app using this build pack any time by pushing to heroku:
```
git push heroku master
```

For your `settings.json` on heroku run this command:
```
heroku config:add METEOR_SETTINGS="$(cat settings.json)"

Visit the page in your browser.

Enter your Facebook App credentials.

Enjoy.

* * *
Copyright Mark Allen 2015
