define([
	'upload-pic-popup/taggable-profile-image/taggable-profile-image-component',
	'components/user-service',
	'react'
], function(
	TaggableProfileImage,
	UserService,
	React
) {
	'use strict';

	var UPLOAD_STATES = {
		NO_IMAGE : 'no-image',
		UPLOADING : 'uploading',
		UPLOADED : 'uploaded'
	};

	var UploadPicPopup = React.createClass({
		getInitialState() {
			return {
				currentState : UPLOAD_STATES.NO_IMAGE
			}
		},
		render() {
			var wrapperClass = '';
			if(typeof this.state.imageUrl !== 'undefined') {
				wrapperClass = 'uploaded';
			}

			return <div className={this.state.currentState}>
				<form onSubmit={this.doSubmit}>
					<input type="file" onChange={this.doUpload} />
					<TaggableProfileImage src={this.state.imageUrl} onChange={this.doImageTag} />
					<button>Submit</button>
					<button type="button" className="cancel">Cancel</button>
				</form>
			</div>;
		},
		doUpload(event) {
			var files = event.target.files;
			if(files.length > 0) {
				var portraitFile = files[0];

				var reader = new FileReader();
				reader.onload = (loadEvent) => {
					this.setState({
						imageUrl : loadEvent.target.result
					});
				};

				this.setState({
					imageObj : portraitFile
				});

				reader.readAsDataURL(portraitFile);
			}
		},
		doImageTag(newTag) {
			this.setState({
				tag : newTag
			});
		},
		doSubmit(event) {
			event.preventDefault();

			if(typeof this.state.imageObj !== 'undefined') {
				var profilePicForm = new FormData();

				profilePicForm.append('image', this.state.imageObj);
				profilePicForm.append('crop-x', this.state.tag.x);
				profilePicForm.append('crop-y', this.state.tag.y);
				profilePicForm.append('width', this.state.tag.width);
				profilePicForm.append('height', this.state.tag.height);
				profilePicForm.append('privacy', 'public');

				UserService.uploadUserProfilePic(profilePicForm);
			}
		}
	});

	return UploadPicPopup;
});