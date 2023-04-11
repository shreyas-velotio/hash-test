import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

import { fileHash } from './fileHash'

// add input textbox of number
document.querySelector('#app').innerHTML = `
  <div>

    <form id="file-form" method="post" enctype="multipart/form-data" >
      <input type="file" name="file" id="file" multiple="multiple" />
    </form>

    <h2 id="status"></h2> 
    <div id="result"></div>

  </div>
`


fileHash(document.querySelector('#file'), document.querySelector('#result'), document.querySelector('#status'), document.querySelector('#num'))

