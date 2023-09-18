import { Address, TupleBuilder, Cell } from "ton";
import { getTonClient } from "../utils/tonClient";
import { getUserSc } from "./getUserSc";

export const getAccountBalances = async (userAddress: Address, assetDinamics: Cell) => {
  const argsUser = new TupleBuilder();
  argsUser.writeCell(assetDinamics); // parameter - dict with asset dinamics / u can get them from getUIVariables

  try {
    const res = await (await getTonClient()).callGetMethod(
      getUserSc(userAddress),
      'getAccountBalances',
      argsUser.build(),
    );

    // this getter will return DICT with 256 key as jettonwallet for evaa master sc and body as cell with 65bit int in it
    // account_balances~udict_set(256, asset_id, begin_cell().store_int(balance, 65).end_cell().begin_parse());

    return res;
  } catch (e) {
    console.log('error', e)
  }
} 
