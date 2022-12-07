import { Component, OnInit } from '@angular/core';
import { StateManagerService } from 'src/app/services/general/state-manager.service';
import { TierPermissionsService } from 'src/app/services/general/tier-permissions.service';
import { ProfileControlService } from 'src/app/services/general/profile-control.service';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared-modules/material/snack-bar-manager.service';
import { EnvironmentService } from 'src/app/services/general/environment.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreatorService } from 'src/app/shared-modules/dialogs/dialog-creator.service';

/**
 * This component is just a button that contains the logic for converting a guest user to a permanent user. 
 * It is expected that this component is not displayed if the user is not a guest because they already have
 * an email attached to their account, they could just used edit profile and change their email.
 * 
 * Last edited by: Faizan Khan 7/19/2022
 */

@Component({
  selector: 'app-create-account-button',
  templateUrl: './create-account-button.component.html'
})
export class CreateAccountButtonComponent implements OnInit {

  constructor(public stateManager: StateManagerService,
    public tierPermissionsManager: TierPermissionsService,
    public profileControl: ProfileControlService,
    public snackBar: SnackBarService,
    public router: Router,
    public environmentService: EnvironmentService,
    public dialog: MatDialog,
    public dialogCreator: DialogCreatorService) { }

  ngOnInit() {
  }

  /*
  * This method is called when the user clicks the button to convert a guest user to a permanent user.
  * It will open a dialog that asks the user for their email address and password.
  */
  openDialogForGuestUpgrade() {
    this.dialogCreator.openGuestUpgradeDialog();
  }
}
