import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-query-executer',
  templateUrl: './query-executer.component.html',
  styleUrls: ['./query-executer.component.scss']
})
export class QueryExecuterComponent {

  private baseUrl: string = 'http://localhost:3000/';
  private result: any[] = [];
  public queryControl = new FormControl('');
  public queryResultText = "";

  constructor(private http: HttpClient){}

  executeQuery(){
    console.log('executed query');
    this.result = [];
    const config = {
      params: {
        Query: `${this.queryControl.value}`,
      },
    };
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).forEach(row=>this.result.push(row)).then(error=>this.displayQuery());
    console.log(this.result);
  }

  displayQuery(){
    console.log('displayed query');
    this.queryResultText = JSON.stringify(this.result);
  }
}
