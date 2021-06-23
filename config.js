const config = {
    PORT: 3001,
    MONGOOSE_LINK:
        'mongodb+srv://kolomoitsev:HVZD4EdjqXNV6ihQ@cluster0.hnn0k.mongodb.net/sigma',
    jwt: {
        secret: 'sigmatestkey',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '10d',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '50d',
            },
        },
    },
};

module.exports = config;