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
    var inputs = $(this).parents(".file_upload").find('[data-name]');
    var data = new FormData(form[0]);
    var data2 = new FormData();
    $(inputs).each(function (index, input) {
      data2.append($(input).data('name'), data.get(input.name));
    });
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
    seriesType: 'line',
    series: {},
    legend: {
      position: 'bottom'
    },
    vAxes: {
      0: {
        direction: -1
      },
      1: {
        direction: 1
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
              options.series[i - 1].targetAxisIndex = 0;
              options.series[i - 1].backgroundColor = '#66bc40';
            } else {
              options.series[i - 1].targetAxisIndex = i;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LmNhdGVnb3JpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvRmxvdC9qcXVlcnkuZmxvdC5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnBpZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnJlc2l6ZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnRpbWUuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvSW9uaWNvbnMvY3NzL2lvbmljb25zLm1pbi5jc3M/OTlkZCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAtZGF0ZXBpY2tlci9kaXN0L2Nzcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uY3NzPzNlNjkiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwLWRhdGVwaWNrZXIvZGlzdC9qcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC10aGVtZS5taW4uY3NzP2Y2MmQiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzPzAxZDkiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvYm93ZXJfY29tcG9uZW50cy9mb250LWF3ZXNvbWUvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzPzA1YjciLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Nzcy9hcHAuY3NzPzM1Y2UiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL0FkbWluTFRFLm1pbi5jc3M/NWI0OCIsIndlYnBhY2s6Ly8vLi9hc3NldHMvZGlzdC9jc3MvYWx0L2FkbWlubHRlLmNvbXBvbmVudHMuY3NzPzdhYTAiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5leHRyYS1jb21wb25lbnRzLmNzcz82YmQ3Iiwid2VicGFjazovLy8uL2Fzc2V0cy9kaXN0L2Nzcy9hbHQvYWRtaW5sdGUucGFnZXMuY3NzP2QyOWYiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5wbHVnaW5zLmNzcz81YTlmIiwid2VicGFjazovLy8uL2Fzc2V0cy9kaXN0L2Nzcy9za2lucy9za2luLWJsdWUuY3NzP2VlNGUiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2Rpc3QvanMvYWRtaW5sdGUubWluLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2N1c3RvbS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvcGx1Z2lucy9pQ2hlY2svYWxsLmNzcz81ZDJkIiwid2VicGFjazovLy8uL2Fzc2V0cy9wbHVnaW5zL2lDaGVjay9pY2hlY2subWluLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9wbHVnaW5zL3RpbWVwaWNrZXIvYm9vdHN0cmFwLXRpbWVwaWNrZXIubWluLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsIkVycm9yIiwiYSIsImIiLCJlYWNoIiwiZSIsImciLCJkYXRhIiwiYyIsImgiLCJleHRlbmQiLCJkIiwiZiIsInNvdXJjZSIsInBhcmFtcyIsInRyaWdnZXIiLCJjb250ZW50IiwibG9hZEluQ29udGVudCIsInJlc3BvbnNlVHlwZSIsIm92ZXJsYXlUZW1wbGF0ZSIsIm9uTG9hZFN0YXJ0Iiwib25Mb2FkRG9uZSIsImVsZW1lbnQiLCJvcHRpb25zIiwiJG92ZXJsYXkiLCJfc2V0VXBMaXN0ZW5lcnMiLCJsb2FkIiwicHJvdG90eXBlIiwiX2FkZE92ZXJsYXkiLCJjYWxsIiwiZ2V0IiwiZmluZCIsImh0bWwiLCJfcmVtb3ZlT3ZlcmxheSIsImJpbmQiLCJvbiIsInByZXZlbnREZWZhdWx0IiwiYXBwZW5kIiwicmVtb3ZlIiwiZm4iLCJib3hSZWZyZXNoIiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0Iiwid2luZG93IiwiYW5pbWF0aW9uU3BlZWQiLCJjb2xsYXBzZVRyaWdnZXIiLCJyZW1vdmVUcmlnZ2VyIiwiY29sbGFwc2VJY29uIiwiZXhwYW5kSWNvbiIsInJlbW92ZUljb24iLCJjb2xsYXBzZWQiLCJoZWFkZXIiLCJib2R5IiwiZm9vdGVyIiwidG9vbHMiLCJjb2xsYXBzaW5nIiwiZXhwYW5kaW5nIiwiZXhwYW5kZWQiLCJyZW1vdmluZyIsInJlbW92ZWQiLCJ0b2dnbGUiLCJpcyIsImV4cGFuZCIsImNvbGxhcHNlIiwiRXZlbnQiLCJyZW1vdmVDbGFzcyIsImNoaWxkcmVuIiwiYWRkQ2xhc3MiLCJzbGlkZURvd24iLCJzbGlkZVVwIiwiZXhwYW5kaW5nRXZlbnQiLCJpIiwiYm94V2lkZ2V0Iiwic2xpZGUiLCJzaWRlYmFyIiwib3BlbiIsImJnIiwid3JhcHBlciIsImJveGVkIiwiZml4ZWQiLCJoYXNCaW5kZWRSZXNpemUiLCJpbml0IiwiZml4IiwicmVzaXplIiwiX2ZpeEZvckJveGVkIiwiY3NzIiwicG9zaXRpb24iLCJoZWlnaHQiLCJjb250cm9sU2lkZWJhciIsImRvY3VtZW50IiwiYm94IiwicGFyZW50cyIsImZpcnN0IiwidG9nZ2xlQ2xhc3MiLCJkaXJlY3RDaGF0Iiwic2xpbXNjcm9sbCIsInJlc2V0SGVpZ2h0IiwiY29udGVudFdyYXBwZXIiLCJsYXlvdXRCb3hlZCIsIm1haW5Gb290ZXIiLCJtYWluSGVhZGVyIiwic2lkZWJhck1lbnUiLCJsb2dvIiwiaG9sZFRyYW5zaXRpb24iLCJiaW5kZWRSZXNpemUiLCJhY3RpdmF0ZSIsImZpeFNpZGViYXIiLCJvbmUiLCJvdXRlckhlaWdodCIsImhhc0NsYXNzIiwiaiIsInNsaW1TY3JvbGwiLCJkZXN0cm95IiwibGF5b3V0IiwiQ29uc3R1Y3RvciIsImNvbGxhcHNlU2NyZWVuU2l6ZSIsImV4cGFuZE9uSG92ZXIiLCJleHBhbmRUcmFuc2l0aW9uRGVsYXkiLCJtYWluU2lkZWJhciIsInNlYXJjaElucHV0IiwiYnV0dG9uIiwibWluaSIsImxheW91dEZpeGVkIiwiZXhwYW5kRmVhdHVyZSIsImNsaWNrIiwid2lkdGgiLCJjbG9zZSIsInN0b3BQcm9wYWdhdGlvbiIsImhvdmVyIiwic2V0VGltZW91dCIsInB1c2hNZW51Iiwib25DaGVjayIsIm9uVW5DaGVjayIsImRvbmUiLCJsaSIsInByb3AiLCJ1bkNoZWNrIiwiY2hlY2siLCJ0b2RvTGlzdCIsImFjY29yZGlvbiIsImZvbGxvd0xpbmsiLCJ0cmVlIiwidHJlZXZpZXciLCJ0cmVldmlld01lbnUiLCJhY3RpdmUiLCJuZXh0IiwicGFyZW50IiwiYXR0ciIsInNpYmxpbmdzIiwicmVxdWlyZSIsIiQiLCJyZWFkeSIsImRpc3BsYXkiLCJ0YWJsZSIsInJvd3MiLCJsZW5ndGgiLCJ0ciIsImNsb25lIiwidW5kZWZpbmVkIiwicmVwbGFjZSIsImFwcGVuZFRvIiwic2hvdyIsInBhcmVudE1vZGFsIiwidmFsIiwiaGlkZSIsInRleHQiLCJjaGFuZ2UiLCJldmVudCIsImNvbmZpcm0iLCJtb2RhbCIsIm5yIiwiRm9ybURhdGEiLCJmb3JtIiwiYWpheCIsInVybCIsInR5cGUiLCJwcm9jZXNzRGF0YSIsImNvbnRlbnRUeXBlIiwic3VjY2VzcyIsImVycm9yIiwiYWxlcnQiLCJpZCIsInNlbGVjdCIsImxhYmVsIiwiaW5wdXRzIiwiZGF0YTIiLCJpbmRleCIsImlucHV0IiwibmFtZSIsInZhbHVlIiwicmVsYXRlZF92YWx1ZV9YIiwicmVsYXRlZF92YWx1ZV9ZIiwicmVsYXRlZF92YWx1ZV9aIiwidGltZSIsImlkcyIsInB1c2giLCJkcmF3Q2hhcnQiLCJ0b29sdGlwIiwiaUNoZWNrIiwiY2hlY2tib3hDbGFzcyIsInJhZGlvQ2xhc3MiLCJtZXRob2QiLCJjb21wbGV0ZSIsInhociIsInN0YXR1cyIsImdvb2dsZSIsInZpc3VhbGl6YXRpb24iLCJEYXRhVGFibGUiLCJjaGFydCIsIkNvbWJvQ2hhcnQiLCJnZXRFbGVtZW50QnlJZCIsImJhciIsImdyb3VwV2lkdGgiLCJzZXJpZXNUeXBlIiwic2VyaWVzIiwibGVnZW5kIiwidkF4ZXMiLCJkaXJlY3Rpb24iLCJyZXNwb25zZVRleHQiLCJqc29uIiwicmVzcG9uc2VKU09OIiwiYWRkQ29sdW1uIiwidGFyZ2V0QXhpc0luZGV4IiwiYmFja2dyb3VuZENvbG9yIiwiYWRkUm93cyIsImRyYXciLCJjbGVhckNoYXJ0IiwiRiIsInRlc3QiLCJtIiwicyIsImwiLCJIIiwiY2hlY2tlZCIsImRpc2FibGVkIiwiaW5kZXRlcm1pbmF0ZSIsInciLCJEIiwidCIsInAiLCJuIiwidSIsIkEiLCJCIiwiSyIsIkUiLCJrIiwieCIsIk4iLCJDIiwiY2xvc2VzdCIsInIiLCJxIiwiTCIsInkiLCJJIiwidiIsInoiLCJNIiwib2ZmIiwidW53cmFwIiwiRyIsImFkZCIsIm8iLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiSiIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaXNGdW5jdGlvbiIsImNoZWNrZWRDbGFzcyIsImRpc2FibGVkQ2xhc3MiLCJpbmRldGVybWluYXRlQ2xhc3MiLCJsYWJlbEhvdmVyIiwiYXJpYSIsImhhbmRsZSIsImhvdmVyQ2xhc3MiLCJmb2N1c0NsYXNzIiwiYWN0aXZlQ2xhc3MiLCJsYWJlbEhvdmVyQ2xhc3MiLCJpbmNyZWFzZUFyZWEiLCJ0b3AiLCJsZWZ0IiwibWFyZ2luIiwicGFkZGluZyIsImJhY2tncm91bmQiLCJib3JkZXIiLCJvcGFjaXR5IiwidmlzaWJpbGl0eSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsIndyYXAiLCJpbnNlcnQiLCJpbmhlcml0Q2xhc3MiLCJjbGFzc05hbWUiLCJpbmhlcml0SUQiLCJ0YXJnZXQiLCJrZXlDb2RlIiwiWmVwdG8iLCJ3aWRnZXQiLCIkZWxlbWVudCIsImRlZmF1bHRUaW1lIiwiZGlzYWJsZUZvY3VzIiwiZGlzYWJsZU1vdXNld2hlZWwiLCJpc09wZW4iLCJtaW51dGVTdGVwIiwibW9kYWxCYWNrZHJvcCIsIm9yaWVudGF0aW9uIiwic2Vjb25kU3RlcCIsInNuYXBUb1N0ZXAiLCJzaG93SW5wdXRzIiwic2hvd01lcmlkaWFuIiwic2hvd1NlY29uZHMiLCJ0ZW1wbGF0ZSIsImFwcGVuZFdpZGdldFRvIiwic2hvd1dpZGdldE9uQWRkb25DbGljayIsImljb25zIiwibWF4SG91cnMiLCJleHBsaWNpdE1vZGUiLCJoYW5kbGVEb2N1bWVudENsaWNrIiwic2NvcGUiLCIkd2lkZ2V0IiwiaGlkZVdpZGdldCIsIl9pbml0IiwiY29uc3RydWN0b3IiLCJwcm94eSIsInNob3dXaWRnZXQiLCJoaWdobGlnaHRVbml0IiwiZWxlbWVudEtleWRvd24iLCJibHVyRWxlbWVudCIsIm1vdXNld2hlZWwiLCJnZXRUZW1wbGF0ZSIsIndpZGdldENsaWNrIiwid2lkZ2V0S2V5ZG93biIsIndpZGdldEtleXVwIiwic2V0RGVmYXVsdFRpbWUiLCJoaWdobGlnaHRlZFVuaXQiLCJ1cGRhdGVGcm9tRWxlbWVudFZhbCIsImNsZWFyIiwiaG91ciIsIm1pbnV0ZSIsInNlY29uZCIsIm1lcmlkaWFuIiwiZGVjcmVtZW50SG91ciIsInRvZ2dsZU1lcmlkaWFuIiwiZGVjcmVtZW50TWludXRlIiwiZGVjcmVtZW50U2Vjb25kIiwid2hpY2giLCJzaGlmdEtleSIsImhpZ2hsaWdodFByZXZVbml0IiwiaGlnaGxpZ2h0TmV4dFVuaXQiLCJpbmNyZW1lbnRIb3VyIiwiaGlnaGxpZ2h0SG91ciIsImluY3JlbWVudE1pbnV0ZSIsImhpZ2hsaWdodE1pbnV0ZSIsImluY3JlbWVudFNlY29uZCIsImhpZ2hsaWdodFNlY29uZCIsImhpZ2hsaWdodE1lcmlkaWFuIiwidXBkYXRlIiwiZ2V0Q3Vyc29yUG9zaXRpb24iLCJzZWxlY3Rpb25TdGFydCIsInNlbGVjdGlvbiIsImZvY3VzIiwiY3JlYXRlUmFuZ2UiLCJtb3ZlU3RhcnQiLCJ1cCIsImRvd24iLCJnZXRUaW1lIiwiaG91cnMiLCJtaW51dGVzIiwic2Vjb25kcyIsImRldGFjaCIsInNldFNlbGVjdGlvblJhbmdlIiwib3JpZ2luYWxFdmVudCIsIndoZWVsRGVsdGEiLCJkZXRhaWwiLCJzY3JvbGxUb3AiLCJjaGFuZ2VUb05lYXJlc3RTdGVwIiwicm91bmQiLCJwbGFjZSIsImlzSW5saW5lIiwib3V0ZXJXaWR0aCIsInBhcnNlSW50IiwiZmlsdGVyIiwiY29tcG9uZW50Iiwib2Zmc2V0IiwibWF4IiwiekluZGV4IiwidGltZXBpY2tlciIsIkRhdGUiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiY2VpbCIsInNldFRpbWUiLCJnZXRNb250aCIsInNwbGl0IiwiaXNOYU4iLCJibHVyIiwidXBkYXRlRWxlbWVudCIsInVwZGF0ZVdpZGdldCIsInVwZGF0ZUZyb21XaWRnZXRJbnB1dHMiLCJBcnJheSIsImFwcGx5IiwiYXJndW1lbnRzIiwic2hpZnQiLCJkZWZhdWx0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0JBQStCLFNBQVMscUJBQXFCLEVBQUU7O0FBRS9EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFF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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsMkJBQTJCLHVCQUF1QjtBQUNsRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSwrQkFBK0IsdUJBQXVCOztBQUV0RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MsbUJBQW1CO0FBQ25EO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEI7O0FBRTVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLCtCQUErQixtQkFBbUI7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7O0FDL2xHRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLGtCQUFrQixpQkFBaUI7O0FBRW5DOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQjs7QUFFaEIsa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnRUFBZ0U7QUFDaEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsaUJBQWlCOztBQUU5Qzs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7O0FBRUEsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixtQkFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDZGQUE2RixnQkFBZ0IsaUJBQWlCO0FBQzlIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseUNBQXlDLHlCQUF5QjtBQUNsRSxtRUFBbUUsOEJBQThCLGdDQUFnQyxzQ0FBc0M7QUFDdks7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOLEtBQUs7QUFDTCxJQUFJO0FBQ0osR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHlEQUF5RCxTQUFTO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLG1CQUFtQjs7QUFFckM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qiw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU4sK0JBQStCOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxtQkFBbUIsdUJBQXVCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxxQkFBcUIsd0JBQXdCO0FBQzdDO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHVCQUF1QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQix1QkFBdUI7QUFDekM7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5RkFBeUY7QUFDekY7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLGtCQUFrQixZQUFZLDBCQUEwQjtBQUNwRyxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUYsQ0FBQzs7Ozs7Ozs7Ozs7O0FDbnpCRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVksd0NBQXdDLCtHQUErRyxTQUFTLFFBQVEsVUFBVSxvQkFBb0IsaUJBQWlCLG1CQUFtQixhQUFhLGNBQWMsYUFBYSxVQUFVLHlCQUF5QixFQUFFLGlCQUFpQixJQUFJLEtBQUsscUJBQXFCLG1CQUFtQixhQUFhLGNBQWMscUJBQXFCLEtBQUssS0FBSyxlQUFlLGNBQWMsT0FBTyxnQkFBZ0IsY0FBYyxNQUFNLHdCQUF3QixLQUFLLGdCQUFnQixRQUFRLGlCQUFpQixtQkFBbUIsYUFBYSxNQUFNLGtCQUFrQiw4QkFBOEIsc0JBQXNCLHVCQUF1Qix3QkFBd0Isb0JBQW9CLElBQUksU0FBUyxLQUFLLFlBQVksZUFBZSxjQUFjLGFBQWEsT0FBTyxxQkFBcUIsS0FBSyxLQUFLLGNBQWMsOEJBQThCLHlDQUF5QywwQkFBMEIsMkJBQTJCLFdBQVcsS0FBSyxZQUFZLE1BQU0sT0FBTyxhQUFhLDBCQUEwQiw2QkFBNkIsS0FBSyxxQkFBcUIsVUFBVSw2QkFBNkIsbUNBQW1DLHFJQUFxSSwrQkFBK0Isd0JBQXdCLFFBQVEsR0FBRyw0QkFBNEIsa0NBQWtDLDRKQUE0SixJQUFJOztBQUUzbkQ7QUFDQSxtQkFBbUIsR0FBRzs7QUFFdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7O0FDMUREOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBLGlCQUFpQixnQkFBZ0I7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0MsaURBQWlEO0FBQ2pELHdDQUF3QztBQUN4Qyw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLGtDQUFrQztBQUNsQyxvQ0FBb0M7QUFDcEMseUNBQXlDO0FBQ3pDLDZDQUE2QztBQUM3QywyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0Msa0RBQWtEO0FBQ2xELHdDQUF3QztBQUN4QyxzREFBc0Q7QUFDdEQsc0RBQXNEO0FBQ3RELG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7O0FBRVI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxD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LGNBQVUsRUFBQyxFQUFoSjtBQUFtSkMsY0FBVSxFQUFDLENBQUMsQ0FBL0o7QUFBaUtHLGVBQVcsRUFBQyxDQUFDLENBQTlLO0FBQWdMRixjQUFVLEVBQUMsQ0FBQyxDQUE1TDtBQUE4TEMsZ0JBQVksRUFBQyxDQUFDLENBQTVNO0FBQThNRSxZQUFRLEVBQUMsVUFBdk47QUFBa09DLGtCQUFjLEVBQUMsTUFBalA7QUFBd1BDLDBCQUFzQixFQUFDLENBQUMsQ0FBaFI7QUFBa1JDLFNBQUssRUFBQztBQUFDaUQsUUFBRSxFQUFDLGdDQUFKO0FBQXFDQyxVQUFJLEVBQUM7QUFBMUMsS0FBeFI7QUFBc1dqRCxZQUFRLEVBQUMsRUFBL1c7QUFBa1hDLGdCQUFZLEVBQUMsQ0FBQztBQUFoWSxHQUFqcWhCLEVBQW9paUIvVCxDQUFDLENBQUNxQyxFQUFGLENBQUtnVyxVQUFMLENBQWdCOVYsV0FBaEIsR0FBNEI5QixDQUFoa2lCLEVBQWtraUJULENBQUMsQ0FBQ00sQ0FBRCxDQUFELENBQUsyQixFQUFMLENBQVEscURBQVIsRUFBOEQsNkJBQTlELEVBQTRGLFVBQVNoQyxDQUFULEVBQVc7QUFBQyxRQUFJSyxDQUFDLEdBQUNOLENBQUMsQ0FBQyxJQUFELENBQVA7QUFBY00sS0FBQyxDQUFDRCxJQUFGLENBQU8sWUFBUCxNQUF1QkosQ0FBQyxDQUFDaUMsY0FBRixJQUFtQjVCLENBQUMsQ0FBQytYLFVBQUYsRUFBMUM7QUFBMEQsR0FBaEwsQ0FBbGtpQjtBQUFvdmlCLENBQXZqa0IsQ0FBd2prQnZZLE1BQXhqa0IsRUFBK2prQjJDLE1BQS9qa0IsRUFBc2trQjhDLFFBQXRra0IsQ0FBRCxDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEZsb3QgcGx1Z2luIGZvciBwbG90dGluZyB0ZXh0dWFsIGRhdGEgb3IgY2F0ZWdvcmllcy5cblxuQ29weXJpZ2h0IChjKSAyMDA3LTIwMTQgSU9MQSBhbmQgT2xlIExhdXJzZW4uXG5MaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbkNvbnNpZGVyIGEgZGF0YXNldCBsaWtlIFtbXCJGZWJydWFyeVwiLCAzNF0sIFtcIk1hcmNoXCIsIDIwXSwgLi4uXS4gVGhpcyBwbHVnaW5cbmFsbG93cyB5b3UgdG8gcGxvdCBzdWNoIGEgZGF0YXNldCBkaXJlY3RseS5cblxuVG8gZW5hYmxlIGl0LCB5b3UgbXVzdCBzcGVjaWZ5IG1vZGU6IFwiY2F0ZWdvcmllc1wiIG9uIHRoZSBheGlzIHdpdGggdGhlIHRleHR1YWxcbmxhYmVscywgZS5nLlxuXG5cdCQucGxvdChcIiNwbGFjZWhvbGRlclwiLCBkYXRhLCB7IHhheGlzOiB7IG1vZGU6IFwiY2F0ZWdvcmllc1wiIH0gfSk7XG5cbkJ5IGRlZmF1bHQsIHRoZSBsYWJlbHMgYXJlIG9yZGVyZWQgYXMgdGhleSBhcmUgbWV0IGluIHRoZSBkYXRhIHNlcmllcy4gSWYgeW91XG5uZWVkIGEgZGlmZmVyZW50IG9yZGVyaW5nLCB5b3UgY2FuIHNwZWNpZnkgXCJjYXRlZ29yaWVzXCIgb24gdGhlIGF4aXMgb3B0aW9uc1xuYW5kIGxpc3QgdGhlIGNhdGVnb3JpZXMgdGhlcmU6XG5cblx0eGF4aXM6IHtcblx0XHRtb2RlOiBcImNhdGVnb3JpZXNcIixcblx0XHRjYXRlZ29yaWVzOiBbXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIl1cblx0fVxuXG5JZiB5b3UgbmVlZCB0byBjdXN0b21pemUgdGhlIGRpc3RhbmNlcyBiZXR3ZWVuIHRoZSBjYXRlZ29yaWVzLCB5b3UgY2FuIHNwZWNpZnlcblwiY2F0ZWdvcmllc1wiIGFzIGFuIG9iamVjdCBtYXBwaW5nIGxhYmVscyB0byB2YWx1ZXNcblxuXHR4YXhpczoge1xuXHRcdG1vZGU6IFwiY2F0ZWdvcmllc1wiLFxuXHRcdGNhdGVnb3JpZXM6IHsgXCJGZWJydWFyeVwiOiAxLCBcIk1hcmNoXCI6IDMsIFwiQXByaWxcIjogNCB9XG5cdH1cblxuSWYgeW91IGRvbid0IHNwZWNpZnkgYWxsIGNhdGVnb3JpZXMsIHRoZSByZW1haW5pbmcgY2F0ZWdvcmllcyB3aWxsIGJlIG51bWJlcmVkXG5mcm9tIHRoZSBtYXggdmFsdWUgcGx1cyAxICh3aXRoIGEgc3BhY2luZyBvZiAxIGJldHdlZW4gZWFjaCkuXG5cbkludGVybmFsbHksIHRoZSBwbHVnaW4gd29ya3MgYnkgdHJhbnNmb3JtaW5nIHRoZSBpbnB1dCBkYXRhIHRocm91Z2ggYW4gYXV0by1cbmdlbmVyYXRlZCBtYXBwaW5nIHdoZXJlIHRoZSBmaXJzdCBjYXRlZ29yeSBiZWNvbWVzIDAsIHRoZSBzZWNvbmQgMSwgZXRjLlxuSGVuY2UsIGEgcG9pbnQgbGlrZSBbXCJGZWJydWFyeVwiLCAzNF0gYmVjb21lcyBbMCwgMzRdIGludGVybmFsbHkgaW4gRmxvdCAodGhpc1xuaXMgdmlzaWJsZSBpbiBob3ZlciBhbmQgY2xpY2sgZXZlbnRzIHRoYXQgcmV0dXJuIG51bWJlcnMgcmF0aGVyIHRoYW4gdGhlXG5jYXRlZ29yeSBsYWJlbHMpLiBUaGUgcGx1Z2luIGFsc28gb3ZlcnJpZGVzIHRoZSB0aWNrIGdlbmVyYXRvciB0byBzcGl0IG91dCB0aGVcbmNhdGVnb3JpZXMgYXMgdGlja3MgaW5zdGVhZCBvZiB0aGUgdmFsdWVzLlxuXG5JZiB5b3UgbmVlZCB0byBtYXAgYSB2YWx1ZSBiYWNrIHRvIGl0cyBsYWJlbCwgdGhlIG1hcHBpbmcgaXMgYWx3YXlzIGFjY2Vzc2libGVcbmFzIFwiY2F0ZWdvcmllc1wiIG9uIHRoZSBheGlzIG9iamVjdCwgZS5nLiBwbG90LmdldEF4ZXMoKS54YXhpcy5jYXRlZ29yaWVzLlxuXG4qL1xuXG4oZnVuY3Rpb24gKCQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgeGF4aXM6IHtcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgeWF4aXM6IHtcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IG51bGxcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Jhd0RhdGEocGxvdCwgc2VyaWVzLCBkYXRhLCBkYXRhcG9pbnRzKSB7XG4gICAgICAgIC8vIGlmIGNhdGVnb3JpZXMgYXJlIGVuYWJsZWQsIHdlIG5lZWQgdG8gZGlzYWJsZVxuICAgICAgICAvLyBhdXRvLXRyYW5zZm9ybWF0aW9uIHRvIG51bWJlcnMgc28gdGhlIHN0cmluZ3MgYXJlIGludGFjdFxuICAgICAgICAvLyBmb3IgbGF0ZXIgcHJvY2Vzc2luZ1xuXG4gICAgICAgIHZhciB4Q2F0ZWdvcmllcyA9IHNlcmllcy54YXhpcy5vcHRpb25zLm1vZGUgPT0gXCJjYXRlZ29yaWVzXCIsXG4gICAgICAgICAgICB5Q2F0ZWdvcmllcyA9IHNlcmllcy55YXhpcy5vcHRpb25zLm1vZGUgPT0gXCJjYXRlZ29yaWVzXCI7XG4gICAgICAgIFxuICAgICAgICBpZiAoISh4Q2F0ZWdvcmllcyB8fCB5Q2F0ZWdvcmllcykpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGZvcm1hdCA9IGRhdGFwb2ludHMuZm9ybWF0O1xuXG4gICAgICAgIGlmICghZm9ybWF0KSB7XG4gICAgICAgICAgICAvLyBGSVhNRTogYXV0by1kZXRlY3Rpb24gc2hvdWxkIHJlYWxseSBub3QgYmUgZGVmaW5lZCBoZXJlXG4gICAgICAgICAgICB2YXIgcyA9IHNlcmllcztcbiAgICAgICAgICAgIGZvcm1hdCA9IFtdO1xuICAgICAgICAgICAgZm9ybWF0LnB1c2goeyB4OiB0cnVlLCBudW1iZXI6IHRydWUsIHJlcXVpcmVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgZm9ybWF0LnB1c2goeyB5OiB0cnVlLCBudW1iZXI6IHRydWUsIHJlcXVpcmVkOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICBpZiAocy5iYXJzLnNob3cgfHwgKHMubGluZXMuc2hvdyAmJiBzLmxpbmVzLmZpbGwpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF1dG9zY2FsZSA9ICEhKChzLmJhcnMuc2hvdyAmJiBzLmJhcnMuemVybykgfHwgKHMubGluZXMuc2hvdyAmJiBzLmxpbmVzLnplcm8pKTtcbiAgICAgICAgICAgICAgICBmb3JtYXQucHVzaCh7IHk6IHRydWUsIG51bWJlcjogdHJ1ZSwgcmVxdWlyZWQ6IGZhbHNlLCBkZWZhdWx0VmFsdWU6IDAsIGF1dG9zY2FsZTogYXV0b3NjYWxlIH0pO1xuICAgICAgICAgICAgICAgIGlmIChzLmJhcnMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybWF0W2Zvcm1hdC5sZW5ndGggLSAxXS55O1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXRbZm9ybWF0Lmxlbmd0aCAtIDFdLnggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZGF0YXBvaW50cy5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IGZvcm1hdC5sZW5ndGg7ICsrbSkge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFttXS54ICYmIHhDYXRlZ29yaWVzKVxuICAgICAgICAgICAgICAgIGZvcm1hdFttXS5udW1iZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGZvcm1hdFttXS55ICYmIHlDYXRlZ29yaWVzKVxuICAgICAgICAgICAgICAgIGZvcm1hdFttXS5udW1iZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE5leHRJbmRleChjYXRlZ29yaWVzKSB7XG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgdiBpbiBjYXRlZ29yaWVzKVxuICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXNbdl0gPiBpbmRleClcbiAgICAgICAgICAgICAgICBpbmRleCA9IGNhdGVnb3JpZXNbdl07XG5cbiAgICAgICAgcmV0dXJuIGluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYXRlZ29yaWVzVGlja0dlbmVyYXRvcihheGlzKSB7XG4gICAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgbGFiZWwgaW4gYXhpcy5jYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICB2YXIgdiA9IGF4aXMuY2F0ZWdvcmllc1tsYWJlbF07XG4gICAgICAgICAgICBpZiAodiA+PSBheGlzLm1pbiAmJiB2IDw9IGF4aXMubWF4KVxuICAgICAgICAgICAgICAgIHJlcy5wdXNoKFt2LCBsYWJlbF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGFbMF0gLSBiWzBdOyB9KTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBzZXR1cENhdGVnb3JpZXNGb3JBeGlzKHNlcmllcywgYXhpcywgZGF0YXBvaW50cykge1xuICAgICAgICBpZiAoc2VyaWVzW2F4aXNdLm9wdGlvbnMubW9kZSAhPSBcImNhdGVnb3JpZXNcIilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgXG4gICAgICAgIGlmICghc2VyaWVzW2F4aXNdLmNhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIC8vIHBhcnNlIG9wdGlvbnNcbiAgICAgICAgICAgIHZhciBjID0ge30sIG8gPSBzZXJpZXNbYXhpc10ub3B0aW9ucy5jYXRlZ29yaWVzIHx8IHt9O1xuICAgICAgICAgICAgaWYgKCQuaXNBcnJheShvKSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgby5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICAgICAgY1tvW2ldXSA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2IGluIG8pXG4gICAgICAgICAgICAgICAgICAgIGNbdl0gPSBvW3ZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXJpZXNbYXhpc10uY2F0ZWdvcmllcyA9IGM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaXggdGlja3NcbiAgICAgICAgaWYgKCFzZXJpZXNbYXhpc10ub3B0aW9ucy50aWNrcylcbiAgICAgICAgICAgIHNlcmllc1theGlzXS5vcHRpb25zLnRpY2tzID0gY2F0ZWdvcmllc1RpY2tHZW5lcmF0b3I7XG5cbiAgICAgICAgdHJhbnNmb3JtUG9pbnRzT25BeGlzKGRhdGFwb2ludHMsIGF4aXMsIHNlcmllc1theGlzXS5jYXRlZ29yaWVzKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtUG9pbnRzT25BeGlzKGRhdGFwb2ludHMsIGF4aXMsIGNhdGVnb3JpZXMpIHtcbiAgICAgICAgLy8gZ28gdGhyb3VnaCB0aGUgcG9pbnRzLCB0cmFuc2Zvcm1pbmcgdGhlbVxuICAgICAgICB2YXIgcG9pbnRzID0gZGF0YXBvaW50cy5wb2ludHMsXG4gICAgICAgICAgICBwcyA9IGRhdGFwb2ludHMucG9pbnRzaXplLFxuICAgICAgICAgICAgZm9ybWF0ID0gZGF0YXBvaW50cy5mb3JtYXQsXG4gICAgICAgICAgICBmb3JtYXRDb2x1bW4gPSBheGlzLmNoYXJBdCgwKSxcbiAgICAgICAgICAgIGluZGV4ID0gZ2V0TmV4dEluZGV4KGNhdGVnb3JpZXMpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSBwcykge1xuICAgICAgICAgICAgaWYgKHBvaW50c1tpXSA9PSBudWxsKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHBzOyArK20pIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsID0gcG9pbnRzW2kgKyBtXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCB8fCAhZm9ybWF0W21dW2Zvcm1hdENvbHVtbl0pXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEodmFsIGluIGNhdGVnb3JpZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3JpZXNbdmFsXSA9IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwb2ludHNbaSArIG1dID0gY2F0ZWdvcmllc1t2YWxdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0RhdGFwb2ludHMocGxvdCwgc2VyaWVzLCBkYXRhcG9pbnRzKSB7XG4gICAgICAgIHNldHVwQ2F0ZWdvcmllc0ZvckF4aXMoc2VyaWVzLCBcInhheGlzXCIsIGRhdGFwb2ludHMpO1xuICAgICAgICBzZXR1cENhdGVnb3JpZXNGb3JBeGlzKHNlcmllcywgXCJ5YXhpc1wiLCBkYXRhcG9pbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0KHBsb3QpIHtcbiAgICAgICAgcGxvdC5ob29rcy5wcm9jZXNzUmF3RGF0YS5wdXNoKHByb2Nlc3NSYXdEYXRhKTtcbiAgICAgICAgcGxvdC5ob29rcy5wcm9jZXNzRGF0YXBvaW50cy5wdXNoKHByb2Nlc3NEYXRhcG9pbnRzKTtcbiAgICB9XG4gICAgXG4gICAgJC5wbG90LnBsdWdpbnMucHVzaCh7XG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIG5hbWU6ICdjYXRlZ29yaWVzJyxcbiAgICAgICAgdmVyc2lvbjogJzEuMCdcbiAgICB9KTtcbn0pKGpRdWVyeSk7XG4iLCIvKiBKYXZhc2NyaXB0IHBsb3R0aW5nIGxpYnJhcnkgZm9yIGpRdWVyeSwgdmVyc2lvbiAwLjguMy5cblxuQ29weXJpZ2h0IChjKSAyMDA3LTIwMTQgSU9MQSBhbmQgT2xlIExhdXJzZW4uXG5MaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbiovXG5cbi8vIGZpcnN0IGFuIGlubGluZSBkZXBlbmRlbmN5LCBqcXVlcnkuY29sb3JoZWxwZXJzLmpzLCB3ZSBpbmxpbmUgaXQgaGVyZVxuLy8gZm9yIGNvbnZlbmllbmNlXG5cbi8qIFBsdWdpbiBmb3IgalF1ZXJ5IGZvciB3b3JraW5nIHdpdGggY29sb3JzLlxuICpcbiAqIFZlcnNpb24gMS4xLlxuICpcbiAqIEluc3BpcmF0aW9uIGZyb20galF1ZXJ5IGNvbG9yIGFuaW1hdGlvbiBwbHVnaW4gYnkgSm9obiBSZXNpZy5cbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgYnkgT2xlIExhdXJzZW4sIE9jdG9iZXIgMjAwOS5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICQuY29sb3IucGFyc2UoXCIjZmZmXCIpLnNjYWxlKCdyZ2InLCAwLjI1KS5hZGQoJ2EnLCAtMC41KS50b1N0cmluZygpXG4gKiAgIHZhciBjID0gJC5jb2xvci5leHRyYWN0KCQoXCIjbXlkaXZcIiksICdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gKiAgIGNvbnNvbGUubG9nKGMuciwgYy5nLCBjLmIsIGMuYSk7XG4gKiAgICQuY29sb3IubWFrZSgxMDAsIDUwLCAyNSwgMC40KS50b1N0cmluZygpIC8vIHJldHVybnMgXCJyZ2JhKDEwMCw1MCwyNSwwLjQpXCJcbiAqXG4gKiBOb3RlIHRoYXQgLnNjYWxlKCkgYW5kIC5hZGQoKSByZXR1cm4gdGhlIHNhbWUgbW9kaWZpZWQgb2JqZWN0XG4gKiBpbnN0ZWFkIG9mIG1ha2luZyBhIG5ldyBvbmUuXG4gKlxuICogVi4gMS4xOiBGaXggZXJyb3IgaGFuZGxpbmcgc28gZS5nLiBwYXJzaW5nIGFuIGVtcHR5IHN0cmluZyBkb2VzXG4gKiBwcm9kdWNlIGEgY29sb3IgcmF0aGVyIHRoYW4ganVzdCBjcmFzaGluZy5cbiAqL1xuKGZ1bmN0aW9uKCQpeyQuY29sb3I9e307JC5jb2xvci5tYWtlPWZ1bmN0aW9uKHIsZyxiLGEpe3ZhciBvPXt9O28ucj1yfHwwO28uZz1nfHwwO28uYj1ifHwwO28uYT1hIT1udWxsP2E6MTtvLmFkZD1mdW5jdGlvbihjLGQpe2Zvcih2YXIgaT0wO2k8Yy5sZW5ndGg7KytpKW9bYy5jaGFyQXQoaSldKz1kO3JldHVybiBvLm5vcm1hbGl6ZSgpfTtvLnNjYWxlPWZ1bmN0aW9uKGMsZil7Zm9yKHZhciBpPTA7aTxjLmxlbmd0aDsrK2kpb1tjLmNoYXJBdChpKV0qPWY7cmV0dXJuIG8ubm9ybWFsaXplKCl9O28udG9TdHJpbmc9ZnVuY3Rpb24oKXtpZihvLmE+PTEpe3JldHVyblwicmdiKFwiK1tvLnIsby5nLG8uYl0uam9pbihcIixcIikrXCIpXCJ9ZWxzZXtyZXR1cm5cInJnYmEoXCIrW28ucixvLmcsby5iLG8uYV0uam9pbihcIixcIikrXCIpXCJ9fTtvLm5vcm1hbGl6ZT1mdW5jdGlvbigpe2Z1bmN0aW9uIGNsYW1wKG1pbix2YWx1ZSxtYXgpe3JldHVybiB2YWx1ZTxtaW4/bWluOnZhbHVlPm1heD9tYXg6dmFsdWV9by5yPWNsYW1wKDAscGFyc2VJbnQoby5yKSwyNTUpO28uZz1jbGFtcCgwLHBhcnNlSW50KG8uZyksMjU1KTtvLmI9Y2xhbXAoMCxwYXJzZUludChvLmIpLDI1NSk7by5hPWNsYW1wKDAsby5hLDEpO3JldHVybiBvfTtvLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuICQuY29sb3IubWFrZShvLnIsby5iLG8uZyxvLmEpfTtyZXR1cm4gby5ub3JtYWxpemUoKX07JC5jb2xvci5leHRyYWN0PWZ1bmN0aW9uKGVsZW0sY3NzKXt2YXIgYztkb3tjPWVsZW0uY3NzKGNzcykudG9Mb3dlckNhc2UoKTtpZihjIT1cIlwiJiZjIT1cInRyYW5zcGFyZW50XCIpYnJlYWs7ZWxlbT1lbGVtLnBhcmVudCgpfXdoaWxlKGVsZW0ubGVuZ3RoJiYhJC5ub2RlTmFtZShlbGVtLmdldCgwKSxcImJvZHlcIikpO2lmKGM9PVwicmdiYSgwLCAwLCAwLCAwKVwiKWM9XCJ0cmFuc3BhcmVudFwiO3JldHVybiAkLmNvbG9yLnBhcnNlKGMpfTskLmNvbG9yLnBhcnNlPWZ1bmN0aW9uKHN0cil7dmFyIHJlcyxtPSQuY29sb3IubWFrZTtpZihyZXM9L3JnYlxcKFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqXFwpLy5leGVjKHN0cikpcmV0dXJuIG0ocGFyc2VJbnQocmVzWzFdLDEwKSxwYXJzZUludChyZXNbMl0sMTApLHBhcnNlSW50KHJlc1szXSwxMCkpO2lmKHJlcz0vcmdiYVxcKFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV17MSwzfSlcXHMqLFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFxzKlxcKS8uZXhlYyhzdHIpKXJldHVybiBtKHBhcnNlSW50KHJlc1sxXSwxMCkscGFyc2VJbnQocmVzWzJdLDEwKSxwYXJzZUludChyZXNbM10sMTApLHBhcnNlRmxvYXQocmVzWzRdKSk7aWYocmVzPS9yZ2JcXChcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqLFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKlxcKS8uZXhlYyhzdHIpKXJldHVybiBtKHBhcnNlRmxvYXQocmVzWzFdKSoyLjU1LHBhcnNlRmxvYXQocmVzWzJdKSoyLjU1LHBhcnNlRmxvYXQocmVzWzNdKSoyLjU1KTtpZihyZXM9L3JnYmFcXChcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxcJVxccyosXFxzKihbMC05XSsoPzpcXC5bMC05XSspPylcXCVcXHMqLFxccyooWzAtOV0rKD86XFwuWzAtOV0rKT8pXFwlXFxzKixcXHMqKFswLTldKyg/OlxcLlswLTldKyk/KVxccypcXCkvLmV4ZWMoc3RyKSlyZXR1cm4gbShwYXJzZUZsb2F0KHJlc1sxXSkqMi41NSxwYXJzZUZsb2F0KHJlc1syXSkqMi41NSxwYXJzZUZsb2F0KHJlc1szXSkqMi41NSxwYXJzZUZsb2F0KHJlc1s0XSkpO2lmKHJlcz0vIyhbYS1mQS1GMC05XXsyfSkoW2EtZkEtRjAtOV17Mn0pKFthLWZBLUYwLTldezJ9KS8uZXhlYyhzdHIpKXJldHVybiBtKHBhcnNlSW50KHJlc1sxXSwxNikscGFyc2VJbnQocmVzWzJdLDE2KSxwYXJzZUludChyZXNbM10sMTYpKTtpZihyZXM9LyMoW2EtZkEtRjAtOV0pKFthLWZBLUYwLTldKShbYS1mQS1GMC05XSkvLmV4ZWMoc3RyKSlyZXR1cm4gbShwYXJzZUludChyZXNbMV0rcmVzWzFdLDE2KSxwYXJzZUludChyZXNbMl0rcmVzWzJdLDE2KSxwYXJzZUludChyZXNbM10rcmVzWzNdLDE2KSk7dmFyIG5hbWU9JC50cmltKHN0cikudG9Mb3dlckNhc2UoKTtpZihuYW1lPT1cInRyYW5zcGFyZW50XCIpcmV0dXJuIG0oMjU1LDI1NSwyNTUsMCk7ZWxzZXtyZXM9bG9va3VwQ29sb3JzW25hbWVdfHxbMCwwLDBdO3JldHVybiBtKHJlc1swXSxyZXNbMV0scmVzWzJdKX19O3ZhciBsb29rdXBDb2xvcnM9e2FxdWE6WzAsMjU1LDI1NV0sYXp1cmU6WzI0MCwyNTUsMjU1XSxiZWlnZTpbMjQ1LDI0NSwyMjBdLGJsYWNrOlswLDAsMF0sYmx1ZTpbMCwwLDI1NV0sYnJvd246WzE2NSw0Miw0Ml0sY3lhbjpbMCwyNTUsMjU1XSxkYXJrYmx1ZTpbMCwwLDEzOV0sZGFya2N5YW46WzAsMTM5LDEzOV0sZGFya2dyZXk6WzE2OSwxNjksMTY5XSxkYXJrZ3JlZW46WzAsMTAwLDBdLGRhcmtraGFraTpbMTg5LDE4MywxMDddLGRhcmttYWdlbnRhOlsxMzksMCwxMzldLGRhcmtvbGl2ZWdyZWVuOls4NSwxMDcsNDddLGRhcmtvcmFuZ2U6WzI1NSwxNDAsMF0sZGFya29yY2hpZDpbMTUzLDUwLDIwNF0sZGFya3JlZDpbMTM5LDAsMF0sZGFya3NhbG1vbjpbMjMzLDE1MCwxMjJdLGRhcmt2aW9sZXQ6WzE0OCwwLDIxMV0sZnVjaHNpYTpbMjU1LDAsMjU1XSxnb2xkOlsyNTUsMjE1LDBdLGdyZWVuOlswLDEyOCwwXSxpbmRpZ286Wzc1LDAsMTMwXSxraGFraTpbMjQwLDIzMCwxNDBdLGxpZ2h0Ymx1ZTpbMTczLDIxNiwyMzBdLGxpZ2h0Y3lhbjpbMjI0LDI1NSwyNTVdLGxpZ2h0Z3JlZW46WzE0NCwyMzgsMTQ0XSxsaWdodGdyZXk6WzIxMSwyMTEsMjExXSxsaWdodHBpbms6WzI1NSwxODIsMTkzXSxsaWdodHllbGxvdzpbMjU1LDI1NSwyMjRdLGxpbWU6WzAsMjU1LDBdLG1hZ2VudGE6WzI1NSwwLDI1NV0sbWFyb29uOlsxMjgsMCwwXSxuYXZ5OlswLDAsMTI4XSxvbGl2ZTpbMTI4LDEyOCwwXSxvcmFuZ2U6WzI1NSwxNjUsMF0scGluazpbMjU1LDE5MiwyMDNdLHB1cnBsZTpbMTI4LDAsMTI4XSx2aW9sZXQ6WzEyOCwwLDEyOF0scmVkOlsyNTUsMCwwXSxzaWx2ZXI6WzE5MiwxOTIsMTkyXSx3aGl0ZTpbMjU1LDI1NSwyNTVdLHllbGxvdzpbMjU1LDI1NSwwXX19KShqUXVlcnkpO1xuXG4vLyB0aGUgYWN0dWFsIEZsb3QgY29kZVxuKGZ1bmN0aW9uKCQpIHtcblxuXHQvLyBDYWNoZSB0aGUgcHJvdG90eXBlIGhhc093blByb3BlcnR5IGZvciBmYXN0ZXIgYWNjZXNzXG5cblx0dmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICAgIC8vIEEgc2hpbSB0byBwcm92aWRlICdkZXRhY2gnIHRvIGpRdWVyeSB2ZXJzaW9ucyBwcmlvciB0byAxLjQuICBVc2luZyBhIERPTVxuICAgIC8vIG9wZXJhdGlvbiBwcm9kdWNlcyB0aGUgc2FtZSBlZmZlY3QgYXMgZGV0YWNoLCBpLmUuIHJlbW92aW5nIHRoZSBlbGVtZW50XG4gICAgLy8gd2l0aG91dCB0b3VjaGluZyBpdHMgalF1ZXJ5IGRhdGEuXG5cbiAgICAvLyBEbyBub3QgbWVyZ2UgdGhpcyBpbnRvIEZsb3QgMC45LCBzaW5jZSBpdCByZXF1aXJlcyBqUXVlcnkgMS40LjQrLlxuXG4gICAgaWYgKCEkLmZuLmRldGFjaCkge1xuICAgICAgICAkLmZuLmRldGFjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpcyApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0Ly8gVGhlIENhbnZhcyBvYmplY3QgaXMgYSB3cmFwcGVyIGFyb3VuZCBhbiBIVE1MNSA8Y2FudmFzPiB0YWcuXG5cdC8vXG5cdC8vIEBjb25zdHJ1Y3RvclxuXHQvLyBAcGFyYW0ge3N0cmluZ30gY2xzIExpc3Qgb2YgY2xhc3NlcyB0byBhcHBseSB0byB0aGUgY2FudmFzLlxuXHQvLyBAcGFyYW0ge2VsZW1lbnR9IGNvbnRhaW5lciBFbGVtZW50IG9udG8gd2hpY2ggdG8gYXBwZW5kIHRoZSBjYW52YXMuXG5cdC8vXG5cdC8vIFJlcXVpcmluZyBhIGNvbnRhaW5lciBpcyBhIGxpdHRsZSBpZmZ5LCBidXQgdW5mb3J0dW5hdGVseSBjYW52YXNcblx0Ly8gb3BlcmF0aW9ucyBkb24ndCB3b3JrIHVubGVzcyB0aGUgY2FudmFzIGlzIGF0dGFjaGVkIHRvIHRoZSBET00uXG5cblx0ZnVuY3Rpb24gQ2FudmFzKGNscywgY29udGFpbmVyKSB7XG5cblx0XHR2YXIgZWxlbWVudCA9IGNvbnRhaW5lci5jaGlsZHJlbihcIi5cIiArIGNscylbMF07XG5cblx0XHRpZiAoZWxlbWVudCA9PSBudWxsKSB7XG5cblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXHRcdFx0ZWxlbWVudC5jbGFzc05hbWUgPSBjbHM7XG5cblx0XHRcdCQoZWxlbWVudCkuY3NzKHsgZGlyZWN0aW9uOiBcImx0clwiLCBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBsZWZ0OiAwLCB0b3A6IDAgfSlcblx0XHRcdFx0LmFwcGVuZFRvKGNvbnRhaW5lcik7XG5cblx0XHRcdC8vIElmIEhUTUw1IENhbnZhcyBpc24ndCBhdmFpbGFibGUsIGZhbGwgYmFjayB0byBbRXh8Rmxhc2hdY2FudmFzXG5cblx0XHRcdGlmICghZWxlbWVudC5nZXRDb250ZXh0KSB7XG5cdFx0XHRcdGlmICh3aW5kb3cuR192bWxDYW52YXNNYW5hZ2VyKSB7XG5cdFx0XHRcdFx0ZWxlbWVudCA9IHdpbmRvdy5HX3ZtbENhbnZhc01hbmFnZXIuaW5pdEVsZW1lbnQoZWxlbWVudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2FudmFzIGlzIG5vdCBhdmFpbGFibGUuIElmIHlvdSdyZSB1c2luZyBJRSB3aXRoIGEgZmFsbC1iYWNrIHN1Y2ggYXMgRXhjYW52YXMsIHRoZW4gdGhlcmUncyBlaXRoZXIgYSBtaXN0YWtlIGluIHlvdXIgY29uZGl0aW9uYWwgaW5jbHVkZSwgb3IgdGhlIHBhZ2UgaGFzIG5vIERPQ1RZUEUgYW5kIGlzIHJlbmRlcmluZyBpbiBRdWlya3MgTW9kZS5cIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLmNvbnRleHQgPSBlbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcblxuXHRcdC8vIERldGVybWluZSB0aGUgc2NyZWVuJ3MgcmF0aW8gb2YgcGh5c2ljYWwgdG8gZGV2aWNlLWluZGVwZW5kZW50XG5cdFx0Ly8gcGl4ZWxzLiAgVGhpcyBpcyB0aGUgcmF0aW8gYmV0d2VlbiB0aGUgY2FudmFzIHdpZHRoIHRoYXQgdGhlIGJyb3dzZXJcblx0XHQvLyBhZHZlcnRpc2VzIGFuZCB0aGUgbnVtYmVyIG9mIHBpeGVscyBhY3R1YWxseSBwcmVzZW50IGluIHRoYXQgc3BhY2UuXG5cblx0XHQvLyBUaGUgaVBob25lIDQsIGZvciBleGFtcGxlLCBoYXMgYSBkZXZpY2UtaW5kZXBlbmRlbnQgd2lkdGggb2YgMzIwcHgsXG5cdFx0Ly8gYnV0IGl0cyBzY3JlZW4gaXMgYWN0dWFsbHkgNjQwcHggd2lkZS4gIEl0IHRoZXJlZm9yZSBoYXMgYSBwaXhlbFxuXHRcdC8vIHJhdGlvIG9mIDIsIHdoaWxlIG1vc3Qgbm9ybWFsIGRldmljZXMgaGF2ZSBhIHJhdGlvIG9mIDEuXG5cblx0XHR2YXIgZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEsXG5cdFx0XHRiYWNraW5nU3RvcmVSYXRpbyA9XG5cdFx0XHRcdGNvbnRleHQud2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuXHRcdFx0XHRjb250ZXh0Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcblx0XHRcdFx0Y29udGV4dC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcblx0XHRcdFx0Y29udGV4dC5vQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuXHRcdFx0XHRjb250ZXh0LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuXHRcdHRoaXMucGl4ZWxSYXRpbyA9IGRldmljZVBpeGVsUmF0aW8gLyBiYWNraW5nU3RvcmVSYXRpbztcblxuXHRcdC8vIFNpemUgdGhlIGNhbnZhcyB0byBtYXRjaCB0aGUgaW50ZXJuYWwgZGltZW5zaW9ucyBvZiBpdHMgY29udGFpbmVyXG5cblx0XHR0aGlzLnJlc2l6ZShjb250YWluZXIud2lkdGgoKSwgY29udGFpbmVyLmhlaWdodCgpKTtcblxuXHRcdC8vIENvbGxlY3Rpb24gb2YgSFRNTCBkaXYgbGF5ZXJzIGZvciB0ZXh0IG92ZXJsYWlkIG9udG8gdGhlIGNhbnZhc1xuXG5cdFx0dGhpcy50ZXh0Q29udGFpbmVyID0gbnVsbDtcblx0XHR0aGlzLnRleHQgPSB7fTtcblxuXHRcdC8vIENhY2hlIG9mIHRleHQgZnJhZ21lbnRzIGFuZCBtZXRyaWNzLCBzbyB3ZSBjYW4gYXZvaWQgZXhwZW5zaXZlbHlcblx0XHQvLyByZS1jYWxjdWxhdGluZyB0aGVtIHdoZW4gdGhlIHBsb3QgaXMgcmUtcmVuZGVyZWQgaW4gYSBsb29wLlxuXG5cdFx0dGhpcy5fdGV4dENhY2hlID0ge307XG5cdH1cblxuXHQvLyBSZXNpemVzIHRoZSBjYW52YXMgdG8gdGhlIGdpdmVuIGRpbWVuc2lvbnMuXG5cdC8vXG5cdC8vIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCBOZXcgd2lkdGggb2YgdGhlIGNhbnZhcywgaW4gcGl4ZWxzLlxuXHQvLyBAcGFyYW0ge251bWJlcn0gd2lkdGggTmV3IGhlaWdodCBvZiB0aGUgY2FudmFzLCBpbiBwaXhlbHMuXG5cblx0Q2FudmFzLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cblx0XHRpZiAod2lkdGggPD0gMCB8fCBoZWlnaHQgPD0gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBkaW1lbnNpb25zIGZvciBwbG90LCB3aWR0aCA9IFwiICsgd2lkdGggKyBcIiwgaGVpZ2h0ID0gXCIgKyBoZWlnaHQpO1xuXHRcdH1cblxuXHRcdHZhciBlbGVtZW50ID0gdGhpcy5lbGVtZW50LFxuXHRcdFx0Y29udGV4dCA9IHRoaXMuY29udGV4dCxcblx0XHRcdHBpeGVsUmF0aW8gPSB0aGlzLnBpeGVsUmF0aW87XG5cblx0XHQvLyBSZXNpemUgdGhlIGNhbnZhcywgaW5jcmVhc2luZyBpdHMgZGVuc2l0eSBiYXNlZCBvbiB0aGUgZGlzcGxheSdzXG5cdFx0Ly8gcGl4ZWwgcmF0aW87IGJhc2ljYWxseSBnaXZpbmcgaXQgbW9yZSBwaXhlbHMgd2l0aG91dCBpbmNyZWFzaW5nIHRoZVxuXHRcdC8vIHNpemUgb2YgaXRzIGVsZW1lbnQsIHRvIHRha2UgYWR2YW50YWdlIG9mIHRoZSBmYWN0IHRoYXQgcmV0aW5hXG5cdFx0Ly8gZGlzcGxheXMgaGF2ZSB0aGF0IG1hbnkgbW9yZSBwaXhlbHMgaW4gdGhlIHNhbWUgYWR2ZXJ0aXNlZCBzcGFjZS5cblxuXHRcdC8vIFJlc2l6aW5nIHNob3VsZCByZXNldCB0aGUgc3RhdGUgKGV4Y2FudmFzIHNlZW1zIHRvIGJlIGJ1Z2d5IHRob3VnaClcblxuXHRcdGlmICh0aGlzLndpZHRoICE9IHdpZHRoKSB7XG5cdFx0XHRlbGVtZW50LndpZHRoID0gd2lkdGggKiBwaXhlbFJhdGlvO1xuXHRcdFx0ZWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoICsgXCJweFwiO1xuXHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmhlaWdodCAhPSBoZWlnaHQpIHtcblx0XHRcdGVsZW1lbnQuaGVpZ2h0ID0gaGVpZ2h0ICogcGl4ZWxSYXRpbztcblx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0fVxuXG5cdFx0Ly8gU2F2ZSB0aGUgY29udGV4dCwgc28gd2UgY2FuIHJlc2V0IGluIGNhc2Ugd2UgZ2V0IHJlcGxvdHRlZC4gIFRoZVxuXHRcdC8vIHJlc3RvcmUgZW5zdXJlIHRoYXQgd2UncmUgcmVhbGx5IGJhY2sgYXQgdGhlIGluaXRpYWwgc3RhdGUsIGFuZFxuXHRcdC8vIHNob3VsZCBiZSBzYWZlIGV2ZW4gaWYgd2UgaGF2ZW4ndCBzYXZlZCB0aGUgaW5pdGlhbCBzdGF0ZSB5ZXQuXG5cblx0XHRjb250ZXh0LnJlc3RvcmUoKTtcblx0XHRjb250ZXh0LnNhdmUoKTtcblxuXHRcdC8vIFNjYWxlIHRoZSBjb29yZGluYXRlIHNwYWNlIHRvIG1hdGNoIHRoZSBkaXNwbGF5IGRlbnNpdHk7IHNvIGV2ZW4gdGhvdWdoIHdlXG5cdFx0Ly8gbWF5IGhhdmUgdHdpY2UgYXMgbWFueSBwaXhlbHMsIHdlIHN0aWxsIHdhbnQgbGluZXMgYW5kIG90aGVyIGRyYXdpbmcgdG9cblx0XHQvLyBhcHBlYXIgYXQgdGhlIHNhbWUgc2l6ZTsgdGhlIGV4dHJhIHBpeGVscyB3aWxsIGp1c3QgbWFrZSB0aGVtIGNyaXNwZXIuXG5cblx0XHRjb250ZXh0LnNjYWxlKHBpeGVsUmF0aW8sIHBpeGVsUmF0aW8pO1xuXHR9O1xuXG5cdC8vIENsZWFycyB0aGUgZW50aXJlIGNhbnZhcyBhcmVhLCBub3QgaW5jbHVkaW5nIGFueSBvdmVybGFpZCBIVE1MIHRleHRcblxuXHRDYW52YXMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cdH07XG5cblx0Ly8gRmluaXNoZXMgcmVuZGVyaW5nIHRoZSBjYW52YXMsIGluY2x1ZGluZyBtYW5hZ2luZyB0aGUgdGV4dCBvdmVybGF5LlxuXG5cdENhbnZhcy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgY2FjaGUgPSB0aGlzLl90ZXh0Q2FjaGU7XG5cblx0XHQvLyBGb3IgZWFjaCB0ZXh0IGxheWVyLCBhZGQgZWxlbWVudHMgbWFya2VkIGFzIGFjdGl2ZSB0aGF0IGhhdmVuJ3Rcblx0XHQvLyBhbHJlYWR5IGJlZW4gcmVuZGVyZWQsIGFuZCByZW1vdmUgdGhvc2UgdGhhdCBhcmUgbm8gbG9uZ2VyIGFjdGl2ZS5cblxuXHRcdGZvciAodmFyIGxheWVyS2V5IGluIGNhY2hlKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSwgbGF5ZXJLZXkpKSB7XG5cblx0XHRcdFx0dmFyIGxheWVyID0gdGhpcy5nZXRUZXh0TGF5ZXIobGF5ZXJLZXkpLFxuXHRcdFx0XHRcdGxheWVyQ2FjaGUgPSBjYWNoZVtsYXllcktleV07XG5cblx0XHRcdFx0bGF5ZXIuaGlkZSgpO1xuXG5cdFx0XHRcdGZvciAodmFyIHN0eWxlS2V5IGluIGxheWVyQ2FjaGUpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChsYXllckNhY2hlLCBzdHlsZUtleSkpIHtcblx0XHRcdFx0XHRcdHZhciBzdHlsZUNhY2hlID0gbGF5ZXJDYWNoZVtzdHlsZUtleV07XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gc3R5bGVDYWNoZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzdHlsZUNhY2hlLCBrZXkpKSB7XG5cblx0XHRcdFx0XHRcdFx0XHR2YXIgcG9zaXRpb25zID0gc3R5bGVDYWNoZVtrZXldLnBvc2l0aW9ucztcblxuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBwb3NpdGlvbjsgcG9zaXRpb24gPSBwb3NpdGlvbnNbaV07IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHBvc2l0aW9uLmFjdGl2ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIXBvc2l0aW9uLnJlbmRlcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGF5ZXIuYXBwZW5kKHBvc2l0aW9uLmVsZW1lbnQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uLnJlbmRlcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb25zLnNwbGljZShpLS0sIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocG9zaXRpb24ucmVuZGVyZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbi5lbGVtZW50LmRldGFjaCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHBvc2l0aW9ucy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHN0eWxlQ2FjaGVba2V5XTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsYXllci5zaG93KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENyZWF0ZXMgKGlmIG5lY2Vzc2FyeSkgYW5kIHJldHVybnMgdGhlIHRleHQgb3ZlcmxheSBjb250YWluZXIuXG5cdC8vXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSBjbGFzc2VzIFN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzZXMgdXNlZCB0b1xuXHQvLyAgICAgdW5pcXVlbHkgaWRlbnRpZnkgdGhlIHRleHQgbGF5ZXIuXG5cdC8vIEByZXR1cm4ge29iamVjdH0gVGhlIGpRdWVyeS13cmFwcGVkIHRleHQtbGF5ZXIgZGl2LlxuXG5cdENhbnZhcy5wcm90b3R5cGUuZ2V0VGV4dExheWVyID0gZnVuY3Rpb24oY2xhc3Nlcykge1xuXG5cdFx0dmFyIGxheWVyID0gdGhpcy50ZXh0W2NsYXNzZXNdO1xuXG5cdFx0Ly8gQ3JlYXRlIHRoZSB0ZXh0IGxheWVyIGlmIGl0IGRvZXNuJ3QgZXhpc3RcblxuXHRcdGlmIChsYXllciA9PSBudWxsKSB7XG5cblx0XHRcdC8vIENyZWF0ZSB0aGUgdGV4dCBsYXllciBjb250YWluZXIsIGlmIGl0IGRvZXNuJ3QgZXhpc3RcblxuXHRcdFx0aWYgKHRoaXMudGV4dENvbnRhaW5lciA9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMudGV4dENvbnRhaW5lciA9ICQoXCI8ZGl2IGNsYXNzPSdmbG90LXRleHQnPjwvZGl2PlwiKVxuXHRcdFx0XHRcdC5jc3Moe1xuXHRcdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHRcdHRvcDogMCxcblx0XHRcdFx0XHRcdGxlZnQ6IDAsXG5cdFx0XHRcdFx0XHRib3R0b206IDAsXG5cdFx0XHRcdFx0XHRyaWdodDogMCxcblx0XHRcdFx0XHRcdCdmb250LXNpemUnOiBcInNtYWxsZXJcIixcblx0XHRcdFx0XHRcdGNvbG9yOiBcIiM1NDU0NTRcIlxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lmluc2VydEFmdGVyKHRoaXMuZWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGxheWVyID0gdGhpcy50ZXh0W2NsYXNzZXNdID0gJChcIjxkaXY+PC9kaXY+XCIpXG5cdFx0XHRcdC5hZGRDbGFzcyhjbGFzc2VzKVxuXHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcdHRvcDogMCxcblx0XHRcdFx0XHRsZWZ0OiAwLFxuXHRcdFx0XHRcdGJvdHRvbTogMCxcblx0XHRcdFx0XHRyaWdodDogMFxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuYXBwZW5kVG8odGhpcy50ZXh0Q29udGFpbmVyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbGF5ZXI7XG5cdH07XG5cblx0Ly8gQ3JlYXRlcyAoaWYgbmVjZXNzYXJ5KSBhbmQgcmV0dXJucyBhIHRleHQgaW5mbyBvYmplY3QuXG5cdC8vXG5cdC8vIFRoZSBvYmplY3QgbG9va3MgbGlrZSB0aGlzOlxuXHQvL1xuXHQvLyB7XG5cdC8vICAgICB3aWR0aDogV2lkdGggb2YgdGhlIHRleHQncyB3cmFwcGVyIGRpdi5cblx0Ly8gICAgIGhlaWdodDogSGVpZ2h0IG9mIHRoZSB0ZXh0J3Mgd3JhcHBlciBkaXYuXG5cdC8vICAgICBlbGVtZW50OiBUaGUgalF1ZXJ5LXdyYXBwZWQgSFRNTCBkaXYgY29udGFpbmluZyB0aGUgdGV4dC5cblx0Ly8gICAgIHBvc2l0aW9uczogQXJyYXkgb2YgcG9zaXRpb25zIGF0IHdoaWNoIHRoaXMgdGV4dCBpcyBkcmF3bi5cblx0Ly8gfVxuXHQvL1xuXHQvLyBUaGUgcG9zaXRpb25zIGFycmF5IGNvbnRhaW5zIG9iamVjdHMgdGhhdCBsb29rIGxpa2UgdGhpczpcblx0Ly9cblx0Ly8ge1xuXHQvLyAgICAgYWN0aXZlOiBGbGFnIGluZGljYXRpbmcgd2hldGhlciB0aGUgdGV4dCBzaG91bGQgYmUgdmlzaWJsZS5cblx0Ly8gICAgIHJlbmRlcmVkOiBGbGFnIGluZGljYXRpbmcgd2hldGhlciB0aGUgdGV4dCBpcyBjdXJyZW50bHkgdmlzaWJsZS5cblx0Ly8gICAgIGVsZW1lbnQ6IFRoZSBqUXVlcnktd3JhcHBlZCBIVE1MIGRpdiBjb250YWluaW5nIHRoZSB0ZXh0LlxuXHQvLyAgICAgeDogWCBjb29yZGluYXRlIGF0IHdoaWNoIHRvIGRyYXcgdGhlIHRleHQuXG5cdC8vICAgICB5OiBZIGNvb3JkaW5hdGUgYXQgd2hpY2ggdG8gZHJhdyB0aGUgdGV4dC5cblx0Ly8gfVxuXHQvL1xuXHQvLyBFYWNoIHBvc2l0aW9uIGFmdGVyIHRoZSBmaXJzdCByZWNlaXZlcyBhIGNsb25lIG9mIHRoZSBvcmlnaW5hbCBlbGVtZW50LlxuXHQvL1xuXHQvLyBUaGUgaWRlYSBpcyB0aGF0IHRoYXQgdGhlIHdpZHRoLCBoZWlnaHQsIGFuZCBnZW5lcmFsICdpZGVudGl0eScgb2YgdGhlXG5cdC8vIHRleHQgaXMgY29uc3RhbnQgbm8gbWF0dGVyIHdoZXJlIGl0IGlzIHBsYWNlZDsgdGhlIHBsYWNlbWVudHMgYXJlIGFcblx0Ly8gc2Vjb25kYXJ5IHByb3BlcnR5LlxuXHQvL1xuXHQvLyBDYW52YXMgbWFpbnRhaW5zIGEgY2FjaGUgb2YgcmVjZW50bHktdXNlZCB0ZXh0IGluZm8gb2JqZWN0czsgZ2V0VGV4dEluZm9cblx0Ly8gZWl0aGVyIHJldHVybnMgdGhlIGNhY2hlZCBlbGVtZW50IG9yIGNyZWF0ZXMgYSBuZXcgZW50cnkuXG5cdC8vXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSBsYXllciBBIHN0cmluZyBvZiBzcGFjZS1zZXBhcmF0ZWQgQ1NTIGNsYXNzZXMgdW5pcXVlbHlcblx0Ly8gICAgIGlkZW50aWZ5aW5nIHRoZSBsYXllciBjb250YWluaW5nIHRoaXMgdGV4dC5cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCBzdHJpbmcgdG8gcmV0cmlldmUgaW5mbyBmb3IuXG5cdC8vIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpPX0gZm9udCBFaXRoZXIgYSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTU1xuXHQvLyAgICAgY2xhc3NlcyBvciBhIGZvbnQtc3BlYyBvYmplY3QsIGRlZmluaW5nIHRoZSB0ZXh0J3MgZm9udCBhbmQgc3R5bGUuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0gYW5nbGUgQW5nbGUgYXQgd2hpY2ggdG8gcm90YXRlIHRoZSB0ZXh0LCBpbiBkZWdyZWVzLlxuXHQvLyAgICAgQW5nbGUgaXMgY3VycmVudGx5IHVudXNlZCwgaXQgd2lsbCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgZnV0dXJlLlxuXHQvLyBAcGFyYW0ge251bWJlcj19IHdpZHRoIE1heGltdW0gd2lkdGggb2YgdGhlIHRleHQgYmVmb3JlIGl0IHdyYXBzLlxuXHQvLyBAcmV0dXJuIHtvYmplY3R9IGEgdGV4dCBpbmZvIG9iamVjdC5cblxuXHRDYW52YXMucHJvdG90eXBlLmdldFRleHRJbmZvID0gZnVuY3Rpb24obGF5ZXIsIHRleHQsIGZvbnQsIGFuZ2xlLCB3aWR0aCkge1xuXG5cdFx0dmFyIHRleHRTdHlsZSwgbGF5ZXJDYWNoZSwgc3R5bGVDYWNoZSwgaW5mbztcblxuXHRcdC8vIENhc3QgdGhlIHZhbHVlIHRvIGEgc3RyaW5nLCBpbiBjYXNlIHdlIHdlcmUgZ2l2ZW4gYSBudW1iZXIgb3Igc3VjaFxuXG5cdFx0dGV4dCA9IFwiXCIgKyB0ZXh0O1xuXG5cdFx0Ly8gSWYgdGhlIGZvbnQgaXMgYSBmb250LXNwZWMgb2JqZWN0LCBnZW5lcmF0ZSBhIENTUyBmb250IGRlZmluaXRpb25cblxuXHRcdGlmICh0eXBlb2YgZm9udCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0dGV4dFN0eWxlID0gZm9udC5zdHlsZSArIFwiIFwiICsgZm9udC52YXJpYW50ICsgXCIgXCIgKyBmb250LndlaWdodCArIFwiIFwiICsgZm9udC5zaXplICsgXCJweC9cIiArIGZvbnQubGluZUhlaWdodCArIFwicHggXCIgKyBmb250LmZhbWlseTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGV4dFN0eWxlID0gZm9udDtcblx0XHR9XG5cblx0XHQvLyBSZXRyaWV2ZSAob3IgY3JlYXRlKSB0aGUgY2FjaGUgZm9yIHRoZSB0ZXh0J3MgbGF5ZXIgYW5kIHN0eWxlc1xuXG5cdFx0bGF5ZXJDYWNoZSA9IHRoaXMuX3RleHRDYWNoZVtsYXllcl07XG5cblx0XHRpZiAobGF5ZXJDYWNoZSA9PSBudWxsKSB7XG5cdFx0XHRsYXllckNhY2hlID0gdGhpcy5fdGV4dENhY2hlW2xheWVyXSA9IHt9O1xuXHRcdH1cblxuXHRcdHN0eWxlQ2FjaGUgPSBsYXllckNhY2hlW3RleHRTdHlsZV07XG5cblx0XHRpZiAoc3R5bGVDYWNoZSA9PSBudWxsKSB7XG5cdFx0XHRzdHlsZUNhY2hlID0gbGF5ZXJDYWNoZVt0ZXh0U3R5bGVdID0ge307XG5cdFx0fVxuXG5cdFx0aW5mbyA9IHN0eWxlQ2FjaGVbdGV4dF07XG5cblx0XHQvLyBJZiB3ZSBjYW4ndCBmaW5kIGEgbWF0Y2hpbmcgZWxlbWVudCBpbiBvdXIgY2FjaGUsIGNyZWF0ZSBhIG5ldyBvbmVcblxuXHRcdGlmIChpbmZvID09IG51bGwpIHtcblxuXHRcdFx0dmFyIGVsZW1lbnQgPSAkKFwiPGRpdj48L2Rpdj5cIikuaHRtbCh0ZXh0KVxuXHRcdFx0XHQuY3NzKHtcblx0XHRcdFx0XHRwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuXHRcdFx0XHRcdCdtYXgtd2lkdGgnOiB3aWR0aCxcblx0XHRcdFx0XHR0b3A6IC05OTk5XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5hcHBlbmRUbyh0aGlzLmdldFRleHRMYXllcihsYXllcikpO1xuXG5cdFx0XHRpZiAodHlwZW9mIGZvbnQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0ZWxlbWVudC5jc3Moe1xuXHRcdFx0XHRcdGZvbnQ6IHRleHRTdHlsZSxcblx0XHRcdFx0XHRjb2xvcjogZm9udC5jb2xvclxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGZvbnQgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0ZWxlbWVudC5hZGRDbGFzcyhmb250KTtcblx0XHRcdH1cblxuXHRcdFx0aW5mbyA9IHN0eWxlQ2FjaGVbdGV4dF0gPSB7XG5cdFx0XHRcdHdpZHRoOiBlbGVtZW50Lm91dGVyV2lkdGgodHJ1ZSksXG5cdFx0XHRcdGhlaWdodDogZWxlbWVudC5vdXRlckhlaWdodCh0cnVlKSxcblx0XHRcdFx0ZWxlbWVudDogZWxlbWVudCxcblx0XHRcdFx0cG9zaXRpb25zOiBbXVxuXHRcdFx0fTtcblxuXHRcdFx0ZWxlbWVudC5kZXRhY2goKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5mbztcblx0fTtcblxuXHQvLyBBZGRzIGEgdGV4dCBzdHJpbmcgdG8gdGhlIGNhbnZhcyB0ZXh0IG92ZXJsYXkuXG5cdC8vXG5cdC8vIFRoZSB0ZXh0IGlzbid0IGRyYXduIGltbWVkaWF0ZWx5OyBpdCBpcyBtYXJrZWQgYXMgcmVuZGVyaW5nLCB3aGljaCB3aWxsXG5cdC8vIHJlc3VsdCBpbiBpdHMgYWRkaXRpb24gdG8gdGhlIGNhbnZhcyBvbiB0aGUgbmV4dCByZW5kZXIgcGFzcy5cblx0Ly9cblx0Ly8gQHBhcmFtIHtzdHJpbmd9IGxheWVyIEEgc3RyaW5nIG9mIHNwYWNlLXNlcGFyYXRlZCBDU1MgY2xhc3NlcyB1bmlxdWVseVxuXHQvLyAgICAgaWRlbnRpZnlpbmcgdGhlIGxheWVyIGNvbnRhaW5pbmcgdGhpcyB0ZXh0LlxuXHQvLyBAcGFyYW0ge251bWJlcn0geCBYIGNvb3JkaW5hdGUgYXQgd2hpY2ggdG8gZHJhdyB0aGUgdGV4dC5cblx0Ly8gQHBhcmFtIHtudW1iZXJ9IHkgWSBjb29yZGluYXRlIGF0IHdoaWNoIHRvIGRyYXcgdGhlIHRleHQuXG5cdC8vIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgc3RyaW5nIHRvIGRyYXcuXG5cdC8vIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpPX0gZm9udCBFaXRoZXIgYSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTU1xuXHQvLyAgICAgY2xhc3NlcyBvciBhIGZvbnQtc3BlYyBvYmplY3QsIGRlZmluaW5nIHRoZSB0ZXh0J3MgZm9udCBhbmQgc3R5bGUuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0gYW5nbGUgQW5nbGUgYXQgd2hpY2ggdG8gcm90YXRlIHRoZSB0ZXh0LCBpbiBkZWdyZWVzLlxuXHQvLyAgICAgQW5nbGUgaXMgY3VycmVudGx5IHVudXNlZCwgaXQgd2lsbCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgZnV0dXJlLlxuXHQvLyBAcGFyYW0ge251bWJlcj19IHdpZHRoIE1heGltdW0gd2lkdGggb2YgdGhlIHRleHQgYmVmb3JlIGl0IHdyYXBzLlxuXHQvLyBAcGFyYW0ge3N0cmluZz19IGhhbGlnbiBIb3Jpem9udGFsIGFsaWdubWVudCBvZiB0aGUgdGV4dDsgZWl0aGVyIFwibGVmdFwiLFxuXHQvLyAgICAgXCJjZW50ZXJcIiBvciBcInJpZ2h0XCIuXG5cdC8vIEBwYXJhbSB7c3RyaW5nPX0gdmFsaWduIFZlcnRpY2FsIGFsaWdubWVudCBvZiB0aGUgdGV4dDsgZWl0aGVyIFwidG9wXCIsXG5cdC8vICAgICBcIm1pZGRsZVwiIG9yIFwiYm90dG9tXCIuXG5cblx0Q2FudmFzLnByb3RvdHlwZS5hZGRUZXh0ID0gZnVuY3Rpb24obGF5ZXIsIHgsIHksIHRleHQsIGZvbnQsIGFuZ2xlLCB3aWR0aCwgaGFsaWduLCB2YWxpZ24pIHtcblxuXHRcdHZhciBpbmZvID0gdGhpcy5nZXRUZXh0SW5mbyhsYXllciwgdGV4dCwgZm9udCwgYW5nbGUsIHdpZHRoKSxcblx0XHRcdHBvc2l0aW9ucyA9IGluZm8ucG9zaXRpb25zO1xuXG5cdFx0Ly8gVHdlYWsgdGhlIGRpdidzIHBvc2l0aW9uIHRvIG1hdGNoIHRoZSB0ZXh0J3MgYWxpZ25tZW50XG5cblx0XHRpZiAoaGFsaWduID09IFwiY2VudGVyXCIpIHtcblx0XHRcdHggLT0gaW5mby53aWR0aCAvIDI7XG5cdFx0fSBlbHNlIGlmIChoYWxpZ24gPT0gXCJyaWdodFwiKSB7XG5cdFx0XHR4IC09IGluZm8ud2lkdGg7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbGlnbiA9PSBcIm1pZGRsZVwiKSB7XG5cdFx0XHR5IC09IGluZm8uaGVpZ2h0IC8gMjtcblx0XHR9IGVsc2UgaWYgKHZhbGlnbiA9PSBcImJvdHRvbVwiKSB7XG5cdFx0XHR5IC09IGluZm8uaGVpZ2h0O1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSB3aGV0aGVyIHRoaXMgdGV4dCBhbHJlYWR5IGV4aXN0cyBhdCB0aGlzIHBvc2l0aW9uLlxuXHRcdC8vIElmIHNvLCBtYXJrIGl0IGZvciBpbmNsdXNpb24gaW4gdGhlIG5leHQgcmVuZGVyIHBhc3MuXG5cblx0XHRmb3IgKHZhciBpID0gMCwgcG9zaXRpb247IHBvc2l0aW9uID0gcG9zaXRpb25zW2ldOyBpKyspIHtcblx0XHRcdGlmIChwb3NpdGlvbi54ID09IHggJiYgcG9zaXRpb24ueSA9PSB5KSB7XG5cdFx0XHRcdHBvc2l0aW9uLmFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiB0aGUgdGV4dCBkb2Vzbid0IGV4aXN0IGF0IHRoaXMgcG9zaXRpb24sIGNyZWF0ZSBhIG5ldyBlbnRyeVxuXG5cdFx0Ly8gRm9yIHRoZSB2ZXJ5IGZpcnN0IHBvc2l0aW9uIHdlJ2xsIHJlLXVzZSB0aGUgb3JpZ2luYWwgZWxlbWVudCxcblx0XHQvLyB3aGlsZSBmb3Igc3Vic2VxdWVudCBvbmVzIHdlJ2xsIGNsb25lIGl0LlxuXG5cdFx0cG9zaXRpb24gPSB7XG5cdFx0XHRhY3RpdmU6IHRydWUsXG5cdFx0XHRyZW5kZXJlZDogZmFsc2UsXG5cdFx0XHRlbGVtZW50OiBwb3NpdGlvbnMubGVuZ3RoID8gaW5mby5lbGVtZW50LmNsb25lKCkgOiBpbmZvLmVsZW1lbnQsXG5cdFx0XHR4OiB4LFxuXHRcdFx0eTogeVxuXHRcdH07XG5cblx0XHRwb3NpdGlvbnMucHVzaChwb3NpdGlvbik7XG5cblx0XHQvLyBNb3ZlIHRoZSBlbGVtZW50IHRvIGl0cyBmaW5hbCBwb3NpdGlvbiB3aXRoaW4gdGhlIGNvbnRhaW5lclxuXG5cdFx0cG9zaXRpb24uZWxlbWVudC5jc3Moe1xuXHRcdFx0dG9wOiBNYXRoLnJvdW5kKHkpLFxuXHRcdFx0bGVmdDogTWF0aC5yb3VuZCh4KSxcblx0XHRcdCd0ZXh0LWFsaWduJzogaGFsaWduXHQvLyBJbiBjYXNlIHRoZSB0ZXh0IHdyYXBzXG5cdFx0fSk7XG5cdH07XG5cblx0Ly8gUmVtb3ZlcyBvbmUgb3IgbW9yZSB0ZXh0IHN0cmluZ3MgZnJvbSB0aGUgY2FudmFzIHRleHQgb3ZlcmxheS5cblx0Ly9cblx0Ly8gSWYgbm8gcGFyYW1ldGVycyBhcmUgZ2l2ZW4sIGFsbCB0ZXh0IHdpdGhpbiB0aGUgbGF5ZXIgaXMgcmVtb3ZlZC5cblx0Ly9cblx0Ly8gTm90ZSB0aGF0IHRoZSB0ZXh0IGlzIG5vdCBpbW1lZGlhdGVseSByZW1vdmVkOyBpdCBpcyBzaW1wbHkgbWFya2VkIGFzXG5cdC8vIGluYWN0aXZlLCB3aGljaCB3aWxsIHJlc3VsdCBpbiBpdHMgcmVtb3ZhbCBvbiB0aGUgbmV4dCByZW5kZXIgcGFzcy5cblx0Ly8gVGhpcyBhdm9pZHMgdGhlIHBlcmZvcm1hbmNlIHBlbmFsdHkgZm9yICdjbGVhciBhbmQgcmVkcmF3JyBiZWhhdmlvcixcblx0Ly8gd2hlcmUgd2UgcG90ZW50aWFsbHkgZ2V0IHJpZCBvZiBhbGwgdGV4dCBvbiBhIGxheWVyLCBidXQgd2lsbCBsaWtlbHlcblx0Ly8gYWRkIGJhY2sgbW9zdCBvciBhbGwgb2YgaXQgbGF0ZXIsIGFzIHdoZW4gcmVkcmF3aW5nIGF4ZXMsIGZvciBleGFtcGxlLlxuXHQvL1xuXHQvLyBAcGFyYW0ge3N0cmluZ30gbGF5ZXIgQSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTUyBjbGFzc2VzIHVuaXF1ZWx5XG5cdC8vICAgICBpZGVudGlmeWluZyB0aGUgbGF5ZXIgY29udGFpbmluZyB0aGlzIHRleHQuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0geCBYIGNvb3JkaW5hdGUgb2YgdGhlIHRleHQuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0geSBZIGNvb3JkaW5hdGUgb2YgdGhlIHRleHQuXG5cdC8vIEBwYXJhbSB7c3RyaW5nPX0gdGV4dCBUZXh0IHN0cmluZyB0byByZW1vdmUuXG5cdC8vIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpPX0gZm9udCBFaXRoZXIgYSBzdHJpbmcgb2Ygc3BhY2Utc2VwYXJhdGVkIENTU1xuXHQvLyAgICAgY2xhc3NlcyBvciBhIGZvbnQtc3BlYyBvYmplY3QsIGRlZmluaW5nIHRoZSB0ZXh0J3MgZm9udCBhbmQgc3R5bGUuXG5cdC8vIEBwYXJhbSB7bnVtYmVyPX0gYW5nbGUgQW5nbGUgYXQgd2hpY2ggdGhlIHRleHQgaXMgcm90YXRlZCwgaW4gZGVncmVlcy5cblx0Ly8gICAgIEFuZ2xlIGlzIGN1cnJlbnRseSB1bnVzZWQsIGl0IHdpbGwgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIGZ1dHVyZS5cblxuXHRDYW52YXMucHJvdG90eXBlLnJlbW92ZVRleHQgPSBmdW5jdGlvbihsYXllciwgeCwgeSwgdGV4dCwgZm9udCwgYW5nbGUpIHtcblx0XHRpZiAodGV4dCA9PSBudWxsKSB7XG5cdFx0XHR2YXIgbGF5ZXJDYWNoZSA9IHRoaXMuX3RleHRDYWNoZVtsYXllcl07XG5cdFx0XHRpZiAobGF5ZXJDYWNoZSAhPSBudWxsKSB7XG5cdFx0XHRcdGZvciAodmFyIHN0eWxlS2V5IGluIGxheWVyQ2FjaGUpIHtcblx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChsYXllckNhY2hlLCBzdHlsZUtleSkpIHtcblx0XHRcdFx0XHRcdHZhciBzdHlsZUNhY2hlID0gbGF5ZXJDYWNoZVtzdHlsZUtleV07XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gc3R5bGVDYWNoZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzdHlsZUNhY2hlLCBrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIHBvc2l0aW9ucyA9IHN0eWxlQ2FjaGVba2V5XS5wb3NpdGlvbnM7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIHBvc2l0aW9uOyBwb3NpdGlvbiA9IHBvc2l0aW9uc1tpXTsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbi5hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBvc2l0aW9ucyA9IHRoaXMuZ2V0VGV4dEluZm8obGF5ZXIsIHRleHQsIGZvbnQsIGFuZ2xlKS5wb3NpdGlvbnM7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgcG9zaXRpb247IHBvc2l0aW9uID0gcG9zaXRpb25zW2ldOyBpKyspIHtcblx0XHRcdFx0aWYgKHBvc2l0aW9uLnggPT0geCAmJiBwb3NpdGlvbi55ID09IHkpIHtcblx0XHRcdFx0XHRwb3NpdGlvbi5hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0Ly8gVGhlIHRvcC1sZXZlbCBjb250YWluZXIgZm9yIHRoZSBlbnRpcmUgcGxvdC5cblxuICAgIGZ1bmN0aW9uIFBsb3QocGxhY2Vob2xkZXIsIGRhdGFfLCBvcHRpb25zXywgcGx1Z2lucykge1xuICAgICAgICAvLyBkYXRhIGlzIG9uIHRoZSBmb3JtOlxuICAgICAgICAvLyAgIFsgc2VyaWVzMSwgc2VyaWVzMiAuLi4gXVxuICAgICAgICAvLyB3aGVyZSBzZXJpZXMgaXMgZWl0aGVyIGp1c3QgdGhlIGRhdGEgYXMgWyBbeDEsIHkxXSwgW3gyLCB5Ml0sIC4uLiBdXG4gICAgICAgIC8vIG9yIHsgZGF0YTogWyBbeDEsIHkxXSwgW3gyLCB5Ml0sIC4uLiBdLCBsYWJlbDogXCJzb21lIGxhYmVsXCIsIC4uLiB9XG5cbiAgICAgICAgdmFyIHNlcmllcyA9IFtdLFxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAvLyB0aGUgY29sb3IgdGhlbWUgdXNlZCBmb3IgZ3JhcGhzXG4gICAgICAgICAgICAgICAgY29sb3JzOiBbXCIjZWRjMjQwXCIsIFwiI2FmZDhmOFwiLCBcIiNjYjRiNGJcIiwgXCIjNGRhNzRkXCIsIFwiIzk0NDBlZFwiXSxcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbm9Db2x1bW5zOiAxLCAvLyBudW1iZXIgb2YgY29sdW1zIGluIGxlZ2VuZCB0YWJsZVxuICAgICAgICAgICAgICAgICAgICBsYWJlbEZvcm1hdHRlcjogbnVsbCwgLy8gZm46IHN0cmluZyAtPiBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxCb3hCb3JkZXJDb2xvcjogXCIjY2NjXCIsIC8vIGJvcmRlciBjb2xvciBmb3IgdGhlIGxpdHRsZSBsYWJlbCBib3hlc1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IG51bGwsIC8vIGNvbnRhaW5lciAoYXMgalF1ZXJ5IG9iamVjdCkgdG8gcHV0IGxlZ2VuZCBpbiwgbnVsbCBtZWFucyBkZWZhdWx0IG9uIHRvcCBvZiBncmFwaFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJuZVwiLCAvLyBwb3NpdGlvbiBvZiBkZWZhdWx0IGxlZ2VuZCBjb250YWluZXIgd2l0aGluIHBsb3RcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiA1LCAvLyBkaXN0YW5jZSBmcm9tIGdyaWQgZWRnZSB0byBkZWZhdWx0IGxlZ2VuZCBjb250YWluZXIgd2l0aGluIHBsb3RcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBudWxsLCAvLyBudWxsIG1lYW5zIGF1dG8tZGV0ZWN0XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRPcGFjaXR5OiAwLjg1LCAvLyBzZXQgdG8gMCB0byBhdm9pZCBiYWNrZ3JvdW5kXG4gICAgICAgICAgICAgICAgICAgIHNvcnRlZDogbnVsbCAgICAvLyBkZWZhdWx0IHRvIG5vIGxlZ2VuZCBzb3J0aW5nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB4YXhpczoge1xuICAgICAgICAgICAgICAgICAgICBzaG93OiBudWxsLCAvLyBudWxsID0gYXV0by1kZXRlY3QsIHRydWUgPSBhbHdheXMsIGZhbHNlID0gbmV2ZXJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYm90dG9tXCIsIC8vIG9yIFwidG9wXCJcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogbnVsbCwgLy8gbnVsbCBvciBcInRpbWVcIlxuICAgICAgICAgICAgICAgICAgICBmb250OiBudWxsLCAvLyBudWxsIChkZXJpdmVkIGZyb20gQ1NTIGluIHBsYWNlaG9sZGVyKSBvciBvYmplY3QgbGlrZSB7IHNpemU6IDExLCBsaW5lSGVpZ2h0OiAxMywgc3R5bGU6IFwiaXRhbGljXCIsIHdlaWdodDogXCJib2xkXCIsIGZhbWlseTogXCJzYW5zLXNlcmlmXCIsIHZhcmlhbnQ6IFwic21hbGwtY2Fwc1wiIH1cbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IG51bGwsIC8vIGJhc2UgY29sb3IsIGxhYmVscywgdGlja3NcbiAgICAgICAgICAgICAgICAgICAgdGlja0NvbG9yOiBudWxsLCAvLyBwb3NzaWJseSBkaWZmZXJlbnQgY29sb3Igb2YgdGlja3MsIGUuZy4gXCJyZ2JhKDAsMCwwLDAuMTUpXCJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBudWxsLCAvLyBudWxsIG9yIGY6IG51bWJlciAtPiBudW1iZXIgdG8gdHJhbnNmb3JtIGF4aXNcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZVRyYW5zZm9ybTogbnVsbCwgLy8gaWYgdHJhbnNmb3JtIGlzIHNldCwgdGhpcyBzaG91bGQgYmUgdGhlIGludmVyc2UgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgbWluOiBudWxsLCAvLyBtaW4uIHZhbHVlIHRvIHNob3csIG51bGwgbWVhbnMgc2V0IGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgbWF4OiBudWxsLCAvLyBtYXguIHZhbHVlIHRvIHNob3csIG51bGwgbWVhbnMgc2V0IGF1dG9tYXRpY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgYXV0b3NjYWxlTWFyZ2luOiBudWxsLCAvLyBtYXJnaW4gaW4gJSB0byBhZGQgaWYgYXV0by1zZXR0aW5nIG1pbi9tYXhcbiAgICAgICAgICAgICAgICAgICAgdGlja3M6IG51bGwsIC8vIGVpdGhlciBbMSwgM10gb3IgW1sxLCBcImFcIl0sIDNdIG9yIChmbjogYXhpcyBpbmZvIC0+IHRpY2tzKSBvciBhcHAuIG51bWJlciBvZiB0aWNrcyBmb3IgYXV0by10aWNrc1xuICAgICAgICAgICAgICAgICAgICB0aWNrRm9ybWF0dGVyOiBudWxsLCAvLyBmbjogbnVtYmVyIC0+IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICBsYWJlbFdpZHRoOiBudWxsLCAvLyBzaXplIG9mIHRpY2sgbGFiZWxzIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICBsYWJlbEhlaWdodDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgcmVzZXJ2ZVNwYWNlOiBudWxsLCAvLyB3aGV0aGVyIHRvIHJlc2VydmUgc3BhY2UgZXZlbiBpZiBheGlzIGlzbid0IHNob3duXG4gICAgICAgICAgICAgICAgICAgIHRpY2tMZW5ndGg6IG51bGwsIC8vIHNpemUgaW4gcGl4ZWxzIG9mIHRpY2tzLCBvciBcImZ1bGxcIiBmb3Igd2hvbGUgbGluZVxuICAgICAgICAgICAgICAgICAgICBhbGlnblRpY2tzV2l0aEF4aXM6IG51bGwsIC8vIGF4aXMgbnVtYmVyIG9yIG51bGwgZm9yIG5vIHN5bmNcbiAgICAgICAgICAgICAgICAgICAgdGlja0RlY2ltYWxzOiBudWxsLCAvLyBuby4gb2YgZGVjaW1hbHMsIG51bGwgbWVhbnMgYXV0b1xuICAgICAgICAgICAgICAgICAgICB0aWNrU2l6ZTogbnVsbCwgLy8gbnVtYmVyIG9yIFtudW1iZXIsIFwidW5pdFwiXVxuICAgICAgICAgICAgICAgICAgICBtaW5UaWNrU2l6ZTogbnVsbCAvLyBudW1iZXIgb3IgW251bWJlciwgXCJ1bml0XCJdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5YXhpczoge1xuICAgICAgICAgICAgICAgICAgICBhdXRvc2NhbGVNYXJnaW46IDAuMDIsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImxlZnRcIiAvLyBvciBcInJpZ2h0XCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHhheGVzOiBbXSxcbiAgICAgICAgICAgICAgICB5YXhlczogW10sXG4gICAgICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDIsIC8vIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogXCIjZmZmZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzeW1ib2w6IFwiY2lyY2xlXCIgLy8gb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbGluZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvbid0IHB1dCBpbiBzaG93OiBmYWxzZSBzbyB3ZSBjYW4gc2VlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGV0aGVyIGxpbmVzIHdlcmUgYWN0aXZlbHkgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMiwgLy8gaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXBzOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT21pdCAnemVybycsIHNvIHdlIGNhbiBsYXRlciBkZWZhdWx0IGl0cyB2YWx1ZSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2ggdGhhdCBvZiB0aGUgJ2ZpbGwnIG9wdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYmFyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDIsIC8vIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFyV2lkdGg6IDEsIC8vIGluIHVuaXRzIG9mIHRoZSB4IGF4aXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlnbjogXCJsZWZ0XCIsIC8vIFwibGVmdFwiLCBcInJpZ2h0XCIsIG9yIFwiY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgemVybzogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzaGFkb3dTaXplOiAzLFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRDb2xvcjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhYm92ZURhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjNTQ1NDU0XCIsIC8vIHByaW1hcnkgY29sb3IgdXNlZCBmb3Igb3V0bGluZSBhbmQgbGFiZWxzXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbnVsbCwgLy8gbnVsbCBmb3IgdHJhbnNwYXJlbnQsIGVsc2UgY29sb3JcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IG51bGwsIC8vIHNldCBpZiBkaWZmZXJlbnQgZnJvbSB0aGUgZ3JpZCBjb2xvclxuICAgICAgICAgICAgICAgICAgICB0aWNrQ29sb3I6IG51bGwsIC8vIGNvbG9yIGZvciB0aGUgdGlja3MsIGUuZy4gXCJyZ2JhKDAsMCwwLDAuMTUpXCJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwLCAvLyBkaXN0YW5jZSBmcm9tIHRoZSBjYW52YXMgZWRnZSB0byB0aGUgZ3JpZFxuICAgICAgICAgICAgICAgICAgICBsYWJlbE1hcmdpbjogNSwgLy8gaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgIGF4aXNNYXJnaW46IDgsIC8vIGluIHBpeGVsc1xuICAgICAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMiwgLy8gaW4gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgIG1pbkJvcmRlck1hcmdpbjogbnVsbCwgLy8gaW4gcGl4ZWxzLCBudWxsIG1lYW5zIHRha2VuIGZyb20gcG9pbnRzIHJhZGl1c1xuICAgICAgICAgICAgICAgICAgICBtYXJraW5nczogbnVsbCwgLy8gYXJyYXkgb2YgcmFuZ2VzIG9yIGZuOiBheGVzIC0+IGFycmF5IG9mIHJhbmdlc1xuICAgICAgICAgICAgICAgICAgICBtYXJraW5nc0NvbG9yOiBcIiNmNGY0ZjRcIixcbiAgICAgICAgICAgICAgICAgICAgbWFya2luZ3NMaW5lV2lkdGg6IDIsXG4gICAgICAgICAgICAgICAgICAgIC8vIGludGVyYWN0aXZlIHN0dWZmXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhvdmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGF1dG9IaWdobGlnaHQ6IHRydWUsIC8vIGhpZ2hsaWdodCBpbiBjYXNlIG1vdXNlIGlzIG5lYXJcbiAgICAgICAgICAgICAgICAgICAgbW91c2VBY3RpdmVSYWRpdXM6IDEwIC8vIGhvdyBmYXIgdGhlIG1vdXNlIGNhbiBiZSBhd2F5IHRvIGFjdGl2YXRlIGFuIGl0ZW1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIHJlZHJhd092ZXJsYXlJbnRlcnZhbDogMTAwMC82MCAvLyB0aW1lIGJldHdlZW4gdXBkYXRlcywgLTEgbWVhbnMgaW4gc2FtZSBmbG93XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBob29rczoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgIHN1cmZhY2UgPSBudWxsLCAgICAgLy8gdGhlIGNhbnZhcyBmb3IgdGhlIHBsb3QgaXRzZWxmXG4gICAgICAgIG92ZXJsYXkgPSBudWxsLCAgICAgLy8gY2FudmFzIGZvciBpbnRlcmFjdGl2ZSBzdHVmZiBvbiB0b3Agb2YgcGxvdFxuICAgICAgICBldmVudEhvbGRlciA9IG51bGwsIC8vIGpRdWVyeSBvYmplY3QgdGhhdCBldmVudHMgc2hvdWxkIGJlIGJvdW5kIHRvXG4gICAgICAgIGN0eCA9IG51bGwsIG9jdHggPSBudWxsLFxuICAgICAgICB4YXhlcyA9IFtdLCB5YXhlcyA9IFtdLFxuICAgICAgICBwbG90T2Zmc2V0ID0geyBsZWZ0OiAwLCByaWdodDogMCwgdG9wOiAwLCBib3R0b206IDB9LFxuICAgICAgICBwbG90V2lkdGggPSAwLCBwbG90SGVpZ2h0ID0gMCxcbiAgICAgICAgaG9va3MgPSB7XG4gICAgICAgICAgICBwcm9jZXNzT3B0aW9uczogW10sXG4gICAgICAgICAgICBwcm9jZXNzUmF3RGF0YTogW10sXG4gICAgICAgICAgICBwcm9jZXNzRGF0YXBvaW50czogW10sXG4gICAgICAgICAgICBwcm9jZXNzT2Zmc2V0OiBbXSxcbiAgICAgICAgICAgIGRyYXdCYWNrZ3JvdW5kOiBbXSxcbiAgICAgICAgICAgIGRyYXdTZXJpZXM6IFtdLFxuICAgICAgICAgICAgZHJhdzogW10sXG4gICAgICAgICAgICBiaW5kRXZlbnRzOiBbXSxcbiAgICAgICAgICAgIGRyYXdPdmVybGF5OiBbXSxcbiAgICAgICAgICAgIHNodXRkb3duOiBbXVxuICAgICAgICB9LFxuICAgICAgICBwbG90ID0gdGhpcztcblxuICAgICAgICAvLyBwdWJsaWMgZnVuY3Rpb25zXG4gICAgICAgIHBsb3Quc2V0RGF0YSA9IHNldERhdGE7XG4gICAgICAgIHBsb3Quc2V0dXBHcmlkID0gc2V0dXBHcmlkO1xuICAgICAgICBwbG90LmRyYXcgPSBkcmF3O1xuICAgICAgICBwbG90LmdldFBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7IHJldHVybiBwbGFjZWhvbGRlcjsgfTtcbiAgICAgICAgcGxvdC5nZXRDYW52YXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHN1cmZhY2UuZWxlbWVudDsgfTtcbiAgICAgICAgcGxvdC5nZXRQbG90T2Zmc2V0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBwbG90T2Zmc2V0OyB9O1xuICAgICAgICBwbG90LndpZHRoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcGxvdFdpZHRoOyB9O1xuICAgICAgICBwbG90LmhlaWdodCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBsb3RIZWlnaHQ7IH07XG4gICAgICAgIHBsb3Qub2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG8gPSBldmVudEhvbGRlci5vZmZzZXQoKTtcbiAgICAgICAgICAgIG8ubGVmdCArPSBwbG90T2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICBvLnRvcCArPSBwbG90T2Zmc2V0LnRvcDtcbiAgICAgICAgICAgIHJldHVybiBvO1xuICAgICAgICB9O1xuICAgICAgICBwbG90LmdldERhdGEgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzZXJpZXM7IH07XG4gICAgICAgIHBsb3QuZ2V0QXhlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXMgPSB7fSwgaTtcbiAgICAgICAgICAgICQuZWFjaCh4YXhlcy5jb25jYXQoeWF4ZXMpLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIGlmIChheGlzKVxuICAgICAgICAgICAgICAgICAgICByZXNbYXhpcy5kaXJlY3Rpb24gKyAoYXhpcy5uICE9IDEgPyBheGlzLm4gOiBcIlwiKSArIFwiYXhpc1wiXSA9IGF4aXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH07XG4gICAgICAgIHBsb3QuZ2V0WEF4ZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB4YXhlczsgfTtcbiAgICAgICAgcGxvdC5nZXRZQXhlcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHlheGVzOyB9O1xuICAgICAgICBwbG90LmMycCA9IGNhbnZhc1RvQXhpc0Nvb3JkcztcbiAgICAgICAgcGxvdC5wMmMgPSBheGlzVG9DYW52YXNDb29yZHM7XG4gICAgICAgIHBsb3QuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9wdGlvbnM7IH07XG4gICAgICAgIHBsb3QuaGlnaGxpZ2h0ID0gaGlnaGxpZ2h0O1xuICAgICAgICBwbG90LnVuaGlnaGxpZ2h0ID0gdW5oaWdobGlnaHQ7XG4gICAgICAgIHBsb3QudHJpZ2dlclJlZHJhd092ZXJsYXkgPSB0cmlnZ2VyUmVkcmF3T3ZlcmxheTtcbiAgICAgICAgcGxvdC5wb2ludE9mZnNldCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IHBhcnNlSW50KHhheGVzW2F4aXNOdW1iZXIocG9pbnQsIFwieFwiKSAtIDFdLnAyYygrcG9pbnQueCkgKyBwbG90T2Zmc2V0LmxlZnQsIDEwKSxcbiAgICAgICAgICAgICAgICB0b3A6IHBhcnNlSW50KHlheGVzW2F4aXNOdW1iZXIocG9pbnQsIFwieVwiKSAtIDFdLnAyYygrcG9pbnQueSkgKyBwbG90T2Zmc2V0LnRvcCwgMTApXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBwbG90LnNodXRkb3duID0gc2h1dGRvd247XG4gICAgICAgIHBsb3QuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNodXRkb3duKCk7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5yZW1vdmVEYXRhKFwicGxvdFwiKS5lbXB0eSgpO1xuXG4gICAgICAgICAgICBzZXJpZXMgPSBbXTtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBudWxsO1xuICAgICAgICAgICAgc3VyZmFjZSA9IG51bGw7XG4gICAgICAgICAgICBvdmVybGF5ID0gbnVsbDtcbiAgICAgICAgICAgIGV2ZW50SG9sZGVyID0gbnVsbDtcbiAgICAgICAgICAgIGN0eCA9IG51bGw7XG4gICAgICAgICAgICBvY3R4ID0gbnVsbDtcbiAgICAgICAgICAgIHhheGVzID0gW107XG4gICAgICAgICAgICB5YXhlcyA9IFtdO1xuICAgICAgICAgICAgaG9va3MgPSBudWxsO1xuICAgICAgICAgICAgaGlnaGxpZ2h0cyA9IFtdO1xuICAgICAgICAgICAgcGxvdCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHBsb3QucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcdHZhciB3aWR0aCA9IHBsYWNlaG9sZGVyLndpZHRoKCksXG4gICAgICAgIFx0XHRoZWlnaHQgPSBwbGFjZWhvbGRlci5oZWlnaHQoKTtcbiAgICAgICAgICAgIHN1cmZhY2UucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgb3ZlcmxheS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gcHVibGljIGF0dHJpYnV0ZXNcbiAgICAgICAgcGxvdC5ob29rcyA9IGhvb2tzO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemVcbiAgICAgICAgaW5pdFBsdWdpbnMocGxvdCk7XG4gICAgICAgIHBhcnNlT3B0aW9ucyhvcHRpb25zXyk7XG4gICAgICAgIHNldHVwQ2FudmFzZXMoKTtcbiAgICAgICAgc2V0RGF0YShkYXRhXyk7XG4gICAgICAgIHNldHVwR3JpZCgpO1xuICAgICAgICBkcmF3KCk7XG4gICAgICAgIGJpbmRFdmVudHMoKTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIGV4ZWN1dGVIb29rcyhob29rLCBhcmdzKSB7XG4gICAgICAgICAgICBhcmdzID0gW3Bsb3RdLmNvbmNhdChhcmdzKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaG9vay5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBob29rW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdFBsdWdpbnMoKSB7XG5cbiAgICAgICAgICAgIC8vIFJlZmVyZW5jZXMgdG8ga2V5IGNsYXNzZXMsIGFsbG93aW5nIHBsdWdpbnMgdG8gbW9kaWZ5IHRoZW1cblxuICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSB7XG4gICAgICAgICAgICAgICAgQ2FudmFzOiBDYW52YXNcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2lucy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBwID0gcGx1Z2luc1tpXTtcbiAgICAgICAgICAgICAgICBwLmluaXQocGxvdCwgY2xhc3Nlcyk7XG4gICAgICAgICAgICAgICAgaWYgKHAub3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0aW9ucywgcC5vcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhvcHRzKSB7XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG9wdGlvbnMsIG9wdHMpO1xuXG4gICAgICAgICAgICAvLyAkLmV4dGVuZCBtZXJnZXMgYXJyYXlzLCByYXRoZXIgdGhhbiByZXBsYWNpbmcgdGhlbS4gIFdoZW4gbGVzc1xuICAgICAgICAgICAgLy8gY29sb3JzIGFyZSBwcm92aWRlZCB0aGFuIHRoZSBzaXplIG9mIHRoZSBkZWZhdWx0IHBhbGV0dGUsIHdlXG4gICAgICAgICAgICAvLyBlbmQgdXAgd2l0aCB0aG9zZSBjb2xvcnMgcGx1cyB0aGUgcmVtYWluaW5nIGRlZmF1bHRzLCB3aGljaCBpc1xuICAgICAgICAgICAgLy8gbm90IGV4cGVjdGVkIGJlaGF2aW9yOyBhdm9pZCBpdCBieSByZXBsYWNpbmcgdGhlbSBoZXJlLlxuXG4gICAgICAgICAgICBpZiAob3B0cyAmJiBvcHRzLmNvbG9ycykge1xuICAgICAgICAgICAgXHRvcHRpb25zLmNvbG9ycyA9IG9wdHMuY29sb3JzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy54YXhpcy5jb2xvciA9PSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4aXMuY29sb3IgPSAkLmNvbG9yLnBhcnNlKG9wdGlvbnMuZ3JpZC5jb2xvcikuc2NhbGUoJ2EnLCAwLjIyKS50b1N0cmluZygpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMueWF4aXMuY29sb3IgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLnlheGlzLmNvbG9yID0gJC5jb2xvci5wYXJzZShvcHRpb25zLmdyaWQuY29sb3IpLnNjYWxlKCdhJywgMC4yMikudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMueGF4aXMudGlja0NvbG9yID09IG51bGwpIC8vIGdyaWQudGlja0NvbG9yIGZvciBiYWNrLWNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICBvcHRpb25zLnhheGlzLnRpY2tDb2xvciA9IG9wdGlvbnMuZ3JpZC50aWNrQ29sb3IgfHwgb3B0aW9ucy54YXhpcy5jb2xvcjtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnlheGlzLnRpY2tDb2xvciA9PSBudWxsKSAvLyBncmlkLnRpY2tDb2xvciBmb3IgYmFjay1jb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgb3B0aW9ucy55YXhpcy50aWNrQ29sb3IgPSBvcHRpb25zLmdyaWQudGlja0NvbG9yIHx8IG9wdGlvbnMueWF4aXMuY29sb3I7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuYm9yZGVyQ29sb3IgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBvcHRpb25zLmdyaWQuYm9yZGVyQ29sb3IgPSBvcHRpb25zLmdyaWQuY29sb3I7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLnRpY2tDb2xvciA9PSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZ3JpZC50aWNrQ29sb3IgPSAkLmNvbG9yLnBhcnNlKG9wdGlvbnMuZ3JpZC5jb2xvcikuc2NhbGUoJ2EnLCAwLjIyKS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAvLyBGaWxsIGluIGRlZmF1bHRzIGZvciBheGlzIG9wdGlvbnMsIGluY2x1ZGluZyBhbnkgdW5zcGVjaWZpZWRcbiAgICAgICAgICAgIC8vIGZvbnQtc3BlYyBmaWVsZHMsIGlmIGEgZm9udC1zcGVjIHdhcyBwcm92aWRlZC5cblxuICAgICAgICAgICAgLy8gSWYgbm8geC95IGF4aXMgb3B0aW9ucyB3ZXJlIHByb3ZpZGVkLCBjcmVhdGUgb25lIG9mIGVhY2ggYW55d2F5LFxuICAgICAgICAgICAgLy8gc2luY2UgdGhlIHJlc3Qgb2YgdGhlIGNvZGUgYXNzdW1lcyB0aGF0IHRoZXkgZXhpc3QuXG5cbiAgICAgICAgICAgIHZhciBpLCBheGlzT3B0aW9ucywgYXhpc0NvdW50LFxuICAgICAgICAgICAgICAgIGZvbnRTaXplID0gcGxhY2Vob2xkZXIuY3NzKFwiZm9udC1zaXplXCIpLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplRGVmYXVsdCA9IGZvbnRTaXplID8gK2ZvbnRTaXplLnJlcGxhY2UoXCJweFwiLCBcIlwiKSA6IDEzLFxuICAgICAgICAgICAgICAgIGZvbnREZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU6IHBsYWNlaG9sZGVyLmNzcyhcImZvbnQtc3R5bGVcIiksXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IE1hdGgucm91bmQoMC44ICogZm9udFNpemVEZWZhdWx0KSxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudDogcGxhY2Vob2xkZXIuY3NzKFwiZm9udC12YXJpYW50XCIpLFxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IHBsYWNlaG9sZGVyLmNzcyhcImZvbnQtd2VpZ2h0XCIpLFxuICAgICAgICAgICAgICAgICAgICBmYW1pbHk6IHBsYWNlaG9sZGVyLmNzcyhcImZvbnQtZmFtaWx5XCIpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgYXhpc0NvdW50ID0gb3B0aW9ucy54YXhlcy5sZW5ndGggfHwgMTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBheGlzQ291bnQ7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgYXhpc09wdGlvbnMgPSBvcHRpb25zLnhheGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChheGlzT3B0aW9ucyAmJiAhYXhpc09wdGlvbnMudGlja0NvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLnRpY2tDb2xvciA9IGF4aXNPcHRpb25zLmNvbG9yO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMueGF4aXMsIGF4aXNPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnhheGVzW2ldID0gYXhpc09wdGlvbnM7XG5cbiAgICAgICAgICAgICAgICBpZiAoYXhpc09wdGlvbnMuZm9udCkge1xuICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy5mb250ID0gJC5leHRlbmQoe30sIGZvbnREZWZhdWx0cywgYXhpc09wdGlvbnMuZm9udCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXhpc09wdGlvbnMuZm9udC5jb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMuZm9udC5jb2xvciA9IGF4aXNPcHRpb25zLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXhpc09wdGlvbnMuZm9udC5saW5lSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy5mb250LmxpbmVIZWlnaHQgPSBNYXRoLnJvdW5kKGF4aXNPcHRpb25zLmZvbnQuc2l6ZSAqIDEuMTUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBheGlzQ291bnQgPSBvcHRpb25zLnlheGVzLmxlbmd0aCB8fCAxO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGF4aXNDb3VudDsgKytpKSB7XG5cbiAgICAgICAgICAgICAgICBheGlzT3B0aW9ucyA9IG9wdGlvbnMueWF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXNPcHRpb25zICYmICFheGlzT3B0aW9ucy50aWNrQ29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgYXhpc09wdGlvbnMudGlja0NvbG9yID0gYXhpc09wdGlvbnMuY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYXhpc09wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucy55YXhpcywgYXhpc09wdGlvbnMpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4ZXNbaV0gPSBheGlzT3B0aW9ucztcblxuICAgICAgICAgICAgICAgIGlmIChheGlzT3B0aW9ucy5mb250KSB7XG4gICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLmZvbnQgPSAkLmV4dGVuZCh7fSwgZm9udERlZmF1bHRzLCBheGlzT3B0aW9ucy5mb250KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFheGlzT3B0aW9ucy5mb250LmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzT3B0aW9ucy5mb250LmNvbG9yID0gYXhpc09wdGlvbnMuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFheGlzT3B0aW9ucy5mb250LmxpbmVIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNPcHRpb25zLmZvbnQubGluZUhlaWdodCA9IE1hdGgucm91bmQoYXhpc09wdGlvbnMuZm9udC5zaXplICogMS4xNSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCB0byBiZSByZW1vdmVkIGluIGZ1dHVyZVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMueGF4aXMubm9UaWNrcyAmJiBvcHRpb25zLnhheGlzLnRpY2tzID09IG51bGwpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy54YXhpcy50aWNrcyA9IG9wdGlvbnMueGF4aXMubm9UaWNrcztcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnlheGlzLm5vVGlja3MgJiYgb3B0aW9ucy55YXhpcy50aWNrcyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMueWF4aXMudGlja3MgPSBvcHRpb25zLnlheGlzLm5vVGlja3M7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy54MmF4aXMpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnhheGVzWzFdID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMueGF4aXMsIG9wdGlvbnMueDJheGlzKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnhheGVzWzFdLnBvc2l0aW9uID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICAvLyBPdmVycmlkZSB0aGUgaW5oZXJpdCB0byBhbGxvdyB0aGUgYXhpcyB0byBhdXRvLXNjYWxlXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMueDJheGlzLm1pbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4ZXNbMV0ubWluID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMueDJheGlzLm1heCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMueGF4ZXNbMV0ubWF4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy55MmF4aXMpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnlheGVzWzFdID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMueWF4aXMsIG9wdGlvbnMueTJheGlzKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnlheGVzWzFdLnBvc2l0aW9uID0gXCJyaWdodFwiO1xuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIHRoZSBpbmhlcml0IHRvIGFsbG93IHRoZSBheGlzIHRvIGF1dG8tc2NhbGVcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy55MmF4aXMubWluID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy55YXhlc1sxXS5taW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy55MmF4aXMubWF4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy55YXhlc1sxXS5tYXggPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuY29sb3JlZEFyZWFzKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZ3JpZC5tYXJraW5ncyA9IG9wdGlvbnMuZ3JpZC5jb2xvcmVkQXJlYXM7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmNvbG9yZWRBcmVhc0NvbG9yKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZ3JpZC5tYXJraW5nc0NvbG9yID0gb3B0aW9ucy5ncmlkLmNvbG9yZWRBcmVhc0NvbG9yO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGluZXMpXG4gICAgICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgb3B0aW9ucy5zZXJpZXMubGluZXMsIG9wdGlvbnMubGluZXMpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMucG9pbnRzKVxuICAgICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIG9wdGlvbnMuc2VyaWVzLnBvaW50cywgb3B0aW9ucy5wb2ludHMpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuYmFycylcbiAgICAgICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBvcHRpb25zLnNlcmllcy5iYXJzLCBvcHRpb25zLmJhcnMpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hhZG93U2l6ZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzLnNoYWRvd1NpemUgPSBvcHRpb25zLnNoYWRvd1NpemU7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5oaWdobGlnaHRDb2xvciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzLmhpZ2hsaWdodENvbG9yID0gb3B0aW9ucy5oaWdobGlnaHRDb2xvcjtcblxuICAgICAgICAgICAgLy8gc2F2ZSBvcHRpb25zIG9uIGF4ZXMgZm9yIGZ1dHVyZSByZWZlcmVuY2VcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHRpb25zLnhheGVzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIGdldE9yQ3JlYXRlQXhpcyh4YXhlcywgaSArIDEpLm9wdGlvbnMgPSBvcHRpb25zLnhheGVzW2ldO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdGlvbnMueWF4ZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgZ2V0T3JDcmVhdGVBeGlzKHlheGVzLCBpICsgMSkub3B0aW9ucyA9IG9wdGlvbnMueWF4ZXNbaV07XG5cbiAgICAgICAgICAgIC8vIGFkZCBob29rcyBmcm9tIG9wdGlvbnNcbiAgICAgICAgICAgIGZvciAodmFyIG4gaW4gaG9va3MpXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaG9va3Nbbl0gJiYgb3B0aW9ucy5ob29rc1tuXS5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIGhvb2tzW25dID0gaG9va3Nbbl0uY29uY2F0KG9wdGlvbnMuaG9va3Nbbl0pO1xuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MucHJvY2Vzc09wdGlvbnMsIFtvcHRpb25zXSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXREYXRhKGQpIHtcbiAgICAgICAgICAgIHNlcmllcyA9IHBhcnNlRGF0YShkKTtcbiAgICAgICAgICAgIGZpbGxJblNlcmllc09wdGlvbnMoKTtcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwYXJzZURhdGEoZCkge1xuICAgICAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucy5zZXJpZXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRbaV0uZGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuZGF0YSA9IGRbaV0uZGF0YTsgLy8gbW92ZSB0aGUgZGF0YSBpbnN0ZWFkIG9mIGRlZXAtY29weVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZFtpXS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHMsIGRbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGRbaV0uZGF0YSA9IHMuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzLmRhdGEgPSBkW2ldO1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXhpc051bWJlcihvYmosIGNvb3JkKSB7XG4gICAgICAgICAgICB2YXIgYSA9IG9ialtjb29yZCArIFwiYXhpc1wiXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYSA9PSBcIm9iamVjdFwiKSAvLyBpZiB3ZSBnb3QgYSByZWFsIGF4aXMsIGV4dHJhY3QgbnVtYmVyXG4gICAgICAgICAgICAgICAgYSA9IGEubjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYSAhPSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIGEgPSAxOyAvLyBkZWZhdWx0IHRvIGZpcnN0IGF4aXNcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWxsQXhlcygpIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBmbGF0IGFycmF5IHdpdGhvdXQgYW5ub3lpbmcgbnVsbCBlbnRyaWVzXG4gICAgICAgICAgICByZXR1cm4gJC5ncmVwKHhheGVzLmNvbmNhdCh5YXhlcyksIGZ1bmN0aW9uIChhKSB7IHJldHVybiBhOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbnZhc1RvQXhpc0Nvb3Jkcyhwb3MpIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBhbiBvYmplY3Qgd2l0aCB4L3kgY29ycmVzcG9uZGluZyB0byBhbGwgdXNlZCBheGVzXG4gICAgICAgICAgICB2YXIgcmVzID0ge30sIGksIGF4aXM7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgeGF4ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBheGlzID0geGF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgJiYgYXhpcy51c2VkKVxuICAgICAgICAgICAgICAgICAgICByZXNbXCJ4XCIgKyBheGlzLm5dID0gYXhpcy5jMnAocG9zLmxlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgeWF4ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBheGlzID0geWF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgJiYgYXhpcy51c2VkKVxuICAgICAgICAgICAgICAgICAgICByZXNbXCJ5XCIgKyBheGlzLm5dID0gYXhpcy5jMnAocG9zLnRvcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXMueDEgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXMueCA9IHJlcy54MTtcbiAgICAgICAgICAgIGlmIChyZXMueTEgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXMueSA9IHJlcy55MTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGF4aXNUb0NhbnZhc0Nvb3Jkcyhwb3MpIHtcbiAgICAgICAgICAgIC8vIGdldCBjYW52YXMgY29vcmRzIGZyb20gdGhlIGZpcnN0IHBhaXIgb2YgeC95IGZvdW5kIGluIHBvc1xuICAgICAgICAgICAgdmFyIHJlcyA9IHt9LCBpLCBheGlzLCBrZXk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB4YXhlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGF4aXMgPSB4YXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcyAmJiBheGlzLnVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gXCJ4XCIgKyBheGlzLm47XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3Nba2V5XSA9PSBudWxsICYmIGF4aXMubiA9PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gXCJ4XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc1trZXldICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5sZWZ0ID0gYXhpcy5wMmMocG9zW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB5YXhlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGF4aXMgPSB5YXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcyAmJiBheGlzLnVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gXCJ5XCIgKyBheGlzLm47XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3Nba2V5XSA9PSBudWxsICYmIGF4aXMubiA9PSAxKVxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gXCJ5XCI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc1trZXldICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy50b3AgPSBheGlzLnAyYyhwb3Nba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldE9yQ3JlYXRlQXhpcyhheGVzLCBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmICghYXhlc1tudW1iZXIgLSAxXSlcbiAgICAgICAgICAgICAgICBheGVzW251bWJlciAtIDFdID0ge1xuICAgICAgICAgICAgICAgICAgICBuOiBudW1iZXIsIC8vIHNhdmUgdGhlIG51bWJlciBmb3IgZnV0dXJlIHJlZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IGF4ZXMgPT0geGF4ZXMgPyBcInhcIiA6IFwieVwiLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiAkLmV4dGVuZCh0cnVlLCB7fSwgYXhlcyA9PSB4YXhlcyA/IG9wdGlvbnMueGF4aXMgOiBvcHRpb25zLnlheGlzKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBheGVzW251bWJlciAtIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmlsbEluU2VyaWVzT3B0aW9ucygpIHtcblxuICAgICAgICAgICAgdmFyIG5lZWRlZENvbG9ycyA9IHNlcmllcy5sZW5ndGgsIG1heEluZGV4ID0gLTEsIGk7XG5cbiAgICAgICAgICAgIC8vIFN1YnRyYWN0IHRoZSBudW1iZXIgb2Ygc2VyaWVzIHRoYXQgYWxyZWFkeSBoYXZlIGZpeGVkIGNvbG9ycyBvclxuICAgICAgICAgICAgLy8gY29sb3IgaW5kZXhlcyBmcm9tIHRoZSBudW1iZXIgdGhhdCB3ZSBzdGlsbCBuZWVkIHRvIGdlbmVyYXRlLlxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjID0gc2VyaWVzW2ldLmNvbG9yO1xuICAgICAgICAgICAgICAgIGlmIChzYyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5lZWRlZENvbG9ycy0tO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNjID09IFwibnVtYmVyXCIgJiYgc2MgPiBtYXhJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBzYztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgYW55IG9mIHRoZSBzZXJpZXMgaGF2ZSBmaXhlZCBjb2xvciBpbmRleGVzLCB0aGVuIHdlIG5lZWQgdG9cbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIGF0IGxlYXN0IGFzIG1hbnkgY29sb3JzIGFzIHRoZSBoaWdoZXN0IGluZGV4LlxuXG4gICAgICAgICAgICBpZiAobmVlZGVkQ29sb3JzIDw9IG1heEluZGV4KSB7XG4gICAgICAgICAgICAgICAgbmVlZGVkQ29sb3JzID0gbWF4SW5kZXggKyAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhbGwgdGhlIGNvbG9ycywgdXNpbmcgZmlyc3QgdGhlIG9wdGlvbiBjb2xvcnMgYW5kIHRoZW5cbiAgICAgICAgICAgIC8vIHZhcmlhdGlvbnMgb24gdGhvc2UgY29sb3JzIG9uY2UgdGhleSdyZSBleGhhdXN0ZWQuXG5cbiAgICAgICAgICAgIHZhciBjLCBjb2xvcnMgPSBbXSwgY29sb3JQb29sID0gb3B0aW9ucy5jb2xvcnMsXG4gICAgICAgICAgICAgICAgY29sb3JQb29sU2l6ZSA9IGNvbG9yUG9vbC5sZW5ndGgsIHZhcmlhdGlvbiA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBuZWVkZWRDb2xvcnM7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgYyA9ICQuY29sb3IucGFyc2UoY29sb3JQb29sW2kgJSBjb2xvclBvb2xTaXplXSB8fCBcIiM2NjZcIik7XG5cbiAgICAgICAgICAgICAgICAvLyBFYWNoIHRpbWUgd2UgZXhoYXVzdCB0aGUgY29sb3JzIGluIHRoZSBwb29sIHdlIGFkanVzdFxuICAgICAgICAgICAgICAgIC8vIGEgc2NhbGluZyBmYWN0b3IgdXNlZCB0byBwcm9kdWNlIG1vcmUgdmFyaWF0aW9ucyBvblxuICAgICAgICAgICAgICAgIC8vIHRob3NlIGNvbG9ycy4gVGhlIGZhY3RvciBhbHRlcm5hdGVzIG5lZ2F0aXZlL3Bvc2l0aXZlXG4gICAgICAgICAgICAgICAgLy8gdG8gcHJvZHVjZSBsaWdodGVyL2RhcmtlciBjb2xvcnMuXG5cbiAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgdmFyaWF0aW9uIGFmdGVyIGV2ZXJ5IGZldyBjeWNsZXMsIG9yIGVsc2VcbiAgICAgICAgICAgICAgICAvLyBpdCB3aWxsIGVuZCB1cCBwcm9kdWNpbmcgb25seSB3aGl0ZSBvciBibGFjayBjb2xvcnMuXG5cbiAgICAgICAgICAgICAgICBpZiAoaSAlIGNvbG9yUG9vbFNpemUgPT0gMCAmJiBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYXRpb24gPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhdGlvbiA8IDAuNSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhdGlvbiA9IC12YXJpYXRpb24gLSAwLjI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgdmFyaWF0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHZhcmlhdGlvbiA9IC12YXJpYXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29sb3JzW2ldID0gYy5zY2FsZSgncmdiJywgMSArIHZhcmlhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZpbmFsaXplIHRoZSBzZXJpZXMgb3B0aW9ucywgZmlsbGluZyBpbiB0aGVpciBjb2xvcnNcblxuICAgICAgICAgICAgdmFyIGNvbG9yaSA9IDAsIHM7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tpXTtcblxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBjb2xvcnNcbiAgICAgICAgICAgICAgICBpZiAocy5jb2xvciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuY29sb3IgPSBjb2xvcnNbY29sb3JpXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICArK2NvbG9yaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHMuY29sb3IgPT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICAgICAgcy5jb2xvciA9IGNvbG9yc1tzLmNvbG9yXS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgLy8gdHVybiBvbiBsaW5lcyBhdXRvbWF0aWNhbGx5IGluIGNhc2Ugbm90aGluZyBpcyBzZXRcbiAgICAgICAgICAgICAgICBpZiAocy5saW5lcy5zaG93ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYsIHNob3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHYgaW4gcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzW3ZdICYmIHNbdl0uc2hvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICBzLmxpbmVzLnNob3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElmIG5vdGhpbmcgd2FzIHByb3ZpZGVkIGZvciBsaW5lcy56ZXJvLCBkZWZhdWx0IGl0IHRvIG1hdGNoXG4gICAgICAgICAgICAgICAgLy8gbGluZXMuZmlsbCwgc2luY2UgYXJlYXMgYnkgZGVmYXVsdCBzaG91bGQgZXh0ZW5kIHRvIHplcm8uXG5cbiAgICAgICAgICAgICAgICBpZiAocy5saW5lcy56ZXJvID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcy5saW5lcy56ZXJvID0gISFzLmxpbmVzLmZpbGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc2V0dXAgYXhlc1xuICAgICAgICAgICAgICAgIHMueGF4aXMgPSBnZXRPckNyZWF0ZUF4aXMoeGF4ZXMsIGF4aXNOdW1iZXIocywgXCJ4XCIpKTtcbiAgICAgICAgICAgICAgICBzLnlheGlzID0gZ2V0T3JDcmVhdGVBeGlzKHlheGVzLCBheGlzTnVtYmVyKHMsIFwieVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzRGF0YSgpIHtcbiAgICAgICAgICAgIHZhciB0b3BTZW50cnkgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgICAgYm90dG9tU2VudHJ5ID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICAgIGZha2VJbmZpbml0eSA9IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgICAgICAgaSwgaiwgaywgbSwgbGVuZ3RoLFxuICAgICAgICAgICAgICAgIHMsIHBvaW50cywgcHMsIHgsIHksIGF4aXMsIHZhbCwgZiwgcCxcbiAgICAgICAgICAgICAgICBkYXRhLCBmb3JtYXQ7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUF4aXMoYXhpcywgbWluLCBtYXgpIHtcbiAgICAgICAgICAgICAgICBpZiAobWluIDwgYXhpcy5kYXRhbWluICYmIG1pbiAhPSAtZmFrZUluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICBheGlzLmRhdGFtaW4gPSBtaW47XG4gICAgICAgICAgICAgICAgaWYgKG1heCA+IGF4aXMuZGF0YW1heCAmJiBtYXggIT0gZmFrZUluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICBheGlzLmRhdGFtYXggPSBtYXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZWFjaChhbGxBeGVzKCksIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5pdCBheGlzXG4gICAgICAgICAgICAgICAgYXhpcy5kYXRhbWluID0gdG9wU2VudHJ5O1xuICAgICAgICAgICAgICAgIGF4aXMuZGF0YW1heCA9IGJvdHRvbVNlbnRyeTtcbiAgICAgICAgICAgICAgICBheGlzLnVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tpXTtcbiAgICAgICAgICAgICAgICBzLmRhdGFwb2ludHMgPSB7IHBvaW50czogW10gfTtcblxuICAgICAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5wcm9jZXNzUmF3RGF0YSwgWyBzLCBzLmRhdGEsIHMuZGF0YXBvaW50cyBdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlyc3QgcGFzczogY2xlYW4gYW5kIGNvcHkgZGF0YVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbaV07XG5cbiAgICAgICAgICAgICAgICBkYXRhID0gcy5kYXRhO1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHMuZGF0YXBvaW50cy5mb3JtYXQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZvcm1hdCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmluZCBvdXQgaG93IHRvIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0LnB1c2goeyB4OiB0cnVlLCBudW1iZXI6IHRydWUsIHJlcXVpcmVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQucHVzaCh7IHk6IHRydWUsIG51bWJlcjogdHJ1ZSwgcmVxdWlyZWQ6IHRydWUgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHMuYmFycy5zaG93IHx8IChzLmxpbmVzLnNob3cgJiYgcy5saW5lcy5maWxsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1dG9zY2FsZSA9ICEhKChzLmJhcnMuc2hvdyAmJiBzLmJhcnMuemVybykgfHwgKHMubGluZXMuc2hvdyAmJiBzLmxpbmVzLnplcm8pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdC5wdXNoKHsgeTogdHJ1ZSwgbnVtYmVyOiB0cnVlLCByZXF1aXJlZDogZmFsc2UsIGRlZmF1bHRWYWx1ZTogMCwgYXV0b3NjYWxlOiBhdXRvc2NhbGUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocy5iYXJzLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZm9ybWF0W2Zvcm1hdC5sZW5ndGggLSAxXS55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdFtmb3JtYXQubGVuZ3RoIC0gMV0ueCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzLmRhdGFwb2ludHMuZm9ybWF0ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzLmRhdGFwb2ludHMucG9pbnRzaXplICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBhbHJlYWR5IGZpbGxlZCBpblxuXG4gICAgICAgICAgICAgICAgcy5kYXRhcG9pbnRzLnBvaW50c2l6ZSA9IGZvcm1hdC5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBwcyA9IHMuZGF0YXBvaW50cy5wb2ludHNpemU7XG4gICAgICAgICAgICAgICAgcG9pbnRzID0gcy5kYXRhcG9pbnRzLnBvaW50cztcblxuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRTdGVwcyA9IHMubGluZXMuc2hvdyAmJiBzLmxpbmVzLnN0ZXBzO1xuICAgICAgICAgICAgICAgIHMueGF4aXMudXNlZCA9IHMueWF4aXMudXNlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGogPSBrID0gMDsgaiA8IGRhdGEubGVuZ3RoOyArK2osIGsgKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IGRhdGFbal07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG51bGxpZnkgPSBwID09IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbnVsbGlmeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gMDsgbSA8IHBzOyArK20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBwW21dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmb3JtYXRbbV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi5udW1iZXIgJiYgdmFsICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9ICt2YWw7IC8vIGNvbnZlcnQgdG8gbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4odmFsKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsID09IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGZha2VJbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbCA9PSAtSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gLWZha2VJbmZpbml0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGYucmVxdWlyZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbGlmeSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLmRlZmF1bHRWYWx1ZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGYuZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2sgKyBtXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsaWZ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSAwOyBtIDwgcHM7ICsrbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHBvaW50c1trICsgbV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmb3JtYXRbbV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV4dHJhY3QgbWluL21heCBpbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLmF1dG9zY2FsZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVBeGlzKHMueGF4aXMsIHZhbCwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVBeGlzKHMueWF4aXMsIHZhbCwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHNbayArIG1dID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgbGl0dGxlIGJpdCBvZiBsaW5lIHNwZWNpZmljIHN0dWZmIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBlcmhhcHMgc2hvdWxkbid0IGJlIGhlcmUsIGJ1dCBsYWNraW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBiZXR0ZXIgbWVhbnMuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnNlcnRTdGVwcyAmJiBrID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBvaW50c1trIC0gcHNdICE9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwb2ludHNbayAtIHBzXSAhPSBwb2ludHNba11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwb2ludHNbayAtIHBzICsgMV0gIT0gcG9pbnRzW2sgKyAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvcHkgdGhlIHBvaW50IHRvIG1ha2Ugcm9vbSBmb3IgYSBtaWRkbGUgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSAwOyBtIDwgcHM7ICsrbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2sgKyBwcyArIG1dID0gcG9pbnRzW2sgKyBtXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1pZGRsZSBwb2ludCBoYXMgc2FtZSB5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2sgKyAxXSA9IHBvaW50c1trIC0gcHMgKyAxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ3ZlIGFkZGVkIGEgcG9pbnQsIGJldHRlciByZWZsZWN0IHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrICs9IHBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBnaXZlIHRoZSBob29rcyBhIGNoYW5jZSB0byBydW5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW2ldO1xuXG4gICAgICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLnByb2Nlc3NEYXRhcG9pbnRzLCBbIHMsIHMuZGF0YXBvaW50c10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZWNvbmQgcGFzczogZmluZCBkYXRhbWF4L2RhdGFtaW4gZm9yIGF1dG8tc2NhbGluZ1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNlcmllcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHMgPSBzZXJpZXNbaV07XG4gICAgICAgICAgICAgICAgcG9pbnRzID0gcy5kYXRhcG9pbnRzLnBvaW50cztcbiAgICAgICAgICAgICAgICBwcyA9IHMuZGF0YXBvaW50cy5wb2ludHNpemU7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gcy5kYXRhcG9pbnRzLmZvcm1hdDtcblxuICAgICAgICAgICAgICAgIHZhciB4bWluID0gdG9wU2VudHJ5LCB5bWluID0gdG9wU2VudHJ5LFxuICAgICAgICAgICAgICAgICAgICB4bWF4ID0gYm90dG9tU2VudHJ5LCB5bWF4ID0gYm90dG9tU2VudHJ5O1xuXG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHBvaW50cy5sZW5ndGg7IGogKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50c1tqXSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gMDsgbSA8IHBzOyArK20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHBvaW50c1tqICsgbV07XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gZm9ybWF0W21dO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmIHx8IGYuYXV0b3NjYWxlID09PSBmYWxzZSB8fCB2YWwgPT0gZmFrZUluZmluaXR5IHx8IHZhbCA9PSAtZmFrZUluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi54KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA8IHhtaW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhtaW4gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA+IHhtYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhtYXggPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZi55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA8IHltaW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltaW4gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA+IHltYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHltYXggPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocy5iYXJzLnNob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGdvdCByb29tIGZvciB0aGUgYmFyIG9uIHRoZSBkYW5jaW5nIGZsb29yXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWx0YTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHMuYmFycy5hbGlnbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YSA9IC1zLmJhcnMuYmFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhID0gLXMuYmFycy5iYXJXaWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocy5iYXJzLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHltaW4gKz0gZGVsdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5bWF4ICs9IGRlbHRhICsgcy5iYXJzLmJhcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgeG1pbiArPSBkZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHhtYXggKz0gZGVsdGEgKyBzLmJhcnMuYmFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1cGRhdGVBeGlzKHMueGF4aXMsIHhtaW4sIHhtYXgpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUF4aXMocy55YXhpcywgeW1pbiwgeW1heCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZWFjaChhbGxBeGVzKCksIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMuZGF0YW1pbiA9PSB0b3BTZW50cnkpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMuZGF0YW1pbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMuZGF0YW1heCA9PSBib3R0b21TZW50cnkpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMuZGF0YW1heCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldHVwQ2FudmFzZXMoKSB7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgcGxhY2Vob2xkZXIgaXMgY2xlYXIgb2YgZXZlcnl0aGluZyBleGNlcHQgY2FudmFzZXNcbiAgICAgICAgICAgIC8vIGZyb20gYSBwcmV2aW91cyBwbG90IGluIHRoaXMgY29udGFpbmVyIHRoYXQgd2UnbGwgdHJ5IHRvIHJlLXVzZS5cblxuICAgICAgICAgICAgcGxhY2Vob2xkZXIuY3NzKFwicGFkZGluZ1wiLCAwKSAvLyBwYWRkaW5nIG1lc3NlcyB1cCB0aGUgcG9zaXRpb25pbmdcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKS5maWx0ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEkKHRoaXMpLmhhc0NsYXNzKFwiZmxvdC1vdmVybGF5XCIpICYmICEkKHRoaXMpLmhhc0NsYXNzKCdmbG90LWJhc2UnKTtcbiAgICAgICAgICAgICAgICB9KS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyLmNzcyhcInBvc2l0aW9uXCIpID09ICdzdGF0aWMnKVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLmNzcyhcInBvc2l0aW9uXCIsIFwicmVsYXRpdmVcIik7IC8vIGZvciBwb3NpdGlvbmluZyBsYWJlbHMgYW5kIG92ZXJsYXlcblxuICAgICAgICAgICAgc3VyZmFjZSA9IG5ldyBDYW52YXMoXCJmbG90LWJhc2VcIiwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgb3ZlcmxheSA9IG5ldyBDYW52YXMoXCJmbG90LW92ZXJsYXlcIiwgcGxhY2Vob2xkZXIpOyAvLyBvdmVybGF5IGNhbnZhcyBmb3IgaW50ZXJhY3RpdmUgZmVhdHVyZXNcblxuICAgICAgICAgICAgY3R4ID0gc3VyZmFjZS5jb250ZXh0O1xuICAgICAgICAgICAgb2N0eCA9IG92ZXJsYXkuY29udGV4dDtcblxuICAgICAgICAgICAgLy8gZGVmaW5lIHdoaWNoIGVsZW1lbnQgd2UncmUgbGlzdGVuaW5nIGZvciBldmVudHMgb25cbiAgICAgICAgICAgIGV2ZW50SG9sZGVyID0gJChvdmVybGF5LmVsZW1lbnQpLnVuYmluZCgpO1xuXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSByZS11c2luZyBhIHBsb3Qgb2JqZWN0LCBzaHV0IGRvd24gdGhlIG9sZCBvbmVcblxuICAgICAgICAgICAgdmFyIGV4aXN0aW5nID0gcGxhY2Vob2xkZXIuZGF0YShcInBsb3RcIik7XG5cbiAgICAgICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nLnNodXRkb3duKCk7XG4gICAgICAgICAgICAgICAgb3ZlcmxheS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzYXZlIGluIGNhc2Ugd2UgZ2V0IHJlcGxvdHRlZFxuICAgICAgICAgICAgcGxhY2Vob2xkZXIuZGF0YShcInBsb3RcIiwgcGxvdCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBiaW5kRXZlbnRzKCkge1xuICAgICAgICAgICAgLy8gYmluZCBldmVudHNcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmdyaWQuaG92ZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRIb2xkZXIubW91c2Vtb3ZlKG9uTW91c2VNb3ZlKTtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSBiaW5kLCByYXRoZXIgdGhhbiAubW91c2VsZWF2ZSwgYmVjYXVzZSB3ZSBvZmZpY2lhbGx5XG4gICAgICAgICAgICAgICAgLy8gc3RpbGwgc3VwcG9ydCBqUXVlcnkgMS4yLjYsIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGEgc2hvcnRjdXRcbiAgICAgICAgICAgICAgICAvLyBmb3IgbW91c2VlbnRlciBvciBtb3VzZWxlYXZlLiAgVGhpcyB3YXMgYSBidWcvb3ZlcnNpZ2h0IHRoYXRcbiAgICAgICAgICAgICAgICAvLyB3YXMgZml4ZWQgc29tZXdoZXJlIGFyb3VuZCAxLjMueC4gIFdlIGNhbiByZXR1cm4gdG8gdXNpbmdcbiAgICAgICAgICAgICAgICAvLyAubW91c2VsZWF2ZSB3aGVuIHdlIGRyb3Agc3VwcG9ydCBmb3IgMS4yLjYuXG5cbiAgICAgICAgICAgICAgICBldmVudEhvbGRlci5iaW5kKFwibW91c2VsZWF2ZVwiLCBvbk1vdXNlTGVhdmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmNsaWNrYWJsZSlcbiAgICAgICAgICAgICAgICBldmVudEhvbGRlci5jbGljayhvbkNsaWNrKTtcblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLmJpbmRFdmVudHMsIFtldmVudEhvbGRlcl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2h1dGRvd24oKSB7XG4gICAgICAgICAgICBpZiAocmVkcmF3VGltZW91dClcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQocmVkcmF3VGltZW91dCk7XG5cbiAgICAgICAgICAgIGV2ZW50SG9sZGVyLnVuYmluZChcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG4gICAgICAgICAgICBldmVudEhvbGRlci51bmJpbmQoXCJtb3VzZWxlYXZlXCIsIG9uTW91c2VMZWF2ZSk7XG4gICAgICAgICAgICBldmVudEhvbGRlci51bmJpbmQoXCJjbGlja1wiLCBvbkNsaWNrKTtcblxuICAgICAgICAgICAgZXhlY3V0ZUhvb2tzKGhvb2tzLnNodXRkb3duLCBbZXZlbnRIb2xkZXJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFRyYW5zZm9ybWF0aW9uSGVscGVycyhheGlzKSB7XG4gICAgICAgICAgICAvLyBzZXQgaGVscGVyIGZ1bmN0aW9ucyBvbiB0aGUgYXhpcywgYXNzdW1lcyBwbG90IGFyZWFcbiAgICAgICAgICAgIC8vIGhhcyBiZWVuIGNvbXB1dGVkIGFscmVhZHlcblxuICAgICAgICAgICAgZnVuY3Rpb24gaWRlbnRpdHkoeCkgeyByZXR1cm4geDsgfVxuXG4gICAgICAgICAgICB2YXIgcywgbSwgdCA9IGF4aXMub3B0aW9ucy50cmFuc2Zvcm0gfHwgaWRlbnRpdHksXG4gICAgICAgICAgICAgICAgaXQgPSBheGlzLm9wdGlvbnMuaW52ZXJzZVRyYW5zZm9ybTtcblxuICAgICAgICAgICAgLy8gcHJlY29tcHV0ZSBob3cgbXVjaCB0aGUgYXhpcyBpcyBzY2FsaW5nIGEgcG9pbnRcbiAgICAgICAgICAgIC8vIGluIGNhbnZhcyBzcGFjZVxuICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKSB7XG4gICAgICAgICAgICAgICAgcyA9IGF4aXMuc2NhbGUgPSBwbG90V2lkdGggLyBNYXRoLmFicyh0KGF4aXMubWF4KSAtIHQoYXhpcy5taW4pKTtcbiAgICAgICAgICAgICAgICBtID0gTWF0aC5taW4odChheGlzLm1heCksIHQoYXhpcy5taW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgPSBheGlzLnNjYWxlID0gcGxvdEhlaWdodCAvIE1hdGguYWJzKHQoYXhpcy5tYXgpIC0gdChheGlzLm1pbikpO1xuICAgICAgICAgICAgICAgIHMgPSAtcztcbiAgICAgICAgICAgICAgICBtID0gTWF0aC5tYXgodChheGlzLm1heCksIHQoYXhpcy5taW4pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGF0YSBwb2ludCB0byBjYW52YXMgY29vcmRpbmF0ZVxuICAgICAgICAgICAgaWYgKHQgPT0gaWRlbnRpdHkpIC8vIHNsaWdodCBvcHRpbWl6YXRpb25cbiAgICAgICAgICAgICAgICBheGlzLnAyYyA9IGZ1bmN0aW9uIChwKSB7IHJldHVybiAocCAtIG0pICogczsgfTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBheGlzLnAyYyA9IGZ1bmN0aW9uIChwKSB7IHJldHVybiAodChwKSAtIG0pICogczsgfTtcbiAgICAgICAgICAgIC8vIGNhbnZhcyBjb29yZGluYXRlIHRvIGRhdGEgcG9pbnRcbiAgICAgICAgICAgIGlmICghaXQpXG4gICAgICAgICAgICAgICAgYXhpcy5jMnAgPSBmdW5jdGlvbiAoYykgeyByZXR1cm4gbSArIGMgLyBzOyB9O1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGF4aXMuYzJwID0gZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGl0KG0gKyBjIC8gcyk7IH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtZWFzdXJlVGlja0xhYmVscyhheGlzKSB7XG5cbiAgICAgICAgICAgIHZhciBvcHRzID0gYXhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIHRpY2tzID0gYXhpcy50aWNrcyB8fCBbXSxcbiAgICAgICAgICAgICAgICBsYWJlbFdpZHRoID0gb3B0cy5sYWJlbFdpZHRoIHx8IDAsXG4gICAgICAgICAgICAgICAgbGFiZWxIZWlnaHQgPSBvcHRzLmxhYmVsSGVpZ2h0IHx8IDAsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGggPSBsYWJlbFdpZHRoIHx8IChheGlzLmRpcmVjdGlvbiA9PSBcInhcIiA/IE1hdGguZmxvb3Ioc3VyZmFjZS53aWR0aCAvICh0aWNrcy5sZW5ndGggfHwgMSkpIDogbnVsbCksXG4gICAgICAgICAgICAgICAgbGVnYWN5U3R5bGVzID0gYXhpcy5kaXJlY3Rpb24gKyBcIkF4aXMgXCIgKyBheGlzLmRpcmVjdGlvbiArIGF4aXMubiArIFwiQXhpc1wiLFxuICAgICAgICAgICAgICAgIGxheWVyID0gXCJmbG90LVwiICsgYXhpcy5kaXJlY3Rpb24gKyBcIi1heGlzIGZsb3QtXCIgKyBheGlzLmRpcmVjdGlvbiArIGF4aXMubiArIFwiLWF4aXMgXCIgKyBsZWdhY3lTdHlsZXMsXG4gICAgICAgICAgICAgICAgZm9udCA9IG9wdHMuZm9udCB8fCBcImZsb3QtdGljay1sYWJlbCB0aWNrTGFiZWxcIjtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aWNrcy5sZW5ndGg7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHQgPSB0aWNrc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmICghdC5sYWJlbClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IHN1cmZhY2UuZ2V0VGV4dEluZm8obGF5ZXIsIHQubGFiZWwsIGZvbnQsIG51bGwsIG1heFdpZHRoKTtcblxuICAgICAgICAgICAgICAgIGxhYmVsV2lkdGggPSBNYXRoLm1heChsYWJlbFdpZHRoLCBpbmZvLndpZHRoKTtcbiAgICAgICAgICAgICAgICBsYWJlbEhlaWdodCA9IE1hdGgubWF4KGxhYmVsSGVpZ2h0LCBpbmZvLmhlaWdodCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF4aXMubGFiZWxXaWR0aCA9IG9wdHMubGFiZWxXaWR0aCB8fCBsYWJlbFdpZHRoO1xuICAgICAgICAgICAgYXhpcy5sYWJlbEhlaWdodCA9IG9wdHMubGFiZWxIZWlnaHQgfHwgbGFiZWxIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbGxvY2F0ZUF4aXNCb3hGaXJzdFBoYXNlKGF4aXMpIHtcbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgYXhpcyBieSBsb29raW5nIGF0IGxhYmVsXG4gICAgICAgICAgICAvLyB3aWR0aHMvaGVpZ2h0cyBhbmQgdGlja3MsIG1ha2Ugcm9vbSBieSBkaW1pbmlzaGluZyB0aGVcbiAgICAgICAgICAgIC8vIHBsb3RPZmZzZXQ7IHRoaXMgZmlyc3QgcGhhc2Ugb25seSBsb29rcyBhdCBvbmVcbiAgICAgICAgICAgIC8vIGRpbWVuc2lvbiBwZXIgYXhpcywgdGhlIG90aGVyIGRpbWVuc2lvbiBkZXBlbmRzIG9uIHRoZVxuICAgICAgICAgICAgLy8gb3RoZXIgYXhlcyBzbyB3aWxsIGhhdmUgdG8gd2FpdFxuXG4gICAgICAgICAgICB2YXIgbHcgPSBheGlzLmxhYmVsV2lkdGgsXG4gICAgICAgICAgICAgICAgbGggPSBheGlzLmxhYmVsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvcyA9IGF4aXMub3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICBpc1hBeGlzID0gYXhpcy5kaXJlY3Rpb24gPT09IFwieFwiLFxuICAgICAgICAgICAgICAgIHRpY2tMZW5ndGggPSBheGlzLm9wdGlvbnMudGlja0xlbmd0aCxcbiAgICAgICAgICAgICAgICBheGlzTWFyZ2luID0gb3B0aW9ucy5ncmlkLmF4aXNNYXJnaW4sXG4gICAgICAgICAgICAgICAgcGFkZGluZyA9IG9wdGlvbnMuZ3JpZC5sYWJlbE1hcmdpbixcbiAgICAgICAgICAgICAgICBpbm5lcm1vc3QgPSB0cnVlLFxuICAgICAgICAgICAgICAgIG91dGVybW9zdCA9IHRydWUsXG4gICAgICAgICAgICAgICAgZmlyc3QgPSB0cnVlLFxuICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIERldGVybWluZSB0aGUgYXhpcydzIHBvc2l0aW9uIGluIGl0cyBkaXJlY3Rpb24gYW5kIG9uIGl0cyBzaWRlXG5cbiAgICAgICAgICAgICQuZWFjaChpc1hBeGlzID8geGF4ZXMgOiB5YXhlcywgZnVuY3Rpb24oaSwgYSkge1xuICAgICAgICAgICAgICAgIGlmIChhICYmIChhLnNob3cgfHwgYS5yZXNlcnZlU3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhID09PSBheGlzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5vcHRpb25zLnBvc2l0aW9uID09PSBwb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dGVybW9zdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lcm1vc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRoZSBvdXRlcm1vc3QgYXhpcyBvbiBlYWNoIHNpZGUgaGFzIG5vIG1hcmdpblxuXG4gICAgICAgICAgICBpZiAob3V0ZXJtb3N0KSB7XG4gICAgICAgICAgICAgICAgYXhpc01hcmdpbiA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSB0aWNrcyBmb3IgdGhlIGZpcnN0IGF4aXMgaW4gZWFjaCBkaXJlY3Rpb24gc3RyZXRjaCBhY3Jvc3NcblxuICAgICAgICAgICAgaWYgKHRpY2tMZW5ndGggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRpY2tMZW5ndGggPSBmaXJzdCA/IFwiZnVsbFwiIDogNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc05hTigrdGlja0xlbmd0aCkpXG4gICAgICAgICAgICAgICAgcGFkZGluZyArPSArdGlja0xlbmd0aDtcblxuICAgICAgICAgICAgaWYgKGlzWEF4aXMpIHtcbiAgICAgICAgICAgICAgICBsaCArPSBwYWRkaW5nO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsb3RPZmZzZXQuYm90dG9tICs9IGxoICsgYXhpc01hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5ib3ggPSB7IHRvcDogc3VyZmFjZS5oZWlnaHQgLSBwbG90T2Zmc2V0LmJvdHRvbSwgaGVpZ2h0OiBsaCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5ib3ggPSB7IHRvcDogcGxvdE9mZnNldC50b3AgKyBheGlzTWFyZ2luLCBoZWlnaHQ6IGxoIH07XG4gICAgICAgICAgICAgICAgICAgIHBsb3RPZmZzZXQudG9wICs9IGxoICsgYXhpc01hcmdpbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsdyArPSBwYWRkaW5nO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgICAgICBheGlzLmJveCA9IHsgbGVmdDogcGxvdE9mZnNldC5sZWZ0ICsgYXhpc01hcmdpbiwgd2lkdGg6IGx3IH07XG4gICAgICAgICAgICAgICAgICAgIHBsb3RPZmZzZXQubGVmdCArPSBsdyArIGF4aXNNYXJnaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwbG90T2Zmc2V0LnJpZ2h0ICs9IGx3ICsgYXhpc01hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgYXhpcy5ib3ggPSB7IGxlZnQ6IHN1cmZhY2Uud2lkdGggLSBwbG90T2Zmc2V0LnJpZ2h0LCB3aWR0aDogbHcgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAvLyBzYXZlIGZvciBmdXR1cmUgcmVmZXJlbmNlXG4gICAgICAgICAgICBheGlzLnBvc2l0aW9uID0gcG9zO1xuICAgICAgICAgICAgYXhpcy50aWNrTGVuZ3RoID0gdGlja0xlbmd0aDtcbiAgICAgICAgICAgIGF4aXMuYm94LnBhZGRpbmcgPSBwYWRkaW5nO1xuICAgICAgICAgICAgYXhpcy5pbm5lcm1vc3QgPSBpbm5lcm1vc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhbGxvY2F0ZUF4aXNCb3hTZWNvbmRQaGFzZShheGlzKSB7XG4gICAgICAgICAgICAvLyBub3cgdGhhdCBhbGwgYXhpcyBib3hlcyBoYXZlIGJlZW4gcGxhY2VkIGluIG9uZVxuICAgICAgICAgICAgLy8gZGltZW5zaW9uLCB3ZSBjYW4gc2V0IHRoZSByZW1haW5pbmcgZGltZW5zaW9uIGNvb3JkaW5hdGVzXG4gICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICBheGlzLmJveC5sZWZ0ID0gcGxvdE9mZnNldC5sZWZ0IC0gYXhpcy5sYWJlbFdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICBheGlzLmJveC53aWR0aCA9IHN1cmZhY2Uud2lkdGggLSBwbG90T2Zmc2V0LmxlZnQgLSBwbG90T2Zmc2V0LnJpZ2h0ICsgYXhpcy5sYWJlbFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYXhpcy5ib3gudG9wID0gcGxvdE9mZnNldC50b3AgLSBheGlzLmxhYmVsSGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICBheGlzLmJveC5oZWlnaHQgPSBzdXJmYWNlLmhlaWdodCAtIHBsb3RPZmZzZXQuYm90dG9tIC0gcGxvdE9mZnNldC50b3AgKyBheGlzLmxhYmVsSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRqdXN0TGF5b3V0Rm9yVGhpbmdzU3RpY2tpbmdPdXQoKSB7XG4gICAgICAgICAgICAvLyBwb3NzaWJseSBhZGp1c3QgcGxvdCBvZmZzZXQgdG8gZW5zdXJlIGV2ZXJ5dGhpbmcgc3RheXNcbiAgICAgICAgICAgIC8vIGluc2lkZSB0aGUgY2FudmFzIGFuZCBpc24ndCBjbGlwcGVkIG9mZlxuXG4gICAgICAgICAgICB2YXIgbWluTWFyZ2luID0gb3B0aW9ucy5ncmlkLm1pbkJvcmRlck1hcmdpbixcbiAgICAgICAgICAgICAgICBheGlzLCBpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBzdHVmZiBmcm9tIHRoZSBwbG90IChGSVhNRTogdGhpcyBzaG91bGQganVzdCByZWFkXG4gICAgICAgICAgICAvLyBhIHZhbHVlIGZyb20gdGhlIHNlcmllcywgb3RoZXJ3aXNlIGl0J3MgaW1wb3NzaWJsZSB0b1xuICAgICAgICAgICAgLy8gY3VzdG9taXplKVxuICAgICAgICAgICAgaWYgKG1pbk1hcmdpbiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbWluTWFyZ2luID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgICAgICBtaW5NYXJnaW4gPSBNYXRoLm1heChtaW5NYXJnaW4sIDIgKiAoc2VyaWVzW2ldLnBvaW50cy5yYWRpdXMgKyBzZXJpZXNbaV0ucG9pbnRzLmxpbmVXaWR0aC8yKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtYXJnaW5zID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IG1pbk1hcmdpbixcbiAgICAgICAgICAgICAgICByaWdodDogbWluTWFyZ2luLFxuICAgICAgICAgICAgICAgIHRvcDogbWluTWFyZ2luLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogbWluTWFyZ2luXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBjaGVjayBheGlzIGxhYmVscywgbm90ZSB3ZSBkb24ndCBjaGVjayB0aGUgYWN0dWFsXG4gICAgICAgICAgICAvLyBsYWJlbHMgYnV0IGluc3RlYWQgdXNlIHRoZSBvdmVyYWxsIHdpZHRoL2hlaWdodCB0byBub3RcbiAgICAgICAgICAgIC8vIGp1bXAgYXMgbXVjaCBhcm91bmQgd2l0aCByZXBsb3RzXG4gICAgICAgICAgICAkLmVhY2goYWxsQXhlcygpLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIGlmIChheGlzLnJlc2VydmVTcGFjZSAmJiBheGlzLnRpY2tzICYmIGF4aXMudGlja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbnMubGVmdCA9IE1hdGgubWF4KG1hcmdpbnMubGVmdCwgYXhpcy5sYWJlbFdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5zLnJpZ2h0ID0gTWF0aC5tYXgobWFyZ2lucy5yaWdodCwgYXhpcy5sYWJlbFdpZHRoIC8gMik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5zLmJvdHRvbSA9IE1hdGgubWF4KG1hcmdpbnMuYm90dG9tLCBheGlzLmxhYmVsSGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5zLnRvcCA9IE1hdGgubWF4KG1hcmdpbnMudG9wLCBheGlzLmxhYmVsSGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGxvdE9mZnNldC5sZWZ0ID0gTWF0aC5jZWlsKE1hdGgubWF4KG1hcmdpbnMubGVmdCwgcGxvdE9mZnNldC5sZWZ0KSk7XG4gICAgICAgICAgICBwbG90T2Zmc2V0LnJpZ2h0ID0gTWF0aC5jZWlsKE1hdGgubWF4KG1hcmdpbnMucmlnaHQsIHBsb3RPZmZzZXQucmlnaHQpKTtcbiAgICAgICAgICAgIHBsb3RPZmZzZXQudG9wID0gTWF0aC5jZWlsKE1hdGgubWF4KG1hcmdpbnMudG9wLCBwbG90T2Zmc2V0LnRvcCkpO1xuICAgICAgICAgICAgcGxvdE9mZnNldC5ib3R0b20gPSBNYXRoLmNlaWwoTWF0aC5tYXgobWFyZ2lucy5ib3R0b20sIHBsb3RPZmZzZXQuYm90dG9tKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXR1cEdyaWQoKSB7XG4gICAgICAgICAgICB2YXIgaSwgYXhlcyA9IGFsbEF4ZXMoKSwgc2hvd0dyaWQgPSBvcHRpb25zLmdyaWQuc2hvdztcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgcGxvdCdzIG9mZnNldCBmcm9tIHRoZSBlZGdlIG9mIHRoZSBjYW52YXNcblxuICAgICAgICAgICAgZm9yICh2YXIgYSBpbiBwbG90T2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmdpbiA9IG9wdGlvbnMuZ3JpZC5tYXJnaW4gfHwgMDtcbiAgICAgICAgICAgICAgICBwbG90T2Zmc2V0W2FdID0gdHlwZW9mIG1hcmdpbiA9PSBcIm51bWJlclwiID8gbWFyZ2luIDogbWFyZ2luW2FdIHx8IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5wcm9jZXNzT2Zmc2V0LCBbcGxvdE9mZnNldF0pO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZ3JpZCBpcyB2aXNpYmxlLCBhZGQgaXRzIGJvcmRlciB3aWR0aCB0byB0aGUgb2Zmc2V0XG5cbiAgICAgICAgICAgIGZvciAodmFyIGEgaW4gcGxvdE9mZnNldCkge1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZihvcHRpb25zLmdyaWQuYm9yZGVyV2lkdGgpID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxvdE9mZnNldFthXSArPSBzaG93R3JpZCA/IG9wdGlvbnMuZ3JpZC5ib3JkZXJXaWR0aFthXSA6IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwbG90T2Zmc2V0W2FdICs9IHNob3dHcmlkID8gb3B0aW9ucy5ncmlkLmJvcmRlcldpZHRoIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQuZWFjaChheGVzLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIHZhciBheGlzT3B0cyA9IGF4aXMub3B0aW9ucztcbiAgICAgICAgICAgICAgICBheGlzLnNob3cgPSBheGlzT3B0cy5zaG93ID09IG51bGwgPyBheGlzLnVzZWQgOiBheGlzT3B0cy5zaG93O1xuICAgICAgICAgICAgICAgIGF4aXMucmVzZXJ2ZVNwYWNlID0gYXhpc09wdHMucmVzZXJ2ZVNwYWNlID09IG51bGwgPyBheGlzLnNob3cgOiBheGlzT3B0cy5yZXNlcnZlU3BhY2U7XG4gICAgICAgICAgICAgICAgc2V0UmFuZ2UoYXhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNob3dHcmlkKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgYWxsb2NhdGVkQXhlcyA9ICQuZ3JlcChheGVzLCBmdW5jdGlvbiAoYXhpcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXhpcy5zaG93IHx8IGF4aXMucmVzZXJ2ZVNwYWNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJC5lYWNoKGFsbG9jYXRlZEF4ZXMsIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIHRpY2tzXG4gICAgICAgICAgICAgICAgICAgIHNldHVwVGlja0dlbmVyYXRpb24oYXhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpY2tzKGF4aXMpO1xuICAgICAgICAgICAgICAgICAgICBzbmFwUmFuZ2VUb1RpY2tzKGF4aXMsIGF4aXMudGlja3MpO1xuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIGxhYmVsV2lkdGgvSGVpZ2h0IGZvciBheGlzXG4gICAgICAgICAgICAgICAgICAgIG1lYXN1cmVUaWNrTGFiZWxzKGF4aXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gd2l0aCBhbGwgZGltZW5zaW9ucyBjYWxjdWxhdGVkLCB3ZSBjYW4gY29tcHV0ZSB0aGVcbiAgICAgICAgICAgICAgICAvLyBheGlzIGJvdW5kaW5nIGJveGVzLCBzdGFydCBmcm9tIHRoZSBvdXRzaWRlXG4gICAgICAgICAgICAgICAgLy8gKHJldmVyc2Ugb3JkZXIpXG4gICAgICAgICAgICAgICAgZm9yIChpID0gYWxsb2NhdGVkQXhlcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSlcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVBeGlzQm94Rmlyc3RQaGFzZShhbGxvY2F0ZWRBeGVzW2ldKTtcblxuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSd2ZSBnb3QgZW5vdWdoIHNwYWNlIGZvciB0aGluZ3MgdGhhdFxuICAgICAgICAgICAgICAgIC8vIG1pZ2h0IHN0aWNrIG91dFxuICAgICAgICAgICAgICAgIGFkanVzdExheW91dEZvclRoaW5nc1N0aWNraW5nT3V0KCk7XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goYWxsb2NhdGVkQXhlcywgZnVuY3Rpb24gKF8sIGF4aXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb2NhdGVBeGlzQm94U2Vjb25kUGhhc2UoYXhpcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBsb3RXaWR0aCA9IHN1cmZhY2Uud2lkdGggLSBwbG90T2Zmc2V0LmxlZnQgLSBwbG90T2Zmc2V0LnJpZ2h0O1xuICAgICAgICAgICAgcGxvdEhlaWdodCA9IHN1cmZhY2UuaGVpZ2h0IC0gcGxvdE9mZnNldC5ib3R0b20gLSBwbG90T2Zmc2V0LnRvcDtcblxuICAgICAgICAgICAgLy8gbm93IHdlIGdvdCB0aGUgcHJvcGVyIHBsb3QgZGltZW5zaW9ucywgd2UgY2FuIGNvbXB1dGUgdGhlIHNjYWxpbmdcbiAgICAgICAgICAgICQuZWFjaChheGVzLCBmdW5jdGlvbiAoXywgYXhpcykge1xuICAgICAgICAgICAgICAgIHNldFRyYW5zZm9ybWF0aW9uSGVscGVycyhheGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2hvd0dyaWQpIHtcbiAgICAgICAgICAgICAgICBkcmF3QXhpc0xhYmVscygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpbnNlcnRMZWdlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJhbmdlKGF4aXMpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gYXhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIG1pbiA9ICsob3B0cy5taW4gIT0gbnVsbCA/IG9wdHMubWluIDogYXhpcy5kYXRhbWluKSxcbiAgICAgICAgICAgICAgICBtYXggPSArKG9wdHMubWF4ICE9IG51bGwgPyBvcHRzLm1heCA6IGF4aXMuZGF0YW1heCksXG4gICAgICAgICAgICAgICAgZGVsdGEgPSBtYXggLSBtaW47XG5cbiAgICAgICAgICAgIGlmIChkZWx0YSA9PSAwLjApIHtcbiAgICAgICAgICAgICAgICAvLyBkZWdlbmVyYXRlIGNhc2VcbiAgICAgICAgICAgICAgICB2YXIgd2lkZW4gPSBtYXggPT0gMCA/IDEgOiAwLjAxO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMubWluID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIG1pbiAtPSB3aWRlbjtcbiAgICAgICAgICAgICAgICAvLyBhbHdheXMgd2lkZW4gbWF4IGlmIHdlIGNvdWxkbid0IHdpZGVuIG1pbiB0byBlbnN1cmUgd2VcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBmYWxsIGludG8gbWluID09IG1heCB3aGljaCBkb2Vzbid0IHdvcmtcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5tYXggPT0gbnVsbCB8fCBvcHRzLm1pbiAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBtYXggKz0gd2lkZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zaWRlciBhdXRvc2NhbGluZ1xuICAgICAgICAgICAgICAgIHZhciBtYXJnaW4gPSBvcHRzLmF1dG9zY2FsZU1hcmdpbjtcbiAgICAgICAgICAgICAgICBpZiAobWFyZ2luICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubWluID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbiAtPSBkZWx0YSAqIG1hcmdpbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBnbyBiZWxvdyB6ZXJvIGlmIGFsbCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZSBwb3NpdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1pbiA8IDAgJiYgYXhpcy5kYXRhbWluICE9IG51bGwgJiYgYXhpcy5kYXRhbWluID49IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5tYXggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4ICs9IGRlbHRhICogbWFyZ2luO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1heCA+IDAgJiYgYXhpcy5kYXRhbWF4ICE9IG51bGwgJiYgYXhpcy5kYXRhbWF4IDw9IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF4aXMubWluID0gbWluO1xuICAgICAgICAgICAgYXhpcy5tYXggPSBtYXg7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXR1cFRpY2tHZW5lcmF0aW9uKGF4aXMpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gYXhpcy5vcHRpb25zO1xuXG4gICAgICAgICAgICAvLyBlc3RpbWF0ZSBudW1iZXIgb2YgdGlja3NcbiAgICAgICAgICAgIHZhciBub1RpY2tzO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzLnRpY2tzID09IFwibnVtYmVyXCIgJiYgb3B0cy50aWNrcyA+IDApXG4gICAgICAgICAgICAgICAgbm9UaWNrcyA9IG9wdHMudGlja3M7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgLy8gaGV1cmlzdGljIGJhc2VkIG9uIHRoZSBtb2RlbCBhKnNxcnQoeCkgZml0dGVkIHRvXG4gICAgICAgICAgICAgICAgLy8gc29tZSBkYXRhIHBvaW50cyB0aGF0IHNlZW1lZCByZWFzb25hYmxlXG4gICAgICAgICAgICAgICAgbm9UaWNrcyA9IDAuMyAqIE1hdGguc3FydChheGlzLmRpcmVjdGlvbiA9PSBcInhcIiA/IHN1cmZhY2Uud2lkdGggOiBzdXJmYWNlLmhlaWdodCk7XG5cbiAgICAgICAgICAgIHZhciBkZWx0YSA9IChheGlzLm1heCAtIGF4aXMubWluKSAvIG5vVGlja3MsXG4gICAgICAgICAgICAgICAgZGVjID0gLU1hdGguZmxvb3IoTWF0aC5sb2coZGVsdGEpIC8gTWF0aC5MTjEwKSxcbiAgICAgICAgICAgICAgICBtYXhEZWMgPSBvcHRzLnRpY2tEZWNpbWFscztcblxuICAgICAgICAgICAgaWYgKG1heERlYyAhPSBudWxsICYmIGRlYyA+IG1heERlYykge1xuICAgICAgICAgICAgICAgIGRlYyA9IG1heERlYztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1hZ24gPSBNYXRoLnBvdygxMCwgLWRlYyksXG4gICAgICAgICAgICAgICAgbm9ybSA9IGRlbHRhIC8gbWFnbiwgLy8gbm9ybSBpcyBiZXR3ZWVuIDEuMCBhbmQgMTAuMFxuICAgICAgICAgICAgICAgIHNpemU7XG5cbiAgICAgICAgICAgIGlmIChub3JtIDwgMS41KSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vcm0gPCAzKSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IDI7XG4gICAgICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciAyLjUsIHJlcXVpcmVzIGFuIGV4dHJhIGRlY2ltYWxcbiAgICAgICAgICAgICAgICBpZiAobm9ybSA+IDIuMjUgJiYgKG1heERlYyA9PSBudWxsIHx8IGRlYyArIDEgPD0gbWF4RGVjKSkge1xuICAgICAgICAgICAgICAgICAgICBzaXplID0gMi41O1xuICAgICAgICAgICAgICAgICAgICArK2RlYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vcm0gPCA3LjUpIHtcbiAgICAgICAgICAgICAgICBzaXplID0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IDEwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaXplICo9IG1hZ247XG5cbiAgICAgICAgICAgIGlmIChvcHRzLm1pblRpY2tTaXplICE9IG51bGwgJiYgc2l6ZSA8IG9wdHMubWluVGlja1NpemUpIHtcbiAgICAgICAgICAgICAgICBzaXplID0gb3B0cy5taW5UaWNrU2l6ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXhpcy5kZWx0YSA9IGRlbHRhO1xuICAgICAgICAgICAgYXhpcy50aWNrRGVjaW1hbHMgPSBNYXRoLm1heCgwLCBtYXhEZWMgIT0gbnVsbCA/IG1heERlYyA6IGRlYyk7XG4gICAgICAgICAgICBheGlzLnRpY2tTaXplID0gb3B0cy50aWNrU2l6ZSB8fCBzaXplO1xuXG4gICAgICAgICAgICAvLyBUaW1lIG1vZGUgd2FzIG1vdmVkIHRvIGEgcGx1Zy1pbiBpbiAwLjgsIGFuZCBzaW5jZSBzbyBtYW55IHBlb3BsZSB1c2UgaXRcbiAgICAgICAgICAgIC8vIHdlJ2xsIGFkZCBhbiBlc3BlY2lhbGx5IGZyaWVuZGx5IHJlbWluZGVyIHRvIG1ha2Ugc3VyZSB0aGV5IGluY2x1ZGVkIGl0LlxuXG4gICAgICAgICAgICBpZiAob3B0cy5tb2RlID09IFwidGltZVwiICYmICFheGlzLnRpY2tHZW5lcmF0b3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaW1lIG1vZGUgcmVxdWlyZXMgdGhlIGZsb3QudGltZSBwbHVnaW4uXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGbG90IHN1cHBvcnRzIGJhc2UtMTAgYXhlczsgYW55IG90aGVyIG1vZGUgZWxzZSBpcyBoYW5kbGVkIGJ5IGEgcGx1Zy1pbixcbiAgICAgICAgICAgIC8vIGxpa2UgZmxvdC50aW1lLmpzLlxuXG4gICAgICAgICAgICBpZiAoIWF4aXMudGlja0dlbmVyYXRvcikge1xuXG4gICAgICAgICAgICAgICAgYXhpcy50aWNrR2VuZXJhdG9yID0gZnVuY3Rpb24gKGF4aXMpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlja3MgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gZmxvb3JJbkJhc2UoYXhpcy5taW4sIGF4aXMudGlja1NpemUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gTnVtYmVyLk5hTixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXY7XG5cbiAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldiA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gc3RhcnQgKyBpICogYXhpcy50aWNrU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzLnB1c2godik7XG4gICAgICAgICAgICAgICAgICAgICAgICArK2k7XG4gICAgICAgICAgICAgICAgICAgIH0gd2hpbGUgKHYgPCBheGlzLm1heCAmJiB2ICE9IHByZXYpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlja3M7XG4gICAgICAgICAgICAgICAgfTtcblxuXHRcdFx0XHRheGlzLnRpY2tGb3JtYXR0ZXIgPSBmdW5jdGlvbiAodmFsdWUsIGF4aXMpIHtcblxuXHRcdFx0XHRcdHZhciBmYWN0b3IgPSBheGlzLnRpY2tEZWNpbWFscyA/IE1hdGgucG93KDEwLCBheGlzLnRpY2tEZWNpbWFscykgOiAxO1xuXHRcdFx0XHRcdHZhciBmb3JtYXR0ZWQgPSBcIlwiICsgTWF0aC5yb3VuZCh2YWx1ZSAqIGZhY3RvcikgLyBmYWN0b3I7XG5cblx0XHRcdFx0XHQvLyBJZiB0aWNrRGVjaW1hbHMgd2FzIHNwZWNpZmllZCwgZW5zdXJlIHRoYXQgd2UgaGF2ZSBleGFjdGx5IHRoYXRcblx0XHRcdFx0XHQvLyBtdWNoIHByZWNpc2lvbjsgb3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIHZhbHVlJ3Mgb3duIHByZWNpc2lvbi5cblxuXHRcdFx0XHRcdGlmIChheGlzLnRpY2tEZWNpbWFscyAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHR2YXIgZGVjaW1hbCA9IGZvcm1hdHRlZC5pbmRleE9mKFwiLlwiKTtcblx0XHRcdFx0XHRcdHZhciBwcmVjaXNpb24gPSBkZWNpbWFsID09IC0xID8gMCA6IGZvcm1hdHRlZC5sZW5ndGggLSBkZWNpbWFsIC0gMTtcblx0XHRcdFx0XHRcdGlmIChwcmVjaXNpb24gPCBheGlzLnRpY2tEZWNpbWFscykge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKHByZWNpc2lvbiA/IGZvcm1hdHRlZCA6IGZvcm1hdHRlZCArIFwiLlwiKSArIChcIlwiICsgZmFjdG9yKS5zdWJzdHIoMSwgYXhpcy50aWNrRGVjaW1hbHMgLSBwcmVjaXNpb24pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVkO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0cy50aWNrRm9ybWF0dGVyKSlcbiAgICAgICAgICAgICAgICBheGlzLnRpY2tGb3JtYXR0ZXIgPSBmdW5jdGlvbiAodiwgYXhpcykgeyByZXR1cm4gXCJcIiArIG9wdHMudGlja0Zvcm1hdHRlcih2LCBheGlzKTsgfTtcblxuICAgICAgICAgICAgaWYgKG9wdHMuYWxpZ25UaWNrc1dpdGhBeGlzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3RoZXJBeGlzID0gKGF4aXMuZGlyZWN0aW9uID09IFwieFwiID8geGF4ZXMgOiB5YXhlcylbb3B0cy5hbGlnblRpY2tzV2l0aEF4aXMgLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAob3RoZXJBeGlzICYmIG90aGVyQXhpcy51c2VkICYmIG90aGVyQXhpcyAhPSBheGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNpZGVyIHNuYXBwaW5nIG1pbi9tYXggdG8gb3V0ZXJtb3N0IG5pY2UgdGlja3NcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5pY2VUaWNrcyA9IGF4aXMudGlja0dlbmVyYXRvcihheGlzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5pY2VUaWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5taW4gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzLm1pbiA9IE1hdGgubWluKGF4aXMubWluLCBuaWNlVGlja3NbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubWF4ID09IG51bGwgJiYgbmljZVRpY2tzLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpcy5tYXggPSBNYXRoLm1heChheGlzLm1heCwgbmljZVRpY2tzW25pY2VUaWNrcy5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBheGlzLnRpY2tHZW5lcmF0b3IgPSBmdW5jdGlvbiAoYXhpcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29weSB0aWNrcywgc2NhbGVkIHRvIHRoaXMgYXhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpY2tzID0gW10sIHYsIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3RoZXJBeGlzLnRpY2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IChvdGhlckF4aXMudGlja3NbaV0udiAtIG90aGVyQXhpcy5taW4pIC8gKG90aGVyQXhpcy5tYXggLSBvdGhlckF4aXMubWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gYXhpcy5taW4gKyB2ICogKGF4aXMubWF4IC0gYXhpcy5taW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpY2tzLnB1c2godik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGlja3M7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgbWlnaHQgbmVlZCBhbiBleHRyYSBkZWNpbWFsIHNpbmNlIGZvcmNlZFxuICAgICAgICAgICAgICAgICAgICAvLyB0aWNrcyBkb24ndCBuZWNlc3NhcmlseSBmaXQgbmF0dXJhbGx5XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXhpcy5tb2RlICYmIG9wdHMudGlja0RlY2ltYWxzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYURlYyA9IE1hdGgubWF4KDAsIC1NYXRoLmZsb29yKE1hdGgubG9nKGF4aXMuZGVsdGEpIC8gTWF0aC5MTjEwKSArIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRzID0gYXhpcy50aWNrR2VuZXJhdG9yKGF4aXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IHByb2NlZWQgaWYgdGhlIHRpY2sgaW50ZXJ2YWwgcm91bmRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCBhbiBleHRyYSBkZWNpbWFsIGRvZXNuJ3QgZ2l2ZSB1cyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB6ZXJvIGF0IGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEodHMubGVuZ3RoID4gMSAmJiAvXFwuLiowJC8udGVzdCgodHNbMV0gLSB0c1swXSkudG9GaXhlZChleHRyYURlYykpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzLnRpY2tEZWNpbWFscyA9IGV4dHJhRGVjO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0VGlja3MoYXhpcykge1xuICAgICAgICAgICAgdmFyIG90aWNrcyA9IGF4aXMub3B0aW9ucy50aWNrcywgdGlja3MgPSBbXTtcbiAgICAgICAgICAgIGlmIChvdGlja3MgPT0gbnVsbCB8fCAodHlwZW9mIG90aWNrcyA9PSBcIm51bWJlclwiICYmIG90aWNrcyA+IDApKVxuICAgICAgICAgICAgICAgIHRpY2tzID0gYXhpcy50aWNrR2VuZXJhdG9yKGF4aXMpO1xuICAgICAgICAgICAgZWxzZSBpZiAob3RpY2tzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvdGlja3MpKVxuICAgICAgICAgICAgICAgICAgICAvLyBnZW5lcmF0ZSB0aGUgdGlja3NcbiAgICAgICAgICAgICAgICAgICAgdGlja3MgPSBvdGlja3MoYXhpcyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aWNrcyA9IG90aWNrcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2xlYW4gdXAvbGFiZWxpZnkgdGhlIHN1cHBsaWVkIHRpY2tzLCBjb3B5IHRoZW0gb3ZlclxuICAgICAgICAgICAgdmFyIGksIHY7XG4gICAgICAgICAgICBheGlzLnRpY2tzID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGlja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciB0ID0gdGlja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0ID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdiA9ICt0WzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodC5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSB0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHYgPSArdDtcbiAgICAgICAgICAgICAgICBpZiAobGFiZWwgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBheGlzLnRpY2tGb3JtYXR0ZXIodiwgYXhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTih2KSlcbiAgICAgICAgICAgICAgICAgICAgYXhpcy50aWNrcy5wdXNoKHsgdjogdiwgbGFiZWw6IGxhYmVsIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc25hcFJhbmdlVG9UaWNrcyhheGlzLCB0aWNrcykge1xuICAgICAgICAgICAgaWYgKGF4aXMub3B0aW9ucy5hdXRvc2NhbGVNYXJnaW4gJiYgdGlja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIHNuYXAgdG8gdGlja3NcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5vcHRpb25zLm1pbiA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBheGlzLm1pbiA9IE1hdGgubWluKGF4aXMubWluLCB0aWNrc1swXS52KTtcbiAgICAgICAgICAgICAgICBpZiAoYXhpcy5vcHRpb25zLm1heCA9PSBudWxsICYmIHRpY2tzLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgICAgIGF4aXMubWF4ID0gTWF0aC5tYXgoYXhpcy5tYXgsIHRpY2tzW3RpY2tzLmxlbmd0aCAtIDFdLnYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhdygpIHtcblxuICAgICAgICAgICAgc3VyZmFjZS5jbGVhcigpO1xuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MuZHJhd0JhY2tncm91bmQsIFtjdHhdKTtcblxuICAgICAgICAgICAgdmFyIGdyaWQgPSBvcHRpb25zLmdyaWQ7XG5cbiAgICAgICAgICAgIC8vIGRyYXcgYmFja2dyb3VuZCwgaWYgYW55XG4gICAgICAgICAgICBpZiAoZ3JpZC5zaG93ICYmIGdyaWQuYmFja2dyb3VuZENvbG9yKVxuICAgICAgICAgICAgICAgIGRyYXdCYWNrZ3JvdW5kKCk7XG5cbiAgICAgICAgICAgIGlmIChncmlkLnNob3cgJiYgIWdyaWQuYWJvdmVEYXRhKSB7XG4gICAgICAgICAgICAgICAgZHJhd0dyaWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MuZHJhd1NlcmllcywgW2N0eCwgc2VyaWVzW2ldXSk7XG4gICAgICAgICAgICAgICAgZHJhd1NlcmllcyhzZXJpZXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleGVjdXRlSG9va3MoaG9va3MuZHJhdywgW2N0eF0pO1xuXG4gICAgICAgICAgICBpZiAoZ3JpZC5zaG93ICYmIGdyaWQuYWJvdmVEYXRhKSB7XG4gICAgICAgICAgICAgICAgZHJhd0dyaWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3VyZmFjZS5yZW5kZXIoKTtcblxuICAgICAgICAgICAgLy8gQSBkcmF3IGltcGxpZXMgdGhhdCBlaXRoZXIgdGhlIGF4ZXMgb3IgZGF0YSBoYXZlIGNoYW5nZWQsIHNvIHdlXG4gICAgICAgICAgICAvLyBzaG91bGQgcHJvYmFibHkgdXBkYXRlIHRoZSBvdmVybGF5IGhpZ2hsaWdodHMgYXMgd2VsbC5cblxuICAgICAgICAgICAgdHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4dHJhY3RSYW5nZShyYW5nZXMsIGNvb3JkKSB7XG4gICAgICAgICAgICB2YXIgYXhpcywgZnJvbSwgdG8sIGtleSwgYXhlcyA9IGFsbEF4ZXMoKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBheGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgYXhpcyA9IGF4ZXNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IGNvb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGNvb3JkICsgYXhpcy5uICsgXCJheGlzXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmFuZ2VzW2tleV0gJiYgYXhpcy5uID09IDEpXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBjb29yZCArIFwiYXhpc1wiOyAvLyBzdXBwb3J0IHgxYXhpcyBhcyB4YXhpc1xuICAgICAgICAgICAgICAgICAgICBpZiAocmFuZ2VzW2tleV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gPSByYW5nZXNba2V5XS5mcm9tO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG8gPSByYW5nZXNba2V5XS50bztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMtY29tcGF0IHN0dWZmIC0gdG8gYmUgcmVtb3ZlZCBpbiBmdXR1cmVcbiAgICAgICAgICAgIGlmICghcmFuZ2VzW2tleV0pIHtcbiAgICAgICAgICAgICAgICBheGlzID0gY29vcmQgPT0gXCJ4XCIgPyB4YXhlc1swXSA6IHlheGVzWzBdO1xuICAgICAgICAgICAgICAgIGZyb20gPSByYW5nZXNbY29vcmQgKyBcIjFcIl07XG4gICAgICAgICAgICAgICAgdG8gPSByYW5nZXNbY29vcmQgKyBcIjJcIl07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGF1dG8tcmV2ZXJzZSBhcyBhbiBhZGRlZCBib251c1xuICAgICAgICAgICAgaWYgKGZyb20gIT0gbnVsbCAmJiB0byAhPSBudWxsICYmIGZyb20gPiB0bykge1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSBmcm9tO1xuICAgICAgICAgICAgICAgIGZyb20gPSB0bztcbiAgICAgICAgICAgICAgICB0byA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHsgZnJvbTogZnJvbSwgdG86IHRvLCBheGlzOiBheGlzIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3QmFja2dyb3VuZCgpIHtcbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHBsb3RPZmZzZXQubGVmdCwgcGxvdE9mZnNldC50b3ApO1xuXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gZ2V0Q29sb3JPckdyYWRpZW50KG9wdGlvbnMuZ3JpZC5iYWNrZ3JvdW5kQ29sb3IsIHBsb3RIZWlnaHQsIDAsIFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwKVwiKTtcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBwbG90V2lkdGgsIHBsb3RIZWlnaHQpO1xuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdHcmlkKCkge1xuICAgICAgICAgICAgdmFyIGksIGF4ZXMsIGJ3LCBiYztcblxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocGxvdE9mZnNldC5sZWZ0LCBwbG90T2Zmc2V0LnRvcCk7XG5cbiAgICAgICAgICAgIC8vIGRyYXcgbWFya2luZ3NcbiAgICAgICAgICAgIHZhciBtYXJraW5ncyA9IG9wdGlvbnMuZ3JpZC5tYXJraW5ncztcbiAgICAgICAgICAgIGlmIChtYXJraW5ncykge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24obWFya2luZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGF4ZXMgPSBwbG90LmdldEF4ZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8geG1pbiBldGMuIGlzIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LCB0byBiZVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgICAgICAgICAgICAgYXhlcy54bWluID0gYXhlcy54YXhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIGF4ZXMueG1heCA9IGF4ZXMueGF4aXMubWF4O1xuICAgICAgICAgICAgICAgICAgICBheGVzLnltaW4gPSBheGVzLnlheGlzLm1pbjtcbiAgICAgICAgICAgICAgICAgICAgYXhlcy55bWF4ID0gYXhlcy55YXhpcy5tYXg7XG5cbiAgICAgICAgICAgICAgICAgICAgbWFya2luZ3MgPSBtYXJraW5ncyhheGVzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWFya2luZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBtYXJraW5nc1tpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhyYW5nZSA9IGV4dHJhY3RSYW5nZShtLCBcInhcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICB5cmFuZ2UgPSBleHRyYWN0UmFuZ2UobSwgXCJ5XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbGwgaW4gbWlzc2luZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoeHJhbmdlLmZyb20gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHhyYW5nZS5mcm9tID0geHJhbmdlLmF4aXMubWluO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeHJhbmdlLnRvID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICB4cmFuZ2UudG8gPSB4cmFuZ2UuYXhpcy5tYXg7XG4gICAgICAgICAgICAgICAgICAgIGlmICh5cmFuZ2UuZnJvbSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgeXJhbmdlLmZyb20gPSB5cmFuZ2UuYXhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIGlmICh5cmFuZ2UudG8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHlyYW5nZS50byA9IHlyYW5nZS5heGlzLm1heDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwXG4gICAgICAgICAgICAgICAgICAgIGlmICh4cmFuZ2UudG8gPCB4cmFuZ2UuYXhpcy5taW4gfHwgeHJhbmdlLmZyb20gPiB4cmFuZ2UuYXhpcy5tYXggfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHlyYW5nZS50byA8IHlyYW5nZS5heGlzLm1pbiB8fCB5cmFuZ2UuZnJvbSA+IHlyYW5nZS5heGlzLm1heClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHhyYW5nZS5mcm9tID0gTWF0aC5tYXgoeHJhbmdlLmZyb20sIHhyYW5nZS5heGlzLm1pbik7XG4gICAgICAgICAgICAgICAgICAgIHhyYW5nZS50byA9IE1hdGgubWluKHhyYW5nZS50bywgeHJhbmdlLmF4aXMubWF4KTtcbiAgICAgICAgICAgICAgICAgICAgeXJhbmdlLmZyb20gPSBNYXRoLm1heCh5cmFuZ2UuZnJvbSwgeXJhbmdlLmF4aXMubWluKTtcbiAgICAgICAgICAgICAgICAgICAgeXJhbmdlLnRvID0gTWF0aC5taW4oeXJhbmdlLnRvLCB5cmFuZ2UuYXhpcy5tYXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB4ZXF1YWwgPSB4cmFuZ2UuZnJvbSA9PT0geHJhbmdlLnRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgeWVxdWFsID0geXJhbmdlLmZyb20gPT09IHlyYW5nZS50bztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoeGVxdWFsICYmIHllcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIGRyYXdcbiAgICAgICAgICAgICAgICAgICAgeHJhbmdlLmZyb20gPSBNYXRoLmZsb29yKHhyYW5nZS5heGlzLnAyYyh4cmFuZ2UuZnJvbSkpO1xuICAgICAgICAgICAgICAgICAgICB4cmFuZ2UudG8gPSBNYXRoLmZsb29yKHhyYW5nZS5heGlzLnAyYyh4cmFuZ2UudG8pKTtcbiAgICAgICAgICAgICAgICAgICAgeXJhbmdlLmZyb20gPSBNYXRoLmZsb29yKHlyYW5nZS5heGlzLnAyYyh5cmFuZ2UuZnJvbSkpO1xuICAgICAgICAgICAgICAgICAgICB5cmFuZ2UudG8gPSBNYXRoLmZsb29yKHlyYW5nZS5heGlzLnAyYyh5cmFuZ2UudG8pKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoeGVxdWFsIHx8IHllcXVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmVXaWR0aCA9IG0ubGluZVdpZHRoIHx8IG9wdGlvbnMuZ3JpZC5tYXJraW5nc0xpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJQaXhlbCA9IGxpbmVXaWR0aCAlIDIgPyAwLjUgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbS5jb2xvciB8fCBvcHRpb25zLmdyaWQubWFya2luZ3NDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeGVxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4cmFuZ2UudG8gKyBzdWJQaXhlbCwgeXJhbmdlLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeHJhbmdlLnRvICsgc3ViUGl4ZWwsIHlyYW5nZS50byk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeHJhbmdlLmZyb20sIHlyYW5nZS50byArIHN1YlBpeGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHhyYW5nZS50bywgeXJhbmdlLnRvICsgc3ViUGl4ZWwpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBtLmNvbG9yIHx8IG9wdGlvbnMuZ3JpZC5tYXJraW5nc0NvbG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHhyYW5nZS5mcm9tLCB5cmFuZ2UudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeHJhbmdlLnRvIC0geHJhbmdlLmZyb20sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeXJhbmdlLmZyb20gLSB5cmFuZ2UudG8pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkcmF3IHRoZSB0aWNrc1xuICAgICAgICAgICAgYXhlcyA9IGFsbEF4ZXMoKTtcbiAgICAgICAgICAgIGJ3ID0gb3B0aW9ucy5ncmlkLmJvcmRlcldpZHRoO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGF4ZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICB2YXIgYXhpcyA9IGF4ZXNbal0sIGJveCA9IGF4aXMuYm94LFxuICAgICAgICAgICAgICAgICAgICB0ID0gYXhpcy50aWNrTGVuZ3RoLCB4LCB5LCB4b2ZmLCB5b2ZmO1xuICAgICAgICAgICAgICAgIGlmICghYXhpcy5zaG93IHx8IGF4aXMudGlja3MubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XG5cbiAgICAgICAgICAgICAgICAvLyBmaW5kIHRoZSBlZGdlc1xuICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICB4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gXCJmdWxsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gKGF4aXMucG9zaXRpb24gPT0gXCJ0b3BcIiA/IDAgOiBwbG90SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IGJveC50b3AgLSBwbG90T2Zmc2V0LnRvcCArIChheGlzLnBvc2l0aW9uID09IFwidG9wXCIgPyBib3guaGVpZ2h0IDogMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gXCJmdWxsXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gKGF4aXMucG9zaXRpb24gPT0gXCJsZWZ0XCIgPyAwIDogcGxvdFdpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IGJveC5sZWZ0IC0gcGxvdE9mZnNldC5sZWZ0ICsgKGF4aXMucG9zaXRpb24gPT0gXCJsZWZ0XCIgPyBib3gud2lkdGggOiAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBkcmF3IHRpY2sgYmFyXG4gICAgICAgICAgICAgICAgaWYgKCFheGlzLmlubmVybW9zdCkge1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBheGlzLm9wdGlvbnMuY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgeG9mZiA9IHlvZmYgPSAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB4b2ZmID0gcGxvdFdpZHRoICsgMTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgeW9mZiA9IHBsb3RIZWlnaHQgKyAxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdHgubGluZVdpZHRoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBNYXRoLmZsb29yKHkpICsgMC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4ID0gTWF0aC5mbG9vcih4KSArIDAuNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oeCArIHhvZmYsIHkgKyB5b2ZmKTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgdGlja3NcblxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGF4aXMub3B0aW9ucy50aWNrQ29sb3I7XG5cbiAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGF4aXMudGlja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHYgPSBheGlzLnRpY2tzW2ldLnY7XG5cbiAgICAgICAgICAgICAgICAgICAgeG9mZiA9IHlvZmYgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTih2KSB8fCB2IDwgYXhpcy5taW4gfHwgdiA+IGF4aXMubWF4XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBza2lwIHRob3NlIGx5aW5nIG9uIHRoZSBheGVzIGlmIHdlIGdvdCBhIGJvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKHQgPT0gXCJmdWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoKHR5cGVvZiBidyA9PSBcIm9iamVjdFwiICYmIGJ3W2F4aXMucG9zaXRpb25dID4gMCkgfHwgYncgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICh2ID09IGF4aXMubWluIHx8IHYgPT0gYXhpcy5tYXgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChheGlzLmRpcmVjdGlvbiA9PSBcInhcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgeCA9IGF4aXMucDJjKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeW9mZiA9IHQgPT0gXCJmdWxsXCIgPyAtcGxvdEhlaWdodCA6IHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzLnBvc2l0aW9uID09IFwidG9wXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeW9mZiA9IC15b2ZmO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgeSA9IGF4aXMucDJjKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeG9mZiA9IHQgPT0gXCJmdWxsXCIgPyAtcGxvdFdpZHRoIDogdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMucG9zaXRpb24gPT0gXCJsZWZ0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeG9mZiA9IC14b2ZmO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN0eC5saW5lV2lkdGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF4aXMuZGlyZWN0aW9uID09IFwieFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBNYXRoLmZsb29yKHgpICsgMC41O1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBNYXRoLmZsb29yKHkpICsgMC41O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyh4LCB5KTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyh4ICsgeG9mZiwgeSArIHlvZmYpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBkcmF3IGJvcmRlclxuICAgICAgICAgICAgaWYgKGJ3KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgZWl0aGVyIGJvcmRlcldpZHRoIG9yIGJvcmRlckNvbG9yIGlzIGFuIG9iamVjdCwgdGhlbiBkcmF3IHRoZSBib3JkZXJcbiAgICAgICAgICAgICAgICAvLyBsaW5lIGJ5IGxpbmUgaW5zdGVhZCBvZiBhcyBvbmUgcmVjdGFuZ2xlXG4gICAgICAgICAgICAgICAgYmMgPSBvcHRpb25zLmdyaWQuYm9yZGVyQ29sb3I7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGJ3ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGJjID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBidyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYncgPSB7dG9wOiBidywgcmlnaHQ6IGJ3LCBib3R0b206IGJ3LCBsZWZ0OiBid307XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiYyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmMgPSB7dG9wOiBiYywgcmlnaHQ6IGJjLCBib3R0b206IGJjLCBsZWZ0OiBiY307XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYncudG9wID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYmMudG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGJ3LnRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oMCAtIGJ3LmxlZnQsIDAgLSBidy50b3AvMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKHBsb3RXaWR0aCwgMCAtIGJ3LnRvcC8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChidy5yaWdodCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGJjLnJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGJ3LnJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbyhwbG90V2lkdGggKyBidy5yaWdodCAvIDIsIDAgLSBidy50b3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhwbG90V2lkdGggKyBidy5yaWdodCAvIDIsIHBsb3RIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ3LmJvdHRvbSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGJjLmJvdHRvbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBidy5ib3R0b207XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKHBsb3RXaWR0aCArIGJ3LnJpZ2h0LCBwbG90SGVpZ2h0ICsgYncuYm90dG9tIC8gMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKDAsIHBsb3RIZWlnaHQgKyBidy5ib3R0b20gLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChidy5sZWZ0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gYmMubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBidy5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4Lm1vdmVUbygwIC0gYncubGVmdC8yLCBwbG90SGVpZ2h0ICsgYncuYm90dG9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oMC0gYncubGVmdC8yLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IGJ3O1xuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBvcHRpb25zLmdyaWQuYm9yZGVyQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VSZWN0KC1idy8yLCAtYncvMiwgcGxvdFdpZHRoICsgYncsIHBsb3RIZWlnaHQgKyBidyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd0F4aXNMYWJlbHMoKSB7XG5cbiAgICAgICAgICAgICQuZWFjaChhbGxBeGVzKCksIGZ1bmN0aW9uIChfLCBheGlzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJveCA9IGF4aXMuYm94LFxuICAgICAgICAgICAgICAgICAgICBsZWdhY3lTdHlsZXMgPSBheGlzLmRpcmVjdGlvbiArIFwiQXhpcyBcIiArIGF4aXMuZGlyZWN0aW9uICsgYXhpcy5uICsgXCJBeGlzXCIsXG4gICAgICAgICAgICAgICAgICAgIGxheWVyID0gXCJmbG90LVwiICsgYXhpcy5kaXJlY3Rpb24gKyBcIi1heGlzIGZsb3QtXCIgKyBheGlzLmRpcmVjdGlvbiArIGF4aXMubiArIFwiLWF4aXMgXCIgKyBsZWdhY3lTdHlsZXMsXG4gICAgICAgICAgICAgICAgICAgIGZvbnQgPSBheGlzLm9wdGlvbnMuZm9udCB8fCBcImZsb3QtdGljay1sYWJlbCB0aWNrTGFiZWxcIixcbiAgICAgICAgICAgICAgICAgICAgdGljaywgeCwgeSwgaGFsaWduLCB2YWxpZ247XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGV4dCBiZWZvcmUgY2hlY2tpbmcgZm9yIGF4aXMuc2hvdyBhbmQgdGlja3MubGVuZ3RoO1xuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBwbHVnaW5zLCBsaWtlIGZsb3QtdGlja3JvdG9yLCB0aGF0IGRyYXcgdGhlaXIgb3duXG4gICAgICAgICAgICAgICAgLy8gdGljayBsYWJlbHMgd2lsbCBlbmQgdXAgd2l0aCBib3RoIHRoZWlycyBhbmQgdGhlIGRlZmF1bHRzLlxuXG4gICAgICAgICAgICAgICAgc3VyZmFjZS5yZW1vdmVUZXh0KGxheWVyKTtcblxuICAgICAgICAgICAgICAgIGlmICghYXhpcy5zaG93IHx8IGF4aXMudGlja3MubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXhpcy50aWNrcy5sZW5ndGg7ICsraSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHRpY2sgPSBheGlzLnRpY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRpY2subGFiZWwgfHwgdGljay52IDwgYXhpcy5taW4gfHwgdGljay52ID4gYXhpcy5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5kaXJlY3Rpb24gPT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB4ID0gcGxvdE9mZnNldC5sZWZ0ICsgYXhpcy5wMmModGljay52KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChheGlzLnBvc2l0aW9uID09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID0gYm94LnRvcCArIGJveC5wYWRkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ID0gYm94LnRvcCArIGJveC5oZWlnaHQgLSBib3gucGFkZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZ24gPSBcImJvdHRvbVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWduID0gXCJtaWRkbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBwbG90T2Zmc2V0LnRvcCArIGF4aXMucDJjKHRpY2sudik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXhpcy5wb3NpdGlvbiA9PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPSBib3gubGVmdCArIGJveC53aWR0aCAtIGJveC5wYWRkaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbGlnbiA9IFwicmlnaHRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9IGJveC5sZWZ0ICsgYm94LnBhZGRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdXJmYWNlLmFkZFRleHQobGF5ZXIsIHgsIHksIHRpY2subGFiZWwsIGZvbnQsIG51bGwsIG51bGwsIGhhbGlnbiwgdmFsaWduKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdTZXJpZXMoc2VyaWVzKSB7XG4gICAgICAgICAgICBpZiAoc2VyaWVzLmxpbmVzLnNob3cpXG4gICAgICAgICAgICAgICAgZHJhd1Nlcmllc0xpbmVzKHNlcmllcyk7XG4gICAgICAgICAgICBpZiAoc2VyaWVzLmJhcnMuc2hvdylcbiAgICAgICAgICAgICAgICBkcmF3U2VyaWVzQmFycyhzZXJpZXMpO1xuICAgICAgICAgICAgaWYgKHNlcmllcy5wb2ludHMuc2hvdylcbiAgICAgICAgICAgICAgICBkcmF3U2VyaWVzUG9pbnRzKHNlcmllcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3U2VyaWVzTGluZXMoc2VyaWVzKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBwbG90TGluZShkYXRhcG9pbnRzLCB4b2Zmc2V0LCB5b2Zmc2V0LCBheGlzeCwgYXhpc3kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gZGF0YXBvaW50cy5wb2ludHMsXG4gICAgICAgICAgICAgICAgICAgIHBzID0gZGF0YXBvaW50cy5wb2ludHNpemUsXG4gICAgICAgICAgICAgICAgICAgIHByZXZ4ID0gbnVsbCwgcHJldnkgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBwczsgaSA8IHBvaW50cy5sZW5ndGg7IGkgKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHgxID0gcG9pbnRzW2kgLSBwc10sIHkxID0gcG9pbnRzW2kgLSBwcyArIDFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBwb2ludHNbaV0sIHkyID0gcG9pbnRzW2kgKyAxXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPT0gbnVsbCB8fCB4MiA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHltaW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHkxIDw9IHkyICYmIHkxIDwgYXhpc3kubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeTIgPCBheGlzeS5taW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7ICAgLy8gbGluZSBzZWdtZW50IGlzIG91dHNpZGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgbmV3IGludGVyc2VjdGlvbiBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSAoYXhpc3kubWluIC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IGF4aXN5Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh5MiA8PSB5MSAmJiB5MiA8IGF4aXN5Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkxIDwgYXhpc3kubWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSAoYXhpc3kubWluIC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGF4aXN5Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB5bWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICh5MSA+PSB5MiAmJiB5MSA+IGF4aXN5Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkyID4gYXhpc3kubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSAoYXhpc3kubWF4IC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IGF4aXN5Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh5MiA+PSB5MSAmJiB5MiA+IGF4aXN5Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHkxID4gYXhpc3kubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSAoYXhpc3kubWF4IC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGF4aXN5Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB4bWluXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSA8PSB4MiAmJiB4MSA8IGF4aXN4Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgyIDwgYXhpc3gubWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSAoYXhpc3gubWluIC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGF4aXN4Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh4MiA8PSB4MSAmJiB4MiA8IGF4aXN4Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgxIDwgYXhpc3gubWluKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSAoYXhpc3gubWluIC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGF4aXN4Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsaXAgd2l0aCB4bWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSA+PSB4MiAmJiB4MSA+IGF4aXN4Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgyID4gYXhpc3gubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTEgPSAoYXhpc3gubWF4IC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IGF4aXN4Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh4MiA+PSB4MSAmJiB4MiA+IGF4aXN4Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHgxID4gYXhpc3gubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSAoYXhpc3gubWF4IC0geDEpIC8gKHgyIC0geDEpICogKHkyIC0geTEpICsgeTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MiA9IGF4aXN4Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSAhPSBwcmV2eCB8fCB5MSAhPSBwcmV2eSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oYXhpc3gucDJjKHgxKSArIHhvZmZzZXQsIGF4aXN5LnAyYyh5MSkgKyB5b2Zmc2V0KTtcblxuICAgICAgICAgICAgICAgICAgICBwcmV2eCA9IHgyO1xuICAgICAgICAgICAgICAgICAgICBwcmV2eSA9IHkyO1xuICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MikgKyB4b2Zmc2V0LCBheGlzeS5wMmMoeTIpICsgeW9mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcGxvdExpbmVBcmVhKGRhdGFwb2ludHMsIGF4aXN4LCBheGlzeSkge1xuICAgICAgICAgICAgICAgIHZhciBwb2ludHMgPSBkYXRhcG9pbnRzLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgcHMgPSBkYXRhcG9pbnRzLnBvaW50c2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgYXhpc3kubWluKSwgYXhpc3kubWF4KSxcbiAgICAgICAgICAgICAgICAgICAgaSA9IDAsIHRvcCwgYXJlYU9wZW4gPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgeXBvcyA9IDEsIHNlZ21lbnRTdGFydCA9IDAsIHNlZ21lbnRFbmQgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy8gd2UgcHJvY2VzcyBlYWNoIHNlZ21lbnQgaW4gdHdvIHR1cm5zLCBmaXJzdCBmb3J3YXJkXG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0aW9uIHRvIHNrZXRjaCBvdXQgdG9wLCB0aGVuIG9uY2Ugd2UgaGl0IHRoZVxuICAgICAgICAgICAgICAgIC8vIGVuZCB3ZSBnbyBiYWNrd2FyZHMgdG8gc2tldGNoIHRoZSBib3R0b21cbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHMgPiAwICYmIGkgPiBwb2ludHMubGVuZ3RoICsgcHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBpICs9IHBzOyAvLyBwcyBpcyBuZWdhdGl2ZSBpZiBnb2luZyBiYWNrd2FyZHNcblxuICAgICAgICAgICAgICAgICAgICB2YXIgeDEgPSBwb2ludHNbaSAtIHBzXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gcG9pbnRzW2kgLSBwcyArIHlwb3NdLFxuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSBwb2ludHNbaV0sIHkyID0gcG9pbnRzW2kgKyB5cG9zXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJlYU9wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcyA+IDAgJiYgeDEgIT0gbnVsbCAmJiB4MiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXQgdHVybmluZyBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZ21lbnRFbmQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBzID0gLXBzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlwb3MgPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHMgPCAwICYmIGkgPT0gc2VnbWVudFN0YXJ0ICsgcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkb25lIHdpdGggdGhlIHJldmVyc2Ugc3dlZXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFPcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHMgPSAtcHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeXBvcyA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IHNlZ21lbnRTdGFydCA9IHNlZ21lbnRFbmQgKyBwcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSA9PSBudWxsIHx8IHgyID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHggdmFsdWVzXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHhtaW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxIDw9IHgyICYmIHgxIDwgYXhpc3gubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDIgPCBheGlzeC5taW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IChheGlzeC5taW4gLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gYXhpc3gubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHgyIDw9IHgxICYmIHgyIDwgYXhpc3gubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPCBheGlzeC5taW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IChheGlzeC5taW4gLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gYXhpc3gubWluO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHhtYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKHgxID49IHgyICYmIHgxID4gYXhpc3gubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDIgPiBheGlzeC5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IChheGlzeC5tYXggLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgxID0gYXhpc3gubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHgyID49IHgxICYmIHgyID4gYXhpc3gubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeDEgPiBheGlzeC5tYXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IChheGlzeC5tYXggLSB4MSkgLyAoeDIgLSB4MSkgKiAoeTIgLSB5MSkgKyB5MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gYXhpc3gubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcmVhT3Blbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3BlbiBhcmVhXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubW92ZVRvKGF4aXN4LnAyYyh4MSksIGF4aXN5LnAyYyhib3R0b20pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWFPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdyBmaXJzdCBjaGVjayB0aGUgY2FzZSB3aGVyZSBib3RoIGlzIG91dHNpZGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkxID49IGF4aXN5Lm1heCAmJiB5MiA+PSBheGlzeS5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgxKSwgYXhpc3kucDJjKGF4aXN5Lm1heCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDIpLCBheGlzeS5wMmMoYXhpc3kubWF4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh5MSA8PSBheGlzeS5taW4gJiYgeTIgPD0gYXhpc3kubWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MSksIGF4aXN5LnAyYyhheGlzeS5taW4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgyKSwgYXhpc3kucDJjKGF4aXN5Lm1pbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGl0J3MgYSBiaXQgbW9yZSBjb21wbGljYXRlZCwgdGhlcmUgbWlnaHRcbiAgICAgICAgICAgICAgICAgICAgLy8gYmUgYSBmbGF0IG1heGVkIG91dCByZWN0YW5nbGUgZmlyc3QsIHRoZW4gYVxuICAgICAgICAgICAgICAgICAgICAvLyB0cmlhbmd1bGFyIGN1dG91dCBvciByZXZlcnNlOyB0byBmaW5kIHRoZXNlXG4gICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGN1cnJlbnQgeCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgdmFyIHgxb2xkID0geDEsIHgyb2xkID0geDI7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB0aGUgeSB2YWx1ZXMsIHdpdGhvdXQgc2hvcnRjdXR0aW5nLCB3ZVxuICAgICAgICAgICAgICAgICAgICAvLyBnbyB0aHJvdWdoIGFsbCBjYXNlcyBpbiB0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY2xpcCB3aXRoIHltaW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHkxIDw9IHkyICYmIHkxIDwgYXhpc3kubWluICYmIHkyID49IGF4aXN5Lm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDEgPSAoYXhpc3kubWluIC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MSA9IGF4aXN5Lm1pbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh5MiA8PSB5MSAmJiB5MiA8IGF4aXN5Lm1pbiAmJiB5MSA+PSBheGlzeS5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgyID0gKGF4aXN5Lm1pbiAtIHkxKSAvICh5MiAtIHkxKSAqICh4MiAtIHgxKSArIHgxO1xuICAgICAgICAgICAgICAgICAgICAgICAgeTIgPSBheGlzeS5taW47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBjbGlwIHdpdGggeW1heFxuICAgICAgICAgICAgICAgICAgICBpZiAoeTEgPj0geTIgJiYgeTEgPiBheGlzeS5tYXggJiYgeTIgPD0gYXhpc3kubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4MSA9IChheGlzeS5tYXggLSB5MSkgLyAoeTIgLSB5MSkgKiAoeDIgLSB4MSkgKyB4MTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkxID0gYXhpc3kubWF4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHkyID49IHkxICYmIHkyID4gYXhpc3kubWF4ICYmIHkxIDw9IGF4aXN5Lm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDIgPSAoYXhpc3kubWF4IC0geTEpIC8gKHkyIC0geTEpICogKHgyIC0geDEpICsgeDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB5MiA9IGF4aXN5Lm1heDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB4IHZhbHVlIHdhcyBjaGFuZ2VkIHdlIGdvdCBhIHJlY3RhbmdsZVxuICAgICAgICAgICAgICAgICAgICAvLyB0byBmaWxsXG4gICAgICAgICAgICAgICAgICAgIGlmICh4MSAhPSB4MW9sZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDFvbGQpLCBheGlzeS5wMmMoeTEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGdvZXMgdG8gKHgxLCB5MSksIGJ1dCB3ZSBmaWxsIHRoYXQgYmVsb3dcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbGwgdHJpYW5ndWxhciBzZWN0aW9uLCB0aGlzIHNvbWV0aW1lcyByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gcmVkdW5kYW50IHBvaW50cyBpZiAoeDEsIHkxKSBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICAgICAgICAgICAgICAvLyBmcm9tIHByZXZpb3VzIGxpbmUgdG8sIGJ1dCB3ZSBqdXN0IGlnbm9yZSB0aGF0XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgxKSwgYXhpc3kucDJjKHkxKSk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oYXhpc3gucDJjKHgyKSwgYXhpc3kucDJjKHkyKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZmlsbCB0aGUgb3RoZXIgcmVjdGFuZ2xlIGlmIGl0J3MgdGhlcmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHgyICE9IHgyb2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHgubGluZVRvKGF4aXN4LnAyYyh4MiksIGF4aXN5LnAyYyh5MikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmxpbmVUbyhheGlzeC5wMmMoeDJvbGQpLCBheGlzeS5wMmMoeTIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocGxvdE9mZnNldC5sZWZ0LCBwbG90T2Zmc2V0LnRvcCk7XG4gICAgICAgICAgICBjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICAgICAgICAgIHZhciBsdyA9IHNlcmllcy5saW5lcy5saW5lV2lkdGgsXG4gICAgICAgICAgICAgICAgc3cgPSBzZXJpZXMuc2hhZG93U2l6ZTtcbiAgICAgICAgICAgIC8vIEZJWE1FOiBjb25zaWRlciBhbm90aGVyIGZvcm0gb2Ygc2hhZG93IHdoZW4gZmlsbGluZyBpcyB0dXJuZWQgb25cbiAgICAgICAgICAgIGlmIChsdyA+IDAgJiYgc3cgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gZHJhdyBzaGFkb3cgYXMgYSB0aGljayBhbmQgdGhpbiBsaW5lIHdpdGggdHJhbnNwYXJlbmN5XG4gICAgICAgICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHN3O1xuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgwLDAsMCwwLjEpXCI7XG4gICAgICAgICAgICAgICAgLy8gcG9zaXRpb24gc2hhZG93IGF0IGFuZ2xlIGZyb20gdGhlIG1pZCBvZiBsaW5lXG4gICAgICAgICAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5QSS8xODtcbiAgICAgICAgICAgICAgICBwbG90TGluZShzZXJpZXMuZGF0YXBvaW50cywgTWF0aC5zaW4oYW5nbGUpICogKGx3LzIgKyBzdy8yKSwgTWF0aC5jb3MoYW5nbGUpICogKGx3LzIgKyBzdy8yKSwgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMpO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBzdy8yO1xuICAgICAgICAgICAgICAgIHBsb3RMaW5lKHNlcmllcy5kYXRhcG9pbnRzLCBNYXRoLnNpbihhbmdsZSkgKiAobHcvMiArIHN3LzQpLCBNYXRoLmNvcyhhbmdsZSkgKiAobHcvMiArIHN3LzQpLCBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBsdztcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHNlcmllcy5jb2xvcjtcbiAgICAgICAgICAgIHZhciBmaWxsU3R5bGUgPSBnZXRGaWxsU3R5bGUoc2VyaWVzLmxpbmVzLCBzZXJpZXMuY29sb3IsIDAsIHBsb3RIZWlnaHQpO1xuICAgICAgICAgICAgaWYgKGZpbGxTdHlsZSkge1xuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsU3R5bGU7XG4gICAgICAgICAgICAgICAgcGxvdExpbmVBcmVhKHNlcmllcy5kYXRhcG9pbnRzLCBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsdyA+IDApXG4gICAgICAgICAgICAgICAgcGxvdExpbmUoc2VyaWVzLmRhdGFwb2ludHMsIDAsIDAsIHNlcmllcy54YXhpcywgc2VyaWVzLnlheGlzKTtcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3U2VyaWVzUG9pbnRzKHNlcmllcykge1xuICAgICAgICAgICAgZnVuY3Rpb24gcGxvdFBvaW50cyhkYXRhcG9pbnRzLCByYWRpdXMsIGZpbGxTdHlsZSwgb2Zmc2V0LCBzaGFkb3csIGF4aXN4LCBheGlzeSwgc3ltYm9sKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBvaW50cyA9IGRhdGFwb2ludHMucG9pbnRzLCBwcyA9IGRhdGFwb2ludHMucG9pbnRzaXplO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gcG9pbnRzW2ldLCB5ID0gcG9pbnRzW2kgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gbnVsbCB8fCB4IDwgYXhpc3gubWluIHx8IHggPiBheGlzeC5tYXggfHwgeSA8IGF4aXN5Lm1pbiB8fCB5ID4gYXhpc3kubWF4KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgICAgICB4ID0gYXhpc3gucDJjKHgpO1xuICAgICAgICAgICAgICAgICAgICB5ID0gYXhpc3kucDJjKHkpICsgb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3ltYm9sID09IFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYXJjKHgsIHksIHJhZGl1cywgMCwgc2hhZG93ID8gTWF0aC5QSSA6IE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bWJvbChjdHgsIHgsIHksIHJhZGl1cywgc2hhZG93KTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxsU3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmaWxsU3R5bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHBsb3RPZmZzZXQubGVmdCwgcGxvdE9mZnNldC50b3ApO1xuXG4gICAgICAgICAgICB2YXIgbHcgPSBzZXJpZXMucG9pbnRzLmxpbmVXaWR0aCxcbiAgICAgICAgICAgICAgICBzdyA9IHNlcmllcy5zaGFkb3dTaXplLFxuICAgICAgICAgICAgICAgIHJhZGl1cyA9IHNlcmllcy5wb2ludHMucmFkaXVzLFxuICAgICAgICAgICAgICAgIHN5bWJvbCA9IHNlcmllcy5wb2ludHMuc3ltYm9sO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBzZXRzIHRoZSBsaW5lIHdpZHRoIHRvIDAsIHdlIGNoYW5nZSBpdCB0byBhIHZlcnkgXG4gICAgICAgICAgICAvLyBzbWFsbCB2YWx1ZS4gQSBsaW5lIHdpZHRoIG9mIDAgc2VlbXMgdG8gZm9yY2UgdGhlIGRlZmF1bHQgb2YgMS5cbiAgICAgICAgICAgIC8vIERvaW5nIHRoZSBjb25kaXRpb25hbCBoZXJlIGFsbG93cyB0aGUgc2hhZG93IHNldHRpbmcgdG8gc3RpbGwgYmUgXG4gICAgICAgICAgICAvLyBvcHRpb25hbCBldmVuIHdpdGggYSBsaW5lV2lkdGggb2YgMC5cblxuICAgICAgICAgICAgaWYoIGx3ID09IDAgKVxuICAgICAgICAgICAgICAgIGx3ID0gMC4wMDAxO1xuXG4gICAgICAgICAgICBpZiAobHcgPiAwICYmIHN3ID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIGRyYXcgc2hhZG93IGluIHR3byBzdGVwc1xuICAgICAgICAgICAgICAgIHZhciB3ID0gc3cgLyAyO1xuICAgICAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSB3O1xuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSgwLDAsMCwwLjEpXCI7XG4gICAgICAgICAgICAgICAgcGxvdFBvaW50cyhzZXJpZXMuZGF0YXBvaW50cywgcmFkaXVzLCBudWxsLCB3ICsgdy8yLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMsIHN5bWJvbCk7XG5cbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoMCwwLDAsMC4yKVwiO1xuICAgICAgICAgICAgICAgIHBsb3RQb2ludHMoc2VyaWVzLmRhdGFwb2ludHMsIHJhZGl1cywgbnVsbCwgdy8yLCB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMsIHN5bWJvbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBsdztcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHNlcmllcy5jb2xvcjtcbiAgICAgICAgICAgIHBsb3RQb2ludHMoc2VyaWVzLmRhdGFwb2ludHMsIHJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmlsbFN0eWxlKHNlcmllcy5wb2ludHMsIHNlcmllcy5jb2xvciksIDAsIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcywgc3ltYm9sKTtcbiAgICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkcmF3QmFyKHgsIHksIGIsIGJhckxlZnQsIGJhclJpZ2h0LCBmaWxsU3R5bGVDYWxsYmFjaywgYXhpc3gsIGF4aXN5LCBjLCBob3Jpem9udGFsLCBsaW5lV2lkdGgpIHtcbiAgICAgICAgICAgIHZhciBsZWZ0LCByaWdodCwgYm90dG9tLCB0b3AsXG4gICAgICAgICAgICAgICAgZHJhd0xlZnQsIGRyYXdSaWdodCwgZHJhd1RvcCwgZHJhd0JvdHRvbSxcbiAgICAgICAgICAgICAgICB0bXA7XG5cbiAgICAgICAgICAgIC8vIGluIGhvcml6b250YWwgbW9kZSwgd2Ugc3RhcnQgdGhlIGJhciBmcm9tIHRoZSBsZWZ0XG4gICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIGZyb20gdGhlIGJvdHRvbSBzbyBpdCBhcHBlYXJzIHRvIGJlXG4gICAgICAgICAgICAvLyBob3Jpem9udGFsIHJhdGhlciB0aGFuIHZlcnRpY2FsXG4gICAgICAgICAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIGRyYXdCb3R0b20gPSBkcmF3UmlnaHQgPSBkcmF3VG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkcmF3TGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxlZnQgPSBiO1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0geDtcbiAgICAgICAgICAgICAgICB0b3AgPSB5ICsgYmFyTGVmdDtcbiAgICAgICAgICAgICAgICBib3R0b20gPSB5ICsgYmFyUmlnaHQ7XG5cbiAgICAgICAgICAgICAgICAvLyBhY2NvdW50IGZvciBuZWdhdGl2ZSBiYXJzXG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbGVmdCkge1xuICAgICAgICAgICAgICAgICAgICB0bXAgPSByaWdodDtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSBsZWZ0O1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICBkcmF3TGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGRyYXdSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRyYXdMZWZ0ID0gZHJhd1JpZ2h0ID0gZHJhd1RvcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZHJhd0JvdHRvbSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxlZnQgPSB4ICsgYmFyTGVmdDtcbiAgICAgICAgICAgICAgICByaWdodCA9IHggKyBiYXJSaWdodDtcbiAgICAgICAgICAgICAgICBib3R0b20gPSBiO1xuICAgICAgICAgICAgICAgIHRvcCA9IHk7XG5cbiAgICAgICAgICAgICAgICAvLyBhY2NvdW50IGZvciBuZWdhdGl2ZSBiYXJzXG4gICAgICAgICAgICAgICAgaWYgKHRvcCA8IGJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICB0bXAgPSB0b3A7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IGJvdHRvbTtcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICBkcmF3Qm90dG9tID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZHJhd1RvcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2xpcFxuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgYXhpc3gubWluIHx8IGxlZnQgPiBheGlzeC5tYXggfHxcbiAgICAgICAgICAgICAgICB0b3AgPCBheGlzeS5taW4gfHwgYm90dG9tID4gYXhpc3kubWF4KVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKGxlZnQgPCBheGlzeC5taW4pIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gYXhpc3gubWluO1xuICAgICAgICAgICAgICAgIGRyYXdMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyaWdodCA+IGF4aXN4Lm1heCkge1xuICAgICAgICAgICAgICAgIHJpZ2h0ID0gYXhpc3gubWF4O1xuICAgICAgICAgICAgICAgIGRyYXdSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYm90dG9tIDwgYXhpc3kubWluKSB7XG4gICAgICAgICAgICAgICAgYm90dG9tID0gYXhpc3kubWluO1xuICAgICAgICAgICAgICAgIGRyYXdCb3R0b20gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRvcCA+IGF4aXN5Lm1heCkge1xuICAgICAgICAgICAgICAgIHRvcCA9IGF4aXN5Lm1heDtcbiAgICAgICAgICAgICAgICBkcmF3VG9wID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxlZnQgPSBheGlzeC5wMmMobGVmdCk7XG4gICAgICAgICAgICBib3R0b20gPSBheGlzeS5wMmMoYm90dG9tKTtcbiAgICAgICAgICAgIHJpZ2h0ID0gYXhpc3gucDJjKHJpZ2h0KTtcbiAgICAgICAgICAgIHRvcCA9IGF4aXN5LnAyYyh0b3ApO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHRoZSBiYXJcbiAgICAgICAgICAgIGlmIChmaWxsU3R5bGVDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gZmlsbFN0eWxlQ2FsbGJhY2soYm90dG9tLCB0b3ApO1xuICAgICAgICAgICAgICAgIGMuZmlsbFJlY3QobGVmdCwgdG9wLCByaWdodCAtIGxlZnQsIGJvdHRvbSAtIHRvcClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZHJhdyBvdXRsaW5lXG4gICAgICAgICAgICBpZiAobGluZVdpZHRoID4gMCAmJiAoZHJhd0xlZnQgfHwgZHJhd1JpZ2h0IHx8IGRyYXdUb3AgfHwgZHJhd0JvdHRvbSkpIHtcbiAgICAgICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gRklYTUU6IGlubGluZSBtb3ZlVG8gaXMgYnVnZ3kgd2l0aCBleGNhbnZhc1xuICAgICAgICAgICAgICAgIGMubW92ZVRvKGxlZnQsIGJvdHRvbSk7XG4gICAgICAgICAgICAgICAgaWYgKGRyYXdMZWZ0KVxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbyhsZWZ0LCB0b3ApO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8obGVmdCwgdG9wKTtcbiAgICAgICAgICAgICAgICBpZiAoZHJhd1RvcClcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8ocmlnaHQsIHRvcCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjLm1vdmVUbyhyaWdodCwgdG9wKTtcbiAgICAgICAgICAgICAgICBpZiAoZHJhd1JpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbyhyaWdodCwgYm90dG9tKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGMubW92ZVRvKHJpZ2h0LCBib3R0b20pO1xuICAgICAgICAgICAgICAgIGlmIChkcmF3Qm90dG9tKVxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVUbyhsZWZ0LCBib3R0b20pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8obGVmdCwgYm90dG9tKTtcbiAgICAgICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd1Nlcmllc0JhcnMoc2VyaWVzKSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBwbG90QmFycyhkYXRhcG9pbnRzLCBiYXJMZWZ0LCBiYXJSaWdodCwgZmlsbFN0eWxlQ2FsbGJhY2ssIGF4aXN4LCBheGlzeSkge1xuICAgICAgICAgICAgICAgIHZhciBwb2ludHMgPSBkYXRhcG9pbnRzLnBvaW50cywgcHMgPSBkYXRhcG9pbnRzLnBvaW50c2l6ZTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSArPSBwcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnRzW2ldID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZHJhd0Jhcihwb2ludHNbaV0sIHBvaW50c1tpICsgMV0sIHBvaW50c1tpICsgMl0sIGJhckxlZnQsIGJhclJpZ2h0LCBmaWxsU3R5bGVDYWxsYmFjaywgYXhpc3gsIGF4aXN5LCBjdHgsIHNlcmllcy5iYXJzLmhvcml6b250YWwsIHNlcmllcy5iYXJzLmxpbmVXaWR0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgICAgY3R4LnRyYW5zbGF0ZShwbG90T2Zmc2V0LmxlZnQsIHBsb3RPZmZzZXQudG9wKTtcblxuICAgICAgICAgICAgLy8gRklYTUU6IGZpZ3VyZSBvdXQgYSB3YXkgdG8gYWRkIHNoYWRvd3MgKGZvciBpbnN0YW5jZSBhbG9uZyB0aGUgcmlnaHQgZWRnZSlcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSBzZXJpZXMuYmFycy5saW5lV2lkdGg7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzZXJpZXMuY29sb3I7XG5cbiAgICAgICAgICAgIHZhciBiYXJMZWZ0O1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHNlcmllcy5iYXJzLmFsaWduKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gLXNlcmllcy5iYXJzLmJhcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gLXNlcmllcy5iYXJzLmJhcldpZHRoIC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGZpbGxTdHlsZUNhbGxiYWNrID0gc2VyaWVzLmJhcnMuZmlsbCA/IGZ1bmN0aW9uIChib3R0b20sIHRvcCkgeyByZXR1cm4gZ2V0RmlsbFN0eWxlKHNlcmllcy5iYXJzLCBzZXJpZXMuY29sb3IsIGJvdHRvbSwgdG9wKTsgfSA6IG51bGw7XG4gICAgICAgICAgICBwbG90QmFycyhzZXJpZXMuZGF0YXBvaW50cywgYmFyTGVmdCwgYmFyTGVmdCArIHNlcmllcy5iYXJzLmJhcldpZHRoLCBmaWxsU3R5bGVDYWxsYmFjaywgc2VyaWVzLnhheGlzLCBzZXJpZXMueWF4aXMpO1xuICAgICAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEZpbGxTdHlsZShmaWxsb3B0aW9ucywgc2VyaWVzQ29sb3IsIGJvdHRvbSwgdG9wKSB7XG4gICAgICAgICAgICB2YXIgZmlsbCA9IGZpbGxvcHRpb25zLmZpbGw7XG4gICAgICAgICAgICBpZiAoIWZpbGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGlmIChmaWxsb3B0aW9ucy5maWxsQ29sb3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldENvbG9yT3JHcmFkaWVudChmaWxsb3B0aW9ucy5maWxsQ29sb3IsIGJvdHRvbSwgdG9wLCBzZXJpZXNDb2xvcik7XG5cbiAgICAgICAgICAgIHZhciBjID0gJC5jb2xvci5wYXJzZShzZXJpZXNDb2xvcik7XG4gICAgICAgICAgICBjLmEgPSB0eXBlb2YgZmlsbCA9PSBcIm51bWJlclwiID8gZmlsbCA6IDAuNDtcbiAgICAgICAgICAgIGMubm9ybWFsaXplKCk7XG4gICAgICAgICAgICByZXR1cm4gYy50b1N0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5zZXJ0TGVnZW5kKCkge1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sZWdlbmQuY29udGFpbmVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMubGVnZW5kLmNvbnRhaW5lcikuaHRtbChcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIuZmluZChcIi5sZWdlbmRcIikucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5sZWdlbmQuc2hvdykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGZyYWdtZW50cyA9IFtdLCBlbnRyaWVzID0gW10sIHJvd1N0YXJ0ZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBsZiA9IG9wdGlvbnMubGVnZW5kLmxhYmVsRm9ybWF0dGVyLCBzLCBsYWJlbDtcblxuICAgICAgICAgICAgLy8gQnVpbGQgYSBsaXN0IG9mIGxlZ2VuZCBlbnRyaWVzLCB3aXRoIGVhY2ggaGF2aW5nIGEgbGFiZWwgYW5kIGEgY29sb3JcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBzID0gc2VyaWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChzLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gbGYgPyBsZihzLmxhYmVsLCBzKSA6IHMubGFiZWw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW50cmllcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHMuY29sb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTb3J0IHRoZSBsZWdlbmQgdXNpbmcgZWl0aGVyIHRoZSBkZWZhdWx0IG9yIGEgY3VzdG9tIGNvbXBhcmF0b3JcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVnZW5kLnNvcnRlZCkge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0aW9ucy5sZWdlbmQuc29ydGVkKSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRyaWVzLnNvcnQob3B0aW9ucy5sZWdlbmQuc29ydGVkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubGVnZW5kLnNvcnRlZCA9PSBcInJldmVyc2VcIikge1xuICAgICAgICAgICAgICAgIFx0ZW50cmllcy5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFzY2VuZGluZyA9IG9wdGlvbnMubGVnZW5kLnNvcnRlZCAhPSBcImRlc2NlbmRpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgZW50cmllcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmxhYmVsID09IGIubGFiZWwgPyAwIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhLmxhYmVsIDwgYi5sYWJlbCkgIT0gYXNjZW5kaW5nID8gMSA6IC0xICAgLy8gTG9naWNhbCBYT1JcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgbWFya3VwIGZvciB0aGUgbGlzdCBvZiBlbnRyaWVzLCBpbiB0aGVpciBmaW5hbCBvcmRlclxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyArK2kpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaSAlIG9wdGlvbnMubGVnZW5kLm5vQ29sdW1ucyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3dTdGFydGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzLnB1c2goJzwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGZyYWdtZW50cy5wdXNoKCc8dHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJvd1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZyYWdtZW50cy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwibGVnZW5kQ29sb3JCb3hcIj48ZGl2IHN0eWxlPVwiYm9yZGVyOjFweCBzb2xpZCAnICsgb3B0aW9ucy5sZWdlbmQubGFiZWxCb3hCb3JkZXJDb2xvciArICc7cGFkZGluZzoxcHhcIj48ZGl2IHN0eWxlPVwid2lkdGg6NHB4O2hlaWdodDowO2JvcmRlcjo1cHggc29saWQgJyArIGVudHJ5LmNvbG9yICsgJztvdmVyZmxvdzpoaWRkZW5cIj48L2Rpdj48L2Rpdj48L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwibGVnZW5kTGFiZWxcIj4nICsgZW50cnkubGFiZWwgKyAnPC90ZD4nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJvd1N0YXJ0ZWQpXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRzLnB1c2goJzwvdHI+Jyk7XG5cbiAgICAgICAgICAgIGlmIChmcmFnbWVudHMubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgdGFibGUgPSAnPHRhYmxlIHN0eWxlPVwiZm9udC1zaXplOnNtYWxsZXI7Y29sb3I6JyArIG9wdGlvbnMuZ3JpZC5jb2xvciArICdcIj4nICsgZnJhZ21lbnRzLmpvaW4oXCJcIikgKyAnPC90YWJsZT4nO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVnZW5kLmNvbnRhaW5lciAhPSBudWxsKVxuICAgICAgICAgICAgICAgICQob3B0aW9ucy5sZWdlbmQuY29udGFpbmVyKS5odG1sKHRhYmxlKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBwID0gb3B0aW9ucy5sZWdlbmQucG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIG0gPSBvcHRpb25zLmxlZ2VuZC5tYXJnaW47XG4gICAgICAgICAgICAgICAgaWYgKG1bMF0gPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgbSA9IFttLCBtXTtcbiAgICAgICAgICAgICAgICBpZiAocC5jaGFyQXQoMCkgPT0gXCJuXCIpXG4gICAgICAgICAgICAgICAgICAgIHBvcyArPSAndG9wOicgKyAobVsxXSArIHBsb3RPZmZzZXQudG9wKSArICdweDsnO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHAuY2hhckF0KDApID09IFwic1wiKVxuICAgICAgICAgICAgICAgICAgICBwb3MgKz0gJ2JvdHRvbTonICsgKG1bMV0gKyBwbG90T2Zmc2V0LmJvdHRvbSkgKyAncHg7JztcbiAgICAgICAgICAgICAgICBpZiAocC5jaGFyQXQoMSkgPT0gXCJlXCIpXG4gICAgICAgICAgICAgICAgICAgIHBvcyArPSAncmlnaHQ6JyArIChtWzBdICsgcGxvdE9mZnNldC5yaWdodCkgKyAncHg7JztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwLmNoYXJBdCgxKSA9PSBcIndcIilcbiAgICAgICAgICAgICAgICAgICAgcG9zICs9ICdsZWZ0OicgKyAobVswXSArIHBsb3RPZmZzZXQubGVmdCkgKyAncHg7JztcbiAgICAgICAgICAgICAgICB2YXIgbGVnZW5kID0gJCgnPGRpdiBjbGFzcz1cImxlZ2VuZFwiPicgKyB0YWJsZS5yZXBsYWNlKCdzdHlsZT1cIicsICdzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOycgKyBwb3MgKyc7JykgKyAnPC9kaXY+JykuYXBwZW5kVG8ocGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxlZ2VuZC5iYWNrZ3JvdW5kT3BhY2l0eSAhPSAwLjApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHV0IGluIHRoZSB0cmFuc3BhcmVudCBiYWNrZ3JvdW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIHNlcGFyYXRlbHkgdG8gYXZvaWQgYmxlbmRlZCBsYWJlbHMgYW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIGxhYmVsIGJveGVzXG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gb3B0aW9ucy5sZWdlbmQuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gb3B0aW9ucy5ncmlkLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjICYmIHR5cGVvZiBjID09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICQuY29sb3IucGFyc2UoYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYyA9ICQuY29sb3IuZXh0cmFjdChsZWdlbmQsICdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLmEgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gbGVnZW5kLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgICAgICQoJzxkaXYgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDonICsgZGl2LndpZHRoKCkgKyAncHg7aGVpZ2h0OicgKyBkaXYuaGVpZ2h0KCkgKyAncHg7JyArIHBvcyArJ2JhY2tncm91bmQtY29sb3I6JyArIGMgKyAnO1wiPiA8L2Rpdj4nKS5wcmVwZW5kVG8obGVnZW5kKS5jc3MoJ29wYWNpdHknLCBvcHRpb25zLmxlZ2VuZC5iYWNrZ3JvdW5kT3BhY2l0eSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBpbnRlcmFjdGl2ZSBmZWF0dXJlc1xuXG4gICAgICAgIHZhciBoaWdobGlnaHRzID0gW10sXG4gICAgICAgICAgICByZWRyYXdUaW1lb3V0ID0gbnVsbDtcblxuICAgICAgICAvLyByZXR1cm5zIHRoZSBkYXRhIGl0ZW0gdGhlIG1vdXNlIGlzIG92ZXIsIG9yIG51bGwgaWYgbm9uZSBpcyBmb3VuZFxuICAgICAgICBmdW5jdGlvbiBmaW5kTmVhcmJ5SXRlbShtb3VzZVgsIG1vdXNlWSwgc2VyaWVzRmlsdGVyKSB7XG4gICAgICAgICAgICB2YXIgbWF4RGlzdGFuY2UgPSBvcHRpb25zLmdyaWQubW91c2VBY3RpdmVSYWRpdXMsXG4gICAgICAgICAgICAgICAgc21hbGxlc3REaXN0YW5jZSA9IG1heERpc3RhbmNlICogbWF4RGlzdGFuY2UgKyAxLFxuICAgICAgICAgICAgICAgIGl0ZW0gPSBudWxsLCBmb3VuZFBvaW50ID0gZmFsc2UsIGksIGosIHBzO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSBzZXJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlcmllc0ZpbHRlcihzZXJpZXNbaV0pKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHZhciBzID0gc2VyaWVzW2ldLFxuICAgICAgICAgICAgICAgICAgICBheGlzeCA9IHMueGF4aXMsXG4gICAgICAgICAgICAgICAgICAgIGF4aXN5ID0gcy55YXhpcyxcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzID0gcy5kYXRhcG9pbnRzLnBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgbXggPSBheGlzeC5jMnAobW91c2VYKSwgLy8gcHJlY29tcHV0ZSBzb21lIHN0dWZmIHRvIG1ha2UgdGhlIGxvb3AgZmFzdGVyXG4gICAgICAgICAgICAgICAgICAgIG15ID0gYXhpc3kuYzJwKG1vdXNlWSksXG4gICAgICAgICAgICAgICAgICAgIG1heHggPSBtYXhEaXN0YW5jZSAvIGF4aXN4LnNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBtYXh5ID0gbWF4RGlzdGFuY2UgLyBheGlzeS5zY2FsZTtcblxuICAgICAgICAgICAgICAgIHBzID0gcy5kYXRhcG9pbnRzLnBvaW50c2l6ZTtcbiAgICAgICAgICAgICAgICAvLyB3aXRoIGludmVyc2UgdHJhbnNmb3Jtcywgd2UgY2FuJ3QgdXNlIHRoZSBtYXh4L21heHlcbiAgICAgICAgICAgICAgICAvLyBvcHRpbWl6YXRpb24sIHNhZGx5XG4gICAgICAgICAgICAgICAgaWYgKGF4aXN4Lm9wdGlvbnMuaW52ZXJzZVRyYW5zZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgbWF4eCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICAgICAgICAgICAgaWYgKGF4aXN5Lm9wdGlvbnMuaW52ZXJzZVRyYW5zZm9ybSlcbiAgICAgICAgICAgICAgICAgICAgbWF4eSA9IE51bWJlci5NQVhfVkFMVUU7XG5cbiAgICAgICAgICAgICAgICBpZiAocy5saW5lcy5zaG93IHx8IHMucG9pbnRzLnNob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHBvaW50cy5sZW5ndGg7IGogKz0gcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4ID0gcG9pbnRzW2pdLCB5ID0gcG9pbnRzW2ogKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBwb2ludHMgYW5kIGxpbmVzLCB0aGUgY3Vyc29yIG11c3QgYmUgd2l0aGluIGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNlcnRhaW4gZGlzdGFuY2UgdG8gdGhlIGRhdGEgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4IC0gbXggPiBtYXh4IHx8IHggLSBteCA8IC1tYXh4IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeSAtIG15ID4gbWF4eSB8fCB5IC0gbXkgPCAtbWF4eSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBjYWxjdWxhdGUgZGlzdGFuY2VzIGluIHBpeGVscywgbm90IGluXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkYXRhIHVuaXRzLCBiZWNhdXNlIHRoZSBzY2FsZXMgb2YgdGhlIGF4ZXMgbWF5IGJlIGRpZmZlcmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMoYXhpc3gucDJjKHgpIC0gbW91c2VYKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeSA9IE1hdGguYWJzKGF4aXN5LnAyYyh5KSAtIG1vdXNlWSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdCA9IGR4ICogZHggKyBkeSAqIGR5OyAvLyB3ZSBzYXZlIHRoZSBzcXJ0XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZSA8PSB0byBlbnN1cmUgbGFzdCBwb2ludCB0YWtlcyBwcmVjZWRlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAobGFzdCBnZW5lcmFsbHkgbWVhbnMgb24gdG9wIG9mKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3QgPCBzbWFsbGVzdERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc21hbGxlc3REaXN0YW5jZSA9IGRpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IFtpLCBqIC8gcHNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHMuYmFycy5zaG93ICYmICFpdGVtKSB7IC8vIG5vIG90aGVyIHBvaW50IGNhbiBiZSBuZWFyYnlcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYmFyTGVmdCwgYmFyUmlnaHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzLmJhcnMuYWxpZ24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gLXMuYmFycy5iYXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFyTGVmdCA9IC1zLmJhcnMuYmFyV2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYmFyUmlnaHQgPSBiYXJMZWZ0ICsgcy5iYXJzLmJhcldpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBwb2ludHMubGVuZ3RoOyBqICs9IHBzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHBvaW50c1tqXSwgeSA9IHBvaW50c1tqICsgMV0sIGIgPSBwb2ludHNbaiArIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGEgYmFyIGdyYXBoLCB0aGUgY3Vyc29yIG11c3QgYmUgaW5zaWRlIHRoZSBiYXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXJpZXNbaV0uYmFycy5ob3Jpem9udGFsID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobXggPD0gTWF0aC5tYXgoYiwgeCkgJiYgbXggPj0gTWF0aC5taW4oYiwgeCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXkgPj0geSArIGJhckxlZnQgJiYgbXkgPD0geSArIGJhclJpZ2h0KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG14ID49IHggKyBiYXJMZWZ0ICYmIG14IDw9IHggKyBiYXJSaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteSA+PSBNYXRoLm1pbihiLCB5KSAmJiBteSA8PSBNYXRoLm1heChiLCB5KSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBbaSwgaiAvIHBzXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpID0gaXRlbVswXTtcbiAgICAgICAgICAgICAgICBqID0gaXRlbVsxXTtcbiAgICAgICAgICAgICAgICBwcyA9IHNlcmllc1tpXS5kYXRhcG9pbnRzLnBvaW50c2l6ZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRhdGFwb2ludDogc2VyaWVzW2ldLmRhdGFwb2ludHMucG9pbnRzLnNsaWNlKGogKiBwcywgKGogKyAxKSAqIHBzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhSW5kZXg6IGosXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzOiBzZXJpZXNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWVzSW5kZXg6IGkgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZShlKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmhvdmVyYWJsZSlcbiAgICAgICAgICAgICAgICB0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KFwicGxvdGhvdmVyXCIsIGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocykgeyByZXR1cm4gc1tcImhvdmVyYWJsZVwiXSAhPSBmYWxzZTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbk1vdXNlTGVhdmUoZSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZ3JpZC5ob3ZlcmFibGUpXG4gICAgICAgICAgICAgICAgdHJpZ2dlckNsaWNrSG92ZXJFdmVudChcInBsb3Rob3ZlclwiLCBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHMpIHsgcmV0dXJuIGZhbHNlOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xuICAgICAgICAgICAgdHJpZ2dlckNsaWNrSG92ZXJFdmVudChcInBsb3RjbGlja1wiLCBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocykgeyByZXR1cm4gc1tcImNsaWNrYWJsZVwiXSAhPSBmYWxzZTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0cmlnZ2VyIGNsaWNrIG9yIGhvdmVyIGV2ZW50ICh0aGV5IHNlbmQgdGhlIHNhbWUgcGFyYW1ldGVyc1xuICAgICAgICAvLyBzbyB3ZSBzaGFyZSB0aGVpciBjb2RlKVxuICAgICAgICBmdW5jdGlvbiB0cmlnZ2VyQ2xpY2tIb3ZlckV2ZW50KGV2ZW50bmFtZSwgZXZlbnQsIHNlcmllc0ZpbHRlcikge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGV2ZW50SG9sZGVyLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIGNhbnZhc1ggPSBldmVudC5wYWdlWCAtIG9mZnNldC5sZWZ0IC0gcGxvdE9mZnNldC5sZWZ0LFxuICAgICAgICAgICAgICAgIGNhbnZhc1kgPSBldmVudC5wYWdlWSAtIG9mZnNldC50b3AgLSBwbG90T2Zmc2V0LnRvcCxcbiAgICAgICAgICAgIHBvcyA9IGNhbnZhc1RvQXhpc0Nvb3Jkcyh7IGxlZnQ6IGNhbnZhc1gsIHRvcDogY2FudmFzWSB9KTtcblxuICAgICAgICAgICAgcG9zLnBhZ2VYID0gZXZlbnQucGFnZVg7XG4gICAgICAgICAgICBwb3MucGFnZVkgPSBldmVudC5wYWdlWTtcblxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBmaW5kTmVhcmJ5SXRlbShjYW52YXNYLCBjYW52YXNZLCBzZXJpZXNGaWx0ZXIpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIC8vIGZpbGwgaW4gbW91c2UgcG9zIGZvciBhbnkgbGlzdGVuZXJzIG91dCB0aGVyZVxuICAgICAgICAgICAgICAgIGl0ZW0ucGFnZVggPSBwYXJzZUludChpdGVtLnNlcmllcy54YXhpcy5wMmMoaXRlbS5kYXRhcG9pbnRbMF0pICsgb2Zmc2V0LmxlZnQgKyBwbG90T2Zmc2V0LmxlZnQsIDEwKTtcbiAgICAgICAgICAgICAgICBpdGVtLnBhZ2VZID0gcGFyc2VJbnQoaXRlbS5zZXJpZXMueWF4aXMucDJjKGl0ZW0uZGF0YXBvaW50WzFdKSArIG9mZnNldC50b3AgKyBwbG90T2Zmc2V0LnRvcCwgMTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ncmlkLmF1dG9IaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBhdXRvLWhpZ2hsaWdodHNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSBoaWdobGlnaHRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaC5hdXRvID09IGV2ZW50bmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIShpdGVtICYmIGguc2VyaWVzID09IGl0ZW0uc2VyaWVzICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGgucG9pbnRbMF0gPT0gaXRlbS5kYXRhcG9pbnRbMF0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaC5wb2ludFsxXSA9PSBpdGVtLmRhdGFwb2ludFsxXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmhpZ2hsaWdodChoLnNlcmllcywgaC5wb2ludCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodChpdGVtLnNlcmllcywgaXRlbS5kYXRhcG9pbnQsIGV2ZW50bmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnRyaWdnZXIoZXZlbnRuYW1lLCBbIHBvcywgaXRlbSBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyaWdnZXJSZWRyYXdPdmVybGF5KCkge1xuICAgICAgICAgICAgdmFyIHQgPSBvcHRpb25zLmludGVyYWN0aW9uLnJlZHJhd092ZXJsYXlJbnRlcnZhbDtcbiAgICAgICAgICAgIGlmICh0ID09IC0xKSB7ICAgICAgLy8gc2tpcCBldmVudCBxdWV1ZVxuICAgICAgICAgICAgICAgIGRyYXdPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXJlZHJhd1RpbWVvdXQpXG4gICAgICAgICAgICAgICAgcmVkcmF3VGltZW91dCA9IHNldFRpbWVvdXQoZHJhd092ZXJsYXksIHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd092ZXJsYXkoKSB7XG4gICAgICAgICAgICByZWRyYXdUaW1lb3V0ID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gZHJhdyBoaWdobGlnaHRzXG4gICAgICAgICAgICBvY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIG92ZXJsYXkuY2xlYXIoKTtcbiAgICAgICAgICAgIG9jdHgudHJhbnNsYXRlKHBsb3RPZmZzZXQubGVmdCwgcGxvdE9mZnNldC50b3ApO1xuXG4gICAgICAgICAgICB2YXIgaSwgaGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaGlnaGxpZ2h0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGhpID0gaGlnaGxpZ2h0c1tpXTtcblxuICAgICAgICAgICAgICAgIGlmIChoaS5zZXJpZXMuYmFycy5zaG93KVxuICAgICAgICAgICAgICAgICAgICBkcmF3QmFySGlnaGxpZ2h0KGhpLnNlcmllcywgaGkucG9pbnQpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZHJhd1BvaW50SGlnaGxpZ2h0KGhpLnNlcmllcywgaGkucG9pbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2N0eC5yZXN0b3JlKCk7XG5cbiAgICAgICAgICAgIGV4ZWN1dGVIb29rcyhob29rcy5kcmF3T3ZlcmxheSwgW29jdHhdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhpZ2hsaWdodChzLCBwb2ludCwgYXV0bykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tzXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwb2ludCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBzID0gcy5kYXRhcG9pbnRzLnBvaW50c2l6ZTtcbiAgICAgICAgICAgICAgICBwb2ludCA9IHMuZGF0YXBvaW50cy5wb2ludHMuc2xpY2UocHMgKiBwb2ludCwgcHMgKiAocG9pbnQgKyAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpID0gaW5kZXhPZkhpZ2hsaWdodChzLCBwb2ludCk7XG4gICAgICAgICAgICBpZiAoaSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMucHVzaCh7IHNlcmllczogcywgcG9pbnQ6IHBvaW50LCBhdXRvOiBhdXRvIH0pO1xuXG4gICAgICAgICAgICAgICAgdHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFhdXRvKVxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodHNbaV0uYXV0byA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdW5oaWdobGlnaHQocywgcG9pbnQpIHtcbiAgICAgICAgICAgIGlmIChzID09IG51bGwgJiYgcG9pbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMgPSBbXTtcbiAgICAgICAgICAgICAgICB0cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgcyA9IHNlcmllc1tzXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwb2ludCA9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBzID0gcy5kYXRhcG9pbnRzLnBvaW50c2l6ZTtcbiAgICAgICAgICAgICAgICBwb2ludCA9IHMuZGF0YXBvaW50cy5wb2ludHMuc2xpY2UocHMgKiBwb2ludCwgcHMgKiAocG9pbnQgKyAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpID0gaW5kZXhPZkhpZ2hsaWdodChzLCBwb2ludCk7XG4gICAgICAgICAgICBpZiAoaSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMuc3BsaWNlKGksIDEpO1xuXG4gICAgICAgICAgICAgICAgdHJpZ2dlclJlZHJhd092ZXJsYXkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluZGV4T2ZIaWdobGlnaHQocywgcCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoaWdobGlnaHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGggPSBoaWdobGlnaHRzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChoLnNlcmllcyA9PSBzICYmIGgucG9pbnRbMF0gPT0gcFswXVxuICAgICAgICAgICAgICAgICAgICAmJiBoLnBvaW50WzFdID09IHBbMV0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZHJhd1BvaW50SGlnaGxpZ2h0KHNlcmllcywgcG9pbnQpIHtcbiAgICAgICAgICAgIHZhciB4ID0gcG9pbnRbMF0sIHkgPSBwb2ludFsxXSxcbiAgICAgICAgICAgICAgICBheGlzeCA9IHNlcmllcy54YXhpcywgYXhpc3kgPSBzZXJpZXMueWF4aXMsXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0Q29sb3IgPSAodHlwZW9mIHNlcmllcy5oaWdobGlnaHRDb2xvciA9PT0gXCJzdHJpbmdcIikgPyBzZXJpZXMuaGlnaGxpZ2h0Q29sb3IgOiAkLmNvbG9yLnBhcnNlKHNlcmllcy5jb2xvcikuc2NhbGUoJ2EnLCAwLjUpLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmICh4IDwgYXhpc3gubWluIHx8IHggPiBheGlzeC5tYXggfHwgeSA8IGF4aXN5Lm1pbiB8fCB5ID4gYXhpc3kubWF4KVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIHBvaW50UmFkaXVzID0gc2VyaWVzLnBvaW50cy5yYWRpdXMgKyBzZXJpZXMucG9pbnRzLmxpbmVXaWR0aCAvIDI7XG4gICAgICAgICAgICBvY3R4LmxpbmVXaWR0aCA9IHBvaW50UmFkaXVzO1xuICAgICAgICAgICAgb2N0eC5zdHJva2VTdHlsZSA9IGhpZ2hsaWdodENvbG9yO1xuICAgICAgICAgICAgdmFyIHJhZGl1cyA9IDEuNSAqIHBvaW50UmFkaXVzO1xuICAgICAgICAgICAgeCA9IGF4aXN4LnAyYyh4KTtcbiAgICAgICAgICAgIHkgPSBheGlzeS5wMmMoeSk7XG5cbiAgICAgICAgICAgIG9jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBpZiAoc2VyaWVzLnBvaW50cy5zeW1ib2wgPT0gXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICBvY3R4LmFyYyh4LCB5LCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VyaWVzLnBvaW50cy5zeW1ib2wob2N0eCwgeCwgeSwgcmFkaXVzLCBmYWxzZSk7XG4gICAgICAgICAgICBvY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgb2N0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdCYXJIaWdobGlnaHQoc2VyaWVzLCBwb2ludCkge1xuICAgICAgICAgICAgdmFyIGhpZ2hsaWdodENvbG9yID0gKHR5cGVvZiBzZXJpZXMuaGlnaGxpZ2h0Q29sb3IgPT09IFwic3RyaW5nXCIpID8gc2VyaWVzLmhpZ2hsaWdodENvbG9yIDogJC5jb2xvci5wYXJzZShzZXJpZXMuY29sb3IpLnNjYWxlKCdhJywgMC41KS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGZpbGxTdHlsZSA9IGhpZ2hsaWdodENvbG9yLFxuICAgICAgICAgICAgICAgIGJhckxlZnQ7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc2VyaWVzLmJhcnMuYWxpZ24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICBiYXJMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAtc2VyaWVzLmJhcnMuYmFyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJhckxlZnQgPSAtc2VyaWVzLmJhcnMuYmFyV2lkdGggLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvY3R4LmxpbmVXaWR0aCA9IHNlcmllcy5iYXJzLmxpbmVXaWR0aDtcbiAgICAgICAgICAgIG9jdHguc3Ryb2tlU3R5bGUgPSBoaWdobGlnaHRDb2xvcjtcblxuICAgICAgICAgICAgZHJhd0Jhcihwb2ludFswXSwgcG9pbnRbMV0sIHBvaW50WzJdIHx8IDAsIGJhckxlZnQsIGJhckxlZnQgKyBzZXJpZXMuYmFycy5iYXJXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gZmlsbFN0eWxlOyB9LCBzZXJpZXMueGF4aXMsIHNlcmllcy55YXhpcywgb2N0eCwgc2VyaWVzLmJhcnMuaG9yaXpvbnRhbCwgc2VyaWVzLmJhcnMubGluZVdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbG9yT3JHcmFkaWVudChzcGVjLCBib3R0b20sIHRvcCwgZGVmYXVsdENvbG9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwZWMgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BlYztcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFzc3VtZSB0aGlzIGlzIGEgZ3JhZGllbnQgc3BlYzsgSUUgY3VycmVudGx5IG9ubHlcbiAgICAgICAgICAgICAgICAvLyBzdXBwb3J0cyBhIHNpbXBsZSB2ZXJ0aWNhbCBncmFkaWVudCBwcm9wZXJseSwgc28gdGhhdCdzXG4gICAgICAgICAgICAgICAgLy8gd2hhdCB3ZSBzdXBwb3J0IHRvb1xuICAgICAgICAgICAgICAgIHZhciBncmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCB0b3AsIDAsIGJvdHRvbSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHNwZWMuY29sb3JzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IHNwZWMuY29sb3JzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGMgIT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvID0gJC5jb2xvci5wYXJzZShkZWZhdWx0Q29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMuYnJpZ2h0bmVzcyAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvID0gY28uc2NhbGUoJ3JnYicsIGMuYnJpZ2h0bmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5vcGFjaXR5ICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY28uYSAqPSBjLm9wYWNpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gY28udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoaSAvIChsIC0gMSksIGMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBncmFkaWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgcGxvdCBmdW5jdGlvbiB0byB0aGUgdG9wIGxldmVsIG9mIHRoZSBqUXVlcnkgb2JqZWN0XG5cbiAgICAkLnBsb3QgPSBmdW5jdGlvbihwbGFjZWhvbGRlciwgZGF0YSwgb3B0aW9ucykge1xuICAgICAgICAvL3ZhciB0MCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBwbG90ID0gbmV3IFBsb3QoJChwbGFjZWhvbGRlciksIGRhdGEsIG9wdGlvbnMsICQucGxvdC5wbHVnaW5zKTtcbiAgICAgICAgLy8od2luZG93LmNvbnNvbGUgPyBjb25zb2xlLmxvZyA6IGFsZXJ0KShcInRpbWUgdXNlZCAobXNlY3MpOiBcIiArICgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC0gdDAuZ2V0VGltZSgpKSk7XG4gICAgICAgIHJldHVybiBwbG90O1xuICAgIH07XG5cbiAgICAkLnBsb3QudmVyc2lvbiA9IFwiMC44LjNcIjtcblxuICAgICQucGxvdC5wbHVnaW5zID0gW107XG5cbiAgICAvLyBBbHNvIGFkZCB0aGUgcGxvdCBmdW5jdGlvbiBhcyBhIGNoYWluYWJsZSBwcm9wZXJ0eVxuXG4gICAgJC5mbi5wbG90ID0gZnVuY3Rpb24oZGF0YSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJC5wbG90KHRoaXMsIGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gcm91bmQgdG8gbmVhcmJ5IGxvd2VyIG11bHRpcGxlIG9mIGJhc2VcbiAgICBmdW5jdGlvbiBmbG9vckluQmFzZShuLCBiYXNlKSB7XG4gICAgICAgIHJldHVybiBiYXNlICogTWF0aC5mbG9vcihuIC8gYmFzZSk7XG4gICAgfVxuXG59KShqUXVlcnkpO1xuIiwiLyogRmxvdCBwbHVnaW4gZm9yIHJlbmRlcmluZyBwaWUgY2hhcnRzLlxuXG5Db3B5cmlnaHQgKGMpIDIwMDctMjAxNCBJT0xBIGFuZCBPbGUgTGF1cnNlbi5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuVGhlIHBsdWdpbiBhc3N1bWVzIHRoYXQgZWFjaCBzZXJpZXMgaGFzIGEgc2luZ2xlIGRhdGEgdmFsdWUsIGFuZCB0aGF0IGVhY2hcbnZhbHVlIGlzIGEgcG9zaXRpdmUgaW50ZWdlciBvciB6ZXJvLiAgTmVnYXRpdmUgbnVtYmVycyBkb24ndCBtYWtlIHNlbnNlIGZvciBhXG5waWUgY2hhcnQsIGFuZCBoYXZlIHVucHJlZGljdGFibGUgcmVzdWx0cy4gIFRoZSB2YWx1ZXMgZG8gTk9UIG5lZWQgdG8gYmVcbnBhc3NlZCBpbiBhcyBwZXJjZW50YWdlczsgdGhlIHBsdWdpbiB3aWxsIGNhbGN1bGF0ZSB0aGUgdG90YWwgYW5kIHBlci1zbGljZVxucGVyY2VudGFnZXMgaW50ZXJuYWxseS5cblxuKiBDcmVhdGVkIGJ5IEJyaWFuIE1lZGVuZG9ycFxuXG4qIFVwZGF0ZWQgd2l0aCBjb250cmlidXRpb25zIGZyb20gYnRidXJuZXR0MywgQW50aG9ueSBBcmFndWVzIGFuZCBYYXZpIEl2YXJzXG5cblRoZSBwbHVnaW4gc3VwcG9ydHMgdGhlc2Ugb3B0aW9uczpcblxuXHRzZXJpZXM6IHtcblx0XHRwaWU6IHtcblx0XHRcdHNob3c6IHRydWUvZmFsc2Vcblx0XHRcdHJhZGl1czogMC0xIGZvciBwZXJjZW50YWdlIG9mIGZ1bGxzaXplLCBvciBhIHNwZWNpZmllZCBwaXhlbCBsZW5ndGgsIG9yICdhdXRvJ1xuXHRcdFx0aW5uZXJSYWRpdXM6IDAtMSBmb3IgcGVyY2VudGFnZSBvZiBmdWxsc2l6ZSBvciBhIHNwZWNpZmllZCBwaXhlbCBsZW5ndGgsIGZvciBjcmVhdGluZyBhIGRvbnV0IGVmZmVjdFxuXHRcdFx0c3RhcnRBbmdsZTogMC0yIGZhY3RvciBvZiBQSSB1c2VkIGZvciBzdGFydGluZyBhbmdsZSAoaW4gcmFkaWFucykgaS5lIDMvMiBzdGFydHMgYXQgdGhlIHRvcCwgMCBhbmQgMiBoYXZlIHRoZSBzYW1lIHJlc3VsdFxuXHRcdFx0dGlsdDogMC0xIGZvciBwZXJjZW50YWdlIHRvIHRpbHQgdGhlIHBpZSwgd2hlcmUgMSBpcyBubyB0aWx0LCBhbmQgMCBpcyBjb21wbGV0ZWx5IGZsYXQgKG5vdGhpbmcgd2lsbCBzaG93KVxuXHRcdFx0b2Zmc2V0OiB7XG5cdFx0XHRcdHRvcDogaW50ZWdlciB2YWx1ZSB0byBtb3ZlIHRoZSBwaWUgdXAgb3IgZG93blxuXHRcdFx0XHRsZWZ0OiBpbnRlZ2VyIHZhbHVlIHRvIG1vdmUgdGhlIHBpZSBsZWZ0IG9yIHJpZ2h0LCBvciAnYXV0bydcblx0XHRcdH0sXG5cdFx0XHRzdHJva2U6IHtcblx0XHRcdFx0Y29sb3I6IGFueSBoZXhpZGVjaW1hbCBjb2xvciB2YWx1ZSAob3RoZXIgZm9ybWF0cyBtYXkgb3IgbWF5IG5vdCB3b3JrLCBzbyBiZXN0IHRvIHN0aWNrIHdpdGggc29tZXRoaW5nIGxpa2UgJyNGRkYnKVxuXHRcdFx0XHR3aWR0aDogaW50ZWdlciBwaXhlbCB3aWR0aCBvZiB0aGUgc3Ryb2tlXG5cdFx0XHR9LFxuXHRcdFx0bGFiZWw6IHtcblx0XHRcdFx0c2hvdzogdHJ1ZS9mYWxzZSwgb3IgJ2F1dG8nXG5cdFx0XHRcdGZvcm1hdHRlcjogIGEgdXNlci1kZWZpbmVkIGZ1bmN0aW9uIHRoYXQgbW9kaWZpZXMgdGhlIHRleHQvc3R5bGUgb2YgdGhlIGxhYmVsIHRleHRcblx0XHRcdFx0cmFkaXVzOiAwLTEgZm9yIHBlcmNlbnRhZ2Ugb2YgZnVsbHNpemUsIG9yIGEgc3BlY2lmaWVkIHBpeGVsIGxlbmd0aFxuXHRcdFx0XHRiYWNrZ3JvdW5kOiB7XG5cdFx0XHRcdFx0Y29sb3I6IGFueSBoZXhpZGVjaW1hbCBjb2xvciB2YWx1ZSAob3RoZXIgZm9ybWF0cyBtYXkgb3IgbWF5IG5vdCB3b3JrLCBzbyBiZXN0IHRvIHN0aWNrIHdpdGggc29tZXRoaW5nIGxpa2UgJyMwMDAnKVxuXHRcdFx0XHRcdG9wYWNpdHk6IDAtMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aHJlc2hvbGQ6IDAtMSBmb3IgdGhlIHBlcmNlbnRhZ2UgdmFsdWUgYXQgd2hpY2ggdG8gaGlkZSBsYWJlbHMgKGlmIHRoZXkncmUgdG9vIHNtYWxsKVxuXHRcdFx0fSxcblx0XHRcdGNvbWJpbmU6IHtcblx0XHRcdFx0dGhyZXNob2xkOiAwLTEgZm9yIHRoZSBwZXJjZW50YWdlIHZhbHVlIGF0IHdoaWNoIHRvIGNvbWJpbmUgc2xpY2VzIChpZiB0aGV5J3JlIHRvbyBzbWFsbClcblx0XHRcdFx0Y29sb3I6IGFueSBoZXhpZGVjaW1hbCBjb2xvciB2YWx1ZSAob3RoZXIgZm9ybWF0cyBtYXkgb3IgbWF5IG5vdCB3b3JrLCBzbyBiZXN0IHRvIHN0aWNrIHdpdGggc29tZXRoaW5nIGxpa2UgJyNDQ0MnKSwgaWYgbnVsbCwgdGhlIHBsdWdpbiB3aWxsIGF1dG9tYXRpY2FsbHkgdXNlIHRoZSBjb2xvciBvZiB0aGUgZmlyc3Qgc2xpY2UgdG8gYmUgY29tYmluZWRcblx0XHRcdFx0bGFiZWw6IGFueSB0ZXh0IHZhbHVlIG9mIHdoYXQgdGhlIGNvbWJpbmVkIHNsaWNlIHNob3VsZCBiZSBsYWJlbGVkXG5cdFx0XHR9XG5cdFx0XHRoaWdobGlnaHQ6IHtcblx0XHRcdFx0b3BhY2l0eTogMC0xXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbk1vcmUgZGV0YWlsIGFuZCBzcGVjaWZpYyBleGFtcGxlcyBjYW4gYmUgZm91bmQgaW4gdGhlIGluY2x1ZGVkIEhUTUwgZmlsZS5cblxuKi9cblxuKGZ1bmN0aW9uKCQpIHtcblxuXHQvLyBNYXhpbXVtIHJlZHJhdyBhdHRlbXB0cyB3aGVuIGZpdHRpbmcgbGFiZWxzIHdpdGhpbiB0aGUgcGxvdFxuXG5cdHZhciBSRURSQVdfQVRURU1QVFMgPSAxMDtcblxuXHQvLyBGYWN0b3IgYnkgd2hpY2ggdG8gc2hyaW5rIHRoZSBwaWUgd2hlbiBmaXR0aW5nIGxhYmVscyB3aXRoaW4gdGhlIHBsb3RcblxuXHR2YXIgUkVEUkFXX1NIUklOSyA9IDAuOTU7XG5cblx0ZnVuY3Rpb24gaW5pdChwbG90KSB7XG5cblx0XHR2YXIgY2FudmFzID0gbnVsbCxcblx0XHRcdHRhcmdldCA9IG51bGwsXG5cdFx0XHRvcHRpb25zID0gbnVsbCxcblx0XHRcdG1heFJhZGl1cyA9IG51bGwsXG5cdFx0XHRjZW50ZXJMZWZ0ID0gbnVsbCxcblx0XHRcdGNlbnRlclRvcCA9IG51bGwsXG5cdFx0XHRwcm9jZXNzZWQgPSBmYWxzZSxcblx0XHRcdGN0eCA9IG51bGw7XG5cblx0XHQvLyBpbnRlcmFjdGl2ZSB2YXJpYWJsZXNcblxuXHRcdHZhciBoaWdobGlnaHRzID0gW107XG5cblx0XHQvLyBhZGQgaG9vayB0byBkZXRlcm1pbmUgaWYgcGllIHBsdWdpbiBpbiBlbmFibGVkLCBhbmQgdGhlbiBwZXJmb3JtIG5lY2Vzc2FyeSBvcGVyYXRpb25zXG5cblx0XHRwbG90Lmhvb2tzLnByb2Nlc3NPcHRpb25zLnB1c2goZnVuY3Rpb24ocGxvdCwgb3B0aW9ucykge1xuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5zaG93KSB7XG5cblx0XHRcdFx0b3B0aW9ucy5ncmlkLnNob3cgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyBzZXQgbGFiZWxzLnNob3dcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnNob3cgPT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5sZWdlbmQuc2hvdykge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnNob3cgPSBmYWxzZTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnNob3cgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHNldCByYWRpdXNcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA9PSBcImF1dG9cIikge1xuXHRcdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUubGFiZWwuc2hvdykge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA9IDMvNDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0b3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA9IDE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZW5zdXJlIHNhbmUgdGlsdFxuXG5cdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUudGlsdCA+IDEpIHtcblx0XHRcdFx0XHRvcHRpb25zLnNlcmllcy5waWUudGlsdCA9IDE7XG5cdFx0XHRcdH0gZWxzZSBpZiAob3B0aW9ucy5zZXJpZXMucGllLnRpbHQgPCAwKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5zZXJpZXMucGllLnRpbHQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRwbG90Lmhvb2tzLmJpbmRFdmVudHMucHVzaChmdW5jdGlvbihwbG90LCBldmVudEhvbGRlcikge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKTtcblx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUuc2hvdykge1xuXHRcdFx0XHRpZiAob3B0aW9ucy5ncmlkLmhvdmVyYWJsZSkge1xuXHRcdFx0XHRcdGV2ZW50SG9sZGVyLnVuYmluZChcIm1vdXNlbW92ZVwiKS5tb3VzZW1vdmUob25Nb3VzZU1vdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvcHRpb25zLmdyaWQuY2xpY2thYmxlKSB7XG5cdFx0XHRcdFx0ZXZlbnRIb2xkZXIudW5iaW5kKFwiY2xpY2tcIikuY2xpY2sob25DbGljayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHBsb3QuaG9va3MucHJvY2Vzc0RhdGFwb2ludHMucHVzaChmdW5jdGlvbihwbG90LCBzZXJpZXMsIGRhdGEsIGRhdGFwb2ludHMpIHtcblx0XHRcdHZhciBvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCk7XG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnNob3cpIHtcblx0XHRcdFx0cHJvY2Vzc0RhdGFwb2ludHMocGxvdCwgc2VyaWVzLCBkYXRhLCBkYXRhcG9pbnRzKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHBsb3QuaG9va3MuZHJhd092ZXJsYXkucHVzaChmdW5jdGlvbihwbG90LCBvY3R4KSB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpO1xuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5zaG93KSB7XG5cdFx0XHRcdGRyYXdPdmVybGF5KHBsb3QsIG9jdHgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cGxvdC5ob29rcy5kcmF3LnB1c2goZnVuY3Rpb24ocGxvdCwgbmV3Q3R4KSB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpO1xuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5zaG93KSB7XG5cdFx0XHRcdGRyYXcocGxvdCwgbmV3Q3R4KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGZ1bmN0aW9uIHByb2Nlc3NEYXRhcG9pbnRzKHBsb3QsIHNlcmllcywgZGF0YXBvaW50cykge1xuXHRcdFx0aWYgKCFwcm9jZXNzZWQpXHR7XG5cdFx0XHRcdHByb2Nlc3NlZCA9IHRydWU7XG5cdFx0XHRcdGNhbnZhcyA9IHBsb3QuZ2V0Q2FudmFzKCk7XG5cdFx0XHRcdHRhcmdldCA9ICQoY2FudmFzKS5wYXJlbnQoKTtcblx0XHRcdFx0b3B0aW9ucyA9IHBsb3QuZ2V0T3B0aW9ucygpO1xuXHRcdFx0XHRwbG90LnNldERhdGEoY29tYmluZShwbG90LmdldERhdGEoKSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvbWJpbmUoZGF0YSkge1xuXG5cdFx0XHR2YXIgdG90YWwgPSAwLFxuXHRcdFx0XHRjb21iaW5lZCA9IDAsXG5cdFx0XHRcdG51bUNvbWJpbmVkID0gMCxcblx0XHRcdFx0Y29sb3IgPSBvcHRpb25zLnNlcmllcy5waWUuY29tYmluZS5jb2xvcixcblx0XHRcdFx0bmV3ZGF0YSA9IFtdO1xuXG5cdFx0XHQvLyBGaXggdXAgdGhlIHJhdyBkYXRhIGZyb20gRmxvdCwgZW5zdXJpbmcgdGhlIGRhdGEgaXMgbnVtZXJpY1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcblxuXHRcdFx0XHR2YXIgdmFsdWUgPSBkYXRhW2ldLmRhdGE7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGRhdGEgaXMgYW4gYXJyYXksIHdlJ2xsIGFzc3VtZSB0aGF0IGl0J3MgYSBzdGFuZGFyZFxuXHRcdFx0XHQvLyBGbG90IHgteSBwYWlyLCBhbmQgYXJlIGNvbmNlcm5lZCBvbmx5IHdpdGggdGhlIHNlY29uZCB2YWx1ZS5cblxuXHRcdFx0XHQvLyBOb3RlIGhvdyB3ZSB1c2UgdGhlIG9yaWdpbmFsIGFycmF5LCByYXRoZXIgdGhhbiBjcmVhdGluZyBhXG5cdFx0XHRcdC8vIG5ldyBvbmU7IHRoaXMgaXMgbW9yZSBlZmZpY2llbnQgYW5kIHByZXNlcnZlcyBhbnkgZXh0cmEgZGF0YVxuXHRcdFx0XHQvLyB0aGF0IHRoZSB1c2VyIG1heSBoYXZlIHN0b3JlZCBpbiBoaWdoZXIgaW5kZXhlcy5cblxuXHRcdFx0XHRpZiAoJC5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT0gMSkge1xuICAgIFx0XHRcdFx0dmFsdWUgPSB2YWx1ZVswXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICgkLmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdFx0Ly8gRXF1aXZhbGVudCB0byAkLmlzTnVtZXJpYygpIGJ1dCBjb21wYXRpYmxlIHdpdGggalF1ZXJ5IDwgMS43XG5cdFx0XHRcdFx0aWYgKCFpc05hTihwYXJzZUZsb2F0KHZhbHVlWzFdKSkgJiYgaXNGaW5pdGUodmFsdWVbMV0pKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZVsxXSA9ICt2YWx1ZVsxXTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dmFsdWVbMV0gPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICghaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKSkge1xuXHRcdFx0XHRcdHZhbHVlID0gWzEsICt2YWx1ZV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBbMSwgMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkYXRhW2ldLmRhdGEgPSBbdmFsdWVdO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdW0gdXAgYWxsIHRoZSBzbGljZXMsIHNvIHdlIGNhbiBjYWxjdWxhdGUgcGVyY2VudGFnZXMgZm9yIGVhY2hcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHRvdGFsICs9IGRhdGFbaV0uZGF0YVswXVsxXTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ291bnQgdGhlIG51bWJlciBvZiBzbGljZXMgd2l0aCBwZXJjZW50YWdlcyBiZWxvdyB0aGUgY29tYmluZVxuXHRcdFx0Ly8gdGhyZXNob2xkOyBpZiBpdCB0dXJucyBvdXQgdG8gYmUganVzdCBvbmUsIHdlIHdvbid0IGNvbWJpbmUuXG5cblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBkYXRhW2ldLmRhdGFbMF1bMV07XG5cdFx0XHRcdGlmICh2YWx1ZSAvIHRvdGFsIDw9IG9wdGlvbnMuc2VyaWVzLnBpZS5jb21iaW5lLnRocmVzaG9sZCkge1xuXHRcdFx0XHRcdGNvbWJpbmVkICs9IHZhbHVlO1xuXHRcdFx0XHRcdG51bUNvbWJpbmVkKys7XG5cdFx0XHRcdFx0aWYgKCFjb2xvcikge1xuXHRcdFx0XHRcdFx0Y29sb3IgPSBkYXRhW2ldLmNvbG9yO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gZGF0YVtpXS5kYXRhWzBdWzFdO1xuXHRcdFx0XHRpZiAobnVtQ29tYmluZWQgPCAyIHx8IHZhbHVlIC8gdG90YWwgPiBvcHRpb25zLnNlcmllcy5waWUuY29tYmluZS50aHJlc2hvbGQpIHtcblx0XHRcdFx0XHRuZXdkYXRhLnB1c2goXG5cdFx0XHRcdFx0XHQkLmV4dGVuZChkYXRhW2ldLCB7ICAgICAvKiBleHRlbmQgdG8gYWxsb3cga2VlcGluZyBhbGwgb3RoZXIgb3JpZ2luYWwgZGF0YSB2YWx1ZXNcblx0XHRcdFx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCB1c2luZyB0aGVtIGUuZy4gaW4gbGFiZWxGb3JtYXR0ZXIuICovXG5cdFx0XHRcdFx0XHRcdGRhdGE6IFtbMSwgdmFsdWVdXSxcblx0XHRcdFx0XHRcdFx0Y29sb3I6IGRhdGFbaV0uY29sb3IsXG5cdFx0XHRcdFx0XHRcdGxhYmVsOiBkYXRhW2ldLmxhYmVsLFxuXHRcdFx0XHRcdFx0XHRhbmdsZTogdmFsdWUgKiBNYXRoLlBJICogMiAvIHRvdGFsLFxuXHRcdFx0XHRcdFx0XHRwZXJjZW50OiB2YWx1ZSAvICh0b3RhbCAvIDEwMClcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobnVtQ29tYmluZWQgPiAxKSB7XG5cdFx0XHRcdG5ld2RhdGEucHVzaCh7XG5cdFx0XHRcdFx0ZGF0YTogW1sxLCBjb21iaW5lZF1dLFxuXHRcdFx0XHRcdGNvbG9yOiBjb2xvcixcblx0XHRcdFx0XHRsYWJlbDogb3B0aW9ucy5zZXJpZXMucGllLmNvbWJpbmUubGFiZWwsXG5cdFx0XHRcdFx0YW5nbGU6IGNvbWJpbmVkICogTWF0aC5QSSAqIDIgLyB0b3RhbCxcblx0XHRcdFx0XHRwZXJjZW50OiBjb21iaW5lZCAvICh0b3RhbCAvIDEwMClcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXdkYXRhO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRyYXcocGxvdCwgbmV3Q3R4KSB7XG5cblx0XHRcdGlmICghdGFyZ2V0KSB7XG5cdFx0XHRcdHJldHVybjsgLy8gaWYgbm8gc2VyaWVzIHdlcmUgcGFzc2VkXG5cdFx0XHR9XG5cblx0XHRcdHZhciBjYW52YXNXaWR0aCA9IHBsb3QuZ2V0UGxhY2Vob2xkZXIoKS53aWR0aCgpLFxuXHRcdFx0XHRjYW52YXNIZWlnaHQgPSBwbG90LmdldFBsYWNlaG9sZGVyKCkuaGVpZ2h0KCksXG5cdFx0XHRcdGxlZ2VuZFdpZHRoID0gdGFyZ2V0LmNoaWxkcmVuKCkuZmlsdGVyKFwiLmxlZ2VuZFwiKS5jaGlsZHJlbigpLndpZHRoKCkgfHwgMDtcblxuXHRcdFx0Y3R4ID0gbmV3Q3R4O1xuXG5cdFx0XHQvLyBXQVJOSU5HOiBIQUNLISBSRVdSSVRFIFRISVMgQ09ERSBBUyBTT09OIEFTIFBPU1NJQkxFIVxuXG5cdFx0XHQvLyBXaGVuIGNvbWJpbmluZyBzbWFsbGVyIHNsaWNlcyBpbnRvIGFuICdvdGhlcicgc2xpY2UsIHdlIG5lZWQgdG9cblx0XHRcdC8vIGFkZCBhIG5ldyBzZXJpZXMuICBTaW5jZSBGbG90IGdpdmVzIHBsdWdpbnMgbm8gd2F5IHRvIG1vZGlmeSB0aGVcblx0XHRcdC8vIGxpc3Qgb2Ygc2VyaWVzLCB0aGUgcGllIHBsdWdpbiB1c2VzIGEgaGFjayB3aGVyZSB0aGUgZmlyc3QgY2FsbFxuXHRcdFx0Ly8gdG8gcHJvY2Vzc0RhdGFwb2ludHMgcmVzdWx0cyBpbiBhIGNhbGwgdG8gc2V0RGF0YSB3aXRoIHRoZSBuZXdcblx0XHRcdC8vIGxpc3Qgb2Ygc2VyaWVzLCB0aGVuIHN1YnNlcXVlbnQgcHJvY2Vzc0RhdGFwb2ludHMgZG8gbm90aGluZy5cblxuXHRcdFx0Ly8gVGhlIHBsdWdpbi1nbG9iYWwgJ3Byb2Nlc3NlZCcgZmxhZyBpcyB1c2VkIHRvIGNvbnRyb2wgdGhpcyBoYWNrO1xuXHRcdFx0Ly8gaXQgc3RhcnRzIG91dCBmYWxzZSwgYW5kIGlzIHNldCB0byB0cnVlIGFmdGVyIHRoZSBmaXJzdCBjYWxsIHRvXG5cdFx0XHQvLyBwcm9jZXNzRGF0YXBvaW50cy5cblxuXHRcdFx0Ly8gVW5mb3J0dW5hdGVseSB0aGlzIHR1cm5zIGZ1dHVyZSBzZXREYXRhIGNhbGxzIGludG8gbm8tb3BzOyB0aGV5XG5cdFx0XHQvLyBjYWxsIHByb2Nlc3NEYXRhcG9pbnRzLCB0aGUgZmxhZyBpcyB0cnVlLCBhbmQgbm90aGluZyBoYXBwZW5zLlxuXG5cdFx0XHQvLyBUbyBmaXggdGhpcyB3ZSdsbCBzZXQgdGhlIGZsYWcgYmFjayB0byBmYWxzZSBoZXJlIGluIGRyYXcsIHdoZW5cblx0XHRcdC8vIGFsbCBzZXJpZXMgaGF2ZSBiZWVuIHByb2Nlc3NlZCwgc28gdGhlIG5leHQgc2VxdWVuY2Ugb2YgY2FsbHMgdG9cblx0XHRcdC8vIHByb2Nlc3NEYXRhcG9pbnRzIG9uY2UgYWdhaW4gc3RhcnRzIG91dCB3aXRoIGEgc2xpY2UtY29tYmluZS5cblx0XHRcdC8vIFRoaXMgaXMgcmVhbGx5IGEgaGFjazsgaW4gMC45IHdlIG5lZWQgdG8gZ2l2ZSBwbHVnaW5zIGEgcHJvcGVyXG5cdFx0XHQvLyB3YXkgdG8gbW9kaWZ5IHNlcmllcyBiZWZvcmUgYW55IHByb2Nlc3NpbmcgYmVnaW5zLlxuXG5cdFx0XHRwcm9jZXNzZWQgPSBmYWxzZTtcblxuXHRcdFx0Ly8gY2FsY3VsYXRlIG1heGltdW0gcmFkaXVzIGFuZCBjZW50ZXIgcG9pbnRcblxuXHRcdFx0bWF4UmFkaXVzID0gIE1hdGgubWluKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQgLyBvcHRpb25zLnNlcmllcy5waWUudGlsdCkgLyAyO1xuXHRcdFx0Y2VudGVyVG9wID0gY2FudmFzSGVpZ2h0IC8gMiArIG9wdGlvbnMuc2VyaWVzLnBpZS5vZmZzZXQudG9wO1xuXHRcdFx0Y2VudGVyTGVmdCA9IGNhbnZhc1dpZHRoIC8gMjtcblxuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5vZmZzZXQubGVmdCA9PSBcImF1dG9cIikge1xuXHRcdFx0XHRpZiAob3B0aW9ucy5sZWdlbmQucG9zaXRpb24ubWF0Y2goXCJ3XCIpKSB7XG5cdFx0XHRcdFx0Y2VudGVyTGVmdCArPSBsZWdlbmRXaWR0aCAvIDI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2VudGVyTGVmdCAtPSBsZWdlbmRXaWR0aCAvIDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNlbnRlckxlZnQgPCBtYXhSYWRpdXMpIHtcblx0XHRcdFx0XHRjZW50ZXJMZWZ0ID0gbWF4UmFkaXVzO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNlbnRlckxlZnQgPiBjYW52YXNXaWR0aCAtIG1heFJhZGl1cykge1xuXHRcdFx0XHRcdGNlbnRlckxlZnQgPSBjYW52YXNXaWR0aCAtIG1heFJhZGl1cztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2VudGVyTGVmdCArPSBvcHRpb25zLnNlcmllcy5waWUub2Zmc2V0LmxlZnQ7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzbGljZXMgPSBwbG90LmdldERhdGEoKSxcblx0XHRcdFx0YXR0ZW1wdHMgPSAwO1xuXG5cdFx0XHQvLyBLZWVwIHNocmlua2luZyB0aGUgcGllJ3MgcmFkaXVzIHVudGlsIGRyYXdQaWUgcmV0dXJucyB0cnVlLFxuXHRcdFx0Ly8gaW5kaWNhdGluZyB0aGF0IGFsbCB0aGUgbGFiZWxzIGZpdCwgb3Igd2UgdHJ5IHRvbyBtYW55IHRpbWVzLlxuXG5cdFx0XHRkbyB7XG5cdFx0XHRcdGlmIChhdHRlbXB0cyA+IDApIHtcblx0XHRcdFx0XHRtYXhSYWRpdXMgKj0gUkVEUkFXX1NIUklOSztcblx0XHRcdFx0fVxuXHRcdFx0XHRhdHRlbXB0cyArPSAxO1xuXHRcdFx0XHRjbGVhcigpO1xuXHRcdFx0XHRpZiAob3B0aW9ucy5zZXJpZXMucGllLnRpbHQgPD0gMC44KSB7XG5cdFx0XHRcdFx0ZHJhd1NoYWRvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IHdoaWxlICghZHJhd1BpZSgpICYmIGF0dGVtcHRzIDwgUkVEUkFXX0FUVEVNUFRTKVxuXG5cdFx0XHRpZiAoYXR0ZW1wdHMgPj0gUkVEUkFXX0FUVEVNUFRTKSB7XG5cdFx0XHRcdGNsZWFyKCk7XG5cdFx0XHRcdHRhcmdldC5wcmVwZW5kKFwiPGRpdiBjbGFzcz0nZXJyb3InPkNvdWxkIG5vdCBkcmF3IHBpZSB3aXRoIGxhYmVscyBjb250YWluZWQgaW5zaWRlIGNhbnZhczwvZGl2PlwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHBsb3Quc2V0U2VyaWVzICYmIHBsb3QuaW5zZXJ0TGVnZW5kKSB7XG5cdFx0XHRcdHBsb3Quc2V0U2VyaWVzKHNsaWNlcyk7XG5cdFx0XHRcdHBsb3QuaW5zZXJ0TGVnZW5kKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdlJ3JlIGFjdHVhbGx5IGRvbmUgYXQgdGhpcyBwb2ludCwganVzdCBkZWZpbmluZyBpbnRlcm5hbCBmdW5jdGlvbnMgYXQgdGhpcyBwb2ludFxuXG5cdFx0XHRmdW5jdGlvbiBjbGVhcigpIHtcblx0XHRcdFx0Y3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcblx0XHRcdFx0dGFyZ2V0LmNoaWxkcmVuKCkuZmlsdGVyKFwiLnBpZUxhYmVsLCAucGllTGFiZWxCYWNrZ3JvdW5kXCIpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBkcmF3U2hhZG93KCkge1xuXG5cdFx0XHRcdHZhciBzaGFkb3dMZWZ0ID0gb3B0aW9ucy5zZXJpZXMucGllLnNoYWRvdy5sZWZ0O1xuXHRcdFx0XHR2YXIgc2hhZG93VG9wID0gb3B0aW9ucy5zZXJpZXMucGllLnNoYWRvdy50b3A7XG5cdFx0XHRcdHZhciBlZGdlID0gMTA7XG5cdFx0XHRcdHZhciBhbHBoYSA9IG9wdGlvbnMuc2VyaWVzLnBpZS5zaGFkb3cuYWxwaGE7XG5cdFx0XHRcdHZhciByYWRpdXMgPSBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID4gMSA/IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgOiBtYXhSYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzO1xuXG5cdFx0XHRcdGlmIChyYWRpdXMgPj0gY2FudmFzV2lkdGggLyAyIC0gc2hhZG93TGVmdCB8fCByYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUudGlsdCA+PSBjYW52YXNIZWlnaHQgLyAyIC0gc2hhZG93VG9wIHx8IHJhZGl1cyA8PSBlZGdlKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1x0Ly8gc2hhZG93IHdvdWxkIGJlIG91dHNpZGUgY2FudmFzLCBzbyBkb24ndCBkcmF3IGl0XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0XHRjdHgudHJhbnNsYXRlKHNoYWRvd0xlZnQsc2hhZG93VG9wKTtcblx0XHRcdFx0Y3R4Lmdsb2JhbEFscGhhID0gYWxwaGE7XG5cdFx0XHRcdGN0eC5maWxsU3R5bGUgPSBcIiMwMDBcIjtcblxuXHRcdFx0XHQvLyBjZW50ZXIgYW5kIHJvdGF0ZSB0byBzdGFydGluZyBwb3NpdGlvblxuXG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY2VudGVyTGVmdCxjZW50ZXJUb3ApO1xuXHRcdFx0XHRjdHguc2NhbGUoMSwgb3B0aW9ucy5zZXJpZXMucGllLnRpbHQpO1xuXG5cdFx0XHRcdC8vcmFkaXVzIC09IGVkZ2U7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gZWRnZTsgaSsrKSB7XG5cdFx0XHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuXHRcdFx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRcdFx0cmFkaXVzIC09IGk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBkcmF3UGllKCkge1xuXG5cdFx0XHRcdHZhciBzdGFydEFuZ2xlID0gTWF0aC5QSSAqIG9wdGlvbnMuc2VyaWVzLnBpZS5zdGFydEFuZ2xlO1xuXHRcdFx0XHR2YXIgcmFkaXVzID0gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA+IDEgPyBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzIDogbWF4UmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cztcblxuXHRcdFx0XHQvLyBjZW50ZXIgYW5kIHJvdGF0ZSB0byBzdGFydGluZyBwb3NpdGlvblxuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdGN0eC50cmFuc2xhdGUoY2VudGVyTGVmdCxjZW50ZXJUb3ApO1xuXHRcdFx0XHRjdHguc2NhbGUoMSwgb3B0aW9ucy5zZXJpZXMucGllLnRpbHQpO1xuXHRcdFx0XHQvL2N0eC5yb3RhdGUoc3RhcnRBbmdsZSk7IC8vIHN0YXJ0IGF0IHRvcDsgLS0gVGhpcyBkb2Vzbid0IHdvcmsgcHJvcGVybHkgaW4gT3BlcmFcblxuXHRcdFx0XHQvLyBkcmF3IHNsaWNlc1xuXG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRcdHZhciBjdXJyZW50QW5nbGUgPSBzdGFydEFuZ2xlO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlcy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdHNsaWNlc1tpXS5zdGFydEFuZ2xlID0gY3VycmVudEFuZ2xlO1xuXHRcdFx0XHRcdGRyYXdTbGljZShzbGljZXNbaV0uYW5nbGUsIHNsaWNlc1tpXS5jb2xvciwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblxuXHRcdFx0XHQvLyBkcmF3IHNsaWNlIG91dGxpbmVzXG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5zdHJva2Uud2lkdGggPiAwKSB7XG5cdFx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0XHRjdHgubGluZVdpZHRoID0gb3B0aW9ucy5zZXJpZXMucGllLnN0cm9rZS53aWR0aDtcblx0XHRcdFx0XHRjdXJyZW50QW5nbGUgPSBzdGFydEFuZ2xlO1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0XHRkcmF3U2xpY2Uoc2xpY2VzW2ldLmFuZ2xlLCBvcHRpb25zLnNlcmllcy5waWUuc3Ryb2tlLmNvbG9yLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBkcmF3IGRvbnV0IGhvbGVcblxuXHRcdFx0XHRkcmF3RG9udXRIb2xlKGN0eCk7XG5cblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblxuXHRcdFx0XHQvLyBEcmF3IHRoZSBsYWJlbHMsIHJldHVybmluZyB0cnVlIGlmIHRoZXkgZml0IHdpdGhpbiB0aGUgcGxvdFxuXG5cdFx0XHRcdGlmIChvcHRpb25zLnNlcmllcy5waWUubGFiZWwuc2hvdykge1xuXHRcdFx0XHRcdHJldHVybiBkcmF3TGFiZWxzKCk7XG5cdFx0XHRcdH0gZWxzZSByZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHRmdW5jdGlvbiBkcmF3U2xpY2UoYW5nbGUsIGNvbG9yLCBmaWxsKSB7XG5cblx0XHRcdFx0XHRpZiAoYW5nbGUgPD0gMCB8fCBpc05hTihhbmdsZSkpIHtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZmlsbCkge1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcblx0XHRcdFx0XHRcdGN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0aWYgKE1hdGguYWJzKGFuZ2xlIC0gTWF0aC5QSSAqIDIpID4gMC4wMDAwMDAwMDEpIHtcblx0XHRcdFx0XHRcdGN0eC5tb3ZlVG8oMCwgMCk7IC8vIENlbnRlciBvZiB0aGUgcGllXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly9jdHguYXJjKDAsIDAsIHJhZGl1cywgMCwgYW5nbGUsIGZhbHNlKTsgLy8gVGhpcyBkb2Vzbid0IHdvcmsgcHJvcGVybHkgaW4gT3BlcmFcblx0XHRcdFx0XHRjdHguYXJjKDAsIDAsIHJhZGl1cyxjdXJyZW50QW5nbGUsIGN1cnJlbnRBbmdsZSArIGFuZ2xlIC8gMiwgZmFsc2UpO1xuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgcmFkaXVzLGN1cnJlbnRBbmdsZSArIGFuZ2xlIC8gMiwgY3VycmVudEFuZ2xlICsgYW5nbGUsIGZhbHNlKTtcblx0XHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0Ly9jdHgucm90YXRlKGFuZ2xlKTsgLy8gVGhpcyBkb2Vzbid0IHdvcmsgcHJvcGVybHkgaW4gT3BlcmFcblx0XHRcdFx0XHRjdXJyZW50QW5nbGUgKz0gYW5nbGU7XG5cblx0XHRcdFx0XHRpZiAoZmlsbCkge1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGwoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIGRyYXdMYWJlbHMoKSB7XG5cblx0XHRcdFx0XHR2YXIgY3VycmVudEFuZ2xlID0gc3RhcnRBbmdsZTtcblx0XHRcdFx0XHR2YXIgcmFkaXVzID0gb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnJhZGl1cyA+IDEgPyBvcHRpb25zLnNlcmllcy5waWUubGFiZWwucmFkaXVzIDogbWF4UmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnJhZGl1cztcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0XHRpZiAoc2xpY2VzW2ldLnBlcmNlbnQgPj0gb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLnRocmVzaG9sZCAqIDEwMCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIWRyYXdMYWJlbChzbGljZXNbaV0sIGN1cnJlbnRBbmdsZSwgaSkpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnJlbnRBbmdsZSArPSBzbGljZXNbaV0uYW5nbGU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdFx0XHRmdW5jdGlvbiBkcmF3TGFiZWwoc2xpY2UsIHN0YXJ0QW5nbGUsIGluZGV4KSB7XG5cblx0XHRcdFx0XHRcdGlmIChzbGljZS5kYXRhWzBdWzFdID09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIGZvcm1hdCBsYWJlbCB0ZXh0XG5cblx0XHRcdFx0XHRcdHZhciBsZiA9IG9wdGlvbnMubGVnZW5kLmxhYmVsRm9ybWF0dGVyLCB0ZXh0LCBwbGYgPSBvcHRpb25zLnNlcmllcy5waWUubGFiZWwuZm9ybWF0dGVyO1xuXG5cdFx0XHRcdFx0XHRpZiAobGYpIHtcblx0XHRcdFx0XHRcdFx0dGV4dCA9IGxmKHNsaWNlLmxhYmVsLCBzbGljZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0ZXh0ID0gc2xpY2UubGFiZWw7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChwbGYpIHtcblx0XHRcdFx0XHRcdFx0dGV4dCA9IHBsZih0ZXh0LCBzbGljZSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBoYWxmQW5nbGUgPSAoKHN0YXJ0QW5nbGUgKyBzbGljZS5hbmdsZSkgKyBzdGFydEFuZ2xlKSAvIDI7XG5cdFx0XHRcdFx0XHR2YXIgeCA9IGNlbnRlckxlZnQgKyBNYXRoLnJvdW5kKE1hdGguY29zKGhhbGZBbmdsZSkgKiByYWRpdXMpO1xuXHRcdFx0XHRcdFx0dmFyIHkgPSBjZW50ZXJUb3AgKyBNYXRoLnJvdW5kKE1hdGguc2luKGhhbGZBbmdsZSkgKiByYWRpdXMpICogb3B0aW9ucy5zZXJpZXMucGllLnRpbHQ7XG5cblx0XHRcdFx0XHRcdHZhciBodG1sID0gXCI8c3BhbiBjbGFzcz0ncGllTGFiZWwnIGlkPSdwaWVMYWJlbFwiICsgaW5kZXggKyBcIicgc3R5bGU9J3Bvc2l0aW9uOmFic29sdXRlO3RvcDpcIiArIHkgKyBcInB4O2xlZnQ6XCIgKyB4ICsgXCJweDsnPlwiICsgdGV4dCArIFwiPC9zcGFuPlwiO1xuXHRcdFx0XHRcdFx0dGFyZ2V0LmFwcGVuZChodG1sKTtcblxuXHRcdFx0XHRcdFx0dmFyIGxhYmVsID0gdGFyZ2V0LmNoaWxkcmVuKFwiI3BpZUxhYmVsXCIgKyBpbmRleCk7XG5cdFx0XHRcdFx0XHR2YXIgbGFiZWxUb3AgPSAoeSAtIGxhYmVsLmhlaWdodCgpIC8gMik7XG5cdFx0XHRcdFx0XHR2YXIgbGFiZWxMZWZ0ID0gKHggLSBsYWJlbC53aWR0aCgpIC8gMik7XG5cblx0XHRcdFx0XHRcdGxhYmVsLmNzcyhcInRvcFwiLCBsYWJlbFRvcCk7XG5cdFx0XHRcdFx0XHRsYWJlbC5jc3MoXCJsZWZ0XCIsIGxhYmVsTGVmdCk7XG5cblx0XHRcdFx0XHRcdC8vIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBsYWJlbCBpcyBub3Qgb3V0c2lkZSB0aGUgY2FudmFzXG5cblx0XHRcdFx0XHRcdGlmICgwIC0gbGFiZWxUb3AgPiAwIHx8IDAgLSBsYWJlbExlZnQgPiAwIHx8IGNhbnZhc0hlaWdodCAtIChsYWJlbFRvcCArIGxhYmVsLmhlaWdodCgpKSA8IDAgfHwgY2FudmFzV2lkdGggLSAobGFiZWxMZWZ0ICsgbGFiZWwud2lkdGgoKSkgPCAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5sYWJlbC5iYWNrZ3JvdW5kLm9wYWNpdHkgIT0gMCkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIHB1dCBpbiB0aGUgdHJhbnNwYXJlbnQgYmFja2dyb3VuZCBzZXBhcmF0ZWx5IHRvIGF2b2lkIGJsZW5kZWQgbGFiZWxzIGFuZCBsYWJlbCBib3hlc1xuXG5cdFx0XHRcdFx0XHRcdHZhciBjID0gb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLmJhY2tncm91bmQuY29sb3I7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGMgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdGMgPSBzbGljZS5jb2xvcjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHZhciBwb3MgPSBcInRvcDpcIiArIGxhYmVsVG9wICsgXCJweDtsZWZ0OlwiICsgbGFiZWxMZWZ0ICsgXCJweDtcIjtcblx0XHRcdFx0XHRcdFx0JChcIjxkaXYgY2xhc3M9J3BpZUxhYmVsQmFja2dyb3VuZCcgc3R5bGU9J3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOlwiICsgbGFiZWwud2lkdGgoKSArIFwicHg7aGVpZ2h0OlwiICsgbGFiZWwuaGVpZ2h0KCkgKyBcInB4O1wiICsgcG9zICsgXCJiYWNrZ3JvdW5kLWNvbG9yOlwiICsgYyArIFwiOyc+PC9kaXY+XCIpXG5cdFx0XHRcdFx0XHRcdFx0LmNzcyhcIm9wYWNpdHlcIiwgb3B0aW9ucy5zZXJpZXMucGllLmxhYmVsLmJhY2tncm91bmQub3BhY2l0eSlcblx0XHRcdFx0XHRcdFx0XHQuaW5zZXJ0QmVmb3JlKGxhYmVsKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fSAvLyBlbmQgaW5kaXZpZHVhbCBsYWJlbCBmdW5jdGlvblxuXHRcdFx0XHR9IC8vIGVuZCBkcmF3TGFiZWxzIGZ1bmN0aW9uXG5cdFx0XHR9IC8vIGVuZCBkcmF3UGllIGZ1bmN0aW9uXG5cdFx0fSAvLyBlbmQgZHJhdyBmdW5jdGlvblxuXG5cdFx0Ly8gUGxhY2VkIGhlcmUgYmVjYXVzZSBpdCBuZWVkcyB0byBiZSBhY2Nlc3NlZCBmcm9tIG11bHRpcGxlIGxvY2F0aW9uc1xuXG5cdFx0ZnVuY3Rpb24gZHJhd0RvbnV0SG9sZShsYXllcikge1xuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWVzLnBpZS5pbm5lclJhZGl1cyA+IDApIHtcblxuXHRcdFx0XHQvLyBzdWJ0cmFjdCB0aGUgY2VudGVyXG5cblx0XHRcdFx0bGF5ZXIuc2F2ZSgpO1xuXHRcdFx0XHR2YXIgaW5uZXJSYWRpdXMgPSBvcHRpb25zLnNlcmllcy5waWUuaW5uZXJSYWRpdXMgPiAxID8gb3B0aW9ucy5zZXJpZXMucGllLmlubmVyUmFkaXVzIDogbWF4UmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLmlubmVyUmFkaXVzO1xuXHRcdFx0XHRsYXllci5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcImRlc3RpbmF0aW9uLW91dFwiOyAvLyB0aGlzIGRvZXMgbm90IHdvcmsgd2l0aCBleGNhbnZhcywgYnV0IGl0IHdpbGwgZmFsbCBiYWNrIHRvIHVzaW5nIHRoZSBzdHJva2UgY29sb3Jcblx0XHRcdFx0bGF5ZXIuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdGxheWVyLmZpbGxTdHlsZSA9IG9wdGlvbnMuc2VyaWVzLnBpZS5zdHJva2UuY29sb3I7XG5cdFx0XHRcdGxheWVyLmFyYygwLCAwLCBpbm5lclJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcblx0XHRcdFx0bGF5ZXIuZmlsbCgpO1xuXHRcdFx0XHRsYXllci5jbG9zZVBhdGgoKTtcblx0XHRcdFx0bGF5ZXIucmVzdG9yZSgpO1xuXG5cdFx0XHRcdC8vIGFkZCBpbm5lciBzdHJva2VcblxuXHRcdFx0XHRsYXllci5zYXZlKCk7XG5cdFx0XHRcdGxheWVyLmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRsYXllci5zdHJva2VTdHlsZSA9IG9wdGlvbnMuc2VyaWVzLnBpZS5zdHJva2UuY29sb3I7XG5cdFx0XHRcdGxheWVyLmFyYygwLCAwLCBpbm5lclJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcblx0XHRcdFx0bGF5ZXIuc3Ryb2tlKCk7XG5cdFx0XHRcdGxheWVyLmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRsYXllci5yZXN0b3JlKCk7XG5cblx0XHRcdFx0Ly8gVE9ETzogYWRkIGV4dHJhIHNoYWRvdyBpbnNpZGUgaG9sZSAod2l0aCBhIG1hc2spIGlmIHRoZSBwaWUgaXMgdGlsdGVkLlxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vLS0gQWRkaXRpb25hbCBJbnRlcmFjdGl2ZSByZWxhdGVkIGZ1bmN0aW9ucyAtLVxuXG5cdFx0ZnVuY3Rpb24gaXNQb2ludEluUG9seShwb2x5LCBwdCkge1xuXHRcdFx0Zm9yKHZhciBjID0gZmFsc2UsIGkgPSAtMSwgbCA9IHBvbHkubGVuZ3RoLCBqID0gbCAtIDE7ICsraSA8IGw7IGogPSBpKVxuXHRcdFx0XHQoKHBvbHlbaV1bMV0gPD0gcHRbMV0gJiYgcHRbMV0gPCBwb2x5W2pdWzFdKSB8fCAocG9seVtqXVsxXSA8PSBwdFsxXSAmJiBwdFsxXTwgcG9seVtpXVsxXSkpXG5cdFx0XHRcdCYmIChwdFswXSA8IChwb2x5W2pdWzBdIC0gcG9seVtpXVswXSkgKiAocHRbMV0gLSBwb2x5W2ldWzFdKSAvIChwb2x5W2pdWzFdIC0gcG9seVtpXVsxXSkgKyBwb2x5W2ldWzBdKVxuXHRcdFx0XHQmJiAoYyA9ICFjKTtcblx0XHRcdHJldHVybiBjO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGZpbmROZWFyYnlTbGljZShtb3VzZVgsIG1vdXNlWSkge1xuXG5cdFx0XHR2YXIgc2xpY2VzID0gcGxvdC5nZXREYXRhKCksXG5cdFx0XHRcdG9wdGlvbnMgPSBwbG90LmdldE9wdGlvbnMoKSxcblx0XHRcdFx0cmFkaXVzID0gb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyA+IDEgPyBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzIDogbWF4UmFkaXVzICogb3B0aW9ucy5zZXJpZXMucGllLnJhZGl1cyxcblx0XHRcdFx0eCwgeTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZXMubGVuZ3RoOyArK2kpIHtcblxuXHRcdFx0XHR2YXIgcyA9IHNsaWNlc1tpXTtcblxuXHRcdFx0XHRpZiAocy5waWUuc2hvdykge1xuXG5cdFx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0Y3R4Lm1vdmVUbygwLCAwKTsgLy8gQ2VudGVyIG9mIHRoZSBwaWVcblx0XHRcdFx0XHQvL2N0eC5zY2FsZSgxLCBvcHRpb25zLnNlcmllcy5waWUudGlsdCk7XHQvLyB0aGlzIGFjdHVhbGx5IHNlZW1zIHRvIGJyZWFrIGV2ZXJ5dGhpbmcgd2hlbiBoZXJlLlxuXHRcdFx0XHRcdGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBzLnN0YXJ0QW5nbGUsIHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyAyLCBmYWxzZSk7XG5cdFx0XHRcdFx0Y3R4LmFyYygwLCAwLCByYWRpdXMsIHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyAyLCBzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlLCBmYWxzZSk7XG5cdFx0XHRcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdHggPSBtb3VzZVggLSBjZW50ZXJMZWZ0O1xuXHRcdFx0XHRcdHkgPSBtb3VzZVkgLSBjZW50ZXJUb3A7XG5cblx0XHRcdFx0XHRpZiAoY3R4LmlzUG9pbnRJblBhdGgpIHtcblx0XHRcdFx0XHRcdGlmIChjdHguaXNQb2ludEluUGF0aChtb3VzZVggLSBjZW50ZXJMZWZ0LCBtb3VzZVkgLSBjZW50ZXJUb3ApKSB7XG5cdFx0XHRcdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdFx0ZGF0YXBvaW50OiBbcy5wZXJjZW50LCBzLmRhdGFdLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGFJbmRleDogMCxcblx0XHRcdFx0XHRcdFx0XHRzZXJpZXM6IHMsXG5cdFx0XHRcdFx0XHRcdFx0c2VyaWVzSW5kZXg6IGlcblx0XHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHQvLyBleGNhbnZhcyBmb3IgSUUgZG9lc247dCBzdXBwb3J0IGlzUG9pbnRJblBhdGgsIHRoaXMgaXMgYSB3b3JrYXJvdW5kLlxuXG5cdFx0XHRcdFx0XHR2YXIgcDFYID0gcmFkaXVzICogTWF0aC5jb3Mocy5zdGFydEFuZ2xlKSxcblx0XHRcdFx0XHRcdFx0cDFZID0gcmFkaXVzICogTWF0aC5zaW4ocy5zdGFydEFuZ2xlKSxcblx0XHRcdFx0XHRcdFx0cDJYID0gcmFkaXVzICogTWF0aC5jb3Mocy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDQpLFxuXHRcdFx0XHRcdFx0XHRwMlkgPSByYWRpdXMgKiBNYXRoLnNpbihzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gNCksXG5cdFx0XHRcdFx0XHRcdHAzWCA9IHJhZGl1cyAqIE1hdGguY29zKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUgLyAyKSxcblx0XHRcdFx0XHRcdFx0cDNZID0gcmFkaXVzICogTWF0aC5zaW4ocy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDIpLFxuXHRcdFx0XHRcdFx0XHRwNFggPSByYWRpdXMgKiBNYXRoLmNvcyhzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlIC8gMS41KSxcblx0XHRcdFx0XHRcdFx0cDRZID0gcmFkaXVzICogTWF0aC5zaW4ocy5zdGFydEFuZ2xlICsgcy5hbmdsZSAvIDEuNSksXG5cdFx0XHRcdFx0XHRcdHA1WCA9IHJhZGl1cyAqIE1hdGguY29zKHMuc3RhcnRBbmdsZSArIHMuYW5nbGUpLFxuXHRcdFx0XHRcdFx0XHRwNVkgPSByYWRpdXMgKiBNYXRoLnNpbihzLnN0YXJ0QW5nbGUgKyBzLmFuZ2xlKSxcblx0XHRcdFx0XHRcdFx0YXJyUG9seSA9IFtbMCwgMF0sIFtwMVgsIHAxWV0sIFtwMlgsIHAyWV0sIFtwM1gsIHAzWV0sIFtwNFgsIHA0WV0sIFtwNVgsIHA1WV1dLFxuXHRcdFx0XHRcdFx0XHRhcnJQb2ludCA9IFt4LCB5XTtcblxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogcGVyaGFwcyBkbyBzb21lIG1hdGhtYXRpY2FsIHRyaWNrZXJ5IGhlcmUgd2l0aCB0aGUgWS1jb29yZGluYXRlIHRvIGNvbXBlbnNhdGUgZm9yIHBpZSB0aWx0P1xuXG5cdFx0XHRcdFx0XHRpZiAoaXNQb2ludEluUG9seShhcnJQb2x5LCBhcnJQb2ludCkpIHtcblx0XHRcdFx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHRkYXRhcG9pbnQ6IFtzLnBlcmNlbnQsIHMuZGF0YV0sXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUluZGV4OiAwLFxuXHRcdFx0XHRcdFx0XHRcdHNlcmllczogcyxcblx0XHRcdFx0XHRcdFx0XHRzZXJpZXNJbmRleDogaVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xuXHRcdFx0dHJpZ2dlckNsaWNrSG92ZXJFdmVudChcInBsb3Rob3ZlclwiLCBlKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbkNsaWNrKGUpIHtcblx0XHRcdHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoXCJwbG90Y2xpY2tcIiwgZSk7XG5cdFx0fVxuXG5cdFx0Ly8gdHJpZ2dlciBjbGljayBvciBob3ZlciBldmVudCAodGhleSBzZW5kIHRoZSBzYW1lIHBhcmFtZXRlcnMgc28gd2Ugc2hhcmUgdGhlaXIgY29kZSlcblxuXHRcdGZ1bmN0aW9uIHRyaWdnZXJDbGlja0hvdmVyRXZlbnQoZXZlbnRuYW1lLCBlKSB7XG5cblx0XHRcdHZhciBvZmZzZXQgPSBwbG90Lm9mZnNldCgpO1xuXHRcdFx0dmFyIGNhbnZhc1ggPSBwYXJzZUludChlLnBhZ2VYIC0gb2Zmc2V0LmxlZnQpO1xuXHRcdFx0dmFyIGNhbnZhc1kgPSAgcGFyc2VJbnQoZS5wYWdlWSAtIG9mZnNldC50b3ApO1xuXHRcdFx0dmFyIGl0ZW0gPSBmaW5kTmVhcmJ5U2xpY2UoY2FudmFzWCwgY2FudmFzWSk7XG5cblx0XHRcdGlmIChvcHRpb25zLmdyaWQuYXV0b0hpZ2hsaWdodCkge1xuXG5cdFx0XHRcdC8vIGNsZWFyIGF1dG8taGlnaGxpZ2h0c1xuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaGlnaGxpZ2h0cy5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdHZhciBoID0gaGlnaGxpZ2h0c1tpXTtcblx0XHRcdFx0XHRpZiAoaC5hdXRvID09IGV2ZW50bmFtZSAmJiAhKGl0ZW0gJiYgaC5zZXJpZXMgPT0gaXRlbS5zZXJpZXMpKSB7XG5cdFx0XHRcdFx0XHR1bmhpZ2hsaWdodChoLnNlcmllcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGhpZ2hsaWdodCB0aGUgc2xpY2VcblxuXHRcdFx0aWYgKGl0ZW0pIHtcblx0XHRcdFx0aGlnaGxpZ2h0KGl0ZW0uc2VyaWVzLCBldmVudG5hbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB0cmlnZ2VyIGFueSBob3ZlciBiaW5kIGV2ZW50c1xuXG5cdFx0XHR2YXIgcG9zID0geyBwYWdlWDogZS5wYWdlWCwgcGFnZVk6IGUucGFnZVkgfTtcblx0XHRcdHRhcmdldC50cmlnZ2VyKGV2ZW50bmFtZSwgW3BvcywgaXRlbV0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhpZ2hsaWdodChzLCBhdXRvKSB7XG5cdFx0XHQvL2lmICh0eXBlb2YgcyA9PSBcIm51bWJlclwiKSB7XG5cdFx0XHQvL1x0cyA9IHNlcmllc1tzXTtcblx0XHRcdC8vfVxuXG5cdFx0XHR2YXIgaSA9IGluZGV4T2ZIaWdobGlnaHQocyk7XG5cblx0XHRcdGlmIChpID09IC0xKSB7XG5cdFx0XHRcdGhpZ2hsaWdodHMucHVzaCh7IHNlcmllczogcywgYXV0bzogYXV0byB9KTtcblx0XHRcdFx0cGxvdC50cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuXHRcdFx0fSBlbHNlIGlmICghYXV0bykge1xuXHRcdFx0XHRoaWdobGlnaHRzW2ldLmF1dG8gPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiB1bmhpZ2hsaWdodChzKSB7XG5cdFx0XHRpZiAocyA9PSBudWxsKSB7XG5cdFx0XHRcdGhpZ2hsaWdodHMgPSBbXTtcblx0XHRcdFx0cGxvdC50cmlnZ2VyUmVkcmF3T3ZlcmxheSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvL2lmICh0eXBlb2YgcyA9PSBcIm51bWJlclwiKSB7XG5cdFx0XHQvL1x0cyA9IHNlcmllc1tzXTtcblx0XHRcdC8vfVxuXG5cdFx0XHR2YXIgaSA9IGluZGV4T2ZIaWdobGlnaHQocyk7XG5cblx0XHRcdGlmIChpICE9IC0xKSB7XG5cdFx0XHRcdGhpZ2hsaWdodHMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRwbG90LnRyaWdnZXJSZWRyYXdPdmVybGF5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW5kZXhPZkhpZ2hsaWdodChzKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dmFyIGggPSBoaWdobGlnaHRzW2ldO1xuXHRcdFx0XHRpZiAoaC5zZXJpZXMgPT0gcylcblx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAtMTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkcmF3T3ZlcmxheShwbG90LCBvY3R4KSB7XG5cblx0XHRcdHZhciBvcHRpb25zID0gcGxvdC5nZXRPcHRpb25zKCk7XG5cblx0XHRcdHZhciByYWRpdXMgPSBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzID4gMSA/IG9wdGlvbnMuc2VyaWVzLnBpZS5yYWRpdXMgOiBtYXhSYWRpdXMgKiBvcHRpb25zLnNlcmllcy5waWUucmFkaXVzO1xuXG5cdFx0XHRvY3R4LnNhdmUoKTtcblx0XHRcdG9jdHgudHJhbnNsYXRlKGNlbnRlckxlZnQsIGNlbnRlclRvcCk7XG5cdFx0XHRvY3R4LnNjYWxlKDEsIG9wdGlvbnMuc2VyaWVzLnBpZS50aWx0KTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBoaWdobGlnaHRzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdGRyYXdIaWdobGlnaHQoaGlnaGxpZ2h0c1tpXS5zZXJpZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRkcmF3RG9udXRIb2xlKG9jdHgpO1xuXG5cdFx0XHRvY3R4LnJlc3RvcmUoKTtcblxuXHRcdFx0ZnVuY3Rpb24gZHJhd0hpZ2hsaWdodChzZXJpZXMpIHtcblxuXHRcdFx0XHRpZiAoc2VyaWVzLmFuZ2xlIDw9IDAgfHwgaXNOYU4oc2VyaWVzLmFuZ2xlKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vb2N0eC5maWxsU3R5bGUgPSBwYXJzZUNvbG9yKG9wdGlvbnMuc2VyaWVzLnBpZS5oaWdobGlnaHQuY29sb3IpLnNjYWxlKG51bGwsIG51bGwsIG51bGwsIG9wdGlvbnMuc2VyaWVzLnBpZS5oaWdobGlnaHQub3BhY2l0eSkudG9TdHJpbmcoKTtcblx0XHRcdFx0b2N0eC5maWxsU3R5bGUgPSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgXCIgKyBvcHRpb25zLnNlcmllcy5waWUuaGlnaGxpZ2h0Lm9wYWNpdHkgKyBcIilcIjsgLy8gdGhpcyBpcyB0ZW1wb3JhcnkgdW50aWwgd2UgaGF2ZSBhY2Nlc3MgdG8gcGFyc2VDb2xvclxuXHRcdFx0XHRvY3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0XHRpZiAoTWF0aC5hYnMoc2VyaWVzLmFuZ2xlIC0gTWF0aC5QSSAqIDIpID4gMC4wMDAwMDAwMDEpIHtcblx0XHRcdFx0XHRvY3R4Lm1vdmVUbygwLCAwKTsgLy8gQ2VudGVyIG9mIHRoZSBwaWVcblx0XHRcdFx0fVxuXHRcdFx0XHRvY3R4LmFyYygwLCAwLCByYWRpdXMsIHNlcmllcy5zdGFydEFuZ2xlLCBzZXJpZXMuc3RhcnRBbmdsZSArIHNlcmllcy5hbmdsZSAvIDIsIGZhbHNlKTtcblx0XHRcdFx0b2N0eC5hcmMoMCwgMCwgcmFkaXVzLCBzZXJpZXMuc3RhcnRBbmdsZSArIHNlcmllcy5hbmdsZSAvIDIsIHNlcmllcy5zdGFydEFuZ2xlICsgc2VyaWVzLmFuZ2xlLCBmYWxzZSk7XG5cdFx0XHRcdG9jdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdG9jdHguZmlsbCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSAvLyBlbmQgaW5pdCAocGx1Z2luIGJvZHkpXG5cblx0Ly8gZGVmaW5lIHBpZSBzcGVjaWZpYyBvcHRpb25zIGFuZCB0aGVpciBkZWZhdWx0IHZhbHVlc1xuXG5cdHZhciBvcHRpb25zID0ge1xuXHRcdHNlcmllczoge1xuXHRcdFx0cGllOiB7XG5cdFx0XHRcdHNob3c6IGZhbHNlLFxuXHRcdFx0XHRyYWRpdXM6IFwiYXV0b1wiLFx0Ly8gYWN0dWFsIHJhZGl1cyBvZiB0aGUgdmlzaWJsZSBwaWUgKGJhc2VkIG9uIGZ1bGwgY2FsY3VsYXRlZCByYWRpdXMgaWYgPD0xLCBvciBoYXJkIHBpeGVsIHZhbHVlKVxuXHRcdFx0XHRpbm5lclJhZGl1czogMCwgLyogZm9yIGRvbnV0ICovXG5cdFx0XHRcdHN0YXJ0QW5nbGU6IDMvMixcblx0XHRcdFx0dGlsdDogMSxcblx0XHRcdFx0c2hhZG93OiB7XG5cdFx0XHRcdFx0bGVmdDogNSxcdC8vIHNoYWRvdyBsZWZ0IG9mZnNldFxuXHRcdFx0XHRcdHRvcDogMTUsXHQvLyBzaGFkb3cgdG9wIG9mZnNldFxuXHRcdFx0XHRcdGFscGhhOiAwLjAyXHQvLyBzaGFkb3cgYWxwaGFcblx0XHRcdFx0fSxcblx0XHRcdFx0b2Zmc2V0OiB7XG5cdFx0XHRcdFx0dG9wOiAwLFxuXHRcdFx0XHRcdGxlZnQ6IFwiYXV0b1wiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN0cm9rZToge1xuXHRcdFx0XHRcdGNvbG9yOiBcIiNmZmZcIixcblx0XHRcdFx0XHR3aWR0aDogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsYWJlbDoge1xuXHRcdFx0XHRcdHNob3c6IFwiYXV0b1wiLFxuXHRcdFx0XHRcdGZvcm1hdHRlcjogZnVuY3Rpb24obGFiZWwsIHNsaWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gXCI8ZGl2IHN0eWxlPSdmb250LXNpemU6eC1zbWFsbDt0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nOjJweDtjb2xvcjpcIiArIHNsaWNlLmNvbG9yICsgXCI7Jz5cIiArIGxhYmVsICsgXCI8YnIvPlwiICsgTWF0aC5yb3VuZChzbGljZS5wZXJjZW50KSArIFwiJTwvZGl2PlwiO1xuXHRcdFx0XHRcdH0sXHQvLyBmb3JtYXR0ZXIgZnVuY3Rpb25cblx0XHRcdFx0XHRyYWRpdXM6IDEsXHQvLyByYWRpdXMgYXQgd2hpY2ggdG8gcGxhY2UgdGhlIGxhYmVscyAoYmFzZWQgb24gZnVsbCBjYWxjdWxhdGVkIHJhZGl1cyBpZiA8PTEsIG9yIGhhcmQgcGl4ZWwgdmFsdWUpXG5cdFx0XHRcdFx0YmFja2dyb3VuZDoge1xuXHRcdFx0XHRcdFx0Y29sb3I6IG51bGwsXG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0aHJlc2hvbGQ6IDBcdC8vIHBlcmNlbnRhZ2UgYXQgd2hpY2ggdG8gaGlkZSB0aGUgbGFiZWwgKGkuZS4gdGhlIHNsaWNlIGlzIHRvbyBuYXJyb3cpXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbWJpbmU6IHtcblx0XHRcdFx0XHR0aHJlc2hvbGQ6IC0xLFx0Ly8gcGVyY2VudGFnZSBhdCB3aGljaCB0byBjb21iaW5lIGxpdHRsZSBzbGljZXMgaW50byBvbmUgbGFyZ2VyIHNsaWNlXG5cdFx0XHRcdFx0Y29sb3I6IG51bGwsXHQvLyBjb2xvciB0byBnaXZlIHRoZSBuZXcgc2xpY2UgKGF1dG8tZ2VuZXJhdGVkIGlmIG51bGwpXG5cdFx0XHRcdFx0bGFiZWw6IFwiT3RoZXJcIlx0Ly8gbGFiZWwgdG8gZ2l2ZSB0aGUgbmV3IHNsaWNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhpZ2hsaWdodDoge1xuXHRcdFx0XHRcdC8vY29sb3I6IFwiI2ZmZlwiLFx0XHQvLyB3aWxsIGFkZCB0aGlzIGZ1bmN0aW9uYWxpdHkgb25jZSBwYXJzZUNvbG9yIGlzIGF2YWlsYWJsZVxuXHRcdFx0XHRcdG9wYWNpdHk6IDAuNVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdCQucGxvdC5wbHVnaW5zLnB1c2goe1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0b3B0aW9uczogb3B0aW9ucyxcblx0XHRuYW1lOiBcInBpZVwiLFxuXHRcdHZlcnNpb246IFwiMS4xXCJcblx0fSk7XG5cbn0pKGpRdWVyeSk7XG4iLCIvKiBGbG90IHBsdWdpbiBmb3IgYXV0b21hdGljYWxseSByZWRyYXdpbmcgcGxvdHMgYXMgdGhlIHBsYWNlaG9sZGVyIHJlc2l6ZXMuXG5cbkNvcHlyaWdodCAoYykgMjAwNy0yMDE0IElPTEEgYW5kIE9sZSBMYXVyc2VuLlxuTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG5JdCB3b3JrcyBieSBsaXN0ZW5pbmcgZm9yIGNoYW5nZXMgb24gdGhlIHBsYWNlaG9sZGVyIGRpdiAodGhyb3VnaCB0aGUgalF1ZXJ5XG5yZXNpemUgZXZlbnQgcGx1Z2luKSAtIGlmIHRoZSBzaXplIGNoYW5nZXMsIGl0IHdpbGwgcmVkcmF3IHRoZSBwbG90LlxuXG5UaGVyZSBhcmUgbm8gb3B0aW9ucy4gSWYgeW91IG5lZWQgdG8gZGlzYWJsZSB0aGUgcGx1Z2luIGZvciBzb21lIHBsb3RzLCB5b3VcbmNhbiBqdXN0IGZpeCB0aGUgc2l6ZSBvZiB0aGVpciBwbGFjZWhvbGRlcnMuXG5cbiovXG5cbi8qIElubGluZSBkZXBlbmRlbmN5OlxuICogalF1ZXJ5IHJlc2l6ZSBldmVudCAtIHYxLjEgLSAzLzE0LzIwMTBcbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vcHJvamVjdHMvanF1ZXJ5LXJlc2l6ZS1wbHVnaW4vXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEwIFwiQ293Ym95XCIgQmVuIEFsbWFuXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cbiAqIGh0dHA6Ly9iZW5hbG1hbi5jb20vYWJvdXQvbGljZW5zZS9cbiAqL1xuKGZ1bmN0aW9uKCQsZSx0KXtcIiQ6bm9tdW5nZVwiO3ZhciBpPVtdLG49JC5yZXNpemU9JC5leHRlbmQoJC5yZXNpemUse30pLGEscj1mYWxzZSxzPVwic2V0VGltZW91dFwiLHU9XCJyZXNpemVcIixtPXUrXCItc3BlY2lhbC1ldmVudFwiLG89XCJwZW5kaW5nRGVsYXlcIixsPVwiYWN0aXZlRGVsYXlcIixmPVwidGhyb3R0bGVXaW5kb3dcIjtuW29dPTIwMDtuW2xdPTIwO25bZl09dHJ1ZTskLmV2ZW50LnNwZWNpYWxbdV09e3NldHVwOmZ1bmN0aW9uKCl7aWYoIW5bZl0mJnRoaXNbc10pe3JldHVybiBmYWxzZX12YXIgZT0kKHRoaXMpO2kucHVzaCh0aGlzKTtlLmRhdGEobSx7dzplLndpZHRoKCksaDplLmhlaWdodCgpfSk7aWYoaS5sZW5ndGg9PT0xKXthPXQ7aCgpfX0sdGVhcmRvd246ZnVuY3Rpb24oKXtpZighbltmXSYmdGhpc1tzXSl7cmV0dXJuIGZhbHNlfXZhciBlPSQodGhpcyk7Zm9yKHZhciB0PWkubGVuZ3RoLTE7dD49MDt0LS0pe2lmKGlbdF09PXRoaXMpe2kuc3BsaWNlKHQsMSk7YnJlYWt9fWUucmVtb3ZlRGF0YShtKTtpZighaS5sZW5ndGgpe2lmKHIpe2NhbmNlbEFuaW1hdGlvbkZyYW1lKGEpfWVsc2V7Y2xlYXJUaW1lb3V0KGEpfWE9bnVsbH19LGFkZDpmdW5jdGlvbihlKXtpZighbltmXSYmdGhpc1tzXSl7cmV0dXJuIGZhbHNlfXZhciBpO2Z1bmN0aW9uIGEoZSxuLGEpe3ZhciByPSQodGhpcykscz1yLmRhdGEobSl8fHt9O3Mudz1uIT09dD9uOnIud2lkdGgoKTtzLmg9YSE9PXQ/YTpyLmhlaWdodCgpO2kuYXBwbHkodGhpcyxhcmd1bWVudHMpfWlmKCQuaXNGdW5jdGlvbihlKSl7aT1lO3JldHVybiBhfWVsc2V7aT1lLmhhbmRsZXI7ZS5oYW5kbGVyPWF9fX07ZnVuY3Rpb24gaCh0KXtpZihyPT09dHJ1ZSl7cj10fHwxfWZvcih2YXIgcz1pLmxlbmd0aC0xO3M+PTA7cy0tKXt2YXIgbD0kKGlbc10pO2lmKGxbMF09PWV8fGwuaXMoXCI6dmlzaWJsZVwiKSl7dmFyIGY9bC53aWR0aCgpLGM9bC5oZWlnaHQoKSxkPWwuZGF0YShtKTtpZihkJiYoZiE9PWQud3x8YyE9PWQuaCkpe2wudHJpZ2dlcih1LFtkLnc9ZixkLmg9Y10pO3I9dHx8dHJ1ZX19ZWxzZXtkPWwuZGF0YShtKTtkLnc9MDtkLmg9MH19aWYoYSE9PW51bGwpe2lmKHImJih0PT1udWxsfHx0LXI8MWUzKSl7YT1lLnJlcXVlc3RBbmltYXRpb25GcmFtZShoKX1lbHNle2E9c2V0VGltZW91dChoLG5bb10pO3I9ZmFsc2V9fX1pZighZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpe2UucmVxdWVzdEFuaW1hdGlvbkZyYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIGUud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxmdW5jdGlvbih0LGkpe3JldHVybiBlLnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0KChuZXcgRGF0ZSkuZ2V0VGltZSgpKX0sbltsXSl9fSgpfWlmKCFlLmNhbmNlbEFuaW1hdGlvbkZyYW1lKXtlLmNhbmNlbEFuaW1hdGlvbkZyYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIGUud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZXx8ZS5vQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxlLm1zQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxjbGVhclRpbWVvdXR9KCl9fSkoalF1ZXJ5LHRoaXMpO1xuXG4oZnVuY3Rpb24gKCQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHsgfTsgLy8gbm8gb3B0aW9uc1xuXG4gICAgZnVuY3Rpb24gaW5pdChwbG90KSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gcGxvdC5nZXRQbGFjZWhvbGRlcigpO1xuXG4gICAgICAgICAgICAvLyBzb21lYm9keSBtaWdodCBoYXZlIGhpZGRlbiB1cyBhbmQgd2UgY2FuJ3QgcGxvdFxuICAgICAgICAgICAgLy8gd2hlbiB3ZSBkb24ndCBoYXZlIHRoZSBkaW1lbnNpb25zXG4gICAgICAgICAgICBpZiAocGxhY2Vob2xkZXIud2lkdGgoKSA9PSAwIHx8IHBsYWNlaG9sZGVyLmhlaWdodCgpID09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICBwbG90LnJlc2l6ZSgpO1xuICAgICAgICAgICAgcGxvdC5zZXR1cEdyaWQoKTtcbiAgICAgICAgICAgIHBsb3QuZHJhdygpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBiaW5kRXZlbnRzKHBsb3QsIGV2ZW50SG9sZGVyKSB7XG4gICAgICAgICAgICBwbG90LmdldFBsYWNlaG9sZGVyKCkucmVzaXplKG9uUmVzaXplKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNodXRkb3duKHBsb3QsIGV2ZW50SG9sZGVyKSB7XG4gICAgICAgICAgICBwbG90LmdldFBsYWNlaG9sZGVyKCkudW5iaW5kKFwicmVzaXplXCIsIG9uUmVzaXplKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcGxvdC5ob29rcy5iaW5kRXZlbnRzLnB1c2goYmluZEV2ZW50cyk7XG4gICAgICAgIHBsb3QuaG9va3Muc2h1dGRvd24ucHVzaChzaHV0ZG93bik7XG4gICAgfVxuICAgIFxuICAgICQucGxvdC5wbHVnaW5zLnB1c2goe1xuICAgICAgICBpbml0OiBpbml0LFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICBuYW1lOiAncmVzaXplJyxcbiAgICAgICAgdmVyc2lvbjogJzEuMCdcbiAgICB9KTtcbn0pKGpRdWVyeSk7XG4iLCIvKiBQcmV0dHkgaGFuZGxpbmcgb2YgdGltZSBheGVzLlxuXG5Db3B5cmlnaHQgKGMpIDIwMDctMjAxNCBJT0xBIGFuZCBPbGUgTGF1cnNlbi5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuU2V0IGF4aXMubW9kZSB0byBcInRpbWVcIiB0byBlbmFibGUuIFNlZSB0aGUgc2VjdGlvbiBcIlRpbWUgc2VyaWVzIGRhdGFcIiBpblxuQVBJLnR4dCBmb3IgZGV0YWlscy5cblxuKi9cblxuKGZ1bmN0aW9uKCQpIHtcblxuXHR2YXIgb3B0aW9ucyA9IHtcblx0XHR4YXhpczoge1xuXHRcdFx0dGltZXpvbmU6IG51bGwsXHRcdC8vIFwiYnJvd3NlclwiIGZvciBsb2NhbCB0byB0aGUgY2xpZW50IG9yIHRpbWV6b25lIGZvciB0aW1lem9uZS1qc1xuXHRcdFx0dGltZWZvcm1hdDogbnVsbCxcdC8vIGZvcm1hdCBzdHJpbmcgdG8gdXNlXG5cdFx0XHR0d2VsdmVIb3VyQ2xvY2s6IGZhbHNlLFx0Ly8gMTIgb3IgMjQgdGltZSBpbiB0aW1lIG1vZGVcblx0XHRcdG1vbnRoTmFtZXM6IG51bGxcdC8vIGxpc3Qgb2YgbmFtZXMgb2YgbW9udGhzXG5cdFx0fVxuXHR9O1xuXG5cdC8vIHJvdW5kIHRvIG5lYXJieSBsb3dlciBtdWx0aXBsZSBvZiBiYXNlXG5cblx0ZnVuY3Rpb24gZmxvb3JJbkJhc2UobiwgYmFzZSkge1xuXHRcdHJldHVybiBiYXNlICogTWF0aC5mbG9vcihuIC8gYmFzZSk7XG5cdH1cblxuXHQvLyBSZXR1cm5zIGEgc3RyaW5nIHdpdGggdGhlIGRhdGUgZCBmb3JtYXR0ZWQgYWNjb3JkaW5nIHRvIGZtdC5cblx0Ly8gQSBzdWJzZXQgb2YgdGhlIE9wZW4gR3JvdXAncyBzdHJmdGltZSBmb3JtYXQgaXMgc3VwcG9ydGVkLlxuXG5cdGZ1bmN0aW9uIGZvcm1hdERhdGUoZCwgZm10LCBtb250aE5hbWVzLCBkYXlOYW1lcykge1xuXG5cdFx0aWYgKHR5cGVvZiBkLnN0cmZ0aW1lID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0cmV0dXJuIGQuc3RyZnRpbWUoZm10KTtcblx0XHR9XG5cblx0XHR2YXIgbGVmdFBhZCA9IGZ1bmN0aW9uKG4sIHBhZCkge1xuXHRcdFx0biA9IFwiXCIgKyBuO1xuXHRcdFx0cGFkID0gXCJcIiArIChwYWQgPT0gbnVsbCA/IFwiMFwiIDogcGFkKTtcblx0XHRcdHJldHVybiBuLmxlbmd0aCA9PSAxID8gcGFkICsgbiA6IG47XG5cdFx0fTtcblxuXHRcdHZhciByID0gW107XG5cdFx0dmFyIGVzY2FwZSA9IGZhbHNlO1xuXHRcdHZhciBob3VycyA9IGQuZ2V0SG91cnMoKTtcblx0XHR2YXIgaXNBTSA9IGhvdXJzIDwgMTI7XG5cblx0XHRpZiAobW9udGhOYW1lcyA9PSBudWxsKSB7XG5cdFx0XHRtb250aE5hbWVzID0gW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdO1xuXHRcdH1cblxuXHRcdGlmIChkYXlOYW1lcyA9PSBudWxsKSB7XG5cdFx0XHRkYXlOYW1lcyA9IFtcIlN1blwiLCBcIk1vblwiLCBcIlR1ZVwiLCBcIldlZFwiLCBcIlRodVwiLCBcIkZyaVwiLCBcIlNhdFwiXTtcblx0XHR9XG5cblx0XHR2YXIgaG91cnMxMjtcblxuXHRcdGlmIChob3VycyA+IDEyKSB7XG5cdFx0XHRob3VyczEyID0gaG91cnMgLSAxMjtcblx0XHR9IGVsc2UgaWYgKGhvdXJzID09IDApIHtcblx0XHRcdGhvdXJzMTIgPSAxMjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aG91cnMxMiA9IGhvdXJzO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZm10Lmxlbmd0aDsgKytpKSB7XG5cblx0XHRcdHZhciBjID0gZm10LmNoYXJBdChpKTtcblxuXHRcdFx0aWYgKGVzY2FwZSkge1xuXHRcdFx0XHRzd2l0Y2ggKGMpIHtcblx0XHRcdFx0XHRjYXNlICdhJzogYyA9IFwiXCIgKyBkYXlOYW1lc1tkLmdldERheSgpXTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnYic6IGMgPSBcIlwiICsgbW9udGhOYW1lc1tkLmdldE1vbnRoKCldOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdkJzogYyA9IGxlZnRQYWQoZC5nZXREYXRlKCkpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdlJzogYyA9IGxlZnRQYWQoZC5nZXREYXRlKCksIFwiIFwiKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnaCc6XHQvLyBGb3IgYmFjay1jb21wYXQgd2l0aCAwLjc7IHJlbW92ZSBpbiAxLjBcblx0XHRcdFx0XHRjYXNlICdIJzogYyA9IGxlZnRQYWQoaG91cnMpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdJJzogYyA9IGxlZnRQYWQoaG91cnMxMik7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2wnOiBjID0gbGVmdFBhZChob3VyczEyLCBcIiBcIik7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ20nOiBjID0gbGVmdFBhZChkLmdldE1vbnRoKCkgKyAxKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnTSc6IGMgPSBsZWZ0UGFkKGQuZ2V0TWludXRlcygpKTsgYnJlYWs7XG5cdFx0XHRcdFx0Ly8gcXVhcnRlcnMgbm90IGluIE9wZW4gR3JvdXAncyBzdHJmdGltZSBzcGVjaWZpY2F0aW9uXG5cdFx0XHRcdFx0Y2FzZSAncSc6XG5cdFx0XHRcdFx0XHRjID0gXCJcIiArIChNYXRoLmZsb29yKGQuZ2V0TW9udGgoKSAvIDMpICsgMSk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ1MnOiBjID0gbGVmdFBhZChkLmdldFNlY29uZHMoKSk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3knOiBjID0gbGVmdFBhZChkLmdldEZ1bGxZZWFyKCkgJSAxMDApOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdZJzogYyA9IFwiXCIgKyBkLmdldEZ1bGxZZWFyKCk7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3AnOiBjID0gKGlzQU0pID8gKFwiXCIgKyBcImFtXCIpIDogKFwiXCIgKyBcInBtXCIpOyBicmVhaztcblx0XHRcdFx0XHRjYXNlICdQJzogYyA9IChpc0FNKSA/IChcIlwiICsgXCJBTVwiKSA6IChcIlwiICsgXCJQTVwiKTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAndyc6IGMgPSBcIlwiICsgZC5nZXREYXkoKTsgYnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ci5wdXNoKGMpO1xuXHRcdFx0XHRlc2NhcGUgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChjID09IFwiJVwiKSB7XG5cdFx0XHRcdFx0ZXNjYXBlID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyLnB1c2goYyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gci5qb2luKFwiXCIpO1xuXHR9XG5cblx0Ly8gVG8gaGF2ZSBhIGNvbnNpc3RlbnQgdmlldyBvZiB0aW1lLWJhc2VkIGRhdGEgaW5kZXBlbmRlbnQgb2Ygd2hpY2ggdGltZVxuXHQvLyB6b25lIHRoZSBjbGllbnQgaGFwcGVucyB0byBiZSBpbiB3ZSBuZWVkIGEgZGF0ZS1saWtlIG9iamVjdCBpbmRlcGVuZGVudFxuXHQvLyBvZiB0aW1lIHpvbmVzLiAgVGhpcyBpcyBkb25lIHRocm91Z2ggYSB3cmFwcGVyIHRoYXQgb25seSBjYWxscyB0aGUgVVRDXG5cdC8vIHZlcnNpb25zIG9mIHRoZSBhY2Nlc3NvciBtZXRob2RzLlxuXG5cdGZ1bmN0aW9uIG1ha2VVdGNXcmFwcGVyKGQpIHtcblxuXHRcdGZ1bmN0aW9uIGFkZFByb3h5TWV0aG9kKHNvdXJjZU9iaiwgc291cmNlTWV0aG9kLCB0YXJnZXRPYmosIHRhcmdldE1ldGhvZCkge1xuXHRcdFx0c291cmNlT2JqW3NvdXJjZU1ldGhvZF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIHRhcmdldE9ialt0YXJnZXRNZXRob2RdLmFwcGx5KHRhcmdldE9iaiwgYXJndW1lbnRzKTtcblx0XHRcdH07XG5cdFx0fTtcblxuXHRcdHZhciB1dGMgPSB7XG5cdFx0XHRkYXRlOiBkXG5cdFx0fTtcblxuXHRcdC8vIHN1cHBvcnQgc3RyZnRpbWUsIGlmIGZvdW5kXG5cblx0XHRpZiAoZC5zdHJmdGltZSAhPSB1bmRlZmluZWQpIHtcblx0XHRcdGFkZFByb3h5TWV0aG9kKHV0YywgXCJzdHJmdGltZVwiLCBkLCBcInN0cmZ0aW1lXCIpO1xuXHRcdH1cblxuXHRcdGFkZFByb3h5TWV0aG9kKHV0YywgXCJnZXRUaW1lXCIsIGQsIFwiZ2V0VGltZVwiKTtcblx0XHRhZGRQcm94eU1ldGhvZCh1dGMsIFwic2V0VGltZVwiLCBkLCBcInNldFRpbWVcIik7XG5cblx0XHR2YXIgcHJvcHMgPSBbXCJEYXRlXCIsIFwiRGF5XCIsIFwiRnVsbFllYXJcIiwgXCJIb3Vyc1wiLCBcIk1pbGxpc2Vjb25kc1wiLCBcIk1pbnV0ZXNcIiwgXCJNb250aFwiLCBcIlNlY29uZHNcIl07XG5cblx0XHRmb3IgKHZhciBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XG5cdFx0XHRhZGRQcm94eU1ldGhvZCh1dGMsIFwiZ2V0XCIgKyBwcm9wc1twXSwgZCwgXCJnZXRVVENcIiArIHByb3BzW3BdKTtcblx0XHRcdGFkZFByb3h5TWV0aG9kKHV0YywgXCJzZXRcIiArIHByb3BzW3BdLCBkLCBcInNldFVUQ1wiICsgcHJvcHNbcF0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB1dGM7XG5cdH07XG5cblx0Ly8gc2VsZWN0IHRpbWUgem9uZSBzdHJhdGVneS4gIFRoaXMgcmV0dXJucyBhIGRhdGUtbGlrZSBvYmplY3QgdGllZCB0byB0aGVcblx0Ly8gZGVzaXJlZCB0aW1lem9uZVxuXG5cdGZ1bmN0aW9uIGRhdGVHZW5lcmF0b3IodHMsIG9wdHMpIHtcblx0XHRpZiAob3B0cy50aW1lem9uZSA9PSBcImJyb3dzZXJcIikge1xuXHRcdFx0cmV0dXJuIG5ldyBEYXRlKHRzKTtcblx0XHR9IGVsc2UgaWYgKCFvcHRzLnRpbWV6b25lIHx8IG9wdHMudGltZXpvbmUgPT0gXCJ1dGNcIikge1xuXHRcdFx0cmV0dXJuIG1ha2VVdGNXcmFwcGVyKG5ldyBEYXRlKHRzKSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdGltZXpvbmVKUyAhPSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aW1lem9uZUpTLkRhdGUgIT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIGQgPSBuZXcgdGltZXpvbmVKUy5EYXRlKCk7XG5cdFx0XHQvLyB0aW1lem9uZS1qcyBpcyBmaWNrbGUsIHNvIGJlIHN1cmUgdG8gc2V0IHRoZSB0aW1lIHpvbmUgYmVmb3JlXG5cdFx0XHQvLyBzZXR0aW5nIHRoZSB0aW1lLlxuXHRcdFx0ZC5zZXRUaW1lem9uZShvcHRzLnRpbWV6b25lKTtcblx0XHRcdGQuc2V0VGltZSh0cyk7XG5cdFx0XHRyZXR1cm4gZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG1ha2VVdGNXcmFwcGVyKG5ldyBEYXRlKHRzKSk7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBtYXAgb2YgYXBwLiBzaXplIG9mIHRpbWUgdW5pdHMgaW4gbWlsbGlzZWNvbmRzXG5cblx0dmFyIHRpbWVVbml0U2l6ZSA9IHtcblx0XHRcInNlY29uZFwiOiAxMDAwLFxuXHRcdFwibWludXRlXCI6IDYwICogMTAwMCxcblx0XHRcImhvdXJcIjogNjAgKiA2MCAqIDEwMDAsXG5cdFx0XCJkYXlcIjogMjQgKiA2MCAqIDYwICogMTAwMCxcblx0XHRcIm1vbnRoXCI6IDMwICogMjQgKiA2MCAqIDYwICogMTAwMCxcblx0XHRcInF1YXJ0ZXJcIjogMyAqIDMwICogMjQgKiA2MCAqIDYwICogMTAwMCxcblx0XHRcInllYXJcIjogMzY1LjI0MjUgKiAyNCAqIDYwICogNjAgKiAxMDAwXG5cdH07XG5cblx0Ly8gdGhlIGFsbG93ZWQgdGljayBzaXplcywgYWZ0ZXIgMSB5ZWFyIHdlIHVzZVxuXHQvLyBhbiBpbnRlZ2VyIGFsZ29yaXRobVxuXG5cdHZhciBiYXNlU3BlYyA9IFtcblx0XHRbMSwgXCJzZWNvbmRcIl0sIFsyLCBcInNlY29uZFwiXSwgWzUsIFwic2Vjb25kXCJdLCBbMTAsIFwic2Vjb25kXCJdLFxuXHRcdFszMCwgXCJzZWNvbmRcIl0sIFxuXHRcdFsxLCBcIm1pbnV0ZVwiXSwgWzIsIFwibWludXRlXCJdLCBbNSwgXCJtaW51dGVcIl0sIFsxMCwgXCJtaW51dGVcIl0sXG5cdFx0WzMwLCBcIm1pbnV0ZVwiXSwgXG5cdFx0WzEsIFwiaG91clwiXSwgWzIsIFwiaG91clwiXSwgWzQsIFwiaG91clwiXSxcblx0XHRbOCwgXCJob3VyXCJdLCBbMTIsIFwiaG91clwiXSxcblx0XHRbMSwgXCJkYXlcIl0sIFsyLCBcImRheVwiXSwgWzMsIFwiZGF5XCJdLFxuXHRcdFswLjI1LCBcIm1vbnRoXCJdLCBbMC41LCBcIm1vbnRoXCJdLCBbMSwgXCJtb250aFwiXSxcblx0XHRbMiwgXCJtb250aFwiXVxuXHRdO1xuXG5cdC8vIHdlIGRvbid0IGtub3cgd2hpY2ggdmFyaWFudChzKSB3ZSdsbCBuZWVkIHlldCwgYnV0IGdlbmVyYXRpbmcgYm90aCBpc1xuXHQvLyBjaGVhcFxuXG5cdHZhciBzcGVjTW9udGhzID0gYmFzZVNwZWMuY29uY2F0KFtbMywgXCJtb250aFwiXSwgWzYsIFwibW9udGhcIl0sXG5cdFx0WzEsIFwieWVhclwiXV0pO1xuXHR2YXIgc3BlY1F1YXJ0ZXJzID0gYmFzZVNwZWMuY29uY2F0KFtbMSwgXCJxdWFydGVyXCJdLCBbMiwgXCJxdWFydGVyXCJdLFxuXHRcdFsxLCBcInllYXJcIl1dKTtcblxuXHRmdW5jdGlvbiBpbml0KHBsb3QpIHtcblx0XHRwbG90Lmhvb2tzLnByb2Nlc3NPcHRpb25zLnB1c2goZnVuY3Rpb24gKHBsb3QsIG9wdGlvbnMpIHtcblx0XHRcdCQuZWFjaChwbG90LmdldEF4ZXMoKSwgZnVuY3Rpb24oYXhpc05hbWUsIGF4aXMpIHtcblxuXHRcdFx0XHR2YXIgb3B0cyA9IGF4aXMub3B0aW9ucztcblxuXHRcdFx0XHRpZiAob3B0cy5tb2RlID09IFwidGltZVwiKSB7XG5cdFx0XHRcdFx0YXhpcy50aWNrR2VuZXJhdG9yID0gZnVuY3Rpb24oYXhpcykge1xuXG5cdFx0XHRcdFx0XHR2YXIgdGlja3MgPSBbXTtcblx0XHRcdFx0XHRcdHZhciBkID0gZGF0ZUdlbmVyYXRvcihheGlzLm1pbiwgb3B0cyk7XG5cdFx0XHRcdFx0XHR2YXIgbWluU2l6ZSA9IDA7XG5cblx0XHRcdFx0XHRcdC8vIG1ha2UgcXVhcnRlciB1c2UgYSBwb3NzaWJpbGl0eSBpZiBxdWFydGVycyBhcmVcblx0XHRcdFx0XHRcdC8vIG1lbnRpb25lZCBpbiBlaXRoZXIgb2YgdGhlc2Ugb3B0aW9uc1xuXG5cdFx0XHRcdFx0XHR2YXIgc3BlYyA9IChvcHRzLnRpY2tTaXplICYmIG9wdHMudGlja1NpemVbMV0gPT09XG5cdFx0XHRcdFx0XHRcdFwicXVhcnRlclwiKSB8fFxuXHRcdFx0XHRcdFx0XHQob3B0cy5taW5UaWNrU2l6ZSAmJiBvcHRzLm1pblRpY2tTaXplWzFdID09PVxuXHRcdFx0XHRcdFx0XHRcInF1YXJ0ZXJcIikgPyBzcGVjUXVhcnRlcnMgOiBzcGVjTW9udGhzO1xuXG5cdFx0XHRcdFx0XHRpZiAob3B0cy5taW5UaWNrU2l6ZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygb3B0cy50aWNrU2l6ZSA9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0bWluU2l6ZSA9IG9wdHMudGlja1NpemU7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0bWluU2l6ZSA9IG9wdHMubWluVGlja1NpemVbMF0gKiB0aW1lVW5pdFNpemVbb3B0cy5taW5UaWNrU2l6ZVsxXV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzcGVjLmxlbmd0aCAtIDE7ICsraSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYXhpcy5kZWx0YSA8IChzcGVjW2ldWzBdICogdGltZVVuaXRTaXplW3NwZWNbaV1bMV1dXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICArIHNwZWNbaSArIDFdWzBdICogdGltZVVuaXRTaXplW3NwZWNbaSArIDFdWzFdXSkgLyAyXG5cdFx0XHRcdFx0XHRcdFx0JiYgc3BlY1tpXVswXSAqIHRpbWVVbml0U2l6ZVtzcGVjW2ldWzFdXSA+PSBtaW5TaXplKSB7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dmFyIHNpemUgPSBzcGVjW2ldWzBdO1xuXHRcdFx0XHRcdFx0dmFyIHVuaXQgPSBzcGVjW2ldWzFdO1xuXG5cdFx0XHRcdFx0XHQvLyBzcGVjaWFsLWNhc2UgdGhlIHBvc3NpYmlsaXR5IG9mIHNldmVyYWwgeWVhcnNcblxuXHRcdFx0XHRcdFx0aWYgKHVuaXQgPT0gXCJ5ZWFyXCIpIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBpZiBnaXZlbiBhIG1pblRpY2tTaXplIGluIHllYXJzLCBqdXN0IHVzZSBpdCxcblx0XHRcdFx0XHRcdFx0Ly8gZW5zdXJpbmcgdGhhdCBpdCdzIGFuIGludGVnZXJcblxuXHRcdFx0XHRcdFx0XHRpZiAob3B0cy5taW5UaWNrU2l6ZSAhPSBudWxsICYmIG9wdHMubWluVGlja1NpemVbMV0gPT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRzaXplID0gTWF0aC5mbG9vcihvcHRzLm1pblRpY2tTaXplWzBdKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHRcdHZhciBtYWduID0gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2coYXhpcy5kZWx0YSAvIHRpbWVVbml0U2l6ZS55ZWFyKSAvIE1hdGguTE4xMCkpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBub3JtID0gKGF4aXMuZGVsdGEgLyB0aW1lVW5pdFNpemUueWVhcikgLyBtYWduO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG5vcm0gPCAxLjUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNpemUgPSAxO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobm9ybSA8IDMpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNpemUgPSAyO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobm9ybSA8IDcuNSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c2l6ZSA9IDU7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHNpemUgPSAxMDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRzaXplICo9IG1hZ247XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyBtaW5pbXVtIHNpemUgZm9yIHllYXJzIGlzIDFcblxuXHRcdFx0XHRcdFx0XHRpZiAoc2l6ZSA8IDEpIHtcblx0XHRcdFx0XHRcdFx0XHRzaXplID0gMTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRheGlzLnRpY2tTaXplID0gb3B0cy50aWNrU2l6ZSB8fCBbc2l6ZSwgdW5pdF07XG5cdFx0XHRcdFx0XHR2YXIgdGlja1NpemUgPSBheGlzLnRpY2tTaXplWzBdO1xuXHRcdFx0XHRcdFx0dW5pdCA9IGF4aXMudGlja1NpemVbMV07XG5cblx0XHRcdFx0XHRcdHZhciBzdGVwID0gdGlja1NpemUgKiB0aW1lVW5pdFNpemVbdW5pdF07XG5cblx0XHRcdFx0XHRcdGlmICh1bml0ID09IFwic2Vjb25kXCIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRTZWNvbmRzKGZsb29ySW5CYXNlKGQuZ2V0U2Vjb25kcygpLCB0aWNrU2l6ZSkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1bml0ID09IFwibWludXRlXCIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNaW51dGVzKGZsb29ySW5CYXNlKGQuZ2V0TWludXRlcygpLCB0aWNrU2l6ZSkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1bml0ID09IFwiaG91clwiKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0SG91cnMoZmxvb3JJbkJhc2UoZC5nZXRIb3VycygpLCB0aWNrU2l6ZSkpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1bml0ID09IFwibW9udGhcIikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKGZsb29ySW5CYXNlKGQuZ2V0TW9udGgoKSwgdGlja1NpemUpKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodW5pdCA9PSBcInF1YXJ0ZXJcIikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKDMgKiBmbG9vckluQmFzZShkLmdldE1vbnRoKCkgLyAzLFxuXHRcdFx0XHRcdFx0XHRcdHRpY2tTaXplKSk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVuaXQgPT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRGdWxsWWVhcihmbG9vckluQmFzZShkLmdldEZ1bGxZZWFyKCksIHRpY2tTaXplKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIHJlc2V0IHNtYWxsZXIgY29tcG9uZW50c1xuXG5cdFx0XHRcdFx0XHRkLnNldE1pbGxpc2Vjb25kcygwKTtcblxuXHRcdFx0XHRcdFx0aWYgKHN0ZXAgPj0gdGltZVVuaXRTaXplLm1pbnV0ZSkge1xuXHRcdFx0XHRcdFx0XHRkLnNldFNlY29uZHMoMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUuaG91cikge1xuXHRcdFx0XHRcdFx0XHRkLnNldE1pbnV0ZXMoMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUuZGF5KSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0SG91cnMoMCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUuZGF5ICogNCkge1xuXHRcdFx0XHRcdFx0XHRkLnNldERhdGUoMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUubW9udGggKiAyKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoZmxvb3JJbkJhc2UoZC5nZXRNb250aCgpLCAzKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3RlcCA+PSB0aW1lVW5pdFNpemUucXVhcnRlciAqIDIpIHtcblx0XHRcdFx0XHRcdFx0ZC5zZXRNb250aChmbG9vckluQmFzZShkLmdldE1vbnRoKCksIDYpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChzdGVwID49IHRpbWVVbml0U2l6ZS55ZWFyKSB7XG5cdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoMCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHZhciBjYXJyeSA9IDA7XG5cdFx0XHRcdFx0XHR2YXIgdiA9IE51bWJlci5OYU47XG5cdFx0XHRcdFx0XHR2YXIgcHJldjtcblxuXHRcdFx0XHRcdFx0ZG8ge1xuXG5cdFx0XHRcdFx0XHRcdHByZXYgPSB2O1xuXHRcdFx0XHRcdFx0XHR2ID0gZC5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0XHRcdHRpY2tzLnB1c2godik7XG5cblx0XHRcdFx0XHRcdFx0aWYgKHVuaXQgPT0gXCJtb250aFwiIHx8IHVuaXQgPT0gXCJxdWFydGVyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodGlja1NpemUgPCAxKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIGEgYml0IGNvbXBsaWNhdGVkIC0gd2UnbGwgZGl2aWRlIHRoZVxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gbW9udGgvcXVhcnRlciB1cCBidXQgd2UgbmVlZCB0byB0YWtlXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBjYXJlIG9mIGZyYWN0aW9ucyBzbyB3ZSBkb24ndCBlbmQgdXAgaW5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIHRoZSBtaWRkbGUgb2YgYSBkYXlcblxuXHRcdFx0XHRcdFx0XHRcdFx0ZC5zZXREYXRlKDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHN0YXJ0ID0gZC5nZXRUaW1lKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRkLnNldE1vbnRoKGQuZ2V0TW9udGgoKSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCh1bml0ID09IFwicXVhcnRlclwiID8gMyA6IDEpKTtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBlbmQgPSBkLmdldFRpbWUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGQuc2V0VGltZSh2ICsgY2FycnkgKiB0aW1lVW5pdFNpemUuaG91ciArIChlbmQgLSBzdGFydCkgKiB0aWNrU2l6ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRjYXJyeSA9IGQuZ2V0SG91cnMoKTtcblx0XHRcdFx0XHRcdFx0XHRcdGQuc2V0SG91cnMoMCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGQuc2V0TW9udGgoZC5nZXRNb250aCgpICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGlja1NpemUgKiAodW5pdCA9PSBcInF1YXJ0ZXJcIiA/IDMgOiAxKSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHVuaXQgPT0gXCJ5ZWFyXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRkLnNldEZ1bGxZZWFyKGQuZ2V0RnVsbFllYXIoKSArIHRpY2tTaXplKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRkLnNldFRpbWUodiArIHN0ZXApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IHdoaWxlICh2IDwgYXhpcy5tYXggJiYgdiAhPSBwcmV2KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRpY2tzO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRheGlzLnRpY2tGb3JtYXR0ZXIgPSBmdW5jdGlvbiAodiwgYXhpcykge1xuXG5cdFx0XHRcdFx0XHR2YXIgZCA9IGRhdGVHZW5lcmF0b3IodiwgYXhpcy5vcHRpb25zKTtcblxuXHRcdFx0XHRcdFx0Ly8gZmlyc3QgY2hlY2sgZ2xvYmFsIGZvcm1hdFxuXG5cdFx0XHRcdFx0XHRpZiAob3B0cy50aW1lZm9ybWF0ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZvcm1hdERhdGUoZCwgb3B0cy50aW1lZm9ybWF0LCBvcHRzLm1vbnRoTmFtZXMsIG9wdHMuZGF5TmFtZXMpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBwb3NzaWJseSB1c2UgcXVhcnRlcnMgaWYgcXVhcnRlcnMgYXJlIG1lbnRpb25lZCBpblxuXHRcdFx0XHRcdFx0Ly8gYW55IG9mIHRoZXNlIHBsYWNlc1xuXG5cdFx0XHRcdFx0XHR2YXIgdXNlUXVhcnRlcnMgPSAoYXhpcy5vcHRpb25zLnRpY2tTaXplICYmXG5cdFx0XHRcdFx0XHRcdFx0YXhpcy5vcHRpb25zLnRpY2tTaXplWzFdID09IFwicXVhcnRlclwiKSB8fFxuXHRcdFx0XHRcdFx0XHQoYXhpcy5vcHRpb25zLm1pblRpY2tTaXplICYmXG5cdFx0XHRcdFx0XHRcdFx0YXhpcy5vcHRpb25zLm1pblRpY2tTaXplWzFdID09IFwicXVhcnRlclwiKTtcblxuXHRcdFx0XHRcdFx0dmFyIHQgPSBheGlzLnRpY2tTaXplWzBdICogdGltZVVuaXRTaXplW2F4aXMudGlja1NpemVbMV1dO1xuXHRcdFx0XHRcdFx0dmFyIHNwYW4gPSBheGlzLm1heCAtIGF4aXMubWluO1xuXHRcdFx0XHRcdFx0dmFyIHN1ZmZpeCA9IChvcHRzLnR3ZWx2ZUhvdXJDbG9jaykgPyBcIiAlcFwiIDogXCJcIjtcblx0XHRcdFx0XHRcdHZhciBob3VyQ29kZSA9IChvcHRzLnR3ZWx2ZUhvdXJDbG9jaykgPyBcIiVJXCIgOiBcIiVIXCI7XG5cdFx0XHRcdFx0XHR2YXIgZm10O1xuXG5cdFx0XHRcdFx0XHRpZiAodCA8IHRpbWVVbml0U2l6ZS5taW51dGUpIHtcblx0XHRcdFx0XHRcdFx0Zm10ID0gaG91ckNvZGUgKyBcIjolTTolU1wiICsgc3VmZml4O1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0IDwgdGltZVVuaXRTaXplLmRheSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc3BhbiA8IDIgKiB0aW1lVW5pdFNpemUuZGF5KSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm10ID0gaG91ckNvZGUgKyBcIjolTVwiICsgc3VmZml4O1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGZtdCA9IFwiJWIgJWQgXCIgKyBob3VyQ29kZSArIFwiOiVNXCIgKyBzdWZmaXg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodCA8IHRpbWVVbml0U2l6ZS5tb250aCkge1xuXHRcdFx0XHRcdFx0XHRmbXQgPSBcIiViICVkXCI7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCh1c2VRdWFydGVycyAmJiB0IDwgdGltZVVuaXRTaXplLnF1YXJ0ZXIpIHx8XG5cdFx0XHRcdFx0XHRcdCghdXNlUXVhcnRlcnMgJiYgdCA8IHRpbWVVbml0U2l6ZS55ZWFyKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoc3BhbiA8IHRpbWVVbml0U2l6ZS55ZWFyKSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm10ID0gXCIlYlwiO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGZtdCA9IFwiJWIgJVlcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh1c2VRdWFydGVycyAmJiB0IDwgdGltZVVuaXRTaXplLnllYXIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHNwYW4gPCB0aW1lVW5pdFNpemUueWVhcikge1xuXHRcdFx0XHRcdFx0XHRcdGZtdCA9IFwiUSVxXCI7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Zm10ID0gXCJRJXEgJVlcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Zm10ID0gXCIlWVwiO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgcnQgPSBmb3JtYXREYXRlKGQsIGZtdCwgb3B0cy5tb250aE5hbWVzLCBvcHRzLmRheU5hbWVzKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHJ0O1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0JC5wbG90LnBsdWdpbnMucHVzaCh7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRvcHRpb25zOiBvcHRpb25zLFxuXHRcdG5hbWU6ICd0aW1lJyxcblx0XHR2ZXJzaW9uOiAnMS4wJ1xuXHR9KTtcblxuXHQvLyBUaW1lLWF4aXMgc3VwcG9ydCB1c2VkIHRvIGJlIGluIEZsb3QgY29yZSwgd2hpY2ggZXhwb3NlZCB0aGVcblx0Ly8gZm9ybWF0RGF0ZSBmdW5jdGlvbiBvbiB0aGUgcGxvdCBvYmplY3QuICBWYXJpb3VzIHBsdWdpbnMgZGVwZW5kXG5cdC8vIG9uIHRoZSBmdW5jdGlvbiwgc28gd2UgbmVlZCB0byByZS1leHBvc2UgaXQgaGVyZS5cblxuXHQkLnBsb3QuZm9ybWF0RGF0ZSA9IGZvcm1hdERhdGU7XG5cdCQucGxvdC5kYXRlR2VuZXJhdG9yID0gZGF0ZUdlbmVyYXRvcjtcblxufSkoalF1ZXJ5KTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiIsIi8qIVxuICogRGF0ZXBpY2tlciBmb3IgQm9vdHN0cmFwIHYxLjguMCAoaHR0cHM6Ly9naXRodWIuY29tL3V4c29sdXRpb25zL2Jvb3RzdHJhcC1kYXRlcGlja2VyKVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSB2Mi4wIChodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjApXG4gKi9cblxuIWZ1bmN0aW9uKGEpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoW1wianF1ZXJ5XCJdLGEpOmEoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHM/cmVxdWlyZShcImpxdWVyeVwiKTpqUXVlcnkpfShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGMoKXtyZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkoRGF0ZSxhcmd1bWVudHMpKX1mdW5jdGlvbiBkKCl7dmFyIGE9bmV3IERhdGU7cmV0dXJuIGMoYS5nZXRGdWxsWWVhcigpLGEuZ2V0TW9udGgoKSxhLmdldERhdGUoKSl9ZnVuY3Rpb24gZShhLGIpe3JldHVybiBhLmdldFVUQ0Z1bGxZZWFyKCk9PT1iLmdldFVUQ0Z1bGxZZWFyKCkmJmEuZ2V0VVRDTW9udGgoKT09PWIuZ2V0VVRDTW9udGgoKSYmYS5nZXRVVENEYXRlKCk9PT1iLmdldFVUQ0RhdGUoKX1mdW5jdGlvbiBmKGMsZCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGQhPT1iJiZhLmZuLmRhdGVwaWNrZXIuZGVwcmVjYXRlZChkKSx0aGlzW2NdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19ZnVuY3Rpb24gZyhhKXtyZXR1cm4gYSYmIWlzTmFOKGEuZ2V0VGltZSgpKX1mdW5jdGlvbiBoKGIsYyl7ZnVuY3Rpb24gZChhLGIpe3JldHVybiBiLnRvTG93ZXJDYXNlKCl9dmFyIGUsZj1hKGIpLmRhdGEoKSxnPXt9LGg9bmV3IFJlZ0V4cChcIl5cIitjLnRvTG93ZXJDYXNlKCkrXCIoW0EtWl0pXCIpO2M9bmV3IFJlZ0V4cChcIl5cIitjLnRvTG93ZXJDYXNlKCkpO2Zvcih2YXIgaSBpbiBmKWMudGVzdChpKSYmKGU9aS5yZXBsYWNlKGgsZCksZ1tlXT1mW2ldKTtyZXR1cm4gZ31mdW5jdGlvbiBpKGIpe3ZhciBjPXt9O2lmKHFbYl18fChiPWIuc3BsaXQoXCItXCIpWzBdLHFbYl0pKXt2YXIgZD1xW2JdO3JldHVybiBhLmVhY2gocCxmdW5jdGlvbihhLGIpe2IgaW4gZCYmKGNbYl09ZFtiXSl9KSxjfX12YXIgaj1mdW5jdGlvbigpe3ZhciBiPXtnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuc2xpY2UoYSlbMF19LGNvbnRhaW5zOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hJiZhLnZhbHVlT2YoKSxjPTAsZD10aGlzLmxlbmd0aDtjPGQ7YysrKWlmKDA8PXRoaXNbY10udmFsdWVPZigpLWImJnRoaXNbY10udmFsdWVPZigpLWI8ODY0ZTUpcmV0dXJuIGM7cmV0dXJuLTF9LHJlbW92ZTpmdW5jdGlvbihhKXt0aGlzLnNwbGljZShhLDEpfSxyZXBsYWNlOmZ1bmN0aW9uKGIpe2ImJihhLmlzQXJyYXkoYil8fChiPVtiXSksdGhpcy5jbGVhcigpLHRoaXMucHVzaC5hcHBseSh0aGlzLGIpKX0sY2xlYXI6ZnVuY3Rpb24oKXt0aGlzLmxlbmd0aD0wfSxjb3B5OmZ1bmN0aW9uKCl7dmFyIGE9bmV3IGo7cmV0dXJuIGEucmVwbGFjZSh0aGlzKSxhfX07cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9W107cmV0dXJuIGMucHVzaC5hcHBseShjLGFyZ3VtZW50cyksYS5leHRlbmQoYyxiKSxjfX0oKSxrPWZ1bmN0aW9uKGIsYyl7YS5kYXRhKGIsXCJkYXRlcGlja2VyXCIsdGhpcyksdGhpcy5fcHJvY2Vzc19vcHRpb25zKGMpLHRoaXMuZGF0ZXM9bmV3IGosdGhpcy52aWV3RGF0ZT10aGlzLm8uZGVmYXVsdFZpZXdEYXRlLHRoaXMuZm9jdXNEYXRlPW51bGwsdGhpcy5lbGVtZW50PWEoYiksdGhpcy5pc0lucHV0PXRoaXMuZWxlbWVudC5pcyhcImlucHV0XCIpLHRoaXMuaW5wdXRGaWVsZD10aGlzLmlzSW5wdXQ/dGhpcy5lbGVtZW50OnRoaXMuZWxlbWVudC5maW5kKFwiaW5wdXRcIiksdGhpcy5jb21wb25lbnQ9ISF0aGlzLmVsZW1lbnQuaGFzQ2xhc3MoXCJkYXRlXCIpJiZ0aGlzLmVsZW1lbnQuZmluZChcIi5hZGQtb24sIC5pbnB1dC1ncm91cC1hZGRvbiwgLmJ0blwiKSx0aGlzLmNvbXBvbmVudCYmMD09PXRoaXMuY29tcG9uZW50Lmxlbmd0aCYmKHRoaXMuY29tcG9uZW50PSExKSx0aGlzLmlzSW5saW5lPSF0aGlzLmNvbXBvbmVudCYmdGhpcy5lbGVtZW50LmlzKFwiZGl2XCIpLHRoaXMucGlja2VyPWEoci50ZW1wbGF0ZSksdGhpcy5fY2hlY2tfdGVtcGxhdGUodGhpcy5vLnRlbXBsYXRlcy5sZWZ0QXJyb3cpJiZ0aGlzLnBpY2tlci5maW5kKFwiLnByZXZcIikuaHRtbCh0aGlzLm8udGVtcGxhdGVzLmxlZnRBcnJvdyksdGhpcy5fY2hlY2tfdGVtcGxhdGUodGhpcy5vLnRlbXBsYXRlcy5yaWdodEFycm93KSYmdGhpcy5waWNrZXIuZmluZChcIi5uZXh0XCIpLmh0bWwodGhpcy5vLnRlbXBsYXRlcy5yaWdodEFycm93KSx0aGlzLl9idWlsZEV2ZW50cygpLHRoaXMuX2F0dGFjaEV2ZW50cygpLHRoaXMuaXNJbmxpbmU/dGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLWlubGluZVwiKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpOnRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1kcm9wZG93biBkcm9wZG93bi1tZW51XCIpLHRoaXMuby5ydGwmJnRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1ydGxcIiksdGhpcy5vLmNhbGVuZGFyV2Vla3MmJnRoaXMucGlja2VyLmZpbmQoXCIuZGF0ZXBpY2tlci1kYXlzIC5kYXRlcGlja2VyLXN3aXRjaCwgdGhlYWQgLmRhdGVwaWNrZXItdGl0bGUsIHRmb290IC50b2RheSwgdGZvb3QgLmNsZWFyXCIpLmF0dHIoXCJjb2xzcGFuXCIsZnVuY3Rpb24oYSxiKXtyZXR1cm4gTnVtYmVyKGIpKzF9KSx0aGlzLl9wcm9jZXNzX29wdGlvbnMoe3N0YXJ0RGF0ZTp0aGlzLl9vLnN0YXJ0RGF0ZSxlbmREYXRlOnRoaXMuX28uZW5kRGF0ZSxkYXlzT2ZXZWVrRGlzYWJsZWQ6dGhpcy5vLmRheXNPZldlZWtEaXNhYmxlZCxkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6dGhpcy5vLmRheXNPZldlZWtIaWdobGlnaHRlZCxkYXRlc0Rpc2FibGVkOnRoaXMuby5kYXRlc0Rpc2FibGVkfSksdGhpcy5fYWxsb3dfdXBkYXRlPSExLHRoaXMuc2V0Vmlld01vZGUodGhpcy5vLnN0YXJ0VmlldyksdGhpcy5fYWxsb3dfdXBkYXRlPSEwLHRoaXMuZmlsbERvdygpLHRoaXMuZmlsbE1vbnRocygpLHRoaXMudXBkYXRlKCksdGhpcy5pc0lubGluZSYmdGhpcy5zaG93KCl9O2sucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjprLF9yZXNvbHZlVmlld05hbWU6ZnVuY3Rpb24oYil7cmV0dXJuIGEuZWFjaChyLnZpZXdNb2RlcyxmdW5jdGlvbihjLGQpe2lmKGI9PT1jfHxhLmluQXJyYXkoYixkLm5hbWVzKSE9PS0xKXJldHVybiBiPWMsITF9KSxifSxfcmVzb2x2ZURheXNPZldlZWs6ZnVuY3Rpb24oYil7cmV0dXJuIGEuaXNBcnJheShiKXx8KGI9Yi5zcGxpdCgvWyxcXHNdKi8pKSxhLm1hcChiLE51bWJlcil9LF9jaGVja190ZW1wbGF0ZTpmdW5jdGlvbihjKXt0cnl7aWYoYz09PWJ8fFwiXCI9PT1jKXJldHVybiExO2lmKChjLm1hdGNoKC9bPD5dL2cpfHxbXSkubGVuZ3RoPD0wKXJldHVybiEwO3ZhciBkPWEoYyk7cmV0dXJuIGQubGVuZ3RoPjB9Y2F0Y2goYSl7cmV0dXJuITF9fSxfcHJvY2Vzc19vcHRpb25zOmZ1bmN0aW9uKGIpe3RoaXMuX289YS5leHRlbmQoe30sdGhpcy5fbyxiKTt2YXIgZT10aGlzLm89YS5leHRlbmQoe30sdGhpcy5fbyksZj1lLmxhbmd1YWdlO3FbZl18fChmPWYuc3BsaXQoXCItXCIpWzBdLHFbZl18fChmPW8ubGFuZ3VhZ2UpKSxlLmxhbmd1YWdlPWYsZS5zdGFydFZpZXc9dGhpcy5fcmVzb2x2ZVZpZXdOYW1lKGUuc3RhcnRWaWV3KSxlLm1pblZpZXdNb2RlPXRoaXMuX3Jlc29sdmVWaWV3TmFtZShlLm1pblZpZXdNb2RlKSxlLm1heFZpZXdNb2RlPXRoaXMuX3Jlc29sdmVWaWV3TmFtZShlLm1heFZpZXdNb2RlKSxlLnN0YXJ0Vmlldz1NYXRoLm1heCh0aGlzLm8ubWluVmlld01vZGUsTWF0aC5taW4odGhpcy5vLm1heFZpZXdNb2RlLGUuc3RhcnRWaWV3KSksZS5tdWx0aWRhdGUhPT0hMCYmKGUubXVsdGlkYXRlPU51bWJlcihlLm11bHRpZGF0ZSl8fCExLGUubXVsdGlkYXRlIT09ITEmJihlLm11bHRpZGF0ZT1NYXRoLm1heCgwLGUubXVsdGlkYXRlKSkpLGUubXVsdGlkYXRlU2VwYXJhdG9yPVN0cmluZyhlLm11bHRpZGF0ZVNlcGFyYXRvciksZS53ZWVrU3RhcnQlPTcsZS53ZWVrRW5kPShlLndlZWtTdGFydCs2KSU3O3ZhciBnPXIucGFyc2VGb3JtYXQoZS5mb3JtYXQpO2Uuc3RhcnREYXRlIT09LSgxLzApJiYoZS5zdGFydERhdGU/ZS5zdGFydERhdGUgaW5zdGFuY2VvZiBEYXRlP2Uuc3RhcnREYXRlPXRoaXMuX2xvY2FsX3RvX3V0Yyh0aGlzLl96ZXJvX3RpbWUoZS5zdGFydERhdGUpKTplLnN0YXJ0RGF0ZT1yLnBhcnNlRGF0ZShlLnN0YXJ0RGF0ZSxnLGUubGFuZ3VhZ2UsZS5hc3N1bWVOZWFyYnlZZWFyKTplLnN0YXJ0RGF0ZT0tKDEvMCkpLGUuZW5kRGF0ZSE9PTEvMCYmKGUuZW5kRGF0ZT9lLmVuZERhdGUgaW5zdGFuY2VvZiBEYXRlP2UuZW5kRGF0ZT10aGlzLl9sb2NhbF90b191dGModGhpcy5femVyb190aW1lKGUuZW5kRGF0ZSkpOmUuZW5kRGF0ZT1yLnBhcnNlRGF0ZShlLmVuZERhdGUsZyxlLmxhbmd1YWdlLGUuYXNzdW1lTmVhcmJ5WWVhcik6ZS5lbmREYXRlPTEvMCksZS5kYXlzT2ZXZWVrRGlzYWJsZWQ9dGhpcy5fcmVzb2x2ZURheXNPZldlZWsoZS5kYXlzT2ZXZWVrRGlzYWJsZWR8fFtdKSxlLmRheXNPZldlZWtIaWdobGlnaHRlZD10aGlzLl9yZXNvbHZlRGF5c09mV2VlayhlLmRheXNPZldlZWtIaWdobGlnaHRlZHx8W10pLGUuZGF0ZXNEaXNhYmxlZD1lLmRhdGVzRGlzYWJsZWR8fFtdLGEuaXNBcnJheShlLmRhdGVzRGlzYWJsZWQpfHwoZS5kYXRlc0Rpc2FibGVkPWUuZGF0ZXNEaXNhYmxlZC5zcGxpdChcIixcIikpLGUuZGF0ZXNEaXNhYmxlZD1hLm1hcChlLmRhdGVzRGlzYWJsZWQsZnVuY3Rpb24oYSl7cmV0dXJuIHIucGFyc2VEYXRlKGEsZyxlLmxhbmd1YWdlLGUuYXNzdW1lTmVhcmJ5WWVhcil9KTt2YXIgaD1TdHJpbmcoZS5vcmllbnRhdGlvbikudG9Mb3dlckNhc2UoKS5zcGxpdCgvXFxzKy9nKSxpPWUub3JpZW50YXRpb24udG9Mb3dlckNhc2UoKTtpZihoPWEuZ3JlcChoLGZ1bmN0aW9uKGEpe3JldHVybi9eYXV0b3xsZWZ0fHJpZ2h0fHRvcHxib3R0b20kLy50ZXN0KGEpfSksZS5vcmllbnRhdGlvbj17eDpcImF1dG9cIix5OlwiYXV0b1wifSxpJiZcImF1dG9cIiE9PWkpaWYoMT09PWgubGVuZ3RoKXN3aXRjaChoWzBdKXtjYXNlXCJ0b3BcIjpjYXNlXCJib3R0b21cIjplLm9yaWVudGF0aW9uLnk9aFswXTticmVhaztjYXNlXCJsZWZ0XCI6Y2FzZVwicmlnaHRcIjplLm9yaWVudGF0aW9uLng9aFswXX1lbHNlIGk9YS5ncmVwKGgsZnVuY3Rpb24oYSl7cmV0dXJuL15sZWZ0fHJpZ2h0JC8udGVzdChhKX0pLGUub3JpZW50YXRpb24ueD1pWzBdfHxcImF1dG9cIixpPWEuZ3JlcChoLGZ1bmN0aW9uKGEpe3JldHVybi9edG9wfGJvdHRvbSQvLnRlc3QoYSl9KSxlLm9yaWVudGF0aW9uLnk9aVswXXx8XCJhdXRvXCI7ZWxzZTtpZihlLmRlZmF1bHRWaWV3RGF0ZSBpbnN0YW5jZW9mIERhdGV8fFwic3RyaW5nXCI9PXR5cGVvZiBlLmRlZmF1bHRWaWV3RGF0ZSllLmRlZmF1bHRWaWV3RGF0ZT1yLnBhcnNlRGF0ZShlLmRlZmF1bHRWaWV3RGF0ZSxnLGUubGFuZ3VhZ2UsZS5hc3N1bWVOZWFyYnlZZWFyKTtlbHNlIGlmKGUuZGVmYXVsdFZpZXdEYXRlKXt2YXIgaj1lLmRlZmF1bHRWaWV3RGF0ZS55ZWFyfHwobmV3IERhdGUpLmdldEZ1bGxZZWFyKCksaz1lLmRlZmF1bHRWaWV3RGF0ZS5tb250aHx8MCxsPWUuZGVmYXVsdFZpZXdEYXRlLmRheXx8MTtlLmRlZmF1bHRWaWV3RGF0ZT1jKGosayxsKX1lbHNlIGUuZGVmYXVsdFZpZXdEYXRlPWQoKX0sX2V2ZW50czpbXSxfc2Vjb25kYXJ5RXZlbnRzOltdLF9hcHBseUV2ZW50czpmdW5jdGlvbihhKXtmb3IodmFyIGMsZCxlLGY9MDtmPGEubGVuZ3RoO2YrKyljPWFbZl1bMF0sMj09PWFbZl0ubGVuZ3RoPyhkPWIsZT1hW2ZdWzFdKTozPT09YVtmXS5sZW5ndGgmJihkPWFbZl1bMV0sZT1hW2ZdWzJdKSxjLm9uKGUsZCl9LF91bmFwcGx5RXZlbnRzOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYyxkLGUsZj0wO2Y8YS5sZW5ndGg7ZisrKWM9YVtmXVswXSwyPT09YVtmXS5sZW5ndGg/KGU9YixkPWFbZl1bMV0pOjM9PT1hW2ZdLmxlbmd0aCYmKGU9YVtmXVsxXSxkPWFbZl1bMl0pLGMub2ZmKGQsZSl9LF9idWlsZEV2ZW50czpmdW5jdGlvbigpe3ZhciBiPXtrZXl1cDphLnByb3h5KGZ1bmN0aW9uKGIpe2EuaW5BcnJheShiLmtleUNvZGUsWzI3LDM3LDM5LDM4LDQwLDMyLDEzLDldKT09PS0xJiZ0aGlzLnVwZGF0ZSgpfSx0aGlzKSxrZXlkb3duOmEucHJveHkodGhpcy5rZXlkb3duLHRoaXMpLHBhc3RlOmEucHJveHkodGhpcy5wYXN0ZSx0aGlzKX07dGhpcy5vLnNob3dPbkZvY3VzPT09ITAmJihiLmZvY3VzPWEucHJveHkodGhpcy5zaG93LHRoaXMpKSx0aGlzLmlzSW5wdXQ/dGhpcy5fZXZlbnRzPVtbdGhpcy5lbGVtZW50LGJdXTp0aGlzLmNvbXBvbmVudCYmdGhpcy5pbnB1dEZpZWxkLmxlbmd0aD90aGlzLl9ldmVudHM9W1t0aGlzLmlucHV0RmllbGQsYl0sW3RoaXMuY29tcG9uZW50LHtjbGljazphLnByb3h5KHRoaXMuc2hvdyx0aGlzKX1dXTp0aGlzLl9ldmVudHM9W1t0aGlzLmVsZW1lbnQse2NsaWNrOmEucHJveHkodGhpcy5zaG93LHRoaXMpLGtleWRvd246YS5wcm94eSh0aGlzLmtleWRvd24sdGhpcyl9XV0sdGhpcy5fZXZlbnRzLnB1c2goW3RoaXMuZWxlbWVudCxcIipcIix7Ymx1cjphLnByb3h5KGZ1bmN0aW9uKGEpe3RoaXMuX2ZvY3VzZWRfZnJvbT1hLnRhcmdldH0sdGhpcyl9XSxbdGhpcy5lbGVtZW50LHtibHVyOmEucHJveHkoZnVuY3Rpb24oYSl7dGhpcy5fZm9jdXNlZF9mcm9tPWEudGFyZ2V0fSx0aGlzKX1dKSx0aGlzLm8uaW1tZWRpYXRlVXBkYXRlcyYmdGhpcy5fZXZlbnRzLnB1c2goW3RoaXMuZWxlbWVudCx7XCJjaGFuZ2VZZWFyIGNoYW5nZU1vbnRoXCI6YS5wcm94eShmdW5jdGlvbihhKXt0aGlzLnVwZGF0ZShhLmRhdGUpfSx0aGlzKX1dKSx0aGlzLl9zZWNvbmRhcnlFdmVudHM9W1t0aGlzLnBpY2tlcix7Y2xpY2s6YS5wcm94eSh0aGlzLmNsaWNrLHRoaXMpfV0sW3RoaXMucGlja2VyLFwiLnByZXYsIC5uZXh0XCIse2NsaWNrOmEucHJveHkodGhpcy5uYXZBcnJvd3NDbGljayx0aGlzKX1dLFt0aGlzLnBpY2tlcixcIi5kYXk6bm90KC5kaXNhYmxlZClcIix7Y2xpY2s6YS5wcm94eSh0aGlzLmRheUNlbGxDbGljayx0aGlzKX1dLFthKHdpbmRvdykse3Jlc2l6ZTphLnByb3h5KHRoaXMucGxhY2UsdGhpcyl9XSxbYShkb2N1bWVudCkse1wibW91c2Vkb3duIHRvdWNoc3RhcnRcIjphLnByb3h5KGZ1bmN0aW9uKGEpe3RoaXMuZWxlbWVudC5pcyhhLnRhcmdldCl8fHRoaXMuZWxlbWVudC5maW5kKGEudGFyZ2V0KS5sZW5ndGh8fHRoaXMucGlja2VyLmlzKGEudGFyZ2V0KXx8dGhpcy5waWNrZXIuZmluZChhLnRhcmdldCkubGVuZ3RofHx0aGlzLmlzSW5saW5lfHx0aGlzLmhpZGUoKX0sdGhpcyl9XV19LF9hdHRhY2hFdmVudHM6ZnVuY3Rpb24oKXt0aGlzLl9kZXRhY2hFdmVudHMoKSx0aGlzLl9hcHBseUV2ZW50cyh0aGlzLl9ldmVudHMpfSxfZGV0YWNoRXZlbnRzOmZ1bmN0aW9uKCl7dGhpcy5fdW5hcHBseUV2ZW50cyh0aGlzLl9ldmVudHMpfSxfYXR0YWNoU2Vjb25kYXJ5RXZlbnRzOmZ1bmN0aW9uKCl7dGhpcy5fZGV0YWNoU2Vjb25kYXJ5RXZlbnRzKCksdGhpcy5fYXBwbHlFdmVudHModGhpcy5fc2Vjb25kYXJ5RXZlbnRzKX0sX2RldGFjaFNlY29uZGFyeUV2ZW50czpmdW5jdGlvbigpe3RoaXMuX3VuYXBwbHlFdmVudHModGhpcy5fc2Vjb25kYXJ5RXZlbnRzKX0sX3RyaWdnZXI6ZnVuY3Rpb24oYixjKXt2YXIgZD1jfHx0aGlzLmRhdGVzLmdldCgtMSksZT10aGlzLl91dGNfdG9fbG9jYWwoZCk7dGhpcy5lbGVtZW50LnRyaWdnZXIoe3R5cGU6YixkYXRlOmUsdmlld01vZGU6dGhpcy52aWV3TW9kZSxkYXRlczphLm1hcCh0aGlzLmRhdGVzLHRoaXMuX3V0Y190b19sb2NhbCksZm9ybWF0OmEucHJveHkoZnVuY3Rpb24oYSxiKXswPT09YXJndW1lbnRzLmxlbmd0aD8oYT10aGlzLmRhdGVzLmxlbmd0aC0xLGI9dGhpcy5vLmZvcm1hdCk6XCJzdHJpbmdcIj09dHlwZW9mIGEmJihiPWEsYT10aGlzLmRhdGVzLmxlbmd0aC0xKSxiPWJ8fHRoaXMuby5mb3JtYXQ7dmFyIGM9dGhpcy5kYXRlcy5nZXQoYSk7cmV0dXJuIHIuZm9ybWF0RGF0ZShjLGIsdGhpcy5vLmxhbmd1YWdlKX0sdGhpcyl9KX0sc2hvdzpmdW5jdGlvbigpe2lmKCEodGhpcy5pbnB1dEZpZWxkLnByb3AoXCJkaXNhYmxlZFwiKXx8dGhpcy5pbnB1dEZpZWxkLnByb3AoXCJyZWFkb25seVwiKSYmdGhpcy5vLmVuYWJsZU9uUmVhZG9ubHk9PT0hMSkpcmV0dXJuIHRoaXMuaXNJbmxpbmV8fHRoaXMucGlja2VyLmFwcGVuZFRvKHRoaXMuby5jb250YWluZXIpLHRoaXMucGxhY2UoKSx0aGlzLnBpY2tlci5zaG93KCksdGhpcy5fYXR0YWNoU2Vjb25kYXJ5RXZlbnRzKCksdGhpcy5fdHJpZ2dlcihcInNob3dcIiksKHdpbmRvdy5uYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50c3x8XCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50KSYmdGhpcy5vLmRpc2FibGVUb3VjaEtleWJvYXJkJiZhKHRoaXMuZWxlbWVudCkuYmx1cigpLHRoaXN9LGhpZGU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc0lubGluZXx8IXRoaXMucGlja2VyLmlzKFwiOnZpc2libGVcIik/dGhpczoodGhpcy5mb2N1c0RhdGU9bnVsbCx0aGlzLnBpY2tlci5oaWRlKCkuZGV0YWNoKCksdGhpcy5fZGV0YWNoU2Vjb25kYXJ5RXZlbnRzKCksdGhpcy5zZXRWaWV3TW9kZSh0aGlzLm8uc3RhcnRWaWV3KSx0aGlzLm8uZm9yY2VQYXJzZSYmdGhpcy5pbnB1dEZpZWxkLnZhbCgpJiZ0aGlzLnNldFZhbHVlKCksdGhpcy5fdHJpZ2dlcihcImhpZGVcIiksdGhpcyl9LGRlc3Ryb3k6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oaWRlKCksdGhpcy5fZGV0YWNoRXZlbnRzKCksdGhpcy5fZGV0YWNoU2Vjb25kYXJ5RXZlbnRzKCksdGhpcy5waWNrZXIucmVtb3ZlKCksZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZXBpY2tlcix0aGlzLmlzSW5wdXR8fGRlbGV0ZSB0aGlzLmVsZW1lbnQuZGF0YSgpLmRhdGUsdGhpc30scGFzdGU6ZnVuY3Rpb24oYil7dmFyIGM7aWYoYi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEmJmIub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhLnR5cGVzJiZhLmluQXJyYXkoXCJ0ZXh0L3BsYWluXCIsYi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGEudHlwZXMpIT09LTEpYz1iLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwidGV4dC9wbGFpblwiKTtlbHNle2lmKCF3aW5kb3cuY2xpcGJvYXJkRGF0YSlyZXR1cm47Yz13aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwiVGV4dFwiKX10aGlzLnNldERhdGUoYyksdGhpcy51cGRhdGUoKSxiLnByZXZlbnREZWZhdWx0KCl9LF91dGNfdG9fbG9jYWw6ZnVuY3Rpb24oYSl7aWYoIWEpcmV0dXJuIGE7dmFyIGI9bmV3IERhdGUoYS5nZXRUaW1lKCkrNmU0KmEuZ2V0VGltZXpvbmVPZmZzZXQoKSk7cmV0dXJuIGIuZ2V0VGltZXpvbmVPZmZzZXQoKSE9PWEuZ2V0VGltZXpvbmVPZmZzZXQoKSYmKGI9bmV3IERhdGUoYS5nZXRUaW1lKCkrNmU0KmIuZ2V0VGltZXpvbmVPZmZzZXQoKSkpLGJ9LF9sb2NhbF90b191dGM6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJm5ldyBEYXRlKGEuZ2V0VGltZSgpLTZlNCphLmdldFRpbWV6b25lT2Zmc2V0KCkpfSxfemVyb190aW1lOmZ1bmN0aW9uKGEpe3JldHVybiBhJiZuZXcgRGF0ZShhLmdldEZ1bGxZZWFyKCksYS5nZXRNb250aCgpLGEuZ2V0RGF0ZSgpKX0sX3plcm9fdXRjX3RpbWU6ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmMoYS5nZXRVVENGdWxsWWVhcigpLGEuZ2V0VVRDTW9udGgoKSxhLmdldFVUQ0RhdGUoKSl9LGdldERhdGVzOmZ1bmN0aW9uKCl7cmV0dXJuIGEubWFwKHRoaXMuZGF0ZXMsdGhpcy5fdXRjX3RvX2xvY2FsKX0sZ2V0VVRDRGF0ZXM6ZnVuY3Rpb24oKXtyZXR1cm4gYS5tYXAodGhpcy5kYXRlcyxmdW5jdGlvbihhKXtyZXR1cm4gbmV3IERhdGUoYSl9KX0sZ2V0RGF0ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLl91dGNfdG9fbG9jYWwodGhpcy5nZXRVVENEYXRlKCkpfSxnZXRVVENEYXRlOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5kYXRlcy5nZXQoLTEpO3JldHVybiBhIT09Yj9uZXcgRGF0ZShhKTpudWxsfSxjbGVhckRhdGVzOmZ1bmN0aW9uKCl7dGhpcy5pbnB1dEZpZWxkLnZhbChcIlwiKSx0aGlzLnVwZGF0ZSgpLHRoaXMuX3RyaWdnZXIoXCJjaGFuZ2VEYXRlXCIpLHRoaXMuby5hdXRvY2xvc2UmJnRoaXMuaGlkZSgpfSxzZXREYXRlczpmdW5jdGlvbigpe3ZhciBiPWEuaXNBcnJheShhcmd1bWVudHNbMF0pP2FyZ3VtZW50c1swXTphcmd1bWVudHM7cmV0dXJuIHRoaXMudXBkYXRlLmFwcGx5KHRoaXMsYiksdGhpcy5fdHJpZ2dlcihcImNoYW5nZURhdGVcIiksdGhpcy5zZXRWYWx1ZSgpLHRoaXN9LHNldFVUQ0RhdGVzOmZ1bmN0aW9uKCl7dmFyIGI9YS5pc0FycmF5KGFyZ3VtZW50c1swXSk/YXJndW1lbnRzWzBdOmFyZ3VtZW50cztyZXR1cm4gdGhpcy5zZXREYXRlcy5hcHBseSh0aGlzLGEubWFwKGIsdGhpcy5fdXRjX3RvX2xvY2FsKSksdGhpc30sc2V0RGF0ZTpmKFwic2V0RGF0ZXNcIiksc2V0VVRDRGF0ZTpmKFwic2V0VVRDRGF0ZXNcIikscmVtb3ZlOmYoXCJkZXN0cm95XCIsXCJNZXRob2QgYHJlbW92ZWAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMi4wLiBVc2UgYGRlc3Ryb3lgIGluc3RlYWRcIiksc2V0VmFsdWU6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmdldEZvcm1hdHRlZERhdGUoKTtyZXR1cm4gdGhpcy5pbnB1dEZpZWxkLnZhbChhKSx0aGlzfSxnZXRGb3JtYXR0ZWREYXRlOmZ1bmN0aW9uKGMpe2M9PT1iJiYoYz10aGlzLm8uZm9ybWF0KTt2YXIgZD10aGlzLm8ubGFuZ3VhZ2U7cmV0dXJuIGEubWFwKHRoaXMuZGF0ZXMsZnVuY3Rpb24oYSl7cmV0dXJuIHIuZm9ybWF0RGF0ZShhLGMsZCl9KS5qb2luKHRoaXMuby5tdWx0aWRhdGVTZXBhcmF0b3IpfSxnZXRTdGFydERhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vLnN0YXJ0RGF0ZX0sc2V0U3RhcnREYXRlOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9wcm9jZXNzX29wdGlvbnMoe3N0YXJ0RGF0ZTphfSksdGhpcy51cGRhdGUoKSx0aGlzLnVwZGF0ZU5hdkFycm93cygpLHRoaXN9LGdldEVuZERhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vLmVuZERhdGV9LHNldEVuZERhdGU6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7ZW5kRGF0ZTphfSksdGhpcy51cGRhdGUoKSx0aGlzLnVwZGF0ZU5hdkFycm93cygpLHRoaXN9LHNldERheXNPZldlZWtEaXNhYmxlZDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fcHJvY2Vzc19vcHRpb25zKHtkYXlzT2ZXZWVrRGlzYWJsZWQ6YX0pLHRoaXMudXBkYXRlKCksdGhpc30sc2V0RGF5c09mV2Vla0hpZ2hsaWdodGVkOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9wcm9jZXNzX29wdGlvbnMoe2RheXNPZldlZWtIaWdobGlnaHRlZDphfSksdGhpcy51cGRhdGUoKSx0aGlzfSxzZXREYXRlc0Rpc2FibGVkOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9wcm9jZXNzX29wdGlvbnMoe2RhdGVzRGlzYWJsZWQ6YX0pLHRoaXMudXBkYXRlKCksdGhpc30scGxhY2U6ZnVuY3Rpb24oKXtpZih0aGlzLmlzSW5saW5lKXJldHVybiB0aGlzO3ZhciBiPXRoaXMucGlja2VyLm91dGVyV2lkdGgoKSxjPXRoaXMucGlja2VyLm91dGVySGVpZ2h0KCksZD0xMCxlPWEodGhpcy5vLmNvbnRhaW5lciksZj1lLndpZHRoKCksZz1cImJvZHlcIj09PXRoaXMuby5jb250YWluZXI/YShkb2N1bWVudCkuc2Nyb2xsVG9wKCk6ZS5zY3JvbGxUb3AoKSxoPWUub2Zmc2V0KCksaT1bMF07dGhpcy5lbGVtZW50LnBhcmVudHMoKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIGI9YSh0aGlzKS5jc3MoXCJ6LWluZGV4XCIpO1wiYXV0b1wiIT09YiYmMCE9PU51bWJlcihiKSYmaS5wdXNoKE51bWJlcihiKSl9KTt2YXIgaj1NYXRoLm1heC5hcHBseShNYXRoLGkpK3RoaXMuby56SW5kZXhPZmZzZXQsaz10aGlzLmNvbXBvbmVudD90aGlzLmNvbXBvbmVudC5wYXJlbnQoKS5vZmZzZXQoKTp0aGlzLmVsZW1lbnQub2Zmc2V0KCksbD10aGlzLmNvbXBvbmVudD90aGlzLmNvbXBvbmVudC5vdXRlckhlaWdodCghMCk6dGhpcy5lbGVtZW50Lm91dGVySGVpZ2h0KCExKSxtPXRoaXMuY29tcG9uZW50P3RoaXMuY29tcG9uZW50Lm91dGVyV2lkdGgoITApOnRoaXMuZWxlbWVudC5vdXRlcldpZHRoKCExKSxuPWsubGVmdC1oLmxlZnQsbz1rLnRvcC1oLnRvcDtcImJvZHlcIiE9PXRoaXMuby5jb250YWluZXImJihvKz1nKSx0aGlzLnBpY2tlci5yZW1vdmVDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LXRvcCBkYXRlcGlja2VyLW9yaWVudC1ib3R0b20gZGF0ZXBpY2tlci1vcmllbnQtcmlnaHQgZGF0ZXBpY2tlci1vcmllbnQtbGVmdFwiKSxcImF1dG9cIiE9PXRoaXMuby5vcmllbnRhdGlvbi54Pyh0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LVwiK3RoaXMuby5vcmllbnRhdGlvbi54KSxcInJpZ2h0XCI9PT10aGlzLm8ub3JpZW50YXRpb24ueCYmKG4tPWItbSkpOmsubGVmdDwwPyh0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LWxlZnRcIiksbi09ay5sZWZ0LWQpOm4rYj5mPyh0aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LXJpZ2h0XCIpLG4rPW0tYik6dGhpcy5vLnJ0bD90aGlzLnBpY2tlci5hZGRDbGFzcyhcImRhdGVwaWNrZXItb3JpZW50LXJpZ2h0XCIpOnRoaXMucGlja2VyLmFkZENsYXNzKFwiZGF0ZXBpY2tlci1vcmllbnQtbGVmdFwiKTt2YXIgcCxxPXRoaXMuby5vcmllbnRhdGlvbi55O2lmKFwiYXV0b1wiPT09cSYmKHA9LWcrby1jLHE9cDwwP1wiYm90dG9tXCI6XCJ0b3BcIiksdGhpcy5waWNrZXIuYWRkQ2xhc3MoXCJkYXRlcGlja2VyLW9yaWVudC1cIitxKSxcInRvcFwiPT09cT9vLT1jK3BhcnNlSW50KHRoaXMucGlja2VyLmNzcyhcInBhZGRpbmctdG9wXCIpKTpvKz1sLHRoaXMuby5ydGwpe3ZhciByPWYtKG4rbSk7dGhpcy5waWNrZXIuY3NzKHt0b3A6byxyaWdodDpyLHpJbmRleDpqfSl9ZWxzZSB0aGlzLnBpY2tlci5jc3Moe3RvcDpvLGxlZnQ6bix6SW5kZXg6an0pO3JldHVybiB0aGlzfSxfYWxsb3dfdXBkYXRlOiEwLHVwZGF0ZTpmdW5jdGlvbigpe2lmKCF0aGlzLl9hbGxvd191cGRhdGUpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy5kYXRlcy5jb3B5KCksYz1bXSxkPSExO3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyhhLmVhY2goYXJndW1lbnRzLGEucHJveHkoZnVuY3Rpb24oYSxiKXtiIGluc3RhbmNlb2YgRGF0ZSYmKGI9dGhpcy5fbG9jYWxfdG9fdXRjKGIpKSxjLnB1c2goYil9LHRoaXMpKSxkPSEwKTooYz10aGlzLmlzSW5wdXQ/dGhpcy5lbGVtZW50LnZhbCgpOnRoaXMuZWxlbWVudC5kYXRhKFwiZGF0ZVwiKXx8dGhpcy5pbnB1dEZpZWxkLnZhbCgpLGM9YyYmdGhpcy5vLm11bHRpZGF0ZT9jLnNwbGl0KHRoaXMuby5tdWx0aWRhdGVTZXBhcmF0b3IpOltjXSxkZWxldGUgdGhpcy5lbGVtZW50LmRhdGEoKS5kYXRlKSxjPWEubWFwKGMsYS5wcm94eShmdW5jdGlvbihhKXtyZXR1cm4gci5wYXJzZURhdGUoYSx0aGlzLm8uZm9ybWF0LHRoaXMuby5sYW5ndWFnZSx0aGlzLm8uYXNzdW1lTmVhcmJ5WWVhcil9LHRoaXMpKSxjPWEuZ3JlcChjLGEucHJveHkoZnVuY3Rpb24oYSl7cmV0dXJuIXRoaXMuZGF0ZVdpdGhpblJhbmdlKGEpfHwhYX0sdGhpcyksITApLHRoaXMuZGF0ZXMucmVwbGFjZShjKSx0aGlzLm8udXBkYXRlVmlld0RhdGUmJih0aGlzLmRhdGVzLmxlbmd0aD90aGlzLnZpZXdEYXRlPW5ldyBEYXRlKHRoaXMuZGF0ZXMuZ2V0KC0xKSk6dGhpcy52aWV3RGF0ZTx0aGlzLm8uc3RhcnREYXRlP3RoaXMudmlld0RhdGU9bmV3IERhdGUodGhpcy5vLnN0YXJ0RGF0ZSk6dGhpcy52aWV3RGF0ZT50aGlzLm8uZW5kRGF0ZT90aGlzLnZpZXdEYXRlPW5ldyBEYXRlKHRoaXMuby5lbmREYXRlKTp0aGlzLnZpZXdEYXRlPXRoaXMuby5kZWZhdWx0Vmlld0RhdGUpLGQ/KHRoaXMuc2V0VmFsdWUoKSx0aGlzLmVsZW1lbnQuY2hhbmdlKCkpOnRoaXMuZGF0ZXMubGVuZ3RoJiZTdHJpbmcoYikhPT1TdHJpbmcodGhpcy5kYXRlcykmJmQmJih0aGlzLl90cmlnZ2VyKFwiY2hhbmdlRGF0ZVwiKSx0aGlzLmVsZW1lbnQuY2hhbmdlKCkpLCF0aGlzLmRhdGVzLmxlbmd0aCYmYi5sZW5ndGgmJih0aGlzLl90cmlnZ2VyKFwiY2xlYXJEYXRlXCIpLHRoaXMuZWxlbWVudC5jaGFuZ2UoKSksdGhpcy5maWxsKCksdGhpc30sZmlsbERvdzpmdW5jdGlvbigpe2lmKHRoaXMuby5zaG93V2Vla0RheXMpe3ZhciBiPXRoaXMuby53ZWVrU3RhcnQsYz1cIjx0cj5cIjtmb3IodGhpcy5vLmNhbGVuZGFyV2Vla3MmJihjKz0nPHRoIGNsYXNzPVwiY3dcIj4mIzE2MDs8L3RoPicpO2I8dGhpcy5vLndlZWtTdGFydCs3OyljKz0nPHRoIGNsYXNzPVwiZG93JyxhLmluQXJyYXkoYix0aGlzLm8uZGF5c09mV2Vla0Rpc2FibGVkKSE9PS0xJiYoYys9XCIgZGlzYWJsZWRcIiksYys9J1wiPicrcVt0aGlzLm8ubGFuZ3VhZ2VdLmRheXNNaW5bYisrJTddK1wiPC90aD5cIjtjKz1cIjwvdHI+XCIsdGhpcy5waWNrZXIuZmluZChcIi5kYXRlcGlja2VyLWRheXMgdGhlYWRcIikuYXBwZW5kKGMpfX0sZmlsbE1vbnRoczpmdW5jdGlvbigpe2Zvcih2YXIgYSxiPXRoaXMuX3V0Y190b19sb2NhbCh0aGlzLnZpZXdEYXRlKSxjPVwiXCIsZD0wO2Q8MTI7ZCsrKWE9YiYmYi5nZXRNb250aCgpPT09ZD9cIiBmb2N1c2VkXCI6XCJcIixjKz0nPHNwYW4gY2xhc3M9XCJtb250aCcrYSsnXCI+JytxW3RoaXMuby5sYW5ndWFnZV0ubW9udGhzU2hvcnRbZF0rXCI8L3NwYW4+XCI7dGhpcy5waWNrZXIuZmluZChcIi5kYXRlcGlja2VyLW1vbnRocyB0ZFwiKS5odG1sKGMpfSxzZXRSYW5nZTpmdW5jdGlvbihiKXtiJiZiLmxlbmd0aD90aGlzLnJhbmdlPWEubWFwKGIsZnVuY3Rpb24oYSl7cmV0dXJuIGEudmFsdWVPZigpfSk6ZGVsZXRlIHRoaXMucmFuZ2UsdGhpcy5maWxsKCl9LGdldENsYXNzTmFtZXM6ZnVuY3Rpb24oYil7dmFyIGM9W10sZj10aGlzLnZpZXdEYXRlLmdldFVUQ0Z1bGxZZWFyKCksZz10aGlzLnZpZXdEYXRlLmdldFVUQ01vbnRoKCksaD1kKCk7cmV0dXJuIGIuZ2V0VVRDRnVsbFllYXIoKTxmfHxiLmdldFVUQ0Z1bGxZZWFyKCk9PT1mJiZiLmdldFVUQ01vbnRoKCk8Zz9jLnB1c2goXCJvbGRcIik6KGIuZ2V0VVRDRnVsbFllYXIoKT5mfHxiLmdldFVUQ0Z1bGxZZWFyKCk9PT1mJiZiLmdldFVUQ01vbnRoKCk+ZykmJmMucHVzaChcIm5ld1wiKSx0aGlzLmZvY3VzRGF0ZSYmYi52YWx1ZU9mKCk9PT10aGlzLmZvY3VzRGF0ZS52YWx1ZU9mKCkmJmMucHVzaChcImZvY3VzZWRcIiksdGhpcy5vLnRvZGF5SGlnaGxpZ2h0JiZlKGIsaCkmJmMucHVzaChcInRvZGF5XCIpLHRoaXMuZGF0ZXMuY29udGFpbnMoYikhPT0tMSYmYy5wdXNoKFwiYWN0aXZlXCIpLHRoaXMuZGF0ZVdpdGhpblJhbmdlKGIpfHxjLnB1c2goXCJkaXNhYmxlZFwiKSx0aGlzLmRhdGVJc0Rpc2FibGVkKGIpJiZjLnB1c2goXCJkaXNhYmxlZFwiLFwiZGlzYWJsZWQtZGF0ZVwiKSxhLmluQXJyYXkoYi5nZXRVVENEYXkoKSx0aGlzLm8uZGF5c09mV2Vla0hpZ2hsaWdodGVkKSE9PS0xJiZjLnB1c2goXCJoaWdobGlnaHRlZFwiKSx0aGlzLnJhbmdlJiYoYj50aGlzLnJhbmdlWzBdJiZiPHRoaXMucmFuZ2VbdGhpcy5yYW5nZS5sZW5ndGgtMV0mJmMucHVzaChcInJhbmdlXCIpLGEuaW5BcnJheShiLnZhbHVlT2YoKSx0aGlzLnJhbmdlKSE9PS0xJiZjLnB1c2goXCJzZWxlY3RlZFwiKSxiLnZhbHVlT2YoKT09PXRoaXMucmFuZ2VbMF0mJmMucHVzaChcInJhbmdlLXN0YXJ0XCIpLGIudmFsdWVPZigpPT09dGhpcy5yYW5nZVt0aGlzLnJhbmdlLmxlbmd0aC0xXSYmYy5wdXNoKFwicmFuZ2UtZW5kXCIpKSxjfSxfZmlsbF95ZWFyc1ZpZXc6ZnVuY3Rpb24oYyxkLGUsZixnLGgsaSl7Zm9yKHZhciBqLGssbCxtPVwiXCIsbj1lLzEwLG89dGhpcy5waWNrZXIuZmluZChjKSxwPU1hdGguZmxvb3IoZi9lKSplLHE9cCs5Km4scj1NYXRoLmZsb29yKHRoaXMudmlld0RhdGUuZ2V0RnVsbFllYXIoKS9uKSpuLHM9YS5tYXAodGhpcy5kYXRlcyxmdW5jdGlvbihhKXtyZXR1cm4gTWF0aC5mbG9vcihhLmdldFVUQ0Z1bGxZZWFyKCkvbikqbn0pLHQ9cC1uO3Q8PXErbjt0Kz1uKWo9W2RdLGs9bnVsbCx0PT09cC1uP2oucHVzaChcIm9sZFwiKTp0PT09cStuJiZqLnB1c2goXCJuZXdcIiksYS5pbkFycmF5KHQscykhPT0tMSYmai5wdXNoKFwiYWN0aXZlXCIpLCh0PGd8fHQ+aCkmJmoucHVzaChcImRpc2FibGVkXCIpLHQ9PT1yJiZqLnB1c2goXCJmb2N1c2VkXCIpLGkhPT1hLm5vb3AmJihsPWkobmV3IERhdGUodCwwLDEpKSxsPT09Yj9sPXt9OlwiYm9vbGVhblwiPT10eXBlb2YgbD9sPXtlbmFibGVkOmx9Olwic3RyaW5nXCI9PXR5cGVvZiBsJiYobD17Y2xhc3NlczpsfSksbC5lbmFibGVkPT09ITEmJmoucHVzaChcImRpc2FibGVkXCIpLGwuY2xhc3NlcyYmKGo9ai5jb25jYXQobC5jbGFzc2VzLnNwbGl0KC9cXHMrLykpKSxsLnRvb2x0aXAmJihrPWwudG9vbHRpcCkpLG0rPSc8c3BhbiBjbGFzcz1cIicrai5qb2luKFwiIFwiKSsnXCInKyhrPycgdGl0bGU9XCInK2srJ1wiJzpcIlwiKStcIj5cIit0K1wiPC9zcGFuPlwiO28uZmluZChcIi5kYXRlcGlja2VyLXN3aXRjaFwiKS50ZXh0KHArXCItXCIrcSksby5maW5kKFwidGRcIikuaHRtbChtKX0sZmlsbDpmdW5jdGlvbigpe3ZhciBkLGUsZj1uZXcgRGF0ZSh0aGlzLnZpZXdEYXRlKSxnPWYuZ2V0VVRDRnVsbFllYXIoKSxoPWYuZ2V0VVRDTW9udGgoKSxpPXRoaXMuby5zdGFydERhdGUhPT0tKDEvMCk/dGhpcy5vLnN0YXJ0RGF0ZS5nZXRVVENGdWxsWWVhcigpOi0oMS8wKSxqPXRoaXMuby5zdGFydERhdGUhPT0tKDEvMCk/dGhpcy5vLnN0YXJ0RGF0ZS5nZXRVVENNb250aCgpOi0oMS8wKSxrPXRoaXMuby5lbmREYXRlIT09MS8wP3RoaXMuby5lbmREYXRlLmdldFVUQ0Z1bGxZZWFyKCk6MS8wLGw9dGhpcy5vLmVuZERhdGUhPT0xLzA/dGhpcy5vLmVuZERhdGUuZ2V0VVRDTW9udGgoKToxLzAsbT1xW3RoaXMuby5sYW5ndWFnZV0udG9kYXl8fHEuZW4udG9kYXl8fFwiXCIsbj1xW3RoaXMuby5sYW5ndWFnZV0uY2xlYXJ8fHEuZW4uY2xlYXJ8fFwiXCIsbz1xW3RoaXMuby5sYW5ndWFnZV0udGl0bGVGb3JtYXR8fHEuZW4udGl0bGVGb3JtYXQ7aWYoIWlzTmFOKGcpJiYhaXNOYU4oaCkpe3RoaXMucGlja2VyLmZpbmQoXCIuZGF0ZXBpY2tlci1kYXlzIC5kYXRlcGlja2VyLXN3aXRjaFwiKS50ZXh0KHIuZm9ybWF0RGF0ZShmLG8sdGhpcy5vLmxhbmd1YWdlKSksdGhpcy5waWNrZXIuZmluZChcInRmb290IC50b2RheVwiKS50ZXh0KG0pLmNzcyhcImRpc3BsYXlcIix0aGlzLm8udG9kYXlCdG49PT0hMHx8XCJsaW5rZWRcIj09PXRoaXMuby50b2RheUJ0bj9cInRhYmxlLWNlbGxcIjpcIm5vbmVcIiksdGhpcy5waWNrZXIuZmluZChcInRmb290IC5jbGVhclwiKS50ZXh0KG4pLmNzcyhcImRpc3BsYXlcIix0aGlzLm8uY2xlYXJCdG49PT0hMD9cInRhYmxlLWNlbGxcIjpcIm5vbmVcIiksdGhpcy5waWNrZXIuZmluZChcInRoZWFkIC5kYXRlcGlja2VyLXRpdGxlXCIpLnRleHQodGhpcy5vLnRpdGxlKS5jc3MoXCJkaXNwbGF5XCIsXCJzdHJpbmdcIj09dHlwZW9mIHRoaXMuby50aXRsZSYmXCJcIiE9PXRoaXMuby50aXRsZT9cInRhYmxlLWNlbGxcIjpcIm5vbmVcIiksdGhpcy51cGRhdGVOYXZBcnJvd3MoKSx0aGlzLmZpbGxNb250aHMoKTt2YXIgcD1jKGcsaCwwKSxzPXAuZ2V0VVRDRGF0ZSgpO3Auc2V0VVRDRGF0ZShzLShwLmdldFVUQ0RheSgpLXRoaXMuby53ZWVrU3RhcnQrNyklNyk7dmFyIHQ9bmV3IERhdGUocCk7cC5nZXRVVENGdWxsWWVhcigpPDEwMCYmdC5zZXRVVENGdWxsWWVhcihwLmdldFVUQ0Z1bGxZZWFyKCkpLHQuc2V0VVRDRGF0ZSh0LmdldFVUQ0RhdGUoKSs0MiksdD10LnZhbHVlT2YoKTtmb3IodmFyIHUsdix3PVtdO3AudmFsdWVPZigpPHQ7KXtpZih1PXAuZ2V0VVRDRGF5KCksdT09PXRoaXMuby53ZWVrU3RhcnQmJih3LnB1c2goXCI8dHI+XCIpLHRoaXMuby5jYWxlbmRhcldlZWtzKSl7dmFyIHg9bmV3IERhdGUoK3ArKHRoaXMuby53ZWVrU3RhcnQtdS03KSU3Kjg2NGU1KSx5PW5ldyBEYXRlKE51bWJlcih4KSsoMTEteC5nZXRVVENEYXkoKSklNyo4NjRlNSksej1uZXcgRGF0ZShOdW1iZXIoej1jKHkuZ2V0VVRDRnVsbFllYXIoKSwwLDEpKSsoMTEtei5nZXRVVENEYXkoKSklNyo4NjRlNSksQT0oeS16KS84NjRlNS83KzE7dy5wdXNoKCc8dGQgY2xhc3M9XCJjd1wiPicrQStcIjwvdGQ+XCIpfXY9dGhpcy5nZXRDbGFzc05hbWVzKHApLHYucHVzaChcImRheVwiKTt2YXIgQj1wLmdldFVUQ0RhdGUoKTt0aGlzLm8uYmVmb3JlU2hvd0RheSE9PWEubm9vcCYmKGU9dGhpcy5vLmJlZm9yZVNob3dEYXkodGhpcy5fdXRjX3RvX2xvY2FsKHApKSxlPT09Yj9lPXt9OlwiYm9vbGVhblwiPT10eXBlb2YgZT9lPXtlbmFibGVkOmV9Olwic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT17Y2xhc3NlczplfSksZS5lbmFibGVkPT09ITEmJnYucHVzaChcImRpc2FibGVkXCIpLGUuY2xhc3NlcyYmKHY9di5jb25jYXQoZS5jbGFzc2VzLnNwbGl0KC9cXHMrLykpKSxlLnRvb2x0aXAmJihkPWUudG9vbHRpcCksZS5jb250ZW50JiYoQj1lLmNvbnRlbnQpKSx2PWEuaXNGdW5jdGlvbihhLnVuaXF1ZVNvcnQpP2EudW5pcXVlU29ydCh2KTphLnVuaXF1ZSh2KSx3LnB1c2goJzx0ZCBjbGFzcz1cIicrdi5qb2luKFwiIFwiKSsnXCInKyhkPycgdGl0bGU9XCInK2QrJ1wiJzpcIlwiKSsnIGRhdGEtZGF0ZT1cIicrcC5nZXRUaW1lKCkudG9TdHJpbmcoKSsnXCI+JytCK1wiPC90ZD5cIiksZD1udWxsLHU9PT10aGlzLm8ud2Vla0VuZCYmdy5wdXNoKFwiPC90cj5cIikscC5zZXRVVENEYXRlKHAuZ2V0VVRDRGF0ZSgpKzEpfXRoaXMucGlja2VyLmZpbmQoXCIuZGF0ZXBpY2tlci1kYXlzIHRib2R5XCIpLmh0bWwody5qb2luKFwiXCIpKTt2YXIgQz1xW3RoaXMuby5sYW5ndWFnZV0ubW9udGhzVGl0bGV8fHEuZW4ubW9udGhzVGl0bGV8fFwiTW9udGhzXCIsRD10aGlzLnBpY2tlci5maW5kKFwiLmRhdGVwaWNrZXItbW9udGhzXCIpLmZpbmQoXCIuZGF0ZXBpY2tlci1zd2l0Y2hcIikudGV4dCh0aGlzLm8ubWF4Vmlld01vZGU8Mj9DOmcpLmVuZCgpLmZpbmQoXCJ0Ym9keSBzcGFuXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO2lmKGEuZWFjaCh0aGlzLmRhdGVzLGZ1bmN0aW9uKGEsYil7Yi5nZXRVVENGdWxsWWVhcigpPT09ZyYmRC5lcShiLmdldFVUQ01vbnRoKCkpLmFkZENsYXNzKFwiYWN0aXZlXCIpfSksKGc8aXx8Zz5rKSYmRC5hZGRDbGFzcyhcImRpc2FibGVkXCIpLGc9PT1pJiZELnNsaWNlKDAsaikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKSxnPT09ayYmRC5zbGljZShsKzEpLmFkZENsYXNzKFwiZGlzYWJsZWRcIiksdGhpcy5vLmJlZm9yZVNob3dNb250aCE9PWEubm9vcCl7dmFyIEU9dGhpczthLmVhY2goRCxmdW5jdGlvbihjLGQpe3ZhciBlPW5ldyBEYXRlKGcsYywxKSxmPUUuby5iZWZvcmVTaG93TW9udGgoZSk7Zj09PWI/Zj17fTpcImJvb2xlYW5cIj09dHlwZW9mIGY/Zj17ZW5hYmxlZDpmfTpcInN0cmluZ1wiPT10eXBlb2YgZiYmKGY9e2NsYXNzZXM6Zn0pLGYuZW5hYmxlZCE9PSExfHxhKGQpLmhhc0NsYXNzKFwiZGlzYWJsZWRcIil8fGEoZCkuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKSxmLmNsYXNzZXMmJmEoZCkuYWRkQ2xhc3MoZi5jbGFzc2VzKSxmLnRvb2x0aXAmJmEoZCkucHJvcChcInRpdGxlXCIsZi50b29sdGlwKX0pfXRoaXMuX2ZpbGxfeWVhcnNWaWV3KFwiLmRhdGVwaWNrZXIteWVhcnNcIixcInllYXJcIiwxMCxnLGksayx0aGlzLm8uYmVmb3JlU2hvd1llYXIpLHRoaXMuX2ZpbGxfeWVhcnNWaWV3KFwiLmRhdGVwaWNrZXItZGVjYWRlc1wiLFwiZGVjYWRlXCIsMTAwLGcsaSxrLHRoaXMuby5iZWZvcmVTaG93RGVjYWRlKSx0aGlzLl9maWxsX3llYXJzVmlldyhcIi5kYXRlcGlja2VyLWNlbnR1cmllc1wiLFwiY2VudHVyeVwiLDFlMyxnLGksayx0aGlzLm8uYmVmb3JlU2hvd0NlbnR1cnkpfX0sdXBkYXRlTmF2QXJyb3dzOmZ1bmN0aW9uKCl7aWYodGhpcy5fYWxsb3dfdXBkYXRlKXt2YXIgYSxiLGM9bmV3IERhdGUodGhpcy52aWV3RGF0ZSksZD1jLmdldFVUQ0Z1bGxZZWFyKCksZT1jLmdldFVUQ01vbnRoKCksZj10aGlzLm8uc3RhcnREYXRlIT09LSgxLzApP3RoaXMuby5zdGFydERhdGUuZ2V0VVRDRnVsbFllYXIoKTotKDEvMCksZz10aGlzLm8uc3RhcnREYXRlIT09LSgxLzApP3RoaXMuby5zdGFydERhdGUuZ2V0VVRDTW9udGgoKTotKDEvMCksaD10aGlzLm8uZW5kRGF0ZSE9PTEvMD90aGlzLm8uZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpOjEvMCxpPXRoaXMuby5lbmREYXRlIT09MS8wP3RoaXMuby5lbmREYXRlLmdldFVUQ01vbnRoKCk6MS8wLGo9MTtzd2l0Y2godGhpcy52aWV3TW9kZSl7Y2FzZSA0OmoqPTEwO2Nhc2UgMzpqKj0xMDtjYXNlIDI6aio9MTA7Y2FzZSAxOmE9TWF0aC5mbG9vcihkL2opKmo8ZixiPU1hdGguZmxvb3IoZC9qKSpqK2o+aDticmVhaztjYXNlIDA6YT1kPD1mJiZlPGcsYj1kPj1oJiZlPml9dGhpcy5waWNrZXIuZmluZChcIi5wcmV2XCIpLnRvZ2dsZUNsYXNzKFwiZGlzYWJsZWRcIixhKSx0aGlzLnBpY2tlci5maW5kKFwiLm5leHRcIikudG9nZ2xlQ2xhc3MoXCJkaXNhYmxlZFwiLGIpfX0sY2xpY2s6ZnVuY3Rpb24oYil7Yi5wcmV2ZW50RGVmYXVsdCgpLGIuc3RvcFByb3BhZ2F0aW9uKCk7dmFyIGUsZixnLGg7ZT1hKGIudGFyZ2V0KSxlLmhhc0NsYXNzKFwiZGF0ZXBpY2tlci1zd2l0Y2hcIikmJnRoaXMudmlld01vZGUhPT10aGlzLm8ubWF4Vmlld01vZGUmJnRoaXMuc2V0Vmlld01vZGUodGhpcy52aWV3TW9kZSsxKSxlLmhhc0NsYXNzKFwidG9kYXlcIikmJiFlLmhhc0NsYXNzKFwiZGF5XCIpJiYodGhpcy5zZXRWaWV3TW9kZSgwKSx0aGlzLl9zZXREYXRlKGQoKSxcImxpbmtlZFwiPT09dGhpcy5vLnRvZGF5QnRuP251bGw6XCJ2aWV3XCIpKSxlLmhhc0NsYXNzKFwiY2xlYXJcIikmJnRoaXMuY2xlYXJEYXRlcygpLGUuaGFzQ2xhc3MoXCJkaXNhYmxlZFwiKXx8KGUuaGFzQ2xhc3MoXCJtb250aFwiKXx8ZS5oYXNDbGFzcyhcInllYXJcIil8fGUuaGFzQ2xhc3MoXCJkZWNhZGVcIil8fGUuaGFzQ2xhc3MoXCJjZW50dXJ5XCIpKSYmKHRoaXMudmlld0RhdGUuc2V0VVRDRGF0ZSgxKSxmPTEsMT09PXRoaXMudmlld01vZGU/KGg9ZS5wYXJlbnQoKS5maW5kKFwic3BhblwiKS5pbmRleChlKSxnPXRoaXMudmlld0RhdGUuZ2V0VVRDRnVsbFllYXIoKSx0aGlzLnZpZXdEYXRlLnNldFVUQ01vbnRoKGgpKTooaD0wLGc9TnVtYmVyKGUudGV4dCgpKSx0aGlzLnZpZXdEYXRlLnNldFVUQ0Z1bGxZZWFyKGcpKSx0aGlzLl90cmlnZ2VyKHIudmlld01vZGVzW3RoaXMudmlld01vZGUtMV0uZSx0aGlzLnZpZXdEYXRlKSx0aGlzLnZpZXdNb2RlPT09dGhpcy5vLm1pblZpZXdNb2RlP3RoaXMuX3NldERhdGUoYyhnLGgsZikpOih0aGlzLnNldFZpZXdNb2RlKHRoaXMudmlld01vZGUtMSksdGhpcy5maWxsKCkpKSx0aGlzLnBpY2tlci5pcyhcIjp2aXNpYmxlXCIpJiZ0aGlzLl9mb2N1c2VkX2Zyb20mJnRoaXMuX2ZvY3VzZWRfZnJvbS5mb2N1cygpLGRlbGV0ZSB0aGlzLl9mb2N1c2VkX2Zyb219LGRheUNlbGxDbGljazpmdW5jdGlvbihiKXt2YXIgYz1hKGIuY3VycmVudFRhcmdldCksZD1jLmRhdGEoXCJkYXRlXCIpLGU9bmV3IERhdGUoZCk7dGhpcy5vLnVwZGF0ZVZpZXdEYXRlJiYoZS5nZXRVVENGdWxsWWVhcigpIT09dGhpcy52aWV3RGF0ZS5nZXRVVENGdWxsWWVhcigpJiZ0aGlzLl90cmlnZ2VyKFwiY2hhbmdlWWVhclwiLHRoaXMudmlld0RhdGUpLGUuZ2V0VVRDTW9udGgoKSE9PXRoaXMudmlld0RhdGUuZ2V0VVRDTW9udGgoKSYmdGhpcy5fdHJpZ2dlcihcImNoYW5nZU1vbnRoXCIsdGhpcy52aWV3RGF0ZSkpLHRoaXMuX3NldERhdGUoZSl9LG5hdkFycm93c0NsaWNrOmZ1bmN0aW9uKGIpe3ZhciBjPWEoYi5jdXJyZW50VGFyZ2V0KSxkPWMuaGFzQ2xhc3MoXCJwcmV2XCIpPy0xOjE7MCE9PXRoaXMudmlld01vZGUmJihkKj0xMipyLnZpZXdNb2Rlc1t0aGlzLnZpZXdNb2RlXS5uYXZTdGVwKSx0aGlzLnZpZXdEYXRlPXRoaXMubW92ZU1vbnRoKHRoaXMudmlld0RhdGUsZCksdGhpcy5fdHJpZ2dlcihyLnZpZXdNb2Rlc1t0aGlzLnZpZXdNb2RlXS5lLHRoaXMudmlld0RhdGUpLHRoaXMuZmlsbCgpfSxfdG9nZ2xlX211bHRpZGF0ZTpmdW5jdGlvbihhKXt2YXIgYj10aGlzLmRhdGVzLmNvbnRhaW5zKGEpO2lmKGF8fHRoaXMuZGF0ZXMuY2xlYXIoKSxiIT09LTE/KHRoaXMuby5tdWx0aWRhdGU9PT0hMHx8dGhpcy5vLm11bHRpZGF0ZT4xfHx0aGlzLm8udG9nZ2xlQWN0aXZlKSYmdGhpcy5kYXRlcy5yZW1vdmUoYik6dGhpcy5vLm11bHRpZGF0ZT09PSExPyh0aGlzLmRhdGVzLmNsZWFyKCksdGhpcy5kYXRlcy5wdXNoKGEpKTp0aGlzLmRhdGVzLnB1c2goYSksXCJudW1iZXJcIj09dHlwZW9mIHRoaXMuby5tdWx0aWRhdGUpZm9yKDt0aGlzLmRhdGVzLmxlbmd0aD50aGlzLm8ubXVsdGlkYXRlOyl0aGlzLmRhdGVzLnJlbW92ZSgwKX0sX3NldERhdGU6ZnVuY3Rpb24oYSxiKXtiJiZcImRhdGVcIiE9PWJ8fHRoaXMuX3RvZ2dsZV9tdWx0aWRhdGUoYSYmbmV3IERhdGUoYSkpLCghYiYmdGhpcy5vLnVwZGF0ZVZpZXdEYXRlfHxcInZpZXdcIj09PWIpJiYodGhpcy52aWV3RGF0ZT1hJiZuZXcgRGF0ZShhKSksdGhpcy5maWxsKCksdGhpcy5zZXRWYWx1ZSgpLGImJlwidmlld1wiPT09Ynx8dGhpcy5fdHJpZ2dlcihcImNoYW5nZURhdGVcIiksdGhpcy5pbnB1dEZpZWxkLnRyaWdnZXIoXCJjaGFuZ2VcIiksIXRoaXMuby5hdXRvY2xvc2V8fGImJlwiZGF0ZVwiIT09Ynx8dGhpcy5oaWRlKCl9LG1vdmVEYXk6ZnVuY3Rpb24oYSxiKXt2YXIgYz1uZXcgRGF0ZShhKTtyZXR1cm4gYy5zZXRVVENEYXRlKGEuZ2V0VVRDRGF0ZSgpK2IpLGN9LG1vdmVXZWVrOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMubW92ZURheShhLDcqYil9LG1vdmVNb250aDpmdW5jdGlvbihhLGIpe2lmKCFnKGEpKXJldHVybiB0aGlzLm8uZGVmYXVsdFZpZXdEYXRlO2lmKCFiKXJldHVybiBhO3ZhciBjLGQsZT1uZXcgRGF0ZShhLnZhbHVlT2YoKSksZj1lLmdldFVUQ0RhdGUoKSxoPWUuZ2V0VVRDTW9udGgoKSxpPU1hdGguYWJzKGIpO2lmKGI9Yj4wPzE6LTEsMT09PWkpZD1iPT09LTE/ZnVuY3Rpb24oKXtyZXR1cm4gZS5nZXRVVENNb250aCgpPT09aH06ZnVuY3Rpb24oKXtyZXR1cm4gZS5nZXRVVENNb250aCgpIT09Y30sYz1oK2IsZS5zZXRVVENNb250aChjKSxjPShjKzEyKSUxMjtlbHNle2Zvcih2YXIgaj0wO2o8aTtqKyspZT10aGlzLm1vdmVNb250aChlLGIpO2M9ZS5nZXRVVENNb250aCgpLGUuc2V0VVRDRGF0ZShmKSxkPWZ1bmN0aW9uKCl7cmV0dXJuIGMhPT1lLmdldFVUQ01vbnRoKCl9fWZvcig7ZCgpOyllLnNldFVUQ0RhdGUoLS1mKSxlLnNldFVUQ01vbnRoKGMpO3JldHVybiBlfSxtb3ZlWWVhcjpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLm1vdmVNb250aChhLDEyKmIpfSxtb3ZlQXZhaWxhYmxlRGF0ZTpmdW5jdGlvbihhLGIsYyl7ZG97aWYoYT10aGlzW2NdKGEsYiksIXRoaXMuZGF0ZVdpdGhpblJhbmdlKGEpKXJldHVybiExO2M9XCJtb3ZlRGF5XCJ9d2hpbGUodGhpcy5kYXRlSXNEaXNhYmxlZChhKSk7cmV0dXJuIGF9LHdlZWtPZkRhdGVJc0Rpc2FibGVkOmZ1bmN0aW9uKGIpe3JldHVybiBhLmluQXJyYXkoYi5nZXRVVENEYXkoKSx0aGlzLm8uZGF5c09mV2Vla0Rpc2FibGVkKSE9PS0xfSxkYXRlSXNEaXNhYmxlZDpmdW5jdGlvbihiKXtyZXR1cm4gdGhpcy53ZWVrT2ZEYXRlSXNEaXNhYmxlZChiKXx8YS5ncmVwKHRoaXMuby5kYXRlc0Rpc2FibGVkLGZ1bmN0aW9uKGEpe3JldHVybiBlKGIsYSl9KS5sZW5ndGg+MH0sZGF0ZVdpdGhpblJhbmdlOmZ1bmN0aW9uKGEpe3JldHVybiBhPj10aGlzLm8uc3RhcnREYXRlJiZhPD10aGlzLm8uZW5kRGF0ZX0sa2V5ZG93bjpmdW5jdGlvbihhKXtpZighdGhpcy5waWNrZXIuaXMoXCI6dmlzaWJsZVwiKSlyZXR1cm4gdm9pZCg0MCE9PWEua2V5Q29kZSYmMjchPT1hLmtleUNvZGV8fCh0aGlzLnNob3coKSxhLnN0b3BQcm9wYWdhdGlvbigpKSk7dmFyIGIsYyxkPSExLGU9dGhpcy5mb2N1c0RhdGV8fHRoaXMudmlld0RhdGU7c3dpdGNoKGEua2V5Q29kZSl7Y2FzZSAyNzp0aGlzLmZvY3VzRGF0ZT8odGhpcy5mb2N1c0RhdGU9bnVsbCx0aGlzLnZpZXdEYXRlPXRoaXMuZGF0ZXMuZ2V0KC0xKXx8dGhpcy52aWV3RGF0ZSx0aGlzLmZpbGwoKSk6dGhpcy5oaWRlKCksYS5wcmV2ZW50RGVmYXVsdCgpLGEuc3RvcFByb3BhZ2F0aW9uKCk7YnJlYWs7Y2FzZSAzNzpjYXNlIDM4OmNhc2UgMzk6Y2FzZSA0MDppZighdGhpcy5vLmtleWJvYXJkTmF2aWdhdGlvbnx8Nz09PXRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQubGVuZ3RoKWJyZWFrO2I9Mzc9PT1hLmtleUNvZGV8fDM4PT09YS5rZXlDb2RlPy0xOjEsMD09PXRoaXMudmlld01vZGU/YS5jdHJsS2V5PyhjPXRoaXMubW92ZUF2YWlsYWJsZURhdGUoZSxiLFwibW92ZVllYXJcIiksYyYmdGhpcy5fdHJpZ2dlcihcImNoYW5nZVllYXJcIix0aGlzLnZpZXdEYXRlKSk6YS5zaGlmdEtleT8oYz10aGlzLm1vdmVBdmFpbGFibGVEYXRlKGUsYixcIm1vdmVNb250aFwiKSxjJiZ0aGlzLl90cmlnZ2VyKFwiY2hhbmdlTW9udGhcIix0aGlzLnZpZXdEYXRlKSk6Mzc9PT1hLmtleUNvZGV8fDM5PT09YS5rZXlDb2RlP2M9dGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShlLGIsXCJtb3ZlRGF5XCIpOnRoaXMud2Vla09mRGF0ZUlzRGlzYWJsZWQoZSl8fChjPXRoaXMubW92ZUF2YWlsYWJsZURhdGUoZSxiLFwibW92ZVdlZWtcIikpOjE9PT10aGlzLnZpZXdNb2RlPygzOCE9PWEua2V5Q29kZSYmNDAhPT1hLmtleUNvZGV8fChiKj00KSxjPXRoaXMubW92ZUF2YWlsYWJsZURhdGUoZSxiLFwibW92ZU1vbnRoXCIpKToyPT09dGhpcy52aWV3TW9kZSYmKDM4IT09YS5rZXlDb2RlJiY0MCE9PWEua2V5Q29kZXx8KGIqPTQpLGM9dGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShlLGIsXCJtb3ZlWWVhclwiKSksYyYmKHRoaXMuZm9jdXNEYXRlPXRoaXMudmlld0RhdGU9Yyx0aGlzLnNldFZhbHVlKCksdGhpcy5maWxsKCksYS5wcmV2ZW50RGVmYXVsdCgpKTticmVhaztjYXNlIDEzOmlmKCF0aGlzLm8uZm9yY2VQYXJzZSlicmVhaztlPXRoaXMuZm9jdXNEYXRlfHx0aGlzLmRhdGVzLmdldCgtMSl8fHRoaXMudmlld0RhdGUsdGhpcy5vLmtleWJvYXJkTmF2aWdhdGlvbiYmKHRoaXMuX3RvZ2dsZV9tdWx0aWRhdGUoZSksZD0hMCksdGhpcy5mb2N1c0RhdGU9bnVsbCx0aGlzLnZpZXdEYXRlPXRoaXMuZGF0ZXMuZ2V0KC0xKXx8dGhpcy52aWV3RGF0ZSx0aGlzLnNldFZhbHVlKCksdGhpcy5maWxsKCksdGhpcy5waWNrZXIuaXMoXCI6dmlzaWJsZVwiKSYmKGEucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpLHRoaXMuby5hdXRvY2xvc2UmJnRoaXMuaGlkZSgpKTticmVhaztjYXNlIDk6dGhpcy5mb2N1c0RhdGU9bnVsbCx0aGlzLnZpZXdEYXRlPXRoaXMuZGF0ZXMuZ2V0KC0xKXx8dGhpcy52aWV3RGF0ZSx0aGlzLmZpbGwoKSx0aGlzLmhpZGUoKX1kJiYodGhpcy5kYXRlcy5sZW5ndGg/dGhpcy5fdHJpZ2dlcihcImNoYW5nZURhdGVcIik6dGhpcy5fdHJpZ2dlcihcImNsZWFyRGF0ZVwiKSx0aGlzLmlucHV0RmllbGQudHJpZ2dlcihcImNoYW5nZVwiKSl9LHNldFZpZXdNb2RlOmZ1bmN0aW9uKGEpe3RoaXMudmlld01vZGU9YSx0aGlzLnBpY2tlci5jaGlsZHJlbihcImRpdlwiKS5oaWRlKCkuZmlsdGVyKFwiLmRhdGVwaWNrZXItXCIrci52aWV3TW9kZXNbdGhpcy52aWV3TW9kZV0uY2xzTmFtZSkuc2hvdygpLHRoaXMudXBkYXRlTmF2QXJyb3dzKCksdGhpcy5fdHJpZ2dlcihcImNoYW5nZVZpZXdNb2RlXCIsbmV3IERhdGUodGhpcy52aWV3RGF0ZSkpfX07dmFyIGw9ZnVuY3Rpb24oYixjKXthLmRhdGEoYixcImRhdGVwaWNrZXJcIix0aGlzKSx0aGlzLmVsZW1lbnQ9YShiKSx0aGlzLmlucHV0cz1hLm1hcChjLmlucHV0cyxmdW5jdGlvbihhKXtyZXR1cm4gYS5qcXVlcnk/YVswXTphfSksZGVsZXRlIGMuaW5wdXRzLHRoaXMua2VlcEVtcHR5VmFsdWVzPWMua2VlcEVtcHR5VmFsdWVzLGRlbGV0ZSBjLmtlZXBFbXB0eVZhbHVlcyxuLmNhbGwoYSh0aGlzLmlucHV0cyksYykub24oXCJjaGFuZ2VEYXRlXCIsYS5wcm94eSh0aGlzLmRhdGVVcGRhdGVkLHRoaXMpKSx0aGlzLnBpY2tlcnM9YS5tYXAodGhpcy5pbnB1dHMsZnVuY3Rpb24oYil7cmV0dXJuIGEuZGF0YShiLFwiZGF0ZXBpY2tlclwiKX0pLHRoaXMudXBkYXRlRGF0ZXMoKX07bC5wcm90b3R5cGU9e3VwZGF0ZURhdGVzOmZ1bmN0aW9uKCl7dGhpcy5kYXRlcz1hLm1hcCh0aGlzLnBpY2tlcnMsZnVuY3Rpb24oYSl7cmV0dXJuIGEuZ2V0VVRDRGF0ZSgpfSksdGhpcy51cGRhdGVSYW5nZXMoKX0sdXBkYXRlUmFuZ2VzOmZ1bmN0aW9uKCl7dmFyIGI9YS5tYXAodGhpcy5kYXRlcyxmdW5jdGlvbihhKXtyZXR1cm4gYS52YWx1ZU9mKCl9KTthLmVhY2godGhpcy5waWNrZXJzLGZ1bmN0aW9uKGEsYyl7Yy5zZXRSYW5nZShiKX0pfSxjbGVhckRhdGVzOmZ1bmN0aW9uKCl7YS5lYWNoKHRoaXMucGlja2VycyxmdW5jdGlvbihhLGIpe2IuY2xlYXJEYXRlcygpfSl9LGRhdGVVcGRhdGVkOmZ1bmN0aW9uKGMpe2lmKCF0aGlzLnVwZGF0aW5nKXt0aGlzLnVwZGF0aW5nPSEwO3ZhciBkPWEuZGF0YShjLnRhcmdldCxcImRhdGVwaWNrZXJcIik7aWYoZCE9PWIpe3ZhciBlPWQuZ2V0VVRDRGF0ZSgpLGY9dGhpcy5rZWVwRW1wdHlWYWx1ZXMsZz1hLmluQXJyYXkoYy50YXJnZXQsdGhpcy5pbnB1dHMpLGg9Zy0xLGk9ZysxLGo9dGhpcy5pbnB1dHMubGVuZ3RoO2lmKGchPT0tMSl7aWYoYS5lYWNoKHRoaXMucGlja2VycyxmdW5jdGlvbihhLGIpe2IuZ2V0VVRDRGF0ZSgpfHxiIT09ZCYmZnx8Yi5zZXRVVENEYXRlKGUpfSksZTx0aGlzLmRhdGVzW2hdKWZvcig7aD49MCYmZTx0aGlzLmRhdGVzW2hdOyl0aGlzLnBpY2tlcnNbaC0tXS5zZXRVVENEYXRlKGUpO2Vsc2UgaWYoZT50aGlzLmRhdGVzW2ldKWZvcig7aTxqJiZlPnRoaXMuZGF0ZXNbaV07KXRoaXMucGlja2Vyc1tpKytdLnNldFVUQ0RhdGUoZSk7dGhpcy51cGRhdGVEYXRlcygpLGRlbGV0ZSB0aGlzLnVwZGF0aW5nfX19fSxkZXN0cm95OmZ1bmN0aW9uKCl7YS5tYXAodGhpcy5waWNrZXJzLGZ1bmN0aW9uKGEpe2EuZGVzdHJveSgpfSksYSh0aGlzLmlucHV0cykub2ZmKFwiY2hhbmdlRGF0ZVwiLHRoaXMuZGF0ZVVwZGF0ZWQpLGRlbGV0ZSB0aGlzLmVsZW1lbnQuZGF0YSgpLmRhdGVwaWNrZXJ9LHJlbW92ZTpmKFwiZGVzdHJveVwiLFwiTWV0aG9kIGByZW1vdmVgIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDIuMC4gVXNlIGBkZXN0cm95YCBpbnN0ZWFkXCIpfTt2YXIgbT1hLmZuLmRhdGVwaWNrZXIsbj1mdW5jdGlvbihjKXt2YXIgZD1BcnJheS5hcHBseShudWxsLGFyZ3VtZW50cyk7ZC5zaGlmdCgpO3ZhciBlO2lmKHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiPWEodGhpcyksZj1iLmRhdGEoXCJkYXRlcGlja2VyXCIpLGc9XCJvYmplY3RcIj09dHlwZW9mIGMmJmM7aWYoIWYpe3ZhciBqPWgodGhpcyxcImRhdGVcIiksbT1hLmV4dGVuZCh7fSxvLGosZyksbj1pKG0ubGFuZ3VhZ2UpLHA9YS5leHRlbmQoe30sbyxuLGosZyk7Yi5oYXNDbGFzcyhcImlucHV0LWRhdGVyYW5nZVwiKXx8cC5pbnB1dHM/KGEuZXh0ZW5kKHAse2lucHV0czpwLmlucHV0c3x8Yi5maW5kKFwiaW5wdXRcIikudG9BcnJheSgpfSksZj1uZXcgbCh0aGlzLHApKTpmPW5ldyBrKHRoaXMscCksYi5kYXRhKFwiZGF0ZXBpY2tlclwiLGYpfVwic3RyaW5nXCI9PXR5cGVvZiBjJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBmW2NdJiYoZT1mW2NdLmFwcGx5KGYsZCkpfSksZT09PWJ8fGUgaW5zdGFuY2VvZiBrfHxlIGluc3RhbmNlb2YgbClyZXR1cm4gdGhpcztpZih0aGlzLmxlbmd0aD4xKXRocm93IG5ldyBFcnJvcihcIlVzaW5nIG9ubHkgYWxsb3dlZCBmb3IgdGhlIGNvbGxlY3Rpb24gb2YgYSBzaW5nbGUgZWxlbWVudCAoXCIrYytcIiBmdW5jdGlvbilcIik7cmV0dXJuIGV9O2EuZm4uZGF0ZXBpY2tlcj1uO3ZhciBvPWEuZm4uZGF0ZXBpY2tlci5kZWZhdWx0cz17YXNzdW1lTmVhcmJ5WWVhcjohMSxhdXRvY2xvc2U6ITEsYmVmb3JlU2hvd0RheTphLm5vb3AsYmVmb3JlU2hvd01vbnRoOmEubm9vcCxiZWZvcmVTaG93WWVhcjphLm5vb3AsYmVmb3JlU2hvd0RlY2FkZTphLm5vb3AsYmVmb3JlU2hvd0NlbnR1cnk6YS5ub29wLGNhbGVuZGFyV2Vla3M6ITEsY2xlYXJCdG46ITEsdG9nZ2xlQWN0aXZlOiExLGRheXNPZldlZWtEaXNhYmxlZDpbXSxkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6W10sZGF0ZXNEaXNhYmxlZDpbXSxlbmREYXRlOjEvMCxmb3JjZVBhcnNlOiEwLGZvcm1hdDpcIm1tL2RkL3l5eXlcIixrZWVwRW1wdHlWYWx1ZXM6ITEsa2V5Ym9hcmROYXZpZ2F0aW9uOiEwLGxhbmd1YWdlOlwiZW5cIixtaW5WaWV3TW9kZTowLG1heFZpZXdNb2RlOjQsbXVsdGlkYXRlOiExLG11bHRpZGF0ZVNlcGFyYXRvcjpcIixcIixvcmllbnRhdGlvbjpcImF1dG9cIixydGw6ITEsc3RhcnREYXRlOi0oMS8wKSxzdGFydFZpZXc6MCx0b2RheUJ0bjohMSx0b2RheUhpZ2hsaWdodDohMSx1cGRhdGVWaWV3RGF0ZTohMCx3ZWVrU3RhcnQ6MCxkaXNhYmxlVG91Y2hLZXlib2FyZDohMSxlbmFibGVPblJlYWRvbmx5OiEwLHNob3dPbkZvY3VzOiEwLHpJbmRleE9mZnNldDoxMCxjb250YWluZXI6XCJib2R5XCIsaW1tZWRpYXRlVXBkYXRlczohMSx0aXRsZTpcIlwiLHRlbXBsYXRlczp7bGVmdEFycm93OlwiJiN4MDBBQjtcIixyaWdodEFycm93OlwiJiN4MDBCQjtcIn0sc2hvd1dlZWtEYXlzOiEwfSxwPWEuZm4uZGF0ZXBpY2tlci5sb2NhbGVfb3B0cz1bXCJmb3JtYXRcIixcInJ0bFwiLFwid2Vla1N0YXJ0XCJdO2EuZm4uZGF0ZXBpY2tlci5Db25zdHJ1Y3Rvcj1rO3ZhciBxPWEuZm4uZGF0ZXBpY2tlci5kYXRlcz17ZW46e2RheXM6W1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl0sZGF5c1Nob3J0OltcIlN1blwiLFwiTW9uXCIsXCJUdWVcIixcIldlZFwiLFwiVGh1XCIsXCJGcmlcIixcIlNhdFwiXSxkYXlzTWluOltcIlN1XCIsXCJNb1wiLFwiVHVcIixcIldlXCIsXCJUaFwiLFwiRnJcIixcIlNhXCJdLG1vbnRoczpbXCJKYW51YXJ5XCIsXCJGZWJydWFyeVwiLFwiTWFyY2hcIixcIkFwcmlsXCIsXCJNYXlcIixcIkp1bmVcIixcIkp1bHlcIixcIkF1Z3VzdFwiLFwiU2VwdGVtYmVyXCIsXCJPY3RvYmVyXCIsXCJOb3ZlbWJlclwiLFwiRGVjZW1iZXJcIl0sbW9udGhzU2hvcnQ6W1wiSmFuXCIsXCJGZWJcIixcIk1hclwiLFwiQXByXCIsXCJNYXlcIixcIkp1blwiLFwiSnVsXCIsXCJBdWdcIixcIlNlcFwiLFwiT2N0XCIsXCJOb3ZcIixcIkRlY1wiXSx0b2RheTpcIlRvZGF5XCIsY2xlYXI6XCJDbGVhclwiLHRpdGxlRm9ybWF0OlwiTU0geXl5eVwifX0scj17dmlld01vZGVzOlt7bmFtZXM6W1wiZGF5c1wiLFwibW9udGhcIl0sY2xzTmFtZTpcImRheXNcIixlOlwiY2hhbmdlTW9udGhcIn0se25hbWVzOltcIm1vbnRoc1wiLFwieWVhclwiXSxjbHNOYW1lOlwibW9udGhzXCIsZTpcImNoYW5nZVllYXJcIixuYXZTdGVwOjF9LHtuYW1lczpbXCJ5ZWFyc1wiLFwiZGVjYWRlXCJdLGNsc05hbWU6XCJ5ZWFyc1wiLGU6XCJjaGFuZ2VEZWNhZGVcIixuYXZTdGVwOjEwfSx7bmFtZXM6W1wiZGVjYWRlc1wiLFwiY2VudHVyeVwiXSxjbHNOYW1lOlwiZGVjYWRlc1wiLGU6XCJjaGFuZ2VDZW50dXJ5XCIsbmF2U3RlcDoxMDB9LHtuYW1lczpbXCJjZW50dXJpZXNcIixcIm1pbGxlbm5pdW1cIl0sY2xzTmFtZTpcImNlbnR1cmllc1wiLGU6XCJjaGFuZ2VNaWxsZW5uaXVtXCIsbmF2U3RlcDoxZTN9XSx2YWxpZFBhcnRzOi9kZD98REQ/fG1tP3xNTT98eXkoPzp5eSk/L2csbm9ucHVuY3R1YXRpb246L1teIC1cXC86LUBcXHU1ZTc0XFx1NjcwOFxcdTY1ZTVcXFstYHstflxcdFxcblxccl0rL2cscGFyc2VGb3JtYXQ6ZnVuY3Rpb24oYSl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYS50b1ZhbHVlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhLnRvRGlzcGxheSlyZXR1cm4gYTt2YXIgYj1hLnJlcGxhY2UodGhpcy52YWxpZFBhcnRzLFwiXFwwXCIpLnNwbGl0KFwiXFwwXCIpLGM9YS5tYXRjaCh0aGlzLnZhbGlkUGFydHMpO2lmKCFifHwhYi5sZW5ndGh8fCFjfHwwPT09Yy5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBkYXRlIGZvcm1hdC5cIik7cmV0dXJue3NlcGFyYXRvcnM6YixwYXJ0czpjfX0scGFyc2VEYXRlOmZ1bmN0aW9uKGMsZSxmLGcpe2Z1bmN0aW9uIGgoYSxiKXtyZXR1cm4gYj09PSEwJiYoYj0xMCksYTwxMDAmJihhKz0yZTMsYT4obmV3IERhdGUpLmdldEZ1bGxZZWFyKCkrYiYmKGEtPTEwMCkpLGF9ZnVuY3Rpb24gaSgpe3ZhciBhPXRoaXMuc2xpY2UoMCxqW25dLmxlbmd0aCksYj1qW25dLnNsaWNlKDAsYS5sZW5ndGgpO3JldHVybiBhLnRvTG93ZXJDYXNlKCk9PT1iLnRvTG93ZXJDYXNlKCl9aWYoIWMpcmV0dXJuIGI7aWYoYyBpbnN0YW5jZW9mIERhdGUpcmV0dXJuIGM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPXIucGFyc2VGb3JtYXQoZSkpLGUudG9WYWx1ZSlyZXR1cm4gZS50b1ZhbHVlKGMsZSxmKTt2YXIgaixsLG0sbixvLHA9e2Q6XCJtb3ZlRGF5XCIsbTpcIm1vdmVNb250aFwiLHc6XCJtb3ZlV2Vla1wiLHk6XCJtb3ZlWWVhclwifSxzPXt5ZXN0ZXJkYXk6XCItMWRcIix0b2RheTpcIiswZFwiLHRvbW9ycm93OlwiKzFkXCJ9O2lmKGMgaW4gcyYmKGM9c1tjXSksL15bXFwtK11cXGQrW2Rtd3ldKFtcXHMsXStbXFwtK11cXGQrW2Rtd3ldKSokL2kudGVzdChjKSl7Zm9yKGo9Yy5tYXRjaCgvKFtcXC0rXVxcZCspKFtkbXd5XSkvZ2kpLGM9bmV3IERhdGUsbj0wO248ai5sZW5ndGg7bisrKWw9altuXS5tYXRjaCgvKFtcXC0rXVxcZCspKFtkbXd5XSkvaSksbT1OdW1iZXIobFsxXSksbz1wW2xbMl0udG9Mb3dlckNhc2UoKV0sYz1rLnByb3RvdHlwZVtvXShjLG0pO3JldHVybiBrLnByb3RvdHlwZS5femVyb191dGNfdGltZShjKX1qPWMmJmMubWF0Y2godGhpcy5ub25wdW5jdHVhdGlvbil8fFtdO3ZhciB0LHUsdj17fSx3PVtcInl5eXlcIixcInl5XCIsXCJNXCIsXCJNTVwiLFwibVwiLFwibW1cIixcImRcIixcImRkXCJdLHg9e3l5eXk6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5zZXRVVENGdWxsWWVhcihnP2goYixnKTpiKX0sbTpmdW5jdGlvbihhLGIpe2lmKGlzTmFOKGEpKXJldHVybiBhO2ZvcihiLT0xO2I8MDspYis9MTI7Zm9yKGIlPTEyLGEuc2V0VVRDTW9udGgoYik7YS5nZXRVVENNb250aCgpIT09YjspYS5zZXRVVENEYXRlKGEuZ2V0VVRDRGF0ZSgpLTEpO3JldHVybiBhfSxkOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2V0VVRDRGF0ZShiKX19O3gueXk9eC55eXl5LHguTT14Lk1NPXgubW09eC5tLHguZGQ9eC5kLGM9ZCgpO3ZhciB5PWUucGFydHMuc2xpY2UoKTtpZihqLmxlbmd0aCE9PXkubGVuZ3RoJiYoeT1hKHkpLmZpbHRlcihmdW5jdGlvbihiLGMpe3JldHVybiBhLmluQXJyYXkoYyx3KSE9PS0xfSkudG9BcnJheSgpKSxqLmxlbmd0aD09PXkubGVuZ3RoKXt2YXIgejtmb3Iobj0wLHo9eS5sZW5ndGg7bjx6O24rKyl7aWYodD1wYXJzZUludChqW25dLDEwKSxsPXlbbl0saXNOYU4odCkpc3dpdGNoKGwpe2Nhc2VcIk1NXCI6dT1hKHFbZl0ubW9udGhzKS5maWx0ZXIoaSksdD1hLmluQXJyYXkodVswXSxxW2ZdLm1vbnRocykrMTticmVhaztjYXNlXCJNXCI6dT1hKHFbZl0ubW9udGhzU2hvcnQpLmZpbHRlcihpKSx0PWEuaW5BcnJheSh1WzBdLHFbZl0ubW9udGhzU2hvcnQpKzF9dltsXT10fXZhciBBLEI7Zm9yKG49MDtuPHcubGVuZ3RoO24rKylCPXdbbl0sQiBpbiB2JiYhaXNOYU4odltCXSkmJihBPW5ldyBEYXRlKGMpLHhbQl0oQSx2W0JdKSxpc05hTihBKXx8KGM9QSkpfXJldHVybiBjfSxmb3JtYXREYXRlOmZ1bmN0aW9uKGIsYyxkKXtpZighYilyZXR1cm5cIlwiO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBjJiYoYz1yLnBhcnNlRm9ybWF0KGMpKSxjLnRvRGlzcGxheSlyZXR1cm4gYy50b0Rpc3BsYXkoYixjLGQpO3ZhciBlPXtkOmIuZ2V0VVRDRGF0ZSgpLEQ6cVtkXS5kYXlzU2hvcnRbYi5nZXRVVENEYXkoKV0sREQ6cVtkXS5kYXlzW2IuZ2V0VVRDRGF5KCldLG06Yi5nZXRVVENNb250aCgpKzEsTTpxW2RdLm1vbnRoc1Nob3J0W2IuZ2V0VVRDTW9udGgoKV0sTU06cVtkXS5tb250aHNbYi5nZXRVVENNb250aCgpXSx5eTpiLmdldFVUQ0Z1bGxZZWFyKCkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMikseXl5eTpiLmdldFVUQ0Z1bGxZZWFyKCl9O2UuZGQ9KGUuZDwxMD9cIjBcIjpcIlwiKStlLmQsZS5tbT0oZS5tPDEwP1wiMFwiOlwiXCIpK2UubSxiPVtdO2Zvcih2YXIgZj1hLmV4dGVuZChbXSxjLnNlcGFyYXRvcnMpLGc9MCxoPWMucGFydHMubGVuZ3RoO2c8PWg7ZysrKWYubGVuZ3RoJiZiLnB1c2goZi5zaGlmdCgpKSxiLnB1c2goZVtjLnBhcnRzW2ddXSk7cmV0dXJuIGIuam9pbihcIlwiKX0saGVhZFRlbXBsYXRlOic8dGhlYWQ+PHRyPjx0aCBjb2xzcGFuPVwiN1wiIGNsYXNzPVwiZGF0ZXBpY2tlci10aXRsZVwiPjwvdGg+PC90cj48dHI+PHRoIGNsYXNzPVwicHJldlwiPicrby50ZW1wbGF0ZXMubGVmdEFycm93Kyc8L3RoPjx0aCBjb2xzcGFuPVwiNVwiIGNsYXNzPVwiZGF0ZXBpY2tlci1zd2l0Y2hcIj48L3RoPjx0aCBjbGFzcz1cIm5leHRcIj4nK28udGVtcGxhdGVzLnJpZ2h0QXJyb3crXCI8L3RoPjwvdHI+PC90aGVhZD5cIixcbmNvbnRUZW1wbGF0ZTonPHRib2R5Pjx0cj48dGQgY29sc3Bhbj1cIjdcIj48L3RkPjwvdHI+PC90Ym9keT4nLGZvb3RUZW1wbGF0ZTonPHRmb290Pjx0cj48dGggY29sc3Bhbj1cIjdcIiBjbGFzcz1cInRvZGF5XCI+PC90aD48L3RyPjx0cj48dGggY29sc3Bhbj1cIjdcIiBjbGFzcz1cImNsZWFyXCI+PC90aD48L3RyPjwvdGZvb3Q+J307ci50ZW1wbGF0ZT0nPGRpdiBjbGFzcz1cImRhdGVwaWNrZXJcIj48ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci1kYXlzXCI+PHRhYmxlIGNsYXNzPVwidGFibGUtY29uZGVuc2VkXCI+JytyLmhlYWRUZW1wbGF0ZStcIjx0Ym9keT48L3Rib2R5PlwiK3IuZm9vdFRlbXBsYXRlKyc8L3RhYmxlPjwvZGl2PjxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLW1vbnRoc1wiPjx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicrci5oZWFkVGVtcGxhdGUrci5jb250VGVtcGxhdGUrci5mb290VGVtcGxhdGUrJzwvdGFibGU+PC9kaXY+PGRpdiBjbGFzcz1cImRhdGVwaWNrZXIteWVhcnNcIj48dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK3IuaGVhZFRlbXBsYXRlK3IuY29udFRlbXBsYXRlK3IuZm9vdFRlbXBsYXRlKyc8L3RhYmxlPjwvZGl2PjxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLWRlY2FkZXNcIj48dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK3IuaGVhZFRlbXBsYXRlK3IuY29udFRlbXBsYXRlK3IuZm9vdFRlbXBsYXRlKyc8L3RhYmxlPjwvZGl2PjxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLWNlbnR1cmllc1wiPjx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicrci5oZWFkVGVtcGxhdGUrci5jb250VGVtcGxhdGUrci5mb290VGVtcGxhdGUrXCI8L3RhYmxlPjwvZGl2PjwvZGl2PlwiLGEuZm4uZGF0ZXBpY2tlci5EUEdsb2JhbD1yLGEuZm4uZGF0ZXBpY2tlci5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uZGF0ZXBpY2tlcj1tLHRoaXN9LGEuZm4uZGF0ZXBpY2tlci52ZXJzaW9uPVwiMS44LjBcIixhLmZuLmRhdGVwaWNrZXIuZGVwcmVjYXRlZD1mdW5jdGlvbihhKXt2YXIgYj13aW5kb3cuY29uc29sZTtiJiZiLndhcm4mJmIud2FybihcIkRFUFJFQ0FURUQ6IFwiK2EpfSxhKGRvY3VtZW50KS5vbihcImZvY3VzLmRhdGVwaWNrZXIuZGF0YS1hcGkgY2xpY2suZGF0ZXBpY2tlci5kYXRhLWFwaVwiLCdbZGF0YS1wcm92aWRlPVwiZGF0ZXBpY2tlclwiXScsZnVuY3Rpb24oYil7dmFyIGM9YSh0aGlzKTtjLmRhdGEoXCJkYXRlcGlja2VyXCIpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLG4uY2FsbChjLFwic2hvd1wiKSl9KSxhKGZ1bmN0aW9uKCl7bi5jYWxsKGEoJ1tkYXRhLXByb3ZpZGU9XCJkYXRlcGlja2VyLWlubGluZVwiXScpKX0pfSk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLyohXG4gKiBCb290c3RyYXAgdjMuNC4xIChodHRwczovL2dldGJvb3RzdHJhcC5jb20vKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeSl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeVwiKTshZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9alF1ZXJ5LmZuLmpxdWVyeS5zcGxpdChcIiBcIilbMF0uc3BsaXQoXCIuXCIpO2lmKGVbMF08MiYmZVsxXTw5fHwxPT1lWzBdJiY5PT1lWzFdJiZlWzJdPDF8fDM8ZVswXSl0aHJvdyBuZXcgRXJyb3IoXCJCb290c3RyYXAncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuOS4xIG9yIGhpZ2hlciwgYnV0IGxvd2VyIHRoYW4gdmVyc2lvbiA0XCIpfSgpLGZ1bmN0aW9uKG4pe1widXNlIHN0cmljdFwiO24uZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQ9ZnVuY3Rpb24odCl7dmFyIGU9ITEsaT10aGlzO24odGhpcykub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZnVuY3Rpb24oKXtlPSEwfSk7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlfHxuKGkpLnRyaWdnZXIobi5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKX0sdCksdGhpc30sbihmdW5jdGlvbigpe24uc3VwcG9ydC50cmFuc2l0aW9uPWZ1bmN0aW9uIG8oKXt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9vdHN0cmFwXCIpLGU9e1dlYmtpdFRyYW5zaXRpb246XCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsTW96VHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIixPVHJhbnNpdGlvbjpcIm9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kXCIsdHJhbnNpdGlvbjpcInRyYW5zaXRpb25lbmRcIn07Zm9yKHZhciBpIGluIGUpaWYodC5zdHlsZVtpXSE9PXVuZGVmaW5lZClyZXR1cm57ZW5kOmVbaV19O3JldHVybiExfSgpLG4uc3VwcG9ydC50cmFuc2l0aW9uJiYobi5ldmVudC5zcGVjaWFsLmJzVHJhbnNpdGlvbkVuZD17YmluZFR5cGU6bi5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLGRlbGVnYXRlVHlwZTpuLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsaGFuZGxlOmZ1bmN0aW9uKHQpe2lmKG4odC50YXJnZXQpLmlzKHRoaXMpKXJldHVybiB0LmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KX0pfShqUXVlcnkpLGZ1bmN0aW9uKHMpe1widXNlIHN0cmljdFwiO3ZhciBlPSdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nLGE9ZnVuY3Rpb24odCl7cyh0KS5vbihcImNsaWNrXCIsZSx0aGlzLmNsb3NlKX07YS5WRVJTSU9OPVwiMy40LjFcIixhLlRSQU5TSVRJT05fRFVSQVRJT049MTUwLGEucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKHQpe3ZhciBlPXModGhpcyksaT1lLmF0dHIoXCJkYXRhLXRhcmdldFwiKTtpfHwoaT0oaT1lLmF0dHIoXCJocmVmXCIpKSYmaS5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLFwiXCIpKSxpPVwiI1wiPT09aT9bXTppO3ZhciBvPXMoZG9jdW1lbnQpLmZpbmQoaSk7ZnVuY3Rpb24gbigpe28uZGV0YWNoKCkudHJpZ2dlcihcImNsb3NlZC5icy5hbGVydFwiKS5yZW1vdmUoKX10JiZ0LnByZXZlbnREZWZhdWx0KCksby5sZW5ndGh8fChvPWUuY2xvc2VzdChcIi5hbGVydFwiKSksby50cmlnZ2VyKHQ9cy5FdmVudChcImNsb3NlLmJzLmFsZXJ0XCIpKSx0LmlzRGVmYXVsdFByZXZlbnRlZCgpfHwoby5yZW1vdmVDbGFzcyhcImluXCIpLHMuc3VwcG9ydC50cmFuc2l0aW9uJiZvLmhhc0NsYXNzKFwiZmFkZVwiKT9vLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLG4pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKGEuVFJBTlNJVElPTl9EVVJBVElPTik6bigpKX07dmFyIHQ9cy5mbi5hbGVydDtzLmZuLmFsZXJ0PWZ1bmN0aW9uIG8oaSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PXModGhpcyksZT10LmRhdGEoXCJicy5hbGVydFwiKTtlfHx0LmRhdGEoXCJicy5hbGVydFwiLGU9bmV3IGEodGhpcykpLFwic3RyaW5nXCI9PXR5cGVvZiBpJiZlW2ldLmNhbGwodCl9KX0scy5mbi5hbGVydC5Db25zdHJ1Y3Rvcj1hLHMuZm4uYWxlcnQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBzLmZuLmFsZXJ0PXQsdGhpc30scyhkb2N1bWVudCkub24oXCJjbGljay5icy5hbGVydC5kYXRhLWFwaVwiLGUsYS5wcm90b3R5cGUuY2xvc2UpfShqUXVlcnkpLGZ1bmN0aW9uKHMpe1widXNlIHN0cmljdFwiO3ZhciBuPWZ1bmN0aW9uKHQsZSl7dGhpcy4kZWxlbWVudD1zKHQpLHRoaXMub3B0aW9ucz1zLmV4dGVuZCh7fSxuLkRFRkFVTFRTLGUpLHRoaXMuaXNMb2FkaW5nPSExfTtmdW5jdGlvbiBpKG8pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1zKHRoaXMpLGU9dC5kYXRhKFwiYnMuYnV0dG9uXCIpLGk9XCJvYmplY3RcIj09dHlwZW9mIG8mJm87ZXx8dC5kYXRhKFwiYnMuYnV0dG9uXCIsZT1uZXcgbih0aGlzLGkpKSxcInRvZ2dsZVwiPT1vP2UudG9nZ2xlKCk6byYmZS5zZXRTdGF0ZShvKX0pfW4uVkVSU0lPTj1cIjMuNC4xXCIsbi5ERUZBVUxUUz17bG9hZGluZ1RleHQ6XCJsb2FkaW5nLi4uXCJ9LG4ucHJvdG90eXBlLnNldFN0YXRlPWZ1bmN0aW9uKHQpe3ZhciBlPVwiZGlzYWJsZWRcIixpPXRoaXMuJGVsZW1lbnQsbz1pLmlzKFwiaW5wdXRcIik/XCJ2YWxcIjpcImh0bWxcIixuPWkuZGF0YSgpO3QrPVwiVGV4dFwiLG51bGw9PW4ucmVzZXRUZXh0JiZpLmRhdGEoXCJyZXNldFRleHRcIixpW29dKCkpLHNldFRpbWVvdXQocy5wcm94eShmdW5jdGlvbigpe2lbb10obnVsbD09blt0XT90aGlzLm9wdGlvbnNbdF06blt0XSksXCJsb2FkaW5nVGV4dFwiPT10Pyh0aGlzLmlzTG9hZGluZz0hMCxpLmFkZENsYXNzKGUpLmF0dHIoZSxlKS5wcm9wKGUsITApKTp0aGlzLmlzTG9hZGluZyYmKHRoaXMuaXNMb2FkaW5nPSExLGkucmVtb3ZlQ2xhc3MoZSkucmVtb3ZlQXR0cihlKS5wcm9wKGUsITEpKX0sdGhpcyksMCl9LG4ucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe3ZhciB0PSEwLGU9dGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyk7aWYoZS5sZW5ndGgpe3ZhciBpPXRoaXMuJGVsZW1lbnQuZmluZChcImlucHV0XCIpO1wicmFkaW9cIj09aS5wcm9wKFwidHlwZVwiKT8oaS5wcm9wKFwiY2hlY2tlZFwiKSYmKHQ9ITEpLGUuZmluZChcIi5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIiksdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhcImFjdGl2ZVwiKSk6XCJjaGVja2JveFwiPT1pLnByb3AoXCJ0eXBlXCIpJiYoaS5wcm9wKFwiY2hlY2tlZFwiKSE9PXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikmJih0PSExKSx0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpKSxpLnByb3AoXCJjaGVja2VkXCIsdGhpcy4kZWxlbWVudC5oYXNDbGFzcyhcImFjdGl2ZVwiKSksdCYmaS50cmlnZ2VyKFwiY2hhbmdlXCIpfWVsc2UgdGhpcy4kZWxlbWVudC5hdHRyKFwiYXJpYS1wcmVzc2VkXCIsIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJhY3RpdmVcIikpLHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIil9O3ZhciB0PXMuZm4uYnV0dG9uO3MuZm4uYnV0dG9uPWkscy5mbi5idXR0b24uQ29uc3RydWN0b3I9bixzLmZuLmJ1dHRvbi5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHMuZm4uYnV0dG9uPXQsdGhpc30scyhkb2N1bWVudCkub24oXCJjbGljay5icy5idXR0b24uZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsZnVuY3Rpb24odCl7dmFyIGU9cyh0LnRhcmdldCkuY2xvc2VzdChcIi5idG5cIik7aS5jYWxsKGUsXCJ0b2dnbGVcIikscyh0LnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXSwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyl8fCh0LnByZXZlbnREZWZhdWx0KCksZS5pcyhcImlucHV0LGJ1dHRvblwiKT9lLnRyaWdnZXIoXCJmb2N1c1wiKTplLmZpbmQoXCJpbnB1dDp2aXNpYmxlLGJ1dHRvbjp2aXNpYmxlXCIpLmZpcnN0KCkudHJpZ2dlcihcImZvY3VzXCIpKX0pLm9uKFwiZm9jdXMuYnMuYnV0dG9uLmRhdGEtYXBpIGJsdXIuYnMuYnV0dG9uLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLGZ1bmN0aW9uKHQpe3ModC50YXJnZXQpLmNsb3Nlc3QoXCIuYnRuXCIpLnRvZ2dsZUNsYXNzKFwiZm9jdXNcIiwvXmZvY3VzKGluKT8kLy50ZXN0KHQudHlwZSkpfSl9KGpRdWVyeSksZnVuY3Rpb24ocCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGM9ZnVuY3Rpb24odCxlKXt0aGlzLiRlbGVtZW50PXAodCksdGhpcy4kaW5kaWNhdG9ycz10aGlzLiRlbGVtZW50LmZpbmQoXCIuY2Fyb3VzZWwtaW5kaWNhdG9yc1wiKSx0aGlzLm9wdGlvbnM9ZSx0aGlzLnBhdXNlZD1udWxsLHRoaXMuc2xpZGluZz1udWxsLHRoaXMuaW50ZXJ2YWw9bnVsbCx0aGlzLiRhY3RpdmU9bnVsbCx0aGlzLiRpdGVtcz1udWxsLHRoaXMub3B0aW9ucy5rZXlib2FyZCYmdGhpcy4kZWxlbWVudC5vbihcImtleWRvd24uYnMuY2Fyb3VzZWxcIixwLnByb3h5KHRoaXMua2V5ZG93bix0aGlzKSksXCJob3ZlclwiPT10aGlzLm9wdGlvbnMucGF1c2UmJiEoXCJvbnRvdWNoc3RhcnRcImluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkmJnRoaXMuJGVsZW1lbnQub24oXCJtb3VzZWVudGVyLmJzLmNhcm91c2VsXCIscC5wcm94eSh0aGlzLnBhdXNlLHRoaXMpKS5vbihcIm1vdXNlbGVhdmUuYnMuY2Fyb3VzZWxcIixwLnByb3h5KHRoaXMuY3ljbGUsdGhpcykpfTtmdW5jdGlvbiByKG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1wKHRoaXMpLGU9dC5kYXRhKFwiYnMuY2Fyb3VzZWxcIiksaT1wLmV4dGVuZCh7fSxjLkRFRkFVTFRTLHQuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBuJiZuKSxvPVwic3RyaW5nXCI9PXR5cGVvZiBuP246aS5zbGlkZTtlfHx0LmRhdGEoXCJicy5jYXJvdXNlbFwiLGU9bmV3IGModGhpcyxpKSksXCJudW1iZXJcIj09dHlwZW9mIG4/ZS50byhuKTpvP2Vbb10oKTppLmludGVydmFsJiZlLnBhdXNlKCkuY3ljbGUoKX0pfWMuVkVSU0lPTj1cIjMuNC4xXCIsYy5UUkFOU0lUSU9OX0RVUkFUSU9OPTYwMCxjLkRFRkFVTFRTPXtpbnRlcnZhbDo1ZTMscGF1c2U6XCJob3ZlclwiLHdyYXA6ITAsa2V5Ym9hcmQ6ITB9LGMucHJvdG90eXBlLmtleWRvd249ZnVuY3Rpb24odCl7aWYoIS9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QodC50YXJnZXQudGFnTmFtZSkpe3N3aXRjaCh0LndoaWNoKXtjYXNlIDM3OnRoaXMucHJldigpO2JyZWFrO2Nhc2UgMzk6dGhpcy5uZXh0KCk7YnJlYWs7ZGVmYXVsdDpyZXR1cm59dC5wcmV2ZW50RGVmYXVsdCgpfX0sYy5wcm90b3R5cGUuY3ljbGU9ZnVuY3Rpb24odCl7cmV0dXJuIHR8fCh0aGlzLnBhdXNlZD0hMSksdGhpcy5pbnRlcnZhbCYmY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwmJiF0aGlzLnBhdXNlZCYmKHRoaXMuaW50ZXJ2YWw9c2V0SW50ZXJ2YWwocC5wcm94eSh0aGlzLm5leHQsdGhpcyksdGhpcy5vcHRpb25zLmludGVydmFsKSksdGhpc30sYy5wcm90b3R5cGUuZ2V0SXRlbUluZGV4PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLiRpdGVtcz10LnBhcmVudCgpLmNoaWxkcmVuKFwiLml0ZW1cIiksdGhpcy4kaXRlbXMuaW5kZXgodHx8dGhpcy4kYWN0aXZlKX0sYy5wcm90b3R5cGUuZ2V0SXRlbUZvckRpcmVjdGlvbj1mdW5jdGlvbih0LGUpe3ZhciBpPXRoaXMuZ2V0SXRlbUluZGV4KGUpO2lmKChcInByZXZcIj09dCYmMD09PWl8fFwibmV4dFwiPT10JiZpPT10aGlzLiRpdGVtcy5sZW5ndGgtMSkmJiF0aGlzLm9wdGlvbnMud3JhcClyZXR1cm4gZTt2YXIgbz0oaSsoXCJwcmV2XCI9PXQ/LTE6MSkpJXRoaXMuJGl0ZW1zLmxlbmd0aDtyZXR1cm4gdGhpcy4kaXRlbXMuZXEobyl9LGMucHJvdG90eXBlLnRvPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMsaT10aGlzLmdldEl0ZW1JbmRleCh0aGlzLiRhY3RpdmU9dGhpcy4kZWxlbWVudC5maW5kKFwiLml0ZW0uYWN0aXZlXCIpKTtpZighKHQ+dGhpcy4kaXRlbXMubGVuZ3RoLTF8fHQ8MCkpcmV0dXJuIHRoaXMuc2xpZGluZz90aGlzLiRlbGVtZW50Lm9uZShcInNsaWQuYnMuY2Fyb3VzZWxcIixmdW5jdGlvbigpe2UudG8odCl9KTppPT10P3RoaXMucGF1c2UoKS5jeWNsZSgpOnRoaXMuc2xpZGUoaTx0P1wibmV4dFwiOlwicHJldlwiLHRoaXMuJGl0ZW1zLmVxKHQpKX0sYy5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24odCl7cmV0dXJuIHR8fCh0aGlzLnBhdXNlZD0hMCksdGhpcy4kZWxlbWVudC5maW5kKFwiLm5leHQsIC5wcmV2XCIpLmxlbmd0aCYmcC5zdXBwb3J0LnRyYW5zaXRpb24mJih0aGlzLiRlbGVtZW50LnRyaWdnZXIocC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKSx0aGlzLmN5Y2xlKCEwKSksdGhpcy5pbnRlcnZhbD1jbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpLHRoaXN9LGMucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtpZighdGhpcy5zbGlkaW5nKXJldHVybiB0aGlzLnNsaWRlKFwibmV4dFwiKX0sYy5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe2lmKCF0aGlzLnNsaWRpbmcpcmV0dXJuIHRoaXMuc2xpZGUoXCJwcmV2XCIpfSxjLnByb3RvdHlwZS5zbGlkZT1mdW5jdGlvbih0LGUpe3ZhciBpPXRoaXMuJGVsZW1lbnQuZmluZChcIi5pdGVtLmFjdGl2ZVwiKSxvPWV8fHRoaXMuZ2V0SXRlbUZvckRpcmVjdGlvbih0LGkpLG49dGhpcy5pbnRlcnZhbCxzPVwibmV4dFwiPT10P1wibGVmdFwiOlwicmlnaHRcIixhPXRoaXM7aWYoby5oYXNDbGFzcyhcImFjdGl2ZVwiKSlyZXR1cm4gdGhpcy5zbGlkaW5nPSExO3ZhciByPW9bMF0sbD1wLkV2ZW50KFwic2xpZGUuYnMuY2Fyb3VzZWxcIix7cmVsYXRlZFRhcmdldDpyLGRpcmVjdGlvbjpzfSk7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKGwpLCFsLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtpZih0aGlzLnNsaWRpbmc9ITAsbiYmdGhpcy5wYXVzZSgpLHRoaXMuJGluZGljYXRvcnMubGVuZ3RoKXt0aGlzLiRpbmRpY2F0b3JzLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO3ZhciBoPXAodGhpcy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoaXMuZ2V0SXRlbUluZGV4KG8pXSk7aCYmaC5hZGRDbGFzcyhcImFjdGl2ZVwiKX12YXIgZD1wLkV2ZW50KFwic2xpZC5icy5jYXJvdXNlbFwiLHtyZWxhdGVkVGFyZ2V0OnIsZGlyZWN0aW9uOnN9KTtyZXR1cm4gcC5zdXBwb3J0LnRyYW5zaXRpb24mJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJzbGlkZVwiKT8oby5hZGRDbGFzcyh0KSxcIm9iamVjdFwiPT10eXBlb2YgbyYmby5sZW5ndGgmJm9bMF0ub2Zmc2V0V2lkdGgsaS5hZGRDbGFzcyhzKSxvLmFkZENsYXNzKHMpLGkub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsZnVuY3Rpb24oKXtvLnJlbW92ZUNsYXNzKFt0LHNdLmpvaW4oXCIgXCIpKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxpLnJlbW92ZUNsYXNzKFtcImFjdGl2ZVwiLHNdLmpvaW4oXCIgXCIpKSxhLnNsaWRpbmc9ITEsc2V0VGltZW91dChmdW5jdGlvbigpe2EuJGVsZW1lbnQudHJpZ2dlcihkKX0sMCl9KS5lbXVsYXRlVHJhbnNpdGlvbkVuZChjLlRSQU5TSVRJT05fRFVSQVRJT04pKTooaS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxvLmFkZENsYXNzKFwiYWN0aXZlXCIpLHRoaXMuc2xpZGluZz0hMSx0aGlzLiRlbGVtZW50LnRyaWdnZXIoZCkpLG4mJnRoaXMuY3ljbGUoKSx0aGlzfX07dmFyIHQ9cC5mbi5jYXJvdXNlbDtwLmZuLmNhcm91c2VsPXIscC5mbi5jYXJvdXNlbC5Db25zdHJ1Y3Rvcj1jLHAuZm4uY2Fyb3VzZWwubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBwLmZuLmNhcm91c2VsPXQsdGhpc307dmFyIGU9ZnVuY3Rpb24odCl7dmFyIGU9cCh0aGlzKSxpPWUuYXR0cihcImhyZWZcIik7aSYmKGk9aS5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLFwiXCIpKTt2YXIgbz1lLmF0dHIoXCJkYXRhLXRhcmdldFwiKXx8aSxuPXAoZG9jdW1lbnQpLmZpbmQobyk7aWYobi5oYXNDbGFzcyhcImNhcm91c2VsXCIpKXt2YXIgcz1wLmV4dGVuZCh7fSxuLmRhdGEoKSxlLmRhdGEoKSksYT1lLmF0dHIoXCJkYXRhLXNsaWRlLXRvXCIpO2EmJihzLmludGVydmFsPSExKSxyLmNhbGwobixzKSxhJiZuLmRhdGEoXCJicy5jYXJvdXNlbFwiKS50byhhKSx0LnByZXZlbnREZWZhdWx0KCl9fTtwKGRvY3VtZW50KS5vbihcImNsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpXCIsXCJbZGF0YS1zbGlkZV1cIixlKS5vbihcImNsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpXCIsXCJbZGF0YS1zbGlkZS10b11cIixlKSxwKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXtwKCdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cCh0aGlzKTtyLmNhbGwodCx0LmRhdGEoKSl9KX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO3ZhciByPWZ1bmN0aW9uKHQsZSl7dGhpcy4kZWxlbWVudD1hKHQpLHRoaXMub3B0aW9ucz1hLmV4dGVuZCh7fSxyLkRFRkFVTFRTLGUpLHRoaXMuJHRyaWdnZXI9YSgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnK3QuaWQrJ1wiXSxbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnK3QuaWQrJ1wiXScpLHRoaXMudHJhbnNpdGlvbmluZz1udWxsLHRoaXMub3B0aW9ucy5wYXJlbnQ/dGhpcy4kcGFyZW50PXRoaXMuZ2V0UGFyZW50KCk6dGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCx0aGlzLiR0cmlnZ2VyKSx0aGlzLm9wdGlvbnMudG9nZ2xlJiZ0aGlzLnRvZ2dsZSgpfTtmdW5jdGlvbiBuKHQpe3ZhciBlLGk9dC5hdHRyKFwiZGF0YS10YXJnZXRcIil8fChlPXQuYXR0cihcImhyZWZcIikpJiZlLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sXCJcIik7cmV0dXJuIGEoZG9jdW1lbnQpLmZpbmQoaSl9ZnVuY3Rpb24gbChvKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9YSh0aGlzKSxlPXQuZGF0YShcImJzLmNvbGxhcHNlXCIpLGk9YS5leHRlbmQoe30sci5ERUZBVUxUUyx0LmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgbyYmbyk7IWUmJmkudG9nZ2xlJiYvc2hvd3xoaWRlLy50ZXN0KG8pJiYoaS50b2dnbGU9ITEpLGV8fHQuZGF0YShcImJzLmNvbGxhcHNlXCIsZT1uZXcgcih0aGlzLGkpKSxcInN0cmluZ1wiPT10eXBlb2YgbyYmZVtvXSgpfSl9ci5WRVJTSU9OPVwiMy40LjFcIixyLlRSQU5TSVRJT05fRFVSQVRJT049MzUwLHIuREVGQVVMVFM9e3RvZ2dsZTohMH0sci5wcm90b3R5cGUuZGltZW5zaW9uPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJ3aWR0aFwiKT9cIndpZHRoXCI6XCJoZWlnaHRcIn0sci5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe2lmKCF0aGlzLnRyYW5zaXRpb25pbmcmJiF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiaW5cIikpe3ZhciB0LGU9dGhpcy4kcGFyZW50JiZ0aGlzLiRwYXJlbnQuY2hpbGRyZW4oXCIucGFuZWxcIikuY2hpbGRyZW4oXCIuaW4sIC5jb2xsYXBzaW5nXCIpO2lmKCEoZSYmZS5sZW5ndGgmJih0PWUuZGF0YShcImJzLmNvbGxhcHNlXCIpKSYmdC50cmFuc2l0aW9uaW5nKSl7dmFyIGk9YS5FdmVudChcInNob3cuYnMuY29sbGFwc2VcIik7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKGkpLCFpLmlzRGVmYXVsdFByZXZlbnRlZCgpKXtlJiZlLmxlbmd0aCYmKGwuY2FsbChlLFwiaGlkZVwiKSx0fHxlLmRhdGEoXCJicy5jb2xsYXBzZVwiLG51bGwpKTt2YXIgbz10aGlzLmRpbWVuc2lvbigpO3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZVwiKS5hZGRDbGFzcyhcImNvbGxhcHNpbmdcIilbb10oMCkuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksdGhpcy4kdHJpZ2dlci5yZW1vdmVDbGFzcyhcImNvbGxhcHNlZFwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCEwKSx0aGlzLnRyYW5zaXRpb25pbmc9MTt2YXIgbj1mdW5jdGlvbigpe3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzaW5nXCIpLmFkZENsYXNzKFwiY29sbGFwc2UgaW5cIilbb10oXCJcIiksdGhpcy50cmFuc2l0aW9uaW5nPTAsdGhpcy4kZWxlbWVudC50cmlnZ2VyKFwic2hvd24uYnMuY29sbGFwc2VcIil9O2lmKCFhLnN1cHBvcnQudHJhbnNpdGlvbilyZXR1cm4gbi5jYWxsKHRoaXMpO3ZhciBzPWEuY2FtZWxDYXNlKFtcInNjcm9sbFwiLG9dLmpvaW4oXCItXCIpKTt0aGlzLiRlbGVtZW50Lm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGEucHJveHkobix0aGlzKSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoci5UUkFOU0lUSU9OX0RVUkFUSU9OKVtvXSh0aGlzLiRlbGVtZW50WzBdW3NdKX19fX0sci5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbigpe2lmKCF0aGlzLnRyYW5zaXRpb25pbmcmJnRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJpblwiKSl7dmFyIHQ9YS5FdmVudChcImhpZGUuYnMuY29sbGFwc2VcIik7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKHQpLCF0LmlzRGVmYXVsdFByZXZlbnRlZCgpKXt2YXIgZT10aGlzLmRpbWVuc2lvbigpO3RoaXMuJGVsZW1lbnRbZV0odGhpcy4kZWxlbWVudFtlXSgpKVswXS5vZmZzZXRIZWlnaHQsdGhpcy4kZWxlbWVudC5hZGRDbGFzcyhcImNvbGxhcHNpbmdcIikucmVtb3ZlQ2xhc3MoXCJjb2xsYXBzZSBpblwiKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0aGlzLiR0cmlnZ2VyLmFkZENsYXNzKFwiY29sbGFwc2VkXCIpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITEpLHRoaXMudHJhbnNpdGlvbmluZz0xO3ZhciBpPWZ1bmN0aW9uKCl7dGhpcy50cmFuc2l0aW9uaW5nPTAsdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhcImNvbGxhcHNpbmdcIikuYWRkQ2xhc3MoXCJjb2xsYXBzZVwiKS50cmlnZ2VyKFwiaGlkZGVuLmJzLmNvbGxhcHNlXCIpfTtpZighYS5zdXBwb3J0LnRyYW5zaXRpb24pcmV0dXJuIGkuY2FsbCh0aGlzKTt0aGlzLiRlbGVtZW50W2VdKDApLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGEucHJveHkoaSx0aGlzKSkuZW11bGF0ZVRyYW5zaXRpb25FbmQoci5UUkFOU0lUSU9OX0RVUkFUSU9OKX19fSxyLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oKXt0aGlzW3RoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoXCJpblwiKT9cImhpZGVcIjpcInNob3dcIl0oKX0sci5wcm90b3R5cGUuZ2V0UGFyZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGEoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnBhcmVudCkuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInK3RoaXMub3B0aW9ucy5wYXJlbnQrJ1wiXScpLmVhY2goYS5wcm94eShmdW5jdGlvbih0LGUpe3ZhciBpPWEoZSk7dGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MobihpKSxpKX0sdGhpcykpLmVuZCgpfSxyLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3M9ZnVuY3Rpb24odCxlKXt2YXIgaT10Lmhhc0NsYXNzKFwiaW5cIik7dC5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLGkpLGUudG9nZ2xlQ2xhc3MoXCJjb2xsYXBzZWRcIiwhaSkuYXR0cihcImFyaWEtZXhwYW5kZWRcIixpKX07dmFyIHQ9YS5mbi5jb2xsYXBzZTthLmZuLmNvbGxhcHNlPWwsYS5mbi5jb2xsYXBzZS5Db25zdHJ1Y3Rvcj1yLGEuZm4uY29sbGFwc2Uubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmNvbGxhcHNlPXQsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5jb2xsYXBzZS5kYXRhLWFwaVwiLCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXScsZnVuY3Rpb24odCl7dmFyIGU9YSh0aGlzKTtlLmF0dHIoXCJkYXRhLXRhcmdldFwiKXx8dC5wcmV2ZW50RGVmYXVsdCgpO3ZhciBpPW4oZSksbz1pLmRhdGEoXCJicy5jb2xsYXBzZVwiKT9cInRvZ2dsZVwiOmUuZGF0YSgpO2wuY2FsbChpLG8pfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9J1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxvPWZ1bmN0aW9uKHQpe2EodCkub24oXCJjbGljay5icy5kcm9wZG93blwiLHRoaXMudG9nZ2xlKX07ZnVuY3Rpb24gbCh0KXt2YXIgZT10LmF0dHIoXCJkYXRhLXRhcmdldFwiKTtlfHwoZT0oZT10LmF0dHIoXCJocmVmXCIpKSYmLyNbQS1aYS16XS8udGVzdChlKSYmZS5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLFwiXCIpKTt2YXIgaT1cIiNcIiE9PWU/YShkb2N1bWVudCkuZmluZChlKTpudWxsO3JldHVybiBpJiZpLmxlbmd0aD9pOnQucGFyZW50KCl9ZnVuY3Rpb24gcyhvKXtvJiYzPT09by53aGljaHx8KGEoXCIuZHJvcGRvd24tYmFja2Ryb3BcIikucmVtb3ZlKCksYShyKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9YSh0aGlzKSxlPWwodCksaT17cmVsYXRlZFRhcmdldDp0aGlzfTtlLmhhc0NsYXNzKFwib3BlblwiKSYmKG8mJlwiY2xpY2tcIj09by50eXBlJiYvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KG8udGFyZ2V0LnRhZ05hbWUpJiZhLmNvbnRhaW5zKGVbMF0sby50YXJnZXQpfHwoZS50cmlnZ2VyKG89YS5FdmVudChcImhpZGUuYnMuZHJvcGRvd25cIixpKSksby5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHQuYXR0cihcImFyaWEtZXhwYW5kZWRcIixcImZhbHNlXCIpLGUucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpLnRyaWdnZXIoYS5FdmVudChcImhpZGRlbi5icy5kcm9wZG93blwiLGkpKSkpKX0pKX1vLlZFUlNJT049XCIzLjQuMVwiLG8ucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbih0KXt2YXIgZT1hKHRoaXMpO2lmKCFlLmlzKFwiLmRpc2FibGVkLCA6ZGlzYWJsZWRcIikpe3ZhciBpPWwoZSksbz1pLmhhc0NsYXNzKFwib3BlblwiKTtpZihzKCksIW8pe1wib250b3VjaHN0YXJ0XCJpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQmJiFpLmNsb3Nlc3QoXCIubmF2YmFyLW5hdlwiKS5sZW5ndGgmJmEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSkuYWRkQ2xhc3MoXCJkcm9wZG93bi1iYWNrZHJvcFwiKS5pbnNlcnRBZnRlcihhKHRoaXMpKS5vbihcImNsaWNrXCIscyk7dmFyIG49e3JlbGF0ZWRUYXJnZXQ6dGhpc307aWYoaS50cmlnZ2VyKHQ9YS5FdmVudChcInNob3cuYnMuZHJvcGRvd25cIixuKSksdC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSlyZXR1cm47ZS50cmlnZ2VyKFwiZm9jdXNcIikuYXR0cihcImFyaWEtZXhwYW5kZWRcIixcInRydWVcIiksaS50b2dnbGVDbGFzcyhcIm9wZW5cIikudHJpZ2dlcihhLkV2ZW50KFwic2hvd24uYnMuZHJvcGRvd25cIixuKSl9cmV0dXJuITF9fSxvLnByb3RvdHlwZS5rZXlkb3duPWZ1bmN0aW9uKHQpe2lmKC8oMzh8NDB8Mjd8MzIpLy50ZXN0KHQud2hpY2gpJiYhL2lucHV0fHRleHRhcmVhL2kudGVzdCh0LnRhcmdldC50YWdOYW1lKSl7dmFyIGU9YSh0aGlzKTtpZih0LnByZXZlbnREZWZhdWx0KCksdC5zdG9wUHJvcGFnYXRpb24oKSwhZS5pcyhcIi5kaXNhYmxlZCwgOmRpc2FibGVkXCIpKXt2YXIgaT1sKGUpLG89aS5oYXNDbGFzcyhcIm9wZW5cIik7aWYoIW8mJjI3IT10LndoaWNofHxvJiYyNz09dC53aGljaClyZXR1cm4gMjc9PXQud2hpY2gmJmkuZmluZChyKS50cmlnZ2VyKFwiZm9jdXNcIiksZS50cmlnZ2VyKFwiY2xpY2tcIik7dmFyIG49aS5maW5kKFwiLmRyb3Bkb3duLW1lbnUgbGk6bm90KC5kaXNhYmxlZCk6dmlzaWJsZSBhXCIpO2lmKG4ubGVuZ3RoKXt2YXIgcz1uLmluZGV4KHQudGFyZ2V0KTszOD09dC53aGljaCYmMDxzJiZzLS0sNDA9PXQud2hpY2gmJnM8bi5sZW5ndGgtMSYmcysrLH5zfHwocz0wKSxuLmVxKHMpLnRyaWdnZXIoXCJmb2N1c1wiKX19fX07dmFyIHQ9YS5mbi5kcm9wZG93bjthLmZuLmRyb3Bkb3duPWZ1bmN0aW9uIGUoaSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PWEodGhpcyksZT10LmRhdGEoXCJicy5kcm9wZG93blwiKTtlfHx0LmRhdGEoXCJicy5kcm9wZG93blwiLGU9bmV3IG8odGhpcykpLFwic3RyaW5nXCI9PXR5cGVvZiBpJiZlW2ldLmNhbGwodCl9KX0sYS5mbi5kcm9wZG93bi5Db25zdHJ1Y3Rvcj1vLGEuZm4uZHJvcGRvd24ubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmRyb3Bkb3duPXQsdGhpc30sYShkb2N1bWVudCkub24oXCJjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaVwiLHMpLm9uKFwiY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGlcIixcIi5kcm9wZG93biBmb3JtXCIsZnVuY3Rpb24odCl7dC5zdG9wUHJvcGFnYXRpb24oKX0pLm9uKFwiY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGlcIixyLG8ucHJvdG90eXBlLnRvZ2dsZSkub24oXCJrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpXCIscixvLnByb3RvdHlwZS5rZXlkb3duKS5vbihcImtleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGlcIixcIi5kcm9wZG93bi1tZW51XCIsby5wcm90b3R5cGUua2V5ZG93bil9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9ZnVuY3Rpb24odCxlKXt0aGlzLm9wdGlvbnM9ZSx0aGlzLiRib2R5PWEoZG9jdW1lbnQuYm9keSksdGhpcy4kZWxlbWVudD1hKHQpLHRoaXMuJGRpYWxvZz10aGlzLiRlbGVtZW50LmZpbmQoXCIubW9kYWwtZGlhbG9nXCIpLHRoaXMuJGJhY2tkcm9wPW51bGwsdGhpcy5pc1Nob3duPW51bGwsdGhpcy5vcmlnaW5hbEJvZHlQYWQ9bnVsbCx0aGlzLnNjcm9sbGJhcldpZHRoPTAsdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrPSExLHRoaXMuZml4ZWRDb250ZW50PVwiLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tXCIsdGhpcy5vcHRpb25zLnJlbW90ZSYmdGhpcy4kZWxlbWVudC5maW5kKFwiLm1vZGFsLWNvbnRlbnRcIikubG9hZCh0aGlzLm9wdGlvbnMucmVtb3RlLGEucHJveHkoZnVuY3Rpb24oKXt0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJsb2FkZWQuYnMubW9kYWxcIil9LHRoaXMpKX07ZnVuY3Rpb24gcihvLG4pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1hKHRoaXMpLGU9dC5kYXRhKFwiYnMubW9kYWxcIiksaT1hLmV4dGVuZCh7fSxzLkRFRkFVTFRTLHQuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBvJiZvKTtlfHx0LmRhdGEoXCJicy5tb2RhbFwiLGU9bmV3IHModGhpcyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG8/ZVtvXShuKTppLnNob3cmJmUuc2hvdyhuKX0pfXMuVkVSU0lPTj1cIjMuNC4xXCIscy5UUkFOU0lUSU9OX0RVUkFUSU9OPTMwMCxzLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT049MTUwLHMuREVGQVVMVFM9e2JhY2tkcm9wOiEwLGtleWJvYXJkOiEwLHNob3c6ITB9LHMucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5pc1Nob3duP3RoaXMuaGlkZSgpOnRoaXMuc2hvdyh0KX0scy5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbihpKXt2YXIgbz10aGlzLHQ9YS5FdmVudChcInNob3cuYnMubW9kYWxcIix7cmVsYXRlZFRhcmdldDppfSk7dGhpcy4kZWxlbWVudC50cmlnZ2VyKHQpLHRoaXMuaXNTaG93bnx8dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8KHRoaXMuaXNTaG93bj0hMCx0aGlzLmNoZWNrU2Nyb2xsYmFyKCksdGhpcy5zZXRTY3JvbGxiYXIoKSx0aGlzLiRib2R5LmFkZENsYXNzKFwibW9kYWwtb3BlblwiKSx0aGlzLmVzY2FwZSgpLHRoaXMucmVzaXplKCksdGhpcy4kZWxlbWVudC5vbihcImNsaWNrLmRpc21pc3MuYnMubW9kYWxcIiwnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJyxhLnByb3h5KHRoaXMuaGlkZSx0aGlzKSksdGhpcy4kZGlhbG9nLm9uKFwibW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWxcIixmdW5jdGlvbigpe28uJGVsZW1lbnQub25lKFwibW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsXCIsZnVuY3Rpb24odCl7YSh0LnRhcmdldCkuaXMoby4kZWxlbWVudCkmJihvLmlnbm9yZUJhY2tkcm9wQ2xpY2s9ITApfSl9KSx0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uKCl7dmFyIHQ9YS5zdXBwb3J0LnRyYW5zaXRpb24mJm8uJGVsZW1lbnQuaGFzQ2xhc3MoXCJmYWRlXCIpO28uJGVsZW1lbnQucGFyZW50KCkubGVuZ3RofHxvLiRlbGVtZW50LmFwcGVuZFRvKG8uJGJvZHkpLG8uJGVsZW1lbnQuc2hvdygpLnNjcm9sbFRvcCgwKSxvLmFkanVzdERpYWxvZygpLHQmJm8uJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGgsby4kZWxlbWVudC5hZGRDbGFzcyhcImluXCIpLG8uZW5mb3JjZUZvY3VzKCk7dmFyIGU9YS5FdmVudChcInNob3duLmJzLm1vZGFsXCIse3JlbGF0ZWRUYXJnZXQ6aX0pO3Q/by4kZGlhbG9nLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGZ1bmN0aW9uKCl7by4kZWxlbWVudC50cmlnZ2VyKFwiZm9jdXNcIikudHJpZ2dlcihlKX0pLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHMuVFJBTlNJVElPTl9EVVJBVElPTik6by4kZWxlbWVudC50cmlnZ2VyKFwiZm9jdXNcIikudHJpZ2dlcihlKX0pKX0scy5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbih0KXt0JiZ0LnByZXZlbnREZWZhdWx0KCksdD1hLkV2ZW50KFwiaGlkZS5icy5tb2RhbFwiKSx0aGlzLiRlbGVtZW50LnRyaWdnZXIodCksdGhpcy5pc1Nob3duJiYhdC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSYmKHRoaXMuaXNTaG93bj0hMSx0aGlzLmVzY2FwZSgpLHRoaXMucmVzaXplKCksYShkb2N1bWVudCkub2ZmKFwiZm9jdXNpbi5icy5tb2RhbFwiKSx0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKFwiaW5cIikub2ZmKFwiY2xpY2suZGlzbWlzcy5icy5tb2RhbFwiKS5vZmYoXCJtb3VzZXVwLmRpc21pc3MuYnMubW9kYWxcIiksdGhpcy4kZGlhbG9nLm9mZihcIm1vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsXCIpLGEuc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKT90aGlzLiRlbGVtZW50Lm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLGEucHJveHkodGhpcy5oaWRlTW9kYWwsdGhpcykpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKHMuVFJBTlNJVElPTl9EVVJBVElPTik6dGhpcy5oaWRlTW9kYWwoKSl9LHMucHJvdG90eXBlLmVuZm9yY2VGb2N1cz1mdW5jdGlvbigpe2EoZG9jdW1lbnQpLm9mZihcImZvY3VzaW4uYnMubW9kYWxcIikub24oXCJmb2N1c2luLmJzLm1vZGFsXCIsYS5wcm94eShmdW5jdGlvbih0KXtkb2N1bWVudD09PXQudGFyZ2V0fHx0aGlzLiRlbGVtZW50WzBdPT09dC50YXJnZXR8fHRoaXMuJGVsZW1lbnQuaGFzKHQudGFyZ2V0KS5sZW5ndGh8fHRoaXMuJGVsZW1lbnQudHJpZ2dlcihcImZvY3VzXCIpfSx0aGlzKSl9LHMucHJvdG90eXBlLmVzY2FwZT1mdW5jdGlvbigpe3RoaXMuaXNTaG93biYmdGhpcy5vcHRpb25zLmtleWJvYXJkP3RoaXMuJGVsZW1lbnQub24oXCJrZXlkb3duLmRpc21pc3MuYnMubW9kYWxcIixhLnByb3h5KGZ1bmN0aW9uKHQpezI3PT10LndoaWNoJiZ0aGlzLmhpZGUoKX0sdGhpcykpOnRoaXMuaXNTaG93bnx8dGhpcy4kZWxlbWVudC5vZmYoXCJrZXlkb3duLmRpc21pc3MuYnMubW9kYWxcIil9LHMucHJvdG90eXBlLnJlc2l6ZT1mdW5jdGlvbigpe3RoaXMuaXNTaG93bj9hKHdpbmRvdykub24oXCJyZXNpemUuYnMubW9kYWxcIixhLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLHRoaXMpKTphKHdpbmRvdykub2ZmKFwicmVzaXplLmJzLm1vZGFsXCIpfSxzLnByb3RvdHlwZS5oaWRlTW9kYWw9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO3RoaXMuJGVsZW1lbnQuaGlkZSgpLHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24oKXt0LiRib2R5LnJlbW92ZUNsYXNzKFwibW9kYWwtb3BlblwiKSx0LnJlc2V0QWRqdXN0bWVudHMoKSx0LnJlc2V0U2Nyb2xsYmFyKCksdC4kZWxlbWVudC50cmlnZ2VyKFwiaGlkZGVuLmJzLm1vZGFsXCIpfSl9LHMucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wPWZ1bmN0aW9uKCl7dGhpcy4kYmFja2Ryb3AmJnRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpLHRoaXMuJGJhY2tkcm9wPW51bGx9LHMucHJvdG90eXBlLmJhY2tkcm9wPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMsaT10aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKT9cImZhZGVcIjpcIlwiO2lmKHRoaXMuaXNTaG93biYmdGhpcy5vcHRpb25zLmJhY2tkcm9wKXt2YXIgbz1hLnN1cHBvcnQudHJhbnNpdGlvbiYmaTtpZih0aGlzLiRiYWNrZHJvcD1hKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLmFkZENsYXNzKFwibW9kYWwtYmFja2Ryb3AgXCIraSkuYXBwZW5kVG8odGhpcy4kYm9keSksdGhpcy4kZWxlbWVudC5vbihcImNsaWNrLmRpc21pc3MuYnMubW9kYWxcIixhLnByb3h5KGZ1bmN0aW9uKHQpe3RoaXMuaWdub3JlQmFja2Ryb3BDbGljaz90aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2s9ITE6dC50YXJnZXQ9PT10LmN1cnJlbnRUYXJnZXQmJihcInN0YXRpY1wiPT10aGlzLm9wdGlvbnMuYmFja2Ryb3A/dGhpcy4kZWxlbWVudFswXS5mb2N1cygpOnRoaXMuaGlkZSgpKX0sdGhpcykpLG8mJnRoaXMuJGJhY2tkcm9wWzBdLm9mZnNldFdpZHRoLHRoaXMuJGJhY2tkcm9wLmFkZENsYXNzKFwiaW5cIiksIXQpcmV0dXJuO28/dGhpcy4kYmFja2Ryb3Aub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIsdCkuZW11bGF0ZVRyYW5zaXRpb25FbmQocy5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKTp0KCl9ZWxzZSBpZighdGhpcy5pc1Nob3duJiZ0aGlzLiRiYWNrZHJvcCl7dGhpcy4kYmFja2Ryb3AucmVtb3ZlQ2xhc3MoXCJpblwiKTt2YXIgbj1mdW5jdGlvbigpe2UucmVtb3ZlQmFja2Ryb3AoKSx0JiZ0KCl9O2Euc3VwcG9ydC50cmFuc2l0aW9uJiZ0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKFwiZmFkZVwiKT90aGlzLiRiYWNrZHJvcC5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixuKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChzLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pOm4oKX1lbHNlIHQmJnQoKX0scy5wcm90b3R5cGUuaGFuZGxlVXBkYXRlPWZ1bmN0aW9uKCl7dGhpcy5hZGp1c3REaWFsb2coKX0scy5wcm90b3R5cGUuYWRqdXN0RGlhbG9nPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy4kZWxlbWVudFswXS5zY3JvbGxIZWlnaHQ+ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDt0aGlzLiRlbGVtZW50LmNzcyh7cGFkZGluZ0xlZnQ6IXRoaXMuYm9keUlzT3ZlcmZsb3dpbmcmJnQ/dGhpcy5zY3JvbGxiYXJXaWR0aDpcIlwiLHBhZGRpbmdSaWdodDp0aGlzLmJvZHlJc092ZXJmbG93aW5nJiYhdD90aGlzLnNjcm9sbGJhcldpZHRoOlwiXCJ9KX0scy5wcm90b3R5cGUucmVzZXRBZGp1c3RtZW50cz1mdW5jdGlvbigpe3RoaXMuJGVsZW1lbnQuY3NzKHtwYWRkaW5nTGVmdDpcIlwiLHBhZGRpbmdSaWdodDpcIlwifSl9LHMucHJvdG90eXBlLmNoZWNrU2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dmFyIHQ9d2luZG93LmlubmVyV2lkdGg7aWYoIXQpe3ZhciBlPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTt0PWUucmlnaHQtTWF0aC5hYnMoZS5sZWZ0KX10aGlzLmJvZHlJc092ZXJmbG93aW5nPWRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg8dCx0aGlzLnNjcm9sbGJhcldpZHRoPXRoaXMubWVhc3VyZVNjcm9sbGJhcigpfSxzLnByb3RvdHlwZS5zZXRTY3JvbGxiYXI9ZnVuY3Rpb24oKXt2YXIgdD1wYXJzZUludCh0aGlzLiRib2R5LmNzcyhcInBhZGRpbmctcmlnaHRcIil8fDAsMTApO3RoaXMub3JpZ2luYWxCb2R5UGFkPWRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0fHxcIlwiO3ZhciBuPXRoaXMuc2Nyb2xsYmFyV2lkdGg7dGhpcy5ib2R5SXNPdmVyZmxvd2luZyYmKHRoaXMuJGJvZHkuY3NzKFwicGFkZGluZy1yaWdodFwiLHQrbiksYSh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbih0LGUpe3ZhciBpPWUuc3R5bGUucGFkZGluZ1JpZ2h0LG89YShlKS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpO2EoZSkuZGF0YShcInBhZGRpbmctcmlnaHRcIixpKS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIscGFyc2VGbG9hdChvKStuK1wicHhcIil9KSl9LHMucHJvdG90eXBlLnJlc2V0U2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dGhpcy4kYm9keS5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIsdGhpcy5vcmlnaW5hbEJvZHlQYWQpLGEodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24odCxlKXt2YXIgaT1hKGUpLmRhdGEoXCJwYWRkaW5nLXJpZ2h0XCIpO2EoZSkucmVtb3ZlRGF0YShcInBhZGRpbmctcmlnaHRcIiksZS5zdHlsZS5wYWRkaW5nUmlnaHQ9aXx8XCJcIn0pfSxzLnByb3RvdHlwZS5tZWFzdXJlU2Nyb2xsYmFyPWZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0LmNsYXNzTmFtZT1cIm1vZGFsLXNjcm9sbGJhci1tZWFzdXJlXCIsdGhpcy4kYm9keS5hcHBlbmQodCk7dmFyIGU9dC5vZmZzZXRXaWR0aC10LmNsaWVudFdpZHRoO3JldHVybiB0aGlzLiRib2R5WzBdLnJlbW92ZUNoaWxkKHQpLGV9O3ZhciB0PWEuZm4ubW9kYWw7YS5mbi5tb2RhbD1yLGEuZm4ubW9kYWwuQ29uc3RydWN0b3I9cyxhLmZuLm1vZGFsLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5tb2RhbD10LHRoaXN9LGEoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMubW9kYWwuZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLGZ1bmN0aW9uKHQpe3ZhciBlPWEodGhpcyksaT1lLmF0dHIoXCJocmVmXCIpLG89ZS5hdHRyKFwiZGF0YS10YXJnZXRcIil8fGkmJmkucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLyxcIlwiKSxuPWEoZG9jdW1lbnQpLmZpbmQobykscz1uLmRhdGEoXCJicy5tb2RhbFwiKT9cInRvZ2dsZVwiOmEuZXh0ZW5kKHtyZW1vdGU6IS8jLy50ZXN0KGkpJiZpfSxuLmRhdGEoKSxlLmRhdGEoKSk7ZS5pcyhcImFcIikmJnQucHJldmVudERlZmF1bHQoKSxuLm9uZShcInNob3cuYnMubW9kYWxcIixmdW5jdGlvbih0KXt0LmlzRGVmYXVsdFByZXZlbnRlZCgpfHxuLm9uZShcImhpZGRlbi5icy5tb2RhbFwiLGZ1bmN0aW9uKCl7ZS5pcyhcIjp2aXNpYmxlXCIpJiZlLnRyaWdnZXIoXCJmb2N1c1wiKX0pfSksci5jYWxsKG4scyx0aGlzKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGcpe1widXNlIHN0cmljdFwiO3ZhciBvPVtcInNhbml0aXplXCIsXCJ3aGl0ZUxpc3RcIixcInNhbml0aXplRm5cIl0sYT1bXCJiYWNrZ3JvdW5kXCIsXCJjaXRlXCIsXCJocmVmXCIsXCJpdGVtdHlwZVwiLFwibG9uZ2Rlc2NcIixcInBvc3RlclwiLFwic3JjXCIsXCJ4bGluazpocmVmXCJdLHQ9e1wiKlwiOltcImNsYXNzXCIsXCJkaXJcIixcImlkXCIsXCJsYW5nXCIsXCJyb2xlXCIsL15hcmlhLVtcXHctXSokL2ldLGE6W1widGFyZ2V0XCIsXCJocmVmXCIsXCJ0aXRsZVwiLFwicmVsXCJdLGFyZWE6W10sYjpbXSxicjpbXSxjb2w6W10sY29kZTpbXSxkaXY6W10sZW06W10saHI6W10saDE6W10saDI6W10saDM6W10saDQ6W10saDU6W10saDY6W10saTpbXSxpbWc6W1wic3JjXCIsXCJhbHRcIixcInRpdGxlXCIsXCJ3aWR0aFwiLFwiaGVpZ2h0XCJdLGxpOltdLG9sOltdLHA6W10scHJlOltdLHM6W10sc21hbGw6W10sc3BhbjpbXSxzdWI6W10sc3VwOltdLHN0cm9uZzpbXSx1OltdLHVsOltdfSxyPS9eKD86KD86aHR0cHM/fG1haWx0b3xmdHB8dGVsfGZpbGUpOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvZ2ksbD0vXmRhdGE6KD86aW1hZ2VcXC8oPzpibXB8Z2lmfGpwZWd8anBnfHBuZ3x0aWZmfHdlYnApfHZpZGVvXFwvKD86bXBlZ3xtcDR8b2dnfHdlYm0pfGF1ZGlvXFwvKD86bXAzfG9nYXxvZ2d8b3B1cykpO2Jhc2U2NCxbYS16MC05Ky9dKz0qJC9pO2Z1bmN0aW9uIHUodCxlKXt2YXIgaT10Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7aWYoLTEhPT1nLmluQXJyYXkoaSxlKSlyZXR1cm4tMT09PWcuaW5BcnJheShpLGEpfHxCb29sZWFuKHQubm9kZVZhbHVlLm1hdGNoKHIpfHx0Lm5vZGVWYWx1ZS5tYXRjaChsKSk7Zm9yKHZhciBvPWcoZSkuZmlsdGVyKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGUgaW5zdGFuY2VvZiBSZWdFeHB9KSxuPTAscz1vLmxlbmd0aDtuPHM7bisrKWlmKGkubWF0Y2gob1tuXSkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gbih0LGUsaSl7aWYoMD09PXQubGVuZ3RoKXJldHVybiB0O2lmKGkmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGkpcmV0dXJuIGkodCk7aWYoIWRvY3VtZW50LmltcGxlbWVudGF0aW9ufHwhZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KXJldHVybiB0O3ZhciBvPWRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcInNhbml0aXphdGlvblwiKTtvLmJvZHkuaW5uZXJIVE1MPXQ7Zm9yKHZhciBuPWcubWFwKGUsZnVuY3Rpb24odCxlKXtyZXR1cm4gZX0pLHM9ZyhvLmJvZHkpLmZpbmQoXCIqXCIpLGE9MCxyPXMubGVuZ3RoO2E8cjthKyspe3ZhciBsPXNbYV0saD1sLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7aWYoLTEhPT1nLmluQXJyYXkoaCxuKSlmb3IodmFyIGQ9Zy5tYXAobC5hdHRyaWJ1dGVzLGZ1bmN0aW9uKHQpe3JldHVybiB0fSkscD1bXS5jb25jYXQoZVtcIipcIl18fFtdLGVbaF18fFtdKSxjPTAsZj1kLmxlbmd0aDtjPGY7YysrKXUoZFtjXSxwKXx8bC5yZW1vdmVBdHRyaWJ1dGUoZFtjXS5ub2RlTmFtZSk7ZWxzZSBsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobCl9cmV0dXJuIG8uYm9keS5pbm5lckhUTUx9dmFyIG09ZnVuY3Rpb24odCxlKXt0aGlzLnR5cGU9bnVsbCx0aGlzLm9wdGlvbnM9bnVsbCx0aGlzLmVuYWJsZWQ9bnVsbCx0aGlzLnRpbWVvdXQ9bnVsbCx0aGlzLmhvdmVyU3RhdGU9bnVsbCx0aGlzLiRlbGVtZW50PW51bGwsdGhpcy5pblN0YXRlPW51bGwsdGhpcy5pbml0KFwidG9vbHRpcFwiLHQsZSl9O20uVkVSU0lPTj1cIjMuNC4xXCIsbS5UUkFOU0lUSU9OX0RVUkFUSU9OPTE1MCxtLkRFRkFVTFRTPXthbmltYXRpb246ITAscGxhY2VtZW50OlwidG9wXCIsc2VsZWN0b3I6ITEsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+Jyx0cmlnZ2VyOlwiaG92ZXIgZm9jdXNcIix0aXRsZTpcIlwiLGRlbGF5OjAsaHRtbDohMSxjb250YWluZXI6ITEsdmlld3BvcnQ6e3NlbGVjdG9yOlwiYm9keVwiLHBhZGRpbmc6MH0sc2FuaXRpemU6ITAsc2FuaXRpemVGbjpudWxsLHdoaXRlTGlzdDp0fSxtLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKHQsZSxpKXtpZih0aGlzLmVuYWJsZWQ9ITAsdGhpcy50eXBlPXQsdGhpcy4kZWxlbWVudD1nKGUpLHRoaXMub3B0aW9ucz10aGlzLmdldE9wdGlvbnMoaSksdGhpcy4kdmlld3BvcnQ9dGhpcy5vcHRpb25zLnZpZXdwb3J0JiZnKGRvY3VtZW50KS5maW5kKGcuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMudmlld3BvcnQpP3RoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsdGhpcy4kZWxlbWVudCk6dGhpcy5vcHRpb25zLnZpZXdwb3J0LnNlbGVjdG9yfHx0aGlzLm9wdGlvbnMudmlld3BvcnQpLHRoaXMuaW5TdGF0ZT17Y2xpY2s6ITEsaG92ZXI6ITEsZm9jdXM6ITF9LHRoaXMuJGVsZW1lbnRbMF1pbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yJiYhdGhpcy5vcHRpb25zLnNlbGVjdG9yKXRocm93IG5ldyBFcnJvcihcImBzZWxlY3RvcmAgb3B0aW9uIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIFwiK3RoaXMudHlwZStcIiBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCFcIik7Zm9yKHZhciBvPXRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KFwiIFwiKSxuPW8ubGVuZ3RoO24tLTspe3ZhciBzPW9bbl07aWYoXCJjbGlja1wiPT1zKXRoaXMuJGVsZW1lbnQub24oXCJjbGljay5cIit0aGlzLnR5cGUsdGhpcy5vcHRpb25zLnNlbGVjdG9yLGcucHJveHkodGhpcy50b2dnbGUsdGhpcykpO2Vsc2UgaWYoXCJtYW51YWxcIiE9cyl7dmFyIGE9XCJob3ZlclwiPT1zP1wibW91c2VlbnRlclwiOlwiZm9jdXNpblwiLHI9XCJob3ZlclwiPT1zP1wibW91c2VsZWF2ZVwiOlwiZm9jdXNvdXRcIjt0aGlzLiRlbGVtZW50Lm9uKGErXCIuXCIrdGhpcy50eXBlLHRoaXMub3B0aW9ucy5zZWxlY3RvcixnLnByb3h5KHRoaXMuZW50ZXIsdGhpcykpLHRoaXMuJGVsZW1lbnQub24ocitcIi5cIit0aGlzLnR5cGUsdGhpcy5vcHRpb25zLnNlbGVjdG9yLGcucHJveHkodGhpcy5sZWF2ZSx0aGlzKSl9fXRoaXMub3B0aW9ucy5zZWxlY3Rvcj90aGlzLl9vcHRpb25zPWcuZXh0ZW5kKHt9LHRoaXMub3B0aW9ucyx7dHJpZ2dlcjpcIm1hbnVhbFwiLHNlbGVjdG9yOlwiXCJ9KTp0aGlzLmZpeFRpdGxlKCl9LG0ucHJvdG90eXBlLmdldERlZmF1bHRzPWZ1bmN0aW9uKCl7cmV0dXJuIG0uREVGQVVMVFN9LG0ucHJvdG90eXBlLmdldE9wdGlvbnM9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy4kZWxlbWVudC5kYXRhKCk7Zm9yKHZhciBpIGluIGUpZS5oYXNPd25Qcm9wZXJ0eShpKSYmLTEhPT1nLmluQXJyYXkoaSxvKSYmZGVsZXRlIGVbaV07cmV0dXJuKHQ9Zy5leHRlbmQoe30sdGhpcy5nZXREZWZhdWx0cygpLGUsdCkpLmRlbGF5JiZcIm51bWJlclwiPT10eXBlb2YgdC5kZWxheSYmKHQuZGVsYXk9e3Nob3c6dC5kZWxheSxoaWRlOnQuZGVsYXl9KSx0LnNhbml0aXplJiYodC50ZW1wbGF0ZT1uKHQudGVtcGxhdGUsdC53aGl0ZUxpc3QsdC5zYW5pdGl6ZUZuKSksdH0sbS5wcm90b3R5cGUuZ2V0RGVsZWdhdGVPcHRpb25zPWZ1bmN0aW9uKCl7dmFyIGk9e30sbz10aGlzLmdldERlZmF1bHRzKCk7cmV0dXJuIHRoaXMuX29wdGlvbnMmJmcuZWFjaCh0aGlzLl9vcHRpb25zLGZ1bmN0aW9uKHQsZSl7b1t0XSE9ZSYmKGlbdF09ZSl9KSxpfSxtLnByb3RvdHlwZS5lbnRlcj1mdW5jdGlvbih0KXt2YXIgZT10IGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcj90OmcodC5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlKTtpZihlfHwoZT1uZXcgdGhpcy5jb25zdHJ1Y3Rvcih0LmN1cnJlbnRUYXJnZXQsdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSksZyh0LmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsZSkpLHQgaW5zdGFuY2VvZiBnLkV2ZW50JiYoZS5pblN0YXRlW1wiZm9jdXNpblwiPT10LnR5cGU/XCJmb2N1c1wiOlwiaG92ZXJcIl09ITApLGUudGlwKCkuaGFzQ2xhc3MoXCJpblwiKXx8XCJpblwiPT1lLmhvdmVyU3RhdGUpZS5ob3ZlclN0YXRlPVwiaW5cIjtlbHNle2lmKGNsZWFyVGltZW91dChlLnRpbWVvdXQpLGUuaG92ZXJTdGF0ZT1cImluXCIsIWUub3B0aW9ucy5kZWxheXx8IWUub3B0aW9ucy5kZWxheS5zaG93KXJldHVybiBlLnNob3coKTtlLnRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1wiaW5cIj09ZS5ob3ZlclN0YXRlJiZlLnNob3coKX0sZS5vcHRpb25zLmRlbGF5LnNob3cpfX0sbS5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZT1mdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzLmluU3RhdGUpaWYodGhpcy5pblN0YXRlW3RdKXJldHVybiEwO3JldHVybiExfSxtLnByb3RvdHlwZS5sZWF2ZT1mdW5jdGlvbih0KXt2YXIgZT10IGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcj90OmcodC5jdXJyZW50VGFyZ2V0KS5kYXRhKFwiYnMuXCIrdGhpcy50eXBlKTtpZihlfHwoZT1uZXcgdGhpcy5jb25zdHJ1Y3Rvcih0LmN1cnJlbnRUYXJnZXQsdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSksZyh0LmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsZSkpLHQgaW5zdGFuY2VvZiBnLkV2ZW50JiYoZS5pblN0YXRlW1wiZm9jdXNvdXRcIj09dC50eXBlP1wiZm9jdXNcIjpcImhvdmVyXCJdPSExKSwhZS5pc0luU3RhdGVUcnVlKCkpe2lmKGNsZWFyVGltZW91dChlLnRpbWVvdXQpLGUuaG92ZXJTdGF0ZT1cIm91dFwiLCFlLm9wdGlvbnMuZGVsYXl8fCFlLm9wdGlvbnMuZGVsYXkuaGlkZSlyZXR1cm4gZS5oaWRlKCk7ZS50aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcIm91dFwiPT1lLmhvdmVyU3RhdGUmJmUuaGlkZSgpfSxlLm9wdGlvbnMuZGVsYXkuaGlkZSl9fSxtLnByb3RvdHlwZS5zaG93PWZ1bmN0aW9uKCl7dmFyIHQ9Zy5FdmVudChcInNob3cuYnMuXCIrdGhpcy50eXBlKTtpZih0aGlzLmhhc0NvbnRlbnQoKSYmdGhpcy5lbmFibGVkKXt0aGlzLiRlbGVtZW50LnRyaWdnZXIodCk7dmFyIGU9Zy5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LHRoaXMuJGVsZW1lbnRbMF0pO2lmKHQuaXNEZWZhdWx0UHJldmVudGVkKCl8fCFlKXJldHVybjt2YXIgaT10aGlzLG89dGhpcy50aXAoKSxuPXRoaXMuZ2V0VUlEKHRoaXMudHlwZSk7dGhpcy5zZXRDb250ZW50KCksby5hdHRyKFwiaWRcIixuKSx0aGlzLiRlbGVtZW50LmF0dHIoXCJhcmlhLWRlc2NyaWJlZGJ5XCIsbiksdGhpcy5vcHRpb25zLmFuaW1hdGlvbiYmby5hZGRDbGFzcyhcImZhZGVcIik7dmFyIHM9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudD90aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcyxvWzBdLHRoaXMuJGVsZW1lbnRbMF0pOnRoaXMub3B0aW9ucy5wbGFjZW1lbnQsYT0vXFxzP2F1dG8/XFxzPy9pLHI9YS50ZXN0KHMpO3ImJihzPXMucmVwbGFjZShhLFwiXCIpfHxcInRvcFwiKSxvLmRldGFjaCgpLmNzcyh7dG9wOjAsbGVmdDowLGRpc3BsYXk6XCJibG9ja1wifSkuYWRkQ2xhc3MocykuZGF0YShcImJzLlwiK3RoaXMudHlwZSx0aGlzKSx0aGlzLm9wdGlvbnMuY29udGFpbmVyP28uYXBwZW5kVG8oZyhkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSk6by5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KSx0aGlzLiRlbGVtZW50LnRyaWdnZXIoXCJpbnNlcnRlZC5icy5cIit0aGlzLnR5cGUpO3ZhciBsPXRoaXMuZ2V0UG9zaXRpb24oKSxoPW9bMF0ub2Zmc2V0V2lkdGgsZD1vWzBdLm9mZnNldEhlaWdodDtpZihyKXt2YXIgcD1zLGM9dGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydCk7cz1cImJvdHRvbVwiPT1zJiZsLmJvdHRvbStkPmMuYm90dG9tP1widG9wXCI6XCJ0b3BcIj09cyYmbC50b3AtZDxjLnRvcD9cImJvdHRvbVwiOlwicmlnaHRcIj09cyYmbC5yaWdodCtoPmMud2lkdGg/XCJsZWZ0XCI6XCJsZWZ0XCI9PXMmJmwubGVmdC1oPGMubGVmdD9cInJpZ2h0XCI6cyxvLnJlbW92ZUNsYXNzKHApLmFkZENsYXNzKHMpfXZhciBmPXRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChzLGwsaCxkKTt0aGlzLmFwcGx5UGxhY2VtZW50KGYscyk7dmFyIHU9ZnVuY3Rpb24oKXt2YXIgdD1pLmhvdmVyU3RhdGU7aS4kZWxlbWVudC50cmlnZ2VyKFwic2hvd24uYnMuXCIraS50eXBlKSxpLmhvdmVyU3RhdGU9bnVsbCxcIm91dFwiPT10JiZpLmxlYXZlKGkpfTtnLnN1cHBvcnQudHJhbnNpdGlvbiYmdGhpcy4kdGlwLmhhc0NsYXNzKFwiZmFkZVwiKT9vLm9uZShcImJzVHJhbnNpdGlvbkVuZFwiLHUpLmVtdWxhdGVUcmFuc2l0aW9uRW5kKG0uVFJBTlNJVElPTl9EVVJBVElPTik6dSgpfX0sbS5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQ9ZnVuY3Rpb24odCxlKXt2YXIgaT10aGlzLnRpcCgpLG89aVswXS5vZmZzZXRXaWR0aCxuPWlbMF0ub2Zmc2V0SGVpZ2h0LHM9cGFyc2VJbnQoaS5jc3MoXCJtYXJnaW4tdG9wXCIpLDEwKSxhPXBhcnNlSW50KGkuY3NzKFwibWFyZ2luLWxlZnRcIiksMTApO2lzTmFOKHMpJiYocz0wKSxpc05hTihhKSYmKGE9MCksdC50b3ArPXMsdC5sZWZ0Kz1hLGcub2Zmc2V0LnNldE9mZnNldChpWzBdLGcuZXh0ZW5kKHt1c2luZzpmdW5jdGlvbih0KXtpLmNzcyh7dG9wOk1hdGgucm91bmQodC50b3ApLGxlZnQ6TWF0aC5yb3VuZCh0LmxlZnQpfSl9fSx0KSwwKSxpLmFkZENsYXNzKFwiaW5cIik7dmFyIHI9aVswXS5vZmZzZXRXaWR0aCxsPWlbMF0ub2Zmc2V0SGVpZ2h0O1widG9wXCI9PWUmJmwhPW4mJih0LnRvcD10LnRvcCtuLWwpO3ZhciBoPXRoaXMuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhKGUsdCxyLGwpO2gubGVmdD90LmxlZnQrPWgubGVmdDp0LnRvcCs9aC50b3A7dmFyIGQ9L3RvcHxib3R0b20vLnRlc3QoZSkscD1kPzIqaC5sZWZ0LW8rcjoyKmgudG9wLW4rbCxjPWQ/XCJvZmZzZXRXaWR0aFwiOlwib2Zmc2V0SGVpZ2h0XCI7aS5vZmZzZXQodCksdGhpcy5yZXBsYWNlQXJyb3cocCxpWzBdW2NdLGQpfSxtLnByb3RvdHlwZS5yZXBsYWNlQXJyb3c9ZnVuY3Rpb24odCxlLGkpe3RoaXMuYXJyb3coKS5jc3MoaT9cImxlZnRcIjpcInRvcFwiLDUwKigxLXQvZSkrXCIlXCIpLmNzcyhpP1widG9wXCI6XCJsZWZ0XCIsXCJcIil9LG0ucHJvdG90eXBlLnNldENvbnRlbnQ9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnRpcCgpLGU9dGhpcy5nZXRUaXRsZSgpO3RoaXMub3B0aW9ucy5odG1sPyh0aGlzLm9wdGlvbnMuc2FuaXRpemUmJihlPW4oZSx0aGlzLm9wdGlvbnMud2hpdGVMaXN0LHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKSksdC5maW5kKFwiLnRvb2x0aXAtaW5uZXJcIikuaHRtbChlKSk6dC5maW5kKFwiLnRvb2x0aXAtaW5uZXJcIikudGV4dChlKSx0LnJlbW92ZUNsYXNzKFwiZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHRcIil9LG0ucHJvdG90eXBlLmhpZGU9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxpPWcodGhpcy4kdGlwKSxvPWcuRXZlbnQoXCJoaWRlLmJzLlwiK3RoaXMudHlwZSk7ZnVuY3Rpb24gbigpe1wiaW5cIiE9ZS5ob3ZlclN0YXRlJiZpLmRldGFjaCgpLGUuJGVsZW1lbnQmJmUuJGVsZW1lbnQucmVtb3ZlQXR0cihcImFyaWEtZGVzY3JpYmVkYnlcIikudHJpZ2dlcihcImhpZGRlbi5icy5cIitlLnR5cGUpLHQmJnQoKX1pZih0aGlzLiRlbGVtZW50LnRyaWdnZXIobyksIW8uaXNEZWZhdWx0UHJldmVudGVkKCkpcmV0dXJuIGkucmVtb3ZlQ2xhc3MoXCJpblwiKSxnLnN1cHBvcnQudHJhbnNpdGlvbiYmaS5oYXNDbGFzcyhcImZhZGVcIik/aS5vbmUoXCJic1RyYW5zaXRpb25FbmRcIixuKS5lbXVsYXRlVHJhbnNpdGlvbkVuZChtLlRSQU5TSVRJT05fRFVSQVRJT04pOm4oKSx0aGlzLmhvdmVyU3RhdGU9bnVsbCx0aGlzfSxtLnByb3RvdHlwZS5maXhUaXRsZT1mdW5jdGlvbigpe3ZhciB0PXRoaXMuJGVsZW1lbnQ7KHQuYXR0cihcInRpdGxlXCIpfHxcInN0cmluZ1wiIT10eXBlb2YgdC5hdHRyKFwiZGF0YS1vcmlnaW5hbC10aXRsZVwiKSkmJnQuYXR0cihcImRhdGEtb3JpZ2luYWwtdGl0bGVcIix0LmF0dHIoXCJ0aXRsZVwiKXx8XCJcIikuYXR0cihcInRpdGxlXCIsXCJcIil9LG0ucHJvdG90eXBlLmhhc0NvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRUaXRsZSgpfSxtLnByb3RvdHlwZS5nZXRQb3NpdGlvbj1mdW5jdGlvbih0KXt2YXIgZT0odD10fHx0aGlzLiRlbGVtZW50KVswXSxpPVwiQk9EWVwiPT1lLnRhZ05hbWUsbz1lLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO251bGw9PW8ud2lkdGgmJihvPWcuZXh0ZW5kKHt9LG8se3dpZHRoOm8ucmlnaHQtby5sZWZ0LGhlaWdodDpvLmJvdHRvbS1vLnRvcH0pKTt2YXIgbj13aW5kb3cuU1ZHRWxlbWVudCYmZSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50LHM9aT97dG9wOjAsbGVmdDowfTpuP251bGw6dC5vZmZzZXQoKSxhPXtzY3JvbGw6aT9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wfHxkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDp0LnNjcm9sbFRvcCgpfSxyPWk/e3dpZHRoOmcod2luZG93KS53aWR0aCgpLGhlaWdodDpnKHdpbmRvdykuaGVpZ2h0KCl9Om51bGw7cmV0dXJuIGcuZXh0ZW5kKHt9LG8sYSxyLHMpfSxtLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0PWZ1bmN0aW9uKHQsZSxpLG8pe3JldHVyblwiYm90dG9tXCI9PXQ/e3RvcDplLnRvcCtlLmhlaWdodCxsZWZ0OmUubGVmdCtlLndpZHRoLzItaS8yfTpcInRvcFwiPT10P3t0b3A6ZS50b3AtbyxsZWZ0OmUubGVmdCtlLndpZHRoLzItaS8yfTpcImxlZnRcIj09dD97dG9wOmUudG9wK2UuaGVpZ2h0LzItby8yLGxlZnQ6ZS5sZWZ0LWl9Ont0b3A6ZS50b3ArZS5oZWlnaHQvMi1vLzIsbGVmdDplLmxlZnQrZS53aWR0aH19LG0ucHJvdG90eXBlLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YT1mdW5jdGlvbih0LGUsaSxvKXt2YXIgbj17dG9wOjAsbGVmdDowfTtpZighdGhpcy4kdmlld3BvcnQpcmV0dXJuIG47dmFyIHM9dGhpcy5vcHRpb25zLnZpZXdwb3J0JiZ0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZ3x8MCxhPXRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpO2lmKC9yaWdodHxsZWZ0Ly50ZXN0KHQpKXt2YXIgcj1lLnRvcC1zLWEuc2Nyb2xsLGw9ZS50b3Arcy1hLnNjcm9sbCtvO3I8YS50b3A/bi50b3A9YS50b3AtcjpsPmEudG9wK2EuaGVpZ2h0JiYobi50b3A9YS50b3ArYS5oZWlnaHQtbCl9ZWxzZXt2YXIgaD1lLmxlZnQtcyxkPWUubGVmdCtzK2k7aDxhLmxlZnQ/bi5sZWZ0PWEubGVmdC1oOmQ+YS5yaWdodCYmKG4ubGVmdD1hLmxlZnQrYS53aWR0aC1kKX1yZXR1cm4gbn0sbS5wcm90b3R5cGUuZ2V0VGl0bGU9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLiRlbGVtZW50LGU9dGhpcy5vcHRpb25zO3JldHVybiB0LmF0dHIoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpfHwoXCJmdW5jdGlvblwiPT10eXBlb2YgZS50aXRsZT9lLnRpdGxlLmNhbGwodFswXSk6ZS50aXRsZSl9LG0ucHJvdG90eXBlLmdldFVJRD1mdW5jdGlvbih0KXtmb3IoO3QrPX5+KDFlNipNYXRoLnJhbmRvbSgpKSxkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0KTspO3JldHVybiB0fSxtLnByb3RvdHlwZS50aXA9ZnVuY3Rpb24oKXtpZighdGhpcy4kdGlwJiYodGhpcy4kdGlwPWcodGhpcy5vcHRpb25zLnRlbXBsYXRlKSwxIT10aGlzLiR0aXAubGVuZ3RoKSl0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlK1wiIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhXCIpO3JldHVybiB0aGlzLiR0aXB9LG0ucHJvdG90eXBlLmFycm93PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGFycm93PXRoaXMuJGFycm93fHx0aGlzLnRpcCgpLmZpbmQoXCIudG9vbHRpcC1hcnJvd1wiKX0sbS5wcm90b3R5cGUuZW5hYmxlPWZ1bmN0aW9uKCl7dGhpcy5lbmFibGVkPSEwfSxtLnByb3RvdHlwZS5kaXNhYmxlPWZ1bmN0aW9uKCl7dGhpcy5lbmFibGVkPSExfSxtLnByb3RvdHlwZS50b2dnbGVFbmFibGVkPWZ1bmN0aW9uKCl7dGhpcy5lbmFibGVkPSF0aGlzLmVuYWJsZWR9LG0ucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbih0KXt2YXIgZT10aGlzO3QmJigoZT1nKHQuY3VycmVudFRhcmdldCkuZGF0YShcImJzLlwiK3RoaXMudHlwZSkpfHwoZT1uZXcgdGhpcy5jb25zdHJ1Y3Rvcih0LmN1cnJlbnRUYXJnZXQsdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSksZyh0LmN1cnJlbnRUYXJnZXQpLmRhdGEoXCJicy5cIit0aGlzLnR5cGUsZSkpKSx0PyhlLmluU3RhdGUuY2xpY2s9IWUuaW5TdGF0ZS5jbGljayxlLmlzSW5TdGF0ZVRydWUoKT9lLmVudGVyKGUpOmUubGVhdmUoZSkpOmUudGlwKCkuaGFzQ2xhc3MoXCJpblwiKT9lLmxlYXZlKGUpOmUuZW50ZXIoZSl9LG0ucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO2NsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpLHRoaXMuaGlkZShmdW5jdGlvbigpe3QuJGVsZW1lbnQub2ZmKFwiLlwiK3QudHlwZSkucmVtb3ZlRGF0YShcImJzLlwiK3QudHlwZSksdC4kdGlwJiZ0LiR0aXAuZGV0YWNoKCksdC4kdGlwPW51bGwsdC4kYXJyb3c9bnVsbCx0LiR2aWV3cG9ydD1udWxsLHQuJGVsZW1lbnQ9bnVsbH0pfSxtLnByb3RvdHlwZS5zYW5pdGl6ZUh0bWw9ZnVuY3Rpb24odCl7cmV0dXJuIG4odCx0aGlzLm9wdGlvbnMud2hpdGVMaXN0LHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKX07dmFyIGU9Zy5mbi50b29sdGlwO2cuZm4udG9vbHRpcD1mdW5jdGlvbiBpKG8pe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1nKHRoaXMpLGU9dC5kYXRhKFwiYnMudG9vbHRpcFwiKSxpPVwib2JqZWN0XCI9PXR5cGVvZiBvJiZvOyFlJiYvZGVzdHJveXxoaWRlLy50ZXN0KG8pfHwoZXx8dC5kYXRhKFwiYnMudG9vbHRpcFwiLGU9bmV3IG0odGhpcyxpKSksXCJzdHJpbmdcIj09dHlwZW9mIG8mJmVbb10oKSl9KX0sZy5mbi50b29sdGlwLkNvbnN0cnVjdG9yPW0sZy5mbi50b29sdGlwLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gZy5mbi50b29sdGlwPWUsdGhpc319KGpRdWVyeSksZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHM9ZnVuY3Rpb24odCxlKXt0aGlzLmluaXQoXCJwb3BvdmVyXCIsdCxlKX07aWYoIW4uZm4udG9vbHRpcCl0aHJvdyBuZXcgRXJyb3IoXCJQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanNcIik7cy5WRVJTSU9OPVwiMy40LjFcIixzLkRFRkFVTFRTPW4uZXh0ZW5kKHt9LG4uZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUyx7cGxhY2VtZW50OlwicmlnaHRcIix0cmlnZ2VyOlwiY2xpY2tcIixjb250ZW50OlwiXCIsdGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J30pLCgocy5wcm90b3R5cGU9bi5leHRlbmQoe30sbi5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSkpLmNvbnN0cnVjdG9yPXMpLnByb3RvdHlwZS5nZXREZWZhdWx0cz1mdW5jdGlvbigpe3JldHVybiBzLkRFRkFVTFRTfSxzLnByb3RvdHlwZS5zZXRDb250ZW50PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50aXAoKSxlPXRoaXMuZ2V0VGl0bGUoKSxpPXRoaXMuZ2V0Q29udGVudCgpO2lmKHRoaXMub3B0aW9ucy5odG1sKXt2YXIgbz10eXBlb2YgaTt0aGlzLm9wdGlvbnMuc2FuaXRpemUmJihlPXRoaXMuc2FuaXRpemVIdG1sKGUpLFwic3RyaW5nXCI9PT1vJiYoaT10aGlzLnNhbml0aXplSHRtbChpKSkpLHQuZmluZChcIi5wb3BvdmVyLXRpdGxlXCIpLmh0bWwoZSksdC5maW5kKFwiLnBvcG92ZXItY29udGVudFwiKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpW1wic3RyaW5nXCI9PT1vP1wiaHRtbFwiOlwiYXBwZW5kXCJdKGkpfWVsc2UgdC5maW5kKFwiLnBvcG92ZXItdGl0bGVcIikudGV4dChlKSx0LmZpbmQoXCIucG9wb3Zlci1jb250ZW50XCIpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKCkudGV4dChpKTt0LnJlbW92ZUNsYXNzKFwiZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW5cIiksdC5maW5kKFwiLnBvcG92ZXItdGl0bGVcIikuaHRtbCgpfHx0LmZpbmQoXCIucG9wb3Zlci10aXRsZVwiKS5oaWRlKCl9LHMucHJvdG90eXBlLmhhc0NvbnRlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRUaXRsZSgpfHx0aGlzLmdldENvbnRlbnQoKX0scy5wcm90b3R5cGUuZ2V0Q29udGVudD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuJGVsZW1lbnQsZT10aGlzLm9wdGlvbnM7cmV0dXJuIHQuYXR0cihcImRhdGEtY29udGVudFwiKXx8KFwiZnVuY3Rpb25cIj09dHlwZW9mIGUuY29udGVudD9lLmNvbnRlbnQuY2FsbCh0WzBdKTplLmNvbnRlbnQpfSxzLnByb3RvdHlwZS5hcnJvdz1mdW5jdGlvbigpe3JldHVybiB0aGlzLiRhcnJvdz10aGlzLiRhcnJvd3x8dGhpcy50aXAoKS5maW5kKFwiLmFycm93XCIpfTt2YXIgdD1uLmZuLnBvcG92ZXI7bi5mbi5wb3BvdmVyPWZ1bmN0aW9uIGUobyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PW4odGhpcyksZT10LmRhdGEoXCJicy5wb3BvdmVyXCIpLGk9XCJvYmplY3RcIj09dHlwZW9mIG8mJm87IWUmJi9kZXN0cm95fGhpZGUvLnRlc3Qobyl8fChlfHx0LmRhdGEoXCJicy5wb3BvdmVyXCIsZT1uZXcgcyh0aGlzLGkpKSxcInN0cmluZ1wiPT10eXBlb2YgbyYmZVtvXSgpKX0pfSxuLmZuLnBvcG92ZXIuQ29uc3RydWN0b3I9cyxuLmZuLnBvcG92ZXIubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBuLmZuLnBvcG92ZXI9dCx0aGlzfX0oalF1ZXJ5KSxmdW5jdGlvbihzKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSl7dGhpcy4kYm9keT1zKGRvY3VtZW50LmJvZHkpLHRoaXMuJHNjcm9sbEVsZW1lbnQ9cyh0KS5pcyhkb2N1bWVudC5ib2R5KT9zKHdpbmRvdyk6cyh0KSx0aGlzLm9wdGlvbnM9cy5leHRlbmQoe30sbi5ERUZBVUxUUyxlKSx0aGlzLnNlbGVjdG9yPSh0aGlzLm9wdGlvbnMudGFyZ2V0fHxcIlwiKStcIiAubmF2IGxpID4gYVwiLHRoaXMub2Zmc2V0cz1bXSx0aGlzLnRhcmdldHM9W10sdGhpcy5hY3RpdmVUYXJnZXQ9bnVsbCx0aGlzLnNjcm9sbEhlaWdodD0wLHRoaXMuJHNjcm9sbEVsZW1lbnQub24oXCJzY3JvbGwuYnMuc2Nyb2xsc3B5XCIscy5wcm94eSh0aGlzLnByb2Nlc3MsdGhpcykpLHRoaXMucmVmcmVzaCgpLHRoaXMucHJvY2VzcygpfWZ1bmN0aW9uIGUobyl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciB0PXModGhpcyksZT10LmRhdGEoXCJicy5zY3JvbGxzcHlcIiksaT1cIm9iamVjdFwiPT10eXBlb2YgbyYmbztlfHx0LmRhdGEoXCJicy5zY3JvbGxzcHlcIixlPW5ldyBuKHRoaXMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBvJiZlW29dKCl9KX1uLlZFUlNJT049XCIzLjQuMVwiLG4uREVGQVVMVFM9e29mZnNldDoxMH0sbi5wcm90b3R5cGUuZ2V0U2Nyb2xsSGVpZ2h0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0fHxNYXRoLm1heCh0aGlzLiRib2R5WzBdLnNjcm9sbEhlaWdodCxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KX0sbi5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3ZhciB0PXRoaXMsbz1cIm9mZnNldFwiLG49MDt0aGlzLm9mZnNldHM9W10sdGhpcy50YXJnZXRzPVtdLHRoaXMuc2Nyb2xsSGVpZ2h0PXRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KCkscy5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKXx8KG89XCJwb3NpdGlvblwiLG49dGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSksdGhpcy4kYm9keS5maW5kKHRoaXMuc2VsZWN0b3IpLm1hcChmdW5jdGlvbigpe3ZhciB0PXModGhpcyksZT10LmRhdGEoXCJ0YXJnZXRcIil8fHQuYXR0cihcImhyZWZcIiksaT0vXiMuLy50ZXN0KGUpJiZzKGUpO3JldHVybiBpJiZpLmxlbmd0aCYmaS5pcyhcIjp2aXNpYmxlXCIpJiZbW2lbb10oKS50b3ArbixlXV18fG51bGx9KS5zb3J0KGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbMF0tZVswXX0pLmVhY2goZnVuY3Rpb24oKXt0Lm9mZnNldHMucHVzaCh0aGlzWzBdKSx0LnRhcmdldHMucHVzaCh0aGlzWzFdKX0pfSxuLnByb3RvdHlwZS5wcm9jZXNzPWZ1bmN0aW9uKCl7dmFyIHQsZT10aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpK3RoaXMub3B0aW9ucy5vZmZzZXQsaT10aGlzLmdldFNjcm9sbEhlaWdodCgpLG89dGhpcy5vcHRpb25zLm9mZnNldCtpLXRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KCksbj10aGlzLm9mZnNldHMscz10aGlzLnRhcmdldHMsYT10aGlzLmFjdGl2ZVRhcmdldDtpZih0aGlzLnNjcm9sbEhlaWdodCE9aSYmdGhpcy5yZWZyZXNoKCksbzw9ZSlyZXR1cm4gYSE9KHQ9c1tzLmxlbmd0aC0xXSkmJnRoaXMuYWN0aXZhdGUodCk7aWYoYSYmZTxuWzBdKXJldHVybiB0aGlzLmFjdGl2ZVRhcmdldD1udWxsLHRoaXMuY2xlYXIoKTtmb3IodD1uLmxlbmd0aDt0LS07KWEhPXNbdF0mJmU+PW5bdF0mJihuW3QrMV09PT11bmRlZmluZWR8fGU8blt0KzFdKSYmdGhpcy5hY3RpdmF0ZShzW3RdKX0sbi5wcm90b3R5cGUuYWN0aXZhdGU9ZnVuY3Rpb24odCl7dGhpcy5hY3RpdmVUYXJnZXQ9dCx0aGlzLmNsZWFyKCk7dmFyIGU9dGhpcy5zZWxlY3RvcisnW2RhdGEtdGFyZ2V0PVwiJyt0KydcIl0sJyt0aGlzLnNlbGVjdG9yKydbaHJlZj1cIicrdCsnXCJdJyxpPXMoZSkucGFyZW50cyhcImxpXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO2kucGFyZW50KFwiLmRyb3Bkb3duLW1lbnVcIikubGVuZ3RoJiYoaT1pLmNsb3Nlc3QoXCJsaS5kcm9wZG93blwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSksaS50cmlnZ2VyKFwiYWN0aXZhdGUuYnMuc2Nyb2xsc3B5XCIpfSxuLnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3ModGhpcy5zZWxlY3RvcikucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpfTt2YXIgdD1zLmZuLnNjcm9sbHNweTtzLmZuLnNjcm9sbHNweT1lLHMuZm4uc2Nyb2xsc3B5LkNvbnN0cnVjdG9yPW4scy5mbi5zY3JvbGxzcHkubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBzLmZuLnNjcm9sbHNweT10LHRoaXN9LHMod2luZG93KS5vbihcImxvYWQuYnMuc2Nyb2xsc3B5LmRhdGEtYXBpXCIsZnVuY3Rpb24oKXtzKCdbZGF0YS1zcHk9XCJzY3JvbGxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9cyh0aGlzKTtlLmNhbGwodCx0LmRhdGEoKSl9KX0pfShqUXVlcnkpLGZ1bmN0aW9uKHIpe1widXNlIHN0cmljdFwiO3ZhciBhPWZ1bmN0aW9uKHQpe3RoaXMuZWxlbWVudD1yKHQpfTtmdW5jdGlvbiBlKGkpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgdD1yKHRoaXMpLGU9dC5kYXRhKFwiYnMudGFiXCIpO2V8fHQuZGF0YShcImJzLnRhYlwiLGU9bmV3IGEodGhpcykpLFwic3RyaW5nXCI9PXR5cGVvZiBpJiZlW2ldKCl9KX1hLlZFUlNJT049XCIzLjQuMVwiLGEuVFJBTlNJVElPTl9EVVJBVElPTj0xNTAsYS5wcm90b3R5cGUuc2hvdz1mdW5jdGlvbigpe3ZhciB0PXRoaXMuZWxlbWVudCxlPXQuY2xvc2VzdChcInVsOm5vdCguZHJvcGRvd24tbWVudSlcIiksaT10LmRhdGEoXCJ0YXJnZXRcIik7aWYoaXx8KGk9KGk9dC5hdHRyKFwiaHJlZlwiKSkmJmkucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLyxcIlwiKSksIXQucGFyZW50KFwibGlcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpe3ZhciBvPWUuZmluZChcIi5hY3RpdmU6bGFzdCBhXCIpLG49ci5FdmVudChcImhpZGUuYnMudGFiXCIse3JlbGF0ZWRUYXJnZXQ6dFswXX0pLHM9ci5FdmVudChcInNob3cuYnMudGFiXCIse3JlbGF0ZWRUYXJnZXQ6b1swXX0pO2lmKG8udHJpZ2dlcihuKSx0LnRyaWdnZXIocyksIXMuaXNEZWZhdWx0UHJldmVudGVkKCkmJiFuLmlzRGVmYXVsdFByZXZlbnRlZCgpKXt2YXIgYT1yKGRvY3VtZW50KS5maW5kKGkpO3RoaXMuYWN0aXZhdGUodC5jbG9zZXN0KFwibGlcIiksZSksdGhpcy5hY3RpdmF0ZShhLGEucGFyZW50KCksZnVuY3Rpb24oKXtvLnRyaWdnZXIoe3R5cGU6XCJoaWRkZW4uYnMudGFiXCIscmVsYXRlZFRhcmdldDp0WzBdfSksdC50cmlnZ2VyKHt0eXBlOlwic2hvd24uYnMudGFiXCIscmVsYXRlZFRhcmdldDpvWzBdfSl9KX19fSxhLnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbih0LGUsaSl7dmFyIG89ZS5maW5kKFwiPiAuYWN0aXZlXCIpLG49aSYmci5zdXBwb3J0LnRyYW5zaXRpb24mJihvLmxlbmd0aCYmby5oYXNDbGFzcyhcImZhZGVcIil8fCEhZS5maW5kKFwiPiAuZmFkZVwiKS5sZW5ndGgpO2Z1bmN0aW9uIHMoKXtvLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmZpbmQoXCI+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5lbmQoKS5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKS5hdHRyKFwiYXJpYS1leHBhbmRlZFwiLCExKSx0LmFkZENsYXNzKFwiYWN0aXZlXCIpLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpLmF0dHIoXCJhcmlhLWV4cGFuZGVkXCIsITApLG4/KHRbMF0ub2Zmc2V0V2lkdGgsdC5hZGRDbGFzcyhcImluXCIpKTp0LnJlbW92ZUNsYXNzKFwiZmFkZVwiKSx0LnBhcmVudChcIi5kcm9wZG93bi1tZW51XCIpLmxlbmd0aCYmdC5jbG9zZXN0KFwibGkuZHJvcGRvd25cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIikuZW5kKCkuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJykuYXR0cihcImFyaWEtZXhwYW5kZWRcIiwhMCksaSYmaSgpfW8ubGVuZ3RoJiZuP28ub25lKFwiYnNUcmFuc2l0aW9uRW5kXCIscykuZW11bGF0ZVRyYW5zaXRpb25FbmQoYS5UUkFOU0lUSU9OX0RVUkFUSU9OKTpzKCksby5yZW1vdmVDbGFzcyhcImluXCIpfTt2YXIgdD1yLmZuLnRhYjtyLmZuLnRhYj1lLHIuZm4udGFiLkNvbnN0cnVjdG9yPWEsci5mbi50YWIubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiByLmZuLnRhYj10LHRoaXN9O3ZhciBpPWZ1bmN0aW9uKHQpe3QucHJldmVudERlZmF1bHQoKSxlLmNhbGwocih0aGlzKSxcInNob3dcIil9O3IoZG9jdW1lbnQpLm9uKFwiY2xpY2suYnMudGFiLmRhdGEtYXBpXCIsJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScsaSkub24oXCJjbGljay5icy50YWIuZGF0YS1hcGlcIiwnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsaSl9KGpRdWVyeSksZnVuY3Rpb24obCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIGg9ZnVuY3Rpb24odCxlKXt0aGlzLm9wdGlvbnM9bC5leHRlbmQoe30saC5ERUZBVUxUUyxlKTt2YXIgaT10aGlzLm9wdGlvbnMudGFyZ2V0PT09aC5ERUZBVUxUUy50YXJnZXQ/bCh0aGlzLm9wdGlvbnMudGFyZ2V0KTpsKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpO3RoaXMuJHRhcmdldD1pLm9uKFwic2Nyb2xsLmJzLmFmZml4LmRhdGEtYXBpXCIsbC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sdGhpcykpLm9uKFwiY2xpY2suYnMuYWZmaXguZGF0YS1hcGlcIixsLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AsdGhpcykpLHRoaXMuJGVsZW1lbnQ9bCh0KSx0aGlzLmFmZml4ZWQ9bnVsbCx0aGlzLnVucGluPW51bGwsdGhpcy5waW5uZWRPZmZzZXQ9bnVsbCx0aGlzLmNoZWNrUG9zaXRpb24oKX07ZnVuY3Rpb24gaShvKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9bCh0aGlzKSxlPXQuZGF0YShcImJzLmFmZml4XCIpLGk9XCJvYmplY3RcIj09dHlwZW9mIG8mJm87ZXx8dC5kYXRhKFwiYnMuYWZmaXhcIixlPW5ldyBoKHRoaXMsaSkpLFwic3RyaW5nXCI9PXR5cGVvZiBvJiZlW29dKCl9KX1oLlZFUlNJT049XCIzLjQuMVwiLGguUkVTRVQ9XCJhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tXCIsaC5ERUZBVUxUUz17b2Zmc2V0OjAsdGFyZ2V0OndpbmRvd30saC5wcm90b3R5cGUuZ2V0U3RhdGU9ZnVuY3Rpb24odCxlLGksbyl7dmFyIG49dGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpLHM9dGhpcy4kZWxlbWVudC5vZmZzZXQoKSxhPXRoaXMuJHRhcmdldC5oZWlnaHQoKTtpZihudWxsIT1pJiZcInRvcFwiPT10aGlzLmFmZml4ZWQpcmV0dXJuIG48aSYmXCJ0b3BcIjtpZihcImJvdHRvbVwiPT10aGlzLmFmZml4ZWQpcmV0dXJuIG51bGwhPWk/IShuK3RoaXMudW5waW48PXMudG9wKSYmXCJib3R0b21cIjohKG4rYTw9dC1vKSYmXCJib3R0b21cIjt2YXIgcj1udWxsPT10aGlzLmFmZml4ZWQsbD1yP246cy50b3A7cmV0dXJuIG51bGwhPWkmJm48PWk/XCJ0b3BcIjpudWxsIT1vJiZ0LW88PWwrKHI/YTplKSYmXCJib3R0b21cIn0saC5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0PWZ1bmN0aW9uKCl7aWYodGhpcy5waW5uZWRPZmZzZXQpcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0O3RoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoaC5SRVNFVCkuYWRkQ2xhc3MoXCJhZmZpeFwiKTt2YXIgdD10aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKCksZT10aGlzLiRlbGVtZW50Lm9mZnNldCgpO3JldHVybiB0aGlzLnBpbm5lZE9mZnNldD1lLnRvcC10fSxoLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcD1mdW5jdGlvbigpe3NldFRpbWVvdXQobC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sdGhpcyksMSl9LGgucHJvdG90eXBlLmNoZWNrUG9zaXRpb249ZnVuY3Rpb24oKXtpZih0aGlzLiRlbGVtZW50LmlzKFwiOnZpc2libGVcIikpe3ZhciB0PXRoaXMuJGVsZW1lbnQuaGVpZ2h0KCksZT10aGlzLm9wdGlvbnMub2Zmc2V0LGk9ZS50b3Asbz1lLmJvdHRvbSxuPU1hdGgubWF4KGwoZG9jdW1lbnQpLmhlaWdodCgpLGwoZG9jdW1lbnQuYm9keSkuaGVpZ2h0KCkpO1wib2JqZWN0XCIhPXR5cGVvZiBlJiYobz1pPWUpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGkmJihpPWUudG9wKHRoaXMuJGVsZW1lbnQpKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBvJiYobz1lLmJvdHRvbSh0aGlzLiRlbGVtZW50KSk7dmFyIHM9dGhpcy5nZXRTdGF0ZShuLHQsaSxvKTtpZih0aGlzLmFmZml4ZWQhPXMpe251bGwhPXRoaXMudW5waW4mJnRoaXMuJGVsZW1lbnQuY3NzKFwidG9wXCIsXCJcIik7dmFyIGE9XCJhZmZpeFwiKyhzP1wiLVwiK3M6XCJcIikscj1sLkV2ZW50KGErXCIuYnMuYWZmaXhcIik7aWYodGhpcy4kZWxlbWVudC50cmlnZ2VyKHIpLHIuaXNEZWZhdWx0UHJldmVudGVkKCkpcmV0dXJuO3RoaXMuYWZmaXhlZD1zLHRoaXMudW5waW49XCJib3R0b21cIj09cz90aGlzLmdldFBpbm5lZE9mZnNldCgpOm51bGwsdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhoLlJFU0VUKS5hZGRDbGFzcyhhKS50cmlnZ2VyKGEucmVwbGFjZShcImFmZml4XCIsXCJhZmZpeGVkXCIpK1wiLmJzLmFmZml4XCIpfVwiYm90dG9tXCI9PXMmJnRoaXMuJGVsZW1lbnQub2Zmc2V0KHt0b3A6bi10LW99KX19O3ZhciB0PWwuZm4uYWZmaXg7bC5mbi5hZmZpeD1pLGwuZm4uYWZmaXguQ29uc3RydWN0b3I9aCxsLmZuLmFmZml4Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gbC5mbi5hZmZpeD10LHRoaXN9LGwod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2woJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbigpe3ZhciB0PWwodGhpcyksZT10LmRhdGEoKTtlLm9mZnNldD1lLm9mZnNldHx8e30sbnVsbCE9ZS5vZmZzZXRCb3R0b20mJihlLm9mZnNldC5ib3R0b209ZS5vZmZzZXRCb3R0b20pLG51bGwhPWUub2Zmc2V0VG9wJiYoZS5vZmZzZXQudG9wPWUub2Zmc2V0VG9wKSxpLmNhbGwodCxlKX0pfSl9KGpRdWVyeSk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLyohIEFkbWluTFRFIGFwcC5qc1xuKiA9PT09PT09PT09PT09PT09XG4qIE1haW4gSlMgYXBwbGljYXRpb24gZmlsZSBmb3IgQWRtaW5MVEUgdjIuIFRoaXMgZmlsZVxuKiBzaG91bGQgYmUgaW5jbHVkZWQgaW4gYWxsIHBhZ2VzLiBJdCBjb250cm9scyBzb21lIGxheW91dFxuKiBvcHRpb25zIGFuZCBpbXBsZW1lbnRzIGV4Y2x1c2l2ZSBBZG1pbkxURSBwbHVnaW5zLlxuKlxuKiBAQXV0aG9yICBBbG1zYWVlZCBTdHVkaW9cbiogQFN1cHBvcnQgPGh0dHBzOi8vd3d3LmFsbXNhZWVkc3R1ZGlvLmNvbT5cbiogQEVtYWlsICAgPGFiZHVsbGFoQGFsbXNhZWVkc3R1ZGlvLmNvbT5cbiogQHZlcnNpb24gMi40LjhcbiogQHJlcG9zaXRvcnkgZ2l0Oi8vZ2l0aHViLmNvbS9hbG1hc2FlZWQyMDEwL0FkbWluTFRFLmdpdFxuKiBAbGljZW5zZSBNSVQgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQ+XG4qL1xuaWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGpRdWVyeSl0aHJvdyBuZXcgRXJyb3IoXCJBZG1pbkxURSByZXF1aXJlcyBqUXVlcnlcIik7K2Z1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZz1lLmRhdGEoYyk7aWYoIWcpe3ZhciBoPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGc9bmV3IGYoZSxoKSl9aWYoXCJzdHJpbmdcIj09dHlwZW9mIGcpe2lmKHZvaWQgMD09PWdbYl0pdGhyb3cgbmV3IEVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFwiK2IpO2dbYl0oKX19KX12YXIgYz1cImx0ZS5ib3hyZWZyZXNoXCIsZD17c291cmNlOlwiXCIscGFyYW1zOnt9LHRyaWdnZXI6XCIucmVmcmVzaC1idG5cIixjb250ZW50OlwiLmJveC1ib2R5XCIsbG9hZEluQ29udGVudDohMCxyZXNwb25zZVR5cGU6XCJcIixvdmVybGF5VGVtcGxhdGU6JzxkaXYgY2xhc3M9XCJvdmVybGF5XCI+PGRpdiBjbGFzcz1cImZhIGZhLXJlZnJlc2ggZmEtc3BpblwiPjwvZGl2PjwvZGl2Picsb25Mb2FkU3RhcnQ6ZnVuY3Rpb24oKXt9LG9uTG9hZERvbmU6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9fSxlPXtkYXRhOidbZGF0YS13aWRnZXQ9XCJib3gtcmVmcmVzaFwiXSd9LGY9ZnVuY3Rpb24oYixjKXtpZih0aGlzLmVsZW1lbnQ9Yix0aGlzLm9wdGlvbnM9Yyx0aGlzLiRvdmVybGF5PWEoYy5vdmVybGF5VGVtcGxhdGUpLFwiXCI9PT1jLnNvdXJjZSl0aHJvdyBuZXcgRXJyb3IoXCJTb3VyY2UgdXJsIHdhcyBub3QgZGVmaW5lZC4gUGxlYXNlIHNwZWNpZnkgYSB1cmwgaW4geW91ciBCb3hSZWZyZXNoIHNvdXJjZSBvcHRpb24uXCIpO3RoaXMuX3NldFVwTGlzdGVuZXJzKCksdGhpcy5sb2FkKCl9O2YucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oKXt0aGlzLl9hZGRPdmVybGF5KCksdGhpcy5vcHRpb25zLm9uTG9hZFN0YXJ0LmNhbGwoYSh0aGlzKSksYS5nZXQodGhpcy5vcHRpb25zLnNvdXJjZSx0aGlzLm9wdGlvbnMucGFyYW1zLGZ1bmN0aW9uKGIpe3RoaXMub3B0aW9ucy5sb2FkSW5Db250ZW50JiZhKHRoaXMuZWxlbWVudCkuZmluZCh0aGlzLm9wdGlvbnMuY29udGVudCkuaHRtbChiKSx0aGlzLm9wdGlvbnMub25Mb2FkRG9uZS5jYWxsKGEodGhpcyksYiksdGhpcy5fcmVtb3ZlT3ZlcmxheSgpfS5iaW5kKHRoaXMpLFwiXCIhPT10aGlzLm9wdGlvbnMucmVzcG9uc2VUeXBlJiZ0aGlzLm9wdGlvbnMucmVzcG9uc2VUeXBlKX0sZi5wcm90b3R5cGUuX3NldFVwTGlzdGVuZXJzPWZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLm9uKFwiY2xpY2tcIix0aGlzLm9wdGlvbnMudHJpZ2dlcixmdW5jdGlvbihhKXthJiZhLnByZXZlbnREZWZhdWx0KCksdGhpcy5sb2FkKCl9LmJpbmQodGhpcykpfSxmLnByb3RvdHlwZS5fYWRkT3ZlcmxheT1mdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy4kb3ZlcmxheSl9LGYucHJvdG90eXBlLl9yZW1vdmVPdmVybGF5PWZ1bmN0aW9uKCl7YSh0aGlzLiRvdmVybGF5KS5yZW1vdmUoKX07dmFyIGc9YS5mbi5ib3hSZWZyZXNoO2EuZm4uYm94UmVmcmVzaD1iLGEuZm4uYm94UmVmcmVzaC5Db25zdHJ1Y3Rvcj1mLGEuZm4uYm94UmVmcmVzaC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uYm94UmVmcmVzaD1nLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoZS5kYXRhKS5lYWNoKGZ1bmN0aW9uKCl7Yi5jYWxsKGEodGhpcykpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKGMpO2lmKCFmKXt2YXIgZz1hLmV4dGVuZCh7fSxkLGUuZGF0YSgpLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKTtlLmRhdGEoYyxmPW5ldyBoKGUsZykpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBiKXtpZih2b2lkIDA9PT1mW2JdKXRocm93IG5ldyBFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcIitiKTtmW2JdKCl9fSl9dmFyIGM9XCJsdGUuYm94d2lkZ2V0XCIsZD17YW5pbWF0aW9uU3BlZWQ6NTAwLGNvbGxhcHNlVHJpZ2dlcjonW2RhdGEtd2lkZ2V0PVwiY29sbGFwc2VcIl0nLHJlbW92ZVRyaWdnZXI6J1tkYXRhLXdpZGdldD1cInJlbW92ZVwiXScsY29sbGFwc2VJY29uOlwiZmEtbWludXNcIixleHBhbmRJY29uOlwiZmEtcGx1c1wiLHJlbW92ZUljb246XCJmYS10aW1lc1wifSxlPXtkYXRhOlwiLmJveFwiLGNvbGxhcHNlZDpcIi5jb2xsYXBzZWQtYm94XCIsaGVhZGVyOlwiLmJveC1oZWFkZXJcIixib2R5OlwiLmJveC1ib2R5XCIsZm9vdGVyOlwiLmJveC1mb290ZXJcIix0b29sczpcIi5ib3gtdG9vbHNcIn0sZj17Y29sbGFwc2VkOlwiY29sbGFwc2VkLWJveFwifSxnPXtjb2xsYXBzaW5nOlwiY29sbGFwc2luZy5ib3h3aWRnZXRcIixjb2xsYXBzZWQ6XCJjb2xsYXBzZWQuYm94d2lkZ2V0XCIsZXhwYW5kaW5nOlwiZXhwYW5kaW5nLmJveHdpZGdldFwiLGV4cGFuZGVkOlwiZXhwYW5kZWQuYm94d2lkZ2V0XCIscmVtb3Zpbmc6XCJyZW1vdmluZy5ib3h3aWRnZXRcIixyZW1vdmVkOlwicmVtb3ZlZC5ib3h3aWRnZXRcIn0saD1mdW5jdGlvbihhLGIpe3RoaXMuZWxlbWVudD1hLHRoaXMub3B0aW9ucz1iLHRoaXMuX3NldFVwTGlzdGVuZXJzKCl9O2gucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS5pcyhlLmNvbGxhcHNlZCk/dGhpcy5leHBhbmQoKTp0aGlzLmNvbGxhcHNlKCl9LGgucHJvdG90eXBlLmV4cGFuZD1mdW5jdGlvbigpe3ZhciBiPWEuRXZlbnQoZy5leHBhbmRlZCksYz1hLkV2ZW50KGcuZXhwYW5kaW5nKSxkPXRoaXMub3B0aW9ucy5jb2xsYXBzZUljb24saD10aGlzLm9wdGlvbnMuZXhwYW5kSWNvbjthKHRoaXMuZWxlbWVudCkucmVtb3ZlQ2xhc3MoZi5jb2xsYXBzZWQpLGEodGhpcy5lbGVtZW50KS5jaGlsZHJlbihlLmhlYWRlcitcIiwgXCIrZS5ib2R5K1wiLCBcIitlLmZvb3RlcikuY2hpbGRyZW4oZS50b29scykuZmluZChcIi5cIitoKS5yZW1vdmVDbGFzcyhoKS5hZGRDbGFzcyhkKSxhKHRoaXMuZWxlbWVudCkuY2hpbGRyZW4oZS5ib2R5K1wiLCBcIitlLmZvb3Rlcikuc2xpZGVEb3duKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCxmdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS50cmlnZ2VyKGIpfS5iaW5kKHRoaXMpKS50cmlnZ2VyKGMpfSxoLnByb3RvdHlwZS5jb2xsYXBzZT1mdW5jdGlvbigpe3ZhciBiPWEuRXZlbnQoZy5jb2xsYXBzZWQpLGM9KGEuRXZlbnQoZy5jb2xsYXBzaW5nKSx0aGlzLm9wdGlvbnMuY29sbGFwc2VJY29uKSxkPXRoaXMub3B0aW9ucy5leHBhbmRJY29uO2EodGhpcy5lbGVtZW50KS5jaGlsZHJlbihlLmhlYWRlcitcIiwgXCIrZS5ib2R5K1wiLCBcIitlLmZvb3RlcikuY2hpbGRyZW4oZS50b29scykuZmluZChcIi5cIitjKS5yZW1vdmVDbGFzcyhjKS5hZGRDbGFzcyhkKSxhKHRoaXMuZWxlbWVudCkuY2hpbGRyZW4oZS5ib2R5K1wiLCBcIitlLmZvb3Rlcikuc2xpZGVVcCh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkuYWRkQ2xhc3MoZi5jb2xsYXBzZWQpLGEodGhpcy5lbGVtZW50KS50cmlnZ2VyKGIpfS5iaW5kKHRoaXMpKS50cmlnZ2VyKGV4cGFuZGluZ0V2ZW50KX0saC5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKCl7dmFyIGI9YS5FdmVudChnLnJlbW92ZWQpLGM9YS5FdmVudChnLnJlbW92aW5nKTthKHRoaXMuZWxlbWVudCkuc2xpZGVVcCh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQsZnVuY3Rpb24oKXthKHRoaXMuZWxlbWVudCkudHJpZ2dlcihiKSxhKHRoaXMuZWxlbWVudCkucmVtb3ZlKCl9LmJpbmQodGhpcykpLnRyaWdnZXIoYyl9LGgucHJvdG90eXBlLl9zZXRVcExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7YSh0aGlzLmVsZW1lbnQpLm9uKFwiY2xpY2tcIix0aGlzLm9wdGlvbnMuY29sbGFwc2VUcmlnZ2VyLGZ1bmN0aW9uKGMpe3JldHVybiBjJiZjLnByZXZlbnREZWZhdWx0KCksYi50b2dnbGUoYSh0aGlzKSksITF9KSxhKHRoaXMuZWxlbWVudCkub24oXCJjbGlja1wiLHRoaXMub3B0aW9ucy5yZW1vdmVUcmlnZ2VyLGZ1bmN0aW9uKGMpe3JldHVybiBjJiZjLnByZXZlbnREZWZhdWx0KCksYi5yZW1vdmUoYSh0aGlzKSksITF9KX07dmFyIGk9YS5mbi5ib3hXaWRnZXQ7YS5mbi5ib3hXaWRnZXQ9YixhLmZuLmJveFdpZGdldC5Db25zdHJ1Y3Rvcj1oLGEuZm4uYm94V2lkZ2V0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi5ib3hXaWRnZXQ9aSx0aGlzfSxhKHdpbmRvdykub24oXCJsb2FkXCIsZnVuY3Rpb24oKXthKGUuZGF0YSkuZWFjaChmdW5jdGlvbigpe2IuY2FsbChhKHRoaXMpKX0pfSl9KGpRdWVyeSksZnVuY3Rpb24oYSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9YSh0aGlzKSxmPWUuZGF0YShjKTtpZighZil7dmFyIGc9YS5leHRlbmQoe30sZCxlLmRhdGEoKSxcIm9iamVjdFwiPT10eXBlb2YgYiYmYik7ZS5kYXRhKGMsZj1uZXcgaChlLGcpKX1cInN0cmluZ1wiPT10eXBlb2YgYiYmZi50b2dnbGUoKX0pfXZhciBjPVwibHRlLmNvbnRyb2xzaWRlYmFyXCIsZD17c2xpZGU6ITB9LGU9e3NpZGViYXI6XCIuY29udHJvbC1zaWRlYmFyXCIsZGF0YTonW2RhdGEtdG9nZ2xlPVwiY29udHJvbC1zaWRlYmFyXCJdJyxvcGVuOlwiLmNvbnRyb2wtc2lkZWJhci1vcGVuXCIsYmc6XCIuY29udHJvbC1zaWRlYmFyLWJnXCIsd3JhcHBlcjpcIi53cmFwcGVyXCIsY29udGVudDpcIi5jb250ZW50LXdyYXBwZXJcIixib3hlZDpcIi5sYXlvdXQtYm94ZWRcIn0sZj17b3BlbjpcImNvbnRyb2wtc2lkZWJhci1vcGVuXCIsZml4ZWQ6XCJmaXhlZFwifSxnPXtjb2xsYXBzZWQ6XCJjb2xsYXBzZWQuY29udHJvbHNpZGViYXJcIixleHBhbmRlZDpcImV4cGFuZGVkLmNvbnRyb2xzaWRlYmFyXCJ9LGg9ZnVuY3Rpb24oYSxiKXt0aGlzLmVsZW1lbnQ9YSx0aGlzLm9wdGlvbnM9Yix0aGlzLmhhc0JpbmRlZFJlc2l6ZT0hMSx0aGlzLmluaXQoKX07aC5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe2EodGhpcy5lbGVtZW50KS5pcyhlLmRhdGEpfHxhKHRoaXMpLm9uKFwiY2xpY2tcIix0aGlzLnRvZ2dsZSksdGhpcy5maXgoKSxhKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7dGhpcy5maXgoKX0uYmluZCh0aGlzKSl9LGgucHJvdG90eXBlLnRvZ2dsZT1mdW5jdGlvbihiKXtiJiZiLnByZXZlbnREZWZhdWx0KCksdGhpcy5maXgoKSxhKGUuc2lkZWJhcikuaXMoZS5vcGVuKXx8YShcImJvZHlcIikuaXMoZS5vcGVuKT90aGlzLmNvbGxhcHNlKCk6dGhpcy5leHBhbmQoKX0saC5wcm90b3R5cGUuZXhwYW5kPWZ1bmN0aW9uKCl7dGhpcy5vcHRpb25zLnNsaWRlP2EoZS5zaWRlYmFyKS5hZGRDbGFzcyhmLm9wZW4pOmEoXCJib2R5XCIpLmFkZENsYXNzKGYub3BlbiksYSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoYS5FdmVudChnLmV4cGFuZGVkKSl9LGgucHJvdG90eXBlLmNvbGxhcHNlPWZ1bmN0aW9uKCl7YShcImJvZHksIFwiK2Uuc2lkZWJhcikucmVtb3ZlQ2xhc3MoZi5vcGVuKSxhKHRoaXMuZWxlbWVudCkudHJpZ2dlcihhLkV2ZW50KGcuY29sbGFwc2VkKSl9LGgucHJvdG90eXBlLmZpeD1mdW5jdGlvbigpe2EoXCJib2R5XCIpLmlzKGUuYm94ZWQpJiZ0aGlzLl9maXhGb3JCb3hlZChhKGUuYmcpKX0saC5wcm90b3R5cGUuX2ZpeEZvckJveGVkPWZ1bmN0aW9uKGIpe2IuY3NzKHtwb3NpdGlvbjpcImFic29sdXRlXCIsaGVpZ2h0OmEoZS53cmFwcGVyKS5oZWlnaHQoKX0pfTt2YXIgaT1hLmZuLmNvbnRyb2xTaWRlYmFyO2EuZm4uY29udHJvbFNpZGViYXI9YixhLmZuLmNvbnRyb2xTaWRlYmFyLkNvbnN0cnVjdG9yPWgsYS5mbi5jb250cm9sU2lkZWJhci5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4uY29udHJvbFNpZGViYXI9aSx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrXCIsZS5kYXRhLGZ1bmN0aW9uKGMpe2MmJmMucHJldmVudERlZmF1bHQoKSxiLmNhbGwoYSh0aGlzKSxcInRvZ2dsZVwiKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBkPWEodGhpcyksZT1kLmRhdGEoYyk7ZXx8ZC5kYXRhKGMsZT1uZXcgZihkKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmUudG9nZ2xlKGQpfSl9dmFyIGM9XCJsdGUuZGlyZWN0Y2hhdFwiLGQ9e2RhdGE6J1tkYXRhLXdpZGdldD1cImNoYXQtcGFuZS10b2dnbGVcIl0nLGJveDpcIi5kaXJlY3QtY2hhdFwifSxlPXtvcGVuOlwiZGlyZWN0LWNoYXQtY29udGFjdHMtb3BlblwifSxmPWZ1bmN0aW9uKGEpe3RoaXMuZWxlbWVudD1hfTtmLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYSl7YS5wYXJlbnRzKGQuYm94KS5maXJzdCgpLnRvZ2dsZUNsYXNzKGUub3Blbil9O3ZhciBnPWEuZm4uZGlyZWN0Q2hhdDthLmZuLmRpcmVjdENoYXQ9YixhLmZuLmRpcmVjdENoYXQuQ29uc3RydWN0b3I9ZixhLmZuLmRpcmVjdENoYXQubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBhLmZuLmRpcmVjdENoYXQ9Zyx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrXCIsZC5kYXRhLGZ1bmN0aW9uKGMpe2MmJmMucHJldmVudERlZmF1bHQoKSxiLmNhbGwoYSh0aGlzKSxcInRvZ2dsZVwiKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBoPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGcoaCkpfWlmKFwic3RyaW5nXCI9PXR5cGVvZiBiKXtpZih2b2lkIDA9PT1mW2JdKXRocm93IG5ldyBFcnJvcihcIk5vIG1ldGhvZCBuYW1lZCBcIitiKTtmW2JdKCl9fSl9dmFyIGM9XCJsdGUubGF5b3V0XCIsZD17c2xpbXNjcm9sbDohMCxyZXNldEhlaWdodDohMH0sZT17d3JhcHBlcjpcIi53cmFwcGVyXCIsY29udGVudFdyYXBwZXI6XCIuY29udGVudC13cmFwcGVyXCIsbGF5b3V0Qm94ZWQ6XCIubGF5b3V0LWJveGVkXCIsbWFpbkZvb3RlcjpcIi5tYWluLWZvb3RlclwiLG1haW5IZWFkZXI6XCIubWFpbi1oZWFkZXJcIixzaWRlYmFyOlwiLnNpZGViYXJcIixjb250cm9sU2lkZWJhcjpcIi5jb250cm9sLXNpZGViYXJcIixmaXhlZDpcIi5maXhlZFwiLHNpZGViYXJNZW51OlwiLnNpZGViYXItbWVudVwiLGxvZ286XCIubWFpbi1oZWFkZXIgLmxvZ29cIn0sZj17Zml4ZWQ6XCJmaXhlZFwiLGhvbGRUcmFuc2l0aW9uOlwiaG9sZC10cmFuc2l0aW9uXCJ9LGc9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zPWEsdGhpcy5iaW5kZWRSZXNpemU9ITEsdGhpcy5hY3RpdmF0ZSgpfTtnLnByb3RvdHlwZS5hY3RpdmF0ZT1mdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCksYShcImJvZHlcIikucmVtb3ZlQ2xhc3MoZi5ob2xkVHJhbnNpdGlvbiksdGhpcy5vcHRpb25zLnJlc2V0SGVpZ2h0JiZhKFwiYm9keSwgaHRtbCwgXCIrZS53cmFwcGVyKS5jc3Moe2hlaWdodDpcImF1dG9cIixcIm1pbi1oZWlnaHRcIjpcIjEwMCVcIn0pLHRoaXMuYmluZGVkUmVzaXplfHwoYSh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe3RoaXMuZml4KCksdGhpcy5maXhTaWRlYmFyKCksYShlLmxvZ28rXCIsIFwiK2Uuc2lkZWJhcikub25lKFwid2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZFwiLGZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKX0uYmluZCh0aGlzKSl9LmJpbmQodGhpcykpLHRoaXMuYmluZGVkUmVzaXplPSEwKSxhKGUuc2lkZWJhck1lbnUpLm9uKFwiZXhwYW5kZWQudHJlZVwiLGZ1bmN0aW9uKCl7dGhpcy5maXgoKSx0aGlzLmZpeFNpZGViYXIoKX0uYmluZCh0aGlzKSksYShlLnNpZGViYXJNZW51KS5vbihcImNvbGxhcHNlZC50cmVlXCIsZnVuY3Rpb24oKXt0aGlzLmZpeCgpLHRoaXMuZml4U2lkZWJhcigpfS5iaW5kKHRoaXMpKX0sZy5wcm90b3R5cGUuZml4PWZ1bmN0aW9uKCl7YShlLmxheW91dEJveGVkK1wiID4gXCIrZS53cmFwcGVyKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpO3ZhciBiPWEoZS5tYWluRm9vdGVyKS5vdXRlckhlaWdodCgpfHwwLGM9YShlLm1haW5IZWFkZXIpLm91dGVySGVpZ2h0KCl8fDAsZD1jK2IsZz1hKHdpbmRvdykuaGVpZ2h0KCksaD1hKGUuc2lkZWJhcikuaGVpZ2h0KCl8fDA7aWYoYShcImJvZHlcIikuaGFzQ2xhc3MoZi5maXhlZCkpYShlLmNvbnRlbnRXcmFwcGVyKS5jc3MoXCJtaW4taGVpZ2h0XCIsZy1iKTtlbHNle3ZhciBpO2c+PWgrYz8oYShlLmNvbnRlbnRXcmFwcGVyKS5jc3MoXCJtaW4taGVpZ2h0XCIsZy1kKSxpPWctZCk6KGEoZS5jb250ZW50V3JhcHBlcikuY3NzKFwibWluLWhlaWdodFwiLGgpLGk9aCk7dmFyIGo9YShlLmNvbnRyb2xTaWRlYmFyKTt2b2lkIDAhPT1qJiZqLmhlaWdodCgpPmkmJmEoZS5jb250ZW50V3JhcHBlcikuY3NzKFwibWluLWhlaWdodFwiLGouaGVpZ2h0KCkpfX0sZy5wcm90b3R5cGUuZml4U2lkZWJhcj1mdW5jdGlvbigpe2lmKCFhKFwiYm9keVwiKS5oYXNDbGFzcyhmLmZpeGVkKSlyZXR1cm4gdm9pZCh2b2lkIDAhPT1hLmZuLnNsaW1TY3JvbGwmJmEoZS5zaWRlYmFyKS5zbGltU2Nyb2xsKHtkZXN0cm95OiEwfSkuaGVpZ2h0KFwiYXV0b1wiKSk7dGhpcy5vcHRpb25zLnNsaW1zY3JvbGwmJnZvaWQgMCE9PWEuZm4uc2xpbVNjcm9sbCYmYShlLnNpZGViYXIpLnNsaW1TY3JvbGwoe2hlaWdodDphKHdpbmRvdykuaGVpZ2h0KCktYShlLm1haW5IZWFkZXIpLmhlaWdodCgpK1wicHhcIn0pfTt2YXIgaD1hLmZuLmxheW91dDthLmZuLmxheW91dD1iLGEuZm4ubGF5b3V0LkNvbnN0dWN0b3I9ZyxhLmZuLmxheW91dC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4ubGF5b3V0PWgsdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7Yi5jYWxsKGEoXCJib2R5XCIpKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBnPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGgoZykpfVwidG9nZ2xlXCI9PT1iJiZmLnRvZ2dsZSgpfSl9dmFyIGM9XCJsdGUucHVzaG1lbnVcIixkPXtjb2xsYXBzZVNjcmVlblNpemU6NzY3LGV4cGFuZE9uSG92ZXI6ITEsZXhwYW5kVHJhbnNpdGlvbkRlbGF5OjIwMH0sZT17Y29sbGFwc2VkOlwiLnNpZGViYXItY29sbGFwc2VcIixvcGVuOlwiLnNpZGViYXItb3BlblwiLG1haW5TaWRlYmFyOlwiLm1haW4tc2lkZWJhclwiLGNvbnRlbnRXcmFwcGVyOlwiLmNvbnRlbnQtd3JhcHBlclwiLHNlYXJjaElucHV0OlwiLnNpZGViYXItZm9ybSAuZm9ybS1jb250cm9sXCIsYnV0dG9uOidbZGF0YS10b2dnbGU9XCJwdXNoLW1lbnVcIl0nLG1pbmk6XCIuc2lkZWJhci1taW5pXCIsZXhwYW5kZWQ6XCIuc2lkZWJhci1leHBhbmRlZC1vbi1ob3ZlclwiLGxheW91dEZpeGVkOlwiLmZpeGVkXCJ9LGY9e2NvbGxhcHNlZDpcInNpZGViYXItY29sbGFwc2VcIixvcGVuOlwic2lkZWJhci1vcGVuXCIsbWluaTpcInNpZGViYXItbWluaVwiLGV4cGFuZGVkOlwic2lkZWJhci1leHBhbmRlZC1vbi1ob3ZlclwiLGV4cGFuZEZlYXR1cmU6XCJzaWRlYmFyLW1pbmktZXhwYW5kLWZlYXR1cmVcIixsYXlvdXRGaXhlZDpcImZpeGVkXCJ9LGc9e2V4cGFuZGVkOlwiZXhwYW5kZWQucHVzaE1lbnVcIixjb2xsYXBzZWQ6XCJjb2xsYXBzZWQucHVzaE1lbnVcIn0saD1mdW5jdGlvbihhKXt0aGlzLm9wdGlvbnM9YSx0aGlzLmluaXQoKX07aC5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpeyh0aGlzLm9wdGlvbnMuZXhwYW5kT25Ib3Zlcnx8YShcImJvZHlcIikuaXMoZS5taW5pK2UubGF5b3V0Rml4ZWQpKSYmKHRoaXMuZXhwYW5kT25Ib3ZlcigpLGEoXCJib2R5XCIpLmFkZENsYXNzKGYuZXhwYW5kRmVhdHVyZSkpLGEoZS5jb250ZW50V3JhcHBlcikuY2xpY2soZnVuY3Rpb24oKXthKHdpbmRvdykud2lkdGgoKTw9dGhpcy5vcHRpb25zLmNvbGxhcHNlU2NyZWVuU2l6ZSYmYShcImJvZHlcIikuaGFzQ2xhc3MoZi5vcGVuKSYmdGhpcy5jbG9zZSgpfS5iaW5kKHRoaXMpKSxhKGUuc2VhcmNoSW5wdXQpLmNsaWNrKGZ1bmN0aW9uKGEpe2Euc3RvcFByb3BhZ2F0aW9uKCl9KX0saC5wcm90b3R5cGUudG9nZ2xlPWZ1bmN0aW9uKCl7dmFyIGI9YSh3aW5kb3cpLndpZHRoKCksYz0hYShcImJvZHlcIikuaGFzQ2xhc3MoZi5jb2xsYXBzZWQpO2I8PXRoaXMub3B0aW9ucy5jb2xsYXBzZVNjcmVlblNpemUmJihjPWEoXCJib2R5XCIpLmhhc0NsYXNzKGYub3BlbikpLGM/dGhpcy5jbG9zZSgpOnRoaXMub3BlbigpfSxoLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKCl7YSh3aW5kb3cpLndpZHRoKCk+dGhpcy5vcHRpb25zLmNvbGxhcHNlU2NyZWVuU2l6ZT9hKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhmLmNvbGxhcHNlZCkudHJpZ2dlcihhLkV2ZW50KGcuZXhwYW5kZWQpKTphKFwiYm9keVwiKS5hZGRDbGFzcyhmLm9wZW4pLnRyaWdnZXIoYS5FdmVudChnLmV4cGFuZGVkKSl9LGgucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7YSh3aW5kb3cpLndpZHRoKCk+dGhpcy5vcHRpb25zLmNvbGxhcHNlU2NyZWVuU2l6ZT9hKFwiYm9keVwiKS5hZGRDbGFzcyhmLmNvbGxhcHNlZCkudHJpZ2dlcihhLkV2ZW50KGcuY29sbGFwc2VkKSk6YShcImJvZHlcIikucmVtb3ZlQ2xhc3MoZi5vcGVuK1wiIFwiK2YuY29sbGFwc2VkKS50cmlnZ2VyKGEuRXZlbnQoZy5jb2xsYXBzZWQpKX0saC5wcm90b3R5cGUuZXhwYW5kT25Ib3Zlcj1mdW5jdGlvbigpe2EoZS5tYWluU2lkZWJhcikuaG92ZXIoZnVuY3Rpb24oKXthKFwiYm9keVwiKS5pcyhlLm1pbmkrZS5jb2xsYXBzZWQpJiZhKHdpbmRvdykud2lkdGgoKT50aGlzLm9wdGlvbnMuY29sbGFwc2VTY3JlZW5TaXplJiZ0aGlzLmV4cGFuZCgpfS5iaW5kKHRoaXMpLGZ1bmN0aW9uKCl7YShcImJvZHlcIikuaXMoZS5leHBhbmRlZCkmJnRoaXMuY29sbGFwc2UoKX0uYmluZCh0aGlzKSl9LGgucHJvdG90eXBlLmV4cGFuZD1mdW5jdGlvbigpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXthKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhmLmNvbGxhcHNlZCkuYWRkQ2xhc3MoZi5leHBhbmRlZCl9LHRoaXMub3B0aW9ucy5leHBhbmRUcmFuc2l0aW9uRGVsYXkpfSxoLnByb3RvdHlwZS5jb2xsYXBzZT1mdW5jdGlvbigpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXthKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhmLmV4cGFuZGVkKS5hZGRDbGFzcyhmLmNvbGxhcHNlZCl9LHRoaXMub3B0aW9ucy5leHBhbmRUcmFuc2l0aW9uRGVsYXkpfTt2YXIgaT1hLmZuLnB1c2hNZW51O2EuZm4ucHVzaE1lbnU9YixhLmZuLnB1c2hNZW51LkNvbnN0cnVjdG9yPWgsYS5mbi5wdXNoTWVudS5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIGEuZm4ucHVzaE1lbnU9aSx0aGlzfSxhKGRvY3VtZW50KS5vbihcImNsaWNrXCIsZS5idXR0b24sZnVuY3Rpb24oYyl7Yy5wcmV2ZW50RGVmYXVsdCgpLGIuY2FsbChhKHRoaXMpLFwidG9nZ2xlXCIpfSksYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7Yi5jYWxsKGEoZS5idXR0b24pKX0pfShqUXVlcnkpLGZ1bmN0aW9uKGEpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGIoYil7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBlPWEodGhpcyksZj1lLmRhdGEoYyk7aWYoIWYpe3ZhciBoPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLGY9bmV3IGcoZSxoKSl9aWYoXCJzdHJpbmdcIj09dHlwZW9mIGYpe2lmKHZvaWQgMD09PWZbYl0pdGhyb3cgbmV3IEVycm9yKFwiTm8gbWV0aG9kIG5hbWVkIFwiK2IpO2ZbYl0oKX19KX12YXIgYz1cImx0ZS50b2RvbGlzdFwiLGQ9e29uQ2hlY2s6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9LG9uVW5DaGVjazpmdW5jdGlvbihhKXtyZXR1cm4gYX19LGU9e2RhdGE6J1tkYXRhLXdpZGdldD1cInRvZG8tbGlzdFwiXSd9LGY9e2RvbmU6XCJkb25lXCJ9LGc9ZnVuY3Rpb24oYSxiKXt0aGlzLmVsZW1lbnQ9YSx0aGlzLm9wdGlvbnM9Yix0aGlzLl9zZXRVcExpc3RlbmVycygpfTtnLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYSl7aWYoYS5wYXJlbnRzKGUubGkpLmZpcnN0KCkudG9nZ2xlQ2xhc3MoZi5kb25lKSwhYS5wcm9wKFwiY2hlY2tlZFwiKSlyZXR1cm4gdm9pZCB0aGlzLnVuQ2hlY2soYSk7dGhpcy5jaGVjayhhKX0sZy5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zLm9uQ2hlY2suY2FsbChhKX0sZy5wcm90b3R5cGUudW5DaGVjaz1mdW5jdGlvbihhKXt0aGlzLm9wdGlvbnMub25VbkNoZWNrLmNhbGwoYSl9LGcucHJvdG90eXBlLl9zZXRVcExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciBiPXRoaXM7YSh0aGlzLmVsZW1lbnQpLm9uKFwiY2hhbmdlIGlmQ2hhbmdlZFwiLFwiaW5wdXQ6Y2hlY2tib3hcIixmdW5jdGlvbigpe2IudG9nZ2xlKGEodGhpcykpfSl9O3ZhciBoPWEuZm4udG9kb0xpc3Q7YS5mbi50b2RvTGlzdD1iLGEuZm4udG9kb0xpc3QuQ29uc3RydWN0b3I9ZyxhLmZuLnRvZG9MaXN0Lm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi50b2RvTGlzdD1oLHRoaXN9LGEod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe2EoZS5kYXRhKS5lYWNoKGZ1bmN0aW9uKCl7Yi5jYWxsKGEodGhpcykpfSl9KX0oalF1ZXJ5KSxmdW5jdGlvbihhKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpO2lmKCFlLmRhdGEoYykpe3ZhciBmPWEuZXh0ZW5kKHt9LGQsZS5kYXRhKCksXCJvYmplY3RcIj09dHlwZW9mIGImJmIpO2UuZGF0YShjLG5ldyBoKGUsZikpfX0pfXZhciBjPVwibHRlLnRyZWVcIixkPXthbmltYXRpb25TcGVlZDo1MDAsYWNjb3JkaW9uOiEwLGZvbGxvd0xpbms6ITEsdHJpZ2dlcjpcIi50cmVldmlldyBhXCJ9LGU9e3RyZWU6XCIudHJlZVwiLHRyZWV2aWV3OlwiLnRyZWV2aWV3XCIsdHJlZXZpZXdNZW51OlwiLnRyZWV2aWV3LW1lbnVcIixvcGVuOlwiLm1lbnUtb3BlbiwgLmFjdGl2ZVwiLGxpOlwibGlcIixkYXRhOidbZGF0YS13aWRnZXQ9XCJ0cmVlXCJdJyxhY3RpdmU6XCIuYWN0aXZlXCJ9LGY9e29wZW46XCJtZW51LW9wZW5cIix0cmVlOlwidHJlZVwifSxnPXtjb2xsYXBzZWQ6XCJjb2xsYXBzZWQudHJlZVwiLGV4cGFuZGVkOlwiZXhwYW5kZWQudHJlZVwifSxoPWZ1bmN0aW9uKGIsYyl7dGhpcy5lbGVtZW50PWIsdGhpcy5vcHRpb25zPWMsYSh0aGlzLmVsZW1lbnQpLmFkZENsYXNzKGYudHJlZSksYShlLnRyZWV2aWV3K2UuYWN0aXZlLHRoaXMuZWxlbWVudCkuYWRkQ2xhc3MoZi5vcGVuKSx0aGlzLl9zZXRVcExpc3RlbmVycygpfTtoLnByb3RvdHlwZS50b2dnbGU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLm5leHQoZS50cmVldmlld01lbnUpLGQ9YS5wYXJlbnQoKSxnPWQuaGFzQ2xhc3MoZi5vcGVuKTtkLmlzKGUudHJlZXZpZXcpJiYodGhpcy5vcHRpb25zLmZvbGxvd0xpbmsmJlwiI1wiIT09YS5hdHRyKFwiaHJlZlwiKXx8Yi5wcmV2ZW50RGVmYXVsdCgpLGc/dGhpcy5jb2xsYXBzZShjLGQpOnRoaXMuZXhwYW5kKGMsZCkpfSxoLnByb3RvdHlwZS5leHBhbmQ9ZnVuY3Rpb24oYixjKXt2YXIgZD1hLkV2ZW50KGcuZXhwYW5kZWQpO2lmKHRoaXMub3B0aW9ucy5hY2NvcmRpb24pe3ZhciBoPWMuc2libGluZ3MoZS5vcGVuKSxpPWguY2hpbGRyZW4oZS50cmVldmlld01lbnUpO3RoaXMuY29sbGFwc2UoaSxoKX1jLmFkZENsYXNzKGYub3BlbiksYi5zbGlkZURvd24odGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoZCl9LmJpbmQodGhpcykpfSxoLnByb3RvdHlwZS5jb2xsYXBzZT1mdW5jdGlvbihiLGMpe3ZhciBkPWEuRXZlbnQoZy5jb2xsYXBzZWQpO2MucmVtb3ZlQ2xhc3MoZi5vcGVuKSxiLnNsaWRlVXAodGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkLGZ1bmN0aW9uKCl7YSh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoZCl9LmJpbmQodGhpcykpfSxoLnByb3RvdHlwZS5fc2V0VXBMaXN0ZW5lcnM9ZnVuY3Rpb24oKXt2YXIgYj10aGlzO2EodGhpcy5lbGVtZW50KS5vbihcImNsaWNrXCIsdGhpcy5vcHRpb25zLnRyaWdnZXIsZnVuY3Rpb24oYyl7Yi50b2dnbGUoYSh0aGlzKSxjKX0pfTt2YXIgaT1hLmZuLnRyZWU7YS5mbi50cmVlPWIsYS5mbi50cmVlLkNvbnN0cnVjdG9yPWgsYS5mbi50cmVlLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gYS5mbi50cmVlPWksdGhpc30sYSh3aW5kb3cpLm9uKFwibG9hZFwiLGZ1bmN0aW9uKCl7YShlLmRhdGEpLmVhY2goZnVuY3Rpb24oKXtiLmNhbGwoYSh0aGlzKSl9KX0pfShqUXVlcnkpOyIsIi8qXG4gKiBXZWxjb21lIHRvIHlvdXIgYXBwJ3MgbWFpbiBKYXZhU2NyaXB0IGZpbGUhXG4gKlxuICogV2UgcmVjb21tZW5kIGluY2x1ZGluZyB0aGUgYnVpbHQgdmVyc2lvbiBvZiB0aGlzIEphdmFTY3JpcHQgZmlsZVxuICogKGFuZCBpdHMgQ1NTIGZpbGUpIGluIHlvdXIgYmFzZSBsYXlvdXQgKGJhc2UuaHRtbC50d2lnKS5cbiAqL1xuXG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAtZGF0ZXBpY2tlci9kaXN0L2Nzcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2ZvbnQtYXdlc29tZS9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvSW9uaWNvbnMvY3NzL2lvbmljb25zLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcC9kaXN0L2Nzcy9ib290c3RyYXAtdGhlbWUubWluLmNzcycpO1xucmVxdWlyZSgnLi4vcGx1Z2lucy9pQ2hlY2svYWxsLmNzcycpO1xucmVxdWlyZSgnLi4vZGlzdC9jc3MvQWRtaW5MVEUubWluLmNzcycpO1xucmVxdWlyZSgnLi4vZGlzdC9jc3MvYWx0L2FkbWlubHRlLmNvbXBvbmVudHMuY3NzJyk7XG5yZXF1aXJlKCcuLi9kaXN0L2Nzcy9hbHQvYWRtaW5sdGUuZXh0cmEtY29tcG9uZW50cy5jc3MnKTtcbnJlcXVpcmUoJy4uL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5wYWdlcy5jc3MnKTtcbnJlcXVpcmUoJy4uL2Rpc3QvY3NzL2FsdC9hZG1pbmx0ZS5wbHVnaW5zLmNzcycpO1xucmVxdWlyZSgnLi4vZGlzdC9jc3Mvc2tpbnMvc2tpbi1ibHVlLmNzcycpO1xucmVxdWlyZSgnLi4vY3NzL2FwcC5jc3MnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLm1pbi5qcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LmpzJyk7XG5yZXF1aXJlKCcuLi9ib3dlcl9jb21wb25lbnRzL0Zsb3QvanF1ZXJ5LmZsb3QudGltZS5qcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnJlc2l6ZS5qcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LnBpZS5qcycpO1xucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy9GbG90L2pxdWVyeS5mbG90LmNhdGVnb3JpZXMuanMnKTtcbnJlcXVpcmUoJy4uL2Jvd2VyX2NvbXBvbmVudHMvYm9vdHN0cmFwLWRhdGVwaWNrZXIvZGlzdC9qcy9ib290c3RyYXAtZGF0ZXBpY2tlci5taW4uanMnKTtcbnJlcXVpcmUoJy4uL3BsdWdpbnMvdGltZXBpY2tlci9ib290c3RyYXAtdGltZXBpY2tlci5taW4uanMnKTtcbnJlcXVpcmUoJy4uL3BsdWdpbnMvaUNoZWNrL2ljaGVjay5taW4uanMnKTtcbnJlcXVpcmUoJy4uL2Rpc3QvanMvYWRtaW5sdGUubWluLmpzJyk7XG5yZXF1aXJlKCcuLi9qcy9jdXN0b20uanMnKTtcblxuXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoZSkge1xuICAgICQoXCJsaS5jdXJyZW50X2FuY2VzdG9yIHVsXCIpLmNzcyh7ZGlzcGxheTogXCJibG9ja1wifSk7XG4gICAgJChcImxpLmN1cnJlbnRfYW5jZXN0b3JcIikuYWRkQ2xhc3MoXCJtZW51LW9wZW5cIik7XG5cbiAgICAkKFwiLmFkZEZvcm1Sb3dcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHRhYmxlID0gJCh0aGlzKS5wYXJlbnRzKCd0YWJsZScpO1xuICAgICAgICBsZXQgcm93cyA9ICQodGFibGUpLmZpbmQoJ3RyJykubGVuZ3RoO1xuICAgICAgICBsZXQgdHIgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuY2xvbmUoKTtcbiAgICAgICAgJCh0cikuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKGksIGUpIHtcbiAgICAgICAgICAgIGxldCBwcm90b3R5cGUgPSAkKGUpLmRhdGEoJ3Byb3RvdHlwZScpO1xuICAgICAgICAgICAgaWYgKHByb3RvdHlwZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IHByb3RvdHlwZS5yZXBsYWNlKC9fX25hbWVfXy9nLCByb3dzKTtcbiAgICAgICAgICAgICAgICAkKGUpLmh0bWwoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAkKHRyKS5hcHBlbmRUbyh0YWJsZSk7XG4gICAgICAgICQodHIpLmZpbmQoXCIuYWRkRm9ybVJvd1wiKS5yZW1vdmUoKTtcbiAgICAgICAgJCh0cikuZmluZChcIi5yZW1vdmVSb3dcIikuc2hvdygpO1xuICAgICAgICAkKHRyKS5maW5kKFwiLnJlbW92ZVJvd1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoXCIucmVtb3ZlUm93XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICQodGhpcykucGFyZW50cygndHInKS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1jaGFuZ2UtbGFiZWxdXCIpLmVhY2goKGksIGUpID0+IHtcbiAgICAgICAgbGV0IHBhcmVudE1vZGFsID0gJChlKS5wYXJlbnRzKCcubW9kYWwnKTtcblxuICAgICAgICBpZiAoJChlKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnZhbCgpKSB7XG4gICAgICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS10b2dnbGUtb249XCInICsgJChlKS5hdHRyKCduYW1lJykgKyAnXCJdJykuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChwYXJlbnRNb2RhbCkuZmluZCgnW2RhdGEtdG9nZ2xlLW9uPVwiJyArICQoZSkuYXR0cignbmFtZScpICsgJ1wiXScpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS1kZXBlbmRzPVwiJyArICQoZSkuYXR0cignbmFtZScpICsgJ1wiXScpLnRleHQoJChlKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKSk7XG4gICAgICAgICQoZSkuY2hhbmdlKChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCQoZSkuZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKSkge1xuICAgICAgICAgICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLXRvZ2dsZS1vbj1cIicgKyAkKGUpLmF0dHIoJ25hbWUnKSArICdcIl0nKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQocGFyZW50TW9kYWwpLmZpbmQoJ1tkYXRhLXRvZ2dsZS1vbj1cIicgKyAkKGUpLmF0dHIoJ25hbWUnKSArICdcIl0nKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHBhcmVudE1vZGFsKS5maW5kKCdbZGF0YS1kZXBlbmRzPVwiJyArICQoZSkuYXR0cignbmFtZScpICsgJ1wiXScpLnRleHQoJChlKS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKSk7XG4gICAgICAgIH0pXG5cbiAgICB9KTtcblxuICAgICQoXCJbZGF0YS1jb25maXJtXVwiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oJCh0aGlzKS5kYXRhKCdjb25maXJtJykpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAkKCdbZGF0YS1wYXJlbnRdJykuY2xpY2soZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IG1vZGFsID0gJCgkKHRoaXMpLmRhdGEoJ3RhcmdldCcpKTtcbiAgICAgICAgJChtb2RhbCkuZmluZCgnW25hbWU9XCInICsgJChtb2RhbCkuYXR0cignaWQnKSArICdbcGFyZW50X2lkXVwiXScpLnZhbCgkKHRoaXMpLmRhdGEoJ3BhcmVudCcpKTtcbiAgICB9KVxuXG4gICAgJChcIi5tb2RhbC5hcHBlbmRUb0NvbGxlY3Rpb25cIikub24oJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgbnIgPSAkKCdbZGF0YS1jb2xsZWN0aW9uPVwiJyArICQodGhpcykuZGF0YSgnYXBwZW5kJykgKyAnXCJdJykubGVuZ3RoO1xuICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0LHN1Ym1pdCxzZWxlY3Qsb3B0aW9uLHRleHRhcmVhJykuZWFjaChmdW5jdGlvbiAoaSwgZSkge1xuICAgICAgICAgICAgaWYgKCQoZSkuYXR0cignbmFtZScpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICQoZSkuYXR0cignbmFtZScsICQoZSkuYXR0cignbmFtZScpLnJlcGxhY2UoL19fbmFtZV9fL2csIG5yKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICAkKCdmb3JtLmFqYXgnKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YSh0aGlzKTtcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAkKHRoaXMpLmRhdGEoJ3ZhbGlkYXRlJyksXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5lcnJvciAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaWQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb2RhbCA9ICQoZm9ybSkucGFyZW50cygnLm1vZGFsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ID0gJCgnW2RhdGEtdGFyZ2V0PVwiIycgKyAkKG1vZGFsKS5hdHRyKFwiaWRcIikgKyAnXCJdJykucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5maW5kKCdzZWxlY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc2VsZWN0KS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5wcm9wKFwic2VsZWN0ZWRcIiwgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCc8b3B0aW9uIHZhbHVlPVwiJyArIGRhdGEuaWQgKyAnXCI+JyArIGRhdGEubGFiZWwgKyAnPC9vcHRpb24+JykuYXBwZW5kVG8oc2VsZWN0KS5wcm9wKFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKG1vZGFsKS5maW5kKCdbZGF0YS1kaXNtaXNzXScpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pXG5cbiAgICAkKFwiaW5wdXQ6ZmlsZVtkYXRhLXZhbGlkYXRlXVwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9ICQodGhpcykucGFyZW50cyhcImZvcm1cIik7XG4gICAgICAgIHZhciBtb2RhbCA9ICQodGhpcykucGFyZW50cyhcIi5tb2RhbFwiKTtcbiAgICAgICAgdmFyIGlucHV0cyA9ICQodGhpcykucGFyZW50cyhcIi5maWxlX3VwbG9hZFwiKS5maW5kKCdbZGF0YS1uYW1lXScpO1xuICAgICAgICBsZXQgZGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtWzBdKTtcbiAgICAgICAgbGV0IGRhdGEyID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICQoaW5wdXRzKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgaW5wdXQpIHtcbiAgICAgICAgICAgIGRhdGEyLmFwcGVuZCgkKGlucHV0KS5kYXRhKCduYW1lJyksIGRhdGEuZ2V0KGlucHV0Lm5hbWUpKTtcbiAgICAgICAgfSlcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAkKHRoaXMpLmRhdGEoJ3ZhbGlkYXRlJyksXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhOiBkYXRhMixcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3IgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWJsZSA9ICQobW9kYWwpLmZpbmQoJ3RhYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGFibGUpLmZpbmQoXCJ0clwiKS5lYWNoKChpLCBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGUpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiBkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByb3dzID0gJCh0YWJsZSkuZmluZCgndHInKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHIgPSAkKHRhYmxlKS5maW5kKCd0cicpLmZpcnN0KCkuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmFwcGVuZFRvKHRhYmxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoXCIuYWRkRm9ybVJvd1wiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoXCIucmVtb3ZlUm93XCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoXCIucmVtb3ZlUm93XCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb3RvdHlwZSA9ICQoZSkuZGF0YSgncHJvdG90eXBlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3RvdHlwZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBwcm90b3R5cGUucmVwbGFjZSgvX19uYW1lX18vZywgcm93cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZSkuaHRtbChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZCgnLnZhbHVlJykudmFsKGRhdGEuZGF0YVtpXS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKCcucmVsYXRlZF92YWx1ZV9YJykudmFsKGRhdGEuZGF0YVtpXS5yZWxhdGVkX3ZhbHVlX1gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0cikuZmluZCgnLnJlbGF0ZWRfdmFsdWVfWScpLnZhbChkYXRhLmRhdGFbaV0ucmVsYXRlZF92YWx1ZV9ZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodHIpLmZpbmQoJy5yZWxhdGVkX3ZhbHVlX1onKS52YWwoZGF0YS5kYXRhW2ldLnJlbGF0ZWRfdmFsdWVfWik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRyKS5maW5kKCcudGltZScpLnZhbChkYXRhLmRhdGFbaV0udGltZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtdG9nZ2xlPSdjaGFydCddXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGlkcyA9IFtdO1xuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5yZWNvcmRzJykuZmluZChcIltkYXRhLXRvZ2dsZT0nY2hhcnQnXVwiKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgICAgICAgICBpZiAoJChlKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgIGlkcy5wdXNoKCQoZSkuZGF0YSgncmVjb3JkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGRyYXdDaGFydCgkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpLCBpZHMpO1xuICAgIH0pXG5cbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpXG5cbn0pXG5cbiQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXS5taW5pbWFsLCBpbnB1dFt0eXBlPVwicmFkaW9cIl0ubWluaW1hbCcpLmlDaGVjayh7XG4gICAgY2hlY2tib3hDbGFzczogJ2ljaGVja2JveF9taW5pbWFsLWJsdWUnLFxuICAgIHJhZGlvQ2xhc3M6ICdpcmFkaW9fbWluaW1hbC1ibHVlJ1xufSlcblxuJCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdLmFwcGVuZC1ydW4nKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAkLmFqYXgoJCh0aGlzKS5kYXRhKCdsaW5rJyksIHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgZGF0YTogeydydW5faWQnOiAkKHRoaXMpLnZhbCgpfSxcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xuICAgICAgICB9XG4gICAgfSlcbn0pO1xuXG5mdW5jdGlvbiBkcmF3Q2hhcnQoZWxlbWVudCwgaWRzKSB7XG4gICAgdmFyIGRhdGEgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNvbWJvQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJChlbGVtZW50KS5hdHRyKCdpZCcpKSk7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgYmFyOiB7Z3JvdXBXaWR0aDogXCIxMDAlXCJ9LFxuICAgICAgICBzZXJpZXNUeXBlOiAnbGluZScsXG4gICAgICAgIHNlcmllczoge30sXG4gICAgICAgIGxlZ2VuZDoge3Bvc2l0aW9uOiAnYm90dG9tJ30sXG4gICAgICAgIHZBeGVzOiB7XG4gICAgICAgICAgICAwOiB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAtMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFqYXgoJChlbGVtZW50KS5kYXRhKCdkYXRhbGluaycpLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgZGF0YTogeydpZHMnOiBpZHN9LFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICh4aHIsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmICh4aHIucmVzcG9uc2VUZXh0ICE9ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudHMoJy5jaGFydC1ib3gnKS5maW5kKCcuYm94LWJvZHknKS5jb2xsYXBzZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICBsZXQganNvbiA9IHhoci5yZXNwb25zZUpTT047XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSBpbiBqc29uWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmFkZENvbHVtbihqc29uWzBdW2ldWzBdLCBqc29uWzBdW2ldWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zZXJpZXNbaSAtIDFdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllc1tpIC0gMV0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25bMF1baV1bM10gIT0gdW5kZWZpbmVkICYmIGpzb25bMF1baV1bM10gPT0gJ3ByZWNpcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zZXJpZXNbaSAtIDFdLnRhcmdldEF4aXNJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc2VyaWVzW2kgLSAxXS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzY2YmM0MCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zZXJpZXNbaSAtIDFdLnRhcmdldEF4aXNJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uWzBdW2ldWzJdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnNlcmllc1tpIC0gMV0udHlwZSA9IGpzb25bMF1baV1bMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuYWRkUm93cyhqc29uWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnBhcmVudHMoJy5jaGFydC1ib3gnKS5maW5kKCcuYm94LWJvZHknKS5jb2xsYXBzZSgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBjaGFydC5jbGVhckNoYXJ0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbn1cblxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLyohIGlDaGVjayB2MS4wLjEgYnkgRGFtaXIgU3VsdGFub3YsIGh0dHA6Ly9naXQuaW8vYXJsemVBLCBNSVQgTGljZW5zZWQgKi9cbihmdW5jdGlvbihoKXtmdW5jdGlvbiBGKGEsYixkKXt2YXIgYz1hWzBdLGU9L2VyLy50ZXN0KGQpP206L2JsLy50ZXN0KGQpP3M6bCxmPWQ9PUg/e2NoZWNrZWQ6Y1tsXSxkaXNhYmxlZDpjW3NdLGluZGV0ZXJtaW5hdGU6XCJ0cnVlXCI9PWEuYXR0cihtKXx8XCJmYWxzZVwiPT1hLmF0dHIodyl9OmNbZV07aWYoL14oY2h8ZGl8aW4pLy50ZXN0KGQpJiYhZilEKGEsZSk7ZWxzZSBpZigvXih1bnxlbnxkZSkvLnRlc3QoZCkmJmYpdChhLGUpO2Vsc2UgaWYoZD09SClmb3IoZSBpbiBmKWZbZV0/RChhLGUsITApOnQoYSxlLCEwKTtlbHNlIGlmKCFifHxcInRvZ2dsZVwiPT1kKXtpZighYilhW3BdKFwiaWZDbGlja2VkXCIpO2Y/Y1tuXSE9PXUmJnQoYSxlKTpEKGEsZSl9fWZ1bmN0aW9uIEQoYSxiLGQpe3ZhciBjPWFbMF0sZT1hLnBhcmVudCgpLGY9Yj09bCxBPWI9PW0sQj1iPT1zLEs9QT93OmY/RTpcImVuYWJsZWRcIixwPWsoYSxLK3goY1tuXSkpLE49ayhhLGIreChjW25dKSk7aWYoITAhPT1jW2JdKXtpZighZCYmXG5iPT1sJiZjW25dPT11JiZjLm5hbWUpe3ZhciBDPWEuY2xvc2VzdChcImZvcm1cIikscj0naW5wdXRbbmFtZT1cIicrYy5uYW1lKydcIl0nLHI9Qy5sZW5ndGg/Qy5maW5kKHIpOmgocik7ci5lYWNoKGZ1bmN0aW9uKCl7dGhpcyE9PWMmJmgodGhpcykuZGF0YShxKSYmdChoKHRoaXMpLGIpfSl9QT8oY1tiXT0hMCxjW2xdJiZ0KGEsbCxcImZvcmNlXCIpKTooZHx8KGNbYl09ITApLGYmJmNbbV0mJnQoYSxtLCExKSk7TChhLGYsYixkKX1jW3NdJiZrKGEseSwhMCkmJmUuZmluZChcIi5cIitJKS5jc3MoeSxcImRlZmF1bHRcIik7ZVt2XShOfHxrKGEsYil8fFwiXCIpO0I/ZS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwidHJ1ZVwiKTplLmF0dHIoXCJhcmlhLWNoZWNrZWRcIixBP1wibWl4ZWRcIjpcInRydWVcIik7ZVt6XShwfHxrKGEsSyl8fFwiXCIpfWZ1bmN0aW9uIHQoYSxiLGQpe3ZhciBjPWFbMF0sZT1hLnBhcmVudCgpLGY9Yj09bCxoPWI9PW0scT1iPT1zLHA9aD93OmY/RTpcImVuYWJsZWRcIix0PWsoYSxwK3goY1tuXSkpLFxudT1rKGEsYit4KGNbbl0pKTtpZighMSE9PWNbYl0pe2lmKGh8fCFkfHxcImZvcmNlXCI9PWQpY1tiXT0hMTtMKGEsZixwLGQpfSFjW3NdJiZrKGEseSwhMCkmJmUuZmluZChcIi5cIitJKS5jc3MoeSxcInBvaW50ZXJcIik7ZVt6XSh1fHxrKGEsYil8fFwiXCIpO3E/ZS5hdHRyKFwiYXJpYS1kaXNhYmxlZFwiLFwiZmFsc2VcIik6ZS5hdHRyKFwiYXJpYS1jaGVja2VkXCIsXCJmYWxzZVwiKTtlW3ZdKHR8fGsoYSxwKXx8XCJcIil9ZnVuY3Rpb24gTShhLGIpe2lmKGEuZGF0YShxKSl7YS5wYXJlbnQoKS5odG1sKGEuYXR0cihcInN0eWxlXCIsYS5kYXRhKHEpLnN8fFwiXCIpKTtpZihiKWFbcF0oYik7YS5vZmYoXCIuaVwiKS51bndyYXAoKTtoKEcrJ1tmb3I9XCInK2FbMF0uaWQrJ1wiXScpLmFkZChhLmNsb3Nlc3QoRykpLm9mZihcIi5pXCIpfX1mdW5jdGlvbiBrKGEsYixkKXtpZihhLmRhdGEocSkpcmV0dXJuIGEuZGF0YShxKS5vW2IrKGQ/XCJcIjpcIkNsYXNzXCIpXX1mdW5jdGlvbiB4KGEpe3JldHVybiBhLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK1xuYS5zbGljZSgxKX1mdW5jdGlvbiBMKGEsYixkLGMpe2lmKCFjKXtpZihiKWFbcF0oXCJpZlRvZ2dsZWRcIik7YVtwXShcImlmQ2hhbmdlZFwiKVtwXShcImlmXCIreChkKSl9fXZhciBxPVwiaUNoZWNrXCIsST1xK1wiLWhlbHBlclwiLHU9XCJyYWRpb1wiLGw9XCJjaGVja2VkXCIsRT1cInVuXCIrbCxzPVwiZGlzYWJsZWRcIix3PVwiZGV0ZXJtaW5hdGVcIixtPVwiaW5cIit3LEg9XCJ1cGRhdGVcIixuPVwidHlwZVwiLHY9XCJhZGRDbGFzc1wiLHo9XCJyZW1vdmVDbGFzc1wiLHA9XCJ0cmlnZ2VyXCIsRz1cImxhYmVsXCIseT1cImN1cnNvclwiLEo9L2lwYWR8aXBob25lfGlwb2R8YW5kcm9pZHxibGFja2JlcnJ5fHdpbmRvd3MgcGhvbmV8b3BlcmEgbWluaXxzaWxrL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtoLmZuW3FdPWZ1bmN0aW9uKGEsYil7dmFyIGQ9J2lucHV0W3R5cGU9XCJjaGVja2JveFwiXSwgaW5wdXRbdHlwZT1cIicrdSsnXCJdJyxjPWgoKSxlPWZ1bmN0aW9uKGEpe2EuZWFjaChmdW5jdGlvbigpe3ZhciBhPWgodGhpcyk7Yz1hLmlzKGQpP1xuYy5hZGQoYSk6Yy5hZGQoYS5maW5kKGQpKX0pfTtpZigvXihjaGVja3x1bmNoZWNrfHRvZ2dsZXxpbmRldGVybWluYXRlfGRldGVybWluYXRlfGRpc2FibGV8ZW5hYmxlfHVwZGF0ZXxkZXN0cm95KSQvaS50ZXN0KGEpKXJldHVybiBhPWEudG9Mb3dlckNhc2UoKSxlKHRoaXMpLGMuZWFjaChmdW5jdGlvbigpe3ZhciBjPWgodGhpcyk7XCJkZXN0cm95XCI9PWE/TShjLFwiaWZEZXN0cm95ZWRcIik6RihjLCEwLGEpO2guaXNGdW5jdGlvbihiKSYmYigpfSk7aWYoXCJvYmplY3RcIiE9dHlwZW9mIGEmJmEpcmV0dXJuIHRoaXM7dmFyIGY9aC5leHRlbmQoe2NoZWNrZWRDbGFzczpsLGRpc2FibGVkQ2xhc3M6cyxpbmRldGVybWluYXRlQ2xhc3M6bSxsYWJlbEhvdmVyOiEwLGFyaWE6ITF9LGEpLGs9Zi5oYW5kbGUsQj1mLmhvdmVyQ2xhc3N8fFwiaG92ZXJcIix4PWYuZm9jdXNDbGFzc3x8XCJmb2N1c1wiLHc9Zi5hY3RpdmVDbGFzc3x8XCJhY3RpdmVcIix5PSEhZi5sYWJlbEhvdmVyLEM9Zi5sYWJlbEhvdmVyQ2xhc3N8fFxuXCJob3ZlclwiLHI9KFwiXCIrZi5pbmNyZWFzZUFyZWEpLnJlcGxhY2UoXCIlXCIsXCJcIil8MDtpZihcImNoZWNrYm94XCI9PWt8fGs9PXUpZD0naW5wdXRbdHlwZT1cIicraysnXCJdJzstNTA+ciYmKHI9LTUwKTtlKHRoaXMpO3JldHVybiBjLmVhY2goZnVuY3Rpb24oKXt2YXIgYT1oKHRoaXMpO00oYSk7dmFyIGM9dGhpcyxiPWMuaWQsZT0tcitcIiVcIixkPTEwMCsyKnIrXCIlXCIsZD17cG9zaXRpb246XCJhYnNvbHV0ZVwiLHRvcDplLGxlZnQ6ZSxkaXNwbGF5OlwiYmxvY2tcIix3aWR0aDpkLGhlaWdodDpkLG1hcmdpbjowLHBhZGRpbmc6MCxiYWNrZ3JvdW5kOlwiI2ZmZlwiLGJvcmRlcjowLG9wYWNpdHk6MH0sZT1KP3twb3NpdGlvbjpcImFic29sdXRlXCIsdmlzaWJpbGl0eTpcImhpZGRlblwifTpyP2Q6e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIixvcGFjaXR5OjB9LGs9XCJjaGVja2JveFwiPT1jW25dP2YuY2hlY2tib3hDbGFzc3x8XCJpY2hlY2tib3hcIjpmLnJhZGlvQ2xhc3N8fFwiaVwiK3UsbT1oKEcrJ1tmb3I9XCInK2IrJ1wiXScpLmFkZChhLmNsb3Nlc3QoRykpLFxuQT0hIWYuYXJpYSxFPXErXCItXCIrTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikucmVwbGFjZShcIjAuXCIsXCJcIiksZz0nPGRpdiBjbGFzcz1cIicraysnXCIgJysoQT8ncm9sZT1cIicrY1tuXSsnXCIgJzpcIlwiKTttLmxlbmd0aCYmQSYmbS5lYWNoKGZ1bmN0aW9uKCl7Zys9J2FyaWEtbGFiZWxsZWRieT1cIic7dGhpcy5pZD9nKz10aGlzLmlkOih0aGlzLmlkPUUsZys9RSk7Zys9J1wiJ30pO2c9YS53cmFwKGcrXCIvPlwiKVtwXShcImlmQ3JlYXRlZFwiKS5wYXJlbnQoKS5hcHBlbmQoZi5pbnNlcnQpO2Q9aCgnPGlucyBjbGFzcz1cIicrSSsnXCIvPicpLmNzcyhkKS5hcHBlbmRUbyhnKTthLmRhdGEocSx7bzpmLHM6YS5hdHRyKFwic3R5bGVcIil9KS5jc3MoZSk7Zi5pbmhlcml0Q2xhc3MmJmdbdl0oYy5jbGFzc05hbWV8fFwiXCIpO2YuaW5oZXJpdElEJiZiJiZnLmF0dHIoXCJpZFwiLHErXCItXCIrYik7XCJzdGF0aWNcIj09Zy5jc3MoXCJwb3NpdGlvblwiKSYmZy5jc3MoXCJwb3NpdGlvblwiLFwicmVsYXRpdmVcIik7RihhLCEwLEgpO1xuaWYobS5sZW5ndGgpbS5vbihcImNsaWNrLmkgbW91c2VvdmVyLmkgbW91c2VvdXQuaSB0b3VjaGJlZ2luLmkgdG91Y2hlbmQuaVwiLGZ1bmN0aW9uKGIpe3ZhciBkPWJbbl0sZT1oKHRoaXMpO2lmKCFjW3NdKXtpZihcImNsaWNrXCI9PWQpe2lmKGgoYi50YXJnZXQpLmlzKFwiYVwiKSlyZXR1cm47RihhLCExLCEwKX1lbHNlIHkmJigvdXR8bmQvLnRlc3QoZCk/KGdbel0oQiksZVt6XShDKSk6KGdbdl0oQiksZVt2XShDKSkpO2lmKEopYi5zdG9wUHJvcGFnYXRpb24oKTtlbHNlIHJldHVybiExfX0pO2Eub24oXCJjbGljay5pIGZvY3VzLmkgYmx1ci5pIGtleXVwLmkga2V5ZG93bi5pIGtleXByZXNzLmlcIixmdW5jdGlvbihiKXt2YXIgZD1iW25dO2I9Yi5rZXlDb2RlO2lmKFwiY2xpY2tcIj09ZClyZXR1cm4hMTtpZihcImtleWRvd25cIj09ZCYmMzI9PWIpcmV0dXJuIGNbbl09PXUmJmNbbF18fChjW2xdP3QoYSxsKTpEKGEsbCkpLCExO2lmKFwia2V5dXBcIj09ZCYmY1tuXT09dSkhY1tsXSYmRChhLGwpO2Vsc2UgaWYoL3VzfHVyLy50ZXN0KGQpKWdbXCJibHVyXCI9PVxuZD96OnZdKHgpfSk7ZC5vbihcImNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlb3ZlciBtb3VzZW91dCB0b3VjaGJlZ2luLmkgdG91Y2hlbmQuaVwiLGZ1bmN0aW9uKGIpe3ZhciBkPWJbbl0sZT0vd258dXAvLnRlc3QoZCk/dzpCO2lmKCFjW3NdKXtpZihcImNsaWNrXCI9PWQpRihhLCExLCEwKTtlbHNle2lmKC93bnxlcnxpbi8udGVzdChkKSlnW3ZdKGUpO2Vsc2UgZ1t6XShlK1wiIFwiK3cpO2lmKG0ubGVuZ3RoJiZ5JiZlPT1CKW1bL3V0fG5kLy50ZXN0KGQpP3o6dl0oQyl9aWYoSiliLnN0b3BQcm9wYWdhdGlvbigpO2Vsc2UgcmV0dXJuITF9fSl9KX19KSh3aW5kb3cualF1ZXJ5fHx3aW5kb3cuWmVwdG8pO1xuIiwiLyohIGJvb3RzdHJhcC10aW1lcGlja2VyIHYwLjUuMiBcbiogaHR0cDovL2pkZXdpdC5naXRodWIuY29tL2Jvb3RzdHJhcC10aW1lcGlja2VyIFxuKiBDb3B5cmlnaHQgKGMpIDIwMTYgSm9yaXMgZGUgV2l0IGFuZCBib290c3RyYXAtdGltZXBpY2tlciBjb250cmlidXRvcnMgXG4qIE1JVCBMaWNlbnNlIFxuKi8hZnVuY3Rpb24oYSxiLGMpe1widXNlIHN0cmljdFwiO3ZhciBkPWZ1bmN0aW9uKGIsYyl7dGhpcy53aWRnZXQ9XCJcIix0aGlzLiRlbGVtZW50PWEoYiksdGhpcy5kZWZhdWx0VGltZT1jLmRlZmF1bHRUaW1lLHRoaXMuZGlzYWJsZUZvY3VzPWMuZGlzYWJsZUZvY3VzLHRoaXMuZGlzYWJsZU1vdXNld2hlZWw9Yy5kaXNhYmxlTW91c2V3aGVlbCx0aGlzLmlzT3Blbj1jLmlzT3Blbix0aGlzLm1pbnV0ZVN0ZXA9Yy5taW51dGVTdGVwLHRoaXMubW9kYWxCYWNrZHJvcD1jLm1vZGFsQmFja2Ryb3AsdGhpcy5vcmllbnRhdGlvbj1jLm9yaWVudGF0aW9uLHRoaXMuc2Vjb25kU3RlcD1jLnNlY29uZFN0ZXAsdGhpcy5zbmFwVG9TdGVwPWMuc25hcFRvU3RlcCx0aGlzLnNob3dJbnB1dHM9Yy5zaG93SW5wdXRzLHRoaXMuc2hvd01lcmlkaWFuPWMuc2hvd01lcmlkaWFuLHRoaXMuc2hvd1NlY29uZHM9Yy5zaG93U2Vjb25kcyx0aGlzLnRlbXBsYXRlPWMudGVtcGxhdGUsdGhpcy5hcHBlbmRXaWRnZXRUbz1jLmFwcGVuZFdpZGdldFRvLHRoaXMuc2hvd1dpZGdldE9uQWRkb25DbGljaz1jLnNob3dXaWRnZXRPbkFkZG9uQ2xpY2ssdGhpcy5pY29ucz1jLmljb25zLHRoaXMubWF4SG91cnM9Yy5tYXhIb3Vycyx0aGlzLmV4cGxpY2l0TW9kZT1jLmV4cGxpY2l0TW9kZSx0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2s9ZnVuY3Rpb24oYSl7dmFyIGI9YS5kYXRhLnNjb3BlO2IuJGVsZW1lbnQucGFyZW50KCkuZmluZChhLnRhcmdldCkubGVuZ3RofHxiLiR3aWRnZXQuaXMoYS50YXJnZXQpfHxiLiR3aWRnZXQuZmluZChhLnRhcmdldCkubGVuZ3RofHxiLmhpZGVXaWRnZXQoKX0sdGhpcy5faW5pdCgpfTtkLnByb3RvdHlwZT17Y29uc3RydWN0b3I6ZCxfaW5pdDpmdW5jdGlvbigpe3ZhciBiPXRoaXM7dGhpcy5zaG93V2lkZ2V0T25BZGRvbkNsaWNrJiZ0aGlzLiRlbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKFwiaW5wdXQtZ3JvdXBcIikmJnRoaXMuJGVsZW1lbnQucGFyZW50KCkuaGFzQ2xhc3MoXCJib290c3RyYXAtdGltZXBpY2tlclwiKT8odGhpcy4kZWxlbWVudC5wYXJlbnQoXCIuaW5wdXQtZ3JvdXAuYm9vdHN0cmFwLXRpbWVwaWNrZXJcIikuZmluZChcIi5pbnB1dC1ncm91cC1hZGRvblwiKS5vbih7XCJjbGljay50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLnNob3dXaWRnZXQsdGhpcyl9KSx0aGlzLiRlbGVtZW50Lm9uKHtcImZvY3VzLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuaGlnaGxpZ2h0VW5pdCx0aGlzKSxcImNsaWNrLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuaGlnaGxpZ2h0VW5pdCx0aGlzKSxcImtleWRvd24udGltZXBpY2tlclwiOmEucHJveHkodGhpcy5lbGVtZW50S2V5ZG93bix0aGlzKSxcImJsdXIudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5ibHVyRWxlbWVudCx0aGlzKSxcIm1vdXNld2hlZWwudGltZXBpY2tlciBET01Nb3VzZVNjcm9sbC50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLm1vdXNld2hlZWwsdGhpcyl9KSk6dGhpcy50ZW1wbGF0ZT90aGlzLiRlbGVtZW50Lm9uKHtcImZvY3VzLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuc2hvd1dpZGdldCx0aGlzKSxcImNsaWNrLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuc2hvd1dpZGdldCx0aGlzKSxcImJsdXIudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5ibHVyRWxlbWVudCx0aGlzKSxcIm1vdXNld2hlZWwudGltZXBpY2tlciBET01Nb3VzZVNjcm9sbC50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLm1vdXNld2hlZWwsdGhpcyl9KTp0aGlzLiRlbGVtZW50Lm9uKHtcImZvY3VzLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuaGlnaGxpZ2h0VW5pdCx0aGlzKSxcImNsaWNrLnRpbWVwaWNrZXJcIjphLnByb3h5KHRoaXMuaGlnaGxpZ2h0VW5pdCx0aGlzKSxcImtleWRvd24udGltZXBpY2tlclwiOmEucHJveHkodGhpcy5lbGVtZW50S2V5ZG93bix0aGlzKSxcImJsdXIudGltZXBpY2tlclwiOmEucHJveHkodGhpcy5ibHVyRWxlbWVudCx0aGlzKSxcIm1vdXNld2hlZWwudGltZXBpY2tlciBET01Nb3VzZVNjcm9sbC50aW1lcGlja2VyXCI6YS5wcm94eSh0aGlzLm1vdXNld2hlZWwsdGhpcyl9KSx0aGlzLnRlbXBsYXRlIT09ITE/dGhpcy4kd2lkZ2V0PWEodGhpcy5nZXRUZW1wbGF0ZSgpKS5vbihcImNsaWNrXCIsYS5wcm94eSh0aGlzLndpZGdldENsaWNrLHRoaXMpKTp0aGlzLiR3aWRnZXQ9ITEsdGhpcy5zaG93SW5wdXRzJiZ0aGlzLiR3aWRnZXQhPT0hMSYmdGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uKCl7YSh0aGlzKS5vbih7XCJjbGljay50aW1lcGlja2VyXCI6ZnVuY3Rpb24oKXthKHRoaXMpLnNlbGVjdCgpfSxcImtleWRvd24udGltZXBpY2tlclwiOmEucHJveHkoYi53aWRnZXRLZXlkb3duLGIpLFwia2V5dXAudGltZXBpY2tlclwiOmEucHJveHkoYi53aWRnZXRLZXl1cCxiKX0pfSksdGhpcy5zZXREZWZhdWx0VGltZSh0aGlzLmRlZmF1bHRUaW1lKX0sYmx1ckVsZW1lbnQ6ZnVuY3Rpb24oKXt0aGlzLmhpZ2hsaWdodGVkVW5pdD1udWxsLHRoaXMudXBkYXRlRnJvbUVsZW1lbnRWYWwoKX0sY2xlYXI6ZnVuY3Rpb24oKXt0aGlzLmhvdXI9XCJcIix0aGlzLm1pbnV0ZT1cIlwiLHRoaXMuc2Vjb25kPVwiXCIsdGhpcy5tZXJpZGlhbj1cIlwiLHRoaXMuJGVsZW1lbnQudmFsKFwiXCIpfSxkZWNyZW1lbnRIb3VyOmZ1bmN0aW9uKCl7aWYodGhpcy5zaG93TWVyaWRpYW4paWYoMT09PXRoaXMuaG91cil0aGlzLmhvdXI9MTI7ZWxzZXtpZigxMj09PXRoaXMuaG91cilyZXR1cm4gdGhpcy5ob3VyLS0sdGhpcy50b2dnbGVNZXJpZGlhbigpO2lmKDA9PT10aGlzLmhvdXIpcmV0dXJuIHRoaXMuaG91cj0xMSx0aGlzLnRvZ2dsZU1lcmlkaWFuKCk7dGhpcy5ob3VyLS19ZWxzZSB0aGlzLmhvdXI8PTA/dGhpcy5ob3VyPXRoaXMubWF4SG91cnMtMTp0aGlzLmhvdXItLX0sZGVjcmVtZW50TWludXRlOmZ1bmN0aW9uKGEpe3ZhciBiO2I9YT90aGlzLm1pbnV0ZS1hOnRoaXMubWludXRlLXRoaXMubWludXRlU3RlcCwwPmI/KHRoaXMuZGVjcmVtZW50SG91cigpLHRoaXMubWludXRlPWIrNjApOnRoaXMubWludXRlPWJ9LGRlY3JlbWVudFNlY29uZDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuc2Vjb25kLXRoaXMuc2Vjb25kU3RlcDswPmE/KHRoaXMuZGVjcmVtZW50TWludXRlKCEwKSx0aGlzLnNlY29uZD1hKzYwKTp0aGlzLnNlY29uZD1hfSxlbGVtZW50S2V5ZG93bjpmdW5jdGlvbihhKXtzd2l0Y2goYS53aGljaCl7Y2FzZSA5OmlmKGEuc2hpZnRLZXkpe2lmKFwiaG91clwiPT09dGhpcy5oaWdobGlnaHRlZFVuaXQpe3RoaXMuaGlkZVdpZGdldCgpO2JyZWFrfXRoaXMuaGlnaGxpZ2h0UHJldlVuaXQoKX1lbHNle2lmKHRoaXMuc2hvd01lcmlkaWFuJiZcIm1lcmlkaWFuXCI9PT10aGlzLmhpZ2hsaWdodGVkVW5pdHx8dGhpcy5zaG93U2Vjb25kcyYmXCJzZWNvbmRcIj09PXRoaXMuaGlnaGxpZ2h0ZWRVbml0fHwhdGhpcy5zaG93TWVyaWRpYW4mJiF0aGlzLnNob3dTZWNvbmRzJiZcIm1pbnV0ZVwiPT09dGhpcy5oaWdobGlnaHRlZFVuaXQpe3RoaXMuaGlkZVdpZGdldCgpO2JyZWFrfXRoaXMuaGlnaGxpZ2h0TmV4dFVuaXQoKX1hLnByZXZlbnREZWZhdWx0KCksdGhpcy51cGRhdGVGcm9tRWxlbWVudFZhbCgpO2JyZWFrO2Nhc2UgMjc6dGhpcy51cGRhdGVGcm9tRWxlbWVudFZhbCgpO2JyZWFrO2Nhc2UgMzc6YS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuaGlnaGxpZ2h0UHJldlVuaXQoKSx0aGlzLnVwZGF0ZUZyb21FbGVtZW50VmFsKCk7YnJlYWs7Y2FzZSAzODpzd2l0Y2goYS5wcmV2ZW50RGVmYXVsdCgpLHRoaXMuaGlnaGxpZ2h0ZWRVbml0KXtjYXNlXCJob3VyXCI6dGhpcy5pbmNyZW1lbnRIb3VyKCksdGhpcy5oaWdobGlnaHRIb3VyKCk7YnJlYWs7Y2FzZVwibWludXRlXCI6dGhpcy5pbmNyZW1lbnRNaW51dGUoKSx0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpO2JyZWFrO2Nhc2VcInNlY29uZFwiOnRoaXMuaW5jcmVtZW50U2Vjb25kKCksdGhpcy5oaWdobGlnaHRTZWNvbmQoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMudG9nZ2xlTWVyaWRpYW4oKSx0aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCl9dGhpcy51cGRhdGUoKTticmVhaztjYXNlIDM5OmEucHJldmVudERlZmF1bHQoKSx0aGlzLmhpZ2hsaWdodE5leHRVbml0KCksdGhpcy51cGRhdGVGcm9tRWxlbWVudFZhbCgpO2JyZWFrO2Nhc2UgNDA6c3dpdGNoKGEucHJldmVudERlZmF1bHQoKSx0aGlzLmhpZ2hsaWdodGVkVW5pdCl7Y2FzZVwiaG91clwiOnRoaXMuZGVjcmVtZW50SG91cigpLHRoaXMuaGlnaGxpZ2h0SG91cigpO2JyZWFrO2Nhc2VcIm1pbnV0ZVwiOnRoaXMuZGVjcmVtZW50TWludXRlKCksdGhpcy5oaWdobGlnaHRNaW51dGUoKTticmVhaztjYXNlXCJzZWNvbmRcIjp0aGlzLmRlY3JlbWVudFNlY29uZCgpLHRoaXMuaGlnaGxpZ2h0U2Vjb25kKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLnRvZ2dsZU1lcmlkaWFuKCksdGhpcy5oaWdobGlnaHRNZXJpZGlhbigpfXRoaXMudXBkYXRlKCl9fSxnZXRDdXJzb3JQb3NpdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnQuZ2V0KDApO2lmKFwic2VsZWN0aW9uU3RhcnRcImluIGEpcmV0dXJuIGEuc2VsZWN0aW9uU3RhcnQ7aWYoYy5zZWxlY3Rpb24pe2EuZm9jdXMoKTt2YXIgYj1jLnNlbGVjdGlvbi5jcmVhdGVSYW5nZSgpLGQ9Yy5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS50ZXh0Lmxlbmd0aDtyZXR1cm4gYi5tb3ZlU3RhcnQoXCJjaGFyYWN0ZXJcIiwtYS52YWx1ZS5sZW5ndGgpLGIudGV4dC5sZW5ndGgtZH19LGdldFRlbXBsYXRlOmZ1bmN0aW9uKCl7dmFyIGEsYixjLGQsZSxmO3N3aXRjaCh0aGlzLnNob3dJbnB1dHM/KGI9JzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItaG91clwiIG1heGxlbmd0aD1cIjJcIi8+JyxjPSc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLW1pbnV0ZVwiIG1heGxlbmd0aD1cIjJcIi8+JyxkPSc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLXNlY29uZFwiIG1heGxlbmd0aD1cIjJcIi8+JyxlPSc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLW1lcmlkaWFuXCIgbWF4bGVuZ3RoPVwiMlwiLz4nKTooYj0nPHNwYW4gY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1ob3VyXCI+PC9zcGFuPicsYz0nPHNwYW4gY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci1taW51dGVcIj48L3NwYW4+JyxkPSc8c3BhbiBjbGFzcz1cImJvb3RzdHJhcC10aW1lcGlja2VyLXNlY29uZFwiPjwvc3Bhbj4nLGU9JzxzcGFuIGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItbWVyaWRpYW5cIj48L3NwYW4+JyksZj0nPHRhYmxlPjx0cj48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImluY3JlbWVudEhvdXJcIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy51cCsnXCI+PC9zcGFuPjwvYT48L3RkPjx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPiZuYnNwOzwvdGQ+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJpbmNyZW1lbnRNaW51dGVcIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy51cCsnXCI+PC9zcGFuPjwvYT48L3RkPicrKHRoaXMuc2hvd1NlY29uZHM/Jzx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPiZuYnNwOzwvdGQ+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJpbmNyZW1lbnRTZWNvbmRcIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy51cCsnXCI+PC9zcGFuPjwvYT48L3RkPic6XCJcIikrKHRoaXMuc2hvd01lcmlkaWFuPyc8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj4mbmJzcDs8L3RkPjx0ZCBjbGFzcz1cIm1lcmlkaWFuLWNvbHVtblwiPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJ0b2dnbGVNZXJpZGlhblwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLnVwKydcIj48L3NwYW4+PC9hPjwvdGQ+JzpcIlwiKStcIjwvdHI+PHRyPjx0ZD5cIitiKyc8L3RkPiA8dGQgY2xhc3M9XCJzZXBhcmF0b3JcIj46PC90ZD48dGQ+JytjK1wiPC90ZD4gXCIrKHRoaXMuc2hvd1NlY29uZHM/Jzx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPjo8L3RkPjx0ZD4nK2QrXCI8L3RkPlwiOlwiXCIpKyh0aGlzLnNob3dNZXJpZGlhbj8nPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+Jm5ic3A7PC90ZD48dGQ+JytlK1wiPC90ZD5cIjpcIlwiKSsnPC90cj48dHI+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJkZWNyZW1lbnRIb3VyXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMuZG93bisnXCI+PC9zcGFuPjwvYT48L3RkPjx0ZCBjbGFzcz1cInNlcGFyYXRvclwiPjwvdGQ+PHRkPjxhIGhyZWY9XCIjXCIgZGF0YS1hY3Rpb249XCJkZWNyZW1lbnRNaW51dGVcIj48c3BhbiBjbGFzcz1cIicrdGhpcy5pY29ucy5kb3duKydcIj48L3NwYW4+PC9hPjwvdGQ+JysodGhpcy5zaG93U2Vjb25kcz8nPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+Jm5ic3A7PC90ZD48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImRlY3JlbWVudFNlY29uZFwiPjxzcGFuIGNsYXNzPVwiJyt0aGlzLmljb25zLmRvd24rJ1wiPjwvc3Bhbj48L2E+PC90ZD4nOlwiXCIpKyh0aGlzLnNob3dNZXJpZGlhbj8nPHRkIGNsYXNzPVwic2VwYXJhdG9yXCI+Jm5ic3A7PC90ZD48dGQ+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cInRvZ2dsZU1lcmlkaWFuXCI+PHNwYW4gY2xhc3M9XCInK3RoaXMuaWNvbnMuZG93bisnXCI+PC9zcGFuPjwvYT48L3RkPic6XCJcIikrXCI8L3RyPjwvdGFibGU+XCIsdGhpcy50ZW1wbGF0ZSl7Y2FzZVwibW9kYWxcIjphPSc8ZGl2IGNsYXNzPVwiYm9vdHN0cmFwLXRpbWVwaWNrZXItd2lkZ2V0IG1vZGFsIGhpZGUgZmFkZSBpblwiIGRhdGEtYmFja2Ryb3A9XCInKyh0aGlzLm1vZGFsQmFja2Ryb3A/XCJ0cnVlXCI6XCJmYWxzZVwiKSsnXCI+PGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JnRpbWVzOzwvYT48aDM+UGljayBhIFRpbWU8L2gzPjwvZGl2PjxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+JytmKyc8L2Rpdj48ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+T0s8L2E+PC9kaXY+PC9kaXY+JzticmVhaztjYXNlXCJkcm9wZG93blwiOmE9JzxkaXYgY2xhc3M9XCJib290c3RyYXAtdGltZXBpY2tlci13aWRnZXQgZHJvcGRvd24tbWVudVwiPicrZitcIjwvZGl2PlwifXJldHVybiBhfSxnZXRUaW1lOmZ1bmN0aW9uKCl7cmV0dXJuXCJcIj09PXRoaXMuaG91cj9cIlwiOnRoaXMuaG91citcIjpcIisoMT09PXRoaXMubWludXRlLnRvU3RyaW5nKCkubGVuZ3RoP1wiMFwiK3RoaXMubWludXRlOnRoaXMubWludXRlKSsodGhpcy5zaG93U2Vjb25kcz9cIjpcIisoMT09PXRoaXMuc2Vjb25kLnRvU3RyaW5nKCkubGVuZ3RoP1wiMFwiK3RoaXMuc2Vjb25kOnRoaXMuc2Vjb25kKTpcIlwiKSsodGhpcy5zaG93TWVyaWRpYW4/XCIgXCIrdGhpcy5tZXJpZGlhbjpcIlwiKX0saGlkZVdpZGdldDpmdW5jdGlvbigpe3RoaXMuaXNPcGVuIT09ITEmJih0aGlzLiRlbGVtZW50LnRyaWdnZXIoe3R5cGU6XCJoaWRlLnRpbWVwaWNrZXJcIix0aW1lOnt2YWx1ZTp0aGlzLmdldFRpbWUoKSxob3Vyczp0aGlzLmhvdXIsbWludXRlczp0aGlzLm1pbnV0ZSxzZWNvbmRzOnRoaXMuc2Vjb25kLG1lcmlkaWFuOnRoaXMubWVyaWRpYW59fSksXCJtb2RhbFwiPT09dGhpcy50ZW1wbGF0ZSYmdGhpcy4kd2lkZ2V0Lm1vZGFsP3RoaXMuJHdpZGdldC5tb2RhbChcImhpZGVcIik6dGhpcy4kd2lkZ2V0LnJlbW92ZUNsYXNzKFwib3BlblwiKSxhKGMpLm9mZihcIm1vdXNlZG93bi50aW1lcGlja2VyLCB0b3VjaGVuZC50aW1lcGlja2VyXCIsdGhpcy5oYW5kbGVEb2N1bWVudENsaWNrKSx0aGlzLmlzT3Blbj0hMSx0aGlzLiR3aWRnZXQuZGV0YWNoKCkpfSxoaWdobGlnaHRVbml0OmZ1bmN0aW9uKCl7dGhpcy5wb3NpdGlvbj10aGlzLmdldEN1cnNvclBvc2l0aW9uKCksdGhpcy5wb3NpdGlvbj49MCYmdGhpcy5wb3NpdGlvbjw9Mj90aGlzLmhpZ2hsaWdodEhvdXIoKTp0aGlzLnBvc2l0aW9uPj0zJiZ0aGlzLnBvc2l0aW9uPD01P3RoaXMuaGlnaGxpZ2h0TWludXRlKCk6dGhpcy5wb3NpdGlvbj49NiYmdGhpcy5wb3NpdGlvbjw9OD90aGlzLnNob3dTZWNvbmRzP3RoaXMuaGlnaGxpZ2h0U2Vjb25kKCk6dGhpcy5oaWdobGlnaHRNZXJpZGlhbigpOnRoaXMucG9zaXRpb24+PTkmJnRoaXMucG9zaXRpb248PTExJiZ0aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCl9LGhpZ2hsaWdodE5leHRVbml0OmZ1bmN0aW9uKCl7c3dpdGNoKHRoaXMuaGlnaGxpZ2h0ZWRVbml0KXtjYXNlXCJob3VyXCI6dGhpcy5oaWdobGlnaHRNaW51dGUoKTticmVhaztjYXNlXCJtaW51dGVcIjp0aGlzLnNob3dTZWNvbmRzP3RoaXMuaGlnaGxpZ2h0U2Vjb25kKCk6dGhpcy5zaG93TWVyaWRpYW4/dGhpcy5oaWdobGlnaHRNZXJpZGlhbigpOnRoaXMuaGlnaGxpZ2h0SG91cigpO2JyZWFrO2Nhc2VcInNlY29uZFwiOnRoaXMuc2hvd01lcmlkaWFuP3RoaXMuaGlnaGxpZ2h0TWVyaWRpYW4oKTp0aGlzLmhpZ2hsaWdodEhvdXIoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMuaGlnaGxpZ2h0SG91cigpfX0saGlnaGxpZ2h0UHJldlVuaXQ6ZnVuY3Rpb24oKXtzd2l0Y2godGhpcy5oaWdobGlnaHRlZFVuaXQpe2Nhc2VcImhvdXJcIjp0aGlzLnNob3dNZXJpZGlhbj90aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCk6dGhpcy5zaG93U2Vjb25kcz90aGlzLmhpZ2hsaWdodFNlY29uZCgpOnRoaXMuaGlnaGxpZ2h0TWludXRlKCk7YnJlYWs7Y2FzZVwibWludXRlXCI6dGhpcy5oaWdobGlnaHRIb3VyKCk7YnJlYWs7Y2FzZVwic2Vjb25kXCI6dGhpcy5oaWdobGlnaHRNaW51dGUoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMuc2hvd1NlY29uZHM/dGhpcy5oaWdobGlnaHRTZWNvbmQoKTp0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpfX0saGlnaGxpZ2h0SG91cjpmdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnQuZ2V0KDApLGI9dGhpczt0aGlzLmhpZ2hsaWdodGVkVW5pdD1cImhvdXJcIixhLnNldFNlbGVjdGlvblJhbmdlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5ob3VyPDEwP2Euc2V0U2VsZWN0aW9uUmFuZ2UoMCwxKTphLnNldFNlbGVjdGlvblJhbmdlKDAsMil9LDApfSxoaWdobGlnaHRNaW51dGU6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50LmdldCgwKSxiPXRoaXM7dGhpcy5oaWdobGlnaHRlZFVuaXQ9XCJtaW51dGVcIixhLnNldFNlbGVjdGlvblJhbmdlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5ob3VyPDEwP2Euc2V0U2VsZWN0aW9uUmFuZ2UoMiw0KTphLnNldFNlbGVjdGlvblJhbmdlKDMsNSl9LDApfSxoaWdobGlnaHRTZWNvbmQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLiRlbGVtZW50LmdldCgwKSxiPXRoaXM7dGhpcy5oaWdobGlnaHRlZFVuaXQ9XCJzZWNvbmRcIixhLnNldFNlbGVjdGlvblJhbmdlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi5ob3VyPDEwP2Euc2V0U2VsZWN0aW9uUmFuZ2UoNSw3KTphLnNldFNlbGVjdGlvblJhbmdlKDYsOCl9LDApfSxoaWdobGlnaHRNZXJpZGlhbjpmdW5jdGlvbigpe3ZhciBhPXRoaXMuJGVsZW1lbnQuZ2V0KDApLGI9dGhpczt0aGlzLmhpZ2hsaWdodGVkVW5pdD1cIm1lcmlkaWFuXCIsYS5zZXRTZWxlY3Rpb25SYW5nZSYmKHRoaXMuc2hvd1NlY29uZHM/c2V0VGltZW91dChmdW5jdGlvbigpe2IuaG91cjwxMD9hLnNldFNlbGVjdGlvblJhbmdlKDgsMTApOmEuc2V0U2VsZWN0aW9uUmFuZ2UoOSwxMSl9LDApOnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLmhvdXI8MTA/YS5zZXRTZWxlY3Rpb25SYW5nZSg1LDcpOmEuc2V0U2VsZWN0aW9uUmFuZ2UoNiw4KX0sMCkpfSxpbmNyZW1lbnRIb3VyOmZ1bmN0aW9uKCl7aWYodGhpcy5zaG93TWVyaWRpYW4pe2lmKDExPT09dGhpcy5ob3VyKXJldHVybiB0aGlzLmhvdXIrKyx0aGlzLnRvZ2dsZU1lcmlkaWFuKCk7MTI9PT10aGlzLmhvdXImJih0aGlzLmhvdXI9MCl9cmV0dXJuIHRoaXMuaG91cj09PXRoaXMubWF4SG91cnMtMT92b2lkKHRoaXMuaG91cj0wKTp2b2lkIHRoaXMuaG91cisrfSxpbmNyZW1lbnRNaW51dGU6ZnVuY3Rpb24oYSl7dmFyIGI7Yj1hP3RoaXMubWludXRlK2E6dGhpcy5taW51dGUrdGhpcy5taW51dGVTdGVwLXRoaXMubWludXRlJXRoaXMubWludXRlU3RlcCxiPjU5Pyh0aGlzLmluY3JlbWVudEhvdXIoKSx0aGlzLm1pbnV0ZT1iLTYwKTp0aGlzLm1pbnV0ZT1ifSxpbmNyZW1lbnRTZWNvbmQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnNlY29uZCt0aGlzLnNlY29uZFN0ZXAtdGhpcy5zZWNvbmQldGhpcy5zZWNvbmRTdGVwO2E+NTk/KHRoaXMuaW5jcmVtZW50TWludXRlKCEwKSx0aGlzLnNlY29uZD1hLTYwKTp0aGlzLnNlY29uZD1hfSxtb3VzZXdoZWVsOmZ1bmN0aW9uKGIpe2lmKCF0aGlzLmRpc2FibGVNb3VzZXdoZWVsKXtiLnByZXZlbnREZWZhdWx0KCksYi5zdG9wUHJvcGFnYXRpb24oKTt2YXIgYz1iLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YXx8LWIub3JpZ2luYWxFdmVudC5kZXRhaWwsZD1udWxsO3N3aXRjaChcIm1vdXNld2hlZWxcIj09PWIudHlwZT9kPS0xKmIub3JpZ2luYWxFdmVudC53aGVlbERlbHRhOlwiRE9NTW91c2VTY3JvbGxcIj09PWIudHlwZSYmKGQ9NDAqYi5vcmlnaW5hbEV2ZW50LmRldGFpbCksZCYmKGIucHJldmVudERlZmF1bHQoKSxhKHRoaXMpLnNjcm9sbFRvcChkK2EodGhpcykuc2Nyb2xsVG9wKCkpKSx0aGlzLmhpZ2hsaWdodGVkVW5pdCl7Y2FzZVwibWludXRlXCI6Yz4wP3RoaXMuaW5jcmVtZW50TWludXRlKCk6dGhpcy5kZWNyZW1lbnRNaW51dGUoKSx0aGlzLmhpZ2hsaWdodE1pbnV0ZSgpO2JyZWFrO2Nhc2VcInNlY29uZFwiOmM+MD90aGlzLmluY3JlbWVudFNlY29uZCgpOnRoaXMuZGVjcmVtZW50U2Vjb25kKCksdGhpcy5oaWdobGlnaHRTZWNvbmQoKTticmVhaztjYXNlXCJtZXJpZGlhblwiOnRoaXMudG9nZ2xlTWVyaWRpYW4oKSx0aGlzLmhpZ2hsaWdodE1lcmlkaWFuKCk7YnJlYWs7ZGVmYXVsdDpjPjA/dGhpcy5pbmNyZW1lbnRIb3VyKCk6dGhpcy5kZWNyZW1lbnRIb3VyKCksdGhpcy5oaWdobGlnaHRIb3VyKCl9cmV0dXJuITF9fSxjaGFuZ2VUb05lYXJlc3RTdGVwOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGElYj09PTA/YTpNYXRoLnJvdW5kKGElYi9iKT8oYSsoYi1hJWIpKSU2MDphLWElYn0scGxhY2U6ZnVuY3Rpb24oKXtpZighdGhpcy5pc0lubGluZSl7dmFyIGM9dGhpcy4kd2lkZ2V0Lm91dGVyV2lkdGgoKSxkPXRoaXMuJHdpZGdldC5vdXRlckhlaWdodCgpLGU9MTAsZj1hKGIpLndpZHRoKCksZz1hKGIpLmhlaWdodCgpLGg9YShiKS5zY3JvbGxUb3AoKSxpPXBhcnNlSW50KHRoaXMuJGVsZW1lbnQucGFyZW50cygpLmZpbHRlcihmdW5jdGlvbigpe3JldHVyblwiYXV0b1wiIT09YSh0aGlzKS5jc3MoXCJ6LWluZGV4XCIpfSkuZmlyc3QoKS5jc3MoXCJ6LWluZGV4XCIpLDEwKSsxMCxqPXRoaXMuY29tcG9uZW50P3RoaXMuY29tcG9uZW50LnBhcmVudCgpLm9mZnNldCgpOnRoaXMuJGVsZW1lbnQub2Zmc2V0KCksaz10aGlzLmNvbXBvbmVudD90aGlzLmNvbXBvbmVudC5vdXRlckhlaWdodCghMCk6dGhpcy4kZWxlbWVudC5vdXRlckhlaWdodCghMSksbD10aGlzLmNvbXBvbmVudD90aGlzLmNvbXBvbmVudC5vdXRlcldpZHRoKCEwKTp0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoITEpLG09ai5sZWZ0LG49ai50b3A7dGhpcy4kd2lkZ2V0LnJlbW92ZUNsYXNzKFwidGltZXBpY2tlci1vcmllbnQtdG9wIHRpbWVwaWNrZXItb3JpZW50LWJvdHRvbSB0aW1lcGlja2VyLW9yaWVudC1yaWdodCB0aW1lcGlja2VyLW9yaWVudC1sZWZ0XCIpLFwiYXV0b1wiIT09dGhpcy5vcmllbnRhdGlvbi54Pyh0aGlzLiR3aWRnZXQuYWRkQ2xhc3MoXCJ0aW1lcGlja2VyLW9yaWVudC1cIit0aGlzLm9yaWVudGF0aW9uLngpLFwicmlnaHRcIj09PXRoaXMub3JpZW50YXRpb24ueCYmKG0tPWMtbCkpOih0aGlzLiR3aWRnZXQuYWRkQ2xhc3MoXCJ0aW1lcGlja2VyLW9yaWVudC1sZWZ0XCIpLGoubGVmdDwwP20tPWoubGVmdC1lOmoubGVmdCtjPmYmJihtPWYtYy1lKSk7dmFyIG8scCxxPXRoaXMub3JpZW50YXRpb24ueTtcImF1dG9cIj09PXEmJihvPS1oK2oudG9wLWQscD1oK2ctKGoudG9wK2srZCkscT1NYXRoLm1heChvLHApPT09cD9cInRvcFwiOlwiYm90dG9tXCIpLHRoaXMuJHdpZGdldC5hZGRDbGFzcyhcInRpbWVwaWNrZXItb3JpZW50LVwiK3EpLFwidG9wXCI9PT1xP24rPWs6bi09ZCtwYXJzZUludCh0aGlzLiR3aWRnZXQuY3NzKFwicGFkZGluZy10b3BcIiksMTApLHRoaXMuJHdpZGdldC5jc3Moe3RvcDpuLGxlZnQ6bSx6SW5kZXg6aX0pfX0scmVtb3ZlOmZ1bmN0aW9uKCl7YShcImRvY3VtZW50XCIpLm9mZihcIi50aW1lcGlja2VyXCIpLHRoaXMuJHdpZGdldCYmdGhpcy4kd2lkZ2V0LnJlbW92ZSgpLGRlbGV0ZSB0aGlzLiRlbGVtZW50LmRhdGEoKS50aW1lcGlja2VyfSxzZXREZWZhdWx0VGltZTpmdW5jdGlvbihhKXtpZih0aGlzLiRlbGVtZW50LnZhbCgpKXRoaXMudXBkYXRlRnJvbUVsZW1lbnRWYWwoKTtlbHNlIGlmKFwiY3VycmVudFwiPT09YSl7dmFyIGI9bmV3IERhdGUsYz1iLmdldEhvdXJzKCksZD1iLmdldE1pbnV0ZXMoKSxlPWIuZ2V0U2Vjb25kcygpLGY9XCJBTVwiOzAhPT1lJiYoZT1NYXRoLmNlaWwoYi5nZXRTZWNvbmRzKCkvdGhpcy5zZWNvbmRTdGVwKSp0aGlzLnNlY29uZFN0ZXAsNjA9PT1lJiYoZCs9MSxlPTApKSwwIT09ZCYmKGQ9TWF0aC5jZWlsKGIuZ2V0TWludXRlcygpL3RoaXMubWludXRlU3RlcCkqdGhpcy5taW51dGVTdGVwLDYwPT09ZCYmKGMrPTEsZD0wKSksdGhpcy5zaG93TWVyaWRpYW4mJigwPT09Yz9jPTEyOmM+PTEyPyhjPjEyJiYoYy09MTIpLGY9XCJQTVwiKTpmPVwiQU1cIiksdGhpcy5ob3VyPWMsdGhpcy5taW51dGU9ZCx0aGlzLnNlY29uZD1lLHRoaXMubWVyaWRpYW49Zix0aGlzLnVwZGF0ZSgpfWVsc2UgYT09PSExPyh0aGlzLmhvdXI9MCx0aGlzLm1pbnV0ZT0wLHRoaXMuc2Vjb25kPTAsdGhpcy5tZXJpZGlhbj1cIkFNXCIpOnRoaXMuc2V0VGltZShhKX0sc2V0VGltZTpmdW5jdGlvbihhLGIpe2lmKCFhKXJldHVybiB2b2lkIHRoaXMuY2xlYXIoKTt2YXIgYyxkLGUsZixnLGg7aWYoXCJvYmplY3RcIj09dHlwZW9mIGEmJmEuZ2V0TW9udGgpZT1hLmdldEhvdXJzKCksZj1hLmdldE1pbnV0ZXMoKSxnPWEuZ2V0U2Vjb25kcygpLHRoaXMuc2hvd01lcmlkaWFuJiYoaD1cIkFNXCIsZT4xMiYmKGg9XCJQTVwiLGUlPTEyKSwxMj09PWUmJihoPVwiUE1cIikpO2Vsc2V7aWYoYz0oL2EvaS50ZXN0KGEpPzE6MCkrKC9wL2kudGVzdChhKT8yOjApLGM+MilyZXR1cm4gdm9pZCB0aGlzLmNsZWFyKCk7aWYoZD1hLnJlcGxhY2UoL1teMC05XFw6XS9nLFwiXCIpLnNwbGl0KFwiOlwiKSxlPWRbMF0/ZFswXS50b1N0cmluZygpOmQudG9TdHJpbmcoKSx0aGlzLmV4cGxpY2l0TW9kZSYmZS5sZW5ndGg+MiYmZS5sZW5ndGglMiE9PTApcmV0dXJuIHZvaWQgdGhpcy5jbGVhcigpO2Y9ZFsxXT9kWzFdLnRvU3RyaW5nKCk6XCJcIixnPWRbMl0/ZFsyXS50b1N0cmluZygpOlwiXCIsZS5sZW5ndGg+NCYmKGc9ZS5zbGljZSgtMiksZT1lLnNsaWNlKDAsLTIpKSxlLmxlbmd0aD4yJiYoZj1lLnNsaWNlKC0yKSxlPWUuc2xpY2UoMCwtMikpLGYubGVuZ3RoPjImJihnPWYuc2xpY2UoLTIpLGY9Zi5zbGljZSgwLC0yKSksZT1wYXJzZUludChlLDEwKSxmPXBhcnNlSW50KGYsMTApLGc9cGFyc2VJbnQoZywxMCksaXNOYU4oZSkmJihlPTApLGlzTmFOKGYpJiYoZj0wKSxpc05hTihnKSYmKGc9MCksZz41OSYmKGc9NTkpLGY+NTkmJihmPTU5KSxlPj10aGlzLm1heEhvdXJzJiYoZT10aGlzLm1heEhvdXJzLTEpLHRoaXMuc2hvd01lcmlkaWFuPyhlPjEyJiYoYz0yLGUtPTEyKSxjfHwoYz0xKSwwPT09ZSYmKGU9MTIpLGg9MT09PWM/XCJBTVwiOlwiUE1cIik6MTI+ZSYmMj09PWM/ZSs9MTI6ZT49dGhpcy5tYXhIb3Vycz9lPXRoaXMubWF4SG91cnMtMTooMD5lfHwxMj09PWUmJjE9PT1jKSYmKGU9MCl9dGhpcy5ob3VyPWUsdGhpcy5zbmFwVG9TdGVwPyh0aGlzLm1pbnV0ZT10aGlzLmNoYW5nZVRvTmVhcmVzdFN0ZXAoZix0aGlzLm1pbnV0ZVN0ZXApLHRoaXMuc2Vjb25kPXRoaXMuY2hhbmdlVG9OZWFyZXN0U3RlcChnLHRoaXMuc2Vjb25kU3RlcCkpOih0aGlzLm1pbnV0ZT1mLHRoaXMuc2Vjb25kPWcpLHRoaXMubWVyaWRpYW49aCx0aGlzLnVwZGF0ZShiKX0sc2hvd1dpZGdldDpmdW5jdGlvbigpe3RoaXMuaXNPcGVufHx0aGlzLiRlbGVtZW50LmlzKFwiOmRpc2FibGVkXCIpfHwodGhpcy4kd2lkZ2V0LmFwcGVuZFRvKHRoaXMuYXBwZW5kV2lkZ2V0VG8pLGEoYykub24oXCJtb3VzZWRvd24udGltZXBpY2tlciwgdG91Y2hlbmQudGltZXBpY2tlclwiLHtzY29wZTp0aGlzfSx0aGlzLmhhbmRsZURvY3VtZW50Q2xpY2spLHRoaXMuJGVsZW1lbnQudHJpZ2dlcih7dHlwZTpcInNob3cudGltZXBpY2tlclwiLHRpbWU6e3ZhbHVlOnRoaXMuZ2V0VGltZSgpLGhvdXJzOnRoaXMuaG91cixtaW51dGVzOnRoaXMubWludXRlLHNlY29uZHM6dGhpcy5zZWNvbmQsbWVyaWRpYW46dGhpcy5tZXJpZGlhbn19KSx0aGlzLnBsYWNlKCksdGhpcy5kaXNhYmxlRm9jdXMmJnRoaXMuJGVsZW1lbnQuYmx1cigpLFwiXCI9PT10aGlzLmhvdXImJih0aGlzLmRlZmF1bHRUaW1lP3RoaXMuc2V0RGVmYXVsdFRpbWUodGhpcy5kZWZhdWx0VGltZSk6dGhpcy5zZXRUaW1lKFwiMDowOjBcIikpLFwibW9kYWxcIj09PXRoaXMudGVtcGxhdGUmJnRoaXMuJHdpZGdldC5tb2RhbD90aGlzLiR3aWRnZXQubW9kYWwoXCJzaG93XCIpLm9uKFwiaGlkZGVuXCIsYS5wcm94eSh0aGlzLmhpZGVXaWRnZXQsdGhpcykpOnRoaXMuaXNPcGVuPT09ITEmJnRoaXMuJHdpZGdldC5hZGRDbGFzcyhcIm9wZW5cIiksdGhpcy5pc09wZW49ITApfSx0b2dnbGVNZXJpZGlhbjpmdW5jdGlvbigpe3RoaXMubWVyaWRpYW49XCJBTVwiPT09dGhpcy5tZXJpZGlhbj9cIlBNXCI6XCJBTVwifSx1cGRhdGU6ZnVuY3Rpb24oYSl7dGhpcy51cGRhdGVFbGVtZW50KCksYXx8dGhpcy51cGRhdGVXaWRnZXQoKSx0aGlzLiRlbGVtZW50LnRyaWdnZXIoe3R5cGU6XCJjaGFuZ2VUaW1lLnRpbWVwaWNrZXJcIix0aW1lOnt2YWx1ZTp0aGlzLmdldFRpbWUoKSxob3Vyczp0aGlzLmhvdXIsbWludXRlczp0aGlzLm1pbnV0ZSxzZWNvbmRzOnRoaXMuc2Vjb25kLG1lcmlkaWFuOnRoaXMubWVyaWRpYW59fSl9LHVwZGF0ZUVsZW1lbnQ6ZnVuY3Rpb24oKXt0aGlzLiRlbGVtZW50LnZhbCh0aGlzLmdldFRpbWUoKSkuY2hhbmdlKCl9LHVwZGF0ZUZyb21FbGVtZW50VmFsOmZ1bmN0aW9uKCl7dGhpcy5zZXRUaW1lKHRoaXMuJGVsZW1lbnQudmFsKCkpfSx1cGRhdGVXaWRnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLiR3aWRnZXQhPT0hMSl7dmFyIGE9dGhpcy5ob3VyLGI9MT09PXRoaXMubWludXRlLnRvU3RyaW5nKCkubGVuZ3RoP1wiMFwiK3RoaXMubWludXRlOnRoaXMubWludXRlLGM9MT09PXRoaXMuc2Vjb25kLnRvU3RyaW5nKCkubGVuZ3RoP1wiMFwiK3RoaXMuc2Vjb25kOnRoaXMuc2Vjb25kO3RoaXMuc2hvd0lucHV0cz8odGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1ob3VyXCIpLnZhbChhKSx0aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLW1pbnV0ZVwiKS52YWwoYiksdGhpcy5zaG93U2Vjb25kcyYmdGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1zZWNvbmRcIikudmFsKGMpLHRoaXMuc2hvd01lcmlkaWFuJiZ0aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLW1lcmlkaWFuXCIpLnZhbCh0aGlzLm1lcmlkaWFuKSk6KHRoaXMuJHdpZGdldC5maW5kKFwic3Bhbi5ib290c3RyYXAtdGltZXBpY2tlci1ob3VyXCIpLnRleHQoYSksdGhpcy4kd2lkZ2V0LmZpbmQoXCJzcGFuLmJvb3RzdHJhcC10aW1lcGlja2VyLW1pbnV0ZVwiKS50ZXh0KGIpLHRoaXMuc2hvd1NlY29uZHMmJnRoaXMuJHdpZGdldC5maW5kKFwic3Bhbi5ib290c3RyYXAtdGltZXBpY2tlci1zZWNvbmRcIikudGV4dChjKSx0aGlzLnNob3dNZXJpZGlhbiYmdGhpcy4kd2lkZ2V0LmZpbmQoXCJzcGFuLmJvb3RzdHJhcC10aW1lcGlja2VyLW1lcmlkaWFuXCIpLnRleHQodGhpcy5tZXJpZGlhbikpfX0sdXBkYXRlRnJvbVdpZGdldElucHV0czpmdW5jdGlvbigpe2lmKHRoaXMuJHdpZGdldCE9PSExKXt2YXIgYT10aGlzLiR3aWRnZXQuZmluZChcImlucHV0LmJvb3RzdHJhcC10aW1lcGlja2VyLWhvdXJcIikudmFsKCkrXCI6XCIrdGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1taW51dGVcIikudmFsKCkrKHRoaXMuc2hvd1NlY29uZHM/XCI6XCIrdGhpcy4kd2lkZ2V0LmZpbmQoXCJpbnB1dC5ib290c3RyYXAtdGltZXBpY2tlci1zZWNvbmRcIikudmFsKCk6XCJcIikrKHRoaXMuc2hvd01lcmlkaWFuP3RoaXMuJHdpZGdldC5maW5kKFwiaW5wdXQuYm9vdHN0cmFwLXRpbWVwaWNrZXItbWVyaWRpYW5cIikudmFsKCk6XCJcIik7dGhpcy5zZXRUaW1lKGEsITApfX0sd2lkZ2V0Q2xpY2s6ZnVuY3Rpb24oYil7Yi5zdG9wUHJvcGFnYXRpb24oKSxiLnByZXZlbnREZWZhdWx0KCk7dmFyIGM9YShiLnRhcmdldCksZD1jLmNsb3Nlc3QoXCJhXCIpLmRhdGEoXCJhY3Rpb25cIik7ZCYmdGhpc1tkXSgpLHRoaXMudXBkYXRlKCksYy5pcyhcImlucHV0XCIpJiZjLmdldCgwKS5zZXRTZWxlY3Rpb25SYW5nZSgwLDIpfSx3aWRnZXRLZXlkb3duOmZ1bmN0aW9uKGIpe3ZhciBjPWEoYi50YXJnZXQpLGQ9Yy5hdHRyKFwiY2xhc3NcIikucmVwbGFjZShcImJvb3RzdHJhcC10aW1lcGlja2VyLVwiLFwiXCIpO3N3aXRjaChiLndoaWNoKXtjYXNlIDk6aWYoYi5zaGlmdEtleSl7aWYoXCJob3VyXCI9PT1kKXJldHVybiB0aGlzLmhpZGVXaWRnZXQoKX1lbHNlIGlmKHRoaXMuc2hvd01lcmlkaWFuJiZcIm1lcmlkaWFuXCI9PT1kfHx0aGlzLnNob3dTZWNvbmRzJiZcInNlY29uZFwiPT09ZHx8IXRoaXMuc2hvd01lcmlkaWFuJiYhdGhpcy5zaG93U2Vjb25kcyYmXCJtaW51dGVcIj09PWQpcmV0dXJuIHRoaXMuaGlkZVdpZGdldCgpO2JyZWFrO2Nhc2UgMjc6dGhpcy5oaWRlV2lkZ2V0KCk7YnJlYWs7Y2FzZSAzODpzd2l0Y2goYi5wcmV2ZW50RGVmYXVsdCgpLGQpe2Nhc2VcImhvdXJcIjp0aGlzLmluY3JlbWVudEhvdXIoKTticmVhaztjYXNlXCJtaW51dGVcIjp0aGlzLmluY3JlbWVudE1pbnV0ZSgpO2JyZWFrO2Nhc2VcInNlY29uZFwiOnRoaXMuaW5jcmVtZW50U2Vjb25kKCk7YnJlYWs7Y2FzZVwibWVyaWRpYW5cIjp0aGlzLnRvZ2dsZU1lcmlkaWFuKCl9dGhpcy5zZXRUaW1lKHRoaXMuZ2V0VGltZSgpKSxjLmdldCgwKS5zZXRTZWxlY3Rpb25SYW5nZSgwLDIpO2JyZWFrO2Nhc2UgNDA6c3dpdGNoKGIucHJldmVudERlZmF1bHQoKSxkKXtjYXNlXCJob3VyXCI6dGhpcy5kZWNyZW1lbnRIb3VyKCk7YnJlYWs7Y2FzZVwibWludXRlXCI6dGhpcy5kZWNyZW1lbnRNaW51dGUoKTticmVhaztjYXNlXCJzZWNvbmRcIjp0aGlzLmRlY3JlbWVudFNlY29uZCgpO2JyZWFrO2Nhc2VcIm1lcmlkaWFuXCI6dGhpcy50b2dnbGVNZXJpZGlhbigpfXRoaXMuc2V0VGltZSh0aGlzLmdldFRpbWUoKSksYy5nZXQoMCkuc2V0U2VsZWN0aW9uUmFuZ2UoMCwyKX19LHdpZGdldEtleXVwOmZ1bmN0aW9uKGEpeyg2NT09PWEud2hpY2h8fDc3PT09YS53aGljaHx8ODA9PT1hLndoaWNofHw0Nj09PWEud2hpY2h8fDg9PT1hLndoaWNofHxhLndoaWNoPj00OCYmYS53aGljaDw9NTd8fGEud2hpY2g+PTk2JiZhLndoaWNoPD0xMDUpJiZ0aGlzLnVwZGF0ZUZyb21XaWRnZXRJbnB1dHMoKX19LGEuZm4udGltZXBpY2tlcj1mdW5jdGlvbihiKXt2YXIgYz1BcnJheS5hcHBseShudWxsLGFyZ3VtZW50cyk7cmV0dXJuIGMuc2hpZnQoKSx0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1hKHRoaXMpLGY9ZS5kYXRhKFwidGltZXBpY2tlclwiKSxnPVwib2JqZWN0XCI9PXR5cGVvZiBiJiZiO2Z8fGUuZGF0YShcInRpbWVwaWNrZXJcIixmPW5ldyBkKHRoaXMsYS5leHRlbmQoe30sYS5mbi50aW1lcGlja2VyLmRlZmF1bHRzLGcsYSh0aGlzKS5kYXRhKCkpKSksXCJzdHJpbmdcIj09dHlwZW9mIGImJmZbYl0uYXBwbHkoZixjKX0pfSxhLmZuLnRpbWVwaWNrZXIuZGVmYXVsdHM9e2RlZmF1bHRUaW1lOlwiY3VycmVudFwiLGRpc2FibGVGb2N1czohMSxkaXNhYmxlTW91c2V3aGVlbDohMSxpc09wZW46ITEsbWludXRlU3RlcDoxNSxtb2RhbEJhY2tkcm9wOiExLG9yaWVudGF0aW9uOnt4OlwiYXV0b1wiLHk6XCJhdXRvXCJ9LHNlY29uZFN0ZXA6MTUsc25hcFRvU3RlcDohMSxzaG93U2Vjb25kczohMSxzaG93SW5wdXRzOiEwLHNob3dNZXJpZGlhbjohMCx0ZW1wbGF0ZTpcImRyb3Bkb3duXCIsYXBwZW5kV2lkZ2V0VG86XCJib2R5XCIsc2hvd1dpZGdldE9uQWRkb25DbGljazohMCxpY29uczp7dXA6XCJnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tdXBcIixkb3duOlwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLWRvd25cIn0sbWF4SG91cnM6MjQsZXhwbGljaXRNb2RlOiExfSxhLmZuLnRpbWVwaWNrZXIuQ29uc3RydWN0b3I9ZCxhKGMpLm9uKFwiZm9jdXMudGltZXBpY2tlci5kYXRhLWFwaSBjbGljay50aW1lcGlja2VyLmRhdGEtYXBpXCIsJ1tkYXRhLXByb3ZpZGU9XCJ0aW1lcGlja2VyXCJdJyxmdW5jdGlvbihiKXt2YXIgYz1hKHRoaXMpO2MuZGF0YShcInRpbWVwaWNrZXJcIil8fChiLnByZXZlbnREZWZhdWx0KCksYy50aW1lcGlja2VyKCkpfSl9KGpRdWVyeSx3aW5kb3csZG9jdW1lbnQpOyJdLCJzb3VyY2VSb290IjoiIn0=