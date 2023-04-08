import OrderModel from '../model/order.model';
import ProductModel from '../model/product.model';
import { ExecutionError, NotFoundError } from '../utils/errors/errors';
import productPrice from '../utils/productPrice';
import { deleteProductInCart, updateCartTotalPrice } from './cart.service';
import {
  digitalProductReadyEmail,
  printableProductReadyEmail,
} from './email.service';
import { deleteFile } from './file.service';

export function createProduct({
  category,
  location,
  moreInfo,
  photoDestination,
  productType,
}: {
  category: string;
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
}) {
  try {
    const price = productPrice[productType];
    return ProductModel.create({
      productType,
      location,
      photoDestination,
      moreInfo,
      category,
      price,
    });
  } catch (error: any) {
    throw new ExecutionError(error.message);
  }
}

export async function getProduct(id: string) {
  return await ProductModel.findOne({ _id: id });
}

export async function deleteProduct(id: string) {
  const product = await ProductModel.findOne({ _id: id });
  if (product) {
    await updateCartTotalPrice(id, product.price);
    await deleteProductInCart(id);
    return await ProductModel.deleteOne({ _id: id });
  }
}

export async function addPhotoToProduct(
  { url, filepath }: { url: string; filepath: string },
  productId: string
) {
  const product = await ProductModel.findOneAndUpdate(
    { _id: productId },
    { $push: { finishedImgs: { url, filepath } } },
    { new: true }
  );
  if (!product) {
    throw new NotFoundError("product doesn't exist");
  }
  return product;
}

export async function deletePhotos(productId: string) {
  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError("product doesn't exist");
  }

  product.finishedImgs.forEach(async (img) => {
    await deleteFile(img.filepath);
  });
  product.finishedImgs = [];
  product.isFinishedByAdmin = false;
  product.save();

  return product;
}

export async function changeProductStatus(
  productId: string,
  status: boolean,
  orderId: string
) {
  const product = await ProductModel.findOneAndUpdate(
    { _id: productId },
    { isFinishedByAdmin: status },
    { new: true }
  );

  if (!product) {
    throw new NotFoundError("product doesn't exist");
  }

  if (status) {
    const urls = product.finishedImgs.map(
      (img) =>
        `$https://pet-photo-studio.s3.eu-north-1.amazonaws.com/${img.filepath}`
    );

    const order = await OrderModel.findOne({ _id: orderId });

    if (!order) {
      throw new NotFoundError("order doesn't exist");
    }

    if (product.productType === 'digital') {
      await digitalProductReadyEmail(order.email, order.publicId, urls);
    } else {
      await printableProductReadyEmail(order.email, order.publicId, urls);
    }
  }

  return product;
}

export async function updateProductPhoto(
  productId: string,
  selectedImg: { filepath: string; url: string }
) {
  const product = await ProductModel.findOneAndUpdate(
    { _id: productId },
    { selectedImg: selectedImg, isFinishedByClient: true },
    { new: true }
  );

  if (!product) {
    throw new NotFoundError("product doesn't exist");
  }

  return product;
}
