const express = require('express');
const app = express();

const data = require('./data');

app.get('/article/:id', (req, res) => {
  res.send(
    JSON.stringify(
      data.find(article => article.id === parseInt(req.params.id))
    )
  );
});

app.get('/api/autocomplete', (req, res) => {
  const search = req.query.search;

  if (!req.query.search) {
    res.send(JSON.stringify([]));
    return;
  }

  const workReg = new RegExp("([A-Za-z0-9]*" + search + "[A-Za-z0-9]*( [A-Za-z0-9]+)?)", 'g');
  let result = [];
  let items = data.filter(item => {
    return item.title.indexOf(search) !== -1 || item.data.indexOf(search) !== -1;
  })

  items.forEach((item) => {
    const titleMatch = item.title.match(workReg),
          dataMatch = item.data.match(workReg);
    if (Array.isArray(titleMatch)) {
      titleMatch.forEach((match) => {
        if (!result.find(resItem => resItem.data === match)) {
          result.push({
            id: item.id,
            data: match
          });
        }
      });
    }
    if (Array.isArray(dataMatch)) {
      dataMatch.forEach((match) => {
        if (!result.find(resItem => resItem.data === match)) {
          result.push({
            id: item.id,
            data: match
          });
        }
      });
    }
  });

  // Send first 10 results
  res.send(JSON.stringify(result.slice(0, 10)));
});

app.use(express.static('dist'));
app.listen(3001)
