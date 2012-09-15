
/**
 * Module dependencies.
 */

var express   = require('express')
  , routes    = require('./routes')
  , error     = require('./lib/error')
  , config    = require('konphyg')(__dirname+"/conf")
  , gallconf  = config('gallery')
  , path      = require('path')
  , normjoin  = function() { return path.normalize(path.join.apply(this, arguments)); }
  ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('gallconf', gallconf);
  
  var staticroot = "";
  if ( gallconf.static.absolute ) staticroot = path.normalize(gallconf.static.dir);
  else staticroot = normjoin(__dirname, gallconf.static.dir);
  
  app.set('imgroot', normjoin(staticroot, gallconf.imgroot));
  app.set('imgmount', normjoin(gallconf.static.mount, gallconf.imgroot));
  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(gallconf.static.mount, express.static(staticroot));
  
  app.use(app.router);
  
  app.use(function( req, res ) { error.notfound(res) });
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/favicon.ico', function( req, res ) {
  return error.e404(res);
});

//All routes should go before this
app.get('/gallery/*', routes.gallery);

app.get('/gallery', function( req, res ) {
  //Redirect to gallery/
  res.redirect('/gallery/');
});

app.get('/', routes.index);

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


process.on('SIGINT', function() {
  console.log("\nExiting");
  process.exit(0);
});
