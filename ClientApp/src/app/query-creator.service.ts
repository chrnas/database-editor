import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryCreatorService {

  constructor() { }

  getSqlValueNotation(value:any){
    if(value === null){
        return 'null';
    }
    else if(value instanceof Date){
        return `'${value}'`;
    }
    else if(typeof value == 'string'){
        return `'${value}'`;
    }
    else if(typeof value == 'number'){
        return `${value}`;
    }
    else if(typeof value == 'boolean'){
        return `${value}`;
    }
    else if(typeof value == 'undefined'){
        return `'null'`;
    }
    else if(typeof value == 'object'){
        return `'null'`;
    }
    else{
        return `'null'`
    }
  }

  getSqlValuesQueryPart(values : any[]){
      var queryPart = '';
      for (let i = 0; i < values.length; i++){
          if(i === (values.length-1)){
              queryPart += this.getSqlValueNotation(values[i]);
          }
          else{
              queryPart += this.getSqlValueNotation(values[i])+',';
          }
      }
      return queryPart;
  }

  getSqlColumnsQueryPart(columns : any[]){
      var queryPart = '';
      for (let i = 0; i < columns.length; i++){
          if(i === (columns.length-1)){
              queryPart += columns[i];
          }
          else{
              queryPart +=  columns[i]+',';
          }
      }
      return queryPart;
  }
}
