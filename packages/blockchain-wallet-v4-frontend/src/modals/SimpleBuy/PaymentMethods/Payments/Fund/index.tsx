import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  DisplayContainer,
  DisplayIcon,
  DisplayTitle
} from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { Value } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const DisplayMoney = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 120px;
  color: ${props => props.theme.grey800};
`

const MainValue = styled(Value)`
  margin-top: 0;
  text-align: right;
  font-size: 16px;
  color: ${props => props.theme.grey900};
`
const SubValue = styled(Value)`
  margin-top: 0;
  color: ${props => props.theme.grey600};
  text-align: right;
  font-size: 14px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  value: SBPaymentMethodType
}

const Fund: React.FC<Props> = ({ value, icon, onClick }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}Fund`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <DisplayTitle>{value.currency}</DisplayTitle>
    <DisplayMoney>
      <MainValue>
        {fiatToString({
          value: convertBaseToStandard('FIAT', value.limits.max),
          unit: String(value.currency) as FiatType
        })}
      </MainValue>
      {value.limits.min && (
        <SubValue>
          {fiatToString({
            value: value.limits.min,
            unit: String(value.currency) as FiatType
          })}
        </SubValue>
      )}
    </DisplayMoney>
  </DisplayContainer>
)

export default Fund