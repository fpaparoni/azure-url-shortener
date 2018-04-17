var DocumentClient = require('documentdb').DocumentClient;

var host = process.env["COSMOSDB_HOST"]; 
var masterKey =  process.env["COSMOSDB_KEY"]; 
var client = new DocumentClient(host, {masterKey: masterKey});
var collectionUrl =  process.env["COSMOSDB_COLL_LINK"];

module.exports = function (context, req) {
    context.log('Read shortener function');
    
    if (req.query.u) {
        var documentLink = (collectionUrl+'/docs/'+req.query.u);    
        client.readDocument(documentLink, function(err,doc){
            if (err) {
                context.res = {
                    status: 400,
                    body: "Url not found"
                };
                context.done();
            } else {
                context.res.status(302)
                            .set('location',doc.url)
                            .send();
            }
        });
        
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an url on the query string"
        };
        context.done();
    }
};
