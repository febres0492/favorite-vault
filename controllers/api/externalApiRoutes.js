const router = require('express').Router();
const movieApiKey = process.env.MOVIEAPIKEY;
const bookApiKey = process.env.B_APIKEY;

router.get('/:target', async (req, res) => {
    console.log('testing external api route')
    try {
        const target = req.params.target;
        const movies = await  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${target}`);
        const movieData = await movies.json();
        const books = await  fetch(`https://www.googleapis.com/books/v1/volumes?q=${target}&key=${bookApiKey}`);
        const bookData = await books.json();
        res.status(200).json({movieData, bookData});
    } catch (err) {
        console.log('err', err)
        res.status(400).json(err)
    }
})

// router.get('/book/:target', async (req, res) => {
//     console.log('testing external api route')
//     try {
//         const target = req.params.target;
//         const books = await  fetch(`https://www.googleapis.com/books/v1/volumes?q=${target}&key=${bookApiKey}`);
//         const bookData = await books.json();
//         res.status(200).json(bookData);
//     } catch (err) {
//         console.log('err', err)
//         res.status(400).json(err)
//     }
// })

// router.get('/movie/:target', async (req, res) => {
//     console.log('testing external api route')
//     try {
//         const target = req.params.target;
//         const movies = await  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${target}`);
//         const movieData = await movies.json();
//         res.status(200).json(movieData);
//     } catch (err) {
//         console.log('err', err)
//         res.status(400).json(err)
//     }
// })

module.exports = router;

