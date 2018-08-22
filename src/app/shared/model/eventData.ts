/**
 * Class used to communicate with the server via socket IO
 */
export class EventD {
    eventType?: any;
    /**
     * Used to send or receive events from the server
     */
    event: any;
    /**
     * Data transmitted to or from the server
     */
    data: any;
}
