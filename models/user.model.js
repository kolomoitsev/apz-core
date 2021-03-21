const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        reservationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reservation',
            required: true,
        },
        userName: String,
        userMiddleName: String,
        userLastName: String,
        userEmail: {
            type: String,
            unique: true,
        },
        userPhone: String,
        userRole: String,
        userStatus: String,
        userPassword: String,
    },
    {
        timestamps: true,
    },
);

const UserModel = new mongoose.model('User', User);

module.exports = UserModel;
