const express = require('express');
const compression = require('compression');
const cors = require('cors');

var timeout = require('connect-timeout')

const PORT = process.env.PORT || 5050;
const app = express();

app.use(timeout('5s'))


function haltOnTimeout(req,res,next){
    if(req.timedout){
        console.log("Timed out")
        res.sendStatus(500).send("Timed out")
    } else {
        console.log("Not timed out")
        next()
    }
}

// IMPORT ROUTES
const gridRoute = require('./routes/grid');

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(haltOnTimeout)
app.use(compression());
app.use(haltOnTimeout)

// ROUTES
app.use('/api/grid', gridRoute);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
