const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  preferences: {
    type: Object,
    required: true,
  },
  itinerary: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Trip', TripSchema);
