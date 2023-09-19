const express = require('express');
const connection = require('./db-config.js');
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3003;
const io = socketIO(server);

function intToIPv4(ipInt) {
    return ((ipInt >>> 24) + '.' + (ipInt >> 16 & 255) + '.' + (ipInt >> 8 & 255) + '.' + (ipInt & 255));
}

function IPv4ToInt(ip) {
    return ip.split('.').reduce(function (ipInt, octet) { return (ipInt << 8) + parseInt(octet, 10) }, 0) >>> 0;
}

function getTimeStamp() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

io.on('connection', (socket) => {
    console.log("A user connected");

    socket.on('message', (response) => {
        console.log(`Received message: ${response.msg}`);

        response['posted_on'] = getTimeStamp();
        console.log(`response: ${JSON.stringify(response)}`)

        io.emit('message', response);
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });
});

io.on('error', (error) => {
    console.error('Socket.IO Error:', error);
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

//  process.exit(1);
// 
// 
// row err;
//     console.log('Connected to MySQL Server!');
// });
// 
// // get messages from server
// app.post("/livechat/api/fetch-msgs", (req, res) => {
//     console.log("Fetching messages from livechat database...");
//     var query = `SELECT * FROM msg_table ORDER BY posted_on ASC`;
// 
//     connection.query(query, (err, results, fields) => {
//         if (err) {
//             console.log(err);
//             connection.end();
//             return res.status(500).json({ error: "Error fetching data" });
//         }
// 
//         const data = JSON.parse(JSON.stringify(results)); // Parse the entire results array
//         res.json(data);
//     });
// });
// 
// 
// // send message to server
// app.post("/livechat/api/send-msg", (req, res) => {
//     console.log("Posting message to server");
//     console.log(`REQ: ${req.body}`);
// 
//     const { username, msg, userIP } = req.body;
//     console.log(req.body)
//     const userIPint = IPv4ToInt(userIP);
//     console.log(`user from: ${userIP} posted a message`)
//     const query = `INSERT INTO msg_table (username, message, ip_addr, posted_on) VALUES (?, ?, ?, NOW())`;
// 
//     connection.query(query, [username, msg, userIPint], (err, results, field) => {
//         if (err) {
//             console.log(err);
//             connection.end();
//             return res.status(500).json({ error: "Failed to store message to database." });
//         }
//     });
//     return res.status(200).json({ message: "Message sent successfully." });
// });
// 

