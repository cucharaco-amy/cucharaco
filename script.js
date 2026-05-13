const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1AqF13kEZrUyiqZ-Dgrmthn7t3xqz7ogv1deQsnPUtHWwQp9XxINjsIPlp_LhdQgA/exec";

async function verificarCupo() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        const popup = document.getElementById('popupCupo');
        const titulo = document.getElementById('popupTitulo');
        const mensaje = document.getElementById('popupMensaje');
        const accion = document.getElementById('popupAccion');
        const linkInscripcion = document.querySelector('a[href="inscripcion.html"]');

        popup.style.display = 'block';

        if (data.disponible) {
            titulo.innerText = "¡Prueba Piloto Abierta!";
            mensaje.innerText = `Estamos buscando a nuestros primeros 10 clientes. ¡Aún quedan cupos disponibles para unirte a Cuchara & Co.!`;
            accion.innerHTML = `<a href="inscripcion.html" class="btn-primary">INSCRIBIRME AHORA</a>`;
        } else {
            titulo.innerText = "Cupos Completados";
            mensaje.innerText = "Gracias por el interés. Por el momento hemos cubierto el cupo de la prueba piloto. Suscríbete para enterarte de la próxima apertura.";
            accion.innerHTML = `<button onclick="cerrarPopup()" class="btn-primary">ENTENDIDO</button>`;
            
            // Deshabilitar el acceso a inscripción
            if (linkInscripcion) {
                linkInscripcion.style.opacity = "0.5";
                linkInscripcion.style.pointerEvents = "none";
                linkInscripcion.innerText = "Inscripción (Cerrada)";
            }
        }
    } catch (error) {
        console.error("Error al verificar cupo:", error);
    }
}

function cerrarPopup() {
    document.getElementById('popupCupo').style.display = 'none';
}
/* --- LÓGICA DE CAMBIO DE MENÚ (CUCHARA & CO) --- */

/**
 * Abre el modal de cambio de menú verificando que sea antes del miércoles 20:00 hs.
 * Se asume que el cambio es para la semana siguiente o corriente según el corte.
 */
function abrirModalCambio(e) {
    if (e) e.preventDefault();
    
    const ahora = new Date();
    const diaSemana = ahora.getDay(); // 0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles...
    const hora = ahora.getHours();

    // Lógica de cierre: Miércoles (3) a las 20:00 hs.
    // Bloquea si: Es miércoles después de las 20, o es Jueves(4), Viernes(5), Sábado(6) o Domingo(0).
    const esPasadoMiercoles = (diaSemana === 3 && hora >= 20) || (diaSemana > 3) || (diaSemana === 0);

    if (esPasadoMiercoles) {
        alert("El sistema de cambios de menú está cerrado. Los cambios se aceptan únicamente hasta los miércoles a las 20:00 hs sin excepción.");
        return;
    }

    const modal = document.getElementById('modalCambioMenu');
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * Cierra el modal de cambio de menú
 */
function cerrarModalCambio() {
    const modal = document.getElementById('modalCambioMenu');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Recopila los datos y envía la solicitud por WhatsApp
 */
function enviarCambioWhatsApp() {
    const nombre = document.getElementById('cambioNombre').value.trim();
    const plato = document.getElementById('cambioPlato').value;

    if (!nombre || !plato) {
        alert("Por favor, completa el nombre y selecciona un plato.");
        return;
    }

    // Formateo del mensaje para WhatsApp
    const mensaje = `*Solicitud de Cambio de Menú - Cuchara %26 Co*%0A` +
                    `*Alumno/Particular:* ${nombre}%0A` +
                    `*Nuevo Plato elegido:* ${plato}%0A` +
                    `*Costo adicional:* $3.750%0A%0A` +
                    `_Solicitud enviada dentro del plazo establecido (Miércoles 20:00 hs)._`;

    // Número de contacto de Cuchara & Co
    const telefono = "5491131445518";
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
    
    cerrarModalCambio();
}

// Cerrar modal si el usuario hace clic fuera de la caja blanca
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalCambioMenu');
    if (event.target == modal) {
        cerrarModalCambio();
    }
});
// Ejecutar al cargar la página
window.onload = verificarCupo;
