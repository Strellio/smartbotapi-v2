"use strict";

import * as auth from "./auth";
import * as subscription from "./subscription";

export default function shopifyService() {
  return {
    auth,
    subscription,
  };
}
