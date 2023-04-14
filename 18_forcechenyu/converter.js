const fs = require('fs');
const path = require('path');

const convertRawJsonToChartData = (rawJson) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, rawJson), 'utf-8'));
    const chartData = data.map((item) => {
        return item.word
    });
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(chartData));
}

convertRawJsonToChartData('./idiom.json');