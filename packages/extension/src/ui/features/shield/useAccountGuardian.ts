import { useMemo, useRef } from "react"
import useSWR from "swr"

import { withGuardianSelector } from "../../../shared/account/selectors"
import { WalletAccount } from "../../../shared/wallet.model"
import { getAccountIdentifier } from "../../../shared/wallet.service"
import { isEqualAddress } from "../../services/addresses"
import { getPublicKey } from "../../services/backgroundAccounts"
import { withPolling } from "../../services/swr"
import { allAccountsView } from "../../views/account"
import { useView } from "../../views/implementation/react"

export const useAccountsWithGuardian = () => {
  const allAccounts = useView(allAccountsView)

  const filteredAccounts = useMemo(
    () => allAccounts.filter(withGuardianSelector),
    [allAccounts],
  )

  return filteredAccounts
}

export const useAccountGuardianIsSelf = (account?: WalletAccount) => {
  const publicKey = useRef<string>()
  const { data: accountGuardianIsSelf = null } = useSWR(
    account ? [getAccountIdentifier(account), "accountGuardianIsSelf"] : null,
    async () => {
      if (!account?.guardian) {
        return false
      }
      if (!publicKey.current) {
        publicKey.current = await getPublicKey(account)
      }
      const accountGuardianIsSelf = isEqualAddress(
        account.guardian,
        publicKey.current,
      )
      return accountGuardianIsSelf
    },
    {
      ...withPolling(1000) /** 1 second - purely cosmetic */,
    },
  )
  return accountGuardianIsSelf
}
