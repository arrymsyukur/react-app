'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  ImagePicker
} from 'react-native';

import {
  Item,
  Input,
  Label,
  Form,
  Content,
  Container,
  Button,
} from 'native-base';

import Service from './util/Service';
import CannonicalPath from './conf/CannonicalPath.js';
import { onSignOut } from "./auth";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from 'react-native-popup-menu';

import UserPreferences from './util/UserPreference';
import ImageView from './util/ImageView';
import Constants from './util/Constant';

export default class Profile extends Component {

  static navigationOptions = {
    title: 'My Account'
  };

  constructor(props) {
    super(props);
    this.onSuccess.bind(this);
    this.onFailure.bind(this);
    this.state = {
      email: '',
      address: '',
      cameraOpened: false,
      base64Camera: null
    };
  }

  state = {}
  navigation = {}
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  componentDidMount() {
    console.log('did mount')
    this.cusomerInfo()

  }

  componentWillMount() {
    console.log('willMount')
    this.setState({
      cameraOpened: false
    })
  }

  componentWillReceiveProps() {
    console.log('will receive')
  }
  componentWillUnmount() {
    console.log('will unmount')
  }

  onSuccess = (method, responseCode, json) => {
    switch (method) {
      case 'CustomerInfo':
        this.setState({
          name: json.data[0].name,
          phone: json.data[0].phoneNumber,
          balance: json.data[0].qvaBalance,
          luckyDraw: json.data[0].coupons,
          point: json.data[0].points,
          email: json.data[0].email,
          birthPlace: json.data[0].birthPlace,
          birthDate: json.data[0].birthDate,
          address: json.data[0].address,
        });
        break;
      case 'EditProfile':
        Alert.alert("", "Selamat! Anda berhasil memperbaharui Profil",
          [
            { text: 'OK', onPress: () => onSignOut().then(() => this.props.navigation.navigate("SignedOut")) },
          ],
          { cancelable: false })
        break;

    }

  }

  onFailure = (method, responseCode, message) => {
    var msg = message
    if (msg == null) {
      msg = ' '
    }
    Alert.alert('', msg);
  }

  cusomerInfo = async () => {
    await this.setStateAsync({ isLoading: true });

    var params = await {
      keepAlive: true,
      method: 'GET',
      useSessionId: true,
      useAuth: true,
      canonicalPath: CannonicalPath.CUSTOMER_INFO
    };

    // 2. tembak ke server
    await this.setStateAsync({ isLoading: false });
    await Service.request(this.onSuccess, this.onFailure, 'CustomerInfo', params);

  }

  savePhotoProfile = async () => {

  }

  editProfile = async (pin) => {

    let datas = await {
      "id": UserPreferences.customerId,
      "email": this.state.email,
      "address": this.state.address,
    };


    var params = await {
      contentType: 'application/json',
      Accept: 'application/json',
      keepAlive: true,
      method: 'PUT',
      useSessionId: true,
      useAuth: true,
      data: JSON.stringify(datas),
      canonicalPath: CannonicalPath.EDIT_PROFILE
    };

    await Service.request(this.onSuccess, this.onFailure, 'EditProfile', params);
  }

  onPhotos = () => {
    this.setState({ cameraOpened: true })
    this.props.navigation.navigate(
      'Camera',
      {
        onDone: (data) =>
          // console.log('data dari camera', data)
          this.setState({ base64Camera: data, cameraOpened: false }),
        onBack: () =>
          this.setState({ cameraOpened: false })
      },

    )
  }

  onLibrary = () => {
    const options = {
      quality: 1.0,
      maxWidth: 240,
      maxHeight: 240,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({ 
          base64Camera: response.data
        })
      }
    });
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      console.log('camera data', data);
      this.setState({
        cameraOpened: false,
        base64Camera: data.base64
      })
    }
  }


  render() {
    if (this.state.cameraOpened) {
      return (
        <Container>
          {/* <RNCamera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'} />
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', }}>
            <TouchableOpacity
              onPress={this.takePicture.bind(this)}
              style={styles.capture}
            >
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View> */}
        </Container>
      )
    }

    return (
      <Content>
        <Container>
          <View style={{ padding: 15 }}>

            <Text>All fields are editable, except phone number. If you want to change your CRM PIN code, please got to Settings menu.</Text>

            <Text style={{ fontSize: 10, paddingTop: 10, paddingBottom: 5 }}>Profile Picture</Text>

            <View style={{ flexDirection: 'row' }}>
              <ImageView
                url={Constants.baseUrl}
                path={Constants.profile}
                height={70}
                width={60}
                placeholderImage={require('./img/default_avatar.png')}
                isUseAuth={true}
                base64Image={this.state.base64Camera}
              />

              <View style={{ flexDirection: 'column', width: '80%', marginTop: 5 }}>
                <MenuProvider>
                  <Menu style={{ width: 80, height: 40 }}>
                    <MenuTrigger style={{ height: 40, alignItem: 'center', justifyContent: 'center', paddingLeft: 10 }}>
                      <Text style={{ width: 80, color: 'rgba(255,0,0,1)', fontWeight: 'bold' }}>CHANGE</Text>
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption text='FOTO' onSelect={() => this.onPhotos()} />
                      <MenuOption text='LIBRARY' onSelect={() => this.onLibrary()} />
                    </MenuOptions>
                  </Menu>
                </MenuProvider>
                <Text style={{ fontSize: 10 }}>Recommended picture dimension is larger than 240 x 240 pixels</Text>
              </View>
            </View>

            <Label>Name</Label>
            <Item regular disabled style={{ marginBottom: 5, paddingBottom: 0, paddingTop: 0 }}>
              <Image source={require('./img/ic_name.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
              <Input disabled placeholder='Name' value={this.state.name} style={{ padding: 0 }} />
            </Item>
            <Label>Phone Number</Label>
            <Item regular disabled>
              <Image source={require('./img/ic_phone.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
              <Input disabled placeholder='Phone Number' value={this.state.phone} />
            </Item>
            <Label>Email</Label>
            <Item regular >
              <Image source={require('./img/ic_email.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
              <Input placeholder='Email' value={this.state.email} onChangeText={(text) => this.setState({ email: text })} />
            </Item>
            <Label>Address</Label>
            <Item regular >
              <Image source={require('./img/body_address.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
              <Input placeholder='Address' value={this.state.address} onChangeText={(text) => this.setState({ address: text })} />
            </Item>
            <Label>Birthplace</Label>
            <Item regular disabled>
              <Image source={require('./img/ic_place.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
              <Input disabled placeholder='Birthplace' value={this.state.birthPlace} />
            </Item>
            <Label>Birhtdate</Label>
            <Item regular disabled>
              <Image source={require('./img/ic_date.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
              <Input disabled placeholder='Birhtdate' value={this.state.birthDate} />
            </Item>

            <View style={{ marginTop: 20 }}>
              <Button title="SAVE CHANGES" color='rgba(216, 0, 0, 1)'
                onPress={() => this.editProfile()} />
            </View>

          </View>
        </Container>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  button: {
    width: 100,
    backgroundColor: '#DD3363',
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }

});
