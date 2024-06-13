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
function renderMovies(res)  {
    const items = [...res.results]
    items.forEach(item => {
        const imgUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : '/img/placeholder.png'
        $('#movies').append(`
            <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2 p-3 mb-3">
                <div class="card-item">
                    <h4 class="card-title">${item.title || 'Unknown'}</h4>
                    <img src="${imgUrl}" alt="Book cover for ${item.title || 'unknown'}">
                    <button class="btn btn-primary result-item" onclick="saveItem(this,'movie')">Add to Favorite</button> 
                    <a class="action-btn btn border text-white" target="_blank" href="https://www.justwatch.com/us/search?q=${item.title}" class="btn btn-secondary">Watch Movie</a>
                </div>
            </div>
        `)
    })
}

function renderBooks(response) {

    const container = document.getElementById('books')
    container.innerHTML = ''
    let placeHldr = 'https://via.placeholder.com/150'

    for (var i = 0; i < response.items.length; i++) {
        let item = response.items[i]
        let viewUrl = item.volumeInfo.previewLink

        let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;
        container.innerHTML += `
            <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2 p-3 mb-3">
                <div class="card-item">
                    <h4 class="card-title">${item.volumeInfo.title}</h4>
                    <img src="${bookImg1}" alt="Book cover for ${item.volumeInfo.title}">
                    <button class="btn btn-primary result-item" onclick="saveItem(this,'book')">Add to Favorite</button> 
                    <a class="action-btn btn border text-white" target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
                </div>
            </div>
        `
    }
}

function saveItem (element, type) {
    $(element).text('Saved')
    $(element).attr('disabled', true)

    const itemName = $(element).closest('.card').find('.card-title').text();
    const imgUrl =  $(element).closest('.card').find('img')[0].attributes.src.nodeValue
    const actionBtnStr = $(element).closest('.card').find('.action-btn').prop('outerHTML')
    
    saveToFavorite({
        itemType: type,
        itemName: itemName,
        itemData: JSON.stringify({ "actionBtnStr": actionBtnStr }),
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

function deleteFavorite(btn, id ) {
    console.log('deleteFavorite', id, btn)
    $.ajax({
        url: 'api/users/deleteFavorite',
        data: { itemId: id},
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
    console.log('renderFavorites', items)

    if (!items.length) {
        $('#main-content').html(`
            <div class="col-12 py-2 jcc">
                <span class="horizontal-divider"></span>
                <h3>No Favorites Saved</h3>
            </div>
        `)
        return
    }

    const container = $('#main-content')[0]
    container.innerHTML = `
        <div class="col-12 py-2">
            <span class="horizontal-divider"></span>
            <h3>Favorites</h3>
            <div id="fav-container" class="row"></div>
        </div>
    `

    items.forEach(item => {
        const { id, itemType, itemName, itemData } = item
        const actionBtnStr = JSON.parse(itemData).actionBtnStr || '<button class="btn border text-white disabled">Open</button>'
        $('#fav-container').append(`
            <div class="card col-sm-6 col-md-4 col-lg-3 col-xl-2 p-3 mb-3">
                <div class="card-item">
                    <h4>${itemName || 'Undefined'}</h4>
                    <img src="${item.itemImg}" alt="Cover for ${item.itemImg}">
                    ${actionBtnStr}
                    <button class="btn btn-secondary" onclick="deleteFavorite(this, ${id})">Remove</button>
                </div>
            </div>
        `)
    })
}

async function handleBtn(btn){
    console.log('button clicked', btn.value)
    const items = await getFavorites(btn.value)
    console.log('items', items)
    renderFavorites(items)
}

async function searcher(queryParams) {
    if( queryParams.length == 0 ) {return} 
    try {
        const { movieData, bookData } = await $.ajax({
            url: 'api/external',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ query: queryParams.trim() })
        }).catch(err => showMessageInModal(err) )

        $('#main-content').empty();
        $('#main-content').html(`
            <div class="col-12 pt-2 jcc"><h3 class="m-0">Search Results for: ${queryParams}</h3></div>
            <div class="col-12 py-2">
                <span class="horizontal-divider"></span>
                <h3>Books</h3>
                <div id="books" class="row"></div>
            </div>

            <div class="col py-2">
                <span class="horizontal-divider"></span>
                <h3>Movies</h3>
                <div id="movies" class="row"></div>
            </div>
        `)

        renderBooks(bookData)
        renderMovies(movieData)
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
    const modalBody = document.querySelector('.message');
    modalBody.textContent = message;
    $('#exampleModal').modal('show'); 
}

function sendResetEmail(e){
    e.preventDefault()
    const email = document.querySelector('#email-login').value
    $.ajax({
        url: 'api/token/email_token',
        data: { email: email},
        method: 'POST'
    }).then((res) => {
        console.log(res)
        window.location.replace('/passwordresetform')
    }).catch(err => {
        console.log(err)
        showMessageInModal(err.responseJSON.message)
    })
}

function updatePassword(e){
    e.preventDefault()
    const email = document.querySelector('#email').value
    const token = document.querySelector('#validation-input').value
    const newPassword = document.querySelector('#new-password').value
    const repeatNewPassword = document.querySelector('#repeat-new-password').value

    // checking if any of the fields are empty
    if([token, newPassword, repeatNewPassword].some(item => item.length === 0)){
        showMessageInModal('Missing value')
    }
    // checking if the new password and repeat password match
    if(newPassword!=repeatNewPassword){
        showMessageInModal('Passwords dont match!')
    }

    $.ajax({
        url: '/updatepassword',
        data: {email, token, newPassword},
        method: 'PUT'
    }).then((res) => {
        console.log(res)
        window.location.replace('/login')
    }).catch(err => console.log(err))
}

