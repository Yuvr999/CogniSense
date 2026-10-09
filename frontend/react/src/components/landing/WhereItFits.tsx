import React from 'react';

export function WhereItFits() {
  const steps = [
    { title: "Routine Visit", desc: "Annual wellness exam or subjective memory complaint." },
    { title: "8-minute screen", desc: "CogniSense tablet app in the waiting room or clinic." },
    { title: "Explained result", desc: "Clinician reviews the automated flags and probabilities." },
    { title: "Next step", desc: "Full cognitive battery, blood biomarkers, or specialist referral." },
    { title: "EHR", desc: "Data exported to patient record via FHIR." }
  ];

  return (
    <section className="py-24 md:py-40 bg-paper px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-ink">Where it fits</h2>
        
        <div className="flex flex-col md:flex-row items-stretch justify-between relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2 z-0"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="flex-1 relative z-10 flex flex-col items-center group mb-8 md:mb-0 px-2 focus-within:z-20">
              <div 
                className="w-12 h-12 rounded-full bg-white border-4 border-paper shadow-md flex items-center justify-center font-bold text-ink mb-6 transition-transform group-hover:scale-125 group-focus-within:scale-125 group-hover:bg-lime group-focus-within:bg-lime"
                tabIndex={0}
              >
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity bg-white p-3 rounded-lg shadow-sm absolute top-32 md:top-24 w-48 pointer-events-none">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
