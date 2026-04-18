(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'object' == typeof document ? document.currentScript : void 0,
  9216,
  (e, t, i) => {
    'use strict';
    function n({
      widthInt: e,
      heightInt: t,
      blurWidth: i,
      blurHeight: a,
      blurDataURL: r,
      objectFit: s,
    }) {
      let l = i ? 40 * i : e,
        o = a ? 40 * a : t,
        d = l && o ? `viewBox='0 0 ${l} ${o}'` : '';
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d ? 'none' : 'contain' === s ? 'xMidYMid' : 'cover' === s ? 'xMidYMid slice' : 'none'}' style='filter: url(%23b);' href='${r}'/%3E%3C/svg%3E`;
    }
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'getImageBlurSvg', {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
  },
  70110,
  (e, t, i) => {
    'use strict';
    Object.defineProperty(i, '__esModule', { value: !0 });
    var n = {
      VALID_LOADERS: function () {
        return r;
      },
      imageConfigDefault: function () {
        return s;
      },
    };
    for (var a in n) Object.defineProperty(i, a, { enumerable: !0, get: n[a] });
    let r = ['default', 'imgix', 'cloudinary', 'akamai', 'custom'],
      s = {
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
  74829,
  (e, t, i) => {
    'use strict';
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'getImgProps', {
        enumerable: !0,
        get: function () {
          return d;
        },
      }),
      e.r(75780));
    let n = e.r(62451),
      a = e.r(9216),
      r = e.r(70110),
      s = ['-moz-initial', 'fill', 'none', 'scale-down', void 0];
    function l(e) {
      return void 0 !== e.default;
    }
    function o(e) {
      return void 0 === e
        ? e
        : 'number' == typeof e
          ? Number.isFinite(e)
            ? e
            : NaN
          : 'string' == typeof e && /^[0-9]+$/.test(e)
            ? parseInt(e, 10)
            : NaN;
    }
    function d(
      {
        src: e,
        sizes: t,
        unoptimized: i = !1,
        priority: c = !1,
        preload: u = !1,
        loading: f,
        className: h,
        quality: m,
        width: p,
        height: g,
        fill: v = !1,
        style: y,
        overrideSrc: b,
        onLoad: x,
        onLoadingComplete: j,
        placeholder: w = 'empty',
        blurDataURL: S,
        fetchPriority: C,
        decoding: A = 'async',
        layout: _,
        objectFit: P,
        objectPosition: O,
        lazyBoundary: E,
        lazyRoot: N,
        ...k
      },
      I,
    ) {
      var R;
      let M,
        T,
        B,
        { imgConf: $, showAltText: z, blurComplete: U, defaultLoader: F } = I,
        D = $ || r.imageConfigDefault;
      if ('allSizes' in D) M = D;
      else {
        let e = [...D.deviceSizes, ...D.imageSizes].sort((e, t) => e - t),
          t = D.deviceSizes.sort((e, t) => e - t),
          i = D.qualities?.sort((e, t) => e - t);
        M = { ...D, allSizes: e, deviceSizes: t, qualities: i };
      }
      if (void 0 === F)
        throw Object.defineProperty(
          Error(
            'images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config',
          ),
          '__NEXT_ERROR_CODE',
          { value: 'E163', enumerable: !1, configurable: !0 },
        );
      let L = k.loader || F;
      (delete k.loader, delete k.srcSet);
      let W = '__next_img_default' in L;
      if (W) {
        if ('custom' === M.loader)
          throw Object.defineProperty(
            Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),
            '__NEXT_ERROR_CODE',
            { value: 'E252', enumerable: !1, configurable: !0 },
          );
      } else {
        let e = L;
        L = (t) => {
          let { config: i, ...n } = t;
          return e(n);
        };
      }
      if (_) {
        'fill' === _ && (v = !0);
        let e = {
          intrinsic: { maxWidth: '100%', height: 'auto' },
          responsive: { width: '100%', height: 'auto' },
        }[_];
        e && (y = { ...y, ...e });
        let i = { responsive: '100vw', fill: '100vw' }[_];
        i && !t && (t = i);
      }
      let q = '',
        G = o(p),
        V = o(g);
      if ((R = e) && 'object' == typeof R && (l(R) || void 0 !== R.src)) {
        let t = l(e) ? e.default : e;
        if (!t.src)
          throw Object.defineProperty(
            Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`,
            ),
            '__NEXT_ERROR_CODE',
            { value: 'E460', enumerable: !1, configurable: !0 },
          );
        if (!t.height || !t.width)
          throw Object.defineProperty(
            Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`,
            ),
            '__NEXT_ERROR_CODE',
            { value: 'E48', enumerable: !1, configurable: !0 },
          );
        if (
          ((T = t.blurWidth),
          (B = t.blurHeight),
          (S = S || t.blurDataURL),
          (q = t.src),
          !v)
        )
          if (G || V) {
            if (G && !V) {
              let e = G / t.width;
              V = Math.round(t.height * e);
            } else if (!G && V) {
              let e = V / t.height;
              G = Math.round(t.width * e);
            }
          } else ((G = t.width), (V = t.height));
      }
      let Q = !c && !u && ('lazy' === f || void 0 === f);
      ((!(e = 'string' == typeof e ? e : q) ||
        e.startsWith('data:') ||
        e.startsWith('blob:')) &&
        ((i = !0), (Q = !1)),
        M.unoptimized && (i = !0),
        W &&
          !M.dangerouslyAllowSVG &&
          e.split('?', 1)[0].endsWith('.svg') &&
          (i = !0));
      let H = o(m),
        J = Object.assign(
          v
            ? {
                position: 'absolute',
                height: '100%',
                width: '100%',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: P,
                objectPosition: O,
              }
            : {},
          z ? {} : { color: 'transparent' },
          y,
        ),
        K =
          U || 'empty' === w
            ? null
            : 'blur' === w
              ? `url("data:image/svg+xml;charset=utf-8,${(0, a.getImageBlurSvg)({ widthInt: G, heightInt: V, blurWidth: T, blurHeight: B, blurDataURL: S || '', objectFit: J.objectFit })}")`
              : `url("${w}")`,
        X = s.includes(J.objectFit)
          ? 'fill' === J.objectFit
            ? '100% 100%'
            : 'cover'
          : J.objectFit,
        Y = K
          ? {
              backgroundSize: X,
              backgroundPosition: J.objectPosition || '50% 50%',
              backgroundRepeat: 'no-repeat',
              backgroundImage: K,
            }
          : {},
        Z = (function ({
          config: e,
          src: t,
          unoptimized: i,
          width: a,
          quality: r,
          sizes: s,
          loader: l,
        }) {
          if (i) {
            if (t.startsWith('/') && !t.startsWith('//')) {
              let e = (0, n.getDeploymentId)();
              if (e) {
                let i = t.indexOf('?');
                if (-1 !== i) {
                  let n = new URLSearchParams(t.slice(i + 1));
                  n.get('dpl') ||
                    (n.append('dpl', e),
                    (t = t.slice(0, i) + '?' + n.toString()));
                } else t += `?dpl=${e}`;
              }
            }
            return { src: t, srcSet: void 0, sizes: void 0 };
          }
          let { widths: o, kind: d } = (function (
              { deviceSizes: e, allSizes: t },
              i,
              n,
            ) {
              if (n) {
                let i = /(^|\s)(1?\d?\d)vw/g,
                  a = [];
                for (let e; (e = i.exec(n)); ) a.push(parseInt(e[2]));
                if (a.length) {
                  let i = 0.01 * Math.min(...a);
                  return { widths: t.filter((t) => t >= e[0] * i), kind: 'w' };
                }
                return { widths: t, kind: 'w' };
              }
              return 'number' != typeof i
                ? { widths: e, kind: 'w' }
                : {
                    widths: [
                      ...new Set(
                        [i, 2 * i].map(
                          (e) => t.find((t) => t >= e) || t[t.length - 1],
                        ),
                      ),
                    ],
                    kind: 'x',
                  };
            })(e, a, s),
            c = o.length - 1;
          return {
            sizes: s || 'w' !== d ? s : '100vw',
            srcSet: o
              .map(
                (i, n) =>
                  `${l({ config: e, src: t, quality: r, width: i })} ${'w' === d ? i : n + 1}${d}`,
              )
              .join(', '),
            src: l({ config: e, src: t, quality: r, width: o[c] }),
          };
        })({
          config: M,
          src: e,
          unoptimized: i,
          width: G,
          quality: H,
          sizes: t,
          loader: L,
        }),
        ee = Q ? 'lazy' : f;
      return {
        props: {
          ...k,
          loading: ee,
          fetchPriority: C,
          width: G,
          height: V,
          decoding: A,
          className: h,
          style: { ...J, ...Y },
          sizes: Z.sizes,
          srcSet: Z.srcSet,
          src: b || Z.src,
        },
        meta: { unoptimized: i, preload: u || c, placeholder: w, fill: v },
      };
    }
  },
  6356,
  (e, t, i) => {
    'use strict';
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'default', {
        enumerable: !0,
        get: function () {
          return l;
        },
      }));
    let n = e.r(11501),
      a = 'u' < typeof window,
      r = a ? () => {} : n.useLayoutEffect,
      s = a ? () => {} : n.useEffect;
    function l(e) {
      let { headManager: t, reduceComponentsToState: i } = e;
      function l() {
        if (t && t.mountedInstances) {
          let e = n.Children.toArray(
            Array.from(t.mountedInstances).filter(Boolean),
          );
          t.updateHead(i(e));
        }
      }
      return (
        a && (t?.mountedInstances?.add(e.children), l()),
        r(
          () => (
            t?.mountedInstances?.add(e.children),
            () => {
              t?.mountedInstances?.delete(e.children);
            }
          ),
        ),
        r(
          () => (
            t && (t._pendingUpdate = l),
            () => {
              t && (t._pendingUpdate = l);
            }
          ),
        ),
        s(
          () => (
            t &&
              t._pendingUpdate &&
              (t._pendingUpdate(), (t._pendingUpdate = null)),
            () => {
              t &&
                t._pendingUpdate &&
                (t._pendingUpdate(), (t._pendingUpdate = null));
            }
          ),
        ),
        null
      );
    }
  },
  33519,
  (e, t, i) => {
    'use strict';
    Object.defineProperty(i, '__esModule', { value: !0 });
    var n = {
      default: function () {
        return p;
      },
      defaultHead: function () {
        return u;
      },
    };
    for (var a in n) Object.defineProperty(i, a, { enumerable: !0, get: n[a] });
    let r = e.r(81258),
      s = e.r(44066),
      l = e.r(52759),
      o = s._(e.r(11501)),
      d = r._(e.r(6356)),
      c = e.r(31845);
    function u() {
      return [
        (0, l.jsx)('meta', { charSet: 'utf-8' }, 'charset'),
        (0, l.jsx)(
          'meta',
          { name: 'viewport', content: 'width=device-width' },
          'viewport',
        ),
      ];
    }
    function f(e, t) {
      return 'string' == typeof t || 'number' == typeof t
        ? e
        : t.type === o.default.Fragment
          ? e.concat(
              o.default.Children.toArray(t.props.children).reduce(
                (e, t) =>
                  'string' == typeof t || 'number' == typeof t
                    ? e
                    : e.concat(t),
                [],
              ),
            )
          : e.concat(t);
    }
    e.r(75780);
    let h = ['name', 'httpEquiv', 'charSet', 'itemProp'];
    function m(e) {
      let t, i, n, a;
      return e
        .reduce(f, [])
        .reverse()
        .concat(u().reverse())
        .filter(
          ((t = new Set()),
          (i = new Set()),
          (n = new Set()),
          (a = {}),
          (e) => {
            let r = !0,
              s = !1;
            if (e.key && 'number' != typeof e.key && e.key.indexOf('$') > 0) {
              s = !0;
              let i = e.key.slice(e.key.indexOf('$') + 1);
              t.has(i) ? (r = !1) : t.add(i);
            }
            switch (e.type) {
              case 'title':
              case 'base':
                i.has(e.type) ? (r = !1) : i.add(e.type);
                break;
              case 'meta':
                for (let t = 0, i = h.length; t < i; t++) {
                  let i = h[t];
                  if (e.props.hasOwnProperty(i))
                    if ('charSet' === i) n.has(i) ? (r = !1) : n.add(i);
                    else {
                      let t = e.props[i],
                        n = a[i] || new Set();
                      ('name' !== i || !s) && n.has(t)
                        ? (r = !1)
                        : (n.add(t), (a[i] = n));
                    }
                }
            }
            return r;
          }),
        )
        .reverse()
        .map((e, t) => {
          let i = e.key || t;
          return o.default.cloneElement(e, { key: i });
        });
    }
    let p = function ({ children: e }) {
      let t = (0, o.useContext)(c.HeadManagerContext);
      return (0, l.jsx)(d.default, {
        reduceComponentsToState: m,
        headManager: t,
        children: e,
      });
    };
    ('function' == typeof i.default ||
      ('object' == typeof i.default && null !== i.default)) &&
      void 0 === i.default.__esModule &&
      (Object.defineProperty(i.default, '__esModule', { value: !0 }),
      Object.assign(i.default, i),
      (t.exports = i.default));
  },
  91366,
  (e, t, i) => {
    'use strict';
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'ImageConfigContext', {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
    let n = e.r(81258)._(e.r(11501)),
      a = e.r(70110),
      r = n.default.createContext(a.imageConfigDefault);
  },
  29138,
  (e, t, i) => {
    'use strict';
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'RouterContext', {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let n = e.r(81258)._(e.r(11501)).default.createContext(null);
  },
  96025,
  (e, t, i) => {
    'use strict';
    function n(e, t) {
      let i = e || 75;
      return t?.qualities?.length
        ? t.qualities.reduce(
            (e, t) => (Math.abs(t - i) < Math.abs(e - i) ? t : e),
            t.qualities[0],
          )
        : i;
    }
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'findClosestQuality', {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
  },
  87145,
  (e, t, i) => {
    'use strict';
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'default', {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    let n = e.r(96025),
      a = e.r(62451);
    function r({ config: e, src: t, width: i, quality: s }) {
      let l = (0, a.getDeploymentId)();
      if (t.startsWith('/') && !t.startsWith('//')) {
        let e = t.indexOf('?');
        if (-1 !== e) {
          let i = new URLSearchParams(t.slice(e + 1)),
            n = i.get('dpl');
          if (n) {
            ((l = n), i.delete('dpl'));
            let a = i.toString();
            t = t.slice(0, e) + (a ? '?' + a : '');
          }
        }
      }
      if (
        t.startsWith('/') &&
        t.includes('?') &&
        e.localPatterns?.length === 1 &&
        '**' === e.localPatterns[0].pathname &&
        '' === e.localPatterns[0].search
      )
        throw Object.defineProperty(
          Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),
          '__NEXT_ERROR_CODE',
          { value: 'E871', enumerable: !1, configurable: !0 },
        );
      let o = (0, n.findClosestQuality)(s, e);
      return `${e.path}?url=${encodeURIComponent(t)}&w=${i}&q=${o}${t.startsWith('/') && l ? `&dpl=${l}` : ''}`;
    }
    r.__next_img_default = !0;
    let s = r;
  },
  50677,
  (e, t, i) => {
    'use strict';
    (Object.defineProperty(i, '__esModule', { value: !0 }),
      Object.defineProperty(i, 'Image', {
        enumerable: !0,
        get: function () {
          return x;
        },
      }));
    let n = e.r(81258),
      a = e.r(44066),
      r = e.r(52759),
      s = a._(e.r(11501)),
      l = n._(e.r(28223)),
      o = n._(e.r(33519)),
      d = e.r(74829),
      c = e.r(70110),
      u = e.r(91366);
    e.r(75780);
    let f = e.r(29138),
      h = n._(e.r(87145)),
      m = e.r(95379),
      p = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75],
        path: '/_next/image',
        loader: 'default',
        dangerouslyAllowSVG: !1,
        unoptimized: !0,
      };
    function g(e, t, i, n, a, r, s) {
      let l = e?.src;
      e &&
        e['data-loaded-src'] !== l &&
        ((e['data-loaded-src'] = l),
        ('decode' in e ? e.decode() : Promise.resolve())
          .catch(() => {})
          .then(() => {
            if (e.parentElement && e.isConnected) {
              if (('empty' !== t && a(!0), i?.current)) {
                let t = new Event('load');
                Object.defineProperty(t, 'target', { writable: !1, value: e });
                let n = !1,
                  a = !1;
                i.current({
                  ...t,
                  nativeEvent: t,
                  currentTarget: e,
                  target: e,
                  isDefaultPrevented: () => n,
                  isPropagationStopped: () => a,
                  persist: () => {},
                  preventDefault: () => {
                    ((n = !0), t.preventDefault());
                  },
                  stopPropagation: () => {
                    ((a = !0), t.stopPropagation());
                  },
                });
              }
              n?.current && n.current(e);
            }
          }));
    }
    function v(e) {
      return s.use ? { fetchPriority: e } : { fetchpriority: e };
    }
    'u' < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
    let y = (0, s.forwardRef)(
      (
        {
          src: e,
          srcSet: t,
          sizes: i,
          height: n,
          width: a,
          decoding: l,
          className: o,
          style: d,
          fetchPriority: c,
          placeholder: u,
          loading: f,
          unoptimized: h,
          fill: p,
          onLoadRef: y,
          onLoadingCompleteRef: b,
          setBlurComplete: x,
          setShowAltText: j,
          sizesInput: w,
          onLoad: S,
          onError: C,
          ...A
        },
        _,
      ) => {
        let P = (0, s.useCallback)(
            (e) => {
              e && (C && (e.src = e.src), e.complete && g(e, u, y, b, x, h, w));
            },
            [e, u, y, b, x, C, h, w],
          ),
          O = (0, m.useMergedRef)(_, P);
        return (0, r.jsx)('img', {
          ...A,
          ...v(c),
          loading: f,
          width: a,
          height: n,
          decoding: l,
          'data-nimg': p ? 'fill' : '1',
          className: o,
          style: d,
          sizes: i,
          srcSet: t,
          src: e,
          ref: O,
          onLoad: (e) => {
            g(e.currentTarget, u, y, b, x, h, w);
          },
          onError: (e) => {
            (j(!0), 'empty' !== u && x(!0), C && C(e));
          },
        });
      },
    );
    function b({ isAppRouter: e, imgAttributes: t }) {
      let i = {
        as: 'image',
        imageSrcSet: t.srcSet,
        imageSizes: t.sizes,
        crossOrigin: t.crossOrigin,
        referrerPolicy: t.referrerPolicy,
        ...v(t.fetchPriority),
      };
      return e && l.default.preload
        ? (l.default.preload(t.src, i), null)
        : (0, r.jsx)(o.default, {
            children: (0, r.jsx)(
              'link',
              { rel: 'preload', href: t.srcSet ? void 0 : t.src, ...i },
              '__nimg-' + t.src + t.srcSet + t.sizes,
            ),
          });
    }
    let x = (0, s.forwardRef)((e, t) => {
      let i = (0, s.useContext)(f.RouterContext),
        n = (0, s.useContext)(u.ImageConfigContext),
        a = (0, s.useMemo)(() => {
          let e = p || n || c.imageConfigDefault,
            t = [...e.deviceSizes, ...e.imageSizes].sort((e, t) => e - t),
            i = e.deviceSizes.sort((e, t) => e - t),
            a = e.qualities?.sort((e, t) => e - t);
          return {
            ...e,
            allSizes: t,
            deviceSizes: i,
            qualities: a,
            localPatterns:
              'u' < typeof window ? n?.localPatterns : e.localPatterns,
          };
        }, [n]),
        { onLoad: l, onLoadingComplete: o } = e,
        m = (0, s.useRef)(l);
      (0, s.useEffect)(() => {
        m.current = l;
      }, [l]);
      let g = (0, s.useRef)(o);
      (0, s.useEffect)(() => {
        g.current = o;
      }, [o]);
      let [v, x] = (0, s.useState)(!1),
        [j, w] = (0, s.useState)(!1),
        { props: S, meta: C } = (0, d.getImgProps)(e, {
          defaultLoader: h.default,
          imgConf: a,
          blurComplete: v,
          showAltText: j,
        });
      return (0, r.jsxs)(r.Fragment, {
        children: [
          (0, r.jsx)(y, {
            ...S,
            unoptimized: C.unoptimized,
            placeholder: C.placeholder,
            fill: C.fill,
            onLoadRef: m,
            onLoadingCompleteRef: g,
            setBlurComplete: x,
            setShowAltText: w,
            sizesInput: e.sizes,
            ref: t,
          }),
          C.preload
            ? (0, r.jsx)(b, { isAppRouter: !i, imgAttributes: S })
            : null,
        ],
      });
    });
    ('function' == typeof i.default ||
      ('object' == typeof i.default && null !== i.default)) &&
      void 0 === i.default.__esModule &&
      (Object.defineProperty(i.default, '__esModule', { value: !0 }),
      Object.assign(i.default, i),
      (t.exports = i.default));
  },
  56028,
  (e, t, i) => {
    'use strict';
    Object.defineProperty(i, '__esModule', { value: !0 });
    var n = {
      default: function () {
        return c;
      },
      getImageProps: function () {
        return d;
      },
    };
    for (var a in n) Object.defineProperty(i, a, { enumerable: !0, get: n[a] });
    let r = e.r(81258),
      s = e.r(74829),
      l = e.r(50677),
      o = r._(e.r(87145));
    function d(e) {
      let { props: t } = (0, s.getImgProps)(e, {
        defaultLoader: o.default,
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
      for (let [e, i] of Object.entries(t)) void 0 === i && delete t[e];
      return { props: t };
    }
    let c = l.Image;
  },
  63056,
  (e, t, i) => {
    t.exports = e.r(56028);
  },
  72495,
  (e) => {
    'use strict';
    e.i(86544);
    var t = e.i(52759),
      i = e.i(63056);
    let n = {
      src: e.i(54185).default,
      width: 1024,
      height: 1024,
      blurWidth: 8,
      blurHeight: 8,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAhklEQVR42n3PPQqDQBCGYc+Ze6RMmyZdSOpADpAmfZILBBH8x0JBFEERRHf9meVzwULFxeItBh6GGU0Igb205UA0QBCpQcNrON4PtvUF42wLPraOw/WE8/MOw3e24O9aON4ueLxfCJN4DYa+Q5n5KFITVR6gLqPpnnkDSdTKOPqOyRr1F6pGym/0A5h9INsAAAAASUVORK5CYII=',
    };
    var a = e.i(11501),
      r = e.i(86325),
      s = e.i(6553);
    e.i(16233);
    var l = e.i(37008),
      o = e.i(77219),
      d = e.i(25762),
      c = e.i(30516),
      u = e.i(9194),
      f = e.i(49153),
      h = e.i(84097),
      m = e.i(47548),
      p = e.i(75864),
      g = e.i(50189),
      v = e.i(252);
    function y(e) {
      return e ? new Date(e).toLocaleString() : 'Never';
    }
    function b(e) {
      let t = e.trim();
      return t
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
          ? null
          : 'Use a valid email address like admin@company.com.'
        : 'Enter the admin account email address.';
    }
    function x(e) {
      return e ? null : 'Enter your password.';
    }
    function j(e) {
      let t = e.trim();
      return t
        ? /^\d{6}$/.test(t)
          ? null
          : 'Authenticator codes use 6 digits.'
        : null;
    }
    e.s(
      [
        'AdminDashboardPage',
        0,
        function () {
          let e = (0, a.useRef)(!0),
            [w, S] = (0, a.useState)('loading'),
            [, C] = (0, a.useState)(null),
            [A, _] = (0, a.useState)(null),
            [P, O] = (0, a.useState)(null),
            [E, N] = (0, a.useState)(null),
            [k, I] = (0, a.useState)(null),
            [R, M] = (0, a.useState)(''),
            [T, B] = (0, a.useState)(''),
            [$, z] = (0, a.useState)(!1),
            [U, F] = (0, a.useState)(''),
            [D, L] = (0, a.useState)(null),
            [W, q] = (0, a.useState)(null),
            [G, V] = (0, a.useState)(''),
            [Q, H] = (0, a.useState)(!1),
            [J, K] = (0, a.useState)(null),
            [X, Y] = (0, a.useState)({ email: !1, password: !1, mfaCode: !1 }),
            Z = X.email || R.length > 0 ? b(R) : null,
            ee = X.password || T.length > 0 ? x(T) : null,
            et = X.mfaCode || U.length > 0 ? j(U) : null,
            ei = 'unauthenticated' === w,
            en =
              'unauthenticated' === w
                ? E
                  ? (0, t.jsx)(l.NoticeBanner, {
                      title: 'Sign in failed',
                      tone: 'danger',
                      children: (0, t.jsx)('p', {
                        style: { margin: 0 },
                        children: E,
                      }),
                    })
                  : k
                    ? (0, t.jsx)(l.NoticeBanner, {
                        title: 'Latest action',
                        tone: 'success',
                        children: (0, t.jsx)('p', {
                          style: { margin: 0 },
                          children: k,
                        }),
                      })
                    : null
                : null;
          function ea(e) {
            Y((t) => (t[e] ? t : { ...t, [e]: !0 }));
          }
          function er() {
            Y({ email: !1, password: !1, mfaCode: !1 });
          }
          (0, a.useEffect)(
            () => (
              (e.current = !0),
              el().catch(() => {
                e.current &&
                  (S('unauthenticated'), N('Could not reach the API.'));
              }),
              () => {
                e.current = !1;
              }
            ),
            [],
          );
          let es = (0, a.useEffectEvent)(async () => {
            let t = (0, v.readStoredToken)();
            if (!t || (await ed(t))) return;
            let i = await eo();
            if (!i) {
              if (!e.current) return;
              S('unauthenticated');
              return;
            }
            await ed(i);
          });
          async function el() {
            let e = (0, v.readStoredToken)();
            if (e && (await ed(e))) return;
            let t = await eo();
            (t && (await ed(t))) || S('unauthenticated');
          }
          async function eo() {
            let t = await fetch(`${v.apiBaseUrl}/api/v1/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            });
            if (!t.ok)
              return ((0, v.clearStoredToken)(), e.current && C(null), null);
            let i = await t.json();
            return (
              (0, v.writeStoredToken)(i.accessToken),
              e.current && C(i.accessToken),
              i.accessToken
            );
          }
          async function ed(t) {
            let [i, n, a] = await Promise.all([
              fetch(`${v.apiBaseUrl}/api/v1/account/me`, {
                headers: { authorization: `Bearer ${t}` },
                credentials: 'include',
              }),
              fetch(`${v.apiBaseUrl}/api/v1/admin/overview`, {
                headers: { authorization: `Bearer ${t}` },
                credentials: 'include',
              }),
              fetch(`${v.apiBaseUrl}/api/v1/auth/admin/mfa`, {
                headers: { authorization: `Bearer ${t}` },
                credentials: 'include',
              }),
            ]);
            if (401 === i.status || 401 === n.status || 401 === a.status)
              return !1;
            if (403 === n.status)
              return (
                e.current &&
                  (N('This account is not allowed to open the admin console.'),
                  S('unauthenticated')),
                !1
              );
            if (!i.ok || !n.ok || !a.ok)
              return (
                !!e.current &&
                (N('Could not load the admin overview.'),
                S('unauthenticated'),
                !1)
              );
            let r = await i.json(),
              s = await n.json(),
              l = await a.json();
            return (
              !!e.current &&
              ((0, f.setGlobalThemePreference)(
                (0, g.resolveAdminThemePreference)(r.themePreference),
              ),
              C(t),
              _(r),
              O(s),
              L(l),
              S('ready'),
              !0)
            );
          }
          async function ec(t) {
            (t.preventDefault(),
              N(null),
              I(null),
              Y({ email: !0, password: !0, mfaCode: !!U.trim() }));
            let i = b(R),
              n = x(T),
              a = j(U);
            if (i || n || a) {
              (N('Fix the highlighted fields and try again.'),
                S('unauthenticated'));
              return;
            }
            H(!0);
            try {
              let t = await fetch(`${v.apiBaseUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  email: R,
                  password: T,
                  mfaCode: U.trim() || void 0,
                }),
              });
              if (!t.ok) {
                let i = await t.json().catch(() => null);
                e.current &&
                  (N(
                    i?.message ??
                      'Login failed. Use the bootstrap admin account.',
                  ),
                  S('unauthenticated'));
                return;
              }
              let i = await t.json();
              if (((0, v.writeStoredToken)(i.accessToken), !e.current)) return;
              (C(i.accessToken),
                (await ed(i.accessToken)) &&
                  (z(!1), er(), I(`Signed in as ${i.user.displayName}.`)));
            } finally {
              H(!1);
            }
          }
          async function eu() {
            (await fetch(`${v.apiBaseUrl}/api/v1/auth/logout`, {
              method: 'POST',
              credentials: 'include',
            }),
              (0, v.clearStoredToken)(),
              e.current &&
                (C(null),
                _(null),
                O(null),
                L(null),
                q(null),
                F(''),
                V(''),
                z(!1),
                er(),
                I(null),
                N(null),
                S('unauthenticated')));
          }
          async function ef() {
            let e = (0, v.readStoredToken)();
            if (!e) return void S('unauthenticated');
            (K('challenge'), N(null), I(null));
            try {
              let t = await fetch(
                `${v.apiBaseUrl}/api/v1/auth/admin/mfa/challenge`,
                {
                  method: 'POST',
                  headers: { authorization: `Bearer ${e}` },
                  credentials: 'include',
                },
              );
              if (401 === t.status) return void S('unauthenticated');
              if (!t.ok) {
                let e = await t.json().catch(() => null);
                throw Error(e?.message ?? 'Could not start admin MFA setup.');
              }
              let i = await t.json();
              (q(i),
                I(
                  'Scan the QR code in your authenticator app, then verify with a six-digit code.',
                ));
            } catch (e) {
              N(
                e instanceof Error
                  ? e.message
                  : 'Could not start admin MFA setup.',
              );
            } finally {
              K(null);
            }
          }
          async function eh(e) {
            e.preventDefault();
            let t = (0, v.readStoredToken)();
            if (!t) return void S('unauthenticated');
            (K('verify'), N(null), I(null));
            try {
              let e = await fetch(
                `${v.apiBaseUrl}/api/v1/auth/admin/mfa/verify`,
                {
                  method: 'POST',
                  headers: {
                    authorization: `Bearer ${t}`,
                    'content-type': 'application/json',
                  },
                  credentials: 'include',
                  body: JSON.stringify({ code: G.trim() }),
                },
              );
              if (401 === e.status) return void S('unauthenticated');
              if (!e.ok) {
                let t = await e.json().catch(() => null);
                throw Error(
                  t?.message ?? 'Could not verify the admin MFA code.',
                );
              }
              let i = await e.json();
              (L(i),
                q(null),
                V(''),
                I('Admin MFA is now enabled for this account.'));
            } catch (e) {
              N(
                e instanceof Error
                  ? e.message
                  : 'Could not verify the admin MFA code.',
              );
            } finally {
              K(null);
            }
          }
          return (
            (0, a.useEffect)(() => {
              if ('ready' !== w) return;
              let e = (0, r.io)(v.apiBaseUrl, {
                  path: '/socket.io',
                  transports: ['websocket', 'polling'],
                  withCredentials: !0,
                }),
                t = null,
                i = () => {
                  t ||
                    (t = setTimeout(() => {
                      ((t = null), es());
                    }, 250));
                };
              return (
                Object.values(s.websocketEventNames).forEach((t) => {
                  e.on(t, i);
                }),
                () => {
                  (t && clearTimeout(t),
                    Object.values(s.websocketEventNames).forEach((t) => {
                      e.off(t, i);
                    }),
                    e.disconnect());
                }
              );
            }, [w]),
            (0, t.jsxs)(o.AppShell, {
              title: 'Admin Operations Console',
              subtitle:
                'Monitor worker health, track platform-wide runtime state, and intervene on problem sessions from an operations console designed for continuous oversight.',
              surface: ei ? 'customer' : 'admin',
              contentWidth: ei ? 'full' : 'wide',
              headerMode: ei ? 'hidden' : 'default',
              nav:
                'ready' === w && A
                  ? (0, t.jsx)(h.AdminNav, { current: 'dashboard', account: A })
                  : void 0,
              headerActions:
                'ready' === w && A
                  ? (0, t.jsx)(p.AdminTopbarControls, { account: A })
                  : void 0,
              meta:
                'ready' === w && A
                  ? (0, t.jsx)(l.StatusBadge, {
                      tone: 'warning',
                      children: A.user.role.replaceAll('_', ' '),
                    })
                  : (0, t.jsx)(l.StatusBadge, {
                      tone: 'neutral',
                      children: 'Admin Surface',
                    }),
              footer:
                'ready' === w
                  ? 'Admin actions still stay controlled in this phase, but the dashboard now reflects runtime and worker changes as they happen.'
                  : void 0,
              children: [
                'loading' === w
                  ? (0, t.jsx)(c.InfoCard, {
                      eyebrow: 'Session',
                      title: 'Connecting to the admin API',
                      children: (0, t.jsx)('p', {
                        style: { margin: 0 },
                        children:
                          'Checking for a refresh session and loading the current overview snapshot.',
                      }),
                    })
                  : null,
                'unauthenticated' === w
                  ? (0, t.jsx)(d.AuthSplitLayout, {
                      surface: 'customer',
                      variant: 'spotlight',
                      heroMediaOnly: !0,
                      heroMedia: (0, t.jsx)('div', {
                        className: 'elite-login-brand-stage',
                        children: (0, t.jsx)(i.default, {
                          src: n,
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
                      panelAction: (0, t.jsx)('div', {
                        className: 'elite-toolbar',
                        children: (0, t.jsx)(m.AdminThemeControl, {}),
                      }),
                      children: (0, t.jsxs)('form', {
                        className: 'elite-auth-form',
                        onSubmit: ec,
                        noValidate: !0,
                        children: [
                          en,
                          (0, t.jsx)(l.Field, {
                            label: 'Email address',
                            tone: Z ? 'danger' : 'neutral',
                            hint:
                              Z ??
                              'Use the email bound to your platform admin account.',
                            children: (0, t.jsx)(l.TextInput, {
                              value: R,
                              onChange: (e) => M(e.target.value),
                              onBlur: () => ea('email'),
                              type: 'email',
                              autoComplete: 'email',
                              placeholder: 'admin@company.com',
                              'aria-invalid': Z ? 'true' : void 0,
                              required: !0,
                            }),
                          }),
                          (0, t.jsx)(l.Field, {
                            label: 'Password',
                            tone: ee ? 'danger' : 'neutral',
                            hint:
                              ee ??
                              'Use the current password for this admin account.',
                            children: (0, t.jsx)(d.PasswordInput, {
                              value: T,
                              onChange: (e) => B(e.target.value),
                              onBlur: () => ea('password'),
                              revealed: $,
                              onToggleVisibility: () => z((e) => !e),
                              autoComplete: 'current-password',
                              placeholder: 'Enter your password',
                              'aria-invalid': ee ? 'true' : void 0,
                              required: !0,
                            }),
                          }),
                          (0, t.jsx)(l.Field, {
                            label: 'Authenticator code',
                            tone: et ? 'danger' : 'neutral',
                            hint:
                              et ??
                              'Optional until MFA is enabled. When used, it must be a 6-digit TOTP code.',
                            children: (0, t.jsx)(l.TextInput, {
                              value: U,
                              onChange: (e) => F(e.target.value),
                              onBlur: () => ea('mfaCode'),
                              inputMode: 'numeric',
                              pattern: '[0-9]*',
                              placeholder: '123456',
                              'aria-invalid': et ? 'true' : void 0,
                            }),
                          }),
                          (0, t.jsx)(l.ActionButton, {
                            type: 'submit',
                            size: 'compact',
                            stretch: !0,
                            disabled: Q,
                            children: Q ? 'Signing in...' : 'Sign in',
                          }),
                        ],
                      }),
                    })
                  : null,
                'ready' === w && A && P
                  ? (0, t.jsxs)(t.Fragment, {
                      children: [
                        (0, t.jsx)(c.InfoCard, {
                          eyebrow: 'Operator',
                          title: `${A.user.displayName} (${A.user.role})`,
                          action: (0, t.jsx)(l.ActionButton, {
                            type: 'button',
                            tone: 'secondary',
                            onClick: eu,
                            children: 'Log out',
                          }),
                          children: (0, t.jsxs)('div', {
                            style: { display: 'grid', gap: 16 },
                            children: [
                              (0, t.jsxs)('div', {
                                style: {
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 10,
                                  alignItems: 'center',
                                },
                                children: [
                                  (0, t.jsx)(l.StatusBadge, {
                                    tone: 'warning',
                                    children: A.user.email,
                                  }),
                                  (0, t.jsx)(l.StatusBadge, {
                                    tone: 'neutral',
                                    children: 'Global view',
                                  }),
                                  (0, t.jsxs)(l.StatusBadge, {
                                    tone: D?.enabled
                                      ? 'success'
                                      : D?.pending
                                        ? 'warning'
                                        : 'danger',
                                    children: [
                                      'MFA',
                                      ' ',
                                      D?.enabled
                                        ? 'enabled'
                                        : D?.pending
                                          ? 'pending'
                                          : 'disabled',
                                    ],
                                  }),
                                ],
                              }),
                              (0, t.jsxs)(l.MetricGrid, {
                                minItemWidth: 160,
                                children: [
                                  (0, t.jsx)(l.MetricCard, {
                                    label: 'Users',
                                    value: P.counts.users,
                                    hint: 'Operator accounts',
                                  }),
                                  (0, t.jsx)(l.MetricCard, {
                                    label: 'Workspaces',
                                    value: P.counts.workspaces,
                                    hint: 'Tenant containers',
                                  }),
                                  (0, t.jsx)(l.MetricCard, {
                                    label: 'Instances',
                                    value: P.counts.instances,
                                    hint: 'Runtime records',
                                  }),
                                  (0, t.jsx)(l.MetricCard, {
                                    label: 'Workers',
                                    value: P.counts.workers,
                                    hint: 'Active heartbeat sources',
                                    tone: 'info',
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        (0, t.jsx)(c.InfoCard, {
                          eyebrow: 'Security',
                          title: 'Admin MFA',
                          action: (0, t.jsx)(l.ActionButton, {
                            type: 'button',
                            tone: 'secondary',
                            onClick: ef,
                            disabled: 'challenge' === J,
                            children:
                              'challenge' === J
                                ? 'Preparing...'
                                : D?.enabled
                                  ? 'Rotate MFA'
                                  : 'Set up MFA',
                          }),
                          children: (0, t.jsxs)('div', {
                            style: { display: 'grid', gap: 16 },
                            children: [
                              (0, t.jsx)('p', {
                                style: {
                                  margin: 0,
                                  color: 'var(--elite-muted)',
                                },
                                children:
                                  'Platform admins can protect dashboard access with TOTP-based MFA. Once enabled, login requires the six-digit code.',
                              }),
                              (0, t.jsxs)('div', {
                                style: {
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 10,
                                },
                                children: [
                                  (0, t.jsx)(l.StatusBadge, {
                                    tone: D?.enabled ? 'success' : 'warning',
                                    children: D?.enabled
                                      ? 'Enabled'
                                      : 'Not enabled',
                                  }),
                                  D?.configuredAt
                                    ? (0, t.jsxs)(l.StatusBadge, {
                                        tone: 'neutral',
                                        children: [
                                          'Configured ',
                                          y(D.configuredAt),
                                        ],
                                      })
                                    : null,
                                ],
                              }),
                              W
                                ? (0, t.jsxs)('div', {
                                    style: { display: 'grid', gap: 16 },
                                    children: [
                                      (0, t.jsx)(u.QrPayloadView, {
                                        payload: W.otpauthUrl,
                                        alt: 'Admin MFA setup QR code',
                                      }),
                                      (0, t.jsx)(l.Field, {
                                        label: 'Shared secret',
                                        children: (0, t.jsx)(l.TextInput, {
                                          value: W.secret,
                                          readOnly: !0,
                                        }),
                                      }),
                                      (0, t.jsxs)('form', {
                                        onSubmit: eh,
                                        style: { display: 'grid', gap: 14 },
                                        children: [
                                          (0, t.jsx)(l.Field, {
                                            label: 'Verification code',
                                            children: (0, t.jsx)(l.TextInput, {
                                              value: G,
                                              onChange: (e) =>
                                                V(e.target.value),
                                              inputMode: 'numeric',
                                              pattern: '[0-9]*',
                                              required: !0,
                                            }),
                                          }),
                                          (0, t.jsx)(l.ActionButton, {
                                            type: 'submit',
                                            disabled: 'verify' === J,
                                            children:
                                              'verify' === J
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
                        (0, t.jsxs)(l.SectionGrid, {
                          minItemWidth: 320,
                          children: [
                            (0, t.jsx)(c.InfoCard, {
                              eyebrow: 'Workers',
                              title: 'Heartbeat and capacity',
                              children:
                                0 === P.workers.length
                                  ? (0, t.jsx)('p', {
                                      style: { margin: 0 },
                                      children:
                                        'No worker heartbeat has been persisted yet.',
                                    })
                                  : (0, t.jsx)('ul', {
                                      className: 'elite-list',
                                      children: P.workers.map((e) =>
                                        (0, t.jsxs)(
                                          'li',
                                          {
                                            className: 'elite-list-item',
                                            children: [
                                              (0, t.jsxs)('div', {
                                                className: 'elite-list-title',
                                                children: [
                                                  (0, t.jsx)('span', {
                                                    children: e.workerId,
                                                  }),
                                                  (0, t.jsx)(l.StatusBadge, {
                                                    tone:
                                                      'online' === e.status
                                                        ? 'success'
                                                        : 'warning',
                                                    children: e.status,
                                                  }),
                                                ],
                                              }),
                                              (0, t.jsxs)('div', {
                                                className: 'elite-list-meta',
                                                children: [
                                                  (0, t.jsxs)('span', {
                                                    children: [
                                                      'Region ',
                                                      e.region,
                                                    ],
                                                  }),
                                                  (0, t.jsxs)('span', {
                                                    children: [
                                                      'Last seen ',
                                                      y(e.lastSeenAt),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              (0, t.jsxs)('div', {
                                                className:
                                                  'elite-definition-grid',
                                                style: {
                                                  '--elite-grid-min': '120px',
                                                },
                                                children: [
                                                  (0, t.jsxs)('div', {
                                                    className:
                                                      'elite-definition-item',
                                                    children: [
                                                      (0, t.jsx)('div', {
                                                        className:
                                                          'elite-definition-label',
                                                        children: 'Uptime',
                                                      }),
                                                      (0, t.jsxs)('div', {
                                                        className:
                                                          'elite-definition-value',
                                                        children: [
                                                          e.uptimeSeconds,
                                                          's',
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                  (0, t.jsxs)('div', {
                                                    className:
                                                      'elite-definition-item',
                                                    children: [
                                                      (0, t.jsx)('div', {
                                                        className:
                                                          'elite-definition-label',
                                                        children: 'Assigned',
                                                      }),
                                                      (0, t.jsx)('div', {
                                                        className:
                                                          'elite-definition-value',
                                                        children:
                                                          e.activeInstanceCount,
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          },
                                          e.id,
                                        ),
                                      ),
                                    }),
                            }),
                            (0, t.jsx)(c.InfoCard, {
                              eyebrow: 'Users',
                              title: 'Account summary',
                              children: (0, t.jsx)('ul', {
                                className: 'elite-list',
                                children: P.users.map((e) =>
                                  (0, t.jsxs)(
                                    'li',
                                    {
                                      className: 'elite-list-item',
                                      children: [
                                        (0, t.jsxs)('div', {
                                          className: 'elite-list-title',
                                          children: [
                                            (0, t.jsx)('span', {
                                              children: e.displayName,
                                            }),
                                            (0, t.jsx)(l.StatusBadge, {
                                              tone:
                                                'platform_admin' === e.role
                                                  ? 'warning'
                                                  : 'neutral',
                                              children: e.role,
                                            }),
                                          ],
                                        }),
                                        (0, t.jsxs)('div', {
                                          className: 'elite-list-meta',
                                          children: [
                                            (0, t.jsx)('span', {
                                              children: e.email,
                                            }),
                                            (0, t.jsxs)('span', {
                                              children: [
                                                'Created ',
                                                y(e.createdAt),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, t.jsxs)('div', {
                                          className: 'elite-definition-grid',
                                          style: {
                                            '--elite-grid-min': '120px',
                                          },
                                          children: [
                                            (0, t.jsxs)('div', {
                                              className:
                                                'elite-definition-item',
                                              children: [
                                                (0, t.jsx)('div', {
                                                  className:
                                                    'elite-definition-label',
                                                  children: 'Workspaces',
                                                }),
                                                (0, t.jsx)('div', {
                                                  className:
                                                    'elite-definition-value',
                                                  children: e.workspaceCount,
                                                }),
                                              ],
                                            }),
                                            (0, t.jsxs)('div', {
                                              className:
                                                'elite-definition-item',
                                              children: [
                                                (0, t.jsx)('div', {
                                                  className:
                                                    'elite-definition-label',
                                                  children: 'Instances',
                                                }),
                                                (0, t.jsx)('div', {
                                                  className:
                                                    'elite-definition-value',
                                                  children: e.instanceCount,
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                    e.id,
                                  ),
                                ),
                              }),
                            }),
                          ],
                        }),
                        (0, t.jsx)(c.InfoCard, {
                          eyebrow: 'Instances',
                          title: 'Global instance view',
                          children:
                            0 === P.instances.length
                              ? (0, t.jsx)('p', {
                                  style: { margin: 0 },
                                  children:
                                    'No instances have been created yet.',
                                })
                              : (0, t.jsx)('div', {
                                  className: 'elite-section-grid',
                                  style: { '--elite-grid-min': '260px' },
                                  children: P.instances.map((e) => {
                                    var i;
                                    return (0, t.jsxs)(
                                      'article',
                                      {
                                        className: 'elite-list-item',
                                        children: [
                                          (0, t.jsxs)('div', {
                                            className: 'elite-list-title',
                                            children: [
                                              (0, t.jsxs)('span', {
                                                children: [
                                                  e.name,
                                                  ' (',
                                                  e.publicId,
                                                  ')',
                                                ],
                                              }),
                                              (0, t.jsxs)(l.StatusBadge, {
                                                tone: (function (e) {
                                                  switch (e) {
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
                                                })(e.status),
                                                children: [
                                                  e.status,
                                                  ' /',
                                                  ' ',
                                                  (i = e.substatus)
                                                    ? i.replaceAll('_', ' ')
                                                    : 'None',
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, t.jsxs)('div', {
                                            className: 'elite-list-meta',
                                            children: [
                                              (0, t.jsx)('span', {
                                                children: e.workspaceName,
                                              }),
                                              (0, t.jsxs)('span', {
                                                children: [
                                                  'Last lifecycle event',
                                                  ' ',
                                                  y(e.latestEventAt),
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, t.jsx)('div', {
                                            className: 'elite-definition-grid',
                                            style: {
                                              '--elite-grid-min': '130px',
                                            },
                                            children: (0, t.jsxs)('div', {
                                              className:
                                                'elite-definition-item',
                                              children: [
                                                (0, t.jsx)('div', {
                                                  className:
                                                    'elite-definition-label',
                                                  children: 'Worker',
                                                }),
                                                (0, t.jsx)('div', {
                                                  className:
                                                    'elite-definition-value',
                                                  children: e.assignedWorkerId
                                                    ? `${e.assignedWorkerId}${e.assignedWorkerRegion ? ` (${e.assignedWorkerRegion})` : ''}`
                                                    : 'Unassigned',
                                                }),
                                              ],
                                            }),
                                          }),
                                          (0, t.jsx)('div', {
                                            children: (0, t.jsx)('a', {
                                              href: `/instances/${e.id}`,
                                              children: 'Open admin detail',
                                            }),
                                          }),
                                        ],
                                      },
                                      e.id,
                                    );
                                  }),
                                }),
                        }),
                      ],
                    })
                  : null,
                'unauthenticated' !== w && E
                  ? (0, t.jsx)(l.NoticeBanner, {
                      title: 'Action failed',
                      tone: 'danger',
                      children: (0, t.jsx)('p', {
                        style: { margin: 0 },
                        children: E,
                      }),
                    })
                  : null,
                'unauthenticated' !== w && k
                  ? (0, t.jsx)(l.NoticeBanner, {
                      title: 'Latest action',
                      tone: 'success',
                      children: (0, t.jsx)('p', {
                        style: { margin: 0 },
                        children: k,
                      }),
                    })
                  : null,
              ],
            })
          );
        },
      ],
      72495,
    );
  },
]);
