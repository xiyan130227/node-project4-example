/**
 * Created by yangjing on 6/20/17.
 */
const axios = require('axios');

axios.get('http://weixin.sogou.com/antispider/util/seccode.php')
    .then(response => {
        console.log(JSON.parse(response).data)
    })
    .catch(error => {
        console.log(error);
    });