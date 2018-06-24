import React, { Component } from 'react'
import { Text, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Header,
  Left,
  Right,
  Icon,
  Body
} from 'native-base'
import { NavigationActions } from '../utils'
import { computeSize } from '../utils/DeviceRatio'
import { resetNavigateTo, backAction, newNavigate } from '../components/Commons/CustomRouteActions'
import { CustomCard, Layout, ValidationText } from '../components'

import { createForm } from 'rc-form'
import RNGooglePlaces from 'react-native-google-places'

@connect(({ auth }) => ({ ...auth }))
class RegisterUser extends Component {
  state = {
    showModal: false,
    currentHome: 'Home Location',
    currentSaved: 'Saved Location',
    currentHomeDetails: '',
    currentSavedDetails: ''
  }
  
  homeLocationModal() {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {
		  this.setState({ currentHome: place.address, currentHomeDetails: place })
    })
    .catch(error => console.log(error.message))
  }

  savedLocationModal() {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {
		  this.setState({ currentSaved: place.address, currentSavedDetails: place })
    })
    .catch(error => console.log(error.message))
  }

  showModal = key => (e) => {
    e.preventDefault()
    this.setState({
      [key]: true,
    });
  }
  
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  onRegister = () => {
    this.props.form.validateFields((error, payload) => {

      if(error){
        
      }
      else {
        if(payload.password !== payload.confirm) {
          Toast.fail('Password mismatch', 1)
        }
        else {
          alert('Passed')
          // let newPayload = {
          //   ...payload,
          //   saved_location: this.state.currentHome,
          //   home_location: this.state.currentSaved,
          //   home_location_details: this.state.currentHomeDetails,
          //   saved_location_details: this.state.currentSavedDetails
            
          // }
          // this.props.dispatch({
          //   type: 'auth/saveUser',
          //   payload: newPayload,
          //   callback: this.onSuccess,
          // })
        }
      }
    })
  }

  onSuccess = status => {
    if (status) {
      resetNavigateTo(this.props.navigation, { routeName: 'Login' })
    } else {
      alert('User registration failed')
    }
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  handleChange = (name, value) => {
    this.props.form.setFieldsValue({
			[name]: value
		})
  }

  selectLocationChange = (details) => {
    //console.log(details)
  }

  render() {
    const { fetching } = this.props
    const { getFieldProps, getFieldError } = this.props.form

    return (
      <Layout>
        <Header style={{ backgroundColor: 'transparent', borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }}>
          <Left>
            <StatusBar barStyle="dark-content" />
              <Button transparent onPress={backAction(this.props.navigation)}>
                <Icon
                  type="Feather"
                  name="arrow-left"
                  style={{ color: 'white' }}
                />
              </Button>
          </Left>
          <Body>
            <Text
              style={{
                fontSize: computeSize(45),
                fontFamily: 'OpenSans',
                color: 'white',
              }}
            >
              New User
            </Text>
          </Body>
          <Right></Right>
        </Header>
        
        <StatusBar barStyle="light-content" />

        <CustomCard header="Fill up information" style={{ paddingBottom: 20 }}>
          <Form>
            <Item floatingLabel>
              <Label>Fullname</Label>
              <Input
                {...getFieldProps('fullname', {
                    rules: [{
                      required: true,
                      message: 'Fullname is required',
                    }]
                  }
                )}
                onChangeText={val => this.handleChange('fullname', val)}
              />
            </Item>
            <ValidationText {...this.props} field='fullname' />

            <Item floatingLabel>
              <Label>Email Address</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('email', {
                  rules: [{
                    type: 'email',
                    required: true,
                    message: 'Email is empty or invalid',
                  }]
                })}
                onChangeText={val => this.handleChange('email', val)}
              />
            </Item>
            <ValidationText {...this.props} field='email' />

            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('password')}
                onChangeText={val => this.handleChange('password', val)}
                secureTextEntry
              />
            </Item>

            <Item floatingLabel>
              <Label>Confirm Password</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('confirm')}
                onChangeText={val => this.handleChange('confirm', val)}
                secureTextEntry
              />
            </Item>
                
            <Item floatingLabel>
              <Label>Contact No</Label>
              <Input
                {...getFieldProps('contact_no')}
                onChangeText={val => this.handleChange('contact_no', val)}
              />
            </Item>
            
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <Label>Home Location</Label>
              <TouchableOpacity onPress={() => this.homeLocationModal()}>
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 30, alignSelf: 'flex-start' }}>{this.state.currentHome}</Text>
              </TouchableOpacity>
            </Item>
            
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <Label>Saved Location</Label>
              <TouchableOpacity onPress={() => this.savedLocationModal()}>
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 30, alignSelf: 'flex-start' }}>{this.state.currentSaved}</Text>
              </TouchableOpacity>
            </Item>
          
          </Form>
        </CustomCard>
        

        {fetching ? (
          <Button success full block onPress={this.onRegister}>
            <ActivityIndicator color="white" />
          </Button>
        ) : (
          <Button success full block onPress={this.onRegister}>
            <Text style={{ color: 'white' }}>Save User</Text>
          </Button>
        )}
      </Layout>
    )
  }
}

export default createForm()(RegisterUser)
