console.log(window.totalNeto)
const totalAPagar = window.totalNeto;
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalAPagar,
                    currency_code: 'MXN'
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert("Pago realizado con éxito a nombre de " + details.payer.name.given_name)
            console.log(details);
        });
    }
}).render('#paypal-button-container');