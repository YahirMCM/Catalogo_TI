(function(){
    emailjs.init("JkWwo4bV0ZEyjS9C6"); 
})();

// Variables definidas
const senderPdf = document.getElementById('sendpdf');
const totalAmount = document.getElementById('totalAmount');
const itemsContainer = document.getElementById('items');
const customerType = document.getElementById('customerType');
const totalDespuesIVA = document.getElementById('totalDespuesIVA');
// Aquí genero el número de transacción de manera global
window.transaccion = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
// ELIMINAR TRAS PRUEBAS DE FUNCIONALIDAD
console.log("Desde Script Si sale")
console.log(transaccion)
// ID de servicio y plantilla
const serviceID = 'service_m354r3d0nd4';
const templateID = 'template_zoukpyn';
// Recupera los items de carrito
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
    totalAmount.textContent = total.toFixed(1);
    totalNeto = total + (total * 0.16)
    totalDespuesIVA.textContent = totalNeto.toFixed(1);
}
// En el botón de enviar correo hace lo siguiente
senderPdf.addEventListener('click', () => {

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
    
    // Generamos una variable para mandarlo como mensaje comenzando con el tipo de cliente
    let text = `Tipo de Cliente: ${customerData.type}\n`;
    // Acá revisamos los rfc
    if (customerData.dni || customerData.taxId) {
        text += `RFC: ${customerData.dni || customerData.taxId}\nCódigo Postal: ${postalCode}\n`;
    }

    text += "A continuación se muestra un resumen de la compra:\n";

    // Por cada item dentro del carrito lo mete en el mensaje
    carrito.forEach((item, index) => {
        text += `${index + 1}. ${item.producto} - Cantidad: ${item.cantidad} - $${item.precio * item.cantidad} MXN\n`;
    });

    // Total
    text += `Total antes de impuestos: $${totalAmount.textContent} MXN\nSe aplica un IVA de 16%\nTotal: $${totalDespuesIVA.textContent} MXN`;
    // Aquí generé el número de transacción
    //const transaccion = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    //window.transac = transaccion.toString();
    // Luego remplazar por nuestro número de cuenta o paypal donde depositar
    const noCuenta = "1234 5678 1234 5678";

    text += `\n\tNúmero de transacción: ${transaccion}\n\tRealizar pago a número de cuenta: ${noCuenta}`;

    const pdfNombre = `${customerData.name} ${customerData.apellidos ?? ''}`;

    // Esto de aquí hace la mágia como que no 🔥
    emailjs.send(serviceID, templateID, {
        user_name: pdfNombre,
        user_email: email,
        message: text
    })
    .then(response => {
        console.log("Correo enviado exitosamente", response.status, response.text);
        alert("Correo enviado");
    })
    .catch(error => {
        console.error("Hubo un error al enviar el correo", error);
    });
});