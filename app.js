//npm run dev

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.text({type: 'text/plain'}))




const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(express.json());


const connectDB = require('./config/db');

connectDB();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes 

const files = require('./routes/files');

const show = require('./routes/show');

const download = require('./routes/download');

app.get("/", (req, res) => {
    res.render('index');
})

app.use('/api/files', files);

app.use('/files', show);

app.use('/files/download', download);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
