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
				}, () => {
					UserService.getUserProfilePic().then((profilePic) => {
						if(profilePic !== null) {
							for(var photoIdx in this.state.photos) {
								var photo = this.state.photos[photoIdx];
								if(profilePic['uploaded_picture_id'] === photo['picture_id']) {
									this.props.changePicture(profilePic['uploaded_picture_id'], photo['image_src'])
								}
							}
						}
					});
				});
			});
		},
		render() {
			var photoElements = this.state.photos.map((photo) => {
				return <div key={photo.picture_id} onClick={ this.selectPreviousPhoto(photo['picture_id'], photo['image_src']) }>
					<img src={photo['image_src']} />
				</div>;
			});

			return <div className="previous-photos">
				{ photoElements }
			</div>;
		},
		selectPreviousPhoto(id, src) {
			return (event) => {
				this.props.changePicture(id, src);
			}
		}
	});

	return PreviousPhotos;
});