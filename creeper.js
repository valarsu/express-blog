/**
 * Created by valarsu on 2016/8/26.
 */
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');

var requrl = 'http://www.sijihuisuo.club/';
request(requrl, function (error, response, body) {
    // console.log(response.statusCode);
    if (! error && response.statusCode == 200) {
        // console.log(body);
        acquireDate(body);
    }
});

function acquireDate(data) {
    var $ = cheerio.load(data); //cheerio解析data

    var meizi = $('.preview img').toArray();   //將所有圖片放到一個數組中
    console.log(meizi.length);
    var len = meizi.length;
    for (var i = 0; i < len; i ++) {
        var imgsrc = meizi[i].attribs.src;  //循環輸出數組中每個src地址
        console.log(imgsrc);
        var filename = pareUrlForFileName(imgsrc);
        downloadImg(imgsrc, filename, function () {
            console.log(filename + ' done.');
        });
    }
}

function pareUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

function downloadImg (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
      if (err) {
          console.log('err:' + err);
          return false;
      }
      console.log('res:' + res);
      request(uri).pipe(fs.createWriteStream('public/images/creeper/' + filename)).on('close', callback);
  });
};
