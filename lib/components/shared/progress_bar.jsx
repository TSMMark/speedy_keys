Components.ProgressBar = React.createClass({

  getDefaultProps: function () {
    return {
      modifier: 1.0
    }
  },

  styleFromPercent: function (percent, additionalStyles) {
    var widthStyle = {
      width: (percent * this.props.modifier) + "%"
    }

    if (additionalStyles) {
     _.extend(widthStyle, additionalStyles);
    }

    return widthStyle;
  },

  render: function () {
    var style = this.styleFromPercent(
          this.props.progress * 100,
          this.props.style
        )
      , classes = {
          "progress-bar": true,
          "progress-bar-striped": true,
          "active": true
        };

    if (this.props.className) {
      classes[this.props.className] = true;
    }

    return (
      <div className={cx(classes)}
           style={style} />
    );
  }

});
