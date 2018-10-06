import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


const styles = StyleSheet.create({
  container: {
    width: 400,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#999',
    flexDirection: 'row',
    width: 400,
    // height: 130,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: 200,
    height: 130,
    justifyContent: 'space-between',
  },
});


export default class Timer extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      on: false,
      sound: false,
      startedAt: 0,
      lastTickedAt: 0,
    };
    this._ticker = null;
  }

  getMsTicked = () => {
    return this.state.lastTickedAt - this.state.startedAt;
  }

  getSecondsTicked = () => {
    return Math.floor(this.getMsTicked() / 1000);
  }

  getCurrentTimeMs = () => {
    return new Date() * 1;
  }

  _tick = () => {
    this.setState({ lastTickedAt: this.getCurrentTimeMs() });
  }

  toggle = () => {
    const state = !this.state.on;
    if (state) {
      const msSinceLastStopped = this.getCurrentTimeMs() - this.state.lastTickedAt;
      this.setState({ startedAt: this.state.startedAt + msSinceLastStopped });
      // this may drift, but exact timing is not that important
      this._ticker = setInterval(() => {
        this._tick();
        if (this.state.sound) {
          const seconds = this.getSecondsTicked();
          if (seconds) { // no need to say "zero"
            this.speak('' + seconds);
          }
        }
      }, 1000);
    } else {
      clearInterval(this._ticker);
    }
    this._tick(); // needed both for storing time (if stopped) and to update time if started
    this.setState({on: state});
  }

  reset = () => {
    const now = this.getCurrentTimeMs();
    this.setState({
      startedAt: now,
      lastTickedAt: now,
    });
  }

  speak = (text) => {
    Expo.Speech.stop();
    Expo.Speech.speak(text, {
      language: "en",
      rate: 1.3,
    });
  }

  _onTimerButtonPress = () => {
    this.toggle();
  }

  _onSoundButtonPress = () => {
    this.setState(previousState => {
      return { sound: !previousState.sound };
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{width: 300, textAlign: 'center'}}>
          <Text style={{fontSize: 50}}>
            {this.getSecondsTicked()}
          </Text>
          <Text style={{fontSize: 20}}>
            s
          </Text>
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={this.state.on ? 'Stop': 'Start'}
            color={this.state.on ? 'red': null}
            onPress={this._onTimerButtonPress}
          />
          <Button
            color={this.state.sound ? 'red': null}
            title={this.state.sound ? 'Mute': 'Sound'}
            onPress={this._onSoundButtonPress}
          />
          <Button
            title='Reset'
            onPress={() => this.reset()}
          />
        </View>
      </View>
    );
  }
}
