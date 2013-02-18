define([
	'dojo-ts/lang', // lang.delegate
	'../../main',
	'./tdd',
	'../BenchmarkSuite',
	'../BenchmarkTest'
], function (lang, main, tdd, BenchmarkSuite, BenchmarkTest) {
	var currentSuite,
		suites = [];

	function registerSuite(name, factory) {
		var parentSuite = currentSuite;

		currentSuite = new BenchmarkSuite({ name: name, parent: parentSuite });
		parentSuite.tests.push(currentSuite);

		suites.push(parentSuite);
		factory();
		currentSuite = suites.pop();
	}

	var benchmark = lang.clone(tdd);

	benchmark.suite = function (name, factory) {
		if (/* is a root suite */ !currentSuite) {
			main.suites.forEach(function (suite) {
				currentSuite = suite;
				registerSuite(name, factory);
				currentSuite = null;
			});
		}
		else {
			registerSuite(name, factory);
		}
	};

	benchmark.test = function (testConfiguration) {
		testConfiguration.parent = currentSuite;
		currentSuite.tests.push(new BenchmarkTest(testConfiguration));
	};

	return benchmark;

});