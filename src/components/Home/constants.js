// Constantes utilizadas en HomeView y sus componentes

export const APPOINTMENT_STATUS = {
    SCHEDULED: 'SCHEDULED',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  };
  
  export const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];
  
  export const DAILY_TIPS = [
    {
      title: '💧 Mantén tu piel hidratada',
      content: 'Bebe al menos 8 vasos de agua al día y usa crema hidratante por la mañana y noche. Tu piel te lo agradecerá y los resultados de tus tratamientos durarán más tiempo.'
    },
    {
      title: '☀️ Protege tu piel del sol',
      content: 'Usa protector solar SPF 30+ todos los días, incluso en días nublados. Es la mejor forma de prevenir el envejecimiento prematuro y mantener los resultados de tus tratamientos.'
    },
    {
      title: '🥗 Alimentación saludable',
      content: 'Una dieta rica en antioxidantes, vitaminas y minerales se refleja directamente en tu piel. Incluye frutas, verduras y omega-3 en tu alimentación diaria.'
    },
    {
      title: '😴 Duerme lo suficiente',
      content: 'Tu piel se regenera mientras duermes. Procura dormir 7-8 horas para que tu piel pueda repararse y lucir radiante al día siguiente.'
    },
    {
      title: '🧘‍♀️ Reduce el estrés',
      content: 'El estrés afecta directamente tu piel. Practica técnicas de relajación como meditación, yoga o ejercicios de respiración para mantener tu piel saludable.'
    }
  ];
  
  export const VIP_BENEFITS = [
    { icon: 'Star', text: '20% descuento en todos los servicios' },
    { icon: 'Calendar', text: 'Acceso prioritario a citas' },
    { icon: 'Gift', text: 'Tratamientos exclusivos' },
    { icon: 'Shield', text: 'Garantía extendida' },
    { icon: 'Heart', text: 'Consultas gratuitas' },
    { icon: 'Sparkles', text: 'Productos premium incluidos' }
  ];
  
  export const ACHIEVEMENT_THRESHOLDS = {
    FREQUENT_CLIENT: 5,
    VIP_CLIENT: 10,
    LOYAL_CLIENT: 20,
    PREMIUM_CLIENT: 50
  };
  
  export const GREETINGS = {
    MORNING: 'Buenos días',
    AFTERNOON: 'Buenas tardes', 
    EVENING: 'Buenas noches'
  };
  
  export const DATE_LIMITS = {
    MIN_ADVANCE_DAYS: 0,
    MAX_ADVANCE_MONTHS: 3
  };
  
  export const ANIMATION_DELAYS = {
    CARD_1: '0ms',
    CARD_2: '100ms',
    CARD_3: '200ms',
    CARD_4: '300ms'
  };