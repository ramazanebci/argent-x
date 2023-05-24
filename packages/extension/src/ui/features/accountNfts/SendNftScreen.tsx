import { BarBackButton, NavigationContainer } from "@argent/ui"
import { BigNumber } from "ethers"
import { FC, lazy, useCallback, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { Schema, object } from "yup"

import { AddressBookContact } from "../../../shared/addressBook"
import { WalletAccount } from "../../../shared/wallet.model"
import { AddContactBottomSheet } from "../../components/AddContactBottomSheet"
import { Button } from "../../components/Button"
import Column, { ColumnCenter } from "../../components/Column"
import { AtTheRateIcon } from "../../components/Icons/AtTheRateIcon"
import { CloseIconAlt } from "../../components/Icons/CloseIconAlt"
import { AddIcon } from "../../components/Icons/MuiIcons"
import { StyledControlledTextArea } from "../../components/InputText"
import Row, { RowBetween, RowCentered } from "../../components/Row"
import { Spinner } from "../../components/Spinner"
import { routes } from "../../routes"
import { makeClickable } from "../../services/a11y"
import { useAddressBook } from "../../services/addressBook"
import {
  addressSchema,
  formatTruncatedAddress,
  isEqualAddress,
  isStarknetId,
  isValidAddress,
  normalizeAddress,
} from "../../services/addresses"
import {
  getUint256CalldataFromBN,
  sendTransaction,
} from "../../services/transactions"
import { useOnClickOutside } from "../../services/useOnClickOutside"
import { getAddressFromStarkName } from "../../services/useStarknetId"
import { H3, H5 } from "../../theme/Typography"
import { selectedAccountView } from "../../views/account"
import { useView } from "../../views/implementation/react"
import { AccountAvatar } from "../accounts/AccountAvatar"
import { getAccountImageUrl } from "../accounts/accounts.service"
import { AddressBookMenu } from "../accounts/AddressBookMenu"
import {
  AddressBookRecipient,
  AtTheRateWrapper,
  FormError,
  InputGroupAfter,
  SaveAddressButton,
  StyledAccountAddress,
} from "../accountTokens/SendTokenScreen"
import { TokenMenuDeprecated } from "../accountTokens/TokenMenuDeprecated"
import { useCurrentNetwork } from "../networks/hooks/useCurrentNetwork"
import { useYupValidationResolver } from "../settings/useYupValidationResolver"
import { useNfts } from "./useNfts"

const LazyNftModelViewer = lazy(() => import("./NftModelViewer"))

export const NftImageContainer = styled.div`
  width: 96px;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`
export const StyledForm = styled.form`
  padding: 24px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`

const ButtonSpacer = styled.div`
  display: flex;
  flex: 1;
`

export interface SendNftInput {
  recipient: string
}

export const SendNftSchema: Schema<SendNftInput> = object().required().shape({
  recipient: addressSchema,
})

export const SendNftScreen: FC = () => {
  const navigate = useNavigate()
  const { contractAddress, tokenId } = useParams()
  const account = useView(selectedAccountView)

  const { nfts = [] } = useNfts(account)

  const nft = nfts.find(
    ({ contract_address, token_id }) =>
      contract_address === contractAddress && token_id === tokenId,
  )

  const resolver = useYupValidationResolver(SendNftSchema)

  const { id: currentNetworkId } = useCurrentNetwork()
  const [addressBookRecipient, setAddressBookRecipient] = useState<
    WalletAccount | AddressBookContact
  >()
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [starknetIdLoading, setStarknetIdLoading] = useState(false)

  const accountName = useMemo(
    () =>
      addressBookRecipient
        ? "name" in addressBookRecipient
          ? addressBookRecipient.name
          : account?.name
        : undefined,
    [account?.name, addressBookRecipient],
  )

  const {
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, submitCount },
    getFieldState,
    control,
    setValue,
    watch,
    clearErrors,
    trigger,
  } = useForm<SendNftInput>({
    defaultValues: {
      recipient: "",
    },
    resolver,
  })

  const formValues = watch()
  const inputRecipient = formValues.recipient

  const validateStarknetAddress = useCallback(
    (addr: string) => isValidAddress(addr),
    [],
  )

  const validateStarknetId = useCallback((id: string) => isStarknetId(id), [])

  const validRecipientAddress =
    inputRecipient && !getFieldState("recipient").error

  const [addressBookOpen, setAddressBookOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setAddressBookOpen(false))

  const addressBook = useAddressBook(account?.networkId || currentNetworkId)

  const recipientInAddressBook = useMemo(
    () =>
      // Check if inputRecipient is in Contacts or userAccounts
      [...addressBook.contacts, ...addressBook.userAccounts].some((acc) =>
        isEqualAddress(acc.address, inputRecipient),
      ),
    [addressBook.contacts, addressBook.userAccounts, inputRecipient],
  )

  const showSaveAddressButton = validRecipientAddress && !recipientInAddressBook

  if (!account || !nft || !contractAddress || !tokenId) {
    return <Navigate to={routes.accounts()} />
  }

  const disableSubmit =
    isSubmitting || (submitCount > 0 && !isDirty) || starknetIdLoading

  const onSubmit = async ({ recipient }: SendNftInput) => {
    if (nft.contract.schema === "ERC721") {
      sendTransaction({
        to: contractAddress,
        method: "transferFrom",
        calldata: {
          from_: account.address,
          to: recipient,
          tokenId: getUint256CalldataFromBN(BigNumber.from(tokenId)), // OZ specs need a uint256 as tokenId
        },
      })
    } else {
      sendTransaction({
        to: contractAddress,
        method: "safeTransferFrom",
        calldata: {
          from_: account.address,
          to: recipient,
          tokenId: getUint256CalldataFromBN(BigNumber.from(tokenId)),
          amount: getUint256CalldataFromBN(BigNumber.from(1)),
          data_len: "0",
        },
      })
    }

    navigate(routes.accountActivity(), { replace: true })
  }

  const handleAddressSelect = (
    account?: WalletAccount | AddressBookContact,
  ) => {
    if (!account) {
      return
    }

    setAddressBookRecipient(account)
    setValue("recipient", normalizeAddress(account.address))
    setAddressBookOpen(false)
  }

  const resetAddressBookRecipient = () => {
    setAddressBookRecipient(undefined)
    setValue("recipient", "")
    clearErrors("recipient")
  }

  const handleSaveAddress = (savedContact: AddressBookContact) => {
    handleAddressSelect(savedContact)

    setBottomSheetOpen(false)
  }

  const handleStarknetIdNameInput = async (starkName: string) => {
    setStarknetIdLoading(true)

    const starkNameAddress = await getAddressFromStarkName(
      starkName,
      currentNetworkId,
    )

    setStarknetIdLoading(false)

    if (starkNameAddress && isValidAddress(starkNameAddress)) {
      handleAddressSelect({
        id: `${starkName}-${starkNameAddress}`,
        name: starkName,
        address: starkNameAddress,
        networkId: currentNetworkId,
      })
    }

    await trigger("recipient")
  }

  return (
    <>
      <AddContactBottomSheet
        open={bottomSheetOpen}
        onSave={handleSaveAddress}
        onCancel={() => setBottomSheetOpen(false)}
        recipientAddress={inputRecipient}
      />
      <NavigationContainer
        leftButton={<BarBackButton />}
        rightButton={
          <TokenMenuDeprecated tokenAddress={nft.contract_address} />
        }
        scrollContent={nft.name}
      >
        <>
          <ColumnCenter>
            <H3>{nft.name}</H3>
          </ColumnCenter>
          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Column gap="12px">
              <RowCentered>
                <NftImageContainer>
                  {nft.animation_uri ? (
                    <LazyNftModelViewer nft={nft} />
                  ) : (
                    <img src={nft.image_url_copy} alt={nft.name ?? "NFT"} />
                  )}
                </NftImageContainer>
              </RowCentered>
              <div>
                {/** TODO: refactor - same pattern used in SendTokenScreen */}
                {addressBookRecipient && accountName ? (
                  <>
                    <AddressBookRecipient
                      onDoubleClick={() => setAddressBookRecipient(undefined)}
                    >
                      <RowBetween>
                        <Row gap="16px">
                          <AccountAvatar
                            src={getAccountImageUrl(
                              accountName,
                              addressBookRecipient,
                            )}
                            size={8}
                          />
                          <Column>
                            <H5>{accountName}</H5>
                            <StyledAccountAddress>
                              {formatTruncatedAddress(
                                addressBookRecipient.address,
                              )}
                            </StyledAccountAddress>
                          </Column>
                        </Row>
                        <CloseIconAlt
                          {...makeClickable(resetAddressBookRecipient)}
                          style={{ cursor: "pointer" }}
                        />
                      </RowBetween>
                    </AddressBookRecipient>
                  </>
                ) : (
                  <div ref={ref}>
                    <StyledControlledTextArea
                      autoComplete="off"
                      control={control}
                      spellCheck={false}
                      placeholder="Recipient's address"
                      name="recipient"
                      maxRows={3}
                      style={{
                        paddingRight: "50px",
                        borderRadius: addressBookOpen ? "8px 8px 0 0" : "8px",
                      }}
                      onChange={async (e: any) => {
                        if (validateStarknetId(e.target.value)) {
                          return await handleStarknetIdNameInput(e.target.value)
                        }

                        if (validateStarknetAddress(e.target.value)) {
                          const account = addressBook.contacts.find((c) =>
                            isEqualAddress(c.address, e.target.value),
                          )
                          handleAddressSelect(account)
                        }
                      }}
                    >
                      <>
                        <InputGroupAfter>
                          {starknetIdLoading ? (
                            <Spinner size={18} />
                          ) : validRecipientAddress ? (
                            <CloseIconAlt
                              {...makeClickable(resetAddressBookRecipient)}
                              style={{ cursor: "pointer" }}
                            />
                          ) : (
                            <AtTheRateWrapper
                              type="button"
                              active={addressBookOpen}
                              {...makeClickable(() =>
                                setAddressBookOpen(!addressBookOpen),
                              )}
                            >
                              <AtTheRateIcon />
                            </AtTheRateWrapper>
                          )}
                        </InputGroupAfter>

                        {addressBookOpen && !showSaveAddressButton && (
                          <AddressBookMenu
                            addressBook={addressBook}
                            onAddressSelect={handleAddressSelect}
                          />
                        )}
                      </>
                    </StyledControlledTextArea>
                    {showSaveAddressButton && (
                      <SaveAddressButton
                        type="button"
                        onClick={() => setBottomSheetOpen(true)}
                      >
                        <AddIcon fill="#29C5FF" style={{ fontSize: "15px" }} />
                        Save address
                      </SaveAddressButton>
                    )}
                    {errors.recipient && (
                      <FormError>{errors.recipient.message}</FormError>
                    )}
                  </div>
                )}
              </div>
            </Column>
            <ButtonSpacer />
            <Button type="submit" disabled={disableSubmit}>
              Next
            </Button>
          </StyledForm>
        </>
      </NavigationContainer>
    </>
  )
}
