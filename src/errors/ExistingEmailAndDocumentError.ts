export class ExistingEmailAndDocumentError extends Error {
    
    email: boolean;
    document: boolean;
  
    constructor(email: boolean, document: boolean) {
      super('Email ou Documento existente');
      this.email = email;
      this.document = document;
    }

}