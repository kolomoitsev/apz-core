const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenModel = new Schema({
    tokenId: String,
    userId: String,
});

const Token = new mongoose.model('Token', TokenModel);

module.exports = Token;
