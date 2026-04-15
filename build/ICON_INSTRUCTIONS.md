# Icon Generation Instructions

## Required Icons

The Electron build requires platform-specific icons:

| Platform | File              | Dimensions    | Notes                          |
|----------|-------------------|---------------|--------------------------------|
| Windows  | `public/icon.ico`  | 256x256       | Multi-size ICO recommended     |
| macOS    | `public/icon.icns` | 512x512+      | Apple icon bundle format       |
| Linux    | `public/icon.png`  | 512x512       | Standard PNG                   |

## Generation Steps

### Option 1: electron-icon-maker (Recommended)

```bash
# Install
npm install -g electron-icon-maker

# Generate all icons from a 1024x1024 source
npx electron-icon-maker --input=icon-source.png --output=./public
```

### Option 2: ImageMagick

```bash
# PNG for Linux
convert icon-source.png -resize 512x512 public/icon.png

# ICO for Windows (multi-size)
convert icon-source.png -define icon:auto-resize=256,128,64,48,32,16 public/icon.ico

# ICNS for macOS (requires iconutil on Mac)
mkdir icon.iconset
convert icon-source.png -resize 16x16 icon.iconset/icon_16x16.png
convert icon-source.png -resize 32x32 icon.iconset/icon_16x16@2x.png
convert icon-source.png -resize 32x32 icon.iconset/icon_32x32.png
convert icon-source.png -resize 64x64 icon.iconset/icon_32x32@2x.png
convert icon-source.png -resize 128x128 icon.iconset/icon_128x128.png
convert icon-source.png -resize 256x256 icon.iconset/icon_128x128@2x.png
convert icon-source.png -resize 256x256 icon.iconset/icon_256x256.png
convert icon-source.png -resize 512x512 icon.iconset/icon_256x256@2x.png
convert icon-source.png -resize 512x512 icon.iconset/icon_512x512.png
convert icon-source.png -resize 1024x1024 icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset -o public/icon.icns
rm -r icon.iconset
```

### Option 3: Online Tools

- [CloudConvert](https://cloudconvert.com/png-to-ico)
- [ICO Convert](https://icoconvert.com/)
- [Icon Generator](https://www.iconifier.net/)

## Source Requirements

- Minimum 1024x1024 PNG
- Square aspect ratio
- Transparent background recommended
- High contrast for small sizes

## Current Status

The packaged build already uses checked-in icons from `public/`, and `electron-builder.yml` is the canonical packaging config. Regenerate the assets only if you are replacing the source artwork.
