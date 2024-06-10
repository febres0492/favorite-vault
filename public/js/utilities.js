// https://api.themoviedb.org/3/discover/movie?api_key=
// movie name:
// https://api.themoviedb.org/3/search/movie?api_key=&query=MOVIENAME
// By genre:]
// https://api.themoviedb.org/3/discover/movie?api_key=&with_genres=35,53,27
// genre codes MOVIE
// Action          28
// Adventure       12
// Animation       16
// Comedy          35
// Crime           80
// Documentary     99
// Drama           18
// Family          10751
// Fantasy         14
// History         36
// Horror          27
// Music           10402
// Mystery         9648
// Romance         10749
// Science Fiction 878
// TV Movie        10770
// Thriller        53
// War             10752
// Western         37

// function to generate the movie cards
const movieGetter = async (res) => {
    const items = [...res.results]
    
    items.forEach(item => {
            $('#movies').append(`
        <div class="col-md-5">
            <div class="card">
                <h3>${item.original_title}</h3>
                <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" class="card-img" alt="Movie Poster">
                <a target="_blank" href="https://www.justwatch.com/us/search?q=${item.original_title}" class="btn btn-secondary">Watch Movie</a>
                <button class="btn btn-secondary result-item">Favorite</button>
            </div>
        </div>`)})
}



// function handleUrlParamsMessage() {
//     const urlParams = new URLSearchParams(window.location.search)
//     const message = urlParams.get('msg')

//     if (message == 0) {
//         showMessageInModal('Page not found! Redirecting to homepage...')
//     }
// }

// function handleDropdown() {
//     const dropdown = [...document.querySelectorAll('.dropdown')]
//     dropdown.forEach(item => {
//         item.addEventListener('click', () => {
//             item.querySelector('.dropdown-menu').classList.toggle('show-dropdown')
//         })
//     })
// }

function saveToFavorite(obj) {
    const requiredKeys = ['itemType', 'itemName', 'itemData']

    // checking if obj has all keys
    const keys = Object.keys(obj)
    requiredKeys.forEach(key => {
        if (!keys.includes(key)) {
            console.error(`saveToFavorite obj is missing ${key} key`)
            return
        }
    })

    $.ajax({
        url: 'api/users/addFavorite',
        data: obj,
        method: 'POST'
    }).then((res) => {
        console.log('saveToFavorite', res)
    }).catch(err => console.log(err))
}

function getFavorites() {
    return $.ajax({
        url: 'api/users/getFavorites',
        method: 'GET'
    }).then((res) => {
        console.log('getFavorites', res)
        return res
    }).catch(err => console.log(err))
}

function deleteFavorite(btn, id ) {
    console.log('deleteFavorite', id, btn)
    $.ajax({
        url: 'api/users/deleteFavorite',
        data: { itemId: id},
        method: 'DELETE'
    }).then((res) => {
        btn.closest('.favorite-item').remove()
    }).catch(err => console.log(err))
}

function renderFavorites(items) {

    if (!items.length) {
        $('#main-content')[0].innerHTML = '<h3>No favorites saved</h3>'
        return
    }

    const container = $('#main-content')[0]
    container.innerHTML = ''

    items.forEach(item => {
        const { id, itemType, itemName, itemData } = item
        container.innerHTML += `
            <div class="favorite-item border p-1 mb-1">
                <h3>${itemName || 'Undefined' }</h3>
                <p>${itemType}</p>
                <p>${id}</p>
                <button onclick="deleteFavorite(this, ${id})">Delete</button>
            </div>
        `
    })
}

async function handleBtn(btn){
    console.log('button clicked', btn)
    const items = await getFavorites()
    console.log('items', items)
    renderFavorites(items)
}

// -----------------------------------------------------------



//Create functions for google books apis

let placeHldr = '<img src="https://via.placeholder.com/150">';
       
function handleResponse(response) {

    const container = document.getElementById('books');
    container.innerHTML = ''

    for (var i = 0; i < response.items.length; i++) {
        let item = response.items[i];
        let viewUrl = item.volumeInfo.previewLink
        // in production code, item.text should have the HTML entities escap ed.
        //favorites link

        let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;
        container.innerHTML += `
            <div class="col-md-6">
                <div class="card" style="">
                    <h3>${item.volumeInfo.title}</h3>
                    <img src="${bookImg1}" class="card-img" alt="Book cover">
                    <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
                    <button class="btn btn-secondary result-item" >Favorite</button> 
                </div>
            </div>
        `
    }

    const fav_button = [...document.querySelectorAll('.result-item')]

    fav_button.forEach(btn => {
        btn.addEventListener('click', () => {

            console.log($(btn).closest('.card'))
            const itemName = $(btn).closest('.card').find('h3').text()
            saveToFavorite({
                itemType: 'book',
                itemName: itemName,
                itemData: JSON.stringify({ name: itemName, values: [1, 2, 3, 4, '5', '6'] })
            })
        })
    })
}


// Function to handle a search
const searcher = async () =>{
    try {
        $('#main-content').empty();
        $('#main-content').html(`<div class="col-lg-6">
                    <h3>Books</h3>
                    <div id="books"></div>
                </div>
                <div class="col-lg-6">
                    <h3>Movies</h3>
                    <div id="movies"></div>
                </div>`)
    const search = document.querySelector('#myInput').value.trim();
    if(search){
            const {movieData, bookData} = await $.ajax({ 
                                url: `http://localhost:3004/api/external/${search}`,
                                method:'Get'})
                handleResponse(bookData); 
                movieGetter(movieData);}
    } catch (err) {
        showMessageInModal(err)
    }
}

// Wait for the document to be fully loaded before adding event listeners
$(document).ready(() => {
document
    .querySelector('#search-button')
    .addEventListener('click', searcher);

document
        .querySelector('#myInput')
        .addEventListener('keydown', async (e) => {
            if(e.key === 'Enter'){
                e.preventDefault();
                searcher();
        }});
// document.querySelector('#favorite-btn').addEventListener('click', savetoFavorites);
})