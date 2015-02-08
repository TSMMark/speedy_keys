var isStopKeyCode = function (code) {
  return code == 32 || code == 13;
};

var isTypingEvent = function (event) {
  return isValidKeyCode(event.keyCode) && !hasModifier(event);
}

var isValidKeyCode = function (code) {
  if (code == 8 || code == 46) return true;
  if (code >= 48 && code <= 90) return true;
  if (code >= 96 && code <= 111) return true;
  if (code >= 186 && code <= 222) return true;
  return false;
}

var hasModifier = function (event) {
  return event.ctrlKey || event.altKey || event.metaKey;
}

Components.Game = React.createClass({
  getInitialState: function () {
    return {
      currentWordIndex: this.props.currentWordIndex,
      wordStatuses: this.props.wordStatuses
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
               key="game-input"
               readOnly={!this.canType()}
               onKeyDown={this.handleKeyDown}
               defaultValue={this.props.inputValue} />
      </div>);

    return (
      <div className="game">
        <div className="game-words-container">
          {words}
        </div>
        {form}
      </div>);
  },

  componentDidMount: function () {
    if (!this.canType()) return;

    var input = this.refs["game-input"].getDOMNode()
      , value = input.value;

    input.focus();
    input.value = "";
    input.value = value;
  },

  canType: function () {
    return this.props.playable &&
           this.state.currentWordIndex < this.props.words.length;
  },

  handleKeyDown: function (event) {
    var self = this
      , currentWordIndex = self.state.currentWordIndex;

    if (!this.canType()) {
      event.preventDefault();
      return;
    }


    if (isStopKeyCode(event.keyCode)) {
      event.preventDefault();
      self.submitWord();
      return;
    }

    if (isTypingEvent(event)) {
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

        self.issueChange(currentWordIndex);
      }, 0);

      return;
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

    this.issueChange(currentWordIndex + 1);
  },

  issueChange: function (wordIndex) {
    var value;
    if (this.props.onChange) {
      value = this.refs["game-input"].getDOMNode().value.trim();
      this.props.onChange(
        value,
        wordIndex,
        this.state.wordStatuses
      );
    }
  }
});
