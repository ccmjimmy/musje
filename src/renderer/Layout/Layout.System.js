/* global musje, Snap */

(function (Layout, Snap) {
  'use strict';

  var defineProperty = Object.defineProperty;

  function getPairs(measures) {
    return measures.map(function (measure) {
      return {
        width: measure.minWidth,
        measure: measure
      };
    }).sort(function (a, b) {
      return b.width - a.width;   // descending sort
    });
  }

  var System = Layout.System = function (content, lo) {
    this._lo = lo;
    this.el = content.el.g().addClass('mus-system');
    this.width = content.width;
    this.measures = [];
  };

  System.prototype.flow = function () {
    var
      system = this,
      x = 0;

    system._tuneMeasuresWidths();
    system.measures.forEach(function (measure, m) {

      /**
       * Reference to the system.
       * Produced by {@link musje.Layout.System#flow}
       * @memberof musje.TimewiseMeasure#
       * @alias system
       * @type {musje.Layout.System}
       * @readonly
       */
      measure.system = system;

      /**
       * Index of this measure in the system.
       * Produced by {@link musje.Layout.System#flow}
       * @memberof musje.TimewiseMeasure#
       * @alias _sIndex
       * @type {number}
       * @protected
       */
      measure._sIndex = m;
      measure.flow();
      measure.x = x;
      x += measure.width;
    });
  };

  System.prototype._tuneMeasuresWidths = function () {
    var
      pairs = getPairs(this.measures),
      length = pairs.length,
      widthLeft = this.width,
      itemLeft = length,
      i = 0,    // i + itemLeft === length
      width;

    while (i < length) {
      if (widthLeft >= pairs[i].width * itemLeft) {
        width = widthLeft / itemLeft;
        do {
          pairs[i].measure.width = width;
          i++;
        } while (i < length);
        break;
      } else {
        width = pairs[i].width;
        pairs[i].measure.width = width;
        widthLeft -= width;
        i++;
        itemLeft--;
      }
    }

    // measures.forEach(function (measure) {
    //   measure.el.rect(0, 0, measure.width, measure.height)
    //         .attr({ stroke: 'green', fill: 'none' });
    // });
  };

  defineProperty(System.prototype, 'y', {
    get: function () {
      return this._y;
    },
    set: function (y) {
      this._y = y;
      this.el.transform(Snap.matrix().translate(0, y));
    }
  });

  defineProperty(System.prototype, 'width', {
    get: function () {
      return this._w;
    },
    set: function (w) {
      this._w = w;
    }
  });

  defineProperty(System.prototype, 'height', {
    get: function () {
      return this._h;
    },
    set: function (h) {
      this._h = h;
    }
  });

}(musje.Layout, Snap));