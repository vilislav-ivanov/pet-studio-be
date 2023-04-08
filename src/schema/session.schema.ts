import { object, string } from 'yup';

export const createSessionSchema = object({
  body: object({
    email: string()
      .required({ email: 'required' })
      .email({ email: 'must be valid' }),
    password: string()
      .required({ password: 'required' })
      .min(6, { password: 'too short' })
      .matches(/^[a-zA-Z0-9_.-]*$/, {
        password: 'can only contain latin letters',
      }),
  }),
});
