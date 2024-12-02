// webpack index
var lib;
import("/src/database.js").then(e => lib = e.DatabaseLib);
import * as $ from './jquery';
$(function () { // $(document).ready shorthand
  var db = lib.Database.get();
  db.ReSeed();
  console.log(db.tables);
  console.log('document onload (jquery) triggered');
  var btn = document.getElementById("InsertQA");
  btn.onclick = function (e) {
    var db = lib.Database.get();
    console.log("btn onclick triggered");
    e.preventDefault();
    var qa = {
      ID: 26,
      Process: "Supplier / Rec. Insp.",
      ProductNo: "91282101",
      OrderNo: "1234-8219",
      ItemDescription: "BALLSAKC",
      DefectDescription: "Punctured",
      QuantityReceived: "100",
      QuantityDefective: "10",
      SignedBy: "Joe Shmoe",
      DateSigned: new Date("2021-01-01")
    }
    console.log(db.tables);
    var msg = db.UpdateQA(qa);
    console.log(msg);
    db.SaveChanges();
    console.log(db.tables);
  };
});
