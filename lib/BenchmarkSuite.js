define([
	'dojo-ts/Deferred',
	'dojo-ts/lang',
	'dojo-ts/promise/when',
	'dojo-ts/topic',
	'./Suite'
], function (Deferred, lang, when, topic, Suite) {
	function BenchmarkSuite(kwArgs) {
		this.tests = [];
		for (var k in kwArgs) {
			this[k] = kwArgs[k];
		}
	}

	BenchmarkSuite.prototype = lang.mixin(new Suite(), {

		run: function () {
			/**
			 * Convenience mechanism for calling pre/post test methods which captures and handles errors that might be
			 * raised by these methods.
			 */
			function call(name) {
				var result;
				try {
					result = self[name] && self[name]();
				}
				catch (error) {
					handleFatalError(error);
				}

				return when(result).then(null, handleFatalError);
			}

			function runNextTest() {
				var test = tests[i++];
				if (test) {
					call('beforeEach').then(function () {
						test.run().always(function () {
							call('afterEach').then(runNextTest);
						});
					});
				}
				else {
					finishRun();
				}
			}

			function handleFatalError(error) {
				self.error = error;
				topic.publish('/suite/error', self);
				topic.publish('/error', error);
				finishRun(error);
			}

			function finishRun(error) {
				if (self.publishAfterSetup) {
					topic.publish('/suite/end', self);
				}

				call('teardown').always(function () {
					if (!self.publishAfterSetup) {
						topic.publish('/suite/end', self);
					}
					error ? dfd.reject(error) : dfd.resolve();
				});
			}

			var dfd = new Deferred(),
				self = this,
				tests = this.tests,
				i = 0;

			if (!self.publishAfterSetup) {
				topic.publish('/suite/start', self);
			}

			call('setup').then(function () {
				if (self.publishAfterSetup) {
					topic.publish('/suite/start', self);
				}
			}).then(runNextTest);

			return dfd.promise;
		},

		toJSON: function () {
			return {
				name: this.name,
				sessionId: this.sessionId,
				hasParent: !!this.parent,
				tests: this.tests.map(function (test) { return test.toJSON(); }),
				numTests: this.numTests,
				numFailedTests: this.numFailedTests,
				error: this.error ? {
					name: this.error.name,
					message: this.error.message,
					stack: this.error.stack
				} : null
			};
		}
	});

	return BenchmarkSuite;

});