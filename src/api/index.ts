"use strict";
import * as db from "../lib/db";
import startServer from "./server";
db.connect().then( async () => {
 return startServer();
  
});
