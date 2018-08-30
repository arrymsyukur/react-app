import React, {Component} from "react";
import {
    StyleSheet,
    Alert,
  } from 'react-native';

import {
    Container,
    Spinner,
} from 'native-base';

import Modal from 'react-native-modal';

import PinView from './PinView';
import Service from "../util/Service";
import Constants from "../util/Constant";
import Util from "../util/Util";
import UserPreference from '../util/UserPreference'

var contentType = 'application/json';

export default class PIN extends Component {
    constructor(props){
        super(props);
        this.onMaxLength.bind(this)
        this.onForgotPin.bind(this)
        this.state = {
            data : null,
            from : '',
            isModalLoading : false
        }
    }

    onSuccess = (method, responseCode, json) => {
        // kadie proses na!!!
        console.log('wew', "wew")
        this.onFinish()
        
        switch (method) {
            case 'Login':
                UserPreference.customerId = json.customerId
                UserPreference.sessionId = json.id
                this.props.navigation.navigate('SignedIn')
                break;
        }

    }

    onFailure = (method, responseCode, message) => {
        this.onFinish()
        console.log('method', method)
        
        // this.props.navigation.navigate('SignedIn')
        Alert.alert(message);
    }

    onLogin = async(pin) =>{
        this.setState({
            isModalLoading : true
        })
        let username = await Util.getImsi()
        console.log('username', username)
        let datas = await {
            "applicationType": "Mall SKA",
            "username": '510113501579069',
            "password": pin,
            "mmsGroupId": '103'
        };


        var params = await {
            contentType: contentType,
            Accept: contentType,
            keepAlive: true,
            method: 'POST',
            useSessionId: false,
            useAuth: true,
            data: JSON.stringify(datas),
            canonicalPath: Constants.login
        };

        await Service.request(this.onSuccess, this.onFailure, 'Login', params);
    }

    onChangeProfile = async(pin) =>{

        let username = await Util.getImsi()
        console.log('username', username)
        let datas = await {
            "applicationType": "Mall SKA",
            "username": "510113501579069",
            "password": pin,
            "mmsGroupId": '103'
        };


        var params = await {
            contentType: contentType,
            Accept: contentType,
            keepAlive: true,
            method: 'POST',
            useSessionId: false,
            useAuth: true,
            data: JSON.stringify(datas),
            canonicalPath: Constants.login
        };

        await Service.request(this.onSuccess, this.onFailure, 'Login', params);
    }

    onMaxLength = (val) => {
        console.log("tombol", val)
        if (this.state.from === 'purchase'){
            this.props.navigation.navigate('PurchaseSuccess');
        }  else if (this.state.from === 'changeProfile'){
            // this.onChangeProfile(val)
        }
        else {
            // this.props.navigation.navigate('SignedIn')

            this.onLogin(val)            
        }
    }

    onForgotPin = () => {
        this.props.navigation.navigate('ForgetPIN')
    }

    onFinish = () => {
        this.setState({
            isModalLoading : false
        })
    }

    onModalLoading = () => {
        return(
            <Modal isVisible ={this.state.isModalLoading}
                animationIn='zoomIn'
                animationOut='zoomOut'
                style ={{justifyContent:'center', alignItems:'center'}}>
                <Spinner color = 'red'/>
            </Modal>
            )
    }


    static navigationOptions = {
        title: 'PIN',
        headerTintColor: '#ffffff',
        headerStyle: {
          backgroundColor: 'rgba(216, 0, 0, 1)',
        },
        headerTitleStyle: {
          fontSize: 18,
        },
    };
    
    componentDidMount(){
        if(this.props.navigation.state.params){
            this.setState({
                data : this.props.navigation.state.params.data,
                from : this.props.navigation.state.params.from
            })
        }
    }

    componentWillUnmount(){
        this.setState({
            data : null,
            from : ''
        })
    }

    render() {
      return (
            <Container>
                <PinView
                    onMaxLength = {this.onMaxLength}
                    onForgotPin = {this.onForgotPin}
                    pinLength = {6}
                     />
                    {this.onModalLoading()}
            </Container>
      );
    }
}

const styles = StyleSheet.create({
    pinNumberButton:{
        justifyContent: 'center', 
        borderWidth: 1, 
        borderColor: '#888888', 
        width: '33%', 
        height: '100%', 
        backgroundColor: 'black'
    },
    pinNumberText:{
        textAlign: 'center', 
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold'
    }
})
