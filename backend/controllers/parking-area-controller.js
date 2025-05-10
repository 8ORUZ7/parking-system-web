const ParkingArea = require('../models/parking-area-model');
const { calculateDistance } = require('../utils');

const getAllParkingAreas = async (req, res) => {
  try {
    let parkingAreas = await ParkingArea.find();
    //filter nearby places if radius, lat and lng are provided
    const { radius, lat, lng } = req.query;
    if (radius && lat && lng) {
      const filteredParkingAreas = parkingAreas.filter((parkingArea) => {
        const distance = calculateDistance(lat, lng, parkingArea.lat, parkingArea.lng);
        return distance <= radius;
      });
      parkingAreas = filteredParkingAreas;
    }
    res.json(parkingAreas);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

const createParkingArea = async (req, res) => {
  try {
    if (!req.body.name || !req.body.address || !req.body.lat || !req.body.lng || !req.body.capacity || !req.body.pricePerHour) {
      return res.status(400).json({ error: 'Missing required fields: name, address, lat, lng, capacity, pricePerHour' });
    }
    const parkingArea = new ParkingArea(req.body);
    await parkingArea.save();
    res.json({ message: 'Parking area created successfully', parkingArea });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

const updateParkingArea = async (req, res) => {
  try {
    const { id } = req.params;
    const parkingArea = req.body;
    const options = { new: true };
    const result = await ParkingArea.findByIdAndUpdate(id, parkingArea, options);
    res.json({ message: 'Parking area updated successfully', parkingArea: result });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteParkingArea = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ParkingArea.findByIdAndDelete(id);
    res.json({ message: 'Parking area deleted successfully', parkingArea: result });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllParkingAreas,
  createParkingArea,
  updateParkingArea,
  deleteParkingArea
};
