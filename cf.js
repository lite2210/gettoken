module.exports = {
    // export URL='mongodb://username:password@localhost:27017/db?authSource=admin',
    port: process.env.PORT || 3002,
    url: process.env.URL || 'mongodb://localhost:27017/testdb'
}