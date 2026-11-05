global.otpStorage = global.otpStorage || {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email } = req.body;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@itocotlan\.com$/;
  if (!email || !emailPattern.test(email)) {
    return res.status(400).json({ error: 'Correo institucional no válido.' });
  }

  const passcode = Math.floor(1000 + Math.random() * 9000).toString();
  
  global.otpStorage[email] = {
    code: passcode,
    attempts: 0,
    expiresAt: Date.now() + 10 * 60 * 1000 
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_iriklkk',
        template_id: 'template_uaqp21p',
        user_id: '_YT5dfAjEDLT8hM-T',
        template_params: {
          email: email,
          passcode: passcode,
          logo_url: "https://i.ibb.co/wFC8YDvg/itobot-logo.png"
        }
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Código enviado correctamente.' });
    } else {
      return res.status(500).json({ error: 'Error al enviar el correo.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}