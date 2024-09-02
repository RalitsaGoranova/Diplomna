import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-confirm-dialog-component',
  standalone: true,
  imports: [
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './confirm-dialog-component.html',
  styleUrl: './confirm-dialog-component.css'
})
export class ConfirmDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<ConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
