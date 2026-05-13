const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1AqF13kEZrUyiqZ-Dgrmthn7t3xqz7ogv1deQsnPUtHWwQp9XxINjsIPlp_LhdQgA/exec";

// --- 1. LÓGICA DE VERIFICACIÓN DE CUPO (HOME / INSCRIPCIÓN) ---
async function verificarCupo() {
    const popup = document.getElementById('popupCupo');
    if (!popup) return; // Solo ejecutar si existe el elemento en el HTML

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
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
    const popup = document.getElementById('popupCupo');
    if (popup) popup.style.display = 'none';
}

// --- 2. LÓGICA DE CAMBIO DE MENÚ (PÁGINA MENÚ) ---

function abrirModalCambio(e) {
    if (e) e.preventDefault();
    
    const ahora = new Date();
    const diaSemana = ahora.getDay(); // 0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb
    const hora = ahora.getHours();

    // Restricción: Miércoles (3) a las 20:00 hs
    const esPasadoMiercoles = (diaSemana === 3 && hora >= 20) || (diaSemana > 3) || (diaSemana === 0);

    if (esPasadoMiercoles) {
        alert("El plazo para realizar cambios de menú ha cerrado (Miércoles 20:00 hs). Se habilitará nuevamente la próxima semana.");
        return;
    }

    const modal = document.getElementById('modalCambioMenu');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("No se encontró el modal 'modalCambioMenu'");
    }
}

function cerrarModalCambio() {
    const modal = document.getElementById('modalCambioMenu');
    if (modal) modal.style.display = 'none';
}

function enviarCambioWhatsApp() {
    const nombre = document.getElementById('cambioNombre').value.trim();
    const plato = document.getElementById('cambioPlato').value;

    if (!nombre || !plato) {
        alert("Por favor, completa tu nombre y selecciona un plato.");
        return;
    }

    const mensaje = `*Solicitud de Cambio de Menú - Cuchara %26 Co*%0A` +
                    `*Cliente:* ${nombre}%0A` +
                    `*Nuevo Plato:* ${plato}%0A` +
                    `*Costo Adicional:* $3.750%0A%0A` +
                    `_Solicitud enviada según términos de frescura (Cierre Miércoles 20hs)._`;

    const telefono = "5491131445518";
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
    cerrarModalCambio();
}

// --- 3. INICIALIZACIÓN Y EVENTOS GLOBALES ---

window.onload = function() {
    // Solo verificar cupo si estamos en una página que lo requiera
    verificarCupo();
};

// Cerrar modales al hacer clic fuera de la caja blanca
window.addEventListener('click', function(event) {
    const modalCambio = document.getElementById('modalCambioMenu');
    const modalCupo = document.getElementById('popupCupo');
    
    if (event.target === modalCambio) {
        cerrarModalCambio();
    }
    if (event.target === modalCupo) {
        cerrarPopup();
    }
});
