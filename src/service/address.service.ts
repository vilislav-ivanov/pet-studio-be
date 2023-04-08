import { CreateAddressInput } from '../controller/address.controller';
import AddressModel from '../model/address.model';

export async function getAddress(id: string) {
  return await AddressModel.findOne({ _id: id });
}

export async function createAddress({ email }: CreateAddressInput) {
  return await AddressModel.create({
    email,
  });
}

export async function updateAddress(
  addressId: string,
  { email }: CreateAddressInput
) {
  return AddressModel.findOneAndUpdate(
    { _id: addressId },
    {
      email,
    },
    { new: true }
  );
}
