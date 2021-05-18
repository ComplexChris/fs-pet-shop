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

    MakeQuery(command, callBack){
        // Makes a query with the specified command
        this.pool.query( command , (err, res) => {
            console.log(res);
            if(callBacK){
                callBack(res)
            }
            else{
                return(err)
            }
        });
    } // MakeQuery Closer

    ClosePool(timeOut){
        timeOut = timeOut || 10000;
        const [main, warn] = [timeOut*.95, timeOut*.05]
        setTimeout( ()=>{
            console.log(`\n!!! Pool is closing in: ${ warn/60000 } minutes !!!\n`,  "\x1b[31m")
            setTimeout( ()=>{
                pool.end()
                console.log("\n!!! Pool is now closed !!!\n", "\x1b[31m") 
            },warn )
        }, main );
    }

    CreateDB(db_name){
        exec(`createdb ${db_name}`, (error, stdout, stderr) => {
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

}


module.exports = {
    Querys
};
