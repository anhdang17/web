import { SVGProps } from 'react';

export default function Logo({ className = '', size = 32 }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="UNISEX Logo"
    >
      {/* Red circle background */}
      <circle cx="40" cy="40" r="40" fill="#DC2626" />
      
      {/* Stylized U letter - thick stroke */}
      <path
        d="M24 30V42C24 48 28 54 34 54H36C42 54 46 48 46 42V30"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Inner cutout of U - creates the U shape */}
      <path
        d="M32 36V42C32 45 34 48 38 48H40C44 48 46 45 46 42V36"
        stroke="#DC2626"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Curly/swirl decoration at bottom of U */}
      <path
        d="M38 48C38 51 40 53 43 53C46 53 48 51 48 48C48 45 46 43 43 43C40 43 38 45 38 48"
        fill="white"
      />
    </svg>
  );
}
