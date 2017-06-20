/*
 * 超级鹰 http 接口(上传)，node.js 示例代码  http://www.chaojiying.com/
 * 注意：需要安装restler : npm install restler
 */

var rest = require('restler'),
    fs = require('fs'),
    filename = 'captcha.jpg';

rest.post('http://upload.chaojiying.net/Upload/Processing.php', {
    multipart: true,
    data: {
        'user': 'zhongyicrawler',
        'pass': 'zhongyicrawler',
        'softid': '892937',  //软件ID 可在用户中心生成
        'codetype': '1006',  //验证码类型 http://www.chaojiying.com/price.html 选择
        'userfile': rest.file(filename, null, fs.statSync(filename).size, null, 'image/jpg') // filename: 抓取回来的码证码文件
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).on('complete', function (data) {
    var captcha = JSON.parse(data);
    console.log('Captcha Encoded.');
    console.log(captcha);
});