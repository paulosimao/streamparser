/**
 * Created by paulo.simao on 21/12/2015.
 */
/**
 * Created by paulo.simao on 21/12/2015.
 */
var eventemitter = require('events');
var fs = require('fs');
var config = require('../config/config');
module.exports = function (path) {
    var stream = fs.createReadStream(path);
    stream.pause();
    var ret = new eventemitter();
    var buffer = '';
    stream.on('data', function (chunk) {
        buffer = buffer + chunk.toString();
        var parts = buffer.split(config.linebreak);
        for (var i = 0; i < parts.length - 1; i++) {
            ret.emit('line', parts[i]);
        }
        buffer = parts[parts.length - 1];
    });

    stream.on('end', function () {
        var parts = buffer.split(config.linebreak);
        for (var i = 0; i < parts.length; i++) {
            ret.emit('line', parts[i]);
        }
        ret.emit('end');
    });
    ret.resume = function () {
        stream.resume();
    }
    return ret;
}