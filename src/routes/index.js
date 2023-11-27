const { Router } = require('express');
const { usersRouter } = require('./users.routes');
const { sessionsRoutes } = require('./sessions.routes');
const { foodsRoutes } = require('./foods.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRoutes);
routes.use('/foods', foodsRoutes);

module.exports = { routes };
