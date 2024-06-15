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

const  placeHldr = '/img/placeholder.png';

const maxChar = 250;
// function to generate the movie cards
function renderMovies(res) {
    if (!res.results.length) {
        $('.movie-header').text(`No Movies Found`)
        return
    }
    const items = [...res.results]

    for (let i = 0; i < items.length; i += 6) {
        let carouselItem = `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row justify-content-center">`;
        for (let j = i; j < i + 6 && j < items.length; j++) {
            const img = items[j].poster_path ? `https://image.tmdb.org/t/p/w500/${items[j].poster_path}` :placeHldr
            let description = items[j].overview ? items[j].overview : items[j].title;

            if (description.length > maxChar) {
                description = description.substring(0,maxChar) + '...';
            }
            carouselItem += `
            <div class="col-md-2">
                <div class="text-center mb-1 cont">
                <img class=" img-fluid image" id="image-size" src="${img}" alt="Movie Poster">
                <div class="overlay">
                <div class="text">${description}</div>
                </div>
                <h4>${items[j].title}</h4>
                <a target="_blank" href="https://www.justwatch.com/us/search?q=${items[j].title}" class="btn btn-secondary mt-2 redir">Watch Movie</a>
                <button class="btn btn-primary result-item redir" onclick="saveItem(this,'movie')">Add to Favorite</button>
                </div>
            </div>
            `;
        }
        carouselItem += '</div></div>';

        $('#movies').append(carouselItem)
    }
}

function renderBooks(response) {
    if (!response.items) {
        $('#books').html(`
            <div class="col-12 py-2 jcc">
                <h3>No Books Found</h3>
            </div>
        `)
        return
    }
    const items = [...response.items]
    for (let i = 0; i < items.length; i += 6) {
        let carouselItem = `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row justify-content-center">`;
        for (let j = i; j < i + 6 && j < items.length; j++) {
            let bookImg1 = (items[j].volumeInfo.imageLinks) ? items[j].volumeInfo.imageLinks.thumbnail : placeHldr;
            let description = items[j].volumeInfo.description ? items[j].volumeInfo.description : items[j].volumeInfo.title;

            if (description.length > maxChar) {
                description = description.substring(0,maxChar) + '...';
            }

            carouselItem += `
            <div class="col-md-2">
                <div class="text-center cont">
                <img class=" img-fluid image" id="image-size" src="${bookImg1}" alt="Book cover">
                <div class="overlay">
                <div class="text">${description}</div>
                </div>
                <h4>${items[j].volumeInfo.title}</h4>
                <a target="_blank" href="${items[j].volumeInfo.previewLink}" class="btn btn-secondary redir">Read Book</a>
                <button class="btn btn-primary result-item redir" onclick="saveItem(this,'book')">Add to Favorite</button>
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

async function saveItem (element, type) {
    
    const description = $(element).closest('.card').attr('data-description')
    const itemName = $(element).closest('.card').find('.card-title').text();
    const imgUrl =  $(element).closest('.card').find('img')[0].attributes.src.nodeValue
    const actionBtnStr = $(element).closest('.card').find('.action-btn').prop('outerHTML')
    const data = { "description": description, "actionBtnStr": actionBtnStr}

    const isSaved = await saveToFavorite({
        itemType: type,
        itemName: itemName,
        itemData: data,
        itemImg: imgUrl
    })

    if (!isSaved) { return }
    $(element).text('Saved')
    $(element).attr('disabled', true)
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

    return $.ajax({
        url: 'api/users/addFavorite',
        data: obj,
        method: 'POST'
    }).then((res) => {
        console.log('saveToFavorite', res)
        return true
    }).catch(err => {
        console.log(err)
        return false
    })
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

function deleteFavorite(btn, id ) {
    $.ajax({
        url: 'api/users/deleteFavorite',
        data: { itemId: id },
        method: 'DELETE'
    }).then((res) => {
        btn.closest('.card').remove()

        const cards = $('#main-content').find('.card').length
        if (!cards) {
            $('#main-content').html(`
                <div class="col-12 py-2 jcc">
                    <span class="horizontal-divider"></span>
                    <h3>No Favorites Saved</h3>
                </div>
            `)
        }
        
    }).catch(err => console.log(err))
}

function renderFavorites(items) {

    if (!items.length) {
        $('#main-content').html(`
            <div class="col-12 py-2 jcc tac" >
                <span class="horizontal-divider"></span>
                <h3 style="--fvw:1; --mt:10;">No Favorites Saved</h3>
            </div>
        `)
        return
    }

    const container = $('#main-content')[0]
    container.innerHTML = `
        <div class="col-12 py-2">
            <span class="horizontal-divider"></span>
            <h2>Favorites</h2>
        </div>
        <div class="col-12 py-2 p-0">
            <div id="fav-container" class="row"></div>
        </div>
    `

    items.forEach((item, i) => {
        const { id, itemType, itemName, itemData } = item
        const actionBtnStr = jsonParser(itemData, 'actionBtnStr', '<button class="btn border text-white disabled">Not Available</button>')
        const description = jsonParser(itemData, 'description', itemName)
        $('#fav-container').append(`
            <div class="card col-12 col-sm-4 col-lg-3 col-xl-2 p-3 mb-3">
                <div class="card-item">
                    <h4>${itemName || 'Undefined'}</h4>
                    <div class="rel description-box">
                        <img src="${item.itemImg}" alt="Cover for ${item.itemImg}">
                        <div class="overlay df jcc">
                            <p class="text">${description}</p>
                        </div>
                    </div>
                    ${actionBtnStr}
                    <button class="btn btn-secondary" onclick="deleteFavorite(this, ${id})">Remove</button>
                </div>
            </div>
        `)
    })
}

async function handleBtn(btn) {
    $('#movie-content').empty();
    $('#book-content').empty();
    console.log('button clicked', btn.value)
    const items = await getFavorites(btn.value)
    $('#searchBar').val('')
    renderFavorites(items)
}

function getPreviousSearchesFromCookies() {
    return $.ajax({
        url: 'api/users/get_prev_searches',
        method: 'GET'
    }).then((res) => {
        return [...res.searches]
    }).catch(err => console.log(err))
}

async function showPreviousSearchDropdown() {
    const searches = await getPreviousSearchesFromCookies()
    if (searches.length == 0) { return }

    $('#prev-search-dropdown').empty()
    searches.forEach(search => {
        $('#prev-search-dropdown').append(`
            <button type="button" class="text-white bg-d1 border-secondary btn btn-sm" onclick="searcher('${search}')">${search}</button>
        `)
    })
}

async function searcher(queryParams) {
    if( queryParams.length == 0 ) {return} 
    try {
        const { movieData, bookData } = await $.ajax({
            url: 'api/external',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query: queryParams.trim() })
        }).catch(err => console.log(err) )

        $('#prev-search-dropdown').empty()
        $('#searchBar').val(queryParams)

        $('#main-content').html(`
            <div class="col-12 pt-4 jcc d-flex aic">
                <h3 class="m-0">Search Results for:</h3>
                <p class="m-0 h3 ml-2 p-1 px-2 rounded bg-d2">${queryParams}</p>
            </div>`)
        $('#movie-content').append(`
            <h3 class="mb-2 car-head" style=" --fw:900">Movies</h3>
            <div id="carouselMovieControls" class="carousel slide" data-ride="carousel" data-interval="false">
                <div class="carousel-inner" id="movies">
                </div>
                <a class="carousel-control-prev d-flex justify-content-start" id="prev" href="#carouselMovieControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next d-flex justify-content-end" id="next" href="#carouselMovieControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
        `);
        
        $('#book-content').empty();
        $('#book-content').html(`
            <h3 class="mb-2 car-head" style=" --fw:900">Books</h3>
            <div id="carouselBooksControls" class="carousel slide" data-ride="carousel" data-interval="false">
                <div class="carousel-inner" id="books">
                </div>
                <a class="carousel-control-prev d-flex justify-content-start" id="prev" href="#carouselBooksControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next d-flex justify-content-end" id="next" href="#carouselBooksControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        `);


        renderMovies(movieData)
        renderBooks(bookData)
    } catch (err) {
        console.error('searcher', err)
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
    $('.modal-body').empty();
    $('.modal-body').html(`
        <div class="col-12 py-2 jcc">
            <h3>${message}</h3>
        </div>
    `)
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
        window.location.replace('/login')
    }).catch(err => console.log(err))
}

function loadPasswordForm(e){
    e.preventDefault()
    $('.modal-header').empty();
    $('.modal-body').html(`
        <div class="col-12 py-2 jcc">
            <h3>Reset Password</h3>
            <form id="reset-password-form">
                <div class="form-group ">
                    <label for="current-password">Current Password</label>
                    <input type="password" class="form-control" id="current-password" placeholder="Enter current password" required>
                </div>
                <div class="form-group ">
                    <label for="new-password">New Password</label>
                    <input type="password" class="form-control" id="new-password" placeholder="Enter new password" required>
                </div>
                <div class="form-group ">
                    <label for="repeat-new-password">Repeat New Password</label>
                    <input type="password" class="form-control" id="repeat-new-password" placeholder="Repeat new password" required>
                </div>
                <button type="button" class="submit-btn btn btn-primary">Submit</button>
            </form>
        </div>
    `)

    $('#exampleModal').modal('show')

    $('.submit-btn').on('click', ()=>{

        $('.modal-header').empty();

        const currentPassword = document.querySelector('#current-password').value
        const newPassword = document.querySelector('#new-password').value
        const repeatNewPassword = document.querySelector('#repeat-new-password').value
    
        if(newPassword!=repeatNewPassword){
            $('.modal-header').empty();
            $('.modal-header').html(`<h4 class="modal-title text-warning">New Password and Repeat Password do not match!</h4>`)
            return
        }

        $.ajax({
            url: '/api/users/update_password',
            data: {currentPassword, newPassword, 'email': $('#email').text()},
            method: 'PUT'
        }).then((res) => {
            showMessageInModal('Password Updated!')
        }).catch(err => {
            setTimeout(() => {
                $('.modal-header').empty();
                $('.modal-header').html(`<h4 class="modal-title text-warning">${err.responseJSON.message}</h4>`)
            }, 1000)
            
        })
    })
}

function jsonParser(jsonStr, key, fallback) {
    try {
        return JSON.parse(jsonStr)[key]
    } catch (err) {
        return fallback
    }
}
