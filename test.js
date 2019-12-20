var asmvt = require("./index");

new asmvt(
  "asmvt:///?host=localhost&user=postgres&database=osm&port=15432",
  function(err, tiler) {
    console.log(tiler);
    tiler.getTile(0, 0, 0, function(err, tile) {
      console.log(err, tile);
    });
  }
);
