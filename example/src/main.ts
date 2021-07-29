import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

import('./name').then(({ getName }) => {
  app.innerHTML = `
  <h1>Hello Vite from ${getName()}!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
})
