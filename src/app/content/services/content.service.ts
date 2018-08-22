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

    /**
     * Allows us to manipulate the live form data in order to send the correct data on submit
     * @param liveData
     * @param temp
     * @param list
     * @return {any}
     */
    liveDatacheck(liveData, temp, list) {
        for (const i in liveData) {
            const prop = liveData[i];
            if (prop instanceof Object && Object.keys(prop).length > 0) {
                const propLength = Object.keys(prop).length;
                for (let j = 0; j < propLength; j++) {
                    const propItem = prop[j];
                    if (propItem instanceof Object) {
                        if (Object.keys(propItem).length > 0) {
                            for (const k in propItem) {
                                if (!propItem[k] && !(propItem[k] instanceof Object)) {
                                    if (propItem.hasOwnProperty(k) && propItem[k] !== 0 &&
                                        propItem[k] !== false && list[i] !== 'radios') {
                                        delete propItem[k];
                                    }
                                }
                                temp = liveData;
                            }
                        }
                    } else {
                        prop.splice(j, 1);
                    }
                }
            }
        }
        return temp;
    }
}
