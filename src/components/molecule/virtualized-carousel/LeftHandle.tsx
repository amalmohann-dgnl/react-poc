import React from "react";

const LeftHandle = (): JSX.Element => {
  return (
    <svg
      width="45"
      height="44"
      viewBox="0 0 45 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="22"
        cy="21.5"
        r="10.5"
        transform="rotate(-180 22 21.5)"
        fill="white" />
      <path
        d="M40.833 21.9998C40.833 11.8798 32.6197 3.6665 22.4997 3.6665C12.3797 3.6665 4.16634 11.8798 4.16634 21.9998C4.16634 32.1198 12.3797 40.3332 22.4997 40.3332C32.6197 40.3332 40.833 32.1198 40.833 21.9998ZM16.083 21.9998L24.333 13.7498L26.918 16.3532L21.2713 21.9998L26.918 27.6465L24.333 30.2498L16.083 21.9998Z"
        fill="black" />
    </svg>
  );
};

export default LeftHandle;
