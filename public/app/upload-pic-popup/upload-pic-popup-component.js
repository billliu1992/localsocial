define([
	'react'
], function(
	React
) {
	'use strict';

	var UploadPicPopup = React.createClass({
		getInitialState() {
			return {
			}
		},
		render() {
			return <div>
				<form onSubmit={this.doSubmit}>
					<input type="file" onChange={this.doUpload} />
					<img src={this.state.imageUrl} />
					<button>Submit</button>
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
		doSubmit(event) {

		}
	});

	return UploadPicPopup;
});