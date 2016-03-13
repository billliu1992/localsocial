define([
	'profile-popup/profile-popup-component',
	'friend-requests-popup/friend-requests-popup-component',
	'components/user-service',
	'components/popup-service',
	'components/api-service',
	'axios'

], function(
	ProfilePopup,
	FriendRequestsPopup,
	UserService,
	PopupService,
	APIService,
	axios
) {
	'use strict';

	var NotificationService = {
		'NOTIFICATION_TYPES' : {
			'request_pending' : 'sent you a friend request',
			'request_accepted' : 'accepted your friend request',
			'follower' : 'followed you',
			'replied' : 'replied to your post',
			'liked' : 'liked your post'
		},
		notificationActions : {
			'request_pending' : (targetId) => {
				UserService.getCurrentUserInfo().then((profile) => {
					PopupService.showPopup(FriendRequestsPopup, { profile });
				});
			},
			'request_accepted' : (targetId) => {
				PopupService.showPopup(ProfilePopup, { userId : targetId });
			},
			'follower' : (targetId) => {
				PopupService.showPopup(ProfilePopup, { userId : targetId });
			},
			'replied' : (targetId) => {
				PopupService.showPopup(ProfilePopup, { userId : 'me' });
			},
			'liked' : (targetId) => {
				PopupService.showPopup(ProfilePopup, { userId : 'me' });
			}
		},
		doNotificationAction(notifyType, targetId) {
			return this.notificationActions[notifyType](targetId);
		},
		acknowledgeNotifications() {
			return APIService.filterResponse(axios.post('/user/me/notifications'));
		}
	};

	return NotificationService;
});