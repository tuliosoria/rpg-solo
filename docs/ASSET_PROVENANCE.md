# Asset provenance release gate

The [inventory](asset-inventory.csv) records 58 tracked media/font files in `public/` and `videos/`
and their SHA-256 hashes at baseline commit
`e330bfaf1f37c6f03f0b6e9e895e70cb19d38788`. Hashes identify the exact files to
which source records must apply. A pending entry means evidence is missing from
the repository; it is not a finding that the asset is unauthorized.

## Established evidence

- `app/globals.css` identifies the bundled VT323 font subsets as Google Fonts
  subsets. The upstream [copyright and SIL Open Font License 1.1](https://raw.githubusercontent.com/google/fonts/main/ofl/vt323/OFL.txt)
  is included at `public/fonts/OFL.txt`, alongside the font files, so the static
  export and desktop package carry the notice. Retain the original download or
  subset-generation record when available.
- `specs-driven/AUDIO_VIDEO.md` says its videos are AI-generated. Its filenames
  do not establish a current per-file rights record, provider, account, or terms.
- Historical music filenames named several authors in commit `724583c`, but
  commit `0bc693a` replaced those tracks with different blobs. Those names cannot
  establish attribution or permission for the current music files.

## Required owner records

For each current non-font asset (or a clearly mapped batch), record:

1. The inventory path and hash, creator, source URL, and creation/download date.
2. The license or ownership basis covering redistribution in a downloadable game
   and on Steam, with required attribution. Keep private purchase receipts in an
   owner-controlled location and link a non-sensitive evidence reference here.
3. For generated media, provider/model, generation date, applicable account/terms,
   and whether third-party recordings, images, or likenesses were supplied.

Do not substitute old filenames, an AI-generation claim, or this inventory for
the actual records. The repository's broad ownership statement does not resolve
third-party terms. Owners must also decide the intended code license; none is
added by this change.

## Verification

After updating media, regenerate its inventory hashes and review the associated
records. Before distribution, verify that `out/fonts/OFL.txt` and the packaged
app's `out/fonts/OFL.txt` contain the notice. Installer creation and automated
tests do not close the remaining rights-evidence gate.

