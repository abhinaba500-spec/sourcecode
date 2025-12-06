import React from 'react';

const testimonials = [
  {
    quote: "Gravity AI changed my workflow forever. It's like having a team of 20 experts in my pocket.",
    author: "Sarah Jenkins",
    role: "Product Designer",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    quote: "Better than 20 separate subscriptions. The integration between tools is seamless.",
    author: "Michael Chen",
    role: "Indie Developer",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    quote: "The custom agent builder allowed us to automate our entire customer support flow.",
    author: "Elena Rodriguez",
    role: "CTO, TechFlow",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Loved by creators worldwide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.img} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
