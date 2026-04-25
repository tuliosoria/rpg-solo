import { describe, it, expect } from 'vitest';
import { getEvidenceVideoAttachment, normalizeVideoPromptChoice } from '../terminalHelpers';

describe('getEvidenceVideoAttachment', () => {
  const internalRoot = '/internal';

  it('matches English open command', () => {
    const attachment = getEvidenceVideoAttachment('open jardim_andere_incident.txt', internalRoot);
    expect(attachment?.fileName).toBe('jardim_andere_incident.txt');
  });

  it('matches English cat command', () => {
    const attachment = getEvidenceVideoAttachment('cat witness_farm_recording.txt', internalRoot);
    expect(attachment?.fileName).toBe('witness_farm_recording.txt');
  });

  it('matches PT-BR/ES "abrir" alias', () => {
    const attachment = getEvidenceVideoAttachment('abrir jardim_andere_incident.txt', internalRoot);
    expect(attachment?.fileName).toBe('jardim_andere_incident.txt');
  });

  it('matches "abrir" with witness_farm_recording', () => {
    const attachment = getEvidenceVideoAttachment(
      'abrir witness_farm_recording.txt',
      internalRoot
    );
    expect(attachment?.fileName).toBe('witness_farm_recording.txt');
  });

  it('returns null for unrelated commands', () => {
    expect(getEvidenceVideoAttachment('ls jardim_andere_incident.txt', internalRoot)).toBeNull();
    expect(getEvidenceVideoAttachment('rm jardim_andere_incident.txt', internalRoot)).toBeNull();
  });

  it('returns null for files without a video attachment', () => {
    expect(getEvidenceVideoAttachment('open readme.txt', internalRoot)).toBeNull();
    expect(getEvidenceVideoAttachment('abrir readme.txt', internalRoot)).toBeNull();
  });

  it('is case-insensitive on the command name', () => {
    expect(
      getEvidenceVideoAttachment('OPEN jardim_andere_incident.txt', internalRoot)?.fileName
    ).toBe('jardim_andere_incident.txt');
    expect(
      getEvidenceVideoAttachment('Abrir jardim_andere_incident.txt', internalRoot)?.fileName
    ).toBe('jardim_andere_incident.txt');
  });
});

describe('normalizeVideoPromptChoice', () => {
  it('accepts EN/PT/ES affirmatives', () => {
    expect(normalizeVideoPromptChoice('y')).toBe('yes');
    expect(normalizeVideoPromptChoice('yes')).toBe('yes');
    expect(normalizeVideoPromptChoice('sim')).toBe('yes');
    expect(normalizeVideoPromptChoice('sí')).toBe('yes');
  });

  it('accepts EN/PT/ES negatives', () => {
    expect(normalizeVideoPromptChoice('n')).toBe('no');
    expect(normalizeVideoPromptChoice('no')).toBe('no');
    expect(normalizeVideoPromptChoice('não')).toBe('no');
    expect(normalizeVideoPromptChoice('nao')).toBe('no');
  });
});
