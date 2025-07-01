import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
  transform(text, search) {
    text = '' + (text || '');
    if (!search || search === '') {
      return text;
    }
    search = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const hlRegex = new RegExp(search, 'ig');
    return text.replace(hlRegex, '<span class="text-highlight">$&</span>');
  }
}
