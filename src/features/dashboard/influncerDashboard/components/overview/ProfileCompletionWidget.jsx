import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../../../../stores/authStore';

const ProfileCompletionWidget = () => {
    const { getProfile } = useAuthStore();
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkCompletion = async () => {
            try {
                const response = await getProfile();
                if (response?.success && response?.data) {
                    const percentage = response.data.completionPercentage || 0;
                    setCompletionPercentage(percentage);
                    if (percentage < 100) {
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch profile completion:', error);
            } finally {
                setLoading(false);
            }
        };

        checkCompletion();
    }, [getProfile]);

    if (loading || !isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
            <div className="flex items-center gap-5 w-full sm:w-auto">
                {/* Circular Progress Indicator */}
                <div className="relative w-14 h-14 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            className="text-white/10"
                            strokeWidth="4"
                            fill="none"
                            stroke="currentColor"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="28"
                            cy="28"
                            r="24"
                            className="text-[#C1B6FD]"
                            strokeWidth="4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeDasharray={151} // 2 * PI * 24
                            strokeDashoffset={151 - (151 * completionPercentage) / 100}
                            initial={{ strokeDashoffset: 151 }}
                            animate={{ strokeDashoffset: 151 - (151 * completionPercentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{completionPercentage}%</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Complete your profile</h3>
                    <p className="text-sm text-gray-400">
                        Add missing details
                    </p>
                </div>
            </div>

            <div className="flex w-full sm:w-auto">
                <Link
                    to="/dashboard/influencer/complete-profile"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-[#745CB4] hover:bg-[#6c55a8] text-white rounded-xl font-semibold transition-all hover:scale-105"
                >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
};

export default ProfileCompletionWidget;
