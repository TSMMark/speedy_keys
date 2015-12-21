Components.GameStatsTable = React.createClass({

  render: function () {
    var currentUserId = this.props.currentUserId
      , game = this.props.game
      , winnerId = game.props.winnerId
      , headers = []
      , wpms = []
      , completedWords = [];

    game.props.players.forEach(function (player, index) {
      var name = player.props.profile.name
        , wpm = game.props.playersWPMs[index]
        , completedWordsCount = game.props.playersEnteredWords[index].length
        , totalWordsCount = game.props.playersWords[index].length
        , words
        , isWinner = winnerId === player.props._id
        , isCurrentUser = currentUserId === player.props._id
        , classes = cx({
            "winner": isWinner,
            "my-stats": isCurrentUser
          });

      name = (
        <th className={classes} key={index}>
          {name}
        </th>);

      wpm = (
        <td className={classes} key={index}>
          {wpm.toFixed(2)}
        </td>);

      words = (
        <td className={classes} key={index}>
          {completedWordsCount}/{totalWordsCount}
        </td>);

      if (player.props._id === currentUserId) {
        headers.unshift(name);
        wpms.unshift(wpm);
        completedWords.unshift(words);
      }
      else {
        headers.push(name);
        wpms.push(wpm);
        completedWords.push(words);
      }
    });

    return (
      <table className="table game-stats-table">
        <thead>
          <tr>
            <th></th>
            {headers}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>WPM</th>
            {wpms}
          </tr>
          <tr>
            <th>Completed/Total Words</th>
            {completedWords}
          </tr>
        </tbody>
      </table>
    );
  }

});
