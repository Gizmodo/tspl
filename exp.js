const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/Tech/hs/tsd/shops/get', (req, res) => {
    res.send('Hello shops!')
});
app.get('/Tech/hs/tsd/printers/get', (req, res) => {
    res.contentType("application/json")
    res.json({
        "printers": [
            {
                "ip": "192.168.88.17",
                "sn": "323WG20821002",
                "model": "XP-P323B"
            },
            {
                "ip": "192.168.88.25",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
        ]
    })
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})