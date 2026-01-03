const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// @route   POST api/trips
// @desc    Save a trip
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { preferences, itinerary } = req.body;
    const newTrip = new Trip({
      userId: req.user.id,
      preferences,
      itinerary,
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trips
// @desc    Get all user trips
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check user
    if (trip.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await trip.deleteOne();

    res.json({ message: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
