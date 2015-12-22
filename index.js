/**
 * Created by paulo.simao on 21/12/2015.
 */

var eventemitter = require('events');
var fs = require('fs');
/*
 * src - readable stream
 * config = {
 *   linebreak:'\r\n',
 *   fieldbreak:null,
 * }
 *
 *
 * */
module.exports = function (src, pconfig) {

    var config = pconfig ? pconfig : {};
    if (!config.linebreak)config.linebreak = '\n';

    var stream = src;
    stream.pause();
    var ret = new eventemitter();
    var buffer = '';

    stream.on('end', function () {
        var parts = buffer.split(config.linebreak);
        for (var i = 0; i < parts.length; i++) {
            ret.emit('line', splitFields(parts[i]));
        }
        ret.emit('end');
    });

    ret.resume = function () {
        //Once on data is attached stream will start to pump.
        stream.on('data', function (chunk) {
            buffer = buffer + chunk.toString();
            var parts = buffer.split(config.linebreak);
            for (var i = 0; i < parts.length - 1; i++) {
                ret.emit('line', splitFields(parts[i]));
            }
            buffer = parts[parts.length - 1];
        });
        stream.resume();
    };

    function splitFields(line) {
        if (config.fieldbreak) {
            return line.split(config.fieldbreak)
        } else {
            return line;
        }
    }

    return ret;
};