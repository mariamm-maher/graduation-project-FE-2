import { Award } from 'lucide-react';

function AchievementsCard({ profileData }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-[#C1B6FD]" />
        Achievements
      </h3>
      <div className="space-y-3">
        {profileData.achievements && profileData.achievements.length > 0 ? (
          profileData.achievements.map((achievement, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold">{achievement.title}</p>
                  <p className="text-sm text-gray-400">{achievement.platform} • {achievement.year}</p>
                </div>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No achievements yet</p>
            <p className="text-sm text-gray-500 mt-1">Complete collaborations to earn achievements</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AchievementsCard;
