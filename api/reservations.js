require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, replyTo, subject, text, html }) => {
  await transporter.sendMail({
    from: `"Lau Lash Atelier" <${process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Kérjük, töltsd ki az összes mezőt.' });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.RECIPIENT_EMAIL) {
    return res.status(500).json({
      message: 'A Gmail beállítások még nincsenek konfigurálva. Ellenőrizd a Vercel környezeti változóit.',
    });
  }

  try {
    await sendEmail({
      to: process.env.RECIPIENT_EMAIL,
      replyTo: email,
      subject: 'Lau Lash Atelier - időpontkérés',
      text: [
        `Név: ${name}`,
        `E-mail: ${email}`,
        '',
        'Üzenet:',
        message,
      ].join('\n'),
      html: `
        <h3>Új időpontkérés</h3>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Üzenet:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    await sendEmail({
      to: email,
      replyTo: process.env.RECIPIENT_EMAIL,
      subject: 'Lau Lash Atelier - foglalási visszaigazolás',
      text: `Kedves ${name}!\n\nKöszönjük, hogy időpontot kértél a Lau Lash Atelierben. A foglalási kérésedet megkaptuk, és hamarosan visszajelzünk.\n\nEzt a levelet automatikusan küldtük.\n\nÜdvözlettel,\nLau Lash Atelier`,
      html: `
        <h3>Köszönjük a megkeresésed!</h3>
        <p>Kedves ${name}!</p>
        <p>Köszönjük, hogy időpontot kértél a Lau Lash Atelierben. A foglalási kérésedet megkaptuk, és hamarosan visszajelzünk.</p>
        <p>Ezt a levelet automatikusan küldtük.</p>
        <p>Üdvözlettel,<br>Lau Lash Atelier</p>
      `,
    });

    return res.status(200).json({ message: 'Köszönjük! A foglalási kérésedet elküldtük.' });
  } catch (error) {
    console.error('Failed to send reservation email:', error);
    return res.status(500).json({
      message: 'A levél küldése sikertelen volt. Próbáld meg újra vagy vedd fel a kapcsolatot közvetlenül.',
    });
  }
};
