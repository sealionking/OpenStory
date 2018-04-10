/**
 *Class that defines the type of parameters.
 */
export class Comment {
    /**
     *Displays the author of the comment.
     */
    username: string;
    /**
     *Shows the content of the comment.
     */
    commentBody: string;
    /**
     * Shows the type of the comment.
     */
    commentType: string;
    /**
     * Shows the url to the comment.
     */
    viewUrl: string;
    /**
     * Shows the date and time when the comment was modified.
     */
    changed: string;
    /**
     * Shows the date and time when the comment was created.
     */
    created: number;
    /**
     *Shows the entity id that the comment is bind to.
     */
    entityId: string;
    /**
     *Shows the id of the node.
     */
    entityType: string;
    /**
     *Shows the Id of the comment.
     */
    id: string;
    /**
     *Shows the status that the comment is in.
     */
    status: any;
    /**
     * Shows the title of the comment.
     */
    subject: string;
    /**
     * Sows the type of the comment.
     */
    type: string;
    /**
     * Shows the Users ID.
     */
    userid: string;
}
