/*global logger*/
/*
    ClickableContainer
    ========================

    @file      : ClickableContainer.js
    @version   : 1.0
    @author    : Eric Tieniber
    @date      : Thu, 07 Jan 2016 22:19:25 GMT
    @copyright :
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/dom-class",
    "dojo/_base/lang",
    "dojo/_base/event"
], function (declare, _WidgetBase, dojoClass, dojoLang, dojoEvent) {
    "use strict";

    // Declare widget's prototype.
    return declare("OpenOfflineFile.widget.OpenOfflineFile", [_WidgetBase], {

        // Parameters configured in the Modeler.
        mimeTypeAttribute: "mf",
        onErrorNanoflow: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,
        _alertDiv: null,

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;

            callback();
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            logger.debug(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },

        // Attach events to HTML dom elements
        _setupEvents: function () {
            logger.debug(this.id + "._setupEventsContext");

            dojoClass.add(this.domNode.parentNode, "OpenOfflineFile");

            this.connect(this.domNode.parentNode, "click", dojoLang.hitch(this, function (e) {
                // Only on mobile stop event bubbling!
                this._stopBubblingEventOnMobile(e);

                if (this._contextObj) {
                    var fileUrl = cordova.file.externalDataDirectory + "files/documents/" + this._contextObj.getGuid();
                    var mimeType = this._contextObj.get(this.mimeTypeAttribute);

                    // Example mime types
                    // docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    // pdf = 'application/pdf'

                    logger.debug(this.id + ".openFile: " + fileUrl);
                    //cordova.InAppBrowser.open(fileUrl, '_system', 'location=yes');
                    //cordova.InAppBrowser.open(fileUrl, '_blank', 'location=yes');
                    cordova.plugins.fileOpener2.open(fileUrl, mimeType, {
                        error: dojoLang.hitch(this, function (e) {
                            if (this.onErrorNanoflow.nanoflow && this.mxcontext) {
                                mx.data.callNanoflow({
                                    nanoflow: this.onErrorNanoflow,
                                    origin: this.mxform,
                                    context: this.mxcontext,
                                    callback: function (result) {},
                                    error: function (error) {
                                        logger.warn(this.id + '.' + error.message);
                                    }
                                });
                            } else {
                                logger.warn(this.id + '.Error status: ' + e.status + ' - Error message: ' + e.message);
                            }
                        }),
                        success: function () {
                            logger.debug(this.id + '.file opened successfully');
                        }
                    });
                }
                // If a microflow has been set execute the microflow on a click.
            }));
        },
    });
});

require(["OpenOfflineFile/widget/OpenOfflineFile"], function () {
    "use strict";
});