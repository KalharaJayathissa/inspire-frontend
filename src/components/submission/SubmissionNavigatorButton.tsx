import React from "react";

function SubmissionNavigatorButton() {
  return (
    <div className="pt-8 sm:pt-10 relative">
      {/* Floating glow effect */}
      <div className="absolute inset-0 -z-10">
        <div className="w-96 h-96 mx-auto bg-gradient-to-r from-green-400/20 via-blue-400/10 to-purple-400/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      </div>

      {/* Main card with advanced glassmorphism */}
      <div className="max-w-lg mx-auto relative group">
        {/* Outer glow ring */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-green-400/20 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-500"></div>

        {/* Main card */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-green-500/20 transition-all duration-500 hover:bg-white/15 hover:border-white/30">
          {/* Header with animated badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent flex items-center">
                  <span className="mr-2 text-lg animate-bounce">🚀</span>
                  Available Now
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button with premium effects */}
          <a
            href="/submissions"
            className="relative block w-full group/button overflow-hidden"
          >
            {/* Button background with animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-green-500/20 rounded-xl blur transition-all duration-300 group-hover/button:blur-md group-hover/button:scale-110"></div>

            {/* Main button */}
            <div className="relative flex items-center justify-center px-8 py-5 bg-gradient-to-r from-green-600/80 via-green-700/80 to-green-600/80 hover:from-green-500/90 hover:via-green-600/90 hover:to-green-500/90 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-green-500/25">
              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine"></div>
              </div>

              {/* Button content */}
              <div className="relative flex items-center text-white font-semibold">
                <svg
                  className="w-6 h-6 mr-3 group-hover/button:rotate-12 group-hover/button:scale-110 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-lg sm:text-xl mr-3">
                  📄 Document Submissions
                </span>
                <svg
                  className="w-5 h-5 group-hover/button:translate-x-2 group-hover/button:scale-110 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </a>

          {/* Enhanced description */}
          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-700/80 font-medium leading-relaxed">
              Secure upload & instant NIC verification
            </p>
            <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-600/70">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Fast Processing
              </span>
              <span className="flex items-center">
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                Secure Upload
              </span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl opacity-50"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
}

export default SubmissionNavigatorButton;
