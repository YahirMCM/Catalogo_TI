document.addEventListener('DOMContentLoaded', () => {
    const customerType = document.getElementById('customerType');
    const individualFields = document.getElementById('individualFields');
    const organizationFields = document.getElementById('organizationFields');
    const commonFields = document.getElementById('commonFields'); 
    const totalAmount = document.getElementById('totalAmount');
    const generatePdfButton = document.getElementById('generatePdf');
    const sendPdfButton = document.getElementById('sendpdf'); // Botón de "Enviar por correo"
    const itemsContainer = document.getElementById('items');
    const totalDespuesIVA = document.getElementById('totalDespuesIVA');

    console.log(window.transaccion);

    document.getElementById("generar-factura").addEventListener("click", function() {
        window.location.href = "https://yahirmcm.github.io/Catalogo_TI/pago.html"; 
    });

    // Inicialmente deshabilitar los botones
    generatePdfButton.disabled = true;
    sendPdfButton.disabled = true;

    // Mostrar campos específicos según el tipo de cliente y verificar campos
    customerType.addEventListener('change', (event) => {
        const value = event.target.value;

        individualFields.style.display = value === 'individuo' ? 'block' : 'none';
        organizationFields.style.display = value === 'organizacion' ? 'block' : 'none';
        commonFields.style.display = value ? 'block' : 'none';

        actualizarEstadoBotones(); // Verificar campos al seleccionar el tipo de cliente
    });

    // Verificación en tiempo real de todos los campos del formulario
    document.querySelectorAll('#invoiceForm input, #invoiceForm select').forEach((input) => {
        input.addEventListener('input', actualizarEstadoBotones);
    });

    function verificarCamposRequeridos() {
        // Verificar campos comunes
        const codigoPostal = document.getElementById('cpostal').value.trim();
        const email = document.getElementById('email').value.trim();
        if (!codigoPostal || !email) return false;

        // Verificar campos específicos según el tipo de cliente
        if (customerType.value === 'individuo') {
            const nombre = document.getElementById('name').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const dni = document.getElementById('dni').value.trim();
            return nombre && apellidos && dni;
        } else if (customerType.value === 'organizacion') {
            const nombreOrg = document.getElementById('orgName').value.trim();
            const rfc = document.getElementById('taxId').value.trim();
            return nombreOrg && rfc;
        }
        return false;
    }

    function actualizarEstadoBotones() {
        const todosCamposLlenos = verificarCamposRequeridos();

        // Habilitar/deshabilitar botón de PDF
        generatePdfButton.disabled = !todosCamposLlenos;
        generatePdfButton.style.backgroundColor = todosCamposLlenos ? "#4CAF50" : "grey";
        generatePdfButton.onclick = todosCamposLlenos ? null : () => alert("Para generar su factura, complete todos los campos requeridos.");

        // Habilitar/deshabilitar botón de enviar por correo
        sendPdfButton.disabled = !todosCamposLlenos;
        sendPdfButton.style.backgroundColor = todosCamposLlenos ? "#4CAF50" : "grey";
        sendPdfButton.onclick = todosCamposLlenos ? null : () => alert("Para enviar la factura, complete todos los campos requeridos.");
    }

    // Cargar productos desde el carrito (resto de la función sin cambios)
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    cargarProductos(carrito);

    function cargarProductos(carrito) {
        itemsContainer.innerHTML = ""; // Limpia el contenedor de items antes de cargar productos
        let total = 0;
        let totalNeto = 0;
        carrito.forEach(item => {
            const productRow = document.createElement('div');
            productRow.classList.add('item');
            productRow.innerHTML = `
                <span>${item.producto} (x${item.cantidad})</span>
                <span>$${item.precio * item.cantidad} MXN</span>
            `;
            itemsContainer.appendChild(productRow);
            total += item.precio * item.cantidad;
        });
        totalAmount.textContent = total.toFixed(1);
        totalNeto = total + (total * 0.16)
        totalDespuesIVA.textContent = totalNeto.toFixed(1);
    }
    console.log(totalNeto);
        window.totalNeto;

    // Generar el PDF con los datos
    generatePdfButton.addEventListener('click', () => {
        if (generatePdfButton.disabled) return;

        // Acá validamos todos los campos
            // Obtener los valores de los campos
            const nom = document.getElementById('name').value;
            const appm = document.getElementById('apellidos').value;
            const rfc1 = document.getElementById('dni').value;
            const codigoPostal = document.getElementById('cpostal').value;
            const correo = document.getElementById('email').value;
            const nomOrg = document.getElementById('orgName').value;
            const rfcMoral = document.getElementById('taxId').value;
            console.log("Valida");
    
            // Variable para acumular mensajes de error
            let errores = [];

            const nomApRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/;
            const rfcRegex = /^[A-Z0-9]{13}$/i;
            const correoRegex = /^[\w._%+-]+@[a-zA-Z0-9.-]+\.(com|edu\.mx)$/;
            const codigoPostalRegex = /^[0-9]{5}$/;

            if (customerType.value === 'individuo') {
                // Validación de Nombre - Menos de 60 caracteres
                if (!nomApRegex.test(nom)) {
                    errores.push("El Nombre debe tener solamente letras");
                }
        
                // Validación de Apellidos - Menos de 80 caracteres
                if (!nomApRegex.test(appm)) {
                    errores.push("Los Apellidos deben tener solamente letras");
                }
        
                // Validación de RFC - Exactamente 13 caracteres alfanuméricos
                if (!rfcRegex.test(rfc1)) {
                    errores.push("El RFC debe contener 13 caracteres alfanuméricos.");
                }
            } else if (customerType.value === 'organizacion')
            {
                // Validación de Nombre de Organización - Menos de 80 caracteres
                if (!nomApRegex.test(nomOrg)) {
                    errores.push("Los Apellidos deben tener solamente letras");
                }
        
                // Validación de RFC - Exactamente 13 caracteres alfanuméricos
                if (!rfcRegex.test(rfcMoral)) {
                    errores.push("El RFC debe contener 13 caracteres alfanuméricos.");
                }
            }
    
            // Validación de Código Postal - 5 caracteres numéricos
            if (!codigoPostalRegex.test(codigoPostal)) {
                errores.push("El Código Postal debe tener 5 digitos.");
            }
            // Validación de Correo Electrónico - Contiene "@" y termina en ".com" o ".edu.mx"
            if (!correoRegex.test(correo)) {
                errores.push("El Correo Electrónico no es válido.");
            }
            // Mostrar errores si existen
            if (errores.length > 0) {
                alert("Errores en los campos:\n" + errores.join("\n"));
                console.log("Errores en los campos:\n" + errores.join("\n"));
                return; // Detener ejecución si hay errores
            }

        const customerData = customerType.value === 'individuo'
            ? {
                type: 'Individuo',
                name: document.getElementById('name').value,
                apellidos: document.getElementById('apellidos').value,
                dni: document.getElementById('dni').value
            }
            : {
                type: 'Organización',
                name: document.getElementById('orgName').value,
                taxId: document.getElementById('taxId').value
            };

        const postalCode = document.getElementById('cpostal').value;
        const email = document.getElementById('email').value;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 20;

        // Aquí generé el número de transacción
        //const trans = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
        const trans = window.transaccion;
        // Luego remplazar por nuestro número de cuenta o paypal donde depositar
        const noCuenta = "1234 5678 1234 5678";

        // Encabezado
        doc.setFontSize(22);
        doc.text("Factura de Compra", 105, y, { align: "center" });
        y += 15;

        // Línea divisora
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 10;

        // Fecha
        const fecha = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Fecha: ${fecha}`, 10, y);
        y += 10;

        // Datos del cliente
        doc.setFontSize(16);
        doc.text("Datos del Cliente:", 10, y);
        y += 8;

        doc.setFontSize(12);
        doc.text(`Tipo de Cliente: ${customerData.type}`, 10, y);
        y += 8;
        doc.text(`Nombre: ${customerData.name}`, 10, y);
        y += 8;

        if (customerData.apellidos) {
            doc.text(`Apellidos: ${customerData.apellidos}`, 10, y);
            y += 8;
        }

        if (customerData.dni || customerData.taxId) {
            doc.text(`RFC: ${customerData.dni || customerData.taxId}`, 10, y);
            y += 8;
        }

        doc.text(`Código Postal: ${postalCode}`, 10, y);
        y += 8;
        doc.text(`Correo: ${email}`, 10, y);
        y += 15;

        // Línea divisora
        doc.line(10, y, 200, y);
        y += 10;

        // Tabla de Productos
        doc.setFontSize(14);
        doc.text("Detalles del Pedido:", 10, y);
        y += 10;

        // carrito.forEach((item, index) => {
        //         const text = `${index + 1}. ${item.producto} \t-\t Cantidad: ${item.cantidad} \t- $${item.precio * item.cantidad} MXN`;
        //         doc.text(text, 10, y);
        //         y += 10;
        //     });

        carrito.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.producto}`, 10, y);
            doc.text(`Cantidad: ${item.cantidad}`, 90, y);
            doc.text(`$${(item.precio * item.cantidad).toFixed(2)} MXN`, 170, y, { align: "right" });
            y += 10;
        });

        // Línea divisora
        y += 10;
        doc.line(10, y, 200, y);
        y += 10;

        // Total antes de impuestos y con IVA
        doc.setFontSize(16);
        doc.text("Detalles de su compra:", 10, y);
        y += 10;

        doc.setFontSize(14);
        doc.text(`Total antes de impuestos: $${totalAmount.textContent} MXN`, 10, y);
        y += 10;
        doc.text("IVA: 16%", 10, y);
        y += 10;
        doc.text(`Total: $${totalDespuesIVA.textContent} MXN`, 10, y);
        y += 20;

        // Información de Transacción y Pago
        doc.setFontSize(16);
        doc.text("Detalles para pago en banco:", 10, y);
        y += 10;
        doc.setFontSize(14);
        doc.text(`Número de transacción: ${trans}`, 10, y);
        y += 10;
        doc.text(`Realizar pago a número de cuenta: ${noCuenta}`, 10, y);

        // Descargar el PDF
        doc.save("Factura_DTT.pdf");

        // ANTIGUO PDF POR SI SE REQUIERE ALGO DE AHÍ

        // // Encabezado del PDF
        // doc.setFontSize(22);
        // doc.text("Factura de Compra", 105, y, { align: "center" });
        // y += 10;

        // // Fecha
        // const fecha = new Date().toLocaleDateString();
        // doc.setFontSize(12);
        // doc.text(`Fecha: ${fecha}`, 10, y);
        // y += 10;

        // // Datos del cliente
        // doc.setFontSize(16);
        // doc.text(`Tipo de Cliente: ${customerData.type}`, 10, y);
        // y += 10;
        // doc.text(`Nombre: ${customerData.name}`, 10, y);
        // y += 10;
        
        // if (customerData.apellidos) {
        //     doc.text(`Apellidos: ${customerData.apellidos}`, 10, y);
        //     y += 10;
        // }

        // if (customerData.dni || customerData.taxId) {
        //     doc.text(`RFC: ${customerData.dni || customerData.taxId}`, 10, y);
        //     y += 10;
        // }

        // doc.text(`Código Postal: ${postalCode}`, 10, y);
        // y += 10;
        // doc.text(`Correo: ${email}`, 10, y);
        // y += 10;

        // // Productos del carrito
        // doc.setFontSize(14);
        // carrito.forEach((item, index) => {
        //     const text = `${index + 1}. ${item.producto} - Cantidad: ${item.cantidad} - $${item.precio * item.cantidad} MXN`;
        //     doc.text(text, 10, y);
        //     y += 10;
        // });

        // // Total
        // y += 10;
        // doc.setFontSize(16);
        // doc.text(`Total antes de impuestos: $${totalAmount.textContent} MXN`, 10, y); y += 10;
        // doc.text(`IVA: 16%`, 10, y); y += 10;
        // doc.text(`Total: $${totalDespuesIVA.textContent} MXN`, 10, y); y += 20;
        // doc.text(`Número de transacción: ${trans}`, 10, y); y += 10;
        // doc.text(`Realizar pago a número de cuenta: ${noCuenta}`, 10, y);
        // // Descargar el PDF
        // doc.save("Factura_DTT.pdf");
    });
});