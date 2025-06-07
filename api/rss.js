const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  try {
    const economiaFeed = await parser.parseURL('https://g1.globo.com/rss/g1/economia/');
    const esportesFeed = await parser.parseURL('https://g1.globo.com/rss/g1/esportes/');

    const combined = [...economiaFeed.items, ...esportesFeed.items]
      .slice(0, 5)
      .map(noticia => ({
        title: noticia.title,
        image: extractImage(noticia['content:encoded'] || noticia.content || ''),
      }));

    res.status(200).json(combined);
  } catch (error) {
    console.error('Erro ao buscar RSS:', error);
    res.status(500).json({ error: 'Falha ao obter notícias' });
  }
};

function extractImage(html) {
  const match = html.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : 'https://via.placeholder.com/1080x1080';
}
