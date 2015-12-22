Components.Spinner = React.createClass({

  propTypes: {
    fixed: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      fixed: true
    };
  },

  renderLayer: function (color, index) {
    return (
      <div key={index} className={"spinner-layer spinner-" + color}>
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    )
  },

  render: function () {
    var colors = ["blue", "red", "yellow", "green"];

    var content = (
      <div className="preloader-wrapper big active">
        { colors.map(this.renderLayer) }
      </div>
    );

    if (!this.props.fixed) { return content; }

    return (
      <Components.FixedAndCentered>
        { content }
      </Components.FixedAndCentered>
    );
  }

});
