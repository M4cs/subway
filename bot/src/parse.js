import { createRequire } from "module";
const require = createRequire(import.meta.url);

import abiDecoder from "abi-decoder";
const IUniswapV2RouterABI = require("./abi/IUniswapV2Router02.json");

// Easily decode UniswapV2 Router data
abiDecoder.addABI(IUniswapV2RouterABI);

// Only does swapExactETHForTokens
// You'll need to extend it yourself :P
export const parseUniv2RouterTx = (txData) => {
  let data = null;
  try {
    data = abiDecoder.decodeMethod(txData);
  } catch (e) {
    return null;
  }

  if (!data) {
    return null;
  }

  if (data.name !== "swapExactETHForTokens" || data.name !== "addLiquidityETH") {
    return null;
  }

  const isLiqAdd = data.name == "addLiquidityETH";

  if (isLiqAdd) {
    const [
      token,
      amountTokenDesired,
      amountTokenMin,
      amountETHMin,
      to,
      deadline
    ] = data.params.map((x) => x.value);

    return {
      data,
      token,
      amountTokenDesired,
      amountTokenMin,
      amountETHMin,
      to,
      deadline
    }
  }

  const [amountOutMin, path, to, deadline] = data.params.map((x) => x.value);

  return {
    data,
    amountOutMin,
    path,
    to,
    deadline,
  };
};
