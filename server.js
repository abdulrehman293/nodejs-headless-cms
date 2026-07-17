const express = require('express');
const { client } = require('./lib/contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const response = await client.getEntries({ content_type: 'pageBlogPost' });

    const posts = response.items.map((post) => ({
      title: post.fields.title,
      contentHtml: post.fields.content
        ? documentToHtmlString(post.fields.content)
        : null,
    }));

    res.render('index', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong fetching posts.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
