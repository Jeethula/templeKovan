if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const o=e=>n(e,c),r={module:{uri:c},exports:t,require:o};s[c]=Promise.all(i.map((e=>r[e]||o(e)))).then((e=>(a(...e),t)))}}define(["./workbox-c2c0676f"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/H4oNeqjh6T91U9HHg1UnM/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/H4oNeqjh6T91U9HHg1UnM/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e762574-b89712cd12ca5414.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/1299-d30a21f30aa732d6.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/1439-b5737fd24b631a80.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/1469-e9a8fdb0065f3d07.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/2403-2ec230bd51f1533d.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/3304-7984dbd402d82584.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/370b0802-1d39843d4e22971e.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/3d47b92a-718a20f736af37a4.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/4525-6165d2dc0d88592b.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/4862-d4fc7d2016a64827.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/4868-71d2c98fd05f5471.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/4953-b9375c577b9110da.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/53c13509-930f338e0b51836a.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/5444-305859072d224f81.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/5736-6df67f691f09276c.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/5790-569bf6a50bdb1cc5.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/5829-399f11d02f1a85a9.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/5852-06ec3c7c3e25d7a1.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/5e22fd23-28dfb9b95d3ec26f.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/6300-869dc042b17a69e1.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/6648-bd097fb9dffdfac6.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/66ec4792-34ec529b055d2a7b.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/7064611b-4506a439cc3ebeed.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/7138-bd3907b7560645d0.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/7257-b8a39a02251183bf.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/7549-7b55de4145083b1b.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/795d4814-79988ed6853b819e.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/8726-3baa15140a58eaad.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/8e1d74a4-31d8c6533051583c.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/94730671-6cc48cee183836a3.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/9695-f4ae99a3bd0469b3.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/9c4e2130-249629e1c0fd3078.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/_not-found/page-a16ca390e9ba93f8.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/add/page-82e457e65cc110f7.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/addSevas/page-b8315ba9af7d7af5.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/blog/%5Bid%5D/page-a4607569064e0ff2.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/blog/page-8753a8b13262739a.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/blog/write/page-0ad2c9242128339c.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/contributions/page-521455f18ba27fdb.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/layout-915152e566fd3672.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/not-found-23dc91802d1b789d.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/page-ea84cd82ba481d88.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/posuser/page-1f2890f2e90a723f.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/posuser/services/%5BuserId%5D/page-3b9e71e2262ef64a.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/profile/page-a10b83d951885ca7.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/reports/page-51217838fa8f8ce3.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/serviceManagement/%5BserviceId%5D/page-01783b3296051a89.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/serviceManagement/page-6e0d28cdc96e4231.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/services/%5Bslug%5D/page-59cab81d253b57f5.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/services/page-a1fe3acdd58dbe2c.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/transactions/page-ac68a58426bd16b6.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/unAuthorized/page-aa9059d75979e179.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/userManagement/%5Bid%5D/page-0ff2f426b5a5dbdc.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/app/userManagement/page-1db309b61fdc601f.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/b2d98e07-b91bd9f801931f35.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/c916193b-6ae22aff6db4bc8f.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/d441faa4-418ff5f17bc4881d.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/f97e080b-4a9c6af1d99b5b99.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/fc2f6fa8-37dd54aa83623506.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/fd9d1056-6a3d703441659125.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/ff804112-6dced8d611b3d990.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/main-790f4436f5451e87.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/main-app-04887e5cdec8234c.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-0741427e34aa4e2f.js",revision:"H4oNeqjh6T91U9HHg1UnM"},{url:"/_next/static/css/71cef4d7f9ad6bf3.css",revision:"71cef4d7f9ad6bf3"},{url:"/_next/static/css/a4b5e897e9c59d91.css",revision:"a4b5e897e9c59d91"},{url:"/_next/static/css/bd02915611f90898.css",revision:"bd02915611f90898"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/images/icons/icon-128x128.png",revision:"4a22231d837a39817f8bf4c6c787f426"},{url:"/images/icons/icon-144x144.png",revision:"2d4912d748d9267b2a4c49b782809e3e"},{url:"/images/icons/icon-152x152.png",revision:"8ec2bd08109b191a2ce557d9c4cb877f"},{url:"/images/icons/icon-192x192.png",revision:"d82edcc8e5dba27dbc8c033fa01df3f4"},{url:"/images/icons/icon-384x384.png",revision:"395ea6680fdad81517f3d7a74506b6ab"},{url:"/images/icons/icon-512x512.png",revision:"cb272308020a80e434097bbef129c6eb"},{url:"/images/icons/icon-72x72.png",revision:"91e8be62ec2617d7f727af463cc81add"},{url:"/images/icons/icon-96x96.png",revision:"15fd9251f77eebe0f8e2b2309253368c"},{url:"/manifest.json",revision:"f11f68a19f13dc3edabd39a5056872ca"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:n})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&n&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:n})=>"1"===e.headers.get("RSC")&&n&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
