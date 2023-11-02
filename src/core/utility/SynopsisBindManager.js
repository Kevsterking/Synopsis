
function SynopsisBindManager() {

  this.unbinds = new Map();

  this.add_bind = (bindf, unbindf, bind_args=[], unbind_args=null) => {

    if (!(bind_args instanceof Array)) {
      bind_args = [bind_args];
    } 

    if (!unbind_args) unbind_args = bind_args;

    if (!(unbind_args instanceof Array)) {
      unbind_args = [unbind_args]; 
    }

    bindf ? bindf(...bind_args) : 0;

    const unbind_id = (...args) => { unbindf(...args); }; 

    this.unbinds.set(unbind_id, unbind_args ? unbind_args : bind_args);
    
    return unbind_id;

  }

  this.remove_bind = unbind_id => {
    unbind_id(...this.unbinds.get(unbind_id));
    this.unbinds.delete(unbind_id);
  }

  this.unbind = () => {
    
    this.unbinds.forEach((args, f) => {
      f ? f(...args) : 0;
    });

    this.unbinds.clear();

  }

}