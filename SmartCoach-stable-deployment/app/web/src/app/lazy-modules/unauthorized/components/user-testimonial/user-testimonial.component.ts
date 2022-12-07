import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Testimonial } from 'src/app/model-classes/general/testimonial';
import { Transformation } from 'src/app/model-classes/general/transformation';
import { FirebaseGeneralService } from 'src/app/services/firebase/firebase-general.service';

// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Autoplay,
} from 'swiper';

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Autoplay
]);

/**
 * This component is a just a display of SmartCoach users positive reviews and progress pictures.
 * It can be accessed by unauthorized users but cannot be written to because of firebase rules.
 * testimonials and transformations data is pulled from Tetimonials/Testimonials document in the db,
 * and displayed onto the UI after being transformed into a Swiper slider. A spinner is displayed
 * while the data is being pulled from the db and curated to the UI.
 * 
 * Last edited by: Faizan Khan 7/30/2022
 */
@Component({
  selector: 'app-user-testimonial',
  templateUrl: './user-testimonial.component.html',
  styleUrls: ['./user-testimonial.component.css']
})

export class UserTestimonialComponent implements OnInit {

  // Swiper Slider pagination functionality
  pagination: any = false;

  // Swiper Slider navigation functionality
  navigation = false;

  // Shows spiner when testimonial page is loading
  showSpinner: boolean = true;

  // Contains the testimonials that are fetched from db to be displayed on the UI.
  userTestimonials: Testimonial[];

  // Contains the transformations that are fetched from db to be displayed on the UI.
  userTransformations: Transformation[];

  constructor(public firebaseGeneral: FirebaseGeneralService) {
    const context = this;

    // Get the testimonials and tranforations from the db on the creation of this component
    firstValueFrom(this.firebaseGeneral.getTestimonials()).then(response => {
      const isFromCache: boolean = (<any>response)._fromCache;

      // If the firebase response has a true _fromCache field then the user is offline (https://cloud.google.com/firestore/docs/manage-data/enable-offline#:~:text=If%20you%20get%20a%20document,an%20error%20is%20returned%20instead.)
      if (isFromCache) {
        return;
      }
      const testimonials = context.getTestimonialsFromJSONList(JSON.parse(response.data().testimonials));
      const transformations = context.getTransformationsFromJSONList(JSON.parse(response.data().transformations));
      context.userTransformations = transformations;
      context.formatUserTestimonials(testimonials);
    });
  }

  ngOnInit() {
  }

  // Hides the spinner when the testimonial page is loaded
  hideSpinner() {
    this.showSpinner = false;
  }

  /**
 * Converts the response from firebase into a Testimonial[]
 * @param jsonList The response from firebase
 */
  getTestimonialsFromJSONList(jsonList: any[]): Testimonial[] {
    let returnList = [];
    jsonList.forEach(json => {
      returnList.push(new Testimonial(json.order, json.name, json.title, json.imageUrl, json.message))
    })
    return returnList;
  }

  /**
 * Converts the response from firebase into a Transformation[]
 * @param jsonList The response from firebase
 */
  getTransformationsFromJSONList(jsonList: any[]): Transformation[] {
    let returnList = [];
    jsonList.forEach(json => {
      returnList.push(new Transformation(json.name, json.title, json.imageUrl, json.alt))
    })
    return returnList;
  }

  /**
   * Formats the testimonial messages to emphasize the user's positive feedback and highlight key points.
   */
  formatUserTestimonials(testimonialJSONObject: Testimonial[]): void {
    testimonialJSONObject.forEach(testimonial => {
      var textToModify = testimonial.message;
      textToModify = textToModify.replace(/\[/g, "<strong>");
      textToModify = textToModify.replace(/\]/g, "</strong>");
      testimonial.message = textToModify;
    });
    this.userTestimonials = testimonialJSONObject;
  }
}
