// Componente principal
export { default as ProfileView } from './ProfileView';

// Componentes de UI
export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileHeroSection } from './ProfileHeroSection';
export { default as ProfileStatsGrid } from './ProfileStatsGrid';
export { default as ProfileEditForm } from './ProfileEditForm';

// Componentes de citas y actividad
export { default as ProfileAppointmentCard } from './ProfileAppointmentCard';
export { default as ProfileUpcomingAppointments } from './ProfileUpcomingAppointments';
export { default as ProfileActivityItem } from './ProfileActivityItem';
export { default as ProfileRecentActivity } from './ProfileRecentActivity';

// Componentes de configuración
export { default as ProfilePreferences } from './ProfilePreferences';
export { default as ProfileErrorSuccessAlerts } from './ProfileErrorSuccessAlerts';
export { default as ProfileLoadingStates } from './ProfileLoadingStates';

// Utilidades
export { calculateProfileStats } from './ProfileStatsCalculator';
export { generateRecentActivity } from './ProfileActivityGenerator';

// Exportación por defecto del componente principal
export default ProfileView;