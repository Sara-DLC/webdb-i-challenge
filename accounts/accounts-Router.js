const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db
    .select('*')
    .from('accounts')
    .then(results => {
        res.status(200).json(results);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Error getting accounts" });
    });
});

router.get('/:id', (req, res) => {
    const query = 
    db
    .select('*')
    .from('accounts')
    .where({ id: req.params.id })
    .first()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Error getting the account"})
    });
});

router.post('/', (req, res) => {
    const data = req.body;
    db('accounts')
    .insert(data, 'id')
    .then(ids => {
        const id = ids[0];
        return db('accounts')
        .select('name', 'budget')
        .where({ id })
        .first()
        .then( post => {
            res.status(201).json(post);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: "Error adding the account" })
        });
    });
});


router.put('/:id',  (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('accounts')
    .where({ id })
    .update(changes)
    .then(count => {
        count > 0 ? res.status(200).json({ message: `${count} record(s) updated` })
        : res.status(404).json({ message: "Post not found" });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        errorMessage: "Error updating the post"
        });
    });
});

router.delete('/:id',  (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
    res.status(200).json({ message: `${count} record(s) removed` });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
        errorMessage: "Error removing the account"
        });
    });
});

//middleware (just for practice)

// function validateId (req, res, next) {
//     const id = req.params.id;
//     db.select(id)
//     .then(account => {
//         if (account) {
//             req.account = account
//             next()
//         } else {
//             res.status(400).json({
//                 message: "invalid account id"
//             });
//         };
//     })
//     .catch(error => {
//         res.status(500).json({ error: "Account does not exist", error
//         });
//     });
// };


// function validateAccount (req, res, next) {
//     if (Object.keys(req.body).length > 0) {
//         if (req.body.account && req.body.budget){
//             next();
//         } else {
//             res.status(400).json({ errorMessage: "Please provide an account name and a budget for the account."})
//         } 
//     } else {
//         res.status(400).json({ errorMessage: "There was an error while saving the account to the database" })
//     };
// };






module.exports =router