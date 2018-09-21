import React from 'react';
import logo from './assets/img/logo-daksa.svg';
import './assets/css/App.css';
import './assets/css/main.css';
import './assets/css/override-primefaces.css';
import './assets/css/content-template-fixed-side-bar.css';
import Service from './Service.js';
import Dialog from 'react-dialog';
import TableParam from './TableParam.js';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ReactTable from 'react-table';
import FileSaver from 'file-saver';
import swal from 'sweetalert';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentType: 'application/json',
      method: 'POST',
      isConnectionDialog: false,
      isParamDialog: false,
      isHeaderDialog: false,
      responseHeader: [],
      authType: 'CUSTOM',
      dataHeader: [],
      name: '',
      value: '',
      tabIndex: 0,
    }
    this.requestParam = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeHeader = this.handleChangeHeader.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  state = {};

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  showConnectionDialog = () => { this.setState({ isConnectionDialog: true }) }
  closeConnectionDialog = () => {
    if (this.state.authType !== 'CUSTOM') {
      if (this.state.username === undefined || this.state.password === undefined) {
        swal("Warning", "Username and Password cannot Be Empty", "warning");
      } else {
        this.setState({ isConnectionDialog: false, url: this.state.baseUrl + this.state.canonicalPath });
      }
    } else {
      this.setState({ isConnectionDialog: false, url: this.state.baseUrl + this.state.canonicalPath });
    }
  }
  showParamDialog = () => { this.setState({ isParamDialog: true }) }
  closeParamDialog = () => { this.setState({ isParamDialog: false }) }
  showHeaderDialog = () => { this.setState({ isHeaderDialog: true }) }
  closeHeaderDialog = () => { this.setState({ isHeaderDialog: false }) }

  onSuccess = (headerMap, responseBody) => {
    console.log(headerMap)
    console.log('array header : ', headerMap)
    var responseheaderMap = [];

    const stringHeaderMap = JSON.stringify(headerMap)

    JSON.parse(stringHeaderMap, (key, value) => {
      if (key !== '') {
        var headers = {
          'name': key,
          'value': value
        }
        responseheaderMap.push(headers)
      }
    })
    console.log('responseHeaderMap', responseheaderMap)
    var body;
    try {
      body = JSON.stringify(JSON.parse(responseBody), null, 2);
    } catch (error) {
      body = responseBody;
    }

    this.setState({
      responseBody: body,
      tabIndex: 1,
      responseHeader: responseheaderMap
    });

  }
  onFailure = (headerMap, message) => {
    var msg = message
    if (msg == null) {
      msg = ' '
    }
    var responseheaderMap = [];

    const stringHeaderMap = JSON.stringify(headerMap)

    JSON.parse(stringHeaderMap, (key, value) => {
      if (key !== '') {
        var headers = {
          'name': key,
          'value': value
        }
        responseheaderMap.push(headers)
      }
    })
    this.setState({
      tabIndex: 1,
      responseHeader: responseheaderMap,
      responseBody: msg
    })
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
      urlParameters: this.urlParams.current.getDataFromTable(),
      headerParameters: this.getDataFromTableHeader()

    }
    console.log("Param : ", params);
    if (this.state.url === null || this.state.url === undefined) {
      swal("Warning", "Please Input URL First", "warning");
    } else {
      Service.request(this.onSuccess, this.onFailure, params);
    }
  }
  save = () => {
    //Set Url and Header Parameters
    var urlParameters = this.requestParam.current.getDataFromTable();
    var headerParameters = this.getDataFromTableHeader()

    var requestParam = {};
    var requestheader = {};
    for (var i in urlParameters) {
      requestParam[i] = urlParameters[i]
    }
    for (var x in headerParameters) {
      requestheader[x] = headerParameters[x]
    }
    var params = {
      url: this.state.baseUrl + this.state.canonicalPath,
      contentType: this.state.contentType,
      httpMethod: this.state.httpMethod,
      acceptContentType: this.state.acceptContentType,
      requestContent: this.state.requestContent,
      requestParam: requestParam,
      requestheader: requestheader,
      serviceConnection: {
        mainConnection: {
          baseUrl: this.state.baseUrl,
          username: this.state.username,
          password: this.state.password
        },
        canonicalPath: this.state.canonicalPath,
        authType: this.state.authType
      },

    }

    var blob = new Blob([JSON.stringify(params, null, 2)], { type: 'text/json;charset=utf-8' });
    FileSaver.saveAs(blob, ".json");
    // swal("Save Success", "File Has Been Successfully Saved", "success");


  }

  load = async (event) => {
    var input = event.target;
    var fr = new FileReader();
    try {
      await fr.readAsText(input.files[0]);
      fr.onload = (event) => {
        var loadedFile = JSON.parse(event.target.result);
        this.setState({
          url: loadedFile.url,
          contentType: loadedFile.contentType,
          httpMethod: loadedFile.httpMethod,
          acceptContentType: loadedFile.acceptContentType,
          requestContent: loadedFile.requestContent,
          requestParam: loadedFile.requestParam,
          requestheader: loadedFile.requestheader,
          baseUrl: loadedFile.serviceConnection.mainConnection.baseUrl,
          username: loadedFile.serviceConnection.mainConnection.username,
          password: loadedFile.serviceConnection.mainConnection.password,
          canonicalPath: loadedFile.serviceConnection.canonicalPath,
          authType: loadedFile.serviceConnection.authType

        })
        if (this.state.requestParam !== null) {
          this.requestParam.current.setLoadedParam(this.state.requestParam);
        }
        swal("Load Success", "File Has Been Successfully Loaded", "success");
        console.log("Hasil state : ", JSON.stringify(this.state, null, 2));
      };
    } catch (error) {
      swal("Load Failed", "Please Select File First!", "warning")
    }


  }
  formatJson = () => {
    try {
      this.setState({
        data: JSON.stringify(JSON.parse(this.state.requestContent), null, 2)
      });
    } catch (error) {
      swal("Formatting Failed", "Wrong Json Format", "warning");
    }
  }
  handleChangeHeader = (e) => {
    if (e.target.name === 'name') {
      this.setState({
        name: e.target.value
      });
    };
    if (e.target.name === 'value') {
      this.setState({
        value: e.target.value
      });
    };
  }

  handleSubmit = (e) => {
    if (this.state.name === "" || this.state.value === "") {
      swal('Warning', 'Please input parameters', 'warning');
    } else {
      this.state.dataHeader.push({
        name: this.state.name,
        value: this.state.value
      });
      this.setState({ name: "", value: "" });
      console.log('isi array : ', this.state.dataHeader);
    }
    e.preventDefault();
  }

  getDataFromTableHeader = () => {
    var headerParamData = [];
    this.state.dataHeader.map((obj) => {
      if (obj.name !== "" || obj.value !== "") {
        headerParamData.push(obj);
      }
      console.log("Data yg dikirim : ", headerParamData);
    });
    return headerParamData;
  }

  openFileDialog = () => {
    this.refs.loadFileOpen.click();
  }
  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={e => {
          const dataHeader = [...this.state.dataHeader];
          dataHeader[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ dataHeader });
        }}
        dangerouslySetInnerHTML={
          { __html: this.state.dataHeader[cellInfo.index][cellInfo.column.id] }
        }
      />
    );
  };
  handleSelect = (key) => {
    this.setState({
      key
    })
  }
  render() {
    const { dataHeader, responseHeader } = this.state;
    return (
      <div className="App">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
          <h4 className="App-title" >Daksa Rest Client</h4>

          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous" />
        </header>

        <form >
          <Tabs
            forceRenderTabPanel={true}
            selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            <TabList>
              <Tab title='Request'>
                Request
              </Tab>
              <Tab title='Response'>
                Response
              </Tab>
            </TabList>
            <TabPanel>
              <div className="form-group">
                <label>Url </label>
                <input className="ui-inputtext"
                  value={this.state.url}
                  onChange={this.handleChange}
                  type="text" name="url" style={{ width: "75%" }}
                  readOnly={true} />
                <button className="ui-button" style={{ marginLeft: 10 }} type="button" onClick={this.showConnectionDialog.bind(this)}>Setup Connection</button>

                <button className="ui-button" type="button" onClick={this.showHeaderDialog.bind(this)}>Add Header</button>
              </div>
              <div className="stacked-form">
                <div className="form-group">
                  <label id="icon-content" >Method</label>
                  <select id="method" name="httpMethod" value={this.state.method} onChange={this.handleChange} style={{ margin_left: 32 }}>
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select><br></br>
                  <label>Accept Type </label>
                  <input type="text" name="acceptContentType" onChange={this.handleChange} style={{ width: "50%" }} />
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
                  <TableParam ref={this.requestParam} />
                </div>
                <div className="form-group">
                  <label>Request </label>  <textarea className="ui-inputfield"
                    value={this.state.requestContent}
                    onChange={this.handleChange}
                    name="requestContent"
                    style={{ width: "95%", height: "85%" }} />
                  <button className="ui-button" onClick={this.formatJson.bind(this)} type="button">Format Json</button>
                </div>
                <hr className="invisible-form-group-separator" />
                <div>
                  <button className="ui-button-mini"
                    style={{ marginLeft: 20 }}
                    onClick={this.save.bind(this)}
                    type="button" >
                    <i className="fas fa-save"></i> SAVE</button>
                  <input id="loadFile" ref='loadFileOpen' type='file' style={{ display: 'none' }} accept='text/json' onChange={this.load.bind(this)} />
                  <button type="button" className="ui-button-mini" style={{ marginLeft: 20 }} onClick={this.openFileDialog.bind(this)}>
                    <label style={{ color: "white", width: '100%', height: '100%' }}><i className="fas fa-folder-open"></i> LOAD</label>
                  </button>
                </div>
                <div>
                  <button className="ui-button-mini" style={{ marginRight: 20 }} onClick={this.sendRequest.bind(this)} type="button" >SEND</button>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="form-group">
                <div id="tableResponseheader">
                  <ReactTable
                    data={responseHeader}
                    defaultPageSize={5}

                    columns={[
                      {
                        Header: 'Name',
                        accessor: 'name'
                      },
                      {
                        Header: 'Value',
                        accessor: 'value'
                      }

                    ]} />
                </div>
              </div>
              <div className="form-group">
                <label>Response  </label> <textarea className="ui-inputfield"
                  value={this.state.responseBody}
                  onChange={this.handleChange}
                  readOnly={true}
                  name="responseBody"
                  style={{ width: "95%", height: 250 }} />
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
              <input type="text" name="baseUrl"
                value={this.state.baseUrl}
                onChange={this.handleChange}
                style={{ width: "100%" }} />
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
        }{
          this.state.isHeaderDialog &&
          <Dialog
            modal={true}
            width={800}
            height={430}
            isDraggable={true}
            buttons={
              [{
                text: "Close",
                onClick: () => this.closeHeaderDialog()
              }
              ]
            }>
            <div>
              <div className='TableHeader'>
                <div className='App-Intro'>
                  <form onSubmit={this.handleSubmit}>
                    <h4 style={{ marginLeft: 20 }}>Header Parameters</h4>
                    <label style={{ marginLeft: 20 }}>
                      Name:
                            <input type='text'
                        name='name'
                        value={this.state.name}
                        onChange={this.handleChangeHeader} />
                    </label>{" "}
                    <label>
                      Value:
                            <input type='text'
                        name='value'
                        value={this.state.value}
                        onChange={this.handleChangeHeader} />
                    </label>
                    <input type='submit' value='Add' />
                  </form>
                </div>
                <div>
                  <ReactTable
                    data={dataHeader}
                    columns={[
                      {
                        Header: 'Name',
                        accessor: 'name',
                        Cell: this.renderEditable
                      },
                      {
                        Header: 'Value',
                        accessor: 'value',
                        Cell: this.renderEditable
                      }
                    ]}
                    defaultPageSize={5}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        }
      </div >

    );
  }
};


export default App;
