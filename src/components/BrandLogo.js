import React from 'react';

const BrandLogo = ({
  markClassName = 'brand-mark',
  text = 'sonyelctronics',
  textClassName = 'logo-text'
}) => {
  return (
    <>
      <span className={markClassName}>
        <svg className="brand-glyph" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <circle className="brand-ring" cx="32" cy="32" r="28" />
          <path className="brand-trace" d="M20 18H44" />
          <path className="brand-trace" d="M20 32H38" />
          <path className="brand-trace" d="M20 46H44" />
          <path className="brand-trace" d="M20 18V46" />
          <circle className="brand-node" cx="46" cy="18" r="3" />
          <circle className="brand-node" cx="40" cy="32" r="3" />
          <circle className="brand-node" cx="46" cy="46" r="3" />
        </svg>
      </span>
      <span className={textClassName}>{text}</span>
    </>
  );
};

export default BrandLogo;
