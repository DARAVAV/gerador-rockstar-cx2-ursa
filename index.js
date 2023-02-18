require('dotenv').config();
const puppeteer = require('puppeteer-extra')
const fs = require('fs')
var colors = require('colors');
const config = require('./resources/config.json');
const delay = require('./resources/delay.json');
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
  AdblockerPlugin({
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
)
const {
    Webhook
} = require('discord-webhook-node');
const hook1 = new Webhook(config.Webhook);

var livre = 1;

var falhas = 0;
var contas = 0;

async function quack() {
    if (livre >= 1) {
        trocar();
    } else { }
}

function trocar() {

        try {
            (async () => {
                const browser = await puppeteer.launch({
                    executablePath: (config.browser),
                    devtools: false,
                    headless: true,
                    defaultViewport: false,
                    ignoreHTTPSErrors: true,
                    slowMo: (delay.geral),
                    args: [
                        '--disable-gl-drawing-for-tests',
                        '--use-gl=swiftshader',
                        '--disable-canvas-aa',
                        '--disable-2d-canvas-clip-aa',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--mute-audio',
                        '--hide-scrollbars',
                        '--disable-infobars',
                        '--disable-breakpad',
                        '--no-first-run',
                        '--disable-setuid-sandbox',
                        '--disable-infobars',
                        '--ignore-certifcate-errors',
                    ]
                });

                console.clear();

                console.log("┏━━━┳━┓┏━┳━━━┓  ┏┓ ┏┳━━━┳━━━┳━━━┓".red)
                console.log("┃┏━┓┣┓┗┛┏┫┏━┓┃  ┃┃ ┃┃┏━┓┃┏━┓┃┏━┓┃".red)
                console.log("┃┃ ┗┛┗┓┏┛┗┛┏┛┃  ┃┃ ┃┃┗━┛┃┗━━┫┃ ┃┃".red)
                console.log("┃┃ ┏┓┏┛┗┓┏━┛┏┛  ┃┃ ┃┃┏┓┏┻━━┓┃┗━┛┃".red)
                console.log("┃┗━┛┣┛┏┓┗┫ ┗━┓  ┃┗━┛┃┃┃┗┫┗━┛┃┏━┓┃".red)
                console.log("┗━━━┻━┛┗━┻━━━┛  ┗━━━┻┛┗━┻━━━┻┛ ┗┛".red)
                console.log("")
                console.log(`   ${'https://discord.gg/hardzy'.underline.white}`)
                console.log("")
                console.log(`[`.green, `/`.yellow, `]`.green, ` Enviados:`.green, `${contas}`.brightWhite)
                console.log(`[`.red, `<`.yellow, `]`.red, ` Tua mãe, aquela ursa não encontrou tuas cartas:`.red, `${falhas}`.brightWhite)

                try {
                const page = await browser.newPage();
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    if (req.resourceType() == 'image' || req.resourceType() == 'font') {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });
                    await page.goto('https://tuamaeaquelaursa.com/');

                    page.setDefaultNavigationTimeout(delay.TimeoutERRO)

                    const button = await page.waitForXPath(`html/body/div/header/div[2]/form/button`);
                    await button.click();

                    await page.waitForTimeout(3000)
 
                    const from = await page.evaluate(() =>{
                        const el = document.querySelector('.the-message-from');
                        if(!el) return quack(); 
                        return el.innerText;
                    })

                    const subject = await page.evaluate(() =>{
                        const el = document.querySelector('.the-message-subject');
                        if(!el) return quack();
                        return el.innerText;
                    })

                    const url = await page.url()

                    if (from === 'noreply@rockstargames.com') {
                        hook1.send(`***${url}***\n\`\`\`${from} - ${subject}\`\`\``);
                        contas++;
                        browser.close();
                        quack();
                    } else if (from === 'Rockstar Games Social Club <noreply@rockstargames.com>') {
                        hook1.send(`***${url}***\n\`\`\`${from} - ${subject}\`\`\``);
                        contas++;
                        browser.close();
                        quack();
                    } else if (from === '"Rockstar Propaganda" <donotreply@newsletter.rockstargames.com>') {
                        hook1.send(`***${url}***\n\`\`\`${from} - ${subject}\`\`\``);
                        contas++;
                        browser.close();
                        quack();
                    } else if (from == 'Rockstar') {
                        hook1.send(`***${url}***\n\`\`\`${from} - ${subject}\`\`\``);
                        contas++;
                        browser.close();
                        quack();
                    } else {
                        falhas++;
                        browser.close();
                        quack();
                    }

                } catch (err) {
                    falhas++;
                    await browser.close();
                    quack();
                };

            })();
        } catch (err) {};

};

quack();