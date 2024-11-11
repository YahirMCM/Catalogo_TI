document.addEventListener('DOMContentLoaded', function () {
    const iframes = document.querySelectorAll('.youtube-video');

    const videoObserverOptions = {
        root: null,
        threshold: 0.5
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target;

            if (entry.isIntersecting) {
                const videoSrc = iframe.getAttribute('data-src');
                if (!iframe.src) {
                    iframe.src = videoSrc;
                }
            }
        });
    }, videoObserverOptions);

    iframes.forEach(iframe => videoObserver.observe(iframe));

    const productos = document.querySelectorAll('#futuros_productos .producto-card');

    const productosObserverOptions = {
        root: null,
        threshold: 0.2
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