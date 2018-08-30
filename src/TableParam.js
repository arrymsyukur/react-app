import React, { Component } from 'react'
class TableParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {
                columns: ['No', 'Name', 'Value'],
                rows: [{
                    'No': 1,
                    'Name': 'Id',
                    'Value': '1'
                }]
            }
        }

    }
    render() {
        // Data
        var dataColumns = this.state.tableData.columns;
        var dataRows = this.state.tableData.rows;

        var tableHeaders = (<thead>
            <tr>
                {dataColumns.map(function (column) {
                    return <th>{column}</th>;
                })}
            </tr>
        </thead>);

        var tableBody = dataRows.map(function (row) {
            return (
                <tr>
                    {dataColumns.map(function (column) {
                        return <td>{row[column]}</td>;
                    })}
                </tr>);
        });

        // Decorate with Bootstrap CSS
        return (<table className="table table-bordered table-hover" width="100%">
            {tableHeaders}
            {tableBody}
        </table>)
    };
}
export default TableParam;
