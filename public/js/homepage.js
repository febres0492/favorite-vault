console.log('homepage.js is connected')

$('#addToFab-form').on('submit', (ev) =>{
    ev.preventDefault()
    const inputs = [...$('#addToFab-form .input')].reduce((acc, input) => {
        acc[input.name] = input.value
        return acc
    }, {})
    console.log('inputs', inputs)

    if(inputs.name){
        $.ajax({
            url: '/api/products/addToFab',
            data: inputs,
            method: 'POST'
        }).then((res) => {
            console.log('res', res)
            window.location.replace('/')
        }).catch(err => console.log(err))
    }
})

