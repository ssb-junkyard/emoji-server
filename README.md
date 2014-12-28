# emoji-server

add emoji to your site by adding this middleware.

``` js
var emoji = require('emoji-server')('/emoji')
                             //just pass the path you
                             //want them hosted on.
var http = require('http')

//a http server that only hosts emoji
http.createServer(emoji).listen(3000)

//inside another server
http.createServer(function (req, res) {

  if(req.url.indexOf('/emoji')
    return emoji(req, res)

  //handle other stuff etc.
  res.end('<img src=/emoji/+1.png>')

}).listen(3001)

//or works like connect/express/etc middleware

var app = require('connect')()

app.use(emoji)
app.use(function (req, res) {
  res.end('<img src=/emoji/+1.png>')
})
//add more stuff, etc

http.createServer(app).listen(3002)
```


## License

MIT
