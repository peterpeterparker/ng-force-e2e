export const download = (filename: string, url: string) => {
    const a: HTMLAnchorElement = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    a.href = url;
    a.download = filename;

    a.click();

    window.URL.revokeObjectURL(url);

    if (a && a.parentElement) {
        a.parentElement.removeChild(a);
    }
};
