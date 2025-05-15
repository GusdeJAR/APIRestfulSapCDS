// src/models/Strategy.js
const mongoose = require("mongoose");

const DetailRowRegSchema = new mongoose.Schema({
  CURRENT: Boolean,
  REGDATE: Date,
  REGTIME: Date,
  REGUSER: String
}, {_id: false});

const DetailRowSchema = new mongoose.Schema({
  ACTIVED: Boolean,
  DELETED: Boolean,
  DETAIL_ROW_REG: [DetailRowRegSchema]
}, {_id: false});

const RuleSchema = new mongoose.Schema({
  INDICATOR: String,
  PERIOD: Number,
  CONDITION: String,
  ACTION: String
}, {_id: false});

const StrategySchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  NAME: String,
  DESCRIPTION: String,
  RULES: [RuleSchema],
  DETAIL_ROW: DetailRowSchema
},{
  collection: "STRATEGIES"
});

module.exports = mongoose.model("Strategy", StrategySchema);
