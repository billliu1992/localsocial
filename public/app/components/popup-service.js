define([
	'react',
	'react-dom',
], function(
	React,
	ReactDOM
) {
	'use strict';

	var POPUP_SELECTOR = '#popup';
	var POPUP_WRAPPER_SELECTOR = '#popup-wrapper';
	var OVERLAY_SELECTOR = '#popup-overlay';

	var popupWrapperElem = document.querySelector(POPUP_WRAPPER_SELECTOR);
	var popupContainerElem = document.querySelector(POPUP_SELECTOR);
	var popupOverlayElem = document.querySelector(OVERLAY_SELECTOR);

	var CurrentPopupClass = null;

	var renderPopupElement = function(PopupReactClass, props) {
		var element = ReactDOM.render(<PopupReactClass {...props} />, popupContainerElem);
	};
	var destroyPopupElement = function() {
		return ReactDOM.unmountComponentAtNode(popupContainerElem);
	};
	var doShowPopupClass = function() {
		var hiddenIndex = popupWrapperElem.className.indexOf('hidden');
		popupWrapperElem.className = popupWrapperElem.className.substring(0, hiddenIndex);
	};
	var doHidePopupClass = function() {
		if(popupWrapperElem.className.indexOf('hidden') === -1) {
			popupWrapperElem.className += 'hidden';
		}
	};

	popupOverlayElem.addEventListener('click', function() {
		PopupService.destroyPopup();
	});

	var hideRegisteredCallback = null;

	doHidePopupClass();	// hide initially

	var PopupService = {
		showPopup(PopupReactClass, props, showCallback, hideCallback) {
			CurrentPopupClass = PopupReactClass;

			renderPopupElement(PopupReactClass, props);
			doShowPopupClass();

			if(hideCallback) {
				hideRegisteredCallback = hideCallback;
			}
			if(showCallback) {
				showCallback();
			}
		},
		updatePopup(newProps, callback) {
			renderPopupElement(CurrentPopupClass, newProps);

			doShowPopupClass();

			if(callback) {
				callback();
			}
		},
		destroyPopup(secondHideCallback) {
			destroyPopupElement();
			doHidePopupClass();

			if(hideRegisteredCallback) {
				hideRegisteredCallback();
				hideRegisteredCallback = null;
			}
			if(secondHideCallback) {
				secondHideCallback();
			}
		}
	}

	return PopupService;
});