import { Request, Response } from 'express';
import { getTodoList, addTask, removeTask, markTaskAsCompleted } from '../models/todoModel';

// Obtener todas las tareas
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const todos = await getTodoList();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

// Agregar una tarea nueva
export const addTodo = async (req: Request, res: Response): Promise<void> => {
    const { task } = req.body;
    try {
        const newTask = await addTask(task);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar la tarea' });
    }
};

// Eliminar una tarea por su ID
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await removeTask(id);
        res.status(200).json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};

// Marcar una tarea como completada
export const completeTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await markTaskAsCompleted(id);
        res.status(200).json({ message: 'Tarea marcada como completada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al completar la tarea' });
    }
};
