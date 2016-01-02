define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	var UserEntry = React.createClass({
		render() {
			var followElement = false;
			if(this.props.entry['is_following']) {
				followElement = <span className='follow'>Following</span>
			}

			var friendElement = false;
			if(this.props.entry['friend_status'] !== 'none') {
				var friendText = '';
				switch(this.props.entry['friend_status']) {
					case('friends'):
						friendText = 'Friends';
						break;
					case('pending'):
						friendText = 'Accept Friend Request';
						break;
					case('sent'):
						friendText = 'Request Sent';
						break;
				}

				friendElement = <span className='friend'>{friendText}</span>
			}


			return <div className="user-entry">
				<img src="/portrait/test" />
				<span className="user-name">{this.props.entry.name}</span>
				<span className="user-info">
					{ followElement }
					{ friendElement }
				</span>
			</div>;
		}
	});

	return UserEntry;
});