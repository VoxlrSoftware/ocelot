import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import CompanySettingsPage from '../components/Page';
import { getAccountCompanyId } from '../../../reducers/AccountReducer';
import {
  createUser,
} from '../../../actions/UserActions';
import {
  getUserCreate,
} from '../../../reducers/UserReducer';
import { getCompanyStateSelector } from '../../../reducers/CompanyReducer';
import { fetchCompany } from '../../../actions/CompanyActions';

const mapStateToProps = (state) => {
  const companyId = getAccountCompanyId(state);
  const companyState = getCompanyStateSelector(state, companyId);
  const userCreate = getUserCreate(state);

  const isCreating = userCreate.isFetching;

  return {
    companyId,
    companyState,
    isCreating,
  };
};

const mapDispatchToProps = {
  createUser,
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


export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(CompanySettingsPage));
