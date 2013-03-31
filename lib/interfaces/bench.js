define([
	'dojo-ts/aspect',
	'../../main',
	'../BenchmarkSuite'
], function (aspect, main, BenchmarkSuite) {

	var currentSuite,
		suites = [];

	/**
	 * Register a Benchmark suite of tests based on a factory
	 *
	 * @param name String The name of the suite
	 * @param type String The type of the benchmark suite
	 * @param factory Function The factory function
	 */
	function registerFactoryBenchmarkSuite(name, type, factory) {
		var parentSuite = currentSuite;

		currentSuite = new BenchmarkSuite({
			name: name,
			type: type,
			parent: parentSuite
		});
		parentSuite.tests.push(currentSuite);

		suites.push(parentSuite);
		factory();
		currentSuite = suites.pop();
	}

	function registerSuite(name, type, factory) {
		if (!currentSuite) {
			main.suites.forEach(function (suite) {
				currentSuite = suite;
				registerFactoryBenchmarkSuite(name, type, factory);
				currentSuite = null;
			});
		}
		else {
			registerFactoryBenchmarkSuite(name, type, factory);
		}
	}

	return {
		/**
		 * Benchmarks a series of tests against each other, finding the fastest and the slowest test.
		 *
		 * @param name String
		 * @param factory Function
		 */
		benchmark: function (name, factory) {
			registerSuite(name, 'benchmark', factory);
		},

		/**
		 * Provides detailed performance information for each test, which can be used to compare performance of a test
		 * in an external system.
		 *
		 * @param name String
		 * @param factory Function
		 *
		 */
		baseline: function (name, factory) {
			registerSuite(name, 'baseline', factory);
		},

		/**
		 * Add a test to the current benchmark suite.
		 * Since Benchmark.js allows mutation of the arguments passed on .add(), that is allowed here, although the
		 * arity below is recommended.
		 *
		 * @param name String
		 * @param test Function
		 * @param options Object
		 */
		test: function (/*name, test, options*/) {
			currentSuite.addTest.apply(currentSuite, Array.prototype.slice.call(arguments));
		},

		/**
		 * Add a function that is called during the suite's setup
		 *
		 * @param fn Function The Function to be called during setup
		 */
		before: function (fn) {
			aspect.after(currentSuite, 'setup', fn);
		},

		/**
		 * Add a function that is called after the suite's teardown
		 *
		 * @param fn Function The Function to be called during teardown
		 */
		after: function (fn) {
			aspect.after(currentSuite, 'teardown', fn);
		}
	};
});