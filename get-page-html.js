/**
 * Created by yangjing on 6/17/17.
 */
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');

(async function () {

    const chrome = await launchChrome();
    const protocol = await CDP({port: chrome.port});

// Extract the DevTools protocol domains we need and enable them.
// See API docs: https://chromedevtools.github.io/devtools-protocol/
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'https://www.baidu.com/'});

// Wait for window.onload before doing stuff.
    Page.loadEventFired(async () => {
        const js = "document.querySelector('title').textContent";
        // Evaluate the JS expression in the page.
        const result = await Runtime.evaluate({expression: js});

        console.log('Source of page: ' + result.result.value);

        protocol.close();
        chrome.kill(); // Kill Chrome.
    });

})();

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

launchChrome(true).then(chrome => {
});

