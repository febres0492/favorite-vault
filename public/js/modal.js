function showMessageInModal(message) {
    var modalBody = document.querySelector('.modal-body');

    modalBody.textContent = message;

    $('#exampleModal').modal('show'); 
}

