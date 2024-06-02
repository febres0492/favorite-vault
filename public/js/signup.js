
$('#signup-form').on('submit', function(event) {
    event.preventDefault()
    const name = $('#name-signup').val().trim()
    const lastname = $('#last-name-signup').val().trim()
    const email = $('#email-signup').val().trim()
    const password = $('#password-signup').val().trim()
    const repeatPassword = $('#repeat-password-signup').val().trim()

    if (password !== repeatPassword) {
        alert('Passwords do not match')
        return
    }
    if (name && email && password) {
        $.ajax({
            url: '/api/users/signup',
            data: { name, lastname, email, password },
            method: 'POST'
        }).then(() => {

            
            // window.location.replace('/')
        }).catch(err => console.log(err))
    }
})
