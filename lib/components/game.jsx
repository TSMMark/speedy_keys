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
  render: function () {
    var self = this
      , words = this.props.words.map(function (word, index) {
          var satus = self.props.wordStatuses[index]
            , classes = cx({
                "game-word": true,
                valid: satus === true,
                invalid: satus === false,
                active: index == self.props.currentWordIndex
              });
          return (<span className={classes} key={index}>{word}</span>);
        })
      , canType = this.canType()
      , form;

    form = (
      <div className="input-group input-group-lg">
        <input type="text" className="form-control game-input"
               ref="game-input"
               key="game-input"
               readOnly={!canType}
               onKeyDown={canType ? this.handleKeyDown : undefined}
               defaultValue={canType ? this.props.inputValue : undefined}
               value={!canType ? this.props.inputValue : undefined} />
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
           this.props.currentWordIndex < this.props.words.length;
  },

  handleKeyDown: function (event) {
    var self = this
      , currentWordIndex = self.props.currentWordIndex;

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
          self.props.wordStatuses[currentWordIndex] = true;
        }
        else if (!self.isPartialMatch()) {
          self.props.wordStatuses[currentWordIndex] = false;
        }
        else {
          self.props.wordStatuses[currentWordIndex] = undefined;
        }

        self.issueChange(currentWordIndex);
      }, 0);

      return;
    }
  },

  isPartialMatch: function () {
    var inputValue = this.refs["game-input"].getDOMNode().value.trim()
      , currentWordIndex = this.props.currentWordIndex
      , currentWord = this.props.words[currentWordIndex];

    return currentWord.indexOf(inputValue) === 0;
  },

  isCompleteMatch: function () {
    var inputValue = this.refs["game-input"].getDOMNode().value.trim()
      , currentWordIndex = this.props.currentWordIndex
      , currentWord = this.props.words[currentWordIndex];

    return currentWord === inputValue;
  },

  submitWord: function () {
    var input = this.refs["game-input"].getDOMNode()
      , currentWordIndex = this.props.currentWordIndex
      , valid = this.isCompleteMatch()

    this.props.wordStatuses[currentWordIndex] = valid;
    input.value = "";

    this.issueChange(currentWordIndex + 1);
  },

  issueChange: function (wordIndex) {
    if (this.props.onChange) {
      var value = this.refs["game-input"].getDOMNode().value.trim();
      this.props.onChange(
        value,
        wordIndex,
        this.props.wordStatuses
      );
    }
  }
});
