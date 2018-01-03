import { connect } from 'react-redux';

import SetPhoneNumber from './SetPhoneNumber';
import {
  checkForValidationResult,
  validatePhoneNumber,
} from '../../actions/PhoneActions';
import {
  getPhoneValidation,
  getPhoneVerification,
} from '../../reducers/PhoneReducer';

const mapStateToProps = (state) => {
  const phoneValidation = getPhoneValidation(state);
  const phoneVerification = getPhoneVerification(state);

  return {
    phoneValidation,
    phoneVerification,
  };
};

const mapDispatchToProps = {
  checkForValidationResult,
  validatePhoneNumber,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPhoneNumber);
