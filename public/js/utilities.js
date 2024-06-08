// https://api.themoviedb.org/3/discover/movie?api_key=6a32bb149099b8ab14f8d9eb9434cc27
// movie name:
// https://api.themoviedb.org/3/search/movie?api_key=6a32bb149099b8ab14f8d9eb9434cc27&query=MOVIENAME
// By genre:]
// https://api.themoviedb.org/3/discover/movie?api_key=6a32bb149099b8ab14f8d9eb9434cc27&with_genres=35,53,27
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
const movieApiKey = '6a32bb149099b8ab14f8d9eb9434cc27'
const movieGetter = (e) => {
    e.preventDefault();
    const search = document.querySelector('#myInput').value.trim();
    if(search){
    console.log('movieGetter');
    $.ajax({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&query=${search}`,
        method: 'GET'
    }).then((res) => {
        console.log('res', res)
        const items = [...res.results]
        items.forEach(item => {
        
        $('#movies').append(`

            <br>
            ${item.original_title}
            <br>
            <br>
            <div class="card">
            <div  class="row no-gutters">
            <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w500/${item.poster_path}"  class="card-img" alt="Movie Poster">
            <a target="_blank" href="https://www.justwatch.com/us/search?q=${item.original_title}" class="btn btn-secondary" id="favorite-btn">Watch movie</a>
            <a target="_blank"  class="btn btn-secondary" id="favorite-btn">Favorite</a>
            </div>
            </div>
</div>
`)
        })
    }).catch(err => console.log(err))}
}



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
  document.getElementById("books").innerHTML += "<br>" + item.volumeInfo.title + "<br>" ;
  let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr ;
  document.getElementById("books").innerHTML += "<br>" +  `<div class="card" style="">
   <div class="row no-gutters">
     <div class="col-md-4">
       <img src="${bookImg1}" class="card-img" alt="Book cover">
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
    .addEventListener('click', (e) => {
        $('#movies').empty();
        $('#books').empty();
        searchFormHandler(e); 
        movieGetter(e);
    });

document
        .querySelector('#myInput')
        .addEventListener('keydown', (e) => {
            if(e.key === 'Enter'){
            $('#movies').empty();
            $('#books').empty();
            searchFormHandler(e);
            movieGetter(e);
            }
        });
// document.querySelector('#favorite-btn').addEventListener('click', savetoFavorites);
