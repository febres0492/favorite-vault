const signin = document.querySelector(".login-card");
const login = document.querySelector('#Log-in');
const formDiv = document.querySelector('.login-card');

const signInHandle = async (e) => {
    e.preventDefault();

    // Gets the input values
    const user_name = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const confirmPass = document.querySelector('#confirm-password').value.trim();


    // Makes sure the form is filled
// Makes sure the form is filled
if (user_name && email && password && confirmPass) {
    if (password === confirmPass) {
        const response = await fetch('user/signin', {
            method: 'POST',
            body: JSON.stringify({ user_name, email, password }),
            headers: { 'Content-type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/list?');
        } else {
            let errMsg = "";
            // Gets the error message from their locations in each response status
            if (response.status === 400) {
                const err = await response.json();
                errMsg = err.message;
            } else {
                const err = await response.json();
                errMsg = err.errors[0].message;
            }

            const errAlert = document.createElement('h5');
            errAlert.classList.add("Error");
            errAlert.textContent = errMsg;
            // Checks if there is already an error message, if there is, it replaces it with the new one
            const repTar = document.querySelector('h5');
            if (repTar) {
                formDiv.replaceChild(errAlert, repTar);
            } else {
                formDiv.appendChild(errAlert);
            }
        }
    } else {
        // Displays an error message if the passwords do not match
        const errAlert = document.createElement('h5');
        errAlert.classList.add("Error");
        errAlert.textContent = `Ensure your passwords match`;
        // Checks if there is already an error message, if there is, it replaces it with the new one
        const repTar = document.querySelector('h5');
        if (repTar) {
            formDiv.replaceChild(errAlert, repTar);
        } else {
            formDiv.appendChild(errAlert);
        }
    }
} else {
    // Displays an error message if the username, email, or password is missing
    const errAlert = document.createElement('h5');
    errAlert.classList.add("Error");
    errAlert.textContent = `Make sure to fill the signin form`;
    // Checks if there is already an error message, if there is, it replaces it with the new one
    const repTar = document.querySelector('h5');
    if (repTar) {
        formDiv.replaceChild(errAlert, repTar);
    } else {
        formDiv.appendChild(errAlert);
    }
}}
    

document.addEventListener("DOMContentLoaded",() => {
    signin.addEventListener('submit',signInHandle);
    login.addEventListener('click', (e) => {
        e.preventDefault();
        document.location.replace('/');
    }
    );
})