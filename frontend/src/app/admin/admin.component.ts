import {Component, Inject, OnInit} from '@angular/core';
import {ApiManagerService} from '../api-manager.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public guests;
  public newGuest = {};

  constructor(private apiManager: ApiManagerService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.apiManager.getGuests()
      .subscribe((data: any[]) => {
        this.guests = data.sort((g1, g2) => g1.id - g2.id);
      });
  }

  confirmAction(next, parameters) {
    next = next.bind(this);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(cancel => {
      console.log('The dialog was closed', cancel);
      if (!cancel) {
        next(...parameters);
      }
    });
  }

  compareFn(op1, op2) {
    // console.log(op1, typeof op1, op2, typeof op2);

    return '' + op1 === '' + op2;
  }

  public addGuest() {
    this.apiManager.addGuest(this.newGuest)
      .subscribe(
        res => {
          console.log(res);
          this.guests.push(this.newGuest);
          this.newGuest = {};

          this.snackBar.open('Added guest successfully', 'Dismiss', {
            duration: 2000,
          });
        },
        err => {
          this.snackBar.open('Error occurred adding guest', 'Dismiss', {
            duration: 2000,
          });
          console.error('Error occurred', err);
        });
  }

  public removeGuest(id: number) {
    this.apiManager.removeGuest(id)
      .subscribe(
        res => {
          console.log(res);
          const index = this.guests.findIndex(guest => guest.id === id);
          this.guests.splice(index, 1);

          this.snackBar.open('Guest successfully removed', 'Dismiss', {
            duration: 2000,
          });
        },
        err => {
          this.snackBar.open('Error occurred removing guest', 'Dismiss', {
            duration: 2000,
          });
          console.error('Error occurred', err);
        }
      );
  }

  public updateGuest(id: number) {
    const editedGuest = this.guests.find(guest => guest.id === id);
    console.log(id, editedGuest);
    this.apiManager.updateGuest(editedGuest)
      .subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Successfully updated guest', 'Dismiss', {
            duration: 2000,
          });
        },
        err => {
          this.snackBar.open('Error occurred updating guest', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }

  public emailAll() {
    this.apiManager.emailAll()
      .subscribe(
        res => {
          this.snackBar.open('Successfully emailed all guests', 'Dismiss', {
            duration: 2000,
          });
          console.log(res);
        },
        err => {
          this.snackBar.open('Error occurred emailing all guests', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }

  public emailGuest(email) {
    this.apiManager.emailGuest(email)
      .subscribe(
        res => {
          this.snackBar.open('Successfully emailed guest', 'Dismiss', {
            duration: 2000,
          });
          console.log(res);
        },
        err => {
          this.snackBar.open('Error occurred emailing guest', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: '<div mat-dialog-content>\n' +
  '  <p>Are you sure you want to do that?</p>\n' +
  '</div>\n' +
  '<div mat-dialog-actions>\n' +
  '  <button mat-button [mat-dialog-close]="false">Ok</button>\n' +
  '  <button mat-button [mat-dialog-close]="true">Cancel</button>\n' +
  '</div>',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}