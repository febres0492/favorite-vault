function c(str='null', color = 'g'){ 
    // this function is to color the console.log
    const colors = require('colors');
    const opt = { r: 'red', g: 'green', y: 'yellow', b: 'blue'}
    return colors[opt[color]](str) 
}

module.exports = {

    getpage: async (obj) => {
        let {req, res, page } = obj
        const pageList = ['homepage','user_settings']
        page = pageList.indexOf(page) > -1 ? page : 'homepage'
        
        const message = obj.message ? obj.message : pageList.indexOf(page) > -1 ? null : 'Page not found, redirecting to homepage...'
        console.log(c('message','g'), message)

        res.render(page , {
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
            currUser: req.session.currUser,
            message: message
        })
    },

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
