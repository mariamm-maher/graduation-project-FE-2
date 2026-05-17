/**
 * Normalizes owner profile from API (camelCase + snake_case) for UI and save payloads.
 */
export function normalizeOwnerProfile(ownerProfileData = {}, userProfile = {}) {
  const tone = ownerProfileData?.brandTone || ownerProfileData?.brand_tone || null;
  const normalizedTone = tone
    ? {
        tone_formality: tone.tone_formality ?? 3,
        tone_playfulness: tone.tone_playfulness ?? 3,
        tone_boldness: tone.tone_boldness ?? 3,
        preferred_vocabulary: tone.preferred_vocabulary || [],
        avoided_vocabulary: tone.avoided_vocabulary || [],
      }
    : null;

  return {
    ...ownerProfileData,
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
    status: userProfile.status,
    userId: userProfile.id,
    brandTone: normalizedTone,
    brand_tone: normalizedTone,
  };
}
