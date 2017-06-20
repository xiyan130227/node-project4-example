/**
 * Created by yangjing on 6/20/17.
 */
const axios = require('axios');

axios.post('http://upload.chaojiying.net/Upload/Processing.php', {
    'user': 'zhongyicrawler',
    'pass': 'zhongyicrawler',
    'softid': '892937',  //软件ID 可在用户中心生成
    'codetype': '1006',  //验证码类型 http://www.chaojiying.com/price.html 选择
    // 'userfile': img// filename: 抓取回来的码证码文件
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });