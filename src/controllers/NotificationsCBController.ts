import { Request, Response } from 'express';
import crypto from 'crypto';
import sendNotification from '../utils/sendMessage';

export interface IOrder {
  transactionTime: string;
  receipt: string;
  transactionType: string;
  vendor: string;
  role: string;
  totalAccountAmount: number;
  paymentMethod: string;
  totalOrderAmount: number;
  totalTaxAmount: number;
  totalShippingAmount: number;
  currency: string;
  lineItems: [
    {
      itemNo: string;
      productTitle: string;
      shippable: boolean;
      recurring: boolean;
      accountAmount: number;
      quantity: number;
      lineItemType: string;
      productPrice: number;
      productDiscount: number;
      taxAmount: number;
      shippingAmount: number;
      shippingLiable: boolean;
    },
  ];
  customer: {
    shipping: {
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      address: object;
    };
    billing: {
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      address: object;
    };
  };
  version: 7;
  attemptCount: 1;
}

const processNotificationCB = async (req: Request, res: Response) => {
  const secretKey = 'ALEICNHIOPYWNGLS';

  try {
    const { iv, notification } = req.body;

    const encrypted = Buffer.from(notification, 'base64');
    const initializationVector = Buffer.from(iv, 'base64');

    const decipher: any = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(
        crypto.createHash('sha1').update(secretKey).digest('hex').slice(0, 32),
      ),
      initializationVector,
    );

    let decrypted = decipher.update(encrypted, 'binary', 'utf8');
    decrypted += decipher.final('utf8');

    const orderData: IOrder = JSON.parse(decrypted.trim());

    await sendNotification(orderData);

    res
      .status(200)
      .json({ success: true, message: 'Notificação processada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: 'Não foi possível descriptografar a notificação instantânea.',
    });
  }
};

export default processNotificationCB;
