const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const Request = require('../models/Request');

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Получение всех заявок пользователя
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заявок
 */


// Create request
router.post('/', verifyToken, async (req, res) => {
  try {
    const newRequest = new Request({ ...req.body, userId: req.user._id });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get all requests
router.get('/', verifyToken, async (req, res) => {
  const requests = await Request.find({ userId: req.user._id });
  res.json(requests);
});

// Update request
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Request.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete request
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Request.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
