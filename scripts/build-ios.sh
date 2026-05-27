#!/bin/bash

# Exit script if any command fails
set -e

# Navigate to the iOS directory
cd ios

# Install CocoaPods dependencies
pod install --repo-update

# Clean previous build
rm -rf ./build

# Archive the project
xcodebuild -workspace PortalApp.xcworkspace \
  -scheme PortalApp \
  -sdk iphoneos \
  -configuration Release \
  -archivePath ./build/PortalApp.xcarchive \
  archive

# Create exportOptions.plist (if needed)
cat <<EOF > ./exportOptions.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>  # Replace with your actual Apple Team ID
    <key>compileBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

# Export the IPA file
xcodebuild -exportArchive \
  -archivePath ./build/PortalApp.xcarchive \
  -exportOptionsPlist ./exportOptions.plist \
  -exportPath ./build/ipa

# Navigate back to the root directory
cd ..

echo "✅ IPA build completed! Find it here: ios/build/ipa/YourProject.ipa"
