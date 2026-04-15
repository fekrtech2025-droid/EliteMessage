'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import type {
  AccountMeResponse,
  ListCustomerInstancesResponse,
} from '@elite-message/contracts';
import {
  ActionButton,
  AppShell,
  DefinitionGrid,
  Field,
  InfoCard,
  NoticeBanner,
  SelectInput,
  StatusBadge,
} from '@elite-message/ui';
import { useCustomerLocale } from '../components/customer-localization';
import { CustomerNav } from '../components/customer-nav';
import {
  CustomerTopbarAnnouncement,
  CustomerWorkspaceControls,
} from '../components/customer-workspace-chrome';
import { InstanceApiAccessCard } from '../components/instance-api-access-card';
import { readInstanceCredentials } from '../lib/instance-credentials';
import {
  loadCustomerAccount,
  logoutCustomerSession,
  refreshCustomerAccessToken,
  requestWithCustomerRefresh,
} from '../lib/customer-auth';
import {
  getCustomerShellLabels,
  translateCustomerEnum,
} from '../lib/customer-locale';
import { apiBaseUrl, readStoredToken } from '../lib/session';

type PageState = 'loading' | 'unauthenticated' | 'ready';
type BackendLanguage =
  | 'curl'
  | 'node'
  | 'python'
  | 'php'
  | 'go'
  | 'java'
  | 'csharp';

const backendLanguages: { value: BackendLanguage; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
];

const sampleRecipient = '963944556677';
const sampleReferenceId = 'docs-chat-001';
const sampleImageUrl = 'https://example.com/media/welcome.png';
const sampleAccountApiToken = 'your-account-api-token';

function buildPublicRoute(publicId: string, suffix: string) {
  return `${apiBaseUrl}/instance/${publicId}${suffix}`;
}

async function copyText(value: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function quotePhp(value: string) {
  return `'${value.replaceAll("'", "\\'")}'`;
}

function buildAccountRoute(suffix: string) {
  return `${apiBaseUrl}/api/v1/public/account${suffix}`;
}

function buildWebhookPayloadExample(instanceId: string, publicId: string) {
  return JSON.stringify(
    {
      event_type: 'message_create',
      instanceId,
      publicId,
      timestamp: '2026-04-11T12:00:00.000Z',
      data: {
        id: '11111111-1111-4111-8111-111111111111',
        publicMessageId: 'msg_1234567890abcdef',
        instanceId,
        instancePublicId: publicId,
        messageType: 'chat',
        recipient: sampleRecipient,
        body: 'Hello from Elite Message',
        referenceId: sampleReferenceId,
        priority: 1,
        status: 'sent',
        ack: 'device',
        scheduledFor: '2026-04-11T12:00:00.000Z',
        createdAt: '2026-04-11T12:00:00.000Z',
        updatedAt: '2026-04-11T12:00:00.000Z',
      },
    },
    null,
    2,
  );
}

function buildChatSnippet(
  language: BackendLanguage,
  publicId: string,
  token: string,
) {
  const endpoint = buildPublicRoute(publicId, '/messages/chat');

  switch (language) {
    case 'curl':
      return [
        `curl -X POST "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}" \\`,
        '  -H "content-type: application/json" \\',
        `  -d '{"to":"${sampleRecipient}","body":"Hello from Elite Message","referenceId":"${sampleReferenceId}","priority":1}'`,
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        "  method: 'POST',",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "',",
        "    'Content-Type': 'application/json'",
        '  },',
        '  body: JSON.stringify({',
        `    to: '${sampleRecipient}',`,
        "    body: 'Hello from Elite Message',",
        `    referenceId: '${sampleReferenceId}',`,
        '    priority: 1',
        '  })',
        '});',
        'const data = await response.json();',
        'console.log(data);',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.post(`,
        `    '${endpoint}',`,
        '    headers={',
        `        'Authorization': 'Bearer ${token}',`,
        "        'Content-Type': 'application/json',",
        '    },',
        '    json={',
        `        'to': '${sampleRecipient}',`,
        "        'body': 'Hello from Elite Message',",
        `        'referenceId': '${sampleReferenceId}',`,
        "        'priority': 1,",
        '    },',
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        '$payload = json_encode([',
        `    'to' => ${quotePhp(sampleRecipient)},`,
        "    'body' => 'Hello from Elite Message',",
        `    'referenceId' => ${quotePhp(sampleReferenceId)},`,
        "    'priority' => 1,",
        ']);',
        '',
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_POST => true,',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        "        'Content-Type: application/json',",
        '    ],',
        '    CURLOPT_POSTFIELDS => $payload,',
        ']);',
        '',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        'payload := strings.NewReader(`{"to":"' +
          sampleRecipient +
          '","body":"Hello from Elite Message","referenceId":"' +
          sampleReferenceId +
          '","priority":1}`)',
        `req, _ := http.NewRequest(http.MethodPost, "${endpoint}", payload)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'req.Header.Set("Content-Type", "application/json")',
        '',
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        '',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .header("Content-Type", "application/json")',
        '    .POST(HttpRequest.BodyPublishers.ofString("""',
        '{',
        `  "to": "${sampleRecipient}",`,
        '  "body": "Hello from Elite Message",',
        `  "referenceId": "${sampleReferenceId}",`,
        '  "priority": 1',
        '}',
        '"""))',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        '',
        'var payload = JsonSerializer.Serialize(new {',
        `    to = "${sampleRecipient}",`,
        '    body = "Hello from Elite Message",',
        `    referenceId = "${sampleReferenceId}",`,
        '    priority = 1',
        '});',
        '',
        `var response = await client.PostAsync("${endpoint}", new StringContent(payload, Encoding.UTF8, "application/json"));`,
        'var body = await response.Content.ReadAsStringAsync();',
        'Console.WriteLine(body);',
      ].join('\n');
  }
}

function buildImageSnippet(
  language: BackendLanguage,
  publicId: string,
  token: string,
) {
  const endpoint = buildPublicRoute(publicId, '/messages/image');

  switch (language) {
    case 'curl':
      return [
        `curl -X POST "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}" \\`,
        '  -H "content-type: application/json" \\',
        `  -d '{"to":"${sampleRecipient}","image":"${sampleImageUrl}","caption":"Launch asset","referenceId":"docs-image-001","priority":2}'`,
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        "  method: 'POST',",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "',",
        "    'Content-Type': 'application/json'",
        '  },',
        '  body: JSON.stringify({',
        `    to: '${sampleRecipient}',`,
        `    image: '${sampleImageUrl}',`,
        "    caption: 'Launch asset',",
        "    referenceId: 'docs-image-001',",
        '    priority: 2',
        '  })',
        '});',
        'console.log(await response.json());',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.post(`,
        `    '${endpoint}',`,
        '    headers={',
        `        'Authorization': 'Bearer ${token}',`,
        "        'Content-Type': 'application/json',",
        '    },',
        '    json={',
        `        'to': '${sampleRecipient}',`,
        `        'image': '${sampleImageUrl}',`,
        "        'caption': 'Launch asset',",
        "        'referenceId': 'docs-image-001',",
        "        'priority': 2,",
        '    },',
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        '$payload = json_encode([',
        `    'to' => ${quotePhp(sampleRecipient)},`,
        `    'image' => ${quotePhp(sampleImageUrl)},`,
        "    'caption' => 'Launch asset',",
        "    'referenceId' => 'docs-image-001',",
        "    'priority' => 2,",
        ']);',
        '',
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_POST => true,',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        "        'Content-Type: application/json',",
        '    ],',
        '    CURLOPT_POSTFIELDS => $payload,',
        ']);',
        '',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        'payload := strings.NewReader(`{"to":"' +
          sampleRecipient +
          '","image":"' +
          sampleImageUrl +
          '","caption":"Launch asset","referenceId":"docs-image-001","priority":2}`)',
        `req, _ := http.NewRequest(http.MethodPost, "${endpoint}", payload)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'req.Header.Set("Content-Type", "application/json")',
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .header("Content-Type", "application/json")',
        '    .POST(HttpRequest.BodyPublishers.ofString("""',
        '{',
        `  "to": "${sampleRecipient}",`,
        `  "image": "${sampleImageUrl}",`,
        '  "caption": "Launch asset",',
        '  "referenceId": "docs-image-001",',
        '  "priority": 2',
        '}',
        '"""))',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        '',
        'var payload = JsonSerializer.Serialize(new {',
        `    to = "${sampleRecipient}",`,
        `    image = "${sampleImageUrl}",`,
        '    caption = "Launch asset",',
        '    referenceId = "docs-image-001",',
        '    priority = 2',
        '});',
        '',
        `var response = await client.PostAsync("${endpoint}", new StringContent(payload, Encoding.UTF8, "application/json"));`,
        'Console.WriteLine(await response.Content.ReadAsStringAsync());',
      ].join('\n');
  }
}

function buildStatusSnippet(
  language: BackendLanguage,
  publicId: string,
  token: string,
) {
  const endpoint = buildPublicRoute(publicId, '/instance/status');

  switch (language) {
    case 'curl':
      return [
        `curl "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}"`,
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "'",
        '  }',
        '});',
        'console.log(await response.json());',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.get(`,
        `    '${endpoint}',`,
        `    headers={'Authorization': 'Bearer ${token}'},`,
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        '    ],',
        ']);',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        `req, _ := http.NewRequest(http.MethodGet, "${endpoint}", nil)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .GET()',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        `var response = await client.GetAsync("${endpoint}");`,
        'Console.WriteLine(await response.Content.ReadAsStringAsync());',
      ].join('\n');
  }
}

function buildListMessagesSnippet(
  language: BackendLanguage,
  publicId: string,
  token: string,
) {
  const endpoint = `${buildPublicRoute(publicId, '/messages')}?limit=20&status=sent&referenceId=${sampleReferenceId}`;

  switch (language) {
    case 'curl':
      return [
        `curl "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}"`,
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "'",
        '  }',
        '});',
        'console.log(await response.json());',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.get(`,
        `    '${endpoint}',`,
        `    headers={'Authorization': 'Bearer ${token}'},`,
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        '    ],',
        ']);',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        `req, _ := http.NewRequest(http.MethodGet, "${endpoint}", nil)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .GET()',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        `var response = await client.GetAsync("${endpoint}");`,
        'Console.WriteLine(await response.Content.ReadAsStringAsync());',
      ].join('\n');
  }
}

function buildAccountInstancesListSnippet(
  language: BackendLanguage,
  token: string,
) {
  const endpoint = `${buildAccountRoute('/instances')}?limit=20&status=active`;

  switch (language) {
    case 'curl':
      return [
        `curl "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}"`,
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "'",
        '  }',
        '});',
        'console.log(await response.json());',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.get(`,
        `    '${endpoint}',`,
        `    headers={'Authorization': 'Bearer ${token}'},`,
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        '    ],',
        ']);',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        `req, _ := http.NewRequest(http.MethodGet, "${endpoint}", nil)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .GET()',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        `var response = await client.GetAsync("${endpoint}");`,
        'Console.WriteLine(await response.Content.ReadAsStringAsync());',
      ].join('\n');
  }
}

function buildAccountInstancesCreateSnippet(
  language: BackendLanguage,
  token: string,
) {
  const endpoint = buildAccountRoute('/instances');

  switch (language) {
    case 'curl':
      return [
        `curl -X POST "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}" \\`,
        '  -H "content-type: application/json" \\',
        '  -d \'{"name":"Integration instance"}\'',
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        "  method: 'POST',",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "',",
        "    'Content-Type': 'application/json'",
        '  },',
        '  body: JSON.stringify({',
        "    name: 'Integration instance'",
        '  })',
        '});',
        'console.log(await response.json());',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.post(`,
        `    '${endpoint}',`,
        '    headers={',
        `        'Authorization': 'Bearer ${token}',`,
        "        'Content-Type': 'application/json',",
        '    },',
        '    json={',
        "        'name': 'Integration instance',",
        '    },',
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        '$payload = json_encode([',
        "    'name' => 'Integration instance',",
        ']);',
        '',
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_POST => true,',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        "        'Content-Type: application/json',",
        '    ],',
        '    CURLOPT_POSTFIELDS => $payload,',
        ']);',
        '',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        'payload := strings.NewReader(`{"name":"Integration instance"}`)',
        `req, _ := http.NewRequest(http.MethodPost, "${endpoint}", payload)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'req.Header.Set("Content-Type", "application/json")',
        '',
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        '',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .header("Content-Type", "application/json")',
        '    .POST(HttpRequest.BodyPublishers.ofString("""',
        '{',
        '  "name": "Integration instance"',
        '}',
        '"""))',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        '',
        'var payload = JsonSerializer.Serialize(new {',
        '    name = "Integration instance"',
        '});',
        '',
        `var response = await client.PostAsync("${endpoint}", new StringContent(payload, Encoding.UTF8, "application/json"));`,
        'Console.WriteLine(await response.Content.ReadAsStringAsync());',
      ].join('\n');
  }
}

function buildAccountInstancesUpdateSnippet(
  language: BackendLanguage,
  token: string,
) {
  const endpoint = `${buildAccountRoute('/instances')}/your-instance-id`;

  switch (language) {
    case 'curl':
      return [
        `curl -X PATCH "${endpoint}" \\`,
        `  -H "Authorization: Bearer ${token}" \\`,
        '  -H "content-type: application/json" \\',
        '  -d \'{"name":"Renamed integration instance"}\'',
      ].join('\n');
    case 'node':
      return [
        "const response = await fetch('" + endpoint + "', {",
        "  method: 'PATCH',",
        '  headers: {',
        "    'Authorization': 'Bearer " + token + "',",
        "    'Content-Type': 'application/json'",
        '  },',
        '  body: JSON.stringify({',
        "    name: 'Renamed integration instance'",
        '  })',
        '});',
        'console.log(await response.json());',
      ].join('\n');
    case 'python':
      return [
        'import requests',
        '',
        `response = requests.patch(`,
        `    '${endpoint}',`,
        '    headers={',
        `        'Authorization': 'Bearer ${token}',`,
        "        'Content-Type': 'application/json',",
        '    },',
        '    json={',
        "        'name': 'Renamed integration instance',",
        '    },',
        ')',
        'print(response.json())',
      ].join('\n');
    case 'php':
      return [
        '$payload = json_encode([',
        "    'name' => 'Renamed integration instance',",
        ']);',
        '',
        `$ch = curl_init(${quotePhp(endpoint)});`,
        'curl_setopt_array($ch, [',
        '    CURLOPT_CUSTOMREQUEST => "PATCH",',
        '    CURLOPT_RETURNTRANSFER => true,',
        '    CURLOPT_HTTPHEADER => [',
        `        'Authorization: Bearer ${token}',`,
        "        'Content-Type: application/json',",
        '    ],',
        '    CURLOPT_POSTFIELDS => $payload,',
        ']);',
        '',
        '$response = curl_exec($ch);',
        'curl_close($ch);',
        'echo $response;',
      ].join('\n');
    case 'go':
      return [
        'payload := strings.NewReader(`{"name":"Renamed integration instance"}`)',
        `req, _ := http.NewRequest(http.MethodPatch, "${endpoint}", payload)`,
        `req.Header.Set("Authorization", "Bearer ${token}")`,
        'req.Header.Set("Content-Type", "application/json")',
        '',
        'resp, err := http.DefaultClient.Do(req)',
        'if err != nil {',
        '    log.Fatal(err)',
        '}',
        'defer resp.Body.Close()',
        '',
        'body, _ := io.ReadAll(resp.Body)',
        'fmt.Println(string(body))',
      ].join('\n');
    case 'java':
      return [
        'HttpRequest request = HttpRequest.newBuilder()',
        `    .uri(URI.create("${endpoint}"))`,
        '    .header("Authorization", "Bearer ' + token + '")',
        '    .header("Content-Type", "application/json")',
        '    .method("PATCH", HttpRequest.BodyPublishers.ofString("""',
        '{',
        '  "name": "Renamed integration instance"',
        '}',
        '"""))',
        '    .build();',
        '',
        'HttpResponse<String> response = HttpClient.newHttpClient()',
        '    .send(request, HttpResponse.BodyHandlers.ofString());',
        'System.out.println(response.body());',
      ].join('\n');
    case 'csharp':
      return [
        'using var client = new HttpClient();',
        `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "${token}");`,
        '',
        'var payload = JsonSerializer.Serialize(new {',
        '    name = "Renamed integration instance"',
        '});',
        '',
        `var request = new HttpRequestMessage(HttpMethod.Patch, "${endpoint}") { Content = new StringContent(payload, Encoding.UTF8, "application/json") };`,
        'Console.WriteLine(await (await client.SendAsync(request)).Content.ReadAsStringAsync());',
      ].join('\n');
  }
}

function buildWebhookReceiverSnippet(language: BackendLanguage) {
  const verifyLine = 'See the signature verification example below.';

  switch (language) {
    case 'curl':
      return [
        '# Webhooks are delivered to your own HTTPS endpoint, not to Elite Message.',
        '# Example target: https://your-app.example.com/webhooks/elite-message',
        '# Send a 200 response after you validate and persist the payload.',
        '#',
        verifyLine,
      ].join('\n');
    case 'node':
      return [
        "import express from 'express';",
        '',
        'const app = express();',
        "app.use(express.json({ type: 'application/json' }));",
        '',
        "app.post('/webhooks/elite-message', async (req, res) => {",
        "  const deliveryId = req.header('x-elite-message-delivery-id');",
        "  const eventType = req.header('x-elite-message-event');",
        "  const instancePublicId = req.header('x-elite-message-instance-public-id');",
        "  const timestamp = req.header('x-elite-message-timestamp');",
        "  const signature = req.header('x-elite-message-signature');",
        '  const payload = req.body;',
        '',
        '  console.log({ deliveryId, eventType, instancePublicId, timestamp, signature, payload });',
        '',
        '  res.sendStatus(200);',
        '});',
      ].join('\n');
    case 'python':
      return [
        'from flask import Flask, request',
        '',
        'app = Flask(__name__)',
        '',
        "@app.post('/webhooks/elite-message')",
        'def webhook():',
        "    delivery_id = request.headers.get('x-elite-message-delivery-id')",
        "    event_type = request.headers.get('x-elite-message-event')",
        "    instance_public_id = request.headers.get('x-elite-message-instance-public-id')",
        "    timestamp = request.headers.get('x-elite-message-timestamp')",
        "    signature = request.headers.get('x-elite-message-signature')",
        '    payload = request.get_json(silent=True) or {}',
        '',
        '    print({',
        "        'delivery_id': delivery_id,",
        "        'event_type': event_type,",
        "        'instance_public_id': instance_public_id,",
        "        'timestamp': timestamp,",
        "        'signature': signature,",
        "        'payload': payload,",
        '    })',
        '',
        "    return {'ok': True}",
      ].join('\n');
    case 'php':
      return [
        "$deliveryId = $_SERVER['HTTP_X_ELITE_MESSAGE_DELIVERY_ID'] ?? null;",
        "$eventType = $_SERVER['HTTP_X_ELITE_MESSAGE_EVENT'] ?? null;",
        "$instancePublicId = $_SERVER['HTTP_X_ELITE_MESSAGE_INSTANCE_PUBLIC_ID'] ?? null;",
        "$timestamp = $_SERVER['HTTP_X_ELITE_MESSAGE_TIMESTAMP'] ?? null;",
        "$signature = $_SERVER['HTTP_X_ELITE_MESSAGE_SIGNATURE'] ?? null;",
        "$payload = json_decode(file_get_contents('php://input'), true) ?: [];",
        '',
        "error_log(json_encode(compact('deliveryId', 'eventType', 'instancePublicId', 'timestamp', 'signature', 'payload')));",
        'http_response_code(200);',
      ].join('\n');
    case 'go':
      return [
        'http.HandleFunc("/webhooks/elite-message", func(w http.ResponseWriter, r *http.Request) {',
        '    body, _ := io.ReadAll(r.Body)',
        '    defer r.Body.Close()',
        '',
        '    payload := map[string]any{',
        '        "deliveryId": r.Header.Get("x-elite-message-delivery-id"),',
        '        "eventType": r.Header.Get("x-elite-message-event"),',
        '        "instancePublicId": r.Header.Get("x-elite-message-instance-public-id"),',
        '        "timestamp": r.Header.Get("x-elite-message-timestamp"),',
        '        "signature": r.Header.Get("x-elite-message-signature"),',
        '        "payload": string(body),',
        '    }',
        '    fmt.Println(payload)',
        '',
        '    w.WriteHeader(http.StatusOK)',
        '})',
      ].join('\n');
    case 'java':
      return [
        'HttpServer.create(new InetSocketAddress(8080), 0)',
        '    .createContext("/webhooks/elite-message", exchange -> {',
        '        String deliveryId = exchange.getRequestHeaders().getFirst("x-elite-message-delivery-id");',
        '        String eventType = exchange.getRequestHeaders().getFirst("x-elite-message-event");',
        '        String instancePublicId = exchange.getRequestHeaders().getFirst("x-elite-message-instance-public-id");',
        '        String timestamp = exchange.getRequestHeaders().getFirst("x-elite-message-timestamp");',
        '        String signature = exchange.getRequestHeaders().getFirst("x-elite-message-signature");',
        '        String payload = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);',
        '        System.out.println(payload);',
        '        exchange.sendResponseHeaders(200, 0);',
        '        exchange.close();',
        '    })',
        '    .start();',
      ].join('\n');
    case 'csharp':
      return [
        'app.MapPost("/webhooks/elite-message", async (HttpRequest request) =>',
        '{',
        '    var deliveryId = request.Headers["x-elite-message-delivery-id"].ToString();',
        '    var eventType = request.Headers["x-elite-message-event"].ToString();',
        '    var instancePublicId = request.Headers["x-elite-message-instance-public-id"].ToString();',
        '    var timestamp = request.Headers["x-elite-message-timestamp"].ToString();',
        '    var signature = request.Headers["x-elite-message-signature"].ToString();',
        '',
        '    using var reader = new StreamReader(request.Body);',
        '    var payload = await reader.ReadToEndAsync();',
        '',
        '    Console.WriteLine(payload);',
        '    return Results.Ok(new { deliveryId, eventType, instancePublicId, timestamp, signature });',
        '});',
      ].join('\n');
  }
}

function buildWebhookVerificationSnippet(language: BackendLanguage) {
  const secret = 'WEBHOOK_SECRET';

  switch (language) {
    case 'curl':
      return [
        '# cURL only receives webhooks; verification happens in your app server.',
        '# Compare the x-elite-message-signature header against:',
        `# v1=HMAC_SHA256("${secret}", "${'timestamp'}.${'raw_body'}")`,
      ].join('\n');
    case 'node':
      return [
        "import { createHmac, timingSafeEqual } from 'node:crypto';",
        '',
        'function verifyWebhook(rawBody, timestamp, signatureHeader) {',
        `  const expected = 'v1=' + createHmac('sha256', process.env.${secret} ?? '')`,
        '    .update(`${timestamp}.${rawBody}`)',
        "    .digest('hex');",
        '  const expectedBuffer = Buffer.from(expected);',
        "  const receivedBuffer = Buffer.from(signatureHeader ?? '');",
        '  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);',
        '}',
      ].join('\n');
    case 'python':
      return [
        'import hmac',
        'import hashlib',
        '',
        'def verify_webhook(raw_body: str, timestamp: str, signature_header: str, webhook_secret: str) -> bool:',
        "    expected = 'v1=' + hmac.new(",
        "        webhook_secret.encode('utf-8'),",
        "        f'{timestamp}.{raw_body}'.encode('utf-8'),",
        '        hashlib.sha256,',
        '    ).hexdigest()',
        "    return hmac.compare_digest(expected, signature_header or '')",
      ].join('\n');
    case 'php':
      return [
        'function verifyWebhook(string $rawBody, string $timestamp, ?string $signatureHeader, string $webhookSecret): bool {',
        "    $expected = 'v1=' . hash_hmac('sha256', $timestamp . '.' . $rawBody, $webhookSecret);",
        "    return hash_equals($expected, $signatureHeader ?? '');",
        '}',
      ].join('\n');
    case 'go':
      return [
        'func verifyWebhook(rawBody []byte, timestamp string, signatureHeader string, webhookSecret string) bool {',
        '    mac := hmac.New(sha256.New, []byte(webhookSecret))',
        '    mac.Write([]byte(timestamp + "." + string(rawBody)))',
        '    expected := "v1=" + hex.EncodeToString(mac.Sum(nil))',
        '    return hmac.Equal([]byte(expected), []byte(signatureHeader))',
        '}',
      ].join('\n');
    case 'java':
      return [
        'boolean verifyWebhook(String rawBody, String timestamp, String signatureHeader, String webhookSecret) throws Exception {',
        '    Mac mac = Mac.getInstance("HmacSHA256");',
        '    mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));',
        '    String message = timestamp + "." + rawBody;',
        '    byte[] expectedBytes = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));',
        '    String expected = "v1=" + HexFormat.of().formatHex(expectedBytes);',
        '    return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), (signatureHeader == null ? "" : signatureHeader).getBytes(StandardCharsets.UTF_8));',
        '}',
      ].join('\n');
    case 'csharp':
      return [
        'bool VerifyWebhook(string rawBody, string timestamp, string? signatureHeader, string webhookSecret)',
        '{',
        '    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(webhookSecret));',
        '    var messageBytes = Encoding.UTF8.GetBytes($"{timestamp}.{rawBody}");',
        '    var expected = "v1=" + Convert.ToHexString(hmac.ComputeHash(messageBytes)).ToLowerInvariant();',
        '    var received = Encoding.UTF8.GetBytes(signatureHeader ?? string.Empty);',
        '    return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), received);',
        '}',
      ].join('\n');
  }
}

function EndpointCopyRow({
  label,
  endpoint,
}: {
  label: string;
  endpoint: string;
}) {
  const { locale } = useCustomerLocale();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );

  async function copyEndpoint() {
    const copied = await copyText(endpoint);
    setCopyStatus(copied ? 'copied' : 'failed');
  }

  return (
    <div className="elite-list-item">
      <div className="elite-list-title" style={{ alignItems: 'flex-start' }}>
        <span>{label}</span>
        <ActionButton
          type="button"
          tone="secondary"
          size="compact"
          onClick={() => void copyEndpoint()}
        >
          {locale === 'ar' ? 'نسخ الرابط' : 'Copy endpoint'}
        </ActionButton>
      </div>
      <code style={{ overflowWrap: 'anywhere' }}>{endpoint}</code>
      {copyStatus === 'copied' ? (
        <p style={{ margin: 0, color: 'var(--elite-success-ink)' }}>
          {locale === 'ar' ? 'تم نسخ الرابط.' : 'Endpoint copied.'}
        </p>
      ) : null}
      {copyStatus === 'failed' ? (
        <p style={{ margin: 0, color: 'var(--elite-danger-ink)' }}>
          {locale === 'ar'
            ? 'تعذر النسخ تلقائيًا.'
            : 'Could not copy automatically.'}
        </p>
      ) : null}
    </div>
  );
}

function SnippetCard({
  eyebrow,
  title,
  snippet,
  description,
}: {
  eyebrow: string;
  title: string;
  snippet: string;
  description?: string;
}) {
  const { locale } = useCustomerLocale();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );

  return (
    <InfoCard
      eyebrow={eyebrow}
      title={title}
      action={
        <ActionButton
          type="button"
          tone="secondary"
          size="compact"
          onClick={() => {
            void copyText(snippet).then((copied) =>
              setCopyStatus(copied ? 'copied' : 'failed'),
            );
          }}
        >
          {locale === 'ar' ? 'نسخ المقتطف' : 'Copy snippet'}
        </ActionButton>
      }
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {description ? (
          <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
            {description}
          </p>
        ) : null}
        {copyStatus === 'copied' ? (
          <p style={{ margin: 0, color: 'var(--elite-success-ink)' }}>
            {locale === 'ar' ? 'تم النسخ.' : 'Copied.'}
          </p>
        ) : null}
        {copyStatus === 'failed' ? (
          <p style={{ margin: 0, color: 'var(--elite-danger-ink)' }}>
            {locale === 'ar'
              ? 'تعذر النسخ تلقائيًا.'
              : 'Could not copy automatically.'}
          </p>
        ) : null}
        <pre className="elite-mono-panel">{snippet}</pre>
      </div>
    </InfoCard>
  );
}

function CodeExampleCard({
  eyebrow,
  title,
  endpoint,
  snippet,
}: {
  eyebrow: string;
  title: string;
  endpoint: string;
  snippet: string;
}) {
  const { locale } = useCustomerLocale();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );

  async function copySnippet() {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setCopyStatus('failed');
      return;
    }

    try {
      await navigator.clipboard.writeText(snippet);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  return (
    <InfoCard
      eyebrow={eyebrow}
      title={title}
      action={
        <div className="elite-toolbar">
          <ActionButton
            type="button"
            tone="secondary"
            size="compact"
            onClick={() => {
              void copyText(endpoint).then((copied) =>
                setCopyStatus(copied ? 'copied' : 'failed'),
              );
            }}
          >
            {locale === 'ar' ? 'نسخ الرابط' : 'Copy endpoint'}
          </ActionButton>
          <ActionButton
            type="button"
            tone="secondary"
            size="compact"
            onClick={() => void copySnippet()}
          >
            {locale === 'ar' ? 'نسخ المقتطف' : 'Copy snippet'}
          </ActionButton>
        </div>
      }
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
          <code>{endpoint}</code>
        </p>
        {copyStatus === 'copied' ? (
          <p style={{ margin: 0, color: 'var(--elite-success-ink)' }}>
            {locale === 'ar' ? 'تم النسخ.' : 'Copied.'}
          </p>
        ) : null}
        {copyStatus === 'failed' ? (
          <p style={{ margin: 0, color: 'var(--elite-danger-ink)' }}>
            {locale === 'ar'
              ? 'تعذر النسخ تلقائيًا.'
              : 'Could not copy automatically.'}
          </p>
        ) : null}
        <pre className="elite-mono-panel">{snippet}</pre>
      </div>
    </InfoCard>
  );
}

export function CustomerApiDocumentsPage() {
  const { locale } = useCustomerLocale();
  const mountedRef = useRef(true);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [, setAccessToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountMeResponse | null>(null);
  const [instances, setInstances] = useState<
    ListCustomerInstancesResponse['items']
  >([]);
  const [workspaceId, setWorkspaceId] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [language, setLanguage] = useState<BackendLanguage>('python');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === 'ar'
      ? {
          apiDocuments: 'مستندات API',
          backToDashboard: 'العودة إلى لوحة التحكم',
          createInstanceFirst: 'أنشئ مثيلًا قبل استخدام API',
          createInstanceFirstBody:
            'تستخدم الأمثلة أدناه قيمًا افتراضية حتى تحتوي مساحة العمل النشطة على مثيل.',
          dashboardLogin: 'العودة إلى تسجيل الدخول في لوحة التحكم',
          developerApi: 'واجهة API للمطور',
          docsIssue: 'مشكلة في مستندات API',
          examples: 'الأمثلة',
          fullTokenUnavailable: 'الرمز الكامل غير متاح في جلسة المتصفح هذه',
          instance: 'المثيل',
          loadingApiReference: 'جارٍ تحميل مرجع API',
          loadingMessage:
            'يتم تحديث جلسة العميل وتحميل مثيلات مساحة العمل للأمثلة المباشرة.',
          noWorkspaceInstances: 'لا توجد مثيلات في مساحة العمل',
          openInstanceDetail: 'افتح تفاصيل المثيل',
          quickStart: 'بداية سريعة',
          quickStartTitle: 'من إنشاء المثيل إلى استدعاءات API',
          referenceValues: 'القيم المرجعية للمقتطفات أدناه',
          sessionMissing: 'جلسة العميل مفقودة أو منتهية الصلاحية.',
          signInRequired: 'يجب تسجيل الدخول',
          subtitle:
            'استخدم واجهة API العامة الخاصة بكل مثيل بعد إنشاء المثيل وربط واتساب. تُنشأ الأمثلة أدناه من مثيل مساحة العمل المحددة عندما يكون هناك رمز كامل محفوظ في جلسة المتصفح هذه.',
          tokenWarning:
            'يعيد Elite Message الرمز الكامل للمثيل فقط عند الإنشاء أو التدوير. افتح صفحة تفاصيل المثيل ودوّر الرمز إذا احتجت إلى قيمة كاملة جديدة لهذه الأمثلة.',
          workspace: 'مساحة العمل',
        }
      : {
          apiDocuments: 'API Documents',
          backToDashboard: 'Back to dashboard',
          createInstanceFirst: 'Create an instance before using the API',
          createInstanceFirstBody:
            'The examples below use placeholders until the active workspace has an instance.',
          dashboardLogin: 'Return to the dashboard login',
          developerApi: 'Developer API',
          docsIssue: 'API documents issue',
          examples: 'Examples',
          fullTokenUnavailable:
            'Full token not available in this browser session',
          instance: 'Instance',
          loadingApiReference: 'Loading API reference',
          loadingMessage:
            'Refreshing the customer session and loading workspace instances for the live examples.',
          noWorkspaceInstances: 'No workspace instances',
          openInstanceDetail: 'Open instance detail',
          quickStart: 'Quick start',
          quickStartTitle: 'From instance creation to API calls',
          referenceValues: 'Reference values for the snippets below',
          sessionMissing: 'The customer session is missing or expired.',
          signInRequired: 'Sign in required',
          subtitle:
            'Use the public per-instance API after instance creation and WhatsApp linking. The examples below are generated from the selected workspace instance when a saved full token is available in this browser session.',
          tokenWarning:
            'Elite Message only returns the full instance token on creation or rotation. Open the instance detail page and rotate the token if you need a fresh full value for these examples.',
          workspace: 'Workspace',
        };

  function handleLoadFailure(message: string) {
    if (!mountedRef.current) {
      return;
    }

    if (pageState === 'ready' && account) {
      setErrorMessage(message);
      return;
    }

    setPageState('unauthenticated');
    setErrorMessage(message);
  }

  const loadPage = useEffectEvent(async (token: string) => {
    const [me, instanceResponse] = await Promise.all([
      loadCustomerAccount(token),
      requestWithCustomerRefresh(
        token,
        (bearer) =>
          fetch(`${apiBaseUrl}/api/v1/customer/instances`, {
            headers: {
              authorization: `Bearer ${bearer}`,
            },
            credentials: 'include',
          }),
        setAccessToken,
      ),
    ]);

    if (!me || !instanceResponse) {
      handleLoadFailure(
        locale === 'ar'
          ? 'تعذر الوصول إلى API الخاص بالعميل.'
          : 'Could not reach the customer API.',
      );
      return false;
    }

    if (!instanceResponse.ok) {
      handleLoadFailure(
        locale === 'ar'
          ? 'تعذر تحميل مستندات API الخاصة بالعميل.'
          : 'Could not load customer API documents.',
      );
      return false;
    }

    const instancePayload =
      (await instanceResponse.json()) as ListCustomerInstancesResponse;
    if (!mountedRef.current) {
      return false;
    }

    const nextWorkspaceId = me.workspaces[0]?.id ?? '';
    setAccessToken(token);
    setAccount(me);
    setInstances(instancePayload.items);
    setWorkspaceId((current) =>
      current && me.workspaces.some((workspace) => workspace.id === current)
        ? current
        : nextWorkspaceId,
    );
    setPageState('ready');
    return true;
  });

  useEffect(() => {
    mountedRef.current = true;
    void (async () => {
      setErrorMessage(null);

      const storedToken = readStoredToken();
      if (storedToken) {
        const loaded = await loadPage(storedToken);
        if (loaded) {
          return;
        }
      }

      const token = await refreshCustomerAccessToken(setAccessToken);
      if (!token) {
        if (mountedRef.current) {
          setPageState('unauthenticated');
        }
        return;
      }

      await loadPage(token);
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!account?.workspaces.length) {
      return;
    }

    if (account.workspaces.some((workspace) => workspace.id === workspaceId)) {
      return;
    }

    setWorkspaceId(account.workspaces[0]!.id);
  }, [account, workspaceId]);

  const workspaceInstances = useMemo(
    () =>
      instances.filter(
        (instance) => !workspaceId || instance.workspaceId === workspaceId,
      ),
    [instances, workspaceId],
  );

  useEffect(() => {
    if (!workspaceInstances.length) {
      setInstanceId('');
      return;
    }

    if (workspaceInstances.some((instance) => instance.id === instanceId)) {
      return;
    }

    const storedMatch = workspaceInstances.find(
      (instance) => readInstanceCredentials(instance.id)?.token,
    );
    setInstanceId((storedMatch ?? workspaceInstances[0])!.id);
  }, [instanceId, workspaceInstances]);

  async function logout() {
    await logoutCustomerSession();
    if (!mountedRef.current) {
      return;
    }

    setPageState('unauthenticated');
    setAccessToken(null);
    setAccount(null);
    setInstances([]);
    setErrorMessage(null);
  }

  const selectedInstance =
    workspaceInstances.find((instance) => instance.id === instanceId) ??
    workspaceInstances[0] ??
    null;
  const selectedCredentials = selectedInstance
    ? readInstanceCredentials(selectedInstance.id)
    : null;
  const selectedWorkspace =
    account?.workspaces.find((workspace) => workspace.id === workspaceId) ??
    account?.workspaces[0] ??
    null;
  const activeWorkspaceId =
    selectedWorkspace?.id ?? workspaceId ?? 'workspace-id';
  const publicId =
    selectedCredentials?.publicId ??
    selectedInstance?.publicId ??
    'your-instance-public-id';
  const token = selectedCredentials?.token ?? 'your-instance-token';
  const hasSavedToken = Boolean(selectedCredentials?.token);
  const languageLabel =
    backendLanguages.find((entry) => entry.value === language)?.label ??
    'Python';

  const chatSnippet = buildChatSnippet(language, publicId, token);
  const imageSnippet = buildImageSnippet(language, publicId, token);
  const statusSnippet = buildStatusSnippet(language, publicId, token);
  const listMessagesSnippet = buildListMessagesSnippet(
    language,
    publicId,
    token,
  );
  const accountInstancesListSnippet = buildAccountInstancesListSnippet(
    language,
    sampleAccountApiToken,
  );
  const accountInstancesCreateSnippet = buildAccountInstancesCreateSnippet(
    language,
    sampleAccountApiToken,
  );
  const accountInstancesUpdateSnippet = buildAccountInstancesUpdateSnippet(
    language,
    sampleAccountApiToken,
  );
  const webhookPayloadExample = buildWebhookPayloadExample(
    selectedInstance?.id ?? 'your-instance-id',
    publicId,
  );
  const webhookReceiverSnippet = buildWebhookReceiverSnippet(language);
  const webhookVerificationSnippet = buildWebhookVerificationSnippet(language);
  const accountTokensListEndpoint = `${apiBaseUrl}/api/v1/account/api-tokens?workspaceId=${encodeURIComponent(activeWorkspaceId)}`;
  const accountTokensCreateEndpoint = `${apiBaseUrl}/api/v1/account/api-tokens`;
  const accountTokensRotateEndpoint = `${apiBaseUrl}/api/v1/account/api-tokens/{tokenId}/rotate`;

  return (
    <AppShell
      title={copy.apiDocuments}
      subtitle={copy.subtitle}
      breadcrumbLabel={copy.apiDocuments}
      surface="customer"
      density="compact"
      labels={getCustomerShellLabels(locale)}
      nav={
        pageState === 'ready' ? (
          <CustomerNav
            current="api-docs"
            account={account}
            workspaceId={workspaceId}
          />
        ) : undefined
      }
      meta={
        account ? (
          <CustomerTopbarAnnouncement
            eyebrow={copy.developerApi}
            message={
              locale === 'ar'
                ? 'أرسل الرسائل من خدمتك الخلفية باستخدام معرّف المثيل العام والرمز.'
                : 'Send messages from your backend with the instance public ID and token.'
            }
            linkLabel={
              selectedInstance ? copy.openInstanceDetail : copy.backToDashboard
            }
            linkHref={
              selectedInstance ? `/instances/${selectedInstance.id}` : '/'
            }
          />
        ) : undefined
      }
      headerActions={
        pageState === 'ready' && account ? (
          <CustomerWorkspaceControls
            account={account}
            workspaceId={workspaceId}
            onWorkspaceChange={setWorkspaceId}
            onLogout={logout}
          />
        ) : undefined
      }
      footer={<Link href="/dashboard">{copy.backToDashboard}</Link>}
    >
      {pageState === 'loading' ? (
        <InfoCard
          eyebrow={locale === 'ar' ? 'المستندات' : 'Docs'}
          title={copy.loadingApiReference}
        >
          <p style={{ margin: 0 }}>{copy.loadingMessage}</p>
        </InfoCard>
      ) : null}

      {pageState === 'unauthenticated' ? (
        <InfoCard
          eyebrow={locale === 'ar' ? 'الجلسة' : 'Session'}
          title={copy.signInRequired}
        >
          <p style={{ marginTop: 0 }}>{copy.sessionMissing}</p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/signin">{copy.dashboardLogin}</Link>
          </p>
        </InfoCard>
      ) : null}

      {pageState === 'ready' && account ? (
        <>
          <InfoCard eyebrow={copy.quickStart} title={copy.quickStartTitle}>
            <div style={{ display: 'grid', gap: 16 }}>
              <DefinitionGrid
                minItemWidth={180}
                items={[
                  {
                    label: locale === 'ar' ? 'الرابط الأساسي' : 'Base URL',
                    value: apiBaseUrl,
                    tone: 'info',
                  },
                  {
                    label: copy.workspace,
                    value:
                      selectedWorkspace?.name ??
                      (locale === 'ar'
                        ? 'لم يتم اختيار مساحة عمل'
                        : 'No workspace selected'),
                  },
                  {
                    label:
                      locale === 'ar' ? 'معرّف مثيل API' : 'API instance ID',
                    value: publicId,
                    tone: hasSavedToken ? 'success' : 'neutral',
                  },
                  {
                    label:
                      locale === 'ar' ? 'طريقة إرسال الرمز' : 'Token transport',
                    value: 'Authorization: Bearer or ?token=',
                    tone: 'neutral',
                  },
                ]}
              />
              <ol
                style={{
                  margin: 0,
                  paddingInlineStart: 18,
                  display: 'grid',
                  gap: 8,
                }}
              >
                <li>
                  {locale === 'ar'
                    ? 'أنشئ مثيلًا من لوحة تحكم العميل.'
                    : 'Create an instance from the customer dashboard.'}
                </li>
                <li>
                  {locale === 'ar'
                    ? 'افتح صفحة تشغيل المثيل واربط حساب واتساب حتى تصبح الحالة موثّقة.'
                    : 'Open the instance runtime page and link the WhatsApp account until the status becomes authenticated.'}
                </li>
                <li>
                  {locale === 'ar'
                    ? 'انسخ معرّف مثيل API والرمز من بطاقة وصول API أو دوّر الرمز لإظهار قيمة كاملة جديدة.'
                    : 'Copy the API instance ID and token from the API access card or rotate the token to reveal a fresh full value.'}
                </li>
                <li>
                  {locale === 'ar' ? (
                    <>
                      استدعِ المسارات العامة الخاصة بكل مثيل عند{' '}
                      <code>/instance/{'{instanceId}'}</code> من خدمتك الخلفية.
                    </>
                  ) : (
                    <>
                      Call the public per-instance routes at{' '}
                      <code>/instance/{'{instanceId}'}</code> from your backend
                      service.
                    </>
                  )}
                </li>
              </ol>
            </div>
          </InfoCard>

          <InfoCard eyebrow={copy.examples} title={copy.referenceValues}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div
                style={{
                  display: 'grid',
                  gap: 16,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                }}
              >
                <Field label={copy.workspace}>
                  <SelectInput
                    value={workspaceId}
                    onChange={(event) => setWorkspaceId(event.target.value)}
                  >
                    {account.workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {workspace.name} (
                        {translateCustomerEnum(locale, workspace.role)})
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label={copy.instance}>
                  <SelectInput
                    value={selectedInstance?.id ?? ''}
                    onChange={(event) => setInstanceId(event.target.value)}
                    disabled={workspaceInstances.length === 0}
                  >
                    {workspaceInstances.length === 0 ? (
                      <option value="">{copy.noWorkspaceInstances}</option>
                    ) : null}
                    {workspaceInstances.map((instance) => (
                      <option key={instance.id} value={instance.id}>
                        {instance.name} ({instance.publicId})
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <div className="elite-toolbar">
                {backendLanguages.map((entry) => (
                  <ActionButton
                    key={entry.value}
                    type="button"
                    tone={entry.value === language ? 'primary' : 'secondary'}
                    size="compact"
                    onClick={() => setLanguage(entry.value)}
                  >
                    {entry.label}
                  </ActionButton>
                ))}
              </div>

              {!selectedInstance ? (
                <NoticeBanner title={copy.createInstanceFirst} tone="warning">
                  <p style={{ margin: 0 }}>{copy.createInstanceFirstBody}</p>
                </NoticeBanner>
              ) : null}

              {selectedInstance && !hasSavedToken ? (
                <NoticeBanner title={copy.fullTokenUnavailable} tone="warning">
                  <p style={{ marginTop: 0 }}>{copy.tokenWarning}</p>
                  <p style={{ marginBottom: 0 }}>
                    {locale === 'ar'
                      ? 'تستخدم المقتطفات الحالية قيمًا افتراضية للرمز لكنها تحتفظ بمعرّف مثيل API العام الحقيقي.'
                      : 'The current snippets use placeholders for the token but keep the real public API instance ID.'}
                  </p>
                </NoticeBanner>
              ) : null}

              {selectedInstance &&
              selectedInstance.status !== 'authenticated' ? (
                <NoticeBanner
                  title={
                    locale === 'ar'
                      ? 'لا يزال المثيل يحتاج إلى مصادقة واتساب'
                      : 'Instance still needs WhatsApp authentication'
                  }
                  tone="warning"
                >
                  <p style={{ margin: 0 }}>
                    {locale === 'ar'
                      ? 'مسارات التشغيل والحالة متاحة، لكن استدعاءات إرسال الرسائل يجب أن تنتظر حتى يتم ربط المثيل ومصادقته.'
                      : 'Runtime and status routes are available, but send-message calls should wait until the instance is linked and authenticated.'}
                  </p>
                </NoticeBanner>
              ) : null}

              <SnippetCard
                eyebrow={locale === 'ar' ? 'معاينة مباشرة' : 'Live preview'}
                title={
                  locale === 'ar'
                    ? `مثال ${languageLabel} المحدد`
                    : `Selected ${languageLabel} example`
                }
                description={
                  locale === 'ar'
                    ? 'يتم تحديث هذه المعاينة عند تغيير مساحة العمل أو المثيل أو لغة الخلفية.'
                    : 'This preview updates as you change the workspace, instance, or backend language.'
                }
                snippet={chatSnippet}
              />
            </div>
          </InfoCard>

          {selectedInstance ? (
            <InstanceApiAccessCard
              eyebrow={locale === 'ar' ? 'المثيل المحدد' : 'Selected instance'}
              title={
                locale === 'ar'
                  ? 'وصول API المباشر للمثيل'
                  : 'Live instance API access'
              }
              instanceId={selectedInstance.id}
              publicId={publicId}
              instanceName={selectedInstance.name}
              token={selectedCredentials?.token ?? null}
              connected={selectedInstance.status === 'authenticated'}
              lastAuthenticatedAt={selectedInstance.latestEventAt}
              lastStatusLabel={locale === 'ar' ? 'آخر حدث' : 'Latest event'}
              detailHref={`/instances/${selectedInstance.id}`}
            />
          ) : null}

          <InfoCard
            eyebrow={locale === 'ar' ? 'المصادقة' : 'Authentication'}
            title={
              locale === 'ar'
                ? 'كيفية مصادقة خدمتك الخلفية'
                : 'How to authenticate your backend'
            }
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <p style={{ margin: 0 }}>
                {locale === 'ar' ? (
                  <>
                    استخدم <strong>معرّف المثيل العام</strong> في مسار الطلب و
                    <strong>رمز المثيل</strong> إما كرمز bearer أو كمعامل توافق
                    في الاستعلام.
                  </>
                ) : (
                  <>
                    Use the <strong>instance public ID</strong> in the route
                    path and the <strong>instance token</strong> as either a
                    bearer token or a compatibility query string.
                  </>
                )}
              </p>
              <DefinitionGrid
                minItemWidth={220}
                items={[
                  {
                    label:
                      locale === 'ar' ? 'المصادقة المفضلة' : 'Preferred auth',
                    value: 'Authorization: Bearer {instance_token}',
                    tone: 'success',
                  },
                  {
                    label:
                      locale === 'ar' ? 'مصادقة التوافق' : 'Compatibility auth',
                    value: '?token={instance_token}',
                    tone: 'info',
                  },
                  {
                    label: locale === 'ar' ? 'نمط المسار' : 'Route pattern',
                    value: `/instance/${publicId}`,
                    tone: 'neutral',
                  },
                  {
                    label:
                      locale === 'ar' ? 'اللغة المحددة' : 'Selected language',
                    value: languageLabel,
                    tone: 'neutral',
                  },
                ]}
              />
              <pre className="elite-mono-panel">{`GET ${buildPublicRoute(publicId, '/instance/status')}?token=${token}`}</pre>
            </div>
          </InfoCard>

          <CodeExampleCard
            eyebrow="Send chat"
            title="POST /instance/{instanceId}/messages/chat"
            endpoint={buildPublicRoute(publicId, '/messages/chat')}
            snippet={chatSnippet}
          />

          <CodeExampleCard
            eyebrow="Send image"
            title="POST /instance/{instanceId}/messages/image"
            endpoint={buildPublicRoute(publicId, '/messages/image')}
            snippet={imageSnippet}
          />

          <CodeExampleCard
            eyebrow="Status"
            title="GET /instance/{instanceId}/instance/status"
            endpoint={buildPublicRoute(publicId, '/instance/status')}
            snippet={statusSnippet}
          />

          <CodeExampleCard
            eyebrow="Logs"
            title="GET /instance/{instanceId}/messages"
            endpoint={`${buildPublicRoute(publicId, '/messages')}?limit=20&status=sent&referenceId=${sampleReferenceId}`}
            snippet={listMessagesSnippet}
          />

          <InfoCard
            eyebrow={locale === 'ar' ? 'ملاحظات' : 'Notes'}
            title={
              locale === 'ar'
                ? 'قواعد تكامل عملية'
                : 'Practical integration rules'
            }
          >
            <div style={{ display: 'grid', gap: 12 }}>
              <div className="elite-list-item">
                <div className="elite-list-title">
                  <span>
                    {locale === 'ar'
                      ? 'استخدم معرّف API العام وليس UUID الداخلي'
                      : 'Use the public API ID, not the internal UUID'}
                  </span>
                  <StatusBadge tone="info">
                    {locale === 'ar' ? 'المسار' : 'Route path'}
                  </StatusBadge>
                </div>
                <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
                  {locale === 'ar' ? (
                    <>
                      تستخدم مسارات لوحة التحكم UUID الداخلي للمثيل. تستخدم
                      المسارات العامة للمطور معرّف المثيل <code>publicId</code>.
                    </>
                  ) : (
                    <>
                      Dashboard routes use the internal instance UUID. Public
                      developer routes use the instance <code>publicId</code>.
                    </>
                  )}
                </p>
              </div>
              <div className="elite-list-item">
                <div className="elite-list-title">
                  <span>
                    {locale === 'ar'
                      ? 'عامل الرمز كسِرّ'
                      : 'Treat the token as a secret'}
                  </span>
                  <StatusBadge tone="warning">
                    {locale === 'ar' ? 'الأمان' : 'Security'}
                  </StatusBadge>
                </div>
                <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
                  {locale === 'ar'
                    ? 'احفظ الرمز في جهة الخادم فقط. إذا تسرّب، دوّره من صفحة تفاصيل المثيل واستبدله في إعدادات خدمتك الخلفية.'
                    : 'Store the token server-side only. If it leaks, rotate it from the instance detail page and replace it in your backend configuration.'}
                </p>
              </div>
              <div className="elite-list-item">
                <div className="elite-list-title">
                  <span>
                    {locale === 'ar'
                      ? 'معرّفات المرجع تجعل إعادة المحاولة أكثر أمانًا'
                      : 'Reference IDs make retries safer'}
                  </span>
                  <StatusBadge tone="success">
                    {locale === 'ar' ? 'العمليات' : 'Operations'}
                  </StatusBadge>
                </div>
                <p style={{ margin: 0, color: 'var(--elite-muted)' }}>
                  {locale === 'ar' ? (
                    <>
                      مرّر قيم <code>referenceId</code> الخاصة بك حتى تتمكن من
                      تتبع الإرسال والاستعلام عن السجلات وتجنب معالجة إعادة
                      المحاولة المكررة في تطبيقك.
                    </>
                  ) : (
                    <>
                      Pass your own <code>referenceId</code> values so you can
                      trace sends, query logs, and avoid duplicate retry
                      handling in your application.
                    </>
                  )}
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            eyebrow={locale === 'ar' ? 'رموز مساحة العمل' : 'Workspace tokens'}
            title={
              locale === 'ar'
                ? 'رموز API للحساب على مستوى مساحة العمل'
                : 'Workspace-level account API tokens'
            }
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <NoticeBanner
                title={
                  locale === 'ar'
                    ? 'استخدم هذه الرموز للتكاملات المرتبطة بالحساب'
                    : 'Use these tokens for account-scoped integrations'
                }
                tone="info"
              >
                <p style={{ marginTop: 0 }}>
                  {locale === 'ar' ? (
                    <>
                      أنشئ رموز API الخاصة بمساحة العمل ودوّرها من صفحة
                      الإعدادات، ثم استخدمها على جهة الخادم لاستدعاء API الحساب
                      العام تحت <code>/api/v1/public/account</code>.
                    </>
                  ) : (
                    <>
                      Create and rotate workspace API tokens from Settings, then
                      use them server-side to call the public account API under{' '}
                      <code>/api/v1/public/account</code>.
                    </>
                  )}
                </p>
                <p style={{ marginBottom: 0 }}>
                  {locale === 'ar'
                    ? 'احتفظ بالرمز في مخزن الأسرار في خدمتك الخلفية. لا تعرضه في المتصفح.'
                    : 'Keep the token in your backend secret store. Do not expose it in the browser.'}
                </p>
              </NoticeBanner>

              <DefinitionGrid
                minItemWidth={220}
                items={[
                  {
                    label: copy.workspace,
                    value:
                      selectedWorkspace?.name ??
                      (locale === 'ar'
                        ? 'مساحة العمل المحددة'
                        : 'Selected workspace'),
                    tone: 'info',
                  },
                  {
                    label:
                      locale === 'ar' ? 'مصادقة الإدارة' : 'Management auth',
                    value:
                      locale === 'ar'
                        ? 'جلسة bearer للوحة التحكم'
                        : 'Dashboard bearer session',
                    tone: 'neutral',
                  },
                  {
                    label: locale === 'ar' ? 'المصادقة العامة' : 'Public auth',
                    value: 'Authorization: Bearer {account_api_token}',
                    tone: 'success',
                  },
                  {
                    label:
                      locale === 'ar'
                        ? 'عائلة المسارات العامة'
                        : 'Public route family',
                    value: '/api/v1/public/account/*',
                    tone: 'neutral',
                  },
                ]}
              />

              <div style={{ display: 'grid', gap: 12 }}>
                <EndpointCopyRow
                  label={
                    locale === 'ar'
                      ? 'عرض رموز مساحة العمل'
                      : 'List workspace tokens'
                  }
                  endpoint={accountTokensListEndpoint}
                />
                <EndpointCopyRow
                  label={
                    locale === 'ar'
                      ? 'إنشاء رمز مساحة العمل'
                      : 'Create workspace token'
                  }
                  endpoint={accountTokensCreateEndpoint}
                />
                <EndpointCopyRow
                  label={
                    locale === 'ar'
                      ? 'تدوير رمز مساحة العمل'
                      : 'Rotate workspace token'
                  }
                  endpoint={accountTokensRotateEndpoint}
                />
              </div>
            </div>
          </InfoCard>

          <CodeExampleCard
            eyebrow="Account API"
            title="GET /api/v1/public/account/instances"
            endpoint={buildAccountRoute('/instances')}
            snippet={accountInstancesListSnippet}
          />

          <CodeExampleCard
            eyebrow="Account API"
            title="POST /api/v1/public/account/instances"
            endpoint={buildAccountRoute('/instances')}
            snippet={accountInstancesCreateSnippet}
          />

          <CodeExampleCard
            eyebrow="Account API"
            title="PATCH /api/v1/public/account/instances/{instanceId}"
            endpoint={`${buildAccountRoute('/instances')}/your-instance-id`}
            snippet={accountInstancesUpdateSnippet}
          />

          <InfoCard
            eyebrow={locale === 'ar' ? 'عمليات Webhook' : 'Webhooks'}
            title={
              locale === 'ar'
                ? 'أمثلة تسليم Webhook والتحقق الموقّع'
                : 'Webhook delivery examples and signed verification'
            }
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <NoticeBanner
                title={
                  locale === 'ar'
                    ? 'ما الذي يرسله Elite Message'
                    : 'What Elite Message sends'
                }
                tone="info"
              >
                <p style={{ marginTop: 0 }}>
                  {locale === 'ar'
                    ? 'تتضمن طلبات التسليم جسم JSON موقّعًا بالإضافة إلى رؤوس معرّف التسليم ونوع الحدث ومعرّف المثيل العام والطابع الزمني.'
                    : 'Delivery requests include the signed JSON body plus headers for the delivery ID, event type, public instance ID, and timestamp.'}
                </p>
                <div style={{ display: 'grid', gap: 8 }}>
                  <p style={{ margin: 0 }}>
                    <code>x-elite-message-delivery-id</code>
                  </p>
                  <p style={{ margin: 0 }}>
                    <code>x-elite-message-event</code>
                  </p>
                  <p style={{ margin: 0 }}>
                    <code>x-elite-message-instance-public-id</code>
                  </p>
                  <p style={{ margin: 0 }}>
                    <code>x-elite-message-timestamp</code>
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    <code>x-elite-message-signature</code>
                  </p>
                </div>
              </NoticeBanner>

              <DefinitionGrid
                minItemWidth={220}
                items={[
                  {
                    label: locale === 'ar' ? 'أنواع الأحداث' : 'Event types',
                    value: 'message_create, message_ack, message_received',
                    tone: 'info',
                  },
                  {
                    label:
                      locale === 'ar' ? 'تنسيق التوقيع' : 'Signature format',
                    value: 'v1=HMAC_SHA256(secret, timestamp.raw_body)',
                    tone: 'success',
                  },
                  {
                    label: locale === 'ar' ? 'مصدر السر' : 'Secret source',
                    value: 'Instance settings webhookSecret',
                    tone: 'neutral',
                  },
                  {
                    label: locale === 'ar' ? 'طريقة HTTP' : 'HTTP method',
                    value: 'POST',
                    tone: 'neutral',
                  },
                ]}
              />

              <SnippetCard
                eyebrow={locale === 'ar' ? 'مثال الحمولة' : 'Payload example'}
                title={
                  locale === 'ar'
                    ? 'جسم Webhook الموقّع'
                    : 'Signed webhook body'
                }
                description={
                  locale === 'ar'
                    ? 'هذا هو جسم JSON الذي يراه المستقبل قبل التحقق من التوقيع.'
                    : 'This is the JSON body the receiver sees before you verify the signature.'
                }
                snippet={webhookPayloadExample}
              />
            </div>
          </InfoCard>

          <SnippetCard
            eyebrow={locale === 'ar' ? 'مستقبل Webhook' : 'Webhook receiver'}
            title={
              locale === 'ar'
                ? 'تعامل مع التسليم الوارد'
                : 'Handle the incoming delivery'
            }
            description={
              locale === 'ar'
                ? 'اقرأ رؤوس Elite Message، وحلّل الجسم، وأعد 200 فقط بعد أن يتحقق تطبيقك من الحدث ويخزنه.'
                : 'Read the Elite Message headers, parse the body, and return 200 only after your app has validated and stored the event.'
            }
            snippet={webhookReceiverSnippet}
          />

          <SnippetCard
            eyebrow={locale === 'ar' ? 'فحص التوقيع' : 'Signature check'}
            title={
              locale === 'ar'
                ? 'تحقق من x-elite-message-signature'
                : 'Verify x-elite-message-signature'
            }
            description={
              locale === 'ar'
                ? 'استخدم جسم الطلب الخام ورأس الطابع الزمني وسر Webhook الخاص بالمثيل للتحقق من صحة التسليم.'
                : 'Use the raw request body, the timestamp header, and your instance webhook secret to validate delivery authenticity.'
            }
            snippet={webhookVerificationSnippet}
          />

          {errorMessage ? (
            <NoticeBanner title={copy.docsIssue} tone="danger">
              <p style={{ margin: 0 }}>{errorMessage}</p>
            </NoticeBanner>
          ) : null}
        </>
      ) : null}
    </AppShell>
  );
}
