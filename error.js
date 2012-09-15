

exports = module.exports;

exports.e404 = exports.notfound = function ( res ) {
  res.render('error/404', {layout: false, status: 404} );
}

exports.e403 = exports.forbidden = function ( res ) {
  res.render('error/403', {layout: false, status: 403 } );
}

exports.e500 = exports.servererror = function ( res, message ) {
  res.render('error/500', {layout: false, status: 403, message: message || "Server Error" } );
}
