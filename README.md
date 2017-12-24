# balthazar-crawler

This a crawler used for test [Balthazar](https://github.com/gleissonassis/balthazar). Use it as an example how to connect to Balthazar and send content.

## How to install

```
git clone https://github.com/gleissonassis/balthazar-crawler.git
cd balthazar-crawler
npm install
npm start
```

## How to configure

Balthazar's service must be active and running before you run npm start. By default this crawler will try to find Balthazar at http://localhost:5000, but you can change it by editing the configuration file:

```
cd src/config
atom settings.js
```

Change the base url where is located Balthazar:

```javascript
module.exports = {
  balthazarUrl: 'http://localhost:5000/v1'
};
```

## Crawlers

Follow the list of implemented crawlers.

### Em.com.br

The crawler get the rss content provided by EM.com.br (available at https://www.em.com.br/rss) and send to Balthazar.

We are indexing these content's categories:

* Agropecuário - http://www.em.com.br/rss/noticia/agropecuario/rss.xml
* Economia - http://www.em.com.br/rss/noticia/economia/rss.xml
* Gerais - http://www.em.com.br/rss/noticia/gerais/rss.xml
* Internacional - http://www.em.com.br/rss/noticia/internacional/rss.xml
* Nacional - http://www.em.com.br/rss/noticia/nacional/rss.xml
* Politica - http://www.em.com.br/rss/noticia/politica/rss.xml
* Tecnologia - http://www.em.com.br/rss/noticia/tecnologia/rss.xml

### Help

Feel free to make contact or contribute with the project.
