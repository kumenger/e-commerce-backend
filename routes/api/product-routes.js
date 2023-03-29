const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  // find all products

  try {
    const productes = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_name"],
        },
      ],
    });
    return res.json(productes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_name"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "No product with this id!" });
    }
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        console.log(productTagIdArr);
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  const productag = await ProductTag.findOne({
    where: { product_id: req.params.id },
  });
  const tagid = await Tag.findByPk(productag.tag_id);
  try {
    if (!product) {
      return res
        .status(404)
        .json({ message: "No product with this id to delete!" });
    } else {
      await Product.destroy({ where: { id: req.params.id } }).then(async () => {
        console.log(productag.product_id);
        console.log(tagid.tag_name);
        //const tagid=await Tag.findByPk(productag.tag_id)
        if (!productag) {
          return res
            .status(404)
            .json({ message: "no product id found in product tag" });
        } else {
          await ProductTag.destroy({
            where: { product_id: productag.product_id },
          }).then(async () => {
            if (!tagid) {
              return res
                .status(404)
                .json({ message: "no tag id found in  tag" });
            } else {
              await Tag.destroy({ where: { tag_name: tagid.tag_name } });
              return res
                .status(200)
                .json({ message: "Product Deleted with tags and produc tags" });
            }
          });
          
        }
      });
      return res.status(200).json({ message: "Product Deleted" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
