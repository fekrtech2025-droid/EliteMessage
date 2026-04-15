module.exports=[23397,a=>{"use strict";var b=a.i(89272),c=a.i(88722),d=a.i(26670);a.i(56120);var e=a.i(34910),f=a.i(76989),g=a.i(10246),h=a.i(76329),i=a.i(73663),j=a.i(36108),k=a.i(67992),l=a.i(88033),m=a.i(71976),n=a.i(9061),o=a.i(97263);let p=[{value:"curl",label:"cURL"},{value:"node",label:"Node.js"},{value:"python",label:"Python"},{value:"php",label:"PHP"},{value:"go",label:"Go"},{value:"java",label:"Java"},{value:"csharp",label:"C#"}],q="963944556677",r="docs-chat-001",s="https://example.com/media/welcome.png",t="your-account-api-token";function u(a,b){return`${o.apiBaseUrl}/instance/${a}${b}`}async function v(a){if("u"<typeof navigator||!navigator.clipboard?.writeText)return!1;try{return await navigator.clipboard.writeText(a),!0}catch{return!1}}function w(a){return`'${a.replaceAll("'","\\'")}'`}function x(a){return`${o.apiBaseUrl}/api/v1/public/account${a}`}function y({label:a,endpoint:c}){let{locale:f}=(0,h.useCustomerLocale)(),[g,i]=(0,d.useState)("idle");async function j(){i(await v(c)?"copied":"failed")}return(0,b.jsxs)("div",{className:"elite-list-item",children:[(0,b.jsxs)("div",{className:"elite-list-title",style:{alignItems:"flex-start"},children:[(0,b.jsx)("span",{children:a}),(0,b.jsx)(e.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>void j(),children:"ar"===f?"نسخ الرابط":"Copy endpoint"})]}),(0,b.jsx)("code",{style:{overflowWrap:"anywhere"},children:c}),"copied"===g?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-success-ink)"},children:"ar"===f?"تم نسخ الرابط.":"Endpoint copied."}):null,"failed"===g?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-danger-ink)"},children:"ar"===f?"تعذر النسخ تلقائيًا.":"Could not copy automatically."}):null]})}function z({eyebrow:a,title:c,snippet:f,description:i}){let{locale:j}=(0,h.useCustomerLocale)(),[k,l]=(0,d.useState)("idle");return(0,b.jsx)(g.InfoCard,{eyebrow:a,title:c,action:(0,b.jsx)(e.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>{v(f).then(a=>l(a?"copied":"failed"))},children:"ar"===j?"نسخ المقتطف":"Copy snippet"}),children:(0,b.jsxs)("div",{style:{display:"grid",gap:12},children:[i?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:i}):null,"copied"===k?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-success-ink)"},children:"ar"===j?"تم النسخ.":"Copied."}):null,"failed"===k?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-danger-ink)"},children:"ar"===j?"تعذر النسخ تلقائيًا.":"Could not copy automatically."}):null,(0,b.jsx)("pre",{className:"elite-mono-panel",children:f})]})})}function A({eyebrow:a,title:c,endpoint:f,snippet:i}){let{locale:j}=(0,h.useCustomerLocale)(),[k,l]=(0,d.useState)("idle");async function m(){if("u"<typeof navigator||!navigator.clipboard?.writeText)return void l("failed");try{await navigator.clipboard.writeText(i),l("copied")}catch{l("failed")}}return(0,b.jsx)(g.InfoCard,{eyebrow:a,title:c,action:(0,b.jsxs)("div",{className:"elite-toolbar",children:[(0,b.jsx)(e.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>{v(f).then(a=>l(a?"copied":"failed"))},children:"ar"===j?"نسخ الرابط":"Copy endpoint"}),(0,b.jsx)(e.ActionButton,{type:"button",tone:"secondary",size:"compact",onClick:()=>void m(),children:"ar"===j?"نسخ المقتطف":"Copy snippet"})]}),children:(0,b.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:(0,b.jsx)("code",{children:f})}),"copied"===k?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-success-ink)"},children:"ar"===j?"تم النسخ.":"Copied."}):null,"failed"===k?(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-danger-ink)"},children:"ar"===j?"تعذر النسخ تلقائيًا.":"Could not copy automatically."}):null,(0,b.jsx)("pre",{className:"elite-mono-panel",children:i})]})})}a.s(["CustomerApiDocumentsPage",0,function(){var a;let{locale:v}=(0,h.useCustomerLocale)(),B=(0,d.useRef)(!0),[C,D]=(0,d.useState)("loading"),[,E]=(0,d.useState)(null),[F,G]=(0,d.useState)(null),[H,I]=(0,d.useState)([]),[J,K]=(0,d.useState)(""),[L,M]=(0,d.useState)(""),[N,O]=(0,d.useState)("python"),[P,Q]=(0,d.useState)(null),R="ar"===v?{apiDocuments:"مستندات API",backToDashboard:"العودة إلى لوحة التحكم",createInstanceFirst:"أنشئ مثيلًا قبل استخدام API",createInstanceFirstBody:"تستخدم الأمثلة أدناه قيمًا افتراضية حتى تحتوي مساحة العمل النشطة على مثيل.",dashboardLogin:"العودة إلى تسجيل الدخول في لوحة التحكم",developerApi:"واجهة API للمطور",docsIssue:"مشكلة في مستندات API",examples:"الأمثلة",fullTokenUnavailable:"الرمز الكامل غير متاح في جلسة المتصفح هذه",instance:"المثيل",loadingApiReference:"جارٍ تحميل مرجع API",loadingMessage:"يتم تحديث جلسة العميل وتحميل مثيلات مساحة العمل للأمثلة المباشرة.",noWorkspaceInstances:"لا توجد مثيلات في مساحة العمل",openInstanceDetail:"افتح تفاصيل المثيل",quickStart:"بداية سريعة",quickStartTitle:"من إنشاء المثيل إلى استدعاءات API",referenceValues:"القيم المرجعية للمقتطفات أدناه",sessionMissing:"جلسة العميل مفقودة أو منتهية الصلاحية.",signInRequired:"يجب تسجيل الدخول",subtitle:"استخدم واجهة API العامة الخاصة بكل مثيل بعد إنشاء المثيل وربط واتساب. تُنشأ الأمثلة أدناه من مثيل مساحة العمل المحددة عندما يكون هناك رمز كامل محفوظ في جلسة المتصفح هذه.",tokenWarning:"يعيد Elite Message الرمز الكامل للمثيل فقط عند الإنشاء أو التدوير. افتح صفحة تفاصيل المثيل ودوّر الرمز إذا احتجت إلى قيمة كاملة جديدة لهذه الأمثلة.",workspace:"مساحة العمل"}:{apiDocuments:"API Documents",backToDashboard:"Back to dashboard",createInstanceFirst:"Create an instance before using the API",createInstanceFirstBody:"The examples below use placeholders until the active workspace has an instance.",dashboardLogin:"Return to the dashboard login",developerApi:"Developer API",docsIssue:"API documents issue",examples:"Examples",fullTokenUnavailable:"Full token not available in this browser session",instance:"Instance",loadingApiReference:"Loading API reference",loadingMessage:"Refreshing the customer session and loading workspace instances for the live examples.",noWorkspaceInstances:"No workspace instances",openInstanceDetail:"Open instance detail",quickStart:"Quick start",quickStartTitle:"From instance creation to API calls",referenceValues:"Reference values for the snippets below",sessionMissing:"The customer session is missing or expired.",signInRequired:"Sign in required",subtitle:"Use the public per-instance API after instance creation and WhatsApp linking. The examples below are generated from the selected workspace instance when a saved full token is available in this browser session.",tokenWarning:"Elite Message only returns the full instance token on creation or rotation. Open the instance detail page and rotate the token if you need a fresh full value for these examples.",workspace:"Workspace"};function S(a){if(B.current){if("ready"===C&&F)return void Q(a);D("unauthenticated"),Q(a)}}let T=(0,d.useEffectEvent)(async a=>{let[b,c]=await Promise.all([(0,m.loadCustomerAccount)(a),(0,m.requestWithCustomerRefresh)(a,a=>fetch(`${o.apiBaseUrl}/api/v1/customer/instances`,{headers:{authorization:`Bearer ${a}`},credentials:"include"}),E)]);if(!b||!c)return S("ar"===v?"تعذر الوصول إلى API الخاص بالعميل.":"Could not reach the customer API."),!1;if(!c.ok)return S("ar"===v?"تعذر تحميل مستندات API الخاصة بالعميل.":"Could not load customer API documents."),!1;let d=await c.json();if(!B.current)return!1;let e=b.workspaces[0]?.id??"";return E(a),G(b),I(d.items),K(a=>a&&b.workspaces.some(b=>b.id===a)?a:e),D("ready"),!0});(0,d.useEffect)(()=>(B.current=!0,(async()=>{Q(null);let a=(0,o.readStoredToken)();if(a&&await T(a))return;let b=await (0,m.refreshCustomerAccessToken)(E);if(!b){B.current&&D("unauthenticated");return}await T(b)})(),()=>{B.current=!1}),[]),(0,d.useEffect)(()=>{!F?.workspaces.length||F.workspaces.some(a=>a.id===J)||K(F.workspaces[0].id)},[F,J]);let U=(0,d.useMemo)(()=>H.filter(a=>!J||a.workspaceId===J),[H,J]);async function V(){await (0,m.logoutCustomerSession)(),B.current&&(D("unauthenticated"),E(null),G(null),I([]),Q(null))}(0,d.useEffect)(()=>{U.length?U.some(a=>a.id===L)||M((U.find(a=>(0,l.readInstanceCredentials)(a.id)?.token)??U[0]).id):M("")},[L,U]);let W=U.find(a=>a.id===L)??U[0]??null,X=W?(0,l.readInstanceCredentials)(W.id):null,Y=F?.workspaces.find(a=>a.id===J)??F?.workspaces[0]??null,Z=Y?.id??J??"workspace-id",$=X?.publicId??W?.publicId??"your-instance-public-id",_=X?.token??"your-instance-token",aa=!!X?.token,ab=p.find(a=>a.value===N)?.label??"Python",ac=function(a,b,c){let d=u(b,"/messages/chat");switch(a){case"curl":return`curl -X POST "${d}" \\
  -H "Authorization: Bearer ${c}" \\
  -H "content-type: application/json" \\
  -d '{"to":"${q}","body":"Hello from Elite Message","referenceId":"${r}","priority":1}'`;case"node":return["const response = await fetch('"+d+"', {","  method: 'POST',\n  headers: {","    'Authorization': 'Bearer "+c+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({",`    to: '${q}',`,"    body: 'Hello from Elite Message',",`    referenceId: '${r}',`,"    priority: 1\n  })\n});\nconst data = await response.json();\nconsole.log(data);"].join("\n");case"python":return`import requests

response = requests.post(
    '${d}',
    headers={
        'Authorization': 'Bearer ${c}',
        'Content-Type': 'application/json',
    },
    json={
        'to': '${q}',
        'body': 'Hello from Elite Message',
        'referenceId': '${r}',
        'priority': 1,
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'to' => ${w(q)},
    'body' => 'Hello from Elite Message',
    'referenceId' => ${w(r)},
    'priority' => 1,
]);

$ch = curl_init(${w(d)});
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${c}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return['payload := strings.NewReader(`{"to":"'+q+'","body":"Hello from Elite Message","referenceId":"'+r+'","priority":1}`)',`req, _ := http.NewRequest(http.MethodPost, "${d}", payload)`,`req.Header.Set("Authorization", "Bearer ${c}")`,'req.Header.Set("Content-Type", "application/json")\n\nresp, err := http.DefaultClient.Do(req)\nif err != nil {\n    log.Fatal(err)\n}\ndefer resp.Body.Close()\n\nbody, _ := io.ReadAll(resp.Body)\nfmt.Println(string(body))'].join("\n");case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${d}"))`,'    .header("Authorization", "Bearer '+c+'")','    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString("""\n{',`  "to": "${q}",`,'  "body": "Hello from Elite Message",',`  "referenceId": "${r}",`,'  "priority": 1\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${c}");

var payload = JsonSerializer.Serialize(new {
    to = "${q}",
    body = "Hello from Elite Message",
    referenceId = "${r}",
    priority = 1
});

var response = await client.PostAsync("${d}", new StringContent(payload, Encoding.UTF8, "application/json"));
var body = await response.Content.ReadAsStringAsync();
Console.WriteLine(body);`}}(N,$,_),ad=function(a,b,c){let d=u(b,"/messages/image");switch(a){case"curl":return`curl -X POST "${d}" \\
  -H "Authorization: Bearer ${c}" \\
  -H "content-type: application/json" \\
  -d '{"to":"${q}","image":"${s}","caption":"Launch asset","referenceId":"docs-image-001","priority":2}'`;case"node":return["const response = await fetch('"+d+"', {","  method: 'POST',\n  headers: {","    'Authorization': 'Bearer "+c+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({",`    to: '${q}',`,`    image: '${s}',`,"    caption: 'Launch asset',\n    referenceId: 'docs-image-001',\n    priority: 2\n  })\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.post(
    '${d}',
    headers={
        'Authorization': 'Bearer ${c}',
        'Content-Type': 'application/json',
    },
    json={
        'to': '${q}',
        'image': '${s}',
        'caption': 'Launch asset',
        'referenceId': 'docs-image-001',
        'priority': 2,
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'to' => ${w(q)},
    'image' => ${w(s)},
    'caption' => 'Launch asset',
    'referenceId' => 'docs-image-001',
    'priority' => 2,
]);

$ch = curl_init(${w(d)});
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${c}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return['payload := strings.NewReader(`{"to":"'+q+'","image":"'+s+'","caption":"Launch asset","referenceId":"docs-image-001","priority":2}`)',`req, _ := http.NewRequest(http.MethodPost, "${d}", payload)`,`req.Header.Set("Authorization", "Bearer ${c}")`,'req.Header.Set("Content-Type", "application/json")\nresp, err := http.DefaultClient.Do(req)\nif err != nil {\n    log.Fatal(err)\n}\ndefer resp.Body.Close()\nbody, _ := io.ReadAll(resp.Body)\nfmt.Println(string(body))'].join("\n");case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${d}"))`,'    .header("Authorization", "Bearer '+c+'")','    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString("""\n{',`  "to": "${q}",`,`  "image": "${s}",`,'  "caption": "Launch asset",\n  "referenceId": "docs-image-001",\n  "priority": 2\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${c}");

var payload = JsonSerializer.Serialize(new {
    to = "${q}",
    image = "${s}",
    caption = "Launch asset",
    referenceId = "docs-image-001",
    priority = 2
});

var response = await client.PostAsync("${d}", new StringContent(payload, Encoding.UTF8, "application/json"));
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(N,$,_),ae=function(a,b,c){let d=u(b,"/instance/status");switch(a){case"curl":return`curl "${d}" \\
  -H "Authorization: Bearer ${c}"`;case"node":return["const response = await fetch('"+d+"', {","  headers: {","    'Authorization': 'Bearer "+c+"'","  }\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.get(
    '${d}',
    headers={'Authorization': 'Bearer ${c}'},
)
print(response.json())`;case"php":return`$ch = curl_init(${w(d)});
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${c}',
    ],
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`req, _ := http.NewRequest(http.MethodGet, "${d}", nil)
req.Header.Set("Authorization", "Bearer ${c}")
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${d}"))`,'    .header("Authorization", "Bearer '+c+'")',"    .GET()\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());"].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${c}");
var response = await client.GetAsync("${d}");
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(N,$,_),af=function(a,b,c){let d=`${u(b,"/messages")}?limit=20&status=sent&referenceId=${r}`;switch(a){case"curl":return`curl "${d}" \\
  -H "Authorization: Bearer ${c}"`;case"node":return["const response = await fetch('"+d+"', {","  headers: {","    'Authorization': 'Bearer "+c+"'","  }\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.get(
    '${d}',
    headers={'Authorization': 'Bearer ${c}'},
)
print(response.json())`;case"php":return`$ch = curl_init(${w(d)});
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${c}',
    ],
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`req, _ := http.NewRequest(http.MethodGet, "${d}", nil)
req.Header.Set("Authorization", "Bearer ${c}")
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${d}"))`,'    .header("Authorization", "Bearer '+c+'")',"    .GET()\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());"].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${c}");
var response = await client.GetAsync("${d}");
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(N,$,_),ag=function(a,b){let c=`${x("/instances")}?limit=20&status=active`;switch(a){case"curl":return`curl "${c}" \\
  -H "Authorization: Bearer ${b}"`;case"node":return["const response = await fetch('"+c+"', {","  headers: {","    'Authorization': 'Bearer "+b+"'","  }\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.get(
    '${c}',
    headers={'Authorization': 'Bearer ${b}'},
)
print(response.json())`;case"php":return`$ch = curl_init(${w(c)});
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${b}',
    ],
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`req, _ := http.NewRequest(http.MethodGet, "${c}", nil)
req.Header.Set("Authorization", "Bearer ${b}")
resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${c}"))`,'    .header("Authorization", "Bearer '+b+'")',"    .GET()\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());"].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${b}");
var response = await client.GetAsync("${c}");
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(N,t),ah=function(a,b){let c=x("/instances");switch(a){case"curl":return`curl -X POST "${c}" \\
  -H "Authorization: Bearer ${b}" \\
  -H "content-type: application/json" \\
  -d '{"name":"Integration instance"}'`;case"node":return["const response = await fetch('"+c+"', {","  method: 'POST',\n  headers: {","    'Authorization': 'Bearer "+b+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Integration instance'\n  })\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.post(
    '${c}',
    headers={
        'Authorization': 'Bearer ${b}',
        'Content-Type': 'application/json',
    },
    json={
        'name': 'Integration instance',
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'name' => 'Integration instance',
]);

$ch = curl_init(${w(c)});
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${b}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`payload := strings.NewReader(\`{"name":"Integration instance"}\`)
req, _ := http.NewRequest(http.MethodPost, "${c}", payload)
req.Header.Set("Authorization", "Bearer ${b}")
req.Header.Set("Content-Type", "application/json")

resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${c}"))`,'    .header("Authorization", "Bearer '+b+'")','    .header("Content-Type", "application/json")\n    .POST(HttpRequest.BodyPublishers.ofString("""\n{\n  "name": "Integration instance"\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${b}");

var payload = JsonSerializer.Serialize(new {
    name = "Integration instance"
});

var response = await client.PostAsync("${c}", new StringContent(payload, Encoding.UTF8, "application/json"));
Console.WriteLine(await response.Content.ReadAsStringAsync());`}}(N,t),ai=function(a,b){let c=`${x("/instances")}/your-instance-id`;switch(a){case"curl":return`curl -X PATCH "${c}" \\
  -H "Authorization: Bearer ${b}" \\
  -H "content-type: application/json" \\
  -d '{"name":"Renamed integration instance"}'`;case"node":return["const response = await fetch('"+c+"', {","  method: 'PATCH',\n  headers: {","    'Authorization': 'Bearer "+b+"',","    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Renamed integration instance'\n  })\n});\nconsole.log(await response.json());"].join("\n");case"python":return`import requests

response = requests.patch(
    '${c}',
    headers={
        'Authorization': 'Bearer ${b}',
        'Content-Type': 'application/json',
    },
    json={
        'name': 'Renamed integration instance',
    },
)
print(response.json())`;case"php":return`$payload = json_encode([
    'name' => 'Renamed integration instance',
]);

$ch = curl_init(${w(c)});
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "PATCH",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${b}',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => $payload,
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`;case"go":return`payload := strings.NewReader(\`{"name":"Renamed integration instance"}\`)
req, _ := http.NewRequest(http.MethodPatch, "${c}", payload)
req.Header.Set("Authorization", "Bearer ${b}")
req.Header.Set("Content-Type", "application/json")

resp, err := http.DefaultClient.Do(req)
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

body, _ := io.ReadAll(resp.Body)
fmt.Println(string(body))`;case"java":return["HttpRequest request = HttpRequest.newBuilder()",`    .uri(URI.create("${c}"))`,'    .header("Authorization", "Bearer '+b+'")','    .header("Content-Type", "application/json")\n    .method("PATCH", HttpRequest.BodyPublishers.ofString("""\n{\n  "name": "Renamed integration instance"\n}\n"""))\n    .build();\n\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'].join("\n");case"csharp":return`using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${b}");

var payload = JsonSerializer.Serialize(new {
    name = "Renamed integration instance"
});

var request = new HttpRequestMessage(HttpMethod.Patch, "${c}") { Content = new StringContent(payload, Encoding.UTF8, "application/json") };
Console.WriteLine(await (await client.SendAsync(request)).Content.ReadAsStringAsync());`}}(N,t),aj=JSON.stringify({event_type:"message_create",instanceId:a=W?.id??"your-instance-id",publicId:$,timestamp:"2026-04-11T12:00:00.000Z",data:{id:"11111111-1111-4111-8111-111111111111",publicMessageId:"msg_1234567890abcdef",instanceId:a,instancePublicId:$,messageType:"chat",recipient:q,body:"Hello from Elite Message",referenceId:r,priority:1,status:"sent",ack:"device",scheduledFor:"2026-04-11T12:00:00.000Z",createdAt:"2026-04-11T12:00:00.000Z",updatedAt:"2026-04-11T12:00:00.000Z"}},null,2),ak=function(a){switch(a){case"curl":return"# Webhooks are delivered to your own HTTPS endpoint, not to Elite Message.\n# Example target: https://your-app.example.com/webhooks/elite-message\n# Send a 200 response after you validate and persist the payload.\n#\nSee the signature verification example below.";case"node":return"import express from 'express';\n\nconst app = express();\napp.use(express.json({ type: 'application/json' }));\n\napp.post('/webhooks/elite-message', async (req, res) => {\n  const deliveryId = req.header('x-elite-message-delivery-id');\n  const eventType = req.header('x-elite-message-event');\n  const instancePublicId = req.header('x-elite-message-instance-public-id');\n  const timestamp = req.header('x-elite-message-timestamp');\n  const signature = req.header('x-elite-message-signature');\n  const payload = req.body;\n\n  console.log({ deliveryId, eventType, instancePublicId, timestamp, signature, payload });\n\n  res.sendStatus(200);\n});";case"python":return"from flask import Flask, request\n\napp = Flask(__name__)\n\n@app.post('/webhooks/elite-message')\ndef webhook():\n    delivery_id = request.headers.get('x-elite-message-delivery-id')\n    event_type = request.headers.get('x-elite-message-event')\n    instance_public_id = request.headers.get('x-elite-message-instance-public-id')\n    timestamp = request.headers.get('x-elite-message-timestamp')\n    signature = request.headers.get('x-elite-message-signature')\n    payload = request.get_json(silent=True) or {}\n\n    print({\n        'delivery_id': delivery_id,\n        'event_type': event_type,\n        'instance_public_id': instance_public_id,\n        'timestamp': timestamp,\n        'signature': signature,\n        'payload': payload,\n    })\n\n    return {'ok': True}";case"php":return"$deliveryId = $_SERVER['HTTP_X_ELITE_MESSAGE_DELIVERY_ID'] ?? null;\n$eventType = $_SERVER['HTTP_X_ELITE_MESSAGE_EVENT'] ?? null;\n$instancePublicId = $_SERVER['HTTP_X_ELITE_MESSAGE_INSTANCE_PUBLIC_ID'] ?? null;\n$timestamp = $_SERVER['HTTP_X_ELITE_MESSAGE_TIMESTAMP'] ?? null;\n$signature = $_SERVER['HTTP_X_ELITE_MESSAGE_SIGNATURE'] ?? null;\n$payload = json_decode(file_get_contents('php://input'), true) ?: [];\n\nerror_log(json_encode(compact('deliveryId', 'eventType', 'instancePublicId', 'timestamp', 'signature', 'payload')));\nhttp_response_code(200);";case"go":return'http.HandleFunc("/webhooks/elite-message", func(w http.ResponseWriter, r *http.Request) {\n    body, _ := io.ReadAll(r.Body)\n    defer r.Body.Close()\n\n    payload := map[string]any{\n        "deliveryId": r.Header.Get("x-elite-message-delivery-id"),\n        "eventType": r.Header.Get("x-elite-message-event"),\n        "instancePublicId": r.Header.Get("x-elite-message-instance-public-id"),\n        "timestamp": r.Header.Get("x-elite-message-timestamp"),\n        "signature": r.Header.Get("x-elite-message-signature"),\n        "payload": string(body),\n    }\n    fmt.Println(payload)\n\n    w.WriteHeader(http.StatusOK)\n})';case"java":return'HttpServer.create(new InetSocketAddress(8080), 0)\n    .createContext("/webhooks/elite-message", exchange -> {\n        String deliveryId = exchange.getRequestHeaders().getFirst("x-elite-message-delivery-id");\n        String eventType = exchange.getRequestHeaders().getFirst("x-elite-message-event");\n        String instancePublicId = exchange.getRequestHeaders().getFirst("x-elite-message-instance-public-id");\n        String timestamp = exchange.getRequestHeaders().getFirst("x-elite-message-timestamp");\n        String signature = exchange.getRequestHeaders().getFirst("x-elite-message-signature");\n        String payload = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);\n        System.out.println(payload);\n        exchange.sendResponseHeaders(200, 0);\n        exchange.close();\n    })\n    .start();';case"csharp":return'app.MapPost("/webhooks/elite-message", async (HttpRequest request) =>\n{\n    var deliveryId = request.Headers["x-elite-message-delivery-id"].ToString();\n    var eventType = request.Headers["x-elite-message-event"].ToString();\n    var instancePublicId = request.Headers["x-elite-message-instance-public-id"].ToString();\n    var timestamp = request.Headers["x-elite-message-timestamp"].ToString();\n    var signature = request.Headers["x-elite-message-signature"].ToString();\n\n    using var reader = new StreamReader(request.Body);\n    var payload = await reader.ReadToEndAsync();\n\n    Console.WriteLine(payload);\n    return Results.Ok(new { deliveryId, eventType, instancePublicId, timestamp, signature });\n});'}}(N),al=function(a){let b="WEBHOOK_SECRET";switch(a){case"curl":return`# cURL only receives webhooks; verification happens in your app server.
# Compare the x-elite-message-signature header against:
# v1=HMAC_SHA256("${b}", "timestamp.raw_body")`;case"node":return`import { createHmac, timingSafeEqual } from 'node:crypto';

function verifyWebhook(rawBody, timestamp, signatureHeader) {
  const expected = 'v1=' + createHmac('sha256', process.env.${b} ?? '')
    .update(\`\${timestamp}.\${rawBody}\`)
    .digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signatureHeader ?? '');
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}`;case"python":return"import hmac\nimport hashlib\n\ndef verify_webhook(raw_body: str, timestamp: str, signature_header: str, webhook_secret: str) -> bool:\n    expected = 'v1=' + hmac.new(\n        webhook_secret.encode('utf-8'),\n        f'{timestamp}.{raw_body}'.encode('utf-8'),\n        hashlib.sha256,\n    ).hexdigest()\n    return hmac.compare_digest(expected, signature_header or '')";case"php":return"function verifyWebhook(string $rawBody, string $timestamp, ?string $signatureHeader, string $webhookSecret): bool {\n    $expected = 'v1=' . hash_hmac('sha256', $timestamp . '.' . $rawBody, $webhookSecret);\n    return hash_equals($expected, $signatureHeader ?? '');\n}";case"go":return'func verifyWebhook(rawBody []byte, timestamp string, signatureHeader string, webhookSecret string) bool {\n    mac := hmac.New(sha256.New, []byte(webhookSecret))\n    mac.Write([]byte(timestamp + "." + string(rawBody)))\n    expected := "v1=" + hex.EncodeToString(mac.Sum(nil))\n    return hmac.Equal([]byte(expected), []byte(signatureHeader))\n}';case"java":return'boolean verifyWebhook(String rawBody, String timestamp, String signatureHeader, String webhookSecret) throws Exception {\n    Mac mac = Mac.getInstance("HmacSHA256");\n    mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));\n    String message = timestamp + "." + rawBody;\n    byte[] expectedBytes = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));\n    String expected = "v1=" + HexFormat.of().formatHex(expectedBytes);\n    return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), (signatureHeader == null ? "" : signatureHeader).getBytes(StandardCharsets.UTF_8));\n}';case"csharp":return'bool VerifyWebhook(string rawBody, string timestamp, string? signatureHeader, string webhookSecret)\n{\n    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(webhookSecret));\n    var messageBytes = Encoding.UTF8.GetBytes($"{timestamp}.{rawBody}");\n    var expected = "v1=" + Convert.ToHexString(hmac.ComputeHash(messageBytes)).ToLowerInvariant();\n    var received = Encoding.UTF8.GetBytes(signatureHeader ?? string.Empty);\n    return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), received);\n}'}}(N),am=`${o.apiBaseUrl}/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(Z)}`,an=`${o.apiBaseUrl}/api/v1/account/api-tokens`,ao=`${o.apiBaseUrl}/api/v1/account/api-tokens/{tokenId}/rotate`;return(0,b.jsxs)(f.AppShell,{title:R.apiDocuments,subtitle:R.subtitle,breadcrumbLabel:R.apiDocuments,surface:"customer",density:"compact",labels:(0,n.getCustomerShellLabels)(v),nav:"ready"===C?(0,b.jsx)(i.CustomerNav,{current:"api-docs",account:F,workspaceId:J}):void 0,meta:F?(0,b.jsx)(j.CustomerTopbarAnnouncement,{eyebrow:R.developerApi,message:"ar"===v?"أرسل الرسائل من خدمتك الخلفية باستخدام معرّف المثيل العام والرمز.":"Send messages from your backend with the instance public ID and token.",linkLabel:W?R.openInstanceDetail:R.backToDashboard,linkHref:W?`/instances/${W.id}`:"/"}):void 0,headerActions:"ready"===C&&F?(0,b.jsx)(j.CustomerWorkspaceControls,{account:F,workspaceId:J,onWorkspaceChange:K,onLogout:V}):void 0,footer:(0,b.jsx)(c.default,{href:"/dashboard",children:R.backToDashboard}),children:["loading"===C?(0,b.jsx)(g.InfoCard,{eyebrow:"ar"===v?"المستندات":"Docs",title:R.loadingApiReference,children:(0,b.jsx)("p",{style:{margin:0},children:R.loadingMessage})}):null,"unauthenticated"===C?(0,b.jsxs)(g.InfoCard,{eyebrow:"ar"===v?"الجلسة":"Session",title:R.signInRequired,children:[(0,b.jsx)("p",{style:{marginTop:0},children:R.sessionMissing}),(0,b.jsx)("p",{style:{marginBottom:0},children:(0,b.jsx)(c.default,{href:"/signin",children:R.dashboardLogin})})]}):null,"ready"===C&&F?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(g.InfoCard,{eyebrow:R.quickStart,title:R.quickStartTitle,children:(0,b.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,b.jsx)(e.DefinitionGrid,{minItemWidth:180,items:[{label:"ar"===v?"الرابط الأساسي":"Base URL",value:o.apiBaseUrl,tone:"info"},{label:R.workspace,value:Y?.name??("ar"===v?"لم يتم اختيار مساحة عمل":"No workspace selected")},{label:"ar"===v?"معرّف مثيل API":"API instance ID",value:$,tone:aa?"success":"neutral"},{label:"ar"===v?"طريقة إرسال الرمز":"Token transport",value:"Authorization: Bearer or ?token=",tone:"neutral"}]}),(0,b.jsxs)("ol",{style:{margin:0,paddingInlineStart:18,display:"grid",gap:8},children:[(0,b.jsx)("li",{children:"ar"===v?"أنشئ مثيلًا من لوحة تحكم العميل.":"Create an instance from the customer dashboard."}),(0,b.jsx)("li",{children:"ar"===v?"افتح صفحة تشغيل المثيل واربط حساب واتساب حتى تصبح الحالة موثّقة.":"Open the instance runtime page and link the WhatsApp account until the status becomes authenticated."}),(0,b.jsx)("li",{children:"ar"===v?"انسخ معرّف مثيل API والرمز من بطاقة وصول API أو دوّر الرمز لإظهار قيمة كاملة جديدة.":"Copy the API instance ID and token from the API access card or rotate the token to reveal a fresh full value."}),(0,b.jsx)("li",{children:"ar"===v?(0,b.jsxs)(b.Fragment,{children:["استدعِ المسارات العامة الخاصة بكل مثيل عند"," ",(0,b.jsxs)("code",{children:["/instance/","{instanceId}"]})," من خدمتك الخلفية."]}):(0,b.jsxs)(b.Fragment,{children:["Call the public per-instance routes at"," ",(0,b.jsxs)("code",{children:["/instance/","{instanceId}"]})," from your backend service."]})})]})]})}),(0,b.jsx)(g.InfoCard,{eyebrow:R.examples,title:R.referenceValues,children:(0,b.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,b.jsxs)("div",{style:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))"},children:[(0,b.jsx)(e.Field,{label:R.workspace,children:(0,b.jsx)(e.SelectInput,{value:J,onChange:a=>K(a.target.value),children:F.workspaces.map(a=>(0,b.jsxs)("option",{value:a.id,children:[a.name," (",(0,n.translateCustomerEnum)(v,a.role),")"]},a.id))})}),(0,b.jsx)(e.Field,{label:R.instance,children:(0,b.jsxs)(e.SelectInput,{value:W?.id??"",onChange:a=>M(a.target.value),disabled:0===U.length,children:[0===U.length?(0,b.jsx)("option",{value:"",children:R.noWorkspaceInstances}):null,U.map(a=>(0,b.jsxs)("option",{value:a.id,children:[a.name," (",a.publicId,")"]},a.id))]})})]}),(0,b.jsx)("div",{className:"elite-toolbar",children:p.map(a=>(0,b.jsx)(e.ActionButton,{type:"button",tone:a.value===N?"primary":"secondary",size:"compact",onClick:()=>O(a.value),children:a.label},a.value))}),W?null:(0,b.jsx)(e.NoticeBanner,{title:R.createInstanceFirst,tone:"warning",children:(0,b.jsx)("p",{style:{margin:0},children:R.createInstanceFirstBody})}),W&&!aa?(0,b.jsxs)(e.NoticeBanner,{title:R.fullTokenUnavailable,tone:"warning",children:[(0,b.jsx)("p",{style:{marginTop:0},children:R.tokenWarning}),(0,b.jsx)("p",{style:{marginBottom:0},children:"ar"===v?"تستخدم المقتطفات الحالية قيمًا افتراضية للرمز لكنها تحتفظ بمعرّف مثيل API العام الحقيقي.":"The current snippets use placeholders for the token but keep the real public API instance ID."})]}):null,W&&"authenticated"!==W.status?(0,b.jsx)(e.NoticeBanner,{title:"ar"===v?"لا يزال المثيل يحتاج إلى مصادقة واتساب":"Instance still needs WhatsApp authentication",tone:"warning",children:(0,b.jsx)("p",{style:{margin:0},children:"ar"===v?"مسارات التشغيل والحالة متاحة، لكن استدعاءات إرسال الرسائل يجب أن تنتظر حتى يتم ربط المثيل ومصادقته.":"Runtime and status routes are available, but send-message calls should wait until the instance is linked and authenticated."})}):null,(0,b.jsx)(z,{eyebrow:"ar"===v?"معاينة مباشرة":"Live preview",title:"ar"===v?`مثال ${ab} المحدد`:`Selected ${ab} example`,description:"ar"===v?"يتم تحديث هذه المعاينة عند تغيير مساحة العمل أو المثيل أو لغة الخلفية.":"This preview updates as you change the workspace, instance, or backend language.",snippet:ac})]})}),W?(0,b.jsx)(k.InstanceApiAccessCard,{eyebrow:"ar"===v?"المثيل المحدد":"Selected instance",title:"ar"===v?"وصول API المباشر للمثيل":"Live instance API access",instanceId:W.id,publicId:$,instanceName:W.name,token:X?.token??null,connected:"authenticated"===W.status,lastAuthenticatedAt:W.latestEventAt,lastStatusLabel:"ar"===v?"آخر حدث":"Latest event",detailHref:`/instances/${W.id}`}):null,(0,b.jsx)(g.InfoCard,{eyebrow:"ar"===v?"المصادقة":"Authentication",title:"ar"===v?"كيفية مصادقة خدمتك الخلفية":"How to authenticate your backend",children:(0,b.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,b.jsx)("p",{style:{margin:0},children:"ar"===v?(0,b.jsxs)(b.Fragment,{children:["استخدم ",(0,b.jsx)("strong",{children:"معرّف المثيل العام"})," في مسار الطلب و",(0,b.jsx)("strong",{children:"رمز المثيل"})," إما كرمز bearer أو كمعامل توافق في الاستعلام."]}):(0,b.jsxs)(b.Fragment,{children:["Use the ",(0,b.jsx)("strong",{children:"instance public ID"})," in the route path and the ",(0,b.jsx)("strong",{children:"instance token"})," as either a bearer token or a compatibility query string."]})}),(0,b.jsx)(e.DefinitionGrid,{minItemWidth:220,items:[{label:"ar"===v?"المصادقة المفضلة":"Preferred auth",value:"Authorization: Bearer {instance_token}",tone:"success"},{label:"ar"===v?"مصادقة التوافق":"Compatibility auth",value:"?token={instance_token}",tone:"info"},{label:"ar"===v?"نمط المسار":"Route pattern",value:`/instance/${$}`,tone:"neutral"},{label:"ar"===v?"اللغة المحددة":"Selected language",value:ab,tone:"neutral"}]}),(0,b.jsx)("pre",{className:"elite-mono-panel",children:`GET ${u($,"/instance/status")}?token=${_}`})]})}),(0,b.jsx)(A,{eyebrow:"Send chat",title:"POST /instance/{instanceId}/messages/chat",endpoint:u($,"/messages/chat"),snippet:ac}),(0,b.jsx)(A,{eyebrow:"Send image",title:"POST /instance/{instanceId}/messages/image",endpoint:u($,"/messages/image"),snippet:ad}),(0,b.jsx)(A,{eyebrow:"Status",title:"GET /instance/{instanceId}/instance/status",endpoint:u($,"/instance/status"),snippet:ae}),(0,b.jsx)(A,{eyebrow:"Logs",title:"GET /instance/{instanceId}/messages",endpoint:`${u($,"/messages")}?limit=20&status=sent&referenceId=${r}`,snippet:af}),(0,b.jsx)(g.InfoCard,{eyebrow:"ar"===v?"ملاحظات":"Notes",title:"ar"===v?"قواعد تكامل عملية":"Practical integration rules",children:(0,b.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,b.jsxs)("div",{className:"elite-list-item",children:[(0,b.jsxs)("div",{className:"elite-list-title",children:[(0,b.jsx)("span",{children:"ar"===v?"استخدم معرّف API العام وليس UUID الداخلي":"Use the public API ID, not the internal UUID"}),(0,b.jsx)(e.StatusBadge,{tone:"info",children:"ar"===v?"المسار":"Route path"})]}),(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:"ar"===v?(0,b.jsxs)(b.Fragment,{children:["تستخدم مسارات لوحة التحكم UUID الداخلي للمثيل. تستخدم المسارات العامة للمطور معرّف المثيل ",(0,b.jsx)("code",{children:"publicId"}),"."]}):(0,b.jsxs)(b.Fragment,{children:["Dashboard routes use the internal instance UUID. Public developer routes use the instance ",(0,b.jsx)("code",{children:"publicId"}),"."]})})]}),(0,b.jsxs)("div",{className:"elite-list-item",children:[(0,b.jsxs)("div",{className:"elite-list-title",children:[(0,b.jsx)("span",{children:"ar"===v?"عامل الرمز كسِرّ":"Treat the token as a secret"}),(0,b.jsx)(e.StatusBadge,{tone:"warning",children:"ar"===v?"الأمان":"Security"})]}),(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:"ar"===v?"احفظ الرمز في جهة الخادم فقط. إذا تسرّب، دوّره من صفحة تفاصيل المثيل واستبدله في إعدادات خدمتك الخلفية.":"Store the token server-side only. If it leaks, rotate it from the instance detail page and replace it in your backend configuration."})]}),(0,b.jsxs)("div",{className:"elite-list-item",children:[(0,b.jsxs)("div",{className:"elite-list-title",children:[(0,b.jsx)("span",{children:"ar"===v?"معرّفات المرجع تجعل إعادة المحاولة أكثر أمانًا":"Reference IDs make retries safer"}),(0,b.jsx)(e.StatusBadge,{tone:"success",children:"ar"===v?"العمليات":"Operations"})]}),(0,b.jsx)("p",{style:{margin:0,color:"var(--elite-muted)"},children:"ar"===v?(0,b.jsxs)(b.Fragment,{children:["مرّر قيم ",(0,b.jsx)("code",{children:"referenceId"})," الخاصة بك حتى تتمكن من تتبع الإرسال والاستعلام عن السجلات وتجنب معالجة إعادة المحاولة المكررة في تطبيقك."]}):(0,b.jsxs)(b.Fragment,{children:["Pass your own ",(0,b.jsx)("code",{children:"referenceId"})," values so you can trace sends, query logs, and avoid duplicate retry handling in your application."]})})]})]})}),(0,b.jsx)(g.InfoCard,{eyebrow:"ar"===v?"رموز مساحة العمل":"Workspace tokens",title:"ar"===v?"رموز API للحساب على مستوى مساحة العمل":"Workspace-level account API tokens",children:(0,b.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,b.jsxs)(e.NoticeBanner,{title:"ar"===v?"استخدم هذه الرموز للتكاملات المرتبطة بالحساب":"Use these tokens for account-scoped integrations",tone:"info",children:[(0,b.jsx)("p",{style:{marginTop:0},children:"ar"===v?(0,b.jsxs)(b.Fragment,{children:["أنشئ رموز API الخاصة بمساحة العمل ودوّرها من صفحة الإعدادات، ثم استخدمها على جهة الخادم لاستدعاء API الحساب العام تحت ",(0,b.jsx)("code",{children:"/api/v1/public/account"}),"."]}):(0,b.jsxs)(b.Fragment,{children:["Create and rotate workspace API tokens from Settings, then use them server-side to call the public account API under"," ",(0,b.jsx)("code",{children:"/api/v1/public/account"}),"."]})}),(0,b.jsx)("p",{style:{marginBottom:0},children:"ar"===v?"احتفظ بالرمز في مخزن الأسرار في خدمتك الخلفية. لا تعرضه في المتصفح.":"Keep the token in your backend secret store. Do not expose it in the browser."})]}),(0,b.jsx)(e.DefinitionGrid,{minItemWidth:220,items:[{label:R.workspace,value:Y?.name??("ar"===v?"مساحة العمل المحددة":"Selected workspace"),tone:"info"},{label:"ar"===v?"مصادقة الإدارة":"Management auth",value:"ar"===v?"جلسة bearer للوحة التحكم":"Dashboard bearer session",tone:"neutral"},{label:"ar"===v?"المصادقة العامة":"Public auth",value:"Authorization: Bearer {account_api_token}",tone:"success"},{label:"ar"===v?"عائلة المسارات العامة":"Public route family",value:"/api/v1/public/account/*",tone:"neutral"}]}),(0,b.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,b.jsx)(y,{label:"ar"===v?"عرض رموز مساحة العمل":"List workspace tokens",endpoint:am}),(0,b.jsx)(y,{label:"ar"===v?"إنشاء رمز مساحة العمل":"Create workspace token",endpoint:an}),(0,b.jsx)(y,{label:"ar"===v?"تدوير رمز مساحة العمل":"Rotate workspace token",endpoint:ao})]})]})}),(0,b.jsx)(A,{eyebrow:"Account API",title:"GET /api/v1/public/account/instances",endpoint:x("/instances"),snippet:ag}),(0,b.jsx)(A,{eyebrow:"Account API",title:"POST /api/v1/public/account/instances",endpoint:x("/instances"),snippet:ah}),(0,b.jsx)(A,{eyebrow:"Account API",title:"PATCH /api/v1/public/account/instances/{instanceId}",endpoint:`${x("/instances")}/your-instance-id`,snippet:ai}),(0,b.jsx)(g.InfoCard,{eyebrow:"ar"===v?"عمليات Webhook":"Webhooks",title:"ar"===v?"أمثلة تسليم Webhook والتحقق الموقّع":"Webhook delivery examples and signed verification",children:(0,b.jsxs)("div",{style:{display:"grid",gap:16},children:[(0,b.jsxs)(e.NoticeBanner,{title:"ar"===v?"ما الذي يرسله Elite Message":"What Elite Message sends",tone:"info",children:[(0,b.jsx)("p",{style:{marginTop:0},children:"ar"===v?"تتضمن طلبات التسليم جسم JSON موقّعًا بالإضافة إلى رؤوس معرّف التسليم ونوع الحدث ومعرّف المثيل العام والطابع الزمني.":"Delivery requests include the signed JSON body plus headers for the delivery ID, event type, public instance ID, and timestamp."}),(0,b.jsxs)("div",{style:{display:"grid",gap:8},children:[(0,b.jsx)("p",{style:{margin:0},children:(0,b.jsx)("code",{children:"x-elite-message-delivery-id"})}),(0,b.jsx)("p",{style:{margin:0},children:(0,b.jsx)("code",{children:"x-elite-message-event"})}),(0,b.jsx)("p",{style:{margin:0},children:(0,b.jsx)("code",{children:"x-elite-message-instance-public-id"})}),(0,b.jsx)("p",{style:{margin:0},children:(0,b.jsx)("code",{children:"x-elite-message-timestamp"})}),(0,b.jsx)("p",{style:{marginBottom:0},children:(0,b.jsx)("code",{children:"x-elite-message-signature"})})]})]}),(0,b.jsx)(e.DefinitionGrid,{minItemWidth:220,items:[{label:"ar"===v?"أنواع الأحداث":"Event types",value:"message_create, message_ack, message_received",tone:"info"},{label:"ar"===v?"تنسيق التوقيع":"Signature format",value:"v1=HMAC_SHA256(secret, timestamp.raw_body)",tone:"success"},{label:"ar"===v?"مصدر السر":"Secret source",value:"Instance settings webhookSecret",tone:"neutral"},{label:"ar"===v?"طريقة HTTP":"HTTP method",value:"POST",tone:"neutral"}]}),(0,b.jsx)(z,{eyebrow:"ar"===v?"مثال الحمولة":"Payload example",title:"ar"===v?"جسم Webhook الموقّع":"Signed webhook body",description:"ar"===v?"هذا هو جسم JSON الذي يراه المستقبل قبل التحقق من التوقيع.":"This is the JSON body the receiver sees before you verify the signature.",snippet:aj})]})}),(0,b.jsx)(z,{eyebrow:"ar"===v?"مستقبل Webhook":"Webhook receiver",title:"ar"===v?"تعامل مع التسليم الوارد":"Handle the incoming delivery",description:"ar"===v?"اقرأ رؤوس Elite Message، وحلّل الجسم، وأعد 200 فقط بعد أن يتحقق تطبيقك من الحدث ويخزنه.":"Read the Elite Message headers, parse the body, and return 200 only after your app has validated and stored the event.",snippet:ak}),(0,b.jsx)(z,{eyebrow:"ar"===v?"فحص التوقيع":"Signature check",title:"ar"===v?"تحقق من x-elite-message-signature":"Verify x-elite-message-signature",description:"ar"===v?"استخدم جسم الطلب الخام ورأس الطابع الزمني وسر Webhook الخاص بالمثيل للتحقق من صحة التسليم.":"Use the raw request body, the timestamp header, and your instance webhook secret to validate delivery authenticity.",snippet:al}),P?(0,b.jsx)(e.NoticeBanner,{title:R.docsIssue,tone:"danger",children:(0,b.jsx)("p",{style:{margin:0},children:P})}):null]}):null]})}])}];

//# sourceMappingURL=apps_customer-web_app_api-documents_page-client_tsx_08a~ow~._.js.map