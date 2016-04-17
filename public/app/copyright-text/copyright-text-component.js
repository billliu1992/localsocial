define([
	'react'
], function(
	React
) {
	var CopyrightText = React.createClass({
		render() {
			return <div className="copyright-text">
				<div className="text-entry">
					Hapnen &copy; 2016
				</div>
				<div className="text-entry">
					<a href="https://github.com/billliu1992/localsocial">Want to contribute?</a>
				</div> 
				<div className="text-entry">
					This product includes GeoLite2 data created by MaxMind, available from <a href="http://www.maxmind.com">http://www.maxmind.com</a>.
				</div>
			</div>
		}
	});

	return CopyrightText;
});