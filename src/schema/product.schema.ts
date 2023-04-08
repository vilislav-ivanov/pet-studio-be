import { array, boolean, object, string } from 'yup';

export const createProductSchema = object({
  body: object({
    category: string().required({ category: 'required' }),
    // userEmail: string()
    //   .required({ userEmail: 'required' })
    //   .email({ userEmail: 'must be valid' }),
    productType: string()
      .oneOf([
        'digital',
        'canvaA',
        'canvaB',
        'canvaC',
        'canvaD',
        'printA',
        'printB',
        'printC',
        'printD',
      ])
      .required({ productType: 'required' }),
    location: string().required({ location: 'required' }),
    photoDestination: string().required({ photoDestination: 'required' }),
  }),
});
export const deleteProductSchema = object({
  body: object({
    products: array().required({ products: 'required' }),
  }),
});

export const addPhotoSchema = object({
  body: object({
    url: string().required({ url: 'required' }),
    filepath: string().required({ filepath: 'required' }),
  }),
});

export const editProductStatus = object({
  body: object({
    status: boolean().required({ status: 'required' }),
    orderId: string().required({ orderId: 'required' }),
  }),
});

export const editProductSelectedPhoto = object({
  body: object({
    selectedImg: object({
      filepath: string().required({ filepath: 'required' }),
      url: string().required({ url: 'required' }),
    }),
  }),
});
