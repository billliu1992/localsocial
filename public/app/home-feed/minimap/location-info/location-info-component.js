define([
	'react'
], function(
	React
) {
	'use strict';

	var LocationInfo = React.createClass({
		render() {
			var postsElems = this.props.posts.map((post) => {
				return <div>
					<img src={post['portrait_src']} />
				</div>;
			});

			return <div>
				{postsElems}
			</div>;
		}
	});

	return LocationInfo;
});