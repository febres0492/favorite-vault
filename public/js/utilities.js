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
// War             10752<img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" class="card-img" alt="Movie Poster">
// <a target="_blank" href="https://www.justwatch.com/us/search?q=${item.title}" class="btn btn-secondary">Watch Movie</a>
// Western         37


// function to generate the movie cards
function renderMovies(res) {
    const items = [...res.results]

    for (let i = 0; i < items.length; i += 6) {
        let carouselItem = `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row justify-content-center">`;
        for (let j = i; j < i + 6 && j < items.length; j++) {
            carouselItem += `
            <div class="col-md-2">
                <div class="text-center mb-1">
                <img class=" img-fluid w-75 h-100" src="https://image.tmdb.org/t/p/w500/${items[j].poster_path}" alt="Movie Poster">
                <h5>${items[j].title}</h5>
                <a target="_blank" href="https://www.justwatch.com/us/search?q=${items[j].title}" class="btn btn-secondary mt-2">Watch Movie</a>
                </div>
            </div>
            `;
        }
        carouselItem += '</div></div>';

        $('#movies').append(carouselItem)
    }
}

function renderBooks(response) {

    const items = [...response.items]
    let placeHldr = 'https://via.placeholder.com/150'

    for (let i = 0; i < items.length; i += 6) {
        let carouselItem = `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row justify-content-center">`;
        for (let j = i; j < i + 6 && j < items.length; j++) {
            let bookImg1 = (items[j].volumeInfo.imageLinks) ? items[j].volumeInfo.imageLinks.thumbnail : placeHldr;
            carouselItem += `
            <div class="col-md-2">
                <div class="text-center">
                <img class=" img-fluid w-75 h-100" src="${bookImg1}" alt="Book cover">
                <h5>${items[j].volumeInfo.title}</h5>
                <a target="_blank" href="${items[j].volumeInfo.previewLink}" class="btn btn-secondary">Read Book</a>
                </div>
            </div>
            `;
        }
        carouselItem += '</div></div>';


        $('#books').append(carouselItem)
    }
    // const container = document.getElementById('books')
    // container.innerHTML = ''
    // let placeHldr = 'https://via.placeholder.com/150'

    // for (var i = 0; i < response.items.length; i++) {
    //     let item = response.items[i]
    //     let viewUrl = item.volumeInfo.previewLink

    //     let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;
    //     container.innerHTML += `
    //         <div class="col-md-6">
    //             <div class="card" style="">
    //                 <h3>${item.volumeInfo.title}</h3>
    //                 <img src="${bookImg1}" class="card-img" alt="Book cover">
    //                 <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
    //                 <button class="btn btn-secondary result-item" onclick = "saveItem(this,'book')">Favorite</button> 
    //             </div>
    //         </div>
    //     `
    // }

}

function saveItem(element, type) {
    console.log(element, type);
    const itemName = $(element).closest('.card').find('h3').text();
    const imgUrl = $(element).closest('.card').find('img')[0].attributes.src.nodeValue
    console.log(imgUrl);
    saveToFavorite({
        itemType: type,
        itemName: itemName,
        itemData: JSON.stringify({ name: itemName, values: [1, 2, 3, 4, '5', '6'] }),
        itemImg: imgUrl
    })
}

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

function getFavorites(type = 'all') {
    return $.ajax({
        url: `api/users/getFavorites?type=${type}`,
        method: 'GET',
        contentType: 'application/json'
    }).then((res) => {
        console.log('getFavorites', res);
        return res;
    }).catch(err => console.log(err));
}


function deleteFavorite(btn, id) {
    console.log('deleteFavorite', id, btn)
    $.ajax({
        url: 'api/users/deleteFavorite',
        data: { itemId: id },
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
                <h3>${itemName || 'Undefined'}</h3>
                <img src = "${item.itemImg} "> 
                <p>${itemType}</p>
                <p>${id}</p>
                <button onclick="deleteFavorite(this, ${id})">Delete</button>
            </div>
        `
    })
}

async function handleBtn(btn) {
    console.log('button clicked', btn.value)
    const items = await getFavorites(btn.value)
    console.log('items', items)
    renderFavorites(items)
}

async function searcher(queryParams) {
    if (queryParams.length == 0) { return }
    try {
        const { movieData, bookData } = await $.ajax({
            url: 'api/external',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query: queryParams.trim() })
        })

        $('#movie-content').empty();
        $('#movie-content').html(`
            <h3 class="mb-2 car-head" style=" --fw:900">Movies</h3>
            <div id="carouselMovieControls" class="carousel slide" data-ride="carousel" data-interval="false">
                <div class="carousel-inner" id="movies">
                </div>
                <a class="carousel-control-prev d-flex justify-content-start" href="#carouselMovieControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next d-flex justify-content-end" href="#carouselMovieControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        `);
        
        $('#book-content').empty();
        $('#book-content').html(`
            <h3 class="mb-2 car-head" style=" --fw:900">Books</h3>
            <div id="carouselBooksControls" class="carousel slide" data-ride="carousel" data-interval="false">
                <div class="carousel-inner" id="books">
                </div>
                <a class="carousel-control-prev d-flex justify-content-start" href="#carouselBooksControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next d-flex justify-content-end" href="#carouselBooksControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        `);


        renderBooks(bookData)
        renderMovies(movieData)
    } catch (err) {
        showMessageInModal(err)
    }
}

function searchInput(e) {
    const query = document.querySelector('#searchBar').value
    if (e.key && e.key === 'Enter') {
        e.preventDefault()
        searcher(query)
    }
}

function searchBtn(e) {
    e.preventDefault()
    const query = document.querySelector('#searchBar').value
    searcher(query)
}

function showMessageInModal(message) {
    const modalBody = document.querySelector('.message');
    modalBody.textContent = message;
    $('#exampleModal').modal('show');
}


function sendResetEmail(e) {
    e.preventDefault()
    const email = document.querySelector('#email-login').value
    $.ajax({
        url: 'api/token/email_token',
        data: { email: email },
        method: 'POST'
    }).then((res) => {
        console.log(res)
        window.location.replace('/passwordresetform')
    }).catch(err => {
        console.log(err)
        showMessageInModal(err.responseJSON.message)
    })
}

function updatePassword(e) {
    e.preventDefault()
    const email = document.querySelector('#email').value
    const token = document.querySelector('#validation-input').value
    const newPassword = document.querySelector('#new-password').value
    const repeatNewPassword = document.querySelector('#repeat-new-password').value

    // checking if any of the fields are empty
    if ([token, newPassword, repeatNewPassword].some(item => item.length === 0)) {
        showMessageInModal('Missing value')
    }
    // checking if the new password and repeat password match
    if (newPassword != repeatNewPassword) {
        showMessageInModal('Passwords dont match!')
    }

    $.ajax({
        url: '/updatepassword',
        data: { email, token, newPassword },
        method: 'PUT'
    }).then((res) => {
        console.log(res)
        window.location.replace('/login')
    }).catch(err => console.log(err))
}