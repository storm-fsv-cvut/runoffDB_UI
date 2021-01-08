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

/***/ "./assets/dist/css/alt/adminlte.components.css":
/*!*****************************************************!*\
  !*** ./assets/dist/css/alt/adminlte.components.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/dist/css/alt/adminlte.extra-components.css":
/*!***********************************************************!*\
  !*** ./assets/dist/css/alt/adminlte.extra-components.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/dist/css/alt/adminlte.pages.css":
/*!************************************************!*\
  !*** ./assets/dist/css/alt/adminlte.pages.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/dist/css/alt/adminlte.plugins.css":
/*!**************************************************!*\
  !*** ./assets/dist/css/alt/adminlte.plugins.css ***!
  \**************************************************/
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

__webpack_require__(/*! ../dist/css/alt/adminlte.components.css */ "./assets/dist/css/alt/adminlte.components.css");

__webpack_require__(/*! ../dist/css/alt/adminlte.extra-components.css */ "./assets/dist/css/alt/adminlte.extra-components.css");

__webpack_require__(/*! ../dist/css/alt/adminlte.pages.css */ "./assets/dist/css/alt/adminlte.pages.css");

__webpack_require__(/*! ../dist/css/alt/adminlte.plugins.css */ "./assets/dist/css/alt/adminlte.plugins.css");

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
            $(tr).find('.related_value_X').val(data.data[i].related_value_X);
            $(tr).find('.related_value_Y').val(data.data[i].related_value_Y);
            $(tr).find('.related_value_Z').val(data.data[i].related_value_Z);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LmNhdGVnb3JpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnBpZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvSW9uaWNvbnMvY3NzL2lvbmljb25zLm1pbi5jc3M/OTlkZCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAtZGF0ZXBpY2tlci9kaXN0L2Nzcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uY3NzPzNlNjkiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwLWRhdGVwaWNrZXIvZGlzdC9qcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC10aGVtZS5taW4uY3NzP2Y2MmQiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzPzAxZDkiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9mb250LWF3ZXNvbWUvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzPzA1YjciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Nzcy9hcHAuY3NzPzM1Y2UiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL0FkbWluTFRFLm1pbi5jc3M/NWI0OCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZGlzdC9jc3MvYWx0L2FkbWlubHRlLmNvbXBvbmVudHMuY3NzPzdhYTAiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5leHRyYS1jb21wb25lbnRzLmNzcz82YmQ3Iiwid2VicGFjazovLy8uL2Fzc2V0cy9kaXN0L2Nzcy9hbHQvYWRtaW5sdGUucGFnZXMuY3NzP2QyOWYiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5wbHVnaW5zLmNzcz81YTlmIiwid2VicGFjazovLy8uL2Fzc2V0cy9kaXN0L2Nzcy9za2lucy9za2luLWJsdWUuY3NzP2VlNGUiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvanMvYWRtaW5sdGUubWluLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2N1c3RvbS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvcGx1Z2lucy9pQ2hlY2svYWxsLmNzcz81ZDJkIiwid2VicGFjazovLy8uL2Fzc2V0cy9wbHVnaW5zL2lDaGVjay9pY2hlY2subWluLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9wbHVnaW5zL3RpbWVwaWNrZXIvYm9vdHN0cmFwLXRpbWVwaWNrZXIubWluLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsIkVycm9yIiwiYSIsImIiLCJlYWNoIiwiZSIsImciLCJkYXRhIiwiYyIsImgiLCJleHRlbmQiLCJkIiwiZiIsInNvdXJjZSIsInBhcmFtcyIsInRyaWdnZXIiLCJjb250ZW50IiwibG9hZEluQ29udGVudCIsInJlc3BvbnNlVHlwZSIsIm92ZXJsYXlUZW1wbGF0ZSIsIm9uTG9hZFN0YXJ0Iiwib25Mb2FkRG9uZSIsImVsZW1lbnQiLCJvcHRpb25zIiwiJG92ZXJsYXkiLCJfc2V0VXBMaXN0ZW5lcnMiLCJsb2FkIiwicHJvdG90eXBlIiwiX2FkZE92ZXJsYXkiLCJjYWxsIiwiZ2V0IiwiZmluZCIsImh0bWwiLCJfcmVtb3ZlT3ZlcmxheSIsImJpbmQiLCJvbiIsInByZXZlbnREZWZhdWx0IiwiYXBwZW5kIiwicmVtb3ZlIiwiZm4iLCJib3hSZWZyZXNoIiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0Iiwid2luZG93IiwiYW5pbWF0aW9uU3BlZWQiLCJjb2xsYXBzZVRyaWdnZXIiLCJyZW1vdmVUcmlnZ2VyIiwiY29sbGFwc2VJY29uIiwiZXhwYW5kSWNvbiIsInJlbW92ZUljb24iLCJjb2xsYXBzZWQiLCJoZWFkZXIiLCJib2R5IiwiZm9vdGVyIiwidG9vbHMiLCJjb2xsYXBzaW5nIiwiZXhwYW5kaW5nIiwiZXhwYW5kZWQiLCJyZW1vdmluZyIsInJlbW92ZWQiLCJ0b2dnbGUiLCJpcyIsImV4cGFuZCIsImNvbGxhcHNlIiwiRXZlbnQiLCJyZW1vdmVDbGFzcyIsImNoaWxkcmVuIiwiYWRkQ2xhc3MiLCJzbGlkZURvd24iLCJzbGlkZVVwIiwiZXhwYW5kaW5nRXZlbnQiLCJpIiwiYm94V2lkZ2V0Iiwic2xpZGUiLCJzaWRlYmFyIiwib3BlbiIsImJnIiwid3JhcHBlciIsImJveGVkIiwiZml4ZWQiLCJoYXNCaW5kZWRSZXNpemUiLCJpbml0IiwiZml4IiwicmVzaXplIiwiX2ZpeEZvckJveGVkIiwiY3NzIiwicG9zaXRpb24iLCJoZWlnaHQiLCJjb250cm9sU2lkZWJhciIsImRvY3VtZW50IiwiYm94IiwicGFyZW50cyIsImZpcnN0IiwidG9nZ2xlQ2xhc3MiLCJkaXJlY3RDaGF0Iiwic2xpbXNjcm9sbCIsInJlc2V0SGVpZ2h0IiwiY29udGVudFdyYXBwZXIiLCJsYXlvdXRCb3hlZCIsIm1haW5Gb290ZXIiLCJtYWluSGVhZGVyIiwic2lkZWJhck1lbnUiLCJsb2dvIiwiaG9sZFRyYW5zaXRpb24iLCJiaW5kZWRSZXNpemUiLCJhY3RpdmF0ZSIsImZpeFNpZGViYXIiLCJvbmUiLCJvdXRlckhlaWdodCIsImhhc0NsYXNzIiwiaiIsInNsaW1TY3JvbGwiLCJkZXN0cm95IiwibGF5b3V0IiwiQ29uc3R1Y3RvciIsImNvbGxhcHNlU2NyZWVuU2l6ZSIsImV4cGFuZE9uSG92ZXIiLCJleHBhbmRUcmFuc2l0aW9uRGVsYXkiLCJtYWluU2lkZWJhciIsInNlYXJjaElucHV0IiwiYnV0dG9uIiwibWluaSIsImxheW91dEZpeGVkIiwiZXhwYW5kRmVhdHVyZSIsImNsaWNrIiwid2lkdGgiLCJjbG9zZSIsInN0b3BQcm9wYWdhdGlvbiIsImhvdmVyIiwic2V0VGltZW91dCIsInB1c2hNZW51Iiwib25DaGVjayIsIm9uVW5DaGVjayIsImRvbmUiLCJsaSIsInByb3AiLCJ1bkNoZWNrIiwiY2hlY2siLCJ0b2RvTGlzdCIsImFjY29yZGlvbiIsImZvbGxvd0xpbmsiLCJ0cmVlIiwidHJlZXZpZXciLCJ0cmVldmlld01lbnUiLCJhY3RpdmUiLCJuZXh0IiwicGFyZW50IiwiYXR0ciIsInNpYmxpbmdzIiwicmVxdWlyZSIsIiQiLCJyZWFkeSIsImRpc3BsYXkiLCJ0YWJsZSIsInJvd3MiLCJsZW5ndGgiLCJ0ciIsImNsb25lIiwidW5kZWZpbmVkIiwicmVwbGFjZSIsImFwcGVuZFRvIiwic2hvdyIsInBhcmVudE1vZGFsIiwidmFsIiwiaGlkZSIsInRleHQiLCJjaGFuZ2UiLCJldmVudCIsImNvbmZpcm0iLCJtb2RhbCIsIm5yIiwiRm9ybURhdGEiLCJmb3JtIiwiYWpheCIsInVybCIsInR5cGUiLCJwcm9jZXNzRGF0YSIsImNvbnRlbnRUeXBlIiwic3VjY2VzcyIsImVycm9yIiwiYWxlcnQiLCJpZCIsInNlbGVjdCIsImxhYmVsIiwibmFtZSIsImRhdGEyIiwidmFsdWUiLCJyZWxhdGVkX3ZhbHVlX1giLCJyZWxhdGVkX3ZhbHVlX1kiLCJyZWxhdGVkX3ZhbHVlX1oiLCJ0aW1lIiwiaWRzIiwicHVzaCIsImRyYXdDaGFydCIsInRvb2x0aXAiLCJpQ2hlY2siLCJjaGVja2JveENsYXNzIiwicmFkaW9DbGFzcyIsIm1ldGhvZCIsImNvbXBsZXRlIiwieGhyIiwic3RhdHVzIiwiZ29vZ2xlIiwidmlzdWFsaXphdGlvbiIsIkRhdGFUYWJsZSIsImNoYXJ0IiwiQ29tYm9DaGFydCIsImdldEVsZW1lbnRCeUlkIiwiYmFyIiwiZ3JvdXBXaWR0aCIsImN1cnZlVHlwZSIsInNlcmllc1R5cGUiLCJzZXJpZXMiLCJsZWdlbmQiLCJ2QXhlcyIsImRpcmVjdGlvbiIsInJlc3BvbnNlVGV4dCIsImpzb24iLCJyZXNwb25zZUpTT04iLCJhZGRDb2x1bW4iLCJ0YXJnZXRBeGlzSW5kZXgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJhZGRSb3dzIiwiZHJhdyIsImNsZWFyQ2hhcnQiLCJGIiwidGVzdCIsIm0iLCJzIiwibCIsIkgiLCJjaGVja2VkIiwiZGlzYWJsZWQiLCJpbmRldGVybWluYXRlIiwidyIsIkQiLCJ0IiwicCIsIm4iLCJ1IiwiQSIsIkIiLCJLIiwiRSIsImsiLCJ4IiwiTiIsIkMiLCJjbG9zZXN0IiwiciIsInEiLCJMIiwieSIsIkkiLCJ2IiwieiIsIk0iLCJvZmYiLCJ1bndyYXAiLCJHIiwiYWRkIiwibyIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJKIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJpc0Z1bmN0aW9uIiwiY2hlY2tlZENsYXNzIiwiZGlzYWJsZWRDbGFzcyIsImluZGV0ZXJtaW5hdGVDbGFzcyIsImxhYmVsSG92ZXIiLCJhcmlhIiwiaGFuZGxlIiwiaG92ZXJDbGFzcyIsImZvY3VzQ2xhc3MiLCJhY3RpdmVDbGFzcyIsImxhYmVsSG92ZXJDbGFzcyIsImluY3JlYXNlQXJlYSIsInRvcCIsImxlZnQiLCJtYXJnaW4iLCJwYWRkaW5nIiwiYmFja2dyb3VuZCIsImJvcmRlciIsIm9wYWNpdHkiLCJ2aXNpYmlsaXR5IiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwid3JhcCIsImluc2VydCIsImluaGVyaXRDbGFzcyIsImNsYXNzTmFtZSIsImluaGVyaXRJRCIsInRhcmdldCIsImtleUNvZGUiLCJaZXB0byIsIndpZGdldCIsIiRlbGVtZW50IiwiZGVmYXVsdFRpbWUiLCJkaXNhYmxlRm9jdXMiLCJkaXNhYmxlTW91c2V3aGVlbCIsImlzT3BlbiIsIm1pbnV0ZVN0ZXAiLCJtb2RhbEJhY2tkcm9wIiwib3JpZW50YXRpb24iLCJzZWNvbmRTdGVwIiwic25hcFRvU3RlcCIsInNob3dJbnB1dHMiLCJzaG93TWVyaWRpYW4iLCJzaG93U2Vjb25kcyIsInRlbXBsYXRlIiwiYXBwZW5kV2lkZ2V0VG8iLCJzaG93V2lkZ2V0T25BZGRvbkNsaWNrIiwiaWNvbnMiLCJtYXhIb3VycyIsImV4cGxpY2l0TW9kZSIsImhhbmRsZURvY3VtZW50Q2xpY2siLCJzY29wZSIsIiR3aWRnZXQiLCJoaWRlV2lkZ2V0IiwiX2luaXQiLCJjb25zdHJ1Y3RvciIsInByb3h5Iiwic2hvd1dpZGdldCIsImhpZ2hsaWdodFVuaXQiLCJlbGVtZW50S2V5ZG93biIsImJsdXJFbGVtZW50IiwibW91c2V3aGVlbCIsImdldFRlbXBsYXRlIiwid2lkZ2V0Q2xpY2siLCJ3aWRnZXRLZXlkb3duIiwid2lkZ2V0S2V5dXAiLCJzZXREZWZhdWx0VGltZSIsImhpZ2hsaWdodGVkVW5pdCIsInVwZGF0ZUZyb21FbGVtZW50VmFsIiwiY2xlYXIiLCJob3VyIiwibWludXRlIiwic2Vjb25kIiwibWVyaWRpYW4iLCJkZWNyZW1lbnRIb3VyIiwidG9nZ2xlTWVyaWRpYW4iLCJkZWNyZW1lbnRNaW51dGUiLCJkZWNyZW1lbnRTZWNvbmQiLCJ3aGljaCIsInNoaWZ0S2V5IiwiaGlnaGxpZ2h0UHJldlVuaXQiLCJoaWdobGlnaHROZXh0VW5pdCIsImluY3JlbWVudEhvdXIiLCJoaWdobGlnaHRIb3VyIiwiaW5jcmVtZW50TWludXRlIiwiaGlnaGxpZ2h0TWludXRlIiwiaW5jcmVtZW50U2Vjb25kIiwiaGlnaGxpZ2h0U2Vjb25kIiwiaGlnaGxpZ2h0TWVyaWRpYW4iLCJ1cGRhdGUiLCJnZXRDdXJzb3JQb3NpdGlvbiIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uIiwiZm9jdXMiLCJjcmVhdGVSYW5nZSIsIm1vdmVTdGFydCIsInVwIiwiZG93biIsImdldFRpbWUiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmRzIiwiZGV0YWNoIiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJvcmlnaW5hbEV2ZW50Iiwid2hlZWxEZWx0YSIsImRldGFpbCIsInNjcm9sbFRvcCIsImNoYW5nZVRvTmVhcmVzdFN0ZXAiLCJyb3VuZCIsInBsYWNlIiwiaXNJbmxpbmUiLCJvdXRlcldpZHRoIiwicGFyc2VJbnQiLCJmaWx0ZXIiLCJjb21wb25lbnQiLCJvZmZzZXQiLCJtYXgiLCJ6SW5kZXgiLCJ0aW1lcGlja2VyIiwiRGF0ZSIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImdldFNlY29uZHMiLCJjZWlsIiwic2V0VGltZSIsImdldE1vbnRoIiwic3BsaXQiLCJpc05hTiIsImJsdXIiLCJ1cGRhdGVFbGVtZW50IiwidXBkYXRlV2lkZ2V0IiwidXBkYXRlRnJvbVdpZGdldElucHV0cyIsIkFycmF5IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJzaGlmdCIsImRlZmF1bHRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQkFBK0IsU0FBUyxxQkFBcUIsRUFBRTs7QUFFL0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQyxtQkFBbUI7QUFDbkQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0Qjs7QUFFNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7QUMvbEdEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7Ozs7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UjtBQUFrUkMsU0FBSyxFQUFDO0FBQUNpRCxRQUFFLEVBQUMsZ0NBQUo7QUFBcUNDLFVBQUksRUFBQztBQUExQyxLQUF4UjtBQUFzV2pELFlBQVEsRUFBQyxFQUEvVztBQUFrWEMsZ0JBQVksRUFBQyxDQUFDO0FBQWhZLEdBQWpxaEIsRUFBb2lpQjdULENBQUMsQ0FBQ3FDLEVBQUYsQ0FBSzhWLFVBQUwsQ0FBZ0I1VixXQUFoQixHQUE0QjlCLENBQWhraUIsRUFBa2tpQlQsQ0FBQyxDQUFDTSxDQUFELENBQUQsQ0FBSzJCLEVBQUwsQ0FBUSxxREFBUixFQUE4RCw2QkFBOUQsRUFBNEYsVUFBU2hDLENBQVQsRUFBVztBQUFDLFFBQUlLLENBQUMsR0FBQ04sQ0FBQyxDQUFDLElBQUQsQ0FBUDtBQUFjTSxLQUFDLENBQUNELElBQUYsQ0FBTyxZQUFQLE1BQXVCSixDQUFDLENBQUNpQyxjQUFGLElBQW1CNUIsQ0FBQyxDQUFDNlgsVUFBRixFQUExQztBQUEwRCxHQUFoTCxDQUFsa2lCO0FBQW92aUIsQ0FBdmprQixDQUF3amtCclksTUFBeGprQixFQUEramtCMkMsTUFBL2prQixFQUFza2tCOEMsUUFBdGtrQixDQUFELEMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogRmxvdCBwbHVnaW4gZm9yIHBsb3R0aW5nIHRleHR1YWwgZGF0YSBvciBjYXRlZ29yaWVzLlxuXG5Db3B5cmlnaHQgKGMpIDIwMDctMjAxNCBJT0xBIGFuZCBPbGUgTGF1cnNlbi5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuQ29uc2lkZXIgYSBkYXRhc2V0IGxpa2UgW1tcIkZlYnJ1YXJ5XCIsIDM0XSwgW1wiTWFyY2hcIiwgMjBdLCAuLi5dLiBUaGlzIHBsdWdpblxuYWxsb3dzIHlvdSB0byBwbG90IHN1Y2ggYSBkYXRhc2V0IGRpcmVjdGx5LlxuXG5UbyBlbmFibGUgaXQsIHlvdSBtdXN0IHNwZWNpZnkgbW9kZTogXCJjYXRlZ29yaWVzXCIgb24gdGhlIGF4aXMgd2l0aCB0aGUgdGV4dHVhbFxubGFiZWxzLCBlLmcuXG5cblx0JC5wbG90KFwiI3BsYWNlaG9sZGVyXCIsIGRhdGEsIHsgeGF4aXM6IHsgbW9kZTogXCJjYXRlZ29yaWVzXCIgfSB9KTtcblxuQnkgZGVmYXVsdCwgdGhlIGxhYmVscyBhcmUgb3JkZXJlZCBhcyB0aGV5IGFyZSBtZXQgaW4gdGhlIGRhdGEgc2VyaWVzLiBJZiB5b3Vcbm5lZWQgYSBkaWZmZXJlbnQgb3JkZXJpbmcsIHlvdSBjYW4gc3BlY2lmeSBcImNhdGVnb3JpZXNcIiBvbiB0aGUgYXhpcyBvcHRpb25zXG5hbmQgbGlzdCB0aGUgY2F0ZWdvcmllcyB0aGVyZTpcblxuXHR4YXhpczoge1xuXHRcdG1vZGU6IFwiY2F0ZWdvcmllc1wiLFxuXHRcdGNhdGVnb3JpZXM6IFtcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiXVxuXHR9XG5cbklmIHlvdSBuZWVkIHRvIGN1c3RvbWl6ZSB0aGUgZGlzdGFuY2VzIGJldHdlZW4gdGhlIGNhdGVnb3JpZXMsIHlvdSBjYW4gc3BlY2lmeVxuXCJjYXRlZ29yaWVzXCIgYXMgYW4gb2JqZWN0IG1hcHBpbmcgbGFiZWxzIHRvIHZhbHVlc1xuXG5cdHhheGlzOiB7XG5cdFx0bW9kZTogXCJjYXRlZ29yaWVzXCIsXG5cdFx0Y2F0ZWdvcmllczogeyBcIkZlYnJ1YXJ5XCI6IDEsIFwiTWFyY2hcIjogMywgXCJBcHJpbFwiOiA0IH1cblx0fVxuXG5JZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhbGwgY2F0ZWdvcmllcywgdGhlIHJlbWFpbmluZyBjYXRlZ29yaWVzIHdpbGwgYmUgbnVtYmVyZWRcbmZyb20gdGhlIG1heCB2YWx1ZSBwbHVzIDEgKHdpdGggYSBzcGFjaW5nIG9mIDEgYmV0d2VlbiBlYWNoKS5cblxuSW50ZXJuYWxseSwgdGhlIHBsdWdpbiB3b3JrcyBieSB0cmFuc2Zvcm1pbmcgdGhlIGlucHV0IGRhdGEgdGhyb3VnaCBhbiBhdXRvLVxuZ2VuZXJhdGVkIG1hcHBpbmcgd2hlcmUgdGhlIGZpcnN0IGNhdGVnb3J5IGJlY29tZXMgMCwgdGhlIHNlY29uZCAxLCBldGMuXG5IZW5jZSwgYSBwb2ludCBsaWtlIFtcIkZlYnJ1YXJ5XCIsIDM0XSBiZWNvbWVzIFswLCAzNF0gaW50ZXJuYWxseSBpbiBGbG90ICh0aGlzXG5pcyB2aXNpYmxlIGluIGhvdmVyIGFuZCBjbGljayBldmVudHMgdGhhdCByZXR1cm4gbnVtYmVycyByYXRoZXIgdGhhbiB0aGVcbmNhdGVnb3J5IGxhYmVscykuIFRoZSBwbHVnaW4gYWxzbyBvdmVycmlkZXMgdGhlIHRpY2sgZ2VuZXJhdG9yIHRvIHNwaXQgb3V0IHRoZVxuY2F0ZWdvcmllcyBhcyB0aWNrcyBpbnN0ZWFkIG9mIHRoZSB2YWx1ZXMuXG5cbklmIHlvdSBuZWVkIHRvIG1hcCBhIHZhbHVlIGJhY2sgdG8gaXRzIGxhYmVsLCB0aGUgbWFwcGluZyBpcyBhbHdheXMgYWNjZXNzaWJsZVxuYXMgXCJjYXRlZ29yaWVzXCIgb24gdGhlIGF4aXMgb2JqZWN0LCBlLmcuIHBsb3QuZ2V0QXhlcygpLnhheGlzLmNhdGVnb3JpZXMuXG5cbiovXG5cbihmdW5jdGlvbiAoJCkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB4YXhpczoge1xuICAgICAgICAgICAgY2F0ZWdvcmllczogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB5YXhpczoge1xuICAgICAgICAgICAgY2F0ZWdvcmllczogbnVsbFxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBmdW5jdGlvbiBwcm9jZXNzUmF3RGF0YShwbG90LCBzZXJpZXMsIGRhdGEsIGRhdGFwb2ludHMpIHtcbiAgICAgICAgLy8gaWYgY2F0ZWdvcmllcyBhcmUgZW5hYmxlZCwgd2UgbmVlZCB0byBkaXNhYmxlXG4gICAgICAgIC8vIGF1dG8tdHJhbnNmb3JtYXRpb24gdG8gbnVtYmVycyBzbyB0aGUgc3RyaW5ncyBhcmUgaW50YWN0XG4gICAgICAgIC8vIGZvciBsYXRlciBwcm9jZXNzaW5nXG5cbiAgICAgICAgdmFyIHhDYXRlZ29yaWVzID0gc2VyaWVzLnhheGlzLm9wdGlvbnMubW9kZSA9PSBcImNhdGVnb3JpZXNcIixcbiAgICAgICAgICAgIHlDYXRlZ29yaWVzID0gc2VyaWVzLnlheGlzLm9wdGlvbnMubW9kZSA9PSBcImNhdGVnb3JpZXNcIjtcbiAgICAgICAgXG4gICAgICAgIGlmICghKHhDYXRlZ29yaWVzIHx8IHlDYXRlZ29yaWVzKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgZm9ybWF0ID0gZGF0YXBvaW50cy5mb3JtYXQ7XG5cbiAgICAgICAgaWYgKCFmb3JtYXQpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FOiBhdXRvLWRldGVjdGlvbiBzaG91bGQgcmVhbGx5IG5vdCBiZSBkZWZpbmVkIGhlcmVcbiAgICAgICAgICAgIHZhciBzID0gc2VyaWVzO1xuICAgICAgICAgICAgZm9ybWF0ID0gW107XG4gICAgICAgICAgICBmb3JtYXQucHVzaCh7IHg6IHRydWUsIG51bWJlcjogdHJ1ZSwgcmVxdWlyZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICBmb3JtYXQucHVzaCh7IHk6IHRydWUsIG51bWJlcjogdHJ1ZSwgcmVxdWlyZWQ6IHRydWUgfSk7XG5cbiAgICAgICAgICAgIGlmIChzLmJhcnMuc2hvdyB8fCAocy5saW5lcy5zaG93ICYmIHMubGluZXMuZmlsbCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXV0b3NjYWxlID0gISEoKHMuYmFycy5zaG93ICYmIHMuYmFycy56ZXJvKSB8fCAocy5saW5lcy5zaG93ICYmIHMubGluZXMuemVybykpO1xuICAgICAgICAgICAgICAgIGZvcm1hdC5wdXNoKHsgeTogdHJ1ZSwgbnVtYmVyOiB0cnVlLCByZXF1aXJlZDogZmFsc2UsIGRlZmF1bHRWYWx1ZTogMCwgYXV0b3NjYWxlOiBhdXRvc2NhbGUgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHMuYmFycy5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtYXRbZm9ybWF0Lmxlbmd0aCAtIDFdLnk7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdFtmb3JtYXQubGVuZ3RoIC0gMV0ueCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBkYXRhcG9pbnRzLmZvcm1hdCA9IGZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgZm9ybWF0Lmxlbmd0aDsgKyttKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0W21dLnggJiYgeENhdGVnb3JpZXMpXG4gICAgICAgICAgICAgICAgZm9ybWF0W21dLm51bWJlciA9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZm9ybWF0W21dLnkgJiYgeUNhdGVnb3JpZXMpXG4gICAgICAgICAgICAgICAgZm9ybWF0W21dLm51bWJlciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TmV4dEluZGV4KGNhdGVnb3JpZXMpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciB2IGluIGNhdGVnb3JpZXMpXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcmllc1t2XSA+IGluZGV4KVxuICAgICAgICAgICAgICAgIGluZGV4ID0gY2F0ZWdvcmllc1t2XTtcblxuICAgICAgICByZXR1cm4gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhdGVnb3JpZXNUaWNrR2VuZXJhdG9yKGF4aXMpIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBsYWJlbCBpbiBheGlzLmNhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIHZhciB2ID0gYXhpcy5jYXRlZ29yaWVzW2xhYmVsXTtcbiAgICAgICAgICAgIGlmICh2ID49IGF4aXMubWluICYmIHYgPD0gYXhpcy5tYXgpXG4gICAgICAgICAgICAgICAgcmVzLnB1c2goW3YsIGxhYmVsXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXMuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF07IH0pO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHNldHVwQ2F0ZWdvcmllc0ZvckF4aXMoc2VyaWVzLCBheGlzLCBkYXRhcG9pbnRzKSB7XG4gICAgICAgIGlmIChzZXJpZXNbYXhpc10ub3B0aW9ucy5tb2RlICE9IFwiY2F0ZWdvcmllc1wiKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFzZXJpZXNbYXhpc10uY2F0ZWdvcmllcykge1xuICAgICAgICAgICAgLy8gcGFyc2Ugb3B0aW9uc1xuICAgICAgICAgICAgdmFyIGMgPSB7fSwgbyA9IHNlcmllc1theGlzXS5vcHRpb25zLmNhdGVnb3JpZXMgfHwge307XG4gICAgICAgICAgICBpZiAoJC5pc0FycmF5KG8pKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgICAgICBjW29baV1dID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHYgaW4gbylcbiAgICAgICAgICAgICAgICAgICAgY1t2XSA9IG9bdl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlcmllc1theGlzXS5jYXRlZ29yaWVzID0gYztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpeCB0aWNrc1xuICAgICAgICBpZiAoIXNlcmllc1theGlzXS5vcHRpb25zLnRpY2tzKVxuICAgICAgICAgICAgc2VyaWVzW2F4aXNdLm9wdGlvbnMudGlja3MgPSBjYXRlZ29yaWVzVGlja0dlbmVyYXRvcjtcblxuICAgICAgICB0cmFuc2Zvcm1Qb2ludHNPbkF4aXMoZGF0YXBvaW50cywgYXhpcywgc2VyaWVzW2F4aXNdLmNhdGVnb3JpZXMpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1Qb2ludHNPbkF4aXMoZGF0YXBvaW50cywgYXhpcywgY2F0ZWdvcmllcykge1xuICAgICAgICAvLyBnbyB0aHJvdWdoIHRoZSBwb2ludHMsIHRyYW5zZm9ybWluZyB0aGVtXG4gICAgICAgIHZhciBwb2ludHMgPSBkYXRhcG9pbnRzLnBvaW50cyxcbiAgICAgICAgICAgIHBzID0gZGF0YXBvaW50cy5wb2ludHNpemUsXG4gICAgICAgICAgICBmb3JtYXQgPSBkYXRhcG9pbnRzLmZvcm1hdCxcbiAgICAgICAgICAgIGZvcm1hdENvbHVtbiA9IGF4aXMuY2hhckF0KDApLFxuICAgICAgICAgICAgaW5kZXggPSBnZXROZXh0SW5kZXgoY2F0ZWdvcmllcyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IHBzKSB7XG4gICAgICAgICAgICBpZiAocG9pbnRzW2ldID09IG51bGwpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgcHM7ICsrbSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBwb2ludHNbaSArIG1dO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsIHx8ICFmb3JtYXRbbV1bZm9ybWF0Q29sdW1uXSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBpZiAoISh2YWwgaW4gY2F0ZWdvcmllcykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcmllc1t2YWxdID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBvaW50c1tpICsgbV0gPSBjYXRlZ29yaWVzW3ZhbF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzRGF0YXBvaW50cyhwbG90LCBzZXJpZXMsIGRhdGFwb2ludHMpIHtcbiAgICAgICAgc2V0dXBDYXRlZ29yaWVzRm9yQXhpcyhzZXJpZXMsIFwieGF4aXNcIiwgZGF0YXBvaW50cyk7XG4gICAgICAgIHNldHVwQ2F0ZWdvcmllc0ZvckF4aXMoc2VyaWVzLCBcInlheGlzXCIsIGRhdGFwb2ludHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXQocGxvdCkge1xuICAgICAgICBwbG90Lmhvb2tzLnByb2Nlc3NSYXdEYXRhLnB1c2gocHJvY2Vzc1Jhd0RhdGEpO1xuICAgICAgICBwbG90Lmhvb2tzLnByb2Nlc3NEYXRhcG9pbnRzLnB1c2gocHJvY2Vzc0RhdGFwb2ludHMpO1xuICAgIH1cbiAgICBcbiAgICAkLnBsb3QucGx1Z2lucy5wdXNoKHtcbiAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgbmFtZTogJ2NhdGVnb3JpZXMnLFxuICAgICAgICB2ZXJzaW9uOiAnMS4wJ1xuICAgIH0pO1xufSkoalF1ZXJ5KTtcbiIsIi8qIEphdmFzY3JpcHQgcGxvdHRpbmcgbGlicmFyeSBmb3IgalF1ZXJ5LCB2ZXJzaW9uIDAuOC4zLlxuXG5Db3B5cmlnaHQgKGMpIDIwMDctMjAxNCBJT0xBIGFuZCBPbGUgTGF1cnNlbi5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKi9cblxuLy8gZmlyc3QgYW4gaW5saW5lIGRlcGVuZGVuY3ksIGpxdWVyeS5jb2xvcmhlbHBlcnMuanMsIHdlIGlubGluZSBpdCBoZXJlXG4vLyBmb3IgY29udmVuaWVuY2VcblxuLyogUGx1Z2luIGZvciBqUXVlcnkgZm9yIHdvcmtpbmcgd2l0aCBjb2xvcnMuXG4gKlxuICogVmVyc2lvbiAxLjEuXG4gKlxuICogSW5zcGlyYXRpb24gZnJvbSBqUXVlcnkgY29sb3IgYW5pbWF0aW9uIHBsdWdpbiBieSBKb2huIFJlc2lnLlxuICpcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBieSBPbGUgTGF1cnNlbiwgT2N0b2JlciAyMDA5LlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgJC5jb2xvci5wYXJzZShcIiNmZmZcIikuc2NhbGUoJ3JnYicsIDAuMjUpLmFkZCgnYScsIC0wLjUpLnRvU3RyaW5nKClcbiAqICAgdmFyIGMgPSAkLmNvbG9yLmV4dHJhY3QoJChcIiNteWRpdlwiKSwgJ2JhY2tncm91bmQtY29sb3InKTtcbiAqICAgY29uc29sZS5sb2coYy5yLCBjLmcsIGMuYiwgYy5hKTtcbiAqICAgJC5jb2xvci5tYWtlKDEwMCwgNTAsIDI1LCAwLjQpLnRvU3RyaW5nKCkgLy8gcmV0dXJucyBcInJnYmEoMTAwLDUwLDI1LDAuNClcIlxuICpcbiAqIE5vdGUgdGhhdCAuc2NhbGUoKSBhbmQgLmFkZCgpIHJldHVybiB0aGUgc2FtZSBtb2RpZmllZCBvYmplY3RcbiAqIGluc3RlYWQgb2YgbWFraW5nIGEgbmV3IG9uZS5cbiAqXG4gKiBWLiAxLjE6IEZpeCBlcnJvciBoYW5kbGluZyBzbyBlLmcuIHBhcnNpbmcgYW4gZW1wdHkgc3RyaW5nIGRvZXNcbiAqIHByb2R1Y2UgYSBjb2xvciByYXRoZXIgdGhhbiBqdXN0IGNyYXNoaW5nLlxuICovXG4oZnVuY3Rpb24oJCl7JC5jb2xvcj17fTskLmNvbG9yLm1ha2U9ZnVuY3Rpb24ocixnLGIsYSl7dmFyIG89e307by5yPXJ8fDA7by5nPWd8fDA7by5iPWJ8fDA7by5hPWEhPW51bGw/YToxO28uYWRkPWZ1bmN0aW9uKGMsZCl7Zm9yKHZhciBpPTA7aTxjLmxlbmd0aDsrK2kpb1tjLmNoYXJBdChpKV0rPWQ7cmV0dXJuIG8ubm9ybWFsaXplKCl9O28uc2NhbGU9ZnVuY3Rpb24oYyxmKXtmb3IodmFyIGk9MDtpPGMubGVuZ3RoOysraSlvW2MuY2hhckF0KGkpXSo9ZjtyZXR1cm4gby5ub3JtYWxpemUoKX07by50b1N0cmluZz1mdW5jdGlvbigpe2lmKG8uYT49MSl7cmV0dXJuXCJyZ2IoXCIrW28ucixvLmcsby5iXS5qb2luKFwiLFwiKStcIilcIn1lbHNle3JldHVyblwicmdiYShcIitbby5yLG8uZyxvLmIsby5hXS5qb2luKFwiLFwiKStcIilcIn19O28ubm9ybWFsaXplPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gY2xhbXAobWluLHZhbHVlLG1heCl7cmV0dXJuIHZhbHVlPG1pbj9taW46dmFsdWU+bWF4P21heDp2YWx1ZX1vLnI9Y2xhbXAoMCxwYXJzZUludChvLnIpLDI1NSk7by5nPWNsYW1wKDAscGFyc2VJbnQoby5nKSwyNTUpO28uYj1jbGFtcCgwLHBhcnNlSW50KG8uYiksMjU1KTtvLmE9Y2xhbXAoMCxvLmEsMSk7cmV0dXJuIG99O28uY2xvbmU9ZnVuY3Rpb24oKXtyZXR1cm4gJC5jb2xvci5tYWtlKG8ucixvLmIsby5nLG8uYSl9O3JldHVybiBvLm5vcm1hbGl6ZSgpfTskLmNvbG9yLmV4dHJhY3Q9ZnVuY3Rpb24oZWxlbSxjc3Mpe3ZhciBjO2Rve2M9ZWxlbS5jc3MoY3NzKS50b0xvd2VyQ2FzZSgpO2lmKGMhPVwiXCImJmMhPVwidHJhbnNwYXJlbnRcIilicmVhaztlbGVtPWVsZW0ucGFyZW50KCl9d2hpbGUoZWxlbS5sZW5ndGgmJiEkLm5vZGVOYW1lKGVsZW0uZ2V0KDApLFwiYm9keVwiKSk7aWYoYz09XCJyZ2JhKDAsIDAsIDAsIDApXCIpYz1cInRyYW5zcGFyZW50XCI7cmV0dXJuICQuY29sb3IucGFyc2UoYyl9OyQuY29sb3IucGFyc2U9ZnVuY3Rpb24oc3RyKXt2YXIgcmVzLG09JC5jb2xvci5tYWtlO2lmKHJlcz0vcmdiXFwoXFxzKihbMC05XXsxLDN9KVxccyosXFxzKihbMC05XXsxLDN9KVxccyosXFxzKihbMC05XXsxLDN9KVxccypcXCkvLmV4ZWMoc3RyKSlyZXR1cm4gbShwYXJzZUludChyZXNbMV0sMTApLHBhcnNlSW50KHJlc1syXSwxMCkscGFyc2VJbnQocmVzWzNdLDEwKSk7aWYocmVzPS9yZ2JhXFwoXFxzKihbMC05XXsxLDN9KVxccyosXFxzKihbMC05XXsxLDN9KVxccyosXFxzKihbMC05XXsxLDN9KVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXHMqXFwpLy5leGVjKHN0cikpcmV0dXJuIG0ocGFyc2VJbnQocmVzWzFdLDEwKSxwYXJzZUludChyZXNbMl0sMTApLHBhcnNlSW50KHJlc1szXSwxMCkscGFyc2VGbG9hdChyZXNbNF0pKTtpZihyZXM9L3JnYlxcKFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqXFwpLy5leGVjKHN0cikpcmV0dXJuIG0ocGFyc2VGbG9hdChyZXNbMV0pKjIuNTUscGFyc2VGbG9hdChyZXNbMl0pKjIuNTUscGFyc2VGbG9hdChyZXNbM10pKjIuNTUpO2lmKHJlcz0vcmdiYVxcKFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqLFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFxzKlxcKS8uZXhlYyhzdHIpKXJldHVybiBtKHBhcnNlRmxvYXQocmVzWzFdKSoyLjU1LHBhcnNlRmxvYXQocmVzWzJdKSoyLjU1LHBhcnNlRmxvYXQocmVzWzNdKSoyLjU1LHBhcnNlRmxvYXQocmVzWzRdKSk7aWYocmVzPS8jKFthLWZBLUYwLTldezJ9KShbYS1mQS1GMC05XXsyfSkoW2EtZkEtRjAtOV17Mn0pLy5leGVjKHN0cikpcmV0dXJuIG0ocGFyc2VJbnQocmVzWzFdLDE2KSxwYXJzZUludChyZXNbMl0sMTYpLHBhcnNlSW50KHJlc1szXSwxNikpO2lmKHJlcz0vIyhbYS1mQS1GMC05XSkoW2EtZkEtRjAtOV0pKFthLWZBLUYwLTldKS8uZXhlYyhzdHIpKXJldHVybiBtKHBhcnNlSW50KHJlc1sxXStyZXNbMV0sMTYpLHBhcnNlSW50KHJlc1syXStyZXNbMl0sMTYpLHBhcnNlSW50KHJlc1szXStyZXNbM10sMTYpKTt2YXIgbmFtZT0kLnRyaW0oc3RyKS50b0xvd2VyQ2FzZSgpO2lmKG5hbWU9PVwidHJhbnNwYXJlbnRcIilyZXR1cm4gbSgyNTUsMjU1LDI1NSwwKTtlbHNle3Jlcz1sb29rdXBDb2xvcnNbbmFtZV18fFswLDAsMF07cmV0dXJuIG0ocmVzWzBdLHJlc1sxXSxyZXNbMl0pfX07dmFyIGxvb2t1cENvbG9ycz17YXF1YTpbMCwyNTUsMjU1XSxhenVyZTpbMjQwLDI1NSwyNTVdLGJlaWdlOlsyNDUsMjQ1LDIyMF0sYmxhY2s6WzAsMCwwXSxibHVlOlswLDAsMjU1XSxicm93bjpbMTY1LDQyLDQyXSxjeWFuOlswLDI1NSwyNTVdLGRhcmtibHVlOlswLDAsMTM5XSxkYXJrY3lhbjpbMCwxMzksMTM5XSxkYXJrZ3JleTpbMTY5LDE2OSwxNjldLGRhcmtncmVlbjpbMCwxMDAsMF0sZGFya2toYWtpOlsxODksMTgzLDEwN10sZGFya21hZ2VudGE6WzEzOSwwLDEzOV0sZGFya29saXZlZ3JlZW46Wzg1LDEwNyw0N10sZGFya29yYW5nZTpbMjU1LDE0MCwwXSxkYXJrb3JjaGlkOlsxNTMsNTAsMjA0XSxkYXJrcmVkOlsxMzksMCwwXSxkYXJrc2FsbW9uOlsyMzMsMTUwLDEyMl0sZGFya3Zpb2xldDpbMTQ4LDAsMjExXSxmdWNoc2lhOlsyNTUsMCwyNTVdLGdvbGQ6WzI1NSwyMTUsMF0sZ3JlZW46WzAsMTI4LDBdLGluZGlnbzpbNzUsMCwxMzBdLGtoYWtpOlsyNDAsMjMwLDE0MF0sbGlnaHRibHVlOlsxNzMsMjE2LDIzMF0sbGlnaHRjeWFuOlsyMjQsMjU1LDI1NV0sbGlnaHRncmVlbjpbMTQ0LDIzOCwxNDRdLGxpZ2h0Z3JleTpbMjExLDIxMSwyMTFdLGxpZ2h0cGluazpbMjU1LDE4MiwxOTNdLGxpZ2h0eWVsbG93OlsyNTUsMjU1LDIyNF0sbGltZTpbMCwyNTUsMF0sbWFnZW50YTpbMjU1LDAsMjU1XSxtYXJvb246WzEyOCwwLDBdLG5hdnk6WzAsMCwxMjhdLG9saXZlOlsxMjgsMTI4LDBdLG9yYW5nZTpbMjU1LDE2NSwwXSxwaW5rOlsyNTUsMTkyLDIwM10scHVycGxlOlsxMjgsMCwxMjhdLHZpb2xldDpbMTI4LDAsMTI4XSxyZWQ6WzI1NSwwLDBdLHNpbHZlcjpbMTkyLDE5MiwxOTJdLHdoaXRlOlsyNTUsMjU1LDI1NV0seWVsbG93OlsyNTUsMjU1LDBdfX0pKGpRdWVyeSk7XG5cbi8vIHRoZSBhY3R1YWwgRmxvdCBjb2RlXG4oZnVuY3Rpb24oJCkge1xuXG5cdC8vIENhY2hlIHRoZSBwcm90b3R5cGUgaGFzT3duUHJvcGVydHkgZm9yIGZhc3RlciBhY2Nlc3NcblxuXHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gICAgLy8gQSBzaGltIHRvIHByb3ZpZGUgJ2RldGFjaCcgdG8galF1ZXJ5IHZlcnNpb25zIHByaW9yIHRvIDEuNC4gIFVzaW5nIGEgRE9NXG4gICAgLy8gb3BlcmF0aW9uIHByb2R1Y2VzIHRoZSBzYW1lIGVmZmVjdCBhcyBkZXRhY2gsIGkuZS4gcmVtb3ZpbmcgdGhlIGVsZW1lbnRcbiAgICAvLyB3aXRob3V0IHRvdWNoaW5nIGl0cyBqUXVlcnkgZGF0YS5cblxuICAgIC8vIERvIG5vdCBtZXJnZSB0aGlzIGludG8gRmxvdCAwLjksIHNpbmNlIGl0IHJlcXVpcmVzIGpRdWVyeSAxLjQuNCsuXG5cbiAgICBpZiAoISQuZm4uZGV0YWNoKSB7XG4gICAgICAgICQuZm4uZGV0YWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCB0aGlzICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLyBUaGUgQ2FudmFzIG9iamVjdCBpcyBhIHdyYXBwZXIgYXJvdW5kIGFuIEhUTUw1IDxjYW52YXM+IHRhZy5cblx0Ly9cblx0Ly8gQGNvbnN0cnVjdG9yXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSBjbHMgTGlzdCBvZiBjbGFzc2VzIHRvIGFwcGx5IHRvIHRoZSBjYW52YXMuXG5cdC8vIEBwYXJhbSB7ZWxlbWVudH0gY29udGFpbmVyIEVsZW1lbnQgb250byB3aGljaCB0byBhcHBlbmQgdGhlIGNhbnZhcy5cblx0Ly9cblx0Ly8gUmVxdWlyaW5nIGEgY29udGFpbmVyIGlzIGEgbGl0dGxlIGlmZnksIGJ1dCB1bmZvcnR1bmF0ZWx5IGNhbnZhc1xuXHQvLyBvcGVyYXRpb25zIGRvbid0IHdvcmsgdW5sZXNzIHRoZSBjYW52YXMgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS5cblxuXHRmdW5jdGlvbiBDYW52YXMoY2xzLCBjb250YWluZXIpIHtcblxuXHRcdHZhciBlbGVtZW50ID0gY29udGFpbmVyLmNoaWxkcmVuKFwiLlwiICsgY2xzKVswXTtcblxuXHRcdGlmIChlbGVtZW50ID09IG51bGwpIHtcblxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdFx0XHRlbGVtZW50LmNsYXNzTmFtZSA9IGNscztcblxuXHRcdFx0JChlbGVtZW50KS5jc3MoeyBkaXJlY3Rpb246IFwibHRyXCIsIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGxlZnQ6IDAsIHRvcDogMCB9KVxuXHRcdFx0XHQuYXBwZW5kVG8oY29udGFpbmVyKTtcblxuXHRcdFx0Ly8gSWYgSFRNTDUgQ2FudmFzIGlzbid0IGF2YWlsYWJsZSwgZmFsbCBiYWNrIHRvIFtFeHxGbGFzaF1jYW52YXNcblxuXHRcdFx0aWYgKCFlbGVtZW50LmdldENvbnRleHQpIHtcblx0XHRcdFx0aWYgKHdpbmRvdy5HX3ZtbENhbnZhc01hbmFnZXIpIHtcblx0XHRcdFx0XHRlbGVtZW50ID0gd2luZG93Lkdfdm1sQ2FudmFzTWFuYWdlci5pbml0RWxlbWVudChlbGVtZW50KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW52YXMgaXMgbm90IGF2YWlsYWJsZS4gSWYgeW91J3JlIHVzaW5nIElFIHdpdGggYSBmYWxsLWJhY2sgc3VjaCBhcyBFeGNhbnZhcywgdGhlbiB0aGVyZSdzIGVpdGhlciBhIG1pc3Rha2UgaW4geW91ciBjb25kaXRpb25hbCBpbmNsdWRlLCBvciB0aGUgcGFnZSBoYXMgbm8gRE9DVFlQRSBhbmQgaXMgcmVuZGVyaW5nIGluIFF1aXJrcyBNb2RlLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cblx0XHR2YXIgY29udGV4dCA9IHRoaXMuY29udGV4dCA9IGVsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0Ly8gRGV0ZXJtaW5lIHRoZSBzY3JlZW4ncyByYXRpbyBvZiBwaHlzaWNhbCB0byBkZXZpY2UtaW5kZXBlbmRlbnRcblx0XHQvLyBwaXhlbHMuICBUaGlzIGlzIHRoZSByYXRpbyBiZXR3ZWVuIHRoZSBjYW52YXMgd2lkdGggdGhhdCB0aGUgYnJvd3NlclxuXHRcdC8vIGFkdmVydGlzZXMgYW5kIHRoZSBudW1iZXIgb2YgcGl4ZWxzIGFjdHVhbGx5IHByZXNlbnQgaW4gdGhhdCBzcGFjZS5cblxuXHRcdC8vIFRoZSBpUGhvbmUgNCwgZm9yIGV4YW1wbGUsIGhhcyBhIGRldmljZS1pbmRlcGVuZGVudCB3aWR0aCBvZiAzMjBweCxcblx0XHQvLyBidXQgaXRzIHNjcmVlbiBpcyBhY3R1YWxseSA2NDBweCB3aWRlLiAgSXQgdGhlcmVmb3JlIGhhcyBhIHBpeGVsXG5cdFx0Ly8gcmF0aW8gb2YgMiwgd2hpbGUgbW9zdCBub3JtYWwgZGV2aWNlcyBoYXZlIGEgcmF0aW8gb2YgMS5cblxuXHRcdHZhciBkZXZpY2VQaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcblx0XHRcdGJhY2tpbmdTdG9yZVJhdGlvID1cblx0XHRcdFx0Y29udGV4dC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG5cdFx0XHRcdGNvbnRleHQubW96QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuXHRcdFx0XHRjb250ZXh0Lm1zQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuXHRcdFx0XHRjb250ZXh0Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG5cdFx0XHRcdGNvbnRleHQuYmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fCAxO1xuXG5cdFx0dGhpcy5waXhlbFJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbyAvIGJhY2tpbmdTdG9yZVJhdGlvO1xuXG5cdFx0Ly8gU2l6ZSB0aGUgY2FudmFzIHRvIG1hdGNoIHRoZSBpbnRlcm5hbCBkaW1lbnNpb25zIG9mIGl0cyBjb250YWluZXJcblxuXHRcdHRoaXMucmVzaXplKGNvbnRhaW5lci53aWR0aCgpLCBjb250YWluZXIuaGVpZ2h0KCkpO1xuXG5cdFx0Ly8gQ29sbGVjdGlvbiBvZiBIVE1MIGRpdiBsYXllcnMgZm9yIHRleHQgb3ZlcmxhaWQgb250byB0aGUgY2FudmFzXG5cblx0XHR0aGlzLnRleHRDb250YWluZXIgPSBudWxsO1xuXHRcdHRoaXMudGV4dCA9IHt9O1xuXG5cdFx0Ly8gQ2FjaGUgb2YgdGV4dCBmcmFnbWVudHMgYW5kIG1ldHJpY3MsIHNvIHdlIGNhbiBhdm9pZCBleHBlbnNpdmVseVxuXHRcdC8vIHJlLWNhbGN1bGF0aW5nIHRoZW0gd2hlbiB0aGUgcGxvdCBpcyByZS1yZW5kZXJlZCBpbiBhIGxvb3AuXG5cblx0XHR0aGlzLl90ZXh0Q2FjaGUgPSB7fTtcblx0fVxuXG5cdC8vIFJlc2l6ZXMgdGhlIGNhbnZhcyB0byB0aGUgZ2l2ZW4gZGltZW5zaW9ucy5cblx0Ly9cblx0Ly8gQHBhcmFtIHtudW1iZXJ9IHdpZHRoIE5ldyB3aWR0aCBvZiB0aGUgY2FudmFzLCBpbiBwaXhlbHMuXG5cdC8vIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBOZXcgaGVpZ2h0IG9mIHRoZSBjYW52YXMsIGluIHBpeGVscy5cblxuXHRDYW52YXMucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblxuXHRcdGlmICh3aWR0aCA8PSAwIHx8IGhlaWdodCA8PSAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRpbWVuc2lvbnMgZm9yIHBsb3QsIHdpZHRoID0gXCIgKyB3aWR0aCArIFwiLCBoZWlnaHQgPSBcIiArIGhlaWdodCk7XG5cdFx0fVxuXG5cdFx0dmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQsXG5cdFx0XHRjb250ZXh0ID0gdGhpcy5jb250ZXh0LFxuXHRcdFx0cGl4ZWxSYXRpbyA9IHRoaXMucGl4ZWxSYXRpbztcblxuXHRcdC8vIFJlc2l6ZSB0aGUgY2FudmFzLCBpbmNyZWFzaW5nIGl0cyBkZW5zaXR5IGJhc2VkIG9uIHRoZSBkaXNwbGF5J3Ncblx0XHQvLyBwaXhlbCByYXRpbzsgYmFzaWNhbGx5IGdpdmluZyBpdCBtb3JlIHBpeGVscyB3aXRob3V0IGluY3JlYXNpbmcgdGhlXG5cdFx0Ly8gc2l6ZSBvZiBpdHMgZWxlbWVudCwgdG8gdGFrZSBhZHZhbnRhZ2Ugb2YgdGhlIGZhY3QgdGhhdCByZXRpbmFcblx0XHQvLyBkaXNwbGF5cyBoYXZlIHRoYXQgbWFueSBtb3JlIHBpeGVscyBpbiB0aGUgc2FtZSBhZHZlcnRpc2VkIHNwYWNlLlxuXG5cdFx0Ly8gUmVzaXppbmcgc2hvdWxkIHJlc2V0IHRoZSBzdGF0ZSAoZXhjYW52YXMgc2VlbXMgdG8gYmUgYnVnZ3kgdGhvdWdoKVxuXG5cdFx0aWYgKHRoaXMud2lkdGggIT0gd2lkdGgpIHtcblx0XHRcdGVsZW1lbnQud2lkdGggPSB3aWR0aCAqIHBpeGVsUmF0aW87XG5cdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyBcInB4XCI7XG5cdFx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuaGVpZ2h0ICE9IGhlaWdodCkge1xuXHRcdFx0ZWxlbWVudC5oZWlnaHQgPSBoZWlnaHQgKiBwaXhlbFJhdGlvO1xuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyBcInB4XCI7XG5cdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR9XG5cblx0XHQvLyBTYXZlIHRoZSBjb250ZXh0LCBzbyB3ZSBjYW4gcmVzZXQgaW4gY2FzZSB3ZSBnZXQgcmVwbG90dGVkLiAgVGhlXG5cdFx0Ly8gcmVzdG9yZSBlbnN1cmUgdGhhdCB3ZSdyZSByZWFsbHkgYmFjayBhdCB0aGUgaW5pdGlhbCBzdGF0ZSwgYW5kXG5cdFx0Ly8gc2hvdWxkIGJlIHNhZmUgZXZlbiBpZiB3ZSBoYXZlbid0IHNhdmVkIHRoZSBpbml0aWFsIHN0YXRlIHlldC5cblxuXHRcdGNvbnRleHQucmVzdG9yZSgpO1xuXHRcdGNvbnRleHQuc2F2ZSgpO1xuXG5cdFx0Ly8gU2NhbGUgdGhlIGNvb3JkaW5hdGUgc3BhY2UgdG8gbWF0Y2ggdGhlIGRpc3BsYXkgZGVuc2l0eTsgc28gZXZlbiB0aG91Z2ggd2Vcblx0XHQvLyBtYXkgaGF2ZSB0d2ljZSBhcyBtYW55IHBpeGVscywgd2Ugc3RpbGwgd2FudCBsaW5lcyBhbmQgb3RoZXIgZHJhd2luZyB0b1xuXHRcdC8vIGFwcGVhciBhdCB0aGUgc2FtZSBzaXplOyB0aGUgZXh0cmEgcGl4ZWxzIHdpbGwganVzdCBtYWtlIHRoZW0gY3Jpc3Blci5cblxuXHRcdGNvbnRleHQuc2NhbGUocGl4ZWxSYXRpbywgcGl4ZWxSYXRpbyk7XG5cdH07XG5cblx0Ly8gQ2xlYXJzIHRoZSBlbnRpcmUgY2FudmFzIGFyZWEsIG5vdCBpbmNsdWRpbmcgYW55IG92ZXJsYWlkIEhUTUwgdGV4dFxuXG5cdENhbnZhcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0fTtcblxuXHQvLyBGaW5pc2hlcyByZW5kZXJpbmcgdGhlIGNhbnZhcywgaW5jbHVkaW5nIG1hbmFnaW5nIHRoZSB0ZXh0IG92ZXJsYXkuXG5cblx0Q2FudmFzLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBjYWNoZSA9IHRoaXMuX3RleHRDYWNoZTtcblxuXHRcdC8vIEZvciBlYWNoIHRleHQgbGF5ZXIsIGFkZCBlbGVtZW50cyBtYXJrZWQgYXMgYWN0aXZlIHRoYXQgaGF2ZW4ndFxuXHRcdC8vIGFscmVhZHkgYmVlbiByZW5kZXJlZCwgYW5kIHJlbW92ZSB0aG9zZSB0aGF0IGFyZSBubyBsb25nZXIgYWN0aXZlLlxuXG5cdFx0Zm9yICh2YXIgbGF5ZXJLZXkgaW4gY2FjaGUpIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBsYXllcktleSkpIHtcblxuXHRcdFx0XHR2YXIgbGF5ZXIgPSB0aGlzLmdldFRleHRMYXllcihsYXllcktleSksXG5cdFx0XHRcdFx0bGF5ZXJDYWNoZSA9IGNhY2hlW2xheWVyS2V5XTtcblxuXHRcdFx0XHRsYXllci5oaWRlKCk7XG5cblx0XHRcdFx0Zm9yICh2YXIgc3R5bGVLZXkgaW4gbGF5ZXJDYWNoZSkge1xuXHRcdFx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGxheWVyQ2FjaGUsIHN0eWxlS2V5KSkge1xuXHRcdFx0XHRcdFx0dmFyIHN0eWxlQ2FjaGUgPSBsYXllckNhY2hlW3N0eWxlS2V5XTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBzdHlsZUNhY2hlKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHN0eWxlQ2FjaGUsIGtleSkpIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBwb3NpdGlvbnMgPSBzdHlsZUNhY2hlW2tleV0ucG9zaXRpb25zO1xuXG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIHBvc2l0aW9uOyBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocG9zaXRpb24uYWN0aXZlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghcG9zaXRpb24ucmVuZGVyZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXllci5hcHBlbmQocG9zaXRpb24uZWxlbWVudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb24ucmVuZGVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbnMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChwb3NpdGlvbi5yZW5kZXJlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uLmVsZW1lbnQuZGV0YWNoKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAocG9zaXRpb25zLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZWxldGUgc3R5bGVDYWNoZVtrZXldO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxheWVyLnNob3coKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gQ3JlYXRlcyAoaWYgbmVjZXNzYXJ5KSBhbmQgcmV0dXJucyB0aGUgdGV4dCBvdmVybGF5IGNvbnRhaW5lci5cblx0Ly9cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IGNsYXNzZXMgU3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1MgY2xhc3NlcyB1c2VkIHRvXG5cdC8vICAgICB1bmlxdWVseSBpZGVudGlmeSB0aGUgdGV4dCBsYXllci5cblx0Ly8gQHJldHVybiB7b2JqZWN0fSBUaGUgalF1ZXJ5LXdyYXBwZWQgdGV4dC1sYXllciBkaXYuXG5cblx0Q2FudmFzLnByb3RvdHlwZS5nZXRUZXh0TGF5ZXIgPSBmdW5jdGlvbihjbGFzc2VzKSB7XG5cblx0XHR2YXIgbGF5ZXIgPSB0aGlzLnRleHRbY2xhc3Nlc107XG5cblx0XHQvLyBDcmVhdGUgdGhlIHRleHQgbGF5ZXIgaWYgaXQgZG9lc24ndCBleGlzdFxuXG5cdFx0aWYgKGxheWVyID09IG51bGwpIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIHRoZSB0ZXh0IGxheWVyIGNvbnRhaW5lciwgaWYgaXQgZG9lc24ndCBleGlzdFxuXG5cdFx0XHRpZiAodGhpcy50ZXh0Q29udGFpbmVyID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy50ZXh0Q29udGFpbmVyID0gJChcIjxkaXYgY2xhc3M9J2Zsb3QtdGV4dCc+PC9kaXY+XCIpXG5cdFx0XHRcdFx0LmNzcyh7XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcdFx0dG9wOiAwLFxuXHRcdFx0XHRcdFx0bGVmdDogMCxcblx0XHRcdFx0XHRcdGJvdHRvbTogMCxcblx0XHRcdFx0XHRcdHJpZ2h0OiAwLFxuXHRcdFx0XHRcdFx0J2ZvbnQtc2l6ZSc6IFwic21hbGxlclwiLFxuXHRcdFx0XHRcdFx0Y29sb3I6IFwiIzU0NTQ1NFwiXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuaW5zZXJ0QWZ0ZXIodGhpcy5lbGVtZW50KTtcblx0XHRcdH1cblxuXHRcdFx0bGF5ZXIgPSB0aGlzLnRleHRbY2xhc3Nlc10gPSAkKFwiPGRpdj48L2Rpdj5cIilcblx0XHRcdFx0LmFkZENsYXNzKGNsYXNzZXMpXG5cdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0dG9wOiAwLFxuXHRcdFx0XHRcdGxlZnQ6IDAsXG5cdFx0XHRcdFx0Ym90dG9tOiAwLFxuXHRcdFx0XHRcdHJpZ2h0OiAwXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5hcHBlbmRUbyh0aGlzLnRleHRDb250YWluZXIpO1xuXHRcdH1cblxuXHRcdHJldHVybiBsYXllcjtcblx0fTtcblxuXHQvLyBDcmVhdGVzIChpZiBuZWNlc3NhcnkpIGFuZCByZXR1cm5zIGEgdGV4dCBpbmZvIG9iamVjdC5cblx0Ly9cblx0Ly8gVGhlIG9iamVjdCBsb29rcyBsaWtlIHRoaXM6XG5cdC8vXG5cdC8vIHtcblx0Ly8gICAgIHdpZHRoOiBXaWR0aCBvZiB0aGUgdGV4dCdzIHdyYXBwZXIgZGl2LlxuXHQvLyAgICAgaGVpZ2h0OiBIZWlnaHQgb2YgdGhlIHRleHQncyB3cmFwcGVyIGRpdi5cblx0Ly8gICAgIGVsZW1lbnQ6IFRoZSBqUXVlcnktd3JhcHBlZCBIVE1MIGRpdiBjb250YWluaW5nIHRoZSB0ZXh0LlxuXHQvLyAgICAgcG9zaXRpb25zOiBBcnJheSBvZiBwb3NpdGlvbnMgYXQgd2hpY2ggdGhpcyB0ZXh0IGlzIGRyYXduLlxuXHQvLyB9XG5cdC8vXG5cdC8vIFRoZSBwb3NpdGlvbnMgYXJyYXkgY29udGFpbnMgb2JqZWN0cyB0aGF0IGxvb2sgbGlrZSB0aGlzOlxuXHQvL1xuXHQvLyB7XG5cdC8vICAgICBhY3RpdmU6IEZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0ZXh0IHNob3VsZCBiZSB2aXNpYmxlLlxuXHQvLyAgICAgcmVuZGVyZWQ6IEZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0ZXh0IGlzIGN1cnJlbnRseSB2aXNpYmxlLlxuXHQvLyAgICAgZWxlbWVudDogVGhlIGpRdWVyeS13cmFwcGVkIEhUTUwgZGl2IGNvbnRhaW5pbmcgdGhlIHRleHQuXG5cdC8vICAgICB4OiBYIGNvb3JkaW5hdGUgYXQgd2hpY2ggdG8gZHJhdyB0aGUgdGV4dC5cblx0Ly8gICAgIHk6IFkgY29vcmRpbmF0ZSBhdCB3aGljaCB0byBkcmF3IHRoZSB0ZXh0LlxuXHQvLyB9XG5cdC8vXG5cdC8vIEVhY2ggcG9zaXRpb24gYWZ0ZXIgdGhlIGZpcnN0IHJlY2VpdmVzIGEgY2xvbmUgb2YgdGhlIG9yaWdpbmFsIGVsZW1lbnQuXG5cdC8vXG5cdC8vIFRoZSBpZGVhIGlzIHRoYXQgdGhhdCB0aGUgd2lkdGgsIGhlaWdodCwgYW5kIGdlbmVyYWwgJ2lkZW50aXR5JyBvZiB0aGVcblx0Ly8gdGV4dCBpcyBjb25zdGFudCBubyBtYXR0ZXIgd2hlcmUgaXQgaXMgcGxhY2VkOyB0aGUgcGxhY2VtZW50cyBhcmUgYVxuXHQvLyBzZWNvbmRhcnkgcHJvcGVydHkuXG5cdC8vXG5cdC8vIENhbnZhcyBtYWludGFpbnMgYSBjYWNoZSBvZiByZWNlbnRseS11c2VkIHRleHQgaW5mbyBvYmplY3RzOyBnZXRUZXh0SW5mb1xuXHQvLyBlaXRoZXIgcmV0dXJucyB0aGUgY2FjaGVkIGVsZW1lbnQgb3IgY3JlYXRlcyBhIG5ldyBlbnRyeS5cblx0Ly9cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IGxheWVyIEEgc3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1MgY2xhc3NlcyB1bmlxdWVseVxuXHQvLyAgICAgaWRlbnRpZnlpbmcgdGhlIGxheWVyIGNvbnRhaW5pbmcgdGhpcyB0ZXh0LlxuXHQvLyBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHN0cmluZyB0byByZXRyaWV2ZSBpbmZvIGZvci5cblx0Ly8gQHBhcmFtIHsoc3RyaW5nfG9iamVjdCk9fSBmb250IEVpdGhlciBhIHN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTXG5cdC8vICAgICBjbGFzc2VzIG9yIGEgZm9udC1zcGVjIG9iamVjdCwgZGVmaW5pbmcgdGhlIHRleHQncyBmb250IGFuZCBzdHlsZS5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSBhbmdsZSBBbmdsZSBhdCB3aGljaCB0byByb3RhdGUgdGhlIHRleHQsIGluIGRlZ3JlZXMuXG5cdC8vICAgICBBbmdsZSBpcyBjdXJyZW50bHkgdW51c2VkLCBpdCB3aWxsIGJlIGltcGxlbWVudGVkIGluIHRoZSBmdXR1cmUuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0gd2lkdGggTWF4aW11bSB3aWR0aCBvZiB0aGUgdGV4dCBiZWZvcmUgaXQgd3JhcHMuXG5cdC8vIEByZXR1cm4ge29iamVjdH0gYSB0ZXh0IGluZm8gb2JqZWN0LlxuXG5cdENhbnZhcy5wcm90b3R5cGUuZ2V0VGV4dEluZm8gPSBmdW5jdGlvbihsYXllciwgdGV4dCwgZm9udCwgYW5nbGUsIHdpZHRoKSB7XG5cblx0XHR2YXIgdGV4dFN0eWxlLCBsYXllckNhY2hlLCBzdHlsZUNhY2hlLCBpbmZvO1xuXG5cdFx0Ly8gQ2FzdCB0aGUgdmFsdWUgdG8gYSBzdHJpbmcsIGluIGNhc2Ugd2Ugd2VyZSBnaXZlbiBhIG51bWJlciBvciBzdWNoXG5cblx0XHR0ZXh0ID0gXCJcIiArIHRleHQ7XG5cblx0XHQvLyBJZiB0aGUgZm9udCBpcyBhIGZvbnQtc3BlYyBvYmplY3QsIGdlbmVyYXRlIGEgQ1NTIGZvbnQgZGVmaW5pdGlvblxuXG5cdFx0aWYgKHR5cGVvZiBmb250ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHR0ZXh0U3R5bGUgPSBmb250LnN0eWxlICsgXCIgXCIgKyBmb250LnZhcmlhbnQgKyBcIiBcIiArIGZvbnQud2VpZ2h0ICsgXCIgXCIgKyBmb250LnNpemUgKyBcInB4L1wiICsgZm9udC5saW5lSGVpZ2h0ICsgXCJweCBcIiArIGZvbnQuZmFtaWx5O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0ZXh0U3R5bGUgPSBmb250O1xuXHRcdH1cblxuXHRcdC8vIFJldHJpZXZlIChvciBjcmVhdGUpIHRoZSBjYWNoZSBmb3IgdGhlIHRleHQncyBsYXllciBhbmQgc3R5bGVzXG5cblx0XHRsYXllckNhY2hlID0gdGhpcy5fdGV4dENhY2hlW2xheWVyXTtcblxuXHRcdGlmIChsYXllckNhY2hlID09IG51bGwpIHtcblx0XHRcdGxheWVyQ2FjaGUgPSB0aGlzLl90ZXh0Q2FjaGVbbGF5ZXJdID0ge307XG5cdFx0fVxuXG5cdFx0c3R5bGVDYWNoZSA9IGxheWVyQ2FjaGVbdGV4dFN0eWxlXTtcblxuXHRcdGlmIChzdHlsZUNhY2hlID09IG51bGwpIHtcblx0XHRcdHN0eWxlQ2FjaGUgPSBsYXllckNhY2hlW3RleHRTdHlsZV0gPSB7fTtcblx0XHR9XG5cblx0XHRpbmZvID0gc3R5bGVDYWNoZVt0ZXh0XTtcblxuXHRcdC8vIElmIHdlIGNhbid0IGZpbmQgYSBtYXRjaGluZyBlbGVtZW50IGluIG91ciBjYWNoZSwgY3JlYXRlIGEgbmV3IG9uZVxuXG5cdFx0aWYgKGluZm8gPT0gbnVsbCkge1xuXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQoXCI8ZGl2PjwvZGl2PlwiKS5odG1sKHRleHQpXG5cdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0J21heC13aWR0aCc6IHdpZHRoLFxuXHRcdFx0XHRcdHRvcDogLTk5OTlcblx0XHRcdFx0fSlcblx0XHRcdFx0LmFwcGVuZFRvKHRoaXMuZ2V0VGV4dExheWVyKGxheWVyKSk7XG5cblx0XHRcdGlmICh0eXBlb2YgZm9udCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRlbGVtZW50LmNzcyh7XG5cdFx0XHRcdFx0Zm9udDogdGV4dFN0eWxlLFxuXHRcdFx0XHRcdGNvbG9yOiBmb250LmNvbG9yXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZm9udCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRlbGVtZW50LmFkZENsYXNzKGZvbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRpbmZvID0gc3R5bGVDYWNoZVt0ZXh0XSA9IHtcblx0XHRcdFx0d2lkdGg6IGVsZW1lbnQub3V0ZXJXaWR0aCh0cnVlKSxcblx0XHRcdFx0aGVpZ2h0OiBlbGVtZW50Lm91dGVySGVpZ2h0KHRydWUpLFxuXHRcdFx0XHRlbGVtZW50OiBlbGVtZW50LFxuXHRcdFx0XHRwb3NpdGlvbnM6IFtdXG5cdFx0XHR9O1xuXG5cdFx0XHRlbGVtZW50LmRldGFjaCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBpbmZvO1xuXHR9O1xuXG5cdC8vIEFkZHMgYSB0ZXh0IHN0cmluZyB0byB0aGUgY2FudmFzIHRleHQgb3ZlcmxheS5cblx0Ly9cblx0Ly8gVGhlIHRleHQgaXNuJ3QgZHJhd24gaW1tZWRpYXRlbHk7IGl0IGlzIG1hcmtlZCBhcyByZW5kZXJpbmcsIHdoaWNoIHdpbGxcblx0Ly8gcmVzdWx0IGluIGl0cyBhZGRpdGlvbiB0byB0aGUgY2FudmFzIG9uIHRoZSBuZXh0IHJlbmRlciBwYXNzLlxuXHQvL1xuXHQvLyBAcGFyYW0ge3N0cmluZ30gbGF5ZXIgQSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHVuaXF1ZWx5XG5cdC8vICAgICBpZGVudGlmeWluZyB0aGUgbGF5ZXIgY29udGFpbmluZyB0aGlzIHRleHQuXG5cdC8vIEBwYXJhbSB7bnVtYmVyfSB4IFggY29vcmRpbmF0ZSBhdCB3aGljaCB0byBkcmF3IHRoZSB0ZXh0LlxuXHQvLyBAcGFyYW0ge251bWJlcn0geSBZIGNvb3JkaW5hdGUgYXQgd2hpY2ggdG8gZHJhdyB0aGUgdGV4dC5cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCBzdHJpbmcgdG8gZHJhdy5cblx0Ly8gQHBhcmFtIHsoc3RyaW5nfG9iamVjdCk9fSBmb250IEVpdGhlciBhIHN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTXG5cdC8vICAgICBjbGFzc2VzIG9yIGEgZm9udC1zcGVjIG9iamVjdCwgZGVmaW5pbmcgdGhlIHRleHQncyBmb250IGFuZCBzdHlsZS5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSBhbmdsZSBBbmdsZSBhdCB3aGljaCB0byByb3RhdGUgdGhlIHRleHQsIGluIGRlZ3JlZXMuXG5cdC8vICAgICBBbmdsZSBpcyBjdXJyZW50bHkgdW51c2VkLCBpdCB3aWxsIGJlIGltcGxlbWVudGVkIGluIHRoZSBmdXR1cmUuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0gd2lkdGggTWF4aW11bSB3aWR0aCBvZiB0aGUgdGV4dCBiZWZvcmUgaXQgd3JhcHMuXG5cdC8vIEBwYXJhbSB7c3RyaW5nPX0gaGFsaWduIEhvcml6b250YWwgYWxpZ25tZW50IG9mIHRoZSB0ZXh0OyBlaXRoZXIgXCJsZWZ0XCIsXG5cdC8vICAgICBcImNlbnRlclwiIG9yIFwicmlnaHRcIi5cblx0Ly8gQHBhcmFtIHtzdHJpbmc9fSB2YWxpZ24gVmVydGljYWwgYWxpZ25tZW50IG9mIHRoZSB0ZXh0OyBlaXRoZXIgXCJ0b3BcIixcblx0Ly8gICAgIFwibWlkZGxlXCIgb3IgXCJib3R0b21cIi5cblxuXHRDYW52YXMucHJvdG90eXBlLmFkZFRleHQgPSBmdW5jdGlvbihsYXllciwgeCwgeSwgdGV4dCwgZm9udCwgYW5nbGUsIHdpZHRoLCBoYWxpZ24sIHZhbGlnbikge1xuXG5cdFx0dmFyIGluZm8gPSB0aGlzLmdldFRleHRJbmZvKGxheWVyLCB0ZXh0LCBmb250LCBhbmdsZSwgd2lkdGgpLFxuXHRcdFx0cG9zaXRpb25zID0gaW5mby5wb3NpdGlvbnM7XG5cblx0XHQvLyBUd2VhayB0aGUgZGl2J3MgcG9zaXRpb24gdG8gbWF0Y2ggdGhlIHRleHQncyBhbGlnbm1lbnRcblxuXHRcdGlmIChoYWxpZ24gPT0gXCJjZW50ZXJcIikge1xuXHRcdFx0eCAtPSBpbmZvLndpZHRoIC8gMjtcblx0XHR9IGVsc2UgaWYgKGhhbGlnbiA9PSBcInJpZ2h0XCIpIHtcblx0XHRcdHggLT0gaW5mby53aWR0aDtcblx0XHR9XG5cblx0XHRpZiAodmFsaWduID09IFwibWlkZGxlXCIpIHtcblx0XHRcdHkgLT0gaW5mby5oZWlnaHQgLyAyO1xuXHRcdH0gZWxzZSBpZiAodmFsaWduID09IFwiYm90dG9tXCIpIHtcblx0XHRcdHkgLT0gaW5mby5oZWlnaHQ7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhpcyB0ZXh0IGFscmVhZHkgZXhpc3RzIGF0IHRoaXMgcG9zaXRpb24uXG5cdFx0Ly8gSWYgc28sIG1hcmsgaXQgZm9yIGluY2x1c2lvbiBpbiB0aGUgbmV4dCByZW5kZXIgcGFzcy5cblxuXHRcdGZvciAodmFyIGkgPSAwLCBwb3NpdGlvbjsgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07IGkrKykge1xuXHRcdFx0aWYgKHBvc2l0aW9uLnggPT0geCAmJiBwb3NpdGlvbi55ID09IHkpIHtcblx0XHRcdFx0cG9zaXRpb24uYWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElmIHRoZSB0ZXh0IGRvZXNuJ3QgZXhpc3QgYXQgdGhpcyBwb3NpdGlvbiwgY3JlYXRlIGEgbmV3IGVudHJ5XG5cblx0XHQvLyBGb3IgdGhlIHZlcnkgZmlyc3QgcG9zaXRpb24gd2UnbGwgcmUtdXNlIHRoZSBvcmlnaW5hbCBlbGVtZW50LFxuXHRcdC8vIHdoaWxlIGZvciBzdWJzZXF1ZW50IG9uZXMgd2UnbGwgY2xvbmUgaXQuXG5cblx0XHRwb3NpdGlvbiA9IHtcblx0XHRcdGFjdGl2ZTogdHJ1ZSxcblx0XHRcdHJlbmRlcmVkOiBmYWxzZSxcblx0XHRcdGVsZW1lbnQ6IHBvc2l0aW9ucy5sZW5ndGggPyBpbmZvLmVsZW1lbnQuY2xvbmUoKSA6IGluZm8uZWxlbWVudCxcblx0XHRcdHg6IHgsXG5cdFx0XHR5OiB5XG5cdFx0fTtcblxuXHRcdHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKTtcblxuXHRcdC8vIE1vdmUgdGhlIGVsZW1lbnQgdG8gaXRzIGZpbmFsIHBvc2l0aW9uIHdpdGhpbiB0aGUgY29udGFpbmVyXG5cblx0XHRwb3NpdGlvbi5lbGVtZW50LmNzcyh7XG5cdFx0XHR0b3A6IE1hdGgucm91bmQoeSksXG5cdFx0XHRsZWZ0OiBNYXRoLnJvdW5kKHgpLFxuXHRcdFx0J3RleHQtYWxpZ24nOiBoYWxpZ25cdC8vIEluIGNhc2UgdGhlIHRleHQgd3JhcHNcblx0XHR9KTtcblx0fTtcblxuXHQvLyBSZW1vdmVzIG9uZSBvciBtb3JlIHRleHQgc3RyaW5ncyBmcm9tIHRoZSBjYW52YXMgdGV4dCBvdmVybGF5LlxuXHQvL1xuXHQvLyBJZiBubyBwYXJhbWV0ZXJzIGFyZSBnaXZlbiwgYWxsIHRleHQgd2l0aGluIHRoZSBsYXllciBpcyByZW1vdmVkLlxuXHQvL1xuXHQvLyBOb3RlIHRoYXQgdGhlIHRleHQgaXMgbm90IGltbWVkaWF0ZWx5IHJlbW92ZWQ7IGl0IGlzIHNpbXBseSBtYXJrZWQgYXNcblx0Ly8gaW5hY3RpdmUsIHdoaWNoIHdpbGwgcmVzdWx0IGluIGl0cyByZW1vdmFsIG9uIHRoZSBuZXh0IHJlbmRlciBwYXNzLlxuXHQvLyBUaGlzIGF2b2lkcyB0aGUgcGVyZm9ybWFuY2UgcGVuYWx0eSBmb3IgJ2NsZWFyIGFuZCByZWRyYXcnIGJlaGF2aW9yLFxuXHQvLyB3aGVyZSB3ZSBwb3RlbnRpYWxseSBnZXQgcmlkIG9mIGFsbCB0ZXh0IG9uIGEgbGF5ZXIsIGJ1dCB3aWxsIGxpa2VseVxuXHQvLyBhZGQgYmFjayBtb3N0IG9yIGFsbCBvZiBpdCBsYXRlciwgYXMgd2hlbiByZWRyYXdpbmcgYXhlcywgZm9yIGV4YW1wbGUuXG5cdC8vXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSBsYXllciBBIHN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzZXMgdW5pcXVlbHlcblx0Ly8gICAgIGlkZW50aWZ5aW5nIHRoZSBsYXllciBjb250YWluaW5nIHRoaXMgdGV4dC5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSB4IFggY29vcmRpbmF0ZSBvZiB0aGUgdGV4dC5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSB5IFkgY29vcmRpbmF0ZSBvZiB0aGUgdGV4dC5cblx0Ly8gQHBhcmFtIHtzdHJpbmc9fSB0ZXh0IFRleHQgc3RyaW5nIHRvIHJlbW92ZS5cblx0Ly8gQHBhcmFtIHsoc3RyaW5nfG9iamVjdCk9fSBmb250IEVpdGhlciBhIHN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTXG5cdC8vICAgICBjbGFzc2VzIG9yIGEgZm9udC1zcGVjIG9iamVjdCwgZGVmaW5pbmcgdGhlIHRleHQncyBmb250IGFuZCBzdHlsZS5cblx0Ly8gQHBhcmFtIHtudW1iZXI9fSBhbmdsZSBBbmdsZSBhdCB3aGljaCB0aGUgdGV4dCBpcyByb3RhdGVkLCBpbiBkZWdyZWVzLlxuXHQvLyAgICAgQW5nbGUgaXMgY3VycmVudGx5IHVudXNlZCwgaXQgd2lsbCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgZnV0dXJlLlxuXG5cdENhbnZhcy5wcm90b3R5cGUucmVtb3ZlVGV4dCA9IGZ1bmN0aW9uKGxheWVyLCB4LCB5LCB0ZXh0LCBmb250LCBhbmdsZSkge1xuXHRcdGlmICh0ZXh0ID09IG51bGwpIHtcblx0XHRcdHZhciBsYXllckNhY2hlID0gdGhpcy5fdGV4dENhY2hlW2xheWVyXTtcblx0XHRcdGlmIChsYXllckNhY2hlICE9IG51bGwpIHtcblx0XHRcdFx0Zm9yICh2YXIgc3R5bGVLZXkgaW4gbGF5ZXJDYWNoZSkge1xuXHRcdFx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGxheWVyQ2FjaGUsIHN0eWxlS2V5KSkge1xuXHRcdFx0XHRcdFx0dmFyIHN0eWxlQ2FjaGUgPSBsYXllckNhY2hlW3N0eWxlS2V5XTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBzdHlsZUNhY2hlKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHN0eWxlQ2FjaGUsIGtleSkpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcG9zaXRpb25zID0gc3R5bGVDYWNoZVtrZXldLnBvc2l0aW9ucztcblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgcG9zaXRpb247IHBvc2l0aW9uID0gcG9zaXRpb25zW2ldOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcG9zaXRpb25zID0gdGhpcy5nZXRUZXh0SW5mbyhsYXllciwgdGV4dCwgZm9udCwgYW5nbGUpLnBvc2l0aW9ucztcblx0XHRcdGZvciAodmFyIGkgPSAwLCBwb3NpdGlvbjsgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07IGkrKykge1xuXHRcdFx0XHRpZiAocG9zaXRpb24ueCA9PSB4ICYmIHBvc2l0aW9uLnkgPT0geSkge1xuXHRcdFx0XHRcdHBvc2l0aW9uLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHQvLyBUaGUgdG9wLWxldmVsIGNvbnRhaW5lciBmb3IgdGhlIGVudGlyZSBwbG90LlxuXG4gICAgZnVuY3Rpb24gUGxvdChwbGFjZWhvbGRlciwgZGF0YV8sIG9wdGlvbnNfLCBwbHVnaW5zKSB7XG4gICAgICAgIC8vIGRhdGEgaXMgb24gdGhlIGZvcm06XG4gICAgICAgIC8vICAgWyBzZXJpZXMxLCBzZXJpZXMyIC4uLiBdXG4gICAgICAgIC8vIHdoZXJlIHNlcmllcyBpcyBlaXRoZXIganVzdCB0aGUgZGF0YSBhcyBbIFt4MSwgeTFdLCBbeDIsIHkyXSwgLi4uIF1cbiAgICAgICAgLy8gb3IgeyBkYXRhOiBbIFt4MSwgeTFdLCBbeDIsIHkyXSwgLi4uIF0sIGxhYmVsOiBcInNvbWUgbGFiZWxcIiwgLi4uIH1cblxuICAgICAgICB2YXIgc2VyaWVzID0gW10sXG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIC8vIHRoZSBjb2xvciB0aGVtZSB1c2VkIGZvciBncmFwaHNcbiAgICAgICAgICAgICAgICBjb2xvcnM6IFtcIiNlZGMyNDBcIiwgXCIjYWZkOGY4XCIsIFwiI2NiNGI0YlwiLCBcIiM0ZGE3NGRcIiwgXCIjOTQ0MGVkXCJdLFxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBub0NvbHVtbnM6IDEsIC8vIG51bWJlciBvZiBjb2x1bXMgaW4gbGVnZW5kIHRhYmxlXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsRm9ybWF0dGVyOiBudWxsLCAvLyBmbjogc3RyaW5nIC0+IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICBsYWJlbEJveEJvcmRlckNvbG9yOiBcIiNjY2NcIiwgLy8gYm9yZGVyIGNvbG9yIGZvciB0aGUgbGl0dGxlIGxhYmVsIGJveGVzXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogbnVsbCwgLy8gY29udGFpbmVyIChhcyBqUXVlcnkgb2JqZWN0KSB0byBwdXQgbGVnZW5kIGluLCBudWxsIG1lYW5zIGRlZmF1bHQgb24gdG9wIG9mIGdyYXBoXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcIm5lXCIsIC8vIHBvc2l0aW9uIG9mIGRlZmF1bHQgbGVnZW5kIGNvbnRhaW5lciB3aXRoaW4gcGxvdFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDUsIC8vIGRpc3RhbmNlIGZyb20gZ3JpZCBlZGdlIHRvIGRlZmF1bHQgbGVnZW5kIGNvbnRhaW5lciB3aXRoaW4gcGxvdFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IG51bGwsIC8vIG51bGwgbWVhbnMgYXV0by1kZXRlY3RcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZE9wYWNpdHk6IDAuODUsIC8vIHNldCB0byAwIHRvIGF2b2lkIGJhY2tncm91bmRcbiAgICAgICAgICAgICAgICAgICAgc29ydGVkOiBudWxsICAgIC8vIGRlZmF1bHQgdG8gbm8gbGVnZW5kIHNvcnRpbmdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHhheGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IG51bGwsIC8vIG51bGwgPSBhdXRvLWRldGVjdCwgdHJ1ZSA9IGFsd2F5cywgZmFsc2UgPSBuZXZlclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJib3R0b21cIiwgLy8gb3IgXCJ0b3BcIlxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBudWxsLCAvLyBudWxsIG9yIFwidGltZVwiXG4gICAgICAgICAgICAgICAgICAgIGZvbnQ6IG51bGwsIC8vIG51bGwgKGRlcml2ZWQgZnJvbSBDU1MgaW4gcGxhY2Vob2xkZXIpIG9yIG9iamVjdCBsaWtlIHsgc2l6ZTogMTEsIGxpbmVIZWlnaHQ6IDEzLCBzdHlsZTogXCJpdGFsaWNcIiwgd2VpZ2h0OiBcImJvbGRcIiwgZmFtaWx5OiBcInNhbnMtc2VyaWZcIiwgdmFyaWFudDogXCJzbWFsbC1jYXBzXCIgfVxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogbnVsbCwgLy8gYmFzZSBjb2xvciwgbGFiZWxzLCB0aWNrc1xuICAgICAgICAgICAgICAgICAgICB0aWNrQ29sb3I6IG51bGwsIC8vIHBvc3NpYmx5IGRpZmZlcmVudCBjb2xvciBvZiB0aWNrcywgZS5nLiBcInJnYmEoMCwwLDAsMC4xNSlcIlxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IG51bGwsIC8vIG51bGwgb3IgZjogbnVtYmVyIC0+IG51bWJlciB0byB0cmFuc2Zvcm0gYXhpc1xuICAgICAgICAgICAgICAgICAgICBpbnZlcnNlVHJhbnNmb3JtOiBudWxsLCAvLyBpZiB0cmFuc2Zvcm0gaXMgc2V0LCB0aGlzIHNob3VsZCBiZSB0aGUgaW52ZXJzZSBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICBtaW46IG51bGwsIC8vIG1pbi4gdmFsdWUgdG8gc2hvdywgbnVsbCBtZWFucyBzZXQgYXV0b21hdGljYWxseVxuICAgICAgICAgICAgICAgICAgICBtYXg6IG51bGwsIC8vIG1heC4gdmFsdWUgdG8gc2hvdywgbnVsbCBtZWFucyBzZXQgYXV0b21hdGljYWxseVxuICAgICAgICAgICAgICAgICAgICBhdXRvc2NhbGVNYXJnaW46IG51bGwsIC8vIG1hcmdpbiBpbiAlIHRvIGFkZCBpZiBhdXRvLXNldHRpbmcgbWluL21heFxuICAgICAgICAgICAgICAgICAgICB0aWNrczogbnVsbCwgLy8gZWl0aGVyIFsxLCAzXSBvciBbWzEsIFwiYVwiXSwgM10gb3IgKGZuOiBheGlzIGluZm8gLT4gdGlja3MpIG9yIGFwcC4gbnVtYmVyIG9mIHRpY2tzIGZvciBhdXRvLXRpY2tzXG4gICAgICAgICAgICAgICAgICAgIHRpY2tGb3JtYXR0ZXI6IG51bGwsIC8vIGZuOiBudW1iZXIgLT4gc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsV2lkdGg6IG51bGwsIC8vIHNpemUgb2YgdGljayBsYWJlbHMgaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsSGVpZ2h0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICByZXNlcnZlU3BhY2U6IG51bGwsIC8vIHdoZXRoZXIgdG8gcmVzZXJ2ZSBzcGFjZSBldmVuIGlmIGF4aXMgaXNuJ3Qgc2hvd25cbiAgICAgICAgICAgICAgICAgICAgdGlja0xlbmd0aDogbnVsbCwgLy8gc2l6ZSBpbiBwaXhlbHMgb2YgdGlja3MsIG9yIFwiZnVsbFwiIGZvciB3aG9sZSBsaW5lXG4gICAgICAgICAgICAgICAgICAgIGFsaWduVGlja3NXaXRoQXhpczogbnVsbCwgLy8gYXhpcyBudW1iZXIgb3IgbnVsbCBmb3Igbm8gc3luY1xuICAgICAgICAgICAgICAgICAgICB0aWNrRGVjaW1hbHM6IG51bGwsIC8vIG5vLiBvZiBkZWNpbWFscywgbnVsbCBtZWFucyBhdXRvXG4gICAgICAgICAgICAgICAgICAgIHRpY2tTaXplOiBudWxsLCAvLyBudW1iZXIgb3IgW251bWJlciwgXCJ1bml0XCJdXG4gICAgICAgICAgICAgICAgICAgIG1pblRpY2tTaXplOiBudWxsIC8vIG51bWJlciBvciBbbnVtYmVyLCBcInVuaXRcIl1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHlheGlzOiB7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9zY2FsZU1hcmdpbjogMC4wMixcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwibGVmdFwiIC8vIG9yIFwicmlnaHRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeGF4ZXM6IFtdLFxuICAgICAgICAgICAgICAgIHlheGVzOiBbXSxcbiAgICAgICAgICAgICAgICBzZXJpZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1czogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMiwgLy8gaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBcIiNmZmZmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbDogXCJjaXJjbGVcIiAvLyBvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsaW5lczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UgZG9uJ3QgcHV0IGluIHNob3c6IGZhbHNlIHNvIHdlIGNhbiBzZWVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoZXRoZXIgbGluZXMgd2VyZSBhY3RpdmVseSBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZVdpZHRoOiAyLCAvLyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcHM6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbWl0ICd6ZXJvJywgc28gd2UgY2FuIGxhdGVyIGRlZmF1bHQgaXRzIHZhbHVlIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaCB0aGF0IG9mIHRoZSAnZmlsbCcgb3B0aW9uLlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBiYXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMiwgLy8gaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXJXaWR0aDogMSwgLy8gaW4gdW5pdHMgb2YgdGhlIHggYXhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduOiBcImxlZnRcIiwgLy8gXCJsZWZ0XCIsIFwicmlnaHRcIiwgb3IgXCJjZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB6ZXJvOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNoYWRvd1NpemU6IDMsXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodENvbG9yOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGFib3ZlRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM1NDU0NTRcIiwgLy8gcHJpbWFyeSBjb2xvciB1c2VkIGZvciBvdXRsaW5lIGFuZCBsYWJlbHNcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBudWxsLCAvLyBudWxsIGZvciB0cmFuc3BhcmVudCwgZWxzZSBjb2xvclxuICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogbnVsbCwgLy8gc2V0IGlmIGRpZmZlcmVudCBmcm9tIHRoZSBncmlkIGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogbnVsbCwgLy8gY29sb3IgZm9yIHRoZSB0aWNrcywgZS5nLiBcInJnYmEoMCwwLDAsMC4xNSlcIlxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAsIC8vIGRpc3RhbmNlIGZyb20gdGhlIGNhbnZhcyBlZGdlIHRvIHRoZSBncmlkXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsTWFyZ2luOiA1LCAvLyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgYXhpc01hcmdpbjogOCwgLy8gaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAyLCAvLyBpbiBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgbWluQm9yZGVyTWFyZ2luOiBudWxsLCAvLyBpbiBwaXhlbHMsIG51bGwgbWVhbnMgdGFrZW4gZnJvbSBwb2ludHMgcmFkaXVzXG4gICAgICAgICAgICAgICAgICAgIG1hcmtpbmdzOiBudWxsLCAvLyBhcnJheSBvZiByYW5nZXMgb3IgZm46IGF4ZXMgLT4gYXJyYXkgb2YgcmFuZ2VzXG4gICAgICAgICAgICAgICAgICAgIG1hcmtpbmdzQ29sb3I6IFwiI2Y0ZjRmNFwiLFxuICAgICAgICAgICAgICAgICAgICBtYXJraW5nc0xpbmVXaWR0aDogMixcbiAgICAgICAgICAgICAgICAgICAgLy8gaW50ZXJhY3RpdmUgc3R1ZmZcbiAgICAgICAgICAgICAgICAgICAgY2xpY2thYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaG92ZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYXV0b0hpZ2hsaWdodDogdHJ1ZSwgLy8gaGlnaGxpZ2h0IGluIGNhc2UgbW91c2UgaXMgbmVhclxuICAgICAgICAgICAgICAgICAgICBtb3VzZUFjdGl2ZVJhZGl1czogMTAgLy8gaG93IGZhciB0aGUgbW91c2UgY2FuIGJlIGF3YXkgdG8gYWN0aXZhdGUgYW4gaXRlbVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW50ZXJhY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgcmVkcmF3T3ZlcmxheUludGVydmFsOiAxMDAwLzYwIC8vIHRpbWUgYmV0d2VlbiB1cGRhdGVzLCAtMSBtZWFucyBpbiBzYW1lIGZsb3dcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhvb2tzOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgc3VyZmFjZSA9IG51bGwsICAgICAvLyB0aGUgY2FudmFzIGZvciB0aGUgcGxvdCBpdHNlbGZcbiAgICAgICAgb3ZlcmxheSA9IG51bGwsICAgICAvLyBjYW52YXMgZm9yIGludGVyYWN0aXZlIHN0dWZmIG9uIHRvcCBvZiBwbG90XG4gICAgICAgIGV2ZW50SG9sZGVyID0gbnVsbCwgLy8galF1ZXJ5IG9iamVjdCB0aGF0IGV2ZW50cyBzaG91bGQgYmUgYm91bmQgdG9cbiAgICAgICAgY3R4ID0gbnVsbCwgb2N0eCA9IG51bGwsXG4gICAgICAgIHhheGVzID0gW10sIHlheGVzID0gW10sXG4gICAgICAgIHBsb3RPZmZzZXQgPSB7IGxlZnQ6IDAsIHJpZ2h0OiAwLCB0b3A6IDAsIGJvdHRvbTogMH0sXG4gICAgICAgIHBsb3RXaWR0aCA9IDAsIHBsb3RIZWlnaHQgPSAwLFxuICAgICAgICBob29rcyA9IHtcbiAgICAgICAgICAgIHByb2Nlc3NPcHRpb25zOiBbXSxcbiAgICAgICAgICAgIHByb2Nlc3NSYXdEYXRhOiBbXSxcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhcG9pbnRzOiBbXSxcbiAgICAgICAgICAgIHByb2Nlc3NPZmZzZXQ6IFtdLFxuICAgICAgICAgICAgZHJhd0JhY2tncm91bmQ6IFtdLFxuICAgICAgICAgICAgZHJhd1NlcmllczogW10sXG4gICAgICAgICAgICBkcmF3OiBbXSxcbiAgICAgICAgICAgIGJpbmRFdmVudHM6IFtdLFxuICAgICAgICAgICAgZHJhd092ZXJsYXk6IFtdLFxuICAgICAgICAgICAgc2h1dGRvd246IFtdXG4gICAgICAgIH0sXG4gICAgICAgIHBsb3QgPSB0aGlzO1xuXG4gICAgICAgIC8vIHB1YmxpYyBmdW5jdGlvbnNcbiAgICAgICAgcGxvdC5zZXREYXRhID0gc2V0RGF0YTtcbiAgICAgICAgcGxvdC5zZXR1cEdyaWQgPSBzZXR1cEdyaWQ7XG4gICAgICAgIHBsb3QuZHJhdyA9IGRyYXc7XG4gICAgICAgIHBsb3QuZ2V0UGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHBsYWNlaG9sZGVyOyB9O1xuICAgICAgICBwbG90LmdldENhbnZhcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3VyZmFjZS5lbGVtZW50OyB9O1xuICAgICAgICBwbG90LmdldFBsb3RPZmZzZXQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHBsb3RPZmZzZXQ7IH07XG4gICAgICAgIHBsb3Qud2lkdGggPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwbG90V2lkdGg7IH07XG4gICAgICAgIHBsb3QuaGVpZ2h0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcGxvdEhlaWdodDsgfTtcbiAgICAgICAgcGxvdC5vZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbyA9IGV2ZW50SG9sZGVyLm9mZnNldCgpO1xuICAgICAgICAgICAgby5sZWZ0ICs9IHBsb3RPZmZzZXQubGVmdDtcbiAgICAgICAgICAgIG8udG9wICs9IHBsb3RPZmZzZXQudG9wO1xuICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgIH07XG4gICAgICAgIHBsb3QuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlcmllczsgfTtcbiAgICAgICAgcGxvdC5nZXRBeGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlcyA9IHt9LCBpO1xuICAgICAgICAgICAgJC5lYWNoKHhheGVzLmNvbmNhdCh5YXhlcyksIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMpXG4gICAgICAgICAgICAgICAgICAgIHJlc1theGlzLmRpcmVjdGlvbiArIChheGlzLm4gIT0gMSA/IGF4aXMubiA6IFwiXCIpICsgXCJheGlzXCJdID0gYXhpcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICAgICAgcGxvdC5nZXRYQXhlcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHhheGVzOyB9O1xuICAgICAgICBwbG90LmdldFlBeGVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geWF4ZXM7IH07XG4gICAgICAgIHBsb3QuYzJwID0gY2FudmFzVG9BeGlzQ29vcmRzO1xuICAgICAgICBwbG90LnAyYyA9IGF4aXNUb0NhbnZhc0Nvb3JkcztcbiAgICAgICAgcGxvdC5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gb3B0aW9uczsgfTtcbiAgICAgICAgcGxvdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gICAgICAgIHBsb3QudW5oaWdobGlnaHQgPSB1bmhpZ2hsaWdodDtcbiAgICAgICAgcGxvdC50cmlnZ2VyUmVkcmF3T3ZlcmxheSA9IHRyaWdnZXJSZWRyYXdPdmVybGF5O1xuICAgICAgICBwbG90LnBvaW50T2Zmc2V0ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGVmdDogcGFyc2VJbnQoeGF4ZXNbYXhpc051bWJlcihwb2ludCwgXCJ4XCIpIC0gMV0ucDJjKCtwb2ludC54KSArIHBsb3RPZmZzZXQubGVmdCwgMTApLFxuICAgICAgICAgICAgICAgIHRvcDogcGFyc2VJbnQoeWF4ZXNbYXhpc051bWJlcihwb2ludCwgXCJ5XCIpIC0gMV0ucDJjKCtwb2ludC55KSArIHBsb3RPZmZzZXQudG9wLCAxMClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHBsb3Quc2h1dGRvd24gPSBzaHV0ZG93bjtcbiAgICAgICAgcGxvdC5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2h1dGRvd24oKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnJlbW92ZURhdGEoXCJwbG90XCIpLmVtcHR5KCk7XG5cbiAgICAgICAgICAgIHNlcmllcyA9IFtdO1xuICAgICAgICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgICAgICAgICBzdXJmYWNlID0gbnVsbDtcbiAgICAgICAgICAgIG92ZXJsYXkgPSBudWxsO1xuICAgICAgICAgICAgZXZlbnRIb2xkZXIgPSBudWxsO1xuICAgICAgICAgICAgY3R4ID0gbnVsbDtcbiAgICAgICAgICAgIG9jdHggPSBudWxsO1xuICAgICAgICAgICAgeGF4ZXMgPSBbXTtcbiAgICAgICAgICAgIHlheGVzID0gW107XG4gICAgICAgICAgICBob29rcyA9IG51bGw7XG4gICAgICAgICAgICBoaWdobGlnaHRzID0gW107XG4gICAgICAgICAgICBwbG90ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgcGxvdC5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0dmFyIHdpZHRoID0gcGxhY2Vob2xkZXIud2lkdGgoKSxcbiAgICAgICAgXHRcdGhlaWdodCA9IHBsYWNlaG9sZGVyLmhlaWdodCgpO1xuICAgICAgICAgICAgc3VyZmFjZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBvdmVybGF5LnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBwdWJsaWMgYXR0cmlidXRlc1xuICAgICAgICBwbG90Lmhvb2tzID0gaG9va3M7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZVxuICAgICAgICBpbml0UGx1Z2lucyhwbG90KTtcbiAgICAgICAgcGFyc2VPcHRpb25zKG9wdGlvbnNfKTtcbiAgICAgICAgc2V0dXBDYW52YXNlcygpO1xuICAgICAgICBzZXREYXRhKGRhdGFfKTtcbiAgICAgICAgc2V0dXBHcmlkKCk7XG4gICAgICAgIGRyYXcoKTtcbiAgICAgICAgYmluZEV2ZW50cygpO1xuXG5cbiAgICAgICAgZnVuY3Rpb24gZXhlY3V0ZUhvb2tzKGhvb2ssIGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3MgPSBbcGxvdF0uY29uY2F0KGFyZ3MpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBob29rLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIGhvb2tbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbml0UGx1Z2lucygpIHtcblxuICAgICAgICAgICAgLy8gUmVmZXJlbmNlcyB0byBrZXkgY2xhc3NlcywgYWxsb3dpbmcgcGx1Z2lucyB0byBtb2RpZnkgdGhlbVxuXG4gICAgICAgICAgICB2YXIgY2xhc3NlcyA9IHtcbiAgICAgICAgICAgICAgICBDYW52YXM6IENhbnZhc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW5zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwbHVnaW5zW2ldO1xuICAgICAgICAgICAgICAgIHAuaW5pdChwbG90LCBjbGFzc2VzKTtcbiAgICAgICAgICAgICAgICBpZiAocC5vcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvcHRpb25zLCBwLm9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGFyc2VPcHRpb25zKG9wdHMpIHtcblxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0aW9ucywgb3B0cyk7XG5cbiAgICAgICAgICAgIC8vICQuZXh0ZW5kIG1lcmdlcyBhcnJheXMsIHJhdGhlciB0aGFuIHJlcGxhY2luZyB0aGVtLiAgV2hlbiBsZXNzXG4gICAgICAgICAgICAvLyBjb2xvcnMgYXJlIHByb3ZpZGVkIHRoYW4gdGhlIHNpemUgb2YgdGhlIGRlZmF1bHQgcGFsZXR0ZSwgd2VcbiAgICAgICAgICAgIC8vIGVuZCB1cCB3aXRoIHRob3NlIGNvbG9ycyBwbHVzIHRoZSByZW1haW5pbmcgZGVmYXVsdHMsIHdoaWNoIGlzXG4gICAgICAgICAgICAvLyBub3QgZXhwZWN0ZWQgYmVoYXZpb3I7IGF2b2lkIGl0IGJ5IHJlcGxhY2luZyB0aGVtIGhlcmUuXG5cbiAgICAgICAgICAgIGlmIChvcHRzICYmIG9wdHMuY29sb3JzKSB7XG4gICAgICAgICAgICBcdG9wdGlvbnMuY29sb3JzID0gb3B0cy5jb2xvcnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnhheGlzLmNvbG9yID09IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy54YXhpcy5jb2xvciA9ICQuY29sb3IucGFyc2Uob3B0aW9ucy5ncmlkLmNvbG9yKS5zY2FsZSgnYScsIDAuMjIpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy55YXhpcy5jb2xvciA9PSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4aXMuY29sb3IgPSAkLmNvbG9yLnBhcnNlKG9wdGlvbnMuZ3JpZC5jb2xvcikuc2NhbGUoJ2EnLCAwLjIyKS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy54YXhpcy50aWNrQ29sb3IgPT0gbnVsbCkgLy8gZ3JpZC50aWNrQ29sb3IgZm9yIGJhY2stY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4aXMudGlja0NvbG9yID0gb3B0aW9ucy5ncmlkLnRpY2tDb2xvciB8fCBvcHRpb25zLnhheGlzLmNvbG9yO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMueWF4aXMudGlja0NvbG9yID09IG51bGwpIC8vIGdyaWQudGlja0NvbG9yIGZvciBiYWNrLWNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICBvcHRpb25zLnlheGlzLnRpY2tDb2xvciA9IG9wdGlvbnMuZ3JpZC50aWNrQ29sb3IgfHwgb3B0aW9ucy55YXhpcy5jb2xvcjtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5ib3JkZXJDb2xvciA9PSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZ3JpZC5ib3JkZXJDb2xvciA9IG9wdGlvbnMuZ3JpZC5jb2xvcjtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQudGlja0NvbG9yID09IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ncmlkLnRpY2tDb2xvciA9ICQuY29sb3IucGFyc2Uob3B0aW9ucy5ncmlkLmNvbG9yKS5zY2FsZSgnYScsIDAuMjIpLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIC8vIEZpbGwgaW4gZGVmYXVsdHMgZm9yIGF4aXMgb3B0aW9ucywgaW5jbHVkaW5nIGFueSB1bnNwZWNpZmllZFxuICAgICAgICAgICAgLy8gZm9udC1zcGVjIGZpZWxkcywgaWYgYSBmb250LXNwZWMgd2FzIHByb3ZpZGVkLlxuXG4gICAgICAgICAgICAvLyBJZiBubyB4L3kgYXhpcyBvcHRpb25zIHdlcmUgcHJvdmlkZWQsIGNyZWF0ZSBvbmUgb2YgZWFjaCBhbnl3YXksXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGUgcmVzdCBvZiB0aGUgY29kZSBhc3N1bWVzIHRoYXQgdGhleSBleGlzdC5cblxuICAgICAgICAgICAgdmFyIGksIGF4aXNPcHRpb25zLCBheGlzQ291bnQsXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBwbGFjZWhvbGRlci5jc3MoXCJmb250LXNpemVcIiksXG4gICAgICAgICAgICAgICAgZm9udFNpemVEZWZhdWx0ID0gZm9udFNpemUgPyArZm9udFNpemUucmVwbGFjZShcInB4XCIsIFwiXCIpIDogMTMsXG4gICAgICAgICAgICAgICAgZm9udERlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZTogcGxhY2Vob2xkZXIuY3NzKFwiZm9udC1zdHlsZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogTWF0aC5yb3VuZCgwLjggKiBmb250U2l6ZURlZmF1bHQpLFxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50OiBwbGFjZWhvbGRlci5jc3MoXCJmb250LXZhcmlhbnRcIiksXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodDogcGxhY2Vob2xkZXIuY3NzKFwiZm9udC13ZWlnaHRcIiksXG4gICAgICAgICAgICAgICAgICAgIGZhbWlseTogcGxhY2Vob2xkZXIuY3NzKFwiZm9udC1mYW1pbHlcIilcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBheGlzQ291bnQgPSBvcHRpb25zLnhheGVzLmxlbmd0aCB8fCAxO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGF4aXNDb3VudDsgKytpKSB7XG5cbiAgICAgICAgICAgICAgICBheGlzT3B0aW9ucyA9IG9wdGlvbnMueGF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXNPcHRpb25zICYmICFheGlzT3B0aW9ucy50aWNrQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMudGlja0NvbG9yID0gYXhpc09wdGlvbnMuY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYXhpc09wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucy54YXhpcywgYXhpc09wdGlvbnMpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4ZXNbaV0gPSBheGlzT3B0aW9ucztcblxuICAgICAgICAgICAgICAgIGlmIChheGlzT3B0aW9ucy5mb250KSB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLmZvbnQgPSAkLmV4dGVuZCh7fSwgZm9udERlZmF1bHRzLCBheGlzT3B0aW9ucy5mb250KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFheGlzT3B0aW9ucy5mb250LmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy5mb250LmNvbG9yID0gYXhpc09wdGlvbnMuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFheGlzT3B0aW9ucy5mb250LmxpbmVIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLmZvbnQubGluZUhlaWdodCA9IE1hdGgucm91bmQoYXhpc09wdGlvbnMuZm9udC5zaXplICogMS4xNSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXNDb3VudCA9IG9wdGlvbnMueWF4ZXMubGVuZ3RoIHx8IDE7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXhpc0NvdW50OyArK2kpIHtcblxuICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zID0gb3B0aW9ucy55YXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpc09wdGlvbnMgJiYgIWF4aXNPcHRpb25zLnRpY2tDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy50aWNrQ29sb3IgPSBheGlzT3B0aW9ucy5jb2xvcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBheGlzT3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zLnlheGlzLCBheGlzT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy55YXhlc1tpXSA9IGF4aXNPcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgaWYgKGF4aXNPcHRpb25zLmZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMuZm9udCA9ICQuZXh0ZW5kKHt9LCBmb250RGVmYXVsdHMsIGF4aXNPcHRpb25zLmZvbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWF4aXNPcHRpb25zLmZvbnQuY29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLmZvbnQuY29sb3IgPSBheGlzT3B0aW9ucy5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWF4aXNPcHRpb25zLmZvbnQubGluZUhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMuZm9udC5saW5lSGVpZ2h0ID0gTWF0aC5yb3VuZChheGlzT3B0aW9ucy5mb250LnNpemUgKiAxLjE1KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIHRvIGJlIHJlbW92ZWQgaW4gZnV0dXJlXG4gICAgICAgICAgICBpZiAob3B0aW9ucy54YXhpcy5ub1RpY2tzICYmIG9wdGlvbnMueGF4aXMudGlja3MgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLnhheGlzLnRpY2tzID0gb3B0aW9ucy54YXhpcy5ub1RpY2tzO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMueWF4aXMubm9UaWNrcyAmJiBvcHRpb25zLnlheGlzLnRpY2tzID09IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy55YXhpcy50aWNrcyA9IG9wdGlvbnMueWF4aXMubm9UaWNrcztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLngyYXhpcykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4ZXNbMV0gPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucy54YXhpcywgb3B0aW9ucy54MmF4aXMpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4ZXNbMV0ucG9zaXRpb24gPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIHRoZSBpbmhlcml0IHRvIGFsbG93IHRoZSBheGlzIHRvIGF1dG8tc2NhbGVcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy54MmF4aXMubWluID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy54YXhlc1sxXS5taW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy54MmF4aXMubWF4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy54YXhlc1sxXS5tYXggPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnkyYXhpcykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4ZXNbMV0gPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucy55YXhpcywgb3B0aW9ucy55MmF4aXMpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4ZXNbMV0ucG9zaXRpb24gPSBcInJpZ2h0XCI7XG4gICAgICAgICAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGluaGVyaXQgdG8gYWxsb3cgdGhlIGF4aXMgdG8gYXV0by1zY2FsZVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnkyYXhpcy5taW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnlheGVzWzFdLm1pbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnkyYXhpcy5tYXggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnlheGVzWzFdLm1heCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5jb2xvcmVkQXJlYXMpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ncmlkLm1hcmtpbmdzID0gb3B0aW9ucy5ncmlkLmNvbG9yZWRBcmVhcztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuY29sb3JlZEFyZWFzQ29sb3IpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ncmlkLm1hcmtpbmdzQ29sb3IgPSBvcHRpb25zLmdyaWQuY29sb3JlZEFyZWFzQ29sb3I7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5saW5lcylcbiAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvcHRpb25zLnNlcmllcy5saW5lcywgb3B0aW9ucy5saW5lcyk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wb2ludHMpXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0aW9ucy5zZXJpZXMucG9pbnRzLCBvcHRpb25zLnBvaW50cyk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5iYXJzKVxuICAgICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG9wdGlvbnMuc2VyaWVzLmJhcnMsIG9wdGlvbnMuYmFycyk7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zaGFkb3dTaXplICE9IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zZXJpZXMuc2hhZG93U2l6ZSA9IG9wdGlvbnMuc2hhZG93U2l6ZTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhpZ2hsaWdodENvbG9yICE9IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zZXJpZXMuaGlnaGxpZ2h0Q29sb3IgPSBvcHRpb25zLmhpZ2hsaWdodENvbG9yO1xuXG4gICAgICAgICAgICAvLyBzYXZlIG9wdGlvbnMgb24gYXhlcyBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdGlvbnMueGF4ZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgZ2V0T3JDcmVhdGVBeGlzKHhheGVzLCBpICsgMSkub3B0aW9ucyA9IG9wdGlvbnMueGF4ZXNbaV07XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0aW9ucy55YXhlcy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBnZXRPckNyZWF0ZUF4aXMoeWF4ZXMsIGkgKyAxKS5vcHRpb25zID0gb3B0aW9ucy55YXhlc1tpXTtcblxuICAgICAgICAgICAgLy8gYWRkIGhvb2tzIGZyb20gb3B0aW9uc1xuICAgICAgICAgICAgZm9yICh2YXIgbiBpbiBob29rcylcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5ob29rc1tuXSAmJiBvcHRpb25zLmhvb2tzW25dLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgaG9va3Nbbl0gPSBob29rc1tuXS5jb25jYXQob3B0aW9ucy5ob29rc1tuXSk7XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5wcm9jZXNzT3B0aW9ucywgW29wdGlvbnNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldERhdGEoZCkge1xuICAgICAgICAgICAgc2VyaWVzID0gcGFyc2VEYXRhKGQpO1xuICAgICAgICAgICAgZmlsbEluU2VyaWVzT3B0aW9ucygpO1xuICAgICAgICAgICAgcHJvY2Vzc0RhdGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlRGF0YShkKSB7XG4gICAgICAgICAgICB2YXIgcmVzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zLnNlcmllcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZFtpXS5kYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5kYXRhID0gZFtpXS5kYXRhOyAvLyBtb3ZlIHRoZSBkYXRhIGluc3RlYWQgb2YgZGVlcC1jb3B5XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkW2ldLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgcywgZFtpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZFtpXS5kYXRhID0gcy5kYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHMuZGF0YSA9IGRbaV07XG4gICAgICAgICAgICAgICAgcmVzLnB1c2gocyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBheGlzTnVtYmVyKG9iaiwgY29vcmQpIHtcbiAgICAgICAgICAgIHZhciBhID0gb2JqW2Nvb3JkICsgXCJheGlzXCJdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhID09IFwib2JqZWN0XCIpIC8vIGlmIHdlIGdvdCBhIHJlYWwgYXhpcywgZXh0cmFjdCBudW1iZXJcbiAgICAgICAgICAgICAgICBhID0gYS5uO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhICE9IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgYSA9IDE7IC8vIGRlZmF1bHQgdG8gZmlyc3QgYXhpc1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbGxBeGVzKCkge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGZsYXQgYXJyYXkgd2l0aG91dCBhbm5veWluZyBudWxsIGVudHJpZXNcbiAgICAgICAgICAgIHJldHVybiAkLmdyZXAoeGF4ZXMuY29uY2F0KHlheGVzKSwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGE7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FudmFzVG9BeGlzQ29vcmRzKHBvcykge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGFuIG9iamVjdCB3aXRoIHgveSBjb3JyZXNwb25kaW5nIHRvIGFsbCB1c2VkIGF4ZXNcbiAgICAgICAgICAgIHZhciByZXMgPSB7fSwgaSwgYXhpcztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB4YXhlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGF4aXMgPSB4YXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcyAmJiBheGlzLnVzZWQpXG4gICAgICAgICAgICAgICAgICAgIHJlc1tcInhcIiArIGF4aXMubl0gPSBheGlzLmMycChwb3MubGVmdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB5YXhlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGF4aXMgPSB5YXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcyAmJiBheGlzLnVzZWQpXG4gICAgICAgICAgICAgICAgICAgIHJlc1tcInlcIiArIGF4aXMubl0gPSBheGlzLmMycChwb3MudG9wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlcy54MSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJlcy54ID0gcmVzLngxO1xuICAgICAgICAgICAgaWYgKHJlcy55MSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJlcy55ID0gcmVzLnkxO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXhpc1RvQ2FudmFzQ29vcmRzKHBvcykge1xuICAgICAgICAgICAgLy8gZ2V0IGNhbnZhcyBjb29yZHMgZnJvbSB0aGUgZmlyc3QgcGFpciBvZiB4L3kgZm91bmQgaW4gcG9zXG4gICAgICAgICAgICB2YXIgcmVzID0ge30sIGksIGF4aXMsIGtleTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHhheGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgYXhpcyA9IHhheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzICYmIGF4aXMudXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBcInhcIiArIGF4aXMubjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc1trZXldID09IG51bGwgJiYgYXhpcy5uID09IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBcInhcIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zW2tleV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmxlZnQgPSBheGlzLnAyYyhwb3Nba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHlheGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgYXhpcyA9IHlheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzICYmIGF4aXMudXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBcInlcIiArIGF4aXMubjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc1trZXldID09IG51bGwgJiYgYXhpcy5uID09IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBcInlcIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zW2tleV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnRvcCA9IGF4aXMucDJjKHBvc1trZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0T3JDcmVhdGVBeGlzKGF4ZXMsIG51bWJlcikge1xuICAgICAgICAgICAgaWYgKCFheGVzW251bWJlciAtIDFdKVxuICAgICAgICAgICAgICAgIGF4ZXNbbnVtYmVyIC0gMV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIG46IG51bWJlciwgLy8gc2F2ZSB0aGUgbnVtYmVyIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogYXhlcyA9PSB4YXhlcyA/IFwieFwiIDogXCJ5XCIsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6ICQuZXh0ZW5kKHRydWUsIHt9LCBheGVzID09IHhheGVzID8gb3B0aW9ucy54YXhpcyA6IG9wdGlvbnMueWF4aXMpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGF4ZXNbbnVtYmVyIC0gMV07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaWxsSW5TZXJpZXNPcHRpb25zKCkge1xuXG4gICAgICAgICAgICB2YXIgbmVlZGVkQ29sb3JzID0gc2VyaWVzLmxlbmd0aCwgbWF4SW5kZXggPSAtMSwgaTtcblxuICAgICAgICAgICAgLy8gU3VidHJhY3QgdGhlIG51bWJlciBvZiBzZXJpZXMgdGhhdCBhbHJlYWR5IGhhdmUgZml4ZWQgY29sb3JzIG9yXG4gICAgICAgICAgICAvLyBjb2xvciBpbmRleGVzIGZyb20gdGhlIG51bWJlciB0aGF0IHdlIHN0aWxsIG5lZWQgdG8gZ2VuZXJhdGUuXG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2MgPSBzZXJpZXNbaV0uY29sb3I7XG4gICAgICAgICAgICAgICAgaWYgKHNjICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmVlZGVkQ29sb3JzLS07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2MgPT0gXCJudW1iZXJcIiAmJiBzYyA+IG1heEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhJbmRleCA9IHNjO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBhbnkgb2YgdGhlIHNlcmllcyBoYXZlIGZpeGVkIGNvbG9yIGluZGV4ZXMsIHRoZW4gd2UgbmVlZCB0b1xuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgYXQgbGVhc3QgYXMgbWFueSBjb2xvcnMgYXMgdGhlIGhpZ2hlc3QgaW5kZXguXG5cbiAgICAgICAgICAgIGlmIChuZWVkZWRDb2xvcnMgPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBuZWVkZWRDb2xvcnMgPSBtYXhJbmRleCArIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIGFsbCB0aGUgY29sb3JzLCB1c2luZyBmaXJzdCB0aGUgb3B0aW9uIGNvbG9ycyBhbmQgdGhlblxuICAgICAgICAgICAgLy8gdmFyaWF0aW9ucyBvbiB0aG9zZSBjb2xvcnMgb25jZSB0aGV5J3JlIGV4aGF1c3RlZC5cblxuICAgICAgICAgICAgdmFyIGMsIGNvbG9ycyA9IFtdLCBjb2xvclBvb2wgPSBvcHRpb25zLmNvbG9ycyxcbiAgICAgICAgICAgICAgICBjb2xvclBvb2xTaXplID0gY29sb3JQb29sLmxlbmd0aCwgdmFyaWF0aW9uID0gMDtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG5lZWRlZENvbG9yczsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICBjID0gJC5jb2xvci5wYXJzZShjb2xvclBvb2xbaSAlIGNvbG9yUG9vbFNpemVdIHx8IFwiIzY2NlwiKTtcblxuICAgICAgICAgICAgICAgIC8vIEVhY2ggdGltZSB3ZSBleGhhdXN0IHRoZSBjb2xvcnMgaW4gdGhlIHBvb2wgd2UgYWRqdXN0XG4gICAgICAgICAgICAgICAgLy8gYSBzY2FsaW5nIGZhY3RvciB1c2VkIHRvIHByb2R1Y2UgbW9yZSB2YXJpYXRpb25zIG9uXG4gICAgICAgICAgICAgICAgLy8gdGhvc2UgY29sb3JzLiBUaGUgZmFjdG9yIGFsdGVybmF0ZXMgbmVnYXRpdmUvcG9zaXRpdmVcbiAgICAgICAgICAgICAgICAvLyB0byBwcm9kdWNlIGxpZ2h0ZXIvZGFya2VyIGNvbG9ycy5cblxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IHRoZSB2YXJpYXRpb24gYWZ0ZXIgZXZlcnkgZmV3IGN5Y2xlcywgb3IgZWxzZVxuICAgICAgICAgICAgICAgIC8vIGl0IHdpbGwgZW5kIHVwIHByb2R1Y2luZyBvbmx5IHdoaXRlIG9yIGJsYWNrIGNvbG9ycy5cblxuICAgICAgICAgICAgICAgIGlmIChpICUgY29sb3JQb29sU2l6ZSA9PSAwICYmIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWF0aW9uIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWF0aW9uID0gLXZhcmlhdGlvbiAtIDAuMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB2YXJpYXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgdmFyaWF0aW9uID0gLXZhcmlhdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb2xvcnNbaV0gPSBjLnNjYWxlKCdyZ2InLCAxICsgdmFyaWF0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmluYWxpemUgdGhlIHNlcmllcyBvcHRpb25zLCBmaWxsaW5nIGluIHRoZWlyIGNvbG9yc1xuXG4gICAgICAgICAgICB2YXIgY29sb3JpID0gMCwgcztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW2ldO1xuXG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGNvbG9yc1xuICAgICAgICAgICAgICAgIGlmIChzLmNvbG9yID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5jb2xvciA9IGNvbG9yc1tjb2xvcmldLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICsrY29sb3JpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygcy5jb2xvciA9PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgICAgICBzLmNvbG9yID0gY29sb3JzW3MuY29sb3JdLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAvLyB0dXJuIG9uIGxpbmVzIGF1dG9tYXRpY2FsbHkgaW4gY2FzZSBub3RoaW5nIGlzIHNldFxuICAgICAgICAgICAgICAgIGlmIChzLmxpbmVzLnNob3cgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdiwgc2hvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodiBpbiBzKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNbdl0gJiYgc1t2XS5zaG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgIHMubGluZXMuc2hvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgbm90aGluZyB3YXMgcHJvdmlkZWQgZm9yIGxpbmVzLnplcm8sIGRlZmF1bHQgaXQgdG8gbWF0Y2hcbiAgICAgICAgICAgICAgICAvLyBsaW5lcy5maWxsLCBzaW5jZSBhcmVhcyBieSBkZWZhdWx0IHNob3VsZCBleHRlbmQgdG8gemVyby5cblxuICAgICAgICAgICAgICAgIGlmIChzLmxpbmVzLnplcm8gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzLmxpbmVzLnplcm8gPSAhIXMubGluZXMuZmlsbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBzZXR1cCBheGVzXG4gICAgICAgICAgICAgICAgcy54YXhpcyA9IGdldE9yQ3JlYXRlQXhpcyh4YXhlcywgYXhpc051bWJlcihzLCBcInhcIikpO1xuICAgICAgICAgICAgICAgIHMueWF4aXMgPSBnZXRPckNyZWF0ZUF4aXMoeWF4ZXMsIGF4aXNOdW1iZXIocywgXCJ5XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NEYXRhKCkge1xuICAgICAgICAgICAgdmFyIHRvcFNlbnRyeSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgICAgICBib3R0b21TZW50cnkgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgICAgZmFrZUluZmluaXR5ID0gTnVtYmVyLk1BWF9WQUxVRSxcbiAgICAgICAgICAgICAgICBpLCBqLCBrLCBtLCBsZW5ndGgsXG4gICAgICAgICAgICAgICAgcywgcG9pbnRzLCBwcywgeCwgeSwgYXhpcywgdmFsLCBmLCBwLFxuICAgICAgICAgICAgICAgIGRhdGEsIGZvcm1hdDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlQXhpcyhheGlzLCBtaW4sIG1heCkge1xuICAgICAgICAgICAgICAgIGlmIChtaW4gPCBheGlzLmRhdGFtaW4gJiYgbWluICE9IC1mYWtlSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMuZGF0YW1pbiA9IG1pbjtcbiAgICAgICAgICAgICAgICBpZiAobWF4ID4gYXhpcy5kYXRhbWF4ICYmIG1heCAhPSBmYWtlSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMuZGF0YW1heCA9IG1heDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5lYWNoKGFsbEF4ZXMoKSwgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICAvLyBpbml0IGF4aXNcbiAgICAgICAgICAgICAgICBheGlzLmRhdGFtaW4gPSB0b3BTZW50cnk7XG4gICAgICAgICAgICAgICAgYXhpcy5kYXRhbWF4ID0gYm90dG9tU2VudHJ5O1xuICAgICAgICAgICAgICAgIGF4aXMudXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW2ldO1xuICAgICAgICAgICAgICAgIHMuZGF0YXBvaW50cyA9IHsgcG9pbnRzOiBbXSB9O1xuXG4gICAgICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLnByb2Nlc3NSYXdEYXRhLCBbIHMsIHMuZGF0YSwgcy5kYXRhcG9pbnRzIF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXJzdCBwYXNzOiBjbGVhbiBhbmQgY29weSBkYXRhXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tpXTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSBzLmRhdGE7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gcy5kYXRhcG9pbnRzLmZvcm1hdDtcblxuICAgICAgICAgICAgICAgIGlmICghZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIG91dCBob3cgdG8gY29weVxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQucHVzaCh7IHg6IHRydWUsIG51bWJlcjogdHJ1ZSwgcmVxdWlyZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdC5wdXNoKHsgeTogdHJ1ZSwgbnVtYmVyOiB0cnVlLCByZXF1aXJlZDogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocy5iYXJzLnNob3cgfHwgKHMubGluZXMuc2hvdyAmJiBzLmxpbmVzLmZpbGwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV0b3NjYWxlID0gISEoKHMuYmFycy5zaG93ICYmIHMuYmFycy56ZXJvKSB8fCAocy5saW5lcy5zaG93ICYmIHMubGluZXMuemVybykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0LnB1c2goeyB5OiB0cnVlLCBudW1iZXI6IHRydWUsIHJlcXVpcmVkOiBmYWxzZSwgZGVmYXVsdFZhbHVlOiAwLCBhdXRvc2NhbGU6IGF1dG9zY2FsZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzLmJhcnMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmb3JtYXRbZm9ybWF0Lmxlbmd0aCAtIDFdLnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0W2Zvcm1hdC5sZW5ndGggLSAxXS54ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHMuZGF0YXBvaW50cy5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHMuZGF0YXBvaW50cy5wb2ludHNpemUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIGFscmVhZHkgZmlsbGVkIGluXG5cbiAgICAgICAgICAgICAgICBzLmRhdGFwb2ludHMucG9pbnRzaXplID0gZm9ybWF0Lmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHBzID0gcy5kYXRhcG9pbnRzLnBvaW50c2l6ZTtcbiAgICAgICAgICAgICAgICBwb2ludHMgPSBzLmRhdGFwb2ludHMucG9pbnRzO1xuXG4gICAgICAgICAgICAgICAgdmFyIGluc2VydFN0ZXBzID0gcy5saW5lcy5zaG93ICYmIHMubGluZXMuc3RlcHM7XG4gICAgICAgICAgICAgICAgcy54YXhpcy51c2VkID0gcy55YXhpcy51c2VkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGZvciAoaiA9IGsgPSAwOyBqIDwgZGF0YS5sZW5ndGg7ICsraiwgayArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICBwID0gZGF0YVtqXTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbnVsbGlmeSA9IHAgPT0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFudWxsaWZ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSAwOyBtIDwgcHM7ICsrbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHBbbV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGZvcm1hdFttXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLm51bWJlciAmJiB2YWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gK3ZhbDsgLy8gY29udmVydCB0byBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTih2YWwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWwgPT0gSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gZmFrZUluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsID09IC1JbmZpbml0eSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSAtZmFrZUluZmluaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5yZXF1aXJlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsaWZ5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYuZGVmYXVsdFZhbHVlICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gZi5kZWZhdWx0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbayArIG1dID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGxpZnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IDA7IG0gPCBwczsgKyttKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcG9pbnRzW2sgKyBtXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGZvcm1hdFttXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXh0cmFjdCBtaW4vbWF4IGluZm9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYuYXV0b3NjYWxlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYueCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUF4aXMocy54YXhpcywgdmFsLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUF4aXMocy55YXhpcywgdmFsLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50c1trICsgbV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBsaXR0bGUgYml0IG9mIGxpbmUgc3BlY2lmaWMgc3R1ZmYgdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGVyaGFwcyBzaG91bGRuJ3QgYmUgaGVyZSwgYnV0IGxhY2tpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJldHRlciBtZWFucy4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydFN0ZXBzICYmIGsgPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcG9pbnRzW2sgLSBwc10gIT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBvaW50c1trIC0gcHNdICE9IHBvaW50c1trXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBvaW50c1trIC0gcHMgKyAxXSAhPSBwb2ludHNbayArIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29weSB0aGUgcG9pbnQgdG8gbWFrZSByb29tIGZvciBhIG1pZGRsZSBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IDA7IG0gPCBwczsgKyttKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbayArIHBzICsgbV0gPSBwb2ludHNbayArIG1dO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWlkZGxlIHBvaW50IGhhcyBzYW1lIHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbayArIDFdID0gcG9pbnRzW2sgLSBwcyArIDFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UndmUgYWRkZWQgYSBwb2ludCwgYmV0dGVyIHJlZmxlY3QgdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgKz0gcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGdpdmUgdGhlIGhvb2tzIGEgY2hhbmNlIHRvIHJ1blxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbaV07XG5cbiAgICAgICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MucHJvY2Vzc0RhdGFwb2ludHMsIFsgcywgcy5kYXRhcG9pbnRzXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlY29uZCBwYXNzOiBmaW5kIGRhdGFtYXgvZGF0YW1pbiBmb3IgYXV0by1zY2FsaW5nXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tpXTtcbiAgICAgICAgICAgICAgICBwb2ludHMgPSBzLmRhdGFwb2ludHMucG9pbnRzO1xuICAgICAgICAgICAgICAgIHBzID0gcy5kYXRhcG9pbnRzLnBvaW50c2l6ZTtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBzLmRhdGFwb2ludHMuZm9ybWF0O1xuXG4gICAgICAgICAgICAgICAgdmFyIHhtaW4gPSB0b3BTZW50cnksIHltaW4gPSB0b3BTZW50cnksXG4gICAgICAgICAgICAgICAgICAgIHhtYXggPSBib3R0b21TZW50cnksIHltYXggPSBib3R0b21TZW50cnk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcG9pbnRzLmxlbmd0aDsgaiArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2pdID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSAwOyBtIDwgcHM7ICsrbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcG9pbnRzW2ogKyBtXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmb3JtYXRbbV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWYgfHwgZi5hdXRvc2NhbGUgPT09IGZhbHNlIHx8IHZhbCA9PSBmYWtlSW5maW5pdHkgfHwgdmFsID09IC1mYWtlSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsIDwgeG1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeG1pbiA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsID4geG1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeG1heCA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsIDwgeW1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW1pbiA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsID4geW1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeW1heCA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzLmJhcnMuc2hvdykge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZ290IHJvb20gZm9yIHRoZSBiYXIgb24gdGhlIGRhbmNpbmcgZmxvb3JcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlbHRhO1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAocy5iYXJzLmFsaWduKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhID0gLXMuYmFycy5iYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGEgPSAtcy5iYXJzLmJhcldpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzLmJhcnMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeW1pbiArPSBkZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHltYXggKz0gZGVsdGEgKyBzLmJhcnMuYmFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4bWluICs9IGRlbHRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgeG1heCArPSBkZWx0YSArIHMuYmFycy5iYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVwZGF0ZUF4aXMocy54YXhpcywgeG1pbiwgeG1heCk7XG4gICAgICAgICAgICAgICAgdXBkYXRlQXhpcyhzLnlheGlzLCB5bWluLCB5bWF4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5lYWNoKGFsbEF4ZXMoKSwgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5kYXRhbWluID09IHRvcFNlbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5kYXRhbWluID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5kYXRhbWF4ID09IGJvdHRvbVNlbnRyeSlcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5kYXRhbWF4ID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0dXBDYW52YXNlcygpIHtcblxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBwbGFjZWhvbGRlciBpcyBjbGVhciBvZiBldmVyeXRoaW5nIGV4Y2VwdCBjYW52YXNlc1xuICAgICAgICAgICAgLy8gZnJvbSBhIHByZXZpb3VzIHBsb3QgaW4gdGhpcyBjb250YWluZXIgdGhhdCB3ZSdsbCB0cnkgdG8gcmUtdXNlLlxuXG4gICAgICAgICAgICBwbGFjZWhvbGRlci5jc3MoXCJwYWRkaW5nXCIsIDApIC8vIHBhZGRpbmcgbWVzc2VzIHVwIHRoZSBwb3NpdGlvbmluZ1xuICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpLmZpbHRlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISQodGhpcykuaGFzQ2xhc3MoXCJmbG90LW92ZXJsYXlcIikgJiYgISQodGhpcykuaGFzQ2xhc3MoJ2Zsb3QtYmFzZScpO1xuICAgICAgICAgICAgICAgIH0pLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIuY3NzKFwicG9zaXRpb25cIikgPT0gJ3N0YXRpYycpXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIuY3NzKFwicG9zaXRpb25cIiwgXCJyZWxhdGl2ZVwiKTsgLy8gZm9yIHBvc2l0aW9uaW5nIGxhYmVscyBhbmQgb3ZlcmxheVxuXG4gICAgICAgICAgICBzdXJmYWNlID0gbmV3IENhbnZhcyhcImZsb3QtYmFzZVwiLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICBvdmVybGF5ID0gbmV3IENhbnZhcyhcImZsb3Qtb3ZlcmxheVwiLCBwbGFjZWhvbGRlcik7IC8vIG92ZXJsYXkgY2FudmFzIGZvciBpbnRlcmFjdGl2ZSBmZWF0dXJlc1xuXG4gICAgICAgICAgICBjdHggPSBzdXJmYWNlLmNvbnRleHQ7XG4gICAgICAgICAgICBvY3R4ID0gb3ZlcmxheS5jb250ZXh0O1xuXG4gICAgICAgICAgICAvLyBkZWZpbmUgd2hpY2ggZWxlbWVudCB3ZSdyZSBsaXN0ZW5pbmcgZm9yIGV2ZW50cyBvblxuICAgICAgICAgICAgZXZlbnRIb2xkZXIgPSAkKG92ZXJsYXkuZWxlbWVudCkudW5iaW5kKCk7XG5cbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIHJlLXVzaW5nIGEgcGxvdCBvYmplY3QsIHNodXQgZG93biB0aGUgb2xkIG9uZVxuXG4gICAgICAgICAgICB2YXIgZXhpc3RpbmcgPSBwbGFjZWhvbGRlci5kYXRhKFwicGxvdFwiKTtcblxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgZXhpc3Rpbmcuc2h1dGRvd24oKTtcbiAgICAgICAgICAgICAgICBvdmVybGF5LmNsZWFyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNhdmUgaW4gY2FzZSB3ZSBnZXQgcmVwbG90dGVkXG4gICAgICAgICAgICBwbGFjZWhvbGRlci5kYXRhKFwicGxvdFwiLCBwbG90KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJpbmRFdmVudHMoKSB7XG4gICAgICAgICAgICAvLyBiaW5kIGV2ZW50c1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5ob3ZlcmFibGUpIHtcbiAgICAgICAgICAgICAgICBldmVudEhvbGRlci5tb3VzZW1vdmUob25Nb3VzZU1vdmUpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlIGJpbmQsIHJhdGhlciB0aGFuIC5tb3VzZWxlYXZlLCBiZWNhdXNlIHdlIG9mZmljaWFsbHlcbiAgICAgICAgICAgICAgICAvLyBzdGlsbCBzdXBwb3J0IGpRdWVyeSAxLjIuNiwgd2hpY2ggZG9lc24ndCBkZWZpbmUgYSBzaG9ydGN1dFxuICAgICAgICAgICAgICAgIC8vIGZvciBtb3VzZWVudGVyIG9yIG1vdXNlbGVhdmUuICBUaGlzIHdhcyBhIGJ1Zy9vdmVyc2lnaHQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIHdhcyBmaXhlZCBzb21ld2hlcmUgYXJvdW5kIDEuMy54LiAgV2UgY2FuIHJldHVybiB0byB1c2luZ1xuICAgICAgICAgICAgICAgIC8vIC5tb3VzZWxlYXZlIHdoZW4gd2UgZHJvcCBzdXBwb3J0IGZvciAxLjIuNi5cblxuICAgICAgICAgICAgICAgIGV2ZW50SG9sZGVyLmJpbmQoXCJtb3VzZWxlYXZlXCIsIG9uTW91c2VMZWF2ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuY2xpY2thYmxlKVxuICAgICAgICAgICAgICAgIGV2ZW50SG9sZGVyLmNsaWNrKG9uQ2xpY2spO1xuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MuYmluZEV2ZW50cywgW2V2ZW50SG9sZGVyXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzaHV0ZG93bigpIHtcbiAgICAgICAgICAgIGlmIChyZWRyYXdUaW1lb3V0KVxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChyZWRyYXdUaW1lb3V0KTtcblxuICAgICAgICAgICAgZXZlbnRIb2xkZXIudW5iaW5kKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbiAgICAgICAgICAgIGV2ZW50SG9sZGVyLnVuYmluZChcIm1vdXNlbGVhdmVcIiwgb25Nb3VzZUxlYXZlKTtcbiAgICAgICAgICAgIGV2ZW50SG9sZGVyLnVuYmluZChcImNsaWNrXCIsIG9uQ2xpY2spO1xuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3Muc2h1dGRvd24sIFtldmVudEhvbGRlcl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0VHJhbnNmb3JtYXRpb25IZWxwZXJzKGF4aXMpIHtcbiAgICAgICAgICAgIC8vIHNldCBoZWxwZXIgZnVuY3Rpb25zIG9uIHRoZSBheGlzLCBhc3N1bWVzIHBsb3QgYXJlYVxuICAgICAgICAgICAgLy8gaGFzIGJlZW4gY29tcHV0ZWQgYWxyZWFkeVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBpZGVudGl0eSh4KSB7IHJldHVybiB4OyB9XG5cbiAgICAgICAgICAgIHZhciBzLCBtLCB0ID0gYXhpcy5vcHRpb25zLnRyYW5zZm9ybSB8fCBpZGVudGl0eSxcbiAgICAgICAgICAgICAgICBpdCA9IGF4aXMub3B0aW9ucy5pbnZlcnNlVHJhbnNmb3JtO1xuXG4gICAgICAgICAgICAvLyBwcmVjb21wdXRlIGhvdyBtdWNoIHRoZSBheGlzIGlzIHNjYWxpbmcgYSBwb2ludFxuICAgICAgICAgICAgLy8gaW4gY2FudmFzIHNwYWNlXG4gICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICBzID0gYXhpcy5zY2FsZSA9IHBsb3RXaWR0aCAvIE1hdGguYWJzKHQoYXhpcy5tYXgpIC0gdChheGlzLm1pbikpO1xuICAgICAgICAgICAgICAgIG0gPSBNYXRoLm1pbih0KGF4aXMubWF4KSwgdChheGlzLm1pbikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcyA9IGF4aXMuc2NhbGUgPSBwbG90SGVpZ2h0IC8gTWF0aC5hYnModChheGlzLm1heCkgLSB0KGF4aXMubWluKSk7XG4gICAgICAgICAgICAgICAgcyA9IC1zO1xuICAgICAgICAgICAgICAgIG0gPSBNYXRoLm1heCh0KGF4aXMubWF4KSwgdChheGlzLm1pbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkYXRhIHBvaW50IHRvIGNhbnZhcyBjb29yZGluYXRlXG4gICAgICAgICAgICBpZiAodCA9PSBpZGVudGl0eSkgLy8gc2xpZ2h0IG9wdGltaXphdGlvblxuICAgICAgICAgICAgICAgIGF4aXMucDJjID0gZnVuY3Rpb24gKHApIHsgcmV0dXJuIChwIC0gbSkgKiBzOyB9O1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGF4aXMucDJjID0gZnVuY3Rpb24gKHApIHsgcmV0dXJuICh0KHApIC0gbSkgKiBzOyB9O1xuICAgICAgICAgICAgLy8gY2FudmFzIGNvb3JkaW5hdGUgdG8gZGF0YSBwb2ludFxuICAgICAgICAgICAgaWYgKCFpdClcbiAgICAgICAgICAgICAgICBheGlzLmMycCA9IGZ1bmN0aW9uIChjKSB7IHJldHVybiBtICsgYyAvIHM7IH07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXhpcy5jMnAgPSBmdW5jdGlvbiAoYykgeyByZXR1cm4gaXQobSArIGMgLyBzKTsgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1lYXN1cmVUaWNrTGFiZWxzKGF4aXMpIHtcblxuICAgICAgICAgICAgdmFyIG9wdHMgPSBheGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgdGlja3MgPSBheGlzLnRpY2tzIHx8IFtdLFxuICAgICAgICAgICAgICAgIGxhYmVsV2lkdGggPSBvcHRzLmxhYmVsV2lkdGggfHwgMCxcbiAgICAgICAgICAgICAgICBsYWJlbEhlaWdodCA9IG9wdHMubGFiZWxIZWlnaHQgfHwgMCxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aCA9IGxhYmVsV2lkdGggfHwgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiID8gTWF0aC5mbG9vcihzdXJmYWNlLndpZHRoIC8gKHRpY2tzLmxlbmd0aCB8fCAxKSkgOiBudWxsKSxcbiAgICAgICAgICAgICAgICBsZWdhY3lTdHlsZXMgPSBheGlzLmRpcmVjdGlvbiArIFwiQXhpcyBcIiArIGF4aXMuZGlyZWN0aW9uICsgYXhpcy5uICsgXCJBeGlzXCIsXG4gICAgICAgICAgICAgICAgbGF5ZXIgPSBcImZsb3QtXCIgKyBheGlzLmRpcmVjdGlvbiArIFwiLWF4aXMgZmxvdC1cIiArIGF4aXMuZGlyZWN0aW9uICsgYXhpcy5uICsgXCItYXhpcyBcIiArIGxlZ2FjeVN0eWxlcyxcbiAgICAgICAgICAgICAgICBmb250ID0gb3B0cy5mb250IHx8IFwiZmxvdC10aWNrLWxhYmVsIHRpY2tMYWJlbFwiO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRpY2tzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdCA9IHRpY2tzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0LmxhYmVsKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHZhciBpbmZvID0gc3VyZmFjZS5nZXRUZXh0SW5mbyhsYXllciwgdC5sYWJlbCwgZm9udCwgbnVsbCwgbWF4V2lkdGgpO1xuXG4gICAgICAgICAgICAgICAgbGFiZWxXaWR0aCA9IE1hdGgubWF4KGxhYmVsV2lkdGgsIGluZm8ud2lkdGgpO1xuICAgICAgICAgICAgICAgIGxhYmVsSGVpZ2h0ID0gTWF0aC5tYXgobGFiZWxIZWlnaHQsIGluZm8uaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXhpcy5sYWJlbFdpZHRoID0gb3B0cy5sYWJlbFdpZHRoIHx8IGxhYmVsV2lkdGg7XG4gICAgICAgICAgICBheGlzLmxhYmVsSGVpZ2h0ID0gb3B0cy5sYWJlbEhlaWdodCB8fCBsYWJlbEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFsbG9jYXRlQXhpc0JveEZpcnN0UGhhc2UoYXhpcykge1xuICAgICAgICAgICAgLy8gZmluZCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBheGlzIGJ5IGxvb2tpbmcgYXQgbGFiZWxcbiAgICAgICAgICAgIC8vIHdpZHRocy9oZWlnaHRzIGFuZCB0aWNrcywgbWFrZSByb29tIGJ5IGRpbWluaXNoaW5nIHRoZVxuICAgICAgICAgICAgLy8gcGxvdE9mZnNldDsgdGhpcyBmaXJzdCBwaGFzZSBvbmx5IGxvb2tzIGF0IG9uZVxuICAgICAgICAgICAgLy8gZGltZW5zaW9uIHBlciBheGlzLCB0aGUgb3RoZXIgZGltZW5zaW9uIGRlcGVuZHMgb24gdGhlXG4gICAgICAgICAgICAvLyBvdGhlciBheGVzIHNvIHdpbGwgaGF2ZSB0byB3YWl0XG5cbiAgICAgICAgICAgIHZhciBsdyA9IGF4aXMubGFiZWxXaWR0aCxcbiAgICAgICAgICAgICAgICBsaCA9IGF4aXMubGFiZWxIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9zID0gYXhpcy5vcHRpb25zLnBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIGlzWEF4aXMgPSBheGlzLmRpcmVjdGlvbiA9PT0gXCJ4XCIsXG4gICAgICAgICAgICAgICAgdGlja0xlbmd0aCA9IGF4aXMub3B0aW9ucy50aWNrTGVuZ3RoLFxuICAgICAgICAgICAgICAgIGF4aXNNYXJnaW4gPSBvcHRpb25zLmdyaWQuYXhpc01hcmdpbixcbiAgICAgICAgICAgICAgICBwYWRkaW5nID0gb3B0aW9ucy5ncmlkLmxhYmVsTWFyZ2luLFxuICAgICAgICAgICAgICAgIGlubmVybW9zdCA9IHRydWUsXG4gICAgICAgICAgICAgICAgb3V0ZXJtb3N0ID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICBmaXJzdCA9IHRydWUsXG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBheGlzJ3MgcG9zaXRpb24gaW4gaXRzIGRpcmVjdGlvbiBhbmQgb24gaXRzIHNpZGVcblxuICAgICAgICAgICAgJC5lYWNoKGlzWEF4aXMgPyB4YXhlcyA6IHlheGVzLCBmdW5jdGlvbihpLCBhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEgJiYgKGEuc2hvdyB8fCBhLnJlc2VydmVTcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPT09IGF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhLm9wdGlvbnMucG9zaXRpb24gPT09IHBvcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJtb3N0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVybW9zdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVGhlIG91dGVybW9zdCBheGlzIG9uIGVhY2ggc2lkZSBoYXMgbm8gbWFyZ2luXG5cbiAgICAgICAgICAgIGlmIChvdXRlcm1vc3QpIHtcbiAgICAgICAgICAgICAgICBheGlzTWFyZ2luID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIHRpY2tzIGZvciB0aGUgZmlyc3QgYXhpcyBpbiBlYWNoIGRpcmVjdGlvbiBzdHJldGNoIGFjcm9zc1xuXG4gICAgICAgICAgICBpZiAodGlja0xlbmd0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGlja0xlbmd0aCA9IGZpcnN0ID8gXCJmdWxsXCIgOiA1O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzTmFOKCt0aWNrTGVuZ3RoKSlcbiAgICAgICAgICAgICAgICBwYWRkaW5nICs9ICt0aWNrTGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoaXNYQXhpcykge1xuICAgICAgICAgICAgICAgIGxoICs9IHBhZGRpbmc7XG5cbiAgICAgICAgICAgICAgICBpZiAocG9zID09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9mZnNldC5ib3R0b20gKz0gbGggKyBheGlzTWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICBheGlzLmJveCA9IHsgdG9wOiBzdXJmYWNlLmhlaWdodCAtIHBsb3RPZmZzZXQuYm90dG9tLCBoZWlnaHQ6IGxoIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBheGlzLmJveCA9IHsgdG9wOiBwbG90T2Zmc2V0LnRvcCArIGF4aXNNYXJnaW4sIGhlaWdodDogbGggfTtcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9mZnNldC50b3AgKz0gbGggKyBheGlzTWFyZ2luO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGx3ICs9IHBhZGRpbmc7XG5cbiAgICAgICAgICAgICAgICBpZiAocG9zID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXMuYm94ID0geyBsZWZ0OiBwbG90T2Zmc2V0LmxlZnQgKyBheGlzTWFyZ2luLCB3aWR0aDogbHcgfTtcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9mZnNldC5sZWZ0ICs9IGx3ICsgYXhpc01hcmdpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBsb3RPZmZzZXQucmlnaHQgKz0gbHcgKyBheGlzTWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICBheGlzLmJveCA9IHsgbGVmdDogc3VyZmFjZS53aWR0aCAtIHBsb3RPZmZzZXQucmlnaHQsIHdpZHRoOiBsdyB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgIC8vIHNhdmUgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgICAgICAgIGF4aXMucG9zaXRpb24gPSBwb3M7XG4gICAgICAgICAgICBheGlzLnRpY2tMZW5ndGggPSB0aWNrTGVuZ3RoO1xuICAgICAgICAgICAgYXhpcy5ib3gucGFkZGluZyA9IHBhZGRpbmc7XG4gICAgICAgICAgICBheGlzLmlubmVybW9zdCA9IGlubmVybW9zdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFsbG9jYXRlQXhpc0JveFNlY29uZFBoYXNlKGF4aXMpIHtcbiAgICAgICAgICAgIC8vIG5vdyB0aGF0IGFsbCBheGlzIGJveGVzIGhhdmUgYmVlbiBwbGFjZWQgaW4gb25lXG4gICAgICAgICAgICAvLyBkaW1lbnNpb24sIHdlIGNhbiBzZXQgdGhlIHJlbWFpbmluZyBkaW1lbnNpb24gY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIikge1xuICAgICAgICAgICAgICAgIGF4aXMuYm94LmxlZnQgPSBwbG90T2Zmc2V0LmxlZnQgLSBheGlzLmxhYmVsV2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIGF4aXMuYm94LndpZHRoID0gc3VyZmFjZS53aWR0aCAtIHBsb3RPZmZzZXQubGVmdCAtIHBsb3RPZmZzZXQucmlnaHQgKyBheGlzLmxhYmVsV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBheGlzLmJveC50b3AgPSBwbG90T2Zmc2V0LnRvcCAtIGF4aXMubGFiZWxIZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIGF4aXMuYm94LmhlaWdodCA9IHN1cmZhY2UuaGVpZ2h0IC0gcGxvdE9mZnNldC5ib3R0b20gLSBwbG90T2Zmc2V0LnRvcCArIGF4aXMubGFiZWxIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGp1c3RMYXlvdXRGb3JUaGluZ3NTdGlja2luZ091dCgpIHtcbiAgICAgICAgICAgIC8vIHBvc3NpYmx5IGFkanVzdCBwbG90IG9mZnNldCB0byBlbnN1cmUgZXZlcnl0aGluZyBzdGF5c1xuICAgICAgICAgICAgLy8gaW5zaWRlIHRoZSBjYW52YXMgYW5kIGlzbid0IGNsaXBwZWQgb2ZmXG5cbiAgICAgICAgICAgIHZhciBtaW5NYXJnaW4gPSBvcHRpb25zLmdyaWQubWluQm9yZGVyTWFyZ2luLFxuICAgICAgICAgICAgICAgIGF4aXMsIGk7XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIHN0dWZmIGZyb20gdGhlIHBsb3QgKEZJWE1FOiB0aGlzIHNob3VsZCBqdXN0IHJlYWRcbiAgICAgICAgICAgIC8vIGEgdmFsdWUgZnJvbSB0aGUgc2VyaWVzLCBvdGhlcndpc2UgaXQncyBpbXBvc3NpYmxlIHRvXG4gICAgICAgICAgICAvLyBjdXN0b21pemUpXG4gICAgICAgICAgICBpZiAobWluTWFyZ2luID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBtaW5NYXJnaW4gPSAwO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgICAgIG1pbk1hcmdpbiA9IE1hdGgubWF4KG1pbk1hcmdpbiwgMiAqIChzZXJpZXNbaV0ucG9pbnRzLnJhZGl1cyArIHNlcmllc1tpXS5wb2ludHMubGluZVdpZHRoLzIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1hcmdpbnMgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDogbWluTWFyZ2luLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBtaW5NYXJnaW4sXG4gICAgICAgICAgICAgICAgdG9wOiBtaW5NYXJnaW4sXG4gICAgICAgICAgICAgICAgYm90dG9tOiBtaW5NYXJnaW5cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGNoZWNrIGF4aXMgbGFiZWxzLCBub3RlIHdlIGRvbid0IGNoZWNrIHRoZSBhY3R1YWxcbiAgICAgICAgICAgIC8vIGxhYmVscyBidXQgaW5zdGVhZCB1c2UgdGhlIG92ZXJhbGwgd2lkdGgvaGVpZ2h0IHRvIG5vdFxuICAgICAgICAgICAgLy8ganVtcCBhcyBtdWNoIGFyb3VuZCB3aXRoIHJlcGxvdHNcbiAgICAgICAgICAgICQuZWFjaChhbGxBeGVzKCksIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMucmVzZXJ2ZVNwYWNlICYmIGF4aXMudGlja3MgJiYgYXhpcy50aWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2lucy5sZWZ0ID0gTWF0aC5tYXgobWFyZ2lucy5sZWZ0LCBheGlzLmxhYmVsV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbnMucmlnaHQgPSBNYXRoLm1heChtYXJnaW5zLnJpZ2h0LCBheGlzLmxhYmVsV2lkdGggLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbnMuYm90dG9tID0gTWF0aC5tYXgobWFyZ2lucy5ib3R0b20sIGF4aXMubGFiZWxIZWlnaHQgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbnMudG9wID0gTWF0aC5tYXgobWFyZ2lucy50b3AsIGF4aXMubGFiZWxIZWlnaHQgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwbG90T2Zmc2V0LmxlZnQgPSBNYXRoLmNlaWwoTWF0aC5tYXgobWFyZ2lucy5sZWZ0LCBwbG90T2Zmc2V0LmxlZnQpKTtcbiAgICAgICAgICAgIHBsb3RPZmZzZXQucmlnaHQgPSBNYXRoLmNlaWwoTWF0aC5tYXgobWFyZ2lucy5yaWdodCwgcGxvdE9mZnNldC5yaWdodCkpO1xuICAgICAgICAgICAgcGxvdE9mZnNldC50b3AgPSBNYXRoLmNlaWwoTWF0aC5tYXgobWFyZ2lucy50b3AsIHBsb3RPZmZzZXQudG9wKSk7XG4gICAgICAgICAgICBwbG90T2Zmc2V0LmJvdHRvbSA9IE1hdGguY2VpbChNYXRoLm1heChtYXJnaW5zLmJvdHRvbSwgcGxvdE9mZnNldC5ib3R0b20pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwR3JpZCgpIHtcbiAgICAgICAgICAgIHZhciBpLCBheGVzID0gYWxsQXhlcygpLCBzaG93R3JpZCA9IG9wdGlvbnMuZ3JpZC5zaG93O1xuXG4gICAgICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBwbG90J3Mgb2Zmc2V0IGZyb20gdGhlIGVkZ2Ugb2YgdGhlIGNhbnZhc1xuXG4gICAgICAgICAgICBmb3IgKHZhciBhIGluIHBsb3RPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFyZ2luID0gb3B0aW9ucy5ncmlkLm1hcmdpbiB8fCAwO1xuICAgICAgICAgICAgICAgIHBsb3RPZmZzZXRbYV0gPSB0eXBlb2YgbWFyZ2luID09IFwibnVtYmVyXCIgPyBtYXJnaW4gOiBtYXJnaW5bYV0gfHwgMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLnByb2Nlc3NPZmZzZXQsIFtwbG90T2Zmc2V0XSk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBncmlkIGlzIHZpc2libGUsIGFkZCBpdHMgYm9yZGVyIHdpZHRoIHRvIHRoZSBvZmZzZXRcblxuICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBwbG90T2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mKG9wdGlvbnMuZ3JpZC5ib3JkZXJXaWR0aCkgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBwbG90T2Zmc2V0W2FdICs9IHNob3dHcmlkID8gb3B0aW9ucy5ncmlkLmJvcmRlcldpZHRoW2FdIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBsb3RPZmZzZXRbYV0gKz0gc2hvd0dyaWQgPyBvcHRpb25zLmdyaWQuYm9yZGVyV2lkdGggOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5lYWNoKGF4ZXMsIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF4aXNPcHRzID0gYXhpcy5vcHRpb25zO1xuICAgICAgICAgICAgICAgIGF4aXMuc2hvdyA9IGF4aXNPcHRzLnNob3cgPT0gbnVsbCA/IGF4aXMudXNlZCA6IGF4aXNPcHRzLnNob3c7XG4gICAgICAgICAgICAgICAgYXhpcy5yZXNlcnZlU3BhY2UgPSBheGlzT3B0cy5yZXNlcnZlU3BhY2UgPT0gbnVsbCA/IGF4aXMuc2hvdyA6IGF4aXNPcHRzLnJlc2VydmVTcGFjZTtcbiAgICAgICAgICAgICAgICBzZXRSYW5nZShheGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2hvd0dyaWQpIHtcblxuICAgICAgICAgICAgICAgIHZhciBhbGxvY2F0ZWRBeGVzID0gJC5ncmVwKGF4ZXMsIGZ1bmN0aW9uIChheGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBheGlzLnNob3cgfHwgYXhpcy5yZXNlcnZlU3BhY2U7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goYWxsb2NhdGVkQXhlcywgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgdGlja3NcbiAgICAgICAgICAgICAgICAgICAgc2V0dXBUaWNrR2VuZXJhdGlvbihheGlzKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGlja3MoYXhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHNuYXBSYW5nZVRvVGlja3MoYXhpcywgYXhpcy50aWNrcyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgbGFiZWxXaWR0aC9IZWlnaHQgZm9yIGF4aXNcbiAgICAgICAgICAgICAgICAgICAgbWVhc3VyZVRpY2tMYWJlbHMoYXhpcyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyB3aXRoIGFsbCBkaW1lbnNpb25zIGNhbGN1bGF0ZWQsIHdlIGNhbiBjb21wdXRlIHRoZVxuICAgICAgICAgICAgICAgIC8vIGF4aXMgYm91bmRpbmcgYm94ZXMsIHN0YXJ0IGZyb20gdGhlIG91dHNpZGVcbiAgICAgICAgICAgICAgICAvLyAocmV2ZXJzZSBvcmRlcilcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBhbGxvY2F0ZWRBeGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKVxuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZUF4aXNCb3hGaXJzdFBoYXNlKGFsbG9jYXRlZEF4ZXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlJ3ZlIGdvdCBlbm91Z2ggc3BhY2UgZm9yIHRoaW5ncyB0aGF0XG4gICAgICAgICAgICAgICAgLy8gbWlnaHQgc3RpY2sgb3V0XG4gICAgICAgICAgICAgICAgYWRqdXN0TGF5b3V0Rm9yVGhpbmdzU3RpY2tpbmdPdXQoKTtcblxuICAgICAgICAgICAgICAgICQuZWFjaChhbGxvY2F0ZWRBeGVzLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgICAgICBhbGxvY2F0ZUF4aXNCb3hTZWNvbmRQaGFzZShheGlzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxvdFdpZHRoID0gc3VyZmFjZS53aWR0aCAtIHBsb3RPZmZzZXQubGVmdCAtIHBsb3RPZmZzZXQucmlnaHQ7XG4gICAgICAgICAgICBwbG90SGVpZ2h0ID0gc3VyZmFjZS5oZWlnaHQgLSBwbG90T2Zmc2V0LmJvdHRvbSAtIHBsb3RPZmZzZXQudG9wO1xuXG4gICAgICAgICAgICAvLyBub3cgd2UgZ290IHRoZSBwcm9wZXIgcGxvdCBkaW1lbnNpb25zLCB3ZSBjYW4gY29tcHV0ZSB0aGUgc2NhbGluZ1xuICAgICAgICAgICAgJC5lYWNoKGF4ZXMsIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgc2V0VHJhbnNmb3JtYXRpb25IZWxwZXJzKGF4aXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzaG93R3JpZCkge1xuICAgICAgICAgICAgICAgIGRyYXdBeGlzTGFiZWxzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGluc2VydExlZ2VuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UmFuZ2UoYXhpcykge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSBheGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgbWluID0gKyhvcHRzLm1pbiAhPSBudWxsID8gb3B0cy5taW4gOiBheGlzLmRhdGFtaW4pLFxuICAgICAgICAgICAgICAgIG1heCA9ICsob3B0cy5tYXggIT0gbnVsbCA/IG9wdHMubWF4IDogYXhpcy5kYXRhbWF4KSxcbiAgICAgICAgICAgICAgICBkZWx0YSA9IG1heCAtIG1pbjtcblxuICAgICAgICAgICAgaWYgKGRlbHRhID09IDAuMCkge1xuICAgICAgICAgICAgICAgIC8vIGRlZ2VuZXJhdGUgY2FzZVxuICAgICAgICAgICAgICAgIHZhciB3aWRlbiA9IG1heCA9PSAwID8gMSA6IDAuMDE7XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5taW4gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgbWluIC09IHdpZGVuO1xuICAgICAgICAgICAgICAgIC8vIGFsd2F5cyB3aWRlbiBtYXggaWYgd2UgY291bGRuJ3Qgd2lkZW4gbWluIHRvIGVuc3VyZSB3ZVxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGZhbGwgaW50byBtaW4gPT0gbWF4IHdoaWNoIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLm1heCA9PSBudWxsIHx8IG9wdHMubWluICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIG1heCArPSB3aWRlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNpZGVyIGF1dG9zY2FsaW5nXG4gICAgICAgICAgICAgICAgdmFyIG1hcmdpbiA9IG9wdHMuYXV0b3NjYWxlTWFyZ2luO1xuICAgICAgICAgICAgICAgIGlmIChtYXJnaW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5taW4gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluIC09IGRlbHRhICogbWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGRvbid0IGdvIGJlbG93IHplcm8gaWYgYWxsIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJlIHBvc2l0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWluIDwgMCAmJiBheGlzLmRhdGFtaW4gIT0gbnVsbCAmJiBheGlzLmRhdGFtaW4gPj0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW4gPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1heCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXggKz0gZGVsdGEgKiBtYXJnaW47XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF4ID4gMCAmJiBheGlzLmRhdGFtYXggIT0gbnVsbCAmJiBheGlzLmRhdGFtYXggPD0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXhpcy5taW4gPSBtaW47XG4gICAgICAgICAgICBheGlzLm1heCA9IG1heDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwVGlja0dlbmVyYXRpb24oYXhpcykge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSBheGlzLm9wdGlvbnM7XG5cbiAgICAgICAgICAgIC8vIGVzdGltYXRlIG51bWJlciBvZiB0aWNrc1xuICAgICAgICAgICAgdmFyIG5vVGlja3M7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMudGlja3MgPT0gXCJudW1iZXJcIiAmJiBvcHRzLnRpY2tzID4gMClcbiAgICAgICAgICAgICAgICBub1RpY2tzID0gb3B0cy50aWNrcztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAvLyBoZXVyaXN0aWMgYmFzZWQgb24gdGhlIG1vZGVsIGEqc3FydCh4KSBmaXR0ZWQgdG9cbiAgICAgICAgICAgICAgICAvLyBzb21lIGRhdGEgcG9pbnRzIHRoYXQgc2VlbWVkIHJlYXNvbmFibGVcbiAgICAgICAgICAgICAgICBub1RpY2tzID0gMC4zICogTWF0aC5zcXJ0KGF4aXMuZGlyZWN0aW9uID09IFwieFwiID8gc3VyZmFjZS53aWR0aCA6IHN1cmZhY2UuaGVpZ2h0KTtcblxuICAgICAgICAgICAgdmFyIGRlbHRhID0gKGF4aXMubWF4IC0gYXhpcy5taW4pIC8gbm9UaWNrcyxcbiAgICAgICAgICAgICAgICBkZWMgPSAtTWF0aC5mbG9vcihNYXRoLmxvZyhkZWx0YSkgLyBNYXRoLkxOMTApLFxuICAgICAgICAgICAgICAgIG1heERlYyA9IG9wdHMudGlja0RlY2ltYWxzO1xuXG4gICAgICAgICAgICBpZiAobWF4RGVjICE9IG51bGwgJiYgZGVjID4gbWF4RGVjKSB7XG4gICAgICAgICAgICAgICAgZGVjID0gbWF4RGVjO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWFnbiA9IE1hdGgucG93KDEwLCAtZGVjKSxcbiAgICAgICAgICAgICAgICBub3JtID0gZGVsdGEgLyBtYWduLCAvLyBub3JtIGlzIGJldHdlZW4gMS4wIGFuZCAxMC4wXG4gICAgICAgICAgICAgICAgc2l6ZTtcblxuICAgICAgICAgICAgaWYgKG5vcm0gPCAxLjUpIHtcbiAgICAgICAgICAgICAgICBzaXplID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9ybSA8IDMpIHtcbiAgICAgICAgICAgICAgICBzaXplID0gMjtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDIuNSwgcmVxdWlyZXMgYW4gZXh0cmEgZGVjaW1hbFxuICAgICAgICAgICAgICAgIGlmIChub3JtID4gMi4yNSAmJiAobWF4RGVjID09IG51bGwgfHwgZGVjICsgMSA8PSBtYXhEZWMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNpemUgPSAyLjU7XG4gICAgICAgICAgICAgICAgICAgICsrZGVjO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9ybSA8IDcuNSkge1xuICAgICAgICAgICAgICAgIHNpemUgPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaXplID0gMTA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNpemUgKj0gbWFnbjtcblxuICAgICAgICAgICAgaWYgKG9wdHMubWluVGlja1NpemUgIT0gbnVsbCAmJiBzaXplIDwgb3B0cy5taW5UaWNrU2l6ZSkge1xuICAgICAgICAgICAgICAgIHNpemUgPSBvcHRzLm1pblRpY2tTaXplO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBheGlzLmRlbHRhID0gZGVsdGE7XG4gICAgICAgICAgICBheGlzLnRpY2tEZWNpbWFscyA9IE1hdGgubWF4KDAsIG1heERlYyAhPSBudWxsID8gbWF4RGVjIDogZGVjKTtcbiAgICAgICAgICAgIGF4aXMudGlja1NpemUgPSBvcHRzLnRpY2tTaXplIHx8IHNpemU7XG5cbiAgICAgICAgICAgIC8vIFRpbWUgbW9kZSB3YXMgbW92ZWQgdG8gYSBwbHVnLWluIGluIDAuOCwgYW5kIHNpbmNlIHNvIG1hbnkgcGVvcGxlIHVzZSBpdFxuICAgICAgICAgICAgLy8gd2UnbGwgYWRkIGFuIGVzcGVjaWFsbHkgZnJpZW5kbHkgcmVtaW5kZXIgdG8gbWFrZSBzdXJlIHRoZXkgaW5jbHVkZWQgaXQuXG5cbiAgICAgICAgICAgIGlmIChvcHRzLm1vZGUgPT0gXCJ0aW1lXCIgJiYgIWF4aXMudGlja0dlbmVyYXRvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbWUgbW9kZSByZXF1aXJlcyB0aGUgZmxvdC50aW1lIHBsdWdpbi5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZsb3Qgc3VwcG9ydHMgYmFzZS0xMCBheGVzOyBhbnkgb3RoZXIgbW9kZSBlbHNlIGlzIGhhbmRsZWQgYnkgYSBwbHVnLWluLFxuICAgICAgICAgICAgLy8gbGlrZSBmbG90LnRpbWUuanMuXG5cbiAgICAgICAgICAgIGlmICghYXhpcy50aWNrR2VuZXJhdG9yKSB7XG5cbiAgICAgICAgICAgICAgICBheGlzLnRpY2tHZW5lcmF0b3IgPSBmdW5jdGlvbiAoYXhpcykge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aWNrcyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBmbG9vckluQmFzZShheGlzLm1pbiwgYXhpcy50aWNrU2l6ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBOdW1iZXIuTmFOLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldjtcblxuICAgICAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBzdGFydCArIGkgKiBheGlzLnRpY2tTaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlja3MucHVzaCh2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICsraTtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodiA8IGF4aXMubWF4ICYmIHYgIT0gcHJldik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWNrcztcbiAgICAgICAgICAgICAgICB9O1xuXG5cdFx0XHRcdGF4aXMudGlja0Zvcm1hdHRlciA9IGZ1bmN0aW9uICh2YWx1ZSwgYXhpcykge1xuXG5cdFx0XHRcdFx0dmFyIGZhY3RvciA9IGF4aXMudGlja0RlY2ltYWxzID8gTWF0aC5wb3coMTAsIGF4aXMudGlja0RlY2ltYWxzKSA6IDE7XG5cdFx0XHRcdFx0dmFyIGZvcm1hdHRlZCA9IFwiXCIgKyBNYXRoLnJvdW5kKHZhbHVlICogZmFjdG9yKSAvIGZhY3RvcjtcblxuXHRcdFx0XHRcdC8vIElmIHRpY2tEZWNpbWFscyB3YXMgc3BlY2lmaWVkLCBlbnN1cmUgdGhhdCB3ZSBoYXZlIGV4YWN0bHkgdGhhdFxuXHRcdFx0XHRcdC8vIG11Y2ggcHJlY2lzaW9uOyBvdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgdmFsdWUncyBvd24gcHJlY2lzaW9uLlxuXG5cdFx0XHRcdFx0aWYgKGF4aXMudGlja0RlY2ltYWxzICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdHZhciBkZWNpbWFsID0gZm9ybWF0dGVkLmluZGV4T2YoXCIuXCIpO1xuXHRcdFx0XHRcdFx0dmFyIHByZWNpc2lvbiA9IGRlY2ltYWwgPT0gLTEgPyAwIDogZm9ybWF0dGVkLmxlbmd0aCAtIGRlY2ltYWwgLSAxO1xuXHRcdFx0XHRcdFx0aWYgKHByZWNpc2lvbiA8IGF4aXMudGlja0RlY2ltYWxzKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAocHJlY2lzaW9uID8gZm9ybWF0dGVkIDogZm9ybWF0dGVkICsgXCIuXCIpICsgKFwiXCIgKyBmYWN0b3IpLnN1YnN0cigxLCBheGlzLnRpY2tEZWNpbWFscyAtIHByZWNpc2lvbik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZWQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvcHRzLnRpY2tGb3JtYXR0ZXIpKVxuICAgICAgICAgICAgICAgIGF4aXMudGlja0Zvcm1hdHRlciA9IGZ1bmN0aW9uICh2LCBheGlzKSB7IHJldHVybiBcIlwiICsgb3B0cy50aWNrRm9ybWF0dGVyKHYsIGF4aXMpOyB9O1xuXG4gICAgICAgICAgICBpZiAob3B0cy5hbGlnblRpY2tzV2l0aEF4aXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBvdGhlckF4aXMgPSAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIgPyB4YXhlcyA6IHlheGVzKVtvcHRzLmFsaWduVGlja3NXaXRoQXhpcyAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChvdGhlckF4aXMgJiYgb3RoZXJBeGlzLnVzZWQgJiYgb3RoZXJBeGlzICE9IGF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc2lkZXIgc25hcHBpbmcgbWluL21heCB0byBvdXRlcm1vc3QgbmljZSB0aWNrc1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmljZVRpY2tzID0gYXhpcy50aWNrR2VuZXJhdG9yKGF4aXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmljZVRpY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1pbiA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aXMubWluID0gTWF0aC5taW4oYXhpcy5taW4sIG5pY2VUaWNrc1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5tYXggPT0gbnVsbCAmJiBuaWNlVGlja3MubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzLm1heCA9IE1hdGgubWF4KGF4aXMubWF4LCBuaWNlVGlja3NbbmljZVRpY2tzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGF4aXMudGlja0dlbmVyYXRvciA9IGZ1bmN0aW9uIChheGlzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3B5IHRpY2tzLCBzY2FsZWQgdG8gdGhpcyBheGlzXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGlja3MgPSBbXSwgdiwgaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvdGhlckF4aXMudGlja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gKG90aGVyQXhpcy50aWNrc1tpXS52IC0gb3RoZXJBeGlzLm1pbikgLyAob3RoZXJBeGlzLm1heCAtIG90aGVyQXhpcy5taW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBheGlzLm1pbiArIHYgKiAoYXhpcy5tYXggLSBheGlzLm1pbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlja3MucHVzaCh2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aWNrcztcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBtaWdodCBuZWVkIGFuIGV4dHJhIGRlY2ltYWwgc2luY2UgZm9yY2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIHRpY2tzIGRvbid0IG5lY2Vzc2FyaWx5IGZpdCBuYXR1cmFsbHlcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFheGlzLm1vZGUgJiYgb3B0cy50aWNrRGVjaW1hbHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dHJhRGVjID0gTWF0aC5tYXgoMCwgLU1hdGguZmxvb3IoTWF0aC5sb2coYXhpcy5kZWx0YSkgLyBNYXRoLkxOMTApICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHMgPSBheGlzLnRpY2tHZW5lcmF0b3IoYXhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgcHJvY2VlZCBpZiB0aGUgdGljayBpbnRlcnZhbCByb3VuZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aXRoIGFuIGV4dHJhIGRlY2ltYWwgZG9lc24ndCBnaXZlIHVzIGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHplcm8gYXQgZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISh0cy5sZW5ndGggPiAxICYmIC9cXC4uKjAkLy50ZXN0KCh0c1sxXSAtIHRzWzBdKS50b0ZpeGVkKGV4dHJhRGVjKSkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aXMudGlja0RlY2ltYWxzID0gZXh0cmFEZWM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRUaWNrcyhheGlzKSB7XG4gICAgICAgICAgICB2YXIgb3RpY2tzID0gYXhpcy5vcHRpb25zLnRpY2tzLCB0aWNrcyA9IFtdO1xuICAgICAgICAgICAgaWYgKG90aWNrcyA9PSBudWxsIHx8ICh0eXBlb2Ygb3RpY2tzID09IFwibnVtYmVyXCIgJiYgb3RpY2tzID4gMCkpXG4gICAgICAgICAgICAgICAgdGlja3MgPSBheGlzLnRpY2tHZW5lcmF0b3IoYXhpcyk7XG4gICAgICAgICAgICBlbHNlIGlmIChvdGlja3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG90aWNrcykpXG4gICAgICAgICAgICAgICAgICAgIC8vIGdlbmVyYXRlIHRoZSB0aWNrc1xuICAgICAgICAgICAgICAgICAgICB0aWNrcyA9IG90aWNrcyhheGlzKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzID0gb3RpY2tzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGVhbiB1cC9sYWJlbGlmeSB0aGUgc3VwcGxpZWQgdGlja3MsIGNvcHkgdGhlbSBvdmVyXG4gICAgICAgICAgICB2YXIgaSwgdjtcbiAgICAgICAgICAgIGF4aXMudGlja3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aWNrcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIHQgPSB0aWNrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHQgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICB2ID0gK3RbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0Lmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IHRbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdiA9ICt0O1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbCA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGF4aXMudGlja0Zvcm1hdHRlcih2LCBheGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHYpKVxuICAgICAgICAgICAgICAgICAgICBheGlzLnRpY2tzLnB1c2goeyB2OiB2LCBsYWJlbDogbGFiZWwgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzbmFwUmFuZ2VUb1RpY2tzKGF4aXMsIHRpY2tzKSB7XG4gICAgICAgICAgICBpZiAoYXhpcy5vcHRpb25zLmF1dG9zY2FsZU1hcmdpbiAmJiB0aWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gc25hcCB0byB0aWNrc1xuICAgICAgICAgICAgICAgIGlmIChheGlzLm9wdGlvbnMubWluID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMubWluID0gTWF0aC5taW4oYXhpcy5taW4sIHRpY2tzWzBdLnYpO1xuICAgICAgICAgICAgICAgIGlmIChheGlzLm9wdGlvbnMubWF4ID09IG51bGwgJiYgdGlja3MubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5tYXggPSBNYXRoLm1heChheGlzLm1heCwgdGlja3NbdGlja3MubGVuZ3RoIC0gMV0udik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3KCkge1xuXG4gICAgICAgICAgICBzdXJmYWNlLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5kcmF3QmFja2dyb3VuZCwgW2N0eF0pO1xuXG4gICAgICAgICAgICB2YXIgZ3JpZCA9IG9wdGlvbnMuZ3JpZDtcblxuICAgICAgICAgICAgLy8gZHJhdyBiYWNrZ3JvdW5kLCBpZiBhbnlcbiAgICAgICAgICAgIGlmIChncmlkLnNob3cgJiYgZ3JpZC5iYWNrZ3JvdW5kQ29sb3IpXG4gICAgICAgICAgICAgICAgZHJhd0JhY2tncm91bmQoKTtcblxuICAgICAgICAgICAgaWYgKGdyaWQuc2hvdyAmJiAhZ3JpZC5hYm92ZURhdGEpIHtcbiAgICAgICAgICAgICAgICBkcmF3R3JpZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5kcmF3U2VyaWVzLCBbY3R4LCBzZXJpZXNbaV1dKTtcbiAgICAgICAgICAgICAgICBkcmF3U2VyaWVzKHNlcmllc1tpXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5kcmF3LCBbY3R4XSk7XG5cbiAgICAgICAgICAgIGlmIChncmlkLnNob3cgJiYgZ3JpZC5hYm92ZURhdGEpIHtcbiAgICAgICAgICAgICAgICBkcmF3R3JpZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdXJmYWNlLnJlbmRlcigpO1xuXG4gICAgICAgICAgICAvLyBBIGRyYXcgaW1wbGllcyB0aGF0IGVpdGhlciB0aGUgYXhlcyBvciBkYXRhIGhhdmUgY2hhbmdlZCwgc28gd2VcbiAgICAgICAgICAgIC8vIHNob3VsZCBwcm9iYWJseSB1cGRhdGUgdGhlIG92ZXJsYXkgaGlnaGxpZ2h0cyBhcyB3ZWxsLlxuXG4gICAgICAgICAgICB0cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdFJhbmdlKHJhbmdlcywgY29vcmQpIHtcbiAgICAgICAgICAgIHZhciBheGlzLCBmcm9tLCB0bywga2V5LCBheGVzID0gYWxsQXhlcygpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF4ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBheGlzID0gYXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gY29vcmQpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gY29vcmQgKyBheGlzLm4gKyBcImF4aXNcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyYW5nZXNba2V5XSAmJiBheGlzLm4gPT0gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGNvb3JkICsgXCJheGlzXCI7IC8vIHN1cHBvcnQgeDFheGlzIGFzIHhheGlzXG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5nZXNba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSA9IHJhbmdlc1trZXldLmZyb207XG4gICAgICAgICAgICAgICAgICAgICAgICB0byA9IHJhbmdlc1trZXldLnRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcy1jb21wYXQgc3R1ZmYgLSB0byBiZSByZW1vdmVkIGluIGZ1dHVyZVxuICAgICAgICAgICAgaWYgKCFyYW5nZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGF4aXMgPSBjb29yZCA9PSBcInhcIiA/IHhheGVzWzBdIDogeWF4ZXNbMF07XG4gICAgICAgICAgICAgICAgZnJvbSA9IHJhbmdlc1tjb29yZCArIFwiMVwiXTtcbiAgICAgICAgICAgICAgICB0byA9IHJhbmdlc1tjb29yZCArIFwiMlwiXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYXV0by1yZXZlcnNlIGFzIGFuIGFkZGVkIGJvbnVzXG4gICAgICAgICAgICBpZiAoZnJvbSAhPSBudWxsICYmIHRvICE9IG51bGwgJiYgZnJvbSA+IHRvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IGZyb207XG4gICAgICAgICAgICAgICAgZnJvbSA9IHRvO1xuICAgICAgICAgICAgICAgIHRvID0gdG1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4geyBmcm9tOiBmcm9tLCB0bzogdG8sIGF4aXM6IGF4aXMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdCYWNrZ3JvdW5kKCkge1xuICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocGxvdE9mZnNldC5sZWZ0LCBwbG90T2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBnZXRDb2xvck9yR3JhZGllbnQob3B0aW9ucy5ncmlkLmJhY2tncm91bmRDb2xvciwgcGxvdEhlaWdodCwgMCwgXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDApXCIpO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHBsb3RXaWR0aCwgcGxvdEhlaWdodCk7XG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd0dyaWQoKSB7XG4gICAgICAgICAgICB2YXIgaSwgYXhlcywgYncsIGJjO1xuXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShwbG90T2Zmc2V0LmxlZnQsIHBsb3RPZmZzZXQudG9wKTtcblxuICAgICAgICAgICAgLy8gZHJhdyBtYXJraW5nc1xuICAgICAgICAgICAgdmFyIG1hcmtpbmdzID0gb3B0aW9ucy5ncmlkLm1hcmtpbmdzO1xuICAgICAgICAgICAgaWYgKG1hcmtpbmdzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihtYXJraW5ncykpIHtcbiAgICAgICAgICAgICAgICAgICAgYXhlcyA9IHBsb3QuZ2V0QXhlcygpO1xuICAgICAgICAgICAgICAgICAgICAvLyB4bWluIGV0Yy4gaXMgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIHRvIGJlXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICAgICAgICAgICAgICBheGVzLnhtaW4gPSBheGVzLnhheGlzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgYXhlcy54bWF4ID0gYXhlcy54YXhpcy5tYXg7XG4gICAgICAgICAgICAgICAgICAgIGF4ZXMueW1pbiA9IGF4ZXMueWF4aXMubWluO1xuICAgICAgICAgICAgICAgICAgICBheGVzLnltYXggPSBheGVzLnlheGlzLm1heDtcblxuICAgICAgICAgICAgICAgICAgICBtYXJraW5ncyA9IG1hcmtpbmdzKGF4ZXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBtYXJraW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IG1hcmtpbmdzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgeHJhbmdlID0gZXh0cmFjdFJhbmdlKG0sIFwieFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHlyYW5nZSA9IGV4dHJhY3RSYW5nZShtLCBcInlcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZmlsbCBpbiBtaXNzaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmICh4cmFuZ2UuZnJvbSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgeHJhbmdlLmZyb20gPSB4cmFuZ2UuYXhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIGlmICh4cmFuZ2UudG8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHhyYW5nZS50byA9IHhyYW5nZS5heGlzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHlyYW5nZS5mcm9tID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICB5cmFuZ2UuZnJvbSA9IHlyYW5nZS5heGlzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHlyYW5nZS50byA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgeXJhbmdlLnRvID0geXJhbmdlLmF4aXMubWF4O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhyYW5nZS50byA8IHhyYW5nZS5heGlzLm1pbiB8fCB4cmFuZ2UuZnJvbSA+IHhyYW5nZS5heGlzLm1heCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgeXJhbmdlLnRvIDwgeXJhbmdlLmF4aXMubWluIHx8IHlyYW5nZS5mcm9tID4geXJhbmdlLmF4aXMubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgeHJhbmdlLmZyb20gPSBNYXRoLm1heCh4cmFuZ2UuZnJvbSwgeHJhbmdlLmF4aXMubWluKTtcbiAgICAgICAgICAgICAgICAgICAgeHJhbmdlLnRvID0gTWF0aC5taW4oeHJhbmdlLnRvLCB4cmFuZ2UuYXhpcy5tYXgpO1xuICAgICAgICAgICAgICAgICAgICB5cmFuZ2UuZnJvbSA9IE1hdGgubWF4KHlyYW5nZS5mcm9tLCB5cmFuZ2UuYXhpcy5taW4pO1xuICAgICAgICAgICAgICAgICAgICB5cmFuZ2UudG8gPSBNYXRoLm1pbih5cmFuZ2UudG8sIHlyYW5nZS5heGlzLm1heCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHhlcXVhbCA9IHhyYW5nZS5mcm9tID09PSB4cmFuZ2UudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZXF1YWwgPSB5cmFuZ2UuZnJvbSA9PT0geXJhbmdlLnRvO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ZXF1YWwgJiYgeWVxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gZHJhd1xuICAgICAgICAgICAgICAgICAgICB4cmFuZ2UuZnJvbSA9IE1hdGguZmxvb3IoeHJhbmdlLmF4aXMucDJjKHhyYW5nZS5mcm9tKSk7XG4gICAgICAgICAgICAgICAgICAgIHhyYW5nZS50byA9IE1hdGguZmxvb3IoeHJhbmdlLmF4aXMucDJjKHhyYW5nZS50bykpO1xuICAgICAgICAgICAgICAgICAgICB5cmFuZ2UuZnJvbSA9IE1hdGguZmxvb3IoeXJhbmdlLmF4aXMucDJjKHlyYW5nZS5mcm9tKSk7XG4gICAgICAgICAgICAgICAgICAgIHlyYW5nZS50byA9IE1hdGguZmxvb3IoeXJhbmdlLmF4aXMucDJjKHlyYW5nZS50bykpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ZXF1YWwgfHwgeWVxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGluZVdpZHRoID0gbS5saW5lV2lkdGggfHwgb3B0aW9ucy5ncmlkLm1hcmtpbmdzTGluZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YlBpeGVsID0gbGluZVdpZHRoICUgMiA/IDAuNSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBtLmNvbG9yIHx8IG9wdGlvbnMuZ3JpZC5tYXJraW5nc0NvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHhyYW5nZS50byArIHN1YlBpeGVsLCB5cmFuZ2UuZnJvbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4cmFuZ2UudG8gKyBzdWJQaXhlbCwgeXJhbmdlLnRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4cmFuZ2UuZnJvbSwgeXJhbmdlLnRvICsgc3ViUGl4ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeHJhbmdlLnRvLCB5cmFuZ2UudG8gKyBzdWJQaXhlbCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IG0uY29sb3IgfHwgb3B0aW9ucy5ncmlkLm1hcmtpbmdzQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeHJhbmdlLmZyb20sIHlyYW5nZS50byxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4cmFuZ2UudG8gLSB4cmFuZ2UuZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5cmFuZ2UuZnJvbSAtIHlyYW5nZS50byk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRyYXcgdGhlIHRpY2tzXG4gICAgICAgICAgICBheGVzID0gYWxsQXhlcygpO1xuICAgICAgICAgICAgYncgPSBvcHRpb25zLmdyaWQuYm9yZGVyV2lkdGg7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXhlcy5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgICAgIHZhciBheGlzID0gYXhlc1tqXSwgYm94ID0gYXhpcy5ib3gsXG4gICAgICAgICAgICAgICAgICAgIHQgPSBheGlzLnRpY2tMZW5ndGgsIHgsIHksIHhvZmYsIHlvZmY7XG4gICAgICAgICAgICAgICAgaWYgKCFheGlzLnNob3cgfHwgYXhpcy50aWNrcy5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcblxuICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIGVkZ2VzXG4gICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSBcImZ1bGxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSAoYXhpcy5wb3NpdGlvbiA9PSBcInRvcFwiID8gMCA6IHBsb3RIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gYm94LnRvcCAtIHBsb3RPZmZzZXQudG9wICsgKGF4aXMucG9zaXRpb24gPT0gXCJ0b3BcIiA/IGJveC5oZWlnaHQgOiAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSBcImZ1bGxcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSAoYXhpcy5wb3NpdGlvbiA9PSBcImxlZnRcIiA/IDAgOiBwbG90V2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gYm94LmxlZnQgLSBwbG90T2Zmc2V0LmxlZnQgKyAoYXhpcy5wb3NpdGlvbiA9PSBcImxlZnRcIiA/IGJveC53aWR0aCA6IDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgdGljayBiYXJcbiAgICAgICAgICAgICAgICBpZiAoIWF4aXMuaW5uZXJtb3N0KSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGF4aXMub3B0aW9ucy5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB4b2ZmID0geW9mZiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHhvZmYgPSBwbG90V2lkdGggKyAxO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB5b2ZmID0gcGxvdEhlaWdodCArIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0eC5saW5lV2lkdGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9IE1hdGguZmxvb3IoeSkgKyAwLjU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBNYXRoLmZsb29yKHgpICsgMC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4LCB5KTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgeG9mZiwgeSArIHlvZmYpO1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZHJhdyB0aWNrc1xuXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYXhpcy5vcHRpb25zLnRpY2tDb2xvcjtcblxuICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXhpcy50aWNrcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdiA9IGF4aXMudGlja3NbaV0udjtcblxuICAgICAgICAgICAgICAgICAgICB4b2ZmID0geW9mZiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHYpIHx8IHYgPCBheGlzLm1pbiB8fCB2ID4gYXhpcy5tYXhcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNraXAgdGhvc2UgbHlpbmcgb24gdGhlIGF4ZXMgaWYgd2UgZ290IGEgYm9yZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCAodCA9PSBcImZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICgodHlwZW9mIGJ3ID09IFwib2JqZWN0XCIgJiYgYndbYXhpcy5wb3NpdGlvbl0gPiAwKSB8fCBidyA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHYgPT0gYXhpcy5taW4gfHwgdiA9PSBheGlzLm1heCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gYXhpcy5wMmModik7XG4gICAgICAgICAgICAgICAgICAgICAgICB5b2ZmID0gdCA9PSBcImZ1bGxcIiA/IC1wbG90SGVpZ2h0IDogdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMucG9zaXRpb24gPT0gXCJ0b3BcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5b2ZmID0gLXlvZmY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gYXhpcy5wMmModik7XG4gICAgICAgICAgICAgICAgICAgICAgICB4b2ZmID0gdCA9PSBcImZ1bGxcIiA/IC1wbG90V2lkdGggOiB0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5wb3NpdGlvbiA9PSBcImxlZnRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4b2ZmID0gLXhvZmY7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3R4LmxpbmVXaWR0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IE1hdGguZmxvb3IoeCkgKyAwLjU7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSA9IE1hdGguZmxvb3IoeSkgKyAwLjU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHggKyB4b2ZmLCB5ICsgeW9mZik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIGRyYXcgYm9yZGVyXG4gICAgICAgICAgICBpZiAoYncpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBlaXRoZXIgYm9yZGVyV2lkdGggb3IgYm9yZGVyQ29sb3IgaXMgYW4gb2JqZWN0LCB0aGVuIGRyYXcgdGhlIGJvcmRlclxuICAgICAgICAgICAgICAgIC8vIGxpbmUgYnkgbGluZSBpbnN0ZWFkIG9mIGFzIG9uZSByZWN0YW5nbGVcbiAgICAgICAgICAgICAgICBiYyA9IG9wdGlvbnMuZ3JpZC5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgYncgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgYmMgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJ3ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidyA9IHt0b3A6IGJ3LCByaWdodDogYncsIGJvdHRvbTogYncsIGxlZnQ6IGJ3fTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGJjICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYyA9IHt0b3A6IGJjLCByaWdodDogYmMsIGJvdHRvbTogYmMsIGxlZnQ6IGJjfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChidy50b3AgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBiYy50b3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gYncudG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbygwIC0gYncubGVmdCwgMCAtIGJ3LnRvcC8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8ocGxvdFdpZHRoLCAwIC0gYncudG9wLzIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ3LnJpZ2h0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYmMucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gYncucmlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHBsb3RXaWR0aCArIGJ3LnJpZ2h0IC8gMiwgMCAtIGJ3LnRvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBsb3RXaWR0aCArIGJ3LnJpZ2h0IC8gMiwgcGxvdEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYncuYm90dG9tID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYmMuYm90dG9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGJ3LmJvdHRvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8ocGxvdFdpZHRoICsgYncucmlnaHQsIHBsb3RIZWlnaHQgKyBidy5ib3R0b20gLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oMCwgcGxvdEhlaWdodCArIGJ3LmJvdHRvbSAvIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ3LmxlZnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBiYy5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGJ3LmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKDAgLSBidy5sZWZ0LzIsIHBsb3RIZWlnaHQgKyBidy5ib3R0b20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbygwLSBidy5sZWZ0LzIsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gYnc7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IG9wdGlvbnMuZ3JpZC5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QoLWJ3LzIsIC1idy8yLCBwbG90V2lkdGggKyBidywgcGxvdEhlaWdodCArIGJ3KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3QXhpc0xhYmVscygpIHtcblxuICAgICAgICAgICAgJC5lYWNoKGFsbEF4ZXMoKSwgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYm94ID0gYXhpcy5ib3gsXG4gICAgICAgICAgICAgICAgICAgIGxlZ2FjeVN0eWxlcyA9IGF4aXMuZGlyZWN0aW9uICsgXCJBeGlzIFwiICsgYXhpcy5kaXJlY3Rpb24gKyBheGlzLm4gKyBcIkF4aXNcIixcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIgPSBcImZsb3QtXCIgKyBheGlzLmRpcmVjdGlvbiArIFwiLWF4aXMgZmxvdC1cIiArIGF4aXMuZGlyZWN0aW9uICsgYXhpcy5uICsgXCItYXhpcyBcIiArIGxlZ2FjeVN0eWxlcyxcbiAgICAgICAgICAgICAgICAgICAgZm9udCA9IGF4aXMub3B0aW9ucy5mb250IHx8IFwiZmxvdC10aWNrLWxhYmVsIHRpY2tMYWJlbFwiLFxuICAgICAgICAgICAgICAgICAgICB0aWNrLCB4LCB5LCBoYWxpZ24sIHZhbGlnbjtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0ZXh0IGJlZm9yZSBjaGVja2luZyBmb3IgYXhpcy5zaG93IGFuZCB0aWNrcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHBsdWdpbnMsIGxpa2UgZmxvdC10aWNrcm90b3IsIHRoYXQgZHJhdyB0aGVpciBvd25cbiAgICAgICAgICAgICAgICAvLyB0aWNrIGxhYmVscyB3aWxsIGVuZCB1cCB3aXRoIGJvdGggdGhlaXJzIGFuZCB0aGUgZGVmYXVsdHMuXG5cbiAgICAgICAgICAgICAgICBzdXJmYWNlLnJlbW92ZVRleHQobGF5ZXIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFheGlzLnNob3cgfHwgYXhpcy50aWNrcy5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBheGlzLnRpY2tzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGljayA9IGF4aXMudGlja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGljay5sYWJlbCB8fCB0aWNrLnYgPCBheGlzLm1pbiB8fCB0aWNrLnYgPiBheGlzLm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHggPSBwbG90T2Zmc2V0LmxlZnQgKyBheGlzLnAyYyh0aWNrLnYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMucG9zaXRpb24gPT0gXCJib3R0b21cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBib3gudG9wICsgYm94LnBhZGRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBib3gudG9wICsgYm94LmhlaWdodCAtIGJveC5wYWRkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlnbiA9IFwiYm90dG9tXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZ24gPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IHBsb3RPZmZzZXQudG9wICsgYXhpcy5wMmModGljay52KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzLnBvc2l0aW9uID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IGJveC5sZWZ0ICsgYm94LndpZHRoIC0gYm94LnBhZGRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsaWduID0gXCJyaWdodFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gYm94LmxlZnQgKyBib3gucGFkZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN1cmZhY2UuYWRkVGV4dChsYXllciwgeCwgeSwgdGljay5sYWJlbCwgZm9udCwgbnVsbCwgbnVsbCwgaGFsaWduLCB2YWxpZ24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd1NlcmllcyhzZXJpZXMpIHtcbiAgICAgICAgICAgIGlmIChzZXJpZXMubGluZXMuc2hvdylcbiAgICAgICAgICAgICAgICBkcmF3U2VyaWVzTGluZXMoc2VyaWVzKTtcbiAgICAgICAgICAgIGlmIChzZXJpZXMuYmFycy5zaG93KVxuICAgICAgICAgICAgICAgIGRyYXdTZXJpZXNCYXJzKHNlcmllcyk7XG4gICAgICAgICAgICBpZiAoc2VyaWVzLnBvaW50cy5zaG93KVxuICAgICAgICAgICAgICAgIGRyYXdTZXJpZXNQb2ludHMoc2VyaWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdTZXJpZXNMaW5lcyhzZXJpZXMpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHBsb3RMaW5lKGRhdGFwb2ludHMsIHhvZmZzZXQsIHlvZmZzZXQsIGF4aXN4LCBheGlzeSkge1xuICAgICAgICAgICAgICAgIHZhciBwb2ludHMgPSBkYXRhcG9pbnRzLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgcHMgPSBkYXRhcG9pbnRzLnBvaW50c2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgcHJldnggPSBudWxsLCBwcmV2eSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHBzOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgeDEgPSBwb2ludHNbaSAtIHBzXSwgeTEgPSBwb2ludHNbaSAtIHBzICsgMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IHBvaW50c1tpXSwgeTIgPSBwb2ludHNbaSArIDFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSA9PSBudWxsIHx8IHgyID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeW1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPD0geTIgJiYgeTEgPCBheGlzeS5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh5MiA8IGF4aXN5Lm1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgICAvLyBsaW5lIHNlZ21lbnQgaXMgb3V0c2lkZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29tcHV0ZSBuZXcgaW50ZXJzZWN0aW9uIHBvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IChheGlzeS5taW4gLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gYXhpc3kubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHkyIDw9IHkxICYmIHkyIDwgYXhpc3kubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPCBheGlzeS5taW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IChheGlzeS5taW4gLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gYXhpc3kubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHltYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkxID49IHkyICYmIHkxID4gYXhpc3kubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeTIgPiBheGlzeS5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IChheGlzeS5tYXggLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gYXhpc3kubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHkyID49IHkxICYmIHkyID4gYXhpc3kubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPiBheGlzeS5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IChheGlzeS5tYXggLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gYXhpc3kubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHhtaW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxIDw9IHgyICYmIHgxIDwgYXhpc3gubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDIgPCBheGlzeC5taW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IChheGlzeC5taW4gLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gYXhpc3gubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHgyIDw9IHgxICYmIHgyIDwgYXhpc3gubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPCBheGlzeC5taW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IChheGlzeC5taW4gLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gYXhpc3gubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHhtYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxID49IHgyICYmIHgxID4gYXhpc3gubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDIgPiBheGlzeC5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IChheGlzeC5tYXggLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gYXhpc3gubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHgyID49IHgxICYmIHgyID4gYXhpc3gubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPiBheGlzeC5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IChheGlzeC5tYXggLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gYXhpc3gubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxICE9IHByZXZ4IHx8IHkxICE9IHByZXZ5KVxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhheGlzeC5wMmMoeDEpICsgeG9mZnNldCwgYXhpc3kucDJjKHkxKSArIHlvZmZzZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHByZXZ4ID0geDI7XG4gICAgICAgICAgICAgICAgICAgIHByZXZ5ID0geTI7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgyKSArIHhvZmZzZXQsIGF4aXN5LnAyYyh5MikgKyB5b2Zmc2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBwbG90TGluZUFyZWEoZGF0YXBvaW50cywgYXhpc3gsIGF4aXN5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IGRhdGFwb2ludHMucG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICBwcyA9IGRhdGFwb2ludHMucG9pbnRzaXplLFxuICAgICAgICAgICAgICAgICAgICBib3R0b20gPSBNYXRoLm1pbihNYXRoLm1heCgwLCBheGlzeS5taW4pLCBheGlzeS5tYXgpLFxuICAgICAgICAgICAgICAgICAgICBpID0gMCwgdG9wLCBhcmVhT3BlbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB5cG9zID0gMSwgc2VnbWVudFN0YXJ0ID0gMCwgc2VnbWVudEVuZCA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyB3ZSBwcm9jZXNzIGVhY2ggc2VnbWVudCBpbiB0d28gdHVybnMsIGZpcnN0IGZvcndhcmRcbiAgICAgICAgICAgICAgICAvLyBkaXJlY3Rpb24gdG8gc2tldGNoIG91dCB0b3AsIHRoZW4gb25jZSB3ZSBoaXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gZW5kIHdlIGdvIGJhY2t3YXJkcyB0byBza2V0Y2ggdGhlIGJvdHRvbVxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcyA+IDAgJiYgaSA+IHBvaW50cy5sZW5ndGggKyBwcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGkgKz0gcHM7IC8vIHBzIGlzIG5lZ2F0aXZlIGlmIGdvaW5nIGJhY2t3YXJkc1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB4MSA9IHBvaW50c1tpIC0gcHNdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSBwb2ludHNbaSAtIHBzICsgeXBvc10sXG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IHBvaW50c1tpXSwgeTIgPSBwb2ludHNbaSArIHlwb3NdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmVhT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBzID4gMCAmJiB4MSAhPSBudWxsICYmIHgyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhdCB0dXJuaW5nIHBvaW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VnbWVudEVuZCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHMgPSAtcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeXBvcyA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcyA8IDAgJiYgaSA9PSBzZWdtZW50U3RhcnQgKyBwcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbmUgd2l0aCB0aGUgcmV2ZXJzZSBzd2VlcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYU9wZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcyA9IC1wcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5cG9zID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gc2VnbWVudFN0YXJ0ID0gc2VnbWVudEVuZCArIHBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxID09IG51bGwgfHwgeDIgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgeCB2YWx1ZXNcblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeG1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPD0geDIgJiYgeDEgPCBheGlzeC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MiA8IGF4aXN4Lm1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gKGF4aXN4Lm1pbiAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBheGlzeC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeDIgPD0geDEgJiYgeDIgPCBheGlzeC5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MSA8IGF4aXN4Lm1pbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gKGF4aXN4Lm1pbiAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBheGlzeC5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeG1heFxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPj0geDIgJiYgeDEgPiBheGlzeC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MiA+IGF4aXN4Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gKGF4aXN4Lm1heCAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSBheGlzeC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeDIgPj0geDEgJiYgeDIgPiBheGlzeC5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4MSA+IGF4aXN4Lm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gKGF4aXN4Lm1heCAtIHgxKSAvICh4MiAtIHgxKSAqICh5MiAtIHkxKSArIHkxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBheGlzeC5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFyZWFPcGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvcGVuIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oYXhpc3gucDJjKHgxKSwgYXhpc3kucDJjKGJvdHRvbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYU9wZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbm93IGZpcnN0IGNoZWNrIHRoZSBjYXNlIHdoZXJlIGJvdGggaXMgb3V0c2lkZVxuICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPj0gYXhpc3kubWF4ICYmIHkyID49IGF4aXN5Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDEpLCBheGlzeS5wMmMoYXhpc3kubWF4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MiksIGF4aXN5LnAyYyhheGlzeS5tYXgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHkxIDw9IGF4aXN5Lm1pbiAmJiB5MiA8PSBheGlzeS5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgxKSwgYXhpc3kucDJjKGF4aXN5Lm1pbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDIpLCBheGlzeS5wMmMoYXhpc3kubWluKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgaXQncyBhIGJpdCBtb3JlIGNvbXBsaWNhdGVkLCB0aGVyZSBtaWdodFxuICAgICAgICAgICAgICAgICAgICAvLyBiZSBhIGZsYXQgbWF4ZWQgb3V0IHJlY3RhbmdsZSBmaXJzdCwgdGhlbiBhXG4gICAgICAgICAgICAgICAgICAgIC8vIHRyaWFuZ3VsYXIgY3V0b3V0IG9yIHJldmVyc2U7IHRvIGZpbmQgdGhlc2VcbiAgICAgICAgICAgICAgICAgICAgLy8ga2VlcCB0cmFjayBvZiB0aGUgY3VycmVudCB4IHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICB2YXIgeDFvbGQgPSB4MSwgeDJvbGQgPSB4MjtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHRoZSB5IHZhbHVlcywgd2l0aG91dCBzaG9ydGN1dHRpbmcsIHdlXG4gICAgICAgICAgICAgICAgICAgIC8vIGdvIHRocm91Z2ggYWxsIGNhc2VzIGluIHR1cm5cblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeW1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPD0geTIgJiYgeTEgPCBheGlzeS5taW4gJiYgeTIgPj0gYXhpc3kubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IChheGlzeS5taW4gLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gYXhpc3kubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHkyIDw9IHkxICYmIHkyIDwgYXhpc3kubWluICYmIHkxID49IGF4aXN5Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSAoYXhpc3kubWluIC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGF4aXN5Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB5bWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICh5MSA+PSB5MiAmJiB5MSA+IGF4aXN5Lm1heCAmJiB5MiA8PSBheGlzeS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gKGF4aXN5Lm1heCAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSBheGlzeS5tYXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoeTIgPj0geTEgJiYgeTIgPiBheGlzeS5tYXggJiYgeTEgPD0gYXhpc3kubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IChheGlzeS5tYXggLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkyID0gYXhpc3kubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHggdmFsdWUgd2FzIGNoYW5nZWQgd2UgZ290IGEgcmVjdGFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGZpbGxcbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxICE9IHgxb2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MW9sZCksIGF4aXN5LnAyYyh5MSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgZ29lcyB0byAoeDEsIHkxKSwgYnV0IHdlIGZpbGwgdGhhdCBiZWxvd1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZmlsbCB0cmlhbmd1bGFyIHNlY3Rpb24sIHRoaXMgc29tZXRpbWVzIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAvLyBpbiByZWR1bmRhbnQgcG9pbnRzIGlmICh4MSwgeTEpIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIGZyb20gcHJldmlvdXMgbGluZSB0bywgYnV0IHdlIGp1c3QgaWdub3JlIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDEpLCBheGlzeS5wMmMoeTEpKTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDIpLCBheGlzeS5wMmMoeTIpKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBmaWxsIHRoZSBvdGhlciByZWN0YW5nbGUgaWYgaXQncyB0aGVyZVxuICAgICAgICAgICAgICAgICAgICBpZiAoeDIgIT0geDJvbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgyKSwgYXhpc3kucDJjKHkyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4Mm9sZCksIGF4aXN5LnAyYyh5MikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShwbG90T2Zmc2V0LmxlZnQsIHBsb3RPZmZzZXQudG9wKTtcbiAgICAgICAgICAgIGN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcblxuICAgICAgICAgICAgdmFyIGx3ID0gc2VyaWVzLmxpbmVzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICBzdyA9IHNlcmllcy5zaGFkb3dTaXplO1xuICAgICAgICAgICAgLy8gRklYTUU6IGNvbnNpZGVyIGFub3RoZXIgZm9ybSBvZiBzaGFkb3cgd2hlbiBmaWxsaW5nIGlzIHR1cm5lZCBvblxuICAgICAgICAgICAgaWYgKGx3ID4gMCAmJiBzdyA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBkcmF3IHNoYWRvdyBhcyBhIHRoaWNrIGFuZCB0aGluIGxpbmUgd2l0aCB0cmFuc3BhcmVuY3lcbiAgICAgICAgICAgICAgICBjdHgubGluZVdpZHRoID0gc3c7XG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDAsMCwwLDAuMSlcIjtcbiAgICAgICAgICAgICAgICAvLyBwb3NpdGlvbiBzaGFkb3cgYXQgYW5nbGUgZnJvbSB0aGUgbWlkIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLlBJLzE4O1xuICAgICAgICAgICAgICAgIHBsb3RMaW5lKHNlcmllcy5kYXRhcG9pbnRzLCBNYXRoLnNpbihhbmdsZSkgKiAobHcvMiArIHN3LzIpLCBNYXRoLmNvcyhhbmdsZSkgKiAobHcvMiArIHN3LzIpLCBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcyk7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHN3LzI7XG4gICAgICAgICAgICAgICAgcGxvdExpbmUoc2VyaWVzLmRhdGFwb2ludHMsIE1hdGguc2luKGFuZ2xlKSAqIChsdy8yICsgc3cvNCksIE1hdGguY29zKGFuZ2xlKSAqIChsdy8yICsgc3cvNCksIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGx3O1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc2VyaWVzLmNvbG9yO1xuICAgICAgICAgICAgdmFyIGZpbGxTdHlsZSA9IGdldEZpbGxTdHlsZShzZXJpZXMubGluZXMsIHNlcmllcy5jb2xvciwgMCwgcGxvdEhlaWdodCk7XG4gICAgICAgICAgICBpZiAoZmlsbFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcbiAgICAgICAgICAgICAgICBwbG90TGluZUFyZWEoc2VyaWVzLmRhdGFwb2ludHMsIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGx3ID4gMClcbiAgICAgICAgICAgICAgICBwbG90TGluZShzZXJpZXMuZGF0YXBvaW50cywgMCwgMCwgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMpO1xuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdTZXJpZXNQb2ludHMoc2VyaWVzKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBwbG90UG9pbnRzKGRhdGFwb2ludHMsIHJhZGl1cywgZmlsbFN0eWxlLCBvZmZzZXQsIHNoYWRvdywgYXhpc3gsIGF4aXN5LCBzeW1ib2wpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gZGF0YXBvaW50cy5wb2ludHMsIHBzID0gZGF0YXBvaW50cy5wb2ludHNpemU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHggPSBwb2ludHNbaV0sIHkgPSBwb2ludHNbaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSBudWxsIHx8IHggPCBheGlzeC5taW4gfHwgeCA+IGF4aXN4Lm1heCB8fCB5IDwgYXhpc3kubWluIHx8IHkgPiBheGlzeS5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIHggPSBheGlzeC5wMmMoeCk7XG4gICAgICAgICAgICAgICAgICAgIHkgPSBheGlzeS5wMmMoeSkgKyBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzeW1ib2wgPT0gXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5hcmMoeCwgeSwgcmFkaXVzLCAwLCBzaGFkb3cgPyBNYXRoLlBJIDogTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3ltYm9sKGN0eCwgeCwgeSwgcmFkaXVzLCBzaGFkb3cpO1xuICAgICAgICAgICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGxTdHlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGZpbGxTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocGxvdE9mZnNldC5sZWZ0LCBwbG90T2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgICAgIHZhciBsdyA9IHNlcmllcy5wb2ludHMubGluZVdpZHRoLFxuICAgICAgICAgICAgICAgIHN3ID0gc2VyaWVzLnNoYWRvd1NpemUsXG4gICAgICAgICAgICAgICAgcmFkaXVzID0gc2VyaWVzLnBvaW50cy5yYWRpdXMsXG4gICAgICAgICAgICAgICAgc3ltYm9sID0gc2VyaWVzLnBvaW50cy5zeW1ib2w7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIHNldHMgdGhlIGxpbmUgd2lkdGggdG8gMCwgd2UgY2hhbmdlIGl0IHRvIGEgdmVyeSBcbiAgICAgICAgICAgIC8vIHNtYWxsIHZhbHVlLiBBIGxpbmUgd2lkdGggb2YgMCBzZWVtcyB0byBmb3JjZSB0aGUgZGVmYXVsdCBvZiAxLlxuICAgICAgICAgICAgLy8gRG9pbmcgdGhlIGNvbmRpdGlvbmFsIGhlcmUgYWxsb3dzIHRoZSBzaGFkb3cgc2V0dGluZyB0byBzdGlsbCBiZSBcbiAgICAgICAgICAgIC8vIG9wdGlvbmFsIGV2ZW4gd2l0aCBhIGxpbmVXaWR0aCBvZiAwLlxuXG4gICAgICAgICAgICBpZiggbHcgPT0gMCApXG4gICAgICAgICAgICAgICAgbHcgPSAwLjAwMDE7XG5cbiAgICAgICAgICAgIGlmIChsdyA+IDAgJiYgc3cgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gZHJhdyBzaGFkb3cgaW4gdHdvIHN0ZXBzXG4gICAgICAgICAgICAgICAgdmFyIHcgPSBzdyAvIDI7XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHc7XG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gXCJyZ2JhKDAsMCwwLDAuMSlcIjtcbiAgICAgICAgICAgICAgICBwbG90UG9pbnRzKHNlcmllcy5kYXRhcG9pbnRzLCByYWRpdXMsIG51bGwsIHcgKyB3LzIsIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcywgc3ltYm9sKTtcblxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgwLDAsMCwwLjIpXCI7XG4gICAgICAgICAgICAgICAgcGxvdFBvaW50cyhzZXJpZXMuZGF0YXBvaW50cywgcmFkaXVzLCBudWxsLCB3LzIsIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcywgc3ltYm9sKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGx3O1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc2VyaWVzLmNvbG9yO1xuICAgICAgICAgICAgcGxvdFBvaW50cyhzZXJpZXMuZGF0YXBvaW50cywgcmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWxsU3R5bGUoc2VyaWVzLnBvaW50cywgc2VyaWVzLmNvbG9yKSwgMCwgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzLCBzeW1ib2wpO1xuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdCYXIoeCwgeSwgYiwgYmFyTGVmdCwgYmFyUmlnaHQsIGZpbGxTdHlsZUNhbGxiYWNrLCBheGlzeCwgYXhpc3ksIGMsIGhvcml6b250YWwsIGxpbmVXaWR0aCkge1xuICAgICAgICAgICAgdmFyIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCxcbiAgICAgICAgICAgICAgICBkcmF3TGVmdCwgZHJhd1JpZ2h0LCBkcmF3VG9wLCBkcmF3Qm90dG9tLFxuICAgICAgICAgICAgICAgIHRtcDtcblxuICAgICAgICAgICAgLy8gaW4gaG9yaXpvbnRhbCBtb2RlLCB3ZSBzdGFydCB0aGUgYmFyIGZyb20gdGhlIGxlZnRcbiAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgZnJvbSB0aGUgYm90dG9tIHNvIGl0IGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgIC8vIGhvcml6b250YWwgcmF0aGVyIHRoYW4gdmVydGljYWxcbiAgICAgICAgICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgZHJhd0JvdHRvbSA9IGRyYXdSaWdodCA9IGRyYXdUb3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRyYXdMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGVmdCA9IGI7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSB4O1xuICAgICAgICAgICAgICAgIHRvcCA9IHkgKyBiYXJMZWZ0O1xuICAgICAgICAgICAgICAgIGJvdHRvbSA9IHkgKyBiYXJSaWdodDtcblxuICAgICAgICAgICAgICAgIC8vIGFjY291bnQgZm9yIG5lZ2F0aXZlIGJhcnNcbiAgICAgICAgICAgICAgICBpZiAocmlnaHQgPCBsZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcCA9IHJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IGxlZnQ7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSB0bXA7XG4gICAgICAgICAgICAgICAgICAgIGRyYXdMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZHJhd1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZHJhd0xlZnQgPSBkcmF3UmlnaHQgPSBkcmF3VG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkcmF3Qm90dG9tID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHggKyBiYXJMZWZ0O1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0geCArIGJhclJpZ2h0O1xuICAgICAgICAgICAgICAgIGJvdHRvbSA9IGI7XG4gICAgICAgICAgICAgICAgdG9wID0geTtcblxuICAgICAgICAgICAgICAgIC8vIGFjY291bnQgZm9yIG5lZ2F0aXZlIGJhcnNcbiAgICAgICAgICAgICAgICBpZiAodG9wIDwgYm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRtcCA9IHRvcDtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gYm90dG9tO1xuICAgICAgICAgICAgICAgICAgICBib3R0b20gPSB0bXA7XG4gICAgICAgICAgICAgICAgICAgIGRyYXdCb3R0b20gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBkcmF3VG9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGlwXG4gICAgICAgICAgICBpZiAocmlnaHQgPCBheGlzeC5taW4gfHwgbGVmdCA+IGF4aXN4Lm1heCB8fFxuICAgICAgICAgICAgICAgIHRvcCA8IGF4aXN5Lm1pbiB8fCBib3R0b20gPiBheGlzeS5tYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAobGVmdCA8IGF4aXN4Lm1pbikge1xuICAgICAgICAgICAgICAgIGxlZnQgPSBheGlzeC5taW47XG4gICAgICAgICAgICAgICAgZHJhd0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJpZ2h0ID4gYXhpc3gubWF4KSB7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSBheGlzeC5tYXg7XG4gICAgICAgICAgICAgICAgZHJhd1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChib3R0b20gPCBheGlzeS5taW4pIHtcbiAgICAgICAgICAgICAgICBib3R0b20gPSBheGlzeS5taW47XG4gICAgICAgICAgICAgICAgZHJhd0JvdHRvbSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodG9wID4gYXhpc3kubWF4KSB7XG4gICAgICAgICAgICAgICAgdG9wID0gYXhpc3kubWF4O1xuICAgICAgICAgICAgICAgIGRyYXdUb3AgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGVmdCA9IGF4aXN4LnAyYyhsZWZ0KTtcbiAgICAgICAgICAgIGJvdHRvbSA9IGF4aXN5LnAyYyhib3R0b20pO1xuICAgICAgICAgICAgcmlnaHQgPSBheGlzeC5wMmMocmlnaHQpO1xuICAgICAgICAgICAgdG9wID0gYXhpc3kucDJjKHRvcCk7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdGhlIGJhclxuICAgICAgICAgICAgaWYgKGZpbGxTdHlsZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBmaWxsU3R5bGVDYWxsYmFjayhib3R0b20sIHRvcCk7XG4gICAgICAgICAgICAgICAgYy5maWxsUmVjdChsZWZ0LCB0b3AsIHJpZ2h0IC0gbGVmdCwgYm90dG9tIC0gdG9wKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkcmF3IG91dGxpbmVcbiAgICAgICAgICAgIGlmIChsaW5lV2lkdGggPiAwICYmIChkcmF3TGVmdCB8fCBkcmF3UmlnaHQgfHwgZHJhd1RvcCB8fCBkcmF3Qm90dG9tKSkge1xuICAgICAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBGSVhNRTogaW5saW5lIG1vdmVUbyBpcyBidWdneSB3aXRoIGV4Y2FudmFzXG4gICAgICAgICAgICAgICAgYy5tb3ZlVG8obGVmdCwgYm90dG9tKTtcbiAgICAgICAgICAgICAgICBpZiAoZHJhd0xlZnQpXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVRvKGxlZnQsIHRvcCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjLm1vdmVUbyhsZWZ0LCB0b3ApO1xuICAgICAgICAgICAgICAgIGlmIChkcmF3VG9wKVxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbyhyaWdodCwgdG9wKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGMubW92ZVRvKHJpZ2h0LCB0b3ApO1xuICAgICAgICAgICAgICAgIGlmIChkcmF3UmlnaHQpXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVRvKHJpZ2h0LCBib3R0b20pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8ocmlnaHQsIGJvdHRvbSk7XG4gICAgICAgICAgICAgICAgaWYgKGRyYXdCb3R0b20pXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVRvKGxlZnQsIGJvdHRvbSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjLm1vdmVUbyhsZWZ0LCBib3R0b20pO1xuICAgICAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3U2VyaWVzQmFycyhzZXJpZXMpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHBsb3RCYXJzKGRhdGFwb2ludHMsIGJhckxlZnQsIGJhclJpZ2h0LCBmaWxsU3R5bGVDYWxsYmFjaywgYXhpc3gsIGF4aXN5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IGRhdGFwb2ludHMucG9pbnRzLCBwcyA9IGRhdGFwb2ludHMucG9pbnRzaXplO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2ludHNbaV0gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBkcmF3QmFyKHBvaW50c1tpXSwgcG9pbnRzW2kgKyAxXSwgcG9pbnRzW2kgKyAyXSwgYmFyTGVmdCwgYmFyUmlnaHQsIGZpbGxTdHlsZUNhbGxiYWNrLCBheGlzeCwgYXhpc3ksIGN0eCwgc2VyaWVzLmJhcnMuaG9yaXpvbnRhbCwgc2VyaWVzLmJhcnMubGluZVdpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHBsb3RPZmZzZXQubGVmdCwgcGxvdE9mZnNldC50b3ApO1xuXG4gICAgICAgICAgICAvLyBGSVhNRTogZmlndXJlIG91dCBhIHdheSB0byBhZGQgc2hhZG93cyAoZm9yIGluc3RhbmNlIGFsb25nIHRoZSByaWdodCBlZGdlKVxuICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHNlcmllcy5iYXJzLmxpbmVXaWR0aDtcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHNlcmllcy5jb2xvcjtcblxuICAgICAgICAgICAgdmFyIGJhckxlZnQ7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc2VyaWVzLmJhcnMuYWxpZ24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAtc2VyaWVzLmJhcnMuYmFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAtc2VyaWVzLmJhcnMuYmFyV2lkdGggLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZmlsbFN0eWxlQ2FsbGJhY2sgPSBzZXJpZXMuYmFycy5maWxsID8gZnVuY3Rpb24gKGJvdHRvbSwgdG9wKSB7IHJldHVybiBnZXRGaWxsU3R5bGUoc2VyaWVzLmJhcnMsIHNlcmllcy5jb2xvciwgYm90dG9tLCB0b3ApOyB9IDogbnVsbDtcbiAgICAgICAgICAgIHBsb3RCYXJzKHNlcmllcy5kYXRhcG9pbnRzLCBiYXJMZWZ0LCBiYXJMZWZ0ICsgc2VyaWVzLmJhcnMuYmFyV2lkdGgsIGZpbGxTdHlsZUNhbGxiYWNrLCBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcyk7XG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RmlsbFN0eWxlKGZpbGxvcHRpb25zLCBzZXJpZXNDb2xvciwgYm90dG9tLCB0b3ApIHtcbiAgICAgICAgICAgIHZhciBmaWxsID0gZmlsbG9wdGlvbnMuZmlsbDtcbiAgICAgICAgICAgIGlmICghZmlsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgaWYgKGZpbGxvcHRpb25zLmZpbGxDb2xvcilcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q29sb3JPckdyYWRpZW50KGZpbGxvcHRpb25zLmZpbGxDb2xvciwgYm90dG9tLCB0b3AsIHNlcmllc0NvbG9yKTtcblxuICAgICAgICAgICAgdmFyIGMgPSAkLmNvbG9yLnBhcnNlKHNlcmllc0NvbG9yKTtcbiAgICAgICAgICAgIGMuYSA9IHR5cGVvZiBmaWxsID09IFwibnVtYmVyXCIgPyBmaWxsIDogMC40O1xuICAgICAgICAgICAgYy5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgIHJldHVybiBjLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbnNlcnRMZWdlbmQoKSB7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxlZ2VuZC5jb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICQob3B0aW9ucy5sZWdlbmQuY29udGFpbmVyKS5odG1sKFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5maW5kKFwiLmxlZ2VuZFwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmxlZ2VuZC5zaG93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZnJhZ21lbnRzID0gW10sIGVudHJpZXMgPSBbXSwgcm93U3RhcnRlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGxmID0gb3B0aW9ucy5sZWdlbmQubGFiZWxGb3JtYXR0ZXIsIHMsIGxhYmVsO1xuXG4gICAgICAgICAgICAvLyBCdWlsZCBhIGxpc3Qgb2YgbGVnZW5kIGVudHJpZXMsIHdpdGggZWFjaCBoYXZpbmcgYSBsYWJlbCBhbmQgYSBjb2xvclxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHMubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBsZiA/IGxmKHMubGFiZWwsIHMpIDogcy5sYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogcy5jb2xvclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNvcnQgdGhlIGxlZ2VuZCB1c2luZyBlaXRoZXIgdGhlIGRlZmF1bHQgb3IgYSBjdXN0b20gY29tcGFyYXRvclxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sZWdlbmQuc29ydGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvcHRpb25zLmxlZ2VuZC5zb3J0ZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVudHJpZXMuc29ydChvcHRpb25zLmxlZ2VuZC5zb3J0ZWQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5sZWdlbmQuc29ydGVkID09IFwicmV2ZXJzZVwiKSB7XG4gICAgICAgICAgICAgICAgXHRlbnRyaWVzLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXNjZW5kaW5nID0gb3B0aW9ucy5sZWdlbmQuc29ydGVkICE9IFwiZGVzY2VuZGluZ1wiO1xuICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubGFiZWwgPT0gYi5sYWJlbCA/IDAgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGEubGFiZWwgPCBiLmxhYmVsKSAhPSBhc2NlbmRpbmcgPyAxIDogLTEgICAvLyBMb2dpY2FsIFhPUlxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBtYXJrdXAgZm9yIHRoZSBsaXN0IG9mIGVudHJpZXMsIGluIHRoZWlyIGZpbmFsIG9yZGVyXG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gZW50cmllc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmIChpICUgb3B0aW9ucy5sZWdlbmQubm9Db2x1bW5zID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvd1N0YXJ0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBmcmFnbWVudHMucHVzaCgnPC90cj4nKTtcbiAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzLnB1c2goJzx0cj4nKTtcbiAgICAgICAgICAgICAgICAgICAgcm93U3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJsZWdlbmRDb2xvckJveFwiPjxkaXYgc3R5bGU9XCJib3JkZXI6MXB4IHNvbGlkICcgKyBvcHRpb25zLmxlZ2VuZC5sYWJlbEJveEJvcmRlckNvbG9yICsgJztwYWRkaW5nOjFweFwiPjxkaXYgc3R5bGU9XCJ3aWR0aDo0cHg7aGVpZ2h0OjA7Ym9yZGVyOjVweCBzb2xpZCAnICsgZW50cnkuY29sb3IgKyAnO292ZXJmbG93OmhpZGRlblwiPjwvZGl2PjwvZGl2PjwvdGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJsZWdlbmRMYWJlbFwiPicgKyBlbnRyeS5sYWJlbCArICc8L3RkPidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocm93U3RhcnRlZClcbiAgICAgICAgICAgICAgICBmcmFnbWVudHMucHVzaCgnPC90cj4nKTtcblxuICAgICAgICAgICAgaWYgKGZyYWdtZW50cy5sZW5ndGggPT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciB0YWJsZSA9ICc8dGFibGUgc3R5bGU9XCJmb250LXNpemU6c21hbGxlcjtjb2xvcjonICsgb3B0aW9ucy5ncmlkLmNvbG9yICsgJ1wiPicgKyBmcmFnbWVudHMuam9pbihcIlwiKSArICc8L3RhYmxlPic7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sZWdlbmQuY29udGFpbmVyICE9IG51bGwpXG4gICAgICAgICAgICAgICAgJChvcHRpb25zLmxlZ2VuZC5jb250YWluZXIpLmh0bWwodGFibGUpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIHAgPSBvcHRpb25zLmxlZ2VuZC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgbSA9IG9wdGlvbnMubGVnZW5kLm1hcmdpbjtcbiAgICAgICAgICAgICAgICBpZiAobVswXSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBtID0gW20sIG1dO1xuICAgICAgICAgICAgICAgIGlmIChwLmNoYXJBdCgwKSA9PSBcIm5cIilcbiAgICAgICAgICAgICAgICAgICAgcG9zICs9ICd0b3A6JyArIChtWzFdICsgcGxvdE9mZnNldC50b3ApICsgJ3B4Oyc7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocC5jaGFyQXQoMCkgPT0gXCJzXCIpXG4gICAgICAgICAgICAgICAgICAgIHBvcyArPSAnYm90dG9tOicgKyAobVsxXSArIHBsb3RPZmZzZXQuYm90dG9tKSArICdweDsnO1xuICAgICAgICAgICAgICAgIGlmIChwLmNoYXJBdCgxKSA9PSBcImVcIilcbiAgICAgICAgICAgICAgICAgICAgcG9zICs9ICdyaWdodDonICsgKG1bMF0gKyBwbG90T2Zmc2V0LnJpZ2h0KSArICdweDsnO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHAuY2hhckF0KDEpID09IFwid1wiKVxuICAgICAgICAgICAgICAgICAgICBwb3MgKz0gJ2xlZnQ6JyArIChtWzBdICsgcGxvdE9mZnNldC5sZWZ0KSArICdweDsnO1xuICAgICAgICAgICAgICAgIHZhciBsZWdlbmQgPSAkKCc8ZGl2IGNsYXNzPVwibGVnZW5kXCI+JyArIHRhYmxlLnJlcGxhY2UoJ3N0eWxlPVwiJywgJ3N0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7JyArIHBvcyArJzsnKSArICc8L2Rpdj4nKS5hcHBlbmRUbyhwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVnZW5kLmJhY2tncm91bmRPcGFjaXR5ICE9IDAuMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBwdXQgaW4gdGhlIHRyYW5zcGFyZW50IGJhY2tncm91bmRcbiAgICAgICAgICAgICAgICAgICAgLy8gc2VwYXJhdGVseSB0byBhdm9pZCBibGVuZGVkIGxhYmVscyBhbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gbGFiZWwgYm94ZXNcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBvcHRpb25zLmxlZ2VuZC5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBvcHRpb25zLmdyaWQuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgJiYgdHlwZW9mIGMgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gJC5jb2xvci5wYXJzZShjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjID0gJC5jb2xvci5leHRyYWN0KGxlZ2VuZCwgJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuYSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gYy50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXYgPSBsZWdlbmQuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnPGRpdiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOicgKyBkaXYud2lkdGgoKSArICdweDtoZWlnaHQ6JyArIGRpdi5oZWlnaHQoKSArICdweDsnICsgcG9zICsnYmFja2dyb3VuZC1jb2xvcjonICsgYyArICc7XCI+IDwvZGl2PicpLnByZXBlbmRUbyhsZWdlbmQpLmNzcygnb3BhY2l0eScsIG9wdGlvbnMubGVnZW5kLmJhY2tncm91bmRPcGFjaXR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIGludGVyYWN0aXZlIGZlYXR1cmVzXG5cbiAgICAgICAgdmFyIGhpZ2hsaWdodHMgPSBbXSxcbiAgICAgICAgICAgIHJlZHJhd1RpbWVvdXQgPSBudWxsO1xuXG4gICAgICAgIC8vIHJldHVybnMgdGhlIGRhdGEgaXRlbSB0aGUgbW91c2UgaXMgb3Zlciwgb3IgbnVsbCBpZiBub25lIGlzIGZvdW5kXG4gICAgICAgIGZ1bmN0aW9uIGZpbmROZWFyYnlJdGVtKG1vdXNlWCwgbW91c2VZLCBzZXJpZXNGaWx0ZXIpIHtcbiAgICAgICAgICAgIHZhciBtYXhEaXN0YW5jZSA9IG9wdGlvbnMuZ3JpZC5tb3VzZUFjdGl2ZVJhZGl1cyxcbiAgICAgICAgICAgICAgICBzbWFsbGVzdERpc3RhbmNlID0gbWF4RGlzdGFuY2UgKiBtYXhEaXN0YW5jZSArIDEsXG4gICAgICAgICAgICAgICAgaXRlbSA9IG51bGwsIGZvdW5kUG9pbnQgPSBmYWxzZSwgaSwgaiwgcHM7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IHNlcmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgICAgIGlmICghc2VyaWVzRmlsdGVyKHNlcmllc1tpXSkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgdmFyIHMgPSBzZXJpZXNbaV0sXG4gICAgICAgICAgICAgICAgICAgIGF4aXN4ID0gcy54YXhpcyxcbiAgICAgICAgICAgICAgICAgICAgYXhpc3kgPSBzLnlheGlzLFxuICAgICAgICAgICAgICAgICAgICBwb2ludHMgPSBzLmRhdGFwb2ludHMucG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICBteCA9IGF4aXN4LmMycChtb3VzZVgpLCAvLyBwcmVjb21wdXRlIHNvbWUgc3R1ZmYgdG8gbWFrZSB0aGUgbG9vcCBmYXN0ZXJcbiAgICAgICAgICAgICAgICAgICAgbXkgPSBheGlzeS5jMnAobW91c2VZKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4eCA9IG1heERpc3RhbmNlIC8gYXhpc3guc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIG1heHkgPSBtYXhEaXN0YW5jZSAvIGF4aXN5LnNjYWxlO1xuXG4gICAgICAgICAgICAgICAgcHMgPSBzLmRhdGFwb2ludHMucG9pbnRzaXplO1xuICAgICAgICAgICAgICAgIC8vIHdpdGggaW52ZXJzZSB0cmFuc2Zvcm1zLCB3ZSBjYW4ndCB1c2UgdGhlIG1heHgvbWF4eVxuICAgICAgICAgICAgICAgIC8vIG9wdGltaXphdGlvbiwgc2FkbHlcbiAgICAgICAgICAgICAgICBpZiAoYXhpc3gub3B0aW9ucy5pbnZlcnNlVHJhbnNmb3JtKVxuICAgICAgICAgICAgICAgICAgICBtYXh4ID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpc3kub3B0aW9ucy5pbnZlcnNlVHJhbnNmb3JtKVxuICAgICAgICAgICAgICAgICAgICBtYXh5ID0gTnVtYmVyLk1BWF9WQUxVRTtcblxuICAgICAgICAgICAgICAgIGlmIChzLmxpbmVzLnNob3cgfHwgcy5wb2ludHMuc2hvdykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgcG9pbnRzLmxlbmd0aDsgaiArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHggPSBwb2ludHNbal0sIHkgPSBwb2ludHNbaiArIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHBvaW50cyBhbmQgbGluZXMsIHRoZSBjdXJzb3IgbXVzdCBiZSB3aXRoaW4gYVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2VydGFpbiBkaXN0YW5jZSB0byB0aGUgZGF0YSBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggLSBteCA+IG1heHggfHwgeCAtIG14IDwgLW1heHggfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gbXkgPiBtYXh5IHx8IHkgLSBteSA8IC1tYXh5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGNhbGN1bGF0ZSBkaXN0YW5jZXMgaW4gcGl4ZWxzLCBub3QgaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRhdGEgdW5pdHMsIGJlY2F1c2UgdGhlIHNjYWxlcyBvZiB0aGUgYXhlcyBtYXkgYmUgZGlmZmVyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHggPSBNYXRoLmFicyhheGlzeC5wMmMoeCkgLSBtb3VzZVgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR5ID0gTWF0aC5hYnMoYXhpc3kucDJjKHkpIC0gbW91c2VZKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXN0ID0gZHggKiBkeCArIGR5ICogZHk7IC8vIHdlIHNhdmUgdGhlIHNxcnRcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlIDw9IHRvIGVuc3VyZSBsYXN0IHBvaW50IHRha2VzIHByZWNlZGVuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChsYXN0IGdlbmVyYWxseSBtZWFucyBvbiB0b3Agb2YpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdCA8IHNtYWxsZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbWFsbGVzdERpc3RhbmNlID0gZGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gW2ksIGogLyBwc107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocy5iYXJzLnNob3cgJiYgIWl0ZW0pIHsgLy8gbm8gb3RoZXIgcG9pbnQgY2FuIGJlIG5lYXJieVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBiYXJMZWZ0LCBiYXJSaWdodDtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHMuYmFycy5hbGlnbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAtcy5iYXJzLmJhcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gLXMuYmFycy5iYXJXaWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBiYXJSaWdodCA9IGJhckxlZnQgKyBzLmJhcnMuYmFyV2lkdGg7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHBvaW50cy5sZW5ndGg7IGogKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4ID0gcG9pbnRzW2pdLCB5ID0gcG9pbnRzW2ogKyAxXSwgYiA9IHBvaW50c1tqICsgMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb3IgYSBiYXIgZ3JhcGgsIHRoZSBjdXJzb3IgbXVzdCBiZSBpbnNpZGUgdGhlIGJhclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlcmllc1tpXS5iYXJzLmhvcml6b250YWwgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChteCA8PSBNYXRoLm1heChiLCB4KSAmJiBteCA+PSBNYXRoLm1pbihiLCB4KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteSA+PSB5ICsgYmFyTGVmdCAmJiBteSA8PSB5ICsgYmFyUmlnaHQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobXggPj0geCArIGJhckxlZnQgJiYgbXggPD0geCArIGJhclJpZ2h0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15ID49IE1hdGgubWluKGIsIHkpICYmIG15IDw9IE1hdGgubWF4KGIsIHkpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IFtpLCBqIC8gcHNdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGkgPSBpdGVtWzBdO1xuICAgICAgICAgICAgICAgIGogPSBpdGVtWzFdO1xuICAgICAgICAgICAgICAgIHBzID0gc2VyaWVzW2ldLmRhdGFwb2ludHMucG9pbnRzaXplO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZGF0YXBvaW50OiBzZXJpZXNbaV0uZGF0YXBvaW50cy5wb2ludHMuc2xpY2UoaiAqIHBzLCAoaiArIDEpICogcHMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFJbmRleDogaixcbiAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXM6IHNlcmllc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXNJbmRleDogaSB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuaG92ZXJhYmxlKVxuICAgICAgICAgICAgICAgIHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoXCJwbG90aG92ZXJcIiwgZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChzKSB7IHJldHVybiBzW1wiaG92ZXJhYmxlXCJdICE9IGZhbHNlOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uTW91c2VMZWF2ZShlKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmhvdmVyYWJsZSlcbiAgICAgICAgICAgICAgICB0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KFwicGxvdGhvdmVyXCIsIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocykgeyByZXR1cm4gZmFsc2U7IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25DbGljayhlKSB7XG4gICAgICAgICAgICB0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KFwicGxvdGNsaWNrXCIsIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChzKSB7IHJldHVybiBzW1wiY2xpY2thYmxlXCJdICE9IGZhbHNlOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyaWdnZXIgY2xpY2sgb3IgaG92ZXIgZXZlbnQgKHRoZXkgc2VuZCB0aGUgc2FtZSBwYXJhbWV0ZXJzXG4gICAgICAgIC8vIHNvIHdlIHNoYXJlIHRoZWlyIGNvZGUpXG4gICAgICAgIGZ1bmN0aW9uIHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoZXZlbnRuYW1lLCBldmVudCwgc2VyaWVzRmlsdGVyKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZXZlbnRIb2xkZXIub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgY2FudmFzWCA9IGV2ZW50LnBhZ2VYIC0gb2Zmc2V0LmxlZnQgLSBwbG90T2Zmc2V0LmxlZnQsXG4gICAgICAgICAgICAgICAgY2FudmFzWSA9IGV2ZW50LnBhZ2VZIC0gb2Zmc2V0LnRvcCAtIHBsb3RPZmZzZXQudG9wLFxuICAgICAgICAgICAgcG9zID0gY2FudmFzVG9BeGlzQ29vcmRzKHsgbGVmdDogY2FudmFzWCwgdG9wOiBjYW52YXNZIH0pO1xuXG4gICAgICAgICAgICBwb3MucGFnZVggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgIHBvcy5wYWdlWSA9IGV2ZW50LnBhZ2VZO1xuXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGZpbmROZWFyYnlJdGVtKGNhbnZhc1gsIGNhbnZhc1ksIHNlcmllc0ZpbHRlcik7XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgLy8gZmlsbCBpbiBtb3VzZSBwb3MgZm9yIGFueSBsaXN0ZW5lcnMgb3V0IHRoZXJlXG4gICAgICAgICAgICAgICAgaXRlbS5wYWdlWCA9IHBhcnNlSW50KGl0ZW0uc2VyaWVzLnhheGlzLnAyYyhpdGVtLmRhdGFwb2ludFswXSkgKyBvZmZzZXQubGVmdCArIHBsb3RPZmZzZXQubGVmdCwgMTApO1xuICAgICAgICAgICAgICAgIGl0ZW0ucGFnZVkgPSBwYXJzZUludChpdGVtLnNlcmllcy55YXhpcy5wMmMoaXRlbS5kYXRhcG9pbnRbMV0pICsgb2Zmc2V0LnRvcCArIHBsb3RPZmZzZXQudG9wLCAxMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuYXV0b0hpZ2hsaWdodCkge1xuICAgICAgICAgICAgICAgIC8vIGNsZWFyIGF1dG8taGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGlnaGxpZ2h0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IGhpZ2hsaWdodHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChoLmF1dG8gPT0gZXZlbnRuYW1lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhKGl0ZW0gJiYgaC5zZXJpZXMgPT0gaXRlbS5zZXJpZXMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaC5wb2ludFswXSA9PSBpdGVtLmRhdGFwb2ludFswXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICBoLnBvaW50WzFdID09IGl0ZW0uZGF0YXBvaW50WzFdKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaGlnaGxpZ2h0KGguc2VyaWVzLCBoLnBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbSlcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0KGl0ZW0uc2VyaWVzLCBpdGVtLmRhdGFwb2ludCwgZXZlbnRuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxhY2Vob2xkZXIudHJpZ2dlcihldmVudG5hbWUsIFsgcG9zLCBpdGVtIF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdHJpZ2dlclJlZHJhd092ZXJsYXkoKSB7XG4gICAgICAgICAgICB2YXIgdCA9IG9wdGlvbnMuaW50ZXJhY3Rpb24ucmVkcmF3T3ZlcmxheUludGVydmFsO1xuICAgICAgICAgICAgaWYgKHQgPT0gLTEpIHsgICAgICAvLyBza2lwIGV2ZW50IHF1ZXVlXG4gICAgICAgICAgICAgICAgZHJhd092ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcmVkcmF3VGltZW91dClcbiAgICAgICAgICAgICAgICByZWRyYXdUaW1lb3V0ID0gc2V0VGltZW91dChkcmF3T3ZlcmxheSwgdCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3T3ZlcmxheSgpIHtcbiAgICAgICAgICAgIHJlZHJhd1RpbWVvdXQgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBkcmF3IGhpZ2hsaWdodHNcbiAgICAgICAgICAgIG9jdHguc2F2ZSgpO1xuICAgICAgICAgICAgb3ZlcmxheS5jbGVhcigpO1xuICAgICAgICAgICAgb2N0eC50cmFuc2xhdGUocGxvdE9mZnNldC5sZWZ0LCBwbG90T2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgICAgIHZhciBpLCBoaTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBoaWdobGlnaHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaGkgPSBoaWdobGlnaHRzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhpLnNlcmllcy5iYXJzLnNob3cpXG4gICAgICAgICAgICAgICAgICAgIGRyYXdCYXJIaWdobGlnaHQoaGkuc2VyaWVzLCBoaS5wb2ludCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBkcmF3UG9pbnRIaWdobGlnaHQoaGkuc2VyaWVzLCBoaS5wb2ludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvY3R4LnJlc3RvcmUoKTtcblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLmRyYXdPdmVybGF5LCBbb2N0eF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGlnaGxpZ2h0KHMsIHBvaW50LCBhdXRvKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHMgPT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW3NdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBvaW50ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHMgPSBzLmRhdGFwb2ludHMucG9pbnRzaXplO1xuICAgICAgICAgICAgICAgIHBvaW50ID0gcy5kYXRhcG9pbnRzLnBvaW50cy5zbGljZShwcyAqIHBvaW50LCBwcyAqIChwb2ludCArIDEpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSBpbmRleE9mSGlnaGxpZ2h0KHMsIHBvaW50KTtcbiAgICAgICAgICAgIGlmIChpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0cy5wdXNoKHsgc2VyaWVzOiBzLCBwb2ludDogcG9pbnQsIGF1dG86IGF1dG8gfSk7XG5cbiAgICAgICAgICAgICAgICB0cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWF1dG8pXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0c1tpXS5hdXRvID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1bmhpZ2hsaWdodChzLCBwb2ludCkge1xuICAgICAgICAgICAgaWYgKHMgPT0gbnVsbCAmJiBwb2ludCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHMgPT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW3NdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHBvaW50ID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHMgPSBzLmRhdGFwb2ludHMucG9pbnRzaXplO1xuICAgICAgICAgICAgICAgIHBvaW50ID0gcy5kYXRhcG9pbnRzLnBvaW50cy5zbGljZShwcyAqIHBvaW50LCBwcyAqIChwb2ludCArIDEpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSBpbmRleE9mSGlnaGxpZ2h0KHMsIHBvaW50KTtcbiAgICAgICAgICAgIGlmIChpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0cy5zcGxpY2UoaSwgMSk7XG5cbiAgICAgICAgICAgICAgICB0cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5kZXhPZkhpZ2hsaWdodChzLCBwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgaCA9IGhpZ2hsaWdodHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGguc2VyaWVzID09IHMgJiYgaC5wb2ludFswXSA9PSBwWzBdXG4gICAgICAgICAgICAgICAgICAgICYmIGgucG9pbnRbMV0gPT0gcFsxXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3UG9pbnRIaWdobGlnaHQoc2VyaWVzLCBwb2ludCkge1xuICAgICAgICAgICAgdmFyIHggPSBwb2ludFswXSwgeSA9IHBvaW50WzFdLFxuICAgICAgICAgICAgICAgIGF4aXN4ID0gc2VyaWVzLnhheGlzLCBheGlzeSA9IHNlcmllcy55YXhpcyxcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRDb2xvciA9ICh0eXBlb2Ygc2VyaWVzLmhpZ2hsaWdodENvbG9yID09PSBcInN0cmluZ1wiKSA/IHNlcmllcy5oaWdobGlnaHRDb2xvciA6ICQuY29sb3IucGFyc2Uoc2VyaWVzLmNvbG9yKS5zY2FsZSgnYScsIDAuNSkudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgaWYgKHggPCBheGlzeC5taW4gfHwgeCA+IGF4aXN4Lm1heCB8fCB5IDwgYXhpc3kubWluIHx8IHkgPiBheGlzeS5tYXgpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgcG9pbnRSYWRpdXMgPSBzZXJpZXMucG9pbnRzLnJhZGl1cyArIHNlcmllcy5wb2ludHMubGluZVdpZHRoIC8gMjtcbiAgICAgICAgICAgIG9jdHgubGluZVdpZHRoID0gcG9pbnRSYWRpdXM7XG4gICAgICAgICAgICBvY3R4LnN0cm9rZVN0eWxlID0gaGlnaGxpZ2h0Q29sb3I7XG4gICAgICAgICAgICB2YXIgcmFkaXVzID0gMS41ICogcG9pbnRSYWRpdXM7XG4gICAgICAgICAgICB4ID0gYXhpc3gucDJjKHgpO1xuICAgICAgICAgICAgeSA9IGF4aXN5LnAyYyh5KTtcblxuICAgICAgICAgICAgb2N0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGlmIChzZXJpZXMucG9pbnRzLnN5bWJvbCA9PSBcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgIG9jdHguYXJjKHgsIHksIHJhZGl1cywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXJpZXMucG9pbnRzLnN5bWJvbChvY3R4LCB4LCB5LCByYWRpdXMsIGZhbHNlKTtcbiAgICAgICAgICAgIG9jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBvY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd0JhckhpZ2hsaWdodChzZXJpZXMsIHBvaW50KSB7XG4gICAgICAgICAgICB2YXIgaGlnaGxpZ2h0Q29sb3IgPSAodHlwZW9mIHNlcmllcy5oaWdobGlnaHRDb2xvciA9PT0gXCJzdHJpbmdcIikgPyBzZXJpZXMuaGlnaGxpZ2h0Q29sb3IgOiAkLmNvbG9yLnBhcnNlKHNlcmllcy5jb2xvcikuc2NhbGUoJ2EnLCAwLjUpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgZmlsbFN0eWxlID0gaGlnaGxpZ2h0Q29sb3IsXG4gICAgICAgICAgICAgICAgYmFyTGVmdDtcblxuICAgICAgICAgICAgc3dpdGNoIChzZXJpZXMuYmFycy5hbGlnbikge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IC1zZXJpZXMuYmFycy5iYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IC1zZXJpZXMuYmFycy5iYXJXaWR0aCAvIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9jdHgubGluZVdpZHRoID0gc2VyaWVzLmJhcnMubGluZVdpZHRoO1xuICAgICAgICAgICAgb2N0eC5zdHJva2VTdHlsZSA9IGhpZ2hsaWdodENvbG9yO1xuXG4gICAgICAgICAgICBkcmF3QmFyKHBvaW50WzBdLCBwb2ludFsxXSwgcG9pbnRbMl0gfHwgMCwgYmFyTGVmdCwgYmFyTGVmdCArIHNlcmllcy5iYXJzLmJhcldpZHRoLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBmaWxsU3R5bGU7IH0sIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzLCBvY3R4LCBzZXJpZXMuYmFycy5ob3Jpem9udGFsLCBzZXJpZXMuYmFycy5saW5lV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29sb3JPckdyYWRpZW50KHNwZWMsIGJvdHRvbSwgdG9wLCBkZWZhdWx0Q29sb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BlYyA9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBzcGVjO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gYXNzdW1lIHRoaXMgaXMgYSBncmFkaWVudCBzcGVjOyBJRSBjdXJyZW50bHkgb25seVxuICAgICAgICAgICAgICAgIC8vIHN1cHBvcnRzIGEgc2ltcGxlIHZlcnRpY2FsIGdyYWRpZW50IHByb3Blcmx5LCBzbyB0aGF0J3NcbiAgICAgICAgICAgICAgICAvLyB3aGF0IHdlIHN1cHBvcnQgdG9vXG4gICAgICAgICAgICAgICAgdmFyIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIHRvcCwgMCwgYm90dG9tKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3BlYy5jb2xvcnMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gc3BlYy5jb2xvcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYyAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY28gPSAkLmNvbG9yLnBhcnNlKGRlZmF1bHRDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5icmlnaHRuZXNzICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY28gPSBjby5zY2FsZSgncmdiJywgYy5icmlnaHRuZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjLm9wYWNpdHkgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjby5hICo9IGMub3BhY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBjby50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcChpIC8gKGwgLSAxKSwgYyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdyYWRpZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBwbG90IGZ1bmN0aW9uIHRvIHRoZSB0b3AgbGV2ZWwgb2YgdGhlIGpRdWVyeSBvYmplY3RcblxuICAgICQucGxvdCA9IGZ1bmN0aW9uKHBsYWNlaG9sZGVyLCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIC8vdmFyIHQwID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHBsb3QgPSBuZXcgUGxvdCgkKHBsYWNlaG9sZGVyKSwgZGF0YSwgb3B0aW9ucywgJC5wbG90LnBsdWdpbnMpO1xuICAgICAgICAvLyh3aW5kb3cuY29uc29sZSA/IGNvbnNvbGUubG9nIDogYWxlcnQpKFwidGltZSB1c2VkIChtc2Vjcyk6IFwiICsgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLSB0MC5nZXRUaW1lKCkpKTtcbiAgICAgICAgcmV0dXJuIHBsb3Q7XG4gICAgfTtcblxuICAgICQucGxvdC52ZXJzaW9uID0gXCIwLjguM1wiO1xuXG4gICAgJC5wbG90LnBsdWdpbnMgPSBbXTtcblxuICAgIC8vIEFsc28gYWRkIHRoZSBwbG90IGZ1bmN0aW9uIGFzIGEgY2hhaW5hYmxlIHByb3BlcnR5XG5cbiAgICAkLmZuLnBsb3QgPSBmdW5jdGlvbihkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkLnBsb3QodGhpcywgZGF0YSwgb3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyByb3VuZCB0byBuZWFyYnkgbG93ZXIgbXVsdGlwbGUgb2YgYmFzZVxuICAgIGZ1bmN0aW9uIGZsb29ySW5CYXNlKG4sIGJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGJhc2UgKiBNYXRoLmZsb29yKG4gLyBiYXNlKTtcbiAgICB9XG5cbn0pKGpRdWVyeSk7XG4iLCIvKiBGbG90IHBsdWdpbiBmb3IgcmVuZGVyaW5nIHBpZSBjaGFydHMuXG5cbkNvcHlyaWdodCAoYykgMjAwNy0yMDE0IElPTEEgYW5kIE9sZSBMYXVyc2VuLlxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG5UaGUgcGx1Z2luIGFzc3VtZXMgdGhhdCBlYWNoIHNlcmllcyBoYXMgYSBzaW5nbGUgZGF0YSB2YWx1ZSwgYW5kIHRoYXQgZWFjaFxudmFsdWUgaXMgYSBwb3NpdGl2ZSBpbnRlZ2VyIG9yIHplcm8uICBOZWdhdGl2ZSBudW1iZXJzIGRvbid0IG1ha2Ugc2Vuc2UgZm9yIGFcbnBpZSBjaGFydCwgYW5kIGhhdmUgdW5wcmVkaWN0YWJsZSByZXN1bHRzLiAgVGhlIHZhbHVlcyBkbyBOT1QgbmVlZCB0byBiZVxucGFzc2VkIGluIGFzIHBlcmNlbnRhZ2VzOyB0aGUgcGx1Z2luIHdpbGwgY2FsY3VsYXRlIHRoZSB0b3RhbCBhbmQgcGVyLXNsaWNlXG5wZXJjZW50YWdlcyBpbnRlcm5hbGx5LlxuXG4qIENyZWF0ZWQgYnkgQnJpYW4gTWVkZW5kb3JwXG5cbiogVXBkYXRlZCB3aXRoIGNvbnRyaWJ1dGlvbnMgZnJvbSBidGJ1cm5ldHQzLCBBbnRob255IEFyYWd1ZXMgYW5kIFhhdmkgSXZhcnNcblxuVGhlIHBsdWdpbiBzdXBwb3J0cyB0aGVzZSBvcHRpb25zOlxuXG5cdHNlcmllczoge1xuXHRcdHBpZToge1xuXHRcdFx0c2hvdzogdHJ1ZS9mYWxzZVxuXHRcdFx0cmFkaXVzOiAwLTEgZm9yIHBlcmNlbnRhZ2Ugb2YgZnVsbHNpemUsIG9yIGEgc3BlY2lmaWVkIHBpeGVsIGxlbmd0aCwgb3IgJ2F1dG8nXG5cdFx0XHRpbm5lclJhZGl1czogMC0xIGZvciBwZXJjZW50YWdlIG9mIGZ1bGxzaXplIG9yIGEgc3BlY2lmaWVkIHBpeGVsIGxlbmd0aCwgZm9yIGNyZWF0aW5nIGEgZG9udXQgZWZmZWN0XG5cdFx0XHRzdGFydEFuZ2xlOiAwLTIgZmFjdG9yIG9mIFBJIHVzZWQgZm9yIHN0YXJ0aW5nIGFuZ2xlIChpbiByYWRpYW5zKSBpLmUgMy8yIHN0YXJ0cyBhdCB0aGUgdG9wLCAwIGFuZCAyIGhhdmUgdGhlIHNhbWUgcmVzdWx0XG5cdFx0XHR0aWx0OiAwLTEgZm9yIHBlcmNlbnRhZ2UgdG8gdGlsdCB0aGUgcGllLCB3aGVyZSAxIGlzIG5vIHRpbHQsIGFuZCAwIGlzIGNvbXBsZXRlbHkgZmxhdCAobm90aGluZyB3aWxsIHNob3cpXG5cdFx0XHRvZmZzZXQ6IHtcblx0XHRcdFx0dG9wOiBpbnRlZ2VyIHZhbHVlIHRvIG1vdmUgdGhlIHBpZSB1cCBvciBkb3duXG5cdFx0XHRcdGxlZnQ6IGludGVnZXIgdmFsdWUgdG8gbW92ZSB0aGUgcGllIGxlZnQgb3IgcmlnaHQsIG9yICdhdXRvJ1xuXHRcdFx0fSxcblx0XHRcdHN0cm9rZToge1xuXHRcdFx0XHRjb2xvcjogYW55IGhleGlkZWNpbWFsIGNvbG9yIHZhbHVlIChvdGhlciBmb3JtYXRzIG1heSBvciBtYXkgbm90IHdvcmssIHNvIGJlc3QgdG8gc3RpY2sgd2l0aCBzb21ldGhpbmcgbGlrZSAnI0ZGRicpXG5cdFx0XHRcdHdpZHRoOiBpbnRlZ2VyIHBpeGVsIHdpZHRoIG9mIHRoZSBzdHJva2Vcblx0XHRcdH0sXG5cdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRzaG93OiB0cnVlL2ZhbHNlLCBvciAnYXV0bydcblx0XHRcdFx0Zm9ybWF0dGVyOiAgYSB1c2VyLWRlZmluZWQgZnVuY3Rpb24gdGhhdCBtb2RpZmllcyB0aGUgdGV4dC9zdHlsZSBvZiB0aGUgbGFiZWwgdGV4dFxuXHRcdFx0XHRyYWRpdXM6IDAtMSBmb3IgcGVyY2VudGFnZSBvZiBmdWxsc2l6ZSwgb3IgYSBzcGVjaWZpZWQgcGl4ZWwgbGVuZ3RoXG5cdFx0XHRcdGJhY2tncm91bmQ6IHtcblx0XHRcdFx0XHRjb2xvcjogYW55IGhleGlkZWNpbWFsIGNvbG9yIHZhbHVlIChvdGhlciBmb3JtYXRzIG1heSBvciBtYXkgbm90IHdvcmssIHNvIGJlc3QgdG8gc3RpY2sgd2l0aCBzb21ldGhpbmcgbGlrZSAnIzAwMCcpXG5cdFx0XHRcdFx0b3BhY2l0eTogMC0xXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRocmVzaG9sZDogMC0xIGZvciB0aGUgcGVyY2VudGFnZSB2YWx1ZSBhdCB3aGljaCB0byBoaWRlIGxhYmVscyAoaWYgdGhleSdyZSB0b28gc21hbGwpXG5cdFx0XHR9LFxuXHRcdFx0Y29tYmluZToge1xuXHRcdFx0XHR0aHJlc2hvbGQ6IDAtMSBmb3IgdGhlIHBlcmNlbnRhZ2UgdmFsdWUgYXQgd2hpY2ggdG8gY29tYmluZSBzbGljZXMgKGlmIHRoZXkncmUgdG9vIHNtYWxsKVxuXHRcdFx0XHRjb2xvcjogYW55IGhleGlkZWNpbWFsIGNvbG9yIHZhbHVlIChvdGhlciBmb3JtYXRzIG1heSBvciBtYXkgbm90IHdvcmssIHNvIGJlc3QgdG8gc3RpY2sgd2l0aCBzb21ldGhpbmcgbGlrZSAnI0NDQycpLCBpZiBudWxsLCB0aGUgcGx1Z2luIHdpbGwgYXV0b21hdGljYWxseSB1c2UgdGhlIGNvbG9yIG9mIHRoZSBmaXJzdCBzbGljZSB0byBiZSBjb21iaW5lZFxuXHRcdFx0XHRsYWJlbDogYW55IHRleHQgdmFsdWUgb2Ygd2hhdCB0aGUgY29tYmluZWQgc2xpY2Ugc2hvdWxkIGJlIGxhYmVsZWRcblx0XHRcdH1cblx0XHRcdGhpZ2hsaWdodDoge1xuXHRcdFx0XHRvcGFjaXR5OiAwLTFcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuTW9yZSBkZXRhaWwgYW5kIHNwZWNpZmljIGV4YW1wbGVzIGNhbiBiZSBmb3VuZCBpbiB0aGUgaW5jbHVkZWQgSFRNTCBmaWxlLlxuXG4qL1xuXG4oZnVuY3Rpb24oJCkge1xuXG5cdC8vIE1heGltdW0gcmVkcmF3IGF0dGVtcHRzIHdoZW4gZml0dGluZyBsYWJlbHMgd2l0aGluIHRoZSBwbG90XG5cblx0dmFyIFJFRFJBV19BVFRFTVBUUyA9IDEwO1xuXG5cdC8vIEZhY3RvciBieSB3aGljaCB0byBzaHJpbmsgdGhlIHBpZSB3aGVuIGZpdHRpbmcgbGFiZWxzIHdpdGhpbiB0aGUgcGxvdFxuXG5cdHZhciBSRURSQVdfU0hSSU5LID0gMC45NTtcblxuXHRmdW5jdGlvbiBpbml0KHBsb3QpIHtcblxuXHRcdHZhciBjYW52YXMgPSBudWxsLFxuXHRcdFx0dGFyZ2V0ID0gbnVsbCxcblx0XHRcdG9wdGlvbnMgPSBudWxsLFxuXHRcdFx0bWF4UmFkaXVzID0gbnVsbCxcblx0XHRcdGNlbnRlckxlZnQgPSBudWxsLFxuXHRcdFx0Y2VudGVyVG9wID0gbnVsbCxcblx0XHRcdHByb2Nlc3NlZCA9IGZhbHNlLFxuXHRcdFx0Y3R4ID0gbnVsbDtcblxuXHRcdC8vIGludGVyYWN0aXZlIHZhcmlhYmxlc1xuXG5cdFx0dmFyIGhpZ2hsaWdodHMgPSBbXTtcblxuXHRcdC8vIGFkZCBob29rIHRvIGRldGVybWluZSBpZiBwaWUgcGx1Z2luIGluIGVuYWJsZWQsIGFuZCB0aGVuIHBlcmZvcm0gbmVjZXNzYXJ5IG9wZXJhdGlvbnNcblxuXHRcdHBsb3QuaG9va3MucHJvY2Vzc09wdGlvbnMucHVzaChmdW5jdGlvbihwbG90LCBvcHRpb25zKSB7XG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnNob3cpIHtcblxuXHRcdFx0XHRvcHRpb25zLmdyaWQuc2hvdyA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vIHNldCBsYWJlbHMuc2hvd1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUubGFiZWwuc2hvdyA9PSBcImF1dG9cIikge1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLmxlZ2VuZC5zaG93KSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnNlcmllcy5waWUubGFiZWwuc2hvdyA9IGZhbHNlO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnNlcmllcy5waWUubGFiZWwuc2hvdyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gc2V0IHJhZGl1c1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID09IFwiYXV0b1wiKSB7XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5zaG93KSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID0gMy80O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBlbnN1cmUgc2FuZSB0aWx0XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0ID4gMSkge1xuXHRcdFx0XHRcdG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0ID0gMTtcblx0XHRcdFx0fSBlbHNlIGlmIChvcHRpb25zLnNlcmllcy5waWUudGlsdCA8IDApIHtcblx0XHRcdFx0XHRvcHRpb25zLnNlcmllcy5waWUudGlsdCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHBsb3QuaG9va3MuYmluZEV2ZW50cy5wdXNoKGZ1bmN0aW9uKHBsb3QsIGV2ZW50SG9sZGVyKSB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpO1xuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5zaG93KSB7XG5cdFx0XHRcdGlmIChvcHRpb25zLmdyaWQuaG92ZXJhYmxlKSB7XG5cdFx0XHRcdFx0ZXZlbnRIb2xkZXIudW5iaW5kKFwibW91c2Vtb3ZlXCIpLm1vdXNlbW92ZShvbk1vdXNlTW92ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9wdGlvbnMuZ3JpZC5jbGlja2FibGUpIHtcblx0XHRcdFx0XHRldmVudEhvbGRlci51bmJpbmQoXCJjbGlja1wiKS5jbGljayhvbkNsaWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cGxvdC5ob29rcy5wcm9jZXNzRGF0YXBvaW50cy5wdXNoKGZ1bmN0aW9uKHBsb3QsIHNlcmllcywgZGF0YSwgZGF0YXBvaW50cykge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKTtcblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuc2hvdykge1xuXHRcdFx0XHRwcm9jZXNzRGF0YXBvaW50cyhwbG90LCBzZXJpZXMsIGRhdGEsIGRhdGFwb2ludHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cGxvdC5ob29rcy5kcmF3T3ZlcmxheS5wdXNoKGZ1bmN0aW9uKHBsb3QsIG9jdHgpIHtcblx0XHRcdHZhciBvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCk7XG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnNob3cpIHtcblx0XHRcdFx0ZHJhd092ZXJsYXkocGxvdCwgb2N0eCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRwbG90Lmhvb2tzLmRyYXcucHVzaChmdW5jdGlvbihwbG90LCBuZXdDdHgpIHtcblx0XHRcdHZhciBvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCk7XG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnNob3cpIHtcblx0XHRcdFx0ZHJhdyhwbG90LCBuZXdDdHgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZnVuY3Rpb24gcHJvY2Vzc0RhdGFwb2ludHMocGxvdCwgc2VyaWVzLCBkYXRhcG9pbnRzKSB7XG5cdFx0XHRpZiAoIXByb2Nlc3NlZClcdHtcblx0XHRcdFx0cHJvY2Vzc2VkID0gdHJ1ZTtcblx0XHRcdFx0Y2FudmFzID0gcGxvdC5nZXRDYW52YXMoKTtcblx0XHRcdFx0dGFyZ2V0ID0gJChjYW52YXMpLnBhcmVudCgpO1xuXHRcdFx0XHRvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCk7XG5cdFx0XHRcdHBsb3Quc2V0RGF0YShjb21iaW5lKHBsb3QuZ2V0RGF0YSgpKSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY29tYmluZShkYXRhKSB7XG5cblx0XHRcdHZhciB0b3RhbCA9IDAsXG5cdFx0XHRcdGNvbWJpbmVkID0gMCxcblx0XHRcdFx0bnVtQ29tYmluZWQgPSAwLFxuXHRcdFx0XHRjb2xvciA9IG9wdGlvbnMuc2VyaWVzLnBpZS5jb21iaW5lLmNvbG9yLFxuXHRcdFx0XHRuZXdkYXRhID0gW107XG5cblx0XHRcdC8vIEZpeCB1cCB0aGUgcmF3IGRhdGEgZnJvbSBGbG90LCBlbnN1cmluZyB0aGUgZGF0YSBpcyBudW1lcmljXG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuXG5cdFx0XHRcdHZhciB2YWx1ZSA9IGRhdGFbaV0uZGF0YTtcblxuXHRcdFx0XHQvLyBJZiB0aGUgZGF0YSBpcyBhbiBhcnJheSwgd2UnbGwgYXNzdW1lIHRoYXQgaXQncyBhIHN0YW5kYXJkXG5cdFx0XHRcdC8vIEZsb3QgeC15IHBhaXIsIGFuZCBhcmUgY29uY2VybmVkIG9ubHkgd2l0aCB0aGUgc2Vjb25kIHZhbHVlLlxuXG5cdFx0XHRcdC8vIE5vdGUgaG93IHdlIHVzZSB0aGUgb3JpZ2luYWwgYXJyYXksIHJhdGhlciB0aGFuIGNyZWF0aW5nIGFcblx0XHRcdFx0Ly8gbmV3IG9uZTsgdGhpcyBpcyBtb3JlIGVmZmljaWVudCBhbmQgcHJlc2VydmVzIGFueSBleHRyYSBkYXRhXG5cdFx0XHRcdC8vIHRoYXQgdGhlIHVzZXIgbWF5IGhhdmUgc3RvcmVkIGluIGhpZ2hlciBpbmRleGVzLlxuXG5cdFx0XHRcdGlmICgkLmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PSAxKSB7XG4gICAgXHRcdFx0XHR2YWx1ZSA9IHZhbHVlWzBdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCQuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0XHQvLyBFcXVpdmFsZW50IHRvICQuaXNOdW1lcmljKCkgYnV0IGNvbXBhdGlibGUgd2l0aCBqUXVlcnkgPCAxLjdcblx0XHRcdFx0XHRpZiAoIWlzTmFOKHBhcnNlRmxvYXQodmFsdWVbMV0pKSAmJiBpc0Zpbml0ZSh2YWx1ZVsxXSkpIHtcblx0XHRcdFx0XHRcdHZhbHVlWzFdID0gK3ZhbHVlWzFdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR2YWx1ZVsxXSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkgJiYgaXNGaW5pdGUodmFsdWUpKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBbMSwgK3ZhbHVlXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YWx1ZSA9IFsxLCAwXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRhdGFbaV0uZGF0YSA9IFt2YWx1ZV07XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1bSB1cCBhbGwgdGhlIHNsaWNlcywgc28gd2UgY2FuIGNhbGN1bGF0ZSBwZXJjZW50YWdlcyBmb3IgZWFjaFxuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dG90YWwgKz0gZGF0YVtpXS5kYXRhWzBdWzFdO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb3VudCB0aGUgbnVtYmVyIG9mIHNsaWNlcyB3aXRoIHBlcmNlbnRhZ2VzIGJlbG93IHRoZSBjb21iaW5lXG5cdFx0XHQvLyB0aHJlc2hvbGQ7IGlmIGl0IHR1cm5zIG91dCB0byBiZSBqdXN0IG9uZSwgd2Ugd29uJ3QgY29tYmluZS5cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IGRhdGFbaV0uZGF0YVswXVsxXTtcblx0XHRcdFx0aWYgKHZhbHVlIC8gdG90YWwgPD0gb3B0aW9ucy5zZXJpZXMucGllLmNvbWJpbmUudGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0Y29tYmluZWQgKz0gdmFsdWU7XG5cdFx0XHRcdFx0bnVtQ29tYmluZWQrKztcblx0XHRcdFx0XHRpZiAoIWNvbG9yKSB7XG5cdFx0XHRcdFx0XHRjb2xvciA9IGRhdGFbaV0uY29sb3I7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBkYXRhW2ldLmRhdGFbMF1bMV07XG5cdFx0XHRcdGlmIChudW1Db21iaW5lZCA8IDIgfHwgdmFsdWUgLyB0b3RhbCA+IG9wdGlvbnMuc2VyaWVzLnBpZS5jb21iaW5lLnRocmVzaG9sZCkge1xuXHRcdFx0XHRcdG5ld2RhdGEucHVzaChcblx0XHRcdFx0XHRcdCQuZXh0ZW5kKGRhdGFbaV0sIHsgICAgIC8qIGV4dGVuZCB0byBhbGxvdyBrZWVwaW5nIGFsbCBvdGhlciBvcmlnaW5hbCBkYXRhIHZhbHVlc1xuXHRcdFx0XHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHVzaW5nIHRoZW0gZS5nLiBpbiBsYWJlbEZvcm1hdHRlci4gKi9cblx0XHRcdFx0XHRcdFx0ZGF0YTogW1sxLCB2YWx1ZV1dLFxuXHRcdFx0XHRcdFx0XHRjb2xvcjogZGF0YVtpXS5jb2xvcixcblx0XHRcdFx0XHRcdFx0bGFiZWw6IGRhdGFbaV0ubGFiZWwsXG5cdFx0XHRcdFx0XHRcdGFuZ2xlOiB2YWx1ZSAqIE1hdGguUEkgKiAyIC8gdG90YWwsXG5cdFx0XHRcdFx0XHRcdHBlcmNlbnQ6IHZhbHVlIC8gKHRvdGFsIC8gMTAwKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChudW1Db21iaW5lZCA+IDEpIHtcblx0XHRcdFx0bmV3ZGF0YS5wdXNoKHtcblx0XHRcdFx0XHRkYXRhOiBbWzEsIGNvbWJpbmVkXV0sXG5cdFx0XHRcdFx0Y29sb3I6IGNvbG9yLFxuXHRcdFx0XHRcdGxhYmVsOiBvcHRpb25zLnNlcmllcy5waWUuY29tYmluZS5sYWJlbCxcblx0XHRcdFx0XHRhbmdsZTogY29tYmluZWQgKiBNYXRoLlBJICogMiAvIHRvdGFsLFxuXHRcdFx0XHRcdHBlcmNlbnQ6IGNvbWJpbmVkIC8gKHRvdGFsIC8gMTAwKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG5ld2RhdGE7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZHJhdyhwbG90LCBuZXdDdHgpIHtcblxuXHRcdFx0aWYgKCF0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuOyAvLyBpZiBubyBzZXJpZXMgd2VyZSBwYXNzZWRcblx0XHRcdH1cblxuXHRcdFx0dmFyIGNhbnZhc1dpZHRoID0gcGxvdC5nZXRQbGFjZWhvbGRlcigpLndpZHRoKCksXG5cdFx0XHRcdGNhbnZhc0hlaWdodCA9IHBsb3QuZ2V0UGxhY2Vob2xkZXIoKS5oZWlnaHQoKSxcblx0XHRcdFx0bGVnZW5kV2lkdGggPSB0YXJnZXQuY2hpbGRyZW4oKS5maWx0ZXIoXCIubGVnZW5kXCIpLmNoaWxkcmVuKCkud2lkdGgoKSB8fCAwO1xuXG5cdFx0XHRjdHggPSBuZXdDdHg7XG5cblx0XHRcdC8vIFdBUk5JTkc6IEhBQ0shIFJFV1JJVEUgVEhJUyBDT0RFIEFTIFNPT04gQVMgUE9TU0lCTEUhXG5cblx0XHRcdC8vIFdoZW4gY29tYmluaW5nIHNtYWxsZXIgc2xpY2VzIGludG8gYW4gJ290aGVyJyBzbGljZSwgd2UgbmVlZCB0b1xuXHRcdFx0Ly8gYWRkIGEgbmV3IHNlcmllcy4gIFNpbmNlIEZsb3QgZ2l2ZXMgcGx1Z2lucyBubyB3YXkgdG8gbW9kaWZ5IHRoZVxuXHRcdFx0Ly8gbGlzdCBvZiBzZXJpZXMsIHRoZSBwaWUgcGx1Z2luIHVzZXMgYSBoYWNrIHdoZXJlIHRoZSBmaXJzdCBjYWxsXG5cdFx0XHQvLyB0byBwcm9jZXNzRGF0YXBvaW50cyByZXN1bHRzIGluIGEgY2FsbCB0byBzZXREYXRhIHdpdGggdGhlIG5ld1xuXHRcdFx0Ly8gbGlzdCBvZiBzZXJpZXMsIHRoZW4gc3Vic2VxdWVudCBwcm9jZXNzRGF0YXBvaW50cyBkbyBub3RoaW5nLlxuXG5cdFx0XHQvLyBUaGUgcGx1Z2luLWdsb2JhbCAncHJvY2Vzc2VkJyBmbGFnIGlzIHVzZWQgdG8gY29udHJvbCB0aGlzIGhhY2s7XG5cdFx0XHQvLyBpdCBzdGFydHMgb3V0IGZhbHNlLCBhbmQgaXMgc2V0IHRvIHRydWUgYWZ0ZXIgdGhlIGZpcnN0IGNhbGwgdG9cblx0XHRcdC8vIHByb2Nlc3NEYXRhcG9pbnRzLlxuXG5cdFx0XHQvLyBVbmZvcnR1bmF0ZWx5IHRoaXMgdHVybnMgZnV0dXJlIHNldERhdGEgY2FsbHMgaW50byBuby1vcHM7IHRoZXlcblx0XHRcdC8vIGNhbGwgcHJvY2Vzc0RhdGFwb2ludHMsIHRoZSBmbGFnIGlzIHRydWUsIGFuZCBub3RoaW5nIGhhcHBlbnMuXG5cblx0XHRcdC8vIFRvIGZpeCB0aGlzIHdlJ2xsIHNldCB0aGUgZmxhZyBiYWNrIHRvIGZhbHNlIGhlcmUgaW4gZHJhdywgd2hlblxuXHRcdFx0Ly8gYWxsIHNlcmllcyBoYXZlIGJlZW4gcHJvY2Vzc2VkLCBzbyB0aGUgbmV4dCBzZXF1ZW5jZSBvZiBjYWxscyB0b1xuXHRcdFx0Ly8gcHJvY2Vzc0RhdGFwb2ludHMgb25jZSBhZ2FpbiBzdGFydHMgb3V0IHdpdGggYSBzbGljZS1jb21iaW5lLlxuXHRcdFx0Ly8gVGhpcyBpcyByZWFsbHkgYSBoYWNrOyBpbiAwLjkgd2UgbmVlZCB0byBnaXZlIHBsdWdpbnMgYSBwcm9wZXJcblx0XHRcdC8vIHdheSB0byBtb2RpZnkgc2VyaWVzIGJlZm9yZSBhbnkgcHJvY2Vzc2luZyBiZWdpbnMuXG5cblx0XHRcdHByb2Nlc3NlZCA9IGZhbHNlO1xuXG5cdFx0XHQvLyBjYWxjdWxhdGUgbWF4aW11bSByYWRpdXMgYW5kIGNlbnRlciBwb2ludFxuXG5cdFx0XHRtYXhSYWRpdXMgPSAgTWF0aC5taW4oY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCAvIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0KSAvIDI7XG5cdFx0XHRjZW50ZXJUb3AgPSBjYW52YXNIZWlnaHQgLyAyICsgb3B0aW9ucy5zZXJpZXMucGllLm9mZnNldC50b3A7XG5cdFx0XHRjZW50ZXJMZWZ0ID0gY2FudmFzV2lkdGggLyAyO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLm9mZnNldC5sZWZ0ID09IFwiYXV0b1wiKSB7XG5cdFx0XHRcdGlmIChvcHRpb25zLmxlZ2VuZC5wb3NpdGlvbi5tYXRjaChcIndcIikpIHtcblx0XHRcdFx0XHRjZW50ZXJMZWZ0ICs9IGxlZ2VuZFdpZHRoIC8gMjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjZW50ZXJMZWZ0IC09IGxlZ2VuZFdpZHRoIC8gMjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2VudGVyTGVmdCA8IG1heFJhZGl1cykge1xuXHRcdFx0XHRcdGNlbnRlckxlZnQgPSBtYXhSYWRpdXM7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY2VudGVyTGVmdCA+IGNhbnZhc1dpZHRoIC0gbWF4UmFkaXVzKSB7XG5cdFx0XHRcdFx0Y2VudGVyTGVmdCA9IGNhbnZhc1dpZHRoIC0gbWF4UmFkaXVzO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjZW50ZXJMZWZ0ICs9IG9wdGlvbnMuc2VyaWVzLnBpZS5vZmZzZXQubGVmdDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHNsaWNlcyA9IHBsb3QuZ2V0RGF0YSgpLFxuXHRcdFx0XHRhdHRlbXB0cyA9IDA7XG5cblx0XHRcdC8vIEtlZXAgc2hyaW5raW5nIHRoZSBwaWUncyByYWRpdXMgdW50aWwgZHJhd1BpZSByZXR1cm5zIHRydWUsXG5cdFx0XHQvLyBpbmRpY2F0aW5nIHRoYXQgYWxsIHRoZSBsYWJlbHMgZml0LCBvciB3ZSB0cnkgdG9vIG1hbnkgdGltZXMuXG5cblx0XHRcdGRvIHtcblx0XHRcdFx0aWYgKGF0dGVtcHRzID4gMCkge1xuXHRcdFx0XHRcdG1heFJhZGl1cyAqPSBSRURSQVdfU0hSSU5LO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGF0dGVtcHRzICs9IDE7XG5cdFx0XHRcdGNsZWFyKCk7XG5cdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUudGlsdCA8PSAwLjgpIHtcblx0XHRcdFx0XHRkcmF3U2hhZG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gd2hpbGUgKCFkcmF3UGllKCkgJiYgYXR0ZW1wdHMgPCBSRURSQVdfQVRURU1QVFMpXG5cblx0XHRcdGlmIChhdHRlbXB0cyA+PSBSRURSQVdfQVRURU1QVFMpIHtcblx0XHRcdFx0Y2xlYXIoKTtcblx0XHRcdFx0dGFyZ2V0LnByZXBlbmQoXCI8ZGl2IGNsYXNzPSdlcnJvcic+Q291bGQgbm90IGRyYXcgcGllIHdpdGggbGFiZWxzIGNvbnRhaW5lZCBpbnNpZGUgY2FudmFzPC9kaXY+XCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGxvdC5zZXRTZXJpZXMgJiYgcGxvdC5pbnNlcnRMZWdlbmQpIHtcblx0XHRcdFx0cGxvdC5zZXRTZXJpZXMoc2xpY2VzKTtcblx0XHRcdFx0cGxvdC5pbnNlcnRMZWdlbmQoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gd2UncmUgYWN0dWFsbHkgZG9uZSBhdCB0aGlzIHBvaW50LCBqdXN0IGRlZmluaW5nIGludGVybmFsIGZ1bmN0aW9ucyBhdCB0aGlzIHBvaW50XG5cblx0XHRcdGZ1bmN0aW9uIGNsZWFyKCkge1xuXHRcdFx0XHRjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuXHRcdFx0XHR0YXJnZXQuY2hpbGRyZW4oKS5maWx0ZXIoXCIucGllTGFiZWwsIC5waWVMYWJlbEJhY2tncm91bmRcIikucmVtb3ZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRyYXdTaGFkb3coKSB7XG5cblx0XHRcdFx0dmFyIHNoYWRvd0xlZnQgPSBvcHRpb25zLnNlcmllcy5waWUuc2hhZG93LmxlZnQ7XG5cdFx0XHRcdHZhciBzaGFkb3dUb3AgPSBvcHRpb25zLnNlcmllcy5waWUuc2hhZG93LnRvcDtcblx0XHRcdFx0dmFyIGVkZ2UgPSAxMDtcblx0XHRcdFx0dmFyIGFscGhhID0gb3B0aW9ucy5zZXJpZXMucGllLnNoYWRvdy5hbHBoYTtcblx0XHRcdFx0dmFyIHJhZGl1cyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPiAxID8gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA6IG1heFJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXM7XG5cblx0XHRcdFx0aWYgKHJhZGl1cyA+PSBjYW52YXNXaWR0aCAvIDIgLSBzaGFkb3dMZWZ0IHx8IHJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0ID49IGNhbnZhc0hlaWdodCAvIDIgLSBzaGFkb3dUb3AgfHwgcmFkaXVzIDw9IGVkZ2UpIHtcblx0XHRcdFx0XHRyZXR1cm47XHQvLyBzaGFkb3cgd291bGQgYmUgb3V0c2lkZSBjYW52YXMsIHNvIGRvbid0IGRyYXcgaXRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoc2hhZG93TGVmdCxzaGFkb3dUb3ApO1xuXHRcdFx0XHRjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYTtcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IFwiIzAwMFwiO1xuXG5cdFx0XHRcdC8vIGNlbnRlciBhbmQgcm90YXRlIHRvIHN0YXJ0aW5nIHBvc2l0aW9uXG5cblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjZW50ZXJMZWZ0LGNlbnRlclRvcCk7XG5cdFx0XHRcdGN0eC5zY2FsZSgxLCBvcHRpb25zLnNlcmllcy5waWUudGlsdCk7XG5cblx0XHRcdFx0Ly9yYWRpdXMgLT0gZWRnZTtcblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8PSBlZGdlOyBpKyspIHtcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG5cdFx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0XHRyYWRpdXMgLT0gaTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRyYXdQaWUoKSB7XG5cblx0XHRcdFx0dmFyIHN0YXJ0QW5nbGUgPSBNYXRoLlBJICogb3B0aW9ucy5zZXJpZXMucGllLnN0YXJ0QW5nbGU7XG5cdFx0XHRcdHZhciByYWRpdXMgPSBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID4gMSA/IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgOiBtYXhSYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzO1xuXG5cdFx0XHRcdC8vIGNlbnRlciBhbmQgcm90YXRlIHRvIHN0YXJ0aW5nIHBvc2l0aW9uXG5cblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0Y3R4LnRyYW5zbGF0ZShjZW50ZXJMZWZ0LGNlbnRlclRvcCk7XG5cdFx0XHRcdGN0eC5zY2FsZSgxLCBvcHRpb25zLnNlcmllcy5waWUudGlsdCk7XG5cdFx0XHRcdC8vY3R4LnJvdGF0ZShzdGFydEFuZ2xlKTsgLy8gc3RhcnQgYXQgdG9wOyAtLSBUaGlzIGRvZXNuJ3Qgd29yayBwcm9wZXJseSBpbiBPcGVyYVxuXG5cdFx0XHRcdC8vIGRyYXcgc2xpY2VzXG5cblx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0dmFyIGN1cnJlbnRBbmdsZSA9IHN0YXJ0QW5nbGU7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0c2xpY2VzW2ldLnN0YXJ0QW5nbGUgPSBjdXJyZW50QW5nbGU7XG5cdFx0XHRcdFx0ZHJhd1NsaWNlKHNsaWNlc1tpXS5hbmdsZSwgc2xpY2VzW2ldLmNvbG9yLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXG5cdFx0XHRcdC8vIGRyYXcgc2xpY2Ugb3V0bGluZXNcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnN0cm9rZS53aWR0aCA+IDApIHtcblx0XHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRcdGN0eC5saW5lV2lkdGggPSBvcHRpb25zLnNlcmllcy5waWUuc3Ryb2tlLndpZHRoO1xuXHRcdFx0XHRcdGN1cnJlbnRBbmdsZSA9IHN0YXJ0QW5nbGU7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHRcdGRyYXdTbGljZShzbGljZXNbaV0uYW5nbGUsIG9wdGlvbnMuc2VyaWVzLnBpZS5zdHJva2UuY29sb3IsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGRyYXcgZG9udXQgaG9sZVxuXG5cdFx0XHRcdGRyYXdEb251dEhvbGUoY3R4KTtcblxuXHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXG5cdFx0XHRcdC8vIERyYXcgdGhlIGxhYmVscywgcmV0dXJuaW5nIHRydWUgaWYgdGhleSBmaXQgd2l0aGluIHRoZSBwbG90XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5zaG93KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRyYXdMYWJlbHMoKTtcblx0XHRcdFx0fSBlbHNlIHJldHVybiB0cnVlO1xuXG5cdFx0XHRcdGZ1bmN0aW9uIGRyYXdTbGljZShhbmdsZSwgY29sb3IsIGZpbGwpIHtcblxuXHRcdFx0XHRcdGlmIChhbmdsZSA8PSAwIHx8IGlzTmFOKGFuZ2xlKSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChmaWxsKSB7XG5cdFx0XHRcdFx0XHRjdHguZmlsbFN0eWxlID0gY29sb3I7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRcdFx0Y3R4LmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRpZiAoTWF0aC5hYnMoYW5nbGUgLSBNYXRoLlBJICogMikgPiAwLjAwMDAwMDAwMSkge1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmVUbygwLCAwKTsgLy8gQ2VudGVyIG9mIHRoZSBwaWVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL2N0eC5hcmMoMCwgMCwgcmFkaXVzLCAwLCBhbmdsZSwgZmFsc2UpOyAvLyBUaGlzIGRvZXNuJ3Qgd29yayBwcm9wZXJseSBpbiBPcGVyYVxuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgcmFkaXVzLGN1cnJlbnRBbmdsZSwgY3VycmVudEFuZ2xlICsgYW5nbGUgLyAyLCBmYWxzZSk7XG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCByYWRpdXMsY3VycmVudEFuZ2xlICsgYW5nbGUgLyAyLCBjdXJyZW50QW5nbGUgKyBhbmdsZSwgZmFsc2UpO1xuXHRcdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHQvL2N0eC5yb3RhdGUoYW5nbGUpOyAvLyBUaGlzIGRvZXNuJ3Qgd29yayBwcm9wZXJseSBpbiBPcGVyYVxuXHRcdFx0XHRcdGN1cnJlbnRBbmdsZSArPSBhbmdsZTtcblxuXHRcdFx0XHRcdGlmIChmaWxsKSB7XG5cdFx0XHRcdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gZHJhd0xhYmVscygpIHtcblxuXHRcdFx0XHRcdHZhciBjdXJyZW50QW5nbGUgPSBzdGFydEFuZ2xlO1xuXHRcdFx0XHRcdHZhciByYWRpdXMgPSBvcHRpb25zLnNlcmllcy5waWUubGFiZWwucmFkaXVzID4gMSA/IG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5yYWRpdXMgOiBtYXhSYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUubGFiZWwucmFkaXVzO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHRcdGlmIChzbGljZXNbaV0ucGVyY2VudCA+PSBvcHRpb25zLnNlcmllcy5waWUubGFiZWwudGhyZXNob2xkICogMTAwKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghZHJhd0xhYmVsKHNsaWNlc1tpXSwgY3VycmVudEFuZ2xlLCBpKSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3VycmVudEFuZ2xlICs9IHNsaWNlc1tpXS5hbmdsZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHRcdGZ1bmN0aW9uIGRyYXdMYWJlbChzbGljZSwgc3RhcnRBbmdsZSwgaW5kZXgpIHtcblxuXHRcdFx0XHRcdFx0aWYgKHNsaWNlLmRhdGFbMF1bMV0gPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gZm9ybWF0IGxhYmVsIHRleHRcblxuXHRcdFx0XHRcdFx0dmFyIGxmID0gb3B0aW9ucy5sZWdlbmQubGFiZWxGb3JtYXR0ZXIsIHRleHQsIHBsZiA9IG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5mb3JtYXR0ZXI7XG5cblx0XHRcdFx0XHRcdGlmIChsZikge1xuXHRcdFx0XHRcdFx0XHR0ZXh0ID0gbGYoc2xpY2UubGFiZWwsIHNsaWNlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRleHQgPSBzbGljZS5sYWJlbDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHBsZikge1xuXHRcdFx0XHRcdFx0XHR0ZXh0ID0gcGxmKHRleHQsIHNsaWNlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIGhhbGZBbmdsZSA9ICgoc3RhcnRBbmdsZSArIHNsaWNlLmFuZ2xlKSArIHN0YXJ0QW5nbGUpIC8gMjtcblx0XHRcdFx0XHRcdHZhciB4ID0gY2VudGVyTGVmdCArIE1hdGgucm91bmQoTWF0aC5jb3MoaGFsZkFuZ2xlKSAqIHJhZGl1cyk7XG5cdFx0XHRcdFx0XHR2YXIgeSA9IGNlbnRlclRvcCArIE1hdGgucm91bmQoTWF0aC5zaW4oaGFsZkFuZ2xlKSAqIHJhZGl1cykgKiBvcHRpb25zLnNlcmllcy5waWUudGlsdDtcblxuXHRcdFx0XHRcdFx0dmFyIGh0bWwgPSBcIjxzcGFuIGNsYXNzPSdwaWVMYWJlbCcgaWQ9J3BpZUxhYmVsXCIgKyBpbmRleCArIFwiJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7dG9wOlwiICsgeSArIFwicHg7bGVmdDpcIiArIHggKyBcInB4Oyc+XCIgKyB0ZXh0ICsgXCI8L3NwYW4+XCI7XG5cdFx0XHRcdFx0XHR0YXJnZXQuYXBwZW5kKGh0bWwpO1xuXG5cdFx0XHRcdFx0XHR2YXIgbGFiZWwgPSB0YXJnZXQuY2hpbGRyZW4oXCIjcGllTGFiZWxcIiArIGluZGV4KTtcblx0XHRcdFx0XHRcdHZhciBsYWJlbFRvcCA9ICh5IC0gbGFiZWwuaGVpZ2h0KCkgLyAyKTtcblx0XHRcdFx0XHRcdHZhciBsYWJlbExlZnQgPSAoeCAtIGxhYmVsLndpZHRoKCkgLyAyKTtcblxuXHRcdFx0XHRcdFx0bGFiZWwuY3NzKFwidG9wXCIsIGxhYmVsVG9wKTtcblx0XHRcdFx0XHRcdGxhYmVsLmNzcyhcImxlZnRcIiwgbGFiZWxMZWZ0KTtcblxuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGxhYmVsIGlzIG5vdCBvdXRzaWRlIHRoZSBjYW52YXNcblxuXHRcdFx0XHRcdFx0aWYgKDAgLSBsYWJlbFRvcCA+IDAgfHwgMCAtIGxhYmVsTGVmdCA+IDAgfHwgY2FudmFzSGVpZ2h0IC0gKGxhYmVsVG9wICsgbGFiZWwuaGVpZ2h0KCkpIDwgMCB8fCBjYW52YXNXaWR0aCAtIChsYWJlbExlZnQgKyBsYWJlbC53aWR0aCgpKSA8IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLmJhY2tncm91bmQub3BhY2l0eSAhPSAwKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gcHV0IGluIHRoZSB0cmFuc3BhcmVudCBiYWNrZ3JvdW5kIHNlcGFyYXRlbHkgdG8gYXZvaWQgYmxlbmRlZCBsYWJlbHMgYW5kIGxhYmVsIGJveGVzXG5cblx0XHRcdFx0XHRcdFx0dmFyIGMgPSBvcHRpb25zLnNlcmllcy5waWUubGFiZWwuYmFja2dyb3VuZC5jb2xvcjtcblxuXHRcdFx0XHRcdFx0XHRpZiAoYyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdFx0YyA9IHNsaWNlLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0dmFyIHBvcyA9IFwidG9wOlwiICsgbGFiZWxUb3AgKyBcInB4O2xlZnQ6XCIgKyBsYWJlbExlZnQgKyBcInB4O1wiO1xuXHRcdFx0XHRcdFx0XHQkKFwiPGRpdiBjbGFzcz0ncGllTGFiZWxCYWNrZ3JvdW5kJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7d2lkdGg6XCIgKyBsYWJlbC53aWR0aCgpICsgXCJweDtoZWlnaHQ6XCIgKyBsYWJlbC5oZWlnaHQoKSArIFwicHg7XCIgKyBwb3MgKyBcImJhY2tncm91bmQtY29sb3I6XCIgKyBjICsgXCI7Jz48L2Rpdj5cIilcblx0XHRcdFx0XHRcdFx0XHQuY3NzKFwib3BhY2l0eVwiLCBvcHRpb25zLnNlcmllcy5waWUubGFiZWwuYmFja2dyb3VuZC5vcGFjaXR5KVxuXHRcdFx0XHRcdFx0XHRcdC5pbnNlcnRCZWZvcmUobGFiZWwpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9IC8vIGVuZCBpbmRpdmlkdWFsIGxhYmVsIGZ1bmN0aW9uXG5cdFx0XHRcdH0gLy8gZW5kIGRyYXdMYWJlbHMgZnVuY3Rpb25cblx0XHRcdH0gLy8gZW5kIGRyYXdQaWUgZnVuY3Rpb25cblx0XHR9IC8vIGVuZCBkcmF3IGZ1bmN0aW9uXG5cblx0XHQvLyBQbGFjZWQgaGVyZSBiZWNhdXNlIGl0IG5lZWRzIHRvIGJlIGFjY2Vzc2VkIGZyb20gbXVsdGlwbGUgbG9jYXRpb25zXG5cblx0XHRmdW5jdGlvbiBkcmF3RG9udXRIb2xlKGxheWVyKSB7XG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLmlubmVyUmFkaXVzID4gMCkge1xuXG5cdFx0XHRcdC8vIHN1YnRyYWN0IHRoZSBjZW50ZXJcblxuXHRcdFx0XHRsYXllci5zYXZlKCk7XG5cdFx0XHRcdHZhciBpbm5lclJhZGl1cyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5pbm5lclJhZGl1cyA+IDEgPyBvcHRpb25zLnNlcmllcy5waWUuaW5uZXJSYWRpdXMgOiBtYXhSYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUuaW5uZXJSYWRpdXM7XG5cdFx0XHRcdGxheWVyLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGVzdGluYXRpb24tb3V0XCI7IC8vIHRoaXMgZG9lcyBub3Qgd29yayB3aXRoIGV4Y2FudmFzLCBidXQgaXQgd2lsbCBmYWxsIGJhY2sgdG8gdXNpbmcgdGhlIHN0cm9rZSBjb2xvclxuXHRcdFx0XHRsYXllci5iZWdpblBhdGgoKTtcblx0XHRcdFx0bGF5ZXIuZmlsbFN0eWxlID0gb3B0aW9ucy5zZXJpZXMucGllLnN0cm9rZS5jb2xvcjtcblx0XHRcdFx0bGF5ZXIuYXJjKDAsIDAsIGlubmVyUmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuXHRcdFx0XHRsYXllci5maWxsKCk7XG5cdFx0XHRcdGxheWVyLmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRsYXllci5yZXN0b3JlKCk7XG5cblx0XHRcdFx0Ly8gYWRkIGlubmVyIHN0cm9rZVxuXG5cdFx0XHRcdGxheWVyLnNhdmUoKTtcblx0XHRcdFx0bGF5ZXIuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGxheWVyLnN0cm9rZVN0eWxlID0gb3B0aW9ucy5zZXJpZXMucGllLnN0cm9rZS5jb2xvcjtcblx0XHRcdFx0bGF5ZXIuYXJjKDAsIDAsIGlubmVyUmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuXHRcdFx0XHRsYXllci5zdHJva2UoKTtcblx0XHRcdFx0bGF5ZXIuY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGxheWVyLnJlc3RvcmUoKTtcblxuXHRcdFx0XHQvLyBUT0RPOiBhZGQgZXh0cmEgc2hhZG93IGluc2lkZSBob2xlICh3aXRoIGEgbWFzaykgaWYgdGhlIHBpZSBpcyB0aWx0ZWQuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8tLSBBZGRpdGlvbmFsIEludGVyYWN0aXZlIHJlbGF0ZWQgZnVuY3Rpb25zIC0tXG5cblx0XHRmdW5jdGlvbiBpc1BvaW50SW5Qb2x5KHBvbHksIHB0KSB7XG5cdFx0XHRmb3IodmFyIGMgPSBmYWxzZSwgaSA9IC0xLCBsID0gcG9seS5sZW5ndGgsIGogPSBsIC0gMTsgKytpIDwgbDsgaiA9IGkpXG5cdFx0XHRcdCgocG9seVtpXVsxXSA8PSBwdFsxXSAmJiBwdFsxXSA8IHBvbHlbal1bMV0pIHx8IChwb2x5W2pdWzFdIDw9IHB0WzFdICYmIHB0WzFdPCBwb2x5W2ldWzFdKSlcblx0XHRcdFx0JiYgKHB0WzBdIDwgKHBvbHlbal1bMF0gLSBwb2x5W2ldWzBdKSAqIChwdFsxXSAtIHBvbHlbaV1bMV0pIC8gKHBvbHlbal1bMV0gLSBwb2x5W2ldWzFdKSArIHBvbHlbaV1bMF0pXG5cdFx0XHRcdCYmIChjID0gIWMpO1xuXHRcdFx0cmV0dXJuIGM7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZmluZE5lYXJieVNsaWNlKG1vdXNlWCwgbW91c2VZKSB7XG5cblx0XHRcdHZhciBzbGljZXMgPSBwbG90LmdldERhdGEoKSxcblx0XHRcdFx0b3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpLFxuXHRcdFx0XHRyYWRpdXMgPSBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID4gMSA/IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgOiBtYXhSYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzLFxuXHRcdFx0XHR4LCB5O1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlcy5sZW5ndGg7ICsraSkge1xuXG5cdFx0XHRcdHZhciBzID0gc2xpY2VzW2ldO1xuXG5cdFx0XHRcdGlmIChzLnBpZS5zaG93KSB7XG5cblx0XHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHRjdHgubW92ZVRvKDAsIDApOyAvLyBDZW50ZXIgb2YgdGhlIHBpZVxuXHRcdFx0XHRcdC8vY3R4LnNjYWxlKDEsIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0KTtcdC8vIHRoaXMgYWN0dWFsbHkgc2VlbXMgdG8gYnJlYWsgZXZlcnl0aGluZyB3aGVuIGhlcmUuXG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCByYWRpdXMsIHMuc3RhcnRBbmdsZSwgcy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDIsIGZhbHNlKTtcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIHJhZGl1cywgcy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDIsIHMuc3RhcnRBbmdsZSArIHMuYW5nbGUsIGZhbHNlKTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0eCA9IG1vdXNlWCAtIGNlbnRlckxlZnQ7XG5cdFx0XHRcdFx0eSA9IG1vdXNlWSAtIGNlbnRlclRvcDtcblxuXHRcdFx0XHRcdGlmIChjdHguaXNQb2ludEluUGF0aCkge1xuXHRcdFx0XHRcdFx0aWYgKGN0eC5pc1BvaW50SW5QYXRoKG1vdXNlWCAtIGNlbnRlckxlZnQsIG1vdXNlWSAtIGNlbnRlclRvcCkpIHtcblx0XHRcdFx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhcG9pbnQ6IFtzLnBlcmNlbnQsIHMuZGF0YV0sXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUluZGV4OiAwLFxuXHRcdFx0XHRcdFx0XHRcdHNlcmllczogcyxcblx0XHRcdFx0XHRcdFx0XHRzZXJpZXNJbmRleDogaVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdC8vIGV4Y2FudmFzIGZvciBJRSBkb2Vzbjt0IHN1cHBvcnQgaXNQb2ludEluUGF0aCwgdGhpcyBpcyBhIHdvcmthcm91bmQuXG5cblx0XHRcdFx0XHRcdHZhciBwMVggPSByYWRpdXMgKiBNYXRoLmNvcyhzLnN0YXJ0QW5nbGUpLFxuXHRcdFx0XHRcdFx0XHRwMVkgPSByYWRpdXMgKiBNYXRoLnNpbihzLnN0YXJ0QW5nbGUpLFxuXHRcdFx0XHRcdFx0XHRwMlggPSByYWRpdXMgKiBNYXRoLmNvcyhzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gNCksXG5cdFx0XHRcdFx0XHRcdHAyWSA9IHJhZGl1cyAqIE1hdGguc2luKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyA0KSxcblx0XHRcdFx0XHRcdFx0cDNYID0gcmFkaXVzICogTWF0aC5jb3Mocy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDIpLFxuXHRcdFx0XHRcdFx0XHRwM1kgPSByYWRpdXMgKiBNYXRoLnNpbihzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gMiksXG5cdFx0XHRcdFx0XHRcdHA0WCA9IHJhZGl1cyAqIE1hdGguY29zKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyAxLjUpLFxuXHRcdFx0XHRcdFx0XHRwNFkgPSByYWRpdXMgKiBNYXRoLnNpbihzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gMS41KSxcblx0XHRcdFx0XHRcdFx0cDVYID0gcmFkaXVzICogTWF0aC5jb3Mocy5zdGFydEFuZ2xlICsgcy5hbmdsZSksXG5cdFx0XHRcdFx0XHRcdHA1WSA9IHJhZGl1cyAqIE1hdGguc2luKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUpLFxuXHRcdFx0XHRcdFx0XHRhcnJQb2x5ID0gW1swLCAwXSwgW3AxWCwgcDFZXSwgW3AyWCwgcDJZXSwgW3AzWCwgcDNZXSwgW3A0WCwgcDRZXSwgW3A1WCwgcDVZXV0sXG5cdFx0XHRcdFx0XHRcdGFyclBvaW50ID0gW3gsIHldO1xuXG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBwZXJoYXBzIGRvIHNvbWUgbWF0aG1hdGljYWwgdHJpY2tlcnkgaGVyZSB3aXRoIHRoZSBZLWNvb3JkaW5hdGUgdG8gY29tcGVuc2F0ZSBmb3IgcGllIHRpbHQ/XG5cblx0XHRcdFx0XHRcdGlmIChpc1BvaW50SW5Qb2x5KGFyclBvbHksIGFyclBvaW50KSkge1xuXHRcdFx0XHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFwb2ludDogW3MucGVyY2VudCwgcy5kYXRhXSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhSW5kZXg6IDAsXG5cdFx0XHRcdFx0XHRcdFx0c2VyaWVzOiBzLFxuXHRcdFx0XHRcdFx0XHRcdHNlcmllc0luZGV4OiBpXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdXNlTW92ZShlKSB7XG5cdFx0XHR0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KFwicGxvdGhvdmVyXCIsIGUpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xuXHRcdFx0dHJpZ2dlckNsaWNrSG92ZXJFdmVudChcInBsb3RjbGlja1wiLCBlKTtcblx0XHR9XG5cblx0XHQvLyB0cmlnZ2VyIGNsaWNrIG9yIGhvdmVyIGV2ZW50ICh0aGV5IHNlbmQgdGhlIHNhbWUgcGFyYW1ldGVycyBzbyB3ZSBzaGFyZSB0aGVpciBjb2RlKVxuXG5cdFx0ZnVuY3Rpb24gdHJpZ2dlckNsaWNrSG92ZXJFdmVudChldmVudG5hbWUsIGUpIHtcblxuXHRcdFx0dmFyIG9mZnNldCA9IHBsb3Qub2Zmc2V0KCk7XG5cdFx0XHR2YXIgY2FudmFzWCA9IHBhcnNlSW50KGUucGFnZVggLSBvZmZzZXQubGVmdCk7XG5cdFx0XHR2YXIgY2FudmFzWSA9ICBwYXJzZUludChlLnBhZ2VZIC0gb2Zmc2V0LnRvcCk7XG5cdFx0XHR2YXIgaXRlbSA9IGZpbmROZWFyYnlTbGljZShjYW52YXNYLCBjYW52YXNZKTtcblxuXHRcdFx0aWYgKG9wdGlvbnMuZ3JpZC5hdXRvSGlnaGxpZ2h0KSB7XG5cblx0XHRcdFx0Ly8gY2xlYXIgYXV0by1oaWdobGlnaHRzXG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBoaWdobGlnaHRzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0dmFyIGggPSBoaWdobGlnaHRzW2ldO1xuXHRcdFx0XHRcdGlmIChoLmF1dG8gPT0gZXZlbnRuYW1lICYmICEoaXRlbSAmJiBoLnNlcmllcyA9PSBpdGVtLnNlcmllcykpIHtcblx0XHRcdFx0XHRcdHVuaGlnaGxpZ2h0KGguc2VyaWVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gaGlnaGxpZ2h0IHRoZSBzbGljZVxuXG5cdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHRoaWdobGlnaHQoaXRlbS5zZXJpZXMsIGV2ZW50bmFtZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHRyaWdnZXIgYW55IGhvdmVyIGJpbmQgZXZlbnRzXG5cblx0XHRcdHZhciBwb3MgPSB7IHBhZ2VYOiBlLnBhZ2VYLCBwYWdlWTogZS5wYWdlWSB9O1xuXHRcdFx0dGFyZ2V0LnRyaWdnZXIoZXZlbnRuYW1lLCBbcG9zLCBpdGVtXSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGlnaGxpZ2h0KHMsIGF1dG8pIHtcblx0XHRcdC8vaWYgKHR5cGVvZiBzID09IFwibnVtYmVyXCIpIHtcblx0XHRcdC8vXHRzID0gc2VyaWVzW3NdO1xuXHRcdFx0Ly99XG5cblx0XHRcdHZhciBpID0gaW5kZXhPZkhpZ2hsaWdodChzKTtcblxuXHRcdFx0aWYgKGkgPT0gLTEpIHtcblx0XHRcdFx0aGlnaGxpZ2h0cy5wdXNoKHsgc2VyaWVzOiBzLCBhdXRvOiBhdXRvIH0pO1xuXHRcdFx0XHRwbG90LnRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG5cdFx0XHR9IGVsc2UgaWYgKCFhdXRvKSB7XG5cdFx0XHRcdGhpZ2hsaWdodHNbaV0uYXV0byA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHVuaGlnaGxpZ2h0KHMpIHtcblx0XHRcdGlmIChzID09IG51bGwpIHtcblx0XHRcdFx0aGlnaGxpZ2h0cyA9IFtdO1xuXHRcdFx0XHRwbG90LnRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vaWYgKHR5cGVvZiBzID09IFwibnVtYmVyXCIpIHtcblx0XHRcdC8vXHRzID0gc2VyaWVzW3NdO1xuXHRcdFx0Ly99XG5cblx0XHRcdHZhciBpID0gaW5kZXhPZkhpZ2hsaWdodChzKTtcblxuXHRcdFx0aWYgKGkgIT0gLTEpIHtcblx0XHRcdFx0aGlnaGxpZ2h0cy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdHBsb3QudHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBpbmRleE9mSGlnaGxpZ2h0KHMpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaGlnaGxpZ2h0cy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHR2YXIgaCA9IGhpZ2hsaWdodHNbaV07XG5cdFx0XHRcdGlmIChoLnNlcmllcyA9PSBzKVxuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRyYXdPdmVybGF5KHBsb3QsIG9jdHgpIHtcblxuXHRcdFx0dmFyIG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKTtcblxuXHRcdFx0dmFyIHJhZGl1cyA9IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgPiAxID8gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA6IG1heFJhZGl1cyAqIG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXM7XG5cblx0XHRcdG9jdHguc2F2ZSgpO1xuXHRcdFx0b2N0eC50cmFuc2xhdGUoY2VudGVyTGVmdCwgY2VudGVyVG9wKTtcblx0XHRcdG9jdHguc2NhbGUoMSwgb3B0aW9ucy5zZXJpZXMucGllLnRpbHQpO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0ZHJhd0hpZ2hsaWdodChoaWdobGlnaHRzW2ldLnNlcmllcyk7XG5cdFx0XHR9XG5cblx0XHRcdGRyYXdEb251dEhvbGUob2N0eCk7XG5cblx0XHRcdG9jdHgucmVzdG9yZSgpO1xuXG5cdFx0XHRmdW5jdGlvbiBkcmF3SGlnaGxpZ2h0KHNlcmllcykge1xuXG5cdFx0XHRcdGlmIChzZXJpZXMuYW5nbGUgPD0gMCB8fCBpc05hTihzZXJpZXMuYW5nbGUpKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9vY3R4LmZpbGxTdHlsZSA9IHBhcnNlQ29sb3Iob3B0aW9ucy5zZXJpZXMucGllLmhpZ2hsaWdodC5jb2xvcikuc2NhbGUobnVsbCwgbnVsbCwgbnVsbCwgb3B0aW9ucy5zZXJpZXMucGllLmhpZ2hsaWdodC5vcGFjaXR5KS50b1N0cmluZygpO1xuXHRcdFx0XHRvY3R4LmZpbGxTdHlsZSA9IFwicmdiYSgyNTUsIDI1NSwgMjU1LCBcIiArIG9wdGlvbnMuc2VyaWVzLnBpZS5oaWdobGlnaHQub3BhY2l0eSArIFwiKVwiOyAvLyB0aGlzIGlzIHRlbXBvcmFyeSB1bnRpbCB3ZSBoYXZlIGFjY2VzcyB0byBwYXJzZUNvbG9yXG5cdFx0XHRcdG9jdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGlmIChNYXRoLmFicyhzZXJpZXMuYW5nbGUgLSBNYXRoLlBJICogMikgPiAwLjAwMDAwMDAwMSkge1xuXHRcdFx0XHRcdG9jdHgubW92ZVRvKDAsIDApOyAvLyBDZW50ZXIgb2YgdGhlIHBpZVxuXHRcdFx0XHR9XG5cdFx0XHRcdG9jdHguYXJjKDAsIDAsIHJhZGl1cywgc2VyaWVzLnN0YXJ0QW5nbGUsIHNlcmllcy5zdGFydEFuZ2xlICsgc2VyaWVzLmFuZ2xlIC8gMiwgZmFsc2UpO1xuXHRcdFx0XHRvY3R4LmFyYygwLCAwLCByYWRpdXMsIHNlcmllcy5zdGFydEFuZ2xlICsgc2VyaWVzLmFuZ2xlIC8gMiwgc2VyaWVzLnN0YXJ0QW5nbGUgKyBzZXJpZXMuYW5nbGUsIGZhbHNlKTtcblx0XHRcdFx0b2N0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0b2N0eC5maWxsKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IC8vIGVuZCBpbml0IChwbHVnaW4gYm9keSlcblxuXHQvLyBkZWZpbmUgcGllIHNwZWNpZmljIG9wdGlvbnMgYW5kIHRoZWlyIGRlZmF1bHQgdmFsdWVzXG5cblx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0c2VyaWVzOiB7XG5cdFx0XHRwaWU6IHtcblx0XHRcdFx0c2hvdzogZmFsc2UsXG5cdFx0XHRcdHJhZGl1czogXCJhdXRvXCIsXHQvLyBhY3R1YWwgcmFkaXVzIG9mIHRoZSB2aXNpYmxlIHBpZSAoYmFzZWQgb24gZnVsbCBjYWxjdWxhdGVkIHJhZGl1cyBpZiA8PTEsIG9yIGhhcmQgcGl4ZWwgdmFsdWUpXG5cdFx0XHRcdGlubmVyUmFkaXVzOiAwLCAvKiBmb3IgZG9udXQgKi9cblx0XHRcdFx0c3RhcnRBbmdsZTogMy8yLFxuXHRcdFx0XHR0aWx0OiAxLFxuXHRcdFx0XHRzaGFkb3c6IHtcblx0XHRcdFx0XHRsZWZ0OiA1LFx0Ly8gc2hhZG93IGxlZnQgb2Zmc2V0XG5cdFx0XHRcdFx0dG9wOiAxNSxcdC8vIHNoYWRvdyB0b3Agb2Zmc2V0XG5cdFx0XHRcdFx0YWxwaGE6IDAuMDJcdC8vIHNoYWRvdyBhbHBoYVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvZmZzZXQ6IHtcblx0XHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdFx0bGVmdDogXCJhdXRvXCJcblx0XHRcdFx0fSxcblx0XHRcdFx0c3Ryb2tlOiB7XG5cdFx0XHRcdFx0Y29sb3I6IFwiI2ZmZlwiLFxuXHRcdFx0XHRcdHdpZHRoOiAxXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxhYmVsOiB7XG5cdFx0XHRcdFx0c2hvdzogXCJhdXRvXCIsXG5cdFx0XHRcdFx0Zm9ybWF0dGVyOiBmdW5jdGlvbihsYWJlbCwgc2xpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBcIjxkaXYgc3R5bGU9J2ZvbnQtc2l6ZTp4LXNtYWxsO3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MnB4O2NvbG9yOlwiICsgc2xpY2UuY29sb3IgKyBcIjsnPlwiICsgbGFiZWwgKyBcIjxici8+XCIgKyBNYXRoLnJvdW5kKHNsaWNlLnBlcmNlbnQpICsgXCIlPC9kaXY+XCI7XG5cdFx0XHRcdFx0fSxcdC8vIGZvcm1hdHRlciBmdW5jdGlvblxuXHRcdFx0XHRcdHJhZGl1czogMSxcdC8vIHJhZGl1cyBhdCB3aGljaCB0byBwbGFjZSB0aGUgbGFiZWxzIChiYXNlZCBvbiBmdWxsIGNhbGN1bGF0ZWQgcmFkaXVzIGlmIDw9MSwgb3IgaGFyZCBwaXhlbCB2YWx1ZSlcblx0XHRcdFx0XHRiYWNrZ3JvdW5kOiB7XG5cdFx0XHRcdFx0XHRjb2xvcjogbnVsbCxcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHRocmVzaG9sZDogMFx0Ly8gcGVyY2VudGFnZSBhdCB3aGljaCB0byBoaWRlIHRoZSBsYWJlbCAoaS5lLiB0aGUgc2xpY2UgaXMgdG9vIG5hcnJvdylcblx0XHRcdFx0fSxcblx0XHRcdFx0Y29tYmluZToge1xuXHRcdFx0XHRcdHRocmVzaG9sZDogLTEsXHQvLyBwZXJjZW50YWdlIGF0IHdoaWNoIHRvIGNvbWJpbmUgbGl0dGxlIHNsaWNlcyBpbnRvIG9uZSBsYXJnZXIgc2xpY2Vcblx0XHRcdFx0XHRjb2xvcjogbnVsbCxcdC8vIGNvbG9yIHRvIGdpdmUgdGhlIG5ldyBzbGljZSAoYXV0by1nZW5lcmF0ZWQgaWYgbnVsbClcblx0XHRcdFx0XHRsYWJlbDogXCJPdGhlclwiXHQvLyBsYWJlbCB0byBnaXZlIHRoZSBuZXcgc2xpY2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0aGlnaGxpZ2h0OiB7XG5cdFx0XHRcdFx0Ly9jb2xvcjogXCIjZmZmXCIsXHRcdC8vIHdpbGwgYWRkIHRoaXMgZnVuY3Rpb25hbGl0eSBvbmNlIHBhcnNlQ29sb3IgaXMgYXZhaWxhYmxlXG5cdFx0XHRcdFx0b3BhY2l0eTogMC41XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0JC5wbG90LnBsdWdpbnMucHVzaCh7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRvcHRpb25zOiBvcHRpb25zLFxuXHRcdG5hbWU6IFwicGllXCIsXG5cdFx0dmVyc2lvbjogXCIxLjFcIlxuXHR9KTtcblxufSkoalF1ZXJ5KTtcbiIsIi8qIEZsb3QgcGx1Z2luIGZvciBhdXRvbWF0aWNhbGx5IHJlZHJhd2luZyBwbG90cyBhcyB0aGUgcGxhY2Vob2xkZXIgcmVzaXplcy5cblxuQ29weXJpZ2h0IChjKSAyMDA3LTIwMTQgSU9MQSBhbmQgT2xlIExhdXJzZW4uXG5MaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbkl0IHdvcmtzIGJ5IGxpc3RlbmluZyBmb3IgY2hhbmdlcyBvbiB0aGUgcGxhY2Vob2xkZXIgZGl2ICh0aHJvdWdoIHRoZSBqUXVlcnlcbnJlc2l6ZSBldmVudCBwbHVnaW4pIC0gaWYgdGhlIHNpemUgY2hhbmdlcywgaXQgd2lsbCByZWRyYXcgdGhlIHBsb3QuXG5cblRoZXJlIGFyZSBubyBvcHRpb25zLiBJZiB5b3UgbmVlZCB0byBkaXNhYmxlIHRoZSBwbHVnaW4gZm9yIHNvbWUgcGxvdHMsIHlvdVxuY2FuIGp1c3QgZml4IHRoZSBzaXplIG9mIHRoZWlyIHBsYWNlaG9sZGVycy5cblxuKi9cblxuLyogSW5saW5lIGRlcGVuZGVuY3k6XG4gKiBqUXVlcnkgcmVzaXplIGV2ZW50IC0gdjEuMSAtIDMvMTQvMjAxMFxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9wcm9qZWN0cy9qcXVlcnktcmVzaXplLXBsdWdpbi9cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgXCJDb3dib3lcIiBCZW4gQWxtYW5cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBhbmQgR1BMIGxpY2Vuc2VzLlxuICogaHR0cDovL2JlbmFsbWFuLmNvbS9hYm91dC9saWNlbnNlL1xuICovXG4oZnVuY3Rpb24oJCxlLHQpe1wiJDpub211bmdlXCI7dmFyIGk9W10sbj0kLnJlc2l6ZT0kLmV4dGVuZCgkLnJlc2l6ZSx7fSksYSxyPWZhbHNlLHM9XCJzZXRUaW1lb3V0XCIsdT1cInJlc2l6ZVwiLG09dStcIi1zcGVjaWFsLWV2ZW50XCIsbz1cInBlbmRpbmdEZWxheVwiLGw9XCJhY3RpdmVEZWxheVwiLGY9XCJ0aHJvdHRsZVdpbmRvd1wiO25bb109MjAwO25bbF09MjA7bltmXT10cnVlOyQuZXZlbnQuc3BlY2lhbFt1XT17c2V0dXA6ZnVuY3Rpb24oKXtpZighbltmXSYmdGhpc1tzXSl7cmV0dXJuIGZhbHNlfXZhciBlPSQodGhpcyk7aS5wdXNoKHRoaXMpO2UuZGF0YShtLHt3OmUud2lkdGgoKSxoOmUuaGVpZ2h0KCl9KTtpZihpLmxlbmd0aD09PTEpe2E9dDtoKCl9fSx0ZWFyZG93bjpmdW5jdGlvbigpe2lmKCFuW2ZdJiZ0aGlzW3NdKXtyZXR1cm4gZmFsc2V9dmFyIGU9JCh0aGlzKTtmb3IodmFyIHQ9aS5sZW5ndGgtMTt0Pj0wO3QtLSl7aWYoaVt0XT09dGhpcyl7aS5zcGxpY2UodCwxKTticmVha319ZS5yZW1vdmVEYXRhKG0pO2lmKCFpLmxlbmd0aCl7aWYocil7Y2FuY2VsQW5pbWF0aW9uRnJhbWUoYSl9ZWxzZXtjbGVhclRpbWVvdXQoYSl9YT1udWxsfX0sYWRkOmZ1bmN0aW9uKGUpe2lmKCFuW2ZdJiZ0aGlzW3NdKXtyZXR1cm4gZmFsc2V9dmFyIGk7ZnVuY3Rpb24gYShlLG4sYSl7dmFyIHI9JCh0aGlzKSxzPXIuZGF0YShtKXx8e307cy53PW4hPT10P246ci53aWR0aCgpO3MuaD1hIT09dD9hOnIuaGVpZ2h0KCk7aS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9aWYoJC5pc0Z1bmN0aW9uKGUpKXtpPWU7cmV0dXJuIGF9ZWxzZXtpPWUuaGFuZGxlcjtlLmhhbmRsZXI9YX19fTtmdW5jdGlvbiBoKHQpe2lmKHI9PT10cnVlKXtyPXR8fDF9Zm9yKHZhciBzPWkubGVuZ3RoLTE7cz49MDtzLS0pe3ZhciBsPSQoaVtzXSk7aWYobFswXT09ZXx8bC5pcyhcIjp2aXNpYmxlXCIpKXt2YXIgZj1sLndpZHRoKCksYz1sLmhlaWdodCgpLGQ9bC5kYXRhKG0pO2lmKGQmJihmIT09ZC53fHxjIT09ZC5oKSl7bC50cmlnZ2VyKHUsW2Qudz1mLGQuaD1jXSk7cj10fHx0cnVlfX1lbHNle2Q9bC5kYXRhKG0pO2Qudz0wO2QuaD0wfX1pZihhIT09bnVsbCl7aWYociYmKHQ9PW51bGx8fHQtcjwxZTMpKXthPWUucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGgpfWVsc2V7YT1zZXRUaW1lb3V0KGgsbltvXSk7cj1mYWxzZX19fWlmKCFlLnJlcXVlc3RBbmltYXRpb25GcmFtZSl7ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU9ZnVuY3Rpb24oKXtyZXR1cm4gZS53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGZ1bmN0aW9uKHQsaSl7cmV0dXJuIGUuc2V0VGltZW91dChmdW5jdGlvbigpe3QoKG5ldyBEYXRlKS5nZXRUaW1lKCkpfSxuW2xdKX19KCl9aWYoIWUuY2FuY2VsQW5pbWF0aW9uRnJhbWUpe2UuY2FuY2VsQW5pbWF0aW9uRnJhbWU9ZnVuY3Rpb24oKXtyZXR1cm4gZS53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm9DYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGUubXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGNsZWFyVGltZW91dH0oKX19KShqUXVlcnksdGhpcyk7XG5cbihmdW5jdGlvbiAoJCkge1xuICAgIHZhciBvcHRpb25zID0geyB9OyAvLyBubyBvcHRpb25zXG5cbiAgICBmdW5jdGlvbiBpbml0KHBsb3QpIHtcbiAgICAgICAgZnVuY3Rpb24gb25SZXNpemUoKSB7XG4gICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBwbG90LmdldFBsYWNlaG9sZGVyKCk7XG5cbiAgICAgICAgICAgIC8vIHNvbWVib2R5IG1pZ2h0IGhhdmUgaGlkZGVuIHVzIGFuZCB3ZSBjYW4ndCBwbG90XG4gICAgICAgICAgICAvLyB3aGVuIHdlIGRvbid0IGhhdmUgdGhlIGRpbWVuc2lvbnNcbiAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlci53aWR0aCgpID09IDAgfHwgcGxhY2Vob2xkZXIuaGVpZ2h0KCkgPT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIHBsb3QucmVzaXplKCk7XG4gICAgICAgICAgICBwbG90LnNldHVwR3JpZCgpO1xuICAgICAgICAgICAgcGxvdC5kcmF3KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIGJpbmRFdmVudHMocGxvdCwgZXZlbnRIb2xkZXIpIHtcbiAgICAgICAgICAgIHBsb3QuZ2V0UGxhY2Vob2xkZXIoKS5yZXNpemUob25SZXNpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2h1dGRvd24ocGxvdCwgZXZlbnRIb2xkZXIpIHtcbiAgICAgICAgICAgIHBsb3QuZ2V0UGxhY2Vob2xkZXIoKS51bmJpbmQoXCJyZXNpemVcIiwgb25SZXNpemUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwbG90Lmhvb2tzLmJpbmRFdmVudHMucHVzaChiaW5kRXZlbnRzKTtcbiAgICAgICAgcGxvdC5ob29rcy5zaHV0ZG93bi5wdXNoKHNodXRkb3duKTtcbiAgICB9XG4gICAgXG4gICAgJC5wbG90LnBsdWdpbnMucHVzaCh7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIG5hbWU6ICdyZXNpemUnLFxuICAgICAgICB2ZXJzaW9uOiAnMS4wJ1xuICAgIH0pO1xufSkoalF1ZXJ5KTtcbiIsIi8qIFByZXR0eSBoYW5kbGluZyBvZiB0aW1lIGF4ZXMuXG5cbkNvcHlyaWdodCAoYykgMjAwNy0yMDE0IElPTEEgYW5kIE9sZSBMYXVyc2VuLlxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG5TZXQgYXhpcy5tb2RlIHRvIFwidGltZVwiIHRvIGVuYWJsZS4gU2VlIHRoZSBzZWN0aW9uIFwiVGltZSBzZXJpZXMgZGF0YVwiIGluXG5BUEkudHh0IGZvciBkZXRhaWxzLlxuXG4qL1xuXG4oZnVuY3Rpb24oJCkge1xuXG5cdHZhciBvcHRpb25zID0ge1xuXHRcdHhheGlzOiB7XG5cdFx0XHR0aW1lem9uZTogbnVsbCxcdFx0Ly8gXCJicm93c2VyXCIgZm9yIGxvY2FsIHRvIHRoZSBjbGllbnQgb3IgdGltZXpvbmUgZm9yIHRpbWV6b25lLWpzXG5cdFx0XHR0aW1lZm9ybWF0OiBudWxsLFx0Ly8gZm9ybWF0IHN0cmluZyB0byB1c2Vcblx0XHRcdHR3ZWx2ZUhvdXJDbG9jazogZmFsc2UsXHQvLyAxMiBvciAyNCB0aW1lIGluIHRpbWUgbW9kZVxuXHRcdFx0bW9udGhOYW1lczogbnVsbFx0Ly8gbGlzdCBvZiBuYW1lcyBvZiBtb250aHNcblx0XHR9XG5cdH07XG5cblx0Ly8gcm91bmQgdG8gbmVhcmJ5IGxvd2VyIG11bHRpcGxlIG9mIGJhc2VcblxuXHRmdW5jdGlvbiBmbG9vckluQmFzZShuLCBiYXNlKSB7XG5cdFx0cmV0dXJuIGJhc2UgKiBNYXRoLmZsb29yKG4gLyBiYXNlKTtcblx0fVxuXG5cdC8vIFJldHVybnMgYSBzdHJpbmcgd2l0aCB0aGUgZGF0ZSBkIGZvcm1hdHRlZCBhY2NvcmRpbmcgdG8gZm10LlxuXHQvLyBBIHN1YnNldCBvZiB0aGUgT3BlbiBHcm91cCdzIHN0cmZ0aW1lIGZvcm1hdCBpcyBzdXBwb3J0ZWQuXG5cblx0ZnVuY3Rpb24gZm9ybWF0RGF0ZShkLCBmbXQsIG1vbnRoTmFtZXMsIGRheU5hbWVzKSB7XG5cblx0XHRpZiAodHlwZW9mIGQuc3RyZnRpbWUgPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRyZXR1cm4gZC5zdHJmdGltZShmbXQpO1xuXHRcdH1cblxuXHRcdHZhciBsZWZ0UGFkID0gZnVuY3Rpb24obiwgcGFkKSB7XG5cdFx0XHRuID0gXCJcIiArIG47XG5cdFx0XHRwYWQgPSBcIlwiICsgKHBhZCA9PSBudWxsID8gXCIwXCIgOiBwYWQpO1xuXHRcdFx0cmV0dXJuIG4ubGVuZ3RoID09IDEgPyBwYWQgKyBuIDogbjtcblx0XHR9O1xuXG5cdFx0dmFyIHIgPSBbXTtcblx0XHR2YXIgZXNjYXBlID0gZmFsc2U7XG5cdFx0dmFyIGhvdXJzID0gZC5nZXRIb3VycygpO1xuXHRcdHZhciBpc0FNID0gaG91cnMgPCAxMjtcblxuXHRcdGlmIChtb250aE5hbWVzID09IG51bGwpIHtcblx0XHRcdG1vbnRoTmFtZXMgPSBbXCJKYW5cIiwgXCJGZWJcIiwgXCJNYXJcIiwgXCJBcHJcIiwgXCJNYXlcIiwgXCJKdW5cIiwgXCJKdWxcIiwgXCJBdWdcIiwgXCJTZXBcIiwgXCJPY3RcIiwgXCJOb3ZcIiwgXCJEZWNcIl07XG5cdFx0fVxuXG5cdFx0aWYgKGRheU5hbWVzID09IG51bGwpIHtcblx0XHRcdGRheU5hbWVzID0gW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdO1xuXHRcdH1cblxuXHRcdHZhciBob3VyczEyO1xuXG5cdFx0aWYgKGhvdXJzID4gMTIpIHtcblx0XHRcdGhvdXJzMTIgPSBob3VycyAtIDEyO1xuXHRcdH0gZWxzZSBpZiAoaG91cnMgPT0gMCkge1xuXHRcdFx0aG91cnMxMiA9IDEyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRob3VyczEyID0gaG91cnM7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBmbXQubGVuZ3RoOyArK2kpIHtcblxuXHRcdFx0dmFyIGMgPSBmbXQuY2hhckF0KGkpO1xuXG5cdFx0XHRpZiAoZXNjYXBlKSB7XG5cdFx0XHRcdHN3aXRjaCAoYykge1xuXHRcdFx0XHRcdGNhc2UgJ2EnOiBjID0gXCJcIiArIGRheU5hbWVzW2QuZ2V0RGF5KCldOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdiJzogYyA9IFwiXCIgKyBtb250aE5hbWVzW2QuZ2V0TW9udGgoKV07IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2QnOiBjID0gbGVmdFBhZChkLmdldERhdGUoKSk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2UnOiBjID0gbGVmdFBhZChkLmdldERhdGUoKSwgXCIgXCIpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdoJzpcdC8vIEZvciBiYWNrLWNvbXBhdCB3aXRoIDAuNzsgcmVtb3ZlIGluIDEuMFxuXHRcdFx0XHRcdGNhc2UgJ0gnOiBjID0gbGVmdFBhZChob3Vycyk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ0knOiBjID0gbGVmdFBhZChob3VyczEyKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnbCc6IGMgPSBsZWZ0UGFkKGhvdXJzMTIsIFwiIFwiKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnbSc6IGMgPSBsZWZ0UGFkKGQuZ2V0TW9udGgoKSArIDEpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdNJzogYyA9IGxlZnRQYWQoZC5nZXRNaW51dGVzKCkpOyBicmVhaztcblx0XHRcdFx0XHQvLyBxdWFydGVycyBub3QgaW4gT3BlbiBHcm91cCdzIHN0cmZ0aW1lIHNwZWNpZmljYXRpb25cblx0XHRcdFx0XHRjYXNlICdxJzpcblx0XHRcdFx0XHRcdGMgPSBcIlwiICsgKE1hdGguZmxvb3IoZC5nZXRNb250aCgpIC8gMykgKyAxKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnUyc6IGMgPSBsZWZ0UGFkKGQuZ2V0U2Vjb25kcygpKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAneSc6IGMgPSBsZWZ0UGFkKGQuZ2V0RnVsbFllYXIoKSAlIDEwMCk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ1knOiBjID0gXCJcIiArIGQuZ2V0RnVsbFllYXIoKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAncCc6IGMgPSAoaXNBTSkgPyAoXCJcIiArIFwiYW1cIikgOiAoXCJcIiArIFwicG1cIik7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ1AnOiBjID0gKGlzQU0pID8gKFwiXCIgKyBcIkFNXCIpIDogKFwiXCIgKyBcIlBNXCIpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICd3JzogYyA9IFwiXCIgKyBkLmdldERheSgpOyBicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyLnB1c2goYyk7XG5cdFx0XHRcdGVzY2FwZSA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGMgPT0gXCIlXCIpIHtcblx0XHRcdFx0XHRlc2NhcGUgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHIucHVzaChjKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByLmpvaW4oXCJcIik7XG5cdH1cblxuXHQvLyBUbyBoYXZlIGEgY29uc2lzdGVudCB2aWV3IG9mIHRpbWUtYmFzZWQgZGF0YSBpbmRlcGVuZGVudCBvZiB3aGljaCB0aW1lXG5cdC8vIHpvbmUgdGhlIGNsaWVudCBoYXBwZW5zIHRvIGJlIGluIHdlIG5lZWQgYSBkYXRlLWxpa2Ugb2JqZWN0IGluZGVwZW5kZW50XG5cdC8vIG9mIHRpbWUgem9uZXMuICBUaGlzIGlzIGRvbmUgdGhyb3VnaCBhIHdyYXBwZXIgdGhhdCBvbmx5IGNhbGxzIHRoZSBVVENcblx0Ly8gdmVyc2lvbnMgb2YgdGhlIGFjY2Vzc29yIG1ldGhvZHMuXG5cblx0ZnVuY3Rpb24gbWFrZVV0Y1dyYXBwZXIoZCkge1xuXG5cdFx0ZnVuY3Rpb24gYWRkUHJveHlNZXRob2Qoc291cmNlT2JqLCBzb3VyY2VNZXRob2QsIHRhcmdldE9iaiwgdGFyZ2V0TWV0aG9kKSB7XG5cdFx0XHRzb3VyY2VPYmpbc291cmNlTWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gdGFyZ2V0T2JqW3RhcmdldE1ldGhvZF0uYXBwbHkodGFyZ2V0T2JqLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0dmFyIHV0YyA9IHtcblx0XHRcdGRhdGU6IGRcblx0XHR9O1xuXG5cdFx0Ly8gc3VwcG9ydCBzdHJmdGltZSwgaWYgZm91bmRcblxuXHRcdGlmIChkLnN0cmZ0aW1lICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0YWRkUHJveHlNZXRob2QodXRjLCBcInN0cmZ0aW1lXCIsIGQsIFwic3RyZnRpbWVcIik7XG5cdFx0fVxuXG5cdFx0YWRkUHJveHlNZXRob2QodXRjLCBcImdldFRpbWVcIiwgZCwgXCJnZXRUaW1lXCIpO1xuXHRcdGFkZFByb3h5TWV0aG9kKHV0YywgXCJzZXRUaW1lXCIsIGQsIFwic2V0VGltZVwiKTtcblxuXHRcdHZhciBwcm9wcyA9IFtcIkRhdGVcIiwgXCJEYXlcIiwgXCJGdWxsWWVhclwiLCBcIkhvdXJzXCIsIFwiTWlsbGlzZWNvbmRzXCIsIFwiTWludXRlc1wiLCBcIk1vbnRoXCIsIFwiU2Vjb25kc1wiXTtcblxuXHRcdGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcblx0XHRcdGFkZFByb3h5TWV0aG9kKHV0YywgXCJnZXRcIiArIHByb3BzW3BdLCBkLCBcImdldFVUQ1wiICsgcHJvcHNbcF0pO1xuXHRcdFx0YWRkUHJveHlNZXRob2QodXRjLCBcInNldFwiICsgcHJvcHNbcF0sIGQsIFwic2V0VVRDXCIgKyBwcm9wc1twXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHV0Yztcblx0fTtcblxuXHQvLyBzZWxlY3QgdGltZSB6b25lIHN0cmF0ZWd5LiAgVGhpcyByZXR1cm5zIGEgZGF0ZS1saWtlIG9iamVjdCB0aWVkIHRvIHRoZVxuXHQvLyBkZXNpcmVkIHRpbWV6b25lXG5cblx0ZnVuY3Rpb24gZGF0ZUdlbmVyYXRvcih0cywgb3B0cykge1xuXHRcdGlmIChvcHRzLnRpbWV6b25lID09IFwiYnJvd3NlclwiKSB7XG5cdFx0XHRyZXR1cm4gbmV3IERhdGUodHMpO1xuXHRcdH0gZWxzZSBpZiAoIW9wdHMudGltZXpvbmUgfHwgb3B0cy50aW1lem9uZSA9PSBcInV0Y1wiKSB7XG5cdFx0XHRyZXR1cm4gbWFrZVV0Y1dyYXBwZXIobmV3IERhdGUodHMpKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiB0aW1lem9uZUpTICE9IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIHRpbWV6b25lSlMuRGF0ZSAhPSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgZCA9IG5ldyB0aW1lem9uZUpTLkRhdGUoKTtcblx0XHRcdC8vIHRpbWV6b25lLWpzIGlzIGZpY2tsZSwgc28gYmUgc3VyZSB0byBzZXQgdGhlIHRpbWUgem9uZSBiZWZvcmVcblx0XHRcdC8vIHNldHRpbmcgdGhlIHRpbWUuXG5cdFx0XHRkLnNldFRpbWV6b25lKG9wdHMudGltZXpvbmUpO1xuXHRcdFx0ZC5zZXRUaW1lKHRzKTtcblx0XHRcdHJldHVybiBkO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbWFrZVV0Y1dyYXBwZXIobmV3IERhdGUodHMpKTtcblx0XHR9XG5cdH1cblx0XG5cdC8vIG1hcCBvZiBhcHAuIHNpemUgb2YgdGltZSB1bml0cyBpbiBtaWxsaXNlY29uZHNcblxuXHR2YXIgdGltZVVuaXRTaXplID0ge1xuXHRcdFwic2Vjb25kXCI6IDEwMDAsXG5cdFx0XCJtaW51dGVcIjogNjAgKiAxMDAwLFxuXHRcdFwiaG91clwiOiA2MCAqIDYwICogMTAwMCxcblx0XHRcImRheVwiOiAyNCAqIDYwICogNjAgKiAxMDAwLFxuXHRcdFwibW9udGhcIjogMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwLFxuXHRcdFwicXVhcnRlclwiOiAzICogMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwLFxuXHRcdFwieWVhclwiOiAzNjUuMjQyNSAqIDI0ICogNjAgKiA2MCAqIDEwMDBcblx0fTtcblxuXHQvLyB0aGUgYWxsb3dlZCB0aWNrIHNpemVzLCBhZnRlciAxIHllYXIgd2UgdXNlXG5cdC8vIGFuIGludGVnZXIgYWxnb3JpdGhtXG5cblx0dmFyIGJhc2VTcGVjID0gW1xuXHRcdFsxLCBcInNlY29uZFwiXSwgWzIsIFwic2Vjb25kXCJdLCBbNSwgXCJzZWNvbmRcIl0sIFsxMCwgXCJzZWNvbmRcIl0sXG5cdFx0WzMwLCBcInNlY29uZFwiXSwgXG5cdFx0WzEsIFwibWludXRlXCJdLCBbMiwgXCJtaW51dGVcIl0sIFs1LCBcIm1pbnV0ZVwiXSwgWzEwLCBcIm1pbnV0ZVwiXSxcblx0XHRbMzAsIFwibWludXRlXCJdLCBcblx0XHRbMSwgXCJob3VyXCJdLCBbMiwgXCJob3VyXCJdLCBbNCwgXCJob3VyXCJdLFxuXHRcdFs4LCBcImhvdXJcIl0sIFsxMiwgXCJob3VyXCJdLFxuXHRcdFsxLCBcImRheVwiXSwgWzIsIFwiZGF5XCJdLCBbMywgXCJkYXlcIl0sXG5cdFx0WzAuMjUsIFwibW9udGhcIl0sIFswLjUsIFwibW9udGhcIl0sIFsxLCBcIm1vbnRoXCJdLFxuXHRcdFsyLCBcIm1vbnRoXCJdXG5cdF07XG5cblx0Ly8gd2UgZG9uJ3Qga25vdyB3aGljaCB2YXJpYW50KHMpIHdlJ2xsIG5lZWQgeWV0LCBidXQgZ2VuZXJhdGluZyBib3RoIGlzXG5cdC8vIGNoZWFwXG5cblx0dmFyIHNwZWNNb250aHMgPSBiYXNlU3BlYy5jb25jYXQoW1szLCBcIm1vbnRoXCJdLCBbNiwgXCJtb250aFwiXSxcblx0XHRbMSwgXCJ5ZWFyXCJdXSk7XG5cdHZhciBzcGVjUXVhcnRlcnMgPSBiYXNlU3BlYy5jb25jYXQoW1sxLCBcInF1YXJ0ZXJcIl0sIFsyLCBcInF1YXJ0ZXJcIl0sXG5cdFx0WzEsIFwieWVhclwiXV0pO1xuXG5cdGZ1bmN0aW9uIGluaXQocGxvdCkge1xuXHRcdHBsb3QuaG9va3MucHJvY2Vzc09wdGlvbnMucHVzaChmdW5jdGlvbiAocGxvdCwgb3B0aW9ucykge1xuXHRcdFx0JC5lYWNoKHBsb3QuZ2V0QXhlcygpLCBmdW5jdGlvbihheGlzTmFtZSwgYXhpcykge1xuXG5cdFx0XHRcdHZhciBvcHRzID0gYXhpcy5vcHRpb25zO1xuXG5cdFx0XHRcdGlmIChvcHRzLm1vZGUgPT0gXCJ0aW1lXCIpIHtcblx0XHRcdFx0XHRheGlzLnRpY2tHZW5lcmF0b3IgPSBmdW5jdGlvbihheGlzKSB7XG5cblx0XHRcdFx0XHRcdHZhciB0aWNrcyA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIGQgPSBkYXRlR2VuZXJhdG9yKGF4aXMubWluLCBvcHRzKTtcblx0XHRcdFx0XHRcdHZhciBtaW5TaXplID0gMDtcblxuXHRcdFx0XHRcdFx0Ly8gbWFrZSBxdWFydGVyIHVzZSBhIHBvc3NpYmlsaXR5IGlmIHF1YXJ0ZXJzIGFyZVxuXHRcdFx0XHRcdFx0Ly8gbWVudGlvbmVkIGluIGVpdGhlciBvZiB0aGVzZSBvcHRpb25zXG5cblx0XHRcdFx0XHRcdHZhciBzcGVjID0gKG9wdHMudGlja1NpemUgJiYgb3B0cy50aWNrU2l6ZVsxXSA9PT1cblx0XHRcdFx0XHRcdFx0XCJxdWFydGVyXCIpIHx8XG5cdFx0XHRcdFx0XHRcdChvcHRzLm1pblRpY2tTaXplICYmIG9wdHMubWluVGlja1NpemVbMV0gPT09XG5cdFx0XHRcdFx0XHRcdFwicXVhcnRlclwiKSA/IHNwZWNRdWFydGVycyA6IHNwZWNNb250aHM7XG5cblx0XHRcdFx0XHRcdGlmIChvcHRzLm1pblRpY2tTaXplICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBvcHRzLnRpY2tTaXplID09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRtaW5TaXplID0gb3B0cy50aWNrU2l6ZTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRtaW5TaXplID0gb3B0cy5taW5UaWNrU2l6ZVswXSAqIHRpbWVVbml0U2l6ZVtvcHRzLm1pblRpY2tTaXplWzFdXTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNwZWMubGVuZ3RoIC0gMTsgKytpKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChheGlzLmRlbHRhIDwgKHNwZWNbaV1bMF0gKiB0aW1lVW5pdFNpemVbc3BlY1tpXVsxXV1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICsgc3BlY1tpICsgMV1bMF0gKiB0aW1lVW5pdFNpemVbc3BlY1tpICsgMV1bMV1dKSAvIDJcblx0XHRcdFx0XHRcdFx0XHQmJiBzcGVjW2ldWzBdICogdGltZVVuaXRTaXplW3NwZWNbaV1bMV1dID49IG1pblNpemUpIHtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgc2l6ZSA9IHNwZWNbaV1bMF07XG5cdFx0XHRcdFx0XHR2YXIgdW5pdCA9IHNwZWNbaV1bMV07XG5cblx0XHRcdFx0XHRcdC8vIHNwZWNpYWwtY2FzZSB0aGUgcG9zc2liaWxpdHkgb2Ygc2V2ZXJhbCB5ZWFyc1xuXG5cdFx0XHRcdFx0XHRpZiAodW5pdCA9PSBcInllYXJcIikge1xuXG5cdFx0XHRcdFx0XHRcdC8vIGlmIGdpdmVuIGEgbWluVGlja1NpemUgaW4geWVhcnMsIGp1c3QgdXNlIGl0LFxuXHRcdFx0XHRcdFx0XHQvLyBlbnN1cmluZyB0aGF0IGl0J3MgYW4gaW50ZWdlclxuXG5cdFx0XHRcdFx0XHRcdGlmIChvcHRzLm1pblRpY2tTaXplICE9IG51bGwgJiYgb3B0cy5taW5UaWNrU2l6ZVsxXSA9PSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0XHRcdHNpemUgPSBNYXRoLmZsb29yKG9wdHMubWluVGlja1NpemVbMF0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG1hZ24gPSBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhheGlzLmRlbHRhIC8gdGltZVVuaXRTaXplLnllYXIpIC8gTWF0aC5MTjEwKSk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5vcm0gPSAoYXhpcy5kZWx0YSAvIHRpbWVVbml0U2l6ZS55ZWFyKSAvIG1hZ247XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAobm9ybSA8IDEuNSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZSA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChub3JtIDwgMykge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZSA9IDI7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChub3JtIDwgNy41KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzaXplID0gNTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZSA9IDEwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHNpemUgKj0gbWFnbjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIG1pbmltdW0gc2l6ZSBmb3IgeWVhcnMgaXMgMVxuXG5cdFx0XHRcdFx0XHRcdGlmIChzaXplIDwgMSkge1xuXHRcdFx0XHRcdFx0XHRcdHNpemUgPSAxO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGF4aXMudGlja1NpemUgPSBvcHRzLnRpY2tTaXplIHx8IFtzaXplLCB1bml0XTtcblx0XHRcdFx0XHRcdHZhciB0aWNrU2l6ZSA9IGF4aXMudGlja1NpemVbMF07XG5cdFx0XHRcdFx0XHR1bml0ID0gYXhpcy50aWNrU2l6ZVsxXTtcblxuXHRcdFx0XHRcdFx0dmFyIHN0ZXAgPSB0aWNrU2l6ZSAqIHRpbWVVbml0U2l6ZVt1bml0XTtcblxuXHRcdFx0XHRcdFx0aWYgKHVuaXQgPT0gXCJzZWNvbmRcIikge1xuXHRcdFx0XHRcdFx0XHRkLnNldFNlY29uZHMoZmxvb3JJbkJhc2UoZC5nZXRTZWNvbmRzKCksIHRpY2tTaXplKSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVuaXQgPT0gXCJtaW51dGVcIikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1pbnV0ZXMoZmxvb3JJbkJhc2UoZC5nZXRNaW51dGVzKCksIHRpY2tTaXplKSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVuaXQgPT0gXCJob3VyXCIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRIb3VycyhmbG9vckluQmFzZShkLmdldEhvdXJzKCksIHRpY2tTaXplKSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVuaXQgPT0gXCJtb250aFwiKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoZmxvb3JJbkJhc2UoZC5nZXRNb250aCgpLCB0aWNrU2l6ZSkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1bml0ID09IFwicXVhcnRlclwiKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoMyAqIGZsb29ySW5CYXNlKGQuZ2V0TW9udGgoKSAvIDMsXG5cdFx0XHRcdFx0XHRcdFx0dGlja1NpemUpKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodW5pdCA9PSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0XHRkLnNldEZ1bGxZZWFyKGZsb29ySW5CYXNlKGQuZ2V0RnVsbFllYXIoKSwgdGlja1NpemUpKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gcmVzZXQgc21hbGxlciBjb21wb25lbnRzXG5cblx0XHRcdFx0XHRcdGQuc2V0TWlsbGlzZWNvbmRzKDApO1xuXG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUubWludXRlKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0U2Vjb25kcygwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS5ob3VyKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TWludXRlcygwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS5kYXkpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRIb3VycygwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS5kYXkgKiA0KSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0RGF0ZSgxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS5tb250aCAqIDIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aChmbG9vckluQmFzZShkLmdldE1vbnRoKCksIDMpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS5xdWFydGVyICogMikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKGZsb29ySW5CYXNlKGQuZ2V0TW9udGgoKSwgNikpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLnllYXIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aCgwKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIGNhcnJ5ID0gMDtcblx0XHRcdFx0XHRcdHZhciB2ID0gTnVtYmVyLk5hTjtcblx0XHRcdFx0XHRcdHZhciBwcmV2O1xuXG5cdFx0XHRcdFx0XHRkbyB7XG5cblx0XHRcdFx0XHRcdFx0cHJldiA9IHY7XG5cdFx0XHRcdFx0XHRcdHYgPSBkLmdldFRpbWUoKTtcblx0XHRcdFx0XHRcdFx0dGlja3MucHVzaCh2KTtcblxuXHRcdFx0XHRcdFx0XHRpZiAodW5pdCA9PSBcIm1vbnRoXCIgfHwgdW5pdCA9PSBcInF1YXJ0ZXJcIikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0aWNrU2l6ZSA8IDEpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gYSBiaXQgY29tcGxpY2F0ZWQgLSB3ZSdsbCBkaXZpZGUgdGhlXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBtb250aC9xdWFydGVyIHVwIGJ1dCB3ZSBuZWVkIHRvIHRha2Vcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGNhcmUgb2YgZnJhY3Rpb25zIHNvIHdlIGRvbid0IGVuZCB1cCBpblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdGhlIG1pZGRsZSBvZiBhIGRheVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRkLnNldERhdGUoMSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgc3RhcnQgPSBkLmdldFRpbWUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoZC5nZXRNb250aCgpICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0KHVuaXQgPT0gXCJxdWFydGVyXCIgPyAzIDogMSkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGVuZCA9IGQuZ2V0VGltZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZC5zZXRUaW1lKHYgKyBjYXJyeSAqIHRpbWVVbml0U2l6ZS5ob3VyICsgKGVuZCAtIHN0YXJ0KSAqIHRpY2tTaXplKTtcblx0XHRcdFx0XHRcdFx0XHRcdGNhcnJ5ID0gZC5nZXRIb3VycygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZC5zZXRIb3VycygwKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aChkLmdldE1vbnRoKCkgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aWNrU2l6ZSAqICh1bml0ID09IFwicXVhcnRlclwiID8gMyA6IDEpKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodW5pdCA9PSBcInllYXJcIikge1xuXHRcdFx0XHRcdFx0XHRcdGQuc2V0RnVsbFllYXIoZC5nZXRGdWxsWWVhcigpICsgdGlja1NpemUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGQuc2V0VGltZSh2ICsgc3RlcCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gd2hpbGUgKHYgPCBheGlzLm1heCAmJiB2ICE9IHByZXYpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGlja3M7XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdGF4aXMudGlja0Zvcm1hdHRlciA9IGZ1bmN0aW9uICh2LCBheGlzKSB7XG5cblx0XHRcdFx0XHRcdHZhciBkID0gZGF0ZUdlbmVyYXRvcih2LCBheGlzLm9wdGlvbnMpO1xuXG5cdFx0XHRcdFx0XHQvLyBmaXJzdCBjaGVjayBnbG9iYWwgZm9ybWF0XG5cblx0XHRcdFx0XHRcdGlmIChvcHRzLnRpbWVmb3JtYXQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0RGF0ZShkLCBvcHRzLnRpbWVmb3JtYXQsIG9wdHMubW9udGhOYW1lcywgb3B0cy5kYXlOYW1lcyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHBvc3NpYmx5IHVzZSBxdWFydGVycyBpZiBxdWFydGVycyBhcmUgbWVudGlvbmVkIGluXG5cdFx0XHRcdFx0XHQvLyBhbnkgb2YgdGhlc2UgcGxhY2VzXG5cblx0XHRcdFx0XHRcdHZhciB1c2VRdWFydGVycyA9IChheGlzLm9wdGlvbnMudGlja1NpemUgJiZcblx0XHRcdFx0XHRcdFx0XHRheGlzLm9wdGlvbnMudGlja1NpemVbMV0gPT0gXCJxdWFydGVyXCIpIHx8XG5cdFx0XHRcdFx0XHRcdChheGlzLm9wdGlvbnMubWluVGlja1NpemUgJiZcblx0XHRcdFx0XHRcdFx0XHRheGlzLm9wdGlvbnMubWluVGlja1NpemVbMV0gPT0gXCJxdWFydGVyXCIpO1xuXG5cdFx0XHRcdFx0XHR2YXIgdCA9IGF4aXMudGlja1NpemVbMF0gKiB0aW1lVW5pdFNpemVbYXhpcy50aWNrU2l6ZVsxXV07XG5cdFx0XHRcdFx0XHR2YXIgc3BhbiA9IGF4aXMubWF4IC0gYXhpcy5taW47XG5cdFx0XHRcdFx0XHR2YXIgc3VmZml4ID0gKG9wdHMudHdlbHZlSG91ckNsb2NrKSA/IFwiICVwXCIgOiBcIlwiO1xuXHRcdFx0XHRcdFx0dmFyIGhvdXJDb2RlID0gKG9wdHMudHdlbHZlSG91ckNsb2NrKSA/IFwiJUlcIiA6IFwiJUhcIjtcblx0XHRcdFx0XHRcdHZhciBmbXQ7XG5cblx0XHRcdFx0XHRcdGlmICh0IDwgdGltZVVuaXRTaXplLm1pbnV0ZSkge1xuXHRcdFx0XHRcdFx0XHRmbXQgPSBob3VyQ29kZSArIFwiOiVNOiVTXCIgKyBzdWZmaXg7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHQgPCB0aW1lVW5pdFNpemUuZGF5KSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzcGFuIDwgMiAqIHRpbWVVbml0U2l6ZS5kYXkpIHtcblx0XHRcdFx0XHRcdFx0XHRmbXQgPSBob3VyQ29kZSArIFwiOiVNXCIgKyBzdWZmaXg7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm10ID0gXCIlYiAlZCBcIiArIGhvdXJDb2RlICsgXCI6JU1cIiArIHN1ZmZpeDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0IDwgdGltZVVuaXRTaXplLm1vbnRoKSB7XG5cdFx0XHRcdFx0XHRcdGZtdCA9IFwiJWIgJWRcIjtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKHVzZVF1YXJ0ZXJzICYmIHQgPCB0aW1lVW5pdFNpemUucXVhcnRlcikgfHxcblx0XHRcdFx0XHRcdFx0KCF1c2VRdWFydGVycyAmJiB0IDwgdGltZVVuaXRTaXplLnllYXIpKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzcGFuIDwgdGltZVVuaXRTaXplLnllYXIpIHtcblx0XHRcdFx0XHRcdFx0XHRmbXQgPSBcIiViXCI7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm10ID0gXCIlYiAlWVwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVzZVF1YXJ0ZXJzICYmIHQgPCB0aW1lVW5pdFNpemUueWVhcikge1xuXHRcdFx0XHRcdFx0XHRpZiAoc3BhbiA8IHRpbWVVbml0U2l6ZS55ZWFyKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm10ID0gXCJRJXFcIjtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRmbXQgPSBcIlElcSAlWVwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRmbXQgPSBcIiVZXCI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBydCA9IGZvcm1hdERhdGUoZCwgZm10LCBvcHRzLm1vbnRoTmFtZXMsIG9wdHMuZGF5TmFtZXMpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gcnQ7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHQkLnBsb3QucGx1Z2lucy5wdXNoKHtcblx0XHRpbml0OiBpbml0LFxuXHRcdG9wdGlvbnM6IG9wdGlvbnMsXG5cdFx0bmFtZTogJ3RpbWUnLFxuXHRcdHZlcnNpb246ICcxLjAnXG5cdH0pO1xuXG5cdC8vIFRpbWUtYXhpcyBzdXBwb3J0IHVzZWQgdG8gYmUgaW4gRmxvdCBjb3JlLCB3aGljaCBleHBvc2VkIHRoZVxuXHQvLyBmb3JtYXREYXRlIGZ1bmN0aW9uIG9uIHRoZSBwbG90IG9iamVjdC4gIFZhcmlvdXMgcGx1Z2lucyBkZXBlbmRcblx0Ly8gb24gdGhlIGZ1bmN0aW9uLCBzbyB3ZSBuZWVkIHRvIHJlLWV4cG9zZSBpdCBoZXJlLlxuXG5cdCQucGxvdC5mb3JtYXREYXRlID0gZm9ybWF0RGF0ZTtcblx0JC5wbG90LmRhdGVHZW5lcmF0b3IgPSBkYXRlR2VuZXJhdG9yO1xuXG59KShqUXVlcnkpO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLyohXG4gKiBEYXRlcGlja2VyIGZvciBCb290c3RyYXAgdjEuOC4wIChodHRwczovL2dpdGh1Yi5jb20vdXhzb2x1dGlvbnMvYm9vdHN0cmFwLWRhdGVwaWNrZXIpXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlIHYyLjAgKGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMClcbiAqL1xuXG4hZnVuY3Rpb24oYSl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJqcXVlcnlcIl0sYSk6YShcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9yZXF1aXJlKFwianF1ZXJ5XCIpOmpRdWVyeSl9KGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYygpe3JldHVybiBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShEYXRlLGFyZ3VtZW50cykpfWZ1bmN0aW9uIGQoKXt2YXIgYT1uZXcgRGF0ZTtyZXR1cm4gYyhhLmdldEZ1bGxZZWFyKCksYS5nZXRNb250aCgpLGEuZ2V0RGF0ZSgpKX1mdW5jdGlvbiBlKGEsYil7cmV0dXJuIGEuZ2V0VVRDRnVsbFllYXIoKT09PWIuZ2V0VVRDRnVsbFllYXIoKSYmYS5nZXRVVENNb250aCgpPT09Yi5nZXRVVENNb250aCgpJiZhLmdldFVUQ0RhdGUoKT09PWIuZ2V0VVRDRGF0ZSgpfWZ1bmN0aW9uIGYoYyxkKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZCE9PWImJmEuZm4uZGF0ZXBpY2tlci5kZXByZWNhdGVkKGQpLHRoaXNbY10uYXBwbHkodGhpcyxhcmd1bWVudHMpfX1mdW5jdGlvbiBnKGEpe3JldHVybiBhJiYhaXNOYU4oYS5nZXRUaW1lKCkpfWZ1bmN0aW9uIGgoYixjKXtmdW5jdGlvbiBkKGEsYil7cmV0dXJuIGIudG9Mb3dlckNhc2UoKX12YXIgZSxmPWEoYikuZGF0YSgpLGc9e30saD1uZXcgUmVnRXhwKFwiXlwiK2MudG9Mb3dlckNhc2UoKStcIihbQS1aXSlcIik7Yz1uZXcgUmVnRXhwKFwiXlwiK2MudG9Mb3dlckNhc2UoKSk7Zm9yKHZhciBpIGluIGYpYy50ZXN0KGkpJiYoZT1pLnJlcGxhY2UoaCxkKSxnW2VdPWZbaV0pO3JldHVybiBnfWZ1bmN0aW9uIGkoYil7dmFyIGM9e307aWYocVtiXXx8KGI9Yi5zcGxpdChcIi1cIilbMF0scVtiXSkpe3ZhciBkPXFbYl07cmV0dXJuIGEuZWFjaChwLGZ1bmN0aW9uKGEsYil7YiBpbiBkJiYoY1tiXT1kW2JdKX0pLGN9fXZhciBqPWZ1bmN0aW9uKCl7dmFyIGI9e2dldDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5zbGljZShhKVswXX0sY29udGFpbnM6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPWEmJmEudmFsdWVPZigpLGM9MCxkPXRoaXMubGVuZ3RoO2M8ZDtjKyspaWYoMDw9dGhpc1tjXS52YWx1ZU9mKCktYiYmdGhpc1tjXS52YWx1ZU9mKCktYjw4NjRlNSlyZXR1cm4gYztyZXR1cm4tMX0scmVtb3ZlOmZ1bmN0aW9uKGEpe3RoaXMuc3BsaWNlKGEsMSl9LHJlcGxhY2U6ZnVuY3Rpb24oYil7YiYmKGEuaXNBcnJheShiKXx8KGI9W2JdKSx0aGlzLmNsZWFyKCksdGhpcy5wdXNoLmFwcGx5KHRoaXMsYikpfSxjbGVhcjpmdW5jdGlvbigpe3RoaXMubGVuZ3RoPTB9LGNvcHk6ZnVuY3Rpb24oKXt2YXIgYT1uZXcgajtyZXR1cm4gYS5yZXBsYWNlKHRoaXMpLGF9fTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1bXTtyZXR1cm4gYy5wdXNoLmFwcGx5KGMsYXJndW1lbnRzKSxhLmV4dGVuZChjLGIpLGN9fSgpLGs9ZnVuY3Rpb24oYixjKXthLmRhdGEoYixcImRhdGVwaWNrZXJcIix0aGlzKSx0aGlzLl9wcm9jZXNzX29wdGlvbnMoYyksdGhpcy5kYXRlcz1uZXcgaix0aGlzLnZpZXdEYXRlPXRoaXMuby5kZWZhdWx0Vmlld0RhdGUsdGhpcy5mb2N1c0RhdGU9bnVsbCx0aGlzLmVsZW1lbnQ9YShiKSx0aGlzLmlzSW5wdXQ9dGhpcy5lbGVtZW50LmlzKFwiaW5wdXRcIiksdGhpcy5pbnB1dEZpZWxkPXRoaXMuaXNJbnB1dD90aGlzLmVsZW1lbnQ6dGhpcy5lbGVtZW50LmZpbmQoXCJpbnB1dFwiKSx0aGlzLmNvbXBvbmVudD0hIXRoaXMuZWxlbWVudC5oYXNDbGFzcyhcImRhdGVcIikmJnRoaXMuZWxlbWVudC5maW5kKFwiLmFkZC1vbiwgLmlucHV0LWdyb3VwLWFkZG9uLCAuYnRuXCIpLHRoaXMuY29tcG9uZW50JiYwPT09dGhpcy5jb21wb25lbnQubGVuZ3RoJiYodGhpcy5jb21wb25lbnQ9ITEpLHRoaXMuaXNJbmxpbmU9IXRoaXMuY29tcG9uZW50JiZ0aGlzLmVsZW1lbnQuaXMoXCJkaXZcIiksdGhpcy5waWNrZXI9YShyLnRlbXBsYXRlKSx0aGlzLl9jaGVja190ZW1wbGF0ZSh0aGlzLm8udGVtcGxhdGVzLmxlZnRBcnJvdykmJnRoaXMucGlja2VyLmZpbmQoXCIucHJldlwiKS5odG1sKHRoaXMuby50ZW1wbGF0ZXMubGVmdEFycm93KSx0aGlzLl9jaGVja190ZW1wbGF0ZSh0aGlzLm8udGVtcGxhdGVzLnJpZ2h0QXJyb3cpJiZ0aGlzLnBpY2tlci5maW5kKFwiLm5leHRcIikuaHRtbCh0aGlzLm8udGVtcGxhdGVzLnJpZ2h0QXJyb3cpLHRoaXMuX2J1aWxkRXZlbnRzKCksdGhpcy5fYXR0YWNoRXZlbnRzKCksdGhpcy5pc0lubGluZT90aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItaW5saW5lXCIpLmFwcGVuZFRvKHRoaXMuZWxlbWVudCk6dGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLWRyb3Bkb3duIGRyb3Bkb3duLW1lbnVcIiksdGhpcy5vLnJ0bCYmdGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLXJ0bFwiKSx0aGlzLm8uY2FsZW5kYXJXZWVrcyYmdGhpcy5waWNrZXIuZmluZChcIi5kYXRlcGlja2VyLWRheXMgLmRhdGVwaWNrZXItc3dpdGNoLCB0aGVhZCAuZGF0ZXBpY2tlci10aXRsZSwgdGZvb3QgLnRvZGF5LCB0Zm9vdCAuY2xlYXJcIikuYXR0cihcImNvbHNwYW5cIixmdW5jdGlvbihhLGIpe3JldHVybiBOdW1iZXIoYikrMX0pLHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7c3RhcnREYXRlOnRoaXMuX28uc3RhcnREYXRlLGVuZERhdGU6dGhpcy5fby5lbmREYXRlLGRheXNPZldlZWtEaXNhYmxlZDp0aGlzLm8uZGF5c09mV2Vla0Rpc2FibGVkLGRheXNPZldlZWtIaWdobGlnaHRlZDp0aGlzLm8uZGF5c09mV2Vla0hpZ2hsaWdodGVkLGRhdGVzRGlzYWJsZWQ6dGhpcy5vLmRhdGVzRGlzYWJsZWR9KSx0aGlzLl9hbGxvd191cGRhdGU9ITEsdGhpcy5zZXRWaWV3TW9kZSh0aGlzLm8uc3RhcnRWaWV3KSx0aGlzLl9hbGxvd191cGRhdGU9ITAsdGhpcy5maWxsRG93KCksdGhpcy5maWxsTW9udGhzKCksdGhpcy51cGRhdGUoKSx0aGlzLmlzSW5saW5lJiZ0aGlzLnNob3coKX07ay5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOmssX3Jlc29sdmVWaWV3TmFtZTpmdW5jdGlvbihiKXtyZXR1cm4gYS5lYWNoKHIudmlld01vZGVzLGZ1bmN0aW9uKGMsZCl7aWYoYj09PWN8fGEuaW5BcnJheShiLGQubmFtZXMpIT09LTEpcmV0dXJuIGI9YywhMX0pLGJ9LF9yZXNvbHZlRGF5c09mV2VlazpmdW5jdGlvbihiKXtyZXR1cm4gYS5pc0FycmF5KGIpfHwoYj1iLnNwbGl0KC9bLFxcc10qLykpLGEubWFwKGIsTnVtYmVyKX0sX2NoZWNrX3RlbXBsYXRlOmZ1bmN0aW9uKGMpe3RyeXtpZihjPT09Ynx8XCJcIj09PWMpcmV0dXJuITE7aWYoKGMubWF0Y2goL1s8Pl0vZyl8fFtdKS5sZW5ndGg8PTApcmV0dXJuITA7dmFyIGQ9YShjKTtyZXR1cm4gZC5sZW5ndGg+MH1jYXRjaChhKXtyZXR1cm4hMX19LF9wcm9jZXNzX29wdGlvbnM6ZnVuY3Rpb24oYil7dGhpcy5fbz1hLmV4dGVuZCh7fSx0aGlzLl9vLGIpO3ZhciBlPXRoaXMubz1hLmV4dGVuZCh7fSx0aGlzLl9vKSxmPWUubGFuZ3VhZ2U7cVtmXXx8KGY9Zi5zcGxpdChcIi1cIilbMF0scVtmXXx8KGY9by5sYW5ndWFnZSkpLGUubGFuZ3VhZ2U9ZixlLnN0YXJ0Vmlldz10aGlzLl9yZXNvbHZlVmlld05hbWUoZS5zdGFydFZpZXcpLGUubWluVmlld01vZGU9dGhpcy5fcmVzb2x2ZVZpZXdOYW1lKGUubWluVmlld01vZGUpLGUubWF4Vmlld01vZGU9dGhpcy5fcmVzb2x2ZVZpZXdOYW1lKGUubWF4Vmlld01vZGUpLGUuc3RhcnRWaWV3PU1hdGgubWF4KHRoaXMuby5taW5WaWV3TW9kZSxNYXRoLm1pbih0aGlzLm8ubWF4Vmlld01vZGUsZS5zdGFydFZpZXcpKSxlLm11bHRpZGF0ZSE9PSEwJiYoZS5tdWx0aWRhdGU9TnVtYmVyKGUubXVsdGlkYXRlKXx8ITEsZS5tdWx0aWRhdGUhPT0hMSYmKGUubXVsdGlkYXRlPU1hdGgubWF4KDAsZS5tdWx0aWRhdGUpKSksZS5tdWx0aWRhdGVTZXBhcmF0b3I9U3RyaW5nKGUubXVsdGlkYXRlU2VwYXJhdG9yKSxlLndlZWtTdGFydCU9NyxlLndlZWtFbmQ9KGUud2Vla1N0YXJ0KzYpJTc7dmFyIGc9ci5wYXJzZUZvcm1hdChlLmZvcm1hdCk7ZS5zdGFydERhdGUhPT0tKDEvMCkmJihlLnN0YXJ0RGF0ZT9lLnN0YXJ0RGF0ZSBpbnN0YW5jZW9mIERhdGU/ZS5zdGFydERhdGU9dGhpcy5fbG9jYWxfdG9fdXRjKHRoaXMuX3plcm9fdGltZShlLnN0YXJ0RGF0ZSkpOmUuc3RhcnREYXRlPXIucGFyc2VEYXRlKGUuc3RhcnREYXRlLGcsZS5sYW5ndWFnZSxlLmFzc3VtZU5lYXJieVllYXIpOmUuc3RhcnREYXRlPS0oMS8wKSksZS5lbmREYXRlIT09MS8wJiYoZS5lbmREYXRlP2UuZW5kRGF0ZSBpbnN0YW5jZW9mIERhdGU/ZS5lbmREYXRlPXRoaXMuX2xvY2FsX3RvX3V0Yyh0aGlzLl96ZXJvX3RpbWUoZS5lbmREYXRlKSk6ZS5lbmREYXRlPXIucGFyc2VEYXRlKGUuZW5kRGF0ZSxnLGUubGFuZ3VhZ2UsZS5hc3N1bWVOZWFyYnlZZWFyKTplLmVuZERhdGU9MS8wKSxlLmRheXNPZldlZWtEaXNhYmxlZD10aGlzLl9yZXNvbHZlRGF5c09mV2VlayhlLmRheXNPZldlZWtEaXNhYmxlZHx8W10pLGUuZGF5c09mV2Vla0hpZ2hsaWdodGVkPXRoaXMuX3Jlc29sdmVEYXlzT2ZXZWVrKGUuZGF5c09mV2Vla0hpZ2hsaWdodGVkfHxbXSksZS5kYXRlc0Rpc2FibGVkPWUuZGF0ZXNEaXNhYmxlZHx8W10sYS5pc0FycmF5KGUuZGF0ZXNEaXNhYmxlZCl8fChlLmRhdGVzRGlzYWJsZWQ9ZS5kYXRlc0Rpc2FibGVkLnNwbGl0KFwiLFwiKSksZS5kYXRlc0Rpc2FibGVkPWEubWFwKGUuZGF0ZXNEaXNhYmxlZCxmdW5jdGlvbihhKXtyZXR1cm4gci5wYXJzZURhdGUoYSxnLGUubGFuZ3VhZ2UsZS5hc3N1bWVOZWFyYnlZZWFyKX0pO3ZhciBoPVN0cmluZyhlLm9yaWVudGF0aW9uKS50b0xvd2VyQ2FzZSgpLnNwbGl0KC9cXHMrL2cpLGk9ZS5vcmllbnRhdGlvbi50b0xvd2VyQ2FzZSgpO2lmKGg9YS5ncmVwKGgsZnVuY3Rpb24oYSl7cmV0dXJuL15hdXRvfGxlZnR8cmlnaHR8dG9wfGJvdHRvbSQvLnRlc3QoYSl9KSxlLm9yaWVudGF0aW9uPXt4OlwiYXV0b1wiLHk6XCJhdXRvXCJ9LGkmJlwiYXV0b1wiIT09aSlpZigxPT09aC5sZW5ndGgpc3dpdGNoKGhbMF0pe2Nhc2VcInRvcFwiOmNhc2VcImJvdHRvbVwiOmUub3JpZW50YXRpb24ueT1oWzBdO2JyZWFrO2Nhc2VcImxlZnRcIjpjYXNlXCJyaWdodFwiOmUub3JpZW50YXRpb24ueD1oWzBdfWVsc2UgaT1hLmdyZXAoaCxmdW5jdGlvbihhKXtyZXR1cm4vXmxlZnR8cmlnaHQkLy50ZXN0KGEpfSksZS5vcmllbnRhdGlvbi54PWlbMF18fFwiYXV0b1wiLGk9YS5ncmVwKGgsZnVuY3Rpb24oYSl7cmV0dXJuL150b3B8Ym90dG9tJC8udGVzdChhKX0pLGUub3JpZW50YXRpb24ueT1pWzBdfHxcImF1dG9cIjtlbHNlO2lmKGUuZGVmYXVsdFZpZXdEYXRlIGluc3RhbmNlb2YgRGF0ZXx8XCJzdHJpbmdcIj09dHlwZW9mIGUuZGVmYXVsdFZpZXdEYXRlKWUuZGVmYXVsdFZpZXdEYXRlPXIucGFyc2VEYXRlKGUuZGVmYXVsdFZpZXdEYXRlLGcsZS5sYW5ndWFnZSxlLmFzc3VtZU5lYXJieVllYXIpO2Vsc2UgaWYoZS5kZWZhdWx0Vmlld0RhdGUpe3ZhciBqPWUuZGVmYXVsdFZpZXdEYXRlLnllYXJ8fChuZXcgRGF0ZSkuZ2V0RnVsbFllYXIoKSxrPWUuZGVmYXVsdFZpZXdEYXRlLm1vbnRofHwwLGw9ZS5kZWZhdWx0Vmlld0RhdGUuZGF5fHwxO2UuZGVmYXVsdFZpZXdEYXRlPWMoaixrLGwpfWVsc2UgZS5kZWZhdWx0Vmlld0RhdGU9ZCgpfSxfZXZlbnRzOltdLF9zZWNvbmRhcnlFdmVudHM6W10sX2FwcGx5RXZlbnRzOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxkLGUsZj0wO2Y8YS5sZW5ndGg7ZisrKWM9YVtmXVswXSwyPT09YVtmXS5sZW5ndGg/KGQ9YixlPWFbZl1bMV0pOjM9PT1hW2ZdLmxlbmd0aCYmKGQ9YVtmXVsxXSxlPWFbZl1bMl0pLGMub24oZSxkKX0sX3VuYXBwbHlFdmVudHM6ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGQsZSxmPTA7ZjxhLmxlbmd0aDtmKyspYz1hW2ZdWzBdLDI9PT1hW2ZdLmxlbmd0aD8oZT1iLGQ9YVtmXVsxXSk6Mz09PWFbZl0ubGVuZ3RoJiYoZT1hW2ZdWzFdLGQ9YVtmXVsyXSksYy5vZmYoZCxlKX0sX2J1aWxkRXZlbnRzOmZ1bmN0aW9uKCl7dmFyIGI9e2tleXVwOmEucHJveHkoZnVuY3Rpb24oYil7YS5pbkFycmF5KGIua2V5Q29kZSxbMjcsMzcsMzksMzgsNDAsMzIsMTMsOV0pPT09LTEmJnRoaXMudXBkYXRlKCl9LHRoaXMpLGtleWRvd246YS5wcm94eSh0aGlzLmtleWRvd24sdGhpcykscGFzdGU6YS5wcm94eSh0aGlzLnBhc3RlLHRoaXMpfTt0aGlzLm8uc2hvd09uRm9jdXM9PT0hMCYmKGIuZm9jdXM9YS5wcm94eSh0aGlzLnNob3csdGhpcykpLHRoaXMuaXNJbnB1dD90aGlzLl9ldmVudHM9W1t0aGlzLmVsZW1lbnQsYl1dOnRoaXMuY29tcG9uZW50JiZ0aGlzLmlucHV0RmllbGQubGVuZ3RoP3RoaXMuX2V2ZW50cz1bW3RoaXMuaW5wdXRGaWVsZCxiXSxbdGhpcy5jb21wb25lbnQse2NsaWNrOmEucHJveHkodGhpcy5zaG93LHRoaXMpfV1dOnRoaXMuX2V2ZW50cz1bW3RoaXMuZWxlbWVudCx7Y2xpY2s6YS5wcm94eSh0aGlzLnNob3csdGhpcyksa2V5ZG93bjphLnByb3h5KHRoaXMua2V5ZG93bix0aGlzKX1dXSx0aGlzLl9ldmVudHMucHVzaChbdGhpcy5lbGVtZW50LFwiKlwiLHtibHVyOmEucHJveHkoZnVuY3Rpb24oYSl7dGhpcy5fZm9jdXNlZF9mcm9tPWEudGFyZ2V0fSx0aGlzKX1dLFt0aGlzLmVsZW1lbnQse2JsdXI6YS5wcm94eShmdW5jdGlvbihhKXt0aGlzLl9mb2N1c2VkX2Zyb209YS50YXJnZXR9LHRoaXMpfV0pLHRoaXMuby5pbW1lZGlhdGVVcGRhdGVzJiZ0aGlzLl9ldmVudHMucHVzaChbdGhpcy5lbGVtZW50LHtcImNoYW5nZVllYXIgY2hhbmdlTW9udGhcIjphLnByb3h5KGZ1bmN0aW9uKGEpe3RoaXMudXBkYXRlKGEuZGF0ZSl9LHRoaXMpfV0pLHRoaXMuX3NlY29uZGFyeUV2ZW50cz1bW3RoaXMucGlja2VyLHtjbGljazphLnByb3h5KHRoaXMuY2xpY2ssdGhpcyl9XSxbdGhpcy5waWNrZXIsXCIucHJldiwgLm5leHRcIix7Y2xpY2s6YS5wcm94eSh0aGlzLm5hdkFycm93c0NsaWNrLHRoaXMpfV0sW3RoaXMucGlja2VyLFwiLmRheTpub3QoLmRpc2FibGVkKVwiLHtjbGljazphLnByb3h5KHRoaXMuZGF5Q2VsbENsaWNrLHRoaXMpfV0sW2Eod2luZG93KSx7cmVzaXplOmEucHJveHkodGhpcy5wbGFjZSx0aGlzKX1dLFthKGRvY3VtZW50KSx7XCJtb3VzZWRvd24gdG91Y2hzdGFydFwiOmEucHJveHkoZnVuY3Rpb24oYSl7dGhpcy5lbGVtZW50LmlzKGEudGFyZ2V0KXx8dGhpcy5lbGVtZW50LmZpbmQoYS50YXJnZXQpLmxlbmd0aHx8dGhpcy5waWNrZXIuaXMoYS50YXJnZXQpfHx0aGlzLnBpY2tlci5maW5kKGEudGFyZ2V0KS5sZW5ndGh8fHRoaXMuaXNJbmxpbmV8fHRoaXMuaGlkZSgpfSx0aGlzKX1dXX0sX2F0dGFjaEV2ZW50czpmdW5jdGlvbigpe3RoaXMuX2RldGFjaEV2ZW50cygpLHRoaXMuX2FwcGx5RXZlbnRzKHRoaXMuX2V2ZW50cyl9LF9kZXRhY2hFdmVudHM6ZnVuY3Rpb24oKXt0aGlzLl91bmFwcGx5RXZlbnRzKHRoaXMuX2V2ZW50cyl9LF9hdHRhY2hTZWNvbmRhcnlFdmVudHM6ZnVuY3Rpb24oKXt0aGlzLl9kZXRhY2hTZWNvbmRhcnlFdmVudHMoKSx0aGlzLl9hcHBseUV2ZW50cyh0aGlzLl9zZWNvbmRhcnlFdmVudHMpfSxfZGV0YWNoU2Vjb25kYXJ5RXZlbnRzOmZ1bmN0aW9uKCl7dGhpcy5fdW5hcHBseUV2ZW50cyh0aGlzLl9zZWNvbmRhcnlFdmVudHMpfSxfdHJpZ2dlcjpmdW5jdGlvbihiLGMpe3ZhciBkPWN8fHRoaXMuZGF0ZXMuZ2V0KC0xKSxlPXRoaXMuX3V0Y190b19sb2NhbChkKTt0aGlzLmVsZW1lbnQudHJpZ2dlcih7dHlwZTpiLGRhdGU6ZSx2aWV3TW9kZTp0aGlzLnZpZXdNb2RlLGRhdGVzOmEubWFwKHRoaXMuZGF0ZXMsdGhpcy5fdXRjX3RvX2xvY2FsKSxmb3JtYXQ6YS5wcm94eShmdW5jdGlvbihhLGIpezA9PT1hcmd1bWVudHMubGVuZ3RoPyhhPXRoaXMuZGF0ZXMubGVuZ3RoLTEsYj10aGlzLm8uZm9ybWF0KTpcInN0cmluZ1wiPT10eXBlb2YgYSYmKGI9YSxhPXRoaXMuZGF0ZXMubGVuZ3RoLTEpLGI9Ynx8dGhpcy5vLmZvcm1hdDt2YXIgYz10aGlzLmRhdGVzLmdldChhKTtyZXR1cm4gci5mb3JtYXREYXRlKGMsYix0aGlzLm8ubGFuZ3VhZ2UpfSx0aGlzKX0pfSxzaG93OmZ1bmN0aW9uKCl7aWYoISh0aGlzLmlucHV0RmllbGQucHJvcChcImRpc2FibGVkXCIpfHx0aGlzLmlucHV0RmllbGQucHJvcChcInJlYWRvbmx5XCIpJiZ0aGlzLm8uZW5hYmxlT25SZWFkb25seT09PSExKSlyZXR1cm4gdGhpcy5pc0lubGluZXx8dGhpcy5waWNrZXIuYXBwZW5kVG8odGhpcy5vLmNvbnRhaW5lciksdGhpcy5wbGFjZSgpLHRoaXMucGlja2VyLnNob3coKSx0aGlzLl9hdHRhY2hTZWNvbmRhcnlFdmVudHMoKSx0aGlzLl90cmlnZ2VyKFwic2hvd1wiKSwod2luZG93Lm5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzfHxcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQpJiZ0aGlzLm8uZGlzYWJsZVRvdWNoS2V5Ym9hcmQmJmEodGhpcy5lbGVtZW50KS5ibHVyKCksdGhpc30saGlkZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmlzSW5saW5lfHwhdGhpcy5waWNrZXIuaXMoXCI6dmlzaWJsZVwiKT90aGlzOih0aGlzLmZvY3VzRGF0ZT1udWxsLHRoaXMucGlja2VyLmhpZGUoKS5kZXRhY2goKSx0aGlzLl9kZXRhY2hTZWNvbmRhcnlFdmVudHMoKSx0aGlzLnNldFZpZXdNb2RlKHRoaXMuby5zdGFydFZpZXcpLHRoaXMuby5mb3JjZVBhcnNlJiZ0aGlzLmlucHV0RmllbGQudmFsKCkmJnRoaXMuc2V0VmFsdWUoKSx0aGlzLl90cmlnZ2VyKFwiaGlkZVwiKSx0aGlzKX0sZGVzdHJveTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmhpZGUoKSx0aGlzLl9kZXRhY2hFdmVudHMoKSx0aGlzLl9kZXRhY2hTZWNvbmRhcnlFdmVudHMoKSx0aGlzLnBpY2tlci5yZW1vdmUoKSxkZWxldGUgdGhpcy5lbGVtZW50LmRhdGEoKS5kYXRlcGlja2VyLHRoaXMuaXNJbnB1dHx8ZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZSx0aGlzfSxwYXN0ZTpmdW5jdGlvbihiKXt2YXIgYztpZihiLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YSYmYi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEudHlwZXMmJmEuaW5BcnJheShcInRleHQvcGxhaW5cIixiLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS50eXBlcykhPT0tMSljPWIub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO2Vsc2V7aWYoIXdpbmRvdy5jbGlwYm9hcmREYXRhKXJldHVybjtjPXdpbmRvdy5jbGlwYm9hcmREYXRhLmdldERhdGEoXCJUZXh0XCIpfXRoaXMuc2V0RGF0ZShjKSx0aGlzLnVwZGF0ZSgpLGIucHJldmVudERlZmF1bHQoKX0sX3V0Y190b19sb2NhbDpmdW5jdGlvbihhKXtpZighYSlyZXR1cm4gYTt2YXIgYj1uZXcgRGF0ZShhLmdldFRpbWUoKSs2ZTQqYS5nZXRUaW1lem9uZU9mZnNldCgpKTtyZXR1cm4gYi5nZXRUaW1lem9uZU9mZnNldCgpIT09YS5nZXRUaW1lem9uZU9mZnNldCgpJiYoYj1uZXcgRGF0ZShhLmdldFRpbWUoKSs2ZTQqYi5nZXRUaW1lem9uZU9mZnNldCgpKSksYn0sX2xvY2FsX3RvX3V0YzpmdW5jdGlvbihhKXtyZXR1cm4gYSYmbmV3IERhdGUoYS5nZXRUaW1lKCktNmU0KmEuZ2V0VGltZXpvbmVPZmZzZXQoKSl9LF96ZXJvX3RpbWU6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJm5ldyBEYXRlKGEuZ2V0RnVsbFllYXIoKSxhLmdldE1vbnRoKCksYS5nZXREYXRlKCkpfSxfemVyb191dGNfdGltZTpmdW5jdGlvbihhKXtyZXR1cm4gYSYmYyhhLmdldFVUQ0Z1bGxZZWFyKCksYS5nZXRVVENNb250aCgpLGEuZ2V0VVRDRGF0ZSgpKX0sZ2V0RGF0ZXM6ZnVuY3Rpb24oKXtyZXR1cm4gYS5tYXAodGhpcy5kYXRlcyx0aGlzLl91dGNfdG9fbG9jYWwpfSxnZXRVVENEYXRlczpmdW5jdGlvbigpe3JldHVybiBhLm1hcCh0aGlzLmRhdGVzLGZ1bmN0aW9uKGEpe3JldHVybiBuZXcgRGF0ZShhKX0pfSxnZXREYXRlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3V0Y190b19sb2NhbCh0aGlzLmdldFVUQ0RhdGUoKSl9LGdldFVUQ0RhdGU6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmRhdGVzLmdldCgtMSk7cmV0dXJuIGEhPT1iP25ldyBEYXRlKGEpOm51bGx9LGNsZWFyRGF0ZXM6ZnVuY3Rpb24oKXt0aGlzLmlucHV0RmllbGQudmFsKFwiXCIpLHRoaXMudXBkYXRlKCksdGhpcy5fdHJpZ2dlcihcImNoYW5nZURhdGVcIiksdGhpcy5vLmF1dG9jbG9zZSYmdGhpcy5oaWRlKCl9LHNldERhdGVzOmZ1bmN0aW9uKCl7dmFyIGI9YS5pc0FycmF5KGFyZ3VtZW50c1swXSk/YXJndW1lbnRzWzBdOmFyZ3VtZW50cztyZXR1cm4gdGhpcy51cGRhdGUuYXBwbHkodGhpcyxiKSx0aGlzLl90cmlnZ2VyKFwiY2hhbmdlRGF0ZVwiKSx0aGlzLnNldFZhbHVlKCksdGhpc30sc2V0VVRDRGF0ZXM6ZnVuY3Rpb24oKXt2YXIgYj1hLmlzQXJyYXkoYXJndW1lbnRzWzBdKT9hcmd1bWVudHNbMF06YXJndW1lbnRzO3JldHVybiB0aGlzLnNldERhdGVzLmFwcGx5KHRoaXMsYS5tYXAoYix0aGlzLl91dGNfdG9fbG9jYWwpKSx0aGlzfSxzZXREYXRlOmYoXCJzZXREYXRlc1wiKSxzZXRVVENEYXRlOmYoXCJzZXRVVENEYXRlc1wiKSxyZW1vdmU6ZihcImRlc3Ryb3lcIixcIk1ldGhvZCBgcmVtb3ZlYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiAyLjAuIFVzZSBgZGVzdHJveWAgaW5zdGVhZFwiKSxzZXRWYWx1ZTpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSgpO3JldHVybiB0aGlzLmlucHV0RmllbGQudmFsKGEpLHRoaXN9LGdldEZvcm1hdHRlZERhdGU6ZnVuY3Rpb24oYyl7Yz09PWImJihjPXRoaXMuby5mb3JtYXQpO3ZhciBkPXRoaXMuby5sYW5ndWFnZTtyZXR1cm4gYS5tYXAodGhpcy5kYXRlcyxmdW5jdGlvbihhKXtyZXR1cm4gci5mb3JtYXREYXRlKGEsYyxkKX0pLmpvaW4odGhpcy5vLm11bHRpZGF0ZVNlcGFyYXRvcil9LGdldFN0YXJ0RGF0ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm8uc3RhcnREYXRlfSxzZXRTdGFydERhdGU6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7c3RhcnREYXRlOmF9KSx0aGlzLnVwZGF0ZSgpLHRoaXMudXBkYXRlTmF2QXJyb3dzKCksdGhpc30sZ2V0RW5kRGF0ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm8uZW5kRGF0ZX0sc2V0RW5kRGF0ZTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fcHJvY2Vzc19vcHRpb25zKHtlbmREYXRlOmF9KSx0aGlzLnVwZGF0ZSgpLHRoaXMudXBkYXRlTmF2QXJyb3dzKCksdGhpc30sc2V0RGF5c09mV2Vla0Rpc2FibGVkOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9wcm9jZXNzX29wdGlvbnMoe2RheXNPZldlZWtEaXNhYmxlZDphfSksdGhpcy51cGRhdGUoKSx0aGlzfSxzZXREYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7ZGF5c09mV2Vla0hpZ2hsaWdodGVkOmF9KSx0aGlzLnVwZGF0ZSgpLHRoaXN9LHNldERhdGVzRGlzYWJsZWQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7ZGF0ZXNEaXNhYmxlZDphfSksdGhpcy51cGRhdGUoKSx0aGlzfSxwbGFjZTpmdW5jdGlvbigpe2lmKHRoaXMuaXNJbmxpbmUpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy5waWNrZXIub3V0ZXJXaWR0aCgpLGM9dGhpcy5waWNrZXIub3V0ZXJIZWlnaHQoKSxkPTEwLGU9YSh0aGlzLm8uY29udGFpbmVyKSxmPWUud2lkdGgoKSxnPVwiYm9keVwiPT09dGhpcy5vLmNvbnRhaW5lcj9hKGRvY3VtZW50KS5zY3JvbGxUb3AoKTplLnNjcm9sbFRvcCgpLGg9ZS5vZmZzZXQoKSxpPVswXTt0aGlzLmVsZW1lbnQucGFyZW50cygpLmVhY2goZnVuY3Rpb24oKXt2YXIgYj1hKHRoaXMpLmNzcyhcInotaW5kZXhcIik7XCJhdXRvXCIhPT1iJiYwIT09TnVtYmVyKGIpJiZpLnB1c2goTnVtYmVyKGIpKX0pO3ZhciBqPU1hdGgubWF4LmFwcGx5KE1hdGgsaSkrdGhpcy5vLnpJbmRleE9mZnNldCxrPXRoaXMuY29tcG9uZW50P3RoaXMuY29tcG9uZW50LnBhcmVudCgpLm9mZnNldCgpOnRoaXMuZWxlbWVudC5vZmZzZXQoKSxsPXRoaXMuY29tcG9uZW50P3RoaXMuY29tcG9uZW50Lm91dGVySGVpZ2h0KCEwKTp0aGlzLmVsZW1lbnQub3V0ZXJIZWlnaHQoITEpLG09dGhpcy5jb21wb25lbnQ/dGhpcy5jb21wb25lbnQub3V0ZXJXaWR0aCghMCk6dGhpcy5lbGVtZW50Lm91dGVyV2lkdGgoITEpLG49ay5sZWZ0LWgubGVmdCxvPWsudG9wLWgudG9wO1wiYm9keVwiIT09dGhpcy5vLmNvbnRhaW5lciYmKG8rPWcpLHRoaXMucGlja2VyLnJlbW92ZUNsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtdG9wIGRhdGVwaWNrZXItb3JpZW50LWJvdHRvbSBkYXRlcGlja2VyLW9yaWVudC1yaWdodCBkYXRlcGlja2VyLW9yaWVudC1sZWZ0XCIpLFwiYXV0b1wiIT09dGhpcy5vLm9yaWVudGF0aW9uLng/KHRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtXCIrdGhpcy5vLm9yaWVudGF0aW9uLngpLFwicmlnaHRcIj09PXRoaXMuby5vcmllbnRhdGlvbi54JiYobi09Yi1tKSk6ay5sZWZ0PDA/KHRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtbGVmdFwiKSxuLT1rLmxlZnQtZCk6bitiPmY/KHRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtcmlnaHRcIiksbis9bS1iKTp0aGlzLm8ucnRsP3RoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtcmlnaHRcIik6dGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC1sZWZ0XCIpO3ZhciBwLHE9dGhpcy5vLm9yaWVudGF0aW9uLnk7aWYoXCJhdXRvXCI9PT1xJiYocD0tZytvLWMscT1wPDA/XCJib3R0b21cIjpcInRvcFwiKSx0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LVwiK3EpLFwidG9wXCI9PT1xP28tPWMrcGFyc2VJbnQodGhpcy5waWNrZXIuY3NzKFwicGFkZGluZy10b3BcIikpOm8rPWwsdGhpcy5vLnJ0bCl7dmFyIHI9Zi0obittKTt0aGlzLnBpY2tlci5jc3Moe3RvcDpvLHJpZ2h0OnIsekluZGV4Omp9KX1lbHNlIHRoaXMucGlja2VyLmNzcyh7dG9wOm8sbGVmdDpuLHpJbmRleDpqfSk7cmV0dXJuIHRoaXN9LF9hbGxvd191cGRhdGU6ITAsdXBkYXRlOmZ1bmN0aW9uKCl7aWYoIXRoaXMuX2FsbG93X3VwZGF0ZSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmRhdGVzLmNvcHkoKSxjPVtdLGQ9ITE7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KGEuZWFjaChhcmd1bWVudHMsYS5wcm94eShmdW5jdGlvbihhLGIpe2IgaW5zdGFuY2VvZiBEYXRlJiYoYj10aGlzLl9sb2NhbF90b191dGMoYikpLGMucHVzaChiKX0sdGhpcykpLGQ9ITApOihjPXRoaXMuaXNJbnB1dD90aGlzLmVsZW1lbnQudmFsKCk6dGhpcy5lbGVtZW50LmRhdGEoXCJkYXRlXCIpfHx0aGlzLmlucHV0RmllbGQudmFsKCksYz1jJiZ0aGlzLm8ubXVsdGlkYXRlP2Muc3BsaXQodGhpcy5vLm11bHRpZGF0ZVNlcGFyYXRvcik6W2NdLGRlbGV0ZSB0aGlzLmVsZW1lbnQuZGF0YSgpLmRhdGUpLGM9YS5tYXAoYyxhLnByb3h5KGZ1bmN0aW9uKGEpe3JldHVybiByLnBhcnNlRGF0ZShhLHRoaXMuby5mb3JtYXQsdGhpcy5vLmxhbmd1YWdlLHRoaXMuby5hc3N1bWVOZWFyYnlZZWFyKX0sdGhpcykpLGM9YS5ncmVwKGMsYS5wcm94eShmdW5jdGlvbihhKXtyZXR1cm4hdGhpcy5kYXRlV2l0aGluUmFuZ2UoYSl8fCFhfSx0aGlzKSwhMCksdGhpcy5kYXRlcy5yZXBsYWNlKGMpLHRoaXMuby51cGRhdGVWaWV3RGF0ZSYmKHRoaXMuZGF0ZXMubGVuZ3RoP3RoaXMudmlld0RhdGU9bmV3IERhdGUodGhpcy5kYXRlcy5nZXQoLTEpKTp0aGlzLnZpZXdEYXRlPHRoaXMuby5zdGFydERhdGU/dGhpcy52aWV3RGF0ZT1uZXcgRGF0ZSh0aGlzLm8uc3RhcnREYXRlKTp0aGlzLnZpZXdEYXRlPnRoaXMuby5lbmREYXRlP3RoaXMudmlld0RhdGU9bmV3IERhdGUodGhpcy5vLmVuZERhdGUpOnRoaXMudmlld0RhdGU9dGhpcy5vLmRlZmF1bHRWaWV3RGF0ZSksZD8odGhpcy5zZXRWYWx1ZSgpLHRoaXMuZWxlbWVudC5jaGFuZ2UoKSk6dGhpcy5kYXRlcy5sZW5ndGgmJlN0cmluZyhiKSE9PVN0cmluZyh0aGlzLmRhdGVzKSYmZCYmKHRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VEYXRlXCIpLHRoaXMuZWxlbWVudC5jaGFuZ2UoKSksIXRoaXMuZGF0ZXMubGVuZ3RoJiZiLmxlbmd0aCYmKHRoaXMuX3RyaWdnZXIoXCJjbGVhckRhdGVcIiksdGhpcy5lbGVtZW50LmNoYW5nZSgpKSx0aGlzLmZpbGwoKSx0aGlzfSxmaWxsRG93OmZ1bmN0aW9uKCl7aWYodGhpcy5vLnNob3dXZWVrRGF5cyl7dmFyIGI9dGhpcy5vLndlZWtTdGFydCxjPVwiPHRyPlwiO2Zvcih0aGlzLm8uY2FsZW5kYXJXZWVrcyYmKGMrPSc8dGggY2xhc3M9XCJjd1wiPiYjMTYwOzwvdGg+Jyk7Yjx0aGlzLm8ud2Vla1N0YXJ0Kzc7KWMrPSc8dGggY2xhc3M9XCJkb3cnLGEuaW5BcnJheShiLHRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQpIT09LTEmJihjKz1cIiBkaXNhYmxlZFwiKSxjKz0nXCI+JytxW3RoaXMuby5sYW5ndWFnZV0uZGF5c01pbltiKyslN10rXCI8L3RoPlwiO2MrPVwiPC90cj5cIix0aGlzLnBpY2tlci5maW5kKFwiLmRhdGVwaWNrZXItZGF5cyB0aGVhZFwiKS5hcHBlbmQoYyl9fSxmaWxsTW9udGhzOmZ1bmN0aW9uKCl7Zm9yKHZhciBhLGI9dGhpcy5fdXRjX3RvX2xvY2FsKHRoaXMudmlld0RhdGUpLGM9XCJcIixkPTA7ZDwxMjtkKyspYT1iJiZiLmdldE1vbnRoKCk9PT1kP1wiIGZvY3VzZWRcIjpcIlwiLGMrPSc8c3BhbiBjbGFzcz1cIm1vbnRoJythKydcIj4nK3FbdGhpcy5vLmxhbmd1YWdlXS5tb250aHNTaG9ydFtkXStcIjwvc3Bhbj5cIjt0aGlzLnBpY2tlci5maW5kKFwiLmRhdGVwaWNrZXItbW9udGhzIHRkXCIpLmh0bWwoYyl9LHNldFJhbmdlOmZ1bmN0aW9uKGIpe2ImJmIubGVuZ3RoP3RoaXMucmFuZ2U9YS5tYXAoYixmdW5jdGlvbihhKXtyZXR1cm4gYS52YWx1ZU9mKCl9KTpkZWxldGUgdGhpcy5yYW5nZSx0aGlzLmZpbGwoKX0sZ2V0Q2xhc3NOYW1lczpmdW5jdGlvbihiKXt2YXIgYz1bXSxmPXRoaXMudmlld0RhdGUuZ2V0VVRDRnVsbFllYXIoKSxnPXRoaXMudmlld0RhdGUuZ2V0VVRDTW9udGgoKSxoPWQoKTtyZXR1cm4gYi5nZXRVVENGdWxsWWVhcigpPGZ8fGIuZ2V0VVRDRnVsbFllYXIoKT09PWYmJmIuZ2V0VVRDTW9udGgoKTxnP2MucHVzaChcIm9sZFwiKTooYi5nZXRVVENGdWxsWWVhcigpPmZ8fGIuZ2V0VVRDRnVsbFllYXIoKT09PWYmJmIuZ2V0VVRDTW9udGgoKT5nKSYmYy5wdXNoKFwibmV3XCIpLHRoaXMuZm9jdXNEYXRlJiZiLnZhbHVlT2YoKT09PXRoaXMuZm9jdXNEYXRlLnZhbHVlT2YoKSYmYy5wdXNoKFwiZm9jdXNlZFwiKSx0aGlzLm8udG9kYXlIaWdobGlnaHQmJmUoYixoKSYmYy5wdXNoKFwidG9kYXlcIiksdGhpcy5kYXRlcy5jb250YWlucyhiKSE9PS0xJiZjLnB1c2goXCJhY3RpdmVcIiksdGhpcy5kYXRlV2l0aGluUmFuZ2UoYil8fGMucHVzaChcImRpc2FibGVkXCIpLHRoaXMuZGF0ZUlzRGlzYWJsZWQoYikmJmMucHVzaChcImRpc2FibGVkXCIsXCJkaXNhYmxlZC1kYXRlXCIpLGEuaW5BcnJheShiLmdldFVUQ0RheSgpLHRoaXMuby5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQpIT09LTEmJmMucHVzaChcImhpZ2hsaWdodGVkXCIpLHRoaXMucmFuZ2UmJihiPnRoaXMucmFuZ2VbMF0mJmI8dGhpcy5yYW5nZVt0aGlzLnJhbmdlLmxlbmd0aC0xXSYmYy5wdXNoKFwicmFuZ2VcIiksYS5pbkFycmF5KGIudmFsdWVPZigpLHRoaXMucmFuZ2UpIT09LTEmJmMucHVzaChcInNlbGVjdGVkXCIpLGIudmFsdWVPZigpPT09dGhpcy5yYW5nZVswXSYmYy5wdXNoKFwicmFuZ2Utc3RhcnRcIiksYi52YWx1ZU9mKCk9PT10aGlzLnJhbmdlW3RoaXMucmFuZ2UubGVuZ3RoLTFdJiZjLnB1c2goXCJyYW5nZS1lbmRcIikpLGN9LF9maWxsX3llYXJzVmlldzpmdW5jdGlvbihjLGQsZSxmLGcsaCxpKXtmb3IodmFyIGosayxsLG09XCJcIixuPWUvMTAsbz10aGlzLnBpY2tlci5maW5kKGMpLHA9TWF0aC5mbG9vcihmL2UpKmUscT1wKzkqbixyPU1hdGguZmxvb3IodGhpcy52aWV3RGF0ZS5nZXRGdWxsWWVhcigpL24pKm4scz1hLm1hcCh0aGlzLmRhdGVzLGZ1bmN0aW9uKGEpe3JldHVybiBNYXRoLmZsb29yKGEuZ2V0VVRDRnVsbFllYXIoKS9uKSpufSksdD1wLW47dDw9cStuO3QrPW4paj1bZF0saz1udWxsLHQ9PT1wLW4/ai5wdXNoKFwib2xkXCIpOnQ9PT1xK24mJmoucHVzaChcIm5ld1wiKSxhLmluQXJyYXkodCxzKSE9PS0xJiZqLnB1c2goXCJhY3RpdmVcIiksKHQ8Z3x8dD5oKSYmai5wdXNoKFwiZGlzYWJsZWRcIiksdD09PXImJmoucHVzaChcImZvY3VzZWRcIiksaSE9PWEubm9vcCYmKGw9aShuZXcgRGF0ZSh0LDAsMSkpLGw9PT1iP2w9e306XCJib29sZWFuXCI9PXR5cGVvZiBsP2w9e2VuYWJsZWQ6bH06XCJzdHJpbmdcIj09dHlwZW9mIGwmJihsPXtjbGFzc2VzOmx9KSxsLmVuYWJsZWQ9PT0hMSYmai5wdXNoKFwiZGlzYWJsZWRcIiksbC5jbGFzc2VzJiYoaj1qLmNvbmNhdChsLmNsYXNzZXMuc3BsaXQoL1xccysvKSkpLGwudG9vbHRpcCYmKGs9bC50b29sdGlwKSksbSs9JzxzcGFuIGNsYXNzPVwiJytqLmpvaW4oXCIgXCIpKydcIicrKGs/JyB0aXRsZT1cIicraysnXCInOlwiXCIpK1wiPlwiK3QrXCI8L3NwYW4+XCI7by5maW5kKFwiLmRhdGVwaWNrZXItc3dpdGNoXCIpLnRleHQocCtcIi1cIitxKSxvLmZpbmQoXCJ0ZFwiKS5odG1sKG0pfSxmaWxsOmZ1bmN0aW9uKCl7dmFyIGQsZSxmPW5ldyBEYXRlKHRoaXMudmlld0RhdGUpLGc9Zi5nZXRVVENGdWxsWWVhcigpLGg9Zi5nZXRVVENNb250aCgpLGk9dGhpcy5vLnN0YXJ0RGF0ZSE9PS0oMS8wKT90aGlzLm8uc3RhcnREYXRlLmdldFVUQ0Z1bGxZZWFyKCk6LSgxLzApLGo9dGhpcy5vLnN0YXJ0RGF0ZSE9PS0oMS8wKT90aGlzLm8uc3RhcnREYXRlLmdldFVUQ01vbnRoKCk6LSgxLzApLGs9dGhpcy5vLmVuZERhdGUhPT0xLzA/dGhpcy5vLmVuZERhdGUuZ2V0VVRDRnVsbFllYXIoKToxLzAsbD10aGlzLm8uZW5kRGF0ZSE9PTEvMD90aGlzLm8uZW5kRGF0ZS5nZXRVVENNb250aCgpOjEvMCxtPXFbdGhpcy5vLmxhbmd1YWdlXS50b2RheXx8cS5lbi50b2RheXx8XCJcIixuPXFbdGhpcy5vLmxhbmd1YWdlXS5jbGVhcnx8cS5lbi5jbGVhcnx8XCJcIixvPXFbdGhpcy5vLmxhbmd1YWdlXS50aXRsZUZvcm1hdHx8cS5lbi50aXRsZUZvcm1hdDtpZighaXNOYU4oZykmJiFpc05hTihoKSl7dGhpcy5waWNrZXIuZmluZChcIi5kYXRlcGlja2VyLWRheXMgLmRhdGVwaWNrZXItc3dpdGNoXCIpLnRleHQoci5mb3JtYXREYXRlKGYsbyx0aGlzLm8ubGFuZ3VhZ2UpKSx0aGlzLnBpY2tlci5maW5kKFwidGZvb3QgLnRvZGF5XCIpLnRleHQobSkuY3NzKFwiZGlzcGxheVwiLHRoaXMuby50b2RheUJ0bj09PSEwfHxcImxpbmtlZFwiPT09dGhpcy5vLnRvZGF5QnRuP1widGFibGUtY2VsbFwiOlwibm9uZVwiKSx0aGlzLnBpY2tlci5maW5kKFwidGZvb3QgLmNsZWFyXCIpLnRleHQobikuY3NzKFwiZGlzcGxheVwiLHRoaXMuby5jbGVhckJ0bj09PSEwP1widGFibGUtY2VsbFwiOlwibm9uZVwiKSx0aGlzLnBpY2tlci5maW5kKFwidGhlYWQgLmRhdGVwaWNrZXItdGl0bGVcIikudGV4dCh0aGlzLm8udGl0bGUpLmNzcyhcImRpc3BsYXlcIixcInN0cmluZ1wiPT10eXBlb2YgdGhpcy5vLnRpdGxlJiZcIlwiIT09dGhpcy5vLnRpdGxlP1widGFibGUtY2VsbFwiOlwibm9uZVwiKSx0aGlzLnVwZGF0ZU5hdkFycm93cygpLHRoaXMuZmlsbE1vbnRocygpO3ZhciBwPWMoZyxoLDApLHM9cC5nZXRVVENEYXRlKCk7cC5zZXRVVENEYXRlKHMtKHAuZ2V0VVRDRGF5KCktdGhpcy5vLndlZWtTdGFydCs3KSU3KTt2YXIgdD1uZXcgRGF0ZShwKTtwLmdldFVUQ0Z1bGxZZWFyKCk8MTAwJiZ0LnNldFVUQ0Z1bGxZZWFyKHAuZ2V0VVRDRnVsbFllYXIoKSksdC5zZXRVVENEYXRlKHQuZ2V0VVRDRGF0ZSgpKzQyKSx0PXQudmFsdWVPZigpO2Zvcih2YXIgdSx2LHc9W107cC52YWx1ZU9mKCk8dDspe2lmKHU9cC5nZXRVVENEYXkoKSx1PT09dGhpcy5vLndlZWtTdGFydCYmKHcucHVzaChcIjx0cj5cIiksdGhpcy5vLmNhbGVuZGFyV2Vla3MpKXt2YXIgeD1uZXcgRGF0ZSgrcCsodGhpcy5vLndlZWtTdGFydC11LTcpJTcqODY0ZTUpLHk9bmV3IERhdGUoTnVtYmVyKHgpKygxMS14LmdldFVUQ0RheSgpKSU3Kjg2NGU1KSx6PW5ldyBEYXRlKE51bWJlcih6PWMoeS5nZXRVVENGdWxsWWVhcigpLDAsMSkpKygxMS16LmdldFVUQ0RheSgpKSU3Kjg2NGU1KSxBPSh5LXopLzg2NGU1LzcrMTt3LnB1c2goJzx0ZCBjbGFzcz1cImN3XCI+JytBK1wiPC90ZD5cIil9dj10aGlzLmdldENsYXNzTmFtZXMocCksdi5wdXNoKFwiZGF5XCIpO3ZhciBCPXAuZ2V0VVRDRGF0ZSgpO3RoaXMuby5iZWZvcmVTaG93RGF5IT09YS5ub29wJiYoZT10aGlzLm8uYmVmb3JlU2hvd0RheSh0aGlzLl91dGNfdG9fbG9jYWwocCkpLGU9PT1iP2U9e306XCJib29sZWFuXCI9PXR5cGVvZiBlP2U9e2VuYWJsZWQ6ZX06XCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPXtjbGFzc2VzOmV9KSxlLmVuYWJsZWQ9PT0hMSYmdi5wdXNoKFwiZGlzYWJsZWRcIiksZS5jbGFzc2VzJiYodj12LmNvbmNhdChlLmNsYXNzZXMuc3BsaXQoL1xccysvKSkpLGUudG9vbHRpcCYmKGQ9ZS50b29sdGlwKSxlLmNvbnRlbnQmJihCPWUuY29udGVudCkpLHY9YS5pc0Z1bmN0aW9uKGEudW5pcXVlU29ydCk/YS51bmlxdWVTb3J0KHYpOmEudW5pcXVlKHYpLHcucHVzaCgnPHRkIGNsYXNzPVwiJyt2LmpvaW4oXCIgXCIpKydcIicrKGQ/JyB0aXRsZT1cIicrZCsnXCInOlwiXCIpKycgZGF0YS1kYXRlPVwiJytwLmdldFRpbWUoKS50b1N0cmluZygpKydcIj4nK0IrXCI8L3RkPlwiKSxkPW51bGwsdT09PXRoaXMuby53ZWVrRW5kJiZ3LnB1c2goXCI8L3RyPlwiKSxwLnNldFVUQ0RhdGUocC5nZXRVVENEYXRlKCkrMSl9dGhpcy5waWNrZXIuZmluZChcIi5kYXRlcGlja2VyLWRheXMgdGJvZHlcIikuaHRtbCh3LmpvaW4oXCJcIikpO3ZhciBDPXFbdGhpcy5vLmxhbmd1YWdlXS5tb250aHNUaXRsZXx8cS5lbi5tb250aHNUaXRsZXx8XCJNb250aHNcIixEPXRoaXMucGlja2VyLmZpbmQoXCIuZGF0ZXBpY2tlci1tb250aHNcIikuZmluZChcIi5kYXRlcGlja2VyLXN3aXRjaFwiKS50ZXh0KHRoaXMuby5tYXhWaWV3TW9kZTwyP0M6ZykuZW5kKCkuZmluZChcInRib2R5IHNwYW5cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7aWYoYS5lYWNoKHRoaXMuZGF0ZXMsZnVuY3Rpb24oYSxiKXtiLmdldFVUQ0Z1bGxZZWFyKCk9PT1nJiZELmVxKGIuZ2V0VVRDTW9udGgoKSkuYWRkQ2xhc3MoXCJhY3RpdmVcIil9KSwoZzxpfHxnPmspJiZELmFkZENsYXNzKFwiZGlzYWJsZWRcIiksZz09PWkmJkQuc2xpY2UoMCxqKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpLGc9PT1rJiZELnNsaWNlKGwrMSkuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKSx0aGlzLm8uYmVmb3JlU2hvd01vbnRoIT09YS5ub29wKXt2YXIgRT10aGlzO2EuZWFjaChELGZ1bmN0aW9uKGMsZCl7dmFyIGU9bmV3IERhdGUoZyxjLDEpLGY9RS5vLmJlZm9yZVNob3dNb250aChlKTtmPT09Yj9mPXt9OlwiYm9vbGVhblwiPT10eXBlb2YgZj9mPXtlbmFibGVkOmZ9Olwic3RyaW5nXCI9PXR5cGVvZiBmJiYoZj17Y2xhc3NlczpmfSksZi5lbmFibGVkIT09ITF8fGEoZCkuaGFzQ2xhc3MoXCJkaXNhYmxlZFwiKXx8YShkKS5hZGRDbGFzcyhcImRpc2FibGVkXCIpLGYuY2xhc3NlcyYmYShkKS5hZGRDbGFzcyhmLmNsYXNzZXMpLGYudG9vbHRpcCYmYShkKS5wcm9wKFwidGl0bGVcIixmLnRvb2x0aXApfSl9dGhpcy5fZmlsbF95ZWFyc1ZpZXcoXCIuZGF0ZXBpY2tlci15ZWFyc1wiLFwieWVhclwiLDEwLGcsaSxrLHRoaXMuby5iZWZvcmVTaG93WWVhciksdGhpcy5fZmlsbF95ZWFyc1ZpZXcoXCIuZGF0ZXBpY2tlci1kZWNhZGVzXCIsXCJkZWNhZGVcIiwxMDAsZyxpLGssdGhpcy5vLmJlZm9yZVNob3dEZWNhZGUpLHRoaXMuX2ZpbGxfeWVhcnNWaWV3KFwiLmRhdGVwaWNrZXItY2VudHVyaWVzXCIsXCJjZW50dXJ5XCIsMWUzLGcsaSxrLHRoaXMuby5iZWZvcmVTaG93Q2VudHVyeSl9fSx1cGRhdGVOYXZBcnJvd3M6ZnVuY3Rpb24oKXtpZih0aGlzLl9hbGxvd191cGRhdGUpe3ZhciBhLGIsYz1uZXcgRGF0ZSh0aGlzLnZpZXdEYXRlKSxkPWMuZ2V0VVRDRnVsbFllYXIoKSxlPWMuZ2V0VVRDTW9udGgoKSxmPXRoaXMuby5zdGFydERhdGUhPT0tKDEvMCk/dGhpcy5vLnN0YXJ0RGF0ZS5nZXRVVENGdWxsWWVhcigpOi0oMS8wKSxnPXRoaXMuby5zdGFydERhdGUhPT0tKDEvMCk/dGhpcy5vLnN0YXJ0RGF0ZS5nZXRVVENNb250aCgpOi0oMS8wKSxoPXRoaXMuby5lbmREYXRlIT09MS8wP3RoaXMuby5lbmREYXRlLmdldFVUQ0Z1bGxZZWFyKCk6MS8wLGk9dGhpcy5vLmVuZERhdGUhPT0xLzA/dGhpcy5vLmVuZERhdGUuZ2V0VVRDTW9udGgoKToxLzAsaj0xO3N3aXRjaCh0aGlzLnZpZXdNb2RlKXtjYXNlIDQ6aio9MTA7Y2FzZSAzOmoqPTEwO2Nhc2UgMjpqKj0xMDtjYXNlIDE6YT1NYXRoLmZsb29yKGQvaikqajxmLGI9TWF0aC5mbG9vcihkL2opKmoraj5oO2JyZWFrO2Nhc2UgMDphPWQ8PWYmJmU8ZyxiPWQ+PWgmJmU+aX10aGlzLnBpY2tlci5maW5kKFwiLnByZXZcIikudG9nZ2xlQ2xhc3MoXCJkaXNhYmxlZFwiLGEpLHRoaXMucGlja2VyLmZpbmQoXCIubmV4dFwiKS50b2dnbGVDbGFzcyhcImRpc2FibGVkXCIsYil9fSxjbGljazpmdW5jdGlvbihiKXtiLnByZXZlbnREZWZhdWx0KCksYi5zdG9wUHJvcGFnYXRpb24oKTt2YXIgZSxmLGcsaDtlPWEoYi50YXJnZXQpLGUuaGFzQ2xhc3MoXCJkYXRlcGlja2VyLXN3aXRjaFwiKSYmdGhpcy52aWV3TW9kZSE9PXRoaXMuby5tYXhWaWV3TW9kZSYmdGhpcy5zZXRWaWV3TW9kZSh0aGlzLnZpZXdNb2RlKzEpLGUuaGFzQ2xhc3MoXCJ0b2RheVwiKSYmIWUuaGFzQ2xhc3MoXCJkYXlcIikmJih0aGlzLnNldFZpZXdNb2RlKDApLHRoaXMuX3NldERhdGUoZCgpLFwibGlua2VkXCI9PT10aGlzLm8udG9kYXlCdG4/bnVsbDpcInZpZXdcIikpLGUuaGFzQ2xhc3MoXCJjbGVhclwiKSYmdGhpcy5jbGVhckRhdGVzKCksZS5oYXNDbGFzcyhcImRpc2FibGVkXCIpfHwoZS5oYXNDbGFzcyhcIm1vbnRoXCIpfHxlLmhhc0NsYXNzKFwieWVhclwiKXx8ZS5oYXNDbGFzcyhcImRlY2FkZVwiKXx8ZS5oYXNDbGFzcyhcImNlbnR1cnlcIikpJiYodGhpcy52aWV3RGF0ZS5zZXRVVENEYXRlKDEpLGY9MSwxPT09dGhpcy52aWV3TW9kZT8oaD1lLnBhcmVudCgpLmZpbmQoXCJzcGFuXCIpLmluZGV4KGUpLGc9dGhpcy52aWV3RGF0ZS5nZXRVVENGdWxsWWVhcigpLHRoaXMudmlld0RhdGUuc2V0VVRDTW9udGgoaCkpOihoPTAsZz1OdW1iZXIoZS50ZXh0KCkpLHRoaXMudmlld0RhdGUuc2V0VVRDRnVsbFllYXIoZykpLHRoaXMuX3RyaWdnZXIoci52aWV3TW9kZXNbdGhpcy52aWV3TW9kZS0xXS5lLHRoaXMudmlld0RhdGUpLHRoaXMudmlld01vZGU9PT10aGlzLm8ubWluVmlld01vZGU/dGhpcy5fc2V0RGF0ZShjKGcsaCxmKSk6KHRoaXMuc2V0Vmlld01vZGUodGhpcy52aWV3TW9kZS0xKSx0aGlzLmZpbGwoKSkpLHRoaXMucGlja2VyLmlzKFwiOnZpc2libGVcIikmJnRoaXMuX2ZvY3VzZWRfZnJvbSYmdGhpcy5fZm9jdXNlZF9mcm9tLmZvY3VzKCksZGVsZXRlIHRoaXMuX2ZvY3VzZWRfZnJvbX0sZGF5Q2VsbENsaWNrOmZ1bmN0aW9uKGIpe3ZhciBjPWEoYi5jdXJyZW50VGFyZ2V0KSxkPWMuZGF0YShcImRhdGVcIiksZT1uZXcgRGF0ZShkKTt0aGlzLm8udXBkYXRlVmlld0RhdGUmJihlLmdldFVUQ0Z1bGxZZWFyKCkhPT10aGlzLnZpZXdEYXRlLmdldFVUQ0Z1bGxZZWFyKCkmJnRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VZZWFyXCIsdGhpcy52aWV3RGF0ZSksZS5nZXRVVENNb250aCgpIT09dGhpcy52aWV3RGF0ZS5nZXRVVENNb250aCgpJiZ0aGlzLl90cmlnZ2VyKFwiY2hhbmdlTW9udGhcIix0aGlzLnZpZXdEYXRlKSksdGhpcy5fc2V0RGF0ZShlKX0sbmF2QXJyb3dzQ2xpY2s6ZnVuY3Rpb24oYil7dmFyIGM9YShiLmN1cnJlbnRUYXJnZXQpLGQ9Yy5oYXNDbGFzcyhcInByZXZcIik/LTE6MTswIT09dGhpcy52aWV3TW9kZSYmKGQqPTEyKnIudmlld01vZGVzW3RoaXMudmlld01vZGVdLm5hdlN0ZXApLHRoaXMudmlld0RhdGU9dGhpcy5tb3ZlTW9udGgodGhpcy52aWV3RGF0ZSxkKSx0aGlzLl90cmlnZ2VyKHIudmlld01vZGVzW3RoaXMudmlld01vZGVdLmUsdGhpcy52aWV3RGF0ZSksdGhpcy5maWxsKCl9LF90b2dnbGVfbXVsdGlkYXRlOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuZGF0ZXMuY29udGFpbnMoYSk7aWYoYXx8dGhpcy5kYXRlcy5jbGVhcigpLGIhPT0tMT8odGhpcy5vLm11bHRpZGF0ZT09PSEwfHx0aGlzLm8ubXVsdGlkYXRlPjF8fHRoaXMuby50b2dnbGVBY3RpdmUpJiZ0aGlzLmRhdGVzLnJlbW92ZShiKTp0aGlzLm8ubXVsdGlkYXRlPT09ITE/KHRoaXMuZGF0ZXMuY2xlYXIoKSx0aGlzLmRhdGVzLnB1c2goYSkpOnRoaXMuZGF0ZXMucHVzaChhKSxcIm51bWJlclwiPT10eXBlb2YgdGhpcy5vLm11bHRpZGF0ZSlmb3IoO3RoaXMuZGF0ZXMubGVuZ3RoPnRoaXMuby5tdWx0aWRhdGU7KXRoaXMuZGF0ZXMucmVtb3ZlKDApfSxfc2V0RGF0ZTpmdW5jdGlvbihhLGIpe2ImJlwiZGF0ZVwiIT09Ynx8dGhpcy5fdG9nZ2xlX211bHRpZGF0ZShhJiZuZXcgRGF0ZShhKSksKCFiJiZ0aGlzLm8udXBkYXRlVmlld0RhdGV8fFwidmlld1wiPT09YikmJih0aGlzLnZpZXdEYXRlPWEmJm5ldyBEYXRlKGEpKSx0aGlzLmZpbGwoKSx0aGlzLnNldFZhbHVlKCksYiYmXCJ2aWV3XCI9PT1ifHx0aGlzLl90cmlnZ2VyKFwiY2hhbmdlRGF0ZVwiKSx0aGlzLmlucHV0RmllbGQudHJpZ2dlcihcImNoYW5nZVwiKSwhdGhpcy5vLmF1dG9jbG9zZXx8YiYmXCJkYXRlXCIhPT1ifHx0aGlzLmhpZGUoKX0sbW92ZURheTpmdW5jdGlvbihhLGIpe3ZhciBjPW5ldyBEYXRlKGEpO3JldHVybiBjLnNldFVUQ0RhdGUoYS5nZXRVVENEYXRlKCkrYiksY30sbW92ZVdlZWs6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5tb3ZlRGF5KGEsNypiKX0sbW92ZU1vbnRoOmZ1bmN0aW9uKGEsYil7aWYoIWcoYSkpcmV0dXJuIHRoaXMuby5kZWZhdWx0Vmlld0RhdGU7aWYoIWIpcmV0dXJuIGE7dmFyIGMsZCxlPW5ldyBEYXRlKGEudmFsdWVPZigpKSxmPWUuZ2V0VVRDRGF0ZSgpLGg9ZS5nZXRVVENNb250aCgpLGk9TWF0aC5hYnMoYik7aWYoYj1iPjA/MTotMSwxPT09aSlkPWI9PT0tMT9mdW5jdGlvbigpe3JldHVybiBlLmdldFVUQ01vbnRoKCk9PT1ofTpmdW5jdGlvbigpe3JldHVybiBlLmdldFVUQ01vbnRoKCkhPT1jfSxjPWgrYixlLnNldFVUQ01vbnRoKGMpLGM9KGMrMTIpJTEyO2Vsc2V7Zm9yKHZhciBqPTA7ajxpO2orKyllPXRoaXMubW92ZU1vbnRoKGUsYik7Yz1lLmdldFVUQ01vbnRoKCksZS5zZXRVVENEYXRlKGYpLGQ9ZnVuY3Rpb24oKXtyZXR1cm4gYyE9PWUuZ2V0VVRDTW9udGgoKX19Zm9yKDtkKCk7KWUuc2V0VVRDRGF0ZSgtLWYpLGUuc2V0VVRDTW9udGgoYyk7cmV0dXJuIGV9LG1vdmVZZWFyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMubW92ZU1vbnRoKGEsMTIqYil9LG1vdmVBdmFpbGFibGVEYXRlOmZ1bmN0aW9uKGEsYixjKXtkb3tpZihhPXRoaXNbY10oYSxiKSwhdGhpcy5kYXRlV2l0aGluUmFuZ2UoYSkpcmV0dXJuITE7Yz1cIm1vdmVEYXlcIn13aGlsZSh0aGlzLmRhdGVJc0Rpc2FibGVkKGEpKTtyZXR1cm4gYX0sd2Vla09mRGF0ZUlzRGlzYWJsZWQ6ZnVuY3Rpb24oYil7cmV0dXJuIGEuaW5BcnJheShiLmdldFVUQ0RheSgpLHRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQpIT09LTF9LGRhdGVJc0Rpc2FibGVkOmZ1bmN0aW9uKGIpe3JldHVybiB0aGlzLndlZWtPZkRhdGVJc0Rpc2FibGVkKGIpfHxhLmdyZXAodGhpcy5vLmRhdGVzRGlzYWJsZWQsZnVuY3Rpb24oYSl7cmV0dXJuIGUoYixhKX0pLmxlbmd0aD4wfSxkYXRlV2l0aGluUmFuZ2U6ZnVuY3Rpb24oYSl7cmV0dXJuIGE+PXRoaXMuby5zdGFydERhdGUmJmE8PXRoaXMuby5lbmREYXRlfSxrZXlkb3duOmZ1bmN0aW9uKGEpe2lmKCF0aGlzLnBpY2tlci5pcyhcIjp2aXNpYmxlXCIpKXJldHVybiB2b2lkKDQwIT09YS5rZXlDb2RlJiYyNyE9PWEua2V5Q29kZXx8KHRoaXMuc2hvdygpLGEuc3RvcFByb3BhZ2F0aW9uKCkpKTt2YXIgYixjLGQ9ITEsZT10aGlzLmZvY3VzRGF0ZXx8dGhpcy52aWV3RGF0ZTtzd2l0Y2goYS5rZXlDb2RlKXtjYXNlIDI3OnRoaXMuZm9jdXNEYXRlPyh0aGlzLmZvY3VzRGF0ZT1udWxsLHRoaXMudmlld0RhdGU9dGhpcy5kYXRlcy5nZXQoLTEpfHx0aGlzLnZpZXdEYXRlLHRoaXMuZmlsbCgpKTp0aGlzLmhpZGUoKSxhLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKTticmVhaztjYXNlIDM3OmNhc2UgMzg6Y2FzZSAzOTpjYXNlIDQwOmlmKCF0aGlzLm8ua2V5Ym9hcmROYXZpZ2F0aW9ufHw3PT09dGhpcy5vLmRheXNPZldlZWtEaXNhYmxlZC5sZW5ndGgpYnJlYWs7Yj0zNz09PWEua2V5Q29kZXx8Mzg9PT1hLmtleUNvZGU/LTE6MSwwPT09dGhpcy52aWV3TW9kZT9hLmN0cmxLZXk/KGM9dGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShlLGIsXCJtb3ZlWWVhclwiKSxjJiZ0aGlzLl90cmlnZ2VyKFwiY2hhbmdlWWVhclwiLHRoaXMudmlld0RhdGUpKTphLnNoaWZ0S2V5PyhjPXRoaXMubW92ZUF2YWlsYWJsZURhdGUoZSxiLFwibW92ZU1vbnRoXCIpLGMmJnRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VNb250aFwiLHRoaXMudmlld0RhdGUpKTozNz09PWEua2V5Q29kZXx8Mzk9PT1hLmtleUNvZGU/Yz10aGlzLm1vdmVBdmFpbGFibGVEYXRlKGUsYixcIm1vdmVEYXlcIik6dGhpcy53ZWVrT2ZEYXRlSXNEaXNhYmxlZChlKXx8KGM9dGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShlLGIsXCJtb3ZlV2Vla1wiKSk6MT09PXRoaXMudmlld01vZGU/KDM4IT09YS5rZXlDb2RlJiY0MCE9PWEua2V5Q29kZXx8KGIqPTQpLGM9dGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShlLGIsXCJtb3ZlTW9udGhcIikpOjI9PT10aGlzLnZpZXdNb2RlJiYoMzghPT1hLmtleUNvZGUmJjQwIT09YS5rZXlDb2RlfHwoYio9NCksYz10aGlzLm1vdmVBdmFpbGFibGVEYXRlKGUsYixcIm1vdmVZZWFyXCIpKSxjJiYodGhpcy5mb2N1c0RhdGU9dGhpcy52aWV3RGF0ZT1jLHRoaXMuc2V0VmFsdWUoKSx0aGlzLmZpbGwoKSxhLnByZXZlbnREZWZhdWx0KCkpO2JyZWFrO2Nhc2UgMTM6aWYoIXRoaXMuby5mb3JjZVBhcnNlKWJyZWFrO2U9dGhpcy5mb2N1c0RhdGV8fHRoaXMuZGF0ZXMuZ2V0KC0xKXx8dGhpcy52aWV3RGF0ZSx0aGlzLm8ua2V5Ym9hcmROYXZpZ2F0aW9uJiYodGhpcy5fdG9nZ2xlX211bHRpZGF0ZShlKSxkPSEwKSx0aGlzLmZvY3VzRGF0ZT1udWxsLHRoaXMudmlld0RhdGU9dGhpcy5kYXRlcy5nZXQoLTEpfHx0aGlzLnZpZXdEYXRlLHRoaXMuc2V0VmFsdWUoKSx0aGlzLmZpbGwoKSx0aGlzLnBpY2tlci5pcyhcIjp2aXNpYmxlXCIpJiYoYS5wcmV2ZW50RGVmYXVsdCgpLGEuc3RvcFByb3BhZ2F0aW9uKCksdGhpcy5vLmF1dG9jbG9zZSYmdGhpcy5oaWRlKCkpO2JyZWFrO2Nhc2UgOTp0aGlzLmZvY3VzRGF0ZT1udWxsLHRoaXMudmlld0RhdGU9dGhpcy5kYXRlcy5nZXQoLTEpfHx0aGlzLnZpZXdEYXRlLHRoaXMuZmlsbCgpLHRoaXMuaGlkZSgpfWQmJih0aGlzLmRhdGVzLmxlbmd0aD90aGlzLl90cmlnZ2VyKFwiY2hhbmdlRGF0ZVwiKTp0aGlzLl90cmlnZ2VyKFwiY2xlYXJEYXRlXCIpLHRoaXMuaW5wdXRGaWVsZC50cmlnZ2VyKFwiY2hhbmdlXCIpKX0sc2V0Vmlld01vZGU6ZnVuY3Rpb24oYSl7dGhpcy52aWV3TW9kZT1hLHRoaXMucGlja2VyLmNoaWxkcmVuKFwiZGl2XCIpLmhpZGUoKS5maWx0ZXIoXCIuZGF0ZXBpY2tlci1cIityLnZpZXdNb2Rlc1t0aGlzLnZpZXdNb2RlXS5jbHNOYW1lKS5zaG93KCksdGhpcy51cGRhdGVOYXZBcnJvd3MoKSx0aGlzLl90cmlnZ2VyKFwiY2hhbmdlVmlld01vZGVcIixuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlKSl9fTt2YXIgbD1mdW5jdGlvbihiLGMpe2EuZGF0YShiLFwiZGF0ZXBpY2tlclwiLHRoaXMpLHRoaXMuZWxlbWVudD1hKGIpLHRoaXMuaW5wdXRzPWEubWFwKGMuaW5wdXRzLGZ1bmN0aW9uKGEpe3JldHVybiBhLmpxdWVyeT9hWzBdOmF9KSxkZWxldGUgYy5pbnB1dHMsdGhpcy5rZWVwRW1wdHlWYWx1ZXM9Yy5rZWVwRW1wdHlWYWx1ZXMsZGVsZXRlIGMua2VlcEVtcHR5VmFsdWVzLG4uY2FsbChhKHRoaXMuaW5wdXRzKSxjKS5vbihcImNoYW5nZURhdGVcIixhLnByb3h5KHRoaXMuZGF0ZVVwZGF0ZWQsdGhpcykpLHRoaXMucGlja2Vycz1hLm1hcCh0aGlzLmlucHV0cyxmdW5jdGlvbihiKXtyZXR1cm4gYS5kYXRhKGIsXCJkYXRlcGlja2VyXCIpfSksdGhpcy51cGRhdGVEYXRlcygpfTtsLnByb3RvdHlwZT17dXBkYXRlRGF0ZXM6ZnVuY3Rpb24oKXt0aGlzLmRhdGVzPWEubWFwKHRoaXMucGlja2VycyxmdW5jdGlvbihhKXtyZXR1cm4gYS5nZXRVVENEYXRlKCl9KSx0aGlzLnVwZGF0ZVJhbmdlcygpfSx1cGRhdGVSYW5nZXM6ZnVuY3Rpb24oKXt2YXIgYj1hLm1hcCh0aGlzLmRhdGVzLGZ1bmN0aW9uKGEpe3JldHVybiBhLnZhbHVlT2YoKX0pO2EuZWFjaCh0aGlzLnBpY2tlcnMsZnVuY3Rpb24oYSxjKXtjLnNldFJhbmdlKGIpfSl9LGNsZWFyRGF0ZXM6ZnVuY3Rpb24oKXthLmVhY2godGhpcy5waWNrZXJzLGZ1bmN0aW9uKGEsYil7Yi5jbGVhckRhdGVzKCl9KX0sZGF0ZVVwZGF0ZWQ6ZnVuY3Rpb24oYyl7aWYoIXRoaXMudXBkYXRpbmcpe3RoaXMudXBkYXRpbmc9ITA7dmFyIGQ9YS5kYXRhKGMudGFyZ2V0LFwiZGF0ZXBpY2tlclwiKTtpZihkIT09Yil7dmFyIGU9ZC5nZXRVVENEYXRlKCksZj10aGlzLmtlZXBFbXB0eVZhbHVlcyxnPWEuaW5BcnJheShjLnRhcmdldCx0aGlzLmlucHV0cyksaD1nLTEsaT1nKzEsaj10aGlzLmlucHV0cy5sZW5ndGg7aWYoZyE9PS0xKXtpZihhLmVhY2godGhpcy5waWNrZXJzLGZ1bmN0aW9uKGEsYil7Yi5nZXRVVENEYXRlKCl8fGIhPT1kJiZmfHxiLnNldFVUQ0RhdGUoZSl9KSxlPHRoaXMuZGF0ZXNbaF0pZm9yKDtoPj0wJiZlPHRoaXMuZGF0ZXNbaF07KXRoaXMucGlja2Vyc1toLS1dLnNldFVUQ0RhdGUoZSk7ZWxzZSBpZihlPnRoaXMuZGF0ZXNbaV0pZm9yKDtpPGomJmU+dGhpcy5kYXRlc1tpXTspdGhpcy5waWNrZXJzW2krK10uc2V0VVRDRGF0ZShlKTt0aGlzLnVwZGF0ZURhdGVzKCksZGVsZXRlIHRoaXMudXBkYXRpbmd9fX19LGRlc3Ryb3k6ZnVuY3Rpb24oKXthLm1hcCh0aGlzLnBpY2tlcnMsZnVuY3Rpb24oYSl7YS5kZXN0cm95KCl9KSxhKHRoaXMuaW5wdXRzKS5vZmYoXCJjaGFuZ2VEYXRlXCIsdGhpcy5kYXRlVXBkYXRlZCksZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZXBpY2tlcn0scmVtb3ZlOmYoXCJkZXN0cm95XCIsXCJNZXRob2QgYHJlbW92ZWAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMi4wLiBVc2UgYGRlc3Ryb3lgIGluc3RlYWRcIil9O3ZhciBtPWEuZm4uZGF0ZXBpY2tlcixuPWZ1bmN0aW9uKGMpe3ZhciBkPUFycmF5LmFwcGx5KG51bGwsYXJndW1lbnRzKTtkLnNoaWZ0KCk7dmFyIGU7aWYodGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGI9YSh0aGlzKSxmPWIuZGF0YShcImRhdGVwaWNrZXJcIiksZz1cIm9iamVjdFwiPT10eXBlb2YgYyYmYztpZighZil7dmFyIGo9aCh0aGlzLFwiZGF0ZVwiKSxtPWEuZXh0ZW5kKHt9LG8saixnKSxuPWkobS5sYW5ndWFnZSkscD1hLmV4dGVuZCh7fSxvLG4saixnKTtiLmhhc0NsYXNzKFwiaW5wdXQtZGF0ZXJhbmdlXCIpfHxwLmlucHV0cz8oYS5leHRlbmQocCx7aW5wdXRzOnAuaW5wdXRzfHxiLmZpbmQoXCJpbnB1dFwiKS50b0FycmF5KCl9KSxmPW5ldyBsKHRoaXMscCkpOmY9bmV3IGsodGhpcyxwKSxiLmRhdGEoXCJkYXRlcGlja2VyXCIsZil9XCJzdHJpbmdcIj09dHlwZW9mIGMmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGZbY10mJihlPWZbY10uYXBwbHkoZixkKSl9KSxlPT09Ynx8ZSBpbnN0YW5jZW9mIGt8fGUgaW5zdGFuY2VvZiBsKXJldHVybiB0aGlzO2lmKHRoaXMubGVuZ3RoPjEpdGhyb3cgbmV3IEVycm9yKFwiVXNpbmcgb25seSBhbGxvd2VkIGZvciB0aGUgY29sbGVjdGlvbiBvZiBhIHNpbmdsZSBlbGVtZW50IChcIitjK1wiIGZ1bmN0aW9uKVwiKTtyZXR1cm4gZX07YS5mbi5kYXRlcGlja2VyPW47dmFyIG89YS5mbi5kYXRlcGlja2VyLmRlZmF1bHRzPXthc3N1bWVOZWFyYnlZZWFyOiExLGF1dG9jbG9zZTohMSxiZWZvcmVTaG93RGF5OmEubm9vcCxiZWZvcmVTaG93TW9udGg6YS5ub29wLGJlZm9yZVNob3dZZWFyOmEubm9vcCxiZWZvcmVTaG93RGVjYWRlOmEubm9vcCxiZWZvcmVTaG93Q2VudHVyeTphLm5vb3AsY2FsZW5kYXJXZWVrczohMSxjbGVhckJ0bjohMSx0b2dnbGVBY3RpdmU6ITEsZGF5c09mV2Vla0Rpc2FibGVkOltdLGRheXNPZldlZWtIaWdobGlnaHRlZDpbXSxkYXRlc0Rpc2FibGVkOltdLGVuZERhdGU6MS8wLGZvcmNlUGFyc2U6ITAsZm9ybWF0OlwibW0vZGQveXl5eVwiLGtlZXBFbXB0eVZhbHVlczohMSxrZXlib2FyZE5hdmlnYXRpb246ITAsbGFuZ3VhZ2U6XCJlblwiLG1pblZpZXdNb2RlOjAsbWF4Vmlld01vZGU6NCxtdWx0aWRhdGU6ITEsbXVsdGlkYXRlU2VwYXJhdG9yOlwiLFwiLG9yaWVudGF0aW9uOlwiYXV0b1wiLHJ0bDohMSxzdGFydERhdGU6LSgxLzApLHN0YXJ0VmlldzowLHRvZGF5QnRuOiExLHRvZGF5SGlnaGxpZ2h0OiExLHVwZGF0ZVZpZXdEYXRlOiEwLHdlZWtTdGFydDowLGRpc2FibGVUb3VjaEtleWJvYXJkOiExLGVuYWJsZU9uUmVhZG9ubHk6ITAsc2hvd09uRm9jdXM6ITAsekluZGV4T2Zmc2V0OjEwLGNvbnRhaW5lcjpcImJvZHlcIixpbW1lZGlhdGVVcGRhdGVzOiExLHRpdGxlOlwiXCIsdGVtcGxhdGVzOntsZWZ0QXJyb3c6XCImI3gwMEFCO1wiLHJpZ2h0QXJyb3c6XCImI3gwMEJCO1wifSxzaG93V2Vla0RheXM6ITB9LHA9YS5mbi5kYXRlcGlja2VyLmxvY2FsZV9vcHRzPVtcImZvcm1hdFwiLFwicnRsXCIsXCJ3ZWVrU3RhcnRcIl07YS5mbi5kYXRlcGlja2VyLkNvbnN0cnVjdG9yPWs7dmFyIHE9YS5mbi5kYXRlcGlja2VyLmRhdGVzPXtlbjp7ZGF5czpbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXSxkYXlzU2hvcnQ6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCJdLGRheXNNaW46W1wiU3VcIixcIk1vXCIsXCJUdVwiLFwiV2VcIixcIlRoXCIsXCJGclwiLFwiU2FcIl0sbW9udGhzOltcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXSxtb250aHNTaG9ydDpbXCJKYW5cIixcIkZlYlwiLFwiTWFyXCIsXCJBcHJcIixcIk1heVwiLFwiSnVuXCIsXCJKdWxcIixcIkF1Z1wiLFwiU2VwXCIsXCJPY3RcIixcIk5vdlwiLFwiRGVjXCJdLHRvZGF5OlwiVG9kYXlcIixjbGVhcjpcIkNsZWFyXCIsdGl0bGVGb3JtYXQ6XCJNTSB5eXl5XCJ9fSxyPXt2aWV3TW9kZXM6W3tuYW1lczpbXCJkYXlzXCIsXCJtb250aFwiXSxjbHNOYW1lOlwiZGF5c1wiLGU6XCJjaGFuZ2VNb250aFwifSx7bmFtZXM6W1wibW9udGhzXCIsXCJ5ZWFyXCJdLGNsc05hbWU6XCJtb250aHNcIixlOlwiY2hhbmdlWWVhclwiLG5hdlN0ZXA6MX0se25hbWVzOltcInllYXJzXCIsXCJkZWNhZGVcIl0sY2xzTmFtZTpcInllYXJzXCIsZTpcImNoYW5nZURlY2FkZVwiLG5hdlN0ZXA6MTB9LHtuYW1lczpbXCJkZWNhZGVzXCIsXCJjZW50dXJ5XCJdLGNsc05hbWU6XCJkZWNhZGVzXCIsZTpcImNoYW5nZUNlbnR1cnlcIixuYXZTdGVwOjEwMH0se25hbWVzOltcImNlbnR1cmllc1wiLFwibWlsbGVubml1bVwiXSxjbHNOYW1lOlwiY2VudHVyaWVzXCIsZTpcImNoYW5nZU1pbGxlbm5pdW1cIixuYXZTdGVwOjFlM31dLHZhbGlkUGFydHM6L2RkP3xERD98bW0/fE1NP3x5eSg/Onl5KT8vZyxub25wdW5jdHVhdGlvbjovW14gLVxcLzotQFxcdTVlNzRcXHU2NzA4XFx1NjVlNVxcWy1gey1+XFx0XFxuXFxyXSsvZyxwYXJzZUZvcm1hdDpmdW5jdGlvbihhKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLnRvVmFsdWUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEudG9EaXNwbGF5KXJldHVybiBhO3ZhciBiPWEucmVwbGFjZSh0aGlzLnZhbGlkUGFydHMsXCJcXDBcIikuc3BsaXQoXCJcXDBcIiksYz1hLm1hdGNoKHRoaXMudmFsaWRQYXJ0cyk7aWYoIWJ8fCFiLmxlbmd0aHx8IWN8fDA9PT1jLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRhdGUgZm9ybWF0LlwiKTtyZXR1cm57c2VwYXJhdG9yczpiLHBhcnRzOmN9fSxwYXJzZURhdGU6ZnVuY3Rpb24oYyxlLGYsZyl7ZnVuY3Rpb24gaChhLGIpe3JldHVybiBiPT09ITAmJihiPTEwKSxhPDEwMCYmKGErPTJlMyxhPihuZXcgRGF0ZSkuZ2V0RnVsbFllYXIoKStiJiYoYS09MTAwKSksYX1mdW5jdGlvbiBpKCl7dmFyIGE9dGhpcy5zbGljZSgwLGpbbl0ubGVuZ3RoKSxiPWpbbl0uc2xpY2UoMCxhLmxlbmd0aCk7cmV0dXJuIGEudG9Mb3dlckNhc2UoKT09PWIudG9Mb3dlckNhc2UoKX1pZighYylyZXR1cm4gYjtpZihjIGluc3RhbmNlb2YgRGF0ZSlyZXR1cm4gYztpZihcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9ci5wYXJzZUZvcm1hdChlKSksZS50b1ZhbHVlKXJldHVybiBlLnRvVmFsdWUoYyxlLGYpO3ZhciBqLGwsbSxuLG8scD17ZDpcIm1vdmVEYXlcIixtOlwibW92ZU1vbnRoXCIsdzpcIm1vdmVXZWVrXCIseTpcIm1vdmVZZWFyXCJ9LHM9e3llc3RlcmRheTpcIi0xZFwiLHRvZGF5OlwiKzBkXCIsdG9tb3Jyb3c6XCIrMWRcIn07aWYoYyBpbiBzJiYoYz1zW2NdKSwvXltcXC0rXVxcZCtbZG13eV0oW1xccyxdK1tcXC0rXVxcZCtbZG13eV0pKiQvaS50ZXN0KGMpKXtmb3Ioaj1jLm1hdGNoKC8oW1xcLStdXFxkKykoW2Rtd3ldKS9naSksYz1uZXcgRGF0ZSxuPTA7bjxqLmxlbmd0aDtuKyspbD1qW25dLm1hdGNoKC8oW1xcLStdXFxkKykoW2Rtd3ldKS9pKSxtPU51bWJlcihsWzFdKSxvPXBbbFsyXS50b0xvd2VyQ2FzZSgpXSxjPWsucHJvdG90eXBlW29dKGMsbSk7cmV0dXJuIGsucHJvdG90eXBlLl96ZXJvX3V0Y190aW1lKGMpfWo9YyYmYy5tYXRjaCh0aGlzLm5vbnB1bmN0dWF0aW9uKXx8W107dmFyIHQsdSx2PXt9LHc9W1wieXl5eVwiLFwieXlcIixcIk1cIixcIk1NXCIsXCJtXCIsXCJtbVwiLFwiZFwiLFwiZGRcIl0seD17eXl5eTpmdW5jdGlvbihhLGIpe3JldHVybiBhLnNldFVUQ0Z1bGxZZWFyKGc/aChiLGcpOmIpfSxtOmZ1bmN0aW9uKGEsYil7aWYoaXNOYU4oYSkpcmV0dXJuIGE7Zm9yKGItPTE7YjwwOyliKz0xMjtmb3IoYiU9MTIsYS5zZXRVVENNb250aChiKTthLmdldFVUQ01vbnRoKCkhPT1iOylhLnNldFVUQ0RhdGUoYS5nZXRVVENEYXRlKCktMSk7cmV0dXJuIGF9LGQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5zZXRVVENEYXRlKGIpfX07eC55eT14Lnl5eXkseC5NPXguTU09eC5tbT14Lm0seC5kZD14LmQsYz1kKCk7dmFyIHk9ZS5wYXJ0cy5zbGljZSgpO2lmKGoubGVuZ3RoIT09eS5sZW5ndGgmJih5PWEoeSkuZmlsdGVyKGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuaW5BcnJheShjLHcpIT09LTF9KS50b0FycmF5KCkpLGoubGVuZ3RoPT09eS5sZW5ndGgpe3ZhciB6O2ZvcihuPTAsej15Lmxlbmd0aDtuPHo7bisrKXtpZih0PXBhcnNlSW50KGpbbl0sMTApLGw9eVtuXSxpc05hTih0KSlzd2l0Y2gobCl7Y2FzZVwiTU1cIjp1PWEocVtmXS5tb250aHMpLmZpbHRlcihpKSx0PWEuaW5BcnJheSh1WzBdLHFbZl0ubW9udGhzKSsxO2JyZWFrO2Nhc2VcIk1cIjp1PWEocVtmXS5tb250aHNTaG9ydCkuZmlsdGVyKGkpLHQ9YS5pbkFycmF5KHVbMF0scVtmXS5tb250aHNTaG9ydCkrMX12W2xdPXR9dmFyIEEsQjtmb3Iobj0wO248dy5sZW5ndGg7bisrKUI9d1tuXSxCIGluIHYmJiFpc05hTih2W0JdKSYmKEE9bmV3IERhdGUoYykseFtCXShBLHZbQl0pLGlzTmFOKEEpfHwoYz1BKSl9cmV0dXJuIGN9LGZvcm1hdERhdGU6ZnVuY3Rpb24oYixjLGQpe2lmKCFiKXJldHVyblwiXCI7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGMmJihjPXIucGFyc2VGb3JtYXQoYykpLGMudG9EaXNwbGF5KXJldHVybiBjLnRvRGlzcGxheShiLGMsZCk7dmFyIGU9e2Q6Yi5nZXRVVENEYXRlKCksRDpxW2RdLmRheXNTaG9ydFtiLmdldFVUQ0RheSgpXSxERDpxW2RdLmRheXNbYi5nZXRVVENEYXkoKV0sbTpiLmdldFVUQ01vbnRoKCkrMSxNOnFbZF0ubW9udGhzU2hvcnRbYi5nZXRVVENNb250aCgpXSxNTTpxW2RdLm1vbnRoc1tiLmdldFVUQ01vbnRoKCldLHl5OmIuZ2V0VVRDRnVsbFllYXIoKS50b1N0cmluZygpLnN1YnN0cmluZygyKSx5eXl5OmIuZ2V0VVRDRnVsbFllYXIoKX07ZS5kZD0oZS5kPDEwP1wiMFwiOlwiXCIpK2UuZCxlLm1tPShlLm08MTA/XCIwXCI6XCJcIikrZS5tLGI9W107Zm9yKHZhciBmPWEuZXh0ZW5kKFtdLGMuc2VwYXJhdG9ycyksZz0wLGg9Yy5wYXJ0cy5sZW5ndGg7Zzw9aDtnKyspZi5sZW5ndGgmJmIucHVzaChmLnNoaWZ0KCkpLGIucHVzaChlW2MucGFydHNbZ11dKTtyZXR1cm4gYi5qb2luKFwiXCIpfSxoZWFkVGVtcGxhdGU6Jzx0aGVhZD48dHI+PHRoIGNvbHNwYW49XCI3XCIgY2xhc3M9XCJkYXRlcGlja2VyLXRpdGxlXCI+PC90aD48L3RyPjx0cj48dGggY2xhc3M9XCJwcmV2XCI+JytvLnRlbXBsYXRlcy5sZWZ0QXJyb3crJzwvdGg+PHRoIGNvbHNwYW49XCI1XCIgY2xhc3M9XCJkYXRlcGlja2VyLXN3aXRjaFwiPjwvdGg+PHRoIGNsYXNzPVwibmV4dFwiPicrby50ZW1wbGF0ZXMucmlnaHRBcnJvdytcIjwvdGg+PC90cj48L3RoZWFkPlwiLFxuY29udFRlbXBsYXRlOic8dGJvZHk+PHRyPjx0ZCBjb2xzcGFuPVwiN1wiPjwvdGQ+PC90cj48L3Rib2R5PicsZm9vdFRlbXBsYXRlOic8dGZvb3Q+PHRyPjx0aCBjb2xzcGFuPVwiN1wiIGNsYXNzPVwidG9kYXlcIj48L3RoPjwvdHI+PHRyPjx0aCBjb2xzcGFuPVwiN1wiIGNsYXNzPVwiY2xlYXJcIj48L3RoPjwvdHI+PC90Zm9vdD4nfTtyLnRlbXBsYXRlPSc8ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlclwiPjxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLWRheXNcIj48dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK3IuaGVhZFRlbXBsYXRlK1wiPHRib2R5PjwvdGJvZHk+XCIrci5mb290VGVtcGxhdGUrJzwvdGFibGU+PC9kaXY+PGRpdiBjbGFzcz1cImRhdGVwaWNrZXItbW9udGhzXCI+PHRhYmxlIGNsYXNzPVwidGFibGUtY29uZGVuc2VkXCI+JytyLmhlYWRUZW1wbGF0ZStyLmNvbnRUZW1wbGF0ZStyLmZvb3RUZW1wbGF0ZSsnPC90YWJsZT48L2Rpdj48ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci15ZWFyc1wiPjx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicrci5oZWFkVGVtcGxhdGUrci5jb250VGVtcGxhdGUrci5mb290VGVtcGxhdGUrJzwvdGFibGU+PC9kaXY+PGRpdiBjbGFzcz1cImRhdGVwaWNrZXItZGVjYWRlc1wiPjx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicrci5oZWFkVGVtcGxhdGUrci5jb250VGVtcGxhdGUrci5mb290VGVtcGxhdGUrJzwvdGFibGU+PC9kaXY+PGRpdiBjbGFzcz1cImRhdGVwaWNrZXItY2VudHVyaWVzXCI+PHRhYmxlIGNsYXNzPVwidGFibGUtY29uZGVuc2VkXCI+JytyLmhlYWRUZW1wbGF0ZStyLmNvbnRUZW1wbGF0ZStyLmZvb3RUZW1wbGF0ZStcIjwvdGFibGU+PC9kaXY+PC9kaXY+XCIsYS5mbi5kYXRlcGlja2VyLkRQR2xvYmFsPXIsYS5mbi5kYXRlcGlja2VyLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5kYXRlcGlja2VyPW0sdGhpc30sYS5mbi5kYXRlcGlja2VyLnZlcnNpb249XCIxLjguMFwiLGEuZm4uZGF0ZXBpY2tlci5kZXByZWNhdGVkPWZ1bmN0aW9uKGEpe3ZhciBiPXdpbmRvdy5jb25zb2xlO2ImJmIud2FybiYmYi53YXJuKFwiREVQUkVDQVRFRDogXCIrYSl9LGEoZG9jdW1lbnQpLm9uKFwiZm9jdXMuZGF0ZXBpY2tlci5kYXRhLWFwaSBjbGljay5kYXRlcGlja2VyLmRhdGEtYXBpXCIsJ1tkYXRhLXByb3ZpZGU9XCJkYXRlcGlja2VyXCJdJyxmdW5jdGlvbihiKXt2YXIgYz1hKHRoaXMpO2MuZGF0YShcImRhdGVwaWNrZXJcIil8fChiLnByZXZlbnREZWZhdWx0KCksbi5jYWxsKGMsXCJzaG93XCIpKX0pLGEoZnVuY3Rpb24oKXtuLmNhbGwoYSgnW2RhdGEtcHJvdmlkZT1cImRhdGVwaWNrZXItaW5saW5lXCJdJykpfSl9KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKiFcbiAqIEJvb3RzdHJhcCB2My40LjEgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgalF1ZXJ5KXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5XCIpOyFmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgZT1qUXVlcnkuZm4uanF1ZXJ5LnNwbGl0KFwiIFwiKVswXS5zcGxpdChcIi5cIik7aWYoZVswXTwyJiZlWzFdPDl8fDE9PWVbMF0mJjk9PWVbMV0mJmVbMl08MXx8MzxlWzBdKXRocm93IG5ldyBFcnJvcihcIkJvb3RzdHJhcCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5IHZlcnNpb24gMS45LjEgb3IgaGlnaGVyLCBidXQgbG93ZXIgdGhhbiB2ZXJzaW9uIDRcIil9KCksZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7bi5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZD1mdW5jdGlvbih0KXt2YXIgZT0hMSxpPXRoaXM7bih0aGlzKS5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixmdW5jdGlvbigpe2U9ITB9KTtyZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe2V8fG4oaSkudHJpZ2dlcihuLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpfSx0KSx0aGlzfSxuKGZ1bmN0aW9uKCl7bi5zdXBwb3J0LnRyYW5zaXRpb249ZnVuY3Rpb24gbygpe3ZhciB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJib290c3RyYXBcIiksZT17V2Via2l0VHJhbnNpdGlvbjpcIndlYmtpdFRyYW5zaXRpb25FbmRcIixNb3pUcmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwiLE9UcmFuc2l0aW9uOlwib1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmRcIix0cmFuc2l0aW9uOlwidHJhbnNpdGlvbmVuZFwifTtmb3IodmFyIGkgaW4gZSlpZih0LnN0eWxlW2ldIT09dW5kZWZpbmVkKXJldHVybntlbmQ6ZVtpXX07cmV0dXJuITF9KCksbi5zdXBwb3J0LnRyYW5zaXRpb24mJihuLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kPXtiaW5kVHlwZTpuLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsZGVsZWdhdGVUeXBlOm4uc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxoYW5kbGU6ZnVuY3Rpb24odCl7aWYobih0LnRhcmdldCkuaXModGhpcykpcmV0dXJuIHQuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0pfSl9KGpRdWVyeSksZnVuY3Rpb24ocyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9J1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsYT1mdW5jdGlvbih0KXtzKHQpLm9uKFwiY2xpY2tcIixlLHRoaXMuY2xvc2UpfTthLlZFUlNJT049XCIzLjQuMVwiLGEuVFJBTlNJVElPTl9EVVJBVElPTj0xNTAsYS5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24odCl7dmFyIGU9cyh0aGlzKSxpPWUuYXR0cihcImRhdGEtdGFyZ2V0XCIpO2l8fChpPShpPWUuYXR0cihcImhyZWZcIikpJiZpLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sXCJcIikpLGk9XCIjXCI9PT1pP1tdOmk7dmFyIG89cyhkb2N1bWVudCkuZmluZChpKTtmdW5jdGlvbiBuKCl7by5kZXRhY2goKS50cmlnZ2VyKFwiY2xvc2VkLmJzLmFsZXJ0XCIpLnJlbW92ZSgpfXQmJnQucHJldmVudERlZmF1bHQoKSxvLmxlbmd0aHx8KG89ZS5jbG9zZXN0KFwiLmFsZXJ0XCIpKSxvLnRyaWdnZXIodD1zLkV2ZW50KFwiY2xvc2UuYnMuYWxlcnRcIikpLHQuaXNEZWZhdWx0UHJldmVudGVkKCl8fChvLnJlbW92ZUNsYXNzKFwiaW5cIikscy5zdXBwb3J0LnRyYW5zaXRpb24mJm8uaGFzQ2xhc3MoXCJmYWRlXCIpP28ub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsbikuZW11bGF0ZVRyYW5zaXRpb25FbmQoYS5UUkFOU0lUSU9OX0RVUkFUSU9OKTpuKCkpfTt2YXIgdD1zLmZuLmFsZXJ0O3MuZm4uYWxlcnQ9ZnVuY3Rpb24gbyhpKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cyh0aGlzKSxlPXQuZGF0YShcImJzLmFsZXJ0XCIpO2V8fHQuZGF0YShcImJzLmFsZXJ0XCIsZT1uZXcgYSh0aGlzKSksXCJzdHJpbmdcIj09dHlwZW9mIGkmJmVbaV0uY2FsbCh0KX0pfSxzLmZuLmFsZXJ0LkNvbnN0cnVjdG9yPWEscy5mbi5hbGVydC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHMuZm4uYWxlcnQ9dCx0aGlzfSxzKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpXCIsZSxhLnByb3RvdHlwZS5jbG9zZSl9KGpRdWVyeSksZnVuY3Rpb24ocyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZnVuY3Rpb24odCxlKXt0aGlzLiRlbGVtZW50PXModCksdGhpcy5vcHRpb25zPXMuZXh0ZW5kKHt9LG4uREVGQVVMVFMsZSksdGhpcy5pc0xvYWRpbmc9ITF9O2Z1bmN0aW9uIGkobyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PXModGhpcyksZT10LmRhdGEoXCJicy5idXR0b25cIiksaT1cIm9iamVjdFwiPT10eXBlb2YgbyYmbztlfHx0LmRhdGEoXCJicy5idXR0b25cIixlPW5ldyBuKHRoaXMsaSkpLFwidG9nZ2xlXCI9PW8/ZS50b2dnbGUoKTpvJiZlLnNldFN0YXRlKG8pfSl9bi5WRVJTSU9OPVwiMy40LjFcIixuLkRFRkFVTFRTPXtsb2FkaW5nVGV4dDpcImxvYWRpbmcuLi5cIn0sbi5wcm90b3R5cGUuc2V0U3RhdGU9ZnVuY3Rpb24odCl7dmFyIGU9XCJkaXNhYmxlZFwiLGk9dGhpcy4kZWxlbWVudCxvPWkuaXMoXCJpbnB1dFwiKT9cInZhbFwiOlwiaHRtbFwiLG49aS5kYXRhKCk7dCs9XCJUZXh0XCIsbnVsbD09bi5yZXNldFRleHQmJmkuZGF0YShcInJlc2V0VGV4dFwiLGlbb10oKSksc2V0VGltZW91dChzLnByb3h5KGZ1bmN0aW9uKCl7aVtvXShudWxsPT1uW3RdP3RoaXMub3B0aW9uc1t0XTpuW3RdKSxcImxvYWRpbmdUZXh0XCI9PXQ/KHRoaXMuaXNMb2FkaW5nPSEwLGkuYWRkQ2xhc3MoZSkuYXR0cihlLGUpLnByb3AoZSwhMCkpOnRoaXMuaXNMb2FkaW5nJiYodGhpcy5pc0xvYWRpbmc9ITEsaS5yZW1vdmVDbGFzcyhlKS5yZW1vdmVBdHRyKGUpLnByb3AoZSwhMSkpfSx0aGlzKSwwKX0sbi5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dmFyIHQ9ITAsZT10aGlzLiRlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nKTtpZihlLmxlbmd0aCl7dmFyIGk9dGhpcy4kZWxlbWVudC5maW5kKFwiaW5wdXRcIik7XCJyYWRpb1wiPT1pLnByb3AoXCJ0eXBlXCIpPyhpLnByb3AoXCJjaGVja2VkXCIpJiYodD0hMSksZS5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSx0aGlzLiRlbGVtZW50LmFkZENsYXNzKFwiYWN0aXZlXCIpKTpcImNoZWNrYm94XCI9PWkucHJvcChcInR5cGVcIikmJihpLnByb3AoXCJjaGVja2VkXCIpIT09dGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSYmKHQ9ITEpLHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIikpLGkucHJvcChcImNoZWNrZWRcIix0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiYWN0aXZlXCIpKSx0JiZpLnRyaWdnZXIoXCJjaGFuZ2VcIil9ZWxzZSB0aGlzLiRlbGVtZW50LmF0dHIoXCJhcmlhLXByZXNzZWRcIiwhdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSksdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKX07dmFyIHQ9cy5mbi5idXR0b247cy5mbi5idXR0b249aSxzLmZuLmJ1dHRvbi5Db25zdHJ1Y3Rvcj1uLHMuZm4uYnV0dG9uLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gcy5mbi5idXR0b249dCx0aGlzfSxzKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmJ1dHRvbi5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJyxmdW5jdGlvbih0KXt2YXIgZT1zKHQudGFyZ2V0KS5jbG9zZXN0KFwiLmJ0blwiKTtpLmNhbGwoZSxcInRvZ2dsZVwiKSxzKHQudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKXx8KHQucHJldmVudERlZmF1bHQoKSxlLmlzKFwiaW5wdXQsYnV0dG9uXCIpP2UudHJpZ2dlcihcImZvY3VzXCIpOmUuZmluZChcImlucHV0OnZpc2libGUsYnV0dG9uOnZpc2libGVcIikuZmlyc3QoKS50cmlnZ2VyKFwiZm9jdXNcIikpfSkub24oXCJmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsZnVuY3Rpb24odCl7cyh0LnRhcmdldCkuY2xvc2VzdChcIi5idG5cIikudG9nZ2xlQ2xhc3MoXCJmb2N1c1wiLC9eZm9jdXMoaW4pPyQvLnRlc3QodC50eXBlKSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihwKXtcInVzZSBzdHJpY3RcIjt2YXIgYz1mdW5jdGlvbih0LGUpe3RoaXMuJGVsZW1lbnQ9cCh0KSx0aGlzLiRpbmRpY2F0b3JzPXRoaXMuJGVsZW1lbnQuZmluZChcIi5jYXJvdXNlbC1pbmRpY2F0b3JzXCIpLHRoaXMub3B0aW9ucz1lLHRoaXMucGF1c2VkPW51bGwsdGhpcy5zbGlkaW5nPW51bGwsdGhpcy5pbnRlcnZhbD1udWxsLHRoaXMuJGFjdGl2ZT1udWxsLHRoaXMuJGl0ZW1zPW51bGwsdGhpcy5vcHRpb25zLmtleWJvYXJkJiZ0aGlzLiRlbGVtZW50Lm9uKFwia2V5ZG93bi5icy5jYXJvdXNlbFwiLHAucHJveHkodGhpcy5rZXlkb3duLHRoaXMpKSxcImhvdmVyXCI9PXRoaXMub3B0aW9ucy5wYXVzZSYmIShcIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSYmdGhpcy4kZWxlbWVudC5vbihcIm1vdXNlZW50ZXIuYnMuY2Fyb3VzZWxcIixwLnByb3h5KHRoaXMucGF1c2UsdGhpcykpLm9uKFwibW91c2VsZWF2ZS5icy5jYXJvdXNlbFwiLHAucHJveHkodGhpcy5jeWNsZSx0aGlzKSl9O2Z1bmN0aW9uIHIobil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PXAodGhpcyksZT10LmRhdGEoXCJicy5jYXJvdXNlbFwiKSxpPXAuZXh0ZW5kKHt9LGMuREVGQVVMVFMsdC5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIG4mJm4pLG89XCJzdHJpbmdcIj09dHlwZW9mIG4/bjppLnNsaWRlO2V8fHQuZGF0YShcImJzLmNhcm91c2VsXCIsZT1uZXcgYyh0aGlzLGkpKSxcIm51bWJlclwiPT10eXBlb2Ygbj9lLnRvKG4pOm8/ZVtvXSgpOmkuaW50ZXJ2YWwmJmUucGF1c2UoKS5jeWNsZSgpfSl9Yy5WRVJTSU9OPVwiMy40LjFcIixjLlRSQU5TSVRJT05fRFVSQVRJT049NjAwLGMuREVGQVVMVFM9e2ludGVydmFsOjVlMyxwYXVzZTpcImhvdmVyXCIsd3JhcDohMCxrZXlib2FyZDohMH0sYy5wcm90b3R5cGUua2V5ZG93bj1mdW5jdGlvbih0KXtpZighL2lucHV0fHRleHRhcmVhL2kudGVzdCh0LnRhcmdldC50YWdOYW1lKSl7c3dpdGNoKHQud2hpY2gpe2Nhc2UgMzc6dGhpcy5wcmV2KCk7YnJlYWs7Y2FzZSAzOTp0aGlzLm5leHQoKTticmVhaztkZWZhdWx0OnJldHVybn10LnByZXZlbnREZWZhdWx0KCl9fSxjLnByb3RvdHlwZS5jeWNsZT1mdW5jdGlvbih0KXtyZXR1cm4gdHx8KHRoaXMucGF1c2VkPSExKSx0aGlzLmludGVydmFsJiZjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpLHRoaXMub3B0aW9ucy5pbnRlcnZhbCYmIXRoaXMucGF1c2VkJiYodGhpcy5pbnRlcnZhbD1zZXRJbnRlcnZhbChwLnByb3h5KHRoaXMubmV4dCx0aGlzKSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwpKSx0aGlzfSxjLnByb3RvdHlwZS5nZXRJdGVtSW5kZXg9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuJGl0ZW1zPXQucGFyZW50KCkuY2hpbGRyZW4oXCIuaXRlbVwiKSx0aGlzLiRpdGVtcy5pbmRleCh0fHx0aGlzLiRhY3RpdmUpfSxjLnByb3RvdHlwZS5nZXRJdGVtRm9yRGlyZWN0aW9uPWZ1bmN0aW9uKHQsZSl7dmFyIGk9dGhpcy5nZXRJdGVtSW5kZXgoZSk7aWYoKFwicHJldlwiPT10JiYwPT09aXx8XCJuZXh0XCI9PXQmJmk9PXRoaXMuJGl0ZW1zLmxlbmd0aC0xKSYmIXRoaXMub3B0aW9ucy53cmFwKXJldHVybiBlO3ZhciBvPShpKyhcInByZXZcIj09dD8tMToxKSkldGhpcy4kaXRlbXMubGVuZ3RoO3JldHVybiB0aGlzLiRpdGVtcy5lcShvKX0sYy5wcm90b3R5cGUudG89ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxpPXRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZT10aGlzLiRlbGVtZW50LmZpbmQoXCIuaXRlbS5hY3RpdmVcIikpO2lmKCEodD50aGlzLiRpdGVtcy5sZW5ndGgtMXx8dDwwKSlyZXR1cm4gdGhpcy5zbGlkaW5nP3RoaXMuJGVsZW1lbnQub25lKFwic2xpZC5icy5jYXJvdXNlbFwiLGZ1bmN0aW9uKCl7ZS50byh0KX0pOmk9PXQ/dGhpcy5wYXVzZSgpLmN5Y2xlKCk6dGhpcy5zbGlkZShpPHQ/XCJuZXh0XCI6XCJwcmV2XCIsdGhpcy4kaXRlbXMuZXEodCkpfSxjLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbih0KXtyZXR1cm4gdHx8KHRoaXMucGF1c2VkPSEwKSx0aGlzLiRlbGVtZW50LmZpbmQoXCIubmV4dCwgLnByZXZcIikubGVuZ3RoJiZwLnN1cHBvcnQudHJhbnNpdGlvbiYmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihwLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpLHRoaXMuY3ljbGUoITApKSx0aGlzLmludGVydmFsPWNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCksdGhpc30sYy5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe2lmKCF0aGlzLnNsaWRpbmcpcmV0dXJuIHRoaXMuc2xpZGUoXCJuZXh0XCIpfSxjLnByb3RvdHlwZS5wcmV2PWZ1bmN0aW9uKCl7aWYoIXRoaXMuc2xpZGluZylyZXR1cm4gdGhpcy5zbGlkZShcInByZXZcIil9LGMucHJvdG90eXBlLnNsaWRlPWZ1bmN0aW9uKHQsZSl7dmFyIGk9dGhpcy4kZWxlbWVudC5maW5kKFwiLml0ZW0uYWN0aXZlXCIpLG89ZXx8dGhpcy5nZXRJdGVtRm9yRGlyZWN0aW9uKHQsaSksbj10aGlzLmludGVydmFsLHM9XCJuZXh0XCI9PXQ/XCJsZWZ0XCI6XCJyaWdodFwiLGE9dGhpcztpZihvLmhhc0NsYXNzKFwiYWN0aXZlXCIpKXJldHVybiB0aGlzLnNsaWRpbmc9ITE7dmFyIHI9b1swXSxsPXAuRXZlbnQoXCJzbGlkZS5icy5jYXJvdXNlbFwiLHtyZWxhdGVkVGFyZ2V0OnIsZGlyZWN0aW9uOnN9KTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIobCksIWwuaXNEZWZhdWx0UHJldmVudGVkKCkpe2lmKHRoaXMuc2xpZGluZz0hMCxuJiZ0aGlzLnBhdXNlKCksdGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpe3RoaXMuJGluZGljYXRvcnMuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7dmFyIGg9cCh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgobyldKTtoJiZoLmFkZENsYXNzKFwiYWN0aXZlXCIpfXZhciBkPXAuRXZlbnQoXCJzbGlkLmJzLmNhcm91c2VsXCIse3JlbGF0ZWRUYXJnZXQ6cixkaXJlY3Rpb246c30pO3JldHVybiBwLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcInNsaWRlXCIpPyhvLmFkZENsYXNzKHQpLFwib2JqZWN0XCI9PXR5cGVvZiBvJiZvLmxlbmd0aCYmb1swXS5vZmZzZXRXaWR0aCxpLmFkZENsYXNzKHMpLG8uYWRkQ2xhc3MocyksaS5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixmdW5jdGlvbigpe28ucmVtb3ZlQ2xhc3MoW3Qsc10uam9pbihcIiBcIikpLmFkZENsYXNzKFwiYWN0aXZlXCIpLGkucmVtb3ZlQ2xhc3MoW1wiYWN0aXZlXCIsc10uam9pbihcIiBcIikpLGEuc2xpZGluZz0hMSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS4kZWxlbWVudC50cmlnZ2VyKGQpfSwwKX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGMuVFJBTlNJVElPTl9EVVJBVElPTikpOihpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLG8uYWRkQ2xhc3MoXCJhY3RpdmVcIiksdGhpcy5zbGlkaW5nPSExLHRoaXMuJGVsZW1lbnQudHJpZ2dlcihkKSksbiYmdGhpcy5jeWNsZSgpLHRoaXN9fTt2YXIgdD1wLmZuLmNhcm91c2VsO3AuZm4uY2Fyb3VzZWw9cixwLmZuLmNhcm91c2VsLkNvbnN0cnVjdG9yPWMscC5mbi5jYXJvdXNlbC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHAuZm4uY2Fyb3VzZWw9dCx0aGlzfTt2YXIgZT1mdW5jdGlvbih0KXt2YXIgZT1wKHRoaXMpLGk9ZS5hdHRyKFwiaHJlZlwiKTtpJiYoaT1pLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sXCJcIikpO3ZhciBvPWUuYXR0cihcImRhdGEtdGFyZ2V0XCIpfHxpLG49cChkb2N1bWVudCkuZmluZChvKTtpZihuLmhhc0NsYXNzKFwiY2Fyb3VzZWxcIikpe3ZhciBzPXAuZXh0ZW5kKHt9LG4uZGF0YSgpLGUuZGF0YSgpKSxhPWUuYXR0cihcImRhdGEtc2xpZGUtdG9cIik7YSYmKHMuaW50ZXJ2YWw9ITEpLHIuY2FsbChuLHMpLGEmJm4uZGF0YShcImJzLmNhcm91c2VsXCIpLnRvKGEpLHQucHJldmVudERlZmF1bHQoKX19O3AoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGlcIixcIltkYXRhLXNsaWRlXVwiLGUpLm9uKFwiY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGlcIixcIltkYXRhLXNsaWRlLXRvXVwiLGUpLHAod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe3AoJ1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXScpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1wKHRoaXMpO3IuY2FsbCh0LHQuZGF0YSgpKX0pfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZnVuY3Rpb24odCxlKXt0aGlzLiRlbGVtZW50PWEodCksdGhpcy5vcHRpb25zPWEuZXh0ZW5kKHt9LHIuREVGQVVMVFMsZSksdGhpcy4kdHJpZ2dlcj1hKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycrdC5pZCsnXCJdLFtkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycrdC5pZCsnXCJdJyksdGhpcy50cmFuc2l0aW9uaW5nPW51bGwsdGhpcy5vcHRpb25zLnBhcmVudD90aGlzLiRwYXJlbnQ9dGhpcy5nZXRQYXJlbnQoKTp0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLiRlbGVtZW50LHRoaXMuJHRyaWdnZXIpLHRoaXMub3B0aW9ucy50b2dnbGUmJnRoaXMudG9nZ2xlKCl9O2Z1bmN0aW9uIG4odCl7dmFyIGUsaT10LmF0dHIoXCJkYXRhLXRhcmdldFwiKXx8KGU9dC5hdHRyKFwiaHJlZlwiKSkmJmUucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLyxcIlwiKTtyZXR1cm4gYShkb2N1bWVudCkuZmluZChpKX1mdW5jdGlvbiBsKG8pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1hKHRoaXMpLGU9dC5kYXRhKFwiYnMuY29sbGFwc2VcIiksaT1hLmV4dGVuZCh7fSxyLkRFRkFVTFRTLHQuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBvJiZvKTshZSYmaS50b2dnbGUmJi9zaG93fGhpZGUvLnRlc3QobykmJihpLnRvZ2dsZT0hMSksZXx8dC5kYXRhKFwiYnMuY29sbGFwc2VcIixlPW5ldyByKHRoaXMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBvJiZlW29dKCl9KX1yLlZFUlNJT049XCIzLjQuMVwiLHIuVFJBTlNJVElPTl9EVVJBVElPTj0zNTAsci5ERUZBVUxUUz17dG9nZ2xlOiEwfSxyLnByb3RvdHlwZS5kaW1lbnNpb249ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcIndpZHRoXCIpP1wid2lkdGhcIjpcImhlaWdodFwifSxyLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7aWYoIXRoaXMudHJhbnNpdGlvbmluZyYmIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJpblwiKSl7dmFyIHQsZT10aGlzLiRwYXJlbnQmJnRoaXMuJHBhcmVudC5jaGlsZHJlbihcIi5wYW5lbFwiKS5jaGlsZHJlbihcIi5pbiwgLmNvbGxhcHNpbmdcIik7aWYoIShlJiZlLmxlbmd0aCYmKHQ9ZS5kYXRhKFwiYnMuY29sbGFwc2VcIikpJiZ0LnRyYW5zaXRpb25pbmcpKXt2YXIgaT1hLkV2ZW50KFwic2hvdy5icy5jb2xsYXBzZVwiKTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIoaSksIWkuaXNEZWZhdWx0UHJldmVudGVkKCkpe2UmJmUubGVuZ3RoJiYobC5jYWxsKGUsXCJoaWRlXCIpLHR8fGUuZGF0YShcImJzLmNvbGxhcHNlXCIsbnVsbCkpO3ZhciBvPXRoaXMuZGltZW5zaW9uKCk7dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImNvbGxhcHNlXCIpLmFkZENsYXNzKFwiY29sbGFwc2luZ1wiKVtvXSgwKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLiR0cmlnZ2VyLnJlbW92ZUNsYXNzKFwiY29sbGFwc2VkXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLHRoaXMudHJhbnNpdGlvbmluZz0xO3ZhciBuPWZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImNvbGxhcHNpbmdcIikuYWRkQ2xhc3MoXCJjb2xsYXBzZSBpblwiKVtvXShcIlwiKSx0aGlzLnRyYW5zaXRpb25pbmc9MCx0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJzaG93bi5icy5jb2xsYXBzZVwiKX07aWYoIWEuc3VwcG9ydC50cmFuc2l0aW9uKXJldHVybiBuLmNhbGwodGhpcyk7dmFyIHM9YS5jYW1lbENhc2UoW1wic2Nyb2xsXCIsb10uam9pbihcIi1cIikpO3RoaXMuJGVsZW1lbnQub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsYS5wcm94eShuLHRoaXMpKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChyLlRSQU5TSVRJT05fRFVSQVRJT04pW29dKHRoaXMuJGVsZW1lbnRbMF1bc10pfX19fSxyLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKCl7aWYoIXRoaXMudHJhbnNpdGlvbmluZyYmdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImluXCIpKXt2YXIgdD1hLkV2ZW50KFwiaGlkZS5icy5jb2xsYXBzZVwiKTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIodCksIXQuaXNEZWZhdWx0UHJldmVudGVkKCkpe3ZhciBlPXRoaXMuZGltZW5zaW9uKCk7dGhpcy4kZWxlbWVudFtlXSh0aGlzLiRlbGVtZW50W2VdKCkpWzBdLm9mZnNldEhlaWdodCx0aGlzLiRlbGVtZW50LmFkZENsYXNzKFwiY29sbGFwc2luZ1wiKS5yZW1vdmVDbGFzcyhcImNvbGxhcHNlIGluXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMuJHRyaWdnZXIuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMSksdGhpcy50cmFuc2l0aW9uaW5nPTE7dmFyIGk9ZnVuY3Rpb24oKXt0aGlzLnRyYW5zaXRpb25pbmc9MCx0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKFwiY29sbGFwc2luZ1wiKS5hZGRDbGFzcyhcImNvbGxhcHNlXCIpLnRyaWdnZXIoXCJoaWRkZW4uYnMuY29sbGFwc2VcIil9O2lmKCFhLnN1cHBvcnQudHJhbnNpdGlvbilyZXR1cm4gaS5jYWxsKHRoaXMpO3RoaXMuJGVsZW1lbnRbZV0oMCkub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsYS5wcm94eShpLHRoaXMpKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChyLlRSQU5TSVRJT05fRFVSQVRJT04pfX19LHIucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3RoaXNbdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImluXCIpP1wiaGlkZVwiOlwic2hvd1wiXSgpfSxyLnByb3RvdHlwZS5nZXRQYXJlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gYShkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMucGFyZW50KS5maW5kKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicrdGhpcy5vcHRpb25zLnBhcmVudCsnXCJdJykuZWFjaChhLnByb3h5KGZ1bmN0aW9uKHQsZSl7dmFyIGk9YShlKTt0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhuKGkpLGkpfSx0aGlzKSkuZW5kKCl9LHIucHJvdG90eXBlLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcz1mdW5jdGlvbih0LGUpe3ZhciBpPXQuaGFzQ2xhc3MoXCJpblwiKTt0LmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsaSksZS50b2dnbGVDbGFzcyhcImNvbGxhcHNlZFwiLCFpKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLGkpfTt2YXIgdD1hLmZuLmNvbGxhcHNlO2EuZm4uY29sbGFwc2U9bCxhLmZuLmNvbGxhcHNlLkNvbnN0cnVjdG9yPXIsYS5mbi5jb2xsYXBzZS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uY29sbGFwc2U9dCx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmNvbGxhcHNlLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJyxmdW5jdGlvbih0KXt2YXIgZT1hKHRoaXMpO2UuYXR0cihcImRhdGEtdGFyZ2V0XCIpfHx0LnByZXZlbnREZWZhdWx0KCk7dmFyIGk9bihlKSxvPWkuZGF0YShcImJzLmNvbGxhcHNlXCIpP1widG9nZ2xlXCI6ZS5kYXRhKCk7bC5jYWxsKGksbyl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjt2YXIgcj0nW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLG89ZnVuY3Rpb24odCl7YSh0KS5vbihcImNsaWNrLmJzLmRyb3Bkb3duXCIsdGhpcy50b2dnbGUpfTtmdW5jdGlvbiBsKHQpe3ZhciBlPXQuYXR0cihcImRhdGEtdGFyZ2V0XCIpO2V8fChlPShlPXQuYXR0cihcImhyZWZcIikpJiYvI1tBLVphLXpdLy50ZXN0KGUpJiZlLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sXCJcIikpO3ZhciBpPVwiI1wiIT09ZT9hKGRvY3VtZW50KS5maW5kKGUpOm51bGw7cmV0dXJuIGkmJmkubGVuZ3RoP2k6dC5wYXJlbnQoKX1mdW5jdGlvbiBzKG8pe28mJjM9PT1vLndoaWNofHwoYShcIi5kcm9wZG93bi1iYWNrZHJvcFwiKS5yZW1vdmUoKSxhKHIpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1hKHRoaXMpLGU9bCh0KSxpPXtyZWxhdGVkVGFyZ2V0OnRoaXN9O2UuaGFzQ2xhc3MoXCJvcGVuXCIpJiYobyYmXCJjbGlja1wiPT1vLnR5cGUmJi9pbnB1dHx0ZXh0YXJlYS9pLnRlc3Qoby50YXJnZXQudGFnTmFtZSkmJmEuY29udGFpbnMoZVswXSxvLnRhcmdldCl8fChlLnRyaWdnZXIobz1hLkV2ZW50KFwiaGlkZS5icy5kcm9wZG93blwiLGkpKSxvLmlzRGVmYXVsdFByZXZlbnRlZCgpfHwodC5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLFwiZmFsc2VcIiksZS5yZW1vdmVDbGFzcyhcIm9wZW5cIikudHJpZ2dlcihhLkV2ZW50KFwiaGlkZGVuLmJzLmRyb3Bkb3duXCIsaSkpKSkpfSkpfW8uVkVSU0lPTj1cIjMuNC4xXCIsby5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKHQpe3ZhciBlPWEodGhpcyk7aWYoIWUuaXMoXCIuZGlzYWJsZWQsIDpkaXNhYmxlZFwiKSl7dmFyIGk9bChlKSxvPWkuaGFzQ2xhc3MoXCJvcGVuXCIpO2lmKHMoKSwhbyl7XCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCYmIWkuY2xvc2VzdChcIi5uYXZiYXItbmF2XCIpLmxlbmd0aCYmYShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKS5hZGRDbGFzcyhcImRyb3Bkb3duLWJhY2tkcm9wXCIpLmluc2VydEFmdGVyKGEodGhpcykpLm9uKFwiY2xpY2tcIixzKTt2YXIgbj17cmVsYXRlZFRhcmdldDp0aGlzfTtpZihpLnRyaWdnZXIodD1hLkV2ZW50KFwic2hvdy5icy5kcm9wZG93blwiLG4pKSx0LmlzRGVmYXVsdFByZXZlbnRlZCgpKXJldHVybjtlLnRyaWdnZXIoXCJmb2N1c1wiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLFwidHJ1ZVwiKSxpLnRvZ2dsZUNsYXNzKFwib3BlblwiKS50cmlnZ2VyKGEuRXZlbnQoXCJzaG93bi5icy5kcm9wZG93blwiLG4pKX1yZXR1cm4hMX19LG8ucHJvdG90eXBlLmtleWRvd249ZnVuY3Rpb24odCl7aWYoLygzOHw0MHwyN3wzMikvLnRlc3QodC53aGljaCkmJiEvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KHQudGFyZ2V0LnRhZ05hbWUpKXt2YXIgZT1hKHRoaXMpO2lmKHQucHJldmVudERlZmF1bHQoKSx0LnN0b3BQcm9wYWdhdGlvbigpLCFlLmlzKFwiLmRpc2FibGVkLCA6ZGlzYWJsZWRcIikpe3ZhciBpPWwoZSksbz1pLmhhc0NsYXNzKFwib3BlblwiKTtpZighbyYmMjchPXQud2hpY2h8fG8mJjI3PT10LndoaWNoKXJldHVybiAyNz09dC53aGljaCYmaS5maW5kKHIpLnRyaWdnZXIoXCJmb2N1c1wiKSxlLnRyaWdnZXIoXCJjbGlja1wiKTt2YXIgbj1pLmZpbmQoXCIuZHJvcGRvd24tbWVudSBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGFcIik7aWYobi5sZW5ndGgpe3ZhciBzPW4uaW5kZXgodC50YXJnZXQpOzM4PT10LndoaWNoJiYwPHMmJnMtLSw0MD09dC53aGljaCYmczxuLmxlbmd0aC0xJiZzKyssfnN8fChzPTApLG4uZXEocykudHJpZ2dlcihcImZvY3VzXCIpfX19fTt2YXIgdD1hLmZuLmRyb3Bkb3duO2EuZm4uZHJvcGRvd249ZnVuY3Rpb24gZShpKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9YSh0aGlzKSxlPXQuZGF0YShcImJzLmRyb3Bkb3duXCIpO2V8fHQuZGF0YShcImJzLmRyb3Bkb3duXCIsZT1uZXcgbyh0aGlzKSksXCJzdHJpbmdcIj09dHlwZW9mIGkmJmVbaV0uY2FsbCh0KX0pfSxhLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yPW8sYS5mbi5kcm9wZG93bi5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uZHJvcGRvd249dCx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIscykub24oXCJjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaVwiLFwiLmRyb3Bkb3duIGZvcm1cIixmdW5jdGlvbih0KXt0LnN0b3BQcm9wYWdhdGlvbigpfSkub24oXCJjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaVwiLHIsby5wcm90b3R5cGUudG9nZ2xlKS5vbihcImtleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGlcIixyLG8ucHJvdG90eXBlLmtleWRvd24pLm9uKFwia2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaVwiLFwiLmRyb3Bkb3duLW1lbnVcIixvLnByb3RvdHlwZS5rZXlkb3duKX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjt2YXIgcz1mdW5jdGlvbih0LGUpe3RoaXMub3B0aW9ucz1lLHRoaXMuJGJvZHk9YShkb2N1bWVudC5ib2R5KSx0aGlzLiRlbGVtZW50PWEodCksdGhpcy4kZGlhbG9nPXRoaXMuJGVsZW1lbnQuZmluZChcIi5tb2RhbC1kaWFsb2dcIiksdGhpcy4kYmFja2Ryb3A9bnVsbCx0aGlzLmlzU2hvd249bnVsbCx0aGlzLm9yaWdpbmFsQm9keVBhZD1udWxsLHRoaXMuc2Nyb2xsYmFyV2lkdGg9MCx0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2s9ITEsdGhpcy5maXhlZENvbnRlbnQ9XCIubmF2YmFyLWZpeGVkLXRvcCwgLm5hdmJhci1maXhlZC1ib3R0b21cIix0aGlzLm9wdGlvbnMucmVtb3RlJiZ0aGlzLiRlbGVtZW50LmZpbmQoXCIubW9kYWwtY29udGVudFwiKS5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsYS5wcm94eShmdW5jdGlvbigpe3RoaXMuJGVsZW1lbnQudHJpZ2dlcihcImxvYWRlZC5icy5tb2RhbFwiKX0sdGhpcykpfTtmdW5jdGlvbiByKG8sbil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PWEodGhpcyksZT10LmRhdGEoXCJicy5tb2RhbFwiKSxpPWEuZXh0ZW5kKHt9LHMuREVGQVVMVFMsdC5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIG8mJm8pO2V8fHQuZGF0YShcImJzLm1vZGFsXCIsZT1uZXcgcyh0aGlzLGkpKSxcInN0cmluZ1wiPT10eXBlb2Ygbz9lW29dKG4pOmkuc2hvdyYmZS5zaG93KG4pfSl9cy5WRVJTSU9OPVwiMy40LjFcIixzLlRSQU5TSVRJT05fRFVSQVRJT049MzAwLHMuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTj0xNTAscy5ERUZBVUxUUz17YmFja2Ryb3A6ITAsa2V5Ym9hcmQ6ITAsc2hvdzohMH0scy5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmlzU2hvd24/dGhpcy5oaWRlKCk6dGhpcy5zaG93KHQpfSxzLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKGkpe3ZhciBvPXRoaXMsdD1hLkV2ZW50KFwic2hvdy5icy5tb2RhbFwiLHtyZWxhdGVkVGFyZ2V0Oml9KTt0aGlzLiRlbGVtZW50LnRyaWdnZXIodCksdGhpcy5pc1Nob3dufHx0LmlzRGVmYXVsdFByZXZlbnRlZCgpfHwodGhpcy5pc1Nob3duPSEwLHRoaXMuY2hlY2tTY3JvbGxiYXIoKSx0aGlzLnNldFNjcm9sbGJhcigpLHRoaXMuJGJvZHkuYWRkQ2xhc3MoXCJtb2RhbC1vcGVuXCIpLHRoaXMuZXNjYXBlKCksdGhpcy5yZXNpemUoKSx0aGlzLiRlbGVtZW50Lm9uKFwiY2xpY2suZGlzbWlzcy5icy5tb2RhbFwiLCdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLGEucHJveHkodGhpcy5oaWRlLHRoaXMpKSx0aGlzLiRkaWFsb2cub24oXCJtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7by4kZWxlbWVudC5vbmUoXCJtb3VzZXVwLmRpc21pc3MuYnMubW9kYWxcIixmdW5jdGlvbih0KXthKHQudGFyZ2V0KS5pcyhvLiRlbGVtZW50KSYmKG8uaWdub3JlQmFja2Ryb3BDbGljaz0hMCl9KX0pLHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24oKXt2YXIgdD1hLnN1cHBvcnQudHJhbnNpdGlvbiYmby4kZWxlbWVudC5oYXNDbGFzcyhcImZhZGVcIik7by4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGh8fG8uJGVsZW1lbnQuYXBwZW5kVG8oby4kYm9keSksby4kZWxlbWVudC5zaG93KCkuc2Nyb2xsVG9wKDApLG8uYWRqdXN0RGlhbG9nKCksdCYmby4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCxvLiRlbGVtZW50LmFkZENsYXNzKFwiaW5cIiksby5lbmZvcmNlRm9jdXMoKTt2YXIgZT1hLkV2ZW50KFwic2hvd24uYnMubW9kYWxcIix7cmVsYXRlZFRhcmdldDppfSk7dD9vLiRkaWFsb2cub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZnVuY3Rpb24oKXtvLiRlbGVtZW50LnRyaWdnZXIoXCJmb2N1c1wiKS50cmlnZ2VyKGUpfSkuZW11bGF0ZVRyYW5zaXRpb25FbmQocy5UUkFOU0lUSU9OX0RVUkFUSU9OKTpvLiRlbGVtZW50LnRyaWdnZXIoXCJmb2N1c1wiKS50cmlnZ2VyKGUpfSkpfSxzLnByb3RvdHlwZS5oaWRlPWZ1bmN0aW9uKHQpe3QmJnQucHJldmVudERlZmF1bHQoKSx0PWEuRXZlbnQoXCJoaWRlLmJzLm1vZGFsXCIpLHRoaXMuJGVsZW1lbnQudHJpZ2dlcih0KSx0aGlzLmlzU2hvd24mJiF0LmlzRGVmYXVsdFByZXZlbnRlZCgpJiYodGhpcy5pc1Nob3duPSExLHRoaXMuZXNjYXBlKCksdGhpcy5yZXNpemUoKSxhKGRvY3VtZW50KS5vZmYoXCJmb2N1c2luLmJzLm1vZGFsXCIpLHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJpblwiKS5vZmYoXCJjbGljay5kaXNtaXNzLmJzLm1vZGFsXCIpLm9mZihcIm1vdXNldXAuZGlzbWlzcy5icy5tb2RhbFwiKSx0aGlzLiRkaWFsb2cub2ZmKFwibW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWxcIiksYS5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJmYWRlXCIpP3RoaXMuJGVsZW1lbnQub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsYS5wcm94eSh0aGlzLmhpZGVNb2RhbCx0aGlzKSkuZW11bGF0ZVRyYW5zaXRpb25FbmQocy5UUkFOU0lUSU9OX0RVUkFUSU9OKTp0aGlzLmhpZGVNb2RhbCgpKX0scy5wcm90b3R5cGUuZW5mb3JjZUZvY3VzPWZ1bmN0aW9uKCl7YShkb2N1bWVudCkub2ZmKFwiZm9jdXNpbi5icy5tb2RhbFwiKS5vbihcImZvY3VzaW4uYnMubW9kYWxcIixhLnByb3h5KGZ1bmN0aW9uKHQpe2RvY3VtZW50PT09dC50YXJnZXR8fHRoaXMuJGVsZW1lbnRbMF09PT10LnRhcmdldHx8dGhpcy4kZWxlbWVudC5oYXModC50YXJnZXQpLmxlbmd0aHx8dGhpcy4kZWxlbWVudC50cmlnZ2VyKFwiZm9jdXNcIil9LHRoaXMpKX0scy5wcm90b3R5cGUuZXNjYXBlPWZ1bmN0aW9uKCl7dGhpcy5pc1Nob3duJiZ0aGlzLm9wdGlvbnMua2V5Ym9hcmQ/dGhpcy4kZWxlbWVudC5vbihcImtleWRvd24uZGlzbWlzcy5icy5tb2RhbFwiLGEucHJveHkoZnVuY3Rpb24odCl7Mjc9PXQud2hpY2gmJnRoaXMuaGlkZSgpfSx0aGlzKSk6dGhpcy5pc1Nob3dufHx0aGlzLiRlbGVtZW50Lm9mZihcImtleWRvd24uZGlzbWlzcy5icy5tb2RhbFwiKX0scy5wcm90b3R5cGUucmVzaXplPWZ1bmN0aW9uKCl7dGhpcy5pc1Nob3duP2Eod2luZG93KS5vbihcInJlc2l6ZS5icy5tb2RhbFwiLGEucHJveHkodGhpcy5oYW5kbGVVcGRhdGUsdGhpcykpOmEod2luZG93KS5vZmYoXCJyZXNpemUuYnMubW9kYWxcIil9LHMucHJvdG90eXBlLmhpZGVNb2RhbD1mdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy4kZWxlbWVudC5oaWRlKCksdGhpcy5iYWNrZHJvcChmdW5jdGlvbigpe3QuJGJvZHkucmVtb3ZlQ2xhc3MoXCJtb2RhbC1vcGVuXCIpLHQucmVzZXRBZGp1c3RtZW50cygpLHQucmVzZXRTY3JvbGxiYXIoKSx0LiRlbGVtZW50LnRyaWdnZXIoXCJoaWRkZW4uYnMubW9kYWxcIil9KX0scy5wcm90b3R5cGUucmVtb3ZlQmFja2Ryb3A9ZnVuY3Rpb24oKXt0aGlzLiRiYWNrZHJvcCYmdGhpcy4kYmFja2Ryb3AucmVtb3ZlKCksdGhpcy4kYmFja2Ryb3A9bnVsbH0scy5wcm90b3R5cGUuYmFja2Ryb3A9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxpPXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJmYWRlXCIpP1wiZmFkZVwiOlwiXCI7aWYodGhpcy5pc1Nob3duJiZ0aGlzLm9wdGlvbnMuYmFja2Ryb3Ape3ZhciBvPWEuc3VwcG9ydC50cmFuc2l0aW9uJiZpO2lmKHRoaXMuJGJhY2tkcm9wPWEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSkuYWRkQ2xhc3MoXCJtb2RhbC1iYWNrZHJvcCBcIitpKS5hcHBlbmRUbyh0aGlzLiRib2R5KSx0aGlzLiRlbGVtZW50Lm9uKFwiY2xpY2suZGlzbWlzcy5icy5tb2RhbFwiLGEucHJveHkoZnVuY3Rpb24odCl7dGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrP3RoaXMuaWdub3JlQmFja2Ryb3BDbGljaz0hMTp0LnRhcmdldD09PXQuY3VycmVudFRhcmdldCYmKFwic3RhdGljXCI9PXRoaXMub3B0aW9ucy5iYWNrZHJvcD90aGlzLiRlbGVtZW50WzBdLmZvY3VzKCk6dGhpcy5oaWRlKCkpfSx0aGlzKSksbyYmdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGgsdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoXCJpblwiKSwhdClyZXR1cm47bz90aGlzLiRiYWNrZHJvcC5vbmUoXCJic1RyYW5zaXRpb25FbmRcIix0KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChzLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pOnQoKX1lbHNlIGlmKCF0aGlzLmlzU2hvd24mJnRoaXMuJGJhY2tkcm9wKXt0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcyhcImluXCIpO3ZhciBuPWZ1bmN0aW9uKCl7ZS5yZW1vdmVCYWNrZHJvcCgpLHQmJnQoKX07YS5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJmYWRlXCIpP3RoaXMuJGJhY2tkcm9wLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLG4pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHMuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTik6bigpfWVsc2UgdCYmdCgpfSxzLnByb3RvdHlwZS5oYW5kbGVVcGRhdGU9ZnVuY3Rpb24oKXt0aGlzLmFkanVzdERpYWxvZygpfSxzLnByb3RvdHlwZS5hZGp1c3REaWFsb2c9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodD5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O3RoaXMuJGVsZW1lbnQuY3NzKHtwYWRkaW5nTGVmdDohdGhpcy5ib2R5SXNPdmVyZmxvd2luZyYmdD90aGlzLnNjcm9sbGJhcldpZHRoOlwiXCIscGFkZGluZ1JpZ2h0OnRoaXMuYm9keUlzT3ZlcmZsb3dpbmcmJiF0P3RoaXMuc2Nyb2xsYmFyV2lkdGg6XCJcIn0pfSxzLnByb3RvdHlwZS5yZXNldEFkanVzdG1lbnRzPWZ1bmN0aW9uKCl7dGhpcy4kZWxlbWVudC5jc3Moe3BhZGRpbmdMZWZ0OlwiXCIscGFkZGluZ1JpZ2h0OlwiXCJ9KX0scy5wcm90b3R5cGUuY2hlY2tTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgdD13aW5kb3cuaW5uZXJXaWR0aDtpZighdCl7dmFyIGU9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3Q9ZS5yaWdodC1NYXRoLmFicyhlLmxlZnQpfXRoaXMuYm9keUlzT3ZlcmZsb3dpbmc9ZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDx0LHRoaXMuc2Nyb2xsYmFyV2lkdGg9dGhpcy5tZWFzdXJlU2Nyb2xsYmFyKCl9LHMucHJvdG90eXBlLnNldFNjcm9sbGJhcj1mdW5jdGlvbigpe3ZhciB0PXBhcnNlSW50KHRoaXMuJGJvZHkuY3NzKFwicGFkZGluZy1yaWdodFwiKXx8MCwxMCk7dGhpcy5vcmlnaW5hbEJvZHlQYWQ9ZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHR8fFwiXCI7dmFyIG49dGhpcy5zY3JvbGxiYXJXaWR0aDt0aGlzLmJvZHlJc092ZXJmbG93aW5nJiYodGhpcy4kYm9keS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsdCtuKSxhKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uKHQsZSl7dmFyIGk9ZS5zdHlsZS5wYWRkaW5nUmlnaHQsbz1hKGUpLmNzcyhcInBhZGRpbmctcmlnaHRcIik7YShlKS5kYXRhKFwicGFkZGluZy1yaWdodFwiLGkpLmNzcyhcInBhZGRpbmctcmlnaHRcIixwYXJzZUZsb2F0KG8pK24rXCJweFwiKX0pKX0scy5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt0aGlzLiRib2R5LmNzcyhcInBhZGRpbmctcmlnaHRcIix0aGlzLm9yaWdpbmFsQm9keVBhZCksYSh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbih0LGUpe3ZhciBpPWEoZSkuZGF0YShcInBhZGRpbmctcmlnaHRcIik7YShlKS5yZW1vdmVEYXRhKFwicGFkZGluZy1yaWdodFwiKSxlLnN0eWxlLnBhZGRpbmdSaWdodD1pfHxcIlwifSl9LHMucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3QuY2xhc3NOYW1lPVwibW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmVcIix0aGlzLiRib2R5LmFwcGVuZCh0KTt2YXIgZT10Lm9mZnNldFdpZHRoLXQuY2xpZW50V2lkdGg7cmV0dXJuIHRoaXMuJGJvZHlbMF0ucmVtb3ZlQ2hpbGQodCksZX07dmFyIHQ9YS5mbi5tb2RhbDthLmZuLm1vZGFsPXIsYS5mbi5tb2RhbC5Db25zdHJ1Y3Rvcj1zLGEuZm4ubW9kYWwubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLm1vZGFsPXQsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5tb2RhbC5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsZnVuY3Rpb24odCl7dmFyIGU9YSh0aGlzKSxpPWUuYXR0cihcImhyZWZcIiksbz1lLmF0dHIoXCJkYXRhLXRhcmdldFwiKXx8aSYmaS5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLFwiXCIpLG49YShkb2N1bWVudCkuZmluZChvKSxzPW4uZGF0YShcImJzLm1vZGFsXCIpP1widG9nZ2xlXCI6YS5leHRlbmQoe3JlbW90ZTohLyMvLnRlc3QoaSkmJml9LG4uZGF0YSgpLGUuZGF0YSgpKTtlLmlzKFwiYVwiKSYmdC5wcmV2ZW50RGVmYXVsdCgpLG4ub25lKFwic2hvdy5icy5tb2RhbFwiLGZ1bmN0aW9uKHQpe3QuaXNEZWZhdWx0UHJldmVudGVkKCl8fG4ub25lKFwiaGlkZGVuLmJzLm1vZGFsXCIsZnVuY3Rpb24oKXtlLmlzKFwiOnZpc2libGVcIikmJmUudHJpZ2dlcihcImZvY3VzXCIpfSl9KSxyLmNhbGwobixzLHRoaXMpfSl9KGpRdWVyeSksZnVuY3Rpb24oZyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIG89W1wic2FuaXRpemVcIixcIndoaXRlTGlzdFwiLFwic2FuaXRpemVGblwiXSxhPVtcImJhY2tncm91bmRcIixcImNpdGVcIixcImhyZWZcIixcIml0ZW10eXBlXCIsXCJsb25nZGVzY1wiLFwicG9zdGVyXCIsXCJzcmNcIixcInhsaW5rOmhyZWZcIl0sdD17XCIqXCI6W1wiY2xhc3NcIixcImRpclwiLFwiaWRcIixcImxhbmdcIixcInJvbGVcIiwvXmFyaWEtW1xcdy1dKiQvaV0sYTpbXCJ0YXJnZXRcIixcImhyZWZcIixcInRpdGxlXCIsXCJyZWxcIl0sYXJlYTpbXSxiOltdLGJyOltdLGNvbDpbXSxjb2RlOltdLGRpdjpbXSxlbTpbXSxocjpbXSxoMTpbXSxoMjpbXSxoMzpbXSxoNDpbXSxoNTpbXSxoNjpbXSxpOltdLGltZzpbXCJzcmNcIixcImFsdFwiLFwidGl0bGVcIixcIndpZHRoXCIsXCJoZWlnaHRcIl0sbGk6W10sb2w6W10scDpbXSxwcmU6W10sczpbXSxzbWFsbDpbXSxzcGFuOltdLHN1YjpbXSxzdXA6W10sc3Ryb25nOltdLHU6W10sdWw6W119LHI9L14oPzooPzpodHRwcz98bWFpbHRvfGZ0cHx0ZWx8ZmlsZSk6fFteJjovPyNdKig/OlsvPyNdfCQpKS9naSxsPS9eZGF0YTooPzppbWFnZVxcLyg/OmJtcHxnaWZ8anBlZ3xqcGd8cG5nfHRpZmZ8d2VicCl8dmlkZW9cXC8oPzptcGVnfG1wNHxvZ2d8d2VibSl8YXVkaW9cXC8oPzptcDN8b2dhfG9nZ3xvcHVzKSk7YmFzZTY0LFthLXowLTkrL10rPSokL2k7ZnVuY3Rpb24gdSh0LGUpe3ZhciBpPXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtpZigtMSE9PWcuaW5BcnJheShpLGUpKXJldHVybi0xPT09Zy5pbkFycmF5KGksYSl8fEJvb2xlYW4odC5ub2RlVmFsdWUubWF0Y2gocil8fHQubm9kZVZhbHVlLm1hdGNoKGwpKTtmb3IodmFyIG89ZyhlKS5maWx0ZXIoZnVuY3Rpb24odCxlKXtyZXR1cm4gZSBpbnN0YW5jZW9mIFJlZ0V4cH0pLG49MCxzPW8ubGVuZ3RoO248cztuKyspaWYoaS5tYXRjaChvW25dKSlyZXR1cm4hMDtyZXR1cm4hMX1mdW5jdGlvbiBuKHQsZSxpKXtpZigwPT09dC5sZW5ndGgpcmV0dXJuIHQ7aWYoaSYmXCJmdW5jdGlvblwiPT10eXBlb2YgaSlyZXR1cm4gaSh0KTtpZighZG9jdW1lbnQuaW1wbGVtZW50YXRpb258fCFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQpcmV0dXJuIHQ7dmFyIG89ZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFwic2FuaXRpemF0aW9uXCIpO28uYm9keS5pbm5lckhUTUw9dDtmb3IodmFyIG49Zy5tYXAoZSxmdW5jdGlvbih0LGUpe3JldHVybiBlfSkscz1nKG8uYm9keSkuZmluZChcIipcIiksYT0wLHI9cy5sZW5ndGg7YTxyO2ErKyl7dmFyIGw9c1thXSxoPWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtpZigtMSE9PWcuaW5BcnJheShoLG4pKWZvcih2YXIgZD1nLm1hcChsLmF0dHJpYnV0ZXMsZnVuY3Rpb24odCl7cmV0dXJuIHR9KSxwPVtdLmNvbmNhdChlW1wiKlwiXXx8W10sZVtoXXx8W10pLGM9MCxmPWQubGVuZ3RoO2M8ZjtjKyspdShkW2NdLHApfHxsLnJlbW92ZUF0dHJpYnV0ZShkW2NdLm5vZGVOYW1lKTtlbHNlIGwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChsKX1yZXR1cm4gby5ib2R5LmlubmVySFRNTH12YXIgbT1mdW5jdGlvbih0LGUpe3RoaXMudHlwZT1udWxsLHRoaXMub3B0aW9ucz1udWxsLHRoaXMuZW5hYmxlZD1udWxsLHRoaXMudGltZW91dD1udWxsLHRoaXMuaG92ZXJTdGF0ZT1udWxsLHRoaXMuJGVsZW1lbnQ9bnVsbCx0aGlzLmluU3RhdGU9bnVsbCx0aGlzLmluaXQoXCJ0b29sdGlwXCIsdCxlKX07bS5WRVJTSU9OPVwiMy40LjFcIixtLlRSQU5TSVRJT05fRFVSQVRJT049MTUwLG0uREVGQVVMVFM9e2FuaW1hdGlvbjohMCxwbGFjZW1lbnQ6XCJ0b3BcIixzZWxlY3RvcjohMSx0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLHRyaWdnZXI6XCJob3ZlciBmb2N1c1wiLHRpdGxlOlwiXCIsZGVsYXk6MCxodG1sOiExLGNvbnRhaW5lcjohMSx2aWV3cG9ydDp7c2VsZWN0b3I6XCJib2R5XCIscGFkZGluZzowfSxzYW5pdGl6ZTohMCxzYW5pdGl6ZUZuOm51bGwsd2hpdGVMaXN0OnR9LG0ucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24odCxlLGkpe2lmKHRoaXMuZW5hYmxlZD0hMCx0aGlzLnR5cGU9dCx0aGlzLiRlbGVtZW50PWcoZSksdGhpcy5vcHRpb25zPXRoaXMuZ2V0T3B0aW9ucyhpKSx0aGlzLiR2aWV3cG9ydD10aGlzLm9wdGlvbnMudmlld3BvcnQmJmcoZG9jdW1lbnQpLmZpbmQoZy5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy52aWV3cG9ydCk/dGhpcy5vcHRpb25zLnZpZXdwb3J0LmNhbGwodGhpcyx0aGlzLiRlbGVtZW50KTp0aGlzLm9wdGlvbnMudmlld3BvcnQuc2VsZWN0b3J8fHRoaXMub3B0aW9ucy52aWV3cG9ydCksdGhpcy5pblN0YXRlPXtjbGljazohMSxob3ZlcjohMSxmb2N1czohMX0sdGhpcy4kZWxlbWVudFswXWluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3ImJiF0aGlzLm9wdGlvbnMuc2VsZWN0b3IpdGhyb3cgbmV3IEVycm9yKFwiYHNlbGVjdG9yYCBvcHRpb24gbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgXCIrdGhpcy50eXBlK1wiIG9uIHRoZSB3aW5kb3cuZG9jdW1lbnQgb2JqZWN0IVwiKTtmb3IodmFyIG89dGhpcy5vcHRpb25zLnRyaWdnZXIuc3BsaXQoXCIgXCIpLG49by5sZW5ndGg7bi0tOyl7dmFyIHM9b1tuXTtpZihcImNsaWNrXCI9PXMpdGhpcy4kZWxlbWVudC5vbihcImNsaWNrLlwiK3RoaXMudHlwZSx0aGlzLm9wdGlvbnMuc2VsZWN0b3IsZy5wcm94eSh0aGlzLnRvZ2dsZSx0aGlzKSk7ZWxzZSBpZihcIm1hbnVhbFwiIT1zKXt2YXIgYT1cImhvdmVyXCI9PXM/XCJtb3VzZWVudGVyXCI6XCJmb2N1c2luXCIscj1cImhvdmVyXCI9PXM/XCJtb3VzZWxlYXZlXCI6XCJmb2N1c291dFwiO3RoaXMuJGVsZW1lbnQub24oYStcIi5cIit0aGlzLnR5cGUsdGhpcy5vcHRpb25zLnNlbGVjdG9yLGcucHJveHkodGhpcy5lbnRlcix0aGlzKSksdGhpcy4kZWxlbWVudC5vbihyK1wiLlwiK3RoaXMudHlwZSx0aGlzLm9wdGlvbnMuc2VsZWN0b3IsZy5wcm94eSh0aGlzLmxlYXZlLHRoaXMpKX19dGhpcy5vcHRpb25zLnNlbGVjdG9yP3RoaXMuX29wdGlvbnM9Zy5leHRlbmQoe30sdGhpcy5vcHRpb25zLHt0cmlnZ2VyOlwibWFudWFsXCIsc2VsZWN0b3I6XCJcIn0pOnRoaXMuZml4VGl0bGUoKX0sbS5wcm90b3R5cGUuZ2V0RGVmYXVsdHM9ZnVuY3Rpb24oKXtyZXR1cm4gbS5ERUZBVUxUU30sbS5wcm90b3R5cGUuZ2V0T3B0aW9ucz1mdW5jdGlvbih0KXt2YXIgZT10aGlzLiRlbGVtZW50LmRhdGEoKTtmb3IodmFyIGkgaW4gZSllLmhhc093blByb3BlcnR5KGkpJiYtMSE9PWcuaW5BcnJheShpLG8pJiZkZWxldGUgZVtpXTtyZXR1cm4odD1nLmV4dGVuZCh7fSx0aGlzLmdldERlZmF1bHRzKCksZSx0KSkuZGVsYXkmJlwibnVtYmVyXCI9PXR5cGVvZiB0LmRlbGF5JiYodC5kZWxheT17c2hvdzp0LmRlbGF5LGhpZGU6dC5kZWxheX0pLHQuc2FuaXRpemUmJih0LnRlbXBsYXRlPW4odC50ZW1wbGF0ZSx0LndoaXRlTGlzdCx0LnNhbml0aXplRm4pKSx0fSxtLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnM9ZnVuY3Rpb24oKXt2YXIgaT17fSxvPXRoaXMuZ2V0RGVmYXVsdHMoKTtyZXR1cm4gdGhpcy5fb3B0aW9ucyYmZy5lYWNoKHRoaXMuX29wdGlvbnMsZnVuY3Rpb24odCxlKXtvW3RdIT1lJiYoaVt0XT1lKX0pLGl9LG0ucHJvdG90eXBlLmVudGVyPWZ1bmN0aW9uKHQpe3ZhciBlPXQgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yP3Q6Zyh0LmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUpO2lmKGV8fChlPW5ldyB0aGlzLmNvbnN0cnVjdG9yKHQuY3VycmVudFRhcmdldCx0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKSxnKHQuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSxlKSksdCBpbnN0YW5jZW9mIGcuRXZlbnQmJihlLmluU3RhdGVbXCJmb2N1c2luXCI9PXQudHlwZT9cImZvY3VzXCI6XCJob3ZlclwiXT0hMCksZS50aXAoKS5oYXNDbGFzcyhcImluXCIpfHxcImluXCI9PWUuaG92ZXJTdGF0ZSllLmhvdmVyU3RhdGU9XCJpblwiO2Vsc2V7aWYoY2xlYXJUaW1lb3V0KGUudGltZW91dCksZS5ob3ZlclN0YXRlPVwiaW5cIiwhZS5vcHRpb25zLmRlbGF5fHwhZS5vcHRpb25zLmRlbGF5LnNob3cpcmV0dXJuIGUuc2hvdygpO2UudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XCJpblwiPT1lLmhvdmVyU3RhdGUmJmUuc2hvdygpfSxlLm9wdGlvbnMuZGVsYXkuc2hvdyl9fSxtLnByb3RvdHlwZS5pc0luU3RhdGVUcnVlPWZ1bmN0aW9uKCl7Zm9yKHZhciB0IGluIHRoaXMuaW5TdGF0ZSlpZih0aGlzLmluU3RhdGVbdF0pcmV0dXJuITA7cmV0dXJuITF9LG0ucHJvdG90eXBlLmxlYXZlPWZ1bmN0aW9uKHQpe3ZhciBlPXQgaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yP3Q6Zyh0LmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUpO2lmKGV8fChlPW5ldyB0aGlzLmNvbnN0cnVjdG9yKHQuY3VycmVudFRhcmdldCx0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKSxnKHQuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSxlKSksdCBpbnN0YW5jZW9mIGcuRXZlbnQmJihlLmluU3RhdGVbXCJmb2N1c291dFwiPT10LnR5cGU/XCJmb2N1c1wiOlwiaG92ZXJcIl09ITEpLCFlLmlzSW5TdGF0ZVRydWUoKSl7aWYoY2xlYXJUaW1lb3V0KGUudGltZW91dCksZS5ob3ZlclN0YXRlPVwib3V0XCIsIWUub3B0aW9ucy5kZWxheXx8IWUub3B0aW9ucy5kZWxheS5oaWRlKXJldHVybiBlLmhpZGUoKTtlLnRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1wib3V0XCI9PWUuaG92ZXJTdGF0ZSYmZS5oaWRlKCl9LGUub3B0aW9ucy5kZWxheS5oaWRlKX19LG0ucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXt2YXIgdD1nLkV2ZW50KFwic2hvdy5icy5cIit0aGlzLnR5cGUpO2lmKHRoaXMuaGFzQ29udGVudCgpJiZ0aGlzLmVuYWJsZWQpe3RoaXMuJGVsZW1lbnQudHJpZ2dlcih0KTt2YXIgZT1nLmNvbnRhaW5zKHRoaXMuJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsdGhpcy4kZWxlbWVudFswXSk7aWYodC5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8IWUpcmV0dXJuO3ZhciBpPXRoaXMsbz10aGlzLnRpcCgpLG49dGhpcy5nZXRVSUQodGhpcy50eXBlKTt0aGlzLnNldENvbnRlbnQoKSxvLmF0dHIoXCJpZFwiLG4pLHRoaXMuJGVsZW1lbnQuYXR0cihcImFyaWEtZGVzY3JpYmVkYnlcIixuKSx0aGlzLm9wdGlvbnMuYW5pbWF0aW9uJiZvLmFkZENsYXNzKFwiZmFkZVwiKTt2YXIgcz1cImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50P3RoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLG9bMF0sdGhpcy4kZWxlbWVudFswXSk6dGhpcy5vcHRpb25zLnBsYWNlbWVudCxhPS9cXHM/YXV0bz9cXHM/L2kscj1hLnRlc3Qocyk7ciYmKHM9cy5yZXBsYWNlKGEsXCJcIil8fFwidG9wXCIpLG8uZGV0YWNoKCkuY3NzKHt0b3A6MCxsZWZ0OjAsZGlzcGxheTpcImJsb2NrXCJ9KS5hZGRDbGFzcyhzKS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlLHRoaXMpLHRoaXMub3B0aW9ucy5jb250YWluZXI/by5hcHBlbmRUbyhnKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5jb250YWluZXIpKTpvLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpLHRoaXMuJGVsZW1lbnQudHJpZ2dlcihcImluc2VydGVkLmJzLlwiK3RoaXMudHlwZSk7dmFyIGw9dGhpcy5nZXRQb3NpdGlvbigpLGg9b1swXS5vZmZzZXRXaWR0aCxkPW9bMF0ub2Zmc2V0SGVpZ2h0O2lmKHIpe3ZhciBwPXMsYz10aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KTtzPVwiYm90dG9tXCI9PXMmJmwuYm90dG9tK2Q+Yy5ib3R0b20/XCJ0b3BcIjpcInRvcFwiPT1zJiZsLnRvcC1kPGMudG9wP1wiYm90dG9tXCI6XCJyaWdodFwiPT1zJiZsLnJpZ2h0K2g+Yy53aWR0aD9cImxlZnRcIjpcImxlZnRcIj09cyYmbC5sZWZ0LWg8Yy5sZWZ0P1wicmlnaHRcIjpzLG8ucmVtb3ZlQ2xhc3MocCkuYWRkQ2xhc3Mocyl9dmFyIGY9dGhpcy5nZXRDYWxjdWxhdGVkT2Zmc2V0KHMsbCxoLGQpO3RoaXMuYXBwbHlQbGFjZW1lbnQoZixzKTt2YXIgdT1mdW5jdGlvbigpe3ZhciB0PWkuaG92ZXJTdGF0ZTtpLiRlbGVtZW50LnRyaWdnZXIoXCJzaG93bi5icy5cIitpLnR5cGUpLGkuaG92ZXJTdGF0ZT1udWxsLFwib3V0XCI9PXQmJmkubGVhdmUoaSl9O2cuc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLiR0aXAuaGFzQ2xhc3MoXCJmYWRlXCIpP28ub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsdSkuZW11bGF0ZVRyYW5zaXRpb25FbmQobS5UUkFOU0lUSU9OX0RVUkFUSU9OKTp1KCl9fSxtLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudD1mdW5jdGlvbih0LGUpe3ZhciBpPXRoaXMudGlwKCksbz1pWzBdLm9mZnNldFdpZHRoLG49aVswXS5vZmZzZXRIZWlnaHQscz1wYXJzZUludChpLmNzcyhcIm1hcmdpbi10b3BcIiksMTApLGE9cGFyc2VJbnQoaS5jc3MoXCJtYXJnaW4tbGVmdFwiKSwxMCk7aXNOYU4ocykmJihzPTApLGlzTmFOKGEpJiYoYT0wKSx0LnRvcCs9cyx0LmxlZnQrPWEsZy5vZmZzZXQuc2V0T2Zmc2V0KGlbMF0sZy5leHRlbmQoe3VzaW5nOmZ1bmN0aW9uKHQpe2kuY3NzKHt0b3A6TWF0aC5yb3VuZCh0LnRvcCksbGVmdDpNYXRoLnJvdW5kKHQubGVmdCl9KX19LHQpLDApLGkuYWRkQ2xhc3MoXCJpblwiKTt2YXIgcj1pWzBdLm9mZnNldFdpZHRoLGw9aVswXS5vZmZzZXRIZWlnaHQ7XCJ0b3BcIj09ZSYmbCE9biYmKHQudG9wPXQudG9wK24tbCk7dmFyIGg9dGhpcy5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEoZSx0LHIsbCk7aC5sZWZ0P3QubGVmdCs9aC5sZWZ0OnQudG9wKz1oLnRvcDt2YXIgZD0vdG9wfGJvdHRvbS8udGVzdChlKSxwPWQ/MipoLmxlZnQtbytyOjIqaC50b3AtbitsLGM9ZD9cIm9mZnNldFdpZHRoXCI6XCJvZmZzZXRIZWlnaHRcIjtpLm9mZnNldCh0KSx0aGlzLnJlcGxhY2VBcnJvdyhwLGlbMF1bY10sZCl9LG0ucHJvdG90eXBlLnJlcGxhY2VBcnJvdz1mdW5jdGlvbih0LGUsaSl7dGhpcy5hcnJvdygpLmNzcyhpP1wibGVmdFwiOlwidG9wXCIsNTAqKDEtdC9lKStcIiVcIikuY3NzKGk/XCJ0b3BcIjpcImxlZnRcIixcIlwiKX0sbS5wcm90b3R5cGUuc2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciB0PXRoaXMudGlwKCksZT10aGlzLmdldFRpdGxlKCk7dGhpcy5vcHRpb25zLmh0bWw/KHRoaXMub3B0aW9ucy5zYW5pdGl6ZSYmKGU9bihlLHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsdGhpcy5vcHRpb25zLnNhbml0aXplRm4pKSx0LmZpbmQoXCIudG9vbHRpcC1pbm5lclwiKS5odG1sKGUpKTp0LmZpbmQoXCIudG9vbHRpcC1pbm5lclwiKS50ZXh0KGUpLHQucmVtb3ZlQ2xhc3MoXCJmYWRlIGluIHRvcCBib3R0b20gbGVmdCByaWdodFwiKX0sbS5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbih0KXt2YXIgZT10aGlzLGk9Zyh0aGlzLiR0aXApLG89Zy5FdmVudChcImhpZGUuYnMuXCIrdGhpcy50eXBlKTtmdW5jdGlvbiBuKCl7XCJpblwiIT1lLmhvdmVyU3RhdGUmJmkuZGV0YWNoKCksZS4kZWxlbWVudCYmZS4kZWxlbWVudC5yZW1vdmVBdHRyKFwiYXJpYS1kZXNjcmliZWRieVwiKS50cmlnZ2VyKFwiaGlkZGVuLmJzLlwiK2UudHlwZSksdCYmdCgpfWlmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcihvKSwhby5pc0RlZmF1bHRQcmV2ZW50ZWQoKSlyZXR1cm4gaS5yZW1vdmVDbGFzcyhcImluXCIpLGcuc3VwcG9ydC50cmFuc2l0aW9uJiZpLmhhc0NsYXNzKFwiZmFkZVwiKT9pLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLG4pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKG0uVFJBTlNJVElPTl9EVVJBVElPTik6bigpLHRoaXMuaG92ZXJTdGF0ZT1udWxsLHRoaXN9LG0ucHJvdG90eXBlLmZpeFRpdGxlPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy4kZWxlbWVudDsodC5hdHRyKFwidGl0bGVcIil8fFwic3RyaW5nXCIhPXR5cGVvZiB0LmF0dHIoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpKSYmdC5hdHRyKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiLHQuYXR0cihcInRpdGxlXCIpfHxcIlwiKS5hdHRyKFwidGl0bGVcIixcIlwiKX0sbS5wcm90b3R5cGUuaGFzQ29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFRpdGxlKCl9LG0ucHJvdG90eXBlLmdldFBvc2l0aW9uPWZ1bmN0aW9uKHQpe3ZhciBlPSh0PXR8fHRoaXMuJGVsZW1lbnQpWzBdLGk9XCJCT0RZXCI9PWUudGFnTmFtZSxvPWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7bnVsbD09by53aWR0aCYmKG89Zy5leHRlbmQoe30sbyx7d2lkdGg6by5yaWdodC1vLmxlZnQsaGVpZ2h0Om8uYm90dG9tLW8udG9wfSkpO3ZhciBuPXdpbmRvdy5TVkdFbGVtZW50JiZlIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnQscz1pP3t0b3A6MCxsZWZ0OjB9Om4/bnVsbDp0Lm9mZnNldCgpLGE9e3Njcm9sbDppP2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3B8fGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wOnQuc2Nyb2xsVG9wKCl9LHI9aT97d2lkdGg6Zyh3aW5kb3cpLndpZHRoKCksaGVpZ2h0Omcod2luZG93KS5oZWlnaHQoKX06bnVsbDtyZXR1cm4gZy5leHRlbmQoe30sbyxhLHIscyl9LG0ucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQ9ZnVuY3Rpb24odCxlLGksbyl7cmV0dXJuXCJib3R0b21cIj09dD97dG9wOmUudG9wK2UuaGVpZ2h0LGxlZnQ6ZS5sZWZ0K2Uud2lkdGgvMi1pLzJ9OlwidG9wXCI9PXQ/e3RvcDplLnRvcC1vLGxlZnQ6ZS5sZWZ0K2Uud2lkdGgvMi1pLzJ9OlwibGVmdFwiPT10P3t0b3A6ZS50b3ArZS5oZWlnaHQvMi1vLzIsbGVmdDplLmxlZnQtaX06e3RvcDplLnRvcCtlLmhlaWdodC8yLW8vMixsZWZ0OmUubGVmdCtlLndpZHRofX0sbS5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhPWZ1bmN0aW9uKHQsZSxpLG8pe3ZhciBuPXt0b3A6MCxsZWZ0OjB9O2lmKCF0aGlzLiR2aWV3cG9ydClyZXR1cm4gbjt2YXIgcz10aGlzLm9wdGlvbnMudmlld3BvcnQmJnRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nfHwwLGE9dGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydCk7aWYoL3JpZ2h0fGxlZnQvLnRlc3QodCkpe3ZhciByPWUudG9wLXMtYS5zY3JvbGwsbD1lLnRvcCtzLWEuc2Nyb2xsK287cjxhLnRvcD9uLnRvcD1hLnRvcC1yOmw+YS50b3ArYS5oZWlnaHQmJihuLnRvcD1hLnRvcCthLmhlaWdodC1sKX1lbHNle3ZhciBoPWUubGVmdC1zLGQ9ZS5sZWZ0K3MraTtoPGEubGVmdD9uLmxlZnQ9YS5sZWZ0LWg6ZD5hLnJpZ2h0JiYobi5sZWZ0PWEubGVmdCthLndpZHRoLWQpfXJldHVybiBufSxtLnByb3RvdHlwZS5nZXRUaXRsZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuJGVsZW1lbnQsZT10aGlzLm9wdGlvbnM7cmV0dXJuIHQuYXR0cihcImRhdGEtb3JpZ2luYWwtdGl0bGVcIil8fChcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRpdGxlP2UudGl0bGUuY2FsbCh0WzBdKTplLnRpdGxlKX0sbS5wcm90b3R5cGUuZ2V0VUlEPWZ1bmN0aW9uKHQpe2Zvcig7dCs9fn4oMWU2Kk1hdGgucmFuZG9tKCkpLGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHQpOyk7cmV0dXJuIHR9LG0ucHJvdG90eXBlLnRpcD1mdW5jdGlvbigpe2lmKCF0aGlzLiR0aXAmJih0aGlzLiR0aXA9Zyh0aGlzLm9wdGlvbnMudGVtcGxhdGUpLDEhPXRoaXMuJHRpcC5sZW5ndGgpKXRocm93IG5ldyBFcnJvcih0aGlzLnR5cGUrXCIgYHRlbXBsYXRlYCBvcHRpb24gbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgMSB0b3AtbGV2ZWwgZWxlbWVudCFcIik7cmV0dXJuIHRoaXMuJHRpcH0sbS5wcm90b3R5cGUuYXJyb3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kYXJyb3c9dGhpcy4kYXJyb3d8fHRoaXMudGlwKCkuZmluZChcIi50b29sdGlwLWFycm93XCIpfSxtLnByb3RvdHlwZS5lbmFibGU9ZnVuY3Rpb24oKXt0aGlzLmVuYWJsZWQ9ITB9LG0ucHJvdG90eXBlLmRpc2FibGU9ZnVuY3Rpb24oKXt0aGlzLmVuYWJsZWQ9ITF9LG0ucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQ9ZnVuY3Rpb24oKXt0aGlzLmVuYWJsZWQ9IXRoaXMuZW5hYmxlZH0sbS5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7dCYmKChlPWcodC5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlKSl8fChlPW5ldyB0aGlzLmNvbnN0cnVjdG9yKHQuY3VycmVudFRhcmdldCx0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKSxnKHQuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSxlKSkpLHQ/KGUuaW5TdGF0ZS5jbGljaz0hZS5pblN0YXRlLmNsaWNrLGUuaXNJblN0YXRlVHJ1ZSgpP2UuZW50ZXIoZSk6ZS5sZWF2ZShlKSk6ZS50aXAoKS5oYXNDbGFzcyhcImluXCIpP2UubGVhdmUoZSk6ZS5lbnRlcihlKX0sbS5wcm90b3R5cGUuZGVzdHJveT1mdW5jdGlvbigpe3ZhciB0PXRoaXM7Y2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCksdGhpcy5oaWRlKGZ1bmN0aW9uKCl7dC4kZWxlbWVudC5vZmYoXCIuXCIrdC50eXBlKS5yZW1vdmVEYXRhKFwiYnMuXCIrdC50eXBlKSx0LiR0aXAmJnQuJHRpcC5kZXRhY2goKSx0LiR0aXA9bnVsbCx0LiRhcnJvdz1udWxsLHQuJHZpZXdwb3J0PW51bGwsdC4kZWxlbWVudD1udWxsfSl9LG0ucHJvdG90eXBlLnNhbml0aXplSHRtbD1mdW5jdGlvbih0KXtyZXR1cm4gbih0LHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsdGhpcy5vcHRpb25zLnNhbml0aXplRm4pfTt2YXIgZT1nLmZuLnRvb2x0aXA7Zy5mbi50b29sdGlwPWZ1bmN0aW9uIGkobyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PWcodGhpcyksZT10LmRhdGEoXCJicy50b29sdGlwXCIpLGk9XCJvYmplY3RcIj09dHlwZW9mIG8mJm87IWUmJi9kZXN0cm95fGhpZGUvLnRlc3Qobyl8fChlfHx0LmRhdGEoXCJicy50b29sdGlwXCIsZT1uZXcgbSh0aGlzLGkpKSxcInN0cmluZ1wiPT10eXBlb2YgbyYmZVtvXSgpKX0pfSxnLmZuLnRvb2x0aXAuQ29uc3RydWN0b3I9bSxnLmZuLnRvb2x0aXAubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBnLmZuLnRvb2x0aXA9ZSx0aGlzfX0oalF1ZXJ5KSxmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjt2YXIgcz1mdW5jdGlvbih0LGUpe3RoaXMuaW5pdChcInBvcG92ZXJcIix0LGUpfTtpZighbi5mbi50b29sdGlwKXRocm93IG5ldyBFcnJvcihcIlBvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qc1wiKTtzLlZFUlNJT049XCIzLjQuMVwiLHMuREVGQVVMVFM9bi5leHRlbmQoe30sbi5mbi50b29sdGlwLkNvbnN0cnVjdG9yLkRFRkFVTFRTLHtwbGFjZW1lbnQ6XCJyaWdodFwiLHRyaWdnZXI6XCJjbGlja1wiLGNvbnRlbnQ6XCJcIix0ZW1wbGF0ZTonPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nfSksKChzLnByb3RvdHlwZT1uLmV4dGVuZCh7fSxuLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IucHJvdG90eXBlKSkuY29uc3RydWN0b3I9cykucHJvdG90eXBlLmdldERlZmF1bHRzPWZ1bmN0aW9uKCl7cmV0dXJuIHMuREVGQVVMVFN9LHMucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnRpcCgpLGU9dGhpcy5nZXRUaXRsZSgpLGk9dGhpcy5nZXRDb250ZW50KCk7aWYodGhpcy5vcHRpb25zLmh0bWwpe3ZhciBvPXR5cGVvZiBpO3RoaXMub3B0aW9ucy5zYW5pdGl6ZSYmKGU9dGhpcy5zYW5pdGl6ZUh0bWwoZSksXCJzdHJpbmdcIj09PW8mJihpPXRoaXMuc2FuaXRpemVIdG1sKGkpKSksdC5maW5kKFwiLnBvcG92ZXItdGl0bGVcIikuaHRtbChlKSx0LmZpbmQoXCIucG9wb3Zlci1jb250ZW50XCIpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbXCJzdHJpbmdcIj09PW8/XCJodG1sXCI6XCJhcHBlbmRcIl0oaSl9ZWxzZSB0LmZpbmQoXCIucG9wb3Zlci10aXRsZVwiKS50ZXh0KGUpLHQuZmluZChcIi5wb3BvdmVyLWNvbnRlbnRcIikuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKS50ZXh0KGkpO3QucmVtb3ZlQ2xhc3MoXCJmYWRlIHRvcCBib3R0b20gbGVmdCByaWdodCBpblwiKSx0LmZpbmQoXCIucG9wb3Zlci10aXRsZVwiKS5odG1sKCl8fHQuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpLmhpZGUoKX0scy5wcm90b3R5cGUuaGFzQ29udGVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFRpdGxlKCl8fHRoaXMuZ2V0Q29udGVudCgpfSxzLnByb3RvdHlwZS5nZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy4kZWxlbWVudCxlPXRoaXMub3B0aW9ucztyZXR1cm4gdC5hdHRyKFwiZGF0YS1jb250ZW50XCIpfHwoXCJmdW5jdGlvblwiPT10eXBlb2YgZS5jb250ZW50P2UuY29udGVudC5jYWxsKHRbMF0pOmUuY29udGVudCl9LHMucHJvdG90eXBlLmFycm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGFycm93PXRoaXMuJGFycm93fHx0aGlzLnRpcCgpLmZpbmQoXCIuYXJyb3dcIil9O3ZhciB0PW4uZm4ucG9wb3ZlcjtuLmZuLnBvcG92ZXI9ZnVuY3Rpb24gZShvKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9bih0aGlzKSxlPXQuZGF0YShcImJzLnBvcG92ZXJcIiksaT1cIm9iamVjdFwiPT10eXBlb2YgbyYmbzshZSYmL2Rlc3Ryb3l8aGlkZS8udGVzdChvKXx8KGV8fHQuZGF0YShcImJzLnBvcG92ZXJcIixlPW5ldyBzKHRoaXMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBvJiZlW29dKCkpfSl9LG4uZm4ucG9wb3Zlci5Db25zdHJ1Y3Rvcj1zLG4uZm4ucG9wb3Zlci5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIG4uZm4ucG9wb3Zlcj10LHRoaXN9fShqUXVlcnkpLGZ1bmN0aW9uKHMpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXt0aGlzLiRib2R5PXMoZG9jdW1lbnQuYm9keSksdGhpcy4kc2Nyb2xsRWxlbWVudD1zKHQpLmlzKGRvY3VtZW50LmJvZHkpP3Mod2luZG93KTpzKHQpLHRoaXMub3B0aW9ucz1zLmV4dGVuZCh7fSxuLkRFRkFVTFRTLGUpLHRoaXMuc2VsZWN0b3I9KHRoaXMub3B0aW9ucy50YXJnZXR8fFwiXCIpK1wiIC5uYXYgbGkgPiBhXCIsdGhpcy5vZmZzZXRzPVtdLHRoaXMudGFyZ2V0cz1bXSx0aGlzLmFjdGl2ZVRhcmdldD1udWxsLHRoaXMuc2Nyb2xsSGVpZ2h0PTAsdGhpcy4kc2Nyb2xsRWxlbWVudC5vbihcInNjcm9sbC5icy5zY3JvbGxzcHlcIixzLnByb3h5KHRoaXMucHJvY2Vzcyx0aGlzKSksdGhpcy5yZWZyZXNoKCksdGhpcy5wcm9jZXNzKCl9ZnVuY3Rpb24gZShvKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cyh0aGlzKSxlPXQuZGF0YShcImJzLnNjcm9sbHNweVwiKSxpPVwib2JqZWN0XCI9PXR5cGVvZiBvJiZvO2V8fHQuZGF0YShcImJzLnNjcm9sbHNweVwiLGU9bmV3IG4odGhpcyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG8mJmVbb10oKX0pfW4uVkVSU0lPTj1cIjMuNC4xXCIsbi5ERUZBVUxUUz17b2Zmc2V0OjEwfSxuLnByb3RvdHlwZS5nZXRTY3JvbGxIZWlnaHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHR8fE1hdGgubWF4KHRoaXMuJGJvZHlbMF0uc2Nyb2xsSGVpZ2h0LGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpfSxuLnByb3RvdHlwZS5yZWZyZXNoPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxvPVwib2Zmc2V0XCIsbj0wO3RoaXMub2Zmc2V0cz1bXSx0aGlzLnRhcmdldHM9W10sdGhpcy5zY3JvbGxIZWlnaHQ9dGhpcy5nZXRTY3JvbGxIZWlnaHQoKSxzLmlzV2luZG93KHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0pfHwobz1cInBvc2l0aW9uXCIsbj10aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpKSx0aGlzLiRib2R5LmZpbmQodGhpcy5zZWxlY3RvcikubWFwKGZ1bmN0aW9uKCl7dmFyIHQ9cyh0aGlzKSxlPXQuZGF0YShcInRhcmdldFwiKXx8dC5hdHRyKFwiaHJlZlwiKSxpPS9eIy4vLnRlc3QoZSkmJnMoZSk7cmV0dXJuIGkmJmkubGVuZ3RoJiZpLmlzKFwiOnZpc2libGVcIikmJltbaVtvXSgpLnRvcCtuLGVdXXx8bnVsbH0pLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFswXS1lWzBdfSkuZWFjaChmdW5jdGlvbigpe3Qub2Zmc2V0cy5wdXNoKHRoaXNbMF0pLHQudGFyZ2V0cy5wdXNoKHRoaXNbMV0pfSl9LG4ucHJvdG90eXBlLnByb2Nlc3M9ZnVuY3Rpb24oKXt2YXIgdCxlPXRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkrdGhpcy5vcHRpb25zLm9mZnNldCxpPXRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KCksbz10aGlzLm9wdGlvbnMub2Zmc2V0K2ktdGhpcy4kc2Nyb2xsRWxlbWVudC5oZWlnaHQoKSxuPXRoaXMub2Zmc2V0cyxzPXRoaXMudGFyZ2V0cyxhPXRoaXMuYWN0aXZlVGFyZ2V0O2lmKHRoaXMuc2Nyb2xsSGVpZ2h0IT1pJiZ0aGlzLnJlZnJlc2goKSxvPD1lKXJldHVybiBhIT0odD1zW3MubGVuZ3RoLTFdKSYmdGhpcy5hY3RpdmF0ZSh0KTtpZihhJiZlPG5bMF0pcmV0dXJuIHRoaXMuYWN0aXZlVGFyZ2V0PW51bGwsdGhpcy5jbGVhcigpO2Zvcih0PW4ubGVuZ3RoO3QtLTspYSE9c1t0XSYmZT49blt0XSYmKG5bdCsxXT09PXVuZGVmaW5lZHx8ZTxuW3QrMV0pJiZ0aGlzLmFjdGl2YXRlKHNbdF0pfSxuLnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbih0KXt0aGlzLmFjdGl2ZVRhcmdldD10LHRoaXMuY2xlYXIoKTt2YXIgZT10aGlzLnNlbGVjdG9yKydbZGF0YS10YXJnZXQ9XCInK3QrJ1wiXSwnK3RoaXMuc2VsZWN0b3IrJ1tocmVmPVwiJyt0KydcIl0nLGk9cyhlKS5wYXJlbnRzKFwibGlcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7aS5wYXJlbnQoXCIuZHJvcGRvd24tbWVudVwiKS5sZW5ndGgmJihpPWkuY2xvc2VzdChcImxpLmRyb3Bkb3duXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpKSxpLnRyaWdnZXIoXCJhY3RpdmF0ZS5icy5zY3JvbGxzcHlcIil9LG4ucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7cyh0aGlzLnNlbGVjdG9yKS5wYXJlbnRzVW50aWwodGhpcy5vcHRpb25zLnRhcmdldCxcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIil9O3ZhciB0PXMuZm4uc2Nyb2xsc3B5O3MuZm4uc2Nyb2xsc3B5PWUscy5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3I9bixzLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHMuZm4uc2Nyb2xsc3B5PXQsdGhpc30scyh3aW5kb3cpLm9uKFwibG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGlcIixmdW5jdGlvbigpe3MoJ1tkYXRhLXNweT1cInNjcm9sbFwiXScpLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1zKHRoaXMpO2UuY2FsbCh0LHQuZGF0YSgpKX0pfSl9KGpRdWVyeSksZnVuY3Rpb24ocil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGE9ZnVuY3Rpb24odCl7dGhpcy5lbGVtZW50PXIodCl9O2Z1bmN0aW9uIGUoaSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PXIodGhpcyksZT10LmRhdGEoXCJicy50YWJcIik7ZXx8dC5kYXRhKFwiYnMudGFiXCIsZT1uZXcgYSh0aGlzKSksXCJzdHJpbmdcIj09dHlwZW9mIGkmJmVbaV0oKX0pfWEuVkVSU0lPTj1cIjMuNC4xXCIsYS5UUkFOU0lUSU9OX0RVUkFUSU9OPTE1MCxhLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5lbGVtZW50LGU9dC5jbG9zZXN0KFwidWw6bm90KC5kcm9wZG93bi1tZW51KVwiKSxpPXQuZGF0YShcInRhcmdldFwiKTtpZihpfHwoaT0oaT10LmF0dHIoXCJocmVmXCIpKSYmaS5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLFwiXCIpKSwhdC5wYXJlbnQoXCJsaVwiKS5oYXNDbGFzcyhcImFjdGl2ZVwiKSl7dmFyIG89ZS5maW5kKFwiLmFjdGl2ZTpsYXN0IGFcIiksbj1yLkV2ZW50KFwiaGlkZS5icy50YWJcIix7cmVsYXRlZFRhcmdldDp0WzBdfSkscz1yLkV2ZW50KFwic2hvdy5icy50YWJcIix7cmVsYXRlZFRhcmdldDpvWzBdfSk7aWYoby50cmlnZ2VyKG4pLHQudHJpZ2dlcihzKSwhcy5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmIW4uaXNEZWZhdWx0UHJldmVudGVkKCkpe3ZhciBhPXIoZG9jdW1lbnQpLmZpbmQoaSk7dGhpcy5hY3RpdmF0ZSh0LmNsb3Nlc3QoXCJsaVwiKSxlKSx0aGlzLmFjdGl2YXRlKGEsYS5wYXJlbnQoKSxmdW5jdGlvbigpe28udHJpZ2dlcih7dHlwZTpcImhpZGRlbi5icy50YWJcIixyZWxhdGVkVGFyZ2V0OnRbMF19KSx0LnRyaWdnZXIoe3R5cGU6XCJzaG93bi5icy50YWJcIixyZWxhdGVkVGFyZ2V0Om9bMF19KX0pfX19LGEucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKHQsZSxpKXt2YXIgbz1lLmZpbmQoXCI+IC5hY3RpdmVcIiksbj1pJiZyLnN1cHBvcnQudHJhbnNpdGlvbiYmKG8ubGVuZ3RoJiZvLmhhc0NsYXNzKFwiZmFkZVwiKXx8ISFlLmZpbmQoXCI+IC5mYWRlXCIpLmxlbmd0aCk7ZnVuY3Rpb24gcygpe28ucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuZmluZChcIj4gLmRyb3Bkb3duLW1lbnUgPiAuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmVuZCgpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHQuYWRkQ2xhc3MoXCJhY3RpdmVcIikuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksbj8odFswXS5vZmZzZXRXaWR0aCx0LmFkZENsYXNzKFwiaW5cIikpOnQucmVtb3ZlQ2xhc3MoXCJmYWRlXCIpLHQucGFyZW50KFwiLmRyb3Bkb3duLW1lbnVcIikubGVuZ3RoJiZ0LmNsb3Nlc3QoXCJsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5lbmQoKS5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSxpJiZpKCl9by5sZW5ndGgmJm4/by5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixzKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChhLlRSQU5TSVRJT05fRFVSQVRJT04pOnMoKSxvLnJlbW92ZUNsYXNzKFwiaW5cIil9O3ZhciB0PXIuZm4udGFiO3IuZm4udGFiPWUsci5mbi50YWIuQ29uc3RydWN0b3I9YSxyLmZuLnRhYi5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHIuZm4udGFiPXQsdGhpc307dmFyIGk9ZnVuY3Rpb24odCl7dC5wcmV2ZW50RGVmYXVsdCgpLGUuY2FsbChyKHRoaXMpLFwic2hvd1wiKX07cihkb2N1bWVudCkub24oXCJjbGljay5icy50YWIuZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJyxpKS5vbihcImNsaWNrLmJzLnRhYi5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJwaWxsXCJdJyxpKX0oalF1ZXJ5KSxmdW5jdGlvbihsKXtcInVzZSBzdHJpY3RcIjt2YXIgaD1mdW5jdGlvbih0LGUpe3RoaXMub3B0aW9ucz1sLmV4dGVuZCh7fSxoLkRFRkFVTFRTLGUpO3ZhciBpPXRoaXMub3B0aW9ucy50YXJnZXQ9PT1oLkRFRkFVTFRTLnRhcmdldD9sKHRoaXMub3B0aW9ucy50YXJnZXQpOmwoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnRhcmdldCk7dGhpcy4kdGFyZ2V0PWkub24oXCJzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGlcIixsLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbix0aGlzKSkub24oXCJjbGljay5icy5hZmZpeC5kYXRhLWFwaVwiLGwucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCx0aGlzKSksdGhpcy4kZWxlbWVudD1sKHQpLHRoaXMuYWZmaXhlZD1udWxsLHRoaXMudW5waW49bnVsbCx0aGlzLnBpbm5lZE9mZnNldD1udWxsLHRoaXMuY2hlY2tQb3NpdGlvbigpfTtmdW5jdGlvbiBpKG8pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1sKHRoaXMpLGU9dC5kYXRhKFwiYnMuYWZmaXhcIiksaT1cIm9iamVjdFwiPT10eXBlb2YgbyYmbztlfHx0LmRhdGEoXCJicy5hZmZpeFwiLGU9bmV3IGgodGhpcyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG8mJmVbb10oKX0pfWguVkVSU0lPTj1cIjMuNC4xXCIsaC5SRVNFVD1cImFmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b21cIixoLkRFRkFVTFRTPXtvZmZzZXQ6MCx0YXJnZXQ6d2luZG93fSxoLnByb3RvdHlwZS5nZXRTdGF0ZT1mdW5jdGlvbih0LGUsaSxvKXt2YXIgbj10aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKCkscz10aGlzLiRlbGVtZW50Lm9mZnNldCgpLGE9dGhpcy4kdGFyZ2V0LmhlaWdodCgpO2lmKG51bGwhPWkmJlwidG9wXCI9PXRoaXMuYWZmaXhlZClyZXR1cm4gbjxpJiZcInRvcFwiO2lmKFwiYm90dG9tXCI9PXRoaXMuYWZmaXhlZClyZXR1cm4gbnVsbCE9aT8hKG4rdGhpcy51bnBpbjw9cy50b3ApJiZcImJvdHRvbVwiOiEobithPD10LW8pJiZcImJvdHRvbVwiO3ZhciByPW51bGw9PXRoaXMuYWZmaXhlZCxsPXI/bjpzLnRvcDtyZXR1cm4gbnVsbCE9aSYmbjw9aT9cInRvcFwiOm51bGwhPW8mJnQtbzw9bCsocj9hOmUpJiZcImJvdHRvbVwifSxoLnByb3RvdHlwZS5nZXRQaW5uZWRPZmZzZXQ9ZnVuY3Rpb24oKXtpZih0aGlzLnBpbm5lZE9mZnNldClyZXR1cm4gdGhpcy5waW5uZWRPZmZzZXQ7dGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhoLlJFU0VUKS5hZGRDbGFzcyhcImFmZml4XCIpO3ZhciB0PXRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKSxlPXRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7cmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0PWUudG9wLXR9LGgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wPWZ1bmN0aW9uKCl7c2V0VGltZW91dChsLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbix0aGlzKSwxKX0saC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbj1mdW5jdGlvbigpe2lmKHRoaXMuJGVsZW1lbnQuaXMoXCI6dmlzaWJsZVwiKSl7dmFyIHQ9dGhpcy4kZWxlbWVudC5oZWlnaHQoKSxlPXRoaXMub3B0aW9ucy5vZmZzZXQsaT1lLnRvcCxvPWUuYm90dG9tLG49TWF0aC5tYXgobChkb2N1bWVudCkuaGVpZ2h0KCksbChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSk7XCJvYmplY3RcIiE9dHlwZW9mIGUmJihvPWk9ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgaSYmKGk9ZS50b3AodGhpcy4kZWxlbWVudCkpLFwiZnVuY3Rpb25cIj09dHlwZW9mIG8mJihvPWUuYm90dG9tKHRoaXMuJGVsZW1lbnQpKTt2YXIgcz10aGlzLmdldFN0YXRlKG4sdCxpLG8pO2lmKHRoaXMuYWZmaXhlZCE9cyl7bnVsbCE9dGhpcy51bnBpbiYmdGhpcy4kZWxlbWVudC5jc3MoXCJ0b3BcIixcIlwiKTt2YXIgYT1cImFmZml4XCIrKHM/XCItXCIrczpcIlwiKSxyPWwuRXZlbnQoYStcIi5icy5hZmZpeFwiKTtpZih0aGlzLiRlbGVtZW50LnRyaWdnZXIociksci5pc0RlZmF1bHRQcmV2ZW50ZWQoKSlyZXR1cm47dGhpcy5hZmZpeGVkPXMsdGhpcy51bnBpbj1cImJvdHRvbVwiPT1zP3RoaXMuZ2V0UGlubmVkT2Zmc2V0KCk6bnVsbCx0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKGguUkVTRVQpLmFkZENsYXNzKGEpLnRyaWdnZXIoYS5yZXBsYWNlKFwiYWZmaXhcIixcImFmZml4ZWRcIikrXCIuYnMuYWZmaXhcIil9XCJib3R0b21cIj09cyYmdGhpcy4kZWxlbWVudC5vZmZzZXQoe3RvcDpuLXQtb30pfX07dmFyIHQ9bC5mbi5hZmZpeDtsLmZuLmFmZml4PWksbC5mbi5hZmZpeC5Db25zdHJ1Y3Rvcj1oLGwuZm4uYWZmaXgubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBsLmZuLmFmZml4PXQsdGhpc30sbCh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7bCgnW2RhdGEtc3B5PVwiYWZmaXhcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9bCh0aGlzKSxlPXQuZGF0YSgpO2Uub2Zmc2V0PWUub2Zmc2V0fHx7fSxudWxsIT1lLm9mZnNldEJvdHRvbSYmKGUub2Zmc2V0LmJvdHRvbT1lLm9mZnNldEJvdHRvbSksbnVsbCE9ZS5vZmZzZXRUb3AmJihlLm9mZnNldC50b3A9ZS5vZmZzZXRUb3ApLGkuY2FsbCh0LGUpfSl9KX0oalF1ZXJ5KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKiEgQWRtaW5MVEUgYXBwLmpzXG4qID09PT09PT09PT09PT09PT1cbiogTWFpbiBKUyBhcHBsaWNhdGlvbiBmaWxlIGZvciBBZG1pbkxURSB2Mi4gVGhpcyBmaWxlXG4qIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBhbGwgcGFnZXMuIEl0IGNvbnRyb2xzIHNvbWUgbGF5b3V0XG4qIG9wdGlvbnMgYW5kIGltcGxlbWVudHMgZXhjbHVzaXZlIEFkbWluTFRFIHBsdWdpbnMuXG4qXG4qIEBBdXRob3IgIEFsbXNhZWVkIFN0dWRpb1xuKiBAU3VwcG9ydCA8aHR0cHM6Ly93d3cuYWxtc2FlZWRzdHVkaW8uY29tPlxuKiBARW1haWwgICA8YWJkdWxsYWhAYWxtc2FlZWRzdHVkaW8uY29tPlxuKiBAdmVyc2lvbiAyLjQuOFxuKiBAcmVwb3NpdG9yeSBnaXQ6Ly9naXRodWIuY29tL2FsbWFzYWVlZDIwMTAvQWRtaW5MVEUuZ2l0XG4qIEBsaWNlbnNlIE1JVCA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVD5cbiovXG5pZihcInVuZGVmaW5lZFwiPT10eXBlb2YgalF1ZXJ5KXRocm93IG5ldyBFcnJvcihcIkFkbWluTFRFIHJlcXVpcmVzIGpRdWVyeVwiKTsrZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxnPWUuZGF0YShjKTtpZighZyl7dmFyIGg9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZz1uZXcgZihlLGgpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgZyl7aWYodm9pZCAwPT09Z1tiXSl0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXCIrYik7Z1tiXSgpfX0pfXZhciBjPVwibHRlLmJveHJlZnJlc2hcIixkPXtzb3VyY2U6XCJcIixwYXJhbXM6e30sdHJpZ2dlcjpcIi5yZWZyZXNoLWJ0blwiLGNvbnRlbnQ6XCIuYm94LWJvZHlcIixsb2FkSW5Db250ZW50OiEwLHJlc3BvbnNlVHlwZTpcIlwiLG92ZXJsYXlUZW1wbGF0ZTonPGRpdiBjbGFzcz1cIm92ZXJsYXlcIj48ZGl2IGNsYXNzPVwiZmEgZmEtcmVmcmVzaCBmYS1zcGluXCI+PC9kaXY+PC9kaXY+JyxvbkxvYWRTdGFydDpmdW5jdGlvbigpe30sb25Mb2FkRG9uZTpmdW5jdGlvbihhKXtyZXR1cm4gYX19LGU9e2RhdGE6J1tkYXRhLXdpZGdldD1cImJveC1yZWZyZXNoXCJdJ30sZj1mdW5jdGlvbihiLGMpe2lmKHRoaXMuZWxlbWVudD1iLHRoaXMub3B0aW9ucz1jLHRoaXMuJG92ZXJsYXk9YShjLm92ZXJsYXlUZW1wbGF0ZSksXCJcIj09PWMuc291cmNlKXRocm93IG5ldyBFcnJvcihcIlNvdXJjZSB1cmwgd2FzIG5vdCBkZWZpbmVkLiBQbGVhc2Ugc3BlY2lmeSBhIHVybCBpbiB5b3VyIEJveFJlZnJlc2ggc291cmNlIG9wdGlvbi5cIik7dGhpcy5fc2V0VXBMaXN0ZW5lcnMoKSx0aGlzLmxvYWQoKX07Zi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbigpe3RoaXMuX2FkZE92ZXJsYXkoKSx0aGlzLm9wdGlvbnMub25Mb2FkU3RhcnQuY2FsbChhKHRoaXMpKSxhLmdldCh0aGlzLm9wdGlvbnMuc291cmNlLHRoaXMub3B0aW9ucy5wYXJhbXMsZnVuY3Rpb24oYil7dGhpcy5vcHRpb25zLmxvYWRJbkNvbnRlbnQmJmEodGhpcy5lbGVtZW50KS5maW5kKHRoaXMub3B0aW9ucy5jb250ZW50KS5odG1sKGIpLHRoaXMub3B0aW9ucy5vbkxvYWREb25lLmNhbGwoYSh0aGlzKSxiKSx0aGlzLl9yZW1vdmVPdmVybGF5KCl9LmJpbmQodGhpcyksXCJcIiE9PXRoaXMub3B0aW9ucy5yZXNwb25zZVR5cGUmJnRoaXMub3B0aW9ucy5yZXNwb25zZVR5cGUpfSxmLnByb3RvdHlwZS5fc2V0VXBMaXN0ZW5lcnM9ZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkub24oXCJjbGlja1wiLHRoaXMub3B0aW9ucy50cmlnZ2VyLGZ1bmN0aW9uKGEpe2EmJmEucHJldmVudERlZmF1bHQoKSx0aGlzLmxvYWQoKX0uYmluZCh0aGlzKSl9LGYucHJvdG90eXBlLl9hZGRPdmVybGF5PWZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLiRvdmVybGF5KX0sZi5wcm90b3R5cGUuX3JlbW92ZU92ZXJsYXk9ZnVuY3Rpb24oKXthKHRoaXMuJG92ZXJsYXkpLnJlbW92ZSgpfTt2YXIgZz1hLmZuLmJveFJlZnJlc2g7YS5mbi5ib3hSZWZyZXNoPWIsYS5mbi5ib3hSZWZyZXNoLkNvbnN0cnVjdG9yPWYsYS5mbi5ib3hSZWZyZXNoLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5ib3hSZWZyZXNoPWcsdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7YShlLmRhdGEpLmVhY2goZnVuY3Rpb24oKXtiLmNhbGwoYSh0aGlzKSl9KX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBnPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGgoZSxnKSl9aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe2lmKHZvaWQgMD09PWZbYl0pdGhyb3cgbmV3IEVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFwiK2IpO2ZbYl0oKX19KX12YXIgYz1cImx0ZS5ib3h3aWRnZXRcIixkPXthbmltYXRpb25TcGVlZDo1MDAsY29sbGFwc2VUcmlnZ2VyOidbZGF0YS13aWRnZXQ9XCJjb2xsYXBzZVwiXScscmVtb3ZlVHJpZ2dlcjonW2RhdGEtd2lkZ2V0PVwicmVtb3ZlXCJdJyxjb2xsYXBzZUljb246XCJmYS1taW51c1wiLGV4cGFuZEljb246XCJmYS1wbHVzXCIscmVtb3ZlSWNvbjpcImZhLXRpbWVzXCJ9LGU9e2RhdGE6XCIuYm94XCIsY29sbGFwc2VkOlwiLmNvbGxhcHNlZC1ib3hcIixoZWFkZXI6XCIuYm94LWhlYWRlclwiLGJvZHk6XCIuYm94LWJvZHlcIixmb290ZXI6XCIuYm94LWZvb3RlclwiLHRvb2xzOlwiLmJveC10b29sc1wifSxmPXtjb2xsYXBzZWQ6XCJjb2xsYXBzZWQtYm94XCJ9LGc9e2NvbGxhcHNpbmc6XCJjb2xsYXBzaW5nLmJveHdpZGdldFwiLGNvbGxhcHNlZDpcImNvbGxhcHNlZC5ib3h3aWRnZXRcIixleHBhbmRpbmc6XCJleHBhbmRpbmcuYm94d2lkZ2V0XCIsZXhwYW5kZWQ6XCJleHBhbmRlZC5ib3h3aWRnZXRcIixyZW1vdmluZzpcInJlbW92aW5nLmJveHdpZGdldFwiLHJlbW92ZWQ6XCJyZW1vdmVkLmJveHdpZGdldFwifSxoPWZ1bmN0aW9uKGEsYil7dGhpcy5lbGVtZW50PWEsdGhpcy5vcHRpb25zPWIsdGhpcy5fc2V0VXBMaXN0ZW5lcnMoKX07aC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmlzKGUuY29sbGFwc2VkKT90aGlzLmV4cGFuZCgpOnRoaXMuY29sbGFwc2UoKX0saC5wcm90b3R5cGUuZXhwYW5kPWZ1bmN0aW9uKCl7dmFyIGI9YS5FdmVudChnLmV4cGFuZGVkKSxjPWEuRXZlbnQoZy5leHBhbmRpbmcpLGQ9dGhpcy5vcHRpb25zLmNvbGxhcHNlSWNvbixoPXRoaXMub3B0aW9ucy5leHBhbmRJY29uO2EodGhpcy5lbGVtZW50KS5yZW1vdmVDbGFzcyhmLmNvbGxhcHNlZCksYSh0aGlzLmVsZW1lbnQpLmNoaWxkcmVuKGUuaGVhZGVyK1wiLCBcIitlLmJvZHkrXCIsIFwiK2UuZm9vdGVyKS5jaGlsZHJlbihlLnRvb2xzKS5maW5kKFwiLlwiK2gpLnJlbW92ZUNsYXNzKGgpLmFkZENsYXNzKGQpLGEodGhpcy5lbGVtZW50KS5jaGlsZHJlbihlLmJvZHkrXCIsIFwiK2UuZm9vdGVyKS5zbGlkZURvd24odGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoYil9LmJpbmQodGhpcykpLnRyaWdnZXIoYyl9LGgucHJvdG90eXBlLmNvbGxhcHNlPWZ1bmN0aW9uKCl7dmFyIGI9YS5FdmVudChnLmNvbGxhcHNlZCksYz0oYS5FdmVudChnLmNvbGxhcHNpbmcpLHRoaXMub3B0aW9ucy5jb2xsYXBzZUljb24pLGQ9dGhpcy5vcHRpb25zLmV4cGFuZEljb247YSh0aGlzLmVsZW1lbnQpLmNoaWxkcmVuKGUuaGVhZGVyK1wiLCBcIitlLmJvZHkrXCIsIFwiK2UuZm9vdGVyKS5jaGlsZHJlbihlLnRvb2xzKS5maW5kKFwiLlwiK2MpLnJlbW92ZUNsYXNzKGMpLmFkZENsYXNzKGQpLGEodGhpcy5lbGVtZW50KS5jaGlsZHJlbihlLmJvZHkrXCIsIFwiK2UuZm9vdGVyKS5zbGlkZVVwKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCxmdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS5hZGRDbGFzcyhmLmNvbGxhcHNlZCksYSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoYil9LmJpbmQodGhpcykpLnRyaWdnZXIoZXhwYW5kaW5nRXZlbnQpfSxoLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oKXt2YXIgYj1hLkV2ZW50KGcucmVtb3ZlZCksYz1hLkV2ZW50KGcucmVtb3ZpbmcpO2EodGhpcy5lbGVtZW50KS5zbGlkZVVwKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCxmdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS50cmlnZ2VyKGIpLGEodGhpcy5lbGVtZW50KS5yZW1vdmUoKX0uYmluZCh0aGlzKSkudHJpZ2dlcihjKX0saC5wcm90b3R5cGUuX3NldFVwTGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpczthKHRoaXMuZWxlbWVudCkub24oXCJjbGlja1wiLHRoaXMub3B0aW9ucy5jb2xsYXBzZVRyaWdnZXIsZnVuY3Rpb24oYyl7cmV0dXJuIGMmJmMucHJldmVudERlZmF1bHQoKSxiLnRvZ2dsZShhKHRoaXMpKSwhMX0pLGEodGhpcy5lbGVtZW50KS5vbihcImNsaWNrXCIsdGhpcy5vcHRpb25zLnJlbW92ZVRyaWdnZXIsZnVuY3Rpb24oYyl7cmV0dXJuIGMmJmMucHJldmVudERlZmF1bHQoKSxiLnJlbW92ZShhKHRoaXMpKSwhMX0pfTt2YXIgaT1hLmZuLmJveFdpZGdldDthLmZuLmJveFdpZGdldD1iLGEuZm4uYm94V2lkZ2V0LkNvbnN0cnVjdG9yPWgsYS5mbi5ib3hXaWRnZXQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmJveFdpZGdldD1pLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoZS5kYXRhKS5lYWNoKGZ1bmN0aW9uKCl7Yi5jYWxsKGEodGhpcykpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKGMpO2lmKCFmKXt2YXIgZz1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxmPW5ldyBoKGUsZykpfVwic3RyaW5nXCI9PXR5cGVvZiBiJiZmLnRvZ2dsZSgpfSl9dmFyIGM9XCJsdGUuY29udHJvbHNpZGViYXJcIixkPXtzbGlkZTohMH0sZT17c2lkZWJhcjpcIi5jb250cm9sLXNpZGViYXJcIixkYXRhOidbZGF0YS10b2dnbGU9XCJjb250cm9sLXNpZGViYXJcIl0nLG9wZW46XCIuY29udHJvbC1zaWRlYmFyLW9wZW5cIixiZzpcIi5jb250cm9sLXNpZGViYXItYmdcIix3cmFwcGVyOlwiLndyYXBwZXJcIixjb250ZW50OlwiLmNvbnRlbnQtd3JhcHBlclwiLGJveGVkOlwiLmxheW91dC1ib3hlZFwifSxmPXtvcGVuOlwiY29udHJvbC1zaWRlYmFyLW9wZW5cIixmaXhlZDpcImZpeGVkXCJ9LGc9e2NvbGxhcHNlZDpcImNvbGxhcHNlZC5jb250cm9sc2lkZWJhclwiLGV4cGFuZGVkOlwiZXhwYW5kZWQuY29udHJvbHNpZGViYXJcIn0saD1mdW5jdGlvbihhLGIpe3RoaXMuZWxlbWVudD1hLHRoaXMub3B0aW9ucz1iLHRoaXMuaGFzQmluZGVkUmVzaXplPSExLHRoaXMuaW5pdCgpfTtoLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLmlzKGUuZGF0YSl8fGEodGhpcykub24oXCJjbGlja1wiLHRoaXMudG9nZ2xlKSx0aGlzLmZpeCgpLGEod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXt0aGlzLmZpeCgpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKGIpe2ImJmIucHJldmVudERlZmF1bHQoKSx0aGlzLmZpeCgpLGEoZS5zaWRlYmFyKS5pcyhlLm9wZW4pfHxhKFwiYm9keVwiKS5pcyhlLm9wZW4pP3RoaXMuY29sbGFwc2UoKTp0aGlzLmV4cGFuZCgpfSxoLnByb3RvdHlwZS5leHBhbmQ9ZnVuY3Rpb24oKXt0aGlzLm9wdGlvbnMuc2xpZGU/YShlLnNpZGViYXIpLmFkZENsYXNzKGYub3Blbik6YShcImJvZHlcIikuYWRkQ2xhc3MoZi5vcGVuKSxhKHRoaXMuZWxlbWVudCkudHJpZ2dlcihhLkV2ZW50KGcuZXhwYW5kZWQpKX0saC5wcm90b3R5cGUuY29sbGFwc2U9ZnVuY3Rpb24oKXthKFwiYm9keSwgXCIrZS5zaWRlYmFyKS5yZW1vdmVDbGFzcyhmLm9wZW4pLGEodGhpcy5lbGVtZW50KS50cmlnZ2VyKGEuRXZlbnQoZy5jb2xsYXBzZWQpKX0saC5wcm90b3R5cGUuZml4PWZ1bmN0aW9uKCl7YShcImJvZHlcIikuaXMoZS5ib3hlZCkmJnRoaXMuX2ZpeEZvckJveGVkKGEoZS5iZykpfSxoLnByb3RvdHlwZS5fZml4Rm9yQm94ZWQ9ZnVuY3Rpb24oYil7Yi5jc3Moe3Bvc2l0aW9uOlwiYWJzb2x1dGVcIixoZWlnaHQ6YShlLndyYXBwZXIpLmhlaWdodCgpfSl9O3ZhciBpPWEuZm4uY29udHJvbFNpZGViYXI7YS5mbi5jb250cm9sU2lkZWJhcj1iLGEuZm4uY29udHJvbFNpZGViYXIuQ29uc3RydWN0b3I9aCxhLmZuLmNvbnRyb2xTaWRlYmFyLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5jb250cm9sU2lkZWJhcj1pLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIixlLmRhdGEsZnVuY3Rpb24oYyl7YyYmYy5wcmV2ZW50RGVmYXVsdCgpLGIuY2FsbChhKHRoaXMpLFwidG9nZ2xlXCIpfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGQ9YSh0aGlzKSxlPWQuZGF0YShjKTtlfHxkLmRhdGEoYyxlPW5ldyBmKGQpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZS50b2dnbGUoZCl9KX12YXIgYz1cImx0ZS5kaXJlY3RjaGF0XCIsZD17ZGF0YTonW2RhdGEtd2lkZ2V0PVwiY2hhdC1wYW5lLXRvZ2dsZVwiXScsYm94OlwiLmRpcmVjdC1jaGF0XCJ9LGU9e29wZW46XCJkaXJlY3QtY2hhdC1jb250YWN0cy1vcGVuXCJ9LGY9ZnVuY3Rpb24oYSl7dGhpcy5lbGVtZW50PWF9O2YucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihhKXthLnBhcmVudHMoZC5ib3gpLmZpcnN0KCkudG9nZ2xlQ2xhc3MoZS5vcGVuKX07dmFyIGc9YS5mbi5kaXJlY3RDaGF0O2EuZm4uZGlyZWN0Q2hhdD1iLGEuZm4uZGlyZWN0Q2hhdC5Db25zdHJ1Y3Rvcj1mLGEuZm4uZGlyZWN0Q2hhdC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uZGlyZWN0Q2hhdD1nLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIixkLmRhdGEsZnVuY3Rpb24oYyl7YyYmYy5wcmV2ZW50RGVmYXVsdCgpLGIuY2FsbChhKHRoaXMpLFwidG9nZ2xlXCIpfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGg9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgZyhoKSl9aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe2lmKHZvaWQgMD09PWZbYl0pdGhyb3cgbmV3IEVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFwiK2IpO2ZbYl0oKX19KX12YXIgYz1cImx0ZS5sYXlvdXRcIixkPXtzbGltc2Nyb2xsOiEwLHJlc2V0SGVpZ2h0OiEwfSxlPXt3cmFwcGVyOlwiLndyYXBwZXJcIixjb250ZW50V3JhcHBlcjpcIi5jb250ZW50LXdyYXBwZXJcIixsYXlvdXRCb3hlZDpcIi5sYXlvdXQtYm94ZWRcIixtYWluRm9vdGVyOlwiLm1haW4tZm9vdGVyXCIsbWFpbkhlYWRlcjpcIi5tYWluLWhlYWRlclwiLHNpZGViYXI6XCIuc2lkZWJhclwiLGNvbnRyb2xTaWRlYmFyOlwiLmNvbnRyb2wtc2lkZWJhclwiLGZpeGVkOlwiLmZpeGVkXCIsc2lkZWJhck1lbnU6XCIuc2lkZWJhci1tZW51XCIsbG9nbzpcIi5tYWluLWhlYWRlciAubG9nb1wifSxmPXtmaXhlZDpcImZpeGVkXCIsaG9sZFRyYW5zaXRpb246XCJob2xkLXRyYW5zaXRpb25cIn0sZz1mdW5jdGlvbihhKXt0aGlzLm9wdGlvbnM9YSx0aGlzLmJpbmRlZFJlc2l6ZT0hMSx0aGlzLmFjdGl2YXRlKCl9O2cucHJvdG90eXBlLmFjdGl2YXRlPWZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKSxhKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhmLmhvbGRUcmFuc2l0aW9uKSx0aGlzLm9wdGlvbnMucmVzZXRIZWlnaHQmJmEoXCJib2R5LCBodG1sLCBcIitlLndyYXBwZXIpLmNzcyh7aGVpZ2h0OlwiYXV0b1wiLFwibWluLWhlaWdodFwiOlwiMTAwJVwifSksdGhpcy5iaW5kZWRSZXNpemV8fChhKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKSxhKGUubG9nbytcIiwgXCIrZS5zaWRlYmFyKS5vbmUoXCJ3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kXCIsZnVuY3Rpb24oKXt0aGlzLmZpeCgpLHRoaXMuZml4U2lkZWJhcigpfS5iaW5kKHRoaXMpKX0uYmluZCh0aGlzKSksdGhpcy5iaW5kZWRSZXNpemU9ITApLGEoZS5zaWRlYmFyTWVudSkub24oXCJleHBhbmRlZC50cmVlXCIsZnVuY3Rpb24oKXt0aGlzLmZpeCgpLHRoaXMuZml4U2lkZWJhcigpfS5iaW5kKHRoaXMpKSxhKGUuc2lkZWJhck1lbnUpLm9uKFwiY29sbGFwc2VkLnRyZWVcIixmdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCl9LmJpbmQodGhpcykpfSxnLnByb3RvdHlwZS5maXg9ZnVuY3Rpb24oKXthKGUubGF5b3V0Qm94ZWQrXCIgPiBcIitlLndyYXBwZXIpLmNzcyhcIm92ZXJmbG93XCIsXCJoaWRkZW5cIik7dmFyIGI9YShlLm1haW5Gb290ZXIpLm91dGVySGVpZ2h0KCl8fDAsYz1hKGUubWFpbkhlYWRlcikub3V0ZXJIZWlnaHQoKXx8MCxkPWMrYixnPWEod2luZG93KS5oZWlnaHQoKSxoPWEoZS5zaWRlYmFyKS5oZWlnaHQoKXx8MDtpZihhKFwiYm9keVwiKS5oYXNDbGFzcyhmLmZpeGVkKSlhKGUuY29udGVudFdyYXBwZXIpLmNzcyhcIm1pbi1oZWlnaHRcIixnLWIpO2Vsc2V7dmFyIGk7Zz49aCtjPyhhKGUuY29udGVudFdyYXBwZXIpLmNzcyhcIm1pbi1oZWlnaHRcIixnLWQpLGk9Zy1kKTooYShlLmNvbnRlbnRXcmFwcGVyKS5jc3MoXCJtaW4taGVpZ2h0XCIsaCksaT1oKTt2YXIgaj1hKGUuY29udHJvbFNpZGViYXIpO3ZvaWQgMCE9PWomJmouaGVpZ2h0KCk+aSYmYShlLmNvbnRlbnRXcmFwcGVyKS5jc3MoXCJtaW4taGVpZ2h0XCIsai5oZWlnaHQoKSl9fSxnLnByb3RvdHlwZS5maXhTaWRlYmFyPWZ1bmN0aW9uKCl7aWYoIWEoXCJib2R5XCIpLmhhc0NsYXNzKGYuZml4ZWQpKXJldHVybiB2b2lkKHZvaWQgMCE9PWEuZm4uc2xpbVNjcm9sbCYmYShlLnNpZGViYXIpLnNsaW1TY3JvbGwoe2Rlc3Ryb3k6ITB9KS5oZWlnaHQoXCJhdXRvXCIpKTt0aGlzLm9wdGlvbnMuc2xpbXNjcm9sbCYmdm9pZCAwIT09YS5mbi5zbGltU2Nyb2xsJiZhKGUuc2lkZWJhcikuc2xpbVNjcm9sbCh7aGVpZ2h0OmEod2luZG93KS5oZWlnaHQoKS1hKGUubWFpbkhlYWRlcikuaGVpZ2h0KCkrXCJweFwifSl9O3ZhciBoPWEuZm4ubGF5b3V0O2EuZm4ubGF5b3V0PWIsYS5mbi5sYXlvdXQuQ29uc3R1Y3Rvcj1nLGEuZm4ubGF5b3V0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5sYXlvdXQ9aCx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXtiLmNhbGwoYShcImJvZHlcIikpfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGc9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgaChnKSl9XCJ0b2dnbGVcIj09PWImJmYudG9nZ2xlKCl9KX12YXIgYz1cImx0ZS5wdXNobWVudVwiLGQ9e2NvbGxhcHNlU2NyZWVuU2l6ZTo3NjcsZXhwYW5kT25Ib3ZlcjohMSxleHBhbmRUcmFuc2l0aW9uRGVsYXk6MjAwfSxlPXtjb2xsYXBzZWQ6XCIuc2lkZWJhci1jb2xsYXBzZVwiLG9wZW46XCIuc2lkZWJhci1vcGVuXCIsbWFpblNpZGViYXI6XCIubWFpbi1zaWRlYmFyXCIsY29udGVudFdyYXBwZXI6XCIuY29udGVudC13cmFwcGVyXCIsc2VhcmNoSW5wdXQ6XCIuc2lkZWJhci1mb3JtIC5mb3JtLWNvbnRyb2xcIixidXR0b246J1tkYXRhLXRvZ2dsZT1cInB1c2gtbWVudVwiXScsbWluaTpcIi5zaWRlYmFyLW1pbmlcIixleHBhbmRlZDpcIi5zaWRlYmFyLWV4cGFuZGVkLW9uLWhvdmVyXCIsbGF5b3V0Rml4ZWQ6XCIuZml4ZWRcIn0sZj17Y29sbGFwc2VkOlwic2lkZWJhci1jb2xsYXBzZVwiLG9wZW46XCJzaWRlYmFyLW9wZW5cIixtaW5pOlwic2lkZWJhci1taW5pXCIsZXhwYW5kZWQ6XCJzaWRlYmFyLWV4cGFuZGVkLW9uLWhvdmVyXCIsZXhwYW5kRmVhdHVyZTpcInNpZGViYXItbWluaS1leHBhbmQtZmVhdHVyZVwiLGxheW91dEZpeGVkOlwiZml4ZWRcIn0sZz17ZXhwYW5kZWQ6XCJleHBhbmRlZC5wdXNoTWVudVwiLGNvbGxhcHNlZDpcImNvbGxhcHNlZC5wdXNoTWVudVwifSxoPWZ1bmN0aW9uKGEpe3RoaXMub3B0aW9ucz1hLHRoaXMuaW5pdCgpfTtoLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7KHRoaXMub3B0aW9ucy5leHBhbmRPbkhvdmVyfHxhKFwiYm9keVwiKS5pcyhlLm1pbmkrZS5sYXlvdXRGaXhlZCkpJiYodGhpcy5leHBhbmRPbkhvdmVyKCksYShcImJvZHlcIikuYWRkQ2xhc3MoZi5leHBhbmRGZWF0dXJlKSksYShlLmNvbnRlbnRXcmFwcGVyKS5jbGljayhmdW5jdGlvbigpe2Eod2luZG93KS53aWR0aCgpPD10aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplJiZhKFwiYm9keVwiKS5oYXNDbGFzcyhmLm9wZW4pJiZ0aGlzLmNsb3NlKCl9LmJpbmQodGhpcykpLGEoZS5zZWFyY2hJbnB1dCkuY2xpY2soZnVuY3Rpb24oYSl7YS5zdG9wUHJvcGFnYXRpb24oKX0pfSxoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt2YXIgYj1hKHdpbmRvdykud2lkdGgoKSxjPSFhKFwiYm9keVwiKS5oYXNDbGFzcyhmLmNvbGxhcHNlZCk7Yjw9dGhpcy5vcHRpb25zLmNvbGxhcHNlU2NyZWVuU2l6ZSYmKGM9YShcImJvZHlcIikuaGFzQ2xhc3MoZi5vcGVuKSksYz90aGlzLmNsb3NlKCk6dGhpcy5vcGVuKCl9LGgucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oKXthKHdpbmRvdykud2lkdGgoKT50aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplP2EoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuY29sbGFwc2VkKS50cmlnZ2VyKGEuRXZlbnQoZy5leHBhbmRlZCkpOmEoXCJib2R5XCIpLmFkZENsYXNzKGYub3BlbikudHJpZ2dlcihhLkV2ZW50KGcuZXhwYW5kZWQpKX0saC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXthKHdpbmRvdykud2lkdGgoKT50aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplP2EoXCJib2R5XCIpLmFkZENsYXNzKGYuY29sbGFwc2VkKS50cmlnZ2VyKGEuRXZlbnQoZy5jb2xsYXBzZWQpKTphKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhmLm9wZW4rXCIgXCIrZi5jb2xsYXBzZWQpLnRyaWdnZXIoYS5FdmVudChnLmNvbGxhcHNlZCkpfSxoLnByb3RvdHlwZS5leHBhbmRPbkhvdmVyPWZ1bmN0aW9uKCl7YShlLm1haW5TaWRlYmFyKS5ob3ZlcihmdW5jdGlvbigpe2EoXCJib2R5XCIpLmlzKGUubWluaStlLmNvbGxhcHNlZCkmJmEod2luZG93KS53aWR0aCgpPnRoaXMub3B0aW9ucy5jb2xsYXBzZVNjcmVlblNpemUmJnRoaXMuZXhwYW5kKCl9LmJpbmQodGhpcyksZnVuY3Rpb24oKXthKFwiYm9keVwiKS5pcyhlLmV4cGFuZGVkKSYmdGhpcy5jb2xsYXBzZSgpfS5iaW5kKHRoaXMpKX0saC5wcm90b3R5cGUuZXhwYW5kPWZ1bmN0aW9uKCl7c2V0VGltZW91dChmdW5jdGlvbigpe2EoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuY29sbGFwc2VkKS5hZGRDbGFzcyhmLmV4cGFuZGVkKX0sdGhpcy5vcHRpb25zLmV4cGFuZFRyYW5zaXRpb25EZWxheSl9LGgucHJvdG90eXBlLmNvbGxhcHNlPWZ1bmN0aW9uKCl7c2V0VGltZW91dChmdW5jdGlvbigpe2EoXCJib2R5XCIpLnJlbW92ZUNsYXNzKGYuZXhwYW5kZWQpLmFkZENsYXNzKGYuY29sbGFwc2VkKX0sdGhpcy5vcHRpb25zLmV4cGFuZFRyYW5zaXRpb25EZWxheSl9O3ZhciBpPWEuZm4ucHVzaE1lbnU7YS5mbi5wdXNoTWVudT1iLGEuZm4ucHVzaE1lbnUuQ29uc3RydWN0b3I9aCxhLmZuLnB1c2hNZW51Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5wdXNoTWVudT1pLHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIixlLmJ1dHRvbixmdW5jdGlvbihjKXtjLnByZXZlbnREZWZhdWx0KCksYi5jYWxsKGEodGhpcyksXCJ0b2dnbGVcIil9KSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXtiLmNhbGwoYShlLmJ1dHRvbikpfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGg9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgZyhlLGgpKX1pZihcInN0cmluZ1wiPT10eXBlb2YgZil7aWYodm9pZCAwPT09ZltiXSl0aHJvdyBuZXcgRXJyb3IoXCJObyBtZXRob2QgbmFtZWQgXCIrYik7ZltiXSgpfX0pfXZhciBjPVwibHRlLnRvZG9saXN0XCIsZD17b25DaGVjazpmdW5jdGlvbihhKXtyZXR1cm4gYX0sb25VbkNoZWNrOmZ1bmN0aW9uKGEpe3JldHVybiBhfX0sZT17ZGF0YTonW2RhdGEtd2lkZ2V0PVwidG9kby1saXN0XCJdJ30sZj17ZG9uZTpcImRvbmVcIn0sZz1mdW5jdGlvbihhLGIpe3RoaXMuZWxlbWVudD1hLHRoaXMub3B0aW9ucz1iLHRoaXMuX3NldFVwTGlzdGVuZXJzKCl9O2cucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihhKXtpZihhLnBhcmVudHMoZS5saSkuZmlyc3QoKS50b2dnbGVDbGFzcyhmLmRvbmUpLCFhLnByb3AoXCJjaGVja2VkXCIpKXJldHVybiB2b2lkIHRoaXMudW5DaGVjayhhKTt0aGlzLmNoZWNrKGEpfSxnLnByb3RvdHlwZS5jaGVjaz1mdW5jdGlvbihhKXt0aGlzLm9wdGlvbnMub25DaGVjay5jYWxsKGEpfSxnLnByb3RvdHlwZS51bkNoZWNrPWZ1bmN0aW9uKGEpe3RoaXMub3B0aW9ucy5vblVuQ2hlY2suY2FsbChhKX0sZy5wcm90b3R5cGUuX3NldFVwTGlzdGVuZXJzPWZ1bmN0aW9uKCl7dmFyIGI9dGhpczthKHRoaXMuZWxlbWVudCkub24oXCJjaGFuZ2UgaWZDaGFuZ2VkXCIsXCJpbnB1dDpjaGVja2JveFwiLGZ1bmN0aW9uKCl7Yi50b2dnbGUoYSh0aGlzKSl9KX07dmFyIGg9YS5mbi50b2RvTGlzdDthLmZuLnRvZG9MaXN0PWIsYS5mbi50b2RvTGlzdC5Db25zdHJ1Y3Rvcj1nLGEuZm4udG9kb0xpc3Qubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnRvZG9MaXN0PWgsdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7YShlLmRhdGEpLmVhY2goZnVuY3Rpb24oKXtiLmNhbGwoYSh0aGlzKSl9KX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyk7aWYoIWUuZGF0YShjKSl7dmFyIGY9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsbmV3IGgoZSxmKSl9fSl9dmFyIGM9XCJsdGUudHJlZVwiLGQ9e2FuaW1hdGlvblNwZWVkOjUwMCxhY2NvcmRpb246ITAsZm9sbG93TGluazohMSx0cmlnZ2VyOlwiLnRyZWV2aWV3IGFcIn0sZT17dHJlZTpcIi50cmVlXCIsdHJlZXZpZXc6XCIudHJlZXZpZXdcIix0cmVldmlld01lbnU6XCIudHJlZXZpZXctbWVudVwiLG9wZW46XCIubWVudS1vcGVuLCAuYWN0aXZlXCIsbGk6XCJsaVwiLGRhdGE6J1tkYXRhLXdpZGdldD1cInRyZWVcIl0nLGFjdGl2ZTpcIi5hY3RpdmVcIn0sZj17b3BlbjpcIm1lbnUtb3BlblwiLHRyZWU6XCJ0cmVlXCJ9LGc9e2NvbGxhcHNlZDpcImNvbGxhcHNlZC50cmVlXCIsZXhwYW5kZWQ6XCJleHBhbmRlZC50cmVlXCJ9LGg9ZnVuY3Rpb24oYixjKXt0aGlzLmVsZW1lbnQ9Yix0aGlzLm9wdGlvbnM9YyxhKHRoaXMuZWxlbWVudCkuYWRkQ2xhc3MoZi50cmVlKSxhKGUudHJlZXZpZXcrZS5hY3RpdmUsdGhpcy5lbGVtZW50KS5hZGRDbGFzcyhmLm9wZW4pLHRoaXMuX3NldFVwTGlzdGVuZXJzKCl9O2gucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEubmV4dChlLnRyZWV2aWV3TWVudSksZD1hLnBhcmVudCgpLGc9ZC5oYXNDbGFzcyhmLm9wZW4pO2QuaXMoZS50cmVldmlldykmJih0aGlzLm9wdGlvbnMuZm9sbG93TGluayYmXCIjXCIhPT1hLmF0dHIoXCJocmVmXCIpfHxiLnByZXZlbnREZWZhdWx0KCksZz90aGlzLmNvbGxhcHNlKGMsZCk6dGhpcy5leHBhbmQoYyxkKSl9LGgucHJvdG90eXBlLmV4cGFuZD1mdW5jdGlvbihiLGMpe3ZhciBkPWEuRXZlbnQoZy5leHBhbmRlZCk7aWYodGhpcy5vcHRpb25zLmFjY29yZGlvbil7dmFyIGg9Yy5zaWJsaW5ncyhlLm9wZW4pLGk9aC5jaGlsZHJlbihlLnRyZWV2aWV3TWVudSk7dGhpcy5jb2xsYXBzZShpLGgpfWMuYWRkQ2xhc3MoZi5vcGVuKSxiLnNsaWRlRG93bih0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkudHJpZ2dlcihkKX0uYmluZCh0aGlzKSl9LGgucHJvdG90eXBlLmNvbGxhcHNlPWZ1bmN0aW9uKGIsYyl7dmFyIGQ9YS5FdmVudChnLmNvbGxhcHNlZCk7Yy5yZW1vdmVDbGFzcyhmLm9wZW4pLGIuc2xpZGVVcCh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkudHJpZ2dlcihkKX0uYmluZCh0aGlzKSl9LGgucHJvdG90eXBlLl9zZXRVcExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7YSh0aGlzLmVsZW1lbnQpLm9uKFwiY2xpY2tcIix0aGlzLm9wdGlvbnMudHJpZ2dlcixmdW5jdGlvbihjKXtiLnRvZ2dsZShhKHRoaXMpLGMpfSl9O3ZhciBpPWEuZm4udHJlZTthLmZuLnRyZWU9YixhLmZuLnRyZWUuQ29uc3RydWN0b3I9aCxhLmZuLnRyZWUubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLnRyZWU9aSx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKGUuZGF0YSkuZWFjaChmdW5jdGlvbigpe2IuY2FsbChhKHRoaXMpKX0pfSl9KGpRdWVyeSk7IiwiLypcbiAqIFdlbGNvbWUgdG8geW91ciBhcHAncyBtYWluIEphdmFTY3JpcHQgZmlsZSFcbiAqXG4gKiBXZSByZWNvbW1lbmQgaW5jbHVkaW5nIHRoZSBidWlsdCB2ZXJzaW9uIG9mIHRoaXMgSmF2YVNjcmlwdCBmaWxlXG4gKiAoYW5kIGl0cyBDU1MgZmlsZSkgaW4geW91ciBiYXNlIGxheW91dCAoYmFzZS5odG1sLnR3aWcpLlxuICovXG5cbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC1kYXRlcGlja2VyL2Rpc3QvY3NzL2Jvb3RzdHJhcC1kYXRlcGlja2VyLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvZm9udC1hd2Vzb21lL2Nzcy9mb250LWF3ZXNvbWUubWluLmNzcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9Jb25pY29ucy9jc3MvaW9uaWNvbnMubWluLmNzcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC10aGVtZS5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9wbHVnaW5zL2lDaGVjay9hbGwuY3NzJyk7XG5yZXF1aXJlKCcuLi9kaXN0L2Nzcy9BZG1pbkxURS5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9kaXN0L2Nzcy9hbHQvYWRtaW5sdGUuY29tcG9uZW50cy5jc3MnKTtcbnJlcXVpcmUoJy4uL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5leHRyYS1jb21wb25lbnRzLmNzcycpO1xucmVxdWlyZSgnLi4vZGlzdC9jc3MvYWx0L2FkbWlubHRlLnBhZ2VzLmNzcycpO1xucmVxdWlyZSgnLi4vZGlzdC9jc3MvYWx0L2FkbWlubHRlLnBsdWdpbnMuY3NzJyk7XG5yZXF1aXJlKCcuLi9kaXN0L2Nzcy9za2lucy9za2luLWJsdWUuY3NzJyk7XG5yZXF1aXJlKCcuLi9jc3MvYXBwLmNzcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAubWluLmpzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL0Zsb3QvanF1ZXJ5LmZsb3QuanMnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC50aW1lLmpzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL0Zsb3QvanF1ZXJ5LmZsb3QucmVzaXplLmpzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL0Zsb3QvanF1ZXJ5LmZsb3QucGllLmpzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL0Zsb3QvanF1ZXJ5LmZsb3QuY2F0ZWdvcmllcy5qcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAtZGF0ZXBpY2tlci9kaXN0L2pzL2Jvb3RzdHJhcC1kYXRlcGlja2VyLm1pbi5qcycpO1xucmVxdWlyZSgnLi4vcGx1Z2lucy90aW1lcGlja2VyL2Jvb3RzdHJhcC10aW1lcGlja2VyLm1pbi5qcycpO1xucmVxdWlyZSgnLi4vcGx1Z2lucy9pQ2hlY2svaWNoZWNrLm1pbi5qcycpO1xucmVxdWlyZSgnLi4vZGlzdC9qcy9hZG1pbmx0ZS5taW4uanMnKTtcbnJlcXVpcmUoJy4uL2pzL2N1c3RvbS5qcycpO1xuXG5cbiIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uIChlKSB7XHJcbiAgICAkKFwibGkuY3VycmVudF9hbmNlc3RvciB1bFwiKS5jc3Moe2Rpc3BsYXk6IFwiYmxvY2tcIn0pO1xyXG4gICAgJChcImxpLmN1cnJlbnRfYW5jZXN0b3JcIikuYWRkQ2xhc3MoXCJtZW51LW9wZW5cIik7XHJcblxyXG4gICAgJChcIi5hZGRGb3JtUm93XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlID0gJCh0aGlzKS5wYXJlbnRzKCd0YWJsZScpO1xyXG4gICAgICAgIGxldCByb3dzID0gJCh0YWJsZSkuZmluZCgndHInKS5sZW5ndGg7XHJcbiAgICAgICAgbGV0IHRyID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmNsb25lKCk7XHJcbiAgICAgICAgJCh0cikuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKGksIGUpIHtcclxuICAgICAgICAgICAgbGV0IHByb3RvdHlwZSA9ICQoZSkuZGF0YSgncHJvdG90eXBlJyk7XHJcbiAgICAgICAgICAgIGlmIChwcm90b3R5cGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IHByb3RvdHlwZS5yZXBsYWNlKC9fX25hbWVfXy9nLCByb3dzKTtcclxuICAgICAgICAgICAgICAgICQoZSkuaHRtbChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodHIpLmFwcGVuZFRvKHRhYmxlKTtcclxuICAgICAgICAkKHRyKS5maW5kKFwiLmFkZEZvcm1Sb3dcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgJCh0cikuZmluZChcIi5yZW1vdmVSb3dcIikuc2hvdygpO1xyXG4gICAgICAgICQodHIpLmZpbmQoXCIucmVtb3ZlUm93XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoXCIucmVtb3ZlUm93XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIltkYXRhLWNoYW5nZS1sYWJlbF1cIikuZWFjaCgoaSwgZSkgPT4ge1xyXG4gICAgICAgIGxldCBwYXJlbnRNb2RhbCA9ICQoZSkucGFyZW50cygnLm1vZGFsJyk7XHJcblxyXG4gICAgICAgIGlmICgkKGUpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgJChwYXJlbnRNb2RhbCkuZmluZCgnW2RhdGEtdG9nZ2xlLW9uPVwiJyArICQoZSkuYXR0cignbmFtZScpICsgJ1wiXScpLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS10b2dnbGUtb249XCInICsgJChlKS5hdHRyKCduYW1lJykgKyAnXCJdJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS1kZXBlbmRzPVwiJyArICQoZSkuYXR0cignbmFtZScpICsgJ1wiXScpLnRleHQoJChlKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcbiAgICAgICAgJChlKS5jaGFuZ2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgkKGUpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkpIHtcclxuICAgICAgICAgICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLXRvZ2dsZS1vbj1cIicgKyAkKGUpLmF0dHIoJ25hbWUnKSArICdcIl0nKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS10b2dnbGUtb249XCInICsgJChlKS5hdHRyKCduYW1lJykgKyAnXCJdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLWRlcGVuZHM9XCInICsgJChlKS5hdHRyKCduYW1lJykgKyAnXCJdJykudGV4dCgkKGUpLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgICQoXCJbZGF0YS1jb25maXJtXVwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICh3aW5kb3cuY29uZmlybSgkKHRoaXMpLmRhdGEoJ2NvbmZpcm0nKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgJCgnW2RhdGEtcGFyZW50XScpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IG1vZGFsID0gJCgkKHRoaXMpLmRhdGEoJ3RhcmdldCcpKTtcclxuICAgICAgICAkKG1vZGFsKS5maW5kKCdbbmFtZT1cIicgKyAkKG1vZGFsKS5hdHRyKCdpZCcpICsgJ1twYXJlbnRfaWRdXCJdJykudmFsKCQodGhpcykuZGF0YSgncGFyZW50JykpO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKFwiLm1vZGFsLmFwcGVuZFRvQ29sbGVjdGlvblwiKS5vbignc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbGV0IG5yID0gJCgnW2RhdGEtY29sbGVjdGlvbj1cIicgKyAkKHRoaXMpLmRhdGEoJ2FwcGVuZCcpICsgJ1wiXScpLmxlbmd0aDtcclxuICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0LHN1Ym1pdCxzZWxlY3Qsb3B0aW9uLHRleHRhcmVhJykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xyXG4gICAgICAgICAgICBpZiAoJChlKS5hdHRyKCduYW1lJykgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAkKGUpLmF0dHIoJ25hbWUnLCAkKGUpLmF0dHIoJ25hbWUnKS5yZXBsYWNlKC9fX25hbWVfXy9nLCBucikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2Zvcm0uYWpheCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSh0aGlzKTtcclxuICAgICAgICB2YXIgZm9ybSA9IHRoaXM7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAkKHRoaXMpLmRhdGEoJ3ZhbGlkYXRlJyksXHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5lcnJvciAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChkYXRhLmVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaWQgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vZGFsID0gJChmb3JtKS5wYXJlbnRzKCcubW9kYWwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdCA9ICQoJ1tkYXRhLXRhcmdldD1cIiMnICsgJChtb2RhbCkuYXR0cihcImlkXCIpICsgJ1wiXScpLnBhcmVudHMoJy5mb3JtLWdyb3VwJykuZmluZCgnc2VsZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZWN0KS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5wcm9wKFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJzxvcHRpb24gdmFsdWU9XCInICsgZGF0YS5pZCArICdcIj4nICsgZGF0YS5sYWJlbCArICc8L29wdGlvbj4nKS5hcHBlbmRUbyhzZWxlY3QpLnByb3AoXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChtb2RhbCkuZmluZCgnW2RhdGEtZGlzbWlzc10nKS5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuXHJcbiAgICAkKFwiaW5wdXQ6ZmlsZVtkYXRhLXZhbGlkYXRlXVwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBmb3JtID0gJCh0aGlzKS5wYXJlbnRzKFwiZm9ybVwiKTtcclxuICAgICAgICB2YXIgbW9kYWwgPSAkKHRoaXMpLnBhcmVudHMoXCIubW9kYWxcIik7XHJcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBuZXcgRm9ybURhdGEoZm9ybVswXSk7XHJcbiAgICAgICAgbGV0IGRhdGEyID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZGF0YTIuYXBwZW5kKCdmaWxlJywgZGF0YS5nZXQobmFtZSkpO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogJCh0aGlzKS5kYXRhKCd2YWxpZGF0ZScpLFxyXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEyLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmVycm9yICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGFibGUgPSAkKG1vZGFsKS5maW5kKCd0YWJsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGFibGUpLmZpbmQoXCJ0clwiKS5lYWNoKChpLCBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiBkYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJvd3MgPSAkKHRhYmxlKS5maW5kKCd0cicpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRyID0gJCh0YWJsZSkuZmluZCgndHInKS5maXJzdCgpLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmFwcGVuZFRvKHRhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZChcIi5hZGRGb3JtUm93XCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKFwiLnJlbW92ZVJvd1wiKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoXCIucmVtb3ZlUm93XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKGksIGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm90b3R5cGUgPSAkKGUpLmRhdGEoJ3Byb3RvdHlwZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IHByb3RvdHlwZS5yZXBsYWNlKC9fX25hbWVfXy9nLCByb3dzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGUpLmh0bWwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZCgnLnZhbHVlJykudmFsKGRhdGEuZGF0YVtpXS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoJy5yZWxhdGVkX3ZhbHVlX1gnKS52YWwoZGF0YS5kYXRhW2ldLnJlbGF0ZWRfdmFsdWVfWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoJy5yZWxhdGVkX3ZhbHVlX1knKS52YWwoZGF0YS5kYXRhW2ldLnJlbGF0ZWRfdmFsdWVfWSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoJy5yZWxhdGVkX3ZhbHVlX1onKS52YWwoZGF0YS5kYXRhW2ldLnJlbGF0ZWRfdmFsdWVfWik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoJy50aW1lJykudmFsKGRhdGEuZGF0YVtpXS50aW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiW2RhdGEtdG9nZ2xlPSdjaGFydCddXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgaWRzID0gW107XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcucmVjb3JkcycpLmZpbmQoXCJbZGF0YS10b2dnbGU9J2NoYXJ0J11cIikuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xyXG4gICAgICAgICAgICBpZiAoJChlKS5pcygnOmNoZWNrZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWRzLnB1c2goJChlKS5kYXRhKCdyZWNvcmQnKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBkcmF3Q2hhcnQoJCgkKHRoaXMpLmRhdGEoJ3RhcmdldCcpKSwgaWRzKTtcclxuICAgIH0pXHJcblxyXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKVxyXG5cclxufSlcclxuXHJcbiQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXS5taW5pbWFsLCBpbnB1dFt0eXBlPVwicmFkaW9cIl0ubWluaW1hbCcpLmlDaGVjayh7XHJcbiAgICBjaGVja2JveENsYXNzOiAnaWNoZWNrYm94X21pbmltYWwtYmx1ZScsXHJcbiAgICByYWRpb0NsYXNzOiAnaXJhZGlvX21pbmltYWwtYmx1ZSdcclxufSlcclxuXHJcbiQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXS5hcHBlbmQtcnVuJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAkLmFqYXgoJCh0aGlzKS5kYXRhKCdsaW5rJyksIHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIGRhdGE6IHsncnVuX2lkJzogJCh0aGlzKS52YWwoKX0sXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZHJhd0NoYXJ0KGVsZW1lbnQsIGlkcykge1xyXG4gICAgdmFyIGRhdGEgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29tYm9DaGFydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgkKGVsZW1lbnQpLmF0dHIoJ2lkJykpKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICBiYXI6IHtncm91cFdpZHRoOiBcIjEwMCVcIn0sXHJcbiAgICAgICAgY3VydmVUeXBlOiAnZnVuY3Rpb24nLFxyXG4gICAgICAgIHNlcmllc1R5cGU6ICdsaW5lJyxcclxuICAgICAgICBzZXJpZXM6IHt9LFxyXG4gICAgICAgIGxlZ2VuZDoge3Bvc2l0aW9uOiAnYm90dG9tJ30sXHJcbiAgICAgICAgdkF4ZXM6IHtcclxuICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAxXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDE6IHtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogLTFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJC5hamF4KCQoZWxlbWVudCkuZGF0YSgnZGF0YWxpbmsnKSwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBkYXRhOiB7J2lkcyc6IGlkc30sXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIucmVzcG9uc2VUZXh0ICE9ICcwJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkucGFyZW50cygnLmNoYXJ0LWJveCcpLmZpbmQoJy5ib3gtYm9keScpLmNvbGxhcHNlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGpzb24gPSB4aHIucmVzcG9uc2VKU09OO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiBqc29uWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuYWRkQ29sdW1uKGpzb25bMF1baV1bMF0sIGpzb25bMF1baV1bMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zZXJpZXNbaSAtIDFdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzW2kgLSAxXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25bMF1baV1bM10gIT0gdW5kZWZpbmVkICYmIGpzb25bMF1baV1bM10gPT0gJ3ByZWNpcCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllc1tpIC0gMV0udGFyZ2V0QXhpc0luZGV4ID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllc1tpIC0gMV0uYmFja2dyb3VuZENvbG9yID0gJyM2NmJjNDAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllc1tpIC0gMV0udGFyZ2V0QXhpc0luZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uWzBdW2ldWzJdICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzW2kgLSAxXS50eXBlID0ganNvblswXVtpXVsyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmFkZFJvd3MoanNvblsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5wYXJlbnRzKCcuY2hhcnQtYm94JykuZmluZCgnLmJveC1ib2R5JykuY29sbGFwc2UoJ2hpZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFydC5jbGVhckNoYXJ0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG59XHJcblxyXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCIvKiEgaUNoZWNrIHYxLjAuMSBieSBEYW1pciBTdWx0YW5vdiwgaHR0cDovL2dpdC5pby9hcmx6ZUEsIE1JVCBMaWNlbnNlZCAqL1xuKGZ1bmN0aW9uKGgpe2Z1bmN0aW9uIEYoYSxiLGQpe3ZhciBjPWFbMF0sZT0vZXIvLnRlc3QoZCk/bTovYmwvLnRlc3QoZCk/czpsLGY9ZD09SD97Y2hlY2tlZDpjW2xdLGRpc2FibGVkOmNbc10saW5kZXRlcm1pbmF0ZTpcInRydWVcIj09YS5hdHRyKG0pfHxcImZhbHNlXCI9PWEuYXR0cih3KX06Y1tlXTtpZigvXihjaHxkaXxpbikvLnRlc3QoZCkmJiFmKUQoYSxlKTtlbHNlIGlmKC9eKHVufGVufGRlKS8udGVzdChkKSYmZil0KGEsZSk7ZWxzZSBpZihkPT1IKWZvcihlIGluIGYpZltlXT9EKGEsZSwhMCk6dChhLGUsITApO2Vsc2UgaWYoIWJ8fFwidG9nZ2xlXCI9PWQpe2lmKCFiKWFbcF0oXCJpZkNsaWNrZWRcIik7Zj9jW25dIT09dSYmdChhLGUpOkQoYSxlKX19ZnVuY3Rpb24gRChhLGIsZCl7dmFyIGM9YVswXSxlPWEucGFyZW50KCksZj1iPT1sLEE9Yj09bSxCPWI9PXMsSz1BP3c6Zj9FOlwiZW5hYmxlZFwiLHA9ayhhLEsreChjW25dKSksTj1rKGEsYit4KGNbbl0pKTtpZighMCE9PWNbYl0pe2lmKCFkJiZcbmI9PWwmJmNbbl09PXUmJmMubmFtZSl7dmFyIEM9YS5jbG9zZXN0KFwiZm9ybVwiKSxyPSdpbnB1dFtuYW1lPVwiJytjLm5hbWUrJ1wiXScscj1DLmxlbmd0aD9DLmZpbmQocik6aChyKTtyLmVhY2goZnVuY3Rpb24oKXt0aGlzIT09YyYmaCh0aGlzKS5kYXRhKHEpJiZ0KGgodGhpcyksYil9KX1BPyhjW2JdPSEwLGNbbF0mJnQoYSxsLFwiZm9yY2VcIikpOihkfHwoY1tiXT0hMCksZiYmY1ttXSYmdChhLG0sITEpKTtMKGEsZixiLGQpfWNbc10mJmsoYSx5LCEwKSYmZS5maW5kKFwiLlwiK0kpLmNzcyh5LFwiZGVmYXVsdFwiKTtlW3ZdKE58fGsoYSxiKXx8XCJcIik7Qj9lLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJ0cnVlXCIpOmUuYXR0cihcImFyaWEtY2hlY2tlZFwiLEE/XCJtaXhlZFwiOlwidHJ1ZVwiKTtlW3pdKHB8fGsoYSxLKXx8XCJcIil9ZnVuY3Rpb24gdChhLGIsZCl7dmFyIGM9YVswXSxlPWEucGFyZW50KCksZj1iPT1sLGg9Yj09bSxxPWI9PXMscD1oP3c6Zj9FOlwiZW5hYmxlZFwiLHQ9ayhhLHAreChjW25dKSksXG51PWsoYSxiK3goY1tuXSkpO2lmKCExIT09Y1tiXSl7aWYoaHx8IWR8fFwiZm9yY2VcIj09ZCljW2JdPSExO0woYSxmLHAsZCl9IWNbc10mJmsoYSx5LCEwKSYmZS5maW5kKFwiLlwiK0kpLmNzcyh5LFwicG9pbnRlclwiKTtlW3pdKHV8fGsoYSxiKXx8XCJcIik7cT9lLmF0dHIoXCJhcmlhLWRpc2FibGVkXCIsXCJmYWxzZVwiKTplLmF0dHIoXCJhcmlhLWNoZWNrZWRcIixcImZhbHNlXCIpO2Vbdl0odHx8ayhhLHApfHxcIlwiKX1mdW5jdGlvbiBNKGEsYil7aWYoYS5kYXRhKHEpKXthLnBhcmVudCgpLmh0bWwoYS5hdHRyKFwic3R5bGVcIixhLmRhdGEocSkuc3x8XCJcIikpO2lmKGIpYVtwXShiKTthLm9mZihcIi5pXCIpLnVud3JhcCgpO2goRysnW2Zvcj1cIicrYVswXS5pZCsnXCJdJykuYWRkKGEuY2xvc2VzdChHKSkub2ZmKFwiLmlcIil9fWZ1bmN0aW9uIGsoYSxiLGQpe2lmKGEuZGF0YShxKSlyZXR1cm4gYS5kYXRhKHEpLm9bYisoZD9cIlwiOlwiQ2xhc3NcIildfWZ1bmN0aW9uIHgoYSl7cmV0dXJuIGEuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrXG5hLnNsaWNlKDEpfWZ1bmN0aW9uIEwoYSxiLGQsYyl7aWYoIWMpe2lmKGIpYVtwXShcImlmVG9nZ2xlZFwiKTthW3BdKFwiaWZDaGFuZ2VkXCIpW3BdKFwiaWZcIit4KGQpKX19dmFyIHE9XCJpQ2hlY2tcIixJPXErXCItaGVscGVyXCIsdT1cInJhZGlvXCIsbD1cImNoZWNrZWRcIixFPVwidW5cIitsLHM9XCJkaXNhYmxlZFwiLHc9XCJkZXRlcm1pbmF0ZVwiLG09XCJpblwiK3csSD1cInVwZGF0ZVwiLG49XCJ0eXBlXCIsdj1cImFkZENsYXNzXCIsej1cInJlbW92ZUNsYXNzXCIscD1cInRyaWdnZXJcIixHPVwibGFiZWxcIix5PVwiY3Vyc29yXCIsSj0vaXBhZHxpcGhvbmV8aXBvZHxhbmRyb2lkfGJsYWNrYmVycnl8d2luZG93cyBwaG9uZXxvcGVyYSBtaW5pfHNpbGsvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2guZm5bcV09ZnVuY3Rpb24oYSxiKXt2YXIgZD0naW5wdXRbdHlwZT1cImNoZWNrYm94XCJdLCBpbnB1dFt0eXBlPVwiJyt1KydcIl0nLGM9aCgpLGU9ZnVuY3Rpb24oYSl7YS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGE9aCh0aGlzKTtjPWEuaXMoZCk/XG5jLmFkZChhKTpjLmFkZChhLmZpbmQoZCkpfSl9O2lmKC9eKGNoZWNrfHVuY2hlY2t8dG9nZ2xlfGluZGV0ZXJtaW5hdGV8ZGV0ZXJtaW5hdGV8ZGlzYWJsZXxlbmFibGV8dXBkYXRlfGRlc3Ryb3kpJC9pLnRlc3QoYSkpcmV0dXJuIGE9YS50b0xvd2VyQ2FzZSgpLGUodGhpcyksYy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9aCh0aGlzKTtcImRlc3Ryb3lcIj09YT9NKGMsXCJpZkRlc3Ryb3llZFwiKTpGKGMsITAsYSk7aC5pc0Z1bmN0aW9uKGIpJiZiKCl9KTtpZihcIm9iamVjdFwiIT10eXBlb2YgYSYmYSlyZXR1cm4gdGhpczt2YXIgZj1oLmV4dGVuZCh7Y2hlY2tlZENsYXNzOmwsZGlzYWJsZWRDbGFzczpzLGluZGV0ZXJtaW5hdGVDbGFzczptLGxhYmVsSG92ZXI6ITAsYXJpYTohMX0sYSksaz1mLmhhbmRsZSxCPWYuaG92ZXJDbGFzc3x8XCJob3ZlclwiLHg9Zi5mb2N1c0NsYXNzfHxcImZvY3VzXCIsdz1mLmFjdGl2ZUNsYXNzfHxcImFjdGl2ZVwiLHk9ISFmLmxhYmVsSG92ZXIsQz1mLmxhYmVsSG92ZXJDbGFzc3x8XG5cImhvdmVyXCIscj0oXCJcIitmLmluY3JlYXNlQXJlYSkucmVwbGFjZShcIiVcIixcIlwiKXwwO2lmKFwiY2hlY2tib3hcIj09a3x8az09dSlkPSdpbnB1dFt0eXBlPVwiJytrKydcIl0nOy01MD5yJiYocj0tNTApO2UodGhpcyk7cmV0dXJuIGMuZWFjaChmdW5jdGlvbigpe3ZhciBhPWgodGhpcyk7TShhKTt2YXIgYz10aGlzLGI9Yy5pZCxlPS1yK1wiJVwiLGQ9MTAwKzIqcitcIiVcIixkPXtwb3NpdGlvbjpcImFic29sdXRlXCIsdG9wOmUsbGVmdDplLGRpc3BsYXk6XCJibG9ja1wiLHdpZHRoOmQsaGVpZ2h0OmQsbWFyZ2luOjAscGFkZGluZzowLGJhY2tncm91bmQ6XCIjZmZmXCIsYm9yZGVyOjAsb3BhY2l0eTowfSxlPUo/e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix2aXNpYmlsaXR5OlwiaGlkZGVuXCJ9OnI/ZDp7cG9zaXRpb246XCJhYnNvbHV0ZVwiLG9wYWNpdHk6MH0saz1cImNoZWNrYm94XCI9PWNbbl0/Zi5jaGVja2JveENsYXNzfHxcImljaGVja2JveFwiOmYucmFkaW9DbGFzc3x8XCJpXCIrdSxtPWgoRysnW2Zvcj1cIicrYisnXCJdJykuYWRkKGEuY2xvc2VzdChHKSksXG5BPSEhZi5hcmlhLEU9cStcIi1cIitNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5yZXBsYWNlKFwiMC5cIixcIlwiKSxnPSc8ZGl2IGNsYXNzPVwiJytrKydcIiAnKyhBPydyb2xlPVwiJytjW25dKydcIiAnOlwiXCIpO20ubGVuZ3RoJiZBJiZtLmVhY2goZnVuY3Rpb24oKXtnKz0nYXJpYS1sYWJlbGxlZGJ5PVwiJzt0aGlzLmlkP2crPXRoaXMuaWQ6KHRoaXMuaWQ9RSxnKz1FKTtnKz0nXCInfSk7Zz1hLndyYXAoZytcIi8+XCIpW3BdKFwiaWZDcmVhdGVkXCIpLnBhcmVudCgpLmFwcGVuZChmLmluc2VydCk7ZD1oKCc8aW5zIGNsYXNzPVwiJytJKydcIi8+JykuY3NzKGQpLmFwcGVuZFRvKGcpO2EuZGF0YShxLHtvOmYsczphLmF0dHIoXCJzdHlsZVwiKX0pLmNzcyhlKTtmLmluaGVyaXRDbGFzcyYmZ1t2XShjLmNsYXNzTmFtZXx8XCJcIik7Zi5pbmhlcml0SUQmJmImJmcuYXR0cihcImlkXCIscStcIi1cIitiKTtcInN0YXRpY1wiPT1nLmNzcyhcInBvc2l0aW9uXCIpJiZnLmNzcyhcInBvc2l0aW9uXCIsXCJyZWxhdGl2ZVwiKTtGKGEsITAsSCk7XG5pZihtLmxlbmd0aCltLm9uKFwiY2xpY2suaSBtb3VzZW92ZXIuaSBtb3VzZW91dC5pIHRvdWNoYmVnaW4uaSB0b3VjaGVuZC5pXCIsZnVuY3Rpb24oYil7dmFyIGQ9YltuXSxlPWgodGhpcyk7aWYoIWNbc10pe2lmKFwiY2xpY2tcIj09ZCl7aWYoaChiLnRhcmdldCkuaXMoXCJhXCIpKXJldHVybjtGKGEsITEsITApfWVsc2UgeSYmKC91dHxuZC8udGVzdChkKT8oZ1t6XShCKSxlW3pdKEMpKTooZ1t2XShCKSxlW3ZdKEMpKSk7aWYoSiliLnN0b3BQcm9wYWdhdGlvbigpO2Vsc2UgcmV0dXJuITF9fSk7YS5vbihcImNsaWNrLmkgZm9jdXMuaSBibHVyLmkga2V5dXAuaSBrZXlkb3duLmkga2V5cHJlc3MuaVwiLGZ1bmN0aW9uKGIpe3ZhciBkPWJbbl07Yj1iLmtleUNvZGU7aWYoXCJjbGlja1wiPT1kKXJldHVybiExO2lmKFwia2V5ZG93blwiPT1kJiYzMj09YilyZXR1cm4gY1tuXT09dSYmY1tsXXx8KGNbbF0/dChhLGwpOkQoYSxsKSksITE7aWYoXCJrZXl1cFwiPT1kJiZjW25dPT11KSFjW2xdJiZEKGEsbCk7ZWxzZSBpZigvdXN8dXIvLnRlc3QoZCkpZ1tcImJsdXJcIj09XG5kP3o6dl0oeCl9KTtkLm9uKFwiY2xpY2sgbW91c2Vkb3duIG1vdXNldXAgbW91c2VvdmVyIG1vdXNlb3V0IHRvdWNoYmVnaW4uaSB0b3VjaGVuZC5pXCIsZnVuY3Rpb24oYil7dmFyIGQ9YltuXSxlPS93bnx1cC8udGVzdChkKT93OkI7aWYoIWNbc10pe2lmKFwiY2xpY2tcIj09ZClGKGEsITEsITApO2Vsc2V7aWYoL3dufGVyfGluLy50ZXN0KGQpKWdbdl0oZSk7ZWxzZSBnW3pdKGUrXCIgXCIrdyk7aWYobS5sZW5ndGgmJnkmJmU9PUIpbVsvdXR8bmQvLnRlc3QoZCk/ejp2XShDKX1pZihKKWIuc3RvcFByb3BhZ2F0aW9uKCk7ZWxzZSByZXR1cm4hMX19KX0pfX0pKHdpbmRvdy5qUXVlcnl8fHdpbmRvdy5aZXB0byk7XG4iLCIvKiEgYm9vdHN0cmFwLXRpbWVwaWNrZXIgdjAuNS4yIFxuKiBodHRwOi8vamRld2l0LmdpdGh1Yi5jb20vYm9vdHN0cmFwLXRpbWVwaWNrZXIgXG4qIENvcHlyaWdodCAoYykgMjAxNiBKb3JpcyBkZSBXaXQgYW5kIGJvb3RzdHJhcC10aW1lcGlja2VyIGNvbnRyaWJ1dG9ycyBcbiogTUlUIExpY2Vuc2UgXG4qLyFmdW5jdGlvbihhLGIsYyl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGQ9ZnVuY3Rpb24oYixjKXt0aGlzLndpZGdldD1cIlwiLHRoaXMuJGVsZW1lbnQ9YShiKSx0aGlzLmRlZmF1bHRUaW1lPWMuZGVmYXVsdFRpbWUsdGhpcy5kaXNhYmxlRm9jdXM9Yy5kaXNhYmxlRm9jdXMsdGhpcy5kaXNhYmxlTW91c2V3aGVlbD1jLmRpc2FibGVNb3VzZXdoZWVsLHRoaXMuaXNPcGVuPWMuaXNPcGVuLHRoaXMubWludXRlU3RlcD1jLm1pbnV0ZVN0ZXAsdGhpcy5tb2RhbEJhY2tkcm9wPWMubW9kYWxCYWNrZHJvcCx0aGlzLm9yaWVudGF0aW9uPWMub3JpZW50YXRpb24sdGhpcy5zZWNvbmRTdGVwPWMuc2Vjb25kU3RlcCx0aGlzLnNuYXBUb1N0ZXA9Yy5zbmFwVG9TdGVwLHRoaXMuc2hvd0lucHV0cz1jLnNob3dJbnB1dHMsdGhpcy5zaG93TWVyaWRpYW49Yy5zaG93TWVyaWRpYW4sdGhpcy5zaG93U2Vjb25kcz1jLnNob3dTZWNvbmRzLHRoaXMudGVtcGxhdGU9Yy50ZW1wbGF0ZSx0aGlzLmFwcGVuZFdpZGdldFRvPWMuYXBwZW5kV2lkZ2V0VG8sdGhpcy5zaG93V2lkZ2V0T25BZGRvbkNsaWNrPWMuc2hvd1dpZGdldE9uQWRkb25DbGljayx0aGlzLmljb25zPWMuaWNvbnMsdGhpcy5tYXhIb3Vycz1jLm1heEhvdXJzLHRoaXMuZXhwbGljaXRNb2RlPWMuZXhwbGljaXRNb2RlLHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljaz1mdW5jdGlvbihhKXt2YXIgYj1hLmRhdGEuc2NvcGU7Yi4kZWxlbWVudC5wYXJlbnQoKS5maW5kKGEudGFyZ2V0KS5sZW5ndGh8fGIuJHdpZGdldC5pcyhhLnRhcmdldCl8fGIuJHdpZGdldC5maW5kKGEudGFyZ2V0KS5sZW5ndGh8fGIuaGlkZVdpZGdldCgpfSx0aGlzLl9pbml0KCl9O2QucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpkLF9pbml0OmZ1bmN0aW9uKCl7dmFyIGI9dGhpczt0aGlzLnNob3dXaWRnZXRPbkFkZG9uQ2xpY2smJnRoaXMuJGVsZW1lbnQucGFyZW50KCkuaGFzQ2xhc3MoXCJpbnB1dC1ncm91cFwiKSYmdGhpcy4kZWxlbWVudC5wYXJlbnQoKS5oYXNDbGFzcyhcImJvb3RzdHJhcC10aW1lcGlja2VyXCIpPyh0aGlzLiRlbGVtZW50LnBhcmVudChcIi5pbnB1dC1ncm91cC5ib290c3RyYXAtdGltZXBpY2tlclwiKS5maW5kKFwiLmlucHV0LWdyb3VwLWFkZG9uXCIpLm9uKHtcImNsaWNrLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuc2hvd1dpZGdldCx0aGlzKX0pLHRoaXMuJGVsZW1lbnQub24oe1wiZm9jdXMudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5oaWdobGlnaHRVbml0LHRoaXMpLFwiY2xpY2sudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5oaWdobGlnaHRVbml0LHRoaXMpLFwia2V5ZG93bi50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmVsZW1lbnRLZXlkb3duLHRoaXMpLFwiYmx1ci50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmJsdXJFbGVtZW50LHRoaXMpLFwibW91c2V3aGVlbC50aW1lcGlja2VyIERPTU1vdXNlU2Nyb2xsLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMubW91c2V3aGVlbCx0aGlzKX0pKTp0aGlzLnRlbXBsYXRlP3RoaXMuJGVsZW1lbnQub24oe1wiZm9jdXMudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5zaG93V2lkZ2V0LHRoaXMpLFwiY2xpY2sudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5zaG93V2lkZ2V0LHRoaXMpLFwiYmx1ci50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmJsdXJFbGVtZW50LHRoaXMpLFwibW91c2V3aGVlbC50aW1lcGlja2VyIERPTU1vdXNlU2Nyb2xsLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMubW91c2V3aGVlbCx0aGlzKX0pOnRoaXMuJGVsZW1lbnQub24oe1wiZm9jdXMudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5oaWdobGlnaHRVbml0LHRoaXMpLFwiY2xpY2sudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5oaWdobGlnaHRVbml0LHRoaXMpLFwia2V5ZG93bi50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmVsZW1lbnRLZXlkb3duLHRoaXMpLFwiYmx1ci50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLmJsdXJFbGVtZW50LHRoaXMpLFwibW91c2V3aGVlbC50aW1lcGlja2VyIERPTU1vdXNlU2Nyb2xsLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMubW91c2V3aGVlbCx0aGlzKX0pLHRoaXMudGVtcGxhdGUhPT0hMT90aGlzLiR3aWRnZXQ9YSh0aGlzLmdldFRlbXBsYXRlKCkpLm9uKFwiY2xpY2tcIixhLnByb3h5KHRoaXMud2lkZ2V0Q2xpY2ssdGhpcykpOnRoaXMuJHdpZGdldD0hMSx0aGlzLnNob3dJbnB1dHMmJnRoaXMuJHdpZGdldCE9PSExJiZ0aGlzLiR3aWRnZXQuZmluZChcImlucHV0XCIpLmVhY2goZnVuY3Rpb24oKXthKHRoaXMpLm9uKHtcImNsaWNrLnRpbWVwaWNrZXJcIjpmdW5jdGlvbigpe2EodGhpcykuc2VsZWN0KCl9LFwia2V5ZG93bi50aW1lcGlja2VyXCI6YS5wcm94eShiLndpZGdldEtleWRvd24sYiksXCJrZXl1cC50aW1lcGlja2VyXCI6YS5wcm94eShiLndpZGdldEtleXVwLGIpfSl9KSx0aGlzLnNldERlZmF1bHRUaW1lKHRoaXMuZGVmYXVsdFRpbWUpfSxibHVyRWxlbWVudDpmdW5jdGlvbigpe3RoaXMuaGlnaGxpZ2h0ZWRVbml0PW51bGwsdGhpcy51cGRhdGVGcm9tRWxlbWVudFZhbCgpfSxjbGVhcjpmdW5jdGlvbigpe3RoaXMuaG91cj1cIlwiLHRoaXMubWludXRlPVwiXCIsdGhpcy5zZWNvbmQ9XCJcIix0aGlzLm1lcmlkaWFuPVwiXCIsdGhpcy4kZWxlbWVudC52YWwoXCJcIil9LGRlY3JlbWVudEhvdXI6ZnVuY3Rpb24oKXtpZih0aGlzLnNob3dNZXJpZGlhbilpZigxPT09dGhpcy5ob3VyKXRoaXMuaG91cj0xMjtlbHNle2lmKDEyPT09dGhpcy5ob3VyKXJldHVybiB0aGlzLmhvdXItLSx0aGlzLnRvZ2dsZU1lcmlkaWFuKCk7aWYoMD09PXRoaXMuaG91cilyZXR1cm4gdGhpcy5ob3VyPTExLHRoaXMudG9nZ2xlTWVyaWRpYW4oKTt0aGlzLmhvdXItLX1lbHNlIHRoaXMuaG91cjw9MD90aGlzLmhvdXI9dGhpcy5tYXhIb3Vycy0xOnRoaXMuaG91ci0tfSxkZWNyZW1lbnRNaW51dGU6ZnVuY3Rpb24oYSl7dmFyIGI7Yj1hP3RoaXMubWludXRlLWE6dGhpcy5taW51dGUtdGhpcy5taW51dGVTdGVwLDA+Yj8odGhpcy5kZWNyZW1lbnRIb3VyKCksdGhpcy5taW51dGU9Yis2MCk6dGhpcy5taW51dGU9Yn0sZGVjcmVtZW50U2Vjb25kOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5zZWNvbmQtdGhpcy5zZWNvbmRTdGVwOzA+YT8odGhpcy5kZWNyZW1lbnRNaW51dGUoITApLHRoaXMuc2Vjb25kPWErNjApOnRoaXMuc2Vjb25kPWF9LGVsZW1lbnRLZXlkb3duOmZ1bmN0aW9uKGEpe3N3aXRjaChhLndoaWNoKXtjYXNlIDk6aWYoYS5zaGlmdEtleSl7aWYoXCJob3VyXCI9PT10aGlzLmhpZ2hsaWdodGVkVW5pdCl7dGhpcy5oaWRlV2lkZ2V0KCk7YnJlYWt9dGhpcy5oaWdobGlnaHRQcmV2VW5pdCgpfWVsc2V7aWYodGhpcy5zaG93TWVyaWRpYW4mJlwibWVyaWRpYW5cIj09PXRoaXMuaGlnaGxpZ2h0ZWRVbml0fHx0aGlzLnNob3dTZWNvbmRzJiZcInNlY29uZFwiPT09dGhpcy5oaWdobGlnaHRlZFVuaXR8fCF0aGlzLnNob3dNZXJpZGlhbiYmIXRoaXMuc2hvd1NlY29uZHMmJlwibWludXRlXCI9PT10aGlzLmhpZ2hsaWdodGVkVW5pdCl7dGhpcy5oaWRlV2lkZ2V0KCk7YnJlYWt9dGhpcy5oaWdobGlnaHROZXh0VW5pdCgpfWEucHJldmVudERlZmF1bHQoKSx0aGlzLnVwZGF0ZUZyb21FbGVtZW50VmFsKCk7YnJlYWs7Y2FzZSAyNzp0aGlzLnVwZGF0ZUZyb21FbGVtZW50VmFsKCk7YnJlYWs7Y2FzZSAzNzphLnByZXZlbnREZWZhdWx0KCksdGhpcy5oaWdobGlnaHRQcmV2VW5pdCgpLHRoaXMudXBkYXRlRnJvbUVsZW1lbnRWYWwoKTticmVhaztjYXNlIDM4OnN3aXRjaChhLnByZXZlbnREZWZhdWx0KCksdGhpcy5oaWdobGlnaHRlZFVuaXQpe2Nhc2VcImhvdXJcIjp0aGlzLmluY3JlbWVudEhvdXIoKSx0aGlzLmhpZ2hsaWdodEhvdXIoKTticmVhaztjYXNlXCJtaW51dGVcIjp0aGlzLmluY3JlbWVudE1pbnV0ZSgpLHRoaXMuaGlnaGxpZ2h0TWludXRlKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6dGhpcy5pbmNyZW1lbnRTZWNvbmQoKSx0aGlzLmhpZ2hsaWdodFNlY29uZCgpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy50b2dnbGVNZXJpZGlhbigpLHRoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKX10aGlzLnVwZGF0ZSgpO2JyZWFrO2Nhc2UgMzk6YS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuaGlnaGxpZ2h0TmV4dFVuaXQoKSx0aGlzLnVwZGF0ZUZyb21FbGVtZW50VmFsKCk7YnJlYWs7Y2FzZSA0MDpzd2l0Y2goYS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuaGlnaGxpZ2h0ZWRVbml0KXtjYXNlXCJob3VyXCI6dGhpcy5kZWNyZW1lbnRIb3VyKCksdGhpcy5oaWdobGlnaHRIb3VyKCk7YnJlYWs7Y2FzZVwibWludXRlXCI6dGhpcy5kZWNyZW1lbnRNaW51dGUoKSx0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpO2JyZWFrO2Nhc2VcInNlY29uZFwiOnRoaXMuZGVjcmVtZW50U2Vjb25kKCksdGhpcy5oaWdobGlnaHRTZWNvbmQoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMudG9nZ2xlTWVyaWRpYW4oKSx0aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCl9dGhpcy51cGRhdGUoKX19LGdldEN1cnNvclBvc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudC5nZXQoMCk7aWYoXCJzZWxlY3Rpb25TdGFydFwiaW4gYSlyZXR1cm4gYS5zZWxlY3Rpb25TdGFydDtpZihjLnNlbGVjdGlvbil7YS5mb2N1cygpO3ZhciBiPWMuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCksZD1jLnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoO3JldHVybiBiLm1vdmVTdGFydChcImNoYXJhY3RlclwiLC1hLnZhbHVlLmxlbmd0aCksYi50ZXh0Lmxlbmd0aC1kfX0sZ2V0VGVtcGxhdGU6ZnVuY3Rpb24oKXt2YXIgYSxiLGMsZCxlLGY7c3dpdGNoKHRoaXMuc2hvd0lucHV0cz8oYj0nPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1ob3VyXCIgbWF4bGVuZ3RoPVwiMlwiLz4nLGM9JzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItbWludXRlXCIgbWF4bGVuZ3RoPVwiMlwiLz4nLGQ9JzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItc2Vjb25kXCIgbWF4bGVuZ3RoPVwiMlwiLz4nLGU9JzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItbWVyaWRpYW5cIiBtYXhsZW5ndGg9XCIyXCIvPicpOihiPSc8c3BhbiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLWhvdXJcIj48L3NwYW4+JyxjPSc8c3BhbiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLW1pbnV0ZVwiPjwvc3Bhbj4nLGQ9JzxzcGFuIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItc2Vjb25kXCI+PC9zcGFuPicsZT0nPHNwYW4gY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1tZXJpZGlhblwiPjwvc3Bhbj4nKSxmPSc8dGFibGU+PHRyPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiaW5jcmVtZW50SG91clwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLnVwKydcIj48L3NwYW4+PC9hPjwvdGQ+PHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+Jm5ic3A7PC90ZD48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImluY3JlbWVudE1pbnV0ZVwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLnVwKydcIj48L3NwYW4+PC9hPjwvdGQ+JysodGhpcy5zaG93U2Vjb25kcz8nPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+Jm5ic3A7PC90ZD48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImluY3JlbWVudFNlY29uZFwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLnVwKydcIj48L3NwYW4+PC9hPjwvdGQ+JzpcIlwiKSsodGhpcy5zaG93TWVyaWRpYW4/Jzx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPiZuYnNwOzwvdGQ+PHRkIGNsYXNzPVwibWVyaWRpYW4tY29sdW1uXCI+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cInRvZ2dsZU1lcmlkaWFuXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMudXArJ1wiPjwvc3Bhbj48L2E+PC90ZD4nOlwiXCIpK1wiPC90cj48dHI+PHRkPlwiK2IrJzwvdGQ+IDx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPjo8L3RkPjx0ZD4nK2MrXCI8L3RkPiBcIisodGhpcy5zaG93U2Vjb25kcz8nPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+OjwvdGQ+PHRkPicrZCtcIjwvdGQ+XCI6XCJcIikrKHRoaXMuc2hvd01lcmlkaWFuPyc8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj4mbmJzcDs8L3RkPjx0ZD4nK2UrXCI8L3RkPlwiOlwiXCIpKyc8L3RyPjx0cj48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImRlY3JlbWVudEhvdXJcIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy5kb3duKydcIj48L3NwYW4+PC9hPjwvdGQ+PHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+PC90ZD48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImRlY3JlbWVudE1pbnV0ZVwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLmRvd24rJ1wiPjwvc3Bhbj48L2E+PC90ZD4nKyh0aGlzLnNob3dTZWNvbmRzPyc8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj4mbmJzcDs8L3RkPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiZGVjcmVtZW50U2Vjb25kXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMuZG93bisnXCI+PC9zcGFuPjwvYT48L3RkPic6XCJcIikrKHRoaXMuc2hvd01lcmlkaWFuPyc8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj4mbmJzcDs8L3RkPjx0ZD48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwidG9nZ2xlTWVyaWRpYW5cIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy5kb3duKydcIj48L3NwYW4+PC9hPjwvdGQ+JzpcIlwiKStcIjwvdHI+PC90YWJsZT5cIix0aGlzLnRlbXBsYXRlKXtjYXNlXCJtb2RhbFwiOmE9JzxkaXYgY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci13aWRnZXQgbW9kYWwgaGlkZSBmYWRlIGluXCIgZGF0YS1iYWNrZHJvcD1cIicrKHRoaXMubW9kYWxCYWNrZHJvcD9cInRydWVcIjpcImZhbHNlXCIpKydcIj48ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4mdGltZXM7PC9hPjxoMz5QaWNrIGEgVGltZTwvaDM+PC9kaXY+PGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4nK2YrJzwvZGl2PjxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5PSzwvYT48L2Rpdj48L2Rpdj4nO2JyZWFrO2Nhc2VcImRyb3Bkb3duXCI6YT0nPGRpdiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLXdpZGdldCBkcm9wZG93bi1tZW51XCI+JytmK1wiPC9kaXY+XCJ9cmV0dXJuIGF9LGdldFRpbWU6ZnVuY3Rpb24oKXtyZXR1cm5cIlwiPT09dGhpcy5ob3VyP1wiXCI6dGhpcy5ob3VyK1wiOlwiKygxPT09dGhpcy5taW51dGUudG9TdHJpbmcoKS5sZW5ndGg/XCIwXCIrdGhpcy5taW51dGU6dGhpcy5taW51dGUpKyh0aGlzLnNob3dTZWNvbmRzP1wiOlwiKygxPT09dGhpcy5zZWNvbmQudG9TdHJpbmcoKS5sZW5ndGg/XCIwXCIrdGhpcy5zZWNvbmQ6dGhpcy5zZWNvbmQpOlwiXCIpKyh0aGlzLnNob3dNZXJpZGlhbj9cIiBcIit0aGlzLm1lcmlkaWFuOlwiXCIpfSxoaWRlV2lkZ2V0OmZ1bmN0aW9uKCl7dGhpcy5pc09wZW4hPT0hMSYmKHRoaXMuJGVsZW1lbnQudHJpZ2dlcih7dHlwZTpcImhpZGUudGltZXBpY2tlclwiLHRpbWU6e3ZhbHVlOnRoaXMuZ2V0VGltZSgpLGhvdXJzOnRoaXMuaG91cixtaW51dGVzOnRoaXMubWludXRlLHNlY29uZHM6dGhpcy5zZWNvbmQsbWVyaWRpYW46dGhpcy5tZXJpZGlhbn19KSxcIm1vZGFsXCI9PT10aGlzLnRlbXBsYXRlJiZ0aGlzLiR3aWRnZXQubW9kYWw/dGhpcy4kd2lkZ2V0Lm1vZGFsKFwiaGlkZVwiKTp0aGlzLiR3aWRnZXQucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpLGEoYykub2ZmKFwibW91c2Vkb3duLnRpbWVwaWNrZXIsIHRvdWNoZW5kLnRpbWVwaWNrZXJcIix0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spLHRoaXMuaXNPcGVuPSExLHRoaXMuJHdpZGdldC5kZXRhY2goKSl9LGhpZ2hsaWdodFVuaXQ6ZnVuY3Rpb24oKXt0aGlzLnBvc2l0aW9uPXRoaXMuZ2V0Q3Vyc29yUG9zaXRpb24oKSx0aGlzLnBvc2l0aW9uPj0wJiZ0aGlzLnBvc2l0aW9uPD0yP3RoaXMuaGlnaGxpZ2h0SG91cigpOnRoaXMucG9zaXRpb24+PTMmJnRoaXMucG9zaXRpb248PTU/dGhpcy5oaWdobGlnaHRNaW51dGUoKTp0aGlzLnBvc2l0aW9uPj02JiZ0aGlzLnBvc2l0aW9uPD04P3RoaXMuc2hvd1NlY29uZHM/dGhpcy5oaWdobGlnaHRTZWNvbmQoKTp0aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCk6dGhpcy5wb3NpdGlvbj49OSYmdGhpcy5wb3NpdGlvbjw9MTEmJnRoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKX0saGlnaGxpZ2h0TmV4dFVuaXQ6ZnVuY3Rpb24oKXtzd2l0Y2godGhpcy5oaWdobGlnaHRlZFVuaXQpe2Nhc2VcImhvdXJcIjp0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpO2JyZWFrO2Nhc2VcIm1pbnV0ZVwiOnRoaXMuc2hvd1NlY29uZHM/dGhpcy5oaWdobGlnaHRTZWNvbmQoKTp0aGlzLnNob3dNZXJpZGlhbj90aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCk6dGhpcy5oaWdobGlnaHRIb3VyKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6dGhpcy5zaG93TWVyaWRpYW4/dGhpcy5oaWdobGlnaHRNZXJpZGlhbigpOnRoaXMuaGlnaGxpZ2h0SG91cigpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy5oaWdobGlnaHRIb3VyKCl9fSxoaWdobGlnaHRQcmV2VW5pdDpmdW5jdGlvbigpe3N3aXRjaCh0aGlzLmhpZ2hsaWdodGVkVW5pdCl7Y2FzZVwiaG91clwiOnRoaXMuc2hvd01lcmlkaWFuP3RoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKTp0aGlzLnNob3dTZWNvbmRzP3RoaXMuaGlnaGxpZ2h0U2Vjb25kKCk6dGhpcy5oaWdobGlnaHRNaW51dGUoKTticmVhaztjYXNlXCJtaW51dGVcIjp0aGlzLmhpZ2hsaWdodEhvdXIoKTticmVhaztjYXNlXCJzZWNvbmRcIjp0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy5zaG93U2Vjb25kcz90aGlzLmhpZ2hsaWdodFNlY29uZCgpOnRoaXMuaGlnaGxpZ2h0TWludXRlKCl9fSxoaWdobGlnaHRIb3VyOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudC5nZXQoMCksYj10aGlzO3RoaXMuaGlnaGxpZ2h0ZWRVbml0PVwiaG91clwiLGEuc2V0U2VsZWN0aW9uUmFuZ2UmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLmhvdXI8MTA/YS5zZXRTZWxlY3Rpb25SYW5nZSgwLDEpOmEuc2V0U2VsZWN0aW9uUmFuZ2UoMCwyKX0sMCl9LGhpZ2hsaWdodE1pbnV0ZTpmdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnQuZ2V0KDApLGI9dGhpczt0aGlzLmhpZ2hsaWdodGVkVW5pdD1cIm1pbnV0ZVwiLGEuc2V0U2VsZWN0aW9uUmFuZ2UmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLmhvdXI8MTA/YS5zZXRTZWxlY3Rpb25SYW5nZSgyLDQpOmEuc2V0U2VsZWN0aW9uUmFuZ2UoMyw1KX0sMCl9LGhpZ2hsaWdodFNlY29uZDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnQuZ2V0KDApLGI9dGhpczt0aGlzLmhpZ2hsaWdodGVkVW5pdD1cInNlY29uZFwiLGEuc2V0U2VsZWN0aW9uUmFuZ2UmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLmhvdXI8MTA/YS5zZXRTZWxlY3Rpb25SYW5nZSg1LDcpOmEuc2V0U2VsZWN0aW9uUmFuZ2UoNiw4KX0sMCl9LGhpZ2hsaWdodE1lcmlkaWFuOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy4kZWxlbWVudC5nZXQoMCksYj10aGlzO3RoaXMuaGlnaGxpZ2h0ZWRVbml0PVwibWVyaWRpYW5cIixhLnNldFNlbGVjdGlvblJhbmdlJiYodGhpcy5zaG93U2Vjb25kcz9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5ob3VyPDEwP2Euc2V0U2VsZWN0aW9uUmFuZ2UoOCwxMCk6YS5zZXRTZWxlY3Rpb25SYW5nZSg5LDExKX0sMCk6c2V0VGltZW91dChmdW5jdGlvbigpe2IuaG91cjwxMD9hLnNldFNlbGVjdGlvblJhbmdlKDUsNyk6YS5zZXRTZWxlY3Rpb25SYW5nZSg2LDgpfSwwKSl9LGluY3JlbWVudEhvdXI6ZnVuY3Rpb24oKXtpZih0aGlzLnNob3dNZXJpZGlhbil7aWYoMTE9PT10aGlzLmhvdXIpcmV0dXJuIHRoaXMuaG91cisrLHRoaXMudG9nZ2xlTWVyaWRpYW4oKTsxMj09PXRoaXMuaG91ciYmKHRoaXMuaG91cj0wKX1yZXR1cm4gdGhpcy5ob3VyPT09dGhpcy5tYXhIb3Vycy0xP3ZvaWQodGhpcy5ob3VyPTApOnZvaWQgdGhpcy5ob3VyKyt9LGluY3JlbWVudE1pbnV0ZTpmdW5jdGlvbihhKXt2YXIgYjtiPWE/dGhpcy5taW51dGUrYTp0aGlzLm1pbnV0ZSt0aGlzLm1pbnV0ZVN0ZXAtdGhpcy5taW51dGUldGhpcy5taW51dGVTdGVwLGI+NTk/KHRoaXMuaW5jcmVtZW50SG91cigpLHRoaXMubWludXRlPWItNjApOnRoaXMubWludXRlPWJ9LGluY3JlbWVudFNlY29uZDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuc2Vjb25kK3RoaXMuc2Vjb25kU3RlcC10aGlzLnNlY29uZCV0aGlzLnNlY29uZFN0ZXA7YT41OT8odGhpcy5pbmNyZW1lbnRNaW51dGUoITApLHRoaXMuc2Vjb25kPWEtNjApOnRoaXMuc2Vjb25kPWF9LG1vdXNld2hlZWw6ZnVuY3Rpb24oYil7aWYoIXRoaXMuZGlzYWJsZU1vdXNld2hlZWwpe2IucHJldmVudERlZmF1bHQoKSxiLnN0b3BQcm9wYWdhdGlvbigpO3ZhciBjPWIub3JpZ2luYWxFdmVudC53aGVlbERlbHRhfHwtYi5vcmlnaW5hbEV2ZW50LmRldGFpbCxkPW51bGw7c3dpdGNoKFwibW91c2V3aGVlbFwiPT09Yi50eXBlP2Q9LTEqYi5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGE6XCJET01Nb3VzZVNjcm9sbFwiPT09Yi50eXBlJiYoZD00MCpiLm9yaWdpbmFsRXZlbnQuZGV0YWlsKSxkJiYoYi5wcmV2ZW50RGVmYXVsdCgpLGEodGhpcykuc2Nyb2xsVG9wKGQrYSh0aGlzKS5zY3JvbGxUb3AoKSkpLHRoaXMuaGlnaGxpZ2h0ZWRVbml0KXtjYXNlXCJtaW51dGVcIjpjPjA/dGhpcy5pbmNyZW1lbnRNaW51dGUoKTp0aGlzLmRlY3JlbWVudE1pbnV0ZSgpLHRoaXMuaGlnaGxpZ2h0TWludXRlKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6Yz4wP3RoaXMuaW5jcmVtZW50U2Vjb25kKCk6dGhpcy5kZWNyZW1lbnRTZWNvbmQoKSx0aGlzLmhpZ2hsaWdodFNlY29uZCgpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy50b2dnbGVNZXJpZGlhbigpLHRoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKTticmVhaztkZWZhdWx0OmM+MD90aGlzLmluY3JlbWVudEhvdXIoKTp0aGlzLmRlY3JlbWVudEhvdXIoKSx0aGlzLmhpZ2hsaWdodEhvdXIoKX1yZXR1cm4hMX19LGNoYW5nZVRvTmVhcmVzdFN0ZXA6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYSViPT09MD9hOk1hdGgucm91bmQoYSViL2IpPyhhKyhiLWElYikpJTYwOmEtYSVifSxwbGFjZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzSW5saW5lKXt2YXIgYz10aGlzLiR3aWRnZXQub3V0ZXJXaWR0aCgpLGQ9dGhpcy4kd2lkZ2V0Lm91dGVySGVpZ2h0KCksZT0xMCxmPWEoYikud2lkdGgoKSxnPWEoYikuaGVpZ2h0KCksaD1hKGIpLnNjcm9sbFRvcCgpLGk9cGFyc2VJbnQodGhpcy4kZWxlbWVudC5wYXJlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCl7cmV0dXJuXCJhdXRvXCIhPT1hKHRoaXMpLmNzcyhcInotaW5kZXhcIil9KS5maXJzdCgpLmNzcyhcInotaW5kZXhcIiksMTApKzEwLGo9dGhpcy5jb21wb25lbnQ/dGhpcy5jb21wb25lbnQucGFyZW50KCkub2Zmc2V0KCk6dGhpcy4kZWxlbWVudC5vZmZzZXQoKSxrPXRoaXMuY29tcG9uZW50P3RoaXMuY29tcG9uZW50Lm91dGVySGVpZ2h0KCEwKTp0aGlzLiRlbGVtZW50Lm91dGVySGVpZ2h0KCExKSxsPXRoaXMuY29tcG9uZW50P3RoaXMuY29tcG9uZW50Lm91dGVyV2lkdGgoITApOnRoaXMuJGVsZW1lbnQub3V0ZXJXaWR0aCghMSksbT1qLmxlZnQsbj1qLnRvcDt0aGlzLiR3aWRnZXQucmVtb3ZlQ2xhc3MoXCJ0aW1lcGlja2VyLW9yaWVudC10b3AgdGltZXBpY2tlci1vcmllbnQtYm90dG9tIHRpbWVwaWNrZXItb3JpZW50LXJpZ2h0IHRpbWVwaWNrZXItb3JpZW50LWxlZnRcIiksXCJhdXRvXCIhPT10aGlzLm9yaWVudGF0aW9uLng/KHRoaXMuJHdpZGdldC5hZGRDbGFzcyhcInRpbWVwaWNrZXItb3JpZW50LVwiK3RoaXMub3JpZW50YXRpb24ueCksXCJyaWdodFwiPT09dGhpcy5vcmllbnRhdGlvbi54JiYobS09Yy1sKSk6KHRoaXMuJHdpZGdldC5hZGRDbGFzcyhcInRpbWVwaWNrZXItb3JpZW50LWxlZnRcIiksai5sZWZ0PDA/bS09ai5sZWZ0LWU6ai5sZWZ0K2M+ZiYmKG09Zi1jLWUpKTt2YXIgbyxwLHE9dGhpcy5vcmllbnRhdGlvbi55O1wiYXV0b1wiPT09cSYmKG89LWgrai50b3AtZCxwPWgrZy0oai50b3AraytkKSxxPU1hdGgubWF4KG8scCk9PT1wP1widG9wXCI6XCJib3R0b21cIiksdGhpcy4kd2lkZ2V0LmFkZENsYXNzKFwidGltZXBpY2tlci1vcmllbnQtXCIrcSksXCJ0b3BcIj09PXE/bis9azpuLT1kK3BhcnNlSW50KHRoaXMuJHdpZGdldC5jc3MoXCJwYWRkaW5nLXRvcFwiKSwxMCksdGhpcy4kd2lkZ2V0LmNzcyh7dG9wOm4sbGVmdDptLHpJbmRleDppfSl9fSxyZW1vdmU6ZnVuY3Rpb24oKXthKFwiZG9jdW1lbnRcIikub2ZmKFwiLnRpbWVwaWNrZXJcIiksdGhpcy4kd2lkZ2V0JiZ0aGlzLiR3aWRnZXQucmVtb3ZlKCksZGVsZXRlIHRoaXMuJGVsZW1lbnQuZGF0YSgpLnRpbWVwaWNrZXJ9LHNldERlZmF1bHRUaW1lOmZ1bmN0aW9uKGEpe2lmKHRoaXMuJGVsZW1lbnQudmFsKCkpdGhpcy51cGRhdGVGcm9tRWxlbWVudFZhbCgpO2Vsc2UgaWYoXCJjdXJyZW50XCI9PT1hKXt2YXIgYj1uZXcgRGF0ZSxjPWIuZ2V0SG91cnMoKSxkPWIuZ2V0TWludXRlcygpLGU9Yi5nZXRTZWNvbmRzKCksZj1cIkFNXCI7MCE9PWUmJihlPU1hdGguY2VpbChiLmdldFNlY29uZHMoKS90aGlzLnNlY29uZFN0ZXApKnRoaXMuc2Vjb25kU3RlcCw2MD09PWUmJihkKz0xLGU9MCkpLDAhPT1kJiYoZD1NYXRoLmNlaWwoYi5nZXRNaW51dGVzKCkvdGhpcy5taW51dGVTdGVwKSp0aGlzLm1pbnV0ZVN0ZXAsNjA9PT1kJiYoYys9MSxkPTApKSx0aGlzLnNob3dNZXJpZGlhbiYmKDA9PT1jP2M9MTI6Yz49MTI/KGM+MTImJihjLT0xMiksZj1cIlBNXCIpOmY9XCJBTVwiKSx0aGlzLmhvdXI9Yyx0aGlzLm1pbnV0ZT1kLHRoaXMuc2Vjb25kPWUsdGhpcy5tZXJpZGlhbj1mLHRoaXMudXBkYXRlKCl9ZWxzZSBhPT09ITE/KHRoaXMuaG91cj0wLHRoaXMubWludXRlPTAsdGhpcy5zZWNvbmQ9MCx0aGlzLm1lcmlkaWFuPVwiQU1cIik6dGhpcy5zZXRUaW1lKGEpfSxzZXRUaW1lOmZ1bmN0aW9uKGEsYil7aWYoIWEpcmV0dXJuIHZvaWQgdGhpcy5jbGVhcigpO3ZhciBjLGQsZSxmLGcsaDtpZihcIm9iamVjdFwiPT10eXBlb2YgYSYmYS5nZXRNb250aCllPWEuZ2V0SG91cnMoKSxmPWEuZ2V0TWludXRlcygpLGc9YS5nZXRTZWNvbmRzKCksdGhpcy5zaG93TWVyaWRpYW4mJihoPVwiQU1cIixlPjEyJiYoaD1cIlBNXCIsZSU9MTIpLDEyPT09ZSYmKGg9XCJQTVwiKSk7ZWxzZXtpZihjPSgvYS9pLnRlc3QoYSk/MTowKSsoL3AvaS50ZXN0KGEpPzI6MCksYz4yKXJldHVybiB2b2lkIHRoaXMuY2xlYXIoKTtpZihkPWEucmVwbGFjZSgvW14wLTlcXDpdL2csXCJcIikuc3BsaXQoXCI6XCIpLGU9ZFswXT9kWzBdLnRvU3RyaW5nKCk6ZC50b1N0cmluZygpLHRoaXMuZXhwbGljaXRNb2RlJiZlLmxlbmd0aD4yJiZlLmxlbmd0aCUyIT09MClyZXR1cm4gdm9pZCB0aGlzLmNsZWFyKCk7Zj1kWzFdP2RbMV0udG9TdHJpbmcoKTpcIlwiLGc9ZFsyXT9kWzJdLnRvU3RyaW5nKCk6XCJcIixlLmxlbmd0aD40JiYoZz1lLnNsaWNlKC0yKSxlPWUuc2xpY2UoMCwtMikpLGUubGVuZ3RoPjImJihmPWUuc2xpY2UoLTIpLGU9ZS5zbGljZSgwLC0yKSksZi5sZW5ndGg+MiYmKGc9Zi5zbGljZSgtMiksZj1mLnNsaWNlKDAsLTIpKSxlPXBhcnNlSW50KGUsMTApLGY9cGFyc2VJbnQoZiwxMCksZz1wYXJzZUludChnLDEwKSxpc05hTihlKSYmKGU9MCksaXNOYU4oZikmJihmPTApLGlzTmFOKGcpJiYoZz0wKSxnPjU5JiYoZz01OSksZj41OSYmKGY9NTkpLGU+PXRoaXMubWF4SG91cnMmJihlPXRoaXMubWF4SG91cnMtMSksdGhpcy5zaG93TWVyaWRpYW4/KGU+MTImJihjPTIsZS09MTIpLGN8fChjPTEpLDA9PT1lJiYoZT0xMiksaD0xPT09Yz9cIkFNXCI6XCJQTVwiKToxMj5lJiYyPT09Yz9lKz0xMjplPj10aGlzLm1heEhvdXJzP2U9dGhpcy5tYXhIb3Vycy0xOigwPmV8fDEyPT09ZSYmMT09PWMpJiYoZT0wKX10aGlzLmhvdXI9ZSx0aGlzLnNuYXBUb1N0ZXA/KHRoaXMubWludXRlPXRoaXMuY2hhbmdlVG9OZWFyZXN0U3RlcChmLHRoaXMubWludXRlU3RlcCksdGhpcy5zZWNvbmQ9dGhpcy5jaGFuZ2VUb05lYXJlc3RTdGVwKGcsdGhpcy5zZWNvbmRTdGVwKSk6KHRoaXMubWludXRlPWYsdGhpcy5zZWNvbmQ9ZyksdGhpcy5tZXJpZGlhbj1oLHRoaXMudXBkYXRlKGIpfSxzaG93V2lkZ2V0OmZ1bmN0aW9uKCl7dGhpcy5pc09wZW58fHRoaXMuJGVsZW1lbnQuaXMoXCI6ZGlzYWJsZWRcIil8fCh0aGlzLiR3aWRnZXQuYXBwZW5kVG8odGhpcy5hcHBlbmRXaWRnZXRUbyksYShjKS5vbihcIm1vdXNlZG93bi50aW1lcGlja2VyLCB0b3VjaGVuZC50aW1lcGlja2VyXCIse3Njb3BlOnRoaXN9LHRoaXMuaGFuZGxlRG9jdW1lbnRDbGljayksdGhpcy4kZWxlbWVudC50cmlnZ2VyKHt0eXBlOlwic2hvdy50aW1lcGlja2VyXCIsdGltZTp7dmFsdWU6dGhpcy5nZXRUaW1lKCksaG91cnM6dGhpcy5ob3VyLG1pbnV0ZXM6dGhpcy5taW51dGUsc2Vjb25kczp0aGlzLnNlY29uZCxtZXJpZGlhbjp0aGlzLm1lcmlkaWFufX0pLHRoaXMucGxhY2UoKSx0aGlzLmRpc2FibGVGb2N1cyYmdGhpcy4kZWxlbWVudC5ibHVyKCksXCJcIj09PXRoaXMuaG91ciYmKHRoaXMuZGVmYXVsdFRpbWU/dGhpcy5zZXREZWZhdWx0VGltZSh0aGlzLmRlZmF1bHRUaW1lKTp0aGlzLnNldFRpbWUoXCIwOjA6MFwiKSksXCJtb2RhbFwiPT09dGhpcy50ZW1wbGF0ZSYmdGhpcy4kd2lkZ2V0Lm1vZGFsP3RoaXMuJHdpZGdldC5tb2RhbChcInNob3dcIikub24oXCJoaWRkZW5cIixhLnByb3h5KHRoaXMuaGlkZVdpZGdldCx0aGlzKSk6dGhpcy5pc09wZW49PT0hMSYmdGhpcy4kd2lkZ2V0LmFkZENsYXNzKFwib3BlblwiKSx0aGlzLmlzT3Blbj0hMCl9LHRvZ2dsZU1lcmlkaWFuOmZ1bmN0aW9uKCl7dGhpcy5tZXJpZGlhbj1cIkFNXCI9PT10aGlzLm1lcmlkaWFuP1wiUE1cIjpcIkFNXCJ9LHVwZGF0ZTpmdW5jdGlvbihhKXt0aGlzLnVwZGF0ZUVsZW1lbnQoKSxhfHx0aGlzLnVwZGF0ZVdpZGdldCgpLHRoaXMuJGVsZW1lbnQudHJpZ2dlcih7dHlwZTpcImNoYW5nZVRpbWUudGltZXBpY2tlclwiLHRpbWU6e3ZhbHVlOnRoaXMuZ2V0VGltZSgpLGhvdXJzOnRoaXMuaG91cixtaW51dGVzOnRoaXMubWludXRlLHNlY29uZHM6dGhpcy5zZWNvbmQsbWVyaWRpYW46dGhpcy5tZXJpZGlhbn19KX0sdXBkYXRlRWxlbWVudDpmdW5jdGlvbigpe3RoaXMuJGVsZW1lbnQudmFsKHRoaXMuZ2V0VGltZSgpKS5jaGFuZ2UoKX0sdXBkYXRlRnJvbUVsZW1lbnRWYWw6ZnVuY3Rpb24oKXt0aGlzLnNldFRpbWUodGhpcy4kZWxlbWVudC52YWwoKSl9LHVwZGF0ZVdpZGdldDpmdW5jdGlvbigpe2lmKHRoaXMuJHdpZGdldCE9PSExKXt2YXIgYT10aGlzLmhvdXIsYj0xPT09dGhpcy5taW51dGUudG9TdHJpbmcoKS5sZW5ndGg/XCIwXCIrdGhpcy5taW51dGU6dGhpcy5taW51dGUsYz0xPT09dGhpcy5zZWNvbmQudG9TdHJpbmcoKS5sZW5ndGg/XCIwXCIrdGhpcy5zZWNvbmQ6dGhpcy5zZWNvbmQ7dGhpcy5zaG93SW5wdXRzPyh0aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLWhvdXJcIikudmFsKGEpLHRoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItbWludXRlXCIpLnZhbChiKSx0aGlzLnNob3dTZWNvbmRzJiZ0aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLXNlY29uZFwiKS52YWwoYyksdGhpcy5zaG93TWVyaWRpYW4mJnRoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItbWVyaWRpYW5cIikudmFsKHRoaXMubWVyaWRpYW4pKToodGhpcy4kd2lkZ2V0LmZpbmQoXCJzcGFuLmJvb3RzdHJhcC10aW1lcGlja2VyLWhvdXJcIikudGV4dChhKSx0aGlzLiR3aWRnZXQuZmluZChcInNwYW4uYm9vdHN0cmFwLXRpbWVwaWNrZXItbWludXRlXCIpLnRleHQoYiksdGhpcy5zaG93U2Vjb25kcyYmdGhpcy4kd2lkZ2V0LmZpbmQoXCJzcGFuLmJvb3RzdHJhcC10aW1lcGlja2VyLXNlY29uZFwiKS50ZXh0KGMpLHRoaXMuc2hvd01lcmlkaWFuJiZ0aGlzLiR3aWRnZXQuZmluZChcInNwYW4uYm9vdHN0cmFwLXRpbWVwaWNrZXItbWVyaWRpYW5cIikudGV4dCh0aGlzLm1lcmlkaWFuKSl9fSx1cGRhdGVGcm9tV2lkZ2V0SW5wdXRzOmZ1bmN0aW9uKCl7aWYodGhpcy4kd2lkZ2V0IT09ITEpe3ZhciBhPXRoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItaG91clwiKS52YWwoKStcIjpcIit0aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLW1pbnV0ZVwiKS52YWwoKSsodGhpcy5zaG93U2Vjb25kcz9cIjpcIit0aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLXNlY29uZFwiKS52YWwoKTpcIlwiKSsodGhpcy5zaG93TWVyaWRpYW4/dGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1tZXJpZGlhblwiKS52YWwoKTpcIlwiKTt0aGlzLnNldFRpbWUoYSwhMCl9fSx3aWRnZXRDbGljazpmdW5jdGlvbihiKXtiLnN0b3BQcm9wYWdhdGlvbigpLGIucHJldmVudERlZmF1bHQoKTt2YXIgYz1hKGIudGFyZ2V0KSxkPWMuY2xvc2VzdChcImFcIikuZGF0YShcImFjdGlvblwiKTtkJiZ0aGlzW2RdKCksdGhpcy51cGRhdGUoKSxjLmlzKFwiaW5wdXRcIikmJmMuZ2V0KDApLnNldFNlbGVjdGlvblJhbmdlKDAsMil9LHdpZGdldEtleWRvd246ZnVuY3Rpb24oYil7dmFyIGM9YShiLnRhcmdldCksZD1jLmF0dHIoXCJjbGFzc1wiKS5yZXBsYWNlKFwiYm9vdHN0cmFwLXRpbWVwaWNrZXItXCIsXCJcIik7c3dpdGNoKGIud2hpY2gpe2Nhc2UgOTppZihiLnNoaWZ0S2V5KXtpZihcImhvdXJcIj09PWQpcmV0dXJuIHRoaXMuaGlkZVdpZGdldCgpfWVsc2UgaWYodGhpcy5zaG93TWVyaWRpYW4mJlwibWVyaWRpYW5cIj09PWR8fHRoaXMuc2hvd1NlY29uZHMmJlwic2Vjb25kXCI9PT1kfHwhdGhpcy5zaG93TWVyaWRpYW4mJiF0aGlzLnNob3dTZWNvbmRzJiZcIm1pbnV0ZVwiPT09ZClyZXR1cm4gdGhpcy5oaWRlV2lkZ2V0KCk7YnJlYWs7Y2FzZSAyNzp0aGlzLmhpZGVXaWRnZXQoKTticmVhaztjYXNlIDM4OnN3aXRjaChiLnByZXZlbnREZWZhdWx0KCksZCl7Y2FzZVwiaG91clwiOnRoaXMuaW5jcmVtZW50SG91cigpO2JyZWFrO2Nhc2VcIm1pbnV0ZVwiOnRoaXMuaW5jcmVtZW50TWludXRlKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6dGhpcy5pbmNyZW1lbnRTZWNvbmQoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMudG9nZ2xlTWVyaWRpYW4oKX10aGlzLnNldFRpbWUodGhpcy5nZXRUaW1lKCkpLGMuZ2V0KDApLnNldFNlbGVjdGlvblJhbmdlKDAsMik7YnJlYWs7Y2FzZSA0MDpzd2l0Y2goYi5wcmV2ZW50RGVmYXVsdCgpLGQpe2Nhc2VcImhvdXJcIjp0aGlzLmRlY3JlbWVudEhvdXIoKTticmVhaztjYXNlXCJtaW51dGVcIjp0aGlzLmRlY3JlbWVudE1pbnV0ZSgpO2JyZWFrO2Nhc2VcInNlY29uZFwiOnRoaXMuZGVjcmVtZW50U2Vjb25kKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLnRvZ2dsZU1lcmlkaWFuKCl9dGhpcy5zZXRUaW1lKHRoaXMuZ2V0VGltZSgpKSxjLmdldCgwKS5zZXRTZWxlY3Rpb25SYW5nZSgwLDIpfX0sd2lkZ2V0S2V5dXA6ZnVuY3Rpb24oYSl7KDY1PT09YS53aGljaHx8Nzc9PT1hLndoaWNofHw4MD09PWEud2hpY2h8fDQ2PT09YS53aGljaHx8OD09PWEud2hpY2h8fGEud2hpY2g+PTQ4JiZhLndoaWNoPD01N3x8YS53aGljaD49OTYmJmEud2hpY2g8PTEwNSkmJnRoaXMudXBkYXRlRnJvbVdpZGdldElucHV0cygpfX0sYS5mbi50aW1lcGlja2VyPWZ1bmN0aW9uKGIpe3ZhciBjPUFycmF5LmFwcGx5KG51bGwsYXJndW1lbnRzKTtyZXR1cm4gYy5zaGlmdCgpLHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoXCJ0aW1lcGlja2VyXCIpLGc9XCJvYmplY3RcIj09dHlwZW9mIGImJmI7Znx8ZS5kYXRhKFwidGltZXBpY2tlclwiLGY9bmV3IGQodGhpcyxhLmV4dGVuZCh7fSxhLmZuLnRpbWVwaWNrZXIuZGVmYXVsdHMsZyxhKHRoaXMpLmRhdGEoKSkpKSxcInN0cmluZ1wiPT10eXBlb2YgYiYmZltiXS5hcHBseShmLGMpfSl9LGEuZm4udGltZXBpY2tlci5kZWZhdWx0cz17ZGVmYXVsdFRpbWU6XCJjdXJyZW50XCIsZGlzYWJsZUZvY3VzOiExLGRpc2FibGVNb3VzZXdoZWVsOiExLGlzT3BlbjohMSxtaW51dGVTdGVwOjE1LG1vZGFsQmFja2Ryb3A6ITEsb3JpZW50YXRpb246e3g6XCJhdXRvXCIseTpcImF1dG9cIn0sc2Vjb25kU3RlcDoxNSxzbmFwVG9TdGVwOiExLHNob3dTZWNvbmRzOiExLHNob3dJbnB1dHM6ITAsc2hvd01lcmlkaWFuOiEwLHRlbXBsYXRlOlwiZHJvcGRvd25cIixhcHBlbmRXaWRnZXRUbzpcImJvZHlcIixzaG93V2lkZ2V0T25BZGRvbkNsaWNrOiEwLGljb25zOnt1cDpcImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi11cFwiLGRvd246XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tZG93blwifSxtYXhIb3VyczoyNCxleHBsaWNpdE1vZGU6ITF9LGEuZm4udGltZXBpY2tlci5Db25zdHJ1Y3Rvcj1kLGEoYykub24oXCJmb2N1cy50aW1lcGlja2VyLmRhdGEtYXBpIGNsaWNrLnRpbWVwaWNrZXIuZGF0YS1hcGlcIiwnW2RhdGEtcHJvdmlkZT1cInRpbWVwaWNrZXJcIl0nLGZ1bmN0aW9uKGIpe3ZhciBjPWEodGhpcyk7Yy5kYXRhKFwidGltZXBpY2tlclwiKXx8KGIucHJldmVudERlZmF1bHQoKSxjLnRpbWVwaWNrZXIoKSl9KX0oalF1ZXJ5LHdpbmRvdyxkb2N1bWVudCk7Il0sInNvdXJjZVJvb3QiOiIifQ==