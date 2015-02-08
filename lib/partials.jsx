Partials = {};

Partials.Navbar = React.createClass({
  render: function () {
    var currentUser = Meteor.user();

    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>

            <Link to="app" className="navbar-brand">
              Speedy Keys
            </Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            {currentUser ?
              <ul className="nav navbar-nav navbar-left">
                <li>
                  <Link to="app">
                    Existing Matches
                  </Link>
                </li>
                <li>
                  <Components.JoinGameButton>
                    Join a Game!
                  </Components.JoinGameButton>
                </li>
              </ul>
            : null}
            <form className="navbar-form navbar-right">
              <Components.FacebookLogin currentUser={currentUser}/>
            </form>
            <ul className="nav navbar-nav navbar-right">
              {currentUser ?
                <li>
                  <a>
                    Hi, {currentUser.profile.name}.
                  </a>
                </li>
              : null}
            </ul>
          </div>
        </div>
      </nav>);
  }
});
