const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const tap_az_main_url = 'https://tap.az';
const config = JSON.parse(fs.readFileSync("config.json"))


//save last adv time
let lastAdvTime = '';

// get and export first adv details
exports.GetLastAdv = function() {
    return new Promise(async (resolve, reject) => {
        try {
            var data = fs.readFileSync('database.json');
            var myObject = JSON.parse(data);
            console.log(myObject)
            // html from get request
            await request(config.link, function(error, response, body) {
                // last adv html
                var $ = cheerio.load(body)
                const firstAdvHtml = $(body)
                    .find('.products-i')
                    .first()
                    .html();

                // adv added time
                const advAddedTime = $('.products-link > .products-created', firstAdvHtml).text();
                // compare added time with aur last saved ads time
                if (lastAdvTime === advAddedTime) {
                    resolve(false);
                } else {

                    // adv link
                    const advLink = tap_az_main_url + $('.products-link', firstAdvHtml).attr('href');


                    for (let k in myObject.ads) {
                        console.log(k)
                        if (myObject.ads[k].link === advLink) {
                            return true;
                        }
                    }


                    myObject.ads.push({
                        link: advLink
                    });
                    fs.writeFileSync("database.json", JSON.stringify(myObject))
                    

                    // name
                    const advName = $('.products-link > .products-name', firstAdvHtml).text();

                    // adv price
                    const advPrice =
                        $('.products-link .price-val', firstAdvHtml).text() +
                        ' ' +
                        $('.products-link .price-cur', firstAdvHtml).text();
                    // change last time in memory
                    lastAdvTime = advAddedTime;
                    console.log(advPrice)
                    resolve({
                        advName,
                        advLink,
                        advPrice,
                        advAddedTime
                    });
                }
            });

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};