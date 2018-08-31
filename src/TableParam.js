import React from 'react'
class TableParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {
                columns: ['Name', 'Value'],
                rows: [{
                    'Name': 'Id',
                    'Value': '1'
                }]
            }
        }

    }
    addParam = (name, value) => {
        var rows = this.state.tableData.rows;
        var param = {
            "Name": name,
            "Value": value
        }
        rows.push(param);
        this.setState({ rows: rows });
        console.log("Current Param Table : " + rows);
    }
    render() {
        // Data
        var dataColumns = this.state.tableData.columns;
        var dataRows = this.state.tableData.rows;
        var tableHeaders = (<thead>
            <tr>
                {dataColumns.map(function (column) {
                    return <th key={column}>{column}</th>;
                })}
            </tr>
        </thead>);
        if ((this.state.tableData.rows.length > 0 ) || (this.state.tableData.rows === undefined)) {

            var tableBody = dataRows.map(function (row) {
                return (
                    <tbody key={row}>
                        <tr>
                            {dataColumns.map(function (column) {
                                return <td key={row[column]}>{row[column]}</td>;
                            })}
                        </tr>
                    </tbody>);
            }
            )
        };

        // Decorate with Bootstrap CSS
        return (<table className="table table-bordered table-hover" width="100%">
            {tableHeaders}
            {tableBody}
        </table>)
    };
}
export default TableParam
