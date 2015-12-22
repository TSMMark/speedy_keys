Views.SignIn = React.createClass({
  mixins: [Mixins.RoutingHelpers, Mixins.Games],

  propTypes: {
    includePassword: React.PropTypes.bool,
    history: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      includePassword: true,
      mobile: false
    }
  },

  render: function () {
    return (
      <Components.Container>
        <div className={cx("row", { "valign-wrapper": !this.props.mobile })}>
          <div className={cx("col m6 s12", { "valign": !this.props.mobile })}>
            { this.props.mobile? null : <h1>Speedy Keys</h1> }
            <h2>Can you text faster than your friends?</h2>
          </div>
          <div className={cx("col m6 s12", { "valign": !this.props.mobile })}>
            <div className="card-panel">
              <Components.SignInForm includePassword={this.props.includePassword} />
            </div>
          </div>
        </div>

        <footer className="footer right-align">
          <Components.Container>A game by Mark Allen - Copyright 2015</Components.Container>
        </footer>
      </Components.Container>
    );
  }

});
