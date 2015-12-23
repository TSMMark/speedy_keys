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

  propTypes: function () {
    return {
      player: React.PropTypes.instanceOf(Models.User),
      opponent: React.PropTypes.instanceOf(Models.User),
      playerProgress: React.PropTypes.number,
      opponentProgress: React.PropTypes.number
    }
  },

  getDefaultProps: function () {
    return {
      ready: false
    }
  },

  getInitialState: function () {
    return {
      inputValue: this.props.inputValue
    };
  },

  componentDidMount: function () {
    this.scrollText();

    if (!this.props.playable) {
      this.interval = setInterval(this.scrollText, 400);
    }

    this.focusInput();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      inputValue: nextProps.inputValue
    });
  },

  componentDidUpdate: function () {
    this.focusInput();
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
    this.stopScrollText();
    this.stopScrollScreen();
  },

  focusInput: _.throttle(function () {
    if (!this.canType()) return;

    var input = this.inputNode()
      , value = input.value;

    input.focus();
    input.value = "";
    input.value = value;

    this.scrollScreen();
  }, 200),

  scrollText: function () {
    var activeWordRef = this.refs["active-word"];

    if (!activeWordRef) return;

    var $activeWord = $(activeWordRef)
      , $container = $(this.refs["container"])
      , currentScrollTop = $container.scrollTop()
      , wordTop = $activeWord.position().top
      , lineHeight = $activeWord.outerHeight(true)
      , newScrollTop = currentScrollTop + wordTop - lineHeight;

    if (Math.abs(newScrollTop - currentScrollTop) < 1) return;

    this.stopScrollText();
    this.scrollTextAnimation = $container.animate({ scrollTop: newScrollTop }, 400);
  },

  stopScrollText: function () {
    if (this.scrollTextAnimation) {
      this.scrollTextAnimation.stop(true, false);
    }
  },

  scrollScreen: function () {
    var $window = $(window)
      , $htmlBody = $("html, body")
      , currentScrollTop = $window.scrollTop()
      , $game = $(this.refs["game"])
      , gameTop = $game.offset().top
      , gameBottom = gameTop + $game.outerHeight(true)
      , windowHeight = window.innerHeight
      , newScrollTop = gameBottom - windowHeight + 3;

    if (Math.abs(newScrollTop - currentScrollTop) < 1) return;

    this.stopScrollScreen();
    this.scrollScreenAnimation = $htmlBody.animate({ scrollTop: newScrollTop }, 400);
  },

  stopScrollScreen: function () {
    if (this.scrollScreenAnimation) {
      this.scrollScreenAnimation.stop(true, false);
    }
  },

  canType: function () {
    return this.props.ready &&
           this.props.playable &&
           this.currentWordIndex() < this.props.words.length;
  },

  isPartialMatch: function () {
    var inputValue = this.state.inputValue
      , currentWordIndex = this.currentWordIndex()
      , currentWord = this.props.words[currentWordIndex];

    if (!currentWord) return false;

    return isPartialMatch(currentWord, inputValue);
  },

  isCompleteMatch: function () {
    var inputValue = this.state.inputValue
      , currentWordIndex = this.currentWordIndex()
      , currentWord = this.props.words[currentWordIndex];

    return currentWord === inputValue;
  },

  submitWord: function () {
    if (!this.props.onSubmitWord) return;

    var input = this.inputNode()
      , value = this.state.inputValue;

    input.value = "";

    this.props.onSubmitWord(value);

    setTimeout(this.scrollText, 0);
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
    return this.refs["game-input"];
  },

  handleKeyDown: function (event) {
    var currentWordIndex = this.currentWordIndex();

    if (!this.canType()) {
      event.preventDefault();
      return;
    }

    var value = this.inputNode().value.trim();

    if (isStopKeyCode(event.keyCode)) {
      event.preventDefault();
      if (value) {
        this.submitWord();
      }
      return;
    }

    if (!isTypingEvent(event)) {
      return;
    }

    var typedChar = String.fromCharCode(event.keyCode);

    typedChar = event.shiftKey ? typedChar.toUpperCase() : typedChar.toLowerCase(); // Lowercase unless shift key down.
    value += typedChar;

    console.log("handleKeyDown", value, event.shiftKey);

    if (value === this.state.inputValue) {
      return;
    }

    setTimeout(this.handleInputValueChange, 0);
  },

  handleInputValueChange: function () {
    if (!this.props.onInputValueChange) return;

    var value = this.inputNode().value.trim();

    this.setState({
      inputValue: value
    }, function () {
      this.props.onInputValueChange(value);
    }.bind(this));

    this.props.onInputValueChange(value);
  },

  render: function () {
    var inputValue = this.state.inputValue
      , currentWordIndex = this.currentWordIndex()
      , player = this.props.player
      , opponent = this.props.opponent
      , words = _.map(this.props.words, function (word, index) {
          var active = index === currentWordIndex
            , pending = index > currentWordIndex
            , enteredWord = active ? inputValue : this.props.enteredWords[index]
            , fullMatch = enteredWord === word
            , isPartialMatch = this.isPartialMatch(word, enteredWord)
            , invalid = active ? !isPartialMatch : !fullMatch
            , correctLettersCount = active && (isPartialMatch || fullMatch) ? enteredWord.length : 0
            , classes = cx({
                "game-word": true,
                valid: fullMatch === true,
                invalid: !pending && invalid,
                active: active
              })
            , correctLetters
            , neutralLetters;

          correctLetters = word.slice(0, correctLettersCount);
          neutralLetters = word.slice(correctLettersCount);

          return (
            <span className={classes} key={index}
                  ref={active ? "active-word" : undefined}>
              <span className="correct-letters">{correctLetters}</span>
              <span className="neutral-letters">{neutralLetters}</span>
            </span>
          );
        }, this)
      , canType = this.canType()
      , form
      , playerProgress = this.props.playerProgress
      , opponentProgress = this.props.opponentProgress
      , typeEvent = canType ? this.handleKeyDown : undefined;

    form = (
      <div className="input-group input-group-lg">
        <input type="text" className="game-input"
               placeholder={canType ? "Tap here and start typing!" : null}
               autoCorrect="off"
               autoFill="off"
               autoCapitalize="off"
               ref="game-input" key="game-input"
               readOnly={!canType}
               onKeyDown={typeEvent}
               onFocus={canType ? this.scrollScreen : undefined}
               defaultValue={canType ? this.props.inputValue : undefined}
               value={!canType ? this.props.inputValue : undefined} />
      </div>);

    return (
      <div className="game" ref="game">
        <div className="game-words-container" ref="container">
          <ReactCSSTransitionGroup transitionName="game-word"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
            {words}
          </ReactCSSTransitionGroup>
        </div>
        {form}
        <Components.PlayersProgress dual={this.props.dual}
                                    playerProgress={playerProgress}
                                    opponentProgress={opponentProgress}
                                    playerEmoji={player.props.profile.emoji}
                                    opponentEmoji={opponent.props.profile.emoji} />
      </div>);
  }

});
