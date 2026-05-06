const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('public/Brochure-2.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('public/pdf-text.txt', data.text);
}).catch(console.error);
