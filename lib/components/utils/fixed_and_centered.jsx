
Components.FixedAndCentered = React.createClass({

  render: function () {
    var styles = {
      position: "fixed",
      width: "100%",
      height: "100%",
      top: "0",
      right: "0",
      bottom: "0",
      left: "0"
    }

    return (
      <div className="valign-wrapper" style={styles}>
        <div className="valign center-align" style={{ width: "100%" }}>
          { this.props.children }
        </div>
      </div>
    );
  }

});
