const express = require('express');
const connection = require('./db-config.js');

function intToIPv4(ipInt) {
    return ((ipInt >>> 24) + '.' + (ipInt >> 16 & 255) + '.' + (ipInt >> 8 & 255) + '.' + (ipInt & 255));
}

function IPv4ToInt(ip) {
    return ip.split('.').reduce(function (ipInt, octet) { return (ipInt << 8) + parseInt(octet, 10) }, 0) >>> 0;
}

const app = express();
app.use(express.json());

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

// get messages from server
// TODO: I will probably only fetch 100, but maybe I can make a paramater to fetch 
// n posts
app.post("/livechat/api/fetch-msgs", (req, res) => {
    console.log("Fetching messages from livechat database...");
    var query = `SELECT * FROM msg_table ORDER BY posted_on ASC`;

    connection.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(500).json({ error: "Error fetching data" });
        }

        const data = JSON.parse(JSON.stringify(results)); // Parse the entire results array
        res.json(data);
    });
});


// send message to server
app.post("/livechat/api/send-msg", (req, res) => {
    console.log("Posting message to server");
    console.log(`REQ: ${req.body}`);

    const { username, msg, userIP } = req.body;
    console.log(req.body)
    const userIPint = IPv4ToInt(userIP);
    console.log(`user from: ${userIP} posted a message`)
    const query = `INSERT INTO msg_table (username, message, ip_addr, posted_on) VALUES (?, ?, ?, NOW())`;

    connection.query(query, [username, msg, userIPint], (err, results, field) => {
        if (err) {
            console.log(err);
            connection.end();
            return res.status(500).json({ error: "Failed to store message to database." });
        }
    });
    return res.status(200).json({ message: "Message sent successfully." });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

