Views.NotFound = React.createClass({

  getDefaultProps: function () {
    return {
      message: "Oops! Something went wrong.",
      submessage: "We couldn't find what you were looking for."
    }
  },

  render: function () {
    return (
      <Components.Container>
        <h1>{this.props.message}</h1>
        <h2>{this.props.submessage}</h2>
        <footer className="footer">
          <Components.Container>
            <Link to="/" className="btn btn-default btn-block">Go Back</Link>
          </Components.Container>
        </footer>
      </Components.Container>
    );
  }

});
