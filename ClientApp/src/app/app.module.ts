import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { GridComponent } from './grid/grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule,  } from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartComponent } from './chart/chart.component';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { QueryExecuterComponent } from './query-executer/query-executer.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        GridComponent,
        ChartComponent,
        QueryExecuterComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        CommonModule,
        MatFormFieldModule,
        HttpClientModule,
        MatTabsModule,
        MatFormFieldModule, 
        MatSelectModule, 
        MatButtonModule, MatInputModule,FormsModule, ReactiveFormsModule,CommonModule, MatIconModule,
        RouterModule.forRoot([
            { path: 'database-editor', component: GridComponent },
        ]),
        BrowserAnimationsModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatSelectModule,
        CommonModule,
        MatSelectModule,
        FormsModule,
        NgFor,
        NgIf,
        ReactiveFormsModule,
        MatInputModule,
        MatTooltipModule,
        MatTabsModule,
        AgGridModule,
        NgxDropzoneModule,
        MatDialogModule,
        AgChartsAngularModule
        ]
})
export class AppModule { }
