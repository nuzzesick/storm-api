const WebTorrent = require('webtorrent-hybrid');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 8080;

app.use(cors());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('App running');
});

app.use('/download', (req, res, next) => {
  const startTorrent = () => {
    return new Promise ((resolve) => {
      const client = new WebTorrent();
      const { hash } = req.query;
      client.add(hash, { path: 'public/torrents' }, (torrent) => {
        console.log('Download started...\n');
        console.log('You can watch the movie while is downloading!\n');
        client.on('torrent', () => {
          const file = torrent.files.find((f) => f.name.endsWith('.mp4'));
          const { name, path } = file;
          res.json({ name, path });
          resolve();
        })
      });
    });
  };
  startTorrent().then(() => { next(); })
});

app.get('download', (req, res) => {
  const client = new WebTorrent();
  client.seed('public/torrents', (torrent) => {
    console.log('Client is seeding ' + torrent.magnetURI);
    res.send('finish');
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});