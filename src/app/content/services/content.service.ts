import {Injectable} from '@angular/core';
import {Content} from '../model/content';

/**
 * Content service that handles all functions related to Content
 */
@Injectable()
export class ContentService {
    /**
     * @ignore
     */
    constructor() {
    }

    /**
     * Summaries the text provided
     * @param size
     * @return {Content}
     */
    summary(size): Content {
        const summary = size.slice(0, 300);
        return summary;
    }

    /**
     * Add full path to node view url.
     * @param {Array<Content>} contentList - The list of content entity.
     */
    addFullPath(contentList: Array<Content>) {
        contentList.forEach(content => {
            content.viewUrl = 'http://' + content.viewUrl;
        });
    }
}
