document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".ver-mas");
    const carritoIcono = document.getElementById('emoji_carrito');
    const barraCarro = document.getElementById('barrita');
    const cerrarCarro = document.getElementById('cerrar_carro');
    const carritoOverlay = document.getElementById('capa_carro');
    const botonFactura = document.getElementById("generar-factura");
    const contadorCarrito = document.getElementById("contador-carrito");

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarCarrito();
    actualizarContadorCarrito();

    function actualizarContadorCarrito() {
        const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        if (totalProductos > 0) {
            contadorCarrito.textContent = totalProductos;
            contadorCarrito.style.display = "inline";
        } else {
            contadorCarrito.style.display = "none";
        }
    }

    function agregarAlCarrito(producto, precio) {
        let itemEnCarrito = carrito.find(item => item.producto === producto);

        if (itemEnCarrito) {
            if (itemEnCarrito.cantidad < 5) {
                itemEnCarrito.cantidad++;
            } else {
                alert("Solo puedes agregar un máximo de 5 unidades por producto.");
            }
        } else {
            if (carrito.length < 9) {
                carrito.push({ producto, precio, cantidad: 1 });
            } else {
                alert("No puedes agregar más de 9 productos diferentes en total.");
            }
        }
        actualizarCarrito();
        guardarCarrito();
        actualizarContadorCarrito();
    }

    function actualizarCarrito() {
        const carritoContenido = document.getElementById("carrito-contenido");
        carritoContenido.innerHTML = "";

        carrito.forEach((item, index) => {
            const carritoItem = document.createElement("div");
            carritoItem.innerHTML = `${item.producto} (x${item.cantidad}) - $${item.precio * item.cantidad} MXN 
                <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
            carritoContenido.appendChild(carritoItem);
        });

        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        document.getElementById("total-carrito").innerText = `Total: $${total} MXN`;
    }

    function eliminarDelCarrito(index) {
        let item = carrito[index];
        item.cantidad--;
        if (item.cantidad <= 0) {
            carrito.splice(index, 1);
        }
        actualizarCarrito();
        guardarCarrito();
        actualizarContadorCarrito();
    }

    function eliminarTodoCarrito() {
        carrito = [];
        actualizarCarrito();
        guardarCarrito();
        actualizarContadorCarrito();
    }

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    carritoIcono.addEventListener('click', () => {
        if (barraCarro.classList.contains('open')) {
            barraCarro.classList.remove('open');
            carritoOverlay.classList.remove('open');
        } else {
            barraCarro.classList.add('open');
            carritoOverlay.classList.add('open');
        }
    });

    cerrarCarro.addEventListener('click', () => {
        barraCarro.classList.remove('open');
        carritoOverlay.classList.remove('open');
    });

    carritoOverlay.addEventListener('click', () => {
        barraCarro.classList.remove('open');
        carritoOverlay.classList.remove('open');
    });

    botones.forEach(boton => {
        boton.addEventListener("click", function () {
            const descripcion = boton.previousElementSibling;
            const articulo = boton.closest("article");

            if (descripcion.style.display === "block") {
                descripcion.style.opacity = "0";
                setTimeout(() => {
                    descripcion.style.display = "none";
                }, 300);
                boton.textContent = "Ver más detalles";
                articulo.classList.remove("resaltado");
            } else {
                descripcion.style.display = "block";
                setTimeout(() => {
                    descripcion.style.opacity = "1";
                }, 10);
                boton.textContent = "Ocultar detalles";
                articulo.classList.add("resaltado");
            }
        });

        const descripcion = boton.previousElementSibling;
        descripcion.style.display = "none";
        descripcion.style.transition = "opacity 0.3s ease";
        descripcion.style.opacity = "0";
    });

    if (botonFactura) {
        botonFactura.addEventListener("click", () => {
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            localStorage.setItem('totalFactura', JSON.stringify(total));
            window.location.href = "factura.html";
        });
    }

    window.agregarAlCarrito = agregarAlCarrito;
    window.eliminarDelCarrito = eliminarDelCarrito;
    window.eliminarTodoCarrito = eliminarTodoCarrito;
});