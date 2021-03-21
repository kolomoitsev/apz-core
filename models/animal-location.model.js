const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimalLocation = new Schema(
    {
        animalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            required: true,
        },
        animalLocationLat: String,
        animalLocationLng: String,
        animalLocationTime: String,
    },
    {
        timestamps: true,
    },
);

const AnimalLocationModel = new mongoose.model(
    'AnimalLocation',
    AnimalLocation,
);

module.exports = AnimalLocationModel;
