import * as pdfjsLib from 'pdfjs-dist';

import {
    PDFDocumentProxy,
    PDFLoadingTask,
    PDFPageProxy,
    TextContent,
    TextContentItem,
    PDFAnnotations,
    PDFAnnotationData
} from 'pdfjs-dist';

// Current @types/pdfjs-dist isn't correct for annotations
interface Annotation extends PDFAnnotationData {
    contents: string;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs1.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';

describe('PDF', () => {
    before(() => {
        cy.init();
    });

    beforeEach(() => {
        cy.initPDFWorker();
    });

    it('should print pdf', done => {
        cy.window().then(win => {
            cy.stub(win, 'open').callsFake(async (url: string) => {
                const pdfDoc: PDFDocumentProxy = await loadPdf(url);

                expect(pdfDoc).not.eq(null);
                expect(pdfDoc.numPages).eq(3);

                done();
            });
        });

        cy.get('button').click();
    });

    it('should contain content', done => {
        cy.window().then(win => {
            cy.stub(win, 'open').callsFake(async (url: string) => {
                const pdfDoc: PDFDocumentProxy = await loadPdf(url);

                await testPageContent(pdfDoc, 1, 'A');

                done();
            });
        });

        cy.get('button').click();
    });

    it('should contain annotations', done => {
        cy.window().then(win => {
            cy.stub(win, 'open').callsFake(async (url: string) => {
                const pdfDoc: PDFDocumentProxy = await loadPdf(url);

                const page: PDFPageProxy = await pdfDoc.getPage(1);
                const annotations: PDFAnnotations = await page.getAnnotations();

                expect(annotations).not.eq(null);
                expect(((annotations as unknown) as Annotation[]).length).eq(1);
                expect(((annotations as unknown) as Annotation[])[0].contents).eq('Hello World');

                done();
            });
        });

        cy.get('button').click();
    });
});

const loadPdf = async (url: string): Promise<PDFDocumentProxy> => {
    try {
        const res: Response = await fetch(url);
        const blob: Blob = await res.blob();

        const pdf: string | ArrayBuffer = await convert(blob);

        return loadDocument(pdf as ArrayBuffer);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const convert = (blob: Blob): Promise<string | ArrayBuffer> => {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
        const fileReader: FileReader = new FileReader();

        fileReader.onloadend = async $event => {
            resolve(fileReader.result);
        };

        fileReader.onerror = error => {
            reject(error);
        };

        fileReader.readAsArrayBuffer(blob);
    });
};

const loadDocument = async (data: ArrayBuffer): Promise<PDFDocumentProxy> => {
    return new Promise<PDFDocumentProxy>(resolve => {
        const loadingTask: PDFLoadingTask<PDFDocumentProxy> = pdfjsLib.getDocument(data);

        loadingTask.promise.then(
            async doc => {
                resolve(doc);
            },
            err => {
                console.error(err);
                resolve(null);
            }
        );
    });
};

const testPageContent = async (pdfDoc: PDFDocumentProxy, pageIndex: number, expectedText: string) => {
    const page: PDFPageProxy = await pdfDoc.getPage(pageIndex);
    const textContent: TextContent = await page.getTextContent();

    expect(textContent).not.eq(null);
    expect(textContent.items).not.eq(null);

    const text: string[] = textContent.items.map((item: TextContentItem) => item.str);

    expect(text).not.eq(null);
    expect(text.join('').trim()).eq(expectedText);
};
