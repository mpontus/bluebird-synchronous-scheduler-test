Bluebird allows synchrnous scheduler to be set for the resolution of the promises. This is useful for testing as it allows to assert promise state without introducing delays into the tests.

# The problem

Using Bluebird to repalce native promises in jest stops custom scheduler from working.

In the examples below I provide comparison for two scenarios for each of the following environments: Node, Mocha, and Jest. First example runs through the scenario without replacing `global.Promise`. Second example replaces `global.Promise` with bluebird. Notice how this detail changes the outcome in jest test.

## Outline

```js
// Set custom scheduler to synchronously propagate through promise chain
Promise.setScheduler(fn => fn());

// Set up a chained promise which can be fulfilled remotely
let release;
const promise = new Promise(resolve => {
    release = resolve;
}).then(() => {});

// Fulfill the promise
release();

// Confirm chained promise to be fulfilled
console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'}`);
```

## Node

### With global replacement

```
$ node with-global.js
Promise is pending before being released
Promise is fulfilled after being released
Promise is fulfilled after a timeout
```


### Without global replacement

```
$ node without-global.js
Promise is pending before being released
Promise is fulfilled after being released
Promise is fulfilled after a timeout
```


## Mocha

```
$ npm run mocha

> bluebird-synchronous-scheduler-test@1.0.0 mocha /home/michael/projects/bluebird-synchronous-scheduler-test
> mocha



Promise is pending before being released
Promise is fulfilled after being released
Promise is fulfilled after a timeout
  ✓ testing with global replacement (104ms)
Promise is pending before being released
Promise is fulfilled after being released
Promise is fulfilled after a timeout
  ✓ testing without global replacement (102ms)

  2 passing (213ms)
```

## Jest

```
$ npm run jest

> bluebird-synchronous-scheduler-test@1.0.0 jest /home/michael/projects/bluebird-synchronous-scheduler-test
> jest

 PASS  test/without-global.test.js
  ● Console

    console.log test/without-global.test.js:12
      Promise is pending before being released
    console.log test/without-global.test.js:16
      Promise is fulfilled after being released
    console.log test/without-global.test.js:19
      Promise is fulfilled after a timeout

 PASS  test/with-global.test.js
  ● Console

    console.log test/with-global.test.js:13
      Promise is pending before being released
    console.log test/with-global.test.js:17
      Promise is pending after being released
    console.log test/with-global.test.js:20
      Promise is fulfilled after a timeout


Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.485s
Ran all test suites.
```

# Results

Only in jest example chained promise is not fulfilled after fulfilling the original promise. 

Interestingly enough the issue can be avoided by doing any of the following:

 * Replacing `global.Promise` at the beginning of every test.
 * Replacing `global.Promise` inside `afterEach` callback
 * Replacing `global.Promise` inside `afterAll` callback

It won't help to move the assignment inside `beforeAll` or `beforeEach`.
