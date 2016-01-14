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
				isFocused: false
			}
		},
		render() {
			var searchClassName = 'search-bar';
			if(this.state.isFocused) {
				searchClassName += ' focused';
			}
			if(this.state.results.length == 0) {
				searchClassName += ' empty';
			}

			return <div className={ searchClassName } onBlur={this.doBlur}>
				<input className="search-input-bar" type="text" placeholder="Search" onChange={this.updateSearchQuery} onFocus={this.doFocus} />
				<button className="do-query">Go</button>
				<QuickResultsComponent results={this.state.results} onClick={this.doBlur} />
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
		},
		doFocus() {
			this.setState({ isFocused : true });
			this.searchCurrentQuery();
		},
		doBlur() {
			this.setState({ isFocused : false });
		}
	});

	return SearchBar;
});