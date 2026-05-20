import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Seo } from '../components/Seo';
import coursesJson from '../data/courses.json';
import type { Course, CourseLevel } from '../types/lms';

const courses = coursesJson as Course[];

const CATEGORY_EMOJI: Record<string, string> = {
  'Web Development': '💻',
  'Digital Marketing': '📈',
  'Islamic Studies': '📖',
};

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '📚';
}

function categoryHeadClass(category: string): string {
  const base = 'lms-course-card-head';
  if (category === 'Web Development') return `${base} lms-cat-head--web`;
  if (category === 'Digital Marketing') return `${base} lms-cat-head--dm`;
  return `${base} lms-cat-head--default`;
}

function truncateDescription(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars).trimEnd()}…`;
}

function levelTagClass(level: CourseLevel): string {
  switch (level) {
    case 'Beginner':
      return 'lms-tag lms-tag--beginner';
    case 'Intermediate':
      return 'lms-tag lms-tag--intermediate';
    case 'Advanced':
      return 'lms-tag lms-tag--advanced';
  }
}

function matchesSearch(course: Course, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const inTags = course.tags.some((t) => t.toLowerCase().includes(q));
  return (
    course.title.toLowerCase().includes(q) ||
    course.description.toLowerCase().includes(q) ||
    inTags
  );
}

export function CoursesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categoryList = useMemo(() => {
    const unique = new Set(courses.map((c) => c.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const catOk =
        activeCategory === 'All' || c.category === activeCategory;
      return catOk && matchesSearch(c, search);
    });
  }, [activeCategory, search]);

  return (
    <>
      <Seo
        title="Free Courses — RathiSoft"
        description="Learn web development, SEO, and more with free courses from RathiSoft. Certificates included."
        keywords="free courses, web development, SEO, online learning, RathiSoft"
      />
      <main className="page-courses lms-page app-main">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'E-Learning', path: '/courses' },
          ]}
        />

        <section className="hero" aria-labelledby="courses-hero-heading">
          <div className="wrap">
            <div className="label">E-Learning</div>
            <h1 id="courses-hero-heading">
              Free Courses
              <br />
              Learn &amp; Grow
            </h1>
            <p>
              Self-paced lessons with clear structure and practical topics—enroll free, track
              progress at your own pace, and earn a certificate when you finish.
            </p>
            <div className="hero-stats" role="region" aria-label="Course library highlights">
              <div className="hero-stat">
                <div className="hero-stat-num">{courses.length}</div>
                <div className="hero-stat-label">Courses</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">Free forever</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">Cert</div>
                <div className="hero-stat-label">On completion</div>
              </div>
            </div>
          </div>
        </section>

        <div className="lms-container lms-catalog">
          <div className="lms-input-wrap">
            <label htmlFor="courses-search" className="lms-sr-only">
              Search courses
            </label>
            <input
              id="courses-search"
              type="search"
              placeholder="Search by title, description, or tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="lms-input"
            />
          </div>

          <div className="lms-filter-row">
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className={
                activeCategory === 'All'
                  ? 'lms-pill lms-pill--active'
                  : 'lms-pill'
              }
            >
              All
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? 'lms-pill lms-pill--active'
                    : 'lms-pill'
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <ul className="lms-course-grid">
            {filteredCourses.map((course) => (
              <li key={course.id}>
                <Link
                  to={`/courses/${course.id}`}
                  className="lms-course-card"
                >
                  <div className={categoryHeadClass(course.category)}>
                    <span aria-hidden className="drop-shadow-md">
                      {categoryEmoji(course.category)}
                    </span>
                    <span className="lms-badge-free">FREE</span>
                  </div>

                  <div className="lms-course-card-body">
                    <span className={levelTagClass(course.level)}>
                      {course.level}
                    </span>
                    <h2 className="lms-course-title">{course.title}</h2>
                    <p className="lms-course-desc">
                      {truncateDescription(course.description, 90)}
                    </p>
                    <div className="lms-course-meta">
                      <span>
                        {course.totalLectures}{' '}
                        {course.totalLectures === 1 ? 'lecture' : 'lectures'}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {filteredCourses.length === 0 ? (
            <p className="lms-empty">
              No courses match your search. Try another keyword or category.
            </p>
          ) : null}
        </div>
      </main>
    </>
  );
}
