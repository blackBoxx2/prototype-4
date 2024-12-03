import * as $ from "jquery";
import {DatabaseLib} from "./database";
$(function() {
  let db = DatabaseLib.Database.get();
  console.log(db.tables);
});