var DocumentDBClient = require('documentdb').DocumentClient;

function DocumentDbDAO(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseId = databaseId;
    this.collectionId = collectionId;
  
    this.database = null;
    this.collection = null;
}

DocumentDbDAO.prototype = {
    getOrCreateDatabase: function(client, databaseId, callback) {
        var querySpec = {
          query: 'SELECT * FROM root r WHERE r.id=@id',
          parameters: [{
            name: '@id',
            value: databaseId
          }]
        };
    
        client.queryDatabases(querySpec).toArray(function(err, results) {
          if (err) {
            callback(err);
          }
    
          if (!err && results.length === 0) {
              console.log("Creo database");
            client.createDatabase({
              id: databaseId
            }, function(err, created) {
              callback(null, created);
            });
          } else {
            callback(null, results[0]);
          }
        });
    },
    
    getOrCreateCollection: function(client, databaseLink, collectionId, callback) {
        var querySpec = {
          query: 'SELECT * FROM root r WHERE r.id=@id',
          parameters: [{
            name: '@id',
            value: collectionId
          }]
        };
    
        client.queryCollections(databaseLink, querySpec).toArray(function(err, results) {
          if (err) {
            callback(err);
          }
    
          if (!err && results.length === 0) {
            console.log("Creo collection");
            client.createCollection(databaseLink, {
              id: collectionId
            }, function(err, created) {
              callback(null, created);
            });
          } else {
            callback(null, results[0]);
          }
        });
    },

    insert: function(url,shorturl) {
        var self = this;
        this.getOrCreateDatabase(self.client, self.databaseId, function(err, db) {
            if (err) {
              callback(err);
            }
            self.database = db;
            self.getOrCreateCollection(self.client, self.database._self, self.collectionId, function(err, coll) {
                if (err) {
                    callback(err);
                }
                self.collection = coll;
                var documentDefinition = { id: shorturl, url: url };
                console.log('Creating document with content: ',documentDefinition);
                self.client.createDocument(self.collection._self, documentDefinition, function(err, document) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Created document with content: ',document);
                    }
                });
            });
        });
    }
}

module.exports = DocumentDbDAO;