export type StarRating = 1 | 2 | 3 | 4 | 5;

export type Testimonial = {
  id: string;
  customerName: string;
  customerRole?: string;
  customerImage?: string;
  rating: StarRating;
  review: string;
};