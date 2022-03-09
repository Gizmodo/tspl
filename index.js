// Include Nodejs' net module.
const Net = require('net');
// The port number and hostname of the server.
const port = 9100;
const host = '192.168.88.17';
// Create a new TCP client.
const client = new Net.Socket();
// Send a connection request to the server.
client.connect({port: port, host: host}, function () {
    // If there is no error, the server has accepted the request and created a new
    // socket dedicated to us.
    console.log('TCP connection established with the server.');

    // The client can now send data to the server by writing to its socket.
    let data = "SIZE 4,3\n" +
        "GAP 0,0\n" +
        "DIRECTION 1\n" +
        "CLS\n" +
        "DMATRIX 10,110,400,400, \"DMATRIX EXAMPLE 1\"\n" +
        "DMATRIX 310,110,400,400,x6, \"DMATRIX EXAMPLE 2\"\n" +
        "DMATRIX 10,310,400,400,x8,18,18, \"DMATRIX EXAMPLE 3\"\n" +
        "PRINT 1,1\n"
    client.write(data);
});

// The client can also receive data from the server by reading from its socket.
client.on('data', function (chunk) {
    console.log(`Data received from the server: ${chunk.toString()}.`);

    // Request an end to the connection after the data has been received.
    client.end();
});

client.on('error', function () {
    console.log('Error TCP connection');
});
client.on('end', function () {
    console.log('Requested an end to the TCP connection');
});