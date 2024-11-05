/* PARA INGRESAR INFORMACION DE CONTACTO: */
/* AL SELECCIONAR UNA OPCION MUESTRA MAS ESPACIO DE REGISTRO */
document.addEventListener('DOMContentLoaded', function() {
    const entityTypeSelect = document.getElementById('Opciones');
    const orgInfo = document.getElementById('Info_Org');

    // Asegurarnos de que el contenedor de la organización esté oculto al cargar la página
    orgInfo.style.display = 'none';

    // Evento que escucha cuando cambia la selección
    entityTypeSelect.addEventListener('change', function() {
        if (entityTypeSelect.value === 'organization') {
            // Mostrar la sección si se selecciona "Organización"
            orgInfo.style.display = 'block';
        } else {
            // Ocultar la sección si se selecciona "Persona Individual"
            orgInfo.style.display = 'none';
        }
    });
});