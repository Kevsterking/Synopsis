function SynopsisHomepage(synopsis_instance) {

  this.on_load = new SynopsisEvent();

  this.synopsis_instance = synopsis_instance;

  // ---------------------------------------------------------------------------
  
  this.spawn = parent_generator => {
    place_in_dom(
      `
        <div class="synopsis-homepage" style="width:100%;height:100%;">
          <div style="position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);font-family:arial;">
            
            <h1 style="color: rgba(255, 255, 255, 0.85)">Synopsis</h1>
            <h2 style="color: rgba(255, 255, 255, 0.5)">Structure yourself</h2>
            
            <div style="margin-top: 20px;display: flex;gap: 100px;">
              
              <div style="display:flex;flex-direction:column;gap:10px;color: rgb(55, 148, 255);">
                <p>Create a new module</p>
                <p>Open an existing module</p>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;color: rgb(55, 148, 255);">
                <p>Create a new module</p>
                <p>Open an existing module</p>
              </div>


            </div>
          
          </div>
        </div>
      `,
      parent_generator
    ).then(this.on_load.trigger);
  }

}