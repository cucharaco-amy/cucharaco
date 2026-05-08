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

// Ejecutar al cargar la página
window.onload = verificarCupo;
