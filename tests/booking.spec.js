import {test,expect} from '@playwright/test';
test('primary CTA reaches a real booking page and scheduler', async ({page}) => {
 await page.goto('/');
 await page.getByRole('link',{name:'Book a Thunderstaff pilot call'}).first().click();
 await expect(page).toHaveURL(/\/book\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Book a Thunderstaff pilot call');
 const scheduler=page.getByRole('link',{name:'Continue to Calendly'});
 await expect(scheduler).toHaveAttribute('href','https://calendly.com/hoyack?utm_source=sharklancer&utm_medium=site&utm_campaign=thunderstaff-pilot');
 await expect(page.getByRole('link',{name:'Email Hoyack instead'})).toHaveAttribute('href',/^mailto:hello@hoyack.com/);
 const response=await page.goto('/book');
 expect(response.status()).toBe(200);
});
