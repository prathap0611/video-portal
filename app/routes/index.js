var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var utils = require('../utils/utils');
var indexPage,movie_mp4;
/* GET home page. */

utils.readFile(path.resolve(__dirname,"../public/html/client.html")).then(function(data) {
    indexPage = data;
});

fs.readFile(path.resolve(__dirname,"../public/videos/movie.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});

router.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(indexPage);
    res.end();
});

router.get('/movie.mp4', function(req, res) {
    var total = movie_mp4.length;
    var range = req.headers.range;
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    // if last byte position is not present then it is the last byte of the video file.
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end-start)+1;
    res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                        "Accept-Ranges": "bytes",
                         "Content-Length": chunksize,
                         "Content-Type":"video/mp4"});
    res.end(movie_mp4.slice(start, end+1), "binary");
});

module.exports = router;
