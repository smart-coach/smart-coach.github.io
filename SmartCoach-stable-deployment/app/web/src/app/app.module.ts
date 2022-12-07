import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ConversionService } from './services/general/conversion.service';
import { StateManagerService } from './services/general/state-manager.service';
import { OnlyLoggedInUsersGuard } from './services/route-guards/only-logged-in-users-guard.service';
import { AuthenticationService } from './services/firebase/authentication.service';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { OnlyNotLoggedInUsersGuard } from './services/route-guards/only-not-logged-in-users-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './app-level-components/navbar/navbar.component';
import { FooterComponent } from './app-level-components/footer/footer.component';
import { DirectivesModule } from './shared-modules/directives/directives.module';
import { MaterialModule } from './shared-modules/material/material.module';
import { PipesModule } from './shared-modules/pipes/pipes.module';
import { DialogsModule } from './shared-modules/dialogs/dialogs.module';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { environment } from '../environments/environment';
import { ThemeService } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CustomPreloadingStrategyService } from './custom-preloading-strategy.service';
import { SwiperModule } from 'swiper/angular';
import { FirebaseMessagingService } from './services/firebase/firebase-messaging.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';

/**
 * Top level of the SmartCoach routing hierarchy. Controls permissions to certain routes.
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./lazy-modules/landing-page/landing-page.module').then(m => m.LandingPageModule),
    data: { preload: true }
  },
  {
    path: 'auth',
    loadChildren: () => import('./lazy-modules/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule),
    data: { preload: true }
  },
  {
    path: 'dashboard', canActivate: [OnlyLoggedInUsersGuard],
    loadChildren: () => import('./lazy-modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { preload: true }
  },
  {
    path: 'nutrition-logs', canActivate: [OnlyLoggedInUsersGuard],
    loadChildren: () => import('./lazy-modules/nutrition/nutrition.module').then(m => m.NutritionModule)
  },
  {
    path: 'profile', canActivate: [OnlyLoggedInUsersGuard],
    loadChildren: () => import('./lazy-modules/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'resources', canActivate: [OnlyLoggedInUsersGuard],
    loadChildren: () => import('./lazy-modules/resources/resources.module').then(m => m.ResourcesModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./lazy-modules/footer/footer.module').then(m => m.FooterModule),
    data: { preload: true }
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'top', preloadingStrategy: CustomPreloadingStrategyService }),
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    MaterialModule,
    DirectivesModule,
    BrowserModule,
    BrowserAnimationsModule,
    PipesModule,
    DialogsModule,
    SwiperModule,
    ServiceWorkerModule.register('./firebase-messaging-sw.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [
    ConversionService,
    StateManagerService,
    OnlyNotLoggedInUsersGuard,
    OnlyLoggedInUsersGuard,
    AuthenticationService,
    ThemeService,
    FirebaseMessagingService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }