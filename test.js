var asmvt = require("./index");

new asmvt("asmvt:///?function=gettile", function(err, tiler) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(tiler);
  tiler.getTile(10, 1000, 1000, function(err, tile) {
    console.log(err, tile);
  });
});
