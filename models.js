'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const quoteSchema = mongoose.Schema({
  quote: {type: String, required: true },
  dateAdded: {type: Date, default: Date.now }
});

quoteSchema.methods.serialize = function() {
  return {
    id: this._id,
    quote: this.quote,
    dateAdded: this.dateAdded
  };
};

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = {Quote};
