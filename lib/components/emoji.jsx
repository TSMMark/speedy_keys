Components.Emoji = React.createClass({

  render: function () {
    var emojiImage = emojione.toImage(this.props.emoji);
    return <span dangerouslySetInnerHTML={{ __html: emojiImage }}/>;
  }

})
