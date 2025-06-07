const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  try {
    const feed = await parser.parseURL('https://g1.globo.com/rss/ultimas/');
    const noticias = feed.items
      .filter(noticia => {
        const title = noticia.title || '';
        const normalized = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return /triangulo mineiro|uberlandia|araguari|ituiutaba|patrocinio/.test(normalized);
      })
      .slice(0, 5)
      .map(noticia => ({
        title: noticia.title,
        image: extractImage(noticia['content:encoded'] || noticia.content || ''),
      }));
    res.status(200).json(noticias);
  } catch (error) {
    console.error('Erro ao buscar RSS:', error);
    res.status(500).json({ error: 'Falha ao obter notícias' });
  }
};

function extractImage(html) {
  try {
    const match = html.match(/<img.*?src=["'](.*?)["']/);
    return match ? match[1] : 'https://via.placeholder.com/1080x1080';
  } catch {
    return 'https://via.placeholder.com/1080x1080';
  }
}
