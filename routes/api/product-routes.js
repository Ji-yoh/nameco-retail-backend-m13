const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [Category, Tag]
    })
    res.status(200).json(productData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include:[Category, Tag]
    })
    if (!productData) {
      res.status(404).json('Product does not exist')
    }
    res.status(200).json(productData)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
 try {
    const productData = await Product.create(req.body)
    
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
       return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(productData);
 } catch(err) {
      console.log(err);
      res.status(400).json(err);
 }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // update product data
    const productData = Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
    // if statement to find all associated tags from ProductTag
    if (req.body.tagIds && req.body.tagIds.length) {
      // find all associated tags from ProductTag
      const productTags = ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          }
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

      // run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }
    res.status(200).json(productData)
  } catch(err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteProduct = await Product.destroy({ where: { id: req.params.id } })
    if (!deleteProduct) {
      res.status(404).json('Product does not exist')
    }
    res.status(200).json(deleteProduct)
  } catch(err) {
    console.error(err)
    res.status(500).json('Unexpected Error')
  }
});

module.exports = router;
