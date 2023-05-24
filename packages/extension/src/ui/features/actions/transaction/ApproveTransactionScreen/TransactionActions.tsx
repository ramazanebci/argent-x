import {
  DetailAccordion,
  DetailAccordionButton,
  DetailAccordionHeader,
  DetailAccordionItem,
  DetailAccordionPanel,
  DetailAccordionRow,
} from "@argent/ui"
import { Box } from "@chakra-ui/react"
import { FC } from "react"
import { number } from "starknet"

import { entryPointToHumanReadable } from "../../../../../shared/transactions"
import { formatTruncatedAddress } from "../../../../services/addresses"
import { TransactionActionsType } from "../types"

export interface TransactionActionsProps {
  action: TransactionActionsType
}

export const TransactionActions: FC<TransactionActionsProps> = ({ action }) => {
  return (
    <Box>
      <DetailAccordionHeader>Actions</DetailAccordionHeader>
      <DetailAccordion>
        {/** Render Activate Account / Multisig Action*/}
        {action.type === "DEPLOY_ACCOUNT" && (
          <DetailAccordionItem
            key={action.payload.accountAddress}
            isDisabled={!action.payload.classHash}
          >
            <DetailAccordionButton
              label={
                action.payload.type === "multisig"
                  ? "Activate Multisig"
                  : "Activate Account"
              }
              value={formatTruncatedAddress(action.payload.accountAddress)}
            />
            <DetailAccordionPanel>
              {action.payload.classHash && (
                <DetailAccordionRow
                  label="Class hash"
                  value={
                    number.isHex(action.payload.classHash)
                      ? formatTruncatedAddress(action.payload.classHash)
                      : action.payload.classHash
                  }
                  copyValue={action.payload.classHash}
                />
              )}
            </DetailAccordionPanel>
          </DetailAccordionItem>
        )}

        {/** Render Add Argent Shield */}
        {action.type === "ADD_ARGENT_SHIELD" && (
          <DetailAccordionItem key={action.payload.accountAddress} isDisabled>
            <DetailAccordionButton
              label="Add Argent Shield"
              value={formatTruncatedAddress(action.payload.accountAddress)}
            />
            <DetailAccordionPanel />
          </DetailAccordionItem>
        )}

        {/** Render Add Argent Shield */}
        {action.type === "REMOVE_ARGENT_SHIELD" && (
          <DetailAccordionItem key={action.payload.accountAddress} isDisabled>
            <DetailAccordionButton
              label="Remove Argent Shield"
              value={formatTruncatedAddress(action.payload.accountAddress)}
            />
            <DetailAccordionPanel />
          </DetailAccordionItem>
        )}

        {/** Render INVOKE_FUNCTION Calls */}
        {action.type === "INVOKE_FUNCTION" &&
          action.payload.map((transaction, txIndex) => (
            <DetailAccordionItem
              key={txIndex}
              isDisabled={
                !transaction.calldata || transaction.calldata?.length === 0
              }
            >
              <DetailAccordionButton
                label={entryPointToHumanReadable(transaction.entrypoint)}
                value={formatTruncatedAddress(transaction.contractAddress)}
              />
              <DetailAccordionPanel>
                {transaction.calldata?.map((calldata, cdIndex) => (
                  <DetailAccordionRow
                    key={cdIndex}
                    label={`Calldata ${cdIndex + 1}`}
                    value={
                      number.isHex(calldata)
                        ? formatTruncatedAddress(calldata)
                        : calldata
                    }
                    copyValue={calldata}
                  />
                ))}
              </DetailAccordionPanel>
            </DetailAccordionItem>
          ))}
      </DetailAccordion>
    </Box>
  )
}
