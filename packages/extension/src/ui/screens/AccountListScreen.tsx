import AddIcon from "@mui/icons-material/Add"
import SettingsIcon from "@mui/icons-material/Settings"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { Container } from "../components/Account/AccountContainer"
import { AccountHeader } from "../components/Account/AccountHeader"
import { AccountListItem } from "../components/Account/AccountListItem"
import { Header } from "../components/Header"
import { IconButton } from "../components/IconButton"
import { NetworkSwitcher } from "../components/NetworkSwitcher"
import { RecoveryBanner } from "../components/RecoveryBanner"
import { H1, P } from "../components/Typography"
import { routes } from "../routes"
import { useAccount } from "../states/account"
import { useAppState } from "../states/app"
import { useBackupRequired } from "../states/backupDownload"
import { makeClickable } from "../utils/a11y"
import { connectAccount, deployAccount, getStatus } from "../utils/accounts"
import { recover } from "../utils/recovery"

const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 32px;
`

const AccountListWrapper = styled(Container)`
  display: flex;
  flex-direction: column;

  ${H1} {
    text-align: center;
  }

  > ${AccountList} {
    width: 100%;
  }
`

const IconButtonCenter = styled(IconButton)`
  margin: auto;
`

const Paragraph = styled(P)`
  text-align: center;
`

export const AccountListScreen: FC = () => {
  const navigate = useNavigate()
  const { switcherNetworkId } = useAppState()
  const { accounts, selectedAccount, addAccount } = useAccount()
  const { isBackupRequired } = useBackupRequired()

  const accountsList = Object.values(accounts)

  const handleAddAccount = async () => {
    useAppState.setState({ isLoading: true })
    try {
      const newAccount = await deployAccount(switcherNetworkId)
      addAccount(newAccount)
      connectAccount(newAccount)
      navigate(await recover())
    } catch (error: any) {
      useAppState.setState({ error: `${error}` })
      navigate(routes.error())
    } finally {
      useAppState.setState({ isLoading: false })
    }
  }

  return (
    <AccountListWrapper header>
      <AccountHeader>
        <Header>
          <IconButton
            size={36}
            {...makeClickable(() => navigate(routes.settings()), 99)}
          >
            <SettingsIcon />
          </IconButton>
          <NetworkSwitcher />
        </Header>
      </AccountHeader>
      <H1>Accounts</H1>
      <AccountList>
        {isBackupRequired && <RecoveryBanner noMargins />}
        {accountsList.length === 0 && (
          <Paragraph>
            No accounts on this network, click below to add one.
          </Paragraph>
        )}
        {accountsList.map((account) => (
          <AccountListItem
            key={account.address}
            account={account}
            status={getStatus(account, selectedAccount)}
            isDeleteable={switcherNetworkId === "localhost"}
            canShowUpgrade
          />
        ))}
        <IconButtonCenter size={48} {...makeClickable(handleAddAccount)}>
          <AddIcon fontSize="large" />
        </IconButtonCenter>
      </AccountList>
    </AccountListWrapper>
  )
}
