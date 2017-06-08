const Promise = require('bluebird');

Promise.setScheduler(fn => {
    console.log('scheduler used');
    fn();
});

it('testing without global replacement', (done) => {
    let release;

    const promise = new Promise(resolve => {
        release = resolve;
    }).then(() => {});

    console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'} before being released`);

    release();

    console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'} after being released`);

    setTimeout(() => {
        console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'} after a timeout`);
        done();
    }, 100);
});
