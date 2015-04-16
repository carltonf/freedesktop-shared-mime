var assert = require('assert')
var shared_mime = require('..')

describe('Tests most from mime-types', function () {
  describe('.extensions(path)', function () {
    it('should return extensions for mime type', function () {
      assert.deepEqual(shared_mime.extensions('text/html'), ['html', 'htm'])
      assert.notDeepEqual(shared_mime.extensions('text/html'), ['html', 'htm', 'htmx'])
    })

    it('should return false for unknown type', function () {
      assert.strictEqual(shared_mime.extensions('application/x-bogus'), false)
    })

    it('should return false for non-type string', function () {
      assert.strictEqual(shared_mime.extensions('bogus'), false)
    })

    it('should return false for non-strings', function () {
      assert.strictEqual(shared_mime.extensions(null), false)
      assert.strictEqual(shared_mime.extensions(undefined), false)
      assert.strictEqual(shared_mime.extensions(42), false)
      assert.strictEqual(shared_mime.extensions({}), false)
    })

    // freedesktop specific
    it('should return extensions for extra freedesktop mime type', function(){
      assert.deepEqual(shared_mime.extensions('application/x-ruby'), ['rb'])
      assert.deepEqual(shared_mime.extensions('text/x-python'), ['py', 'pyx', 'wsgi'])
    })
  })

  describe('.lookup(extensions)', function () {
    it('should return mime type for ".html"', function () {
      assert.equal(shared_mime.lookup('.html'), 'text/html')
    })

    it('should return mime type for ".js"', function () {
      assert.equal(shared_mime.lookup('.js'), 'application/javascript')
    })

    it('should return mime type for ".json"', function () {
      assert.equal(shared_mime.lookup('.json'), 'application/json')
    })

    it('should return mime type for ".txt"', function () {
      assert.equal(shared_mime.lookup('.txt'), 'text/plain')
    })

    it('should return mime type for ".xml"', function () {
      assert.equal(shared_mime.lookup('.xml'), 'application/xml')
    })

    it('should be case insensitive', function () {
      assert.equal(shared_mime.lookup('.HTML'), 'text/html')
      assert.equal(shared_mime.lookup('.Xml'), 'application/xml')
    })

    it('should return false for unknown extensions', function () {
      assert.strictEqual(shared_mime.lookup('.bogus'), false)
      assert.strictEqual(shared_mime.lookup('bogus'), false)
    })

    it('should return false for non-strings', function () {
      assert.strictEqual(shared_mime.lookup(null), false)
      assert.strictEqual(shared_mime.lookup(undefined), false)
      assert.strictEqual(shared_mime.lookup(42), false)
      assert.strictEqual(shared_mime.lookup({}), false)
    })

    // freedesktop specifics
    it('should return mime type for real directory', function(){
      assert.equal(shared_mime.lookup('.'), "inode/directory")
      assert.equal(shared_mime.lookup('/home'), "inode/directory")
    })

    it('should return false for non-existent directory', function(){
      assert.strictEqual(shared_mime.lookup('bogus_directory'), false)
    })

    it('should return mime type for directory-like string', function(){
      assert.equal(shared_mime.lookup('bogus_directory/'), "inode/directory")
    })

    // WARNING: this has changed from mime-types
    it('should NOT work without the leading dot, case-insensitive', function () {
      assert.equal(shared_mime.lookup('html'), false)
      assert.equal(shared_mime.lookup('xml'), false)
      assert.equal(shared_mime.lookup('HTML'), false)
      assert.equal(shared_mime.lookup('XML'), false)
    })
  })

  describe('.lookup(path)', function () {
    it('should return mime type for file name', function () {
      assert.equal(shared_mime.lookup('page.html'), 'text/html')
    })

    it('should return mime type for relative path', function () {
      assert.equal(shared_mime.lookup('path/to/page.html'), 'text/html')
    })

    it('should return mime type for absolute path', function () {
      assert.equal(shared_mime.lookup('/path/to/page.html'), 'text/html')
    })

    it('should be case insensitive', function () {
      assert.equal(shared_mime.lookup('/path/to/PAGE.HTML'), 'text/html')
    })

    it('should return false for unknown extensions', function () {
      assert.strictEqual(shared_mime.lookup('/path/to/file.bogus'), false)
    })
  })
})

describe("Freedesktop Specifics:", function(){
  describe(".aliases", function(){
    it("should return aliases for mime type with aliases", function(){
      assert.deepEqual(shared_mime.aliases("video/vnd.mpegurl"), ["video/x-mpegurl"])
      assert.deepEqual(shared_mime.aliases("text/x-gettext-translation"),
                       ["text/x-po", "application/x-gettext"])
    })

    it("should return false for mime type with no aliases", function(){
      assert.strictEqual(shared_mime.aliases("text/cache-manifest"), false)
    })

    it("should return false for unknow type", function(){
      assert.strictEqual(shared_mime.aliases('application/x-bogus'), false)
    })
  })

  describe(".supertype", function(){
    it("should return supertype for mime type", function(){
      assert.equal(shared_mime.supertype("application/epub+zip"),
                   "application/zip")
      assert.equal(shared_mime.supertype("application/x-windows-themepack"),
                   "application/vnd.ms-cab-compressed")
      assert.equal(shared_mime.supertype("application/javascript"),
                   "application/ecmascript")
    })

    it("should return false for mime type without super type", function(){
      assert.strictEqual(shared_mime.supertype("text/plain"), false)
    })

    it("should return false for unknown type", function(){
      assert.strictEqual(shared_mime.supertype('application/x-bogus'), false)
    })
  })

  describe(".comment", function(){
    it("should return comment for mime type", function(){
      assert.strictEqual(shared_mime.comment("application/javascript"),
                         "JavaScript program")
      assert.strictEqual(shared_mime.comment("application/x-jbuilder-project"),
                         "JBuilder project")
    })

    it("should return false for unknown type", function(){
      assert.strictEqual(shared_mime.comment('application/x-bogus'), false)
    })
  })

  describe(".generic_icon", function(){
    it("should return generic icon if there is one", function(){
      assert.equal(shared_mime.generic_icon("application/rss+xml"),
                   "text-html")
    })

    it("should return false if there is no generic icon assigned", function(){
      assert.strictEqual(shared_mime.generic_icon("text/rfc822-headers"),
                         false)
    })

    it("should return false for unknown type", function(){
      assert.strictEqual(shared_mime.generic_icon('application/x-bogus'),
                         false)
    })

  })
})
