// Shared education-themed light green background for AboutSection and Timeline
const EducationBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-green-100 via-green-50 to-green-200 opacity-80 rounded-3xl blur-2xl"></div>
    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-200 via-green-100 to-green-50 opacity-60 rounded-full blur-3xl"></div>
    <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-green-100 opacity-40 rounded-full blur-2xl"></div>
    {/* Subtle education icons as SVGs */}
    <svg className="absolute top-10 left-10 w-16 h-16 opacity-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12V4" />
    </svg>
    <svg className="absolute bottom-10 right-20 w-14 h-14 opacity-20 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="8" width="16" height="8" rx="2" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  </div>
);

export default EducationBackground;