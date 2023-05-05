// Globals
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import { logError } from "./logging.js";

const IUniswapV2PairAbi = require("./abi/IUniswapV2Pair.json");
const IUniswapV2FactoryAbi = require('./abi/IUniswapV2Factory.json');

let hasEnv = true;

const ENV_VARS = [
  "RPC_URL",
  "RPC_URL_WSS",
  "PRIVATE_KEY",
  "FLASHBOTS_AUTH_KEY",
  "SANDWICH_CONTRACT",
];

for (let i = 0; i < ENV_VARS.length; i++) {
  if (!process.env[ENV_VARS[i]]) {
    logError(`Missing env var ${ENV_VARS[i]}`);
    hasEnv = false;
  }
}

if (!hasEnv) {
  process.exit(1);
}

// Contracts
export const CONTRACTS = {
  UNIV2_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",

  // Sandwich contract
  SANDWICH: process.env.SANDWICH_CONTRACT,
};

// Helpful tokens for testing
export const TOKENS = {
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  USDC: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
};

// Providers
export const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

export const wssProvider = new ethers.WebSocketProvider(
  process.env.RPC_URL_WSS
);

export const txnProvider = new ethers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/e2399f0ccfae4151bd31fb2b1487c91e"
);

// Used to send transactions, needs ether
export const searcherWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  txnProvider
);

// Used to sign flashbots headers doesn't need any ether
export const authKeyWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  wssProvider
);

// Common contracts
export const uniswapV2Pair = new ethers.Contract(
  ethers.ZeroAddress,
  IUniswapV2PairAbi,
  searcherWallet
);

export const uniswapV2FACTORY = new ethers.Contract(
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  IUniswapV2FactoryAbi,
  searcherWallet
);
