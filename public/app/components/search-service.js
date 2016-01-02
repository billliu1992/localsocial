define([
	'components/log-service',
	'axios'
], function(
	LogService,
	axios
) {
	var createEmptyPromise = function() {
		return new Promise((resolve, reject) => resolve({ results : [] }));
	}

	var SearchService = {
		MIN_QUERY_LENGTH : 3,
		search(query) {
			if(query.length < this.MIN_QUERY_LENGTH) {
				return createEmptyPromise();
			}

			return axios.get('/search?limit=5&query=' + query).then(
				(response) => response.data,
				(response) => {
					LogService.log('Failed to search: ' + response.status);
				}
			);
		}
	};

	return SearchService;
});