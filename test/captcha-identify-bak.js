/*
 * 超级鹰 http 接口(上传)，node.js 示例代码  http://www.chaojiying.com/
 * 注意：需要安装restler : npm install restler
 */
const rest = require('axios');
rest.get('http://weixin.sogou.com/antispider/util/seccode.php').then(img => {
    rest.post('http://upload.chaojiying.net/Upload/Processing.php', {
        data: {
            'user': 'zhongyicrawler',
            'pass': 'zhongyicrawler',
            'softid': '892937',  //软件ID 可在用户中心生成
            'codetype': '1006',  //验证码类型 http://www.chaojiying.com/price.html 选择
            'userfile': img// filename: 抓取回来的码证码文件
        }
    }).then(function (data) {
        // var captcha = JSON.parse(data);
        // console.log('Captcha Encoded.');
        console.log(JSON.stringify(data));
    }).catch(
        error => {
            console.log(error)
        }
    );
}).catch(
    error => {
        console.log(error)
    }
)

