function SynopsisDocumentInterfaceController() {

  this.document_interface = null;

  // ---------------------------------------------------------------------------

  let dragging_editor = false;

  // ---------------------------------------------------------------------------

  const save_document = () => {
    save_global(this.document_interface.document.path, this.document_interface.document.get_save_string());
  }

  const content_key_listen = e => {
    if (e.key == "s" && e.ctrlKey) {
      e.preventDefault();
      save_document();
    }
  }

  const mouse_enter_content = () => {
    window.addEventListener("keydown", content_key_listen);
  }

  const mouse_leave_content = () => {
    window.removeEventListener("keydown", content_key_listen);
  }

  const lift_mouse = () => {
    if (dragging_editor) {
      dragging_editor = false;
    }
  }

  const mouse_down_document_interface = e => {

    const L = this.document_interface.dom.root.clientWidth - this.document_interface.dom.editor.offsetWidth;

    if (e.x > L - 10 && e.x < L + 10) {
      dragging_editor = true;
      this.document_interface.dom.root.style.cursor = "w-resize";
    }

  }

  const mouse_move_document_interface = e => {

    const L = this.document_interface.dom.root.clientWidth - this.document_interface.dom.editor.offsetWidth;

    if (dragging_editor) {
      this.document_interface.dom.editor.style.width = this.document_interface.dom.root.clientWidth - e.x + "px";
    } else {
      if (e.x > L - 10 && e.x < L + 10) {
        this.document_interface.dom.root.style.cursor = "w-resize";
      } else {
        this.document_interface.dom.root.style.cursor = "default";
      }
    }

  }

  const unbind = () => {
    
    this.document_interface.dom.content.removeEventListener("mouseenter", mouse_enter_content);
    this.document_interface.dom.content.removeEventListener("mouseleave", mouse_leave_content);
    this.document_interface.dom.root.removeEventListener("mouseup", lift_mouse);
    this.document_interface.dom.root.removeEventListener("mousedown", mouse_down_document_interface);
    this.document_interface.dom.root.removeEventListener("mousemove", mouse_move_document_interface);

    window.removeEventListener("mouseup", lift_mouse);

    this.document_interface = null;

  }

  const bind = document_interface => {

    this.document_interface = document_interface;

    this.document_interface.dom.content.addEventListener("mouseenter", mouse_enter_content);
    this.document_interface.dom.content.addEventListener("mouseleave", mouse_leave_content);
    this.document_interface.dom.root.addEventListener("mouseup", lift_mouse);
    this.document_interface.dom.root.addEventListener("mousedown", mouse_down_document_interface);
    this.document_interface.dom.root.addEventListener("mousemove", mouse_move_document_interface);

    window.addEventListener("mouseup", lift_mouse);

  }

  // ---------------------------------------------------------------------------

  this.bind   = bind;
  this.unbind = unbind;


}