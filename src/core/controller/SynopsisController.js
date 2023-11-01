function SynopsisController() {

  this.document_interface = null;

  this.document_interface_controller  = new SynopsisDocumentInterfaceController();
  this.diagram_controller             = new SynopsisDiagramController();
  this.scope_controller               = new SynopsisScopeController();

  // ---------------------------------------------------------------------------

  const load_scope_controller = () => {
    this.scope_controller.bind(this.document_interface);
  }

  const load_diagram_controller = () => {
    this.diagram_controller.bind(this.document_interface);
  }

  const load_document_interface_controller = () => {
    this.document_interface_controller.bind(this.document_interface);
  }

  const unbind = () => {

    this.document_interface.on_load.unsubscribe(load_document_interface_controller);
    this.document_interface.on_load.unsubscribe(load_diagram_controller);
    this.document_interface.on_load.unsubscribe(load_scope_controller);

    this.document_interface_controller.unbind();
    this.diagram_controller.unbind();
    this.scope_controller.unbind();

    this.document_interface = null;

  }

  const bind = document_interface => {

    this.document_interface = document_interface;

    document_interface.on_load.subscribe(load_document_interface_controller)
    document_interface.on_load.subscribe(load_diagram_controller);
    document_interface.on_load.subscribe(load_scope_controller);

  }

  // ---------------------------------------------------------------------------

  this.bind   = bind;
  this.unbind = unbind;

}