import { useMemo } from "react"

import { Multisig } from "../Multisig"

/**
 * This hook checks if the current signer is in the list of signers of a multisig account
 * It is useful to verify if the current signer is part of the multisig account
 * or it has been removed
 * @param multisig A Multisig Account
 * @returns boolean
 */

export function useIsSignerInMultisig(multisig?: Multisig) {
  return useMemo(() => {
    if (!multisig) {
      return false
    }
    return multisig.signers.includes(multisig.publicKey)
  }, [multisig])
}
