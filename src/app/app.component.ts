import { Component } from '@angular/core';

import { download } from './utils/download.utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    downloadPdf(): void {
        download('a.pdf', '/assets/a.pdf');
    }
}
