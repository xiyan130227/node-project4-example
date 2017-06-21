/**
 * Created by yangjing on 6/20/17.
 */
const program = require('commander');
program
    .version('0.0.1')
    .option('-u, --url [type]', 'Add request url')
    .parse(process.argv);
// console.log(program.url)

const axios = require('axios');
// axios.get('http://upload.chaojiying.net/Upload/Processing.php')
axios.get(program.url)
    .then(function (response) {
        console.log(response.data);

        setTimeout(() => {
            console.log('hello, yangjing!')
        }, 3000)
    })
    .catch(function (error) {
        console.log(error);
    });