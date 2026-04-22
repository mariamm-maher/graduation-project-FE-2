# Campaign Request Flow

This document explains how campaign data moves through the 3 UI pages:

1. Create Campaign
2. Prepare Campaign
3. Generated Campaign

It focuses on what is sent, where it is transformed, and where backend requests happen.

---

## 1) Create Campaign Page

Source file:
- src/features/dashboard/ownerDashboard/components/campaigns/create/CreateCampaign.jsx

### User input captured
The page builds `campaignData` in local state with:
- `campaignName`
- `campaignGoal`
- `budget`
- `currency`
- `durationWeeks`
- `startDate`
- `endDate` (derived value in state)

### Date logic
- User chooses `durationWeeks` and `startDate`.
- `endDate` is auto-calculated by `computeEndDateFromStart(startDate, weeks)`.
- Current calculation is: `end = start + (weeks * 7 days)`.

### Validation before moving on
`handleGenerateAI` checks required fields:
- campaign name
- goal
- budget
- currency

Then timeline validation ensures weeks/date combination is acceptable.

### Data passed to next page
When valid, it navigates to:
- `/dashboard/owner/campaigns/prepare`

With navigation state:
- `campaignData: preparedCampaignData`

`preparedCampaignData` contains:
- all form fields
- `durationWeeks` normalized to number or `null`
- `startDate` as value or `null`
- `endDate` from auto-calculation or `null`

No backend API call is made on this page.

---

## 2) Prepare Campaign Page

Source file:
- src/features/dashboard/ownerDashboard/components/campaigns/create/PrepareCampaign.jsx

### Input source
It reads the data from router state:
- `const { campaignData } = location.state || {}`

### Profile context loading
On mount:
- calls `fetchOwnerProfile()` from profile store
- merges owner profile with editable overrides (`ownerEdits`) into `ownerDraft`

### Campaign payload normalization
Before generate request, `handleGenerate` builds:

- `campaignDataForAi = { ...campaignData, startDate, endDate }`

Where:
- `startDate` fallback order: `campaignData.startDate` then `campaignData.start_date`
- `endDate` fallback order: `campaignData.endDate` then `campaignData.end_date`

### Validation before API request
Checks campaign fields:
- name
- goal
- budget
- currency
- duration weeks

Checks owner fields:
- brand name
- product/service
- industry
- target market
- company size
- USP

Also validates parsed weeks >= 1.

### API request sent
If valid, it calls:
- `aiCampaignApi.generateCampaignWithProfileContext({ campaignData: campaignDataForAi, ownerProfile: ownerProfileForAi })`

Where:
- `ownerProfileForAi` is owner context plus normalized target audience defaults.

### On success
Navigates to:
- `/dashboard/owner/campaigns/generated`

With state:
- `campaignData: payload`
- `aiPreview: response.data.aiPreview`

---

## 3) Generated Campaign Page

Source file:
- src/features/dashboard/ownerDashboard/components/campaigns/create/GeneratedCampaign.jsx

### Input source
Reads from router state:
- `campaignData`
- `aiPreview`

If either is missing, it shows fallback UI.

### Data normalization for display/edit
Builds `normalizedInput` from `campaignData` fields to feed UI and regenerate actions.

Important current mapping examples:
- campaign name from `campaignData.campaignName` or `campaignData.campaign_name`
- currency from `campaignData.budget_currency` or `campaignData.currency`
- weeks currently from `campaignData.campaign_duration_weeks`

### Date handling on generated page
`campaignDates` logic:
1. If `campaignData.startDate` and `campaignData.endDate` exist, use them directly.
2. Otherwise, synthesize dates from current date + duration fallback.

### Regenerate request
When user edits and clicks regenerate:
- calls `aiCampaignApi.generateWithPayload(data)`
- `data` is either `editData` or `normalizedInput`

### Save requests
The page sends campaign save payloads through store actions:
- `saveDraftCampaign(buildPayload(...))`
- `saveCampaign(buildPayload())`
- `saveAndPublishCampaign(buildPayload(...))`

`buildPayload` includes:
- campaign basics
- start/end dates from `campaignDates`
- strategy/execution/estimations from AI result
- owner profile context

---

## End to End Summary

1. Create Campaign collects campaign inputs and computes end date.
2. It passes campaign data via route state to Prepare Campaign.
3. Prepare Campaign combines campaign + owner profile context.
4. Prepare Campaign sends AI generation request to backend.
5. Generated Campaign receives AI output and supports regenerate/save/publish actions.

In short, the first page prepares campaign inputs, the second page sends the AI generation request, and the third page renders AI output and sends follow-up regenerate/save requests.
