const router = require('express').Router()
const fetch = require('node-fetch')
const movieApiKey = process.env.MOVIEAPIKEY
const bookApiKey = process.env.B_APIKEY
const { c, saveQueryToCookie} = require('../../utils/helpers')

router.post('/', async (req, res) => {
    console.log(c('testing external api route'), req.body)
    
    try {
        const query = req.body.query
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' })
        }

        const moviesRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${query}`)
        let movieData = {title: 'No movies found'}
        if (moviesRes.ok) { movieData = await moviesRes.json() } 

        const booksRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${bookApiKey}`)
        let bookData = {title: 'No books found'}
        if (booksRes.ok) { bookData = await booksRes.json() }

        saveQueryToCookie(req, query)

        res.status(200).json({ movieData, bookData })
    } catch (err) {
        console.error('Error:', err)
        res.status(400).json({ error: err.message})
    }
})

module.exports = router;

