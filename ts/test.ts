import * as $ from "jquery";
import {DatabaseLib} from "./database";
$(function() {
  let db = DatabaseLib.Database.get();
  
  console.log("DB:");
  console.log(db.tables);
  console.log("Users in QA:");
  console.log(db.GetUsersInQA());
  console.log("Users in ENG:");
  console.log(db.GetUsersInENG());
  console.log("Users in PUR:");
  console.log(db.GetUsersInPUR());
  console.log("Users in ADMIN:");
  console.log(db.GetUsersInAdmin());
});