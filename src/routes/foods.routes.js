const { Router } = require('express');

const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const foodsController = require('../controllers/FoodsController');

const foodsRoutes = Router();

foodsRoutes.get('/', (req, res) => {
  res.json({ msg: 'Rota: foods' });
});

foodsRoutes.use(ensureAuthenticated);

foodsRoutes.post('/register', foodsController.create);
foodsRoutes.get('/search', foodsController.search);
foodsRoutes.get('/:id', foodsController.show);
foodsRoutes.delete('/:id', foodsController.delete);
foodsRoutes.put('/update', foodsController.update);

module.exports = { foodsRoutes };
