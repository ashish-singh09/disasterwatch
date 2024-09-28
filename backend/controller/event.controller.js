const Event = require("../Model/Event");
const connectDB = require('../DB/db');
const mongoose = require('mongoose');



// Create an event in the database.
module.exports.createEvent = async (req, res) => {

    try {
        let { type, location, severity, description, coordinates, affectedPopulation, timeline } = req.body;
        if (!type || !location || !severity || !description || !coordinates) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const coordinatesArray = coordinates.split(',').map(coord => parseFloat(coord.trim()));
        if (coordinatesArray.length !== 2) {
            return res.status(400).json({ message: "Please provide valid coordinates" });
        }

        const newEvent = new Event({
            ...req.body,
            coordinates: coordinatesArray
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.editEvent = async (req, res) => {
    try {

        let { type, location, severity, description, coordinates } = req.body;
        const id = req.params.id;
        if (!id || !type || !location || !severity || !description || !coordinates) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const coordinatesArray = typeof coordinates === 'string' ? coordinates.split(',').map(coord => parseFloat(coord.trim())) : coordinates;
        if (coordinatesArray.length !== 2) {
            return res.status(400).json({ message: "Please provide valid coordinates" });
        }

        const event = await Event.findByIdAndUpdate(id, {
            ...req.body,
            coordinates: coordinatesArray
        }, { new: true });
        res.status(200).json(event);

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error.message });
    }
}

module.exports.getEvents = async (req, res) => {

    try {

        await connectDB();

        const events = await Event.find();
        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getEvent = async (req, res) => {

    try {

        let id = req.params.id;
        id = new mongoose.Types.ObjectId(id);

        await connectDB();

        const event = await Event.findById(id);
        res.status(200).json(event);

    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error.message });
    }
}