import { object, string } from 'yup';

export const createMessageSchema = object({
  body: object({
    email: string()
      .required({ email: 'required' })
      .email({ email: 'must be valid' }),
    subject: string().required({ subject: 'required' }),
    message: string().required({ message: 'required' }),
  }),
});
