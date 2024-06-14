const loginFormHandler = (event) => {
    event.preventDefault();

    const email = $('#email-login').val().trim();
    const password = $('#password-login').val().trim();

    if (email && password) {
        $.ajax({
            url: '/api/users/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                document.location.replace('/');
            },
            error: function(xhr, status, error) {
                console.log('loging.js');
                showMessageInModal('Incorrect username or password');
            }
        });
    }
};

$('.login-form').on('submit', loginFormHandler);


// const loginFormHandler = async (event) => {
//     event.preventDefault();

//     const email = document.querySelector('#email-login').value.trim();
//     const password = document.querySelector('#password-login').value.trim();

//     if (email && password) {
//         const response = await fetch('/api/users/login', {
//             method: 'POST',
//             body: JSON.stringify({ email, password }),
//             headers: { 'Content-Type': 'application/json' },
//         });

//         if (response.ok) {
//             document.location.replace('/');
//         } else {
//             console.log('loging.js');
//             showMessageInModal('Incorrect username or password');
//         }
//     }
// };

// document
//     .querySelector('.login-form')
//     .addEventListener('submit', loginFormHandler);
