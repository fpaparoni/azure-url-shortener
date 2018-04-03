
var DocumentClient = require('documentdb').DocumentClient;

// Add your endpoint
var host = "https://hellocloud.documents.azure.com:443/";      
// Add the masterkey of the endpoint
var masterKey = "";  
var client = new DocumentClient(host, {masterKey: masterKey});

var documentLink = ('dbs/shortener/colls/url/docs/r1WeYw-of');	
client.readDocument(documentLink, processResponse);

function processResponse(err,createdDocument) {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log('result', createdDocument);
    }
}