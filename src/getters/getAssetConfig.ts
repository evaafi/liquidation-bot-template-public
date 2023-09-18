import { Address, TupleBuilder, Cell } from "ton";
import { getTonClient } from "../utils/tonClient";
import { getUserSc } from "./getUserSc";

export const getUserVersion = async (userAddress: Address) => {
  const argsUser = new TupleBuilder();

  try {
    const res = await (await getTonClient()).callGetMethod(
      getUserSc(userAddress),
      'getAssetConfig',
      argsUser.build(),
    );

    const assetConfig = Number(res.stack.readCell());

    return assetConfig;
  } catch (e) {
    console.log('error', e)
  }
} 
