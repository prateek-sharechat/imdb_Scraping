const request = require('request-promise');
const fs = require('fs');
const cheerio = require('cheerio');
const json2csv = require('json2csv').Parser;

const movies = ["https://www.imdb.com/title/tt0111161/?ref_=ttfc_fc_tt",
                "https://www.imdb.com/title/tt0068646/?ref_=ttls_li_tt",
                "https://www.imdb.com/title/tt0468569/?ref_=ttls_li_tt",
                "https://www.imdb.com/title/tt0167260/?ref_=ttls_li_tt"];

(async () => {
        let imdbData = [];

        for (let index = 0; index < movies.length; index++) {
            const element = movies[index];

            const response = await request({
                uri: element,
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
                },
                gzip: true
            });
    
            let $ = cheerio.load(response);
            let title = $('div[class="title_wrapper"] > h1').text().trim();
            let rating = $('div[class="ratingValue"] > strong > span').text().trim();
            let summary = $('div[class="summary_text"]').text().trim();
            let release_date = $('a[title="See more release dates"]').text().trim();
    
            imdbData.push({
                title,
                rating,
                summary,
                release_date
            })
        }
        const j2cp = new json2csv();
        const csv = j2cp.parse(imdbData);

        fs.writeFileSync('./data.csv', csv, "utf-8");
    }
)();