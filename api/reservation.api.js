const express = require('express');
const router = express.Router();

const reservationModel = require('./../models/reservation.model');
const { authenticateToken } = require('./../helpers/index');

router
    //get all reservations
    .get('/', async (req, res) => {
        try {
            const reservations = await reservationModel.find({});

            if (reservations.length) {
                return res.status(200).json(reservations);
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding reservations',
                e,
            });
        }
    })
    //add new reservation
    .post('/', async (req, res) => {
        const { reservationName } = req.body;

        const reservation = new reservationModel({
            reservationName,
        });

        await reservation
            .save()
            .then(() => res.status(200).json(reservation))
            .catch((err) =>
                res.status(500).json({
                    error: 'Error with creating new reservation',
                    err,
                }),
            );
    })
    //get exact reservation
    .get('/:reservation_id', authenticateToken, async (req, res) => {
        const { reservation_id } = req.params;
        try {
            const reservation = await reservationModel.findById(reservation_id);
            if (reservation) {
                return res.status(200).json(reservation);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding exact reservation',
            });
        }
    })
    //edit exact reservation
    .patch('/:reservation_id', authenticateToken, async (req, res) => {
        const { reservation_id } = req.params;
        const { reservationName } = req.body;
        try {
            const reservation = await reservationModel.findByIdAndUpdate(
                reservation_id,
                {
                    reservationName,
                },
            );
            if (reservation) {
                return res.status(200).json(reservation);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with updating exact reservation',
            });
        }
    })
    //delete exact reservation
    .delete('/:reservation_id', authenticateToken, async (req, res) => {
        const { reservation_id } = req.params;
        try {
            const remove = await reservationModel.findByIdAndDelete(
                reservation_id,
            );
            if (remove) {
                return res.status(200).json({
                    message: 'Successfully deleted',
                });
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with deleting exact reservation',
            });
        }
    });

module.exports = router;
