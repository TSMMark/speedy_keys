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
    return {};
  },

  componentDidMount: function () {
    this.scrollText();

    if (!this.props.playable) {
      this.interval = setInterval(this.scrollText, 400);
    }

    this.focusInput();
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

  render: function () {
    var self = this
      , inputValue = self.props.inputValue
      , currentWordIndex = self.currentWordIndex()
      , player = this.props.player
      , opponent = this.props.opponent
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

          return (
            <span className={classes} key={index}
                  ref={active ? "active-word" : undefined}>
              {word}
            </span>);
        })
      , canType = this.canType()
      , form
      , playerProgress = this.props.playerProgress
      , opponentProgress = this.props.opponentProgress
      , typeEvent = canType ? this.handleKeyDown : undefined;

    form = (
      <div className="input-group input-group-lg">
        <input type="text" className="form-control game-input"
               autoCorrect="off" autoCapitalize="off"
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
          <ReactCSSTransitionGroup transitionName="game-word">
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
  },

  scrollText: function () {
    var activeWordRef = this.refs["active-word"];

    if (!activeWordRef) return;

    var $activeWord = $(activeWordRef.getDOMNode())
      , $container = $(this.refs["container"].getDOMNode())
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
      , $game = $(this.refs["game"].getDOMNode())
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
      if (value === this.lastInputValue) {
        return;
      }

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

    this.lastInputValue = value;
    this.props.onInputValueChange(value);
  },

  submitWord: function () {
    if (!this.props.onSubmitWord) return;

    var input = this.inputNode()
      , value = input.value.trim();

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
    return this.refs["game-input"].getDOMNode();
  }
});

Components.ProgressBar = React.createClass({
  getDefaultProps: function () {
    return {
      modifier: 1.0
    }
  },

  render: function () {
    var style = this.styleFromPercent(
          this.props.progress * 100,
          this.props.style
        )
      , classes = {
          "progress-bar": true,
          "progress-bar-striped": true,
          "active": true
        };

    if (this.props.className) {
      classes[this.props.className] = true;
    }

    return (
      <div className={cx(classes)}
           style={style} />);
  },

  styleFromPercent: function (percent, additionalStyles) {
    var widthStyle = {
      width: (percent * this.props.modifier) + "%"
    }

    if (additionalStyles) {
     _.extend(widthStyle, additionalStyles);
    }

    return widthStyle;
  }
});

Components.PlayersProgress = React.createClass({

  propTypes: {
    dual: React.PropTypes.bool.isRequired,
    playerProgress: React.PropTypes.number,
    opponentProgress: React.PropTypes.number,
    playerEmoji: React.PropTypes.string.isRequired,
    opponentEmoji: React.PropTypes.string.isRequired
  },

  render: function () {

    var dual = this.props.dual
      , playerEmoji = this.props.playerEmoji
      , opponentEmoji = this.props.opponentEmoji
      , playerProgressBar
      , opponentProgressBar
      , playerProgressEmoji
      , opponentProgressEmoji
      , centerIndicator
      , modifier = dual ? 0.5 : 1.0;

    if (this.props.playerProgress >= 0) {
      playerProgressBar = (
        <Components.ProgressBar progress={this.props.playerProgress}
                                className="progress-bar-info player-progress"
                                modifier={modifier} />
      );

      playerProgressEmoji = (
        <div className="player-icon-container">
          <Components.Emoji emoji={playerEmoji}
            style={{ left: (this.props.playerProgress * 100) + "%" }} />
        </div>
      );
    }

    if (this.props.opponentProgress >= 0) {
      opponentProgressBar = (
        <Components.ProgressBar progress={this.props.opponentProgress}
                                className="progress-bar-danger opponent-progress"
                                style={{float: "right"}}
                                modifier={modifier} />
      );

      opponentProgressEmoji = (
        <div className="opponent-icon-container">
          <Components.Emoji emoji={opponentEmoji}
            style={{ right: (this.props.opponentProgress * 100) + "%" }} />
        </div>
      );
    }

    if (dual) {
      centerIndicator = <div className="center-indicator" />;
    }

    return (
      <div className={cx({ "progress": true, "dual-progress": dual })}>

        {centerIndicator}

        {playerProgressBar}
        {playerProgressEmoji}

        {opponentProgressBar}
        {opponentProgressEmoji}

      </div>);
  }
});
