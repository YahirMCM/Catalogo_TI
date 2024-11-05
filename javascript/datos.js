document.addEventListener('DOMContentLoaded', () => {
    const customerType = document.getElementById('customerType');
    const individualFields = document.getElementById('individualFields');
    const organizationFields = document.getElementById('organizationFields');
    const commonFields = document.getElementById('commonFields'); 
    const totalAmount = document.getElementById('totalAmount');
    const generatePdfButton = document.getElementById('generatePdf');
    const itemsContainer = document.getElementById('items');

    // Inicialmente deshabilitar el botón
    generatePdfButton.disabled = true;

    // Mostrar campos específicos según el tipo de cliente y verificar campos
    customerType.addEventListener('change', (event) => {
        const value = event.target.value;

        individualFields.style.display = value === 'individuo' ? 'block' : 'none';
        organizationFields.style.display = value === 'organizacion' ? 'block' : 'none';
        commonFields.style.display = value ? 'block' : 'none';

        actualizarEstadoBotonFactura(); // Verificar campos al seleccionar el tipo de cliente
    });

    // Verificación en tiempo real de todos los campos del formulario
    document.querySelectorAll('#invoiceForm input, #invoiceForm select').forEach((input) => {
        input.addEventListener('input', actualizarEstadoBotonFactura);
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

    function actualizarEstadoBotonFactura() {
        if (verificarCamposRequeridos()) {
            generatePdfButton.disabled = false;
            generatePdfButton.style.backgroundColor = "#4CAF50";
            generatePdfButton.onclick = null;
        } else {
            generatePdfButton.disabled = true;
            generatePdfButton.style.backgroundColor = "grey";
            generatePdfButton.onclick = () => alert("Para generar su factura, complete todos los campos requeridos.");
        }
    }

    // Cargar productos desde el carrito
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    cargarProductos(carrito);

    function cargarProductos(carrito) {
        let total = 0;
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
        totalAmount.textContent = total.toFixed(2);
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
        doc.text(`Total: $${totalAmount.textContent} MXN`, 10, y);

        // Descargar el PDF
        doc.save("Factura_DTT.pdf");
    });
});