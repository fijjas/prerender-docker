var prerender = require('prerender');
var forwardHeaders = require('./forwardHeaders');
// var redisCache = require('./redisCache');

var isDebug = process.env.DEBUG || 0;

var server = prerender({
    workers: process.env.PRERENDER_NUM_WORKERS || 8,
    iterations: process.env.PRERENDER_NUM_ITERATIONS || 40,
    softIterations: process.env.PRERENDER_NUM_SOFT_ITERATIONS || 30,
    cookiesEnabled: true,
    logRequests: isDebug,
    waitAfterLastRequest: 1000
});

console.log('>> Starting the Prerender');

// server.use(redisCache);
server.use(forwardHeaders);
server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

if (isDebug == 1) {
    server.use(prerender.logger());
}
server.start();

function shutdown() {
    console.log('Shutdown initiated');
    server.exit();
    // At this point prerender has started killing its phantom workers already.
    // We give it 5 seconds to quickly do so, and then halt the process. This
    // will ensure relatively rapid redeploys (prerender no longer accepts new
    // requests at this point
    setTimeout(function () {
        console.log('Prerender has shut down');
        process.exit();
    }, 5000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
