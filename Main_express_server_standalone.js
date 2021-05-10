const express = require("express")
const pets = require("./Main_pets_standalone")
const Log = pets.Log

module.exports = {
    startExpress
}

//resp = pets.main(["read", "pets.json"])

if (process.argv.length > 2){
    if( process.argv[2]==="server"){
        //startServer()
        // Auto run; IIFE
        console.log("_".repeat(100)+"\n")
        var nothing = startExpress()
    }
}

function startExpress(PORT, DB_PATH){
    // Primary function to handle Express server instance
    Log("Starting server...", "\x1b[36m")
    const callBack = (env, data) => { env.send(data) }
    const server = express()
    server.use(express.json() );
    PORT = PORT || 3500    // Set default port if param is not falsey (undefined)
    DB_PATH = DB_PATH || "pets.json"    // Set default database path if param is not falsey (undefined)

    server.listen(PORT, function listen_func(){
        Log(`Server running/listening on http://localhost:${PORT}`, "\x1b[36m" )
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
        const content = pets.main(["read", DB_PATH, raw["index"]], res)
        Log("Response:", content, "\x1b[32m" )
        //res.send(  "TEST: ", content )
    })
    server.post("/pets", function pets_root_func(req,res) {
        Log("Req body: ", req.body)
        Log("Response: ", res.json({requestBody: req.body}))
        const raw = req.params
        const content = pets.main(["read", DB_PATH, raw["index"]], res)
        Log("Response:", content, "\x1b[32m" )
        //res.send(  "TEST: ", content )
    })

    server.get("/debug", (req,res) => {
        const what = req.query.what    // Small amounts of data, used for every requests
        Log("Debbuging: ", req.params, "\x1b[31m")
        switch(what){
            case "servererror": 
                Log("Throwing server error", "\x1b[31m") 
                server.runMiddleware("/pets")
                
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
        Log("Running back 500: ", err, "\x1b[31m")
        res.status(500)
        res.send(err)
    })
}

/*
(function() {
    // Auto run; IIFE
    var nothing = startExpress()
    Log("ASSSS")
} )();
*/
