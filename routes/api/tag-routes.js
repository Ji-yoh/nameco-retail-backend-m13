const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// adding async to routes

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }]
    })
    res.status(200).json(tagData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [Product]
    })
    if (!tagData) {
      res.status(404).json('Tag does not exist')
    }
    res.status(200).json(tagData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpted Error')
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body)
    res.status(200).json(newTag)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id }
    })
    if (!tagData) {
      res.status(404).json('Tag does not exist')
    }
    res.status(200).json(tagData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({ where: { id: req.params.id } })
    if (!deleteTag) {
      res.status(404).json('Tag does not exist')
    }
    res.status(200).json(deleteTag)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

module.exports = router;
