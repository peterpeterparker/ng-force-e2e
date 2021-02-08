import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    openPdf(): void {
        window.open('/assets/a.pdf', '_blank');
    }
}
