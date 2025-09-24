import React, { useState } from 'react';
const ReservationSection: React.FC = () => {

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50 relative overflow-hidden border-b border-gray-200">
      <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Reservation+BG')" }}></div>
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-2xl font-bold"> FORM ĐẶT BÀN </h1>
      </div>
    </section>
  );
};

export default ReservationSection;