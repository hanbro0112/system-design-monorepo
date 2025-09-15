const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ingress-redirect prefix url = /simple-server
app.get('/simple-server', (req, res) => {
    res.status(200).send('ok');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Simple-Server is running on http://localhost:${PORT}`);
});