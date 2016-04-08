define([
	'upload-pic-popup/taggable-profile-image/taggable-profile-image-component',
	'upload-pic-popup/previous-photos/previous-photos-component',
	'components/message-enabled-mixin',
	'components/user-service',
	'components/popup-service',
	'react'
], function(
	TaggableProfileImage,
	PreviousPhotos,
	MessageEnabledMixin,
	UserService,
	PopupService,
	React
) {
	'use strict';

	var UPLOAD_STATES = {
		NO_IMAGE : 'no-image',
		UPLOADING : 'uploading',
		UPLOADED : 'uploaded'
	};

	var UploadPicPopup = React.createClass({
		mixins : [ MessageEnabledMixin ],
		getInitialState() {
			return {
				currentState : UPLOAD_STATES.NO_IMAGE,
				imageObj : null,
				previousPictureId : null,
				errorMessage : null
			}
		},
		render() {
			var errorMessageElem = null;
			if(this.state.errorMessage !== '') {
				errorMessageElem = <div className="error-message">{this.getMessageText()}</div>;
			}

			return <div className={"upload-pic-popup " + this.state.currentState}>
				<TaggableProfileImage src={this.state.imageUrl} onChange={this.doImageTag} onNewImage={this.doImageUpdateProps} />
				<form onSubmit={this.doSubmit}>
					<div className="photo-selector">
						<div className="photo-form-field">
							<label forHtml="new-photo-upload">Upload a photo</label>
							<input type="file" onChange={this.doUpload} id="new-photo-upload" />
						</div>
						<div className="or-text">Or</div>
						<div className="photo-form-field">
							<label>Select a previous image</label>
							<PreviousPhotos changePicture={this.selectPreviousImage} />
						</div>
					</div>
					<div className="button-row">
						{ errorMessageElem }
						<button type="button" className="delete" onClick={this.deletePortrait}>Delete</button>
						<button>Submit</button>
						<button type="button" className="cancel" onClick={this.closePopup}>Cancel</button>
					</div>
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
			this.acknowledgeMessage();

			this.setState({
				imageUrl : pictureSrc,
				previousPictureId : pictureId,
				imageObj : null,
				currentState : UPLOAD_STATES.UPLOADED
			});
		},
		doImageTag(newTag) {
			this.acknowledgeMessage();

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

				UserService.uploadUserProfilePic(profilePicForm).then(() => {
					this.closePopup();
				},
				(reason) => {
					console.log(reason);
					this.setMessage('error', 'An error occurred. Please try again');
				});
			}
		},
		deletePortrait() {
			UserService.deleteUserProfilePic().then(() => {
				this.closePopup();
			});
		},
		closePopup() {
			PopupService.destroyPopup();
		}
	});

	return UploadPicPopup;
});