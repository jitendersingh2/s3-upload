// BUCKET=s3-html-upload ACCESS_KEY_ID=AKIATOYXF4Y4VBJUTV6E  SECRET_ACCESS_KEY=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 node app.js
const express = require('express');
const app = express();
var AWS = require("aws-sdk");
var path = require('path');
var bodyParser = require("body-parser");
var moment = require('moment');
const HTTP_PORT = 3000;

var BUCKET = 'submit-upload';

var bucket = new AWS.S3({
    signatureVersion: "v4"
});

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get("/getObjectS3", function(request, response){
	bucket.getBucketEncryption({ Bucket: BUCKET }, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log(data);           // successful response
			response.send(data);
		}
	});
});

// viewed at http://localhost:3000
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post("/putObjectS3", function(request, response){
	var data = request.body;
	console.log('data- ', data);
	var { resource } = data;

	var path = resource + "/" + resource + '-' + data.team + "-" + moment().format('MM-DD-YYYY') + ".json";
	var params = {
		Bucket: BUCKET,
		Key: path,
		ContentType: 'application/json',
		Body: JSON.stringify(data, null, 4),
		ACL: 'public-read'
	};

	bucket.putObject(params, function(err, res) {
		if (err) {
			console.log('e- ', err);
			response.status(err.statusCode).send(JSON.stringify(err));
		} else {
			console.log('res- ', res);
			response.send(JSON.stringify(res));
		}
	});
});

app.listen(HTTP_PORT, () => console.log('...WWW Node Server listening on port ' + HTTP_PORT + '!'));
