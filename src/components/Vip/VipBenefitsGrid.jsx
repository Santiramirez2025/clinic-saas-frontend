import React from 'react';
import { Star, Calendar, Gift, Zap, Heart, Users } from 'lucide-react';
import VipBenefitCard from './VipBenefitCard';

const VipBenefitsGrid = ({ isVIP = false }) => {
  // Beneficios VIP configurables
  const vipBenefits = [
    {
      icon: Star,
      title: 'Descuentos Exclusivos',
      description: 'Hasta 25% OFF en todos nuestros servicios premium',
      highlight: '25% OFF',
      color: 'from-yellow-400 to-orange-500',
      active: isVIP
    },
    {
      icon: Calendar,
      title: 'Reservas Prioritarias',
      description: 'Acceso preferencial a los mejores horarios disponibles',
      highlight: 'Prioridad VIP',
      color: 'from-blue-400 to-indigo-500',
      active: isVIP
    },
    {
      icon: Gift,
      title: 'Consultas Gratuitas',
      description: 'Evaluaciones completas sin costo adicional',
      highlight: 'Sin costo',
      color: 'from-green-400 to-emerald-500',
      active: isVIP
    },
    {
      icon: Zap,
      title: 'Tratamientos Premium',
      description: 'Tecnología de última generación exclusiva para VIP',
      highlight: 'Exclusivo',
      color: 'from-purple-400 to-pink-500',
      active: isVIP
    },
    {
      icon: Heart,
      title: 'Seguimiento Personalizado',
      description: 'Plan de cuidado diseñado especialmente para ti',
      highlight: 'Personalizado',
      color: 'from-red-400 to-pink-500',
      active: isVIP
    },
    {
      icon: Users,
      title: 'Comunidad Exclusiva',
      description: 'Eventos especiales y talleres para miembros VIP',
      highlight: 'Solo VIP',
      color: 'from-teal-400 to-cyan-500',
      active: isVIP
    }
  ];

  return (
    <div className="mb-12 overflow-hidden">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        {isVIP ? 'Tus Beneficios Activos' : 'Beneficios Exclusivos VIP'}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {vipBenefits.map((benefit, index) => (
          <VipBenefitCard 
            key={index} 
            benefit={benefit} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default VipBenefitsGrid;