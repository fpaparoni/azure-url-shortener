
var DocumentClient = require('documentdb').DocumentClient;
var DocumentDbDAO = require('documentdb-dao');
var shortid = require('shortid');
var database;
var collection;

var host = "";                     // Add your endpoint
var masterKey = "";  // Add the masterkey of the endpoint
var client = new DocumentClient(host, {masterKey: masterKey});

var documentDbDAO = new DocumentDbDAO(client, 'shortener', 'url');
var generated = shortid.generate();
documentDbDAO.insert("cskcsk",generated);