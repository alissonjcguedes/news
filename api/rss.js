const Parser = require('rss-parser');
const parser = new Parser();

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL('https://g1.globo.com/rss/g1/');
    const noticias = feed.items.slice(0, 3).map(noticia => ({
      title: noticia.title,
      description: noticia.contentSnippet,
      image: extractImage(noticia.content || ''),
    }));
    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter notícias' });
  }
};

function extractImage(html) {
  const match = html.match(/<img.*?src="(.*?)"/);
  return match ? match[1] : 'https://via.placeholder.com/800x600';
};
