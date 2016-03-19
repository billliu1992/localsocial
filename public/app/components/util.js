define([
], {
	/* See: http://stackoverflow.com/questions/9453421/how-to-round-float-numbers-in-javascript
		And: http://jsperf.com/decimal-rounding-tofixed-vs-math-round
	*/
	round(number, digits) {
		var roundingFactor = Math.pow(10, digits);
		
		return Math.round(number * roundingFactor) / roundingFactor;
	}
});