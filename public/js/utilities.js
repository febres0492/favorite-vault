
function handleUrlParamsMessage() {
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('msg')

    if (message == 0) {
        window.alert('Page not found! Redirecting to homepage...')
    }
}

function handleDropdown() {
    const dropdown = [...document.querySelectorAll('.dropdown')]
    dropdown.forEach(item => {
        item.addEventListener('click', () => {
            item.querySelector('.dropdown-menu').classList.toggle('show-dropdown')
        })
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

const B_APIKEY = 'AIzaSyDPW7iG7UbDW8ap3Zkzsk72KuLSEw5AlRA'

//Create functions for google books apis

let placeHldr = '<img src="https://via.placeholder.com/150">';
       
function handleResponse(response) {

    const container = document.getElementById('main-content')
    container.innerHTML = ''

    for (var i = 0; i < response.items.length; i++) {
        let item = response.items[i];
        let viewUrl = item.volumeInfo.previewLink
        // in production code, item.text should have the HTML entities escap ed.
        //favorites link

        let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr;
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card" style="">
                    <h3>${item.volumeInfo.title}</h3>
                    <img src="${bookImg1}" class="card-img" alt="...">
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



// let input = document.getElementById("myInput");
// let inputValue = input.value;
// let source = `https://www.googleapis.com/books/v1/volumes?q=${inputValue}&callback=handleResponse`

const searchFormHandler = async (event) => {
    event.preventDefault();
    console.log('This is my API Key' + B_APIKEY)
    const search = document.querySelector('#myInput').value.trim();
    
    if (search ) {
        const request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${B_APIKEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        myResponse =  await request.json()
        console.log(myResponse)
        handleResponse(myResponse)
    }   
   
};


document
    .querySelector('#search-button')
    .addEventListener('click', searchFormHandler);
