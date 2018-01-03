import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';

import { getAccountCompanyId, getAccount } from '../../../reducers/AccountReducer';
import { getCompanyStateSelector } from '../../../reducers/CompanyReducer';
import { fetchCompany } from '../../../actions/CompanyActions';

import NewCallPage from '../components/Page';

const mapStateToProps = (state) => {
  const account = getAccount(state);
  const companyId = getAccountCompanyId(state);
  const companyState = getCompanyStateSelector(state, companyId);
  const company = companyState.data;
  const isLoading = companyState.isFetching;

  return {
    account,
    company,
    companyId,
    isLoading,
  };
};

const mapDispatchToProps = {
  fetchCompany,
};

const fetchFn = (props) => {
  const {
    fetchCompany,
    companyId,
  } = props;

  const promises = [
    fetchCompany(companyId),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(NewCallPage));
