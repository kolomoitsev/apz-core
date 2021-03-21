const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const config = require('./config');

const userApi = require('./api/user.api');
const reservationApi = require('./api/reservation.api');

const MONGODB_LINK = config.MONGOOSE_LINK;

mongoose.connect(MONGODB_LINK, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const connection = mongoose.connection;

connection
    .once('open', () => {
        console.log(`MongoDb connection established successfully`);
    })
    .catch((err) => console.log(err));

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userApi);
app.use('/reservation', reservationApi);

const PORT = process.env.PORT || 3000;

server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
