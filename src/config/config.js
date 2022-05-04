const config = {
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: './DB/ecommerce.sqlite'
        },
        useNullAsDefault: true,
        debug: true
    },
     mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'my-secret-pw',
            database: 'coderhouse'
        }
    }
}

module.exports = { config };