const Promise = require('bluebird');
global.Promise = Promise;

Promise.setScheduler(fn => fn());

let release;

const promise = new Promise(resolve => {
    release = resolve;
}).then(() => {});

console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'} before being released`);

release();

console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'} after being released`);

setTimeout(() => {
    console.log(`Promise is ${promise.isPending() ? 'pending' : 'fulfilled'} after a timeout`);
}, 100);
