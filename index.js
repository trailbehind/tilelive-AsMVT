module.exports = AsMVT;

const tilelive = require("@mapbox/tilelive");
const url = require("url");
const zlib = require("zlib");
const { Pool } = require("pg");

function AsMVT(uri, callback) {
  const parsedUrl = url.parse(uri, true);
  const functionName = parsedUrl.query.function;
  if (functionName === null || functionName === undefined) {
    throw "function parameter is required";
  }
  this._query = "select " + functionName + "($1, $2, $3)";
  this.pool = new Pool({
    user: parsedUrl.query.user || process.env.PGUSER,
    host: parsedUrl.query.host || process.env.PGHOST,
    database: parsedUrl.query.database || process.env.PGDATABASE,
    password: parsedUrl.query.password || process.env.PGPASSWORD,
    port: parsedUrl.query.port || process.env.PGPORT
  });
  // Verify connection details are correct
  this.pool.query("Select postgis_version()", (err, res) => {
    if (err) {
      return callback(err);
    }
    callback(null, this);
  });
}

AsMVT.prototype.getTile = function(z, x, y, callback) {
  this.pool.query(this._query, [z, x, y], (err, res) => {
    if (err) {
      return callback(err);
    }
    return zlib.gzip(res.rows[0][0], function(err, pbfz) {
      if (err) {
        return callback(err);
      }
      return callback(null, pbfz, {
        "Content-Encoding": "gzip",
        "Content-Type": "application/x-protobuf"
      });
    });
  });
};

AsMVT.prototype.getInfo = function(callback) {
  callback(null, {
    name: "tilelive_AsMVT tileset",
    minzoom: 0,
    maxzoom: 12,
    center: [0, 0, 12],
    bounds: [-180, -85.0511, 180, 85.0511],
    format: "pbf"
  });
};

/*
    Register protocol with tilelive 
*/

AsMVT.registerProtocols = function(tilelive) {
  tilelive.protocols["asmvt:"] = AsMVT;
};
AsMVT.registerProtocols(tilelive);
