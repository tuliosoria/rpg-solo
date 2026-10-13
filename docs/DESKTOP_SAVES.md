# Desktop saves and startup recovery

The packaged game stores progress in its Electron user profile. Its local page
uses `http://127.0.0.1:43196`; Chromium associates browser storage with the full
origin, including the port. The game must keep this origin across launches.

If port 43196 is occupied, startup now displays an error and exits. Close another
running copy of the game, or identify and close the application using that port,
then relaunch. Do not terminate an unfamiliar process. The failed startup does
not clear or migrate saves, and the game does not fall back to a different port.

## Saves from earlier builds

Earlier builds could fall back to ports 43197–43200. Progress written under one
of those origins remains in the same profile but is not visible at port 43196.
This change does not automatically merge those stores: a newer save at one origin
must not silently overwrite another save.

If saves appear missing after updating, stop playing before creating replacement
saves and contact the maintainers through the repository. Preserve the complete
Electron `userData` directory before attempting recovery. The desktop support
information includes the actual profile path; the usual Windows location is
`%APPDATA%/varginha-terminal-1996`. Keep backups private because they contain your
progress and settings. Do not clear app data, edit LevelDB files, or run scripts
from an untrusted page to recover saves.

Recovery from a legacy origin requires developer-assisted export using a trusted
build and the original profile, followed by an explicit import/merge decision.
No automatic migration or general-purpose recovery tool is included in this fix.
Steam Cloud, when enabled, may contain another copy; deleting local storage does
not guarantee deletion of that cloud copy.

## Release verification

- Use a task-owned fresh profile to launch, save, quit, and relaunch the packaged
  app; verify the same origin and saved progress.
- Occupy the canonical port with a task-owned server and verify the app reports
  the collision, exits, and never loads another storage origin.
- Close that server and verify the original profile still loads its progress.
- Test upgrades with copies of profiles from the builds distributed to players,
  including any known legacy fallback-origin profiles.
