// Importa los módulos de Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-functions.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCkCKx8kBAddCNfqoiTMvyxetMmNDegLb4",
  authDomain: "pias-dbfaf.firebaseapp.com",
  projectId: "pias-dbfaf",
  storageBucket: "pias-dbfaf.appspot.com",
  messagingSenderId: "317943639530",
  appId: "1:317943639530:web:b077b4ec328d4fc3361693"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Inicializa Stripe usando la clave pública; Stripe se carga desde el script global
const stripe = Stripe('pk_test_51QIditD6GoPReWc5t3sTKDTOCmBk0YXOOp3CaWMwTWa4qqJedsUQOExlqm2ivBuctwkEH2G0SBpy8BWaznIHyHjJ00ZjFGSC11')

// Configura la función de Firebase para crear la sesión de Stripe
const createStripeCheckout = httpsCallable(functions, 'createStripeCkeckout');

// Evento para el botón de pago
document.getElementById('checkout-button').addEventListener('click', async () => {
  try {
    const response = await createStripeCheckout(); // Llama a la función
    const sessionId = response.data.id; // Obtiene el ID de la sesión
    stripe.redirectToCheckout({ sessionId: sessionId });
  } catch (error) {
    console.error("Error al iniciar el pago:", error);
  }
});
