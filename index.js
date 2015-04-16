var db = require('./shared-mime-db.json')

// map ext -> type 
exports.types = {}
// map type -> exts (already exists, just 'db' actually)
exports.exts = {}

Object.keys(db).forEach(function(type){
    var exts = db[type].extensions
    if ( !exts || !exts.length )
        return;

    exports.exts[type] = exts
    // also handles alias
    if (db[type].aliases){
        db[type].aliases.forEach(function(alias){
            exports.exts[alias] = exts
        })
    }
    
    exts.forEach(function (ext){
        exports.types[ext] = type;
    })
})

exports.lookup = function (string) {
    if (!string || typeof string !== "string") return false

    string = require("path").basename(string)
        .replace(/[^\.]*\./, '').toLowerCase();

    if (!string) return false
    return exports.types[string] || false
}

// @string is type or alias
exports.extensions = function (type) {
    if (!type || typeof type !== "string") return false

    return exports.exts[type] || false
}

//////////////// Freedesktop Shared MIME Specifics ////////////////
// TODO add support for aliases for functions below
// @type, return the supertype
exports.supertype = function(type){
    if (!type || typeof type !== "string"
        || !db[type] ) return false

    return db[type].super_type || false;
}

// @type, return generic_icons = 

// @string is the type, return comments
exports.comment = function (type){
    if (!type || typeof type !== "string" || !db[type]  )
        return false
    
    return db[type].comment;
}

// generic_icon
exports.generic_icon = function(type){
    if (!type || typeof type !== "string" || !db[type] )
        return false

    return db[type].generic_icon || false
}
