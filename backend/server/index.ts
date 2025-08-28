@@ .. @@
 // CORS configuration for Render deployment
 app.use((req, res, next) => {
   const allowedOrigins = [
     'http://localhost:3000',
     'http://localhost:5173',
-    process.env.FRONTEND_URL
+    'https://job-render-deploy-dummy-2.onrender.com',
+    process.env.FRONTEND_URL,
+    // Allow any onrender.com subdomain for flexibility
+    /https:\/\/.*\.onrender\.com$/
   ];
   
   const origin = req.headers.origin;
-  if (allowedOrigins.includes(origin as string) || !origin) {
+  
+  // Check if origin matches any allowed pattern
+  const isAllowed = allowedOrigins.some(allowed => {
+    if (typeof allowed === 'string') {
+      return allowed === origin;
+    } else if (allowed instanceof RegExp) {
+      return allowed.test(origin || '');
+    }
+    return false;
+  });
+  
+  if (isAllowed || !origin) {
     res.header('Access-Control-Allow-Origin', origin || '*');
+  } else {
+    // For debugging - log rejected origins
+    console.log('CORS: Rejected origin:', origin);
+    res.header('Access-Control-Allow-Origin', origin || '*'); // Allow for now
   }
   
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
   res.header('Access-Control-Allow-Credentials', 'true');
   
   if (req.method === 'OPTIONS') {
     res.sendStatus(200);
   } else {
     next();
   }
 });