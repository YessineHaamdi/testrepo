!(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return (e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports);
  }
  ((n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      ("undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 }));
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var o in e)
          n.d(
            r,
            o,
            function (t) {
              return e[t];
            }.bind(null, o),
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return (n.d(t, "a", t), t);
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = "index-12.html"),
    n((n.s = 0)));
})([
  function (e, t, n) {
    e.exports = n(1);
  },
  function (e, t) {
    function n() {
      var e = document.querySelectorAll(".purecounter");
      if (
        "IntersectionObserver" in window &&
        "IntersectionObserverEntry" in window &&
        "intersectionRatio" in window.IntersectionObserverEntry.prototype
      )
        for (
          var t = new IntersectionObserver(o, {
              root: null,
              rootMargin: "20px",
              threshold: 0.5,
            }),
            n = 0;
          n < e.length;
          n++
        )
          t.observe(e[n]);
      else
        window.addEventListener &&
          (r(e),
          window.addEventListener(
            "scroll",
            function (t) {
              r(e);
            },
            { passive: !0 },
          ));
    }
    function r(e) {
      for (var t = 0; t < e.length; t++) {
        !0 === a(e[t]).legacy && u(e[t]) && o([e[t]]);
      }
    }
    function o(e, t) {
      e.forEach(function (e) {
        var n = void 0 !== e.target ? a(e.target) : a(e);
        return n.duration <= 0
          ? (e.innerHTML = n.end.toFixed(n.decimals))
          : (!t && !u(e)) || (t && e.intersectionRatio < 0.5)
            ? (e.target.innerHTML = n.start > n.end ? n.end : n.start)
            : void setTimeout(function () {
                return void 0 !== e.target ? i(e.target, n) : i(e, n);
              }, n.delay);
      });
    }
    function i(e, t) {
      var n = (t.end - t.start) / (t.duration / t.delay),
        r = "inc";
      (t.start > t.end && ((r = "dec"), (n *= -1)),
        n < 1 && t.decimals <= 0 && (n = 1));
      var o =
        t.decimals <= 0
          ? parseInt(t.start)
          : parseFloat(t.start).toFixed(t.decimals);
      ((e.innerHTML = o),
        !0 === t.once && e.setAttribute("data-purecounter-duration", 0));
      var i = setInterval(function () {
        var a = (function (e, t, n, r) {
          r || (r = "inc");
          if ("inc" === r)
            return n.decimals <= 0
              ? parseInt(e) + parseInt(t)
              : parseFloat(e) + parseFloat(t);
          return n.decimals <= 0
            ? parseInt(e) - parseInt(t)
            : parseFloat(e) - parseFloat(t);
        })(o, n, t, r);
        ((e.innerHTML = (function (e, t) {
          return t.decimals <= 0
            ? parseInt(e)
            : e.toLocaleString(void 0, {
                minimumFractionDigits: t.decimals,
                maximumFractionDigits: t.decimals,
              });
        })(a, t)),
          (((o = a) >= t.end && "inc" == r) || (o <= t.end && "dec" == r)) &&
            (clearInterval(i),
            o != t.end &&
              (e.innerHTML =
                t.decimals <= 0
                  ? parseInt(t.end)
                  : parseFloat(t.end).toFixed(t.decimals))));
      }, t.delay);
    }
    function a(e) {
      for (
        var t = [].filter.call(e.attributes, function (e) {
            return /^data-purecounter-/.test(e.name);
          }),
          n = {
            start: 0,
            end: 9001,
            duration: 2e3,
            delay: 10,
            once: !0,
            decimals: 0,
            legacy: !0,
          },
          r = 0;
        r < t.length;
        r++
      ) {
        var o = t[r].name.replace("data-purecounter-", "");
        n[o.toLowerCase()] =
          "duration" == o.toLowerCase()
            ? parseInt(1e3 * s(t[r].value))
            : s(t[r].value);
      }
      return n;
    }
    function s(e) {
      return /^[0-9]+\.[0-9]+$/.test(e)
        ? parseFloat(e)
        : /^[0-9]+$/.test(e)
          ? parseInt(e)
          : e;
    }
    function u(e) {
      for (
        var t = e.offsetTop,
          n = e.offsetLeft,
          r = e.offsetWidth,
          o = e.offsetHeight;
        e.offsetParent;

      )
        ((t += (e = e.offsetParent).offsetTop), (n += e.offsetLeft));
      return (
        t >= window.pageYOffset &&
        n >= window.pageXOffset &&
        t + o <= window.pageYOffset + window.innerHeight &&
        n + r <= window.pageXOffset + window.innerWidth
      );
    }
    n();
  },
]);
