const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const router = require('./app/router');
const cors = require('cors');
const multer = require('multer');

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors('*'));

app.use(express.urlencoded({extended: true}));
const mutipartParser = multer();
app.use(mutipartParser.none());

const bodySanitizer = require('./app/middlewares/body-sanitizer');
app.use(bodySanitizer);


app.use('/assets', express.static('assets'));

app.use(router);

app.get('/', (req, res) => {
  res.sendFile('./index.html', {root: '.'});
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...and on ${process.env.PGSQL_URL}`);
});
