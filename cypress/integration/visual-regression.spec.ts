import Pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

describe('Visual Regression', () => {
    before(() => {
        cy.init();
    });

    it('should look the same', () => {
        compareScreenshots('visual-regression.spec.ts');
    });
});

export const compareScreenshots = path => {
    const screenshotNameTimestamp = `screenshot-${new Date().getTime()}`;

    cy.screenshot(screenshotNameTimestamp, { capture: 'viewport' });

    cy.readFile(`${Cypress.config('screenshotsFolder')}/${path}/${screenshotNameTimestamp}.png`, 'base64').then(
        screenshot => {
            cy.readFile(`${Cypress.config('fileServerFolder')}/snapshots/reference.png`, 'base64').then(snapshot => {
                visualRegression(
                    screenshot,
                    snapshot,
                    `${Cypress.config('screenshotsFolder')}/insert.spec.ts/${screenshotNameTimestamp}-result.png`
                );
            });
        }
    );
};

const convertToPng = (base64Data: string): Buffer => {
    const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    return new Buffer(data, 'base64');
};

const visualRegression = (screenshot: string, snapshot: string, output: string) => {
    const img1 = PNG.sync.read(convertToPng(screenshot));
    const img2 = PNG.sync.read(convertToPng(snapshot));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = Pixelmatch(img1.data, img2.data, diff.data, width, height, {
        threshold: 0.1
    });

    cy.writeFile(output, PNG.sync.write(diff).toString('binary'), { encoding: 'binary' }).then(() => {
        expect(numDiffPixels).equals(0);
    });
};
