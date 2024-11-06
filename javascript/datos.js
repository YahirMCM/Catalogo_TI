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
    

    // Generar el PDF con los datos
    generatePdfButton.addEventListener('click', () => {
        if (generatePdfButton.disabled) return;

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

        // Encabezado del PDF
        doc.setFontSize(22);
        doc.text("Factura de Compra", 105, y, { align: "center" });
        y += 10;

        // Fecha
        const fecha = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Fecha: ${fecha}`, 10, y);
        y += 10;

        // Datos del cliente
        doc.setFontSize(16);
        doc.text(`Tipo de Cliente: ${customerData.type}`, 10, y);
        y += 10;
        doc.text(`Nombre: ${customerData.name}`, 10, y);
        y += 10;
        
        if (customerData.apellidos) {
            doc.text(`Apellidos: ${customerData.apellidos}`, 10, y);
            y += 10;
        }

        if (customerData.dni || customerData.taxId) {
            doc.text(`RFC: ${customerData.dni || customerData.taxId}`, 10, y);
            y += 10;
        }

        doc.text(`Código Postal: ${postalCode}`, 10, y);
        y += 10;
        doc.text(`Correo: ${email}`, 10, y);
        y += 10;

        // Productos del carrito
        doc.setFontSize(14);
        carrito.forEach((item, index) => {
            const text = `${index + 1}. ${item.producto} - Cantidad: ${item.cantidad} - $${item.precio * item.cantidad} MXN`;
            doc.text(text, 10, y);
            y += 10;
        });

        // Total
        y += 10;
        doc.setFontSize(16);
        doc.text(`Total antes de impuestos: $${totalAmount.textContent} MXN`, 10, y); y += 10;
        doc.text(`IVA: 16%`, 10, y); y += 10;
        doc.text(`Total: $${totalDespuesIVA.textContent} MXN`, 10, y); y += 20;
        doc.text(`Número de transacción: ${trans}`, 10, y); y += 10;
        doc.text(`Realizar pago a número de cuenta: ${noCuenta}`, 10, y);
        // Descargar el PDF
        doc.save("Factura_DTT.pdf");
    });
});