[![Build Status](https://travis-ci.org/csnover/dojo2-teststack.png?branch=master)](https://travis-ci.org/csnover/dojo2-teststack)

# The Dojo Test Stack

The Dojo Test Stack is a collection of JavaScript modules designed to work together to help you write consistent,
high-quality test cases for your JavaScript libraries and applications.


## Does my app need to use Dojo to use Dojo Test Stack?

No! Dojo Test Stack uses Dojo but can be used to test *any* JavaScript code. Its functional testing interface can even
be used to test non-JavaScript Web apps if you really want.


## This repository

This repository is an experimental repository for the next major version of the Dojo Toolkit. Please feel free to start
using it as long as you can put up with some API churn until it reaches alpha.


## Do you hate kittens and love old IE?

If you need to support IE 6–8, there is also a
[version of teststack for legacy browsers](https://github.com/csnover/dojo2-teststack/tree/geezer "geezer branch"), but
please, for the sake of the kittens, stop supporting those browsers already.


## Features

* 100% [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD), 100% Promises/A-based API
* Instant one-off test execution in the browser or Node.js
* Full statement, branch, function, and line code coverage reporting with
  [Istanbul](https://github.com/gotwarlost/istanbul)
* Functional testing using the standard [WebDriver API](http://www.w3.org/TR/webdriver/) with a fluid, promises-wrapped
  [WD.js](https://github.com/admc/wd)
* Integration with [Sauce Labs](http://saucelabs.com/) for super simple continuous integration
* Tested with [Travis CI](http://travis-ci.org/)
* Extensible interfaces (comes with TDD, BDD, and objects)
* Extensible reporters (comes with basic console and WebDriver reporters, lcov and tap output planned)
* Extensible assertions using the [Chai Assertion Library](http://chaijs.com)


## Comparison

<table>
<tr>
	<th>Feature</th>
	<th><a href="https://github.com/csnover/dojo2-teststack">Test Stack</a></th>
	<th><a href="http://qunitjs.com">QUnit</a></th>
	<th><a href="http://visionmedia.github.com/mocha/">Mocha</a></th>
	<th><a href="http://pivotal.github.com/jasmine/">Jasmine</a></th>
	<th><a href="http://busterjs.org">BusterJS</a></th>
	<th><a href="http://testacular.github.com/">Testacular</a></th>
</tr>
<tr>
	<th scope="row">Code coverage analysis</th>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>No</td>
	<td>Extension</td>
	<td>Yes</td>
</tr>
<tr>
	<th scope="row">True<sup><a name="rev1" href="#ref1">1</a></sup> browser events</th>
	<td>Yes</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
</tr>
<tr>
	<th scope="row">Native AMD support</th>
	<td>Yes</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>Extension</td>
	<td>Extension</td>
</tr>
<tr>
	<th scope="row">Stand-alone<sup><a name="rev2" href="#ref2">2</a></sup> browser support</th>
	<td>Yes</td>
	<td>Yes</td>
	<td>Build required</td>
	<td>Build required</td>
	<td>No</td>
	<td>No</td>
</tr>
<tr>
	<th scope="row">Node.js support</th>
	<td>Yes</td>
	<td>No<sup><a name="rev3" href="#ref3">3</a></sup></td>
	<td>Yes</td>
	<td>Yes</td>
	<td>Yes</td>
	<td>Yes</td>
</tr>
<tr>
	<th scope="row">Any<sup><a name="rev4" href="#ref4">4</a></sup> assertion library</th>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>N/A</td>
</tr>
<tr>
	<th scope="row">Default test interface</th>
	<td>TDD, BDD, object</td>
	<td>TDD</td>
	<td>TDD, BDD, object</td>
	<td>BDD</td>
	<td>xUnit</td>
	<td>N/A</td>
</tr>
<tr>
	<th scope="row">Extensible test interfaces</th>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>N/A</td>
</tr>
<tr>
	<th scope="row">Extensible reporters</th>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>No</td>
	<td>Yes</td>
	<td>N/A</td>
</tr>
<tr>
	<th scope="row">Asynchronous support</th>
	<td>Promises</td>
	<td>Globals</td>
	<td>Callbacks</td>
	<td>Polling</td>
	<td>Callbacks</td>
	<td>Callbacks</td>
</tr>
<tr>
	<th scope="row">Selenium support</th>
	<td>Yes</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
</tr>
<tr>
	<th scope="row">Built-in CI support</th>
	<td>Yes</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>Yes</td>
	<td>Yes</td>
</tr>
<tr>
	<th scope="row">Built-in Sauce Labs integration</th>
	<td>Yes</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
</tr>
<tr>
	<th scope="row">Built-in Travis CI integration</th>
	<td>Yes</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>No</td>
	<td>Yes</td>
</tr>
<tr>
	<th scope="row">Grunt support</th>
	<td>Yes</td>
	<td>3rd party</td>
	<td>3rd party</td>
	<td>3rd party</td>
	<td>3rd party</td>
	<td>3rd party</td>
</tr>
</table>

<a name="ref1" href="#rev1">1</a>: True events are not generated by JavaScript within the sandbox, so are able to accurately emulate how a user
      actually interacts with the application. Synthetic events generated by other test frameworks are limited by
	  browser security restrictions.

<a name="ref2" href="#rev2">2</a>: Stand-alone means that unit tests can be executed in a browser by navigating to a URL without needing any special
      HTTP server or proxy for support.

<a name="ref3" href="#rev3">3</a>: Some older versions of QUnit can be used in conjunction with a 3rd party module to run on Node.js, but newer
      versions do not support Node.js and will break even with the use of 3rd party modules.

<a name="ref4" href="#rev4">4</a>: If it throws an error on failure, it works with Test Stack.


## How to write tests

dojo2-teststack currently comes with support for 3 different test interface: TDD, BDD, and object. Internally,
all interfaces generate the same testing structures, so you can use whichever interface you feel matches your
preference.


### TDD

TDD tests using the Chai Assert API look like this:

```js
define([
	'teststack!tdd',
	'teststack/chai!assert',
	'../Request'
], function (tdd, assert, Request) {
	with (tdd) {
		suite('demo', function () {
			var request,
				url = 'https://github.com/csnover/dojo2-teststack';

			// before the suite starts
			before(function () {
				request = new Request();
			});

			// before each test executes
			beforeEach(function () {
				request.reset();
			});

			// after the suite is done
			after(function () {
				request.cleanup();
			});

			// multiple methods can be registered and will be executed in order of registration
			after(function () {
				if (!request.cleaned) {
					throw new Error('Request should have been cleaned up after suite execution.');
				}

				// these methods can be made asynchronous as well by returning a promise
			});

			// asynchronous test for Promises/A-based interfaces
			test('#getUrl (async)', function () {
				// `getUrl` returns a promise
				return request.getUrl(url).then(function (result) {
					assert.equal(result.url, url, 'Result URL should be requested URL');
					assert.isTrue(result.data.indexOf('next-generation') > -1, 'Result data should contain term "next-generation"');
				});
			});

			// asynchronous test for callback-based interfaces
			test('#getUrlCallback (async)', function () {
				// test will time out after 1 second
				var dfd = this.async(1000);

				// dfd.callback resolves the promise as long as no errors are thrown from within the callback function
				request.getUrlCallback(url, dfd.callback(function () {
					assert.equal(result.url, url, 'Result URL should be requested URL');
					assert.isTrue(result.data.indexOf('next-generation') > -1, 'Result data should contain term "next-generation"');
				});

				// no need to return the promise; calling `async` makes the test async
			});

			// nested suites work too
			suite('xhr', function () {
				// synchronous test
				test('sanity check', function () {
					assert.ok(request.xhr, 'XHR interface should exist on `xhr` property');
				});
			});
		});
	}
});
```


### BDD

BDD tests using the Chai Expect API:

```js
define([
	'teststack!bdd',
	'teststack/chai!expect',
	'../Request'
], function (bdd, expect, Request) {
	with (bdd) {
		describe('demo', function () {
			var request,
				url = 'https://github.com/csnover/dojo2-teststack';

			// before the suite starts
			before(function () {
				request = new Request();
			});

			// before each test executes
			beforeEach(function () {
				request.reset();
			});

			// after the suite is done
			after(function () {
				request.cleanup();
			});

			// multiple methods can be registered and will be executed in order of registration
			after(function () {
				if (!request.cleaned) {
					throw new Error('Request should have been cleaned up after suite execution.');
				}

				// these methods can be made asynchronous as well by returning a promise
			});

			// asynchronous test for Promises/A-based interfaces
			it('should demonstrate a Promises/A-based asynchronous test', function () {
				// `getUrl` returns a promise
				return request.getUrl(url).then(function (result) {
					expect(result.url).to.equal(url);
					expect(result.data.indexOf('next-generation') > -1).to.be.true;
				});
			});

			// asynchronous test for callback-based interfaces
			it('should demonstrate a callback-based asynchronous test', function () {
				// test will time out after 1 second
				var dfd = this.async(1000);

				// dfd.callback resolves the promise as long as no errors are thrown from within the callback function
				request.getUrlCallback(url, dfd.callback(function () {
					expect(result.url).to.equal(url);
					expect(result.data.indexOf('next-generation') > -1).to.be.true;
				});

				// no need to return the promise; calling `async` makes the test async
			});

			// nested suites work too
			describe('xhr', function () {
				// synchronous test
				it('should run a synchronous test', function () {
					expect(request.xhr).to.exist;
				});
			});
		});
	}
});
```


### Object

Object tests using the Chai Assert API:

```js
define([
	'teststack!object',
	'teststack/chai!assert',
	'../Request'
], function (registerSuite, assert, Request) {
	var request,
		url = 'https://github.com/csnover/dojo2-teststack';

	registerSuite({
		name: 'demo',

		// before the suite starts
		before: function () {
			request = new Request();
		},

		// before each test executes
		beforeEach: function () {
			request.reset();
		},

		// after the suite is done
		after: function () {
			request.cleanup();

			if (!request.cleaned) {
				throw new Error('Request should have been cleaned up after suite execution.');
			}
		},

		// asynchronous test for Promises/A-based interfaces
		'#getUrl (async)': function () {
			// `getUrl` returns a promise
			return request.getUrl(url).then(function (result) {
				assert.equal(result.url, url, 'Result URL should be requested URL');
				assert.isTrue(result.data.indexOf('next-generation') > -1, 'Result data should contain term "next-generation"');
			});
		},

		// asynchronous test for callback-based interfaces
		'#getUrlCallback (async)': function () {
			// test will time out after 1 second
			var dfd = this.async(1000);

			// dfd.callback resolves the promise as long as no errors are thrown from within the callback function
			request.getUrlCallback(url, dfd.callback(function () {
				assert.equal(result.url, url, 'Result URL should be requested URL');
				assert.isTrue(result.data.indexOf('next-generation') > -1, 'Result data should contain term "next-generation"');
			});

			// no need to return the promise; calling `async` makes the test async
		},

		// nested suites work too
		'xhr': {
			// synchronous test
			'sanity check': function () {
				assert.ok(request.xhr, 'XHR interface should exist on `xhr` property');
			}
		}
	});
});
```


### Functional tests

Functional tests are slightly different from normal unit tests because they are executed remotely from the test runner,
whereas unit tests are executed directly on the browser under test.

```js
define([
	'teststack!object',
	'teststack/chai!assert',
	'../Request',
	'require'
], function (registerSuite, assert, Request, require) {
	var request,
		url = 'https://github.com/csnover/dojo2-teststack';

	registerSuite({
		name: 'demo',

		'submit form': function () {
			return this.remote
				.get(require.toUrl('./fixture.html'))
				.elementById('operation')
					.click()
					.type('hello, world')
				.end()
				.elementById('submit')
					.click()
				.end()
				.waitForElementById('result')
				.text()
				.then(function (resultText) {
					assert.ok(resultText.indexOf('"hello, world" completed successfully') > -1, 'When form is submitted, operation should complete successfully');
				});
		}
	});
});
```

More details on each API can be found in the Wiki.


## How to run

First:

1. `git clone --recursive https://github.com/csnover/dojo2-teststack.git` as a sibling directory of the package you
   want to test
2. `npm install --production` from the `dojo2-teststack` directory

Then, for a stand-alone browser client:

1. Navigate to `http://path/to/dojo2-teststack/client.html?config=mid/of/teststack/config`
1. View console
1. Fix bugs

Or, for a stand-alone Node.js client:

1. Run `node client.js config=mid/of/teststack/config`
1. View console
1. Fix bugs

When running clients directly, you can specify a `reporter` and one or more `suites` options to override the options
in the configuration file:

Browser: `http://path/to/dojo2-teststack/client.html?config=mid/of/teststack/config&suites=mid/of/suite/a&suites=mid/of/suite/b&reporter=mid/of/custom/reporter`
CLI: `node client.js config=mid/of/teststack/config suites=mid/of/suite/a suites=mid/of/suite/b reporter=mid/of/custom/reporter`

Or, as an amazing fully-featured automated test runner:

1. Create a teststack configuration file describing your desired test environment, like the one at
   https://github.com/csnover/dojo2-teststack/blob/master/test/teststack.js
1. `cd dojo2-teststack`
1. `node runner.js config=mid/of/teststack/config`
1. View console
1. Fix bugs

…plus CI support:

1. Create a `.travis.yml` like the one at https://github.com/csnover/dojo2-teststack/blob/master/.travis.yml
2. Enable Travis-CI for your GitHub account
3. Make a commit
4. That’s it! Easy continuous integration is easy.


## License

New BSD License © 2012–2013 Colin Snover http://zetafleet.com. Released under
[Dojo Foundation CLA](http://dojofoundation.org/about/cla).