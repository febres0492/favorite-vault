function showMessageInModal(message) {
    var modalTitle = document.getElementById('exampleModalLabel');
    var modalBody = document.querySelector('.modal-body');

    modalTitle.textContent = 'Message';
    modalBody.textContent = message;

    $('#exampleModal').modal('show'); 
}

