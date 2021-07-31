/*
const express = require('express');
const app = express();
*/
const path = require( 'path' );
const {spawn} = require( 'child_process' );

function getStarDataById(starId) {
    return spawn('python', [
        path.join(__dirname, '..', 'python', 'getStarIdsById.py'),
        "\"" + starId.toString() + "\""
    ]);
}
/*
app.get('/api/getStarIdsById', function (req, res) {
    const python = getStarDataById(req.query.id);
    let resData = '';
    res.set('Content-Type', 'text/json');
    python.stdout.on('data', (data) => {
        resData += data.toString();
    });
    python.on('close', (code) => {
        res.send(resData);
    });
})

module.exports = app;
*/
const python = getStarDataById('Vega');
let resData = '';
//res.set('Content-Type', 'application/json');
python.stdout.on('data', (data) => {
    resData += data.toString();
});
python.on('close', (code) => {
    //res.send(resData);
    console.log(resData);
});


