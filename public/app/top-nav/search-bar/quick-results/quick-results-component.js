define([
	'top-nav/search-bar/quick-results/user-entry/user-entry-component',
	'react'
], function(
	UserEntry,
	React
) {
	var QuickResults = React.createClass({
		render() {
			if(!this.props.results || this.props.results.length === 0) {
				return <div className="quick-results empty">
				</div>;
			}
			else {
				var resultsElements = this.props.results.map((entry) => <UserEntry key={entry.user_id} entry={entry} onClick={this.props.onClick} />);
				
				return <div className="quick-results">
					{ resultsElements }
				</div>;
			}
		}
	});

	return QuickResults;
});