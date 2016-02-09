define([
	'upload-pic-popup/previous-photos/previous-photos-component',
	'react',
	'config'
], function(
	PreviousPhotos,
	React,
	Config
) {
	'use strict';

	var MIN_IMAGE_SIZE = Config['MIN_PROFILE_SIZE'] || 120;
	var MAX_IMAGE_SIZE = Config['MAX_PROFILE_SIZE'] || 4000;

	var buildStyles = function(x, y, width, height) {
		return {
			left : x + 'px',
			top : y + 'px',
			width : width + 'px',
			height : height + 'px'
		};
	};

	var TaggableImage = React.createClass({
		getInitialState() {
			return {
				taggedBox : {
					x : 0,
					y : 0,
					width: 0,
					height: 0
				},
				dragStart : {
					x : 0,
					y : 0
				},
				image : {
					width: 0,
					height: 0
				},
				scale : 0,
				minTagBoxSize : 0,
				dragState : null
			};
		},
		render() {
			var taggedBox = this.state.taggedBox;

			return <div className="image-tag">
				<img src={this.props.src} onLoad={this.doImageLoad} />
				<div className="tag-box" draggable="true" onDragStart={this.doDragStart} onDrag={this.doDragBox} onDragEnd={this.doDragEnd} style={buildStyles(taggedBox.x, taggedBox.y, taggedBox.width, taggedBox.height)}>
					<div className="resize-corner" draggable="true" onDragStart={this.doDragStart} onDragEnd={this.doDragEnd} onDrag={this.doDragResize}></div>
				</div>
				<PreviousPhotos />
			</div>
		},
		doImageLoad(event) {
			var numberToCompute = Math.min(event.target.height, event.target.width);

			var centerX = Math.floor(event.target.width / 2);
			var centerY = Math.floor(event.target.height / 2);

			var squareHalfSize = Math.floor(numberToCompute / 6);

			var scale = event.target.naturalHeight / event.target.height;

			this.setState({
				taggedBox : {
					x : centerX - squareHalfSize,
					y : centerY - squareHalfSize,
					width : squareHalfSize * 2,
					height : squareHalfSize * 2
				},
				image : {
					width: event.target.width,
					height: event.target.height
				},
				scale,
				minTagBoxSize : MIN_IMAGE_SIZE / scale
			});

			this.doDragEnd();	// Update
		},
		doDragStart(event) {

			var boundingBox = event.target.getClientRects()[0];
			var mouseX = event.clientX - (boundingBox['left']);
			var mouseY = event.clientY - (boundingBox['top']);

			event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);	// Remove drag image

			this.setState({
				dragStart : {
					x : mouseX,
					y : mouseY
				}
			});
		},
		doDragBox(event) {
			event.preventDefault();

			// For some reason, last drag event has mouse position at 0
			if(event.clientX === 0 && event.clientY === 0) {
				return;
			}

			var boundingBox = event.target.getClientRects()[0];
			var mouseX = event.clientX - (boundingBox['left']);
			var mouseY = event.clientY - (boundingBox['top']);

			var newX = this.state.taggedBox.x - (this.state.dragStart.x - mouseX);
			var newY = this.state.taggedBox.y - (this.state.dragStart.y - mouseY);

			newX = Math.min(newX, this.state.image.width - this.state.taggedBox.width);
			newX = Math.max(newX, 0);
			newY = Math.min(newY, this.state.image.height - this.state.taggedBox.height);
			newY = Math.max(newY, 0);

			this.setState({
				taggedBox : {
					x : newX,
					y : newY,
					width : this.state.taggedBox.width,
					height : this.state.taggedBox.height
				}
			});

		},
		doDragResize(event) {
			if(event.clientX === 0 && event.clientY === 0) {
				return;
			}
			
			event.preventDefault();
			event.stopPropagation();

			var boundingBox = event.target.getClientRects()[0];
			var mouseX = event.clientX - (boundingBox['left']);
			var mouseY = event.clientY - (boundingBox['top']);


			var smallestDiff = Math.min((this.state.dragStart.x - mouseX), (this.state.dragStart.y - mouseY));

			this.setState({
				taggedBox : {
					x : this.state.taggedBox.x,
					y : this.state.taggedBox.y,
					width : this.state.taggedBox.width - smallestDiff,
					height : this.state.taggedBox.height - smallestDiff
				}
			});
		},
		doDragEnd() {
			if(this.props.onChange) {
				this.props.onChange({
					x : Math.floor(this.state.taggedBox.x * this.state.scale),
					y : Math.floor(this.state.taggedBox.y * this.state.scale),
					width : Math.floor(this.state.taggedBox.width * this.state.scale),
					height : Math.floor(this.state.taggedBox.height * this.state.scale)
				});
			}
		}
	});

	return TaggableImage;
});