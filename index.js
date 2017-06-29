import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const runnerWidth = 180;
const runnerHeight = 8;
const runnerDuration = 1500;
const styles = StyleSheet.create({
  container: {
    height: runnerHeight,
    backgroundColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  greenBackground: {
    height: runnerHeight,
    backgroundColor: '#52B370',
    width: 200,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  text: {
    marginLeft: 3,
    fontSize: 13,
    color: '#FFFFFF',
  },
});

const deviceWidth = Dimensions.get('window').width;

class InfiniteProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingBarWidth: new Animated.Value(-runnerWidth),
    };
    this._value = -runnerWidth;
  }

  componentWillMount() {
    this.state.loadingBarWidth.addListener(({value}) => this._value = value);

    this.doLoop(this.makeAnimation);
  }

  makeAnimation(currentValue, value) {
    const toValue = value === -runnerWidth ? deviceWidth : -runnerWidth;
    return Animated.timing(
      currentValue,
      {
        toValue,
        duration: runnerDuration,
      }
    );
  }

  doLoop(animation) {
    animation(this.state.loadingBarWidth, this._value).start(() => {
      if (this._value === deviceWidth) {
        this.state.loadingBarWidth.setValue(-runnerWidth);
      }
      return this.doLoop(animation);
    });
  }

  render() {
    const {
      loadingBarWidth,
    } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            height: runnerHeight,
            backgroundColor: '#52B370',
            width: runnerWidth,
            position: 'absolute',
            left: loadingBarWidth,
            top: 0,
          }}
        />
      </View>
    );
  }
}

InfiniteProgressBar.defaultProps = {
};

InfiniteProgressBar.propTypes = {
};

export default InfiniteProgressBar;
