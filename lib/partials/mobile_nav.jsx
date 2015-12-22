Partials.SideNav = React.createClass({

  render: function () {
    return (
      <ul className="side-nav" id="mobile-side-nav">
        {this.props.children}
      </ul>
    )
  }

});
