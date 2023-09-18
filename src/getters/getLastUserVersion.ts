import { Address, TupleBuilder, Cell } from "ton";
import { evaaMaster } from "../config";
import { getTonClient } from "../utils/tonClient";

export const getUserLastVersion = async () => {
  const argsUser = new TupleBuilder();

  try {
    const res = await (await getTonClient()).callGetMethod(
      Address.parseFriendly(evaaMaster).address,
      'getLastUserScVersion',
      argsUser.build(),
    );

    const userSCLastVersion = Number(res.stack.readNumber());

    return userSCLastVersion;
  } catch (e) {
    console.log('error', e)
  }
}
