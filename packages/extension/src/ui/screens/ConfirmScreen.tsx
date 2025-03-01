import { FC, FormEvent, ReactNode, useState } from "react"
import Measure from "react-measure"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Account } from "../Account"
import { ProfilePicture } from "../components/Account/ProfilePicture"
import { Button, ButtonGroupVertical } from "../components/Button"
import { Header } from "../components/Header"
import { NetworkSwitcher } from "../components/NetworkSwitcher"
import { H2 } from "../components/Typography"
import { getAccountName, useAccountMetadata } from "../states/accountMetadata"
import { getAccountImageUrl } from "../utils/accounts"

const ConfirmScreenWrapper = styled.form<{
  accountShown: boolean
  smallTopPadding: boolean
}>`
  display: flex;
  flex-direction: column;
  padding: ${({ smallTopPadding }) => (smallTopPadding ? "16px" : "48px")} 32px
    0;
  ${({ accountShown }) => (accountShown ? `padding-top: 0;` : ``)}

  > ${H2} {
    margin: 0 0 40px;
  }
`

export interface ConfirmPageProps {
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  onReject?: () => void
  selectedAccount?: Account
}

interface ConfirmScreenProps extends ConfirmPageProps {
  title: string
  rejectButtonText?: string
  confirmButtonText?: string
  disableConfirm?: boolean
  confirmButtonBackgroundColor?: string
  singleButton?: boolean
  switchButtonOrder?: boolean
  smallTopPadding?: boolean
  footer?: ReactNode
  children: ReactNode
}

export const StickyGroup = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 32px 24px;

  background-color: #161616;
  background: linear-gradient(180deg, rgba(16, 16, 16, 0.4) 0%, #161616 73.72%);
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  z-index: 100;

  > * + * {
    margin-top: 24px;
  }
`

const Placeholder = styled.div`
  width: 100%;
  margin-top: 8px;
`

export const ConfirmScreen: FC<ConfirmScreenProps> = ({
  title,
  confirmButtonText = "Confirm",
  disableConfirm = false,
  rejectButtonText = "Reject",
  confirmButtonBackgroundColor,
  onSubmit,
  onReject,
  selectedAccount,
  singleButton = false,
  switchButtonOrder = false,
  smallTopPadding = false,
  footer,
  children,
  ...props
}) => {
  const navigate = useNavigate()
  const { accountNames } = useAccountMetadata()
  const [placeholderHeight, setPlaceholderHeight] = useState(100)
  onReject ??= () => navigate(-1)

  return (
    <ConfirmScreenWrapper
      smallTopPadding={smallTopPadding}
      accountShown={Boolean(selectedAccount)}
      onSubmit={(e) => {
        e.preventDefault()
        return onSubmit?.(e)
      }}
      {...props}
    >
      {selectedAccount && (
        <Header style={{ margin: "0 -32px 16px" }}>
          <ProfilePicture
            src={getAccountImageUrl(
              getAccountName(selectedAccount, accountNames),
              selectedAccount.address,
            )}
            disabled
          />
          <NetworkSwitcher disabled />
        </Header>
      )}
      <H2>{title}</H2>

      {children}

      <Placeholder
        style={{
          height: placeholderHeight,
        }}
      />
      <Measure
        bounds
        onResize={(contentRect) => {
          const { height = 100 } = contentRect.bounds || {}
          setPlaceholderHeight(height)
        }}
      >
        {({ measureRef }) => (
          <StickyGroup ref={measureRef}>
            {footer}
            <ButtonGroupVertical switchButtonOrder={switchButtonOrder}>
              {!singleButton && (
                <Button onClick={onReject} type="button">
                  {rejectButtonText}
                </Button>
              )}
              <Button
                disabled={disableConfirm}
                style={{ backgroundColor: confirmButtonBackgroundColor }}
                type="submit"
              >
                {confirmButtonText}
              </Button>
            </ButtonGroupVertical>
          </StickyGroup>
        )}
      </Measure>
    </ConfirmScreenWrapper>
  )
}
