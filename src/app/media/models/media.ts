/**
 *Class that defines the type of parameters.
 */
export class Media {
    /**
     *Displays the author of the media content.
     */
    username: any;
    /**
     *Shows the time and date when the content was created.
     */
    created: number;
    /**
     *Shows us the extension of the file.
     */
    filemime: string;
    /**
     *Shows us the name of the file.
     */
    filename: string;
    /**
     *Shows the file location.
     */
    uri: string;
    /**
     *Provides the size of the uploaded file.
     */
    filesize: number;
}