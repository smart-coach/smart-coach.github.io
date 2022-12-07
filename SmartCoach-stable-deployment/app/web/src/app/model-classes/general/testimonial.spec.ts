import { Testimonial } from './testimonial';

describe('Testimonial', () => {

  let testimonial: Testimonial;

  it('should successfully construct a testimonial object and assign the correct values to all public members', () => {
    testimonial = new Testimonial(1, 'name', 'title', 'url/', 'message');
    expect(testimonial).not.toBe(null);
    expect(testimonial.order).toEqual(1);
    expect(testimonial.name).toEqual('name');
    expect(testimonial.title).toEqual('title');
    expect(testimonial.imageUrl).toEqual('url/');
    expect(testimonial.message).toEqual('message');
  });
});