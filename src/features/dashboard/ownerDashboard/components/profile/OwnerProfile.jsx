import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Edit, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useProfileStore from '../../../../../stores/profileStore';

export default function OwnerProfile() {
  const navigate = useNavigate();
  const fetchOwnerProfile = useProfileStore((s) => s.fetchOwnerProfile);
  const ownerProfile = useProfileStore((s) => s.ownerProfile);
  const isLoading = useProfileStore((s) => s.isLoading);
  const fetchOwnerCompletion = useProfileStore((s) => s.fetchOwnerCompletion);
  const [completion, setCompletion] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchOwnerProfile();
        console.log('fetchOwnerProfile result:', res);
        const comp = await fetchOwnerCompletion();
        console.log('fetchOwnerCompletion result:', comp);
        setCompletion(comp?.data ?? comp);
      } catch (err) {
        console.error('fetchOwnerProfile error', err);
        toast.error('Failed to load owner profile');
      }
    };

    load();
  }, [fetchOwnerProfile, fetchOwnerCompletion]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!ownerProfile) {
    return (
      <div className="p-6">
        <p className="text-gray-400">No owner profile found.</p>
        <div className="mt-4">
          <button
            onClick={() => navigate('/dashboard/owner')}
            className="px-4 py-2 bg-[#745CB4] text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    businessName,
    businessType,
    industry,
    location,
    description,
    image,
    website,
    phoneNumber,
    platformsUsed,
    primaryMarketingGoal,
    targetAudience,
    completionPercentage
  } = ownerProfile;

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Owner Profile</h1>
          <p className="text-sm text-gray-400">Manage and review your business profile</p>
        </div>
        <div className="flex items-center gap-3">
          {completion && completion.percentage < 100 && (
            <Link 
              to="/dashboard/owner/profile/complete" 
              className="px-4 py-2 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD] rounded-lg hover:opacity-90 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete your profile
            </Link>
          )}
          <Link 
            to="/dashboard/owner/profile/edit" 
            className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <div className="text-sm text-gray-400">{completionPercentage ?? 0}% complete</div>
        </div>
      </div>

      {/* Owner basic info */}
      <div className="mb-6 bg-white/3 p-4 rounded-lg flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Owner</div>
          <div className="text-base font-semibold">{ownerProfile.firstName || ''} {ownerProfile.lastName || ''}</div>
          <div className="text-xs text-gray-400">{ownerProfile.email}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/5">{(ownerProfile.status || '').toUpperCase() || '—'}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            <div>Onboarded: {ownerProfile.isOnboarded ? 'Yes' : 'No'}</div>
            <div>Completed: {ownerProfile.isCompleted ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      {/* Completion Summary */}
      {completion && (
        <div className="mb-6 bg-white/5 p-4 rounded-lg w-full">
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-400">Profile Completion</div>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-36">
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-3 bg-gradient-to-r from-[#745CB4] to-[#C1B6FD]" style={{ width: `${completion.percentage ?? 0}%` }} />
                  </div>
                </div>
                <div className="text-sm text-gray-200">{completion.percentage ?? 0}%</div>
                <div className="text-xs text-gray-400">{completion.filledFields ?? 0}/{completion.totalFields ?? 0} fields</div>
              </div>
            </div>

            <div className="flex-1 text-right md:text-right">
              {Array.isArray(completion.missingFields) && completion.missingFields.length > 0 ? (
                <div>
                  <div className="text-xs text-gray-400">Missing Fields</div>
                  <div className="mt-2 flex flex-wrap gap-2 justify-end">
                    {completion.missingFields.map((f, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300">{f}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-green-300">All required fields completed</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/5 p-6 rounded-2xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="w-full h-44 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt="brand" className="object-contain w-full h-full" />
              ) : (
                <div className="text-gray-500 flex flex-col items-center gap-2">
                  <Image className="w-10 h-10" />
                  <span>No image</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <div>
                <div className="text-xs text-gray-400">Website</div>
                <div className="truncate">
                  {website ? (
                    <a href={website} target="_blank" rel="noreferrer" className="text-[#C1B6FD] hover:underline">{website}</a>
                  ) : <span className="text-gray-500">—</span>}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Phone</div>
                <div>{phoneNumber || '—'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Location</div>
                <div>{location || '—'}</div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <h2 className="text-lg font-semibold">{businessName || 'Business Name'}</h2>
            <p className="text-sm text-gray-400 mb-4">{businessType || '—'} • {industry || '—'}</p>

            <div className="text-sm text-gray-200 leading-relaxed mb-4">
              {description || 'No description provided.'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/3 p-4 rounded-lg">
                <div className="text-xs text-gray-400">Platforms Used</div>
                <div className="mt-2 text-sm text-gray-200">
                  {Array.isArray(platformsUsed) && platformsUsed.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {platformsUsed.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  ) : <span className="text-gray-500">—</span>}
                </div>
              </div>

              <div className="bg-white/3 p-4 rounded-lg">
                <div className="text-xs text-gray-400">Primary Marketing Goal</div>
                <div className="mt-2 text-sm text-gray-200">{primaryMarketingGoal || '—'}</div>
              </div>

              <div className="bg-white/3 p-4 rounded-lg md:col-span-2">
                <div className="text-xs text-gray-400">Target Audience</div>
                <div className="mt-2 text-sm text-gray-200">
                  {targetAudience ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-gray-400">Gender</div>
                        <div className="text-sm text-gray-200">{targetAudience.gender || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Age Range</div>
                        <div className="text-sm text-gray-200">{targetAudience.ageRange || '—'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Location</div>
                        <div className="text-sm text-gray-200">{targetAudience.location || '—'}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
