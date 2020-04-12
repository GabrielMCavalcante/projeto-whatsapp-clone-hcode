export default class Format
{
    /* ----------- Shifts given text into camelCase format ----------- */
    static getCamelCase(text)
    {
        const div = document.createElement('div');

        div.innerHTML = `<div data-${text}="id"></div>`;

        return Object.keys(div.firstChild.dataset)[0];
    } // getCamelCase

    static getTime(duration)
    {
        const seconds = parseInt((duration / 1000) % 60);
        const minutes = parseInt((duration / (1000 * 60)) % 60);
        const hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hours > 0)
            return `${hours}:${minutes.toString().padStart(2, '0')}:
            ${seconds.toString().padStart(2, '0')}`;
        else
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } // getTime
}