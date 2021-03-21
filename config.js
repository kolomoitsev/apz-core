const config = {
    PORT: 3000,
    MONGOOSE_LINK:
        'mongodb+srv://kolomoitsev:HVZD4EdjqXNV6ihQ@cluster0.hnn0k.mongodb.net/sigma',
    jwt: {
        secret: 'sigmatestkey',
        tokens: {
            access: {
                type: 'access',
                expiresIn: '2m',
            },
            refresh: {
                type: 'refresh',
                expiresIn: '3m',
            },
        },
    },
};

module.exports = config;
