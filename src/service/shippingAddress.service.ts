import ShippingAddressModel from '../model/shippingAddress.model';
import { CreateShippingAddressInput } from '../controller/shippingAddress.controller';

export async function createShippingAddress({
  firstName,
  lastName,
  addressLine,
  email,
  city,
  province,
  country,
  zipOrPostalCode,
}: CreateShippingAddressInput) {
  return await ShippingAddressModel.create({
    firstName,
    lastName,
    addressLine,
    email,
    city,
    province,
    country,
    zipOrPostalCode,
  });
}

export async function updateShippingAddress(
  shippingId: string,
  {
    firstName,
    lastName,
    addressLine,
    email,
    city,
    province,
    country,
    zipOrPostalCode,
  }: CreateShippingAddressInput
) {
  return ShippingAddressModel.findOneAndUpdate(
    { _id: shippingId },
    {
      firstName,
      lastName,
      addressLine,
      email,
      city,
      province,
      country,
      zipOrPostalCode,
    },
    { new: true }
  );
}
