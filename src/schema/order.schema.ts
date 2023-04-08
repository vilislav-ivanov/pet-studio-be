import { object, string } from 'yup';

export const createOrderSchema = object({
  body: object({
    cartId: string().required({ cartId: 'required' }),
    paymentIntent: string().required({ paymentIntent: 'required' }),
  }),
});
