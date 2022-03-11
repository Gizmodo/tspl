const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const basicAuth = require('express-basic-auth')
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
            ,
            {
                "ip": "192.168.88.11",
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
    res.contentType("application/json")
    res.json([
        {
            "Префикс": "Д67",
            "Наименование": "Десяточка №06 Черноречье ",
            "Адрес": "192.168.213.8",
            "Сервис": "TSD06",
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

app.get('/SettingsForTSD.xml', (req, res) => {
    console.log(req.hostname + " читаем файл с настройками")
    res.contentType("application/xml")
    fs.readFile("SettingsForTSD.xml", (err, buff) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(req.hostname)
        let data = buff.toString();
        res.status(200).send(data)
    });

})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})