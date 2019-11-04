const readlineSync = require('readline-sync');
const rp = require('request-promise');
const uuidv4 = require('uuid/v4');
var uuid = uuidv4();

const phoneNumber = readlineSync.question('Masukan No Hp : ');

const genUniqueId = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });


const functionGojekSendOtp = (uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v4/customers/login_with_phone'

    
    var options = {
        method: 'POST',
        uri: url,
        body: JSON.stringify({ "phone": `+62${phoneNumber}` }),
        headers: {
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: 'Bearer',
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'okhttp/3.12.1'
        },
    };

    rp(options)
    .then(function (body) {
        resolve(body)
    })
    .catch(function (err) {
        reject(err)
    });

  
});


const functionGojekVerify = (otpToken, otpLogin, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/v4/customers/login/verify'
    
    var options = {
        method: 'POST',
        uri: url,
        body: JSON.stringify({
            "client_name": "gojek:cons:android",
            "client_secret": '83415d06-ec4e-11e6-a41b-6c40088ab51e',
            "data": {
                "otp": otpLogin,
                "otp_token": otpToken
            },
            "grant_type": "otp",
            "scopes": "gojek:customer:transaction gojek:customer:readonly"
        }),
        headers: {
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: 'Bearer',
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'okhttp/3.12.1'
        },
    };

    rp(options)
    .then(function (body) {
        resolve(body)
    })
    .catch(function (err) {
        reject(err)
    });
});

const functionMutasi = (access_token, uuid, uniqid) => new Promise((resolve, reject) => {
    const url = 'https://api.gojekapi.com/wallet/history?page=1&limit=20'

    
    var options = {
        method: 'GET',
        uri: url,
        headers: {
            'X-AppVersion': '3.30.2',
            'X-UniqueId': uniqid,
            'X-Session-ID': uuid,
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'okhttp/3.12.1'
        },
    };

    rp(options)
    .then(function (body) {
        resolve(body)
    })
    .catch(function (err) {
        reject(err)
    });

  
});

(async () => {
    const uniqueid = await genUniqueId(16);
    const sendOtp = await functionGojekSendOtp(uuid, uniqueid);
    if (JSON.parse(sendOtp).success === false) {
        console.log('');
        console.log(sendOtp);
        console.log('');
    }
    const token = JSON.parse(sendOtp).data.login_token;
    const otp = await readlineSync.question('Masukan Otp : ');
    const verifotp = await functionGojekVerify(token, otp, uuid, uniqueid);
    const access_token = JSON.parse(getAccessToken).data.access_token;
    const cek = await functionMutasi(access_token, uuid, uniqueid);
    JSON.parse(cek).data.success.map(data => {
        console.log('Status: '+data.status)
        console.log('Deskripsi: '+data.description.split('\n'))
        console.log('Amount: '+data.amount)
        console.log('Type: '+data.type)
        console.log('Transaction Ref: '+data.transaction_ref)
        console.log('Tanggal Kirim: '+data.transacted_at+'\n')
    })
})();