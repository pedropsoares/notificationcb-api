import { IOrder } from '../controllers/NotificationsCBController';
import { Telegraf } from 'telegraf';

const token = '6967966613:AAHOwcYdNRlbI75Z1w4D48H2R0-sD4Kw-0U';
const chatId = 6009249971;

function productsList(lineItems: IOrder['lineItems']) {
  return lineItems
    .map((item) => `- ${item.quantity}x ${item.productTitle}`)
    .join('\n');
}

function formatTransactionTime(transactionTime: string) {
  const parts = transactionTime.match(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})/,
  );

  if (parts) {
    const year = parseInt(parts[1]);
    const month = parseInt(parts[2]) - 1;
    const day = parseInt(parts[3]);
    const hour = parseInt(parts[4]);
    const minute = parseInt(parts[5]);
    const second = parseInt(parts[6]);
    const offsetHours = parseInt(parts[7]);
    const offsetMinutes = parseInt(parts[8]);

    const dateString = new Date(
      Date.UTC(year, month, day, hour, minute, second) -
        (offsetHours * 60 + offsetMinutes) * 60 * 1000,
    );

    const date = new Date(dateString);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: userTimeZone,
    };

    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(
      date,
    );

    console.log(formattedDate);
    return formattedDate;
  } else {
    console.error('Formato de data inválido');
    return 'Formato de data inválido';
  }
}

async function sendNotification(order: IOrder) {
  const bot = new Telegraf(token);

  bot.telegram.sendMessage(
    chatId,
    `
       *Venda Realizada $${order.totalOrderAmount} Dolares*
      
      Detalhes da venda:
      
      ${productsList(order.lineItems)}
      - **Data e Hora:** ${formatTransactionTime(order.transactionTime)}
      
      [Dashboard](https://accounts.clickbank.com/master/dashboard.html?lng=pt)
    `,
    { parse_mode: 'Markdown' },
  );
}

export default sendNotification;
