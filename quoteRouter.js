const express = require('express');
const router = express.Router();

const { Quote } = require('./models');

//get all the quotes in the db
router.get('/', (req, res) => {
    Quote
        .find()
        .then(quotes => {
            res.json(quotes.map(quote => quote.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: '500 Server Error' });
        });
    });

//get a quote by a specific id
router.get('/:id', (req, res) => {
    Quote
        .findById(req.params.id)
        .then(quote => res.json(quote.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: '500 Server Error' });
        });
    });

//add a new quote to the db
router.post('/', (req, res) => {
    console.log(req);
    const requiredFields = ['quote'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                    console.error(message);
                return res.status(400).send(message);
            }
        }

Quote
    .create({
        quote: req.body.quote
    })
    .then(quote => res.status(201).json(quote.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    });
});

//update a specific quote in the db by id
router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
        error: 'Request path id and request body id values must match'
    });
}

    const updated = {};
    const updateableFields = ['quote'];
        updateableFields.forEach(field => {
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        });

Quote
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

//delete a quote by id
router.delete('/:id', (req, res) => {
    Quote
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted quote with id \`${req.params.id}\``);
            res.status(204).end();
        });
    });

module.exports = router;