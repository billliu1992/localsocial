define([
	'react',
	'config'
], function(
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

			var tagElement = null;
			if(this.state.taggedBox !== null) {
				tagElement = <div className="tag-box" draggable="true" onDragStart={this.doDragStart} onDrag={this.doDragBox} onDragEnd={this.updateTag} style={buildStyles(taggedBox.x, taggedBox.y, taggedBox.width, taggedBox.height)}>
					<div className="resize-corner" draggable="true" onDragStart={this.doDragStart} onDragEnd={this.updateTag} onDrag={this.doDragResize}></div>
				</div>
			}

			return <div className="image-tag">
				<img src={this.props.src} onLoad={this.doImageLoad} onClick={this.doNewTag} />
				{ tagElement }
			</div>
		},
		doImageLoad(event) {
			var scale = event.target.naturalHeight / event.target.height;
			var image = {
				width: event.target.width,
				height: event.target.height
			}

			this.setState({
				image,
				taggedBox : null,	// Reset
				scale,
				minTagBoxSize : MIN_IMAGE_SIZE / scale
			});

			if(this.props.onNewImage) {
				this.props.onNewImage({
					width: event.target.width,
					height: event.target.height
				});
			}
		},
		doNewTag(event) {
			var boundingBox = event.target.getClientRects()[0];
			var mouseX = event.clientX - (boundingBox['left']);
			var mouseY = event.clientY - (boundingBox['top']);

			var numberToCompute = Math.min(event.target.height, event.target.width);

			var squareHalfSize = Math.floor(numberToCompute / 6);

			var newTagX = Math.max(mouseX - squareHalfSize, 0);
			newTagX = Math.min(newTagX, event.target.width - (squareHalfSize * 2));
			//var newTagX = mouseX;

			var newTagY = Math.max(mouseY - squareHalfSize, 0);
			newTagY = Math.min(newTagY, event.target.height - (squareHalfSize * 2));

			this.setState({
				taggedBox : {
					x : newTagX,
					y : newTagY,
					width : squareHalfSize * 2,
					height : squareHalfSize * 2
				}
			}, this.updateTag);
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

			var newWidth = this.state.taggedBox.width - (this.state.dragStart.x - mouseX);
			var newHeight = this.state.taggedBox.height - (this.state.dragStart.y - mouseY);

			newWidth = Math.max(MIN_IMAGE_SIZE / this.state.scale, newWidth);
			newWidth = Math.min(this.state.image.width - this.state.taggedBox.x, newWidth);

			newHeight = Math.max(MIN_IMAGE_SIZE / this.state.scale, newHeight);
			newHeight = Math.min(this.state.image.height - this.state.taggedBox.y, newHeight);

			this.setState({
				taggedBox : {
					x : this.state.taggedBox.x,
					y : this.state.taggedBox.y,
					width : newWidth,
					height : newHeight
				}
			});
		},
		updateTag() {
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