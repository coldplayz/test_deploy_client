import React from 'react';
import { MdFormatQuote, MdStar } from 'react-icons/md';

export const Testimonial = () => (
  <div className="flex flex-col md:w-[400px] space-y-2 p-4 rounded-md relative pb-16">
    <span className="absolute top-0 rounded-full h-12 w-12 bg-light_green flex items-center justify-center">
      <MdFormatQuote style={{ color: 'green', transform: 'rotate(180deg)', height: '24px', width: '24px' }} />
    </span>
    <span className="font-semibold text-slate-600 pt-4">C'mon Mann</span>
    <span className="text-sm text-s_gray">“I had a wonderful experience working with Latent to find my new home. The agent really took the time to understand what was important to me and helped me find a home that was not only beautiful but also suited me, perfectly." </span>

  </div>
);

export const TestimonialV2 = ({ review }) => (
  <div className="flex flex-col space-y-2 p-4 bg-white rounded-md relative mt-8 items-start">
    <span className="absolute -top-6 rounded-full h-12 w-12 bg-light_green flex items-center justify-center">
      <MdFormatQuote style={{ color: 'green', transform: 'rotate(180deg)', height: '24px', width: '24px' }} />
    </span>
    <span className="font-semibold text-slate-600 pt-4">{`${review.user.firstName} ${review.user.lastName}`}</span>
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((rating, i) => (
        <MdStar
          key={i}
          style={{ color: rating <= review.rating ? '#339D65' : 'gray', height: '20px', width: '20px' }}
        />
      ))}
    </div>
    <span className="text-sm text-s_gray text-start">{`“${review.comment}"`}</span>

  </div>
);
