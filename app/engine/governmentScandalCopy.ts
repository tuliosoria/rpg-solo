// Adaptive copy for the `government_scandal` ending.
//
// The ending is intentionally under-dramatic for a *mundane* military-logistics
// leak ("purpose still classified"). But the player can reach it while having
// leaked genuine smoking-gun contact files, in which case two of its lines become
// false. When such a file is present we swap ONLY those two lines; everything else
// (trigger, categories, other endings) is unchanged.

// Basenames of files that contain direct creature-contact / specimen evidence.
export const SMOKING_GUN_CONTACT_FILES: ReadonlySet<string> = new Set<string>([
  'jardim_andere_incident.txt',      // direct-contact field report
  'incident_report_1996_01_VG.txt',  // "biological specimens recovered"
]);

// Replaces government_scandal narrative[0] when a smoking gun is present.
export const SMOKING_GUN_NARRATIVE_INTRO =
  'Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.';

// Replaces government_scandal aol.body[1] when a smoking gun is present.
export const SMOKING_GUN_AOL_PURPOSE =
  "Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.";

export function hasSmokingGunContact(
  savedFiles: ReadonlySet<string> | undefined | null,
): boolean {
  if (!savedFiles) return false;
  for (const fullPath of savedFiles) {
    const basename = fullPath.split('/').pop() ?? fullPath;
    if (SMOKING_GUN_CONTACT_FILES.has(basename)) return true;
  }
  return false;
}

export function resolveGovernmentScandalNarrative(
  baseNarrative: readonly string[],
  savedFiles: ReadonlySet<string> | undefined | null,
): string[] {
  if (baseNarrative.length === 0 || !hasSmokingGunContact(savedFiles)) {
    return [...baseNarrative];
  }
  return [SMOKING_GUN_NARRATIVE_INTRO, ...baseNarrative.slice(1)];
}

export function resolveGovernmentScandalAolBody(
  baseBody: readonly string[],
  savedFiles: ReadonlySet<string> | undefined | null,
): string[] {
  if (baseBody.length < 2 || !hasSmokingGunContact(savedFiles)) {
    return [...baseBody];
  }
  return baseBody.map((line, i) => (i === 1 ? SMOKING_GUN_AOL_PURPOSE : line));
}
