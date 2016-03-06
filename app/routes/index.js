var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var utils = require('../utils/utils');
var indexPage, movie_mp4;
/* GET home page. */

utils.readFile(path.resolve(__dirname, "../public/html/client.html")).then(function (data) {
    indexPage = data;
});

fs.readFile(path.resolve(__dirname, "../public/videos/movie.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});

router.get('/', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write(indexPage);
    res.end();
});

router.get('/movie.mp4', function (req, res) {
    var file = path.resolve(__dirname, "../public/videos/movie.mp4");
    var range = req.headers.range;
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);

    fs.stat(file, function (err, stats) {
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        var stream = fs.createReadStream(file, {
            start: start,
            end: end
        })
        .on("open", function () {
            stream.pipe(res);
        }).on("error", function (err) {
            res.end(err);
        });
    });
});

module.exports = router;