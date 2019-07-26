var async = require('async');
var _ = require('underscore');
module.exports = {
    getData: function(client, cb) {
        var result = {};
        async.parallel([           
            function(callback) {
                client.keys('U01-total-*', function(err, data) {
                    var labels = [];
                    var value = [];
                    data.sort();
                    async.eachSeries(data, function(key, next) {
                        client.get(key, function(err, data) {
                            if (err) console.log(err);
                            else {
                                var time = key.substring(20, 23);
                                labels.push(time);
                                value.push(parseInt(data));
                                next();
                            }
                        })
                    }, function(err) {
                        if (err) console.log(err);
                        result.productviews = { labels: labels, data: value };
                        callback();
                    })
                })
            }
        ], function(err) {
            if (err) return cb(err);
            cb(undefined, result);
        });
    }
}
