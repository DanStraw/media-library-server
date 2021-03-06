const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const seederService = require('./services/seeder.service');

mongoose.connect(process.env.dbConnection, { useNewUrlParser: true })

app.use(bodyParser.json())

const corsConfig = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL)
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Accept', 'application/json');
  next()
}

app.use(corsConfig);

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

if (process.env.seedData) {
  seederService.seedData()
}

app.listen(port, () => console.log(`media library server listening on port ${port}!`))