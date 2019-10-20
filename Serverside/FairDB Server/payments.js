var braintree = require("braintree");

var express = require("express");
var port = 8080;
var app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "",
	publicKey: "",
	privateKey: ""
});

app.get("/get_client_token", (req, res) => {
	gateway.clientToken.generate({}, function (err, response) {
		var clientToken = response.clientToken;
		res.send(clientToken);
	});
});

app.post("/checkout", (req, res) => {
	let nonceFromTheClient = req.body.payment_method_nonce;

	gateway.transaction.sale({
		amount: "10.00",
		paymentMethodNonce: nonceFromTheClient,
		options: {
			submitForSettlement: true
		}
	}, function (err, result) {
		console.log(result);
	});
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/html/paymentsClient.html");
});

app.listen(port, () => {
    console.log("Listening on port 8080.");
});
