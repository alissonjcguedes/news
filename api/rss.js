const Parser = require('rss-parser');
const parser = new Parser();

module.exports = async (req, res) => {
  try {
    const economiaFeed = await parser.parseURL('https://g1.globo.com/rss/g1/economia/');
    await delay(500); // leve intervalo para não sobrecarregar
    const esportesFeed = await parser.parseURL('https://g1.globo.com/rss/g1/esportes/');

    const todas = [...economiaFeed.items, ...esportesFeed.items]
      .filter(noticia => noticia?.title)
      .slice(0, 5)
      .map(noticia => ({
        title: noticia.title,
        image: extractImage(noticia['content:encoded'] || noticia.content || ''),
      }));

    res.status(200).json(todas);
  } catch (error) {
    console.error('Erro ao buscar RSS:', error);
    res.status(500).json({ error: 'Falha ao obter notícias' });
  }
};

function extractImage(html) {
  if (!html) return 'https://via.placeholder.com/1080x1080';
  const match = html.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : 'https://via.placeholder.com/1080x1080';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
