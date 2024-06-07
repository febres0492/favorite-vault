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
  //favorites link
 
  
  let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr ;
  document.getElementById("content").innerHTML +=  `
 
  
   
   
     <div class="col-md-4">
     <div class="card" style="">
       <h3>${item.volumeInfo.title}</h3>
       <img src="${bookImg1}" class="card-img" alt="...">
       <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
       <button class="btn btn-secondary result-item" >Favorite</button> 
    </div>
  
     </div>`
 
}


// for (var i = 0; i < response.items.length; i++) {
//     let item = response.items[i];
//     let viewUrl = item.volumeInfo.previewLink
//     // in production code, item.text should have the HTML entities escap ed.
//     //favorites link
//     document.getElementById("")
//     document.getElementById("content").innerHTML += "<br>" + item.volumeInfo.title + "<br>" ;
//     let bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr ;
//     document.getElementById("content").innerHTML += "<br>" +  `<div class="card" style="">
    
//      <div class="row no-gutters">
//        <div class="col-md-4">
//          <img src="${bookImg1}" class="card-img" alt="...">
//          <a target="_blank" href="${viewUrl}" class="btn btn-secondary">Read Book</a>
//          <button class="btn btn-secondary result-item" >Favorite</button> 
  
//        </div>`
   
//   }
const savetoFavorites = () =>{
    console.log("This link will be saved to favorites")
    //Save the link to the database

}
const fav_button =  [...document.querySelectorAll('.result-item')]

fav_button.forEach(btn => {
   btn.addEventListener('click', ()=> {
    console.log($(btn).closest('.card'))
    
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




  


 