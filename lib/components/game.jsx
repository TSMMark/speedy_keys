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

var isPartialMatch = function (wholeWord, partialWord) {
  return wholeWord.indexOf(partialWord) === 0;
}

Components.Game = React.createClass({
  getInitialState: function () {
    return {
      lastInputValue: undefined
    }
  },

  render: function () {
    var self = this
      , inputValue = self.props.inputValue
      , currentWordIndex = self.currentWordIndex()
      , words = this.props.words.map(function (word, index) {
          var active = index === currentWordIndex
            , pending = index > currentWordIndex
            , enteredWord = active ? inputValue : self.props.enteredWords[index]
            , fullMatch = enteredWord === word
            , invalid = active ? !isPartialMatch(word, enteredWord) : !fullMatch
            , classes = cx({
                "game-word": true,
                valid: fullMatch === true,
                invalid: !pending && invalid,
                active: active
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
          <ReactCSSTransitionGroup transitionName="game-word">
            {words}
          </ReactCSSTransitionGroup>
        </div>
        {form}
      </div>);
  },

  componentDidMount: function () {
    if (!this.canType()) return;

    var input = this.inputNode()
      , value = input.value;

    input.focus();
    input.value = "";
    input.value = value;
  },

  canType: function () {
    return this.props.playable &&
           this.currentWordIndex() < this.props.words.length;
  },

  handleKeyDown: function (event) {
    var self = this
      , currentWordIndex = self.currentWordIndex();

    if (!this.canType()) {
      event.preventDefault();
      return;
    }

    var value = this.inputNode().value.trim();

    if (isStopKeyCode(event.keyCode)) {
      event.preventDefault();
      if (value) {
        self.submitWord();
      }
      return;
    }

    if (isTypingEvent(event)) {
      if (value === this.state.lastInputValue) {
        return;
      }

      lastInputValue = value;

      setTimeout(this.handleInputValueChange, 0);
    }
  },

  isPartialMatch: function () {
    var inputValue = this.inputNode().value.trim()
      , currentWordIndex = this.currentWordIndex()
      , currentWord = this.props.words[currentWordIndex];

    return isPartialMatch(currentWord, inputValue);
  },

  isCompleteMatch: function () {
    var inputValue = this.inputNode().value.trim()
      , currentWordIndex = this.currentWordIndex()
      , currentWord = this.props.words[currentWordIndex];

    return currentWord === inputValue;
  },

  handleInputValueChange: function () {
    if (!this.props.onInputValueChange) return;

    var value = this.inputNode().value.trim();
    this.props.onInputValueChange(value);
  },

  submitWord: function () {
    if (!this.props.onSubmitWord) return;

    var input = this.inputNode()
      , value = input.value.trim();

    input.value = "";

    this.props.onSubmitWord(value);
  },

  issueChange: function () {
    if (this.props.onChange) {
      var value = this.inputNode().value.trim();
      this.props.onChange(
        value,
        this.props.enteredWords
      );
    }
  },

  currentWordIndex: function () {
    return this.props.enteredWords.length;
  },

  inputNode: function () {
    return this.refs["game-input"].getDOMNode();
  }
});
