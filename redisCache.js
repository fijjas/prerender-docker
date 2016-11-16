
var redis = require('redis');

var redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

module.exports = {

    beforePhantomRequest: function (phantom, req, res, next) {
        console.log('>> beforePhantomRequest()');
        // next();
        redisClient.get(req.url, function(cached) {
            if (cached) {
                console.log('Cached: ' + req.url);
                if (typeof cached == 'string') {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    console.log('>> Sending a cached page');
                    return res.end(cached);
                } else {
                    console.log('>> Cache is not a string :(');
                    next();
                }
            } else {
                console.log('>> Cache is empty');
                next();
            }
        });
    },

    onPhantomPageCreate: function (phantom, req, res, next) {
        console.log('>> onPhantomPageCreate()');
        redisClient.set(req.url, prerender_res.body);
        next();
    },

};
