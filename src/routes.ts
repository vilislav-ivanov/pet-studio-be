import { Express, Request, Response } from 'express';
import {
  createUserHandler,
  getUserHandler,
} from './controller/user.controller';
import {
  createSessionHandler,
  invalidateSessionHandler,
} from './controller/session.controller';
import {
  createProductHandler,
  getSingleProductHadler,
  deleteProductHandler,
  deleteAllProductsHandler,
  addPhotoToProductHandler,
  deletePhotosHandler,
  editProductStatusHandler,
  editProductSelectedPhotoHandler,
} from './controller/product.controller';

import validateRequest from './middleware/validateRequest';

import { createUserSchema } from './schema/user.schema';
import { createSessionSchema } from './schema/session.schema';
import requireUser from './middleware/requireUser';
import {
  createProductSchema,
  deleteProductSchema,
  addPhotoSchema,
  editProductStatus,
  editProductSelectedPhoto,
} from './schema/product.schema';
import { getCartHandler } from './controller/cart.controller';
import { requireCorrectCookieForProduct } from './middleware/requireCorrectCookieForProduct';
import { createShippingAddress } from './schema/shippingAddress.schema';
import {
  createShippingAddressHandler,
  editShippingAddressHandler,
} from './controller/shippingAddress.controller';
import { requireCart } from './middleware/requireCart';
import {
  createCheckoutSessionHandler,
  getPublicKeySessionHandler,
} from './controller/checkout.controller';
import { createOrderSchema } from './schema/order.schema';
import {
  createOrderHandler,
  getAllOrdersHandler,
  getSingleOrderHandler,
} from './controller/order.controller';
import { createAddress } from './schema/address.schema';
import {
  createAddressHandler,
  editAddressHandler,
} from './controller/address.controller';
import requireAdmin from './middleware/requireAdmin';
import { getSignedUrlHandler } from './controller/file.controller';
import { createMessageSchema } from './schema/message.schema';
import {
  createMessageHandler,
  getAllMessagesHandler,
  getMessageHandler,
} from './controller/message.controller';

function connectRoutes(app: Express) {
  app.get('/api/private', requireUser, (req: Request, res: Response) => {
    res.send('Estou Aque');
  });

  // User
  app.get('/api/users', requireUser, getUserHandler);
  app.post('/api/users', validateRequest(createUserSchema), createUserHandler);

  // Session
  app.post(
    '/api/sessions',
    validateRequest(createSessionSchema),
    createSessionHandler
  );
  app.delete('/api/sessions', requireUser, invalidateSessionHandler);

  // product
  app.get('/api/product/:productId', getSingleProductHadler);

  app.post(
    '/api/product',
    validateRequest(createProductSchema),
    createProductHandler
  );

  app.delete(
    '/api/product',
    validateRequest(deleteProductSchema),
    requireCorrectCookieForProduct,
    deleteProductHandler
  );
  app.delete(
    '/api/product/all',
    validateRequest(deleteProductSchema),
    requireCorrectCookieForProduct,
    deleteAllProductsHandler
  );

  app.post(
    '/api/product/:productId/photo',
    requireAdmin,
    validateRequest(addPhotoSchema),
    addPhotoToProductHandler
  );

  app.delete(
    '/api/product/:productId/photo',
    requireAdmin,
    deletePhotosHandler
  );

  app.put(
    '/api/product/:productId/status',
    validateRequest(editProductStatus),
    requireAdmin,
    editProductStatusHandler
  );

  app.put(
    '/api/product/:productId/photo',
    validateRequest(editProductSelectedPhoto),
    editProductSelectedPhotoHandler
  );

  // Cart
  app.get('/api/cart', getCartHandler);

  // ShippingAddress
  app.post(
    '/api/shipping',
    validateRequest(createShippingAddress),
    requireCart,
    createShippingAddressHandler
  );

  app.post(
    '/api/shipping/:shippingId',
    validateRequest(createShippingAddress),
    requireCart,
    editShippingAddressHandler
  );

  // address
  app.post(
    '/api/address',
    validateRequest(createAddress),
    requireCart,
    createAddressHandler
  );
  app.post(
    '/api/address/:addressId',
    validateRequest(createAddress),
    requireCart,
    editAddressHandler
  );

  // Stripe
  app.get('/api/stripe/config', requireCart, getPublicKeySessionHandler);
  app.post(
    '/api/create-checkout-session',
    requireCart,
    createCheckoutSessionHandler
  );

  // Order
  app.post(
    '/api/order/',
    requireCart,
    validateRequest(createOrderSchema),
    createOrderHandler
  );
  app.get('/api/order', getSingleOrderHandler);
  app.get('/api/order/all', requireAdmin, getAllOrdersHandler);

  // File
  app.get('/api/file/config', getSignedUrlHandler);

  // Message
  app.post(
    '/api/message',
    validateRequest(createMessageSchema),
    createMessageHandler
  );
  app.get('/api/message', requireAdmin, getAllMessagesHandler);
  app.post('/api/message/:messageId', requireAdmin, getMessageHandler);
}

export default connectRoutes;
