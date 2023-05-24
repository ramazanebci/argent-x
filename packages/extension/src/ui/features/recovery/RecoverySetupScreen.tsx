import { BarCloseButton, NavigationContainer, icons } from "@argent/ui"
import { FC } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Option, OptionsWrapper } from "../../components/Options"
import { PageWrapper, Paragraph, Title } from "../../components/Page"
import { routes, useReturnTo } from "../../routes"
import { CircleIconContainer } from "./ui/CircleIconContainer"
import { ComingSoonIcon } from "./ui/ComingSoonIcon"

const { RestoreIcon } = icons

export const RecoverySetupScreen: FC = () => {
  const navigate = useNavigate()
  const returnTo = useReturnTo()
  return (
    <NavigationContainer
      rightButton={
        <BarCloseButton
          onClick={() => navigate(returnTo || routes.accountTokens())}
        />
      }
    >
      <PageWrapper>
        <Title>Set up account recovery</Title>
        <Paragraph>
          Choose one or more of the methods below to ensure you can access your
          accounts.
        </Paragraph>
        <OptionsWrapper>
          <Option
            title="With Argent guardian"
            description="Coming soon"
            disabled
            icon={<ComingSoonIcon />}
          />
          <Link to={routes.setupSeedRecovery(returnTo)}>
            <Option
              title="Save the recovery phrase"
              icon={
                <CircleIconContainer>
                  <RestoreIcon />
                </CircleIconContainer>
              }
            />
          </Link>
        </OptionsWrapper>
      </PageWrapper>
    </NavigationContainer>
  )
}
