import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import CallStrategyPage from '../components/Page';
import { getAccountCompanyId } from '../../../reducers/AccountReducer';
import { getCompanyStateSelector } from '../../../reducers/CompanyReducer';
import {
  fetchCompany,
  updateCompany,
} from '../../../actions/CompanyActions';
import {
  getIsSaving,
} from '../reducers/CallStrategyReducer';

const mapStateToProps = (state) => {
  const companyId = getAccountCompanyId(state);
  const companyState = getCompanyStateSelector(state, companyId);
  const isSaving = getIsSaving(state);

  return {
    companyId,
    companyState,
    isSaving,
  };
};

const mapDispatchToProps = {
  fetchCompany,
  updateCompany,
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


export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(CallStrategyPage));
