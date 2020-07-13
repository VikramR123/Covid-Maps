import { config } from '../config';

export async function getArticles() {

    var url = 'http://newsapi.org/v2/top-headlines?' +
    'country=us&' +
    'q=Covid&' +
    'apiKey=' + config.NEWS_API;

    var req = new Request(url);

    // fetch(req)
    // .then(function(response){ return response.json(); })
    // .then(function(data) {
    //     const items = data;
    //     console.log('****************************')
    //     console.log("Items: ", items.articles[0])
    //     //console.log(items.articles[0]);
    //     //setHeadlines(items.articles[0]);
    //     //testing = items.articles[0];
    //     //console.log("Testing: ", testing)
    // })
    // .catch(err => console.log(err))

    try {
        let articles = await fetch(req);
        
        let result = await articles.json();
        articles = null;

        return result.articles;
    }
    catch(error) {
        throw(error);
    }
}