import express from 'express';
import todoRoutes from './routes';

// Inicializar la aplicación Express
const app = express();
app.use(express.json());

// Utilizar las rutas
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
