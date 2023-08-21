"use strict";
import { SandboxedJob } from "bullmq";
import * as db from "../../lib/db";
import * as redis from "../../lib/redis";

export default async function syncProductsWorker(job: SandboxedJob<any>) {
  await Promise.all([db.connect(), redis.connect()]);

  console.log("running syncing product job for ", job.data);
}
