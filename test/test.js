/**
 * Created by paulo.simao on 21/12/2015.
 */

var memstreams = require('memory-streams');
var simpleparser = require('../index');
var expect = require('chai').expect;

describe('Stream Parser Test', function () {
    it('Does Basic Testing', function (done) {

        var reader = new memstreams.ReadableStream();
        reader.append('a\nb\nc\nd');

        var p = new simpleparser(reader);
        var expected = 'a';
        p.on('line', function (data) {
            //console.log(data);
            expect(expected).to.equal(data);
            if (expected === 'a') {
                expected = 'b';
            }
            else if (expected === 'b') {
                expected = 'c';
            }
            else if (expected === 'c') {
                expected = 'd';
            }

        });
        p.on('end', function () {
            done();
        });
        p.resume();

    });
    it('Testing w Config Object', function (done) {

        var reader = new memstreams.ReadableStream();
        reader.append('a;1-b;2-c;3-d;4');
        var config = {
            linebreak: '-',
            fieldbreak: ';'
        };

        var p = new simpleparser(reader, config);
        p.on('line', function (data) {
            expect(data.length).to.equal(2);


            if (data[0] === 'a') {
                expect(data[1]).to.equal('1')
            } else if (data[0] === 'b') {
                expect(data[1]).to.equal('2')
            } else if (data[0] === 'c') {
                expect(data[1]).to.equal('3')
            } else if (data[0] === 'd') {
                expect(data[1]).to.equal('4')
            }
        });

        p.on('end', function () {
            done();
        });
        p.resume();

    });

});