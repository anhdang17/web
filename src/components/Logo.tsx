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
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#E53935" />
      
      {/* Stylized U letter - shoe/fashion design */}
      <path
        d="M22 30C22 24.477 26.477 20 32 20H36C38.209 20 40 21.791 40 24V32C40 34.209 41.791 36 44 36H48C53.523 36 58 40.477 58 46V50C58 55.523 53.523 60 48 60H32C26.477 60 22 55.523 22 50V30Z"
        fill="white"
      />
      
      {/* Inner U cutout */}
      <path
        d="M30 34C30 30.686 32.686 28 36 28H44C47.314 28 50 30.686 50 34V46C50 49.314 47.314 52 44 52H36C32.686 52 30 49.314 30 46V34Z"
        fill="#E53935"
      />
      
      {/* Center accent - fashion/styling element */}
      <rect x="36" y="38" width="8" height="2" rx="1" fill="white" />
      <rect x="36" y="42" width="8" height="2" rx="1" fill="white" />
      <rect x="36" y="46" width="5" height="2" rx="1" fill="white" />
    </svg>
  );
}
