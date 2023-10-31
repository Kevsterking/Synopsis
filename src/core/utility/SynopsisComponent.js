function SynopsisComponent() {

  this.before_load  = new SynopsisEvent();
  this.on_load      = new SynopsisEvent();
  this.after_load   = new SynopsisEvent();

  this.spawned = false;

  // ---------------------------------------------------------------------------

  this.on_load.subscribe(() => {
    this.spawned = true;
  });

  // ---------------------------------------------------------------------------

  this.get_dom_string = () => {
    return "<p>Default Component DOM String</p>"
  }

  this.spawn = parent_generator => {
  
    return place_in_dom(
      this.get_dom_string(), 
      parent_generator
    ).then(el => { 
      this.before_load.trigger(el); 
      return el;
    }).then(el => {
      this.on_load.trigger(el);
      return el;
    }).then(el => {
      this.after_load.trigger(el);
      return el;
    });
  
  }

}