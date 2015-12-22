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
      , wrapperClasses = {
          "progress": true
        }
      , classes = {
          "determinate": true
        };

    if (this.props.className) {
      classes[this.props.className] = true;
    }

    if (this.props.mainColor) {
      classes[this.props.mainColor] = true;
    }

    if (this.props.backgroundColor) {
      wrapperClasses[this.props.backgroundColor] = true;
    }

    return (
      <div className={cx(wrapperClasses)}>
        <div className={cx(classes)} style={style} />
      </div>
    );
  }

});
