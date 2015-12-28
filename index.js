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
 *   models:{
 *      a:{
 *
 *   }
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
    var linecounter = 1;

    ret.onend = function () {
        var parts = buffer.split(config.linebreak);
        for (var i = 0; i < parts.length; i++) {
            ret.emit('line', ret.splitFields(parts[i]));
        }
        ret.emit('end');
    };

    ret.resume = function () {
        //Once on data is attached stream will start to pump.
        stream.on('data', function (chunk) {
            buffer = buffer + chunk.toString();
            var parts = buffer.split(config.linebreak);
            for (var i = 0; i < parts.length - 1; i++) {
                linecounter++;
                ret.emit('line', ret.splitFields(parts[i]));
            }
            buffer = parts[parts.length - 1];
        });
        stream.resume();
    };

    ret.splitFields = function (line) {
        if (config.fieldbreak) {
            var ret = line.split(config.fieldbreak);
            if (config.models && config.models[ret[0]]) {
                var retobj = {};
                var i = 0;
                for (m in config.models[ret[0]].template) {
                    var regex = new RegExp(config.models[ret[0]].template[m]);
                    if (regex.test(ret[i])) {
                        retobj[m] = ret[i];
                        i++;
                    } else {
                        throw new Error('Field:' + m + ' in line: ' + linecounter + ' does not match Regex:' + config.models[ret[0]].template[m] + '. Value found:' + ret[i]);
                    }

                }
                if (config.models && config.models[ret[0]] && config.models[ret[0]].postprocess) {
                    config.models[ret[0]].postprocess(retobj);
                }
                return retobj;
            }
            return ret;
        } else {
            return line;
        }
    };

    stream.on('end', ret.onend);

    return ret;
};