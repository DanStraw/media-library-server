const Game = require('../models/game.model')

const axios = require('axios')

const searchIGDBbyId = function (id, endpoint, path) {
  return axios({
    url: `https://api-v3.igdb.com/${endpoint}`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'user-key': process.env.IGDB_API_KEY
    },
    data: `fields *; where id = ${id};`,
  })
    .then(response => {
      return response.data[0][path]
    })
    .catch(err => {
      console.error(err);
    });
}

async function getArrayItems(ids, endpoint, path) {
  const id_array = ids.map(async id => {
    const response = await searchIGDBbyId(id, endpoint, path)
    return response
  })
  const array_items = await Promise.all(id_array);
  return array_items;
}

module.exports = {
  async addGame(req, res, next) {
    const gameTitle = req.body.title
    try {
      axios({
        url: `https://api-v3.igdb.com/games`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'user-key': process.env.IGDB_API_KEY
        },
        data: `search "${gameTitle}"; fields name,cover,genres,first_release_date,franchise,platforms,rating,summary;`,
      })
        .then(async (res) => {
          let gameInfo = res.data[0]
          gameInfo = {
            title: gameInfo.name,
            igdb_id: gameInfo.id,
            image: await searchIGDBbyId(gameInfo.cover, 'covers', 'url'),
            genres: await getArrayItems(gameInfo.genres, 'genres', 'name'),
            release_date: gameInfo.first_release_date,
            rating: gameInfo.rating,
            summary: gameInfo.summary,
            franchise: await searchIGDBbyId(gameInfo.franchise, 'franchises', 'name'),
            platforms: await getArrayItems(gameInfo.platforms, 'platforms', 'name')
          }
          let game = await Game.findOne({ igdb_id: gameInfo.igdb_id })
          if (game) {
            req.body.item_id = game._id;
            req.body.media_type = "games"
            next()
          } else {
            const newGame = new Game(gameInfo);
            try {
              newGame.save(err => {
                if (err) {
                  return res.status(500).send(err)
                }
                req.body.item_id = newGame._id;
                req.body.media_type = "games"
                next()
              })
            } catch (e) {
              res.status(400).send(e)
            }
          }
        })
    } catch (e) {
      return res.status(400).send(e)
    }
  },
  async generateDatalist(req, res) {
    const gameTitle = req.body.title
    let games = []
    try {
      await axios({
        url: `https://api-v3.igdb.com/games`,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'user-key': process.env.IGDB_API_KEY
        },
        data: `search "${gameTitle}"; fields name,cover,genres,first_release_date,franchise,platforms,rating,summary;`,
      })
        .then(res => {
          let items = res.data
          items = items.filter((item, i) => i <= 4)
          items.forEach(item => games.push(item.name));
        })
      res.send(games)
    }
    catch (e) {
      res.status(400).send(e)
    }
  }
}