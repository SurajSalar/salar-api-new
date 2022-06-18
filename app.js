require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db')
const fs = require('fs');
const http = require('http');
app.use(bodyParser.json({ limit: '100mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({
	limit: '100mb',
	extended: true
}));
const server = http.createServer(app);
const path = require('path');


const crossOption = {
	methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
	credentials: true
};

app.use(function (req, res, next) {
	req.header("Access-Control-Allow-Origin", "*");
	req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(cors(crossOption));


require('./config/routes')(router, app);
app.use(router);


server.listen(PORT, () => console.log(`running on port ${PORT}`));