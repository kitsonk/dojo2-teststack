define([
	'dojo-ts/Deferred',
	'dojo-ts/promise/when',
	'dojo-ts/topic',
	'benchmark'
], function (Deferred, when, topic, Benchmark) {

	/**
	 * Convenience mechanism for calling pre/post test methods which captures and handles errors that might be
	 * raised by these methods.
	 */
	function call(self, name) {
		var result;
		try {
			result = self[name] && self[name]();
		}
		catch (error) {
			self.dfd.reject(error);
			result = dfd.promise;
		}

		return when(result);
	}

	/**
	 * A "wrapper" for Benchmark.js that provides an API similar to Suite, which is used by the bench interface
	 *
	 * @param kwArgs Object
	 */
	function BenchmarkSuite(kwArgs) {
		this.options = {};

		for (var k in kwArgs) {
			this[k] = kwArgs[k];
		}

		this.name = this.name || this.options.name;

		var suite = this.suite = new Benchmark.Suite(this.options),
			self = this;

		/*
		 * Benchmark.js has its own micro-library which provides events which get emitted.  This will then take the
		 * key events and publish them as topics to be handled by the reporters
		 */
		suite.on('complete', function (event) {
			self.event = event;
			if (self.publishAfterSetup) {
				topic.publish('/bench/end', self);
			}
			call(self, 'teardown').then(function () {
				if (!self.publishAfterSetup) {
					topic.publish('/bench/end', self);
				}
				self.dfd.resolve();
			}, function (error) {
				topic.publish('/bench/error', self);
				self.dfd.reject(error);
			});
		});

		suite.on('cycle', function (event) {
			self.event = event;
			topic.publish('/bench/cycle', self);
		});

		suite.on('error', function (event) {
			self.error = event.target.error;
			self.event = event;
			topic.publish('/bench/error', self);
			self.dfd.reject(self.error);
		});
	}

	BenchmarkSuite.prototype = {
		constructor: BenchmarkSuite,
		name: '',
		type: 'benchmark',
		parent: null,
		suite: null,
		options: null,
		setup: null,
		teardown: null,
		event: null,
		error: null,
		dfd: null,

		/**
		 * If true, the suite will only publish its start topic after the setup callback has finished,
		 * and will publish its end topic before the teardown callback has finished.
		 */
		publishAfterSetup: false,

		get id() {
			var name = [],
				object = this;

			do {
				name.unshift(object.name);
			} while ((object = object.parent));

			return name.join(' - ');
		},

		get numTests() {
			return this.suite.length;
		},

		get numFailedTests() {
			return this.suite.length - this.suite.filter('successful').length;
		},

		/**
		 * Execute the Benchmark.js test suite
		 */
		run: function () {
			var self = this;

			if (!self.publishAfterSetup) {
				topic.publish('/bench/start', self);
			}

			self.dfd = new Deferred();
			call(self, 'setup').then(function () {
				if (self.publishAfterSetup) {
					topic.publish('/bench/start', self);
				}
				self.suite.run({ 'async': true });
			});
			return self.dfd.promise;
		},

		/**
		 * Add a test to the Benchmark suite.
		 * Since Benchmark.js allows the .add() function arguments to mutate, it is illogical to force that onto
		 * downstream code.
		 *
		 * @param name String Name of the test
		 * @param fn Function The test function
		 * @param options Object A hash of configuration options
		 */
		addTest: function (/*name, fn, options*/) {
			this.suite.add.apply(this.suite, Array.prototype.slice.call(arguments));
		},

		/**
		 * Serialize the suite to an object which can be converted to JSON
		 */
		toJson: function () {
			return {
				name: this.name,
				type: this.type,
				hasParent: !!this.parent,
				suite: String(this.suite),
				options: this.options,
				numTests: this.numTests,
				numFailedTests: this.numFailedTests,
				error: this.error ? {
					name: this.error.name,
					message: this.error.message,
					stack: this.error.stack
				} : null
			};
		}
	};

	return BenchmarkSuite;
});