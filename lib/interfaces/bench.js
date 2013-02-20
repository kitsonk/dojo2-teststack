define([
	'dojo-ts/aspect',
	'dojo-ts/Deferred',
	'dojo-ts/topic',
	'../../main',
	'../BenchmarkSuite'
], function (aspect, Deferred, topic, main, BenchmarkSuite) {
	function registerSuite(descriptor, parentSuite) {
		var tests = {},
			options = {},
			value,
			key;

		for (key in descriptor) {
			value = descriptor[key];
			switch (key) {
			case 'name':
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
			default:
				if (typeof value === 'function') {
					tests[key] = value;
				}
			}
		}

		var bench = new BenchmarkSuite({
			options: options
		});

		for (key in tests) {
			bench.suite.add(key, tests[key]);
		}

		parentSuite.tests.push(bench);
	}

	return function createBenchmarkSuite(descriptor) {
		main.suites.forEach(function (suite) {
			registerSuite(descriptor, suite);
		});
	};
});