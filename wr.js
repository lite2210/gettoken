const fs = require('fs');
// const he = require('he');

module.exports = {
    // writeDomToFile: function (fileName, domSelector) {
    //     var content = he.decode(domSelector.html());
    //     this.writeToFile(fileName, content);
    // },
    writeToFile: function (fileName, content) {
        fs.writeFileSync('tmp/' + fileName, content, 'utf8', function (err) {
            if (err) {
                return console.log('write file err', err);
            }
            console.log("saved: " + fileName);
        });
    },
    writeSiteMap: function (fileName, content) {
        fs.writeFileSync('../sitemap/' + fileName, content, 'utf8');
    },
    writeToFileFinal: function (fileName, content) {
        fileName = handleName(fileName);
        fs.writeFile('final/' + fileName, content, 'utf8', function (err) {
            if (err) {
                return console.log('write file err', err);
            }
            console.log("saved: " + fileName);
        });
    }
};

function handleName(str) {
    var currentLink = decodeURI(decodeURIComponent(str));
    console.log("current link", currentLink);
    var tempLink = currentLink;
    // var tempLink = currentLink.replace(/\//g, '_').replace(/!|:[=<>:"\/\\|?*]+/g, '_');
    if (!tempLink.endsWith(".html") && !tempLink.endsWith(".htm")) {
        tempLink += '.html';
    }
    return tempLink;
}