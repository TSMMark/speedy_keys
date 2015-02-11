Controllers.PlayGame = React.createClass({
  mixins: [Router.State, Router.Navigation, ReactMeteor.Mixin],

  getMeteorState: function () {
    // This is the only fucking way I could get it to autorun:
    Session.set("gameId", this.getParams().gameId);
    Session.get("gameId");

    Meteor.subscribe("games");

    var gameId = this.getParams().gameId
      , game = Models.Game.findById(gameId)
      , currentUserId = this.props.currentUser._id;

    return {
      gameId: gameId,
      game: game,
      opponent: game && game.opponentOf(currentUserId)
    };
  },

  render: function () {
    var currentUser = this.props.currentUser
      , gameId = this.state.gameId
      , game = this.state.game;

    if (!game) {
      return (<Views.NotFound key="not-found"/>);
    }

    if (!this.state.opponent) {
      return (<Views.WaitForOpponent key="waiting"/>);
    }

    return (
      <Views.Game currentUser={Models.User.initRaw(currentUser)}
                  opponent={this.state.opponent}
                  game={game}
                  key={"game:" + gameId}/>);
  }
});
