const qs = require('querystring');
const axios = require('axios-proxy-fix');
const uuid = require('uuid/v4');
const util = require('./util');

async function get(data) {
    console.log('start get', data);
    const sim = util.randBetween(2E4, 4E4);
    let formData = {
        'meta_inf_fbmeta': 'NO_FILE',
        'adid': data.adId || uuid(),
        'format': 'json',
        'device_id': data.deviceId || uuid(),
        'email': data.email,
        'password': data.fbpw,
        'credentials_type': 'password',
        'generate_session_cookies': '1',
        'error_detail_type': 'button_with_disabled',
        'source': 'register_api',
        'machine_id': util.randString(24),
        'locale': 'en_US',
        'client_country_code': 'US',
        'method': 'auth.login',
        'fb_api_req_friendly_name': 'authenticate',
        'fb_api_caller_class': 'com.facebook.account.login.protocol.Fb4aAuthHandler',
        'api_key': '882a8490361da98702bf97a021ddc14d'
    };
    formData = util.ksort(formData);
    formData.sig = getSig(formData);
    let conf = {
        url: 'https://b-api.facebook.com/method/auth.login',
        method: 'post',
        // proxy: {
        //     host: 'east.xom8.net',
        //     port: 6060,
        //     auth: {
        //         username: 'vnnit@plzmail.net',
        //         password: 'Abc1234!!'
        //     }
        // },
        data: formData,
        transformRequest: [function (data, headers) {
            return qs.stringify(data);
        }],
        headers: {
            'x-fb-connection-bandwidth': util.randBetween(2E7, 3E7),
            'x-fb-sim-hni': sim,
            'x-fb-net-hni': sim,
            'x-fb-connection-quality': 'EXCELLENT',
            'x-fb-connection-type': 'cell.CTRadioAccessTechnologyHSDPA',
            'user-agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; NX55 Build/KOT5506) [FBAN/FB4A;FBAV/106.0.0.26.68;FBBV/45904160;FBDM/{density=3.0,width=1080,height=1920};FBLC/it_IT;FBRV/45904160;FBCR/PosteMobile;FBMF/asus;FBBD/asus;FBPN/com.facebook.katana;FBDV/ASUS_Z00AD;FBSV/5.0;FBOP/1;FBCA/x86:armeabi-v7a;]',
            'content-type': 'application/x-www-form-urlencoded',
            'x-fb-http-engine': 'Liger'
        },
    };
    if (data.host) {
        conf.proxy = {
            host: data.host,
            port: data.port || 80,
            auth: {
                username: data.user,
                password: data.pw
            }
        }
    }
    // console.log('request config', conf);
    const resp = await axios(conf);
    console.log('token =', resp.data.error_msg || resp.data.access_token);
    return resp.data;
}

function getSig(formData) {
    let sig = '';
    Object.keys(formData).forEach(function (key) {
        sig += `${key}=${formData[key]}`;
    });
    sig = util.md5(sig + '62f8ce9f74b12f84c123cc23437a4a32');
    return sig;
}

module.exports = get