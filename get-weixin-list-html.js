/**
 * Created by yangjing on 6/17/17.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');

let chrome, protocol;

/**
 * Launches a debugging instance of Chrome.
 * @param {boolean=} headless True (default) launches Chrome in headless mode.
 *     False launches a full version of Chrome.
 * @return {Promise<ChromeLauncher>}
 */
async function launchChrome(headless = true) {
    return await chromeLauncher.launch({
        port: 9222, // Uncomment to force a specific port of your choice.
        chromeFlags: [
            '--window-size=412,732',
            '--disable-gpu',
            headless ? '--headless' : ''
        ]
    });
}

async function execJs() {
// Extract the DevTools protocol domains we need and enable them.
// See API docs: https://chromedevtools.github.io/devtools-protocol/
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'http://weixin.sogou.com/'});

// Wait for window.onload before doing stuff.
    await Page.loadEventFired(async () => {
        const js = [
            'var input = document.querySelector(\'#query\')',
            'input.value=\'固原\'',
            'document.getElementsByClassName("swz")[0].click();'
        ].join(';')

        await new Promise(resolve => {
            Page.loadEventFired(() => {
                console.log('search')
                resolve()
            })
            Runtime.evaluate({expression: js})
            console.log('search2')

        });
        // Evaluate the JS expression in the page.
        await new Promise(resolve => {
            Page.loadEventFired(() => {
                console.log('oneday')
                resolve(Runtime.evaluate({expression: 'document.getElementsByTagName(\'html\')[0].outerHTML'}))
            })
            Runtime.evaluate({expression: 'document.getElementsByClassName("time-range")[1].click()'})

        }).then((result => {
            console.log('result')
            console.log('Title of page: ' + result.result.value);
        }));
        console.log('success')
        protocol.close();
        // chrome.kill();

    });

}

(async function () {
    chrome = await launchChrome();
    console.log('chorome')
    protocol = await CDP({port: chrome.port});
    console.log('protocol')

    execJs()
})()

