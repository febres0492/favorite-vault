const login = document.querySelector('.login-form');
const singin = document.querySelector('#sign-in');
const formDiv = document.querySelector('.login-card');

// Function to log in
const logInHandle = async  (e) => {
e.preventDefault();

// Gets the input values
const email = document.querySelector('#email').value.trim();
const password = document.querySelector('#password').value.trim();

// Checks if both inputs are filled
if(email && password){ 
    const response = await fetch('/user',{
        method:'POST',
        body: JSON.stringify({email, password}),
        headers: {'Content-type': 'application/json'},
    });
    
    // Changes the view to the user account 
    if (response.ok){
        document.location.replace('/list?');
    }else{
        const err = await response.json();
        const errMsg = err.message;
        // Displays an error message if the user is not found
        const errAlert = document.createElement('h5');
        errAlert.classList.add("Error");
        errAlert.textContent = errMsg;
        // Checks if there is already an error message if there is it replaces it for the new one
        const repTar = document.querySelector('h5');
        if(repTar){
            formDiv.replaceChild(errAlert, repTar);
        }else{
            formDiv.appendChild(errAlert);
        }
    }
}else{
        // Displays an error message if the email or password is missing
    const errAlert = document.createElement('h5');
    errAlert.classList.add("Error");
    errAlert.textContent = `Make sure to fill the login form`;
    // Checks if there is already an error message if there is it replaces it for the new one
    const repTar = document.querySelector('h5');
    if(repTar){
        formDiv.replaceChild(errAlert, repTar);
    }else{
        formDiv.appendChild(errAlert);
    }
}
};


// Waits for the page to fully load before adding the event listeners
document.addEventListener("DOMContentLoaded",() => {
    login.addEventListener('submit', logInHandle);
    singin.addEventListener('click', (e) => {
        e.preventDefault();
        document.location.replace('/signin');
    }
    );
})