const router = require("express").Router();

const { Category, Product } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const categorys = await Category.findAll({ include: Product });
    return res.json(categorys);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: Product,
    });
    if (!category) {
      return res.status(404).json({ message: "No Catagory with this id!" });
    }
    return res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  let category_name = req.body.category_name;
  try {
    let newCatagory = await Category.create({ category_name: category_name });
    res.status(200).json(newCatagory);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  let category_name = req.body.category_name;
  const category = await Category.findByPk(req.params.id);
  try {
    if (!category) {
      return res.status(404).json({ message: "No Catagory with this id to update!" });
    } else {
      await Category.update(
        { category_name: category_name },
        { where: { id: req.params.id } }
      );
      return res.status(200).json({message:"catagory Updated"})
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {

  const category = await Category.findByPk(req.params.id);
  try {
    if (!category) {
      return res.status(404).json({ message: "No Catagory with this id to delete!" });
    } else {
      await Category.destroy(
        
        { where: { id: req.params.id } }
      );
      return res.status(200).json({message:"Catagory Deleted"})
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
