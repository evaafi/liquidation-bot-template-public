import { Address, TupleBuilder, Cell } from "ton";
import { getTonClient } from "../utils/tonClient";
import { getUserSc } from "./getUserSc";

export const getAccountBalances = async (userAddress: Address, assetConfig: Cell, assetDinamics: Cell, prices: Cell) => {
  const argsUser = new TupleBuilder();
  argsUser.writeCell(assetConfig); // parameter - dict with assets config 
  argsUser.writeCell(assetDinamics); // parameter - dict with asset dinamics 
  argsUser.writeCell(prices); // parameter - prices dict builder here https://github.com/evaafi/rs-verif-from-api/blob/6f26cf4ee71dc359b0c6756dcb7c56dcc0948b1c/src/Test_middlewhare.ts#L39 

  try {
    const res = await (await getTonClient()).callGetMethod(
      getUserSc(userAddress),
      'getAccountBalances',
      argsUser.build(),
    );

    const isLiquidatable = Number(res.stack.readNumber());

    return isLiquidatable;
  } catch (e) {
    console.log('error', e)
  }
} 
