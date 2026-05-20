export interface SocialLinks {
  linkedin?: string
  github?: string
  twitter?: string
  email?: string
  whatsapp?: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  bio: string
  image: string
  skills: string[]
  marketing: string[]
  timeline: { period: string; title: string; desc: string }[]
  experience: string
  location: string
  social: SocialLinks
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Suneel Pirkash',
    role: 'Senior Project Manager, Full Stack Developer, WordPress Developer & Shopify Expert',
    department: 'Leadership',
    bio:
      "I'm Suneel Pirkash — a Senior Project Manager, Full Stack, WordPress developer and Shopify expert with 5+ years of experience building fast, beautiful, and conversion-ready websites for businesses around the world.\n\nFrom custom WordPress themes to fully configured Shopify stores, I handle everything — design, development, plugins, payment gateways, SEO setup, and ongoing support. My clients get a partner, not just a developer.\n\nAt Rathisoft, I combine web development with digital marketing, branding, and content strategy — so your website doesn't just look great, it actually brings in business.\n\nI've worked with clients across UK, US, Australia, Europe, and UAE — healthcare clinics, real estate agencies, eCommerce brands, and startups. Every project gets my full attention, on time, every time.",
    image: '/images/suneel.webp',
    skills: [
      'Project Manager',
      'Full Stack Developer',
      'WordPress Developer',
      'Shopify Expert',
    ],
    marketing: [
      'SEO Optimization',
      'Speed Optimization',
      'Social Media',
      'PPC / Google Ads',
      'Email Marketing',
      'Branding & Design',
      'Content Strategy',
    ],
    timeline: [
      {
        period: '2024 – Now',
        title: 'Founder — Rathisoft',
        desc: 'Building a full-service digital agency offering WordPress, Shopify, SEO, and marketing to clients worldwide.',
      },
      {
        period: '2021 – 2024',
        title: 'Freelance WordPress & Shopify Developer',
        desc: '50+ projects delivered across UK, US, UAE — custom themes, eCommerce stores, and digital marketing campaigns.',
      },
      {
        period: '2019 – 2021',
        title: 'Junior Web Developer',
        desc: 'Started career building WordPress websites and learning digital marketing fundamentals.',
      },
    ],
    experience: '5+ Years',
    location: 'Lahore, Pakistan',
    social: {
      linkedin: 'https://www.linkedin.com/in/suneelpirkash',
      email: 'info@rathisoft.com',
      whatsapp: 'https://wa.me/923342651544',
    },
  },
  {
    id: 2,
    name: 'Muhammad Tayyab Shahid',
    role: 'UI/UX Designer | Branding Expert & Graphic Designer',
    department: 'Design',
    bio:
      "I'm Muhammad Tayyab Shahid — a UI/UX & Graphic Designer with 4+ years of experience creating clean, modern, and conversion-focused designs for businesses around the world.\n\nFrom intuitive mobile apps to high-performing websites and SaaS dashboards, I handle everything — research, wireframing, prototyping, and visually refined UI. My goal is simple: to design experiences that not only look great but also improve usability and drive real results.\n\nI work with startups, entrepreneurs, and growing businesses across multiple industries, delivering designs that align with user needs and business goals. My clients get a reliable partner who values clear communication, attention to detail, and on-time delivery.\n\nUsing tools like Figma and Adobe XD, I create user-centered designs along with complete branding solutions — including landing pages, eCommerce interfaces, mobile app UI, logos, and social media creatives.\n\nEvery project gets my full focus, ensuring quality, consistency, and designs that truly perform.",
    image: '/images/sasadwq.webp',
    skills: [
      
      'UI/UX Design in FIGMA',
      'Wireframing & Prototyping',
      'Web & Mobile App Design',
      'Design Systems',
      'Responsive Design',
      'Branding & Identity',
      'Social Media Creatives',
      'Ad Creatives',
    ],
    marketing: [
      'UX Strategy',
      'Landing Page Design',
      'E-commerce Design',
      'Mobile App UI',
      'Branding & Identity',
      'Social Media Creatives',
      'Ad Creatives',
    ],
    timeline: [
      {
        period: '2024 – Now',
        title: 'Co-partner — Backbone, Everything at RathiSoft',
        desc: 'Co-leading design and product delivery with a focus on clean, modern, and user-centered experiences.',
      },
      {
        period: '2021 – Now',
        title: 'UI/UX & Graphic Designer',
        desc: '70+ projects delivered across USA, UK, UAE, EUR, AUS — research, wireframing, prototyping, and visually refined UI.',
      },
      {
        period: '2020 – Now',
        title: 'Software Developer',
        desc: 'Delivered multiple projects globally — MERN, React, Python, C and C++.',
      },
    ],
    experience: '4+ Years',
    location: 'DG Khan, Pakistan',
    social: {
      linkedin: '#',
    },
  },
  {
    id: 3,
    name: 'Hirtik Kumar',
    role: 'Web Developer & WordPress Specialist',
    department: 'Engineering',
    bio:
      'I am Hirtik Kumar, a professional Web Developer specializing in WordPress development and modern web technologies. I am currently working at Rathisoft, where I contribute as a Web Developer and WordPress Specialist, building and maintaining dynamic, responsive, and user-friendly websites.\n\nProfessional Summary\nI am a dedicated and detail-oriented developer with hands-on experience in designing, developing, and customizing websites. My focus is on creating high-performance web solutions that meet client requirements and industry standards.\n\nAt Rathisoft, I work on real-world projects involving WordPress development, website customization, and front-end improvements.\n\nSkills & Expertise\n• WordPress Development & Customization\n• Website Design & Development\n• HTML, CSS, JavaScript\n• Bootstrap & Responsive Design\n• Basic React.js\n• PHP & WordPress Theme Editing\n• Website Optimization & Bug Fixing\n\nProfessional Experience\nI am currently working at Rathisoft as a Web Developer and WordPress Developer. In this role, I handle website development tasks, customize WordPress themes and plugins, and ensure responsive and optimized web performance.\n\nEducation\nI am continuing my academic studies while actively working in the web development field. This combination of education and practical experience is helping me strengthen my technical and professional skills.\n\nGoals & Vision\nMy goal is to become an expert Full Stack Web Developer and WordPress specialist. I aim to work on advanced projects, improve my backend skills, and grow as a professional developer in the software industry.\n\nPersonal Attributes\n• Hardworking and consistent learner\n• Strong problem-solving skills\n• Passionate about web technologies\n• Team player with professional attitude\n• Quick learner and adaptable\n\nContact & Collaboration\nI am open to collaboration, freelance projects, and professional opportunities in web development and WordPress.',
    image: '/images/hirtik.webp',
    skills: [
      'WordPress Development',
      'Website Design & Development',
      'HTML, CSS, JavaScript',
      'Bootstrap & Responsive Design',
      'Basic React.js',
      'PHP & WordPress Theme Editing',
      'Website Optimization & Bug Fixing',
    ],
    marketing: [
      'Hardworking & consistent learner',
      'Strong problem-solving',
      'Passionate about web tech',
      'Team player',
      'Quick learner & adaptable',
      'Open to collaboration & freelance',
    ],
    timeline: [
      {
        period: 'Now',
        title: 'Web Developer & WordPress Developer — Rathisoft',
        desc: 'Website development, WordPress theme and plugin customization, responsive layouts, and optimized web performance.',
      },
      {
        period: 'Ongoing',
        title: 'Academic studies + hands-on development',
        desc: 'Continuing education alongside real-world projects to strengthen technical and professional skills.',
      },
      {
        period: 'Vision',
        title: 'Full Stack & WordPress specialist',
        desc: 'Growing backend skills and taking on advanced projects in the software industry.',
      },
    ],
    experience: 'Web Developer @ Rathisoft',
    location: 'Islamabad, Pakistan',
    social: {
      linkedin: '#',
      email: 'info@rathisoft.com',
    },
  },
]
