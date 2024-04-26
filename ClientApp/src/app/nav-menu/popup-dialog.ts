import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
    selector: 'popup-dialog',
    templateUrl: 'popup-dialog.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
  })
  export class PopupDialog {}