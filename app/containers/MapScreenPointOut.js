import React, { Component } from 'react';
import {
  NativeEventEmitter,
  NativeModules
} from 'react-native'

import { Container, Button, Text } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from 'react-redux'
import { backAction } from '../components/Commons/CustomRouteActions'
import { NavigationActions } from '../utils'
const GeofenceEmitter = new NativeEventEmitter(NativeModules.Geofence);

const interval = null;

@connect(({ app, events }) => ({ ...app, events }))
export default class MapScreenPointOut extends Component {
  constructor(props) {
    super(props);

    let { address, event } = this.props.navigation.state.params

    this.state = {
      region: {
        latitude: 37.3320003,
        longitude: -122.03078119999998,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      }
    }
  }

  componentDidMount(){
    //console.log(this.props)
  }

  mapPointed = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate
    this.setState({ 
      region: {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      },
      coordinate: { 
        latitude, 
        longitude 
      }
    })
  }

  onClose = () => {
    this.props.navigation.state.params.onClose(this.state.coordinate)
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Container>
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          mapType={'hybrid'}
          onPress={this.mapPointed}
          >

          <Marker
            title={'Marker Here'}
            key={'MarkerKey'}
            coordinate={this.state.coordinate}
          />

          <Button primary onPress={this.onClose}>
            <Text>Close Map</Text>
          </Button>

        </MapView>
      </Container>
    );
  }
}
