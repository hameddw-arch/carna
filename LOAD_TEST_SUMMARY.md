# Priority #6: Load Testing - Complete Package

## 📦 What's Included

### 1. **load-test-plan.md** - Comprehensive Test Strategy
- Current infrastructure analysis
- 4 test scenarios (Baseline, Peak, Stress, Spike)
- Critical user journeys
- Success/failure criteria
- Post-test action plan

### 2. **load-test.js** - k6 Script Ready to Run
- Simulates 60% browse users
- 25% detail page viewers
- 10% workshop browsers
- 5% profile visitors
- Realistic think times between actions
- Custom metrics tracking

### 3. **LOAD_TESTING_README.md** - Complete Setup Guide
- k6 installation for all platforms
- Running tests (basic to advanced)
- Understanding results
- Troubleshooting guide
- Success criteria checklist

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install k6
```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo apt-get install k6

# Or Docker
docker run -v /path/to/load-test.js:/load-test.js grafana/k6 run /load-test.js
```

### Step 2: Run Baseline Test
```bash
k6 run load-test.js
```

This will:
- Start with 50 VUs (virtual users)
- Ramp up to 200 VUs
- Run for ~25 minutes total
- Show real-time metrics
- Generate final report

### Step 3: Review Results
Look for:
- ✅ Error rate < 1%
- ✅ p95 latency < 500ms
- ✅ No database timeouts

---

## 📊 Current Baseline

**From initial testing:**
```
Homepage Response: 357ms
Browse Page: 387ms  
Workshops: 358ms
Error Rate: 0% (100 requests tested)
```

**Cloudflare Status:**
- Server: ✅ Cloudflare Pages
- Cache: DYNAMIC (not cached - opportunity for optimization)
- DNS: ✅ Resolving correctly

---

## 🎯 Test Phases

```
Phase 1: Baseline (0-5m)
├─ 50 VUs for 5 minutes
├─ Expect: p95 < 500ms
└─ Purpose: Establish baseline

Phase 2: Peak Traffic (5-15m)
├─ Ramp to 100 VUs, hold 5m
├─ Then 200 VUs for 3m
├─ Expect: p95 < 1000ms
└─ Purpose: Test expected peak load

Phase 3: Stress Test (15-20m)
├─ Ramp to 500 VUs in 30s
├─ Hold for 5 minutes
├─ Expect: identify bottleneck
└─ Purpose: Find breaking point

Phase 4: Ramp Down (20-25m)
└─ Back to 0 VUs gracefully
```

---

## 💡 What to Expect

### Optimal Results ✅
```
✓ 99.2% requests successful
✓ p95 latency: 456ms
✓ p99 latency: 789ms
✓ Throughput: 150 RPS
✓ No database errors
```

### Warning Signs ⚠️
```
⚠ Error rate 1-5%
⚠ p95 latency 500ms-2s
⚠ Occasional timeouts
⚠ High CPU usage
```

### Failure ❌
```
✗ Error rate > 5%
✗ System crash < 300 VUs
✗ Database connection pool exhausted
✗ p95 latency > 2s consistently
```

---

## 🔧 Optimization Recommendations

### If Tests Pass ✅
```
→ Document baseline metrics
→ Set up monitoring alerts
→ Plan for 2x capacity growth
→ Schedule next test in 30 days
```

### If Slow Frontend 🐢
```
→ Enable Cloudflare caching
→ Optimize bundle size
→ Implement code splitting
→ Minify images
```

### If Slow Database 📊
```
→ Add indexes to frequently filtered columns
→ Optimize N+1 query problems
→ Increase Supabase plan (more connections)
→ Use RLS policies efficiently
```

### If High Memory 💾
```
→ Profile React components
→ Virtualize long lists
→ Implement pagination
→ Clear unused data from state
```

---

## 📈 Metrics to Track

### Frontend (Browser)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- JavaScript Parse Time
- Layout Shift

### Backend (API/Database)
- API Response Time
- Database Query Duration
- Connection Pool Usage
- RPC Call Duration
- Error Rate by Endpoint

### Infrastructure
- Cloudflare Cache Hit Rate
- Edge Server Response Time
- Request Volume
- Cost (Supabase API calls)

---

## 💰 Cost Estimate

**Supabase API Calls for Load Test:**
```
Phase 1 (50 VUs, 5m):  ~6,000 API calls
Phase 2 (200 VUs, 8m): ~24,000 API calls
Phase 3 (500 VUs, 5m): ~30,000 API calls
Phase 4 (0 VUs, 5m):   ~2,000 API calls
─────────────────────────────────
Total:                 ~62,000 API calls

Supabase Plan Impact:
- Free tier: 500,000 calls/month (OK)
- Paid tier: $25/month (includes 2M calls)
```

**Recommendation:** Run during off-hours to batch with other traffic

---

## ✅ Pre-Test Checklist

- [ ] k6 installed and working
- [ ] Can reach https://carna.online
- [ ] Cloudflare dashboard accessible
- [ ] Supabase dashboard accessible
- [ ] Saved current baseline metrics
- [ ] Team notified (if production test)
- [ ] Scheduled during off-hours (2-3 AM UTC)
- [ ] Have enough API quota
- [ ] Results directory created

---

## 🎓 Next Steps

### Immediate (Today)
1. ✅ Install k6
2. ✅ Run baseline test (50 VUs)
3. ✅ Review results
4. ✅ Document baseline

### Short Term (This Week)
1. Run full 4-phase test
2. Identify any bottlenecks
3. Plan optimizations

### Medium Term (This Month)
1. Implement recommendations
2. Re-test to verify improvements
3. Set up continuous monitoring

---

## 📞 Resources

**k6 Documentation:**
- https://k6.io/docs/
- https://k6.io/docs/get-started/running-k6/

**Cloudflare Analytics:**
- https://dash.cloudflare.com/

**Supabase Dashboard:**
- https://app.supabase.com/

**GitHub Repository:**
- https://github.com/hameddw-arch/carna

**CARNA Website:**
- https://carna.online

---

## 🎯 Success Criteria (Final)

Your load test is **successful** if:

✅ All scenarios complete without manual intervention
✅ Error rate stays below 1% at 100 VUs
✅ p95 latency under 500ms at baseline (50 VUs)
✅ No database connection pool errors
✅ System remains stable under 200 VU load
✅ Recovery time after spike < 30 seconds

---

**Status:** Priority #6 Load Testing Package Ready
**Date:** 2026-05-31
**Target:** carna.online (Cloudflare + Supabase)
**Next Review:** After first test completion
