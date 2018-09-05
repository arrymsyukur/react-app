import React, { createRef } from 'react';
import logo from './assets/img/logo.svg';
import './assets/css/App.css';
import './assets/css/main.css';
import './assets/css/override-primefaces.css';
import './assets/css/content-template-fixed-side-bar.css';
import Service from './Service.js';
import Dialog from 'react-dialog';
import TableParam from './TableParam.js';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentType: 'application/json',
      method: 'POST',
      isConnectionDialog: false,
      isParamDialog: false,
      responseHeader: [],
      authType: 'DA01'
    }
    this.urlParams = createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  state = {};

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  showConnectionDialog = () => { this.setState({ isConnectionDialog: true }) }
  closeConnectionDialog = () => { this.setState({ isConnectionDialog: false, url: this.state.baseUrl + this.state.canonicalPath }) }
  showParamDialog = () => { this.setState({ isParamDialog: true }) }
  closeParamDialog = () => { this.setState({ isParamDialog: false }) }
  onSuccess = (responseCode, json) => {

    this.setState({
      responseBody: JSON.stringify(JSON.parse(json), null, 2)
    });

  }

  onFailure = (responseCode, message) => {
    var msg = message
    if (msg == null) {
      msg = ' '
    }
    alert('', msg);
  }
  sendRequest = () => {
    var params = {
      contentType: this.state.contentType,
      Accept: this.state.acceptType,
      keepAlive: true,
      method: this.state.method,
      useAuth: true,
      data: JSON.stringify(this.state.data),
      canonicalPath: this.state.canonicalPath,
      url: this.state.baseUrl + this.state.canonicalPath,
      username: this.state.username,
      password: this.state.password,
      authType: this.state.authType,
      urlParameters: this.urlParams.current.getDataFromTable()
    }
    console.log("Param : ", params);
    Service.request(this.onSuccess, this.onFailure, params);
  }
  formatJson = () => {
    try {
      this.setState({
        data: JSON.stringify(JSON.parse(this.state.data), null, 2)
      });
    } catch (error) {
      alert("Wrong Json Format");
    }
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="title">Welcome to Daksa Rest Client</h1>
        </header>

        <form >
          <Tabs>
            <TabList>
              <Tab>Request</Tab><Tab>Response</Tab>
            </TabList>
            <TabPanel>
              <div className="form-group">
                <label>Url </label> <input className="ui-inputtext" value={this.state.url} onChange={this.handleChange} type="text" name="url" style={{ width: "85%" }} />
                <button className="ui-button" type="button" onClick={this.showConnectionDialog.bind(this)}>Setup Connection</button>
              </div>
              <div className="stacked-form">
                <div className="form-group">
                  <label id="icon-content" >Method</label>
                  <select id="method" name="method" value={this.state.method} onChange={this.handleChange} style={{ margin_left: 32 }}>
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select><br></br>
                  <label>Accept Type </label>
                  <input type="text" name="acceptType" onChange={this.handleChange} style={{ width: "50%" }} />
                </div>
                <div className="form-group">
                  <label id="icon-content">Content-Type</label>
                  <select id="contentType" name="contentType" value={this.state.contentType} onChange={this.handleChange}>
                    <option value="application/json">Application/Json</option>
                    <option value="application/pdf">Application/Pdf</option>
                    <option value="application/octet-stream">Application/Octet-Stream</option>
                  </select>
                </div>
                <div className="form-group">
                  <TableParam ref={this.urlParams} />
                </div>
                <div className="form-group">
                  <label>Request </label>  <textarea className="ui-inputfield" value={this.state.data} onChange={this.handleChange} name="data" style={{ width: "95%", height: 250 }} />
                  <button onClick={this.formatJson.bind(this)} type="button">Format Json</button>
                </div>
                <hr className="invisible-form-group-separator" />
                <button onClick={this.sendRequest.bind(this)} type="button" >SEND</button>
              </div>
            </TabPanel>
            <TabPanel >
              <div className="form-group">
                <div id="tableResponseheader">
                </div>
              </div>
              <div className="form-group">
                <label>Response  </label> <textarea className="ui-inputfield" value={this.state.responseBody} onChange={this.handleChange} name="responseBody" style={{ width: "95%", height: 250 }} />
              </div>

            </TabPanel>

          </Tabs>

        </form>
        {
          this.state.isConnectionDialog &&
          <Dialog
            title="Connection Setup"
            width={500}
            height={550}
            isDraggable={true}
            isResizeable={true}
            hasCloseIcon={true}
            onClose={this.closeConnectionDialog}
            buttons={
              [{
                text: "Close",
                onClick: () => this.closeConnectionDialog()
              }]
            }>
            <div className="form-group">
              <label>Base URL :</label>
              <input type="text" name="baseUrl" value={this.state.baseUrl} onChange={this.handleChange} style={{ width: "100%" }} />
            </div>
            <div className="form-group">
              <label>Canonical Path :</label>
              <input type="text" name="canonicalPath" value={this.state.canonicalPath} onChange={this.handleChange} style={{ width: "100%" }} />
            </div>
            <div className="form-group">
              <label>Authentication Type :</label>
              <select id="authType" name="authType" value={this.state.authType} onChange={this.handleChange}>
                <option value="DA01">DA01</option>
                <option value="BASIC">BASIC</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username :</label>
              <input type="text" name="username" onChange={this.handleChange} value={this.state.username} style={{ width: "100%" }} />
            </div>
            <div className="form-group">
              <label>Password :</label>
              <input type="password" name="password" onChange={this.handleChange} style={{ width: "100%" }} />
            </div>
          </Dialog>
        }
        {
          this.state.isParamDialog &&
          <Dialog
            title="Add Url Parameters"
            modal={true}
            isDraggable={true}
            buttons={
              [{
                text: "Add",
                onClick: () => this.addParam()
              }, {
                text: "Close",
                onClick: () => this.closeParamDialog()
              }
              ]
            }>
            <div className="form-group">
              <label>Name :</label>
              <input type="text" name="paramName" onChange={this.handleChange} style={{ width: "100%" }} />
            </div>
            <div className="form-group">
              <label>Value :</label>
              <input type="text" name="paramValue" onChange={this.handleChange} style={{ width: "100%" }} />
            </div>
          </Dialog>
        }
      </div >

    );
  }
};


export default App;
