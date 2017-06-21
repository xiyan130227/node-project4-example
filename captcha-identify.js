/**
 * Created by yangjing on 6/20/17.
 */
const axios = require('axios');
// const {captchaInfo} = require("./config.js")

// axios.get('http://weixin.sogou.com/antispider/util/seccode.php')
let captcha_base64

const http = require('http');
const url = 'http://weixin.sogou.com/antispider/util/seccode.php';  //一张网络图片

function getCaptchaValue() {
    http.get(url, res => {
        let chunks = [];
        let size = 0;

        res.on('data', chunk => {
            chunks.push(chunk);
            size += chunk.length;
        });

        res.on('end', err => {
            let data = Buffer.concat(chunks, size);
            const base64_img = data.toString('base64');
            // 'data:image/jpg;base64,' + base64_img
            // captchaInfo[file_base64]=base64_img
            axios.post('http://upload.chaojiying.net/Upload/Processing.php', {
                'user': 'zhongyicrawler',
                'pass': 'zhongyicrawler',
                'softid': '892937',  //软件ID 可在用户中心生成
                'codetype': '1006',  //验证码类型 http://www.chaojiying.com/price.html 选择
                'file_base64': base64_img// filename: 抓取回来的码证码文件
            }).then(response => {
                console.debug(666666)
                console.debug(typeof response.data, response.data);
                return response.data;
            }).catch(function (error) {
                console.debug(7777777)
                console.debug(error);
            });
        });
    });
}

function reportError(pic_id) {
    axios.post('http://upload.chaojiying.net/Upload/Processing.php', {
        'user': 'zhongyicrawler',
        'pass': 'zhongyicrawler',
        'softid': '892937',
        'id': pic_id
    }).then(response => {
        if (response.err_str.indexOf('OK') > -1) {
            console.debug('captcha export error successfully!!!')
        }
    })
}

// getCaptchaValue()
