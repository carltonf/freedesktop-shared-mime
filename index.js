var fs = require('fs'),
    path = require("path");
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

// @string: first test whether it's a existent path, if not used as a string to
// determine the type
exports.lookup = function (str) {
    if (!str || typeof str !== "string") return false

    try{
        var stats = fs.lstatSync(str)
    }catch(err){
        // ignore all FS errors
    }

    if (stats){
        if(stats.isDirectory())
            return "inode/directory"
        if(stats.isBlockDevice())
            return "inode/blockdevice"
        if(stats.isCharacterDevice())
            return "inode/chardevice"
        if(stats.isSymbolicLink())
            return "inode/symlink"
        if(stats.isFIFO())
            return "inode/fifo"
        if(stats.isSocket())
            return "inode/socket"

        if(stats.isFile()){
            // TODO use magic to test what type it is
            // do nothing
        }
    }

    // not a real file, only manipulate strings
    if (str.substr(-1) == path.sep)
        return "inode/directory"


    str = path.basename(str).match(/(\.[^\.]+)?\.([^\.]+)$/)
    if (!str) return false
    two_parts_ext = str[0].substring(1).toLowerCase()
    // str[1] is the middle part
    last_part_ext = str[2].toLowerCase()

    return exports.types[two_parts_ext]
        || exports.types[last_part_ext]
        || false;
}

// @type is type or alias
exports.aliases = function (type) {
    if (!type || typeof type !== "string"
        || !db[type]) return false

    return db[type].aliases || false;
}

// @type is type or alias
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
