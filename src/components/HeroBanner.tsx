import { ReactNode } from "react";
import { Tractor } from "lucide-react";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  showTractorPattern?: boolean;
  children?: ReactNode;
}

const HeroBanner = ({ 
  title, 
  subtitle, 
  description, 
  backgroundImage,
  showTractorPattern = true,
  children 
}: HeroBannerProps) => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-primary to-secondary overflow-hidden">
      {/* Background Image if provided */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}
      
      {/* Tractor Pattern Background */}
      {showTractorPattern && !backgroundImage && (
        <>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <Tractor 
                key={i} 
                className="absolute text-white"
                style={{
                  width: '60px',
                  height: '60px',
                  left: `${(i % 5) * 25}%`,
                  top: `${Math.floor(i / 5) * 30}%`,
                  transform: `rotate(${i * 15}deg)`
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <div className="text-2xl md:text-3xl font-bold text-accent mb-4">
              {subtitle}
            </div>
          )}
          {description && (
            <p className="text-xl text-white/90 mb-6">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;