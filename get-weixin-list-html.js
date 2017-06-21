/**
 * Created by yangjing on 6/17/17.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');
let fs = require('fs');
const program = require('commander');
const captcha = require("./captcha-identify")

program
    .version('0.0.1')
    .option('-k, --keyword [type]', 'Add wechat searchword')
    .parse(process.argv);
// console.log(program.keyword)

async function launchChrome(headless = true) {
    return await chromeLauncher.launch({
        port: 9222,
        chromeFlags: ['--window-size=412,732', '--disable-gpu', headless ? '--headless' : '']
    });
}

let chrome, protocol

(async function execJs() {
    chrome = await launchChrome();
    protocol = await CDP({port: chrome.port});
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'http://weixin.sogou.com/'});

    let hasSearch = false, hasClick = false;
    let identifyTimes = 0
    let listPageHtmls = []
    let picId

    await Page.loadEventFired(() => {
        console.debug('onLoad!!!')
        if (hasClick && hasSearch) {
            console.debug('result', hasSearch, hasClick)
            new Promise(resolve => {
                resolve(Runtime.evaluate({expression: 'document.getElementsByTagName(\'html\')[0].outerHTML'}))
            }).then(result => {
                if (identifyTimes <= 3 && result.result.value.indexOf
                    ('用户您好，您的访问过于频繁，为确认本次访问为正常用户行为，需要您协助验证。') > -1) {
                    //验证码处理
                    if (identifyTimes != 0) {
                        captcha.reportError(picId);
                    }

                    new Promise(resolve => {
                        resolve(captcha.getCaptchaValue())
                    }).then(identifyResult => {
                        picId = identifyResult.pic_id
                        const submitCaptchaJs = [
                            'var input = document.querySelector(\'#seccodeInput\')',
                            'input.value=\'' + identifyResult.pic_str + '\'',
                            'document.getElementById("submit").click()'
                        ].join(';')
                        resolve(Runtime.evaluate({expression: submitCaptchaJs}))
                        identifyTimes++
                    })
                } else if (identifyTimes > 3) {
                    console.error('Captcha identify times already over 3!!!')
                } else {
                    //将源码内容放入到数组中
                    listPageHtmls.push(result.result.value)
                    new Promise(resolve => {
                        resolve(Runtime.evaluate({expression: 'document.getElementById(\'sogou_next\').innerHTML'}))
                    }).then(data => {
                        const hasNext = data.result.value
                        if (hasNext.indexOf('下一页') > -1) {
                            Runtime.evaluate({expression: 'document.getElementById(\'sogou_next\').click()'})
                            listPageHtmls.push('=====================================')
                            console.debug('listPageHtmls.length: ' + listPageHtmls.length)
                        }
                    }).catch(err => {
                        console.error('catch error: ' + err)
                        console.debug('End crawler successfully!')
                        console.debug('listPageHtmls: ' + listPageHtmls)
                        protocol.close()
                        chrome.kill()
                    })
                }
            })
        }

        if ((!hasClick) && hasSearch) {
            console.debug('click', hasSearch, hasClick)
            hasClick = true;
            //搜索"一天内"
            // Runtime.evaluate({expression: 'document.getElementsByClassName("time-range")[1].click()'})
            //搜索当日微信数据
            Runtime.evaluate({expression: 'document.getElementById(\'time_enter\').click()'})
        }

        if (!hasSearch) {
            console.debug('search', hasSearch, hasClick)
            const js = [
                'var input = document.querySelector(\'#query\')',
                'input.value=\'固原 天气\'',
                // 'input.value=\'' + program.keyword + '\'',
                'document.getElementsByClassName("swz")[0].click()'
            ].join(';')
            hasSearch = true;
            Runtime.evaluate({expression: js})
        }
    });
})()

