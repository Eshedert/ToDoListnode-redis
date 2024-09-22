const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect().catch(console.error);

// Página principal con la lista ToDo
app.get('/', (req, res) => {
  redisClient.lRange('todos', 0, -1)
    .then(todos => res.send(`
      <h1>ToDo List</h1>
      <form method="POST" action="/add">
        <input type="text" name="task" placeholder="New task" required/>
        <button type="submit">Add</button>
      </form>
      <ul>
        ${todos.map(todo => `<li>${todo}</li>`).join('')}
      </ul>
    `))
    .catch(err => res.status(500).send("Error connecting to Redis"));
});

// Agregar una nueva tarea
app.post('/add', (req, res) => {
  const task = req.body.task;
  redisClient.rPush('todos', task)
    .then(() => res.redirect('/'))
    .catch(err => res.status(500).send("Error saving task"));
});

// Eliminar todas las tareas (opcional)
app.post('/clear', (req, res) => {
  redisClient.del('todos')
    .then(() => res.redirect('/'))
    .catch(err => res.status(500).send("Error clearing tasks"));
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Ruta para obtener las tareas almacenadas (para depuración)
app.get('/debug-tasks', (req, res) => {
    redisClient.lRange('todos', 0, -1)
      .then(todos => res.json(todos))
      .catch(err => res.status(500).send("Error fetching tasks from Redis"));
  });  