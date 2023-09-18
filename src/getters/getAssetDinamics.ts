import { Address, TupleBuilder, Cell } from "ton";
import { evaaMaster } from "../config";
import { getTonClient } from "../utils/tonClient";

export const getAssetsDinamics = async () => {
  const argsUser = new TupleBuilder();

  try {
    const res = await (await getTonClient()).callGetMethod(
      Address.parseFriendly(evaaMaster).address,
      'getAssetsData',
      argsUser.build(),
    );

    const assetsDinamics = res.stack.readCell();

    return assetsDinamics;
  } catch (e) {
    console.log('error', e)
  }
}
