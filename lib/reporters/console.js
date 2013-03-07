define([ 'dojo-ts/topic' ], function (topic) {
	var hasGrouping = 'group' in console && 'groupEnd' in console;

	function secsToMs(number) {
		return (number * 1000).toFixed(2);
	}

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

	topic.subscribe('/bench/start', function (bench) {
		if (hasGrouping) {
			console.group(bench.name);
		}
		else {
			console.log('START: ' + bench.id);
		}
	});

	topic.subscribe('/bench/cycle', function (bench) {
		var test = bench.event.target;
		if (hasGrouping) {
			console.group(test.name);
		}
		else {
			console.log(bench.id + ' - ' + test.name);
		}
		if (bench.type === 'benchmark' || bench.type === 'baseline') {
			console.log('Operations/Sec: ' + test.hz.toFixed(test.hz < 100 ? 2 : 0));
			console.log('Relative Margin of Error: \xb1' + test.stats.rme.toFixed(2) + '%');
			console.log('Samples: ' + test.stats.sample.length);
			if (bench.type === 'baseline') {
				console.log('Mean: ' + secsToMs(test.stats.mean) + 'ms');
				console.log('Deviation: \xb1' + secsToMs(test.stats.deviation) + 'ms');
				console.log('Variance: \xb1' + secsToMs(test.stats.variance) + 'ms');
				console.log('Margin of Error: \xb1' + secsToMs(test.stats.moe) + 'ms');
				console.log('Standard Error of Mean: \xb1' + secsToMs(test.stats.sem) + 'ms');
				console.log('Cycle Time: ' + secsToMs(test.times.cycle) + 'ms');
			}
		}
		hasGrouping && console.groupEnd();
	});

	topic.subscribe('/bench/end', function (bench) {
		var numTests = bench.numTests,
			numFailedTests = bench.numFailedTests;

		if (bench.type === 'benchmark') {
			var fastest = bench.suite.filter('fastest').pluck('name'),
				slowest = bench.suite.filter('slowest').pluck('name');
			console[numFailedTests ? 'warn' : 'info']('Fastest: "' + fastest + '" Slowest: "' + slowest + '" - ' +
				(numTests - numFailedTests) + '/' + numTests + ' tests completed');
		}
		else {
			var times = bench.event.target.times;
			console.log('Elapsed: ' + times.elapsed + ' secs');
			console[numFailedTests ? 'warn' : 'info']((numTests - numFailedTests) + '/' + numTests + ' tests completed');
		}
		hasGrouping && console.groupEnd();
	});

	topic.subscribe('/bench/error', function (bench) {
		var test = bench.event.target;
		console.error('ERROR: ' + (hasGrouping ? test.name : bench.id + ' - ' + test.name));
		console.error(test.error.message);
		console.error(test.error.stack);
	});
});