
$('#signup-form').on('submit', function(event) {
    event.preventDefault()
    const name = $('#name-signup').val().trim()
    const lastname = $('#last-name-signup').val().trim()
    const name_lastname = name + ' ' + lastname
    const email = $('#email-signup').val().trim()
    const password = $('#password-signup').val().trim()
    const repeatPassword = $('#repeat-password-signup').val().trim()

    if (password !== repeatPassword) {
        alert('Passwords do not match')
        return
    }
    if (name_lastname && email && password) {
        $.ajax({
            url: '/api/users/signup',
            data: { name_lastname, email, password },
            method: 'POST'
        }).then((res) => {
            console.log('res', res)
            window.location.replace('/')
        }).catch(err => console.log(err))
    }
})
