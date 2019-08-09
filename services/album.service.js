const Album = require('../models/album.model')
const Spotify = require('node-spotify-api')

const spotify = new Spotify({
  id: process.env.NODE_SPOTIFY_API_KEY,
  secret: process.env.NODE_SPOTIFY_API_SECRET
})

module.exports = {
  async addAlbum(req, res, next) {
    spotify.search({ type: 'album', query: req.body.title }, async function (err, data) {
      if (err) {
        return console.log('error occured:', err)
      }
      let album = data.albums.items[0]
      album = {
        title: album.name,
        artists: [],
        spotifyID: album.id,
        image: album.images[0].url,
        release_date: album.release_date,
        tracks: album.total_tracks
      }
      data.albums.items[0].artists.forEach(artist => {
        album.artists.push(artist.name)
      })
      let music = await Album.findOne({ spotifyID: album.spotifyID })
      if (music) {
        req.body.item_id = music._id
        req.body.media_type = "albums"
        next()
      }
      else {
        const newAlbum = new Album(album)
        try {
          newAlbum.save(err => {
            if (err) {
              return res.status(500).send(err)
            }
            req.body.item_id = newAlbum._id
            req.body.media_type = "albums"
            next()
          })
        } catch (e) {
          res.status(400).send(e)
        }
      }
    })
  },
  async generateDatalist(req, res) {
    try {
      spotify.search({ type: 'album', query: req.body.title }, function (err, data) {
        if (err) {
          return console.log('error occured:', err)
        }
        let albums = data.albums.items;
        albums = albums.filter((album, i) => i <= 4);
        albums = albums.map(album => album.name)
        res.send(albums)
      })
    } catch (e) {
      res.status(400).send(e)
    }
  }
}