import React, { Component } from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import {
  Header as SemanticHeader,
  Icon,
  Segment,
} from 'semantic-ui-react';
import { getClassNameGenerator } from '../utils/namespacing';

import './Header.scss';

const displayName = 'Header';
const getClassName = getClassNameGenerator(displayName);

export default class Header extends Component {
  static displayName = displayName;

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.object,
    leftHeaderText: PropTypes.node,
    leftSubHeaderText: PropTypes.node,
    rightHeaderText: PropTypes.node,
    rightSubHeaderText: PropTypes.node,
  };

  static defaultProps = {
    className: {},
  };

  render() {
    const {
      children,
      className,
      leftHeaderText,
      leftSubHeaderText,
      rightHeaderText,
      rightSubHeaderText,
    } = this.props;

    let childSegment;
    let rightHeader;

    const classes = classnames(
      getClassName(),
      className,
    );

    if (children) {
      childSegment = (
        <Segment attached key={ getClassName({ child: 'childSegment' }) }>
          { children }
        </Segment>
      );
    }

    if (rightHeaderText) {
      rightHeader = (
        <SemanticHeader.Content className={ getClassName({ child: 'pageInfo' }) }>
          { rightHeaderText }
          <SemanticHeader.Subheader>
            { rightSubHeaderText }
          </SemanticHeader.Subheader>
        </SemanticHeader.Content>
      );
    }

    return [
      <SemanticHeader as="h3" attached="top" className={ classes } key={ getClassName() }>
        { rightHeader }
        <Icon name="users" size="tiny" />
        <SemanticHeader.Content>
          { leftHeaderText }
          <SemanticHeader.Subheader>
            { leftSubHeaderText }
          </SemanticHeader.Subheader>
        </SemanticHeader.Content>
      </SemanticHeader>,
      childSegment,
    ];
  }
}
