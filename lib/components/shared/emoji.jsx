Components.Emoji = React.createClass({

  propTypes: {
    emoji: React.PropTypes.string.isRequired,
    zDepth: React.PropTypes.number // TODO: make mixin that applies zDepth to class. // All components will have to honor className though.
  },

  getDefaultProps: function () {
    return {
      className: "",
      emoji: ":sunglasses:",
      zDepth: null // Don't use this. It looks really bad with non-font icons.
    }
  },

  renderBackdrop: function (zDepth) {
    if (zDepth === null) return;

    var classes = {};

    if (zDepth >= 0) {
      classes["z-depth-" + zDepth] = true;
    }

    // Position in a circle
    var styles = {
      position: "absolute",
      width: "1.6em",
      height: "1.6em",
      top: "50%",
      left: "50%",
      marginTop: "-44%",
      marginLeft: "-43%",
      borderRadius: "100px"
    }

    return (
      <span className={cx("emoji-backdrop", classes)} style={styles} />
    );
  },

  render: function () {
    var emojiImage = emojione.toImage(this.props.emoji);
    var classes = {
      "emoji-wrapper": true
    };

    if (this.props.className) {
      classes[this.props.className] = true;
    }

    return (
      <span {...this.props} className={cx(classes)}>
        { this.renderBackdrop(this.props.zDepth) }
        <span dangerouslySetInnerHTML={{ __html: emojiImage }} />
      </span>
    );
  }

})
