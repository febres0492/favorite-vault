document.addEventListener("DOMContentLoaded", async function() {

    $('#searchBar').on('click', showPreviousSearchDropdown)
    $('#searchBar').on('focusout', () => $('#prev-search-dropdown').empty())
    
    const favorites = await getFavorites()
    
    if(favorites.length > 0) {
        renderFavorites(favorites)
        return
    }
    searcher("dark knight");
})


