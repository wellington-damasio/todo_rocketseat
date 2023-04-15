import {randomUUID} from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')
      
      return res.end(JSON.stringify(tasks)) 
    }
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {title, description} = req.body
      const newTask = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', newTask)
      
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params

      const {title, descripion} = req.body
      
      database.update('tasks', id, {title, descripion})

      return res.writeHead(200).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params

      database.delete('tasks', id)

      return res.writeHead(200).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {id} = req.params
      const task = database.select('tasks', id)

      if(task.completed_at) {
        database.update('tasks', id, {completed_at: null})    
      } else {
        database.update('tasks', id, {completed_at: new Date()})
      }

      return res.writeHead(200).end()
    }
  }
]