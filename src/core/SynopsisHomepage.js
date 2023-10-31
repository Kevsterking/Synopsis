function SynopsisHomepage(synopsis_instance) {

  SynopsisComponent.call(this);

  this.synopsis_instance = synopsis_instance;

  // ---------------------------------------------------------------------------
  
  this.get_dom_string = () => {
    return `
      <div class="synopsis-homepage" style="width:100%;height:100%;">
        <div style="position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);font-family:arial;">
          
          <h1 style="font-size: 47px;color: rgba(255, 255, 255, 0.85)">Synopsis</h1>
          <h2 style="color: rgba(255, 255, 255, 0.5)">Structure yourself</h2>
          
          <div style="margin-top: 40px;display: flex;gap: 100px;">
            
            <div style="display:flex;flex-direction:column;gap:10px;">
              <p class="homepage-link">Create new module ⇒</p>
              <p class="homepage-link">Open existing module ⇒</p>
            </div>

            <div style="display:flex;flex-direction:column;gap:10px;">
              <p class="homepage-link">Help ⇒</p>
            </div>

            <style>
              p.homepage-link {
                cursor: pointer;
                color: rgb(55, 148, 255);
                font-size: 15px;
              }
              
              p.homepage-link:hover {
                text-decoration: underline;
              }

            </style>

          </div>
        
        </div>
      </div>
    `
  }

}