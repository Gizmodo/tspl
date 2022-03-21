const express = require('express')
const basicAuth = require('express-basic-auth')
const slowDown = require("express-slow-down");
const logger = require('./log/logger')
const httpLogger = require('./log/httpLogger')
const Net = require('net');
const fs = require('fs')

const app = express()
const httpPort = 3000
const tcpPort = 9100
const server = Net.createServer()

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    // delayAfter: 1, // allow 100 requests per 15 minutes, then...
    delayMs: 3000 // begin adding 500ms of delay per request above 100:
});
app.use(httpLogger)
//app.use(speedLimiter);

let isUseAuth = false
if (isUseAuth) {
    app.use(basicAuth({
        users: {'tsd': 'tsd159753'},
        unauthorizedResponse: getUnauthorizedResponse
    }))
}

function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

server.listen(tcpPort, function () {
    console.log('TCP Server is running on port ' + tcpPort + '.');
});

let sockets = [];
server.on('connection', function (sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);
    sock.on('data', function (data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
// Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function (sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
    });
// Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        let index = sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});
app.get('/Tech/hs/tsd/printers/get', (req, res) => {
    logger.info(req.hostname + " запрос списка принтеров")
    res.contentType("application/json")
    res.json({
        "printers": [
            {
                "ip": "192.168.88.17",
                "sn": "323WG20821002",
                "model": "XP-P323B"
            },
            {
                "ip": "10.254.1.230",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
            ,
            {
                "ip": "192.168.88.87",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            },
            {
                "ip": "192.168.88.12",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            },
            {
                "ip": "192.168.88.13",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
        ]
    })
});
app.get('/Tech/hs/tsd/users/get', (req, res) => {
    logger.info(req.hostname + " запрос списка пользователей")
    res.contentType("application/json")
    res.json([
        {
            "Код": "000000001",
            "Наименование": "Оператор",
            "Пароль": "123"
        },
        {
            "Код": "000000002",
            "Наименование": "Директор",
            "Пароль": "321"
        },
        {
            "Код": "000000003",
            "Наименование": "Капуста Иван",
            "Пароль": "159753"
        },
        {
            "Код": "000000004",
            "Наименование": "Петров Василий",
            "Пароль": "111"
        },
        {
            "Код": "000000005",
            "Наименование": "Пупкин Дормидонт",
            "Пароль": "222"
        }
    ])
});
app.get('/Tech/hs/tsd/shops/get', (req, res) => {
    logger.info(req.hostname + " запрос списка магазинов")
    res.contentType("application/json")
    res.json([
        {
            "Префикс": "Д87",
            "Наименование": "88.87:3000",
            "Адрес": "192.168.88.87:3000",
            "Сервис": "TSD88",
            "Шаблоны": [
                "22ТТТТТМММММК"
            ]
        },
        {
            "Префикс": "Д230",
            "Наименование": "1.230:3000",
            "Адрес": "10.254.1.230:3000",
            "Сервис": "TSD230",
            "Шаблоны": [
                "22ТТТТТМММММК"
            ]
        },
        {
            "Префикс": "Д80",
            "Наименование": "Десяточка №49 Юбилейный, 28",
            "Адрес": "10.150.10.10",
            "Сервис": "TSD",
            "Шаблоны": [
                "22ТТТТТМММММК"
            ]
        },
        {
            "Префикс": "ЯЯЯ",
            "Наименование": " Тестовый магазин",
            "Адрес": "192.168.0.154",
            "Сервис": "TSD10",
            "Шаблоны": [
                "22ТТТТТМММММК"
            ]
        },
        {
            "Префикс": "Д56",
            "Наименование": "Десяточка №34 Скворцова",
            "Адрес": "10.150.34.100",
            "Сервис": "TSD",
            "Шаблоны": [
                "22ТТТТТМММММК",
                "27ПППППМММММК"
            ]
        },
        {
            "Префикс": "Д66",
            "Наименование": "Десяточка №44 Нея",
            "Адрес": "10.150.44.100",
            "Сервис": "TSD44",
            "Шаблоны": [
                "22ТТТТТМММММК"
            ]
        }
    ])
});

app.get('/TSD230/hs/tsd/printers/get', (req, res) => {
    logger.info(req.hostname + " запрос списка принтеров магазина TSD230")
    res.contentType("application/json")
    res.json({
        "printers": [
            {
                "ip": "192.168.88.17",
                "sn": "323WG20821002",
                "model": "XP-P323B"
            },
            {
                "ip": "10.254.1.230",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
            ,
            {
                "ip": "192.168.88.87",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            },
            {
                "ip": "192.168.88.12",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            },
            {
                "ip": "192.168.88.13",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
        ]
    })
});
app.get('/TSD88/hs/tsd/printers/get', (req, res) => {
    logger.info(req.hostname + " запрос списка принтеров магазина TSD88")
    res.contentType("application/json")
    res.json({
        "printers": [
            {
                "ip": "192.168.88.17",
                "sn": "323WG20821002",
                "model": "XP-P323B"
            },
            {
                "ip": "10.254.1.230",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
            ,
            {
                "ip": "192.168.88.87",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            },
            {
                "ip": "192.168.88.12",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            },
            {
                "ip": "192.168.88.13",
                "sn": "323WG76854802",
                "model": "XP-P353B"
            }
        ]
    })
});
app.post('/TSD88/hs/tsd/pricetag/POST', (req, res) => {
    logger.info(req.hostname + " запрос информации по ценникам для магазина TSD88")
    res.contentType("application/json")
    res.json([
        {
            "barcode": "2210005001232",
            "found": true,
            "code": "10005",
            "plu": 3,
            "string1": "Сахарный песок",
            "string2": "1 кг",
            "string3": "",
            "string4": "",
            "manufacturer": "Россия",
            "price": 49.9,
            "stock": 0,
            "nodiscount": true
        },
        {
            "barcode": "10005",
            "found": true,
            "code": "10005",
            "plu": 3,
            "string1": "Сахарный песок",
            "string2": "1 кг",
            "string3": "",
            "string4": "",
            "manufacturer": "Россия",
            "price": 49.9,
            "stock": 0,
            "nodiscount": true
        },
        {
            "barcode": "10006",
            "found": true,
            "code": "10006",
            "plu": 0,
            "string1": "Сода пищевая",
            "string2": "500 г",
            "string3": "",
            "string4": "",
            "manufacturer": "г. Стерлитамак",
            "price": 26.5,
            "stock": 0,
            "nodiscount": false
        }
    ])
})
app.post('/TSD230/hs/tsd/pricetag/POST', (req, res) => {
    logger.info(req.hostname + " запрос информации по ценникам для магазина TSD230 1POST")
    res.contentType("application/json")
    res.json([
        {
            "barcode": "2210005001232",
            "found": true,
            "code": "10005",
            "plu": 3,
            "string1": "Сахарный песок",
            "string2": "1 кг",
            "string3": "",
            "string4": "",
            "manufacturer": "Россия",
            "price": 49.9,
            "stock": 0,
            "nodiscount": true
        },
        {
            "barcode": "10005",
            "found": true,
            "code": "10005",
            "plu": 3,
            "string1": "Сахарный песок",
            "string2": "1 кг",
            "string3": "",
            "string4": "",
            "manufacturer": "Россия",
            "price": 49.9,
            "stock": 0,
            "nodiscount": true
        },
        {
            "barcode": "10006",
            "found": true,
            "code": "10006",
            "plu": 0,
            "string1": "Сода пищевая",
            "string2": "500 г",
            "string3": "",
            "string4": "",
            "manufacturer": "г. Стерлитамак",
            "price": 26.5,
            "stock": 0,
            "nodiscount": false
        }
    ])
})
app.post('/TSD230/hs/tsd/pricetag', (req, res) => {
    logger.info(req.hostname + " запрос информации по ценникам для магазина TSD230")
    res.contentType("application/json")
    res.json([
        {
            "barcode": "2210005001232",
            "found": true,
            "code": "10005",
            "plu": 3,
            "string1": "Сахарный песок",
            "string2": "1 кг",
            "string3": "",
            "string4": "",
            "manufacturer": "Россия",
            "price": 49.9,
            "stock": 0,
            "nodiscount": true
        },
        {
            "barcode": "10005",
            "found": true,
            "code": "10005",
            "plu": 3,
            "string1": "Сахарный песок",
            "string2": "1 кг",
            "string3": "",
            "string4": "",
            "manufacturer": "Россия",
            "price": 49.9,
            "stock": 0,
            "nodiscount": true
        },
        {
            "barcode": "10006",
            "found": true,
            "code": "10006",
            "plu": 0,
            "string1": "Сода пищевая",
            "string2": "500 г",
            "string3": "",
            "string4": "",
            "manufacturer": "г. Стерлитамак",
            "price": 26.5,
            "stock": 0,
            "nodiscount": false
        }
    ])
})
app.listen(httpPort, () =>
    logger.info('Express.js listening on port 3000.'))

