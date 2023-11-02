function SynopsisDocumentInterfaceController() {

  SynopsisBindManager.call(this);

  this.document_interface = null;

  // ---------------------------------------------------------------------------

  let dragging_editor = false;
  let keydowm_unbind_function = null;

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
    keydowm_unbind_function = this.add_bind(window.addEventListener, window.removeEventListener, ["keydown", content_key_listen]);
  }

  const mouse_leave_content = () => {
    keydowm_unbind_function ? this.remove_bind(keydowm_unbind_function) : 0;
  }

  const mousmouse_up_document_interfaceeup = () => {
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

  const bind = document_interface => {
    this.add_bind(() => { this.document_interface = document_interface; }, () => { this.document_interface = null; }, null);
    this.add_bind(document_interface.dom.content.addEventListener, document_interface.dom.content.removeEventListener, ["mouseenter", mouse_enter_content]);
    this.add_bind(document_interface.dom.content.addEventListener, document_interface.dom.content.removeEventListener, ["mouseleave", mouse_leave_content]);
    this.add_bind(document_interface.dom.root.addEventListener, document_interface.dom.root.removeEventListener, ["mouseup", mousmouse_up_document_interfaceeup]);
    this.add_bind(document_interface.dom.root.addEventListener, document_interface.dom.root.removeEventListener, ["mousedown", mouse_down_document_interface]);
    this.add_bind(document_interface.dom.root.addEventListener, document_interface.dom.root.removeEventListener, ["mousemove", mouse_move_document_interface]);
    this.add_bind(window.addEventListener, window.removeEventListener, ["mouseup", mousmouse_up_document_interfaceeup]);
  }

  // ---------------------------------------------------------------------------

  this.bind   = bind;

}