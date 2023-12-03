const { Router } = require('express');

const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const ordersController = require('../controllers/OrdersController');

const ordersRoutes = Router();

ordersRoutes.get('/', (req, res) => {
  res.json({ msg: 'Rota: orders' });
});

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post('/register', ordersController.create);
// ordersRoutes.get('/search', ordersController.search);
// ordersRoutes.get('/:id', ordersController.show);
// ordersRoutes.delete('/:id', ordersController.delete);
// ordersRoutes.put('/update', ordersController.update);

module.exports = { ordersRoutes };
