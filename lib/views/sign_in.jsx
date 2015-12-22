Views.SignIn = React.createClass({

  contextTypes: {
    ltSmall: React.PropTypes.bool.isRequired,
    ltMedium: React.PropTypes.bool.isRequired,
    ltLarge: React.PropTypes.bool.isRequired,
    gtSmall: React.PropTypes.bool.isRequired,
    gtMedium: React.PropTypes.bool.isRequired,
    gtLarge: React.PropTypes.bool.isRequired
  },

  propTypes: {
    includePassword: React.PropTypes.bool,
    history: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      includePassword: true
    }
  },

  render: function () {
    var ltSmall = this.context.ltSmall;

    return (
      <Components.Container>
        <div className={cx("row", { "valign-wrapper": !ltSmall })}>
          <div className={cx("col m6 s12", { "valign": !ltSmall })}>
            { ltSmall ? null : <h1>Speedy Keys</h1> }
            <h2>Can you text faster than your friends?</h2>
          </div>
          <div className={cx("col m6 s12", { "valign": !ltSmall })}>
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
