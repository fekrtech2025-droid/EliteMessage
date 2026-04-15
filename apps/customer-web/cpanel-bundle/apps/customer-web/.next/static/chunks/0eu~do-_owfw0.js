(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,271,e=>{"use strict";var t=e.i(52759),n=e.i(78923),a=e.i(11501);e.i(16233);var r=e.i(37008),s=e.i(77219),i=e.i(30516),o=e.i(87321),l=e.i(36105),c=e.i(93729),d=e.i(51919),p=e.i(64021),u=e.i(12241),h=e.i(2202),g=e.i(83267);let y=[{value:"curl",label:"cURL"},{value:"node",label:"Node.js"},{value:"python",label:"Python"},{value:"php",label:"PHP"},{value:"go",label:"Go"},{value:"java",label:"Java"},{value:"csharp",label:"C#"}],m="963944556677",b="docs-chat-001",f="https://example.com/media/welcome.png",x="your-account-api-token";function v(e,t){return`${g.apiBaseUrl}/instance/${e}${t}`}async function j(e){if("u"<typeof navigator||!navigator.clipboard?.writeText)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function w(e){return`'${e.replaceAll("'","\\'")}'`}function S(e){return`${g.apiBaseUrl}/api/v1/public/account${e}`}function T({label:e,endpoint:n}){let{locale:s}=(0,o.useCustomerLocale)(),[i,l]=(0,a.useState)("idle");async function c(){l(await j(n)?"copied":"failed")}return(0,t.jsxs)("div",{className:"elite-list-item",children:[(0,t.jsxs)("div",{className:"elite-list-title",style:{alignItems:"flex-start"},children:[(0,t.jsx)("span",{children:e}),(0,t.jsx)(r.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>void c(),children:"ar"===s?"نسخ الرابط":"Copy endpoint"})]}),(0,t.jsx)("code",{style:{overflowWrap:"anywhere"},children:n}),"copied"===i?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-success-ink)"},children:"ar"===s?"تم نسخ الرابط.":"Endpoint copied."}):null,"failed"===i?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-danger-ink)"},children:"ar"===s?"تعذر النسخ تلقائيًا.":"Could not copy automatically."}):null]})}function $({eyebrow:e,title:n,snippet:s,description:l}){let{locale:c}=(0,o.useCustomerLocale)(),[d,p]=(0,a.useState)("idle");return(0,t.jsx)(i.InfoCard,{eyebrow:e,title:n,action:(0,t.jsx)(r.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>{j(s).then(e=>p(e?"copied":"failed"))},children:"ar"===c?"نسخ المقتطف":"Copy snippet"}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:12},children:[l?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:l}):null,"copied"===d?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-success-ink)"},children:"ar"===c?"تم النسخ.":"Copied."}):null,"failed"===d?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-danger-ink)"},children:"ar"===c?"تعذر النسخ تلقائيًا.":"Could not copy automatically."}):null,(0,t.jsx)("pre",{className:"elite-mono-panel",children:s})]})})}function A({eyebrow:e,title:n,endpoint:s,snippet:l}){let{locale:c}=(0,o.useCustomerLocale)(),[d,p]=(0,a.useState)("idle");async function u(){if("u"<typeof navigator||!navigator.clipboard?.writeText)return void p("failed");try{await navigator.clipboard.writeText(l),p("copied")}catch{p("failed")}}return(0,t.jsx)(i.InfoCard,{eyebrow:e,title:n,action:(0,t.jsxs)("div",{className:"elite-toolbar",children:[(0,t.jsx)(r.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>{j(s).then(e=>p(e?"copied":"failed"))},children:"ar"===c?"نسخ الرابط":"Copy endpoint"}),(0,t.jsx)(r.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>void u(),children:"ar"===c?"نسخ المقتطف":"Copy snippet"})]}),children:(0,t.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:(0,t.jsx)("code",{children:s})}),"copied"===d?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-success-ink)"},children:"ar"===c?"تم النسخ.":"Copied."}):null,"failed"===d?(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-danger-ink)"},children:"ar"===c?"تعذر النسخ تلقائيًا.":"Could not copy automatically."}):null,(0,t.jsx)("pre",{className:"elite-mono-panel",children:l})]})})}e.s(["CustomerApiDocumentsPage",0,function(){var e;let{locale:j}=(0,o.useCustomerLocale)(),I=(0,a.useRef)(!0),[R,H]=(0,a.useState)("loading"),[,C]=(0,a.useState)(null),[k,_]=(0,a.useState)(null),[B,P]=(0,a.useState)([]),[q,E]=(0,a.useState)(""),[U,D]=(0,a.useState)(""),[L,z]=(0,a.useState)("python"),[N,F]=(0,a.useState)(null),O="ar"===j?{apiDocuments:"مستندات API",backToDashboard:"العودة إلى لوحة التحكم",createInstanceFirst:"أنشئ مثيلًا قبل استخدام API",createInstanceFirstBody:"تستخدم الأمثلة أدناه قيمًا افتراضية حتى تحتوي مساحة العمل النشطة على مثيل.",dashboardLogin:"العودة إلى تسجيل الدخول في لوحة التحكم",developerApi:"واجهة API للمطور",docsIssue:"مشكلة في مستندات API",examples:"الأمثلة",fullTokenUnavailable:"الرمز الكامل غير متاح في جلسة المتصفح هذه",instance:"المثيل",loadingApiReference:"جارٍ تحميل مرجع API",loadingMessage:"يتم تحديث جلسة العميل وتحميل مثيلات مساحة العمل للأمثلة المباشرة.",noWorkspaceInstances:"لا توجد مثيلات في مساحة العمل",openInstanceDetail:"افتح تفاصيل المثيل",quickStart:"بداية سريعة",quickStartTitle:"من إنشاء المثيل إلى استدعاءات API",referenceValues:"القيم المرجعية للمقتطفات أدناه",sessionMissing:"جلسة العميل مفقودة أو منتهية الصلاحية.",signInRequired:"يجب تسجيل الدخول",subtitle:"استخدم واجهة API العامة الخاصة بكل مثيل بعد إنشاء المثيل وربط واتساب. تُنشأ الأمثلة أدناه من مثيل مساحة العمل المحددة عندما يكون هناك رمز كامل محفوظ في جلسة المتصفح هذه.",tokenWarning:"يعيد Elite Message الرمز الكامل للمثيل فقط عند الإنشاء أو التدوير. افتح صفحة تفاصيل المثيل ودوّر الرمز إذا احتجت إلى قيمة كاملة جديدة لهذه الأمثلة.",workspace:"مساحة العمل"}:{apiDocuments:"API Documents",backToDashboard:"Back to dashboard",createInstanceFirst:"Create an instance before using the API",createInstanceFirstBody:"The examples below use placeholders until the active workspace has an instance.",dashboardLogin:"Return to the dashboard login",developerApi:"Developer API",docsIssue:"API documents issue",examples:"Examples",fullTokenUnavailable:"Full token not available in this browser session",instance:"Instance",loadingApiReference:"Loading API reference",loadingMessage:"Refreshing the customer session and loading workspace instances for the live examples.",noWorkspaceInstances:"No workspace instances",openInstanceDetail:"Open instance detail",quickStart:"Quick start",quickStartTitle:"From instance creation to API calls",referenceValues:"Reference values for the snippets below",sessionMissing:"The customer session is missing or expired.",signInRequired:"Sign in required",subtitle:"Use the public per-instance API after instance creation and WhatsApp linking. The examples below are generated from the selected workspace instance when a saved full token is available in this browser session.",tokenWarning:"Elite Message only returns the full instance token on creation or rotation. Open the instance detail page and rotate the token if you need a fresh full value for these examples.",workspace:"Workspace"};function M(e){if(I.current){if("ready"===R&&k)return void F(e);H("unauthenticated"),F(e)}}let W=(0,a.useEffectEvent)(async e=>{let[t,n]=await Promise.all([(0,u.loadCustomerAccount)(e),(0,u.requestWithCustomerRefresh)(e,e=>fetch(`${g.apiBaseUrl}/api/v1/customer/instances`,{headers:{authorization:`Bearer ${e}`},credentials:"include"}),C)]);if(!t||!n)return M("ar"===j?"تعذر الوصول إلى API الخاص بالعميل.":"Could not reach the customer API."),!1;if(!n.ok)return M("ar"===j?"تعذر تحميل مستندات API الخاصة بالعميل.":"Could not load customer API documents."),!1;let a=await n.json();if(!I.current)return!1;let r=t.workspaces[0]?.id??"";return C(e),_(t),P(a.items),E(e=>e&&t.workspaces.some(t=>t.id===e)?e:r),H("ready"),!0});(0,a.useEffect)(()=>(I.current=!0,(async()=>{F(null);let e=(0,g.readStoredToken)();if(e&&await W(e))return;let t=await (0,u.refreshCustomerAccessToken)(C);if(!t){I.current&&H("unauthenticated");return}await W(t)})(),()=>{I.current=!1}),[]),(0,a.useEffect)(()=>{!k?.workspaces.length||k.workspaces.some(e=>e.id===q)||E(k.workspaces[0].id)},[k,q]);let G=(0,a.useMemo)(()=>B.filter(e=>!q||e.workspaceId===q),[B,q]);async function V(){await (0,u.logoutCustomerSession)(),I.current&&(H("unauthenticated"),C(null),_(null),P([]),F(null))}(0,a.useEffect)(()=>{G.length?G.some(e=>e.id===U)||D((G.find(e=>(0,p.readInstanceCredentials)(e.id)?.token)??G[0]).id):D("")},[U,G]);let J=G.find(e=>e.id===U)??G[0]??null,X=J?(0,p.readInstanceCredentials)(J.id):null,K=k?.workspaces.find(e=>e.id===q)??k?.workspaces[0]??null,Z=K?.id??q??"workspace-id",Q=X?.publicId??J?.publicId??"your-instance-public-id",Y=X?.token??"your-instance-token",ee=!!X?.token,et=y.find(e=>e.value===L)?.label??"Python",en=function(e,t,n){let a=v(t,"/messages/chat");switch(e){case"curl":return`curl -X POST "${a}" \\
  -H "Authorization: Bearer ${n}" \\
  -H "content-type: application/json" \\
  -d '{"to":"${m}","body":"Hello from Elite Message","referenceId":"${b}","priority":1}'`;case"node":return["const response = await fetch('"+a+"', {","  method: 'POST',\n  headers: {","    'Authorization': 'Bearer "+n+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({",`    to: '${m}',`,"    body: 'Hello from Elite Message',",`    referenceId: '${b}',`,"    priority: 1\n  })\n});\nconst data = await response.json();\nconsole.log(data);"].join("\n");case"python":return`import requests

response = requests.post(
    '${a}',
    headers={
        'Authorization': 'Bearer ${n}',
        'Content-Type': 'application/json',
    },
    json={
        'to': '${m}',
        'body': 'Hello from Elite Message',
        'referenceId': '${b}',
        'priority': 1,
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'to' => ${w(m)},
    'body' => 'Hello from Elite Message',
    'referenceId' => ${w(b)},
    'priority' => 1,
]);

$ch = curl_init(${w(a)});
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${n}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return['payload := strings.NewReader(`{"to":"'+m+'","body":"Hello from Elite Message","referenceId":"'+b+'","priority":1}`)',`req, _ := http.NewRequest(http.MethodPost, "${a}", payload)`,`req.Header.Set("Authorization", "Bearer ${n}")`,'req.Header.Set("Content-Type", "application/json")\n\nresp, err := http.DefaultClient.Do(req)\nif err != nil {\n    log.Fatal(err)\n}\ndefer resp.Body.Close()\n\nbody, _ := io.ReadAll(resp.Body)\nfmt.Println(string(body))'].join("\n");case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${a}"))`,'    .header("Authorization", "Bearer '+n+'")','    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString("""\n{',`  "to": "${m}",`,'  "body": "Hello from Elite Message",',`  "referenceId": "${b}",`,'  "priority": 1\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${n}");

var payload = JsonSerializer.Serialize(new {
    to = "${m}",
    body = "Hello from Elite Message",
    referenceId = "${b}",
    priority = 1
});

var response = await client.PostAsync("${a}", new StringContent(payload, Encoding.UTF8, "application/json"));
var body = await response.Content.ReadAsStringAsync();
Console.WriteLine(body);`}}(L,Q,Y),ea=function(e,t,n){let a=v(t,"/messages/image");switch(e){case"curl":return`curl -X POST "${a}" \\
  -H "Authorization: Bearer ${n}" \\
  -H "content-type: application/json" \\
  -d '{"to":"${m}","image":"${f}","caption":"Launch asset","referenceId":"docs-image-001","priority":2}'`;case"node":return["const response = await fetch('"+a+"', {","  method: 'POST',\n  headers: {","    'Authorization': 'Bearer "+n+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({",`    to: '${m}',`,`    image: '${f}',`,"    caption: 'Launch asset',\n    referenceId: 'docs-image-001',\n    priority: 2\n  })\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.post(
    '${a}',
    headers={
        'Authorization': 'Bearer ${n}',
        'Content-Type': 'application/json',
    },
    json={
        'to': '${m}',
        'image': '${f}',
        'caption': 'Launch asset',
        'referenceId': 'docs-image-001',
        'priority': 2,
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'to' => ${w(m)},
    'image' => ${w(f)},
    'caption' => 'Launch asset',
    'referenceId' => 'docs-image-001',
    'priority' => 2,
]);

$ch = curl_init(${w(a)});
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${n}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return['payload := strings.NewReader(`{"to":"'+m+'","image":"'+f+'","caption":"Launch asset","referenceId":"docs-image-001","priority":2}`)',`req, _ := http.NewRequest(http.MethodPost, "${a}", payload)`,`req.Header.Set("Authorization", "Bearer ${n}")`,'req.Header.Set("Content-Type", "application/json")\nresp, err := http.DefaultClient.Do(req)\nif err != nil {\n    log.Fatal(err)\n}\ndefer resp.Body.Close()\nbody, _ := io.ReadAll(resp.Body)\nfmt.Println(string(body))'].join("\n");case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${a}"))`,'    .header("Authorization", "Bearer '+n+'")','    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString("""\n{',`  "to": "${m}",`,`  "image": "${f}",`,'  "caption": "Launch asset",\n  "referenceId": "docs-image-001",\n  "priority": 2\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${n}");

var payload = JsonSerializer.Serialize(new {
    to = "${m}",
    image = "${f}",
    caption = "Launch asset",
    referenceId = "docs-image-001",
    priority = 2
});

var response = await client.PostAsync("${a}", new StringContent(payload, Encoding.UTF8, "application/json"));
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(L,Q,Y),er=function(e,t,n){let a=v(t,"/instance/status");switch(e){case"curl":return`curl "${a}" \\
  -H "Authorization: Bearer ${n}"`;case"node":return["const response = await fetch('"+a+"', {","  headers: {","    'Authorization': 'Bearer "+n+"'","  }\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.get(
    '${a}',
    headers={'Authorization': 'Bearer ${n}'},
)
print(response.json())`;case"php":return`$ch = curl_init(${w(a)});
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${n}',
    ],
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`req, _ := http.NewRequest(http.MethodGet, "${a}", nil)
req.Header.Set("Authorization", "Bearer ${n}")
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${a}"))`,'    .header("Authorization", "Bearer '+n+'")',"    .GET()\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());"].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${n}");
var response = await client.GetAsync("${a}");
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(L,Q,Y),es=function(e,t,n){let a=`${v(t,"/messages")}?limit=20&status=sent&referenceId=${b}`;switch(e){case"curl":return`curl "${a}" \\
  -H "Authorization: Bearer ${n}"`;case"node":return["const response = await fetch('"+a+"', {","  headers: {","    'Authorization': 'Bearer "+n+"'","  }\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.get(
    '${a}',
    headers={'Authorization': 'Bearer ${n}'},
)
print(response.json())`;case"php":return`$ch = curl_init(${w(a)});
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${n}',
    ],
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`req, _ := http.NewRequest(http.MethodGet, "${a}", nil)
req.Header.Set("Authorization", "Bearer ${n}")
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${a}"))`,'    .header("Authorization", "Bearer '+n+'")',"    .GET()\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());"].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${n}");
var response = await client.GetAsync("${a}");
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(L,Q,Y),ei=function(e,t){let n=`${S("/instances")}?limit=20&status=active`;switch(e){case"curl":return`curl "${n}" \\
  -H "Authorization: Bearer ${t}"`;case"node":return["const response = await fetch('"+n+"', {","  headers: {","    'Authorization': 'Bearer "+t+"'","  }\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.get(
    '${n}',
    headers={'Authorization': 'Bearer ${t}'},
)
print(response.json())`;case"php":return`$ch = curl_init(${w(n)});
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${t}',
    ],
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`req, _ := http.NewRequest(http.MethodGet, "${n}", nil)
req.Header.Set("Authorization", "Bearer ${t}")
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${n}"))`,'    .header("Authorization", "Bearer '+t+'")',"    .GET()\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());"].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${t}");
var response = await client.GetAsync("${n}");
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(L,x),eo=function(e,t){let n=S("/instances");switch(e){case"curl":return`curl -X POST "${n}" \\
  -H "Authorization: Bearer ${t}" \\
  -H "content-type: application/json" \\
  -d '{"name":"Integration instance"}'`;case"node":return["const response = await fetch('"+n+"', {","  method: 'POST',\n  headers: {","    'Authorization': 'Bearer "+t+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Integration instance'\n  })\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.post(
    '${n}',
    headers={
        'Authorization': 'Bearer ${t}',
        'Content-Type': 'application/json',
    },
    json={
        'name': 'Integration instance',
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'name' => 'Integration instance',
]);

$ch = curl_init(${w(n)});
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${t}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`payload := strings.NewReader(\`{"name":"Integration instance"}\`)
req, _ := http.NewRequest(http.MethodPost, "${n}", payload)
req.Header.Set("Authorization", "Bearer ${t}")
req.Header.Set("Content-Type", "application/json")

resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${n}"))`,'    .header("Authorization", "Bearer '+t+'")','    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString("""\n{\n  "name": "Integration instance"\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${t}");

var payload = JsonSerializer.Serialize(new {
    name = "Integration instance"
});

var response = await client.PostAsync("${n}", new StringContent(payload, Encoding.UTF8, "application/json"));
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(L,x),el=function(e,t){let n=`${S("/instances")}/your-instance-id`;switch(e){case"curl":return`curl -X PATCH "${n}" \\
  -H "Authorization: Bearer ${t}" \\
  -H "content-type: application/json" \\
  -d '{"name":"Renamed integration instance"}'`;case"node":return["const response = await fetch('"+n+"', {","  method: 'PATCH',\n  headers: {","    'Authorization': 'Bearer "+t+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Renamed integration instance'\n  })\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.patch(
    '${n}',
    headers={
        'Authorization': 'Bearer ${t}',
        'Content-Type': 'application/json',
    },
    json={
        'name': 'Renamed integration instance',
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'name' => 'Renamed integration instance',
]);

$ch = curl_init(${w(n)});
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "PATCH",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${t}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`payload := strings.NewReader(\`{"name":"Renamed integration instance"}\`)
req, _ := http.NewRequest(http.MethodPatch, "${n}", payload)
req.Header.Set("Authorization", "Bearer ${t}")
req.Header.Set("Content-Type", "application/json")

resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${n}"))`,'    .header("Authorization", "Bearer '+t+'")','    .header("Content-Type", "application/json")\n    .method("PATCH", HttpRequest.BodyPublishers.ofString("""\n{\n  "name": "Renamed integration instance"\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${t}");

var payload = JsonSerializer.Serialize(new {
    name = "Renamed integration instance"
});

var request = new HttpRequestMessage(HttpMethod.Patch, "${n}") { Content = new StringContent(payload, Encoding.UTF8, "application/json") };
Console.WriteLine(await (await client.SendAsync(request)).Content.ReadAsStringAsync());`}}(L,x),ec=JSON.stringify({event_type:"message_create",instanceId:e=J?.id??"your-instance-id",publicId:Q,timestamp:"2026-04-11T12:00:00.000Z",data:{id:"11111111-1111-4111-8111-111111111111",publicMessageId:"msg_1234567890abcdef",instanceId:e,instancePublicId:Q,messageType:"chat",recipient:m,body:"Hello from Elite Message",referenceId:b,priority:1,status:"sent",ack:"device",scheduledFor:"2026-04-11T12:00:00.000Z",createdAt:"2026-04-11T12:00:00.000Z",updatedAt:"2026-04-11T12:00:00.000Z"}},null,2),ed=function(e){switch(e){case"curl":return"# Webhooks are delivered to your own HTTPS endpoint, not to Elite Message.\n# Example target: https://your-app.example.com/webhooks/elite-message\n# Send a 200 response after you validate and persist the payload.\n#\nSee the signature verification example below.";case"node":return"import express from 'express';\n\nconst app = express();\napp.use(express.json({ type: 'application/json' }));\n\napp.post('/webhooks/elite-message', async (req, res) => {\n  const deliveryId = req.header('x-elite-message-delivery-id');\n  const eventType = req.header('x-elite-message-event');\n  const instancePublicId = req.header('x-elite-message-instance-public-id');\n  const timestamp = req.header('x-elite-message-timestamp');\n  const signature = req.header('x-elite-message-signature');\n  const payload = req.body;\n\n  console.log({ deliveryId, eventType, instancePublicId, timestamp, signature, payload });\n\n  res.sendStatus(200);\n});";case"python":return"from flask import Flask, request\n\napp = Flask(__name__)\n\n@app.post('/webhooks/elite-message')\ndef webhook():\n    delivery_id = request.headers.get('x-elite-message-delivery-id')\n    event_type = request.headers.get('x-elite-message-event')\n    instance_public_id = request.headers.get('x-elite-message-instance-public-id')\n    timestamp = request.headers.get('x-elite-message-timestamp')\n    signature = request.headers.get('x-elite-message-signature')\n    payload = request.get_json(silent=True) or {}\n\n    print({\n        'delivery_id': delivery_id,\n        'event_type': event_type,\n        'instance_public_id': instance_public_id,\n        'timestamp': timestamp,\n        'signature': signature,\n        'payload': payload,\n    })\n\n    return {'ok': True}";case"php":return"$deliveryId = $_SERVER['HTTP_X_ELITE_MESSAGE_DELIVERY_ID'] ?? null;\n$eventType = $_SERVER['HTTP_X_ELITE_MESSAGE_EVENT'] ?? null;\n$instancePublicId = $_SERVER['HTTP_X_ELITE_MESSAGE_INSTANCE_PUBLIC_ID'] ?? null;\n$timestamp = $_SERVER['HTTP_X_ELITE_MESSAGE_TIMESTAMP'] ?? null;\n$signature = $_SERVER['HTTP_X_ELITE_MESSAGE_SIGNATURE'] ?? null;\n$payload = json_decode(file_get_contents('php://input'), true) ?: [];\n\nerror_log(json_encode(compact('deliveryId', 'eventType', 'instancePublicId', 'timestamp', 'signature', 'payload')));\nhttp_response_code(200);";case"go":return'http.HandleFunc("/webhooks/elite-message", func(w http.ResponseWriter, r *http.Request) {\n    body, _ := io.ReadAll(r.Body)\n    defer r.Body.Close()\n\n    payload := map[string]any{\n        "deliveryId": r.Header.Get("x-elite-message-delivery-id"),\n        "eventType": r.Header.Get("x-elite-message-event"),\n        "instancePublicId": r.Header.Get("x-elite-message-instance-public-id"),\n        "timestamp": r.Header.Get("x-elite-message-timestamp"),\n        "signature": r.Header.Get("x-elite-message-signature"),\n        "payload": string(body),\n    }\n    fmt.Println(payload)\n\n    w.WriteHeader(http.StatusOK)\n})';case"java":return'HttpServer.create(new InetSocketAddress(8080), 0)\n    .createContext("/webhooks/elite-message", exchange -> {\n        String deliveryId = exchange.getRequestHeaders().getFirst("x-elite-message-delivery-id");\n        String eventType = exchange.getRequestHeaders().getFirst("x-elite-message-event");\n        String instancePublicId = exchange.getRequestHeaders().getFirst("x-elite-message-instance-public-id");\n        String timestamp = exchange.getRequestHeaders().getFirst("x-elite-message-timestamp");\n        String signature = exchange.getRequestHeaders().getFirst("x-elite-message-signature");\n        String payload = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);\n        System.out.println(payload);\n        exchange.sendResponseHeaders(200, 0);\n        exchange.close();\n    })\n    .start();';case"csharp":return'app.MapPost("/webhooks/elite-message", async (HttpRequest request) =>\n{\n    var deliveryId = request.Headers["x-elite-message-delivery-id"].ToString();\n    var eventType = request.Headers["x-elite-message-event"].ToString();\n    var instancePublicId = request.Headers["x-elite-message-instance-public-id"].ToString();\n    var timestamp = request.Headers["x-elite-message-timestamp"].ToString();\n    var signature = request.Headers["x-elite-message-signature"].ToString();\n\n    using var reader = new StreamReader(request.Body);\n    var payload = await reader.ReadToEndAsync();\n\n    Console.WriteLine(payload);\n    return Results.Ok(new { deliveryId, eventType, instancePublicId, timestamp, signature });\n});'}}(L),ep=function(e){let t="WEBHOOK_SECRET";switch(e){case"curl":return`# cURL only receives webhooks; verification happens in your app server.
# Compare the x-elite-message-signature header against:
# v1=HMAC_SHA256("${t}", "timestamp.raw_body")`;case"node":return`import { createHmac, timingSafeEqual } from 'node:crypto';

function verifyWebhook(rawBody, timestamp, signatureHeader) {
  const expected = 'v1=' + createHmac('sha256', process.env.${t} ?? '')
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signatureHeader ?? '');
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}`;case"python":return"import hmac\nimport hashlib\n\ndef verify_webhook(raw_body: str, timestamp: str, signature_header: str, webhook_secret: str) -> bool:\n    expected = 'v1=' + hmac.new(\n        webhook_secret.encode('utf-8'),\n        f'{timestamp}.{raw_body}'.encode('utf-8'),\n        hashlib.sha256,\n    ).hexdigest()\n    return hmac.compare_digest(expected, signature_header or '')";case"php":return"function verifyWebhook(string $rawBody, string $timestamp, ?string $signatureHeader, string $webhookSecret): bool {\n    $expected = 'v1=' . hash_hmac('sha256', $timestamp . '.' . $rawBody, $webhookSecret);\n    return hash_equals($expected, $signatureHeader ?? '');\n}";case"go":return'func verifyWebhook(rawBody []byte, timestamp string, signatureHeader string, webhookSecret string) bool {\n    mac := hmac.New(sha256.New, []byte(webhookSecret))\n    mac.Write([]byte(timestamp + "." + string(rawBody)))\n    expected := "v1=" + hex.EncodeToString(mac.Sum(nil))\n    return hmac.Equal([]byte(expected), []byte(signatureHeader))\n}';case"java":return'boolean verifyWebhook(String rawBody, String timestamp, String signatureHeader, String webhookSecret) throws Exception {\n    Mac mac = Mac.getInstance("HmacSHA256");\n    mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));\n    String message = timestamp + "." + rawBody;\n    byte[] expectedBytes = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));\n    String expected = "v1=" + HexFormat.of().formatHex(expectedBytes);\n    return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), (signatureHeader == null ? "" : signatureHeader).getBytes(StandardCharsets.UTF_8));\n}';case"csharp":return'bool VerifyWebhook(string rawBody, string timestamp, string? signatureHeader, string webhookSecret)\n{\n    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(webhookSecret));\n    var messageBytes = Encoding.UTF8.GetBytes($"{timestamp}.{rawBody}");\n    var expected = "v1=" + Convert.ToHexString(hmac.ComputeHash(messageBytes)).ToLowerInvariant();\n    var received = Encoding.UTF8.GetBytes(signatureHeader ?? string.Empty);\n    return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), received);\n}'}}(L),eu=`${g.apiBaseUrl}/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(Z)}`,eh=`${g.apiBaseUrl}/api/v1/account/api-tokens`,eg=`${g.apiBaseUrl}/api/v1/account/api-tokens/{tokenId}/rotate`;return(0,t.jsxs)(s.AppShell,{title:O.apiDocuments,subtitle:O.subtitle,breadcrumbLabel:O.apiDocuments,surface:"customer",density:"compact",labels:(0,h.getCustomerShellLabels)(j),nav:"ready"===R?(0,t.jsx)(l.CustomerNav,{current:"api-docs",account:k,workspaceId:q}):void 0,meta:k?(0,t.jsx)(c.CustomerTopbarAnnouncement,{eyebrow:O.developerApi,message:"ar"===j?"أرسل الرسائل من خدمتك الخلفية باستخدام معرّف المثيل العام والرمز.":"Send messages from your backend with the instance public ID and token.",linkLabel:J?O.openInstanceDetail:O.backToDashboard,linkHref:J?`/instances/${J.id}`:"/"}):void 0,headerActions:"ready"===R&&k?(0,t.jsx)(c.CustomerWorkspaceControls,{account:k,workspaceId:q,onWorkspaceChange:E,onLogout:V}):void 0,footer:(0,t.jsx)(n.default,{href:"/dashboard",children:O.backToDashboard}),children:["loading"===R?(0,t.jsx)(i.InfoCard,{eyebrow:"ar"===j?"المستندات":"Docs",title:O.loadingApiReference,children:(0,t.jsx)("p",{style:{margin:0},children:O.loadingMessage})}):null,"unauthenticated"===R?(0,t.jsxs)(i.InfoCard,{eyebrow:"ar"===j?"الجلسة":"Session",title:O.signInRequired,children:[(0,t.jsx)("p",{style:{marginTop:0},children:O.sessionMissing}),(0,t.jsx)("p",{style:{marginBottom:0},children:(0,t.jsx)(n.default,{href:"/signin",children:O.dashboardLogin})})]}):null,"ready"===R&&k?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.InfoCard,{eyebrow:O.quickStart,title:O.quickStartTitle,children:(0,t.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,t.jsx)(r.DefinitionGrid,{minItemWidth:180,items:[{label:"ar"===j?"الرابط الأساسي":"Base URL",value:g.apiBaseUrl,tone:"info"},{label:O.workspace,value:K?.name??("ar"===j?"لم يتم اختيار مساحة عمل":"No workspace selected")},{label:"ar"===j?"معرّف مثيل API":"API instance ID",value:Q,tone:ee?"success":"neutral"},{label:"ar"===j?"طريقة إرسال الرمز":"Token transport",value:"Authorization: Bearer or ?token=",tone:"neutral"}]}),(0,t.jsxs)("ol",{style:{margin:0,paddingInlineStart:18,display:"grid",gap:8},children:[(0,t.jsx)("li",{children:"ar"===j?"أنشئ مثيلًا من لوحة تحكم العميل.":"Create an instance from the customer dashboard."}),(0,t.jsx)("li",{children:"ar"===j?"افتح صفحة تشغيل المثيل واربط حساب واتساب حتى تصبح الحالة موثّقة.":"Open the instance runtime page and link the WhatsApp account until the status becomes authenticated."}),(0,t.jsx)("li",{children:"ar"===j?"انسخ معرّف مثيل API والرمز من بطاقة وصول API أو دوّر الرمز لإظهار قيمة كاملة جديدة.":"Copy the API instance ID and token from the API access card or rotate the token to reveal a fresh full value."}),(0,t.jsx)("li",{children:"ar"===j?(0,t.jsxs)(t.Fragment,{children:["استدعِ المسارات العامة الخاصة بكل مثيل عند"," ",(0,t.jsxs)("code",{children:["/instance/","{instanceId}"]})," من خدمتك الخلفية."]}):(0,t.jsxs)(t.Fragment,{children:["Call the public per-instance routes at"," ",(0,t.jsxs)("code",{children:["/instance/","{instanceId}"]})," from your backend service."]})})]})]})}),(0,t.jsx)(i.InfoCard,{eyebrow:O.examples,title:O.referenceValues,children:(0,t.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,t.jsxs)("div",{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"},children:[(0,t.jsx)(r.Field,{label:O.workspace,children:(0,t.jsx)(r.SelectInput,{value:q,onChange:e=>E(e.target.value),children:k.workspaces.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.name," (",(0,h.translateCustomerEnum)(j,e.role),")"]},e.id))})}),(0,t.jsx)(r.Field,{label:O.instance,children:(0,t.jsxs)(r.SelectInput,{value:J?.id??"",onChange:e=>D(e.target.value),disabled:0===G.length,children:[0===G.length?(0,t.jsx)("option",{value:"",children:O.noWorkspaceInstances}):null,G.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.name," (",e.publicId,")"]},e.id))]})})]}),(0,t.jsx)("div",{className:"elite-toolbar",children:y.map(e=>(0,t.jsx)(r.ActionButton,{type:"button",tone:e.value===L?"primary":"secondary",size:"compact",onClick:()=>z(e.value),children:e.label},e.value))}),J?null:(0,t.jsx)(r.NoticeBanner,{title:O.createInstanceFirst,tone:"warning",children:(0,t.jsx)("p",{style:{margin:0},children:O.createInstanceFirstBody})}),J&&!ee?(0,t.jsxs)(r.NoticeBanner,{title:O.fullTokenUnavailable,tone:"warning",children:[(0,t.jsx)("p",{style:{marginTop:0},children:O.tokenWarning}),(0,t.jsx)("p",{style:{marginBottom:0},children:"ar"===j?"تستخدم المقتطفات الحالية قيمًا افتراضية للرمز لكنها تحتفظ بمعرّف مثيل API العام الحقيقي.":"The current snippets use placeholders for the token but keep the real public API instance ID."})]}):null,J&&"authenticated"!==J.status?(0,t.jsx)(r.NoticeBanner,{title:"ar"===j?"لا يزال المثيل يحتاج إلى مصادقة واتساب":"Instance still needs WhatsApp authentication",tone:"warning",children:(0,t.jsx)("p",{style:{margin:0},children:"ar"===j?"مسارات التشغيل والحالة متاحة، لكن استدعاءات إرسال الرسائل يجب أن تنتظر حتى يتم ربط المثيل ومصادقته.":"Runtime and status routes are available, but send-message calls should wait until the instance is linked and authenticated."})}):null,(0,t.jsx)($,{eyebrow:"ar"===j?"معاينة مباشرة":"Live preview",title:"ar"===j?`مثال ${et} المحدد`:`Selected ${et} example`,description:"ar"===j?"يتم تحديث هذه المعاينة عند تغيير مساحة العمل أو المثيل أو لغة الخلفية.":"This preview updates as you change the workspace, instance, or backend language.",snippet:en})]})}),J?(0,t.jsx)(d.InstanceApiAccessCard,{eyebrow:"ar"===j?"المثيل المحدد":"Selected instance",title:"ar"===j?"وصول API المباشر للمثيل":"Live instance API access",instanceId:J.id,publicId:Q,instanceName:J.name,token:X?.token??null,connected:"authenticated"===J.status,lastAuthenticatedAt:J.latestEventAt,lastStatusLabel:"ar"===j?"آخر حدث":"Latest event",detailHref:`/instances/${J.id}`}):null,(0,t.jsx)(i.InfoCard,{eyebrow:"ar"===j?"المصادقة":"Authentication",title:"ar"===j?"كيفية مصادقة خدمتك الخلفية":"How to authenticate your backend",children:(0,t.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,t.jsx)("p",{style:{margin:0},children:"ar"===j?(0,t.jsxs)(t.Fragment,{children:["استخدم ",(0,t.jsx)("strong",{children:"معرّف المثيل العام"})," في مسار الطلب و",(0,t.jsx)("strong",{children:"رمز المثيل"})," إما كرمز bearer أو كمعامل توافق في الاستعلام."]}):(0,t.jsxs)(t.Fragment,{children:["Use the ",(0,t.jsx)("strong",{children:"instance public ID"})," in the route path and the ",(0,t.jsx)("strong",{children:"instance token"})," as either a bearer token or a compatibility query string."]})}),(0,t.jsx)(r.DefinitionGrid,{minItemWidth:220,items:[{label:"ar"===j?"المصادقة المفضلة":"Preferred auth",value:"Authorization: Bearer {instance_token}",tone:"success"},{label:"ar"===j?"مصادقة التوافق":"Compatibility auth",value:"?token={instance_token}",tone:"info"},{label:"ar"===j?"نمط المسار":"Route pattern",value:`/instance/${Q}`,tone:"neutral"},{label:"ar"===j?"اللغة المحددة":"Selected language",value:et,tone:"neutral"}]}),(0,t.jsx)("pre",{className:"elite-mono-panel",children:`GET ${v(Q,"/instance/status")}?token=${Y}`})]})}),(0,t.jsx)(A,{eyebrow:"Send chat",title:"POST /instance/{instanceId}/messages/chat",endpoint:v(Q,"/messages/chat"),snippet:en}),(0,t.jsx)(A,{eyebrow:"Send image",title:"POST /instance/{instanceId}/messages/image",endpoint:v(Q,"/messages/image"),snippet:ea}),(0,t.jsx)(A,{eyebrow:"Status",title:"GET /instance/{instanceId}/instance/status",endpoint:v(Q,"/instance/status"),snippet:er}),(0,t.jsx)(A,{eyebrow:"Logs",title:"GET /instance/{instanceId}/messages",endpoint:`${v(Q,"/messages")}?limit=20&status=sent&referenceId=${b}`,snippet:es}),(0,t.jsx)(i.InfoCard,{eyebrow:"ar"===j?"ملاحظات":"Notes",title:"ar"===j?"قواعد تكامل عملية":"Practical integration rules",children:(0,t.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,t.jsxs)("div",{className:"elite-list-item",children:[(0,t.jsxs)("div",{className:"elite-list-title",children:[(0,t.jsx)("span",{children:"ar"===j?"استخدم معرّف API العام وليس UUID الداخلي":"Use the public API ID, not the internal UUID"}),(0,t.jsx)(r.StatusBadge,{tone:"info",children:"ar"===j?"المسار":"Route path"})]}),(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:"ar"===j?(0,t.jsxs)(t.Fragment,{children:["تستخدم مسارات لوحة التحكم UUID الداخلي للمثيل. تستخدم المسارات العامة للمطور معرّف المثيل ",(0,t.jsx)("code",{children:"publicId"}),"."]}):(0,t.jsxs)(t.Fragment,{children:["Dashboard routes use the internal instance UUID. Public developer routes use the instance ",(0,t.jsx)("code",{children:"publicId"}),"."]})})]}),(0,t.jsxs)("div",{className:"elite-list-item",children:[(0,t.jsxs)("div",{className:"elite-list-title",children:[(0,t.jsx)("span",{children:"ar"===j?"عامل الرمز كسِرّ":"Treat the token as a secret"}),(0,t.jsx)(r.StatusBadge,{tone:"warning",children:"ar"===j?"الأمان":"Security"})]}),(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:"ar"===j?"احفظ الرمز في جهة الخادم فقط. إذا تسرّب، دوّره من صفحة تفاصيل المثيل واستبدله في إعدادات خدمتك الخلفية.":"Store the token server-side only. If it leaks, rotate it from the instance detail page and replace it in your backend configuration."})]}),(0,t.jsxs)("div",{className:"elite-list-item",children:[(0,t.jsxs)("div",{className:"elite-list-title",children:[(0,t.jsx)("span",{children:"ar"===j?"معرّفات المرجع تجعل إعادة المحاولة أكثر أمانًا":"Reference IDs make retries safer"}),(0,t.jsx)(r.StatusBadge,{tone:"success",children:"ar"===j?"العمليات":"Operations"})]}),(0,t.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:"ar"===j?(0,t.jsxs)(t.Fragment,{children:["مرّر قيم ",(0,t.jsx)("code",{children:"referenceId"})," الخاصة بك حتى تتمكن من تتبع الإرسال والاستعلام عن السجلات وتجنب معالجة إعادة المحاولة المكررة في تطبيقك."]}):(0,t.jsxs)(t.Fragment,{children:["Pass your own ",(0,t.jsx)("code",{children:"referenceId"})," values so you can trace sends, query logs, and avoid duplicate retry handling in your application."]})})]})]})}),(0,t.jsx)(i.InfoCard,{eyebrow:"ar"===j?"رموز مساحة العمل":"Workspace tokens",title:"ar"===j?"رموز API للحساب على مستوى مساحة العمل":"Workspace-level account API tokens",children:(0,t.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,t.jsxs)(r.NoticeBanner,{title:"ar"===j?"استخدم هذه الرموز للتكاملات المرتبطة بالحساب":"Use these tokens for account-scoped integrations",tone:"info",children:[(0,t.jsx)("p",{style:{marginTop:0},children:"ar"===j?(0,t.jsxs)(t.Fragment,{children:["أنشئ رموز API الخاصة بمساحة العمل ودوّرها من صفحة الإعدادات، ثم استخدمها على جهة الخادم لاستدعاء API الحساب العام تحت ",(0,t.jsx)("code",{children:"/api/v1/public/account"}),"."]}):(0,t.jsxs)(t.Fragment,{children:["Create and rotate workspace API tokens from Settings, then use them server-side to call the public account API under"," ",(0,t.jsx)("code",{children:"/api/v1/public/account"}),"."]})}),(0,t.jsx)("p",{style:{marginBottom:0},children:"ar"===j?"احتفظ بالرمز في مخزن الأسرار في خدمتك الخلفية. لا تعرضه في المتصفح.":"Keep the token in your backend secret store. Do not expose it in the browser."})]}),(0,t.jsx)(r.DefinitionGrid,{minItemWidth:220,items:[{label:O.workspace,value:K?.name??("ar"===j?"مساحة العمل المحددة":"Selected workspace"),tone:"info"},{label:"ar"===j?"مصادقة الإدارة":"Management auth",value:"ar"===j?"جلسة bearer للوحة التحكم":"Dashboard bearer session",tone:"neutral"},{label:"ar"===j?"المصادقة العامة":"Public auth",value:"Authorization: Bearer {account_api_token}",tone:"success"},{label:"ar"===j?"عائلة المسارات العامة":"Public route family",value:"/api/v1/public/account/*",tone:"neutral"}]}),(0,t.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,t.jsx)(T,{label:"ar"===j?"عرض رموز مساحة العمل":"List workspace tokens",endpoint:eu}),(0,t.jsx)(T,{label:"ar"===j?"إنشاء رمز مساحة العمل":"Create workspace token",endpoint:eh}),(0,t.jsx)(T,{label:"ar"===j?"تدوير رمز مساحة العمل":"Rotate workspace token",endpoint:eg})]})]})}),(0,t.jsx)(A,{eyebrow:"Account API",title:"GET /api/v1/public/account/instances",endpoint:S("/instances"),snippet:ei}),(0,t.jsx)(A,{eyebrow:"Account API",title:"POST /api/v1/public/account/instances",endpoint:S("/instances"),snippet:eo}),(0,t.jsx)(A,{eyebrow:"Account API",title:"PATCH /api/v1/public/account/instances/{instanceId}",endpoint:`${S("/instances")}/your-instance-id`,snippet:el}),(0,t.jsx)(i.InfoCard,{eyebrow:"ar"===j?"عمليات Webhook":"Webhooks",title:"ar"===j?"أمثلة تسليم Webhook والتحقق الموقّع":"Webhook delivery examples and signed verification",children:(0,t.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,t.jsxs)(r.NoticeBanner,{title:"ar"===j?"ما الذي يرسله Elite Message":"What Elite Message sends",tone:"info",children:[(0,t.jsx)("p",{style:{marginTop:0},children:"ar"===j?"تتضمن طلبات التسليم جسم JSON موقّعًا بالإضافة إلى رؤوس معرّف التسليم ونوع الحدث ومعرّف المثيل العام والطابع الزمني.":"Delivery requests include the signed JSON body plus headers for the delivery ID, event type, public instance ID, and timestamp."}),(0,t.jsxs)("div",{style:{display:"grid",gap:8},children:[(0,t.jsx)("p",{style:{margin:0},children:(0,t.jsx)("code",{children:"x-elite-message-delivery-id"})}),(0,t.jsx)("p",{style:{margin:0},children:(0,t.jsx)("code",{children:"x-elite-message-event"})}),(0,t.jsx)("p",{style:{margin:0},children:(0,t.jsx)("code",{children:"x-elite-message-instance-public-id"})}),(0,t.jsx)("p",{style:{margin:0},children:(0,t.jsx)("code",{children:"x-elite-message-timestamp"})}),(0,t.jsx)("p",{style:{marginBottom:0},children:(0,t.jsx)("code",{children:"x-elite-message-signature"})})]})]}),(0,t.jsx)(r.DefinitionGrid,{minItemWidth:220,items:[{label:"ar"===j?"أنواع الأحداث":"Event types",value:"message_create, message_ack, message_received",tone:"info"},{label:"ar"===j?"تنسيق التوقيع":"Signature format",value:"v1=HMAC_SHA256(secret, timestamp.raw_body)",tone:"success"},{label:"ar"===j?"مصدر السر":"Secret source",value:"Instance settings webhookSecret",tone:"neutral"},{label:"ar"===j?"طريقة HTTP":"HTTP method",value:"POST",tone:"neutral"}]}),(0,t.jsx)($,{eyebrow:"ar"===j?"مثال الحمولة":"Payload example",title:"ar"===j?"جسم Webhook الموقّع":"Signed webhook body",description:"ar"===j?"هذا هو جسم JSON الذي يراه المستقبل قبل التحقق من التوقيع.":"This is the JSON body the receiver sees before you verify the signature.",snippet:ec})]})}),(0,t.jsx)($,{eyebrow:"ar"===j?"مستقبل Webhook":"Webhook receiver",title:"ar"===j?"تعامل مع التسليم الوارد":"Handle the incoming delivery",description:"ar"===j?"اقرأ رؤوس Elite Message، وحلّل الجسم، وأعد 200 فقط بعد أن يتحقق تطبيقك من الحدث ويخزنه.":"Read the Elite Message headers, parse the body, and return 200 only after your app has validated and stored the event.",snippet:ed}),(0,t.jsx)($,{eyebrow:"ar"===j?"فحص التوقيع":"Signature check",title:"ar"===j?"تحقق من x-elite-message-signature":"Verify x-elite-message-signature",description:"ar"===j?"استخدم جسم الطلب الخام ورأس الطابع الزمني وسر Webhook الخاص بالمثيل للتحقق من صحة التسليم.":"Use the raw request body, the timestamp header, and your instance webhook secret to validate delivery authenticity.",snippet:ep}),N?(0,t.jsx)(r.NoticeBanner,{title:O.docsIssue,tone:"danger",children:(0,t.jsx)("p",{style:{margin:0},children:N})}):null]}):null]})}])}]);