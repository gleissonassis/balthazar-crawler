var request       = require('request');
var Promise       = require('promise');
var parseString   = require('xml2js').parseString;
var cheerio       = require('cheerio');
var crypto        = require('crypto');
var iconv = require('iconv-lite');

module.exports = function(balthazarUrl) {
  var urls = [
    'http://www.em.com.br/rss/noticia/agropecuario/rss.xml',
    'http://www.em.com.br/rss/noticia/economia/rss.xml',
    'http://www.em.com.br/rss/noticia/gerais/rss.xml',
    'http://www.em.com.br/rss/noticia/internacional/rss.xml',
    'http://www.em.com.br/rss/noticia/nacional/rss.xml',
    'http://www.em.com.br/rss/noticia/politica/rss.xml',
    'http://www.em.com.br/rss/noticia/tecnologia/rss.xml'
  ];
  return {
    configBalthazar: function() {
      //this method initialize balthazar by creating a system to store
      //documents crawled from EM.com.br
      return new Promise(function(resolve) {
        request({
          uri: balthazarUrl + '/systems',
          method: 'POST',
          json: {
            id: 'EM',
            name: 'Em.com.br o maior portal de Minas Gerais'
          }
        }, function(error, response, body) {
          resolve(body);
        });
      });
    },

    run: function() {
      var self = this;
      var p = [];

      return new Promise(function(resolve) {
        urls.forEach(function(url) {
          console.log('Processing the rss feed ' + url);

          p.push(
            self.downloadRSS(url)
              .then(function(rss) {
                return self.indexRSS(rss);
              })
          );
        });

        Promise.all(p)
          .then(resolve);
      });
    },

    downloadRSS: function(url) {
      return new Promise(function(resolve) {
        console.log('Downloading the rss file ' + url);

        request(url, function(error, response, body) {
          resolve(body);
        });
      });
    },

    indexRSS: function(xml) {
      var self = this;

      return new Promise(function(resolve) {
        console.log('Parsing the rss content to JSON ' + xml);

        var p = [];
        parseString(xml, function (err, result) {
          var language = result.rss.channel[0].language[0];

          result.rss.channel[0].item.forEach(function(item) {
            console.log('Downloading the content of article ', item.link[0]);

            p.push(
              self.downloadArticle(item.link[0])
                .then(function(text) {
                  return self.indexDocument({
                    language: language,
                    title: item.title[0],
                    group: item.category[0],
                    reference: crypto.createHash('md5').update(item.guid[0]).digest('hex'),
                    url: item.link[0],
                    contents: text.trim(),
                    createdAt: item.pubDate[0],
                    createdBy: 'EM.com.br'
                  });
                })
            );
          });

          Promise.all(p)
            .then(resolve)
            .catch(reject);
        });
      });
    },

    downloadArticle: function(url) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          request({
            uri: url,
            encoding: null
          }, function(error, response, body) {
            if (error) {
              console.log('Error downloading the article ' + error);
            } else {
              console.log('Parsing the article content', body);
              var $ = cheerio.load(iconv.decode(body, 'iso-8859-1'));
              resolve($('.article-box').text());
            }
          });
        }, 5000);
      });
    },

    indexDocument: function(document) {
      return new Promise(function(resolve) {
        console.log('Indexing the document ', document);

        request({
          uri: balthazarUrl + '/documents/EM/' + document.group,
          method: 'POST',
          json: document
        }, function(error, response, body) {
          resolve(body);
        });
      });
    }
  };
};
