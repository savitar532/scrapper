const express = require('express');
const path = require('path');
const scrape = require('./utils/scrape')
const app = express();
// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));

});

app.get('/productDetails',(req,res)=>{
    scrape((data)=>{
        res.send({data})
    })
})

// Start the server
app.listen(8000, () => {
    console.log(`Server is running on http://localhost:8000`);

});
