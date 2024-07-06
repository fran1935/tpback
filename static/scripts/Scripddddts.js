function validarFormulario(event) {
    event.preventDefault(); // Detener el envío del formulario

    // Obtener los valores de los campos
    var nombre = document.getElementById('nombre').value.trim();
    var email = document.getElementById('email').value.trim();
    var documento = document.getElementById('documento').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var consulta = document.getElementById('consulta').value.trim();
    var selectElement = document.getElementById("nacionalidad");
    var opcion_pago = document.getElementsByName("opcion_pago");
    var sexoOptions = document.getElementsByName("sexo");
    var error = document.getElementById('error');

    var mensajesError = [];

    // Validar el nombre
    if (nombre === '') {
        mensajesError.push('Ingresa tu nombre');
    } else {
        var nombreRegex = /^[a-zA-Z]{3,20}$/;
        if (!nombreRegex.test(nombre)) {
            mensajesError.push('El nombre debe contener solo letras y tener entre 3 y 20 caracteres');
        }
    }

    // Validar el email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mensajesError.push('Ingresa un email válido');
    }

    // Validar el teléfono
    if (telefono === '') {
        mensajesError.push('Ingresa tu teléfono');
    } else {
        var telefonoRegex = /^\d{10,15}$/;
        if (!telefonoRegex.test(telefono)) {
            mensajesError.push('El teléfono debe contener solo números y tener entre 10 y 15 caracteres');
        }
    }

    // Validar la consulta
    if (consulta === '') {
        mensajesError.push('Ingresa tu consulta');
    } else if (consulta.length < 3 || consulta.length > 20) {
        mensajesError.push('La consulta debe tener entre 3 y 20 caracteres');
    }

    // Validar el documento
    if (documento === '') {
        mensajesError.push('Ingresa tu Pasaporte/DNI');
    } else {
        var documentoRegex = /^\d{8,12}$/;
        if (!documentoRegex.test(documento)) {
            mensajesError.push('El documento debe contener solo números y tener entre 8 y 12 caracteres');
        }
    }
    
    // } else if (documento.length <= 0 || documento.length > 100) {
    //     mensajesError.push('El mensaje debe tener menos de 100 caracteres');
    // }

    // Validar la nacionalidad
    var selectedOption = selectElement.value;
    if (selectedOption === "Otro" || selectedOption === '') {
        mensajesError.push('Elige tu nacionalidad');
    }

    // Validar la forma de pago
    var paymentSelected = false;
    for (var i = 0; i < paymentOptions.length; i++) {
        if (paymentOptions[i].checked) {
            paymentSelected = true;
            break;
        }
    }
    if (!paymentSelected) {
        mensajesError.push('Elige tu forma de pago');
    }

    // Validar el sexo
    var sexoSelected = false;
    for (var i = 0; i < sexoOptions.length; i++) {
        if (sexoOptions[i].checked) {
            sexoSelected = true;
            break;
        }
    }
    if (!sexoSelected) {
        mensajesError.push('Elige tu sexo');
    }

    // Mostrar errores o enviar el formulario
    if (mensajesError.length > 0) {
        error.innerHTML = mensajesError.join(', ');
    } else {
        error.innerHTML = '';
        alert('Todos los datos están listos para enviar.'); // Mostrar una ventana de confirmación
        document.getElementById('miFormulario').submit(); // Enviar el formulario
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('miFormulario').addEventListener('submit', validarFormulario);
});