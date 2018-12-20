# Open Offline File
Open an offline file when clicking on a container.

## Typical usage scenario
As there's no official support for viewing offline files in a hybrid app, this will allow you to open an offline synchronized file in an external app.
 
## Description
Just place the widget within a container inside a DataView with a FileDocument context.

Remarks
 - You need to pass the file MimeType for selecting the correct app
 - If the file cannot be opened on the device, the error NanoFlow is triggered

## Dependencies
You must add the file opener plugin to config.xml

    <plugin name="cordova-plugin-file-opener2" source="npm" version="2.1.0"/>