import React, { Component } from 'react'
import { FlatList, View, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux'
import { Form, Item, Label, Input, ListItem, Body, Text, Button, Icon, Right } from 'native-base'
import { CustomCard, Layout } from '../components'
import { navigateTo } from '../components/Commons/CustomRouteActions'
import { createForm } from 'rc-form'
import _ from 'lodash'
import moment from 'moment'
import Realm from '../utils/RealmStore'
import RNGooglePlaces from 'react-native-google-places'

let auth = Realm.objects('Auth');

@connect(({ app, users, events }) => ({ ...app, users, events }))
class CreateEvent extends Component {

  constructor(props){
    super(props)

    let currentDate = moment().format('MMMM DD, YYYY')
    let currentTime = moment().format('HH:mm:ss')

    this.state = {
      date: currentDate,
      time: currentTime,
      invited: [],
      eventLocation: 'Select Event Location',
      eventLocationDetails: ''
    }
  }

  _keyExtractor = (item, index) => item.id.toString()

  eventLocationModal() {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {

      //if(_.isEmpty(place.address))
      //  console.log('Address is Empty')

		  this.setState({ eventLocation: place.address, eventLocationDetails: place })
    })
    .catch(error => console.log(error.message))
  }

  onSubmit = () => {
    navigateTo(this.props.navigation, 'ChooseFriends')
  }

  _keyExtractor = (item, index) => item.id.toString();

  componentDidMount(){
    this.props.dispatch({
      type: 'users/getUsers'
    })

    this.handleChange('event_date', this.state.date)
    this.handleChange('event_time', this.state.time)
  }

  renderRow = ({ item }) => {
    return (<ListItem>
      <Body>
        <Text>{item.fullname}</Text>
        <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
    </ListItem>)
  }

  onEventSave = () => {
    this.props.form.validateFields((error, payload) => {
      if(_.isEmpty(this.state.invited) || this.state.invited == []){
        alert('Please invite at least one user')
      }
      else {
        let newPayload = {
          payload,
          user_id: auth[0].logged_user,
          invited: this.state.invited,
          event_location: this.state.eventLocation,
          event_location_details: this.state.eventLocationDetails
        }

        this.props.dispatch({
          type: 'events/saveEvent',
          payload: newPayload,
          callback: navigateTo(this.props.navigation, 'Home'),
        })
      }
    })
  }

  onSuccess = status => {
    // if (status) {
    //   Toast.success('Event successfully created', 0.5)
    // } else {
    //   Toast.fail('Creating event failed', 1)
    // }
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  inviteUser = (data) => {
    let invitedList = this.state.invited

    const itemIdx = _.findIndex(invitedList, item => data.id === item.id)

    if(itemIdx < 0){
      invitedList.push(data)
      this.setState({ invited: invitedList })
    } else {
      invitedList.splice(itemIdx, 1)
      this.setState({ invited: invitedList })
    }
  }

  handleChange = (name, value) => {
    this.props.form.setFieldsValue({
      [name]: value
    })
  }

  checkInvitation = (data) => {
    let invitedList = this.state.invited

    const itemIdx = _.findIndex(invitedList, item => data.id === item.id)

    if(itemIdx < 0){
      return (
        <Button light small onPress={() => this.inviteUser(data)}>
          <Text>
            <Icon type="Feather" name="user-plus" style={{ fontSize: 14 }}/>
            Invite Friend
          </Text>
        </Button>
      )
    } else {
      return (
        <Button light small onPress={() => this.inviteUser(data)}>
          <Text>
            <Icon type="Feather" name="user-x" style={{ fontSize: 14 }}/>
            Cancel
          </Text>
        </Button>
      )
    }
  }

  _renderItem = ({item}) => (
    <ListItem>
      <Body>
        <Text>{item.fullname}</Text>
      </Body>
      <Right>
        {this.checkInvitation(item)}
      </Right>
    </ListItem>
  )

  render() {
    const { getFieldProps } = this.props.form

    return (
      <Layout bottomButton={this.onEventSave} bottomButtonText="Create Event">
        <CustomCard header="Fill up friendwatch details" footer style={{ backgroundColor: 'white' }}>
          <Form>
            <Item stackedLabel>
              <Label>What is the event?</Label>
              <Input
                {...getFieldProps('title')}
                placeholder="Title of event"
                onChangeText={val => this.handleChange('title', val)}
              />
            </Item>
            <Item stackedLabel>
              <Label>More event details</Label>
              <Input
                {...getFieldProps('description')}
                placeholder="More details about the event"
                onChangeText={val => this.handleChange('description', val)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Date of the event?</Label>
              <DatePicker
                {...getFieldProps('event_date')}
                style={{ alignSelf: 'flex-start' }}
                date={this.state.date}
                mode="date"
                placeholder="Select Event Date"
                format="MMMM DD, YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  this.setState({ date }, () => this.handleChange('event_date', date))
                }}
                showIcon={false}
                customStyles={{
                  dateText: {
                    fontSize: 16,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                }}
              />
            </Item>

            <Item stackedLabel>
              <Label>Time of the event?</Label>
              <DatePicker
                {...getFieldProps('event_time')}
                style={{ alignSelf: 'flex-start' }}
                date={this.state.time}
                mode="time"
                placeholder="Select Event Time"
                format="hh:mm A"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={time => {
                  this.setState({ time }, () => this.handleChange('event_time', time))
                }}
                showIcon={false}
                customStyles={{
                  dateText: {
                    fontSize: 16,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                }}
              />
            </Item>
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity onPress={() => this.eventLocationModal()}>
              <Label>Specify Event Location</Label>
              
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 30, alignSelf: 'flex-start' }}>{this.state.eventLocation}</Text>
              </TouchableOpacity>
            </Item>
          </Form>
        </CustomCard>
        <CustomCard header="Select friends to watch you" style={{ backgroundColor: 'white' }}>
          <FlatList
            data={this.props.users.records}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </CustomCard>
      </Layout>
    )
  }
}

export default createForm()(CreateEvent)
