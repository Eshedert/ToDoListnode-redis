const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect().catch(err => {
    console.error('Error connecting to Redis', err);
  });
  

// Página principal con la lista ToDo
app.get('/', (req, res) => {
    let todos, completed;
    redisClient.lRange('todos', 0, -1)
      .then(result => {
        todos = result;
        return redisClient.lRange('completed', 0, -1);  // Obtener tareas completadas
      })
      .then(result => {
        completed = result;
        res.render('index', { todos, completed });  // Renderizar ambas listas
      })
      .catch(err => {
        console.error("Error conectando a Redis", err);
        res.status(500).send("Error connecting to Redis");
      });
  });

// Agregar una nueva tarea
app.post('/add', (req, res) => {
  const task = req.body.task;
  redisClient.rPush('todos', task)
    .then(() => res.redirect('/'))
    .catch(err => res.status(500).send("Error saving task"));
});

// Eliminar una tarea
app.post('/delete', (req, res) => {
  const task = req.body.task;
  redisClient.lRem('todos', 1, task)
    .then(() => res.redirect('/'))
    .catch(err => res.status(500).send("Error deleting task"));
});

// Marcar una tarea como completada (la moveremos a una lista de "completadas")
app.post('/complete', (req, res) => {
  const task = req.body.task;
  redisClient.lRem('todos', 1, task)
    .then(() => redisClient.rPush('completed', task))
    .then(() => res.redirect('/'))
    .catch(err => res.status(500).send("Error completing task"));
});

const PORT = process.env.APP_PORT || 3000;
app.set('view engine', 'ejs');
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});