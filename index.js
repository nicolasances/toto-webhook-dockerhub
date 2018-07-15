var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");

var postBuild = require('./dlg/PostBuild.js');

var apiName = 'webhook-dockerhub';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, GoogleIdToken");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(express.static('/app'));

/**
 * Smoke test api
 */
app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});

/**
 * Receives a notification that a build on dockerhub has been performed.
 */
app.post('/builds', function(req, res) {
  postBuild.do(req.body).then(function(result) {res.status(200).send(result);});
});

app.listen(8080, function() {
  console.log('Dockerhub Webhook Microservice up and running');
});
