const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  console.log('Escaneie o QR code abaixo com o WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Bot está pronto!');
});

client.on('message', async (message) => {
  const content = message.body.toLowerCase();

  if (content === '!info') {
    message.reply('Bem-vindo à Barbearia Corte Perfeito! Use os comandos:\n!agendar [nome] [data] [hora]\n!horarios\n!info');
  } else if (content === '!horarios') {
    message.reply('Horários disponíveis: 9:00, 10:00, 11:00, 14:00, 15:00, 16:00');
  } else if (content.startsWith('!agendar')) {
    const parts = content.split(' ');
    if (parts.length < 4) {
      message.reply('Formato incorreto. Use: !agendar [nome] [data] [hora]');
      return;
    }

    const name = parts[1];
    const date = parts[2];
    const time = parts[3];

    try {
      const appointment = new Appointment({ name, date, time });
      await appointment.save();
      message.reply(`Agendamento confirmado para ${name} em ${date} às ${time}!`);
    } catch (error) {
      message.reply('Erro ao agendar. Tente novamente.');
    }
  }
});

console.log('MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error('Erro: A variável MONGO_URI não está definida.');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB');
    client.initialize();
  })
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = client;