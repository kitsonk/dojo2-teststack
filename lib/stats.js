define([
], function () {

	/* Statistical Maths taken from dojox/math/stats */

	var stats = {
		standardDeviation: function (a) {
			// summary:
			//		Returns the standard deviation of the passed arguments.
			// a: Number[]
			//		Array of numbers to calculate the standard deviation for.
			// returns: Number
			return Math.sqrt(stats.variance(a));
		},

		variance: function (a) {
			// summary:
			//		Find the variance in the passed array of numbers.
			// a: Number[]
			//		Array of numbers to calculate the variance for.
			// returns: Number
			var mean = 0,
				squares = 0;

			a.forEach(function (item) {
				mean += item;
				squares += Math.pow(item, 2);
			});
			return (squares / a.length) - Math.pow(mean / a.length, 2);
		},

		mean: function (a) {
			// summary:
			//		Returns the mean value in the passed array.
			// a: Number[]
			//		Array of numbers to calculate the variance for.
			// returns: Number
			var t = 0;
			a.forEach(function (v) {
				t += v;
			});
			return t / Math.max(a.length, 1);
		},

		median: function (a) {
			// summary:
			//		Returns the value closest to the middle from a sorted version of the passed array.
			// a: Number[]
			//		Array of number to find the median value for
			// returns: Number
			var t = a.slice(0).sort(function (a, b) {
				return a - b;
			});
			return (t[Math.floor(a.length / 2)] + t[Math.ceil(a.length / 2)])/2;
		}
	};

	return stats;
});