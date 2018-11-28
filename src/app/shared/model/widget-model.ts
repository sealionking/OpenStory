export interface WidgetModel {
    type: string;
    weight: any;
    name: string;
    key: string;
    dataStatic?: boolean;
    id: any;
    viewMoreLink?: string;
    viewMore?: boolean;
    filterItem?: string;
    expand: boolean;
}

export interface SavedWidget {
    type: number;
}

export const widgetsData = {
    contentList: [
        {
            body: 'Body example',
            changed: 1532691835,
            created: 1532691835,
            fieldImage: '../../../../assets/images/default.svg',
            osContentPicture: {
                id: '',
                url: '../../../../assets/images/default.svg'
            },
            id: 0,
            langcode: 'en',
            nid: 1,
            status: 12,
            title: 'Example Title',
            type: 'example content type',
            userId: 'example',
            username: {
                name: 'Demo user',
                userPicture: ''
            },
            viewUrl: 'https://openstory.com',
            myType: 'demo',
            contentMachineName: 'content'
        },
        {
            body: 'Body example',
            changed: 1532691835,
            created: 1532691835,
            fieldImage: '../../../../assets/images/default.svg',
            osContentPicture: [{
                id: '',
                url: '../../../../assets/images/default.svg'
            }],
            id: 0,
            langcode: 'en',
            nid: 1,
            status: 12,
            title: 'Example Title',
            type: 'example content type',
            userId: 'example',
            username: {
                name: 'Demo user',
                userPicture: ''
            },
            viewUrl: 'https://openstory.com',
            myType: 'demo',
            contentMachineName: 'content'
        },
        {
            body: 'Body example',
            changed: 1532691835,
            created: 1532691835,
            fieldImage: '../../../../assets/images/default.svg',
            osContentPicture: [{
                id: '',
                url: '../../../../assets/images/default.svg'
            }],
            id: 0,
            langcode: 'en',
            nid: 1,
            status: 12,
            title: 'Example Title',
            type: 'example content type',
            userId: 'example',
            username: [{
                name: 'Demo user',
                userPicture: ''
            }],
            viewUrl: 'https://openstory.com',
            myType: 'demo',
            contentMachineName: 'content'
        },
    ],
    commentList: [
        {
            username: {
                name: 'demo user',
                userPicture: '../../../../assets/images/avatar.svg'
            },
            commentBody: 'demo comment',
            commentType: 'demo',
            viewUrl: 'url',
            changed: '123123213',
            created: 123123213,
            entityId: '213',
            entityType: 'comment',
            id: '0',
            status: true,
            subject: 'demo comment',
            type: 'demo',
            userid: 'demo',
        },
        {
            username: {
                name: 'demo user',
                userPicture: '../../../../assets/images/avatar.svg'
            },
            commentBody: 'demo comment',
            commentType: 'demo',
            viewUrl: 'url',
            changed: '123123220',
            created: 123123220,
            entityId: '213',
            entityType: 'comment',
            id: '0',
            status: true,
            subject: 'Demo comment',
            type: 'demo',
            userid: 'demo',
        }
    ],
    usersList: [
        {
            access: '1970-01-01T00:00:00+00:00',
            changed: '2018-07-04T15:33:59+00:00',
            created: '2018-07-04T15:33:59+00:00',
            defaultLangcode: true,
            fieldFirstName: 'MockFirstName',
            fieldLastName: 'MockLastName',
            fieldUserC: [{
                cid: 0,
                comment_count: 0,
                last_comment_name: null,
                last_comment_timestamp: 1530718439,
                last_comment_uid: 0,
                status: 2
            }],
            init: '',
            langcode: 'en',
            login: 'never',
            mail: 'mock@mock.com',
            metatag: [{
                title: 'Caterina Dinu | Open Story',
                canonical_url: 'https://openstory.com',
                description: 'Open Story'
            }],
            name: 'Mock User',
            preferredAdminLangcode: '',
            preferredLangcode: ['en'],
            publishedArticles: 0,
            roles: [{id: 'authenticated', label: 'Authenticated user'}],
            status: true,
            timezone: 'UTC',
            uid: 999,
            userPicture: ['../../../../assets/images/avatar.svg'],
            uuid: 'mock',
            viewUserUrl: 'mock',
        },
        {
            access: '1970-01-01T00:00:00+00:00',
            changed: '2018-07-04T15:33:59+00:00',
            created: '2018-07-04T15:33:59+00:00',
            defaultLangcode: true,
            fieldFirstName: 'MockFirstName',
            fieldLastName: 'MockLastName',
            fieldUserC: [{
                cid: 0,
                comment_count: 0,
                last_comment_name: null,
                last_comment_timestamp: 1530718439,
                last_comment_uid: 0,
                status: 2
            }],
            init: '',
            langcode: 'en',
            login: 'never',
            mail: 'mock@mock.com',
            metatag: [{
                title: 'Caterina Dinu | Open Story',
                canonical_url: 'https://openstory.com',
                description: 'Open Story'
            }],
            name: 'Mock User',
            preferredAdminLangcode: '',
            preferredLangcode: ['en'],
            publishedArticles: 0,
            roles: [{id: 'authenticated', label: 'Authenticated user'}],
            status: true,
            timezone: 'UTC',
            uid: 999,
            userPicture: ['../../../../assets/images/avatar.svg'],
            uuid: 'mock',
            viewUserUrl: 'mock',
        },
    ],
    mediaList: [
        {
            username: 'mock User',
            created: 1258745,
            filemime: 'ima',
            filename: 'Media Example Mock',
            uri: '../../../../assets/images/default.svg',
            filesize: 3124
        },
        {
            username: 'mock User',
            created: 1258745,
            filemime: 'ima',
            filename: 'Media Example Mock',
            uri: '../../../../assets/images/default.svg',
            filesize: 3124
        },
        {
            username: 'mock User',
            created: 1258745,
            filemime: 'ima',
            filename: 'Media Example Mock',
            uri: '../../../../assets/images/default.svg',
            filesize: 3124
        }
    ],
    pieChart: [],
    deviceSession: {
        value: [102, 110, 35 ],
        name: ['Tablet', 'Desktop', 'Mobile']
    },
    top5: [
        {
            title: 'Demo title1',
            username: {
                name: 'Demo user'
            },
            changed: 1533712362
        },
        {
            title: 'Demo title2',
            username: {
                name: 'Demo user'
            },
            changed: 1533712362
        },
        {
            title: 'Demo title3',
            username: {
                name: 'Demo user'
            },
            changed: 1533712362
        },
        {
            title: 'Demo title4',
            username: {
                name: 'Demo user'
            },
            changed: 1533712362
        },
        {
            title: 'Demo title5',
            username: {
                name: 'Demo user'
            },
            changed: 1533712362
        }
    ],
    activeUsers: '256',
    newestUsers: '100',
    contentStories: [
        {
            name: 'All Stories',
            value: {
                all_stories: 100
            }
        },
        {
            name: 'Blog',
            value: {
                count: 482,
                arrow: 'greater'
            }
        },
        {
            name: 'News',
            value: {
                count: 332,
                arrow: 'greater'
            }
        },
        {
            name: 'Events',
            value: {
                count: 241,
                arrow: 'smaller'
            }
        },
        {
            name: 'Stuff',
            value: {
                count: 126,
                arrow: 'none'
            }
        },
        {
            name: 'Promo',
            value: {
                count: 53,
                arrow: 'none'
            }
        },
        {
            name: 'Other',
            value: {
                other: 34
            }
        }
    ],
    browserSession: {
        value: [170, 70, 50, 150 ],
        name: ['Chrome', 'Safari', 'Firefox', 'Other']
    },
    rushHours: {
        value: [120, 200, 400, 210, 610]
    }
};

export const availableWidgets: WidgetModel[] = [
    {
        type: 'chart',
        weight: 0,
        name: 'Session by device',
        key: 'deviceSession',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },
    {
        type: 'content',
        weight: 0,
        name: 'Content',
        key: 'contentList',
        dataStatic: true,
        id: 0,
        viewMoreLink: '/content',
        viewMore: true,
        expand: false
    },
    {
        type: 'comment',
        weight: 0,
        name: 'Comments',
        key: 'commentList',
        dataStatic: true,
        id: 0,
        viewMoreLink: '/comments',
        viewMore: true,
        expand: false
    },
    {
        type: 'user',
        weight: 0,
        name: 'Users',
        key: 'usersList',
        dataStatic: true,
        id: 0,
        viewMoreLink: '/users',
        viewMore: true,
        expand: false
    },
    {
        type: 'user',
        weight: 0,
        name: 'Active Users',
        key: 'activeUsers',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },
    {
        type: 'user',
        weight: 0,
        name: 'New Users',
        key: 'newestUsers',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },
    {
        type: 'content',
        weight: 0,
        name: 'Top 5 Content',
        key: 'top5',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },
    {
        type: 'content',
        weight: 0,
        name: 'Media',
        key: 'mediaList',
        dataStatic: true,
        id: 0,
        viewMoreLink: '/media',
        viewMore: true,
        expand: true
    },
    {
        type: 'activity',
        weight: 0,
        name: 'Site visitors',
        key: 'pieChart',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },
    {
        type: 'content',
        weight: 0,
        name: 'Content Stories',
        key: 'contentStories',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },
    {
        type: 'chart',
        weight: 0,
        name: 'Session by Browser',
        key: 'browserSession',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: true
    },
    {
        type: 'chart',
        weight: 0,
        name: 'Rush hours',
        key: 'rushhours',
        dataStatic: true,
        id: 0,
        viewMore: false,
        expand: false
    },

];
