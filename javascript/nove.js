document.addEventListener('DOMContentLoaded', function () {
    // --- Reproducción Automática de Videos de YouTube ---
    const iframes = document.querySelectorAll('.youtube-video');

    const videoObserverOptions = {
        root: null, // Usar el viewport como referencia
        threshold: 0.5 // Al menos el 50% del iframe debe ser visible
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target;

            if (entry.isIntersecting) {
                const videoSrc = iframe.getAttribute('data-src');
                if (!iframe.src) {
                    iframe.src = videoSrc; // Asignar src para cargar el video
                }
            }
        });
    }, videoObserverOptions);

    iframes.forEach(iframe => videoObserver.observe(iframe));

    // --- Animación de Futuros Productos al Desplazarse ---
    const productos = document.querySelectorAll('#futuros_productos .producto-card');

    const productosObserverOptions = {
        root: null,
        threshold: 0.2 // Al menos un 20% del producto debe ser visible
    };

    const productosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, productosObserverOptions);

    productos.forEach(producto => {
        producto.style.opacity = 0;
        producto.style.transform = 'translateY(20px)';
        productosObserver.observe(producto);
    });
});