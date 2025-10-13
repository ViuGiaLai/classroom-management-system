import { StatBadge } from './StatBadge';
import { FeatureCard } from './FeatureCard';
import GraduationCapIcon from '../icons/GraduationCapIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import UsersIcon from '../icons/UsersIcon';
import AwardIcon from '../icons/AwardIcon';

interface LeftPanelProps {
  stats: {
    students: { count: string; label: string };
    courses: { count: string; label: string };
  };
  features: Array<{ id: string; title: string }>;
}

export function LeftPanel({ stats, features }: LeftPanelProps) {
  const featureIcons = [
    <BookOpenIcon width={24} height={24} color="#ffffff" />,
    <UsersIcon width={24} height={24} color="#ffffff" />,
    <AwardIcon width={24} height={24} color="#ffffff" />
  ];

  return (
    <div className="w-full md:w-1/2 min-h-screen bg-gradient-to-b from-primary-blue to-primary-blue-dark p-6 md:p-8 lg:p-12 flex flex-col">
      {/* Logo and Tagline */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <GraduationCapIcon width={28} height={28} color="#ffffff" />
        </div>
        <div>
          <h1 className="heading-medium">EduManage</h1>
          <p className="small-text text-info-blue">Learning Management System</p>
        </div>
      </div>

      {/* Classroom Image with Stats */}
      <div className="flex-1 relative rounded-xl overflow-hidden mb-8">
        <img
          src="https://ngoaingu.donga.edu.vn/Portals/10/THDK_4_1.jpg"
          alt="Modern classroom with students and teacher presentation"
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: 'center 40%' }}
        />
        
        {/* Stat Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-3">
          <StatBadge
            count={stats.students.count}
            label={stats.students.label}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
        </div>

        <div className="absolute bottom-4 left-4">
          <StatBadge
            count={stats.courses.count}
            label={stats.courses.label}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            id={feature.id}
            title={feature.title}
            icon={featureIcons[index]}
          />
        ))}
      </div>
    </div>
  );
}