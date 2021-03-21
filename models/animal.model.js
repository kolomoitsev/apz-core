const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Animal = new Schema(
    {
        reservationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reservation',
            required: true,
        },
        animalName: String,
        animalRfdi: {
            type: String,
            required: true,
        },
        animalStatus: {
            type: String,
            default: 'active',
        },
    },
    {
        timestamps: true,
    },
);

const AnimalModel = new mongoose.model('Animal', Animal);

module.exports = AnimalModel;
