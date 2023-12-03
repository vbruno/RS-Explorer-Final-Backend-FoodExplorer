const dayjs = require('dayjs');

const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class OrdersController {
  async create(req, res) {
    return res.json({ msg: 'OrdersController - Create' });
  }

  async search(req, res) {
    return res.json({ msg: 'OrdersController - Search' });
  }

  async show(req, res) {
    return res.json({ msg: 'OrdersController - Show' });
  }

  async delete(req, res) {
    return res.json({ msg: 'OrdersController - Delete' });
  }

  async update(req, res) {
    return res.json({ msg: 'OrdersController - Update' });
  }
}

module.exports = new OrdersController();
