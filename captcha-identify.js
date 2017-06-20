/**
 * Created by yangjing on 6/20/17.
 */
const axios = require('axios');
const {captchaInfo} =require("./config.js")

// axios.get('http://weixin.sogou.com/antispider/util/seccode.php')
let captcha_base64

const http = require('http');
const url = 'http://weixin.sogou.com/antispider/util/seccode.php';  //一张网络图片

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
        captcha_base64 = 'data:image/jpg;base64,' + base64_img
        console.log(captcha_base64);
        console.log(captchaInfo)
        captchaInfo[file_base64]=base64_img
        axios.post('http://upload.chaojiying.net/Upload/Processing.php', captchaInfo).then(response => {
            console.log(666666)
            console.log(response.data);
        }).catch(function (error) {
            console.log(7777777)
            console.log(error);
        });
    });
});
