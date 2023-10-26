function Synopsis() {
    
    this.workspace          = new SynopsisWorkspace();
    this.document_interface = new SynopsisDocumentInterface();

    // ---------------------------------------------------------------------------

    this.spawn = this.workspace.spawn;

}