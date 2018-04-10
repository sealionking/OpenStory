import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {GeneralUsers} from '../../shared/model/general-users';



@Injectable()
export class UsersService {
    public id: any;
    constructor(private router: ActivatedRoute) {
    }

    /**
     * Full path function
     * @param {Array<GeneralUsers>} contentList
     */
    addFullPath(contentList: Array<GeneralUsers>) {
        contentList.forEach(user => {
            user.viewUserUrl = 'http://' + user.viewUserUrl;
        });
    }

    getUserId(){
        this.router.params.subscribe(params => {
            console.log(params);
            console.log(+params['id']);
        });
    }
}
