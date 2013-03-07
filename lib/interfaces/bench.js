define([
	'dojo-ts/aspect',
	'dojo-ts/Deferred',
	'dojo-ts/lang',
	'dojo-ts/topic',
	'../../main',
	'./tdd',
	'../BenchmarkSuite'
], function (aspect, Deferred, lang, topic, main, tdd, BenchmarkSuite) {

	var currentSuite,
		suites = [];

	/*
	 * Register a Benchmark Suite of tests based on a descriptor
	 *
	 * @param descriptor Object An object which describes the comparison suite of tests
	 * @param parentSuite teststack/Suite The suite that will serve as the parent for the new suite
	 */
	function registerDescriptorBenchmarkSuite(descriptor, parentSuite) {
		var tests = {},
			options = {},
			type,
			value,
			name,
			key;

		function addTest(test) {
			tests[test.name] = test.test;
		}

		for (key in descriptor) {
			value = descriptor[key];
			switch (key) {
			case 'name':
				name = value;
				break;
			case 'type':
				type = value;
				break;
			case 'onStart':
			case 'onCycle':
			case 'onAbort':
			case 'onError':
			case 'onReset':
			case 'onComplete':
			case 'setup':
			case 'teardown':
				options[key] = value;
				break;
			case 'test':
				// A compare suite can specify a single test which is used for the comparison
				if (typeof value === 'function') {
					tests[descriptor.name] = value;
				}
				break;
			case 'tests':
				//
				if (typeof value === 'object' && 'forEach' in value) {
					value.forEach(addTest);
				}
				else if (typeof value === 'object') {
					for (var testKey in value) {
						tests[testKey] = value[testKey];
					}
				}
				break;
			default:
				if (typeof value === 'function') {
					tests[key] = value;
				}
			}
		}

		var bench = new BenchmarkSuite({
			name: name,
			type: type,
			parent: parentSuite,
			options: options
		});

		for (key in tests) {
			bench.suite.add(key, tests[key]);
		}

		parentSuite.tests.push(bench);
	}

	/*
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

	/*
	 * Return a Data Property Descriptor that is comparable to direct assignment to an object.
	 *
	 * @value Mixed The value to set the descriptor.value to.
	 * @returns Object The property descriptor
	 */
	function dataDescriptor(value) {
		return {
			value: value,
			writable: true,
			enumerable: true,
			configurable: true
		};
	}

	var bench = Object.create(tdd, {
		/*
		 * Compares the same test across different code bases to identify any performance regressions/improvements
		 * from one version of code to another.
		 *
		 * @param name String
		 * @param descriptor Object
		 */
		compare: dataDescriptor(function (name, descriptor) {
			descriptor.type = 'compare';
			if (!currentSuite) {
				main.suites.forEach(function (suite) {
					registerDescriptorBenchmarkSuite(descriptor, suite);
				});
			}
			else {
				registerDescriptorBenchmarkSuite(descriptor, currentSuite);
			}
		}),

		/*
		 * Benchmarks a series of tests against each other, finding the fastest and the slowest test.
		 *
		 * @param name String
		 * @param factory Function
		 */
		benchmark: dataDescriptor(function (name, factory) {
			if (!currentSuite) {
				main.suites.forEach(function (suite) {
					currentSuite = suite;
					registerFactoryBenchmarkSuite(name, 'benchmark', factory);
					currentSuite = null;
				});
			}
			else {
				registerFactoryBenchmarkSuite(name, 'benchmark', factory);
			}
		}),

		/*
		 * Provides detailed performance information for each test, which can be used to compare performance of a test
		 * in an external system.
		 *
		 * @param name String
		 * @param factory Function
		 *
		 */
		baseline: dataDescriptor(function (name, factory) {
			if (!currentSuite) {
				main.suites.forEach(function (suite) {
					currentSuite = suite;
					registerFactoryBenchmarkSuite(name, 'baseline', factory);
					currentSuite = null;
				});
			}
			else {
				registerFactoryBenchmarkSuite(name, 'baseline', factory);
			}
		})
	});

	aspect.around(bench, 'test', function (orig) {
		return function (name, test) {
			if (currentSuite instanceof BenchmarkSuite) {
				currentSuite.addTest(name, test);
			}
			else {
				return orig(name, test);
			}
		};
	});

	aspect.around(bench, 'before', function (orig) {
		return function (fn) {
			return orig(fn);
		};
	});

	aspect.around(bench, 'after', function (orig) {
		return function (fn) {
			return orig(fn);
		};
	});

	aspect.around(bench, 'beforeEach', function (orig) {
		return function (fn) {
			return orig(fn);
		};
	});

	aspect.around(bench, 'afterEach', function (orig) {
		return function (fn) {
			return orig(fn);
		};
	});

	return bench;
});