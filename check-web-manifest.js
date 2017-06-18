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
    const {Page} = protocol;
    await Page.enable();

    Page.navigate({url: 'https://www.baidu.com/'});

// Wait for window.onload before doing stuff.
    Page.loadEventFired(async () => {
        const manifest = await Page.getAppManifest();

        if (manifest.url) {
            console.log('yes')
            console.log('Manifest: ' + manifest.url);
            console.log(manifest.data);
        } else {
            console.log('no')
            console.log('Site has no app manifest');
        }

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
