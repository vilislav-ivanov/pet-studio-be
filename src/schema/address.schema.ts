import { object, string } from 'yup';

export const createAddress = object({
  body: object({
    email: string()
      .required({ email: 'required' })
      .email({ email: 'must be valid' }),
  }),
});
