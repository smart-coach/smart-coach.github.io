/**
 * Class that models a positive statement made by a customer.
 * 
 * Last edited by: Faizan Khan 5/2020
 */
 export class Transformation {

    /**
     * Constructor for transformation class that automatically creates member variables for the parameters.
     * 
     * @param name name of the customer.
     * @param title job or relevance of customer.
     * @param imageUrl url to customer icon image.
     * @param alt alternative text for image.
     */
    constructor(
        public name: string,
        public title: string,
        public imageUrl: string,
        public alt: string
    ) { }
}