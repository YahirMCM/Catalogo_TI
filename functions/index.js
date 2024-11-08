
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret_key);

exports.createStripeCkeckout = functions.https.onCall(async (data, context) => {
try {
    const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "https://yahirmcm.github.io/Catalogo_TI/exito.html",
    cancel_url: "https://yahirmcm.github.io/Catalogo_TI/cancelacion.html",
    line_items: [
        {
        quantity: 1,
        price_data: {
            currency: "mxn",
            unit_amount: 4500 * 100,
            product_data: {
            name: "Paquete Basico",
            },
        },
        },
    ],
    });

    return { id: session.id }; // Devuelve el ID de la sesión
} catch (error) {
    console.error("Error en la creación de la sesión de Stripe:", error);
    throw new functions.https.HttpsError('internal', 'Error al crear la sesión de pago');
}
});