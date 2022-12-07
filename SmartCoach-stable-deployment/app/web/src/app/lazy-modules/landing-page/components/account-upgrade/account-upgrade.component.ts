import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseMessagingService } from 'src/app/services/firebase/firebase-messaging.service';
import { EnvironmentService } from 'src/app/services/general/environment.service';
import { MobileAppReviewService } from 'src/app/services/general/mobile-app-review.service';
import { ConfettiService } from 'src/app/services/general/confetti.service';

/**
* Component that is displayed after a successful Octobat 
* transaction. This component is intended to serve as a 
* thank you message to the customer and stall while we 
* wait for async code responding to octobat webhooks on 
* the backend executes.
* 
* Last edited by: Faizan Khan 6/20/2020
*/
@Component({
  selector: 'app-account-upgrade',
  templateUrl: './account-upgrade.component.html',
  styleUrls: ['./account-upgrade.component.css']
})
export class AccountUpgradeComponent implements OnInit {

  /**
  * @ignore
  */
  constructor(
    public router: Router,
    public ngz: NgZone,
    public environmentService: EnvironmentService,
    public appReviewService: MobileAppReviewService,
    public firebaseMessagingService: FirebaseMessagingService,
    public confettiService: ConfettiService
  ) { }

  /**
  * Once a customer on mobile app successfully purchases a premium
  * subscription ask them for a review while their account is being upgraded, also
  * unsubscribe the user from the push notifications topics.
  * @ignore
  */
  ngOnInit() {
    if (this.environmentService.isMobile) {
      this.firebaseMessagingService.unsubscribeFromTopic(this.firebaseMessagingService.TOPIC_PREMIUM_USER_MISSED_PAYMENT);
      this.firebaseMessagingService.unsubscribeFromTopic(this.firebaseMessagingService.TOPIC_FREE_USER_TRIAL_ENDING);
      this.appReviewService.setUpAppReviewManager();
      setTimeout(() => {
        this.appReviewService.requestUserForReview();
      }, 5000);
    }
    else {
      this.firebaseMessagingService.unsubscribeTokenFromTopicWeb(this.firebaseMessagingService.currentUserToken, this.firebaseMessagingService.TOPIC_PREMIUM_USER_MISSED_PAYMENT);
      this.firebaseMessagingService.unsubscribeTokenFromTopicWeb(this.firebaseMessagingService.currentUserToken, this.firebaseMessagingService.TOPIC_FREE_USER_TRIAL_ENDING);
    }
  }

  /**
   * Takes the user back to the dashboard.
   */
  goToDash(): void {
    this.ngz.run(() => this.router.navigate(['dashboard']));
  }

}
