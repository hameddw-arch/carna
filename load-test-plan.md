# CARNA Load Testing Plan - Priority #6

## 📊 Current Infrastructure Status

**Website:** carna.online (hosted on Cloudflare Pages)
**Backend:** Supabase PostgreSQL
**Frontend:** React 19 + TypeScript
**Current Response Time:** 0.35-0.39s (excellent baseline)
**Cache Status:** DYNAMIC (not cached - can be optimized)

---

## 🎯 Load Testing Scenarios

### Scenario 1: Baseline Load (Normal Traffic)
- **Virtual Users (VUs):** 50
- **Duration:** 5 minutes
- **Ramp-up:** Linear (0 to 50 VUs over 1 minute)
- **User Behavior:**
  - 60% Browse cars (search/filter)
  - 25% View car details
  - 10% View workshop listings
  - 5% Authentication/profile

**Expected Results:**
- TTFB (Time to First Byte): < 500ms
- Page Load: < 2s
- Error rate: < 1%

---

### Scenario 2: Peak Traffic (Growth Test)
- **Virtual Users:** 100-200
- **Duration:** 10 minutes
- **Ramp-up:** Linear (0 to 100 VUs in 2 min, hold 100 for 5 min, ramp to 200 for 3 min)
- **User Behavior:** Same distribution as Scenario 1

**Expected Results:**
- TTFB: < 1s
- Page Load: < 3s
- Error rate: < 2%
- Database queries: < 100ms avg

---

### Scenario 3: Stress Test (Breaking Point)
- **Virtual Users:** 500
- **Duration:** 5 minutes
- **Ramp-up:** Quick (0 to 500 VUs in 30s)
- **Target:** Find breaking point

**Expected Findings:**
- Identify bottleneck(s)
- Database connection limits
- Cloudflare rate limiting
- Memory/CPU constraints

---

### Scenario 4: Spike Test (Flash Traffic)
- **VUs:** 50 (baseline) → 300 (spike in 10s) → back to 50
- **Duration:** 5 minutes
- **Observe:** System recovery time

---

## 📋 Critical User Journeys to Test

1. **Homepage to Browse Flow**
   - Load homepage
   - Navigate to /browse
   - Apply filters (city, price, brand)
   - View page with 12 listings

2. **Car Detail Page Flow**
   - Simulate 100 concurrent detail page views
   - Different car IDs (test database read)

3. **Workshop Directory**
   - Load workshop listing
   - Filter by category/city
   - View workshop detail

4. **Search Performance**
   - Query with multiple filters
   - Sorting (price, newest, rating)

---

## 🔍 Metrics to Monitor

### Frontend Metrics
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Page Load Time
- JavaScript Parse/Execute Time

### Backend Metrics
- API Response Time
- Database Query Duration
- Supabase Connection Pool Usage
- Error Rates by Endpoint

### Infrastructure
- Cloudflare Cache Hit Rate
- Edge Server Response Time
- CDN Performance
- Cost (requests billed by Supabase)

---

## 💰 Cost Considerations

**Supabase Pricing Impact:**
- Free tier: 500,000 API calls/month
- Load test with 100 VUs for 10 min = ~60,000 API calls
- Paid tier: $25/month (2M API calls included)

**Recommendation:** Run load tests during off-hours to minimize costs

---

## 📈 Success Criteria

✅ **Acceptable Performance:**
- TTFB < 500ms at 100 VUs
- Error rate < 1%
- No more than 5% latency degradation at 200 VUs
- Database queries < 100ms

⚠️ **Warning Signs:**
- TTFB > 2s
- Error rate > 5%
- Database timeouts
- Memory leaks

🚨 **Critical Issues:**
- Error rate > 10%
- TTFB > 5s
- System crash < 500 VUs

---

## 🛠️ Tools & Setup

**Load Testing Tool:** k6 (lightweight, JavaScript-based)
- Simple VU simulation
- Real browser metrics (via browser extension)
- Real-time results
- Export to JSON/CSV

**Monitoring During Test:**
- Cloudflare Analytics Dashboard
- Supabase Dashboard (Real-time)
- k6 CLI output
- Browser DevTools (sampling)

---

## 📅 Test Schedule

1. **Phase 1:** Baseline test (Scenario 1) - 5 min
2. **Phase 2:** Peak traffic test (Scenario 2) - 10 min
3. **Phase 3:** Stress test (Scenario 3) - 5 min
4. **Phase 4:** Spike test (Scenario 4) - 5 min

**Total Duration:** ~25 minutes
**Best Time:** 2-3 AM UTC (off-hours)

---

## 🎯 Post-Test Actions

### If Tests Pass ✅
- Document baseline metrics
- Set up monitoring alerts
- Plan for 2x capacity in next review

### If Issues Found ⚠️
1. **Slow Frontend:**
   - Optimize bundle size
   - Implement code splitting
   - Enable Cloudflare caching

2. **Slow Database:**
   - Add database indexes
   - Optimize queries
   - Increase connection pool

3. **High Memory:**
   - Profile React component renders
   - Implement virtualization for lists

---

## 📊 Expected Load Test Output

```
Summary:
  Total VUs: 100
  Total Requests: 12,456
  Total Errors: 87 (0.7%)
  
Endpoints:
  GET / ........................ 1,234 requests, avg latency 245ms
  GET /browse .................. 3,456 requests, avg latency 389ms
  GET /car/:id ................. 4,567 requests, avg latency 342ms
  GET /workshops ............... 2,341 requests, avg latency 412ms
  GET /api/listings ............ 858 requests, avg latency 156ms
  
Latency Percentiles:
  p50: 234ms
  p75: 456ms
  p90: 789ms
  p99: 1,234ms
```

---

## ✅ Deliverables

1. k6 load test script (JavaScript)
2. HTML report with graphs
3. Detailed findings document
4. Recommendations for optimization
5. Baseline metrics for future comparison
