import { Router } from 'express';
import { addTodo, deleteTodo, getTodos, completeTodo } from '../controllers/todoController';

const router = Router();

// Ruta para obtener todas las tareas
router.get('/', getTodos);

// Ruta para agregar una tarea
router.post('/', addTodo);

// Ruta para eliminar una tarea
router.delete('/:id', deleteTodo);

// Ruta para marcar una tarea como completada
router.put('/:id/complete', completeTodo);

export default router;
