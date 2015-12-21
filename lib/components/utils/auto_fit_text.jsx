// Adapted from:
// https://github.com/TSMMark/vydia/blob/master/assets/javascripts/components/shared/AutoFitText.jsx

var setFontSize = function (el, fontSize) {
  el.style.fontSize = fontSize + "px";
}

Components.Utils.AutoFitText = React.createClass({

  propTypes: {
    fontFamily: React.PropTypes.string, // Enforce font-family for proper sizing.
    minFontSize: React.PropTypes.number,
    maxFontSize: React.PropTypes.number,
    verticalCenter: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      minFontSize: 1,
      maxFontSize: 300,
      verticalCenter: false
    };
  },

  componentDidMount: function () {
    $(window).on("resize", this._calculateSize);
    _.defer(this._enforceStyles);
    _.defer(this._calculateSize);
  },

  componentWillUnmount: function () {
    $(window).off("resize", this._calculateSize);
  },

  componentDidUpdate: function (prevProps, prevState) {
    _.defer(this._enforceStyles);
    _.defer(this._calculateSize);
  },

  _enforceStyles: function () {
    if (!this.isMounted()) return;

    var el = ReactDOM.findDOMNode(this);

    if (this.props.fontFamily) {
      el.style.fontFamily = this.props.fontFamily;
    }

    el.style.display = "inline-block";
    el.style.width = "auto";
    el.style.whiteSpace = "nowrap";
    el.style.transition = "none";
  },

  _centerVertically: function (fontSize) {
    if (!this.isMounted()) return;

    var el = ReactDOM.findDOMNode(this);

    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.marginTop = "-" + (fontSize / 2) + "px";
  },

  // TODO: Maybe throttle this?
  _calculateSize: function () {
    if (!this.isMounted()) return;

    var el = ReactDOM.findDOMNode(this);
    var $el = $(el);
    var parentWidth = $el.parent().innerWidth();

    setFontSize(el, this.props.minFontSize);
    var widthAtMin = $el.outerWidth();

    setFontSize(el, this.props.maxFontSize);
    var widthAtMax = $el.outerWidth();

    var computedSize =
      (parentWidth - widthAtMin) * (this.props.maxFontSize - this.props.minFontSize) /
      (widthAtMax - widthAtMin) + this.props.minFontSize;

    setFontSize(el, computedSize);

    if (this.props.verticalCenter) {
      this._centerVertically(computedSize);
    }
  },

  render: function () {
    return this.props.children;
  }

});
