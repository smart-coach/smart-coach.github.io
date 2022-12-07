import { HttpClient } from '@angular/common/http';
import { InstagramService } from '../../../../services/general/instagram.service';
import { Component, OnInit, Input } from '@angular/core';
import { MediaType } from 'src/app/model-classes/general/media-type';
import { SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

/**
 * Component that displays a {@link Media} object
 */
@Component({
  selector: 'app-embed-panel',
  templateUrl: './embed-panel.component.html',
  styleUrls: ['./embed-panel.component.css']
})
export class EmbedPanelComponent implements OnInit {
  /**
   * The type of media being displayed
   */
  @Input('type') type: MediaType;

  /**
   * Title of the media
   */
  @Input('title') title: string;

  /**
   * The medias respective data value (see {@link Media})
   */
  @Input('data') data: string;

  /**
   * Flag to display a spinner while the component is loading
   */
  private spinner: boolean = true;

  // /**
  //  * Creates the link required to access the youtube video's embed (Exclusive to {@link MediaType.YOUTUBE})
  //  */
  // public youtubeURL: string = null;

  /**
   * URL to the instagram post's image (Exclusive to {@link MediaType.INSTAGRAM})
   */
  public image: string = null;

  /**
 * Creates the link required to access the youtube video's embed (Exclusive to {@link MediaType.YOUTUBE})
 */
  public liteYouTube: string = null;

  /**
   * @ignore
   */
  constructor(public instagram: InstagramService, public http: HttpClient) { }

  /**
   * @ignore
   */
  async ngOnInit() {
    switch (this.type) {

      // Instagram
      case MediaType.INSTAGRAM:
        firstValueFrom(this.http.get(`https://graph.facebook.com/v13.0/instagram_oembed?access_token=${this.instagram.getAppId()}|${this.instagram.getClientAccessToken()}&url=${this.data}`)).then(response => {
          const object: any = response;
          if (!object.error) {
            this.image = object.thumbnail_url;
            this.spinner = false;
          }
        });
        // FB.api(
        //   `/instagram_oembed?access_token=${this.instagram.getAppId()}|${this.instagram.getClientAccessToken()}&url=${this.data}`,
        //   (response: any) => {
        //     if (!response.error) {
        //       this.image = response.thumbnail_url;
        //       this.spinner = false;
        //     }
        //   }
        // );
        break;

      // YouTube
      case MediaType.YOUTUBE:
        // this.youtubeURL = "https://www.youtube.com/embed/" + this.data;
        this.liteYouTube = '<lite-youtube style="  border-bottom-left-radius: 17px;border-bottom-right-radius: 17px;" videoid="' + this.data + '" videotitle="' + this.title + '"></lite-youtube>';
        this.spinner = false;
        break;

      // LinkedIn  
      case MediaType.LINKEDIN:
        this.spinner = false;
        break;

    }

  }

  /**
   * Checks if the {@link MediaType} is {@link MediaType.INSTAGRAM} 
   */
  public isInstagram(): boolean {
    return this.type == MediaType.INSTAGRAM;
  }

  /**
   * Checks if the {@link MediaType} is {@link MediaType.LINKEDIN} 
   */
  public isLinkedIn(): boolean {
    return this.type == MediaType.LINKEDIN;
  }

  /**
   * Checks if the {@link MediaType} is {@link MediaType.YOUTUBE} 
   */
  public isYouTube(): boolean {
    return this.type == MediaType.YOUTUBE;
  }

  /**
   * Determines whether the component should be displayed or not
   */
  public isLoaded(): boolean {
    return !this.spinner;
  }

  /**
   * Converts a {@link MediaType} into its respective SmartCoach URL
   * @param type type
   */
  public getSocialLink(type: MediaType): string {
    switch (type) {
      case MediaType.INSTAGRAM:
        return "https://www.instagram.com/fitcheffaizan/";
      case MediaType.LINKEDIN:
        return "https://www.linkedin.com/company/smartcoach/";
      case MediaType.YOUTUBE:
        return "https://www.youtube.com/c/FitChefFaizan/";
    }
  }

  // /**
  //  * Converts a {@link MediaType} into its respective font awesome icon
  //  * @param type type
  //  */
  // public getFontAwesomeIcon(type: MediaType): string {
  //   switch (type) {
  //     case MediaType.INSTAGRAM:
  //       return "fab fa-instagram scThemeText button";
  //     case MediaType.LINKEDIN:
  //       return "fab fa-linkedin scThemeText button";
  //     case MediaType.YOUTUBE:
  //       return "fab fa-youtube scThemeText button";
  //   }
  // }

}