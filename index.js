const express = require("express");
const axios = require("axios");
const { MessagingResponse } = require("twilio").twiml;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const ADMIN_NUMBER = "whatsapp:+573227849692";

app.post("/webhook", async (req, res) => {
  const twiml = new MessagingResponse();
  const data = req.body;

  let message = "";
  if (data.type === "problema") {
    message = `Nuevo reporte técnico de cliente:
- Plataforma: ${data.plataforma}
- Correo: ${data.correo}
- Problema: ${data.problema}`;
  } else if (data.type === "pago") {
    message = `Nuevo comprobante de pago recibido:
- Nombre: ${data.nombre}
- Medio: ${data.medio}
- Referencia: ${data.referencia}`;
  } else if (data.type === "codigo") {
    message = `Cliente espera códigos:
- Plataforma: ${data.plataforma}
- Correo: ${data.correo}`;
  }

  try {
    await axios.post("https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json", null, {
      params: {
        From: "whatsapp:+14155238886",
        To: ADMIN_NUMBER,
        Body: message
      },
      auth: {
        username: "YOUR_ACCOUNT_SID",
        password: "YOUR_AUTH_TOKEN"
      }
    });
    res.send("OK");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error al enviar mensaje");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Bot server running on port", PORT);
});