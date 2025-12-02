const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();


// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// * Homepage Route
app.get('/', async (req, res) => {
    const url = "https://api.hubapi.com/crm/v3/objects/2-221994451?properties=name,cc,color";

    try {
        const resp = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                "Content-Type": "application/json"
            }
        });

        res.render('homepage', {
            title: "Bikes Table",
            data: resp.data.results
        });

    } catch (err) {
        res.send("Error loading data");
    }
});


// -------- Add new (blank form) --------
app.get('/update-bike', (req, res) => {
    res.render('update-bike', {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
        bike: { id: null, properties: { name: "", cc: "", color: "" } }
    });
});

// -------- Load data for update --------
app.get('/update-bike/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const resp = await axios.get(
            `https://api.hubapi.com/crm/v3/objects/2-221994451/${id}?properties=name,cc,color`,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.render('update-bike', {
            title: "Update Bike",
            bike: resp.data
        });

    } catch (err) {
        res.send("Error loading bike");
    }
});

// -------- Create New Bike(OBJ) --------
app.post('/update-bike', async (req, res) => {
    const body = {
        properties: {
            name: req.body.name,
            cc: req.body.cc,
            color: req.body.color,
        }
    };

    try {
        await axios.post(
            "https://api.hubapi.com/crm/v3/objects/2-221994451",
            body,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.redirect('/');
    } catch (err) {
        res.send("Error adding bike");
    }
});

// -------- Update Existing Bike --------
app.post('/update-bike/:id', async (req, res) => {
    const id = req.params.id;

    const body = {
        properties: {
            name: req.body.name,
            cc: req.body.cc,
            color: req.body.color,
        }
    };

    try {
        await axios.patch(
            `https://api.hubapi.com/crm/v3/objects/2-221994451/${id}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.redirect('/');
    } catch (err) {
        res.send("Error updating bike");
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));