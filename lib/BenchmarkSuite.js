define([
	'dojo-ts/Deferred',
	'dojo-ts/promise/when',
	'dojo-ts/topic',
	'benchmark'
], function (Deferred, when, topic, Benchmark) {
	function BenchmarkSuite(kwArgs) {
		this.options = {};

		for (var k in kwArgs) {
			this[k] = kwArgs[k];
		}

		this.name = this.name || this.options.name;

		var suite = this.suite = new Benchmark.Suite(this.options),
			self = this;

		suite.on('complete', function () {
			topic.publish('/bench/end', self);
			self.dfd.resolve();
		});

		suite.on('cycle', function (event) {
			self.event = event;
			topic.publish('/bench/cycle', self);
		});

		suite.on('error', function (event) {
			self.error = event.target.error;
			self.event = event;
			topic.publish('/bench/error', self);
		});
	}

	BenchmarkSuite.prototype = {
		constructor: BenchmarkSuite,
		name: '',
		parent: null,
		suite: null,
		options: null,
		event: null,
		error: null,
		dfd: null,

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

		run: function () {
			this.dfd = new Deferred();
			topic.publish('/bench/start', this);
			this.suite.run({ 'async': true });
			return this.dfd.promise;
		},

		toJson: function () {
			return {
				name: this.name,
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