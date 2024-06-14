document.addEventListener("DOMContentLoaded", async function() {

    $('#searchBar').on('click', showPreviousSearchDropdown)
    $('#searchBar').on('focusout', () => {
        setTimeout(() => {
            $('#prev-search-dropdown').empty()
        }, 500)
    })
    
    const favorites = await getFavorites()
    
    if(favorites.length > 0) {
        renderFavorites(favorites)
        return
    }
    searcher("dark knight");
})


