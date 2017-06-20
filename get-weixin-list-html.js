/**
 * Created by yangjing on 6/17/17.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');
var fs = require('fs');

async function launchChrome(headless = true) {
    return await chromeLauncher.launch({
        port: 9222,
        chromeFlags: ['--window-size=412,732','--disable-gpu',headless ? '--headless' : '']
    });
}

let chrome, protocol

async function execJs() {
    chrome = await launchChrome();
    protocol = await CDP({port: chrome.port});
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'http://weixin.sogou.com/'});

    let hasSearch=false,hasClick=false;

    // let resultPages=[]

    await Page.loadEventFired(() => {
        console.log('onLoad!!!')
        if(hasClick&&hasSearch){
            console.log('result',hasSearch,hasClick)
            new Promise(resolve=>{
                resolve(Runtime.evaluate({expression: 'document.getElementsByTagName(\'html\')[0].outerHTML'}))
            }).then((result=>{
                // resultPages.push(result.result.value)

                fs.appendFile('./result.txt', result.result.value + "\r\n", {flag: 'a'}, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('写入成功');
                    }
                    Runtime.evaluate({expression: 'document.getElementById("sogou_next").click()'})
                });
            }))
            protocol.close()
        }

        if ((!hasClick) && hasSearch) {
            console.log('click', hasSearch, hasClick)
            hasClick=true;
            //搜索"一天内"
            // Runtime.evaluate({expression: 'document.getElementsByClassName("time-range")[1].click()'})
            //搜索当日微信数据
            Runtime.evaluate({expression: 'document.getElementById(\'time_enter\').click()'})
        }

        if (!hasSearch){
            console.log('search', hasSearch, hasClick)
            const js = [
                'var input = document.querySelector(\'#query\')',
                'input.value=\'固原\'',
                'document.getElementsByClassName("swz")[0].click()'
            ].join(';')
            hasSearch = true;
            Runtime.evaluate({expression: js})

        }
    });
}

execJs()

