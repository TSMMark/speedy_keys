Partials.Navbar = React.createClass({

  componentDidMount: function() {
    this.initNavCollapseButton();
  },

  componentWillReceiveProps: function(nextProps) {
    var prevCurrentUserId = this.props && this.props.currentUser && this.props.currentUser._id;
    var nextCurrentUserId = nextProps && nextProps.currentUser && nextProps.currentUser._id;

    if (prevCurrentUserId != nextCurrentUserId) {
      if (nextCurrentUserId) {
        // this.initNavCollapseButton();
      }
      else {
        // this.hideNavCollapseButton();
      }
    }
  },

  componentWillUnmount: function() {
    this.hideNavCollapseButton();
  },

  hideNavCollapseButton: function() {
    $(this.refs["button-collapse"]).sideNav("hide");
  },

  initNavCollapseButton: function() {
    // http://materializecss.com/navbar.html#mobile-collapse
    // https://github.com/Dogfalo/materialize/blob/master/js/sideNav.js#L305
    $(this.refs["button-collapse"]).sideNav("init", {
      closeOnClick: true
    });
  },

  renderItemFindGameButton: function() {
    return (
      <li>
        <Components.JoinGameButton>
          Find a Game
        </Components.JoinGameButton>
      </li>
    );
  },

  renderItemGreeting: function () {
    var currentUser = this.props.currentUser;

    return (
      <li>
        <a className="side-nav-profile">
          <span className="side-nav-image"><Components.Emoji emoji={currentUser.profile.emoji}/></span>
          <h5 className="side-nav-greeting">Hi, {currentUser.profile.name}!</h5>
        </a>
        <div className="divider"></div>
      </li>
    );
  },

  renderItemSignOutButton: function () {
    return <Components.SignOutButton/>;
  },

  render: function () {
    var currentUser = this.props.currentUser;

    return (
      <nav>
        <Components.Container>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo">
              Speedy Keys
            </Link>
            <a href="#" data-activates="mobile-side-nav" ref="button-collapse" className="button-collapse">
              <i className="material-icons">menu</i>
            </a>
            {!currentUser ? null :
              <ul className="right hide-on-med-and-down">
                {this.renderItemFindGameButton()}
                {this.renderItemGreeting()}
                {this.renderItemSignOutButton()}
              </ul>
            }
            {
              currentUser ? (
                <Partials.SideNav>
                  {this.renderItemGreeting()}
                  {this.renderItemFindGameButton()}
                  {this.renderItemSignOutButton()}
                </Partials.SideNav>
              ) : (
                <Partials.SideNav>
                  <Components.Container>
                    <Components.SignInForm includePassword={false} />
                  </Components.Container>
                </Partials.SideNav>
              )
            }
          </div>
        </Components.Container>
      </nav>
    );
  }

});
