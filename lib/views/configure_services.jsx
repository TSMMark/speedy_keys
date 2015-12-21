Views.ConfigureServices = React.createClass({
  mixins: [ReactRouter.State, ReactRouter.Navigation],

  handleSubmit: function (event) {
    event.preventDefault();
    var app_id = this.refs.app_id.value
      , app_secret = this.refs.app_secret.value

    ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: app_id,
      secret: app_secret
    });
  },

  render: function () {
    return (
      <Components.Container>
        <form onSubmit={this.handleSubmit}>
          <p>Enter the Facebook app data:</p>
          <label htmlFor="app_id">app_id</label>
          <input type="text" ref="app_id" id="app_id" name="app_id" />
          <label htmlFor="app_secret">app_secret</label>
          <input type="text" ref="app_secret" id="app_secret" name="app_secret" />
          <input type="submit" className="btn btn-default" />
        </form>
      </Components.Container>
    );
  }

});
