import { Component } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {

  private baseUrl: string = "http://localhost:3000/";
  private updates: number | undefined;
  private inserts: number | undefined;
  private deletes: number | undefined;
  public optionsOperationchart: AgChartOptions;
  private dataOperationChart: any[] = [];
  private tableNames: any[] = [];
  public optionsRowNumberChart: AgChartOptions; 
  private dataRowNumberChart: any = {rows: "Rows"};
  private rowNumberSeries : any[] = [];
  public optionsColumnNumberChart: AgChartOptions; 
  private dataColumnNumberChart: any = {columns: "Columns"};
  private columnNumberSeries : any[] = [];

  constructor(private http:HttpClient) {
    this.optionsOperationchart = {
      data: [],
      series: [],
    };

    this.optionsRowNumberChart = {
      title: {
          text: "Nr of rows in tables",
      },
      subtitle: {
          text: '',
      },
      data: [],
      series: [],
    };

    this.optionsColumnNumberChart = {
      title: {
          text: "Nr of columns in tables",
      },
      subtitle: {
          text: '',
      },
      data: [],
      series: [],
    };
  }

  updateOperationChartData(result: any[]){
    this.inserts = Number(result[0].total_inserts);
    this.updates = Number(result[0].total_updates);
    this.deletes = Number(result[0].total_deletes);
    this.dataOperationChart = [ 
      { label: 'Inserts', value: this.inserts },
      { label: 'Updates', value: this.updates },
      { label: 'Deletes', value: this.deletes }]
      console.log(this.dataOperationChart);
  }

  updateOperationChartOptions(){
    console.log('update charts');
    const optionsOperationchart: AgChartOptions = {
      title: {
        text: "Database operations",
    },
    subtitle: {
        text: '',
    },
      data: [ 
        { label: 'Inserts', value: this.inserts },
        { label: 'Updates', value: this.updates },
        { label: 'Deletes', value: this.deletes }],
      series: [
        {
          type: 'pie',
          angleKey: 'value',
          calloutLabelKey: 'label',
          sectorLabelKey: 'value',
          sectorLabel: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      ],
    };
    this.optionsOperationchart = optionsOperationchart;
  }

  initOperationChart(){
    const config = {params: {
      Query: "SELECT sum(n_tup_ins) AS total_inserts, sum(n_tup_upd) AS total_updates, sum(n_tup_del) AS total_deletes FROM pg_stat_all_tables WHERE schemaname = 'public';"
      }
    }
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).forEach(result => this.updateOperationChartData(result)).then(error => this.updateOperationChartOptions());
  }

  updateRowNumberChartOptions(){
    console.log(this.dataRowNumberChart);
    console.log(this.rowNumberSeries);
    console.log('update charts');
    const optionsRowNumberChart: AgChartOptions =  {
      title: {
          text: "Nr of rows in tables",
      },
      subtitle: {
          text: '',
      },
      data: [this.dataRowNumberChart],
      series: this.rowNumberSeries,
    };
    this.optionsRowNumberChart = optionsRowNumberChart;
  }

  addRowNumberItem(nrOfRows : any,tableName : any){
    this.rowNumberSeries.push(
      {
          type: 'bar',
          xKey: 'rows',
          yKey: tableName!.toLowerCase(),
          yName: tableName
      });
    this.dataRowNumberChart[tableName] = Number(nrOfRows); 
  }

  initRowNumberChart(){
    this.initTableColumnInfo();
    for (let i = 0; i < this.tableNames.length; i++) {
      const config = {params: {
        Query: `SELECT COUNT(*) FROM ${this.tableNames[i]}`
        }
      }
      this.http.get<any[]>(this.baseUrl + 'queryresult', config).forEach(result => this.addRowNumberItem(result[0].count,this.tableNames[i])).then(error => this.updateRowNumberChartOptions());
    }
  }

  init(){
    this.dataColumnNumberChart  = {columns: "Columns"};
    this.dataRowNumberChart = {rows: "Rows"};
    this.columnNumberSeries  = [];
    this.rowNumberSeries = [];
    this.initTableInfo();
    this.initOperationChart();
  }

  initTableInfo(){
    this.tableNames = [];
    const config = {params: {
      Query: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      }
    }
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).forEach(result => result.forEach(row => this.tableNames!.push(row.table_name))).then(error => this.initRowNumberChart());
  }

  initTableColumnInfo(){
    console.log('init columns');
    for (let i = 0; i < this.tableNames.length; i++) {
      this.columnNumberSeries.push(
        {
            type: 'bar',
            xKey: 'columns',
            yKey: this.tableNames[i]!.toLowerCase(),
            yName: this.tableNames[i]
        });
    const config = {params: {
      Query: `SELECT COUNT(column_name) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${this.tableNames[i]}';`,
      }
    }
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).forEach(row => 
        this.dataColumnNumberChart[this.tableNames[i]] = Number(row[0].count)).then(error => this.initColumnsNumberChart());
    }
  }

  initColumnsNumberChart(){
    console.log(this.dataColumnNumberChart);
    console.log(this.columnNumberSeries);
    console.log('update column charts');
    const optionsColumnNumberChart: AgChartOptions =  {
      title: {
          text: "Nr of columns in tables",
      },
      subtitle: {
          text: '',
      },
      data: [this.dataColumnNumberChart],
      series: this.columnNumberSeries,
    };
      this.optionsColumnNumberChart = optionsColumnNumberChart;
  }
}