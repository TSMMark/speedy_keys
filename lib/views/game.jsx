var words = "greater had gathering void were under let itself it you're a isn't darkness shall made rule forth blessed void said together void moved moving make itself don't so seasons divide may isn't sixth us years without sea moving a night living deep lights itself be seed beginning so they're doesn't you'll don't great winged creepeth creeping dominion there a forth in also land fruit give two fowl unto dominion second fruitful meat likeness upon bring creepeth first kind all together he fruit in created day image very first moving bearing rule make male give great bring give brought hath said gathered isn't blessed which air earth moved fifth whose us rule gathered is abundantly void seasons had waters fruit rule were life yielding days won't signs called shall lesser fowl for under itself day moving behold very beast rule was beast there kind sixth creepeth seasons void gathering his creeping they're female man let upon fill shall and you're air behold moving lesser place after darkness one dry firmament you're shall he hath creature moved own herb unto saw signs winged abundantly meat land yielding i land his morning void two set is fly place midst dominion green".split(" ");
words = _.shuffle(words);

Views.PlayGame = React.createClass({
  mixins: [Router.State, Router.Navigation],

  render: function () {
    var currentUser = Meteor.user()
      , gameId = this.getParams().gameId
      , game
      , opponent;

    try {
      game = Models.Game.findById(gameId);
    } catch (e) {
      if (!(e instanceof Models.MissingRecordError)) throw e;
    }

    if (!game) return (<Views.NotFound/>);

    opponent = game.opponentOf(currentUser._id);
    if (!opponent) return (<Views.WaitForOpponent/>);

    return (
      <Views.Game currentUser={Models.User.initRaw(currentUser)}
                  opponent={opponent}
                  game={game}/>);
  }
});

Views.Game = React.createClass({
  render: function () {
    var currentUser = this.props.currentUser
      , currentUserId = currentUser.props._id
      , opponent = this.props.opponent
      , opponentId = opponent.props._id
      , game = this.props.game;

    return (
      <Components.Container>
        <h1>v.s. {opponent.props.profile.name} (aka Your Worst Nightmare)</h1>
        <div className="row">
          <div className="col-sm-6 clearfix">
            <h2>You</h2>
            <Components.Game words={game.wordsFor(currentUserId)}
                             key="currentUserGame"
                             playable={true}
                             ref="current-user-input"
                             onChange={this.userChange}
                             inputValue={game.getInputValueFor(currentUserId)}
                             currentWordIndex={game.getWordIndexFor(currentUserId)}
                             wordStatuses={game.getWordStatusesFor(currentUserId)} />
          </div>
          <div className="col-sm-6 clearfix">
            <h2>{opponent.props.profile.name}</h2>
            <Components.Game words={game.wordsFor(opponentId)}
                             key="opponentGame"
                             playable={false}
                             inputValue={game.getInputValueFor(opponentId)}
                             currentWordIndex={game.getWordIndexFor(opponentId)}
                             wordStatuses={game.getWordStatusesFor(opponentId)} />
          </div>
        </div>
      </Components.Container>
    );
  },

  userChange: function (value, wordIndex, wordStatuses) {
    var currentUserId = this.props.currentUser.props._id;
    this.props.game.setInputValueFor(currentUserId, value);
    this.props.game.setWordIndexFor(currentUserId, wordIndex);
    this.props.game.setWordStatusesFor(currentUserId, wordStatuses);
    this.props.game.save();
  }
});

Views.WaitForOpponent = React.createClass({
  getDefaultProps: function () {
    return {
      maxDots: 10,
      minDots: 0
    }
  },

  getInitialState: function () {
    return {
      dots: this.props.minDots
    }
  },

  render: function () {
    var dots = Array(this.state.dots + 1).join(".");

    return (
      <Components.Container>
        <h1>
          Waiting for opponent
          {dots}
        </h1>
      </Components.Container>);
  },

  incrementDots: function () {
    var dots = this.state.dots + 1;
    this.setState({
      dots: dots > this.props.maxDots ? this.props.minDots : dots
    });
  },

  componentDidMount: function () {
    this.interval = setInterval(this.incrementDots, 1000 / this.props.maxDots);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
    this.interval = undefined;
  }
});
