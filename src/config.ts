import path from "path";
import { config } from "dotenv";
import { loadVar } from "./utils";

config({ path: path.join(__dirname, "../.env") });
config({ path: path.join(__dirname, ".env") });
export const port = loadVar("PORT", true) as string;
export const mn = loadVar("TON_MNEMONIC", true) as string;

// below is constants 
export const RSETHSigner = "0x0C39486f770B26F5527BBBf942726537986Cd7eb"

// THIS IS TESTNET JETTON MASTER SC ADDRESSESS
// TODO FOR MAINNET NEEDED TO BE CHANGED
// we need it to find new tokensKeys 
export const tonId = '0:1a4219fe5e60d63af2a3cc7dce6fec69b45c6b5718497a6148e7c232ac87bd8a'
export const usdtMaster = 'EQBe4gtSQMxM5RpMYLr4ydNY72F8JkY-icZXG1NJcsju8cix'
export const usdcMaster = 'EQDaY5yUatYnHei73HBqRX_Ox9LK2XnR7XuCY9MFC2INbU2C'
export const btcMaster = 'EQA21oH5_cptX3Vc20c7_inu0G2-1zdXqwSnz8XmLpHb1mNw'
export const ethMaster = 'EQBs8kpWN3_tJlMl-z7aHLRq4uV-nKCbDovRFIGACrSt4L0e'

//current token keys 
export const usdtKey = "EQBBqFC_UWWJmAafUOIk7OLkFVydpnd0gCUvLaFhVpO_cO0s"
export const usdcKey = "EQBzsfsbt4pnZUS5Hh_yFqDfFY9aYNhwtn8Msgcdp4eOKjab"
export const btcKey = "EQDT-3Xel4IyABytZX_pp2CsKffJA-Br9Y56sAJfdbFmIG6p"
export const ethtKey = "EQCNvUKLO1L0S_h2kYYDcHSNFiEp7QYRLsI0k15PvJtdqj9o"

//todo 
export const evaaMaster = ""
export const userCode = ""

