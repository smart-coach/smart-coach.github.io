/**
 * Class that models a positive statement made by a customer.
 * 
 * Last edited by: Faizan Khan 5/2020
 */
export class Testimonial {

    /**
     * Constructor for testimonial class that automatically creates member variables for the parameters.
     * 
     * @param order order of the customer review
     * @param name name of the customer.
     * @param title job or relevance of customer.
     * @param imageUrl url to customer icon image.
     * @param message actual statement from the customer.
     */
    constructor(
        public order: number,
        public name: string,
        public title: string,
        public imageUrl: string,
        public message: string
    ) { }
}