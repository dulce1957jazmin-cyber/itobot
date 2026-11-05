global.otpStorage = global.otpStorage || {};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, code } = req.body;
  const record = global.otpStorage[email];

  if (!record) {
    return res.status(400).json({ success: false, message: 'No hay un código solicitado o expiró.' });
  }

  if (Date.now() > record.expiresAt) {
    delete global.otpStorage[email];
    return res.status(400).json({ success: false, message: 'El código ha expirado.' });
  }

  if (record.attempts >= 5) {
    delete global.otpStorage[email];
    return res.status(429).json({ success: false, message: 'Demasiados intentos fallidos.' });
  }

  if (record.code === code) {
    delete global.otpStorage[email];
    return res.status(200).json({ success: true, message: 'Autenticación exitosa.' });
  } else {
    record.attempts += 1;
    return res.status(400).json({ 
      success: false, 
      message: `Código incorrecto. Te quedan ${5 - record.attempts} intentos.` 
    });
  }
}