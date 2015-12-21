Partials.Navbar = React.createClass({

  componentDidMount: function() {
    // http://materializecss.com/navbar.html#mobile-collapse
    // TODO: learn how to destroy / teardown.
    $(this.refs["button-collapse"]).sideNav();
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
    var currentUser = Meteor.user();

    return (
      <li>
        <a>
          Hi, {currentUser.profile.name}! <Components.Emoji emoji={currentUser.profile.emoji}/>
        </a>
      </li>
    );
  },

  renderItemSignOutButton: function () {
    return <Components.SignOutButton/>;
  },

  render: function () {
    var currentUser = Meteor.user();

    return (
      <nav>
        <Components.Container>
          <div className="nav-wrapper">
            <Link to="/" className="brand-logo">
              Speedy Keys
            </Link>
            {!currentUser ? null :
              <a href="#" data-activates="mobile-side-nav" ref="button-collapse" className="button-collapse">
                <i className="material-icons">menu</i>
              </a>
            }
            {!currentUser ? null :
              <ul className="right hide-on-med-and-down">
                {this.renderItemFindGameButton()}
                {this.renderItemGreeting()}
                {this.renderItemSignOutButton()}
              </ul>
            }
            {!currentUser ? null :
              <ul className="side-nav" id="mobile-side-nav">
                {this.renderItemGreeting()}
                {this.renderItemFindGameButton()}
                {this.renderItemSignOutButton()}
              </ul>
            }
          </div>
        </Components.Container>
      </nav>
    );
  }

});
