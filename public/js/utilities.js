// https://api.themoviedb.org/3/discover/movie?api_key=6a32bb149099b8ab14f8d9eb9434cc27

const movieGetter = async () => {
    console.log('movieGetter');
    $.ajax({
        url: 'https://api.themoviedb.org/3/discover/movie?api_key=6a32bb149099b8ab14f8d9eb9434cc27',
        method: 'GET'
    }).then((res) => {
        console.log('res', res)
        const items = [...res.results]
        items.forEach(item => {
        $('#main-content').append(`<div class=" my-5 border">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}" alt="Movie Poster">
            <h4>${item.original_title}</h4>
            <button>Favorite</button>
</div>
`)
        })
    }).catch(err => console.log(err))
}


movieGetter();

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

// -----------------------------------------------------------

const B_APIKEY = 'AIzaSyDPW7iG7UbDW8ap3Zkzsk72KuLSEw5AlRA'

//Create functions for google books apis

let placeHldr = '<img src="https://via.placeholder.com/150">';
       
function handleResponse(response) {
 
for (var i = 0; i < response.items.length; i++) {
  let item = response.items[i];
  let viewUrl = item.volumeInfo.previewLink
  // in production code, item.text should have the HTML entities escap ed.
  document.getElementById("content").innerHTML += "<br>" + item.volumeInfo.title + "<br>" ;
  let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr ;
  document.getElementById("content").innerHTML += "<br>" +  `<div class="card" style="">
   <div class="row no-gutters">
     <div class="col-md-4">
       <img src="${bookImg1}" class="card-img" alt="...">
       <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
       <a target="_blank"  class="btn btn-secondary" id="favorite-btn">Favorite</a>

     </div>`
 
}
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


const savetoFavorites = () =>{
    console.log("This link will be saved to favorites")
    //Save the link to the database



}
document
    .querySelector('#search-button')
    .addEventListener('click', searchFormHandler);
// document.querySelector('#favorite-btn').addEventListener('click', savetoFavorites);
