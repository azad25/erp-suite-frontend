// erp-frontend/src/components/common/LoadingLogo.tsx
"use client";
import React from "react";

type Props = {
  withText?: boolean;
  className?: string;
  textClassName?: string;
};

export default function LoadingLogo({ withText = true, className = "", textClassName = "" }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-8 ${className}`}>
      <div className="relative">
        <svg
          width="140"
          height="140"
          viewBox="0 0 32 32"
          aria-label="Unibase ERP Logo"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <path
            d="M0 8.42105C0 3.77023 3.77023 0 8.42105 0H23.5789C28.2298 0 32 3.77023 32 8.42105V23.5789C32 28.2298 28.2298 32 23.5789 32H8.42105C3.77023 32 0 28.2298 0 23.5789V8.42105Z"
            fill="#465FFF"
          />

          <g className="bar bar-a">
            <path
              d="M8.42383 8.42152C8.42383 7.49135 9.17787 6.7373 10.108 6.7373C11.0382 6.7373 11.7922 7.49135 11.7922 8.42152V23.5794C11.7922 24.5096 11.0382 25.2636 10.108 25.2636C9.17787 25.2636 8.42383 24.5096 8.42383 23.5794V8.42152Z"
              fill="white"
            />
          </g>

          <g className="bar bar-b">
            <path
              d="M14.7422 15.1569C14.7422 14.2267 15.4962 13.4727 16.4264 13.4727C17.3566 13.4727 18.1106 14.2267 18.1106 15.1569V23.5779C18.1106 24.5081 17.3566 25.2621 16.4264 25.2621C15.4962 25.2621 14.7422 24.5081 14.7422 23.5779V15.1569Z"
              fill="white"
              fillOpacity="0.9"
            />
          </g>

          <g className="bar bar-c">
            <path
              d="M21.0547 10.9459C21.0547 10.0158 21.8087 9.26172 22.7389 9.26172C23.6691 9.26172 24.4231 10.0158 24.4231 10.9459V23.5775C24.4231 24.5077 23.6691 25.2617 22.7389 25.2617C21.8087 25.2617 21.0547 24.5077 21.0547 23.5775V10.9459Z"
              fill="white"
              fillOpacity="0.7"
            />
          </g>
        </svg>
      </div>

      {withText && (
        <div className={`text-center ${textClassName}`}>
          <p className="text-gray-900 dark:text-white font-semibold text-2xl tracking-tight">
            Unibase ERP Dashboard
          </p>
        </div>
      )}

      <style jsx>{`
        :root { --shift: 6px; }
        @media (prefers-reduced-motion: reduce) {
          :root { --shift: 2px; }
        }
        @keyframes upDownA {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(var(--shift) * -1)); }
        }
        @keyframes upDownB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(var(--shift)); }
        }
        @keyframes upDownC {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(var(--shift) * -0.5)); }
        }
        .bar {
          transform-origin: center;
          animation-duration: 1.5s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .bar-a { 
          animation-name: upDownA; 
          animation-delay: 0s;
        }
        .bar-b { 
          animation-name: upDownB; 
          animation-delay: 0.2s;
        }
        .bar-c { 
          animation-name: upDownC; 
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}