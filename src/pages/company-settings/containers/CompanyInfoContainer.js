import { connect } from 'react-redux';

import {
  cancelSetPhoneNumber,
  requestSetPhoneNumber,
} from '../../../actions/PhoneActions';
import {
  getShowSetPhoneModal,
} from '../../../reducers/PhoneReducer';
import { setCompanyStale } from '../../../actions/CompanyActions';

import CompanyInfo from '../components/CompanyInfo';

const mapStateToProps = (state) => {
  const showModal = getShowSetPhoneModal(state);

  return {
    showModal,
  };
};

const mapDispatchToProps = {
  cancelSetPhoneNumber,
  requestSetPhoneNumber,
  setCompanyStale,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfo);
