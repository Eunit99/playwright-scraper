// Import the Chromium browser into our scraper.
import {
    chromium
} from 'playwright';

// Open a Chromium browser. We use headless: false
// to be able to watch the browser window.
const browser = await chromium.launch({
    headless: false
});

// Open a new page / tab in the browser.
const page = await browser.newPage()
// Tell the tab to navigate to the L'Équipe.fr page.
await page.goto('https://www.lequipe.fr/Chrono');


// Pause to see what's going on.
await page.waitForTimeout(120_000);

await page.waitForFunction(() => {
    // Find all article card elements (consider a more generic selector if needed)
    const articleCards = document.querySelectorAll(".ChronoItem");
    return articleCards.length > 5;
});




// Get page data
const scrapedPosts = await page.$$eval('.ChronoItem', (articleCards) => {
    return articleCards.map(card => {

        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)

        // Consider using specific selectors here (adjust if needed)
        const link = card.querySelector(".Link.ChronoItem__link")?.href || null;
        const time = card.querySelector(".ChronoItem__time").innerText?.trim() || null;
        const summary = card.querySelector(".ChronoItem__summary").innerText?.trim() || null;
        const tags = card.querySelectorAll(".ArticleTags__item").innerText?.trim()?.split(",") || null;

        return {
            link,
            time,
            summary,
            tags
        };
    });
});

// Add scraped posts from this page
console.log("Scraped posts from current page:", scrapedPosts);



// Pause for 10 seconds, to see what's going on.
await page.waitForTimeout(10000);

// Turn off the browser to clean up after ourselves.
await browser.close();