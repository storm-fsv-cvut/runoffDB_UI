(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["app"],{

/***/ "./assets/bower_components/Flot/jquery.flot.categories.js":
/*!****************************************************************!*\
  !*** ./assets/bower_components/Flot/jquery.flot.categories.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Flot plugin for plotting textual data or categories.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

Consider a dataset like [["February", 34], ["March", 20], ...]. This plugin
allows you to plot such a dataset directly.

To enable it, you must specify mode: "categories" on the axis with the textual
labels, e.g.

	$.plot("#placeholder", data, { xaxis: { mode: "categories" } });

By default, the labels are ordered as they are met in the data series. If you
need a different ordering, you can specify "categories" on the axis options
and list the categories there:

	xaxis: {
		mode: "categories",
		categories: ["February", "March", "April"]
	}

If you need to customize the distances between the categories, you can specify
"categories" as an object mapping labels to values

	xaxis: {
		mode: "categories",
		categories: { "February": 1, "March": 3, "April": 4 }
	}

If you don't specify all categories, the remaining categories will be numbered
from the max value plus 1 (with a spacing of 1 between each).

Internally, the plugin works by transforming the input data through an auto-
generated mapping where the first category becomes 0, the second 1, etc.
Hence, a point like ["February", 34] becomes [0, 34] internally in Flot (this
is visible in hover and click events that return numbers rather than the
category labels). The plugin also overrides the tick generator to spit out the
categories as ticks instead of the values.

If you need to map a value back to its label, the mapping is always accessible
as "categories" on the axis object, e.g. plot.getAxes().xaxis.categories.

*/

(function ($) {
    var options = {
        xaxis: {
            categories: null
        },
        yaxis: {
            categories: null
        }
    };
    
    function processRawData(plot, series, data, datapoints) {
        // if categories are enabled, we need to disable
        // auto-transformation to numbers so the strings are intact
        // for later processing

        var xCategories = series.xaxis.options.mode == "categories",
            yCategories = series.yaxis.options.mode == "categories";
        
        if (!(xCategories || yCategories))
            return;

        var format = datapoints.format;

        if (!format) {
            // FIXME: auto-detection should really not be defined here
            var s = series;
            format = [];
            format.push({ x: true, number: true, required: true });
            format.push({ y: true, number: true, required: true });

            if (s.bars.show || (s.lines.show && s.lines.fill)) {
                var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                if (s.bars.horizontal) {
                    delete format[format.length - 1].y;
                    format[format.length - 1].x = true;
                }
            }
            
            datapoints.format = format;
        }

        for (var m = 0; m < format.length; ++m) {
            if (format[m].x && xCategories)
                format[m].number = false;
            
            if (format[m].y && yCategories)
                format[m].number = false;
        }
    }

    function getNextIndex(categories) {
        var index = -1;
        
        for (var v in categories)
            if (categories[v] > index)
                index = categories[v];

        return index + 1;
    }

    function categoriesTickGenerator(axis) {
        var res = [];
        for (var label in axis.categories) {
            var v = axis.categories[label];
            if (v >= axis.min && v <= axis.max)
                res.push([v, label]);
        }

        res.sort(function (a, b) { return a[0] - b[0]; });

        return res;
    }
    
    function setupCategoriesForAxis(series, axis, datapoints) {
        if (series[axis].options.mode != "categories")
            return;
        
        if (!series[axis].categories) {
            // parse options
            var c = {}, o = series[axis].options.categories || {};
            if ($.isArray(o)) {
                for (var i = 0; i < o.length; ++i)
                    c[o[i]] = i;
            }
            else {
                for (var v in o)
                    c[v] = o[v];
            }
            
            series[axis].categories = c;
        }

        // fix ticks
        if (!series[axis].options.ticks)
            series[axis].options.ticks = categoriesTickGenerator;

        transformPointsOnAxis(datapoints, axis, series[axis].categories);
    }
    
    function transformPointsOnAxis(datapoints, axis, categories) {
        // go through the points, transforming them
        var points = datapoints.points,
            ps = datapoints.pointsize,
            format = datapoints.format,
            formatColumn = axis.charAt(0),
            index = getNextIndex(categories);

        for (var i = 0; i < points.length; i += ps) {
            if (points[i] == null)
                continue;
            
            for (var m = 0; m < ps; ++m) {
                var val = points[i + m];

                if (val == null || !format[m][formatColumn])
                    continue;

                if (!(val in categories)) {
                    categories[val] = index;
                    ++index;
                }
                
                points[i + m] = categories[val];
            }
        }
    }

    function processDatapoints(plot, series, datapoints) {
        setupCategoriesForAxis(series, "xaxis", datapoints);
        setupCategoriesForAxis(series, "yaxis", datapoints);
    }

    function init(plot) {
        plot.hooks.processRawData.push(processRawData);
        plot.hooks.processDatapoints.push(processDatapoints);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'categories',
        version: '1.0'
    });
})(jQuery);


/***/ }),

/***/ "./assets/bower_components/Flot/jquery.flot.js":
/*!*****************************************************!*\
  !*** ./assets/bower_components/Flot/jquery.flot.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Javascript plotting library for jQuery, version 0.8.3.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

*/

// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience

/* Plugin for jQuery for working with colors.
 *
 * Version 1.1.
 *
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() return the same modified object
 * instead of making a new one.
 *
 * V. 1.1: Fix error handling so e.g. parsing an empty string does
 * produce a color rather than just crashing.
 */
(function($){$.color={};$.color.make=function(r,g,b,a){var o={};o.r=r||0;o.g=g||0;o.b=b||0;o.a=a!=null?a:1;o.add=function(c,d){for(var i=0;i<c.length;++i)o[c.charAt(i)]+=d;return o.normalize()};o.scale=function(c,f){for(var i=0;i<c.length;++i)o[c.charAt(i)]*=f;return o.normalize()};o.toString=function(){if(o.a>=1){return"rgb("+[o.r,o.g,o.b].join(",")+")"}else{return"rgba("+[o.r,o.g,o.b,o.a].join(",")+")"}};o.normalize=function(){function clamp(min,value,max){return value<min?min:value>max?max:value}o.r=clamp(0,parseInt(o.r),255);o.g=clamp(0,parseInt(o.g),255);o.b=clamp(0,parseInt(o.b),255);o.a=clamp(0,o.a,1);return o};o.clone=function(){return $.color.make(o.r,o.b,o.g,o.a)};return o.normalize()};$.color.extract=function(elem,css){var c;do{c=elem.css(css).toLowerCase();if(c!=""&&c!="transparent")break;elem=elem.parent()}while(elem.length&&!$.nodeName(elem.get(0),"body"));if(c=="rgba(0, 0, 0, 0)")c="transparent";return $.color.parse(c)};$.color.parse=function(str){var res,m=$.color.make;if(res=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10));if(res=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseInt(res[1],10),parseInt(res[2],10),parseInt(res[3],10),parseFloat(res[4]));if(res=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55);if(res=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))return m(parseFloat(res[1])*2.55,parseFloat(res[2])*2.55,parseFloat(res[3])*2.55,parseFloat(res[4]));if(res=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))return m(parseInt(res[1],16),parseInt(res[2],16),parseInt(res[3],16));if(res=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))return m(parseInt(res[1]+res[1],16),parseInt(res[2]+res[2],16),parseInt(res[3]+res[3],16));var name=$.trim(str).toLowerCase();if(name=="transparent")return m(255,255,255,0);else{res=lookupColors[name]||[0,0,0];return m(res[0],res[1],res[2])}};var lookupColors={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);

// the actual Flot code
(function($) {

	// Cache the prototype hasOwnProperty for faster access

	var hasOwnProperty = Object.prototype.hasOwnProperty;

    // A shim to provide 'detach' to jQuery versions prior to 1.4.  Using a DOM
    // operation produces the same effect as detach, i.e. removing the element
    // without touching its jQuery data.

    // Do not merge this into Flot 0.9, since it requires jQuery 1.4.4+.

    if (!$.fn.detach) {
        $.fn.detach = function() {
            return this.each(function() {
                if (this.parentNode) {
                    this.parentNode.removeChild( this );
                }
            });
        };
    }

	///////////////////////////////////////////////////////////////////////////
	// The Canvas object is a wrapper around an HTML5 <canvas> tag.
	//
	// @constructor
	// @param {string} cls List of classes to apply to the canvas.
	// @param {element} container Element onto which to append the canvas.
	//
	// Requiring a container is a little iffy, but unfortunately canvas
	// operations don't work unless the canvas is attached to the DOM.

	function Canvas(cls, container) {

		var element = container.children("." + cls)[0];

		if (element == null) {

			element = document.createElement("canvas");
			element.className = cls;

			$(element).css({ direction: "ltr", position: "absolute", left: 0, top: 0 })
				.appendTo(container);

			// If HTML5 Canvas isn't available, fall back to [Ex|Flash]canvas

			if (!element.getContext) {
				if (window.G_vmlCanvasManager) {
					element = window.G_vmlCanvasManager.initElement(element);
				} else {
					throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");
				}
			}
		}

		this.element = element;

		var context = this.context = element.getContext("2d");

		// Determine the screen's ratio of physical to device-independent
		// pixels.  This is the ratio between the canvas width that the browser
		// advertises and the number of pixels actually present in that space.

		// The iPhone 4, for example, has a device-independent width of 320px,
		// but its screen is actually 640px wide.  It therefore has a pixel
		// ratio of 2, while most normal devices have a ratio of 1.

		var devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio =
				context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1;

		this.pixelRatio = devicePixelRatio / backingStoreRatio;

		// Size the canvas to match the internal dimensions of its container

		this.resize(container.width(), container.height());

		// Collection of HTML div layers for text overlaid onto the canvas

		this.textContainer = null;
		this.text = {};

		// Cache of text fragments and metrics, so we can avoid expensively
		// re-calculating them when the plot is re-rendered in a loop.

		this._textCache = {};
	}

	// Resizes the canvas to the given dimensions.
	//
	// @param {number} width New width of the canvas, in pixels.
	// @param {number} width New height of the canvas, in pixels.

	Canvas.prototype.resize = function(width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error("Invalid dimensions for plot, width = " + width + ", height = " + height);
		}

		var element = this.element,
			context = this.context,
			pixelRatio = this.pixelRatio;

		// Resize the canvas, increasing its density based on the display's
		// pixel ratio; basically giving it more pixels without increasing the
		// size of its element, to take advantage of the fact that retina
		// displays have that many more pixels in the same advertised space.

		// Resizing should reset the state (excanvas seems to be buggy though)

		if (this.width != width) {
			element.width = width * pixelRatio;
			element.style.width = width + "px";
			this.width = width;
		}

		if (this.height != height) {
			element.height = height * pixelRatio;
			element.style.height = height + "px";
			this.height = height;
		}

		// Save the context, so we can reset in case we get replotted.  The
		// restore ensure that we're really back at the initial state, and
		// should be safe even if we haven't saved the initial state yet.

		context.restore();
		context.save();

		// Scale the coordinate space to match the display density; so even though we
		// may have twice as many pixels, we still want lines and other drawing to
		// appear at the same size; the extra pixels will just make them crisper.

		context.scale(pixelRatio, pixelRatio);
	};

	// Clears the entire canvas area, not including any overlaid HTML text

	Canvas.prototype.clear = function() {
		this.context.clearRect(0, 0, this.width, this.height);
	};

	// Finishes rendering the canvas, including managing the text overlay.

	Canvas.prototype.render = function() {

		var cache = this._textCache;

		// For each text layer, add elements marked as active that haven't
		// already been rendered, and remove those that are no longer active.

		for (var layerKey in cache) {
			if (hasOwnProperty.call(cache, layerKey)) {

				var layer = this.getTextLayer(layerKey),
					layerCache = cache[layerKey];

				layer.hide();

				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {

								var positions = styleCache[key].positions;

								for (var i = 0, position; position = positions[i]; i++) {
									if (position.active) {
										if (!position.rendered) {
											layer.append(position.element);
											position.rendered = true;
										}
									} else {
										positions.splice(i--, 1);
										if (position.rendered) {
											position.element.detach();
										}
									}
								}

								if (positions.length == 0) {
									delete styleCache[key];
								}
							}
						}
					}
				}

				layer.show();
			}
		}
	};

	// Creates (if necessary) and returns the text overlay container.
	//
	// @param {string} classes String of space-separated CSS classes used to
	//     uniquely identify the text layer.
	// @return {object} The jQuery-wrapped text-layer div.

	Canvas.prototype.getTextLayer = function(classes) {

		var layer = this.text[classes];

		// Create the text layer if it doesn't exist

		if (layer == null) {

			// Create the text layer container, if it doesn't exist

			if (this.textContainer == null) {
				this.textContainer = $("<div class='flot-text'></div>")
					.css({
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						'font-size': "smaller",
						color: "#545454"
					})
					.insertAfter(this.element);
			}

			layer = this.text[classes] = $("<div></div>")
				.addClass(classes)
				.css({
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0
				})
				.appendTo(this.textContainer);
		}

		return layer;
	};

	// Creates (if necessary) and returns a text info object.
	//
	// The object looks like this:
	//
	// {
	//     width: Width of the text's wrapper div.
	//     height: Height of the text's wrapper div.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     positions: Array of positions at which this text is drawn.
	// }
	//
	// The positions array contains objects that look like this:
	//
	// {
	//     active: Flag indicating whether the text should be visible.
	//     rendered: Flag indicating whether the text is currently visible.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     x: X coordinate at which to draw the text.
	//     y: Y coordinate at which to draw the text.
	// }
	//
	// Each position after the first receives a clone of the original element.
	//
	// The idea is that that the width, height, and general 'identity' of the
	// text is constant no matter where it is placed; the placements are a
	// secondary property.
	//
	// Canvas maintains a cache of recently-used text info objects; getTextInfo
	// either returns the cached element or creates a new entry.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {string} text Text string to retrieve info for.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @return {object} a text info object.

	Canvas.prototype.getTextInfo = function(layer, text, font, angle, width) {

		var textStyle, layerCache, styleCache, info;

		// Cast the value to a string, in case we were given a number or such

		text = "" + text;

		// If the font is a font-spec object, generate a CSS font definition

		if (typeof font === "object") {
			textStyle = font.style + " " + font.variant + " " + font.weight + " " + font.size + "px/" + font.lineHeight + "px " + font.family;
		} else {
			textStyle = font;
		}

		// Retrieve (or create) the cache for the text's layer and styles

		layerCache = this._textCache[layer];

		if (layerCache == null) {
			layerCache = this._textCache[layer] = {};
		}

		styleCache = layerCache[textStyle];

		if (styleCache == null) {
			styleCache = layerCache[textStyle] = {};
		}

		info = styleCache[text];

		// If we can't find a matching element in our cache, create a new one

		if (info == null) {

			var element = $("<div></div>").html(text)
				.css({
					position: "absolute",
					'max-width': width,
					top: -9999
				})
				.appendTo(this.getTextLayer(layer));

			if (typeof font === "object") {
				element.css({
					font: textStyle,
					color: font.color
				});
			} else if (typeof font === "string") {
				element.addClass(font);
			}

			info = styleCache[text] = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				element: element,
				positions: []
			};

			element.detach();
		}

		return info;
	};

	// Adds a text string to the canvas text overlay.
	//
	// The text isn't drawn immediately; it is marked as rendering, which will
	// result in its addition to the canvas on the next render pass.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number} x X coordinate at which to draw the text.
	// @param {number} y Y coordinate at which to draw the text.
	// @param {string} text Text string to draw.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @param {string=} halign Horizontal alignment of the text; either "left",
	//     "center" or "right".
	// @param {string=} valign Vertical alignment of the text; either "top",
	//     "middle" or "bottom".

	Canvas.prototype.addText = function(layer, x, y, text, font, angle, width, halign, valign) {

		var info = this.getTextInfo(layer, text, font, angle, width),
			positions = info.positions;

		// Tweak the div's position to match the text's alignment

		if (halign == "center") {
			x -= info.width / 2;
		} else if (halign == "right") {
			x -= info.width;
		}

		if (valign == "middle") {
			y -= info.height / 2;
		} else if (valign == "bottom") {
			y -= info.height;
		}

		// Determine whether this text already exists at this position.
		// If so, mark it for inclusion in the next render pass.

		for (var i = 0, position; position = positions[i]; i++) {
			if (position.x == x && position.y == y) {
				position.active = true;
				return;
			}
		}

		// If the text doesn't exist at this position, create a new entry

		// For the very first position we'll re-use the original element,
		// while for subsequent ones we'll clone it.

		position = {
			active: true,
			rendered: false,
			element: positions.length ? info.element.clone() : info.element,
			x: x,
			y: y
		};

		positions.push(position);

		// Move the element to its final position within the container

		position.element.css({
			top: Math.round(y),
			left: Math.round(x),
			'text-align': halign	// In case the text wraps
		});
	};

	// Removes one or more text strings from the canvas text overlay.
	//
	// If no parameters are given, all text within the layer is removed.
	//
	// Note that the text is not immediately removed; it is simply marked as
	// inactive, which will result in its removal on the next render pass.
	// This avoids the performance penalty for 'clear and redraw' behavior,
	// where we potentially get rid of all text on a layer, but will likely
	// add back most or all of it later, as when redrawing axes, for example.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number=} x X coordinate of the text.
	// @param {number=} y Y coordinate of the text.
	// @param {string=} text Text string to remove.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which the text is rotated, in degrees.
	//     Angle is currently unused, it will be implemented in the future.

	Canvas.prototype.removeText = function(layer, x, y, text, font, angle) {
		if (text == null) {
			var layerCache = this._textCache[layer];
			if (layerCache != null) {
				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {
								var positions = styleCache[key].positions;
								for (var i = 0, position; position = positions[i]; i++) {
									position.active = false;
								}
							}
						}
					}
				}
			}
		} else {
			var positions = this.getTextInfo(layer, text, font, angle).positions;
			for (var i = 0, position; position = positions[i]; i++) {
				if (position.x == x && position.y == y) {
					position.active = false;
				}
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////
	// The top-level container for the entire plot.

    function Plot(placeholder, data_, options_, plugins) {
        // data is on the form:
        //   [ series1, series2 ... ]
        // where series is either just the data as [ [x1, y1], [x2, y2], ... ]
        // or { data: [ [x1, y1], [x2, y2], ... ], label: "some label", ... }

        var series = [],
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1, // number of colums in legend table
                    labelFormatter: null, // fn: string -> string
                    labelBoxBorderColor: "#ccc", // border color for the little label boxes
                    container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                    position: "ne", // position of default legend container within plot
                    margin: 5, // distance from grid edge to default legend container within plot
                    backgroundColor: null, // null means auto-detect
                    backgroundOpacity: 0.85, // set to 0 to avoid background
                    sorted: null    // default to no legend sorting
                },
                xaxis: {
                    show: null, // null = auto-detect, true = always, false = never
                    position: "bottom", // or "top"
                    mode: null, // null or "time"
                    font: null, // null (derived from CSS in placeholder) or object like { size: 11, lineHeight: 13, style: "italic", weight: "bold", family: "sans-serif", variant: "small-caps" }
                    color: null, // base color, labels, ticks
                    tickColor: null, // possibly different color of ticks, e.g. "rgba(0,0,0,0.15)"
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoscaleMargin: null, // margin in % to add if auto-setting min/max
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    labelWidth: null, // size of tick labels in pixels
                    labelHeight: null,
                    reserveSpace: null, // whether to reserve space even if axis isn't shown
                    tickLength: null, // size in pixels of ticks, or "full" for whole line
                    alignTicksWithAxis: null, // axis number or null for no sync
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null // number or [number, "unit"]
                },
                yaxis: {
                    autoscaleMargin: 0.02,
                    position: "left" // or "right"
                },
                xaxes: [],
                yaxes: [],
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle" // or callback
                    },
                    lines: {
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled
                        lineWidth: 2, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                        // Omit 'zero', so we can later default its value to
                        // match that of the 'fill' option.
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        barWidth: 1, // in units of the x axis
                        fill: true,
                        fillColor: null,
                        align: "left", // "left", "right", or "center"
                        horizontal: false,
                        zero: true
                    },
                    shadowSize: 3,
                    highlightColor: null
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454", // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    borderColor: null, // set if different from the grid color
                    tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
                    margin: 0, // distance from the canvas edge to the grid
                    labelMargin: 5, // in pixels
                    axisMargin: 8, // in pixels
                    borderWidth: 2, // in pixels
                    minBorderMargin: null, // in pixels, null means taken from points radius
                    markings: null, // array of ranges or fn: axes -> array of ranges
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    // interactive stuff
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true, // highlight in case mouse is near
                    mouseActiveRadius: 10 // how far the mouse can be away to activate an item
                },
                interaction: {
                    redrawOverlayInterval: 1000/60 // time between updates, -1 means in same flow
                },
                hooks: {}
            },
        surface = null,     // the canvas for the plot itself
        overlay = null,     // canvas for interactive stuff on top of plot
        eventHolder = null, // jQuery object that events should be bound to
        ctx = null, octx = null,
        xaxes = [], yaxes = [],
        plotOffset = { left: 0, right: 0, top: 0, bottom: 0},
        plotWidth = 0, plotHeight = 0,
        hooks = {
            processOptions: [],
            processRawData: [],
            processDatapoints: [],
            processOffset: [],
            drawBackground: [],
            drawSeries: [],
            draw: [],
            bindEvents: [],
            drawOverlay: [],
            shutdown: []
        },
        plot = this;

        // public functions
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() { return placeholder; };
        plot.getCanvas = function() { return surface.element; };
        plot.getPlotOffset = function() { return plotOffset; };
        plot.width = function () { return plotWidth; };
        plot.height = function () { return plotHeight; };
        plot.offset = function () {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function () { return series; };
        plot.getAxes = function () {
            var res = {}, i;
            $.each(xaxes.concat(yaxes), function (_, axis) {
                if (axis)
                    res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis;
            });
            return res;
        };
        plot.getXAxes = function () { return xaxes; };
        plot.getYAxes = function () { return yaxes; };
        plot.c2p = canvasToAxisCoords;
        plot.p2c = axisToCanvasCoords;
        plot.getOptions = function () { return options; };
        plot.highlight = highlight;
        plot.unhighlight = unhighlight;
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return {
                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left, 10),
                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top, 10)
            };
        };
        plot.shutdown = shutdown;
        plot.destroy = function () {
            shutdown();
            placeholder.removeData("plot").empty();

            series = [];
            options = null;
            surface = null;
            overlay = null;
            eventHolder = null;
            ctx = null;
            octx = null;
            xaxes = [];
            yaxes = [];
            hooks = null;
            highlights = [];
            plot = null;
        };
        plot.resize = function () {
        	var width = placeholder.width(),
        		height = placeholder.height();
            surface.resize(width, height);
            overlay.resize(width, height);
        };

        // public attributes
        plot.hooks = hooks;

        // initialize
        initPlugins(plot);
        parseOptions(options_);
        setupCanvases();
        setData(data_);
        setupGrid();
        draw();
        bindEvents();


        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i)
                hook[i].apply(this, args);
        }

        function initPlugins() {

            // References to key classes, allowing plugins to modify them

            var classes = {
                Canvas: Canvas
            };

            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot, classes);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }

        function parseOptions(opts) {

            $.extend(true, options, opts);

            // $.extend merges arrays, rather than replacing them.  When less
            // colors are provided than the size of the default palette, we
            // end up with those colors plus the remaining defaults, which is
            // not expected behavior; avoid it by replacing them here.

            if (opts && opts.colors) {
            	options.colors = opts.colors;
            }

            if (options.xaxis.color == null)
                options.xaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            if (options.yaxis.color == null)
                options.yaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            if (options.xaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.xaxis.tickColor = options.grid.tickColor || options.xaxis.color;
            if (options.yaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.yaxis.tickColor = options.grid.tickColor || options.yaxis.color;

            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            if (options.grid.tickColor == null)
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            // Fill in defaults for axis options, including any unspecified
            // font-spec fields, if a font-spec was provided.

            // If no x/y axis options were provided, create one of each anyway,
            // since the rest of the code assumes that they exist.

            var i, axisOptions, axisCount,
                fontSize = placeholder.css("font-size"),
                fontSizeDefault = fontSize ? +fontSize.replace("px", "") : 13,
                fontDefaults = {
                    style: placeholder.css("font-style"),
                    size: Math.round(0.8 * fontSizeDefault),
                    variant: placeholder.css("font-variant"),
                    weight: placeholder.css("font-weight"),
                    family: placeholder.css("font-family")
                };

            axisCount = options.xaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.xaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.xaxis, axisOptions);
                options.xaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            axisCount = options.yaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.yaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.yaxis, axisOptions);
                options.yaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                    if (!axisOptions.font.lineHeight) {
                        axisOptions.font.lineHeight = Math.round(axisOptions.font.size * 1.15);
                    }
                }
            }

            // backwards compatibility, to be removed in future
            if (options.xaxis.noTicks && options.xaxis.ticks == null)
                options.xaxis.ticks = options.xaxis.noTicks;
            if (options.yaxis.noTicks && options.yaxis.ticks == null)
                options.yaxis.ticks = options.yaxis.noTicks;
            if (options.x2axis) {
                options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis);
                options.xaxes[1].position = "top";
                // Override the inherit to allow the axis to auto-scale
                if (options.x2axis.min == null) {
                    options.xaxes[1].min = null;
                }
                if (options.x2axis.max == null) {
                    options.xaxes[1].max = null;
                }
            }
            if (options.y2axis) {
                options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis);
                options.yaxes[1].position = "right";
                // Override the inherit to allow the axis to auto-scale
                if (options.y2axis.min == null) {
                    options.yaxes[1].min = null;
                }
                if (options.y2axis.max == null) {
                    options.yaxes[1].max = null;
                }
            }
            if (options.grid.coloredAreas)
                options.grid.markings = options.grid.coloredAreas;
            if (options.grid.coloredAreasColor)
                options.grid.markingsColor = options.grid.coloredAreasColor;
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize != null)
                options.series.shadowSize = options.shadowSize;
            if (options.highlightColor != null)
                options.series.highlightColor = options.highlightColor;

            // save options on axes for future reference
            for (i = 0; i < options.xaxes.length; ++i)
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            for (i = 0; i < options.yaxes.length; ++i)
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];

            // add hooks from options
            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);

            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            series = parseData(d);
            fillInSeriesOptions();
            processData();
        }

        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data != null) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                }
                else
                    s.data = d[i];
                res.push(s);
            }

            return res;
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a == "object") // if we got a real axis, extract number
                a = a.n;
            if (typeof a != "number")
                a = 1; // default to first axis
            return a;
        }

        function allAxes() {
            // return flat array without annoying null entries
            return $.grep(xaxes.concat(yaxes), function (a) { return a; });
        }

        function canvasToAxisCoords(pos) {
            // return an object with x/y corresponding to all used axes
            var res = {}, i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used)
                    res["x" + axis.n] = axis.c2p(pos.left);
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used)
                    res["y" + axis.n] = axis.c2p(pos.top);
            }

            if (res.x1 !== undefined)
                res.x = res.x1;
            if (res.y1 !== undefined)
                res.y = res.y1;

            return res;
        }

        function axisToCanvasCoords(pos) {
            // get canvas coords from the first pair of x/y found in pos
            var res = {}, i, axis, key;

            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "x";

                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "y";

                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            return res;
        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1])
                axes[number - 1] = {
                    n: number, // save the number for future reference
                    direction: axes == xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis)
                };

            return axes[number - 1];
        }

        function fillInSeriesOptions() {

            var neededColors = series.length, maxIndex = -1, i;

            // Subtract the number of series that already have fixed colors or
            // color indexes from the number that we still need to generate.

            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    neededColors--;
                    if (typeof sc == "number" && sc > maxIndex) {
                        maxIndex = sc;
                    }
                }
            }

            // If any of the series have fixed color indexes, then we need to
            // generate at least as many colors as the highest index.

            if (neededColors <= maxIndex) {
                neededColors = maxIndex + 1;
            }

            // Generate all the colors, using first the option colors and then
            // variations on those colors once they're exhausted.

            var c, colors = [], colorPool = options.colors,
                colorPoolSize = colorPool.length, variation = 0;

            for (i = 0; i < neededColors; i++) {

                c = $.color.parse(colorPool[i % colorPoolSize] || "#666");

                // Each time we exhaust the colors in the pool we adjust
                // a scaling factor used to produce more variations on
                // those colors. The factor alternates negative/positive
                // to produce lighter/darker colors.

                // Reset the variation after every few cycles, or else
                // it will end up producing only white or black colors.

                if (i % colorPoolSize == 0 && i) {
                    if (variation >= 0) {
                        if (variation < 0.5) {
                            variation = -variation - 0.2;
                        } else variation = 0;
                    } else variation = -variation;
                }

                colors[i] = c.scale('rgb', 1 + variation);
            }

            // Finalize the series options, filling in their colors

            var colori = 0, s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                }
                else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s)
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }

                // If nothing was provided for lines.zero, default it to match
                // lines.fill, since areas by default should extend to zero.

                if (s.lines.zero == null) {
                    s.lines.zero = !!s.lines.fill;
                }

                // setup axes
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                fakeInfinity = Number.MAX_VALUE,
                i, j, k, m, length,
                s, points, ps, x, y, axis, val, f, p,
                data, format;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min != -fakeInfinity)
                    axis.datamin = min;
                if (max > axis.datamax && max != fakeInfinity)
                    axis.datamax = max;
            }

            $.each(allAxes(), function (_, axis) {
                // init axis
                axis.datamin = topSentry;
                axis.datamax = bottomSentry;
                axis.used = false;
            });

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = { points: [] };

                executeHooks(hooks.processRawData, [ s, s.data, s.datapoints ]);
            }

            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                data = s.data;
                format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({ x: true, number: true, required: true });
                    format.push({ y: true, number: true, required: true });

                    if (s.bars.show || (s.lines.show && s.lines.fill)) {
                        var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                        format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                        if (s.bars.horizontal) {
                            delete format[format.length - 1].y;
                            format[format.length - 1].x = true;
                        }
                    }

                    s.datapoints.format = format;
                }

                if (s.datapoints.pointsize != null)
                    continue; // already filled in

                s.datapoints.pointsize = format.length;

                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                var insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;

                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val))
                                        val = null;
                                    else if (val == Infinity)
                                        val = fakeInfinity;
                                    else if (val == -Infinity)
                                        val = -fakeInfinity;
                                }

                                if (val == null) {
                                    if (f.required)
                                        nullify = true;

                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }

                            points[k + m] = val;
                        }
                    }

                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.autoscale !== false) {
                                    if (f.x) {
                                        updateAxis(s.xaxis, val, val);
                                    }
                                    if (f.y) {
                                        updateAxis(s.yaxis, val, val);
                                    }
                                }
                            }
                            points[k + m] = null;
                        }
                    }
                    else {
                        // a little bit of line specific stuff that
                        // perhaps shouldn't be here, but lacking
                        // better means...
                        if (insertSteps && k > 0
                            && points[k - ps] != null
                            && points[k - ps] != points[k]
                            && points[k - ps + 1] != points[k + 1]) {
                            // copy the point to make room for a middle point
                            for (m = 0; m < ps; ++m)
                                points[k + ps + m] = points[k + m];

                            // middle point has same y
                            points[k + 1] = points[k - ps + 1];

                            // we've added a point, better reflect that
                            k += ps;
                        }
                    }
                }
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                executeHooks(hooks.processDatapoints, [ s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points;
                ps = s.datapoints.pointsize;
                format = s.datapoints.format;

                var xmin = topSentry, ymin = topSentry,
                    xmax = bottomSentry, ymax = bottomSentry;

                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f || f.autoscale === false || val == fakeInfinity || val == -fakeInfinity)
                            continue;

                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }

                if (s.bars.show) {
                    // make sure we got room for the bar on the dancing floor
                    var delta;

                    switch (s.bars.align) {
                        case "left":
                            delta = 0;
                            break;
                        case "right":
                            delta = -s.bars.barWidth;
                            break;
                        default:
                            delta = -s.bars.barWidth / 2;
                    }

                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    }
                    else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }

                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }

            $.each(allAxes(), function (_, axis) {
                if (axis.datamin == topSentry)
                    axis.datamin = null;
                if (axis.datamax == bottomSentry)
                    axis.datamax = null;
            });
        }

        function setupCanvases() {

            // Make sure the placeholder is clear of everything except canvases
            // from a previous plot in this container that we'll try to re-use.

            placeholder.css("padding", 0) // padding messes up the positioning
                .children().filter(function(){
                    return !$(this).hasClass("flot-overlay") && !$(this).hasClass('flot-base');
                }).remove();

            if (placeholder.css("position") == 'static')
                placeholder.css("position", "relative"); // for positioning labels and overlay

            surface = new Canvas("flot-base", placeholder);
            overlay = new Canvas("flot-overlay", placeholder); // overlay canvas for interactive features

            ctx = surface.context;
            octx = overlay.context;

            // define which element we're listening for events on
            eventHolder = $(overlay.element).unbind();

            // If we're re-using a plot object, shut down the old one

            var existing = placeholder.data("plot");

            if (existing) {
                existing.shutdown();
                overlay.clear();
            }

            // save in case we get replotted
            placeholder.data("plot", plot);
        }

        function bindEvents() {
            // bind events
            if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);

                // Use bind, rather than .mouseleave, because we officially
                // still support jQuery 1.2.6, which doesn't define a shortcut
                // for mouseenter or mouseleave.  This was a bug/oversight that
                // was fixed somewhere around 1.3.x.  We can return to using
                // .mouseleave when we drop support for 1.2.6.

                eventHolder.bind("mouseleave", onMouseLeave);
            }

            if (options.grid.clickable)
                eventHolder.click(onClick);

            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function shutdown() {
            if (redrawTimeout)
                clearTimeout(redrawTimeout);

            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);

            executeHooks(hooks.shutdown, [eventHolder]);
        }

        function setTransformationHelpers(axis) {
            // set helper functions on the axis, assumes plot area
            // has been computed already

            function identity(x) { return x; }

            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;

            // precompute how much the axis is scaling a point
            // in canvas space
            if (axis.direction == "x") {
                s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                m = Math.min(t(axis.max), t(axis.min));
            }
            else {
                s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }

            // data point to canvas coordinate
            if (t == identity) // slight optimization
                axis.p2c = function (p) { return (p - m) * s; };
            else
                axis.p2c = function (p) { return (t(p) - m) * s; };
            // canvas coordinate to data point
            if (!it)
                axis.c2p = function (c) { return m + c / s; };
            else
                axis.c2p = function (c) { return it(m + c / s); };
        }

        function measureTickLabels(axis) {

            var opts = axis.options,
                ticks = axis.ticks || [],
                labelWidth = opts.labelWidth || 0,
                labelHeight = opts.labelHeight || 0,
                maxWidth = labelWidth || (axis.direction == "x" ? Math.floor(surface.width / (ticks.length || 1)) : null),
                legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                font = opts.font || "flot-tick-label tickLabel";

            for (var i = 0; i < ticks.length; ++i) {

                var t = ticks[i];

                if (!t.label)
                    continue;

                var info = surface.getTextInfo(layer, t.label, font, null, maxWidth);

                labelWidth = Math.max(labelWidth, info.width);
                labelHeight = Math.max(labelHeight, info.height);
            }

            axis.labelWidth = opts.labelWidth || labelWidth;
            axis.labelHeight = opts.labelHeight || labelHeight;
        }

        function allocateAxisBoxFirstPhase(axis) {
            // find the bounding box of the axis by looking at label
            // widths/heights and ticks, make room by diminishing the
            // plotOffset; this first phase only looks at one
            // dimension per axis, the other dimension depends on the
            // other axes so will have to wait

            var lw = axis.labelWidth,
                lh = axis.labelHeight,
                pos = axis.options.position,
                isXAxis = axis.direction === "x",
                tickLength = axis.options.tickLength,
                axisMargin = options.grid.axisMargin,
                padding = options.grid.labelMargin,
                innermost = true,
                outermost = true,
                first = true,
                found = false;

            // Determine the axis's position in its direction and on its side

            $.each(isXAxis ? xaxes : yaxes, function(i, a) {
                if (a && (a.show || a.reserveSpace)) {
                    if (a === axis) {
                        found = true;
                    } else if (a.options.position === pos) {
                        if (found) {
                            outermost = false;
                        } else {
                            innermost = false;
                        }
                    }
                    if (!found) {
                        first = false;
                    }
                }
            });

            // The outermost axis on each side has no margin

            if (outermost) {
                axisMargin = 0;
            }

            // The ticks for the first axis in each direction stretch across

            if (tickLength == null) {
                tickLength = first ? "full" : 5;
            }

            if (!isNaN(+tickLength))
                padding += +tickLength;

            if (isXAxis) {
                lh += padding;

                if (pos == "bottom") {
                    plotOffset.bottom += lh + axisMargin;
                    axis.box = { top: surface.height - plotOffset.bottom, height: lh };
                }
                else {
                    axis.box = { top: plotOffset.top + axisMargin, height: lh };
                    plotOffset.top += lh + axisMargin;
                }
            }
            else {
                lw += padding;

                if (pos == "left") {
                    axis.box = { left: plotOffset.left + axisMargin, width: lw };
                    plotOffset.left += lw + axisMargin;
                }
                else {
                    plotOffset.right += lw + axisMargin;
                    axis.box = { left: surface.width - plotOffset.right, width: lw };
                }
            }

             // save for future reference
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.box.padding = padding;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
            // now that all axis boxes have been placed in one
            // dimension, we can set the remaining dimension coordinates
            if (axis.direction == "x") {
                axis.box.left = plotOffset.left - axis.labelWidth / 2;
                axis.box.width = surface.width - plotOffset.left - plotOffset.right + axis.labelWidth;
            }
            else {
                axis.box.top = plotOffset.top - axis.labelHeight / 2;
                axis.box.height = surface.height - plotOffset.bottom - plotOffset.top + axis.labelHeight;
            }
        }

        function adjustLayoutForThingsStickingOut() {
            // possibly adjust plot offset to ensure everything stays
            // inside the canvas and isn't clipped off

            var minMargin = options.grid.minBorderMargin,
                axis, i;

            // check stuff from the plot (FIXME: this should just read
            // a value from the series, otherwise it's impossible to
            // customize)
            if (minMargin == null) {
                minMargin = 0;
                for (i = 0; i < series.length; ++i)
                    minMargin = Math.max(minMargin, 2 * (series[i].points.radius + series[i].points.lineWidth/2));
            }

            var margins = {
                left: minMargin,
                right: minMargin,
                top: minMargin,
                bottom: minMargin
            };

            // check axis labels, note we don't check the actual
            // labels but instead use the overall width/height to not
            // jump as much around with replots
            $.each(allAxes(), function (_, axis) {
                if (axis.reserveSpace && axis.ticks && axis.ticks.length) {
                    if (axis.direction === "x") {
                        margins.left = Math.max(margins.left, axis.labelWidth / 2);
                        margins.right = Math.max(margins.right, axis.labelWidth / 2);
                    } else {
                        margins.bottom = Math.max(margins.bottom, axis.labelHeight / 2);
                        margins.top = Math.max(margins.top, axis.labelHeight / 2);
                    }
                }
            });

            plotOffset.left = Math.ceil(Math.max(margins.left, plotOffset.left));
            plotOffset.right = Math.ceil(Math.max(margins.right, plotOffset.right));
            plotOffset.top = Math.ceil(Math.max(margins.top, plotOffset.top));
            plotOffset.bottom = Math.ceil(Math.max(margins.bottom, plotOffset.bottom));
        }

        function setupGrid() {
            var i, axes = allAxes(), showGrid = options.grid.show;

            // Initialize the plot's offset from the edge of the canvas

            for (var a in plotOffset) {
                var margin = options.grid.margin || 0;
                plotOffset[a] = typeof margin == "number" ? margin : margin[a] || 0;
            }

            executeHooks(hooks.processOffset, [plotOffset]);

            // If the grid is visible, add its border width to the offset

            for (var a in plotOffset) {
                if(typeof(options.grid.borderWidth) == "object") {
                    plotOffset[a] += showGrid ? options.grid.borderWidth[a] : 0;
                }
                else {
                    plotOffset[a] += showGrid ? options.grid.borderWidth : 0;
                }
            }

            $.each(axes, function (_, axis) {
                var axisOpts = axis.options;
                axis.show = axisOpts.show == null ? axis.used : axisOpts.show;
                axis.reserveSpace = axisOpts.reserveSpace == null ? axis.show : axisOpts.reserveSpace;
                setRange(axis);
            });

            if (showGrid) {

                var allocatedAxes = $.grep(axes, function (axis) {
                    return axis.show || axis.reserveSpace;
                });

                $.each(allocatedAxes, function (_, axis) {
                    // make the ticks
                    setupTickGeneration(axis);
                    setTicks(axis);
                    snapRangeToTicks(axis, axis.ticks);
                    // find labelWidth/Height for axis
                    measureTickLabels(axis);
                });

                // with all dimensions calculated, we can compute the
                // axis bounding boxes, start from the outside
                // (reverse order)
                for (i = allocatedAxes.length - 1; i >= 0; --i)
                    allocateAxisBoxFirstPhase(allocatedAxes[i]);

                // make sure we've got enough space for things that
                // might stick out
                adjustLayoutForThingsStickingOut();

                $.each(allocatedAxes, function (_, axis) {
                    allocateAxisBoxSecondPhase(axis);
                });
            }

            plotWidth = surface.width - plotOffset.left - plotOffset.right;
            plotHeight = surface.height - plotOffset.bottom - plotOffset.top;

            // now we got the proper plot dimensions, we can compute the scaling
            $.each(axes, function (_, axis) {
                setTransformationHelpers(axis);
            });

            if (showGrid) {
                drawAxisLabels();
            }

            insertLegend();
        }

        function setRange(axis) {
            var opts = axis.options,
                min = +(opts.min != null ? opts.min : axis.datamin),
                max = +(opts.max != null ? opts.max : axis.datamax),
                delta = max - min;

            if (delta == 0.0) {
                // degenerate case
                var widen = max == 0 ? 1 : 0.01;

                if (opts.min == null)
                    min -= widen;
                // always widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (opts.max == null || opts.min != null)
                    max += widen;
            }
            else {
                // consider autoscaling
                var margin = opts.autoscaleMargin;
                if (margin != null) {
                    if (opts.min == null) {
                        min -= delta * margin;
                        // make sure we don't go below zero if all values
                        // are positive
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (opts.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        function setupTickGeneration(axis) {
            var opts = axis.options;

            // estimate number of ticks
            var noTicks;
            if (typeof opts.ticks == "number" && opts.ticks > 0)
                noTicks = opts.ticks;
            else
                // heuristic based on the model a*sqrt(x) fitted to
                // some data points that seemed reasonable
                noTicks = 0.3 * Math.sqrt(axis.direction == "x" ? surface.width : surface.height);

            var delta = (axis.max - axis.min) / noTicks,
                dec = -Math.floor(Math.log(delta) / Math.LN10),
                maxDec = opts.tickDecimals;

            if (maxDec != null && dec > maxDec) {
                dec = maxDec;
            }

            var magn = Math.pow(10, -dec),
                norm = delta / magn, // norm is between 1.0 and 10.0
                size;

            if (norm < 1.5) {
                size = 1;
            } else if (norm < 3) {
                size = 2;
                // special case for 2.5, requires an extra decimal
                if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                    size = 2.5;
                    ++dec;
                }
            } else if (norm < 7.5) {
                size = 5;
            } else {
                size = 10;
            }

            size *= magn;

            if (opts.minTickSize != null && size < opts.minTickSize) {
                size = opts.minTickSize;
            }

            axis.delta = delta;
            axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec);
            axis.tickSize = opts.tickSize || size;

            // Time mode was moved to a plug-in in 0.8, and since so many people use it
            // we'll add an especially friendly reminder to make sure they included it.

            if (opts.mode == "time" && !axis.tickGenerator) {
                throw new Error("Time mode requires the flot.time plugin.");
            }

            // Flot supports base-10 axes; any other mode else is handled by a plug-in,
            // like flot.time.js.

            if (!axis.tickGenerator) {

                axis.tickGenerator = function (axis) {

                    var ticks = [],
                        start = floorInBase(axis.min, axis.tickSize),
                        i = 0,
                        v = Number.NaN,
                        prev;

                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push(v);
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };

				axis.tickFormatter = function (value, axis) {

					var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
					var formatted = "" + Math.round(value * factor) / factor;

					// If tickDecimals was specified, ensure that we have exactly that
					// much precision; otherwise default to the value's own precision.

					if (axis.tickDecimals != null) {
						var decimal = formatted.indexOf(".");
						var precision = decimal == -1 ? 0 : formatted.length - decimal - 1;
						if (precision < axis.tickDecimals) {
							return (precision ? formatted : formatted + ".") + ("" + factor).substr(1, axis.tickDecimals - precision);
						}
					}

                    return formatted;
                };
            }

            if ($.isFunction(opts.tickFormatter))
                axis.tickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis); };

            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis != axis) {
                    // consider snapping min/max to outermost nice ticks
                    var niceTicks = axis.tickGenerator(axis);
                    if (niceTicks.length > 0) {
                        if (opts.min == null)
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        if (opts.max == null && niceTicks.length > 1)
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                    }

                    axis.tickGenerator = function (axis) {
                        // copy ticks, scaled to this axis
                        var ticks = [], v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);
                            ticks.push(v);
                        }
                        return ticks;
                    };

                    // we might need an extra decimal since forced
                    // ticks don't necessarily fit naturally
                    if (!axis.mode && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(axis.delta) / Math.LN10) + 1),
                            ts = axis.tickGenerator(axis);

                        // only proceed if the tick interval rounded
                        // with an extra decimal doesn't give us a
                        // zero at end
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec))))
                            axis.tickDecimals = extraDec;
                    }
                }
            }
        }

        function setTicks(axis) {
            var oticks = axis.options.ticks, ticks = [];
            if (oticks == null || (typeof oticks == "number" && oticks > 0))
                ticks = axis.tickGenerator(axis);
            else if (oticks) {
                if ($.isFunction(oticks))
                    // generate the ticks
                    ticks = oticks(axis);
                else
                    ticks = oticks;
            }

            // clean up/labelify the supplied ticks, copy them over
            var i, v;
            axis.ticks = [];
            for (i = 0; i < ticks.length; ++i) {
                var label = null;
                var t = ticks[i];
                if (typeof t == "object") {
                    v = +t[0];
                    if (t.length > 1)
                        label = t[1];
                }
                else
                    v = +t;
                if (label == null)
                    label = axis.tickFormatter(v, axis);
                if (!isNaN(v))
                    axis.ticks.push({ v: v, label: label });
            }
        }

        function snapRangeToTicks(axis, ticks) {
            if (axis.options.autoscaleMargin && ticks.length > 0) {
                // snap to ticks
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, ticks[0].v);
                if (axis.options.max == null && ticks.length > 1)
                    axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }
        }

        function draw() {

            surface.clear();

            executeHooks(hooks.drawBackground, [ctx]);

            var grid = options.grid;

            // draw background, if any
            if (grid.show && grid.backgroundColor)
                drawBackground();

            if (grid.show && !grid.aboveData) {
                drawGrid();
            }

            for (var i = 0; i < series.length; ++i) {
                executeHooks(hooks.drawSeries, [ctx, series[i]]);
                drawSeries(series[i]);
            }

            executeHooks(hooks.draw, [ctx]);

            if (grid.show && grid.aboveData) {
                drawGrid();
            }

            surface.render();

            // A draw implies that either the axes or data have changed, so we
            // should probably update the overlay highlights as well.

            triggerRedrawOverlay();
        }

        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = allAxes();

            for (var i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function drawBackground() {
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
            ctx.fillRect(0, 0, plotWidth, plotHeight);
            ctx.restore();
        }

        function drawGrid() {
            var i, axes, bw, bc;

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // draw markings
            var markings = options.grid.markings;
            if (markings) {
                if ($.isFunction(markings)) {
                    axes = plot.getAxes();
                    // xmin etc. is backwards compatibility, to be
                    // removed in the future
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;

                    markings = markings(axes);
                }

                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");

                    // fill in missing
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    var xequal = xrange.from === xrange.to,
                        yequal = yrange.from === yrange.to;

                    if (xequal && yequal) {
                        continue;
                    }

                    // then draw
                    xrange.from = Math.floor(xrange.axis.p2c(xrange.from));
                    xrange.to = Math.floor(xrange.axis.p2c(xrange.to));
                    yrange.from = Math.floor(yrange.axis.p2c(yrange.from));
                    yrange.to = Math.floor(yrange.axis.p2c(yrange.to));

                    if (xequal || yequal) {
                        var lineWidth = m.lineWidth || options.grid.markingsLineWidth,
                            subPixel = lineWidth % 2 ? 0.5 : 0;
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = lineWidth;
                        if (xequal) {
                            ctx.moveTo(xrange.to + subPixel, yrange.from);
                            ctx.lineTo(xrange.to + subPixel, yrange.to);
                        } else {
                            ctx.moveTo(xrange.from, yrange.to + subPixel);
                            ctx.lineTo(xrange.to, yrange.to + subPixel);                            
                        }
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to,
                                     xrange.to - xrange.from,
                                     yrange.from - yrange.to);
                    }
                }
            }

            // draw the ticks
            axes = allAxes();
            bw = options.grid.borderWidth;

            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j], box = axis.box,
                    t = axis.tickLength, x, y, xoff, yoff;
                if (!axis.show || axis.ticks.length == 0)
                    continue;

                ctx.lineWidth = 1;

                // find the edges
                if (axis.direction == "x") {
                    x = 0;
                    if (t == "full")
                        y = (axis.position == "top" ? 0 : plotHeight);
                    else
                        y = box.top - plotOffset.top + (axis.position == "top" ? box.height : 0);
                }
                else {
                    y = 0;
                    if (t == "full")
                        x = (axis.position == "left" ? 0 : plotWidth);
                    else
                        x = box.left - plotOffset.left + (axis.position == "left" ? box.width : 0);
                }

                // draw tick bar
                if (!axis.innermost) {
                    ctx.strokeStyle = axis.options.color;
                    ctx.beginPath();
                    xoff = yoff = 0;
                    if (axis.direction == "x")
                        xoff = plotWidth + 1;
                    else
                        yoff = plotHeight + 1;

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x") {
                            y = Math.floor(y) + 0.5;
                        } else {
                            x = Math.floor(x) + 0.5;
                        }
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                    ctx.stroke();
                }

                // draw ticks

                ctx.strokeStyle = axis.options.tickColor;

                ctx.beginPath();
                for (i = 0; i < axis.ticks.length; ++i) {
                    var v = axis.ticks[i].v;

                    xoff = yoff = 0;

                    if (isNaN(v) || v < axis.min || v > axis.max
                        // skip those lying on the axes if we got a border
                        || (t == "full"
                            && ((typeof bw == "object" && bw[axis.position] > 0) || bw > 0)
                            && (v == axis.min || v == axis.max)))
                        continue;

                    if (axis.direction == "x") {
                        x = axis.p2c(v);
                        yoff = t == "full" ? -plotHeight : t;

                        if (axis.position == "top")
                            yoff = -yoff;
                    }
                    else {
                        y = axis.p2c(v);
                        xoff = t == "full" ? -plotWidth : t;

                        if (axis.position == "left")
                            xoff = -xoff;
                    }

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x")
                            x = Math.floor(x) + 0.5;
                        else
                            y = Math.floor(y) + 0.5;
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                }

                ctx.stroke();
            }


            // draw border
            if (bw) {
                // If either borderWidth or borderColor is an object, then draw the border
                // line by line instead of as one rectangle
                bc = options.grid.borderColor;
                if(typeof bw == "object" || typeof bc == "object") {
                    if (typeof bw !== "object") {
                        bw = {top: bw, right: bw, bottom: bw, left: bw};
                    }
                    if (typeof bc !== "object") {
                        bc = {top: bc, right: bc, bottom: bc, left: bc};
                    }

                    if (bw.top > 0) {
                        ctx.strokeStyle = bc.top;
                        ctx.lineWidth = bw.top;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left, 0 - bw.top/2);
                        ctx.lineTo(plotWidth, 0 - bw.top/2);
                        ctx.stroke();
                    }

                    if (bw.right > 0) {
                        ctx.strokeStyle = bc.right;
                        ctx.lineWidth = bw.right;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right / 2, 0 - bw.top);
                        ctx.lineTo(plotWidth + bw.right / 2, plotHeight);
                        ctx.stroke();
                    }

                    if (bw.bottom > 0) {
                        ctx.strokeStyle = bc.bottom;
                        ctx.lineWidth = bw.bottom;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right, plotHeight + bw.bottom / 2);
                        ctx.lineTo(0, plotHeight + bw.bottom / 2);
                        ctx.stroke();
                    }

                    if (bw.left > 0) {
                        ctx.strokeStyle = bc.left;
                        ctx.lineWidth = bw.left;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left/2, plotHeight + bw.bottom);
                        ctx.lineTo(0- bw.left/2, 0);
                        ctx.stroke();
                    }
                }
                else {
                    ctx.lineWidth = bw;
                    ctx.strokeStyle = options.grid.borderColor;
                    ctx.strokeRect(-bw/2, -bw/2, plotWidth + bw, plotHeight + bw);
                }
            }

            ctx.restore();
        }

        function drawAxisLabels() {

            $.each(allAxes(), function (_, axis) {
                var box = axis.box,
                    legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                    layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                    font = axis.options.font || "flot-tick-label tickLabel",
                    tick, x, y, halign, valign;

                // Remove text before checking for axis.show and ticks.length;
                // otherwise plugins, like flot-tickrotor, that draw their own
                // tick labels will end up with both theirs and the defaults.

                surface.removeText(layer);

                if (!axis.show || axis.ticks.length == 0)
                    return;

                for (var i = 0; i < axis.ticks.length; ++i) {

                    tick = axis.ticks[i];
                    if (!tick.label || tick.v < axis.min || tick.v > axis.max)
                        continue;

                    if (axis.direction == "x") {
                        halign = "center";
                        x = plotOffset.left + axis.p2c(tick.v);
                        if (axis.position == "bottom") {
                            y = box.top + box.padding;
                        } else {
                            y = box.top + box.height - box.padding;
                            valign = "bottom";
                        }
                    } else {
                        valign = "middle";
                        y = plotOffset.top + axis.p2c(tick.v);
                        if (axis.position == "left") {
                            x = box.left + box.width - box.padding;
                            halign = "right";
                        } else {
                            x = box.left + box.padding;
                        }
                    }

                    surface.addText(layer, x, y, tick.label, font, null, null, halign, valign);
                }
            });
        }

        function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }

        function drawSeriesLines(series) {
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null, prevy = null;

                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];

                    if (x1 == null || x2 == null)
                        continue;

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue;   // line segment is outside
                        // compute new intersection point
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);

                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    i = 0, top, areaOpen = false,
                    ypos = 1, segmentStart = 0, segmentEnd = 0;

                // we process each segment in two turns, first forward
                // direction to sketch out top, then once we hit the
                // end we go backwards to sketch the bottom
                while (true) {
                    if (ps > 0 && i > points.length + ps)
                        break;

                    i += ps; // ps is negative if going backwards

                    var x1 = points[i - ps],
                        y1 = points[i - ps + ypos],
                        x2 = points[i], y2 = points[i + ypos];

                    if (areaOpen) {
                        if (ps > 0 && x1 != null && x2 == null) {
                            // at turning point
                            segmentEnd = i;
                            ps = -ps;
                            ypos = 2;
                            continue;
                        }

                        if (ps < 0 && i == segmentStart + ps) {
                            // done with the reverse sweep
                            ctx.fill();
                            areaOpen = false;
                            ps = -ps;
                            ypos = 1;
                            i = segmentStart = segmentEnd + ps;
                            continue;
                        }
                    }

                    if (x1 == null || x2 == null)
                        continue;

                    // clip x values

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (!areaOpen) {
                        // open area
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }

                    // now first check the case where both is outside
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        continue;
                    }
                    else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        continue;
                    }

                    // else it's a bit more complicated, there might
                    // be a flat maxed out rectangle first, then a
                    // triangular cutout or reverse; to find these
                    // keep track of the current x values
                    var x1old = x1, x2old = x2;

                    // clip the y values, without shortcutting, we
                    // go through all cases in turn

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // if the x value was changed we got a rectangle
                    // to fill
                    if (x1 != x1old) {
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1));
                        // it goes to (x1, y1), but we fill that below
                    }

                    // fill triangular section, this sometimes result
                    // in redundant points if (x1, y1) hasn't changed
                    // from previous line to, but we just ignore that
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));

                    // fill the other rectangle if it's there
                    if (x2 != x2old) {
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2));
                    }
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";

            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            // FIXME: consider another form of shadow when filling is turned on
            if (lw > 0 && sw > 0) {
                // draw shadow as a thick and thin line with transparency
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                // position shadow at angle from the mid of line
                var angle = Math.PI/18;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw/2;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4), series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }

            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
            function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i], y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;

                    ctx.beginPath();
                    x = axisx.p2c(x);
                    y = axisy.p2c(y) + offset;
                    if (symbol == "circle")
                        ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                    else
                        symbol(ctx, x, y, radius, shadow);
                    ctx.closePath();

                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            var lw = series.points.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius,
                symbol = series.points.symbol;

            // If the user sets the line width to 0, we change it to a very 
            // small value. A line width of 0 seems to force the default of 1.
            // Doing the conditional here allows the shadow setting to still be 
            // optional even with a lineWidth of 0.

            if( lw == 0 )
                lw = 0.0001;

            if (lw > 0 && sw > 0) {
                // draw shadow in two steps
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w/2, true,
                           series.xaxis, series.yaxis, symbol);

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w/2, true,
                           series.xaxis, series.yaxis, symbol);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius,
                       getFillStyle(series.points, series.color), 0, false,
                       series.xaxis, series.yaxis, symbol);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth) {
            var left, right, bottom, top,
                drawLeft, drawRight, drawTop, drawBottom,
                tmp;

            // in horizontal mode, we start the bar from the left
            // instead of from the bottom so it appears to be
            // horizontal rather than vertical
            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;

                // account for negative bars
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            }
            else {
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;

                // account for negative bars
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }

            // clip
            if (right < axisx.min || left > axisx.max ||
                top < axisy.min || bottom > axisy.max)
                return;

            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }

            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }

            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }

            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);

            // fill the bar
            if (fillStyleCallback) {
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fillRect(left, top, right - left, bottom - top)
            }

            // draw outline
            if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
                c.beginPath();

                // FIXME: inline moveTo is buggy with excanvas
                c.moveTo(left, bottom);
                if (drawLeft)
                    c.lineTo(left, top);
                else
                    c.moveTo(left, top);
                if (drawTop)
                    c.lineTo(right, top);
                else
                    c.moveTo(right, top);
                if (drawRight)
                    c.lineTo(right, bottom);
                else
                    c.moveTo(right, bottom);
                if (drawBottom)
                    c.lineTo(left, bottom);
                else
                    c.moveTo(left, bottom);
                c.stroke();
            }
        }

        function drawSeriesBars(series) {
            function plotBars(datapoints, barLeft, barRight, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, series.bars.lineWidth);
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // FIXME: figure out a way to add shadows (for instance along the right edge)
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;

            var barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                default:
                    barLeft = -series.bars.barWidth / 2;
            }

            var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top); } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, fillStyleCallback, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function getFillStyle(filloptions, seriesColor, bottom, top) {
            var fill = filloptions.fill;
            if (!fill)
                return null;

            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);

            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }

        function insertLegend() {

            if (options.legend.container != null) {
                $(options.legend.container).html("");
            } else {
                placeholder.find(".legend").remove();
            }

            if (!options.legend.show) {
                return;
            }

            var fragments = [], entries = [], rowStarted = false,
                lf = options.legend.labelFormatter, s, label;

            // Build a list of legend entries, with each having a label and a color

            for (var i = 0; i < series.length; ++i) {
                s = series[i];
                if (s.label) {
                    label = lf ? lf(s.label, s) : s.label;
                    if (label) {
                        entries.push({
                            label: label,
                            color: s.color
                        });
                    }
                }
            }

            // Sort the legend using either the default or a custom comparator

            if (options.legend.sorted) {
                if ($.isFunction(options.legend.sorted)) {
                    entries.sort(options.legend.sorted);
                } else if (options.legend.sorted == "reverse") {
                	entries.reverse();
                } else {
                    var ascending = options.legend.sorted != "descending";
                    entries.sort(function(a, b) {
                        return a.label == b.label ? 0 : (
                            (a.label < b.label) != ascending ? 1 : -1   // Logical XOR
                        );
                    });
                }
            }

            // Generate markup for the list of entries, in their final order

            for (var i = 0; i < entries.length; ++i) {

                var entry = entries[i];

                if (i % options.legend.noColumns == 0) {
                    if (rowStarted)
                        fragments.push('</tr>');
                    fragments.push('<tr>');
                    rowStarted = true;
                }

                fragments.push(
                    '<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + entry.color + ';overflow:hidden"></div></div></td>' +
                    '<td class="legendLabel">' + entry.label + '</td>'
                );
            }

            if (rowStarted)
                fragments.push('</tr>');

            if (fragments.length == 0)
                return;

            var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + '</table>';
            if (options.legend.container != null)
                $(options.legend.container).html(table);
            else {
                var pos = "",
                    p = options.legend.position,
                    m = options.legend.margin;
                if (m[0] == null)
                    m = [m, m];
                if (p.charAt(0) == "n")
                    pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
                else if (p.charAt(0) == "s")
                    pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
                if (p.charAt(1) == "e")
                    pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
                else if (p.charAt(1) == "w")
                    pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
                var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos +';') + '</div>').appendTo(placeholder);
                if (options.legend.backgroundOpacity != 0.0) {
                    // put in the transparent background
                    // separately to avoid blended labels and
                    // label boxes
                    var c = options.legend.backgroundColor;
                    if (c == null) {
                        c = options.grid.backgroundColor;
                        if (c && typeof c == "string")
                            c = $.color.parse(c);
                        else
                            c = $.color.extract(legend, 'background-color');
                        c.a = 1;
                        c = c.toString();
                    }
                    var div = legend.children();
                    $('<div style="position:absolute;width:' + div.width() + 'px;height:' + div.height() + 'px;' + pos +'background-color:' + c + ';"> </div>').prependTo(legend).css('opacity', options.legend.backgroundOpacity);
                }
            }
        }


        // interactive features

        var highlights = [],
            redrawTimeout = null;

        // returns the data item the mouse is over, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null, foundPoint = false, i, j, ps;

            for (i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(series[i]))
                    continue;

                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;

                ps = s.datapoints.pointsize;
                // with inverse transforms, we can't use the maxx/maxy
                // optimization, sadly
                if (axisx.options.inverseTransform)
                    maxx = Number.MAX_VALUE;
                if (axisy.options.inverseTransform)
                    maxy = Number.MAX_VALUE;

                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1];
                        if (x == null)
                            continue;

                        // For points and lines, the cursor must be within a
                        // certain distance to the data point
                        if (x - mx > maxx || x - mx < -maxx ||
                            y - my > maxy || y - my < -maxy)
                            continue;

                        // We have to calculate distances in pixels, not in
                        // data units, because the scales of the axes may be different
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy; // we save the sqrt

                        // use <= to ensure last point takes precedence
                        // (last generally means on top of)
                        if (dist < smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }

                if (s.bars.show && !item) { // no other point can be nearby

                    var barLeft, barRight;

                    switch (s.bars.align) {
                        case "left":
                            barLeft = 0;
                            break;
                        case "right":
                            barLeft = -s.bars.barWidth;
                            break;
                        default:
                            barLeft = -s.bars.barWidth / 2;
                    }

                    barRight = barLeft + s.bars.barWidth;

                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1], b = points[j + 2];
                        if (x == null)
                            continue;

                        // for a bar graph, the cursor must be inside the bar
                        if (series[i].bars.horizontal ?
                            (mx <= Math.max(b, x) && mx >= Math.min(b, x) &&
                             my >= y + barLeft && my <= y + barRight) :
                            (mx >= x + barLeft && mx <= x + barRight &&
                             my >= Math.min(b, y) && my <= Math.max(b, y)))
                                item = [i, j / ps];
                    }
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;

                return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                         dataIndex: j,
                         series: series[i],
                         seriesIndex: i };
            }

            return null;
        }

        function onMouseMove(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return s["hoverable"] != false; });
        }

        function onMouseLeave(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return false; });
        }

        function onClick(e) {
            triggerClickHoverEvent("plotclick", e,
                                   function (s) { return s["clickable"] != false; });
        }

        // trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = eventHolder.offset(),
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top,
            pos = canvasToAxisCoords({ left: canvasX, top: canvasY });

            pos.pageX = event.pageX;
            pos.pageY = event.pageY;

            var item = findNearbyItem(canvasX, canvasY, seriesFilter);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left, 10);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top, 10);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series &&
                          h.point[0] == item.datapoint[0] &&
                          h.point[1] == item.datapoint[1]))
                        unhighlight(h.series, h.point);
                }

                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }

            placeholder.trigger(eventname, [ pos, item ]);
        }

        function triggerRedrawOverlay() {
            var t = options.interaction.redrawOverlayInterval;
            if (t == -1) {      // skip event queue
                drawOverlay();
                return;
            }

            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, t);
        }

        function drawOverlay() {
            redrawTimeout = null;

            // draw highlights
            octx.save();
            overlay.clear();
            octx.translate(plotOffset.left, plotOffset.top);

            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];

                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();

            executeHooks(hooks.drawOverlay, [octx]);
        }

        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({ series: s, point: point, auto: auto });

                triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
                return;
            }

            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);

                triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0]
                    && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }

        function drawPointHighlight(series, point) {
            var x = point[0], y = point[1],
                axisx = series.xaxis, axisy = series.yaxis,
                highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString();

            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;

            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = highlightColor;
            var radius = 1.5 * pointRadius;
            x = axisx.p2c(x);
            y = axisy.p2c(y);

            octx.beginPath();
            if (series.points.symbol == "circle")
                octx.arc(x, y, radius, 0, 2 * Math.PI, false);
            else
                series.points.symbol(octx, x, y, radius, false);
            octx.closePath();
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            var highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString(),
                fillStyle = highlightColor,
                barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                default:
                    barLeft = -series.bars.barWidth / 2;
            }

            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = highlightColor;

            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth,
                    function () { return fillStyle; }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec == "string")
                return spec;
            else {
                // assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's
                // what we support too
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);

                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null)
                            co = co.scale('rgb', c.brightness);
                        if (c.opacity != null)
                            co.a *= c.opacity;
                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }

                return gradient;
            }
        }
    }

    // Add the plot function to the top level of the jQuery object

    $.plot = function(placeholder, data, options) {
        //var t0 = new Date();
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        //(window.console ? console.log : alert)("time used (msecs): " + ((new Date()).getTime() - t0.getTime()));
        return plot;
    };

    $.plot.version = "0.8.3";

    $.plot.plugins = [];

    // Also add the plot function as a chainable property

    $.fn.plot = function(data, options) {
        return this.each(function() {
            $.plot(this, data, options);
        });
    };

    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

})(jQuery);


/***/ }),

/***/ "./assets/bower_components/Flot/jquery.flot.pie.js":
/*!*********************************************************!*\
  !*** ./assets/bower_components/Flot/jquery.flot.pie.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Flot plugin for rendering pie charts.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes that each series has a single data value, and that each
value is a positive integer or zero.  Negative numbers don't make sense for a
pie chart, and have unpredictable results.  The values do NOT need to be
passed in as percentages; the plugin will calculate the total and per-slice
percentages internally.

* Created by Brian Medendorp

* Updated with contributions from btburnett3, Anthony Aragues and Xavi Ivars

The plugin supports these options:

	series: {
		pie: {
			show: true/false
			radius: 0-1 for percentage of fullsize, or a specified pixel length, or 'auto'
			innerRadius: 0-1 for percentage of fullsize or a specified pixel length, for creating a donut effect
			startAngle: 0-2 factor of PI used for starting angle (in radians) i.e 3/2 starts at the top, 0 and 2 have the same result
			tilt: 0-1 for percentage to tilt the pie, where 1 is no tilt, and 0 is completely flat (nothing will show)
			offset: {
				top: integer value to move the pie up or down
				left: integer value to move the pie left or right, or 'auto'
			},
			stroke: {
				color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#FFF')
				width: integer pixel width of the stroke
			},
			label: {
				show: true/false, or 'auto'
				formatter:  a user-defined function that modifies the text/style of the label text
				radius: 0-1 for percentage of fullsize, or a specified pixel length
				background: {
					color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#000')
					opacity: 0-1
				},
				threshold: 0-1 for the percentage value at which to hide labels (if they're too small)
			},
			combine: {
				threshold: 0-1 for the percentage value at which to combine slices (if they're too small)
				color: any hexidecimal color value (other formats may or may not work, so best to stick with something like '#CCC'), if null, the plugin will automatically use the color of the first slice to be combined
				label: any text value of what the combined slice should be labeled
			}
			highlight: {
				opacity: 0-1
			}
		}
	}

More detail and specific examples can be found in the included HTML file.

*/

(function($) {

	// Maximum redraw attempts when fitting labels within the plot

	var REDRAW_ATTEMPTS = 10;

	// Factor by which to shrink the pie when fitting labels within the plot

	var REDRAW_SHRINK = 0.95;

	function init(plot) {

		var canvas = null,
			target = null,
			options = null,
			maxRadius = null,
			centerLeft = null,
			centerTop = null,
			processed = false,
			ctx = null;

		// interactive variables

		var highlights = [];

		// add hook to determine if pie plugin in enabled, and then perform necessary operations

		plot.hooks.processOptions.push(function(plot, options) {
			if (options.series.pie.show) {

				options.grid.show = false;

				// set labels.show

				if (options.series.pie.label.show == "auto") {
					if (options.legend.show) {
						options.series.pie.label.show = false;
					} else {
						options.series.pie.label.show = true;
					}
				}

				// set radius

				if (options.series.pie.radius == "auto") {
					if (options.series.pie.label.show) {
						options.series.pie.radius = 3/4;
					} else {
						options.series.pie.radius = 1;
					}
				}

				// ensure sane tilt

				if (options.series.pie.tilt > 1) {
					options.series.pie.tilt = 1;
				} else if (options.series.pie.tilt < 0) {
					options.series.pie.tilt = 0;
				}
			}
		});

		plot.hooks.bindEvents.push(function(plot, eventHolder) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				if (options.grid.hoverable) {
					eventHolder.unbind("mousemove").mousemove(onMouseMove);
				}
				if (options.grid.clickable) {
					eventHolder.unbind("click").click(onClick);
				}
			}
		});

		plot.hooks.processDatapoints.push(function(plot, series, data, datapoints) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				processDatapoints(plot, series, data, datapoints);
			}
		});

		plot.hooks.drawOverlay.push(function(plot, octx) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				drawOverlay(plot, octx);
			}
		});

		plot.hooks.draw.push(function(plot, newCtx) {
			var options = plot.getOptions();
			if (options.series.pie.show) {
				draw(plot, newCtx);
			}
		});

		function processDatapoints(plot, series, datapoints) {
			if (!processed)	{
				processed = true;
				canvas = plot.getCanvas();
				target = $(canvas).parent();
				options = plot.getOptions();
				plot.setData(combine(plot.getData()));
			}
		}

		function combine(data) {

			var total = 0,
				combined = 0,
				numCombined = 0,
				color = options.series.pie.combine.color,
				newdata = [];

			// Fix up the raw data from Flot, ensuring the data is numeric

			for (var i = 0; i < data.length; ++i) {

				var value = data[i].data;

				// If the data is an array, we'll assume that it's a standard
				// Flot x-y pair, and are concerned only with the second value.

				// Note how we use the original array, rather than creating a
				// new one; this is more efficient and preserves any extra data
				// that the user may have stored in higher indexes.

				if ($.isArray(value) && value.length == 1) {
    				value = value[0];
				}

				if ($.isArray(value)) {
					// Equivalent to $.isNumeric() but compatible with jQuery < 1.7
					if (!isNaN(parseFloat(value[1])) && isFinite(value[1])) {
						value[1] = +value[1];
					} else {
						value[1] = 0;
					}
				} else if (!isNaN(parseFloat(value)) && isFinite(value)) {
					value = [1, +value];
				} else {
					value = [1, 0];
				}

				data[i].data = [value];
			}

			// Sum up all the slices, so we can calculate percentages for each

			for (var i = 0; i < data.length; ++i) {
				total += data[i].data[0][1];
			}

			// Count the number of slices with percentages below the combine
			// threshold; if it turns out to be just one, we won't combine.

			for (var i = 0; i < data.length; ++i) {
				var value = data[i].data[0][1];
				if (value / total <= options.series.pie.combine.threshold) {
					combined += value;
					numCombined++;
					if (!color) {
						color = data[i].color;
					}
				}
			}

			for (var i = 0; i < data.length; ++i) {
				var value = data[i].data[0][1];
				if (numCombined < 2 || value / total > options.series.pie.combine.threshold) {
					newdata.push(
						$.extend(data[i], {     /* extend to allow keeping all other original data values
						                           and using them e.g. in labelFormatter. */
							data: [[1, value]],
							color: data[i].color,
							label: data[i].label,
							angle: value * Math.PI * 2 / total,
							percent: value / (total / 100)
						})
					);
				}
			}

			if (numCombined > 1) {
				newdata.push({
					data: [[1, combined]],
					color: color,
					label: options.series.pie.combine.label,
					angle: combined * Math.PI * 2 / total,
					percent: combined / (total / 100)
				});
			}

			return newdata;
		}

		function draw(plot, newCtx) {

			if (!target) {
				return; // if no series were passed
			}

			var canvasWidth = plot.getPlaceholder().width(),
				canvasHeight = plot.getPlaceholder().height(),
				legendWidth = target.children().filter(".legend").children().width() || 0;

			ctx = newCtx;

			// WARNING: HACK! REWRITE THIS CODE AS SOON AS POSSIBLE!

			// When combining smaller slices into an 'other' slice, we need to
			// add a new series.  Since Flot gives plugins no way to modify the
			// list of series, the pie plugin uses a hack where the first call
			// to processDatapoints results in a call to setData with the new
			// list of series, then subsequent processDatapoints do nothing.

			// The plugin-global 'processed' flag is used to control this hack;
			// it starts out false, and is set to true after the first call to
			// processDatapoints.

			// Unfortunately this turns future setData calls into no-ops; they
			// call processDatapoints, the flag is true, and nothing happens.

			// To fix this we'll set the flag back to false here in draw, when
			// all series have been processed, so the next sequence of calls to
			// processDatapoints once again starts out with a slice-combine.
			// This is really a hack; in 0.9 we need to give plugins a proper
			// way to modify series before any processing begins.

			processed = false;

			// calculate maximum radius and center point

			maxRadius =  Math.min(canvasWidth, canvasHeight / options.series.pie.tilt) / 2;
			centerTop = canvasHeight / 2 + options.series.pie.offset.top;
			centerLeft = canvasWidth / 2;

			if (options.series.pie.offset.left == "auto") {
				if (options.legend.position.match("w")) {
					centerLeft += legendWidth / 2;
				} else {
					centerLeft -= legendWidth / 2;
				}
				if (centerLeft < maxRadius) {
					centerLeft = maxRadius;
				} else if (centerLeft > canvasWidth - maxRadius) {
					centerLeft = canvasWidth - maxRadius;
				}
			} else {
				centerLeft += options.series.pie.offset.left;
			}

			var slices = plot.getData(),
				attempts = 0;

			// Keep shrinking the pie's radius until drawPie returns true,
			// indicating that all the labels fit, or we try too many times.

			do {
				if (attempts > 0) {
					maxRadius *= REDRAW_SHRINK;
				}
				attempts += 1;
				clear();
				if (options.series.pie.tilt <= 0.8) {
					drawShadow();
				}
			} while (!drawPie() && attempts < REDRAW_ATTEMPTS)

			if (attempts >= REDRAW_ATTEMPTS) {
				clear();
				target.prepend("<div class='error'>Could not draw pie with labels contained inside canvas</div>");
			}

			if (plot.setSeries && plot.insertLegend) {
				plot.setSeries(slices);
				plot.insertLegend();
			}

			// we're actually done at this point, just defining internal functions at this point

			function clear() {
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				target.children().filter(".pieLabel, .pieLabelBackground").remove();
			}

			function drawShadow() {

				var shadowLeft = options.series.pie.shadow.left;
				var shadowTop = options.series.pie.shadow.top;
				var edge = 10;
				var alpha = options.series.pie.shadow.alpha;
				var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

				if (radius >= canvasWidth / 2 - shadowLeft || radius * options.series.pie.tilt >= canvasHeight / 2 - shadowTop || radius <= edge) {
					return;	// shadow would be outside canvas, so don't draw it
				}

				ctx.save();
				ctx.translate(shadowLeft,shadowTop);
				ctx.globalAlpha = alpha;
				ctx.fillStyle = "#000";

				// center and rotate to starting position

				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);

				//radius -= edge;

				for (var i = 1; i <= edge; i++) {
					ctx.beginPath();
					ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
					ctx.fill();
					radius -= i;
				}

				ctx.restore();
			}

			function drawPie() {

				var startAngle = Math.PI * options.series.pie.startAngle;
				var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

				// center and rotate to starting position

				ctx.save();
				ctx.translate(centerLeft,centerTop);
				ctx.scale(1, options.series.pie.tilt);
				//ctx.rotate(startAngle); // start at top; -- This doesn't work properly in Opera

				// draw slices

				ctx.save();
				var currentAngle = startAngle;
				for (var i = 0; i < slices.length; ++i) {
					slices[i].startAngle = currentAngle;
					drawSlice(slices[i].angle, slices[i].color, true);
				}
				ctx.restore();

				// draw slice outlines

				if (options.series.pie.stroke.width > 0) {
					ctx.save();
					ctx.lineWidth = options.series.pie.stroke.width;
					currentAngle = startAngle;
					for (var i = 0; i < slices.length; ++i) {
						drawSlice(slices[i].angle, options.series.pie.stroke.color, false);
					}
					ctx.restore();
				}

				// draw donut hole

				drawDonutHole(ctx);

				ctx.restore();

				// Draw the labels, returning true if they fit within the plot

				if (options.series.pie.label.show) {
					return drawLabels();
				} else return true;

				function drawSlice(angle, color, fill) {

					if (angle <= 0 || isNaN(angle)) {
						return;
					}

					if (fill) {
						ctx.fillStyle = color;
					} else {
						ctx.strokeStyle = color;
						ctx.lineJoin = "round";
					}

					ctx.beginPath();
					if (Math.abs(angle - Math.PI * 2) > 0.000000001) {
						ctx.moveTo(0, 0); // Center of the pie
					}

					//ctx.arc(0, 0, radius, 0, angle, false); // This doesn't work properly in Opera
					ctx.arc(0, 0, radius,currentAngle, currentAngle + angle / 2, false);
					ctx.arc(0, 0, radius,currentAngle + angle / 2, currentAngle + angle, false);
					ctx.closePath();
					//ctx.rotate(angle); // This doesn't work properly in Opera
					currentAngle += angle;

					if (fill) {
						ctx.fill();
					} else {
						ctx.stroke();
					}
				}

				function drawLabels() {

					var currentAngle = startAngle;
					var radius = options.series.pie.label.radius > 1 ? options.series.pie.label.radius : maxRadius * options.series.pie.label.radius;

					for (var i = 0; i < slices.length; ++i) {
						if (slices[i].percent >= options.series.pie.label.threshold * 100) {
							if (!drawLabel(slices[i], currentAngle, i)) {
								return false;
							}
						}
						currentAngle += slices[i].angle;
					}

					return true;

					function drawLabel(slice, startAngle, index) {

						if (slice.data[0][1] == 0) {
							return true;
						}

						// format label text

						var lf = options.legend.labelFormatter, text, plf = options.series.pie.label.formatter;

						if (lf) {
							text = lf(slice.label, slice);
						} else {
							text = slice.label;
						}

						if (plf) {
							text = plf(text, slice);
						}

						var halfAngle = ((startAngle + slice.angle) + startAngle) / 2;
						var x = centerLeft + Math.round(Math.cos(halfAngle) * radius);
						var y = centerTop + Math.round(Math.sin(halfAngle) * radius) * options.series.pie.tilt;

						var html = "<span class='pieLabel' id='pieLabel" + index + "' style='position:absolute;top:" + y + "px;left:" + x + "px;'>" + text + "</span>";
						target.append(html);

						var label = target.children("#pieLabel" + index);
						var labelTop = (y - label.height() / 2);
						var labelLeft = (x - label.width() / 2);

						label.css("top", labelTop);
						label.css("left", labelLeft);

						// check to make sure that the label is not outside the canvas

						if (0 - labelTop > 0 || 0 - labelLeft > 0 || canvasHeight - (labelTop + label.height()) < 0 || canvasWidth - (labelLeft + label.width()) < 0) {
							return false;
						}

						if (options.series.pie.label.background.opacity != 0) {

							// put in the transparent background separately to avoid blended labels and label boxes

							var c = options.series.pie.label.background.color;

							if (c == null) {
								c = slice.color;
							}

							var pos = "top:" + labelTop + "px;left:" + labelLeft + "px;";
							$("<div class='pieLabelBackground' style='position:absolute;width:" + label.width() + "px;height:" + label.height() + "px;" + pos + "background-color:" + c + ";'></div>")
								.css("opacity", options.series.pie.label.background.opacity)
								.insertBefore(label);
						}

						return true;
					} // end individual label function
				} // end drawLabels function
			} // end drawPie function
		} // end draw function

		// Placed here because it needs to be accessed from multiple locations

		function drawDonutHole(layer) {
			if (options.series.pie.innerRadius > 0) {

				// subtract the center

				layer.save();
				var innerRadius = options.series.pie.innerRadius > 1 ? options.series.pie.innerRadius : maxRadius * options.series.pie.innerRadius;
				layer.globalCompositeOperation = "destination-out"; // this does not work with excanvas, but it will fall back to using the stroke color
				layer.beginPath();
				layer.fillStyle = options.series.pie.stroke.color;
				layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
				layer.fill();
				layer.closePath();
				layer.restore();

				// add inner stroke

				layer.save();
				layer.beginPath();
				layer.strokeStyle = options.series.pie.stroke.color;
				layer.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
				layer.stroke();
				layer.closePath();
				layer.restore();

				// TODO: add extra shadow inside hole (with a mask) if the pie is tilted.
			}
		}

		//-- Additional Interactive related functions --

		function isPointInPoly(poly, pt) {
			for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
				((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1]< poly[i][1]))
				&& (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
				&& (c = !c);
			return c;
		}

		function findNearbySlice(mouseX, mouseY) {

			var slices = plot.getData(),
				options = plot.getOptions(),
				radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius,
				x, y;

			for (var i = 0; i < slices.length; ++i) {

				var s = slices[i];

				if (s.pie.show) {

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(0, 0); // Center of the pie
					//ctx.scale(1, options.series.pie.tilt);	// this actually seems to break everything when here.
					ctx.arc(0, 0, radius, s.startAngle, s.startAngle + s.angle / 2, false);
					ctx.arc(0, 0, radius, s.startAngle + s.angle / 2, s.startAngle + s.angle, false);
					ctx.closePath();
					x = mouseX - centerLeft;
					y = mouseY - centerTop;

					if (ctx.isPointInPath) {
						if (ctx.isPointInPath(mouseX - centerLeft, mouseY - centerTop)) {
							ctx.restore();
							return {
								datapoint: [s.percent, s.data],
								dataIndex: 0,
								series: s,
								seriesIndex: i
							};
						}
					} else {

						// excanvas for IE doesn;t support isPointInPath, this is a workaround.

						var p1X = radius * Math.cos(s.startAngle),
							p1Y = radius * Math.sin(s.startAngle),
							p2X = radius * Math.cos(s.startAngle + s.angle / 4),
							p2Y = radius * Math.sin(s.startAngle + s.angle / 4),
							p3X = radius * Math.cos(s.startAngle + s.angle / 2),
							p3Y = radius * Math.sin(s.startAngle + s.angle / 2),
							p4X = radius * Math.cos(s.startAngle + s.angle / 1.5),
							p4Y = radius * Math.sin(s.startAngle + s.angle / 1.5),
							p5X = radius * Math.cos(s.startAngle + s.angle),
							p5Y = radius * Math.sin(s.startAngle + s.angle),
							arrPoly = [[0, 0], [p1X, p1Y], [p2X, p2Y], [p3X, p3Y], [p4X, p4Y], [p5X, p5Y]],
							arrPoint = [x, y];

						// TODO: perhaps do some mathmatical trickery here with the Y-coordinate to compensate for pie tilt?

						if (isPointInPoly(arrPoly, arrPoint)) {
							ctx.restore();
							return {
								datapoint: [s.percent, s.data],
								dataIndex: 0,
								series: s,
								seriesIndex: i
							};
						}
					}

					ctx.restore();
				}
			}

			return null;
		}

		function onMouseMove(e) {
			triggerClickHoverEvent("plothover", e);
		}

		function onClick(e) {
			triggerClickHoverEvent("plotclick", e);
		}

		// trigger click or hover event (they send the same parameters so we share their code)

		function triggerClickHoverEvent(eventname, e) {

			var offset = plot.offset();
			var canvasX = parseInt(e.pageX - offset.left);
			var canvasY =  parseInt(e.pageY - offset.top);
			var item = findNearbySlice(canvasX, canvasY);

			if (options.grid.autoHighlight) {

				// clear auto-highlights

				for (var i = 0; i < highlights.length; ++i) {
					var h = highlights[i];
					if (h.auto == eventname && !(item && h.series == item.series)) {
						unhighlight(h.series);
					}
				}
			}

			// highlight the slice

			if (item) {
				highlight(item.series, eventname);
			}

			// trigger any hover bind events

			var pos = { pageX: e.pageX, pageY: e.pageY };
			target.trigger(eventname, [pos, item]);
		}

		function highlight(s, auto) {
			//if (typeof s == "number") {
			//	s = series[s];
			//}

			var i = indexOfHighlight(s);

			if (i == -1) {
				highlights.push({ series: s, auto: auto });
				plot.triggerRedrawOverlay();
			} else if (!auto) {
				highlights[i].auto = false;
			}
		}

		function unhighlight(s) {
			if (s == null) {
				highlights = [];
				plot.triggerRedrawOverlay();
			}

			//if (typeof s == "number") {
			//	s = series[s];
			//}

			var i = indexOfHighlight(s);

			if (i != -1) {
				highlights.splice(i, 1);
				plot.triggerRedrawOverlay();
			}
		}

		function indexOfHighlight(s) {
			for (var i = 0; i < highlights.length; ++i) {
				var h = highlights[i];
				if (h.series == s)
					return i;
			}
			return -1;
		}

		function drawOverlay(plot, octx) {

			var options = plot.getOptions();

			var radius = options.series.pie.radius > 1 ? options.series.pie.radius : maxRadius * options.series.pie.radius;

			octx.save();
			octx.translate(centerLeft, centerTop);
			octx.scale(1, options.series.pie.tilt);

			for (var i = 0; i < highlights.length; ++i) {
				drawHighlight(highlights[i].series);
			}

			drawDonutHole(octx);

			octx.restore();

			function drawHighlight(series) {

				if (series.angle <= 0 || isNaN(series.angle)) {
					return;
				}

				//octx.fillStyle = parseColor(options.series.pie.highlight.color).scale(null, null, null, options.series.pie.highlight.opacity).toString();
				octx.fillStyle = "rgba(255, 255, 255, " + options.series.pie.highlight.opacity + ")"; // this is temporary until we have access to parseColor
				octx.beginPath();
				if (Math.abs(series.angle - Math.PI * 2) > 0.000000001) {
					octx.moveTo(0, 0); // Center of the pie
				}
				octx.arc(0, 0, radius, series.startAngle, series.startAngle + series.angle / 2, false);
				octx.arc(0, 0, radius, series.startAngle + series.angle / 2, series.startAngle + series.angle, false);
				octx.closePath();
				octx.fill();
			}
		}
	} // end init (plugin body)

	// define pie specific options and their default values

	var options = {
		series: {
			pie: {
				show: false,
				radius: "auto",	// actual radius of the visible pie (based on full calculated radius if <=1, or hard pixel value)
				innerRadius: 0, /* for donut */
				startAngle: 3/2,
				tilt: 1,
				shadow: {
					left: 5,	// shadow left offset
					top: 15,	// shadow top offset
					alpha: 0.02	// shadow alpha
				},
				offset: {
					top: 0,
					left: "auto"
				},
				stroke: {
					color: "#fff",
					width: 1
				},
				label: {
					show: "auto",
					formatter: function(label, slice) {
						return "<div style='font-size:x-small;text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
					},	// formatter function
					radius: 1,	// radius at which to place the labels (based on full calculated radius if <=1, or hard pixel value)
					background: {
						color: null,
						opacity: 0
					},
					threshold: 0	// percentage at which to hide the label (i.e. the slice is too narrow)
				},
				combine: {
					threshold: -1,	// percentage at which to combine little slices into one larger slice
					color: null,	// color to give the new slice (auto-generated if null)
					label: "Other"	// label to give the new slice
				},
				highlight: {
					//color: "#fff",		// will add this functionality once parseColor is available
					opacity: 0.5
				}
			}
		}
	};

	$.plot.plugins.push({
		init: init,
		options: options,
		name: "pie",
		version: "1.1"
	});

})(jQuery);


/***/ }),

/***/ "./assets/bower_components/Flot/jquery.flot.resize.js":
/*!************************************************************!*\
  !*** ./assets/bower_components/Flot/jquery.flot.resize.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Flot plugin for automatically redrawing plots as the placeholder resizes.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

It works by listening for changes on the placeholder div (through the jQuery
resize event plugin) - if the size changes, it will redraw the plot.

There are no options. If you need to disable the plugin for some plots, you
can just fix the size of their placeholders.

*/

/* Inline dependency:
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,t){"$:nomunge";var i=[],n=$.resize=$.extend($.resize,{}),a,r=false,s="setTimeout",u="resize",m=u+"-special-event",o="pendingDelay",l="activeDelay",f="throttleWindow";n[o]=200;n[l]=20;n[f]=true;$.event.special[u]={setup:function(){if(!n[f]&&this[s]){return false}var e=$(this);i.push(this);e.data(m,{w:e.width(),h:e.height()});if(i.length===1){a=t;h()}},teardown:function(){if(!n[f]&&this[s]){return false}var e=$(this);for(var t=i.length-1;t>=0;t--){if(i[t]==this){i.splice(t,1);break}}e.removeData(m);if(!i.length){if(r){cancelAnimationFrame(a)}else{clearTimeout(a)}a=null}},add:function(e){if(!n[f]&&this[s]){return false}var i;function a(e,n,a){var r=$(this),s=r.data(m)||{};s.w=n!==t?n:r.width();s.h=a!==t?a:r.height();i.apply(this,arguments)}if($.isFunction(e)){i=e;return a}else{i=e.handler;e.handler=a}}};function h(t){if(r===true){r=t||1}for(var s=i.length-1;s>=0;s--){var l=$(i[s]);if(l[0]==e||l.is(":visible")){var f=l.width(),c=l.height(),d=l.data(m);if(d&&(f!==d.w||c!==d.h)){l.trigger(u,[d.w=f,d.h=c]);r=t||true}}else{d=l.data(m);d.w=0;d.h=0}}if(a!==null){if(r&&(t==null||t-r<1e3)){a=e.requestAnimationFrame(h)}else{a=setTimeout(h,n[o]);r=false}}}if(!e.requestAnimationFrame){e.requestAnimationFrame=function(){return e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t,i){return e.setTimeout(function(){t((new Date).getTime())},n[l])}}()}if(!e.cancelAnimationFrame){e.cancelAnimationFrame=function(){return e.webkitCancelRequestAnimationFrame||e.mozCancelRequestAnimationFrame||e.oCancelRequestAnimationFrame||e.msCancelRequestAnimationFrame||clearTimeout}()}})(jQuery,this);

(function ($) {
    var options = { }; // no options

    function init(plot) {
        function onResize() {
            var placeholder = plot.getPlaceholder();

            // somebody might have hidden us and we can't plot
            // when we don't have the dimensions
            if (placeholder.width() == 0 || placeholder.height() == 0)
                return;

            plot.resize();
            plot.setupGrid();
            plot.draw();
        }
        
        function bindEvents(plot, eventHolder) {
            plot.getPlaceholder().resize(onResize);
        }

        function shutdown(plot, eventHolder) {
            plot.getPlaceholder().unbind("resize", onResize);
        }
        
        plot.hooks.bindEvents.push(bindEvents);
        plot.hooks.shutdown.push(shutdown);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'resize',
        version: '1.0'
    });
})(jQuery);


/***/ }),

/***/ "./assets/bower_components/Flot/jquery.flot.time.js":
/*!**********************************************************!*\
  !*** ./assets/bower_components/Flot/jquery.flot.time.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Pretty handling of time axes.

Copyright (c) 2007-2014 IOLA and Ole Laursen.
Licensed under the MIT license.

Set axis.mode to "time" to enable. See the section "Time series data" in
API.txt for details.

*/

(function($) {

	var options = {
		xaxis: {
			timezone: null,		// "browser" for local to the client or timezone for timezone-js
			timeformat: null,	// format string to use
			twelveHourClock: false,	// 12 or 24 time in time mode
			monthNames: null	// list of names of months
		}
	};

	// round to nearby lower multiple of base

	function floorInBase(n, base) {
		return base * Math.floor(n / base);
	}

	// Returns a string with the date d formatted according to fmt.
	// A subset of the Open Group's strftime format is supported.

	function formatDate(d, fmt, monthNames, dayNames) {

		if (typeof d.strftime == "function") {
			return d.strftime(fmt);
		}

		var leftPad = function(n, pad) {
			n = "" + n;
			pad = "" + (pad == null ? "0" : pad);
			return n.length == 1 ? pad + n : n;
		};

		var r = [];
		var escape = false;
		var hours = d.getHours();
		var isAM = hours < 12;

		if (monthNames == null) {
			monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}

		if (dayNames == null) {
			dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		}

		var hours12;

		if (hours > 12) {
			hours12 = hours - 12;
		} else if (hours == 0) {
			hours12 = 12;
		} else {
			hours12 = hours;
		}

		for (var i = 0; i < fmt.length; ++i) {

			var c = fmt.charAt(i);

			if (escape) {
				switch (c) {
					case 'a': c = "" + dayNames[d.getDay()]; break;
					case 'b': c = "" + monthNames[d.getMonth()]; break;
					case 'd': c = leftPad(d.getDate()); break;
					case 'e': c = leftPad(d.getDate(), " "); break;
					case 'h':	// For back-compat with 0.7; remove in 1.0
					case 'H': c = leftPad(hours); break;
					case 'I': c = leftPad(hours12); break;
					case 'l': c = leftPad(hours12, " "); break;
					case 'm': c = leftPad(d.getMonth() + 1); break;
					case 'M': c = leftPad(d.getMinutes()); break;
					// quarters not in Open Group's strftime specification
					case 'q':
						c = "" + (Math.floor(d.getMonth() / 3) + 1); break;
					case 'S': c = leftPad(d.getSeconds()); break;
					case 'y': c = leftPad(d.getFullYear() % 100); break;
					case 'Y': c = "" + d.getFullYear(); break;
					case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
					case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
					case 'w': c = "" + d.getDay(); break;
				}
				r.push(c);
				escape = false;
			} else {
				if (c == "%") {
					escape = true;
				} else {
					r.push(c);
				}
			}
		}

		return r.join("");
	}

	// To have a consistent view of time-based data independent of which time
	// zone the client happens to be in we need a date-like object independent
	// of time zones.  This is done through a wrapper that only calls the UTC
	// versions of the accessor methods.

	function makeUtcWrapper(d) {

		function addProxyMethod(sourceObj, sourceMethod, targetObj, targetMethod) {
			sourceObj[sourceMethod] = function() {
				return targetObj[targetMethod].apply(targetObj, arguments);
			};
		};

		var utc = {
			date: d
		};

		// support strftime, if found

		if (d.strftime != undefined) {
			addProxyMethod(utc, "strftime", d, "strftime");
		}

		addProxyMethod(utc, "getTime", d, "getTime");
		addProxyMethod(utc, "setTime", d, "setTime");

		var props = ["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds"];

		for (var p = 0; p < props.length; p++) {
			addProxyMethod(utc, "get" + props[p], d, "getUTC" + props[p]);
			addProxyMethod(utc, "set" + props[p], d, "setUTC" + props[p]);
		}

		return utc;
	};

	// select time zone strategy.  This returns a date-like object tied to the
	// desired timezone

	function dateGenerator(ts, opts) {
		if (opts.timezone == "browser") {
			return new Date(ts);
		} else if (!opts.timezone || opts.timezone == "utc") {
			return makeUtcWrapper(new Date(ts));
		} else if (typeof timezoneJS != "undefined" && typeof timezoneJS.Date != "undefined") {
			var d = new timezoneJS.Date();
			// timezone-js is fickle, so be sure to set the time zone before
			// setting the time.
			d.setTimezone(opts.timezone);
			d.setTime(ts);
			return d;
		} else {
			return makeUtcWrapper(new Date(ts));
		}
	}
	
	// map of app. size of time units in milliseconds

	var timeUnitSize = {
		"second": 1000,
		"minute": 60 * 1000,
		"hour": 60 * 60 * 1000,
		"day": 24 * 60 * 60 * 1000,
		"month": 30 * 24 * 60 * 60 * 1000,
		"quarter": 3 * 30 * 24 * 60 * 60 * 1000,
		"year": 365.2425 * 24 * 60 * 60 * 1000
	};

	// the allowed tick sizes, after 1 year we use
	// an integer algorithm

	var baseSpec = [
		[1, "second"], [2, "second"], [5, "second"], [10, "second"],
		[30, "second"], 
		[1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],
		[30, "minute"], 
		[1, "hour"], [2, "hour"], [4, "hour"],
		[8, "hour"], [12, "hour"],
		[1, "day"], [2, "day"], [3, "day"],
		[0.25, "month"], [0.5, "month"], [1, "month"],
		[2, "month"]
	];

	// we don't know which variant(s) we'll need yet, but generating both is
	// cheap

	var specMonths = baseSpec.concat([[3, "month"], [6, "month"],
		[1, "year"]]);
	var specQuarters = baseSpec.concat([[1, "quarter"], [2, "quarter"],
		[1, "year"]]);

	function init(plot) {
		plot.hooks.processOptions.push(function (plot, options) {
			$.each(plot.getAxes(), function(axisName, axis) {

				var opts = axis.options;

				if (opts.mode == "time") {
					axis.tickGenerator = function(axis) {

						var ticks = [];
						var d = dateGenerator(axis.min, opts);
						var minSize = 0;

						// make quarter use a possibility if quarters are
						// mentioned in either of these options

						var spec = (opts.tickSize && opts.tickSize[1] ===
							"quarter") ||
							(opts.minTickSize && opts.minTickSize[1] ===
							"quarter") ? specQuarters : specMonths;

						if (opts.minTickSize != null) {
							if (typeof opts.tickSize == "number") {
								minSize = opts.tickSize;
							} else {
								minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
							}
						}

						for (var i = 0; i < spec.length - 1; ++i) {
							if (axis.delta < (spec[i][0] * timeUnitSize[spec[i][1]]
											  + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
								&& spec[i][0] * timeUnitSize[spec[i][1]] >= minSize) {
								break;
							}
						}

						var size = spec[i][0];
						var unit = spec[i][1];

						// special-case the possibility of several years

						if (unit == "year") {

							// if given a minTickSize in years, just use it,
							// ensuring that it's an integer

							if (opts.minTickSize != null && opts.minTickSize[1] == "year") {
								size = Math.floor(opts.minTickSize[0]);
							} else {

								var magn = Math.pow(10, Math.floor(Math.log(axis.delta / timeUnitSize.year) / Math.LN10));
								var norm = (axis.delta / timeUnitSize.year) / magn;

								if (norm < 1.5) {
									size = 1;
								} else if (norm < 3) {
									size = 2;
								} else if (norm < 7.5) {
									size = 5;
								} else {
									size = 10;
								}

								size *= magn;
							}

							// minimum size for years is 1

							if (size < 1) {
								size = 1;
							}
						}

						axis.tickSize = opts.tickSize || [size, unit];
						var tickSize = axis.tickSize[0];
						unit = axis.tickSize[1];

						var step = tickSize * timeUnitSize[unit];

						if (unit == "second") {
							d.setSeconds(floorInBase(d.getSeconds(), tickSize));
						} else if (unit == "minute") {
							d.setMinutes(floorInBase(d.getMinutes(), tickSize));
						} else if (unit == "hour") {
							d.setHours(floorInBase(d.getHours(), tickSize));
						} else if (unit == "month") {
							d.setMonth(floorInBase(d.getMonth(), tickSize));
						} else if (unit == "quarter") {
							d.setMonth(3 * floorInBase(d.getMonth() / 3,
								tickSize));
						} else if (unit == "year") {
							d.setFullYear(floorInBase(d.getFullYear(), tickSize));
						}

						// reset smaller components

						d.setMilliseconds(0);

						if (step >= timeUnitSize.minute) {
							d.setSeconds(0);
						}
						if (step >= timeUnitSize.hour) {
							d.setMinutes(0);
						}
						if (step >= timeUnitSize.day) {
							d.setHours(0);
						}
						if (step >= timeUnitSize.day * 4) {
							d.setDate(1);
						}
						if (step >= timeUnitSize.month * 2) {
							d.setMonth(floorInBase(d.getMonth(), 3));
						}
						if (step >= timeUnitSize.quarter * 2) {
							d.setMonth(floorInBase(d.getMonth(), 6));
						}
						if (step >= timeUnitSize.year) {
							d.setMonth(0);
						}

						var carry = 0;
						var v = Number.NaN;
						var prev;

						do {

							prev = v;
							v = d.getTime();
							ticks.push(v);

							if (unit == "month" || unit == "quarter") {
								if (tickSize < 1) {

									// a bit complicated - we'll divide the
									// month/quarter up but we need to take
									// care of fractions so we don't end up in
									// the middle of a day

									d.setDate(1);
									var start = d.getTime();
									d.setMonth(d.getMonth() +
										(unit == "quarter" ? 3 : 1));
									var end = d.getTime();
									d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
									carry = d.getHours();
									d.setHours(0);
								} else {
									d.setMonth(d.getMonth() +
										tickSize * (unit == "quarter" ? 3 : 1));
								}
							} else if (unit == "year") {
								d.setFullYear(d.getFullYear() + tickSize);
							} else {
								d.setTime(v + step);
							}
						} while (v < axis.max && v != prev);

						return ticks;
					};

					axis.tickFormatter = function (v, axis) {

						var d = dateGenerator(v, axis.options);

						// first check global format

						if (opts.timeformat != null) {
							return formatDate(d, opts.timeformat, opts.monthNames, opts.dayNames);
						}

						// possibly use quarters if quarters are mentioned in
						// any of these places

						var useQuarters = (axis.options.tickSize &&
								axis.options.tickSize[1] == "quarter") ||
							(axis.options.minTickSize &&
								axis.options.minTickSize[1] == "quarter");

						var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
						var span = axis.max - axis.min;
						var suffix = (opts.twelveHourClock) ? " %p" : "";
						var hourCode = (opts.twelveHourClock) ? "%I" : "%H";
						var fmt;

						if (t < timeUnitSize.minute) {
							fmt = hourCode + ":%M:%S" + suffix;
						} else if (t < timeUnitSize.day) {
							if (span < 2 * timeUnitSize.day) {
								fmt = hourCode + ":%M" + suffix;
							} else {
								fmt = "%b %d " + hourCode + ":%M" + suffix;
							}
						} else if (t < timeUnitSize.month) {
							fmt = "%b %d";
						} else if ((useQuarters && t < timeUnitSize.quarter) ||
							(!useQuarters && t < timeUnitSize.year)) {
							if (span < timeUnitSize.year) {
								fmt = "%b";
							} else {
								fmt = "%b %Y";
							}
						} else if (useQuarters && t < timeUnitSize.year) {
							if (span < timeUnitSize.year) {
								fmt = "Q%q";
							} else {
								fmt = "Q%q %Y";
							}
						} else {
							fmt = "%Y";
						}

						var rt = formatDate(d, fmt, opts.monthNames, opts.dayNames);

						return rt;
					};
				}
			});
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'time',
		version: '1.0'
	});

	// Time-axis support used to be in Flot core, which exposed the
	// formatDate function on the plot object.  Various plugins depend
	// on the function, so we need to re-expose it here.

	$.plot.formatDate = formatDate;
	$.plot.dateGenerator = dateGenerator;

})(jQuery);


/***/ }),

/***/ "./assets/bower_components/Ionicons/css/ionicons.min.css":
/*!***************************************************************!*\
  !*** ./assets/bower_components/Ionicons/css/ionicons.min.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css":
/*!********************************************************************************************!*\
  !*** ./assets/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js":
/*!******************************************************************************************!*\
  !*** ./assets/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Datepicker for Bootstrap v1.8.0 (https://github.com/uxsolutions/bootstrap-datepicker)
 *
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */

!function(a){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined}(function(a,b){function c(){return new Date(Date.UTC.apply(Date,arguments))}function d(){var a=new Date;return c(a.getFullYear(),a.getMonth(),a.getDate())}function e(a,b){return a.getUTCFullYear()===b.getUTCFullYear()&&a.getUTCMonth()===b.getUTCMonth()&&a.getUTCDate()===b.getUTCDate()}function f(c,d){return function(){return d!==b&&a.fn.datepicker.deprecated(d),this[c].apply(this,arguments)}}function g(a){return a&&!isNaN(a.getTime())}function h(b,c){function d(a,b){return b.toLowerCase()}var e,f=a(b).data(),g={},h=new RegExp("^"+c.toLowerCase()+"([A-Z])");c=new RegExp("^"+c.toLowerCase());for(var i in f)c.test(i)&&(e=i.replace(h,d),g[e]=f[i]);return g}function i(b){var c={};if(q[b]||(b=b.split("-")[0],q[b])){var d=q[b];return a.each(p,function(a,b){b in d&&(c[b]=d[b])}),c}}var j=function(){var b={get:function(a){return this.slice(a)[0]},contains:function(a){for(var b=a&&a.valueOf(),c=0,d=this.length;c<d;c++)if(0<=this[c].valueOf()-b&&this[c].valueOf()-b<864e5)return c;return-1},remove:function(a){this.splice(a,1)},replace:function(b){b&&(a.isArray(b)||(b=[b]),this.clear(),this.push.apply(this,b))},clear:function(){this.length=0},copy:function(){var a=new j;return a.replace(this),a}};return function(){var c=[];return c.push.apply(c,arguments),a.extend(c,b),c}}(),k=function(b,c){a.data(b,"datepicker",this),this._process_options(c),this.dates=new j,this.viewDate=this.o.defaultViewDate,this.focusDate=null,this.element=a(b),this.isInput=this.element.is("input"),this.inputField=this.isInput?this.element:this.element.find("input"),this.component=!!this.element.hasClass("date")&&this.element.find(".add-on, .input-group-addon, .btn"),this.component&&0===this.component.length&&(this.component=!1),this.isInline=!this.component&&this.element.is("div"),this.picker=a(r.template),this._check_template(this.o.templates.leftArrow)&&this.picker.find(".prev").html(this.o.templates.leftArrow),this._check_template(this.o.templates.rightArrow)&&this.picker.find(".next").html(this.o.templates.rightArrow),this._buildEvents(),this._attachEvents(),this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):this.picker.addClass("datepicker-dropdown dropdown-menu"),this.o.rtl&&this.picker.addClass("datepicker-rtl"),this.o.calendarWeeks&&this.picker.find(".datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan",function(a,b){return Number(b)+1}),this._process_options({startDate:this._o.startDate,endDate:this._o.endDate,daysOfWeekDisabled:this.o.daysOfWeekDisabled,daysOfWeekHighlighted:this.o.daysOfWeekHighlighted,datesDisabled:this.o.datesDisabled}),this._allow_update=!1,this.setViewMode(this.o.startView),this._allow_update=!0,this.fillDow(),this.fillMonths(),this.update(),this.isInline&&this.show()};k.prototype={constructor:k,_resolveViewName:function(b){return a.each(r.viewModes,function(c,d){if(b===c||a.inArray(b,d.names)!==-1)return b=c,!1}),b},_resolveDaysOfWeek:function(b){return a.isArray(b)||(b=b.split(/[,\s]*/)),a.map(b,Number)},_check_template:function(c){try{if(c===b||""===c)return!1;if((c.match(/[<>]/g)||[]).length<=0)return!0;var d=a(c);return d.length>0}catch(a){return!1}},_process_options:function(b){this._o=a.extend({},this._o,b);var e=this.o=a.extend({},this._o),f=e.language;q[f]||(f=f.split("-")[0],q[f]||(f=o.language)),e.language=f,e.startView=this._resolveViewName(e.startView),e.minViewMode=this._resolveViewName(e.minViewMode),e.maxViewMode=this._resolveViewName(e.maxViewMode),e.startView=Math.max(this.o.minViewMode,Math.min(this.o.maxViewMode,e.startView)),e.multidate!==!0&&(e.multidate=Number(e.multidate)||!1,e.multidate!==!1&&(e.multidate=Math.max(0,e.multidate))),e.multidateSeparator=String(e.multidateSeparator),e.weekStart%=7,e.weekEnd=(e.weekStart+6)%7;var g=r.parseFormat(e.format);e.startDate!==-(1/0)&&(e.startDate?e.startDate instanceof Date?e.startDate=this._local_to_utc(this._zero_time(e.startDate)):e.startDate=r.parseDate(e.startDate,g,e.language,e.assumeNearbyYear):e.startDate=-(1/0)),e.endDate!==1/0&&(e.endDate?e.endDate instanceof Date?e.endDate=this._local_to_utc(this._zero_time(e.endDate)):e.endDate=r.parseDate(e.endDate,g,e.language,e.assumeNearbyYear):e.endDate=1/0),e.daysOfWeekDisabled=this._resolveDaysOfWeek(e.daysOfWeekDisabled||[]),e.daysOfWeekHighlighted=this._resolveDaysOfWeek(e.daysOfWeekHighlighted||[]),e.datesDisabled=e.datesDisabled||[],a.isArray(e.datesDisabled)||(e.datesDisabled=e.datesDisabled.split(",")),e.datesDisabled=a.map(e.datesDisabled,function(a){return r.parseDate(a,g,e.language,e.assumeNearbyYear)});var h=String(e.orientation).toLowerCase().split(/\s+/g),i=e.orientation.toLowerCase();if(h=a.grep(h,function(a){return/^auto|left|right|top|bottom$/.test(a)}),e.orientation={x:"auto",y:"auto"},i&&"auto"!==i)if(1===h.length)switch(h[0]){case"top":case"bottom":e.orientation.y=h[0];break;case"left":case"right":e.orientation.x=h[0]}else i=a.grep(h,function(a){return/^left|right$/.test(a)}),e.orientation.x=i[0]||"auto",i=a.grep(h,function(a){return/^top|bottom$/.test(a)}),e.orientation.y=i[0]||"auto";else;if(e.defaultViewDate instanceof Date||"string"==typeof e.defaultViewDate)e.defaultViewDate=r.parseDate(e.defaultViewDate,g,e.language,e.assumeNearbyYear);else if(e.defaultViewDate){var j=e.defaultViewDate.year||(new Date).getFullYear(),k=e.defaultViewDate.month||0,l=e.defaultViewDate.day||1;e.defaultViewDate=c(j,k,l)}else e.defaultViewDate=d()},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(d=b,e=a[f][1]):3===a[f].length&&(d=a[f][1],e=a[f][2]),c.on(e,d)},_unapplyEvents:function(a){for(var c,d,e,f=0;f<a.length;f++)c=a[f][0],2===a[f].length?(e=b,d=a[f][1]):3===a[f].length&&(e=a[f][1],d=a[f][2]),c.off(d,e)},_buildEvents:function(){var b={keyup:a.proxy(function(b){a.inArray(b.keyCode,[27,37,39,38,40,32,13,9])===-1&&this.update()},this),keydown:a.proxy(this.keydown,this),paste:a.proxy(this.paste,this)};this.o.showOnFocus===!0&&(b.focus=a.proxy(this.show,this)),this.isInput?this._events=[[this.element,b]]:this.component&&this.inputField.length?this._events=[[this.inputField,b],[this.component,{click:a.proxy(this.show,this)}]]:this._events=[[this.element,{click:a.proxy(this.show,this),keydown:a.proxy(this.keydown,this)}]],this._events.push([this.element,"*",{blur:a.proxy(function(a){this._focused_from=a.target},this)}],[this.element,{blur:a.proxy(function(a){this._focused_from=a.target},this)}]),this.o.immediateUpdates&&this._events.push([this.element,{"changeYear changeMonth":a.proxy(function(a){this.update(a.date)},this)}]),this._secondaryEvents=[[this.picker,{click:a.proxy(this.click,this)}],[this.picker,".prev, .next",{click:a.proxy(this.navArrowsClick,this)}],[this.picker,".day:not(.disabled)",{click:a.proxy(this.dayCellClick,this)}],[a(window),{resize:a.proxy(this.place,this)}],[a(document),{"mousedown touchstart":a.proxy(function(a){this.element.is(a.target)||this.element.find(a.target).length||this.picker.is(a.target)||this.picker.find(a.target).length||this.isInline||this.hide()},this)}]]},_attachEvents:function(){this._detachEvents(),this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents(),this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(b,c){var d=c||this.dates.get(-1),e=this._utc_to_local(d);this.element.trigger({type:b,date:e,viewMode:this.viewMode,dates:a.map(this.dates,this._utc_to_local),format:a.proxy(function(a,b){0===arguments.length?(a=this.dates.length-1,b=this.o.format):"string"==typeof a&&(b=a,a=this.dates.length-1),b=b||this.o.format;var c=this.dates.get(a);return r.formatDate(c,b,this.o.language)},this)})},show:function(){if(!(this.inputField.prop("disabled")||this.inputField.prop("readonly")&&this.o.enableOnReadonly===!1))return this.isInline||this.picker.appendTo(this.o.container),this.place(),this.picker.show(),this._attachSecondaryEvents(),this._trigger("show"),(window.navigator.msMaxTouchPoints||"ontouchstart"in document)&&this.o.disableTouchKeyboard&&a(this.element).blur(),this},hide:function(){return this.isInline||!this.picker.is(":visible")?this:(this.focusDate=null,this.picker.hide().detach(),this._detachSecondaryEvents(),this.setViewMode(this.o.startView),this.o.forceParse&&this.inputField.val()&&this.setValue(),this._trigger("hide"),this)},destroy:function(){return this.hide(),this._detachEvents(),this._detachSecondaryEvents(),this.picker.remove(),delete this.element.data().datepicker,this.isInput||delete this.element.data().date,this},paste:function(b){var c;if(b.originalEvent.clipboardData&&b.originalEvent.clipboardData.types&&a.inArray("text/plain",b.originalEvent.clipboardData.types)!==-1)c=b.originalEvent.clipboardData.getData("text/plain");else{if(!window.clipboardData)return;c=window.clipboardData.getData("Text")}this.setDate(c),this.update(),b.preventDefault()},_utc_to_local:function(a){if(!a)return a;var b=new Date(a.getTime()+6e4*a.getTimezoneOffset());return b.getTimezoneOffset()!==a.getTimezoneOffset()&&(b=new Date(a.getTime()+6e4*b.getTimezoneOffset())),b},_local_to_utc:function(a){return a&&new Date(a.getTime()-6e4*a.getTimezoneOffset())},_zero_time:function(a){return a&&new Date(a.getFullYear(),a.getMonth(),a.getDate())},_zero_utc_time:function(a){return a&&c(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate())},getDates:function(){return a.map(this.dates,this._utc_to_local)},getUTCDates:function(){return a.map(this.dates,function(a){return new Date(a)})},getDate:function(){return this._utc_to_local(this.getUTCDate())},getUTCDate:function(){var a=this.dates.get(-1);return a!==b?new Date(a):null},clearDates:function(){this.inputField.val(""),this.update(),this._trigger("changeDate"),this.o.autoclose&&this.hide()},setDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;return this.update.apply(this,b),this._trigger("changeDate"),this.setValue(),this},setUTCDates:function(){var b=a.isArray(arguments[0])?arguments[0]:arguments;return this.setDates.apply(this,a.map(b,this._utc_to_local)),this},setDate:f("setDates"),setUTCDate:f("setUTCDates"),remove:f("destroy","Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead"),setValue:function(){var a=this.getFormattedDate();return this.inputField.val(a),this},getFormattedDate:function(c){c===b&&(c=this.o.format);var d=this.o.language;return a.map(this.dates,function(a){return r.formatDate(a,c,d)}).join(this.o.multidateSeparator)},getStartDate:function(){return this.o.startDate},setStartDate:function(a){return this._process_options({startDate:a}),this.update(),this.updateNavArrows(),this},getEndDate:function(){return this.o.endDate},setEndDate:function(a){return this._process_options({endDate:a}),this.update(),this.updateNavArrows(),this},setDaysOfWeekDisabled:function(a){return this._process_options({daysOfWeekDisabled:a}),this.update(),this},setDaysOfWeekHighlighted:function(a){return this._process_options({daysOfWeekHighlighted:a}),this.update(),this},setDatesDisabled:function(a){return this._process_options({datesDisabled:a}),this.update(),this},place:function(){if(this.isInline)return this;var b=this.picker.outerWidth(),c=this.picker.outerHeight(),d=10,e=a(this.o.container),f=e.width(),g="body"===this.o.container?a(document).scrollTop():e.scrollTop(),h=e.offset(),i=[0];this.element.parents().each(function(){var b=a(this).css("z-index");"auto"!==b&&0!==Number(b)&&i.push(Number(b))});var j=Math.max.apply(Math,i)+this.o.zIndexOffset,k=this.component?this.component.parent().offset():this.element.offset(),l=this.component?this.component.outerHeight(!0):this.element.outerHeight(!1),m=this.component?this.component.outerWidth(!0):this.element.outerWidth(!1),n=k.left-h.left,o=k.top-h.top;"body"!==this.o.container&&(o+=g),this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"),"auto"!==this.o.orientation.x?(this.picker.addClass("datepicker-orient-"+this.o.orientation.x),"right"===this.o.orientation.x&&(n-=b-m)):k.left<0?(this.picker.addClass("datepicker-orient-left"),n-=k.left-d):n+b>f?(this.picker.addClass("datepicker-orient-right"),n+=m-b):this.o.rtl?this.picker.addClass("datepicker-orient-right"):this.picker.addClass("datepicker-orient-left");var p,q=this.o.orientation.y;if("auto"===q&&(p=-g+o-c,q=p<0?"bottom":"top"),this.picker.addClass("datepicker-orient-"+q),"top"===q?o-=c+parseInt(this.picker.css("padding-top")):o+=l,this.o.rtl){var r=f-(n+m);this.picker.css({top:o,right:r,zIndex:j})}else this.picker.css({top:o,left:n,zIndex:j});return this},_allow_update:!0,update:function(){if(!this._allow_update)return this;var b=this.dates.copy(),c=[],d=!1;return arguments.length?(a.each(arguments,a.proxy(function(a,b){b instanceof Date&&(b=this._local_to_utc(b)),c.push(b)},this)),d=!0):(c=this.isInput?this.element.val():this.element.data("date")||this.inputField.val(),c=c&&this.o.multidate?c.split(this.o.multidateSeparator):[c],delete this.element.data().date),c=a.map(c,a.proxy(function(a){return r.parseDate(a,this.o.format,this.o.language,this.o.assumeNearbyYear)},this)),c=a.grep(c,a.proxy(function(a){return!this.dateWithinRange(a)||!a},this),!0),this.dates.replace(c),this.o.updateViewDate&&(this.dates.length?this.viewDate=new Date(this.dates.get(-1)):this.viewDate<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.viewDate>this.o.endDate?this.viewDate=new Date(this.o.endDate):this.viewDate=this.o.defaultViewDate),d?(this.setValue(),this.element.change()):this.dates.length&&String(b)!==String(this.dates)&&d&&(this._trigger("changeDate"),this.element.change()),!this.dates.length&&b.length&&(this._trigger("clearDate"),this.element.change()),this.fill(),this},fillDow:function(){if(this.o.showWeekDays){var b=this.o.weekStart,c="<tr>";for(this.o.calendarWeeks&&(c+='<th class="cw">&#160;</th>');b<this.o.weekStart+7;)c+='<th class="dow',a.inArray(b,this.o.daysOfWeekDisabled)!==-1&&(c+=" disabled"),c+='">'+q[this.o.language].daysMin[b++%7]+"</th>";c+="</tr>",this.picker.find(".datepicker-days thead").append(c)}},fillMonths:function(){for(var a,b=this._utc_to_local(this.viewDate),c="",d=0;d<12;d++)a=b&&b.getMonth()===d?" focused":"",c+='<span class="month'+a+'">'+q[this.o.language].monthsShort[d]+"</span>";this.picker.find(".datepicker-months td").html(c)},setRange:function(b){b&&b.length?this.range=a.map(b,function(a){return a.valueOf()}):delete this.range,this.fill()},getClassNames:function(b){var c=[],f=this.viewDate.getUTCFullYear(),g=this.viewDate.getUTCMonth(),h=d();return b.getUTCFullYear()<f||b.getUTCFullYear()===f&&b.getUTCMonth()<g?c.push("old"):(b.getUTCFullYear()>f||b.getUTCFullYear()===f&&b.getUTCMonth()>g)&&c.push("new"),this.focusDate&&b.valueOf()===this.focusDate.valueOf()&&c.push("focused"),this.o.todayHighlight&&e(b,h)&&c.push("today"),this.dates.contains(b)!==-1&&c.push("active"),this.dateWithinRange(b)||c.push("disabled"),this.dateIsDisabled(b)&&c.push("disabled","disabled-date"),a.inArray(b.getUTCDay(),this.o.daysOfWeekHighlighted)!==-1&&c.push("highlighted"),this.range&&(b>this.range[0]&&b<this.range[this.range.length-1]&&c.push("range"),a.inArray(b.valueOf(),this.range)!==-1&&c.push("selected"),b.valueOf()===this.range[0]&&c.push("range-start"),b.valueOf()===this.range[this.range.length-1]&&c.push("range-end")),c},_fill_yearsView:function(c,d,e,f,g,h,i){for(var j,k,l,m="",n=e/10,o=this.picker.find(c),p=Math.floor(f/e)*e,q=p+9*n,r=Math.floor(this.viewDate.getFullYear()/n)*n,s=a.map(this.dates,function(a){return Math.floor(a.getUTCFullYear()/n)*n}),t=p-n;t<=q+n;t+=n)j=[d],k=null,t===p-n?j.push("old"):t===q+n&&j.push("new"),a.inArray(t,s)!==-1&&j.push("active"),(t<g||t>h)&&j.push("disabled"),t===r&&j.push("focused"),i!==a.noop&&(l=i(new Date(t,0,1)),l===b?l={}:"boolean"==typeof l?l={enabled:l}:"string"==typeof l&&(l={classes:l}),l.enabled===!1&&j.push("disabled"),l.classes&&(j=j.concat(l.classes.split(/\s+/))),l.tooltip&&(k=l.tooltip)),m+='<span class="'+j.join(" ")+'"'+(k?' title="'+k+'"':"")+">"+t+"</span>";o.find(".datepicker-switch").text(p+"-"+q),o.find("td").html(m)},fill:function(){var d,e,f=new Date(this.viewDate),g=f.getUTCFullYear(),h=f.getUTCMonth(),i=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),j=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),k=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,l=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0,m=q[this.o.language].today||q.en.today||"",n=q[this.o.language].clear||q.en.clear||"",o=q[this.o.language].titleFormat||q.en.titleFormat;if(!isNaN(g)&&!isNaN(h)){this.picker.find(".datepicker-days .datepicker-switch").text(r.formatDate(f,o,this.o.language)),this.picker.find("tfoot .today").text(m).css("display",this.o.todayBtn===!0||"linked"===this.o.todayBtn?"table-cell":"none"),this.picker.find("tfoot .clear").text(n).css("display",this.o.clearBtn===!0?"table-cell":"none"),this.picker.find("thead .datepicker-title").text(this.o.title).css("display","string"==typeof this.o.title&&""!==this.o.title?"table-cell":"none"),this.updateNavArrows(),this.fillMonths();var p=c(g,h,0),s=p.getUTCDate();p.setUTCDate(s-(p.getUTCDay()-this.o.weekStart+7)%7);var t=new Date(p);p.getUTCFullYear()<100&&t.setUTCFullYear(p.getUTCFullYear()),t.setUTCDate(t.getUTCDate()+42),t=t.valueOf();for(var u,v,w=[];p.valueOf()<t;){if(u=p.getUTCDay(),u===this.o.weekStart&&(w.push("<tr>"),this.o.calendarWeeks)){var x=new Date(+p+(this.o.weekStart-u-7)%7*864e5),y=new Date(Number(x)+(11-x.getUTCDay())%7*864e5),z=new Date(Number(z=c(y.getUTCFullYear(),0,1))+(11-z.getUTCDay())%7*864e5),A=(y-z)/864e5/7+1;w.push('<td class="cw">'+A+"</td>")}v=this.getClassNames(p),v.push("day");var B=p.getUTCDate();this.o.beforeShowDay!==a.noop&&(e=this.o.beforeShowDay(this._utc_to_local(p)),e===b?e={}:"boolean"==typeof e?e={enabled:e}:"string"==typeof e&&(e={classes:e}),e.enabled===!1&&v.push("disabled"),e.classes&&(v=v.concat(e.classes.split(/\s+/))),e.tooltip&&(d=e.tooltip),e.content&&(B=e.content)),v=a.isFunction(a.uniqueSort)?a.uniqueSort(v):a.unique(v),w.push('<td class="'+v.join(" ")+'"'+(d?' title="'+d+'"':"")+' data-date="'+p.getTime().toString()+'">'+B+"</td>"),d=null,u===this.o.weekEnd&&w.push("</tr>"),p.setUTCDate(p.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").html(w.join(""));var C=q[this.o.language].monthsTitle||q.en.monthsTitle||"Months",D=this.picker.find(".datepicker-months").find(".datepicker-switch").text(this.o.maxViewMode<2?C:g).end().find("tbody span").removeClass("active");if(a.each(this.dates,function(a,b){b.getUTCFullYear()===g&&D.eq(b.getUTCMonth()).addClass("active")}),(g<i||g>k)&&D.addClass("disabled"),g===i&&D.slice(0,j).addClass("disabled"),g===k&&D.slice(l+1).addClass("disabled"),this.o.beforeShowMonth!==a.noop){var E=this;a.each(D,function(c,d){var e=new Date(g,c,1),f=E.o.beforeShowMonth(e);f===b?f={}:"boolean"==typeof f?f={enabled:f}:"string"==typeof f&&(f={classes:f}),f.enabled!==!1||a(d).hasClass("disabled")||a(d).addClass("disabled"),f.classes&&a(d).addClass(f.classes),f.tooltip&&a(d).prop("title",f.tooltip)})}this._fill_yearsView(".datepicker-years","year",10,g,i,k,this.o.beforeShowYear),this._fill_yearsView(".datepicker-decades","decade",100,g,i,k,this.o.beforeShowDecade),this._fill_yearsView(".datepicker-centuries","century",1e3,g,i,k,this.o.beforeShowCentury)}},updateNavArrows:function(){if(this._allow_update){var a,b,c=new Date(this.viewDate),d=c.getUTCFullYear(),e=c.getUTCMonth(),f=this.o.startDate!==-(1/0)?this.o.startDate.getUTCFullYear():-(1/0),g=this.o.startDate!==-(1/0)?this.o.startDate.getUTCMonth():-(1/0),h=this.o.endDate!==1/0?this.o.endDate.getUTCFullYear():1/0,i=this.o.endDate!==1/0?this.o.endDate.getUTCMonth():1/0,j=1;switch(this.viewMode){case 4:j*=10;case 3:j*=10;case 2:j*=10;case 1:a=Math.floor(d/j)*j<f,b=Math.floor(d/j)*j+j>h;break;case 0:a=d<=f&&e<g,b=d>=h&&e>i}this.picker.find(".prev").toggleClass("disabled",a),this.picker.find(".next").toggleClass("disabled",b)}},click:function(b){b.preventDefault(),b.stopPropagation();var e,f,g,h;e=a(b.target),e.hasClass("datepicker-switch")&&this.viewMode!==this.o.maxViewMode&&this.setViewMode(this.viewMode+1),e.hasClass("today")&&!e.hasClass("day")&&(this.setViewMode(0),this._setDate(d(),"linked"===this.o.todayBtn?null:"view")),e.hasClass("clear")&&this.clearDates(),e.hasClass("disabled")||(e.hasClass("month")||e.hasClass("year")||e.hasClass("decade")||e.hasClass("century"))&&(this.viewDate.setUTCDate(1),f=1,1===this.viewMode?(h=e.parent().find("span").index(e),g=this.viewDate.getUTCFullYear(),this.viewDate.setUTCMonth(h)):(h=0,g=Number(e.text()),this.viewDate.setUTCFullYear(g)),this._trigger(r.viewModes[this.viewMode-1].e,this.viewDate),this.viewMode===this.o.minViewMode?this._setDate(c(g,h,f)):(this.setViewMode(this.viewMode-1),this.fill())),this.picker.is(":visible")&&this._focused_from&&this._focused_from.focus(),delete this._focused_from},dayCellClick:function(b){var c=a(b.currentTarget),d=c.data("date"),e=new Date(d);this.o.updateViewDate&&(e.getUTCFullYear()!==this.viewDate.getUTCFullYear()&&this._trigger("changeYear",this.viewDate),e.getUTCMonth()!==this.viewDate.getUTCMonth()&&this._trigger("changeMonth",this.viewDate)),this._setDate(e)},navArrowsClick:function(b){var c=a(b.currentTarget),d=c.hasClass("prev")?-1:1;0!==this.viewMode&&(d*=12*r.viewModes[this.viewMode].navStep),this.viewDate=this.moveMonth(this.viewDate,d),this._trigger(r.viewModes[this.viewMode].e,this.viewDate),this.fill()},_toggle_multidate:function(a){var b=this.dates.contains(a);if(a||this.dates.clear(),b!==-1?(this.o.multidate===!0||this.o.multidate>1||this.o.toggleActive)&&this.dates.remove(b):this.o.multidate===!1?(this.dates.clear(),this.dates.push(a)):this.dates.push(a),"number"==typeof this.o.multidate)for(;this.dates.length>this.o.multidate;)this.dates.remove(0)},_setDate:function(a,b){b&&"date"!==b||this._toggle_multidate(a&&new Date(a)),(!b&&this.o.updateViewDate||"view"===b)&&(this.viewDate=a&&new Date(a)),this.fill(),this.setValue(),b&&"view"===b||this._trigger("changeDate"),this.inputField.trigger("change"),!this.o.autoclose||b&&"date"!==b||this.hide()},moveDay:function(a,b){var c=new Date(a);return c.setUTCDate(a.getUTCDate()+b),c},moveWeek:function(a,b){return this.moveDay(a,7*b)},moveMonth:function(a,b){if(!g(a))return this.o.defaultViewDate;if(!b)return a;var c,d,e=new Date(a.valueOf()),f=e.getUTCDate(),h=e.getUTCMonth(),i=Math.abs(b);if(b=b>0?1:-1,1===i)d=b===-1?function(){return e.getUTCMonth()===h}:function(){return e.getUTCMonth()!==c},c=h+b,e.setUTCMonth(c),c=(c+12)%12;else{for(var j=0;j<i;j++)e=this.moveMonth(e,b);c=e.getUTCMonth(),e.setUTCDate(f),d=function(){return c!==e.getUTCMonth()}}for(;d();)e.setUTCDate(--f),e.setUTCMonth(c);return e},moveYear:function(a,b){return this.moveMonth(a,12*b)},moveAvailableDate:function(a,b,c){do{if(a=this[c](a,b),!this.dateWithinRange(a))return!1;c="moveDay"}while(this.dateIsDisabled(a));return a},weekOfDateIsDisabled:function(b){return a.inArray(b.getUTCDay(),this.o.daysOfWeekDisabled)!==-1},dateIsDisabled:function(b){return this.weekOfDateIsDisabled(b)||a.grep(this.o.datesDisabled,function(a){return e(b,a)}).length>0},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(!this.picker.is(":visible"))return void(40!==a.keyCode&&27!==a.keyCode||(this.show(),a.stopPropagation()));var b,c,d=!1,e=this.focusDate||this.viewDate;switch(a.keyCode){case 27:this.focusDate?(this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill()):this.hide(),a.preventDefault(),a.stopPropagation();break;case 37:case 38:case 39:case 40:if(!this.o.keyboardNavigation||7===this.o.daysOfWeekDisabled.length)break;b=37===a.keyCode||38===a.keyCode?-1:1,0===this.viewMode?a.ctrlKey?(c=this.moveAvailableDate(e,b,"moveYear"),c&&this._trigger("changeYear",this.viewDate)):a.shiftKey?(c=this.moveAvailableDate(e,b,"moveMonth"),c&&this._trigger("changeMonth",this.viewDate)):37===a.keyCode||39===a.keyCode?c=this.moveAvailableDate(e,b,"moveDay"):this.weekOfDateIsDisabled(e)||(c=this.moveAvailableDate(e,b,"moveWeek")):1===this.viewMode?(38!==a.keyCode&&40!==a.keyCode||(b*=4),c=this.moveAvailableDate(e,b,"moveMonth")):2===this.viewMode&&(38!==a.keyCode&&40!==a.keyCode||(b*=4),c=this.moveAvailableDate(e,b,"moveYear")),c&&(this.focusDate=this.viewDate=c,this.setValue(),this.fill(),a.preventDefault());break;case 13:if(!this.o.forceParse)break;e=this.focusDate||this.dates.get(-1)||this.viewDate,this.o.keyboardNavigation&&(this._toggle_multidate(e),d=!0),this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.setValue(),this.fill(),this.picker.is(":visible")&&(a.preventDefault(),a.stopPropagation(),this.o.autoclose&&this.hide());break;case 9:this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill(),this.hide()}d&&(this.dates.length?this._trigger("changeDate"):this._trigger("clearDate"),this.inputField.trigger("change"))},setViewMode:function(a){this.viewMode=a,this.picker.children("div").hide().filter(".datepicker-"+r.viewModes[this.viewMode].clsName).show(),this.updateNavArrows(),this._trigger("changeViewMode",new Date(this.viewDate))}};var l=function(b,c){a.data(b,"datepicker",this),this.element=a(b),this.inputs=a.map(c.inputs,function(a){return a.jquery?a[0]:a}),delete c.inputs,this.keepEmptyValues=c.keepEmptyValues,delete c.keepEmptyValues,n.call(a(this.inputs),c).on("changeDate",a.proxy(this.dateUpdated,this)),this.pickers=a.map(this.inputs,function(b){return a.data(b,"datepicker")}),this.updateDates()};l.prototype={updateDates:function(){this.dates=a.map(this.pickers,function(a){return a.getUTCDate()}),this.updateRanges()},updateRanges:function(){var b=a.map(this.dates,function(a){return a.valueOf()});a.each(this.pickers,function(a,c){c.setRange(b)})},clearDates:function(){a.each(this.pickers,function(a,b){b.clearDates()})},dateUpdated:function(c){if(!this.updating){this.updating=!0;var d=a.data(c.target,"datepicker");if(d!==b){var e=d.getUTCDate(),f=this.keepEmptyValues,g=a.inArray(c.target,this.inputs),h=g-1,i=g+1,j=this.inputs.length;if(g!==-1){if(a.each(this.pickers,function(a,b){b.getUTCDate()||b!==d&&f||b.setUTCDate(e)}),e<this.dates[h])for(;h>=0&&e<this.dates[h];)this.pickers[h--].setUTCDate(e);else if(e>this.dates[i])for(;i<j&&e>this.dates[i];)this.pickers[i++].setUTCDate(e);this.updateDates(),delete this.updating}}}},destroy:function(){a.map(this.pickers,function(a){a.destroy()}),a(this.inputs).off("changeDate",this.dateUpdated),delete this.element.data().datepicker},remove:f("destroy","Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead")};var m=a.fn.datepicker,n=function(c){var d=Array.apply(null,arguments);d.shift();var e;if(this.each(function(){var b=a(this),f=b.data("datepicker"),g="object"==typeof c&&c;if(!f){var j=h(this,"date"),m=a.extend({},o,j,g),n=i(m.language),p=a.extend({},o,n,j,g);b.hasClass("input-daterange")||p.inputs?(a.extend(p,{inputs:p.inputs||b.find("input").toArray()}),f=new l(this,p)):f=new k(this,p),b.data("datepicker",f)}"string"==typeof c&&"function"==typeof f[c]&&(e=f[c].apply(f,d))}),e===b||e instanceof k||e instanceof l)return this;if(this.length>1)throw new Error("Using only allowed for the collection of a single element ("+c+" function)");return e};a.fn.datepicker=n;var o=a.fn.datepicker.defaults={assumeNearbyYear:!1,autoclose:!1,beforeShowDay:a.noop,beforeShowMonth:a.noop,beforeShowYear:a.noop,beforeShowDecade:a.noop,beforeShowCentury:a.noop,calendarWeeks:!1,clearBtn:!1,toggleActive:!1,daysOfWeekDisabled:[],daysOfWeekHighlighted:[],datesDisabled:[],endDate:1/0,forceParse:!0,format:"mm/dd/yyyy",keepEmptyValues:!1,keyboardNavigation:!0,language:"en",minViewMode:0,maxViewMode:4,multidate:!1,multidateSeparator:",",orientation:"auto",rtl:!1,startDate:-(1/0),startView:0,todayBtn:!1,todayHighlight:!1,updateViewDate:!0,weekStart:0,disableTouchKeyboard:!1,enableOnReadonly:!0,showOnFocus:!0,zIndexOffset:10,container:"body",immediateUpdates:!1,title:"",templates:{leftArrow:"&#x00AB;",rightArrow:"&#x00BB;"},showWeekDays:!0},p=a.fn.datepicker.locale_opts=["format","rtl","weekStart"];a.fn.datepicker.Constructor=k;var q=a.fn.datepicker.dates={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear",titleFormat:"MM yyyy"}},r={viewModes:[{names:["days","month"],clsName:"days",e:"changeMonth"},{names:["months","year"],clsName:"months",e:"changeYear",navStep:1},{names:["years","decade"],clsName:"years",e:"changeDecade",navStep:10},{names:["decades","century"],clsName:"decades",e:"changeCentury",navStep:100},{names:["centuries","millennium"],clsName:"centuries",e:"changeMillennium",navStep:1e3}],validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,parseFormat:function(a){if("function"==typeof a.toValue&&"function"==typeof a.toDisplay)return a;var b=a.replace(this.validParts,"\0").split("\0"),c=a.match(this.validParts);if(!b||!b.length||!c||0===c.length)throw new Error("Invalid date format.");return{separators:b,parts:c}},parseDate:function(c,e,f,g){function h(a,b){return b===!0&&(b=10),a<100&&(a+=2e3,a>(new Date).getFullYear()+b&&(a-=100)),a}function i(){var a=this.slice(0,j[n].length),b=j[n].slice(0,a.length);return a.toLowerCase()===b.toLowerCase()}if(!c)return b;if(c instanceof Date)return c;if("string"==typeof e&&(e=r.parseFormat(e)),e.toValue)return e.toValue(c,e,f);var j,l,m,n,o,p={d:"moveDay",m:"moveMonth",w:"moveWeek",y:"moveYear"},s={yesterday:"-1d",today:"+0d",tomorrow:"+1d"};if(c in s&&(c=s[c]),/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(c)){for(j=c.match(/([\-+]\d+)([dmwy])/gi),c=new Date,n=0;n<j.length;n++)l=j[n].match(/([\-+]\d+)([dmwy])/i),m=Number(l[1]),o=p[l[2].toLowerCase()],c=k.prototype[o](c,m);return k.prototype._zero_utc_time(c)}j=c&&c.match(this.nonpunctuation)||[];var t,u,v={},w=["yyyy","yy","M","MM","m","mm","d","dd"],x={yyyy:function(a,b){return a.setUTCFullYear(g?h(b,g):b)},m:function(a,b){if(isNaN(a))return a;for(b-=1;b<0;)b+=12;for(b%=12,a.setUTCMonth(b);a.getUTCMonth()!==b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};x.yy=x.yyyy,x.M=x.MM=x.mm=x.m,x.dd=x.d,c=d();var y=e.parts.slice();if(j.length!==y.length&&(y=a(y).filter(function(b,c){return a.inArray(c,w)!==-1}).toArray()),j.length===y.length){var z;for(n=0,z=y.length;n<z;n++){if(t=parseInt(j[n],10),l=y[n],isNaN(t))switch(l){case"MM":u=a(q[f].months).filter(i),t=a.inArray(u[0],q[f].months)+1;break;case"M":u=a(q[f].monthsShort).filter(i),t=a.inArray(u[0],q[f].monthsShort)+1}v[l]=t}var A,B;for(n=0;n<w.length;n++)B=w[n],B in v&&!isNaN(v[B])&&(A=new Date(c),x[B](A,v[B]),isNaN(A)||(c=A))}return c},formatDate:function(b,c,d){if(!b)return"";if("string"==typeof c&&(c=r.parseFormat(c)),c.toDisplay)return c.toDisplay(b,c,d);var e={d:b.getUTCDate(),D:q[d].daysShort[b.getUTCDay()],DD:q[d].days[b.getUTCDay()],m:b.getUTCMonth()+1,M:q[d].monthsShort[b.getUTCMonth()],MM:q[d].months[b.getUTCMonth()],yy:b.getUTCFullYear().toString().substring(2),yyyy:b.getUTCFullYear()};e.dd=(e.d<10?"0":"")+e.d,e.mm=(e.m<10?"0":"")+e.m,b=[];for(var f=a.extend([],c.separators),g=0,h=c.parts.length;g<=h;g++)f.length&&b.push(f.shift()),b.push(e[c.parts[g]]);return b.join("")},headTemplate:'<thead><tr><th colspan="7" class="datepicker-title"></th></tr><tr><th class="prev">'+o.templates.leftArrow+'</th><th colspan="5" class="datepicker-switch"></th><th class="next">'+o.templates.rightArrow+"</th></tr></thead>",
contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};r.template='<div class="datepicker"><div class="datepicker-days"><table class="table-condensed">'+r.headTemplate+"<tbody></tbody>"+r.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-decades"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+'</table></div><div class="datepicker-centuries"><table class="table-condensed">'+r.headTemplate+r.contTemplate+r.footTemplate+"</table></div></div>",a.fn.datepicker.DPGlobal=r,a.fn.datepicker.noConflict=function(){return a.fn.datepicker=m,this},a.fn.datepicker.version="1.8.0",a.fn.datepicker.deprecated=function(a){var b=window.console;b&&b.warn&&b.warn("DEPRECATED: "+a)},a(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(b){var c=a(this);c.data("datepicker")||(b.preventDefault(),n.call(c,"show"))}),a(function(){n.call(a('[data-provide="datepicker-inline"]'))})});

/***/ }),

/***/ "./assets/bower_components/bootstrap/dist/css/bootstrap-theme.min.css":
/*!****************************************************************************!*\
  !*** ./assets/bower_components/bootstrap/dist/css/bootstrap-theme.min.css ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/bower_components/bootstrap/dist/css/bootstrap.min.css":
/*!**********************************************************************!*\
  !*** ./assets/bower_components/bootstrap/dist/css/bootstrap.min.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/bower_components/bootstrap/dist/js/bootstrap.min.js":
/*!********************************************************************!*\
  !*** ./assets/bower_components/bootstrap/dist/js/bootstrap.min.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");!function(t){"use strict";var e=jQuery.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||3<e[0])throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(),function(n){"use strict";n.fn.emulateTransitionEnd=function(t){var e=!1,i=this;n(this).one("bsTransitionEnd",function(){e=!0});return setTimeout(function(){e||n(i).trigger(n.support.transition.end)},t),this},n(function(){n.support.transition=function o(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in e)if(t.style[i]!==undefined)return{end:e[i]};return!1}(),n.support.transition&&(n.event.special.bsTransitionEnd={bindType:n.support.transition.end,delegateType:n.support.transition.end,handle:function(t){if(n(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}})})}(jQuery),function(s){"use strict";var e='[data-dismiss="alert"]',a=function(t){s(t).on("click",e,this.close)};a.VERSION="3.4.1",a.TRANSITION_DURATION=150,a.prototype.close=function(t){var e=s(this),i=e.attr("data-target");i||(i=(i=e.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),i="#"===i?[]:i;var o=s(document).find(i);function n(){o.detach().trigger("closed.bs.alert").remove()}t&&t.preventDefault(),o.length||(o=e.closest(".alert")),o.trigger(t=s.Event("close.bs.alert")),t.isDefaultPrevented()||(o.removeClass("in"),s.support.transition&&o.hasClass("fade")?o.one("bsTransitionEnd",n).emulateTransitionEnd(a.TRANSITION_DURATION):n())};var t=s.fn.alert;s.fn.alert=function o(i){return this.each(function(){var t=s(this),e=t.data("bs.alert");e||t.data("bs.alert",e=new a(this)),"string"==typeof i&&e[i].call(t)})},s.fn.alert.Constructor=a,s.fn.alert.noConflict=function(){return s.fn.alert=t,this},s(document).on("click.bs.alert.data-api",e,a.prototype.close)}(jQuery),function(s){"use strict";var n=function(t,e){this.$element=s(t),this.options=s.extend({},n.DEFAULTS,e),this.isLoading=!1};function i(o){return this.each(function(){var t=s(this),e=t.data("bs.button"),i="object"==typeof o&&o;e||t.data("bs.button",e=new n(this,i)),"toggle"==o?e.toggle():o&&e.setState(o)})}n.VERSION="3.4.1",n.DEFAULTS={loadingText:"loading..."},n.prototype.setState=function(t){var e="disabled",i=this.$element,o=i.is("input")?"val":"html",n=i.data();t+="Text",null==n.resetText&&i.data("resetText",i[o]()),setTimeout(s.proxy(function(){i[o](null==n[t]?this.options[t]:n[t]),"loadingText"==t?(this.isLoading=!0,i.addClass(e).attr(e,e).prop(e,!0)):this.isLoading&&(this.isLoading=!1,i.removeClass(e).removeAttr(e).prop(e,!1))},this),0)},n.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var i=this.$element.find("input");"radio"==i.prop("type")?(i.prop("checked")&&(t=!1),e.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==i.prop("type")&&(i.prop("checked")!==this.$element.hasClass("active")&&(t=!1),this.$element.toggleClass("active")),i.prop("checked",this.$element.hasClass("active")),t&&i.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var t=s.fn.button;s.fn.button=i,s.fn.button.Constructor=n,s.fn.button.noConflict=function(){return s.fn.button=t,this},s(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(t){var e=s(t.target).closest(".btn");i.call(e,"toggle"),s(t.target).is('input[type="radio"], input[type="checkbox"]')||(t.preventDefault(),e.is("input,button")?e.trigger("focus"):e.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(t){s(t.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(t.type))})}(jQuery),function(p){"use strict";var c=function(t,e){this.$element=p(t),this.$indicators=this.$element.find(".carousel-indicators"),this.options=e,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",p.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",p.proxy(this.pause,this)).on("mouseleave.bs.carousel",p.proxy(this.cycle,this))};function r(n){return this.each(function(){var t=p(this),e=t.data("bs.carousel"),i=p.extend({},c.DEFAULTS,t.data(),"object"==typeof n&&n),o="string"==typeof n?n:i.slide;e||t.data("bs.carousel",e=new c(this,i)),"number"==typeof n?e.to(n):o?e[o]():i.interval&&e.pause().cycle()})}c.VERSION="3.4.1",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(t){if(!/input|textarea/i.test(t.target.tagName)){switch(t.which){case 37:this.prev();break;case 39:this.next();break;default:return}t.preventDefault()}},c.prototype.cycle=function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(p.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(t){return this.$items=t.parent().children(".item"),this.$items.index(t||this.$active)},c.prototype.getItemForDirection=function(t,e){var i=this.getItemIndex(e);if(("prev"==t&&0===i||"next"==t&&i==this.$items.length-1)&&!this.options.wrap)return e;var o=(i+("prev"==t?-1:1))%this.$items.length;return this.$items.eq(o)},c.prototype.to=function(t){var e=this,i=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(t>this.$items.length-1||t<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){e.to(t)}):i==t?this.pause().cycle():this.slide(i<t?"next":"prev",this.$items.eq(t))},c.prototype.pause=function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&p.support.transition&&(this.$element.trigger(p.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(t,e){var i=this.$element.find(".item.active"),o=e||this.getItemForDirection(t,i),n=this.interval,s="next"==t?"left":"right",a=this;if(o.hasClass("active"))return this.sliding=!1;var r=o[0],l=p.Event("slide.bs.carousel",{relatedTarget:r,direction:s});if(this.$element.trigger(l),!l.isDefaultPrevented()){if(this.sliding=!0,n&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var h=p(this.$indicators.children()[this.getItemIndex(o)]);h&&h.addClass("active")}var d=p.Event("slid.bs.carousel",{relatedTarget:r,direction:s});return p.support.transition&&this.$element.hasClass("slide")?(o.addClass(t),"object"==typeof o&&o.length&&o[0].offsetWidth,i.addClass(s),o.addClass(s),i.one("bsTransitionEnd",function(){o.removeClass([t,s].join(" ")).addClass("active"),i.removeClass(["active",s].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger(d)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(i.removeClass("active"),o.addClass("active"),this.sliding=!1,this.$element.trigger(d)),n&&this.cycle(),this}};var t=p.fn.carousel;p.fn.carousel=r,p.fn.carousel.Constructor=c,p.fn.carousel.noConflict=function(){return p.fn.carousel=t,this};var e=function(t){var e=p(this),i=e.attr("href");i&&(i=i.replace(/.*(?=#[^\s]+$)/,""));var o=e.attr("data-target")||i,n=p(document).find(o);if(n.hasClass("carousel")){var s=p.extend({},n.data(),e.data()),a=e.attr("data-slide-to");a&&(s.interval=!1),r.call(n,s),a&&n.data("bs.carousel").to(a),t.preventDefault()}};p(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),p(window).on("load",function(){p('[data-ride="carousel"]').each(function(){var t=p(this);r.call(t,t.data())})})}(jQuery),function(a){"use strict";var r=function(t,e){this.$element=a(t),this.options=a.extend({},r.DEFAULTS,e),this.$trigger=a('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};function n(t){var e,i=t.attr("data-target")||(e=t.attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"");return a(document).find(i)}function l(o){return this.each(function(){var t=a(this),e=t.data("bs.collapse"),i=a.extend({},r.DEFAULTS,t.data(),"object"==typeof o&&o);!e&&i.toggle&&/show|hide/.test(o)&&(i.toggle=!1),e||t.data("bs.collapse",e=new r(this,i)),"string"==typeof o&&e[o]()})}r.VERSION="3.4.1",r.TRANSITION_DURATION=350,r.DEFAULTS={toggle:!0},r.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},r.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var t,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(t=e.data("bs.collapse"))&&t.transitioning)){var i=a.Event("show.bs.collapse");if(this.$element.trigger(i),!i.isDefaultPrevented()){e&&e.length&&(l.call(e,"hide"),t||e.data("bs.collapse",null));var o=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[o](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var n=function(){this.$element.removeClass("collapsing").addClass("collapse in")[o](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return n.call(this);var s=a.camelCase(["scroll",o].join("-"));this.$element.one("bsTransitionEnd",a.proxy(n,this)).emulateTransitionEnd(r.TRANSITION_DURATION)[o](this.$element[0][s])}}}},r.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var t=a.Event("hide.bs.collapse");if(this.$element.trigger(t),!t.isDefaultPrevented()){var e=this.dimension();this.$element[e](this.$element[e]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var i=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};if(!a.support.transition)return i.call(this);this.$element[e](0).one("bsTransitionEnd",a.proxy(i,this)).emulateTransitionEnd(r.TRANSITION_DURATION)}}},r.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},r.prototype.getParent=function(){return a(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(t,e){var i=a(e);this.addAriaAndCollapsedClass(n(i),i)},this)).end()},r.prototype.addAriaAndCollapsedClass=function(t,e){var i=t.hasClass("in");t.attr("aria-expanded",i),e.toggleClass("collapsed",!i).attr("aria-expanded",i)};var t=a.fn.collapse;a.fn.collapse=l,a.fn.collapse.Constructor=r,a.fn.collapse.noConflict=function(){return a.fn.collapse=t,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(t){var e=a(this);e.attr("data-target")||t.preventDefault();var i=n(e),o=i.data("bs.collapse")?"toggle":e.data();l.call(i,o)})}(jQuery),function(a){"use strict";var r='[data-toggle="dropdown"]',o=function(t){a(t).on("click.bs.dropdown",this.toggle)};function l(t){var e=t.attr("data-target");e||(e=(e=t.attr("href"))&&/#[A-Za-z]/.test(e)&&e.replace(/.*(?=#[^\s]*$)/,""));var i="#"!==e?a(document).find(e):null;return i&&i.length?i:t.parent()}function s(o){o&&3===o.which||(a(".dropdown-backdrop").remove(),a(r).each(function(){var t=a(this),e=l(t),i={relatedTarget:this};e.hasClass("open")&&(o&&"click"==o.type&&/input|textarea/i.test(o.target.tagName)&&a.contains(e[0],o.target)||(e.trigger(o=a.Event("hide.bs.dropdown",i)),o.isDefaultPrevented()||(t.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",i)))))}))}o.VERSION="3.4.1",o.prototype.toggle=function(t){var e=a(this);if(!e.is(".disabled, :disabled")){var i=l(e),o=i.hasClass("open");if(s(),!o){"ontouchstart"in document.documentElement&&!i.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",s);var n={relatedTarget:this};if(i.trigger(t=a.Event("show.bs.dropdown",n)),t.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),i.toggleClass("open").trigger(a.Event("shown.bs.dropdown",n))}return!1}},o.prototype.keydown=function(t){if(/(38|40|27|32)/.test(t.which)&&!/input|textarea/i.test(t.target.tagName)){var e=a(this);if(t.preventDefault(),t.stopPropagation(),!e.is(".disabled, :disabled")){var i=l(e),o=i.hasClass("open");if(!o&&27!=t.which||o&&27==t.which)return 27==t.which&&i.find(r).trigger("focus"),e.trigger("click");var n=i.find(".dropdown-menu li:not(.disabled):visible a");if(n.length){var s=n.index(t.target);38==t.which&&0<s&&s--,40==t.which&&s<n.length-1&&s++,~s||(s=0),n.eq(s).trigger("focus")}}}};var t=a.fn.dropdown;a.fn.dropdown=function e(i){return this.each(function(){var t=a(this),e=t.data("bs.dropdown");e||t.data("bs.dropdown",e=new o(this)),"string"==typeof i&&e[i].call(t)})},a.fn.dropdown.Constructor=o,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=t,this},a(document).on("click.bs.dropdown.data-api",s).on("click.bs.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.bs.dropdown.data-api",r,o.prototype.toggle).on("keydown.bs.dropdown.data-api",r,o.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",o.prototype.keydown)}(jQuery),function(a){"use strict";var s=function(t,e){this.options=e,this.$body=a(document.body),this.$element=a(t),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.fixedContent=".navbar-fixed-top, .navbar-fixed-bottom",this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};function r(o,n){return this.each(function(){var t=a(this),e=t.data("bs.modal"),i=a.extend({},s.DEFAULTS,t.data(),"object"==typeof o&&o);e||t.data("bs.modal",e=new s(this,i)),"string"==typeof o?e[o](n):i.show&&e.show(n)})}s.VERSION="3.4.1",s.TRANSITION_DURATION=300,s.BACKDROP_TRANSITION_DURATION=150,s.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},s.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},s.prototype.show=function(i){var o=this,t=a.Event("show.bs.modal",{relatedTarget:i});this.$element.trigger(t),this.isShown||t.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){o.$element.one("mouseup.dismiss.bs.modal",function(t){a(t.target).is(o.$element)&&(o.ignoreBackdropClick=!0)})}),this.backdrop(function(){var t=a.support.transition&&o.$element.hasClass("fade");o.$element.parent().length||o.$element.appendTo(o.$body),o.$element.show().scrollTop(0),o.adjustDialog(),t&&o.$element[0].offsetWidth,o.$element.addClass("in"),o.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:i});t?o.$dialog.one("bsTransitionEnd",function(){o.$element.trigger("focus").trigger(e)}).emulateTransitionEnd(s.TRANSITION_DURATION):o.$element.trigger("focus").trigger(e)}))},s.prototype.hide=function(t){t&&t.preventDefault(),t=a.Event("hide.bs.modal"),this.$element.trigger(t),this.isShown&&!t.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(s.TRANSITION_DURATION):this.hideModal())},s.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(t){document===t.target||this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},s.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},s.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},s.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$body.removeClass("modal-open"),t.resetAdjustments(),t.resetScrollbar(),t.$element.trigger("hidden.bs.modal")})},s.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},s.prototype.backdrop=function(t){var e=this,i=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var o=a.support.transition&&i;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+i).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(t){this.ignoreBackdropClick?this.ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide())},this)),o&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!t)return;o?this.$backdrop.one("bsTransitionEnd",t).emulateTransitionEnd(s.BACKDROP_TRANSITION_DURATION):t()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var n=function(){e.removeBackdrop(),t&&t()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",n).emulateTransitionEnd(s.BACKDROP_TRANSITION_DURATION):n()}else t&&t()},s.prototype.handleUpdate=function(){this.adjustDialog()},s.prototype.adjustDialog=function(){var t=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&t?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!t?this.scrollbarWidth:""})},s.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},s.prototype.checkScrollbar=function(){var t=window.innerWidth;if(!t){var e=document.documentElement.getBoundingClientRect();t=e.right-Math.abs(e.left)}this.bodyIsOverflowing=document.body.clientWidth<t,this.scrollbarWidth=this.measureScrollbar()},s.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"";var n=this.scrollbarWidth;this.bodyIsOverflowing&&(this.$body.css("padding-right",t+n),a(this.fixedContent).each(function(t,e){var i=e.style.paddingRight,o=a(e).css("padding-right");a(e).data("padding-right",i).css("padding-right",parseFloat(o)+n+"px")}))},s.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad),a(this.fixedContent).each(function(t,e){var i=a(e).data("padding-right");a(e).removeData("padding-right"),e.style.paddingRight=i||""})},s.prototype.measureScrollbar=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var t=a.fn.modal;a.fn.modal=r,a.fn.modal.Constructor=s,a.fn.modal.noConflict=function(){return a.fn.modal=t,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(t){var e=a(this),i=e.attr("href"),o=e.attr("data-target")||i&&i.replace(/.*(?=#[^\s]+$)/,""),n=a(document).find(o),s=n.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(i)&&i},n.data(),e.data());e.is("a")&&t.preventDefault(),n.one("show.bs.modal",function(t){t.isDefaultPrevented()||n.one("hidden.bs.modal",function(){e.is(":visible")&&e.trigger("focus")})}),r.call(n,s,this)})}(jQuery),function(g){"use strict";var o=["sanitize","whiteList","sanitizeFn"],a=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],t={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},r=/^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi,l=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;function u(t,e){var i=t.nodeName.toLowerCase();if(-1!==g.inArray(i,e))return-1===g.inArray(i,a)||Boolean(t.nodeValue.match(r)||t.nodeValue.match(l));for(var o=g(e).filter(function(t,e){return e instanceof RegExp}),n=0,s=o.length;n<s;n++)if(i.match(o[n]))return!0;return!1}function n(t,e,i){if(0===t.length)return t;if(i&&"function"==typeof i)return i(t);if(!document.implementation||!document.implementation.createHTMLDocument)return t;var o=document.implementation.createHTMLDocument("sanitization");o.body.innerHTML=t;for(var n=g.map(e,function(t,e){return e}),s=g(o.body).find("*"),a=0,r=s.length;a<r;a++){var l=s[a],h=l.nodeName.toLowerCase();if(-1!==g.inArray(h,n))for(var d=g.map(l.attributes,function(t){return t}),p=[].concat(e["*"]||[],e[h]||[]),c=0,f=d.length;c<f;c++)u(d[c],p)||l.removeAttribute(d[c].nodeName);else l.parentNode.removeChild(l)}return o.body.innerHTML}var m=function(t,e){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",t,e)};m.VERSION="3.4.1",m.TRANSITION_DURATION=150,m.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0},sanitize:!0,sanitizeFn:null,whiteList:t},m.prototype.init=function(t,e,i){if(this.enabled=!0,this.type=t,this.$element=g(e),this.options=this.getOptions(i),this.$viewport=this.options.viewport&&g(document).find(g.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var o=this.options.trigger.split(" "),n=o.length;n--;){var s=o[n];if("click"==s)this.$element.on("click."+this.type,this.options.selector,g.proxy(this.toggle,this));else if("manual"!=s){var a="hover"==s?"mouseenter":"focusin",r="hover"==s?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,g.proxy(this.enter,this)),this.$element.on(r+"."+this.type,this.options.selector,g.proxy(this.leave,this))}}this.options.selector?this._options=g.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},m.prototype.getDefaults=function(){return m.DEFAULTS},m.prototype.getOptions=function(t){var e=this.$element.data();for(var i in e)e.hasOwnProperty(i)&&-1!==g.inArray(i,o)&&delete e[i];return(t=g.extend({},this.getDefaults(),e,t)).delay&&"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),t.sanitize&&(t.template=n(t.template,t.whiteList,t.sanitizeFn)),t},m.prototype.getDelegateOptions=function(){var i={},o=this.getDefaults();return this._options&&g.each(this._options,function(t,e){o[t]!=e&&(i[t]=e)}),i},m.prototype.enter=function(t){var e=t instanceof this.constructor?t:g(t.currentTarget).data("bs."+this.type);if(e||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e)),t instanceof g.Event&&(e.inState["focusin"==t.type?"focus":"hover"]=!0),e.tip().hasClass("in")||"in"==e.hoverState)e.hoverState="in";else{if(clearTimeout(e.timeout),e.hoverState="in",!e.options.delay||!e.options.delay.show)return e.show();e.timeout=setTimeout(function(){"in"==e.hoverState&&e.show()},e.options.delay.show)}},m.prototype.isInStateTrue=function(){for(var t in this.inState)if(this.inState[t])return!0;return!1},m.prototype.leave=function(t){var e=t instanceof this.constructor?t:g(t.currentTarget).data("bs."+this.type);if(e||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e)),t instanceof g.Event&&(e.inState["focusout"==t.type?"focus":"hover"]=!1),!e.isInStateTrue()){if(clearTimeout(e.timeout),e.hoverState="out",!e.options.delay||!e.options.delay.hide)return e.hide();e.timeout=setTimeout(function(){"out"==e.hoverState&&e.hide()},e.options.delay.hide)}},m.prototype.show=function(){var t=g.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(t);var e=g.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(t.isDefaultPrevented()||!e)return;var i=this,o=this.tip(),n=this.getUID(this.type);this.setContent(),o.attr("id",n),this.$element.attr("aria-describedby",n),this.options.animation&&o.addClass("fade");var s="function"==typeof this.options.placement?this.options.placement.call(this,o[0],this.$element[0]):this.options.placement,a=/\s?auto?\s?/i,r=a.test(s);r&&(s=s.replace(a,"")||"top"),o.detach().css({top:0,left:0,display:"block"}).addClass(s).data("bs."+this.type,this),this.options.container?o.appendTo(g(document).find(this.options.container)):o.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var l=this.getPosition(),h=o[0].offsetWidth,d=o[0].offsetHeight;if(r){var p=s,c=this.getPosition(this.$viewport);s="bottom"==s&&l.bottom+d>c.bottom?"top":"top"==s&&l.top-d<c.top?"bottom":"right"==s&&l.right+h>c.width?"left":"left"==s&&l.left-h<c.left?"right":s,o.removeClass(p).addClass(s)}var f=this.getCalculatedOffset(s,l,h,d);this.applyPlacement(f,s);var u=function(){var t=i.hoverState;i.$element.trigger("shown.bs."+i.type),i.hoverState=null,"out"==t&&i.leave(i)};g.support.transition&&this.$tip.hasClass("fade")?o.one("bsTransitionEnd",u).emulateTransitionEnd(m.TRANSITION_DURATION):u()}},m.prototype.applyPlacement=function(t,e){var i=this.tip(),o=i[0].offsetWidth,n=i[0].offsetHeight,s=parseInt(i.css("margin-top"),10),a=parseInt(i.css("margin-left"),10);isNaN(s)&&(s=0),isNaN(a)&&(a=0),t.top+=s,t.left+=a,g.offset.setOffset(i[0],g.extend({using:function(t){i.css({top:Math.round(t.top),left:Math.round(t.left)})}},t),0),i.addClass("in");var r=i[0].offsetWidth,l=i[0].offsetHeight;"top"==e&&l!=n&&(t.top=t.top+n-l);var h=this.getViewportAdjustedDelta(e,t,r,l);h.left?t.left+=h.left:t.top+=h.top;var d=/top|bottom/.test(e),p=d?2*h.left-o+r:2*h.top-n+l,c=d?"offsetWidth":"offsetHeight";i.offset(t),this.replaceArrow(p,i[0][c],d)},m.prototype.replaceArrow=function(t,e,i){this.arrow().css(i?"left":"top",50*(1-t/e)+"%").css(i?"top":"left","")},m.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();this.options.html?(this.options.sanitize&&(e=n(e,this.options.whiteList,this.options.sanitizeFn)),t.find(".tooltip-inner").html(e)):t.find(".tooltip-inner").text(e),t.removeClass("fade in top bottom left right")},m.prototype.hide=function(t){var e=this,i=g(this.$tip),o=g.Event("hide.bs."+this.type);function n(){"in"!=e.hoverState&&i.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),t&&t()}if(this.$element.trigger(o),!o.isDefaultPrevented())return i.removeClass("in"),g.support.transition&&i.hasClass("fade")?i.one("bsTransitionEnd",n).emulateTransitionEnd(m.TRANSITION_DURATION):n(),this.hoverState=null,this},m.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},m.prototype.hasContent=function(){return this.getTitle()},m.prototype.getPosition=function(t){var e=(t=t||this.$element)[0],i="BODY"==e.tagName,o=e.getBoundingClientRect();null==o.width&&(o=g.extend({},o,{width:o.right-o.left,height:o.bottom-o.top}));var n=window.SVGElement&&e instanceof window.SVGElement,s=i?{top:0,left:0}:n?null:t.offset(),a={scroll:i?document.documentElement.scrollTop||document.body.scrollTop:t.scrollTop()},r=i?{width:g(window).width(),height:g(window).height()}:null;return g.extend({},o,a,r,s)},m.prototype.getCalculatedOffset=function(t,e,i,o){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-i/2}:"top"==t?{top:e.top-o,left:e.left+e.width/2-i/2}:"left"==t?{top:e.top+e.height/2-o/2,left:e.left-i}:{top:e.top+e.height/2-o/2,left:e.left+e.width}},m.prototype.getViewportAdjustedDelta=function(t,e,i,o){var n={top:0,left:0};if(!this.$viewport)return n;var s=this.options.viewport&&this.options.viewport.padding||0,a=this.getPosition(this.$viewport);if(/right|left/.test(t)){var r=e.top-s-a.scroll,l=e.top+s-a.scroll+o;r<a.top?n.top=a.top-r:l>a.top+a.height&&(n.top=a.top+a.height-l)}else{var h=e.left-s,d=e.left+s+i;h<a.left?n.left=a.left-h:d>a.right&&(n.left=a.left+a.width-d)}return n},m.prototype.getTitle=function(){var t=this.$element,e=this.options;return t.attr("data-original-title")||("function"==typeof e.title?e.title.call(t[0]):e.title)},m.prototype.getUID=function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},m.prototype.tip=function(){if(!this.$tip&&(this.$tip=g(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},m.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},m.prototype.enable=function(){this.enabled=!0},m.prototype.disable=function(){this.enabled=!1},m.prototype.toggleEnabled=function(){this.enabled=!this.enabled},m.prototype.toggle=function(t){var e=this;t&&((e=g(t.currentTarget).data("bs."+this.type))||(e=new this.constructor(t.currentTarget,this.getDelegateOptions()),g(t.currentTarget).data("bs."+this.type,e))),t?(e.inState.click=!e.inState.click,e.isInStateTrue()?e.enter(e):e.leave(e)):e.tip().hasClass("in")?e.leave(e):e.enter(e)},m.prototype.destroy=function(){var t=this;clearTimeout(this.timeout),this.hide(function(){t.$element.off("."+t.type).removeData("bs."+t.type),t.$tip&&t.$tip.detach(),t.$tip=null,t.$arrow=null,t.$viewport=null,t.$element=null})},m.prototype.sanitizeHtml=function(t){return n(t,this.options.whiteList,this.options.sanitizeFn)};var e=g.fn.tooltip;g.fn.tooltip=function i(o){return this.each(function(){var t=g(this),e=t.data("bs.tooltip"),i="object"==typeof o&&o;!e&&/destroy|hide/.test(o)||(e||t.data("bs.tooltip",e=new m(this,i)),"string"==typeof o&&e[o]())})},g.fn.tooltip.Constructor=m,g.fn.tooltip.noConflict=function(){return g.fn.tooltip=e,this}}(jQuery),function(n){"use strict";var s=function(t,e){this.init("popover",t,e)};if(!n.fn.tooltip)throw new Error("Popover requires tooltip.js");s.VERSION="3.4.1",s.DEFAULTS=n.extend({},n.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),((s.prototype=n.extend({},n.fn.tooltip.Constructor.prototype)).constructor=s).prototype.getDefaults=function(){return s.DEFAULTS},s.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),i=this.getContent();if(this.options.html){var o=typeof i;this.options.sanitize&&(e=this.sanitizeHtml(e),"string"===o&&(i=this.sanitizeHtml(i))),t.find(".popover-title").html(e),t.find(".popover-content").children().detach().end()["string"===o?"html":"append"](i)}else t.find(".popover-title").text(e),t.find(".popover-content").children().detach().end().text(i);t.removeClass("fade top bottom left right in"),t.find(".popover-title").html()||t.find(".popover-title").hide()},s.prototype.hasContent=function(){return this.getTitle()||this.getContent()},s.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},s.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var t=n.fn.popover;n.fn.popover=function e(o){return this.each(function(){var t=n(this),e=t.data("bs.popover"),i="object"==typeof o&&o;!e&&/destroy|hide/.test(o)||(e||t.data("bs.popover",e=new s(this,i)),"string"==typeof o&&e[o]())})},n.fn.popover.Constructor=s,n.fn.popover.noConflict=function(){return n.fn.popover=t,this}}(jQuery),function(s){"use strict";function n(t,e){this.$body=s(document.body),this.$scrollElement=s(t).is(document.body)?s(window):s(t),this.options=s.extend({},n.DEFAULTS,e),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",s.proxy(this.process,this)),this.refresh(),this.process()}function e(o){return this.each(function(){var t=s(this),e=t.data("bs.scrollspy"),i="object"==typeof o&&o;e||t.data("bs.scrollspy",e=new n(this,i)),"string"==typeof o&&e[o]()})}n.VERSION="3.4.1",n.DEFAULTS={offset:10},n.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},n.prototype.refresh=function(){var t=this,o="offset",n=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),s.isWindow(this.$scrollElement[0])||(o="position",n=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var t=s(this),e=t.data("target")||t.attr("href"),i=/^#./.test(e)&&s(e);return i&&i.length&&i.is(":visible")&&[[i[o]().top+n,e]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},n.prototype.process=function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,i=this.getScrollHeight(),o=this.options.offset+i-this.$scrollElement.height(),n=this.offsets,s=this.targets,a=this.activeTarget;if(this.scrollHeight!=i&&this.refresh(),o<=e)return a!=(t=s[s.length-1])&&this.activate(t);if(a&&e<n[0])return this.activeTarget=null,this.clear();for(t=n.length;t--;)a!=s[t]&&e>=n[t]&&(n[t+1]===undefined||e<n[t+1])&&this.activate(s[t])},n.prototype.activate=function(t){this.activeTarget=t,this.clear();var e=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',i=s(e).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active")),i.trigger("activate.bs.scrollspy")},n.prototype.clear=function(){s(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var t=s.fn.scrollspy;s.fn.scrollspy=e,s.fn.scrollspy.Constructor=n,s.fn.scrollspy.noConflict=function(){return s.fn.scrollspy=t,this},s(window).on("load.bs.scrollspy.data-api",function(){s('[data-spy="scroll"]').each(function(){var t=s(this);e.call(t,t.data())})})}(jQuery),function(r){"use strict";var a=function(t){this.element=r(t)};function e(i){return this.each(function(){var t=r(this),e=t.data("bs.tab");e||t.data("bs.tab",e=new a(this)),"string"==typeof i&&e[i]()})}a.VERSION="3.4.1",a.TRANSITION_DURATION=150,a.prototype.show=function(){var t=this.element,e=t.closest("ul:not(.dropdown-menu)"),i=t.data("target");if(i||(i=(i=t.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),!t.parent("li").hasClass("active")){var o=e.find(".active:last a"),n=r.Event("hide.bs.tab",{relatedTarget:t[0]}),s=r.Event("show.bs.tab",{relatedTarget:o[0]});if(o.trigger(n),t.trigger(s),!s.isDefaultPrevented()&&!n.isDefaultPrevented()){var a=r(document).find(i);this.activate(t.closest("li"),e),this.activate(a,a.parent(),function(){o.trigger({type:"hidden.bs.tab",relatedTarget:t[0]}),t.trigger({type:"shown.bs.tab",relatedTarget:o[0]})})}}},a.prototype.activate=function(t,e,i){var o=e.find("> .active"),n=i&&r.support.transition&&(o.length&&o.hasClass("fade")||!!e.find("> .fade").length);function s(){o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),n?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu").length&&t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),i&&i()}o.length&&n?o.one("bsTransitionEnd",s).emulateTransitionEnd(a.TRANSITION_DURATION):s(),o.removeClass("in")};var t=r.fn.tab;r.fn.tab=e,r.fn.tab.Constructor=a,r.fn.tab.noConflict=function(){return r.fn.tab=t,this};var i=function(t){t.preventDefault(),e.call(r(this),"show")};r(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',i).on("click.bs.tab.data-api",'[data-toggle="pill"]',i)}(jQuery),function(l){"use strict";var h=function(t,e){this.options=l.extend({},h.DEFAULTS,e);var i=this.options.target===h.DEFAULTS.target?l(this.options.target):l(document).find(this.options.target);this.$target=i.on("scroll.bs.affix.data-api",l.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",l.proxy(this.checkPositionWithEventLoop,this)),this.$element=l(t),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};function i(o){return this.each(function(){var t=l(this),e=t.data("bs.affix"),i="object"==typeof o&&o;e||t.data("bs.affix",e=new h(this,i)),"string"==typeof o&&e[o]()})}h.VERSION="3.4.1",h.RESET="affix affix-top affix-bottom",h.DEFAULTS={offset:0,target:window},h.prototype.getState=function(t,e,i,o){var n=this.$target.scrollTop(),s=this.$element.offset(),a=this.$target.height();if(null!=i&&"top"==this.affixed)return n<i&&"top";if("bottom"==this.affixed)return null!=i?!(n+this.unpin<=s.top)&&"bottom":!(n+a<=t-o)&&"bottom";var r=null==this.affixed,l=r?n:s.top;return null!=i&&n<=i?"top":null!=o&&t-o<=l+(r?a:e)&&"bottom"},h.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(h.RESET).addClass("affix");var t=this.$target.scrollTop(),e=this.$element.offset();return this.pinnedOffset=e.top-t},h.prototype.checkPositionWithEventLoop=function(){setTimeout(l.proxy(this.checkPosition,this),1)},h.prototype.checkPosition=function(){if(this.$element.is(":visible")){var t=this.$element.height(),e=this.options.offset,i=e.top,o=e.bottom,n=Math.max(l(document).height(),l(document.body).height());"object"!=typeof e&&(o=i=e),"function"==typeof i&&(i=e.top(this.$element)),"function"==typeof o&&(o=e.bottom(this.$element));var s=this.getState(n,t,i,o);if(this.affixed!=s){null!=this.unpin&&this.$element.css("top","");var a="affix"+(s?"-"+s:""),r=l.Event(a+".bs.affix");if(this.$element.trigger(r),r.isDefaultPrevented())return;this.affixed=s,this.unpin="bottom"==s?this.getPinnedOffset():null,this.$element.removeClass(h.RESET).addClass(a).trigger(a.replace("affix","affixed")+".bs.affix")}"bottom"==s&&this.$element.offset({top:n-t-o})}};var t=l.fn.affix;l.fn.affix=i,l.fn.affix.Constructor=h,l.fn.affix.noConflict=function(){return l.fn.affix=t,this},l(window).on("load",function(){l('[data-spy="affix"]').each(function(){var t=l(this),e=t.data();e.offset=e.offset||{},null!=e.offsetBottom&&(e.offset.bottom=e.offsetBottom),null!=e.offsetTop&&(e.offset.top=e.offsetTop),i.call(t,e)})})}(jQuery);

/***/ }),

/***/ "./assets/bower_components/font-awesome/css/font-awesome.min.css":
/*!***********************************************************************!*\
  !*** ./assets/bower_components/font-awesome/css/font-awesome.min.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/css/app.css":
/*!****************************!*\
  !*** ./assets/css/app.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/dist/css/AdminLTE.min.css":
/*!******************************************!*\
  !*** ./assets/dist/css/AdminLTE.min.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/dist/css/skins/skin-blue.css":
/*!*********************************************!*\
  !*** ./assets/dist/css/skins/skin-blue.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/dist/js/adminlte.min.js":
/*!****************************************!*\
  !*** ./assets/dist/js/adminlte.min.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! AdminLTE app.js
* ================
* Main JS application file for AdminLTE v2. This file
* should be included in all pages. It controls some layout
* options and implements exclusive AdminLTE plugins.
*
* @Author  Almsaeed Studio
* @Support <https://www.almsaeedstudio.com>
* @Email   <abdullah@almsaeedstudio.com>
* @version 2.4.8
* @repository git://github.com/almasaeed2010/AdminLTE.git
* @license MIT <http://opensource.org/licenses/MIT>
*/
if ("undefined" == typeof jQuery) throw new Error("AdminLTE requires jQuery");
+function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this),
          g = e.data(c);

      if (!g) {
        var h = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, g = new f(e, h));
      }

      if ("string" == typeof g) {
        if (void 0 === g[b]) throw new Error("No method named " + b);
        g[b]();
      }
    });
  }

  var c = "lte.boxrefresh",
      d = {
    source: "",
    params: {},
    trigger: ".refresh-btn",
    content: ".box-body",
    loadInContent: !0,
    responseType: "",
    overlayTemplate: '<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>',
    onLoadStart: function onLoadStart() {},
    onLoadDone: function onLoadDone(a) {
      return a;
    }
  },
      e = {
    data: '[data-widget="box-refresh"]'
  },
      f = function f(b, c) {
    if (this.element = b, this.options = c, this.$overlay = a(c.overlayTemplate), "" === c.source) throw new Error("Source url was not defined. Please specify a url in your BoxRefresh source option.");
    this._setUpListeners(), this.load();
  };

  f.prototype.load = function () {
    this._addOverlay(), this.options.onLoadStart.call(a(this)), a.get(this.options.source, this.options.params, function (b) {
      this.options.loadInContent && a(this.element).find(this.options.content).html(b), this.options.onLoadDone.call(a(this), b), this._removeOverlay();
    }.bind(this), "" !== this.options.responseType && this.options.responseType);
  }, f.prototype._setUpListeners = function () {
    a(this.element).on("click", this.options.trigger, function (a) {
      a && a.preventDefault(), this.load();
    }.bind(this));
  }, f.prototype._addOverlay = function () {
    a(this.element).append(this.$overlay);
  }, f.prototype._removeOverlay = function () {
    a(this.$overlay).remove();
  };
  var g = a.fn.boxRefresh;
  a.fn.boxRefresh = b, a.fn.boxRefresh.Constructor = f, a.fn.boxRefresh.noConflict = function () {
    return a.fn.boxRefresh = g, this;
  }, a(window).on("load", function () {
    a(e.data).each(function () {
      b.call(a(this));
    });
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this),
          f = e.data(c);

      if (!f) {
        var g = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, f = new h(e, g));
      }

      if ("string" == typeof b) {
        if (void 0 === f[b]) throw new Error("No method named " + b);
        f[b]();
      }
    });
  }

  var c = "lte.boxwidget",
      d = {
    animationSpeed: 500,
    collapseTrigger: '[data-widget="collapse"]',
    removeTrigger: '[data-widget="remove"]',
    collapseIcon: "fa-minus",
    expandIcon: "fa-plus",
    removeIcon: "fa-times"
  },
      e = {
    data: ".box",
    collapsed: ".collapsed-box",
    header: ".box-header",
    body: ".box-body",
    footer: ".box-footer",
    tools: ".box-tools"
  },
      f = {
    collapsed: "collapsed-box"
  },
      g = {
    collapsing: "collapsing.boxwidget",
    collapsed: "collapsed.boxwidget",
    expanding: "expanding.boxwidget",
    expanded: "expanded.boxwidget",
    removing: "removing.boxwidget",
    removed: "removed.boxwidget"
  },
      h = function h(a, b) {
    this.element = a, this.options = b, this._setUpListeners();
  };

  h.prototype.toggle = function () {
    a(this.element).is(e.collapsed) ? this.expand() : this.collapse();
  }, h.prototype.expand = function () {
    var b = a.Event(g.expanded),
        c = a.Event(g.expanding),
        d = this.options.collapseIcon,
        h = this.options.expandIcon;
    a(this.element).removeClass(f.collapsed), a(this.element).children(e.header + ", " + e.body + ", " + e.footer).children(e.tools).find("." + h).removeClass(h).addClass(d), a(this.element).children(e.body + ", " + e.footer).slideDown(this.options.animationSpeed, function () {
      a(this.element).trigger(b);
    }.bind(this)).trigger(c);
  }, h.prototype.collapse = function () {
    var b = a.Event(g.collapsed),
        c = (a.Event(g.collapsing), this.options.collapseIcon),
        d = this.options.expandIcon;
    a(this.element).children(e.header + ", " + e.body + ", " + e.footer).children(e.tools).find("." + c).removeClass(c).addClass(d), a(this.element).children(e.body + ", " + e.footer).slideUp(this.options.animationSpeed, function () {
      a(this.element).addClass(f.collapsed), a(this.element).trigger(b);
    }.bind(this)).trigger(expandingEvent);
  }, h.prototype.remove = function () {
    var b = a.Event(g.removed),
        c = a.Event(g.removing);
    a(this.element).slideUp(this.options.animationSpeed, function () {
      a(this.element).trigger(b), a(this.element).remove();
    }.bind(this)).trigger(c);
  }, h.prototype._setUpListeners = function () {
    var b = this;
    a(this.element).on("click", this.options.collapseTrigger, function (c) {
      return c && c.preventDefault(), b.toggle(a(this)), !1;
    }), a(this.element).on("click", this.options.removeTrigger, function (c) {
      return c && c.preventDefault(), b.remove(a(this)), !1;
    });
  };
  var i = a.fn.boxWidget;
  a.fn.boxWidget = b, a.fn.boxWidget.Constructor = h, a.fn.boxWidget.noConflict = function () {
    return a.fn.boxWidget = i, this;
  }, a(window).on("load", function () {
    a(e.data).each(function () {
      b.call(a(this));
    });
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this),
          f = e.data(c);

      if (!f) {
        var g = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, f = new h(e, g));
      }

      "string" == typeof b && f.toggle();
    });
  }

  var c = "lte.controlsidebar",
      d = {
    slide: !0
  },
      e = {
    sidebar: ".control-sidebar",
    data: '[data-toggle="control-sidebar"]',
    open: ".control-sidebar-open",
    bg: ".control-sidebar-bg",
    wrapper: ".wrapper",
    content: ".content-wrapper",
    boxed: ".layout-boxed"
  },
      f = {
    open: "control-sidebar-open",
    fixed: "fixed"
  },
      g = {
    collapsed: "collapsed.controlsidebar",
    expanded: "expanded.controlsidebar"
  },
      h = function h(a, b) {
    this.element = a, this.options = b, this.hasBindedResize = !1, this.init();
  };

  h.prototype.init = function () {
    a(this.element).is(e.data) || a(this).on("click", this.toggle), this.fix(), a(window).resize(function () {
      this.fix();
    }.bind(this));
  }, h.prototype.toggle = function (b) {
    b && b.preventDefault(), this.fix(), a(e.sidebar).is(e.open) || a("body").is(e.open) ? this.collapse() : this.expand();
  }, h.prototype.expand = function () {
    this.options.slide ? a(e.sidebar).addClass(f.open) : a("body").addClass(f.open), a(this.element).trigger(a.Event(g.expanded));
  }, h.prototype.collapse = function () {
    a("body, " + e.sidebar).removeClass(f.open), a(this.element).trigger(a.Event(g.collapsed));
  }, h.prototype.fix = function () {
    a("body").is(e.boxed) && this._fixForBoxed(a(e.bg));
  }, h.prototype._fixForBoxed = function (b) {
    b.css({
      position: "absolute",
      height: a(e.wrapper).height()
    });
  };
  var i = a.fn.controlSidebar;
  a.fn.controlSidebar = b, a.fn.controlSidebar.Constructor = h, a.fn.controlSidebar.noConflict = function () {
    return a.fn.controlSidebar = i, this;
  }, a(document).on("click", e.data, function (c) {
    c && c.preventDefault(), b.call(a(this), "toggle");
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var d = a(this),
          e = d.data(c);
      e || d.data(c, e = new f(d)), "string" == typeof b && e.toggle(d);
    });
  }

  var c = "lte.directchat",
      d = {
    data: '[data-widget="chat-pane-toggle"]',
    box: ".direct-chat"
  },
      e = {
    open: "direct-chat-contacts-open"
  },
      f = function f(a) {
    this.element = a;
  };

  f.prototype.toggle = function (a) {
    a.parents(d.box).first().toggleClass(e.open);
  };

  var g = a.fn.directChat;
  a.fn.directChat = b, a.fn.directChat.Constructor = f, a.fn.directChat.noConflict = function () {
    return a.fn.directChat = g, this;
  }, a(document).on("click", d.data, function (c) {
    c && c.preventDefault(), b.call(a(this), "toggle");
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this),
          f = e.data(c);

      if (!f) {
        var h = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, f = new g(h));
      }

      if ("string" == typeof b) {
        if (void 0 === f[b]) throw new Error("No method named " + b);
        f[b]();
      }
    });
  }

  var c = "lte.layout",
      d = {
    slimscroll: !0,
    resetHeight: !0
  },
      e = {
    wrapper: ".wrapper",
    contentWrapper: ".content-wrapper",
    layoutBoxed: ".layout-boxed",
    mainFooter: ".main-footer",
    mainHeader: ".main-header",
    sidebar: ".sidebar",
    controlSidebar: ".control-sidebar",
    fixed: ".fixed",
    sidebarMenu: ".sidebar-menu",
    logo: ".main-header .logo"
  },
      f = {
    fixed: "fixed",
    holdTransition: "hold-transition"
  },
      g = function g(a) {
    this.options = a, this.bindedResize = !1, this.activate();
  };

  g.prototype.activate = function () {
    this.fix(), this.fixSidebar(), a("body").removeClass(f.holdTransition), this.options.resetHeight && a("body, html, " + e.wrapper).css({
      height: "auto",
      "min-height": "100%"
    }), this.bindedResize || (a(window).resize(function () {
      this.fix(), this.fixSidebar(), a(e.logo + ", " + e.sidebar).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function () {
        this.fix(), this.fixSidebar();
      }.bind(this));
    }.bind(this)), this.bindedResize = !0), a(e.sidebarMenu).on("expanded.tree", function () {
      this.fix(), this.fixSidebar();
    }.bind(this)), a(e.sidebarMenu).on("collapsed.tree", function () {
      this.fix(), this.fixSidebar();
    }.bind(this));
  }, g.prototype.fix = function () {
    a(e.layoutBoxed + " > " + e.wrapper).css("overflow", "hidden");
    var b = a(e.mainFooter).outerHeight() || 0,
        c = a(e.mainHeader).outerHeight() || 0,
        d = c + b,
        g = a(window).height(),
        h = a(e.sidebar).height() || 0;
    if (a("body").hasClass(f.fixed)) a(e.contentWrapper).css("min-height", g - b);else {
      var i;
      g >= h + c ? (a(e.contentWrapper).css("min-height", g - d), i = g - d) : (a(e.contentWrapper).css("min-height", h), i = h);
      var j = a(e.controlSidebar);
      void 0 !== j && j.height() > i && a(e.contentWrapper).css("min-height", j.height());
    }
  }, g.prototype.fixSidebar = function () {
    if (!a("body").hasClass(f.fixed)) return void (void 0 !== a.fn.slimScroll && a(e.sidebar).slimScroll({
      destroy: !0
    }).height("auto"));
    this.options.slimscroll && void 0 !== a.fn.slimScroll && a(e.sidebar).slimScroll({
      height: a(window).height() - a(e.mainHeader).height() + "px"
    });
  };
  var h = a.fn.layout;
  a.fn.layout = b, a.fn.layout.Constuctor = g, a.fn.layout.noConflict = function () {
    return a.fn.layout = h, this;
  }, a(window).on("load", function () {
    b.call(a("body"));
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this),
          f = e.data(c);

      if (!f) {
        var g = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, f = new h(g));
      }

      "toggle" === b && f.toggle();
    });
  }

  var c = "lte.pushmenu",
      d = {
    collapseScreenSize: 767,
    expandOnHover: !1,
    expandTransitionDelay: 200
  },
      e = {
    collapsed: ".sidebar-collapse",
    open: ".sidebar-open",
    mainSidebar: ".main-sidebar",
    contentWrapper: ".content-wrapper",
    searchInput: ".sidebar-form .form-control",
    button: '[data-toggle="push-menu"]',
    mini: ".sidebar-mini",
    expanded: ".sidebar-expanded-on-hover",
    layoutFixed: ".fixed"
  },
      f = {
    collapsed: "sidebar-collapse",
    open: "sidebar-open",
    mini: "sidebar-mini",
    expanded: "sidebar-expanded-on-hover",
    expandFeature: "sidebar-mini-expand-feature",
    layoutFixed: "fixed"
  },
      g = {
    expanded: "expanded.pushMenu",
    collapsed: "collapsed.pushMenu"
  },
      h = function h(a) {
    this.options = a, this.init();
  };

  h.prototype.init = function () {
    (this.options.expandOnHover || a("body").is(e.mini + e.layoutFixed)) && (this.expandOnHover(), a("body").addClass(f.expandFeature)), a(e.contentWrapper).click(function () {
      a(window).width() <= this.options.collapseScreenSize && a("body").hasClass(f.open) && this.close();
    }.bind(this)), a(e.searchInput).click(function (a) {
      a.stopPropagation();
    });
  }, h.prototype.toggle = function () {
    var b = a(window).width(),
        c = !a("body").hasClass(f.collapsed);
    b <= this.options.collapseScreenSize && (c = a("body").hasClass(f.open)), c ? this.close() : this.open();
  }, h.prototype.open = function () {
    a(window).width() > this.options.collapseScreenSize ? a("body").removeClass(f.collapsed).trigger(a.Event(g.expanded)) : a("body").addClass(f.open).trigger(a.Event(g.expanded));
  }, h.prototype.close = function () {
    a(window).width() > this.options.collapseScreenSize ? a("body").addClass(f.collapsed).trigger(a.Event(g.collapsed)) : a("body").removeClass(f.open + " " + f.collapsed).trigger(a.Event(g.collapsed));
  }, h.prototype.expandOnHover = function () {
    a(e.mainSidebar).hover(function () {
      a("body").is(e.mini + e.collapsed) && a(window).width() > this.options.collapseScreenSize && this.expand();
    }.bind(this), function () {
      a("body").is(e.expanded) && this.collapse();
    }.bind(this));
  }, h.prototype.expand = function () {
    setTimeout(function () {
      a("body").removeClass(f.collapsed).addClass(f.expanded);
    }, this.options.expandTransitionDelay);
  }, h.prototype.collapse = function () {
    setTimeout(function () {
      a("body").removeClass(f.expanded).addClass(f.collapsed);
    }, this.options.expandTransitionDelay);
  };
  var i = a.fn.pushMenu;
  a.fn.pushMenu = b, a.fn.pushMenu.Constructor = h, a.fn.pushMenu.noConflict = function () {
    return a.fn.pushMenu = i, this;
  }, a(document).on("click", e.button, function (c) {
    c.preventDefault(), b.call(a(this), "toggle");
  }), a(window).on("load", function () {
    b.call(a(e.button));
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this),
          f = e.data(c);

      if (!f) {
        var h = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, f = new g(e, h));
      }

      if ("string" == typeof f) {
        if (void 0 === f[b]) throw new Error("No method named " + b);
        f[b]();
      }
    });
  }

  var c = "lte.todolist",
      d = {
    onCheck: function onCheck(a) {
      return a;
    },
    onUnCheck: function onUnCheck(a) {
      return a;
    }
  },
      e = {
    data: '[data-widget="todo-list"]'
  },
      f = {
    done: "done"
  },
      g = function g(a, b) {
    this.element = a, this.options = b, this._setUpListeners();
  };

  g.prototype.toggle = function (a) {
    if (a.parents(e.li).first().toggleClass(f.done), !a.prop("checked")) return void this.unCheck(a);
    this.check(a);
  }, g.prototype.check = function (a) {
    this.options.onCheck.call(a);
  }, g.prototype.unCheck = function (a) {
    this.options.onUnCheck.call(a);
  }, g.prototype._setUpListeners = function () {
    var b = this;
    a(this.element).on("change ifChanged", "input:checkbox", function () {
      b.toggle(a(this));
    });
  };
  var h = a.fn.todoList;
  a.fn.todoList = b, a.fn.todoList.Constructor = g, a.fn.todoList.noConflict = function () {
    return a.fn.todoList = h, this;
  }, a(window).on("load", function () {
    a(e.data).each(function () {
      b.call(a(this));
    });
  });
}(jQuery), function (a) {
  "use strict";

  function b(b) {
    return this.each(function () {
      var e = a(this);

      if (!e.data(c)) {
        var f = a.extend({}, d, e.data(), "object" == _typeof(b) && b);
        e.data(c, new h(e, f));
      }
    });
  }

  var c = "lte.tree",
      d = {
    animationSpeed: 500,
    accordion: !0,
    followLink: !1,
    trigger: ".treeview a"
  },
      e = {
    tree: ".tree",
    treeview: ".treeview",
    treeviewMenu: ".treeview-menu",
    open: ".menu-open, .active",
    li: "li",
    data: '[data-widget="tree"]',
    active: ".active"
  },
      f = {
    open: "menu-open",
    tree: "tree"
  },
      g = {
    collapsed: "collapsed.tree",
    expanded: "expanded.tree"
  },
      h = function h(b, c) {
    this.element = b, this.options = c, a(this.element).addClass(f.tree), a(e.treeview + e.active, this.element).addClass(f.open), this._setUpListeners();
  };

  h.prototype.toggle = function (a, b) {
    var c = a.next(e.treeviewMenu),
        d = a.parent(),
        g = d.hasClass(f.open);
    d.is(e.treeview) && (this.options.followLink && "#" !== a.attr("href") || b.preventDefault(), g ? this.collapse(c, d) : this.expand(c, d));
  }, h.prototype.expand = function (b, c) {
    var d = a.Event(g.expanded);

    if (this.options.accordion) {
      var h = c.siblings(e.open),
          i = h.children(e.treeviewMenu);
      this.collapse(i, h);
    }

    c.addClass(f.open), b.slideDown(this.options.animationSpeed, function () {
      a(this.element).trigger(d);
    }.bind(this));
  }, h.prototype.collapse = function (b, c) {
    var d = a.Event(g.collapsed);
    c.removeClass(f.open), b.slideUp(this.options.animationSpeed, function () {
      a(this.element).trigger(d);
    }.bind(this));
  }, h.prototype._setUpListeners = function () {
    var b = this;
    a(this.element).on("click", this.options.trigger, function (c) {
      b.toggle(a(this), c);
    });
  };
  var i = a.fn.tree;
  a.fn.tree = b, a.fn.tree.Constructor = h, a.fn.tree.noConflict = function () {
    return a.fn.tree = i, this;
  }, a(window).on("load", function () {
    a(e.data).each(function () {
      b.call(a(this));
    });
  });
}(jQuery);

/***/ }),

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
__webpack_require__(/*! ../bower_components/bootstrap/dist/css/bootstrap.min.css */ "./assets/bower_components/bootstrap/dist/css/bootstrap.min.css");

__webpack_require__(/*! ../bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css */ "./assets/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css");

__webpack_require__(/*! ../bower_components/font-awesome/css/font-awesome.min.css */ "./assets/bower_components/font-awesome/css/font-awesome.min.css");

__webpack_require__(/*! ../bower_components/Ionicons/css/ionicons.min.css */ "./assets/bower_components/Ionicons/css/ionicons.min.css");

__webpack_require__(/*! ../bower_components/bootstrap/dist/css/bootstrap.min.css */ "./assets/bower_components/bootstrap/dist/css/bootstrap.min.css");

__webpack_require__(/*! ../bower_components/bootstrap/dist/css/bootstrap-theme.min.css */ "./assets/bower_components/bootstrap/dist/css/bootstrap-theme.min.css");

__webpack_require__(/*! ../plugins/iCheck/all.css */ "./assets/plugins/iCheck/all.css");

__webpack_require__(/*! ../dist/css/AdminLTE.min.css */ "./assets/dist/css/AdminLTE.min.css");

__webpack_require__(/*! ../dist/css/skins/skin-blue.css */ "./assets/dist/css/skins/skin-blue.css");

__webpack_require__(/*! ../css/app.css */ "./assets/css/app.css");

__webpack_require__(/*! ../bower_components/bootstrap/dist/js/bootstrap.min.js */ "./assets/bower_components/bootstrap/dist/js/bootstrap.min.js");

__webpack_require__(/*! ../bower_components/Flot/jquery.flot.js */ "./assets/bower_components/Flot/jquery.flot.js");

__webpack_require__(/*! ../bower_components/Flot/jquery.flot.time.js */ "./assets/bower_components/Flot/jquery.flot.time.js");

__webpack_require__(/*! ../bower_components/Flot/jquery.flot.resize.js */ "./assets/bower_components/Flot/jquery.flot.resize.js");

__webpack_require__(/*! ../bower_components/Flot/jquery.flot.pie.js */ "./assets/bower_components/Flot/jquery.flot.pie.js");

__webpack_require__(/*! ../bower_components/Flot/jquery.flot.categories.js */ "./assets/bower_components/Flot/jquery.flot.categories.js");

__webpack_require__(/*! ../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js */ "./assets/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js");

__webpack_require__(/*! ../plugins/timepicker/bootstrap-timepicker.min.js */ "./assets/plugins/timepicker/bootstrap-timepicker.min.js");

__webpack_require__(/*! ../plugins/iCheck/icheck.min.js */ "./assets/plugins/iCheck/icheck.min.js");

__webpack_require__(/*! ../dist/js/adminlte.min.js */ "./assets/dist/js/adminlte.min.js");

__webpack_require__(/*! ../js/custom.js */ "./assets/js/custom.js");

/***/ }),

/***/ "./assets/js/custom.js":
/*!*****************************!*\
  !*** ./assets/js/custom.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

$(document).ready(function (e) {
  $("li.current_ancestor ul").css({
    display: "block"
  });
  $("li.current_ancestor").addClass("menu-open");
  $(".addFormRow").on('click', function (e) {
    var table = $(this).parents('table');
    var rows = $(table).find('tr').length;
    var tr = $(this).parents('tr').clone();
    $(tr).find("td").each(function (i, e) {
      var prototype = $(e).data('prototype');

      if (prototype != undefined) {
        var element = prototype.replace(/__name__/g, rows);
        $(e).html(element);
      }
    });
    $(tr).appendTo(table);
    $(tr).find(".addFormRow").remove();
    $(tr).find(".removeRow").show();
    $(tr).find(".removeRow").on('click', function (e) {
      $(this).parents('tr').remove();
    });
  });
  $(".removeRow").on('click', function (e) {
    $(this).parents('tr').remove();
  });
  $("[data-change-label]").each(function (i, e) {
    var parentModal = $(e).parents('.modal');

    if ($(e).find("option:selected").val()) {
      $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').show();
    } else {
      $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').hide();
    }

    $(parentModal).find('[data-depends="' + $(e).attr('name') + '"]').text($(e).find("option:selected").text());
    $(e).change(function (event) {
      if ($(e).find("option:selected").val()) {
        $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').show();
      } else {
        $(parentModal).find('[data-toggle-on="' + $(e).attr('name') + '"]').hide();
      }

      $(parentModal).find('[data-depends="' + $(e).attr('name') + '"]').text($(e).find("option:selected").text());
    });
  });
  $("[data-confirm]").on('click', function (e) {
    if (window.confirm($(this).data('confirm'))) {
      return true;
    } else {
      return false;
    }
  });
  $('[data-parent]').click(function (e) {
    var modal = $($(this).data('target'));
    $(modal).find('[name="' + $(modal).attr('id') + '[parent_id]"]').val($(this).data('parent'));
  });
  $(".modal.appendToCollection").on('show.bs.modal', function (e) {
    var nr = $('[data-collection="' + $(this).data('append') + '"]').length;
    $(this).find('input,submit,select,option,textarea').each(function (i, e) {
      if ($(e).attr('name') != undefined) {
        $(e).attr('name', $(e).attr('name').replace(/__name__/g, nr));
      }
    });
  });
  $('form.ajax').on('submit', function (e) {
    e.preventDefault();
    var data = new FormData(this);
    var form = this;
    $.ajax({
      url: $(this).data('validate'),
      type: 'POST',
      data: data,
      processData: false,
      contentType: false,
      success: function success(data) {
        if (data.error != undefined) {
          alert(data.error);
        } else {
          if (data.id != 'undefined') {
            var modal = $(form).parents('.modal');
            var select = $('[data-target="#' + $(modal).attr("id") + '"]').parents('.form-group').find('select');
            $(select).find('option:selected').prop("selected", false);
            $('<option value="' + data.id + '">' + data.label + '</option>').appendTo(select).prop("selected", true);
            $(modal).find('[data-dismiss]').click();
          }
        }
      }
    });
  });
  $("input:file[data-validate]").change(function () {
    var form = $(this).parents("form");
    var modal = $(this).parents(".modal");
    var name = this.name;
    var data = new FormData(form[0]);
    var data2 = new FormData();
    data2.append('file', data.get(name));
    $.ajax({
      url: $(this).data('validate'),
      type: 'POST',
      data: data2,
      processData: false,
      contentType: false,
      success: function success(data) {
        if (data.error != undefined) {
          alert(data.error);
        } else {
          var table = $(modal).find('table');
          $(table).find("tr").each(function (i, e) {
            if (i > 0) {
              $(e).remove();
            }
          });

          var _loop = function _loop() {
            var rows = $(table).find('tr').length;
            var tr = $(table).find('tr').first().clone();
            $(tr).appendTo(table);
            $(tr).find(".addFormRow").remove();
            $(tr).find(".removeRow").show();
            $(tr).find(".removeRow").on('click', function (e) {
              $(this).parents('tr').remove();
            });
            $(tr).find("td").each(function (i, e) {
              var prototype = $(e).data('prototype');

              if (prototype != undefined) {
                var element = prototype.replace(/__name__/g, rows);
                $(e).html(element);
              }
            });
            $(tr).find('.value').val(data.data[i].value);
            $(tr).find('.time').val(data.data[i].time);
          };

          for (i in data.data) {
            _loop();
          }
        }
      }
    });
  });
  $("[data-toggle='chart']").on('change', function (event) {
    var ids = [];
    $(this).parents('.records').find("[data-toggle='chart']").each(function (i, e) {
      if ($(e).is(':checked')) {
        ids.push($(e).data('record'));
      }
    });
    drawChart($($(this).data('target')), ids);
  });
  $('[data-toggle="tooltip"]').tooltip();
});
$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
  checkboxClass: 'icheckbox_minimal-blue',
  radioClass: 'iradio_minimal-blue'
});
$('input[type="checkbox"].append-run').on('change', function (e) {
  $.ajax($(this).data('link'), {
    method: 'GET',
    data: {
      'run_id': $(this).val()
    },
    complete: function complete(xhr, status) {}
  });
});

function drawChart(element, ids) {
  var data = new google.visualization.DataTable();
  var chart = new google.visualization.ComboChart(document.getElementById($(element).attr('id')));
  var options = {
    bar: {
      groupWidth: "100%"
    },
    curveType: 'function',
    seriesType: 'line',
    series: {},
    legend: {
      position: 'bottom'
    },
    vAxes: {
      0: {
        direction: 1
      },
      1: {
        direction: -1
      }
    }
  };
  $.ajax($(element).data('datalink'), {
    method: 'GET',
    data: {
      'ids': ids
    },
    complete: function complete(xhr, status) {
      if (xhr.responseText != '0') {
        $(element).parents('.chart-box').find('.box-body').collapse('show');
        var json = xhr.responseJSON;

        for (i in json[0]) {
          data.addColumn(json[0][i][0], json[0][i][1]);

          if (i != 0) {
            if (options.series[i - 1] == undefined) {
              options.series[i - 1] = {};
            }

            if (json[0][i][3] != undefined && json[0][i][3] == 'precip') {
              options.series[i - 1].targetAxisIndex = 1;
              options.series[i - 1].backgroundColor = '#66bc40';
            } else {
              options.series[i - 1].targetAxisIndex = 0;
            }

            if (json[0][i][2] != undefined) {
              options.series[i - 1].type = json[0][i][2];
            }
          }
        }

        data.addRows(json[1]);
        chart.draw(data, options);
      } else {
        $(element).parents('.chart-box').find('.box-body').collapse('hide');
        chart.clearChart();
      }
    }
  });
}

/***/ }),

/***/ "./assets/plugins/iCheck/all.css":
/*!***************************************!*\
  !*** ./assets/plugins/iCheck/all.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/plugins/iCheck/icheck.min.js":
/*!*********************************************!*\
  !*** ./assets/plugins/iCheck/icheck.min.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! iCheck v1.0.1 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
(function (h) {
  function F(a, b, d) {
    var c = a[0],
        e = /er/.test(d) ? m : /bl/.test(d) ? s : l,
        f = d == H ? {
      checked: c[l],
      disabled: c[s],
      indeterminate: "true" == a.attr(m) || "false" == a.attr(w)
    } : c[e];
    if (/^(ch|di|in)/.test(d) && !f) D(a, e);else if (/^(un|en|de)/.test(d) && f) t(a, e);else if (d == H) for (e in f) {
      f[e] ? D(a, e, !0) : t(a, e, !0);
    } else if (!b || "toggle" == d) {
      if (!b) a[p]("ifClicked");
      f ? c[n] !== u && t(a, e) : D(a, e);
    }
  }

  function D(a, b, d) {
    var c = a[0],
        e = a.parent(),
        f = b == l,
        A = b == m,
        B = b == s,
        K = A ? w : f ? E : "enabled",
        p = k(a, K + x(c[n])),
        N = k(a, b + x(c[n]));

    if (!0 !== c[b]) {
      if (!d && b == l && c[n] == u && c.name) {
        var C = a.closest("form"),
            r = 'input[name="' + c.name + '"]',
            r = C.length ? C.find(r) : h(r);
        r.each(function () {
          this !== c && h(this).data(q) && t(h(this), b);
        });
      }

      A ? (c[b] = !0, c[l] && t(a, l, "force")) : (d || (c[b] = !0), f && c[m] && t(a, m, !1));
      L(a, f, b, d);
    }

    c[s] && k(a, y, !0) && e.find("." + I).css(y, "default");
    e[v](N || k(a, b) || "");
    B ? e.attr("aria-disabled", "true") : e.attr("aria-checked", A ? "mixed" : "true");
    e[z](p || k(a, K) || "");
  }

  function t(a, b, d) {
    var c = a[0],
        e = a.parent(),
        f = b == l,
        h = b == m,
        q = b == s,
        p = h ? w : f ? E : "enabled",
        t = k(a, p + x(c[n])),
        u = k(a, b + x(c[n]));

    if (!1 !== c[b]) {
      if (h || !d || "force" == d) c[b] = !1;
      L(a, f, p, d);
    }

    !c[s] && k(a, y, !0) && e.find("." + I).css(y, "pointer");
    e[z](u || k(a, b) || "");
    q ? e.attr("aria-disabled", "false") : e.attr("aria-checked", "false");
    e[v](t || k(a, p) || "");
  }

  function M(a, b) {
    if (a.data(q)) {
      a.parent().html(a.attr("style", a.data(q).s || ""));
      if (b) a[p](b);
      a.off(".i").unwrap();
      h(G + '[for="' + a[0].id + '"]').add(a.closest(G)).off(".i");
    }
  }

  function k(a, b, d) {
    if (a.data(q)) return a.data(q).o[b + (d ? "" : "Class")];
  }

  function x(a) {
    return a.charAt(0).toUpperCase() + a.slice(1);
  }

  function L(a, b, d, c) {
    if (!c) {
      if (b) a[p]("ifToggled");
      a[p]("ifChanged")[p]("if" + x(d));
    }
  }

  var q = "iCheck",
      I = q + "-helper",
      u = "radio",
      l = "checked",
      E = "un" + l,
      s = "disabled",
      w = "determinate",
      m = "in" + w,
      H = "update",
      n = "type",
      v = "addClass",
      z = "removeClass",
      p = "trigger",
      G = "label",
      y = "cursor",
      J = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

  h.fn[q] = function (a, b) {
    var d = 'input[type="checkbox"], input[type="' + u + '"]',
        c = h(),
        e = function e(a) {
      a.each(function () {
        var a = h(this);
        c = a.is(d) ? c.add(a) : c.add(a.find(d));
      });
    };

    if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(a)) return a = a.toLowerCase(), e(this), c.each(function () {
      var c = h(this);
      "destroy" == a ? M(c, "ifDestroyed") : F(c, !0, a);
      h.isFunction(b) && b();
    });
    if ("object" != _typeof(a) && a) return this;
    var f = h.extend({
      checkedClass: l,
      disabledClass: s,
      indeterminateClass: m,
      labelHover: !0,
      aria: !1
    }, a),
        k = f.handle,
        B = f.hoverClass || "hover",
        x = f.focusClass || "focus",
        w = f.activeClass || "active",
        y = !!f.labelHover,
        C = f.labelHoverClass || "hover",
        r = ("" + f.increaseArea).replace("%", "") | 0;
    if ("checkbox" == k || k == u) d = 'input[type="' + k + '"]';
    -50 > r && (r = -50);
    e(this);
    return c.each(function () {
      var a = h(this);
      M(a);
      var c = this,
          b = c.id,
          e = -r + "%",
          d = 100 + 2 * r + "%",
          d = {
        position: "absolute",
        top: e,
        left: e,
        display: "block",
        width: d,
        height: d,
        margin: 0,
        padding: 0,
        background: "#fff",
        border: 0,
        opacity: 0
      },
          e = J ? {
        position: "absolute",
        visibility: "hidden"
      } : r ? d : {
        position: "absolute",
        opacity: 0
      },
          k = "checkbox" == c[n] ? f.checkboxClass || "icheckbox" : f.radioClass || "i" + u,
          m = h(G + '[for="' + b + '"]').add(a.closest(G)),
          A = !!f.aria,
          E = q + "-" + Math.random().toString(36).replace("0.", ""),
          g = '<div class="' + k + '" ' + (A ? 'role="' + c[n] + '" ' : "");
      m.length && A && m.each(function () {
        g += 'aria-labelledby="';
        this.id ? g += this.id : (this.id = E, g += E);
        g += '"';
      });
      g = a.wrap(g + "/>")[p]("ifCreated").parent().append(f.insert);
      d = h('<ins class="' + I + '"/>').css(d).appendTo(g);
      a.data(q, {
        o: f,
        s: a.attr("style")
      }).css(e);
      f.inheritClass && g[v](c.className || "");
      f.inheritID && b && g.attr("id", q + "-" + b);
      "static" == g.css("position") && g.css("position", "relative");
      F(a, !0, H);
      if (m.length) m.on("click.i mouseover.i mouseout.i touchbegin.i touchend.i", function (b) {
        var d = b[n],
            e = h(this);

        if (!c[s]) {
          if ("click" == d) {
            if (h(b.target).is("a")) return;
            F(a, !1, !0);
          } else y && (/ut|nd/.test(d) ? (g[z](B), e[z](C)) : (g[v](B), e[v](C)));

          if (J) b.stopPropagation();else return !1;
        }
      });
      a.on("click.i focus.i blur.i keyup.i keydown.i keypress.i", function (b) {
        var d = b[n];
        b = b.keyCode;
        if ("click" == d) return !1;
        if ("keydown" == d && 32 == b) return c[n] == u && c[l] || (c[l] ? t(a, l) : D(a, l)), !1;
        if ("keyup" == d && c[n] == u) !c[l] && D(a, l);else if (/us|ur/.test(d)) g["blur" == d ? z : v](x);
      });
      d.on("click mousedown mouseup mouseover mouseout touchbegin.i touchend.i", function (b) {
        var d = b[n],
            e = /wn|up/.test(d) ? w : B;

        if (!c[s]) {
          if ("click" == d) F(a, !1, !0);else {
            if (/wn|er|in/.test(d)) g[v](e);else g[z](e + " " + w);
            if (m.length && y && e == B) m[/ut|nd/.test(d) ? z : v](C);
          }
          if (J) b.stopPropagation();else return !1;
        }
      });
    });
  };
})(window.jQuery || window.Zepto);

/***/ }),

/***/ "./assets/plugins/timepicker/bootstrap-timepicker.min.js":
/*!***************************************************************!*\
  !*** ./assets/plugins/timepicker/bootstrap-timepicker.min.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! bootstrap-timepicker v0.5.2 
* http://jdewit.github.com/bootstrap-timepicker 
* Copyright (c) 2016 Joris de Wit and bootstrap-timepicker contributors 
* MIT License 
*/
!function (a, b, c) {
  "use strict";

  var d = function d(b, c) {
    this.widget = "", this.$element = a(b), this.defaultTime = c.defaultTime, this.disableFocus = c.disableFocus, this.disableMousewheel = c.disableMousewheel, this.isOpen = c.isOpen, this.minuteStep = c.minuteStep, this.modalBackdrop = c.modalBackdrop, this.orientation = c.orientation, this.secondStep = c.secondStep, this.snapToStep = c.snapToStep, this.showInputs = c.showInputs, this.showMeridian = c.showMeridian, this.showSeconds = c.showSeconds, this.template = c.template, this.appendWidgetTo = c.appendWidgetTo, this.showWidgetOnAddonClick = c.showWidgetOnAddonClick, this.icons = c.icons, this.maxHours = c.maxHours, this.explicitMode = c.explicitMode, this.handleDocumentClick = function (a) {
      var b = a.data.scope;
      b.$element.parent().find(a.target).length || b.$widget.is(a.target) || b.$widget.find(a.target).length || b.hideWidget();
    }, this._init();
  };

  d.prototype = {
    constructor: d,
    _init: function _init() {
      var b = this;
      this.showWidgetOnAddonClick && this.$element.parent().hasClass("input-group") && this.$element.parent().hasClass("bootstrap-timepicker") ? (this.$element.parent(".input-group.bootstrap-timepicker").find(".input-group-addon").on({
        "click.timepicker": a.proxy(this.showWidget, this)
      }), this.$element.on({
        "focus.timepicker": a.proxy(this.highlightUnit, this),
        "click.timepicker": a.proxy(this.highlightUnit, this),
        "keydown.timepicker": a.proxy(this.elementKeydown, this),
        "blur.timepicker": a.proxy(this.blurElement, this),
        "mousewheel.timepicker DOMMouseScroll.timepicker": a.proxy(this.mousewheel, this)
      })) : this.template ? this.$element.on({
        "focus.timepicker": a.proxy(this.showWidget, this),
        "click.timepicker": a.proxy(this.showWidget, this),
        "blur.timepicker": a.proxy(this.blurElement, this),
        "mousewheel.timepicker DOMMouseScroll.timepicker": a.proxy(this.mousewheel, this)
      }) : this.$element.on({
        "focus.timepicker": a.proxy(this.highlightUnit, this),
        "click.timepicker": a.proxy(this.highlightUnit, this),
        "keydown.timepicker": a.proxy(this.elementKeydown, this),
        "blur.timepicker": a.proxy(this.blurElement, this),
        "mousewheel.timepicker DOMMouseScroll.timepicker": a.proxy(this.mousewheel, this)
      }), this.template !== !1 ? this.$widget = a(this.getTemplate()).on("click", a.proxy(this.widgetClick, this)) : this.$widget = !1, this.showInputs && this.$widget !== !1 && this.$widget.find("input").each(function () {
        a(this).on({
          "click.timepicker": function clickTimepicker() {
            a(this).select();
          },
          "keydown.timepicker": a.proxy(b.widgetKeydown, b),
          "keyup.timepicker": a.proxy(b.widgetKeyup, b)
        });
      }), this.setDefaultTime(this.defaultTime);
    },
    blurElement: function blurElement() {
      this.highlightedUnit = null, this.updateFromElementVal();
    },
    clear: function clear() {
      this.hour = "", this.minute = "", this.second = "", this.meridian = "", this.$element.val("");
    },
    decrementHour: function decrementHour() {
      if (this.showMeridian) {
        if (1 === this.hour) this.hour = 12;else {
          if (12 === this.hour) return this.hour--, this.toggleMeridian();
          if (0 === this.hour) return this.hour = 11, this.toggleMeridian();
          this.hour--;
        }
      } else this.hour <= 0 ? this.hour = this.maxHours - 1 : this.hour--;
    },
    decrementMinute: function decrementMinute(a) {
      var b;
      b = a ? this.minute - a : this.minute - this.minuteStep, 0 > b ? (this.decrementHour(), this.minute = b + 60) : this.minute = b;
    },
    decrementSecond: function decrementSecond() {
      var a = this.second - this.secondStep;
      0 > a ? (this.decrementMinute(!0), this.second = a + 60) : this.second = a;
    },
    elementKeydown: function elementKeydown(a) {
      switch (a.which) {
        case 9:
          if (a.shiftKey) {
            if ("hour" === this.highlightedUnit) {
              this.hideWidget();
              break;
            }

            this.highlightPrevUnit();
          } else {
            if (this.showMeridian && "meridian" === this.highlightedUnit || this.showSeconds && "second" === this.highlightedUnit || !this.showMeridian && !this.showSeconds && "minute" === this.highlightedUnit) {
              this.hideWidget();
              break;
            }

            this.highlightNextUnit();
          }

          a.preventDefault(), this.updateFromElementVal();
          break;

        case 27:
          this.updateFromElementVal();
          break;

        case 37:
          a.preventDefault(), this.highlightPrevUnit(), this.updateFromElementVal();
          break;

        case 38:
          switch (a.preventDefault(), this.highlightedUnit) {
            case "hour":
              this.incrementHour(), this.highlightHour();
              break;

            case "minute":
              this.incrementMinute(), this.highlightMinute();
              break;

            case "second":
              this.incrementSecond(), this.highlightSecond();
              break;

            case "meridian":
              this.toggleMeridian(), this.highlightMeridian();
          }

          this.update();
          break;

        case 39:
          a.preventDefault(), this.highlightNextUnit(), this.updateFromElementVal();
          break;

        case 40:
          switch (a.preventDefault(), this.highlightedUnit) {
            case "hour":
              this.decrementHour(), this.highlightHour();
              break;

            case "minute":
              this.decrementMinute(), this.highlightMinute();
              break;

            case "second":
              this.decrementSecond(), this.highlightSecond();
              break;

            case "meridian":
              this.toggleMeridian(), this.highlightMeridian();
          }

          this.update();
      }
    },
    getCursorPosition: function getCursorPosition() {
      var a = this.$element.get(0);
      if ("selectionStart" in a) return a.selectionStart;

      if (c.selection) {
        a.focus();
        var b = c.selection.createRange(),
            d = c.selection.createRange().text.length;
        return b.moveStart("character", -a.value.length), b.text.length - d;
      }
    },
    getTemplate: function getTemplate() {
      var a, b, c, d, e, f;

      switch (this.showInputs ? (b = '<input type="text" class="bootstrap-timepicker-hour" maxlength="2"/>', c = '<input type="text" class="bootstrap-timepicker-minute" maxlength="2"/>', d = '<input type="text" class="bootstrap-timepicker-second" maxlength="2"/>', e = '<input type="text" class="bootstrap-timepicker-meridian" maxlength="2"/>') : (b = '<span class="bootstrap-timepicker-hour"></span>', c = '<span class="bootstrap-timepicker-minute"></span>', d = '<span class="bootstrap-timepicker-second"></span>', e = '<span class="bootstrap-timepicker-meridian"></span>'), f = '<table><tr><td><a href="#" data-action="incrementHour"><span class="' + this.icons.up + '"></span></a></td><td class="separator">&nbsp;</td><td><a href="#" data-action="incrementMinute"><span class="' + this.icons.up + '"></span></a></td>' + (this.showSeconds ? '<td class="separator">&nbsp;</td><td><a href="#" data-action="incrementSecond"><span class="' + this.icons.up + '"></span></a></td>' : "") + (this.showMeridian ? '<td class="separator">&nbsp;</td><td class="meridian-column"><a href="#" data-action="toggleMeridian"><span class="' + this.icons.up + '"></span></a></td>' : "") + "</tr><tr><td>" + b + '</td> <td class="separator">:</td><td>' + c + "</td> " + (this.showSeconds ? '<td class="separator">:</td><td>' + d + "</td>" : "") + (this.showMeridian ? '<td class="separator">&nbsp;</td><td>' + e + "</td>" : "") + '</tr><tr><td><a href="#" data-action="decrementHour"><span class="' + this.icons.down + '"></span></a></td><td class="separator"></td><td><a href="#" data-action="decrementMinute"><span class="' + this.icons.down + '"></span></a></td>' + (this.showSeconds ? '<td class="separator">&nbsp;</td><td><a href="#" data-action="decrementSecond"><span class="' + this.icons.down + '"></span></a></td>' : "") + (this.showMeridian ? '<td class="separator">&nbsp;</td><td><a href="#" data-action="toggleMeridian"><span class="' + this.icons.down + '"></span></a></td>' : "") + "</tr></table>", this.template) {
        case "modal":
          a = '<div class="bootstrap-timepicker-widget modal hide fade in" data-backdrop="' + (this.modalBackdrop ? "true" : "false") + '"><div class="modal-header"><a href="#" class="close" data-dismiss="modal">&times;</a><h3>Pick a Time</h3></div><div class="modal-content">' + f + '</div><div class="modal-footer"><a href="#" class="btn btn-primary" data-dismiss="modal">OK</a></div></div>';
          break;

        case "dropdown":
          a = '<div class="bootstrap-timepicker-widget dropdown-menu">' + f + "</div>";
      }

      return a;
    },
    getTime: function getTime() {
      return "" === this.hour ? "" : this.hour + ":" + (1 === this.minute.toString().length ? "0" + this.minute : this.minute) + (this.showSeconds ? ":" + (1 === this.second.toString().length ? "0" + this.second : this.second) : "") + (this.showMeridian ? " " + this.meridian : "");
    },
    hideWidget: function hideWidget() {
      this.isOpen !== !1 && (this.$element.trigger({
        type: "hide.timepicker",
        time: {
          value: this.getTime(),
          hours: this.hour,
          minutes: this.minute,
          seconds: this.second,
          meridian: this.meridian
        }
      }), "modal" === this.template && this.$widget.modal ? this.$widget.modal("hide") : this.$widget.removeClass("open"), a(c).off("mousedown.timepicker, touchend.timepicker", this.handleDocumentClick), this.isOpen = !1, this.$widget.detach());
    },
    highlightUnit: function highlightUnit() {
      this.position = this.getCursorPosition(), this.position >= 0 && this.position <= 2 ? this.highlightHour() : this.position >= 3 && this.position <= 5 ? this.highlightMinute() : this.position >= 6 && this.position <= 8 ? this.showSeconds ? this.highlightSecond() : this.highlightMeridian() : this.position >= 9 && this.position <= 11 && this.highlightMeridian();
    },
    highlightNextUnit: function highlightNextUnit() {
      switch (this.highlightedUnit) {
        case "hour":
          this.highlightMinute();
          break;

        case "minute":
          this.showSeconds ? this.highlightSecond() : this.showMeridian ? this.highlightMeridian() : this.highlightHour();
          break;

        case "second":
          this.showMeridian ? this.highlightMeridian() : this.highlightHour();
          break;

        case "meridian":
          this.highlightHour();
      }
    },
    highlightPrevUnit: function highlightPrevUnit() {
      switch (this.highlightedUnit) {
        case "hour":
          this.showMeridian ? this.highlightMeridian() : this.showSeconds ? this.highlightSecond() : this.highlightMinute();
          break;

        case "minute":
          this.highlightHour();
          break;

        case "second":
          this.highlightMinute();
          break;

        case "meridian":
          this.showSeconds ? this.highlightSecond() : this.highlightMinute();
      }
    },
    highlightHour: function highlightHour() {
      var a = this.$element.get(0),
          b = this;
      this.highlightedUnit = "hour", a.setSelectionRange && setTimeout(function () {
        b.hour < 10 ? a.setSelectionRange(0, 1) : a.setSelectionRange(0, 2);
      }, 0);
    },
    highlightMinute: function highlightMinute() {
      var a = this.$element.get(0),
          b = this;
      this.highlightedUnit = "minute", a.setSelectionRange && setTimeout(function () {
        b.hour < 10 ? a.setSelectionRange(2, 4) : a.setSelectionRange(3, 5);
      }, 0);
    },
    highlightSecond: function highlightSecond() {
      var a = this.$element.get(0),
          b = this;
      this.highlightedUnit = "second", a.setSelectionRange && setTimeout(function () {
        b.hour < 10 ? a.setSelectionRange(5, 7) : a.setSelectionRange(6, 8);
      }, 0);
    },
    highlightMeridian: function highlightMeridian() {
      var a = this.$element.get(0),
          b = this;
      this.highlightedUnit = "meridian", a.setSelectionRange && (this.showSeconds ? setTimeout(function () {
        b.hour < 10 ? a.setSelectionRange(8, 10) : a.setSelectionRange(9, 11);
      }, 0) : setTimeout(function () {
        b.hour < 10 ? a.setSelectionRange(5, 7) : a.setSelectionRange(6, 8);
      }, 0));
    },
    incrementHour: function incrementHour() {
      if (this.showMeridian) {
        if (11 === this.hour) return this.hour++, this.toggleMeridian();
        12 === this.hour && (this.hour = 0);
      }

      return this.hour === this.maxHours - 1 ? void (this.hour = 0) : void this.hour++;
    },
    incrementMinute: function incrementMinute(a) {
      var b;
      b = a ? this.minute + a : this.minute + this.minuteStep - this.minute % this.minuteStep, b > 59 ? (this.incrementHour(), this.minute = b - 60) : this.minute = b;
    },
    incrementSecond: function incrementSecond() {
      var a = this.second + this.secondStep - this.second % this.secondStep;
      a > 59 ? (this.incrementMinute(!0), this.second = a - 60) : this.second = a;
    },
    mousewheel: function mousewheel(b) {
      if (!this.disableMousewheel) {
        b.preventDefault(), b.stopPropagation();
        var c = b.originalEvent.wheelDelta || -b.originalEvent.detail,
            d = null;

        switch ("mousewheel" === b.type ? d = -1 * b.originalEvent.wheelDelta : "DOMMouseScroll" === b.type && (d = 40 * b.originalEvent.detail), d && (b.preventDefault(), a(this).scrollTop(d + a(this).scrollTop())), this.highlightedUnit) {
          case "minute":
            c > 0 ? this.incrementMinute() : this.decrementMinute(), this.highlightMinute();
            break;

          case "second":
            c > 0 ? this.incrementSecond() : this.decrementSecond(), this.highlightSecond();
            break;

          case "meridian":
            this.toggleMeridian(), this.highlightMeridian();
            break;

          default:
            c > 0 ? this.incrementHour() : this.decrementHour(), this.highlightHour();
        }

        return !1;
      }
    },
    changeToNearestStep: function changeToNearestStep(a, b) {
      return a % b === 0 ? a : Math.round(a % b / b) ? (a + (b - a % b)) % 60 : a - a % b;
    },
    place: function place() {
      if (!this.isInline) {
        var c = this.$widget.outerWidth(),
            d = this.$widget.outerHeight(),
            e = 10,
            f = a(b).width(),
            g = a(b).height(),
            h = a(b).scrollTop(),
            i = parseInt(this.$element.parents().filter(function () {
          return "auto" !== a(this).css("z-index");
        }).first().css("z-index"), 10) + 10,
            j = this.component ? this.component.parent().offset() : this.$element.offset(),
            k = this.component ? this.component.outerHeight(!0) : this.$element.outerHeight(!1),
            l = this.component ? this.component.outerWidth(!0) : this.$element.outerWidth(!1),
            m = j.left,
            n = j.top;
        this.$widget.removeClass("timepicker-orient-top timepicker-orient-bottom timepicker-orient-right timepicker-orient-left"), "auto" !== this.orientation.x ? (this.$widget.addClass("timepicker-orient-" + this.orientation.x), "right" === this.orientation.x && (m -= c - l)) : (this.$widget.addClass("timepicker-orient-left"), j.left < 0 ? m -= j.left - e : j.left + c > f && (m = f - c - e));
        var o,
            p,
            q = this.orientation.y;
        "auto" === q && (o = -h + j.top - d, p = h + g - (j.top + k + d), q = Math.max(o, p) === p ? "top" : "bottom"), this.$widget.addClass("timepicker-orient-" + q), "top" === q ? n += k : n -= d + parseInt(this.$widget.css("padding-top"), 10), this.$widget.css({
          top: n,
          left: m,
          zIndex: i
        });
      }
    },
    remove: function remove() {
      a("document").off(".timepicker"), this.$widget && this.$widget.remove(), delete this.$element.data().timepicker;
    },
    setDefaultTime: function setDefaultTime(a) {
      if (this.$element.val()) this.updateFromElementVal();else if ("current" === a) {
        var b = new Date(),
            c = b.getHours(),
            d = b.getMinutes(),
            e = b.getSeconds(),
            f = "AM";
        0 !== e && (e = Math.ceil(b.getSeconds() / this.secondStep) * this.secondStep, 60 === e && (d += 1, e = 0)), 0 !== d && (d = Math.ceil(b.getMinutes() / this.minuteStep) * this.minuteStep, 60 === d && (c += 1, d = 0)), this.showMeridian && (0 === c ? c = 12 : c >= 12 ? (c > 12 && (c -= 12), f = "PM") : f = "AM"), this.hour = c, this.minute = d, this.second = e, this.meridian = f, this.update();
      } else a === !1 ? (this.hour = 0, this.minute = 0, this.second = 0, this.meridian = "AM") : this.setTime(a);
    },
    setTime: function setTime(a, b) {
      if (!a) return void this.clear();
      var c, d, e, f, g, h;
      if ("object" == _typeof(a) && a.getMonth) e = a.getHours(), f = a.getMinutes(), g = a.getSeconds(), this.showMeridian && (h = "AM", e > 12 && (h = "PM", e %= 12), 12 === e && (h = "PM"));else {
        if (c = (/a/i.test(a) ? 1 : 0) + (/p/i.test(a) ? 2 : 0), c > 2) return void this.clear();
        if (d = a.replace(/[^0-9\:]/g, "").split(":"), e = d[0] ? d[0].toString() : d.toString(), this.explicitMode && e.length > 2 && e.length % 2 !== 0) return void this.clear();
        f = d[1] ? d[1].toString() : "", g = d[2] ? d[2].toString() : "", e.length > 4 && (g = e.slice(-2), e = e.slice(0, -2)), e.length > 2 && (f = e.slice(-2), e = e.slice(0, -2)), f.length > 2 && (g = f.slice(-2), f = f.slice(0, -2)), e = parseInt(e, 10), f = parseInt(f, 10), g = parseInt(g, 10), isNaN(e) && (e = 0), isNaN(f) && (f = 0), isNaN(g) && (g = 0), g > 59 && (g = 59), f > 59 && (f = 59), e >= this.maxHours && (e = this.maxHours - 1), this.showMeridian ? (e > 12 && (c = 2, e -= 12), c || (c = 1), 0 === e && (e = 12), h = 1 === c ? "AM" : "PM") : 12 > e && 2 === c ? e += 12 : e >= this.maxHours ? e = this.maxHours - 1 : (0 > e || 12 === e && 1 === c) && (e = 0);
      }
      this.hour = e, this.snapToStep ? (this.minute = this.changeToNearestStep(f, this.minuteStep), this.second = this.changeToNearestStep(g, this.secondStep)) : (this.minute = f, this.second = g), this.meridian = h, this.update(b);
    },
    showWidget: function showWidget() {
      this.isOpen || this.$element.is(":disabled") || (this.$widget.appendTo(this.appendWidgetTo), a(c).on("mousedown.timepicker, touchend.timepicker", {
        scope: this
      }, this.handleDocumentClick), this.$element.trigger({
        type: "show.timepicker",
        time: {
          value: this.getTime(),
          hours: this.hour,
          minutes: this.minute,
          seconds: this.second,
          meridian: this.meridian
        }
      }), this.place(), this.disableFocus && this.$element.blur(), "" === this.hour && (this.defaultTime ? this.setDefaultTime(this.defaultTime) : this.setTime("0:0:0")), "modal" === this.template && this.$widget.modal ? this.$widget.modal("show").on("hidden", a.proxy(this.hideWidget, this)) : this.isOpen === !1 && this.$widget.addClass("open"), this.isOpen = !0);
    },
    toggleMeridian: function toggleMeridian() {
      this.meridian = "AM" === this.meridian ? "PM" : "AM";
    },
    update: function update(a) {
      this.updateElement(), a || this.updateWidget(), this.$element.trigger({
        type: "changeTime.timepicker",
        time: {
          value: this.getTime(),
          hours: this.hour,
          minutes: this.minute,
          seconds: this.second,
          meridian: this.meridian
        }
      });
    },
    updateElement: function updateElement() {
      this.$element.val(this.getTime()).change();
    },
    updateFromElementVal: function updateFromElementVal() {
      this.setTime(this.$element.val());
    },
    updateWidget: function updateWidget() {
      if (this.$widget !== !1) {
        var a = this.hour,
            b = 1 === this.minute.toString().length ? "0" + this.minute : this.minute,
            c = 1 === this.second.toString().length ? "0" + this.second : this.second;
        this.showInputs ? (this.$widget.find("input.bootstrap-timepicker-hour").val(a), this.$widget.find("input.bootstrap-timepicker-minute").val(b), this.showSeconds && this.$widget.find("input.bootstrap-timepicker-second").val(c), this.showMeridian && this.$widget.find("input.bootstrap-timepicker-meridian").val(this.meridian)) : (this.$widget.find("span.bootstrap-timepicker-hour").text(a), this.$widget.find("span.bootstrap-timepicker-minute").text(b), this.showSeconds && this.$widget.find("span.bootstrap-timepicker-second").text(c), this.showMeridian && this.$widget.find("span.bootstrap-timepicker-meridian").text(this.meridian));
      }
    },
    updateFromWidgetInputs: function updateFromWidgetInputs() {
      if (this.$widget !== !1) {
        var a = this.$widget.find("input.bootstrap-timepicker-hour").val() + ":" + this.$widget.find("input.bootstrap-timepicker-minute").val() + (this.showSeconds ? ":" + this.$widget.find("input.bootstrap-timepicker-second").val() : "") + (this.showMeridian ? this.$widget.find("input.bootstrap-timepicker-meridian").val() : "");
        this.setTime(a, !0);
      }
    },
    widgetClick: function widgetClick(b) {
      b.stopPropagation(), b.preventDefault();
      var c = a(b.target),
          d = c.closest("a").data("action");
      d && this[d](), this.update(), c.is("input") && c.get(0).setSelectionRange(0, 2);
    },
    widgetKeydown: function widgetKeydown(b) {
      var c = a(b.target),
          d = c.attr("class").replace("bootstrap-timepicker-", "");

      switch (b.which) {
        case 9:
          if (b.shiftKey) {
            if ("hour" === d) return this.hideWidget();
          } else if (this.showMeridian && "meridian" === d || this.showSeconds && "second" === d || !this.showMeridian && !this.showSeconds && "minute" === d) return this.hideWidget();

          break;

        case 27:
          this.hideWidget();
          break;

        case 38:
          switch (b.preventDefault(), d) {
            case "hour":
              this.incrementHour();
              break;

            case "minute":
              this.incrementMinute();
              break;

            case "second":
              this.incrementSecond();
              break;

            case "meridian":
              this.toggleMeridian();
          }

          this.setTime(this.getTime()), c.get(0).setSelectionRange(0, 2);
          break;

        case 40:
          switch (b.preventDefault(), d) {
            case "hour":
              this.decrementHour();
              break;

            case "minute":
              this.decrementMinute();
              break;

            case "second":
              this.decrementSecond();
              break;

            case "meridian":
              this.toggleMeridian();
          }

          this.setTime(this.getTime()), c.get(0).setSelectionRange(0, 2);
      }
    },
    widgetKeyup: function widgetKeyup(a) {
      (65 === a.which || 77 === a.which || 80 === a.which || 46 === a.which || 8 === a.which || a.which >= 48 && a.which <= 57 || a.which >= 96 && a.which <= 105) && this.updateFromWidgetInputs();
    }
  }, a.fn.timepicker = function (b) {
    var c = Array.apply(null, arguments);
    return c.shift(), this.each(function () {
      var e = a(this),
          f = e.data("timepicker"),
          g = "object" == _typeof(b) && b;
      f || e.data("timepicker", f = new d(this, a.extend({}, a.fn.timepicker.defaults, g, a(this).data()))), "string" == typeof b && f[b].apply(f, c);
    });
  }, a.fn.timepicker.defaults = {
    defaultTime: "current",
    disableFocus: !1,
    disableMousewheel: !1,
    isOpen: !1,
    minuteStep: 15,
    modalBackdrop: !1,
    orientation: {
      x: "auto",
      y: "auto"
    },
    secondStep: 15,
    snapToStep: !1,
    showSeconds: !1,
    showInputs: !0,
    showMeridian: !0,
    template: "dropdown",
    appendWidgetTo: "body",
    showWidgetOnAddonClick: !0,
    icons: {
      up: "glyphicon glyphicon-chevron-up",
      down: "glyphicon glyphicon-chevron-down"
    },
    maxHours: 24,
    explicitMode: !1
  }, a.fn.timepicker.Constructor = d, a(c).on("focus.timepicker.data-api click.timepicker.data-api", '[data-provide="timepicker"]', function (b) {
    var c = a(this);
    c.data("timepicker") || (b.preventDefault(), c.timepicker());
  });
}(jQuery, window, document);

/***/ })

},[["./assets/js/app.js","runtime","vendors~app"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LmNhdGVnb3JpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnBpZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvSW9uaWNvbnMvY3NzL2lvbmljb25zLm1pbi5jc3M/OTlkZCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAtZGF0ZXBpY2tlci9kaXN0L2Nzcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uY3NzPzNlNjkiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwLWRhdGVwaWNrZXIvZGlzdC9qcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC10aGVtZS5taW4uY3NzP2Y2MmQiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzPzAxZDkiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9mb250LWF3ZXNvbWUvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzPzA1YjciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Nzcy9hcHAuY3NzPzM1Y2UiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL0FkbWluTFRFLm1pbi5jc3M/NWI0OCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZGlzdC9jc3Mvc2tpbnMvc2tpbi1ibHVlLmNzcz9lZTRlIiwid2VicGFjazovLy8uL2Fzc2V0cy9kaXN0L2pzL2FkbWlubHRlLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvYXBwLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9jdXN0b20uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3BsdWdpbnMvaUNoZWNrL2FsbC5jc3M/NWQyZCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvcGx1Z2lucy9pQ2hlY2svaWNoZWNrLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvcGx1Z2lucy90aW1lcGlja2VyL2Jvb3RzdHJhcC10aW1lcGlja2VyLm1pbi5qcyJdLCJuYW1lcyI6WyJqUXVlcnkiLCJFcnJvciIsImEiLCJiIiwiZWFjaCIsImUiLCJnIiwiZGF0YSIsImMiLCJoIiwiZXh0ZW5kIiwiZCIsImYiLCJzb3VyY2UiLCJwYXJhbXMiLCJ0cmlnZ2VyIiwiY29udGVudCIsImxvYWRJbkNvbnRlbnQiLCJyZXNwb25zZVR5cGUiLCJvdmVybGF5VGVtcGxhdGUiLCJvbkxvYWRTdGFydCIsIm9uTG9hZERvbmUiLCJlbGVtZW50Iiwib3B0aW9ucyIsIiRvdmVybGF5IiwiX3NldFVwTGlzdGVuZXJzIiwibG9hZCIsInByb3RvdHlwZSIsIl9hZGRPdmVybGF5IiwiY2FsbCIsImdldCIsImZpbmQiLCJodG1sIiwiX3JlbW92ZU92ZXJsYXkiLCJiaW5kIiwib24iLCJwcmV2ZW50RGVmYXVsdCIsImFwcGVuZCIsInJlbW92ZSIsImZuIiwiYm94UmVmcmVzaCIsIkNvbnN0cnVjdG9yIiwibm9Db25mbGljdCIsIndpbmRvdyIsImFuaW1hdGlvblNwZWVkIiwiY29sbGFwc2VUcmlnZ2VyIiwicmVtb3ZlVHJpZ2dlciIsImNvbGxhcHNlSWNvbiIsImV4cGFuZEljb24iLCJyZW1vdmVJY29uIiwiY29sbGFwc2VkIiwiaGVhZGVyIiwiYm9keSIsImZvb3RlciIsInRvb2xzIiwiY29sbGFwc2luZyIsImV4cGFuZGluZyIsImV4cGFuZGVkIiwicmVtb3ZpbmciLCJyZW1vdmVkIiwidG9nZ2xlIiwiaXMiLCJleHBhbmQiLCJjb2xsYXBzZSIsIkV2ZW50IiwicmVtb3ZlQ2xhc3MiLCJjaGlsZHJlbiIsImFkZENsYXNzIiwic2xpZGVEb3duIiwic2xpZGVVcCIsImV4cGFuZGluZ0V2ZW50IiwiaSIsImJveFdpZGdldCIsInNsaWRlIiwic2lkZWJhciIsIm9wZW4iLCJiZyIsIndyYXBwZXIiLCJib3hlZCIsImZpeGVkIiwiaGFzQmluZGVkUmVzaXplIiwiaW5pdCIsImZpeCIsInJlc2l6ZSIsIl9maXhGb3JCb3hlZCIsImNzcyIsInBvc2l0aW9uIiwiaGVpZ2h0IiwiY29udHJvbFNpZGViYXIiLCJkb2N1bWVudCIsImJveCIsInBhcmVudHMiLCJmaXJzdCIsInRvZ2dsZUNsYXNzIiwiZGlyZWN0Q2hhdCIsInNsaW1zY3JvbGwiLCJyZXNldEhlaWdodCIsImNvbnRlbnRXcmFwcGVyIiwibGF5b3V0Qm94ZWQiLCJtYWluRm9vdGVyIiwibWFpbkhlYWRlciIsInNpZGViYXJNZW51IiwibG9nbyIsImhvbGRUcmFuc2l0aW9uIiwiYmluZGVkUmVzaXplIiwiYWN0aXZhdGUiLCJmaXhTaWRlYmFyIiwib25lIiwib3V0ZXJIZWlnaHQiLCJoYXNDbGFzcyIsImoiLCJzbGltU2Nyb2xsIiwiZGVzdHJveSIsImxheW91dCIsIkNvbnN0dWN0b3IiLCJjb2xsYXBzZVNjcmVlblNpemUiLCJleHBhbmRPbkhvdmVyIiwiZXhwYW5kVHJhbnNpdGlvbkRlbGF5IiwibWFpblNpZGViYXIiLCJzZWFyY2hJbnB1dCIsImJ1dHRvbiIsIm1pbmkiLCJsYXlvdXRGaXhlZCIsImV4cGFuZEZlYXR1cmUiLCJjbGljayIsIndpZHRoIiwiY2xvc2UiLCJzdG9wUHJvcGFnYXRpb24iLCJob3ZlciIsInNldFRpbWVvdXQiLCJwdXNoTWVudSIsIm9uQ2hlY2siLCJvblVuQ2hlY2siLCJkb25lIiwibGkiLCJwcm9wIiwidW5DaGVjayIsImNoZWNrIiwidG9kb0xpc3QiLCJhY2NvcmRpb24iLCJmb2xsb3dMaW5rIiwidHJlZSIsInRyZWV2aWV3IiwidHJlZXZpZXdNZW51IiwiYWN0aXZlIiwibmV4dCIsInBhcmVudCIsImF0dHIiLCJzaWJsaW5ncyIsInJlcXVpcmUiLCIkIiwicmVhZHkiLCJkaXNwbGF5IiwidGFibGUiLCJyb3dzIiwibGVuZ3RoIiwidHIiLCJjbG9uZSIsInVuZGVmaW5lZCIsInJlcGxhY2UiLCJhcHBlbmRUbyIsInNob3ciLCJwYXJlbnRNb2RhbCIsInZhbCIsImhpZGUiLCJ0ZXh0IiwiY2hhbmdlIiwiZXZlbnQiLCJjb25maXJtIiwibW9kYWwiLCJuciIsIkZvcm1EYXRhIiwiZm9ybSIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwicHJvY2Vzc0RhdGEiLCJjb250ZW50VHlwZSIsInN1Y2Nlc3MiLCJlcnJvciIsImFsZXJ0IiwiaWQiLCJzZWxlY3QiLCJsYWJlbCIsIm5hbWUiLCJkYXRhMiIsInZhbHVlIiwidGltZSIsImlkcyIsInB1c2giLCJkcmF3Q2hhcnQiLCJ0b29sdGlwIiwiaUNoZWNrIiwiY2hlY2tib3hDbGFzcyIsInJhZGlvQ2xhc3MiLCJtZXRob2QiLCJjb21wbGV0ZSIsInhociIsInN0YXR1cyIsImdvb2dsZSIsInZpc3VhbGl6YXRpb24iLCJEYXRhVGFibGUiLCJjaGFydCIsIkNvbWJvQ2hhcnQiLCJnZXRFbGVtZW50QnlJZCIsImJhciIsImdyb3VwV2lkdGgiLCJjdXJ2ZVR5cGUiLCJzZXJpZXNUeXBlIiwic2VyaWVzIiwibGVnZW5kIiwidkF4ZXMiLCJkaXJlY3Rpb24iLCJyZXNwb25zZVRleHQiLCJqc29uIiwicmVzcG9uc2VKU09OIiwiYWRkQ29sdW1uIiwidGFyZ2V0QXhpc0luZGV4IiwiYmFja2dyb3VuZENvbG9yIiwiYWRkUm93cyIsImRyYXciLCJjbGVhckNoYXJ0IiwiRiIsInRlc3QiLCJtIiwicyIsImwiLCJIIiwiY2hlY2tlZCIsImRpc2FibGVkIiwiaW5kZXRlcm1pbmF0ZSIsInciLCJEIiwidCIsInAiLCJuIiwidSIsIkEiLCJCIiwiSyIsIkUiLCJrIiwieCIsIk4iLCJDIiwiY2xvc2VzdCIsInIiLCJxIiwiTCIsInkiLCJJIiwidiIsInoiLCJNIiwib2ZmIiwidW53cmFwIiwiRyIsImFkZCIsIm8iLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiSiIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaXNGdW5jdGlvbiIsImNoZWNrZWRDbGFzcyIsImRpc2FibGVkQ2xhc3MiLCJpbmRldGVybWluYXRlQ2xhc3MiLCJsYWJlbEhvdmVyIiwiYXJpYSIsImhhbmRsZSIsImhvdmVyQ2xhc3MiLCJmb2N1c0NsYXNzIiwiYWN0aXZlQ2xhc3MiLCJsYWJlbEhvdmVyQ2xhc3MiLCJpbmNyZWFzZUFyZWEiLCJ0b3AiLCJsZWZ0IiwibWFyZ2luIiwicGFkZGluZyIsImJhY2tncm91bmQiLCJib3JkZXIiLCJvcGFjaXR5IiwidmlzaWJpbGl0eSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsIndyYXAiLCJpbnNlcnQiLCJpbmhlcml0Q2xhc3MiLCJjbGFzc05hbWUiLCJpbmhlcml0SUQiLCJ0YXJnZXQiLCJrZXlDb2RlIiwiWmVwdG8iLCJ3aWRnZXQiLCIkZWxlbWVudCIsImRlZmF1bHRUaW1lIiwiZGlzYWJsZUZvY3VzIiwiZGlzYWJsZU1vdXNld2hlZWwiLCJpc09wZW4iLCJtaW51dGVTdGVwIiwibW9kYWxCYWNrZHJvcCIsIm9yaWVudGF0aW9uIiwic2Vjb25kU3RlcCIsInNuYXBUb1N0ZXAiLCJzaG93SW5wdXRzIiwic2hvd01lcmlkaWFuIiwic2hvd1NlY29uZHMiLCJ0ZW1wbGF0ZSIsImFwcGVuZFdpZGdldFRvIiwic2hvd1dpZGdldE9uQWRkb25DbGljayIsImljb25zIiwibWF4SG91cnMiLCJleHBsaWNpdE1vZGUiLCJoYW5kbGVEb2N1bWVudENsaWNrIiwic2NvcGUiLCIkd2lkZ2V0IiwiaGlkZVdpZGdldCIsIl9pbml0IiwiY29uc3RydWN0b3IiLCJwcm94eSIsInNob3dXaWRnZXQiLCJoaWdobGlnaHRVbml0IiwiZWxlbWVudEtleWRvd24iLCJibHVyRWxlbWVudCIsIm1vdXNld2hlZWwiLCJnZXRUZW1wbGF0ZSIsIndpZGdldENsaWNrIiwid2lkZ2V0S2V5ZG93biIsIndpZGdldEtleXVwIiwic2V0RGVmYXVsdFRpbWUiLCJoaWdobGlnaHRlZFVuaXQiLCJ1cGRhdGVGcm9tRWxlbWVudFZhbCIsImNsZWFyIiwiaG91ciIsIm1pbnV0ZSIsInNlY29uZCIsIm1lcmlkaWFuIiwiZGVjcmVtZW50SG91ciIsInRvZ2dsZU1lcmlkaWFuIiwiZGVjcmVtZW50TWludXRlIiwiZGVjcmVtZW50U2Vjb25kIiwid2hpY2giLCJzaGlmdEtleSIsImhpZ2hsaWdodFByZXZVbml0IiwiaGlnaGxpZ2h0TmV4dFVuaXQiLCJpbmNyZW1lbnRIb3VyIiwiaGlnaGxpZ2h0SG91ciIsImluY3JlbWVudE1pbnV0ZSIsImhpZ2hsaWdodE1pbnV0ZSIsImluY3JlbWVudFNlY29uZCIsImhpZ2hsaWdodFNlY29uZCIsImhpZ2hsaWdodE1lcmlkaWFuIiwidXBkYXRlIiwiZ2V0Q3Vyc29yUG9zaXRpb24iLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbiIsImZvY3VzIiwiY3JlYXRlUmFuZ2UiLCJtb3ZlU3RhcnQiLCJ1cCIsImRvd24iLCJnZXRUaW1lIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kcyIsImRldGFjaCIsInNldFNlbGVjdGlvblJhbmdlIiwib3JpZ2luYWxFdmVudCIsIndoZWVsRGVsdGEiLCJkZXRhaWwiLCJzY3JvbGxUb3AiLCJjaGFuZ2VUb05lYXJlc3RTdGVwIiwicm91bmQiLCJwbGFjZSIsImlzSW5saW5lIiwib3V0ZXJXaWR0aCIsInBhcnNlSW50IiwiZmlsdGVyIiwiY29tcG9uZW50Iiwib2Zmc2V0IiwibWF4IiwiekluZGV4IiwidGltZXBpY2tlciIsIkRhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiY2VpbCIsInNldFRpbWUiLCJnZXRNb250aCIsInNwbGl0IiwiaXNOYU4iLCJibHVyIiwidXBkYXRlRWxlbWVudCIsInVwZGF0ZVdpZGdldCIsInVwZGF0ZUZyb21XaWRnZXRJbnB1dHMiLCJBcnJheSIsImFwcGx5IiwiYXJndW1lbnRzIiwic2hpZnQiLCJkZWZhdWx0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0JBQStCLFNBQVMscUJBQXFCLEVBQUU7O0FBRS9EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsd0NBQXdDO0FBQ2pFLHlCQUF5Qix3Q0FBd0M7O0FBRWpFO0FBQ0E7QUFDQSw2QkFBNkIsZ0ZBQWdGO0FBQzdHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQ0FBa0Msb0JBQW9CLEVBQUU7O0FBRXhEO0FBQ0E7O0FBRUE7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QUM5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELFFBQVE7QUFDMUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFF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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDLFVBQXZOO0FBQWtPQyxrQkFBYyxFQUFDLE1BQWpQO0FBQXdQQywwQkFBc0IsRUFBQyxDQUFDLENBQWhSO0FBQWtSQyxTQUFLLEVBQUM7QUFBQ2lELFFBQUUsRUFBQyxnQ0FBSjtBQUFxQ0MsVUFBSSxFQUFDO0FBQTFDLEtBQXhSO0FBQXNXakQsWUFBUSxFQUFDLEVBQS9XO0FBQWtYQyxnQkFBWSxFQUFDLENBQUM7QUFBaFksR0FBanFoQixFQUFvaWlCMVQsQ0FBQyxDQUFDcUMsRUFBRixDQUFLMlYsVUFBTCxDQUFnQnpWLFdBQWhCLEdBQTRCOUIsQ0FBaGtpQixFQUFra2lCVCxDQUFDLENBQUNNLENBQUQsQ0FBRCxDQUFLMkIsRUFBTCxDQUFRLHFEQUFSLEVBQThELDZCQUE5RCxFQUE0RixVQUFTaEMsQ0FBVCxFQUFXO0FBQUMsUUFBSUssQ0FBQyxHQUFDTixDQUFDLENBQUMsSUFBRCxDQUFQO0FBQWNNLEtBQUMsQ0FBQ0QsSUFBRixDQUFPLFlBQVAsTUFBdUJKLENBQUMsQ0FBQ2lDLGNBQUYsSUFBbUI1QixDQUFDLENBQUMwWCxVQUFGLEVBQTFDO0FBQTBELEdBQWhMLENBQWxraUI7QUFBb3ZpQixDQUF2amtCLENBQXdqa0JsWSxNQUF4amtCLEVBQStqa0IyQyxNQUEvamtCLEVBQXNra0I4QyxRQUF0a2tCLENBQUQsQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBGbG90IHBsdWdpbiBmb3IgcGxvdHRpbmcgdGV4dHVhbCBkYXRhIG9yIGNhdGVnb3JpZXMuXG5cbkNvcHlyaWdodCAoYykgMjAwNy0yMDE0IElPTEEgYW5kIE9sZSBMYXVyc2VuLlxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG5Db25zaWRlciBhIGRhdGFzZXQgbGlrZSBbW1wiRmVicnVhcnlcIiwgMzRdLCBbXCJNYXJjaFwiLCAyMF0sIC4uLl0uIFRoaXMgcGx1Z2luXG5hbGxvd3MgeW91IHRvIHBsb3Qgc3VjaCBhIGRhdGFzZXQgZGlyZWN0bHkuXG5cblRvIGVuYWJsZSBpdCwgeW91IG11c3Qgc3BlY2lmeSBtb2RlOiBcImNhdGVnb3JpZXNcIiBvbiB0aGUgYXhpcyB3aXRoIHRoZSB0ZXh0dWFsXG5sYWJlbHMsIGUuZy5cblxuXHQkLnBsb3QoXCIjcGxhY2Vob2xkZXJcIiwgZGF0YSwgeyB4YXhpczogeyBtb2RlOiBcImNhdGVnb3JpZXNcIiB9IH0pO1xuXG5CeSBkZWZhdWx0LCB0aGUgbGFiZWxzIGFyZSBvcmRlcmVkIGFzIHRoZXkgYXJlIG1ldCBpbiB0aGUgZGF0YSBzZXJpZXMuIElmIHlvdVxubmVlZCBhIGRpZmZlcmVudCBvcmRlcmluZywgeW91IGNhbiBzcGVjaWZ5IFwiY2F0ZWdvcmllc1wiIG9uIHRoZSBheGlzIG9wdGlvbnNcbmFuZCBsaXN0IHRoZSBjYXRlZ29yaWVzIHRoZXJlOlxuXG5cdHhheGlzOiB7XG5cdFx0bW9kZTogXCJjYXRlZ29yaWVzXCIsXG5cdFx0Y2F0ZWdvcmllczogW1wiRmVicnVhcnlcIiwgXCJNYXJjaFwiLCBcIkFwcmlsXCJdXG5cdH1cblxuSWYgeW91IG5lZWQgdG8gY3VzdG9taXplIHRoZSBkaXN0YW5jZXMgYmV0d2VlbiB0aGUgY2F0ZWdvcmllcywgeW91IGNhbiBzcGVjaWZ5XG5cImNhdGVnb3JpZXNcIiBhcyBhbiBvYmplY3QgbWFwcGluZyBsYWJlbHMgdG8gdmFsdWVzXG5cblx0eGF4aXM6IHtcblx0XHRtb2RlOiBcImNhdGVnb3JpZXNcIixcblx0XHRjYXRlZ29yaWVzOiB7IFwiRmVicnVhcnlcIjogMSwgXCJNYXJjaFwiOiAzLCBcIkFwcmlsXCI6IDQgfVxuXHR9XG5cbklmIHlvdSBkb24ndCBzcGVjaWZ5IGFsbCBjYXRlZ29yaWVzLCB0aGUgcmVtYWluaW5nIGNhdGVnb3JpZXMgd2lsbCBiZSBudW1iZXJlZFxuZnJvbSB0aGUgbWF4IHZhbHVlIHBsdXMgMSAod2l0aCBhIHNwYWNpbmcgb2YgMSBiZXR3ZWVuIGVhY2gpLlxuXG5JbnRlcm5hbGx5LCB0aGUgcGx1Z2luIHdvcmtzIGJ5IHRyYW5zZm9ybWluZyB0aGUgaW5wdXQgZGF0YSB0aHJvdWdoIGFuIGF1dG8tXG5nZW5lcmF0ZWQgbWFwcGluZyB3aGVyZSB0aGUgZmlyc3QgY2F0ZWdvcnkgYmVjb21lcyAwLCB0aGUgc2Vjb25kIDEsIGV0Yy5cbkhlbmNlLCBhIHBvaW50IGxpa2UgW1wiRmVicnVhcnlcIiwgMzRdIGJlY29tZXMgWzAsIDM0XSBpbnRlcm5hbGx5IGluIEZsb3QgKHRoaXNcbmlzIHZpc2libGUgaW4gaG92ZXIgYW5kIGNsaWNrIGV2ZW50cyB0aGF0IHJldHVybiBudW1iZXJzIHJhdGhlciB0aGFuIHRoZVxuY2F0ZWdvcnkgbGFiZWxzKS4gVGhlIHBsdWdpbiBhbHNvIG92ZXJyaWRlcyB0aGUgdGljayBnZW5lcmF0b3IgdG8gc3BpdCBvdXQgdGhlXG5jYXRlZ29yaWVzIGFzIHRpY2tzIGluc3RlYWQgb2YgdGhlIHZhbHVlcy5cblxuSWYgeW91IG5lZWQgdG8gbWFwIGEgdmFsdWUgYmFjayB0byBpdHMgbGFiZWwsIHRoZSBtYXBwaW5nIGlzIGFsd2F5cyBhY2Nlc3NpYmxlXG5hcyBcImNhdGVnb3JpZXNcIiBvbiB0aGUgYXhpcyBvYmplY3QsIGUuZy4gcGxvdC5nZXRBeGVzKCkueGF4aXMuY2F0ZWdvcmllcy5cblxuKi9cblxuKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHhheGlzOiB7XG4gICAgICAgICAgICBjYXRlZ29yaWVzOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHlheGlzOiB7XG4gICAgICAgICAgICBjYXRlZ29yaWVzOiBudWxsXG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGZ1bmN0aW9uIHByb2Nlc3NSYXdEYXRhKHBsb3QsIHNlcmllcywgZGF0YSwgZGF0YXBvaW50cykge1xuICAgICAgICAvLyBpZiBjYXRlZ29yaWVzIGFyZSBlbmFibGVkLCB3ZSBuZWVkIHRvIGRpc2FibGVcbiAgICAgICAgLy8gYXV0by10cmFuc2Zvcm1hdGlvbiB0byBudW1iZXJzIHNvIHRoZSBzdHJpbmdzIGFyZSBpbnRhY3RcbiAgICAgICAgLy8gZm9yIGxhdGVyIHByb2Nlc3NpbmdcblxuICAgICAgICB2YXIgeENhdGVnb3JpZXMgPSBzZXJpZXMueGF4aXMub3B0aW9ucy5tb2RlID09IFwiY2F0ZWdvcmllc1wiLFxuICAgICAgICAgICAgeUNhdGVnb3JpZXMgPSBzZXJpZXMueWF4aXMub3B0aW9ucy5tb2RlID09IFwiY2F0ZWdvcmllc1wiO1xuICAgICAgICBcbiAgICAgICAgaWYgKCEoeENhdGVnb3JpZXMgfHwgeUNhdGVnb3JpZXMpKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBmb3JtYXQgPSBkYXRhcG9pbnRzLmZvcm1hdDtcblxuICAgICAgICBpZiAoIWZvcm1hdCkge1xuICAgICAgICAgICAgLy8gRklYTUU6IGF1dG8tZGV0ZWN0aW9uIHNob3VsZCByZWFsbHkgbm90IGJlIGRlZmluZWQgaGVyZVxuICAgICAgICAgICAgdmFyIHMgPSBzZXJpZXM7XG4gICAgICAgICAgICBmb3JtYXQgPSBbXTtcbiAgICAgICAgICAgIGZvcm1hdC5wdXNoKHsgeDogdHJ1ZSwgbnVtYmVyOiB0cnVlLCByZXF1aXJlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGZvcm1hdC5wdXNoKHsgeTogdHJ1ZSwgbnVtYmVyOiB0cnVlLCByZXF1aXJlZDogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgaWYgKHMuYmFycy5zaG93IHx8IChzLmxpbmVzLnNob3cgJiYgcy5saW5lcy5maWxsKSkge1xuICAgICAgICAgICAgICAgIHZhciBhdXRvc2NhbGUgPSAhISgocy5iYXJzLnNob3cgJiYgcy5iYXJzLnplcm8pIHx8IChzLmxpbmVzLnNob3cgJiYgcy5saW5lcy56ZXJvKSk7XG4gICAgICAgICAgICAgICAgZm9ybWF0LnB1c2goeyB5OiB0cnVlLCBudW1iZXI6IHRydWUsIHJlcXVpcmVkOiBmYWxzZSwgZGVmYXVsdFZhbHVlOiAwLCBhdXRvc2NhbGU6IGF1dG9zY2FsZSB9KTtcbiAgICAgICAgICAgICAgICBpZiAocy5iYXJzLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm1hdFtmb3JtYXQubGVuZ3RoIC0gMV0ueTtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0W2Zvcm1hdC5sZW5ndGggLSAxXS54ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRhdGFwb2ludHMuZm9ybWF0ID0gZm9ybWF0O1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBmb3JtYXQubGVuZ3RoOyArK20pIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRbbV0ueCAmJiB4Q2F0ZWdvcmllcylcbiAgICAgICAgICAgICAgICBmb3JtYXRbbV0ubnVtYmVyID0gZmFsc2U7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChmb3JtYXRbbV0ueSAmJiB5Q2F0ZWdvcmllcylcbiAgICAgICAgICAgICAgICBmb3JtYXRbbV0ubnVtYmVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXROZXh0SW5kZXgoY2F0ZWdvcmllcykge1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIHYgaW4gY2F0ZWdvcmllcylcbiAgICAgICAgICAgIGlmIChjYXRlZ29yaWVzW3ZdID4gaW5kZXgpXG4gICAgICAgICAgICAgICAgaW5kZXggPSBjYXRlZ29yaWVzW3ZdO1xuXG4gICAgICAgIHJldHVybiBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2F0ZWdvcmllc1RpY2tHZW5lcmF0b3IoYXhpcykge1xuICAgICAgICB2YXIgcmVzID0gW107XG4gICAgICAgIGZvciAodmFyIGxhYmVsIGluIGF4aXMuY2F0ZWdvcmllcykge1xuICAgICAgICAgICAgdmFyIHYgPSBheGlzLmNhdGVnb3JpZXNbbGFiZWxdO1xuICAgICAgICAgICAgaWYgKHYgPj0gYXhpcy5taW4gJiYgdiA8PSBheGlzLm1heClcbiAgICAgICAgICAgICAgICByZXMucHVzaChbdiwgbGFiZWxdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhWzBdIC0gYlswXTsgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc2V0dXBDYXRlZ29yaWVzRm9yQXhpcyhzZXJpZXMsIGF4aXMsIGRhdGFwb2ludHMpIHtcbiAgICAgICAgaWYgKHNlcmllc1theGlzXS5vcHRpb25zLm1vZGUgIT0gXCJjYXRlZ29yaWVzXCIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBpZiAoIXNlcmllc1theGlzXS5jYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICAvLyBwYXJzZSBvcHRpb25zXG4gICAgICAgICAgICB2YXIgYyA9IHt9LCBvID0gc2VyaWVzW2F4aXNdLm9wdGlvbnMuY2F0ZWdvcmllcyB8fCB7fTtcbiAgICAgICAgICAgIGlmICgkLmlzQXJyYXkobykpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG8ubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgICAgIGNbb1tpXV0gPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdiBpbiBvKVxuICAgICAgICAgICAgICAgICAgICBjW3ZdID0gb1t2XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VyaWVzW2F4aXNdLmNhdGVnb3JpZXMgPSBjO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZml4IHRpY2tzXG4gICAgICAgIGlmICghc2VyaWVzW2F4aXNdLm9wdGlvbnMudGlja3MpXG4gICAgICAgICAgICBzZXJpZXNbYXhpc10ub3B0aW9ucy50aWNrcyA9IGNhdGVnb3JpZXNUaWNrR2VuZXJhdG9yO1xuXG4gICAgICAgIHRyYW5zZm9ybVBvaW50c09uQXhpcyhkYXRhcG9pbnRzLCBheGlzLCBzZXJpZXNbYXhpc10uY2F0ZWdvcmllcyk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybVBvaW50c09uQXhpcyhkYXRhcG9pbnRzLCBheGlzLCBjYXRlZ29yaWVzKSB7XG4gICAgICAgIC8vIGdvIHRocm91Z2ggdGhlIHBvaW50cywgdHJhbnNmb3JtaW5nIHRoZW1cbiAgICAgICAgdmFyIHBvaW50cyA9IGRhdGFwb2ludHMucG9pbnRzLFxuICAgICAgICAgICAgcHMgPSBkYXRhcG9pbnRzLnBvaW50c2l6ZSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGRhdGFwb2ludHMuZm9ybWF0LFxuICAgICAgICAgICAgZm9ybWF0Q29sdW1uID0gYXhpcy5jaGFyQXQoMCksXG4gICAgICAgICAgICBpbmRleCA9IGdldE5leHRJbmRleChjYXRlZ29yaWVzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gcHMpIHtcbiAgICAgICAgICAgIGlmIChwb2ludHNbaV0gPT0gbnVsbClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBwczsgKyttKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IHBvaW50c1tpICsgbV07XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsID09IG51bGwgfHwgIWZvcm1hdFttXVtmb3JtYXRDb2x1bW5dKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmICghKHZhbCBpbiBjYXRlZ29yaWVzKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzW3ZhbF0gPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcG9pbnRzW2kgKyBtXSA9IGNhdGVnb3JpZXNbdmFsXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NEYXRhcG9pbnRzKHBsb3QsIHNlcmllcywgZGF0YXBvaW50cykge1xuICAgICAgICBzZXR1cENhdGVnb3JpZXNGb3JBeGlzKHNlcmllcywgXCJ4YXhpc1wiLCBkYXRhcG9pbnRzKTtcbiAgICAgICAgc2V0dXBDYXRlZ29yaWVzRm9yQXhpcyhzZXJpZXMsIFwieWF4aXNcIiwgZGF0YXBvaW50cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdChwbG90KSB7XG4gICAgICAgIHBsb3QuaG9va3MucHJvY2Vzc1Jhd0RhdGEucHVzaChwcm9jZXNzUmF3RGF0YSk7XG4gICAgICAgIHBsb3QuaG9va3MucHJvY2Vzc0RhdGFwb2ludHMucHVzaChwcm9jZXNzRGF0YXBvaW50cyk7XG4gICAgfVxuICAgIFxuICAgICQucGxvdC5wbHVnaW5zLnB1c2goe1xuICAgICAgICBpbml0OiBpbml0LFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICBuYW1lOiAnY2F0ZWdvcmllcycsXG4gICAgICAgIHZlcnNpb246ICcxLjAnXG4gICAgfSk7XG59KShqUXVlcnkpO1xuIiwiLyogSmF2YXNjcmlwdCBwbG90dGluZyBsaWJyYXJ5IGZvciBqUXVlcnksIHZlcnNpb24gMC44LjMuXG5cbkNvcHlyaWdodCAoYykgMjAwNy0yMDE0IElPTEEgYW5kIE9sZSBMYXVyc2VuLlxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4qL1xuXG4vLyBmaXJzdCBhbiBpbmxpbmUgZGVwZW5kZW5jeSwganF1ZXJ5LmNvbG9yaGVscGVycy5qcywgd2UgaW5saW5lIGl0IGhlcmVcbi8vIGZvciBjb252ZW5pZW5jZVxuXG4vKiBQbHVnaW4gZm9yIGpRdWVyeSBmb3Igd29ya2luZyB3aXRoIGNvbG9ycy5cbiAqXG4gKiBWZXJzaW9uIDEuMS5cbiAqXG4gKiBJbnNwaXJhdGlvbiBmcm9tIGpRdWVyeSBjb2xvciBhbmltYXRpb24gcGx1Z2luIGJ5IEpvaG4gUmVzaWcuXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGJ5IE9sZSBMYXVyc2VuLCBPY3RvYmVyIDIwMDkuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAkLmNvbG9yLnBhcnNlKFwiI2ZmZlwiKS5zY2FsZSgncmdiJywgMC4yNSkuYWRkKCdhJywgLTAuNSkudG9TdHJpbmcoKVxuICogICB2YXIgYyA9ICQuY29sb3IuZXh0cmFjdCgkKFwiI215ZGl2XCIpLCAnYmFja2dyb3VuZC1jb2xvcicpO1xuICogICBjb25zb2xlLmxvZyhjLnIsIGMuZywgYy5iLCBjLmEpO1xuICogICAkLmNvbG9yLm1ha2UoMTAwLCA1MCwgMjUsIDAuNCkudG9TdHJpbmcoKSAvLyByZXR1cm5zIFwicmdiYSgxMDAsNTAsMjUsMC40KVwiXG4gKlxuICogTm90ZSB0aGF0IC5zY2FsZSgpIGFuZCAuYWRkKCkgcmV0dXJuIHRoZSBzYW1lIG1vZGlmaWVkIG9iamVjdFxuICogaW5zdGVhZCBvZiBtYWtpbmcgYSBuZXcgb25lLlxuICpcbiAqIFYuIDEuMTogRml4IGVycm9yIGhhbmRsaW5nIHNvIGUuZy4gcGFyc2luZyBhbiBlbXB0eSBzdHJpbmcgZG9lc1xuICogcHJvZHVjZSBhIGNvbG9yIHJhdGhlciB0aGFuIGp1c3QgY3Jhc2hpbmcuXG4gKi9cbihmdW5jdGlvbigkKXskLmNvbG9yPXt9OyQuY29sb3IubWFrZT1mdW5jdGlvbihyLGcsYixhKXt2YXIgbz17fTtvLnI9cnx8MDtvLmc9Z3x8MDtvLmI9Ynx8MDtvLmE9YSE9bnVsbD9hOjE7by5hZGQ9ZnVuY3Rpb24oYyxkKXtmb3IodmFyIGk9MDtpPGMubGVuZ3RoOysraSlvW2MuY2hhckF0KGkpXSs9ZDtyZXR1cm4gby5ub3JtYWxpemUoKX07by5zY2FsZT1mdW5jdGlvbihjLGYpe2Zvcih2YXIgaT0wO2k8Yy5sZW5ndGg7KytpKW9bYy5jaGFyQXQoaSldKj1mO3JldHVybiBvLm5vcm1hbGl6ZSgpfTtvLnRvU3RyaW5nPWZ1bmN0aW9uKCl7aWYoby5hPj0xKXtyZXR1cm5cInJnYihcIitbby5yLG8uZyxvLmJdLmpvaW4oXCIsXCIpK1wiKVwifWVsc2V7cmV0dXJuXCJyZ2JhKFwiK1tvLnIsby5nLG8uYixvLmFdLmpvaW4oXCIsXCIpK1wiKVwifX07by5ub3JtYWxpemU9ZnVuY3Rpb24oKXtmdW5jdGlvbiBjbGFtcChtaW4sdmFsdWUsbWF4KXtyZXR1cm4gdmFsdWU8bWluP21pbjp2YWx1ZT5tYXg/bWF4OnZhbHVlfW8ucj1jbGFtcCgwLHBhcnNlSW50KG8uciksMjU1KTtvLmc9Y2xhbXAoMCxwYXJzZUludChvLmcpLDI1NSk7by5iPWNsYW1wKDAscGFyc2VJbnQoby5iKSwyNTUpO28uYT1jbGFtcCgwLG8uYSwxKTtyZXR1cm4gb307by5jbG9uZT1mdW5jdGlvbigpe3JldHVybiAkLmNvbG9yLm1ha2Uoby5yLG8uYixvLmcsby5hKX07cmV0dXJuIG8ubm9ybWFsaXplKCl9OyQuY29sb3IuZXh0cmFjdD1mdW5jdGlvbihlbGVtLGNzcyl7dmFyIGM7ZG97Yz1lbGVtLmNzcyhjc3MpLnRvTG93ZXJDYXNlKCk7aWYoYyE9XCJcIiYmYyE9XCJ0cmFuc3BhcmVudFwiKWJyZWFrO2VsZW09ZWxlbS5wYXJlbnQoKX13aGlsZShlbGVtLmxlbmd0aCYmISQubm9kZU5hbWUoZWxlbS5nZXQoMCksXCJib2R5XCIpKTtpZihjPT1cInJnYmEoMCwgMCwgMCwgMClcIiljPVwidHJhbnNwYXJlbnRcIjtyZXR1cm4gJC5jb2xvci5wYXJzZShjKX07JC5jb2xvci5wYXJzZT1mdW5jdGlvbihzdHIpe3ZhciByZXMsbT0kLmNvbG9yLm1ha2U7aWYocmVzPS9yZ2JcXChcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldezEsM30pXFxzKlxcKS8uZXhlYyhzdHIpKXJldHVybiBtKHBhcnNlSW50KHJlc1sxXSwxMCkscGFyc2VJbnQocmVzWzJdLDEwKSxwYXJzZUludChyZXNbM10sMTApKTtpZihyZXM9L3JnYmFcXChcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldezEsM30pXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxccypcXCkvLmV4ZWMoc3RyKSlyZXR1cm4gbShwYXJzZUludChyZXNbMV0sMTApLHBhcnNlSW50KHJlc1syXSwxMCkscGFyc2VJbnQocmVzWzNdLDEwKSxwYXJzZUZsb2F0KHJlc1s0XSkpO2lmKHJlcz0vcmdiXFwoXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqLFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccypcXCkvLmV4ZWMoc3RyKSlyZXR1cm4gbShwYXJzZUZsb2F0KHJlc1sxXSkqMi41NSxwYXJzZUZsb2F0KHJlc1syXSkqMi41NSxwYXJzZUZsb2F0KHJlc1szXSkqMi41NSk7aWYocmVzPS9yZ2JhXFwoXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqLFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXHMqXFwpLy5leGVjKHN0cikpcmV0dXJuIG0ocGFyc2VGbG9hdChyZXNbMV0pKjIuNTUscGFyc2VGbG9hdChyZXNbMl0pKjIuNTUscGFyc2VGbG9hdChyZXNbM10pKjIuNTUscGFyc2VGbG9hdChyZXNbNF0pKTtpZihyZXM9LyMoW2EtZkEtRjAtOV17Mn0pKFthLWZBLUYwLTldezJ9KShbYS1mQS1GMC05XXsyfSkvLmV4ZWMoc3RyKSlyZXR1cm4gbShwYXJzZUludChyZXNbMV0sMTYpLHBhcnNlSW50KHJlc1syXSwxNikscGFyc2VJbnQocmVzWzNdLDE2KSk7aWYocmVzPS8jKFthLWZBLUYwLTldKShbYS1mQS1GMC05XSkoW2EtZkEtRjAtOV0pLy5leGVjKHN0cikpcmV0dXJuIG0ocGFyc2VJbnQocmVzWzFdK3Jlc1sxXSwxNikscGFyc2VJbnQocmVzWzJdK3Jlc1syXSwxNikscGFyc2VJbnQocmVzWzNdK3Jlc1szXSwxNikpO3ZhciBuYW1lPSQudHJpbShzdHIpLnRvTG93ZXJDYXNlKCk7aWYobmFtZT09XCJ0cmFuc3BhcmVudFwiKXJldHVybiBtKDI1NSwyNTUsMjU1LDApO2Vsc2V7cmVzPWxvb2t1cENvbG9yc1tuYW1lXXx8WzAsMCwwXTtyZXR1cm4gbShyZXNbMF0scmVzWzFdLHJlc1syXSl9fTt2YXIgbG9va3VwQ29sb3JzPXthcXVhOlswLDI1NSwyNTVdLGF6dXJlOlsyNDAsMjU1LDI1NV0sYmVpZ2U6WzI0NSwyNDUsMjIwXSxibGFjazpbMCwwLDBdLGJsdWU6WzAsMCwyNTVdLGJyb3duOlsxNjUsNDIsNDJdLGN5YW46WzAsMjU1LDI1NV0sZGFya2JsdWU6WzAsMCwxMzldLGRhcmtjeWFuOlswLDEzOSwxMzldLGRhcmtncmV5OlsxNjksMTY5LDE2OV0sZGFya2dyZWVuOlswLDEwMCwwXSxkYXJra2hha2k6WzE4OSwxODMsMTA3XSxkYXJrbWFnZW50YTpbMTM5LDAsMTM5XSxkYXJrb2xpdmVncmVlbjpbODUsMTA3LDQ3XSxkYXJrb3JhbmdlOlsyNTUsMTQwLDBdLGRhcmtvcmNoaWQ6WzE1Myw1MCwyMDRdLGRhcmtyZWQ6WzEzOSwwLDBdLGRhcmtzYWxtb246WzIzMywxNTAsMTIyXSxkYXJrdmlvbGV0OlsxNDgsMCwyMTFdLGZ1Y2hzaWE6WzI1NSwwLDI1NV0sZ29sZDpbMjU1LDIxNSwwXSxncmVlbjpbMCwxMjgsMF0saW5kaWdvOls3NSwwLDEzMF0sa2hha2k6WzI0MCwyMzAsMTQwXSxsaWdodGJsdWU6WzE3MywyMTYsMjMwXSxsaWdodGN5YW46WzIyNCwyNTUsMjU1XSxsaWdodGdyZWVuOlsxNDQsMjM4LDE0NF0sbGlnaHRncmV5OlsyMTEsMjExLDIxMV0sbGlnaHRwaW5rOlsyNTUsMTgyLDE5M10sbGlnaHR5ZWxsb3c6WzI1NSwyNTUsMjI0XSxsaW1lOlswLDI1NSwwXSxtYWdlbnRhOlsyNTUsMCwyNTVdLG1hcm9vbjpbMTI4LDAsMF0sbmF2eTpbMCwwLDEyOF0sb2xpdmU6WzEyOCwxMjgsMF0sb3JhbmdlOlsyNTUsMTY1LDBdLHBpbms6WzI1NSwxOTIsMjAzXSxwdXJwbGU6WzEyOCwwLDEyOF0sdmlvbGV0OlsxMjgsMCwxMjhdLHJlZDpbMjU1LDAsMF0sc2lsdmVyOlsxOTIsMTkyLDE5Ml0sd2hpdGU6WzI1NSwyNTUsMjU1XSx5ZWxsb3c6WzI1NSwyNTUsMF19fSkoalF1ZXJ5KTtcblxuLy8gdGhlIGFjdHVhbCBGbG90IGNvZGVcbihmdW5jdGlvbigkKSB7XG5cblx0Ly8gQ2FjaGUgdGhlIHByb3RvdHlwZSBoYXNPd25Qcm9wZXJ0eSBmb3IgZmFzdGVyIGFjY2Vzc1xuXG5cdHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgICAvLyBBIHNoaW0gdG8gcHJvdmlkZSAnZGV0YWNoJyB0byBqUXVlcnkgdmVyc2lvbnMgcHJpb3IgdG8gMS40LiAgVXNpbmcgYSBET01cbiAgICAvLyBvcGVyYXRpb24gcHJvZHVjZXMgdGhlIHNhbWUgZWZmZWN0IGFzIGRldGFjaCwgaS5lLiByZW1vdmluZyB0aGUgZWxlbWVudFxuICAgIC8vIHdpdGhvdXQgdG91Y2hpbmcgaXRzIGpRdWVyeSBkYXRhLlxuXG4gICAgLy8gRG8gbm90IG1lcmdlIHRoaXMgaW50byBGbG90IDAuOSwgc2luY2UgaXQgcmVxdWlyZXMgalF1ZXJ5IDEuNC40Ky5cblxuICAgIGlmICghJC5mbi5kZXRhY2gpIHtcbiAgICAgICAgJC5mbi5kZXRhY2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHRoaXMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vIFRoZSBDYW52YXMgb2JqZWN0IGlzIGEgd3JhcHBlciBhcm91bmQgYW4gSFRNTDUgPGNhbnZhcz4gdGFnLlxuXHQvL1xuXHQvLyBAY29uc3RydWN0b3Jcblx0Ly8gQHBhcmFtIHtzdHJpbmd9IGNscyBMaXN0IG9mIGNsYXNzZXMgdG8gYXBwbHkgdG8gdGhlIGNhbnZhcy5cblx0Ly8gQHBhcmFtIHtlbGVtZW50fSBjb250YWluZXIgRWxlbWVudCBvbnRvIHdoaWNoIHRvIGFwcGVuZCB0aGUgY2FudmFzLlxuXHQvL1xuXHQvLyBSZXF1aXJpbmcgYSBjb250YWluZXIgaXMgYSBsaXR0bGUgaWZmeSwgYnV0IHVuZm9ydHVuYXRlbHkgY2FudmFzXG5cdC8vIG9wZXJhdGlvbnMgZG9uJ3Qgd29yayB1bmxlc3MgdGhlIGNhbnZhcyBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLlxuXG5cdGZ1bmN0aW9uIENhbnZhcyhjbHMsIGNvbnRhaW5lcikge1xuXG5cdFx0dmFyIGVsZW1lbnQgPSBjb250YWluZXIuY2hpbGRyZW4oXCIuXCIgKyBjbHMpWzBdO1xuXG5cdFx0aWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0XHRcdGVsZW1lbnQuY2xhc3NOYW1lID0gY2xzO1xuXG5cdFx0XHQkKGVsZW1lbnQpLmNzcyh7IGRpcmVjdGlvbjogXCJsdHJcIiwgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgbGVmdDogMCwgdG9wOiAwIH0pXG5cdFx0XHRcdC5hcHBlbmRUbyhjb250YWluZXIpO1xuXG5cdFx0XHQvLyBJZiBIVE1MNSBDYW52YXMgaXNuJ3QgYXZhaWxhYmxlLCBmYWxsIGJhY2sgdG8gW0V4fEZsYXNoXWNhbnZhc1xuXG5cdFx0XHRpZiAoIWVsZW1lbnQuZ2V0Q29udGV4dCkge1xuXHRcdFx0XHRpZiAod2luZG93Lkdfdm1sQ2FudmFzTWFuYWdlcikge1xuXHRcdFx0XHRcdGVsZW1lbnQgPSB3aW5kb3cuR192bWxDYW52YXNNYW5hZ2VyLmluaXRFbGVtZW50KGVsZW1lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbnZhcyBpcyBub3QgYXZhaWxhYmxlLiBJZiB5b3UncmUgdXNpbmcgSUUgd2l0aCBhIGZhbGwtYmFjayBzdWNoIGFzIEV4Y2FudmFzLCB0aGVuIHRoZXJlJ3MgZWl0aGVyIGEgbWlzdGFrZSBpbiB5b3VyIGNvbmRpdGlvbmFsIGluY2x1ZGUsIG9yIHRoZSBwYWdlIGhhcyBubyBET0NUWVBFIGFuZCBpcyByZW5kZXJpbmcgaW4gUXVpcmtzIE1vZGUuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuXHRcdHZhciBjb250ZXh0ID0gdGhpcy5jb250ZXh0ID0gZWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0XHQvLyBEZXRlcm1pbmUgdGhlIHNjcmVlbidzIHJhdGlvIG9mIHBoeXNpY2FsIHRvIGRldmljZS1pbmRlcGVuZGVudFxuXHRcdC8vIHBpeGVscy4gIFRoaXMgaXMgdGhlIHJhdGlvIGJldHdlZW4gdGhlIGNhbnZhcyB3aWR0aCB0aGF0IHRoZSBicm93c2VyXG5cdFx0Ly8gYWR2ZXJ0aXNlcyBhbmQgdGhlIG51bWJlciBvZiBwaXhlbHMgYWN0dWFsbHkgcHJlc2VudCBpbiB0aGF0IHNwYWNlLlxuXG5cdFx0Ly8gVGhlIGlQaG9uZSA0LCBmb3IgZXhhbXBsZSwgaGFzIGEgZGV2aWNlLWluZGVwZW5kZW50IHdpZHRoIG9mIDMyMHB4LFxuXHRcdC8vIGJ1dCBpdHMgc2NyZWVuIGlzIGFjdHVhbGx5IDY0MHB4IHdpZGUuICBJdCB0aGVyZWZvcmUgaGFzIGEgcGl4ZWxcblx0XHQvLyByYXRpbyBvZiAyLCB3aGlsZSBtb3N0IG5vcm1hbCBkZXZpY2VzIGhhdmUgYSByYXRpbyBvZiAxLlxuXG5cdFx0dmFyIGRldmljZVBpeGVsUmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuXHRcdFx0YmFja2luZ1N0b3JlUmF0aW8gPVxuXHRcdFx0XHRjb250ZXh0LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcblx0XHRcdFx0Y29udGV4dC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG5cdFx0XHRcdGNvbnRleHQubXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG5cdFx0XHRcdGNvbnRleHQub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcblx0XHRcdFx0Y29udGV4dC5iYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IDE7XG5cblx0XHR0aGlzLnBpeGVsUmF0aW8gPSBkZXZpY2VQaXhlbFJhdGlvIC8gYmFja2luZ1N0b3JlUmF0aW87XG5cblx0XHQvLyBTaXplIHRoZSBjYW52YXMgdG8gbWF0Y2ggdGhlIGludGVybmFsIGRpbWVuc2lvbnMgb2YgaXRzIGNvbnRhaW5lclxuXG5cdFx0dGhpcy5yZXNpemUoY29udGFpbmVyLndpZHRoKCksIGNvbnRhaW5lci5oZWlnaHQoKSk7XG5cblx0XHQvLyBDb2xsZWN0aW9uIG9mIEhUTUwgZGl2IGxheWVycyBmb3IgdGV4dCBvdmVybGFpZCBvbnRvIHRoZSBjYW52YXNcblxuXHRcdHRoaXMudGV4dENvbnRhaW5lciA9IG51bGw7XG5cdFx0dGhpcy50ZXh0ID0ge307XG5cblx0XHQvLyBDYWNoZSBvZiB0ZXh0IGZyYWdtZW50cyBhbmQgbWV0cmljcywgc28gd2UgY2FuIGF2b2lkIGV4cGVuc2l2ZWx5XG5cdFx0Ly8gcmUtY2FsY3VsYXRpbmcgdGhlbSB3aGVuIHRoZSBwbG90IGlzIHJlLXJlbmRlcmVkIGluIGEgbG9vcC5cblxuXHRcdHRoaXMuX3RleHRDYWNoZSA9IHt9O1xuXHR9XG5cblx0Ly8gUmVzaXplcyB0aGUgY2FudmFzIHRvIHRoZSBnaXZlbiBkaW1lbnNpb25zLlxuXHQvL1xuXHQvLyBAcGFyYW0ge251bWJlcn0gd2lkdGggTmV3IHdpZHRoIG9mIHRoZSBjYW52YXMsIGluIHBpeGVscy5cblx0Ly8gQHBhcmFtIHtudW1iZXJ9IHdpZHRoIE5ldyBoZWlnaHQgb2YgdGhlIGNhbnZhcywgaW4gcGl4ZWxzLlxuXG5cdENhbnZhcy5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXG5cdFx0aWYgKHdpZHRoIDw9IDAgfHwgaGVpZ2h0IDw9IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZGltZW5zaW9ucyBmb3IgcGxvdCwgd2lkdGggPSBcIiArIHdpZHRoICsgXCIsIGhlaWdodCA9IFwiICsgaGVpZ2h0KTtcblx0XHR9XG5cblx0XHR2YXIgZWxlbWVudCA9IHRoaXMuZWxlbWVudCxcblx0XHRcdGNvbnRleHQgPSB0aGlzLmNvbnRleHQsXG5cdFx0XHRwaXhlbFJhdGlvID0gdGhpcy5waXhlbFJhdGlvO1xuXG5cdFx0Ly8gUmVzaXplIHRoZSBjYW52YXMsIGluY3JlYXNpbmcgaXRzIGRlbnNpdHkgYmFzZWQgb24gdGhlIGRpc3BsYXknc1xuXHRcdC8vIHBpeGVsIHJhdGlvOyBiYXNpY2FsbHkgZ2l2aW5nIGl0IG1vcmUgcGl4ZWxzIHdpdGhvdXQgaW5jcmVhc2luZyB0aGVcblx0XHQvLyBzaXplIG9mIGl0cyBlbGVtZW50LCB0byB0YWtlIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGF0IHJldGluYVxuXHRcdC8vIGRpc3BsYXlzIGhhdmUgdGhhdCBtYW55IG1vcmUgcGl4ZWxzIGluIHRoZSBzYW1lIGFkdmVydGlzZWQgc3BhY2UuXG5cblx0XHQvLyBSZXNpemluZyBzaG91bGQgcmVzZXQgdGhlIHN0YXRlIChleGNhbnZhcyBzZWVtcyB0byBiZSBidWdneSB0aG91Z2gpXG5cblx0XHRpZiAodGhpcy53aWR0aCAhPSB3aWR0aCkge1xuXHRcdFx0ZWxlbWVudC53aWR0aCA9IHdpZHRoICogcGl4ZWxSYXRpbztcblx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcblx0XHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5oZWlnaHQgIT0gaGVpZ2h0KSB7XG5cdFx0XHRlbGVtZW50LmhlaWdodCA9IGhlaWdodCAqIHBpeGVsUmF0aW87XG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdH1cblxuXHRcdC8vIFNhdmUgdGhlIGNvbnRleHQsIHNvIHdlIGNhbiByZXNldCBpbiBjYXNlIHdlIGdldCByZXBsb3R0ZWQuICBUaGVcblx0XHQvLyByZXN0b3JlIGVuc3VyZSB0aGF0IHdlJ3JlIHJlYWxseSBiYWNrIGF0IHRoZSBpbml0aWFsIHN0YXRlLCBhbmRcblx0XHQvLyBzaG91bGQgYmUgc2FmZSBldmVuIGlmIHdlIGhhdmVuJ3Qgc2F2ZWQgdGhlIGluaXRpYWwgc3RhdGUgeWV0LlxuXG5cdFx0Y29udGV4dC5yZXN0b3JlKCk7XG5cdFx0Y29udGV4dC5zYXZlKCk7XG5cblx0XHQvLyBTY2FsZSB0aGUgY29vcmRpbmF0ZSBzcGFjZSB0byBtYXRjaCB0aGUgZGlzcGxheSBkZW5zaXR5OyBzbyBldmVuIHRob3VnaCB3ZVxuXHRcdC8vIG1heSBoYXZlIHR3aWNlIGFzIG1hbnkgcGl4ZWxzLCB3ZSBzdGlsbCB3YW50IGxpbmVzIGFuZCBvdGhlciBkcmF3aW5nIHRvXG5cdFx0Ly8gYXBwZWFyIGF0IHRoZSBzYW1lIHNpemU7IHRoZSBleHRyYSBwaXhlbHMgd2lsbCBqdXN0IG1ha2UgdGhlbSBjcmlzcGVyLlxuXG5cdFx0Y29udGV4dC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcblx0fTtcblxuXHQvLyBDbGVhcnMgdGhlIGVudGlyZSBjYW52YXMgYXJlYSwgbm90IGluY2x1ZGluZyBhbnkgb3ZlcmxhaWQgSFRNTCB0ZXh0XG5cblx0Q2FudmFzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHR9O1xuXG5cdC8vIEZpbmlzaGVzIHJlbmRlcmluZyB0aGUgY2FudmFzLCBpbmNsdWRpbmcgbWFuYWdpbmcgdGhlIHRleHQgb3ZlcmxheS5cblxuXHRDYW52YXMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIGNhY2hlID0gdGhpcy5fdGV4dENhY2hlO1xuXG5cdFx0Ly8gRm9yIGVhY2ggdGV4dCBsYXllciwgYWRkIGVsZW1lbnRzIG1hcmtlZCBhcyBhY3RpdmUgdGhhdCBoYXZlbid0XG5cdFx0Ly8gYWxyZWFkeSBiZWVuIHJlbmRlcmVkLCBhbmQgcmVtb3ZlIHRob3NlIHRoYXQgYXJlIG5vIGxvbmdlciBhY3RpdmUuXG5cblx0XHRmb3IgKHZhciBsYXllcktleSBpbiBjYWNoZSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoY2FjaGUsIGxheWVyS2V5KSkge1xuXG5cdFx0XHRcdHZhciBsYXllciA9IHRoaXMuZ2V0VGV4dExheWVyKGxheWVyS2V5KSxcblx0XHRcdFx0XHRsYXllckNhY2hlID0gY2FjaGVbbGF5ZXJLZXldO1xuXG5cdFx0XHRcdGxheWVyLmhpZGUoKTtcblxuXHRcdFx0XHRmb3IgKHZhciBzdHlsZUtleSBpbiBsYXllckNhY2hlKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwobGF5ZXJDYWNoZSwgc3R5bGVLZXkpKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGVDYWNoZSA9IGxheWVyQ2FjaGVbc3R5bGVLZXldO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIHN0eWxlQ2FjaGUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoc3R5bGVDYWNoZSwga2V5KSkge1xuXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHBvc2l0aW9ucyA9IHN0eWxlQ2FjaGVba2V5XS5wb3NpdGlvbnM7XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgcG9zaXRpb247IHBvc2l0aW9uID0gcG9zaXRpb25zW2ldOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChwb3NpdGlvbi5hY3RpdmUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFwb3NpdGlvbi5yZW5kZXJlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxheWVyLmFwcGVuZChwb3NpdGlvbi5lbGVtZW50KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbi5yZW5kZXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9ucy5zcGxpY2UoaS0tLCAxKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHBvc2l0aW9uLnJlbmRlcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb24uZWxlbWVudC5kZXRhY2goKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGlmIChwb3NpdGlvbnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSBzdHlsZUNhY2hlW2tleV07XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGF5ZXIuc2hvdygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBDcmVhdGVzIChpZiBuZWNlc3NhcnkpIGFuZCByZXR1cm5zIHRoZSB0ZXh0IG92ZXJsYXkgY29udGFpbmVyLlxuXHQvL1xuXHQvLyBAcGFyYW0ge3N0cmluZ30gY2xhc3NlcyBTdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHVzZWQgdG9cblx0Ly8gICAgIHVuaXF1ZWx5IGlkZW50aWZ5IHRoZSB0ZXh0IGxheWVyLlxuXHQvLyBAcmV0dXJuIHtvYmplY3R9IFRoZSBqUXVlcnktd3JhcHBlZCB0ZXh0LWxheWVyIGRpdi5cblxuXHRDYW52YXMucHJvdG90eXBlLmdldFRleHRMYXllciA9IGZ1bmN0aW9uKGNsYXNzZXMpIHtcblxuXHRcdHZhciBsYXllciA9IHRoaXMudGV4dFtjbGFzc2VzXTtcblxuXHRcdC8vIENyZWF0ZSB0aGUgdGV4dCBsYXllciBpZiBpdCBkb2Vzbid0IGV4aXN0XG5cblx0XHRpZiAobGF5ZXIgPT0gbnVsbCkge1xuXG5cdFx0XHQvLyBDcmVhdGUgdGhlIHRleHQgbGF5ZXIgY29udGFpbmVyLCBpZiBpdCBkb2Vzbid0IGV4aXN0XG5cblx0XHRcdGlmICh0aGlzLnRleHRDb250YWluZXIgPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnRleHRDb250YWluZXIgPSAkKFwiPGRpdiBjbGFzcz0nZmxvdC10ZXh0Jz48L2Rpdj5cIilcblx0XHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdFx0XHRsZWZ0OiAwLFxuXHRcdFx0XHRcdFx0Ym90dG9tOiAwLFxuXHRcdFx0XHRcdFx0cmlnaHQ6IDAsXG5cdFx0XHRcdFx0XHQnZm9udC1zaXplJzogXCJzbWFsbGVyXCIsXG5cdFx0XHRcdFx0XHRjb2xvcjogXCIjNTQ1NDU0XCJcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5pbnNlcnRBZnRlcih0aGlzLmVsZW1lbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRsYXllciA9IHRoaXMudGV4dFtjbGFzc2VzXSA9ICQoXCI8ZGl2PjwvZGl2PlwiKVxuXHRcdFx0XHQuYWRkQ2xhc3MoY2xhc3Nlcylcblx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdFx0bGVmdDogMCxcblx0XHRcdFx0XHRib3R0b206IDAsXG5cdFx0XHRcdFx0cmlnaHQ6IDBcblx0XHRcdFx0fSlcblx0XHRcdFx0LmFwcGVuZFRvKHRoaXMudGV4dENvbnRhaW5lcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGxheWVyO1xuXHR9O1xuXG5cdC8vIENyZWF0ZXMgKGlmIG5lY2Vzc2FyeSkgYW5kIHJldHVybnMgYSB0ZXh0IGluZm8gb2JqZWN0LlxuXHQvL1xuXHQvLyBUaGUgb2JqZWN0IGxvb2tzIGxpa2UgdGhpczpcblx0Ly9cblx0Ly8ge1xuXHQvLyAgICAgd2lkdGg6IFdpZHRoIG9mIHRoZSB0ZXh0J3Mgd3JhcHBlciBkaXYuXG5cdC8vICAgICBoZWlnaHQ6IEhlaWdodCBvZiB0aGUgdGV4dCdzIHdyYXBwZXIgZGl2LlxuXHQvLyAgICAgZWxlbWVudDogVGhlIGpRdWVyeS13cmFwcGVkIEhUTUwgZGl2IGNvbnRhaW5pbmcgdGhlIHRleHQuXG5cdC8vICAgICBwb3NpdGlvbnM6IEFycmF5IG9mIHBvc2l0aW9ucyBhdCB3aGljaCB0aGlzIHRleHQgaXMgZHJhd24uXG5cdC8vIH1cblx0Ly9cblx0Ly8gVGhlIHBvc2l0aW9ucyBhcnJheSBjb250YWlucyBvYmplY3RzIHRoYXQgbG9vayBsaWtlIHRoaXM6XG5cdC8vXG5cdC8vIHtcblx0Ly8gICAgIGFjdGl2ZTogRmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIHRleHQgc2hvdWxkIGJlIHZpc2libGUuXG5cdC8vICAgICByZW5kZXJlZDogRmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIHRleHQgaXMgY3VycmVudGx5IHZpc2libGUuXG5cdC8vICAgICBlbGVtZW50OiBUaGUgalF1ZXJ5LXdyYXBwZWQgSFRNTCBkaXYgY29udGFpbmluZyB0aGUgdGV4dC5cblx0Ly8gICAgIHg6IFggY29vcmRpbmF0ZSBhdCB3aGljaCB0byBkcmF3IHRoZSB0ZXh0LlxuXHQvLyAgICAgeTogWSBjb29yZGluYXRlIGF0IHdoaWNoIHRvIGRyYXcgdGhlIHRleHQuXG5cdC8vIH1cblx0Ly9cblx0Ly8gRWFjaCBwb3NpdGlvbiBhZnRlciB0aGUgZmlyc3QgcmVjZWl2ZXMgYSBjbG9uZSBvZiB0aGUgb3JpZ2luYWwgZWxlbWVudC5cblx0Ly9cblx0Ly8gVGhlIGlkZWEgaXMgdGhhdCB0aGF0IHRoZSB3aWR0aCwgaGVpZ2h0LCBhbmQgZ2VuZXJhbCAnaWRlbnRpdHknIG9mIHRoZVxuXHQvLyB0ZXh0IGlzIGNvbnN0YW50IG5vIG1hdHRlciB3aGVyZSBpdCBpcyBwbGFjZWQ7IHRoZSBwbGFjZW1lbnRzIGFyZSBhXG5cdC8vIHNlY29uZGFyeSBwcm9wZXJ0eS5cblx0Ly9cblx0Ly8gQ2FudmFzIG1haW50YWlucyBhIGNhY2hlIG9mIHJlY2VudGx5LXVzZWQgdGV4dCBpbmZvIG9iamVjdHM7IGdldFRleHRJbmZvXG5cdC8vIGVpdGhlciByZXR1cm5zIHRoZSBjYWNoZWQgZWxlbWVudCBvciBjcmVhdGVzIGEgbmV3IGVudHJ5LlxuXHQvL1xuXHQvLyBAcGFyYW0ge3N0cmluZ30gbGF5ZXIgQSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHVuaXF1ZWx5XG5cdC8vICAgICBpZGVudGlmeWluZyB0aGUgbGF5ZXIgY29udGFpbmluZyB0aGlzIHRleHQuXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgc3RyaW5nIHRvIHJldHJpZXZlIGluZm8gZm9yLlxuXHQvLyBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KT19IGZvbnQgRWl0aGVyIGEgc3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1Ncblx0Ly8gICAgIGNsYXNzZXMgb3IgYSBmb250LXNwZWMgb2JqZWN0LCBkZWZpbmluZyB0aGUgdGV4dCdzIGZvbnQgYW5kIHN0eWxlLlxuXHQvLyBAcGFyYW0ge251bWJlcj19IGFuZ2xlIEFuZ2xlIGF0IHdoaWNoIHRvIHJvdGF0ZSB0aGUgdGV4dCwgaW4gZGVncmVlcy5cblx0Ly8gICAgIEFuZ2xlIGlzIGN1cnJlbnRseSB1bnVzZWQsIGl0IHdpbGwgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIGZ1dHVyZS5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSB3aWR0aCBNYXhpbXVtIHdpZHRoIG9mIHRoZSB0ZXh0IGJlZm9yZSBpdCB3cmFwcy5cblx0Ly8gQHJldHVybiB7b2JqZWN0fSBhIHRleHQgaW5mbyBvYmplY3QuXG5cblx0Q2FudmFzLnByb3RvdHlwZS5nZXRUZXh0SW5mbyA9IGZ1bmN0aW9uKGxheWVyLCB0ZXh0LCBmb250LCBhbmdsZSwgd2lkdGgpIHtcblxuXHRcdHZhciB0ZXh0U3R5bGUsIGxheWVyQ2FjaGUsIHN0eWxlQ2FjaGUsIGluZm87XG5cblx0XHQvLyBDYXN0IHRoZSB2YWx1ZSB0byBhIHN0cmluZywgaW4gY2FzZSB3ZSB3ZXJlIGdpdmVuIGEgbnVtYmVyIG9yIHN1Y2hcblxuXHRcdHRleHQgPSBcIlwiICsgdGV4dDtcblxuXHRcdC8vIElmIHRoZSBmb250IGlzIGEgZm9udC1zcGVjIG9iamVjdCwgZ2VuZXJhdGUgYSBDU1MgZm9udCBkZWZpbml0aW9uXG5cblx0XHRpZiAodHlwZW9mIGZvbnQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdHRleHRTdHlsZSA9IGZvbnQuc3R5bGUgKyBcIiBcIiArIGZvbnQudmFyaWFudCArIFwiIFwiICsgZm9udC53ZWlnaHQgKyBcIiBcIiArIGZvbnQuc2l6ZSArIFwicHgvXCIgKyBmb250LmxpbmVIZWlnaHQgKyBcInB4IFwiICsgZm9udC5mYW1pbHk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRleHRTdHlsZSA9IGZvbnQ7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0cmlldmUgKG9yIGNyZWF0ZSkgdGhlIGNhY2hlIGZvciB0aGUgdGV4dCdzIGxheWVyIGFuZCBzdHlsZXNcblxuXHRcdGxheWVyQ2FjaGUgPSB0aGlzLl90ZXh0Q2FjaGVbbGF5ZXJdO1xuXG5cdFx0aWYgKGxheWVyQ2FjaGUgPT0gbnVsbCkge1xuXHRcdFx0bGF5ZXJDYWNoZSA9IHRoaXMuX3RleHRDYWNoZVtsYXllcl0gPSB7fTtcblx0XHR9XG5cblx0XHRzdHlsZUNhY2hlID0gbGF5ZXJDYWNoZVt0ZXh0U3R5bGVdO1xuXG5cdFx0aWYgKHN0eWxlQ2FjaGUgPT0gbnVsbCkge1xuXHRcdFx0c3R5bGVDYWNoZSA9IGxheWVyQ2FjaGVbdGV4dFN0eWxlXSA9IHt9O1xuXHRcdH1cblxuXHRcdGluZm8gPSBzdHlsZUNhY2hlW3RleHRdO1xuXG5cdFx0Ly8gSWYgd2UgY2FuJ3QgZmluZCBhIG1hdGNoaW5nIGVsZW1lbnQgaW4gb3VyIGNhY2hlLCBjcmVhdGUgYSBuZXcgb25lXG5cblx0XHRpZiAoaW5mbyA9PSBudWxsKSB7XG5cblx0XHRcdHZhciBlbGVtZW50ID0gJChcIjxkaXY+PC9kaXY+XCIpLmh0bWwodGV4dClcblx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHQnbWF4LXdpZHRoJzogd2lkdGgsXG5cdFx0XHRcdFx0dG9wOiAtOTk5OVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuYXBwZW5kVG8odGhpcy5nZXRUZXh0TGF5ZXIobGF5ZXIpKTtcblxuXHRcdFx0aWYgKHR5cGVvZiBmb250ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdGVsZW1lbnQuY3NzKHtcblx0XHRcdFx0XHRmb250OiB0ZXh0U3R5bGUsXG5cdFx0XHRcdFx0Y29sb3I6IGZvbnQuY29sb3Jcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmb250ID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdGVsZW1lbnQuYWRkQ2xhc3MoZm9udCk7XG5cdFx0XHR9XG5cblx0XHRcdGluZm8gPSBzdHlsZUNhY2hlW3RleHRdID0ge1xuXHRcdFx0XHR3aWR0aDogZWxlbWVudC5vdXRlcldpZHRoKHRydWUpLFxuXHRcdFx0XHRoZWlnaHQ6IGVsZW1lbnQub3V0ZXJIZWlnaHQodHJ1ZSksXG5cdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnQsXG5cdFx0XHRcdHBvc2l0aW9uczogW11cblx0XHRcdH07XG5cblx0XHRcdGVsZW1lbnQuZGV0YWNoKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGluZm87XG5cdH07XG5cblx0Ly8gQWRkcyBhIHRleHQgc3RyaW5nIHRvIHRoZSBjYW52YXMgdGV4dCBvdmVybGF5LlxuXHQvL1xuXHQvLyBUaGUgdGV4dCBpc24ndCBkcmF3biBpbW1lZGlhdGVseTsgaXQgaXMgbWFya2VkIGFzIHJlbmRlcmluZywgd2hpY2ggd2lsbFxuXHQvLyByZXN1bHQgaW4gaXRzIGFkZGl0aW9uIHRvIHRoZSBjYW52YXMgb24gdGhlIG5leHQgcmVuZGVyIHBhc3MuXG5cdC8vXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSBsYXllciBBIHN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzZXMgdW5pcXVlbHlcblx0Ly8gICAgIGlkZW50aWZ5aW5nIHRoZSBsYXllciBjb250YWluaW5nIHRoaXMgdGV4dC5cblx0Ly8gQHBhcmFtIHtudW1iZXJ9IHggWCBjb29yZGluYXRlIGF0IHdoaWNoIHRvIGRyYXcgdGhlIHRleHQuXG5cdC8vIEBwYXJhbSB7bnVtYmVyfSB5IFkgY29vcmRpbmF0ZSBhdCB3aGljaCB0byBkcmF3IHRoZSB0ZXh0LlxuXHQvLyBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHN0cmluZyB0byBkcmF3LlxuXHQvLyBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KT19IGZvbnQgRWl0aGVyIGEgc3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1Ncblx0Ly8gICAgIGNsYXNzZXMgb3IgYSBmb250LXNwZWMgb2JqZWN0LCBkZWZpbmluZyB0aGUgdGV4dCdzIGZvbnQgYW5kIHN0eWxlLlxuXHQvLyBAcGFyYW0ge251bWJlcj19IGFuZ2xlIEFuZ2xlIGF0IHdoaWNoIHRvIHJvdGF0ZSB0aGUgdGV4dCwgaW4gZGVncmVlcy5cblx0Ly8gICAgIEFuZ2xlIGlzIGN1cnJlbnRseSB1bnVzZWQsIGl0IHdpbGwgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIGZ1dHVyZS5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSB3aWR0aCBNYXhpbXVtIHdpZHRoIG9mIHRoZSB0ZXh0IGJlZm9yZSBpdCB3cmFwcy5cblx0Ly8gQHBhcmFtIHtzdHJpbmc9fSBoYWxpZ24gSG9yaXpvbnRhbCBhbGlnbm1lbnQgb2YgdGhlIHRleHQ7IGVpdGhlciBcImxlZnRcIixcblx0Ly8gICAgIFwiY2VudGVyXCIgb3IgXCJyaWdodFwiLlxuXHQvLyBAcGFyYW0ge3N0cmluZz19IHZhbGlnbiBWZXJ0aWNhbCBhbGlnbm1lbnQgb2YgdGhlIHRleHQ7IGVpdGhlciBcInRvcFwiLFxuXHQvLyAgICAgXCJtaWRkbGVcIiBvciBcImJvdHRvbVwiLlxuXG5cdENhbnZhcy5wcm90b3R5cGUuYWRkVGV4dCA9IGZ1bmN0aW9uKGxheWVyLCB4LCB5LCB0ZXh0LCBmb250LCBhbmdsZSwgd2lkdGgsIGhhbGlnbiwgdmFsaWduKSB7XG5cblx0XHR2YXIgaW5mbyA9IHRoaXMuZ2V0VGV4dEluZm8obGF5ZXIsIHRleHQsIGZvbnQsIGFuZ2xlLCB3aWR0aCksXG5cdFx0XHRwb3NpdGlvbnMgPSBpbmZvLnBvc2l0aW9ucztcblxuXHRcdC8vIFR3ZWFrIHRoZSBkaXYncyBwb3NpdGlvbiB0byBtYXRjaCB0aGUgdGV4dCdzIGFsaWdubWVudFxuXG5cdFx0aWYgKGhhbGlnbiA9PSBcImNlbnRlclwiKSB7XG5cdFx0XHR4IC09IGluZm8ud2lkdGggLyAyO1xuXHRcdH0gZWxzZSBpZiAoaGFsaWduID09IFwicmlnaHRcIikge1xuXHRcdFx0eCAtPSBpbmZvLndpZHRoO1xuXHRcdH1cblxuXHRcdGlmICh2YWxpZ24gPT0gXCJtaWRkbGVcIikge1xuXHRcdFx0eSAtPSBpbmZvLmhlaWdodCAvIDI7XG5cdFx0fSBlbHNlIGlmICh2YWxpZ24gPT0gXCJib3R0b21cIikge1xuXHRcdFx0eSAtPSBpbmZvLmhlaWdodDtcblx0XHR9XG5cblx0XHQvLyBEZXRlcm1pbmUgd2hldGhlciB0aGlzIHRleHQgYWxyZWFkeSBleGlzdHMgYXQgdGhpcyBwb3NpdGlvbi5cblx0XHQvLyBJZiBzbywgbWFyayBpdCBmb3IgaW5jbHVzaW9uIGluIHRoZSBuZXh0IHJlbmRlciBwYXNzLlxuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHBvc2l0aW9uOyBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTsgaSsrKSB7XG5cdFx0XHRpZiAocG9zaXRpb24ueCA9PSB4ICYmIHBvc2l0aW9uLnkgPT0geSkge1xuXHRcdFx0XHRwb3NpdGlvbi5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIHRleHQgZG9lc24ndCBleGlzdCBhdCB0aGlzIHBvc2l0aW9uLCBjcmVhdGUgYSBuZXcgZW50cnlcblxuXHRcdC8vIEZvciB0aGUgdmVyeSBmaXJzdCBwb3NpdGlvbiB3ZSdsbCByZS11c2UgdGhlIG9yaWdpbmFsIGVsZW1lbnQsXG5cdFx0Ly8gd2hpbGUgZm9yIHN1YnNlcXVlbnQgb25lcyB3ZSdsbCBjbG9uZSBpdC5cblxuXHRcdHBvc2l0aW9uID0ge1xuXHRcdFx0YWN0aXZlOiB0cnVlLFxuXHRcdFx0cmVuZGVyZWQ6IGZhbHNlLFxuXHRcdFx0ZWxlbWVudDogcG9zaXRpb25zLmxlbmd0aCA/IGluZm8uZWxlbWVudC5jbG9uZSgpIDogaW5mby5lbGVtZW50LFxuXHRcdFx0eDogeCxcblx0XHRcdHk6IHlcblx0XHR9O1xuXG5cdFx0cG9zaXRpb25zLnB1c2gocG9zaXRpb24pO1xuXG5cdFx0Ly8gTW92ZSB0aGUgZWxlbWVudCB0byBpdHMgZmluYWwgcG9zaXRpb24gd2l0aGluIHRoZSBjb250YWluZXJcblxuXHRcdHBvc2l0aW9uLmVsZW1lbnQuY3NzKHtcblx0XHRcdHRvcDogTWF0aC5yb3VuZCh5KSxcblx0XHRcdGxlZnQ6IE1hdGgucm91bmQoeCksXG5cdFx0XHQndGV4dC1hbGlnbic6IGhhbGlnblx0Ly8gSW4gY2FzZSB0aGUgdGV4dCB3cmFwc1xuXHRcdH0pO1xuXHR9O1xuXG5cdC8vIFJlbW92ZXMgb25lIG9yIG1vcmUgdGV4dCBzdHJpbmdzIGZyb20gdGhlIGNhbnZhcyB0ZXh0IG92ZXJsYXkuXG5cdC8vXG5cdC8vIElmIG5vIHBhcmFtZXRlcnMgYXJlIGdpdmVuLCBhbGwgdGV4dCB3aXRoaW4gdGhlIGxheWVyIGlzIHJlbW92ZWQuXG5cdC8vXG5cdC8vIE5vdGUgdGhhdCB0aGUgdGV4dCBpcyBub3QgaW1tZWRpYXRlbHkgcmVtb3ZlZDsgaXQgaXMgc2ltcGx5IG1hcmtlZCBhc1xuXHQvLyBpbmFjdGl2ZSwgd2hpY2ggd2lsbCByZXN1bHQgaW4gaXRzIHJlbW92YWwgb24gdGhlIG5leHQgcmVuZGVyIHBhc3MuXG5cdC8vIFRoaXMgYXZvaWRzIHRoZSBwZXJmb3JtYW5jZSBwZW5hbHR5IGZvciAnY2xlYXIgYW5kIHJlZHJhdycgYmVoYXZpb3IsXG5cdC8vIHdoZXJlIHdlIHBvdGVudGlhbGx5IGdldCByaWQgb2YgYWxsIHRleHQgb24gYSBsYXllciwgYnV0IHdpbGwgbGlrZWx5XG5cdC8vIGFkZCBiYWNrIG1vc3Qgb3IgYWxsIG9mIGl0IGxhdGVyLCBhcyB3aGVuIHJlZHJhd2luZyBheGVzLCBmb3IgZXhhbXBsZS5cblx0Ly9cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IGxheWVyIEEgc3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1MgY2xhc3NlcyB1bmlxdWVseVxuXHQvLyAgICAgaWRlbnRpZnlpbmcgdGhlIGxheWVyIGNvbnRhaW5pbmcgdGhpcyB0ZXh0LlxuXHQvLyBAcGFyYW0ge251bWJlcj19IHggWCBjb29yZGluYXRlIG9mIHRoZSB0ZXh0LlxuXHQvLyBAcGFyYW0ge251bWJlcj19IHkgWSBjb29yZGluYXRlIG9mIHRoZSB0ZXh0LlxuXHQvLyBAcGFyYW0ge3N0cmluZz19IHRleHQgVGV4dCBzdHJpbmcgdG8gcmVtb3ZlLlxuXHQvLyBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KT19IGZvbnQgRWl0aGVyIGEgc3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1Ncblx0Ly8gICAgIGNsYXNzZXMgb3IgYSBmb250LXNwZWMgb2JqZWN0LCBkZWZpbmluZyB0aGUgdGV4dCdzIGZvbnQgYW5kIHN0eWxlLlxuXHQvLyBAcGFyYW0ge251bWJlcj19IGFuZ2xlIEFuZ2xlIGF0IHdoaWNoIHRoZSB0ZXh0IGlzIHJvdGF0ZWQsIGluIGRlZ3JlZXMuXG5cdC8vICAgICBBbmdsZSBpcyBjdXJyZW50bHkgdW51c2VkLCBpdCB3aWxsIGJlIGltcGxlbWVudGVkIGluIHRoZSBmdXR1cmUuXG5cblx0Q2FudmFzLnByb3RvdHlwZS5yZW1vdmVUZXh0ID0gZnVuY3Rpb24obGF5ZXIsIHgsIHksIHRleHQsIGZvbnQsIGFuZ2xlKSB7XG5cdFx0aWYgKHRleHQgPT0gbnVsbCkge1xuXHRcdFx0dmFyIGxheWVyQ2FjaGUgPSB0aGlzLl90ZXh0Q2FjaGVbbGF5ZXJdO1xuXHRcdFx0aWYgKGxheWVyQ2FjaGUgIT0gbnVsbCkge1xuXHRcdFx0XHRmb3IgKHZhciBzdHlsZUtleSBpbiBsYXllckNhY2hlKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwobGF5ZXJDYWNoZSwgc3R5bGVLZXkpKSB7XG5cdFx0XHRcdFx0XHR2YXIgc3R5bGVDYWNoZSA9IGxheWVyQ2FjaGVbc3R5bGVLZXldO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIHN0eWxlQ2FjaGUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoc3R5bGVDYWNoZSwga2V5KSkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBwb3NpdGlvbnMgPSBzdHlsZUNhY2hlW2tleV0ucG9zaXRpb25zO1xuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBwb3NpdGlvbjsgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb24uYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwb3NpdGlvbnMgPSB0aGlzLmdldFRleHRJbmZvKGxheWVyLCB0ZXh0LCBmb250LCBhbmdsZSkucG9zaXRpb25zO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIHBvc2l0aW9uOyBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTsgaSsrKSB7XG5cdFx0XHRcdGlmIChwb3NpdGlvbi54ID09IHggJiYgcG9zaXRpb24ueSA9PSB5KSB7XG5cdFx0XHRcdFx0cG9zaXRpb24uYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdC8vIFRoZSB0b3AtbGV2ZWwgY29udGFpbmVyIGZvciB0aGUgZW50aXJlIHBsb3QuXG5cbiAgICBmdW5jdGlvbiBQbG90KHBsYWNlaG9sZGVyLCBkYXRhXywgb3B0aW9uc18sIHBsdWdpbnMpIHtcbiAgICAgICAgLy8gZGF0YSBpcyBvbiB0aGUgZm9ybTpcbiAgICAgICAgLy8gICBbIHNlcmllczEsIHNlcmllczIgLi4uIF1cbiAgICAgICAgLy8gd2hlcmUgc2VyaWVzIGlzIGVpdGhlciBqdXN0IHRoZSBkYXRhIGFzIFsgW3gxLCB5MV0sIFt4MiwgeTJdLCAuLi4gXVxuICAgICAgICAvLyBvciB7IGRhdGE6IFsgW3gxLCB5MV0sIFt4MiwgeTJdLCAuLi4gXSwgbGFiZWw6IFwic29tZSBsYWJlbFwiLCAuLi4gfVxuXG4gICAgICAgIHZhciBzZXJpZXMgPSBbXSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIGNvbG9yIHRoZW1lIHVzZWQgZm9yIGdyYXBoc1xuICAgICAgICAgICAgICAgIGNvbG9yczogW1wiI2VkYzI0MFwiLCBcIiNhZmQ4ZjhcIiwgXCIjY2I0YjRiXCIsIFwiIzRkYTc0ZFwiLCBcIiM5NDQwZWRcIl0sXG4gICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG5vQ29sdW1uczogMSwgLy8gbnVtYmVyIG9mIGNvbHVtcyBpbiBsZWdlbmQgdGFibGVcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxGb3JtYXR0ZXI6IG51bGwsIC8vIGZuOiBzdHJpbmcgLT4gc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsQm94Qm9yZGVyQ29sb3I6IFwiI2NjY1wiLCAvLyBib3JkZXIgY29sb3IgZm9yIHRoZSBsaXR0bGUgbGFiZWwgYm94ZXNcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBudWxsLCAvLyBjb250YWluZXIgKGFzIGpRdWVyeSBvYmplY3QpIHRvIHB1dCBsZWdlbmQgaW4sIG51bGwgbWVhbnMgZGVmYXVsdCBvbiB0b3Agb2YgZ3JhcGhcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwibmVcIiwgLy8gcG9zaXRpb24gb2YgZGVmYXVsdCBsZWdlbmQgY29udGFpbmVyIHdpdGhpbiBwbG90XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogNSwgLy8gZGlzdGFuY2UgZnJvbSBncmlkIGVkZ2UgdG8gZGVmYXVsdCBsZWdlbmQgY29udGFpbmVyIHdpdGhpbiBwbG90XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCwgLy8gbnVsbCBtZWFucyBhdXRvLWRldGVjdFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kT3BhY2l0eTogMC44NSwgLy8gc2V0IHRvIDAgdG8gYXZvaWQgYmFja2dyb3VuZFxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWQ6IG51bGwgICAgLy8gZGVmYXVsdCB0byBubyBsZWdlbmQgc29ydGluZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeGF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogbnVsbCwgLy8gbnVsbCA9IGF1dG8tZGV0ZWN0LCB0cnVlID0gYWx3YXlzLCBmYWxzZSA9IG5ldmVyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImJvdHRvbVwiLCAvLyBvciBcInRvcFwiXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IG51bGwsIC8vIG51bGwgb3IgXCJ0aW1lXCJcbiAgICAgICAgICAgICAgICAgICAgZm9udDogbnVsbCwgLy8gbnVsbCAoZGVyaXZlZCBmcm9tIENTUyBpbiBwbGFjZWhvbGRlcikgb3Igb2JqZWN0IGxpa2UgeyBzaXplOiAxMSwgbGluZUhlaWdodDogMTMsIHN0eWxlOiBcIml0YWxpY1wiLCB3ZWlnaHQ6IFwiYm9sZFwiLCBmYW1pbHk6IFwic2Fucy1zZXJpZlwiLCB2YXJpYW50OiBcInNtYWxsLWNhcHNcIiB9XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBudWxsLCAvLyBiYXNlIGNvbG9yLCBsYWJlbHMsIHRpY2tzXG4gICAgICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogbnVsbCwgLy8gcG9zc2libHkgZGlmZmVyZW50IGNvbG9yIG9mIHRpY2tzLCBlLmcuIFwicmdiYSgwLDAsMCwwLjE1KVwiXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogbnVsbCwgLy8gbnVsbCBvciBmOiBudW1iZXIgLT4gbnVtYmVyIHRvIHRyYW5zZm9ybSBheGlzXG4gICAgICAgICAgICAgICAgICAgIGludmVyc2VUcmFuc2Zvcm06IG51bGwsIC8vIGlmIHRyYW5zZm9ybSBpcyBzZXQsIHRoaXMgc2hvdWxkIGJlIHRoZSBpbnZlcnNlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIG1pbjogbnVsbCwgLy8gbWluLiB2YWx1ZSB0byBzaG93LCBudWxsIG1lYW5zIHNldCBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICAgICAgICAgIG1heDogbnVsbCwgLy8gbWF4LiB2YWx1ZSB0byBzaG93LCBudWxsIG1lYW5zIHNldCBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgICAgICAgICAgIGF1dG9zY2FsZU1hcmdpbjogbnVsbCwgLy8gbWFyZ2luIGluICUgdG8gYWRkIGlmIGF1dG8tc2V0dGluZyBtaW4vbWF4XG4gICAgICAgICAgICAgICAgICAgIHRpY2tzOiBudWxsLCAvLyBlaXRoZXIgWzEsIDNdIG9yIFtbMSwgXCJhXCJdLCAzXSBvciAoZm46IGF4aXMgaW5mbyAtPiB0aWNrcykgb3IgYXBwLiBudW1iZXIgb2YgdGlja3MgZm9yIGF1dG8tdGlja3NcbiAgICAgICAgICAgICAgICAgICAgdGlja0Zvcm1hdHRlcjogbnVsbCwgLy8gZm46IG51bWJlciAtPiBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxXaWR0aDogbnVsbCwgLy8gc2l6ZSBvZiB0aWNrIGxhYmVscyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxIZWlnaHQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHJlc2VydmVTcGFjZTogbnVsbCwgLy8gd2hldGhlciB0byByZXNlcnZlIHNwYWNlIGV2ZW4gaWYgYXhpcyBpc24ndCBzaG93blxuICAgICAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoOiBudWxsLCAvLyBzaXplIGluIHBpeGVscyBvZiB0aWNrcywgb3IgXCJmdWxsXCIgZm9yIHdob2xlIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25UaWNrc1dpdGhBeGlzOiBudWxsLCAvLyBheGlzIG51bWJlciBvciBudWxsIGZvciBubyBzeW5jXG4gICAgICAgICAgICAgICAgICAgIHRpY2tEZWNpbWFsczogbnVsbCwgLy8gbm8uIG9mIGRlY2ltYWxzLCBudWxsIG1lYW5zIGF1dG9cbiAgICAgICAgICAgICAgICAgICAgdGlja1NpemU6IG51bGwsIC8vIG51bWJlciBvciBbbnVtYmVyLCBcInVuaXRcIl1cbiAgICAgICAgICAgICAgICAgICAgbWluVGlja1NpemU6IG51bGwgLy8gbnVtYmVyIG9yIFtudW1iZXIsIFwidW5pdFwiXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeWF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgYXV0b3NjYWxlTWFyZ2luOiAwLjAyLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJsZWZ0XCIgLy8gb3IgXCJyaWdodFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4YXhlczogW10sXG4gICAgICAgICAgICAgICAgeWF4ZXM6IFtdLFxuICAgICAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICAgICAgICBwb2ludHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAyLCAvLyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sOiBcImNpcmNsZVwiIC8vIG9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBkb24ndCBwdXQgaW4gc2hvdzogZmFsc2Ugc28gd2UgY2FuIHNlZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hldGhlciBsaW5lcyB3ZXJlIGFjdGl2ZWx5IGRpc2FibGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDIsIC8vIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwczogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9taXQgJ3plcm8nLCBzbyB3ZSBjYW4gbGF0ZXIgZGVmYXVsdCBpdHMgdmFsdWUgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoIHRoYXQgb2YgdGhlICdmaWxsJyBvcHRpb24uXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJhcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAyLCAvLyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhcldpZHRoOiAxLCAvLyBpbiB1bml0cyBvZiB0aGUgeCBheGlzXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ246IFwibGVmdFwiLCAvLyBcImxlZnRcIiwgXCJyaWdodFwiLCBvciBcImNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHplcm86IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2hhZG93U2l6ZTogMyxcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0Q29sb3I6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWJvdmVEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzU0NTQ1NFwiLCAvLyBwcmltYXJ5IGNvbG9yIHVzZWQgZm9yIG91dGxpbmUgYW5kIGxhYmVsc1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG51bGwsIC8vIG51bGwgZm9yIHRyYW5zcGFyZW50LCBlbHNlIGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBudWxsLCAvLyBzZXQgaWYgZGlmZmVyZW50IGZyb20gdGhlIGdyaWQgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgdGlja0NvbG9yOiBudWxsLCAvLyBjb2xvciBmb3IgdGhlIHRpY2tzLCBlLmcuIFwicmdiYSgwLDAsMCwwLjE1KVwiXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCwgLy8gZGlzdGFuY2UgZnJvbSB0aGUgY2FudmFzIGVkZ2UgdG8gdGhlIGdyaWRcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxNYXJnaW46IDUsIC8vIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICBheGlzTWFyZ2luOiA4LCAvLyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDIsIC8vIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICBtaW5Cb3JkZXJNYXJnaW46IG51bGwsIC8vIGluIHBpeGVscywgbnVsbCBtZWFucyB0YWtlbiBmcm9tIHBvaW50cyByYWRpdXNcbiAgICAgICAgICAgICAgICAgICAgbWFya2luZ3M6IG51bGwsIC8vIGFycmF5IG9mIHJhbmdlcyBvciBmbjogYXhlcyAtPiBhcnJheSBvZiByYW5nZXNcbiAgICAgICAgICAgICAgICAgICAgbWFya2luZ3NDb2xvcjogXCIjZjRmNGY0XCIsXG4gICAgICAgICAgICAgICAgICAgIG1hcmtpbmdzTGluZVdpZHRoOiAyLFxuICAgICAgICAgICAgICAgICAgICAvLyBpbnRlcmFjdGl2ZSBzdHVmZlxuICAgICAgICAgICAgICAgICAgICBjbGlja2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBob3ZlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBhdXRvSGlnaGxpZ2h0OiB0cnVlLCAvLyBoaWdobGlnaHQgaW4gY2FzZSBtb3VzZSBpcyBuZWFyXG4gICAgICAgICAgICAgICAgICAgIG1vdXNlQWN0aXZlUmFkaXVzOiAxMCAvLyBob3cgZmFyIHRoZSBtb3VzZSBjYW4gYmUgYXdheSB0byBhY3RpdmF0ZSBhbiBpdGVtXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICByZWRyYXdPdmVybGF5SW50ZXJ2YWw6IDEwMDAvNjAgLy8gdGltZSBiZXR3ZWVuIHVwZGF0ZXMsIC0xIG1lYW5zIGluIHNhbWUgZmxvd1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaG9va3M6IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICBzdXJmYWNlID0gbnVsbCwgICAgIC8vIHRoZSBjYW52YXMgZm9yIHRoZSBwbG90IGl0c2VsZlxuICAgICAgICBvdmVybGF5ID0gbnVsbCwgICAgIC8vIGNhbnZhcyBmb3IgaW50ZXJhY3RpdmUgc3R1ZmYgb24gdG9wIG9mIHBsb3RcbiAgICAgICAgZXZlbnRIb2xkZXIgPSBudWxsLCAvLyBqUXVlcnkgb2JqZWN0IHRoYXQgZXZlbnRzIHNob3VsZCBiZSBib3VuZCB0b1xuICAgICAgICBjdHggPSBudWxsLCBvY3R4ID0gbnVsbCxcbiAgICAgICAgeGF4ZXMgPSBbXSwgeWF4ZXMgPSBbXSxcbiAgICAgICAgcGxvdE9mZnNldCA9IHsgbGVmdDogMCwgcmlnaHQ6IDAsIHRvcDogMCwgYm90dG9tOiAwfSxcbiAgICAgICAgcGxvdFdpZHRoID0gMCwgcGxvdEhlaWdodCA9IDAsXG4gICAgICAgIGhvb2tzID0ge1xuICAgICAgICAgICAgcHJvY2Vzc09wdGlvbnM6IFtdLFxuICAgICAgICAgICAgcHJvY2Vzc1Jhd0RhdGE6IFtdLFxuICAgICAgICAgICAgcHJvY2Vzc0RhdGFwb2ludHM6IFtdLFxuICAgICAgICAgICAgcHJvY2Vzc09mZnNldDogW10sXG4gICAgICAgICAgICBkcmF3QmFja2dyb3VuZDogW10sXG4gICAgICAgICAgICBkcmF3U2VyaWVzOiBbXSxcbiAgICAgICAgICAgIGRyYXc6IFtdLFxuICAgICAgICAgICAgYmluZEV2ZW50czogW10sXG4gICAgICAgICAgICBkcmF3T3ZlcmxheTogW10sXG4gICAgICAgICAgICBzaHV0ZG93bjogW11cbiAgICAgICAgfSxcbiAgICAgICAgcGxvdCA9IHRoaXM7XG5cbiAgICAgICAgLy8gcHVibGljIGZ1bmN0aW9uc1xuICAgICAgICBwbG90LnNldERhdGEgPSBzZXREYXRhO1xuICAgICAgICBwbG90LnNldHVwR3JpZCA9IHNldHVwR3JpZDtcbiAgICAgICAgcGxvdC5kcmF3ID0gZHJhdztcbiAgICAgICAgcGxvdC5nZXRQbGFjZWhvbGRlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gcGxhY2Vob2xkZXI7IH07XG4gICAgICAgIHBsb3QuZ2V0Q2FudmFzID0gZnVuY3Rpb24oKSB7IHJldHVybiBzdXJmYWNlLmVsZW1lbnQ7IH07XG4gICAgICAgIHBsb3QuZ2V0UGxvdE9mZnNldCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gcGxvdE9mZnNldDsgfTtcbiAgICAgICAgcGxvdC53aWR0aCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBsb3RXaWR0aDsgfTtcbiAgICAgICAgcGxvdC5oZWlnaHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwbG90SGVpZ2h0OyB9O1xuICAgICAgICBwbG90Lm9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvID0gZXZlbnRIb2xkZXIub2Zmc2V0KCk7XG4gICAgICAgICAgICBvLmxlZnQgKz0gcGxvdE9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgby50b3AgKz0gcGxvdE9mZnNldC50b3A7XG4gICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgfTtcbiAgICAgICAgcGxvdC5nZXREYXRhID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VyaWVzOyB9O1xuICAgICAgICBwbG90LmdldEF4ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0ge30sIGk7XG4gICAgICAgICAgICAkLmVhY2goeGF4ZXMuY29uY2F0KHlheGVzKSwgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcylcbiAgICAgICAgICAgICAgICAgICAgcmVzW2F4aXMuZGlyZWN0aW9uICsgKGF4aXMubiAhPSAxID8gYXhpcy5uIDogXCJcIikgKyBcImF4aXNcIl0gPSBheGlzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9O1xuICAgICAgICBwbG90LmdldFhBeGVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geGF4ZXM7IH07XG4gICAgICAgIHBsb3QuZ2V0WUF4ZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB5YXhlczsgfTtcbiAgICAgICAgcGxvdC5jMnAgPSBjYW52YXNUb0F4aXNDb29yZHM7XG4gICAgICAgIHBsb3QucDJjID0gYXhpc1RvQ2FudmFzQ29vcmRzO1xuICAgICAgICBwbG90LmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBvcHRpb25zOyB9O1xuICAgICAgICBwbG90LmhpZ2hsaWdodCA9IGhpZ2hsaWdodDtcbiAgICAgICAgcGxvdC51bmhpZ2hsaWdodCA9IHVuaGlnaGxpZ2h0O1xuICAgICAgICBwbG90LnRyaWdnZXJSZWRyYXdPdmVybGF5ID0gdHJpZ2dlclJlZHJhd092ZXJsYXk7XG4gICAgICAgIHBsb3QucG9pbnRPZmZzZXQgPSBmdW5jdGlvbihwb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBwYXJzZUludCh4YXhlc1theGlzTnVtYmVyKHBvaW50LCBcInhcIikgLSAxXS5wMmMoK3BvaW50LngpICsgcGxvdE9mZnNldC5sZWZ0LCAxMCksXG4gICAgICAgICAgICAgICAgdG9wOiBwYXJzZUludCh5YXhlc1theGlzTnVtYmVyKHBvaW50LCBcInlcIikgLSAxXS5wMmMoK3BvaW50LnkpICsgcGxvdE9mZnNldC50b3AsIDEwKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgcGxvdC5zaHV0ZG93biA9IHNodXRkb3duO1xuICAgICAgICBwbG90LmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzaHV0ZG93bigpO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXIucmVtb3ZlRGF0YShcInBsb3RcIikuZW1wdHkoKTtcblxuICAgICAgICAgICAgc2VyaWVzID0gW107XG4gICAgICAgICAgICBvcHRpb25zID0gbnVsbDtcbiAgICAgICAgICAgIHN1cmZhY2UgPSBudWxsO1xuICAgICAgICAgICAgb3ZlcmxheSA9IG51bGw7XG4gICAgICAgICAgICBldmVudEhvbGRlciA9IG51bGw7XG4gICAgICAgICAgICBjdHggPSBudWxsO1xuICAgICAgICAgICAgb2N0eCA9IG51bGw7XG4gICAgICAgICAgICB4YXhlcyA9IFtdO1xuICAgICAgICAgICAgeWF4ZXMgPSBbXTtcbiAgICAgICAgICAgIGhvb2tzID0gbnVsbDtcbiAgICAgICAgICAgIGhpZ2hsaWdodHMgPSBbXTtcbiAgICAgICAgICAgIHBsb3QgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBwbG90LnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHR2YXIgd2lkdGggPSBwbGFjZWhvbGRlci53aWR0aCgpLFxuICAgICAgICBcdFx0aGVpZ2h0ID0gcGxhY2Vob2xkZXIuaGVpZ2h0KCk7XG4gICAgICAgICAgICBzdXJmYWNlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIG92ZXJsYXkucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHB1YmxpYyBhdHRyaWJ1dGVzXG4gICAgICAgIHBsb3QuaG9va3MgPSBob29rcztcblxuICAgICAgICAvLyBpbml0aWFsaXplXG4gICAgICAgIGluaXRQbHVnaW5zKHBsb3QpO1xuICAgICAgICBwYXJzZU9wdGlvbnMob3B0aW9uc18pO1xuICAgICAgICBzZXR1cENhbnZhc2VzKCk7XG4gICAgICAgIHNldERhdGEoZGF0YV8pO1xuICAgICAgICBzZXR1cEdyaWQoKTtcbiAgICAgICAgZHJhdygpO1xuICAgICAgICBiaW5kRXZlbnRzKCk7XG5cblxuICAgICAgICBmdW5jdGlvbiBleGVjdXRlSG9va3MoaG9vaywgYXJncykge1xuICAgICAgICAgICAgYXJncyA9IFtwbG90XS5jb25jYXQoYXJncyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhvb2subGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgaG9va1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluaXRQbHVnaW5zKCkge1xuXG4gICAgICAgICAgICAvLyBSZWZlcmVuY2VzIHRvIGtleSBjbGFzc2VzLCBhbGxvd2luZyBwbHVnaW5zIHRvIG1vZGlmeSB0aGVtXG5cbiAgICAgICAgICAgIHZhciBjbGFzc2VzID0ge1xuICAgICAgICAgICAgICAgIENhbnZhczogQ2FudmFzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsdWdpbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHBsdWdpbnNbaV07XG4gICAgICAgICAgICAgICAgcC5pbml0KHBsb3QsIGNsYXNzZXMpO1xuICAgICAgICAgICAgICAgIGlmIChwLm9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG9wdGlvbnMsIHAub3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwYXJzZU9wdGlvbnMob3B0cykge1xuXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvcHRpb25zLCBvcHRzKTtcblxuICAgICAgICAgICAgLy8gJC5leHRlbmQgbWVyZ2VzIGFycmF5cywgcmF0aGVyIHRoYW4gcmVwbGFjaW5nIHRoZW0uICBXaGVuIGxlc3NcbiAgICAgICAgICAgIC8vIGNvbG9ycyBhcmUgcHJvdmlkZWQgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgZGVmYXVsdCBwYWxldHRlLCB3ZVxuICAgICAgICAgICAgLy8gZW5kIHVwIHdpdGggdGhvc2UgY29sb3JzIHBsdXMgdGhlIHJlbWFpbmluZyBkZWZhdWx0cywgd2hpY2ggaXNcbiAgICAgICAgICAgIC8vIG5vdCBleHBlY3RlZCBiZWhhdmlvcjsgYXZvaWQgaXQgYnkgcmVwbGFjaW5nIHRoZW0gaGVyZS5cblxuICAgICAgICAgICAgaWYgKG9wdHMgJiYgb3B0cy5jb2xvcnMpIHtcbiAgICAgICAgICAgIFx0b3B0aW9ucy5jb2xvcnMgPSBvcHRzLmNvbG9ycztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMueGF4aXMuY29sb3IgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLnhheGlzLmNvbG9yID0gJC5jb2xvci5wYXJzZShvcHRpb25zLmdyaWQuY29sb3IpLnNjYWxlKCdhJywgMC4yMikudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnlheGlzLmNvbG9yID09IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy55YXhpcy5jb2xvciA9ICQuY29sb3IucGFyc2Uob3B0aW9ucy5ncmlkLmNvbG9yKS5zY2FsZSgnYScsIDAuMjIpLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnhheGlzLnRpY2tDb2xvciA9PSBudWxsKSAvLyBncmlkLnRpY2tDb2xvciBmb3IgYmFjay1jb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgb3B0aW9ucy54YXhpcy50aWNrQ29sb3IgPSBvcHRpb25zLmdyaWQudGlja0NvbG9yIHx8IG9wdGlvbnMueGF4aXMuY29sb3I7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy55YXhpcy50aWNrQ29sb3IgPT0gbnVsbCkgLy8gZ3JpZC50aWNrQ29sb3IgZm9yIGJhY2stY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4aXMudGlja0NvbG9yID0gb3B0aW9ucy5ncmlkLnRpY2tDb2xvciB8fCBvcHRpb25zLnlheGlzLmNvbG9yO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmJvcmRlckNvbG9yID09IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ncmlkLmJvcmRlckNvbG9yID0gb3B0aW9ucy5ncmlkLmNvbG9yO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC50aWNrQ29sb3IgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLmdyaWQudGlja0NvbG9yID0gJC5jb2xvci5wYXJzZShvcHRpb25zLmdyaWQuY29sb3IpLnNjYWxlKCdhJywgMC4yMikudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgLy8gRmlsbCBpbiBkZWZhdWx0cyBmb3IgYXhpcyBvcHRpb25zLCBpbmNsdWRpbmcgYW55IHVuc3BlY2lmaWVkXG4gICAgICAgICAgICAvLyBmb250LXNwZWMgZmllbGRzLCBpZiBhIGZvbnQtc3BlYyB3YXMgcHJvdmlkZWQuXG5cbiAgICAgICAgICAgIC8vIElmIG5vIHgveSBheGlzIG9wdGlvbnMgd2VyZSBwcm92aWRlZCwgY3JlYXRlIG9uZSBvZiBlYWNoIGFueXdheSxcbiAgICAgICAgICAgIC8vIHNpbmNlIHRoZSByZXN0IG9mIHRoZSBjb2RlIGFzc3VtZXMgdGhhdCB0aGV5IGV4aXN0LlxuXG4gICAgICAgICAgICB2YXIgaSwgYXhpc09wdGlvbnMsIGF4aXNDb3VudCxcbiAgICAgICAgICAgICAgICBmb250U2l6ZSA9IHBsYWNlaG9sZGVyLmNzcyhcImZvbnQtc2l6ZVwiKSxcbiAgICAgICAgICAgICAgICBmb250U2l6ZURlZmF1bHQgPSBmb250U2l6ZSA/ICtmb250U2l6ZS5yZXBsYWNlKFwicHhcIiwgXCJcIikgOiAxMyxcbiAgICAgICAgICAgICAgICBmb250RGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlOiBwbGFjZWhvbGRlci5jc3MoXCJmb250LXN0eWxlXCIpLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBNYXRoLnJvdW5kKDAuOCAqIGZvbnRTaXplRGVmYXVsdCksXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ6IHBsYWNlaG9sZGVyLmNzcyhcImZvbnQtdmFyaWFudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiBwbGFjZWhvbGRlci5jc3MoXCJmb250LXdlaWdodFwiKSxcbiAgICAgICAgICAgICAgICAgICAgZmFtaWx5OiBwbGFjZWhvbGRlci5jc3MoXCJmb250LWZhbWlseVwiKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGF4aXNDb3VudCA9IG9wdGlvbnMueGF4ZXMubGVuZ3RoIHx8IDE7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXhpc0NvdW50OyArK2kpIHtcblxuICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zID0gb3B0aW9ucy54YXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpc09wdGlvbnMgJiYgIWF4aXNPcHRpb25zLnRpY2tDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy50aWNrQ29sb3IgPSBheGlzT3B0aW9ucy5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBheGlzT3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zLnhheGlzLCBheGlzT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy54YXhlc1tpXSA9IGF4aXNPcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgaWYgKGF4aXNPcHRpb25zLmZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMuZm9udCA9ICQuZXh0ZW5kKHt9LCBmb250RGVmYXVsdHMsIGF4aXNPcHRpb25zLmZvbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWF4aXNPcHRpb25zLmZvbnQuY29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLmZvbnQuY29sb3IgPSBheGlzT3B0aW9ucy5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF4aXNPcHRpb25zLmZvbnQubGluZUhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMuZm9udC5saW5lSGVpZ2h0ID0gTWF0aC5yb3VuZChheGlzT3B0aW9ucy5mb250LnNpemUgKiAxLjE1KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXhpc0NvdW50ID0gb3B0aW9ucy55YXhlcy5sZW5ndGggfHwgMTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBheGlzQ291bnQ7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgYXhpc09wdGlvbnMgPSBvcHRpb25zLnlheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzT3B0aW9ucyAmJiAhYXhpc09wdGlvbnMudGlja0NvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLnRpY2tDb2xvciA9IGF4aXNPcHRpb25zLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMueWF4aXMsIGF4aXNPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnlheGVzW2ldID0gYXhpc09wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICBpZiAoYXhpc09wdGlvbnMuZm9udCkge1xuICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy5mb250ID0gJC5leHRlbmQoe30sIGZvbnREZWZhdWx0cywgYXhpc09wdGlvbnMuZm9udCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXhpc09wdGlvbnMuZm9udC5jb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMuZm9udC5jb2xvciA9IGF4aXNPcHRpb25zLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXhpc09wdGlvbnMuZm9udC5saW5lSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy5mb250LmxpbmVIZWlnaHQgPSBNYXRoLnJvdW5kKGF4aXNPcHRpb25zLmZvbnQuc2l6ZSAqIDEuMTUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgdG8gYmUgcmVtb3ZlZCBpbiBmdXR1cmVcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnhheGlzLm5vVGlja3MgJiYgb3B0aW9ucy54YXhpcy50aWNrcyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4aXMudGlja3MgPSBvcHRpb25zLnhheGlzLm5vVGlja3M7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy55YXhpcy5ub1RpY2tzICYmIG9wdGlvbnMueWF4aXMudGlja3MgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLnlheGlzLnRpY2tzID0gb3B0aW9ucy55YXhpcy5ub1RpY2tzO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMueDJheGlzKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy54YXhlc1sxXSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zLnhheGlzLCBvcHRpb25zLngyYXhpcyk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy54YXhlc1sxXS5wb3NpdGlvbiA9IFwidG9wXCI7XG4gICAgICAgICAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGluaGVyaXQgdG8gYWxsb3cgdGhlIGF4aXMgdG8gYXV0by1zY2FsZVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLngyYXhpcy5taW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnhheGVzWzFdLm1pbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLngyYXhpcy5tYXggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnhheGVzWzFdLm1heCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMueTJheGlzKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy55YXhlc1sxXSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zLnlheGlzLCBvcHRpb25zLnkyYXhpcyk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy55YXhlc1sxXS5wb3NpdGlvbiA9IFwicmlnaHRcIjtcbiAgICAgICAgICAgICAgICAvLyBPdmVycmlkZSB0aGUgaW5oZXJpdCB0byBhbGxvdyB0aGUgYXhpcyB0byBhdXRvLXNjYWxlXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMueTJheGlzLm1pbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4ZXNbMV0ubWluID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMueTJheGlzLm1heCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4ZXNbMV0ubWF4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmNvbG9yZWRBcmVhcylcbiAgICAgICAgICAgICAgICBvcHRpb25zLmdyaWQubWFya2luZ3MgPSBvcHRpb25zLmdyaWQuY29sb3JlZEFyZWFzO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5jb2xvcmVkQXJlYXNDb2xvcilcbiAgICAgICAgICAgICAgICBvcHRpb25zLmdyaWQubWFya2luZ3NDb2xvciA9IG9wdGlvbnMuZ3JpZC5jb2xvcmVkQXJlYXNDb2xvcjtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxpbmVzKVxuICAgICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG9wdGlvbnMuc2VyaWVzLmxpbmVzLCBvcHRpb25zLmxpbmVzKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBvaW50cylcbiAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvcHRpb25zLnNlcmllcy5wb2ludHMsIG9wdGlvbnMucG9pbnRzKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmJhcnMpXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0aW9ucy5zZXJpZXMuYmFycywgb3B0aW9ucy5iYXJzKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNoYWRvd1NpemUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllcy5zaGFkb3dTaXplID0gb3B0aW9ucy5zaGFkb3dTaXplO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGlnaGxpZ2h0Q29sb3IgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllcy5oaWdobGlnaHRDb2xvciA9IG9wdGlvbnMuaGlnaGxpZ2h0Q29sb3I7XG5cbiAgICAgICAgICAgIC8vIHNhdmUgb3B0aW9ucyBvbiBheGVzIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0aW9ucy54YXhlcy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBnZXRPckNyZWF0ZUF4aXMoeGF4ZXMsIGkgKyAxKS5vcHRpb25zID0gb3B0aW9ucy54YXhlc1tpXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHRpb25zLnlheGVzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIGdldE9yQ3JlYXRlQXhpcyh5YXhlcywgaSArIDEpLm9wdGlvbnMgPSBvcHRpb25zLnlheGVzW2ldO1xuXG4gICAgICAgICAgICAvLyBhZGQgaG9va3MgZnJvbSBvcHRpb25zXG4gICAgICAgICAgICBmb3IgKHZhciBuIGluIGhvb2tzKVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmhvb2tzW25dICYmIG9wdGlvbnMuaG9va3Nbbl0ubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICBob29rc1tuXSA9IGhvb2tzW25dLmNvbmNhdChvcHRpb25zLmhvb2tzW25dKTtcblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLnByb2Nlc3NPcHRpb25zLCBbb3B0aW9uc10pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0RGF0YShkKSB7XG4gICAgICAgICAgICBzZXJpZXMgPSBwYXJzZURhdGEoZCk7XG4gICAgICAgICAgICBmaWxsSW5TZXJpZXNPcHRpb25zKCk7XG4gICAgICAgICAgICBwcm9jZXNzRGF0YSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGFyc2VEYXRhKGQpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBzID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMuc2VyaWVzKTtcblxuICAgICAgICAgICAgICAgIGlmIChkW2ldLmRhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzLmRhdGEgPSBkW2ldLmRhdGE7IC8vIG1vdmUgdGhlIGRhdGEgaW5zdGVhZCBvZiBkZWVwLWNvcHlcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRbaV0uZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBzLCBkW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBkW2ldLmRhdGEgPSBzLmRhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcy5kYXRhID0gZFtpXTtcbiAgICAgICAgICAgICAgICByZXMucHVzaChzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGF4aXNOdW1iZXIob2JqLCBjb29yZCkge1xuICAgICAgICAgICAgdmFyIGEgPSBvYmpbY29vcmQgKyBcImF4aXNcIl07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGEgPT0gXCJvYmplY3RcIikgLy8gaWYgd2UgZ290IGEgcmVhbCBheGlzLCBleHRyYWN0IG51bWJlclxuICAgICAgICAgICAgICAgIGEgPSBhLm47XG4gICAgICAgICAgICBpZiAodHlwZW9mIGEgIT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICBhID0gMTsgLy8gZGVmYXVsdCB0byBmaXJzdCBheGlzXG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFsbEF4ZXMoKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gZmxhdCBhcnJheSB3aXRob3V0IGFubm95aW5nIG51bGwgZW50cmllc1xuICAgICAgICAgICAgcmV0dXJuICQuZ3JlcCh4YXhlcy5jb25jYXQoeWF4ZXMpLCBmdW5jdGlvbiAoYSkgeyByZXR1cm4gYTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjYW52YXNUb0F4aXNDb29yZHMocG9zKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gYW4gb2JqZWN0IHdpdGggeC95IGNvcnJlc3BvbmRpbmcgdG8gYWxsIHVzZWQgYXhlc1xuICAgICAgICAgICAgdmFyIHJlcyA9IHt9LCBpLCBheGlzO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHhheGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgYXhpcyA9IHhheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzICYmIGF4aXMudXNlZClcbiAgICAgICAgICAgICAgICAgICAgcmVzW1wieFwiICsgYXhpcy5uXSA9IGF4aXMuYzJwKHBvcy5sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHlheGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgYXhpcyA9IHlheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzICYmIGF4aXMudXNlZClcbiAgICAgICAgICAgICAgICAgICAgcmVzW1wieVwiICsgYXhpcy5uXSA9IGF4aXMuYzJwKHBvcy50b3ApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzLngxICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmVzLnggPSByZXMueDE7XG4gICAgICAgICAgICBpZiAocmVzLnkxICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmVzLnkgPSByZXMueTE7XG5cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBheGlzVG9DYW52YXNDb29yZHMocG9zKSB7XG4gICAgICAgICAgICAvLyBnZXQgY2FudmFzIGNvb3JkcyBmcm9tIHRoZSBmaXJzdCBwYWlyIG9mIHgveSBmb3VuZCBpbiBwb3NcbiAgICAgICAgICAgIHZhciByZXMgPSB7fSwgaSwgYXhpcywga2V5O1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgeGF4ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBheGlzID0geGF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgJiYgYXhpcy51c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFwieFwiICsgYXhpcy5uO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zW2tleV0gPT0gbnVsbCAmJiBheGlzLm4gPT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IFwieFwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3Nba2V5XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMubGVmdCA9IGF4aXMucDJjKHBvc1trZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgeWF4ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBheGlzID0geWF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgJiYgYXhpcy51c2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFwieVwiICsgYXhpcy5uO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zW2tleV0gPT0gbnVsbCAmJiBheGlzLm4gPT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IFwieVwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3Nba2V5XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMudG9wID0gYXhpcy5wMmMocG9zW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRPckNyZWF0ZUF4aXMoYXhlcywgbnVtYmVyKSB7XG4gICAgICAgICAgICBpZiAoIWF4ZXNbbnVtYmVyIC0gMV0pXG4gICAgICAgICAgICAgICAgYXhlc1tudW1iZXIgLSAxXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbjogbnVtYmVyLCAvLyBzYXZlIHRoZSBudW1iZXIgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBheGVzID09IHhheGVzID8gXCJ4XCIgOiBcInlcIixcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogJC5leHRlbmQodHJ1ZSwge30sIGF4ZXMgPT0geGF4ZXMgPyBvcHRpb25zLnhheGlzIDogb3B0aW9ucy55YXhpcylcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gYXhlc1tudW1iZXIgLSAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbGxJblNlcmllc09wdGlvbnMoKSB7XG5cbiAgICAgICAgICAgIHZhciBuZWVkZWRDb2xvcnMgPSBzZXJpZXMubGVuZ3RoLCBtYXhJbmRleCA9IC0xLCBpO1xuXG4gICAgICAgICAgICAvLyBTdWJ0cmFjdCB0aGUgbnVtYmVyIG9mIHNlcmllcyB0aGF0IGFscmVhZHkgaGF2ZSBmaXhlZCBjb2xvcnMgb3JcbiAgICAgICAgICAgIC8vIGNvbG9yIGluZGV4ZXMgZnJvbSB0aGUgbnVtYmVyIHRoYXQgd2Ugc3RpbGwgbmVlZCB0byBnZW5lcmF0ZS5cblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBzYyA9IHNlcmllc1tpXS5jb2xvcjtcbiAgICAgICAgICAgICAgICBpZiAoc2MgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBuZWVkZWRDb2xvcnMtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzYyA9PSBcIm51bWJlclwiICYmIHNjID4gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gc2M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGFueSBvZiB0aGUgc2VyaWVzIGhhdmUgZml4ZWQgY29sb3IgaW5kZXhlcywgdGhlbiB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBhdCBsZWFzdCBhcyBtYW55IGNvbG9ycyBhcyB0aGUgaGlnaGVzdCBpbmRleC5cblxuICAgICAgICAgICAgaWYgKG5lZWRlZENvbG9ycyA8PSBtYXhJbmRleCkge1xuICAgICAgICAgICAgICAgIG5lZWRlZENvbG9ycyA9IG1heEluZGV4ICsgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYWxsIHRoZSBjb2xvcnMsIHVzaW5nIGZpcnN0IHRoZSBvcHRpb24gY29sb3JzIGFuZCB0aGVuXG4gICAgICAgICAgICAvLyB2YXJpYXRpb25zIG9uIHRob3NlIGNvbG9ycyBvbmNlIHRoZXkncmUgZXhoYXVzdGVkLlxuXG4gICAgICAgICAgICB2YXIgYywgY29sb3JzID0gW10sIGNvbG9yUG9vbCA9IG9wdGlvbnMuY29sb3JzLFxuICAgICAgICAgICAgICAgIGNvbG9yUG9vbFNpemUgPSBjb2xvclBvb2wubGVuZ3RoLCB2YXJpYXRpb24gPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmVlZGVkQ29sb3JzOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIGMgPSAkLmNvbG9yLnBhcnNlKGNvbG9yUG9vbFtpICUgY29sb3JQb29sU2l6ZV0gfHwgXCIjNjY2XCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gRWFjaCB0aW1lIHdlIGV4aGF1c3QgdGhlIGNvbG9ycyBpbiB0aGUgcG9vbCB3ZSBhZGp1c3RcbiAgICAgICAgICAgICAgICAvLyBhIHNjYWxpbmcgZmFjdG9yIHVzZWQgdG8gcHJvZHVjZSBtb3JlIHZhcmlhdGlvbnMgb25cbiAgICAgICAgICAgICAgICAvLyB0aG9zZSBjb2xvcnMuIFRoZSBmYWN0b3IgYWx0ZXJuYXRlcyBuZWdhdGl2ZS9wb3NpdGl2ZVxuICAgICAgICAgICAgICAgIC8vIHRvIHByb2R1Y2UgbGlnaHRlci9kYXJrZXIgY29sb3JzLlxuXG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHZhcmlhdGlvbiBhZnRlciBldmVyeSBmZXcgY3ljbGVzLCBvciBlbHNlXG4gICAgICAgICAgICAgICAgLy8gaXQgd2lsbCBlbmQgdXAgcHJvZHVjaW5nIG9ubHkgd2hpdGUgb3IgYmxhY2sgY29sb3JzLlxuXG4gICAgICAgICAgICAgICAgaWYgKGkgJSBjb2xvclBvb2xTaXplID09IDAgJiYgaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWF0aW9uID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYXRpb24gPCAwLjUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYXRpb24gPSAtdmFyaWF0aW9uIC0gMC4yO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHZhcmlhdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB2YXJpYXRpb24gPSAtdmFyaWF0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbG9yc1tpXSA9IGMuc2NhbGUoJ3JnYicsIDEgKyB2YXJpYXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGaW5hbGl6ZSB0aGUgc2VyaWVzIG9wdGlvbnMsIGZpbGxpbmcgaW4gdGhlaXIgY29sb3JzXG5cbiAgICAgICAgICAgIHZhciBjb2xvcmkgPSAwLCBzO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbaV07XG5cbiAgICAgICAgICAgICAgICAvLyBhc3NpZ24gY29sb3JzXG4gICAgICAgICAgICAgICAgaWYgKHMuY29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzLmNvbG9yID0gY29sb3JzW2NvbG9yaV0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgKytjb2xvcmk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzLmNvbG9yID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgICAgIHMuY29sb3IgPSBjb2xvcnNbcy5jb2xvcl0udG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgIC8vIHR1cm4gb24gbGluZXMgYXV0b21hdGljYWxseSBpbiBjYXNlIG5vdGhpbmcgaXMgc2V0XG4gICAgICAgICAgICAgICAgaWYgKHMubGluZXMuc2hvdyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2LCBzaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2IGluIHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc1t2XSAmJiBzW3ZdLnNob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgcy5saW5lcy5zaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBub3RoaW5nIHdhcyBwcm92aWRlZCBmb3IgbGluZXMuemVybywgZGVmYXVsdCBpdCB0byBtYXRjaFxuICAgICAgICAgICAgICAgIC8vIGxpbmVzLmZpbGwsIHNpbmNlIGFyZWFzIGJ5IGRlZmF1bHQgc2hvdWxkIGV4dGVuZCB0byB6ZXJvLlxuXG4gICAgICAgICAgICAgICAgaWYgKHMubGluZXMuemVybyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHMubGluZXMuemVybyA9ICEhcy5saW5lcy5maWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHNldHVwIGF4ZXNcbiAgICAgICAgICAgICAgICBzLnhheGlzID0gZ2V0T3JDcmVhdGVBeGlzKHhheGVzLCBheGlzTnVtYmVyKHMsIFwieFwiKSk7XG4gICAgICAgICAgICAgICAgcy55YXhpcyA9IGdldE9yQ3JlYXRlQXhpcyh5YXhlcywgYXhpc051bWJlcihzLCBcInlcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0RhdGEoKSB7XG4gICAgICAgICAgICB2YXIgdG9wU2VudHJ5ID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICAgIGJvdHRvbVNlbnRyeSA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgICAgICBmYWtlSW5maW5pdHkgPSBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgICAgICAgICAgICAgIGksIGosIGssIG0sIGxlbmd0aCxcbiAgICAgICAgICAgICAgICBzLCBwb2ludHMsIHBzLCB4LCB5LCBheGlzLCB2YWwsIGYsIHAsXG4gICAgICAgICAgICAgICAgZGF0YSwgZm9ybWF0O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVBeGlzKGF4aXMsIG1pbiwgbWF4KSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pbiA8IGF4aXMuZGF0YW1pbiAmJiBtaW4gIT0gLWZha2VJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5kYXRhbWluID0gbWluO1xuICAgICAgICAgICAgICAgIGlmIChtYXggPiBheGlzLmRhdGFtYXggJiYgbWF4ICE9IGZha2VJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5kYXRhbWF4ID0gbWF4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2goYWxsQXhlcygpLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIC8vIGluaXQgYXhpc1xuICAgICAgICAgICAgICAgIGF4aXMuZGF0YW1pbiA9IHRvcFNlbnRyeTtcbiAgICAgICAgICAgICAgICBheGlzLmRhdGFtYXggPSBib3R0b21TZW50cnk7XG4gICAgICAgICAgICAgICAgYXhpcy51c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbaV07XG4gICAgICAgICAgICAgICAgcy5kYXRhcG9pbnRzID0geyBwb2ludHM6IFtdIH07XG5cbiAgICAgICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MucHJvY2Vzc1Jhd0RhdGEsIFsgcywgcy5kYXRhLCBzLmRhdGFwb2ludHMgXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpcnN0IHBhc3M6IGNsZWFuIGFuZCBjb3B5IGRhdGFcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW2ldO1xuXG4gICAgICAgICAgICAgICAgZGF0YSA9IHMuZGF0YTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBzLmRhdGFwb2ludHMuZm9ybWF0O1xuXG4gICAgICAgICAgICAgICAgaWYgKCFmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgb3V0IGhvdyB0byBjb3B5XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdC5wdXNoKHsgeDogdHJ1ZSwgbnVtYmVyOiB0cnVlLCByZXF1aXJlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0LnB1c2goeyB5OiB0cnVlLCBudW1iZXI6IHRydWUsIHJlcXVpcmVkOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmJhcnMuc2hvdyB8fCAocy5saW5lcy5zaG93ICYmIHMubGluZXMuZmlsbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXRvc2NhbGUgPSAhISgocy5iYXJzLnNob3cgJiYgcy5iYXJzLnplcm8pIHx8IChzLmxpbmVzLnNob3cgJiYgcy5saW5lcy56ZXJvKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQucHVzaCh7IHk6IHRydWUsIG51bWJlcjogdHJ1ZSwgcmVxdWlyZWQ6IGZhbHNlLCBkZWZhdWx0VmFsdWU6IDAsIGF1dG9zY2FsZTogYXV0b3NjYWxlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMuYmFycy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm1hdFtmb3JtYXQubGVuZ3RoIC0gMV0ueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXRbZm9ybWF0Lmxlbmd0aCAtIDFdLnggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcy5kYXRhcG9pbnRzLmZvcm1hdCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocy5kYXRhcG9pbnRzLnBvaW50c2l6ZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gYWxyZWFkeSBmaWxsZWQgaW5cblxuICAgICAgICAgICAgICAgIHMuZGF0YXBvaW50cy5wb2ludHNpemUgPSBmb3JtYXQubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgcHMgPSBzLmRhdGFwb2ludHMucG9pbnRzaXplO1xuICAgICAgICAgICAgICAgIHBvaW50cyA9IHMuZGF0YXBvaW50cy5wb2ludHM7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5zZXJ0U3RlcHMgPSBzLmxpbmVzLnNob3cgJiYgcy5saW5lcy5zdGVwcztcbiAgICAgICAgICAgICAgICBzLnhheGlzLnVzZWQgPSBzLnlheGlzLnVzZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgZm9yIChqID0gayA9IDA7IGogPCBkYXRhLmxlbmd0aDsgKytqLCBrICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgIHAgPSBkYXRhW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBudWxsaWZ5ID0gcCA9PSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW51bGxpZnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IDA7IG0gPCBwczsgKyttKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcFttXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gZm9ybWF0W21dO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYubnVtYmVyICYmIHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSArdmFsOyAvLyBjb252ZXJ0IHRvIG51bWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHZhbCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbCA9PSBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBmYWtlSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWwgPT0gLUluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IC1mYWtlSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLnJlcXVpcmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGxpZnkgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5kZWZhdWx0VmFsdWUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBmLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1trICsgbV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbGlmeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gMDsgbSA8IHBzOyArK20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwb2ludHNbayArIG1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gZm9ybWF0W21dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBleHRyYWN0IG1pbi9tYXggaW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5hdXRvc2NhbGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi54KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlQXhpcyhzLnhheGlzLCB2YWwsIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlQXhpcyhzLnlheGlzLCB2YWwsIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2sgKyBtXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIGxpdHRsZSBiaXQgb2YgbGluZSBzcGVjaWZpYyBzdHVmZiB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwZXJoYXBzIHNob3VsZG4ndCBiZSBoZXJlLCBidXQgbGFja2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmV0dGVyIG1lYW5zLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0U3RlcHMgJiYgayA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwb2ludHNbayAtIHBzXSAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcG9pbnRzW2sgLSBwc10gIT0gcG9pbnRzW2tdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcG9pbnRzW2sgLSBwcyArIDFdICE9IHBvaW50c1trICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3B5IHRoZSBwb2ludCB0byBtYWtlIHJvb20gZm9yIGEgbWlkZGxlIHBvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gMDsgbSA8IHBzOyArK20pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1trICsgcHMgKyBtXSA9IHBvaW50c1trICsgbV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtaWRkbGUgcG9pbnQgaGFzIHNhbWUgeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1trICsgMV0gPSBwb2ludHNbayAtIHBzICsgMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSd2ZSBhZGRlZCBhIHBvaW50LCBiZXR0ZXIgcmVmbGVjdCB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgayArPSBwcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2l2ZSB0aGUgaG9va3MgYSBjaGFuY2UgdG8gcnVuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tpXTtcblxuICAgICAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5wcm9jZXNzRGF0YXBvaW50cywgWyBzLCBzLmRhdGFwb2ludHNdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2Vjb25kIHBhc3M6IGZpbmQgZGF0YW1heC9kYXRhbWluIGZvciBhdXRvLXNjYWxpbmdcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW2ldO1xuICAgICAgICAgICAgICAgIHBvaW50cyA9IHMuZGF0YXBvaW50cy5wb2ludHM7XG4gICAgICAgICAgICAgICAgcHMgPSBzLmRhdGFwb2ludHMucG9pbnRzaXplO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHMuZGF0YXBvaW50cy5mb3JtYXQ7XG5cbiAgICAgICAgICAgICAgICB2YXIgeG1pbiA9IHRvcFNlbnRyeSwgeW1pbiA9IHRvcFNlbnRyeSxcbiAgICAgICAgICAgICAgICAgICAgeG1heCA9IGJvdHRvbVNlbnRyeSwgeW1heCA9IGJvdHRvbVNlbnRyeTtcblxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBwb2ludHMubGVuZ3RoOyBqICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludHNbal0gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobSA9IDA7IG0gPCBwczsgKyttKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwb2ludHNbaiArIG1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGZvcm1hdFttXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZiB8fCBmLmF1dG9zY2FsZSA9PT0gZmFsc2UgfHwgdmFsID09IGZha2VJbmZpbml0eSB8fCB2YWwgPT0gLWZha2VJbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYueCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPCB4bWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4bWluID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPiB4bWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4bWF4ID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPCB5bWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5bWluID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPiB5bWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5bWF4ID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHMuYmFycy5zaG93KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBnb3Qgcm9vbSBmb3IgdGhlIGJhciBvbiB0aGUgZGFuY2luZyBmbG9vclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVsdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzLmJhcnMuYWxpZ24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGEgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGEgPSAtcy5iYXJzLmJhcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YSA9IC1zLmJhcnMuYmFyV2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuYmFycy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5bWluICs9IGRlbHRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgeW1heCArPSBkZWx0YSArIHMuYmFycy5iYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhtaW4gKz0gZGVsdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4bWF4ICs9IGRlbHRhICsgcy5iYXJzLmJhcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXBkYXRlQXhpcyhzLnhheGlzLCB4bWluLCB4bWF4KTtcbiAgICAgICAgICAgICAgICB1cGRhdGVBeGlzKHMueWF4aXMsIHltaW4sIHltYXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2goYWxsQXhlcygpLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIGlmIChheGlzLmRhdGFtaW4gPT0gdG9wU2VudHJ5KVxuICAgICAgICAgICAgICAgICAgICBheGlzLmRhdGFtaW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChheGlzLmRhdGFtYXggPT0gYm90dG9tU2VudHJ5KVxuICAgICAgICAgICAgICAgICAgICBheGlzLmRhdGFtYXggPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXR1cENhbnZhc2VzKCkge1xuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHBsYWNlaG9sZGVyIGlzIGNsZWFyIG9mIGV2ZXJ5dGhpbmcgZXhjZXB0IGNhbnZhc2VzXG4gICAgICAgICAgICAvLyBmcm9tIGEgcHJldmlvdXMgcGxvdCBpbiB0aGlzIGNvbnRhaW5lciB0aGF0IHdlJ2xsIHRyeSB0byByZS11c2UuXG5cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLmNzcyhcInBhZGRpbmdcIiwgMCkgLy8gcGFkZGluZyBtZXNzZXMgdXAgdGhlIHBvc2l0aW9uaW5nXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCkuZmlsdGVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhJCh0aGlzKS5oYXNDbGFzcyhcImZsb3Qtb3ZlcmxheVwiKSAmJiAhJCh0aGlzKS5oYXNDbGFzcygnZmxvdC1iYXNlJyk7XG4gICAgICAgICAgICAgICAgfSkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlci5jc3MoXCJwb3NpdGlvblwiKSA9PSAnc3RhdGljJylcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5jc3MoXCJwb3NpdGlvblwiLCBcInJlbGF0aXZlXCIpOyAvLyBmb3IgcG9zaXRpb25pbmcgbGFiZWxzIGFuZCBvdmVybGF5XG5cbiAgICAgICAgICAgIHN1cmZhY2UgPSBuZXcgQ2FudmFzKFwiZmxvdC1iYXNlXCIsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgIG92ZXJsYXkgPSBuZXcgQ2FudmFzKFwiZmxvdC1vdmVybGF5XCIsIHBsYWNlaG9sZGVyKTsgLy8gb3ZlcmxheSBjYW52YXMgZm9yIGludGVyYWN0aXZlIGZlYXR1cmVzXG5cbiAgICAgICAgICAgIGN0eCA9IHN1cmZhY2UuY29udGV4dDtcbiAgICAgICAgICAgIG9jdHggPSBvdmVybGF5LmNvbnRleHQ7XG5cbiAgICAgICAgICAgIC8vIGRlZmluZSB3aGljaCBlbGVtZW50IHdlJ3JlIGxpc3RlbmluZyBmb3IgZXZlbnRzIG9uXG4gICAgICAgICAgICBldmVudEhvbGRlciA9ICQob3ZlcmxheS5lbGVtZW50KS51bmJpbmQoKTtcblxuICAgICAgICAgICAgLy8gSWYgd2UncmUgcmUtdXNpbmcgYSBwbG90IG9iamVjdCwgc2h1dCBkb3duIHRoZSBvbGQgb25lXG5cbiAgICAgICAgICAgIHZhciBleGlzdGluZyA9IHBsYWNlaG9sZGVyLmRhdGEoXCJwbG90XCIpO1xuXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgICAgICBleGlzdGluZy5zaHV0ZG93bigpO1xuICAgICAgICAgICAgICAgIG92ZXJsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2F2ZSBpbiBjYXNlIHdlIGdldCByZXBsb3R0ZWRcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLmRhdGEoXCJwbG90XCIsIHBsb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYmluZEV2ZW50cygpIHtcbiAgICAgICAgICAgIC8vIGJpbmQgZXZlbnRzXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmhvdmVyYWJsZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50SG9sZGVyLm1vdXNlbW92ZShvbk1vdXNlTW92ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBVc2UgYmluZCwgcmF0aGVyIHRoYW4gLm1vdXNlbGVhdmUsIGJlY2F1c2Ugd2Ugb2ZmaWNpYWxseVxuICAgICAgICAgICAgICAgIC8vIHN0aWxsIHN1cHBvcnQgalF1ZXJ5IDEuMi42LCB3aGljaCBkb2Vzbid0IGRlZmluZSBhIHNob3J0Y3V0XG4gICAgICAgICAgICAgICAgLy8gZm9yIG1vdXNlZW50ZXIgb3IgbW91c2VsZWF2ZS4gIFRoaXMgd2FzIGEgYnVnL292ZXJzaWdodCB0aGF0XG4gICAgICAgICAgICAgICAgLy8gd2FzIGZpeGVkIHNvbWV3aGVyZSBhcm91bmQgMS4zLnguICBXZSBjYW4gcmV0dXJuIHRvIHVzaW5nXG4gICAgICAgICAgICAgICAgLy8gLm1vdXNlbGVhdmUgd2hlbiB3ZSBkcm9wIHN1cHBvcnQgZm9yIDEuMi42LlxuXG4gICAgICAgICAgICAgICAgZXZlbnRIb2xkZXIuYmluZChcIm1vdXNlbGVhdmVcIiwgb25Nb3VzZUxlYXZlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5jbGlja2FibGUpXG4gICAgICAgICAgICAgICAgZXZlbnRIb2xkZXIuY2xpY2sob25DbGljayk7XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5iaW5kRXZlbnRzLCBbZXZlbnRIb2xkZXJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNodXRkb3duKCkge1xuICAgICAgICAgICAgaWYgKHJlZHJhd1RpbWVvdXQpXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlZHJhd1RpbWVvdXQpO1xuXG4gICAgICAgICAgICBldmVudEhvbGRlci51bmJpbmQoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xuICAgICAgICAgICAgZXZlbnRIb2xkZXIudW5iaW5kKFwibW91c2VsZWF2ZVwiLCBvbk1vdXNlTGVhdmUpO1xuICAgICAgICAgICAgZXZlbnRIb2xkZXIudW5iaW5kKFwiY2xpY2tcIiwgb25DbGljayk7XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5zaHV0ZG93biwgW2V2ZW50SG9sZGVyXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRUcmFuc2Zvcm1hdGlvbkhlbHBlcnMoYXhpcykge1xuICAgICAgICAgICAgLy8gc2V0IGhlbHBlciBmdW5jdGlvbnMgb24gdGhlIGF4aXMsIGFzc3VtZXMgcGxvdCBhcmVhXG4gICAgICAgICAgICAvLyBoYXMgYmVlbiBjb21wdXRlZCBhbHJlYWR5XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGlkZW50aXR5KHgpIHsgcmV0dXJuIHg7IH1cblxuICAgICAgICAgICAgdmFyIHMsIG0sIHQgPSBheGlzLm9wdGlvbnMudHJhbnNmb3JtIHx8IGlkZW50aXR5LFxuICAgICAgICAgICAgICAgIGl0ID0gYXhpcy5vcHRpb25zLmludmVyc2VUcmFuc2Zvcm07XG5cbiAgICAgICAgICAgIC8vIHByZWNvbXB1dGUgaG93IG11Y2ggdGhlIGF4aXMgaXMgc2NhbGluZyBhIHBvaW50XG4gICAgICAgICAgICAvLyBpbiBjYW52YXMgc3BhY2VcbiAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIikge1xuICAgICAgICAgICAgICAgIHMgPSBheGlzLnNjYWxlID0gcGxvdFdpZHRoIC8gTWF0aC5hYnModChheGlzLm1heCkgLSB0KGF4aXMubWluKSk7XG4gICAgICAgICAgICAgICAgbSA9IE1hdGgubWluKHQoYXhpcy5tYXgpLCB0KGF4aXMubWluKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzID0gYXhpcy5zY2FsZSA9IHBsb3RIZWlnaHQgLyBNYXRoLmFicyh0KGF4aXMubWF4KSAtIHQoYXhpcy5taW4pKTtcbiAgICAgICAgICAgICAgICBzID0gLXM7XG4gICAgICAgICAgICAgICAgbSA9IE1hdGgubWF4KHQoYXhpcy5tYXgpLCB0KGF4aXMubWluKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRhdGEgcG9pbnQgdG8gY2FudmFzIGNvb3JkaW5hdGVcbiAgICAgICAgICAgIGlmICh0ID09IGlkZW50aXR5KSAvLyBzbGlnaHQgb3B0aW1pemF0aW9uXG4gICAgICAgICAgICAgICAgYXhpcy5wMmMgPSBmdW5jdGlvbiAocCkgeyByZXR1cm4gKHAgLSBtKSAqIHM7IH07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXhpcy5wMmMgPSBmdW5jdGlvbiAocCkgeyByZXR1cm4gKHQocCkgLSBtKSAqIHM7IH07XG4gICAgICAgICAgICAvLyBjYW52YXMgY29vcmRpbmF0ZSB0byBkYXRhIHBvaW50XG4gICAgICAgICAgICBpZiAoIWl0KVxuICAgICAgICAgICAgICAgIGF4aXMuYzJwID0gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIG0gKyBjIC8gczsgfTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBheGlzLmMycCA9IGZ1bmN0aW9uIChjKSB7IHJldHVybiBpdChtICsgYyAvIHMpOyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbWVhc3VyZVRpY2tMYWJlbHMoYXhpcykge1xuXG4gICAgICAgICAgICB2YXIgb3B0cyA9IGF4aXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0aWNrcyA9IGF4aXMudGlja3MgfHwgW10sXG4gICAgICAgICAgICAgICAgbGFiZWxXaWR0aCA9IG9wdHMubGFiZWxXaWR0aCB8fCAwLFxuICAgICAgICAgICAgICAgIGxhYmVsSGVpZ2h0ID0gb3B0cy5sYWJlbEhlaWdodCB8fCAwLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoID0gbGFiZWxXaWR0aCB8fCAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIgPyBNYXRoLmZsb29yKHN1cmZhY2Uud2lkdGggLyAodGlja3MubGVuZ3RoIHx8IDEpKSA6IG51bGwpLFxuICAgICAgICAgICAgICAgIGxlZ2FjeVN0eWxlcyA9IGF4aXMuZGlyZWN0aW9uICsgXCJBeGlzIFwiICsgYXhpcy5kaXJlY3Rpb24gKyBheGlzLm4gKyBcIkF4aXNcIixcbiAgICAgICAgICAgICAgICBsYXllciA9IFwiZmxvdC1cIiArIGF4aXMuZGlyZWN0aW9uICsgXCItYXhpcyBmbG90LVwiICsgYXhpcy5kaXJlY3Rpb24gKyBheGlzLm4gKyBcIi1heGlzIFwiICsgbGVnYWN5U3R5bGVzLFxuICAgICAgICAgICAgICAgIGZvbnQgPSBvcHRzLmZvbnQgfHwgXCJmbG90LXRpY2stbGFiZWwgdGlja0xhYmVsXCI7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGlja3MubGVuZ3RoOyArK2kpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0ID0gdGlja3NbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIXQubGFiZWwpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgdmFyIGluZm8gPSBzdXJmYWNlLmdldFRleHRJbmZvKGxheWVyLCB0LmxhYmVsLCBmb250LCBudWxsLCBtYXhXaWR0aCk7XG5cbiAgICAgICAgICAgICAgICBsYWJlbFdpZHRoID0gTWF0aC5tYXgobGFiZWxXaWR0aCwgaW5mby53aWR0aCk7XG4gICAgICAgICAgICAgICAgbGFiZWxIZWlnaHQgPSBNYXRoLm1heChsYWJlbEhlaWdodCwgaW5mby5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBheGlzLmxhYmVsV2lkdGggPSBvcHRzLmxhYmVsV2lkdGggfHwgbGFiZWxXaWR0aDtcbiAgICAgICAgICAgIGF4aXMubGFiZWxIZWlnaHQgPSBvcHRzLmxhYmVsSGVpZ2h0IHx8IGxhYmVsSGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWxsb2NhdGVBeGlzQm94Rmlyc3RQaGFzZShheGlzKSB7XG4gICAgICAgICAgICAvLyBmaW5kIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGF4aXMgYnkgbG9va2luZyBhdCBsYWJlbFxuICAgICAgICAgICAgLy8gd2lkdGhzL2hlaWdodHMgYW5kIHRpY2tzLCBtYWtlIHJvb20gYnkgZGltaW5pc2hpbmcgdGhlXG4gICAgICAgICAgICAvLyBwbG90T2Zmc2V0OyB0aGlzIGZpcnN0IHBoYXNlIG9ubHkgbG9va3MgYXQgb25lXG4gICAgICAgICAgICAvLyBkaW1lbnNpb24gcGVyIGF4aXMsIHRoZSBvdGhlciBkaW1lbnNpb24gZGVwZW5kcyBvbiB0aGVcbiAgICAgICAgICAgIC8vIG90aGVyIGF4ZXMgc28gd2lsbCBoYXZlIHRvIHdhaXRcblxuICAgICAgICAgICAgdmFyIGx3ID0gYXhpcy5sYWJlbFdpZHRoLFxuICAgICAgICAgICAgICAgIGxoID0gYXhpcy5sYWJlbEhlaWdodCxcbiAgICAgICAgICAgICAgICBwb3MgPSBheGlzLm9wdGlvbnMucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgaXNYQXhpcyA9IGF4aXMuZGlyZWN0aW9uID09PSBcInhcIixcbiAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoID0gYXhpcy5vcHRpb25zLnRpY2tMZW5ndGgsXG4gICAgICAgICAgICAgICAgYXhpc01hcmdpbiA9IG9wdGlvbnMuZ3JpZC5heGlzTWFyZ2luLFxuICAgICAgICAgICAgICAgIHBhZGRpbmcgPSBvcHRpb25zLmdyaWQubGFiZWxNYXJnaW4sXG4gICAgICAgICAgICAgICAgaW5uZXJtb3N0ID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICBvdXRlcm1vc3QgPSB0cnVlLFxuICAgICAgICAgICAgICAgIGZpcnN0ID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIGF4aXMncyBwb3NpdGlvbiBpbiBpdHMgZGlyZWN0aW9uIGFuZCBvbiBpdHMgc2lkZVxuXG4gICAgICAgICAgICAkLmVhY2goaXNYQXhpcyA/IHhheGVzIDogeWF4ZXMsIGZ1bmN0aW9uKGksIGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYSAmJiAoYS5zaG93IHx8IGEucmVzZXJ2ZVNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA9PT0gYXhpcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGEub3B0aW9ucy5wb3NpdGlvbiA9PT0gcG9zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRlcm1vc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJtb3N0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBUaGUgb3V0ZXJtb3N0IGF4aXMgb24gZWFjaCBzaWRlIGhhcyBubyBtYXJnaW5cblxuICAgICAgICAgICAgaWYgKG91dGVybW9zdCkge1xuICAgICAgICAgICAgICAgIGF4aXNNYXJnaW4gPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgdGlja3MgZm9yIHRoZSBmaXJzdCBheGlzIGluIGVhY2ggZGlyZWN0aW9uIHN0cmV0Y2ggYWNyb3NzXG5cbiAgICAgICAgICAgIGlmICh0aWNrTGVuZ3RoID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aWNrTGVuZ3RoID0gZmlyc3QgPyBcImZ1bGxcIiA6IDU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNOYU4oK3RpY2tMZW5ndGgpKVxuICAgICAgICAgICAgICAgIHBhZGRpbmcgKz0gK3RpY2tMZW5ndGg7XG5cbiAgICAgICAgICAgIGlmIChpc1hBeGlzKSB7XG4gICAgICAgICAgICAgICAgbGggKz0gcGFkZGluZztcblxuICAgICAgICAgICAgICAgIGlmIChwb3MgPT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgICAgICBwbG90T2Zmc2V0LmJvdHRvbSArPSBsaCArIGF4aXNNYXJnaW47XG4gICAgICAgICAgICAgICAgICAgIGF4aXMuYm94ID0geyB0b3A6IHN1cmZhY2UuaGVpZ2h0IC0gcGxvdE9mZnNldC5ib3R0b20sIGhlaWdodDogbGggfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXMuYm94ID0geyB0b3A6IHBsb3RPZmZzZXQudG9wICsgYXhpc01hcmdpbiwgaGVpZ2h0OiBsaCB9O1xuICAgICAgICAgICAgICAgICAgICBwbG90T2Zmc2V0LnRvcCArPSBsaCArIGF4aXNNYXJnaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbHcgKz0gcGFkZGluZztcblxuICAgICAgICAgICAgICAgIGlmIChwb3MgPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5ib3ggPSB7IGxlZnQ6IHBsb3RPZmZzZXQubGVmdCArIGF4aXNNYXJnaW4sIHdpZHRoOiBsdyB9O1xuICAgICAgICAgICAgICAgICAgICBwbG90T2Zmc2V0LmxlZnQgKz0gbHcgKyBheGlzTWFyZ2luO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9mZnNldC5yaWdodCArPSBsdyArIGF4aXNNYXJnaW47XG4gICAgICAgICAgICAgICAgICAgIGF4aXMuYm94ID0geyBsZWZ0OiBzdXJmYWNlLndpZHRoIC0gcGxvdE9mZnNldC5yaWdodCwgd2lkdGg6IGx3IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgLy8gc2F2ZSBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgYXhpcy5wb3NpdGlvbiA9IHBvcztcbiAgICAgICAgICAgIGF4aXMudGlja0xlbmd0aCA9IHRpY2tMZW5ndGg7XG4gICAgICAgICAgICBheGlzLmJveC5wYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgICAgIGF4aXMuaW5uZXJtb3N0ID0gaW5uZXJtb3N0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWxsb2NhdGVBeGlzQm94U2Vjb25kUGhhc2UoYXhpcykge1xuICAgICAgICAgICAgLy8gbm93IHRoYXQgYWxsIGF4aXMgYm94ZXMgaGF2ZSBiZWVuIHBsYWNlZCBpbiBvbmVcbiAgICAgICAgICAgIC8vIGRpbWVuc2lvbiwgd2UgY2FuIHNldCB0aGUgcmVtYWluaW5nIGRpbWVuc2lvbiBjb29yZGluYXRlc1xuICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgYXhpcy5ib3gubGVmdCA9IHBsb3RPZmZzZXQubGVmdCAtIGF4aXMubGFiZWxXaWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgYXhpcy5ib3gud2lkdGggPSBzdXJmYWNlLndpZHRoIC0gcGxvdE9mZnNldC5sZWZ0IC0gcGxvdE9mZnNldC5yaWdodCArIGF4aXMubGFiZWxXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGF4aXMuYm94LnRvcCA9IHBsb3RPZmZzZXQudG9wIC0gYXhpcy5sYWJlbEhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgYXhpcy5ib3guaGVpZ2h0ID0gc3VyZmFjZS5oZWlnaHQgLSBwbG90T2Zmc2V0LmJvdHRvbSAtIHBsb3RPZmZzZXQudG9wICsgYXhpcy5sYWJlbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkanVzdExheW91dEZvclRoaW5nc1N0aWNraW5nT3V0KCkge1xuICAgICAgICAgICAgLy8gcG9zc2libHkgYWRqdXN0IHBsb3Qgb2Zmc2V0IHRvIGVuc3VyZSBldmVyeXRoaW5nIHN0YXlzXG4gICAgICAgICAgICAvLyBpbnNpZGUgdGhlIGNhbnZhcyBhbmQgaXNuJ3QgY2xpcHBlZCBvZmZcblxuICAgICAgICAgICAgdmFyIG1pbk1hcmdpbiA9IG9wdGlvbnMuZ3JpZC5taW5Cb3JkZXJNYXJnaW4sXG4gICAgICAgICAgICAgICAgYXhpcywgaTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgc3R1ZmYgZnJvbSB0aGUgcGxvdCAoRklYTUU6IHRoaXMgc2hvdWxkIGp1c3QgcmVhZFxuICAgICAgICAgICAgLy8gYSB2YWx1ZSBmcm9tIHRoZSBzZXJpZXMsIG90aGVyd2lzZSBpdCdzIGltcG9zc2libGUgdG9cbiAgICAgICAgICAgIC8vIGN1c3RvbWl6ZSlcbiAgICAgICAgICAgIGlmIChtaW5NYXJnaW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG1pbk1hcmdpbiA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICAgICAgbWluTWFyZ2luID0gTWF0aC5tYXgobWluTWFyZ2luLCAyICogKHNlcmllc1tpXS5wb2ludHMucmFkaXVzICsgc2VyaWVzW2ldLnBvaW50cy5saW5lV2lkdGgvMikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWFyZ2lucyA9IHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBtaW5NYXJnaW4sXG4gICAgICAgICAgICAgICAgcmlnaHQ6IG1pbk1hcmdpbixcbiAgICAgICAgICAgICAgICB0b3A6IG1pbk1hcmdpbixcbiAgICAgICAgICAgICAgICBib3R0b206IG1pbk1hcmdpblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYXhpcyBsYWJlbHMsIG5vdGUgd2UgZG9uJ3QgY2hlY2sgdGhlIGFjdHVhbFxuICAgICAgICAgICAgLy8gbGFiZWxzIGJ1dCBpbnN0ZWFkIHVzZSB0aGUgb3ZlcmFsbCB3aWR0aC9oZWlnaHQgdG8gbm90XG4gICAgICAgICAgICAvLyBqdW1wIGFzIG11Y2ggYXJvdW5kIHdpdGggcmVwbG90c1xuICAgICAgICAgICAgJC5lYWNoKGFsbEF4ZXMoKSwgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5yZXNlcnZlU3BhY2UgJiYgYXhpcy50aWNrcyAmJiBheGlzLnRpY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5zLmxlZnQgPSBNYXRoLm1heChtYXJnaW5zLmxlZnQsIGF4aXMubGFiZWxXaWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2lucy5yaWdodCA9IE1hdGgubWF4KG1hcmdpbnMucmlnaHQsIGF4aXMubGFiZWxXaWR0aCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2lucy5ib3R0b20gPSBNYXRoLm1heChtYXJnaW5zLmJvdHRvbSwgYXhpcy5sYWJlbEhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2lucy50b3AgPSBNYXRoLm1heChtYXJnaW5zLnRvcCwgYXhpcy5sYWJlbEhlaWdodCAvIDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHBsb3RPZmZzZXQubGVmdCA9IE1hdGguY2VpbChNYXRoLm1heChtYXJnaW5zLmxlZnQsIHBsb3RPZmZzZXQubGVmdCkpO1xuICAgICAgICAgICAgcGxvdE9mZnNldC5yaWdodCA9IE1hdGguY2VpbChNYXRoLm1heChtYXJnaW5zLnJpZ2h0LCBwbG90T2Zmc2V0LnJpZ2h0KSk7XG4gICAgICAgICAgICBwbG90T2Zmc2V0LnRvcCA9IE1hdGguY2VpbChNYXRoLm1heChtYXJnaW5zLnRvcCwgcGxvdE9mZnNldC50b3ApKTtcbiAgICAgICAgICAgIHBsb3RPZmZzZXQuYm90dG9tID0gTWF0aC5jZWlsKE1hdGgubWF4KG1hcmdpbnMuYm90dG9tLCBwbG90T2Zmc2V0LmJvdHRvbSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBHcmlkKCkge1xuICAgICAgICAgICAgdmFyIGksIGF4ZXMgPSBhbGxBeGVzKCksIHNob3dHcmlkID0gb3B0aW9ucy5ncmlkLnNob3c7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgdGhlIHBsb3QncyBvZmZzZXQgZnJvbSB0aGUgZWRnZSBvZiB0aGUgY2FudmFzXG5cbiAgICAgICAgICAgIGZvciAodmFyIGEgaW4gcGxvdE9mZnNldCkge1xuICAgICAgICAgICAgICAgIHZhciBtYXJnaW4gPSBvcHRpb25zLmdyaWQubWFyZ2luIHx8IDA7XG4gICAgICAgICAgICAgICAgcGxvdE9mZnNldFthXSA9IHR5cGVvZiBtYXJnaW4gPT0gXCJudW1iZXJcIiA/IG1hcmdpbiA6IG1hcmdpblthXSB8fCAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MucHJvY2Vzc09mZnNldCwgW3Bsb3RPZmZzZXRdKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGdyaWQgaXMgdmlzaWJsZSwgYWRkIGl0cyBib3JkZXIgd2lkdGggdG8gdGhlIG9mZnNldFxuXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIHBsb3RPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Yob3B0aW9ucy5ncmlkLmJvcmRlcldpZHRoKSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsb3RPZmZzZXRbYV0gKz0gc2hvd0dyaWQgPyBvcHRpb25zLmdyaWQuYm9yZGVyV2lkdGhbYV0gOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9mZnNldFthXSArPSBzaG93R3JpZCA/IG9wdGlvbnMuZ3JpZC5ib3JkZXJXaWR0aCA6IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2goYXhlcywgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXhpc09wdHMgPSBheGlzLm9wdGlvbnM7XG4gICAgICAgICAgICAgICAgYXhpcy5zaG93ID0gYXhpc09wdHMuc2hvdyA9PSBudWxsID8gYXhpcy51c2VkIDogYXhpc09wdHMuc2hvdztcbiAgICAgICAgICAgICAgICBheGlzLnJlc2VydmVTcGFjZSA9IGF4aXNPcHRzLnJlc2VydmVTcGFjZSA9PSBudWxsID8gYXhpcy5zaG93IDogYXhpc09wdHMucmVzZXJ2ZVNwYWNlO1xuICAgICAgICAgICAgICAgIHNldFJhbmdlKGF4aXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzaG93R3JpZCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGFsbG9jYXRlZEF4ZXMgPSAkLmdyZXAoYXhlcywgZnVuY3Rpb24gKGF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF4aXMuc2hvdyB8fCBheGlzLnJlc2VydmVTcGFjZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQuZWFjaChhbGxvY2F0ZWRBeGVzLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSB0aWNrc1xuICAgICAgICAgICAgICAgICAgICBzZXR1cFRpY2tHZW5lcmF0aW9uKGF4aXMpO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaWNrcyhheGlzKTtcbiAgICAgICAgICAgICAgICAgICAgc25hcFJhbmdlVG9UaWNrcyhheGlzLCBheGlzLnRpY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluZCBsYWJlbFdpZHRoL0hlaWdodCBmb3IgYXhpc1xuICAgICAgICAgICAgICAgICAgICBtZWFzdXJlVGlja0xhYmVscyhheGlzKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIHdpdGggYWxsIGRpbWVuc2lvbnMgY2FsY3VsYXRlZCwgd2UgY2FuIGNvbXB1dGUgdGhlXG4gICAgICAgICAgICAgICAgLy8gYXhpcyBib3VuZGluZyBib3hlcywgc3RhcnQgZnJvbSB0aGUgb3V0c2lkZVxuICAgICAgICAgICAgICAgIC8vIChyZXZlcnNlIG9yZGVyKVxuICAgICAgICAgICAgICAgIGZvciAoaSA9IGFsbG9jYXRlZEF4ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpXG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlQXhpc0JveEZpcnN0UGhhc2UoYWxsb2NhdGVkQXhlc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UndmUgZ290IGVub3VnaCBzcGFjZSBmb3IgdGhpbmdzIHRoYXRcbiAgICAgICAgICAgICAgICAvLyBtaWdodCBzdGljayBvdXRcbiAgICAgICAgICAgICAgICBhZGp1c3RMYXlvdXRGb3JUaGluZ3NTdGlja2luZ091dCgpO1xuXG4gICAgICAgICAgICAgICAgJC5lYWNoKGFsbG9jYXRlZEF4ZXMsIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbG9jYXRlQXhpc0JveFNlY29uZFBoYXNlKGF4aXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwbG90V2lkdGggPSBzdXJmYWNlLndpZHRoIC0gcGxvdE9mZnNldC5sZWZ0IC0gcGxvdE9mZnNldC5yaWdodDtcbiAgICAgICAgICAgIHBsb3RIZWlnaHQgPSBzdXJmYWNlLmhlaWdodCAtIHBsb3RPZmZzZXQuYm90dG9tIC0gcGxvdE9mZnNldC50b3A7XG5cbiAgICAgICAgICAgIC8vIG5vdyB3ZSBnb3QgdGhlIHByb3BlciBwbG90IGRpbWVuc2lvbnMsIHdlIGNhbiBjb21wdXRlIHRoZSBzY2FsaW5nXG4gICAgICAgICAgICAkLmVhY2goYXhlcywgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICBzZXRUcmFuc2Zvcm1hdGlvbkhlbHBlcnMoYXhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNob3dHcmlkKSB7XG4gICAgICAgICAgICAgICAgZHJhd0F4aXNMYWJlbHMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaW5zZXJ0TGVnZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSYW5nZShheGlzKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IGF4aXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBtaW4gPSArKG9wdHMubWluICE9IG51bGwgPyBvcHRzLm1pbiA6IGF4aXMuZGF0YW1pbiksXG4gICAgICAgICAgICAgICAgbWF4ID0gKyhvcHRzLm1heCAhPSBudWxsID8gb3B0cy5tYXggOiBheGlzLmRhdGFtYXgpLFxuICAgICAgICAgICAgICAgIGRlbHRhID0gbWF4IC0gbWluO1xuXG4gICAgICAgICAgICBpZiAoZGVsdGEgPT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgLy8gZGVnZW5lcmF0ZSBjYXNlXG4gICAgICAgICAgICAgICAgdmFyIHdpZGVuID0gbWF4ID09IDAgPyAxIDogMC4wMTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLm1pbiA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBtaW4gLT0gd2lkZW47XG4gICAgICAgICAgICAgICAgLy8gYWx3YXlzIHdpZGVuIG1heCBpZiB3ZSBjb3VsZG4ndCB3aWRlbiBtaW4gdG8gZW5zdXJlIHdlXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgZmFsbCBpbnRvIG1pbiA9PSBtYXggd2hpY2ggZG9lc24ndCB3b3JrXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMubWF4ID09IG51bGwgfHwgb3B0cy5taW4gIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgbWF4ICs9IHdpZGVuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc2lkZXIgYXV0b3NjYWxpbmdcbiAgICAgICAgICAgICAgICB2YXIgbWFyZ2luID0gb3B0cy5hdXRvc2NhbGVNYXJnaW47XG4gICAgICAgICAgICAgICAgaWYgKG1hcmdpbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1pbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW4gLT0gZGVsdGEgKiBtYXJnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgZ28gYmVsb3cgemVybyBpZiBhbGwgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhcmUgcG9zaXRpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtaW4gPCAwICYmIGF4aXMuZGF0YW1pbiAhPSBudWxsICYmIGF4aXMuZGF0YW1pbiA+PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubWF4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heCArPSBkZWx0YSAqIG1hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXggPiAwICYmIGF4aXMuZGF0YW1heCAhPSBudWxsICYmIGF4aXMuZGF0YW1heCA8PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBheGlzLm1pbiA9IG1pbjtcbiAgICAgICAgICAgIGF4aXMubWF4ID0gbWF4O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBUaWNrR2VuZXJhdGlvbihheGlzKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IGF4aXMub3B0aW9ucztcblxuICAgICAgICAgICAgLy8gZXN0aW1hdGUgbnVtYmVyIG9mIHRpY2tzXG4gICAgICAgICAgICB2YXIgbm9UaWNrcztcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50aWNrcyA9PSBcIm51bWJlclwiICYmIG9wdHMudGlja3MgPiAwKVxuICAgICAgICAgICAgICAgIG5vVGlja3MgPSBvcHRzLnRpY2tzO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIC8vIGhldXJpc3RpYyBiYXNlZCBvbiB0aGUgbW9kZWwgYSpzcXJ0KHgpIGZpdHRlZCB0b1xuICAgICAgICAgICAgICAgIC8vIHNvbWUgZGF0YSBwb2ludHMgdGhhdCBzZWVtZWQgcmVhc29uYWJsZVxuICAgICAgICAgICAgICAgIG5vVGlja3MgPSAwLjMgKiBNYXRoLnNxcnQoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIgPyBzdXJmYWNlLndpZHRoIDogc3VyZmFjZS5oZWlnaHQpO1xuXG4gICAgICAgICAgICB2YXIgZGVsdGEgPSAoYXhpcy5tYXggLSBheGlzLm1pbikgLyBub1RpY2tzLFxuICAgICAgICAgICAgICAgIGRlYyA9IC1NYXRoLmZsb29yKE1hdGgubG9nKGRlbHRhKSAvIE1hdGguTE4xMCksXG4gICAgICAgICAgICAgICAgbWF4RGVjID0gb3B0cy50aWNrRGVjaW1hbHM7XG5cbiAgICAgICAgICAgIGlmIChtYXhEZWMgIT0gbnVsbCAmJiBkZWMgPiBtYXhEZWMpIHtcbiAgICAgICAgICAgICAgICBkZWMgPSBtYXhEZWM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtYWduID0gTWF0aC5wb3coMTAsIC1kZWMpLFxuICAgICAgICAgICAgICAgIG5vcm0gPSBkZWx0YSAvIG1hZ24sIC8vIG5vcm0gaXMgYmV0d2VlbiAxLjAgYW5kIDEwLjBcbiAgICAgICAgICAgICAgICBzaXplO1xuXG4gICAgICAgICAgICBpZiAobm9ybSA8IDEuNSkge1xuICAgICAgICAgICAgICAgIHNpemUgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChub3JtIDwgMykge1xuICAgICAgICAgICAgICAgIHNpemUgPSAyO1xuICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgMi41LCByZXF1aXJlcyBhbiBleHRyYSBkZWNpbWFsXG4gICAgICAgICAgICAgICAgaWYgKG5vcm0gPiAyLjI1ICYmIChtYXhEZWMgPT0gbnVsbCB8fCBkZWMgKyAxIDw9IG1heERlYykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2l6ZSA9IDIuNTtcbiAgICAgICAgICAgICAgICAgICAgKytkZWM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChub3JtIDwgNy41KSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IDU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpemUgPSAxMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2l6ZSAqPSBtYWduO1xuXG4gICAgICAgICAgICBpZiAob3B0cy5taW5UaWNrU2l6ZSAhPSBudWxsICYmIHNpemUgPCBvcHRzLm1pblRpY2tTaXplKSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IG9wdHMubWluVGlja1NpemU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXMuZGVsdGEgPSBkZWx0YTtcbiAgICAgICAgICAgIGF4aXMudGlja0RlY2ltYWxzID0gTWF0aC5tYXgoMCwgbWF4RGVjICE9IG51bGwgPyBtYXhEZWMgOiBkZWMpO1xuICAgICAgICAgICAgYXhpcy50aWNrU2l6ZSA9IG9wdHMudGlja1NpemUgfHwgc2l6ZTtcblxuICAgICAgICAgICAgLy8gVGltZSBtb2RlIHdhcyBtb3ZlZCB0byBhIHBsdWctaW4gaW4gMC44LCBhbmQgc2luY2Ugc28gbWFueSBwZW9wbGUgdXNlIGl0XG4gICAgICAgICAgICAvLyB3ZSdsbCBhZGQgYW4gZXNwZWNpYWxseSBmcmllbmRseSByZW1pbmRlciB0byBtYWtlIHN1cmUgdGhleSBpbmNsdWRlZCBpdC5cblxuICAgICAgICAgICAgaWYgKG9wdHMubW9kZSA9PSBcInRpbWVcIiAmJiAhYXhpcy50aWNrR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGltZSBtb2RlIHJlcXVpcmVzIHRoZSBmbG90LnRpbWUgcGx1Z2luLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmxvdCBzdXBwb3J0cyBiYXNlLTEwIGF4ZXM7IGFueSBvdGhlciBtb2RlIGVsc2UgaXMgaGFuZGxlZCBieSBhIHBsdWctaW4sXG4gICAgICAgICAgICAvLyBsaWtlIGZsb3QudGltZS5qcy5cblxuICAgICAgICAgICAgaWYgKCFheGlzLnRpY2tHZW5lcmF0b3IpIHtcblxuICAgICAgICAgICAgICAgIGF4aXMudGlja0dlbmVyYXRvciA9IGZ1bmN0aW9uIChheGlzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpY2tzID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGZsb29ySW5CYXNlKGF4aXMubWluLCBheGlzLnRpY2tTaXplKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IE51bWJlci5OYU4sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2O1xuXG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYgPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0YXJ0ICsgaSAqIGF4aXMudGlja1NpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrcy5wdXNoKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKytpO1xuICAgICAgICAgICAgICAgICAgICB9IHdoaWxlICh2IDwgYXhpcy5tYXggJiYgdiAhPSBwcmV2KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tzO1xuICAgICAgICAgICAgICAgIH07XG5cblx0XHRcdFx0YXhpcy50aWNrRm9ybWF0dGVyID0gZnVuY3Rpb24gKHZhbHVlLCBheGlzKSB7XG5cblx0XHRcdFx0XHR2YXIgZmFjdG9yID0gYXhpcy50aWNrRGVjaW1hbHMgPyBNYXRoLnBvdygxMCwgYXhpcy50aWNrRGVjaW1hbHMpIDogMTtcblx0XHRcdFx0XHR2YXIgZm9ybWF0dGVkID0gXCJcIiArIE1hdGgucm91bmQodmFsdWUgKiBmYWN0b3IpIC8gZmFjdG9yO1xuXG5cdFx0XHRcdFx0Ly8gSWYgdGlja0RlY2ltYWxzIHdhcyBzcGVjaWZpZWQsIGVuc3VyZSB0aGF0IHdlIGhhdmUgZXhhY3RseSB0aGF0XG5cdFx0XHRcdFx0Ly8gbXVjaCBwcmVjaXNpb247IG90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSB2YWx1ZSdzIG93biBwcmVjaXNpb24uXG5cblx0XHRcdFx0XHRpZiAoYXhpcy50aWNrRGVjaW1hbHMgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0dmFyIGRlY2ltYWwgPSBmb3JtYXR0ZWQuaW5kZXhPZihcIi5cIik7XG5cdFx0XHRcdFx0XHR2YXIgcHJlY2lzaW9uID0gZGVjaW1hbCA9PSAtMSA/IDAgOiBmb3JtYXR0ZWQubGVuZ3RoIC0gZGVjaW1hbCAtIDE7XG5cdFx0XHRcdFx0XHRpZiAocHJlY2lzaW9uIDwgYXhpcy50aWNrRGVjaW1hbHMpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIChwcmVjaXNpb24gPyBmb3JtYXR0ZWQgOiBmb3JtYXR0ZWQgKyBcIi5cIikgKyAoXCJcIiArIGZhY3Rvcikuc3Vic3RyKDEsIGF4aXMudGlja0RlY2ltYWxzIC0gcHJlY2lzaW9uKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdHMudGlja0Zvcm1hdHRlcikpXG4gICAgICAgICAgICAgICAgYXhpcy50aWNrRm9ybWF0dGVyID0gZnVuY3Rpb24gKHYsIGF4aXMpIHsgcmV0dXJuIFwiXCIgKyBvcHRzLnRpY2tGb3JtYXR0ZXIodiwgYXhpcyk7IH07XG5cbiAgICAgICAgICAgIGlmIChvcHRzLmFsaWduVGlja3NXaXRoQXhpcyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIG90aGVyQXhpcyA9IChheGlzLmRpcmVjdGlvbiA9PSBcInhcIiA/IHhheGVzIDogeWF4ZXMpW29wdHMuYWxpZ25UaWNrc1dpdGhBeGlzIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKG90aGVyQXhpcyAmJiBvdGhlckF4aXMudXNlZCAmJiBvdGhlckF4aXMgIT0gYXhpcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zaWRlciBzbmFwcGluZyBtaW4vbWF4IHRvIG91dGVybW9zdCBuaWNlIHRpY2tzXG4gICAgICAgICAgICAgICAgICAgIHZhciBuaWNlVGlja3MgPSBheGlzLnRpY2tHZW5lcmF0b3IoYXhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuaWNlVGlja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubWluID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpcy5taW4gPSBNYXRoLm1pbihheGlzLm1pbiwgbmljZVRpY2tzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1heCA9PSBudWxsICYmIG5pY2VUaWNrcy5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aXMubWF4ID0gTWF0aC5tYXgoYXhpcy5tYXgsIG5pY2VUaWNrc1tuaWNlVGlja3MubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYXhpcy50aWNrR2VuZXJhdG9yID0gZnVuY3Rpb24gKGF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgdGlja3MsIHNjYWxlZCB0byB0aGlzIGF4aXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aWNrcyA9IFtdLCB2LCBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG90aGVyQXhpcy50aWNrcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSAob3RoZXJBeGlzLnRpY2tzW2ldLnYgLSBvdGhlckF4aXMubWluKSAvIChvdGhlckF4aXMubWF4IC0gb3RoZXJBeGlzLm1pbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IGF4aXMubWluICsgdiAqIChheGlzLm1heCAtIGF4aXMubWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrcy5wdXNoKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRpY2tzO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIG1pZ2h0IG5lZWQgYW4gZXh0cmEgZGVjaW1hbCBzaW5jZSBmb3JjZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gdGlja3MgZG9uJ3QgbmVjZXNzYXJpbHkgZml0IG5hdHVyYWxseVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF4aXMubW9kZSAmJiBvcHRzLnRpY2tEZWNpbWFscyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFEZWMgPSBNYXRoLm1heCgwLCAtTWF0aC5mbG9vcihNYXRoLmxvZyhheGlzLmRlbHRhKSAvIE1hdGguTE4xMCkgKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cyA9IGF4aXMudGlja0dlbmVyYXRvcihheGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25seSBwcm9jZWVkIGlmIHRoZSB0aWNrIGludGVydmFsIHJvdW5kZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpdGggYW4gZXh0cmEgZGVjaW1hbCBkb2Vzbid0IGdpdmUgdXMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gemVybyBhdCBlbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHRzLmxlbmd0aCA+IDEgJiYgL1xcLi4qMCQvLnRlc3QoKHRzWzFdIC0gdHNbMF0pLnRvRml4ZWQoZXh0cmFEZWMpKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpcy50aWNrRGVjaW1hbHMgPSBleHRyYURlYztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFRpY2tzKGF4aXMpIHtcbiAgICAgICAgICAgIHZhciBvdGlja3MgPSBheGlzLm9wdGlvbnMudGlja3MsIHRpY2tzID0gW107XG4gICAgICAgICAgICBpZiAob3RpY2tzID09IG51bGwgfHwgKHR5cGVvZiBvdGlja3MgPT0gXCJudW1iZXJcIiAmJiBvdGlja3MgPiAwKSlcbiAgICAgICAgICAgICAgICB0aWNrcyA9IGF4aXMudGlja0dlbmVyYXRvcihheGlzKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG90aWNrcykge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24ob3RpY2tzKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2VuZXJhdGUgdGhlIHRpY2tzXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzID0gb3RpY2tzKGF4aXMpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGlja3MgPSBvdGlja3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNsZWFuIHVwL2xhYmVsaWZ5IHRoZSBzdXBwbGllZCB0aWNrcywgY29weSB0aGVtIG92ZXJcbiAgICAgICAgICAgIHZhciBpLCB2O1xuICAgICAgICAgICAgYXhpcy50aWNrcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRpY2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IHRpY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdCA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHYgPSArdFswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gdFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB2ID0gK3Q7XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gYXhpcy50aWNrRm9ybWF0dGVyKHYsIGF4aXMpO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4odikpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMudGlja3MucHVzaCh7IHY6IHYsIGxhYmVsOiBsYWJlbCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNuYXBSYW5nZVRvVGlja3MoYXhpcywgdGlja3MpIHtcbiAgICAgICAgICAgIGlmIChheGlzLm9wdGlvbnMuYXV0b3NjYWxlTWFyZ2luICYmIHRpY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBzbmFwIHRvIHRpY2tzXG4gICAgICAgICAgICAgICAgaWYgKGF4aXMub3B0aW9ucy5taW4gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5taW4gPSBNYXRoLm1pbihheGlzLm1pbiwgdGlja3NbMF0udik7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMub3B0aW9ucy5tYXggPT0gbnVsbCAmJiB0aWNrcy5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgICAgICBheGlzLm1heCA9IE1hdGgubWF4KGF4aXMubWF4LCB0aWNrc1t0aWNrcy5sZW5ndGggLSAxXS52KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXcoKSB7XG5cbiAgICAgICAgICAgIHN1cmZhY2UuY2xlYXIoKTtcblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLmRyYXdCYWNrZ3JvdW5kLCBbY3R4XSk7XG5cbiAgICAgICAgICAgIHZhciBncmlkID0gb3B0aW9ucy5ncmlkO1xuXG4gICAgICAgICAgICAvLyBkcmF3IGJhY2tncm91bmQsIGlmIGFueVxuICAgICAgICAgICAgaWYgKGdyaWQuc2hvdyAmJiBncmlkLmJhY2tncm91bmRDb2xvcilcbiAgICAgICAgICAgICAgICBkcmF3QmFja2dyb3VuZCgpO1xuXG4gICAgICAgICAgICBpZiAoZ3JpZC5zaG93ICYmICFncmlkLmFib3ZlRGF0YSkge1xuICAgICAgICAgICAgICAgIGRyYXdHcmlkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLmRyYXdTZXJpZXMsIFtjdHgsIHNlcmllc1tpXV0pO1xuICAgICAgICAgICAgICAgIGRyYXdTZXJpZXMoc2VyaWVzW2ldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLmRyYXcsIFtjdHhdKTtcblxuICAgICAgICAgICAgaWYgKGdyaWQuc2hvdyAmJiBncmlkLmFib3ZlRGF0YSkge1xuICAgICAgICAgICAgICAgIGRyYXdHcmlkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1cmZhY2UucmVuZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIEEgZHJhdyBpbXBsaWVzIHRoYXQgZWl0aGVyIHRoZSBheGVzIG9yIGRhdGEgaGF2ZSBjaGFuZ2VkLCBzbyB3ZVxuICAgICAgICAgICAgLy8gc2hvdWxkIHByb2JhYmx5IHVwZGF0ZSB0aGUgb3ZlcmxheSBoaWdobGlnaHRzIGFzIHdlbGwuXG5cbiAgICAgICAgICAgIHRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBleHRyYWN0UmFuZ2UocmFuZ2VzLCBjb29yZCkge1xuICAgICAgICAgICAgdmFyIGF4aXMsIGZyb20sIHRvLCBrZXksIGF4ZXMgPSBhbGxBeGVzKCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXhlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGF4aXMgPSBheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBjb29yZCkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBjb29yZCArIGF4aXMubiArIFwiYXhpc1wiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJhbmdlc1trZXldICYmIGF4aXMubiA9PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gY29vcmQgKyBcImF4aXNcIjsgLy8gc3VwcG9ydCB4MWF4aXMgYXMgeGF4aXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tID0gcmFuZ2VzW2tleV0uZnJvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvID0gcmFuZ2VzW2tleV0udG87XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzLWNvbXBhdCBzdHVmZiAtIHRvIGJlIHJlbW92ZWQgaW4gZnV0dXJlXG4gICAgICAgICAgICBpZiAoIXJhbmdlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgYXhpcyA9IGNvb3JkID09IFwieFwiID8geGF4ZXNbMF0gOiB5YXhlc1swXTtcbiAgICAgICAgICAgICAgICBmcm9tID0gcmFuZ2VzW2Nvb3JkICsgXCIxXCJdO1xuICAgICAgICAgICAgICAgIHRvID0gcmFuZ2VzW2Nvb3JkICsgXCIyXCJdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBhdXRvLXJldmVyc2UgYXMgYW4gYWRkZWQgYm9udXNcbiAgICAgICAgICAgIGlmIChmcm9tICE9IG51bGwgJiYgdG8gIT0gbnVsbCAmJiBmcm9tID4gdG8pIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gZnJvbTtcbiAgICAgICAgICAgICAgICBmcm9tID0gdG87XG4gICAgICAgICAgICAgICAgdG8gPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7IGZyb206IGZyb20sIHRvOiB0bywgYXhpczogYXhpcyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd0JhY2tncm91bmQoKSB7XG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShwbG90T2Zmc2V0LmxlZnQsIHBsb3RPZmZzZXQudG9wKTtcblxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdldENvbG9yT3JHcmFkaWVudChvcHRpb25zLmdyaWQuYmFja2dyb3VuZENvbG9yLCBwbG90SGVpZ2h0LCAwLCBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMClcIik7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgcGxvdFdpZHRoLCBwbG90SGVpZ2h0KTtcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3R3JpZCgpIHtcbiAgICAgICAgICAgIHZhciBpLCBheGVzLCBidywgYmM7XG5cbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHBsb3RPZmZzZXQubGVmdCwgcGxvdE9mZnNldC50b3ApO1xuXG4gICAgICAgICAgICAvLyBkcmF3IG1hcmtpbmdzXG4gICAgICAgICAgICB2YXIgbWFya2luZ3MgPSBvcHRpb25zLmdyaWQubWFya2luZ3M7XG4gICAgICAgICAgICBpZiAobWFya2luZ3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG1hcmtpbmdzKSkge1xuICAgICAgICAgICAgICAgICAgICBheGVzID0gcGxvdC5nZXRBeGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHhtaW4gZXRjLiBpcyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgdG8gYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgICAgICAgICAgICAgIGF4ZXMueG1pbiA9IGF4ZXMueGF4aXMubWluO1xuICAgICAgICAgICAgICAgICAgICBheGVzLnhtYXggPSBheGVzLnhheGlzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgYXhlcy55bWluID0gYXhlcy55YXhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIGF4ZXMueW1heCA9IGF4ZXMueWF4aXMubWF4O1xuXG4gICAgICAgICAgICAgICAgICAgIG1hcmtpbmdzID0gbWFya2luZ3MoYXhlcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1hcmtpbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtID0gbWFya2luZ3NbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB4cmFuZ2UgPSBleHRyYWN0UmFuZ2UobSwgXCJ4XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgeXJhbmdlID0gZXh0cmFjdFJhbmdlKG0sIFwieVwiKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBmaWxsIGluIG1pc3NpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhyYW5nZS5mcm9tID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICB4cmFuZ2UuZnJvbSA9IHhyYW5nZS5heGlzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhyYW5nZS50byA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgeHJhbmdlLnRvID0geHJhbmdlLmF4aXMubWF4O1xuICAgICAgICAgICAgICAgICAgICBpZiAoeXJhbmdlLmZyb20gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHlyYW5nZS5mcm9tID0geXJhbmdlLmF4aXMubWluO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeXJhbmdlLnRvID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICB5cmFuZ2UudG8gPSB5cmFuZ2UuYXhpcy5tYXg7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcFxuICAgICAgICAgICAgICAgICAgICBpZiAoeHJhbmdlLnRvIDwgeHJhbmdlLmF4aXMubWluIHx8IHhyYW5nZS5mcm9tID4geHJhbmdlLmF4aXMubWF4IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB5cmFuZ2UudG8gPCB5cmFuZ2UuYXhpcy5taW4gfHwgeXJhbmdlLmZyb20gPiB5cmFuZ2UuYXhpcy5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICB4cmFuZ2UuZnJvbSA9IE1hdGgubWF4KHhyYW5nZS5mcm9tLCB4cmFuZ2UuYXhpcy5taW4pO1xuICAgICAgICAgICAgICAgICAgICB4cmFuZ2UudG8gPSBNYXRoLm1pbih4cmFuZ2UudG8sIHhyYW5nZS5heGlzLm1heCk7XG4gICAgICAgICAgICAgICAgICAgIHlyYW5nZS5mcm9tID0gTWF0aC5tYXgoeXJhbmdlLmZyb20sIHlyYW5nZS5heGlzLm1pbik7XG4gICAgICAgICAgICAgICAgICAgIHlyYW5nZS50byA9IE1hdGgubWluKHlyYW5nZS50bywgeXJhbmdlLmF4aXMubWF4KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgeGVxdWFsID0geHJhbmdlLmZyb20gPT09IHhyYW5nZS50byxcbiAgICAgICAgICAgICAgICAgICAgICAgIHllcXVhbCA9IHlyYW5nZS5mcm9tID09PSB5cmFuZ2UudG87XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHhlcXVhbCAmJiB5ZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiBkcmF3XG4gICAgICAgICAgICAgICAgICAgIHhyYW5nZS5mcm9tID0gTWF0aC5mbG9vcih4cmFuZ2UuYXhpcy5wMmMoeHJhbmdlLmZyb20pKTtcbiAgICAgICAgICAgICAgICAgICAgeHJhbmdlLnRvID0gTWF0aC5mbG9vcih4cmFuZ2UuYXhpcy5wMmMoeHJhbmdlLnRvKSk7XG4gICAgICAgICAgICAgICAgICAgIHlyYW5nZS5mcm9tID0gTWF0aC5mbG9vcih5cmFuZ2UuYXhpcy5wMmMoeXJhbmdlLmZyb20pKTtcbiAgICAgICAgICAgICAgICAgICAgeXJhbmdlLnRvID0gTWF0aC5mbG9vcih5cmFuZ2UuYXhpcy5wMmMoeXJhbmdlLnRvKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHhlcXVhbCB8fCB5ZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW5lV2lkdGggPSBtLmxpbmVXaWR0aCB8fCBvcHRpb25zLmdyaWQubWFya2luZ3NMaW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViUGl4ZWwgPSBsaW5lV2lkdGggJSAyID8gMC41IDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IG0uY29sb3IgfHwgb3B0aW9ucy5ncmlkLm1hcmtpbmdzQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHhlcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeHJhbmdlLnRvICsgc3ViUGl4ZWwsIHlyYW5nZS5mcm9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHhyYW5nZS50byArIHN1YlBpeGVsLCB5cmFuZ2UudG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHhyYW5nZS5mcm9tLCB5cmFuZ2UudG8gKyBzdWJQaXhlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4cmFuZ2UudG8sIHlyYW5nZS50byArIHN1YlBpeGVsKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gbS5jb2xvciB8fCBvcHRpb25zLmdyaWQubWFya2luZ3NDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4cmFuZ2UuZnJvbSwgeXJhbmdlLnRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhyYW5nZS50byAtIHhyYW5nZS5mcm9tLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlyYW5nZS5mcm9tIC0geXJhbmdlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZHJhdyB0aGUgdGlja3NcbiAgICAgICAgICAgIGF4ZXMgPSBhbGxBeGVzKCk7XG4gICAgICAgICAgICBidyA9IG9wdGlvbnMuZ3JpZC5ib3JkZXJXaWR0aDtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBheGVzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF4aXMgPSBheGVzW2pdLCBib3ggPSBheGlzLmJveCxcbiAgICAgICAgICAgICAgICAgICAgdCA9IGF4aXMudGlja0xlbmd0aCwgeCwgeSwgeG9mZiwgeW9mZjtcbiAgICAgICAgICAgICAgICBpZiAoIWF4aXMuc2hvdyB8fCBheGlzLnRpY2tzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xuXG4gICAgICAgICAgICAgICAgLy8gZmluZCB0aGUgZWRnZXNcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ID09IFwiZnVsbFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IChheGlzLnBvc2l0aW9uID09IFwidG9wXCIgPyAwIDogcGxvdEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBib3gudG9wIC0gcGxvdE9mZnNldC50b3AgKyAoYXhpcy5wb3NpdGlvbiA9PSBcInRvcFwiID8gYm94LmhlaWdodCA6IDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgeSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ID09IFwiZnVsbFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IChheGlzLnBvc2l0aW9uID09IFwibGVmdFwiID8gMCA6IHBsb3RXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBib3gubGVmdCAtIHBsb3RPZmZzZXQubGVmdCArIChheGlzLnBvc2l0aW9uID09IFwibGVmdFwiID8gYm94LndpZHRoIDogMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZHJhdyB0aWNrIGJhclxuICAgICAgICAgICAgICAgIGlmICghYXhpcy5pbm5lcm1vc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYXhpcy5vcHRpb25zLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHhvZmYgPSB5b2ZmID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgeG9mZiA9IHBsb3RXaWR0aCArIDE7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHlvZmYgPSBwbG90SGVpZ2h0ICsgMTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3R4LmxpbmVXaWR0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID0gTWF0aC5mbG9vcih5KSArIDAuNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IE1hdGguZmxvb3IoeCkgKyAwLjU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyB4b2ZmLCB5ICsgeW9mZik7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IHRpY2tzXG5cbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBheGlzLm9wdGlvbnMudGlja0NvbG9yO1xuXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBheGlzLnRpY2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gYXhpcy50aWNrc1tpXS52O1xuXG4gICAgICAgICAgICAgICAgICAgIHhvZmYgPSB5b2ZmID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4odikgfHwgdiA8IGF4aXMubWluIHx8IHYgPiBheGlzLm1heFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2tpcCB0aG9zZSBseWluZyBvbiB0aGUgYXhlcyBpZiB3ZSBnb3QgYSBib3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8ICh0ID09IFwiZnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCh0eXBlb2YgYncgPT0gXCJvYmplY3RcIiAmJiBid1theGlzLnBvc2l0aW9uXSA+IDApIHx8IGJ3ID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAodiA9PSBheGlzLm1pbiB8fCB2ID09IGF4aXMubWF4KSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBheGlzLnAyYyh2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlvZmYgPSB0ID09IFwiZnVsbFwiID8gLXBsb3RIZWlnaHQgOiB0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5wb3NpdGlvbiA9PSBcInRvcFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlvZmYgPSAteW9mZjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBheGlzLnAyYyh2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhvZmYgPSB0ID09IFwiZnVsbFwiID8gLXBsb3RXaWR0aCA6IHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzLnBvc2l0aW9uID09IFwibGVmdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhvZmYgPSAteG9mZjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHgubGluZVdpZHRoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gTWF0aC5mbG9vcih4KSArIDAuNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID0gTWF0aC5mbG9vcih5KSArIDAuNTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHhvZmYsIHkgKyB5b2ZmKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gZHJhdyBib3JkZXJcbiAgICAgICAgICAgIGlmIChidykge1xuICAgICAgICAgICAgICAgIC8vIElmIGVpdGhlciBib3JkZXJXaWR0aCBvciBib3JkZXJDb2xvciBpcyBhbiBvYmplY3QsIHRoZW4gZHJhdyB0aGUgYm9yZGVyXG4gICAgICAgICAgICAgICAgLy8gbGluZSBieSBsaW5lIGluc3RlYWQgb2YgYXMgb25lIHJlY3RhbmdsZVxuICAgICAgICAgICAgICAgIGJjID0gb3B0aW9ucy5ncmlkLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBidyA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBiYyA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYncgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ3ID0ge3RvcDogYncsIHJpZ2h0OiBidywgYm90dG9tOiBidywgbGVmdDogYnd9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYmMgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJjID0ge3RvcDogYmMsIHJpZ2h0OiBiYywgYm90dG9tOiBiYywgbGVmdDogYmN9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ3LnRvcCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGJjLnRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBidy50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKDAgLSBidy5sZWZ0LCAwIC0gYncudG9wLzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhwbG90V2lkdGgsIDAgLSBidy50b3AvMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYncucmlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBiYy5yaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBidy5yaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocGxvdFdpZHRoICsgYncucmlnaHQgLyAyLCAwIC0gYncudG9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocGxvdFdpZHRoICsgYncucmlnaHQgLyAyLCBwbG90SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChidy5ib3R0b20gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBiYy5ib3R0b207XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gYncuYm90dG9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwbG90V2lkdGggKyBidy5yaWdodCwgcGxvdEhlaWdodCArIGJ3LmJvdHRvbSAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbygwLCBwbG90SGVpZ2h0ICsgYncuYm90dG9tIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYncubGVmdCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGJjLmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gYncubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCAtIGJ3LmxlZnQvMiwgcGxvdEhlaWdodCArIGJ3LmJvdHRvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKDAtIGJ3LmxlZnQvMiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBidztcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gb3B0aW9ucy5ncmlkLmJvcmRlckNvbG9yO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCgtYncvMiwgLWJ3LzIsIHBsb3RXaWR0aCArIGJ3LCBwbG90SGVpZ2h0ICsgYncpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdBeGlzTGFiZWxzKCkge1xuXG4gICAgICAgICAgICAkLmVhY2goYWxsQXhlcygpLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIHZhciBib3ggPSBheGlzLmJveCxcbiAgICAgICAgICAgICAgICAgICAgbGVnYWN5U3R5bGVzID0gYXhpcy5kaXJlY3Rpb24gKyBcIkF4aXMgXCIgKyBheGlzLmRpcmVjdGlvbiArIGF4aXMubiArIFwiQXhpc1wiLFxuICAgICAgICAgICAgICAgICAgICBsYXllciA9IFwiZmxvdC1cIiArIGF4aXMuZGlyZWN0aW9uICsgXCItYXhpcyBmbG90LVwiICsgYXhpcy5kaXJlY3Rpb24gKyBheGlzLm4gKyBcIi1heGlzIFwiICsgbGVnYWN5U3R5bGVzLFxuICAgICAgICAgICAgICAgICAgICBmb250ID0gYXhpcy5vcHRpb25zLmZvbnQgfHwgXCJmbG90LXRpY2stbGFiZWwgdGlja0xhYmVsXCIsXG4gICAgICAgICAgICAgICAgICAgIHRpY2ssIHgsIHksIGhhbGlnbiwgdmFsaWduO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRleHQgYmVmb3JlIGNoZWNraW5nIGZvciBheGlzLnNob3cgYW5kIHRpY2tzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgcGx1Z2lucywgbGlrZSBmbG90LXRpY2tyb3RvciwgdGhhdCBkcmF3IHRoZWlyIG93blxuICAgICAgICAgICAgICAgIC8vIHRpY2sgbGFiZWxzIHdpbGwgZW5kIHVwIHdpdGggYm90aCB0aGVpcnMgYW5kIHRoZSBkZWZhdWx0cy5cblxuICAgICAgICAgICAgICAgIHN1cmZhY2UucmVtb3ZlVGV4dChsYXllcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWF4aXMuc2hvdyB8fCBheGlzLnRpY2tzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF4aXMudGlja3MubGVuZ3RoOyArK2kpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aWNrID0gYXhpcy50aWNrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aWNrLmxhYmVsIHx8IHRpY2sudiA8IGF4aXMubWluIHx8IHRpY2sudiA+IGF4aXMubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IHBsb3RPZmZzZXQubGVmdCArIGF4aXMucDJjKHRpY2sudik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5wb3NpdGlvbiA9PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9IGJveC50b3AgKyBib3gucGFkZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9IGJveC50b3AgKyBib3guaGVpZ2h0IC0gYm94LnBhZGRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWduID0gXCJib3R0b21cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlnbiA9IFwibWlkZGxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gcGxvdE9mZnNldC50b3AgKyBheGlzLnAyYyh0aWNrLnYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMucG9zaXRpb24gPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gYm94LmxlZnQgKyBib3gud2lkdGggLSBib3gucGFkZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxpZ24gPSBcInJpZ2h0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBib3gubGVmdCArIGJveC5wYWRkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3VyZmFjZS5hZGRUZXh0KGxheWVyLCB4LCB5LCB0aWNrLmxhYmVsLCBmb250LCBudWxsLCBudWxsLCBoYWxpZ24sIHZhbGlnbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3U2VyaWVzKHNlcmllcykge1xuICAgICAgICAgICAgaWYgKHNlcmllcy5saW5lcy5zaG93KVxuICAgICAgICAgICAgICAgIGRyYXdTZXJpZXNMaW5lcyhzZXJpZXMpO1xuICAgICAgICAgICAgaWYgKHNlcmllcy5iYXJzLnNob3cpXG4gICAgICAgICAgICAgICAgZHJhd1Nlcmllc0JhcnMoc2VyaWVzKTtcbiAgICAgICAgICAgIGlmIChzZXJpZXMucG9pbnRzLnNob3cpXG4gICAgICAgICAgICAgICAgZHJhd1Nlcmllc1BvaW50cyhzZXJpZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd1Nlcmllc0xpbmVzKHNlcmllcykge1xuICAgICAgICAgICAgZnVuY3Rpb24gcGxvdExpbmUoZGF0YXBvaW50cywgeG9mZnNldCwgeW9mZnNldCwgYXhpc3gsIGF4aXN5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IGRhdGFwb2ludHMucG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICBwcyA9IGRhdGFwb2ludHMucG9pbnRzaXplLFxuICAgICAgICAgICAgICAgICAgICBwcmV2eCA9IG51bGwsIHByZXZ5ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gcHM7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4MSA9IHBvaW50c1tpIC0gcHNdLCB5MSA9IHBvaW50c1tpIC0gcHMgKyAxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gcG9pbnRzW2ldLCB5MiA9IHBvaW50c1tpICsgMV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxID09IG51bGwgfHwgeDIgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB5bWluXG4gICAgICAgICAgICAgICAgICAgIGlmICh5MSA8PSB5MiAmJiB5MSA8IGF4aXN5Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkyIDwgYXhpc3kubWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAgIC8vIGxpbmUgc2VnbWVudCBpcyBvdXRzaWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb21wdXRlIG5ldyBpbnRlcnNlY3Rpb24gcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gKGF4aXN5Lm1pbiAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSBheGlzeS5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeTIgPD0geTEgJiYgeTIgPCBheGlzeS5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5MSA8IGF4aXN5Lm1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gKGF4aXN5Lm1pbiAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBheGlzeS5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeW1heFxuICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPj0geTIgJiYgeTEgPiBheGlzeS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5MiA+IGF4aXN5Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gKGF4aXN5Lm1heCAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSBheGlzeS5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeTIgPj0geTEgJiYgeTIgPiBheGlzeS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5MSA+IGF4aXN5Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gKGF4aXN5Lm1heCAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBheGlzeS5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeG1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPD0geDIgJiYgeDEgPCBheGlzeC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MiA8IGF4aXN4Lm1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gKGF4aXN4Lm1pbiAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBheGlzeC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeDIgPD0geDEgJiYgeDIgPCBheGlzeC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MSA8IGF4aXN4Lm1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gKGF4aXN4Lm1pbiAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBheGlzeC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeG1heFxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPj0geDIgJiYgeDEgPiBheGlzeC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MiA+IGF4aXN4Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gKGF4aXN4Lm1heCAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBheGlzeC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeDIgPj0geDEgJiYgeDIgPiBheGlzeC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MSA+IGF4aXN4Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gKGF4aXN4Lm1heCAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBheGlzeC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgIT0gcHJldnggfHwgeTEgIT0gcHJldnkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKGF4aXN4LnAyYyh4MSkgKyB4b2Zmc2V0LCBheGlzeS5wMmMoeTEpICsgeW9mZnNldCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJldnggPSB4MjtcbiAgICAgICAgICAgICAgICAgICAgcHJldnkgPSB5MjtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDIpICsgeG9mZnNldCwgYXhpc3kucDJjKHkyKSArIHlvZmZzZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHBsb3RMaW5lQXJlYShkYXRhcG9pbnRzLCBheGlzeCwgYXhpc3kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gZGF0YXBvaW50cy5wb2ludHMsXG4gICAgICAgICAgICAgICAgICAgIHBzID0gZGF0YXBvaW50cy5wb2ludHNpemUsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbSA9IE1hdGgubWluKE1hdGgubWF4KDAsIGF4aXN5Lm1pbiksIGF4aXN5Lm1heCksXG4gICAgICAgICAgICAgICAgICAgIGkgPSAwLCB0b3AsIGFyZWFPcGVuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHlwb3MgPSAxLCBzZWdtZW50U3RhcnQgPSAwLCBzZWdtZW50RW5kID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIHdlIHByb2Nlc3MgZWFjaCBzZWdtZW50IGluIHR3byB0dXJucywgZmlyc3QgZm9yd2FyZFxuICAgICAgICAgICAgICAgIC8vIGRpcmVjdGlvbiB0byBza2V0Y2ggb3V0IHRvcCwgdGhlbiBvbmNlIHdlIGhpdCB0aGVcbiAgICAgICAgICAgICAgICAvLyBlbmQgd2UgZ28gYmFja3dhcmRzIHRvIHNrZXRjaCB0aGUgYm90dG9tXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBzID4gMCAmJiBpID4gcG9pbnRzLmxlbmd0aCArIHBzKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgaSArPSBwczsgLy8gcHMgaXMgbmVnYXRpdmUgaWYgZ29pbmcgYmFja3dhcmRzXG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHgxID0gcG9pbnRzW2kgLSBwc10sXG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IHBvaW50c1tpIC0gcHMgKyB5cG9zXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gcG9pbnRzW2ldLCB5MiA9IHBvaW50c1tpICsgeXBvc107XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZWFPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHMgPiAwICYmIHgxICE9IG51bGwgJiYgeDIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF0IHR1cm5pbmcgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWdtZW50RW5kID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcyA9IC1wcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5cG9zID0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBzIDwgMCAmJiBpID09IHNlZ21lbnRTdGFydCArIHBzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9uZSB3aXRoIHRoZSByZXZlcnNlIHN3ZWVwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhT3BlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBzID0gLXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlwb3MgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBzZWdtZW50U3RhcnQgPSBzZWdtZW50RW5kICsgcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPT0gbnVsbCB8fCB4MiA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB4IHZhbHVlc1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB4bWluXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSA8PSB4MiAmJiB4MSA8IGF4aXN4Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgyIDwgYXhpc3gubWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSAoYXhpc3gubWluIC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGF4aXN4Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh4MiA8PSB4MSAmJiB4MiA8IGF4aXN4Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgxIDwgYXhpc3gubWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSAoYXhpc3gubWluIC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGF4aXN4Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB4bWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSA+PSB4MiAmJiB4MSA+IGF4aXN4Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgyID4gYXhpc3gubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSAoYXhpc3gubWF4IC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGF4aXN4Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh4MiA+PSB4MSAmJiB4MiA+IGF4aXN4Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgxID4gYXhpc3gubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSAoYXhpc3gubWF4IC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGF4aXN4Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXJlYU9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wZW4gYXJlYVxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhheGlzeC5wMmMoeDEpLCBheGlzeS5wMmMoYm90dG9tKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhT3BlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBub3cgZmlyc3QgY2hlY2sgdGhlIGNhc2Ugd2hlcmUgYm90aCBpcyBvdXRzaWRlXG4gICAgICAgICAgICAgICAgICAgIGlmICh5MSA+PSBheGlzeS5tYXggJiYgeTIgPj0gYXhpc3kubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MSksIGF4aXN5LnAyYyhheGlzeS5tYXgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgyKSwgYXhpc3kucDJjKGF4aXN5Lm1heCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeTEgPD0gYXhpc3kubWluICYmIHkyIDw9IGF4aXN5Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDEpLCBheGlzeS5wMmMoYXhpc3kubWluKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MiksIGF4aXN5LnAyYyhheGlzeS5taW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBpdCdzIGEgYml0IG1vcmUgY29tcGxpY2F0ZWQsIHRoZXJlIG1pZ2h0XG4gICAgICAgICAgICAgICAgICAgIC8vIGJlIGEgZmxhdCBtYXhlZCBvdXQgcmVjdGFuZ2xlIGZpcnN0LCB0aGVuIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJpYW5ndWxhciBjdXRvdXQgb3IgcmV2ZXJzZTsgdG8gZmluZCB0aGVzZVxuICAgICAgICAgICAgICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSBjdXJyZW50IHggdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgIHZhciB4MW9sZCA9IHgxLCB4Mm9sZCA9IHgyO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgdGhlIHkgdmFsdWVzLCB3aXRob3V0IHNob3J0Y3V0dGluZywgd2VcbiAgICAgICAgICAgICAgICAgICAgLy8gZ28gdGhyb3VnaCBhbGwgY2FzZXMgaW4gdHVyblxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB5bWluXG4gICAgICAgICAgICAgICAgICAgIGlmICh5MSA8PSB5MiAmJiB5MSA8IGF4aXN5Lm1pbiAmJiB5MiA+PSBheGlzeS5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gKGF4aXN5Lm1pbiAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSBheGlzeS5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeTIgPD0geTEgJiYgeTIgPCBheGlzeS5taW4gJiYgeTEgPj0gYXhpc3kubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IChheGlzeS5taW4gLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gYXhpc3kubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHltYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkxID49IHkyICYmIHkxID4gYXhpc3kubWF4ICYmIHkyIDw9IGF4aXN5Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSAoYXhpc3kubWF4IC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IGF4aXN5Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh5MiA+PSB5MSAmJiB5MiA+IGF4aXN5Lm1heCAmJiB5MSA8PSBheGlzeS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gKGF4aXN5Lm1heCAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBheGlzeS5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgeCB2YWx1ZSB3YXMgY2hhbmdlZCB3ZSBnb3QgYSByZWN0YW5nbGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZmlsbFxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgIT0geDFvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgxb2xkKSwgYXhpc3kucDJjKHkxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBnb2VzIHRvICh4MSwgeTEpLCBidXQgd2UgZmlsbCB0aGF0IGJlbG93XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBmaWxsIHRyaWFuZ3VsYXIgc2VjdGlvbiwgdGhpcyBzb21ldGltZXMgcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIC8vIGluIHJlZHVuZGFudCBwb2ludHMgaWYgKHgxLCB5MSkgaGFzbid0IGNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBwcmV2aW91cyBsaW5lIHRvLCBidXQgd2UganVzdCBpZ25vcmUgdGhhdFxuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MSksIGF4aXN5LnAyYyh5MSkpO1xuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MiksIGF4aXN5LnAyYyh5MikpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbGwgdGhlIG90aGVyIHJlY3RhbmdsZSBpZiBpdCdzIHRoZXJlXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MiAhPSB4Mm9sZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDIpLCBheGlzeS5wMmMoeTIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgyb2xkKSwgYXhpc3kucDJjKHkyKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHBsb3RPZmZzZXQubGVmdCwgcGxvdE9mZnNldC50b3ApO1xuICAgICAgICAgICAgY3R4LmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG4gICAgICAgICAgICB2YXIgbHcgPSBzZXJpZXMubGluZXMubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN3ID0gc2VyaWVzLnNoYWRvd1NpemU7XG4gICAgICAgICAgICAvLyBGSVhNRTogY29uc2lkZXIgYW5vdGhlciBmb3JtIG9mIHNoYWRvdyB3aGVuIGZpbGxpbmcgaXMgdHVybmVkIG9uXG4gICAgICAgICAgICBpZiAobHcgPiAwICYmIHN3ID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIGRyYXcgc2hhZG93IGFzIGEgdGhpY2sgYW5kIHRoaW4gbGluZSB3aXRoIHRyYW5zcGFyZW5jeVxuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBzdztcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMCwwLDAsMC4xKVwiO1xuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uIHNoYWRvdyBhdCBhbmdsZSBmcm9tIHRoZSBtaWQgb2YgbGluZVxuICAgICAgICAgICAgICAgIHZhciBhbmdsZSA9IE1hdGguUEkvMTg7XG4gICAgICAgICAgICAgICAgcGxvdExpbmUoc2VyaWVzLmRhdGFwb2ludHMsIE1hdGguc2luKGFuZ2xlKSAqIChsdy8yICsgc3cvMiksIE1hdGguY29zKGFuZ2xlKSAqIChsdy8yICsgc3cvMiksIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzKTtcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gc3cvMjtcbiAgICAgICAgICAgICAgICBwbG90TGluZShzZXJpZXMuZGF0YXBvaW50cywgTWF0aC5zaW4oYW5nbGUpICogKGx3LzIgKyBzdy80KSwgTWF0aC5jb3MoYW5nbGUpICogKGx3LzIgKyBzdy80KSwgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gbHc7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzZXJpZXMuY29sb3I7XG4gICAgICAgICAgICB2YXIgZmlsbFN0eWxlID0gZ2V0RmlsbFN0eWxlKHNlcmllcy5saW5lcywgc2VyaWVzLmNvbG9yLCAwLCBwbG90SGVpZ2h0KTtcbiAgICAgICAgICAgIGlmIChmaWxsU3R5bGUpIHtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgICAgICAgICAgIHBsb3RMaW5lQXJlYShzZXJpZXMuZGF0YXBvaW50cywgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobHcgPiAwKVxuICAgICAgICAgICAgICAgIHBsb3RMaW5lKHNlcmllcy5kYXRhcG9pbnRzLCAwLCAwLCBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcyk7XG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd1Nlcmllc1BvaW50cyhzZXJpZXMpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHBsb3RQb2ludHMoZGF0YXBvaW50cywgcmFkaXVzLCBmaWxsU3R5bGUsIG9mZnNldCwgc2hhZG93LCBheGlzeCwgYXhpc3ksIHN5bWJvbCkge1xuICAgICAgICAgICAgICAgIHZhciBwb2ludHMgPSBkYXRhcG9pbnRzLnBvaW50cywgcHMgPSBkYXRhcG9pbnRzLnBvaW50c2l6ZTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHBvaW50c1tpXSwgeSA9IHBvaW50c1tpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh4ID09IG51bGwgfHwgeCA8IGF4aXN4Lm1pbiB8fCB4ID4gYXhpc3gubWF4IHx8IHkgPCBheGlzeS5taW4gfHwgeSA+IGF4aXN5Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgeCA9IGF4aXN4LnAyYyh4KTtcbiAgICAgICAgICAgICAgICAgICAgeSA9IGF4aXN5LnAyYyh5KSArIG9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWJvbCA9PSBcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIHNoYWRvdyA/IE1hdGguUEkgOiBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2woY3R4LCB4LCB5LCByYWRpdXMsIHNoYWRvdyk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsbFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShwbG90T2Zmc2V0LmxlZnQsIHBsb3RPZmZzZXQudG9wKTtcblxuICAgICAgICAgICAgdmFyIGx3ID0gc2VyaWVzLnBvaW50cy5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgc3cgPSBzZXJpZXMuc2hhZG93U2l6ZSxcbiAgICAgICAgICAgICAgICByYWRpdXMgPSBzZXJpZXMucG9pbnRzLnJhZGl1cyxcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBzZXJpZXMucG9pbnRzLnN5bWJvbDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgc2V0cyB0aGUgbGluZSB3aWR0aCB0byAwLCB3ZSBjaGFuZ2UgaXQgdG8gYSB2ZXJ5IFxuICAgICAgICAgICAgLy8gc21hbGwgdmFsdWUuIEEgbGluZSB3aWR0aCBvZiAwIHNlZW1zIHRvIGZvcmNlIHRoZSBkZWZhdWx0IG9mIDEuXG4gICAgICAgICAgICAvLyBEb2luZyB0aGUgY29uZGl0aW9uYWwgaGVyZSBhbGxvd3MgdGhlIHNoYWRvdyBzZXR0aW5nIHRvIHN0aWxsIGJlIFxuICAgICAgICAgICAgLy8gb3B0aW9uYWwgZXZlbiB3aXRoIGEgbGluZVdpZHRoIG9mIDAuXG5cbiAgICAgICAgICAgIGlmKCBsdyA9PSAwIClcbiAgICAgICAgICAgICAgICBsdyA9IDAuMDAwMTtcblxuICAgICAgICAgICAgaWYgKGx3ID4gMCAmJiBzdyA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBkcmF3IHNoYWRvdyBpbiB0d28gc3RlcHNcbiAgICAgICAgICAgICAgICB2YXIgdyA9IHN3IC8gMjtcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gdztcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMCwwLDAsMC4xKVwiO1xuICAgICAgICAgICAgICAgIHBsb3RQb2ludHMoc2VyaWVzLmRhdGFwb2ludHMsIHJhZGl1cywgbnVsbCwgdyArIHcvMiwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzLCBzeW1ib2wpO1xuXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDAsMCwwLDAuMilcIjtcbiAgICAgICAgICAgICAgICBwbG90UG9pbnRzKHNlcmllcy5kYXRhcG9pbnRzLCByYWRpdXMsIG51bGwsIHcvMiwgdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzLCBzeW1ib2wpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gbHc7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzZXJpZXMuY29sb3I7XG4gICAgICAgICAgICBwbG90UG9pbnRzKHNlcmllcy5kYXRhcG9pbnRzLCByYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgICAgIGdldEZpbGxTdHlsZShzZXJpZXMucG9pbnRzLCBzZXJpZXMuY29sb3IpLCAwLCBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMsIHN5bWJvbCk7XG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd0Jhcih4LCB5LCBiLCBiYXJMZWZ0LCBiYXJSaWdodCwgZmlsbFN0eWxlQ2FsbGJhY2ssIGF4aXN4LCBheGlzeSwgYywgaG9yaXpvbnRhbCwgbGluZVdpZHRoKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLFxuICAgICAgICAgICAgICAgIGRyYXdMZWZ0LCBkcmF3UmlnaHQsIGRyYXdUb3AsIGRyYXdCb3R0b20sXG4gICAgICAgICAgICAgICAgdG1wO1xuXG4gICAgICAgICAgICAvLyBpbiBob3Jpem9udGFsIG1vZGUsIHdlIHN0YXJ0IHRoZSBiYXIgZnJvbSB0aGUgbGVmdFxuICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBmcm9tIHRoZSBib3R0b20gc28gaXQgYXBwZWFycyB0byBiZVxuICAgICAgICAgICAgLy8gaG9yaXpvbnRhbCByYXRoZXIgdGhhbiB2ZXJ0aWNhbFxuICAgICAgICAgICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBkcmF3Qm90dG9tID0gZHJhd1JpZ2h0ID0gZHJhd1RvcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZHJhd0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gYjtcbiAgICAgICAgICAgICAgICByaWdodCA9IHg7XG4gICAgICAgICAgICAgICAgdG9wID0geSArIGJhckxlZnQ7XG4gICAgICAgICAgICAgICAgYm90dG9tID0geSArIGJhclJpZ2h0O1xuXG4gICAgICAgICAgICAgICAgLy8gYWNjb3VudCBmb3IgbmVnYXRpdmUgYmFyc1xuICAgICAgICAgICAgICAgIGlmIChyaWdodCA8IGxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wID0gcmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gbGVmdDtcbiAgICAgICAgICAgICAgICAgICAgbGVmdCA9IHRtcDtcbiAgICAgICAgICAgICAgICAgICAgZHJhd0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBkcmF3UmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkcmF3TGVmdCA9IGRyYXdSaWdodCA9IGRyYXdUb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRyYXdCb3R0b20gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZWZ0ID0geCArIGJhckxlZnQ7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSB4ICsgYmFyUmlnaHQ7XG4gICAgICAgICAgICAgICAgYm90dG9tID0gYjtcbiAgICAgICAgICAgICAgICB0b3AgPSB5O1xuXG4gICAgICAgICAgICAgICAgLy8gYWNjb3VudCBmb3IgbmVnYXRpdmUgYmFyc1xuICAgICAgICAgICAgICAgIGlmICh0b3AgPCBib3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wID0gdG9wO1xuICAgICAgICAgICAgICAgICAgICB0b3AgPSBib3R0b207XG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbSA9IHRtcDtcbiAgICAgICAgICAgICAgICAgICAgZHJhd0JvdHRvbSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGRyYXdUb3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNsaXBcbiAgICAgICAgICAgIGlmIChyaWdodCA8IGF4aXN4Lm1pbiB8fCBsZWZ0ID4gYXhpc3gubWF4IHx8XG4gICAgICAgICAgICAgICAgdG9wIDwgYXhpc3kubWluIHx8IGJvdHRvbSA+IGF4aXN5Lm1heClcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChsZWZ0IDwgYXhpc3gubWluKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGF4aXN4Lm1pbjtcbiAgICAgICAgICAgICAgICBkcmF3TGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmlnaHQgPiBheGlzeC5tYXgpIHtcbiAgICAgICAgICAgICAgICByaWdodCA9IGF4aXN4Lm1heDtcbiAgICAgICAgICAgICAgICBkcmF3UmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGJvdHRvbSA8IGF4aXN5Lm1pbikge1xuICAgICAgICAgICAgICAgIGJvdHRvbSA9IGF4aXN5Lm1pbjtcbiAgICAgICAgICAgICAgICBkcmF3Qm90dG9tID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b3AgPiBheGlzeS5tYXgpIHtcbiAgICAgICAgICAgICAgICB0b3AgPSBheGlzeS5tYXg7XG4gICAgICAgICAgICAgICAgZHJhd1RvcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZWZ0ID0gYXhpc3gucDJjKGxlZnQpO1xuICAgICAgICAgICAgYm90dG9tID0gYXhpc3kucDJjKGJvdHRvbSk7XG4gICAgICAgICAgICByaWdodCA9IGF4aXN4LnAyYyhyaWdodCk7XG4gICAgICAgICAgICB0b3AgPSBheGlzeS5wMmModG9wKTtcblxuICAgICAgICAgICAgLy8gZmlsbCB0aGUgYmFyXG4gICAgICAgICAgICBpZiAoZmlsbFN0eWxlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjLmZpbGxTdHlsZSA9IGZpbGxTdHlsZUNhbGxiYWNrKGJvdHRvbSwgdG9wKTtcbiAgICAgICAgICAgICAgICBjLmZpbGxSZWN0KGxlZnQsIHRvcCwgcmlnaHQgLSBsZWZ0LCBib3R0b20gLSB0b3ApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRyYXcgb3V0bGluZVxuICAgICAgICAgICAgaWYgKGxpbmVXaWR0aCA+IDAgJiYgKGRyYXdMZWZ0IHx8IGRyYXdSaWdodCB8fCBkcmF3VG9wIHx8IGRyYXdCb3R0b20pKSB7XG4gICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcblxuICAgICAgICAgICAgICAgIC8vIEZJWE1FOiBpbmxpbmUgbW92ZVRvIGlzIGJ1Z2d5IHdpdGggZXhjYW52YXNcbiAgICAgICAgICAgICAgICBjLm1vdmVUbyhsZWZ0LCBib3R0b20pO1xuICAgICAgICAgICAgICAgIGlmIChkcmF3TGVmdClcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obGVmdCwgdG9wKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGMubW92ZVRvKGxlZnQsIHRvcCk7XG4gICAgICAgICAgICAgICAgaWYgKGRyYXdUb3ApXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVRvKHJpZ2h0LCB0b3ApO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8ocmlnaHQsIHRvcCk7XG4gICAgICAgICAgICAgICAgaWYgKGRyYXdSaWdodClcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8ocmlnaHQsIGJvdHRvbSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjLm1vdmVUbyhyaWdodCwgYm90dG9tKTtcbiAgICAgICAgICAgICAgICBpZiAoZHJhd0JvdHRvbSlcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8obGVmdCwgYm90dG9tKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGMubW92ZVRvKGxlZnQsIGJvdHRvbSk7XG4gICAgICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdTZXJpZXNCYXJzKHNlcmllcykge1xuICAgICAgICAgICAgZnVuY3Rpb24gcGxvdEJhcnMoZGF0YXBvaW50cywgYmFyTGVmdCwgYmFyUmlnaHQsIGZpbGxTdHlsZUNhbGxiYWNrLCBheGlzeCwgYXhpc3kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gZGF0YXBvaW50cy5wb2ludHMsIHBzID0gZGF0YXBvaW50cy5wb2ludHNpemU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50c1tpXSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGRyYXdCYXIocG9pbnRzW2ldLCBwb2ludHNbaSArIDFdLCBwb2ludHNbaSArIDJdLCBiYXJMZWZ0LCBiYXJSaWdodCwgZmlsbFN0eWxlQ2FsbGJhY2ssIGF4aXN4LCBheGlzeSwgY3R4LCBzZXJpZXMuYmFycy5ob3Jpem9udGFsLCBzZXJpZXMuYmFycy5saW5lV2lkdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocGxvdE9mZnNldC5sZWZ0LCBwbG90T2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgICAgIC8vIEZJWE1FOiBmaWd1cmUgb3V0IGEgd2F5IHRvIGFkZCBzaGFkb3dzIChmb3IgaW5zdGFuY2UgYWxvbmcgdGhlIHJpZ2h0IGVkZ2UpXG4gICAgICAgICAgICBjdHgubGluZVdpZHRoID0gc2VyaWVzLmJhcnMubGluZVdpZHRoO1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc2VyaWVzLmNvbG9yO1xuXG4gICAgICAgICAgICB2YXIgYmFyTGVmdDtcblxuICAgICAgICAgICAgc3dpdGNoIChzZXJpZXMuYmFycy5hbGlnbikge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IC1zZXJpZXMuYmFycy5iYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IC1zZXJpZXMuYmFycy5iYXJXaWR0aCAvIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmaWxsU3R5bGVDYWxsYmFjayA9IHNlcmllcy5iYXJzLmZpbGwgPyBmdW5jdGlvbiAoYm90dG9tLCB0b3ApIHsgcmV0dXJuIGdldEZpbGxTdHlsZShzZXJpZXMuYmFycywgc2VyaWVzLmNvbG9yLCBib3R0b20sIHRvcCk7IH0gOiBudWxsO1xuICAgICAgICAgICAgcGxvdEJhcnMoc2VyaWVzLmRhdGFwb2ludHMsIGJhckxlZnQsIGJhckxlZnQgKyBzZXJpZXMuYmFycy5iYXJXaWR0aCwgZmlsbFN0eWxlQ2FsbGJhY2ssIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzKTtcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRGaWxsU3R5bGUoZmlsbG9wdGlvbnMsIHNlcmllc0NvbG9yLCBib3R0b20sIHRvcCkge1xuICAgICAgICAgICAgdmFyIGZpbGwgPSBmaWxsb3B0aW9ucy5maWxsO1xuICAgICAgICAgICAgaWYgKCFmaWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoZmlsbG9wdGlvbnMuZmlsbENvbG9yKVxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRDb2xvck9yR3JhZGllbnQoZmlsbG9wdGlvbnMuZmlsbENvbG9yLCBib3R0b20sIHRvcCwgc2VyaWVzQ29sb3IpO1xuXG4gICAgICAgICAgICB2YXIgYyA9ICQuY29sb3IucGFyc2Uoc2VyaWVzQ29sb3IpO1xuICAgICAgICAgICAgYy5hID0gdHlwZW9mIGZpbGwgPT0gXCJudW1iZXJcIiA/IGZpbGwgOiAwLjQ7XG4gICAgICAgICAgICBjLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGMudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluc2VydExlZ2VuZCgpIHtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVnZW5kLmNvbnRhaW5lciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJChvcHRpb25zLmxlZ2VuZC5jb250YWluZXIpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLmZpbmQoXCIubGVnZW5kXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMubGVnZW5kLnNob3cpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBmcmFnbWVudHMgPSBbXSwgZW50cmllcyA9IFtdLCByb3dTdGFydGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgbGYgPSBvcHRpb25zLmxlZ2VuZC5sYWJlbEZvcm1hdHRlciwgcywgbGFiZWw7XG5cbiAgICAgICAgICAgIC8vIEJ1aWxkIGEgbGlzdCBvZiBsZWdlbmQgZW50cmllcywgd2l0aCBlYWNoIGhhdmluZyBhIGxhYmVsIGFuZCBhIGNvbG9yXG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAocy5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGxmID8gbGYocy5sYWJlbCwgcykgOiBzLmxhYmVsO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudHJpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBzLmNvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU29ydCB0aGUgbGVnZW5kIHVzaW5nIGVpdGhlciB0aGUgZGVmYXVsdCBvciBhIGN1c3RvbSBjb21wYXJhdG9yXG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxlZ2VuZC5zb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdGlvbnMubGVnZW5kLnNvcnRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cmllcy5zb3J0KG9wdGlvbnMubGVnZW5kLnNvcnRlZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmxlZ2VuZC5zb3J0ZWQgPT0gXCJyZXZlcnNlXCIpIHtcbiAgICAgICAgICAgICAgICBcdGVudHJpZXMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhc2NlbmRpbmcgPSBvcHRpb25zLmxlZ2VuZC5zb3J0ZWQgIT0gXCJkZXNjZW5kaW5nXCI7XG4gICAgICAgICAgICAgICAgICAgIGVudHJpZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5sYWJlbCA9PSBiLmxhYmVsID8gMCA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYS5sYWJlbCA8IGIubGFiZWwpICE9IGFzY2VuZGluZyA/IDEgOiAtMSAgIC8vIExvZ2ljYWwgWE9SXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIG1hcmt1cCBmb3IgdGhlIGxpc3Qgb2YgZW50cmllcywgaW4gdGhlaXIgZmluYWwgb3JkZXJcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgJSBvcHRpb25zLmxlZ2VuZC5ub0NvbHVtbnMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocm93U3RhcnRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYWdtZW50cy5wdXNoKCc8L3RyPicpO1xuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudHMucHVzaCgnPHRyPicpO1xuICAgICAgICAgICAgICAgICAgICByb3dTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmcmFnbWVudHMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImxlZ2VuZENvbG9yQm94XCI+PGRpdiBzdHlsZT1cImJvcmRlcjoxcHggc29saWQgJyArIG9wdGlvbnMubGVnZW5kLmxhYmVsQm94Qm9yZGVyQ29sb3IgKyAnO3BhZGRpbmc6MXB4XCI+PGRpdiBzdHlsZT1cIndpZHRoOjRweDtoZWlnaHQ6MDtib3JkZXI6NXB4IHNvbGlkICcgKyBlbnRyeS5jb2xvciArICc7b3ZlcmZsb3c6aGlkZGVuXCI+PC9kaXY+PC9kaXY+PC90ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImxlZ2VuZExhYmVsXCI+JyArIGVudHJ5LmxhYmVsICsgJzwvdGQ+J1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyb3dTdGFydGVkKVxuICAgICAgICAgICAgICAgIGZyYWdtZW50cy5wdXNoKCc8L3RyPicpO1xuXG4gICAgICAgICAgICBpZiAoZnJhZ21lbnRzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIHRhYmxlID0gJzx0YWJsZSBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbGVyO2NvbG9yOicgKyBvcHRpb25zLmdyaWQuY29sb3IgKyAnXCI+JyArIGZyYWdtZW50cy5qb2luKFwiXCIpICsgJzwvdGFibGU+JztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxlZ2VuZC5jb250YWluZXIgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMubGVnZW5kLmNvbnRhaW5lcikuaHRtbCh0YWJsZSk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gXCJcIixcbiAgICAgICAgICAgICAgICAgICAgcCA9IG9wdGlvbnMubGVnZW5kLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBtID0gb3B0aW9ucy5sZWdlbmQubWFyZ2luO1xuICAgICAgICAgICAgICAgIGlmIChtWzBdID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIG0gPSBbbSwgbV07XG4gICAgICAgICAgICAgICAgaWYgKHAuY2hhckF0KDApID09IFwiblwiKVxuICAgICAgICAgICAgICAgICAgICBwb3MgKz0gJ3RvcDonICsgKG1bMV0gKyBwbG90T2Zmc2V0LnRvcCkgKyAncHg7JztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwLmNoYXJBdCgwKSA9PSBcInNcIilcbiAgICAgICAgICAgICAgICAgICAgcG9zICs9ICdib3R0b206JyArIChtWzFdICsgcGxvdE9mZnNldC5ib3R0b20pICsgJ3B4Oyc7XG4gICAgICAgICAgICAgICAgaWYgKHAuY2hhckF0KDEpID09IFwiZVwiKVxuICAgICAgICAgICAgICAgICAgICBwb3MgKz0gJ3JpZ2h0OicgKyAobVswXSArIHBsb3RPZmZzZXQucmlnaHQpICsgJ3B4Oyc7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocC5jaGFyQXQoMSkgPT0gXCJ3XCIpXG4gICAgICAgICAgICAgICAgICAgIHBvcyArPSAnbGVmdDonICsgKG1bMF0gKyBwbG90T2Zmc2V0LmxlZnQpICsgJ3B4Oyc7XG4gICAgICAgICAgICAgICAgdmFyIGxlZ2VuZCA9ICQoJzxkaXYgY2xhc3M9XCJsZWdlbmRcIj4nICsgdGFibGUucmVwbGFjZSgnc3R5bGU9XCInLCAnc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsnICsgcG9zICsnOycpICsgJzwvZGl2PicpLmFwcGVuZFRvKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5sZWdlbmQuYmFja2dyb3VuZE9wYWNpdHkgIT0gMC4wKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1dCBpbiB0aGUgdHJhbnNwYXJlbnQgYmFja2dyb3VuZFxuICAgICAgICAgICAgICAgICAgICAvLyBzZXBhcmF0ZWx5IHRvIGF2b2lkIGJsZW5kZWQgbGFiZWxzIGFuZFxuICAgICAgICAgICAgICAgICAgICAvLyBsYWJlbCBib3hlc1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IG9wdGlvbnMubGVnZW5kLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IG9wdGlvbnMuZ3JpZC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyAmJiB0eXBlb2YgYyA9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAkLmNvbG9yLnBhcnNlKGMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSAkLmNvbG9yLmV4dHJhY3QobGVnZW5kLCAnYmFja2dyb3VuZC1jb2xvcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5hID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBjLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpdiA9IGxlZ2VuZC5jaGlsZHJlbigpO1xuICAgICAgICAgICAgICAgICAgICAkKCc8ZGl2IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7d2lkdGg6JyArIGRpdi53aWR0aCgpICsgJ3B4O2hlaWdodDonICsgZGl2LmhlaWdodCgpICsgJ3B4OycgKyBwb3MgKydiYWNrZ3JvdW5kLWNvbG9yOicgKyBjICsgJztcIj4gPC9kaXY+JykucHJlcGVuZFRvKGxlZ2VuZCkuY3NzKCdvcGFjaXR5Jywgb3B0aW9ucy5sZWdlbmQuYmFja2dyb3VuZE9wYWNpdHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gaW50ZXJhY3RpdmUgZmVhdHVyZXNcblxuICAgICAgICB2YXIgaGlnaGxpZ2h0cyA9IFtdLFxuICAgICAgICAgICAgcmVkcmF3VGltZW91dCA9IG51bGw7XG5cbiAgICAgICAgLy8gcmV0dXJucyB0aGUgZGF0YSBpdGVtIHRoZSBtb3VzZSBpcyBvdmVyLCBvciBudWxsIGlmIG5vbmUgaXMgZm91bmRcbiAgICAgICAgZnVuY3Rpb24gZmluZE5lYXJieUl0ZW0obW91c2VYLCBtb3VzZVksIHNlcmllc0ZpbHRlcikge1xuICAgICAgICAgICAgdmFyIG1heERpc3RhbmNlID0gb3B0aW9ucy5ncmlkLm1vdXNlQWN0aXZlUmFkaXVzLFxuICAgICAgICAgICAgICAgIHNtYWxsZXN0RGlzdGFuY2UgPSBtYXhEaXN0YW5jZSAqIG1heERpc3RhbmNlICsgMSxcbiAgICAgICAgICAgICAgICBpdGVtID0gbnVsbCwgZm91bmRQb2ludCA9IGZhbHNlLCBpLCBqLCBwcztcblxuICAgICAgICAgICAgZm9yIChpID0gc2VyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZXJpZXNGaWx0ZXIoc2VyaWVzW2ldKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgcyA9IHNlcmllc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgYXhpc3ggPSBzLnhheGlzLFxuICAgICAgICAgICAgICAgICAgICBheGlzeSA9IHMueWF4aXMsXG4gICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IHMuZGF0YXBvaW50cy5wb2ludHMsXG4gICAgICAgICAgICAgICAgICAgIG14ID0gYXhpc3guYzJwKG1vdXNlWCksIC8vIHByZWNvbXB1dGUgc29tZSBzdHVmZiB0byBtYWtlIHRoZSBsb29wIGZhc3RlclxuICAgICAgICAgICAgICAgICAgICBteSA9IGF4aXN5LmMycChtb3VzZVkpLFxuICAgICAgICAgICAgICAgICAgICBtYXh4ID0gbWF4RGlzdGFuY2UgLyBheGlzeC5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgbWF4eSA9IG1heERpc3RhbmNlIC8gYXhpc3kuc2NhbGU7XG5cbiAgICAgICAgICAgICAgICBwcyA9IHMuZGF0YXBvaW50cy5wb2ludHNpemU7XG4gICAgICAgICAgICAgICAgLy8gd2l0aCBpbnZlcnNlIHRyYW5zZm9ybXMsIHdlIGNhbid0IHVzZSB0aGUgbWF4eC9tYXh5XG4gICAgICAgICAgICAgICAgLy8gb3B0aW1pemF0aW9uLCBzYWRseVxuICAgICAgICAgICAgICAgIGlmIChheGlzeC5vcHRpb25zLmludmVyc2VUcmFuc2Zvcm0pXG4gICAgICAgICAgICAgICAgICAgIG1heHggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICAgICAgICAgIGlmIChheGlzeS5vcHRpb25zLmludmVyc2VUcmFuc2Zvcm0pXG4gICAgICAgICAgICAgICAgICAgIG1heHkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXG4gICAgICAgICAgICAgICAgaWYgKHMubGluZXMuc2hvdyB8fCBzLnBvaW50cy5zaG93KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBwb2ludHMubGVuZ3RoOyBqICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHBvaW50c1tqXSwgeSA9IHBvaW50c1tqICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3IgcG9pbnRzIGFuZCBsaW5lcywgdGhlIGN1cnNvciBtdXN0IGJlIHdpdGhpbiBhXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjZXJ0YWluIGRpc3RhbmNlIHRvIHRoZSBkYXRhIHBvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCAtIG14ID4gbWF4eCB8fCB4IC0gbXggPCAtbWF4eCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgLSBteSA+IG1heHkgfHwgeSAtIG15IDwgLW1heHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2FsY3VsYXRlIGRpc3RhbmNlcyBpbiBwaXhlbHMsIG5vdCBpblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGF0YSB1bml0cywgYmVjYXVzZSB0aGUgc2NhbGVzIG9mIHRoZSBheGVzIG1heSBiZSBkaWZmZXJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkeCA9IE1hdGguYWJzKGF4aXN4LnAyYyh4KSAtIG1vdXNlWCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHkgPSBNYXRoLmFicyhheGlzeS5wMmMoeSkgLSBtb3VzZVkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3QgPSBkeCAqIGR4ICsgZHkgKiBkeTsgLy8gd2Ugc2F2ZSB0aGUgc3FydFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2UgPD0gdG8gZW5zdXJlIGxhc3QgcG9pbnQgdGFrZXMgcHJlY2VkZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gKGxhc3QgZ2VuZXJhbGx5IG1lYW5zIG9uIHRvcCBvZilcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0IDwgc21hbGxlc3REaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNtYWxsZXN0RGlzdGFuY2UgPSBkaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBbaSwgaiAvIHBzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzLmJhcnMuc2hvdyAmJiAhaXRlbSkgeyAvLyBubyBvdGhlciBwb2ludCBjYW4gYmUgbmVhcmJ5XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhckxlZnQsIGJhclJpZ2h0O1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocy5iYXJzLmFsaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IC1zLmJhcnMuYmFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAtcy5iYXJzLmJhcldpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJhclJpZ2h0ID0gYmFyTGVmdCArIHMuYmFycy5iYXJXaWR0aDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcG9pbnRzLmxlbmd0aDsgaiArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHggPSBwb2ludHNbal0sIHkgPSBwb2ludHNbaiArIDFdLCBiID0gcG9pbnRzW2ogKyAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvciBhIGJhciBncmFwaCwgdGhlIGN1cnNvciBtdXN0IGJlIGluc2lkZSB0aGUgYmFyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VyaWVzW2ldLmJhcnMuaG9yaXpvbnRhbCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG14IDw9IE1hdGgubWF4KGIsIHgpICYmIG14ID49IE1hdGgubWluKGIsIHgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15ID49IHkgKyBiYXJMZWZ0ICYmIG15IDw9IHkgKyBiYXJSaWdodCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChteCA+PSB4ICsgYmFyTGVmdCAmJiBteCA8PSB4ICsgYmFyUmlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXkgPj0gTWF0aC5taW4oYiwgeSkgJiYgbXkgPD0gTWF0aC5tYXgoYiwgeSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gW2ksIGogLyBwc107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaSA9IGl0ZW1bMF07XG4gICAgICAgICAgICAgICAgaiA9IGl0ZW1bMV07XG4gICAgICAgICAgICAgICAgcHMgPSBzZXJpZXNbaV0uZGF0YXBvaW50cy5wb2ludHNpemU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBkYXRhcG9pbnQ6IHNlcmllc1tpXS5kYXRhcG9pbnRzLnBvaW50cy5zbGljZShqICogcHMsIChqICsgMSkgKiBwcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUluZGV4OiBqLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllczogc2VyaWVzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllc0luZGV4OiBpIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5ob3ZlcmFibGUpXG4gICAgICAgICAgICAgICAgdHJpZ2dlckNsaWNrSG92ZXJFdmVudChcInBsb3Rob3ZlclwiLCBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHNbXCJob3ZlcmFibGVcIl0gIT0gZmFsc2U7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25Nb3VzZUxlYXZlKGUpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuaG92ZXJhYmxlKVxuICAgICAgICAgICAgICAgIHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoXCJwbG90aG92ZXJcIiwgZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChzKSB7IHJldHVybiBmYWxzZTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoXCJwbG90Y2xpY2tcIiwgZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHNbXCJjbGlja2FibGVcIl0gIT0gZmFsc2U7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdHJpZ2dlciBjbGljayBvciBob3ZlciBldmVudCAodGhleSBzZW5kIHRoZSBzYW1lIHBhcmFtZXRlcnNcbiAgICAgICAgLy8gc28gd2Ugc2hhcmUgdGhlaXIgY29kZSlcbiAgICAgICAgZnVuY3Rpb24gdHJpZ2dlckNsaWNrSG92ZXJFdmVudChldmVudG5hbWUsIGV2ZW50LCBzZXJpZXNGaWx0ZXIpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBldmVudEhvbGRlci5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICBjYW52YXNYID0gZXZlbnQucGFnZVggLSBvZmZzZXQubGVmdCAtIHBsb3RPZmZzZXQubGVmdCxcbiAgICAgICAgICAgICAgICBjYW52YXNZID0gZXZlbnQucGFnZVkgLSBvZmZzZXQudG9wIC0gcGxvdE9mZnNldC50b3AsXG4gICAgICAgICAgICBwb3MgPSBjYW52YXNUb0F4aXNDb29yZHMoeyBsZWZ0OiBjYW52YXNYLCB0b3A6IGNhbnZhc1kgfSk7XG5cbiAgICAgICAgICAgIHBvcy5wYWdlWCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICAgICAgcG9zLnBhZ2VZID0gZXZlbnQucGFnZVk7XG5cbiAgICAgICAgICAgIHZhciBpdGVtID0gZmluZE5lYXJieUl0ZW0oY2FudmFzWCwgY2FudmFzWSwgc2VyaWVzRmlsdGVyKTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAvLyBmaWxsIGluIG1vdXNlIHBvcyBmb3IgYW55IGxpc3RlbmVycyBvdXQgdGhlcmVcbiAgICAgICAgICAgICAgICBpdGVtLnBhZ2VYID0gcGFyc2VJbnQoaXRlbS5zZXJpZXMueGF4aXMucDJjKGl0ZW0uZGF0YXBvaW50WzBdKSArIG9mZnNldC5sZWZ0ICsgcGxvdE9mZnNldC5sZWZ0LCAxMCk7XG4gICAgICAgICAgICAgICAgaXRlbS5wYWdlWSA9IHBhcnNlSW50KGl0ZW0uc2VyaWVzLnlheGlzLnAyYyhpdGVtLmRhdGFwb2ludFsxXSkgKyBvZmZzZXQudG9wICsgcGxvdE9mZnNldC50b3AsIDEwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5hdXRvSGlnaGxpZ2h0KSB7XG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgYXV0by1oaWdobGlnaHRzXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaWdobGlnaHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoID0gaGlnaGxpZ2h0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGguYXV0byA9PSBldmVudG5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICEoaXRlbSAmJiBoLnNlcmllcyA9PSBpdGVtLnNlcmllcyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICBoLnBvaW50WzBdID09IGl0ZW0uZGF0YXBvaW50WzBdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGgucG9pbnRbMV0gPT0gaXRlbS5kYXRhcG9pbnRbMV0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgdW5oaWdobGlnaHQoaC5zZXJpZXMsIGgucG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdGVtKVxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHQoaXRlbS5zZXJpZXMsIGl0ZW0uZGF0YXBvaW50LCBldmVudG5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwbGFjZWhvbGRlci50cmlnZ2VyKGV2ZW50bmFtZSwgWyBwb3MsIGl0ZW0gXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0cmlnZ2VyUmVkcmF3T3ZlcmxheSgpIHtcbiAgICAgICAgICAgIHZhciB0ID0gb3B0aW9ucy5pbnRlcmFjdGlvbi5yZWRyYXdPdmVybGF5SW50ZXJ2YWw7XG4gICAgICAgICAgICBpZiAodCA9PSAtMSkgeyAgICAgIC8vIHNraXAgZXZlbnQgcXVldWVcbiAgICAgICAgICAgICAgICBkcmF3T3ZlcmxheSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFyZWRyYXdUaW1lb3V0KVxuICAgICAgICAgICAgICAgIHJlZHJhd1RpbWVvdXQgPSBzZXRUaW1lb3V0KGRyYXdPdmVybGF5LCB0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdPdmVybGF5KCkge1xuICAgICAgICAgICAgcmVkcmF3VGltZW91dCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIGRyYXcgaGlnaGxpZ2h0c1xuICAgICAgICAgICAgb2N0eC5zYXZlKCk7XG4gICAgICAgICAgICBvdmVybGF5LmNsZWFyKCk7XG4gICAgICAgICAgICBvY3R4LnRyYW5zbGF0ZShwbG90T2Zmc2V0LmxlZnQsIHBsb3RPZmZzZXQudG9wKTtcblxuICAgICAgICAgICAgdmFyIGksIGhpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBoaSA9IGhpZ2hsaWdodHNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaGkuc2VyaWVzLmJhcnMuc2hvdylcbiAgICAgICAgICAgICAgICAgICAgZHJhd0JhckhpZ2hsaWdodChoaS5zZXJpZXMsIGhpLnBvaW50KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRyYXdQb2ludEhpZ2hsaWdodChoaS5zZXJpZXMsIGhpLnBvaW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9jdHgucmVzdG9yZSgpO1xuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MuZHJhd092ZXJsYXksIFtvY3R4XSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHQocywgcG9pbnQsIGF1dG8pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcyA9PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbc107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcG9pbnQgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHZhciBwcyA9IHMuZGF0YXBvaW50cy5wb2ludHNpemU7XG4gICAgICAgICAgICAgICAgcG9pbnQgPSBzLmRhdGFwb2ludHMucG9pbnRzLnNsaWNlKHBzICogcG9pbnQsIHBzICogKHBvaW50ICsgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaSA9IGluZGV4T2ZIaWdobGlnaHQocywgcG9pbnQpO1xuICAgICAgICAgICAgaWYgKGkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRzLnB1c2goeyBzZXJpZXM6IHMsIHBvaW50OiBwb2ludCwgYXV0bzogYXV0byB9KTtcblxuICAgICAgICAgICAgICAgIHRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghYXV0bylcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRzW2ldLmF1dG8gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVuaGlnaGxpZ2h0KHMsIHBvaW50KSB7XG4gICAgICAgICAgICBpZiAocyA9PSBudWxsICYmIHBvaW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRzID0gW107XG4gICAgICAgICAgICAgICAgdHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcyA9PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbc107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcG9pbnQgPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHZhciBwcyA9IHMuZGF0YXBvaW50cy5wb2ludHNpemU7XG4gICAgICAgICAgICAgICAgcG9pbnQgPSBzLmRhdGFwb2ludHMucG9pbnRzLnNsaWNlKHBzICogcG9pbnQsIHBzICogKHBvaW50ICsgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaSA9IGluZGV4T2ZIaWdobGlnaHQocywgcG9pbnQpO1xuICAgICAgICAgICAgaWYgKGkgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRzLnNwbGljZShpLCAxKTtcblxuICAgICAgICAgICAgICAgIHRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbmRleE9mSGlnaGxpZ2h0KHMsIHApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGlnaGxpZ2h0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBoID0gaGlnaGxpZ2h0c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoaC5zZXJpZXMgPT0gcyAmJiBoLnBvaW50WzBdID09IHBbMF1cbiAgICAgICAgICAgICAgICAgICAgJiYgaC5wb2ludFsxXSA9PSBwWzFdKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdQb2ludEhpZ2hsaWdodChzZXJpZXMsIHBvaW50KSB7XG4gICAgICAgICAgICB2YXIgeCA9IHBvaW50WzBdLCB5ID0gcG9pbnRbMV0sXG4gICAgICAgICAgICAgICAgYXhpc3ggPSBzZXJpZXMueGF4aXMsIGF4aXN5ID0gc2VyaWVzLnlheGlzLFxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodENvbG9yID0gKHR5cGVvZiBzZXJpZXMuaGlnaGxpZ2h0Q29sb3IgPT09IFwic3RyaW5nXCIpID8gc2VyaWVzLmhpZ2hsaWdodENvbG9yIDogJC5jb2xvci5wYXJzZShzZXJpZXMuY29sb3IpLnNjYWxlKCdhJywgMC41KS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBpZiAoeCA8IGF4aXN4Lm1pbiB8fCB4ID4gYXhpc3gubWF4IHx8IHkgPCBheGlzeS5taW4gfHwgeSA+IGF4aXN5Lm1heClcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBwb2ludFJhZGl1cyA9IHNlcmllcy5wb2ludHMucmFkaXVzICsgc2VyaWVzLnBvaW50cy5saW5lV2lkdGggLyAyO1xuICAgICAgICAgICAgb2N0eC5saW5lV2lkdGggPSBwb2ludFJhZGl1cztcbiAgICAgICAgICAgIG9jdHguc3Ryb2tlU3R5bGUgPSBoaWdobGlnaHRDb2xvcjtcbiAgICAgICAgICAgIHZhciByYWRpdXMgPSAxLjUgKiBwb2ludFJhZGl1cztcbiAgICAgICAgICAgIHggPSBheGlzeC5wMmMoeCk7XG4gICAgICAgICAgICB5ID0gYXhpc3kucDJjKHkpO1xuXG4gICAgICAgICAgICBvY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgaWYgKHNlcmllcy5wb2ludHMuc3ltYm9sID09IFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgb2N0eC5hcmMoeCwgeSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlcmllcy5wb2ludHMuc3ltYm9sKG9jdHgsIHgsIHksIHJhZGl1cywgZmFsc2UpO1xuICAgICAgICAgICAgb2N0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIG9jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3QmFySGlnaGxpZ2h0KHNlcmllcywgcG9pbnQpIHtcbiAgICAgICAgICAgIHZhciBoaWdobGlnaHRDb2xvciA9ICh0eXBlb2Ygc2VyaWVzLmhpZ2hsaWdodENvbG9yID09PSBcInN0cmluZ1wiKSA/IHNlcmllcy5oaWdobGlnaHRDb2xvciA6ICQuY29sb3IucGFyc2Uoc2VyaWVzLmNvbG9yKS5zY2FsZSgnYScsIDAuNSkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBmaWxsU3R5bGUgPSBoaWdobGlnaHRDb2xvcixcbiAgICAgICAgICAgICAgICBiYXJMZWZ0O1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHNlcmllcy5iYXJzLmFsaWduKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gLXNlcmllcy5iYXJzLmJhcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gLXNlcmllcy5iYXJzLmJhcldpZHRoIC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb2N0eC5saW5lV2lkdGggPSBzZXJpZXMuYmFycy5saW5lV2lkdGg7XG4gICAgICAgICAgICBvY3R4LnN0cm9rZVN0eWxlID0gaGlnaGxpZ2h0Q29sb3I7XG5cbiAgICAgICAgICAgIGRyYXdCYXIocG9pbnRbMF0sIHBvaW50WzFdLCBwb2ludFsyXSB8fCAwLCBiYXJMZWZ0LCBiYXJMZWZ0ICsgc2VyaWVzLmJhcnMuYmFyV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZpbGxTdHlsZTsgfSwgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMsIG9jdHgsIHNlcmllcy5iYXJzLmhvcml6b250YWwsIHNlcmllcy5iYXJzLmxpbmVXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRDb2xvck9yR3JhZGllbnQoc3BlYywgYm90dG9tLCB0b3AsIGRlZmF1bHRDb2xvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGVjID09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwZWM7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBhc3N1bWUgdGhpcyBpcyBhIGdyYWRpZW50IHNwZWM7IElFIGN1cnJlbnRseSBvbmx5XG4gICAgICAgICAgICAgICAgLy8gc3VwcG9ydHMgYSBzaW1wbGUgdmVydGljYWwgZ3JhZGllbnQgcHJvcGVybHksIHNvIHRoYXQnc1xuICAgICAgICAgICAgICAgIC8vIHdoYXQgd2Ugc3VwcG9ydCB0b29cbiAgICAgICAgICAgICAgICB2YXIgZ3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgdG9wLCAwLCBib3R0b20pO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBzcGVjLmNvbG9ycy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBzcGVjLmNvbG9yc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjICE9IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbyA9ICQuY29sb3IucGFyc2UoZGVmYXVsdENvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjLmJyaWdodG5lc3MgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbyA9IGNvLnNjYWxlKCdyZ2InLCBjLmJyaWdodG5lc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMub3BhY2l0eSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvLmEgKj0gYy5vcGFjaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGNvLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKGkgLyAobCAtIDEpLCBjKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JhZGllbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIHBsb3QgZnVuY3Rpb24gdG8gdGhlIHRvcCBsZXZlbCBvZiB0aGUgalF1ZXJ5IG9iamVjdFxuXG4gICAgJC5wbG90ID0gZnVuY3Rpb24ocGxhY2Vob2xkZXIsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgLy92YXIgdDAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgcGxvdCA9IG5ldyBQbG90KCQocGxhY2Vob2xkZXIpLCBkYXRhLCBvcHRpb25zLCAkLnBsb3QucGx1Z2lucyk7XG4gICAgICAgIC8vKHdpbmRvdy5jb25zb2xlID8gY29uc29sZS5sb2cgOiBhbGVydCkoXCJ0aW1lIHVzZWQgKG1zZWNzKTogXCIgKyAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAtIHQwLmdldFRpbWUoKSkpO1xuICAgICAgICByZXR1cm4gcGxvdDtcbiAgICB9O1xuXG4gICAgJC5wbG90LnZlcnNpb24gPSBcIjAuOC4zXCI7XG5cbiAgICAkLnBsb3QucGx1Z2lucyA9IFtdO1xuXG4gICAgLy8gQWxzbyBhZGQgdGhlIHBsb3QgZnVuY3Rpb24gYXMgYSBjaGFpbmFibGUgcHJvcGVydHlcblxuICAgICQuZm4ucGxvdCA9IGZ1bmN0aW9uKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQucGxvdCh0aGlzLCBkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIHJvdW5kIHRvIG5lYXJieSBsb3dlciBtdWx0aXBsZSBvZiBiYXNlXG4gICAgZnVuY3Rpb24gZmxvb3JJbkJhc2UobiwgYmFzZSkge1xuICAgICAgICByZXR1cm4gYmFzZSAqIE1hdGguZmxvb3IobiAvIGJhc2UpO1xuICAgIH1cblxufSkoalF1ZXJ5KTtcbiIsIi8qIEZsb3QgcGx1Z2luIGZvciByZW5kZXJpbmcgcGllIGNoYXJ0cy5cblxuQ29weXJpZ2h0IChjKSAyMDA3LTIwMTQgSU9MQSBhbmQgT2xlIExhdXJzZW4uXG5MaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cblRoZSBwbHVnaW4gYXNzdW1lcyB0aGF0IGVhY2ggc2VyaWVzIGhhcyBhIHNpbmdsZSBkYXRhIHZhbHVlLCBhbmQgdGhhdCBlYWNoXG52YWx1ZSBpcyBhIHBvc2l0aXZlIGludGVnZXIgb3IgemVyby4gIE5lZ2F0aXZlIG51bWJlcnMgZG9uJ3QgbWFrZSBzZW5zZSBmb3IgYVxucGllIGNoYXJ0LCBhbmQgaGF2ZSB1bnByZWRpY3RhYmxlIHJlc3VsdHMuICBUaGUgdmFsdWVzIGRvIE5PVCBuZWVkIHRvIGJlXG5wYXNzZWQgaW4gYXMgcGVyY2VudGFnZXM7IHRoZSBwbHVnaW4gd2lsbCBjYWxjdWxhdGUgdGhlIHRvdGFsIGFuZCBwZXItc2xpY2VcbnBlcmNlbnRhZ2VzIGludGVybmFsbHkuXG5cbiogQ3JlYXRlZCBieSBCcmlhbiBNZWRlbmRvcnBcblxuKiBVcGRhdGVkIHdpdGggY29udHJpYnV0aW9ucyBmcm9tIGJ0YnVybmV0dDMsIEFudGhvbnkgQXJhZ3VlcyBhbmQgWGF2aSBJdmFyc1xuXG5UaGUgcGx1Z2luIHN1cHBvcnRzIHRoZXNlIG9wdGlvbnM6XG5cblx0c2VyaWVzOiB7XG5cdFx0cGllOiB7XG5cdFx0XHRzaG93OiB0cnVlL2ZhbHNlXG5cdFx0XHRyYWRpdXM6IDAtMSBmb3IgcGVyY2VudGFnZSBvZiBmdWxsc2l6ZSwgb3IgYSBzcGVjaWZpZWQgcGl4ZWwgbGVuZ3RoLCBvciAnYXV0bydcblx0XHRcdGlubmVyUmFkaXVzOiAwLTEgZm9yIHBlcmNlbnRhZ2Ugb2YgZnVsbHNpemUgb3IgYSBzcGVjaWZpZWQgcGl4ZWwgbGVuZ3RoLCBmb3IgY3JlYXRpbmcgYSBkb251dCBlZmZlY3Rcblx0XHRcdHN0YXJ0QW5nbGU6IDAtMiBmYWN0b3Igb2YgUEkgdXNlZCBmb3Igc3RhcnRpbmcgYW5nbGUgKGluIHJhZGlhbnMpIGkuZSAzLzIgc3RhcnRzIGF0IHRoZSB0b3AsIDAgYW5kIDIgaGF2ZSB0aGUgc2FtZSByZXN1bHRcblx0XHRcdHRpbHQ6IDAtMSBmb3IgcGVyY2VudGFnZSB0byB0aWx0IHRoZSBwaWUsIHdoZXJlIDEgaXMgbm8gdGlsdCwgYW5kIDAgaXMgY29tcGxldGVseSBmbGF0IChub3RoaW5nIHdpbGwgc2hvdylcblx0XHRcdG9mZnNldDoge1xuXHRcdFx0XHR0b3A6IGludGVnZXIgdmFsdWUgdG8gbW92ZSB0aGUgcGllIHVwIG9yIGRvd25cblx0XHRcdFx0bGVmdDogaW50ZWdlciB2YWx1ZSB0byBtb3ZlIHRoZSBwaWUgbGVmdCBvciByaWdodCwgb3IgJ2F1dG8nXG5cdFx0XHR9LFxuXHRcdFx0c3Ryb2tlOiB7XG5cdFx0XHRcdGNvbG9yOiBhbnkgaGV4aWRlY2ltYWwgY29sb3IgdmFsdWUgKG90aGVyIGZvcm1hdHMgbWF5IG9yIG1heSBub3Qgd29yaywgc28gYmVzdCB0byBzdGljayB3aXRoIHNvbWV0aGluZyBsaWtlICcjRkZGJylcblx0XHRcdFx0d2lkdGg6IGludGVnZXIgcGl4ZWwgd2lkdGggb2YgdGhlIHN0cm9rZVxuXHRcdFx0fSxcblx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdHNob3c6IHRydWUvZmFsc2UsIG9yICdhdXRvJ1xuXHRcdFx0XHRmb3JtYXR0ZXI6ICBhIHVzZXItZGVmaW5lZCBmdW5jdGlvbiB0aGF0IG1vZGlmaWVzIHRoZSB0ZXh0L3N0eWxlIG9mIHRoZSBsYWJlbCB0ZXh0XG5cdFx0XHRcdHJhZGl1czogMC0xIGZvciBwZXJjZW50YWdlIG9mIGZ1bGxzaXplLCBvciBhIHNwZWNpZmllZCBwaXhlbCBsZW5ndGhcblx0XHRcdFx0YmFja2dyb3VuZDoge1xuXHRcdFx0XHRcdGNvbG9yOiBhbnkgaGV4aWRlY2ltYWwgY29sb3IgdmFsdWUgKG90aGVyIGZvcm1hdHMgbWF5IG9yIG1heSBub3Qgd29yaywgc28gYmVzdCB0byBzdGljayB3aXRoIHNvbWV0aGluZyBsaWtlICcjMDAwJylcblx0XHRcdFx0XHRvcGFjaXR5OiAwLTFcblx0XHRcdFx0fSxcblx0XHRcdFx0dGhyZXNob2xkOiAwLTEgZm9yIHRoZSBwZXJjZW50YWdlIHZhbHVlIGF0IHdoaWNoIHRvIGhpZGUgbGFiZWxzIChpZiB0aGV5J3JlIHRvbyBzbWFsbClcblx0XHRcdH0sXG5cdFx0XHRjb21iaW5lOiB7XG5cdFx0XHRcdHRocmVzaG9sZDogMC0xIGZvciB0aGUgcGVyY2VudGFnZSB2YWx1ZSBhdCB3aGljaCB0byBjb21iaW5lIHNsaWNlcyAoaWYgdGhleSdyZSB0b28gc21hbGwpXG5cdFx0XHRcdGNvbG9yOiBhbnkgaGV4aWRlY2ltYWwgY29sb3IgdmFsdWUgKG90aGVyIGZvcm1hdHMgbWF5IG9yIG1heSBub3Qgd29yaywgc28gYmVzdCB0byBzdGljayB3aXRoIHNvbWV0aGluZyBsaWtlICcjQ0NDJyksIGlmIG51bGwsIHRoZSBwbHVnaW4gd2lsbCBhdXRvbWF0aWNhbGx5IHVzZSB0aGUgY29sb3Igb2YgdGhlIGZpcnN0IHNsaWNlIHRvIGJlIGNvbWJpbmVkXG5cdFx0XHRcdGxhYmVsOiBhbnkgdGV4dCB2YWx1ZSBvZiB3aGF0IHRoZSBjb21iaW5lZCBzbGljZSBzaG91bGQgYmUgbGFiZWxlZFxuXHRcdFx0fVxuXHRcdFx0aGlnaGxpZ2h0OiB7XG5cdFx0XHRcdG9wYWNpdHk6IDAtMVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5Nb3JlIGRldGFpbCBhbmQgc3BlY2lmaWMgZXhhbXBsZXMgY2FuIGJlIGZvdW5kIGluIHRoZSBpbmNsdWRlZCBIVE1MIGZpbGUuXG5cbiovXG5cbihmdW5jdGlvbigkKSB7XG5cblx0Ly8gTWF4aW11bSByZWRyYXcgYXR0ZW1wdHMgd2hlbiBmaXR0aW5nIGxhYmVscyB3aXRoaW4gdGhlIHBsb3RcblxuXHR2YXIgUkVEUkFXX0FUVEVNUFRTID0gMTA7XG5cblx0Ly8gRmFjdG9yIGJ5IHdoaWNoIHRvIHNocmluayB0aGUgcGllIHdoZW4gZml0dGluZyBsYWJlbHMgd2l0aGluIHRoZSBwbG90XG5cblx0dmFyIFJFRFJBV19TSFJJTksgPSAwLjk1O1xuXG5cdGZ1bmN0aW9uIGluaXQocGxvdCkge1xuXG5cdFx0dmFyIGNhbnZhcyA9IG51bGwsXG5cdFx0XHR0YXJnZXQgPSBudWxsLFxuXHRcdFx0b3B0aW9ucyA9IG51bGwsXG5cdFx0XHRtYXhSYWRpdXMgPSBudWxsLFxuXHRcdFx0Y2VudGVyTGVmdCA9IG51bGwsXG5cdFx0XHRjZW50ZXJUb3AgPSBudWxsLFxuXHRcdFx0cHJvY2Vzc2VkID0gZmFsc2UsXG5cdFx0XHRjdHggPSBudWxsO1xuXG5cdFx0Ly8gaW50ZXJhY3RpdmUgdmFyaWFibGVzXG5cblx0XHR2YXIgaGlnaGxpZ2h0cyA9IFtdO1xuXG5cdFx0Ly8gYWRkIGhvb2sgdG8gZGV0ZXJtaW5lIGlmIHBpZSBwbHVnaW4gaW4gZW5hYmxlZCwgYW5kIHRoZW4gcGVyZm9ybSBuZWNlc3Nhcnkgb3BlcmF0aW9uc1xuXG5cdFx0cGxvdC5ob29rcy5wcm9jZXNzT3B0aW9ucy5wdXNoKGZ1bmN0aW9uKHBsb3QsIG9wdGlvbnMpIHtcblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuc2hvdykge1xuXG5cdFx0XHRcdG9wdGlvbnMuZ3JpZC5zaG93ID0gZmFsc2U7XG5cblx0XHRcdFx0Ly8gc2V0IGxhYmVscy5zaG93XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5zaG93ID09IFwiYXV0b1wiKSB7XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMubGVnZW5kLnNob3cpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5zaG93ID0gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5zaG93ID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzZXQgcmFkaXVzXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnNob3cpIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPSAzLzQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPSAxO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGVuc3VyZSBzYW5lIHRpbHRcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnRpbHQgPiAxKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5zZXJpZXMucGllLnRpbHQgPSAxO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0IDwgMCkge1xuXHRcdFx0XHRcdG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cGxvdC5ob29rcy5iaW5kRXZlbnRzLnB1c2goZnVuY3Rpb24ocGxvdCwgZXZlbnRIb2xkZXIpIHtcblx0XHRcdHZhciBvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCk7XG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnNob3cpIHtcblx0XHRcdFx0aWYgKG9wdGlvbnMuZ3JpZC5ob3ZlcmFibGUpIHtcblx0XHRcdFx0XHRldmVudEhvbGRlci51bmJpbmQoXCJtb3VzZW1vdmVcIikubW91c2Vtb3ZlKG9uTW91c2VNb3ZlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob3B0aW9ucy5ncmlkLmNsaWNrYWJsZSkge1xuXHRcdFx0XHRcdGV2ZW50SG9sZGVyLnVuYmluZChcImNsaWNrXCIpLmNsaWNrKG9uQ2xpY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRwbG90Lmhvb2tzLnByb2Nlc3NEYXRhcG9pbnRzLnB1c2goZnVuY3Rpb24ocGxvdCwgc2VyaWVzLCBkYXRhLCBkYXRhcG9pbnRzKSB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpO1xuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5zaG93KSB7XG5cdFx0XHRcdHByb2Nlc3NEYXRhcG9pbnRzKHBsb3QsIHNlcmllcywgZGF0YSwgZGF0YXBvaW50cyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRwbG90Lmhvb2tzLmRyYXdPdmVybGF5LnB1c2goZnVuY3Rpb24ocGxvdCwgb2N0eCkge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKTtcblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuc2hvdykge1xuXHRcdFx0XHRkcmF3T3ZlcmxheShwbG90LCBvY3R4KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHBsb3QuaG9va3MuZHJhdy5wdXNoKGZ1bmN0aW9uKHBsb3QsIG5ld0N0eCkge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKTtcblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuc2hvdykge1xuXHRcdFx0XHRkcmF3KHBsb3QsIG5ld0N0eCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmdW5jdGlvbiBwcm9jZXNzRGF0YXBvaW50cyhwbG90LCBzZXJpZXMsIGRhdGFwb2ludHMpIHtcblx0XHRcdGlmICghcHJvY2Vzc2VkKVx0e1xuXHRcdFx0XHRwcm9jZXNzZWQgPSB0cnVlO1xuXHRcdFx0XHRjYW52YXMgPSBwbG90LmdldENhbnZhcygpO1xuXHRcdFx0XHR0YXJnZXQgPSAkKGNhbnZhcykucGFyZW50KCk7XG5cdFx0XHRcdG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKTtcblx0XHRcdFx0cGxvdC5zZXREYXRhKGNvbWJpbmUocGxvdC5nZXREYXRhKCkpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjb21iaW5lKGRhdGEpIHtcblxuXHRcdFx0dmFyIHRvdGFsID0gMCxcblx0XHRcdFx0Y29tYmluZWQgPSAwLFxuXHRcdFx0XHRudW1Db21iaW5lZCA9IDAsXG5cdFx0XHRcdGNvbG9yID0gb3B0aW9ucy5zZXJpZXMucGllLmNvbWJpbmUuY29sb3IsXG5cdFx0XHRcdG5ld2RhdGEgPSBbXTtcblxuXHRcdFx0Ly8gRml4IHVwIHRoZSByYXcgZGF0YSBmcm9tIEZsb3QsIGVuc3VyaW5nIHRoZSBkYXRhIGlzIG51bWVyaWNcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG5cblx0XHRcdFx0dmFyIHZhbHVlID0gZGF0YVtpXS5kYXRhO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBkYXRhIGlzIGFuIGFycmF5LCB3ZSdsbCBhc3N1bWUgdGhhdCBpdCdzIGEgc3RhbmRhcmRcblx0XHRcdFx0Ly8gRmxvdCB4LXkgcGFpciwgYW5kIGFyZSBjb25jZXJuZWQgb25seSB3aXRoIHRoZSBzZWNvbmQgdmFsdWUuXG5cblx0XHRcdFx0Ly8gTm90ZSBob3cgd2UgdXNlIHRoZSBvcmlnaW5hbCBhcnJheSwgcmF0aGVyIHRoYW4gY3JlYXRpbmcgYVxuXHRcdFx0XHQvLyBuZXcgb25lOyB0aGlzIGlzIG1vcmUgZWZmaWNpZW50IGFuZCBwcmVzZXJ2ZXMgYW55IGV4dHJhIGRhdGFcblx0XHRcdFx0Ly8gdGhhdCB0aGUgdXNlciBtYXkgaGF2ZSBzdG9yZWQgaW4gaGlnaGVyIGluZGV4ZXMuXG5cblx0XHRcdFx0aWYgKCQuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09IDEpIHtcbiAgICBcdFx0XHRcdHZhbHVlID0gdmFsdWVbMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoJC5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRcdC8vIEVxdWl2YWxlbnQgdG8gJC5pc051bWVyaWMoKSBidXQgY29tcGF0aWJsZSB3aXRoIGpRdWVyeSA8IDEuN1xuXHRcdFx0XHRcdGlmICghaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZVsxXSkpICYmIGlzRmluaXRlKHZhbHVlWzFdKSkge1xuXHRcdFx0XHRcdFx0dmFsdWVbMV0gPSArdmFsdWVbMV07XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHZhbHVlWzFdID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSkpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IFsxLCArdmFsdWVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gWzEsIDBdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGF0YVtpXS5kYXRhID0gW3ZhbHVlXTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VtIHVwIGFsbCB0aGUgc2xpY2VzLCBzbyB3ZSBjYW4gY2FsY3VsYXRlIHBlcmNlbnRhZ2VzIGZvciBlYWNoXG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHR0b3RhbCArPSBkYXRhW2ldLmRhdGFbMF1bMV07XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvdW50IHRoZSBudW1iZXIgb2Ygc2xpY2VzIHdpdGggcGVyY2VudGFnZXMgYmVsb3cgdGhlIGNvbWJpbmVcblx0XHRcdC8vIHRocmVzaG9sZDsgaWYgaXQgdHVybnMgb3V0IHRvIGJlIGp1c3Qgb25lLCB3ZSB3b24ndCBjb21iaW5lLlxuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gZGF0YVtpXS5kYXRhWzBdWzFdO1xuXHRcdFx0XHRpZiAodmFsdWUgLyB0b3RhbCA8PSBvcHRpb25zLnNlcmllcy5waWUuY29tYmluZS50aHJlc2hvbGQpIHtcblx0XHRcdFx0XHRjb21iaW5lZCArPSB2YWx1ZTtcblx0XHRcdFx0XHRudW1Db21iaW5lZCsrO1xuXHRcdFx0XHRcdGlmICghY29sb3IpIHtcblx0XHRcdFx0XHRcdGNvbG9yID0gZGF0YVtpXS5jb2xvcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IGRhdGFbaV0uZGF0YVswXVsxXTtcblx0XHRcdFx0aWYgKG51bUNvbWJpbmVkIDwgMiB8fCB2YWx1ZSAvIHRvdGFsID4gb3B0aW9ucy5zZXJpZXMucGllLmNvbWJpbmUudGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0bmV3ZGF0YS5wdXNoKFxuXHRcdFx0XHRcdFx0JC5leHRlbmQoZGF0YVtpXSwgeyAgICAgLyogZXh0ZW5kIHRvIGFsbG93IGtlZXBpbmcgYWxsIG90aGVyIG9yaWdpbmFsIGRhdGEgdmFsdWVzXG5cdFx0XHRcdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgdXNpbmcgdGhlbSBlLmcuIGluIGxhYmVsRm9ybWF0dGVyLiAqL1xuXHRcdFx0XHRcdFx0XHRkYXRhOiBbWzEsIHZhbHVlXV0sXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiBkYXRhW2ldLmNvbG9yLFxuXHRcdFx0XHRcdFx0XHRsYWJlbDogZGF0YVtpXS5sYWJlbCxcblx0XHRcdFx0XHRcdFx0YW5nbGU6IHZhbHVlICogTWF0aC5QSSAqIDIgLyB0b3RhbCxcblx0XHRcdFx0XHRcdFx0cGVyY2VudDogdmFsdWUgLyAodG90YWwgLyAxMDApXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG51bUNvbWJpbmVkID4gMSkge1xuXHRcdFx0XHRuZXdkYXRhLnB1c2goe1xuXHRcdFx0XHRcdGRhdGE6IFtbMSwgY29tYmluZWRdXSxcblx0XHRcdFx0XHRjb2xvcjogY29sb3IsXG5cdFx0XHRcdFx0bGFiZWw6IG9wdGlvbnMuc2VyaWVzLnBpZS5jb21iaW5lLmxhYmVsLFxuXHRcdFx0XHRcdGFuZ2xlOiBjb21iaW5lZCAqIE1hdGguUEkgKiAyIC8gdG90YWwsXG5cdFx0XHRcdFx0cGVyY2VudDogY29tYmluZWQgLyAodG90YWwgLyAxMDApXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbmV3ZGF0YTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkcmF3KHBsb3QsIG5ld0N0eCkge1xuXG5cdFx0XHRpZiAoIXRhcmdldCkge1xuXHRcdFx0XHRyZXR1cm47IC8vIGlmIG5vIHNlcmllcyB3ZXJlIHBhc3NlZFxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgY2FudmFzV2lkdGggPSBwbG90LmdldFBsYWNlaG9sZGVyKCkud2lkdGgoKSxcblx0XHRcdFx0Y2FudmFzSGVpZ2h0ID0gcGxvdC5nZXRQbGFjZWhvbGRlcigpLmhlaWdodCgpLFxuXHRcdFx0XHRsZWdlbmRXaWR0aCA9IHRhcmdldC5jaGlsZHJlbigpLmZpbHRlcihcIi5sZWdlbmRcIikuY2hpbGRyZW4oKS53aWR0aCgpIHx8IDA7XG5cblx0XHRcdGN0eCA9IG5ld0N0eDtcblxuXHRcdFx0Ly8gV0FSTklORzogSEFDSyEgUkVXUklURSBUSElTIENPREUgQVMgU09PTiBBUyBQT1NTSUJMRSFcblxuXHRcdFx0Ly8gV2hlbiBjb21iaW5pbmcgc21hbGxlciBzbGljZXMgaW50byBhbiAnb3RoZXInIHNsaWNlLCB3ZSBuZWVkIHRvXG5cdFx0XHQvLyBhZGQgYSBuZXcgc2VyaWVzLiAgU2luY2UgRmxvdCBnaXZlcyBwbHVnaW5zIG5vIHdheSB0byBtb2RpZnkgdGhlXG5cdFx0XHQvLyBsaXN0IG9mIHNlcmllcywgdGhlIHBpZSBwbHVnaW4gdXNlcyBhIGhhY2sgd2hlcmUgdGhlIGZpcnN0IGNhbGxcblx0XHRcdC8vIHRvIHByb2Nlc3NEYXRhcG9pbnRzIHJlc3VsdHMgaW4gYSBjYWxsIHRvIHNldERhdGEgd2l0aCB0aGUgbmV3XG5cdFx0XHQvLyBsaXN0IG9mIHNlcmllcywgdGhlbiBzdWJzZXF1ZW50IHByb2Nlc3NEYXRhcG9pbnRzIGRvIG5vdGhpbmcuXG5cblx0XHRcdC8vIFRoZSBwbHVnaW4tZ2xvYmFsICdwcm9jZXNzZWQnIGZsYWcgaXMgdXNlZCB0byBjb250cm9sIHRoaXMgaGFjaztcblx0XHRcdC8vIGl0IHN0YXJ0cyBvdXQgZmFsc2UsIGFuZCBpcyBzZXQgdG8gdHJ1ZSBhZnRlciB0aGUgZmlyc3QgY2FsbCB0b1xuXHRcdFx0Ly8gcHJvY2Vzc0RhdGFwb2ludHMuXG5cblx0XHRcdC8vIFVuZm9ydHVuYXRlbHkgdGhpcyB0dXJucyBmdXR1cmUgc2V0RGF0YSBjYWxscyBpbnRvIG5vLW9wczsgdGhleVxuXHRcdFx0Ly8gY2FsbCBwcm9jZXNzRGF0YXBvaW50cywgdGhlIGZsYWcgaXMgdHJ1ZSwgYW5kIG5vdGhpbmcgaGFwcGVucy5cblxuXHRcdFx0Ly8gVG8gZml4IHRoaXMgd2UnbGwgc2V0IHRoZSBmbGFnIGJhY2sgdG8gZmFsc2UgaGVyZSBpbiBkcmF3LCB3aGVuXG5cdFx0XHQvLyBhbGwgc2VyaWVzIGhhdmUgYmVlbiBwcm9jZXNzZWQsIHNvIHRoZSBuZXh0IHNlcXVlbmNlIG9mIGNhbGxzIHRvXG5cdFx0XHQvLyBwcm9jZXNzRGF0YXBvaW50cyBvbmNlIGFnYWluIHN0YXJ0cyBvdXQgd2l0aCBhIHNsaWNlLWNvbWJpbmUuXG5cdFx0XHQvLyBUaGlzIGlzIHJlYWxseSBhIGhhY2s7IGluIDAuOSB3ZSBuZWVkIHRvIGdpdmUgcGx1Z2lucyBhIHByb3BlclxuXHRcdFx0Ly8gd2F5IHRvIG1vZGlmeSBzZXJpZXMgYmVmb3JlIGFueSBwcm9jZXNzaW5nIGJlZ2lucy5cblxuXHRcdFx0cHJvY2Vzc2VkID0gZmFsc2U7XG5cblx0XHRcdC8vIGNhbGN1bGF0ZSBtYXhpbXVtIHJhZGl1cyBhbmQgY2VudGVyIHBvaW50XG5cblx0XHRcdG1heFJhZGl1cyA9ICBNYXRoLm1pbihjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0IC8gb3B0aW9ucy5zZXJpZXMucGllLnRpbHQpIC8gMjtcblx0XHRcdGNlbnRlclRvcCA9IGNhbnZhc0hlaWdodCAvIDIgKyBvcHRpb25zLnNlcmllcy5waWUub2Zmc2V0LnRvcDtcblx0XHRcdGNlbnRlckxlZnQgPSBjYW52YXNXaWR0aCAvIDI7XG5cblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUub2Zmc2V0LmxlZnQgPT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0aWYgKG9wdGlvbnMubGVnZW5kLnBvc2l0aW9uLm1hdGNoKFwid1wiKSkge1xuXHRcdFx0XHRcdGNlbnRlckxlZnQgKz0gbGVnZW5kV2lkdGggLyAyO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNlbnRlckxlZnQgLT0gbGVnZW5kV2lkdGggLyAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjZW50ZXJMZWZ0IDwgbWF4UmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2VudGVyTGVmdCA9IG1heFJhZGl1cztcblx0XHRcdFx0fSBlbHNlIGlmIChjZW50ZXJMZWZ0ID4gY2FudmFzV2lkdGggLSBtYXhSYWRpdXMpIHtcblx0XHRcdFx0XHRjZW50ZXJMZWZ0ID0gY2FudmFzV2lkdGggLSBtYXhSYWRpdXM7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNlbnRlckxlZnQgKz0gb3B0aW9ucy5zZXJpZXMucGllLm9mZnNldC5sZWZ0O1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2xpY2VzID0gcGxvdC5nZXREYXRhKCksXG5cdFx0XHRcdGF0dGVtcHRzID0gMDtcblxuXHRcdFx0Ly8gS2VlcCBzaHJpbmtpbmcgdGhlIHBpZSdzIHJhZGl1cyB1bnRpbCBkcmF3UGllIHJldHVybnMgdHJ1ZSxcblx0XHRcdC8vIGluZGljYXRpbmcgdGhhdCBhbGwgdGhlIGxhYmVscyBmaXQsIG9yIHdlIHRyeSB0b28gbWFueSB0aW1lcy5cblxuXHRcdFx0ZG8ge1xuXHRcdFx0XHRpZiAoYXR0ZW1wdHMgPiAwKSB7XG5cdFx0XHRcdFx0bWF4UmFkaXVzICo9IFJFRFJBV19TSFJJTks7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXR0ZW1wdHMgKz0gMTtcblx0XHRcdFx0Y2xlYXIoKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0IDw9IDAuOCkge1xuXHRcdFx0XHRcdGRyYXdTaGFkb3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fSB3aGlsZSAoIWRyYXdQaWUoKSAmJiBhdHRlbXB0cyA8IFJFRFJBV19BVFRFTVBUUylcblxuXHRcdFx0aWYgKGF0dGVtcHRzID49IFJFRFJBV19BVFRFTVBUUykge1xuXHRcdFx0XHRjbGVhcigpO1xuXHRcdFx0XHR0YXJnZXQucHJlcGVuZChcIjxkaXYgY2xhc3M9J2Vycm9yJz5Db3VsZCBub3QgZHJhdyBwaWUgd2l0aCBsYWJlbHMgY29udGFpbmVkIGluc2lkZSBjYW52YXM8L2Rpdj5cIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChwbG90LnNldFNlcmllcyAmJiBwbG90Lmluc2VydExlZ2VuZCkge1xuXHRcdFx0XHRwbG90LnNldFNlcmllcyhzbGljZXMpO1xuXHRcdFx0XHRwbG90Lmluc2VydExlZ2VuZCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB3ZSdyZSBhY3R1YWxseSBkb25lIGF0IHRoaXMgcG9pbnQsIGp1c3QgZGVmaW5pbmcgaW50ZXJuYWwgZnVuY3Rpb25zIGF0IHRoaXMgcG9pbnRcblxuXHRcdFx0ZnVuY3Rpb24gY2xlYXIoKSB7XG5cdFx0XHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5cdFx0XHRcdHRhcmdldC5jaGlsZHJlbigpLmZpbHRlcihcIi5waWVMYWJlbCwgLnBpZUxhYmVsQmFja2dyb3VuZFwiKS5yZW1vdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZHJhd1NoYWRvdygpIHtcblxuXHRcdFx0XHR2YXIgc2hhZG93TGVmdCA9IG9wdGlvbnMuc2VyaWVzLnBpZS5zaGFkb3cubGVmdDtcblx0XHRcdFx0dmFyIHNoYWRvd1RvcCA9IG9wdGlvbnMuc2VyaWVzLnBpZS5zaGFkb3cudG9wO1xuXHRcdFx0XHR2YXIgZWRnZSA9IDEwO1xuXHRcdFx0XHR2YXIgYWxwaGEgPSBvcHRpb25zLnNlcmllcy5waWUuc2hhZG93LmFscGhhO1xuXHRcdFx0XHR2YXIgcmFkaXVzID0gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA+IDEgPyBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzIDogbWF4UmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cztcblxuXHRcdFx0XHRpZiAocmFkaXVzID49IGNhbnZhc1dpZHRoIC8gMiAtIHNoYWRvd0xlZnQgfHwgcmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLnRpbHQgPj0gY2FudmFzSGVpZ2h0IC8gMiAtIHNoYWRvd1RvcCB8fCByYWRpdXMgPD0gZWRnZSkge1xuXHRcdFx0XHRcdHJldHVybjtcdC8vIHNoYWRvdyB3b3VsZCBiZSBvdXRzaWRlIGNhbnZhcywgc28gZG9uJ3QgZHJhdyBpdFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShzaGFkb3dMZWZ0LHNoYWRvd1RvcCk7XG5cdFx0XHRcdGN0eC5nbG9iYWxBbHBoYSA9IGFscGhhO1xuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gXCIjMDAwXCI7XG5cblx0XHRcdFx0Ly8gY2VudGVyIGFuZCByb3RhdGUgdG8gc3RhcnRpbmcgcG9zaXRpb25cblxuXHRcdFx0XHRjdHgudHJhbnNsYXRlKGNlbnRlckxlZnQsY2VudGVyVG9wKTtcblx0XHRcdFx0Y3R4LnNjYWxlKDEsIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0KTtcblxuXHRcdFx0XHQvL3JhZGl1cyAtPSBlZGdlO1xuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IGVkZ2U7IGkrKykge1xuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcblx0XHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRcdHJhZGl1cyAtPSBpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZHJhd1BpZSgpIHtcblxuXHRcdFx0XHR2YXIgc3RhcnRBbmdsZSA9IE1hdGguUEkgKiBvcHRpb25zLnNlcmllcy5waWUuc3RhcnRBbmdsZTtcblx0XHRcdFx0dmFyIHJhZGl1cyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPiAxID8gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA6IG1heFJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXM7XG5cblx0XHRcdFx0Ly8gY2VudGVyIGFuZCByb3RhdGUgdG8gc3RhcnRpbmcgcG9zaXRpb25cblxuXHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRjdHgudHJhbnNsYXRlKGNlbnRlckxlZnQsY2VudGVyVG9wKTtcblx0XHRcdFx0Y3R4LnNjYWxlKDEsIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0KTtcblx0XHRcdFx0Ly9jdHgucm90YXRlKHN0YXJ0QW5nbGUpOyAvLyBzdGFydCBhdCB0b3A7IC0tIFRoaXMgZG9lc24ndCB3b3JrIHByb3Blcmx5IGluIE9wZXJhXG5cblx0XHRcdFx0Ly8gZHJhdyBzbGljZXNcblxuXHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHR2YXIgY3VycmVudEFuZ2xlID0gc3RhcnRBbmdsZTtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHRzbGljZXNbaV0uc3RhcnRBbmdsZSA9IGN1cnJlbnRBbmdsZTtcblx0XHRcdFx0XHRkcmF3U2xpY2Uoc2xpY2VzW2ldLmFuZ2xlLCBzbGljZXNbaV0uY29sb3IsIHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cblx0XHRcdFx0Ly8gZHJhdyBzbGljZSBvdXRsaW5lc1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuc3Ryb2tlLndpZHRoID4gMCkge1xuXHRcdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdFx0Y3R4LmxpbmVXaWR0aCA9IG9wdGlvbnMuc2VyaWVzLnBpZS5zdHJva2Uud2lkdGg7XG5cdFx0XHRcdFx0Y3VycmVudEFuZ2xlID0gc3RhcnRBbmdsZTtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlcy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdFx0ZHJhd1NsaWNlKHNsaWNlc1tpXS5hbmdsZSwgb3B0aW9ucy5zZXJpZXMucGllLnN0cm9rZS5jb2xvciwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZHJhdyBkb251dCBob2xlXG5cblx0XHRcdFx0ZHJhd0RvbnV0SG9sZShjdHgpO1xuXG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cblx0XHRcdFx0Ly8gRHJhdyB0aGUgbGFiZWxzLCByZXR1cm5pbmcgdHJ1ZSBpZiB0aGV5IGZpdCB3aXRoaW4gdGhlIHBsb3RcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnNob3cpIHtcblx0XHRcdFx0XHRyZXR1cm4gZHJhd0xhYmVscygpO1xuXHRcdFx0XHR9IGVsc2UgcmV0dXJuIHRydWU7XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJhd1NsaWNlKGFuZ2xlLCBjb2xvciwgZmlsbCkge1xuXG5cdFx0XHRcdFx0aWYgKGFuZ2xlIDw9IDAgfHwgaXNOYU4oYW5nbGUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGZpbGwpIHtcblx0XHRcdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBjb2xvcjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XG5cdFx0XHRcdFx0XHRjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGlmIChNYXRoLmFicyhhbmdsZSAtIE1hdGguUEkgKiAyKSA+IDAuMDAwMDAwMDAxKSB7XG5cdFx0XHRcdFx0XHRjdHgubW92ZVRvKDAsIDApOyAvLyBDZW50ZXIgb2YgdGhlIHBpZVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vY3R4LmFyYygwLCAwLCByYWRpdXMsIDAsIGFuZ2xlLCBmYWxzZSk7IC8vIFRoaXMgZG9lc24ndCB3b3JrIHByb3Blcmx5IGluIE9wZXJhXG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCByYWRpdXMsY3VycmVudEFuZ2xlLCBjdXJyZW50QW5nbGUgKyBhbmdsZSAvIDIsIGZhbHNlKTtcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIHJhZGl1cyxjdXJyZW50QW5nbGUgKyBhbmdsZSAvIDIsIGN1cnJlbnRBbmdsZSArIGFuZ2xlLCBmYWxzZSk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdC8vY3R4LnJvdGF0ZShhbmdsZSk7IC8vIFRoaXMgZG9lc24ndCB3b3JrIHByb3Blcmx5IGluIE9wZXJhXG5cdFx0XHRcdFx0Y3VycmVudEFuZ2xlICs9IGFuZ2xlO1xuXG5cdFx0XHRcdFx0aWYgKGZpbGwpIHtcblx0XHRcdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBkcmF3TGFiZWxzKCkge1xuXG5cdFx0XHRcdFx0dmFyIGN1cnJlbnRBbmdsZSA9IHN0YXJ0QW5nbGU7XG5cdFx0XHRcdFx0dmFyIHJhZGl1cyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5yYWRpdXMgPiAxID8gb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnJhZGl1cyA6IG1heFJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5yYWRpdXM7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlcy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdFx0aWYgKHNsaWNlc1tpXS5wZXJjZW50ID49IG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC50aHJlc2hvbGQgKiAxMDApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCFkcmF3TGFiZWwoc2xpY2VzW2ldLCBjdXJyZW50QW5nbGUsIGkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJyZW50QW5nbGUgKz0gc2xpY2VzW2ldLmFuZ2xlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdFx0ZnVuY3Rpb24gZHJhd0xhYmVsKHNsaWNlLCBzdGFydEFuZ2xlLCBpbmRleCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoc2xpY2UuZGF0YVswXVsxXSA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBmb3JtYXQgbGFiZWwgdGV4dFxuXG5cdFx0XHRcdFx0XHR2YXIgbGYgPSBvcHRpb25zLmxlZ2VuZC5sYWJlbEZvcm1hdHRlciwgdGV4dCwgcGxmID0gb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLmZvcm1hdHRlcjtcblxuXHRcdFx0XHRcdFx0aWYgKGxmKSB7XG5cdFx0XHRcdFx0XHRcdHRleHQgPSBsZihzbGljZS5sYWJlbCwgc2xpY2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dGV4dCA9IHNsaWNlLmxhYmVsO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAocGxmKSB7XG5cdFx0XHRcdFx0XHRcdHRleHQgPSBwbGYodGV4dCwgc2xpY2UpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgaGFsZkFuZ2xlID0gKChzdGFydEFuZ2xlICsgc2xpY2UuYW5nbGUpICsgc3RhcnRBbmdsZSkgLyAyO1xuXHRcdFx0XHRcdFx0dmFyIHggPSBjZW50ZXJMZWZ0ICsgTWF0aC5yb3VuZChNYXRoLmNvcyhoYWxmQW5nbGUpICogcmFkaXVzKTtcblx0XHRcdFx0XHRcdHZhciB5ID0gY2VudGVyVG9wICsgTWF0aC5yb3VuZChNYXRoLnNpbihoYWxmQW5nbGUpICogcmFkaXVzKSAqIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0O1xuXG5cdFx0XHRcdFx0XHR2YXIgaHRtbCA9IFwiPHNwYW4gY2xhc3M9J3BpZUxhYmVsJyBpZD0ncGllTGFiZWxcIiArIGluZGV4ICsgXCInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTt0b3A6XCIgKyB5ICsgXCJweDtsZWZ0OlwiICsgeCArIFwicHg7Jz5cIiArIHRleHQgKyBcIjwvc3Bhbj5cIjtcblx0XHRcdFx0XHRcdHRhcmdldC5hcHBlbmQoaHRtbCk7XG5cblx0XHRcdFx0XHRcdHZhciBsYWJlbCA9IHRhcmdldC5jaGlsZHJlbihcIiNwaWVMYWJlbFwiICsgaW5kZXgpO1xuXHRcdFx0XHRcdFx0dmFyIGxhYmVsVG9wID0gKHkgLSBsYWJlbC5oZWlnaHQoKSAvIDIpO1xuXHRcdFx0XHRcdFx0dmFyIGxhYmVsTGVmdCA9ICh4IC0gbGFiZWwud2lkdGgoKSAvIDIpO1xuXG5cdFx0XHRcdFx0XHRsYWJlbC5jc3MoXCJ0b3BcIiwgbGFiZWxUb3ApO1xuXHRcdFx0XHRcdFx0bGFiZWwuY3NzKFwibGVmdFwiLCBsYWJlbExlZnQpO1xuXG5cdFx0XHRcdFx0XHQvLyBjaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgbGFiZWwgaXMgbm90IG91dHNpZGUgdGhlIGNhbnZhc1xuXG5cdFx0XHRcdFx0XHRpZiAoMCAtIGxhYmVsVG9wID4gMCB8fCAwIC0gbGFiZWxMZWZ0ID4gMCB8fCBjYW52YXNIZWlnaHQgLSAobGFiZWxUb3AgKyBsYWJlbC5oZWlnaHQoKSkgPCAwIHx8IGNhbnZhc1dpZHRoIC0gKGxhYmVsTGVmdCArIGxhYmVsLndpZHRoKCkpIDwgMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUubGFiZWwuYmFja2dyb3VuZC5vcGFjaXR5ICE9IDApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBwdXQgaW4gdGhlIHRyYW5zcGFyZW50IGJhY2tncm91bmQgc2VwYXJhdGVseSB0byBhdm9pZCBibGVuZGVkIGxhYmVscyBhbmQgbGFiZWwgYm94ZXNcblxuXHRcdFx0XHRcdFx0XHR2YXIgYyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5iYWNrZ3JvdW5kLmNvbG9yO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChjID09IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0XHRjID0gc2xpY2UuY29sb3I7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHR2YXIgcG9zID0gXCJ0b3A6XCIgKyBsYWJlbFRvcCArIFwicHg7bGVmdDpcIiArIGxhYmVsTGVmdCArIFwicHg7XCI7XG5cdFx0XHRcdFx0XHRcdCQoXCI8ZGl2IGNsYXNzPSdwaWVMYWJlbEJhY2tncm91bmQnIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDpcIiArIGxhYmVsLndpZHRoKCkgKyBcInB4O2hlaWdodDpcIiArIGxhYmVsLmhlaWdodCgpICsgXCJweDtcIiArIHBvcyArIFwiYmFja2dyb3VuZC1jb2xvcjpcIiArIGMgKyBcIjsnPjwvZGl2PlwiKVxuXHRcdFx0XHRcdFx0XHRcdC5jc3MoXCJvcGFjaXR5XCIsIG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5iYWNrZ3JvdW5kLm9wYWNpdHkpXG5cdFx0XHRcdFx0XHRcdFx0Lmluc2VydEJlZm9yZShsYWJlbCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH0gLy8gZW5kIGluZGl2aWR1YWwgbGFiZWwgZnVuY3Rpb25cblx0XHRcdFx0fSAvLyBlbmQgZHJhd0xhYmVscyBmdW5jdGlvblxuXHRcdFx0fSAvLyBlbmQgZHJhd1BpZSBmdW5jdGlvblxuXHRcdH0gLy8gZW5kIGRyYXcgZnVuY3Rpb25cblxuXHRcdC8vIFBsYWNlZCBoZXJlIGJlY2F1c2UgaXQgbmVlZHMgdG8gYmUgYWNjZXNzZWQgZnJvbSBtdWx0aXBsZSBsb2NhdGlvbnNcblxuXHRcdGZ1bmN0aW9uIGRyYXdEb251dEhvbGUobGF5ZXIpIHtcblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuaW5uZXJSYWRpdXMgPiAwKSB7XG5cblx0XHRcdFx0Ly8gc3VidHJhY3QgdGhlIGNlbnRlclxuXG5cdFx0XHRcdGxheWVyLnNhdmUoKTtcblx0XHRcdFx0dmFyIGlubmVyUmFkaXVzID0gb3B0aW9ucy5zZXJpZXMucGllLmlubmVyUmFkaXVzID4gMSA/IG9wdGlvbnMuc2VyaWVzLnBpZS5pbm5lclJhZGl1cyA6IG1heFJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS5pbm5lclJhZGl1cztcblx0XHRcdFx0bGF5ZXIuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJkZXN0aW5hdGlvbi1vdXRcIjsgLy8gdGhpcyBkb2VzIG5vdCB3b3JrIHdpdGggZXhjYW52YXMsIGJ1dCBpdCB3aWxsIGZhbGwgYmFjayB0byB1c2luZyB0aGUgc3Ryb2tlIGNvbG9yXG5cdFx0XHRcdGxheWVyLmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRsYXllci5maWxsU3R5bGUgPSBvcHRpb25zLnNlcmllcy5waWUuc3Ryb2tlLmNvbG9yO1xuXHRcdFx0XHRsYXllci5hcmMoMCwgMCwgaW5uZXJSYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG5cdFx0XHRcdGxheWVyLmZpbGwoKTtcblx0XHRcdFx0bGF5ZXIuY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGxheWVyLnJlc3RvcmUoKTtcblxuXHRcdFx0XHQvLyBhZGQgaW5uZXIgc3Ryb2tlXG5cblx0XHRcdFx0bGF5ZXIuc2F2ZSgpO1xuXHRcdFx0XHRsYXllci5iZWdpblBhdGgoKTtcblx0XHRcdFx0bGF5ZXIuc3Ryb2tlU3R5bGUgPSBvcHRpb25zLnNlcmllcy5waWUuc3Ryb2tlLmNvbG9yO1xuXHRcdFx0XHRsYXllci5hcmMoMCwgMCwgaW5uZXJSYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG5cdFx0XHRcdGxheWVyLnN0cm9rZSgpO1xuXHRcdFx0XHRsYXllci5jbG9zZVBhdGgoKTtcblx0XHRcdFx0bGF5ZXIucmVzdG9yZSgpO1xuXG5cdFx0XHRcdC8vIFRPRE86IGFkZCBleHRyYSBzaGFkb3cgaW5zaWRlIGhvbGUgKHdpdGggYSBtYXNrKSBpZiB0aGUgcGllIGlzIHRpbHRlZC5cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLy0tIEFkZGl0aW9uYWwgSW50ZXJhY3RpdmUgcmVsYXRlZCBmdW5jdGlvbnMgLS1cblxuXHRcdGZ1bmN0aW9uIGlzUG9pbnRJblBvbHkocG9seSwgcHQpIHtcblx0XHRcdGZvcih2YXIgYyA9IGZhbHNlLCBpID0gLTEsIGwgPSBwb2x5Lmxlbmd0aCwgaiA9IGwgLSAxOyArK2kgPCBsOyBqID0gaSlcblx0XHRcdFx0KChwb2x5W2ldWzFdIDw9IHB0WzFdICYmIHB0WzFdIDwgcG9seVtqXVsxXSkgfHwgKHBvbHlbal1bMV0gPD0gcHRbMV0gJiYgcHRbMV08IHBvbHlbaV1bMV0pKVxuXHRcdFx0XHQmJiAocHRbMF0gPCAocG9seVtqXVswXSAtIHBvbHlbaV1bMF0pICogKHB0WzFdIC0gcG9seVtpXVsxXSkgLyAocG9seVtqXVsxXSAtIHBvbHlbaV1bMV0pICsgcG9seVtpXVswXSlcblx0XHRcdFx0JiYgKGMgPSAhYyk7XG5cdFx0XHRyZXR1cm4gYztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBmaW5kTmVhcmJ5U2xpY2UobW91c2VYLCBtb3VzZVkpIHtcblxuXHRcdFx0dmFyIHNsaWNlcyA9IHBsb3QuZ2V0RGF0YSgpLFxuXHRcdFx0XHRvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCksXG5cdFx0XHRcdHJhZGl1cyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPiAxID8gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA6IG1heFJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMsXG5cdFx0XHRcdHgsIHk7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VzLmxlbmd0aDsgKytpKSB7XG5cblx0XHRcdFx0dmFyIHMgPSBzbGljZXNbaV07XG5cblx0XHRcdFx0aWYgKHMucGllLnNob3cpIHtcblxuXHRcdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7IC8vIENlbnRlciBvZiB0aGUgcGllXG5cdFx0XHRcdFx0Ly9jdHguc2NhbGUoMSwgb3B0aW9ucy5zZXJpZXMucGllLnRpbHQpO1x0Ly8gdGhpcyBhY3R1YWxseSBzZWVtcyB0byBicmVhayBldmVyeXRoaW5nIHdoZW4gaGVyZS5cblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIHJhZGl1cywgcy5zdGFydEFuZ2xlLCBzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gMiwgZmFsc2UpO1xuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gMiwgcy5zdGFydEFuZ2xlICsgcy5hbmdsZSwgZmFsc2UpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHR4ID0gbW91c2VYIC0gY2VudGVyTGVmdDtcblx0XHRcdFx0XHR5ID0gbW91c2VZIC0gY2VudGVyVG9wO1xuXG5cdFx0XHRcdFx0aWYgKGN0eC5pc1BvaW50SW5QYXRoKSB7XG5cdFx0XHRcdFx0XHRpZiAoY3R4LmlzUG9pbnRJblBhdGgobW91c2VYIC0gY2VudGVyTGVmdCwgbW91c2VZIC0gY2VudGVyVG9wKSkge1xuXHRcdFx0XHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFwb2ludDogW3MucGVyY2VudCwgcy5kYXRhXSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhSW5kZXg6IDAsXG5cdFx0XHRcdFx0XHRcdFx0c2VyaWVzOiBzLFxuXHRcdFx0XHRcdFx0XHRcdHNlcmllc0luZGV4OiBpXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Ly8gZXhjYW52YXMgZm9yIElFIGRvZXNuO3Qgc3VwcG9ydCBpc1BvaW50SW5QYXRoLCB0aGlzIGlzIGEgd29ya2Fyb3VuZC5cblxuXHRcdFx0XHRcdFx0dmFyIHAxWCA9IHJhZGl1cyAqIE1hdGguY29zKHMuc3RhcnRBbmdsZSksXG5cdFx0XHRcdFx0XHRcdHAxWSA9IHJhZGl1cyAqIE1hdGguc2luKHMuc3RhcnRBbmdsZSksXG5cdFx0XHRcdFx0XHRcdHAyWCA9IHJhZGl1cyAqIE1hdGguY29zKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyA0KSxcblx0XHRcdFx0XHRcdFx0cDJZID0gcmFkaXVzICogTWF0aC5zaW4ocy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDQpLFxuXHRcdFx0XHRcdFx0XHRwM1ggPSByYWRpdXMgKiBNYXRoLmNvcyhzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gMiksXG5cdFx0XHRcdFx0XHRcdHAzWSA9IHJhZGl1cyAqIE1hdGguc2luKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyAyKSxcblx0XHRcdFx0XHRcdFx0cDRYID0gcmFkaXVzICogTWF0aC5jb3Mocy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDEuNSksXG5cdFx0XHRcdFx0XHRcdHA0WSA9IHJhZGl1cyAqIE1hdGguc2luKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyAxLjUpLFxuXHRcdFx0XHRcdFx0XHRwNVggPSByYWRpdXMgKiBNYXRoLmNvcyhzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlKSxcblx0XHRcdFx0XHRcdFx0cDVZID0gcmFkaXVzICogTWF0aC5zaW4ocy5zdGFydEFuZ2xlICsgcy5hbmdsZSksXG5cdFx0XHRcdFx0XHRcdGFyclBvbHkgPSBbWzAsIDBdLCBbcDFYLCBwMVldLCBbcDJYLCBwMlldLCBbcDNYLCBwM1ldLCBbcDRYLCBwNFldLCBbcDVYLCBwNVldXSxcblx0XHRcdFx0XHRcdFx0YXJyUG9pbnQgPSBbeCwgeV07XG5cblx0XHRcdFx0XHRcdC8vIFRPRE86IHBlcmhhcHMgZG8gc29tZSBtYXRobWF0aWNhbCB0cmlja2VyeSBoZXJlIHdpdGggdGhlIFktY29vcmRpbmF0ZSB0byBjb21wZW5zYXRlIGZvciBwaWUgdGlsdD9cblxuXHRcdFx0XHRcdFx0aWYgKGlzUG9pbnRJblBvbHkoYXJyUG9seSwgYXJyUG9pbnQpKSB7XG5cdFx0XHRcdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXBvaW50OiBbcy5wZXJjZW50LCBzLmRhdGFdLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFJbmRleDogMCxcblx0XHRcdFx0XHRcdFx0XHRzZXJpZXM6IHMsXG5cdFx0XHRcdFx0XHRcdFx0c2VyaWVzSW5kZXg6IGlcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGUpIHtcblx0XHRcdHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoXCJwbG90aG92ZXJcIiwgZSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25DbGljayhlKSB7XG5cdFx0XHR0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KFwicGxvdGNsaWNrXCIsIGUpO1xuXHRcdH1cblxuXHRcdC8vIHRyaWdnZXIgY2xpY2sgb3IgaG92ZXIgZXZlbnQgKHRoZXkgc2VuZCB0aGUgc2FtZSBwYXJhbWV0ZXJzIHNvIHdlIHNoYXJlIHRoZWlyIGNvZGUpXG5cblx0XHRmdW5jdGlvbiB0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KGV2ZW50bmFtZSwgZSkge1xuXG5cdFx0XHR2YXIgb2Zmc2V0ID0gcGxvdC5vZmZzZXQoKTtcblx0XHRcdHZhciBjYW52YXNYID0gcGFyc2VJbnQoZS5wYWdlWCAtIG9mZnNldC5sZWZ0KTtcblx0XHRcdHZhciBjYW52YXNZID0gIHBhcnNlSW50KGUucGFnZVkgLSBvZmZzZXQudG9wKTtcblx0XHRcdHZhciBpdGVtID0gZmluZE5lYXJieVNsaWNlKGNhbnZhc1gsIGNhbnZhc1kpO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5ncmlkLmF1dG9IaWdobGlnaHQpIHtcblxuXHRcdFx0XHQvLyBjbGVhciBhdXRvLWhpZ2hsaWdodHNcblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHR2YXIgaCA9IGhpZ2hsaWdodHNbaV07XG5cdFx0XHRcdFx0aWYgKGguYXV0byA9PSBldmVudG5hbWUgJiYgIShpdGVtICYmIGguc2VyaWVzID09IGl0ZW0uc2VyaWVzKSkge1xuXHRcdFx0XHRcdFx0dW5oaWdobGlnaHQoaC5zZXJpZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBoaWdobGlnaHQgdGhlIHNsaWNlXG5cblx0XHRcdGlmIChpdGVtKSB7XG5cdFx0XHRcdGhpZ2hsaWdodChpdGVtLnNlcmllcywgZXZlbnRuYW1lKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdHJpZ2dlciBhbnkgaG92ZXIgYmluZCBldmVudHNcblxuXHRcdFx0dmFyIHBvcyA9IHsgcGFnZVg6IGUucGFnZVgsIHBhZ2VZOiBlLnBhZ2VZIH07XG5cdFx0XHR0YXJnZXQudHJpZ2dlcihldmVudG5hbWUsIFtwb3MsIGl0ZW1dKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoaWdobGlnaHQocywgYXV0bykge1xuXHRcdFx0Ly9pZiAodHlwZW9mIHMgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0Ly9cdHMgPSBzZXJpZXNbc107XG5cdFx0XHQvL31cblxuXHRcdFx0dmFyIGkgPSBpbmRleE9mSGlnaGxpZ2h0KHMpO1xuXG5cdFx0XHRpZiAoaSA9PSAtMSkge1xuXHRcdFx0XHRoaWdobGlnaHRzLnB1c2goeyBzZXJpZXM6IHMsIGF1dG86IGF1dG8gfSk7XG5cdFx0XHRcdHBsb3QudHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcblx0XHRcdH0gZWxzZSBpZiAoIWF1dG8pIHtcblx0XHRcdFx0aGlnaGxpZ2h0c1tpXS5hdXRvID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdW5oaWdobGlnaHQocykge1xuXHRcdFx0aWYgKHMgPT0gbnVsbCkge1xuXHRcdFx0XHRoaWdobGlnaHRzID0gW107XG5cdFx0XHRcdHBsb3QudHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly9pZiAodHlwZW9mIHMgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0Ly9cdHMgPSBzZXJpZXNbc107XG5cdFx0XHQvL31cblxuXHRcdFx0dmFyIGkgPSBpbmRleE9mSGlnaGxpZ2h0KHMpO1xuXG5cdFx0XHRpZiAoaSAhPSAtMSkge1xuXHRcdFx0XHRoaWdobGlnaHRzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0cGxvdC50cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGluZGV4T2ZIaWdobGlnaHQocykge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBoaWdobGlnaHRzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHZhciBoID0gaGlnaGxpZ2h0c1tpXTtcblx0XHRcdFx0aWYgKGguc2VyaWVzID09IHMpXG5cdFx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gLTE7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZHJhd092ZXJsYXkocGxvdCwgb2N0eCkge1xuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpO1xuXG5cdFx0XHR2YXIgcmFkaXVzID0gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA+IDEgPyBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzIDogbWF4UmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cztcblxuXHRcdFx0b2N0eC5zYXZlKCk7XG5cdFx0XHRvY3R4LnRyYW5zbGF0ZShjZW50ZXJMZWZ0LCBjZW50ZXJUb3ApO1xuXHRcdFx0b2N0eC5zY2FsZSgxLCBvcHRpb25zLnNlcmllcy5waWUudGlsdCk7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaGlnaGxpZ2h0cy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRkcmF3SGlnaGxpZ2h0KGhpZ2hsaWdodHNbaV0uc2VyaWVzKTtcblx0XHRcdH1cblxuXHRcdFx0ZHJhd0RvbnV0SG9sZShvY3R4KTtcblxuXHRcdFx0b2N0eC5yZXN0b3JlKCk7XG5cblx0XHRcdGZ1bmN0aW9uIGRyYXdIaWdobGlnaHQoc2VyaWVzKSB7XG5cblx0XHRcdFx0aWYgKHNlcmllcy5hbmdsZSA8PSAwIHx8IGlzTmFOKHNlcmllcy5hbmdsZSkpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL29jdHguZmlsbFN0eWxlID0gcGFyc2VDb2xvcihvcHRpb25zLnNlcmllcy5waWUuaGlnaGxpZ2h0LmNvbG9yKS5zY2FsZShudWxsLCBudWxsLCBudWxsLCBvcHRpb25zLnNlcmllcy5waWUuaGlnaGxpZ2h0Lm9wYWNpdHkpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdG9jdHguZmlsbFN0eWxlID0gXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIFwiICsgb3B0aW9ucy5zZXJpZXMucGllLmhpZ2hsaWdodC5vcGFjaXR5ICsgXCIpXCI7IC8vIHRoaXMgaXMgdGVtcG9yYXJ5IHVudGlsIHdlIGhhdmUgYWNjZXNzIHRvIHBhcnNlQ29sb3Jcblx0XHRcdFx0b2N0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0aWYgKE1hdGguYWJzKHNlcmllcy5hbmdsZSAtIE1hdGguUEkgKiAyKSA+IDAuMDAwMDAwMDAxKSB7XG5cdFx0XHRcdFx0b2N0eC5tb3ZlVG8oMCwgMCk7IC8vIENlbnRlciBvZiB0aGUgcGllXG5cdFx0XHRcdH1cblx0XHRcdFx0b2N0eC5hcmMoMCwgMCwgcmFkaXVzLCBzZXJpZXMuc3RhcnRBbmdsZSwgc2VyaWVzLnN0YXJ0QW5nbGUgKyBzZXJpZXMuYW5nbGUgLyAyLCBmYWxzZSk7XG5cdFx0XHRcdG9jdHguYXJjKDAsIDAsIHJhZGl1cywgc2VyaWVzLnN0YXJ0QW5nbGUgKyBzZXJpZXMuYW5nbGUgLyAyLCBzZXJpZXMuc3RhcnRBbmdsZSArIHNlcmllcy5hbmdsZSwgZmFsc2UpO1xuXHRcdFx0XHRvY3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRvY3R4LmZpbGwoKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gLy8gZW5kIGluaXQgKHBsdWdpbiBib2R5KVxuXG5cdC8vIGRlZmluZSBwaWUgc3BlY2lmaWMgb3B0aW9ucyBhbmQgdGhlaXIgZGVmYXVsdCB2YWx1ZXNcblxuXHR2YXIgb3B0aW9ucyA9IHtcblx0XHRzZXJpZXM6IHtcblx0XHRcdHBpZToge1xuXHRcdFx0XHRzaG93OiBmYWxzZSxcblx0XHRcdFx0cmFkaXVzOiBcImF1dG9cIixcdC8vIGFjdHVhbCByYWRpdXMgb2YgdGhlIHZpc2libGUgcGllIChiYXNlZCBvbiBmdWxsIGNhbGN1bGF0ZWQgcmFkaXVzIGlmIDw9MSwgb3IgaGFyZCBwaXhlbCB2YWx1ZSlcblx0XHRcdFx0aW5uZXJSYWRpdXM6IDAsIC8qIGZvciBkb251dCAqL1xuXHRcdFx0XHRzdGFydEFuZ2xlOiAzLzIsXG5cdFx0XHRcdHRpbHQ6IDEsXG5cdFx0XHRcdHNoYWRvdzoge1xuXHRcdFx0XHRcdGxlZnQ6IDUsXHQvLyBzaGFkb3cgbGVmdCBvZmZzZXRcblx0XHRcdFx0XHR0b3A6IDE1LFx0Ly8gc2hhZG93IHRvcCBvZmZzZXRcblx0XHRcdFx0XHRhbHBoYTogMC4wMlx0Ly8gc2hhZG93IGFscGhhXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9mZnNldDoge1xuXHRcdFx0XHRcdHRvcDogMCxcblx0XHRcdFx0XHRsZWZ0OiBcImF1dG9cIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdHJva2U6IHtcblx0XHRcdFx0XHRjb2xvcjogXCIjZmZmXCIsXG5cdFx0XHRcdFx0d2lkdGg6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0XHRzaG93OiBcImF1dG9cIixcblx0XHRcdFx0XHRmb3JtYXR0ZXI6IGZ1bmN0aW9uKGxhYmVsLCBzbGljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFwiPGRpdiBzdHlsZT0nZm9udC1zaXplOngtc21hbGw7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZzoycHg7Y29sb3I6XCIgKyBzbGljZS5jb2xvciArIFwiOyc+XCIgKyBsYWJlbCArIFwiPGJyLz5cIiArIE1hdGgucm91bmQoc2xpY2UucGVyY2VudCkgKyBcIiU8L2Rpdj5cIjtcblx0XHRcdFx0XHR9LFx0Ly8gZm9ybWF0dGVyIGZ1bmN0aW9uXG5cdFx0XHRcdFx0cmFkaXVzOiAxLFx0Ly8gcmFkaXVzIGF0IHdoaWNoIHRvIHBsYWNlIHRoZSBsYWJlbHMgKGJhc2VkIG9uIGZ1bGwgY2FsY3VsYXRlZCByYWRpdXMgaWYgPD0xLCBvciBoYXJkIHBpeGVsIHZhbHVlKVxuXHRcdFx0XHRcdGJhY2tncm91bmQ6IHtcblx0XHRcdFx0XHRcdGNvbG9yOiBudWxsLFxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0dGhyZXNob2xkOiAwXHQvLyBwZXJjZW50YWdlIGF0IHdoaWNoIHRvIGhpZGUgdGhlIGxhYmVsIChpLmUuIHRoZSBzbGljZSBpcyB0b28gbmFycm93KVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb21iaW5lOiB7XG5cdFx0XHRcdFx0dGhyZXNob2xkOiAtMSxcdC8vIHBlcmNlbnRhZ2UgYXQgd2hpY2ggdG8gY29tYmluZSBsaXR0bGUgc2xpY2VzIGludG8gb25lIGxhcmdlciBzbGljZVxuXHRcdFx0XHRcdGNvbG9yOiBudWxsLFx0Ly8gY29sb3IgdG8gZ2l2ZSB0aGUgbmV3IHNsaWNlIChhdXRvLWdlbmVyYXRlZCBpZiBudWxsKVxuXHRcdFx0XHRcdGxhYmVsOiBcIk90aGVyXCJcdC8vIGxhYmVsIHRvIGdpdmUgdGhlIG5ldyBzbGljZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRoaWdobGlnaHQ6IHtcblx0XHRcdFx0XHQvL2NvbG9yOiBcIiNmZmZcIixcdFx0Ly8gd2lsbCBhZGQgdGhpcyBmdW5jdGlvbmFsaXR5IG9uY2UgcGFyc2VDb2xvciBpcyBhdmFpbGFibGVcblx0XHRcdFx0XHRvcGFjaXR5OiAwLjVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQkLnBsb3QucGx1Z2lucy5wdXNoKHtcblx0XHRpbml0OiBpbml0LFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cdFx0bmFtZTogXCJwaWVcIixcblx0XHR2ZXJzaW9uOiBcIjEuMVwiXG5cdH0pO1xuXG59KShqUXVlcnkpO1xuIiwiLyogRmxvdCBwbHVnaW4gZm9yIGF1dG9tYXRpY2FsbHkgcmVkcmF3aW5nIHBsb3RzIGFzIHRoZSBwbGFjZWhvbGRlciByZXNpemVzLlxuXG5Db3B5cmlnaHQgKGMpIDIwMDctMjAxNCBJT0xBIGFuZCBPbGUgTGF1cnNlbi5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuSXQgd29ya3MgYnkgbGlzdGVuaW5nIGZvciBjaGFuZ2VzIG9uIHRoZSBwbGFjZWhvbGRlciBkaXYgKHRocm91Z2ggdGhlIGpRdWVyeVxucmVzaXplIGV2ZW50IHBsdWdpbikgLSBpZiB0aGUgc2l6ZSBjaGFuZ2VzLCBpdCB3aWxsIHJlZHJhdyB0aGUgcGxvdC5cblxuVGhlcmUgYXJlIG5vIG9wdGlvbnMuIElmIHlvdSBuZWVkIHRvIGRpc2FibGUgdGhlIHBsdWdpbiBmb3Igc29tZSBwbG90cywgeW91XG5jYW4ganVzdCBmaXggdGhlIHNpemUgb2YgdGhlaXIgcGxhY2Vob2xkZXJzLlxuXG4qL1xuXG4vKiBJbmxpbmUgZGVwZW5kZW5jeTpcbiAqIGpRdWVyeSByZXNpemUgZXZlbnQgLSB2MS4xIC0gMy8xNC8yMDEwXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL3Byb2plY3RzL2pxdWVyeS1yZXNpemUtcGx1Z2luL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMCBcIkNvd2JveVwiIEJlbiBBbG1hblxuICogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXMuXG4gKiBodHRwOi8vYmVuYWxtYW4uY29tL2Fib3V0L2xpY2Vuc2UvXG4gKi9cbihmdW5jdGlvbigkLGUsdCl7XCIkOm5vbXVuZ2VcIjt2YXIgaT1bXSxuPSQucmVzaXplPSQuZXh0ZW5kKCQucmVzaXplLHt9KSxhLHI9ZmFsc2Uscz1cInNldFRpbWVvdXRcIix1PVwicmVzaXplXCIsbT11K1wiLXNwZWNpYWwtZXZlbnRcIixvPVwicGVuZGluZ0RlbGF5XCIsbD1cImFjdGl2ZURlbGF5XCIsZj1cInRocm90dGxlV2luZG93XCI7bltvXT0yMDA7bltsXT0yMDtuW2ZdPXRydWU7JC5ldmVudC5zcGVjaWFsW3VdPXtzZXR1cDpmdW5jdGlvbigpe2lmKCFuW2ZdJiZ0aGlzW3NdKXtyZXR1cm4gZmFsc2V9dmFyIGU9JCh0aGlzKTtpLnB1c2godGhpcyk7ZS5kYXRhKG0se3c6ZS53aWR0aCgpLGg6ZS5oZWlnaHQoKX0pO2lmKGkubGVuZ3RoPT09MSl7YT10O2goKX19LHRlYXJkb3duOmZ1bmN0aW9uKCl7aWYoIW5bZl0mJnRoaXNbc10pe3JldHVybiBmYWxzZX12YXIgZT0kKHRoaXMpO2Zvcih2YXIgdD1pLmxlbmd0aC0xO3Q+PTA7dC0tKXtpZihpW3RdPT10aGlzKXtpLnNwbGljZSh0LDEpO2JyZWFrfX1lLnJlbW92ZURhdGEobSk7aWYoIWkubGVuZ3RoKXtpZihyKXtjYW5jZWxBbmltYXRpb25GcmFtZShhKX1lbHNle2NsZWFyVGltZW91dChhKX1hPW51bGx9fSxhZGQ6ZnVuY3Rpb24oZSl7aWYoIW5bZl0mJnRoaXNbc10pe3JldHVybiBmYWxzZX12YXIgaTtmdW5jdGlvbiBhKGUsbixhKXt2YXIgcj0kKHRoaXMpLHM9ci5kYXRhKG0pfHx7fTtzLnc9biE9PXQ/bjpyLndpZHRoKCk7cy5oPWEhPT10P2E6ci5oZWlnaHQoKTtpLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1pZigkLmlzRnVuY3Rpb24oZSkpe2k9ZTtyZXR1cm4gYX1lbHNle2k9ZS5oYW5kbGVyO2UuaGFuZGxlcj1hfX19O2Z1bmN0aW9uIGgodCl7aWYocj09PXRydWUpe3I9dHx8MX1mb3IodmFyIHM9aS5sZW5ndGgtMTtzPj0wO3MtLSl7dmFyIGw9JChpW3NdKTtpZihsWzBdPT1lfHxsLmlzKFwiOnZpc2libGVcIikpe3ZhciBmPWwud2lkdGgoKSxjPWwuaGVpZ2h0KCksZD1sLmRhdGEobSk7aWYoZCYmKGYhPT1kLnd8fGMhPT1kLmgpKXtsLnRyaWdnZXIodSxbZC53PWYsZC5oPWNdKTtyPXR8fHRydWV9fWVsc2V7ZD1sLmRhdGEobSk7ZC53PTA7ZC5oPTB9fWlmKGEhPT1udWxsKXtpZihyJiYodD09bnVsbHx8dC1yPDFlMykpe2E9ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaCl9ZWxzZXthPXNldFRpbWVvdXQoaCxuW29dKTtyPWZhbHNlfX19aWYoIWUucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXtlLnJlcXVlc3RBbmltYXRpb25GcmFtZT1mdW5jdGlvbigpe3JldHVybiBlLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUub1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tc1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24odCxpKXtyZXR1cm4gZS5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dCgobmV3IERhdGUpLmdldFRpbWUoKSl9LG5bbF0pfX0oKX1pZighZS5jYW5jZWxBbmltYXRpb25GcmFtZSl7ZS5jYW5jZWxBbmltYXRpb25GcmFtZT1mdW5jdGlvbigpe3JldHVybiBlLndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUub0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5tc0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZXx8Y2xlYXJUaW1lb3V0fSgpfX0pKGpRdWVyeSx0aGlzKTtcblxuKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7IH07IC8vIG5vIG9wdGlvbnNcblxuICAgIGZ1bmN0aW9uIGluaXQocGxvdCkge1xuICAgICAgICBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IHBsb3QuZ2V0UGxhY2Vob2xkZXIoKTtcblxuICAgICAgICAgICAgLy8gc29tZWJvZHkgbWlnaHQgaGF2ZSBoaWRkZW4gdXMgYW5kIHdlIGNhbid0IHBsb3RcbiAgICAgICAgICAgIC8vIHdoZW4gd2UgZG9uJ3QgaGF2ZSB0aGUgZGltZW5zaW9uc1xuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyLndpZHRoKCkgPT0gMCB8fCBwbGFjZWhvbGRlci5oZWlnaHQoKSA9PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgcGxvdC5yZXNpemUoKTtcbiAgICAgICAgICAgIHBsb3Quc2V0dXBHcmlkKCk7XG4gICAgICAgICAgICBwbG90LmRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gYmluZEV2ZW50cyhwbG90LCBldmVudEhvbGRlcikge1xuICAgICAgICAgICAgcGxvdC5nZXRQbGFjZWhvbGRlcigpLnJlc2l6ZShvblJlc2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzaHV0ZG93bihwbG90LCBldmVudEhvbGRlcikge1xuICAgICAgICAgICAgcGxvdC5nZXRQbGFjZWhvbGRlcigpLnVuYmluZChcInJlc2l6ZVwiLCBvblJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHBsb3QuaG9va3MuYmluZEV2ZW50cy5wdXNoKGJpbmRFdmVudHMpO1xuICAgICAgICBwbG90Lmhvb2tzLnNodXRkb3duLnB1c2goc2h1dGRvd24pO1xuICAgIH1cbiAgICBcbiAgICAkLnBsb3QucGx1Z2lucy5wdXNoKHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgbmFtZTogJ3Jlc2l6ZScsXG4gICAgICAgIHZlcnNpb246ICcxLjAnXG4gICAgfSk7XG59KShqUXVlcnkpO1xuIiwiLyogUHJldHR5IGhhbmRsaW5nIG9mIHRpbWUgYXhlcy5cblxuQ29weXJpZ2h0IChjKSAyMDA3LTIwMTQgSU9MQSBhbmQgT2xlIExhdXJzZW4uXG5MaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cblNldCBheGlzLm1vZGUgdG8gXCJ0aW1lXCIgdG8gZW5hYmxlLiBTZWUgdGhlIHNlY3Rpb24gXCJUaW1lIHNlcmllcyBkYXRhXCIgaW5cbkFQSS50eHQgZm9yIGRldGFpbHMuXG5cbiovXG5cbihmdW5jdGlvbigkKSB7XG5cblx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0eGF4aXM6IHtcblx0XHRcdHRpbWV6b25lOiBudWxsLFx0XHQvLyBcImJyb3dzZXJcIiBmb3IgbG9jYWwgdG8gdGhlIGNsaWVudCBvciB0aW1lem9uZSBmb3IgdGltZXpvbmUtanNcblx0XHRcdHRpbWVmb3JtYXQ6IG51bGwsXHQvLyBmb3JtYXQgc3RyaW5nIHRvIHVzZVxuXHRcdFx0dHdlbHZlSG91ckNsb2NrOiBmYWxzZSxcdC8vIDEyIG9yIDI0IHRpbWUgaW4gdGltZSBtb2RlXG5cdFx0XHRtb250aE5hbWVzOiBudWxsXHQvLyBsaXN0IG9mIG5hbWVzIG9mIG1vbnRoc1xuXHRcdH1cblx0fTtcblxuXHQvLyByb3VuZCB0byBuZWFyYnkgbG93ZXIgbXVsdGlwbGUgb2YgYmFzZVxuXG5cdGZ1bmN0aW9uIGZsb29ySW5CYXNlKG4sIGJhc2UpIHtcblx0XHRyZXR1cm4gYmFzZSAqIE1hdGguZmxvb3IobiAvIGJhc2UpO1xuXHR9XG5cblx0Ly8gUmV0dXJucyBhIHN0cmluZyB3aXRoIHRoZSBkYXRlIGQgZm9ybWF0dGVkIGFjY29yZGluZyB0byBmbXQuXG5cdC8vIEEgc3Vic2V0IG9mIHRoZSBPcGVuIEdyb3VwJ3Mgc3RyZnRpbWUgZm9ybWF0IGlzIHN1cHBvcnRlZC5cblxuXHRmdW5jdGlvbiBmb3JtYXREYXRlKGQsIGZtdCwgbW9udGhOYW1lcywgZGF5TmFtZXMpIHtcblxuXHRcdGlmICh0eXBlb2YgZC5zdHJmdGltZSA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdHJldHVybiBkLnN0cmZ0aW1lKGZtdCk7XG5cdFx0fVxuXG5cdFx0dmFyIGxlZnRQYWQgPSBmdW5jdGlvbihuLCBwYWQpIHtcblx0XHRcdG4gPSBcIlwiICsgbjtcblx0XHRcdHBhZCA9IFwiXCIgKyAocGFkID09IG51bGwgPyBcIjBcIiA6IHBhZCk7XG5cdFx0XHRyZXR1cm4gbi5sZW5ndGggPT0gMSA/IHBhZCArIG4gOiBuO1xuXHRcdH07XG5cblx0XHR2YXIgciA9IFtdO1xuXHRcdHZhciBlc2NhcGUgPSBmYWxzZTtcblx0XHR2YXIgaG91cnMgPSBkLmdldEhvdXJzKCk7XG5cdFx0dmFyIGlzQU0gPSBob3VycyA8IDEyO1xuXG5cdFx0aWYgKG1vbnRoTmFtZXMgPT0gbnVsbCkge1xuXHRcdFx0bW9udGhOYW1lcyA9IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXTtcblx0XHR9XG5cblx0XHRpZiAoZGF5TmFtZXMgPT0gbnVsbCkge1xuXHRcdFx0ZGF5TmFtZXMgPSBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl07XG5cdFx0fVxuXG5cdFx0dmFyIGhvdXJzMTI7XG5cblx0XHRpZiAoaG91cnMgPiAxMikge1xuXHRcdFx0aG91cnMxMiA9IGhvdXJzIC0gMTI7XG5cdFx0fSBlbHNlIGlmIChob3VycyA9PSAwKSB7XG5cdFx0XHRob3VyczEyID0gMTI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhvdXJzMTIgPSBob3Vycztcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGZtdC5sZW5ndGg7ICsraSkge1xuXG5cdFx0XHR2YXIgYyA9IGZtdC5jaGFyQXQoaSk7XG5cblx0XHRcdGlmIChlc2NhcGUpIHtcblx0XHRcdFx0c3dpdGNoIChjKSB7XG5cdFx0XHRcdFx0Y2FzZSAnYSc6IGMgPSBcIlwiICsgZGF5TmFtZXNbZC5nZXREYXkoKV07IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2InOiBjID0gXCJcIiArIG1vbnRoTmFtZXNbZC5nZXRNb250aCgpXTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnZCc6IGMgPSBsZWZ0UGFkKGQuZ2V0RGF0ZSgpKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnZSc6IGMgPSBsZWZ0UGFkKGQuZ2V0RGF0ZSgpLCBcIiBcIik7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2gnOlx0Ly8gRm9yIGJhY2stY29tcGF0IHdpdGggMC43OyByZW1vdmUgaW4gMS4wXG5cdFx0XHRcdFx0Y2FzZSAnSCc6IGMgPSBsZWZ0UGFkKGhvdXJzKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnSSc6IGMgPSBsZWZ0UGFkKGhvdXJzMTIpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdsJzogYyA9IGxlZnRQYWQoaG91cnMxMiwgXCIgXCIpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdtJzogYyA9IGxlZnRQYWQoZC5nZXRNb250aCgpICsgMSk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ00nOiBjID0gbGVmdFBhZChkLmdldE1pbnV0ZXMoKSk7IGJyZWFrO1xuXHRcdFx0XHRcdC8vIHF1YXJ0ZXJzIG5vdCBpbiBPcGVuIEdyb3VwJ3Mgc3RyZnRpbWUgc3BlY2lmaWNhdGlvblxuXHRcdFx0XHRcdGNhc2UgJ3EnOlxuXHRcdFx0XHRcdFx0YyA9IFwiXCIgKyAoTWF0aC5mbG9vcihkLmdldE1vbnRoKCkgLyAzKSArIDEpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdTJzogYyA9IGxlZnRQYWQoZC5nZXRTZWNvbmRzKCkpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICd5JzogYyA9IGxlZnRQYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnWSc6IGMgPSBcIlwiICsgZC5nZXRGdWxsWWVhcigpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdwJzogYyA9IChpc0FNKSA/IChcIlwiICsgXCJhbVwiKSA6IChcIlwiICsgXCJwbVwiKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnUCc6IGMgPSAoaXNBTSkgPyAoXCJcIiArIFwiQU1cIikgOiAoXCJcIiArIFwiUE1cIik7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3cnOiBjID0gXCJcIiArIGQuZ2V0RGF5KCk7IGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHIucHVzaChjKTtcblx0XHRcdFx0ZXNjYXBlID0gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoYyA9PSBcIiVcIikge1xuXHRcdFx0XHRcdGVzY2FwZSA9IHRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ci5wdXNoKGMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHIuam9pbihcIlwiKTtcblx0fVxuXG5cdC8vIFRvIGhhdmUgYSBjb25zaXN0ZW50IHZpZXcgb2YgdGltZS1iYXNlZCBkYXRhIGluZGVwZW5kZW50IG9mIHdoaWNoIHRpbWVcblx0Ly8gem9uZSB0aGUgY2xpZW50IGhhcHBlbnMgdG8gYmUgaW4gd2UgbmVlZCBhIGRhdGUtbGlrZSBvYmplY3QgaW5kZXBlbmRlbnRcblx0Ly8gb2YgdGltZSB6b25lcy4gIFRoaXMgaXMgZG9uZSB0aHJvdWdoIGEgd3JhcHBlciB0aGF0IG9ubHkgY2FsbHMgdGhlIFVUQ1xuXHQvLyB2ZXJzaW9ucyBvZiB0aGUgYWNjZXNzb3IgbWV0aG9kcy5cblxuXHRmdW5jdGlvbiBtYWtlVXRjV3JhcHBlcihkKSB7XG5cblx0XHRmdW5jdGlvbiBhZGRQcm94eU1ldGhvZChzb3VyY2VPYmosIHNvdXJjZU1ldGhvZCwgdGFyZ2V0T2JqLCB0YXJnZXRNZXRob2QpIHtcblx0XHRcdHNvdXJjZU9ialtzb3VyY2VNZXRob2RdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB0YXJnZXRPYmpbdGFyZ2V0TWV0aG9kXS5hcHBseSh0YXJnZXRPYmosIGFyZ3VtZW50cyk7XG5cdFx0XHR9O1xuXHRcdH07XG5cblx0XHR2YXIgdXRjID0ge1xuXHRcdFx0ZGF0ZTogZFxuXHRcdH07XG5cblx0XHQvLyBzdXBwb3J0IHN0cmZ0aW1lLCBpZiBmb3VuZFxuXG5cdFx0aWYgKGQuc3RyZnRpbWUgIT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhZGRQcm94eU1ldGhvZCh1dGMsIFwic3RyZnRpbWVcIiwgZCwgXCJzdHJmdGltZVwiKTtcblx0XHR9XG5cblx0XHRhZGRQcm94eU1ldGhvZCh1dGMsIFwiZ2V0VGltZVwiLCBkLCBcImdldFRpbWVcIik7XG5cdFx0YWRkUHJveHlNZXRob2QodXRjLCBcInNldFRpbWVcIiwgZCwgXCJzZXRUaW1lXCIpO1xuXG5cdFx0dmFyIHByb3BzID0gW1wiRGF0ZVwiLCBcIkRheVwiLCBcIkZ1bGxZZWFyXCIsIFwiSG91cnNcIiwgXCJNaWxsaXNlY29uZHNcIiwgXCJNaW51dGVzXCIsIFwiTW9udGhcIiwgXCJTZWNvbmRzXCJdO1xuXG5cdFx0Zm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xuXHRcdFx0YWRkUHJveHlNZXRob2QodXRjLCBcImdldFwiICsgcHJvcHNbcF0sIGQsIFwiZ2V0VVRDXCIgKyBwcm9wc1twXSk7XG5cdFx0XHRhZGRQcm94eU1ldGhvZCh1dGMsIFwic2V0XCIgKyBwcm9wc1twXSwgZCwgXCJzZXRVVENcIiArIHByb3BzW3BdKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdXRjO1xuXHR9O1xuXG5cdC8vIHNlbGVjdCB0aW1lIHpvbmUgc3RyYXRlZ3kuICBUaGlzIHJldHVybnMgYSBkYXRlLWxpa2Ugb2JqZWN0IHRpZWQgdG8gdGhlXG5cdC8vIGRlc2lyZWQgdGltZXpvbmVcblxuXHRmdW5jdGlvbiBkYXRlR2VuZXJhdG9yKHRzLCBvcHRzKSB7XG5cdFx0aWYgKG9wdHMudGltZXpvbmUgPT0gXCJicm93c2VyXCIpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZSh0cyk7XG5cdFx0fSBlbHNlIGlmICghb3B0cy50aW1lem9uZSB8fCBvcHRzLnRpbWV6b25lID09IFwidXRjXCIpIHtcblx0XHRcdHJldHVybiBtYWtlVXRjV3JhcHBlcihuZXcgRGF0ZSh0cykpO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHRpbWV6b25lSlMgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGltZXpvbmVKUy5EYXRlICE9IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBkID0gbmV3IHRpbWV6b25lSlMuRGF0ZSgpO1xuXHRcdFx0Ly8gdGltZXpvbmUtanMgaXMgZmlja2xlLCBzbyBiZSBzdXJlIHRvIHNldCB0aGUgdGltZSB6b25lIGJlZm9yZVxuXHRcdFx0Ly8gc2V0dGluZyB0aGUgdGltZS5cblx0XHRcdGQuc2V0VGltZXpvbmUob3B0cy50aW1lem9uZSk7XG5cdFx0XHRkLnNldFRpbWUodHMpO1xuXHRcdFx0cmV0dXJuIGQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBtYWtlVXRjV3JhcHBlcihuZXcgRGF0ZSh0cykpO1xuXHRcdH1cblx0fVxuXHRcblx0Ly8gbWFwIG9mIGFwcC4gc2l6ZSBvZiB0aW1lIHVuaXRzIGluIG1pbGxpc2Vjb25kc1xuXG5cdHZhciB0aW1lVW5pdFNpemUgPSB7XG5cdFx0XCJzZWNvbmRcIjogMTAwMCxcblx0XHRcIm1pbnV0ZVwiOiA2MCAqIDEwMDAsXG5cdFx0XCJob3VyXCI6IDYwICogNjAgKiAxMDAwLFxuXHRcdFwiZGF5XCI6IDI0ICogNjAgKiA2MCAqIDEwMDAsXG5cdFx0XCJtb250aFwiOiAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDAsXG5cdFx0XCJxdWFydGVyXCI6IDMgKiAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDAsXG5cdFx0XCJ5ZWFyXCI6IDM2NS4yNDI1ICogMjQgKiA2MCAqIDYwICogMTAwMFxuXHR9O1xuXG5cdC8vIHRoZSBhbGxvd2VkIHRpY2sgc2l6ZXMsIGFmdGVyIDEgeWVhciB3ZSB1c2Vcblx0Ly8gYW4gaW50ZWdlciBhbGdvcml0aG1cblxuXHR2YXIgYmFzZVNwZWMgPSBbXG5cdFx0WzEsIFwic2Vjb25kXCJdLCBbMiwgXCJzZWNvbmRcIl0sIFs1LCBcInNlY29uZFwiXSwgWzEwLCBcInNlY29uZFwiXSxcblx0XHRbMzAsIFwic2Vjb25kXCJdLCBcblx0XHRbMSwgXCJtaW51dGVcIl0sIFsyLCBcIm1pbnV0ZVwiXSwgWzUsIFwibWludXRlXCJdLCBbMTAsIFwibWludXRlXCJdLFxuXHRcdFszMCwgXCJtaW51dGVcIl0sIFxuXHRcdFsxLCBcImhvdXJcIl0sIFsyLCBcImhvdXJcIl0sIFs0LCBcImhvdXJcIl0sXG5cdFx0WzgsIFwiaG91clwiXSwgWzEyLCBcImhvdXJcIl0sXG5cdFx0WzEsIFwiZGF5XCJdLCBbMiwgXCJkYXlcIl0sIFszLCBcImRheVwiXSxcblx0XHRbMC4yNSwgXCJtb250aFwiXSwgWzAuNSwgXCJtb250aFwiXSwgWzEsIFwibW9udGhcIl0sXG5cdFx0WzIsIFwibW9udGhcIl1cblx0XTtcblxuXHQvLyB3ZSBkb24ndCBrbm93IHdoaWNoIHZhcmlhbnQocykgd2UnbGwgbmVlZCB5ZXQsIGJ1dCBnZW5lcmF0aW5nIGJvdGggaXNcblx0Ly8gY2hlYXBcblxuXHR2YXIgc3BlY01vbnRocyA9IGJhc2VTcGVjLmNvbmNhdChbWzMsIFwibW9udGhcIl0sIFs2LCBcIm1vbnRoXCJdLFxuXHRcdFsxLCBcInllYXJcIl1dKTtcblx0dmFyIHNwZWNRdWFydGVycyA9IGJhc2VTcGVjLmNvbmNhdChbWzEsIFwicXVhcnRlclwiXSwgWzIsIFwicXVhcnRlclwiXSxcblx0XHRbMSwgXCJ5ZWFyXCJdXSk7XG5cblx0ZnVuY3Rpb24gaW5pdChwbG90KSB7XG5cdFx0cGxvdC5ob29rcy5wcm9jZXNzT3B0aW9ucy5wdXNoKGZ1bmN0aW9uIChwbG90LCBvcHRpb25zKSB7XG5cdFx0XHQkLmVhY2gocGxvdC5nZXRBeGVzKCksIGZ1bmN0aW9uKGF4aXNOYW1lLCBheGlzKSB7XG5cblx0XHRcdFx0dmFyIG9wdHMgPSBheGlzLm9wdGlvbnM7XG5cblx0XHRcdFx0aWYgKG9wdHMubW9kZSA9PSBcInRpbWVcIikge1xuXHRcdFx0XHRcdGF4aXMudGlja0dlbmVyYXRvciA9IGZ1bmN0aW9uKGF4aXMpIHtcblxuXHRcdFx0XHRcdFx0dmFyIHRpY2tzID0gW107XG5cdFx0XHRcdFx0XHR2YXIgZCA9IGRhdGVHZW5lcmF0b3IoYXhpcy5taW4sIG9wdHMpO1xuXHRcdFx0XHRcdFx0dmFyIG1pblNpemUgPSAwO1xuXG5cdFx0XHRcdFx0XHQvLyBtYWtlIHF1YXJ0ZXIgdXNlIGEgcG9zc2liaWxpdHkgaWYgcXVhcnRlcnMgYXJlXG5cdFx0XHRcdFx0XHQvLyBtZW50aW9uZWQgaW4gZWl0aGVyIG9mIHRoZXNlIG9wdGlvbnNcblxuXHRcdFx0XHRcdFx0dmFyIHNwZWMgPSAob3B0cy50aWNrU2l6ZSAmJiBvcHRzLnRpY2tTaXplWzFdID09PVxuXHRcdFx0XHRcdFx0XHRcInF1YXJ0ZXJcIikgfHxcblx0XHRcdFx0XHRcdFx0KG9wdHMubWluVGlja1NpemUgJiYgb3B0cy5taW5UaWNrU2l6ZVsxXSA9PT1cblx0XHRcdFx0XHRcdFx0XCJxdWFydGVyXCIpID8gc3BlY1F1YXJ0ZXJzIDogc3BlY01vbnRocztcblxuXHRcdFx0XHRcdFx0aWYgKG9wdHMubWluVGlja1NpemUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIG9wdHMudGlja1NpemUgPT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdFx0XHRcdG1pblNpemUgPSBvcHRzLnRpY2tTaXplO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG1pblNpemUgPSBvcHRzLm1pblRpY2tTaXplWzBdICogdGltZVVuaXRTaXplW29wdHMubWluVGlja1NpemVbMV1dO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3BlYy5sZW5ndGggLSAxOyArK2kpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGF4aXMuZGVsdGEgPCAoc3BlY1tpXVswXSAqIHRpbWVVbml0U2l6ZVtzcGVjW2ldWzFdXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgKyBzcGVjW2kgKyAxXVswXSAqIHRpbWVVbml0U2l6ZVtzcGVjW2kgKyAxXVsxXV0pIC8gMlxuXHRcdFx0XHRcdFx0XHRcdCYmIHNwZWNbaV1bMF0gKiB0aW1lVW5pdFNpemVbc3BlY1tpXVsxXV0gPj0gbWluU2l6ZSkge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBzaXplID0gc3BlY1tpXVswXTtcblx0XHRcdFx0XHRcdHZhciB1bml0ID0gc3BlY1tpXVsxXTtcblxuXHRcdFx0XHRcdFx0Ly8gc3BlY2lhbC1jYXNlIHRoZSBwb3NzaWJpbGl0eSBvZiBzZXZlcmFsIHllYXJzXG5cblx0XHRcdFx0XHRcdGlmICh1bml0ID09IFwieWVhclwiKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gaWYgZ2l2ZW4gYSBtaW5UaWNrU2l6ZSBpbiB5ZWFycywganVzdCB1c2UgaXQsXG5cdFx0XHRcdFx0XHRcdC8vIGVuc3VyaW5nIHRoYXQgaXQncyBhbiBpbnRlZ2VyXG5cblx0XHRcdFx0XHRcdFx0aWYgKG9wdHMubWluVGlja1NpemUgIT0gbnVsbCAmJiBvcHRzLm1pblRpY2tTaXplWzFdID09IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2l6ZSA9IE1hdGguZmxvb3Iob3B0cy5taW5UaWNrU2l6ZVswXSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0XHR2YXIgbWFnbiA9IE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKGF4aXMuZGVsdGEgLyB0aW1lVW5pdFNpemUueWVhcikgLyBNYXRoLkxOMTApKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbm9ybSA9IChheGlzLmRlbHRhIC8gdGltZVVuaXRTaXplLnllYXIpIC8gbWFnbjtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChub3JtIDwgMS41KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplID0gMTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG5vcm0gPCAzKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplID0gMjtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG5vcm0gPCA3LjUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNpemUgPSA1O1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplID0gMTA7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZSAqPSBtYWduO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8gbWluaW11bSBzaXplIGZvciB5ZWFycyBpcyAxXG5cblx0XHRcdFx0XHRcdFx0aWYgKHNpemUgPCAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2l6ZSA9IDE7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YXhpcy50aWNrU2l6ZSA9IG9wdHMudGlja1NpemUgfHwgW3NpemUsIHVuaXRdO1xuXHRcdFx0XHRcdFx0dmFyIHRpY2tTaXplID0gYXhpcy50aWNrU2l6ZVswXTtcblx0XHRcdFx0XHRcdHVuaXQgPSBheGlzLnRpY2tTaXplWzFdO1xuXG5cdFx0XHRcdFx0XHR2YXIgc3RlcCA9IHRpY2tTaXplICogdGltZVVuaXRTaXplW3VuaXRdO1xuXG5cdFx0XHRcdFx0XHRpZiAodW5pdCA9PSBcInNlY29uZFwiKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0U2Vjb25kcyhmbG9vckluQmFzZShkLmdldFNlY29uZHMoKSwgdGlja1NpemUpKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodW5pdCA9PSBcIm1pbnV0ZVwiKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TWludXRlcyhmbG9vckluQmFzZShkLmdldE1pbnV0ZXMoKSwgdGlja1NpemUpKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodW5pdCA9PSBcImhvdXJcIikge1xuXHRcdFx0XHRcdFx0XHRkLnNldEhvdXJzKGZsb29ySW5CYXNlKGQuZ2V0SG91cnMoKSwgdGlja1NpemUpKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodW5pdCA9PSBcIm1vbnRoXCIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aChmbG9vckluQmFzZShkLmdldE1vbnRoKCksIHRpY2tTaXplKSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVuaXQgPT0gXCJxdWFydGVyXCIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aCgzICogZmxvb3JJbkJhc2UoZC5nZXRNb250aCgpIC8gMyxcblx0XHRcdFx0XHRcdFx0XHR0aWNrU2l6ZSkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1bml0ID09IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0RnVsbFllYXIoZmxvb3JJbkJhc2UoZC5nZXRGdWxsWWVhcigpLCB0aWNrU2l6ZSkpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyByZXNldCBzbWFsbGVyIGNvbXBvbmVudHNcblxuXHRcdFx0XHRcdFx0ZC5zZXRNaWxsaXNlY29uZHMoMCk7XG5cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS5taW51dGUpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRTZWNvbmRzKDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLmhvdXIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNaW51dGVzKDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLmRheSkge1xuXHRcdFx0XHRcdFx0XHRkLnNldEhvdXJzKDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLmRheSAqIDQpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXREYXRlKDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLm1vbnRoICogMikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKGZsb29ySW5CYXNlKGQuZ2V0TW9udGgoKSwgMykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLnF1YXJ0ZXIgKiAyKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoZmxvb3JJbkJhc2UoZC5nZXRNb250aCgpLCA2KSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUueWVhcikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKDApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgY2FycnkgPSAwO1xuXHRcdFx0XHRcdFx0dmFyIHYgPSBOdW1iZXIuTmFOO1xuXHRcdFx0XHRcdFx0dmFyIHByZXY7XG5cblx0XHRcdFx0XHRcdGRvIHtcblxuXHRcdFx0XHRcdFx0XHRwcmV2ID0gdjtcblx0XHRcdFx0XHRcdFx0diA9IGQuZ2V0VGltZSgpO1xuXHRcdFx0XHRcdFx0XHR0aWNrcy5wdXNoKHYpO1xuXG5cdFx0XHRcdFx0XHRcdGlmICh1bml0ID09IFwibW9udGhcIiB8fCB1bml0ID09IFwicXVhcnRlclwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHRpY2tTaXplIDwgMSkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBhIGJpdCBjb21wbGljYXRlZCAtIHdlJ2xsIGRpdmlkZSB0aGVcblx0XHRcdFx0XHRcdFx0XHRcdC8vIG1vbnRoL3F1YXJ0ZXIgdXAgYnV0IHdlIG5lZWQgdG8gdGFrZVxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2FyZSBvZiBmcmFjdGlvbnMgc28gd2UgZG9uJ3QgZW5kIHVwIGluXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyB0aGUgbWlkZGxlIG9mIGEgZGF5XG5cblx0XHRcdFx0XHRcdFx0XHRcdGQuc2V0RGF0ZSgxKTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBzdGFydCA9IGQuZ2V0VGltZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aChkLmdldE1vbnRoKCkgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQodW5pdCA9PSBcInF1YXJ0ZXJcIiA/IDMgOiAxKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgZW5kID0gZC5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRkLnNldFRpbWUodiArIGNhcnJ5ICogdGltZVVuaXRTaXplLmhvdXIgKyAoZW5kIC0gc3RhcnQpICogdGlja1NpemUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2FycnkgPSBkLmdldEhvdXJzKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRkLnNldEhvdXJzKDApO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKGQuZ2V0TW9udGgoKSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRpY2tTaXplICogKHVuaXQgPT0gXCJxdWFydGVyXCIgPyAzIDogMSkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1bml0ID09IFwieWVhclwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5zZXRGdWxsWWVhcihkLmdldEZ1bGxZZWFyKCkgKyB0aWNrU2l6ZSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0ZC5zZXRUaW1lKHYgKyBzdGVwKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSB3aGlsZSAodiA8IGF4aXMubWF4ICYmIHYgIT0gcHJldik7XG5cblx0XHRcdFx0XHRcdHJldHVybiB0aWNrcztcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0YXhpcy50aWNrRm9ybWF0dGVyID0gZnVuY3Rpb24gKHYsIGF4aXMpIHtcblxuXHRcdFx0XHRcdFx0dmFyIGQgPSBkYXRlR2VuZXJhdG9yKHYsIGF4aXMub3B0aW9ucyk7XG5cblx0XHRcdFx0XHRcdC8vIGZpcnN0IGNoZWNrIGdsb2JhbCBmb3JtYXRcblxuXHRcdFx0XHRcdFx0aWYgKG9wdHMudGltZWZvcm1hdCAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmb3JtYXREYXRlKGQsIG9wdHMudGltZWZvcm1hdCwgb3B0cy5tb250aE5hbWVzLCBvcHRzLmRheU5hbWVzKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gcG9zc2libHkgdXNlIHF1YXJ0ZXJzIGlmIHF1YXJ0ZXJzIGFyZSBtZW50aW9uZWQgaW5cblx0XHRcdFx0XHRcdC8vIGFueSBvZiB0aGVzZSBwbGFjZXNcblxuXHRcdFx0XHRcdFx0dmFyIHVzZVF1YXJ0ZXJzID0gKGF4aXMub3B0aW9ucy50aWNrU2l6ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGF4aXMub3B0aW9ucy50aWNrU2l6ZVsxXSA9PSBcInF1YXJ0ZXJcIikgfHxcblx0XHRcdFx0XHRcdFx0KGF4aXMub3B0aW9ucy5taW5UaWNrU2l6ZSAmJlxuXHRcdFx0XHRcdFx0XHRcdGF4aXMub3B0aW9ucy5taW5UaWNrU2l6ZVsxXSA9PSBcInF1YXJ0ZXJcIik7XG5cblx0XHRcdFx0XHRcdHZhciB0ID0gYXhpcy50aWNrU2l6ZVswXSAqIHRpbWVVbml0U2l6ZVtheGlzLnRpY2tTaXplWzFdXTtcblx0XHRcdFx0XHRcdHZhciBzcGFuID0gYXhpcy5tYXggLSBheGlzLm1pbjtcblx0XHRcdFx0XHRcdHZhciBzdWZmaXggPSAob3B0cy50d2VsdmVIb3VyQ2xvY2spID8gXCIgJXBcIiA6IFwiXCI7XG5cdFx0XHRcdFx0XHR2YXIgaG91ckNvZGUgPSAob3B0cy50d2VsdmVIb3VyQ2xvY2spID8gXCIlSVwiIDogXCIlSFwiO1xuXHRcdFx0XHRcdFx0dmFyIGZtdDtcblxuXHRcdFx0XHRcdFx0aWYgKHQgPCB0aW1lVW5pdFNpemUubWludXRlKSB7XG5cdFx0XHRcdFx0XHRcdGZtdCA9IGhvdXJDb2RlICsgXCI6JU06JVNcIiArIHN1ZmZpeDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodCA8IHRpbWVVbml0U2l6ZS5kYXkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNwYW4gPCAyICogdGltZVVuaXRTaXplLmRheSkge1xuXHRcdFx0XHRcdFx0XHRcdGZtdCA9IGhvdXJDb2RlICsgXCI6JU1cIiArIHN1ZmZpeDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRmbXQgPSBcIiViICVkIFwiICsgaG91ckNvZGUgKyBcIjolTVwiICsgc3VmZml4O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHQgPCB0aW1lVW5pdFNpemUubW9udGgpIHtcblx0XHRcdFx0XHRcdFx0Zm10ID0gXCIlYiAlZFwiO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICgodXNlUXVhcnRlcnMgJiYgdCA8IHRpbWVVbml0U2l6ZS5xdWFydGVyKSB8fFxuXHRcdFx0XHRcdFx0XHQoIXVzZVF1YXJ0ZXJzICYmIHQgPCB0aW1lVW5pdFNpemUueWVhcikpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNwYW4gPCB0aW1lVW5pdFNpemUueWVhcikge1xuXHRcdFx0XHRcdFx0XHRcdGZtdCA9IFwiJWJcIjtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRmbXQgPSBcIiViICVZXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXNlUXVhcnRlcnMgJiYgdCA8IHRpbWVVbml0U2l6ZS55ZWFyKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzcGFuIDwgdGltZVVuaXRTaXplLnllYXIpIHtcblx0XHRcdFx0XHRcdFx0XHRmbXQgPSBcIlElcVwiO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGZtdCA9IFwiUSVxICVZXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGZtdCA9IFwiJVlcIjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIHJ0ID0gZm9ybWF0RGF0ZShkLCBmbXQsIG9wdHMubW9udGhOYW1lcywgb3B0cy5kYXlOYW1lcyk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBydDtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdCQucGxvdC5wbHVnaW5zLnB1c2goe1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcblx0XHRuYW1lOiAndGltZScsXG5cdFx0dmVyc2lvbjogJzEuMCdcblx0fSk7XG5cblx0Ly8gVGltZS1heGlzIHN1cHBvcnQgdXNlZCB0byBiZSBpbiBGbG90IGNvcmUsIHdoaWNoIGV4cG9zZWQgdGhlXG5cdC8vIGZvcm1hdERhdGUgZnVuY3Rpb24gb24gdGhlIHBsb3Qgb2JqZWN0LiAgVmFyaW91cyBwbHVnaW5zIGRlcGVuZFxuXHQvLyBvbiB0aGUgZnVuY3Rpb24sIHNvIHdlIG5lZWQgdG8gcmUtZXhwb3NlIGl0IGhlcmUuXG5cblx0JC5wbG90LmZvcm1hdERhdGUgPSBmb3JtYXREYXRlO1xuXHQkLnBsb3QuZGF0ZUdlbmVyYXRvciA9IGRhdGVHZW5lcmF0b3I7XG5cbn0pKGpRdWVyeSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKiFcbiAqIERhdGVwaWNrZXIgZm9yIEJvb3RzdHJhcCB2MS44LjAgKGh0dHBzOi8vZ2l0aHViLmNvbS91eHNvbHV0aW9ucy9ib290c3RyYXAtZGF0ZXBpY2tlcilcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgdjIuMCAoaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wKVxuICovXG5cbiFmdW5jdGlvbihhKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImpxdWVyeVwiXSxhKTphKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP3JlcXVpcmUoXCJqcXVlcnlcIik6alF1ZXJ5KX0oZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKCl7cmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KERhdGUsYXJndW1lbnRzKSl9ZnVuY3Rpb24gZCgpe3ZhciBhPW5ldyBEYXRlO3JldHVybiBjKGEuZ2V0RnVsbFllYXIoKSxhLmdldE1vbnRoKCksYS5nZXREYXRlKCkpfWZ1bmN0aW9uIGUoYSxiKXtyZXR1cm4gYS5nZXRVVENGdWxsWWVhcigpPT09Yi5nZXRVVENGdWxsWWVhcigpJiZhLmdldFVUQ01vbnRoKCk9PT1iLmdldFVUQ01vbnRoKCkmJmEuZ2V0VVRDRGF0ZSgpPT09Yi5nZXRVVENEYXRlKCl9ZnVuY3Rpb24gZihjLGQpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBkIT09YiYmYS5mbi5kYXRlcGlja2VyLmRlcHJlY2F0ZWQoZCksdGhpc1tjXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIGcoYSl7cmV0dXJuIGEmJiFpc05hTihhLmdldFRpbWUoKSl9ZnVuY3Rpb24gaChiLGMpe2Z1bmN0aW9uIGQoYSxiKXtyZXR1cm4gYi50b0xvd2VyQ2FzZSgpfXZhciBlLGY9YShiKS5kYXRhKCksZz17fSxoPW5ldyBSZWdFeHAoXCJeXCIrYy50b0xvd2VyQ2FzZSgpK1wiKFtBLVpdKVwiKTtjPW5ldyBSZWdFeHAoXCJeXCIrYy50b0xvd2VyQ2FzZSgpKTtmb3IodmFyIGkgaW4gZiljLnRlc3QoaSkmJihlPWkucmVwbGFjZShoLGQpLGdbZV09ZltpXSk7cmV0dXJuIGd9ZnVuY3Rpb24gaShiKXt2YXIgYz17fTtpZihxW2JdfHwoYj1iLnNwbGl0KFwiLVwiKVswXSxxW2JdKSl7dmFyIGQ9cVtiXTtyZXR1cm4gYS5lYWNoKHAsZnVuY3Rpb24oYSxiKXtiIGluIGQmJihjW2JdPWRbYl0pfSksY319dmFyIGo9ZnVuY3Rpb24oKXt2YXIgYj17Z2V0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnNsaWNlKGEpWzBdfSxjb250YWluczpmdW5jdGlvbihhKXtmb3IodmFyIGI9YSYmYS52YWx1ZU9mKCksYz0wLGQ9dGhpcy5sZW5ndGg7YzxkO2MrKylpZigwPD10aGlzW2NdLnZhbHVlT2YoKS1iJiZ0aGlzW2NdLnZhbHVlT2YoKS1iPDg2NGU1KXJldHVybiBjO3JldHVybi0xfSxyZW1vdmU6ZnVuY3Rpb24oYSl7dGhpcy5zcGxpY2UoYSwxKX0scmVwbGFjZTpmdW5jdGlvbihiKXtiJiYoYS5pc0FycmF5KGIpfHwoYj1bYl0pLHRoaXMuY2xlYXIoKSx0aGlzLnB1c2guYXBwbHkodGhpcyxiKSl9LGNsZWFyOmZ1bmN0aW9uKCl7dGhpcy5sZW5ndGg9MH0sY29weTpmdW5jdGlvbigpe3ZhciBhPW5ldyBqO3JldHVybiBhLnJlcGxhY2UodGhpcyksYX19O3JldHVybiBmdW5jdGlvbigpe3ZhciBjPVtdO3JldHVybiBjLnB1c2guYXBwbHkoYyxhcmd1bWVudHMpLGEuZXh0ZW5kKGMsYiksY319KCksaz1mdW5jdGlvbihiLGMpe2EuZGF0YShiLFwiZGF0ZXBpY2tlclwiLHRoaXMpLHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyhjKSx0aGlzLmRhdGVzPW5ldyBqLHRoaXMudmlld0RhdGU9dGhpcy5vLmRlZmF1bHRWaWV3RGF0ZSx0aGlzLmZvY3VzRGF0ZT1udWxsLHRoaXMuZWxlbWVudD1hKGIpLHRoaXMuaXNJbnB1dD10aGlzLmVsZW1lbnQuaXMoXCJpbnB1dFwiKSx0aGlzLmlucHV0RmllbGQ9dGhpcy5pc0lucHV0P3RoaXMuZWxlbWVudDp0aGlzLmVsZW1lbnQuZmluZChcImlucHV0XCIpLHRoaXMuY29tcG9uZW50PSEhdGhpcy5lbGVtZW50Lmhhc0NsYXNzKFwiZGF0ZVwiKSYmdGhpcy5lbGVtZW50LmZpbmQoXCIuYWRkLW9uLCAuaW5wdXQtZ3JvdXAtYWRkb24sIC5idG5cIiksdGhpcy5jb21wb25lbnQmJjA9PT10aGlzLmNvbXBvbmVudC5sZW5ndGgmJih0aGlzLmNvbXBvbmVudD0hMSksdGhpcy5pc0lubGluZT0hdGhpcy5jb21wb25lbnQmJnRoaXMuZWxlbWVudC5pcyhcImRpdlwiKSx0aGlzLnBpY2tlcj1hKHIudGVtcGxhdGUpLHRoaXMuX2NoZWNrX3RlbXBsYXRlKHRoaXMuby50ZW1wbGF0ZXMubGVmdEFycm93KSYmdGhpcy5waWNrZXIuZmluZChcIi5wcmV2XCIpLmh0bWwodGhpcy5vLnRlbXBsYXRlcy5sZWZ0QXJyb3cpLHRoaXMuX2NoZWNrX3RlbXBsYXRlKHRoaXMuby50ZW1wbGF0ZXMucmlnaHRBcnJvdykmJnRoaXMucGlja2VyLmZpbmQoXCIubmV4dFwiKS5odG1sKHRoaXMuby50ZW1wbGF0ZXMucmlnaHRBcnJvdyksdGhpcy5fYnVpbGRFdmVudHMoKSx0aGlzLl9hdHRhY2hFdmVudHMoKSx0aGlzLmlzSW5saW5lP3RoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1pbmxpbmVcIikuYXBwZW5kVG8odGhpcy5lbGVtZW50KTp0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItZHJvcGRvd24gZHJvcGRvd24tbWVudVwiKSx0aGlzLm8ucnRsJiZ0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItcnRsXCIpLHRoaXMuby5jYWxlbmRhcldlZWtzJiZ0aGlzLnBpY2tlci5maW5kKFwiLmRhdGVwaWNrZXItZGF5cyAuZGF0ZXBpY2tlci1zd2l0Y2gsIHRoZWFkIC5kYXRlcGlja2VyLXRpdGxlLCB0Zm9vdCAudG9kYXksIHRmb290IC5jbGVhclwiKS5hdHRyKFwiY29sc3BhblwiLGZ1bmN0aW9uKGEsYil7cmV0dXJuIE51bWJlcihiKSsxfSksdGhpcy5fcHJvY2Vzc19vcHRpb25zKHtzdGFydERhdGU6dGhpcy5fby5zdGFydERhdGUsZW5kRGF0ZTp0aGlzLl9vLmVuZERhdGUsZGF5c09mV2Vla0Rpc2FibGVkOnRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQsZGF5c09mV2Vla0hpZ2hsaWdodGVkOnRoaXMuby5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQsZGF0ZXNEaXNhYmxlZDp0aGlzLm8uZGF0ZXNEaXNhYmxlZH0pLHRoaXMuX2FsbG93X3VwZGF0ZT0hMSx0aGlzLnNldFZpZXdNb2RlKHRoaXMuby5zdGFydFZpZXcpLHRoaXMuX2FsbG93X3VwZGF0ZT0hMCx0aGlzLmZpbGxEb3coKSx0aGlzLmZpbGxNb250aHMoKSx0aGlzLnVwZGF0ZSgpLHRoaXMuaXNJbmxpbmUmJnRoaXMuc2hvdygpfTtrLnByb3RvdHlwZT17Y29uc3RydWN0b3I6ayxfcmVzb2x2ZVZpZXdOYW1lOmZ1bmN0aW9uKGIpe3JldHVybiBhLmVhY2goci52aWV3TW9kZXMsZnVuY3Rpb24oYyxkKXtpZihiPT09Y3x8YS5pbkFycmF5KGIsZC5uYW1lcykhPT0tMSlyZXR1cm4gYj1jLCExfSksYn0sX3Jlc29sdmVEYXlzT2ZXZWVrOmZ1bmN0aW9uKGIpe3JldHVybiBhLmlzQXJyYXkoYil8fChiPWIuc3BsaXQoL1ssXFxzXSovKSksYS5tYXAoYixOdW1iZXIpfSxfY2hlY2tfdGVtcGxhdGU6ZnVuY3Rpb24oYyl7dHJ5e2lmKGM9PT1ifHxcIlwiPT09YylyZXR1cm4hMTtpZigoYy5tYXRjaCgvWzw+XS9nKXx8W10pLmxlbmd0aDw9MClyZXR1cm4hMDt2YXIgZD1hKGMpO3JldHVybiBkLmxlbmd0aD4wfWNhdGNoKGEpe3JldHVybiExfX0sX3Byb2Nlc3Nfb3B0aW9uczpmdW5jdGlvbihiKXt0aGlzLl9vPWEuZXh0ZW5kKHt9LHRoaXMuX28sYik7dmFyIGU9dGhpcy5vPWEuZXh0ZW5kKHt9LHRoaXMuX28pLGY9ZS5sYW5ndWFnZTtxW2ZdfHwoZj1mLnNwbGl0KFwiLVwiKVswXSxxW2ZdfHwoZj1vLmxhbmd1YWdlKSksZS5sYW5ndWFnZT1mLGUuc3RhcnRWaWV3PXRoaXMuX3Jlc29sdmVWaWV3TmFtZShlLnN0YXJ0VmlldyksZS5taW5WaWV3TW9kZT10aGlzLl9yZXNvbHZlVmlld05hbWUoZS5taW5WaWV3TW9kZSksZS5tYXhWaWV3TW9kZT10aGlzLl9yZXNvbHZlVmlld05hbWUoZS5tYXhWaWV3TW9kZSksZS5zdGFydFZpZXc9TWF0aC5tYXgodGhpcy5vLm1pblZpZXdNb2RlLE1hdGgubWluKHRoaXMuby5tYXhWaWV3TW9kZSxlLnN0YXJ0VmlldykpLGUubXVsdGlkYXRlIT09ITAmJihlLm11bHRpZGF0ZT1OdW1iZXIoZS5tdWx0aWRhdGUpfHwhMSxlLm11bHRpZGF0ZSE9PSExJiYoZS5tdWx0aWRhdGU9TWF0aC5tYXgoMCxlLm11bHRpZGF0ZSkpKSxlLm11bHRpZGF0ZVNlcGFyYXRvcj1TdHJpbmcoZS5tdWx0aWRhdGVTZXBhcmF0b3IpLGUud2Vla1N0YXJ0JT03LGUud2Vla0VuZD0oZS53ZWVrU3RhcnQrNiklNzt2YXIgZz1yLnBhcnNlRm9ybWF0KGUuZm9ybWF0KTtlLnN0YXJ0RGF0ZSE9PS0oMS8wKSYmKGUuc3RhcnREYXRlP2Uuc3RhcnREYXRlIGluc3RhbmNlb2YgRGF0ZT9lLnN0YXJ0RGF0ZT10aGlzLl9sb2NhbF90b191dGModGhpcy5femVyb190aW1lKGUuc3RhcnREYXRlKSk6ZS5zdGFydERhdGU9ci5wYXJzZURhdGUoZS5zdGFydERhdGUsZyxlLmxhbmd1YWdlLGUuYXNzdW1lTmVhcmJ5WWVhcik6ZS5zdGFydERhdGU9LSgxLzApKSxlLmVuZERhdGUhPT0xLzAmJihlLmVuZERhdGU/ZS5lbmREYXRlIGluc3RhbmNlb2YgRGF0ZT9lLmVuZERhdGU9dGhpcy5fbG9jYWxfdG9fdXRjKHRoaXMuX3plcm9fdGltZShlLmVuZERhdGUpKTplLmVuZERhdGU9ci5wYXJzZURhdGUoZS5lbmREYXRlLGcsZS5sYW5ndWFnZSxlLmFzc3VtZU5lYXJieVllYXIpOmUuZW5kRGF0ZT0xLzApLGUuZGF5c09mV2Vla0Rpc2FibGVkPXRoaXMuX3Jlc29sdmVEYXlzT2ZXZWVrKGUuZGF5c09mV2Vla0Rpc2FibGVkfHxbXSksZS5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ9dGhpcy5fcmVzb2x2ZURheXNPZldlZWsoZS5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWR8fFtdKSxlLmRhdGVzRGlzYWJsZWQ9ZS5kYXRlc0Rpc2FibGVkfHxbXSxhLmlzQXJyYXkoZS5kYXRlc0Rpc2FibGVkKXx8KGUuZGF0ZXNEaXNhYmxlZD1lLmRhdGVzRGlzYWJsZWQuc3BsaXQoXCIsXCIpKSxlLmRhdGVzRGlzYWJsZWQ9YS5tYXAoZS5kYXRlc0Rpc2FibGVkLGZ1bmN0aW9uKGEpe3JldHVybiByLnBhcnNlRGF0ZShhLGcsZS5sYW5ndWFnZSxlLmFzc3VtZU5lYXJieVllYXIpfSk7dmFyIGg9U3RyaW5nKGUub3JpZW50YXRpb24pLnRvTG93ZXJDYXNlKCkuc3BsaXQoL1xccysvZyksaT1lLm9yaWVudGF0aW9uLnRvTG93ZXJDYXNlKCk7aWYoaD1hLmdyZXAoaCxmdW5jdGlvbihhKXtyZXR1cm4vXmF1dG98bGVmdHxyaWdodHx0b3B8Ym90dG9tJC8udGVzdChhKX0pLGUub3JpZW50YXRpb249e3g6XCJhdXRvXCIseTpcImF1dG9cIn0saSYmXCJhdXRvXCIhPT1pKWlmKDE9PT1oLmxlbmd0aClzd2l0Y2goaFswXSl7Y2FzZVwidG9wXCI6Y2FzZVwiYm90dG9tXCI6ZS5vcmllbnRhdGlvbi55PWhbMF07YnJlYWs7Y2FzZVwibGVmdFwiOmNhc2VcInJpZ2h0XCI6ZS5vcmllbnRhdGlvbi54PWhbMF19ZWxzZSBpPWEuZ3JlcChoLGZ1bmN0aW9uKGEpe3JldHVybi9ebGVmdHxyaWdodCQvLnRlc3QoYSl9KSxlLm9yaWVudGF0aW9uLng9aVswXXx8XCJhdXRvXCIsaT1hLmdyZXAoaCxmdW5jdGlvbihhKXtyZXR1cm4vXnRvcHxib3R0b20kLy50ZXN0KGEpfSksZS5vcmllbnRhdGlvbi55PWlbMF18fFwiYXV0b1wiO2Vsc2U7aWYoZS5kZWZhdWx0Vmlld0RhdGUgaW5zdGFuY2VvZiBEYXRlfHxcInN0cmluZ1wiPT10eXBlb2YgZS5kZWZhdWx0Vmlld0RhdGUpZS5kZWZhdWx0Vmlld0RhdGU9ci5wYXJzZURhdGUoZS5kZWZhdWx0Vmlld0RhdGUsZyxlLmxhbmd1YWdlLGUuYXNzdW1lTmVhcmJ5WWVhcik7ZWxzZSBpZihlLmRlZmF1bHRWaWV3RGF0ZSl7dmFyIGo9ZS5kZWZhdWx0Vmlld0RhdGUueWVhcnx8KG5ldyBEYXRlKS5nZXRGdWxsWWVhcigpLGs9ZS5kZWZhdWx0Vmlld0RhdGUubW9udGh8fDAsbD1lLmRlZmF1bHRWaWV3RGF0ZS5kYXl8fDE7ZS5kZWZhdWx0Vmlld0RhdGU9YyhqLGssbCl9ZWxzZSBlLmRlZmF1bHRWaWV3RGF0ZT1kKCl9LF9ldmVudHM6W10sX3NlY29uZGFyeUV2ZW50czpbXSxfYXBwbHlFdmVudHM6ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGQsZSxmPTA7ZjxhLmxlbmd0aDtmKyspYz1hW2ZdWzBdLDI9PT1hW2ZdLmxlbmd0aD8oZD1iLGU9YVtmXVsxXSk6Mz09PWFbZl0ubGVuZ3RoJiYoZD1hW2ZdWzFdLGU9YVtmXVsyXSksYy5vbihlLGQpfSxfdW5hcHBseUV2ZW50czpmdW5jdGlvbihhKXtmb3IodmFyIGMsZCxlLGY9MDtmPGEubGVuZ3RoO2YrKyljPWFbZl1bMF0sMj09PWFbZl0ubGVuZ3RoPyhlPWIsZD1hW2ZdWzFdKTozPT09YVtmXS5sZW5ndGgmJihlPWFbZl1bMV0sZD1hW2ZdWzJdKSxjLm9mZihkLGUpfSxfYnVpbGRFdmVudHM6ZnVuY3Rpb24oKXt2YXIgYj17a2V5dXA6YS5wcm94eShmdW5jdGlvbihiKXthLmluQXJyYXkoYi5rZXlDb2RlLFsyNywzNywzOSwzOCw0MCwzMiwxMyw5XSk9PT0tMSYmdGhpcy51cGRhdGUoKX0sdGhpcyksa2V5ZG93bjphLnByb3h5KHRoaXMua2V5ZG93bix0aGlzKSxwYXN0ZTphLnByb3h5KHRoaXMucGFzdGUsdGhpcyl9O3RoaXMuby5zaG93T25Gb2N1cz09PSEwJiYoYi5mb2N1cz1hLnByb3h5KHRoaXMuc2hvdyx0aGlzKSksdGhpcy5pc0lucHV0P3RoaXMuX2V2ZW50cz1bW3RoaXMuZWxlbWVudCxiXV06dGhpcy5jb21wb25lbnQmJnRoaXMuaW5wdXRGaWVsZC5sZW5ndGg/dGhpcy5fZXZlbnRzPVtbdGhpcy5pbnB1dEZpZWxkLGJdLFt0aGlzLmNvbXBvbmVudCx7Y2xpY2s6YS5wcm94eSh0aGlzLnNob3csdGhpcyl9XV06dGhpcy5fZXZlbnRzPVtbdGhpcy5lbGVtZW50LHtjbGljazphLnByb3h5KHRoaXMuc2hvdyx0aGlzKSxrZXlkb3duOmEucHJveHkodGhpcy5rZXlkb3duLHRoaXMpfV1dLHRoaXMuX2V2ZW50cy5wdXNoKFt0aGlzLmVsZW1lbnQsXCIqXCIse2JsdXI6YS5wcm94eShmdW5jdGlvbihhKXt0aGlzLl9mb2N1c2VkX2Zyb209YS50YXJnZXR9LHRoaXMpfV0sW3RoaXMuZWxlbWVudCx7Ymx1cjphLnByb3h5KGZ1bmN0aW9uKGEpe3RoaXMuX2ZvY3VzZWRfZnJvbT1hLnRhcmdldH0sdGhpcyl9XSksdGhpcy5vLmltbWVkaWF0ZVVwZGF0ZXMmJnRoaXMuX2V2ZW50cy5wdXNoKFt0aGlzLmVsZW1lbnQse1wiY2hhbmdlWWVhciBjaGFuZ2VNb250aFwiOmEucHJveHkoZnVuY3Rpb24oYSl7dGhpcy51cGRhdGUoYS5kYXRlKX0sdGhpcyl9XSksdGhpcy5fc2Vjb25kYXJ5RXZlbnRzPVtbdGhpcy5waWNrZXIse2NsaWNrOmEucHJveHkodGhpcy5jbGljayx0aGlzKX1dLFt0aGlzLnBpY2tlcixcIi5wcmV2LCAubmV4dFwiLHtjbGljazphLnByb3h5KHRoaXMubmF2QXJyb3dzQ2xpY2ssdGhpcyl9XSxbdGhpcy5waWNrZXIsXCIuZGF5Om5vdCguZGlzYWJsZWQpXCIse2NsaWNrOmEucHJveHkodGhpcy5kYXlDZWxsQ2xpY2ssdGhpcyl9XSxbYSh3aW5kb3cpLHtyZXNpemU6YS5wcm94eSh0aGlzLnBsYWNlLHRoaXMpfV0sW2EoZG9jdW1lbnQpLHtcIm1vdXNlZG93biB0b3VjaHN0YXJ0XCI6YS5wcm94eShmdW5jdGlvbihhKXt0aGlzLmVsZW1lbnQuaXMoYS50YXJnZXQpfHx0aGlzLmVsZW1lbnQuZmluZChhLnRhcmdldCkubGVuZ3RofHx0aGlzLnBpY2tlci5pcyhhLnRhcmdldCl8fHRoaXMucGlja2VyLmZpbmQoYS50YXJnZXQpLmxlbmd0aHx8dGhpcy5pc0lubGluZXx8dGhpcy5oaWRlKCl9LHRoaXMpfV1dfSxfYXR0YWNoRXZlbnRzOmZ1bmN0aW9uKCl7dGhpcy5fZGV0YWNoRXZlbnRzKCksdGhpcy5fYXBwbHlFdmVudHModGhpcy5fZXZlbnRzKX0sX2RldGFjaEV2ZW50czpmdW5jdGlvbigpe3RoaXMuX3VuYXBwbHlFdmVudHModGhpcy5fZXZlbnRzKX0sX2F0dGFjaFNlY29uZGFyeUV2ZW50czpmdW5jdGlvbigpe3RoaXMuX2RldGFjaFNlY29uZGFyeUV2ZW50cygpLHRoaXMuX2FwcGx5RXZlbnRzKHRoaXMuX3NlY29uZGFyeUV2ZW50cyl9LF9kZXRhY2hTZWNvbmRhcnlFdmVudHM6ZnVuY3Rpb24oKXt0aGlzLl91bmFwcGx5RXZlbnRzKHRoaXMuX3NlY29uZGFyeUV2ZW50cyl9LF90cmlnZ2VyOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9Y3x8dGhpcy5kYXRlcy5nZXQoLTEpLGU9dGhpcy5fdXRjX3RvX2xvY2FsKGQpO3RoaXMuZWxlbWVudC50cmlnZ2VyKHt0eXBlOmIsZGF0ZTplLHZpZXdNb2RlOnRoaXMudmlld01vZGUsZGF0ZXM6YS5tYXAodGhpcy5kYXRlcyx0aGlzLl91dGNfdG9fbG9jYWwpLGZvcm1hdDphLnByb3h5KGZ1bmN0aW9uKGEsYil7MD09PWFyZ3VtZW50cy5sZW5ndGg/KGE9dGhpcy5kYXRlcy5sZW5ndGgtMSxiPXRoaXMuby5mb3JtYXQpOlwic3RyaW5nXCI9PXR5cGVvZiBhJiYoYj1hLGE9dGhpcy5kYXRlcy5sZW5ndGgtMSksYj1ifHx0aGlzLm8uZm9ybWF0O3ZhciBjPXRoaXMuZGF0ZXMuZ2V0KGEpO3JldHVybiByLmZvcm1hdERhdGUoYyxiLHRoaXMuby5sYW5ndWFnZSl9LHRoaXMpfSl9LHNob3c6ZnVuY3Rpb24oKXtpZighKHRoaXMuaW5wdXRGaWVsZC5wcm9wKFwiZGlzYWJsZWRcIil8fHRoaXMuaW5wdXRGaWVsZC5wcm9wKFwicmVhZG9ubHlcIikmJnRoaXMuby5lbmFibGVPblJlYWRvbmx5PT09ITEpKXJldHVybiB0aGlzLmlzSW5saW5lfHx0aGlzLnBpY2tlci5hcHBlbmRUbyh0aGlzLm8uY29udGFpbmVyKSx0aGlzLnBsYWNlKCksdGhpcy5waWNrZXIuc2hvdygpLHRoaXMuX2F0dGFjaFNlY29uZGFyeUV2ZW50cygpLHRoaXMuX3RyaWdnZXIoXCJzaG93XCIpLCh3aW5kb3cubmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHN8fFwib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudCkmJnRoaXMuby5kaXNhYmxlVG91Y2hLZXlib2FyZCYmYSh0aGlzLmVsZW1lbnQpLmJsdXIoKSx0aGlzfSxoaWRlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaXNJbmxpbmV8fCF0aGlzLnBpY2tlci5pcyhcIjp2aXNpYmxlXCIpP3RoaXM6KHRoaXMuZm9jdXNEYXRlPW51bGwsdGhpcy5waWNrZXIuaGlkZSgpLmRldGFjaCgpLHRoaXMuX2RldGFjaFNlY29uZGFyeUV2ZW50cygpLHRoaXMuc2V0Vmlld01vZGUodGhpcy5vLnN0YXJ0VmlldyksdGhpcy5vLmZvcmNlUGFyc2UmJnRoaXMuaW5wdXRGaWVsZC52YWwoKSYmdGhpcy5zZXRWYWx1ZSgpLHRoaXMuX3RyaWdnZXIoXCJoaWRlXCIpLHRoaXMpfSxkZXN0cm95OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuaGlkZSgpLHRoaXMuX2RldGFjaEV2ZW50cygpLHRoaXMuX2RldGFjaFNlY29uZGFyeUV2ZW50cygpLHRoaXMucGlja2VyLnJlbW92ZSgpLGRlbGV0ZSB0aGlzLmVsZW1lbnQuZGF0YSgpLmRhdGVwaWNrZXIsdGhpcy5pc0lucHV0fHxkZWxldGUgdGhpcy5lbGVtZW50LmRhdGEoKS5kYXRlLHRoaXN9LHBhc3RlOmZ1bmN0aW9uKGIpe3ZhciBjO2lmKGIub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhJiZiLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS50eXBlcyYmYS5pbkFycmF5KFwidGV4dC9wbGFpblwiLGIub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhLnR5cGVzKSE9PS0xKWM9Yi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEuZ2V0RGF0YShcInRleHQvcGxhaW5cIik7ZWxzZXtpZighd2luZG93LmNsaXBib2FyZERhdGEpcmV0dXJuO2M9d2luZG93LmNsaXBib2FyZERhdGEuZ2V0RGF0YShcIlRleHRcIil9dGhpcy5zZXREYXRlKGMpLHRoaXMudXBkYXRlKCksYi5wcmV2ZW50RGVmYXVsdCgpfSxfdXRjX3RvX2xvY2FsOmZ1bmN0aW9uKGEpe2lmKCFhKXJldHVybiBhO3ZhciBiPW5ldyBEYXRlKGEuZ2V0VGltZSgpKzZlNCphLmdldFRpbWV6b25lT2Zmc2V0KCkpO3JldHVybiBiLmdldFRpbWV6b25lT2Zmc2V0KCkhPT1hLmdldFRpbWV6b25lT2Zmc2V0KCkmJihiPW5ldyBEYXRlKGEuZ2V0VGltZSgpKzZlNCpiLmdldFRpbWV6b25lT2Zmc2V0KCkpKSxifSxfbG9jYWxfdG9fdXRjOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZuZXcgRGF0ZShhLmdldFRpbWUoKS02ZTQqYS5nZXRUaW1lem9uZU9mZnNldCgpKX0sX3plcm9fdGltZTpmdW5jdGlvbihhKXtyZXR1cm4gYSYmbmV3IERhdGUoYS5nZXRGdWxsWWVhcigpLGEuZ2V0TW9udGgoKSxhLmdldERhdGUoKSl9LF96ZXJvX3V0Y190aW1lOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZjKGEuZ2V0VVRDRnVsbFllYXIoKSxhLmdldFVUQ01vbnRoKCksYS5nZXRVVENEYXRlKCkpfSxnZXREYXRlczpmdW5jdGlvbigpe3JldHVybiBhLm1hcCh0aGlzLmRhdGVzLHRoaXMuX3V0Y190b19sb2NhbCl9LGdldFVUQ0RhdGVzOmZ1bmN0aW9uKCl7cmV0dXJuIGEubWFwKHRoaXMuZGF0ZXMsZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBEYXRlKGEpfSl9LGdldERhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fdXRjX3RvX2xvY2FsKHRoaXMuZ2V0VVRDRGF0ZSgpKX0sZ2V0VVRDRGF0ZTpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZGF0ZXMuZ2V0KC0xKTtyZXR1cm4gYSE9PWI/bmV3IERhdGUoYSk6bnVsbH0sY2xlYXJEYXRlczpmdW5jdGlvbigpe3RoaXMuaW5wdXRGaWVsZC52YWwoXCJcIiksdGhpcy51cGRhdGUoKSx0aGlzLl90cmlnZ2VyKFwiY2hhbmdlRGF0ZVwiKSx0aGlzLm8uYXV0b2Nsb3NlJiZ0aGlzLmhpZGUoKX0sc2V0RGF0ZXM6ZnVuY3Rpb24oKXt2YXIgYj1hLmlzQXJyYXkoYXJndW1lbnRzWzBdKT9hcmd1bWVudHNbMF06YXJndW1lbnRzO3JldHVybiB0aGlzLnVwZGF0ZS5hcHBseSh0aGlzLGIpLHRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VEYXRlXCIpLHRoaXMuc2V0VmFsdWUoKSx0aGlzfSxzZXRVVENEYXRlczpmdW5jdGlvbigpe3ZhciBiPWEuaXNBcnJheShhcmd1bWVudHNbMF0pP2FyZ3VtZW50c1swXTphcmd1bWVudHM7cmV0dXJuIHRoaXMuc2V0RGF0ZXMuYXBwbHkodGhpcyxhLm1hcChiLHRoaXMuX3V0Y190b19sb2NhbCkpLHRoaXN9LHNldERhdGU6ZihcInNldERhdGVzXCIpLHNldFVUQ0RhdGU6ZihcInNldFVUQ0RhdGVzXCIpLHJlbW92ZTpmKFwiZGVzdHJveVwiLFwiTWV0aG9kIGByZW1vdmVgIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDIuMC4gVXNlIGBkZXN0cm95YCBpbnN0ZWFkXCIpLHNldFZhbHVlOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5nZXRGb3JtYXR0ZWREYXRlKCk7cmV0dXJuIHRoaXMuaW5wdXRGaWVsZC52YWwoYSksdGhpc30sZ2V0Rm9ybWF0dGVkRGF0ZTpmdW5jdGlvbihjKXtjPT09YiYmKGM9dGhpcy5vLmZvcm1hdCk7dmFyIGQ9dGhpcy5vLmxhbmd1YWdlO3JldHVybiBhLm1hcCh0aGlzLmRhdGVzLGZ1bmN0aW9uKGEpe3JldHVybiByLmZvcm1hdERhdGUoYSxjLGQpfSkuam9pbih0aGlzLm8ubXVsdGlkYXRlU2VwYXJhdG9yKX0sZ2V0U3RhcnREYXRlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuby5zdGFydERhdGV9LHNldFN0YXJ0RGF0ZTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fcHJvY2Vzc19vcHRpb25zKHtzdGFydERhdGU6YX0pLHRoaXMudXBkYXRlKCksdGhpcy51cGRhdGVOYXZBcnJvd3MoKSx0aGlzfSxnZXRFbmREYXRlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuby5lbmREYXRlfSxzZXRFbmREYXRlOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9wcm9jZXNzX29wdGlvbnMoe2VuZERhdGU6YX0pLHRoaXMudXBkYXRlKCksdGhpcy51cGRhdGVOYXZBcnJvd3MoKSx0aGlzfSxzZXREYXlzT2ZXZWVrRGlzYWJsZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7ZGF5c09mV2Vla0Rpc2FibGVkOmF9KSx0aGlzLnVwZGF0ZSgpLHRoaXN9LHNldERheXNPZldlZWtIaWdobGlnaHRlZDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fcHJvY2Vzc19vcHRpb25zKHtkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6YX0pLHRoaXMudXBkYXRlKCksdGhpc30sc2V0RGF0ZXNEaXNhYmxlZDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fcHJvY2Vzc19vcHRpb25zKHtkYXRlc0Rpc2FibGVkOmF9KSx0aGlzLnVwZGF0ZSgpLHRoaXN9LHBsYWNlOmZ1bmN0aW9uKCl7aWYodGhpcy5pc0lubGluZSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLnBpY2tlci5vdXRlcldpZHRoKCksYz10aGlzLnBpY2tlci5vdXRlckhlaWdodCgpLGQ9MTAsZT1hKHRoaXMuby5jb250YWluZXIpLGY9ZS53aWR0aCgpLGc9XCJib2R5XCI9PT10aGlzLm8uY29udGFpbmVyP2EoZG9jdW1lbnQpLnNjcm9sbFRvcCgpOmUuc2Nyb2xsVG9wKCksaD1lLm9mZnNldCgpLGk9WzBdO3RoaXMuZWxlbWVudC5wYXJlbnRzKCkuZWFjaChmdW5jdGlvbigpe3ZhciBiPWEodGhpcykuY3NzKFwiei1pbmRleFwiKTtcImF1dG9cIiE9PWImJjAhPT1OdW1iZXIoYikmJmkucHVzaChOdW1iZXIoYikpfSk7dmFyIGo9TWF0aC5tYXguYXBwbHkoTWF0aCxpKSt0aGlzLm8uekluZGV4T2Zmc2V0LGs9dGhpcy5jb21wb25lbnQ/dGhpcy5jb21wb25lbnQucGFyZW50KCkub2Zmc2V0KCk6dGhpcy5lbGVtZW50Lm9mZnNldCgpLGw9dGhpcy5jb21wb25lbnQ/dGhpcy5jb21wb25lbnQub3V0ZXJIZWlnaHQoITApOnRoaXMuZWxlbWVudC5vdXRlckhlaWdodCghMSksbT10aGlzLmNvbXBvbmVudD90aGlzLmNvbXBvbmVudC5vdXRlcldpZHRoKCEwKTp0aGlzLmVsZW1lbnQub3V0ZXJXaWR0aCghMSksbj1rLmxlZnQtaC5sZWZ0LG89ay50b3AtaC50b3A7XCJib2R5XCIhPT10aGlzLm8uY29udGFpbmVyJiYobys9ZyksdGhpcy5waWNrZXIucmVtb3ZlQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC10b3AgZGF0ZXBpY2tlci1vcmllbnQtYm90dG9tIGRhdGVwaWNrZXItb3JpZW50LXJpZ2h0IGRhdGVwaWNrZXItb3JpZW50LWxlZnRcIiksXCJhdXRvXCIhPT10aGlzLm8ub3JpZW50YXRpb24ueD8odGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC1cIit0aGlzLm8ub3JpZW50YXRpb24ueCksXCJyaWdodFwiPT09dGhpcy5vLm9yaWVudGF0aW9uLngmJihuLT1iLW0pKTprLmxlZnQ8MD8odGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC1sZWZ0XCIpLG4tPWsubGVmdC1kKTpuK2I+Zj8odGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC1yaWdodFwiKSxuKz1tLWIpOnRoaXMuby5ydGw/dGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC1yaWdodFwiKTp0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LWxlZnRcIik7dmFyIHAscT10aGlzLm8ub3JpZW50YXRpb24ueTtpZihcImF1dG9cIj09PXEmJihwPS1nK28tYyxxPXA8MD9cImJvdHRvbVwiOlwidG9wXCIpLHRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtXCIrcSksXCJ0b3BcIj09PXE/by09YytwYXJzZUludCh0aGlzLnBpY2tlci5jc3MoXCJwYWRkaW5nLXRvcFwiKSk6bys9bCx0aGlzLm8ucnRsKXt2YXIgcj1mLShuK20pO3RoaXMucGlja2VyLmNzcyh7dG9wOm8scmlnaHQ6cix6SW5kZXg6an0pfWVsc2UgdGhpcy5waWNrZXIuY3NzKHt0b3A6byxsZWZ0Om4sekluZGV4Omp9KTtyZXR1cm4gdGhpc30sX2FsbG93X3VwZGF0ZTohMCx1cGRhdGU6ZnVuY3Rpb24oKXtpZighdGhpcy5fYWxsb3dfdXBkYXRlKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuZGF0ZXMuY29weSgpLGM9W10sZD0hMTtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8oYS5lYWNoKGFyZ3VtZW50cyxhLnByb3h5KGZ1bmN0aW9uKGEsYil7YiBpbnN0YW5jZW9mIERhdGUmJihiPXRoaXMuX2xvY2FsX3RvX3V0YyhiKSksYy5wdXNoKGIpfSx0aGlzKSksZD0hMCk6KGM9dGhpcy5pc0lucHV0P3RoaXMuZWxlbWVudC52YWwoKTp0aGlzLmVsZW1lbnQuZGF0YShcImRhdGVcIil8fHRoaXMuaW5wdXRGaWVsZC52YWwoKSxjPWMmJnRoaXMuby5tdWx0aWRhdGU/Yy5zcGxpdCh0aGlzLm8ubXVsdGlkYXRlU2VwYXJhdG9yKTpbY10sZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZSksYz1hLm1hcChjLGEucHJveHkoZnVuY3Rpb24oYSl7cmV0dXJuIHIucGFyc2VEYXRlKGEsdGhpcy5vLmZvcm1hdCx0aGlzLm8ubGFuZ3VhZ2UsdGhpcy5vLmFzc3VtZU5lYXJieVllYXIpfSx0aGlzKSksYz1hLmdyZXAoYyxhLnByb3h5KGZ1bmN0aW9uKGEpe3JldHVybiF0aGlzLmRhdGVXaXRoaW5SYW5nZShhKXx8IWF9LHRoaXMpLCEwKSx0aGlzLmRhdGVzLnJlcGxhY2UoYyksdGhpcy5vLnVwZGF0ZVZpZXdEYXRlJiYodGhpcy5kYXRlcy5sZW5ndGg/dGhpcy52aWV3RGF0ZT1uZXcgRGF0ZSh0aGlzLmRhdGVzLmdldCgtMSkpOnRoaXMudmlld0RhdGU8dGhpcy5vLnN0YXJ0RGF0ZT90aGlzLnZpZXdEYXRlPW5ldyBEYXRlKHRoaXMuby5zdGFydERhdGUpOnRoaXMudmlld0RhdGU+dGhpcy5vLmVuZERhdGU/dGhpcy52aWV3RGF0ZT1uZXcgRGF0ZSh0aGlzLm8uZW5kRGF0ZSk6dGhpcy52aWV3RGF0ZT10aGlzLm8uZGVmYXVsdFZpZXdEYXRlKSxkPyh0aGlzLnNldFZhbHVlKCksdGhpcy5lbGVtZW50LmNoYW5nZSgpKTp0aGlzLmRhdGVzLmxlbmd0aCYmU3RyaW5nKGIpIT09U3RyaW5nKHRoaXMuZGF0ZXMpJiZkJiYodGhpcy5fdHJpZ2dlcihcImNoYW5nZURhdGVcIiksdGhpcy5lbGVtZW50LmNoYW5nZSgpKSwhdGhpcy5kYXRlcy5sZW5ndGgmJmIubGVuZ3RoJiYodGhpcy5fdHJpZ2dlcihcImNsZWFyRGF0ZVwiKSx0aGlzLmVsZW1lbnQuY2hhbmdlKCkpLHRoaXMuZmlsbCgpLHRoaXN9LGZpbGxEb3c6ZnVuY3Rpb24oKXtpZih0aGlzLm8uc2hvd1dlZWtEYXlzKXt2YXIgYj10aGlzLm8ud2Vla1N0YXJ0LGM9XCI8dHI+XCI7Zm9yKHRoaXMuby5jYWxlbmRhcldlZWtzJiYoYys9Jzx0aCBjbGFzcz1cImN3XCI+JiMxNjA7PC90aD4nKTtiPHRoaXMuby53ZWVrU3RhcnQrNzspYys9Jzx0aCBjbGFzcz1cImRvdycsYS5pbkFycmF5KGIsdGhpcy5vLmRheXNPZldlZWtEaXNhYmxlZCkhPT0tMSYmKGMrPVwiIGRpc2FibGVkXCIpLGMrPSdcIj4nK3FbdGhpcy5vLmxhbmd1YWdlXS5kYXlzTWluW2IrKyU3XStcIjwvdGg+XCI7Yys9XCI8L3RyPlwiLHRoaXMucGlja2VyLmZpbmQoXCIuZGF0ZXBpY2tlci1kYXlzIHRoZWFkXCIpLmFwcGVuZChjKX19LGZpbGxNb250aHM6ZnVuY3Rpb24oKXtmb3IodmFyIGEsYj10aGlzLl91dGNfdG9fbG9jYWwodGhpcy52aWV3RGF0ZSksYz1cIlwiLGQ9MDtkPDEyO2QrKylhPWImJmIuZ2V0TW9udGgoKT09PWQ/XCIgZm9jdXNlZFwiOlwiXCIsYys9JzxzcGFuIGNsYXNzPVwibW9udGgnK2ErJ1wiPicrcVt0aGlzLm8ubGFuZ3VhZ2VdLm1vbnRoc1Nob3J0W2RdK1wiPC9zcGFuPlwiO3RoaXMucGlja2VyLmZpbmQoXCIuZGF0ZXBpY2tlci1tb250aHMgdGRcIikuaHRtbChjKX0sc2V0UmFuZ2U6ZnVuY3Rpb24oYil7YiYmYi5sZW5ndGg/dGhpcy5yYW5nZT1hLm1hcChiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnZhbHVlT2YoKX0pOmRlbGV0ZSB0aGlzLnJhbmdlLHRoaXMuZmlsbCgpfSxnZXRDbGFzc05hbWVzOmZ1bmN0aW9uKGIpe3ZhciBjPVtdLGY9dGhpcy52aWV3RGF0ZS5nZXRVVENGdWxsWWVhcigpLGc9dGhpcy52aWV3RGF0ZS5nZXRVVENNb250aCgpLGg9ZCgpO3JldHVybiBiLmdldFVUQ0Z1bGxZZWFyKCk8Znx8Yi5nZXRVVENGdWxsWWVhcigpPT09ZiYmYi5nZXRVVENNb250aCgpPGc/Yy5wdXNoKFwib2xkXCIpOihiLmdldFVUQ0Z1bGxZZWFyKCk+Znx8Yi5nZXRVVENGdWxsWWVhcigpPT09ZiYmYi5nZXRVVENNb250aCgpPmcpJiZjLnB1c2goXCJuZXdcIiksdGhpcy5mb2N1c0RhdGUmJmIudmFsdWVPZigpPT09dGhpcy5mb2N1c0RhdGUudmFsdWVPZigpJiZjLnB1c2goXCJmb2N1c2VkXCIpLHRoaXMuby50b2RheUhpZ2hsaWdodCYmZShiLGgpJiZjLnB1c2goXCJ0b2RheVwiKSx0aGlzLmRhdGVzLmNvbnRhaW5zKGIpIT09LTEmJmMucHVzaChcImFjdGl2ZVwiKSx0aGlzLmRhdGVXaXRoaW5SYW5nZShiKXx8Yy5wdXNoKFwiZGlzYWJsZWRcIiksdGhpcy5kYXRlSXNEaXNhYmxlZChiKSYmYy5wdXNoKFwiZGlzYWJsZWRcIixcImRpc2FibGVkLWRhdGVcIiksYS5pbkFycmF5KGIuZ2V0VVRDRGF5KCksdGhpcy5vLmRheXNPZldlZWtIaWdobGlnaHRlZCkhPT0tMSYmYy5wdXNoKFwiaGlnaGxpZ2h0ZWRcIiksdGhpcy5yYW5nZSYmKGI+dGhpcy5yYW5nZVswXSYmYjx0aGlzLnJhbmdlW3RoaXMucmFuZ2UubGVuZ3RoLTFdJiZjLnB1c2goXCJyYW5nZVwiKSxhLmluQXJyYXkoYi52YWx1ZU9mKCksdGhpcy5yYW5nZSkhPT0tMSYmYy5wdXNoKFwic2VsZWN0ZWRcIiksYi52YWx1ZU9mKCk9PT10aGlzLnJhbmdlWzBdJiZjLnB1c2goXCJyYW5nZS1zdGFydFwiKSxiLnZhbHVlT2YoKT09PXRoaXMucmFuZ2VbdGhpcy5yYW5nZS5sZW5ndGgtMV0mJmMucHVzaChcInJhbmdlLWVuZFwiKSksY30sX2ZpbGxfeWVhcnNWaWV3OmZ1bmN0aW9uKGMsZCxlLGYsZyxoLGkpe2Zvcih2YXIgaixrLGwsbT1cIlwiLG49ZS8xMCxvPXRoaXMucGlja2VyLmZpbmQoYykscD1NYXRoLmZsb29yKGYvZSkqZSxxPXArOSpuLHI9TWF0aC5mbG9vcih0aGlzLnZpZXdEYXRlLmdldEZ1bGxZZWFyKCkvbikqbixzPWEubWFwKHRoaXMuZGF0ZXMsZnVuY3Rpb24oYSl7cmV0dXJuIE1hdGguZmxvb3IoYS5nZXRVVENGdWxsWWVhcigpL24pKm59KSx0PXAtbjt0PD1xK247dCs9bilqPVtkXSxrPW51bGwsdD09PXAtbj9qLnB1c2goXCJvbGRcIik6dD09PXErbiYmai5wdXNoKFwibmV3XCIpLGEuaW5BcnJheSh0LHMpIT09LTEmJmoucHVzaChcImFjdGl2ZVwiKSwodDxnfHx0PmgpJiZqLnB1c2goXCJkaXNhYmxlZFwiKSx0PT09ciYmai5wdXNoKFwiZm9jdXNlZFwiKSxpIT09YS5ub29wJiYobD1pKG5ldyBEYXRlKHQsMCwxKSksbD09PWI/bD17fTpcImJvb2xlYW5cIj09dHlwZW9mIGw/bD17ZW5hYmxlZDpsfTpcInN0cmluZ1wiPT10eXBlb2YgbCYmKGw9e2NsYXNzZXM6bH0pLGwuZW5hYmxlZD09PSExJiZqLnB1c2goXCJkaXNhYmxlZFwiKSxsLmNsYXNzZXMmJihqPWouY29uY2F0KGwuY2xhc3Nlcy5zcGxpdCgvXFxzKy8pKSksbC50b29sdGlwJiYoaz1sLnRvb2x0aXApKSxtKz0nPHNwYW4gY2xhc3M9XCInK2ouam9pbihcIiBcIikrJ1wiJysoaz8nIHRpdGxlPVwiJytrKydcIic6XCJcIikrXCI+XCIrdCtcIjwvc3Bhbj5cIjtvLmZpbmQoXCIuZGF0ZXBpY2tlci1zd2l0Y2hcIikudGV4dChwK1wiLVwiK3EpLG8uZmluZChcInRkXCIpLmh0bWwobSl9LGZpbGw6ZnVuY3Rpb24oKXt2YXIgZCxlLGY9bmV3IERhdGUodGhpcy52aWV3RGF0ZSksZz1mLmdldFVUQ0Z1bGxZZWFyKCksaD1mLmdldFVUQ01vbnRoKCksaT10aGlzLm8uc3RhcnREYXRlIT09LSgxLzApP3RoaXMuby5zdGFydERhdGUuZ2V0VVRDRnVsbFllYXIoKTotKDEvMCksaj10aGlzLm8uc3RhcnREYXRlIT09LSgxLzApP3RoaXMuby5zdGFydERhdGUuZ2V0VVRDTW9udGgoKTotKDEvMCksaz10aGlzLm8uZW5kRGF0ZSE9PTEvMD90aGlzLm8uZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpOjEvMCxsPXRoaXMuby5lbmREYXRlIT09MS8wP3RoaXMuby5lbmREYXRlLmdldFVUQ01vbnRoKCk6MS8wLG09cVt0aGlzLm8ubGFuZ3VhZ2VdLnRvZGF5fHxxLmVuLnRvZGF5fHxcIlwiLG49cVt0aGlzLm8ubGFuZ3VhZ2VdLmNsZWFyfHxxLmVuLmNsZWFyfHxcIlwiLG89cVt0aGlzLm8ubGFuZ3VhZ2VdLnRpdGxlRm9ybWF0fHxxLmVuLnRpdGxlRm9ybWF0O2lmKCFpc05hTihnKSYmIWlzTmFOKGgpKXt0aGlzLnBpY2tlci5maW5kKFwiLmRhdGVwaWNrZXItZGF5cyAuZGF0ZXBpY2tlci1zd2l0Y2hcIikudGV4dChyLmZvcm1hdERhdGUoZixvLHRoaXMuby5sYW5ndWFnZSkpLHRoaXMucGlja2VyLmZpbmQoXCJ0Zm9vdCAudG9kYXlcIikudGV4dChtKS5jc3MoXCJkaXNwbGF5XCIsdGhpcy5vLnRvZGF5QnRuPT09ITB8fFwibGlua2VkXCI9PT10aGlzLm8udG9kYXlCdG4/XCJ0YWJsZS1jZWxsXCI6XCJub25lXCIpLHRoaXMucGlja2VyLmZpbmQoXCJ0Zm9vdCAuY2xlYXJcIikudGV4dChuKS5jc3MoXCJkaXNwbGF5XCIsdGhpcy5vLmNsZWFyQnRuPT09ITA/XCJ0YWJsZS1jZWxsXCI6XCJub25lXCIpLHRoaXMucGlja2VyLmZpbmQoXCJ0aGVhZCAuZGF0ZXBpY2tlci10aXRsZVwiKS50ZXh0KHRoaXMuby50aXRsZSkuY3NzKFwiZGlzcGxheVwiLFwic3RyaW5nXCI9PXR5cGVvZiB0aGlzLm8udGl0bGUmJlwiXCIhPT10aGlzLm8udGl0bGU/XCJ0YWJsZS1jZWxsXCI6XCJub25lXCIpLHRoaXMudXBkYXRlTmF2QXJyb3dzKCksdGhpcy5maWxsTW9udGhzKCk7dmFyIHA9YyhnLGgsMCkscz1wLmdldFVUQ0RhdGUoKTtwLnNldFVUQ0RhdGUocy0ocC5nZXRVVENEYXkoKS10aGlzLm8ud2Vla1N0YXJ0KzcpJTcpO3ZhciB0PW5ldyBEYXRlKHApO3AuZ2V0VVRDRnVsbFllYXIoKTwxMDAmJnQuc2V0VVRDRnVsbFllYXIocC5nZXRVVENGdWxsWWVhcigpKSx0LnNldFVUQ0RhdGUodC5nZXRVVENEYXRlKCkrNDIpLHQ9dC52YWx1ZU9mKCk7Zm9yKHZhciB1LHYsdz1bXTtwLnZhbHVlT2YoKTx0Oyl7aWYodT1wLmdldFVUQ0RheSgpLHU9PT10aGlzLm8ud2Vla1N0YXJ0JiYody5wdXNoKFwiPHRyPlwiKSx0aGlzLm8uY2FsZW5kYXJXZWVrcykpe3ZhciB4PW5ldyBEYXRlKCtwKyh0aGlzLm8ud2Vla1N0YXJ0LXUtNyklNyo4NjRlNSkseT1uZXcgRGF0ZShOdW1iZXIoeCkrKDExLXguZ2V0VVRDRGF5KCkpJTcqODY0ZTUpLHo9bmV3IERhdGUoTnVtYmVyKHo9Yyh5LmdldFVUQ0Z1bGxZZWFyKCksMCwxKSkrKDExLXouZ2V0VVRDRGF5KCkpJTcqODY0ZTUpLEE9KHkteikvODY0ZTUvNysxO3cucHVzaCgnPHRkIGNsYXNzPVwiY3dcIj4nK0ErXCI8L3RkPlwiKX12PXRoaXMuZ2V0Q2xhc3NOYW1lcyhwKSx2LnB1c2goXCJkYXlcIik7dmFyIEI9cC5nZXRVVENEYXRlKCk7dGhpcy5vLmJlZm9yZVNob3dEYXkhPT1hLm5vb3AmJihlPXRoaXMuby5iZWZvcmVTaG93RGF5KHRoaXMuX3V0Y190b19sb2NhbChwKSksZT09PWI/ZT17fTpcImJvb2xlYW5cIj09dHlwZW9mIGU/ZT17ZW5hYmxlZDplfTpcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9e2NsYXNzZXM6ZX0pLGUuZW5hYmxlZD09PSExJiZ2LnB1c2goXCJkaXNhYmxlZFwiKSxlLmNsYXNzZXMmJih2PXYuY29uY2F0KGUuY2xhc3Nlcy5zcGxpdCgvXFxzKy8pKSksZS50b29sdGlwJiYoZD1lLnRvb2x0aXApLGUuY29udGVudCYmKEI9ZS5jb250ZW50KSksdj1hLmlzRnVuY3Rpb24oYS51bmlxdWVTb3J0KT9hLnVuaXF1ZVNvcnQodik6YS51bmlxdWUodiksdy5wdXNoKCc8dGQgY2xhc3M9XCInK3Yuam9pbihcIiBcIikrJ1wiJysoZD8nIHRpdGxlPVwiJytkKydcIic6XCJcIikrJyBkYXRhLWRhdGU9XCInK3AuZ2V0VGltZSgpLnRvU3RyaW5nKCkrJ1wiPicrQitcIjwvdGQ+XCIpLGQ9bnVsbCx1PT09dGhpcy5vLndlZWtFbmQmJncucHVzaChcIjwvdHI+XCIpLHAuc2V0VVRDRGF0ZShwLmdldFVUQ0RhdGUoKSsxKX10aGlzLnBpY2tlci5maW5kKFwiLmRhdGVwaWNrZXItZGF5cyB0Ym9keVwiKS5odG1sKHcuam9pbihcIlwiKSk7dmFyIEM9cVt0aGlzLm8ubGFuZ3VhZ2VdLm1vbnRoc1RpdGxlfHxxLmVuLm1vbnRoc1RpdGxlfHxcIk1vbnRoc1wiLEQ9dGhpcy5waWNrZXIuZmluZChcIi5kYXRlcGlja2VyLW1vbnRoc1wiKS5maW5kKFwiLmRhdGVwaWNrZXItc3dpdGNoXCIpLnRleHQodGhpcy5vLm1heFZpZXdNb2RlPDI/QzpnKS5lbmQoKS5maW5kKFwidGJvZHkgc3BhblwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtpZihhLmVhY2godGhpcy5kYXRlcyxmdW5jdGlvbihhLGIpe2IuZ2V0VVRDRnVsbFllYXIoKT09PWcmJkQuZXEoYi5nZXRVVENNb250aCgpKS5hZGRDbGFzcyhcImFjdGl2ZVwiKX0pLChnPGl8fGc+aykmJkQuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKSxnPT09aSYmRC5zbGljZSgwLGopLmFkZENsYXNzKFwiZGlzYWJsZWRcIiksZz09PWsmJkQuc2xpY2UobCsxKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpLHRoaXMuby5iZWZvcmVTaG93TW9udGghPT1hLm5vb3Ape3ZhciBFPXRoaXM7YS5lYWNoKEQsZnVuY3Rpb24oYyxkKXt2YXIgZT1uZXcgRGF0ZShnLGMsMSksZj1FLm8uYmVmb3JlU2hvd01vbnRoKGUpO2Y9PT1iP2Y9e306XCJib29sZWFuXCI9PXR5cGVvZiBmP2Y9e2VuYWJsZWQ6Zn06XCJzdHJpbmdcIj09dHlwZW9mIGYmJihmPXtjbGFzc2VzOmZ9KSxmLmVuYWJsZWQhPT0hMXx8YShkKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpfHxhKGQpLmFkZENsYXNzKFwiZGlzYWJsZWRcIiksZi5jbGFzc2VzJiZhKGQpLmFkZENsYXNzKGYuY2xhc3NlcyksZi50b29sdGlwJiZhKGQpLnByb3AoXCJ0aXRsZVwiLGYudG9vbHRpcCl9KX10aGlzLl9maWxsX3llYXJzVmlldyhcIi5kYXRlcGlja2VyLXllYXJzXCIsXCJ5ZWFyXCIsMTAsZyxpLGssdGhpcy5vLmJlZm9yZVNob3dZZWFyKSx0aGlzLl9maWxsX3llYXJzVmlldyhcIi5kYXRlcGlja2VyLWRlY2FkZXNcIixcImRlY2FkZVwiLDEwMCxnLGksayx0aGlzLm8uYmVmb3JlU2hvd0RlY2FkZSksdGhpcy5fZmlsbF95ZWFyc1ZpZXcoXCIuZGF0ZXBpY2tlci1jZW50dXJpZXNcIixcImNlbnR1cnlcIiwxZTMsZyxpLGssdGhpcy5vLmJlZm9yZVNob3dDZW50dXJ5KX19LHVwZGF0ZU5hdkFycm93czpmdW5jdGlvbigpe2lmKHRoaXMuX2FsbG93X3VwZGF0ZSl7dmFyIGEsYixjPW5ldyBEYXRlKHRoaXMudmlld0RhdGUpLGQ9Yy5nZXRVVENGdWxsWWVhcigpLGU9Yy5nZXRVVENNb250aCgpLGY9dGhpcy5vLnN0YXJ0RGF0ZSE9PS0oMS8wKT90aGlzLm8uc3RhcnREYXRlLmdldFVUQ0Z1bGxZZWFyKCk6LSgxLzApLGc9dGhpcy5vLnN0YXJ0RGF0ZSE9PS0oMS8wKT90aGlzLm8uc3RhcnREYXRlLmdldFVUQ01vbnRoKCk6LSgxLzApLGg9dGhpcy5vLmVuZERhdGUhPT0xLzA/dGhpcy5vLmVuZERhdGUuZ2V0VVRDRnVsbFllYXIoKToxLzAsaT10aGlzLm8uZW5kRGF0ZSE9PTEvMD90aGlzLm8uZW5kRGF0ZS5nZXRVVENNb250aCgpOjEvMCxqPTE7c3dpdGNoKHRoaXMudmlld01vZGUpe2Nhc2UgNDpqKj0xMDtjYXNlIDM6aio9MTA7Y2FzZSAyOmoqPTEwO2Nhc2UgMTphPU1hdGguZmxvb3IoZC9qKSpqPGYsYj1NYXRoLmZsb29yKGQvaikqaitqPmg7YnJlYWs7Y2FzZSAwOmE9ZDw9ZiYmZTxnLGI9ZD49aCYmZT5pfXRoaXMucGlja2VyLmZpbmQoXCIucHJldlwiKS50b2dnbGVDbGFzcyhcImRpc2FibGVkXCIsYSksdGhpcy5waWNrZXIuZmluZChcIi5uZXh0XCIpLnRvZ2dsZUNsYXNzKFwiZGlzYWJsZWRcIixiKX19LGNsaWNrOmZ1bmN0aW9uKGIpe2IucHJldmVudERlZmF1bHQoKSxiLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBlLGYsZyxoO2U9YShiLnRhcmdldCksZS5oYXNDbGFzcyhcImRhdGVwaWNrZXItc3dpdGNoXCIpJiZ0aGlzLnZpZXdNb2RlIT09dGhpcy5vLm1heFZpZXdNb2RlJiZ0aGlzLnNldFZpZXdNb2RlKHRoaXMudmlld01vZGUrMSksZS5oYXNDbGFzcyhcInRvZGF5XCIpJiYhZS5oYXNDbGFzcyhcImRheVwiKSYmKHRoaXMuc2V0Vmlld01vZGUoMCksdGhpcy5fc2V0RGF0ZShkKCksXCJsaW5rZWRcIj09PXRoaXMuby50b2RheUJ0bj9udWxsOlwidmlld1wiKSksZS5oYXNDbGFzcyhcImNsZWFyXCIpJiZ0aGlzLmNsZWFyRGF0ZXMoKSxlLmhhc0NsYXNzKFwiZGlzYWJsZWRcIil8fChlLmhhc0NsYXNzKFwibW9udGhcIil8fGUuaGFzQ2xhc3MoXCJ5ZWFyXCIpfHxlLmhhc0NsYXNzKFwiZGVjYWRlXCIpfHxlLmhhc0NsYXNzKFwiY2VudHVyeVwiKSkmJih0aGlzLnZpZXdEYXRlLnNldFVUQ0RhdGUoMSksZj0xLDE9PT10aGlzLnZpZXdNb2RlPyhoPWUucGFyZW50KCkuZmluZChcInNwYW5cIikuaW5kZXgoZSksZz10aGlzLnZpZXdEYXRlLmdldFVUQ0Z1bGxZZWFyKCksdGhpcy52aWV3RGF0ZS5zZXRVVENNb250aChoKSk6KGg9MCxnPU51bWJlcihlLnRleHQoKSksdGhpcy52aWV3RGF0ZS5zZXRVVENGdWxsWWVhcihnKSksdGhpcy5fdHJpZ2dlcihyLnZpZXdNb2Rlc1t0aGlzLnZpZXdNb2RlLTFdLmUsdGhpcy52aWV3RGF0ZSksdGhpcy52aWV3TW9kZT09PXRoaXMuby5taW5WaWV3TW9kZT90aGlzLl9zZXREYXRlKGMoZyxoLGYpKToodGhpcy5zZXRWaWV3TW9kZSh0aGlzLnZpZXdNb2RlLTEpLHRoaXMuZmlsbCgpKSksdGhpcy5waWNrZXIuaXMoXCI6dmlzaWJsZVwiKSYmdGhpcy5fZm9jdXNlZF9mcm9tJiZ0aGlzLl9mb2N1c2VkX2Zyb20uZm9jdXMoKSxkZWxldGUgdGhpcy5fZm9jdXNlZF9mcm9tfSxkYXlDZWxsQ2xpY2s6ZnVuY3Rpb24oYil7dmFyIGM9YShiLmN1cnJlbnRUYXJnZXQpLGQ9Yy5kYXRhKFwiZGF0ZVwiKSxlPW5ldyBEYXRlKGQpO3RoaXMuby51cGRhdGVWaWV3RGF0ZSYmKGUuZ2V0VVRDRnVsbFllYXIoKSE9PXRoaXMudmlld0RhdGUuZ2V0VVRDRnVsbFllYXIoKSYmdGhpcy5fdHJpZ2dlcihcImNoYW5nZVllYXJcIix0aGlzLnZpZXdEYXRlKSxlLmdldFVUQ01vbnRoKCkhPT10aGlzLnZpZXdEYXRlLmdldFVUQ01vbnRoKCkmJnRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VNb250aFwiLHRoaXMudmlld0RhdGUpKSx0aGlzLl9zZXREYXRlKGUpfSxuYXZBcnJvd3NDbGljazpmdW5jdGlvbihiKXt2YXIgYz1hKGIuY3VycmVudFRhcmdldCksZD1jLmhhc0NsYXNzKFwicHJldlwiKT8tMToxOzAhPT10aGlzLnZpZXdNb2RlJiYoZCo9MTIqci52aWV3TW9kZXNbdGhpcy52aWV3TW9kZV0ubmF2U3RlcCksdGhpcy52aWV3RGF0ZT10aGlzLm1vdmVNb250aCh0aGlzLnZpZXdEYXRlLGQpLHRoaXMuX3RyaWdnZXIoci52aWV3TW9kZXNbdGhpcy52aWV3TW9kZV0uZSx0aGlzLnZpZXdEYXRlKSx0aGlzLmZpbGwoKX0sX3RvZ2dsZV9tdWx0aWRhdGU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5kYXRlcy5jb250YWlucyhhKTtpZihhfHx0aGlzLmRhdGVzLmNsZWFyKCksYiE9PS0xPyh0aGlzLm8ubXVsdGlkYXRlPT09ITB8fHRoaXMuby5tdWx0aWRhdGU+MXx8dGhpcy5vLnRvZ2dsZUFjdGl2ZSkmJnRoaXMuZGF0ZXMucmVtb3ZlKGIpOnRoaXMuby5tdWx0aWRhdGU9PT0hMT8odGhpcy5kYXRlcy5jbGVhcigpLHRoaXMuZGF0ZXMucHVzaChhKSk6dGhpcy5kYXRlcy5wdXNoKGEpLFwibnVtYmVyXCI9PXR5cGVvZiB0aGlzLm8ubXVsdGlkYXRlKWZvcig7dGhpcy5kYXRlcy5sZW5ndGg+dGhpcy5vLm11bHRpZGF0ZTspdGhpcy5kYXRlcy5yZW1vdmUoMCl9LF9zZXREYXRlOmZ1bmN0aW9uKGEsYil7YiYmXCJkYXRlXCIhPT1ifHx0aGlzLl90b2dnbGVfbXVsdGlkYXRlKGEmJm5ldyBEYXRlKGEpKSwoIWImJnRoaXMuby51cGRhdGVWaWV3RGF0ZXx8XCJ2aWV3XCI9PT1iKSYmKHRoaXMudmlld0RhdGU9YSYmbmV3IERhdGUoYSkpLHRoaXMuZmlsbCgpLHRoaXMuc2V0VmFsdWUoKSxiJiZcInZpZXdcIj09PWJ8fHRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VEYXRlXCIpLHRoaXMuaW5wdXRGaWVsZC50cmlnZ2VyKFwiY2hhbmdlXCIpLCF0aGlzLm8uYXV0b2Nsb3NlfHxiJiZcImRhdGVcIiE9PWJ8fHRoaXMuaGlkZSgpfSxtb3ZlRGF5OmZ1bmN0aW9uKGEsYil7dmFyIGM9bmV3IERhdGUoYSk7cmV0dXJuIGMuc2V0VVRDRGF0ZShhLmdldFVUQ0RhdGUoKStiKSxjfSxtb3ZlV2VlazpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLm1vdmVEYXkoYSw3KmIpfSxtb3ZlTW9udGg6ZnVuY3Rpb24oYSxiKXtpZighZyhhKSlyZXR1cm4gdGhpcy5vLmRlZmF1bHRWaWV3RGF0ZTtpZighYilyZXR1cm4gYTt2YXIgYyxkLGU9bmV3IERhdGUoYS52YWx1ZU9mKCkpLGY9ZS5nZXRVVENEYXRlKCksaD1lLmdldFVUQ01vbnRoKCksaT1NYXRoLmFicyhiKTtpZihiPWI+MD8xOi0xLDE9PT1pKWQ9Yj09PS0xP2Z1bmN0aW9uKCl7cmV0dXJuIGUuZ2V0VVRDTW9udGgoKT09PWh9OmZ1bmN0aW9uKCl7cmV0dXJuIGUuZ2V0VVRDTW9udGgoKSE9PWN9LGM9aCtiLGUuc2V0VVRDTW9udGgoYyksYz0oYysxMiklMTI7ZWxzZXtmb3IodmFyIGo9MDtqPGk7aisrKWU9dGhpcy5tb3ZlTW9udGgoZSxiKTtjPWUuZ2V0VVRDTW9udGgoKSxlLnNldFVUQ0RhdGUoZiksZD1mdW5jdGlvbigpe3JldHVybiBjIT09ZS5nZXRVVENNb250aCgpfX1mb3IoO2QoKTspZS5zZXRVVENEYXRlKC0tZiksZS5zZXRVVENNb250aChjKTtyZXR1cm4gZX0sbW92ZVllYXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5tb3ZlTW9udGgoYSwxMipiKX0sbW92ZUF2YWlsYWJsZURhdGU6ZnVuY3Rpb24oYSxiLGMpe2Rve2lmKGE9dGhpc1tjXShhLGIpLCF0aGlzLmRhdGVXaXRoaW5SYW5nZShhKSlyZXR1cm4hMTtjPVwibW92ZURheVwifXdoaWxlKHRoaXMuZGF0ZUlzRGlzYWJsZWQoYSkpO3JldHVybiBhfSx3ZWVrT2ZEYXRlSXNEaXNhYmxlZDpmdW5jdGlvbihiKXtyZXR1cm4gYS5pbkFycmF5KGIuZ2V0VVRDRGF5KCksdGhpcy5vLmRheXNPZldlZWtEaXNhYmxlZCkhPT0tMX0sZGF0ZUlzRGlzYWJsZWQ6ZnVuY3Rpb24oYil7cmV0dXJuIHRoaXMud2Vla09mRGF0ZUlzRGlzYWJsZWQoYil8fGEuZ3JlcCh0aGlzLm8uZGF0ZXNEaXNhYmxlZCxmdW5jdGlvbihhKXtyZXR1cm4gZShiLGEpfSkubGVuZ3RoPjB9LGRhdGVXaXRoaW5SYW5nZTpmdW5jdGlvbihhKXtyZXR1cm4gYT49dGhpcy5vLnN0YXJ0RGF0ZSYmYTw9dGhpcy5vLmVuZERhdGV9LGtleWRvd246ZnVuY3Rpb24oYSl7aWYoIXRoaXMucGlja2VyLmlzKFwiOnZpc2libGVcIikpcmV0dXJuIHZvaWQoNDAhPT1hLmtleUNvZGUmJjI3IT09YS5rZXlDb2RlfHwodGhpcy5zaG93KCksYS5zdG9wUHJvcGFnYXRpb24oKSkpO3ZhciBiLGMsZD0hMSxlPXRoaXMuZm9jdXNEYXRlfHx0aGlzLnZpZXdEYXRlO3N3aXRjaChhLmtleUNvZGUpe2Nhc2UgMjc6dGhpcy5mb2N1c0RhdGU/KHRoaXMuZm9jdXNEYXRlPW51bGwsdGhpcy52aWV3RGF0ZT10aGlzLmRhdGVzLmdldCgtMSl8fHRoaXMudmlld0RhdGUsdGhpcy5maWxsKCkpOnRoaXMuaGlkZSgpLGEucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpO2JyZWFrO2Nhc2UgMzc6Y2FzZSAzODpjYXNlIDM5OmNhc2UgNDA6aWYoIXRoaXMuby5rZXlib2FyZE5hdmlnYXRpb258fDc9PT10aGlzLm8uZGF5c09mV2Vla0Rpc2FibGVkLmxlbmd0aClicmVhaztiPTM3PT09YS5rZXlDb2RlfHwzOD09PWEua2V5Q29kZT8tMToxLDA9PT10aGlzLnZpZXdNb2RlP2EuY3RybEtleT8oYz10aGlzLm1vdmVBdmFpbGFibGVEYXRlKGUsYixcIm1vdmVZZWFyXCIpLGMmJnRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VZZWFyXCIsdGhpcy52aWV3RGF0ZSkpOmEuc2hpZnRLZXk/KGM9dGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShlLGIsXCJtb3ZlTW9udGhcIiksYyYmdGhpcy5fdHJpZ2dlcihcImNoYW5nZU1vbnRoXCIsdGhpcy52aWV3RGF0ZSkpOjM3PT09YS5rZXlDb2RlfHwzOT09PWEua2V5Q29kZT9jPXRoaXMubW92ZUF2YWlsYWJsZURhdGUoZSxiLFwibW92ZURheVwiKTp0aGlzLndlZWtPZkRhdGVJc0Rpc2FibGVkKGUpfHwoYz10aGlzLm1vdmVBdmFpbGFibGVEYXRlKGUsYixcIm1vdmVXZWVrXCIpKToxPT09dGhpcy52aWV3TW9kZT8oMzghPT1hLmtleUNvZGUmJjQwIT09YS5rZXlDb2RlfHwoYio9NCksYz10aGlzLm1vdmVBdmFpbGFibGVEYXRlKGUsYixcIm1vdmVNb250aFwiKSk6Mj09PXRoaXMudmlld01vZGUmJigzOCE9PWEua2V5Q29kZSYmNDAhPT1hLmtleUNvZGV8fChiKj00KSxjPXRoaXMubW92ZUF2YWlsYWJsZURhdGUoZSxiLFwibW92ZVllYXJcIikpLGMmJih0aGlzLmZvY3VzRGF0ZT10aGlzLnZpZXdEYXRlPWMsdGhpcy5zZXRWYWx1ZSgpLHRoaXMuZmlsbCgpLGEucHJldmVudERlZmF1bHQoKSk7YnJlYWs7Y2FzZSAxMzppZighdGhpcy5vLmZvcmNlUGFyc2UpYnJlYWs7ZT10aGlzLmZvY3VzRGF0ZXx8dGhpcy5kYXRlcy5nZXQoLTEpfHx0aGlzLnZpZXdEYXRlLHRoaXMuby5rZXlib2FyZE5hdmlnYXRpb24mJih0aGlzLl90b2dnbGVfbXVsdGlkYXRlKGUpLGQ9ITApLHRoaXMuZm9jdXNEYXRlPW51bGwsdGhpcy52aWV3RGF0ZT10aGlzLmRhdGVzLmdldCgtMSl8fHRoaXMudmlld0RhdGUsdGhpcy5zZXRWYWx1ZSgpLHRoaXMuZmlsbCgpLHRoaXMucGlja2VyLmlzKFwiOnZpc2libGVcIikmJihhLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSx0aGlzLm8uYXV0b2Nsb3NlJiZ0aGlzLmhpZGUoKSk7YnJlYWs7Y2FzZSA5OnRoaXMuZm9jdXNEYXRlPW51bGwsdGhpcy52aWV3RGF0ZT10aGlzLmRhdGVzLmdldCgtMSl8fHRoaXMudmlld0RhdGUsdGhpcy5maWxsKCksdGhpcy5oaWRlKCl9ZCYmKHRoaXMuZGF0ZXMubGVuZ3RoP3RoaXMuX3RyaWdnZXIoXCJjaGFuZ2VEYXRlXCIpOnRoaXMuX3RyaWdnZXIoXCJjbGVhckRhdGVcIiksdGhpcy5pbnB1dEZpZWxkLnRyaWdnZXIoXCJjaGFuZ2VcIikpfSxzZXRWaWV3TW9kZTpmdW5jdGlvbihhKXt0aGlzLnZpZXdNb2RlPWEsdGhpcy5waWNrZXIuY2hpbGRyZW4oXCJkaXZcIikuaGlkZSgpLmZpbHRlcihcIi5kYXRlcGlja2VyLVwiK3Iudmlld01vZGVzW3RoaXMudmlld01vZGVdLmNsc05hbWUpLnNob3coKSx0aGlzLnVwZGF0ZU5hdkFycm93cygpLHRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VWaWV3TW9kZVwiLG5ldyBEYXRlKHRoaXMudmlld0RhdGUpKX19O3ZhciBsPWZ1bmN0aW9uKGIsYyl7YS5kYXRhKGIsXCJkYXRlcGlja2VyXCIsdGhpcyksdGhpcy5lbGVtZW50PWEoYiksdGhpcy5pbnB1dHM9YS5tYXAoYy5pbnB1dHMsZnVuY3Rpb24oYSl7cmV0dXJuIGEuanF1ZXJ5P2FbMF06YX0pLGRlbGV0ZSBjLmlucHV0cyx0aGlzLmtlZXBFbXB0eVZhbHVlcz1jLmtlZXBFbXB0eVZhbHVlcyxkZWxldGUgYy5rZWVwRW1wdHlWYWx1ZXMsbi5jYWxsKGEodGhpcy5pbnB1dHMpLGMpLm9uKFwiY2hhbmdlRGF0ZVwiLGEucHJveHkodGhpcy5kYXRlVXBkYXRlZCx0aGlzKSksdGhpcy5waWNrZXJzPWEubWFwKHRoaXMuaW5wdXRzLGZ1bmN0aW9uKGIpe3JldHVybiBhLmRhdGEoYixcImRhdGVwaWNrZXJcIil9KSx0aGlzLnVwZGF0ZURhdGVzKCl9O2wucHJvdG90eXBlPXt1cGRhdGVEYXRlczpmdW5jdGlvbigpe3RoaXMuZGF0ZXM9YS5tYXAodGhpcy5waWNrZXJzLGZ1bmN0aW9uKGEpe3JldHVybiBhLmdldFVUQ0RhdGUoKX0pLHRoaXMudXBkYXRlUmFuZ2VzKCl9LHVwZGF0ZVJhbmdlczpmdW5jdGlvbigpe3ZhciBiPWEubWFwKHRoaXMuZGF0ZXMsZnVuY3Rpb24oYSl7cmV0dXJuIGEudmFsdWVPZigpfSk7YS5lYWNoKHRoaXMucGlja2VycyxmdW5jdGlvbihhLGMpe2Muc2V0UmFuZ2UoYil9KX0sY2xlYXJEYXRlczpmdW5jdGlvbigpe2EuZWFjaCh0aGlzLnBpY2tlcnMsZnVuY3Rpb24oYSxiKXtiLmNsZWFyRGF0ZXMoKX0pfSxkYXRlVXBkYXRlZDpmdW5jdGlvbihjKXtpZighdGhpcy51cGRhdGluZyl7dGhpcy51cGRhdGluZz0hMDt2YXIgZD1hLmRhdGEoYy50YXJnZXQsXCJkYXRlcGlja2VyXCIpO2lmKGQhPT1iKXt2YXIgZT1kLmdldFVUQ0RhdGUoKSxmPXRoaXMua2VlcEVtcHR5VmFsdWVzLGc9YS5pbkFycmF5KGMudGFyZ2V0LHRoaXMuaW5wdXRzKSxoPWctMSxpPWcrMSxqPXRoaXMuaW5wdXRzLmxlbmd0aDtpZihnIT09LTEpe2lmKGEuZWFjaCh0aGlzLnBpY2tlcnMsZnVuY3Rpb24oYSxiKXtiLmdldFVUQ0RhdGUoKXx8YiE9PWQmJmZ8fGIuc2V0VVRDRGF0ZShlKX0pLGU8dGhpcy5kYXRlc1toXSlmb3IoO2g+PTAmJmU8dGhpcy5kYXRlc1toXTspdGhpcy5waWNrZXJzW2gtLV0uc2V0VVRDRGF0ZShlKTtlbHNlIGlmKGU+dGhpcy5kYXRlc1tpXSlmb3IoO2k8aiYmZT50aGlzLmRhdGVzW2ldOyl0aGlzLnBpY2tlcnNbaSsrXS5zZXRVVENEYXRlKGUpO3RoaXMudXBkYXRlRGF0ZXMoKSxkZWxldGUgdGhpcy51cGRhdGluZ319fX0sZGVzdHJveTpmdW5jdGlvbigpe2EubWFwKHRoaXMucGlja2VycyxmdW5jdGlvbihhKXthLmRlc3Ryb3koKX0pLGEodGhpcy5pbnB1dHMpLm9mZihcImNoYW5nZURhdGVcIix0aGlzLmRhdGVVcGRhdGVkKSxkZWxldGUgdGhpcy5lbGVtZW50LmRhdGEoKS5kYXRlcGlja2VyfSxyZW1vdmU6ZihcImRlc3Ryb3lcIixcIk1ldGhvZCBgcmVtb3ZlYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiAyLjAuIFVzZSBgZGVzdHJveWAgaW5zdGVhZFwiKX07dmFyIG09YS5mbi5kYXRlcGlja2VyLG49ZnVuY3Rpb24oYyl7dmFyIGQ9QXJyYXkuYXBwbHkobnVsbCxhcmd1bWVudHMpO2Quc2hpZnQoKTt2YXIgZTtpZih0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYj1hKHRoaXMpLGY9Yi5kYXRhKFwiZGF0ZXBpY2tlclwiKSxnPVwib2JqZWN0XCI9PXR5cGVvZiBjJiZjO2lmKCFmKXt2YXIgaj1oKHRoaXMsXCJkYXRlXCIpLG09YS5leHRlbmQoe30sbyxqLGcpLG49aShtLmxhbmd1YWdlKSxwPWEuZXh0ZW5kKHt9LG8sbixqLGcpO2IuaGFzQ2xhc3MoXCJpbnB1dC1kYXRlcmFuZ2VcIil8fHAuaW5wdXRzPyhhLmV4dGVuZChwLHtpbnB1dHM6cC5pbnB1dHN8fGIuZmluZChcImlucHV0XCIpLnRvQXJyYXkoKX0pLGY9bmV3IGwodGhpcyxwKSk6Zj1uZXcgayh0aGlzLHApLGIuZGF0YShcImRhdGVwaWNrZXJcIixmKX1cInN0cmluZ1wiPT10eXBlb2YgYyYmXCJmdW5jdGlvblwiPT10eXBlb2YgZltjXSYmKGU9ZltjXS5hcHBseShmLGQpKX0pLGU9PT1ifHxlIGluc3RhbmNlb2Yga3x8ZSBpbnN0YW5jZW9mIGwpcmV0dXJuIHRoaXM7aWYodGhpcy5sZW5ndGg+MSl0aHJvdyBuZXcgRXJyb3IoXCJVc2luZyBvbmx5IGFsbG93ZWQgZm9yIHRoZSBjb2xsZWN0aW9uIG9mIGEgc2luZ2xlIGVsZW1lbnQgKFwiK2MrXCIgZnVuY3Rpb24pXCIpO3JldHVybiBlfTthLmZuLmRhdGVwaWNrZXI9bjt2YXIgbz1hLmZuLmRhdGVwaWNrZXIuZGVmYXVsdHM9e2Fzc3VtZU5lYXJieVllYXI6ITEsYXV0b2Nsb3NlOiExLGJlZm9yZVNob3dEYXk6YS5ub29wLGJlZm9yZVNob3dNb250aDphLm5vb3AsYmVmb3JlU2hvd1llYXI6YS5ub29wLGJlZm9yZVNob3dEZWNhZGU6YS5ub29wLGJlZm9yZVNob3dDZW50dXJ5OmEubm9vcCxjYWxlbmRhcldlZWtzOiExLGNsZWFyQnRuOiExLHRvZ2dsZUFjdGl2ZTohMSxkYXlzT2ZXZWVrRGlzYWJsZWQ6W10sZGF5c09mV2Vla0hpZ2hsaWdodGVkOltdLGRhdGVzRGlzYWJsZWQ6W10sZW5kRGF0ZToxLzAsZm9yY2VQYXJzZTohMCxmb3JtYXQ6XCJtbS9kZC95eXl5XCIsa2VlcEVtcHR5VmFsdWVzOiExLGtleWJvYXJkTmF2aWdhdGlvbjohMCxsYW5ndWFnZTpcImVuXCIsbWluVmlld01vZGU6MCxtYXhWaWV3TW9kZTo0LG11bHRpZGF0ZTohMSxtdWx0aWRhdGVTZXBhcmF0b3I6XCIsXCIsb3JpZW50YXRpb246XCJhdXRvXCIscnRsOiExLHN0YXJ0RGF0ZTotKDEvMCksc3RhcnRWaWV3OjAsdG9kYXlCdG46ITEsdG9kYXlIaWdobGlnaHQ6ITEsdXBkYXRlVmlld0RhdGU6ITAsd2Vla1N0YXJ0OjAsZGlzYWJsZVRvdWNoS2V5Ym9hcmQ6ITEsZW5hYmxlT25SZWFkb25seTohMCxzaG93T25Gb2N1czohMCx6SW5kZXhPZmZzZXQ6MTAsY29udGFpbmVyOlwiYm9keVwiLGltbWVkaWF0ZVVwZGF0ZXM6ITEsdGl0bGU6XCJcIix0ZW1wbGF0ZXM6e2xlZnRBcnJvdzpcIiYjeDAwQUI7XCIscmlnaHRBcnJvdzpcIiYjeDAwQkI7XCJ9LHNob3dXZWVrRGF5czohMH0scD1hLmZuLmRhdGVwaWNrZXIubG9jYWxlX29wdHM9W1wiZm9ybWF0XCIsXCJydGxcIixcIndlZWtTdGFydFwiXTthLmZuLmRhdGVwaWNrZXIuQ29uc3RydWN0b3I9azt2YXIgcT1hLmZuLmRhdGVwaWNrZXIuZGF0ZXM9e2VuOntkYXlzOltcIlN1bmRheVwiLFwiTW9uZGF5XCIsXCJUdWVzZGF5XCIsXCJXZWRuZXNkYXlcIixcIlRodXJzZGF5XCIsXCJGcmlkYXlcIixcIlNhdHVyZGF5XCJdLGRheXNTaG9ydDpbXCJTdW5cIixcIk1vblwiLFwiVHVlXCIsXCJXZWRcIixcIlRodVwiLFwiRnJpXCIsXCJTYXRcIl0sZGF5c01pbjpbXCJTdVwiLFwiTW9cIixcIlR1XCIsXCJXZVwiLFwiVGhcIixcIkZyXCIsXCJTYVwiXSxtb250aHM6W1wiSmFudWFyeVwiLFwiRmVicnVhcnlcIixcIk1hcmNoXCIsXCJBcHJpbFwiLFwiTWF5XCIsXCJKdW5lXCIsXCJKdWx5XCIsXCJBdWd1c3RcIixcIlNlcHRlbWJlclwiLFwiT2N0b2JlclwiLFwiTm92ZW1iZXJcIixcIkRlY2VtYmVyXCJdLG1vbnRoc1Nob3J0OltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl0sdG9kYXk6XCJUb2RheVwiLGNsZWFyOlwiQ2xlYXJcIix0aXRsZUZvcm1hdDpcIk1NIHl5eXlcIn19LHI9e3ZpZXdNb2Rlczpbe25hbWVzOltcImRheXNcIixcIm1vbnRoXCJdLGNsc05hbWU6XCJkYXlzXCIsZTpcImNoYW5nZU1vbnRoXCJ9LHtuYW1lczpbXCJtb250aHNcIixcInllYXJcIl0sY2xzTmFtZTpcIm1vbnRoc1wiLGU6XCJjaGFuZ2VZZWFyXCIsbmF2U3RlcDoxfSx7bmFtZXM6W1wieWVhcnNcIixcImRlY2FkZVwiXSxjbHNOYW1lOlwieWVhcnNcIixlOlwiY2hhbmdlRGVjYWRlXCIsbmF2U3RlcDoxMH0se25hbWVzOltcImRlY2FkZXNcIixcImNlbnR1cnlcIl0sY2xzTmFtZTpcImRlY2FkZXNcIixlOlwiY2hhbmdlQ2VudHVyeVwiLG5hdlN0ZXA6MTAwfSx7bmFtZXM6W1wiY2VudHVyaWVzXCIsXCJtaWxsZW5uaXVtXCJdLGNsc05hbWU6XCJjZW50dXJpZXNcIixlOlwiY2hhbmdlTWlsbGVubml1bVwiLG5hdlN0ZXA6MWUzfV0sdmFsaWRQYXJ0czovZGQ/fEREP3xtbT98TU0/fHl5KD86eXkpPy9nLG5vbnB1bmN0dWF0aW9uOi9bXiAtXFwvOi1AXFx1NWU3NFxcdTY3MDhcXHU2NWU1XFxbLWB7LX5cXHRcXG5cXHJdKy9nLHBhcnNlRm9ybWF0OmZ1bmN0aW9uKGEpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGEudG9WYWx1ZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgYS50b0Rpc3BsYXkpcmV0dXJuIGE7dmFyIGI9YS5yZXBsYWNlKHRoaXMudmFsaWRQYXJ0cyxcIlxcMFwiKS5zcGxpdChcIlxcMFwiKSxjPWEubWF0Y2godGhpcy52YWxpZFBhcnRzKTtpZighYnx8IWIubGVuZ3RofHwhY3x8MD09PWMubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZGF0ZSBmb3JtYXQuXCIpO3JldHVybntzZXBhcmF0b3JzOmIscGFydHM6Y319LHBhcnNlRGF0ZTpmdW5jdGlvbihjLGUsZixnKXtmdW5jdGlvbiBoKGEsYil7cmV0dXJuIGI9PT0hMCYmKGI9MTApLGE8MTAwJiYoYSs9MmUzLGE+KG5ldyBEYXRlKS5nZXRGdWxsWWVhcigpK2ImJihhLT0xMDApKSxhfWZ1bmN0aW9uIGkoKXt2YXIgYT10aGlzLnNsaWNlKDAsaltuXS5sZW5ndGgpLGI9altuXS5zbGljZSgwLGEubGVuZ3RoKTtyZXR1cm4gYS50b0xvd2VyQ2FzZSgpPT09Yi50b0xvd2VyQ2FzZSgpfWlmKCFjKXJldHVybiBiO2lmKGMgaW5zdGFuY2VvZiBEYXRlKXJldHVybiBjO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1yLnBhcnNlRm9ybWF0KGUpKSxlLnRvVmFsdWUpcmV0dXJuIGUudG9WYWx1ZShjLGUsZik7dmFyIGosbCxtLG4sbyxwPXtkOlwibW92ZURheVwiLG06XCJtb3ZlTW9udGhcIix3OlwibW92ZVdlZWtcIix5OlwibW92ZVllYXJcIn0scz17eWVzdGVyZGF5OlwiLTFkXCIsdG9kYXk6XCIrMGRcIix0b21vcnJvdzpcIisxZFwifTtpZihjIGluIHMmJihjPXNbY10pLC9eW1xcLStdXFxkK1tkbXd5XShbXFxzLF0rW1xcLStdXFxkK1tkbXd5XSkqJC9pLnRlc3QoYykpe2ZvcihqPWMubWF0Y2goLyhbXFwtK11cXGQrKShbZG13eV0pL2dpKSxjPW5ldyBEYXRlLG49MDtuPGoubGVuZ3RoO24rKylsPWpbbl0ubWF0Y2goLyhbXFwtK11cXGQrKShbZG13eV0pL2kpLG09TnVtYmVyKGxbMV0pLG89cFtsWzJdLnRvTG93ZXJDYXNlKCldLGM9ay5wcm90b3R5cGVbb10oYyxtKTtyZXR1cm4gay5wcm90b3R5cGUuX3plcm9fdXRjX3RpbWUoYyl9aj1jJiZjLm1hdGNoKHRoaXMubm9ucHVuY3R1YXRpb24pfHxbXTt2YXIgdCx1LHY9e30sdz1bXCJ5eXl5XCIsXCJ5eVwiLFwiTVwiLFwiTU1cIixcIm1cIixcIm1tXCIsXCJkXCIsXCJkZFwiXSx4PXt5eXl5OmZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2V0VVRDRnVsbFllYXIoZz9oKGIsZyk6Yil9LG06ZnVuY3Rpb24oYSxiKXtpZihpc05hTihhKSlyZXR1cm4gYTtmb3IoYi09MTtiPDA7KWIrPTEyO2ZvcihiJT0xMixhLnNldFVUQ01vbnRoKGIpO2EuZ2V0VVRDTW9udGgoKSE9PWI7KWEuc2V0VVRDRGF0ZShhLmdldFVUQ0RhdGUoKS0xKTtyZXR1cm4gYX0sZDpmdW5jdGlvbihhLGIpe3JldHVybiBhLnNldFVUQ0RhdGUoYil9fTt4Lnl5PXgueXl5eSx4Lk09eC5NTT14Lm1tPXgubSx4LmRkPXguZCxjPWQoKTt2YXIgeT1lLnBhcnRzLnNsaWNlKCk7aWYoai5sZW5ndGghPT15Lmxlbmd0aCYmKHk9YSh5KS5maWx0ZXIoZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5pbkFycmF5KGMsdykhPT0tMX0pLnRvQXJyYXkoKSksai5sZW5ndGg9PT15Lmxlbmd0aCl7dmFyIHo7Zm9yKG49MCx6PXkubGVuZ3RoO248ejtuKyspe2lmKHQ9cGFyc2VJbnQoaltuXSwxMCksbD15W25dLGlzTmFOKHQpKXN3aXRjaChsKXtjYXNlXCJNTVwiOnU9YShxW2ZdLm1vbnRocykuZmlsdGVyKGkpLHQ9YS5pbkFycmF5KHVbMF0scVtmXS5tb250aHMpKzE7YnJlYWs7Y2FzZVwiTVwiOnU9YShxW2ZdLm1vbnRoc1Nob3J0KS5maWx0ZXIoaSksdD1hLmluQXJyYXkodVswXSxxW2ZdLm1vbnRoc1Nob3J0KSsxfXZbbF09dH12YXIgQSxCO2ZvcihuPTA7bjx3Lmxlbmd0aDtuKyspQj13W25dLEIgaW4gdiYmIWlzTmFOKHZbQl0pJiYoQT1uZXcgRGF0ZShjKSx4W0JdKEEsdltCXSksaXNOYU4oQSl8fChjPUEpKX1yZXR1cm4gY30sZm9ybWF0RGF0ZTpmdW5jdGlvbihiLGMsZCl7aWYoIWIpcmV0dXJuXCJcIjtpZihcInN0cmluZ1wiPT10eXBlb2YgYyYmKGM9ci5wYXJzZUZvcm1hdChjKSksYy50b0Rpc3BsYXkpcmV0dXJuIGMudG9EaXNwbGF5KGIsYyxkKTt2YXIgZT17ZDpiLmdldFVUQ0RhdGUoKSxEOnFbZF0uZGF5c1Nob3J0W2IuZ2V0VVRDRGF5KCldLEREOnFbZF0uZGF5c1tiLmdldFVUQ0RheSgpXSxtOmIuZ2V0VVRDTW9udGgoKSsxLE06cVtkXS5tb250aHNTaG9ydFtiLmdldFVUQ01vbnRoKCldLE1NOnFbZF0ubW9udGhzW2IuZ2V0VVRDTW9udGgoKV0seXk6Yi5nZXRVVENGdWxsWWVhcigpLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDIpLHl5eXk6Yi5nZXRVVENGdWxsWWVhcigpfTtlLmRkPShlLmQ8MTA/XCIwXCI6XCJcIikrZS5kLGUubW09KGUubTwxMD9cIjBcIjpcIlwiKStlLm0sYj1bXTtmb3IodmFyIGY9YS5leHRlbmQoW10sYy5zZXBhcmF0b3JzKSxnPTAsaD1jLnBhcnRzLmxlbmd0aDtnPD1oO2crKylmLmxlbmd0aCYmYi5wdXNoKGYuc2hpZnQoKSksYi5wdXNoKGVbYy5wYXJ0c1tnXV0pO3JldHVybiBiLmpvaW4oXCJcIil9LGhlYWRUZW1wbGF0ZTonPHRoZWFkPjx0cj48dGggY29sc3Bhbj1cIjdcIiBjbGFzcz1cImRhdGVwaWNrZXItdGl0bGVcIj48L3RoPjwvdHI+PHRyPjx0aCBjbGFzcz1cInByZXZcIj4nK28udGVtcGxhdGVzLmxlZnRBcnJvdysnPC90aD48dGggY29sc3Bhbj1cIjVcIiBjbGFzcz1cImRhdGVwaWNrZXItc3dpdGNoXCI+PC90aD48dGggY2xhc3M9XCJuZXh0XCI+JytvLnRlbXBsYXRlcy5yaWdodEFycm93K1wiPC90aD48L3RyPjwvdGhlYWQ+XCIsXG5jb250VGVtcGxhdGU6Jzx0Ym9keT48dHI+PHRkIGNvbHNwYW49XCI3XCI+PC90ZD48L3RyPjwvdGJvZHk+Jyxmb290VGVtcGxhdGU6Jzx0Zm9vdD48dHI+PHRoIGNvbHNwYW49XCI3XCIgY2xhc3M9XCJ0b2RheVwiPjwvdGg+PC90cj48dHI+PHRoIGNvbHNwYW49XCI3XCIgY2xhc3M9XCJjbGVhclwiPjwvdGg+PC90cj48L3Rmb290Pid9O3IudGVtcGxhdGU9JzxkaXYgY2xhc3M9XCJkYXRlcGlja2VyXCI+PGRpdiBjbGFzcz1cImRhdGVwaWNrZXItZGF5c1wiPjx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicrci5oZWFkVGVtcGxhdGUrXCI8dGJvZHk+PC90Ym9keT5cIityLmZvb3RUZW1wbGF0ZSsnPC90YWJsZT48L2Rpdj48ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci1tb250aHNcIj48dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK3IuaGVhZFRlbXBsYXRlK3IuY29udFRlbXBsYXRlK3IuZm9vdFRlbXBsYXRlKyc8L3RhYmxlPjwvZGl2PjxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLXllYXJzXCI+PHRhYmxlIGNsYXNzPVwidGFibGUtY29uZGVuc2VkXCI+JytyLmhlYWRUZW1wbGF0ZStyLmNvbnRUZW1wbGF0ZStyLmZvb3RUZW1wbGF0ZSsnPC90YWJsZT48L2Rpdj48ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci1kZWNhZGVzXCI+PHRhYmxlIGNsYXNzPVwidGFibGUtY29uZGVuc2VkXCI+JytyLmhlYWRUZW1wbGF0ZStyLmNvbnRUZW1wbGF0ZStyLmZvb3RUZW1wbGF0ZSsnPC90YWJsZT48L2Rpdj48ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci1jZW50dXJpZXNcIj48dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK3IuaGVhZFRlbXBsYXRlK3IuY29udFRlbXBsYXRlK3IuZm9vdFRlbXBsYXRlK1wiPC90YWJsZT48L2Rpdj48L2Rpdj5cIixhLmZuLmRhdGVwaWNrZXIuRFBHbG9iYWw9cixhLmZuLmRhdGVwaWNrZXIubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmRhdGVwaWNrZXI9bSx0aGlzfSxhLmZuLmRhdGVwaWNrZXIudmVyc2lvbj1cIjEuOC4wXCIsYS5mbi5kYXRlcGlja2VyLmRlcHJlY2F0ZWQ9ZnVuY3Rpb24oYSl7dmFyIGI9d2luZG93LmNvbnNvbGU7YiYmYi53YXJuJiZiLndhcm4oXCJERVBSRUNBVEVEOiBcIithKX0sYShkb2N1bWVudCkub24oXCJmb2N1cy5kYXRlcGlja2VyLmRhdGEtYXBpIGNsaWNrLmRhdGVwaWNrZXIuZGF0YS1hcGlcIiwnW2RhdGEtcHJvdmlkZT1cImRhdGVwaWNrZXJcIl0nLGZ1bmN0aW9uKGIpe3ZhciBjPWEodGhpcyk7Yy5kYXRhKFwiZGF0ZXBpY2tlclwiKXx8KGIucHJldmVudERlZmF1bHQoKSxuLmNhbGwoYyxcInNob3dcIikpfSksYShmdW5jdGlvbigpe24uY2FsbChhKCdbZGF0YS1wcm92aWRlPVwiZGF0ZXBpY2tlci1pbmxpbmVcIl0nKSl9KX0pOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qIVxuICogQm9vdHN0cmFwIHYzLjQuMSAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tLylcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cbmlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBqUXVlcnkpdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnlcIik7IWZ1bmN0aW9uKHQpe1widXNlIHN0cmljdFwiO3ZhciBlPWpRdWVyeS5mbi5qcXVlcnkuc3BsaXQoXCIgXCIpWzBdLnNwbGl0KFwiLlwiKTtpZihlWzBdPDImJmVbMV08OXx8MT09ZVswXSYmOT09ZVsxXSYmZVsyXTwxfHwzPGVbMF0pdGhyb3cgbmV3IEVycm9yKFwiQm9vdHN0cmFwJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkgdmVyc2lvbiAxLjkuMSBvciBoaWdoZXIsIGJ1dCBsb3dlciB0aGFuIHZlcnNpb24gNFwiKX0oKSxmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjtuLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kPWZ1bmN0aW9uKHQpe3ZhciBlPSExLGk9dGhpcztuKHRoaXMpLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGZ1bmN0aW9uKCl7ZT0hMH0pO3JldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZXx8bihpKS50cmlnZ2VyKG4uc3VwcG9ydC50cmFuc2l0aW9uLmVuZCl9LHQpLHRoaXN9LG4oZnVuY3Rpb24oKXtuLnN1cHBvcnQudHJhbnNpdGlvbj1mdW5jdGlvbiBvKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvb3RzdHJhcFwiKSxlPXtXZWJraXRUcmFuc2l0aW9uOlwid2Via2l0VHJhbnNpdGlvbkVuZFwiLE1velRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCIsT1RyYW5zaXRpb246XCJvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZFwiLHRyYW5zaXRpb246XCJ0cmFuc2l0aW9uZW5kXCJ9O2Zvcih2YXIgaSBpbiBlKWlmKHQuc3R5bGVbaV0hPT11bmRlZmluZWQpcmV0dXJue2VuZDplW2ldfTtyZXR1cm4hMX0oKSxuLnN1cHBvcnQudHJhbnNpdGlvbiYmKG4uZXZlbnQuc3BlY2lhbC5ic1RyYW5zaXRpb25FbmQ9e2JpbmRUeXBlOm4uc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxkZWxlZ2F0ZVR5cGU6bi5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGhhbmRsZTpmdW5jdGlvbih0KXtpZihuKHQudGFyZ2V0KS5pcyh0aGlzKSlyZXR1cm4gdC5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihzKXtcInVzZSBzdHJpY3RcIjt2YXIgZT0nW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyxhPWZ1bmN0aW9uKHQpe3ModCkub24oXCJjbGlja1wiLGUsdGhpcy5jbG9zZSl9O2EuVkVSU0lPTj1cIjMuNC4xXCIsYS5UUkFOU0lUSU9OX0RVUkFUSU9OPTE1MCxhLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbih0KXt2YXIgZT1zKHRoaXMpLGk9ZS5hdHRyKFwiZGF0YS10YXJnZXRcIik7aXx8KGk9KGk9ZS5hdHRyKFwiaHJlZlwiKSkmJmkucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLyxcIlwiKSksaT1cIiNcIj09PWk/W106aTt2YXIgbz1zKGRvY3VtZW50KS5maW5kKGkpO2Z1bmN0aW9uIG4oKXtvLmRldGFjaCgpLnRyaWdnZXIoXCJjbG9zZWQuYnMuYWxlcnRcIikucmVtb3ZlKCl9dCYmdC5wcmV2ZW50RGVmYXVsdCgpLG8ubGVuZ3RofHwobz1lLmNsb3Nlc3QoXCIuYWxlcnRcIikpLG8udHJpZ2dlcih0PXMuRXZlbnQoXCJjbG9zZS5icy5hbGVydFwiKSksdC5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KG8ucmVtb3ZlQ2xhc3MoXCJpblwiKSxzLnN1cHBvcnQudHJhbnNpdGlvbiYmby5oYXNDbGFzcyhcImZhZGVcIik/by5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixuKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChhLlRSQU5TSVRJT05fRFVSQVRJT04pOm4oKSl9O3ZhciB0PXMuZm4uYWxlcnQ7cy5mbi5hbGVydD1mdW5jdGlvbiBvKGkpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1zKHRoaXMpLGU9dC5kYXRhKFwiYnMuYWxlcnRcIik7ZXx8dC5kYXRhKFwiYnMuYWxlcnRcIixlPW5ldyBhKHRoaXMpKSxcInN0cmluZ1wiPT10eXBlb2YgaSYmZVtpXS5jYWxsKHQpfSl9LHMuZm4uYWxlcnQuQ29uc3RydWN0b3I9YSxzLmZuLmFsZXJ0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gcy5mbi5hbGVydD10LHRoaXN9LHMoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuYWxlcnQuZGF0YS1hcGlcIixlLGEucHJvdG90eXBlLmNsb3NlKX0oalF1ZXJ5KSxmdW5jdGlvbihzKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1mdW5jdGlvbih0LGUpe3RoaXMuJGVsZW1lbnQ9cyh0KSx0aGlzLm9wdGlvbnM9cy5leHRlbmQoe30sbi5ERUZBVUxUUyxlKSx0aGlzLmlzTG9hZGluZz0hMX07ZnVuY3Rpb24gaShvKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cyh0aGlzKSxlPXQuZGF0YShcImJzLmJ1dHRvblwiKSxpPVwib2JqZWN0XCI9PXR5cGVvZiBvJiZvO2V8fHQuZGF0YShcImJzLmJ1dHRvblwiLGU9bmV3IG4odGhpcyxpKSksXCJ0b2dnbGVcIj09bz9lLnRvZ2dsZSgpOm8mJmUuc2V0U3RhdGUobyl9KX1uLlZFUlNJT049XCIzLjQuMVwiLG4uREVGQVVMVFM9e2xvYWRpbmdUZXh0OlwibG9hZGluZy4uLlwifSxuLnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbih0KXt2YXIgZT1cImRpc2FibGVkXCIsaT10aGlzLiRlbGVtZW50LG89aS5pcyhcImlucHV0XCIpP1widmFsXCI6XCJodG1sXCIsbj1pLmRhdGEoKTt0Kz1cIlRleHRcIixudWxsPT1uLnJlc2V0VGV4dCYmaS5kYXRhKFwicmVzZXRUZXh0XCIsaVtvXSgpKSxzZXRUaW1lb3V0KHMucHJveHkoZnVuY3Rpb24oKXtpW29dKG51bGw9PW5bdF0/dGhpcy5vcHRpb25zW3RdOm5bdF0pLFwibG9hZGluZ1RleHRcIj09dD8odGhpcy5pc0xvYWRpbmc9ITAsaS5hZGRDbGFzcyhlKS5hdHRyKGUsZSkucHJvcChlLCEwKSk6dGhpcy5pc0xvYWRpbmcmJih0aGlzLmlzTG9hZGluZz0hMSxpLnJlbW92ZUNsYXNzKGUpLnJlbW92ZUF0dHIoZSkucHJvcChlLCExKSl9LHRoaXMpLDApfSxuLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt2YXIgdD0hMCxlPXRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScpO2lmKGUubGVuZ3RoKXt2YXIgaT10aGlzLiRlbGVtZW50LmZpbmQoXCJpbnB1dFwiKTtcInJhZGlvXCI9PWkucHJvcChcInR5cGVcIik/KGkucHJvcChcImNoZWNrZWRcIikmJih0PSExKSxlLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoXCJhY3RpdmVcIikpOlwiY2hlY2tib3hcIj09aS5wcm9wKFwidHlwZVwiKSYmKGkucHJvcChcImNoZWNrZWRcIikhPT10aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiYWN0aXZlXCIpJiYodD0hMSksdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKSksaS5wcm9wKFwiY2hlY2tlZFwiLHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikpLHQmJmkudHJpZ2dlcihcImNoYW5nZVwiKX1lbHNlIHRoaXMuJGVsZW1lbnQuYXR0cihcImFyaWEtcHJlc3NlZFwiLCF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiYWN0aXZlXCIpKSx0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpfTt2YXIgdD1zLmZuLmJ1dHRvbjtzLmZuLmJ1dHRvbj1pLHMuZm4uYnV0dG9uLkNvbnN0cnVjdG9yPW4scy5mbi5idXR0b24ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBzLmZuLmJ1dHRvbj10LHRoaXN9LHMoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuYnV0dG9uLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLGZ1bmN0aW9uKHQpe3ZhciBlPXModC50YXJnZXQpLmNsb3Nlc3QoXCIuYnRuXCIpO2kuY2FsbChlLFwidG9nZ2xlXCIpLHModC50YXJnZXQpLmlzKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0sIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpfHwodC5wcmV2ZW50RGVmYXVsdCgpLGUuaXMoXCJpbnB1dCxidXR0b25cIik/ZS50cmlnZ2VyKFwiZm9jdXNcIik6ZS5maW5kKFwiaW5wdXQ6dmlzaWJsZSxidXR0b246dmlzaWJsZVwiKS5maXJzdCgpLnRyaWdnZXIoXCJmb2N1c1wiKSl9KS5vbihcImZvY3VzLmJzLmJ1dHRvbi5kYXRhLWFwaSBibHVyLmJzLmJ1dHRvbi5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJyxmdW5jdGlvbih0KXtzKHQudGFyZ2V0KS5jbG9zZXN0KFwiLmJ0blwiKS50b2dnbGVDbGFzcyhcImZvY3VzXCIsL15mb2N1cyhpbik/JC8udGVzdCh0LnR5cGUpKX0pfShqUXVlcnkpLGZ1bmN0aW9uKHApe1widXNlIHN0cmljdFwiO3ZhciBjPWZ1bmN0aW9uKHQsZSl7dGhpcy4kZWxlbWVudD1wKHQpLHRoaXMuJGluZGljYXRvcnM9dGhpcy4kZWxlbWVudC5maW5kKFwiLmNhcm91c2VsLWluZGljYXRvcnNcIiksdGhpcy5vcHRpb25zPWUsdGhpcy5wYXVzZWQ9bnVsbCx0aGlzLnNsaWRpbmc9bnVsbCx0aGlzLmludGVydmFsPW51bGwsdGhpcy4kYWN0aXZlPW51bGwsdGhpcy4kaXRlbXM9bnVsbCx0aGlzLm9wdGlvbnMua2V5Ym9hcmQmJnRoaXMuJGVsZW1lbnQub24oXCJrZXlkb3duLmJzLmNhcm91c2VsXCIscC5wcm94eSh0aGlzLmtleWRvd24sdGhpcykpLFwiaG92ZXJcIj09dGhpcy5vcHRpb25zLnBhdXNlJiYhKFwib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpJiZ0aGlzLiRlbGVtZW50Lm9uKFwibW91c2VlbnRlci5icy5jYXJvdXNlbFwiLHAucHJveHkodGhpcy5wYXVzZSx0aGlzKSkub24oXCJtb3VzZWxlYXZlLmJzLmNhcm91c2VsXCIscC5wcm94eSh0aGlzLmN5Y2xlLHRoaXMpKX07ZnVuY3Rpb24gcihuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cCh0aGlzKSxlPXQuZGF0YShcImJzLmNhcm91c2VsXCIpLGk9cC5leHRlbmQoe30sYy5ERUZBVUxUUyx0LmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgbiYmbiksbz1cInN0cmluZ1wiPT10eXBlb2Ygbj9uOmkuc2xpZGU7ZXx8dC5kYXRhKFwiYnMuY2Fyb3VzZWxcIixlPW5ldyBjKHRoaXMsaSkpLFwibnVtYmVyXCI9PXR5cGVvZiBuP2UudG8obik6bz9lW29dKCk6aS5pbnRlcnZhbCYmZS5wYXVzZSgpLmN5Y2xlKCl9KX1jLlZFUlNJT049XCIzLjQuMVwiLGMuVFJBTlNJVElPTl9EVVJBVElPTj02MDAsYy5ERUZBVUxUUz17aW50ZXJ2YWw6NWUzLHBhdXNlOlwiaG92ZXJcIix3cmFwOiEwLGtleWJvYXJkOiEwfSxjLnByb3RvdHlwZS5rZXlkb3duPWZ1bmN0aW9uKHQpe2lmKCEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KHQudGFyZ2V0LnRhZ05hbWUpKXtzd2l0Y2godC53aGljaCl7Y2FzZSAzNzp0aGlzLnByZXYoKTticmVhaztjYXNlIDM5OnRoaXMubmV4dCgpO2JyZWFrO2RlZmF1bHQ6cmV0dXJufXQucHJldmVudERlZmF1bHQoKX19LGMucHJvdG90eXBlLmN5Y2xlPWZ1bmN0aW9uKHQpe3JldHVybiB0fHwodGhpcy5wYXVzZWQ9ITEpLHRoaXMuaW50ZXJ2YWwmJmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCksdGhpcy5vcHRpb25zLmludGVydmFsJiYhdGhpcy5wYXVzZWQmJih0aGlzLmludGVydmFsPXNldEludGVydmFsKHAucHJveHkodGhpcy5uZXh0LHRoaXMpLHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpLHRoaXN9LGMucHJvdG90eXBlLmdldEl0ZW1JbmRleD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy4kaXRlbXM9dC5wYXJlbnQoKS5jaGlsZHJlbihcIi5pdGVtXCIpLHRoaXMuJGl0ZW1zLmluZGV4KHR8fHRoaXMuJGFjdGl2ZSl9LGMucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb249ZnVuY3Rpb24odCxlKXt2YXIgaT10aGlzLmdldEl0ZW1JbmRleChlKTtpZigoXCJwcmV2XCI9PXQmJjA9PT1pfHxcIm5leHRcIj09dCYmaT09dGhpcy4kaXRlbXMubGVuZ3RoLTEpJiYhdGhpcy5vcHRpb25zLndyYXApcmV0dXJuIGU7dmFyIG89KGkrKFwicHJldlwiPT10Py0xOjEpKSV0aGlzLiRpdGVtcy5sZW5ndGg7cmV0dXJuIHRoaXMuJGl0ZW1zLmVxKG8pfSxjLnByb3RvdHlwZS50bz1mdW5jdGlvbih0KXt2YXIgZT10aGlzLGk9dGhpcy5nZXRJdGVtSW5kZXgodGhpcy4kYWN0aXZlPXRoaXMuJGVsZW1lbnQuZmluZChcIi5pdGVtLmFjdGl2ZVwiKSk7aWYoISh0PnRoaXMuJGl0ZW1zLmxlbmd0aC0xfHx0PDApKXJldHVybiB0aGlzLnNsaWRpbmc/dGhpcy4kZWxlbWVudC5vbmUoXCJzbGlkLmJzLmNhcm91c2VsXCIsZnVuY3Rpb24oKXtlLnRvKHQpfSk6aT09dD90aGlzLnBhdXNlKCkuY3ljbGUoKTp0aGlzLnNsaWRlKGk8dD9cIm5leHRcIjpcInByZXZcIix0aGlzLiRpdGVtcy5lcSh0KSl9LGMucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKHQpe3JldHVybiB0fHwodGhpcy5wYXVzZWQ9ITApLHRoaXMuJGVsZW1lbnQuZmluZChcIi5uZXh0LCAucHJldlwiKS5sZW5ndGgmJnAuc3VwcG9ydC50cmFuc2l0aW9uJiYodGhpcy4kZWxlbWVudC50cmlnZ2VyKHAuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCksdGhpcy5jeWNsZSghMCkpLHRoaXMuaW50ZXJ2YWw9Y2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKSx0aGlzfSxjLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7aWYoIXRoaXMuc2xpZGluZylyZXR1cm4gdGhpcy5zbGlkZShcIm5leHRcIil9LGMucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXtpZighdGhpcy5zbGlkaW5nKXJldHVybiB0aGlzLnNsaWRlKFwicHJldlwiKX0sYy5wcm90b3R5cGUuc2xpZGU9ZnVuY3Rpb24odCxlKXt2YXIgaT10aGlzLiRlbGVtZW50LmZpbmQoXCIuaXRlbS5hY3RpdmVcIiksbz1lfHx0aGlzLmdldEl0ZW1Gb3JEaXJlY3Rpb24odCxpKSxuPXRoaXMuaW50ZXJ2YWwscz1cIm5leHRcIj09dD9cImxlZnRcIjpcInJpZ2h0XCIsYT10aGlzO2lmKG8uaGFzQ2xhc3MoXCJhY3RpdmVcIikpcmV0dXJuIHRoaXMuc2xpZGluZz0hMTt2YXIgcj1vWzBdLGw9cC5FdmVudChcInNsaWRlLmJzLmNhcm91c2VsXCIse3JlbGF0ZWRUYXJnZXQ6cixkaXJlY3Rpb246c30pO2lmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihsKSwhbC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7aWYodGhpcy5zbGlkaW5nPSEwLG4mJnRoaXMucGF1c2UoKSx0aGlzLiRpbmRpY2F0b3JzLmxlbmd0aCl7dGhpcy4kaW5kaWNhdG9ycy5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTt2YXIgaD1wKHRoaXMuJGluZGljYXRvcnMuY2hpbGRyZW4oKVt0aGlzLmdldEl0ZW1JbmRleChvKV0pO2gmJmguYWRkQ2xhc3MoXCJhY3RpdmVcIil9dmFyIGQ9cC5FdmVudChcInNsaWQuYnMuY2Fyb3VzZWxcIix7cmVsYXRlZFRhcmdldDpyLGRpcmVjdGlvbjpzfSk7cmV0dXJuIHAuc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwic2xpZGVcIik/KG8uYWRkQ2xhc3ModCksXCJvYmplY3RcIj09dHlwZW9mIG8mJm8ubGVuZ3RoJiZvWzBdLm9mZnNldFdpZHRoLGkuYWRkQ2xhc3Mocyksby5hZGRDbGFzcyhzKSxpLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGZ1bmN0aW9uKCl7by5yZW1vdmVDbGFzcyhbdCxzXS5qb2luKFwiIFwiKSkuYWRkQ2xhc3MoXCJhY3RpdmVcIiksaS5yZW1vdmVDbGFzcyhbXCJhY3RpdmVcIixzXS5qb2luKFwiIFwiKSksYS5zbGlkaW5nPSExLHNldFRpbWVvdXQoZnVuY3Rpb24oKXthLiRlbGVtZW50LnRyaWdnZXIoZCl9LDApfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoYy5UUkFOU0lUSU9OX0RVUkFUSU9OKSk6KGkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksby5hZGRDbGFzcyhcImFjdGl2ZVwiKSx0aGlzLnNsaWRpbmc9ITEsdGhpcy4kZWxlbWVudC50cmlnZ2VyKGQpKSxuJiZ0aGlzLmN5Y2xlKCksdGhpc319O3ZhciB0PXAuZm4uY2Fyb3VzZWw7cC5mbi5jYXJvdXNlbD1yLHAuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3I9YyxwLmZuLmNhcm91c2VsLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gcC5mbi5jYXJvdXNlbD10LHRoaXN9O3ZhciBlPWZ1bmN0aW9uKHQpe3ZhciBlPXAodGhpcyksaT1lLmF0dHIoXCJocmVmXCIpO2kmJihpPWkucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLyxcIlwiKSk7dmFyIG89ZS5hdHRyKFwiZGF0YS10YXJnZXRcIil8fGksbj1wKGRvY3VtZW50KS5maW5kKG8pO2lmKG4uaGFzQ2xhc3MoXCJjYXJvdXNlbFwiKSl7dmFyIHM9cC5leHRlbmQoe30sbi5kYXRhKCksZS5kYXRhKCkpLGE9ZS5hdHRyKFwiZGF0YS1zbGlkZS10b1wiKTthJiYocy5pbnRlcnZhbD0hMSksci5jYWxsKG4scyksYSYmbi5kYXRhKFwiYnMuY2Fyb3VzZWxcIikudG8oYSksdC5wcmV2ZW50RGVmYXVsdCgpfX07cChkb2N1bWVudCkub24oXCJjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaVwiLFwiW2RhdGEtc2xpZGVdXCIsZSkub24oXCJjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaVwiLFwiW2RhdGEtc2xpZGUtdG9dXCIsZSkscCh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7cCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbigpe3ZhciB0PXAodGhpcyk7ci5jYWxsKHQsdC5kYXRhKCkpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1mdW5jdGlvbih0LGUpe3RoaXMuJGVsZW1lbnQ9YSh0KSx0aGlzLm9wdGlvbnM9YS5leHRlbmQoe30sci5ERUZBVUxUUyxlKSx0aGlzLiR0cmlnZ2VyPWEoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJyt0LmlkKydcIl0sW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJyt0LmlkKydcIl0nKSx0aGlzLnRyYW5zaXRpb25pbmc9bnVsbCx0aGlzLm9wdGlvbnMucGFyZW50P3RoaXMuJHBhcmVudD10aGlzLmdldFBhcmVudCgpOnRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuJGVsZW1lbnQsdGhpcy4kdHJpZ2dlciksdGhpcy5vcHRpb25zLnRvZ2dsZSYmdGhpcy50b2dnbGUoKX07ZnVuY3Rpb24gbih0KXt2YXIgZSxpPXQuYXR0cihcImRhdGEtdGFyZ2V0XCIpfHwoZT10LmF0dHIoXCJocmVmXCIpKSYmZS5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLFwiXCIpO3JldHVybiBhKGRvY3VtZW50KS5maW5kKGkpfWZ1bmN0aW9uIGwobyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PWEodGhpcyksZT10LmRhdGEoXCJicy5jb2xsYXBzZVwiKSxpPWEuZXh0ZW5kKHt9LHIuREVGQVVMVFMsdC5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIG8mJm8pOyFlJiZpLnRvZ2dsZSYmL3Nob3d8aGlkZS8udGVzdChvKSYmKGkudG9nZ2xlPSExKSxlfHx0LmRhdGEoXCJicy5jb2xsYXBzZVwiLGU9bmV3IHIodGhpcyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG8mJmVbb10oKX0pfXIuVkVSU0lPTj1cIjMuNC4xXCIsci5UUkFOU0lUSU9OX0RVUkFUSU9OPTM1MCxyLkRFRkFVTFRTPXt0b2dnbGU6ITB9LHIucHJvdG90eXBlLmRpbWVuc2lvbj1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwid2lkdGhcIik/XCJ3aWR0aFwiOlwiaGVpZ2h0XCJ9LHIucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXtpZighdGhpcy50cmFuc2l0aW9uaW5nJiYhdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImluXCIpKXt2YXIgdCxlPXRoaXMuJHBhcmVudCYmdGhpcy4kcGFyZW50LmNoaWxkcmVuKFwiLnBhbmVsXCIpLmNoaWxkcmVuKFwiLmluLCAuY29sbGFwc2luZ1wiKTtpZighKGUmJmUubGVuZ3RoJiYodD1lLmRhdGEoXCJicy5jb2xsYXBzZVwiKSkmJnQudHJhbnNpdGlvbmluZykpe3ZhciBpPWEuRXZlbnQoXCJzaG93LmJzLmNvbGxhcHNlXCIpO2lmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihpKSwhaS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7ZSYmZS5sZW5ndGgmJihsLmNhbGwoZSxcImhpZGVcIiksdHx8ZS5kYXRhKFwiYnMuY29sbGFwc2VcIixudWxsKSk7dmFyIG89dGhpcy5kaW1lbnNpb24oKTt0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKFwiY29sbGFwc2VcIikuYWRkQ2xhc3MoXCJjb2xsYXBzaW5nXCIpW29dKDApLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMuJHRyaWdnZXIucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZWRcIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy50cmFuc2l0aW9uaW5nPTE7dmFyIG49ZnVuY3Rpb24oKXt0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKFwiY29sbGFwc2luZ1wiKS5hZGRDbGFzcyhcImNvbGxhcHNlIGluXCIpW29dKFwiXCIpLHRoaXMudHJhbnNpdGlvbmluZz0wLHRoaXMuJGVsZW1lbnQudHJpZ2dlcihcInNob3duLmJzLmNvbGxhcHNlXCIpfTtpZighYS5zdXBwb3J0LnRyYW5zaXRpb24pcmV0dXJuIG4uY2FsbCh0aGlzKTt2YXIgcz1hLmNhbWVsQ2FzZShbXCJzY3JvbGxcIixvXS5qb2luKFwiLVwiKSk7dGhpcy4kZWxlbWVudC5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixhLnByb3h5KG4sdGhpcykpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHIuVFJBTlNJVElPTl9EVVJBVElPTilbb10odGhpcy4kZWxlbWVudFswXVtzXSl9fX19LHIucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24oKXtpZighdGhpcy50cmFuc2l0aW9uaW5nJiZ0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiaW5cIikpe3ZhciB0PWEuRXZlbnQoXCJoaWRlLmJzLmNvbGxhcHNlXCIpO2lmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcih0KSwhdC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGU9dGhpcy5kaW1lbnNpb24oKTt0aGlzLiRlbGVtZW50W2VdKHRoaXMuJGVsZW1lbnRbZV0oKSlbMF0ub2Zmc2V0SGVpZ2h0LHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoXCJjb2xsYXBzaW5nXCIpLnJlbW92ZUNsYXNzKFwiY29sbGFwc2UgaW5cIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy4kdHJpZ2dlci5hZGRDbGFzcyhcImNvbGxhcHNlZFwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLnRyYW5zaXRpb25pbmc9MTt2YXIgaT1mdW5jdGlvbigpe3RoaXMudHJhbnNpdGlvbmluZz0wLHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzaW5nXCIpLmFkZENsYXNzKFwiY29sbGFwc2VcIikudHJpZ2dlcihcImhpZGRlbi5icy5jb2xsYXBzZVwiKX07aWYoIWEuc3VwcG9ydC50cmFuc2l0aW9uKXJldHVybiBpLmNhbGwodGhpcyk7dGhpcy4kZWxlbWVudFtlXSgwKS5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixhLnByb3h5KGksdGhpcykpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHIuVFJBTlNJVElPTl9EVVJBVElPTil9fX0sci5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiaW5cIik/XCJoaWRlXCI6XCJzaG93XCJdKCl9LHIucHJvdG90eXBlLmdldFBhcmVudD1mdW5jdGlvbigpe3JldHVybiBhKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5wYXJlbnQpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyt0aGlzLm9wdGlvbnMucGFyZW50KydcIl0nKS5lYWNoKGEucHJveHkoZnVuY3Rpb24odCxlKXt2YXIgaT1hKGUpO3RoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKG4oaSksaSl9LHRoaXMpKS5lbmQoKX0sci5wcm90b3R5cGUuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzPWZ1bmN0aW9uKHQsZSl7dmFyIGk9dC5oYXNDbGFzcyhcImluXCIpO3QuYXR0cihcImFyaWEtZXhwYW5kZWRcIixpKSxlLnRvZ2dsZUNsYXNzKFwiY29sbGFwc2VkXCIsIWkpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsaSl9O3ZhciB0PWEuZm4uY29sbGFwc2U7YS5mbi5jb2xsYXBzZT1sLGEuZm4uY29sbGFwc2UuQ29uc3RydWN0b3I9cixhLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5jb2xsYXBzZT10LHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLGZ1bmN0aW9uKHQpe3ZhciBlPWEodGhpcyk7ZS5hdHRyKFwiZGF0YS10YXJnZXRcIil8fHQucHJldmVudERlZmF1bHQoKTt2YXIgaT1uKGUpLG89aS5kYXRhKFwiYnMuY29sbGFwc2VcIik/XCJ0b2dnbGVcIjplLmRhdGEoKTtsLmNhbGwoaSxvKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO3ZhciByPSdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsbz1mdW5jdGlvbih0KXthKHQpLm9uKFwiY2xpY2suYnMuZHJvcGRvd25cIix0aGlzLnRvZ2dsZSl9O2Z1bmN0aW9uIGwodCl7dmFyIGU9dC5hdHRyKFwiZGF0YS10YXJnZXRcIik7ZXx8KGU9KGU9dC5hdHRyKFwiaHJlZlwiKSkmJi8jW0EtWmEtel0vLnRlc3QoZSkmJmUucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLyxcIlwiKSk7dmFyIGk9XCIjXCIhPT1lP2EoZG9jdW1lbnQpLmZpbmQoZSk6bnVsbDtyZXR1cm4gaSYmaS5sZW5ndGg/aTp0LnBhcmVudCgpfWZ1bmN0aW9uIHMobyl7byYmMz09PW8ud2hpY2h8fChhKFwiLmRyb3Bkb3duLWJhY2tkcm9wXCIpLnJlbW92ZSgpLGEocikuZWFjaChmdW5jdGlvbigpe3ZhciB0PWEodGhpcyksZT1sKHQpLGk9e3JlbGF0ZWRUYXJnZXQ6dGhpc307ZS5oYXNDbGFzcyhcIm9wZW5cIikmJihvJiZcImNsaWNrXCI9PW8udHlwZSYmL2lucHV0fHRleHRhcmVhL2kudGVzdChvLnRhcmdldC50YWdOYW1lKSYmYS5jb250YWlucyhlWzBdLG8udGFyZ2V0KXx8KGUudHJpZ2dlcihvPWEuRXZlbnQoXCJoaWRlLmJzLmRyb3Bkb3duXCIsaSkpLG8uaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0LmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsXCJmYWxzZVwiKSxlLnJlbW92ZUNsYXNzKFwib3BlblwiKS50cmlnZ2VyKGEuRXZlbnQoXCJoaWRkZW4uYnMuZHJvcGRvd25cIixpKSkpKSl9KSl9by5WRVJTSU9OPVwiMy40LjFcIixvLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7dmFyIGU9YSh0aGlzKTtpZighZS5pcyhcIi5kaXNhYmxlZCwgOmRpc2FibGVkXCIpKXt2YXIgaT1sKGUpLG89aS5oYXNDbGFzcyhcIm9wZW5cIik7aWYocygpLCFvKXtcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50JiYhaS5jbG9zZXN0KFwiLm5hdmJhci1uYXZcIikubGVuZ3RoJiZhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLmFkZENsYXNzKFwiZHJvcGRvd24tYmFja2Ryb3BcIikuaW5zZXJ0QWZ0ZXIoYSh0aGlzKSkub24oXCJjbGlja1wiLHMpO3ZhciBuPXtyZWxhdGVkVGFyZ2V0OnRoaXN9O2lmKGkudHJpZ2dlcih0PWEuRXZlbnQoXCJzaG93LmJzLmRyb3Bkb3duXCIsbikpLHQuaXNEZWZhdWx0UHJldmVudGVkKCkpcmV0dXJuO2UudHJpZ2dlcihcImZvY3VzXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsXCJ0cnVlXCIpLGkudG9nZ2xlQ2xhc3MoXCJvcGVuXCIpLnRyaWdnZXIoYS5FdmVudChcInNob3duLmJzLmRyb3Bkb3duXCIsbikpfXJldHVybiExfX0sby5wcm90b3R5cGUua2V5ZG93bj1mdW5jdGlvbih0KXtpZigvKDM4fDQwfDI3fDMyKS8udGVzdCh0LndoaWNoKSYmIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QodC50YXJnZXQudGFnTmFtZSkpe3ZhciBlPWEodGhpcyk7aWYodC5wcmV2ZW50RGVmYXVsdCgpLHQuc3RvcFByb3BhZ2F0aW9uKCksIWUuaXMoXCIuZGlzYWJsZWQsIDpkaXNhYmxlZFwiKSl7dmFyIGk9bChlKSxvPWkuaGFzQ2xhc3MoXCJvcGVuXCIpO2lmKCFvJiYyNyE9dC53aGljaHx8byYmMjc9PXQud2hpY2gpcmV0dXJuIDI3PT10LndoaWNoJiZpLmZpbmQocikudHJpZ2dlcihcImZvY3VzXCIpLGUudHJpZ2dlcihcImNsaWNrXCIpO3ZhciBuPWkuZmluZChcIi5kcm9wZG93bi1tZW51IGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYVwiKTtpZihuLmxlbmd0aCl7dmFyIHM9bi5pbmRleCh0LnRhcmdldCk7Mzg9PXQud2hpY2gmJjA8cyYmcy0tLDQwPT10LndoaWNoJiZzPG4ubGVuZ3RoLTEmJnMrKyx+c3x8KHM9MCksbi5lcShzKS50cmlnZ2VyKFwiZm9jdXNcIil9fX19O3ZhciB0PWEuZm4uZHJvcGRvd247YS5mbi5kcm9wZG93bj1mdW5jdGlvbiBlKGkpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1hKHRoaXMpLGU9dC5kYXRhKFwiYnMuZHJvcGRvd25cIik7ZXx8dC5kYXRhKFwiYnMuZHJvcGRvd25cIixlPW5ldyBvKHRoaXMpKSxcInN0cmluZ1wiPT10eXBlb2YgaSYmZVtpXS5jYWxsKHQpfSl9LGEuZm4uZHJvcGRvd24uQ29uc3RydWN0b3I9byxhLmZuLmRyb3Bkb3duLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5kcm9wZG93bj10LHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGlcIixzKS5vbihcImNsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIsXCIuZHJvcGRvd24gZm9ybVwiLGZ1bmN0aW9uKHQpe3Quc3RvcFByb3BhZ2F0aW9uKCl9KS5vbihcImNsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIscixvLnByb3RvdHlwZS50b2dnbGUpLm9uKFwia2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaVwiLHIsby5wcm90b3R5cGUua2V5ZG93bikub24oXCJrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIsXCIuZHJvcGRvd24tbWVudVwiLG8ucHJvdG90eXBlLmtleWRvd24pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO3ZhciBzPWZ1bmN0aW9uKHQsZSl7dGhpcy5vcHRpb25zPWUsdGhpcy4kYm9keT1hKGRvY3VtZW50LmJvZHkpLHRoaXMuJGVsZW1lbnQ9YSh0KSx0aGlzLiRkaWFsb2c9dGhpcy4kZWxlbWVudC5maW5kKFwiLm1vZGFsLWRpYWxvZ1wiKSx0aGlzLiRiYWNrZHJvcD1udWxsLHRoaXMuaXNTaG93bj1udWxsLHRoaXMub3JpZ2luYWxCb2R5UGFkPW51bGwsdGhpcy5zY3JvbGxiYXJXaWR0aD0wLHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaz0hMSx0aGlzLmZpeGVkQ29udGVudD1cIi5uYXZiYXItZml4ZWQtdG9wLCAubmF2YmFyLWZpeGVkLWJvdHRvbVwiLHRoaXMub3B0aW9ucy5yZW1vdGUmJnRoaXMuJGVsZW1lbnQuZmluZChcIi5tb2RhbC1jb250ZW50XCIpLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSxhLnByb3h5KGZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC50cmlnZ2VyKFwibG9hZGVkLmJzLm1vZGFsXCIpfSx0aGlzKSl9O2Z1bmN0aW9uIHIobyxuKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9YSh0aGlzKSxlPXQuZGF0YShcImJzLm1vZGFsXCIpLGk9YS5leHRlbmQoe30scy5ERUZBVUxUUyx0LmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgbyYmbyk7ZXx8dC5kYXRhKFwiYnMubW9kYWxcIixlPW5ldyBzKHRoaXMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBvP2Vbb10obik6aS5zaG93JiZlLnNob3cobil9KX1zLlZFUlNJT049XCIzLjQuMVwiLHMuVFJBTlNJVElPTl9EVVJBVElPTj0zMDAscy5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OPTE1MCxzLkRFRkFVTFRTPXtiYWNrZHJvcDohMCxrZXlib2FyZDohMCxzaG93OiEwfSxzLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaXNTaG93bj90aGlzLmhpZGUoKTp0aGlzLnNob3codCl9LHMucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oaSl7dmFyIG89dGhpcyx0PWEuRXZlbnQoXCJzaG93LmJzLm1vZGFsXCIse3JlbGF0ZWRUYXJnZXQ6aX0pO3RoaXMuJGVsZW1lbnQudHJpZ2dlcih0KSx0aGlzLmlzU2hvd258fHQuaXNEZWZhdWx0UHJldmVudGVkKCl8fCh0aGlzLmlzU2hvd249ITAsdGhpcy5jaGVja1Njcm9sbGJhcigpLHRoaXMuc2V0U2Nyb2xsYmFyKCksdGhpcy4kYm9keS5hZGRDbGFzcyhcIm1vZGFsLW9wZW5cIiksdGhpcy5lc2NhcGUoKSx0aGlzLnJlc2l6ZSgpLHRoaXMuJGVsZW1lbnQub24oXCJjbGljay5kaXNtaXNzLmJzLm1vZGFsXCIsJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsYS5wcm94eSh0aGlzLmhpZGUsdGhpcykpLHRoaXMuJGRpYWxvZy5vbihcIm1vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIsZnVuY3Rpb24oKXtvLiRlbGVtZW50Lm9uZShcIm1vdXNldXAuZGlzbWlzcy5icy5tb2RhbFwiLGZ1bmN0aW9uKHQpe2EodC50YXJnZXQpLmlzKG8uJGVsZW1lbnQpJiYoby5pZ25vcmVCYWNrZHJvcENsaWNrPSEwKX0pfSksdGhpcy5iYWNrZHJvcChmdW5jdGlvbigpe3ZhciB0PWEuc3VwcG9ydC50cmFuc2l0aW9uJiZvLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKTtvLiRlbGVtZW50LnBhcmVudCgpLmxlbmd0aHx8by4kZWxlbWVudC5hcHBlbmRUbyhvLiRib2R5KSxvLiRlbGVtZW50LnNob3coKS5zY3JvbGxUb3AoMCksby5hZGp1c3REaWFsb2coKSx0JiZvLiRlbGVtZW50WzBdLm9mZnNldFdpZHRoLG8uJGVsZW1lbnQuYWRkQ2xhc3MoXCJpblwiKSxvLmVuZm9yY2VGb2N1cygpO3ZhciBlPWEuRXZlbnQoXCJzaG93bi5icy5tb2RhbFwiLHtyZWxhdGVkVGFyZ2V0Oml9KTt0P28uJGRpYWxvZy5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixmdW5jdGlvbigpe28uJGVsZW1lbnQudHJpZ2dlcihcImZvY3VzXCIpLnRyaWdnZXIoZSl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChzLlRSQU5TSVRJT05fRFVSQVRJT04pOm8uJGVsZW1lbnQudHJpZ2dlcihcImZvY3VzXCIpLnRyaWdnZXIoZSl9KSl9LHMucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24odCl7dCYmdC5wcmV2ZW50RGVmYXVsdCgpLHQ9YS5FdmVudChcImhpZGUuYnMubW9kYWxcIiksdGhpcy4kZWxlbWVudC50cmlnZ2VyKHQpLHRoaXMuaXNTaG93biYmIXQuaXNEZWZhdWx0UHJldmVudGVkKCkmJih0aGlzLmlzU2hvd249ITEsdGhpcy5lc2NhcGUoKSx0aGlzLnJlc2l6ZSgpLGEoZG9jdW1lbnQpLm9mZihcImZvY3VzaW4uYnMubW9kYWxcIiksdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImluXCIpLm9mZihcImNsaWNrLmRpc21pc3MuYnMubW9kYWxcIikub2ZmKFwibW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsXCIpLHRoaXMuJGRpYWxvZy5vZmYoXCJtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbFwiKSxhLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik/dGhpcy4kZWxlbWVudC5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixhLnByb3h5KHRoaXMuaGlkZU1vZGFsLHRoaXMpKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChzLlRSQU5TSVRJT05fRFVSQVRJT04pOnRoaXMuaGlkZU1vZGFsKCkpfSxzLnByb3RvdHlwZS5lbmZvcmNlRm9jdXM9ZnVuY3Rpb24oKXthKGRvY3VtZW50KS5vZmYoXCJmb2N1c2luLmJzLm1vZGFsXCIpLm9uKFwiZm9jdXNpbi5icy5tb2RhbFwiLGEucHJveHkoZnVuY3Rpb24odCl7ZG9jdW1lbnQ9PT10LnRhcmdldHx8dGhpcy4kZWxlbWVudFswXT09PXQudGFyZ2V0fHx0aGlzLiRlbGVtZW50Lmhhcyh0LnRhcmdldCkubGVuZ3RofHx0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJmb2N1c1wiKX0sdGhpcykpfSxzLnByb3RvdHlwZS5lc2NhcGU9ZnVuY3Rpb24oKXt0aGlzLmlzU2hvd24mJnRoaXMub3B0aW9ucy5rZXlib2FyZD90aGlzLiRlbGVtZW50Lm9uKFwia2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIsYS5wcm94eShmdW5jdGlvbih0KXsyNz09dC53aGljaCYmdGhpcy5oaWRlKCl9LHRoaXMpKTp0aGlzLmlzU2hvd258fHRoaXMuJGVsZW1lbnQub2ZmKFwia2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIpfSxzLnByb3RvdHlwZS5yZXNpemU9ZnVuY3Rpb24oKXt0aGlzLmlzU2hvd24/YSh3aW5kb3cpLm9uKFwicmVzaXplLmJzLm1vZGFsXCIsYS5wcm94eSh0aGlzLmhhbmRsZVVwZGF0ZSx0aGlzKSk6YSh3aW5kb3cpLm9mZihcInJlc2l6ZS5icy5tb2RhbFwiKX0scy5wcm90b3R5cGUuaGlkZU1vZGFsPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLiRlbGVtZW50LmhpZGUoKSx0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uKCl7dC4kYm9keS5yZW1vdmVDbGFzcyhcIm1vZGFsLW9wZW5cIiksdC5yZXNldEFkanVzdG1lbnRzKCksdC5yZXNldFNjcm9sbGJhcigpLHQuJGVsZW1lbnQudHJpZ2dlcihcImhpZGRlbi5icy5tb2RhbFwiKX0pfSxzLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcD1mdW5jdGlvbigpe3RoaXMuJGJhY2tkcm9wJiZ0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKSx0aGlzLiRiYWNrZHJvcD1udWxsfSxzLnByb3RvdHlwZS5iYWNrZHJvcD1mdW5jdGlvbih0KXt2YXIgZT10aGlzLGk9dGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik/XCJmYWRlXCI6XCJcIjtpZih0aGlzLmlzU2hvd24mJnRoaXMub3B0aW9ucy5iYWNrZHJvcCl7dmFyIG89YS5zdXBwb3J0LnRyYW5zaXRpb24mJmk7aWYodGhpcy4kYmFja2Ryb3A9YShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKS5hZGRDbGFzcyhcIm1vZGFsLWJhY2tkcm9wIFwiK2kpLmFwcGVuZFRvKHRoaXMuJGJvZHkpLHRoaXMuJGVsZW1lbnQub24oXCJjbGljay5kaXNtaXNzLmJzLm1vZGFsXCIsYS5wcm94eShmdW5jdGlvbih0KXt0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2s/dGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrPSExOnQudGFyZ2V0PT09dC5jdXJyZW50VGFyZ2V0JiYoXCJzdGF0aWNcIj09dGhpcy5vcHRpb25zLmJhY2tkcm9wP3RoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKTp0aGlzLmhpZGUoKSl9LHRoaXMpKSxvJiZ0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCx0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcyhcImluXCIpLCF0KXJldHVybjtvP3RoaXMuJGJhY2tkcm9wLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLHQpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHMuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTik6dCgpfWVsc2UgaWYoIXRoaXMuaXNTaG93biYmdGhpcy4kYmFja2Ryb3Ape3RoaXMuJGJhY2tkcm9wLnJlbW92ZUNsYXNzKFwiaW5cIik7dmFyIG49ZnVuY3Rpb24oKXtlLnJlbW92ZUJhY2tkcm9wKCksdCYmdCgpfTthLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik/dGhpcy4kYmFja2Ryb3Aub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsbikuZW11bGF0ZVRyYW5zaXRpb25FbmQocy5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKTpuKCl9ZWxzZSB0JiZ0KCl9LHMucHJvdG90eXBlLmhhbmRsZVVwZGF0ZT1mdW5jdGlvbigpe3RoaXMuYWRqdXN0RGlhbG9nKCl9LHMucHJvdG90eXBlLmFkanVzdERpYWxvZz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuJGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0PmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7dGhpcy4kZWxlbWVudC5jc3Moe3BhZGRpbmdMZWZ0OiF0aGlzLmJvZHlJc092ZXJmbG93aW5nJiZ0P3RoaXMuc2Nyb2xsYmFyV2lkdGg6XCJcIixwYWRkaW5nUmlnaHQ6dGhpcy5ib2R5SXNPdmVyZmxvd2luZyYmIXQ/dGhpcy5zY3JvbGxiYXJXaWR0aDpcIlwifSl9LHMucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHM9ZnVuY3Rpb24oKXt0aGlzLiRlbGVtZW50LmNzcyh7cGFkZGluZ0xlZnQ6XCJcIixwYWRkaW5nUmlnaHQ6XCJcIn0pfSxzLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhcj1mdW5jdGlvbigpe3ZhciB0PXdpbmRvdy5pbm5lcldpZHRoO2lmKCF0KXt2YXIgZT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7dD1lLnJpZ2h0LU1hdGguYWJzKGUubGVmdCl9dGhpcy5ib2R5SXNPdmVyZmxvd2luZz1kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoPHQsdGhpcy5zY3JvbGxiYXJXaWR0aD10aGlzLm1lYXN1cmVTY3JvbGxiYXIoKX0scy5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dmFyIHQ9cGFyc2VJbnQodGhpcy4kYm9keS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpfHwwLDEwKTt0aGlzLm9yaWdpbmFsQm9keVBhZD1kb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodHx8XCJcIjt2YXIgbj10aGlzLnNjcm9sbGJhcldpZHRoO3RoaXMuYm9keUlzT3ZlcmZsb3dpbmcmJih0aGlzLiRib2R5LmNzcyhcInBhZGRpbmctcmlnaHRcIix0K24pLGEodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24odCxlKXt2YXIgaT1lLnN0eWxlLnBhZGRpbmdSaWdodCxvPWEoZSkuY3NzKFwicGFkZGluZy1yaWdodFwiKTthKGUpLmRhdGEoXCJwYWRkaW5nLXJpZ2h0XCIsaSkuY3NzKFwicGFkZGluZy1yaWdodFwiLHBhcnNlRmxvYXQobykrbitcInB4XCIpfSkpfSxzLnByb3RvdHlwZS5yZXNldFNjcm9sbGJhcj1mdW5jdGlvbigpe3RoaXMuJGJvZHkuY3NzKFwicGFkZGluZy1yaWdodFwiLHRoaXMub3JpZ2luYWxCb2R5UGFkKSxhKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uKHQsZSl7dmFyIGk9YShlKS5kYXRhKFwicGFkZGluZy1yaWdodFwiKTthKGUpLnJlbW92ZURhdGEoXCJwYWRkaW5nLXJpZ2h0XCIpLGUuc3R5bGUucGFkZGluZ1JpZ2h0PWl8fFwiXCJ9KX0scy5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhcj1mdW5jdGlvbigpe3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dC5jbGFzc05hbWU9XCJtb2RhbC1zY3JvbGxiYXItbWVhc3VyZVwiLHRoaXMuJGJvZHkuYXBwZW5kKHQpO3ZhciBlPXQub2Zmc2V0V2lkdGgtdC5jbGllbnRXaWR0aDtyZXR1cm4gdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZCh0KSxlfTt2YXIgdD1hLmZuLm1vZGFsO2EuZm4ubW9kYWw9cixhLmZuLm1vZGFsLkNvbnN0cnVjdG9yPXMsYS5mbi5tb2RhbC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4ubW9kYWw9dCx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLm1vZGFsLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJyxmdW5jdGlvbih0KXt2YXIgZT1hKHRoaXMpLGk9ZS5hdHRyKFwiaHJlZlwiKSxvPWUuYXR0cihcImRhdGEtdGFyZ2V0XCIpfHxpJiZpLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sXCJcIiksbj1hKGRvY3VtZW50KS5maW5kKG8pLHM9bi5kYXRhKFwiYnMubW9kYWxcIik/XCJ0b2dnbGVcIjphLmV4dGVuZCh7cmVtb3RlOiEvIy8udGVzdChpKSYmaX0sbi5kYXRhKCksZS5kYXRhKCkpO2UuaXMoXCJhXCIpJiZ0LnByZXZlbnREZWZhdWx0KCksbi5vbmUoXCJzaG93LmJzLm1vZGFsXCIsZnVuY3Rpb24odCl7dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8bi5vbmUoXCJoaWRkZW4uYnMubW9kYWxcIixmdW5jdGlvbigpe2UuaXMoXCI6dmlzaWJsZVwiKSYmZS50cmlnZ2VyKFwiZm9jdXNcIil9KX0pLHIuY2FsbChuLHMsdGhpcyl9KX0oalF1ZXJ5KSxmdW5jdGlvbihnKXtcInVzZSBzdHJpY3RcIjt2YXIgbz1bXCJzYW5pdGl6ZVwiLFwid2hpdGVMaXN0XCIsXCJzYW5pdGl6ZUZuXCJdLGE9W1wiYmFja2dyb3VuZFwiLFwiY2l0ZVwiLFwiaHJlZlwiLFwiaXRlbXR5cGVcIixcImxvbmdkZXNjXCIsXCJwb3N0ZXJcIixcInNyY1wiLFwieGxpbms6aHJlZlwiXSx0PXtcIipcIjpbXCJjbGFzc1wiLFwiZGlyXCIsXCJpZFwiLFwibGFuZ1wiLFwicm9sZVwiLC9eYXJpYS1bXFx3LV0qJC9pXSxhOltcInRhcmdldFwiLFwiaHJlZlwiLFwidGl0bGVcIixcInJlbFwiXSxhcmVhOltdLGI6W10sYnI6W10sY29sOltdLGNvZGU6W10sZGl2OltdLGVtOltdLGhyOltdLGgxOltdLGgyOltdLGgzOltdLGg0OltdLGg1OltdLGg2OltdLGk6W10saW1nOltcInNyY1wiLFwiYWx0XCIsXCJ0aXRsZVwiLFwid2lkdGhcIixcImhlaWdodFwiXSxsaTpbXSxvbDpbXSxwOltdLHByZTpbXSxzOltdLHNtYWxsOltdLHNwYW46W10sc3ViOltdLHN1cDpbXSxzdHJvbmc6W10sdTpbXSx1bDpbXX0scj0vXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlKTp8W14mOi8/I10qKD86Wy8/I118JCkpL2dpLGw9L15kYXRhOig/OmltYWdlXFwvKD86Ym1wfGdpZnxqcGVnfGpwZ3xwbmd8dGlmZnx3ZWJwKXx2aWRlb1xcLyg/Om1wZWd8bXA0fG9nZ3x3ZWJtKXxhdWRpb1xcLyg/Om1wM3xvZ2F8b2dnfG9wdXMpKTtiYXNlNjQsW2EtejAtOSsvXSs9KiQvaTtmdW5jdGlvbiB1KHQsZSl7dmFyIGk9dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2lmKC0xIT09Zy5pbkFycmF5KGksZSkpcmV0dXJuLTE9PT1nLmluQXJyYXkoaSxhKXx8Qm9vbGVhbih0Lm5vZGVWYWx1ZS5tYXRjaChyKXx8dC5ub2RlVmFsdWUubWF0Y2gobCkpO2Zvcih2YXIgbz1nKGUpLmZpbHRlcihmdW5jdGlvbih0LGUpe3JldHVybiBlIGluc3RhbmNlb2YgUmVnRXhwfSksbj0wLHM9by5sZW5ndGg7bjxzO24rKylpZihpLm1hdGNoKG9bbl0pKXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIG4odCxlLGkpe2lmKDA9PT10Lmxlbmd0aClyZXR1cm4gdDtpZihpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBpKXJldHVybiBpKHQpO2lmKCFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbnx8IWRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudClyZXR1cm4gdDt2YXIgbz1kb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoXCJzYW5pdGl6YXRpb25cIik7by5ib2R5LmlubmVySFRNTD10O2Zvcih2YXIgbj1nLm1hcChlLGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGV9KSxzPWcoby5ib2R5KS5maW5kKFwiKlwiKSxhPTAscj1zLmxlbmd0aDthPHI7YSsrKXt2YXIgbD1zW2FdLGg9bC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2lmKC0xIT09Zy5pbkFycmF5KGgsbikpZm9yKHZhciBkPWcubWFwKGwuYXR0cmlidXRlcyxmdW5jdGlvbih0KXtyZXR1cm4gdH0pLHA9W10uY29uY2F0KGVbXCIqXCJdfHxbXSxlW2hdfHxbXSksYz0wLGY9ZC5sZW5ndGg7YzxmO2MrKyl1KGRbY10scCl8fGwucmVtb3ZlQXR0cmlidXRlKGRbY10ubm9kZU5hbWUpO2Vsc2UgbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGwpfXJldHVybiBvLmJvZHkuaW5uZXJIVE1MfXZhciBtPWZ1bmN0aW9uKHQsZSl7dGhpcy50eXBlPW51bGwsdGhpcy5vcHRpb25zPW51bGwsdGhpcy5lbmFibGVkPW51bGwsdGhpcy50aW1lb3V0PW51bGwsdGhpcy5ob3ZlclN0YXRlPW51bGwsdGhpcy4kZWxlbWVudD1udWxsLHRoaXMuaW5TdGF0ZT1udWxsLHRoaXMuaW5pdChcInRvb2x0aXBcIix0LGUpfTttLlZFUlNJT049XCIzLjQuMVwiLG0uVFJBTlNJVElPTl9EVVJBVElPTj0xNTAsbS5ERUZBVUxUUz17YW5pbWF0aW9uOiEwLHBsYWNlbWVudDpcInRvcFwiLHNlbGVjdG9yOiExLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsdHJpZ2dlcjpcImhvdmVyIGZvY3VzXCIsdGl0bGU6XCJcIixkZWxheTowLGh0bWw6ITEsY29udGFpbmVyOiExLHZpZXdwb3J0OntzZWxlY3RvcjpcImJvZHlcIixwYWRkaW5nOjB9LHNhbml0aXplOiEwLHNhbml0aXplRm46bnVsbCx3aGl0ZUxpc3Q6dH0sbS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbih0LGUsaSl7aWYodGhpcy5lbmFibGVkPSEwLHRoaXMudHlwZT10LHRoaXMuJGVsZW1lbnQ9ZyhlKSx0aGlzLm9wdGlvbnM9dGhpcy5nZXRPcHRpb25zKGkpLHRoaXMuJHZpZXdwb3J0PXRoaXMub3B0aW9ucy52aWV3cG9ydCYmZyhkb2N1bWVudCkuZmluZChnLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KT90aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLHRoaXMuJGVsZW1lbnQpOnRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3Rvcnx8dGhpcy5vcHRpb25zLnZpZXdwb3J0KSx0aGlzLmluU3RhdGU9e2NsaWNrOiExLGhvdmVyOiExLGZvY3VzOiExfSx0aGlzLiRlbGVtZW50WzBdaW5zdGFuY2VvZiBkb2N1bWVudC5jb25zdHJ1Y3RvciYmIXRoaXMub3B0aW9ucy5zZWxlY3Rvcil0aHJvdyBuZXcgRXJyb3IoXCJgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyBcIit0aGlzLnR5cGUrXCIgb24gdGhlIHdpbmRvdy5kb2N1bWVudCBvYmplY3QhXCIpO2Zvcih2YXIgbz10aGlzLm9wdGlvbnMudHJpZ2dlci5zcGxpdChcIiBcIiksbj1vLmxlbmd0aDtuLS07KXt2YXIgcz1vW25dO2lmKFwiY2xpY2tcIj09cyl0aGlzLiRlbGVtZW50Lm9uKFwiY2xpY2suXCIrdGhpcy50eXBlLHRoaXMub3B0aW9ucy5zZWxlY3RvcixnLnByb3h5KHRoaXMudG9nZ2xlLHRoaXMpKTtlbHNlIGlmKFwibWFudWFsXCIhPXMpe3ZhciBhPVwiaG92ZXJcIj09cz9cIm1vdXNlZW50ZXJcIjpcImZvY3VzaW5cIixyPVwiaG92ZXJcIj09cz9cIm1vdXNlbGVhdmVcIjpcImZvY3Vzb3V0XCI7dGhpcy4kZWxlbWVudC5vbihhK1wiLlwiK3RoaXMudHlwZSx0aGlzLm9wdGlvbnMuc2VsZWN0b3IsZy5wcm94eSh0aGlzLmVudGVyLHRoaXMpKSx0aGlzLiRlbGVtZW50Lm9uKHIrXCIuXCIrdGhpcy50eXBlLHRoaXMub3B0aW9ucy5zZWxlY3RvcixnLnByb3h5KHRoaXMubGVhdmUsdGhpcykpfX10aGlzLm9wdGlvbnMuc2VsZWN0b3I/dGhpcy5fb3B0aW9ucz1nLmV4dGVuZCh7fSx0aGlzLm9wdGlvbnMse3RyaWdnZXI6XCJtYW51YWxcIixzZWxlY3RvcjpcIlwifSk6dGhpcy5maXhUaXRsZSgpfSxtLnByb3RvdHlwZS5nZXREZWZhdWx0cz1mdW5jdGlvbigpe3JldHVybiBtLkRFRkFVTFRTfSxtLnByb3RvdHlwZS5nZXRPcHRpb25zPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuJGVsZW1lbnQuZGF0YSgpO2Zvcih2YXIgaSBpbiBlKWUuaGFzT3duUHJvcGVydHkoaSkmJi0xIT09Zy5pbkFycmF5KGksbykmJmRlbGV0ZSBlW2ldO3JldHVybih0PWcuZXh0ZW5kKHt9LHRoaXMuZ2V0RGVmYXVsdHMoKSxlLHQpKS5kZWxheSYmXCJudW1iZXJcIj09dHlwZW9mIHQuZGVsYXkmJih0LmRlbGF5PXtzaG93OnQuZGVsYXksaGlkZTp0LmRlbGF5fSksdC5zYW5pdGl6ZSYmKHQudGVtcGxhdGU9bih0LnRlbXBsYXRlLHQud2hpdGVMaXN0LHQuc2FuaXRpemVGbikpLHR9LG0ucHJvdG90eXBlLmdldERlbGVnYXRlT3B0aW9ucz1mdW5jdGlvbigpe3ZhciBpPXt9LG89dGhpcy5nZXREZWZhdWx0cygpO3JldHVybiB0aGlzLl9vcHRpb25zJiZnLmVhY2godGhpcy5fb3B0aW9ucyxmdW5jdGlvbih0LGUpe29bdF0hPWUmJihpW3RdPWUpfSksaX0sbS5wcm90b3R5cGUuZW50ZXI9ZnVuY3Rpb24odCl7dmFyIGU9dCBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3I/dDpnKHQuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSk7aWYoZXx8KGU9bmV3IHRoaXMuY29uc3RydWN0b3IodC5jdXJyZW50VGFyZ2V0LHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpLGcodC5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlLGUpKSx0IGluc3RhbmNlb2YgZy5FdmVudCYmKGUuaW5TdGF0ZVtcImZvY3VzaW5cIj09dC50eXBlP1wiZm9jdXNcIjpcImhvdmVyXCJdPSEwKSxlLnRpcCgpLmhhc0NsYXNzKFwiaW5cIil8fFwiaW5cIj09ZS5ob3ZlclN0YXRlKWUuaG92ZXJTdGF0ZT1cImluXCI7ZWxzZXtpZihjbGVhclRpbWVvdXQoZS50aW1lb3V0KSxlLmhvdmVyU3RhdGU9XCJpblwiLCFlLm9wdGlvbnMuZGVsYXl8fCFlLm9wdGlvbnMuZGVsYXkuc2hvdylyZXR1cm4gZS5zaG93KCk7ZS50aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcImluXCI9PWUuaG92ZXJTdGF0ZSYmZS5zaG93KCl9LGUub3B0aW9ucy5kZWxheS5zaG93KX19LG0ucHJvdG90eXBlLmlzSW5TdGF0ZVRydWU9ZnVuY3Rpb24oKXtmb3IodmFyIHQgaW4gdGhpcy5pblN0YXRlKWlmKHRoaXMuaW5TdGF0ZVt0XSlyZXR1cm4hMDtyZXR1cm4hMX0sbS5wcm90b3R5cGUubGVhdmU9ZnVuY3Rpb24odCl7dmFyIGU9dCBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3I/dDpnKHQuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSk7aWYoZXx8KGU9bmV3IHRoaXMuY29uc3RydWN0b3IodC5jdXJyZW50VGFyZ2V0LHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpLGcodC5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlLGUpKSx0IGluc3RhbmNlb2YgZy5FdmVudCYmKGUuaW5TdGF0ZVtcImZvY3Vzb3V0XCI9PXQudHlwZT9cImZvY3VzXCI6XCJob3ZlclwiXT0hMSksIWUuaXNJblN0YXRlVHJ1ZSgpKXtpZihjbGVhclRpbWVvdXQoZS50aW1lb3V0KSxlLmhvdmVyU3RhdGU9XCJvdXRcIiwhZS5vcHRpb25zLmRlbGF5fHwhZS5vcHRpb25zLmRlbGF5LmhpZGUpcmV0dXJuIGUuaGlkZSgpO2UudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XCJvdXRcIj09ZS5ob3ZlclN0YXRlJiZlLmhpZGUoKX0sZS5vcHRpb25zLmRlbGF5LmhpZGUpfX0sbS5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciB0PWcuRXZlbnQoXCJzaG93LmJzLlwiK3RoaXMudHlwZSk7aWYodGhpcy5oYXNDb250ZW50KCkmJnRoaXMuZW5hYmxlZCl7dGhpcy4kZWxlbWVudC50cmlnZ2VyKHQpO3ZhciBlPWcuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCx0aGlzLiRlbGVtZW50WzBdKTtpZih0LmlzRGVmYXVsdFByZXZlbnRlZCgpfHwhZSlyZXR1cm47dmFyIGk9dGhpcyxvPXRoaXMudGlwKCksbj10aGlzLmdldFVJRCh0aGlzLnR5cGUpO3RoaXMuc2V0Q29udGVudCgpLG8uYXR0cihcImlkXCIsbiksdGhpcy4kZWxlbWVudC5hdHRyKFwiYXJpYS1kZXNjcmliZWRieVwiLG4pLHRoaXMub3B0aW9ucy5hbmltYXRpb24mJm8uYWRkQ2xhc3MoXCJmYWRlXCIpO3ZhciBzPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQ/dGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsb1swXSx0aGlzLiRlbGVtZW50WzBdKTp0aGlzLm9wdGlvbnMucGxhY2VtZW50LGE9L1xccz9hdXRvP1xccz8vaSxyPWEudGVzdChzKTtyJiYocz1zLnJlcGxhY2UoYSxcIlwiKXx8XCJ0b3BcIiksby5kZXRhY2goKS5jc3Moe3RvcDowLGxlZnQ6MCxkaXNwbGF5OlwiYmxvY2tcIn0pLmFkZENsYXNzKHMpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsdGhpcyksdGhpcy5vcHRpb25zLmNvbnRhaW5lcj9vLmFwcGVuZFRvKGcoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLmNvbnRhaW5lcikpOm8uaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCksdGhpcy4kZWxlbWVudC50cmlnZ2VyKFwiaW5zZXJ0ZWQuYnMuXCIrdGhpcy50eXBlKTt2YXIgbD10aGlzLmdldFBvc2l0aW9uKCksaD1vWzBdLm9mZnNldFdpZHRoLGQ9b1swXS5vZmZzZXRIZWlnaHQ7aWYocil7dmFyIHA9cyxjPXRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpO3M9XCJib3R0b21cIj09cyYmbC5ib3R0b20rZD5jLmJvdHRvbT9cInRvcFwiOlwidG9wXCI9PXMmJmwudG9wLWQ8Yy50b3A/XCJib3R0b21cIjpcInJpZ2h0XCI9PXMmJmwucmlnaHQraD5jLndpZHRoP1wibGVmdFwiOlwibGVmdFwiPT1zJiZsLmxlZnQtaDxjLmxlZnQ/XCJyaWdodFwiOnMsby5yZW1vdmVDbGFzcyhwKS5hZGRDbGFzcyhzKX12YXIgZj10aGlzLmdldENhbGN1bGF0ZWRPZmZzZXQocyxsLGgsZCk7dGhpcy5hcHBseVBsYWNlbWVudChmLHMpO3ZhciB1PWZ1bmN0aW9uKCl7dmFyIHQ9aS5ob3ZlclN0YXRlO2kuJGVsZW1lbnQudHJpZ2dlcihcInNob3duLmJzLlwiK2kudHlwZSksaS5ob3ZlclN0YXRlPW51bGwsXCJvdXRcIj09dCYmaS5sZWF2ZShpKX07Zy5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMuJHRpcC5oYXNDbGFzcyhcImZhZGVcIik/by5vbmUoXCJic1RyYW5zaXRpb25FbmRcIix1KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChtLlRSQU5TSVRJT05fRFVSQVRJT04pOnUoKX19LG0ucHJvdG90eXBlLmFwcGx5UGxhY2VtZW50PWZ1bmN0aW9uKHQsZSl7dmFyIGk9dGhpcy50aXAoKSxvPWlbMF0ub2Zmc2V0V2lkdGgsbj1pWzBdLm9mZnNldEhlaWdodCxzPXBhcnNlSW50KGkuY3NzKFwibWFyZ2luLXRvcFwiKSwxMCksYT1wYXJzZUludChpLmNzcyhcIm1hcmdpbi1sZWZ0XCIpLDEwKTtpc05hTihzKSYmKHM9MCksaXNOYU4oYSkmJihhPTApLHQudG9wKz1zLHQubGVmdCs9YSxnLm9mZnNldC5zZXRPZmZzZXQoaVswXSxnLmV4dGVuZCh7dXNpbmc6ZnVuY3Rpb24odCl7aS5jc3Moe3RvcDpNYXRoLnJvdW5kKHQudG9wKSxsZWZ0Ok1hdGgucm91bmQodC5sZWZ0KX0pfX0sdCksMCksaS5hZGRDbGFzcyhcImluXCIpO3ZhciByPWlbMF0ub2Zmc2V0V2lkdGgsbD1pWzBdLm9mZnNldEhlaWdodDtcInRvcFwiPT1lJiZsIT1uJiYodC50b3A9dC50b3Arbi1sKTt2YXIgaD10aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShlLHQscixsKTtoLmxlZnQ/dC5sZWZ0Kz1oLmxlZnQ6dC50b3ArPWgudG9wO3ZhciBkPS90b3B8Ym90dG9tLy50ZXN0KGUpLHA9ZD8yKmgubGVmdC1vK3I6MipoLnRvcC1uK2wsYz1kP1wib2Zmc2V0V2lkdGhcIjpcIm9mZnNldEhlaWdodFwiO2kub2Zmc2V0KHQpLHRoaXMucmVwbGFjZUFycm93KHAsaVswXVtjXSxkKX0sbS5wcm90b3R5cGUucmVwbGFjZUFycm93PWZ1bmN0aW9uKHQsZSxpKXt0aGlzLmFycm93KCkuY3NzKGk/XCJsZWZ0XCI6XCJ0b3BcIiw1MCooMS10L2UpK1wiJVwiKS5jc3MoaT9cInRvcFwiOlwibGVmdFwiLFwiXCIpfSxtLnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50aXAoKSxlPXRoaXMuZ2V0VGl0bGUoKTt0aGlzLm9wdGlvbnMuaHRtbD8odGhpcy5vcHRpb25zLnNhbml0aXplJiYoZT1uKGUsdGhpcy5vcHRpb25zLndoaXRlTGlzdCx0aGlzLm9wdGlvbnMuc2FuaXRpemVGbikpLHQuZmluZChcIi50b29sdGlwLWlubmVyXCIpLmh0bWwoZSkpOnQuZmluZChcIi50b29sdGlwLWlubmVyXCIpLnRleHQoZSksdC5yZW1vdmVDbGFzcyhcImZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0XCIpfSxtLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMsaT1nKHRoaXMuJHRpcCksbz1nLkV2ZW50KFwiaGlkZS5icy5cIit0aGlzLnR5cGUpO2Z1bmN0aW9uIG4oKXtcImluXCIhPWUuaG92ZXJTdGF0ZSYmaS5kZXRhY2goKSxlLiRlbGVtZW50JiZlLiRlbGVtZW50LnJlbW92ZUF0dHIoXCJhcmlhLWRlc2NyaWJlZGJ5XCIpLnRyaWdnZXIoXCJoaWRkZW4uYnMuXCIrZS50eXBlKSx0JiZ0KCl9aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKG8pLCFvLmlzRGVmYXVsdFByZXZlbnRlZCgpKXJldHVybiBpLnJlbW92ZUNsYXNzKFwiaW5cIiksZy5zdXBwb3J0LnRyYW5zaXRpb24mJmkuaGFzQ2xhc3MoXCJmYWRlXCIpP2kub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsbikuZW11bGF0ZVRyYW5zaXRpb25FbmQobS5UUkFOU0lUSU9OX0RVUkFUSU9OKTpuKCksdGhpcy5ob3ZlclN0YXRlPW51bGwsdGhpc30sbS5wcm90b3R5cGUuZml4VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLiRlbGVtZW50Oyh0LmF0dHIoXCJ0aXRsZVwiKXx8XCJzdHJpbmdcIiE9dHlwZW9mIHQuYXR0cihcImRhdGEtb3JpZ2luYWwtdGl0bGVcIikpJiZ0LmF0dHIoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIsdC5hdHRyKFwidGl0bGVcIil8fFwiXCIpLmF0dHIoXCJ0aXRsZVwiLFwiXCIpfSxtLnByb3RvdHlwZS5oYXNDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VGl0bGUoKX0sbS5wcm90b3R5cGUuZ2V0UG9zaXRpb249ZnVuY3Rpb24odCl7dmFyIGU9KHQ9dHx8dGhpcy4kZWxlbWVudClbMF0saT1cIkJPRFlcIj09ZS50YWdOYW1lLG89ZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtudWxsPT1vLndpZHRoJiYobz1nLmV4dGVuZCh7fSxvLHt3aWR0aDpvLnJpZ2h0LW8ubGVmdCxoZWlnaHQ6by5ib3R0b20tby50b3B9KSk7dmFyIG49d2luZG93LlNWR0VsZW1lbnQmJmUgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudCxzPWk/e3RvcDowLGxlZnQ6MH06bj9udWxsOnQub2Zmc2V0KCksYT17c2Nyb2xsOmk/ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcHx8ZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A6dC5zY3JvbGxUb3AoKX0scj1pP3t3aWR0aDpnKHdpbmRvdykud2lkdGgoKSxoZWlnaHQ6Zyh3aW5kb3cpLmhlaWdodCgpfTpudWxsO3JldHVybiBnLmV4dGVuZCh7fSxvLGEscixzKX0sbS5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRlZE9mZnNldD1mdW5jdGlvbih0LGUsaSxvKXtyZXR1cm5cImJvdHRvbVwiPT10P3t0b3A6ZS50b3ArZS5oZWlnaHQsbGVmdDplLmxlZnQrZS53aWR0aC8yLWkvMn06XCJ0b3BcIj09dD97dG9wOmUudG9wLW8sbGVmdDplLmxlZnQrZS53aWR0aC8yLWkvMn06XCJsZWZ0XCI9PXQ/e3RvcDplLnRvcCtlLmhlaWdodC8yLW8vMixsZWZ0OmUubGVmdC1pfTp7dG9wOmUudG9wK2UuaGVpZ2h0LzItby8yLGxlZnQ6ZS5sZWZ0K2Uud2lkdGh9fSxtLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGE9ZnVuY3Rpb24odCxlLGksbyl7dmFyIG49e3RvcDowLGxlZnQ6MH07aWYoIXRoaXMuJHZpZXdwb3J0KXJldHVybiBuO3ZhciBzPXRoaXMub3B0aW9ucy52aWV3cG9ydCYmdGhpcy5vcHRpb25zLnZpZXdwb3J0LnBhZGRpbmd8fDAsYT10aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KTtpZigvcmlnaHR8bGVmdC8udGVzdCh0KSl7dmFyIHI9ZS50b3Atcy1hLnNjcm9sbCxsPWUudG9wK3MtYS5zY3JvbGwrbztyPGEudG9wP24udG9wPWEudG9wLXI6bD5hLnRvcCthLmhlaWdodCYmKG4udG9wPWEudG9wK2EuaGVpZ2h0LWwpfWVsc2V7dmFyIGg9ZS5sZWZ0LXMsZD1lLmxlZnQrcytpO2g8YS5sZWZ0P24ubGVmdD1hLmxlZnQtaDpkPmEucmlnaHQmJihuLmxlZnQ9YS5sZWZ0K2Eud2lkdGgtZCl9cmV0dXJuIG59LG0ucHJvdG90eXBlLmdldFRpdGxlPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy4kZWxlbWVudCxlPXRoaXMub3B0aW9ucztyZXR1cm4gdC5hdHRyKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIGUudGl0bGU/ZS50aXRsZS5jYWxsKHRbMF0pOmUudGl0bGUpfSxtLnByb3RvdHlwZS5nZXRVSUQ9ZnVuY3Rpb24odCl7Zm9yKDt0Kz1+figxZTYqTWF0aC5yYW5kb20oKSksZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodCk7KTtyZXR1cm4gdH0sbS5wcm90b3R5cGUudGlwPWZ1bmN0aW9uKCl7aWYoIXRoaXMuJHRpcCYmKHRoaXMuJHRpcD1nKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSksMSE9dGhpcy4kdGlwLmxlbmd0aCkpdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZStcIiBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IVwiKTtyZXR1cm4gdGhpcy4kdGlwfSxtLnByb3RvdHlwZS5hcnJvdz1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRhcnJvdz10aGlzLiRhcnJvd3x8dGhpcy50aXAoKS5maW5kKFwiLnRvb2x0aXAtYXJyb3dcIil9LG0ucHJvdG90eXBlLmVuYWJsZT1mdW5jdGlvbigpe3RoaXMuZW5hYmxlZD0hMH0sbS5wcm90b3R5cGUuZGlzYWJsZT1mdW5jdGlvbigpe3RoaXMuZW5hYmxlZD0hMX0sbS5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZD1mdW5jdGlvbigpe3RoaXMuZW5hYmxlZD0hdGhpcy5lbmFibGVkfSxtLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24odCl7dmFyIGU9dGhpczt0JiYoKGU9Zyh0LmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUpKXx8KGU9bmV3IHRoaXMuY29uc3RydWN0b3IodC5jdXJyZW50VGFyZ2V0LHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpLGcodC5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlLGUpKSksdD8oZS5pblN0YXRlLmNsaWNrPSFlLmluU3RhdGUuY2xpY2ssZS5pc0luU3RhdGVUcnVlKCk/ZS5lbnRlcihlKTplLmxlYXZlKGUpKTplLnRpcCgpLmhhc0NsYXNzKFwiaW5cIik/ZS5sZWF2ZShlKTplLmVudGVyKGUpfSxtLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcztjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KSx0aGlzLmhpZGUoZnVuY3Rpb24oKXt0LiRlbGVtZW50Lm9mZihcIi5cIit0LnR5cGUpLnJlbW92ZURhdGEoXCJicy5cIit0LnR5cGUpLHQuJHRpcCYmdC4kdGlwLmRldGFjaCgpLHQuJHRpcD1udWxsLHQuJGFycm93PW51bGwsdC4kdmlld3BvcnQ9bnVsbCx0LiRlbGVtZW50PW51bGx9KX0sbS5wcm90b3R5cGUuc2FuaXRpemVIdG1sPWZ1bmN0aW9uKHQpe3JldHVybiBuKHQsdGhpcy5vcHRpb25zLndoaXRlTGlzdCx0aGlzLm9wdGlvbnMuc2FuaXRpemVGbil9O3ZhciBlPWcuZm4udG9vbHRpcDtnLmZuLnRvb2x0aXA9ZnVuY3Rpb24gaShvKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9Zyh0aGlzKSxlPXQuZGF0YShcImJzLnRvb2x0aXBcIiksaT1cIm9iamVjdFwiPT10eXBlb2YgbyYmbzshZSYmL2Rlc3Ryb3l8aGlkZS8udGVzdChvKXx8KGV8fHQuZGF0YShcImJzLnRvb2x0aXBcIixlPW5ldyBtKHRoaXMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBvJiZlW29dKCkpfSl9LGcuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvcj1tLGcuZm4udG9vbHRpcC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGcuZm4udG9vbHRpcD1lLHRoaXN9fShqUXVlcnkpLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO3ZhciBzPWZ1bmN0aW9uKHQsZSl7dGhpcy5pbml0KFwicG9wb3ZlclwiLHQsZSl9O2lmKCFuLmZuLnRvb2x0aXApdGhyb3cgbmV3IEVycm9yKFwiUG9wb3ZlciByZXF1aXJlcyB0b29sdGlwLmpzXCIpO3MuVkVSU0lPTj1cIjMuNC4xXCIscy5ERUZBVUxUUz1uLmV4dGVuZCh7fSxuLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMse3BsYWNlbWVudDpcInJpZ2h0XCIsdHJpZ2dlcjpcImNsaWNrXCIsY29udGVudDpcIlwiLHRlbXBsYXRlOic8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2Pid9KSwoKHMucHJvdG90eXBlPW4uZXh0ZW5kKHt9LG4uZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpKS5jb25zdHJ1Y3Rvcj1zKS5wcm90b3R5cGUuZ2V0RGVmYXVsdHM9ZnVuY3Rpb24oKXtyZXR1cm4gcy5ERUZBVUxUU30scy5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciB0PXRoaXMudGlwKCksZT10aGlzLmdldFRpdGxlKCksaT10aGlzLmdldENvbnRlbnQoKTtpZih0aGlzLm9wdGlvbnMuaHRtbCl7dmFyIG89dHlwZW9mIGk7dGhpcy5vcHRpb25zLnNhbml0aXplJiYoZT10aGlzLnNhbml0aXplSHRtbChlKSxcInN0cmluZ1wiPT09byYmKGk9dGhpcy5zYW5pdGl6ZUh0bWwoaSkpKSx0LmZpbmQoXCIucG9wb3Zlci10aXRsZVwiKS5odG1sKGUpLHQuZmluZChcIi5wb3BvdmVyLWNvbnRlbnRcIikuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKVtcInN0cmluZ1wiPT09bz9cImh0bWxcIjpcImFwcGVuZFwiXShpKX1lbHNlIHQuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpLnRleHQoZSksdC5maW5kKFwiLnBvcG92ZXItY29udGVudFwiKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpLnRleHQoaSk7dC5yZW1vdmVDbGFzcyhcImZhZGUgdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0IGluXCIpLHQuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpLmh0bWwoKXx8dC5maW5kKFwiLnBvcG92ZXItdGl0bGVcIikuaGlkZSgpfSxzLnByb3RvdHlwZS5oYXNDb250ZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0VGl0bGUoKXx8dGhpcy5nZXRDb250ZW50KCl9LHMucHJvdG90eXBlLmdldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLiRlbGVtZW50LGU9dGhpcy5vcHRpb25zO3JldHVybiB0LmF0dHIoXCJkYXRhLWNvbnRlbnRcIil8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLmNvbnRlbnQ/ZS5jb250ZW50LmNhbGwodFswXSk6ZS5jb250ZW50KX0scy5wcm90b3R5cGUuYXJyb3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kYXJyb3c9dGhpcy4kYXJyb3d8fHRoaXMudGlwKCkuZmluZChcIi5hcnJvd1wiKX07dmFyIHQ9bi5mbi5wb3BvdmVyO24uZm4ucG9wb3Zlcj1mdW5jdGlvbiBlKG8pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1uKHRoaXMpLGU9dC5kYXRhKFwiYnMucG9wb3ZlclwiKSxpPVwib2JqZWN0XCI9PXR5cGVvZiBvJiZvOyFlJiYvZGVzdHJveXxoaWRlLy50ZXN0KG8pfHwoZXx8dC5kYXRhKFwiYnMucG9wb3ZlclwiLGU9bmV3IHModGhpcyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG8mJmVbb10oKSl9KX0sbi5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yPXMsbi5mbi5wb3BvdmVyLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gbi5mbi5wb3BvdmVyPXQsdGhpc319KGpRdWVyeSksZnVuY3Rpb24ocyl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe3RoaXMuJGJvZHk9cyhkb2N1bWVudC5ib2R5KSx0aGlzLiRzY3JvbGxFbGVtZW50PXModCkuaXMoZG9jdW1lbnQuYm9keSk/cyh3aW5kb3cpOnModCksdGhpcy5vcHRpb25zPXMuZXh0ZW5kKHt9LG4uREVGQVVMVFMsZSksdGhpcy5zZWxlY3Rvcj0odGhpcy5vcHRpb25zLnRhcmdldHx8XCJcIikrXCIgLm5hdiBsaSA+IGFcIix0aGlzLm9mZnNldHM9W10sdGhpcy50YXJnZXRzPVtdLHRoaXMuYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5zY3JvbGxIZWlnaHQ9MCx0aGlzLiRzY3JvbGxFbGVtZW50Lm9uKFwic2Nyb2xsLmJzLnNjcm9sbHNweVwiLHMucHJveHkodGhpcy5wcm9jZXNzLHRoaXMpKSx0aGlzLnJlZnJlc2goKSx0aGlzLnByb2Nlc3MoKX1mdW5jdGlvbiBlKG8pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1zKHRoaXMpLGU9dC5kYXRhKFwiYnMuc2Nyb2xsc3B5XCIpLGk9XCJvYmplY3RcIj09dHlwZW9mIG8mJm87ZXx8dC5kYXRhKFwiYnMuc2Nyb2xsc3B5XCIsZT1uZXcgbih0aGlzLGkpKSxcInN0cmluZ1wiPT10eXBlb2YgbyYmZVtvXSgpfSl9bi5WRVJTSU9OPVwiMy40LjFcIixuLkRFRkFVTFRTPXtvZmZzZXQ6MTB9LG4ucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodD1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRzY3JvbGxFbGVtZW50WzBdLnNjcm9sbEhlaWdodHx8TWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCl9LG4ucHJvdG90eXBlLnJlZnJlc2g9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLG89XCJvZmZzZXRcIixuPTA7dGhpcy5vZmZzZXRzPVtdLHRoaXMudGFyZ2V0cz1bXSx0aGlzLnNjcm9sbEhlaWdodD10aGlzLmdldFNjcm9sbEhlaWdodCgpLHMuaXNXaW5kb3codGhpcy4kc2Nyb2xsRWxlbWVudFswXSl8fChvPVwicG9zaXRpb25cIixuPXRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkpLHRoaXMuJGJvZHkuZmluZCh0aGlzLnNlbGVjdG9yKS5tYXAoZnVuY3Rpb24oKXt2YXIgdD1zKHRoaXMpLGU9dC5kYXRhKFwidGFyZ2V0XCIpfHx0LmF0dHIoXCJocmVmXCIpLGk9L14jLi8udGVzdChlKSYmcyhlKTtyZXR1cm4gaSYmaS5sZW5ndGgmJmkuaXMoXCI6dmlzaWJsZVwiKSYmW1tpW29dKCkudG9wK24sZV1dfHxudWxsfSkuc29ydChmdW5jdGlvbih0LGUpe3JldHVybiB0WzBdLWVbMF19KS5lYWNoKGZ1bmN0aW9uKCl7dC5vZmZzZXRzLnB1c2godGhpc1swXSksdC50YXJnZXRzLnB1c2godGhpc1sxXSl9KX0sbi5wcm90b3R5cGUucHJvY2Vzcz1mdW5jdGlvbigpe3ZhciB0LGU9dGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSt0aGlzLm9wdGlvbnMub2Zmc2V0LGk9dGhpcy5nZXRTY3JvbGxIZWlnaHQoKSxvPXRoaXMub3B0aW9ucy5vZmZzZXQraS10aGlzLiRzY3JvbGxFbGVtZW50LmhlaWdodCgpLG49dGhpcy5vZmZzZXRzLHM9dGhpcy50YXJnZXRzLGE9dGhpcy5hY3RpdmVUYXJnZXQ7aWYodGhpcy5zY3JvbGxIZWlnaHQhPWkmJnRoaXMucmVmcmVzaCgpLG88PWUpcmV0dXJuIGEhPSh0PXNbcy5sZW5ndGgtMV0pJiZ0aGlzLmFjdGl2YXRlKHQpO2lmKGEmJmU8blswXSlyZXR1cm4gdGhpcy5hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLmNsZWFyKCk7Zm9yKHQ9bi5sZW5ndGg7dC0tOylhIT1zW3RdJiZlPj1uW3RdJiYoblt0KzFdPT09dW5kZWZpbmVkfHxlPG5bdCsxXSkmJnRoaXMuYWN0aXZhdGUoc1t0XSl9LG4ucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKHQpe3RoaXMuYWN0aXZlVGFyZ2V0PXQsdGhpcy5jbGVhcigpO3ZhciBlPXRoaXMuc2VsZWN0b3IrJ1tkYXRhLXRhcmdldD1cIicrdCsnXCJdLCcrdGhpcy5zZWxlY3RvcisnW2hyZWY9XCInK3QrJ1wiXScsaT1zKGUpLnBhcmVudHMoXCJsaVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtpLnBhcmVudChcIi5kcm9wZG93bi1tZW51XCIpLmxlbmd0aCYmKGk9aS5jbG9zZXN0KFwibGkuZHJvcGRvd25cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIikpLGkudHJpZ2dlcihcImFjdGl2YXRlLmJzLnNjcm9sbHNweVwiKX0sbi5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXtzKHRoaXMuc2VsZWN0b3IpLnBhcmVudHNVbnRpbCh0aGlzLm9wdGlvbnMudGFyZ2V0LFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKX07dmFyIHQ9cy5mbi5zY3JvbGxzcHk7cy5mbi5zY3JvbGxzcHk9ZSxzLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3Rvcj1uLHMuZm4uc2Nyb2xsc3B5Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gcy5mbi5zY3JvbGxzcHk9dCx0aGlzfSxzKHdpbmRvdykub24oXCJsb2FkLmJzLnNjcm9sbHNweS5kYXRhLWFwaVwiLGZ1bmN0aW9uKCl7cygnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbigpe3ZhciB0PXModGhpcyk7ZS5jYWxsKHQsdC5kYXRhKCkpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihyKXtcInVzZSBzdHJpY3RcIjt2YXIgYT1mdW5jdGlvbih0KXt0aGlzLmVsZW1lbnQ9cih0KX07ZnVuY3Rpb24gZShpKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cih0aGlzKSxlPXQuZGF0YShcImJzLnRhYlwiKTtlfHx0LmRhdGEoXCJicy50YWJcIixlPW5ldyBhKHRoaXMpKSxcInN0cmluZ1wiPT10eXBlb2YgaSYmZVtpXSgpfSl9YS5WRVJTSU9OPVwiMy40LjFcIixhLlRSQU5TSVRJT05fRFVSQVRJT049MTUwLGEucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLmVsZW1lbnQsZT10LmNsb3Nlc3QoXCJ1bDpub3QoLmRyb3Bkb3duLW1lbnUpXCIpLGk9dC5kYXRhKFwidGFyZ2V0XCIpO2lmKGl8fChpPShpPXQuYXR0cihcImhyZWZcIikpJiZpLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sXCJcIikpLCF0LnBhcmVudChcImxpXCIpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXt2YXIgbz1lLmZpbmQoXCIuYWN0aXZlOmxhc3QgYVwiKSxuPXIuRXZlbnQoXCJoaWRlLmJzLnRhYlwiLHtyZWxhdGVkVGFyZ2V0OnRbMF19KSxzPXIuRXZlbnQoXCJzaG93LmJzLnRhYlwiLHtyZWxhdGVkVGFyZ2V0Om9bMF19KTtpZihvLnRyaWdnZXIobiksdC50cmlnZ2VyKHMpLCFzLmlzRGVmYXVsdFByZXZlbnRlZCgpJiYhbi5pc0RlZmF1bHRQcmV2ZW50ZWQoKSl7dmFyIGE9cihkb2N1bWVudCkuZmluZChpKTt0aGlzLmFjdGl2YXRlKHQuY2xvc2VzdChcImxpXCIpLGUpLHRoaXMuYWN0aXZhdGUoYSxhLnBhcmVudCgpLGZ1bmN0aW9uKCl7by50cmlnZ2VyKHt0eXBlOlwiaGlkZGVuLmJzLnRhYlwiLHJlbGF0ZWRUYXJnZXQ6dFswXX0pLHQudHJpZ2dlcih7dHlwZTpcInNob3duLmJzLnRhYlwiLHJlbGF0ZWRUYXJnZXQ6b1swXX0pfSl9fX0sYS5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24odCxlLGkpe3ZhciBvPWUuZmluZChcIj4gLmFjdGl2ZVwiKSxuPWkmJnIuc3VwcG9ydC50cmFuc2l0aW9uJiYoby5sZW5ndGgmJm8uaGFzQ2xhc3MoXCJmYWRlXCIpfHwhIWUuZmluZChcIj4gLmZhZGVcIikubGVuZ3RoKTtmdW5jdGlvbiBzKCl7by5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5maW5kKFwiPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuZW5kKCkuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMSksdC5hZGRDbGFzcyhcImFjdGl2ZVwiKS5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSxuPyh0WzBdLm9mZnNldFdpZHRoLHQuYWRkQ2xhc3MoXCJpblwiKSk6dC5yZW1vdmVDbGFzcyhcImZhZGVcIiksdC5wYXJlbnQoXCIuZHJvcGRvd24tbWVudVwiKS5sZW5ndGgmJnQuY2xvc2VzdChcImxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpLmVuZCgpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLGkmJmkoKX1vLmxlbmd0aCYmbj9vLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLHMpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGEuVFJBTlNJVElPTl9EVVJBVElPTik6cygpLG8ucmVtb3ZlQ2xhc3MoXCJpblwiKX07dmFyIHQ9ci5mbi50YWI7ci5mbi50YWI9ZSxyLmZuLnRhYi5Db25zdHJ1Y3Rvcj1hLHIuZm4udGFiLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gci5mbi50YWI9dCx0aGlzfTt2YXIgaT1mdW5jdGlvbih0KXt0LnByZXZlbnREZWZhdWx0KCksZS5jYWxsKHIodGhpcyksXCJzaG93XCIpfTtyKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLnRhYi5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLGkpLm9uKFwiY2xpY2suYnMudGFiLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLGkpfShqUXVlcnkpLGZ1bmN0aW9uKGwpe1widXNlIHN0cmljdFwiO3ZhciBoPWZ1bmN0aW9uKHQsZSl7dGhpcy5vcHRpb25zPWwuZXh0ZW5kKHt9LGguREVGQVVMVFMsZSk7dmFyIGk9dGhpcy5vcHRpb25zLnRhcmdldD09PWguREVGQVVMVFMudGFyZ2V0P2wodGhpcy5vcHRpb25zLnRhcmdldCk6bChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMudGFyZ2V0KTt0aGlzLiR0YXJnZXQ9aS5vbihcInNjcm9sbC5icy5hZmZpeC5kYXRhLWFwaVwiLGwucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLHRoaXMpKS5vbihcImNsaWNrLmJzLmFmZml4LmRhdGEtYXBpXCIsbC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLHRoaXMpKSx0aGlzLiRlbGVtZW50PWwodCksdGhpcy5hZmZpeGVkPW51bGwsdGhpcy51bnBpbj1udWxsLHRoaXMucGlubmVkT2Zmc2V0PW51bGwsdGhpcy5jaGVja1Bvc2l0aW9uKCl9O2Z1bmN0aW9uIGkobyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PWwodGhpcyksZT10LmRhdGEoXCJicy5hZmZpeFwiKSxpPVwib2JqZWN0XCI9PXR5cGVvZiBvJiZvO2V8fHQuZGF0YShcImJzLmFmZml4XCIsZT1uZXcgaCh0aGlzLGkpKSxcInN0cmluZ1wiPT10eXBlb2YgbyYmZVtvXSgpfSl9aC5WRVJTSU9OPVwiMy40LjFcIixoLlJFU0VUPVwiYWZmaXggYWZmaXgtdG9wIGFmZml4LWJvdHRvbVwiLGguREVGQVVMVFM9e29mZnNldDowLHRhcmdldDp3aW5kb3d9LGgucHJvdG90eXBlLmdldFN0YXRlPWZ1bmN0aW9uKHQsZSxpLG8pe3ZhciBuPXRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKSxzPXRoaXMuJGVsZW1lbnQub2Zmc2V0KCksYT10aGlzLiR0YXJnZXQuaGVpZ2h0KCk7aWYobnVsbCE9aSYmXCJ0b3BcIj09dGhpcy5hZmZpeGVkKXJldHVybiBuPGkmJlwidG9wXCI7aWYoXCJib3R0b21cIj09dGhpcy5hZmZpeGVkKXJldHVybiBudWxsIT1pPyEobit0aGlzLnVucGluPD1zLnRvcCkmJlwiYm90dG9tXCI6IShuK2E8PXQtbykmJlwiYm90dG9tXCI7dmFyIHI9bnVsbD09dGhpcy5hZmZpeGVkLGw9cj9uOnMudG9wO3JldHVybiBudWxsIT1pJiZuPD1pP1widG9wXCI6bnVsbCE9byYmdC1vPD1sKyhyP2E6ZSkmJlwiYm90dG9tXCJ9LGgucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldD1mdW5jdGlvbigpe2lmKHRoaXMucGlubmVkT2Zmc2V0KXJldHVybiB0aGlzLnBpbm5lZE9mZnNldDt0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKGguUkVTRVQpLmFkZENsYXNzKFwiYWZmaXhcIik7dmFyIHQ9dGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpLGU9dGhpcy4kZWxlbWVudC5vZmZzZXQoKTtyZXR1cm4gdGhpcy5waW5uZWRPZmZzZXQ9ZS50b3AtdH0saC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3A9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KGwucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLHRoaXMpLDEpfSxoLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uPWZ1bmN0aW9uKCl7aWYodGhpcy4kZWxlbWVudC5pcyhcIjp2aXNpYmxlXCIpKXt2YXIgdD10aGlzLiRlbGVtZW50LmhlaWdodCgpLGU9dGhpcy5vcHRpb25zLm9mZnNldCxpPWUudG9wLG89ZS5ib3R0b20sbj1NYXRoLm1heChsKGRvY3VtZW50KS5oZWlnaHQoKSxsKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKTtcIm9iamVjdFwiIT10eXBlb2YgZSYmKG89aT1lKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBpJiYoaT1lLnRvcCh0aGlzLiRlbGVtZW50KSksXCJmdW5jdGlvblwiPT10eXBlb2YgbyYmKG89ZS5ib3R0b20odGhpcy4kZWxlbWVudCkpO3ZhciBzPXRoaXMuZ2V0U3RhdGUobix0LGksbyk7aWYodGhpcy5hZmZpeGVkIT1zKXtudWxsIT10aGlzLnVucGluJiZ0aGlzLiRlbGVtZW50LmNzcyhcInRvcFwiLFwiXCIpO3ZhciBhPVwiYWZmaXhcIisocz9cIi1cIitzOlwiXCIpLHI9bC5FdmVudChhK1wiLmJzLmFmZml4XCIpO2lmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihyKSxyLmlzRGVmYXVsdFByZXZlbnRlZCgpKXJldHVybjt0aGlzLmFmZml4ZWQ9cyx0aGlzLnVucGluPVwiYm90dG9tXCI9PXM/dGhpcy5nZXRQaW5uZWRPZmZzZXQoKTpudWxsLHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoaC5SRVNFVCkuYWRkQ2xhc3MoYSkudHJpZ2dlcihhLnJlcGxhY2UoXCJhZmZpeFwiLFwiYWZmaXhlZFwiKStcIi5icy5hZmZpeFwiKX1cImJvdHRvbVwiPT1zJiZ0aGlzLiRlbGVtZW50Lm9mZnNldCh7dG9wOm4tdC1vfSl9fTt2YXIgdD1sLmZuLmFmZml4O2wuZm4uYWZmaXg9aSxsLmZuLmFmZml4LkNvbnN0cnVjdG9yPWgsbC5mbi5hZmZpeC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGwuZm4uYWZmaXg9dCx0aGlzfSxsKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXtsKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1sKHRoaXMpLGU9dC5kYXRhKCk7ZS5vZmZzZXQ9ZS5vZmZzZXR8fHt9LG51bGwhPWUub2Zmc2V0Qm90dG9tJiYoZS5vZmZzZXQuYm90dG9tPWUub2Zmc2V0Qm90dG9tKSxudWxsIT1lLm9mZnNldFRvcCYmKGUub2Zmc2V0LnRvcD1lLm9mZnNldFRvcCksaS5jYWxsKHQsZSl9KX0pfShqUXVlcnkpOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qISBBZG1pbkxURSBhcHAuanNcbiogPT09PT09PT09PT09PT09PVxuKiBNYWluIEpTIGFwcGxpY2F0aW9uIGZpbGUgZm9yIEFkbWluTFRFIHYyLiBUaGlzIGZpbGVcbiogc2hvdWxkIGJlIGluY2x1ZGVkIGluIGFsbCBwYWdlcy4gSXQgY29udHJvbHMgc29tZSBsYXlvdXRcbiogb3B0aW9ucyBhbmQgaW1wbGVtZW50cyBleGNsdXNpdmUgQWRtaW5MVEUgcGx1Z2lucy5cbipcbiogQEF1dGhvciAgQWxtc2FlZWQgU3R1ZGlvXG4qIEBTdXBwb3J0IDxodHRwczovL3d3dy5hbG1zYWVlZHN0dWRpby5jb20+XG4qIEBFbWFpbCAgIDxhYmR1bGxhaEBhbG1zYWVlZHN0dWRpby5jb20+XG4qIEB2ZXJzaW9uIDIuNC44XG4qIEByZXBvc2l0b3J5IGdpdDovL2dpdGh1Yi5jb20vYWxtYXNhZWVkMjAxMC9BZG1pbkxURS5naXRcbiogQGxpY2Vuc2UgTUlUIDxodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUPlxuKi9cbmlmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBqUXVlcnkpdGhyb3cgbmV3IEVycm9yKFwiQWRtaW5MVEUgcmVxdWlyZXMgalF1ZXJ5XCIpOytmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGc9ZS5kYXRhKGMpO2lmKCFnKXt2YXIgaD1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxnPW5ldyBmKGUsaCkpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBnKXtpZih2b2lkIDA9PT1nW2JdKXRocm93IG5ldyBFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcIitiKTtnW2JdKCl9fSl9dmFyIGM9XCJsdGUuYm94cmVmcmVzaFwiLGQ9e3NvdXJjZTpcIlwiLHBhcmFtczp7fSx0cmlnZ2VyOlwiLnJlZnJlc2gtYnRuXCIsY29udGVudDpcIi5ib3gtYm9keVwiLGxvYWRJbkNvbnRlbnQ6ITAscmVzcG9uc2VUeXBlOlwiXCIsb3ZlcmxheVRlbXBsYXRlOic8ZGl2IGNsYXNzPVwib3ZlcmxheVwiPjxkaXYgY2xhc3M9XCJmYSBmYS1yZWZyZXNoIGZhLXNwaW5cIj48L2Rpdj48L2Rpdj4nLG9uTG9hZFN0YXJ0OmZ1bmN0aW9uKCl7fSxvbkxvYWREb25lOmZ1bmN0aW9uKGEpe3JldHVybiBhfX0sZT17ZGF0YTonW2RhdGEtd2lkZ2V0PVwiYm94LXJlZnJlc2hcIl0nfSxmPWZ1bmN0aW9uKGIsYyl7aWYodGhpcy5lbGVtZW50PWIsdGhpcy5vcHRpb25zPWMsdGhpcy4kb3ZlcmxheT1hKGMub3ZlcmxheVRlbXBsYXRlKSxcIlwiPT09Yy5zb3VyY2UpdGhyb3cgbmV3IEVycm9yKFwiU291cmNlIHVybCB3YXMgbm90IGRlZmluZWQuIFBsZWFzZSBzcGVjaWZ5IGEgdXJsIGluIHlvdXIgQm94UmVmcmVzaCBzb3VyY2Ugb3B0aW9uLlwiKTt0aGlzLl9zZXRVcExpc3RlbmVycygpLHRoaXMubG9hZCgpfTtmLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKCl7dGhpcy5fYWRkT3ZlcmxheSgpLHRoaXMub3B0aW9ucy5vbkxvYWRTdGFydC5jYWxsKGEodGhpcykpLGEuZ2V0KHRoaXMub3B0aW9ucy5zb3VyY2UsdGhpcy5vcHRpb25zLnBhcmFtcyxmdW5jdGlvbihiKXt0aGlzLm9wdGlvbnMubG9hZEluQ29udGVudCYmYSh0aGlzLmVsZW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLmNvbnRlbnQpLmh0bWwoYiksdGhpcy5vcHRpb25zLm9uTG9hZERvbmUuY2FsbChhKHRoaXMpLGIpLHRoaXMuX3JlbW92ZU92ZXJsYXkoKX0uYmluZCh0aGlzKSxcIlwiIT09dGhpcy5vcHRpb25zLnJlc3BvbnNlVHlwZSYmdGhpcy5vcHRpb25zLnJlc3BvbnNlVHlwZSl9LGYucHJvdG90eXBlLl9zZXRVcExpc3RlbmVycz1mdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS5vbihcImNsaWNrXCIsdGhpcy5vcHRpb25zLnRyaWdnZXIsZnVuY3Rpb24oYSl7YSYmYS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMubG9hZCgpfS5iaW5kKHRoaXMpKX0sZi5wcm90b3R5cGUuX2FkZE92ZXJsYXk9ZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuJG92ZXJsYXkpfSxmLnByb3RvdHlwZS5fcmVtb3ZlT3ZlcmxheT1mdW5jdGlvbigpe2EodGhpcy4kb3ZlcmxheSkucmVtb3ZlKCl9O3ZhciBnPWEuZm4uYm94UmVmcmVzaDthLmZuLmJveFJlZnJlc2g9YixhLmZuLmJveFJlZnJlc2guQ29uc3RydWN0b3I9ZixhLmZuLmJveFJlZnJlc2gubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmJveFJlZnJlc2g9Zyx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKGUuZGF0YSkuZWFjaChmdW5jdGlvbigpe2IuY2FsbChhKHRoaXMpKX0pfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGc9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgaChlLGcpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgYil7aWYodm9pZCAwPT09ZltiXSl0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXCIrYik7ZltiXSgpfX0pfXZhciBjPVwibHRlLmJveHdpZGdldFwiLGQ9e2FuaW1hdGlvblNwZWVkOjUwMCxjb2xsYXBzZVRyaWdnZXI6J1tkYXRhLXdpZGdldD1cImNvbGxhcHNlXCJdJyxyZW1vdmVUcmlnZ2VyOidbZGF0YS13aWRnZXQ9XCJyZW1vdmVcIl0nLGNvbGxhcHNlSWNvbjpcImZhLW1pbnVzXCIsZXhwYW5kSWNvbjpcImZhLXBsdXNcIixyZW1vdmVJY29uOlwiZmEtdGltZXNcIn0sZT17ZGF0YTpcIi5ib3hcIixjb2xsYXBzZWQ6XCIuY29sbGFwc2VkLWJveFwiLGhlYWRlcjpcIi5ib3gtaGVhZGVyXCIsYm9keTpcIi5ib3gtYm9keVwiLGZvb3RlcjpcIi5ib3gtZm9vdGVyXCIsdG9vbHM6XCIuYm94LXRvb2xzXCJ9LGY9e2NvbGxhcHNlZDpcImNvbGxhcHNlZC1ib3hcIn0sZz17Y29sbGFwc2luZzpcImNvbGxhcHNpbmcuYm94d2lkZ2V0XCIsY29sbGFwc2VkOlwiY29sbGFwc2VkLmJveHdpZGdldFwiLGV4cGFuZGluZzpcImV4cGFuZGluZy5ib3h3aWRnZXRcIixleHBhbmRlZDpcImV4cGFuZGVkLmJveHdpZGdldFwiLHJlbW92aW5nOlwicmVtb3ZpbmcuYm94d2lkZ2V0XCIscmVtb3ZlZDpcInJlbW92ZWQuYm94d2lkZ2V0XCJ9LGg9ZnVuY3Rpb24oYSxiKXt0aGlzLmVsZW1lbnQ9YSx0aGlzLm9wdGlvbnM9Yix0aGlzLl9zZXRVcExpc3RlbmVycygpfTtoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkuaXMoZS5jb2xsYXBzZWQpP3RoaXMuZXhwYW5kKCk6dGhpcy5jb2xsYXBzZSgpfSxoLnByb3RvdHlwZS5leHBhbmQ9ZnVuY3Rpb24oKXt2YXIgYj1hLkV2ZW50KGcuZXhwYW5kZWQpLGM9YS5FdmVudChnLmV4cGFuZGluZyksZD10aGlzLm9wdGlvbnMuY29sbGFwc2VJY29uLGg9dGhpcy5vcHRpb25zLmV4cGFuZEljb247YSh0aGlzLmVsZW1lbnQpLnJlbW92ZUNsYXNzKGYuY29sbGFwc2VkKSxhKHRoaXMuZWxlbWVudCkuY2hpbGRyZW4oZS5oZWFkZXIrXCIsIFwiK2UuYm9keStcIiwgXCIrZS5mb290ZXIpLmNoaWxkcmVuKGUudG9vbHMpLmZpbmQoXCIuXCIraCkucmVtb3ZlQ2xhc3MoaCkuYWRkQ2xhc3MoZCksYSh0aGlzLmVsZW1lbnQpLmNoaWxkcmVuKGUuYm9keStcIiwgXCIrZS5mb290ZXIpLnNsaWRlRG93bih0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkudHJpZ2dlcihiKX0uYmluZCh0aGlzKSkudHJpZ2dlcihjKX0saC5wcm90b3R5cGUuY29sbGFwc2U9ZnVuY3Rpb24oKXt2YXIgYj1hLkV2ZW50KGcuY29sbGFwc2VkKSxjPShhLkV2ZW50KGcuY29sbGFwc2luZyksdGhpcy5vcHRpb25zLmNvbGxhcHNlSWNvbiksZD10aGlzLm9wdGlvbnMuZXhwYW5kSWNvbjthKHRoaXMuZWxlbWVudCkuY2hpbGRyZW4oZS5oZWFkZXIrXCIsIFwiK2UuYm9keStcIiwgXCIrZS5mb290ZXIpLmNoaWxkcmVuKGUudG9vbHMpLmZpbmQoXCIuXCIrYykucmVtb3ZlQ2xhc3MoYykuYWRkQ2xhc3MoZCksYSh0aGlzLmVsZW1lbnQpLmNoaWxkcmVuKGUuYm9keStcIiwgXCIrZS5mb290ZXIpLnNsaWRlVXAodGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmFkZENsYXNzKGYuY29sbGFwc2VkKSxhKHRoaXMuZWxlbWVudCkudHJpZ2dlcihiKX0uYmluZCh0aGlzKSkudHJpZ2dlcihleHBhbmRpbmdFdmVudCl9LGgucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbigpe3ZhciBiPWEuRXZlbnQoZy5yZW1vdmVkKSxjPWEuRXZlbnQoZy5yZW1vdmluZyk7YSh0aGlzLmVsZW1lbnQpLnNsaWRlVXAodGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoYiksYSh0aGlzLmVsZW1lbnQpLnJlbW92ZSgpfS5iaW5kKHRoaXMpKS50cmlnZ2VyKGMpfSxoLnByb3RvdHlwZS5fc2V0VXBMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2EodGhpcy5lbGVtZW50KS5vbihcImNsaWNrXCIsdGhpcy5vcHRpb25zLmNvbGxhcHNlVHJpZ2dlcixmdW5jdGlvbihjKXtyZXR1cm4gYyYmYy5wcmV2ZW50RGVmYXVsdCgpLGIudG9nZ2xlKGEodGhpcykpLCExfSksYSh0aGlzLmVsZW1lbnQpLm9uKFwiY2xpY2tcIix0aGlzLm9wdGlvbnMucmVtb3ZlVHJpZ2dlcixmdW5jdGlvbihjKXtyZXR1cm4gYyYmYy5wcmV2ZW50RGVmYXVsdCgpLGIucmVtb3ZlKGEodGhpcykpLCExfSl9O3ZhciBpPWEuZm4uYm94V2lkZ2V0O2EuZm4uYm94V2lkZ2V0PWIsYS5mbi5ib3hXaWRnZXQuQ29uc3RydWN0b3I9aCxhLmZuLmJveFdpZGdldC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uYm94V2lkZ2V0PWksdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7YShlLmRhdGEpLmVhY2goZnVuY3Rpb24oKXtiLmNhbGwoYSh0aGlzKSl9KX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBnPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGgoZSxnKSl9XCJzdHJpbmdcIj09dHlwZW9mIGImJmYudG9nZ2xlKCl9KX12YXIgYz1cImx0ZS5jb250cm9sc2lkZWJhclwiLGQ9e3NsaWRlOiEwfSxlPXtzaWRlYmFyOlwiLmNvbnRyb2wtc2lkZWJhclwiLGRhdGE6J1tkYXRhLXRvZ2dsZT1cImNvbnRyb2wtc2lkZWJhclwiXScsb3BlbjpcIi5jb250cm9sLXNpZGViYXItb3BlblwiLGJnOlwiLmNvbnRyb2wtc2lkZWJhci1iZ1wiLHdyYXBwZXI6XCIud3JhcHBlclwiLGNvbnRlbnQ6XCIuY29udGVudC13cmFwcGVyXCIsYm94ZWQ6XCIubGF5b3V0LWJveGVkXCJ9LGY9e29wZW46XCJjb250cm9sLXNpZGViYXItb3BlblwiLGZpeGVkOlwiZml4ZWRcIn0sZz17Y29sbGFwc2VkOlwiY29sbGFwc2VkLmNvbnRyb2xzaWRlYmFyXCIsZXhwYW5kZWQ6XCJleHBhbmRlZC5jb250cm9sc2lkZWJhclwifSxoPWZ1bmN0aW9uKGEsYil7dGhpcy5lbGVtZW50PWEsdGhpcy5vcHRpb25zPWIsdGhpcy5oYXNCaW5kZWRSZXNpemU9ITEsdGhpcy5pbml0KCl9O2gucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkuaXMoZS5kYXRhKXx8YSh0aGlzKS5vbihcImNsaWNrXCIsdGhpcy50b2dnbGUpLHRoaXMuZml4KCksYSh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe3RoaXMuZml4KCl9LmJpbmQodGhpcykpfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYil7YiYmYi5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuZml4KCksYShlLnNpZGViYXIpLmlzKGUub3Blbil8fGEoXCJib2R5XCIpLmlzKGUub3Blbik/dGhpcy5jb2xsYXBzZSgpOnRoaXMuZXhwYW5kKCl9LGgucHJvdG90eXBlLmV4cGFuZD1mdW5jdGlvbigpe3RoaXMub3B0aW9ucy5zbGlkZT9hKGUuc2lkZWJhcikuYWRkQ2xhc3MoZi5vcGVuKTphKFwiYm9keVwiKS5hZGRDbGFzcyhmLm9wZW4pLGEodGhpcy5lbGVtZW50KS50cmlnZ2VyKGEuRXZlbnQoZy5leHBhbmRlZCkpfSxoLnByb3RvdHlwZS5jb2xsYXBzZT1mdW5jdGlvbigpe2EoXCJib2R5LCBcIitlLnNpZGViYXIpLnJlbW92ZUNsYXNzKGYub3BlbiksYSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoYS5FdmVudChnLmNvbGxhcHNlZCkpfSxoLnByb3RvdHlwZS5maXg9ZnVuY3Rpb24oKXthKFwiYm9keVwiKS5pcyhlLmJveGVkKSYmdGhpcy5fZml4Rm9yQm94ZWQoYShlLmJnKSl9LGgucHJvdG90eXBlLl9maXhGb3JCb3hlZD1mdW5jdGlvbihiKXtiLmNzcyh7cG9zaXRpb246XCJhYnNvbHV0ZVwiLGhlaWdodDphKGUud3JhcHBlcikuaGVpZ2h0KCl9KX07dmFyIGk9YS5mbi5jb250cm9sU2lkZWJhcjthLmZuLmNvbnRyb2xTaWRlYmFyPWIsYS5mbi5jb250cm9sU2lkZWJhci5Db25zdHJ1Y3Rvcj1oLGEuZm4uY29udHJvbFNpZGViYXIubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmNvbnRyb2xTaWRlYmFyPWksdGhpc30sYShkb2N1bWVudCkub24oXCJjbGlja1wiLGUuZGF0YSxmdW5jdGlvbihjKXtjJiZjLnByZXZlbnREZWZhdWx0KCksYi5jYWxsKGEodGhpcyksXCJ0b2dnbGVcIil9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZD1hKHRoaXMpLGU9ZC5kYXRhKGMpO2V8fGQuZGF0YShjLGU9bmV3IGYoZCkpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZlLnRvZ2dsZShkKX0pfXZhciBjPVwibHRlLmRpcmVjdGNoYXRcIixkPXtkYXRhOidbZGF0YS13aWRnZXQ9XCJjaGF0LXBhbmUtdG9nZ2xlXCJdJyxib3g6XCIuZGlyZWN0LWNoYXRcIn0sZT17b3BlbjpcImRpcmVjdC1jaGF0LWNvbnRhY3RzLW9wZW5cIn0sZj1mdW5jdGlvbihhKXt0aGlzLmVsZW1lbnQ9YX07Zi5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGEpe2EucGFyZW50cyhkLmJveCkuZmlyc3QoKS50b2dnbGVDbGFzcyhlLm9wZW4pfTt2YXIgZz1hLmZuLmRpcmVjdENoYXQ7YS5mbi5kaXJlY3RDaGF0PWIsYS5mbi5kaXJlY3RDaGF0LkNvbnN0cnVjdG9yPWYsYS5mbi5kaXJlY3RDaGF0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5kaXJlY3RDaGF0PWcsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGlja1wiLGQuZGF0YSxmdW5jdGlvbihjKXtjJiZjLnByZXZlbnREZWZhdWx0KCksYi5jYWxsKGEodGhpcyksXCJ0b2dnbGVcIil9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKGMpO2lmKCFmKXt2YXIgaD1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxmPW5ldyBnKGgpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgYil7aWYodm9pZCAwPT09ZltiXSl0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXCIrYik7ZltiXSgpfX0pfXZhciBjPVwibHRlLmxheW91dFwiLGQ9e3NsaW1zY3JvbGw6ITAscmVzZXRIZWlnaHQ6ITB9LGU9e3dyYXBwZXI6XCIud3JhcHBlclwiLGNvbnRlbnRXcmFwcGVyOlwiLmNvbnRlbnQtd3JhcHBlclwiLGxheW91dEJveGVkOlwiLmxheW91dC1ib3hlZFwiLG1haW5Gb290ZXI6XCIubWFpbi1mb290ZXJcIixtYWluSGVhZGVyOlwiLm1haW4taGVhZGVyXCIsc2lkZWJhcjpcIi5zaWRlYmFyXCIsY29udHJvbFNpZGViYXI6XCIuY29udHJvbC1zaWRlYmFyXCIsZml4ZWQ6XCIuZml4ZWRcIixzaWRlYmFyTWVudTpcIi5zaWRlYmFyLW1lbnVcIixsb2dvOlwiLm1haW4taGVhZGVyIC5sb2dvXCJ9LGY9e2ZpeGVkOlwiZml4ZWRcIixob2xkVHJhbnNpdGlvbjpcImhvbGQtdHJhbnNpdGlvblwifSxnPWZ1bmN0aW9uKGEpe3RoaXMub3B0aW9ucz1hLHRoaXMuYmluZGVkUmVzaXplPSExLHRoaXMuYWN0aXZhdGUoKX07Zy5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24oKXt0aGlzLmZpeCgpLHRoaXMuZml4U2lkZWJhcigpLGEoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuaG9sZFRyYW5zaXRpb24pLHRoaXMub3B0aW9ucy5yZXNldEhlaWdodCYmYShcImJvZHksIGh0bWwsIFwiK2Uud3JhcHBlcikuY3NzKHtoZWlnaHQ6XCJhdXRvXCIsXCJtaW4taGVpZ2h0XCI6XCIxMDAlXCJ9KSx0aGlzLmJpbmRlZFJlc2l6ZXx8KGEod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXt0aGlzLmZpeCgpLHRoaXMuZml4U2lkZWJhcigpLGEoZS5sb2dvK1wiLCBcIitlLnNpZGViYXIpLm9uZShcIndlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmRcIixmdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCl9LmJpbmQodGhpcykpfS5iaW5kKHRoaXMpKSx0aGlzLmJpbmRlZFJlc2l6ZT0hMCksYShlLnNpZGViYXJNZW51KS5vbihcImV4cGFuZGVkLnRyZWVcIixmdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCl9LmJpbmQodGhpcykpLGEoZS5zaWRlYmFyTWVudSkub24oXCJjb2xsYXBzZWQudHJlZVwiLGZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKX0uYmluZCh0aGlzKSl9LGcucHJvdG90eXBlLmZpeD1mdW5jdGlvbigpe2EoZS5sYXlvdXRCb3hlZCtcIiA+IFwiK2Uud3JhcHBlcikuY3NzKFwib3ZlcmZsb3dcIixcImhpZGRlblwiKTt2YXIgYj1hKGUubWFpbkZvb3Rlcikub3V0ZXJIZWlnaHQoKXx8MCxjPWEoZS5tYWluSGVhZGVyKS5vdXRlckhlaWdodCgpfHwwLGQ9YytiLGc9YSh3aW5kb3cpLmhlaWdodCgpLGg9YShlLnNpZGViYXIpLmhlaWdodCgpfHwwO2lmKGEoXCJib2R5XCIpLmhhc0NsYXNzKGYuZml4ZWQpKWEoZS5jb250ZW50V3JhcHBlcikuY3NzKFwibWluLWhlaWdodFwiLGctYik7ZWxzZXt2YXIgaTtnPj1oK2M/KGEoZS5jb250ZW50V3JhcHBlcikuY3NzKFwibWluLWhlaWdodFwiLGctZCksaT1nLWQpOihhKGUuY29udGVudFdyYXBwZXIpLmNzcyhcIm1pbi1oZWlnaHRcIixoKSxpPWgpO3ZhciBqPWEoZS5jb250cm9sU2lkZWJhcik7dm9pZCAwIT09aiYmai5oZWlnaHQoKT5pJiZhKGUuY29udGVudFdyYXBwZXIpLmNzcyhcIm1pbi1oZWlnaHRcIixqLmhlaWdodCgpKX19LGcucHJvdG90eXBlLmZpeFNpZGViYXI9ZnVuY3Rpb24oKXtpZighYShcImJvZHlcIikuaGFzQ2xhc3MoZi5maXhlZCkpcmV0dXJuIHZvaWQodm9pZCAwIT09YS5mbi5zbGltU2Nyb2xsJiZhKGUuc2lkZWJhcikuc2xpbVNjcm9sbCh7ZGVzdHJveTohMH0pLmhlaWdodChcImF1dG9cIikpO3RoaXMub3B0aW9ucy5zbGltc2Nyb2xsJiZ2b2lkIDAhPT1hLmZuLnNsaW1TY3JvbGwmJmEoZS5zaWRlYmFyKS5zbGltU2Nyb2xsKHtoZWlnaHQ6YSh3aW5kb3cpLmhlaWdodCgpLWEoZS5tYWluSGVhZGVyKS5oZWlnaHQoKStcInB4XCJ9KX07dmFyIGg9YS5mbi5sYXlvdXQ7YS5mbi5sYXlvdXQ9YixhLmZuLmxheW91dC5Db25zdHVjdG9yPWcsYS5mbi5sYXlvdXQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmxheW91dD1oLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2IuY2FsbChhKFwiYm9keVwiKSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKGMpO2lmKCFmKXt2YXIgZz1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxmPW5ldyBoKGcpKX1cInRvZ2dsZVwiPT09YiYmZi50b2dnbGUoKX0pfXZhciBjPVwibHRlLnB1c2htZW51XCIsZD17Y29sbGFwc2VTY3JlZW5TaXplOjc2NyxleHBhbmRPbkhvdmVyOiExLGV4cGFuZFRyYW5zaXRpb25EZWxheToyMDB9LGU9e2NvbGxhcHNlZDpcIi5zaWRlYmFyLWNvbGxhcHNlXCIsb3BlbjpcIi5zaWRlYmFyLW9wZW5cIixtYWluU2lkZWJhcjpcIi5tYWluLXNpZGViYXJcIixjb250ZW50V3JhcHBlcjpcIi5jb250ZW50LXdyYXBwZXJcIixzZWFyY2hJbnB1dDpcIi5zaWRlYmFyLWZvcm0gLmZvcm0tY29udHJvbFwiLGJ1dHRvbjonW2RhdGEtdG9nZ2xlPVwicHVzaC1tZW51XCJdJyxtaW5pOlwiLnNpZGViYXItbWluaVwiLGV4cGFuZGVkOlwiLnNpZGViYXItZXhwYW5kZWQtb24taG92ZXJcIixsYXlvdXRGaXhlZDpcIi5maXhlZFwifSxmPXtjb2xsYXBzZWQ6XCJzaWRlYmFyLWNvbGxhcHNlXCIsb3BlbjpcInNpZGViYXItb3BlblwiLG1pbmk6XCJzaWRlYmFyLW1pbmlcIixleHBhbmRlZDpcInNpZGViYXItZXhwYW5kZWQtb24taG92ZXJcIixleHBhbmRGZWF0dXJlOlwic2lkZWJhci1taW5pLWV4cGFuZC1mZWF0dXJlXCIsbGF5b3V0Rml4ZWQ6XCJmaXhlZFwifSxnPXtleHBhbmRlZDpcImV4cGFuZGVkLnB1c2hNZW51XCIsY29sbGFwc2VkOlwiY29sbGFwc2VkLnB1c2hNZW51XCJ9LGg9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zPWEsdGhpcy5pbml0KCl9O2gucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXsodGhpcy5vcHRpb25zLmV4cGFuZE9uSG92ZXJ8fGEoXCJib2R5XCIpLmlzKGUubWluaStlLmxheW91dEZpeGVkKSkmJih0aGlzLmV4cGFuZE9uSG92ZXIoKSxhKFwiYm9keVwiKS5hZGRDbGFzcyhmLmV4cGFuZEZlYXR1cmUpKSxhKGUuY29udGVudFdyYXBwZXIpLmNsaWNrKGZ1bmN0aW9uKCl7YSh3aW5kb3cpLndpZHRoKCk8PXRoaXMub3B0aW9ucy5jb2xsYXBzZVNjcmVlblNpemUmJmEoXCJib2R5XCIpLmhhc0NsYXNzKGYub3BlbikmJnRoaXMuY2xvc2UoKX0uYmluZCh0aGlzKSksYShlLnNlYXJjaElucHV0KS5jbGljayhmdW5jdGlvbihhKXthLnN0b3BQcm9wYWdhdGlvbigpfSl9LGgucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciBiPWEod2luZG93KS53aWR0aCgpLGM9IWEoXCJib2R5XCIpLmhhc0NsYXNzKGYuY29sbGFwc2VkKTtiPD10aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplJiYoYz1hKFwiYm9keVwiKS5oYXNDbGFzcyhmLm9wZW4pKSxjP3RoaXMuY2xvc2UoKTp0aGlzLm9wZW4oKX0saC5wcm90b3R5cGUub3Blbj1mdW5jdGlvbigpe2Eod2luZG93KS53aWR0aCgpPnRoaXMub3B0aW9ucy5jb2xsYXBzZVNjcmVlblNpemU/YShcImJvZHlcIikucmVtb3ZlQ2xhc3MoZi5jb2xsYXBzZWQpLnRyaWdnZXIoYS5FdmVudChnLmV4cGFuZGVkKSk6YShcImJvZHlcIikuYWRkQ2xhc3MoZi5vcGVuKS50cmlnZ2VyKGEuRXZlbnQoZy5leHBhbmRlZCkpfSxoLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe2Eod2luZG93KS53aWR0aCgpPnRoaXMub3B0aW9ucy5jb2xsYXBzZVNjcmVlblNpemU/YShcImJvZHlcIikuYWRkQ2xhc3MoZi5jb2xsYXBzZWQpLnRyaWdnZXIoYS5FdmVudChnLmNvbGxhcHNlZCkpOmEoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYub3BlbitcIiBcIitmLmNvbGxhcHNlZCkudHJpZ2dlcihhLkV2ZW50KGcuY29sbGFwc2VkKSl9LGgucHJvdG90eXBlLmV4cGFuZE9uSG92ZXI9ZnVuY3Rpb24oKXthKGUubWFpblNpZGViYXIpLmhvdmVyKGZ1bmN0aW9uKCl7YShcImJvZHlcIikuaXMoZS5taW5pK2UuY29sbGFwc2VkKSYmYSh3aW5kb3cpLndpZHRoKCk+dGhpcy5vcHRpb25zLmNvbGxhcHNlU2NyZWVuU2l6ZSYmdGhpcy5leHBhbmQoKX0uYmluZCh0aGlzKSxmdW5jdGlvbigpe2EoXCJib2R5XCIpLmlzKGUuZXhwYW5kZWQpJiZ0aGlzLmNvbGxhcHNlKCl9LmJpbmQodGhpcykpfSxoLnByb3RvdHlwZS5leHBhbmQ9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YShcImJvZHlcIikucmVtb3ZlQ2xhc3MoZi5jb2xsYXBzZWQpLmFkZENsYXNzKGYuZXhwYW5kZWQpfSx0aGlzLm9wdGlvbnMuZXhwYW5kVHJhbnNpdGlvbkRlbGF5KX0saC5wcm90b3R5cGUuY29sbGFwc2U9ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YShcImJvZHlcIikucmVtb3ZlQ2xhc3MoZi5leHBhbmRlZCkuYWRkQ2xhc3MoZi5jb2xsYXBzZWQpfSx0aGlzLm9wdGlvbnMuZXhwYW5kVHJhbnNpdGlvbkRlbGF5KX07dmFyIGk9YS5mbi5wdXNoTWVudTthLmZuLnB1c2hNZW51PWIsYS5mbi5wdXNoTWVudS5Db25zdHJ1Y3Rvcj1oLGEuZm4ucHVzaE1lbnUubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnB1c2hNZW51PWksdGhpc30sYShkb2N1bWVudCkub24oXCJjbGlja1wiLGUuYnV0dG9uLGZ1bmN0aW9uKGMpe2MucHJldmVudERlZmF1bHQoKSxiLmNhbGwoYSh0aGlzKSxcInRvZ2dsZVwiKX0pLGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2IuY2FsbChhKGUuYnV0dG9uKSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKGMpO2lmKCFmKXt2YXIgaD1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxmPW5ldyBnKGUsaCkpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBmKXtpZih2b2lkIDA9PT1mW2JdKXRocm93IG5ldyBFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcIitiKTtmW2JdKCl9fSl9dmFyIGM9XCJsdGUudG9kb2xpc3RcIixkPXtvbkNoZWNrOmZ1bmN0aW9uKGEpe3JldHVybiBhfSxvblVuQ2hlY2s6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9fSxlPXtkYXRhOidbZGF0YS13aWRnZXQ9XCJ0b2RvLWxpc3RcIl0nfSxmPXtkb25lOlwiZG9uZVwifSxnPWZ1bmN0aW9uKGEsYil7dGhpcy5lbGVtZW50PWEsdGhpcy5vcHRpb25zPWIsdGhpcy5fc2V0VXBMaXN0ZW5lcnMoKX07Zy5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGEpe2lmKGEucGFyZW50cyhlLmxpKS5maXJzdCgpLnRvZ2dsZUNsYXNzKGYuZG9uZSksIWEucHJvcChcImNoZWNrZWRcIikpcmV0dXJuIHZvaWQgdGhpcy51bkNoZWNrKGEpO3RoaXMuY2hlY2soYSl9LGcucHJvdG90eXBlLmNoZWNrPWZ1bmN0aW9uKGEpe3RoaXMub3B0aW9ucy5vbkNoZWNrLmNhbGwoYSl9LGcucHJvdG90eXBlLnVuQ2hlY2s9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zLm9uVW5DaGVjay5jYWxsKGEpfSxnLnByb3RvdHlwZS5fc2V0VXBMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2EodGhpcy5lbGVtZW50KS5vbihcImNoYW5nZSBpZkNoYW5nZWRcIixcImlucHV0OmNoZWNrYm94XCIsZnVuY3Rpb24oKXtiLnRvZ2dsZShhKHRoaXMpKX0pfTt2YXIgaD1hLmZuLnRvZG9MaXN0O2EuZm4udG9kb0xpc3Q9YixhLmZuLnRvZG9MaXN0LkNvbnN0cnVjdG9yPWcsYS5mbi50b2RvTGlzdC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4udG9kb0xpc3Q9aCx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKGUuZGF0YSkuZWFjaChmdW5jdGlvbigpe2IuY2FsbChhKHRoaXMpKX0pfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKTtpZighZS5kYXRhKGMpKXt2YXIgZj1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxuZXcgaChlLGYpKX19KX12YXIgYz1cImx0ZS50cmVlXCIsZD17YW5pbWF0aW9uU3BlZWQ6NTAwLGFjY29yZGlvbjohMCxmb2xsb3dMaW5rOiExLHRyaWdnZXI6XCIudHJlZXZpZXcgYVwifSxlPXt0cmVlOlwiLnRyZWVcIix0cmVldmlldzpcIi50cmVldmlld1wiLHRyZWV2aWV3TWVudTpcIi50cmVldmlldy1tZW51XCIsb3BlbjpcIi5tZW51LW9wZW4sIC5hY3RpdmVcIixsaTpcImxpXCIsZGF0YTonW2RhdGEtd2lkZ2V0PVwidHJlZVwiXScsYWN0aXZlOlwiLmFjdGl2ZVwifSxmPXtvcGVuOlwibWVudS1vcGVuXCIsdHJlZTpcInRyZWVcIn0sZz17Y29sbGFwc2VkOlwiY29sbGFwc2VkLnRyZWVcIixleHBhbmRlZDpcImV4cGFuZGVkLnRyZWVcIn0saD1mdW5jdGlvbihiLGMpe3RoaXMuZWxlbWVudD1iLHRoaXMub3B0aW9ucz1jLGEodGhpcy5lbGVtZW50KS5hZGRDbGFzcyhmLnRyZWUpLGEoZS50cmVldmlldytlLmFjdGl2ZSx0aGlzLmVsZW1lbnQpLmFkZENsYXNzKGYub3BlbiksdGhpcy5fc2V0VXBMaXN0ZW5lcnMoKX07aC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5uZXh0KGUudHJlZXZpZXdNZW51KSxkPWEucGFyZW50KCksZz1kLmhhc0NsYXNzKGYub3Blbik7ZC5pcyhlLnRyZWV2aWV3KSYmKHRoaXMub3B0aW9ucy5mb2xsb3dMaW5rJiZcIiNcIiE9PWEuYXR0cihcImhyZWZcIil8fGIucHJldmVudERlZmF1bHQoKSxnP3RoaXMuY29sbGFwc2UoYyxkKTp0aGlzLmV4cGFuZChjLGQpKX0saC5wcm90b3R5cGUuZXhwYW5kPWZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5FdmVudChnLmV4cGFuZGVkKTtpZih0aGlzLm9wdGlvbnMuYWNjb3JkaW9uKXt2YXIgaD1jLnNpYmxpbmdzKGUub3BlbiksaT1oLmNoaWxkcmVuKGUudHJlZXZpZXdNZW51KTt0aGlzLmNvbGxhcHNlKGksaCl9Yy5hZGRDbGFzcyhmLm9wZW4pLGIuc2xpZGVEb3duKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCxmdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS50cmlnZ2VyKGQpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUuY29sbGFwc2U9ZnVuY3Rpb24oYixjKXt2YXIgZD1hLkV2ZW50KGcuY29sbGFwc2VkKTtjLnJlbW92ZUNsYXNzKGYub3BlbiksYi5zbGlkZVVwKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCxmdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS50cmlnZ2VyKGQpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUuX3NldFVwTGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpczthKHRoaXMuZWxlbWVudCkub24oXCJjbGlja1wiLHRoaXMub3B0aW9ucy50cmlnZ2VyLGZ1bmN0aW9uKGMpe2IudG9nZ2xlKGEodGhpcyksYyl9KX07dmFyIGk9YS5mbi50cmVlO2EuZm4udHJlZT1iLGEuZm4udHJlZS5Db25zdHJ1Y3Rvcj1oLGEuZm4udHJlZS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4udHJlZT1pLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoZS5kYXRhKS5lYWNoKGZ1bmN0aW9uKCl7Yi5jYWxsKGEodGhpcykpfSl9KX0oalF1ZXJ5KTsiLCIvKlxuICogV2VsY29tZSB0byB5b3VyIGFwcCdzIG1haW4gSmF2YVNjcmlwdCBmaWxlIVxuICpcbiAqIFdlIHJlY29tbWVuZCBpbmNsdWRpbmcgdGhlIGJ1aWx0IHZlcnNpb24gb2YgdGhpcyBKYXZhU2NyaXB0IGZpbGVcbiAqIChhbmQgaXRzIENTUyBmaWxlKSBpbiB5b3VyIGJhc2UgbGF5b3V0IChiYXNlLmh0bWwudHdpZykuXG4gKi9cblxucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwLWRhdGVwaWNrZXIvZGlzdC9jc3MvYm9vdHN0cmFwLWRhdGVwaWNrZXIubWluLmNzcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9mb250LWF3ZXNvbWUvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL0lvbmljb25zL2Nzcy9pb25pY29ucy5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLXRoZW1lLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL3BsdWdpbnMvaUNoZWNrL2FsbC5jc3MnKTtcbnJlcXVpcmUoJy4uL2Rpc3QvY3NzL0FkbWluTFRFLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL2Rpc3QvY3NzL3NraW5zL3NraW4tYmx1ZS5jc3MnKTtcbnJlcXVpcmUoJy4uL2Nzcy9hcHAuY3NzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC9kaXN0L2pzL2Jvb3RzdHJhcC5taW4uanMnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5qcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnRpbWUuanMnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5yZXNpemUuanMnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5waWUuanMnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5jYXRlZ29yaWVzLmpzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC1kYXRlcGlja2VyL2Rpc3QvanMvYm9vdHN0cmFwLWRhdGVwaWNrZXIubWluLmpzJyk7XG5yZXF1aXJlKCcuLi9wbHVnaW5zL3RpbWVwaWNrZXIvYm9vdHN0cmFwLXRpbWVwaWNrZXIubWluLmpzJyk7XG5yZXF1aXJlKCcuLi9wbHVnaW5zL2lDaGVjay9pY2hlY2subWluLmpzJyk7XG5yZXF1aXJlKCcuLi9kaXN0L2pzL2FkbWlubHRlLm1pbi5qcycpO1xucmVxdWlyZSgnLi4vanMvY3VzdG9tLmpzJyk7XG5cblxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKGUpIHtcclxuICAgICQoXCJsaS5jdXJyZW50X2FuY2VzdG9yIHVsXCIpLmNzcyh7ZGlzcGxheTogXCJibG9ja1wifSk7XHJcbiAgICAkKFwibGkuY3VycmVudF9hbmNlc3RvclwiKS5hZGRDbGFzcyhcIm1lbnUtb3BlblwiKTtcclxuXHJcbiAgICAkKFwiLmFkZEZvcm1Sb3dcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgdGFibGUgPSAkKHRoaXMpLnBhcmVudHMoJ3RhYmxlJyk7XHJcbiAgICAgICAgbGV0IHJvd3MgPSAkKHRhYmxlKS5maW5kKCd0cicpLmxlbmd0aDtcclxuICAgICAgICBsZXQgdHIgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuY2xvbmUoKTtcclxuICAgICAgICAkKHRyKS5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xyXG4gICAgICAgICAgICBsZXQgcHJvdG90eXBlID0gJChlKS5kYXRhKCdwcm90b3R5cGUnKTtcclxuICAgICAgICAgICAgaWYgKHByb3RvdHlwZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gcHJvdG90eXBlLnJlcGxhY2UoL19fbmFtZV9fL2csIHJvd3MpO1xyXG4gICAgICAgICAgICAgICAgJChlKS5odG1sKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0cikuYXBwZW5kVG8odGFibGUpO1xyXG4gICAgICAgICQodHIpLmZpbmQoXCIuYWRkRm9ybVJvd1wiKS5yZW1vdmUoKTtcclxuICAgICAgICAkKHRyKS5maW5kKFwiLnJlbW92ZVJvd1wiKS5zaG93KCk7XHJcbiAgICAgICAgJCh0cikuZmluZChcIi5yZW1vdmVSb3dcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5yZW1vdmVSb3dcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiW2RhdGEtY2hhbmdlLWxhYmVsXVwiKS5lYWNoKChpLCBlKSA9PiB7XHJcbiAgICAgICAgbGV0IHBhcmVudE1vZGFsID0gJChlKS5wYXJlbnRzKCcubW9kYWwnKTtcclxuXHJcbiAgICAgICAgaWYgKCQoZSkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKSkge1xyXG4gICAgICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS10b2dnbGUtb249XCInICsgJChlKS5hdHRyKCduYW1lJykgKyAnXCJdJykuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLXRvZ2dsZS1vbj1cIicgKyAkKGUpLmF0dHIoJ25hbWUnKSArICdcIl0nKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLWRlcGVuZHM9XCInICsgJChlKS5hdHRyKCduYW1lJykgKyAnXCJdJykudGV4dCgkKGUpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuICAgICAgICAkKGUpLmNoYW5nZSgoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKCQoZSkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKSkge1xyXG4gICAgICAgICAgICAgICAgJChwYXJlbnRNb2RhbCkuZmluZCgnW2RhdGEtdG9nZ2xlLW9uPVwiJyArICQoZSkuYXR0cignbmFtZScpICsgJ1wiXScpLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLXRvZ2dsZS1vbj1cIicgKyAkKGUpLmF0dHIoJ25hbWUnKSArICdcIl0nKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJChwYXJlbnRNb2RhbCkuZmluZCgnW2RhdGEtZGVwZW5kcz1cIicgKyAkKGUpLmF0dHIoJ25hbWUnKSArICdcIl0nKS50ZXh0KCQoZSkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIltkYXRhLWNvbmZpcm1dXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKCQodGhpcykuZGF0YSgnY29uZmlybScpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkKCdbZGF0YS1wYXJlbnRdJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgbW9kYWwgPSAkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpO1xyXG4gICAgICAgICQobW9kYWwpLmZpbmQoJ1tuYW1lPVwiJyArICQobW9kYWwpLmF0dHIoJ2lkJykgKyAnW3BhcmVudF9pZF1cIl0nKS52YWwoJCh0aGlzKS5kYXRhKCdwYXJlbnQnKSk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoXCIubW9kYWwuYXBwZW5kVG9Db2xsZWN0aW9uXCIpLm9uKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgbnIgPSAkKCdbZGF0YS1jb2xsZWN0aW9uPVwiJyArICQodGhpcykuZGF0YSgnYXBwZW5kJykgKyAnXCJdJykubGVuZ3RoO1xyXG4gICAgICAgICQodGhpcykuZmluZCgnaW5wdXQsc3VibWl0LHNlbGVjdCxvcHRpb24sdGV4dGFyZWEnKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XHJcbiAgICAgICAgICAgIGlmICgkKGUpLmF0dHIoJ25hbWUnKSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICQoZSkuYXR0cignbmFtZScsICQoZSkuYXR0cignbmFtZScpLnJlcGxhY2UoL19fbmFtZV9fL2csIG5yKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnZm9ybS5hamF4Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxldCBkYXRhID0gbmV3IEZvcm1EYXRhKHRoaXMpO1xyXG4gICAgICAgIHZhciBmb3JtID0gdGhpcztcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6ICQodGhpcykuZGF0YSgndmFsaWRhdGUnKSxcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmVycm9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5pZCAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbW9kYWwgPSAkKGZvcm0pLnBhcmVudHMoJy5tb2RhbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ID0gJCgnW2RhdGEtdGFyZ2V0PVwiIycgKyAkKG1vZGFsKS5hdHRyKFwiaWRcIikgKyAnXCJdJykucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5maW5kKCdzZWxlY3QnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChzZWxlY3QpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnByb3AoXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnPG9wdGlvbiB2YWx1ZT1cIicgKyBkYXRhLmlkICsgJ1wiPicgKyBkYXRhLmxhYmVsICsgJzwvb3B0aW9uPicpLmFwcGVuZFRvKHNlbGVjdCkucHJvcChcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKG1vZGFsKS5maW5kKCdbZGF0YS1kaXNtaXNzXScpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG5cclxuICAgICQoXCJpbnB1dDpmaWxlW2RhdGEtdmFsaWRhdGVdXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpLnBhcmVudHMoXCJmb3JtXCIpO1xyXG4gICAgICAgIHZhciBtb2RhbCA9ICQodGhpcykucGFyZW50cyhcIi5tb2RhbFwiKTtcclxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMubmFtZTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtWzBdKTtcclxuICAgICAgICBsZXQgZGF0YTIgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBkYXRhMi5hcHBlbmQoJ2ZpbGUnLCBkYXRhLmdldChuYW1lKSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAkKHRoaXMpLmRhdGEoJ3ZhbGlkYXRlJyksXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YTIsXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3IgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWJsZSA9ICQobW9kYWwpLmZpbmQoJ3RhYmxlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0YWJsZSkuZmluZChcInRyXCIpLmVhY2goKGksIGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGUpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpIGluIGRhdGEuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcm93cyA9ICQodGFibGUpLmZpbmQoJ3RyJykubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHIgPSAkKHRhYmxlKS5maW5kKCd0cicpLmZpcnN0KCkuY2xvbmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuYXBwZW5kVG8odGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKFwiLmFkZEZvcm1Sb3dcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoXCIucmVtb3ZlUm93XCIpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZChcIi5yZW1vdmVSb3dcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb3RvdHlwZSA9ICQoZSkuZGF0YSgncHJvdG90eXBlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvdG90eXBlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gcHJvdG90eXBlLnJlcGxhY2UoL19fbmFtZV9fL2csIHJvd3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZSkuaHRtbChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKCcudmFsdWUnKS52YWwoZGF0YS5kYXRhW2ldLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZCgnLnRpbWUnKS52YWwoZGF0YS5kYXRhW2ldLnRpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCJbZGF0YS10b2dnbGU9J2NoYXJ0J11cIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciBpZHMgPSBbXTtcclxuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5yZWNvcmRzJykuZmluZChcIltkYXRhLXRvZ2dsZT0nY2hhcnQnXVwiKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XHJcbiAgICAgICAgICAgIGlmICgkKGUpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBpZHMucHVzaCgkKGUpLmRhdGEoJ3JlY29yZCcpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGRyYXdDaGFydCgkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpLCBpZHMpO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpXHJcblxyXG59KVxyXG5cclxuJCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdLm1pbmltYWwsIGlucHV0W3R5cGU9XCJyYWRpb1wiXS5taW5pbWFsJykuaUNoZWNrKHtcclxuICAgIGNoZWNrYm94Q2xhc3M6ICdpY2hlY2tib3hfbWluaW1hbC1ibHVlJyxcclxuICAgIHJhZGlvQ2xhc3M6ICdpcmFkaW9fbWluaW1hbC1ibHVlJ1xyXG59KVxyXG5cclxuJCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdLmFwcGVuZC1ydW4nKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICQuYWpheCgkKHRoaXMpLmRhdGEoJ2xpbmsnKSwge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgZGF0YTogeydydW5faWQnOiAkKHRoaXMpLnZhbCgpfSxcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHhociwgc3RhdHVzKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufSk7XHJcblxyXG5mdW5jdGlvbiBkcmF3Q2hhcnQoZWxlbWVudCwgaWRzKSB7XHJcbiAgICB2YXIgZGF0YSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5Db21ib0NoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCQoZWxlbWVudCkuYXR0cignaWQnKSkpO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIGJhcjoge2dyb3VwV2lkdGg6IFwiMTAwJVwifSxcclxuICAgICAgICBjdXJ2ZVR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgICAgc2VyaWVzVHlwZTogJ2xpbmUnLFxyXG4gICAgICAgIHNlcmllczoge30sXHJcbiAgICAgICAgbGVnZW5kOiB7cG9zaXRpb246ICdib3R0b20nfSxcclxuICAgICAgICB2QXhlczoge1xyXG4gICAgICAgICAgICAwOiB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IDFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMToge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAtMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkLmFqYXgoJChlbGVtZW50KS5kYXRhKCdkYXRhbGluaycpLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHsnaWRzJzogaWRzfSxcclxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZXNwb25zZVRleHQgIT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5wYXJlbnRzKCcuY2hhcnQtYm94JykuZmluZCgnLmJveC1ib2R5JykuY29sbGFwc2UoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQganNvbiA9IHhoci5yZXNwb25zZUpTT047XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpIGluIGpzb25bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5hZGRDb2x1bW4oanNvblswXVtpXVswXSwganNvblswXVtpXVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnNlcmllc1tpIC0gMV0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zZXJpZXNbaSAtIDFdID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvblswXVtpXVszXSAhPSB1bmRlZmluZWQgJiYganNvblswXVtpXVszXSA9PSAncHJlY2lwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzW2kgLSAxXS50YXJnZXRBeGlzSW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzW2kgLSAxXS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzY2YmM0MCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzW2kgLSAxXS50YXJnZXRBeGlzSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25bMF1baV1bMl0gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zZXJpZXNbaSAtIDFdLnR5cGUgPSBqc29uWzBdW2ldWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuYWRkUm93cyhqc29uWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudHMoJy5jaGFydC1ib3gnKS5maW5kKCcuYm94LWJvZHknKS5jb2xsYXBzZSgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYXJ0LmNsZWFyQ2hhcnQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcbn1cclxuXHJcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qISBpQ2hlY2sgdjEuMC4xIGJ5IERhbWlyIFN1bHRhbm92LCBodHRwOi8vZ2l0LmlvL2FybHplQSwgTUlUIExpY2Vuc2VkICovXG4oZnVuY3Rpb24oaCl7ZnVuY3Rpb24gRihhLGIsZCl7dmFyIGM9YVswXSxlPS9lci8udGVzdChkKT9tOi9ibC8udGVzdChkKT9zOmwsZj1kPT1IP3tjaGVja2VkOmNbbF0sZGlzYWJsZWQ6Y1tzXSxpbmRldGVybWluYXRlOlwidHJ1ZVwiPT1hLmF0dHIobSl8fFwiZmFsc2VcIj09YS5hdHRyKHcpfTpjW2VdO2lmKC9eKGNofGRpfGluKS8udGVzdChkKSYmIWYpRChhLGUpO2Vsc2UgaWYoL14odW58ZW58ZGUpLy50ZXN0KGQpJiZmKXQoYSxlKTtlbHNlIGlmKGQ9PUgpZm9yKGUgaW4gZilmW2VdP0QoYSxlLCEwKTp0KGEsZSwhMCk7ZWxzZSBpZighYnx8XCJ0b2dnbGVcIj09ZCl7aWYoIWIpYVtwXShcImlmQ2xpY2tlZFwiKTtmP2Nbbl0hPT11JiZ0KGEsZSk6RChhLGUpfX1mdW5jdGlvbiBEKGEsYixkKXt2YXIgYz1hWzBdLGU9YS5wYXJlbnQoKSxmPWI9PWwsQT1iPT1tLEI9Yj09cyxLPUE/dzpmP0U6XCJlbmFibGVkXCIscD1rKGEsSyt4KGNbbl0pKSxOPWsoYSxiK3goY1tuXSkpO2lmKCEwIT09Y1tiXSl7aWYoIWQmJlxuYj09bCYmY1tuXT09dSYmYy5uYW1lKXt2YXIgQz1hLmNsb3Nlc3QoXCJmb3JtXCIpLHI9J2lucHV0W25hbWU9XCInK2MubmFtZSsnXCJdJyxyPUMubGVuZ3RoP0MuZmluZChyKTpoKHIpO3IuZWFjaChmdW5jdGlvbigpe3RoaXMhPT1jJiZoKHRoaXMpLmRhdGEocSkmJnQoaCh0aGlzKSxiKX0pfUE/KGNbYl09ITAsY1tsXSYmdChhLGwsXCJmb3JjZVwiKSk6KGR8fChjW2JdPSEwKSxmJiZjW21dJiZ0KGEsbSwhMSkpO0woYSxmLGIsZCl9Y1tzXSYmayhhLHksITApJiZlLmZpbmQoXCIuXCIrSSkuY3NzKHksXCJkZWZhdWx0XCIpO2Vbdl0oTnx8ayhhLGIpfHxcIlwiKTtCP2UuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcInRydWVcIik6ZS5hdHRyKFwiYXJpYS1jaGVja2VkXCIsQT9cIm1peGVkXCI6XCJ0cnVlXCIpO2Vbel0ocHx8ayhhLEspfHxcIlwiKX1mdW5jdGlvbiB0KGEsYixkKXt2YXIgYz1hWzBdLGU9YS5wYXJlbnQoKSxmPWI9PWwsaD1iPT1tLHE9Yj09cyxwPWg/dzpmP0U6XCJlbmFibGVkXCIsdD1rKGEscCt4KGNbbl0pKSxcbnU9ayhhLGIreChjW25dKSk7aWYoITEhPT1jW2JdKXtpZihofHwhZHx8XCJmb3JjZVwiPT1kKWNbYl09ITE7TChhLGYscCxkKX0hY1tzXSYmayhhLHksITApJiZlLmZpbmQoXCIuXCIrSSkuY3NzKHksXCJwb2ludGVyXCIpO2Vbel0odXx8ayhhLGIpfHxcIlwiKTtxP2UuYXR0cihcImFyaWEtZGlzYWJsZWRcIixcImZhbHNlXCIpOmUuYXR0cihcImFyaWEtY2hlY2tlZFwiLFwiZmFsc2VcIik7ZVt2XSh0fHxrKGEscCl8fFwiXCIpfWZ1bmN0aW9uIE0oYSxiKXtpZihhLmRhdGEocSkpe2EucGFyZW50KCkuaHRtbChhLmF0dHIoXCJzdHlsZVwiLGEuZGF0YShxKS5zfHxcIlwiKSk7aWYoYilhW3BdKGIpO2Eub2ZmKFwiLmlcIikudW53cmFwKCk7aChHKydbZm9yPVwiJythWzBdLmlkKydcIl0nKS5hZGQoYS5jbG9zZXN0KEcpKS5vZmYoXCIuaVwiKX19ZnVuY3Rpb24gayhhLGIsZCl7aWYoYS5kYXRhKHEpKXJldHVybiBhLmRhdGEocSkub1tiKyhkP1wiXCI6XCJDbGFzc1wiKV19ZnVuY3Rpb24geChhKXtyZXR1cm4gYS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStcbmEuc2xpY2UoMSl9ZnVuY3Rpb24gTChhLGIsZCxjKXtpZighYyl7aWYoYilhW3BdKFwiaWZUb2dnbGVkXCIpO2FbcF0oXCJpZkNoYW5nZWRcIilbcF0oXCJpZlwiK3goZCkpfX12YXIgcT1cImlDaGVja1wiLEk9cStcIi1oZWxwZXJcIix1PVwicmFkaW9cIixsPVwiY2hlY2tlZFwiLEU9XCJ1blwiK2wscz1cImRpc2FibGVkXCIsdz1cImRldGVybWluYXRlXCIsbT1cImluXCIrdyxIPVwidXBkYXRlXCIsbj1cInR5cGVcIix2PVwiYWRkQ2xhc3NcIix6PVwicmVtb3ZlQ2xhc3NcIixwPVwidHJpZ2dlclwiLEc9XCJsYWJlbFwiLHk9XCJjdXJzb3JcIixKPS9pcGFkfGlwaG9uZXxpcG9kfGFuZHJvaWR8YmxhY2tiZXJyeXx3aW5kb3dzIHBob25lfG9wZXJhIG1pbml8c2lsay9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7aC5mbltxXT1mdW5jdGlvbihhLGIpe3ZhciBkPSdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0sIGlucHV0W3R5cGU9XCInK3UrJ1wiXScsYz1oKCksZT1mdW5jdGlvbihhKXthLmVhY2goZnVuY3Rpb24oKXt2YXIgYT1oKHRoaXMpO2M9YS5pcyhkKT9cbmMuYWRkKGEpOmMuYWRkKGEuZmluZChkKSl9KX07aWYoL14oY2hlY2t8dW5jaGVja3x0b2dnbGV8aW5kZXRlcm1pbmF0ZXxkZXRlcm1pbmF0ZXxkaXNhYmxlfGVuYWJsZXx1cGRhdGV8ZGVzdHJveSkkL2kudGVzdChhKSlyZXR1cm4gYT1hLnRvTG93ZXJDYXNlKCksZSh0aGlzKSxjLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1oKHRoaXMpO1wiZGVzdHJveVwiPT1hP00oYyxcImlmRGVzdHJveWVkXCIpOkYoYywhMCxhKTtoLmlzRnVuY3Rpb24oYikmJmIoKX0pO2lmKFwib2JqZWN0XCIhPXR5cGVvZiBhJiZhKXJldHVybiB0aGlzO3ZhciBmPWguZXh0ZW5kKHtjaGVja2VkQ2xhc3M6bCxkaXNhYmxlZENsYXNzOnMsaW5kZXRlcm1pbmF0ZUNsYXNzOm0sbGFiZWxIb3ZlcjohMCxhcmlhOiExfSxhKSxrPWYuaGFuZGxlLEI9Zi5ob3ZlckNsYXNzfHxcImhvdmVyXCIseD1mLmZvY3VzQ2xhc3N8fFwiZm9jdXNcIix3PWYuYWN0aXZlQ2xhc3N8fFwiYWN0aXZlXCIseT0hIWYubGFiZWxIb3ZlcixDPWYubGFiZWxIb3ZlckNsYXNzfHxcblwiaG92ZXJcIixyPShcIlwiK2YuaW5jcmVhc2VBcmVhKS5yZXBsYWNlKFwiJVwiLFwiXCIpfDA7aWYoXCJjaGVja2JveFwiPT1rfHxrPT11KWQ9J2lucHV0W3R5cGU9XCInK2srJ1wiXSc7LTUwPnImJihyPS01MCk7ZSh0aGlzKTtyZXR1cm4gYy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGE9aCh0aGlzKTtNKGEpO3ZhciBjPXRoaXMsYj1jLmlkLGU9LXIrXCIlXCIsZD0xMDArMipyK1wiJVwiLGQ9e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix0b3A6ZSxsZWZ0OmUsZGlzcGxheTpcImJsb2NrXCIsd2lkdGg6ZCxoZWlnaHQ6ZCxtYXJnaW46MCxwYWRkaW5nOjAsYmFja2dyb3VuZDpcIiNmZmZcIixib3JkZXI6MCxvcGFjaXR5OjB9LGU9Sj97cG9zaXRpb246XCJhYnNvbHV0ZVwiLHZpc2liaWxpdHk6XCJoaWRkZW5cIn06cj9kOntwb3NpdGlvbjpcImFic29sdXRlXCIsb3BhY2l0eTowfSxrPVwiY2hlY2tib3hcIj09Y1tuXT9mLmNoZWNrYm94Q2xhc3N8fFwiaWNoZWNrYm94XCI6Zi5yYWRpb0NsYXNzfHxcImlcIit1LG09aChHKydbZm9yPVwiJytiKydcIl0nKS5hZGQoYS5jbG9zZXN0KEcpKSxcbkE9ISFmLmFyaWEsRT1xK1wiLVwiK01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnJlcGxhY2UoXCIwLlwiLFwiXCIpLGc9JzxkaXYgY2xhc3M9XCInK2srJ1wiICcrKEE/J3JvbGU9XCInK2Nbbl0rJ1wiICc6XCJcIik7bS5sZW5ndGgmJkEmJm0uZWFjaChmdW5jdGlvbigpe2crPSdhcmlhLWxhYmVsbGVkYnk9XCInO3RoaXMuaWQ/Zys9dGhpcy5pZDoodGhpcy5pZD1FLGcrPUUpO2crPSdcIid9KTtnPWEud3JhcChnK1wiLz5cIilbcF0oXCJpZkNyZWF0ZWRcIikucGFyZW50KCkuYXBwZW5kKGYuaW5zZXJ0KTtkPWgoJzxpbnMgY2xhc3M9XCInK0krJ1wiLz4nKS5jc3MoZCkuYXBwZW5kVG8oZyk7YS5kYXRhKHEse286ZixzOmEuYXR0cihcInN0eWxlXCIpfSkuY3NzKGUpO2YuaW5oZXJpdENsYXNzJiZnW3ZdKGMuY2xhc3NOYW1lfHxcIlwiKTtmLmluaGVyaXRJRCYmYiYmZy5hdHRyKFwiaWRcIixxK1wiLVwiK2IpO1wic3RhdGljXCI9PWcuY3NzKFwicG9zaXRpb25cIikmJmcuY3NzKFwicG9zaXRpb25cIixcInJlbGF0aXZlXCIpO0YoYSwhMCxIKTtcbmlmKG0ubGVuZ3RoKW0ub24oXCJjbGljay5pIG1vdXNlb3Zlci5pIG1vdXNlb3V0LmkgdG91Y2hiZWdpbi5pIHRvdWNoZW5kLmlcIixmdW5jdGlvbihiKXt2YXIgZD1iW25dLGU9aCh0aGlzKTtpZighY1tzXSl7aWYoXCJjbGlja1wiPT1kKXtpZihoKGIudGFyZ2V0KS5pcyhcImFcIikpcmV0dXJuO0YoYSwhMSwhMCl9ZWxzZSB5JiYoL3V0fG5kLy50ZXN0KGQpPyhnW3pdKEIpLGVbel0oQykpOihnW3ZdKEIpLGVbdl0oQykpKTtpZihKKWIuc3RvcFByb3BhZ2F0aW9uKCk7ZWxzZSByZXR1cm4hMX19KTthLm9uKFwiY2xpY2suaSBmb2N1cy5pIGJsdXIuaSBrZXl1cC5pIGtleWRvd24uaSBrZXlwcmVzcy5pXCIsZnVuY3Rpb24oYil7dmFyIGQ9YltuXTtiPWIua2V5Q29kZTtpZihcImNsaWNrXCI9PWQpcmV0dXJuITE7aWYoXCJrZXlkb3duXCI9PWQmJjMyPT1iKXJldHVybiBjW25dPT11JiZjW2xdfHwoY1tsXT90KGEsbCk6RChhLGwpKSwhMTtpZihcImtleXVwXCI9PWQmJmNbbl09PXUpIWNbbF0mJkQoYSxsKTtlbHNlIGlmKC91c3x1ci8udGVzdChkKSlnW1wiYmx1clwiPT1cbmQ/ejp2XSh4KX0pO2Qub24oXCJjbGljayBtb3VzZWRvd24gbW91c2V1cCBtb3VzZW92ZXIgbW91c2VvdXQgdG91Y2hiZWdpbi5pIHRvdWNoZW5kLmlcIixmdW5jdGlvbihiKXt2YXIgZD1iW25dLGU9L3dufHVwLy50ZXN0KGQpP3c6QjtpZighY1tzXSl7aWYoXCJjbGlja1wiPT1kKUYoYSwhMSwhMCk7ZWxzZXtpZigvd258ZXJ8aW4vLnRlc3QoZCkpZ1t2XShlKTtlbHNlIGdbel0oZStcIiBcIit3KTtpZihtLmxlbmd0aCYmeSYmZT09QiltWy91dHxuZC8udGVzdChkKT96OnZdKEMpfWlmKEopYi5zdG9wUHJvcGFnYXRpb24oKTtlbHNlIHJldHVybiExfX0pfSl9fSkod2luZG93LmpRdWVyeXx8d2luZG93LlplcHRvKTtcbiIsIi8qISBib290c3RyYXAtdGltZXBpY2tlciB2MC41LjIgXG4qIGh0dHA6Ly9qZGV3aXQuZ2l0aHViLmNvbS9ib290c3RyYXAtdGltZXBpY2tlciBcbiogQ29weXJpZ2h0IChjKSAyMDE2IEpvcmlzIGRlIFdpdCBhbmQgYm9vdHN0cmFwLXRpbWVwaWNrZXIgY29udHJpYnV0b3JzIFxuKiBNSVQgTGljZW5zZSBcbiovIWZ1bmN0aW9uKGEsYixjKXtcInVzZSBzdHJpY3RcIjt2YXIgZD1mdW5jdGlvbihiLGMpe3RoaXMud2lkZ2V0PVwiXCIsdGhpcy4kZWxlbWVudD1hKGIpLHRoaXMuZGVmYXVsdFRpbWU9Yy5kZWZhdWx0VGltZSx0aGlzLmRpc2FibGVGb2N1cz1jLmRpc2FibGVGb2N1cyx0aGlzLmRpc2FibGVNb3VzZXdoZWVsPWMuZGlzYWJsZU1vdXNld2hlZWwsdGhpcy5pc09wZW49Yy5pc09wZW4sdGhpcy5taW51dGVTdGVwPWMubWludXRlU3RlcCx0aGlzLm1vZGFsQmFja2Ryb3A9Yy5tb2RhbEJhY2tkcm9wLHRoaXMub3JpZW50YXRpb249Yy5vcmllbnRhdGlvbix0aGlzLnNlY29uZFN0ZXA9Yy5zZWNvbmRTdGVwLHRoaXMuc25hcFRvU3RlcD1jLnNuYXBUb1N0ZXAsdGhpcy5zaG93SW5wdXRzPWMuc2hvd0lucHV0cyx0aGlzLnNob3dNZXJpZGlhbj1jLnNob3dNZXJpZGlhbix0aGlzLnNob3dTZWNvbmRzPWMuc2hvd1NlY29uZHMsdGhpcy50ZW1wbGF0ZT1jLnRlbXBsYXRlLHRoaXMuYXBwZW5kV2lkZ2V0VG89Yy5hcHBlbmRXaWRnZXRUbyx0aGlzLnNob3dXaWRnZXRPbkFkZG9uQ2xpY2s9Yy5zaG93V2lkZ2V0T25BZGRvbkNsaWNrLHRoaXMuaWNvbnM9Yy5pY29ucyx0aGlzLm1heEhvdXJzPWMubWF4SG91cnMsdGhpcy5leHBsaWNpdE1vZGU9Yy5leHBsaWNpdE1vZGUsdGhpcy5oYW5kbGVEb2N1bWVudENsaWNrPWZ1bmN0aW9uKGEpe3ZhciBiPWEuZGF0YS5zY29wZTtiLiRlbGVtZW50LnBhcmVudCgpLmZpbmQoYS50YXJnZXQpLmxlbmd0aHx8Yi4kd2lkZ2V0LmlzKGEudGFyZ2V0KXx8Yi4kd2lkZ2V0LmZpbmQoYS50YXJnZXQpLmxlbmd0aHx8Yi5oaWRlV2lkZ2V0KCl9LHRoaXMuX2luaXQoKX07ZC5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOmQsX2luaXQ6ZnVuY3Rpb24oKXt2YXIgYj10aGlzO3RoaXMuc2hvd1dpZGdldE9uQWRkb25DbGljayYmdGhpcy4kZWxlbWVudC5wYXJlbnQoKS5oYXNDbGFzcyhcImlucHV0LWdyb3VwXCIpJiZ0aGlzLiRlbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKFwiYm9vdHN0cmFwLXRpbWVwaWNrZXJcIik/KHRoaXMuJGVsZW1lbnQucGFyZW50KFwiLmlucHV0LWdyb3VwLmJvb3RzdHJhcC10aW1lcGlja2VyXCIpLmZpbmQoXCIuaW5wdXQtZ3JvdXAtYWRkb25cIikub24oe1wiY2xpY2sudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5zaG93V2lkZ2V0LHRoaXMpfSksdGhpcy4kZWxlbWVudC5vbih7XCJmb2N1cy50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmhpZ2hsaWdodFVuaXQsdGhpcyksXCJjbGljay50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmhpZ2hsaWdodFVuaXQsdGhpcyksXCJrZXlkb3duLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuZWxlbWVudEtleWRvd24sdGhpcyksXCJibHVyLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuYmx1ckVsZW1lbnQsdGhpcyksXCJtb3VzZXdoZWVsLnRpbWVwaWNrZXIgRE9NTW91c2VTY3JvbGwudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5tb3VzZXdoZWVsLHRoaXMpfSkpOnRoaXMudGVtcGxhdGU/dGhpcy4kZWxlbWVudC5vbih7XCJmb2N1cy50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLnNob3dXaWRnZXQsdGhpcyksXCJjbGljay50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLnNob3dXaWRnZXQsdGhpcyksXCJibHVyLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuYmx1ckVsZW1lbnQsdGhpcyksXCJtb3VzZXdoZWVsLnRpbWVwaWNrZXIgRE9NTW91c2VTY3JvbGwudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5tb3VzZXdoZWVsLHRoaXMpfSk6dGhpcy4kZWxlbWVudC5vbih7XCJmb2N1cy50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmhpZ2hsaWdodFVuaXQsdGhpcyksXCJjbGljay50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmhpZ2hsaWdodFVuaXQsdGhpcyksXCJrZXlkb3duLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuZWxlbWVudEtleWRvd24sdGhpcyksXCJibHVyLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuYmx1ckVsZW1lbnQsdGhpcyksXCJtb3VzZXdoZWVsLnRpbWVwaWNrZXIgRE9NTW91c2VTY3JvbGwudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5tb3VzZXdoZWVsLHRoaXMpfSksdGhpcy50ZW1wbGF0ZSE9PSExP3RoaXMuJHdpZGdldD1hKHRoaXMuZ2V0VGVtcGxhdGUoKSkub24oXCJjbGlja1wiLGEucHJveHkodGhpcy53aWRnZXRDbGljayx0aGlzKSk6dGhpcy4kd2lkZ2V0PSExLHRoaXMuc2hvd0lucHV0cyYmdGhpcy4kd2lkZ2V0IT09ITEmJnRoaXMuJHdpZGdldC5maW5kKFwiaW5wdXRcIikuZWFjaChmdW5jdGlvbigpe2EodGhpcykub24oe1wiY2xpY2sudGltZXBpY2tlclwiOmZ1bmN0aW9uKCl7YSh0aGlzKS5zZWxlY3QoKX0sXCJrZXlkb3duLnRpbWVwaWNrZXJcIjphLnByb3h5KGIud2lkZ2V0S2V5ZG93bixiKSxcImtleXVwLnRpbWVwaWNrZXJcIjphLnByb3h5KGIud2lkZ2V0S2V5dXAsYil9KX0pLHRoaXMuc2V0RGVmYXVsdFRpbWUodGhpcy5kZWZhdWx0VGltZSl9LGJsdXJFbGVtZW50OmZ1bmN0aW9uKCl7dGhpcy5oaWdobGlnaHRlZFVuaXQ9bnVsbCx0aGlzLnVwZGF0ZUZyb21FbGVtZW50VmFsKCl9LGNsZWFyOmZ1bmN0aW9uKCl7dGhpcy5ob3VyPVwiXCIsdGhpcy5taW51dGU9XCJcIix0aGlzLnNlY29uZD1cIlwiLHRoaXMubWVyaWRpYW49XCJcIix0aGlzLiRlbGVtZW50LnZhbChcIlwiKX0sZGVjcmVtZW50SG91cjpmdW5jdGlvbigpe2lmKHRoaXMuc2hvd01lcmlkaWFuKWlmKDE9PT10aGlzLmhvdXIpdGhpcy5ob3VyPTEyO2Vsc2V7aWYoMTI9PT10aGlzLmhvdXIpcmV0dXJuIHRoaXMuaG91ci0tLHRoaXMudG9nZ2xlTWVyaWRpYW4oKTtpZigwPT09dGhpcy5ob3VyKXJldHVybiB0aGlzLmhvdXI9MTEsdGhpcy50b2dnbGVNZXJpZGlhbigpO3RoaXMuaG91ci0tfWVsc2UgdGhpcy5ob3VyPD0wP3RoaXMuaG91cj10aGlzLm1heEhvdXJzLTE6dGhpcy5ob3VyLS19LGRlY3JlbWVudE1pbnV0ZTpmdW5jdGlvbihhKXt2YXIgYjtiPWE/dGhpcy5taW51dGUtYTp0aGlzLm1pbnV0ZS10aGlzLm1pbnV0ZVN0ZXAsMD5iPyh0aGlzLmRlY3JlbWVudEhvdXIoKSx0aGlzLm1pbnV0ZT1iKzYwKTp0aGlzLm1pbnV0ZT1ifSxkZWNyZW1lbnRTZWNvbmQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnNlY29uZC10aGlzLnNlY29uZFN0ZXA7MD5hPyh0aGlzLmRlY3JlbWVudE1pbnV0ZSghMCksdGhpcy5zZWNvbmQ9YSs2MCk6dGhpcy5zZWNvbmQ9YX0sZWxlbWVudEtleWRvd246ZnVuY3Rpb24oYSl7c3dpdGNoKGEud2hpY2gpe2Nhc2UgOTppZihhLnNoaWZ0S2V5KXtpZihcImhvdXJcIj09PXRoaXMuaGlnaGxpZ2h0ZWRVbml0KXt0aGlzLmhpZGVXaWRnZXQoKTticmVha310aGlzLmhpZ2hsaWdodFByZXZVbml0KCl9ZWxzZXtpZih0aGlzLnNob3dNZXJpZGlhbiYmXCJtZXJpZGlhblwiPT09dGhpcy5oaWdobGlnaHRlZFVuaXR8fHRoaXMuc2hvd1NlY29uZHMmJlwic2Vjb25kXCI9PT10aGlzLmhpZ2hsaWdodGVkVW5pdHx8IXRoaXMuc2hvd01lcmlkaWFuJiYhdGhpcy5zaG93U2Vjb25kcyYmXCJtaW51dGVcIj09PXRoaXMuaGlnaGxpZ2h0ZWRVbml0KXt0aGlzLmhpZGVXaWRnZXQoKTticmVha310aGlzLmhpZ2hsaWdodE5leHRVbml0KCl9YS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMudXBkYXRlRnJvbUVsZW1lbnRWYWwoKTticmVhaztjYXNlIDI3OnRoaXMudXBkYXRlRnJvbUVsZW1lbnRWYWwoKTticmVhaztjYXNlIDM3OmEucHJldmVudERlZmF1bHQoKSx0aGlzLmhpZ2hsaWdodFByZXZVbml0KCksdGhpcy51cGRhdGVGcm9tRWxlbWVudFZhbCgpO2JyZWFrO2Nhc2UgMzg6c3dpdGNoKGEucHJldmVudERlZmF1bHQoKSx0aGlzLmhpZ2hsaWdodGVkVW5pdCl7Y2FzZVwiaG91clwiOnRoaXMuaW5jcmVtZW50SG91cigpLHRoaXMuaGlnaGxpZ2h0SG91cigpO2JyZWFrO2Nhc2VcIm1pbnV0ZVwiOnRoaXMuaW5jcmVtZW50TWludXRlKCksdGhpcy5oaWdobGlnaHRNaW51dGUoKTticmVhaztjYXNlXCJzZWNvbmRcIjp0aGlzLmluY3JlbWVudFNlY29uZCgpLHRoaXMuaGlnaGxpZ2h0U2Vjb25kKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLnRvZ2dsZU1lcmlkaWFuKCksdGhpcy5oaWdobGlnaHRNZXJpZGlhbigpfXRoaXMudXBkYXRlKCk7YnJlYWs7Y2FzZSAzOTphLnByZXZlbnREZWZhdWx0KCksdGhpcy5oaWdobGlnaHROZXh0VW5pdCgpLHRoaXMudXBkYXRlRnJvbUVsZW1lbnRWYWwoKTticmVhaztjYXNlIDQwOnN3aXRjaChhLnByZXZlbnREZWZhdWx0KCksdGhpcy5oaWdobGlnaHRlZFVuaXQpe2Nhc2VcImhvdXJcIjp0aGlzLmRlY3JlbWVudEhvdXIoKSx0aGlzLmhpZ2hsaWdodEhvdXIoKTticmVhaztjYXNlXCJtaW51dGVcIjp0aGlzLmRlY3JlbWVudE1pbnV0ZSgpLHRoaXMuaGlnaGxpZ2h0TWludXRlKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6dGhpcy5kZWNyZW1lbnRTZWNvbmQoKSx0aGlzLmhpZ2hsaWdodFNlY29uZCgpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy50b2dnbGVNZXJpZGlhbigpLHRoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKX10aGlzLnVwZGF0ZSgpfX0sZ2V0Q3Vyc29yUG9zaXRpb246ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50LmdldCgwKTtpZihcInNlbGVjdGlvblN0YXJ0XCJpbiBhKXJldHVybiBhLnNlbGVjdGlvblN0YXJ0O2lmKGMuc2VsZWN0aW9uKXthLmZvY3VzKCk7dmFyIGI9Yy5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKSxkPWMuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGg7cmV0dXJuIGIubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsLWEudmFsdWUubGVuZ3RoKSxiLnRleHQubGVuZ3RoLWR9fSxnZXRUZW1wbGF0ZTpmdW5jdGlvbigpe3ZhciBhLGIsYyxkLGUsZjtzd2l0Y2godGhpcy5zaG93SW5wdXRzPyhiPSc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLWhvdXJcIiBtYXhsZW5ndGg9XCIyXCIvPicsYz0nPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1taW51dGVcIiBtYXhsZW5ndGg9XCIyXCIvPicsZD0nPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1zZWNvbmRcIiBtYXhsZW5ndGg9XCIyXCIvPicsZT0nPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1tZXJpZGlhblwiIG1heGxlbmd0aD1cIjJcIi8+Jyk6KGI9JzxzcGFuIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItaG91clwiPjwvc3Bhbj4nLGM9JzxzcGFuIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItbWludXRlXCI+PC9zcGFuPicsZD0nPHNwYW4gY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1zZWNvbmRcIj48L3NwYW4+JyxlPSc8c3BhbiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLW1lcmlkaWFuXCI+PC9zcGFuPicpLGY9Jzx0YWJsZT48dHI+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJpbmNyZW1lbnRIb3VyXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMudXArJ1wiPjwvc3Bhbj48L2E+PC90ZD48dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj4mbmJzcDs8L3RkPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiaW5jcmVtZW50TWludXRlXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMudXArJ1wiPjwvc3Bhbj48L2E+PC90ZD4nKyh0aGlzLnNob3dTZWNvbmRzPyc8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj4mbmJzcDs8L3RkPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiaW5jcmVtZW50U2Vjb25kXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMudXArJ1wiPjwvc3Bhbj48L2E+PC90ZD4nOlwiXCIpKyh0aGlzLnNob3dNZXJpZGlhbj8nPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+Jm5ic3A7PC90ZD48dGQgY2xhc3M9XCJtZXJpZGlhbi1jb2x1bW5cIj48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwidG9nZ2xlTWVyaWRpYW5cIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy51cCsnXCI+PC9zcGFuPjwvYT48L3RkPic6XCJcIikrXCI8L3RyPjx0cj48dGQ+XCIrYisnPC90ZD4gPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+OjwvdGQ+PHRkPicrYytcIjwvdGQ+IFwiKyh0aGlzLnNob3dTZWNvbmRzPyc8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj46PC90ZD48dGQ+JytkK1wiPC90ZD5cIjpcIlwiKSsodGhpcy5zaG93TWVyaWRpYW4/Jzx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPiZuYnNwOzwvdGQ+PHRkPicrZStcIjwvdGQ+XCI6XCJcIikrJzwvdHI+PHRyPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiZGVjcmVtZW50SG91clwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLmRvd24rJ1wiPjwvc3Bhbj48L2E+PC90ZD48dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj48L3RkPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiZGVjcmVtZW50TWludXRlXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMuZG93bisnXCI+PC9zcGFuPjwvYT48L3RkPicrKHRoaXMuc2hvd1NlY29uZHM/Jzx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPiZuYnNwOzwvdGQ+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJkZWNyZW1lbnRTZWNvbmRcIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy5kb3duKydcIj48L3NwYW4+PC9hPjwvdGQ+JzpcIlwiKSsodGhpcy5zaG93TWVyaWRpYW4/Jzx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPiZuYnNwOzwvdGQ+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJ0b2dnbGVNZXJpZGlhblwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLmRvd24rJ1wiPjwvc3Bhbj48L2E+PC90ZD4nOlwiXCIpK1wiPC90cj48L3RhYmxlPlwiLHRoaXMudGVtcGxhdGUpe2Nhc2VcIm1vZGFsXCI6YT0nPGRpdiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLXdpZGdldCBtb2RhbCBoaWRlIGZhZGUgaW5cIiBkYXRhLWJhY2tkcm9wPVwiJysodGhpcy5tb2RhbEJhY2tkcm9wP1widHJ1ZVwiOlwiZmFsc2VcIikrJ1wiPjxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2E+PGgzPlBpY2sgYSBUaW1lPC9oMz48L2Rpdj48ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPicrZisnPC9kaXY+PGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPk9LPC9hPjwvZGl2PjwvZGl2Pic7YnJlYWs7Y2FzZVwiZHJvcGRvd25cIjphPSc8ZGl2IGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItd2lkZ2V0IGRyb3Bkb3duLW1lbnVcIj4nK2YrXCI8L2Rpdj5cIn1yZXR1cm4gYX0sZ2V0VGltZTpmdW5jdGlvbigpe3JldHVyblwiXCI9PT10aGlzLmhvdXI/XCJcIjp0aGlzLmhvdXIrXCI6XCIrKDE9PT10aGlzLm1pbnV0ZS50b1N0cmluZygpLmxlbmd0aD9cIjBcIit0aGlzLm1pbnV0ZTp0aGlzLm1pbnV0ZSkrKHRoaXMuc2hvd1NlY29uZHM/XCI6XCIrKDE9PT10aGlzLnNlY29uZC50b1N0cmluZygpLmxlbmd0aD9cIjBcIit0aGlzLnNlY29uZDp0aGlzLnNlY29uZCk6XCJcIikrKHRoaXMuc2hvd01lcmlkaWFuP1wiIFwiK3RoaXMubWVyaWRpYW46XCJcIil9LGhpZGVXaWRnZXQ6ZnVuY3Rpb24oKXt0aGlzLmlzT3BlbiE9PSExJiYodGhpcy4kZWxlbWVudC50cmlnZ2VyKHt0eXBlOlwiaGlkZS50aW1lcGlja2VyXCIsdGltZTp7dmFsdWU6dGhpcy5nZXRUaW1lKCksaG91cnM6dGhpcy5ob3VyLG1pbnV0ZXM6dGhpcy5taW51dGUsc2Vjb25kczp0aGlzLnNlY29uZCxtZXJpZGlhbjp0aGlzLm1lcmlkaWFufX0pLFwibW9kYWxcIj09PXRoaXMudGVtcGxhdGUmJnRoaXMuJHdpZGdldC5tb2RhbD90aGlzLiR3aWRnZXQubW9kYWwoXCJoaWRlXCIpOnRoaXMuJHdpZGdldC5yZW1vdmVDbGFzcyhcIm9wZW5cIiksYShjKS5vZmYoXCJtb3VzZWRvd24udGltZXBpY2tlciwgdG91Y2hlbmQudGltZXBpY2tlclwiLHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayksdGhpcy5pc09wZW49ITEsdGhpcy4kd2lkZ2V0LmRldGFjaCgpKX0saGlnaGxpZ2h0VW5pdDpmdW5jdGlvbigpe3RoaXMucG9zaXRpb249dGhpcy5nZXRDdXJzb3JQb3NpdGlvbigpLHRoaXMucG9zaXRpb24+PTAmJnRoaXMucG9zaXRpb248PTI/dGhpcy5oaWdobGlnaHRIb3VyKCk6dGhpcy5wb3NpdGlvbj49MyYmdGhpcy5wb3NpdGlvbjw9NT90aGlzLmhpZ2hsaWdodE1pbnV0ZSgpOnRoaXMucG9zaXRpb24+PTYmJnRoaXMucG9zaXRpb248PTg/dGhpcy5zaG93U2Vjb25kcz90aGlzLmhpZ2hsaWdodFNlY29uZCgpOnRoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKTp0aGlzLnBvc2l0aW9uPj05JiZ0aGlzLnBvc2l0aW9uPD0xMSYmdGhpcy5oaWdobGlnaHRNZXJpZGlhbigpfSxoaWdobGlnaHROZXh0VW5pdDpmdW5jdGlvbigpe3N3aXRjaCh0aGlzLmhpZ2hsaWdodGVkVW5pdCl7Y2FzZVwiaG91clwiOnRoaXMuaGlnaGxpZ2h0TWludXRlKCk7YnJlYWs7Y2FzZVwibWludXRlXCI6dGhpcy5zaG93U2Vjb25kcz90aGlzLmhpZ2hsaWdodFNlY29uZCgpOnRoaXMuc2hvd01lcmlkaWFuP3RoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKTp0aGlzLmhpZ2hsaWdodEhvdXIoKTticmVhaztjYXNlXCJzZWNvbmRcIjp0aGlzLnNob3dNZXJpZGlhbj90aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCk6dGhpcy5oaWdobGlnaHRIb3VyKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLmhpZ2hsaWdodEhvdXIoKX19LGhpZ2hsaWdodFByZXZVbml0OmZ1bmN0aW9uKCl7c3dpdGNoKHRoaXMuaGlnaGxpZ2h0ZWRVbml0KXtjYXNlXCJob3VyXCI6dGhpcy5zaG93TWVyaWRpYW4/dGhpcy5oaWdobGlnaHRNZXJpZGlhbigpOnRoaXMuc2hvd1NlY29uZHM/dGhpcy5oaWdobGlnaHRTZWNvbmQoKTp0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpO2JyZWFrO2Nhc2VcIm1pbnV0ZVwiOnRoaXMuaGlnaGxpZ2h0SG91cigpO2JyZWFrO2Nhc2VcInNlY29uZFwiOnRoaXMuaGlnaGxpZ2h0TWludXRlKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLnNob3dTZWNvbmRzP3RoaXMuaGlnaGxpZ2h0U2Vjb25kKCk6dGhpcy5oaWdobGlnaHRNaW51dGUoKX19LGhpZ2hsaWdodEhvdXI6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50LmdldCgwKSxiPXRoaXM7dGhpcy5oaWdobGlnaHRlZFVuaXQ9XCJob3VyXCIsYS5zZXRTZWxlY3Rpb25SYW5nZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2IuaG91cjwxMD9hLnNldFNlbGVjdGlvblJhbmdlKDAsMSk6YS5zZXRTZWxlY3Rpb25SYW5nZSgwLDIpfSwwKX0saGlnaGxpZ2h0TWludXRlOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudC5nZXQoMCksYj10aGlzO3RoaXMuaGlnaGxpZ2h0ZWRVbml0PVwibWludXRlXCIsYS5zZXRTZWxlY3Rpb25SYW5nZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2IuaG91cjwxMD9hLnNldFNlbGVjdGlvblJhbmdlKDIsNCk6YS5zZXRTZWxlY3Rpb25SYW5nZSgzLDUpfSwwKX0saGlnaGxpZ2h0U2Vjb25kOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudC5nZXQoMCksYj10aGlzO3RoaXMuaGlnaGxpZ2h0ZWRVbml0PVwic2Vjb25kXCIsYS5zZXRTZWxlY3Rpb25SYW5nZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2IuaG91cjwxMD9hLnNldFNlbGVjdGlvblJhbmdlKDUsNyk6YS5zZXRTZWxlY3Rpb25SYW5nZSg2LDgpfSwwKX0saGlnaGxpZ2h0TWVyaWRpYW46ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50LmdldCgwKSxiPXRoaXM7dGhpcy5oaWdobGlnaHRlZFVuaXQ9XCJtZXJpZGlhblwiLGEuc2V0U2VsZWN0aW9uUmFuZ2UmJih0aGlzLnNob3dTZWNvbmRzP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtiLmhvdXI8MTA/YS5zZXRTZWxlY3Rpb25SYW5nZSg4LDEwKTphLnNldFNlbGVjdGlvblJhbmdlKDksMTEpfSwwKTpzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5ob3VyPDEwP2Euc2V0U2VsZWN0aW9uUmFuZ2UoNSw3KTphLnNldFNlbGVjdGlvblJhbmdlKDYsOCl9LDApKX0saW5jcmVtZW50SG91cjpmdW5jdGlvbigpe2lmKHRoaXMuc2hvd01lcmlkaWFuKXtpZigxMT09PXRoaXMuaG91cilyZXR1cm4gdGhpcy5ob3VyKyssdGhpcy50b2dnbGVNZXJpZGlhbigpOzEyPT09dGhpcy5ob3VyJiYodGhpcy5ob3VyPTApfXJldHVybiB0aGlzLmhvdXI9PT10aGlzLm1heEhvdXJzLTE/dm9pZCh0aGlzLmhvdXI9MCk6dm9pZCB0aGlzLmhvdXIrK30saW5jcmVtZW50TWludXRlOmZ1bmN0aW9uKGEpe3ZhciBiO2I9YT90aGlzLm1pbnV0ZSthOnRoaXMubWludXRlK3RoaXMubWludXRlU3RlcC10aGlzLm1pbnV0ZSV0aGlzLm1pbnV0ZVN0ZXAsYj41OT8odGhpcy5pbmNyZW1lbnRIb3VyKCksdGhpcy5taW51dGU9Yi02MCk6dGhpcy5taW51dGU9Yn0saW5jcmVtZW50U2Vjb25kOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5zZWNvbmQrdGhpcy5zZWNvbmRTdGVwLXRoaXMuc2Vjb25kJXRoaXMuc2Vjb25kU3RlcDthPjU5Pyh0aGlzLmluY3JlbWVudE1pbnV0ZSghMCksdGhpcy5zZWNvbmQ9YS02MCk6dGhpcy5zZWNvbmQ9YX0sbW91c2V3aGVlbDpmdW5jdGlvbihiKXtpZighdGhpcy5kaXNhYmxlTW91c2V3aGVlbCl7Yi5wcmV2ZW50RGVmYXVsdCgpLGIuc3RvcFByb3BhZ2F0aW9uKCk7dmFyIGM9Yi5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGF8fC1iLm9yaWdpbmFsRXZlbnQuZGV0YWlsLGQ9bnVsbDtzd2l0Y2goXCJtb3VzZXdoZWVsXCI9PT1iLnR5cGU/ZD0tMSpiLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YTpcIkRPTU1vdXNlU2Nyb2xsXCI9PT1iLnR5cGUmJihkPTQwKmIub3JpZ2luYWxFdmVudC5kZXRhaWwpLGQmJihiLnByZXZlbnREZWZhdWx0KCksYSh0aGlzKS5zY3JvbGxUb3AoZCthKHRoaXMpLnNjcm9sbFRvcCgpKSksdGhpcy5oaWdobGlnaHRlZFVuaXQpe2Nhc2VcIm1pbnV0ZVwiOmM+MD90aGlzLmluY3JlbWVudE1pbnV0ZSgpOnRoaXMuZGVjcmVtZW50TWludXRlKCksdGhpcy5oaWdobGlnaHRNaW51dGUoKTticmVhaztjYXNlXCJzZWNvbmRcIjpjPjA/dGhpcy5pbmNyZW1lbnRTZWNvbmQoKTp0aGlzLmRlY3JlbWVudFNlY29uZCgpLHRoaXMuaGlnaGxpZ2h0U2Vjb25kKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLnRvZ2dsZU1lcmlkaWFuKCksdGhpcy5oaWdobGlnaHRNZXJpZGlhbigpO2JyZWFrO2RlZmF1bHQ6Yz4wP3RoaXMuaW5jcmVtZW50SG91cigpOnRoaXMuZGVjcmVtZW50SG91cigpLHRoaXMuaGlnaGxpZ2h0SG91cigpfXJldHVybiExfX0sY2hhbmdlVG9OZWFyZXN0U3RlcDpmdW5jdGlvbihhLGIpe3JldHVybiBhJWI9PT0wP2E6TWF0aC5yb3VuZChhJWIvYik/KGErKGItYSViKSklNjA6YS1hJWJ9LHBsYWNlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuaXNJbmxpbmUpe3ZhciBjPXRoaXMuJHdpZGdldC5vdXRlcldpZHRoKCksZD10aGlzLiR3aWRnZXQub3V0ZXJIZWlnaHQoKSxlPTEwLGY9YShiKS53aWR0aCgpLGc9YShiKS5oZWlnaHQoKSxoPWEoYikuc2Nyb2xsVG9wKCksaT1wYXJzZUludCh0aGlzLiRlbGVtZW50LnBhcmVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKXtyZXR1cm5cImF1dG9cIiE9PWEodGhpcykuY3NzKFwiei1pbmRleFwiKX0pLmZpcnN0KCkuY3NzKFwiei1pbmRleFwiKSwxMCkrMTAsaj10aGlzLmNvbXBvbmVudD90aGlzLmNvbXBvbmVudC5wYXJlbnQoKS5vZmZzZXQoKTp0aGlzLiRlbGVtZW50Lm9mZnNldCgpLGs9dGhpcy5jb21wb25lbnQ/dGhpcy5jb21wb25lbnQub3V0ZXJIZWlnaHQoITApOnRoaXMuJGVsZW1lbnQub3V0ZXJIZWlnaHQoITEpLGw9dGhpcy5jb21wb25lbnQ/dGhpcy5jb21wb25lbnQub3V0ZXJXaWR0aCghMCk6dGhpcy4kZWxlbWVudC5vdXRlcldpZHRoKCExKSxtPWoubGVmdCxuPWoudG9wO3RoaXMuJHdpZGdldC5yZW1vdmVDbGFzcyhcInRpbWVwaWNrZXItb3JpZW50LXRvcCB0aW1lcGlja2VyLW9yaWVudC1ib3R0b20gdGltZXBpY2tlci1vcmllbnQtcmlnaHQgdGltZXBpY2tlci1vcmllbnQtbGVmdFwiKSxcImF1dG9cIiE9PXRoaXMub3JpZW50YXRpb24ueD8odGhpcy4kd2lkZ2V0LmFkZENsYXNzKFwidGltZXBpY2tlci1vcmllbnQtXCIrdGhpcy5vcmllbnRhdGlvbi54KSxcInJpZ2h0XCI9PT10aGlzLm9yaWVudGF0aW9uLngmJihtLT1jLWwpKToodGhpcy4kd2lkZ2V0LmFkZENsYXNzKFwidGltZXBpY2tlci1vcmllbnQtbGVmdFwiKSxqLmxlZnQ8MD9tLT1qLmxlZnQtZTpqLmxlZnQrYz5mJiYobT1mLWMtZSkpO3ZhciBvLHAscT10aGlzLm9yaWVudGF0aW9uLnk7XCJhdXRvXCI9PT1xJiYobz0taCtqLnRvcC1kLHA9aCtnLShqLnRvcCtrK2QpLHE9TWF0aC5tYXgobyxwKT09PXA/XCJ0b3BcIjpcImJvdHRvbVwiKSx0aGlzLiR3aWRnZXQuYWRkQ2xhc3MoXCJ0aW1lcGlja2VyLW9yaWVudC1cIitxKSxcInRvcFwiPT09cT9uKz1rOm4tPWQrcGFyc2VJbnQodGhpcy4kd2lkZ2V0LmNzcyhcInBhZGRpbmctdG9wXCIpLDEwKSx0aGlzLiR3aWRnZXQuY3NzKHt0b3A6bixsZWZ0Om0sekluZGV4Oml9KX19LHJlbW92ZTpmdW5jdGlvbigpe2EoXCJkb2N1bWVudFwiKS5vZmYoXCIudGltZXBpY2tlclwiKSx0aGlzLiR3aWRnZXQmJnRoaXMuJHdpZGdldC5yZW1vdmUoKSxkZWxldGUgdGhpcy4kZWxlbWVudC5kYXRhKCkudGltZXBpY2tlcn0sc2V0RGVmYXVsdFRpbWU6ZnVuY3Rpb24oYSl7aWYodGhpcy4kZWxlbWVudC52YWwoKSl0aGlzLnVwZGF0ZUZyb21FbGVtZW50VmFsKCk7ZWxzZSBpZihcImN1cnJlbnRcIj09PWEpe3ZhciBiPW5ldyBEYXRlLGM9Yi5nZXRIb3VycygpLGQ9Yi5nZXRNaW51dGVzKCksZT1iLmdldFNlY29uZHMoKSxmPVwiQU1cIjswIT09ZSYmKGU9TWF0aC5jZWlsKGIuZ2V0U2Vjb25kcygpL3RoaXMuc2Vjb25kU3RlcCkqdGhpcy5zZWNvbmRTdGVwLDYwPT09ZSYmKGQrPTEsZT0wKSksMCE9PWQmJihkPU1hdGguY2VpbChiLmdldE1pbnV0ZXMoKS90aGlzLm1pbnV0ZVN0ZXApKnRoaXMubWludXRlU3RlcCw2MD09PWQmJihjKz0xLGQ9MCkpLHRoaXMuc2hvd01lcmlkaWFuJiYoMD09PWM/Yz0xMjpjPj0xMj8oYz4xMiYmKGMtPTEyKSxmPVwiUE1cIik6Zj1cIkFNXCIpLHRoaXMuaG91cj1jLHRoaXMubWludXRlPWQsdGhpcy5zZWNvbmQ9ZSx0aGlzLm1lcmlkaWFuPWYsdGhpcy51cGRhdGUoKX1lbHNlIGE9PT0hMT8odGhpcy5ob3VyPTAsdGhpcy5taW51dGU9MCx0aGlzLnNlY29uZD0wLHRoaXMubWVyaWRpYW49XCJBTVwiKTp0aGlzLnNldFRpbWUoYSl9LHNldFRpbWU6ZnVuY3Rpb24oYSxiKXtpZighYSlyZXR1cm4gdm9pZCB0aGlzLmNsZWFyKCk7dmFyIGMsZCxlLGYsZyxoO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBhJiZhLmdldE1vbnRoKWU9YS5nZXRIb3VycygpLGY9YS5nZXRNaW51dGVzKCksZz1hLmdldFNlY29uZHMoKSx0aGlzLnNob3dNZXJpZGlhbiYmKGg9XCJBTVwiLGU+MTImJihoPVwiUE1cIixlJT0xMiksMTI9PT1lJiYoaD1cIlBNXCIpKTtlbHNle2lmKGM9KC9hL2kudGVzdChhKT8xOjApKygvcC9pLnRlc3QoYSk/MjowKSxjPjIpcmV0dXJuIHZvaWQgdGhpcy5jbGVhcigpO2lmKGQ9YS5yZXBsYWNlKC9bXjAtOVxcOl0vZyxcIlwiKS5zcGxpdChcIjpcIiksZT1kWzBdP2RbMF0udG9TdHJpbmcoKTpkLnRvU3RyaW5nKCksdGhpcy5leHBsaWNpdE1vZGUmJmUubGVuZ3RoPjImJmUubGVuZ3RoJTIhPT0wKXJldHVybiB2b2lkIHRoaXMuY2xlYXIoKTtmPWRbMV0/ZFsxXS50b1N0cmluZygpOlwiXCIsZz1kWzJdP2RbMl0udG9TdHJpbmcoKTpcIlwiLGUubGVuZ3RoPjQmJihnPWUuc2xpY2UoLTIpLGU9ZS5zbGljZSgwLC0yKSksZS5sZW5ndGg+MiYmKGY9ZS5zbGljZSgtMiksZT1lLnNsaWNlKDAsLTIpKSxmLmxlbmd0aD4yJiYoZz1mLnNsaWNlKC0yKSxmPWYuc2xpY2UoMCwtMikpLGU9cGFyc2VJbnQoZSwxMCksZj1wYXJzZUludChmLDEwKSxnPXBhcnNlSW50KGcsMTApLGlzTmFOKGUpJiYoZT0wKSxpc05hTihmKSYmKGY9MCksaXNOYU4oZykmJihnPTApLGc+NTkmJihnPTU5KSxmPjU5JiYoZj01OSksZT49dGhpcy5tYXhIb3VycyYmKGU9dGhpcy5tYXhIb3Vycy0xKSx0aGlzLnNob3dNZXJpZGlhbj8oZT4xMiYmKGM9MixlLT0xMiksY3x8KGM9MSksMD09PWUmJihlPTEyKSxoPTE9PT1jP1wiQU1cIjpcIlBNXCIpOjEyPmUmJjI9PT1jP2UrPTEyOmU+PXRoaXMubWF4SG91cnM/ZT10aGlzLm1heEhvdXJzLTE6KDA+ZXx8MTI9PT1lJiYxPT09YykmJihlPTApfXRoaXMuaG91cj1lLHRoaXMuc25hcFRvU3RlcD8odGhpcy5taW51dGU9dGhpcy5jaGFuZ2VUb05lYXJlc3RTdGVwKGYsdGhpcy5taW51dGVTdGVwKSx0aGlzLnNlY29uZD10aGlzLmNoYW5nZVRvTmVhcmVzdFN0ZXAoZyx0aGlzLnNlY29uZFN0ZXApKToodGhpcy5taW51dGU9Zix0aGlzLnNlY29uZD1nKSx0aGlzLm1lcmlkaWFuPWgsdGhpcy51cGRhdGUoYil9LHNob3dXaWRnZXQ6ZnVuY3Rpb24oKXt0aGlzLmlzT3Blbnx8dGhpcy4kZWxlbWVudC5pcyhcIjpkaXNhYmxlZFwiKXx8KHRoaXMuJHdpZGdldC5hcHBlbmRUbyh0aGlzLmFwcGVuZFdpZGdldFRvKSxhKGMpLm9uKFwibW91c2Vkb3duLnRpbWVwaWNrZXIsIHRvdWNoZW5kLnRpbWVwaWNrZXJcIix7c2NvcGU6dGhpc30sdGhpcy5oYW5kbGVEb2N1bWVudENsaWNrKSx0aGlzLiRlbGVtZW50LnRyaWdnZXIoe3R5cGU6XCJzaG93LnRpbWVwaWNrZXJcIix0aW1lOnt2YWx1ZTp0aGlzLmdldFRpbWUoKSxob3Vyczp0aGlzLmhvdXIsbWludXRlczp0aGlzLm1pbnV0ZSxzZWNvbmRzOnRoaXMuc2Vjb25kLG1lcmlkaWFuOnRoaXMubWVyaWRpYW59fSksdGhpcy5wbGFjZSgpLHRoaXMuZGlzYWJsZUZvY3VzJiZ0aGlzLiRlbGVtZW50LmJsdXIoKSxcIlwiPT09dGhpcy5ob3VyJiYodGhpcy5kZWZhdWx0VGltZT90aGlzLnNldERlZmF1bHRUaW1lKHRoaXMuZGVmYXVsdFRpbWUpOnRoaXMuc2V0VGltZShcIjA6MDowXCIpKSxcIm1vZGFsXCI9PT10aGlzLnRlbXBsYXRlJiZ0aGlzLiR3aWRnZXQubW9kYWw/dGhpcy4kd2lkZ2V0Lm1vZGFsKFwic2hvd1wiKS5vbihcImhpZGRlblwiLGEucHJveHkodGhpcy5oaWRlV2lkZ2V0LHRoaXMpKTp0aGlzLmlzT3Blbj09PSExJiZ0aGlzLiR3aWRnZXQuYWRkQ2xhc3MoXCJvcGVuXCIpLHRoaXMuaXNPcGVuPSEwKX0sdG9nZ2xlTWVyaWRpYW46ZnVuY3Rpb24oKXt0aGlzLm1lcmlkaWFuPVwiQU1cIj09PXRoaXMubWVyaWRpYW4/XCJQTVwiOlwiQU1cIn0sdXBkYXRlOmZ1bmN0aW9uKGEpe3RoaXMudXBkYXRlRWxlbWVudCgpLGF8fHRoaXMudXBkYXRlV2lkZ2V0KCksdGhpcy4kZWxlbWVudC50cmlnZ2VyKHt0eXBlOlwiY2hhbmdlVGltZS50aW1lcGlja2VyXCIsdGltZTp7dmFsdWU6dGhpcy5nZXRUaW1lKCksaG91cnM6dGhpcy5ob3VyLG1pbnV0ZXM6dGhpcy5taW51dGUsc2Vjb25kczp0aGlzLnNlY29uZCxtZXJpZGlhbjp0aGlzLm1lcmlkaWFufX0pfSx1cGRhdGVFbGVtZW50OmZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC52YWwodGhpcy5nZXRUaW1lKCkpLmNoYW5nZSgpfSx1cGRhdGVGcm9tRWxlbWVudFZhbDpmdW5jdGlvbigpe3RoaXMuc2V0VGltZSh0aGlzLiRlbGVtZW50LnZhbCgpKX0sdXBkYXRlV2lkZ2V0OmZ1bmN0aW9uKCl7aWYodGhpcy4kd2lkZ2V0IT09ITEpe3ZhciBhPXRoaXMuaG91cixiPTE9PT10aGlzLm1pbnV0ZS50b1N0cmluZygpLmxlbmd0aD9cIjBcIit0aGlzLm1pbnV0ZTp0aGlzLm1pbnV0ZSxjPTE9PT10aGlzLnNlY29uZC50b1N0cmluZygpLmxlbmd0aD9cIjBcIit0aGlzLnNlY29uZDp0aGlzLnNlY29uZDt0aGlzLnNob3dJbnB1dHM/KHRoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItaG91clwiKS52YWwoYSksdGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1taW51dGVcIikudmFsKGIpLHRoaXMuc2hvd1NlY29uZHMmJnRoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItc2Vjb25kXCIpLnZhbChjKSx0aGlzLnNob3dNZXJpZGlhbiYmdGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1tZXJpZGlhblwiKS52YWwodGhpcy5tZXJpZGlhbikpOih0aGlzLiR3aWRnZXQuZmluZChcInNwYW4uYm9vdHN0cmFwLXRpbWVwaWNrZXItaG91clwiKS50ZXh0KGEpLHRoaXMuJHdpZGdldC5maW5kKFwic3Bhbi5ib290c3RyYXAtdGltZXBpY2tlci1taW51dGVcIikudGV4dChiKSx0aGlzLnNob3dTZWNvbmRzJiZ0aGlzLiR3aWRnZXQuZmluZChcInNwYW4uYm9vdHN0cmFwLXRpbWVwaWNrZXItc2Vjb25kXCIpLnRleHQoYyksdGhpcy5zaG93TWVyaWRpYW4mJnRoaXMuJHdpZGdldC5maW5kKFwic3Bhbi5ib290c3RyYXAtdGltZXBpY2tlci1tZXJpZGlhblwiKS50ZXh0KHRoaXMubWVyaWRpYW4pKX19LHVwZGF0ZUZyb21XaWRnZXRJbnB1dHM6ZnVuY3Rpb24oKXtpZih0aGlzLiR3aWRnZXQhPT0hMSl7dmFyIGE9dGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1ob3VyXCIpLnZhbCgpK1wiOlwiK3RoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItbWludXRlXCIpLnZhbCgpKyh0aGlzLnNob3dTZWNvbmRzP1wiOlwiK3RoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItc2Vjb25kXCIpLnZhbCgpOlwiXCIpKyh0aGlzLnNob3dNZXJpZGlhbj90aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLW1lcmlkaWFuXCIpLnZhbCgpOlwiXCIpO3RoaXMuc2V0VGltZShhLCEwKX19LHdpZGdldENsaWNrOmZ1bmN0aW9uKGIpe2Iuc3RvcFByb3BhZ2F0aW9uKCksYi5wcmV2ZW50RGVmYXVsdCgpO3ZhciBjPWEoYi50YXJnZXQpLGQ9Yy5jbG9zZXN0KFwiYVwiKS5kYXRhKFwiYWN0aW9uXCIpO2QmJnRoaXNbZF0oKSx0aGlzLnVwZGF0ZSgpLGMuaXMoXCJpbnB1dFwiKSYmYy5nZXQoMCkuc2V0U2VsZWN0aW9uUmFuZ2UoMCwyKX0sd2lkZ2V0S2V5ZG93bjpmdW5jdGlvbihiKXt2YXIgYz1hKGIudGFyZ2V0KSxkPWMuYXR0cihcImNsYXNzXCIpLnJlcGxhY2UoXCJib290c3RyYXAtdGltZXBpY2tlci1cIixcIlwiKTtzd2l0Y2goYi53aGljaCl7Y2FzZSA5OmlmKGIuc2hpZnRLZXkpe2lmKFwiaG91clwiPT09ZClyZXR1cm4gdGhpcy5oaWRlV2lkZ2V0KCl9ZWxzZSBpZih0aGlzLnNob3dNZXJpZGlhbiYmXCJtZXJpZGlhblwiPT09ZHx8dGhpcy5zaG93U2Vjb25kcyYmXCJzZWNvbmRcIj09PWR8fCF0aGlzLnNob3dNZXJpZGlhbiYmIXRoaXMuc2hvd1NlY29uZHMmJlwibWludXRlXCI9PT1kKXJldHVybiB0aGlzLmhpZGVXaWRnZXQoKTticmVhaztjYXNlIDI3OnRoaXMuaGlkZVdpZGdldCgpO2JyZWFrO2Nhc2UgMzg6c3dpdGNoKGIucHJldmVudERlZmF1bHQoKSxkKXtjYXNlXCJob3VyXCI6dGhpcy5pbmNyZW1lbnRIb3VyKCk7YnJlYWs7Y2FzZVwibWludXRlXCI6dGhpcy5pbmNyZW1lbnRNaW51dGUoKTticmVhaztjYXNlXCJzZWNvbmRcIjp0aGlzLmluY3JlbWVudFNlY29uZCgpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy50b2dnbGVNZXJpZGlhbigpfXRoaXMuc2V0VGltZSh0aGlzLmdldFRpbWUoKSksYy5nZXQoMCkuc2V0U2VsZWN0aW9uUmFuZ2UoMCwyKTticmVhaztjYXNlIDQwOnN3aXRjaChiLnByZXZlbnREZWZhdWx0KCksZCl7Y2FzZVwiaG91clwiOnRoaXMuZGVjcmVtZW50SG91cigpO2JyZWFrO2Nhc2VcIm1pbnV0ZVwiOnRoaXMuZGVjcmVtZW50TWludXRlKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6dGhpcy5kZWNyZW1lbnRTZWNvbmQoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMudG9nZ2xlTWVyaWRpYW4oKX10aGlzLnNldFRpbWUodGhpcy5nZXRUaW1lKCkpLGMuZ2V0KDApLnNldFNlbGVjdGlvblJhbmdlKDAsMil9fSx3aWRnZXRLZXl1cDpmdW5jdGlvbihhKXsoNjU9PT1hLndoaWNofHw3Nz09PWEud2hpY2h8fDgwPT09YS53aGljaHx8NDY9PT1hLndoaWNofHw4PT09YS53aGljaHx8YS53aGljaD49NDgmJmEud2hpY2g8PTU3fHxhLndoaWNoPj05NiYmYS53aGljaDw9MTA1KSYmdGhpcy51cGRhdGVGcm9tV2lkZ2V0SW5wdXRzKCl9fSxhLmZuLnRpbWVwaWNrZXI9ZnVuY3Rpb24oYil7dmFyIGM9QXJyYXkuYXBwbHkobnVsbCxhcmd1bWVudHMpO3JldHVybiBjLnNoaWZ0KCksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShcInRpbWVwaWNrZXJcIiksZz1cIm9iamVjdFwiPT10eXBlb2YgYiYmYjtmfHxlLmRhdGEoXCJ0aW1lcGlja2VyXCIsZj1uZXcgZCh0aGlzLGEuZXh0ZW5kKHt9LGEuZm4udGltZXBpY2tlci5kZWZhdWx0cyxnLGEodGhpcykuZGF0YSgpKSkpLFwic3RyaW5nXCI9PXR5cGVvZiBiJiZmW2JdLmFwcGx5KGYsYyl9KX0sYS5mbi50aW1lcGlja2VyLmRlZmF1bHRzPXtkZWZhdWx0VGltZTpcImN1cnJlbnRcIixkaXNhYmxlRm9jdXM6ITEsZGlzYWJsZU1vdXNld2hlZWw6ITEsaXNPcGVuOiExLG1pbnV0ZVN0ZXA6MTUsbW9kYWxCYWNrZHJvcDohMSxvcmllbnRhdGlvbjp7eDpcImF1dG9cIix5OlwiYXV0b1wifSxzZWNvbmRTdGVwOjE1LHNuYXBUb1N0ZXA6ITEsc2hvd1NlY29uZHM6ITEsc2hvd0lucHV0czohMCxzaG93TWVyaWRpYW46ITAsdGVtcGxhdGU6XCJkcm9wZG93blwiLGFwcGVuZFdpZGdldFRvOlwiYm9keVwiLHNob3dXaWRnZXRPbkFkZG9uQ2xpY2s6ITAsaWNvbnM6e3VwOlwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXVwXCIsZG93bjpcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1kb3duXCJ9LG1heEhvdXJzOjI0LGV4cGxpY2l0TW9kZTohMX0sYS5mbi50aW1lcGlja2VyLkNvbnN0cnVjdG9yPWQsYShjKS5vbihcImZvY3VzLnRpbWVwaWNrZXIuZGF0YS1hcGkgY2xpY2sudGltZXBpY2tlci5kYXRhLWFwaVwiLCdbZGF0YS1wcm92aWRlPVwidGltZXBpY2tlclwiXScsZnVuY3Rpb24oYil7dmFyIGM9YSh0aGlzKTtjLmRhdGEoXCJ0aW1lcGlja2VyXCIpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLGMudGltZXBpY2tlcigpKX0pfShqUXVlcnksd2luZG93LGRvY3VtZW50KTsiXSwic291cmNlUm9vdCI6IiJ9