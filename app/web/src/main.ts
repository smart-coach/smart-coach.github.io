import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

if (typeof window['cordova'] !== undefined) {
  document.addEventListener('deviceready', () => {
    window.screen.orientation.lock('portrait');
    window.addEventListener("keyboardDidShow", () => {
      const mobileToolbar = document.getElementsByClassName("mobileToolBarBottom")[0];
      if (mobileToolbar) {
        mobileToolbar.classList.add("invisible")
      }
    });
    window.addEventListener("keyboardWillHide", () => {
      const mobileToolbar = document.getElementsByClassName("mobileToolBarBottom")[0];
      if (mobileToolbar) {
        mobileToolbar.classList.remove("invisible")
      }
    });
    //@ts-ignore
    window.open = cordova.InAppBrowser.open;
  });
}


