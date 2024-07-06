document.addEventListener('DOMContentLoaded', function() {
    var redirectToElement = document.getElementById('registroContactosURL');
    console.log('Elemento de redirección:', redirectToElement);

    document.getElementById('registroContactosLink').addEventListener('click', function(event) {
        event.preventDefault();

        var username = prompt('Ingrese su usuario:');
        var password = prompt('Ingrese su clave:');

        if (validateCredentials(username, password)) {
            var redirectTo = redirectToElement ? redirectToElement.value : null;
            console.log('Redirigiendo a:', redirectTo);
            if (redirectTo) {
                window.location.href = redirectTo;
            } else {
                alert('URL de redirección no encontrada.');
            }
        } else {
            alert('Usuario o clave incorrectos. Intente de nuevo.');
        }
    });
});

function validateCredentials(username, password) {
    // Lista de usuarios y contraseñas predefinidos
    const users = {
        '': '',
        'user1': 'password1',
        'user2': 'password2'
    };

    // Validar si el usuario y la contraseña coinciden
    return users[username] === password;
}
