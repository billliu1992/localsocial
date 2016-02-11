define([
	'upload-pic-popup/taggable-profile-image/taggable-profile-image-component',
	'upload-pic-popup/previous-photos/previous-photos-component',
	'components/user-service',
	'react'
], function(
	TaggableProfileImage,
	PreviousPhotos,
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
				currentState : UPLOAD_STATES.NO_IMAGE,
				imageObj : null,
				previousPictureId : null
			}
		},
		render() {
			return <div className={"upload-pic-popup " + this.state.currentState}>
				<form onSubmit={this.doSubmit}>
					<TaggableProfileImage src={this.state.imageUrl} onChange={this.doImageTag} onNewImage={this.doImageUpdateProps} />
					<input type="file" onChange={this.doUpload} />
					<PreviousPhotos changePicture={this.selectPreviousImage} />
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
						imageUrl : loadEvent.target.result,
						imageObj : portraitFile,
						previousPictureId : null,
						currentState : UPLOAD_STATES.UPLOADED
					});
				};

				this.setState({
					currentState : UPLOAD_STATES.UPLOADING
				});

				reader.readAsDataURL(portraitFile);
			}
		},
		selectPreviousImage(pictureId, pictureSrc) {
			this.setState({
				imageUrl : pictureSrc,
				previousPictureId : pictureId,
				imageObj : null,
				currentState : UPLOAD_STATES.UPLOADED
			});
		},
		doImageTag(newTag) {
			this.setState({
				tag : newTag
			});
		},
		doImageUpdateProps(newImageProps) {
			this.setState({
				imageProps : newImageProps,
				tag : null
			});
		},
		doSubmit(event) {
			event.preventDefault();

			if(this.state.imageObj !== null || this.state.previousPictureId !== null) {
				var profilePicForm = new FormData();

				if(this.state.imageObj) {
					profilePicForm.append('image', this.state.imageObj);
				}
				else {
					profilePicForm.append('profile-picture-id', this.state.previousPictureId);
				}

				if(this.state.tag) {
					profilePicForm.append('crop-x', this.state.tag.x);
					profilePicForm.append('crop-y', this.state.tag.y);
					profilePicForm.append('width', this.state.tag.width);
					profilePicForm.append('height', this.state.tag.height);
				}
				else {
					profilePicForm.append('crop-x', 0);
					profilePicForm.append('crop-y', 0);
					profilePicForm.append('width', this.state.imageProps.width);
					profilePicForm.append('height', this.state.imageProps.height);
				}
				profilePicForm.append('privacy', 'public');

				UserService.uploadUserProfilePic(profilePicForm);
			}
		}
	});

	return UploadPicPopup;
});