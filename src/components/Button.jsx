import React from 'react';

const Button = ({ name, type }) => (
  <div
    className={`${type && type === 'light' ? 'bg-light_green border-light_green  text-green transition-colors hover:border-green'
      : type && type === 'secondary'
        ? 'border-green text-green transition-colors hover:bg-light_green'
        : 'bg-green border-green text-white transition-colors hover:border-light_green'} border px-4 py-1.5 rounded-[4px] cursor-pointer`}
  >
    <span className="capitalize">{name}</span>
  </div>
);

export default Button;
