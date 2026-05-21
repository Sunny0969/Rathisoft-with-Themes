export type TechItem = {
  name: string
  slug: string
}

export type TechCategory = {
  id: string
  label: string
  items: TechItem[]
}

export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'ai-ml',
    label: 'AI & ML',
    items: [
      { name: 'OpenAI', slug: 'openai' },
      { name: 'Anthropic', slug: 'anthropic' },
      { name: 'Hugging Face', slug: 'huggingface' },
      { name: 'TensorFlow', slug: 'tensorflow' },
      { name: 'PyTorch', slug: 'pytorch' },
      { name: 'scikit-learn', slug: 'scikitlearn' },
      { name: 'LangChain', slug: 'langchain' },
      { name: 'Pandas', slug: 'pandas' },
      { name: 'NumPy', slug: 'numpy' },
      { name: 'Jupyter', slug: 'jupyter' },
      { name: 'MLflow', slug: 'mlflow' },
      { name: 'Keras', slug: 'keras' },
      { name: 'OpenCV', slug: 'opencv' },
      { name: 'spaCy', slug: 'spacy' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextdotjs' },
      { name: 'Vue.js', slug: 'vuedotjs' },
      { name: 'Angular', slug: 'angular' },
      { name: 'Svelte', slug: 'svelte' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'Tailwind CSS', slug: 'tailwindcss' },
      { name: 'Vite', slug: 'vite' },
      { name: 'Webpack', slug: 'webpack' },
      { name: 'Redux', slug: 'redux' },
      { name: 'HTML5', slug: 'html5' },
      { name: 'CSS3', slug: 'css3' },
      { name: 'Sass', slug: 'sass' },
      { name: 'Bootstrap', slug: 'bootstrap' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Database',
    items: [
      { name: 'Node.js', slug: 'nodedotjs' },
      { name: 'Python', slug: 'python' },
      { name: 'Django', slug: 'django' },
      { name: 'FastAPI', slug: 'fastapi' },
      { name: 'Express', slug: 'express' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'MySQL', slug: 'mysql' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Redis', slug: 'redis' },
      { name: 'GraphQL', slug: 'graphql' },
      { name: 'Prisma', slug: 'prisma' },
      { name: 'Supabase', slug: 'supabase' },
      { name: 'Firebase', slug: 'firebase' },
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'Laravel', slug: 'laravel' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    items: [
      { name: 'React Native', slug: 'react' },
      { name: 'Flutter', slug: 'flutter' },
      { name: 'Kotlin', slug: 'kotlin' },
      { name: 'Swift', slug: 'swift' },
      { name: 'Android', slug: 'android' },
      { name: 'iOS', slug: 'apple' },
      { name: 'Expo', slug: 'expo' },
      { name: 'Ionic', slug: 'ionic' },
      { name: 'Capacitor', slug: 'capacitor' },
      { name: '.NET MAUI', slug: 'dotnet' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    items: [
      { name: 'AWS', slug: 'amazonaws' },
      { name: 'Azure', slug: 'microsoftazure' },
      { name: 'Google Cloud', slug: 'googlecloud' },
      { name: 'Docker', slug: 'docker' },
      { name: 'Kubernetes', slug: 'kubernetes' },
      { name: 'Terraform', slug: 'terraform' },
      { name: 'GitHub Actions', slug: 'githubactions' },
      { name: 'Jenkins', slug: 'jenkins' },
      { name: 'Datadog', slug: 'datadog' },
      { name: 'CircleCI', slug: 'circleci' },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    items: [
      { name: 'Figma', slug: 'figma' },
      { name: 'Sketch', slug: 'sketch' },
      { name: 'Adobe XD', slug: 'adobexd' },
      { name: 'Framer', slug: 'framer' },
      { name: 'InVision', slug: 'invision' },
      { name: 'Canva', slug: 'canva' },
      { name: 'Zeplin', slug: 'zeplin' },
      { name: 'Webflow', slug: 'webflow' },
      { name: 'Miro', slug: 'miro' },
      { name: 'Adobe', slug: 'adobe' },
    ],
  },
]

export const TECH_STACK_TOTAL = TECH_CATEGORIES.reduce((n, c) => n + c.items.length, 0)
