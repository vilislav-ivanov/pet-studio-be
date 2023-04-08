import sgMail from '@sendgrid/mail';
import config from 'config';

sgMail.setApiKey(config.get<string>('sendgrid_key'));

const sendEmail = (
  to: string,
  subject: string,
  text: string,
  htmlText: string
) => {
  const msg = {
    to: to,
    from: 'vilislav.ivanov.ivanov@gmail.com',
    subject: subject,
    text: text,
    html: htmlText,
  };

  return new Promise((resolve, reject) => {
    sgMail
      .send(msg)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export async function orderCofirmEmail(
  to: string,
  orderPublicId: string,
  firstName: string | undefined,
  lastName: string | undefined
) {
  let user = to;
  if (firstName && lastName) {
    user = `${firstName} ${lastName}`;
  }

  const htmlText = ` <div className="flex flex-col w-full items-center justify-center">
  <p className="text-dimWhite mt-10 mx-10">
    Dear ${user}, thank you for your oder!
  </p>
  <p className=" text-dimWhite my-1 mx-10">
    Your order is received by our team. Order ID ${orderPublicId}
  </p>
  <p className="text-dimWhite mt-1 mb-7 mx-10">
    To check status of your order, please go to <a href="/checkorder"  target="_blank" rel="noopener noreferrer">checkorder</a> and authenticate yourself with order id (${orderPublicId}) and email (${to})
  </p>
  <p className=" text-white font-poppins my-1 mx-10">
    Once your digital images are completed you will receive an email (also check spam) with your digital images or at <a href="/checkorder"  target="_blank" rel="noopener noreferrer">Check Order</a>
  </p>
  <p className=" text-white font-poppins my-1 mx-10">
    For Canvas or Prints, once your digital images are completed, you can confirm your print or canva copy at <a href="/checkorder"  target="_blank" rel="noopener noreferrer">Check Order</a>
  </p>
</div>`;

  await sendEmail(
    to,
    `Order Confirmation ${orderPublicId}`,
    `Order Confirmation ${orderPublicId}`,
    htmlText
  );
}

export async function digitalProductReadyEmail(
  to: string,
  orderPublicId: string,
  urls: string[]
) {
  const urlsHtml = urls.map((url, index) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">$Digital Art #${
      index + 1
    }</a> `;
  });
  const htmlText = `
  <div>
    <p>There is a ready product on your order ${orderPublicId}</p>
    <p>Your Digital products can be found here: </p>
      ${urlsHtml}
    <p>Or you can navigate to  <a href="/checkorder"  target="_blank" rel="noopener noreferrer">Check Order</a> and enter order id (${orderPublicId}) and your email(${to})</p>
    <p>Thank you for using our services!</p>
  </div>
  `;

  await sendEmail(
    to,
    `Product ready on order ${orderPublicId}`,
    `Product ready on order ${orderPublicId}`,
    htmlText
  );
}

export async function printableProductReadyEmail(
  to: string,
  orderPublicId: string,
  urls: string[]
) {
  const urlsHtml = urls.map((url, index) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">$Digital Art #${
      index + 1
    }</a> `;
  });
  const htmlText = `
  <div>
    <p>There is a ready product on your order ${orderPublicId}</p>
    <p>Your Digital products can be found here: </p>
      ${urlsHtml}
    <p>Please navigate to <a href="/checkorder"  target="_blank" rel="noopener noreferrer">Check Order</a> and enter order id (${orderPublicId}) and your email(${to}) to select which image you want to be printed and send to your address.</p>
    <p>Thank you for using our services!</p>
  </div>
  `;

  await sendEmail(
    to,
    `Product ready on order ${orderPublicId}`,
    `Product ready on order ${orderPublicId}`,
    htmlText
  );
}
