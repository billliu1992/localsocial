define([
	'react'
], function(
	React
) {
	'use strict';

	var Reply = React.createClass({
		render() {
			var locationElement = null;
			if(this.props.location.city !== this.props.reply.location.city) {
				locationElement = (<div>this.props.reply.location.city</div>);
			}

			return (
				<div>
					Author: <span>{ this.props.reply.author_name }</span>
					{ locationElement }
					<div> { this.props.reply.reply_body } </div>
				</div>
			);
		}
	});

	return Reply;
});