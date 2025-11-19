import React from 'react';

const IntroductionSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title with Decorative Elements */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
              <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-amber-600 text-sm tracking-wider uppercase">Introduction of Restho</span>
            <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-amber-600">
              <path d="M2 8L8 2M8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 8L32 2M32 2L38 8M32 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">
            We Are Experienced Restaurant.
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Left Side - Chef Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
              alt="Chef cooking"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Middle - Mission and Quote */}
          <div className="space-y-6">
            {/* Our Mission */}
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-amber-600">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 10V20L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3 className="text-2xl font-serif font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Delicious Food.</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Expert Chef.</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Cost Effective.</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Letraset Sheets.</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Clean Environment.</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">Quality Food.</span>
                </div>
              </div>
            </div>

            {/* Featured Quote */}
            <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-amber-600 shadow-sm">
              <p className="text-gray-600 text-lg italic leading-relaxed mb-6">
                "Welcome our restaurant! Our Restaurant is the best as like delicious food, nutrition food etc in world-wide."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                  alt="Mr. Hamilton"
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-600"
                />
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">Mr. Hamilton</h4>
                  <p className="text-gray-500 text-sm">CEO &Founder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Food Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
              alt="Grilled steak"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;