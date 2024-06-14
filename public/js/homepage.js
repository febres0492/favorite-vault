document.addEventListener("DOMContentLoaded", async function() {

    $('#searchBar').on('click', showPreviousSearchDropdown)
    $('#searchBar').on('focusout', () => {
        setTimeout(() => {
            $('#searchDropdown').hide()
        }, 100)
    })
    
    const favorites = await getFavorites()
    
    if(favorites.length > 0) {
        renderFavorites(favorites)
        return
    }
    searcher("dark knight");
})


