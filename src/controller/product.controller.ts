import { Request, Response } from 'express';
import logger from '../logger';
import { addProductToCart, createCart, getCart } from '../service/cart.service';
import {
  addPhotoToProduct,
  changeProductStatus,
  createProduct,
  deletePhotos,
  deleteProduct,
  getProduct,
  updateProductPhoto,
} from '../service/product.service';
import { cookieOptions } from '../utils/cookieOptions';
import errorHandler from '../utils/errors/error-handler';

interface CreateProductInput {
  category: string;
  userEmail: string;
  productType:
    | 'digital'
    | 'canvaA'
    | 'canvaB'
    | 'canvaC'
    | 'canvaD'
    | 'printA'
    | 'printB'
    | 'printC'
    | 'printD';
  location: string;
  photoDestination: string;
  moreInfo: string | null;
}

export interface DeleteProductInput {
  products: string[];
}

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput, {}>,
  res: Response
) {
  try {
    const cartId = req.cookies.csid as string;
    const product = await createProduct(req.body);
    let cart = await getCart(cartId);

    if (cartId && cart) {
      cart = await addProductToCart(cart, product);
    } else {
      cart = await createCart();
      cart = await addProductToCart(cart, product);
      res.cookie('csid', cart._id, cookieOptions);
    }

    res.status(200).json({ product, completed: true });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function deleteProductHandler(
  req: Request<{}, {}, DeleteProductInput, {}>,
  res: Response
) {
  try {
    await deleteProduct(req.body.products[0]);
    return res.status(200).json({ deleted: true });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function deleteAllProductsHandler(
  req: Request<{}, {}, DeleteProductInput, {}>,
  res: Response
) {
  try {
    const dps: any[] = [];
    const products = req.body.products;
    products.forEach(async (product) => {
      const dp = deleteProduct(product);
      dps.push(dp);
    });
    Promise.all(dps).then(() => {
      return res.status(200).json({ deleted: true });
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function addPhotoToProductHandler(
  req: Request<{ productId: string }, {}, { url: string; filepath: string }>,
  res: Response
) {
  const url = req.body.url;
  const filepath = req.body.filepath;
  const productId = req.params.productId;

  try {
    const product = await addPhotoToProduct({ url, filepath }, productId);
    return res.json({ product });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function deletePhotosHandler(
  req: Request<{ productId: string }>,
  res: Response
) {
  const productId = req.params.productId;

  try {
    const product = await deletePhotos(productId);
    return res.json({ product });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function editProductStatusHandler(
  req: Request<{ productId: string }, {}, { status: boolean; orderId: string }>,
  res: Response
) {
  const productId = req.params.productId;
  const orderId = req.body.orderId;
  const status = req.body.status;

  try {
    const product = await changeProductStatus(productId, status, orderId);
    return res.json({ product });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function getSingleProductHadler(
  req: Request<{ productId: string }>,
  res: Response
) {
  const productId = req.params.productId;
  try {
    const product = await getProduct(productId);
    return res.json({ product });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}

export async function editProductSelectedPhotoHandler(
  req: Request<
    { productId: string },
    {},
    { selectedImg: { filepath: string; url: string } }
  >,
  res: Response
) {
  const productId = req.params.productId;
  const selectedImg = req.body.selectedImg;
  try {
    const product = await updateProductPhoto(productId, selectedImg);
    return res.json({ product });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      errorHandler(error, res);
    }
  }
}
