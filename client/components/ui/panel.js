var React = require("react"),
    dom = React.DOM;

module.exports = React.createClass({
  render: function() {
    var heading = null;
    if (this.props.title) {
      heading = dom.div({ className: "panel-heading" }, this.props.title);
    }
    return dom.div({ className: "panel panel-default" },
      heading,
      dom.div({ className: "panel-body" },
        this.props.children
      )
    );
  }
});
