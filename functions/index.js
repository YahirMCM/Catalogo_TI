/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const stripe = require("stripe")("sk_test_51QIditD6GoPReWc50k0jLZDKlVpYPcA8SDTsuqef3CIJzvOQkA5sRhdo6MVVHGCWTSzyFKybNQ9JGONIaVqVDPX600ruwNS73x");

exports.crearSesionPago = functions.https.onRequest(async (req, res) => {
  try {
    const carrito = req.body.carrito;
    const lineItems = carrito.map((item) => ({
      price_data: {
        currency: "mxn",
        product_data: {
          name: item.producto,
        },
        unit_amount: item.precio * 100,
      },
      quantity: item.cantidad,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://yahirmcm.github.io/Catalogo_TI/exito.html",
      cancel_url: "https://yahirmcm.github.io/Catalogo_TI/cancelacion.html",
    });

    res.json({id: session.id});
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al crear la sesión de pago");
  }
});
