import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Chart from './Chart'
import CoinCurrentPrice from './CoinCurrentPrice'
import CoinPerformance from './CoinPerformance'
import CoinSelectBox from './CoinSelectBox'
import Footer from './Footer'
import { getData } from './selectors'
import TimeFilters from './TimeFilters'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  align-items: center;
  width: 100%;
  height: ${({ isSilverOrAbove }) => (isSilverOrAbove ? '574px' : '450px')};
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const TitleRow = styled(Row)`
  display: flex;
  flex-direction: column;
`
const PriceChart = ({ isSilverOrAbove }) => (
  <Wrapper isSilverOrAbove={isSilverOrAbove}>
    <TitleRow>
      <CoinSelectBox />
      <CoinCurrentPrice />
      <CoinPerformance />
    </TitleRow>
    <Row>
      <Chart />
      <TimeFilters />
    </Row>
    <Row>
      <Footer />
    </Row>
  </Wrapper>
)

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(PriceChart)