import { connect } from 'react-redux';
import EmployeeListPage from '../components/Page';
import { getAccountCompanyName, getAccountCompanyId } from '../../../reducers/AccountReducer';
import {
  getEndDate,
  getStartDate,
} from '../reducers/CompanyReducer';
import {
  dateRangeChanged,
} from '../actions/CompanyActions';

const mapStateToProps = (state) => {
  const companyName = getAccountCompanyName(state);
  const companyId = getAccountCompanyId(state);
  const startDate = getStartDate(state);
  const endDate = getEndDate(state);

  return {
    companyId,
    companyName,
    endDate,
    startDate,
  };
};

const mapDispatchToProps = {
  dateRangeChanged,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeListPage);
