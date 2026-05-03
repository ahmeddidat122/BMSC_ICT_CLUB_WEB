import puppeteer from 'puppeteer';

(async () => {
    try {
        console.log("Starting puppeteer...");
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        console.log("Navigating to localhost...");
        await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
        // Give it an extra second to render any animations/transitions
        await new Promise(r => setTimeout(r, 2000));
        
        console.log("Taking hero screenshot...");
        await page.screenshot({ path: 'scripts/hero_section.png', clip: {x: 0, y: 0, width: 1920, height: 900} });
        
        console.log("Taking full screenshot...");
        await page.screenshot({ path: 'scripts/full_page.png', fullPage: true });


        
        console.log("Done!");
        await browser.close();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
