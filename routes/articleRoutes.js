let express = require('express');
const {
  getArticles,
  postArticles,
  articleOptions,
  articleOptionsId,
  getArticleId,
  deleteArticle,
  putArticle,
} = require('../controllers/articleController');

let articleRouter = express.Router();

articleRouter.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-type, Accept');
  next();
});

articleRouter.use(function (req, res, next) {
  if (req.headers.accept == 'application/json') {
    next();
  } else {
    //Geen next
    //Stuur foutmelding
    res.status(400).send();
  }
});

articleRouter.get('/articles', getArticles);
articleRouter.post('/articles', postArticles);
articleRouter.options('/articles', articleOptions);
articleRouter.options('/articles/:articleId', articleOptionsId);
articleRouter.get('/articles/:articleId', getArticleId);
articleRouter.delete('/articles/:articleId', deleteArticle);
articleRouter.put('/articles/:articleId', putArticle);

module.exports = articleRouter;
