const { Router } = require('express');
const router = Router();

const { createEvent, getEvents, editEvent, getEvent } = require('../controller/event.controller');


router.post('/create', createEvent);

router.get('/all', getEvents);

router.get('/get/:id', getEvent);

router.put('/update/:id', editEvent);

module.exports = router;