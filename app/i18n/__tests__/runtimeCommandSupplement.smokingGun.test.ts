import { describe, it, expect } from 'vitest';
import { RUNTIME_COMMAND_SUPPLEMENT } from '../runtimeCommandSupplement';

const AOL_PURPOSE_KEY =
  "Unlike the transport and command records, two of the leaked files name the operation's purpose: an incident report references 'biological specimens recovered' from the Jardim Andere site, and a field report describes a surviving occupant. Forensic analysts working around the clock report the documents may be authentic; wire services are already calling it the most consequential leak of the decade.";

const NARRATIVE_INTRO_KEY =
  'Transport logs. Response orders. And two files that a mobilization story cannot contain: an incident report logging biological specimens recovered from the Jardim Andere site, and a field report describing direct contact with a surviving occupant. This is no longer only proof that the Brazilian military hid something on January 20, 1996 — it is the first page of what it was hiding.';

describe('runtimeCommandSupplement smoking-gun keys', () => {
  it('has Portuguese translations for both new strings', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT['pt-BR'][AOL_PURPOSE_KEY]).toContain('propósito da operação');
    expect(RUNTIME_COMMAND_SUPPLEMENT['pt-BR'][NARRATIVE_INTRO_KEY]).toContain('primeira página');
  });

  it('has Spanish translations for both new strings', () => {
    expect(RUNTIME_COMMAND_SUPPLEMENT['es'][AOL_PURPOSE_KEY]).toContain(
      'propósito de la operación'
    );
    expect(RUNTIME_COMMAND_SUPPLEMENT['es'][NARRATIVE_INTRO_KEY]).toContain('primera página');
  });
});
