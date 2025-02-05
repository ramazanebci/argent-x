import { router } from "../../trpc"
import { addTokenProcedure } from "./addToken"
import { fetchTokenBalanceProcedure } from "./fetchAccountBalance"
import { fetchDetailsProcedure } from "./fetchDetails"
import { getAccountBalanceProcedure } from "./getAccountBalance"
import { getAllTokenBalancesProcedure } from "./getAllTokenBalances"
import { getCurrencyValueForTokensProcedure } from "./getCurrencyValueForTokens"
import { removeTokenProcedure } from "./removeToken"
import { swapProcedure } from "./swap"

export const tokensRouter = router({
  addToken: addTokenProcedure,
  removeToken: removeTokenProcedure,
  fetchDetails: fetchDetailsProcedure,
  fetchTokenBalance: fetchTokenBalanceProcedure,
  getAccountBalance: getAccountBalanceProcedure,
  getAllTokenBalances: getAllTokenBalancesProcedure,
  getCurrencyValueForTokens: getCurrencyValueForTokensProcedure,
  swap: swapProcedure,
})
