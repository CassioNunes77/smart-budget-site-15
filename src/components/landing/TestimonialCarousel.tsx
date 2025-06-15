
import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Maria Silva",
    role: "Empresária",
    content: "O PINEE transformou completamente minha relação com o dinheiro. Em 3 meses consegui organizar todas as finanças!",
    rating: 5,
    avatar: "MS"
  },
  {
    name: "João Santos",
    role: "Desenvolvedor",
    content: "Interface incrível e funcionalidades que realmente fazem diferença. Recomendo para todos!",
    rating: 5,
    avatar: "JS"
  },
  {
    name: "Ana Costa",
    role: "Professora",
    content: "Nunca pensei que controlar finanças pudesse ser tão simples. O PINEE é fantástico!",
    rating: 5,
    avatar: "AC"
  }
];

const TestimonialCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-green-200/20">
                <Quote className="w-8 h-8 text-green-400 mb-4" />
                <p className="text-white text-lg leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-green-200 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center space-x-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? 'bg-green-400 scale-125' : 'bg-green-200/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
