import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Container,
  Divider,
  Grid,
  Header as SemanticHeader,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { getProfileName } from '../../../utils/types/User';
import { formatPhoneNumber } from '../../../utils/types/Calls';

import Page from '../../../components/Page';
import Header from '../../../components/Header';
import AudioPlayer from '../../../components/media/AudioPlayer';
import CustomerTalkAnaysis from './CustomerTalkAnaysis';
import CallStrategyAnalysis from './CallStrategyAnalysis';
import Info from './Info';

import './Page.scss';

const displayName = 'Pages/Call';
const getClassName = getClassNameGenerator(displayName);

export default class CallPage extends Component {
  static displayName = displayName;

  static propTypes = {
    call: ImmutablePropTypes.map,
    companyName: PropTypes.string,
    employee: ImmutablePropTypes.map,
    isLoading: PropTypes.bool,
  };

  render() {
    const {
      call,
      companyName,
      employee,
      isLoading,
    } = this.props;

    const customerNumber = call ?
      formatPhoneNumber(call.get('phoneNumber')) :
      <Loader active inline size="mini" />;

    const employeeLink = employee ?
      <Link to={ `/employee/${employee.get('_id')}` }>{ getProfileName(employee) }</Link> :
      <Loader active inline size="mini" />;

    const companyLink = <Link to="/company">{ companyName }</Link>;

    const headerProps = {
      leftHeaderText: 'Call Detail',
      leftSubHeaderText: 'View details of a call',
      rightHeaderText: customerNumber,
      rightSubHeaderText: (<span>
        { employeeLink } ({ companyLink })
      </span>),
    };

    const recordingUrl = call && call.get('recordingUrl');

    return (
      <Page isLoading={ isLoading }>
        <Container>
          <Header { ...headerProps } />
          <Grid columns={ 2 } stackable className={ getClassName({ child: 'callGrid' }) }>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <SemanticHeader className={ getClassName({ child: 'header' }) }><Icon name="info" />Call Details</SemanticHeader>
                  <Divider />
                  <Info call={ call } />
                </Segment>
                <Segment>
                  <SemanticHeader className={ getClassName({ child: 'header' }) }><Icon name="phone" />Recording</SemanticHeader>
                  <Divider />
                  <AudioPlayer src={ recordingUrl } />
                </Segment>
                <Segment>
                  <SemanticHeader className={ getClassName({ child: 'header' }) }><Icon name="wait" />Customer Talk Ratio</SemanticHeader>
                  <Divider />
                  <CustomerTalkAnaysis call={ call } />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <SemanticHeader className={ getClassName({ child: 'header' }) }><Icon name="line chart" />Call Strategy</SemanticHeader>
                  <Divider />
                  <CallStrategyAnalysis call={ call } />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Page>
    );
  }
}
