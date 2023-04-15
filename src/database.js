import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(databasePath.pathname, JSON.stringify(this.#database))
  }

  select(table, id) {
    if(this.#database[table] && id) {
      const task = this.#database[table].find(task => task.id === id)

      return task 
    }

    let data = this.#database[table] ?? []

    return data
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = []
      this.#database[table].push(data)
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const {title, description, completed_at} = data
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    const task = this.#database[table][rowIndex]

    if(completed_at === null) {
      this.#database[table][rowIndex] = {
        ...task,
        completed_at
      }

      this.#persist()
      return data
    }

    if(rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...task,
        title: title ? title : task.title,
        description: description ? description : task.description,
        completed_at
      }

      this.#persist()
      return data
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex > -1) {
      this.#database[table].splice([rowIndex], 1)
      this.#persist()
    }
  }
}