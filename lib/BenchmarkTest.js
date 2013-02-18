define([
	'dojo-ts/Deferred',
	'dojo-ts/promise/when',
	'dojo-ts/errors/CancelError',
	'dojo-ts/topic',
	'./stats'
], function (Deferred, when, CancelError, topic, stats) {

	function BenchmarkTest(kwArgs) {
		this.results = [];
		for (var k in kwArgs) {
			this[k] = kwArgs[k];
		}
	}

	BenchmarkTest.prototype = {
		constructor: BenchmarkTest,
		name: '',
		test: null,
		duration: 5000,
		isAsync: false, // Not implemented yet
		timeElapsed: null,
		cycleResolution: 250,
		results: [],
		stats: null,
		error: null,

		/**
		 * The unique identifier of the test, assuming all combinations of suite + test are unique.
		 */
		get id() {
			var name = [],
				object = this;

			do {
				name.unshift(object.name);
			} while ((object = object.parent));

			return name.join(' - ');
		},

		/**
		 * The WebDriver interface for driving a remote environment.
		 * @see Suite#remote
		 */
		get remote() {
			return this.parent.remote;
		},

		get sessionId() {
			return this.parent.sessionId;
		},

		run: function () {

			function handleTestError(error) {
				self.error = error;
				topic.publish('/bench/fail', self);
				topic.publish('/bench/end', self);
				dfd.reject(error);
			}

			/*
			 * Determines the number of iterations of the test needed to achieve the cycleResolution.  This is needed
			 * because the standard JavaScript timing granularity is unreliable for time periods of less than 150ms
			 * therefore the number of tests needs to be run in order to ensure they take at least 150ms and then
			 * those tests can be run in a cycle for the full duration of the test and the individual test runs can
			 * be extrapolated from the duration of the cycle.
			 */
			function calibrate() {
				var start = Date.now(),
					count = 0;

				do {
					count++;
					try {
						self.test();
					}
					catch (error) {
						handleTestError(error);
					}
				}
				while (Date.now() - start <= self.cycleResolution);

				return count;
			}

			/*
			 * Executes a number of iterations of tests
			 */
			function cycle(iterations) {
				var start = Date.now();
				for (var i = 0; i < iterations; i++) {
					self.test();
				}
				return Date.now() - start;
			}

			var self = this,
				testCount = 0,
				cycleCount = 0,
				dfd = new Deferred();

			topic.publish('/bench/start', self);
			setTimeout(function () {
				self.timeElapsed = 0;

				var iterations = calibrate();

				try {
					do {
						duration = cycle(iterations);
						self.timeElapsed += duration;
						self.results.push(duration);
						cycleCount++;
						testCount += iterations;
					}
					while (self.timeElapsed < self.duration);
				}
				catch (error) {
					handleTestError(error);
				}

				self.stats = {
					cycleCount: cycleCount,
					testsPerCycle: iterations,
					count: testCount,
					mean: stats.mean(self.results)/iterations,
					min: Math.min.apply(null, self.results)/iterations,
					max: Math.max.apply(null, self.results)/iterations,
					variance: stats.variance(self.results)/iterations,
					standardDeviation: stats.standardDeviation(self.results)/iterations
				};

				topic.publish('/bench/complete', self);
				topic.publish('/bench/end', self);
				dfd.resolve(self.results);
			}, 0);

			return dfd.promise;
		},

		toJSON: function () {
			return {
				name: this.name,
				sessionId: this.sessionId,
				id: this.id,
				duration: this.duration,
				isAsync: this.isAsync,
				timeElapsed: this.timeElapsed,
				cycleResolution: this.cycleResolution,
				results: this.results,
				stats: this.stats,
				error: this.error ? {
					name: this.error.name,
					message: this.error.message,
					stack: this.error.stack
				} : null
			};
		}
	};

	return BenchmarkTest;

});