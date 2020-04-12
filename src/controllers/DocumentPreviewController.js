const pdfJsLib = require('pdfjs-dist');
const path = require('path');

pdfJsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export default class DocumentPreviewController
{
    constructor(file=undefined)
    {
        this._file = file;
    }

    getPreviewData()
    {
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            switch(this.file.type)
            {
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    {
                        reader.readAsDataURL(this.file);
                        reader.onload = ()=>{
                            resolve({
                                src: reader.result,
                                info: this.file.name
                            });
                        }
                        reader.onerror = err => {
                            reject(err);
                        }
                        break;
                    }
                case 'application/pdf':
                    {   
                        reader.readAsArrayBuffer(this.file);
                        
                        reader.onload = ()=>{
                            
                            pdfJsLib.getDocument(new Uint8Array(reader.result)).then(pdf=>{
                                
                                pdf.getPage(1).then(page=>{
                                    
                                    const viewport = page.getViewport(1);
                                    const canvas = document.createElement('canvas');
                                    const canvasContext = canvas.getContext('2d');

                                    canvas.width = viewport.width;
                                    canvas.height = viewport.height;

                                    page.render({ canvasContext, viewport }).then(()=>{
                                        const pages = (pdf.numPages > 1) ? 
                                                    'páginas' : 'página';
                                        resolve({
                                            src: canvas.toDataURL('image/png'),
                                            info: `${pdf.numPages} ${pages}`
                                        })
                                    }).catch(err=>{ reject(err); });

                                }).catch(err=>{ reject(err); });

                            }).catch(err=>{ reject(err); });
                        };
                        
                        break;
                    }
                default:
                    {
                        reject();
                    }
            }
        });
    }

    get file()
    {
        return this._file;
    }

    set file(file)
    {
        this._file = file;
    }
}