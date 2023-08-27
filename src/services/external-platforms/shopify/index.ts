"use strict";

import * as auth from "./auth";
import * as subscription from "./subscription";
import  syncProducts from "./product-sync"

export default function shopifyService() {
  return {
    auth,
    subscription,
    syncProducts
  };
}
