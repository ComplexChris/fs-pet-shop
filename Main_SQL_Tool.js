const { user } = require('pg/lib/defaults');

class Querys{
    constructor(argz){
        // Initializes by creating the 'pg' instance.
        const {Pool} = require('pg');
        this.pool = new Pool({
            user: 'toor',
            host: 'localhost',
            database: 'ChrisDB',
            port: 5432,
            ...argz
        });;
    } // Constructor Closer

    MakeQuery(command){
        // Makes a query with the specified command
        this.pool.query( command , (err, res) => {
            console.log(res);
        });
    } // MakeQuery Closer

    ClosePool(){
        pool.end();
    }

}

const test = new Querys( {password: 'password123'} );

test.MakeQuery("SELECT NOW()");


module.exports = {
    Querys
}

setTimeout( {console.log("Test")}, 1.8e+6 )