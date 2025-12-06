import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../ui/Button';

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for exploring AI tools.",
    features: ["Access to 5 basic agents", "100 daily credits", "Community support", "Basic templates"],
    cta: "Start Free",
    variant: "outline" as const
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For power users and creators.",
    features: ["Unlimited AI tools access", "Priority processing", "Custom agent builder", "API access (limited)"],
    cta: "Get Pro",
    variant: "primary" as const,
    popular: true
  },
  {
    name: "Ultimate",
    price: "$99",
    desc: "For teams and businesses.",
    features: ["Everything in Pro", "Dedicated support", "Team collaboration", "Full API access", "SSO & Security"],
    cta: "Contact Sales",
    variant: "outline" as const
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-500">Choose the plan that fits your ambition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-3xl p-8 border ${plan.popular ? 'border-black shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-sm'} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500">{plan.desc}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-black shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full justify-center rounded-xl">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
