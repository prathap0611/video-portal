var fs = require('fs');
var Q = require('Q');

var readFile = function(fileName) {
    var deferred = Q.defer();
    fs.readFile(fileName, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
};

module.exports = {
    readFile : readFile
};
