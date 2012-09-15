
/*
 * GET home page.
 */

var fs        = require('fs')
  , parse     = require('url').parse
  , util      = require('util')
  , path      = require('path')
  , normalize = path.normalize
  , join      = path.join
  , error     = require('../lib/error')
  , async     = require('async')
  , rutil     = require('../lib/rutil')
  ;

// These should be defined in a config somewhere:
var imagetypes = [
    "png"
  , "jpg"
  , "gif"
  ]

var perpage = 20;


exports.index = function( req, res ){
  //res.render('index', { title: 'Image Gallery'});
  res.redirect('/gallery/');
}

exports.gallery = function(req, res, next){
  var root = req.app.settings["imgroot"]
    , mntpath = req.app.settings["imgmount"]
    , dir = req.params[0].split(':').shift()
    , page = Math.abs(req.params[0].split(':').pop()) || 1
    , path = normalize(join(root, dir))
    ;
  
  //console.log(page);
  //Make sure the page is not negative, and get the start index
  var pagestart = ((page-1 < 0) ? 0 : page - 1)*perpage;
    
  //Disallow paths not under our root
  if (0 != path.indexOf(root)) return error.e403(res);
  
  function getfiles( path, callback ) {
    async.waterfall(
      [
        function( next ) {
          //Raises error if it's not a directory
          // or if it doesn't exist
          fs.readdir( path, next );
        },
        function(r, next) {
          async.filter(
            r.sort().splice(pagestart, perpage),
            rutil.isimg, 
            function(r){ next(null, r); }
          );
        },
        function(r, next) {
          async.map( r, rutil.mappath, next );
        },
        function(r, next) {
          async.filter( r, rutil.isfile, function(r){ next(null, r) });
        }
      ],
      callback
    );
  }
  
  getfiles(path, function(err, result) {
    if (err) return res.send(err);
    res.send(result);
  });

};

