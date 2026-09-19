import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import categoriesRoutes from './routes/categories.routes';
import promotionsRoutes from './routes/promotions.routes';
import ordersRoutes from './routes/orders.routes';
import galleryRoutes from './routes/gallery.routes';
import ratingsRoutes from './routes/ratings.routes';
import settingsRoutes from './routes/settings.routes';
import usersRoutes from './routes/users.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/promotions', promotionsRoutes);
app.use('/orders', ordersRoutes);
app.use('/gallery', galleryRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/settings', settingsRoutes);
app.use('/users', usersRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
