# CARNA Load Testing Guide

## 📖 Quick Start

### 1. Install k6

**macOS (Homebrew):**
```bash
brew install k6
```

**Windows (Chocolatey):**
```bash
choco install k6
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3232A
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

**Docker:**
```bash
docker run --rm -i grafana/k6 run - < load-test.js
```

---

### 2. Run the Load Test

```bash
# Basic run (default settings from options in script)
k6 run load-test.js

# With custom VU count and duration
k6 run --vus 50 --duration 5m load-test.js

# With HTML report
k6 run --out json=results.json load-test.js

# View live results in real-time
k6 run load-test.js --summary-export=summary.json
```

---

## 📊 Understanding the Results

### Key Metrics

| Metric | Meaning | Good Range |
|--------|---------|-----------|
| **TTFB** | Time to First Byte | < 500ms |
| **p95** | 95th percentile latency | < 500ms |
| **p99** | 99th percentile latency | < 1s |
| **Error Rate** | Failed requests | < 1% |
| **Throughput** | Requests per second | > 100 RPS |

### Example Output
```
     ✓ detail status is 200
     ✓ detail load time < 1s
     ✓ home status is 200
     ✓ home load time < 1s

     checks.........................: 99.2% ✓ 1234 ✗ 10
     data_received..................: 54 MB ✓ 0 B ✗
     data_sent......................: 1.2 MB ✓ 0 B ✗
     dropped_iterations.............: 0
     errors..........................: 0.8% ✓ 100 ✗
     group_duration.................: avg=1.23s, min=456ms, med=789ms, max=5.4s, p(90)=2.3s, p(95)=3.1s, p(99)=4.2s
     http_req_blocked...............: avg=45ms, min=1ms, med=10ms, max=2.3s, p(90)=100ms, p(95)=156ms, p(99)=340ms
     http_req_connecting............: avg=12ms, min=0s, med=0s, max=200ms, p(90)=50ms, p(95)=89ms, p(99)=156ms
     http_req_duration..............: avg=345ms, min=123ms, med=234ms, max=4.5s, p(90)=567ms, p(95)=789ms, p(99)=1.2s
     http_req_failed................: 0.8% ✓ 100 ✗ 1234
     http_req_receiving.............: avg=34ms, min=5ms, med=20ms, max=890ms, p(90)=67ms, p(95)=120ms, p(99)=340ms
     http_req_sending...............: avg=12ms, min=2ms, med=8ms, max=450ms, p(90)=25ms, p(95)=40ms, p(99)=120ms
     http_req_tls_handshaking.......: avg=0s, min=0s, med=0s, max=0s, p(90)=0s, p(95)=0s, p(99)=0s
     http_req_waiting...............: avg=299ms, min=100ms, med=189ms, max=4.1s, p(90)=489ms, p(95)=678ms, p(99)=1s
     http_reqs......................: 1234 34.2/s
     iteration_duration.............: avg=8.1s, min=4.5s, med=6.8s, max=15.2s, p(90)=12.3s, p(95)=13.7s, p(99)=14.8s
     iterations.....................: 154 4.2/iter/s
     vus............................: 50 min=25 max=100
     vus_max........................: 200
```

---

## 🎯 Test Scenarios

### Scenario 1: Baseline Load
```bash
k6 run load-test.js --stage 1m:50 --stage 4m:50
```
- 50 VUs for 5 minutes
- Measures normal traffic performance
- **Goal:** Establish baseline metrics

### Scenario 2: Peak Traffic
```bash
# Modify load-test.js stages to:
# { duration: '2m', target: 100 },
# { duration: '5m', target: 100 },
k6 run load-test.js
```
- Ramps up to 100 VUs
- Holds for 5 minutes
- **Goal:** Test under expected peak load

### Scenario 3: Stress Test
```bash
# Modify load-test.js stages to:
# { duration: '30s', target: 500 },
# { duration: '5m', target: 500 },
k6 run load-test.js
```
- Rapid ramp to 500 VUs
- Identifies breaking point
- **Goal:** Find system limits

### Scenario 4: Spike Test
```bash
# Modify load-test.js stages to:
# { duration: '1m', target: 50 },
# { duration: '10s', target: 300 },
# { duration: '1m', target: 50 },
k6 run load-test.js
```
- 50 → 300 → 50 VUs
- Tests recovery
- **Goal:** Verify system handles spikes

---

## 📈 Advanced Usage

### Export Results to JSON
```bash
k6 run load-test.js --out json=results.json
```

### Generate HTML Report (using extension)
```bash
k6 run load-test.js --out json=results.json \
  && k6 report results.json
```

### Run with Tags
```bash
k6 run load-test.js --tag name:browseCars
```

### Run Specific Thresholds
```bash
k6 run load-test.js --threshold 'http_req_duration{staticAsset:true}<100'
```

---

## 🔍 Monitoring During Test

### Real-time Dashboard
While k6 is running, open in browser:
- **Cloudflare Dashboard:** https://dash.cloudflare.com/
  - Check cache hit rate
  - Monitor worker performance
  - View request patterns

- **Supabase Dashboard:** https://app.supabase.com/
  - Watch database connections
  - Monitor query performance
  - Check API request rates

---

## ⚠️ Troubleshooting

### High Error Rate
```bash
# Check system resources
# Reduce VUs: k6 run --vus 25 load-test.js
# Or increase think time in script
```

### "Too many connections" errors
```
This means Supabase connection pool is exhausted.
Solution: 
- Reduce concurrent connections
- Upgrade Supabase plan
- Optimize connection pooling
```

### DNS Resolution Timeout
```bash
# Check if carna.online is reachable
curl -I https://carna.online

# Use CloudFlare resolver
k6 run load-test.js --dns "resolver=https+05" 
```

---

## 📋 Checklist Before Production Test

- [ ] Run baseline test first (50 VUs for 5m)
- [ ] Check Supabase plan limits
- [ ] Notify team about load test
- [ ] Run during off-hours (2-3 AM UTC)
- [ ] Have dashboards open during test
- [ ] Save results.json for comparison
- [ ] Document findings in load-test-plan.md

---

## 🎯 Success Criteria

✅ **Test Passes If:**
- Error rate < 1%
- p95 latency < 500ms
- No database connection errors
- Cloudflare cache working

⚠️ **Investigate If:**
- Error rate 1-5%
- p95 latency 500ms-1s
- Occasional timeouts

🚨 **Test Fails If:**
- Error rate > 5%
- p95 latency > 2s
- System crash < 300 VUs
- Database connection pool exhausted

---

## 📞 Support

For k6 help:
```bash
k6 version                 # Show version
k6 help                    # Show help
k6 cloud login             # Connect to Grafana Cloud for results storage
```

For CARNA issues:
- Check GitHub: https://github.com/hameddw-arch/carna
- Supabase status: https://status.supabase.com/
- Cloudflare status: https://www.cloudflarestatus.com/

---

## 📊 Sample Results Archive

Save all results:
```bash
mkdir -p load-test-results/$(date +%Y-%m-%d)
k6 run load-test.js --out json=load-test-results/$(date +%Y-%m-%d)/baseline.json
```

Compare over time to track improvements.

---

**Generated:** 2026-05-31
**Target:** carna.online (Cloudflare Pages + Supabase)
**Next Review:** After infrastructure changes or every 30 days
