function c(str='null', color = 'g'){ // this function is to color the console.log
    const colors = require('colors');
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

module.exports = {

    c: c,

    get_emoji: () => {
        const randomNum = Math.random();
        let book = "📗";

        if (randomNum > 0.7) {
            book = "📘";
        } else if (randomNum > 0.4) {
            book = "📙";
        }

        return `<span for="img" aria-label="book">${book}</span>`;
    },
};
