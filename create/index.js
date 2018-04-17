var DocumentClient = require('documentdb').DocumentClient;
var shortid = require('shortid');

// Add your endpoint 
var host = process.env["COSMOSDB_HOST"];  
// Add the masterkey of the endpoint
var masterKey =  process.env["COSMOSDB_KEY"];  
var client = new DocumentClient(host, {masterKey: masterKey});
var collectionUrl =  process.env["COSMOSDB_COLL_LINK"]; 

function processResponse(err,doc,context,client,url) {
    if (err) {
        if (err.code==409) {
            context.log('Conflict with insert');
            var generated = shortid.generate();
            var documentDefinition = { id: generated, url: url };
            client.createDocument(collectionUrl, documentDefinition, function(errRetry,docRetry){
                processResponse(errRetry,docRetry,context,client,url);
            });
        } else {
            context.log(err);
            throw err;
        }
    } else {
        context.log('Short url created');
        context.log('result', doc);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Url created with id " + doc.id
        };
        context.done();
    }
}

module.exports = function (context, req) {
    var url;
    context.log('Url shortener create function');

    if (req.query.url || (req.body && req.body.url)) {
        var generated = shortid.generate(); 
        var documentDefinition = { id: generated, url: req.body.url };
        url=req.query.u;
        client.createDocument(collectionUrl, documentDefinition,function(err,doc){
            processResponse(err,doc,context,client,url);
        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an url on the query string or in the request body"
        };
        context.done();
    }
    
}; 

