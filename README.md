# streamparser
Simple parser, triggers events upon data receival and processing.

Here we create any Readable Stream

    var simpleparser = require('simpleparser');
    var reader = new memstreams.ReadableStream();
    //For comprehension sake we added this simple example w memory-streams.
    reader.append('a;1-b;2-c;3-d;4');

Then we create a config object (this is optional - default is linebreak='\n' and no fieldbreak)

    var config = {
             linebreak: '-',
             fieldbreak: ';'
         };`

Now we create the parser instance (remember config is optional)

        var p = new simpleparser(reader, config);
        //This will trigger every line read by the parser
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

        //Once parsing has finished this is triggered
        p.on('end', function () {
            done();
        });

        //This is a key aspect. Parsing will not start unless this method is called
        p.resume();

    });

## TODO:


1. Add objectmapper
2. Create multi doc mapping in the same stream
