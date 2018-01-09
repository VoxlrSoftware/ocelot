import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Button,
  Grid,
  Input,
  Loader,
} from 'semantic-ui-react';

import { Thunk } from '../../../models/Thunk';
import SetPhoneNumberContainer from '../../../components/set-phone/SetPhoneNumberContainer';
import { getClassNameGenerator } from '../../../utils/namespacing';
import { formatPhoneNumber, getPhoneNumber } from '../../../utils/types/Calls';
import { VOXLR_PHONE } from '../../../Constants';

import './CompanyInfo.scss';

const displayName = 'Pages/CompanySettings/Info';
const getClassName = getClassNameGenerator(displayName);

export default class CompanyInfo extends Component {
  static displayName = displayName;

  static propTypes = {
    cancelSetPhoneNumber: PropTypes.func.isRequired,
    companyState: PropTypes.instanceOf(Thunk).isRequired,
    requestSetPhoneNumber: PropTypes.func.isRequired,
    setCompanyStale: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
  }

  onNumberSet = () => {
    const {
      companyState,
    } = this.props;

    const companyId = companyState.data.get('_id');
    this.props.setCompanyStale({ companyId });
  }

  getCallerID() {
    const {
      companyState,
    } = this.props;

    const companyPhone = getPhoneNumber(companyState.data);
    if (companyPhone) {
      return formatPhoneNumber(companyPhone);
    }

    return formatPhoneNumber(VOXLR_PHONE);
  }

  showModal = () => {
    this.props.requestSetPhoneNumber();
  };

  hideModal = () => {
    this.props.cancelSetPhoneNumber();
  }

  render() {
    const {
      companyState,
      showModal,
    } = this.props;

    if (!companyState.data) {
      return <Loader active inline="centered" />;
    }

    const companyName = companyState.data.get('name');
    const classes = classnames(getClassName(), 'form-grid');

    const setPhoneNumberProps = {
      currentNumber: getPhoneNumber(companyState.data),
      onClose: this.hideModal,
      onNumberSet: this.onNumberSet,
      params: {
        companyId: companyState.data.get('_id'),
      },
      show: showModal,
      validateType: 'company',
    };

    return (
      <Grid className={ classes }>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 5 } className="label">
            Company Name
          </Grid.Column>
          <Grid.Column width={ 11 }>
            { companyName }
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 5 } className="label">
            Caller ID
          </Grid.Column>
          <Grid.Column width={ 8 }>
            <Input fluid readOnly value={ this.getCallerID() } />
          </Grid.Column>
          <Grid.Column width={ 3 }>
            <Button fluid onClick={ this.showModal }>Set</Button>
          </Grid.Column>
        </Grid.Row>
        <SetPhoneNumberContainer { ...setPhoneNumberProps } />
      </Grid>
    );
  }
}
