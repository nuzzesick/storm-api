const WebTorrent = require('webtorrent-hybrid');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('App running');
});

app.get('/torrent', (req, res) => {
  const client = new WebTorrent();
  const magnetURI = 'https://yts.mx/torrent/download/BB43CF1DC5B200BA37679DB96375A8190D933C2E';
  client.add(magnetURI, { path: 'torrents' }, (torrent) => {
    torrent.on('done', () => {
      console.log('torrent download finished');
    });
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});