const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.model');

router
    //get users all
    .get('/', async (req, res) => {
        try {
            const users = await UserModel.findAll({});
            return users.length ? users : [];
        } catch (e) {
            return res.status(500).json({
                message: 'Cant find users',
            });
        }
    });

module.exports = router;
