const Event = require("../Model/Event");
const connectDB = require('../DB/db');



// Create an event in the database.
module.exports.createEvent = async (req, res) => {
    
    try {
        let { type, location, severity, description, coordinates, affectedPopulation, timeline } = req.body;
        if (!type || !location || !severity || !description || !coordinates) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const newEvent = new Event(req.body);

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}