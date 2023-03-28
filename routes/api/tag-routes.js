const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');
const { sync } = require('../../models/Product');

// The `/api/tags` endpoint

router.get('/',async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: Product });
    return res.json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: Product,
    });
    if (!tag) {
      return res.status(404).json({ message: "No tag with this id!" });
    }
    return res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  let   tag_name = req.body.  tag_name;
  try {
    let newTag = await Tag.create({ tag_name: tag_name });
    res.status(200).json(newTag);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id',async (req, res) => {
   let tag_name = req.body.tag_name;
  const tag = await Tag.findByPk(req.params.id);
  try {
    if (!tag) {
      return res.status(404).json({ message: "No tag with this id to update!" });
    } else {
      await Tag.update(
        { tag_name: tag_name },
        { where: { id: req.params.id } }
      );
      return res.status(200).json({message:"tag Updated"})
    }
  } catch (error) {
    res.status(500).json(error);
  } 
 
   
});

router.delete('/:id',async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  try {
    if (!tag) {
      return res.status(404).json({ message: "No tag with this id to delete!" });
    } else {
      await Tag.destroy(
        
        { where: { id: req.params.id } }
      );
      return res.status(200).json({message:"Tag Deleted"})
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
