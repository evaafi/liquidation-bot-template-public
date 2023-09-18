
import { Cell, internal, WalletContractV3R2, beginCell, Address } from "ton"
import { mnemonicToPrivateKey } from "ton-crypto";
import { getTonClient } from "../utils/tonClient";
import { evaaMaster } from "../config";

enum SendMode {
    CARRRY_ALL_REMAINING_BALANCE = 128,
    CARRRY_ALL_REMAINING_INCOMING_VALUE = 64,
    DESTROY_ACCOUNT_IF_ZERO = 32,
    PAY_GAS_SEPARATLY = 1,
    IGNORE_ERRORS = 2,
}

export const sleep = async (val: number) => new Promise((res, _) => {
    setTimeout(() => {
        res(true);
    }, val)
})

const workchain = 0
const deployerMnemonic = ''

export const sendTx = (price_list: Cell, borrower: Address, loanToken: Number, liquidationAmount: Number, collateralToken: Number, minCollateralAmount: Number) => new Promise(async (res, _) => {
    const client = await getTonClient()

    const walletKey = await mnemonicToPrivateKey(deployerMnemonic.split(" "));
    const walletContract = WalletContractV3R2.create({ publicKey: walletKey.publicKey, workchain });
    const pr = client.provider(walletContract.address, walletContract.init)
    const seqno = await walletContract.getSeqno(pr);

    const liquidationBody = beginCell().endCell()

    // THIS IS PARAMETERS THAT YOU NEED for liquidation for TONs 
    // to: master.address,
    // value: liquidateAttachment + sendAmount,
    // bounce: true,
    // body: customBuilder()
    // 	.storeUint(70, 32) // opcode for liquidation
    // 	.storeUint(1234, 64) //does not matter
    // 	.storeAddress(borrower)
    // 	.storeUint(collateralToken, 256) // token keys represented as 256 uint number taken from addresses of evaa master sc jetton wallets
    // 	.storeUint(minCollateralAmount, 64)
    // 	.storeInt(-1, 2) // include_user_code // if masterScVersion is bigger then userScCodeVersion then true / otherwise false
    // 	.storeRef(price_list)
    // 	.endCell(), 
    // sendMode: 1,

    const transferResult = walletContract.sendTransfer(pr, {
        secretKey: walletKey.secretKey,
        seqno: seqno,
        sendMode: SendMode.PAY_GAS_SEPARATLY + SendMode.IGNORE_ERRORS,
        messages: [internal({
            value: '0',
            to: evaaMaster,
            bounce: false,
            body: liquidationBody
        })]
    })

    console.log(transferResult)
    //---------- TODO JETTON LIQUIDATION 
    // const bodyForJettonTrx = beginCell().
    //     storeUint(0xf8a7ea5, 32)
    //     .storeUint(0, 64)
    //     // create body for jetton transfer and use liquidationBody
    //     .endCell()
    // const body = beginCell().
    //     storeUint(0xf8a7ea5, 32)
    //     .storeUint(0, 64)
    //     .storeCoins(100 * 1e6)
    //     .storeAddress(Address.parseFriendly(toAddress).address)
    //     .storeAddress(null) //responce add?
    //     .storeDict(null)
    //     .storeCoins(toNano(0.05))
    //     .storeRefMaybe(null)
    //     .endCell()
    //
    // try {
    //     await sleep(12000);
    // } catch (e) {
    //     console.log(e)
    // }
    //---------- TODO JETTON LIQUIDATION 
    console.log('waiting for tx broadcast and validation...')
    await sleep(12000);
    console.log('done')
    res(true)
})

const liquidationService = async () => {
    try {
        console.log('liquidation started')
        // use getters to find USERs to liquidate
        // use all getters to get needed parameters for liquidation of specific user

        // await sendTx(price_list, borrower, loanToken, liquidationAmount, collateralToken, minCollateralAmount) // do liquidation

        console.log('liquidation done')

    } catch (error) {
        console.log(error)
        return { status: 'error', error }
    }
}

export default liquidationService 
