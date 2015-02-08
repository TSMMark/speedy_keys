Components.Game = React.createClass({
  getInitialState: function () {
    return {
      currentWordIndex: 0,
      wordStatuses: []
    };
  },

  render: function () {
    var self = this
      , words = this.props.words.map(function (word, index) {
          var satus = self.state.wordStatuses[index]
            , classes = cx({
                "game-word": true,
                valid: satus === true,
                invalid: satus === false,
                active: index == self.state.currentWordIndex
              });
          return (<span className={classes} key={index}>{word}</span>);
        })
      , form;

    form = (
      <div className="input-group input-group-lg">
        <input type="text" className="form-control"
               id="game-input" ref="game-input"
               readOnly={!this.canType()}
               onKeyDown={this.handleKeyDown} />
      </div>);

    return (
      <div className="game">
        <div className="game-words-container">
          {words}
        </div>
        {form}
      </div>);
  },

  canType: function () {
    return this.props.playable &&
           this.state.currentWordIndex < this.props.words.length;
  },

  handleKeyDown: function (event) {
    var SPACE = 32, RETURN = 13
      , self = this
      , currentWordIndex = self.state.currentWordIndex;

    if (!this.canType()) {
      event.preventDefault();
      return;
    }

    switch (event.keyCode) {
      case SPACE:
      case RETURN:
        event.preventDefault();
        self.submitWord();
        break;
      default:
        setTimeout(function () {
          if (self.isCompleteMatch()) {
            self.state.wordStatuses[currentWordIndex] = true;
          }
          else if (!self.isPartialMatch()) {
            self.state.wordStatuses[currentWordIndex] = false;
          }
          else {
            self.state.wordStatuses[currentWordIndex] = undefined;
          }
          self.setState({});
        }, 0);
    }
  },

  isPartialMatch: function () {
    var inputValue = this.refs["game-input"].getDOMNode().value.trim()
      , currentWordIndex = this.state.currentWordIndex
      , currentWord = this.props.words[currentWordIndex];

    return currentWord.indexOf(inputValue) === 0;
  },

  isCompleteMatch: function () {
    var inputValue = this.refs["game-input"].getDOMNode().value.trim()
      , currentWordIndex = this.state.currentWordIndex
      , currentWord = this.props.words[currentWordIndex];

    return currentWord === inputValue;
  },

  submitWord: function () {
    var input = this.refs["game-input"].getDOMNode()
      , currentWordIndex = this.state.currentWordIndex
      , valid = this.isCompleteMatch()

    this.state.wordStatuses[currentWordIndex] = valid;
    input.value = "";

    this.setState({
      currentWordIndex: currentWordIndex + 1
    })
  }
});
