/**
 * Created by yangjing on 6/20/17.
 */
const axios = require('axios');

axios.get('http://upload.chaojiying.net/Upload/Processing.php')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });