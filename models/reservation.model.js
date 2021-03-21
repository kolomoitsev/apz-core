const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = new Schema(
    {
        reservationName: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

const ReservationModel = new mongoose.model('Reservation', Reservation);

module.exports = ReservationModel;
