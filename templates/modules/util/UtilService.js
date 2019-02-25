angular.module('fbSupport.UtilService', [])
    .factory('UtilService', ['toaster', '$http', '$q', '$filter', 'md5', utilService]);

function utilService(toaster) {
    function string2Array(str, keyVal, separator) {
        var arr = str.split('\n').filter(function (item) {
            return item && item.length > 0
        });
        arr = uniq(arr);
        if (Array.isArray(keyVal)) {
            // console.log("array", keyVal);
            arr = arr.map(function (item) {
                if (separator) {
                    var obj = item.split(separator);
                }

                if (obj.length >= keyVal.length) {
                    var singleObj = {};
                    keyVal.forEach(function (key, index) {
                        // console.log("key", key);
                        // console.log("index", index);
                        singleObj[key] = obj[index];
                    });
                    // console.log("single obj", singleObj);
                    return singleObj;
                } else {
                    toaster.pop({
                        type: 'error',
                        title: 'INVALID TOKEN FORMAT',
                        body: item,
                        timeout: 3 * 1000,
                        showCloseButton: true
                    });
                }
            });
            arr = arr.filter(function (obj) {
                return obj && !isEmptyObject(obj);
            });

            arr = arr.map(function (obj, index) {
                obj.id = index;
                return obj;
            })
        } else if (keyVal) {
            arr = arr.map(function (item, index) {
                var obj = {};
                obj[keyVal] = item;
                obj.id = index;
                return obj;
            })
        }
        return arr;
    }

    function parseResponseText(responseText) {
        if ("for (;;);" === responseText.substr(0, 9).toLowerCase()) {
            responseText = responseText.substr(9)
        }
        return $.parseJSON(responseText);
    }

    //TODO: change to sendMessageToFb
    function requestFacebook(task, data, callback) {
        chrome.tabs.query({}, function (tabs) {
            var targetTab = tabs.filter(function (el) {
                return el.url.indexOf("facebook.com") > -1;
            }).pop();
            if (targetTab) {
                var dataMessage = {task: task, data: data};
                chrome.tabs.sendMessage(targetTab.id, dataMessage, function (response) {
                    callback(response);
                });
            } else {
                // $log.debug("facebook tab not found");
                window.open('https://m.facebook.com/profile.php', '_blank');
            }
        });
    }

    function isGroupTool(group) {
        var groupDetail = JSON.parse(group.datagt);
        return groupDetail.bookmark_type == "type_group_tool";
    }

// target between x and y
    function isBetween(target, x, y) {
        var min = Math.min.apply(Math, [x, y]),
            max = Math.max.apply(Math, [x, y]);
        return target > min && target < max;
    }

    function generateNumber(limit) {
        limit = limit || 10;
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < limit; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function generateUpperString(limit) {
        limit = limit || 10;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < limit; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function generateRandomString() {
        return Math.random().toString(36).substring(20);
    }

    function generatePath() {
        return generateNumber() + "/" + generateUpperString() + "/post-" + generateNumber(5) + ".html";
    }

    function generateRandomLink(domain, isSubDomain, isPath) {
        var finalLink = 'http://';
        if (isSubDomain) {
            finalLink += (generateRandomString() + '.' + domain + '/');
        } else {
            finalLink += (domain + '/');
        }
        if (isPath) {
            finalLink += generatePath();
        }
        return finalLink;
    }

    //TODO: copy from utils.js
    function arrDiff(arrA, arrB, key) {
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
    }

    function isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }

    function sameArray(a, b) {
        var matches = [];

        for (var i = 0; i < a.length; i++) {
            for (var e = 0; e < b.length; e++) {
                if (a[i] === b[e]) matches.push(a[i]);
            }
        }
        return matches;
    }

    function simpleDiff(A, B) {
        return A.filter(function (x) {
            return B.indexOf(x) < 0
        })
    }

    function uniq(a) {
        return Array.from(new Set(a));
    }

    function uniqueArr(arr, key) {
        var unique = {};
        var distinct = [];
        for (var i in arr) {
            if (typeof(unique[arr[i][key]]) == "undefined") {
                distinct.push(arr[i]);
            }
            unique[arr[i][key]] = 0;
        }
        return distinct;
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return {
        requestFacebook: requestFacebook,
        parseResponseText: parseResponseText,
        isBetween: isBetween,
        isGroupTool: isGroupTool,
        generateRandomLink: generateRandomLink,
        arrDiff: arrDiff,
        simpleDiff: simpleDiff,
        uniq: uniq,
        uniqueArr: uniqueArr,
        sameArray: sameArray,
        isEmptyObject: isEmptyObject,
        string2Array: string2Array,
        randomNumber: randomNumber
    }
}

//TODO: $http (sendDirectRequest)