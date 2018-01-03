import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
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
import { getStrategyByName } from '../../../utils/types/Company';

import { PageWithScripts } from '../../../components/Page';
import Header from '../../../components/Header';
import CallStrategyList from '../../../components/CallStrategyList';
import CreateCallContainer from '../containers/CreateCallContainer';

import './Page.scss';

const displayName = 'Pages/NewCall';
const getClassName = getClassNameGenerator(displayName);
const Page = PageWithScripts('//media.twiliocdn.com/sdk/js/client/v1.4/twilio.min.js');

export default class NewCallPage extends Component {
  static displayName = displayName;

  static propTypes = {
    account: ImmutablePropTypes.map,
    company: ImmutablePropTypes.map,
    isLoading: PropTypes.bool,
  };

  state = {
    selectedStrategy: null,
  };

  onStrategySelected = (selectedStrategy) => {
    this.setState({
      selectedStrategy,
    });
  };

  getCallStrategyList() {
    const {
      company,
    } = this.props;

    if (!company) {
      return <Loader active inline />;
    }

    const callStrategies = company.get('callTemplates');
    const callStrategy = getStrategyByName(callStrategies, this.state.selectedStrategy);

    const callStrategyListProps = {
      callStrategy,
    };

    return (
      <CallStrategyList { ...callStrategyListProps } />
    );
  }

  getCreateCall() {
    const {
      account,
      company,
    } = this.props;

    if (!company) {
      return <Loader active inline />;
    }

    const createCallProps = {
      account,
      company,
      onStrategySelected: this.onStrategySelected,
      selectedStrategy: this.state.selectedStrategy,
    };

    return (
      <CreateCallContainer { ... createCallProps } />
    );
  }

  render() {
    const {
      company,
      isLoading,
    } = this.props;

    const companyName = company && company.get('Name');

    const companyLink = <Link to="/company">{ companyName }</Link>;

    const headerProps = {
      leftHeaderText: 'New Call',
      leftSubHeaderText: 'Start a new call to a client',
      rightHeaderText: companyLink,
    };

    return (
      <Page isLoading={ isLoading }>
        <Container>
          <Header { ...headerProps } />
          <Grid columns={ 2 } stackable className={ getClassName({ child: 'callGrid' }) }>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <SemanticHeader className={ getClassName({ child: 'header' }) }><Icon name="phone" />Make a Call</SemanticHeader>
                  <Divider />
                  { this.getCreateCall() }
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <SemanticHeader className={ getClassName({ child: 'header' }) }><Icon name="line chart" />Call Strategy</SemanticHeader>
                  <Divider />
                  <p>
                  These are questions and comments that your manager
                  requires to be said on each call
                  </p>
                  { this.getCallStrategyList() }
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Page>
    );
  }
}
