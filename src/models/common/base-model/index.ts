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
      doc = await doc.populate(populate);
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
    const doc = Model.findOne({ is_deleted: { $ne: true }, ...query });
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

const updateMany =
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

    let doc = await Model.updateMany(query, update, opts)
      .populate(populate)
      .exec();

    return doc;
  };

const upsert =
  (Model: MongooseModel<Document>) =>
  async ({
    query,
    update,
    create: createData,
    populate,
  }: {
    query: object;
    update: object;
    create?: object;
    populate?: any;
  }) => {
    const doc = await findOne(Model)({ query });
    if (doc) return updateOne(Model)({ query, update, populate });
    return create(Model)({ data: createData ?? update, populate });
  };

const fetch =
  (Model: MongooseModel<Document>) =>
  ({
    query = required("query"),
    populate,
    sort,
    batchSize,
    timeout = true,
    mapper,
  }: {
    populate?: string | Array<any>;
    query: object;
    batchSize?: number;
    sort?: any;
    timeout?: boolean;
    mapper?: any;
  }): QueryCursor<any> => {
    let doc = Model.find({ is_deleted: { $ne: true }, ...query });

    doc = doc.batchSize(200);

    if (populate) {
      doc = doc.populate(populate) as any;
    }

    if (sort) {
      doc = doc.sort(sort);
    }

    return doc.cursor().map(mapper || ((doc) => doc)) as any;
  };

const count =
  (Model: MongooseModel<Document>) =>
  async (query: object = required("query")) => {
    const count = Model.countDocuments
      ? await Model.countDocuments({
          is_deleted: { $ne: true },
          ...query,
        }).exec()
      : await Model.count({ is_deleted: { $ne: true }, ...query }).exec();

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
    updateMany: updateMany(Model),
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
