var L = require("leaflet");
exports.map_ = function(el) {
    return function() {
        return L.map(el);
    };
};

exports.setView_ = function(latLng) {
    return function(leaflet) {
        return function() {
            return leaflet.setView(latLng);
        };
    };
};

exports.setZoom_ = function(zoom) {
    return function(leaflet) {
        return function() {
            return leaflet.setZoom(zoom);
        };
    };
};

exports.tileLayer_ = function(str) {
    return function() {
        return L.tileLayer(str);
    };
};

exports.addLayer_ = function(layer) {
    return function(leaflet) {
        return function() {
            layer.addTo(leaflet);
            return leaflet;
        };
    };
};

exports.removeLayer_ = function(layer) {
    return function(leaflet) {
        return function() {
            leaflet.removeLayer(layer);
            return leaflet;
        };
    };
};

exports.marker_ = function(latlng) {
    return function() {
        return L.marker(latlng);
    };
};

exports.onload = function(ef) {
    return function() {
        window.onload = function() {
            return ef();
        };
    };
};

var preparations = function(converter) {
    return [
        { tag: "pane" },
        { tag: "attribution" },
        { tag: "interactive" },
        { tag: "iconUrl", fn: converter.printURI },
        { tag: "iconRetinaUrl", fn: converter.printURI },
        { tag: "iconSize", fn: converter.mkPoint },
        { tag: "iconAnchor", fn: converter.mkPoint },
        { tag: "popupAnchor", fn: converter.mkPoint },
        { tag: "shadowUrl", fn: converter.printURI },
        { tag: "shadowRetinaUrl", fn: converter.printURI },
        { tag: "shadowSize", fn: converter.mkPoint },
        { tag: "shadowAnchor", fn: converter.mkPoint },
        { tag: "className" },
        { tag: "offset", fn: converter.mkPoint },
        { tag: "maxWidth" },
        { tag: "minWidth" },
        { tag: "maxHeight" },
        { tag: "minHeight" },
        { tag: "autoPan" },
        { tag: "autoPanPaddingTopLeft" },
        { tag: "autoPanPadddingBottomRight" },
        { tag: "autoPanPadding" },
        { tag: "keepInView" },
        { tag: "closeButton" },
        { tag: "closeOnClick" },
        { tag: "autoClose" },
        { tag: "stroke" },
        { tag: "color", fn: converter.printColor },
        { tag: "weight" },
        { tag: "opacity" },
        { tag: "lineCap", fn: converter.printLineCap },
        { tag: "lineJoin", fn: converter.printLineJoin },
        { tag: "dashArray", fn: converter.printDashArray },
        { tag: "dashOffset", fn: converter.printPercentOrPixel },
        { tag: "fill" },
        { tag: "fillColor", fn: converter.printColor },
        { tag: "fillOpacity" },
        { tag: "fillRule", fn: converter.printFillRule },
        { tag: "renderer" },
        { tag: "smoothFactor" },
        { tag: "noClip" },
        { tag: "radius" }
    ];
};

var prepareConf = function(converter, conf) {
    var i,
        res = {},
        preps = preparations(converter),
        prep, tag, fn;

    for (var i = 0; i < preps.length; i++) {
        prep = preps[i];
        tag = prep.tag;
        fn = prep.fn;
        if (conf.hasOwnProperty(tag)) {
            res[tag] = fn ? fn(conf[tag]) : conf[tag];
        }
    }
    return res;
};

exports.icon_ = function(converter) {
    return function(conf) {
        return function() {
            return L.icon(prepareConf(converter, conf));
        };
    };
};

exports.popup_ = function(converter) {
    return function(conf) {
        return function() {
            return L.popup(prepareConf(converter, conf));
        };
    };
};

exports.setIcon_ = function(icon) {
    return function(marker) {
        return function() {
            return marker.setIcon(icon);
        };
    };
};

exports.setLatLng_ = function(latlng) {
    return function(popup) {
        return function() {
            return popup.setLatLng(latlng);
        };
    };
};

exports.setContent_ = function(c) {
    return function(popup) {
        return function() {
            return popup.setContent(c);
        };
    };
};

exports.openOn_ = function(map) {
    return function(popup) {
        return function() {
            return popup.openOn(map);
        };
    };
};

exports.bindPopup_ = function(c) {
    return function(marker) {
        return function() {
            return marker.bindPopup(c);
        };
    };
};

exports.openPopup_ = function(isJust) {
    return function(latlng) {
        return function(layer) {
            return function() {
                var ll = isJust ? latlng : undefined;
                return layer.openPopup(ll);
            };
        };
    };
};

exports.circleMarker_ = function(latlng) {
    return function(converter) {
        return function(conf) {
            return function() {
                return L.circleMarker(latlng, prepareConf(converter, conf));
            };
        };
    };
};

exports.circle_ = function(latlng) {
    return function(converter) {
        return function(conf) {
            return function() {
                return L.circle(latlng, prepareConf(converter, conf));
            };
        };
    };
};


exports.polyline_ = function(latlngs) {
    return function(converter) {
        return function(conf) {
            return function() {
                return L.polyline(latlngs, prepareConf(converter, conf));
            };
        };
    };
};

exports.polygon_ = function(latlngs) {
    return function(converter) {
        return function(conf) {
            return function() {
                return L.polygon(latlngs, prepareConf(converter, conf));
            };
        };
    };
};

exports.rectangle_ = function(latlngs) {
    return function(converter) {
        return function(conf) {
            return function() {
                return L.rectangle(latlngs, prepareConf(converter, conf));
            };
        };
    };
};

exports.debugTime = function(tag) {
    return function(act) {
        return function() {
            console.time(tag);
            var res = act();
            console.timeEnd(tag);
            return res;
        };
    };
};

exports.layer_ = function() {
    return new L.Layer();
};

exports.on_ = function(e) {
    return function(cb) {
        return function(l) {
            return function() {
                l.on(e, function() {
                    cb(this)();
                });
                return l;
            };
        };
    };
};

exports.onAddRemove = function(onAdd) {
    return function(onRemove) {
        return function(layer) {
            return function() {
                var res = {value: undefined};
                layer.onAdd = function(map) {
                    res.value = onAdd(this)(map)();
                    return this;
                };
                layer.onRemove = function(map) {
                    onRemove(this)(map)(res)();
                    return this;
                };
                return res;
            };
        };
    };
};
