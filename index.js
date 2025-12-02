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

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));