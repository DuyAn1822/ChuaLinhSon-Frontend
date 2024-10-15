import React from 'react'
import PropTypes from 'prop-types'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMoney } from '@coreui/icons'

const WidgetsBrand = ({ className, totalAmount, totalIncome, totalExpense }) => {
  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      <CCol sm={12} xl={4} xxl={4}>
        <CWidgetStatsD
          icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
          values={[
            { title: 'Tổng số tiền', value: `${totalAmount} VND` },
          ]}
          style={{
            '--cui-card-cap-bg': '#F25C05',
          }}
        />
      </CCol>
      <CCol sm={12} xl={4} xxl={4}>
        <CWidgetStatsD
          icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
          values={[
            { title: 'Tổng thu', value: `${totalIncome} VND` },
          ]}
          style={{
            '--cui-card-cap-bg': '#32CD32',
          }}
        />
      </CCol>
      <CCol sm={12} xl={4} xxl={4}>
        <CWidgetStatsD
          icon={<CIcon icon={cilMoney} height={52} className="my-4 text-white" />}
          values={[
            { title: 'Tổng chi', value: `${totalExpense} VND` },
          ]}
          style={{
            '--cui-card-cap-bg': '#DC143C',
          }}
        />
      </CCol>
    </CRow>
  );
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  totalAmount: PropTypes.number.isRequired,
  totalIncome: PropTypes.number.isRequired,
  totalExpense: PropTypes.number.isRequired,
}

export default WidgetsBrand
