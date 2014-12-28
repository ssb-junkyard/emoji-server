var fs = require('fs')
var path = require('path')

var emojiDir = path.join(
  path.dirname(require.resolve('emoji-named-characters')), 'pngs'
)

//stat all the emoji into an table of sizes.
var emoji = {}
var array = fs.readdirSync(emojiDir)
array.forEach(function (k) {
  emoji[k] = fs.statSync(path.join(emojiDir, k)).size
})

module.exports = function (dir) {
  if(!dir) dir = '/emoji'
  return function (req, res, next) {
    var name = path.basename(req.url)
    //if we are running as middleware, check the path matches.
    if(req.url.indexOf(dir) !== 0 && next) {
      next()
    }
    else if(emoji[name]) {

      res.writeHead(200, {
        'content-type': 'image/png',
        'cache-control': 'max-age=3600',
        'content-length': emoji[name]
      })
      fs.createReadStream(path.join(emojiDir, name)).pipe(res)
    }
    else {
      res.writeHead(404, {
        'content-type': 'text/html'
      })
      res.end(
        '<html><body>'
        + '<h1> oh no </h1>'
        + 'there was no emoji named:' + JSON.stringify(name) + '<br>'
        + 'instead, try:<br>'
        + '<div style="width:80%; margin-left: auto; margin-right:auto">'
        + (function () {
            var s = ''
            for(var k in emoji)
              s += '<img src='+k
                  +' title=' + k
                  + ' alt=' + k
                  + '>\n'
            return s
          })()
        +'</div></body></html>'
      )

    }
  }
}

if(!module.parent) {
  require('http').createServer(module.exports('/')).listen(3000)
}
