import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-travel-offer-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './travel-offer-dialog.component.html',
  styleUrl: './travel-offer-dialog.component.css'
})
export class TravelOfferDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<TravelOfferDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { note: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.data.note);
  }
}