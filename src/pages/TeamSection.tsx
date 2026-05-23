import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TeamSection.css";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { OnPageSeoSection } from "../components/OnPageSeoSection";
import { Seo } from "../components/Seo";
import { TEAM_SECTION_FONT_STYLESHEET } from "../constants/deferredFontUrls";
import { TEAM_MEMBERS, type TeamMember } from "../data/teamMembers";
import { teamMemberAlt } from "../utils/imageAssets";
import { BLOG_POSTS } from "../data/blogPosts";
import { ROUTES, blogPath } from "../utils/routes";
import { injectDeferredStylesheet } from "../utils/deferredStylesheet";

const DEPARTMENTS = ["All", "Leadership", "Engineering", "Design", "Marketing"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const MemberCard: React.FC<{ member: TeamMember; onSelect: (m: TeamMember) => void }> = ({
  member,
  onSelect,
}) => (
  <article className="member-card" onClick={() => onSelect(member)}>
    <div className="card-glow" />
    <div className="card-header">
      <div className="avatar-wrap">
        <img
          src={member.image}
          alt={teamMemberAlt(member.name, member.role)}
          title={`${member.name} — ${member.role} | RathiSoft Lahore`}
          className="avatar"
          width={200}
          height={200}
          loading="lazy"
          decoding="async"
        />
        {/* <span className="dept-badge">{member.department}</span> */}
      </div>
    </div>
    <div className="card-body">
      <h3 className="member-name">{member.name}</h3>
      <p className="member-role">{member.role}</p>
      <p className="member-bio">{member.bio}</p>
      <div className="skill-list">
        {member.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
    <div className="card-footer">
      <div className="meta-row">
        <span className="meta-item">📍 {member.location}</span>
        {/* <span className="meta-item">⏱ {member.experience}</span> */}
      </div>
    </div>
  </article>
);

const MemberModal: React.FC<{ member: TeamMember | null; onClose: () => void }> = ({
  member,
  onClose,
}) => {
  if (!member) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="modal-top">
          <img
            src={member.image}
            alt={teamMemberAlt(member.name, member.role)}
            title={`${member.name} — RathiSoft team member`}
            className="modal-avatar"
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
          />
          <div>
            <h2 className="modal-name">{member.name}</h2>
            <p className="modal-role">{member.role}</p>
            {/* <span className="dept-badge">{member.department}</span> */}
          </div>
        </div>
        <p className="modal-bio" style={{ whiteSpace: "pre-line" }}>{member.bio}</p>
        <div className="modal-meta">
          <div className="modal-meta-item">
            <span className="modal-label">Experience</span>
            <span className="modal-value">{member.experience}</span>
          </div>
          <div className="modal-meta-item">
            <span className="modal-label">Location</span>
            <span className="modal-value">{member.location}</span>
          </div>
        </div>
        <div className="modal-skills">
          <span className="modal-label">Skills</span>
          <div className="skill-list">
            {member.skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="modal-skills">
          <span className="modal-label">Marketing & Growth</span>
          <div className="skill-list">
            {member.marketing.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-timeline">
          <span className="modal-label">Experience</span>
          <div className="timeline">
            {member.timeline.map((t) => (
              <div key={`${t.period}-${t.title}`} className="timeline-item">
                <div className="timeline-period">{t.period}</div>
                <div className="timeline-body">
                  <div className="timeline-title">{t.title}</div>
                  <div className="timeline-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-cta">
          <Link to={ROUTES.contact} className="modal-btn modal-btn-primary" onClick={onClose}>
            Work with me →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TeamSection: React.FC = () => {
  const [activeDept, setActiveDept] = useState("All");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    injectDeferredStylesheet(TEAM_SECTION_FONT_STYLESHEET, "rathisoft-deferred-fonts-team");
  }, []);

  const filtered = TEAM_MEMBERS.filter((m) => {
    const matchesDept = activeDept === "All" || m.department === activeDept;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <>
    <main className="page-team app-main" id="team">
      <Breadcrumbs
        items={[
          { name: "Home", path: ROUTES.home },
          { name: "Team", path: ROUTES.team },
        ]}
      />
      <Seo
        title="Our Team | Developers & Designers | RathiSoft"
        description="Meet the RathiSoft team—developers, designers, and marketers on WordPress, Shopify, SEO, and web builds for clients in Pakistan and abroad."
      />

      <div className="hero">
        <div className="wrap">
          <div className="label">Our People</div>
          <h1 id="team-hero-heading" className="section-title">
            Meet the RathiSoft Team — Developers &amp; Designers in Lahore
          </h1>
          <p className="section-subtitle">
            Developers, designers, and marketers who ship WordPress, Shopify, web, and growth
            work—with the same people you meet here on your project. Learn how we operate on the{" "}
            <Link to={ROUTES.about}>about page</Link>.
          </p>
        </div>
      </div>

      <div className="team-content wrap">
      <h2 className="team-roster-sr-only">Team roster</h2>

      <div className="controls-row">
        <div className="filter-tabs">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              className={`filter-tab ${activeDept === dept ? "active" : ""}`}
              onClick={() => setActiveDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search by name or role…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search team members"
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="team-grid">
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} onSelect={setSelectedMember} />
          ))}
        </div>
      ) : (
        <p className="no-results">No team members found.</p>
      )}

      {/* Stats */}
      {/* <div className="stats-bar">
        {[
          { value: `${TEAM_MEMBERS.length}+`, label: "Team Members" },
          { value: "6+", label: "Departments" },
          { value: "50+", label: "Projects Delivered" },
          { value: "10+", label: "Years Experience" },
        ].map((stat) => (
          <div key={stat.label} className="stat-item">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div> */}

      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      </div>
    </main>

    <OnPageSeoSection
      sectionId="team-on-page-seo"
      heading="The people behind our delivery"
      lead={
        <>
          <p>
            Projects run better when strategy, engineering, and marketing sit in one agency—not
            three freelancers emailing files. The roles you see here are the
            people named in your proposal.
          </p>
          <p>
            Continuity matters on commerce launches and SEO retainers. We keep the same leads when
            possible so context is not lost mid-sprint—see{' '}
            <Link to={ROUTES.portfolio}>shipped work</Link>, our{' '}
            <Link to={ROUTES.packages}>package pricing</Link>, or
            {BLOG_POSTS[0] ? (
              <>
                {' '}
                <Link to={blogPath(BLOG_POSTS[0].slug)}>{BLOG_POSTS[0].h1}</Link>
              </>
            ) : (
              ' the blog'
            )}{' '}
            for how we think about delivery.
          </p>
        </>
      }
    >
      <p>
        We reference public standards such as{' '}
        <a href="https://developers.google.com/search/docs/essentials" target="_blank" rel="noopener noreferrer nofollow">
          Google Search Essentials
        </a>{' '}
        and{' '}
        <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer nofollow">
          Core Web Vitals
        </a>{' '}
        in reviews so stakeholders know how we benchmark quality.
      </p>
    </OnPageSeoSection>
    </>
  );
};

export default TeamSection;