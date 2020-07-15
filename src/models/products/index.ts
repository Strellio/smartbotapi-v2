'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('products', schema)
const ProductModel = BaseModel(Model)

export default ProductModel
