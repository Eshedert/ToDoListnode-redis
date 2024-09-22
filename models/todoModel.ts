import { createClient } from '@redis/client';
import { v4 as uuidv4 } from 'uuid';

const redisClient = createClient();

async function initializeRedis() {
    try {
        await redisClient.connect();
        console.log('Conexión exitosa a Redis');
        const pingResult = await redisClient.ping();
        console.log('Respuesta de PING a Redis:', pingResult); // Debería mostrar "PONG"
    } catch (error) {
        console.error('Error al conectar a Redis:', error);
    }
}

// Inicializamos Redis al iniciar el modelo
initializeRedis();

// Obtener la lista de tareas
export const getTodoList = async () => {
    try {
        const tasks = await redisClient.hGetAll('todos');
        return Object.keys(tasks).map(id => ({
            id,
            task: tasks[id],
            completed: tasks[id].includes('(completada)')
        }));
    } catch (error) {
        console.error('Error al obtener la lista de tareas:', error);
        throw error;
    }
};

// Agregar una tarea nueva
export const addTask = async (task: string) => {
    const id = uuidv4(); // Generar un UUID para la tarea
    try {
        await redisClient.hSet('todos', id, task);
        return { id, task };
    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        throw error;
    }
};

// Eliminar una tarea
export const removeTask = async (id: string) => {
    try {
        await redisClient.hDel('todos', id);
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        throw error;
    }
};

// Marcar una tarea como completada
export const markTaskAsCompleted = async (id: string) => {
    try {
        const task = await redisClient.hGet('todos', id);
        if (task) {
            await redisClient.hSet('todos', id, `${task} (completada)`);
        }
    } catch (error) {
        console.error('Error al marcar la tarea como completada:', error);
        throw error;
    }
};
