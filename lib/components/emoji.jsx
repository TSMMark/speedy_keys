Components.Emoji = React.createClass({

  propTypes: {
    emoji: React.PropTypes.string.isRequired
  },

  render: function () {
    var emojiImage = emojione.toImage(this.props.emoji);
    return <span className="emoji-wrapper" {...this.props} dangerouslySetInnerHTML={{ __html: emojiImage }}/>;
  }

})
