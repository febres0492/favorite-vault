
function handleUrlParamsMessage() {
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('msg')

    if (message == 0) {
        showMessageInModal('Page not found! Redirecting to homepage...')
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

handleUrlParamsMessage()
handleDropdown()