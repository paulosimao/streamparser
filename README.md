# streamparser
Simple parser, triggers events upon data receival and processing.

Last updated at: **28-DEC-2015 21:15 GMT-2**

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


### Field Mapping

Now it is possible to define line templates and the parser will give you objects validated by regex and assembled on
the event (as long as you inform it the templates in advance ;)).

See the sample below:

    reader.append('a;1;2\nb;2;4\na;3;5');
    var config = {
        linebreak: '\n',
        fieldbreak: ';',
        models: {
                a: {
                    template: {F1: '\D*', F2: '\d*', F3: '\d*'},
                    postprocess: function (obj) {
                        obj.F2 = obj.F2 + '--- TESTE - A'
                    }
                },
                b: {
                    template: {F1: '.*', F2: '.*', F3: '.*'},
                    postprocess: function (obj) {
                        obj.F2 = obj.F2 + '--- TESTE - B;'
                    }
                }
        }
    };

Note that in this config we have set a property `models`, and inside it we have the model names (`a`,`b`).
Base on the value found in the first field, the parser will match the template to be applied.
Each model has the fields:
- `template`: An object where each prop will reflect one field in the line (order is relevant).
The value of each field is a STRING representing a REGEX that will be used to validate the value found by the parser.
In case no validation is required, use the good ´n old `'.*'` regex to match anything. In case matching can not be achieved,
parser will throw an error.
- `postprocess`: This property is optional, and in case required, should point to a method that receives the assembled object as parameter
and manipulates is after the whole line has been parsed. It allows you to change values of fields based on other fields, for example.


## TODO:


~~1. Add objectmapper~~

~~2. Create multi doc mapping in the same stream~~

3. You tell me :)
