const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const { logUserAction } = require('./middlewares/userLogMiddleware');

const app = express();

const privateKey = fs.readFileSync(
	path.resolve(__dirname, '../certs/localhost+2-key.pem'),
	'utf8'
);
const certificate = fs.readFileSync(
	path.resolve(__dirname, '../certs/localhost+2.pem'),
	'utf8'
);

app.use(express.json());
app.use(
	cors({
		origin: 'https://localhost:5173',
		credentials: true,
	})
);
app.use('/', logUserAction, routes);

https
	.createServer({ key: privateKey, cert: certificate }, app)
	.listen(PORT, '0.0.0.0', () => {
		console.log(`Connected to server. Listening on HTTPS PORT ${PORT}.`);
	});
