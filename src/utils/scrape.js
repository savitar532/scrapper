const { Builder, By, until } = require('selenium-webdriver');

async function scrape(callback) {
    const driver = await new Builder().forBrowser('chrome').build();
    const productData = {};

    try {
        await driver.get('https://www.nvidia.com/en-in/geforce/buy/');

        await driver.wait(until.elementLocated(By.css('.nv-container.container.responsivegrid.aem-GridColumn--default--none.aem-GridColumn.aem-GridColumn--default--10.aem-GridColumn--offset--default--1')), 20000);

        const products = await driver.findElements(By.css('.nv-container.container.responsivegrid.aem-GridColumn--default--none.aem-GridColumn.aem-GridColumn--default--10.aem-GridColumn--offset--default--1'));
        for (let birds of products) {
            // Correct CSS selector for the grid items
            const grids = await birds.findElements(By.css('.general-container'));
            for (let grid of grids) {
                try {
                    // names
                    const namesElement = await grid.findElement(By.css('.title'));
                    const name = await namesElement.getText();
                    // console.log('Name:', name);
                    try {
                        const priceElement = await grid.findElement(By.css('.startingprice'));
                        let price = await priceElement.getText();
                        // Extract the numeric part of the price using a regular expression
                        const match = price.match(/[\d,]+/);
                        if (match) {
                            price = match[0];
                        } else {
                            price = 'N/A';
                        }
                        // console.log(`Extracted price for ${name}: ${price}`);  // Debugging log
                        productData[name] = price;
                    } catch (priceError) {
                        // console.error('Error extracting price for', name, ':', priceError);
                        productData[name] = 'N/A';
                    }
                } catch (nameError) {
                    console.error('Error extracting name from grid:', nameError);
                }
            }
        }
        
        callback(productData);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await driver.quit();
    }
}

module.exports = scrape;
