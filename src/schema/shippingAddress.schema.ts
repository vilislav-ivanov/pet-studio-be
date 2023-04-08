import { object, string } from 'yup';

export const createShippingAddress = object({
  body: object({
    firstName: string().required({ firstName: 'required' }),
    lastName: string().required({ lastName: 'required' }),
    email: string()
      .required({ email: 'required' })
      .email({ email: 'must be valid' }),
    addressLine: string().required({ addressLine: 'required' }),
    city: string().required({ city: 'required' }),
    province: string().required({ province: 'required' }),
    country: string().required({ country: 'required' }),
    zipOrPostalCode: string().required({ zipOrPostalCode: 'required' }),
  }),
});
