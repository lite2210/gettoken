const util = require('./util');

module.exports = {
    get: function (type, data) {
        let url = 'https://graph.facebook.com/', options;
        switch (type) {
            case 'TOKEN':
            options = {
                uri: 'https://b-api.facebook.com/method/auth.login',
                formData: {
                    meta_inf_fbmeta: 'NO_FILE',
                    adid: data.adId,
                    format: 'json',
                    device_id: data.deviceId,
                    email: data.email,
                    password: data.pw,
                    credentials_type: 'password',
                    generate_session_cookies: 1,
                    error_detail_type: 'button_with_disabled',
                    source: 'login',
                    machine_id: data.machineId,
                    locale: 'en_US',
                    client_country_code: 'US',
                    method: 'auth.login',
                    fb_api_req_friendly_name: 'authenticate',
                    fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
                    api_key: '882a8490361da98702bf97a021ddc14d',
                    sig: data.sig
                },
                headers: {
                    'x-fb-connection-bandwidth': 8920511,
                    'x-fb-sim-hni': 31016,
                    'x-fb-net-hni': 31016,
                    'x-fb-connection-quality': 'EXCELLENT',
                    'x-fb-connection-type': 'WIFI',
                    'user-agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; NX529J Build/KOT49H) [FBAN/FB4A;FBAV/136.0.0.22.91;FBPN/com.facebook.katana;FBLC/en_US;FBBV/67437971;FBCR/T-Mobile;FBMF/nubia;FBBD/Huawei;FBDV/NX529J;FBSV/4.4.2;FBCA/x86:armeabi-v7a;FBDM/{density=1.0,width=480,height=800};FB_FW/1;]',
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-fb-http-engine': 'Liger'
                }
            };
            return util.send(options);
            break;
            case 'JOIN':
            case 'tokenJoinGroup':
                options = {
                    uri: 'https://graph.facebook.com/' + data.fbGroupId + '/members/' + data.fbAccId,
                    qs: {
                        access_token: data.fbToken,
                        method: 'post'
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'SHARE':
            case 'shareLink':
                options = {
                    uri: 'https://graph.facebook.com/' + data.fbGroupId + '/feed',
                    qs: {
                        access_token: data.fbToken,
                        link: data.link,
                        message: data.message,
                        method: 'post'
                    },
                    json: true
                };
                return util.gg(options);
                break;

            case 'checkBlock':
                options = {
                    uri: url,
                    qs: {
                        ids: data.ids,
                        fields: 'id,name,members.summary(total_count),members.limit(0)',
                        access_token: data.fbToken
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'getGroupFeed':
                options = {
                    uri: 'https://graph.facebook.com/' + data.fbGroupId + '/feed',
                    qs: {
                        access_token: data.fbToken,
                        fields: 'id',
                        limit: 10
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'likePost':
                url = 'https://graph.facebook.com/' + data.postId + '/likes';
                options = {
                    uri: url,
                    qs: {
                        access_token: data.fbToken,
                        method: 'post'
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'checkLink':
                options = {
                    uri: 'https://graph.facebook.com/' + data.resultId,
                    qs: {
                        access_token: data.fbToken,
                        fields: 'actions'
                    },
                    json: true
                };
                return util.gg(options);
                break;

            case 'checkTokenAndGroup':
                options = {
                    uri: 'https://graph.facebook.com/me',
                    qs: {
                        fields: 'id,name,birthday,location,groups,groups.limit(1000),groups.fields(id,name,privacy,members.summary(total_count),members.limit(0))',
                        access_token: data.fbToken
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'getApp':
                url = 'https://graph.facebook.com/app';
                options = {
                    uri: url,
                    qs: {
                        access_token: data.accToken
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'getCookieApp':
                url = 'https://api.facebook.com/method/auth.getSessionforApp';
                options = {
                    uri: url,
                    qs: {
                        access_token: data.accToken,
                        format: 'json',
                        new_app_id: data.appId,
                        generate_session_cookies: '1'
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'sendMessage':
                options = {
                    uri: `https://graph.facebook.com/${data.targetId}/conversations`,
                    qs: {
                        access_token: data.fbToken,
                        message: data.message,
                        method: 'post'
                    },
                    json: true
                };
                return util.gg(options);
                break;
            case 'getToken':
                options = {
                    uri: 'https://www.facebook.com/me',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
                        accept: '*/*',
                        'accept-language': 'en-US,en;q=0.8',
                        'content-type': 'application/x-www-form-urlencoded',
                        cookie: 'c_user=' + data.accId + ';xs=' + data.accXs + ';',
                        origin: 'https://www.facebook.com',
                        referer: 'https://www.facebook.com',
                        'x-requested-with': 'XMLHttpRequest',
                        'x-response-format': 'JSONStream'
                    }
                };                
                return util.send(options);
                break;
            case 'checkShortLive':
                options = {
                    uri: 'https://developers.facebook.com/tools/debug/accesstoken/',
                    qs: {
                        q: data.fbToken
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
                        accept: '*/*',
                        'accept-language': 'en-US,en;q=0.8',
                        'content-type': 'application/x-www-form-urlencoded',
                        cookie: 'c_user=' + data.fbAccId + ';xs=' + data.xs + ';',
                        origin: 'https://www.facebook.com',
                        referer: 'https://www.facebook.com',
                        'x-requested-with': 'XMLHttpRequest',
                        'x-response-format': 'JSONStream'
                    }
                };
                return util.send(options);
                break;

            default:
                console.log('Not found case');
                break;
        }
    }
};