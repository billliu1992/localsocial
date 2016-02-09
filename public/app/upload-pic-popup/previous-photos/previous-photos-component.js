define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	'use strict';

	var PreviousPhotos = React.createClass({
		getInitialState() {
			return {
				photos : []
			}
		},
		componentWillMount() {
			UserService.getUploadedImages('me').then((photos) => {
				this.setState({
					photos
				});
			});
		},
		render() {
			var photoElements = this.state.photos.map((photo) => {
				return <div>
					<img src={'/image/' + photo['portrait_src']} key={photo.picture_id} />
				</div>;
			});

			return <div>
				{ photoElements }
			</div>;
		}
	});

	return PreviousPhotos;
});