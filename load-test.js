import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const pageLoadTime = new Trend('page_load_time');
const apiResponseTime = new Trend('api_response_time');
const totalRequests = new Counter('total_requests');

const BASE_URL = 'https://carna.online';

// Realistic car IDs and workshop IDs (sample data)
const carIds = [
  '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
  '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
  '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
];

const workshopIds = [
  '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
  '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
];

const cities = ['دمشق', 'حلب', 'حمص', 'اللاذقية', 'ريف دمشق'];
const brands = ['تويوتا', 'هونداي', 'BMW', 'مرسيدس', 'أودي'];

export const options = {
  stages: [
    // Baseline: 25 VUs for 5 minutes
    { duration: '1m', target: 25 },
    { duration: '4m', target: 25 },
    { duration: '1m', target: 0 },
  ],

  // Thresholds - if exceeded, test is considered failed
  thresholds: {
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'],
    'http_req_failed': ['rate<0.10'], // 10% error rate for baseline
    'errors': ['rate<0.10'],
  },

};

export default function () {
  const userType = Math.random();

  if (userType < 0.6) {
    // 60% - Browse/Search users
    browseCars();
  } else if (userType < 0.85) {
    // 25% - Car detail viewers
    viewCarDetails();
  } else if (userType < 0.95) {
    // 10% - Workshop browsers
    browseWorkshops();
  } else {
    // 5% - Profile/Settings
    viewProfile();
  }
}

// Global timeout configuration
export const options_with_timeout = {
  ...options,
  ext: {
    loadimpact: {
      projectID: 0,
      name: 'CARNA Load Test',
    },
  },
};

function browseCars() {
  group('Browse Cars Flow', () => {
    // Load homepage
    const homeRes = http.get(BASE_URL, {
      tags: { name: 'Homepage' },
    });

    check(homeRes, {
      'home status is 200': (r) => r.status === 200,
      'home load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    pageLoadTime.add(homeRes.timings.duration);
    totalRequests.add(1);
    sleep(1);

    // Browse with filters
    const city = cities[Math.floor(Math.random() * cities.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const priceFrom = Math.floor(Math.random() * 10) * 1000000 + 5000000;
    const priceTo = priceFrom + 5000000;

    const browseRes = http.get(
      `${BASE_URL}/browse?city=${encodeURIComponent(city)}&make=${encodeURIComponent(brand)}&priceFrom=${priceFrom}&priceTo=${priceTo}`,
      { tags: { name: 'Browse Cars' } }
    );

    check(browseRes, {
      'browse status is 200': (r) => r.status === 200,
      'browse load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    pageLoadTime.add(browseRes.timings.duration);
    totalRequests.add(1);
    sleep(2);
  });
}

function viewCarDetails() {
  group('Car Detail Flow', () => {
    // Load car detail page
    const carId = carIds[Math.floor(Math.random() * carIds.length)];

    const detailRes = http.get(`${BASE_URL}/car/${carId}`, {
      tags: { name: 'Car Detail' },
    });

    check(detailRes, {
      'detail status is 200': (r) => r.status === 200,
      'detail load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    pageLoadTime.add(detailRes.timings.duration);
    totalRequests.add(1);
    sleep(3);
  });
}

function browseWorkshops() {
  group('Workshop Browse Flow', () => {
    // Load workshops directory
    const workshopsRes = http.get(`${BASE_URL}/workshops`, {
      tags: { name: 'Workshops List' },
    });

    check(workshopsRes, {
      'workshops status is 200': (r) => r.status === 200,
      'workshops load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    pageLoadTime.add(workshopsRes.timings.duration);
    totalRequests.add(1);
    sleep(1);

    // View workshop detail
    const workshopId = workshopIds[Math.floor(Math.random() * workshopIds.length)];

    const detailRes = http.get(`${BASE_URL}/workshop/${workshopId}`, {
      tags: { name: 'Workshop Detail' },
    });

    check(detailRes, {
      'workshop detail status is 200': (r) => r.status === 200,
      'workshop detail load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    pageLoadTime.add(detailRes.timings.duration);
    totalRequests.add(1);
    sleep(2);
  });
}

function viewProfile() {
  group('Profile/Account Flow', () => {
    const aboutRes = http.get(`${BASE_URL}/about`, {
      tags: { name: 'About Page' },
    });

    check(aboutRes, {
      'about status is 200': (r) => r.status === 200,
      'about load time < 1s': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    pageLoadTime.add(aboutRes.timings.duration);
    totalRequests.add(1);
    sleep(2);
  });
}
