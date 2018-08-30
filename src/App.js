import React from 'react';
import logo from './assets/img/logo.svg';
import './assets/css/App.css';
import './assets/css/main.css';
import './assets/css/override-primefaces.css';
import './assets/css/content-template-fixed-side-bar.css';
import Service from './Service.js';
import Dialog from 'react-dialog';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentType: 'application/json',
      method: 'POST',
      isConnectionDialog: false,
      isParamDialog: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  state = {};

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  showConnectionDialog = () => this.setState({ isConnectionDialog: true })
  closeConnectionDialog = () => this.setState({ isConnectionDialog: false })
  showParamDialog = () => this.setState({ isParamDialog: true })
  closeParamDialog = () => this.setState({ isParamDialog: false })

  render() {
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="title">Welcome to Daksa Rest Client</h1>
        </header>
        <body>
          <form >
            <div className="form-group">
              <label>Url :</label> <input className="ui-inputtext" value={this.state.url} onChange={this.handleChange} type="text" name="url" style={{ width: "85%" }} />
              <button className="ui-button" type="button" onClick={this.showConnectionDialog.bind(this)}>Setup Connection</button>
            </div>
            <div className="stacked-form">
              <div className="form-group">
                <label id="icon-content">Method</label>
                <select id="method" name="method" value={this.state.method} onChange={this.handleChange}>
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
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
                <div id="tableParam"></div>
                <button onClick={this.showParamDialog.bind(this)}>Add Param</button>
              </div>
              <div className="form-group">
                <label>Request :</label>  <textarea className="ui-inputfield" value={this.state.data} onChange={this.handleChange} name="data" style={{ width: "95%", height: 250 }} />
              </div>
            </div>

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
                <input type="text" name="baseUrl" style={{ width: "100%" }} />
              </div>
              <div className="form-group">
                <label>Canonical Path :</label>
                <input type="text" name="canonicalPath" style={{ width: "100%" }} />
              </div>
              <div className="form-group">
                <label>Authentication Type :</label>
                <select id="authType" name="authType" onChange={this.handleChange}>
                  <option value="DA01">DA01</option>
                  <option value="BASIC">BASIC</option>
                  <option value="CUSTOM">CUSTOM</option>
                </select>
              </div>
              <div className="form-group">
                <label>Username :</label>
                <input type="text" name="username" onChange={this.handleChange} style={{ width: "100%" }} />
              </div>
              <div className="form-group">
                <label>Password :</label>
                <input type="password" name="password" onChange={this.handleChange} style={{ width: "100%" }} />
              </div>
            </Dialog>
          }
        </body>
      </div >

    );
  }
}

export default App;
