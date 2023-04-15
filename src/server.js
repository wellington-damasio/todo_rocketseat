import http from 'node:http' // use node:package-name to import node modules
import json from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'


const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await json(req, res)
  
  const route = routes.find(route => route.method === method && route.path.test(url))

  if(route) {
    const routeParams = req.url.match(route.path)
    req.params = {...routeParams.groups}

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}
    
    route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)

// CommonsJS = require('package-name')
// ESModules (ES6) = import/export 

// Metodos HTTP

// GET => Buscar um recurso no Backend
// POST => Criar um recurso no Backend
// PUT => Atualizar um recurso no Backend
// PATCH => Atualizar uma informação específica de um recurso no Backend
// DELETE => Deletar um recurso no Backend