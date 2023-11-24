const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080 || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const { convertRouter } = require('./routes/convertRoutes');

app.use(convertRouter)

app.listen(PORT, () => {
    try {
        console.log(`Server Started at ${PORT}`)
    } catch (error) {
        console.log('Error in Starting Server')
    }

})