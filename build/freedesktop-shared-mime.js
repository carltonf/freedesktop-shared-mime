#!/usr/bin/env iojs

var fs = require('fs'),
    xml2js = require('xml2js'),
    path = require('path');


var __dirname = __dirname || process.cwd();

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/freedesktop.org.xml.in', function(err, data) {
    parser.parseString(data, function (err, result) {
        // var raw_type_atk_inset = result['mime-info']['mime-type'][0]
        // var formatted_type_atk_inset = {
        //     type: raw_type_atk_inset.$.type,
        //     alias: raw_type_atk_inset.alias && raw_type_atk_inset.alias[0].$.type,
        //     comment: raw_type_atk_inset._comment[0],
        //     super_type: raw_type_atk_inset['sub-class-of']
        //         && raw_type_atk_inset['sub-class-of'][0].$.type,
        //     extension: path.extname(raw_type_atk_inset.glob[0].$.pattern),
        //     generic_icon: raw_type_atk_inset['generic-icon'][0].$.name
        // }
        // console.dir(formatted_type_atk_inset);

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

        var output_db_json = path.join(__dirname, '../shared-mime-db.json')
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
// console.dir(res['mime-info']['mime-type'][1]);
// console.log('Done');

