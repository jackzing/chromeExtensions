import React from 'react'
import ReactDOM from 'react-dom'
import { Frame } from 'chrome-sidebar'
import { url } from './settings'

if (Frame.isReady()) {
  Frame.toggle()
} else {
  boot()
}

function boot() {
  const root = document.createElement('div')
  root.style.cssText="width:100%;"
  document.body.appendChild(root)

  const  child = document.createElement('div')
  child.innerHTML = "<h2>hello, world!</h2>";
  const furl = "https://www.google.com";
  const App = (
    <Frame url={url} />
  )

  ReactDOM.render(App, root)
}
