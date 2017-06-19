/**
 * Created by yangjing on 6/17/17.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');

async function launchChrome(headless = true) {
    return await chromeLauncher.launch({
        port: 9222,
        chromeFlags: ['--window-size=412,732','--disable-gpu',headless ? '--headless' : '']
    });
}



async function execJs() {
    let chrome = await launchChrome();
    let protocol = await CDP({port: chrome.port});
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'http://weixin.sogou.com/'});

    let hasSearch=false,hasClick=false;

    await Page.loadEventFired(() => {
        console.log('onLoad!!!')
        if(hasClick&&hasSearch){
            console.log('result',hasSearch,hasClick)
            new Promise(resolve=>{
                resolve(Runtime.evaluate({expression: 'document.getElementsByTagName(\'html\')[0].outerHTML'}))
            }).then((result=>{
                console.log(result.result.value)
                // protocol.close()
            }))
        }

        if((!hasClick)&&hasSearch){       
            console.log('click',hasSearch,hasClick)            
            hasClick=true;
            Runtime.evaluate({expression: 'document.getElementsByClassName("time-range")[1].click()'})
        }

        if (!hasSearch){
            console.log('search',hasSearch,hasClick) 
            const js = [
                'var input = document.querySelector(\'#query\')',
                'input.value=\'杨静\'',
                'document.getElementsByClassName("swz")[0].click()'
            ].join(';')   
            hasSearch=true;        
            Runtime.evaluate({expression: js})
            
        }
    });
}

execJs()

