import React from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './assets/css/content-template-fixed-side-bar.css';
import swal from 'sweetalert';


class TableParam extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            name: '',
            value: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (e) => {
        if (e.target.name === 'name') {
            this.setState({
                name: e.target.value
            });
        }
        if (e.target.name === 'value') {
            this.setState({
                value: e.target.value
            });
        }
    }
    handleSubmit = (e) => {
        if (this.state.name === "" || this.state.value === "") {
            swal('Warning', 'Please input parameters', 'warning');
        } else {
            this.state.data.push({
                name: this.state.name,
                value: this.state.value
            });
            this.setState({ name: "", value: "" });
        }
        e.preventDefault();

    }
    setLoadedParam = (param) => {
        for (var key in param) {
            var obj = {
                name: key,
                value: param[key]
            }
            this.state.data.push(obj);
        }
        console.log('Data Loaded', this.state.data);
    }
    getDataFromTable = () => {
        var urlParamData = [];
        this.state.data.map((obj) => {
            if (obj.name !== "" || obj.value !== "") {
                urlParamData.push(obj);
            }
            console.log("Data yg dikirim : ", urlParamData);
        });
        return urlParamData;
    }
    renderEditable = cellInfo => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={
                    { __html: this.state.data[cellInfo.index][cellInfo.column.id] }
                }
            />
        );
    };
    render() {
        const { data } = this.state;
        return (
            <div className='TableParam'>
                <div className='App-Intro'>
                    <form onSubmit={this.handleSubmit}>
                        <h4>Url Parameters</h4>
                        <label>
                            Name:
                            <input type='text'
                                name='name'
                                value={this.state.name}
                                onChange={this.handleChange} />
                        </label>{" "}
                        <label >
                            Value:
                            <input type='text'
                                name='value'
                                value={this.state.value}
                                onChange={this.handleChange}
                            />
                        </label>
                        <input type='submit' value='Add' />
                    </form>
                </div>
                <div>
                    <ReactTable
                        data={data}
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
        )
    }
}
export default TableParam
