Partials.Navbar = React.createClass({

  componentDidMount: function() {
    // http://materializecss.com/navbar.html#mobile-collapse
    // TODO: learn how to destroy / teardown.
    $(this.refs["button-collapse"]).sideNav();
  },

  render: function () {
    var currentUser = Meteor.user();

    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">
            Speedy Keys
          </Link>
          {!currentUser ? null :
            <a href="#" data-activates="mobile-demo" ref="button-collapse" className="button-collapse">
              <i className="material-icons">menu</i>
            </a>
          }
          {!currentUser ? null :
            <ul className="right hide-on-med-and-down">
              <li><a href="sass.html">Sass</a></li>
              <li><a href="badges.html">Components</a></li>
              <li><a href="collapsible.html">Javascript</a></li>
              <li><a href="mobile.html">Mobile</a></li>
            </ul>
          }
          {!currentUser ? null :
            <ul className="side-nav" id="mobile-demo">
              <li><a href="sass.html">Sass</a></li>
              <li><a href="badges.html">Components</a></li>
              <li><a href="collapsible.html">Javascript</a></li>
              <li><a href="mobile.html">Mobile</a></li>
            </ul>
          }
        </div>
      </nav>

      //       {currentUser ?
      //         <ul className="nav navbar-nav navbar-left">
      //           <li>
      //             <Components.JoinGameButton>
      //               Find a Game
      //             </Components.JoinGameButton>
      //           </li>
      //         </ul>
      //       : null}
      //       {currentUser ?
      //         <form className="navbar-form navbar-right">
      //           <Components.SignOutButton/>
      //         </form>
      //       : null
      //       }
      //       <ul className="nav navbar-nav navbar-right">
      //         {currentUser ?
      //           <li>
      //             <a>
      //               Hi, {currentUser.profile.name}! <Components.Emoji emoji={currentUser.profile.emoji}/>
      //             </a>
      //           </li>
      //         : null}
      //       </ul>
      //     </div>
      //   </div>
      // </nav>
    );
  }

});
