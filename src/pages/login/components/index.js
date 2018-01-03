import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Form,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react';
import Page from '../../../components/Page';
import { getClassNameGenerator } from '../../../utils/namespacing';

const displayName = 'Pages/Login';
const getClassName = getClassNameGenerator(displayName);

export default class LoginPage extends Component {
  static displayName = displayName;

  static propTypes = {
    error: PropTypes.bool,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggingIn: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      username: '',
    };
  }

  login = () => {
    this.props.login(this.state);
  };

  updateUser = (event, data) => {
    this.setState({
      username: data.value,
    });
  };

  updatePassword = (event, data) => {
    this.setState({
      password: data.value,
    });
  };

  render() {
    const {
      error,
      isLoggedIn,
      isLoggingIn,
    } = this.props;

    if (isLoggedIn) {
      return <Redirect to="/employee" from="/login" />;
    }

    let message;

    if (error) {
      message = <Message error header="Login Failed" content="Unable to login. Please try again." />;
    }

    return (
      <Page className={ getClassName() }>
        <Container text>
          <Header textAlign="center">Log In to Voxlr</Header>
          <Segment stacked>
            <Form onSubmit={ this.login } loading={ isLoggingIn } error>
              <Form.Input label="Username" required onChange={ this.updateUser } />
              <Form.Input label="Password" required type="password" onChange={ this.updatePassword } />
              <Button primary size="large" fluid type="submit">
                Log In
              </Button>
              { message }
            </Form>
          </Segment>
        </Container>
      </Page>
    );
  }
}
