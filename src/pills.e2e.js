const puppeteer = require('puppeteer');
const assert = require('assert');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5000');

  const pills = await page.$$('.pill');
  const pillsCoordsBefore = await Promise.all(
    pills.map((pill) => pill.boundingBox())
  );

  await page.screenshot({ path: './screenshots/pills-before.png' });

  await page.keyboard.press('Tab'); // skip shuffle button
  for (let i = 0; i < pills.length; i++) {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
  }

  await page.screenshot({ path: './screenshots/pills-after.png' });

  const pillsAfter = await page.$$('.pill');
  const pillsCoordsAfter = await Promise.all(
    pillsAfter.map((pill) => pill.boundingBox())
  );

  pillsCoordsBefore.forEach((before, i) => {
    const after = pillsCoordsAfter[i];
    // check if the pill is still on the same line
    assert.equal(before.y, after.y);
  });
  await browser.close();
})();
