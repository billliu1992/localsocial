define([
], function(
) {
	'use strict';

	var NotificationService = {
		'NOTIFICATION_TYPES' : {
			'request_pending' : 'sent you a friend request',
			'request_accepted' : 'accepted your friend request',
			'follower' : 'followed you',
			'replied' : 'replied to your post',
			'liked' : 'liked your post'
		}
	};

	return NotificationService;
});