// erp-frontend/src/components/common/LoadingLogo.tsx
// erp-frontend/src/components/common/LoadingLogo.tsx
"use client";
import React from "react";

type Props = {
  withText?: boolean;
  className?: string;
  textClassName?: string;
  progress?: number;
  loadingText?: string;
};

export default function LoadingLogo({
  withText = true,
  className = "",
  textClassName = "",
  progress: _progress = 0,
  loadingText = ""
}: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-8 ${className}`}>
      <div className="relative">
        <svg
          width="140"
          height="140"
          viewBox="0 0 32 32"
          aria-label="Unibase ERP Logo"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <defs>
            {/* Brand color gradient - using #0046FF */}
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0046FF" />
              <stop offset="100%" stopColor="#0038CC" />
            </linearGradient>

            {/* Darker brand gradient for dark mode */}
            <linearGradient id="bgGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0038CC" />
              <stop offset="100%" stopColor="#002B99" />
            </linearGradient>

            {/* Right side shadow */}
            <linearGradient id="rightShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="80%" stopColor="rgba(0,0,0,0.2)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </linearGradient>

            {/* Bottom side shadow */}
            <linearGradient id="bottomShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" />
              <stop offset="80%" stopColor="rgba(0,0,0,0.2)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </linearGradient>

            {/* Top-left highlight */}
            <linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Main background */}
          <path
            d="M0 8.42105C0 3.77023 3.77023 0 8.42105 0H23.5789C28.2298 0 32 3.77023 32 8.42105V23.5789C32 28.2298 28.2298 32 23.5789 32H8.42105C3.77023 32 0 28.2298 0 23.5789V8.42105Z"
            className="logo-bg"
          />

          {/* Right side 3D effect */}
          <path
            d="M0 8.42105C0 3.77023 3.77023 0 8.42105 0H23.5789C28.2298 0 32 3.77023 32 8.42105V23.5789C32 28.2298 28.2298 32 23.5789 32H8.42105C3.77023 32 0 28.2298 0 23.5789V8.42105Z"
            fill="url(#rightShadow)"
          />

          {/* Bottom side 3D effect */}
          <path
            d="M0 8.42105C0 3.77023 3.77023 0 8.42105 0H23.5789C28.2298 0 32 3.77023 32 8.42105V23.5789C32 28.2298 28.2298 32 23.5789 32H8.42105C3.77023 32 0 28.2298 0 23.5789V8.42105Z"
            fill="url(#bottomShadow)"
          />

          {/* Top-left highlight */}
          <path
            d="M0 8.42105C0 3.77023 3.77023 0 8.42105 0H23.5789C28.2298 0 32 3.77023 32 8.42105V23.5789C32 28.2298 28.2298 32 23.5789 32H8.42105C3.77023 32 0 28.2298 0 23.5789V8.42105Z"
            fill="url(#highlight)"
          />

          <g className="bar bar-a">
            <path
              d="M8.42383 8.42152C8.42383 7.49135 9.17787 6.7373 10.108 6.7373C11.0382 6.7373 11.7922 7.49135 11.7922 8.42152V23.5794C11.7922 24.5096 11.0382 25.2636 10.108 25.2636C9.17787 25.2636 8.42383 24.5096 8.42383 23.5794V8.42152Z"
              className="bar-fill"
            />
          </g>

          <g className="bar bar-b">
            <path
              d="M14.7422 15.1569C14.7422 14.2267 15.4962 13.4727 16.4264 13.4727C17.3566 13.4727 18.1106 14.2267 18.1106 15.1569V23.5779C18.1106 24.5081 17.3566 25.2621 16.4264 25.2621C15.4962 25.2621 14.7422 24.5081 14.7422 23.5779V15.1569Z"
              className="bar-fill"
              opacity="0.9"
            />
          </g>

          <g className="bar bar-c">
            <path
              d="M21.0547 10.9459C21.0547 10.0158 21.8087 9.26172 22.7389 9.26172C23.6691 9.26172 24.4231 10.0158 24.4231 10.9459V23.5775C24.4231 24.5077 23.6691 25.2617 22.7389 25.2617C21.8087 25.2617 21.0547 24.5077 21.0547 23.5775V10.9459Z"
              className="bar-fill"
              opacity="0.75"
            />
          </g>
        </svg>

      </div>

      {withText && (
        <div className={`text-center ${textClassName}`}>
          {/* Loading text and dot animation */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {loadingText}
            </p>
            {/* <div className="flex items-end gap-2" aria-label="Loading">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
            </div> */}
          </div>
        </div>
      )}

      <style jsx>{`
        /* Clean theme-compatible background - keeping blue theme */
        .logo-bg {
          fill: url(#bgGradient);
        }
        
        :global(.dark) .logo-bg {
          fill: url(#bgGradientDark);
        }
        
        /* Clean bar fills */
        .bar-fill {
          fill: white;
        }
        
        :global(.dark) .bar-fill {
          fill: #f3f4f6;
        }
        
        /* Simple bar animations */
        @keyframes upDownA {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes upDownB {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes upDownC {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .bar {
          transform-origin: center;
          transform-box: fill-box;
          will-change: transform;
          animation-duration: 1.2s;
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
        
        /* Subtle floating effect with brand color drop shadow */
        svg {
          animation: logoFloat 3s ease-in-out infinite;
          filter: drop-shadow(0 8px 16px rgba(0, 70, 255, 0.3));
        }
        
        :global(.dark) svg {
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));
        }
        
        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-2px);
          }
        }
        
        /* Clean dots */
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0046FF;
          display: inline-block;
          animation: dotBounce 1s ease-in-out infinite;
        }
        
        :global(.dark) .dot {
          background: #3366FF;
        }
        
        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: 0.15s; }
        .dot-3 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}