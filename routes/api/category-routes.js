const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// made routes asynchronous 

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryId = Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    })
    if (!categoryId) {
      res.status(404).json('User does not exist')
    }
    res.status(200).json(categoryId)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = Category.create(req.body)
    res.status(200).json(newCategory)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = Category.update(req.body, {
      where: { id: req.params.id },
    })
    if (!categoryData) {
      res.status(404).json('User does not exist')
    }
    res.status(200).json(categoryData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = Category.destroy(req.body, {
      where: { id: req.params.id },
    })
    if (!categoryData) {
      res.status(404).json('User does not exist')
    }
    res.status(200).json(categoryData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

module.exports = router;
