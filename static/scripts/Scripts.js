document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('miFormulario').addEventListener('submit', validarFormulario);
});

function validarFormulario(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    var nombre = document.getElementById('nombre').value.trim();
    var email = document.getElementById('email').value.trim();
    var consulta = document.getElementById('consulta').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var documento = document.getElementById('documento').value.trim();
    var nacionalidad = document.getElementById('nacionalidad').value;
    var sexo = obtenerValorRadio('sexo');
    var opcion_pago = obtenerOpcionesSeleccionadas('opcion_pago');
    var error = document.getElementById('error');

    var mensajesError = [];

    // Validación del nombre
    if (nombre === '') {
        mensajesError.push('Ingresa tu nombre');
    } else if (!/^([a-zA-Z]){3,20}$/.test(nombre)) {
        mensajesError.push('El nombre debe contener solo letras y tener entre 3 y 20 caracteres');
    }

    // Validación del email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mensajesError.push('Ingresa un email válido');
    }

    // Validación de la consulta
    if (consulta === '') {
        mensajesError.push('Ingresa tu consulta');
    } else if (consulta.length < 3 || consulta.length > 20) {
        mensajesError.push('La consulta debe tener entre 3 y 20 caracteres');
    }

    // Validación del teléfono
    if (!/^\d{10,15}$/.test(telefono)) {
        mensajesError.push('El teléfono debe contener solo números y tener entre 10 y 15 caracteres');
    }

    // Validación del documento
    if (!/^\d{8,12}$/.test(documento)) {
        mensajesError.push('El documento debe contener solo números y tener entre 8 y 12 caracteres');
    }

    // Validación de la nacionalidad
    if (nacionalidad === '') {
        mensajesError.push('Elige tu nacionalidad');
    }

    // Validación del género
    if (!sexo) {
        mensajesError.push('Selecciona tu género');
    }

    // Validación de la forma de pago
    if (opcion_pago.length === 0) {
        mensajesError.push('Elige al menos una forma de pago');
    }

    // Mostrar mensajes de error o enviar el formulario
    if (mensajesError.length > 0) {
        error.innerHTML = mensajesError.join(', ');
    } else {
        error.innerHTML = '';
        alert('Todos los datos están listos para enviar.'); // Opcional: muestra una alerta de confirmación
        document.getElementById('miFormulario').submit(); // Envía el formulario si no hay errores
    }
}

function obtenerValorRadio(nombre) {
    var opciones = document.getElementsByName(nombre);
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            return opciones[i].value;
        }
    }
    return null; // Devuelve null si ninguna opción está seleccionada
}

function obtenerOpcionesSeleccionadas(nombre) {
    var opcionesSeleccionadas = [];
    var opciones = document.getElementsByName(nombre);
    for (var i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            opcionesSeleccionadas.push(opciones[i].value);
        }
    }
    return opcionesSeleccionadas;
}
