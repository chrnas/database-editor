import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'new-column-dialog',
  templateUrl: 'new-column-dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
})
export class NewColumnDialog {
  public columnNameControl = new FormControl('');
  public dataTypeControl = new FormControl('');
  public typeControl = new FormControl('');
  public defaultSelections: string[] | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewColumnDialog>
  ) {}

  submit(form: any) {
    this.dialogRef.close(form.value);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddColumnClick(): void {
    this.dialogRef.close({
      columnName: this.columnNameControl.value,
      dataType: this.dataTypeControl.value,
    });
  }
}
