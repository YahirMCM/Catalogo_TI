const functions = require("firebase-functions");

exports.createStripeCkeckout = functions.https.onCall(async (data, context) => {
  const stripe = require("stripe")(functions.config().stripe.secret_key);
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

  return {
    id: session.id,
  };
});
