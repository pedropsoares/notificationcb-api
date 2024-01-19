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
  const year = parseInt(transactionTime.substr(0, 4));
  const month = parseInt(transactionTime.substr(4, 2)) - 1;
  const day = parseInt(transactionTime.substr(6, 2));
  const hour = parseInt(transactionTime.substr(9, 2));
  const minutes = parseInt(transactionTime.substr(11, 2));

  const data = new Date(year, month, day, hour, minutes);

  data.setHours(data.getHours() + 5);

  const dayFormatted = data.getDate();
  const monthFormatted = data.getMonth() + 1;
  const yearFormatted = data.getFullYear();
  const hourFormatted = data.getHours();
  const minutesFormatted = data.getMinutes();

  const formattedDate = `${dayFormatted < 10 ? '0' : ''}${dayFormatted}/${
    monthFormatted < 10 ? '0' : ''
  }${monthFormatted}/${yearFormatted}, ${
    hourFormatted < 10 ? '0' : ''
  }${hourFormatted}:${minutesFormatted < 10 ? '0' : ''}${minutesFormatted}`;

  return formattedDate;
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
