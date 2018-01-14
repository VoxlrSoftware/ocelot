import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header as SemanticHeader,
  Loader,
  Segment,
} from 'semantic-ui-react';

import { Thunk } from '../../../models/Thunk';
import Page from '../../../components/Page';
import Header from '../../../components/Header';
import Confirm from '../../../components/confirm/Confirm';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { findStrategyByName } from '../../../utils/types/Company';
import CallStrategyEditor from './CallStrategyEditor';

import './Page.scss';

const displayName = 'Pages/CallStrategy';
const getClassName = getClassNameGenerator(displayName);

export default class CallStrategyPage extends Component {
  static displayName = displayName;

  static propTypes = {
    companyState: PropTypes.instanceOf(Thunk).isRequired,
    isSaving: PropTypes.bool.isRequired,
    updateCompany: PropTypes.func.isRequired,
  };

  state = {
    callStrategy: null,
    showConfirm: false,
  };

  onStrategyChange = (evt, data) => {
    this.setState({
      callStrategy: data.value,
    });
  };

  onStrategySave = (callStrategy) => {
    const {
      companyState,
      updateCompany,
    } = this.props;

    const callStrategies = companyState.data.get('callStrategies');
    const index = findStrategyByName(callStrategies, callStrategy.get('name'));

    if (index > -1) {
      const newCallStrategies = callStrategies.set(index, callStrategy);

      updateCompany({
        companyId: companyState.data.get('id'),
        newValues: {
          callStrategies: newCallStrategies.toJS(),
        },
      });
    }
  };

  getCallStrategyEditor() {
    const {
      companyState,
      isSaving,
    } = this.props;

    if (!companyState.data) {
      return <Loader active inline />;
    }

    const callStrategies = companyState.data.get('callStrategies');

    const strategy = callStrategies.find(x => x.get('name') === this.state.callStrategy);

    const editorProps = {
      callStrategy: strategy,
      isSaving,
      onStrategySave: this.onStrategySave,
    };

    return (
      <CallStrategyEditor { ...editorProps } />
    );
  }

  getCallStrategyList() {
    const {
      companyState,
      isSaving,
    } = this.props;

    if (!companyState.data) {
      return <Loader active inline />;
    }

    const callStrategies = companyState.data.get('callStrategies');

    const options = callStrategies.map((strategy, index) => {
      return {
        key: index,
        text: strategy.get('name'),
        value: strategy.get('name'),
      };
    }).toJS();

    const dropdownProps = {
      additionLabel: 'Add Strategy: ',
      allowAdditions: true,
      fluid: true,
      loading: isSaving,
      onAddItem: (e, { value }) => this.addStrategy(value),
      onChange: this.onStrategyChange,
      options,
      placeholder: 'Select Call Strategy',
      search: true,
      selection: true,
      value: this.state.callStrategy,
    };

    const deleteProps = {
      color: 'red',
      disabled: !this.state.callStrategy,
      onClick: () => this.setState({ showConfirm: true }),
    };

    const confirmDeleteProps = {
      onCancel: () => this.setState({ showConfirm: false }),
      onConfirm: () => this.deleteStrategy(this.state.callStrategy),
      prompt: 'Are you sure you want to delete the call strategy?',
      show: this.state.showConfirm,
      title: 'Confirm Deletion',
    };

    return (
      <Grid className="form-grid">
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 6 } className="label">
            Select a Strategy
          </Grid.Column>
          <Grid.Column width={ 10 }>
            <Dropdown { ...dropdownProps } />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column textAlign="right">
            <Button { ...deleteProps }>Delete</Button>
          </Grid.Column>
        </Grid.Row>
        <Confirm { ...confirmDeleteProps } />
      </Grid>
    );
  }

  addStrategy = (name) => {
    const {
      companyState,
      updateCompany,
    } = this.props;

    const strategies = companyState.data.get('callStrategies');

    const index = findStrategyByName(strategies, name);

    if (index < 0) {
      const newStrategies = strategies.push({
        name,
        phrases: [],
      });

      updateCompany({
        companyId: companyState.data.get('id'),
        newValues: {
          callStrategies: newStrategies.toJS(),
        },
      });
    }
  };

  deleteStrategy = (callStrategy) => {
    const {
      companyState,
      updateCompany,
    } = this.props;

    const strategies = companyState.data.get('callStrategies');
    const index = this.findStrategyByName(strategies, callStrategy);

    if (index > -1) {
      const newStrategies = strategies.delete(index);

      updateCompany({
        companyId: companyState.data.get('id'),
        newValues: {
          callStrategies: newStrategies.toJS(),
        },
      });
      this.setState({
        callStrategy: null,
        showConfirm: false,
      });
    }
  };

  render() {
    const {
      companyState,
    } = this.props;

    const companyName = companyState.data && companyState.data.get('Name');

    const headerProps = {
      leftHeaderText: 'Call Strategies',
      leftSubHeaderText: 'Add, remove and modify call strategies used by sales reps',
      rightHeaderText: <Link to="/company">{ companyName }</Link>,
    };

    return (
      <Page className={ getClassName() } isLoading={ companyState.isFetching }>
        <Container>
          <Header { ...headerProps } />
          <Grid className={ getClassName({ child: 'grid' }) }>
            <Grid.Row>
              <Grid.Column width={ 8 }>
                <Segment>
                  <SemanticHeader>Call Strategies</SemanticHeader>
                  <Divider />
                  <p>Call strategies are used to enable sales
                    reps to make efficient and targeted calls.</p>
                  { this.getCallStrategyList() }
                </Segment>
              </Grid.Column>
              <Grid.Column width={ 8 }>
                <Segment>
                  <SemanticHeader>Call Strategies</SemanticHeader>
                  <Divider />
                  { this.getCallStrategyEditor() }
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Page>
    );
  }
}
