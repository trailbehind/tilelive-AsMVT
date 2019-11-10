module.exports = AsMVT;

const tilelive = require("@mapbox/tilelive");
const url = require("url");
const zlib = require("zlib");
const { Pool } = require("pg");

function AsMVT(uri, callback) {
  var parsedUrl = url.parse(uri, true);
  this._functionName = parsedUrl.query.function || "gettile";
  //TODO: user, host, database, etc
  callback(null, this);
}

AsMVT.prototype.getTile = function(z, x, y, callback) {
  // TODO: get tile
  return zlib.gzip(compositeTile.getData(), function(err, pbfz) {
    if (err) {
      return callback(err);
    }
    return callback(null, pbfz, {
      "Content-Encoding": "gzip",
      "Content-Type": "application/x-protobuf"
    });
  });
};

AsMVT.prototype.getInfo = function(callback) {
  //TODO: how do we do this?
  callback(null, {});
};

/*
    Register protocol with tilelive 
*/

AsMVT.registerProtocols = function(tilelive) {
  tilelive.protocols["asmvt:"] = AsMVT;
};
AsMVT.registerProtocols(tilelive);
