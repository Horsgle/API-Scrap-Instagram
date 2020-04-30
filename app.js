const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/config');

const instagram = require('./routes/instagram');

app.use(`${config.BASE_SERVER}/instagram`, instagram);

app.listen(config.SERVER_PORT, () => {
  console.log('Starting server...');
  console.log(`${config.NAME_MODULE} running on port`,config.SERVER_PORT);
});

const helmet = require('helmet');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get(`${config.BASE_SERVER}/status`, function(req, res, next){
  res.json({modulo:'Scrap', statusCode:200, servidor:"Online"});
});
