const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sequelize setup
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/ims');

const StockItem = sequelize.define('stock_items', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: Sequelize.STRING },
  quantity: { type: Sequelize.INTEGER },
}, { timestamps: false });

sequelize.sync();

app.get('/', (req, res) => {
  res.send('Inventory API is running');
});

// Get all stock items
app.get('/stock-items', async (req, res) => {
  const items = await StockItem.findAll();
  res.json(items);
});

// Get a stock item by ID
app.get('/stock-items/:id', async (req, res) => {
  const item = await StockItem.findByPk(req.params.id);
  res.json(item);
});

// Add a new stock item
app.post('/stock-items', async (req, res) => {
  const newItem = await StockItem.create(req.body);
  res.json(newItem);
});

// Update a stock item
app.put('/stock-items/:id', async (req, res) => {
  const update = await StockItem.update(req.body, {
    where: { id: req.params.id }
  });
  res.json(update);
});

// Delete a stock item
app.delete('/stock-items/:id', async (req, res) => {
  const deleteItem = await StockItem.destroy({
    where: { id: req.params.id }
  });
  res.json(deleteItem);
});

// Get all stock items with a quantity less than 10

app.get('/stock-items/low-stock', async (req, res) => {
  const items = await StockItem.findAll({
    where: {
      quantity: {
        [Sequelize.Op.lt]: 10
      }
       }}
   );
   
  res.json(items);
});
 


// Search for a stock item by ID or name
app.get('/stock-items/search/:query', async (req, res) => {
  const items = await StockItem.findAll({
    where: {
      [Sequelize.Op.or]: [
        { id: req.params.query },
        { name: req.params.query }
      ]
    }
  });
  res.json(items);
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
