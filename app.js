const express = require('express');
const session = require('express-session');
const app = express();
const PORT  = 3000;

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: true,
}));

app.get('/payment-systems', (req, res) => {
    const ps = ['PhilPaSS RTGS', 'PesoNet', 'PDDTS GSRT', 'PhilPaSS End-of-Day Netting', 'SWIFT'];
    return res.json(ps);
});

app.get('/payment-types/:ps', (req, res) => {
    const { ps } = req.params;
    let pt = [];
    switch(ps) {
        case '1': 
            pt = ['MT101', 'MT102'];
            break;
        case '2':
            pt = ['MT101', 'MT103'];
            break;
        case '3':
            pt = ['MT104'];
            break;
        case '4':
            pt = ['MT101', 'MT102', 'MT103', 'MT104'];
            break;
        case '5':
            pt = ['MT104','MT105','MT106'];
            break;
        default:
            pt = ['sample']
    }
    return res.json(pt);
});

app.get('/transactions', (req, res) => {
    // req.session.transactions = [];
    // const a = JSON.parse(JSON.stringify(req.session.transactions));
    // req.session.transactions.push('1');
    // req.session.transactions.push('2');
    // res.send(a[1]);
    
    const fs = require('fs');
    fs.readFile('./transactions.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            const last = obj.table[obj.table.length - 1];
            const newTrans = parseInt(last) + 1;
            obj.table.push(newTrans); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('./transactions.json', json, 'utf8', (err) => {
                if (err) throw err;
                return res.json({"transactionNumber": newTrans.toString().padStart(5, "0")});
            }); // write it back 
        }});
        
    // const { table } = require('./transactions.json');
    // return res.send(table[0]);
});

app.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});