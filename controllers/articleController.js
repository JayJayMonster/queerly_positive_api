let Article = require('../models/articleModel');

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    let start;
    let limit;

    if (req.query.start && req.query.limit) {
      start = parseInt(req.query.start);
      limit = parseInt(req.query.limit);
      console.log('Querystrings were given');
    } else {
      start = 1;
      limit = articles.length;
      console.log('No querystrings were given');
    }

    let totalItems = articles.length;
    let totalPages = Math.ceil(articles.length / limit);

    let firstPage;
    let lastPage;
    let prevPage;
    let nextPage;

    let currentItems;
    let currentPage;

    // When there is only one page
    if (totalPages == 1) {
      firstPage = lastPage = prevPage = nextPage = currentPage = 1;
      currentItems = articles.length;
    } else {
      currentPage = Math.ceil(start / limit);

      // currentItems
      if (currentPage == totalPages) {
        currentItems = totalItems - (totalPages - 1) * limit;
      } else {
        currentItems = limit;
      }

      firstPage = 1;
      lastPage = (totalPages - 1) * limit + 1;

      // prevPage
      if (currentPage == 1) {
        prevPage = 1;
      } else {
        prevPage = start - limit;
      }

      // nextPage
      if (currentPage == totalPages) {
        nextPage = start;
      } else {
        nextPage = start + limit;
      }
    }

    let articlesCollection = {
      items: [],
      _links: {
        self: { href: `http://${req.headers.host}/api/articles` },
      },
      pagination: {
        currentPage: currentPage,
        currentItems: currentItems,
        totalPages: totalPages,
        totalItems: totalItems,
        _links: {
          first: {
            page: 1,
            href: `http://${req.headers.host}/api/articles?start=${firstPage}&limit=${limit}`,
          },
          last: {
            page: 1,
            href: `http://${req.headers.host}/api/articles?start=${lastPage}&limit=${limit}`,
          },
          previous: {
            page: 1,
            href: `http://${req.headers.host}/api/articles?start=${prevPage}&limit=${limit}`,
          },
          next: {
            page: 1,
            href: `http://${req.headers.host}/api/articles?start=${nextPage}&limit=${limit}`,
          },
        },
      },
    };

    let articlesOnPage = [];
    if (totalPages == 1) {
      articlesOnPage = articles;
    } else {
      let startSlice = start - 1;
      let endSlice = start + limit - 1;
      articlesOnPage = articles.slice(startSlice, endSlice);
      console.log('This one should be excecuted');
    }

    for (let article of articlesOnPage) {
      //Translate to Json so we can edit it
      let articleItem = article.toJSON();

      //Make a new array called _links in articleItem
      (articleItem._links = {
        self: {
          href: `http://${req.headers.host}/api/articles/${articleItem._id}`,
        },
        collection: { href: `http://${req.headers.host}/api/articles` },
      }),
        // Add articleItem to the collection
        articlesCollection.items.push(articleItem);
    }

    // Return the collection as Json
    res.json(articlesCollection);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const postArticles = async (req, res) => {
  let article = new Article({
    coordinates: req.body.coordinates,
    title: req.body.title,
    description: req.body.description,
    year: req.body.year,
    color: req.body.color,
    tag: req.body.tag,
    link: req.body.link,
  });

  try {
    const newArticle = await article.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const articleOptions = (req, res) => {
  res
    .status(200)
    .header('Allow', 'GET,POST,OPTIONS')
    .header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    .send();
};

const articleOptionsId = (req, res) => {
  res
    .status(200)
    .header('Allow', 'GET,OPTIONS,DELETE,PUT')
    .header('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE,PUT')
    .header('Content-Type', 'application/json')
    .send();
};

const getArticleId = async (req, res) => {
  try {
    let article = await Article.findById(req.params.articleId);
    let articleJson = article.toJSON();

    articleJson._links = {
      self: {
        href: `http://${req.headers.host}/api/articles/${req.params.articleId}`,
      },
      collection: { href: `http://${req.headers.host}/api/articles` },
    };

    res
      .status(200)
      .header('Content-Type', 'application/json')
      .json(articleJson);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ message: 'article not found' });
    }
    await Article.deleteOne({ _id: req.params.articleId });
    res.status(204).json({ message: 'article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const putArticle = async (req, res, next) => {
  //await findArticle(req, res, next)
  let article = await Article.findById(req.params.articleId);
  res.article = article;

  if (req.body.coordinates != null) {
    res.article.coordinates = req.body.coordinates;
  }
  if (req.body.title != null) {
    res.article.title = req.body.title;
  }
  if (req.body.description != null) {
    res.article.description = req.body.description;
  }
  if (req.body.year != null) {
    res.article.year = req.body.year;
  }
  if (req.body.color != null) {
    res.article.color = req.body.color;
  }
  if (req.body.tag != null) {
    res.article.tag = req.body.tag;
  }
  if (req.body.link != null) {
    res.article.link = req.body.link;
  }
  try {
    const updatedArticle = await res.article.save();
    res.status(202).json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getArticles,
  postArticles,
  articleOptions,
  articleOptionsId,
  getArticleId,
  deleteArticle,
  putArticle,
};
