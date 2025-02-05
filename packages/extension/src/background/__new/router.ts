import { createChromeHandler } from "trpc-browser/adapter"

import { getMessagingKeys } from "../keys/messagingKeys"
import { walletSingleton } from "../walletSingleton"
import { accountRouter } from "./procedures/account"
import { accountMessagingRouter } from "./procedures/accountMessaging"
import { actionRouter } from "./procedures/action"
import { addressBookRouter } from "./procedures/addressBook"
import { argentAccountRouter } from "./procedures/argentAccount"
import { multisigRouter } from "./procedures/multisig"
import { recoveryRouter } from "./procedures/recovery"
import { sessionRouter } from "./procedures/session"
import { tokensRouter } from "./procedures/tokens"
import { transactionReviewRouter } from "./procedures/transactionReview"
import { transferRouter } from "./procedures/transfer"
import { udcRouter } from "./procedures/udc"
import { backgroundActionService } from "./services/action"
import { backgroundArgentAccountService } from "./services/argentAccount"
import { backgroundMultisigService } from "./services/multisig"
import { backgroundTransactionReviewService } from "./services/transactionReview"
import { router } from "./trpc"
import { backgroundRecoveryService } from "./services/recovery"
import { addressRouter } from "./procedures/address"
import { backgroundStarknetAddressService } from "./services/address"
import { networkService } from "../../shared/network/service"

const appRouter = router({
  account: accountRouter,
  accountMessaging: accountMessagingRouter,
  action: actionRouter,
  address: addressRouter,
  addressBook: addressBookRouter,
  argentAccount: argentAccountRouter,
  multisig: multisigRouter,
  recovery: recoveryRouter,
  session: sessionRouter,
  tokens: tokensRouter,
  transactionReview: transactionReviewRouter,
  transfer: transferRouter,
  udc: udcRouter,
})

export type AppRouter = typeof appRouter

createChromeHandler({
  router: appRouter,
  createContext: async ({ req: port }) => ({
    sender: port.sender, // changes on every request
    services: {
      // services can be shared accross requests, as we usually only handle one user at a time
      wallet: walletSingleton, // wallet "service" is obviously way too big and should be split up
      actionService: backgroundActionService,
      messagingKeys: await getMessagingKeys(),
      argentAccountService: backgroundArgentAccountService,
      multisigService: backgroundMultisigService,
      recoveryService: backgroundRecoveryService,
      transactionReviewService: backgroundTransactionReviewService,
      starknetAddressService: backgroundStarknetAddressService,
      networkService,
    },
  }),
})
