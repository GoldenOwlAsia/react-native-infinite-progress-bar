import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import invariant from 'invariant';

const RUNNER_WIDTH = 180;
const RUNNER_HEIGHT = 8;
const runnerDuration = 1500;
const styles = StyleSheet.create({
  container: {
    height: RUNNER_HEIGHT,
    backgroundColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  runner: {
    position: 'absolute',
    height: RUNNER_HEIGHT,
    backgroundColor: '#52B370',
  },
});

const deviceWidth = Dimensions.get('window').width;

class InfiniteProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runnerPos: new Animated.Value(-RUNNER_WIDTH),
    };
    this._value = -RUNNER_WIDTH;
    this.validateDuration(props.duration);
  }

  componentWillMount() {
    this.state.runnerPos.addListener(({value}) => this._value = value);

    this.doLoop(this.makeAnimation);
  }

  validateDuration(duration) {
    if(duration) {
      invariant(
        typeof duration === 'number',
        'The duration must be a number'
      );
    }
  }

  makeAnimation(currentValue, value, duration) {
    const toValue = value === -RUNNER_WIDTH ? deviceWidth : -RUNNER_WIDTH;
    return Animated.timing(
      currentValue,
      {
        toValue,
        duration: duration || runnerDuration,
      }
    );
  }

  doLoop(animation) {
    animation(this.state.runnerPos, this._value, this.props.duration).start(() => {
      if (this._value === deviceWidth) {
        this.state.runnerPos.setValue(-RUNNER_WIDTH);
      }
      return this.doLoop(animation);
    });
  }

  render() {
    const {
      containerStyle,
      runnerStyle,
    } = this.props;
    const {
      runnerPos,
    } = this.state;

    const _containerStyle = [styles.container, containerStyle];
    const _runnerStyle = [styles.runner, runnerStyle, { left: runnerPos, top: 0, width: RUNNER_WIDTH }];

    return (
      <View style={_containerStyle}>
        <Animated.View
          style={_runnerStyle}
        />
      </View>
    );
  }
}

InfiniteProgressBar.defaultProps = {
  containerStyle: {},
  runnerStyle: {},
};

InfiniteProgressBar.propTypes = {
  containerStyle: PropTypes.any,
  runnerStyle: PropTypes.any,
};

export default InfiniteProgressBar;
