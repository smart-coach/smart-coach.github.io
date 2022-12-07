import { NgModule } from '@angular/core';
import { ForgotPasswordComponent } from './components/general-dialogs/forgot-password-dialog/forgot-password.component';
import { MaterialModule } from '../material/material.module'
import { EntryModifyComponent } from './components/nutrition-log-dialogs/nutrition-entry-modify/entry-modify.component';
import { NutritionLogModifyComponent } from './components/nutrition-log-dialogs/nutrition-log-modify/log-modify.component';
import { ConfirmationDialogComponent } from './components/general-dialogs/confirmation-dialog/confirmation-dialog.component';
import { LogManagementDialogComponent } from './components/nutrition-log-dialogs/log-management-dialog/log-management-dialog.component';
import { MainLogDialogComponent } from './components/nutrition-log-dialogs/main-log-dialog/main-log-dialog.component';
import { CommonModule } from '@angular/common';
import { ReAuthenticateDialogComponent } from './components/general-dialogs/re-authenticate-dialog/re-authenticate-dialog.component';
import { TermsDialogComponent } from './components/general-dialogs/terms-dialog/terms-dialog.component';
import { TextModule } from '../text/text.module';
import { PayloadAnalyzerComponent } from './components/nutrition-log-dialogs/payload-analyzer/payload-analyzer.component';
import { MyChartsModule } from '../charts/myCharts.module';
import { SubscriptionMessageDialogComponent } from './components/general-dialogs/subscription-message-dialog/subscription-message-dialog.component';
import { CheckoutButtonModule } from '../checkout-button/checkout-button.module';
import { PurchaseProductComponent } from './components/general-dialogs/purchase-product-dialog/purchase-product-dialog.component';
import { WaitForOperationDialog } from './components/general-dialogs/wait-for-operation/wait-for-operation.component';
import { FirstTimeTipsComponent } from './components/general-dialogs/first-time-tips-dialog/first-time-tips.component';
import { MobileHealthSyncComponent } from './components/general-dialogs/mobile-health-sync-dialog/mobile-health-sync.component';
import { ConvertAnonymousToPermanentComponent } from './components/general-dialogs/convert-anonymous-user-to-permanent-dialog/convert-anonymous-to-permanent-dialog.component';
import { CreateAccountButtonModule } from '../create-account-button/create-account-button.module';


@NgModule({
    declarations: [
        ForgotPasswordComponent,
        SubscriptionMessageDialogComponent,
        EntryModifyComponent,
        NutritionLogModifyComponent,
        ConfirmationDialogComponent,
        LogManagementDialogComponent,
        MainLogDialogComponent,
        ReAuthenticateDialogComponent,
        TermsDialogComponent,
        PurchaseProductComponent,
        PayloadAnalyzerComponent,
        WaitForOperationDialog,
        FirstTimeTipsComponent,
        MobileHealthSyncComponent,
        ConvertAnonymousToPermanentComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        TextModule,
        MyChartsModule,
        CheckoutButtonModule,
        CreateAccountButtonModule
    ],
    exports: [
        ForgotPasswordComponent,
        SubscriptionMessageDialogComponent,
        EntryModifyComponent,
        NutritionLogModifyComponent,
        LogManagementDialogComponent,
        MainLogDialogComponent,
        ReAuthenticateDialogComponent,
        TermsDialogComponent,
        PurchaseProductComponent,
        WaitForOperationDialog,
        FirstTimeTipsComponent,
        MobileHealthSyncComponent,
        ConvertAnonymousToPermanentComponent
    ]
})
export class DialogsModule { }
