
//Some route utilities
//Maybe I should make some of these middleware?


exports.isfile = function (file, next){
      //Make sure it's not a directory
      next(!file.dir);
    }
    
exports.isimg = function (file, next) {
      //Make sure it's in our file types, and not a hidden file
      next( -~imagetypes.indexOf(file.split('.').pop().toLowerCase()) && file.charAt(0) !== '.' );
    }
    
exports.mappath = function (file, next) {
      fpath = join(path, file);
      async.waterfall(
        [
          function( next ) {
            fs.stat(fpath, next);
          },
          function( stat, next ) {
            var fo = {
              href: join(mntpath, file),
              path: fpath,
              name: file,
              dir: stat.isDirectory()
            };
            
            next(null, fo);
          }
        ],
        next
      );
    }
    
