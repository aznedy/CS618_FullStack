import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import scroogeMcDuck from './assets/ScroogeMcDuck.svg'
import confetti from 'canvas-confetti'
import './App.css'

function App() {
  const [count, setCount] = useState(5)

  function handleCelebrate() {
    confetti({ particleCount: 150, spread: 88, origin: { y: 0.6 } })
  }

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank' rel='noreferrer'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank' rel='noreferrer'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <div>
        <a href='https://vectorizer.io' target='_blank' rel='noreferrer'>
          <img
            src={scroogeMcDuck}
            width='1000'
            className='logo McDuck'
            alt='Scrooge McDuck'
          />
        </a>
      </div>
      <h1>CS618 Vite + React + McDuck</h1>
      <div className='card'>
        <button
          onClick={() => {
            if (count <= 1) {
              handleCelebrate()
              setCount(5)
            } else {
              setCount(count - 1)
            }
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

/* import { Post } from './components/Post.jsx'

export function App() {
  return (
    <Post title='Full-Stack React Projects'
    contents="Let's become full-stack developers!"
    author='Daniel Bugl'
    />
  )
}


import { CreatePost } from './components/CreatePost.jsx'
export function App() {
  return <CreatePost />
}


import { PostList } from './components/PostList.jsx'
const posts = [
  {
    title: 'Full-Stack React Projects',
    contents: "Let's become full-stack developers!",
    author: 'Daniel Bugl',
  },
  { title: 'Hello React!' },
]
export function App() {
  return <PostList posts={posts} />
}
*/
