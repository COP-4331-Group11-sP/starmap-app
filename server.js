// Environment Setup
const PORT = 5001; // PAUL: 5001, ANDY: 5002, PHILLIP: 5003, JAZZY: 5004

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const MONGODB_URL = process.env.MONGODB_URL;
const NODE_ENV = process.env.NODE_ENV;


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');

const urls = {
    backend: '/backend',
    routes: '/routes',
    models: '/models',
    app: '/app/build',
    certs: '/etc/letsencrypt/live/constellario.xyz'
};


// Redirection Setup for HTTP -> HTTPS
const redirectApp = express();
redirectApp.get('*', (request, result) => {
   result.redirect('https://' + request.headers.host + request.url);
});


let credentials = null;
// SSL Certifaction for HTTPS
if (NODE_ENV === 'production') {
    credentials = {
        key: fs.readFileSync(path.join(urls.certs, 'privkey.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(urls.certs, 'cert.pem'), 'utf8'),
        ca: fs.readFileSync(path.join(urls.certs, 'chain.pem'), 'utf8')
    };
}

//Main HTTPS Server Setup
const app = express();

app.use(cors());
app.use(express.json());

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, urls.app)));

    app.get('/*', (request, result) => {
        result.sendFile(path.join(__dirname, urls.app, '/index.html'));
    });
}


// Mongo DB Connection Setup
try {
    mongoose.connect(
        MONGODB_URL,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    );
} catch (error) {
    console.log("Denied Permission from MongoDB Atlas Server.");
}

// API Routers
const userRouter = require(path.join(__dirname, urls.backend, urls.routes, '/userRoutes.js'));

app.use(userRouter);



// Server startup
if (NODE_ENV === 'production') {

    const httpServer = http.createServer(redirectApp);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(80, () => {
        console.log('HTTP Redirect Server running on port 80');
    });
    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
} else {
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
        console.log('HTTP Developtment Server running on port ' + PORT);
    });
}
