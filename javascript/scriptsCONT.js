document.addEventListener('DOMContentLoaded', function() {
    const entityTypeSelect = document.getElementById('Opciones');
    const orgInfo = document.getElementById('Info_Org');

    orgInfo.style.display = 'none';

    entityTypeSelect.addEventListener('change', function() {
        if (entityTypeSelect.value === 'organization') {
            orgInfo.style.display = 'block';
        } else {
            orgInfo.style.display = 'none';
        }
    });
});