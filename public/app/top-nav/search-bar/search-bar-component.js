define([
	'components/search-service.js',
	'top-nav/search-bar/quick-results/quick-results-component',
	'react'
], function(
	SearchService,
	QuickResultsComponent,
	React
) {
	var SearchBar = React.createClass({
		getInitialState() {
			return {
				query: '',
				results: [],
			}
		},
		render() {
			return <div className="search-bar">
				<input type="text" placeholder="Search" onChange={this.updateSearchQuery} />
				<button className="do-query">Go</button>
				<QuickResultsComponent results={this.state.results} onChange={this.searchCurrentQuery} />
			</div>;
		},
		updateSearchQuery(event) {
			var query = event.target.value;

			this.setState({query});

			SearchService.search(query).then((response) => {
				this.setState({
					results : response.results
				});
			});
		},
		searchCurrentQuery() {
			SearchService.search(this.state.query).then((response) => {
				this.setState({
					results : response.results
				});
			});
		}
	});

	return SearchBar;
});