//const Game = require('../models/game.model')
const igdb = require('igdb-api-node').default;
// const client = igdb(process.env.IGDB_API_KEY);
// const request = require('request')
const moment = require('moment')
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
      console.log(`searchIGRES ${endpoint}:`, response.data[0].name || response.data[0].url);
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
          const gameInfo = res.data[0]
          const newGame = {
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
        })
    } catch (e) {
      return res.status(400).send(e)
    }
  }
}