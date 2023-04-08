import { object, string, ref } from 'yup';

export const createUserSchema = object({
  body: object({
    name: string().required('name is required.'),
    email: string()
      .email('must be a valid email')
      .required('email is required'),
    password: string()
      .required('password is required.')
      .min(6, 'password is too short.')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'password can only contain latin letters.'),
    passwordConfirmation: string()
      .required('passwordConfirmation is required.')
      .is([ref('password')], 'password and passwordConfirmation must match'),
  }),
});
