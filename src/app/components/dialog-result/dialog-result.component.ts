import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-result',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './dialog-result.component.html',
  styleUrl: './dialog-result.component.scss'
})
export class DialogResultComponent {

   constructor(@Inject(MAT_DIALOG_DATA) public data: { point: number }) {}

}
