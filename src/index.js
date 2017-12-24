var settings    = require('./config/settings');
var EMCrawler   = require('./crawlers/EMCrawler');

var emCrawler = new EMCrawler(settings.balthazarUrl);

emCrawler.configBalthazar()
  .then(function() {
    return emCrawler.run();;
  });
