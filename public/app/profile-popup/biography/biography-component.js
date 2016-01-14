define([
	'components/user-service',
	'react'
],
function(
	UserService,
	React
) {
	'use strict';

	var BiographyComponent = React.createClass({
		getInitialState() {
			return {
				panel : 'display',
				biography : ''
			};
		},
		render() {
			var biographyTitle = <h2>About</h2>;

			var biographySection = null;
			if(this.state.panel === 'display') {
				var editButton = null;
				var zeroStateText = null;
				if(this.props.isSelf) {
					editButton = <a className="edit-button" onClick={this.showEditMode}>Edit</a>;
					zeroStateText = "Tell us something about yourself! Click the \"edit\" button above to begin.";
				}
				else {
					zeroStateText = "Nothing here yet!";
				}

				var biographyText = null;
				if(this.props.biography && this.props.biography.length > 0) {
					biographyText = <div className="biography-text">{ this.props.biography }</div>
				}
				else {
					biographyText = <div className="biography-text empty">{ zeroStateText }</div>
				}

				return <div className="biography profile-info">
					{ biographyTitle }
					{ editButton }
					{ biographyText }
				</div>;
			}
			else if(this.state.panel === 'edit') {
				return <div className="biography profile-info edit">
					{ biographyTitle }
					<textarea className="biography-edit" onChange={this.biographyChange} value={this.state.biography} />
					<button onClick={this.submitBiography}>Update</button>
					<button className="cancel" onClick={this.cancel}>Cancel</button>
				</div>;
			}
		},
		biographyChange(event) {
			this.setState({
				biography : event.target.value
			});
		},
		showEditMode() {
			this.setState({
				panel : 'edit',
				biography : this.props.biography
			});
		},
		showDisplayMode() {
			this.setState({
				panel : 'display'
			});
		},
		submitBiography() {
			UserService.updateBiography(this.state.biography).then(() => {
				this.props.onChange();
				this.showDisplayMode();
			});
		},
		cancel() {
			this.showDisplayMode();
		}
	});

	return BiographyComponent;
});