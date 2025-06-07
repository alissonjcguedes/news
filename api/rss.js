const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  try {
    const feed = await parser.parseURL('https://g1.globo.com/rss/g1/');
    const noticias = feed.items
      .filter(noticia => /tri\u00e2ngulo mineiro|uber\u00e2ndia|araguari|ituiutaba|patroc\u00ednio/i.test(noticia.title))
      .slice(0, 5)
      .map(noticia => ({
        title: noticia.title,
        image: extractImage(noticia.content || ''),
      }));
    res.status(200).json(noticias);
  } catch (error) {
    console.error('Erro ao buscar RSS:', error.message);
    res.status(500).json({ error: 'Falha ao obter notícias' });
  }
};

function extractImage(html) {
  const match = html.match(/<img.*?src=\"(.*?)\"/);
  return match ? match[1] : 'https://via.placeholder.com/1080x1080';
}
