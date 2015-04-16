#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var xml2js = require('xml2js');

var __dirname = __dirname || process.cwd();
var output_db_json = path.join(__dirname, '../shared-mime-db.json')

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/freedesktop.org.xml.in', function(err, data) {
    parser.parseString(data, function (err, result) {
        var res_json = {};
        result['mime-info']['mime-type'].forEach(function(raw_info){
            var type = raw_info.$.type;
            // NOTE: almost all field values parsed as an array, but some are
            // single value obviously: comment, super_type, generic_icon.
            // TODO read XML schema to confirm the above assumption
            res_json[type] = {
                aliases: raw_info.alias && raw_info.alias.map(function(alias){
                    return alias.$.type;
                }),
                comment: raw_info._comment && raw_info._comment[0],
                super_type: raw_info['sub-class-of']
                    && raw_info['sub-class-of'][0].$.type,
                extensions: raw_info.glob && raw_info.glob.map(function(glob){
                    return glob.$.pattern.substring(2); // remove first wildchar
                }),
                generic_icon: raw_info['generic-icon']
                    && raw_info['generic-icon'][0].$.name
            }
        })

        fs.writeFile(output_db_json,
                     JSON.stringify(res_json, null, 2),
                     function(err) {
                         if(err) {
                             console.log(err);
                         } else {
                             console.log("JSON saved to " + output_db_json);
                         }
                     });
    });
});

