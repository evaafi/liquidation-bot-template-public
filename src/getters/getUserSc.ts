import { Address, beginCell, Cell, contractAddress } from 'ton';

import { evaaMaster, userCode } from '../config'; // constants

export const getUserSc = (userAddress: Address) => {
  const code = Cell.fromBoc(Buffer.from(userCode, 'hex'))[0];
  const data = beginCell()
    .storeAddress(Address.parseFriendly(evaaMaster).address)
    .storeUint(0, 8)
    .storeRef(
      beginCell()
        .storeAddress(userAddress)
        .endCell())
    .endCell()

  return contractAddress(0, {
    code,
    data,
  });
}
