const express = require("express")
const pets = require("./Main_pets_standalone")
const bodyParser = require('body-parser');
const Log = pets.Log

module.exports = {
    startExpress
}

//resp = pets.main(["read", "pets.json"])

if (process.argv.length > 2){
    if( process.argv[2]==="server"){
        //startServer()
        // Auto run; IIFE
        console.log("\n\n"+"_".repeat(100)+"\n\n", "\x1b[36m" )
        var nothing = new ServerRoot()
    }
    else{
        console.log("USAGE: [server]")
    }
} 

class ServerRoot{
    constructor(argz){
        this.DatabaseRoot = new Querys( {
            user: 'toor',
            host: 'localhost',
            database: 'ChrisDB',
            password: 'password123'
        } );
        
        this.startExpress()
    }

    startExpress(PORT, DB_PATH){
        // Primary function to handle Express server instance 
        Log("Starting server...", "\x1b[36m")
        const callBack = (env, data) => { env.send(data) }
        const server = express()
        server.use(express.json() );
        server.use(bodyParser.json() );
        PORT = PORT || 3600    // Set default port if param is not falsey (undefined)
        DB_PATH = DB_PATH || "pets.json"    // Set default database path if param is not falsey (undefined)

        server.listen(PORT, function listen_func(){
            Log(`Server running/listening on http://localhost:${PORT}`, "\x1b[36m" )
        })

        server.use('/pets', function middle_ware(req, res, next) {
            // Middleware function for all requests
            console.log("\n\n"+"_".repeat(100)+"\n\n", "\x1b[36m" )
            Log(`Middleware - Request type: ${req.method}`, "\x1b[36m" )
            next()
        }) 

        server.get("/", function home_func(req,res) {
            const greet = "You're in the right place, but you'll need to be more specific on where you want to go. \nPlease specify in the URL along with any arguments"
            Log("Home page: ", greet, "\x1b[32m")
            res.status(404)
            res.send( greet ) 
        })

        server.get("/pets/:index", function pets_root_func(req,res) {
            Log("Body: ", req.body)
            const raw = req.params
            const content = pets.readFile(DB_PATH, req.params.index, (data)=>{res.send(data)} ) 
            Log("Response:", content, "\x1b[32m" )
            //res.send(  "TEST: ", content )
        })
        server.post("/pets/add", function pets_root_func_post(req,res) {
            Log("Req body: ", req.body)
            //const [age, kind, name] = [req.body.age, req.body.kind, req.body.name]
            //Log("Req body main: ", age, kind, name)
            //Log("Response: ", res.json({requestBody: req.body}))
            const status = pets.verifyInput(req.body)
            Log(status)
            if( status ){
                const content = pets.update(DB_PATH, req.body, (data)=>{res.send(data)} ) 
                Log("Response:", content, "\x1b[32m" )
            }
            else{
                res.status(404)
                res.send( "Invalid entry." ) 
            }
        })
        
        server.get("/debug", (req,res) => {
            const what = req.query.what    // Small amounts of data, used for every requests
            Log("Debbuging: ", req.params, "\x1b[31m")
            switch(what){
                case "servererror" || "500": 
                    Log("Throwing server error", "\x1b[31m") 
                    //server.runMiddleware("/pets")
                    throw(err)
                default:
                    Log("Unknown debbuging argument", "\x1b[31m")
                    res.send("Debug Complete")
                    
            }
        })

        server.use((req, res, next) => {
            Log("Running back 404", "\x1b[33m")
            res.status(404)
            res.send("Hey, sorry pal, I can't quite find what you are looking for :( ")
        })
        

        server.use((err, req, res, next) => {
            Log("Poop, Running back 500: ", err, "\x1b[31m")
            res.status(500)
            res.send(err)
        })
    }
}

/*
(function() {
    // Auto run; IIFE
    var nothing = startExpress()
    Log("ASSSS")
} )();
*/