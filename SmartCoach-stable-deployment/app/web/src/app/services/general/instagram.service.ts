import { FirebaseGeneralService } from 'src/app/services/firebase/firebase-general.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Service to work with the Instagram API
 * @author Faizan Khan
 */
@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  /**
   * The App ID
   */
  public static readonly APP_ID: string = "522878869361234";

  /**
   * The Client Token
   */
  public static readonly CLIENT_TOKEN: string = "a513bce9d9e859cd6568f4f9bb553feb";

  /**
   * @ignore
   */
  constructor(public http: HttpClient, public firebase: FirebaseGeneralService) { }

  /**
   * Returns the app id
   */
  public getAppId(): string {
    return InstagramService.APP_ID;
  }

  /**
   * Returns the client access token
   */
  public getClientAccessToken() {
    return InstagramService.CLIENT_TOKEN;
  }

}