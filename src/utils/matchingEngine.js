import { calculateDistanceKm } from './geoUtils';

/**
 * Worker-Job Matching Engine
 * Evaluates compatibility between a Worker profile and a Job posting based on:
 * 1. Category match (35 pts)
 * 2. Skills overlap (25 pts)
 * 3. Geographic proximity (20 pts)
 * 4. Wage compatibility (15 pts)
 * 5. Availability readiness (5 pts)
 *
 * Returns a score between 0 and 100, with detailed score breakdowns.
 */
export function calculateMatchScore(worker, job) {
  if (!worker || !job) return { score: 0, breakdown: {}, verdict: 'No data' };

  let score = 0;
  const breakdown = {
    categoryMatch: false,
    categoryScore: 0,
    skillsMatched: [],
    skillsScore: 0,
    distanceKm: null,
    distanceScore: 0,
    wageDiff: 0,
    wageScore: 0,
    availabilityScore: 0,
  };

  // 1. Category Match (35 points)
  if (worker.category === job.category) {
    breakdown.categoryMatch = true;
    breakdown.categoryScore = 35;
    score += 35;
  } else if (
    (worker.category === 'general-labour' && job.category === 'construction') ||
    (worker.category === 'construction' && job.category === 'general-labour') ||
    (worker.category === 'loading-unloading' && job.category === 'packers-movers') ||
    (worker.category === 'packers-movers' && job.category === 'loading-unloading')
  ) {
    // Adjacent category partial credit
    breakdown.categoryScore = 20;
    score += 20;
  }

  // 2. Skills Overlap (25 points)
  const jobText = `${job.title} ${job.description}`.toLowerCase();
  const workerSkills = Array.isArray(worker.skills) ? worker.skills : [];
  const matchedSkills = workerSkills.filter((skill) =>
    jobText.includes(skill.toLowerCase().split(' ')[0])
  );
  breakdown.skillsMatched = matchedSkills;
  
  if (matchedSkills.length > 0) {
    const skillPoints = Math.min(25, matchedSkills.length * 9 + 7);
    breakdown.skillsScore = skillPoints;
    score += skillPoints;
  } else if (breakdown.categoryMatch) {
    // Baseline category skill assumption
    breakdown.skillsScore = 12;
    score += 12;
  }

  // 3. Proximity / Distance (20 points)
  if (worker.lat && worker.lng && job.lat && job.lng) {
    const dist = calculateDistanceKm(worker.lat, worker.lng, job.lat, job.lng);
    breakdown.distanceKm = dist;

    if (dist <= 3) {
      breakdown.distanceScore = 20; // Super close!
    } else if (dist <= 6) {
      breakdown.distanceScore = 17;
    } else if (dist <= 10) {
      breakdown.distanceScore = 13;
    } else if (dist <= 15) {
      breakdown.distanceScore = 8;
    } else {
      breakdown.distanceScore = 4;
    }
    score += breakdown.distanceScore;
  } else {
    breakdown.distanceScore = 10;
    score += 10;
  }

  // 4. Wage Compatibility (15 points)
  // Worker's expected daily wage vs Job offered wage
  const workerWage = Number(worker.dailyWage) || 750;
  const offeredWage = Number(job.offeredWage) || 800;
  const diff = offeredWage - workerWage;
  breakdown.wageDiff = diff;

  if (diff >= 0) {
    // Employer offers equal or higher wage than worker expected -> Perfect
    breakdown.wageScore = 15;
    score += 15;
  } else if (diff >= -50) {
    // Within ₹50 margin
    breakdown.wageScore = 11;
    score += 11;
  } else if (diff >= -150) {
    // Within ₹150 margin
    breakdown.wageScore = 7;
    score += 7;
  } else {
    breakdown.wageScore = 2;
    score += 2;
  }

  // 5. Availability (5 points)
  if (worker.availability === 'Available Today') {
    breakdown.availabilityScore = 5;
    score += 5;
  } else if (worker.availability === 'Available Tomorrow') {
    breakdown.availabilityScore = 3;
    score += 3;
  } else {
    breakdown.availabilityScore = 1;
    score += 1;
  }

  // Determine qualitative verdict
  let verdict = 'Fair Match';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  if (score >= 85) {
    verdict = 'Top Match (Highly Recommended)';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (score >= 70) {
    verdict = 'Great Match';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (score >= 55) {
    verdict = 'Good Match';
    badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown,
    verdict,
    badgeColor,
  };
}

/**
 * Get top matched workers for a given job, sorted by compatibility score
 */
export function getMatchedWorkersForJob(job, workers) {
  if (!job || !Array.isArray(workers)) return [];

  return workers
    .map((worker) => {
      const match = calculateMatchScore(worker, job);
      return {
        worker,
        ...match,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Get top matched jobs for a given worker, sorted by compatibility score
 */
export function getMatchedJobsForWorker(worker, jobs) {
  if (!worker || !Array.isArray(jobs)) return [];

  return jobs
    .map((job) => {
      const match = calculateMatchScore(worker, job);
      return {
        job,
        ...match,
      };
    })
    .sort((a, b) => b.score - a.score);
}
