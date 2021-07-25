const express = require('express'),
    cors = require('cors'),
    rateLimit = require("express-rate-limit"),
    helmet = require("helmet"),
    logger = require('morgan'),
    path = require('path'),
    { sequelize } = require('./db/conexion');
require('dotenv').config();

// GLOBAL APP
const app = express();

// CONFIG
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 500,
    message: "Demasiadas peticiones con la misma IP, intenta de nuevo en 10 minutos."
});


// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(logger('dev'));

// ROUTES
const searchRoutes = require("./routes/search");
const categoryRoutes = require("./routes/category");
const productsRoutes = require("./routes/products");
const trendsRoutes = require("./routes/trends");
const userRoutes = require("./routes/users");

app.use('/search', searchRoutes); //Todas las rutas aqui tendran el prefijo /search
app.use('/category', categoryRoutes); //Todas las rutas aqui tendran el prefijo /category
app.use('/products', productsRoutes); //Todas las rutas aqui tendran el prefijo /products
app.use('/trends', trendsRoutes); //Todas las rutas aqui tendran el prefijo /trends
app.use('/user', userRoutes); //Todas las rutas aqui tendran el prefijo /user

/*
 Carpeta pública
 */
//--------------Public------------------\\
app.use(express.static(path.join(__dirname, 'public')));
//---------------------------------------\\

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexión iniciada.');
        const server = app.listen(process.env.PORT || 3001, async() => {
            console.log(`Servidor iniciado en http://localhost:${server.address().port}`);
        });
        const { firstUpdateCategoriesFromMercadoLibre } = require("./services/mercado.service");
        await firstUpdateCategoriesFromMercadoLibre();
    } catch (e) {
        console.log('No se pudo iniciar correctamente\n' + e.message);
    }
}

startServer();