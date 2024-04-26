import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialog } from './popup-dialog';
import { GridComponent } from '../grid/grid.component';
import { ChartComponent } from '../chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { QueryExecuterComponent } from '../query-executer/query-executer.component';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  @ViewChild(GridComponent) gridComponent!: GridComponent;
  @ViewChild(QueryExecuterComponent) QueryExecuterComponent!: GridComponent;
  @ViewChild(ChartComponent) chartComponent!: ChartComponent;

  files: File[] = [];

  public tables: any[] | undefined;

  public fileReader = new FileReader();

  private baseUrl: string = 'http://localhost:3000/';

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSelect(event: any) {
    if (this.files.length <= 0) {
      this.files.push(...event.addedFiles);
      this.sslCertificate = this.fileReader.readAsText(this.files[0]);
    } else {
      this.openDialog();
    }
  }
  public sslCertificate: any | undefined;
  public hostControl = new FormControl('');
  public userControl = new FormControl('');
  public passwordControl = new FormControl('');
  public portControl = new FormControl('');
  public databaseControl = new FormControl('');

  public config: any | undefined;

  public message: object[] | undefined;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.fileReader.onload = () => {
      this.sslCertificate = this.fileReader.result;
    };
  }

  saveConfig() {
    this.config = {
      host: this.hostControl.value!,
      user: this.userControl.value!,
      password: this.passwordControl.value!,
      port: this.portControl.value!,
      database: this.databaseControl.value!,
    };
  }

  connect() {
    this.connectService({
      params: {
        Host: this.hostControl.value,
        Port: this.portControl.value,
        Database: this.databaseControl.value,
        User: this.userControl.value,
        Password: this.passwordControl.value,
        Ssl: this.sslCertificate,
      },
    }).subscribe((result: any) => {
      console.log(result);
    });
    this.init();
  }

  disconnect() {
    this.disconnectService().subscribe((result: any) => {
      console.log(result);
    });
  }

  connectService(config: any) {
    return this.http.get<Object[]>(this.baseUrl + 'connect', config);
  }

  disconnectService() {
    return this.http.get<Object[]>(this.baseUrl + 'disconnect');
  }

  autoconnect() {
    this.connectService({
      params: {
        Host: 'tambourdb.postgres.database.azure.com',
        Port: '5432',
        Database: 'postgres',
        User: 'chrnas',
        Password: 'TambourHero1400!',
        Ssl: this.sslCertificate,
      },
    }).subscribe((result: any) => {
      console.log(result);
    });
    this.init();
  }

  init() {
    this.getTableInfo();
    this.gridComponent.initFirst();
    this.chartComponent.init();
  }

  getTableInfo() {
    const config = {
      params: {
        Query: `
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      `,
      },
    };
    this.http.get<any[]>(this.baseUrl + 'queryresult', config).subscribe(
      (result: any[] | undefined) => {
        this.tables = result;
      },
      (error: any) => console.error(error)
    );
    console.log(config);
    return this.tables;
  }

  openDialog() {
    const dialogRef = this.dialog.open(PopupDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
