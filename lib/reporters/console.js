define([ 'dojo-ts/topic' ], function (topic) {
	var hasGrouping = 'group' in console && 'groupEnd' in console;

	hasGrouping && topic.subscribe('/suite/start', function (suite) {
		console.group(suite.name);
	});

	topic.subscribe('/suite/end', function (suite) {
		var numTests = suite.numTests,
			numFailedTests = suite.numFailedTests;

		console[numFailedTests ? 'warn' : 'info'](numTests - numFailedTests + '/' + numTests + ' tests passed');
		hasGrouping && console.groupEnd();
	});

	topic.subscribe('/test/pass', function (test) {
		console.log('PASS: ' + (hasGrouping ? test.name : test.id) + ' (' + test.timeElapsed + 'ms)');
	});

	topic.subscribe('/test/fail', function (test) {
		console.error('FAIL: ' + (hasGrouping ? test.name : test.id) + ' (' + test.timeElapsed + 'ms)');
		console.error(test.error.message);
		console.error(test.error.stack);
	});

	topic.subscribe('/bench/start', function (test) {
		if (hasGrouping) {
			console.group(test.name);
			console.log('STARTING: ' + test.name);
		}
		else {
			console.log('STARTING: ' + test.id);
		}
	});

	topic.subscribe('/bench/complete', function (test) {
		console.log('Cycles: ' + test.stats.cycleCount);
		console.log('Tests per Cycle: ' + test.stats.testsPerCycle);
		console.log('Total Tests: ' + test.stats.count);
		console.log('Mean Test Duration: ' + test.stats.mean.toFixed(3) + 'ms');
		console.log('Minimum Test Duration: ' + test.stats.min.toFixed(3) + 'ms');
		console.log('Maximum Test Duration: ' + test.stats.max.toFixed(3) + 'ms');
		console.log('Variance Test Duration: ' + test.stats.variance.toFixed(3) + 'ms');
		console.log('Standard Deviation Test Duration: ' + test.stats.standardDeviation.toFixed(3) + 'ms');
		console.log('COMPLETE: ' + (hasGrouping ? test.name : test.id) + ' (' + test.timeElapsed + 'ms)');
		hasGrouping && console.groupEnd();
	});

	topic.subscribe('/bench/fail', function (test) {
		console.error('FAIL: ' + (hasGrouping ? test.name : test.id) + ' (' + test.timeElapsed + 'ms)');
		console.error(test.error.message);
		console.error(test.error.stack);
	});
});