import {
  AggregatedSimData,
  ApiTransactionReviewResponse,
  ApiTransactionReviewTargettedDapp,
} from "@argent/shared"
import { Box, Flex } from "@chakra-ui/react"
import { useMemo } from "react"
import { Call } from "starknet"

import { H5, P4 } from "../Typography"
import { TransactionIcon } from "./TransactionIcon"
import { TransactionTitle } from "./TransactionTitle"

export interface DappHeaderProps {
  networkId: string
  transactions: Call[]
  transactionReview?: ApiTransactionReviewResponse
  aggregatedData?: AggregatedSimData[]
  verifiedDapp?: ApiTransactionReviewTargettedDapp
  isDeclareContract: boolean
}

export const DappHeader = ({
  networkId,
  transactions,
  transactionReview,
  aggregatedData,
  isDeclareContract,
}: DappHeaderProps) => {
  const targetedDappWebsite = useMemo(
    () =>
      transactionReview?.targetedDapp?.links.find((l) => l.name === "website"),
    [transactionReview?.targetedDapp?.links],
  )

  return (
    <Box mb="6">
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap="3"
      >
        <TransactionIcon
          networkId={networkId}
          transactionReview={transactionReview}
          aggregatedData={aggregatedData}
          verifiedDapp={transactionReview?.targetedDapp}
          isDeclareContract={isDeclareContract}
        />
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="0.5"
        >
          <H5>
            <TransactionTitle
              networkId={networkId}
              transactionReview={transactionReview}
              aggregatedData={aggregatedData}
              fallback={
                transactions.length > 1 ? "transactions" : "transaction"
              }
              isDeclareContract={isDeclareContract}
            />
          </H5>
          {targetedDappWebsite && (
            <P4 color="neutrals.300" sx={{ marginTop: 0 }}>
              {targetedDappWebsite.url}
            </P4>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
