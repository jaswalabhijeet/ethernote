var fs = require('fs');
var Web3 = require('web3');
var web3;
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var contractABI = config.smartContract.abi;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  if (config.environment == "live")
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.live));
  else if (config.environment == "dev")
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
  else
    web3 = new Web3(new Web3.providers.HttpProvider(config.smartContract.rpc.test));
}

var contractAddress;
if (config.environment == "live") {
	contractAddress = config.smartContract.contractAddress.live;
} else if (config.environment == "dev") {
	contractAddress = config.smartContract.contractAddress.test;
} else {
	contractAddress = config.smartContract.contractAddress.test;
}

var docId = "9a3de1b41a84a8ea901a32d258339bc26177b642";
var docHash = "dskmfdsj32kl4jlkfgjfdlkgjfdslg";

addData();

function addData() {
	console.log("config:");
	console.log(config);
	if(!web3.isConnected()) {
		console.log('{code: 200, title: "Error", message: "check RPC"}');
	} else {
		console.log(web3.eth.accounts);
		web3.eth.defaultAccount = web3.eth.accounts[0];
		console.log("web3.eth.defaultAccount:");
		console.log(web3.eth.defaultAccount);

		attachToContract(function(err, contract) {

			addAgreementHashToContract(contract, docId, docHash, function(err, val) {
				console.log("addAgreementHashToContract:");
				console.log("docId: " + docId);
				console.log("result: " + val);
			});

		});
	}
}

function attachToContract(cb) {
	if(!web3.isConnected()) {
		if (cb) {
				cb({code: 200, title: "Error", message: "check RPC"}, null);
			}
	} else {
		console.log(web3.eth.accounts);
		web3.eth.defaultAccount = web3.eth.accounts[0];
		console.log("web3.eth.defaultAccount:");
		console.log(web3.eth.defaultAccount);
		
		var MyContract = web3.eth.contract(contractABI);

		contract = MyContract.at(contractAddress);
		
		if (cb) {
			cb(null, contract);
		}
	}
}

function addAgreementHashToContract(contract, signatureRequestId, contractHash, cb) {
	if(!web3.isConnected()) {
		cb({code: 500, title: "Error", message: "check RPC"}, null);
	} else {
		contract.newDoc.sendTransaction(signatureRequestId, contractHash, {gas: 100000, from: web3.eth.defaultAccount}, function(err, result) {
			cb(err, result);
		});
	}
}