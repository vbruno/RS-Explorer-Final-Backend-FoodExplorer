const { Router } = require('express');

const { usersRouter } = require('./users.routes');
const { sessionsRoutes } = require('./sessions.routes');
const { foodsRoutes } = require('./foods.routes');
const { ordersRoutes } = require('./orders.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRoutes);
routes.use('/foods', foodsRoutes);
routes.use('/orders', ordersRoutes);

module.exports = { routes };
