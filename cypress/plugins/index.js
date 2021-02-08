module.exports = (on, config) => {
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push('--window-size=1280,720');
            launchOptions.args.push('--force-device-scale-factor=1');
            launchOptions.args.push('--disable-dev-shm-usage');
        }

        return launchOptions;
    });
};
