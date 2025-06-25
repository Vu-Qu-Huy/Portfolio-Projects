
export const samplePosts = [
  {
    id: '1',
    title: 'Mastering React Hooks: A Deep Dive',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05590?w=800&h=400&fit=crop',
    category: 'React',
    excerpt: 'Explore the full potential of React Hooks, from useState to custom hooks. Elevate your component logic and reusability.',
    tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
    date: '2025-06-15',
    content: `
# Mastering React Hooks

React Hooks have revolutionized the way we write components. Let's take a deep dive.

## useState
The most basic hook. It lets you add state to functional components.

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect
This hook lets you perform side effects in function components. It's a close replacement for \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\`.

\`\`\`javascript
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]); // Only re-run the effect if count changes
\`\`\`

## Custom Hooks
The real power comes from creating your own hooks.

\`\`\`javascript
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  // ... (add effect to update on resize)
  return width;
}
\`\`\`
`,
    poll: {
      question: 'Which hook do you use most often?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      votes: [120, 95, 60, 30]
    }
  },
  {
    id: '2',
    title: 'The Art of CSS Grid and Flexbox',
    image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=400&fit=crop',
    category: 'CSS',
    excerpt: 'Unlock modern and responsive layouts with the power of CSS Grid and Flexbox. Say goodbye to float hacks forever.',
    tags: ['CSS', 'Grid', 'Flexbox', 'Layout', 'Responsive'],
    date: '2025-06-12',
    content: `
# The Art of CSS Grid and Flexbox

Modern CSS gives us powerful tools for layout.

## Flexbox
Flexbox is designed for one-dimensional layouts.

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid
Grid is designed for two-dimensional layouts.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`
`,
    poll: {
      question: 'Which layout model do you prefer for overall page structure?',
      options: ['CSS Grid', 'Flexbox', 'A mix of both', 'Older methods (floats)'],
      votes: [150, 40, 180, 5]
    }
  },
  {
    id: '3',
    title: 'TypeScript for JavaScript Developers',
    image: 'https://images.unsplash.com/photo-1581136451433-03c78a127a69?w=800&h=400&fit=crop',
    category: 'JavaScript',
    excerpt: 'Learn how TypeScript can bring static typing and scalability to your JavaScript projects, catching errors before they run.',
    tags: ['TypeScript', 'JavaScript', 'Tooling', 'Best Practices'],
    date: '2025-06-10',
    content: `
# TypeScript for JavaScript Developers

Adding types to JavaScript can seem daunting, but it's worth it.

## Why TypeScript?
- Catch errors early
- Better autocompletion
- Improved readability and maintainability

## Basic Types
\`\`\`typescript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";

function greet(name: string): string {
  return "Hello, " + name;
}
\`\`\`
`,
    poll: {
      question: 'Have you adopted TypeScript in your projects?',
      options: ['Yes, extensively', 'Yes, a little', 'Not yet, but planning to', 'No, and not planning to'],
      votes: [200, 75, 50, 15]
    }
  }
];
