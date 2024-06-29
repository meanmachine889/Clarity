declare module 'pdf-parse' {
    function pdf(buffer: Buffer): Promise<{
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      version: string;
      text: string;
    }>;
  
    export = pdf;
  }
  