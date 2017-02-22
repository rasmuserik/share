var levelup = require("levelup");
var db = require("levelup")("./data");
var icon = require("fs").readFileSync("./icon.png");
var index = require("fs").readFileSync("./index.html");

server = require("http").createServer((req, res) => {

  if(req.url === "/icon.png") {
    return res.end(icon);
  }

  if(req.url === "/") {
    return res.end(index);
  }

  var id = decodeURIComponent(req.url.slice(1));
  var pos = id.indexOf("/", 1);
  var uri;
  if(pos !== -1) {
    var uri = id.slice(pos + 1);
    uri = uri.split("\n")[0].slice(0,1000);
    id = id.slice(0, pos);
  } 

  db.get(id, (err, val) => {
    if(!err) {
      res.writeHead(301, {Location: val});
      return res.end("Redirect to " + val);
    } 
    if(!uri) {
      return res.end("no redirect at '/" + id + "'");
    }
    if(!(uri.startsWith("http://") || uri.startsWith("https://"))) {
      return res.end("error: uri must start with http:// or https://");
    }
    db.put(id, uri, (err) => res.end(err ? 'error' : 'ok'))
  });
});

server.listen(8888);
