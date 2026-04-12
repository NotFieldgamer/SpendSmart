// src/components/CreditCard.jsx
import { creditCard } from '../utils/data';

export default function CreditCard() {
  return (
    <div className="relative w-full aspect-[1.58/1] rounded-3xl overflow-hidden card-shimmer shadow-premium select-none">
      {/* Gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #3525cd 0%, #4d44e3 55%, #6366f1 100%)',
      }} />

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute top-4 right-16 w-16 h-16 rounded-full bg-white/8" />

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-label">SpendSmart</p>
            <p className="text-white/90 text-xs font-medium mt-0.5">Premium Card</p>
          </div>
          {/* Mastercard-style circles */}
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-white/25 backdrop-blur-sm" />
            <div className="w-7 h-7 rounded-full bg-white/35 backdrop-blur-sm -ml-3" />
          </div>
        </div>

        {/* Chip */}
        <div className="w-8 h-6 rounded-md bg-white/20 border border-white/30" />

        {/* Card number */}
        <p className="text-white font-mono text-sm tracking-[0.2em] font-medium">
          {creditCard.number}
        </p>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-label mb-0.5">Card Holder</p>
            <p className="text-white text-sm font-semibold font-headline">{creditCard.holder}</p>
          </div>
          <div className="text-center">
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-label mb-0.5">Expires</p>
            <p className="text-white text-sm font-semibold font-headline">{creditCard.expires}</p>
          </div>
          <p className="text-white/80 text-xl font-bold italic font-headline">{creditCard.type}</p>
        </div>
      </div>
    </div>
  );
}
