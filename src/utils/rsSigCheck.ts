import { ethers } from "ethers";
import { toBuffer, keccak256 } from "ethereumjs-util";
import { recoverPersonalSignature } from "@metamask/eth-sig-util";
//@ts-ignore // this is shitty lib
import sortDeepObjectArrays from "sort-deep-object-arrays";
import { RSETHSigner } from "../config";

const sortDeepObjects = <T>(arr: T[]): T[] => sortDeepObjectArrays(arr);

const convertStringToBytes32String = (str: string) => {
  if (str.length > 31) {
    const bytes32StringLength = 32 * 2 + 2; // 32 bytes (each byte uses 2 symbols) + 0x
    if (str.length === bytes32StringLength && str.startsWith("0x")) {
      return str;
    } else {
      return ethers.utils.id(str);
    }
  } else {
    return ethers.utils.formatBytes32String(str);
  }
}

const serializeToMessage = (pricePackage: any): any => {
  const cleanPricesData = pricePackage.prices.map((p: any) => ({
    symbol: convertStringToBytes32String(p.symbol),
    value: Math.round(p.value * 10 ** 8),
  }));
  const sortedPrices = sortDeepObjects(cleanPricesData);
  const symbols: string[] = [];
  const values: string[] = [];
  sortedPrices.forEach((p: any) => {
    symbols.push(p.symbol);
    values.push(p.value);
  });
  return {
    symbols,
    values,
    timestamp: pricePackage.timestamp,
  };
}

const getLiteDataBytesString = (priceData: any): string => {
  let data = "";
  for (let i = 0; i < priceData.symbols.length; i++) {
    const symbol = priceData.symbols[i];
    const value = priceData.values[i];
    data += symbol.substr(2) + value.toString(16).padStart(64, "0");
  }
  data += Math.ceil(priceData.timestamp / 1000)
    .toString(16)
    .padStart(64, "0");
  return data;
}

const getLiteDataToSign = (priceData: any) => {
  const data = getLiteDataBytesString(priceData);
  return (keccak256(toBuffer("0x" + data)));
}

export const RSsigCheck = (price: any) => {
  const serializedPriceData = price.map((e: any) => ({
    ...e, serialized: serializeToMessage(
      {
        prices: [{
          symbol: e.symbol,
          value: e.value,
        }],
        timestamp: e.timestamp,
      }
    )
  }));
  console.log('-- raw data', price)
  const formatedRawDataArr = serializedPriceData.map((e: any) => ({ ...e, buff: getLiteDataToSign(e.serialized) }));
  const signersAddressesJs = formatedRawDataArr.map((e: any) => recoverPersonalSignature({
    data: e.buff,
    signature: e.liteEvmSignature,
  }))
  console.log('rs signers addresses: ', signersAddressesJs)
  const signercheck = (signersAddressesJs.filter((e: string) => e.toLowerCase() !== RSETHSigner.toLowerCase()).length === 0)
  console.log('is sig is correct', signercheck) // true means that all sigs is correct
  return signercheck;
}
