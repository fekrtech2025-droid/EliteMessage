module.exports=[53911,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={RequestCookies:function(){return f.RequestCookies},ResponseCookies:function(){return f.ResponseCookies},stringifyCookie:function(){return f.stringifyCookie}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(56601)},83276,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ReflectAdapter",{enumerable:!0,get:function(){return d}});class d{static get(a,b,c){let d=Reflect.get(a,b,c);return"function"==typeof d?d.bind(a):d}static set(a,b,c,d){return Reflect.set(a,b,c,d)}static has(a,b){return Reflect.has(a,b)}static deleteProperty(a,b){return Reflect.deleteProperty(a,b)}}},93178,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={ActionDidNotRevalidate:function(){return f},ActionDidRevalidateDynamicOnly:function(){return h},ActionDidRevalidateStaticAndDynamic:function(){return g}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=0,g=1,h=2},32910,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={MutableRequestCookiesAdapter:function(){return o},ReadonlyRequestCookiesError:function(){return j},RequestCookiesAdapter:function(){return k},appendMutableCookies:function(){return n},areCookiesMutableInCurrentPhase:function(){return q},createCookiesWithMutableAccessCheck:function(){return p},getModifiedCookieValues:function(){return m},responseCookiesToRequestCookies:function(){return s}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(53911),g=a.r(83276),h=a.r(56704),i=a.r(93178);class j extends Error{constructor(){super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options")}static callable(){throw new j}}class k{static seal(a){return new Proxy(a,{get(a,b,c){switch(b){case"clear":case"delete":case"set":return j.callable;default:return g.ReflectAdapter.get(a,b,c)}}})}}let l=Symbol.for("next.mutated.cookies");function m(a){let b=a[l];return b&&Array.isArray(b)&&0!==b.length?b:[]}function n(a,b){let c=m(b);if(0===c.length)return!1;let d=new f.ResponseCookies(a),e=d.getAll();for(let a of c)d.set(a);for(let a of e)d.set(a);return!0}class o{static wrap(a,b){let c=new f.ResponseCookies(new Headers);for(let b of a.getAll())c.set(b);let d=[],e=new Set,j=()=>{let a=h.workAsyncStorage.getStore();if(a&&(a.pathWasRevalidated=i.ActionDidRevalidateStaticAndDynamic),d=c.getAll().filter(a=>e.has(a.name)),b){let a=[];for(let b of d){let c=new f.ResponseCookies(new Headers);c.set(b),a.push(c.toString())}b(a)}},k=new Proxy(c,{get(a,b,c){switch(b){case l:return d;case"delete":return function(...b){e.add("string"==typeof b[0]?b[0]:b[0].name);try{return a.delete(...b),k}finally{j()}};case"set":return function(...b){e.add("string"==typeof b[0]?b[0]:b[0].name);try{return a.set(...b),k}finally{j()}};default:return g.ReflectAdapter.get(a,b,c)}}});return k}}function p(a){let b=new Proxy(a.mutableCookies,{get(c,d,e){switch(d){case"delete":return function(...d){return r(a,"cookies().delete"),c.delete(...d),b};case"set":return function(...d){return r(a,"cookies().set"),c.set(...d),b};default:return g.ReflectAdapter.get(c,d,e)}}});return b}function q(a){return"action"===a.phase}function r(a,b){if(!q(a))throw new j}function s(a){let b=new f.RequestCookies(new Headers);for(let c of a.getAll())b.set(c);return b}},94908,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={DynamicServerError:function(){return g},isDynamicServerError:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f="DYNAMIC_SERVER_USAGE";class g extends Error{constructor(a){super(`Dynamic server usage: ${a}`),this.description=a,this.digest=f}}function h(a){return"object"==typeof a&&null!==a&&"digest"in a&&"string"==typeof a.digest&&a.digest===f}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},23161,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={StaticGenBailoutError:function(){return g},isStaticGenBailoutError:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f="NEXT_STATIC_GEN_BAILOUT";class g extends Error{constructor(...a){super(...a),this.code=f}}function h(a){return"object"==typeof a&&null!==a&&"code"in a&&a.code===f}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},11346,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"InvariantError",{enumerable:!0,get:function(){return d}});class d extends Error{constructor(a,b){super(`Invariant: ${a.endsWith(".")?a:a+"."} This is a bug in Next.js.`,b),this.name="InvariantError"}}},95656,(a,b,c)=>{"use strict";function d(){let a,b,c=new Promise((c,d)=>{a=c,b=d});return{resolve:a,reject:b,promise:c}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"createPromiseWithResolvers",{enumerable:!0,get:function(){return d}})},44212,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d,e={RenderStage:function(){return i},StagedRenderingController:function(){return j}};for(var f in e)Object.defineProperty(c,f,{enumerable:!0,get:e[f]});let g=a.r(11346),h=a.r(95656);var i=((d={})[d.Before=1]="Before",d[d.EarlyStatic=2]="EarlyStatic",d[d.Static=3]="Static",d[d.EarlyRuntime=4]="EarlyRuntime",d[d.Runtime=5]="Runtime",d[d.Dynamic=6]="Dynamic",d[d.Abandoned=7]="Abandoned",d);class j{constructor(a,b,c){this.abortSignal=a,this.abandonController=b,this.shouldTrackSyncIO=c,this.currentStage=1,this.syncInterruptReason=null,this.staticStageEndTime=1/0,this.runtimeStageEndTime=1/0,this.staticStageListeners=[],this.earlyRuntimeStageListeners=[],this.runtimeStageListeners=[],this.dynamicStageListeners=[],this.staticStagePromise=(0,h.createPromiseWithResolvers)(),this.earlyRuntimeStagePromise=(0,h.createPromiseWithResolvers)(),this.runtimeStagePromise=(0,h.createPromiseWithResolvers)(),this.dynamicStagePromise=(0,h.createPromiseWithResolvers)(),a&&a.addEventListener("abort",()=>{let{reason:b}=a;this.staticStagePromise.promise.catch(k),this.staticStagePromise.reject(b),this.earlyRuntimeStagePromise.promise.catch(k),this.earlyRuntimeStagePromise.reject(b),this.runtimeStagePromise.promise.catch(k),this.runtimeStagePromise.reject(b),this.dynamicStagePromise.promise.catch(k),this.dynamicStagePromise.reject(b)},{once:!0}),b&&b.signal.addEventListener("abort",()=>{this.abandonRender()},{once:!0})}onStage(a,b){if(this.currentStage>=a)b();else if(3===a)this.staticStageListeners.push(b);else if(4===a)this.earlyRuntimeStageListeners.push(b);else if(5===a)this.runtimeStageListeners.push(b);else if(6===a)this.dynamicStageListeners.push(b);else throw Object.defineProperty(new g.InvariantError(`Invalid render stage: ${a}`),"__NEXT_ERROR_CODE",{value:"E881",enumerable:!1,configurable:!0})}shouldTrackSyncInterrupt(){if(!this.shouldTrackSyncIO)return!1;switch(this.currentStage){case 1:case 5:case 6:case 7:default:return!1;case 2:case 3:case 4:return!0}}syncInterruptCurrentStageWithReason(a){if(1!==this.currentStage&&7!==this.currentStage){if(this.abandonController)return void this.abandonController.abort();if(this.abortSignal){this.syncInterruptReason=a,this.currentStage=7;return}switch(this.currentStage){case 2:case 3:case 4:this.syncInterruptReason=a,this.advanceStage(6);return;case 5:return}}}getSyncInterruptReason(){return this.syncInterruptReason}getStaticStageEndTime(){return this.staticStageEndTime}getRuntimeStageEndTime(){return this.runtimeStageEndTime}abandonRender(){let{currentStage:a}=this;switch(a){case 2:this.resolveStaticStage();case 3:this.resolveEarlyRuntimeStage();case 4:this.resolveRuntimeStage();case 5:this.currentStage=7;return}}advanceStage(a){if(a<=this.currentStage)return;let b=this.currentStage;if(this.currentStage=a,b<3&&a>=3&&this.resolveStaticStage(),b<4&&a>=4&&this.resolveEarlyRuntimeStage(),b<5&&a>=5&&(this.staticStageEndTime=performance.now()+performance.timeOrigin,this.resolveRuntimeStage()),b<6&&a>=6){this.runtimeStageEndTime=performance.now()+performance.timeOrigin,this.resolveDynamicStage();return}}resolveStaticStage(){let a=this.staticStageListeners;for(let b=0;b<a.length;b++)a[b]();a.length=0,this.staticStagePromise.resolve()}resolveEarlyRuntimeStage(){let a=this.earlyRuntimeStageListeners;for(let b=0;b<a.length;b++)a[b]();a.length=0,this.earlyRuntimeStagePromise.resolve()}resolveRuntimeStage(){let a=this.runtimeStageListeners;for(let b=0;b<a.length;b++)a[b]();a.length=0,this.runtimeStagePromise.resolve()}resolveDynamicStage(){let a=this.dynamicStageListeners;for(let b=0;b<a.length;b++)a[b]();a.length=0,this.dynamicStagePromise.resolve()}getStagePromise(a){switch(a){case 3:return this.staticStagePromise.promise;case 4:return this.earlyRuntimeStagePromise.promise;case 5:return this.runtimeStagePromise.promise;case 6:return this.dynamicStagePromise.promise;default:throw Object.defineProperty(new g.InvariantError(`Invalid render stage: ${a}`),"__NEXT_ERROR_CODE",{value:"E881",enumerable:!1,configurable:!0})}}waitForStage(a){return this.getStagePromise(a)}delayUntilStage(a,b,c){var d,e,f;let g,h=(d=this.getStagePromise(a),e=b,f=c,g=new Promise((a,b)=>{d.then(a.bind(null,f),b)}),void 0!==e&&(g.displayName=e),g);return this.abortSignal&&h.catch(k),h}}function k(){}},70569,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={delayUntilRuntimeStage:function(){return o},getRuntimeStage:function(){return n},isHangingPromiseRejectionError:function(){return g},makeDevtoolsIOAwarePromise:function(){return m},makeHangingPromise:function(){return k}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(44212);function g(a){return"object"==typeof a&&null!==a&&"digest"in a&&a.digest===h}let h="HANGING_PROMISE_REJECTION";class i extends Error{constructor(a,b){super(`During prerendering, ${b} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${b} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${a}".`),this.route=a,this.expression=b,this.digest=h}}let j=new WeakMap;function k(a,b,c){if(a.aborted)return Promise.reject(new i(b,c));{let d=new Promise((d,e)=>{let f=e.bind(null,new i(b,c)),g=j.get(a);if(g)g.push(f);else{let b=[f];j.set(a,b),a.addEventListener("abort",()=>{for(let a=0;a<b.length;a++)b[a]()},{once:!0})}});return d.catch(l),d}}function l(){}function m(a,b,c){return b.stagedRendering?b.stagedRendering.delayUntilStage(c,void 0,a):new Promise(b=>{setTimeout(()=>{b(a)},0)})}function n(a){return a.currentStage===f.RenderStage.EarlyStatic||a.currentStage===f.RenderStage.EarlyRuntime?f.RenderStage.EarlyRuntime:f.RenderStage.Runtime}function o(a,b){let{stagedRendering:c}=a;return c?c.waitForStage(n(c)).then(()=>b):b}},53249,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={METADATA_BOUNDARY_NAME:function(){return f},OUTLET_BOUNDARY_NAME:function(){return h},ROOT_LAYOUT_BOUNDARY_NAME:function(){return i},VIEWPORT_BOUNDARY_NAME:function(){return g}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f="__next_metadata_boundary__",g="__next_viewport_boundary__",h="__next_outlet_boundary__",i="__next_root_layout_boundary__"},29474,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={atLeastOneTask:function(){return h},scheduleImmediate:function(){return g},scheduleOnNextTick:function(){return f},waitAtLeastOneReactRenderTask:function(){return i}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a=>{Promise.resolve().then(()=>{process.nextTick(a)})},g=a=>{setImmediate(a)};function h(){return new Promise(a=>g(a))}function i(){return new Promise(a=>setImmediate(a))}},63474,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={BailoutToCSRError:function(){return g},isBailoutToCSRError:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f="BAILOUT_TO_CLIENT_SIDE_RENDERING";class g extends Error{constructor(a){super(`Bail out to client-side rendering: ${a}`),this.reason=a,this.digest=f}}function h(a){return"object"==typeof a&&null!==a&&"digest"in a&&a.digest===f}},17549,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"INSTANT_VALIDATION_BOUNDARY_NAME",{enumerable:!0,get:function(){return d}});let d="__next_instant_validation_boundary__"},65832,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d,e,f,g={DynamicHoleKind:function(){return $},Postpone:function(){return D},PreludeState:function(){return af},abortAndThrowOnSynchronousRequestDataAccess:function(){return C},abortOnSynchronousPlatformIOAccess:function(){return B},accessedDynamicData:function(){return L},annotateDynamicAccess:function(){return Q},consumeDynamicAccess:function(){return M},createDynamicTrackingState:function(){return u},createDynamicValidationState:function(){return v},createHangingInputAbortSignal:function(){return P},createInstantValidationState:function(){return _},createRenderInBrowserAbortSignal:function(){return O},formatDynamicAPIAccesses:function(){return N},getFirstDynamicReason:function(){return w},getNavigationDisallowedDynamicReasons:function(){return aj},getStaticShellDisallowedDynamicReasons:function(){return ai},isDynamicPostpone:function(){return G},isPrerenderInterruptedError:function(){return K},logDisallowedDynamicError:function(){return ag},markCurrentScopeAsDynamic:function(){return x},postponeWithTracking:function(){return E},throwIfDisallowedDynamic:function(){return ah},throwToInterruptStaticGeneration:function(){return y},trackAllowedDynamicAccess:function(){return Z},trackDynamicDataInDynamicRender:function(){return z},trackDynamicHoleInNavigation:function(){return aa},trackDynamicHoleInRuntimeShell:function(){return ac},trackDynamicHoleInStaticShell:function(){return ad},trackThrownErrorInNavigation:function(){return ab},useDynamicRouteParams:function(){return R},useDynamicSearchParams:function(){return S}};for(var h in g)Object.defineProperty(c,h,{enumerable:!0,get:g[h]});let i=(d=a.r(53798))&&d.__esModule?d:{default:d},j=a.r(94908),k=a.r(23161),l=a.r(32319),m=a.r(56704),n=a.r(70569),o=a.r(53249),p=a.r(29474),q=a.r(63474),r=a.r(11346),s=a.r(17549),t="function"==typeof i.default.unstable_postpone;function u(a){return{isDebugDynamicAccesses:a,dynamicAccesses:[],syncDynamicErrorWithStack:null}}function v(){return{hasSuspenseAboveBody:!1,hasDynamicMetadata:!1,dynamicMetadata:null,hasDynamicViewport:!1,hasAllowedDynamic:!1,dynamicErrors:[]}}function w(a){var b;return null==(b=a.dynamicAccesses[0])?void 0:b.expression}function x(a,b,c){if(b)switch(b.type){case"cache":case"unstable-cache":case"private-cache":return}if(!a.forceDynamic&&!a.forceStatic){if(a.dynamicShouldError)throw Object.defineProperty(new k.StaticGenBailoutError(`Route ${a.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${c}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E553",enumerable:!1,configurable:!0});if(b)switch(b.type){case"prerender-ppr":return E(a.route,c,b.dynamicTracking);case"prerender-legacy":b.revalidate=0;let d=Object.defineProperty(new j.DynamicServerError(`Route ${a.route} couldn't be rendered statically because it used ${c}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`),"__NEXT_ERROR_CODE",{value:"E550",enumerable:!1,configurable:!0});throw a.dynamicUsageDescription=c,a.dynamicUsageStack=d.stack,d}}}function y(a,b,c){let d=Object.defineProperty(new j.DynamicServerError(`Route ${b.route} couldn't be rendered statically because it used \`${a}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`),"__NEXT_ERROR_CODE",{value:"E558",enumerable:!1,configurable:!0});throw c.revalidate=0,b.dynamicUsageDescription=a,b.dynamicUsageStack=d.stack,d}function z(a){switch(a.type){case"cache":case"unstable-cache":case"private-cache":return}}function A(a,b,c){let d=J(`Route ${a} needs to bail out of prerendering at this point because it used ${b}.`);c.controller.abort(d);let e=c.dynamicTracking;e&&e.dynamicAccesses.push({stack:e.isDebugDynamicAccesses?Error().stack:void 0,expression:b})}function B(a,b,c,d){let e=d.dynamicTracking;A(a,b,d),e&&null===e.syncDynamicErrorWithStack&&(e.syncDynamicErrorWithStack=c)}function C(a,b,c,d){if(!1===d.controller.signal.aborted){A(a,b,d);let e=d.dynamicTracking;e&&null===e.syncDynamicErrorWithStack&&(e.syncDynamicErrorWithStack=c)}throw J(`Route ${a} needs to bail out of prerendering at this point because it used ${b}.`)}function D({reason:a,route:b}){let c=l.workUnitAsyncStorage.getStore();E(b,a,c&&"prerender-ppr"===c.type?c.dynamicTracking:null)}function E(a,b,c){(function(){if(!t)throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"),"__NEXT_ERROR_CODE",{value:"E224",enumerable:!1,configurable:!0})})(),c&&c.dynamicAccesses.push({stack:c.isDebugDynamicAccesses?Error().stack:void 0,expression:b}),i.default.unstable_postpone(F(a,b))}function F(a,b){return`Route ${a} needs to bail out of prerendering at this point because it used ${b}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`}function G(a){return"object"==typeof a&&null!==a&&"string"==typeof a.message&&H(a.message)}function H(a){return a.includes("needs to bail out of prerendering at this point because it used")&&a.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error")}if(!1===H(F("%%%","^^^")))throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"),"__NEXT_ERROR_CODE",{value:"E296",enumerable:!1,configurable:!0});let I="NEXT_PRERENDER_INTERRUPTED";function J(a){let b=Object.defineProperty(Error(a),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return b.digest=I,b}function K(a){return"object"==typeof a&&null!==a&&a.digest===I&&"name"in a&&"message"in a&&a instanceof Error}function L(a){return a.length>0}function M(a,b){return a.dynamicAccesses.push(...b.dynamicAccesses),a.dynamicAccesses}function N(a){return a.filter(a=>"string"==typeof a.stack&&a.stack.length>0).map(({expression:a,stack:b})=>(b=b.split("\n").slice(4).filter(a=>!(a.includes("node_modules/next/")||a.includes(" (<anonymous>)")||a.includes(" (node:"))).join("\n"),`Dynamic API Usage Debug - ${a}:
${b}`))}function O(){let a=new AbortController;return a.abort(Object.defineProperty(new q.BailoutToCSRError("Render in Browser"),"__NEXT_ERROR_CODE",{value:"E721",enumerable:!1,configurable:!0})),a.signal}function P(a){switch(a.type){case"prerender":case"prerender-runtime":let b=new AbortController;if(a.cacheSignal)a.cacheSignal.inputReady().then(()=>{b.abort()});else if("prerender-runtime"===a.type&&a.stagedRendering){let{stagedRendering:c}=a;c.waitForStage((0,n.getRuntimeStage)(c)).then(()=>(0,p.scheduleOnNextTick)(()=>b.abort()))}else(0,p.scheduleOnNextTick)(()=>b.abort());return b.signal;case"prerender-client":case"validation-client":case"prerender-ppr":case"prerender-legacy":case"request":case"cache":case"private-cache":case"unstable-cache":case"generate-static-params":return}}function Q(a,b){let c=b.dynamicTracking;c&&c.dynamicAccesses.push({stack:c.isDebugDynamicAccesses?Error().stack:void 0,expression:a})}function R(a){let b=m.workAsyncStorage.getStore(),c=l.workUnitAsyncStorage.getStore();if(b&&c)switch(c.type){case"prerender-client":case"prerender":{let d=c.fallbackRouteParams;d&&d.size>0&&i.default.use((0,n.makeHangingPromise)(c.renderSignal,b.route,a));break}case"prerender-ppr":{let d=c.fallbackRouteParams;if(d&&d.size>0)return E(b.route,a,c.dynamicTracking);break}case"validation-client":case"prerender-legacy":case"request":case"unstable-cache":break;case"prerender-runtime":throw Object.defineProperty(new r.InvariantError(`\`${a}\` was called during a runtime prerender. Next.js should be preventing ${a} from being included in server components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E771",enumerable:!1,configurable:!0});case"cache":case"private-cache":throw Object.defineProperty(new r.InvariantError(`\`${a}\` was called inside a cache scope. Next.js should be preventing ${a} from being included in server components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E745",enumerable:!1,configurable:!0});case"generate-static-params":throw Object.defineProperty(new r.InvariantError(`\`${a}\` was called in \`generateStaticParams\`. Next.js should be preventing ${a} from being included in server component files statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1130",enumerable:!1,configurable:!0})}}function S(a){let b=m.workAsyncStorage.getStore(),c=l.workUnitAsyncStorage.getStore();if(b)switch(!c&&(0,l.throwForMissingRequestStore)(a),c.type){case"validation-client":case"request":return;case"prerender-client":i.default.use((0,n.makeHangingPromise)(c.renderSignal,b.route,a));break;case"prerender-legacy":case"prerender-ppr":if(b.forceStatic)return;throw Object.defineProperty(new q.BailoutToCSRError(a),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});case"prerender":case"prerender-runtime":throw Object.defineProperty(new r.InvariantError(`\`${a}\` was called from a Server Component. Next.js should be preventing ${a} from being included in server components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E795",enumerable:!1,configurable:!0});case"cache":case"unstable-cache":case"private-cache":throw Object.defineProperty(new r.InvariantError(`\`${a}\` was called inside a cache scope. Next.js should be preventing ${a} from being included in server components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E745",enumerable:!1,configurable:!0});case"generate-static-params":throw Object.defineProperty(new r.InvariantError(`\`${a}\` was called in \`generateStaticParams\`. Next.js should be preventing ${a} from being included in server component files statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1130",enumerable:!1,configurable:!0})}}let T=/\n\s+at Suspense \(<anonymous>\)/,U=RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at ${o.ROOT_LAYOUT_BOUNDARY_NAME} \\([^\\n]*\\)`),V=RegExp(`\\n\\s+at ${o.METADATA_BOUNDARY_NAME}[\\n\\s]`),W=RegExp(`\\n\\s+at ${o.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`),X=RegExp(`\\n\\s+at ${o.OUTLET_BOUNDARY_NAME}[\\n\\s]`),Y=RegExp(`\\n\\s+at ${s.INSTANT_VALIDATION_BOUNDARY_NAME}[\\n\\s]`);function Z(a,b,c,d){if(!X.test(b)){if(V.test(b)){c.hasDynamicMetadata=!0;return}if(W.test(b)){c.hasDynamicViewport=!0;return}if(U.test(b)){c.hasAllowedDynamic=!0,c.hasSuspenseAboveBody=!0;return}else if(T.test(b)){c.hasAllowedDynamic=!0;return}else{if(d.syncDynamicErrorWithStack)return void c.dynamicErrors.push(d.syncDynamicErrorWithStack);let e=ae(Object.defineProperty(Error(`Route "${a.route}": Uncached data was accessed outside of <Suspense>. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`),"__NEXT_ERROR_CODE",{value:"E1079",enumerable:!1,configurable:!0}),b,null);return void c.dynamicErrors.push(e)}}}var $=((e={})[e.Runtime=1]="Runtime",e[e.Dynamic=2]="Dynamic",e);function _(a){return{hasDynamicMetadata:!1,hasAllowedClientDynamicAboveBoundary:!1,dynamicMetadata:null,hasDynamicViewport:!1,hasAllowedDynamic:!1,dynamicErrors:[],validationPreventingErrors:[],thrownErrorsOutsideBoundary:[],createInstantStack:a}}function aa(a,b,c,d,e,f){if(X.test(b))return;if(V.test(b)){let d=ae(Object.defineProperty(Error(`Route "${a.route}": ${1===e?"Runtime data such as `cookies()`, `headers()`, `params`, or `searchParams` was accessed inside `generateMetadata` or you have file-based metadata such as icons that depend on dynamic params segments.":"Uncached data or `connection()` was accessed inside `generateMetadata`."} Except for this instance, the page would have been entirely prerenderable which may have been the intended behavior. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`),"__NEXT_ERROR_CODE",{value:"E1076",enumerable:!1,configurable:!0}),b,c.createInstantStack);c.dynamicMetadata=d;return}if(W.test(b)){let d=ae(Object.defineProperty(Error(`Route "${a.route}": ${1===e?"Runtime data such as `cookies()`, `headers()`, `params`, or `searchParams` was accessed inside `generateViewport`.":"Uncached data or `connection()` was accessed inside `generateViewport`."} This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`),"__NEXT_ERROR_CODE",{value:"E1086",enumerable:!1,configurable:!0}),b,c.createInstantStack);c.dynamicErrors.push(d);return}let g=Y.exec(b);if(g){let a=T.exec(b);if(a&&a.index<g.index){c.hasAllowedDynamic=!0;return}}else if(f.expectedIds.size===f.renderedIds.size){c.hasAllowedClientDynamicAboveBoundary=!0,c.hasAllowedDynamic=!0;return}else{let d=ae(Object.defineProperty(Error(`Route "${a.route}": Could not validate \`unstable_instant\` because a Client Component in a parent segment prevented the page from rendering.`),"__NEXT_ERROR_CODE",{value:"E1082",enumerable:!1,configurable:!0}),b,c.createInstantStack);c.validationPreventingErrors.push(d);return}if(d.syncDynamicErrorWithStack){let a=d.syncDynamicErrorWithStack;null!==c.createInstantStack&&void 0===a.cause&&(a.cause=c.createInstantStack()),c.dynamicErrors.push(a);return}let h=ae(Object.defineProperty(Error(`Route "${a.route}": ${1===e?"Runtime data such as `cookies()`, `headers()`, `params`, or `searchParams` was accessed outside of `<Suspense>`.":"Uncached data or `connection()` was accessed outside of `<Suspense>`."} This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`),"__NEXT_ERROR_CODE",{value:"E1078",enumerable:!1,configurable:!0}),b,c.createInstantStack);c.dynamicErrors.push(h)}function ab(a,b,c,d){let e=Y.exec(d);if(e){let f=T.exec(d);if(f&&f.index<e.index)return;let g=ae(Object.defineProperty(Error(`Route "${a.route}": Could not validate \`unstable_instant\` because an error prevented the target segment from rendering.`,{cause:c}),"__NEXT_ERROR_CODE",{value:"E1112",enumerable:!1,configurable:!0}),d,null);b.validationPreventingErrors.push(g)}else{let a=ae(Object.defineProperty(Error("An error occurred while attempting to validate instant UI. This error may be preventing the validation from completing.",{cause:c}),"__NEXT_ERROR_CODE",{value:"E1118",enumerable:!1,configurable:!0}),d,null);b.thrownErrorsOutsideBoundary.push(a)}}function ac(a,b,c,d){if(X.test(b))return;if(V.test(b)){c.dynamicMetadata=ae(Object.defineProperty(Error(`Route "${a.route}": Uncached data or \`connection()\` was accessed inside \`generateMetadata\`. Except for this instance, the page would have been entirely prerenderable which may have been the intended behavior. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`),"__NEXT_ERROR_CODE",{value:"E1080",enumerable:!1,configurable:!0}),b,null);return}if(W.test(b)){let d=ae(Object.defineProperty(Error(`Route "${a.route}": Uncached data or \`connection()\` was accessed inside \`generateViewport\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`),"__NEXT_ERROR_CODE",{value:"E1077",enumerable:!1,configurable:!0}),b,null);c.dynamicErrors.push(d);return}if(U.test(b)){c.hasAllowedDynamic=!0,c.hasSuspenseAboveBody=!0;return}if(T.test(b)){c.hasAllowedDynamic=!0;return}else if(d.syncDynamicErrorWithStack)return void c.dynamicErrors.push(d.syncDynamicErrorWithStack);let e=ae(Object.defineProperty(Error(`Route "${a.route}": Uncached data or \`connection()\` was accessed outside of \`<Suspense>\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`),"__NEXT_ERROR_CODE",{value:"E1084",enumerable:!1,configurable:!0}),b,null);c.dynamicErrors.push(e)}function ad(a,b,c,d){if(!X.test(b)){if(V.test(b)){c.dynamicMetadata=ae(Object.defineProperty(Error(`Route "${a.route}": Runtime data such as \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` was accessed inside \`generateMetadata\` or you have file-based metadata such as icons that depend on dynamic params segments. Except for this instance, the page would have been entirely prerenderable which may have been the intended behavior. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`),"__NEXT_ERROR_CODE",{value:"E1085",enumerable:!1,configurable:!0}),b,null);return}if(W.test(b)){let d=ae(Object.defineProperty(Error(`Route "${a.route}": Runtime data such as \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` was accessed inside \`generateViewport\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`),"__NEXT_ERROR_CODE",{value:"E1081",enumerable:!1,configurable:!0}),b,null);c.dynamicErrors.push(d);return}if(U.test(b)){c.hasAllowedDynamic=!0,c.hasSuspenseAboveBody=!0;return}else if(T.test(b)){c.hasAllowedDynamic=!0;return}else{if(d.syncDynamicErrorWithStack)return void c.dynamicErrors.push(d.syncDynamicErrorWithStack);let e=ae(Object.defineProperty(Error(`Route "${a.route}": Runtime data such as \`cookies()\`, \`headers()\`, \`params\`, or \`searchParams\` was accessed outside of \`<Suspense>\`. This delays the entire page from rendering, resulting in a slow user experience. Learn more: https://nextjs.org/docs/messages/blocking-route`),"__NEXT_ERROR_CODE",{value:"E1083",enumerable:!1,configurable:!0}),b,null);return void c.dynamicErrors.push(e)}}}function ae(a,b,c){return null!==c&&(a.cause=c()),a.stack=a.name+": "+a.message+b,a}var af=((f={})[f.Full=0]="Full",f[f.Empty=1]="Empty",f[f.Errored=2]="Errored",f);function ag(a,b){console.error(b),console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running \`next dev\`, then open "${a.route}" in your browser to investigate the error.
  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`)}function ah(a,b,c,d){if(d.syncDynamicErrorWithStack)throw ag(a,d.syncDynamicErrorWithStack),new k.StaticGenBailoutError;if(0!==b){if(c.hasSuspenseAboveBody)return;let d=c.dynamicErrors;if(d.length>0){for(let b=0;b<d.length;b++)ag(a,d[b]);throw new k.StaticGenBailoutError}if(c.hasDynamicViewport)throw console.error(`Route "${a.route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) without explicitly allowing fully dynamic rendering. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`),new k.StaticGenBailoutError;if(1===b)throw console.error(`Route "${a.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`),new k.StaticGenBailoutError}else if(!1===c.hasAllowedDynamic&&c.hasDynamicMetadata)throw console.error(`Route "${a.route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) when the rest of the route does not. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`),new k.StaticGenBailoutError}function ai(a,b,c,d){if(d||c.hasSuspenseAboveBody)return[];if(0!==b){let d=c.dynamicErrors;if(d.length>0)return d;if(1===b)return[Object.defineProperty(new r.InvariantError(`Route "${a.route}" did not produce a static shell and Next.js was unable to determine a reason.`),"__NEXT_ERROR_CODE",{value:"E936",enumerable:!1,configurable:!0})]}else if(!1===c.hasAllowedDynamic&&0===c.dynamicErrors.length&&c.dynamicMetadata)return[c.dynamicMetadata];return[]}function aj(a,b,c,d,e){if(d){let{missingSampleErrors:a}=d;if(a.length>0)return a}let{validationPreventingErrors:f}=c;if(f.length>0)return f;if(e.renderedIds.size<e.expectedIds.size){let{thrownErrorsOutsideBoundary:b,createInstantStack:d}=c;if(0===b.length){let b=`Route "${a.route}": Could not validate \`unstable_instant\` because the target segment was prevented from rendering for an unknown reason.`,c=null!==d?d():Error();return c.name="Error",c.message=b,[c]}if(1===b.length){let c=`Route "${a.route}": Could not validate \`unstable_instant\` because the target segment was prevented from rendering, likely due to the following error.`,e=null!==d?d():Error();return e.name="Error",e.message=c,[e,b[0]]}{let c=`Route "${a.route}": Could not validate \`unstable_instant\` because the target segment was prevented from rendering, likely due to one of the following errors.`,e=null!==d?d():Error();return e.name="Error",e.message=c,[e,...b]}}if(0!==b){let d=c.dynamicErrors;if(d.length>0)return d;if(1===b)return c.hasAllowedClientDynamicAboveBoundary?[]:[Object.defineProperty(new r.InvariantError(`Route "${a.route}" failed to render during instant validation and Next.js was unable to determine a reason.`),"__NEXT_ERROR_CODE",{value:"E1055",enumerable:!1,configurable:!0})]}else{let a=c.dynamicErrors;if(a.length>0)return a;if(!1===c.hasAllowedDynamic&&c.dynamicMetadata)return[c.dynamicMetadata]}return[]}},28793,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"createDedupedByCallsiteServerErrorLoggerDev",{enumerable:!0,get:function(){return i}});let d=function(a){if(a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var b=e(void 0);if(b&&b.has(a))return b.get(a);var c={__proto__:null},d=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in a)if("default"!==f&&Object.prototype.hasOwnProperty.call(a,f)){var g=d?Object.getOwnPropertyDescriptor(a,f):null;g&&(g.get||g.set)?Object.defineProperty(c,f,g):c[f]=a[f]}return c.default=a,b&&b.set(a,c),c}(a.r(53798));function e(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(e=function(a){return a?c:b})(a)}let f={current:null},g="function"==typeof d.cache?d.cache:a=>a,h=console.warn;function i(a){return function(...b){h(a(...b))}}g(a=>{try{h(f.current)}finally{f.current=null}})},32511,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={isRequestAPICallableInsideAfter:function(){return j},throwForSearchParamsAccessInUseCache:function(){return i},throwWithStaticGenerationBailoutErrorWithDynamicError:function(){return h}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(23161),g=a.r(24725);function h(a,b){throw Object.defineProperty(new f.StaticGenBailoutError(`Route ${a} with \`dynamic = "error"\` couldn't be rendered statically because it used ${b}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E543",enumerable:!1,configurable:!0})}function i(a,b){let c=Object.defineProperty(Error(`Route ${a.route} used \`searchParams\` inside "use cache". Accessing dynamic request data inside a cache scope is not supported. If you need some search params inside a cached function await \`searchParams\` outside of the cached function and pass only the required search params as arguments to the cached function. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E842",enumerable:!1,configurable:!0});throw Error.captureStackTrace(c,b),a.invalidDynamicUsageError??=c,c}function j(){let a=g.afterTaskAsyncStorage.getStore();return(null==a?void 0:a.rootTaskSpawnPhase)==="action"}},23072,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"cookies",{enumerable:!0,get:function(){return n}});let d=a.r(32910),e=a.r(53911),f=a.r(56704),g=a.r(32319),h=a.r(65832),i=a.r(23161),j=a.r(70569),k=a.r(28793),l=a.r(32511),m=a.r(11346);function n(){let a="cookies",b=f.workAsyncStorage.getStore(),c=g.workUnitAsyncStorage.getStore();if(b){if(c&&"after"===c.phase&&!(0,l.isRequestAPICallableInsideAfter)())throw Object.defineProperty(Error(`Route ${b.route} used \`cookies()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`),"__NEXT_ERROR_CODE",{value:"E843",enumerable:!1,configurable:!0});if(b.forceStatic)return p(d.RequestCookiesAdapter.seal(new e.RequestCookies(new Headers({}))));if(b.dynamicShouldError)throw Object.defineProperty(new i.StaticGenBailoutError(`Route ${b.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E849",enumerable:!1,configurable:!0});if(c)switch(c.type){case"cache":let f=Object.defineProperty(Error(`Route ${b.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E831",enumerable:!1,configurable:!0});throw Error.captureStackTrace(f,n),b.invalidDynamicUsageError??=f,f;case"unstable-cache":throw Object.defineProperty(Error(`Route ${b.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`),"__NEXT_ERROR_CODE",{value:"E846",enumerable:!1,configurable:!0});case"generate-static-params":throw Object.defineProperty(Error(`Route ${b.route} used \`cookies()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1123",enumerable:!1,configurable:!0});case"prerender":var k=b,q=c;let r=o.get(q);if(r)return r;let s=(0,j.makeHangingPromise)(q.renderSignal,k.route,"`cookies()`");return o.set(q,s),s;case"prerender-client":case"validation-client":let t="`cookies`";throw Object.defineProperty(new m.InvariantError(`${t} must not be used within a Client Component. Next.js should be preventing ${t} from being included in Client Components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1037",enumerable:!1,configurable:!0});case"prerender-ppr":return(0,h.postponeWithTracking)(b.route,a,c.dynamicTracking);case"prerender-legacy":return(0,h.throwToInterruptStaticGeneration)(a,b,c);case"prerender-runtime":return(0,j.delayUntilRuntimeStage)(c,p(c.cookies));case"private-cache":return p(c.cookies);case"request":let u;if((0,h.trackDynamicDataInDynamicRender)(c),u=(0,d.areCookiesMutableInCurrentPhase)(c)?c.userspaceMutableCookies:c.cookies,!c.asyncApiPromises)return p(u);{let a=(0,g.isInEarlyRenderStage)(c);if(u===c.mutableCookies)return a?c.asyncApiPromises.earlyMutableCookies:c.asyncApiPromises.mutableCookies;return a?c.asyncApiPromises.earlyCookies:c.asyncApiPromises.cookies}}}(0,g.throwForMissingRequestStore)(a)}a.r(44212);let o=new WeakMap;function p(a){let b=o.get(a);if(b)return b;let c=Promise.resolve(a);return o.set(a,c),c}(0,k.createDedupedByCallsiteServerErrorLoggerDev)(function(a,b){let c=a?`Route "${a}" `:"This route ";return Object.defineProperty(Error(`${c}used ${b}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`),"__NEXT_ERROR_CODE",{value:"E830",enumerable:!1,configurable:!0})})},80621,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={HeadersAdapter:function(){return h},ReadonlyHeadersError:function(){return g}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(83276);class g extends Error{constructor(){super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers")}static callable(){throw new g}}class h extends Headers{constructor(a){super(),this.headers=new Proxy(a,{get(b,c,d){if("symbol"==typeof c)return f.ReflectAdapter.get(b,c,d);let e=c.toLowerCase(),g=Object.keys(a).find(a=>a.toLowerCase()===e);if(void 0!==g)return f.ReflectAdapter.get(b,g,d)},set(b,c,d,e){if("symbol"==typeof c)return f.ReflectAdapter.set(b,c,d,e);let g=c.toLowerCase(),h=Object.keys(a).find(a=>a.toLowerCase()===g);return f.ReflectAdapter.set(b,h??c,d,e)},has(b,c){if("symbol"==typeof c)return f.ReflectAdapter.has(b,c);let d=c.toLowerCase(),e=Object.keys(a).find(a=>a.toLowerCase()===d);return void 0!==e&&f.ReflectAdapter.has(b,e)},deleteProperty(b,c){if("symbol"==typeof c)return f.ReflectAdapter.deleteProperty(b,c);let d=c.toLowerCase(),e=Object.keys(a).find(a=>a.toLowerCase()===d);return void 0===e||f.ReflectAdapter.deleteProperty(b,e)}})}static seal(a){return new Proxy(a,{get(a,b,c){switch(b){case"append":case"delete":case"set":return g.callable;default:return f.ReflectAdapter.get(a,b,c)}}})}merge(a){return Array.isArray(a)?a.join(", "):a}static from(a){return a instanceof Headers?a:new h(a)}append(a,b){let c=this.headers[a];"string"==typeof c?this.headers[a]=[c,b]:Array.isArray(c)?c.push(b):this.headers[a]=b}delete(a){delete this.headers[a]}get(a){let b=this.headers[a];return void 0!==b?this.merge(b):null}has(a){return void 0!==this.headers[a]}set(a,b){this.headers[a]=b}forEach(a,b){for(let[c,d]of this.entries())a.call(b,d,c,this)}*entries(){for(let a of Object.keys(this.headers)){let b=a.toLowerCase(),c=this.get(b);yield[b,c]}}*keys(){for(let a of Object.keys(this.headers)){let b=a.toLowerCase();yield b}}*values(){for(let a of Object.keys(this.headers)){let b=this.get(a);yield b}}[Symbol.iterator](){return this.entries()}}},57514,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"headers",{enumerable:!0,get:function(){return m}});let d=a.r(80621),e=a.r(56704),f=a.r(32319),g=a.r(65832),h=a.r(23161),i=a.r(70569),j=a.r(28793),k=a.r(32511),l=a.r(11346);function m(){let a="headers",b=e.workAsyncStorage.getStore(),c=f.workUnitAsyncStorage.getStore();if(b){if(c&&"after"===c.phase&&!(0,k.isRequestAPICallableInsideAfter)())throw Object.defineProperty(Error(`Route ${b.route} used \`headers()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`),"__NEXT_ERROR_CODE",{value:"E839",enumerable:!1,configurable:!0});if(b.forceStatic)return o(d.HeadersAdapter.seal(new Headers({})));if(c)switch(c.type){case"cache":{let a=Object.defineProperty(Error(`Route ${b.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E833",enumerable:!1,configurable:!0});throw Error.captureStackTrace(a,m),b.invalidDynamicUsageError??=a,a}case"unstable-cache":throw Object.defineProperty(Error(`Route ${b.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`),"__NEXT_ERROR_CODE",{value:"E838",enumerable:!1,configurable:!0});case"generate-static-params":throw Object.defineProperty(Error(`Route ${b.route} used \`headers()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1134",enumerable:!1,configurable:!0})}if(b.dynamicShouldError)throw Object.defineProperty(new h.StaticGenBailoutError(`Route ${b.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E828",enumerable:!1,configurable:!0});if(c)switch(c.type){case"prerender":var j=b,p=c;let e=n.get(p);if(e)return e;let q=(0,i.makeHangingPromise)(p.renderSignal,j.route,"`headers()`");return n.set(p,q),q;case"prerender-client":case"validation-client":let r="`headers`";throw Object.defineProperty(new l.InvariantError(`${r} must not be used within a client component. Next.js should be preventing ${r} from being included in client components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1017",enumerable:!1,configurable:!0});case"prerender-ppr":return(0,g.postponeWithTracking)(b.route,a,c.dynamicTracking);case"prerender-legacy":return(0,g.throwToInterruptStaticGeneration)(a,b,c);case"prerender-runtime":return(0,i.delayUntilRuntimeStage)(c,o(c.headers));case"private-cache":return o(c.headers);case"request":if((0,g.trackDynamicDataInDynamicRender)(c),c.asyncApiPromises)return(0,f.isInEarlyRenderStage)(c)?c.asyncApiPromises.earlyHeaders:c.asyncApiPromises.headers;return o(c.headers)}}(0,f.throwForMissingRequestStore)(a)}a.r(44212);let n=new WeakMap;function o(a){let b=n.get(a);if(b)return b;let c=Promise.resolve(a);return n.set(a,c),c}(0,j.createDedupedByCallsiteServerErrorLoggerDev)(function(a,b){let c=a?`Route "${a}" `:"This route ";return Object.defineProperty(Error(`${c}used ${b}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`),"__NEXT_ERROR_CODE",{value:"E836",enumerable:!1,configurable:!0})})},83481,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"draftMode",{enumerable:!0,get:function(){return l}});let d=a.r(32319),e=a.r(56704),f=a.r(65832),g=a.r(28793),h=a.r(23161),i=a.r(94908),j=a.r(11346),k=a.r(70569);function l(){let a="draftMode",b=e.workAsyncStorage.getStore(),c=d.workUnitAsyncStorage.getStore();switch((!b||!c)&&(0,d.throwForMissingRequestStore)(a),c.type){case"prerender-runtime":return(0,k.delayUntilRuntimeStage)(c,m(c.draftMode,b));case"request":return m(c.draftMode,b);case"cache":case"private-cache":case"unstable-cache":let f=(0,d.getDraftModeProviderForCacheScope)(b,c);if(f)return m(f,b);case"prerender":case"prerender-ppr":case"prerender-legacy":return m(null,b);case"prerender-client":case"validation-client":{let a="`draftMode`";throw Object.defineProperty(new j.InvariantError(`${a} must not be used within a Client Component. Next.js should be preventing ${a} from being included in Client Components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1046",enumerable:!1,configurable:!0})}case"generate-static-params":throw Object.defineProperty(Error(`Route ${b.route} used \`${a}()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1132",enumerable:!1,configurable:!0});default:return c}}function m(a,b){let c=o.get(a??n);return c||Promise.resolve(new p(a))}a.r(83276);let n={},o=new WeakMap;class p{constructor(a){this._provider=a}get isEnabled(){return null!==this._provider&&this._provider.isEnabled}enable(){q("draftMode().enable()",this.enable),null!==this._provider&&this._provider.enable()}disable(){q("draftMode().disable()",this.disable),null!==this._provider&&this._provider.disable()}}function q(a,b){let c=e.workAsyncStorage.getStore(),g=d.workUnitAsyncStorage.getStore();if(c){if((null==g?void 0:g.phase)==="after")throw Object.defineProperty(Error(`Route ${c.route} used "${a}" inside \`after()\`. The enabled status of \`draftMode()\` can be read inside \`after()\` but you cannot enable or disable \`draftMode()\`. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`),"__NEXT_ERROR_CODE",{value:"E845",enumerable:!1,configurable:!0});if(c.dynamicShouldError)throw Object.defineProperty(new h.StaticGenBailoutError(`Route ${c.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${a}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E553",enumerable:!1,configurable:!0});if(g)switch(g.type){case"cache":case"private-cache":{let d=Object.defineProperty(Error(`Route ${c.route} used "${a}" inside "use cache". The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E829",enumerable:!1,configurable:!0});throw Error.captureStackTrace(d,b),c.invalidDynamicUsageError??=d,d}case"unstable-cache":throw Object.defineProperty(Error(`Route ${c.route} used "${a}" inside a function cached with \`unstable_cache()\`. The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`),"__NEXT_ERROR_CODE",{value:"E844",enumerable:!1,configurable:!0});case"prerender":case"prerender-runtime":{let b=Object.defineProperty(Error(`Route ${c.route} used ${a} without first calling \`await connection()\`. See more info here: https://nextjs.org/docs/messages/next-prerender-sync-headers`),"__NEXT_ERROR_CODE",{value:"E126",enumerable:!1,configurable:!0});return(0,f.abortAndThrowOnSynchronousRequestDataAccess)(c.route,a,b,g)}case"prerender-client":case"validation-client":let d="`draftMode`";throw Object.defineProperty(new j.InvariantError(`${d} must not be used within a Client Component. Next.js should be preventing ${d} from being included in Client Components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1046",enumerable:!1,configurable:!0});case"prerender-ppr":return(0,f.postponeWithTracking)(c.route,a,g.dynamicTracking);case"prerender-legacy":g.revalidate=0;let e=Object.defineProperty(new i.DynamicServerError(`Route ${c.route} couldn't be rendered statically because it used \`${a}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`),"__NEXT_ERROR_CODE",{value:"E558",enumerable:!1,configurable:!0});throw c.dynamicUsageDescription=a,c.dynamicUsageStack=e.stack,e;case"request":(0,f.trackDynamicDataInDynamicRender)(g);break;case"generate-static-params":throw Object.defineProperty(Error(`Route ${c.route} used \`${a}\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1121",enumerable:!1,configurable:!0})}}}(0,g.createDedupedByCallsiteServerErrorLoggerDev)(function(a,b){let c=a?`Route "${a}" `:"This route ";return Object.defineProperty(Error(`${c}used ${b}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`),"__NEXT_ERROR_CODE",{value:"E835",enumerable:!1,configurable:!0})})},7728,(a,b,c)=>{b.exports.cookies=a.r(23072).cookies,b.exports.headers=a.r(57514).headers,b.exports.draftMode=a.r(83481).draftMode},31941,a=>{"use strict";a.s(["AuthHelpDialog",()=>c,"AuthSegmentedControl",()=>d,"AuthSplitLayout",()=>e,"HelpIconButton",()=>f,"PasswordInput",()=>g,"PasswordStrengthMeter",()=>h]);var b=a.i(38793);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call AuthHelpDialog() from the server but AuthHelpDialog is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx <module evaluation>","AuthHelpDialog"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call AuthSegmentedControl() from the server but AuthSegmentedControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx <module evaluation>","AuthSegmentedControl"),e=(0,b.registerClientReference)(function(){throw Error("Attempted to call AuthSplitLayout() from the server but AuthSplitLayout is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx <module evaluation>","AuthSplitLayout"),f=(0,b.registerClientReference)(function(){throw Error("Attempted to call HelpIconButton() from the server but HelpIconButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx <module evaluation>","HelpIconButton"),g=(0,b.registerClientReference)(function(){throw Error("Attempted to call PasswordInput() from the server but PasswordInput is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx <module evaluation>","PasswordInput"),h=(0,b.registerClientReference)(function(){throw Error("Attempted to call PasswordStrengthMeter() from the server but PasswordStrengthMeter is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx <module evaluation>","PasswordStrengthMeter")},30387,a=>{"use strict";a.s(["AuthHelpDialog",()=>c,"AuthSegmentedControl",()=>d,"AuthSplitLayout",()=>e,"HelpIconButton",()=>f,"PasswordInput",()=>g,"PasswordStrengthMeter",()=>h]);var b=a.i(38793);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call AuthHelpDialog() from the server but AuthHelpDialog is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx","AuthHelpDialog"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call AuthSegmentedControl() from the server but AuthSegmentedControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx","AuthSegmentedControl"),e=(0,b.registerClientReference)(function(){throw Error("Attempted to call AuthSplitLayout() from the server but AuthSplitLayout is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx","AuthSplitLayout"),f=(0,b.registerClientReference)(function(){throw Error("Attempted to call HelpIconButton() from the server but HelpIconButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx","HelpIconButton"),g=(0,b.registerClientReference)(function(){throw Error("Attempted to call PasswordInput() from the server but PasswordInput is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx","PasswordInput"),h=(0,b.registerClientReference)(function(){throw Error("Attempted to call PasswordStrengthMeter() from the server but PasswordStrengthMeter is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/auth-primitives.tsx","PasswordStrengthMeter")},58660,a=>{"use strict";a.i(31941);var b=a.i(30387);a.n(b)},50851,a=>{"use strict";a.s(["QrPayloadView",()=>b]);let b=(0,a.i(38793).registerClientReference)(function(){throw Error("Attempted to call QrPayloadView() from the server but QrPayloadView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/qr-payload-view.tsx <module evaluation>","QrPayloadView")},7974,a=>{"use strict";a.s(["QrPayloadView",()=>b]);let b=(0,a.i(38793).registerClientReference)(function(){throw Error("Attempted to call QrPayloadView() from the server but QrPayloadView is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/qr-payload-view.tsx","QrPayloadView")},40032,a=>{"use strict";a.i(50851);var b=a.i(7974);a.n(b)},73724,a=>{"use strict";a.s(["ThemePreferenceMenuButton",()=>c,"ThemePreferenceProvider",()=>d,"initializeThemePreference",()=>e,"setGlobalThemePreference",()=>f,"useThemePreference",()=>g]);var b=a.i(38793);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call ThemePreferenceMenuButton() from the server but ThemePreferenceMenuButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx <module evaluation>","ThemePreferenceMenuButton"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call ThemePreferenceProvider() from the server but ThemePreferenceProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx <module evaluation>","ThemePreferenceProvider"),e=(0,b.registerClientReference)(function(){throw Error("Attempted to call initializeThemePreference() from the server but initializeThemePreference is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx <module evaluation>","initializeThemePreference"),f=(0,b.registerClientReference)(function(){throw Error("Attempted to call setGlobalThemePreference() from the server but setGlobalThemePreference is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx <module evaluation>","setGlobalThemePreference"),g=(0,b.registerClientReference)(function(){throw Error("Attempted to call useThemePreference() from the server but useThemePreference is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx <module evaluation>","useThemePreference")},77252,a=>{"use strict";a.s(["ThemePreferenceMenuButton",()=>c,"ThemePreferenceProvider",()=>d,"initializeThemePreference",()=>e,"setGlobalThemePreference",()=>f,"useThemePreference",()=>g]);var b=a.i(38793);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call ThemePreferenceMenuButton() from the server but ThemePreferenceMenuButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx","ThemePreferenceMenuButton"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call ThemePreferenceProvider() from the server but ThemePreferenceProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx","ThemePreferenceProvider"),e=(0,b.registerClientReference)(function(){throw Error("Attempted to call initializeThemePreference() from the server but initializeThemePreference is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx","initializeThemePreference"),f=(0,b.registerClientReference)(function(){throw Error("Attempted to call setGlobalThemePreference() from the server but setGlobalThemePreference is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx","setGlobalThemePreference"),g=(0,b.registerClientReference)(function(){throw Error("Attempted to call useThemePreference() from the server but useThemePreference is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/packages/ui/src/components/theme-preference.tsx","useThemePreference")},88706,a=>{"use strict";a.i(73724);var b=a.i(77252);a.n(b)},93765,a=>{"use strict";a.s(["CustomerNavigationProgress",()=>b]);let b=(0,a.i(38793).registerClientReference)(function(){throw Error("Attempted to call CustomerNavigationProgress() from the server but CustomerNavigationProgress is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/customer-web/app/components/navigation-progress.tsx <module evaluation>","CustomerNavigationProgress")},20090,a=>{"use strict";a.s(["CustomerNavigationProgress",()=>b]);let b=(0,a.i(38793).registerClientReference)(function(){throw Error("Attempted to call CustomerNavigationProgress() from the server but CustomerNavigationProgress is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/customer-web/app/components/navigation-progress.tsx","CustomerNavigationProgress")},1468,a=>{"use strict";a.i(93765);var b=a.i(20090);a.n(b)},24381,a=>{"use strict";a.s(["CustomerLocaleProvider",()=>c,"useCustomerLocale",()=>d]);var b=a.i(38793);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call CustomerLocaleProvider() from the server but CustomerLocaleProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/customer-web/app/components/customer-localization.tsx <module evaluation>","CustomerLocaleProvider"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call useCustomerLocale() from the server but useCustomerLocale is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/customer-web/app/components/customer-localization.tsx <module evaluation>","useCustomerLocale")},1518,a=>{"use strict";a.s(["CustomerLocaleProvider",()=>c,"useCustomerLocale",()=>d]);var b=a.i(38793);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call CustomerLocaleProvider() from the server but CustomerLocaleProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/customer-web/app/components/customer-localization.tsx","CustomerLocaleProvider"),d=(0,b.registerClientReference)(function(){throw Error("Attempted to call useCustomerLocale() from the server but useCustomerLocale is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/customer-web/app/components/customer-localization.tsx","useCustomerLocale")},84635,a=>{"use strict";a.i(24381);var b=a.i(1518);a.n(b)},7060,a=>{"use strict";var b=a.i(18588),c=a.i(7728),d=a.i(53798);let e={narrow:760,normal:1160,wide:1360};function f(a,b,c){b?a.setAttribute("data-nav-collapsed","true"):a.removeAttribute("data-nav-collapsed");let d=a.querySelector(".elite-shell-frame");d&&(b?d.setAttribute("data-nav-collapsed","true"):d.removeAttribute("data-nav-collapsed"));let e=c?a.querySelector(`#${c}`):a.querySelector(".elite-shell-aside");e&&(e.hidden=!1,e.removeAttribute("aria-hidden"));let f=a.querySelector(".elite-shell-mobile-nav");f&&(f.hidden=b);let g=a.querySelector(".elite-shell-topbar-brand-launcher");if(g){let a=g.dataset.collapseLabel??"Collapse sidebar menu",c=g.dataset.expandLabel??"Expand sidebar menu";g.dataset.state=b?"collapsed":"expanded",g.setAttribute("aria-expanded",b?"false":"true"),g.setAttribute("aria-label",b?c:a)}}let g=`
main[data-elite-shell] {
  --elite-ink: #111827;
  --elite-ink-soft: #334155;
  --elite-muted: #5b6b7f;
  --elite-line: rgba(15, 23, 42, 0.12);
  --elite-line-strong: rgba(15, 23, 42, 0.18);
  --elite-paper: #f4f7fb;
  --elite-paper-strong: rgba(255, 255, 255, 0.88);
  --elite-card: rgba(255, 255, 255, 0.86);
  --elite-card-strong: rgba(255, 255, 255, 0.96);
  --elite-deep: #0f3050;
  --elite-accent: #0f766e;
  --elite-accent-2: #0b5f5b;
  --elite-accent-soft: rgba(15, 118, 110, 0.12);
  --elite-warm: #b45309;
  --elite-success: #15803d;
  --elite-warning: #b45309;
  --elite-danger: #b91c1c;
  --elite-radius-sm: 14px;
  --elite-radius-md: 20px;
  --elite-radius-lg: 28px;
  --elite-radius-xl: 34px;
  --elite-shadow-sm: 0 12px 24px rgba(15, 23, 42, 0.06);
  --elite-shadow-md: 0 22px 50px rgba(15, 23, 42, 0.08);
  --elite-shadow-lg: 0 32px 72px rgba(15, 23, 42, 0.12);
  --elite-page-gutter: clamp(18px, 2.4vw, 30px);
  --elite-content-gap: 22px;
  --elite-card-padding: clamp(18px, 2.1vw, 28px);
  --elite-card-padding-compact: 18px;
  --elite-shell-topbar-height: 88px;
  color: var(--elite-ink);
  font-family: var(--elite-font-body, "IBM Plex Sans", "Segoe UI", sans-serif);
}

main[data-elite-shell][data-header-mode="hidden"] {
  padding: 0;
}

main[data-elite-shell][data-surface="customer"] {
  --elite-accent: #0b6a54;
  --elite-accent-2: #034635;
  --elite-accent-soft: rgba(11, 106, 84, 0.12);
  --elite-warm: #b8860b;
  --elite-warning: #b8860b;
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.16), transparent 28%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.12), transparent 30%),
    linear-gradient(180deg, #f5f7f4 0%, #edf2ec 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(247, 251, 247, 0.88) 100%);
}

html[dir="rtl"] main[data-elite-shell][data-surface="customer"] {
  direction: rtl;
}

main[data-elite-shell][data-surface="admin"] {
  --elite-accent: #1d4ed8;
  --elite-accent-2: #0f3c96;
  --elite-accent-soft: rgba(29, 78, 216, 0.1);
  --elite-warm: #c2410c;
  --elite-warning: #c2410c;
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(29, 78, 216, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(194, 65, 12, 0.16), transparent 24%),
    linear-gradient(180deg, #f5f7fb 0%, #edf1f7 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 248, 252, 0.9) 100%);
}

main[data-elite-shell][data-surface="neutral"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.14), transparent 26%),
    radial-gradient(circle at top right, rgba(15, 23, 42, 0.08), transparent 24%),
    linear-gradient(180deg, #f7f8fb 0%, #eff2f7 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 250, 252, 0.9) 100%);
}

main[data-elite-shell][data-density="compact"] {
  --elite-content-gap: 18px;
}

main[data-elite-shell] * {
  box-sizing: border-box;
}

main[data-elite-shell] h1,
main[data-elite-shell] h2,
main[data-elite-shell] h3,
main[data-elite-shell] .elite-display,
main[data-elite-shell] .elite-metric-value,
main[data-elite-shell] .elite-definition-value {
  font-family: var(--elite-font-display, "Space Grotesk", "IBM Plex Sans", sans-serif);
  letter-spacing: -0.03em;
}

main[data-elite-shell] p,
main[data-elite-shell] li,
main[data-elite-shell] span,
main[data-elite-shell] label,
main[data-elite-shell] input,
main[data-elite-shell] textarea,
main[data-elite-shell] select,
main[data-elite-shell] button {
  font-size: 0.98rem;
}

main[data-elite-shell] a {
  color: var(--elite-accent-2);
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 48, 80, 0.18);
  transition: color 150ms ease, border-color 150ms ease;
}

main[data-elite-shell] a:hover {
  color: var(--elite-warm);
  border-color: rgba(180, 83, 9, 0.45);
}

main[data-elite-shell] button[data-elite-button],
main[data-elite-shell] button:not([data-unstyled-button]) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.82rem 1.15rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease, background 140ms ease, border-color 140ms ease;
  box-shadow: var(--elite-shadow-sm);
  background: linear-gradient(135deg, var(--elite-accent) 0%, var(--elite-accent-2) 100%);
  color: #f8fbfc;
}

main[data-elite-shell] button[data-elite-button][data-size="compact"] {
  padding: 0.65rem 0.9rem;
  font-size: 0.9rem;
}

main[data-elite-shell] button[data-elite-button][data-size="large"] {
  min-height: 3.55rem;
  padding: 1rem 1.25rem;
  font-size: 1rem;
}

main[data-elite-shell] button[data-elite-button][data-stretch="true"] {
  width: 100%;
}

main[data-elite-shell] button[data-elite-button][data-tone="secondary"] {
  background: var(--elite-card-strong);
  color: var(--elite-ink);
  border-color: var(--elite-line);
  box-shadow: none;
}

main[data-elite-shell] button[data-elite-button][data-tone="ghost"] {
  background: var(--elite-accent-soft);
  color: var(--elite-accent-2);
  border-color: transparent;
  box-shadow: none;
}

main[data-elite-shell] button[data-elite-button][data-tone="danger"] {
  background: linear-gradient(135deg, #d64545 0%, #a61d35 100%);
}

main[data-elite-shell] button:hover:not(:disabled) {
  transform: translateY(-1px);
}

main[data-elite-shell] button:disabled {
  opacity: 0.58;
  cursor: not-allowed;
  transform: none;
}

main[data-elite-shell] [data-elite-control] {
  width: 100%;
  border: 1px solid var(--elite-line);
  border-radius: 16px;
  padding: 0.95rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--elite-ink);
  outline: none;
  transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
}

main[data-elite-shell] [data-elite-control][aria-invalid="true"] {
  border-color: rgba(185, 28, 28, 0.28);
  background: rgba(254, 242, 242, 0.98);
}

main[data-elite-shell] [data-elite-control]:focus {
  border-color: rgba(15, 118, 110, 0.35);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
  background: #ffffff;
}

main[data-elite-shell][data-surface="admin"] [data-elite-control]:focus {
  border-color: rgba(29, 78, 216, 0.3);
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
}

main[data-elite-shell] textarea[data-elite-control] {
  min-height: 120px;
  resize: vertical;
}

main[data-elite-shell] .elite-field {
  display: grid;
  gap: 0.5rem;
}

main[data-elite-shell] .elite-field-label,
main[data-elite-shell] .elite-checkbox-label {
  font-weight: 700;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-field-hint {
  color: var(--elite-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}

main[data-elite-shell] .elite-field[data-tone="danger"] .elite-field-label,
main[data-elite-shell] .elite-field[data-tone="danger"] .elite-field-hint {
  color: var(--elite-danger);
}

main[data-elite-shell] .elite-control-shell {
  position: relative;
}

main[data-elite-shell] .elite-control-shell-password [data-elite-control] {
  padding-right: 4.9rem;
}

main[data-elite-shell] .elite-control-toggle {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  border: 0;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--elite-ink-soft);
  font-weight: 700;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease;
}

main[data-elite-shell] .elite-control-toggle:hover {
  background: rgba(15, 23, 42, 0.12);
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.76);
}

main[data-elite-shell] .elite-checkbox-row input {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.1rem;
  accent-color: var(--elite-accent);
}

main[data-elite-shell] .elite-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.45rem 0.76rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

main[data-elite-shell] .elite-status-badge[data-tone="neutral"] {
  background: rgba(15, 23, 42, 0.06);
  border-color: rgba(15, 23, 42, 0.08);
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-status-badge[data-tone="info"] {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.14);
  color: #15408b;
}

main[data-elite-shell] .elite-status-badge[data-tone="success"] {
  background: rgba(21, 128, 61, 0.1);
  border-color: rgba(21, 128, 61, 0.14);
  color: #166534;
}

main[data-elite-shell] .elite-status-badge[data-tone="warning"] {
  background: rgba(180, 83, 9, 0.12);
  border-color: rgba(180, 83, 9, 0.16);
  color: #9a3412;
}

main[data-elite-shell] .elite-status-badge[data-tone="danger"] {
  background: rgba(185, 28, 28, 0.1);
  border-color: rgba(185, 28, 28, 0.14);
  color: #991b1b;
}

main[data-elite-shell] [data-elite-card] {
  position: relative;
  overflow: hidden;
  border-radius: var(--elite-radius-lg);
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 251, 254, 0.84) 100%);
  box-shadow: var(--elite-shadow-sm);
  padding: var(--elite-card-padding);
}

main[data-elite-shell] [data-elite-card]::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.24), transparent 35%),
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.08), transparent 30%);
}

main[data-elite-shell][data-surface="admin"] [data-elite-card]::before {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.24), transparent 35%),
    radial-gradient(circle at top right, rgba(29, 78, 216, 0.08), transparent 30%);
}

main[data-elite-shell] [data-elite-card][data-density="compact"] {
  padding: var(--elite-card-padding-compact);
}

main[data-elite-shell] [data-elite-card][data-tone="success"] {
  border-color: rgba(21, 128, 61, 0.16);
}

main[data-elite-shell] [data-elite-card][data-tone="warning"] {
  border-color: rgba(180, 83, 9, 0.18);
}

main[data-elite-shell] [data-elite-card][data-tone="danger"] {
  border-color: rgba(185, 28, 28, 0.18);
}

main[data-elite-shell] .elite-card-header,
main[data-elite-shell] .elite-card-body {
  position: relative;
}

main[data-elite-shell] .elite-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

main[data-elite-shell] .elite-card-copy {
  display: grid;
  gap: 6px;
}

main[data-elite-shell] .elite-card-eyebrow {
  margin: 0;
  color: var(--elite-accent);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] [data-elite-card][data-tone="warning"] .elite-card-eyebrow {
  color: var(--elite-warning);
}

main[data-elite-shell] [data-elite-card][data-tone="danger"] .elite-card-eyebrow {
  color: var(--elite-danger);
}

main[data-elite-shell] .elite-card-title {
  margin: 0;
  font-size: clamp(1.25rem, 1.3vw + 1rem, 1.7rem);
  line-height: 1.04;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-card-subtitle {
  margin: 0;
  max-width: 72ch;
  color: var(--elite-muted);
  line-height: 1.58;
}

main[data-elite-shell] .elite-card-body {
  margin-top: 18px;
}

main[data-elite-shell] .elite-section-grid,
main[data-elite-shell] .elite-metric-grid,
main[data-elite-shell] .elite-definition-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(var(--elite-grid-min, 220px), 1fr));
}

main[data-elite-shell] .elite-metric-card,
main[data-elite-shell] .elite-definition-item {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

main[data-elite-shell] .elite-metric-card[data-emphasis="strong"],
main[data-elite-shell] .elite-definition-item[data-emphasis="strong"] {
  background: var(--elite-card-strong);
  border-color: var(--elite-line-strong);
}

main[data-elite-shell] .elite-metric-card[data-tone="success"],
main[data-elite-shell] .elite-definition-item[data-tone="success"] {
  background: rgba(240, 253, 244, 0.95);
  border-color: rgba(21, 128, 61, 0.16);
}

main[data-elite-shell] .elite-metric-card[data-tone="warning"],
main[data-elite-shell] .elite-definition-item[data-tone="warning"] {
  background: rgba(255, 247, 237, 0.95);
  border-color: rgba(180, 83, 9, 0.18);
}

main[data-elite-shell] .elite-metric-card[data-tone="danger"],
main[data-elite-shell] .elite-definition-item[data-tone="danger"] {
  background: rgba(254, 242, 242, 0.95);
  border-color: rgba(185, 28, 28, 0.18);
}

main[data-elite-shell] .elite-metric-label,
main[data-elite-shell] .elite-definition-label {
  color: var(--elite-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-metric-value,
main[data-elite-shell] .elite-definition-value {
  margin-top: 0.5rem;
  color: var(--elite-ink);
  font-size: clamp(1.1rem, 1vw + 1rem, 1.45rem);
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

main[data-elite-shell] .elite-metric-hint {
  margin-top: 0.42rem;
  color: var(--elite-muted);
  font-size: 0.88rem;
}

main[data-elite-shell] .elite-notice {
  border-radius: 18px;
  padding: 1rem 1.05rem;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.84);
}

main[data-elite-shell] .elite-notice[data-emphasis="strong"] {
  border-left-width: 4px;
  background: var(--elite-card-strong);
}

main[data-elite-shell] .elite-notice[data-tone="info"] {
  background: rgba(239, 246, 255, 0.94);
  border-color: rgba(37, 99, 235, 0.16);
}

main[data-elite-shell] .elite-notice[data-tone="success"] {
  background: rgba(240, 253, 244, 0.94);
  border-color: rgba(21, 128, 61, 0.18);
}

main[data-elite-shell] .elite-notice[data-tone="warning"] {
  background: rgba(255, 247, 237, 0.95);
  border-color: rgba(180, 83, 9, 0.18);
}

main[data-elite-shell] .elite-notice[data-tone="danger"] {
  background: rgba(254, 242, 242, 0.95);
  border-color: rgba(185, 28, 28, 0.18);
}

main[data-elite-shell] .elite-notice-title {
  margin-bottom: 0.42rem;
  font-weight: 800;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.9rem;
}

main[data-elite-shell] .elite-list-item {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.72);
}

main[data-elite-shell] .elite-list-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-list-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  color: var(--elite-muted);
  font-size: 0.9rem;
}

main[data-elite-shell] .elite-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

main[data-elite-shell][data-surface="customer"] .elite-toolbar {
  justify-content: flex-end;
}

main[data-elite-shell] .elite-shell-topbar {
  position: relative;
  grid-column: 1 / -1;
  z-index: 12;
  display: grid;
  grid-template-columns: minmax(248px, 292px) minmax(0, 1fr) auto;
  gap: 0.5rem 0.85rem;
  align-items: center;
  min-height: var(--elite-shell-topbar-height);
  padding: 0;
  border: 0;
  border-bottom: 1px solid var(--elite-line);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar {
  border-color: rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.98);
  position: sticky;
  top: 0;
  isolation: isolate;
  box-shadow:
    0 14px 28px rgba(15, 23, 42, 0.05),
    0 1px 0 rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(12px);
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.08));
  pointer-events: none;
}

main[data-elite-shell] .elite-shell-topbar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  width: 100%;
  min-height: 100%;
  gap: 0.72rem;
  padding: 0.58rem 0.9rem;
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  min-width: 0;
}

main[data-elite-shell] .elite-shell-topbar-brand-mark {
  width: 2.08rem;
  height: 2.08rem;
  flex: 0 0 auto;
  border-radius: 13px;
  background:
    radial-gradient(circle at 28% 28%, rgba(255, 241, 188, 0.9), rgba(255, 241, 188, 0.22) 50%, transparent 51%),
    linear-gradient(135deg, #0b6a54 0%, #034635 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.26), 0 8px 14px rgba(3, 70, 53, 0.12);
  overflow: hidden;
}

main[data-elite-shell] .elite-shell-topbar-brand-mark[data-has-image="true"] {
  width: 4.5rem;
  height: 4.5rem;
  background: transparent;
  box-shadow: none;
}

main[data-elite-shell] .elite-shell-topbar-brand-mark-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

main[data-elite-shell] .elite-shell-topbar-brand-copy {
  display: grid;
  gap: 0.04rem;
  min-width: 0;
}

main[data-elite-shell] .elite-shell-topbar-brand-launcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.05rem;
  height: 2.05rem;
  margin-left: 0.1rem;
  flex: 0 0 auto;
  border-radius: 0;
  border: 0;
  background: transparent;
  color: var(--elite-ink-soft);
  box-shadow: none;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher {
  cursor: pointer;
  transition:
    color 140ms ease,
    opacity 140ms ease,
    transform 140ms ease;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher:hover {
  color: var(--elite-ink);
  opacity: 0.9;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher:focus-visible {
  outline: 2px solid rgba(29, 78, 216, 0.35);
  outline-offset: 4px;
}

main[data-elite-shell] button.elite-shell-topbar-brand-launcher[data-state="collapsed"] {
  transform: scale(0.96);
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar-brand-launcher {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-shell-topbar-brand-launcher svg {
  width: 1.16rem;
  height: 1.16rem;
  fill: currentColor;
}

main[data-elite-shell] .elite-shell-topbar-brand-name {
  color: var(--elite-ink);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.02;
  white-space: nowrap;
}

main[data-elite-shell] .elite-shell-topbar-brand-subtitle {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.15;
  white-space: nowrap;
}

main[data-elite-shell] .elite-shell-topbar-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.58rem 0;
  min-width: 0;
  color: var(--elite-muted);
  font-size: 0.78rem;
}

main[data-elite-shell] .elite-shell-topbar-center > * {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

main[data-elite-shell][data-surface="customer"] .elite-shell-topbar-center {
  padding-left: 0.2rem;
}

main[data-elite-shell] .elite-customer-topbar-announcement {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  max-width: 100%;
  color: var(--elite-muted);
  font-size: 0.8rem;
  line-height: 1.1;
}

main[data-elite-shell] .elite-customer-topbar-announcement-icon {
  flex: 0 0 auto;
  font-size: 1.22rem;
  line-height: 1;
}

main[data-elite-shell] .elite-customer-topbar-announcement-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-announcement-copy strong {
  color: var(--elite-ink-soft);
  font-weight: 800;
}

main[data-elite-shell] .elite-customer-topbar-announcement-copy span {
  color: var(--elite-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-announcement-link {
  color: #635bff;
  font-weight: 800;
  white-space: nowrap;
}

main[data-elite-shell] .elite-customer-topbar-summary {
  display: inline-flex;
  align-items: center;
  gap: 0.68rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-summary-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.34rem 0.62rem;
  border-radius: 999px;
  background: rgba(11, 106, 84, 0.1);
  color: var(--elite-accent-2);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
}

main[data-elite-shell] .elite-customer-topbar-summary-line {
  display: grid;
  gap: 0.02rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-summary-line strong {
  color: var(--elite-ink);
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-summary-line span {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-shell-topbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
  flex-wrap: wrap;
  padding: 0.58rem 0.9rem 0.58rem 0;
}

main[data-elite-shell] .elite-shell-topbar [data-elite-button],
main[data-elite-shell] .elite-shell-topbar [data-elite-control] {
  box-shadow: none;
}

main[data-elite-shell] .elite-customer-topbar-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
}

main[data-elite-shell] .elite-customer-topbar-utilities {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  flex-wrap: nowrap;
}

main[data-elite-shell] .elite-customer-topbar-language,
main[data-elite-shell] .elite-customer-topbar-utility {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: var(--elite-ink-soft);
  cursor: pointer;
}

main[data-elite-shell][data-surface="customer"] .elite-customer-topbar-language,
main[data-elite-shell][data-surface="customer"] .elite-customer-topbar-utility {
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-customer-topbar-language {
  gap: 0.42rem;
  min-height: 1.6rem;
  padding: 0;
  border-radius: 0;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-topbar-language-flag {
  display: inline-flex;
  width: 1.54rem;
  height: 1.1rem;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 3px;
}

main[data-elite-shell] .elite-customer-topbar-language-flag svg {
  width: 100%;
  height: 100%;
  display: block;
}

main[data-elite-shell] .elite-customer-topbar-language-code {
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-customer-topbar-utility {
  position: relative;
  width: 2.08rem;
  height: 2.08rem;
  border-radius: 0;
}

main[data-elite-shell] .elite-customer-topbar-utility svg {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

main[data-elite-shell] .elite-customer-topbar-language[data-active="true"],
main[data-elite-shell] .elite-customer-topbar-utility[data-active="true"] {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-customer-topbar-language:hover:not(:disabled),
main[data-elite-shell] .elite-customer-topbar-utility:hover:not(:disabled) {
  transform: none;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-customer-topbar-language:focus-visible,
main[data-elite-shell] .elite-customer-topbar-utility:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.25);
  outline-offset: 2px;
}

main[data-elite-shell] .elite-customer-topbar-utility-badge {
  position: absolute;
  top: -0.28rem;
  right: -0.28rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.02rem;
  height: 1.02rem;
  padding: 0 0.22rem;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.56rem;
  font-weight: 800;
  line-height: 1;
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.22);
}

main[data-elite-shell] .elite-theme-menu {
  position: relative;
  min-width: 0;
  isolation: isolate;
}

main[data-elite-shell] .elite-theme-menu-trigger {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.08rem;
  height: 2.08rem;
  border-radius: 999px;
  color: var(--elite-ink-soft);
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease, transform 140ms ease;
}

main[data-elite-shell] .elite-theme-menu-trigger:hover {
  color: var(--elite-ink);
  background: rgba(15, 23, 42, 0.04);
}

main[data-elite-shell] .elite-theme-menu-trigger:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.25);
  outline-offset: 2px;
}

main[data-elite-shell][data-surface="admin"] .elite-theme-menu-trigger:focus-visible {
  outline-color: rgba(29, 78, 216, 0.28);
}

main[data-elite-shell] .elite-theme-menu[data-open="true"] .elite-theme-menu-trigger {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-theme-menu-trigger-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

main[data-elite-shell] .elite-theme-menu-trigger-icon svg,
main[data-elite-shell] .elite-theme-menu-item-icon svg {
  width: 1.18rem;
  height: 1.18rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

main[data-elite-shell] .elite-theme-menu-panel {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  z-index: 48;
  display: grid;
  gap: 0.45rem;
  min-width: 15.5rem;
  padding: 0.7rem;
  border-radius: 22px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.98);
  box-shadow:
    0 22px 42px rgba(15, 23, 42, 0.14),
    0 8px 18px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
}

html[dir="rtl"] main[data-elite-shell] .elite-theme-menu-panel {
  left: 0;
  right: auto;
}

main[data-elite-shell] .elite-theme-menu-item {
  all: unset;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.7rem;
  padding: 0.72rem 0.8rem;
  border-radius: 16px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.88);
  color: var(--elite-ink);
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
}

main[data-elite-shell] .elite-theme-menu-item:hover {
  border-color: var(--elite-line-strong);
  background: var(--elite-card-strong);
}

main[data-elite-shell] .elite-theme-menu-item:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.24);
  outline-offset: 2px;
}

main[data-elite-shell][data-surface="admin"] .elite-theme-menu-item:focus-visible {
  outline-color: rgba(29, 78, 216, 0.24);
}

main[data-elite-shell] .elite-theme-menu-item[data-active="true"] {
  border-color: rgba(15, 118, 110, 0.18);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(255, 255, 255, 0.98) 100%);
}

main[data-elite-shell][data-surface="admin"] .elite-theme-menu-item[data-active="true"] {
  border-color: rgba(29, 78, 216, 0.18);
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(255, 255, 255, 0.98) 100%);
}

main[data-elite-shell] .elite-theme-menu-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-theme-menu-item-copy {
  display: grid;
  gap: 0.08rem;
  min-width: 0;
}

main[data-elite-shell] .elite-theme-menu-item-copy strong {
  color: var(--elite-ink);
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.1;
}

main[data-elite-shell] .elite-theme-menu-item-copy span {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.15;
}

main[data-elite-shell] .elite-theme-menu-item-check {
  color: var(--elite-accent-2);
  font-size: 0.82rem;
}

main[data-elite-shell] .elite-customer-topbar-menu {
  position: relative;
  min-width: 0;
  isolation: isolate;
}

main[data-elite-shell] .elite-customer-topbar-menu > summary {
  list-style: none;
}

main[data-elite-shell] .elite-customer-topbar-menu > summary::-webkit-details-marker {
  display: none;
}

main[data-elite-shell] .elite-customer-topbar-user {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  min-height: 2.55rem;
  padding: 0.34rem 0.58rem 0.34rem 0.38rem;
  border-radius: 999px;
  border: 1px solid rgba(11, 106, 84, 0.14);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: none;
  cursor: pointer;
  user-select: none;
}

main[data-elite-shell] .elite-customer-topbar-menu[open] .elite-customer-topbar-user {
  border-color: rgba(11, 106, 84, 0.26);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}

main[data-elite-shell] .elite-customer-topbar-user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0b6a54 0%, #034635 100%);
  color: #f8fbfc;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

main[data-elite-shell] .elite-customer-topbar-user-copy {
  display: grid;
  gap: 0.04rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-user-copy strong {
  color: var(--elite-ink);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.05;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-user-copy span {
  color: var(--elite-muted);
  font-size: 0.68rem;
  line-height: 1.05;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-user-caret {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1;
}

main[data-elite-shell] .elite-customer-topbar-menu-panel {
  position: absolute;
  top: calc(100% + 0.55rem);
  right: 0;
  z-index: 40;
  display: grid;
  gap: 0.78rem;
  width: min(21rem, calc(100vw - 1.25rem));
  min-width: max(17.5rem, 100%);
  padding: 0.92rem;
  border-radius: 24px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.995);
  box-shadow:
    0 22px 42px rgba(15, 23, 42, 0.14),
    0 8px 18px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
  overflow: hidden;
}

html[dir="rtl"] main[data-elite-shell] .elite-customer-topbar-menu-panel {
  left: 0;
  right: auto;
}

main[data-elite-shell] .elite-customer-topbar-menu-panel::before {
  content: "";
  position: absolute;
  top: -0.4rem;
  right: 1.85rem;
  width: 0.9rem;
  height: 0.9rem;
  border-top: 1px solid rgba(15, 23, 42, 0.1);
  border-left: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.995);
  transform: rotate(45deg);
}

html[dir="rtl"] main[data-elite-shell] .elite-customer-topbar-menu-panel::before {
  left: 1.85rem;
  right: auto;
  border-left: 0;
  border-right: 1px solid rgba(15, 23, 42, 0.1);
}

main[data-elite-shell] .elite-customer-topbar-menu-eyebrow {
  color: var(--elite-muted);
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-topbar-menu-list {
  display: grid;
  gap: 0.45rem;
}

main[data-elite-shell] .elite-customer-topbar-menu-item {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.72rem 0.84rem;
  border-radius: 16px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.92);
  color: var(--elite-ink);
  text-align: left;
  box-shadow: none;
  cursor: pointer;
  font: inherit;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

html[dir="rtl"] main[data-elite-shell] .elite-customer-topbar-menu-item,
html[dir="rtl"] main[data-elite-shell] .elite-rail-link,
html[dir="rtl"] main[data-elite-shell] .elite-page-header,
html[dir="rtl"] main[data-elite-shell] .elite-auth-panel,
html[dir="rtl"] main[data-elite-shell] .elite-auth-hero,
html[dir="rtl"] .elite-help-dialog {
  text-align: right;
}

main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"] {
  border-color: rgba(11, 106, 84, 0.22);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.12) 0%, rgba(255, 255, 255, 0.98) 100%);
  box-shadow: inset 3px 0 0 var(--elite-accent);
}

main[data-elite-shell] .elite-customer-topbar-menu-item:hover {
  border-color: rgba(11, 106, 84, 0.18);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.07) 0%, rgba(255, 255, 255, 0.98) 100%);
}

main[data-elite-shell] .elite-customer-topbar-menu-item:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.24);
  outline-offset: 2px;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-copy {
  display: grid;
  gap: 0.06rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-copy strong {
  color: var(--elite-ink);
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-copy span {
  color: var(--elite-muted);
  font-size: 0.72rem;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-customer-topbar-menu-item-state {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.8rem;
  min-height: 2rem;
  padding: 0 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(11, 106, 84, 0.16);
  background: rgba(248, 251, 250, 0.96);
  color: var(--elite-accent-2);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"] .elite-customer-topbar-menu-item-state {
  border-color: rgba(11, 106, 84, 0.2);
  background: rgba(255, 255, 255, 0.88);
}

main[data-elite-shell] .elite-customer-topbar-menu-logout {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3rem;
  padding: 0.78rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #ffffff;
  color: var(--elite-ink);
  cursor: pointer;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    box-shadow 140ms ease;
}

main[data-elite-shell] .elite-customer-topbar-menu-logout:hover {
  border-color: rgba(15, 23, 42, 0.2);
  background: rgba(248, 250, 252, 0.96);
}

main[data-elite-shell] .elite-customer-topbar-menu-logout:focus-visible {
  outline: 2px solid rgba(11, 106, 84, 0.24);
  outline-offset: 2px;
}

main[data-elite-shell] .elite-customer-topbar-menu-logout {
  width: 100%;
  justify-content: center;
  border-radius: 16px;
  box-shadow: none;
}

main[data-elite-shell] .elite-customer-topbar-menu-logout[data-tone="secondary"] {
  background: rgba(15, 23, 42, 0.04);
}

main[data-elite-shell] .elite-customer-topbar-menu-logout[data-tone="secondary"]:hover:not(:disabled) {
  background: rgba(15, 23, 42, 0.06);
}

main[data-elite-shell] .elite-empty-state {
  display: grid;
  gap: 0.7rem;
  padding: clamp(20px, 4vw, 34px);
  border-radius: 22px;
  border: 1px dashed var(--elite-line-strong);
  background: rgba(255, 255, 255, 0.58);
  text-align: left;
}

main[data-elite-shell] .elite-empty-state h3 {
  margin: 0;
  font-size: 1.1rem;
}

main[data-elite-shell] .elite-empty-state p {
  margin: 0;
  color: var(--elite-muted);
  line-height: 1.6;
}

main[data-elite-shell] .elite-anchor-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

main[data-elite-shell] .elite-anchor-nav a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.64rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.74);
  color: var(--elite-ink-soft);
  font-weight: 700;
}

main[data-elite-shell] .elite-anchor-nav a:hover {
  background: var(--elite-card-strong);
  border-color: rgba(15, 118, 110, 0.18);
}

main[data-elite-shell] .elite-auth-layout {
  display: grid;
  gap: 18px;
  align-items: start;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
  max-width: none;
  margin: 0;
  padding: clamp(28px, 4vw, 64px) clamp(24px, 5vw, 72px);
  border-radius: 0;
  border: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 241, 188, 0.22), transparent 24%),
    radial-gradient(circle at 78% 28%, rgba(186, 138, 21, 0.18), transparent 18%),
    radial-gradient(circle at bottom left, rgba(7, 116, 88, 0.24), transparent 28%),
    linear-gradient(135deg, #052e24 0%, #063c2f 38%, #0a5a46 72%, #094738 100%);
  box-shadow: none;
  align-items: stretch;
  gap: 0;
  isolation: isolate;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.08), transparent 24%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.08), transparent 26%),
    linear-gradient(180deg, #f7faf8 0%, #eef3ef 100%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"]::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at -8% 115%, rgba(255, 241, 188, 0.16), transparent 30%),
    radial-gradient(circle at 24% 112%, rgba(255, 255, 255, 0.08), transparent 26%),
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.1), transparent 14%);
  pointer-events: none;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"]::before {
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 255, 255, 0.48), transparent 18%),
    radial-gradient(circle at 90% 84%, rgba(184, 134, 11, 0.06), transparent 18%),
    radial-gradient(circle at 10% 86%, rgba(11, 106, 84, 0.05), transparent 22%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero::after {
  content: "";
  position: absolute;
  top: clamp(54px, 8vw, 110px);
  left: clamp(28px, 6vw, 84px);
  width: clamp(110px, 12vw, 160px);
  height: clamp(110px, 12vw, 160px);
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 241, 188, 0.24), rgba(255, 255, 255, 0.06) 70%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01));
  pointer-events: none;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero::after {
  display: none;
}

main[data-elite-shell] .elite-auth-hero,
main[data-elite-shell] .elite-auth-panel {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 251, 254, 0.9) 100%);
  box-shadow: var(--elite-shadow-md);
  padding: clamp(22px, 2.8vw, 32px);
  animation: eliteFadeUp 220ms ease;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero,
main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
  border: 0;
  box-shadow: none;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(18px, 3vw, 34px);
  padding: clamp(18px, 1.6vw, 28px) clamp(20px, 2vw, 34px) clamp(18px, 1.8vw, 26px);
  background: transparent;
  border-radius: 30px 0 0 30px;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
  align-items: stretch;
  text-align: center;
  gap: 0;
  padding: 0;
  border-radius: 30px 0 0 30px;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
  justify-content: center;
  background: linear-gradient(180deg, #ffffff 0%, #f7faf8 100%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
  width: 100%;
  max-width: none;
  justify-self: stretch;
  align-self: stretch;
  height: 100%;
  padding: clamp(1.5rem, 1.6vw, 2rem);
  border-radius: 0 30px 30px 0;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 28px 72px rgba(3, 70, 53, 0.22);
  margin-left: -1px;
}

main[data-elite-shell] .elite-auth-hero::before,
main[data-elite-shell] .elite-auth-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

main[data-elite-shell] .elite-auth-hero::before {
  background:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.15), transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.22), transparent 32%);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero::before,
main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel::before {
  display: none;
}

main[data-elite-shell][data-surface="admin"] .elite-auth-hero::before {
  background:
    radial-gradient(circle at top left, rgba(29, 78, 216, 0.14), transparent 34%),
    radial-gradient(circle at bottom right, rgba(194, 65, 12, 0.12), transparent 30%);
}

main[data-elite-shell] .elite-auth-hero,
main[data-elite-shell] .elite-auth-panel-top,
main[data-elite-shell] .elite-auth-panel-body {
  display: grid;
  gap: 16px;
}

main[data-elite-shell] .elite-auth-kicker {
  position: relative;
  z-index: 1;
  width: fit-content;
  padding: 0.42rem 0.7rem;
  border-radius: 999px;
  background: var(--elite-accent-soft);
  color: var(--elite-accent-2);
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-kicker {
  background: rgba(255, 241, 188, 0.14);
  color: rgba(255, 248, 225, 0.96);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel .elite-auth-kicker {
  background: rgba(11, 106, 84, 0.1);
  color: #0b5e4a;
}

main[data-elite-shell] .elite-auth-hero-title,
main[data-elite-shell] .elite-auth-panel-title {
  position: relative;
  z-index: 1;
  margin: 0;
  line-height: 0.97;
}

main[data-elite-shell] .elite-auth-hero-title {
  font-size: clamp(2rem, 3vw, 3rem);
  max-width: 12ch;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-title {
  max-width: 7ch;
  font-size: clamp(3.2rem, 5.4vw, 6rem);
  color: #ffffff;
  letter-spacing: -0.04em;
  line-height: 0.92;
}

main[data-elite-shell] .elite-auth-panel-title {
  font-size: clamp(1.5rem, 1.4vw + 1rem, 2rem);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-title {
  font-size: clamp(1.9rem, 1.6vw, 2.2rem);
  letter-spacing: -0.04em;
}

main[data-elite-shell] .elite-auth-hero-copy,
main[data-elite-shell] .elite-auth-panel-subtitle {
  position: relative;
  z-index: 1;
  color: var(--elite-muted);
  line-height: 1.65;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-copy {
  max-width: 44ch;
  color: rgba(242, 250, 244, 0.88);
  font-size: clamp(1.04rem, 0.6vw + 0.94rem, 1.34rem);
  line-height: 1.75;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-subtitle {
  font-size: 1rem;
  line-height: 1.55;
  max-width: 30ch;
}

main[data-elite-shell] .elite-auth-highlight-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

main[data-elite-shell] .elite-auth-highlight {
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.76);
}

main[data-elite-shell] .elite-auth-highlight[data-tone="info"] {
  background: rgba(239, 246, 255, 0.95);
  border-color: rgba(37, 99, 235, 0.14);
}

main[data-elite-shell] .elite-auth-highlight[data-tone="warning"] {
  background: rgba(255, 247, 237, 0.95);
  border-color: rgba(180, 83, 9, 0.16);
}

main[data-elite-shell] .elite-auth-highlight[data-tone="success"] {
  background: rgba(240, 253, 244, 0.95);
  border-color: rgba(21, 128, 61, 0.16);
}

main[data-elite-shell] .elite-auth-highlight-label {
  color: var(--elite-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-auth-highlight-value {
  margin-top: 0.45rem;
  font-family: var(--elite-font-display, "Space Grotesk", "IBM Plex Sans", sans-serif);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-auth-highlight-detail {
  margin-top: 0.35rem;
  color: var(--elite-muted);
  line-height: 1.5;
}

main[data-elite-shell] .elite-auth-checklist {
  position: relative;
  z-index: 1;
}

main[data-elite-shell] .elite-auth-hero-media {
  position: relative;
  z-index: 1;
  width: min(100%, 820px);
}

main[data-elite-shell] .elite-auth-hero-media img {
  display: block;
  width: 100%;
  height: auto;
}

main[data-elite-shell] .elite-auth-checklist ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

main[data-elite-shell] .elite-auth-checklist li {
  display: flex;
  gap: 0.7rem;
  color: var(--elite-ink-soft);
  line-height: 1.58;
}

main[data-elite-shell] .elite-auth-checklist li::before {
  content: "";
  width: 0.65rem;
  height: 0.65rem;
  margin-top: 0.42rem;
  border-radius: 999px;
  flex: 0 0 auto;
  background: linear-gradient(135deg, var(--elite-accent) 0%, var(--elite-warm) 100%);
  box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.08);
}

main[data-elite-shell][data-surface="admin"] .elite-auth-checklist li::before {
  box-shadow: 0 0 0 6px rgba(29, 78, 216, 0.08);
}

main[data-elite-shell] .elite-auth-footnote {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: var(--elite-muted);
  font-size: 0.9rem;
}

main[data-elite-shell] .elite-auth-panel {
  display: grid;
  gap: 18px;
  align-content: start;
}

main[data-elite-shell] .elite-auth-panel-top {
  position: relative;
  z-index: 1;
  gap: 14px;
  align-content: start;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-top {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.8rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-action {
  justify-self: end;
  align-self: start;
  justify-content: flex-end;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-copy {
  min-width: 0;
}

main[data-elite-shell] .elite-auth-panel-action {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

main[data-elite-shell] .elite-auth-panel-body {
  position: relative;
  z-index: 1;
  align-content: start;
}

main[data-elite-shell] .elite-auth-form {
  display: grid;
  gap: 15px;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-form {
  gap: 0.9rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: clamp(1.1rem, 1.7vw, 1.6rem);
  padding: clamp(1.8rem, 2.1vw, 2.6rem);
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-top,
main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-body {
  width: min(100%, 38rem);
  margin-inline: auto;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-top {
  grid-template-columns: 1fr;
  gap: 1rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-copy {
  display: grid;
  gap: 0.7rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-top {
  z-index: 4;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-copy {
  position: relative;
  z-index: 1;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-action {
  position: relative;
  z-index: 10;
  order: -1;
  justify-self: stretch;
  align-self: auto;
  width: 100%;
  justify-content: flex-start;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  overflow: visible;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-theme-menu-panel {
  z-index: 1000;
}

html[dir="rtl"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-action {
  justify-content: flex-end;
}

html[dir="rtl"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  order: -1;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel-subtitle {
  max-width: 34ch;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-form {
  gap: 1rem;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-inline-actions {
  margin-top: 0.2rem;
  justify-content: center;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-hero[data-media-only="true"] {
  background: #ffffff;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage {
  background: #ffffff;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage::before {
  display: none;
}

main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-image {
  width: min(72%, 560px);
}

main[data-elite-shell] .elite-auth-oauth-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.62rem;
}

main[data-elite-shell] .elite-auth-oauth-label svg {
  width: 1.02rem;
  height: 1.02rem;
  flex: 0 0 auto;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button] {
  background: linear-gradient(135deg, #0b6a54 0%, #044433 100%);
  box-shadow: 0 18px 28px rgba(3, 70, 53, 0.22);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button][data-tone="secondary"] {
  background: rgba(255, 255, 255, 0.98);
  color: var(--elite-ink);
  border-color: rgba(148, 163, 184, 0.26);
  box-shadow: none;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button]:hover:not(:disabled) {
  box-shadow: 0 22px 34px rgba(3, 70, 53, 0.3);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button][data-tone="secondary"]:hover:not(:disabled) {
  box-shadow: none;
}

main[data-elite-shell] .elite-auth-panel-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
  justify-content: flex-end;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-tools {
  width: 100%;
  justify-content: space-between;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-field {
  gap: 0.4rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-field-label {
  font-size: 0.76rem;
  letter-spacing: 0.03em;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-field-hint {
  font-size: 0.8rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] [data-elite-control] {
  min-height: 3.35rem;
  border-radius: 18px;
  padding: 0.95rem 1rem;
  background: #f4f7fd;
  border-color: rgba(148, 163, 184, 0.28);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] [data-elite-control]:focus {
  border-color: rgba(11, 106, 84, 0.34);
  box-shadow: 0 0 0 4px rgba(11, 106, 84, 0.12);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-control-shell-password [data-elite-control] {
  padding-right: 4.4rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-control-toggle {
  right: 0.6rem;
  padding: 0.32rem 0.58rem;
  font-size: 0.82rem;
}

main[data-elite-shell] .elite-auth-segmented {
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(244, 247, 251, 0.96);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-segmented {
  padding: 0.22rem;
  gap: 0.2rem;
  background: rgba(15, 23, 42, 0.04);
}

main[data-elite-shell] .elite-auth-segment {
  min-height: 2.6rem;
  padding: 0.68rem 1rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--elite-ink-soft);
  font-weight: 800;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-segment {
  min-height: 2.2rem;
  padding: 0.5rem 0.8rem;
  font-size: 0.86rem;
}

main[data-elite-shell] .elite-auth-segment[data-active="true"] {
  background: linear-gradient(135deg, #0b6a54 0%, #044433 100%);
  color: #f8fbfc;
  box-shadow: var(--elite-shadow-sm);
}

main[data-elite-shell] .elite-auth-segment:hover {
  color: var(--elite-ink);
}

main[data-elite-shell] .elite-password-strength {
  display: grid;
  gap: 0.55rem;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  border: 1px solid var(--elite-line);
  background: rgba(248, 250, 252, 0.94);
}

main[data-elite-shell] .elite-password-strength-bars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
}

main[data-elite-shell] .elite-password-strength-bar {
  height: 0.38rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.24);
}

main[data-elite-shell] .elite-password-strength[data-score="1"] .elite-password-strength-bar[data-active="true"] {
  background: #f59e0b;
}

main[data-elite-shell] .elite-password-strength[data-score="2"] .elite-password-strength-bar[data-active="true"] {
  background: #0f766e;
}

main[data-elite-shell] .elite-password-strength[data-score="3"] .elite-password-strength-bar[data-active="true"] {
  background: #15803d;
}

main[data-elite-shell][data-surface="admin"] .elite-password-strength[data-score="2"] .elite-password-strength-bar[data-active="true"] {
  background: #1d4ed8;
}

main[data-elite-shell] .elite-password-strength-copy {
  display: grid;
  gap: 0.2rem;
}

main[data-elite-shell] .elite-password-strength-copy strong {
  color: var(--elite-ink);
  font-size: 0.92rem;
}

main[data-elite-shell] .elite-password-strength-copy span {
  color: var(--elite-muted);
  font-size: 0.86rem;
  line-height: 1.45;
}

main[data-elite-shell] .elite-auth-inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: center;
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-inline-actions {
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.86rem;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-footnote {
  max-width: 44ch;
  color: rgba(242, 250, 244, 0.76);
  font-size: 0.98rem;
  line-height: 1.65;
}

main[data-elite-shell] .elite-auth-centered-stage {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(20px, 4vw, 56px);
}

main[data-elite-shell] .elite-auth-centered-card {
  width: min(100%, 720px);
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-media {
  margin-top: clamp(10px, 1.2vw, 18px);
  filter: none;
}

main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] .elite-auth-hero-media {
  width: 100%;
  max-width: none;
  height: 100%;
  margin-top: 0;
  filter: none;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] .elite-auth-hero-media {
  width: min(100%, 920px);
  margin-top: 0;
  filter: none;
}

main[data-elite-shell] .elite-login-brand-stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: clamp(24px, 3vw, 44px);
  background: #ffffff;
  border-radius: 30px 0 0 30px;
  overflow: hidden;
}

main[data-elite-shell] .elite-login-brand-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(11, 106, 84, 0.06), transparent 24%),
    radial-gradient(circle at 80% 78%, rgba(184, 134, 11, 0.05), transparent 22%);
  pointer-events: none;
}

main[data-elite-shell] .elite-login-brand-image {
  position: relative;
  z-index: 1;
  display: block;
  width: min(78%, 680px);
  height: auto;
  transform: none;
  filter: none;
}

main[data-elite-shell] .elite-auth-inline-actions button[data-unstyled-button] {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--elite-accent-2);
  font-weight: 700;
  cursor: pointer;
}

main[data-elite-shell] .elite-auth-inline-actions button[data-unstyled-button]:hover {
  color: var(--elite-warm);
}

main[data-elite-shell] .elite-auth-disclosure {
  border-radius: 18px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

main[data-elite-shell] .elite-auth-disclosure summary {
  cursor: pointer;
  list-style: none;
  padding: 0.95rem 1rem;
  font-weight: 700;
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-auth-disclosure summary::-webkit-details-marker {
  display: none;
}

main[data-elite-shell] .elite-auth-disclosure-body {
  padding: 0 1rem 1rem;
}

main[data-elite-shell] .elite-help-icon-button {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.94);
  color: var(--elite-accent-2);
  font-size: 1rem;
  font-weight: 900;
  box-shadow: var(--elite-shadow-sm);
  cursor: pointer;
  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease, color 140ms ease;
}

main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-help-icon-button {
  width: 2.35rem;
  height: 2.35rem;
  box-shadow: none;
}

main[data-elite-shell] .elite-help-icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(15, 118, 110, 0.18);
  background: #ffffff;
  color: var(--elite-warm);
}

main[data-elite-shell] .elite-help-dialog-backdrop,
.elite-help-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(18px, 3vw, 28px);
  background: rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(8px);
}

main[data-elite-shell] .elite-help-dialog,
.elite-help-dialog {
  width: min(760px, 100%);
  max-height: min(82vh, 860px);
  overflow: auto;
  border-radius: 28px;
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 252, 0.96) 100%);
  box-shadow: var(--elite-shadow-lg);
  padding: clamp(20px, 3vw, 30px);
}

main[data-elite-shell] .elite-help-dialog-header,
.elite-help-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.elite-help-dialog-copy {
  display: grid;
  gap: 0.75rem;
}

.elite-help-dialog-title {
  margin: 0;
  font-size: clamp(1.6rem, 1.5vw + 1rem, 2.2rem);
  line-height: 1;
}

.elite-help-dialog-intro {
  color: var(--elite-muted);
  line-height: 1.65;
  max-width: 65ch;
}

.elite-help-dialog-close {
  width: 2.4rem;
  height: 2.4rem;
  flex: 0 0 auto;
  border-radius: 999px;
  border: 1px solid var(--elite-line);
  background: rgba(15, 23, 42, 0.04);
  color: var(--elite-ink-soft);
  font-size: 1.35rem;
  cursor: pointer;
}

.elite-help-dialog-body {
  display: grid;
  gap: 1rem;
  margin-top: 1.15rem;
}

.elite-help-dialog-section {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.76);
}

.elite-help-dialog-section h3 {
  margin: 0 0 0.55rem;
  font-size: 1rem;
}

.elite-help-dialog-section p {
  margin: 0;
  color: var(--elite-muted);
  line-height: 1.6;
}

.elite-help-dialog-list {
  margin: 0.75rem 0 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.55rem;
  color: var(--elite-ink-soft);
}

.elite-help-dialog-footer {
  color: var(--elite-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
}

main[data-elite-shell] .elite-mono-panel {
  margin-top: 1rem;
  border-radius: 20px;
  padding: 1rem;
  background: #122030;
  color: #eef4f8;
  overflow-x: auto;
  white-space: pre-wrap;
}

main[data-elite-shell] code {
  font-family: "SFMono-Regular", "Menlo", "Monaco", monospace;
  font-size: 0.93em;
  padding: 0.16rem 0.4rem;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.08);
  color: var(--elite-accent-2);
}

main[data-elite-shell] pre code {
  padding: 0;
  background: transparent;
  color: inherit;
}

main[data-elite-shell] .elite-sticky-panel {
  position: sticky;
  top: 18px;
}

main[data-elite-shell] .elite-shell-frame {
  display: grid;
  gap: 18px;
}

main[data-elite-shell][data-surface="customer"] .elite-shell-frame {
  gap: 0;
}

main[data-elite-shell] .elite-shell-aside {
  display: none;
}

main[data-elite-shell] .elite-shell-main {
  min-width: 0;
}

main[data-elite-shell] .elite-shell-mobile-nav {
  display: block;
}

main[data-elite-shell][data-nav-collapsed="true"] .elite-shell-mobile-nav {
  display: none;
}

main[data-elite-shell] .elite-shell-mobile-nav details {
  border-radius: 22px;
  border: 1px solid var(--elite-line);
  background: var(--elite-rail-bg);
  box-shadow: var(--elite-shadow-sm);
  overflow: hidden;
}

main[data-elite-shell] .elite-shell-mobile-nav summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0.95rem 1rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-shell-mobile-nav summary::-webkit-details-marker {
  display: none;
}

main[data-elite-shell] .elite-shell-mobile-nav-body {
  padding: 0 0.9rem 0.9rem;
}

main[data-elite-shell] .elite-shell-content {
  width: 100%;
  display: grid;
  gap: var(--elite-content-gap);
}

main[data-elite-shell][data-header-mode="hidden"] .elite-shell-content {
  min-height: 100vh;
  max-width: none !important;
  gap: 0;
}

main[data-elite-shell][data-header-mode="hidden"] .elite-shell-main {
  min-height: 100vh;
}

main[data-elite-shell][data-header-mode="hidden"] .elite-page-stack {
  min-height: 100vh;
}

main[data-elite-shell] .elite-page-header {
  position: relative;
  overflow: hidden;
  border-radius: var(--elite-radius-xl);
  border: 1px solid var(--elite-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 251, 254, 0.88) 100%);
  box-shadow: var(--elite-shadow-md);
  padding: clamp(22px, 3vw, 34px);
  display: grid;
  gap: 18px;
}

main[data-elite-shell][data-surface="customer"] .elite-page-header {
  position: relative;
  top: auto;
  z-index: auto;
  padding: 0.85rem 0.25rem 0.25rem;
  margin-top: 0.1rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  gap: 0.5rem;
}

main[data-elite-shell] .elite-page-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 30%),
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.11), transparent 32%);
  pointer-events: none;
}

main[data-elite-shell][data-surface="admin"] .elite-page-header::before {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 30%),
    radial-gradient(circle at top right, rgba(29, 78, 216, 0.11), transparent 32%);
}

main[data-elite-shell][data-surface="customer"] .elite-page-header::before {
  display: none;
}

main[data-elite-shell] .elite-page-header-top {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

main[data-elite-shell][data-surface="customer"] .elite-page-header-top {
  display: none;
}

main[data-elite-shell] .elite-page-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.52rem 0.82rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.94);
  color: #f8fbfc;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--elite-shadow-sm);
  text-transform: uppercase;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

main[data-elite-shell] .elite-page-brand-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--elite-accent) 0%, var(--elite-warm) 100%);
}

main[data-elite-shell] .elite-page-header-body {
  position: relative;
  display: grid;
  gap: 12px;
}

main[data-elite-shell][data-surface="customer"] .elite-page-header-body {
  gap: 0.75rem;
}

main[data-elite-shell] .elite-page-header-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

main[data-elite-shell] .elite-page-header-body-customer {
  gap: 0.65rem;
}

main[data-elite-shell] .elite-page-breadcrumbs {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
  min-width: 0;
  color: var(--elite-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

main[data-elite-shell] .elite-page-breadcrumbs a {
  border-bottom: 0;
  color: var(--elite-ink-soft);
}

main[data-elite-shell] .elite-page-breadcrumbs a:hover {
  color: var(--elite-warm);
}

main[data-elite-shell] .elite-page-breadcrumbs span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

main[data-elite-shell] .elite-page-breadcrumbs [aria-hidden="true"] {
  color: rgba(91, 107, 127, 0.72);
}

main[data-elite-shell] .elite-page-title {
  margin: 0;
  max-width: 18ch;
  font-size: clamp(2.1rem, 4vw, 3.7rem);
  line-height: 0.95;
}

main[data-elite-shell][data-surface="customer"] .elite-page-title {
  max-width: 18ch;
  font-size: clamp(2rem, 2.2vw + 0.95rem, 3.15rem);
  letter-spacing: -0.05em;
}

main[data-elite-shell] .elite-page-subtitle {
  margin: 0;
  max-width: 72ch;
  color: var(--elite-muted);
  font-size: 1rem;
  line-height: 1.68;
}

main[data-elite-shell][data-surface="customer"] .elite-page-subtitle {
  max-width: 64ch;
  font-size: 0.98rem;
  line-height: 1.6;
}

main[data-elite-shell] .elite-page-secondary-nav {
  position: sticky;
  top: 14px;
  z-index: 8;
  border-radius: 18px;
  border: 1px solid var(--elite-line);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  padding: 0.8rem 0.9rem;
  box-shadow: var(--elite-shadow-sm);
}

main[data-elite-shell] .elite-page-stack {
  display: grid;
  gap: var(--elite-content-gap);
}

main[data-elite-shell] .elite-page-footer {
  color: var(--elite-muted);
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

main[data-elite-shell] .elite-customer-dashboard {
  display: grid;
  gap: var(--elite-content-gap);
}

main[data-elite-shell] .elite-customer-dashboard-hero {
  overflow: hidden;
}

main[data-elite-shell] .elite-customer-dashboard-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 1.25rem;
  align-items: stretch;
}

main[data-elite-shell] .elite-customer-dashboard-hero-copy,
main[data-elite-shell] .elite-customer-dashboard-stack,
main[data-elite-shell] .elite-customer-dashboard-notices {
  display: grid;
  gap: 1rem;
}

main[data-elite-shell] .elite-customer-dashboard-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

main[data-elite-shell] .elite-customer-dashboard-hero-subtitle {
  margin: 0;
  max-width: 58ch;
  color: var(--elite-ink-soft);
  font-size: 1.02rem;
  line-height: 1.76;
}

main[data-elite-shell] .elite-customer-dashboard-operator {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 250, 248, 0.88) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-operator-label,
main[data-elite-shell] .elite-customer-dashboard-signal-label,
main[data-elite-shell] .elite-customer-dashboard-mini-card span {
  color: var(--elite-muted);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-customer-dashboard-operator strong,
main[data-elite-shell] .elite-customer-dashboard-fleet-top strong,
main[data-elite-shell] .elite-customer-dashboard-activity-top strong {
  font-size: 1.1rem;
  line-height: 1.2;
}

main[data-elite-shell] .elite-customer-dashboard-operator span:last-child,
main[data-elite-shell] .elite-customer-dashboard-action-copy span,
main[data-elite-shell] .elite-customer-dashboard-signal-hint,
main[data-elite-shell] .elite-customer-dashboard-fleet-top span,
main[data-elite-shell] .elite-customer-dashboard-activity-top span,
main[data-elite-shell] .elite-customer-dashboard-fleet-meta,
main[data-elite-shell] .elite-customer-dashboard-activity-meta {
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-customer-dashboard-action-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

main[data-elite-shell] .elite-customer-dashboard-action {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.8rem;
  align-items: flex-start;
  min-height: 100%;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
  color: var(--elite-ink);
  text-align: left;
  text-decoration: none;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 140ms ease;
}

main[data-elite-shell] .elite-customer-dashboard-action[data-tone="primary"] {
  border-color: rgba(11, 106, 84, 0.18);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.92) 0%, rgba(3, 70, 53, 0.96) 100%);
  color: #f6fbf9;
}

main[data-elite-shell] .elite-customer-dashboard-action:hover,
main[data-elite-shell] .elite-customer-dashboard-action:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 20px 34px rgba(15, 23, 42, 0.08);
  border-color: rgba(15, 23, 42, 0.16);
}

main[data-elite-shell] .elite-customer-dashboard-action,
main[data-elite-shell] .elite-customer-dashboard-action:hover {
  border-bottom: 0;
}

main[data-elite-shell] .elite-customer-dashboard-action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 16px;
  background: rgba(11, 106, 84, 0.1);
  color: var(--elite-accent);
}

main[data-elite-shell] .elite-customer-dashboard-action[data-tone="primary"] .elite-customer-dashboard-action-icon {
  background: rgba(255, 255, 255, 0.16);
  color: #f6fbf9;
}

main[data-elite-shell] .elite-customer-dashboard-action-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

main[data-elite-shell] .elite-customer-dashboard-action-copy {
  display: grid;
  gap: 0.2rem;
}

main[data-elite-shell] .elite-customer-dashboard-action-copy strong {
  font-size: 1rem;
  line-height: 1.15;
}

main[data-elite-shell] .elite-customer-dashboard-action[data-tone="primary"] .elite-customer-dashboard-action-copy span {
  color: rgba(246, 251, 249, 0.82);
}

main[data-elite-shell] .elite-customer-dashboard-signal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

main[data-elite-shell] .elite-customer-dashboard-signal {
  display: grid;
  gap: 0.3rem;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
}

main[data-elite-shell] .elite-customer-dashboard-signal[data-tone="success"] {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.9) 0%, rgba(240, 253, 244, 0.96) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-signal[data-tone="warning"] {
  background: linear-gradient(135deg, rgba(255, 247, 237, 0.92) 0%, rgba(255, 251, 235, 0.96) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-signal[data-tone="info"] {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.92) 0%, rgba(239, 246, 255, 0.97) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-signal-value {
  font-family: var(--elite-font-display, "Space Grotesk", "IBM Plex Sans", sans-serif);
  font-size: 2rem;
  letter-spacing: -0.05em;
  line-height: 1;
}

main[data-elite-shell] .elite-customer-dashboard-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: var(--elite-content-gap);
}

main[data-elite-shell] .elite-customer-dashboard-card {
  height: 100%;
}

main[data-elite-shell] .elite-customer-dashboard-form {
  display: grid;
  gap: 1rem;
}

main[data-elite-shell] .elite-customer-dashboard-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

main[data-elite-shell] .elite-customer-dashboard-mini-card {
  display: grid;
  gap: 0.3rem;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.76);
}

main[data-elite-shell] .elite-customer-dashboard-mini-card strong {
  font-size: 1rem;
  line-height: 1.15;
}

main[data-elite-shell] .elite-customer-dashboard-empty {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px dashed rgba(15, 23, 42, 0.16);
  background: rgba(255, 255, 255, 0.64);
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-customer-dashboard-activity-list,
main[data-elite-shell] .elite-customer-dashboard-token-list {
  display: grid;
  gap: 0.8rem;
}

main[data-elite-shell] .elite-customer-dashboard-activity-item,
main[data-elite-shell] .elite-customer-dashboard-fleet-card {
  display: grid;
  gap: 0.85rem;
  padding: 1rem 1.05rem;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.82);
}

main[data-elite-shell] .elite-customer-dashboard-activity-top,
main[data-elite-shell] .elite-customer-dashboard-fleet-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

main[data-elite-shell] .elite-customer-dashboard-activity-top > div,
main[data-elite-shell] .elite-customer-dashboard-fleet-top > div {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

main[data-elite-shell] .elite-customer-dashboard-activity-meta,
main[data-elite-shell] .elite-customer-dashboard-fleet-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  font-size: 0.92rem;
}

main[data-elite-shell] .elite-customer-dashboard-workspace-list .elite-list-item[data-active="true"] {
  border-color: rgba(11, 106, 84, 0.2);
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.08) 0%, rgba(255, 255, 255, 0.94) 100%);
}

main[data-elite-shell] .elite-customer-dashboard-token-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

main[data-elite-shell] .elite-customer-dashboard-fleet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.9rem;
}

main[data-elite-shell] .elite-rail {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 16px;
  border-radius: 24px;
  border: 1px solid var(--elite-line);
  background: var(--elite-rail-bg);
  box-shadow: var(--elite-shadow-sm);
}

main[data-elite-shell][data-surface="customer"] .elite-rail {
  position: relative;
  overflow: hidden;
  gap: 12px;
  padding: 12px 10px 14px;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(15, 23, 42, 0.09);
  border-right: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow: inset -1px 0 0 rgba(15, 23, 42, 0.02);
  min-height: 100%;
}

main[data-elite-shell][data-surface="customer"] .elite-rail::before {
  display: none;
}

main[data-elite-shell] .elite-rail-header {
  display: grid;
  gap: 10px;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-header {
  position: relative;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--elite-line);
}

main[data-elite-shell] .elite-rail-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

main[data-elite-shell] .elite-rail-brand-mark {
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 15px;
  background:
    radial-gradient(circle at 28% 28%, rgba(255, 241, 188, 0.92), rgba(255, 241, 188, 0.2) 48%, transparent 49%),
    linear-gradient(135deg, #0b6a54 0%, #034635 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 8px 18px rgba(3, 70, 53, 0.15);
}

main[data-elite-shell] .elite-rail-brand-copy {
  display: grid;
  gap: 0.12rem;
  min-width: 0;
}

main[data-elite-shell] .elite-rail-brand-name {
  color: var(--elite-ink);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.1;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-brand-name {
  font-size: 1.05rem;
}

main[data-elite-shell] .elite-rail-brand-subtitle {
  color: var(--elite-muted);
  font-size: 0.84rem;
  line-height: 1.2;
}

main[data-elite-shell] .elite-rail-section-label {
  position: relative;
  color: var(--elite-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-rail-title {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-title {
  font-size: 1.28rem;
  letter-spacing: -0.04em;
}

main[data-elite-shell] .elite-rail-copy {
  margin: 0;
  color: var(--elite-muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

main[data-elite-shell][data-surface="customer"] .elite-rail-copy {
  max-width: 30ch;
}

main[data-elite-shell] .elite-rail-workspace {
  position: relative;
  display: grid;
  gap: 0.3rem;
  padding: 0.72rem 0.8rem;
  border-radius: 18px;
  border: 1px solid rgba(11, 106, 84, 0.09);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 252, 249, 0.72) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

main[data-elite-shell] .elite-rail-workspace-label {
  color: var(--elite-muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

main[data-elite-shell] .elite-rail-workspace-name {
  color: var(--elite-ink);
  font-size: 0.98rem;
  font-weight: 800;
}

main[data-elite-shell] .elite-rail-workspace-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.8rem;
  color: var(--elite-muted);
  font-size: 0.8rem;
}

main[data-elite-shell] .elite-rail-links {
  display: grid;
  gap: 5px;
}

main[data-elite-shell] .elite-rail-section {
  display: grid;
  gap: 7px;
}

main[data-elite-shell] .elite-rail-section + .elite-rail-section {
  padding-top: 12px;
  border-top: 1px solid var(--elite-line);
}

main[data-elite-shell] .elite-rail-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 2.9rem;
  padding: 0.68rem 0.62rem 0.68rem 0.78rem;
  border-radius: 13px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--elite-ink-soft);
  font-weight: 700;
  font-size: 0.94rem;
}

main[data-elite-shell] .elite-rail-link-main {
  display: flex;
  align-items: center;
  gap: 0.62rem;
  min-width: 0;
  flex: 1 1 auto;
}

main[data-elite-shell] .elite-rail-link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  flex: 0 0 auto;
  border-radius: 0;
  border: 0;
  background: transparent;
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-rail-link-icon svg,
main[data-elite-shell] .elite-rail-link-chevron svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

main[data-elite-shell] .elite-rail-link-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

main[data-elite-shell] .elite-rail-link-trailing {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: 0 0 auto;
}

main[data-elite-shell] .elite-rail-link-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--elite-muted);
}

main[data-elite-shell] .elite-rail-link::before {
  content: "";
  position: absolute;
  left: 0.18rem;
  top: 50%;
  width: 0.22rem;
  height: 58%;
  border-radius: 999px;
  background: transparent;
  transform: translateY(-50%);
  transition: background 140ms ease, box-shadow 140ms ease;
}

html[dir="rtl"] main[data-elite-shell] .elite-rail-link::before {
  left: auto;
  right: 0.18rem;
}

main[data-elite-shell] .elite-rail-link[data-active="true"] {
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(15, 118, 110, 0.05) 100%);
  border-color: rgba(15, 118, 110, 0.16);
  color: var(--elite-accent-2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 8px 16px rgba(11, 106, 84, 0.05);
}

main[data-elite-shell][data-surface="customer"] .elite-rail-link[data-active="true"] {
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.12) 0%, rgba(11, 106, 84, 0.06) 100%);
  border-color: rgba(11, 106, 84, 0.14);
}

main[data-elite-shell][data-surface="admin"] .elite-rail-link[data-active="true"] {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(29, 78, 216, 0.05) 100%);
  border-color: rgba(29, 78, 216, 0.14);
}

main[data-elite-shell] .elite-rail-link:hover {
  border-color: var(--elite-line-strong);
  background: rgba(15, 23, 42, 0.03);
}

main[data-elite-shell] .elite-rail-link:hover::before,
main[data-elite-shell] .elite-rail-link[data-active="true"]::before {
  background: linear-gradient(135deg, rgba(11, 106, 84, 0.82), rgba(184, 134, 11, 0.82));
  box-shadow: 0 0 0 5px rgba(11, 106, 84, 0.08);
}

main[data-elite-shell] .elite-rail-link[data-active="true"] .elite-rail-link-icon {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-rail-link[data-active="true"] .elite-rail-link-chevron {
  color: var(--elite-accent-2);
}

main[data-elite-shell] .elite-rail-link[data-key="dashboard"] .elite-rail-link-icon {
  color: #0b6a54;
}

main[data-elite-shell] .elite-rail-link[data-key="messages"] .elite-rail-link-icon {
  color: #2563eb;
}

main[data-elite-shell] .elite-rail-link[data-key="api-docs"] .elite-rail-link-icon {
  color: #b45309;
}

main[data-elite-shell] .elite-rail-link[data-key="settings"] .elite-rail-link-icon {
  color: #475569;
}

main[data-elite-shell] .elite-rail-link[data-key="subscription"] .elite-rail-link-icon {
  color: #7c3aed;
}

main[data-elite-shell] .elite-rail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--elite-line);
}

main[data-elite-shell] .elite-rail-footer {
  display: grid;
  gap: 0.4rem;
  color: var(--elite-muted);
  font-size: 0.88rem;
}

html[data-elite-theme="dark"] main[data-elite-shell] {
  --elite-ink: #e5edf7;
  --elite-ink-soft: #cbd7e7;
  --elite-muted: #9dafc5;
  --elite-line: rgba(148, 163, 184, 0.18);
  --elite-line-strong: rgba(148, 163, 184, 0.28);
  --elite-paper: #0b1220;
  --elite-paper-strong: rgba(14, 22, 36, 0.94);
  --elite-card: rgba(15, 23, 42, 0.78);
  --elite-card-strong: rgba(17, 27, 44, 0.94);
  --elite-deep: #08111f;
  --elite-shadow-sm: 0 18px 30px rgba(2, 6, 23, 0.28);
  --elite-shadow-md: 0 28px 56px rgba(2, 6, 23, 0.34);
  --elite-shadow-lg: 0 36px 82px rgba(2, 6, 23, 0.42);
  color-scheme: dark;
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="customer"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.28), transparent 32%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.16), transparent 30%),
    linear-gradient(180deg, #07120f 0%, #0b1814 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(7, 18, 15, 0.98) 0%, rgba(9, 26, 21, 0.92) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="admin"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(29, 78, 216, 0.24), transparent 30%),
    radial-gradient(circle at top right, rgba(194, 65, 12, 0.18), transparent 24%),
    linear-gradient(180deg, #08101d 0%, #0d1523 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(8, 16, 29, 0.98) 0%, rgba(12, 22, 38, 0.92) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="neutral"] {
  --elite-shell-bg:
    radial-gradient(circle at top left, rgba(15, 118, 110, 0.22), transparent 28%),
    radial-gradient(circle at top right, rgba(15, 23, 42, 0.14), transparent 24%),
    linear-gradient(180deg, #080f1a 0%, #0d1623 100%);
  --elite-rail-bg:
    linear-gradient(180deg, rgba(9, 16, 28, 0.98) 0%, rgba(13, 22, 35, 0.92) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] a {
  border-bottom-color: rgba(148, 163, 184, 0.22);
}

html[data-elite-theme="dark"] main[data-elite-shell] button[data-elite-button][data-tone="secondary"] {
  background: rgba(15, 23, 42, 0.72);
  color: var(--elite-ink);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] button[data-elite-button][data-tone="ghost"] {
  background: rgba(15, 118, 110, 0.16);
  color: #8ae2d7;
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-control] {
  background: rgba(8, 15, 27, 0.88);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-control][aria-invalid="true"] {
  background: rgba(69, 10, 10, 0.44);
  border-color: rgba(248, 113, 113, 0.26);
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-control]:focus {
  background: rgba(10, 18, 31, 0.96);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-control-toggle {
  background: rgba(148, 163, 184, 0.12);
  color: var(--elite-muted);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-control-toggle:hover {
  background: rgba(148, 163, 184, 0.18);
  color: var(--elite-ink);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-checkbox-row,
html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-card],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-metric-card,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-definition-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-notice,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-list-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-empty-state,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-anchor-nav a,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-page-secondary-nav,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-highlight,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-password-strength,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-disclosure,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-help-dialog-section,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-operator,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-action:not([data-tone="primary"]),
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-signal:not([data-tone="success"]):not([data-tone="warning"]):not([data-tone="info"]),
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-mini-card,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-activity-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-fleet-card,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-empty,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-rail-workspace,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-shell-mobile-nav details {
  background: rgba(15, 23, 42, 0.7);
  border-color: var(--elite-line);
  box-shadow: var(--elite-shadow-sm);
}

html[data-elite-theme="dark"] main[data-elite-shell] [data-elite-card]::before,
html[data-elite-theme="dark"] main[data-elite-shell][data-surface="admin"] [data-elite-card]::before {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 35%),
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 32%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-metric-card[data-emphasis="strong"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-definition-item[data-emphasis="strong"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-notice[data-emphasis="strong"] {
  background: rgba(17, 27, 44, 0.92);
  border-color: var(--elite-line-strong);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-shell-topbar {
  background: rgba(8, 14, 25, 0.9);
  border-color: var(--elite-line);
  box-shadow: none;
  backdrop-filter: blur(16px);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="customer"] .elite-shell-topbar::after {
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(148, 163, 184, 0.06), rgba(148, 163, 184, 0.14));
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-shell-topbar-brand {
  border-right-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-summary-chip {
  background: rgba(15, 118, 110, 0.18);
  color: #8ce0d5;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-user,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-panel,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-panel,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-help-icon-button,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-help-dialog,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-page-header,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-panel,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-hero,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-login-brand-stage {
  background: rgba(9, 16, 28, 0.96);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] .elite-help-dialog {
  background: rgba(9, 16, 28, 0.96);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu[open] .elite-customer-topbar-user {
  box-shadow: var(--elite-shadow-sm);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-panel::before {
  border-top-color: var(--elite-line);
  border-left-color: var(--elite-line);
  background: rgba(9, 16, 28, 0.96);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-trigger:hover {
  background: rgba(148, 163, 184, 0.1);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-logout {
  background: rgba(15, 23, 42, 0.7);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-item:hover,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item:hover,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-logout:hover {
  background: rgba(20, 30, 48, 0.92);
  border-color: var(--elite-line-strong);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-theme-menu-item[data-active="true"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-dashboard-workspace-list .elite-list-item[data-active="true"] {
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.22) 0%, rgba(15, 23, 42, 0.9) 100%);
  border-color: rgba(15, 118, 110, 0.28);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-surface="admin"] .elite-theme-menu-item[data-active="true"] {
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.22) 0%, rgba(15, 23, 42, 0.9) 100%);
  border-color: rgba(96, 165, 250, 0.28);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item-state {
  background: rgba(15, 23, 42, 0.56);
  border-color: rgba(15, 118, 110, 0.22);
  color: #9be7dc;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-customer-topbar-menu-item[data-active="true"] .elite-customer-topbar-menu-item-state {
  background: rgba(8, 15, 27, 0.92);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-page-brand,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-mono-panel {
  background: rgba(2, 6, 23, 0.9);
}

html[data-elite-theme="dark"] main[data-elite-shell] code {
  background: rgba(148, 163, 184, 0.12);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.22), transparent 24%),
    radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.12), transparent 26%),
    linear-gradient(180deg, #06100c 0%, #08141f 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.22), transparent 26%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.12), transparent 24%),
    linear-gradient(180deg, #06100c 0%, #0a1512 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"]::before {
  background:
    radial-gradient(circle at 12% 10%, rgba(255, 255, 255, 0.08), transparent 18%),
    radial-gradient(circle at 90% 84%, rgba(184, 134, 11, 0.08), transparent 18%),
    radial-gradient(circle at 10% 86%, rgba(11, 106, 84, 0.1), transparent 22%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
  box-shadow: var(--elite-shadow-lg);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-surface="customer"][data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
  background: linear-gradient(180deg, rgba(8, 16, 28, 0.98) 0%, rgba(12, 22, 38, 0.94) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-hero[data-media-only="true"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(184, 134, 11, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(6, 14, 24, 0.98) 0%, rgba(10, 19, 33, 0.94) 100%);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-login-brand-stage::before {
  display: none;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login .elite-auth-panel {
  background:
    radial-gradient(circle at top left, rgba(11, 106, 84, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(5, 11, 20, 0.98) 0%, rgba(8, 16, 28, 0.96) 100%);
  border: 1px solid rgba(125, 142, 173, 0.22);
  box-shadow: 0 28px 72px rgba(0, 0, 0, 0.34);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] button[data-elite-button][data-tone="secondary"],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] [data-elite-control],
html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-segmented {
  background: rgba(15, 23, 42, 0.76);
  border-color: var(--elite-line);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-kicker {
  background: rgba(15, 118, 110, 0.16);
  color: #a5f3e6;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel .elite-auth-kicker {
  background: rgba(15, 118, 110, 0.14);
  color: #8ee3d7;
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel-subtitle,
html[data-elite-theme="dark"] main[data-elite-shell] .elite-login-brand-stage::before {
  color: var(--elite-muted);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-rail,
html[data-elite-theme="dark"] main[data-elite-shell][data-surface="customer"] .elite-rail {
  background: rgba(8, 14, 25, 0.94);
  border-color: var(--elite-line);
  box-shadow: inset -1px 0 0 rgba(148, 163, 184, 0.08);
}

html[data-elite-theme="dark"] main[data-elite-shell] .elite-rail-link:hover {
  background: rgba(148, 163, 184, 0.08);
  border-color: var(--elite-line-strong);
}

html[data-elite-theme="dark"] main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link::after {
  background: rgba(2, 6, 23, 0.94);
}

@keyframes eliteFadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1024px) {
  main[data-elite-shell] .elite-shell-frame[data-has-nav="true"] {
    grid-template-columns: minmax(248px, 292px) minmax(0, 1fr);
    align-items: start;
  }

  main[data-elite-shell] .elite-shell-frame[data-has-nav="true"][data-nav-collapsed="true"] {
    grid-template-columns: 86px minmax(0, 1fr);
  }

  main[data-elite-shell] .elite-auth-layout {
    grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
  }

  main[data-elite-shell] .elite-auth-layout.elite-auth-layout-login {
    grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);
  }

  main[data-elite-shell] .elite-shell-aside {
    display: flex;
    position: sticky;
    top: var(--elite-shell-topbar-height);
    height: calc(100dvh - var(--elite-shell-topbar-height));
    align-self: start;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-shell-aside {
    display: flex;
  }

  main[data-elite-shell] .elite-shell-aside > * {
    width: 100%;
    min-height: 100%;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail {
    justify-items: center;
    gap: 10px;
    padding: 12px 8px 14px;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-header,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-meta,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-section-label,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-workspace {
    display: none;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-section,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-links {
    width: 100%;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-section + .elite-rail-section {
    padding-top: 0;
    border-top: 0;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link {
    justify-content: center;
    width: 100%;
    min-height: 3.15rem;
    padding: 0.7rem 0;
    border-radius: 16px;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-main {
    justify-content: center;
    width: 100%;
    gap: 0;
    flex: 0 0 auto;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-label,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-trailing {
    display: none;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link::before {
    left: 50%;
    top: auto;
    bottom: 0.3rem;
    width: 58%;
    height: 0.2rem;
    transform: translateX(-50%);
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link::after {
    content: attr(data-tooltip);
    position: absolute;
    left: calc(100% + 0.7rem);
    top: 50%;
    z-index: 18;
    padding: 0.5rem 0.7rem;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.96);
    color: #f8fbfc;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    white-space: nowrap;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(-4px);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link:hover::after,
  main[data-elite-shell][data-nav-collapsed="true"] .elite-rail-link:focus-visible::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  main[data-elite-shell] .elite-shell-mobile-nav {
    display: none;
  }
}

@media (max-width: 1080px) {
  main[data-elite-shell] .elite-customer-dashboard-hero-grid,
  main[data-elite-shell] .elite-customer-dashboard-main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  main[data-elite-shell] .elite-shell-topbar {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
  }

  main[data-elite-shell] .elite-shell-topbar-center,
  main[data-elite-shell] .elite-shell-topbar-actions {
    justify-content: flex-start;
  }

  main[data-elite-shell] .elite-page-brand {
    font-size: 0.7rem;
  }

  main[data-elite-shell] .elite-page-header,
  main[data-elite-shell] .elite-shell-mobile-nav details {
    border-radius: 22px;
  }

  main[data-elite-shell][data-surface="customer"] .elite-page-header {
    top: 12px;
    padding: 16px;
  }

  main[data-elite-shell] .elite-page-title {
    max-width: none;
  }

  main[data-elite-shell][data-surface="customer"] .elite-page-title {
    font-size: clamp(1.9rem, 8vw, 2.7rem);
  }

  main[data-elite-shell][data-surface="customer"] .elite-toolbar {
    justify-content: stretch;
  }

  main[data-elite-shell] .elite-customer-topbar-controls {
    width: 100%;
    align-items: stretch;
  }

  main[data-elite-shell] .elite-customer-topbar-menu {
    width: 100%;
  }

  main[data-elite-shell] .elite-customer-topbar-user {
    width: 100%;
    justify-content: space-between;
  }

  main[data-elite-shell] .elite-customer-topbar-menu-panel {
    left: 0;
    right: 0;
    width: 100%;
  }

  main[data-elite-shell] .elite-customer-topbar-menu-logout {
    width: 100%;
  }

  main[data-elite-shell] .elite-page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }

  main[data-elite-shell] .elite-page-breadcrumbs {
    justify-content: flex-start;
    white-space: normal;
  }

  main[data-elite-shell] .elite-auth-hero-title {
    max-width: none;
  }

  main[data-elite-shell] .elite-auth-segmented {
    width: 100%;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
    justify-self: stretch;
    width: 100%;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] {
    min-height: 100vh;
    padding: 1.15rem;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero {
    padding: 0.65rem 0.35rem 0.1rem;
    gap: 1rem;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-title {
    font-size: clamp(2.4rem, 10vw, 3.3rem);
  }

  main[data-elite-shell] .elite-customer-dashboard-action-row,
  main[data-elite-shell] .elite-customer-dashboard-signal-grid {
    grid-template-columns: 1fr;
  }

  main[data-elite-shell] .elite-customer-dashboard-activity-top,
  main[data-elite-shell] .elite-customer-dashboard-fleet-top {
    flex-direction: column;
    align-items: flex-start;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-panel {
    padding: 1.15rem;
    border-radius: 22px;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero::after {
    top: 56px;
    left: 26px;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero-media {
    display: none;
  }

  main[data-elite-shell] .elite-auth-layout[data-variant="spotlight"] .elite-auth-hero[data-media-only="true"] {
    display: none;
  }
}
`;function h({label:a,variant:c="topbar",markSrc:d,markAlt:e="",launcherControlsId:f,launcherButtonLabel:g,launcherExpandLabel:i,onLauncherClick:j}){let k="topbar"===c,l=(0,b.jsxs)("svg",{viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,b.jsx)("rect",{x:"4",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"9.75",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"15.5",y:"4",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"4",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"9.75",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"15.5",y:"9.75",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"4",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"9.75",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"}),(0,b.jsx)("rect",{x:"15.5",y:"15.5",width:"4.5",height:"4.5",rx:"1.1"})]}),m=k?j?(0,b.jsx)("button",{type:"button",className:"elite-shell-topbar-brand-launcher","data-unstyled-button":!0,"data-state":"expanded","data-collapse-label":g,"data-expand-label":i,"aria-label":g,"aria-controls":f,"aria-expanded":"true",onClick:j,children:l}):(0,b.jsx)("span",{className:"elite-shell-topbar-brand-launcher","aria-hidden":"true",children:l}):null;return(0,b.jsxs)("div",{className:k?"elite-shell-topbar-brand":"elite-rail-brand","data-variant":c,children:[(0,b.jsx)("span",{className:k?"elite-shell-topbar-brand-mark":"elite-rail-brand-mark","aria-hidden":"true","data-has-image":d?"true":"false",children:d?(0,b.jsx)("img",{className:"elite-shell-topbar-brand-mark-image",src:d,alt:e}):null}),(0,b.jsxs)("div",{className:k?"elite-shell-topbar-brand-copy":"elite-rail-brand-copy",children:[(0,b.jsx)("span",{className:k?"elite-shell-topbar-brand-name":"elite-rail-brand-name",children:"Elite Message"}),(0,b.jsx)("span",{className:k?"elite-shell-topbar-brand-subtitle":"elite-rail-brand-subtitle",children:a})]}),m]})}a.s(["AppShell",0,function({title:a,subtitle:c,breadcrumbLabel:d,children:i,footer:j,meta:k,nav:l,headerActions:m,secondaryNav:n,surface:o="neutral",density:p="comfortable",contentWidth:q="wide",headerMode:r="default",topbarBrandMarkAlt:s,labels:t}){let u=l?`elite-shell-nav-${o}`:void 0,v="full"===q?void 0:e[q],w=("customer"===o||"admin"===o)&&!!l&&"hidden"!==r,x=d??a,y=!!c.trim(),z=!!l&&("customer"===o||"admin"===o),A=t?.surfaceLabel??function(a){switch(a){case"customer":return"Customer Surface";case"admin":return"Admin Console";default:return"Elite Message"}}(o),B=t?.breadcrumbAriaLabel??"Breadcrumb",C=t?.breadcrumbHomeLabel??"Dashboard",D=t?.customerTopbarLabel??`${A} topbar`,E=t?.mobileNavigationLabel??"Navigation",F=t?.mobileNavigationOpenLabel??"Open",G=t?.collapseSidebarLabel??"Collapse sidebar menu",H=t?.expandSidebarLabel??"Expand sidebar menu",I=t?.brandMarkAlt??s??"Elite Message logo";return(0,b.jsxs)("main",{"data-elite-shell":!0,"data-surface":o,"data-density":p,"data-header-mode":r,style:{minHeight:"100vh",background:"var(--elite-shell-bg)",padding:"hidden"===r||w?0:"clamp(18px, 2vw, 26px)",color:"var(--elite-ink)"},children:[(0,b.jsx)("style",{children:g}),(0,b.jsxs)("div",{className:"elite-shell-frame","data-has-nav":l?"true":"false",children:[w?(0,b.jsxs)("div",{className:"elite-shell-topbar","aria-label":D,children:[(0,b.jsx)(h,{label:A,variant:"topbar",markSrc:"customer"===o?"/images/EliteMessage_Icon_Only.png":void 0,markAlt:I,launcherControlsId:u,launcherButtonLabel:G,launcherExpandLabel:H,onLauncherClick:z?a=>{let b=a.currentTarget.closest("[data-elite-shell]");if(!b)return;let c="true"===b.getAttribute("data-nav-collapsed");f(b,!c,u)}:void 0}),(0,b.jsx)("div",{className:"elite-shell-topbar-center",children:k}),(0,b.jsx)("div",{className:"elite-shell-topbar-actions",children:m})]}):null,l?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"elite-shell-mobile-nav",children:(0,b.jsxs)("details",{children:[(0,b.jsxs)("summary",{children:[(0,b.jsx)("span",{children:E}),(0,b.jsx)("span",{"aria-hidden":"true",children:F})]}),(0,b.jsx)("div",{className:"elite-shell-mobile-nav-body",children:l})]})}),(0,b.jsx)("aside",{id:u,className:"elite-shell-aside",children:l})]}):null,(0,b.jsx)("div",{className:"elite-shell-main",children:(0,b.jsxs)("div",{className:"elite-shell-content",style:{maxWidth:v,margin:l?void 0:"0 auto"},children:["hidden"===r?null:(0,b.jsxs)("header",{className:`elite-page-header${"customer"===o?" elite-page-header-customer":""}`,children:[w?null:(0,b.jsxs)("div",{className:"elite-page-header-top",children:[(0,b.jsxs)("span",{className:"elite-page-brand",children:[(0,b.jsx)("span",{className:"elite-page-brand-mark","aria-hidden":"true"}),A]}),(0,b.jsxs)("div",{className:"elite-toolbar",children:[k,m]})]}),"customer"===o?(0,b.jsxs)("div",{className:"elite-page-header-body elite-page-header-body-customer",children:[(0,b.jsxs)("div",{className:"elite-page-header-row",children:[(0,b.jsx)("h1",{className:"elite-page-title",children:a}),(0,b.jsxs)("nav",{className:"elite-page-breadcrumbs","aria-label":B,children:[(0,b.jsx)("a",{href:"/",children:C}),(0,b.jsx)("span",{"aria-hidden":"true",children:"/"}),(0,b.jsx)("span",{children:x})]})]}),y?(0,b.jsx)("p",{className:"elite-page-subtitle",children:c}):null]}):(0,b.jsxs)("div",{className:"elite-page-header-body",children:[(0,b.jsx)("h1",{className:"elite-page-title",children:a}),y?(0,b.jsx)("p",{className:"elite-page-subtitle",children:c}):null]})]}),n?(0,b.jsx)("div",{className:"elite-page-secondary-nav",children:n}):null,(0,b.jsx)("div",{className:"elite-page-stack",children:i}),j?(0,b.jsx)("footer",{className:"elite-page-footer",children:j}):null]})})]})]})},"SurfaceBrand",0,h,"setShellNavCollapsed",0,f],13140);var i=a.i(58660);a.s(["ActionButton",0,function({tone:a="primary",size:c="default",stretch:d=!1,children:e,...f}){return(0,b.jsx)("button",{...f,"data-elite-button":!0,"data-tone":a,"data-size":c,"data-stretch":d?"true":"false",children:e})},"AnchorNav",0,function({items:a}){return(0,b.jsx)("nav",{className:"elite-anchor-nav","aria-label":"Section navigation",children:a.map(a=>(0,b.jsx)("a",{href:a.href,children:a.label},a.href))})},"CheckboxField",0,function({label:a,hint:c,...d}){return(0,b.jsxs)("label",{className:"elite-checkbox-row",children:[(0,b.jsx)("input",{...d,type:"checkbox"}),(0,b.jsxs)("span",{children:[(0,b.jsx)("span",{className:"elite-checkbox-label",children:a}),c?(0,b.jsx)("span",{className:"elite-field-hint",children:c}):null]})]})},"DefinitionGrid",0,function({items:a,minItemWidth:c=170,emphasis:d="soft"}){return(0,b.jsx)("div",{className:"elite-definition-grid",style:{"--elite-grid-min":`${c}px`},children:a.map(a=>(0,b.jsxs)("div",{className:"elite-definition-item","data-tone":a.tone??"neutral","data-emphasis":d,children:[(0,b.jsx)("div",{className:"elite-definition-label",children:a.label}),(0,b.jsx)("div",{className:"elite-definition-value",children:a.value})]},`${a.label}-${String(a.value)}`))})},"EmptyState",0,function({title:a,description:c,action:d}){return(0,b.jsxs)("div",{className:"elite-empty-state",children:[(0,b.jsx)("h3",{children:a}),(0,b.jsx)("p",{children:c}),d?(0,b.jsx)("div",{className:"elite-toolbar",children:d}):null]})},"Field",0,function({label:a,hint:c,tone:d="neutral",children:e}){return(0,b.jsxs)("label",{className:"elite-field","data-tone":d,children:[(0,b.jsx)("span",{className:"elite-field-label",children:a}),e,c?(0,b.jsx)("span",{className:"elite-field-hint",children:c}):null]})},"MetricCard",0,function({label:a,value:c,hint:d,tone:e="neutral",emphasis:f="soft"}){return(0,b.jsxs)("div",{className:"elite-metric-card","data-tone":e,"data-emphasis":f,children:[(0,b.jsx)("div",{className:"elite-metric-label",children:a}),(0,b.jsx)("div",{className:"elite-metric-value",children:c}),d?(0,b.jsx)("div",{className:"elite-metric-hint",children:d}):null]})},"MetricGrid",0,function({children:a,minItemWidth:c=170}){return(0,b.jsx)("div",{className:"elite-metric-grid",style:{"--elite-grid-min":`${c}px`},children:a})},"NoticeBanner",0,function({title:a,tone:c="info",emphasis:d="soft",surface:e,children:f}){return(0,b.jsxs)("div",{className:"elite-notice","data-tone":c,"data-emphasis":d,"data-surface":e,children:[(0,b.jsx)("div",{className:"elite-notice-title",children:a}),(0,b.jsx)("div",{children:f})]})},"SectionGrid",0,function({children:a,minItemWidth:c=280}){return(0,b.jsx)("div",{className:"elite-section-grid",style:{"--elite-grid-min":`${c}px`},children:a})},"SelectInput",0,function(a){return(0,b.jsx)("select",{...a,"data-elite-control":!0})},"StatusBadge",0,function({children:a,tone:c="neutral"}){return(0,b.jsx)("span",{className:"elite-status-badge","data-tone":c,children:a})},"TextAreaInput",0,function(a){return(0,b.jsx)("textarea",{...a,"data-elite-control":!0})},"TextInput",0,function(a){return(0,b.jsx)("input",{...a,"data-elite-control":!0})}],67600),a.s(["InfoCard",0,function({eyebrow:a,title:c,subtitle:d,action:e,children:f,className:g,tone:h="neutral",density:i="comfortable",surface:j,id:k,...l}){return(0,b.jsxs)("section",{...l,id:k,"data-elite-card":!0,"data-tone":h,"data-density":i,"data-surface":j,className:g,style:l.style,children:[(0,b.jsxs)("div",{className:"elite-card-header",children:[(0,b.jsxs)("div",{className:"elite-card-copy",children:[a?(0,b.jsx)("p",{className:"elite-card-eyebrow",children:a}):null,(0,b.jsx)("h2",{className:"elite-card-title",children:c}),d?(0,b.jsx)("p",{className:"elite-card-subtitle",children:d}):null]}),e?(0,b.jsx)("div",{className:"elite-card-action",children:e}):null]}),(0,b.jsx)("div",{className:"elite-card-body",children:f})]})}],52294);var j=a.i(40032),k=a.i(88706);a.s([],30154),a.i(30154),a.i(13140),a.i(67600),a.i(52294);let l="elite-message.theme";function m(a){return"light"===a||"dark"===a||"system"===a?a:"light"}a.s(["getThemePreferenceLabel",0,function(a){switch(a){case"light":return"Light";case"dark":return"Dark";default:return"System"}},"resolveEffectiveTheme",0,function(a,b){return"system"===a?b:a},"resolveThemePreference",0,m,"themePreferenceCookieName",0,l,"themePreferenceStorageKey",0,"elite-message.theme","themePreferenceValues",0,["system","light","dark"]],82449),a.i(82449),a.s([],97096),a.j(i,97096),a.j(j,97096),a.j(k,97096);var n=a.i(97096),o=a.i(1468),p=a.i(84635);async function q({children:a}){let e=await (0,c.cookies)(),f="ar"===e.get("elite-message.customer.locale")?.value?"ar":"en",g=m(e.get(l)?.value),h="dark"===g?"dark":"light";return(0,b.jsx)("html",{lang:"ar"===f?"ar":"en",dir:"ar"===f?"rtl":"ltr","data-elite-customer-locale":f,"data-elite-theme":h,"data-elite-theme-preference":g,children:(0,b.jsx)("body",{children:(0,b.jsx)(n.ThemePreferenceProvider,{initialPreference:g,children:(0,b.jsxs)(p.CustomerLocaleProvider,{initialLocale:f,children:[(0,b.jsx)(d.Suspense,{fallback:null,children:(0,b.jsx)(o.CustomerNavigationProgress,{})}),a]})})})})}a.s(["default",0,q,"metadata",0,{title:"Elite Message Customer",description:"Customer dashboard foundation for Elite Message."}],7060)},77212,a=>{a.n(a.i(7060))}];

//# sourceMappingURL=_05.h4p0._.js.map