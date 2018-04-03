
var DocumentClient = require('documentdb').DocumentClient;
var shortid = require('shortid');

// Add your endpoint
var host = "https://hellocloud.documents.azure.com:443/";      
// Add the masterkey of the endpoint
var masterKey = "";  
var client = new DocumentClient(host, {masterKey: masterKey});

var generated = shortid.generate();
var documentDefinition = { id: generated, url: "gege" };
var collectionUrl = ('dbs/shortener/colls/url');	
client.createDocument(collectionUrl, documentDefinition, processResponse);

function processResponse(err,createdDocument) {
    if (err) {
        if (err.code==409) {
            console.log("Conflict with insert");
            var generated = shortid.generate();
            var documentDefinition = { id: generated, url: "gege5" };
            client.createDocument(collectionUrl, documentDefinition, processResponse);
        } else {
            console.log(err);
            throw err;
        }
    } else {
        console.log('result', createdDocument);
    }
}