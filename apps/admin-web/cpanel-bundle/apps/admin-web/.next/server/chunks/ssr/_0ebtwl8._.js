module.exports = [
  63496,
  (a, b, c) => {
    'use strict';
    function d({
      widthInt: a,
      heightInt: b,
      blurWidth: c,
      blurHeight: e,
      blurDataURL: f,
      objectFit: g,
    }) {
      let h = c ? 40 * c : a,
        i = e ? 40 * e : b,
        j = h && i ? `viewBox='0 0 ${h} ${i}'` : '';
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${j}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${j ? 'none' : 'contain' === g ? 'xMidYMid' : 'cover' === g ? 'xMidYMid slice' : 'none'}' style='filter: url(%23b);' href='${f}'/%3E%3C/svg%3E`;
    }
    (Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'getImageBlurSvg', {
        enumerable: !0,
        get: function () {
          return d;
        },
      }));
  },
  95913,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 });
    var d = {
      VALID_LOADERS: function () {
        return f;
      },
      imageConfigDefault: function () {
        return g;
      },
    };
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
    let f = ['default', 'imgix', 'cloudinary', 'akamai', 'custom'],
      g = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        path: '/_next/image',
        loader: 'default',
        loaderFile: '',
        domains: [],
        disableStaticImages: !1,
        minimumCacheTTL: 14400,
        formats: ['image/webp'],
        maximumDiskCacheSize: void 0,
        maximumRedirects: 3,
        maximumResponseBody: 5e7,
        dangerouslyAllowLocalIP: !1,
        dangerouslyAllowSVG: !1,
        contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
        contentDispositionType: 'attachment',
        localPatterns: void 0,
        remotePatterns: [],
        qualities: [75],
        unoptimized: !1,
        customCacheHandler: !1,
      };
  },
  71446,
  (a, b, c) => {
    'use strict';
    (Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'getImgProps', {
        enumerable: !0,
        get: function () {
          return j;
        },
      }),
      a.r(19441));
    let d = a.r(65455),
      e = a.r(63496),
      f = a.r(95913),
      g = ['-moz-initial', 'fill', 'none', 'scale-down', void 0];
    function h(a) {
      return void 0 !== a.default;
    }
    function i(a) {
      return void 0 === a
        ? a
        : 'number' == typeof a
          ? Number.isFinite(a)
            ? a
            : NaN
          : 'string' == typeof a && /^[0-9]+$/.test(a)
            ? parseInt(a, 10)
            : NaN;
    }
    function j(
      {
        src: a,
        sizes: b,
        unoptimized: c = !1,
        priority: k = !1,
        preload: l = !1,
        loading: m,
        className: n,
        quality: o,
        width: p,
        height: q,
        fill: r = !1,
        style: s,
        overrideSrc: t,
        onLoad: u,
        onLoadingComplete: v,
        placeholder: w = 'empty',
        blurDataURL: x,
        fetchPriority: y,
        decoding: z = 'async',
        layout: A,
        objectFit: B,
        objectPosition: C,
        lazyBoundary: D,
        lazyRoot: E,
        ...F
      },
      G,
    ) {
      var H;
      let I,
        J,
        K,
        { imgConf: L, showAltText: M, blurComplete: N, defaultLoader: O } = G,
        P = L || f.imageConfigDefault;
      if ('allSizes' in P) I = P;
      else {
        let a = [...P.deviceSizes, ...P.imageSizes].sort((a, b) => a - b),
          b = P.deviceSizes.sort((a, b) => a - b),
          c = P.qualities?.sort((a, b) => a - b);
        I = { ...P, allSizes: a, deviceSizes: b, qualities: c };
      }
      if (void 0 === O)
        throw Object.defineProperty(
          Error(
            'images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config',
          ),
          '__NEXT_ERROR_CODE',
          { value: 'E163', enumerable: !1, configurable: !0 },
        );
      let Q = F.loader || O;
      (delete F.loader, delete F.srcSet);
      let R = '__next_img_default' in Q;
      if (R) {
        if ('custom' === I.loader)
          throw Object.defineProperty(
            Error(`Image with src "${a}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),
            '__NEXT_ERROR_CODE',
            { value: 'E252', enumerable: !1, configurable: !0 },
          );
      } else {
        let a = Q;
        Q = (b) => {
          let { config: c, ...d } = b;
          return a(d);
        };
      }
      if (A) {
        'fill' === A && (r = !0);
        let a = {
          intrinsic: { maxWidth: '100%', height: 'auto' },
          responsive: { width: '100%', height: 'auto' },
        }[A];
        a && (s = { ...s, ...a });
        let c = { responsive: '100vw', fill: '100vw' }[A];
        c && !b && (b = c);
      }
      let S = '',
        T = i(p),
        U = i(q);
      if ((H = a) && 'object' == typeof H && (h(H) || void 0 !== H.src)) {
        let b = h(a) ? a.default : a;
        if (!b.src)
          throw Object.defineProperty(
            Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(b)}`,
            ),
            '__NEXT_ERROR_CODE',
            { value: 'E460', enumerable: !1, configurable: !0 },
          );
        if (!b.height || !b.width)
          throw Object.defineProperty(
            Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(b)}`,
            ),
            '__NEXT_ERROR_CODE',
            { value: 'E48', enumerable: !1, configurable: !0 },
          );
        if (
          ((J = b.blurWidth),
          (K = b.blurHeight),
          (x = x || b.blurDataURL),
          (S = b.src),
          !r)
        )
          if (T || U) {
            if (T && !U) {
              let a = T / b.width;
              U = Math.round(b.height * a);
            } else if (!T && U) {
              let a = U / b.height;
              T = Math.round(b.width * a);
            }
          } else ((T = b.width), (U = b.height));
      }
      let V = !k && !l && ('lazy' === m || void 0 === m);
      ((!(a = 'string' == typeof a ? a : S) ||
        a.startsWith('data:') ||
        a.startsWith('blob:')) &&
        ((c = !0), (V = !1)),
        I.unoptimized && (c = !0),
        R &&
          !I.dangerouslyAllowSVG &&
          a.split('?', 1)[0].endsWith('.svg') &&
          (c = !0));
      let W = i(o),
        X = Object.assign(
          r
            ? {
                position: 'absolute',
                height: '100%',
                width: '100%',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: B,
                objectPosition: C,
              }
            : {},
          M ? {} : { color: 'transparent' },
          s,
        ),
        Y =
          N || 'empty' === w
            ? null
            : 'blur' === w
              ? `url("data:image/svg+xml;charset=utf-8,${(0, e.getImageBlurSvg)({ widthInt: T, heightInt: U, blurWidth: J, blurHeight: K, blurDataURL: x || '', objectFit: X.objectFit })}")`
              : `url("${w}")`,
        Z = g.includes(X.objectFit)
          ? 'fill' === X.objectFit
            ? '100% 100%'
            : 'cover'
          : X.objectFit,
        $ = Y
          ? {
              backgroundSize: Z,
              backgroundPosition: X.objectPosition || '50% 50%',
              backgroundRepeat: 'no-repeat',
              backgroundImage: Y,
            }
          : {},
        _ = (function ({
          config: a,
          src: b,
          unoptimized: c,
          width: e,
          quality: f,
          sizes: g,
          loader: h,
        }) {
          if (c) {
            if (b.startsWith('/') && !b.startsWith('//')) {
              let a = (0, d.getDeploymentId)();
              if (a) {
                let c = b.indexOf('?');
                if (-1 !== c) {
                  let d = new URLSearchParams(b.slice(c + 1));
                  d.get('dpl') ||
                    (d.append('dpl', a),
                    (b = b.slice(0, c) + '?' + d.toString()));
                } else b += `?dpl=${a}`;
              }
            }
            return { src: b, srcSet: void 0, sizes: void 0 };
          }
          let { widths: i, kind: j } = (function (
              { deviceSizes: a, allSizes: b },
              c,
              d,
            ) {
              if (d) {
                let c = /(^|\s)(1?\d?\d)vw/g,
                  e = [];
                for (let a; (a = c.exec(d)); ) e.push(parseInt(a[2]));
                if (e.length) {
                  let c = 0.01 * Math.min(...e);
                  return { widths: b.filter((b) => b >= a[0] * c), kind: 'w' };
                }
                return { widths: b, kind: 'w' };
              }
              return 'number' != typeof c
                ? { widths: a, kind: 'w' }
                : {
                    widths: [
                      ...new Set(
                        [c, 2 * c].map(
                          (a) => b.find((b) => b >= a) || b[b.length - 1],
                        ),
                      ),
                    ],
                    kind: 'x',
                  };
            })(a, e, g),
            k = i.length - 1;
          return {
            sizes: g || 'w' !== j ? g : '100vw',
            srcSet: i
              .map(
                (c, d) =>
                  `${h({ config: a, src: b, quality: f, width: c })} ${'w' === j ? c : d + 1}${j}`,
              )
              .join(', '),
            src: h({ config: a, src: b, quality: f, width: i[k] }),
          };
        })({
          config: I,
          src: a,
          unoptimized: c,
          width: T,
          quality: W,
          sizes: b,
          loader: Q,
        }),
        aa = V ? 'lazy' : m;
      return {
        props: {
          ...F,
          loading: aa,
          fetchPriority: y,
          width: T,
          height: U,
          decoding: z,
          className: n,
          style: { ...X, ...$ },
          sizes: _.sizes,
          srcSet: _.srcSet,
          src: t || _.src,
        },
        meta: { unoptimized: c, preload: l || k, placeholder: w, fill: r },
      };
    }
  },
  5627,
  (a, b, c) => {
    'use strict';
    (Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'default', {
        enumerable: !0,
        get: function () {
          return f;
        },
      }));
    let d = a.r(26670),
      e = () => {};
    function f(a) {
      let { headManager: b, reduceComponentsToState: c } = a;
      function f() {
        if (b && b.mountedInstances) {
          let a = d.Children.toArray(
            Array.from(b.mountedInstances).filter(Boolean),
          );
          b.updateHead(c(a));
        }
      }
      return (
        b?.mountedInstances?.add(a.children),
        f(),
        e(
          () => (
            b?.mountedInstances?.add(a.children),
            () => {
              b?.mountedInstances?.delete(a.children);
            }
          ),
        ),
        e(
          () => (
            b && (b._pendingUpdate = f),
            () => {
              b && (b._pendingUpdate = f);
            }
          ),
        ),
        null
      );
    }
  },
  69564,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(49655).vendored.contexts.HeadManagerContext;
  },
  39785,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 });
    var d = {
      default: function () {
        return p;
      },
      defaultHead: function () {
        return l;
      },
    };
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
    let f = a.r(63652),
      g = a.r(3988),
      h = a.r(89272),
      i = g._(a.r(26670)),
      j = f._(a.r(5627)),
      k = a.r(69564);
    function l() {
      return [
        (0, h.jsx)('meta', { charSet: 'utf-8' }, 'charset'),
        (0, h.jsx)(
          'meta',
          { name: 'viewport', content: 'width=device-width' },
          'viewport',
        ),
      ];
    }
    function m(a, b) {
      return 'string' == typeof b || 'number' == typeof b
        ? a
        : b.type === i.default.Fragment
          ? a.concat(
              i.default.Children.toArray(b.props.children).reduce(
                (a, b) =>
                  'string' == typeof b || 'number' == typeof b
                    ? a
                    : a.concat(b),
                [],
              ),
            )
          : a.concat(b);
    }
    a.r(19441);
    let n = ['name', 'httpEquiv', 'charSet', 'itemProp'];
    function o(a) {
      let b, c, d, e;
      return a
        .reduce(m, [])
        .reverse()
        .concat(l().reverse())
        .filter(
          ((b = new Set()),
          (c = new Set()),
          (d = new Set()),
          (e = {}),
          (a) => {
            let f = !0,
              g = !1;
            if (a.key && 'number' != typeof a.key && a.key.indexOf('$') > 0) {
              g = !0;
              let c = a.key.slice(a.key.indexOf('$') + 1);
              b.has(c) ? (f = !1) : b.add(c);
            }
            switch (a.type) {
              case 'title':
              case 'base':
                c.has(a.type) ? (f = !1) : c.add(a.type);
                break;
              case 'meta':
                for (let b = 0, c = n.length; b < c; b++) {
                  let c = n[b];
                  if (a.props.hasOwnProperty(c))
                    if ('charSet' === c) d.has(c) ? (f = !1) : d.add(c);
                    else {
                      let b = a.props[c],
                        d = e[c] || new Set();
                      ('name' !== c || !g) && d.has(b)
                        ? (f = !1)
                        : (d.add(b), (e[c] = d));
                    }
                }
            }
            return f;
          }),
        )
        .reverse()
        .map((a, b) => {
          let c = a.key || b;
          return i.default.cloneElement(a, { key: c });
        });
    }
    let p = function ({ children: a }) {
      let b = (0, i.useContext)(k.HeadManagerContext);
      return (0, h.jsx)(j.default, {
        reduceComponentsToState: o,
        headManager: b,
        children: a,
      });
    };
    ('function' == typeof c.default ||
      ('object' == typeof c.default && null !== c.default)) &&
      void 0 === c.default.__esModule &&
      (Object.defineProperty(c.default, '__esModule', { value: !0 }),
      Object.assign(c.default, c),
      (b.exports = c.default));
  },
  78055,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(49655).vendored.contexts.ImageConfigContext;
  },
  17760,
  (a, b, c) => {
    'use strict';
    b.exports = a.r(49655).vendored.contexts.RouterContext;
  },
  5455,
  (a, b, c) => {
    'use strict';
    function d(a, b) {
      let c = a || 75;
      return b?.qualities?.length
        ? b.qualities.reduce(
            (a, b) => (Math.abs(b - c) < Math.abs(a - c) ? b : a),
            b.qualities[0],
          )
        : c;
    }
    (Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'findClosestQuality', {
        enumerable: !0,
        get: function () {
          return d;
        },
      }));
  },
  55271,
  (a, b, c) => {
    'use strict';
    (Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'default', {
        enumerable: !0,
        get: function () {
          return g;
        },
      }));
    let d = a.r(5455),
      e = a.r(65455);
    function f({ config: a, src: b, width: c, quality: g }) {
      let h = (0, e.getDeploymentId)();
      if (b.startsWith('/') && !b.startsWith('//')) {
        let a = b.indexOf('?');
        if (-1 !== a) {
          let c = new URLSearchParams(b.slice(a + 1)),
            d = c.get('dpl');
          if (d) {
            ((h = d), c.delete('dpl'));
            let e = c.toString();
            b = b.slice(0, a) + (e ? '?' + e : '');
          }
        }
      }
      if (
        b.startsWith('/') &&
        b.includes('?') &&
        a.localPatterns?.length === 1 &&
        '**' === a.localPatterns[0].pathname &&
        '' === a.localPatterns[0].search
      )
        throw Object.defineProperty(
          Error(`Image with src "${b}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),
          '__NEXT_ERROR_CODE',
          { value: 'E871', enumerable: !1, configurable: !0 },
        );
      let i = (0, d.findClosestQuality)(g, a);
      return `${a.path}?url=${encodeURIComponent(b)}&w=${c}&q=${i}${b.startsWith('/') && h ? `&dpl=${h}` : ''}`;
    }
    f.__next_img_default = !0;
    let g = f;
  },
  49329,
  (a, b, c) => {
    'use strict';
    (Object.defineProperty(c, '__esModule', { value: !0 }),
      Object.defineProperty(c, 'Image', {
        enumerable: !0,
        get: function () {
          return u;
        },
      }));
    let d = a.r(63652),
      e = a.r(3988),
      f = a.r(89272),
      g = e._(a.r(26670)),
      h = d._(a.r(22672)),
      i = d._(a.r(39785)),
      j = a.r(71446),
      k = a.r(95913),
      l = a.r(78055);
    a.r(19441);
    let m = a.r(17760),
      n = d._(a.r(55271)),
      o = a.r(425),
      p = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75],
        path: '/_next/image',
        loader: 'default',
        dangerouslyAllowSVG: !1,
        unoptimized: !0,
      };
    function q(a, b, c, d, e, f, g) {
      let h = a?.src;
      a &&
        a['data-loaded-src'] !== h &&
        ((a['data-loaded-src'] = h),
        ('decode' in a ? a.decode() : Promise.resolve())
          .catch(() => {})
          .then(() => {
            if (a.parentElement && a.isConnected) {
              if (('empty' !== b && e(!0), c?.current)) {
                let b = new Event('load');
                Object.defineProperty(b, 'target', { writable: !1, value: a });
                let d = !1,
                  e = !1;
                c.current({
                  ...b,
                  nativeEvent: b,
                  currentTarget: a,
                  target: a,
                  isDefaultPrevented: () => d,
                  isPropagationStopped: () => e,
                  persist: () => {},
                  preventDefault: () => {
                    ((d = !0), b.preventDefault());
                  },
                  stopPropagation: () => {
                    ((e = !0), b.stopPropagation());
                  },
                });
              }
              d?.current && d.current(a);
            }
          }));
    }
    function r(a) {
      return g.use ? { fetchPriority: a } : { fetchpriority: a };
    }
    globalThis.__NEXT_IMAGE_IMPORTED = !0;
    let s = (0, g.forwardRef)(
      (
        {
          src: a,
          srcSet: b,
          sizes: c,
          height: d,
          width: e,
          decoding: h,
          className: i,
          style: j,
          fetchPriority: k,
          placeholder: l,
          loading: m,
          unoptimized: n,
          fill: p,
          onLoadRef: s,
          onLoadingCompleteRef: t,
          setBlurComplete: u,
          setShowAltText: v,
          sizesInput: w,
          onLoad: x,
          onError: y,
          ...z
        },
        A,
      ) => {
        let B = (0, g.useCallback)(
            (a) => {
              a && (y && (a.src = a.src), a.complete && q(a, l, s, t, u, n, w));
            },
            [a, l, s, t, u, y, n, w],
          ),
          C = (0, o.useMergedRef)(A, B);
        return (0, f.jsx)('img', {
          ...z,
          ...r(k),
          loading: m,
          width: e,
          height: d,
          decoding: h,
          'data-nimg': p ? 'fill' : '1',
          className: i,
          style: j,
          sizes: c,
          srcSet: b,
          src: a,
          ref: C,
          onLoad: (a) => {
            q(a.currentTarget, l, s, t, u, n, w);
          },
          onError: (a) => {
            (v(!0), 'empty' !== l && u(!0), y && y(a));
          },
        });
      },
    );
    function t({ isAppRouter: a, imgAttributes: b }) {
      let c = {
        as: 'image',
        imageSrcSet: b.srcSet,
        imageSizes: b.sizes,
        crossOrigin: b.crossOrigin,
        referrerPolicy: b.referrerPolicy,
        ...r(b.fetchPriority),
      };
      return a && h.default.preload
        ? (h.default.preload(b.src, c), null)
        : (0, f.jsx)(i.default, {
            children: (0, f.jsx)(
              'link',
              { rel: 'preload', href: b.srcSet ? void 0 : b.src, ...c },
              '__nimg-' + b.src + b.srcSet + b.sizes,
            ),
          });
    }
    let u = (0, g.forwardRef)((a, b) => {
      let c = (0, g.useContext)(m.RouterContext),
        d = (0, g.useContext)(l.ImageConfigContext),
        e = (0, g.useMemo)(() => {
          let a = p || d || k.imageConfigDefault,
            b = [...a.deviceSizes, ...a.imageSizes].sort((a, b) => a - b),
            c = a.deviceSizes.sort((a, b) => a - b),
            e = a.qualities?.sort((a, b) => a - b);
          return {
            ...a,
            allSizes: b,
            deviceSizes: c,
            qualities: e,
            localPatterns: d?.localPatterns,
          };
        }, [d]),
        { onLoad: h, onLoadingComplete: i } = a,
        o = (0, g.useRef)(h);
      (0, g.useEffect)(() => {
        o.current = h;
      }, [h]);
      let q = (0, g.useRef)(i);
      (0, g.useEffect)(() => {
        q.current = i;
      }, [i]);
      let [r, u] = (0, g.useState)(!1),
        [v, w] = (0, g.useState)(!1),
        { props: x, meta: y } = (0, j.getImgProps)(a, {
          defaultLoader: n.default,
          imgConf: e,
          blurComplete: r,
          showAltText: v,
        });
      return (0, f.jsxs)(f.Fragment, {
        children: [
          (0, f.jsx)(s, {
            ...x,
            unoptimized: y.unoptimized,
            placeholder: y.placeholder,
            fill: y.fill,
            onLoadRef: o,
            onLoadingCompleteRef: q,
            setBlurComplete: u,
            setShowAltText: w,
            sizesInput: a.sizes,
            ref: b,
          }),
          y.preload
            ? (0, f.jsx)(t, { isAppRouter: !c, imgAttributes: x })
            : null,
        ],
      });
    });
    ('function' == typeof c.default ||
      ('object' == typeof c.default && null !== c.default)) &&
      void 0 === c.default.__esModule &&
      (Object.defineProperty(c.default, '__esModule', { value: !0 }),
      Object.assign(c.default, c),
      (b.exports = c.default));
  },
  52181,
  (a, b, c) => {
    'use strict';
    Object.defineProperty(c, '__esModule', { value: !0 });
    var d = {
      default: function () {
        return k;
      },
      getImageProps: function () {
        return j;
      },
    };
    for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
    let f = a.r(63652),
      g = a.r(71446),
      h = a.r(49329),
      i = f._(a.r(55271));
    function j(a) {
      let { props: b } = (0, g.getImgProps)(a, {
        defaultLoader: i.default,
        imgConf: {
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [32, 48, 64, 96, 128, 256, 384],
          qualities: [75],
          path: '/_next/image',
          loader: 'default',
          dangerouslyAllowSVG: !1,
          unoptimized: !0,
        },
      });
      for (let [a, c] of Object.entries(b)) void 0 === c && delete b[a];
      return { props: b };
    }
    let k = h.Image;
  },
  24589,
  (a, b, c) => {
    b.exports = a.r(52181);
  },
  76629,
  (a) => {
    'use strict';
    var b = a.i(89272),
      c = a.i(24589);
    let d = {
      src: a.i(54185).default,
      width: 1024,
      height: 1024,
      blurWidth: 8,
      blurHeight: 8,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAhklEQVR42n3PPQqDQBCGYc+Ze6RMmyZdSOpADpAmfZILBBH8x0JBFEERRHf9meVzwULFxeItBh6GGU0Igb205UA0QBCpQcNrON4PtvUF42wLPraOw/WE8/MOw3e24O9aON4ueLxfCJN4DYa+Q5n5KFITVR6gLqPpnnkDSdTKOPqOyRr1F6pGym/0A5h9INsAAAAASUVORK5CYII=',
    };
    var e = a.i(26670),
      f = a.i(48954),
      g = a.i(67221);
    a.i(56120);
    var h = a.i(34910),
      i = a.i(76989),
      j = a.i(73127),
      k = a.i(10246),
      l = a.i(5221),
      m = a.i(10674),
      n = a.i(99409),
      o = a.i(85237),
      p = a.i(99737),
      q = a.i(55505),
      r = a.i(13241);
    function s(a) {
      return a ? new Date(a).toLocaleString() : 'Never';
    }
    function t(a) {
      let b = a.trim();
      return b
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b)
          ? null
          : 'Use a valid email address like admin@company.com.'
        : 'Enter the admin account email address.';
    }
    function u(a) {
      return a ? null : 'Enter your password.';
    }
    function v(a) {
      let b = a.trim();
      return b
        ? /^\d{6}$/.test(b)
          ? null
          : 'Authenticator codes use 6 digits.'
        : null;
    }
    a.s(
      [
        'AdminDashboardPage',
        0,
        function () {
          let a = (0, e.useRef)(!0),
            [w, x] = (0, e.useState)('loading'),
            [, y] = (0, e.useState)(null),
            [z, A] = (0, e.useState)(null),
            [B, C] = (0, e.useState)(null),
            [D, E] = (0, e.useState)(null),
            [F, G] = (0, e.useState)(null),
            [H, I] = (0, e.useState)(''),
            [J, K] = (0, e.useState)(''),
            [L, M] = (0, e.useState)(!1),
            [N, O] = (0, e.useState)(''),
            [P, Q] = (0, e.useState)(null),
            [R, S] = (0, e.useState)(null),
            [T, U] = (0, e.useState)(''),
            [V, W] = (0, e.useState)(!1),
            [X, Y] = (0, e.useState)(null),
            [Z, $] = (0, e.useState)({ email: !1, password: !1, mfaCode: !1 }),
            _ = Z.email || H.length > 0 ? t(H) : null,
            aa = Z.password || J.length > 0 ? u(J) : null,
            ab = Z.mfaCode || N.length > 0 ? v(N) : null,
            ac = 'unauthenticated' === w,
            ad =
              'unauthenticated' === w
                ? D
                  ? (0, b.jsx)(h.NoticeBanner, {
                      title: 'Sign in failed',
                      tone: 'danger',
                      children: (0, b.jsx)('p', {
                        style: { margin: 0 },
                        children: D,
                      }),
                    })
                  : F
                    ? (0, b.jsx)(h.NoticeBanner, {
                        title: 'Latest action',
                        tone: 'success',
                        children: (0, b.jsx)('p', {
                          style: { margin: 0 },
                          children: F,
                        }),
                      })
                    : null
                : null;
          function ae(a) {
            $((b) => (b[a] ? b : { ...b, [a]: !0 }));
          }
          function af() {
            $({ email: !1, password: !1, mfaCode: !1 });
          }
          (0, e.useEffect)(
            () => (
              (a.current = !0),
              ah().catch(() => {
                a.current &&
                  (x('unauthenticated'), E('Could not reach the API.'));
              }),
              () => {
                a.current = !1;
              }
            ),
            [],
          );
          let ag = (0, e.useEffectEvent)(async () => {
            let b = (0, r.readStoredToken)();
            if (!b || (await aj(b))) return;
            let c = await ai();
            if (!c) {
              if (!a.current) return;
              x('unauthenticated');
              return;
            }
            await aj(c);
          });
          async function ah() {
            let a = (0, r.readStoredToken)();
            if (a && (await aj(a))) return;
            let b = await ai();
            (b && (await aj(b))) || x('unauthenticated');
          }
          async function ai() {
            let b = await fetch(`${r.apiBaseUrl}/api/v1/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            });
            if (!b.ok)
              return ((0, r.clearStoredToken)(), a.current && y(null), null);
            let c = await b.json();
            return (
              (0, r.writeStoredToken)(c.accessToken),
              a.current && y(c.accessToken),
              c.accessToken
            );
          }
          async function aj(b) {
            let [c, d, e] = await Promise.all([
              fetch(`${r.apiBaseUrl}/api/v1/account/me`, {
                headers: { authorization: `Bearer ${b}` },
                credentials: 'include',
              }),
              fetch(`${r.apiBaseUrl}/api/v1/admin/overview`, {
                headers: { authorization: `Bearer ${b}` },
                credentials: 'include',
              }),
              fetch(`${r.apiBaseUrl}/api/v1/auth/admin/mfa`, {
                headers: { authorization: `Bearer ${b}` },
                credentials: 'include',
              }),
            ]);
            if (401 === c.status || 401 === d.status || 401 === e.status)
              return !1;
            if (403 === d.status)
              return (
                a.current &&
                  (E('This account is not allowed to open the admin console.'),
                  x('unauthenticated')),
                !1
              );
            if (!c.ok || !d.ok || !e.ok)
              return (
                !!a.current &&
                (E('Could not load the admin overview.'),
                x('unauthenticated'),
                !1)
              );
            let f = await c.json(),
              g = await d.json(),
              h = await e.json();
            return (
              !!a.current &&
              ((0, m.setGlobalThemePreference)(
                (0, q.resolveAdminThemePreference)(f.themePreference),
              ),
              y(b),
              A(f),
              C(g),
              Q(h),
              x('ready'),
              !0)
            );
          }
          async function ak(b) {
            (b.preventDefault(),
              E(null),
              G(null),
              $({ email: !0, password: !0, mfaCode: !!N.trim() }));
            let c = t(H),
              d = u(J),
              e = v(N);
            if (c || d || e) {
              (E('Fix the highlighted fields and try again.'),
                x('unauthenticated'));
              return;
            }
            W(!0);
            try {
              let b = await fetch(`${r.apiBaseUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  email: H,
                  password: J,
                  mfaCode: N.trim() || void 0,
                }),
              });
              if (!b.ok) {
                let c = await b.json().catch(() => null);
                a.current &&
                  (E(
                    c?.message ??
                      'Login failed. Use the bootstrap admin account.',
                  ),
                  x('unauthenticated'));
                return;
              }
              let c = await b.json();
              if (((0, r.writeStoredToken)(c.accessToken), !a.current)) return;
              (y(c.accessToken),
                (await aj(c.accessToken)) &&
                  (M(!1), af(), G(`Signed in as ${c.user.displayName}.`)));
            } finally {
              W(!1);
            }
          }
          async function al() {
            (await fetch(`${r.apiBaseUrl}/api/v1/auth/logout`, {
              method: 'POST',
              credentials: 'include',
            }),
              (0, r.clearStoredToken)(),
              a.current &&
                (y(null),
                A(null),
                C(null),
                Q(null),
                S(null),
                O(''),
                U(''),
                M(!1),
                af(),
                G(null),
                E(null),
                x('unauthenticated')));
          }
          async function am() {
            let a = (0, r.readStoredToken)();
            if (!a) return void x('unauthenticated');
            (Y('challenge'), E(null), G(null));
            try {
              let b = await fetch(
                `${r.apiBaseUrl}/api/v1/auth/admin/mfa/challenge`,
                {
                  method: 'POST',
                  headers: { authorization: `Bearer ${a}` },
                  credentials: 'include',
                },
              );
              if (401 === b.status) return void x('unauthenticated');
              if (!b.ok) {
                let a = await b.json().catch(() => null);
                throw Error(a?.message ?? 'Could not start admin MFA setup.');
              }
              let c = await b.json();
              (S(c),
                G(
                  'Scan the QR code in your authenticator app, then verify with a six-digit code.',
                ));
            } catch (a) {
              E(
                a instanceof Error
                  ? a.message
                  : 'Could not start admin MFA setup.',
              );
            } finally {
              Y(null);
            }
          }
          async function an(a) {
            a.preventDefault();
            let b = (0, r.readStoredToken)();
            if (!b) return void x('unauthenticated');
            (Y('verify'), E(null), G(null));
            try {
              let a = await fetch(
                `${r.apiBaseUrl}/api/v1/auth/admin/mfa/verify`,
                {
                  method: 'POST',
                  headers: {
                    authorization: `Bearer ${b}`,
                    'content-type': 'application/json',
                  },
                  credentials: 'include',
                  body: JSON.stringify({ code: T.trim() }),
                },
              );
              if (401 === a.status) return void x('unauthenticated');
              if (!a.ok) {
                let b = await a.json().catch(() => null);
                throw Error(
                  b?.message ?? 'Could not verify the admin MFA code.',
                );
              }
              let c = await a.json();
              (Q(c),
                S(null),
                U(''),
                G('Admin MFA is now enabled for this account.'));
            } catch (a) {
              E(
                a instanceof Error
                  ? a.message
                  : 'Could not verify the admin MFA code.',
              );
            } finally {
              Y(null);
            }
          }
          return (
            (0, e.useEffect)(() => {
              if ('ready' !== w) return;
              let a = (0, f.io)(r.apiBaseUrl, {
                  path: '/socket.io',
                  transports: ['websocket', 'polling'],
                  withCredentials: !0,
                }),
                b = null,
                c = () => {
                  b ||
                    (b = setTimeout(() => {
                      ((b = null), ag());
                    }, 250));
                };
              return (
                Object.values(g.websocketEventNames).forEach((b) => {
                  a.on(b, c);
                }),
                () => {
                  (b && clearTimeout(b),
                    Object.values(g.websocketEventNames).forEach((b) => {
                      a.off(b, c);
                    }),
                    a.disconnect());
                }
              );
            }, [w]),
            (0, b.jsxs)(i.AppShell, {
              title: 'Admin Operations Console',
              subtitle:
                'Monitor worker health, track platform-wide runtime state, and intervene on problem sessions from an operations console designed for continuous oversight.',
              surface: ac ? 'customer' : 'admin',
              contentWidth: ac ? 'full' : 'wide',
              headerMode: ac ? 'hidden' : 'default',
              nav:
                'ready' === w && z
                  ? (0, b.jsx)(n.AdminNav, { current: 'dashboard', account: z })
                  : void 0,
              headerActions:
                'ready' === w && z
                  ? (0, b.jsx)(p.AdminTopbarControls, { account: z })
                  : void 0,
              meta:
                'ready' === w && z
                  ? (0, b.jsx)(h.StatusBadge, {
                      tone: 'warning',
                      children: z.user.role.replaceAll('_', ' '),
                    })
                  : (0, b.jsx)(h.StatusBadge, {
                      tone: 'neutral',
                      children: 'Admin Surface',
                    }),
              footer:
                'ready' === w
                  ? 'Admin actions still stay controlled in this phase, but the dashboard now reflects runtime and worker changes as they happen.'
                  : void 0,
              children: [
                'loading' === w
                  ? (0, b.jsx)(k.InfoCard, {
                      eyebrow: 'Session',
                      title: 'Connecting to the admin API',
                      children: (0, b.jsx)('p', {
                        style: { margin: 0 },
                        children:
                          'Checking for a refresh session and loading the current overview snapshot.',
                      }),
                    })
                  : null,
                'unauthenticated' === w
                  ? (0, b.jsx)(j.AuthSplitLayout, {
                      surface: 'customer',
                      variant: 'spotlight',
                      heroMediaOnly: !0,
                      heroMedia: (0, b.jsx)('div', {
                        className: 'elite-login-brand-stage',
                        children: (0, b.jsx)(c.default, {
                          src: d,
                          alt: 'Elite Message brand logo.',
                          width: 1200,
                          height: 1200,
                          priority: !0,
                          sizes:
                            '(max-width: 720px) 0px, (max-width: 1024px) 48vw, 50vw',
                          className: 'elite-login-brand-image',
                        }),
                      }),
                      panelEyebrow: 'Admin login',
                      panelTitle: 'Sign in to continue',
                      panelAction: (0, b.jsx)('div', {
                        className: 'elite-toolbar',
                        children: (0, b.jsx)(o.AdminThemeControl, {}),
                      }),
                      children: (0, b.jsxs)('form', {
                        className: 'elite-auth-form',
                        onSubmit: ak,
                        noValidate: !0,
                        children: [
                          ad,
                          (0, b.jsx)(h.Field, {
                            label: 'Email address',
                            tone: _ ? 'danger' : 'neutral',
                            hint:
                              _ ??
                              'Use the email bound to your platform admin account.',
                            children: (0, b.jsx)(h.TextInput, {
                              value: H,
                              onChange: (a) => I(a.target.value),
                              onBlur: () => ae('email'),
                              type: 'email',
                              autoComplete: 'email',
                              placeholder: 'admin@company.com',
                              'aria-invalid': _ ? 'true' : void 0,
                              required: !0,
                            }),
                          }),
                          (0, b.jsx)(h.Field, {
                            label: 'Password',
                            tone: aa ? 'danger' : 'neutral',
                            hint:
                              aa ??
                              'Use the current password for this admin account.',
                            children: (0, b.jsx)(j.PasswordInput, {
                              value: J,
                              onChange: (a) => K(a.target.value),
                              onBlur: () => ae('password'),
                              revealed: L,
                              onToggleVisibility: () => M((a) => !a),
                              autoComplete: 'current-password',
                              placeholder: 'Enter your password',
                              'aria-invalid': aa ? 'true' : void 0,
                              required: !0,
                            }),
                          }),
                          (0, b.jsx)(h.Field, {
                            label: 'Authenticator code',
                            tone: ab ? 'danger' : 'neutral',
                            hint:
                              ab ??
                              'Optional until MFA is enabled. When used, it must be a 6-digit TOTP code.',
                            children: (0, b.jsx)(h.TextInput, {
                              value: N,
                              onChange: (a) => O(a.target.value),
                              onBlur: () => ae('mfaCode'),
                              inputMode: 'numeric',
                              pattern: '[0-9]*',
                              placeholder: '123456',
                              'aria-invalid': ab ? 'true' : void 0,
                            }),
                          }),
                          (0, b.jsx)(h.ActionButton, {
                            type: 'submit',
                            size: 'compact',
                            stretch: !0,
                            disabled: V,
                            children: V ? 'Signing in...' : 'Sign in',
                          }),
                        ],
                      }),
                    })
                  : null,
                'ready' === w && z && B
                  ? (0, b.jsxs)(b.Fragment, {
                      children: [
                        (0, b.jsx)(k.InfoCard, {
                          eyebrow: 'Operator',
                          title: `${z.user.displayName} (${z.user.role})`,
                          action: (0, b.jsx)(h.ActionButton, {
                            type: 'button',
                            tone: 'secondary',
                            onClick: al,
                            children: 'Log out',
                          }),
                          children: (0, b.jsxs)('div', {
                            style: { display: 'grid', gap: 16 },
                            children: [
                              (0, b.jsxs)('div', {
                                style: {
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 10,
                                  alignItems: 'center',
                                },
                                children: [
                                  (0, b.jsx)(h.StatusBadge, {
                                    tone: 'warning',
                                    children: z.user.email,
                                  }),
                                  (0, b.jsx)(h.StatusBadge, {
                                    tone: 'neutral',
                                    children: 'Global view',
                                  }),
                                  (0, b.jsxs)(h.StatusBadge, {
                                    tone: P?.enabled
                                      ? 'success'
                                      : P?.pending
                                        ? 'warning'
                                        : 'danger',
                                    children: [
                                      'MFA',
                                      ' ',
                                      P?.enabled
                                        ? 'enabled'
                                        : P?.pending
                                          ? 'pending'
                                          : 'disabled',
                                    ],
                                  }),
                                ],
                              }),
                              (0, b.jsxs)(h.MetricGrid, {
                                minItemWidth: 160,
                                children: [
                                  (0, b.jsx)(h.MetricCard, {
                                    label: 'Users',
                                    value: B.counts.users,
                                    hint: 'Operator accounts',
                                  }),
                                  (0, b.jsx)(h.MetricCard, {
                                    label: 'Workspaces',
                                    value: B.counts.workspaces,
                                    hint: 'Tenant containers',
                                  }),
                                  (0, b.jsx)(h.MetricCard, {
                                    label: 'Instances',
                                    value: B.counts.instances,
                                    hint: 'Runtime records',
                                  }),
                                  (0, b.jsx)(h.MetricCard, {
                                    label: 'Workers',
                                    value: B.counts.workers,
                                    hint: 'Active heartbeat sources',
                                    tone: 'info',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        (0, b.jsx)(k.InfoCard, {
                          eyebrow: 'Security',
                          title: 'Admin MFA',
                          action: (0, b.jsx)(h.ActionButton, {
                            type: 'button',
                            tone: 'secondary',
                            onClick: am,
                            disabled: 'challenge' === X,
                            children:
                              'challenge' === X
                                ? 'Preparing...'
                                : P?.enabled
                                  ? 'Rotate MFA'
                                  : 'Set up MFA',
                          }),
                          children: (0, b.jsxs)('div', {
                            style: { display: 'grid', gap: 16 },
                            children: [
                              (0, b.jsx)('p', {
                                style: {
                                  margin: 0,
                                  color: 'var(--elite-muted)',
                                },
                                children:
                                  'Platform admins can protect dashboard access with TOTP-based MFA. Once enabled, login requires the six-digit code.',
                              }),
                              (0, b.jsxs)('div', {
                                style: {
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 10,
                                },
                                children: [
                                  (0, b.jsx)(h.StatusBadge, {
                                    tone: P?.enabled ? 'success' : 'warning',
                                    children: P?.enabled
                                      ? 'Enabled'
                                      : 'Not enabled',
                                  }),
                                  P?.configuredAt
                                    ? (0, b.jsxs)(h.StatusBadge, {
                                        tone: 'neutral',
                                        children: [
                                          'Configured ',
                                          s(P.configuredAt),
                                        ],
                                      })
                                    : null,
                                ],
                              }),
                              R
                                ? (0, b.jsxs)('div', {
                                    style: { display: 'grid', gap: 16 },
                                    children: [
                                      (0, b.jsx)(l.QrPayloadView, {
                                        payload: R.otpauthUrl,
                                        alt: 'Admin MFA setup QR code',
                                      }),
                                      (0, b.jsx)(h.Field, {
                                        label: 'Shared secret',
                                        children: (0, b.jsx)(h.TextInput, {
                                          value: R.secret,
                                          readOnly: !0,
                                        }),
                                      }),
                                      (0, b.jsxs)('form', {
                                        onSubmit: an,
                                        style: { display: 'grid', gap: 14 },
                                        children: [
                                          (0, b.jsx)(h.Field, {
                                            label: 'Verification code',
                                            children: (0, b.jsx)(h.TextInput, {
                                              value: T,
                                              onChange: (a) =>
                                                U(a.target.value),
                                              inputMode: 'numeric',
                                              pattern: '[0-9]*',
                                              required: !0,
                                            }),
                                          }),
                                          (0, b.jsx)(h.ActionButton, {
                                            type: 'submit',
                                            disabled: 'verify' === X,
                                            children:
                                              'verify' === X
                                                ? 'Verifying...'
                                                : 'Enable MFA',
                                          }),
                                        ],
                                      }),
                                    ],
                                  })
                                : null,
                            ],
                          }),
                        }),
                        (0, b.jsxs)(h.SectionGrid, {
                          minItemWidth: 320,
                          children: [
                            (0, b.jsx)(k.InfoCard, {
                              eyebrow: 'Workers',
                              title: 'Heartbeat and capacity',
                              children:
                                0 === B.workers.length
                                  ? (0, b.jsx)('p', {
                                      style: { margin: 0 },
                                      children:
                                        'No worker heartbeat has been persisted yet.',
                                    })
                                  : (0, b.jsx)('ul', {
                                      className: 'elite-list',
                                      children: B.workers.map((a) =>
                                        (0, b.jsxs)(
                                          'li',
                                          {
                                            className: 'elite-list-item',
                                            children: [
                                              (0, b.jsxs)('div', {
                                                className: 'elite-list-title',
                                                children: [
                                                  (0, b.jsx)('span', {
                                                    children: a.workerId,
                                                  }),
                                                  (0, b.jsx)(h.StatusBadge, {
                                                    tone:
                                                      'online' === a.status
                                                        ? 'success'
                                                        : 'warning',
                                                    children: a.status,
                                                  }),
                                                ],
                                              }),
                                              (0, b.jsxs)('div', {
                                                className: 'elite-list-meta',
                                                children: [
                                                  (0, b.jsxs)('span', {
                                                    children: [
                                                      'Region ',
                                                      a.region,
                                                    ],
                                                  }),
                                                  (0, b.jsxs)('span', {
                                                    children: [
                                                      'Last seen ',
                                                      s(a.lastSeenAt),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              (0, b.jsxs)('div', {
                                                className:
                                                  'elite-definition-grid',
                                                style: {
                                                  '--elite-grid-min': '120px',
                                                },
                                                children: [
                                                  (0, b.jsxs)('div', {
                                                    className:
                                                      'elite-definition-item',
                                                    children: [
                                                      (0, b.jsx)('div', {
                                                        className:
                                                          'elite-definition-label',
                                                        children: 'Uptime',
                                                      }),
                                                      (0, b.jsxs)('div', {
                                                        className:
                                                          'elite-definition-value',
                                                        children: [
                                                          a.uptimeSeconds,
                                                          's',
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                  (0, b.jsxs)('div', {
                                                    className:
                                                      'elite-definition-item',
                                                    children: [
                                                      (0, b.jsx)('div', {
                                                        className:
                                                          'elite-definition-label',
                                                        children: 'Assigned',
                                                      }),
                                                      (0, b.jsx)('div', {
                                                        className:
                                                          'elite-definition-value',
                                                        children:
                                                          a.activeInstanceCount,
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          },
                                          a.id,
                                        ),
                                      ),
                                    }),
                            }),
                            (0, b.jsx)(k.InfoCard, {
                              eyebrow: 'Users',
                              title: 'Account summary',
                              children: (0, b.jsx)('ul', {
                                className: 'elite-list',
                                children: B.users.map((a) =>
                                  (0, b.jsxs)(
                                    'li',
                                    {
                                      className: 'elite-list-item',
                                      children: [
                                        (0, b.jsxs)('div', {
                                          className: 'elite-list-title',
                                          children: [
                                            (0, b.jsx)('span', {
                                              children: a.displayName,
                                            }),
                                            (0, b.jsx)(h.StatusBadge, {
                                              tone:
                                                'platform_admin' === a.role
                                                  ? 'warning'
                                                  : 'neutral',
                                              children: a.role,
                                            }),
                                          ],
                                        }),
                                        (0, b.jsxs)('div', {
                                          className: 'elite-list-meta',
                                          children: [
                                            (0, b.jsx)('span', {
                                              children: a.email,
                                            }),
                                            (0, b.jsxs)('span', {
                                              children: [
                                                'Created ',
                                                s(a.createdAt),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, b.jsxs)('div', {
                                          className: 'elite-definition-grid',
                                          style: {
                                            '--elite-grid-min': '120px',
                                          },
                                          children: [
                                            (0, b.jsxs)('div', {
                                              className:
                                                'elite-definition-item',
                                              children: [
                                                (0, b.jsx)('div', {
                                                  className:
                                                    'elite-definition-label',
                                                  children: 'Workspaces',
                                                }),
                                                (0, b.jsx)('div', {
                                                  className:
                                                    'elite-definition-value',
                                                  children: a.workspaceCount,
                                                }),
                                              ],
                                            }),
                                            (0, b.jsxs)('div', {
                                              className:
                                                'elite-definition-item',
                                              children: [
                                                (0, b.jsx)('div', {
                                                  className:
                                                    'elite-definition-label',
                                                  children: 'Instances',
                                                }),
                                                (0, b.jsx)('div', {
                                                  className:
                                                    'elite-definition-value',
                                                  children: a.instanceCount,
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                    a.id,
                                  ),
                                ),
                              }),
                            }),
                          ],
                        }),
                        (0, b.jsx)(k.InfoCard, {
                          eyebrow: 'Instances',
                          title: 'Global instance view',
                          children:
                            0 === B.instances.length
                              ? (0, b.jsx)('p', {
                                  style: { margin: 0 },
                                  children:
                                    'No instances have been created yet.',
                                })
                              : (0, b.jsx)('div', {
                                  className: 'elite-section-grid',
                                  style: { '--elite-grid-min': '260px' },
                                  children: B.instances.map((a) => {
                                    var c;
                                    return (0, b.jsxs)(
                                      'article',
                                      {
                                        className: 'elite-list-item',
                                        children: [
                                          (0, b.jsxs)('div', {
                                            className: 'elite-list-title',
                                            children: [
                                              (0, b.jsxs)('span', {
                                                children: [
                                                  a.name,
                                                  ' (',
                                                  a.publicId,
                                                  ')',
                                                ],
                                              }),
                                              (0, b.jsxs)(h.StatusBadge, {
                                                tone: (function (a) {
                                                  switch (a) {
                                                    case 'authenticated':
                                                      return 'success';
                                                    case 'qr':
                                                    case 'loading':
                                                    case 'initialize':
                                                    case 'booting':
                                                    case 'retrying':
                                                      return 'warning';
                                                    case 'disconnected':
                                                    case 'standby':
                                                    case 'stopped':
                                                      return 'neutral';
                                                    default:
                                                      return 'info';
                                                  }
                                                })(a.status),
                                                children: [
                                                  a.status,
                                                  ' /',
                                                  ' ',
                                                  (c = a.substatus)
                                                    ? c.replaceAll('_', ' ')
                                                    : 'None',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, b.jsxs)('div', {
                                            className: 'elite-list-meta',
                                            children: [
                                              (0, b.jsx)('span', {
                                                children: a.workspaceName,
                                              }),
                                              (0, b.jsxs)('span', {
                                                children: [
                                                  'Last lifecycle event',
                                                  ' ',
                                                  s(a.latestEventAt),
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, b.jsx)('div', {
                                            className: 'elite-definition-grid',
                                            style: {
                                              '--elite-grid-min': '130px',
                                            },
                                            children: (0, b.jsxs)('div', {
                                              className:
                                                'elite-definition-item',
                                              children: [
                                                (0, b.jsx)('div', {
                                                  className:
                                                    'elite-definition-label',
                                                  children: 'Worker',
                                                }),
                                                (0, b.jsx)('div', {
                                                  className:
                                                    'elite-definition-value',
                                                  children: a.assignedWorkerId
                                                    ? `${a.assignedWorkerId}${a.assignedWorkerRegion ? ` (${a.assignedWorkerRegion})` : ''}`
                                                    : 'Unassigned',
                                                }),
                                              ],
                                            }),
                                          }),
                                          (0, b.jsx)('div', {
                                            children: (0, b.jsx)('a', {
                                              href: `/instances/${a.id}`,
                                              children: 'Open admin detail',
                                            }),
                                          }),
                                        ],
                                      },
                                      a.id,
                                    );
                                  }),
                                }),
                        }),
                      ],
                    })
                  : null,
                'unauthenticated' !== w && D
                  ? (0, b.jsx)(h.NoticeBanner, {
                      title: 'Action failed',
                      tone: 'danger',
                      children: (0, b.jsx)('p', {
                        style: { margin: 0 },
                        children: D,
                      }),
                    })
                  : null,
                'unauthenticated' !== w && F
                  ? (0, b.jsx)(h.NoticeBanner, {
                      title: 'Latest action',
                      tone: 'success',
                      children: (0, b.jsx)('p', {
                        style: { margin: 0 },
                        children: F,
                      }),
                    })
                  : null,
              ],
            })
          );
        },
      ],
      76629,
    );
  },
];

//# sourceMappingURL=_0ebtwl8._.js.map
