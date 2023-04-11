import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

import { fileHash } from './fileHash'

// Add form to select the file to compute hash
document.querySelector('#app').innerHTML = `
  <div>

    <form id="file-form" method="post" enctype="multipart/form-data">
      <input type="file" name="file" id="file" />
    </form>
    
    <div id="size"></div> 
    <div id="result"></div>

  </div>
`


fileHash(document.querySelector('#file'), document.querySelector('#result'), document.querySelector('#size'))

