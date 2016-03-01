define([
], function(
) {
	'use strict';

	var InfiniteScrollMixin = {
		getInitialState() {
			return {
				scrollPage : 1,
				scrollMaxId : null,
				scrollFetching : false,
				scrollHasMore : true
			};
		},
		doInfiniteScrollElement : function(target, fetchThreshold, callback) {
			if(!this.state.scrollFetching && this.state.scrollHasMore) {
				if(target.scrollHeight - (target.scrollTop + target.clientHeight) < fetchThreshold) {
					callback(this.state.scrollMaxId, this.state.scrollPage + 1, this.onScrollFinishFetching, this.onScrollNoMore);

					this.onScrollBottom();
				}
			}
		},
		doInfiniteScroll : function(fetchThreshold, callback) {
			return (event) => {
				this.doInfiniteScrollElement(event.currentTarget, fetchThreshold, callback);
			};
		},
		setScrollMaxId : function(scrollMaxId) {
			this.setState({
				scrollMaxId
			});
		},
		onScrollBottom : function() {
			this.setState({
				scrollPage : this.state.scrollPage + 1,
				scrollFetching : true
			});
		},
		onScrollFinishFetching : function() {
			this.setState({
				scrollFetching : false
			});
		},
		onScrollNoMore : function() {
			this.setState({
				scrollHasMore : false
			});
		}
	}

	return InfiniteScrollMixin;

});