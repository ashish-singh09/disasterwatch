const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
    affectedPopulation: {
        type: Number || String,
        default: "unknown",
    },
    timeline: {
        type: [{
            date: {
                type: String,
            },
            event: {
                type: String,
            },
        }],
        default: [],
    },
    resources: {
        type: [{
            type: String,
            allocated: {
                type: Number,
            },
            required: {
                type: Number,
            },
        }],
        default: [],
    },
}, { timestamps: true });

const Event = mongoose.model('User', eventSchema);
module.exports = Event;