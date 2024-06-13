document.addEventListener("DOMContentLoaded", async function() {
    const favorites = await getFavorites()
    if(favorites.length > 0) {
        console.log('favorites', favorites)
        renderFavorites(favorites)
        return
    }
    searcher("dark knight");
})

