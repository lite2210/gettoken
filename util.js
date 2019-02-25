const crypto = require('crypto');
const qs = require('querystring');
const http = require('http');
const https = require('https');
module.exports = {
    randString: function(limit) {
        limit = limit || 10;
        let text = "abcdefghijklmnopqrstuvwxyz";
        text = text.charAt(Math.floor(Math.random() * text.length));
        const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    
        for (let i = 0; i < limit - 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        // console.log('proxy', text);
        return text;
    },

    ksort: function (obj) {
        var keys = Object.keys(obj).sort(), sortedObj = {};

        for (var i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }

        return sortedObj;
    },
    
    randBetween: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },


    arrDiff: function (arrA, keyA, arrB, keyB) {
        // http://stackoverflow.com/questions/21987909/difference-between-two-array-of-objects-in-javascript
        return arrA.filter(function (current) {
            return arrB.filter(function (current_b) {
                return current_b[keyB] == current[keyA]
            }).length == 0
        });
    },

    arrDiff2: function (arrA, arrB, key) {
        // http://stackoverflow.com/questions/6715641/an-efficient-way-to-get-the-difference-between-two-arrays-of-objects
        // Make hashtable of ids in B
        var bIds = {};
        arrB.forEach(function (obj) {
            bIds[obj[key]] = obj;
        });

        // Return all elements in A, unless in B
        return arrA.filter(function (obj) {
            return !(obj[key] in bIds);
        });
    },

    arrDup: function (arrA, keyA, arrB, keyB) {
        let matchedArr = [];
        arrA.forEach(function (objA) {
            arrB.forEach(function (objB) {
                if (objA[keyA] == objB[keyB]) {
                    matchedArr.push(objA);
                }
            })
        });

        return matchedArr;
    },

    arrRand: function randomIntFromInterval(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    uniq: function (a) {
        return Array.from(new Set(a));
    },
    md5: function (str) {
        return crypto.createHash('md5').update(str).digest('hex');
    },

    sleep: function (time) {
        return new Promise((resolve) => setTimeout(resolve, time * 1000));
    },

    date: function () {
        const now = new Date();
        const Y = now.getFullYear();
        const M = now.getMonth() + 1;
        const D = now.getDate();
        return [Y, M, D].join('-');
    },

    time: function (obj) {
        const now = obj || new Date();
        const Y = now.getFullYear();
        const M = now.getMonth() + 1;
        const D = now.getDate();
        const H = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        return [Y, M, D].join('-') + ' ' + [H, m, s].join(':')
    },

    req: function (url, data, isJson) {
        const char = /\?/.test(url) ? '&' : '?';
        if (data) {
            url = url + char + qs.stringify(data);
        }
        // return new pending promise
        return new Promise((resolve, reject) => {
            // if(!data.category){
            //     reject(new Error('test only'));
            // }
            // select http or https module, depending on reqested url
            const lib = url.startsWith('https') ? https : http;
            const request = lib.get(url, (response) => {
                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                // temporary data holder
                const body = [];
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                response.on('end', () => resolve(isJson ? JSON.parse(body.join('')) : body.join('')));
            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err))
        })
    },

    send: function (opt) {
        const _this = this;
        if (opt.url) {
            return _this.proxy(opt);
        }
        let url = opt.uri;
        const char = /\?/.test(url) ? '&' : '?';
        if (opt.qs) {
            url = url + char + qs.stringify(opt.qs);
        }
        const regexDomain = url.match(/(https?:\/\/([\w\d-.]+)(:([0-9]+))?)(\/.*)?/);
        const secure = url.startsWith('https');
        const options = {
            host: regexDomain[2],
            port: regexDomain[4] || (secure ? 443 : 80),
            path: regexDomain[5],
            method: opt.method || 'GET',
            headers: opt.headers || {}
        };

        if (opt.formData) {
            var postData = JSON.stringify(opt.formData);

            options.headers['Content-Type'] = opt.json ? 'application/json' : 'application/x-www-form-urlencoded';
            options.headers['Content-Length'] = Buffer.byteLength(postData)
        }

        // return new pending promise
        return new Promise((resolve, reject) => {
            // select http or https module, depending on url
            const lib = secure ? https : http;
            const req = lib.request(options, (response) => {
                // handle http errors
                if (response.statusCode >= 300 && response.statusCode <= 399) {
                    // follow redirect
                    let newUrl = response.headers.location;
                    opt.uri = newUrl.startsWith('/') ? (regexDomain[1] + newUrl) : newUrl;
                    resolve(_this.send(opt));
                } else if (response.statusCode < 200 || response.statusCode > 299) {
                    // error

                    if (url.search('graph.facebook.com')) {
                        const body = [];
                        response.setEncoding('utf8');
                        response.on('data', (chunk) => body.push(chunk));
                        response.on('end', () => {
                            let str = body.join();
                            if (!/<?(html|HTML)>/.test(str)) {
                                str = JSON.parse(str).error.message
                            }
                            reject(str)
                        });
                    } else
                        reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }

                // temporary data holder
                const body = [];
                response.setEncoding('utf8');
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                response.on('end', () => resolve(opt.json ? JSON.parse(body.join('')) : body.join('')));
            });
            // handle connection errors of the request
            req.on('error', (err) => reject(err));

            req.setTimeout(10 * 1000, err => reject(err || new Error('Request timeout')));

            if (opt.formData) {
                console.log('write data', opt.formData);
                req.write(postData);
            }

            req.end();
        })
    },

    proxy: function (opt) {
        const url = opt.url;
        delete opt.url;
        const newOpt = {
            uri: url,
            qs: JSON.stringify(opt)
        };

        return this.send(newOpt)
    },

    gg: function (opt) {
        return this.send(getProxyOptions(opt))
    }
};

function getProxyOptions(options) {
    let url = options.uri;
    const char = /\?/.test(url) ? '&' : '?';
    if (options.qs) {
        url = url + char + qs.stringify(options.qs);
    }
    const opt = {
        uri: 'https://' + randString() + '-focus-opensocial.googleusercontent.com/gadgets/proxy',
        qs: {
            container: 'focus',
            url: url
        },
        json: options.json
    }
    return opt;
}

function randString(limit) {
    limit = limit || 10;
    let text = "abcdefghijklmnopqrstuvwxyz";
    text = text.charAt(Math.floor(Math.random() * text.length));
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < limit - 1; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    // console.log('proxy', text);
    return text;
}