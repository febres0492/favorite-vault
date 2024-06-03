function handleUrlParamsMessage() {
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('msg')

    if (message == 0) {
        window.alert('Page not found! Redirecting to homepage...')
    }
}

