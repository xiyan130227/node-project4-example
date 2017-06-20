/**
 * Created by yangjing on 6/20/17.
 */
const axios = require('axios');

axios.get('http://weixin.sogou.com/antispider/util/seccode.php')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });