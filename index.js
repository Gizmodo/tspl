// Include Nodejs' net module.
const http = require("http");
const Net = require('net');
const hostHttp = 'localhost';
const portHttp = 8000;
// The port number and hostname of the server.
const port = 9100;
const host = '10.254.1.230';
// Create a new TCP client.
const tcpClient = new Net.Socket();
// Send a connection request to the server.
// The client can also receive data from the server by reading from its socket.
function sendTCP(ip,payload){


tcpClient.connect({port: 9100, host: payload.ip}, function () {
    console.log('TCP connection established with the server.');

    tcpClient.write(data, function () {
        res.end(`{"message": "Data was send to printer!"}`);
        tcpClient.end()
    });
});
tcpClient.on('error', function () {
    console.log('Error TCP connection');
    res.end(`{"message": "Printer is not response!"}`);
});
tcpClient.on('end', function () {
    console.log('Requested an end to the TCP connection');
});
}
const requestListener = function (req, res) {

    let data = payload.payload

    /* res.setHeader("Content-Type", "application/json");
     res.writeHead(200);
     res.end(`{"message": "This is a JSON response"}`);*/
};
const server = http.createServer(async (req,res) =>{
    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    let payload = JSON.parse(data);
    sendTCP(payload.ip,payload.payload)
    req.on('end', () => {
        res.setHeader("Content-Type", "application/json");
        // res.end();
    })
})

server.listen(portHttp, hostHttp, () => {
    console.log(`Server is running on http://${hostHttp}:${portHttp}`);
});