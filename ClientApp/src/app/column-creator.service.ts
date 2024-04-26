import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColumnCreatorService {

  constructor() { }

  getColumnDefinition(dataType : any, columnName : any){
    if(columnName == 'id'){
      return {field: 'id',checkboxSelection: true,headerCheckboxSelection:true,pinned:true, editable:false};
    }
    if(dataType == 'null'){
      return {field: columnName};
    }
    else if(dataType == 'date'){
      return {field: columnName};
    }
    else if(dataType == 'timestamp without time zone'){
      return {field: columnName};
    }
    else if(dataType == 'string'){
      return {field: columnName, cellDataType:'text'};
    }
    else if(dataType == 'integer'){
      return {field: columnName, cellDataType:'number', cellEditor:"agNumberCellEditor"};
    }
    else if(dataType == 'boolean'){
      return {field: columnName, cellDataType:'boolean'};
    }
    else if(dataType == 'undefined'){
      return {field: columnName};
    }
    else if(dataType == 'object'){
      return {field: columnName};
    }
    else{
      return {field: columnName};
    }
  }
}
