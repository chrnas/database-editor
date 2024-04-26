import { Component, ViewChild } from '@angular/core';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { utils, writeFile } from 'xlsx';
import { QueryCreatorService } from '../query-creator.service';
import { ColumnCreatorService } from '../column-creator.service';
import { NewColumnDialog } from './new-column-dialog';
import { MatDialog } from '@angular/material/dialog';
import { NewTableDialog } from './new-table-dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import exportFromJSON, { ExportType } from 'export-from-json';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
  private baseUrl: string = 'http://localhost:3000/';
  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [];
  public rowHeight = 25;
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    editable: true,
    floatingFilter: true,
    resizable: true,
    autoHeight: false,
    cellStyle: { 'border-right': '1px dotted' },
  };

  public queryCreator: QueryCreatorService = new QueryCreatorService();
  public columnCreator: ColumnCreatorService = new ColumnCreatorService();
  public dataTypes: any[] = [];
  public tableNames: any[] = [];
  public selectedTableName = 'tambours';
  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]> | undefined;

  public idCountNumber$: number | undefined;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi!: GridApi<any>;
  public selectedNewDataType: any;
  public selectedNewColumnName: any;
  public tables: Observable<any> | undefined;
  selectedColumn: any;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  onGridReady(params: GridReadyEvent) {
    console.log(this.tableNames);
    this.gridApi = params.api;
    this.setColumns();
    this.setData();
    this.setRowCount();
  }

  refreshGridInfo() {
    console.log(this.tableNames);
  }

  setColumns() {
    const config = {
      params: {
        Query: `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${this.selectedTableName}';`,
      },
    };
    this.columnDefs = [];
    this.http
      .get<any[]>(this.baseUrl + 'queryresult', config)
      .forEach((result) =>
        result.forEach((row) =>
          this.columnDefs.push(
            this.columnCreator.getColumnDefinition(
              row.data_type,
              row.column_name
            )
          )
        )
      )
      .then((error) => this.setColumnsUpdate());
  }

  setColumnsUpdate() {
    this.gridApi.setColumnDefs(this.columnDefs);
    this.agGrid.columnApi.autoSizeAllColumns();
  }

  setData() {
    const config = {
      params: {
        Query: `SELECT * FROM ${this.selectedTableName}`,
      },
    };
    this.rowData$ = this.http.get<any[]>(this.baseUrl + 'queryresult', config);
  }

  setRowCount() {
    const config = {
      params: {
        Query: `SELECT COUNT(*) FROM ${this.selectedTableName}`,
      },
    };
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).subscribe(
      (result: any[] | undefined) => {
        this.idCountNumber$ = Number(result![0].count);
      },
      (error: any) => console.error(error)
    );
  }

  init() {
    this.tableNames = [];
    const config = {
      params: {
        Query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      },
    };
    this.http
      .get<any[]>(this.baseUrl + 'queryresult', config)
      .forEach((result) =>
        result.forEach((row) => this.tableNames!.push(row.table_name))
      )
      .then((error) => this.initGrid());
  }

  initFirst() {
    this.initTableInfo();
  }

  initTableInfo() {
    this.tableNames = [];
    const config = {
      params: {
        Query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      },
    };
    this.http
      .get<any[]>(this.baseUrl + 'queryresult', config)
      .forEach((result) =>
        result.forEach((row) => this.tableNames!.push(row.table_name))
      )
      .then((error) => this.initColumns());
  }

  initColumns() {
    const config = {
      params: {
        Query: `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${this.selectedTableName}';`,
      },
    };
    this.columnDefs = [];
    this.http
      .get<any[]>(this.baseUrl + 'queryresult', config)
      .forEach((result) =>
        result.forEach((row) =>
          this.columnDefs.push(
            this.columnCreator.getColumnDefinition(
              row.data_type,
              row.column_name
            )
          )
        )
      )
      .then((error) => this.initColumnsUpdate());
  }

  initColumnsUpdate() {
    this.gridApi.setColumnDefs(this.columnDefs);
    this.initDataInfo();
  }

  initDataInfo() {
    const config = {
      params: {
        Query: `SELECT * FROM ${this.selectedTableName}`,
      },
    };
    this.rowData$ = this.http.get<any[]>(this.baseUrl + 'queryresult', config);
    this.initRowCount();
  }

  initRowCount() {
    const config = {
      params: {
        Query: `SELECT COUNT(*) FROM ${this.selectedTableName}`,
      },
    };
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).subscribe(
      (result: any[] | undefined) => {
        this.idCountNumber$ = Number(result![0].count);
      },
      (error: any) => console.error(error)
    );
  }

  initGrid() {
    console.log(this.tableNames);
    this.setColumns();
    this.setData();
    this.setRowCount();
  }

  // Example of consuming Grid Event
  onCellClicked(e: CellClickedEvent): void {
    this.selectedColumn = e.column;
  }

  onCellValueChanged(cell: CellValueChangedEvent) {
    var row = this.gridApi.getRowNode(String(cell.rowIndex));
    if (cell.oldValue == null) {
      console.log('oldValue changed from null');
      var oldValueQueryPart = 'IS NULL';
    } else {
      var oldValueQueryPart = "= '" + cell.oldValue + "'";
    }
    const config = {
      params: {
        Query: `UPDATE ${this.selectedTableName} SET ${cell.colDef.field} = '${cell.newValue}' WHERE ${cell.colDef.field} ${oldValueQueryPart} AND id = '${row?.data.id}'`,
      },
    };
    this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  onAddNewTable() {
    this.openNewTableDialog();
    this.loadData();
  }

  addNewTable(tableName: any) {
    console.log(tableName);
    const config = {
      params: {
        Query: `CREATE TABLE ${tableName}()`,
      },
    };
    console.log(config);
    return this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  deleteSelectedTable() {
    this.deleteTable(this.selectedTableName);
    this.init();
  }

  deleteTable(table: any) {
    const config = {
      params: {
        Query: `DROP TABLE ${table}`,
      },
    };
    console.log(config);
    return this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  loadData() {
    this.setColumns();
    this.setData();
    console.log(this.agGrid.rowData);
  }

  addRow(row: any) {
    var values = this.queryCreator.getSqlValuesQueryPart(Object.values(row));
    var columns = this.queryCreator.getSqlColumnsQueryPart(Object.keys(row));
    const config = {
      params: {
        Query: `INSERT INTO ${this.selectedTableName} (${columns}) VALUES (${values})`,
      },
    };
    console.log(config);
    return this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  deleteRow(row: any) {
    const config = {
      params: {
        Query: `DELETE FROM ${this.selectedTableName} WHERE  id = '${row.id}'`,
      },
    };
    console.log(config);
    return this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  addEmptyRow() {
    this.idCountNumber$! += 1;
    this.addRow({ id: this.idCountNumber$ });
    this.gridApi.applyTransactionAsync({ add: [{ id: this.idCountNumber$! }] });
  }

  copySelectedRows() {
    var selectedRows = this.gridApi.getSelectedRows();
    for (let i = 0; i < selectedRows.length; i++) {
      this.idCountNumber$! += 1;
      const selectedRow = selectedRows[i];
      selectedRow.id.delete;
      selectedRow.id = this.idCountNumber$;
      this.addRow(selectedRow);
      this.gridApi.applyTransactionAsync({ add: [selectedRow] });
    }
  }

  deleteSelectedRows() {
    var selectedRows = this.gridApi.getSelectedRows();
    for (let i = 0; i < selectedRows.length; i++) {
      this.idCountNumber$! -= 1;
      const selectedRow = selectedRows[i];
      this.deleteRow(selectedRow);
      this.gridApi.applyTransactionAsync({ remove: [selectedRow] });
    }
  }

  onAddColumn() {
    this.openNewColumnDialog();
    this.loadData();
  }

  onDeleteColumn() {
    console.log(this.selectedColumn.colId);
    this.deleteColumn(this.selectedColumn.colId);
    this.loadData();
  }

  exportExcel() {
    const worksheet = utils.json_to_sheet(this.agGrid.api.getSelectedRows());
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'TableData');
    writeFile(workbook, 'TableData.xlsx', { compression: true });
  }

  exportCsv() {
    let data = this.gridApi.getSelectedRows();
    console.log(data);
    let fields = this.getAllHeaders();
    let fileName: string = 'table';
    let exportType: ExportType = 'csv';
    exportFromJSON({ data, fileName, fields, exportType });
  }

  exportJson() {
    let data = this.gridApi.getSelectedRows();
    console.log(data);
    let fields = this.getAllHeaders();
    let fileName: string = 'table';
    let exportType: ExportType = 'json';
    exportFromJSON({ data, fileName, fields, exportType });
  }

  exportPdf() {
    const doc = new jsPDF();
    console.log(this.getSelectedRowsAsMatrices());
    console.log(this.getAllHeaders());
    autoTable(doc, {
      head: [this.getAllHeaders()],
      body: this.getSelectedRowsAsMatrices(),
    });

    doc.save('table.pdf');
  }

  logSelectedRows() {
    console.log(this.gridApi.getSelectedRows());
  }

  getAllRowsAsMatrice() {
    let rowData: any[] = [];
    this.gridApi.forEachNode((node) => rowData.push(Object.values(node.data)));
    return rowData;
  }

  getAllRows() {
    let rowData: any[] = [];
    this.gridApi.forEachNode((node) => rowData.push(node.data));
    return rowData;
  }

  getSelectedRowsAsMatrices() {
    let rowData: any[] = [];
    this.gridApi
      .getSelectedRows()
      .forEach((row) => rowData.push(Object.values(row)));
    return rowData;
  }

  getAllHeaders() {
    let headers: any[] = [];
    this.agGrid.columnApi
      .getColumns()
      ?.forEach((column) => headers.push(column.getId()));
    return headers;
  }

  deleteColumn(columnName: any) {
    if (columnName !== 'id') {
      const config = {
        params: {
          Query: `ALTER TABLE ${this.selectedTableName} DROP COLUMN ${columnName}`,
        },
      };
      console.log(config);
      this.columnDefs = this.columnDefs.filter(
        (element) => element !== columnName
      );
      this.gridApi.setColumnDefs(this.columnDefs);
      return this.http
        .get<Object[]>(this.baseUrl + 'query', config)
        .subscribe((result) => console.log(result));
    }
    alert('You cannot remove id column');
    return null;
  }

  addColumn(columnName: any, dataType: any) {
    const config = {
      params: {
        Query: `ALTER TABLE ${this.selectedTableName} ADD COLUMN ${columnName} ${dataType}`,
      },
    };
    console.log(config);
    this.columnDefs.push(
      this.columnCreator.getColumnDefinition(dataType, columnName)
    );
    this.gridApi.setColumnDefs(this.columnDefs);
    return this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  addIdColumn(table: any) {
    const config = {
      params: {
        Query: `ALTER TABLE ${table} ADD COLUMN id integer`,
      },
    };
    console.log(config);
    this.columnDefs.push(
      this.columnCreator.getColumnDefinition('integer', 'id')
    );
    this.gridApi.setColumnDefs(this.columnDefs);
    return this.http
      .get<Object[]>(this.baseUrl + 'query', config)
      .subscribe((result) => console.log(result));
  }

  openNewColumnDialog() {
    const dialogRef = this.dialog.open(NewColumnDialog, {
      data: { columnname: 'nothing', datatype: 'nothing', types: ['a', 'b'] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.addColumn(result.columnName, result.dataType);
    });
  }
  openNewTableDialog() {
    const dialogRef = this.dialog.open(NewTableDialog, {
      data: { types: ['integer'] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.addNewTable(result.tableName);
      this.addIdColumn(result.tableName);
    });
  }
}
