"use strict";

import { required } from "../../../lib/utils";
import { Model as MongooseModel, QueryCursor, Document } from "mongoose";
import paginate from "./paginate";
import errors from "../../../lib/errors";

const create =
  (Model: MongooseModel<Document>) =>
  async ({
    data = required("data"),
    populate,
  }: {
    data: any;
    populate?: any;
  }) => {
    const item = new Model(data);
    let doc = await item.save();
    if (populate) {
      doc = await doc.populate(populate).execPopulate();
    }
    return doc.toObject() as any;
  };

const findOne =
  (Model: MongooseModel<Document>) =>
  async ({
    query = required("query"),
    populate,
  }: {
    populate?: string | Array<any>;
    query: object;
  }) => {
    const doc = Model.findOne(query);
    if (populate) {
      doc.populate(populate);
    }
    const item = await doc.exec();
    return item ? item.toObject() : item;
  };

const updateOne =
  (Model: MongooseModel<Document>) =>
  async ({
    query = required("query"),
    update,
    populate,
    options = {},
  }: {
    update: object;
    query: object;
    populate?: any;
    options?: object;
  }): Promise<any> => {
    const opts = Object.assign({}, { new: true, runValidators: true }, options);

    let doc = await Model.findOneAndUpdate(query, update, opts)
      .populate(populate)
      .exec();
    return doc?.toObject();
  };

const upsert =
  (Model: MongooseModel<Document>) =>
  async ({
    query,
    update,
    populate,
  }: {
    query: object;
    update: object;
    populate?: any;
  }) => {
    const doc = await findOne(Model)({ query });
    if (doc) return updateOne(Model)({ query, update, populate });
    return create(Model)({ data: update, populate });
  };

const fetch =
  (Model: MongooseModel<Document>) =>
  ({
    query = required("query"),
    populate,
    batchSize,
    timeout = true,
    mapper,
  }: {
    populate?: string | Array<any>;
    query: object;
    batchSize?: number;
    timeout?: boolean;
    mapper?: any;
  }): QueryCursor<any> => {
    const doc = Model.find(query);

    return doc
      .batchSize(200)
      .populate(populate)
      .cursor()
      .map(mapper || ((doc) => doc));
  };

const count =
  (Model: MongooseModel<Document>) =>
  async (query = required("query")) => {
    const count = Model.countDocuments
      ? await Model.countDocuments(query).exec()
      : await Model.count(query).exec();

    return count;
  };

const deleteOne =
  (Model: MongooseModel<any>) =>
  async ({ query = required("query") }: { query: object }) => {
    const doc = await Model.findOneAndDelete(query).exec();
    return doc;
  };

const deleteMany =
  (Model: MongooseModel<any>) =>
  async ({ query = required("query") }: { query: object }) => {
    return Model.deleteMany(query).exec();
  };

/**
 *
 * Create base model
 */
const BaseModel = (Model: MongooseModel<any>) => {
  return {
    /**
     * Get total items from a collection by query
     */
    count: (query: object = required("query")) => Model.count(query).exec(),
    /**
     * Create new item
     */
    create: create(Model),
    /**
     * Fetch batch items
     */
    fetch: fetch(Model),
    /**
     * Delete one
     */
    deleteOne: deleteOne(Model),
    /**
     * Delete many
     */
    deleteMany: deleteMany(Model),
    /**
     * Get one
     */
    get: findOne(Model),
    /**
     * Paginate resources
     */
    paginate: paginate(Model, count(Model)),
    upsert: upsert(Model),
    updateOne: updateOne(Model),
    ensureExists: async (
      query: object = required("query"),
      populate?: string[]
    ) => {
      const doc = await findOne(Model)({ query, populate });
      if (!doc) {
        throw errors.throwError({
          name: errors.ResourceDoesNotExists,
          message: `resource does not exist ${Object.keys(query).join(",")}`,
        });
      }
      return doc as any;
    },
  };
};

export default BaseModel;
